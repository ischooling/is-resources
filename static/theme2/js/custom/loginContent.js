var IS_INTERNATIONAL_SCHOOLING = Number(SCHOOL_ID) === 1;
var SHOW_GRADUATION_LOGIN_DESIGN = IS_INTERNATIONAL_SCHOOLING && isGraduationLoginDesignVisible();

function isGraduationLoginDesignVisible(){
    var graduationHideFromDate = new Date(2026, 6, 26);
    return new Date() < graduationHideFromDate;
}

async function loginContent(userName, fromSpoof){
    var html =``;
        html+=marqueeContent();
        html+=
        `<div class="login-bg login-redesign bg-primary${SHOW_GRADUATION_LOGIN_DESIGN ? ' login-graduation-split' : ''}${!IS_INTERNATIONAL_SCHOOLING ? ' login-school-primary-bg' : ''}">
            ${IS_INTERNATIONAL_SCHOOLING ? `
                <div class="login-orbs" aria-hidden="true">
                    <span class="login-orb login-orb-1"></span>
                    <span class="login-orb login-orb-2"></span>
                    <span class="login-orb login-orb-3"></span>
                    <span class="login-orb login-orb-4"></span>
                    <span class="login-orb login-orb-5"></span>
                    <span class="login-orb login-orb-6"></span>
                </div>
            ` : ``}
            ${SHOW_GRADUATION_LOGIN_DESIGN ? `
                <aside class="graduation-event graduation-event-side">
                    <div class="graduation-event-content">
                        <p class="graduation-description graduation-main-title" style="font-size:24px; line-height:1.25; margin-bottom:10px; font-weight:800; white-space:nowrap; transform:translateX(-54px);">Celebrating Graduation Ceremony 2026 from <strong>190+ Countries</strong></p>
                        <div class="graduation-event-heading">
                            <span class="graduation-event-badge" style="font-size:19px;">Graduation Ceremony, 2026</span>
                        </div>
                         <p class="graduation-location" style="font-size:18px;">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z"></path>
                            </svg>
                            Atlantis, The Palm Dubai - UAE
                        </p>
                        <h3 class="yellow-text graduation-event-date" style="margin-bottom:4px; font-size:18px; font-weight:600;">July 25, 2026 &bull; 2 PM UAE Time Onwards</h3>
                        <p class="graduation-description graduation-attendee-types" style="margin:4px 0 10px; font-size:16px; font-weight:600;">Graduate | Non-Graduate | Performer | Teacher | Staff</p>
                        <div class="graduation-event-heading mt-2">
                            <span class="graduation-event-badge graduation-registration-deadline graduation-registration-closed" style="background:white;">Registration Closed!</span>
                        </div>
                    </div>
                </aside>
            ` : ``}
            <div class="container login-redesign__container" style="display: flex;justify-content: center;">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        ${SCHOOL_ID === 1 ? `<div class="login-wrapper">` : `<div class="login-wrapper" style="text-align: center;">`}
                            <div class="login">
                                <div class="login-logo eid_logo_align_2022" style="margin:0">
                                    <a href="${schoolSettingsLinks.schoolWebsite}" target="blank">
                                        <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" width="350" loding="lazy" />
                                    </a>
                                </div>
                                <hr style="margin:18px 0px 16px 0px;"/>
                                <h4 class="sms primary-txt-color">School Management System</h4>
                                <div>
                                    <div class="user-circle">
                                        <span class="circle-border primary-border-color">
                                            <span class="profile-avatar" aria-hidden="true">
                                                <span class="profile-avatar-head"></span>
                                                <span class="profile-avatar-body"></span>
                                            </span>
                                        </span>
                                        
                                    </div>
                                </div>
                                <h1 class="login-welcome"><span class="primary-txt-color">Welcome</span> <span class="secondary-txt-color">back!</span></h1>
                                `;

                                html+=loginFormContent(userName, fromSpoof);

                                html+=
                                `<div class="form-group"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        html+=serverErrorMessageContent()
        +forgotPasswordContent()
        +commonEmailAllreadyExistContent()
        +emailLimitContent()
        +getCookiesConsentContent();
    return html;
}

function fireworksContent(){
    var html = 
        `<div class="fireworks-container">
                <div class="loading-init">
                    <div class="loading-init__header">Loading</div>
                    <div class="loading-init__status">Assembling Shells</div>
                </div>
                <div class="stage-container remove">
                    <div class="canvas-container">
                        <canvas id="trails-canvas"></canvas>
                        <canvas id="main-canvas"></canvas>
                    </div>
                    <div class="menu hide">
                        <div class="menu__inner-wrap">
                            <form>
                                <div class="form-option form-option--select">
                                    <label class="shell-type-label">Shell Type</label>
                                    <select class="shell-type"></select>
                                </div>
                                <div class="form-option form-option--select">
                                    <label class="shell-size-label">Shell Size</label>
                                    <select class="shell-size"></select>
                                </div>
                                <div class="form-option form-option--select">
                                    <label class="quality-ui-label">Quality</label>
                                    <select class="quality-ui"></select>
                                </div>
                                <div class="form-option form-option--select">
                                    <label class="sky-lighting-label">Sky Lighting</label>
                                    <select class="sky-lighting"></select>
                                </div>
                                <div class="form-option form-option--select">
                                    <label class="scaleFactor-label">Scale</label>
                                    <select class="scaleFactor"></select>
                                </div>
                                <div class="form-option form-option--checkbox">
                                    <label class="auto-launch-label">Auto Fire</label>
                                    <input class="auto-launch" type="checkbox" />
                                </div>
                                <div class="form-option form-option--checkbox form-option--finale-mode">
                                    <label class="finale-mode-label">Finale Mode</label>
                                    <input class="finale-mode" type="checkbox" />
                                </div>
                                <div class="form-option form-option--checkbox">
                                    <label class="hide-controls-label">Hide Controls</label>
                                    <input class="hide-controls" type="checkbox" />
                                </div>
                                <div class="form-option form-option--checkbox form-option--fullscreen">
                                    <label class="fullscreen-label">Fullscreen</label>
                                    <input class="fullscreen" type="checkbox" />
                                </div>
                                <div class="form-option form-option--checkbox">
                                    <label class="long-exposure-label">Open Shutter</label>
                                    <input class="long-exposure" type="checkbox" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="help-modal">
                    <div class="help-modal__overlay"></div>
                    <div class="help-modal__dialog">
                        <div class="help-modal__header"></div>
                        <div class="help-modal__body"></div>
                        <button type="button" class="help-modal__close-btn">Close</button>
                    </div>
                </div>
            </div>`;
        return html;
}

function marqueeContent(){
    var html =``;
    if(MAINTENANCEDOWNTIME != ''){
            html+=`<div class="marquee">
                <marquee id="marqueeDiv" direction="left" style="font-size: 15px; font-weight: normal; line-height: 26px; margin-top: 0px;position:relative;z-index:9" width="100%" height="26px;">
                    ${MAINTENANCEDOWNTIME}
                </marquee>
            </div>`;
    }
    return html;
}

function CommonLandingImageContent(data){
    html=`
    <div class="col-lg-8 col-md-8 col-sm-6 col-xs-12 text-center">
        <p>&nbsp;</p>
        <img src="${PATH_FOLDER_IMAGE2}student.png${SCRIPT_VERSION}" style="background: #fff; height: 220px" loding="lazy">`;
        if (schoolSettings.schoolId === 1) {
            html+=`<h1 style="font-size: 23px;">Learn at your own comfort with </h1>`;
        }
        html+=
        `<div class="full-social-links mobile-view">
            <p class="social-icon-img-format">`;
                if (schoolSettingsLinks.fbUrl) {
                html+=`<a href="${schoolSettingsLinks.fbUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE2}facebook.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.twitterUrl) {
                html+=`<a href="${schoolSettingsLinks.twitterUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE2}twitter.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.instagramUrl) {
                html+=`<a href="${schoolSettingsLinks.instagramUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE2}instagram.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.linkdinUrl) {
                html+=`<a href="${schoolSettingsLinks.linkdinUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE2}linkedin.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.pintrestUrl) {
                html+=`<a href="${schoolSettingsLinks.pintrestUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE2}pin.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
            html+=`</p>
        </div>
    </div>`;
}

