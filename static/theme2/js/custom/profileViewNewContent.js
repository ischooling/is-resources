var PORFILE_RESPONSE_DATA;
var PORFILE_RESPONSE_UPDATED_DATA;
async function renderUserProfilePage(extraParam){
    if($("#profileFielddModal").length>0){
        $("#profileFielddModal").remove();
    }
    PORFILE_RESPONSE_DATA = await getDashboardDataBasedUrlAndPayload(true, true, 'profile-view-content-new?payload='+extraParam, '');
    console.log(PORFILE_RESPONSE_DATA)
    if(Object.keys(PORFILE_RESPONSE_DATA.profileData).length<1){
        showMessageTheme2(0, "No Data found")
    }else{
        var data = PORFILE_RESPONSE_DATA.profileData.studentProfile;
        PORFILE_RESPONSE_UPDATED_DATA = data;
        console.log(data);
        if($("#cropModal").length<1){
            $("body").append(cropperImageModalContent());
        }
        if($("#confirmSaveModal").length>0){
            $("#confirmSaveModal").remove();
        }
        $("body").append(viewUploadFileModal()+changeLearingProgramGradeModalContent(data[2])+confirmSaveModalContent(PORFILE_RESPONSE_DATA)+getCommunicationAttchFileModal());
        // if(USER_ROLE == "STUDENT"){

        // }else{

        // }
        var html= getProfilePageContent(data);
        $("#dashboardContentInHTML").hide();
        $("#dashboardContentInHTMLAdditional").html(getProfilePageHeader()+html).show();
        checkJoinedSports(data[4]);
        profileViewPageLoadEvent(data);
    }
}

function getProfilePageHeader(){
    var html=
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-user text-primary"></i>
                    </div>
                    <div>Profile</div>
                </div>
                <div class="page-title-actions">
                    <a href="javascript:void(0);" onclick="backToMain(\'manageAdvanceStudentContent\');" class="btn btn-dark rounded"><i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>${USER_ROLE == "DIRECTOR" ? 'Back Manage User List':'Back'}</a>
                </div>
            </div>
        </div>`;
    return html;
}

function getProfilePageContent(data){
    var html=
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
                                                        <div class="user-img admin-proifle m-0 box-shadow-none text-center m-1 d-flex align-items-center justify-content-center" style="max-width:95px;border:1px solid !important;height:95px">
                                                            <img id="profileImageStudent" name="profileImageStudent" class="user profile-pic" src="${data[0].profilePic}" alt="image" title="Profile Image" thumbtype="" style="max-width:90px;width:90px; height:90px;">
                                                        </div>    
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-center font-weight-bold font-size-lg" id="circle-percentage-text"></div>
                                    </div>
                                </div>
                                <div class="pl-0">
                                    <div class="profile-name text-white font-weight-semi-bold font-size-lg mt-2 userNameLabel">${data[0].firstName} ${data[0].lastName}</div>
                                    <div class="edit-user-img trans5s w-fit-content" style="position: relative;bottom: 0;opacity: 1;visibility: visible">
                                        <input class="file-input w-100" type="file" name="profilePicture" id="profilePicture" onchange="cropImage(event, \'profilePicture\', \'profileImageStudent\', \'Profile Image\', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\', false)" style="height:22px;">
                                        <span class="upload-img-btn bg-transparent text-white p-0 text-left">Change Profile Photo</span>
                                    </div>
                                </div>
                            </div>   
                        </div>`;
                        html+=profileSectionTabs();
                    html+=`</div>
                    <div class="col-xl-9 col-lg-8 col-md-12 col-sm-12 col-12 overflow-y-auto overflow-x-hidden profile-right-section position-relative">
                            <input type="hidden" id="timezoneInput" value="${data[0].timezoneName}" />`;
                            html+=personalInformation(data[0]);
                            html+=guardianInformation(data[1]);
                            html+=academicInformation(data[2]);
                            html+=classesPreferredTimingInformation(data[3].prefTimeList)
                            html+=sportAndExtraCurricularInformation(data[4]);
                            if(USER_ROLE != "PARENT" && USER_ROLE != "STUDENT"){
                                html+=reserveAnEnrollmentSeatAdvCourseInformation(data[5], PORFILE_RESPONSE_DATA.standardStatus, PORFILE_RESPONSE_DATA.enrollmentDetails)
                            }
                            html+=`<div class="full" id="communicationLogDIV"></div>`
                            // html+=communicationLogInformation(data)
                        html+=`
                    </div>
                </form>
            </div>    
        </div>`;
    return html;
}

function profileSectionTabs(){
    var html=
    `<div class="full mt-3">
        <ul class="m-0 p-0">
            <li class="bg-white border border-top-left-rounded rounded-top-left-10 rounded-top-right-10 overflow-hidden">
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
            ${
                USER_ROLE != "STUDENT" ? 
                `<li class="bg-white border border-top-left-rounded">
                    <a href="#reserve_An_Enrollment_Seat_Adv_Course_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                        <div class="text-dark font-weight-bold flex-grow-1">${USER_ROLE != "STUDENT" ? '6':''}. Reserve an Enrollment Seat & Advance Course Fee</div>
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
                </li>`:``
            }
            
            <li class="bg-white border border-top-left-rounded rounded-bottom-left-10 rounded-bottom-right-10 overflow-hidden">
                <a href="#communication_Log_information" class="d-flex align-items-center py-1 px-3 text-decoration-none bg-light-hover profile-selection-list-anchor">
                    <div class="text-dark font-weight-bold flex-grow-1">${USER_ROLE == "STUDENT" ? '6':'7'}. Communication Log</div>
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
        </ul>   
    </div>`;
    return html;
}

function personalInformation(data){
    var html=
        `<div class="card" id="personal_information">
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
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=firstNameElement(data.firstName)
					html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=middleNameElement(data.middleName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=lastNameElement(data.lastName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=genderElement(data.gender)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=dobElement(data.dob)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=phoneNumberElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=altPhoneNumberElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=studentEmailIdElement(data.studentEmailId)
                    html+=`</div>    
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=altEmailIdElement(data.altEmailId)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=countryElement(data.country)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=stateElement(data.state)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=cityElement(data.city)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=timezoneElement(data.timezone)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=nationalityElement(data)
                    html+=`</div>
                    <div class="col-12">`;
                        html+=addressElement(data.address)
                    html+=`</div>
                    <div class="col-12 mt-2">`;
                        html+=hobbiesContent(data.hobbies)
                    html+=`</div>
                    <div class="col-12 mt-2">`;
                        html+=addOtherHobbiesContent(data)
                    html+=`</div>
                    <div class="col-12 mt-2">`;
                        html+=socialMedaiLinksContent(data.socialMedia)
                    html+=`</div>
                </div>    
            </div>    
        </div>`;
    return html;
}


// Personal Information Form Elements Start Here

