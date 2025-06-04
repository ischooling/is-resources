var commonProfileDTO;
var schoolSettingsLinks;
var schoolSettingsTechnical;

async function permissionForLmsSmsContent(){
    commonProfileDTO = await getUserShortProfile(USER_ID);
    var payload = {};
    payload['userId'] = USER_ID;
    responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'get-lms-details', payload);
    var html=
        `<div class="app-container body-tabs-shadow fixed-header fixed-sidebar">`
            html+=await topHeaderContent();
            html+=await cardContent(responseData.details);
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
        html+=` </div>`;
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
                            // if(data.singleSignOnResponseDTO.ssoList.length > 0){
                            //     html+=
                            //     `<label class="switch">
                            //         <input class="switch-input redirectLmsUrl" type="checkbox" value="yes"
                            //             onclick="redirectLms(this, '${isPayLmsPaymentPending}');"
                            //             changeUrl="${lmsProviderURL}" />
                            //         <span class="switch-label" data-on="" data-off="LMS"></span>
                            //         <span class="switch-handle"></span>
                            //     </label>`
                            // }
                        html+=`</div>
                        <div style="align-items: center;display: flex; margin-left: auto;padding-right:20px;">
                            <a href="${APP_BASE_URL}${SCHOOL_UUID}/common/logout/${UNIQUEUUID}?from=dashboard" class="btn-pill btn-shadow btn-shine btn btn-primary">
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

async function cardContent(data){
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
                                <h5 class="text-center full font-weight-semi-bold">
                                    <p class="mb-1">${welcomeMessage} <span class="text-primary">${USER_FULL_NAME}!</span></p>
                                    <p class="mb-1">Great to see you again</p>
                                    <p class="m-0">We are just a message away! Keep Learning, Keep Smiling.</p>
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div class="row justify-content-center ">
                        <div class="col-lg-6 col-md-12 col-sm-12 col-12 mt-2">
                            <div class="main-card mb-2 card br-4">
                                <div class="card-body">
                                    <div class="col-md-12 text-center">
                                        <div class="full">
                                            <h2 class="full text-center text-primary-gradient font-weight-bold">SMS</h2>
                                        </div>
                                        <a href="javascript:void(0)" onclick="windowRedirectToDashboard('${data.dashboardUrl}')" class="mb-2 mr-2 btn-icon-vertical btn bg-primary-gradient text-white p-4 br-3">
                                            <div class="d-flex flex-wrap justify-content-center">
                                                <h6 class="mt-2 mb-0"><i class="fa fa-user" style="font-size:22px"> </i> <b>School Management System (SMS)</b></h6>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
                        if(data.ssoList.length > 0){
                            html+=`<div class="col-lg-6 col-md-12 col-sm-12 col-12 mt-2">
                                <div class="main-card mb-2 card br-4">
                                    <div class="card-body ">
                                        <div class="col-md-12 text-center ">
                                            <div class="full">
                                                <h2 class="full text-center text-success-gradient font-weight-bold">LMS</h2>
                                            </div>
                                            <div class="d-flex flex-wrap justify-content-center">`
                                                $.each(data.ssoList, function(index, sso) {
                                                    if(sso.isPayLmsPaymentPending != null){
                                                        html+=`<a class="mb-2 mr-2 btn-icon-vertical bg-success-gradient p-4 text-white br-3 p-2">
                                                            <h6 class="mb-0"><i class="fa fa-book" style="font-size:18px"> </i> <b> ${sso.lmsProviderName}</b></h6>
                                                        </a>`
                                                    }else{
                                                        html+=`<a href="javascript:void(0)" onclick="callWithSession('${sso.lmsProviderSSOUrl}')" class="mb-2 mr-2 btn-icon-vertical btn bg-success-gradient text-white br-3 p-2">
                                                            <h6 class="mb-0"><i class="fa fa-book" style="font-size:18px"> </i> <b>${sso.lmsProviderName}</b></h6>
                                                        </a>`
                                                    }
                                                    if(sso.isPayLmsPaymentPending != null){
                                                        html+=`<div class="row justify-content-center text-danger"><h5><b>${sso.isPayLmsPaymentPending}</b></h5></div>`
                                                    }
                                                })
                                            html+=`</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                        }
                    html+=`</div>
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