function loginFormContent(userName, fromSpoof){
    var html=
    `
        <form class="input-with-icon login-2023-theme custom-field-scope login-form" id="loginForm" name="loginForm" method="post" autocomplete="off">
            <input type="hidden" name="location" id="location" value="{}" />
            <input type="hidden" name="fromSpoof" id="fromSpoof" value="${fromSpoof}" />
            <div class="custom-field valid-field login-field login-field-email">
                <span class="login-field-icon primary-txt-color">
                    <i class="fa fa-envelope"></i>
                </span>
                <input type="email" name="email" id="email" autocomplete="off" class="form-control"
                        value="${userName}" maxlength="50" describedby="email-addon" placeholder=" ">
                <label class="control-label" for="email">Email</label>
                <a href="javascript:void(0)" class="login-field-action login-field-info" data-toggle="tooltip" data-html="true" data-container=".login-wrapper"
                        data-template="<div class='tooltip login-email-tooltip' role='tooltip'><div class='tooltip-arrow'></div><div class='tooltip-inner'></div></div>"
                        title="Please login using the email &amp; password provided at the time of enrollment.">
                    <i class="fa fa-info-circle"></i>
                </a>
            </div>
            <div class="custom-field valid-field login-field login-field-password">
                <span class="login-field-icon primary-txt-color">
                    <i class="fa fa fa-lock"></i>
                </span>
                <input name="password" id="password" class="form-control" autocomplete="off"
                    type="password" maxlength="20" value="" describedby="describedby" placeholder=" ">
                <label class="control-label" for="password">Password</label>
                <button type="button" class="login-field-action login-field-toggle" aria-label="Show password" onclick="showPassWord('password', 'icon-change')">
                    <i class="fa fa-eye-slash" id="icon-change"></i>
                </button>
            </div>
            <p class="text-right text-dark m-0 login-forgot-row">
                <a class="forgot-password-link" href="javaScript:void(0)" onclick="callFocusForForgotPassword()">Forgot Password?</a>
            </p>
            <div class="captcha-row">
                <div class="custom-field valid-field captch-field login-field login-field-captcha">
                    <span class="login-field-icon primary-txt-color">
                        <i class="fa fa-lock"></i>
                    </span>
                    <input type="text" name="captcha" id="captcha" class="form-control" placeholder=" " value=""
                            inputmode="numeric" pattern="[0-9]{6}" minlength="6" maxlength="6"
                            oninput="this.value=this.value.replace(/[^0-9]/g,'')" required>
                    ${/*onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);"*/''}
                    <label class="control-label" for="captcha">Captcha</label>
                </div>
                <span class="captcha-row-arrow" aria-hidden="true">←</span>
                <div class="captcha-code-box primary-bg white-txt-color">
                    <div style="display:inline-flex">
                        <img id="captchaImage" alt="Captcha" src="" onerror="this.onerror=null;refreshCaptcha('captchaImage');" loding="lazy" />
                    </div>
                    <a class="captcha-refresh-btn" href="javascript:void(0);" title="Refresh" onClick="return refreshCaptcha('captchaImage');">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" fill="#fff">
                            <path d="M129.9 292.5C143.2 199.5 223.3 128 320 128C373 128 421 149.5 455.8 184.2C456 184.4 456.2 184.6 456.4 184.8L464 192L416.1 192C398.4 192 384.1 206.3 384.1 224C384.1 241.7 398.4 256 416.1 256L544.1 256C561.8 256 576.1 241.7 576.1 224L576.1 96C576.1 78.3 561.8 64 544.1 64C526.4 64 512.1 78.3 512.1 96L512.1 149.4L500.8 138.7C454.5 92.6 390.5 64 320 64C191 64 84.3 159.4 66.6 283.5C64.1 301 76.2 317.2 93.7 319.7C111.2 322.2 127.4 310 129.9 292.6zM573.4 356.5C575.9 339 563.7 322.8 546.3 320.3C528.9 317.8 512.6 330 510.1 347.4C496.8 440.4 416.7 511.9 320 511.9C267 511.9 219 490.4 184.2 455.7C184 455.5 183.8 455.3 183.6 455.1L176 447.9L223.9 447.9C241.6 447.9 255.9 433.6 255.9 415.9C255.9 398.2 241.6 383.9 223.9 383.9L96 384C87.5 384 79.3 387.4 73.3 393.5C67.3 399.6 63.9 407.7 64 416.3L65 543.3C65.1 561 79.6 575.2 97.3 575C115 574.8 129.2 560.4 129 542.7L128.6 491.2L139.3 501.3C185.6 547.4 249.5 576 320 576C449 576 555.7 480.6 573.4 356.5z"/>
                        </svg>
                    </a>
                </div>
            </div>

            <div class="form-group text-center login-actions">
                <button type="submit" class="btn primary-bg btn-shadow white-txt-color login-submit-btn" id="loginButton">
                    <span>Log in</span>
                </button>
                <div class="login-footer-links">
                    ${schoolSettingsLinks.termasOfUserUrl != null && schoolSettingsLinks.termasOfUserUrl != undefined && schoolSettingsLinks.termasOfUserUrl != '' ? `<a href="${schoolSettingsLinks.termasOfUserUrl}" target="blank">Terms of use</a>` : ``}
                    ${schoolSettingsLinks.termasOfUserUrl != null && schoolSettingsLinks.termasOfUserUrl != undefined && schoolSettingsLinks.termasOfUserUrl != '' && schoolSettingsLinks.privacyPolicyUrl != null && schoolSettingsLinks.privacyPolicyUrl != undefined && schoolSettingsLinks.privacyPolicyUrl != '' ? `<span class="dot">•</span>` : ``}
                    ${schoolSettingsLinks.privacyPolicyUrl != null && schoolSettingsLinks.privacyPolicyUrl != undefined && schoolSettingsLinks.privacyPolicyUrl != '' ? `<a href="${schoolSettingsLinks.privacyPolicyUrl}" target="blank">Privacy Policy</a>` : ``}
                    <div class="login-footer-copy">${schoolSettingsTechnical.isCoPoweredBy != null ? 'Powered by ' + schoolSettingsTechnical.copyrightName : 'Copyright © ' + schoolSettingsTechnical.copyrightYear + ' - ' + schoolSettingsTechnical.copyrightName + ' - All Rights Reserved.'}</div>
                </div>
            </div>
        </form>`;
    return html;
}

