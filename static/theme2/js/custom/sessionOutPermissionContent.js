function sessionOutPermissionContent(data){
    var html=
    `<div id="sessionOutPermission" class="modal  fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered" style="box-shadow: none !important">
            <div class="modal-content border-0 bg-transparent">
                <div class="modal-header pt-2 pb-2 pl-0 pr-0 bg-transparent text-white border-0">
                    <h5 class="modal-title fsize-1 full text-center" >Your session has been logged out</h5>
                    ${/*<button type="button" class="close text-white" data-dismiss="modal"
                        aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>*/''}
                </div>
                <div class="modal-body pt-0 pb-0 bg-transparent">
                    <form id="continueSessionForm" name="continueSessionForm" method="post" autocomplete="off" class="custom-field-scope">
                        <div class="server-error">
                            <p id="serverError"></p>
                            <p id="messageDiv1"></p>
                            ${/*<p id="msgTheme2"></p>*/''}
                        </div>	
                        <div class="form-row form-session-out">
                            <input type="hidden" name="location" id="location" value="{}"/>
                            <input type="hidden" name="fromSpoof" id="fromSpoof" value="N"/>
                            <input type="hidden" name="email" id="email" class="form-control" value="${data.emailId}" maxlength="50">
                            <div class="col-md-12">
                                <div class="position-relative form-group mb-1 themeTwo custom-field">
                                    <input name="password" id="password" class="form-control themeTow" autocomplete="off" type="password" maxlength="20" value="" placeholder="Password">
                                    <label class="input-floating-label" for="password">Password <span style="color: red;">*</span></label> 
                                    <span style="position: absolute; right: 0; bottom: 8px; display: inline-block; width: 35px; cursor: pointer" class="show-password">
                                        <i class="fa fa-eye-slash" id="icon-change" onclick="showPassWord('password', 'icon-change')"></i>
                                    </span>
                                </div>
                                <p class="error" id="passwordError" style="color:red;font-weight:600"></p>
                            </div>
                            <div class="col-md-12">
                                <div class="position-relative form-group mb-1 captcha-stylecss custom-field">
                                    <div class="captcha-field">
                                        <input type="text" name="captcha" id="captcha" class="form-control bg-white rounded-10" value="" placeholder="Enter captcha text" pattern="^[_A-z0-9]{1,}$" minlength="6" maxlength="6"
                                            onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);" required>
                                        <label class="input-floating-label" for="captcha">Captcha <span style="color: red;">*</span></label>
                                        <span class="captcha-img-wrapper show-password"> 
                                            <img id="captchaImage" alt="Captcha" src="">
                                        </span>
                                        <a href="javascript:void(0);" title="Refresh" onClick="return refreshCaptcha('captchaImage');" style="position:relative;color:#fff">
                                            <i class="fas fa-sync"></i>
                                        </a>
                                    </div>
                                </div>
                                <p class="error" id="captchaError" style="color:red;font-weight:600"></p>
                            </div>
                            <div class="col-md-12">'
                                <input type="submit" class="btn btn-info " id="continueSession" value="Submit">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer bg-transparent pt-0 border-0 flex-wrap justify-content-center">
                    <div style="color:#fff;padding-left:1rem">Logged in as ${data.emailId}</div>
                    <div style="color:#fff;padding-left:1rem">Not You? <a href="javascript:void(0)" style="color:#009eff;font-weight:600" onclick="loginAsDifferentUser();">Log in as a different user</a> </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}
