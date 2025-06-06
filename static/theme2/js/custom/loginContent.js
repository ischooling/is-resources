
async function loginContent(userName){
    var html =``;
            html+=marqueeContent();
            html+=
            `<div class="login-bg">
                <div class="container" style="display: flex;justify-content: center;">
                    ${/*<div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-right">

                        </div>
                    </div>*/''}
                    <div class="row">
                        <div class="col-lg-6 col-md-12 col-sm-6 col-xs-12 text-center">
                            ${/*<div class="login-logo eid_logo_align_2022">
                                <a href="${schoolSettingsLinks.schoolWebsite}" target="blank">
                                    <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" width="160" loding="lazy"/>
                                </a>
                            </div>*/''}
                           ${/*<div class="new-year-img">
                                <img src="${PATH_FOLDER_IMAGE}2022.png" loding="lazy"/>
                            </div>*/''} 
                        </div>`;

                        +CommonLandingImageContent();
                        html+=
                        `<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">`;
                            if(SCHOOL_ID === 1){
                                html+=`<div class="login-wrapper">`;
                            } else{
                                html+=`<div class="login-wrapper" style="text-align: center;">`;
                            }
                            html+=
                            `${/*<img src="${PATH_FOLDER_IMAGE2}happy_new_year_2025_text.jpg" class="christmas-text-img" loding="lazy"/>*/''}
                            ${/*<img src="${PATH_FOLDER_IMAGE2}happy_new_year_2025_text.png" class="christmas-text-img" style="display: inline-block;float: none;" loding="lazy"/>*/''}
                            <div class="login">
                                <div class="login-logo eid_logo_align_2022" style="margin:0">
                                    <a href="${schoolSettingsLinks.schoolWebsite}" target="blank">
                                        <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" width="350" loding="lazy" />
                                    </a>`;
                                    // if(SCHOOL_ID == 1){
                                    //     html+=`<h5 class="text-primary" style="margin-top:5px;font-size:14px;font-weight:500">My School, My Location, My Time</h5>`;
                                    // }
                                    html+=
                                    `</div>
                                    <hr style="margin:20px 0px 0px 0px;"/>`
                                    if(SCHOOL_ID === 1){
                                        html+=`<h4 class="sms"style="">School Management System</h4>`;
                                    }else{
                                        html+=`<h4 class="sms primary-txt-color"style="">School Management System</h4>`;
                                    }
                                    html+=
                                    `<div>
                                        <div class="user-circle">
                                            <span class="circle-border primary-border-color">
                                                <i class="fa fa fa-user-o user-icon primary-txt-color"></i>
                                            </span>
                                        </div>
                                    </div>
                                    <h1 class="primary-txt-color">  User Login</h1>`;

                                    html+=loginFormContent(userName);
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
            +commonLoaderContent()
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
                <marquee id="marqueeDiv" direction="left" style="font-size: 15px; font-weight: normal; line-height: 26px; margin-top: 0px;" width="100%" height="26px;">
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
        <img src="${PATH_FOLDER_IMAGE}student.png${SCRIPT_VERSION}" style="background: #fff; height: 220px" loding="lazy">`;
        if (schoolSettings.schoolId === 1) {
            html+=`<h1 style="font-size: 23px;">Learn at your own comfort with </h1>`;
        }
        html+=
        `<div class="full-social-links mobile-view">
            <p class="social-icon-img-format">`;
                if (schoolSettingsLinks.fbUrl) {
                html+=`<a href="${schoolSettingsLinks.fbUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE}facebook.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.twitterUrl) {
                html+=`<a href="${schoolSettingsLinks.twitterUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE}twitter.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.instagramUrl) {
                html+=`<a href="${schoolSettingsLinks.instagramUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE}instagram.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.linkdinUrl) {
                html+=`<a href="${schoolSettingsLinks.linkdinUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE}linkedin.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
                if (schoolSettingsLinks.pintrestUrl) {
                html+=`<a href="${schoolSettingsLinks.pintrestUrl}" target="_blank"><img src="${PATH_FOLDER_IMAGE}pin.png${SCRIPT_VERSION}" loding="lazy"></a>`;
                }
            html+=`</p>
        </div>
    </div>`;
}

function loginFormContent(userName){
    var html=
    `
        <form class="input-with-icon login-2023-theme" id="loginForm" name="loginForm" method="post" autocomplete="off">
	        <input type="hidden" name="location" id="location" value="{}" />
            <div class="text-left">
                <label class="control-label" style="font-size: 12px !important;">Email</label>
                <div class="input-group valid-field">
                    <span class="input-group-addon primary-bg primary-border-color" id="email-addon"> <i class="fa fa-envelope text-white"></i></span>
                    <input	type="email" name="email" id="email" autocomplete="off" class="form-control"
                            value="${userName}" maxlength="50" describedby="email-addon">
                    <span class="input-group-addon" id="email-addon" style="cursor:pointer;background-color:#fff !important;border-color:#ccc !important;border-left:0px !important">
                        <a href="javascript:void(0)" data-toggle="tooltip" title="Please login using the email & password provided at the time of enrollment."><i class="fa fa-info-circle"></i></a>
                    </span>
                </div>
            </div>
            <div class="text-left">
                <label class="control-label" style="font-size: 12px !important;">Password</label>
            </div>
            <div class="input-group valid-field">
                <span class="input-group-addon primary-bg primary-border-color" id="password-addon"> <i class="fa fa fa-lock  text-white"></i></span>
                <input name="password" id="password" class="form-control" autocomplete="off"
                    type="password" pattern="^[_A-z0-9@#]{1,}$" maxlength="20"  value="" describedby="describedby">
                <span class="input-group-addon" id="password-addon" style="cursor:pointer;background-color:#fff !important;border-color:#ccc !important;border-left:0px !important">
                    <i class="fa fa-eye-slash" id="icon-change" onclick="showPassWord('password', 'icon-change')"></i>
                    <!-- <span style="position: absolute;right: 15px;cursor:pointer;"><i class="fa fa-eye-slash"></i> -->
                </span>
            </div>
            <p class="text-right text-dark m-0">`;
                // if(!schoolSettingsLinks.signupUrl){
                //     html+=`<a class="primary-txt-color" href="${schoolSettingsLinks.signupUrl}">Don't have an account?</a> <br />`
                // }
                html+=`<a style="color:#828282;font-size: 12px;" href="javaScript:void(0)" onclick="callFocusForForgotPassword()">Forgot Password?</a><br />`;
                // if(!schoolSettingsLinks.ticketRaisedUrl){
                //     html+=`<a class="primary-txt-color" href="${schoolSettingsLinks.ticketRaisedUrl}" target="_blank">Submit a Ticket</a>`;
                // }
            html+=`</p>
            <div class="text-left">
                <label class="control-label" style="font-size: 12px !important;">Captcha</label>
            </div>		
            <div class="input-group captch-field full valid-field">
                <div class="form-group label-floating">
                    <input type="text" name="captcha" id="captcha" class="form-control" style="width: 58%; float:left;text-transform: uppercase;" value="" pattern="^[_A-z0-9]{1,}$" minlength="6" maxlength="6" required>
                        ${/*onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);"*/''}
                    <span style="background: #009eff;padding: 1px 0px;border-radius: 4px;">
                        <img id="captchaImage" alt="Captcha" src="${APP_BASE_URL}${SCHOOL_UUID}/api/v1/common/captcha.jpg?payload=`+getPrimaryColor()+`&v=`+new Date().getTime()+`" style="width:130px; height: 25px;position:relative;left:2px" loding="lazy" />
                        <a class="refresh-link text-white" href="javascript:void(0);" title="Refresh"
                            onClick="return refreshCaptcha('captchaImage');" style="display: inline-block;padding: 0px 8px;border-left:1px solid rgba(255, 255, 255, 0.3);color:#fff">
                            <i class="fa fa-refresh"></i>
                        </a>
                    </span>
                </div>
            </div>

            <div class="form-group text-center">
                <input type="submit" class="btn primary-bg white-txt-color" id="loginButton" value="Login">
                <p>
                    <span class="primary-txt-color">© ${schoolSettingsTechnical.copyrightYear} ${schoolSettingsTechnical.copyrightName}<br />`;
                        if(schoolSettingsLinks.termasOfUserUrl != ''){
                            html+=`<a class="black-txt-color" href="${schoolSettingsLinks.termasOfUserUrl}" target="blank">Terms of use </a>`;
                        }
                        if(schoolSettingsLinks.privacyPolicyUrl != ''){
                            html+=`| <a class="black-txt-color" href="${schoolSettingsLinks.privacyPolicyUrl}" target="blank">Privacy Policy</a>`;
                        }
                    html+=`</span>
                </p>
            </div>
        </form>`
    return html;
}