function forgotPasswordContent(){
    var html=
    `
        <div id="forgotPassword" class="modal fade" role="dialog">
            <div class="modal-dialog  modal-dialog-centered modal-md ">
                ${/*<!-- Modal content-->*/''}
                <div class="modal-content rounded-15 overflow-hidden ">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close" data-dismiss="modal" style="margin-top:3px;color:#fff;opacity:1">&times;</button>
                        <h5 class="modal-title" style="color: white; text-align: center;">
                            <strong>Forgot Password?</strong>
                        </h5>
                    </div>
                    <form name="forgetForm" id="forgetForm"  method="post" autocomplete="off">
                        <div class="modal-body text-center input-with-icon forgot-password-body custom-field-scope">
                            ${/*<!-- <label for="recipient-name" class="form-control-label"
                                style="text-transform: capitalize">Registered Email</label> -->*/''}
                            <div class="full">
                                <p class="text-center m-0 font-16"><b> Please enter your Registered Email </b></p>
                            </div>
                            <div class="input-group">
                                <h5 style="color: green;">
                                    <span id="thanks"></span>
                                </h5>
                            </div>
                            <div class="custom-field valid-field login-field forgot-password-field">
                                <span class="login-field-icon primary-txt-color" id="email-addon2">
                                    <i class="fa fa-envelope"></i>
                                </span>
                                <input type="text" name="emailid" id="emailid" class="form-control" placeholder=" " describedby="email-addon2" required>
                                <label class="control-label" for="emailid">Registered Email</label>
                            </div>
                            <button type="button" class="btn btn-primary btn-round btn-shadow primary-bg white-txt-color" id="forgotSubmit">Send Password Reset Link to my Email</button>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>    
    `
    return html;
}

