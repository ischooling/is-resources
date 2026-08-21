var PROFILE_RESPONSE_DATA;
var PROFILE_RESPONSE_UPDATED_DATA;
var PROFILE_PROGRESS_REPORT_CURRENT_DAYS = null;
var PROFILE_PROGRESS_REPORT_PENDING_DAYS = null;
var SHOW_RESERVE_SEAT_SECTION = true;
var SHOW_STUDENT_REGISTRATION_SECTION = false;
async function renderStudentProfilePage(extraParam) {
    COMMUNICATION_APPEND_ROW = "";
    if ($("#profileFielddModal").length > 0) {
        $("#profileFielddModal").remove();
    }
    PROFILE_RESPONSE_DATA = await getDashboardDataBasedUrlAndPayload(true, true, 'profile-view-content-new?payload=' + extraParam, '');
    console.log(PROFILE_RESPONSE_DATA)
    if (Object.keys(PROFILE_RESPONSE_DATA.profileData).length < 1) {
        showMessageTheme2(0, "No Data found")
    } else {
        var data = PROFILE_RESPONSE_DATA.profileData.studentProfile;
        PROFILE_RESPONSE_UPDATED_DATA = data;
        try {
            var gradeId = data && data[2] ? parseInt(data[2].gradeId) : 0;
            var marksPublishedStatus = data && data[2] ? data[2].marksPublishedStatus : "N";
            var lp = data && data[2] && data[2].learningProgramValue ? (data[2].learningProgramValue + "").toUpperCase() : "";
            SHOW_RESERVE_SEAT_SECTION = !(gradeId === 7 && lp !== "ONE_TO_ONE_FLEX" && PROFILE_RESPONSE_DATA .standardStatus == 0);
            var isAdminSideUser = (USER_ROLE != "STUDENT" && USER_ROLE != "PARENT" && USER_ROLE != "TEACHER");
            if (PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA.rightToEdit === false) {
                isAdminSideUser = false;
            }
            SHOW_STUDENT_REGISTRATION_SECTION = isAdminSideUser && !(lp.includes("BATCH") || lp.includes("GROUP"));
        } catch (e) {
            SHOW_RESERVE_SEAT_SECTION = true;
            SHOW_STUDENT_REGISTRATION_SECTION = false;
        }
        console.log(data);
        if ($("#cropModal").length < 1) {
            $("body").append(cropperImageModalContent());
        }
        if ($("#confirmSaveModal").length > 0) {
            $("#confirmSaveModal").remove();
        }
        if ($("#uploadFile").length > 0) {
            $("#uploadFile").remove();
        }
        if ($("#progressReportConfirmModal").length > 0) {
            $("#progressReportConfirmModal").remove();
        }
        $("body").append(viewUploadFileModal() + changeLearingProgramGradeModalContent(data[2]) + confirmSaveModalContent(PROFILE_RESPONSE_DATA) + getCommunicationAttchFileModal() + profileProgressReportConfirmModal());
        // if(USER_ROLE == "STUDENT"){

        // }else{

        // }
        var html = getStudentProfilePageContent(data);
        $("#dashboardContentInHTML").hide();
        $("#dashboardContentInHTMLAdditional").html(getProfilePageHeader() + html).show();
        checkJoinedSports(data[4]);
        profileViewPageLoadEvent(data);
        if (USER_ROLE == "STUDENT" && typeof openWithdrawalRequestForStudent === "function") {
            initStudentWithdrawalSection();
        }
        setTimeout(function () {
            SAVE_BLUK_PROFILE_DATA = [];
        }, 2000)
    }
}

/**
 * Shows the student's own "Withdrawal Requests" section only when the student has no
 * parent account (checked server-side via PARENT_STUDENT_MAPPING); otherwise the parent
 * handles it and the tab/section are removed.
 */
async function initStudentWithdrawalSection() {
    try {
        var resp = await callCommonAjax({
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/student/withdrawal-eligibility",
            body: {},
            global: false,
            showMessage: false
        });
        if (resp && resp.status === "3") { redirectLoginPage(); return; }
        if (resp && resp.status === "1" && resp.selfEligible === true) {
            openWithdrawalRequestForStudent(USER_ID);
        } else {
            $(".wd-student-nav").remove();
            $("#withdrawal_request_information").remove();
        }
    } catch (e) {
        $(".wd-student-nav").remove();
        $("#withdrawal_request_information").remove();
    }
}

