var commonProfileDTO;
var schoolSettingsLinks;
var schoolSettingsTechnical;
async function newDashboardParentContent(){
    commonProfileDTO = await getUserShortProfile(USER_ID);
    var payload = {};
    payload['userId'] = USER_ID;
    responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'get-students-by-parent', payload);
    var html=
        `<div class="app-container body-tabs-shadow fixed-header fixed-sidebar">`
            html+=await topHeaderContent(responseData);
            html+=await cardContent(responseData);
            html+=await footerContent();
        html+=`</div>`;
        html+=sessionOutPermissionContent(commonProfileDTO);
        html+=`<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">`
            if(SCHOOL_ID == 1){
                html+=`<img src="${PATH_FOLDER_IMAGE2}loader-new.gif" alt="${SCHOOL_NAME} Loader" class="new-loader-2024" />`;
            }else{
                html+=
                `<div class="ball-rotate">
                    <div style="background-color: rgb(247, 185, 36);"></div>
                </div>
                <p>Loading ...</p>`;
            }
        html+=`</div>`;
    return html;
}

async function topHeaderContent(data){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    var html=
        `<div class="sticky-header bg-white">
            <div class="app-header header-shadow">
                <div class="app-header__logo" style="order:0">
                    <a href="${schoolSettingsLinks.schoolWebsite}" target="blank"class="logo-src" style="background:url(${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION});"></a>
                </div>
                <div class="app-header__content">
                    <div class="app-header-right">
                        <div class="d-none d-lg-inline-block ">`
                            if(data.lmsProviderURL){
                                html+=
                                `<label class="switch">
                                    <input class="switch-input redirectLmsUrl" type="checkbox" value="yes"
                                        onclick="redirectLms(this, '');"
                                        changeUrl="${data.lmsProviderURL}" />
                                    <span class="switch-label" data-on="" data-off="LMS"></span>
                                    <span class="switch-handle"></span>
                                </label>`
                            }
                        html+=`</div>
                        <div style="align-items: center;display: flex; margin-left: auto;padding-right:20px;">
                            <a href="${APP_BASE_URL}${SCHOOL_UUID}/common/logout/${UNIQUEUUID}?from=dashboard" class="btn-pill btn-shadow btn-shine btn btn-primary">
                                Log out
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

async function cardContent(data){
    var studentBasicDetails = data.studentBasicDetails
    var welcomeMessage = getWelcomeMessage();
    var html=
        `<div class="app-main my-4">
            <div class="col-lg-8 col-md-10 col-sm-12 col-12 mr-auto ml-auto text-center mt-4">
                <div class="app-main__inner app-theme-white m-auto p-4 card zoomIn animated br-4">
                    <div class="full my-2 p-1 card br-4">`
                        if(MAINTENANCEDOWNTIME != ''){
                            html+=
                            `<div class="full">
                                <marquee id="marqueeDiv" direction="left" class="full text-danger">${MAINTENANCEDOWNTIME}</marquee>
                            </div>`
                        }
                        html+=`<div class="page-title-wrapper">
                            <div class="page-title-heading full my-4">
                                ${/*<h4 class="day-message-text text-center full">*/''}
                                <h5 class="text-center full font-weight-semi-bold">
                                    ${/*Hi 😊*/''}
                                    ${/*<p class="mb-1">${welcomeMessage}</p>*/''}
                                    <p class="mb-1">${welcomeMessage} <span class="text-primary">${USER_FULL_NAME}!</span></p>
                                    <p class="mb-1">Great to see you again</p>
                                    <p class="m-0">We are just a message away!</p>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center ">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12 mt-2">
                            <div class="main-card mb-2 card br-4">
                                <h5 class="text-center full font-weight-semi-bold mt-3">
                                    <p>Select to observe dashboard</p>
                                </h5>
                                <div class="card-body pt-0">
                                    <div class="row m-0 py-2 ${studentBasicDetails.length > 2 ? '' : 'justify-content-center'}">`
                                        $.each(studentBasicDetails, function(index, studentBasicDetail) {
                                            html+=`
                                                <div class="col-md-4 col-sm-12 col-12 pb-4 pt-4 ${studentBasicDetails.length > 1 ? '' : 'm-auto'}">
                                                    <div class="d-flex h-100 flex-column bg-primary text-white p-3 mb-4 hover-zoomIn trans5s cursor" style="border-radius:10px" onclick="changeStudentByParent('${studentBasicDetail.studentId}', '${data.studentDashboardRedirectUrl}');">
                                                        <div class="studentImg full">
                                                            <span class="student-img" style="background-image: url('${studentBasicDetail.profilePic}');"></span>
                                                            ${/*<img src="${studentBasicDetail.profilePic}" style="margin-top: -40px;border:1px solid #fff; border-radius: 10px;"/>*/''}
                                                        </div>
                                                        <div class="full text-center my-2">
                                                            <h5 class="mb-2">${studentBasicDetail.studentName}</h5>
                                                            <p class="mb-1 text-uppercase">${studentBasicDetail.standardName}</p>
                                                            <p class="m-0">${studentBasicDetail.learningProgramName}</p>
                                                        </div>
                                                        ${/*<div class="full">
                                                            <a href="javascript:void(0)" class="btn btn-success btn-pill" onclick="changeStudentByParent('${studentBasicDetail.studentId}')">CLICK TO LOGIN</a>
                                                        </div>*/''}
                                                    </div>
                                                </div>
                                            `;
                                        });
                                    html+=`</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

async function footerContent(data){
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    var html=
        `<div class="app-wrapper-footer mt-sm-4">
            <div class="app-footer mt-sm-4">
                <div class="app-footer__inner">
                    <p style="margin: 0">${schoolSettingsTechnical.copyrightYear} © ${schoolSettingsTechnical.copyrightUrl}</p>
                </div>
            </div>
        </div>`;
    return html;
}