function commonEmailAllreadyExistContent(){
    var html=
    `
        <div id="allReadyEmail" class="modal fade" role="dialog">
            <div class="modal-dialog modal-dialog-centered modal-md">
                ${/*<!-- Modal content-->*/''}
                <div class="modal-content rounded-15 overflow-hidden border-0 shadow-lg">
                    <div class="modal-header primary-bg white-txt-color justify-content-center">
                        <button type="button" class="close white-txt-color" data-dismiss="modal" style="color:#fff;opacity:1">&times;</button>
                        <h5 class="modal-title text-center white-txt-color">
                            <strong id="allReadyEmailTitle">Error!</strong>
                        </h5>
                    </div>
                    <input type="hidden" id="userId" value=""/>
                    <div class="modal-body text-center p-4">
                        <p class="font-16 font-weight-bold mb-0" id="emailNotVerify">
                            Your email hasn't been verified yet. Please click 
                            <a href="javascript:void(0);" id="notVerify" class="primary-txt-color">Here</a> to generate a
                            new verification email, if you haven't yet received one.
                        </p>
                        <p class="font-16 text-justify mb-0" id="emailVerify">
                            ${/* 
                            <!--You are already ${data.moduleId == 'STUDENT'? 'enrolled':'registered'} with ${schoolSettings.schoolName}. Please 
                            <a href="${APP_BASE_URL}${SCHOOL_UUID}/common/login" class="primary-txt-color">Login</a> to continue.-> */''}
                        </p>
                        <p class="font-16 text-center mb-0" id="userDeclined" style="padding: 1px 0 1px;">
                            Your account has been temporarily blocked due to <span id="userDeclinedMessage"></span><br/>For more information please contact the <a href="${APP_BASE_URL}${SCHOOL_UUID}/common/inquiry" id="declined" class="primary-txt-color">support team.</a>
                        </p>
                    </div>
                    <div id="allReadyEmailFooter" class="modal-footer text-center justify-content-center">
                        <a href="${schoolSettingsLinks.signupUrl}" class="btn btn-primary btn-round btn-shadow primary-bg white-txt-color">ENROLL NOW</a>
                    </div>
                </div>
            </div>
        </div>
    `
    return html;
}