function getProfilePageHeader() {
    var html =
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-user text-primary"></i>
                    </div>
                    <div>Profile</div>
                </div>
                <div class="page-title-actions">
                    <a href="javascript:void(0);" onclick="backToMain(\'manageAdvanceStudentContent\', 'uploadFile');" class="btn btn-dark rounded"><i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>${USER_ROLE != "STUDENT" && PROFILE_RESPONSE_DATA.rightToEdit ? 'Back Manage User List' : 'Back'}</a>
                    <a href="javascript:void(0);" onclick="saveBulkProfileData(\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\',\'student\')" class="btn btn-success rounded"><i class="fa fa-save mr-1" aria-hidden="true"></i>Bulk Save</a>
                </div>
            </div>
        </div>`;
    return html;
}

function getStudentProfilePageContent(data) {
    var html =
        `<div class="main-card" id="profilePageView">
            <div class="full">
                <form method="post" autocomplete="off" class="row" action="javascript:void(0);" id="profileForm">
                    <input type="hidden" name="preferedTimeSavedByStudentCount" id="preferedTimeSavedByStudentCount" value="1">
                    <input type="hidden" name="saveType" id="saveType" value="STUDENT_PROFILE">
                    <input type="hidden" name="timeStuStandardId" id="timeStuStandardId" value="${data[2].studentStandardDTO[0].studentStandardId}"/>
                    <input type="hidden" name="regstrationType" id="regstrationType" value="${data[2].learningProgramValue}"/>
                    <input type="hidden" name="chooseDateSystemTrainingDate" id="chooseDateSystemTrainingDate" value="${data[2].academicYearStartDate}"/>
                    <div class="col-xl-3 col-lg-4 col-md-12 col-sm-12 col-12">
                        <div class="profile-picture-wrapper bg-primary rounded-10 p-3">
                            <div class="profile-picture d-flex align-items-center">
                                    <div class="text-white text-center">
                                    <div class="widget-content-wrapper flex-fill circle-percentage">
                                        <div class="widget-content-left mr-3">
                                            <div class="progress-circle-wrapper">
                                                <div class="circle-progress circle-progress-primary profile-progress-bar">
                                                    <small class="font-size-md justify-content-center">
                                                        <div class="user-img admin-proifle m-0 box-shadow-none text-center m-1 d-flex align-items-center justify-content-center" style="max-width:65px;border:1px solid !important;height:65px">
                                                            <img id="profileImageStudent" name="profileImageStudent" class="user profile-pic" src="${data[0].profilePic}" alt="image" title="Profile Image" thumbtype="" style="max-width:60px;width:60px; height:60px;">
                                                        </div>    
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-center font-weight-bold font-size-lg" id="circle-percentage-text"></div>
                                    </div>
                                </div>
                                <div class="pl-0">
                                    <div class="profile-name text-white font-weight-semi-bold font-size-lg userNameLabel">${data[0].firstName} ${data[0].lastName}</div>
                                    <div class="edit-user-img trans5s w-fit-content" style="position: relative;bottom: 0;opacity: 1;visibility: visible">
                                        <input class="file-input w-100" type="file" name="profilePicture" id="profilePicture" onchange="cropImage(event, \'profilePicture\', \'profileImageStudent\', \'Profile Image\', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\', false)" style="height:22px;">
                                        <span class="upload-img-btn bg-transparent text-white p-0 text-left">Change Profile Photo</span>
                                    </div>
                                </div>
                            </div>   
                        </div>`;
    html += profileSectionTabs();
    html += `</div>
                    <div class="col-xl-9 col-lg-8 col-md-12 col-sm-12 col-12 overflow-y-auto overflow-x-hidden profile-right-section position-relative" style="will-change:scroll-position">
                            <input type="hidden" id="timezoneInput" value="${data[0].timezoneName}" />`;
    html += personalInformation(data[0]);
    html += guardianInformation(data[1]);
    html += academicInformation(data[2]);
    html += classesPreferredTimingInformation(data[3].prefTimeList, data[3].customFields)
    html += sportAndExtraCurricularInformation(data[4]);
    if (USER_ROLE != "PARENT" && USER_ROLE != "STUDENT" && SHOW_RESERVE_SEAT_SECTION) {
        html += reserveAnEnrollmentSeatAdvCourseInformation(data[5], PROFILE_RESPONSE_DATA.standardStatus, PROFILE_RESPONSE_DATA.enrollmentDetails)
    }
    if (USER_ROLE != "STUDENT") {
        html += `<div class="full profile-section" id="communicationLogDIV"></div>`
    }
    html += `<div class="full profile-section" id="studentEmailDIV"></div>`
    html += `<div class="full profile-section" id="zoomRegistrationDIV"></div>`
    if (USER_ROLE == "STUDENT") {
        html += `<div class="card profile-section wd-student-section" id="withdrawal_request_information">
            <div class="card-body">
                <div class="col-12 p-0 mb-2">
                    <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                        <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px"><i class="fa fa-sign-out font-12"></i></span>
                        <span class="flex-grow-1">7. Withdrawal Request</span>
                    </h5>
                </div>
                <div class="wd-scope" id="withdrawalRequestBody"></div>
            </div>
        </div>`;
    }
    // html+=communicationLogInformation(data)
    html += `
                    </div>
                </form>
            </div>    
        </div>`;
    return html;
}

function profileSectionTabs() {
    var commIndex = (USER_ROLE != "STUDENT" && SHOW_RESERVE_SEAT_SECTION) ? "7" : "6";
    var emailIndex = (USER_ROLE != "STUDENT" && SHOW_RESERVE_SEAT_SECTION) ? "8" : "7";
    var registrationIndex = (parseInt(emailIndex, 10) + 1).toString();
    var html =
        `<div class="full mt-3">
        <ul class="m-0 p-0">
            <li class="bg-white border border-top-left-rounded  overflow-hidden">
                <a href="#personal_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light  profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">1. Personal Information</div>
                    <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                        <div class="widget-content-left">
                            <div class="progress-circle-wrapper">
                                <div class="circle-progress circle-progress-primary personal-info-bar d-inline-block">
                                    <small class="font-size-md text-dark"></small>
                                </div>
                            </div>
                        </div>
                    </div>    
                </a>
            </li>
            <li class="bg-white border border-top-left-rounded">
                <a href="#guardian_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover  profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">2. Parent/Guardian Information</div>
                    <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                        <div class="widget-content-left">
                            <div class="progress-circle-wrapper">
                                <div class="circle-progress circle-progress-primary guardian-info-bar d-inline-block">
                                    <small class="font-size-md text-dark"></small>
                                </div>
                            </div>
                        </div>
                    </div>    
                </a>
            </li>
            <li class="bg-white border border-top-left-rounded">
                <a href="#academic_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover  profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">3. Academic Information</div>
                    <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                        <div class="widget-content-left">
                            <div class="progress-circle-wrapper">
                                <div class="circle-progress circle-progress-primary academic-info-bar d-inline-block">
                                    <small class="font-size-md text-dark"></small>
                                </div>
                            </div>
                        </div>
                    </div>    
                </a>
            </li>
            <li class="bg-white border border-top-left-rounded">
                <a href="#classes_Preferred_Timing_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover  profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">4. Live Classes - Preferred Timing</div>
                    <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                        <div class="widget-content-left">
                            <div class="progress-circle-wrapper">
                                <div class="circle-progress circle-progress-primary live-classes-bar d-inline-block">
                                    <small class="font-size-md text-dark"></small>
                                </div>
                            </div>
                        </div>
                    </div>    
                </a>
            </li>
            <li class="bg-white border border-top-left-rounded">
                <a href="#sport_and_Extra_curriculars_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">5. Sport & Extra Curriculars</div>
                    <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                        <div class="widget-content-left">
                            <div class="progress-circle-wrapper">
                                <div class="circle-progress circle-progress-primary sport-curriculars-bar d-inline-block">
                                    <small class="font-size-md text-dark"></small>
                                </div>
                            </div>
                        </div>
                    </div>    
                </a>
            </li>
            ${(USER_ROLE != "STUDENT" && SHOW_RESERVE_SEAT_SECTION) ?
            `<li class="bg-white border border-top-left-rounded">
                    <a href="#reserve_An_Enrollment_Seat_Adv_Course_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">${USER_ROLE != "STUDENT" ? '6' : ''}. Reserve an Enrollment Seat & Advance Course Fee</div>
                        <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                            <div class="widget-content-left">
                                <div class="progress-circle-wrapper">
                                    <div class="circle-progress circle-progress-primary d-inline-block">
                                        <small class="font-size-md text-dark"></small>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </a>
                </li>`: ``
        }
             ${USER_ROLE != "STUDENT" ?
            `<li class="bg-white border border-top-left-rounded overflow-hidden">
                    <a href="#communicationLogDIV" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">${USER_ROLE == "STUDENT" ? '6' : commIndex}. Communication Log</div>
                        <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                            <div class="widget-content-left">
                                <div class="progress-circle-wrapper">
                                    <div class="circle-progress circle-progress-primary d-inline-block">
                                        <small class="font-size-md text-dark"></small>
                                    </div>
                                </div>
                            </div>
                        </div>    
                    </a>
                </li>`: ``
        }
            <li class="bg-white border border-top-left-rounded ${SHOW_STUDENT_REGISTRATION_SECTION || USER_ROLE == "STUDENT" ? '' : 'rounded-bottom-left-10 rounded-bottom-right-10'} overflow-hidden">
                <a href="#studentEmailDIV" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">${USER_ROLE == "STUDENT" ? '6' : emailIndex}. Student School Email Account</div>
                    <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                        <div class="widget-content-left">
                            <div class="progress-circle-wrapper">
                                <div class="circle-progress circle-progress-primary d-inline-block">
                                    <small class="font-size-md text-dark"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </li>
            ${SHOW_STUDENT_REGISTRATION_SECTION ?
                `<li class="bg-white border border-top-left-rounded ${USER_ROLE == "STUDENT" ? '' : 'rounded-bottom-left-10 rounded-bottom-right-10'} overflow-hidden">
                    <a href="#zoomRegistrationDIV" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">${USER_ROLE == "STUDENT" ? '6' : registrationIndex}. Enable Registration</div>
                        <div class="widget-content-wrapper flex-fill circle-percentage text-right">
                            <div class="widget-content-left">
                                <div class="progress-circle-wrapper">
                                    <div class="circle-progress circle-progress-primary d-inline-block">
                                        <small class="font-size-md text-dark"></small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>
                </li>`
                : ``}
            ${USER_ROLE == "STUDENT" ?
                `<li class="bg-white border border-top-left-rounded rounded-bottom-left-10 rounded-bottom-right-10 overflow-hidden wd-student-nav">
                    <a href="#withdrawal_request_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">7. Withdrawal Request</div>
                    </a>
                </li>`
                : ``}
        </ul>
    </div>`;
    return html;
}

function personalInformation(data) {
    var html =
        `<div class="card profile-section" id="personal_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-user font-12"></i>    
                            </span>
                            <span>1. Personal Information</span>
                        </h5>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${firstNameElement(data.firstName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${middleNameElement(data.middleName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${lastNameElement(data.lastName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${genderElement(data.gender)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${dobElement(data.dob)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${phoneNumberElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${altPhoneNumberElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${studentEmailIdElement(data.studentEmailId)}
                    </div>    
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${altEmailIdElement(data.altEmailId)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${countryElement(data.country)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${stateElement(data.state)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${cityElement(data.city)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${timezoneElement(data.timezone)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${nationalityElement(data)}
                    </div>
                    <div class="col-12">
                        ${addressElement(data.address)}
                    </div>
                    <div class="col-12 mt-2">
                        ${hobbiesContent(data.hobbies)}
                    </div>
                    <div class="col-12 mt-2">
                        ${addOtherHobbiesContent(data)}
                    </div>
                    <div class="col-12 mt-2">
                        ${socialMedaiLinksContent(data.socialMedia, true)}
                    </div>
                    <div class="form-row mt-2 w-100">`;
                        $.each(data.customFields, function(index, item){
                            html+=
                            `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                ${renderDynamicFieldByUserID(item, item.fieldValue, 0, "PROFILE_PAGE")}                    
                            </div>`;
                        });
                    html+=`</div>
                </div>    
            </div>    
        </div>`;
    return html;
}


// Personal Information Form Elements Start Here

function firstNameElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="firstName" id="firstName" value="${data != "" && data != undefined ? data : ''}" placeholder=" " onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this, 'firstName',\'${data != "" && data != undefined ? data : ''}\','input', '','', 0, 'firstName')">
            <label for="firstName">First Name <span class="text-danger">*</span></label>
            <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('firstName', 'firstName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('firstName',\'${data != "" && data != undefined ? data : ''}\','input','firstName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
    </div>`;
    return html;
}

function middleNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="middleName" id="middleName" value="${data != "" && data != undefined ? data : ''}" placeholder=" " onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this, 'middleName',\'${data != "" && data != undefined ? data : ''}\','input', '','', 0,'middleName')">
        <label for="middleName">Middle Name <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('middleName', 'middleName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('middleName',\'${data != "" && data != undefined ? data : ''}\','input','middleName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
            </div>
        </div>
    </div>`;
    return html;
}

function lastNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="lastName" id="lastName" value="${data != "" && data != undefined ? data : ''}" placeholder=" " onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this, 'lastName',\'${data != "" && data != undefined ? data : ''}\','input', '','', 0,'lastName')">
                <label for="lastName">Last Name <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('lastName', 'lastName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('lastName',\'${data != "" && data != undefined ? data : ''}\','input','lastName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
            </div>
        </div>
    </div>`;
    return html;
}

function genderElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <select id="gender" name="gender" class="form-control form-control-sm group-append-hide-input bar_count" onchange="controlEditField(this, 'gender',\'${data != "" && data != undefined ? data : ''}\','input','','', 0,'gender')">
            ${getGenderContent()}   
        </select>
        <label for="gender">Gender<span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('gender', 'gender', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('gender',\'${data != "" && data != undefined ? data : ''}\','input','gender')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
            </div>
        </div>
    </div>`;
    return html;
}

function dobElement(data) {
    var html =
    `<div class="custom-field-scope">
        <div class="input-group custom-field mb-2 mt-4 p-0">
            <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="dob" id="dob" value="${data != "" && data != undefined ? data : ''}" placeholder=" " autocomplete="off" readonly keydown="return false" ${USER_ROLE != "STUDENT" && PROFILE_RESPONSE_DATA.rightToEdit ? '' : 'disabled'} onchange="controlEditField(this,'dob',\'${data != "" && data != undefined ? data : ''}\','input', '','', 0,'dob')">
            <label for="dob">Date of Birth<span class="text-danger">*</span></label>`;
            if(USER_ROLE != "STUDENT") {
                html +=
                `<div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                    <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('dob', 'dob', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                        <i class="fa fa-check"></i>
                    </a>
                    <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center" onclick="cancelChanges('dob',\'${data != "" && data != undefined ? data : ''}\','input','dob')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                        <i class="fa fa-times"></i>
                    </a>
                </div>`;
            }
        html += `</div>
    </div>`;
    return html;
}

function phoneNumberElement(data) {
    var html =
        `<div class="custom-field-scope" style="position:relative;">
    <div class="d-flex flex-wrap" style="position:absolute;right:0;top:-24px;z-index:6;">
        <div class="custom-checkbox custom-control w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="phoneNumberWhatsAppStatus" class="custom-control-input" ${data.phoneNumberWhatsAppStatus != "N" && data.phoneNumberWhatsAppStatus != undefined ? 'checked' : ''} data-status="${data.phoneNumberWhatsAppStatus != "N" && data.phoneNumberWhatsAppStatus != undefined ? true : false}" onchange="availableOnWhatsApp(this, 'phoneNumber',\'${data.phoneNumber != "" && data.phoneNumber != undefined ? data.phoneNumber : ""}\','input',\'${data.phoneNumberCountryCode != "" && data.phoneNumberCountryCode != undefined ? data.phoneNumberCountryCode : "us"}\',0)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="phoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
                Available on WhatsApp
            </label>
        </div>    
    </div>
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="phoneNumber" id="phoneNumber" value="${data.phoneNumber != "" && data.phoneNumber != undefined ? data.phoneNumber : ""}" autocomplete="off" placeholder=" " data-idList="phoneNumber_phoneNumberWhatsAppStatus_phoneNumberCountryCode" onkeydown="return M.digit(event);"  onkeyup="controlEditField(this,'phoneNumber',\'${data.phoneNumber != "" && data.phoneNumber != undefined ? data.phoneNumber : ""}\','inputPhone', 'phoneNumberWhatsAppStatus',\'${data.phoneNumberCountryCode != "" && data.phoneNumberCountryCode != undefined ? data.phoneNumberCountryCode : ""}\', 0,'phoneNumber')">
        <label for="phoneNumber">Phone <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('phoneNumber', 'phoneNumber', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('phoneNumber',\'${data.phoneNumber != "" && data.phoneNumber != undefined? data.phoneNumber:""}\','inputPhone','phoneNumber','phoneNumberWhatsAppStatus', 0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
    </div>
    </div>
</div>`;
    return html;
}

function altPhoneNumberElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="d-flex flex-wrap">
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto d-inline-flex align-items-center">
            <input type="checkbox" id="altPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.altPhoneNumberWhatsAppStatus != "N" && data.altPhoneNumberWhatsAppStatus != undefined ? 'checked' : ''} data-status="${data.altPhoneNumberWhatsAppStatus != "N" && data.altPhoneNumberWhatsAppStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'altPhoneNumber',\'${data.altPhoneNumber != "" && data.altPhoneNumber != undefined ? data.altPhoneNumber : ""}\','input',\'${data.altPhoneNumberCountryCode != "" && data.altPhoneNumberCountryCode != undefined ? data.altPhoneNumberCountryCode : "us"}\',0)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="altPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
                Available on WhatsApp
            </label>
        </div>    
    </div>
    <div class="input-group position-relative custom-field mb-2 mt-1 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="altPhoneNumber" id="altPhoneNumber" value="${data.altPhoneNumber != "" && data.altPhoneNumber != undefined ? data.altPhoneNumber : ""}" autocomplete="off" placeholder=" " data-idList="altPhoneNumber_altPhoneNumberWhatsAppStatus_altPhoneNumberCountryCode" onkeydown="return M.digit(event);" onkeyup="controlEditField(this,'altPhoneNumber',\'${data.altPhoneNumber != "" && data.altPhoneNumber != undefined ? data.altPhoneNumber : ""}\','inputPhone', 'altPhoneNumberWhatsAppStatus',\'${data.altPhoneNumberCountryCode != "" && data.altPhoneNumberCountryCode != undefined ? data.altPhoneNumberCountryCode : ""}\', 0,'altPhoneNumber')">
        <label for="altPhoneNumber" style="left:12px;">Alternate Phone</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('altPhoneNumber', 'altPhoneNumber', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('altPhoneNumber',\'${data.altPhoneNumber !="" && data.altPhoneNumber != undefined ? data.altPhoneNumber:""}\','inputPhone','altPhoneNumber', 'altPhoneNumberWhatsAppStatus',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function studentEmailIdElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="studentEmailId" id="studentEmailId" value="${data != "" && data != undefined ? data : ""}" ${USER_ROLE != "STUDENT" && PROFILE_RESPONSE_DATA.rightToEdit ? '' : 'disabled'} placeholder=" " autocomplete="off" style="padding-left:6px !important; padding-right:2px !important;" onkeyup="controlEditField(this,'studentEmailId',\'${data != "" && data != undefined ? data : ""}\','input', '','', 0,'studentEmailId')">
        <label for="studentEmailId">Email <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('studentEmailId', 'studentEmailId', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('studentEmailId',\'${data != "" && data != undefined ? data : ""}\','input','studentEmailId')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function altEmailIdElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="altEmailId" id="altEmailId" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" style="padding-left:6px !important; padding-right:2px !important;" onkeyup="controlEditField(this,'altEmailId',\'${data != "" && data != undefined ? data : ""}\','input', '','', 0,'altEmailId')">
        <label for="altEmailId">Alternate Email</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('altEmailId', 'altEmailId', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('altEmailId',\'${data != "" && data != undefined ? data : ""}\','input','altEmailId')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function countryElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="country" name="country" class="form-control form-control-sm group-append-hide-input bar_count" data-country="country_state_city" onchange="controlEditField(this,'country',\'${data != "" && data != undefined ? data : ""}\','select', '','', 0,'countrySection')"></select>
        <label for="country">Country <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('country', 'countrySection',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('country',\'${data != "" && data != undefined ? data : ""}\','countrySection','countrySection')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function stateElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="state" name="state" class="form-control form-control-sm group-append-hide-input bar_count" data-country="state_city" onchange="controlEditField(this,'state',\'${data != "" && data != undefined ? data : ""}\','select', '','', 0,'countrySection')"></select>
        <label for="state">State <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('country', 'countrySection',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('state',\'${data != "" && data != undefined ? data : ""}\','countrySection','countrySection')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function cityElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="city" name="city" class="form-control form-control-sm group-append-hide-input bar_count" data-country="city" onchange="controlEditField(this,'city',\'${data != "" && data != undefined ? data : ""}\','select', '','', 0,'countrySection')"></select>
        <label for="city">City <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('country', 'countrySection',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('city',\'${data != "" && data != undefined ? data : ""}\','countrySection','countrySection')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function timezoneElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="timezone" name="timezone" class="form-control form-control-sm group-append-hide-input bar_count"  onchange="controlEditField(this,'timezone',\'${data != "" && data != undefined ? data : ""}\','select', '','', 0,'timezone')"></select>
        <label for="timezone">Timezone<span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('timezone', 'timezone',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','true',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('timezone',\'${data != "" && data != undefined ? data : ""}\','input','timezone')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function nationalityElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="nationality" name="nationality" class="form-control form-control-sm group-append-hide-input bar_count" onchange="controlEditField(this,'nationality',\'${data.nationalityId != "" && data.nationalityId != undefined ? data.nationalityId : ""}\','select', '','', 0,'nationality')"></select>
        <label for="nationality">Nationality <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('nationality', 'nationality',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','true',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('nationality',\'${data.nationalityId != "" && data.nationalityId != undefined ? data.nationalityId : ""}\','select','nationality')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function addressElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="address" id="address" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'address',\'${data != "" && data != undefined ? data : ""}\','input', '','', 0,'address')">
        <label for="address">Address <span class="text-danger">*</span></label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('address', 'address',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('address',\'${data != "" && data != undefined ? data : ""}\','input','address')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function hobbiesContent(data) {
    var html =
        `<div class="d-flex flex-sm-nowrap flex-wrap">
        <span class="font-weight-semi-bold">Hobbies:&nbsp;</span>
        <div class="hobbies-wrapper d-inline-flex flex-wrap bar_count">`;
    if (data.length > 0) {
        $.each(data, function (i, v) {
            if ("H_" + v.id != "H_Other") {
                // var key = Object.keys(v);
                // key=key[0];
                html +=
                    `<div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mr-3 mb-2 cursor hobbie-wrapper">
                            <input type="checkbox" id="${v.id}" class="custom-control-input group-append-hide-input" ${v.status == "Y" ? 'checked' : ''} data-hobbie-keyId="${v.hobbiesId}" data-hobbie-label="${v.hobbiesLabel}" check-status="${v.status == "Y" ? true : false}" onchange="controlEditField(this,this,${v.status == "Y" ? true : false},'hobbies', '','', 0,'hobbies')">
                            <label class="custom-control-label cursor" for="${v.id}">${v.hobbiesLabel}</label>
                        </div>`;
            }

        });
    }
    html += `</div>
    </div>
    <div class="w-100 text-right" id="saveHobbiesWrapper" style="display:none">
        <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('hobbies', 'hobbies',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)">Save</a>
        <a href="javascript:void(0)" class="btn btn-sm btn-danger mx-1" onclick="cancelHobbies()">Cancel</a>
    </div>`;
    return html;
}

function addOtherHobbiesContent(data) {
    var html =
        `<a href="javascript:void(0)" class="text-primary text-decoration-none addmoreHobbiesBtn" onclick="addmoreHobbies(this, 'add-other-hobbies-wrapper')">
        <i class="fa fa-plus"></i>&nbsp;
        Add other hobbies    
    </a>
    <div class="form-row add-other-hobbies-wrapper" style="display:none">
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
            <input type="text" id="addOtherHobbies" name="addOtherHobbies" class="form-control form-control-sm" value="" />
        </div>    
        <div class="col-xl-8 col-lg-8 col-md-6 col-sm-12 col-12">
            <button type="button" class="btn btn-sm btn-primary" onclick="addOtherHobbiesfun('add-other-hobbies-wrapper', 'addmoreHobbiesBtn')">Add</button>
            <button type="button" class="btn btn-sm btn-danger" onclick="cancelOtherHobbiesfun('add-other-hobbies-wrapper', 'addmoreHobbiesBtn')">Cancel</button>
        </div>    
    </div>
    `;
    return html;
}

function socialMedaiLinksContent(data, addmoreSocialLinksFlag) {
    var socialMediaOrder = {
        "Instagram": 1,
        "YouTube": 2,
        "LinkedIn": 3,
        "Facebook": 4,
        "Twitter": 5,
        "TikTok": 6,
        "Telegram": 7
    };
    if (data && data.length > 0) {
        data = data.slice().sort(function (a, b) {
            var orderA = socialMediaOrder[a.socMedLabel] || 999;
            var orderB = socialMediaOrder[b.socMedLabel] || 999;
            return orderA - orderB;
        });
    }
    var html =
        `<div class="form-row">
            <div class="col-12 mb-2">
                <span class="font-weight-semi-bold text-dark">Social Media Links</span>    
            </div> 
        </div> 
        <div class="form-row social-links-wrapper bar_count">`;
            if (data.length > 0) {
                html+=`${getSocialMediaFields(data)}`
            }
        html += `</div>`;
    if(addmoreSocialLinksFlag){
        html+=`<a href="javascript:void(0)" class="text-primary text-decoration-none addmoreSocialLinksBtn" onclick="addmoreSocialLinks(this, 'add-other-socialLinks-wrapper')">
            <i class="fa fa-plus"></i>&nbsp;
            Add other social media link    
        </a>
        <div class="form-row add-other-socialLinks-wrapper" style="display:none">
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-2">
                <div class="custom-field-scope">
                    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
                        <input type="text" id="addOtherSocialMediaLinksTitle" name="addOtherSocialMediaLinksTitle" class="form-control form-control-sm" value="" placeholder=" "/>
                        <label for="addOtherSocialMediaLinksTitle">Link Title</label>
                    </div>
                </div>
            </div>
            <div class="col-xl-7 col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
                <div class="custom-field-scope">
                    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
                        <input type="text" id="addOtherSocialMediaLinksUrl" name="addOtherSocialMediaLinksUrl" class="form-control form-control-sm" value="" placeholder=" "/>
                        <label for="addOtherSocialMediaLinksUrl">URL</label>
                    </div>
                </div>
            </div>    
            <div class="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-12 text-right text-lg-left">
                <label class="font-weight-semi-bold w-100 d-lg-block d-none">&nbsp;</label>
                <button type="button" class="btn btn-sm btn-success" onclick="addOtherSocialLinks('add-other-socialLinks-wrapper', 'addmoreSocialLinksBtn')">Add</button>
            </div>    
        </div>`;
    }
    return html;
}


function getSocialMediaFields(data){
    var html=``;
    $.each(data, function (i, v) {
        if ((parseInt(v.socialMediaMasterId) > 0) || (v.status == "Y" && v.socialMediaMasterId == "0")) {
            html +=
            `<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 social-links-list-wrapper" id="social-links-list-wrapper${i}" data-social-title="${v.socMedLabel}">
                <div class="custom-field-scope">
                    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
                        ${getSocialIcon(v.socMedLabel) != undefined ? `<div class="input-group-prepend">
                            <span class="input-group-text bg-white">
                                ${getSocialIcon(v.socMedLabel).replace(/width=\"[^\"]*\"/i, 'width="16"').replace(/height=\"[^\"]*\"/i, 'height="16"')}
                            </span>
                        </div>` : ``}
                        <input type="text" class="form-control form-control-sm social-Links-url group-append-hide-input" style="flex:1 1 0;min-width:0;padding-right:72px;" data-social-media-id="${v.socialMediaMasterId}" name="${v.socMedLabel}URL" id="${v.socMedLabel}URL" value="${v[v.socMedLabel + '_URL'] != "" ? v[v.socMedLabel + '_URL'] : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this, \'${v.socMedLabel}URL\',\'${v[v.socMedLabel + '_URL'] != "" ? v[v.socMedLabel + '_URL'] : ""}\','socialMedia', '','', 0,\'socialMedia\')">
                        <label for="${v.socMedLabel}URL" style="${getSocialIcon(v.socMedLabel) != undefined ? 'left:48px;' : ''}">${v.socMedLabel == "Twitter" ? "X(Twitter)" : v.socMedLabel} Profile URL${v.socMedLabel == "Instagram" ? " *" : ""}</label>
                        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;" onclick="applyChanges(\'${v.socMedLabel}URL\', \'socialMedia\',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                                <i class="fa fa-check"></i>
                            </a>
                            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;" onclick="cancelChanges(\'${v.socMedLabel}URL\',\'${v[v.socMedLabel + '_URL'] != "" ? v[v.socMedLabel + '_URL'] : ""}\','input',\'socialMedia\')">
                                <i class="fa fa-times"></i>
                            </a>`;
                            if (v.socialMediaMasterId == 0) {
                                html +=
                                `<button class="btn btn-primary btn-sm" onclick="inactiveSocialMedia(\'${v.userSocialMediaId}\','SM', \'social-links-list-wrapper${i}\')">
                                    <i class="fa fa-trash"></i>
                                </button>`;
                            }
                            html += 
                        `</div>
                    </div>
                </div>
            </div>`;
        }
    });
    return html;
}
// Personal Information Form Elements End Here


// Guardian Information Form Elements Start Here
function guardianInformation(data) {
    var html =
        `<div class="card mt-3 profile-section" id="guardian_information" data-section-count="11">
            <div class="card-body">
                <div class="form-row mother-section">
                    <div class="col-12">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-users font-12"></i>    
                            </span>
                            <span>2. Parent/Guardian Information</span>
                        </h5>
                    </div>
                    <div class="col-12">
                        <h6 class="text-black font-weight-bold mb-2 mt-2">Mother's Detail</h6>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherNameElement(data.motherName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherMiddleNameElement(data.motherMiddleName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherLastNameElement(data.motherLastName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherPhoneNumberElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherEmailElement(data.motherEmail)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherFacebookElement(data.motherFacebook)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherCountryElement(data.motherCountry)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherOccupationElement(data.motherOccupation)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherDobElement(data.motherDob)}
                    </div>
                </div>
                <hr/>
                <div class="form-row father-section">
                    <div class="col-12">
                        <h6 class="text-black font-weight-bold mb-2">Father's Detail</h6>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherFirstNameElement(data.fatherFirstName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherMiddleNameElement(data.fatherMiddleName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherLastNameElement(data.fatherLastName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherPhoneNumberElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherEmailElement(data.fatherEmail)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherFacebookElement(data.fatherFacebook)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherCountryElement(data.fatherCountry)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherOccupationElement(data.fatherOccupation)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherDobElement(data.fatherDob)}
                    </div>
                </div>
                <hr/>
                <div class="form-row guardian-section">
                    <div class="col-12">
                        <h6 class="text-black font-weight-bold mb-2">Guardian's Details</h6>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianFirstNameElement(data.guardianFirstName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianMiddleNameElement(data.guardianMiddleName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianLastNameElement(data.guardianLastName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianPhoneNumberElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianEmailElement(data.guardianEmail)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianFacebookElement(data.gurdianFacebook)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianCountryElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianOccupationElement(data.guardianOccupation)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianDobElement(data.guardianDob)}
                    </div>
                </div>
                <hr/>
                <div class="form-row">
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${relationTypeElement(data.relationType)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${weddingAnniversaryDateElement(data.weddingAnniversaryDate)}
                    </div>
                    <div class="col-12">
                        ${preferredCommunicationContent(data)}
                    </div>
                </div>  
                <hr/>
                <div class="form-row mt-2 w-100">
                    ${communicationPreferredTimingInformation(data)}
                </div>
                <div class="form-row mt-2 w-100">`;
                    $.each(data.customFields, function(index, item){
                        html+=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${renderDynamicFieldByUserID(item, item.fieldValue, 1, "PROFILE_PAGE")}                    
                        </div>`;
                    });
                html+=`</div>    
            </div>
        </div>`;
    return html;
}

function motherNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="motherName" id="motherName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'motherName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'motherName')">
        <label for="motherName">First Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherName', 'motherName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherName',\'${data != "" && data != undefined ? data : ""}\','input','motherName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function motherMiddleNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="motherMiddleName" id="motherMiddleName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'motherMiddleName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'motherMiddleName')">
        <label for="motherMiddleName">Middle Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherMiddleName', 'motherMiddleName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherMiddleName',\'${data != "" && data != undefined ? data : ""}\','input','motherMiddleName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function motherLastNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="motherLastName" id="motherLastName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'motherLastName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'motherLastName')">
        <label for="motherLastName">Last Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherLastName', 'motherLastName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherLastName',\'${data != "" && data != undefined ? data : ""}\','input','motherLastName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function motherPhoneNumberElement(data) {
    var html =
        `<div class="d-flex flex-wrap">
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto mr-2 d-inline-flex align-items-center">
            <input type="checkbox" id="motherPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.motherPhoneNumberWhatsAppStatus != "N" && data.motherPhoneNumberWhatsAppStatus != undefined ? 'checked' : ''} data-status="${data.motherPhoneNumberWhatsAppStatus != "N" && data.motherPhoneNumberWhatsAppStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'motherPhoneNumber',\'${data.motherPhoneNumber}\','input',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode : "us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="motherPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
            </label>
        </div> 
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="motherPhoneEmergencyNumberStatus" class="custom-control-input" ${data.motherPhoneEmergencyNumberStatus != "N" && data.motherPhoneEmergencyNumberStatus != undefined ? 'checked' : ''} data-status="${data.motherPhoneEmergencyNumberStatus != "N" && data.motherPhoneEmergencyNumberStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'motherPhoneNumber',\'${data.motherPhoneNumber}\','input',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode : "us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="motherPhoneEmergencyNumberStatus">
                Emergency Contact
            </label>
        </div>    
    </div>
    <div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-1 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="motherPhoneNumber" id="motherPhoneNumber" value="${data.motherPhoneNumber != "" && data.motherPhoneNumber != undefined ? data.motherPhoneNumber : ""}" data-idList="motherPhoneNumber_motherPhoneNumberWhatsAppStatus_motherPhoneNumberCountryCode_motherPhoneEmergencyNumberStatus" autocomplete="off" placeholder=" " onkeydown="return M.digit(event);" onkeyup="controlEditField(this,'motherPhoneNumber',\'${data.motherPhoneNumber != "" && data.motherPhoneNumber != undefined ? data.motherPhoneNumber : ""}\','inputPhone', 'motherPhoneNumberWhatsAppStatus',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode : ""}\', 1, 'motherPhoneNumber','motherPhoneEmergencyNumberStatus')">
        <label for="motherPhoneNumber" style="left:12px;">Phone Number</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('motherPhoneNumber', 'motherPhoneNumber', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherPhoneNumber',\'${data.motherPhoneNumber != "" && data.motherPhoneNumber != undefined ?data.motherPhoneNumber:""}\','inputPhone','motherPhoneNumber', 'motherPhoneNumberWhatsAppStatus','motherPhoneEmergencyNumberStatus',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
    </div>`;
    return html;
}
function motherEmailElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="motherEmail" id="motherEmail" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" style="padding-left:6px !important; padding-right:2px !important;" onkeyup="controlEditField(this,'motherEmail',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'motherEmail')">
        <label for="motherEmail">Email</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherEmail', 'motherEmail', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherEmail',\'${data != "" && data != undefined ? data : ""}\','input','motherEmail')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function motherFacebookElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="motherFacebook" id="motherFacebook" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'motherFacebook',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'motherFacebook')">
        <label for="motherFacebook">Facebook</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherFacebook', 'motherFacebook', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherFacebook',\'${data != "" && data != undefined ? data : ""}\','input','motherFacebook')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function motherCountryElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="motherCountry" name="motherCountry" class="form-control form-control-sm group-append-hide-input bar_count" data-country="motherCountry" onchange="controlEditField(this,'motherCountry',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'motherCountry')"></select>
        <label for="motherCountry">Country</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('motherCountry', 'motherCountry',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherCountry',\'${data != "" && data != undefined ? data : ""}\','countrySectionParent','motherCountry')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function motherOccupationElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" data-Occupationparent="Mother" name="motherOccupation" id="motherOccupation" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'motherOccupation',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'occupation')">
        <label for="motherOccupation">Occupation</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherOccupation', 'occupation', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherOccupation',\'${data != "" && data != undefined ? data : ""}\','input','occupation')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function motherDobElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" data-dobparent="Mother" name="motherDob" id="motherDob" value="${data != "" && data != undefined ? data : ''}" placeholder=" " autocomplete="off" readonly keydown="return false" onchange="controlEditField(this,'motherDob',\'${data != "" && data != undefined ? data : ''}\','input', '','', 1,'parentDob')">
        <label for="motherDob">Date of Birth</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('motherDob', 'parentDob', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('motherDob',\'${data != "" && data != undefined ? data : ''}\','input','parentDob')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function fatherFirstNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="fatherFirstName" id="fatherFirstName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'fatherFirstName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'fatherFirstName')">
        <label for="fatherFirstName">First Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherFirstName', 'fatherFirstName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherFirstName',\'${data != "" && data != undefined ? data : ""}\','input','fatherFirstName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function fatherMiddleNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="fatherMiddleName" id="fatherMiddleName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'fatherMiddleName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'fatherMiddleName')">
        <label for="fatherMiddleName">Middle Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherMiddleName', 'fatherMiddleName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherMiddleName',\'${data != "" && data != undefined ? data : ""}\','input','fatherMiddleName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function fatherLastNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="fatherLastName" id="fatherLastName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'fatherLastName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'fatherLastName')">
        <label for="fatherLastName">Last Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherLastName', 'fatherLastName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherLastName',\'${data != "" && data != undefined ? data : ""}\','input','fatherLastName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function fatherPhoneNumberElement(data) {
    var html =
        `<div class="d-flex flex-wrap">
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto mr-2 d-inline-flex align-items-center">
            <input type="checkbox" id="fatherPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ? 'checked' : ''} data-status="${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'fatherPhoneNumber',\'${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ? data.fatherPhoneNumber : ""}\','input',\'${data.fatherPhoneNumberCountryCode != "" && data.fatherPhoneNumberCountryCode != undefined ? data.fatherPhoneNumberCountryCode : "us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="fatherPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
            </label>
        </div> 
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="fatherPhoneEmergencyNumberStatus" class="custom-control-input" ${data.fatherPhoneEmergencyNumberStatus != "N" && data.fatherPhoneEmergencyNumberStatus != undefined ? 'checked' : ''} data-status="${data.fatherPhoneEmergencyNumberStatus != "N" && data.fatherPhoneEmergencyNumberStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'fatherPhoneNumber',\'${data.fatherPhoneNumber}\','input',\'${data.fatherPhoneNumberCountryCode != "" && data.fatherPhoneNumberCountryCode != undefined ? data.fatherPhoneNumberCountryCode : "us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="fatherPhoneEmergencyNumberStatus">
                Emergency Contact
            </label>
        </div>      
    </div>
    <div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-1 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="fatherPhoneNumber" id="fatherPhoneNumber" value="${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ? data.fatherPhoneNumber : ""}" autocomplete="off" placeholder=" " data-idList="fatherPhoneNumber_fatherPhoneNumberWhatsAppStatus_fatherPhoneNumberCountryCode_fatherPhoneEmergencyNumberStatus" onkeydown="return M.digit(event);" onkeyup="controlEditField(this,'fatherPhoneNumber',\'${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ? data.fatherPhoneNumber : ""}\','inputPhone', 'fatherPhoneNumberWhatsAppStatus',\'${data.fatherPhoneNumberCountryCode != "" && data.fatherPhoneNumberCountryCode != undefined ? data.fatherPhoneNumberCountryCode : ""}\', 1,'fatherPhoneNumber','fatherPhoneEmergencyNumberStatus')">
        <label for="fatherPhoneNumber" style="left:12px;">Phone Number</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('fatherPhoneNumber', 'fatherPhoneNumber', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherPhoneNumber',\'${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ? data.fatherPhoneNumber:""}\','inputPhone','fatherPhoneNumber','fatherPhoneNumberWhatsAppStatus','fatherPhoneEmergencyNumberStatus',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
    </div>`;
    return html;
}

function fatherEmailElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="fatherEmail" id="fatherEmail" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" style="padding-left:6px !important; padding-right:2px !important;" onkeyup="controlEditField(this,'fatherEmail',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'fatherEmail')">
        <label for="fatherEmail">Email</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherEmail', 'fatherEmail', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherEmail',\'${data != "" && data != undefined ? data : ""}\','input','fatherEmail')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function fatherFacebookElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="fatherFacebook" id="fatherFacebook" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'fatherFacebook',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'fatherFacebook')">
        <label for="fatherFacebook">Facebook</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherFacebook', 'fatherFacebook', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherFacebook',\'${data != "" && data != undefined ? data : ""}\','input','fatherFacebook')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function fatherCountryElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="fatherCountry" name="fatherCountry" class="form-control form-control-sm group-append-hide-input bar_count" data-country="fatherCountry" onchange="controlEditField(this,'fatherCountry',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'fatherCountry')"></select>
        <label for="fatherCountry">Country</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('fatherCountry', 'fatherCountry',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherCountry',\'${data != "" && data != undefined ? data : ""}\','countrySectionParent','fatherCountry')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function fatherOccupationElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" data-Occupationparent="Father" name="fatherOccupation" id="fatherOccupation" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'fatherOccupation',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'occupation')">
        <label for="fatherOccupation">Occupation</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherOccupation', 'occupation',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherOccupation',\'${data != "" && data != undefined ? data : ""}\','input','occupation')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function fatherDobElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" data-dobparent="Father" name="fatherDob" id="fatherDob" value="${data != "" && data != undefined ? data : ''}" placeholder=" " autocomplete="off" readonly keydown="return false" onchange="controlEditField(this,'fatherDob',\'${data != "" && data != undefined ? data : ''}\','input', '','', 1,'parentDob')">
        <label for="fatherDob">Date of Birth</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('fatherDob', 'parentDob', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('fatherDob',\'${data != "" && data != undefined ? data : ''}\','input','parentDob')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function guardianFirstNameElement(data) {
    var html =
    `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="guardianFirstName" id="guardianFirstName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'guardianFirstName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'guardianFirstName')">
        <label for="guardianFirstName">First Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianFirstName', 'guardianFirstName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianFirstName',\'${data != "" && data != undefined ? data : ""}\','input','guardianFirstName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function guardianMiddleNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="guardianMiddleName" id="guardianMiddleName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'guardianMiddleName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'guardianMiddleName')">
        <label for="guardianMiddleName">Middle Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianMiddleName', 'guardianMiddleName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianMiddleName',\'${data != "" && data != undefined ? data : ""}\','input','guardianMiddleName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function guardianLastNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="guardianLastName" id="guardianLastName" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'guardianLastName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'guardianLastName')">
        <label for="guardianLastName">Last Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianLastName', 'guardianLastName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianLastName',\'${data != "" && data != undefined ? data : ""}\','input','guardianLastName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function guardianPhoneNumberElement(data) {
    var html =
        `<div class="d-flex flex-wrap">
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto mr-2 d-inline-flex align-items-center">
            <input type="checkbox" id="guardianPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.guardianPhoneNumberWhatsAppStatus != "N" && data.guardianPhoneNumberWhatsAppStatus != undefined ? 'checked' : ''} data-status="${data.guardianPhoneNumberWhatsAppStatus != "N" && data.guardianPhoneNumberWhatsAppStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'guardianPhoneNumber',\'${data.guardianPhoneNumber != "" && data.guardianPhoneNumber != undefined ? data.guardianPhoneNumber : ""}\','input',\'${data.guardianPhoneNumberCountryCode != "" && data.guardianPhoneNumberCountryCode != undefined ? data.guardianPhoneNumberCountryCode : "us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="guardianPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
            </label>
        </div>
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="guardianEmergencyNumberStatus" class="custom-control-input" ${data.guardianEmergencyNumberStatus != "N" && data.guardianEmergencyNumberStatus != undefined ? 'checked' : ''} data-status="${data.guardianEmergencyNumberStatus != "N" && data.guardianEmergencyNumberStatus != undefined ? true : false}"  onchange="availableOnWhatsApp(this, 'guardianPhoneNumber',\'${data.guardianPhoneNumber}\','input',\'${data.guardianPhoneNumberCountryCode != "" && data.guardianPhoneNumberCountryCode != undefined ? data.guardianPhoneNumberCountryCode : "us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="guardianEmergencyNumberStatus">
                Emergency Contact
            </label>
        </div>     
    </div>
    <div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-1 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="guardianPhoneNumber" id="guardianPhoneNumber" value="${data.guardianPhoneNumber != "" && data.guardianPhoneNumber != undefined ? data.guardianPhoneNumber : ""}" autocomplete="off" placeholder=" " onkeydown="return M.digit(event);" data-idList="guardianPhoneNumber_guardianPhoneNumberWhatsAppStatus_guardianPhoneNumberCountryCode_guardianEmergencyNumberStatus" onkeyup="controlEditField(this,'guardianPhoneNumber',\'${data.guardianPhoneNumber != "" && data.guardianPhoneNumber != undefined ? data.guardianPhoneNumber : ""}\','inputPhone', 'guardianPhoneNumberWhatsAppStatus',\'${data.guardianPhoneNumberCountryCode != "" && data.guardianPhoneNumberCountryCode != undefined ? data.guardianPhoneNumberCountryCode : ""}\', 1, 'guardianPhoneNumber','guardianEmergencyNumberStatus')">
        <label for="guardianPhoneNumber" style="left:12px;">Phone Number</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('guardianPhoneNumber', 'guardianPhoneNumber', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianPhoneNumber',\'${data.guardianPhoneNumber !="" && data.guardianPhoneNumber != undefined ?data.guardianPhoneNumber:""}\','inputPhone','guardianPhoneNumber','guardianPhoneNumberWhatsAppStatus','guardianEmergencyNumberStatus',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
    </div>`;
    return html;
}

function guardianEmailElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="guardianEmail" id="guardianEmail" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" style="padding-left:6px !important; padding-right:2px !important;" onkeyup="controlEditField(this,'guardianEmail',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'guardianEmail')">
        <label for="guardianEmail">Email</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianEmail', 'guardianEmail', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianEmail',\'${data != "" && data != undefined ? data : ""}\','input','guardianEmail')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function guardianFacebookElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-4 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="guardianFacebook" id="guardianFacebook" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'guardianFacebook',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'guardianFacebook')">
        <label for="guardianFacebook">Facebook</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianFacebook', 'guardianFacebook', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianFacebook',\'${data != "" && data != undefined ? data : ""}\','input','guardianFacebook')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function guardianCountryElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="guardianCountry" name="guardianCountry" class="form-control form-control-sm group-append-hide-input bar_count" data-country="guardianCountry" onchange="controlEditField(this,'guardianCountry',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'guardianCountry')"></select>
        <label for="guardianCountry">Country</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianCountry', 'guardianCountry',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianCountry',\'${data != "" && data != undefined ? data : ""}\','countrySectionParent','guardianCountry')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function guardianOccupationElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" data-Occupationparent="Guardian" name="guardianOccupation" id="guardianOccupation" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'guardianOccupation',\'${data != "" && data != undefined ? data : ""}\','input', '','', 1,'occupation')">
        <label for="guardianOccupation">Occupation</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianOccupation', 'occupation',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianOccupation',\'${data != "" && data != undefined ? data : ""}\','input','occupation')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function guardianDobElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" data-dobparent="Guardian" name="guardianDob" id="guardianDob" value="${data != "" && data != undefined ? data : ''}" placeholder=" " autocomplete="off" readonly keydown="return false" onchange="controlEditField(this,'guardianDob',\'${data != "" && data != undefined ? data : ''}\','input', '','', 1,'parentDob')">
        <label for="guardianDob">Date of Birth</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('guardianDob', 'parentDob', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('guardianDob',\'${data != "" && data != undefined ? data : ''}\','input','parentDob')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function relationTypeElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="relationType" name="relationType" class="form-control form-control-sm group-append-hide-input bar_count" onchange="controlEditField(this,'relationType',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'relationType')">
            ${getRelationshipContent()}
        </select>
        <label for="relationType">Type of Relation (Primary Parent)</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('relationType', 'relationType',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','true',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('relationType',\'${data != "" && data != undefined ? data : ""}\','select','relationType')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function weddingAnniversaryDateElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="weddingAnniversaryDate" id="weddingAnniversaryDate" value="${data != "" && data != undefined ? data : ''}" placeholder=" " autocomplete="off" readonly keydown="return false" onchange="controlEditField(this,'weddingAnniversaryDate',\'${data != "" && data != undefined ? data : ''}\','input', '','', 1,'weddingAnniversaryDate')">
        <label for="weddingAnniversaryDate">Wedding Anniversary Date</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('weddingAnniversaryDate', 'weddingAnniversaryDate', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('weddingAnniversaryDate',\'${data != "" && data != undefined ? data : ''}\','input','weddingAnniversaryDate')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function pCountryIdElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="pCountryId" name="pCountryId" class="form-control form-control-sm group-append-hide-input" data-country="pCountryId_pStateId_pCityId" onchange="controlEditField(this,'pCountryId',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'countrySectionParent')"></select>
        <label for="pCountryId">Country</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('pCountryId', 'countrySectionParent',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('pCountryId',\'${data != "" && data != undefined ? data : ""}\','countrySectionParent')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function pStateIdElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="pStateId" name="pStateId" class="form-control form-control-sm group-append-hide-input" data-country="pStateId_pCityId" onchange="controlEditField(this,'pStateId',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'countrySectionParent')"></select>
        <label for="pStateId">State</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('pCountryId', 'countrySectionParent',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('pStateId',\'${data != "" && data != undefined ? data : ""}\','countrySection','countrySectionParent')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}
function pCityIdElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select id="pCityId" name="pCityId" class="form-control form-control-sm group-append-hide-input" data-country="pCityId" onchange="controlEditField(this,'pCityId',\'${data != "" && data != undefined ? data : ""}\','select', '','', 1,'countrySectionParent')"></select>
        <label for="pCityId">City</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('pCountryId', 'countrySectionParent',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('pCityId',\'${data != "" && data != undefined ? data : ""}\','countrySection','countrySectionParent')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function preferredCommunicationContent(data) {
    var html =
        `<div class="d-flex  flex-wrap">
        <span class="font-weight-semi-bold w-100">Communication:&nbsp;</span>
        <div class="d-inline-flex flex-wrap communication-wrapper w-100">
            <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor communication-wrapper">
                <input type="checkbox" id="pcWhatsappView" name="pcWhatsappView" class="custom-control-input group-append-hide-input bar_count" data-communication-label="pcWhatsappView" ${data.pcWhatsappView != "N" && data.pcWhatsappView != undefined ? 'checked' : ''} check-status="${data.pcWhatsappView != "N" && data.pcWhatsappView != undefined ? true : false}" onchange="controlEditField(this,this,${data.pcWhatsappView != "N" && data.pcWhatsappView != undefined ? true : false},'communication', '','', 1,'preferredcommunication')">
                <label class="custom-control-label cursor font-weight-semi-bold" for="pcWhatsappView">WhatsApp</label>
            </div>
            <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor communication-wrapper">
                <input type="checkbox" id="pcCallView" name="pcCallView" class="custom-control-input group-append-hide-input bar_count" data-communication-label="pcCallView" ${data.pcCallView == "Y" ? 'checked' : ''} check-status="${data.pcCallView != "N" && data.pcCallView != undefined ? true : false}" onchange="controlEditField(this,this,${data.pcCallView != "N" && data.pcCallView != undefined ? true : false},'communication', '','', 1,'preferredcommunication')">
                <label class="custom-control-label cursor font-weight-semi-bold" for="pcCallView">Phone</label>
            </div>
            <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor communication-wrapper">
                <input type="checkbox" id="pcEmailView" name="pcEmailView" class="custom-control-input group-append-hide-input bar_count" data-communication-label="pcEmailView" ${data.pcEmailView == "Y" ? 'checked' : ''} check-status="${data.pcEmailView != "N" && data.pcEmailView != undefined ? true : false}" onchange="controlEditField(this,this,${data.pcEmailView != "N" && data.pcEmailView != undefined ? true : false},'communication', '','', 1,'preferredcommunication')">
                <label class="custom-control-label cursor font-weight-semi-bold" for="pcEmailView">Email</label>
            </div>
            <div class="w-100 text-right" id="saveCommunicationWrapper" style="display:none">
                <a href="javascript:void(0)" class="btn btn-sm btn-success mx-1" onclick="applyChanges('preferredcommunication', 'preferredcommunication',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',1)">Save</a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger mx-1" onclick="cancelCommunication()">Cancel</a>
            </div>
        </div>    
    </div>`;
    return html;
}

function communicationPreferredTimingInformation(data) {
    var html =
        `<div class="col-12 mb-2">
            <span class="font-weight-semi-bold w-100">Communication Preferred Timing:</span>
        </div>
        <div class="col-12" id="communication-preferred-time-wrapper">
            <ul class="p-0 communication-preferred-time-wrapper-ul bar_count">
                ${getCommunicationPreferredSlotContent(data.callingTimePrefArray)}
            </ul>    
        </div>
        <div class="col-12" id="communication-preferred-time-dropdown-wrapper" style="display:none">
            <div class="form-row">
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                    <label for="communicationRoleType" class="font-weight-semi-bold text-dark">Select Option</label>
                    <select class="form-control form-control-sm" id="communicationRoleType" onchange="getCommunicationRoleType(this)">
                        <option value="">Select Option</option>
                        <option value="Student">Student</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                    </select>
                </div>
                <div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div class="d-flex flex-wrap gap-10">
                        <div class="d-inline-flex">
                            <div>
                                <label for="preferedCommunicationStartTime" class="full">&nbsp;</label>
                                <select class="form-control form-control-sm fromTime" id="preferedCommunicationStartTime" disabled>
                                    ${generateTimeDropdown("12:00 AM", "11:59 PM", 10)}
                                </select>
                            </div>
                        </div>
                        <div class="d-inline-flex">
                            <div>
                                <label for="preferedCommunicationEndTime" class="full">&nbsp;</label>
                                <select class="form-control form-control-sm toTime" id="preferedCommunicationEndTime" disabled>
                                    ${generateTimeDropdown("12:00 AM", "11:59 PM", 10)}
                                </select>
                            </div> 
                        </div>
                        <div class="d-inline-flex">
                            <div>
                                <label for="communicationPreferredSlotActionWrapper" class="full">&nbsp;</label>
                                <div>
                                    <a href="javascript:void(0)" class="btn btn-primary btn-sm mr-2" id="communicationPreferredSlotAdd" onclick="addCommunicationPreferredTime('communicationPreferredSlots','communicationPreferredSlots')" style="display:none" >
                                        <i class="fa fa-plus"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-success btn-sm" id="communicationPreferredSlotSave" style="display:none" onclick="applyChanges('communicationPreferredSlots', 'communicationPreferredSlots', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',2)">Save</a>   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <a href="javascript:void(0)" class="text-primary text-decoration-none addcommunicationPreferredTimeBtn" onclick="openCommunicationPreferredTimeElement(this, 'class-preferred-time-dropdown-wrapper')">
                <i class="fa fa-plus"></i>&nbsp; Add Preferred Start Time - End Time    
            </a>    
        </div>`;
    return html;
}



function getCommunicationPreferredSlotContent(data) {
    // data=[
    //     {
    //         "key":"Student",
    //         "preferences":[
    //             "10:00AM - 10:10AM",
    //             "11:00AM - 11:10AM",
    //             "13:00AM - 13:10AM"
    //         ]
    //     },
    //     {
    //         "key":"parent",
    //         "preferences":[
    //             "10:00AM - 10:10AM",
    //             "11:00AM - 11:10AM",
    //             "13:00AM - 13:10AM"
    //         ]
    //     },
    //     {
    //         "key":"mother",
    //         "preferences":[
    //             "10:00AM - 10:10AM",
    //             "11:00AM - 11:10AM",
    //             "13:00AM - 13:10AM"
    //         ]
    //     }
    // ]
    var html = ``;
    if (data != "" && data != undefined) {
        if (data.length > 0) {
            $.each(data, function (index, value) {
                html +=
                `<li style="list-style:none">
                    <div class="w-100 d-flex flex-wrap communication-preferred-timing align-items-center mb-2">
                        <span class="font-weight-bold">${value.communicationRoleType}:&nbsp;</span>
                        <ul class="d-flex ul_${value.communicationRoleType} communication_slot_ul" data-communicationRoleType-ul="${value.communicationRoleType}">`;
                            $.each(value.timings, function (i, v) {
                                html +=
                                    `<li class="mr-2" id="communication_slot_${i + 1}_${index}" data-slot-st="${convertTo12Hour(v.startTime)}" data-slot-et="${convertTo12Hour(v.endTime)}" data-communicationRoleType="${value.communicationRoleType}">
                                        <div class="d-inline-flex">
                                            <span class="d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 text-primary">
                                                <i class="fa fa-clock mr-1"></i>
                                                <span class="font-weight-semi-bold">(${convertTo12Hour(v.startTime)} - ${convertTo12Hour(v.endTime)})</span>   
                                            </span>    
                                            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="removeCommunicationPreferredTime(\'ul_${value.communicationRoleType}\', 'communication_slot_${i + 1}_${index}')">
                                                <i class="fa fa-trash"></i>    
                                            </a>    
                                        </div>    
                                    </li>`;
                            });
                        html += `</ul>
                    </div>
                </li>`;
            });

        };
    };
    return html;
}



// Guardian Information Form Elements End Here

// Academic Information Form Elements Start Here

function academicInformation(data) {
    var html =
        `<div class="card mt-3 profile-section" id="academic_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center flex-wrap">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-graduation-cap font-12"></i>    
                            </span>
                            <span>3. Academic Information</span>
                            <div class="ml-auto">
                                ${data.standardStatus == 0 ?
                                    `<a href="javascript:void(0)" onclick="callWithSession('${data.studentIdCardDownloadUrl}');" class="btn btn-sm btn-success mr-1">Download Student ID Card</a>` : ``
                                }
                                ${USER_ROLE != "STUDENT" && data.rightToEdit ?
                                    `<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="showLearningProgamGradePlatformModal()"><i class="fa fa-edit"></i>&nbsp;Edit</a>` : ``
                                }
                            </div>
                        </h5>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${studentIDElement(data.studentID)}
                    </div>
                    
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${academicYearStartDateElement(data.academicYearStartDate)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${enrollmentDateElement(data.enrollmentDate)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${learningProgramElement(data.learningProgram)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${gradeElement()}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${studentCourseProviderIdElement()}
                    </div>
                    <div class="col-12">
                        ${courseEelement(data)}
                    </div>
                    <div class="col-12">
                        <hr class="mt-1" />
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${previousCurrentSchoolNameElement(data.previousCurrentSchoolName)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${previousCurrentGradeNameElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${previousCurrentSchoolGraduationYearElement(data.previousCurrentSchoolGraduationYear)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${previousCurrentSchoolCountryElement(data.previousCurrentSchoolCountry)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${ctiTakenRecommendedGradeElement(data.ctiTakenRecommendedGrade)}
                    </div>
                    <div class="col-12">
                        <hr/>
                    </div>
                    <div class="col-12">
                        <div class="form-group mb-2 p-0">
                            <span class="font-weight-semi-bold text-dark">Documents</span>
                        </div>
                    </div>
                    <div class="col-12 mb-3">
                        ${studentDocumentVerificationSection()}
                    </div>`;
                    //aazim
                    html+=`<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`
				    html += ageProofElement(data)
				    html += `</div>
				                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
				    html += addressProofElement(data)
				    html += `</div>
				                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
				    html += parentPassportProofElement(data)
				    html += `</div>
				                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
				    html += lastAcademicProofElement(data)
				    html += `</div>`;
				    html += `<div class="col-12 text-right">
				           <a href="javascript:void(0)" class="btn btn-success btn-sm" id="saveAcademicInformationDocsBtn" onclick="saveDocs('${PROFILE_RESPONSE_DATA .userId}','${PROFILE_RESPONSE_DATA .studentStandardId}')">Save Documents</a>
				       </div>`;
                    // html +=`${documentProofContent()}`
                    // html+=`<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    //     ${ageProofElement(data)}
                    // </div>
                    // <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    //     ${addressProofElement(data)}
                    // </div>
                    // <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    //     ${parentPassportProofElement(data)}
                    // </div>
                    // <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    //     ${lastAcademicProofElement(data)}
                    // </div>
                    // <div class="col-12 text-right">
                    //     <a href="javascript:void(0)" class="btn btn-success btn-sm" id="saveAcademicInformationDocsBtn" onclick="saveDocs('${PROFILE_RESPONSE_DATA .userId}','${PROFILE_RESPONSE_DATA .studentStandardId}')">Save Documents</a>
                    // </div>`
                    html +=`${profileProgressReportSectionElement(data)}            
                </div>
                <div class="form-row mt-2 w-100">`;
                    $.each(data.customFields, function(index, item){
                        html+=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${renderDynamicFieldByUserID(item, item.fieldValue, 2, "PROFILE_PAGE")}                    
                        </div>`;
                    });
                html+=`</div>   
            </div>    
        </div>`;
    return html;
}

function documentProofContent(){
    var html=
    `<div class="col-12" id="documentProofHeadWrapper">
        <hr/>
        <div class="form-group mb-2 p-0">
            <span class="font-weight-semi-bold text-dark">Documents</span>
        </div>
    </div>`;
    return html;
}

function profileProgressReportSectionElement(data) {
    var selectedDays = profileProgressReportResolveDaysType(data);
    var dateRangeLabel = profileProgressReportGetDateRangeLabel(selectedDays);
    var anchorDate = profileProgressReportGetAnchorDateString();
    PROFILE_PROGRESS_REPORT_CURRENT_DAYS = selectedDays;
    PROFILE_PROGRESS_REPORT_PENDING_DAYS = null;
    var html =
        `<div class="col-12">
            <hr class="mt-2 mb-3"/>
        </div>
        <div class="col-12 mb-2">
            <div class="d-flex align-items-center flex-wrap">
                <span class="font-weight-semi-bold text-dark">Set Progress Report</span>
                <span class="badge badge-light bg-light border text-dark ml-2 mb-2 mb-md-0 px-3 py-2" id="progressReportDateRangeLabel">${dateRangeLabel}</span>
                <input type="hidden" name="progressReportDaysType" id="progressReportDaysType" value="${selectedDays}"/>
                <input type="hidden" name="progressReportAnchorDate" id="progressReportAnchorDate" value="${anchorDate}"/>
            </div>
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2 d-flex justify-content-center">
            ${profileProgressReportOptionCardElement(7, "Weekly", "Every 7 days", selectedDays)}
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2 d-flex justify-content-center">
            ${profileProgressReportOptionCardElement(14, "Biweekly", "Every 14 days", selectedDays)}
        </div>
        <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-2 d-flex justify-content-center">
            ${profileProgressReportOptionCardElement(28, "Monthly", "Every 28 days", selectedDays)}
        </div>`;
    return html;
}

function profileProgressReportOptionCardElement(days, title, subtitle, selectedDays) {
    var cardBorderClass = "border-light";
    var radioChecked = "";
    var radioAccent = "text-muted";
    if (parseInt(days, 10) === parseInt(selectedDays, 10)) {
        cardBorderClass = "border-primary shadow-sm";
        radioChecked = "checked";
        radioAccent = "text-primary";
    }
    var html =
        `<div class="border rounded-10 p-1 d-flex align-items-center justify-content-between progress-report-option-card ${cardBorderClass} bg-white cursor w-100"
            id="progressReportOptionCard_${days}"
            onclick="profileProgressReportSelect(event, ${days})">
            <div class="d-flex align-items-center">
                <div class="avatar-icon-wrapper mr-3">
                    <div class="avatar-icon bg-light-primary border-0 rm-border d-flex align-items-center justify-content-center">
                        <i class="fa fa-calendar text-primary"></i>
                    </div>
                </div>    
                <div>
                    <div class="font-weight-bold text-dark">${title}</div>
                    <div class="text-muted">${subtitle}</div>
                </div>
            </div>
            <div class="d-flex align-items-center ${radioAccent}">
                <input type="radio"
                    name="progressReportOption"
                    id="progressReportOption_${days}"
                    value="${days}"
                    ${radioChecked}
                    class="checkbox-lg"
                    onclick="profileProgressReportSelect(event, ${days})"
                    />
            </div>
        </div>`;
    return html;
}

function profileProgressReportSelect(e, days) {
    if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
        e.stopPropagation();
    }
    var safeDays = profileProgressReportSanitizeDaysType(days);
    if (PROFILE_PROGRESS_REPORT_CURRENT_DAYS === null || PROFILE_PROGRESS_REPORT_CURRENT_DAYS === undefined) {
        PROFILE_PROGRESS_REPORT_CURRENT_DAYS = parseInt($("#progressReportDaysType").val() || "14", 10);
    }
    PROFILE_PROGRESS_REPORT_CURRENT_DAYS = profileProgressReportSanitizeDaysType(PROFILE_PROGRESS_REPORT_CURRENT_DAYS);

    profileProgressReportApplySelection(PROFILE_PROGRESS_REPORT_CURRENT_DAYS);

    PROFILE_PROGRESS_REPORT_PENDING_DAYS = safeDays;
    $("#progressReportConfirmModal").modal("show");
}

function profileProgressReportApplySelection(days) {
    var safeDays = profileProgressReportSanitizeDaysType(days);
    $("#progressReportDaysType").val(safeDays);
    $("#progressReportDateRangeLabel").text(profileProgressReportGetDateRangeLabel(safeDays));
    $("#progressReportAnchorDate").val(profileProgressReportGetAnchorDateString());

    $("input[name='progressReportOption']").prop("checked", false);
    $("#progressReportOption_" + safeDays).prop("checked", true);

    $(".progress-report-option-card").removeClass("border-primary shadow-sm").addClass("border-light");
    $("#progressReportOptionCard_" + safeDays).removeClass("border-light").addClass("border-primary shadow-sm");
}

function profileProgressReportResolveDaysType(data) {
    var candidate =
        (data && (data.reportType)) ||
        (data && data.studentStandardDTO && data.studentStandardDTO[0] && data.studentStandardDTO[0].reportType) ||
        (data && data.studentStandardDTO && data.studentStandardDTO.reportType) ||
        (data && (data.progressReportDaysType || data.daysType || data.progressReportFrequencyDays || data.progressReportTypeDays)) ||
        (PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA.profileData && (PROFILE_RESPONSE_DATA.profileData.progressReportDaysType || PROFILE_RESPONSE_DATA.profileData.daysType)) ||
        14;
    return profileProgressReportSanitizeDaysType(candidate);
}

function profileProgressReportSanitizeDaysType(days) {
    var val = parseInt(days, 10);
    if (val === 30) {
        return 28;
    }
    if (val === 15) {
        return 14;
    }
    if (val !== 7 && val !== 14 && val !== 28) {
        return 14;
    }
    return val;
}

function profileProgressReportGetDateRangeLabel(days) {
    var safeDays = profileProgressReportSanitizeDaysType(days);
    var startDate = profileProgressReportGetBaseDateAsDateOnly();
    var endDate = new Date(startDate.getTime());
    if (safeDays === 7) {
        endDate.setDate(endDate.getDate() + (safeDays - 1));
    } else {
        endDate.setDate(endDate.getDate() + safeDays);
    }
    return profileProgressReportFormatLongDate(startDate) + " - " + profileProgressReportFormatLongDate(endDate);
}

function profileProgressReportGetAnchorDateString() {
    return profileProgressReportFormatShortDate(profileProgressReportGetBaseDateAsDateOnly());
}

function profileProgressReportFormatShortDate(dateObj) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var m = months[dateObj.getMonth()];
    var d = dateObj.getDate();
    var dd = d < 10 ? ("0" + d) : d;
    var y = dateObj.getFullYear();
    return m + " " + dd + ", " + y;
}

function profileProgressReportFormatLongDate(dateObj) {
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var m = months[dateObj.getMonth()];
    var d = dateObj.getDate();
    var y = dateObj.getFullYear();
    return m + " " + d + ", " + y;
}

function profileProgressReportGetBaseDateAsDateOnly() {
    var baseDate = new Date();
    if (window.today != "" && window.today != undefined) {
        baseDate = window.today;
    }
    baseDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    var day = baseDate.getDay();
    var saturday = new Date(baseDate.getTime());
    saturday.setDate(saturday.getDate() + (6 - day));
    return saturday;
}

function profileProgressReportConfirmModal() {
    var html =
        `<div class="modal fade fade-scale theme-modal" id="progressReportConfirmModal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered box-shadow-none" role="document" style="max-width:460px">
                <div class="modal-content border-0 rm-border no-shadow rounded-20 overflow-hidden bg-white">
                    <div class="modal-header bg-primary text-white py-2">
                        <h5 class="modal-title font-weight-semi-bold m-0">Set Progress Report</h5>
                        <button type="button" class="close text-white close-with-red-color" data-dismiss="modal" aria-label="Close" onclick="profileProgressReportConfirmNo()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="rounded-10 border border-warning bg-light-warning text-center p-3">
                            <div class="avatar-icon-wrapper avatar-icon-xs mx-auto mb-2">
                                <div class="avatar-icon bg-orange text-white d-flex align-items-center justify-content-center">
                                    <i class="fa fa-info font-12"></i>
                                </div>
                            </div>
                            <div id="progressReportConfirmMessage" class="font-size-md text-orange">
                                Your current report frequency (e.g.,Weekly,Biweekly,Monthly) will remain active until its configured end date. Any changes you make will take effect only after the current configuration period ends.
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-light px-4" data-dismiss="modal" onclick="profileProgressReportConfirmNo()">No</button>
                        <button type="button" class="btn btn-primary px-4" onclick="profileProgressReportConfirmYes()">Yes</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function profileProgressReportConfirmYes() {
    if (PROFILE_PROGRESS_REPORT_PENDING_DAYS === null || PROFILE_PROGRESS_REPORT_PENDING_DAYS === undefined) {
        $("#progressReportConfirmModal").modal("hide");
        return;
    }
    PROFILE_PROGRESS_REPORT_CURRENT_DAYS = profileProgressReportSanitizeDaysType(PROFILE_PROGRESS_REPORT_PENDING_DAYS);
    PROFILE_PROGRESS_REPORT_PENDING_DAYS = null;
    profileProgressReportApplySelection(PROFILE_PROGRESS_REPORT_CURRENT_DAYS);
    applyChanges('progressReportDaysType', 'progressReportType', PROFILE_RESPONSE_DATA.userId, PROFILE_RESPONSE_DATA.studentStandardId, PROFILE_RESPONSE_DATA.moduleId, 'student', false, 0);
    $("#progressReportConfirmModal").modal("hide");
}

function profileProgressReportConfirmNo() {
    PROFILE_PROGRESS_REPORT_PENDING_DAYS = null;
    if (PROFILE_PROGRESS_REPORT_CURRENT_DAYS !== null && PROFILE_PROGRESS_REPORT_CURRENT_DAYS !== undefined) {
        profileProgressReportApplySelection(PROFILE_PROGRESS_REPORT_CURRENT_DAYS);
    }
    if ($("#progressReportConfirmModal").hasClass("show")) {
        $("#progressReportConfirmModal").modal("hide");
    }
}

function studentIDElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="form-group custom-field mb-2 mt-3 p-0">
            <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="studentID" id="studentID" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" disabled>
            <label for="studentID">Student ID</label>
        </div>
    </div>`;
    return html;
}

function learningProgramElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="form-group custom-field mb-2 mt-4 p-0">
            <select name="learningProgram" id="learningProgram" class="form-control form-control-sm" disabled>
                ${getLearningProgramContent(SCHOOL_ID)}
            </select>
            <label for="learningProgram" style="position:absolute;left:16px;top:-9px;transform:none;font-size:12px;font-weight:500;line-height:16px;z-index:999;background:#fff;padding:0 8px;color:var(--custom-field-active);">Learning Program</label>
        </div>
    </div>`;
    return html;
}

function gradeElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="form-group custom-field mb-2 mt-4 p-0">
            <select name="grade" id="grade" class="form-control form-control-sm" disabled></select>
            <label for="grade" style="position:absolute;left:16px;top:-9px;transform:none;font-size:12px;font-weight:500;line-height:16px;z-index:999;background:#fff;padding:0 8px;color:var(--custom-field-active);">Grade</label>
        </div>
    </div>`;
    return html;
}

function academicYearStartDateElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="form-group custom-field mb-2 mt-3 p-0">
            <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="academicYearStartDate" id="academicYearStartDate" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" disabled>
            <label for="academicYearStartDate">Academic Year Start Date</label>
        </div>
    </div>`;
    return html;
}

function enrollmentDateElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="form-group custom-field mb-2 mt-3 p-0">
            <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="enrollmentDate" id="enrollmentDate" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" disabled>
            <label for="enrollmentDate">Enrollment Date</label>
        </div>
    </div>`;
    return html;
}

function studentCourseProviderIdElement(data) {
    var html =
        `<div class="custom-field-scope">
        <div class="form-group custom-field mb-2 mt-4 p-0">
            <select name="studentCourseProviderId" id="studentCourseProviderId" class="form-control form-control-sm" disabled>
                ${getLmsPlatformContent(SCHOOL_ID)}
            </select>
            <label for="studentCourseProviderId" style="position:absolute;left:16px;top:-9px;transform:none;font-size:12px;font-weight:500;line-height:16px;z-index:999;background:#fff;padding:0 8px;color:var(--custom-field-active);">LMS Platform</label>
        </div>
    </div>`;
    return html;
}

function courseEelement(data) {
    var html =
        `<div class="form-group mb-2 p-0 compulsorySubjectsdiv">
            <span class="font-weight-semi-bold text-dark">Course (${data.grade != "" && data.grade != undefined ? data.grade : ""})</span>
            <ul class="p-0 mt-2">`;
                if(data.courses.length > 0) {
                    $.each(data.courses, function (i, v) {
                        html +=`<li class="d-inline-block p-1 px-2 mr-1 rounded bg-primary text-white font-11 mb-1">${v}</li>`;
                    });
                }
            html += `</ul>
        </div>`;
    return html;
}

function previousCurrentSchoolNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="previousCurrentSchoolName" id="previousCurrentSchoolName" value="${data != "" && data != undefined ? data : ""}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this,'previousCurrentSchoolName',\'${data != "" && data != undefined ? data : ""}\','input', '','', 2,'previousCurrentSchoolName')">
        <label for="previousCurrentSchoolName">Previous/Current School Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="applyChanges('previousCurrentSchoolName', 'previousCurrentSchoolName', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',2)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('previousCurrentSchoolName',\'${data != "" && data != undefined ? data : ""}\','input','previousCurrentSchoolName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function previousCurrentGradeNameElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select name="previousCurrentGradeName" id="previousCurrentGradeName" class="form-control form-control-sm group-append-hide-input" onchange="controlEditField(this,'previousCurrentGradeName',\'${data.previousCurrentGradeId != "" && data.previousCurrentGradeId != undefined ? data.previousCurrentGradeId : ""}\','select', '','', 2,'previousCurrentGradeName')"></select>
        <label for="previousCurrentGradeName">Previous/Current Grade Name</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('previousCurrentGradeName', 'previousCurrentGradeName',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',2)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('previousCurrentGradeName',\'${data.previousCurrentGradeId != "" && data.previousCurrentGradeId != undefined ? data.previousCurrentGradeId : ""}\','select','previousCurrentGradeName')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function previousCurrentSchoolGraduationYearElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="previousCurrentSchoolGraduationYear" id="previousCurrentSchoolGraduationYear" value="${data != "" && data != undefined ? data : ""}" onkeydown="return M.isChars(event);" placeholder=" " autocomplete="off" onchange="controlEditField(this,'previousCurrentSchoolGraduationYear',\'${data != "" && data != undefined ? data : ""}\','input', '','', 2,'previousCurrentSchoolGraduationYear')">
        <label for="previousCurrentSchoolGraduationYear">Previous/Current School Graduation Year</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
            <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('previousCurrentSchoolGraduationYear', 'previousCurrentSchoolGraduationYear', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',2)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('previousCurrentSchoolGraduationYear',\'${data != "" && data != undefined ? data : ""}\','input','previousCurrentSchoolGraduationYear')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>
</div>`;
    return html;
}

function previousCurrentSchoolCountryElement(data) {
    var html =
        `<div class="custom-field-scope">
    <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
        <select name="previousCurrentSchoolCountry" id="previousCurrentSchoolCountry" class="form-control form-control-sm group-append-hide-input" onchange="controlEditField(this,'previousCurrentSchoolCountry',\'${data != "" && data != undefined ? data : ""}\','select', '','', 2,'previousCurrentSchoolCountry')"></select>
        <label for="previousCurrentSchoolCountry">Previous/Current School Country</label>
        <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center" onclick="applyChanges('previousCurrentSchoolCountry', 'previousCurrentSchoolCountry',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',2)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('previousCurrentSchoolCountry',\'${data != "" && data != undefined ? data : ""}\','select','previousCurrentSchoolCountry')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-times"></i>
                </a>
            </div>
    </div>
</div>`;
    return html;
}

function ctiTakenRecommendedGradeElement(data) {
    var html =
        `<div class="form-group mb-2 p-0">
        <label for="ctiTakenRecommendedGrade" class="font-weight-semi-bold text-dark">CTI Taken Recommended Grade</label>
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="ctiTakenRecommendedGrade" id="ctiTakenRecommendedGrade" value="${data != "" && data != undefined ? data : ""}" autocomplete="off" disabled>
    </div>`;
    return html;
}


function viewUploadFileModal() {
    var html =
        `<div class="modal fade fade-scale" id="uploadFile" tabindex="-1">
        <div class="modal-dialog modal-md  box-shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">
                    <h6 class="heading text-white">Preview File</h6>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body m-0 py-2" style="margin-top:0 !important">
                    <div id="pre_upload_image_div" class="full text-center upload_img d-none">
                        <img id="pre_upload_image" class="w-100" src="" />
                    </div>
                    <div id="pre_upload_pdf_div"class=" full text-center upload_pdf d-none">
                        <div class="full">
                            <a href="" target="_blank" class="btn btn-sm btn-primary download-pdf-btn mb-2 pull-right" download="file.pdf">
                                Download PDF
                            </a>
                        </div>
                        <object type="application/pdf" class="pre_upload_pdf w-100" style="height: 400px;display:none" data="">
                        </object>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

//aazim
function studentDocumentVerificationSection() {
    var canEdit = (USER_ROLE != "STUDENT" && PROFILE_RESPONSE_DATA .rightToEdit);
    var html =
        `<div class="card border shadow-sm mb-0" id="studentDocumentVerificationCard">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12">
                        <div id="studentDocumentVerificationWrapper">
                            <div class="border rounded p-3 text-muted bg-light">Loading documents...</div>
                        </div>
                        ${canEdit ? `<div class="text-right mt-2"><button type="button" class="btn btn-success btn-sm" id="studentDocumentVerificationSubmitBtn" onclick="submitStudentDocumentVerification()">Save Verification</button></div>` : ``}
                    </div>
                    ${canEdit ? `<div class="col-12 mb-3">
                        <div id="studentDocumentUploadPanelWrapper">
                            <div class="border rounded p-3 text-muted bg-light">Loading upload panel...</div>
                        </div>
                    </div>` : ``}
                </div>
            </div>
        </div>`;
    return html;
}

function ageProofElement(data) {

    var html =
        `<div class="full">
        <span class="font-weight-semi-bold text-primary">Age Proof:</span>
        <div class="d-flex">
            <div class="w-100" id="ageProofViewBtn" style="${data.ageProof != "" && data.ageProof != undefined ? '' : 'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span class="bar_count" id="ageProofFileName">${data.ageProof != "" && data.ageProof != undefined ? data.ageProofName : ''}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.ageProofAttachmentType}\', 'ageProofdiv')">
                            <img id="ageProofimgIcon" class="full crop-uplod-img d-none" src="${data.ageProof != "" && data.ageProof != undefined ? data.ageProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" alt="" thumbtype="${data.ageProofAttachmentType == "I" ? 'img' : 'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a> 
                        <button id="ageProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.ageProof != "" && data.ageProof != undefined ? '' : 'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'ageProof\\\', \\\'ageProofimgIcon\\\', \\\'Age Proof\\\', \\\'${PROFILE_RESPONSE_DATA.userId}\\\',\\\'${PROFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>    
                </div>
            </div>
            <div class="upload-btn-wrapper" id="ageProofdiv" data-pdfurl="${data.ageProof != "" && data.ageProof != undefined ? data.ageProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" style="${data.ageProof != "" && data.ageProof != undefined ? 'display:none' : ''}">
                <input class="file-input" type="file" name="ageProof" id="ageProof" onchange="cropImage(event, 'ageProof', 'ageProofimgIcon', 'Age Proof', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
        </div>
    </div>`;
    return html;
}

function addressProofElement(data) {
    var html =
    `<div class="full">
        <span class="font-weight-semi-bold text-primary">Address Proof:</span>
        <div class="d-flex">
            <div class="w-100" id="addressProofViewBtn" style="${data.addressProof != "" && data.addressProof != undefined ? '' : 'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span class="bar_count" id="addressProofFileName">${data.addressProof != "" && data.addressProof != undefined ? data.addressProofName : ''}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.addressProofAttachmentType}\', 'addressProofdiv')">
                            <img id="addressProofimgIcon" class="full crop-uplod-img d-none" src="${data.addressProof != "" && data.addressProof != undefined ? data.addressProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" alt="" thumbtype="${data.addressProofAttachmentType == "I" ? 'img' : 'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a>  
                        <button id="addressProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.addressProof != "" && data.addressProof != undefined ? '' : 'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'addressProof\\\', \\\'addressProofimgIcon\\\', \\\'Address Proof\\\',\\\'${PROFILE_RESPONSE_DATA.userId}\\\',\\\'${PROFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>   
                </div>
            </div>
            <div class="upload-btn-wrapper" id="addressProofdiv" data-pdfurl="${data.addressProof != "" && data.addressProof != undefined ? data.addressProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" style="${data.addressProof != "" && data.addressProof != undefined ? 'display:none' : ''}">
                <input class="file-input" type="file" name="addressProof" id="addressProof" onchange="cropImage(event, 'addressProof', 'addressProofimgIcon', 'Address Proof', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
              
        </div>
    </div>`;
    return html;
}

function parentPassportProofElement(data) {
    var html =
        `<div class="full">
        <span class="font-weight-semi-bold text-primary">Parent Passport:</span>
        <div class="d-flex">
            <div class="w-100" id="parentPassportProofViewBtn" style="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? '' : 'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span class="bar_count" id="parentPassportProofFileName">${data.parentPassportProof != "" && data.parentPassportProof != undefined ? data.parentPassportProofName : ''}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.parentPassportAttachmentType}\', 'parentPassportProofdiv')">
                            <img id="parentPassportProofimgIcon" class="full crop-uplod-img d-none" src="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? data.parentPassportProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" alt="" thumbtype="${data.parentPassportAttachmentType == "I" ? 'img' : 'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a>
                        <button id="parentPassportProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? '' : 'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'parentPassportProof\\\', \\\'parentPassportProofimgIcon\\\', \\\'Signature\\\',\\\'${PROFILE_RESPONSE_DATA.userId}\\\',\\\'${PROFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button> 
                    </div>     
                </div>
            </div>
            <div class="upload-btn-wrapper" id="parentPassportProofdiv" data-pdfurl="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? data.parentPassportProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" style="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? 'display:none' : ''}">
                <input class="file-input" type="file" name="parentPassportProof" id="parentPassportProof" onchange="cropImage(event, 'parentPassportProof', 'parentPassportProofimgIcon', 'Signature', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
              
        </div>
    </div>`;
    return html;
}


function lastAcademicProofElement(data) {

    var html =
        `<div class="full">
        <span class="font-weight-semi-bold text-primary">Last Academic Proof:</span>
        <div class="d-flex">
            <div class="w-100" id="lastAcademicProofViewBtn" style="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? '' : 'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span class="bar_count" id="lastAcademicProofFileName">${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? data.lastAcademicProofName : ''}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.lastAcademicProofAttachmentType}\', 'lastAcademicProofdiv')">
                            <img id="lastAcademicProofimgIcon" class="full crop-uplod-img d-none" src="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? data.lastAcademicProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" alt="" thumbtype="${data.lastAcademicProofAttachmentType == "I" ? 'img' : 'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a>
                        <button id="lastAcademicProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? '' : 'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'lastAcademicProof\\\', \\\'lastAcademicProofimgIcon\\\', \\\'Last Academic Proof\\\',\\\'${PROFILE_RESPONSE_DATA.userId}\\\',\\\'${PROFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>    
                </div>
            </div>
            <div class="upload-btn-wrapper" id="lastAcademicProofdiv" data-pdfurl="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? data.lastAcademicProof : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" style="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? 'display:none' : ''}">
                <input class="file-input" type="file" name="lastAcademicProof" id="lastAcademicProof" onchange="cropImage(event, 'lastAcademicProof', 'lastAcademicProofimgIcon', 'Last Academic Proof', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
               
        </div>
    </div>`;
    return html;
}

// Academic Information Form Elements End Here


// Live Classes Preferred Timing Form Elements Start Here
function classesPreferredTimingInformation(data, customFields) {
    var html =
        `<div class="card mt-3 profile-section" id="classes_Preferred_Timing_information" data-section-count="1">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-clock font-12"></i>    
                            </span>
                            <span>4. Live Classes Preferred Timing</span>
                        </h5>
                    </div>
                    <div class="col-12" id="class-preferred-time-wrapper">
                        <ul class="p-0 d-flex flex-wrap">
                            ${getPreferredSlotContent(data)}
                        </ul>    
                    </div>
                    ${classPreferredTimingInformationForm()}
                </div>
                ${/*
                    <div class="form-row">`;
                        $.each(customFields, function(index, item){
                            html+=
                            `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                ${renderDynamicFieldByUserID(item, '', 3, "PROFILE_PAGE")}                    
                            </div>`;
                        });
                    html+=`</div>     
                */''}   
            </div>    
        </div>`;
    return html;
}

function classPreferredTimingInformationForm(){
    var html=
    `<div class="col-12" id="class-preferred-time-dropdown-wrapper" style="display:none">
            <div class="form-row">
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                    <select class="form-control form-control-sm fromTime" id="preferedStartTime">
                        ${generateTimeDropdown("12:00 AM", "11:59 PM", 10)}
                    </select>   
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                    <select class="form-control form-control-sm toTime" id="preferedEndTime">
                        ${generateTimeDropdown("12:00 AM", "11:59 PM", 10)}
                    </select>    
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                    <a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="saveClassPreferredTime(\'PROFILE\')">Save</a>     
                </div>
            </div>
        </div>
        <div class="col-12">
            <a href="javascript:void(0)" class="text-primary text-decoration-none addClassPreferredTimeBtn" onclick="addClassPreferredTime(this, 'class-preferred-time-dropdown-wrapper')">
                <i class="fa fa-plus"></i>&nbsp; Add Preferred Start Time - End Time    
            </a>    
        </div>`;
    return html;
}

function getPreferredSlotContent(data) {
    var html = ``;
    if (data.length > 0) {
        $.each(data, function (i, v) {
            html +=
            `<li class="mr-2 mb-2 bar_count" id="slot_${i + 1}" data-slot-st="${v.displayStartTime}" data-slot-et="${v.displayEndTime}" data-slot-id="${v.timePrefId}">
                <div class="d-inline-flex">
                    <span class="d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 text-primary">
                        <i class="fa fa-clock mr-1"></i>
                        <span class="font-weight-semi-bold">(${v.displayStartTime} - ${v.displayEndTime})</span>   
                    </span>    
                    <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="removeClassPreferredTime('slot_${i + 1}')">
                        <i class="fa fa-trash"></i>    
                    </a>    
                </div>    
            </li>`;
        });
    };
    return html;
}
// Live Classes Preferred Timing Form Elements End Here

// Sport & Extra Curriculars Form Elements Start Here
function sportAndExtraCurricularInformation(data) {
    var html =
        `<div class="card mt-3 mb-4 profile-section" id="sport_and_Extra_curriculars_information" data-section-count="1">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-calendar font-12"></i>    
                            </span>
                            <span>5. Sport & Extra Curriculars</span>
                        </h5>
                    </div>
                    <div class="col-12">
                        ${participateSportActivitiesElement(data, PROFILE_RESPONSE_DATA.studentStandardId, 'profileForm')}
                    </div>
                    <div class="col-12">
                        <hr/>    
                    </div>
                    <div class="col-12">
                        ${extracurricularActivitiesElement(data.sportsAndECList)}
                    </div>
                </div> 
                <div class="form-row mt-2">`;
                    $.each(data.customFields, function(index, item){
                        html+=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${renderDynamicFieldByUserID(item, item.fieldValue, 4, "PROFILE_PAGE")}                    
                        </div>`;
                    });
                html+=`</div>   
            </div>    
        </div>`;
    return html;
}

function participateSportActivitiesElement(data, studentStandardId, formID) {
    var html =
        `<div class="form-group mb-2 p-0">
        <div class="font-weight-semi-bold text-dark">"Please click 'Yes' if you participate in any sport or extracurricular activities."</div>
        <div class="full">
            <label class="switch">
                <input class="switch-input participateActivities" id="participateActivities" name="participateActivities" type="checkbox" value="N" onclick="confirmParticipateExtraCurricularActivity(this);" data-size="mini">
                <span class="switch-label" data-on="Yes" data-off="No"></span> 
                <span class="switch-handle"></span>
            </label>    
        </div>
    </div>
    <div class="form-group" id="eventTableListWrapper" style="display:none">
        <div class="w-100">
            <table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap bar_count" id="extraCurriculars">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>Sr. No.</th>
                        <th>Title Sport & Event</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${getJoinedSportsAndECList(data)}
                </tbody>
            </table>
        </div>
    </div>
    <div class="form-group" id="participateEventFormWrapper" style="display:none">
        <div class="form-row">
            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="custom-field-scope">
                    <div class="custom-field mb-2 mt-3 p-0">
                        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventTitle" id="eventTitle" placeholder=" " autocomplete="off">
                        <label for="eventTitle">Sport & Event Tilte</label>
                    </div>
                </div>
            </div>
            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="custom-field-scope">
                    <div class="custom-field mb-2 mt-3 p-0">
                        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventStartDate" id="eventStartDate" placeholder=" " autocomplete="off">
                        <label for="eventStartDate">Start Date</label>
                    </div>
                </div>
            </div>
            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="custom-field-scope">
                    <div class="custom-field mb-2 mt-3 p-0">
                        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventEndDate" id="eventEndDate" placeholder=" " autocomplete="off">
                        <label for="eventEndDate">End Date</label>
                    </div>
                </div>
            </div>
            <div class="col-xl-9 col-lg-8 col-md-8 col-sm-12 col-12">
                <div class="custom-field-scope">
                    <div class="custom-field mb-2 mt-3 p-0">
                        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventAddress" id="eventAddress" placeholder=" " autocomplete="off">
                        <label for="eventAddress">Address</label>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-12 text-sm-left text-right">
                <label class="font-weight-semi-bold text-dark full">&nbsp;</label>
                <a href="javascript:void(0)" class="btn btn-success btn-sm" id="addParticipateExtraCurricularActivityBtn" onclick="addParticipateExtraCurricularActivity(\'${formID}\', \'${studentStandardId}\')">Add & Save</a>
            </div>
        </div>    
    </div>`;
    return html;
}

function getJoinedSportsAndECList(data) {
    var html = ``;
    if (data.joinedSportsAndECList.length > 0) {
        $.each(data.joinedSportsAndECList, function (i, v) {
            html +=
            `<tr id="event_tr_${i + 1}" data-row-id="${v.id}">
                <td>${i + 1}</td>
                <td>${v.title}</td>
                <td>${v.startDate}</td>
                <td>${v.endDate}</td>
                <td>${v.address}</td>
                <td>
                    <a href="javascript:void(0)" class="btn btn-danger btn-sm" onclick="removeEvent(\'event_tr_${i + 1}\', 'extracurricular', 'extracurricular')">
                        <i class="fa fa-trash"></i>
                    </a>
                </td>
            </tr>`
        })
    }
    return html;
}

function extracurricularActivitiesElement(data) {
    var html =
        `<span class="font-weight-semi-bold w-100">Would you like to join any extracurricular activities:</span>
        <div class="d-flex flex-sm-nowrap flex-wrap sports-extra-curriculars-wrapper">
            <div class="d-inline-flex flex-wrap">`;
                if (data.length > 0) {
                    $.each(data, function (i, v) {
                        html +=
                        `<div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor">
                            <input type="checkbox" id="${v.sEclabel.replace(' ', '')}" name="${v.sEclabel.replace(' ', '')}" class="custom-control-input group-append-hide-input" ${v.assignActiveStudent == "Y" ? 'checked' : ''} data-index-id=${i} data-Id="${v.sportEcId}" data-status="${v.value}" data-title="${v.sEclabel}" check-status="${v.value == "Y" ? true : false}" onchange="controlEditField(this,this,${v.status == "Y" ? true : false},'extracurricular', '','', 4,'extracurricular')">
                            <label class="custom-control-label cursor font-weight-semi-bold" for="${v.sEclabel.replace(' ', '')}">${v.sEclabel}</label>
                        </div>`
                    });
                }
            html += `</div> 
        </div>
        <div class="w-100 text-right" id="saveSportsAndEcClubWrapper" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('extracurricular', 'extracurricular',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',4)">Save</a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="extraCurricularHobbies('extracurricular', 'extracurricular')">Cancel</a>
        </div>`;
    return html;
}
// Sport & Extra Curriculars Form Elements End Here

// Reserve an Enrollment Seat & Adv Course Form Elements Start Here
function reserveAnEnrollmentSeatAdvCourseInformation(data, standardStatus, enrollmentDetails) {
    console.log("data ==>", data)

    var html =
        `<div class="card mt-3 mb-4 profile-section" id="reserve_An_Enrollment_Seat_Adv_Course_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-file font-12"></i>    
                            </span>
                            <span>${USER_ROLE != "STUDENT" ? '6' : ''}. Reserve an Enrollment Seat & Advance Course Fee</span>
                        </h5>
                    </div>`;
                    if (standardStatus == "1") {
                        html +=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            <label for="reserveASeat" class="font-weight-semi-bold text-dark">Reserve a Seat</label>
                            <div class="input-group position-relative mb-2 p-0">
                                <select name="reserveASeat" id="reserveASeat" class="form-control form-control-sm group-append-hide-input" data-value="${data.reserveASeat}" onchange="controlEditField(this,'reserveASeat',\'${data.reserveASeat == "N" ? "0" : "1"}\','select','','', 5,'reserveASeat')">
                                    <option value="0" ${data.reserveASeat == "N" ? 'selected' : ''}>No</option>
                                    <option value="1" ${data.reserveASeat == "Y" ? 'selected' : ''}>Yes</option>
                                </select>
                                <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onClick="applyChanges(this,'reserveASeat','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false');" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('reserveASeat',\'${data.reserveASeat == "N" ? "0" : "1"}\','select','reserveASeat')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="full" style="overflow-x: auto">
                            <table id="bookEnrollment_table" class="table table-bordered border-radius-table font-12 responsive"
                                style="min-width: 550px;">
                                <thead class="theme-bg primary-bg white-txt-color">
                                    <tr>
                                        ${/*<th style ="width: 24%">Case</th>*/''}
                                        <th>Reserve an Enrollment Seat</th>
                                        <th>Enrollment Seat Validity </th>
                                        ${/*<th>Amount</th>*/''}
                                    </tr>
                                </thead>
                                <tbody>`;
                                    if(enrollmentDetails == null || enrollmentDetails.length < 1) {
                                        html +=`<tr>
                                            <td>No </td>
                                            <td>N/A</td>
                                        </tr>`;
                                    } else {
                                        $.each(enrollmentDetails, function (i, v) {
                                            html +=
                                            `<tr>
                                                ${/*<td>${enrollmentDaetail.paymentCase}</td>*/''}
                                                <td>${v.paymentStatus} ${v.advancePayment} </td>
                                                <td>${v.expiryDate}</td>
                                                ${/*<td>${enrollmentDaetail.amount}</td>*/''}
                                            </tr>`;
                                        });
                                    }
                                html +=`</tbody>
                            </table>
                        </div>
                        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${reenrollmentDiscountElement(data.reenrollmentDiscount)}
                        </div>`;
                    } else if (standardStatus == "0") {
                        html +=
                            `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            <label for="bookASeatNextGradeOpted" class="font-weight-semi-bold text-dark">Allow Reserve an Seat for Next Grade?</label>
                            <div class="input-group position-relative mb-2 p-0">
                                <select name="bookASeatNextGradeOpted" id="bookASeatNextGradeOpted" class="form-control form-control-sm group-append-hide-input" data-value="${data.bookASeatNextGradeOpted}" onchange="controlEditField(this,'bookASeatNextGradeOpted',\'${data.bookASeatNextGradeOpted == "N" ? "0" : "1"}\','select','','', 5,'bookASeatNextGradeOpted')">
                                    <option value="0" ${data.bookASeatNextGradeOpted == "N" ? 'selected' : ''}>No</option>
                                    <option value="1" ${data.bookASeatNextGradeOpted == "Y" ? 'selected' : ''}>Yes</option>
                                </select>
                                <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onClick="renderAndPermissionForAproval('bookASeatNextGradeOptedSpan','bookASeatNextGradeOpted','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false');" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('bookASeatNextGradeOpted',\'${data.bookASeatNextGradeOpted == "N" ? "0" : "1"}\','select','bookASeatNextGradeOpted')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            <label for="advanceGradeOpted" class="font-weight-semi-bold text-dark">Allow Course Fee Payment for Next Grade?</label>
                            <div class="input-group position-relative mb-2 p-0">
                                <select name="advanceGradeOpted" id="advanceGradeOpted" class="form-control form-control-sm group-append-hide-input" data-value="${data.advanceGradeOpted}" onchange="controlEditField(this,'advanceGradeOpted',\'${data.advanceGradeOpted == "N" ? "0" : "1"}\','select', '','', 5,'advanceGradeOpted')">
                                    <option value="0" ${data.advanceGradeOpted == "N" ? 'selected' : ''}>No</option>
                                    <option value="1" ${data.advanceGradeOpted == "Y" ? 'selected' : ''}>Yes</option>
                                </select>
                                <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="renderAndPermissionForAproval('advanceGradeOptedSpan', 'advanceGradeOpted',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('advanceGradeOpted',\'${data.advanceGradeOpted == "N" ? "0" : "1"}\','select','advanceGradeOpted')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${reenrollmentDiscountElement(data.reenrollmentDiscount)}
                        </div>`;
                    }
                html += `</div>    
            </div>    
        </div>`;
    return html;
}

function reenrollmentDiscountElement(data) {
    var html =
        `<label for="reenrollmentDiscount" class="font-weight-semi-bold text-dark">Re-enrolment Discount Validity</label>
    <div class="input-group mb-2 p-0" style="max-width: 320px;">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count custom-date-fields" name="reenrollmentDiscount" id="reenrollmentDiscount" value="${data != "" && data != undefined ? data : ''}" autocomplete="off" readonly keydown="return false" onchange="controlEditField(this,'reenrollmentDiscount',\'${data != "" && data != undefined ? data : ''}\','input', '','', 5,'reenrollmentDiscount')">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('reenrollmentDiscount', 'reenrollmentDiscount', \'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false',5)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('reenrollmentDiscount',\'${data != "" && data != undefined ? data : ''}\','input','reenrollmentDiscount')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function permissionForAprovalModal(elementFor, keyId, userId, studentStandardId, roleModuleId, moduleId, showWarning) {
    var html =
        `<div class="modal fade fade-scale" id="permissionModal" tabindex="-1" aria-hidden="true">'
		<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="width:600px">
			<div class="modal-content text-center">
				<div class="modal-header py-2 bg-primary">
					<h5 class="modal-title text-white">`;
                    if (keyId == 'bookASeatNextGradeOpted') {
                        html += 'Reserve a Seat for Next Grade';
                    } else {
                        html += 'Course Fee Payment for Next Grade';
                    }
                    html += `</h5>
					<button type="button" class="close remove-backdrop" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true" class="text-white">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="full py-3">`;
                        if (keyId == 'bookASeatNextGradeOpted') {
                            html += `<h5>Are you sure you want to enable "Reserve a Seat for Next Grade"? Please note that "Course Fee Payment for Next Grade" will be toggled to "NO".</h5>`;
                        } else if (keyId == 'advanceGradeOpted') {
                            html += `<h5>Are you sure you want to enable "Course Fee Payment for Next Grade"? Please note that "Reserve a Seat for Next Grade" will be toggled to "NO".</h5>`;
                        }
                    html +=`</div>
				</div>
				<div class="modal-footer">
					<div class="m-auto">
						<button type="button" class="btn btn-success mr-2" onclick="applyChanges(\'${elementFor}\',\'${keyId}\',\'${userId}\',\'${studentStandardId}\',\'${roleModuleId}\',\'${moduleId}\',\'${showWarning}\',5);">Confirm</button>
						<button type="button" class="btn btn-primary" onclick="hidePermissionAndApprovalModal(\'${keyId}\',\'cancel\')">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;
    return html;
}
// Reserve an Enrollment Seat & Adv Course Form Elements End Here

// Communication Log Form Elements Start Here
function communicationLogInformation(data) {
    var html =
        `<div class="card mt-3 mb-4" id="communication_Log_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-comments font-12"></i>    
                            </span>
                            <span>${USER_ROLE == "STUDENT" ? '6' : (SHOW_RESERVE_SEAT_SECTION ? '7' : '6')}. Communication Log</span>
                        </h5>
                    </div>
                    ${getAddCommunicationLogForm()}
                    <div class="col-12"><hr/></div>
                    <div class="w-100">
                        ${getAddCommunicationLogTable()}
                    </div>
                </div>    
            </div>    
        </div>`;
    return html;
}

function getAddCommunicationLogForm() {
    var html =
        `<div class="col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="position-relative form-group">
            <label for="logTitle">Title</label>
            <input name="logTitle" id="logTitle" placeholder="Title" type="text" value="" class="form-control form-control-sm">
        </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="position-relative form-group">
            <label for="reLeadStatus">Status</label>
            <select id="reLeadStatus" class="form-control form-control-sm"></select>
        </div>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12 col-12">
        <div class="position-relative form-group">
            <label for="fileuploadLog6">Attachment&nbsp;(if any)</label>
            <div class="file-upload">
                <div class="file-select form-control-sm p-0">
                    <div class="file-select-button" id="fileuploadLog6Label">Choose File</div>
                    <div class="file-select-name" id="fileuploadLog6Span">No file chosen...</div>
                    <input type="file" name="fileuploadLog6" id="fileuploadLog6" value="" class="form-control form-control-sm" onchange="cropImage(event,\'fileuploadLog6\',\'fileuploadimgIcon\',\'communicationLog\')">
                    <img id="fileuploadimgIcon" class="full crop-uplod-img d-none" src="${PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}" alt="" thumbtype="img">  
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
        <label for="commentEditor" title="Mandatory field">Comment<sup class="text-danger font-size-md"><b>*</b></sup></label>
        <textarea id="commentEditor"></textarea>
    </div>
    <div class="col-12 text-right mb-0 mt-3">
        <a href="javascript:void(0)" class="btn btn-sm btn-success" id="saveCommunicationLogBtn"  onclick="saveCommunicationLog(\'profileForm\')">Add & Save</a>
    </div>`;
    return html;
}

function getAddCommunicationLogTableHeader() {
    var html =
        `<thead class="bg-primary text-white">
		<tr>	
			<th>S.No.</th>
			<th>Title</th>
			<th>Status</th>
			<th>Comments</th>
			<th>Attachment</th>
			<th>Added by/Added At</th>
		</tr>
	</thead>`;
    return html;
}
function getAddCommunicationLogTablebody(result) {
    var html = '';
    $.each(result.commonCommentsDTO, function (k, v) {
        html +=
            `<tr id="commLog${v.commentId}">
            <td>${k + 1}</td>
            <td>${v.title}</td>
            <td>${v.status}</td>
            <td>${v.comments}</td>
            <td class="text-center">`;
                if(v.uploadFile != '' && v.uploadFile != 'No file chosen...') {
                    html += `<a target="_blank" href="${FILE_UPLOAD_PATH}${v.uploadFile}"><i class="fa fa-eye"></i></a>`;
                } else {
                    html += `N/A`;
                }
            html += `</td>
            <td>${v.addedByName + '/' + v.createdAt}</td>
        </tr>`;
    });
    return html;
}
function getAddCommunicationLogTable() {
    html =
        `<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="communicationLogTable"  style="width:100%;">
            ${getAddCommunicationLogTableHeader()}
            <tbody></tbody>
        </table>`
    return html;
}

function getCommunicationAttchFileModal() {
    var html =
        `<div class="modal fade" id="communicationattachModal" tabindex="-1">
		<div class="modal-dialog modal-sm modal-notify" role="document">
			<div class="modal-content text-center">
				<div class="modal-header">
					<h5 class="modal-title" >Attachment</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body delete-modal" style="padding-top:12px">
				</div>
				<div class="modal-footer text-right">
					<button type="button" class="btn bg-primary " data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>`
    return html;
}
// Communication Log Form Elements End Here

// Student School Email Information Starts Here
function studentEmailInformation(data) {
    if (!PROFILE_RESPONSE_DATA || (USER_ROLE !== "STUDENT" && USER_ROLE == "ADMIN")) {
        return "";
    }

    var azureUserStatus = data && data.azureUserStatus ? data.azureUserStatus : "N";
    var email = "";
    var password = "";
    var actionButtonHtml = "";

    if (azureUserStatus === "Y") {
        email = data && data.email ? data.email : "";
        password = data && data.password ? data.password : "";
        actionButtonHtml = `<button type="button" class="btn btn-sm btn-warning" onclick="resetStudentSchoolEmailPassword(this)" ${email ? "" : "disabled"}>Password Reset</button>`;
    } else {
        actionButtonHtml = `<button type="button" class="btn btn-sm btn-primary" onclick="showWarningMessageShow('Are you sure you want to activate your school User ID?', 'confirmActivateSchoolUserId()');">Activate your school user ID</button>`;
    }

    var html =
        `<div class="card mt-3 mb-4" id="student_Email_Information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2 d-flex align-items-center justify-content-between">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center mb-0">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-envelope font-12"></i>
                            </span>
                            <span>${USER_ROLE == "STUDENT" ? '6' : (SHOW_RESERVE_SEAT_SECTION ? '8' : '7')}. Student School Email Account</span>
                        </h5>
                        <div class="d-flex align-items-center ml-auto">
                            ${actionButtonHtml}
                        </div>
                    </div>

                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <div class="custom-field-scope">
                            <div class="position-relative form-group custom-field mb-2 mt-3 p-0">
                                <input type="text" id="studentSchoolEmail" class="form-control form-control-sm pr-5" value="${azureUserStatus == "Y"? email:''}" placeholder=" " disabled>
                                <label for="studentSchoolEmail">Email</label>
                                <button type="button" class="btn btn-sm p-0 bg-transparent border-0 position-absolute d-flex align-items-center" style="right:8px;top:50%;transform:translateY(-50%);" onclick="copyStudentCredentialValue('studentSchoolEmail', this)" ${email ? "" : "disabled"}>
                                    <span class="copy-status-msg d-none mr-1 text-success font-weight-bold">Copied!</span>
                                    <i class="fa fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-6 col-sm-12 col-12">
                        <div class="custom-field-scope">
                            <div class="position-relative form-group custom-field mb-2 mt-3 p-0">
                                <input type="text" id="studentSchoolPassword" class="form-control form-control-sm pr-5" value="${azureUserStatus == "Y"? password:''}" placeholder=" " disabled>
                                <label for="studentSchoolPassword">Password</label>
                                <button type="button" class="btn btn-sm p-0 bg-transparent border-0 position-absolute d-flex align-items-center" style="right:8px;top:50%;transform:translateY(-50%);" onclick="copyStudentCredentialValue('studentSchoolPassword', this)" ${password ? "" : "disabled"}>
                                    <span class="copy-status-msg d-none mr-1 text-success font-weight-bold">Copied!</span>
                                    <i class="fa fa-copy"></i>
                                </button>
                            </div>
                        </div>
                    </div>       
                </div>
            </div>
        </div>`;

    return html;
}


// Student School Email Information Ends Here

// Student Zoom Registration Control (Admin-side only)
function studentZoomRegistrationControl(data) {
    if (!SHOW_STUDENT_REGISTRATION_SECTION) {
        return "";
    }

    var commIndex = (USER_ROLE != "STUDENT" && SHOW_RESERVE_SEAT_SECTION) ? "7" : "6";
    var emailIndex = (USER_ROLE != "STUDENT" && SHOW_RESERVE_SEAT_SECTION) ? "8" : "7";
    var registrationIndex = (parseInt(emailIndex, 10) + 1).toString();

    var enableRegistration = data && data.enableRegistration ? data.enableRegistration : "N";
    var schoolEnableRegistration = data && data.schoolEnableRegistration ? data.schoolEnableRegistration : "N";

    var isOverriddenBySchool = (schoolEnableRegistration === "Y");
    var disableField = !(PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA.rightToEdit) || isOverriddenBySchool;

    var html = `
        <div class="card mt-3 mb-4" id="zoomRegistrationCard">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2 d-flex align-items-center justify-content-between">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center mb-0">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-video-camera font-12"></i>
                            </span>
                            <span>${USER_ROLE == "STUDENT" ? '6' : registrationIndex}. Enable Registration</span>
                        </h5>
                    </div>

                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                        <label for="enableRegistration" class="font-weight-semi-bold text-dark">Enable Registration (Y/N)</label>
                        <div class="input-group position-relative mb-2 p-0">
                            <select name="enableRegistration" id="enableRegistration" class="form-control form-control-sm group-append-hide-input"
                                data-value="${enableRegistration}"
                                onchange="controlEditField(this,'enableRegistration','${enableRegistration}','select','','', 7,'enableRegistration')"
                                ${disableField ? "disabled" : ""}>
                                <option value="N" ${enableRegistration === "N" ? "selected" : ""}>N</option>
                                <option value="Y" ${enableRegistration === "Y" ? "selected" : ""}>Y</option>
                            </select>
                            <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                                <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onClick="applyChanges('enableRegistration','enableRegistration','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false',7);" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                    <i class="fa fa-check"></i>
                                </a>
                                <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn" onclick="cancelChanges('enableRegistration','${enableRegistration}','select','enableRegistration')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                    <i class="fa fa-times"></i>
                                </a>
                            </div>
                        </div>
                        ${isOverriddenBySchool ? `<small class="text-muted">School setting is enabled, so student-level setting is overridden.</small>` : ``}
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}
function confirmActivateSchoolUserId() {
    activateYourSchoolEmail();
    window.open('http://outlook.office.com', '_blank');
}


function copyStudentCredentialValue(inputId, buttonElement) {
    var value = $("#" + inputId).val();
    if (!value || value === "N/A") {
        return;
    }

    var showCopiedMessage = function () {
        var $button = $(buttonElement);
        var $message = $button.find(".copy-status-msg");
        $("#student_Email_Information .copy-status-msg").addClass("d-none");
        $message.removeClass("d-none");
        setTimeout(function () {
            $message.addClass("d-none");
        }, 1500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(showCopiedMessage);
    } else {
        var tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        showCopiedMessage();
    }
}

async function resetStudentSchoolEmailPassword(buttonElement) {
    if (!PROFILE_RESPONSE_DATA || !PROFILE_RESPONSE_DATA.userId) {
        return;
    }
    $(buttonElement).prop("disabled", true);
    var payload = {
        userId: PROFILE_RESPONSE_DATA.userId,
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/reset-azure-password-notify-primary-mail",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if (responseData && responseData.status == 1) {
        showMessageTheme2(1, responseData.message || "Password reset request sent successfully.");
    } else {
        showMessageTheme2(0, responseData && responseData.message ? responseData.message : "Unable to reset student school email password.");
    }
    $(buttonElement).prop("disabled", false);
}

function cropperImageModalContent() {
    var html =
        `<div class="modal fade" id="cropModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modalLabel">Crop the image</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="img-container">
                            <img id="cropModalImg" src="https://avatars0.githubusercontent.com/u/3456749" class="w-100">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary " data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="crop">Crop</button>
                        <button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function serverMessageContent() {
    var html =
        '<div class="server-message">'
        + '<span class="msg" id="msgTheme2"></span>'
        + '</div>';
    return html;
}


function changeLearingProgramGradeModalContent(data) {
    var html =
        `<div class="modal fade" id="changeLearingProgramGradeModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white py-2 px-3">
                <h5 class="modal-title">Change Learning Program, Grade, and LMS Platform</h5>
            </div>
            <div class="modal-body">
                <form id="changeLearingProgramGradeForm" action="javascript:void(0);">
                    <div class="row">
                        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 registrationTypeWrapper">
                            <label class="m-0">Learning Program</label>
                            <select id="studentRegistrationType" class="title-select-dropdown-register form-control">
                                ${getLearningProgramContent(SCHOOL_ID)}
                            </select>
                        </div>
                        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 standardIdWrapper">
                            <label class="m-0">Grade</label>
                            <select id="standardId" class="title-select-dropdown-standard form-control"></select>
                        </div>
                        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 lmsPlatformWrapper">
                            <label class="m-0">LMS Platform</label>
                            <select id="lmsPlatform" class="title-select-dropdown-lms form-control">
                                ${getLmsPlatformContent(SCHOOL_ID)}
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger " data-dismiss="modal">Close</button>
                ${data.marksPublishedStatus != "Y" ? `<button onclick="openConfirmSaveModal();" type="button" class="btn btn-success" id="changeLearningProgamGradePlatformId">Save</button>` : ``}
            </div>
        </div>
        </div>
    </div>`;
    return html;
}

function confirmSaveModalContent(data) {
    var html =
        `<div class="modal fade" id="confirmSaveModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white py-2 px-3">
                    <h5 class="modal-title">Complete Your Profile</h5>
                </div>
                <div class="modal-body">
                    <h5 class="text-center">Are you sure you want to save your changes?</h5>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="confirmSaveBtn" onclick="changeLearningProgamGradePlatformModal('${data.studentStandardId}')">Yes, Save</button>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function getChunkProfileDataByUserModalContent(data) {
    var html =
        `<div class="modal fade" id="profileFielddModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white py-2 px-3">
                    <h5 class="modal-title">Complete Your Profile</h5>
                </div>
                <div class="modal-body">
                    <form method="post" autocomplete="off" action="javascript:void(0);" id="requestProfileForm"></form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" onclick="stopProfileDataInterval(\'profileFielddModal\')">Cancel</button>
                    <a href="javascript:void(0);" onclick="saveBulkProfileData(\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\',\'student\')" class="btn btn-success rounded"><i class="fa fa-save mr-1" aria-hidden="true"></i>Yes, Save</a>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}


function getClassAndActivityStartWarningModalContent() {
    var html =
        `<div class="modal fade" id="classAndActivityStartWarningModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-md" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white py-2 px-3">
                <h5 class="modal-title"><i class="fa fa-info-circle"></i>&nbsp;Notification</h5>
                </div>
                <div class="modal-body text-center py-5"></div>
                <div class="modal-footer">
                <button type="button" class="btn btn-success" data-dismiss="modal">Yes</button>
                <button type="button" class="btn btn-danger" onclick="closeProfileModal()">No</button>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}


function renderDynamicFieldByUserID(fieldConfig, value = "", index, callFrom) {

    const {
        fieldId,
        labelName,
        fieldType,
        inputType,
        options
    } = fieldConfig;

    const oldValue = value || '';

    let html = '';

    // ================= INPUT TEXT =================
    if (fieldType === 'input' && inputType === 'text') {
        html = `
        <div class="custom-field-scope">
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <input type="text"
                class="form-control form-control-sm group-append-hide-input"
                id="${fieldId}"
                value="${oldValue}"
                placeholder=" "
                onkeyup="controlEditField(this,'${fieldId}','${oldValue}','input', '', '', ${index}, \'customProfileFieldId\','')" data-element-id="${callFrom == "PROFILE_PAGE" ? fieldConfig.id:fieldConfig.customProfileFieldId}">
            <label for="${fieldId}">${labelName}</label>

            <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn"
                    onclick="applyChanges('${fieldId}','customProfileFieldId','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn"
                    onclick="cancelChanges('${fieldId}','${oldValue}','input','${fieldId}')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
        </div>`;
    }

    // ================= DATEPICKER =================
    else if (fieldType === 'input' && inputType === 'date') {
        html = `
        <div class="custom-field-scope">
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <input type="text"
                class="form-control form-control-sm group-append-hide-input custom-date-fields"
                id="${fieldId}"
                value="${oldValue}"
                placeholder=" "
                readonly
                onchange="controlEditField(this,'${fieldId}','${oldValue}','input', '', '', ${index}, \'customProfileFieldId\','')" data-element-id="${callFrom == "PROFILE_PAGE" ? fieldConfig.id:fieldConfig.customProfileFieldId}">
            <label for="${fieldId}">${labelName}</label>

            <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn"
                    onclick="applyChanges('${fieldId}','customProfileFieldId','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false',0)" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn"
                    onclick="cancelChanges('${fieldId}','${oldValue}','input','${fieldId}')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
        </div>`;
    }

    // ================= FILE =================
    else if (fieldType === 'input' && inputType === 'file') {

		const hasFile = value && value !== "";
		const fileName = fieldConfig.fieldValue || '';
		const attachmentType = fieldConfig.attachmentType || 'I';

		html = `
		<div class="full mb-2">
			<label class="font-weight-semi-bold text-primary">${labelName}:</label>

			<div class="d-flex">

				<!-- VIEW MODE -->
				<div class="w-100" id="${fieldId}ViewBtn" style="${hasFile ? '' : 'display:none'}">
					<div class="d-flex w-100 align-items-center">

						<div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
							<span class="bg-light-primary rounded-circle mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
								<i class="fa fa-file text-primary"></i>    
							</span>

							<span class="bar_count" id="${fieldId}FileName">
								${fileName}
							</span>    
						</div>

						<div class="d-inline-flex">

							<!-- VIEW -->
							<a href="javascript:void(0)" 
							class="btn btn-success btn-sm mr-1 view-btn"
							onclick="viewAttachmentProfile(this, 'uploadFile','${attachmentType}','${fieldId}div')">

								<img id="${fieldId}imgIcon"
									class="full crop-uplod-img d-none"
									src="${hasFile ? fieldConfig.customFieldURL : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}"
									thumbtype="${attachmentType === 'I' ? 'img' : 'pdf'}">

								<i class="fa fa-eye"></i>    
							</a>  

							<!-- REMOVE -->
							<button type="button"
								class="btn btn-danger btn-sm"
								id="${fieldId}Remove"
								style="${hasFile ? '' : 'display:none'}"
								onclick="showWarningMessageShow(
									'Are you sure you want to remove this document?',
									'removeUploadImage(this, \\'${fieldId}\\', \\'${fieldId}imgIcon\\', \\'${labelName}\\', \\'${PROFILE_RESPONSE_DATA.userId}\\', \\'${PROFILE_RESPONSE_DATA.studentStandardId}\\', \\'new\\')'
								)">
								<i class="fa fa-trash"></i>
							</button>

						</div>   
					</div>
				</div>

				<!-- UPLOAD -->
				<div class="upload-btn-wrapper"
					id="${fieldId}div"
					data-pdfurl="${hasFile ? fieldConfig.customFieldURL : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}"
					style="${hasFile ? 'display:none' : ''}">

					<input type="file"
						class="file-input group-append-hide-input"
						id="${fieldId}"
						onchange="cropImage(event,'${fieldId}','${fieldId}imgIcon','CUSTOM_FILE','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}',true)" data-element-id="${callFrom == "PROFILE_PAGE" ? fieldConfig.id:fieldConfig.customProfileFieldId}">

					<span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded justify-content-center">
						<i class="fa fa-upload"></i>&nbsp;Upload
					</span>
				</div>

			</div>
		</div>`;
	}

    // ================= DROPDOWN =================
    else if (fieldType === 'dropdown') {
        var optionsHtml = `<option value="">Select</option>`;
        $.each(options, function(i, opt) {
            const selected = opt.optionValue.replace(/\s+/g, '_').toUpperCase() == oldValue ? 'selected' : '';
            var value = opt.optionValue.replace(/\s+/g, '_').toUpperCase();
            optionsHtml += `<option value="${value}" ${selected}>${opt.optionValue}</option>`;
        });

        html = 
        `<div class="custom-field-scope">
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <select id="${fieldId}"
                class="form-control form-control-sm group-append-hide-input"
                onchange="controlEditField(this,'${fieldId}','${oldValue}','select', '', '', ${index}, \'customProfileFieldId\','')" data-element-id="${callFrom == "PROFILE_PAGE" ? fieldConfig.id:fieldConfig.customProfileFieldId}">
                ${optionsHtml}
            </select>
            <label for="${fieldId}">${labelName}</label>

            <div class="input-group-append input-group-append-hide position-absolute" style="display:none;right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                <a href="javascript:void(0)" class="btn btn-sm btn-success rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn"
                    onclick="applyChanges('${fieldId}','customProfileFieldId','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false',${index})" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center profile-input-action-btn"
                    onclick="cancelChanges('${fieldId}','${oldValue}','select','${fieldId}')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
        </div>`;
    }

    // ================= CHECKBOX =================
    else if (fieldType === 'checkbox') {

        let optionsHtml = '';
        var labelNameTrim = labelName.replace(/\s+/g, '');
        $.each(options, function(i, opt) {

            const id = `${fieldId}_${i}`;
            const checked = Array.isArray(oldValue) && oldValue.includes(opt.optionValue) ? 'checked' : '';
            optionsHtml += `
            <div class="custom-control custom-checkbox mr-3 mb-2 ${labelNameTrim}_value_wrapper">
                <input type="checkbox"
                    id="${id}"
                    class="custom-control-input group-append-hide-input"
                    ${checked}
                    onchange="controlEditField(this,'${id}','${oldValue}','custom', '', '', ${index}, \'${labelName}\','')" data-element-type="checkbox" data-save-wrapper="custom_${labelNameTrim}_wrapper">

                <label class="custom-control-label" for="${id}">${opt.optionValue}</label>
            </div>`;
        });

        html = 
        `<div>
            <span class="font-weight-semi-bold">${labelName}:</span>
            <div class="d-flex flex-wrap">${optionsHtml}</div>
            <div class="text-right input-group-append-hide" id="custom_${labelNameTrim}_wrapper" style="display:none">
                <a href="javascript:void(0)" class="btn btn-sm btn-success"
                    onclick="applyChanges('${fieldId}','${fieldId}','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false',${index})">
                    Save
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger mx-1"
                    onclick="cancelChanges('${fieldId}','${oldValue}','checkbox','${fieldId}')">
                    Cancel
                </a>
            </div>
        </div>`;
    }

    // ================= RADIO =================
    else if (fieldType === 'radio') {

        let optionsHtml = '';
        var labelNameTrim = labelName.replace(/\s+/g, '');
        $.each(options, function(i, opt) {

            const id = `${fieldId}_${i}`;
            const checked = opt == oldValue ? 'checked' : '';
            
            optionsHtml += `
            <div class="custom-control custom-radio mr-3 mb-2 ${labelNameTrim}_value_wrapper">
                <input type="radio"
                    name="${fieldId}"
                    id="${id}"
                    class="custom-control-input group-append-hide-input"
                    ${checked}
                    onchange="controlEditField(this,'${id}','${oldValue}','custom', '', '', ${index}, \'${labelName}\','')" data-element-type="radio" data-save-wrapper="custom_${labelNameTrim}_wrapper">

                <label class="custom-control-label" for="${id}">${opt.optionValue}</label>
            </div>`;
        });

        html = 
        `<div>
            <span class="font-weight-semi-bold">${labelName}:</span>
            <div class="d-flex flex-wrap">${optionsHtml}</div>

            <div class="text-right input-group-append-hide" id="custom_${labelNameTrim}_wrapper" style="display:none">
                <a href="javascript:void(0)" class="btn btn-sm btn-success"
                    onclick="applyChanges('${fieldId}','${fieldId}','${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}','${PROFILE_RESPONSE_DATA.moduleId}','student','false',0)">
                    Save
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger mx-1"
                    onclick="cancelChanges('${fieldId}','${oldValue}','radio','${fieldId}')">
                    Cancel
                </a>
            </div>
        </div>`;
    }

    return html;
}

function getProfileSectionRenderIndex(sectionTitle) {
    var sectionIndexMap = {
        "Personal Information": 0,
        "Parent Information": 1,
        "Academic Information": 2,
        "Live Classes Preferred Timing": 3,
        "Sport & Extra Curriculars": 4
    };
    return sectionIndexMap[sectionTitle] !== undefined ? sectionIndexMap[sectionTitle] : 0;
}