function firstNameElement(data){
    var html=
    `<label for="firstName" class="font-weight-semi-bold text-dark">First Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="firstName" id="firstName" value="${data != "" && data != undefined ?data:''}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this, 'firstName',\'${data != "" && data != undefined ?data:''}\','input', '','', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('firstName', 'firstName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('firstName',\'${data != "" && data != undefined ?data:''}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function middleNameElement(data){
    var html=
    `<label for="middleName" class="font-weight-semi-bold text-dark">Middle Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="middleName" id="middleName" value="${data != "" && data != undefined ?data:''}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this, 'middleName',\'${data != "" && data != undefined ?data:''}\','input', '','', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('middleName', 'middleName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('middleName',\'${data != "" && data != undefined ?data:''}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function lastNameElement(data){
    var html=
    `<label for="lastName" class="font-weight-semi-bold text-dark">Last Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="lastName" id="lastName" value="${data != "" && data != undefined ?data:''}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this, 'lastName',\'${data != "" && data != undefined ?data:''}\','input', '','', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('lastName', 'lastName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('lastName',\'${data != "" && data != undefined ?data:''}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function genderElement(data){
    var html=
    `<label for="gender" class="font-weight-semi-bold text-dark">Gender</label>
    <div class="input-group mb-2 p-0">
        <select id="gender" name="gender" class="form-control form-control-sm group-append-hide-input bar_count" onchange="controlEditField(this, 'gender',\'${data != "" && data != undefined ?data:''}\','input','','', 0)">
            ${getGenderContent()}   
        </select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('gender', 'gender', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('gender',\'${data != "" && data != undefined ?data:''}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function dobElement(data){
    var html=
    `<label for="dob" class="font-weight-semi-bold text-dark">Date of Birth</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="dob" id="dob" value="${data != "" && data != undefined ?data:''}" autocomplete="off" readonly keydown="return false" ${USER_ROLE == "DIRECTOR"?'':'disabled'} onchange="controlEditField(this,'dob',\'${data != "" && data != undefined ?data:''}\','input', '','', 0)">`;
        if(USER_ROLE != "STUDENT"){
            html+=
            `<div class="input-group-append input-group-append-hide" style="display:none">
                <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('dob', 'dob', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('dob',\'${data != "" && data != undefined ?data:''}\','input')">
                    <i class="fa fa-times"></i>
                </a>
            </div>`;
        }
        
    html+=`</div>`;
    return html;
}

function phoneNumberElement(data){
    var html=
    `<div class="d-flex flex-wrap">
        <label for="phoneNumber" class="font-weight-semi-bold text-dark">Phone</label>    
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto d-inline-flex align-items-center">
            <input type="checkbox" id="phoneNumberWhatsAppStatus" class="custom-control-input" ${data.phoneNumberWhatsAppStatus != "N" && data.phoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.phoneNumberWhatsAppStatus != "N" && data.phoneNumberWhatsAppStatus != undefined?true:false}" onchange="availableOnWhatsApp(this, 'phoneNumber',\'${data.phoneNumber != "" && data.phoneNumber != undefined?data.phoneNumber:""}\','input',\'${data.phoneNumberCountryCode != "" && data.phoneNumberCountryCode != undefined ? data.phoneNumberCountryCode:"us"}\',0)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="phoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
                Available on WhatsApp
            </label>
        </div>    
    </div>
    <div class="input-group mb-2 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="phoneNumber" id="phoneNumber" value="${data.phoneNumber != "" && data.phoneNumber != undefined? data.phoneNumber:""}" autocomplete="off" data-idList="phoneNumber_phoneNumberWhatsAppStatus_phoneNumberCountryCode" onkeydown="return M.digit(event);"  onkeyup="controlEditField(this,'phoneNumber',\'${data.phoneNumber != "" && data.phoneNumber != undefined? data.phoneNumber:""}\','inputPhone', 'phoneNumberWhatsAppStatus',\'${data.phoneNumberCountryCode != "" && data.phoneNumberCountryCode != undefined ? data.phoneNumberCountryCode:""}\', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('phoneNumber', 'phoneNumber', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('phoneNumber',\'${data.phoneNumber != "" && data.phoneNumber != undefined? data.phoneNumber:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function altPhoneNumberElement(data){
    var html=
    `<div class="d-flex flex-wrap">
        <label for="altPhoneNumber" class="font-weight-semi-bold text-dark">Alternate Phone</label>    
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto d-inline-flex align-items-center">
            <input type="checkbox" id="altPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.altPhoneNumberWhatsAppStatus != "N" && data.altPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.altPhoneNumberWhatsAppStatus != "N" && data.altPhoneNumberWhatsAppStatus != undefined ?true:false}"  onchange="availableOnWhatsApp(this, 'altPhoneNumber',\'${data.altPhoneNumber != "" && data.altPhoneNumber != undefined?data.altPhoneNumber:""}\','input',\'${data.altPhoneNumberCountryCode != "" && data.altPhoneNumberCountryCode != undefined ? data.altPhoneNumberCountryCode:"us"}\',0)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="altPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
                Available on WhatsApp
            </label>
        </div>    
    </div>
    <div class="input-group mb-2 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="altPhoneNumber" id="altPhoneNumber" value="${data.altPhoneNumber !="" && data.altPhoneNumber != undefined? data.altPhoneNumber:""}" autocomplete="off" data-idList="altPhoneNumber_altPhoneNumberWhatsAppStatus_altPhoneNumberCountryCode" onkeydown="return M.digit(event);" onkeyup="controlEditField(this,'altPhoneNumber',\'${data.altPhoneNumber !="" && data.altPhoneNumber != undefined? data.altPhoneNumber:""}\','inputPhone', 'altPhoneNumberWhatsAppStatus',\'${data.altPhoneNumberCountryCode != "" && data.altPhoneNumberCountryCode != undefined?data.altPhoneNumberCountryCode:""}\', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('altPhoneNumber', 'altPhoneNumber', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('altPhoneNumber',\'${data.altPhoneNumber !="" && data.altPhoneNumber != undefined ? data.altPhoneNumber:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function studentEmailIdElement(data){
    var html=
    `<label for="studentEmailId" class="font-weight-semi-bold text-dark">Email</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="studentEmailId" id="studentEmailId" value="${data != "" && data != undefined ?data:""}" ${USER_ROLE != "STUDENT" && PORFILE_RESPONSE_DATA.rightToEdit?'':'disabled'} autocomplete="off" onkeyup="controlEditField(this,'studentEmailId',\'${data != "" && data != undefined ?data:""}\','input', '','', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('studentEmailId', 'studentEmailId', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('studentEmailId',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function altEmailIdElement(data){
    var html=
    `<label for="altEmailId" class="font-weight-semi-bold text-dark">Alternate Email</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input" name="altEmailId" id="altEmailId" value="${data != "" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'altEmailId',\'${data != "" && data != undefined ?data:""}\','input', '','', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('altEmailId', 'altEmailId', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('altEmailId',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function countryElement(data){
    var html=
    `<label for="country" class="font-weight-semi-bold text-dark">Country</label>
    <div class="input-group mb-2 p-0">
        <select id="country" name="country" class="form-control form-control-sm group-append-hide-input bar_count" data-country="country_state_city" onchange="controlEditField(this,'country',\'${data != "" && data != undefined ?data:""}\','select', '','', 0)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('country', 'countrySection',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('country',\'${data != "" && data != undefined ?data:""}\','countrySection')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function stateElement(data){
    var html=
    `<label for="state" class="font-weight-semi-bold text-dark">State</label>
    <div class="input-group mb-2 p-0">
        <select id="state" name="state" class="form-control form-control-sm group-append-hide-input bar_count" data-country="state_city" onchange="controlEditField(this,'state',\'${data != "" && data != undefined ?data:""}\','select', '','', 0)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('country', 'countrySection',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('state',\'${data != "" && data != undefined ?data:""}\','countrySection')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function cityElement(data){
    var html=
    `<label for="city" class="font-weight-semi-bold text-dark">City</label>
    <div class="input-group mb-2 p-0">
        <select id="city" name="city" class="form-control form-control-sm group-append-hide-input bar_count" data-country="city" onchange="controlEditField(this,'city',\'${data != "" && data != undefined ?data:""}\','select', '','', 0)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('country', 'countrySection',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('city',\'${data != "" && data != undefined ?data:""}\','countrySection')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function timezoneElement(data){
    var html=
    `<label for="timezone" class="font-weight-semi-bold text-dark">Timezone</label>
    <div class="input-group mb-2 p-0">
        <select id="timezone" name="timezone" class="form-control form-control-sm group-append-hide-input bar_count"  onchange="controlEditField(this,'timezone',\'${data != "" && data != undefined ?data:""}\','select', '','', 0)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('timezone', 'timezone',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','true',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('timezone',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function nationalityElement(data){
    var html=
    `<label for="nationality" class="font-weight-semi-bold text-dark">Nationality</label>
    <div class="input-group mb-2 p-0">
        <select id="nationality" name="nationality" class="form-control form-control-sm group-append-hide-input bar_count" onchange="controlEditField(this,'nationality',\'${data.nationalityId != "" && data.nationalityId != undefined ?data.nationalityId:""}\','select', '','', 0)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('nationality', 'nationality',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','true',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('nationality',\'${data.nationalityId != "" && data.nationalityId != undefined ?data.nationalityId:""}\','select')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function addressElement(data){
    var html=
    `<label for="address" class="font-weight-semi-bold text-dark">Address</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="address" id="address" value="${data !="" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'address',\'${data !="" && data != undefined ?data:""}\','input', '','', 0)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('address', 'address',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('address',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function hobbiesContent(data){
    var html=
    `<div class="d-flex flex-sm-nowrap flex-wrap">
        <span class="font-weight-semi-bold">Hobbies:&nbsp;</span>
        <div class="hobbies-wrapper d-inline-flex flex-wrap bar_count">`;
            if(data.length>0){
                $.each(data, function(i,v){
                    if("H_"+v.id != "H_Other"){
                        // var key = Object.keys(v);
                        // key=key[0];
                        html+=
                        `<div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mr-3 mb-2 cursor hobbie-wrapper">
                            <input type="checkbox" id="${v.id}" class="custom-control-input group-append-hide-input" ${v.status == "Y"?'checked':''} data-hobbie-keyId="${v.hobbiesId}" data-hobbie-label="${v.hobbiesLabel}" check-status="${v.status == "Y"?true:false}" onchange="controlEditField(this,this,${v.status == "Y"?true:false},'hobbies', '','', 0)">
                            <label class="custom-control-label cursor" for="${v.id}">${v.hobbiesLabel}</label>
                        </div>`;
                    }
                    
                });
            }
        html+=`</div>
    </div>
    <div class="w-100 text-right" id="saveHobbiesWrapper" style="display:none">
        <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('hobbies', 'hobbies',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">Save</a>
        <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelHobbies()">Cancel</a>
    </div>`;
    return html;
}

function addOtherHobbiesContent(data){
    var html=
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

function socialMedaiLinksContent(data){
    var html=
    `<div class="form-row">
        <div class="col-12 mb-2">
            <span class="font-weight-semi-bold text-dark">Social Media Links</span>    
        </div> 
    </div> 
    <div class="form-row social-links-wrapper bar_count">`;
        if(data.length>0){
            $.each(data, function(i,v){
                // if(i != 0){
                    html+=
                    `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 social-links-list-wrapper">
                        <div class="form-group mb-2 p-0">
                            <label for="${v.socMedLabel}URL" class="font-weight-semi-bold social-links-title" data-title="${v.socMedLabel}">
                                <span>
                                    ${getSocialIcon(v.socMedLabel) == undefined?"": getSocialIcon(v.socMedLabel)}
                                </span>`;
                                if(v.socMedLabel == "Twitter"){
                                    html+=`X(${v.socMedLabel}) Profile URL`
                                }else{
                                    html+=`${v.socMedLabel} Profile URL`
                                }
                            html+=`</label>
                            <div class="input-group mb-2 p-0">
                                <input type="text" class="form-control form-control-sm social-Links-url group-append-hide-input" data-social-media-id="${v.socialMediaMasterId}" name="${v.socMedLabel}URL" id="${v.socMedLabel}URL" value="${v[v.socMedLabel + '_URL'] != ""?v[v.socMedLabel + '_URL']:""}" autocomplete="off" onkeyup="controlEditField(this, \'${v.socMedLabel}URL\',\'${v[v.socMedLabel + '_URL'] != ""?v[v.socMedLabel + '_URL']:""}\','socialMedia', '','', 0)">
                                <div class="input-group-append input-group-append-hide" style="display:none">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges(\'${v.socMedLabel}URL\', \'socialMedia\',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',0)">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges(\'${v.socMedLabel}URL\',\'${v[v.socMedLabel + '_URL'] != ""?v[v.socMedLabel + '_URL']:""}\','input')">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>`;
                // }
            });
        }
    html+=`</div>
    <a href="javascript:void(0)" class="text-primary text-decoration-none addmoreSocialLinksBtn" onclick="addmoreSocialLinks(this, 'add-other-socialLinks-wrapper')">
        <i class="fa fa-plus"></i>&nbsp;
        Add other social media link    
    </a>
    <div class="form-row add-other-socialLinks-wrapper" style="display:none">
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 mb-2">
            <label for="addOtherSocialMediaLinksTitle" class="font-weight-semi-bold">Link Title</label>
            <input type="text" id="addOtherSocialMediaLinksTitle" name="addOtherSocialMediaLinksTitle" class="form-control form-control-sm" value="" placeholder="Enter Link Title"/>
        </div>
        <div class="col-xl-7 col-lg-6 col-md-6 col-sm-12 col-12 mb-2">
            <label for="addOtherSocialMediaLinksUrl" class="font-weight-semi-bold">URL</label>
            <input type="text" id="addOtherSocialMediaLinksUrl" name="addOtherSocialMediaLinksUrl" class="form-control form-control-sm" value="" placeholder="Enter URL"/>
        </div>    
        <div class="col-xl-2 col-lg-2 col-md-12 col-sm-12 col-12 text-right text-lg-left">
            <label  class="font-weight-semi-bold w-100 d-lg-block d-none">&nbsp;</label>
            <button type="button" class="btn btn-sm btn-success" onclick="addOtherSocialLinks('add-other-socialLinks-wrapper', 'addmoreSocialLinksBtn')">Add</button>
        </div>    
    </div>`;
    return html;
}
// Personal Information Form Elements End Here


// Guardian Information Form Elements Start Here
function guardianInformation(data){
    var html=
        `<div class="card mt-3" id="guardian_information" data-section-count="7">
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
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=motherNameElement(data.motherName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=motherMiddleNameElement(data.motherMiddleName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=motherLastNameElement(data.motherLastName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=motherPhoneNumberElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=motherEmailElement(data.motherEmail)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherCountryElement(data.motherCountry)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${motherOccupationElement(data.motherOccupation)}
                    </div>
                </div>
                <hr/>
                <div class="form-row father-section">
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=fatherFirstNameElement(data.fatherFirstName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=fatherMiddleNameElement(data.fatherMiddleName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=fatherLastNameElement(data.fatherLastName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=fatherPhoneNumberElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=fatherEmailElement(data.fatherEmail)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherCountryElement(data.fatherCountry)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${fatherOccupationElement(data.fatherOccupation)}
                    </div>
                </div>
                <hr/>
                <div class="form-row guardian-section">
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=guardianFirstNameElement(data.guardianFirstName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=guardianMiddleNameElement(data.guardianMiddleName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=guardianLastNameElement(data.guardianLastName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=guardianPhoneNumberElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=guardianEmailElement(data.guardianEmail)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianCountryElement(data)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${guardianOccupationElement(data.guardianOccupation)}
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=relationTypeElement(data.relationType)
                    html+=`</div>`;
                    // <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                    //     html+=pCountryIdElement(data.pCountryId)
                    // html+=`</div>
                    // <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                    //     html+=pStateIdElement(data.pStateId)
                    // html+=`</div>
                    // <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                    //     html+=pCityIdElement(data.pCityId)
                    // html+=`</div>
                    html+=`<div class="col-12">`;
                        html+=preferredCommunicationContent(data)
                    html+=`</div>
                </div>  
                <hr/>
                <div class="form-row mt-2">
                    ${communicationPreferredTimingInformation(data)}
                </div>
            </div>    
        </div>`;
    return html;
}

function motherNameElement(data){
    var html=
    `<label for="motherName" class="font-weight-semi-bold text-dark">Mother's Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="motherName" id="motherName" value="${data != "" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'motherName',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherName', 'motherName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherName',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function motherMiddleNameElement(data){
    var html=
    `<label for="motherMiddleName" class="font-weight-semi-bold text-dark">Mother's Middle Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="motherMiddleName" id="motherMiddleName" value="${data != "" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'motherMiddleName',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherMiddleName', 'motherMiddleName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherMiddleName',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function motherLastNameElement(data){
    var html=
    `<label for="motherLastName" class="font-weight-semi-bold text-dark">Mother's Last Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="motherLastName" id="motherLastName" value="${data != "" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'motherLastName',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherLastName', 'motherLastName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherLastName',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function motherPhoneNumberElement(data){
    var html=
    `<div class="d-flex flex-wrap">
        <label for="motherPhoneNumber" class="font-weight-semi-bold text-dark">Mother Phone</label>    
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto mr-2 d-inline-flex align-items-center">
            <input type="checkbox" id="motherPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.motherPhoneNumberWhatsAppStatus != "N" && data.motherPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.motherPhoneNumberWhatsAppStatus != "N" && data.motherPhoneNumberWhatsAppStatus != undefined ?true:false}"  onchange="availableOnWhatsApp(this, 'motherPhoneNumber',\'${data.motherPhoneNumber}\','input',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode:"us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="motherPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
            </label>
        </div> 
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="motherPhoneEmergencyNumberStatus" class="custom-control-input" ${data.motherPhoneNumberWhatsAppStatus != "N" && data.motherPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.motherPhoneNumberWhatsAppStatus != "N" && data.motherPhoneNumberWhatsAppStatus != undefined ?true:false}"  onchange="availableOnWhatsApp(this, 'motherPhoneNumber',\'${data.motherPhoneNumber}\','input',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode:"us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="motherPhoneEmergencyNumberStatus">
                Emergency Contact
            </label>
        </div>    
    </div>
    <div class="input-group mb-2 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="motherPhoneNumber" id="motherPhoneNumber" value="${data.motherPhoneNumber != "" && data.motherPhoneNumber != undefined ?data.motherPhoneNumber:""}" data-idList="motherPhoneNumber_motherPhoneNumberWhatsAppStatus_motherPhoneNumberCountryCode" autocomplete="off" onkeydown="return M.digit(event);" onkeyup="controlEditField(this,'motherPhoneNumber',\'${data.motherPhoneNumber != "" && data.motherPhoneNumber != undefined ?data.motherPhoneNumber:""}\','inputPhone', 'motherPhoneNumberWhatsAppStatus',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode:""}\', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherPhoneNumber', 'motherPhoneNumber', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherPhoneNumber',\'${data.motherPhoneNumber != "" && data.motherPhoneNumber != undefined ?data.motherPhoneNumber:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function motherEmailElement(data){
    var html=
    `<label for="motherEmail" class="font-weight-semi-bold text-dark">Mother's Email</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="motherEmail" id="motherEmail" value="${data !="" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'motherEmail',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherEmail', 'motherEmail', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherEmail',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function motherCountryElement(data){
    var html=
    `<label for="motherCountry" class="font-weight-semi-bold text-dark">Country</label>
    <div class="input-group mb-2 p-0">
        <select id="motherCountry" name="motherCountry" class="form-control form-control-sm group-append-hide-input bar_count" data-country="motherCountry" onchange="controlEditField(this,'motherCountry',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherCountry', 'motherCountry',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherCountry',\'${data != "" && data != undefined ?data:""}\','countrySectionParent')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function motherOccupationElement(data){
    var html=
    `<label for="motherOccupation" class="font-weight-semi-bold text-dark">Occupation</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" data-Occupationparent="Mother" name="motherOccupation" id="motherOccupation" value="${data !="" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'motherOccupation',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('motherOccupation', 'occupation', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('motherOccupation',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function fatherFirstNameElement(data){
    var html=
    `<label for="fatherFirstName" class="font-weight-semi-bold text-dark">Father's Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="fatherFirstName" id="fatherFirstName" value="${data !="" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'fatherFirstName',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherFirstName', 'fatherFirstName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherFirstName',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function fatherMiddleNameElement(data){
    var html=
    `<label for="fatherMiddleName" class="font-weight-semi-bold text-dark">Father's Middle Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="fatherMiddleName" id="fatherMiddleName" value="${data !="" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'fatherMiddleName',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherMiddleName', 'fatherMiddleName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherMiddleName',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function fatherLastNameElement(data){
    var html=
    `<label for="fatherLastName" class="font-weight-semi-bold text-dark">Father's Last Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="fatherLastName" id="fatherLastName" value="${data !="" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'fatherLastName',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherLastName', 'fatherLastName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherLastName',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function fatherPhoneNumberElement(data){
    var html=
    `<div class="d-flex flex-wrap">
        <label for="fatherPhoneNumber" class="font-weight-semi-bold text-dark">Father Phone</label>    
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto mr-2 d-inline-flex align-items-center">
            <input type="checkbox" id="fatherPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ?true:false}"  onchange="availableOnWhatsApp(this, 'fatherPhoneNumber',\'${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ? data.fatherPhoneNumber:""}\','input',\'${data.fatherPhoneNumberCountryCode != "" && data.fatherPhoneNumberCountryCode != undefined ? data.fatherPhoneNumberCountryCode:"us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="fatherPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
            </label>
        </div> 
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="fatherPhoneEmergencyNumberStatus" class="custom-control-input" ${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ?true:false}"  onchange="availableOnWhatsApp(this, 'motherPhoneNumber',\'${data.motherPhoneNumber}\','input',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode:"us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="fatherPhoneEmergencyNumberStatus">
                Emergency Contact
            </label>
        </div>      
    </div>
    <div class="input-group mb-2 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="fatherPhoneNumber" id="fatherPhoneNumber" value="${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ?data.fatherPhoneNumber:""}" autocomplete="off" data-idList="fatherPhoneNumber_fatherPhoneNumberWhatsAppStatus_fatherPhoneNumberCountryCode" onkeydown="return M.digit(event);" onkeyup="controlEditField(this,'fatherPhoneNumber',\'${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ?data.fatherPhoneNumber:""}\','inputPhone', 'fatherPhoneNumberWhatsAppStatus',\'${data.fatherPhoneNumberCountryCode != "" && data.fatherPhoneNumberCountryCode != undefined ? data.fatherPhoneNumberCountryCode:""}\', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherPhoneNumber', 'fatherPhoneNumber', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherPhoneNumber',\'${data.fatherPhoneNumber != "" && data.fatherPhoneNumber != undefined ? data.fatherPhoneNumber:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function fatherEmailElement(data){
    var html=
    `<label for="fatherEmail" class="font-weight-semi-bold text-dark">Father's Email</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="fatherEmail" id="fatherEmail" value="${data != "" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'fatherEmail',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherEmail', 'fatherEmail', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherEmail',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function fatherCountryElement(data){
    var html=
    `<label for="fatherCountry" class="font-weight-semi-bold text-dark">Country</label>
    <div class="input-group mb-2 p-0">
        <select id="fatherCountry" name="fatherCountry" class="form-control form-control-sm group-append-hide-input bar_count" data-country="fatherCountry" onchange="controlEditField(this,'fatherCountry',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherCountry', 'fatherCountry',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherCountry',\'${data != "" && data != undefined ?data:""}\','countrySectionParent')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function fatherOccupationElement(data){
    var html=
    `<label for="fatherOccupation" class="font-weight-semi-bold text-dark">Occupation</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" data-Occupationparent="Father" name="fatherOccupation" id="fatherOccupation" value="${data !="" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'fatherOccupation',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('fatherOccupation', 'occupation',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('fatherOccupation',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function guardianFirstNameElement(data){
    var html=
    `<label for="guardianFirstName" class="font-weight-semi-bold text-dark">Guardian Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="guardianFirstName" id="guardianFirstName" value="${data != "" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'guardianFirstName',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianFirstName', 'guardianFirstName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianFirstName',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function guardianMiddleNameElement(data){
    var html=
    `<label for="guardianMiddleName" class="font-weight-semi-bold text-dark">Guardian's Middle Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="guardianMiddleName" id="guardianMiddleName" value="${data != "" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'guardianMiddleName',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianMiddleName', 'guardianMiddleName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianMiddleName',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function guardianLastNameElement(data){
    var html=
    `<label for="guardianLastName" class="font-weight-semi-bold text-dark">Guardian's Last Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="guardianLastName" id="guardianLastName" value="${data != "" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onkeyup="controlEditField(this,'guardianLastName',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianLastName', 'guardianLastName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianLastName',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function guardianPhoneNumberElement(data){
    var html=
    `<div class="d-flex flex-wrap">
        <label for="guardianPhoneNumber" class="font-weight-semi-bold text-dark">Guardian Phone</label>    
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor ml-auto mr-2 d-inline-flex align-items-center">
            <input type="checkbox" id="guardianPhoneNumberWhatsAppStatus" class="custom-control-input" ${data.guardianPhoneNumberWhatsAppStatus != "N" && data.guardianPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.guardianPhoneNumberWhatsAppStatus != "N" && data.guardianPhoneNumberWhatsAppStatus != undefined?true:false}"  onchange="availableOnWhatsApp(this, 'guardianPhoneNumber',\'${data.guardianPhoneNumber != "" && data.guardianPhoneNumber != undefined ? data.guardianPhoneNumber:""}\','input',\'${data.guardianPhoneNumberCountryCode != "" && data.guardianPhoneNumberCountryCode != undefined ? data.guardianPhoneNumberCountryCode:"us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="guardianPhoneNumberWhatsAppStatus">
                <span>
                    <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" style="width:12px;"/>
                </span>
            </label>
        </div>
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align cursor d-inline-flex align-items-center">
            <input type="checkbox" id="guardianEmergencyNumberStatus" class="custom-control-input" ${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ?'checked':''} data-status="${data.fatherPhoneNumberWhatsAppStatus != "N" && data.fatherPhoneNumberWhatsAppStatus != undefined ?true:false}"  onchange="availableOnWhatsApp(this, 'motherPhoneNumber',\'${data.motherPhoneNumber}\','input',\'${data.motherPhoneNumberCountryCode != "" && data.motherPhoneNumberCountryCode != undefined ? data.motherPhoneNumberCountryCode:"us"}\',1)">
            <label class="custom-control-label cursor font-10 after-top-0 before-top-0" for="guardianEmergencyNumberStatus">
                Emergency Contact
            </label>
        </div>     
    </div>
    <div class="input-group mb-2 p-0 flex-nowrap">
        <input type="text" class="form-control form-control-sm group-append-hide-input bar_count" name="guardianPhoneNumber" id="guardianPhoneNumber" value="${data.guardianPhoneNumber !="" && data.guardianPhoneNumber != undefined ?data.guardianPhoneNumber:""}" autocomplete="off" onkeydown="return M.digit(event);" data-idList="guardianPhoneNumber_guardianPhoneNumberWhatsAppStatus_guardianPhoneNumberCountryCode" onkeyup="controlEditField(this,'guardianPhoneNumber',\'${data.guardianPhoneNumber !="" && data.guardianPhoneNumber != undefined ?data.guardianPhoneNumber:""}\','inputPhone', 'guardianPhoneNumberWhatsAppStatus',\'${data.guardianPhoneNumberCountryCode != "" && data.guardianPhoneNumberCountryCode != undefined ? data.guardianPhoneNumberCountryCode:""}\', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianPhoneNumber', 'guardianPhoneNumber', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianPhoneNumber',\'${data.guardianPhoneNumber !="" && data.guardianPhoneNumber != undefined ?data.guardianPhoneNumber:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function guardianEmailElement(data){
    var html=
    `<label for="guardianEmail" class="font-weight-semi-bold text-dark">Guardian Email</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" name="guardianEmail" id="guardianEmail" value="${data != "" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'guardianEmail',\'${data != "" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianEmail', 'guardianEmail', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianEmail',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function guardianCountryElement(data){
    var html=
    `<label for="guardianCountry" class="font-weight-semi-bold text-dark">Country</label>
    <div class="input-group mb-2 p-0">
        <select id="guardianCountry" name="guardianCountry" class="form-control form-control-sm group-append-hide-input bar_count" data-country="guardianCountry" onchange="controlEditField(this,'guardianCountry',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianCountry', 'guardianCountry',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianCountry',\'${data != "" && data != undefined ?data:""}\','countrySectionParent')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function guardianOccupationElement(data){
    var html=
    `<label for="guardianOccupation" class="font-weight-semi-bold text-dark">Occupation</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input bar_count" data-Occupationparent="Guardian" name="guardianOccupation" id="guardianOccupation" value="${data !="" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'guardianOccupation',\'${data !="" && data != undefined ?data:""}\','input', '','', 1)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('guardianOccupation', 'occupation',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('guardianOccupation',\'${data != "" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function relationTypeElement(data){
    var html=
    `<label for="relationType" class="font-weight-semi-bold text-dark">Type of Relation (Primary Parent)</label>
    <div class="input-group mb-2 p-0">
        <select id="relationType" name="relationType" class="form-control form-control-sm group-append-hide-input" onchange="controlEditField(this,'relationType',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)">
            ${getRelationshipContent()}
        </select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('relationType', 'relationType',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','true',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('relationType',\'${data != "" && data != undefined ?data:""}\','select')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function pCountryIdElement(data){
    var html=
    `<label for="pCountryId" class="font-weight-semi-bold text-dark">Country</label>
    <div class="input-group mb-2 p-0">
        <select id="pCountryId" name="pCountryId" class="form-control form-control-sm group-append-hide-input" data-country="pCountryId_pStateId_pCityId" onchange="controlEditField(this,'pCountryId',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('pCountryId', 'countrySectionParent',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('pCountryId',\'${data != "" && data != undefined ?data:""}\','countrySectionParent')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function pStateIdElement(data){
    var html=
    `<label for="pStateId" class="font-weight-semi-bold text-dark">State</label>
    <div class="input-group mb-2 p-0">
        <select id="pStateId" name="pStateId" class="form-control form-control-sm group-append-hide-input" data-country="pStateId_pCityId" onchange="controlEditField(this,'pStateId',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('pCountryId', 'countrySectionParent',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('pStateId',\'${data != "" && data != undefined ?data:""}\','countrySection')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}
function pCityIdElement(data){
    var html=
    `<label for="pCityId" class="font-weight-semi-bold text-dark">City</label>
    <div class="input-group mb-2 p-0">
        <select id="pCityId" name="pCityId" class="form-control form-control-sm group-append-hide-input" data-country="pCityId" onchange="controlEditField(this,'pCityId',\'${data != "" && data != undefined ?data:""}\','select', '','', 1)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('pCountryId', 'countrySectionParent',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('pCityId',\'${data != "" && data != undefined ?data:""}\','countrySection')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function preferredCommunicationContent(data){
    var html=
    `<div class="d-flex  flex-wrap">
        <span class="font-weight-semi-bold w-100">Communication:&nbsp;</span>
        <div class="d-inline-flex flex-wrap communication-wrapper w-100">
            <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor communication-wrapper">
                <input type="checkbox" id="pcWhatsappView" name="pcWhatsappView" class="custom-control-input group-append-hide-input bar_count" data-communication-label="pcWhatsappView" ${data.pcWhatsappView != "N" && data.pcWhatsappView != undefined ? 'checked':''} check-status="${data.pcWhatsappView != "N" && data.pcWhatsappView != undefined ? true:false}" onchange="controlEditField(this,this,${data.pcWhatsappView != "N" && data.pcWhatsappView != undefined?true:false},'communication', '','', 1)">
                <label class="custom-control-label cursor font-weight-semi-bold" for="pcWhatsappView">WhatsApp</label>
            </div>
            <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor communication-wrapper">
                <input type="checkbox" id="pcCallView" name="pcCallView" class="custom-control-input group-append-hide-input bar_count" data-communication-label="pcCallView" ${data.pcCallView == "Y"? 'checked':''} check-status="${data.pcCallView != "N" && data.pcCallView != undefined ? true:false}" onchange="controlEditField(this,this,${data.pcCallView != "N" && data.pcCallView != undefined ?true:false},'communication', '','', 1)">
                <label class="custom-control-label cursor font-weight-semi-bold" for="pcCallView">Phone</label>
            </div>
            <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor communication-wrapper">
                <input type="checkbox" id="pcEmailView" name="pcEmailView" class="custom-control-input group-append-hide-input bar_count" data-communication-label="pcEmailView" ${data.pcEmailView == "Y"? 'checked':''} check-status="${data.pcEmailView != "N" && data.pcEmailView != undefined ? true:false}" onchange="controlEditField(this,this,${data.pcEmailView != "N" && data.pcEmailView != undefined ?true:false},'communication', '','', 1)">
                <label class="custom-control-label cursor font-weight-semi-bold" for="pcEmailView">Email</label>
            </div>
            <div class="w-100 text-right" id="saveCommunicationWrapper" style="display:none">
                <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('preferredcommunication', 'preferredcommunication',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',1)">Save</a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelCommunication()">Cancel</a>
            </div>
        </div>    
    </div>`;
    return html;
}

function communicationPreferredTimingInformation(data){
    var html=
        `<div class="col-12 mb-2">
            <span class="font-weight-semi-bold w-100">Communication Preferred Timing:</span>
        </div>
        <div class="col-12" id="communication-preferred-time-wrapper">
            <ul class="p-0 communication-preferred-time-wrapper-ul bar_count">`;
                html+=getCommunicationPreferredSlotContent(data.callingTimePrefArray);
            html+=`</ul>    
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
                                    <a href="javascript:void(0)" class="btn btn-primary btn-sm mr-2" id="communicationPreferredSlotAdd" onclick="addcommunicationPreferredTime()" style="display:none" >
                                        <i class="fa fa-plus"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-success btn-sm" id="communicationPreferredSlotSave" style="display:none" onclick="applyChanges('communicationPreferredSlots', 'communicationPreferredSlots', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',2)">Save</a>   
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12">
            <a href="javascript:void(0)" class="text-primary text-decoration-none addcommunicationPreferredTimeBtn" onclick="addClasscommunicationPreferredTime(this, 'class-preferred-time-dropdown-wrapper')">
                <i class="fa fa-plus"></i>&nbsp; Add Preferred Start Time - End Time    
            </a>    
        </div>`;
    return html;
}



function getCommunicationPreferredSlotContent(data){
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
    var html=``;
    if(data != "" && data != undefined){
        if(data.length>0){
            $.each(data, function(index, value){
                html+=
                `<li style="list-style:none">
                    <div class="w-100 d-flex flex-wrap communication-preferred-timing align-items-center mb-2">
                        <span class="font-weight-bold">${value.communicationRoleType}:&nbsp;</span>
                        <ul class="d-flex ul_${value.communicationRoleType} communication_slot_ul" data-communicationRoleType-ul="${value.communicationRoleType}">`;
                            $.each(value.timings, function(i,v){
                                html+=
                                `<li class="mr-2" id="communication_slot_${i+1}_${index}" data-slot-st="${convertTo12Hour(v.startTime)}" data-slot-et="${convertTo12Hour(v.endTime)}" data-communicationRoleType="${value.communicationRoleType}">
                                    <div class="d-inline-flex">
                                        <span class="d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 text-primary">
                                            <i class="fa fa-clock mr-1"></i>
                                            <span class="font-weight-semi-bold">(${convertTo12Hour(v.startTime)} - ${convertTo12Hour(v.endTime)})</span>   
                                        </span>    
                                        <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="removeCommunicationPreferredTime(\'ul_${value.communicationRoleType}\', 'communication_slot_${i+1}_${index}')">
                                            <i class="fa fa-trash"></i>    
                                        </a>    
                                    </div>    
                                </li>`;
                            });
                        html+=`</ul>
                    </div>
                </li>`;
            });
            
        };
    };
    return html;
}



// Guardian Information Form Elements End Here

// Academic Information Form Elements Start Here

function academicInformation(data){
    var html=
        `<div class="card mt-3" id="academic_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center flex-wrap">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-graduation-cap font-12"></i>    
                            </span>
                            <span>3. Academic Information</span>
                            <div class="ml-auto">
                                <a href='javascript:void(0)' onclick ="callWithSession('${data.studentIdCardDownloadUrl}')" class="btn btn-sm btn-success mr-1">Download Student ID Card</a>
                                ${USER_ROLE != "STUDENT" && data.rightToEdit?
                                    `<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="showLearningProgamGradePlatformModal()"><i class="fa fa-edit"></i>&nbsp;Edit</a>`:``
                                }
                            </div>
                        </h5>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=studentIDElement(data.studentID)
                    html+=`</div>
                    
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=academicYearStartDateElement(data.academicYearStartDate)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=enrollmentDateElement(data.enrollmentDate)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=learningProgramElement(data.learningProgram)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=gradeElement()
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=courseProviderIdElement()
                    html+=`</div>
                    <div class="col-12">`;
                        html+=courseEelement(data)
                    html+=`</div>
                    <div class="col-12">
                        <hr class="mt-1" />
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=previousCurrentSchoolNameElement(data.previousCurrentSchoolName)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=previousCurrentGradeNameElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=previousCurrentSchoolGraduationYearElement(data.previousCurrentSchoolGraduationYear)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=previousCurrentSchoolCountryElement(data.previousCurrentSchoolCountry)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">`;
                        html+=ctiTakenRecommendedGradeElement(data.ctiTakenRecommendedGrade)
                    html+=`</div>
                    <div class="col-12">
                        <hr/>
                    </div>
                    <div class="col-12">
                        <div class="form-group mb-2 p-0">
                            <span class="font-weight-semi-bold text-dark">Documents</span>
                        </div>
                    </div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
                        html+=ageProofElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
                        html+=addressProofElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
                        html+=parentPassportProofElement(data)
                    html+=`</div>
                    <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">`;
                        html+=lastAcademicProofElement(data)
                    html+=`</div>
                    <div class="col-12 text-right">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="saveDocs('${PORFILE_RESPONSE_DATA.userId}','${PORFILE_RESPONSE_DATA.studentStandardId}')">Save Documents</a>
                    </div>
                </div>    
            </div>    
        </div>`;
    return html;
}

function studentIDElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="studentID" class="font-weight-semi-bold text-dark">Student ID</label>
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="studentID" id="studentID" value="${data != "" && data != undefined ? data:""}" autocomplete="off" disabled>
    </div>`;
    return html;
}

function learningProgramElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="learningProgram" class="font-weight-semi-bold text-dark">Learning Program</label>
        <select name="learningProgram" id="learningProgram" class="form-control form-control-sm" disabled>
            ${getLearningProgramContent(SCHOOL_ID)}
        </select>
    </div>`;
    return html;
}

function gradeElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="grade" class="font-weight-semi-bold text-dark">Grade</label>
        <select name="grade" id="grade" class="form-control form-control-sm" disabled></select>
    </div>`;
    return html;
}

function academicYearStartDateElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="academicYearStartDate" class="font-weight-semi-bold text-dark">Academic Year Start Date</label>
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="academicYearStartDate" id="academicYearStartDate" value="${data != "" && data != undefined ? data:""}" autocomplete="off" disabled>
    </div>`;
    return html;
}

function enrollmentDateElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="enrollmentDate" class="font-weight-semi-bold text-dark">Enrollment Date</label>
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="enrollmentDate" id="enrollmentDate" value="${data != "" && data != undefined ? data:""}" autocomplete="off" disabled>
    </div>`;
    return html;
}

function courseProviderIdElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="courseProviderId" class="font-weight-semi-bold text-dark">LMS Platform</label>
        <select name="courseProviderId" id="courseProviderId" class="form-control form-control-sm" disabled>
            ${getLmsPlatformContent(SCHOOL_ID)}
        </select>
    </div>`;
    return html;
}

function courseEelement(data){
    var html=
    `<div class="form-group mb-2 p-0 compulsorySubjectsdiv">
        <span class="font-weight-semi-bold text-dark">Course (${data.grade != "" && data.grade != undefined?data.grade:""})</span>
        <ul class="p-0 mt-2">`;
            if(data.courses.length>0){
                $.each(data.courses, function(i, v){
                    html+=
                    `<li class="d-inline-block p-1 px-2 mr-1 rounded bg-primary text-white font-11 mb-1">${v}</li>`;
                });
            }
        html+=`</ul>
    </div>`;
    return html;
}

function previousCurrentSchoolNameElement(data){
    var html=
    `<label for="previousCurrentSchoolName" class="font-weight-semi-bold text-dark">Previous/Current School Name</label>
    <div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="previousCurrentSchoolName" id="previousCurrentSchoolName" value="${data !="" && data != undefined ?data:""}" autocomplete="off" onkeyup="controlEditField(this,'previousCurrentSchoolName',\'${data !="" && data != undefined ?data:""}\','input', '','', 2)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('previousCurrentSchoolName', 'previousCurrentSchoolName', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',2)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('previousCurrentSchoolName',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function previousCurrentGradeNameElement(data){
    var html=
    `<label for="previousCurrentGradeName" class="font-weight-semi-bold text-dark">Previous/Current Grade Name</label>
    <div class="input-group mb-2 p-0">
        <select name="previousCurrentGradeName" id="previousCurrentGradeName" class="form-control form-control-sm group-append-hide-input" onchange="controlEditField(this,'previousCurrentGradeName',\'${data.previousCurrentGradeId !="" && data.previousCurrentGradeId != undefined ?data.previousCurrentGradeId:""}\','select', '','', 2)"></select>
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('previousCurrentGradeName', 'previousCurrentGradeName',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',2)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('previousCurrentGradeName',\'${data.previousCurrentGradeId !="" && data.previousCurrentGradeId != undefined ?data.previousCurrentGradeId:""}\','select')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function previousCurrentSchoolGraduationYearElement(data){
    var html=
    `<label for="previousCurrentSchoolGraduationYear" class="font-weight-semi-bold text-dark">Previous/Current School Graduation Year</label><div class="input-group mb-2 p-0">
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm group-append-hide-input" name="previousCurrentSchoolGraduationYear" id="previousCurrentSchoolGraduationYear" value="${data !="" && data != undefined ?data:""}" onkeydown="return M.isChars(event);" autocomplete="off" onchange="controlEditField(this,'previousCurrentSchoolGraduationYear',\'${data !="" && data != undefined ?data:""}\','input', '','', 2)">
        <div class="input-group-append input-group-append-hide" style="display:none">
            <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('previousCurrentSchoolGraduationYear', 'previousCurrentSchoolGraduationYear', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',2)">
                <i class="fa fa-check"></i>
            </a>
            <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('previousCurrentSchoolGraduationYear',\'${data !="" && data != undefined ?data:""}\','input')">
                <i class="fa fa-times"></i>
            </a>
        </div>
    </div>`;
    return html;
}

function previousCurrentSchoolCountryElement(data){
    var html=
    `<label for="previousCurrentSchoolCountry" class="font-weight-semi-bold text-dark">Previous/Current School Country</label>
    <div class="form-group mb-2 p-0">
        <div class="input-group mb-2 p-0">
            <select name="previousCurrentSchoolCountry" id="previousCurrentSchoolCountry" class="form-control form-control-sm group-append-hide-input" onchange="controlEditField(this,'previousCurrentSchoolCountry',\'${data !="" && data != undefined ?data:""}\','select', '','', 2)"></select>
            <div class="input-group-append input-group-append-hide" style="display:none">
                <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('previousCurrentSchoolCountry', 'previousCurrentSchoolCountry',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',2)">
                    <i class="fa fa-check"></i>
                </a>
                <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('previousCurrentSchoolCountry',\'${data !="" && data != undefined ?data:""}\','select')">
                    <i class="fa fa-times"></i>
                </a>
            </div>
        </div>
    </div>`;
    return html;
}

function ctiTakenRecommendedGradeElement(data){
    var html=
    `<div class="form-group mb-2 p-0">
        <label for="ctiTakenRecommendedGrade" class="font-weight-semi-bold text-dark">CTI Taken Recommended Grade</label>
        <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="ctiTakenRecommendedGrade" id="ctiTakenRecommendedGrade" value="${data !="" && data != undefined ?data:""}" autocomplete="off" disabled>
    </div>`;
    return html;
}


function viewUploadFileModal(){
    var html=
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
                        <object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="">
                        </object>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function ageProofElement(data){
    
    var html=
    `<div class="full">
        <span class="font-weight-semi-bold text-primary">Age Proof:</span>
        <div class="d-flex">
            <div class="w-100" id="ageProofViewBtn" style="${data.ageProof != "" && data.ageProof != undefined ?'':'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span id="ageProofFileName">${data.ageProof != "" && data.ageProof != undefined ?data.ageProofName:'No File'}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.ageProofAttachmentType}\', 'ageProofdiv')">
                            <img id="ageProofimgIcon" class="full crop-uplod-img d-none" src="${data.ageProof != "" && data.ageProof != undefined ? data.ageProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" alt="" thumbtype="${data.ageProofAttachmentType == "I"? 'img':'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a> 
                        <button id="ageProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.ageProof != "" && data.ageProof != undefined  ?'':'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'ageProof\\\', \\\'ageProofimgIcon\\\', \\\'Age Proof\\\', \\\'${PORFILE_RESPONSE_DATA.userId}\\\',\\\'${PORFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>    
                </div>
            </div>
            <div class="upload-btn-wrapper" id="ageProofdiv" data-pdfurl="${data.ageProof != "" && data.ageProof != undefined ? data.ageProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" style="${data.ageProof != "" && data.ageProof != undefined ?'display:none':''}">
                <input class="file-input bar_count" type="file" name="ageProof" id="ageProof" onchange="cropImage(event, 'ageProof', 'ageProofimgIcon', 'Age Proof', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
               
        </div>
    </div>`;
    return html;
}

function addressProofElement(data){
    var html=
    `<div class="full">
        <span class="font-weight-semi-bold text-primary">Address Proof:</span>
        <div class="d-flex">
            <div class="w-100" id="addressProofViewBtn" style="${data.addressProof != "" && data.addressProof != undefined ?'':'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span id="addressProofFileName">${data.addressProof != "" && data.addressProof != undefined ?data.addressProofName:'No File'}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.addressProofAttachmentType}\', 'addressProofdiv')">
                            <img id="addressProofimgIcon" class="full crop-uplod-img d-none" src="${data.addressProof != "" && data.addressProof != undefined ? data.addressProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" alt="" thumbtype="${data.addressProofAttachmentType == "I"? 'img':'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a>  
                        <button id="addressProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.addressProof != "" && data.addressProof != undefined ?'':'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'addressProof\\\', \\\'addressProofimgIcon\\\', \\\'Address Proof\\\',\\\'${PORFILE_RESPONSE_DATA.userId}\\\',\\\'${PORFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>   
                </div>
            </div>
            <div class="upload-btn-wrapper" id="addressProofdiv" data-pdfurl="${data.addressProof != "" && data.addressProof != undefined ? data.addressProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" style="${data.addressProof != "" && data.addressProof != undefined ?'display:none':''}">
                <input class="file-input bar_count" type="file" name="addressProof" id="addressProof" onchange="cropImage(event, 'addressProof', 'addressProofimgIcon', 'Address Proof', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
              
        </div>
    </div>`;
    return html;
}

function parentPassportProofElement(data){
    var html=
    `<div class="full">
        <span class="font-weight-semi-bold text-primary">Parent Passport:</span>
        <div class="d-flex">
            <div class="w-100" id="parentPassportProofViewBtn" style="${data.parentPassportProof != "" && data.parentPassportProof != undefined ?'':'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span id="parentPassportProofFileName">${data.parentPassportProof != "" && data.parentPassportProof != undefined ?data.parentPassportProofName:'No File'}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.parentPassportAttachmentType}\', 'parentPassportProofdiv')">
                            <img id="parentPassportProofimgIcon" class="full crop-uplod-img d-none" src="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? data.parentPassportProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" alt="" thumbtype="${data.parentPassportAttachmentType == "I"? 'img':'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a>
                        <button id="parentPassportProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.parentPassportProof != "" && data.parentPassportProof != undefined ?'':'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'parentPassportProof\\\', \\\'parentPassportProofimgIcon\\\', \\\'Signature\\\',\\\'${PORFILE_RESPONSE_DATA.userId}\\\',\\\'${PORFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button> 
                    </div>     
                </div>
            </div>
            <div class="upload-btn-wrapper" id="parentPassportProofdiv" data-pdfurl="${data.parentPassportProof != "" && data.parentPassportProof != undefined ? data.parentPassportProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" style="${data.parentPassportProof != "" && data.parentPassportProof != undefined ?'display:none':''}">
                <input class="file-input bar_count" type="file" name="parentPassportProof" id="parentPassportProof" onchange="cropImage(event, 'parentPassportProof', 'parentPassportProofimgIcon', 'Signature', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
              
        </div>
    </div>`;
    return html;
}


function lastAcademicProofElement(data){
    
    var html=
    `<div class="full">
        <span class="font-weight-semi-bold text-primary">Last Academic Proof:</span>
        <div class="d-flex">
            <div class="w-100" id="lastAcademicProofViewBtn" style="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ?'':'display:none'}">
                <div class="d-flex w-100 align-items-center">
                    <div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
                        <span class="bg-light-primary rounded-circle text-center mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
                            <i class="fa fa-file font-10 text-primary"></i>    
                        </span>
                        <span id="lastAcademicProofFileName">${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ?data.lastAcademicProofName:'No File'}</span>    
                    </div>
                    <div class="d-inline-flex">
                        <a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile',\'${data.lastAcademicProofAttachmentType}\', 'lastAcademicProofdiv')">
                            <img id="lastAcademicProofimgIcon" class="full crop-uplod-img d-none" src="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? data.lastAcademicProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" alt="" thumbtype="${data.lastAcademicProofAttachmentType == "I"? 'img':'pdf'}">  
                            <i class="fa fa-eye"></i>    
                        </a>
                        <button id="lastAcademicProofRemove" type="button" class="btn btn-danger btn-sm removeDocBtn" style="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ?'':'display:none'}" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImage(this, \\\'lastAcademicProof\\\', \\\'lastAcademicProofimgIcon\\\', \\\'Last Academic Proof\\\',\\\'${PORFILE_RESPONSE_DATA.userId}\\\',\\\'${PORFILE_RESPONSE_DATA.studentStandardId}\\\', \\\'new\\\') \')">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>    
                </div>
            </div>
            <div class="upload-btn-wrapper" id="lastAcademicProofdiv" data-pdfurl="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ? data.lastAcademicProof:PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" style="${data.lastAcademicProof != "" && data.lastAcademicProof != undefined ?'display:none':''}">
                <input class="file-input bar_count" type="file" name="lastAcademicProof" id="lastAcademicProof" onchange="cropImage(event, 'lastAcademicProof', 'lastAcademicProofimgIcon', 'Last Academic Proof', \'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\', true)">
                <span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 justify-content-center">
                <i class="fa fa-upload"></i>&nbsp;Upload</span>
            </div>
               
        </div>
    </div>`;
    return html;
}

// Academic Information Form Elements End Here


// Live Classes Preferred Timing Form Elements Start Here
function classesPreferredTimingInformation(data){
    var html=
        `<div class="card mt-3" id="classes_Preferred_Timing_information" data-section-count="1">
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
                        <ul class="p-0 d-flex flex-wrap bar_count">`;
                            html+=getPreferredSlotContent(data);
                        html+=`</ul>    
                    </div>
                    <div class="col-12" id="class-preferred-time-dropdown-wrapper" style="display:none">
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
                                <a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="saveClassPreferredTime()">Save</a>     
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <a href="javascript:void(0)" class="text-primary text-decoration-none addClassPreferredTimeBtn" onclick="addClassPreferredTime(this, 'class-preferred-time-dropdown-wrapper')">
                            <i class="fa fa-plus"></i>&nbsp; Add Preferred Start Time - End Time    
                        </a>    
                    </div>
                </div>    
            </div>    
        </div>`;
    return html;
}

function getPreferredSlotContent(data){
    var html=``;
    if(data.length>0){
        $.each(data, function(i,v){
            html+=
            `<li class="mr-2 mb-2" id="slot_${i+1}" data-slot-st="${v.displayStartTime}" data-slot-et="${v.displayEndTime}" data-slot-id="${v.timePrefId}">
                <div class="d-inline-flex">
                    <span class="d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 text-primary">
                        <i class="fa fa-clock mr-1"></i>
                        <span class="font-weight-semi-bold">(${v.displayStartTime} - ${v.displayEndTime})</span>   
                    </span>    
                    <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="removeClassPreferredTime('slot_${i+1}')">
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
function sportAndExtraCurricularInformation(data){
    var html=
        `<div class="card mt-3 mb-4" id="sport_and_Extra_curriculars_information" data-section-count="1">
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
                    <div class="col-12">`;
                        html+=participateSportActivitiesElement(data, PORFILE_RESPONSE_DATA.studentStandardId, 'profileForm')
                    html+=`</div>
                    <div class="col-12">
                        <hr/>    
                    </div>
                    <div class="col-12">`;
                        html+=extracurricularActivitiesThums(data.sportsAndECList)
                    html+=`</div>
                </div>    
            </div>    
        </div>`;
    return html;
}

function participateSportActivitiesElement(data, studentStandardId, formID){
    var html=
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
                <tbody>`
                    +getJoinedSportsAndECList(data)
                html+=`</tbody>
            </table>
        </div>
    </div>
    <div class="form-group" id="participateEventFormWrapper" style="display:none">
        <div class="form-row">
            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="form-group mb-2 p-0">
                    <label for="eventTitle" class="font-weight-semi-bold text-dark">Sport & Event Tilte</label>
                    <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventTitle" id="eventTitle" placeholder="Enter Sport & Event Tilte" autocomplete="off">
                </div>
            </div>
            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="form-group mb-2 p-0">
                    <label for="eventStartDate" class="font-weight-semi-bold text-dark">Start Date</label>
                    <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventStartDate" id="eventStartDate" placeholder="Start Date" autocomplete="off">
                </div>
            </div>
            <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <div class="form-group mb-2 p-0">
                    <label for="eventEndDate" class="font-weight-semi-bold text-dark">End Date</label>
                    <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventEndDate" id="eventEndDate" placeholder="End Date" autocomplete="off">
                </div>
            </div>
            <div class="col-xl-9 col-lg-8 col-md-8 col-sm-12 col-12">
                <div class="form-group mb-2 p-0">
                    <label for="eventAddress" class="font-weight-semi-bold text-dark">Address</label>
                    <input type="text" class="form-control form-control-sm form-control form-control-sm-sm" name="eventAddress" id="eventAddress" placeholder="Enter Sport & Event Address" autocomplete="off">
                </div>
            </div>
            <div class="col-xl-3 col-lg-4 col-md-4 col-sm-12 col-12 text-sm-left text-right">
                <label class="font-weight-semi-bold text-dark full">&nbsp;</label>
                <a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="addParticipateExtraCurricularActivity(\'${formID}\', \'${studentStandardId}\')">Add & Save</a>
            </div>
        </div>    
    </div>`;
    return html;
}

function getJoinedSportsAndECList(data){
    var html=``;
    if(data.joinedSportsAndECList.length>0){
        $.each(data.joinedSportsAndECList, function(i,v){
            html+=
            `<tr id="event_tr_${i+1}" data-row-id="${v.id}">
                <td>${i+1}</td>
                <td>${v.title}</td>
                <td>${v.startDate}</td>
                <td>${v.endDate}</td>
                <td>${v.address}</td>
                <td>
                    <a href="javascript:void(0)" class="btn btn-danger btn-sm" onclick="removeEvent(\'event_tr_${i+1}\')">
                        <i class="fa fa-trash"></i>
                    </a>
                </td>
            </tr>`
        })
    }
    return html;
}

function extracurricularActivitiesThums(data){
    var html=
    `<span class="font-weight-semi-bold w-100">Would you like to join any extracurricular activities:</span>
    <div class="d-flex flex-sm-nowrap flex-wrap sports-extra-curriculars-wrapper">
        <div class="d-inline-flex flex-wrap">`;
            if(data.length>0){
                $.each(data, function(i,v){
                    html+=
                    `<div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mt-2 mr-3 cursor">
                        <input type="checkbox" id="${v.sEclabel.replace(' ','')}" name="${v.sEclabel.replace(' ','')}" class="custom-control-input group-append-hide-input" ${v.assignActiveStudent == "Y"? 'checked':''} data-index-id=${i} data-Id="${v.sportEcId}" data-status="${v.value}" data-title="${v.sEclabel}" onchange="controlEditField(this,this,${v.status == "Y"?true:false},'extracurricular', '','', 4)">
                        <label class="custom-control-label cursor font-weight-semi-bold" for="${v.sEclabel.replace(' ','')}">${v.sEclabel}</label>
                    </div>`
                });
            }
        html+=`</div>    
    </div>
    <div class="w-100 text-right" id="saveSportsAndEcClubWrapper" style="display:none">
        <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges('extracurricular', 'extracurricular',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false',4)">Save</a>
        <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="extraCurricularHobbies()">Cancel</a>
    </div>`;
    return html;
}
// Sport & Extra Curriculars Form Elements End Here

// Reserve an Enrollment Seat & Adv Course Form Elements Start Here
function reserveAnEnrollmentSeatAdvCourseInformation(data, standardStatus, enrollmentDetails){
    console.log("data ==>", data)
    
    var html=
        `<div class="card mt-3 mb-4" id="reserve_An_Enrollment_Seat_Adv_Course_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-file font-12"></i>    
                            </span>
                            <span>${USER_ROLE != "STUDENT" ? '6':''}. Reserve an Enrollment Seat & Advance Course Fee</span>
                        </h5>
                    </div>`;
                    if(standardStatus == "1"){
                        html+=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            <label for="reserveASeat" class="font-weight-semi-bold text-dark">Reserve an Seat</label>
                            <div class="input-group mb-2 p-0">
                                <select name="reserveASeat" id="reserveASeat" class="form-control form-control-sm group-append-hide-input" data-value="${data.reserveASeat}" onchange="controlEditField(this,'reserveASeat',\'${data.reserveASeat== "N"?"0":"1"}\','select','','', 5)">
                                    <option value="0" ${data.reserveASeat == "N"?'selected':''}>No</option>
                                    <option value="1" ${data.reserveASeat == "Y"?'selected':''}>Yes</option>
                                </select>
                                <div class="input-group-append input-group-append-hide" style="display:none">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success" onClick="applyChanges(this,'reserveASeat','${PORFILE_RESPONSE_DATA.userId}','${PORFILE_RESPONSE_DATA.studentStandardId}','${PORFILE_RESPONSE_DATA.moduleId}','student','false');">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('reserveASeat',\'${data.reserveASeat== "N"?"0":"1"}\','select')">
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
                                        if(enrollmentDetails == null || enrollmentDetails.length < 1){
                                            html+=
                                            `<tr>
                                                <td>Not Paid</td>
                                                <td>No </td>
                                                <td>N/A</td>
                                                <td>N/A</td>
                                            </tr>`;
                                        }else{
                                            $.each(enrollmentDetails, function(i,v){
                                                html+=
                                                `<tr>
                                                    ${/*<td>${enrollmentDaetail.paymentCase}</td>*/''}
                                                    <td>${v.paymentStatus} ${v.advancePayment} </td>
                                                    <td>${v.expiryDate}</td>
                                                    ${/*<td>${enrollmentDaetail.amount}</td>*/''}
                                                </tr>`;
                                            });
                                        }
                                    html+=`</tbody>
                                </table>
                            </div>`;
                    } else if(standardStatus == "0"){
                        html+=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            <label for="bookASeatNextGradeOpted" class="font-weight-semi-bold text-dark">Allow Reserve an Seat for Next Grade?</label>
                            <div class="input-group mb-2 p-0">
                                <select name="bookASeatNextGradeOpted" id="bookASeatNextGradeOpted" class="form-control form-control-sm group-append-hide-input" data-value="${data.bookASeatNextGradeOpted}" onchange="controlEditField(this,'bookASeatNextGradeOpted',\'${data.bookASeatNextGradeOpted== "N"?"0":"1"}\','select','','', 5)">
                                    <option value="0" ${data.bookASeatNextGradeOpted == "N"?'selected':''}>No</option>
                                    <option value="1" ${data.bookASeatNextGradeOpted == "Y"?'selected':''}>Yes</option>
                                </select>
                                <div class="input-group-append input-group-append-hide" style="display:none">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success" onClick="renderAndPermissionForAproval('bookASeatNextGradeOptedSpan','bookASeatNextGradeOpted','${PORFILE_RESPONSE_DATA.userId}','${PORFILE_RESPONSE_DATA.studentStandardId}','${PORFILE_RESPONSE_DATA.moduleId}','student','false');">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('bookASeatNextGradeOpted',\'${data.bookASeatNextGradeOpted== "N"?"0":"1"}\','select')">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            <label for="advanceGradeOpted" class="font-weight-semi-bold text-dark">Allow Course Fee Payment for Next Grade?</label>
                            <div class="input-group mb-2 p-0">
                                <select name="advanceGradeOpted" id="advanceGradeOpted" class="form-control form-control-sm group-append-hide-input" data-value="${data.advanceGradeOpted}" onchange="controlEditField(this,'advanceGradeOpted',\'${data.advanceGradeOpted== "N"?"0":"1"}\','select', '','', 5)">
                                    <option value="0" ${data.advanceGradeOpted == "N"?'selected':''}>No</option>
                                    <option value="1" ${data.advanceGradeOpted == "Y"?'selected':''}>Yes</option>
                                </select>
                                <div class="input-group-append input-group-append-hide" style="display:none">
                                    <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="renderAndPermissionForAproval('advanceGradeOptedSpan', 'advanceGradeOpted',\'${PORFILE_RESPONSE_DATA.userId}\',\'${PORFILE_RESPONSE_DATA.studentStandardId}\',\'${PORFILE_RESPONSE_DATA.moduleId}\','student','false')">
                                        <i class="fa fa-check"></i>
                                    </a>
                                    <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges('advanceGradeOpted',\'${data.advanceGradeOpted== "N"?"0":"1"}\','select')">
                                        <i class="fa fa-times"></i>
                                    </a>
                                </div>
                            </div>
                        </div>`;
                    }
                html+=`</div>    
            </div>    
        </div>`;
    return html;
}

function permissionForAprovalModal(elementFor, keyId,userId,studentStandardId,roleModuleId,moduleId,showWarning){
	var html=
	`<div class="modal fade fade-scale" id="permissionModal" tabindex="-1" aria-hidden="true">'
		<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="width:600px">
			<div class="modal-content text-center">
				<div class="modal-header py-2 bg-primary">
					<h5 class="modal-title text-white">`;
						if(keyId=='bookASeatNextGradeOpted'){
							html+='Reserve a Seat for Next Grade';
						}else{
							html+='Course Fee Payment for Next Grade';
						}
					html+=`</h5>
					<button type="button" class="close remove-backdrop" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true" class="text-white">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<div class="full py-3">`;
                        if(keyId=='bookASeatNextGradeOpted'){
                            html+=`<h5>Are you sure you want to enable "Reserve a Seat for Next Grade"? Please note that "Course Fee Payment for Next Grade" will be toggled to "NO".</h5>`;
                        }else if(keyId=='advanceGradeOpted'){
                            html+=`<h5>Are you sure you want to enable "Course Fee Payment for Next Grade"? Please note that "Reserve a Seat for Next Grade" will be toggled to "NO".</h5>`;
                        }
					html+=
					`</div>
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
function communicationLogInformation(data){
    var html=
        `<div class="card mt-3 mb-4" id="communication_Log_information">
            <div class="card-body">
                <div class="form-row">
                    <div class="col-12 mb-2">
                        <h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
                            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                                <i class="fa fa-comments font-12"></i>    
                            </span>
                            <span>${USER_ROLE == "STUDENT" ? '6':'7'}. Communication Log</span>
                        </h5>
                    </div>`
                    +getAddCommunicationLogForm()
                    html+=`<div class="col-12"><hr/></div>
                    <div class="w-100">`
                        +getAddCommunicationLogTable()
                    html+=`</div>
                </div>    
            </div>    
        </div>`;
    return html;
}

function getAddCommunicationLogForm(){
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
                    <img id="fileuploadimgIcon" class="full crop-uplod-img d-none" src="${PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION}" alt="" thumbtype="img">  
                </div>
            </div>
        </div>
    </div>
    <div class="col-12">
        <label for="commentEditor" title="Mandatory field">Comment<sup class="text-danger font-size-md"><b>*</b></sup></label>
        <textarea id="commentEditor"></textarea>
    </div>
    <div class="col-12 text-right mb-0 mt-3">
        <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="saveCommunicationLog(\'profileForm\')">Add & Save</a>
    </div>`;
    return html;
}

function getAddCommunicationLogTableHeader(){
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
function getAddCommunicationLogTablebody(result){
	var html='';
    $.each(result.commonCommentsDTO, function(k, v) {
        html+=
        `<tr id="commLog${v.commentId}">
            <td>${k+1}</td>
            <td>${v.title}</td>
            <td>${v.status}</td>
            <td>${v.comments}</td>
            <td class="text-center">`;
                if(v.uploadFile != '' && v.uploadFile != 'No file chosen...'){
                    html+=`<a target="_blank" href="${FILE_UPLOAD_PATH}${v.uploadFile}"><i class="fa fa-eye"></i></a>`;
                }else{
                    html+=`N/A`;
                }
            html+=`</td>
            <td>${v.addedByName+'/'+v.createdAt}</td>
        </tr>`;
    });
    return html;
}
function getAddCommunicationLogTable(){
	html=
    `<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="communicationLogTable"  style="width:100%;">`;
        html+=getAddCommunicationLogTableHeader()
        html+=`<tbody></tbody>
    </table>`
	return html;
}

function getCommunicationAttchFileModal(){
	var html=
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

function cropperImageModalContent(){
    var html=
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

function serverMessageContent(){
    var html=
        '<div class="server-message">'
            +'<span class="msg" id="msgTheme2"></span>'
        +'</div>';
    return html;	
}


function changeLearingProgramGradeModalContent(data){
    var html=
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
                            <select id="registrationType" class="title-select-dropdown-register form-control">
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
                ${data.marksPublishedStatus != "Y"?`<button onclick="openConfirmSaveModal();" type="button" class="btn btn-success" id="changeLearningProgamGradePlatformId">Save</button>`:``}
            </div>
        </div>
        </div>
    </div>`;
    return html;
}

function confirmSaveModalContent(data){
    var html=
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
                    <button type="button" class="btn btn-success" id="confirmSaveBtn" onclick="changeLearningProgamGradePlatformModal('${data.studentStandardId}','${data.profileData.studentProfile[2].learningProgramValue}','${data.profileData.studentProfile[2].gradeId}','${data.profileData.studentProfile[2].learningPlatformId}')">Yes, Save</button>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function getChunkProfileDataByUserModalContent(data){
    var html=
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
                    <button type="button" class="btn btn-success" id="confirmSaveBtn" onclick="changeLearningProgamGradePlatformModal()">Yes, Save</button>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}


function getClassAndActivityStartWarningModalContent(){
    var html=
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