function emailLimitContent(){
    var html=
    `
        <div id="emialLimit" class="modal fade" role="dialog">
            <div class="modal-dialog">
                ${/*<!-- Modal content-->*/''}
                <div class="modal-content modal-md">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title" style="color: white;text-align: center;">
                            <strong>Info!</strong>
                        </h4>
                    </div>
                    <input type="hidden" id="userId" value="" />
                    <div class="modal-body">
                        <p style="font: normal 16px Arial, Helvetica, sans-serif; text-align: justify" id="emailLimitText"></p>
                    </div>
                </div>
            </div>
        </div>
    `
    return html;
}

function footerContent(){
    var html=
    `
        <div class="space"></div>
        <div style="clear:both"></div>
        <div class="footer">
            <div class="new-foot">
                <div class="container">
                    <div class="row">
                        <div class="col-lg-8 col-md-8 col-sm-8 col-xs-12">
                            <p>${schoolSettingsTechnical.isCoPoweredBy != null ? 'Powered by ' + schoolSettingsTechnical.copyrightName : 'Copyright © ' + schoolSettingsTechnical.copyrightYear + ' - ' + schoolSettingsTechnical.copyrightName + ' - All Rights Reserved.'}</p>
                        </div>
                        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12 text-right">
                            <p>`;
                                if(schoolSettingsLinks.privacyPolicyUrl != ''){
                                    html+=` <a href="${schoolSettingsLinks.privacyPolicyUrl}" target="blank">Privacy Policy</a>`;
                                }
                                if(schoolSettingsLinks.termasOfUserUrl != ''){
                                    html+=`| <a href="${schoolSettingsLinks.termasOfUserUrl}" target="blank">Terms of Use</a>`;
                                }
                            html+=`</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    return html;
}

function getCookiesConsentContent(){
    var html=
    `<div class="cookies cookie-consent" style="display:block;">
        <p>The website uses 'cookies' to give you the best, most relevant experience.
        By continuing to visit this site you agree to our use of cookies. 
        <a href="javascript:void(0);" class="cookie-consent-agree">Accept Cookies</a>
        </p>
    </div>`;
    return html;
}

function serverErrorMessageContent(){
    var html=
        `<div class="modal fade" id="modalMessage" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-notify modal-info" role="document">
                <div class="modal-content text-center">
                    <div id="statusMessage" class="modal-body"></div>
                </div>
            </div>
        </div>`;
    return html;
}