function forgotPasswordContent(){
    var html=
    `
        <div id="forgotPassword" class="modal fade " role="dialog">
            <div class="modal-dialog  modal-dialog-centered modal-md">
                ${/*<!-- Modal content-->*/''}
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close" data-dismiss="modal" style="margin-top:3px;color:#fff;opacity:1">&times;</button>
                        <h4 class="modal-title" style="color: white; text-align: center;">
                            <strong>Forgot Password?</strong>
                        </h4>
                    </div>
                    <form name="forgetForm" id="forgetForm"  method="post" autocomplete="off">
                        <div class="modal-body text-center input-with-icon">
                            ${/*<!-- <label for="recipient-name" class="form-control-label"
                                style="text-transform: capitalize">Registered Email</label> -->*/''}
                            <div class="full">
                                <p class="text-center m-0">Please enter your <b>REGISTERED</b> Email</p>
                            </div>
                            <div class="input-group">
                                <h5 style="color: green;">
                                    <span id="thanks"></span>
                                </h5>
                            </div>
                            <div class="text-left">
                                <label class="primary-txt-color m-0">Registered Email</label>
                                <div class="input-group">
                                    <span class="input-group-addon primary-bg primary-border-color" id="email-addon2">
                                        <i class="fa fa-envelope text-white"></i>
                                    </span>
                                    <input type="text" name="emailid" id="emailid" class="form-control" placeholder="" describedby="email-addon2"  required>
                                </div>
                            </div>
                            <button type="button" class="btn btn-primary primary-bg white-txt-color" id="forgotSubmit">Send Password Reset Link to my Email</button>
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
            <div class="modal-dialog">
                ${/*<!-- Modal content-->*/''}
                <div class="modal-content modal-md">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close white-txt-color" data-dismiss="modal" style="margin-top:3px;color:#fff;opacity:1">&times;</button>
                        <h4 class="modal-title" style="color: white; text-align: center;">
                            <strong>Error!</strong>
                        </h4>
                    </div>
                    <input type="hidden" id="userId" value=""/>
                    <div class="modal-body">
                        <p style="font: normal 16px Arial, Helvetica, sans-serif; text-align: center;margin-top:35px;font-weight: bold;" id="emailNotVerify">
                            Your email hasn't been verified yet. Please click 
                            <a href="javascript:void(0);" id="notVerify" class="primary-txt-color">Here</a> to generate a
                            new verification email, if you haven't yet received one.
                        </p>
                        <p style="font: normal 16px Arial, Helvetica, sans-serif; text-align: justify;margin-top:35px;" id="emailVerify">
                            ${/* 
                            <!--You are already ${data.moduleId == 'STUDENT'? 'enrolled':'registered'} with ${schoolSettings.schoolName}. Please 
                            <a href="${APP_BASE_URL}${SCHOOL_UUID}/common/login" class="primary-txt-color">Login</a> to continue.-> */''}
                        </p>
                        <p style="font: normal 16px Arial, Helvetica, sans-serif; text-align: justify;margin-top:35px;" id="userDeclined">
                            You are not an approved user. For more information please contact the
                            <a href="${APP_BASE_URL}${SCHOOL_UUID}/common/inquiry" id="declined" class="primary-txt-color">support team.</a> 
                        </p>
                    </div>
                    <div id="allReadyEmailFooter" class="modal-footer" style="text-align: center;">
                        <a href="${schoolSettingsLinks.signupUrl}" class="btn btn-primary primary-bg white-txt-color">ENROLL NOW</a>
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
                            <p>© ${schoolSettingsTechnical.copyrightYear} ${schoolSettingsTechnical.copyrightName} | All Rights Reserved. 
                                <a class="cs-color" href="${schoolSettingsTechnical.copyrightUrl}">${schoolSettingsTechnical.copyrightName}</a>
                            </p>
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

function commonLoaderContent(){
    var html=`
        <div id="commonloaderId" class="hide unique-loader">`;
            if(SCHOOL_ID == '1'){
                html+=`<img src="${PATH_FOLDER_IMAGE2}loader-new.gif" alt="${SCHOOL_NAME} Loader" class="new-loader-2024" loding="lazy"/>`;
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