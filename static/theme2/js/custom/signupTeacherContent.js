var schoolSettingsTechnical;              
var schoolSettingsLinks;
var schoolSettingsOffice;
async function renderTeacherEnrollmentPage(signupPage, moduleName){
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
    $("body").append(generateTeacherEnrollmentContent(moduleName));
    createStepsImage();
    getFormsValidation();
    if(signupPage >= 6 && signupPage <=7){
        await getStage5Data();
        if(signupPage == 7){
            $("#submitVerificationModal").modal('hide');
		    $('#inReviewForTeacherVerificationModal').modal({backdrop: 'static', keyboard: false});
        }
    }else{
        if(signupPage==5){
            await getStage4Data();
        }
        if(signupPage==8){
            await getStage6Data();
        }else if(signupPage < 5){
            if(signupPage>=2){
                if(signupPage == 2){
                    await getStage1Data();
                }
            }
            if(signupPage>=3){
                if(signupPage == 3){
                    await getStage1Data('2');
                }
                await getStage2Data();
            }
            if(signupPage>=4){
                await getStage3Data();
            }
        }
    }
    $('.select-option-wrapper .option').click(function() {
        var selectedValue = $(this).text();
        var selectedId = $(this).attr('value');
        $(this).parent().closest('.select-option-field').find('.select-option-input').val(selectedValue);
        $(this).parent().closest('.select-option-field').find('.select-option-input').attr('selectedValue',selectedId);
    });

    $('[data-toggle="tooltip"]').tooltip().show();
    $('#editStageFirstName').text($("#teacherSignupStage1 #teacherFirstName").val());
    $('#editStageMiddleName').text($('#teacherSignupStage1 #teacherMiddleName').val());
    $('#editStageLastName').text($('#teacherSignupStage1 #teacherLastName').val());
    var startDate = new Date();
    startDate.setFullYear(startDate.getFullYear()-99);
    
    var endDate = new Date();
    endDate.setFullYear(endDate.getFullYear()-18);
    $('#teacherDob').datepicker({
        autoclose : true,
        format : 'mm-dd-yyyy',
        startDate:startDate,
        endDate:endDate
    });
    $('#month').datepicker({
        autoclose : true,
        minViewMode : 1,
        format : 'mm/yyyy'
    });

    $(document).on("click", "#signupStage6 #chkval", function() {
        if ($("#chkval").is(":checked")) {
            $("#payTabData").removeAttr("disabled");
        } else {
            $("#payTabData").attr("disabled", true);
        }
        $("#teacherSignupContentStage2 #select_course .close, #teacherSignupContentStage2 #select_course .k8-theme-btn").click(function(){
            $(".modal-backdrop").remove();
        });
    });
}

function generateTeacherEnrollmentContent(moduleName){
    var html=
        `<div class="wrapper-style">
            <a class="tab-and-mobile-logout-btn primary-bg white-txt-color" href="${CONTEXT_PATH}${SCHOOL_UUID}/common/logout/${UNIQUEUUID}">
                <i class="zmdi zmdi-power"></i>
                Log out
            </a>`;
            if(DEPLOYMENT_MODE=='PROD'){
                html+=
                `${/*<!-- Google Tag Manager (noscript) -->*/''}
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PGC67T7" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
                ${/*<!-- End Google Tag Manager (noscript) -->*/''}
                ${/*<!-- Facebook Pixel Code -->*/''}
                <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2630519373836959&ev=PageView&noscript=1"/></noscript>
                ${/*<!-- End Facebook Pixel Code -->*/''}`
            }
                
            html+=`<section class="full">
                <div class="full mb-2">
                    <div class="logo">
                        <a href="${schoolSettingsLinks.schoolWebsite}" target="blank">
                            <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" alt="${schoolSettingsLinks.schoolWebsite}" target="blank">
                        </a>
                    </div>
                </div>`;
                if(moduleName != ''){
                    html+=
                    `<section class="full text-center">
                        <h1 class="form-heading white-txt-color alternate-bg page-heading">
                            ${moduleName}
                        </h1>
                    </section>`
                }
            html+=`</section>`;
            if(MAINTENANCEDOWNTIME !=''){
                html+=
                `<div class="full">
                    <marquee id="marqueeDiv" direction="left" style="color: red" width="100%">${MAINTENANCEDOWNTIME}</marquee>
                </div>`;
            }
            html+=
            `<div class="server-message">
                <span class="msg error" id="msgTheme2"><i class="fa fa-exclamation-triangle"></i>&nbsp;Failed to fetch meetings.</span>
            </div>
            <div id="formSteps">
                <div class="steps clearfix">
                    <ul role="tablist">
                        <li role="tab" aria-disabled="false" class="first current" aria-selected="true" id="step1_li">
                            <a>
                                <span class="step-order" style="text-transform: capitalize !important;">Step 1</span>
                                <div class="icon-circle"></div>
                                <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Personal Details</span>
                                <span class="step-arrow-teacher step1"></span>
                            </a>
                        </li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step2_li">
                            <a>
                                <span class="step-order" style="text-transform: capitalize !important;">Step 2</span>
                                <div class="icon-circle"></div>
                                <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Professional Details</span>
                                <span class="step-arrow-teacher step2"></span>
                            </a>
                        </li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step3_li">
                            <a>
                                <span class="step-order" style="text-transform: capitalize !important;">Step 3</span>
                                <div class="icon-circle"></div>
                                <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Demo Under Review</span>
                                <span class="step-arrow-teacher step3"></span>    
                            </a>
                        </li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step4_li">
                            <a>
                                <span class="step-order" style="text-transform: capitalize !important;">Step 4</span>
                                <div class="icon-circle"></div>
                                <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Contract Details</span>
                                <span class="step-arrow-teacher step4"></span>    
                            </a>
                        </li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step5_li">
                            <a>
                                <span class="step-order" style="text-transform: capitalize !important;">Step 5</span>
                                <div class="icon-circle"></div>
                                <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Verification</span>
                                <span class="step-arrow-teacher step5"></span>    
                            </a>
                        </li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true" id="step6_li">
                            <a>
                                <span class="step-order" style="text-transform: capitalize !important;">Step 6</span>
                                <div class="icon-circle"></div>
                                <span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Bank Details</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="content">
                    <section class="step active-step" id="step-1">
                        <div class="full step-1-skeleton"></div>
                        <form id="teacherSignupStage1" name="teacherSignupStage1" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage1"></div>
                        </form>
                    </section>
                    <section class="step" id="step-2">
                        <div class="full step-2-skeleton"></div>
                        <form id="teacherSignupStage2" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage2"></div>
                        </form>
                    </section>
                    <section class="step" id="step-3">
                        <div class="full step-3-skeleton"></div>
                        <form id="teacherSignupStage3" name="teacherSignupStage3" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage3"></div>
                        </form>
                    </section>
                    <section class="step" id="step-4">
                        <div class="full step-4-skeleton"></div>
                        <form id="teacherSignupStage4" name="teacherSignupStage4" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage4"></div>
                        </form>
                    </section>
                    <section class="step" id="step-5">
                        <div class="full step-5-skeleton"></div>
                        <form id="teacherSignupStage5" name="teacherSignupStage5" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage5"></div>
                        </form>
                    </section>
                    <section class="step" id="step-6">
                        <div class="full step-6-skeleton"></div>
                        <form id="teacherSignupStage6" name="teacherSignupStage6" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage6"></div>
                        </form>
                    </section>
                </div>
                <div class="actions clearfix">
                    <ul role="menu" aria-label="Pagination">
                        <li class="prev-btn"  style="opacity:0;visibility: hidden;">
                            <a href="javascript:void(0)" class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt" role="menuitem" onclick="moveStep(\'prev\')" >Back</a>
                        </li>
                        <li class="next-btn">
                            <a href="javascript:void(0)"class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt"role="menuitem" onclick="moveStep(\'next\', false)">Next</a>
                        </li>
                        <li class="finish-btn" style="display: none;">
                            <a href="javascript:void(0)"class="primary-bg white-txt-color white-hov-bg primary-hov-border-color primary-hov-txt"role="menuitem" onclick="moveStep(\'finish\');">Submit</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`;
        html+=submitInterviewSlotModalContent();
        html+=inReviewForTeacherDetailsModalContent();
        html+=`<div id="demoVideoWrapper"></div>`;
        html+=submitVerificationModal();
        html+=inReviewForTeacherVerificationModal();
        html+=vedioInstructionModalContent();
    return html;
}

function submitInterviewSlotModalContent(){
    var html=
        `<div id="submitInterviewSlotModal" class="modal modal-design fade" role="dialog">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close secondary-bg white-txt-color" onclick="return closeSubmitSlotModel()">&times;</button>
                        <h4 class="modal-title">Note</h4>
                    </div>
                    <div class="modal-body">
                        <h4>
                            <b>Dear <span id="fullName"></span>,<br>
                                <br>
                                Kindly review your details properly before clicking the submit button as there will be no further changes in your details once the demo has been submitted.<br>
                                <br>
                                Thanks<br>
                                ${schoolSettingsOffice.schoolName}</b>
                        </h4>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn k8-theme-btn secondary-bg white-txt-color" onclick="return submitSignupTeacherReviewAndApproval();">Submit</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function inReviewForTeacherDetailsModalContent(){
    var html=
        `<div id="inReviewForTeacherDetailsModal" class="modal modal-design fade" role="dialog" data-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <h4 class="modal-title">Demo Under Review</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body" style="margin-top: 0 !important">
                            <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">Dear 
                                <span class="text-capitalize" id="teacherFullName">${USER_FULL_NAME}</span>
                                <td></td>,<br>
                                <br> Your demo is <span class="text-primary primary-txt-color">Under
                                    Review</span>. We will get back to you within 1 week.<br>
                                <br> Thanks<br> ${schoolSettingsOffice.schoolName}
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding:0 15px">
                        <button type="button" class="btn k8-theme-btn primary-bg white-txt-color" onclick="logout();">Log out</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function submitVerificationModal(){
    var html=
        `<div id="submitVerificationModal" class="modal modal-design fade" role="dialog">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close secondary-bg white-txt-color" onclick="return closeVerificationModal()">&times;</button>
                        <h4 class="modal-title">Note</h4>
                    </div>
                    <div class="modal-body">
                        <h4>
                            <b>Dear <span>${USER_FULL_NAME}</span>,<br>
                                <br>
                                Please review your documents carefully before submitting, as no changes can be made once your verification documents have been submitted.
                                <br>
                                <br>
                                Thanks<br>
                                ${schoolSettingsOffice.schoolName}</b>
                        </h4>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn k8-theme-btn secondary-bg white-txt-color" onclick="saveVerificationDetails('teacherSignupStage5');">Submit</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function inReviewForTeacherVerificationModal(){
    var html=
        `<div id="inReviewForTeacherVerificationModal" class="modal modal-design fade" role="dialog" data-backdrop="static" data-bs-keyboard="false">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <h4 class="modal-title">Documents Under Verification</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body" style="margin-top: 0 !important">
                            <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">Dear 
                                <span class="text-capitalize" id="teacherFullName">${USER_FULL_NAME}</span>
                                <td></td>,<br>
                                <br>
                                Your verification documents are currently <span class="text-primary primary-txt-color">under review</span>. We will get back to you within 1 week.
                                <br>
                                <br> Thanks<br> ${schoolSettingsOffice.schoolName}
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer" style="padding:0 15px">
                        <button type="button" class="btn k8-theme-btn primary-bg white-txt-color" onclick="logout();">Logout</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function vedioInstructionModalContent(){
    var html=
        `<div class="modal fade modal-design " id="vedioInstruction" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close secondary-bg white-txt-color" data-dismiss="modal"
                            aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">Teachers Demo Video Instructions </h4>
                    </div>
                    <div class="modal-body">
                        <p>
                            <b>To qualify for the next round, you are requested to send us
                                a recorded demo class of 4-7 minutes duration on the topic of
                                your choice from our 
                                <a class="primary-txt-color" href="https://internationalschooling.org/course-catalog/"
                                target="_blank">Course Catalog</a>
                            </b>
                        </p>
                        <p>
                            <b>Following are the general guidelines which can help to make the video:</b>
                        </p>
                        <ul>
                            <li>First and foremost you must find a quiet and well-lit place, free from any kind of distractions.</li>
                            <li>You need to have a stable internet connection.</li>
                            <li>You will need to check whether your computer’s audio and webcam are working fine.</li>
                            <li>You need to dress professionally and have the right posture and body language.</li>
                            <li>The medium of instruction must be in English.</li>
                        </ul>
                        <br>
                        <p>
                            <b>Please remember that you have to make the video with a mindset that you are in front of a student, so you have to first introduce yourself and then proceed with the demo of the particular course you are applying for.</b>
                        </p>
                        <p>Your demo video will be judged on the following criteria by our panel:-</p>
                        <ul>
                            <li>Content Knowledge</li>
                            <li>Voice Modulation</li>
                            <li>Presentation &amp; Confidence</li>
                            <li>Engagement Strategies</li>
                            <li>Technical Efficiency</li>
                        </ul>
                        <p>
                            <b> You are free to be as creative and innovative in your demo video as you like.</b>
                        </p>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function videoInstructionModalContent() {
    var html = `
        <div id="videoInstructionBackdrop" class="video-instruction-backdrop" onclick="closeVideoInstructionModal();"></div>
        <div id="videoInstructionModal" class="video-instruction-modal">
            <div style="background-color:var(--pc); position: relative;padding:8px;">
                <h5 class="mb-0" style="color: white; font-size: 18px; font-weight: 700;">
                    Teachers Demo Video Instructions
                </h5>
                <button onclick="closeVideoInstructionModal();" type="button" data-dismiss="modal" aria-label="Close"
                    style="position: absolute; left: -25px; top: 41px; background-color: white !important; border-radius: 5px 0px 0px 5px; font-size: 26px; border: 0px; color: #4f4f4f;padding: 5px;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div style="background-color: #F1F3F5; height: 100vh; overflow-y: auto;padding: 35px;color:#4f4f4f;">
                <div style="border:1px solid #4f4f4f;border-radius:14px;padding:16px;">
                    <h5><b>1. To qualify for the next round, you are requested to record a demo video of 4-7 minutes duration on the topic of your choice from our 
                    <a class="primary-txt-color" href="https://internationalschooling.org/course-catalog/" target="_blank">Course Catalog</a></b></h5>
                    <h6 style="margin:5px 0px;"><b>Following are the general guidelines which can help to make the video:</b></h6>
                    <ul>
                        <li style="font-size:13px;"><i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>First and foremost you must find a quiet and well-lit place, free from any kind of distractions.</li>
                        <li style="font-size:13px;"><i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>You need to have a stable internet connection.</li>
                        <li style="font-size:13px;"><i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>You will need to check whether your computer’s audio and webcam are working fine.</li>
                        <li style="font-size:13px;"><i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>You need to dress professionally and have the right posture and body language.</li>
                        <li style="font-size:13px;"><i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>The medium of instruction must be English.</li>
                    </ul><br>

                    <h5><b>2. Please remember that you have to record the video with a mindset that you are in front of a student, so you have to first introduce yourself and then proceed with the demo of the particular course you are applying for.</b></p>

                    <h6 style="color:var(--pc);margin:5px 0px;"><b>Your demo video will be reviewed on the following criteria by our panel:</b></h6>
                    <ul>
                        <li style="font-size:13px;">
                            <i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>Content Knowledge 
                            | <i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>Voice Modulation     
                            | <i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>Presentation & Confidence
                            | <i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>Engagement Strategies
                            | <i class="fa fa-check-circle-o" style="margin:2px;color:var(--pc);font-size:20px;" aria-hidden="true"></i>Technical Efficiency
                        </li>
                    </ul>
                    <p style="color:var(--pc);margin:10px 0px;"><b>You are free to be as creative and innovative in your demo video as you like.</b></p>
                    <h5><b>3. You will have ${noOfAttempts} attempts to record your demo video, but only one final recording may be submitted. You can choose which recording to submit for approval.</b></p>
                </div>
                <div id="recordingSection"></div>
                ${/*<h5 id="recordingWaitingText" style="font-weight: bold; color: #FFC008; margin-top: 12px; display: none;"></h5>*/''}
                <div class="d-flex text-center" style="justify-content:space-between; align-items:center;">
                    <button id="recordYourDemoInsideBtn" class="btn btn-primary" style="border-radius: 6px;font-weight: bold; margin-top: 1%; margin-right: auto; margin-left: auto; margin-bottom: 0px;">
                        <i class="fa fa-video-camera" style="margin-right: 4px;background-color: white;border-radius: 50%;color:var(--pc);padding: 5px;" aria-hidden="true"></i>
                        <span>LIVE RECORD YOUR DEMO<span>
                    </button>
                </div>
                <button id="approveDemoBtn" onclick="approvedDemoRecording();" class="btn btn-primary rounded" style="display: none;">Submit</button>
            </div>
        </div>
    `;
    return html;
}

function getTeacherBasicInfoContent(signupTeacher){
    signupTeacher = signupTeacher.details.teacher;
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>
        <input type="hidden" id="userId" value="${USER_ID}" />
        <input type="hidden" id="countryData" value="IN" />
        <input type="hidden" id="countryIsd" value="91" />
        <h3 id="first_step" >Personal Details</h3>
            <div class="form-row">
                <div class="form-holder">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-account"></i> <input id="teacherFirstName"
                                type="text" class="form-control-field" name="teacherFirstName"
                                placeholder="First Name*" value=""
                                onkeydown="return M.isChars(event);"
                                maxlength="40" style="text-transform:capitalize" >
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-account"></i> <input type="text"
                                id="teacherMiddleName" class="form-control-field"
                                name="teacherMiddleName" placeholder="Middle Name"
                                value=""
                                onkeydown="return M.isChars(event);"
                                maxlength="40" style="text-transform:capitalize" >
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-account"></i> <input type="text"
                                id="teacherLastName" class="form-control-field"
                                name="teacherLastName" placeholder="Last Name*"
                                value=""
                                onkeydown="return M.isChars(event);"
                                maxlength="40" style="text-transform:capitalize" >
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <div class="form-group ">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-pin"></i>
                            <select class="select_dropdown" name="countryId" id="countryId" ${SCHOOL_ID==5?'disabled':''}>
                                <option value="">Select Country*</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <div class="form-group divState">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-pin"></i>
                            <select class="select_dropdown" name="stateId" id="stateId">
                                <option value="">Select State/Province*</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <div class="form-group divCity">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-pin"></i>
                            <select class="select_dropdown" name="cityId" id="cityId">
                                <option value="">Select City*</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-account-calendar"></i> <input type="text"
                                class="form-control-field" name="teacherDob" id="teacherDob" readonly onkeydown="return false"
                                placeholder="Date of Birth*"
                                value="">
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-male-female"></i>
                            <select class="select_dropdown" name="teacherGender" id="teacherGender">`;
                                html+=getGenderContent()
                            html+=`</select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-email"></i> <input type="email"
                                id="teacherEmailId" class="form-control-field"
                                name="teacherEmailId" placeholder="Email*"
                                value="" disabled>
                        </div>
                    </div>
                </div>
                <div class="form-holder password">
                    <div class="form-group">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-smartphone-android"></i> 
                            <input type="tel" class="form-control-field" id="phone_no" name="phone_no"
                                placeholder="Phone Number*"
                                value=""  
                                onkeydown="return M.digit(event);"
                                maxlength="20"    
                            >
                        </div>
                    </div>
                </div>
            </div>`;
    return html;
}

function getTeacherProfessionalDetailsContent(stup){
    stup = stup.details.teacherDetails;
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>
        <input type="hidden" id="taughtGradeNames" value="${stup.pastTaughtGradeNames}" />
        <input type="hidden" id="taughtSubjectNames" value="${stup.pasttaughtSubjectNames}" />
        <input type="hidden" id="academicDocument" value="${stup.uploadDocumentAcademicName}" />
        <input type="hidden" id="teacherCV" value="${stup.uploadDocumentCVName}" />
        <input type="hidden" id="experienceDoc" value="${stup.uploadDocumentExperienceName}" />
        <input type="hidden" id="lastSalarySlip" value="${stup.uploadDocumentLastSalarySlip}" />
        <h3 id="second_step">Professional Details</h3>
        <div class="form-row">
            <div class="form-holder">
                <div class="icon-field valid-field">
                    <i class="zmdi zmdi-book"></i>
                    <select class="select_dropdown" id="highestQualificationId" name="highestQualificationId">
                        <option value="">Highest Education Degree *</option>`
                        $.each(getHeighestEducation(), function(index, qualification){
                            html+= `<option value="${index}">${qualification}</option>`;
                        });
                    html+=`</select>
                </div>
            </div>
            <div class="form-holder">
                <div class="icon-field valid-field">
                    <i class="zmdi zmdi-book"></i>
                    <input type="text" class="form-control-field valid" id="teacherSubjectSpecialization" name="teacherSubjectSpecialization" placeholder="Enter Degree Specialization*" onkeydown="return M.isAddressLine(event);" value="${escapeCharacters(stup.teacherSubjectSpecialization)}" maxlength="100" style="text-transform:capitalize" aria-required="true" aria-invalid="false">
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-holder">
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="icon-field valid-field">
                            <i class="zmdi zmdi-calendar"></i>
                            <select id="totalExperianceFromYYYY" name="totalExperianceFromYYYY" class="select_dropdown" name="gender">
                                <option selected value="">Experience In Years*</option>`
                                $.each(getTotalExpYears(), function(index, years){
                                    html+=`<option value="${index}">${years}</option>`
                                })
                            html+=`</select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-holder">
                <div class="icon-field valid-field">
                    <i class="zmdi zmdi-case"></i> <input type="text"
                        class="form-control-field"
                        id="lastOrganizationName"
                        name="lastOrganizationName"
                        placeholder="Last Organization Name*"
                        onkeydown="return M.isAddressLine(event);"
                        value="${escapeCharacters(stup.lastOrganizationName)}"
                        maxlength="100" style="text-transform:capitalize" >
                </div>
            </div>
        </div>

        <div class="form-row">
            <div class="form-holder">
                <div class="icon-field textarea-icon  valid-field">
                    <i class="zmdi zmdi-case"></i>
                    <textarea class="form-control-field" id="lastJobDesc" name="lastJobDesc" placeholder="Why Should We Hire You? (Describe how you stand out from other online teachers highlighting your expertise) *" onkeydown="return M.isAddressLine(event);" rows="2" style="text-transform:initial" maxlength="200">${escapeCharacters(stup.lastJobDesc)}</textarea>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-holder">
                <div class="icon-field">
                    <a href="javascript:void(0)" class="select_grade custom-btn primary-bg white-txt-color"
                        onclick="showGradeList()">Grades you have
                        taught* <i class="zmdi zmdi-edit white-icon pull-right"></i>
                    </a>
                </div>
            </div>
            <div class="form-holder">
                <div class="icon-field">
                    <i class="zmdi zmdi-edit white-icon"></i> <a
                        href="javascript:void(0)" class="select_course custom-btn primary-bg white-txt-color"
                        onclick="showSelectedCourseList();">Courses you have taught* <i
                        class="zmdi zmdi-edit white-icon pull-right"></i></a>
                </div>
            </div>
        </div>
        <div style="border: 2px solid;boder-color:var(--pc); border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px; ">
            <p style="color: red; margin-bottom: 15px">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
            <div class="form-row">
                <div class="form-holder">
                    <label class="full">Highest Degree<sup class="sup">*</sup>
                    </label>
                    <div class="full upload-item-wrapper clone-item">
                        <div class="upload-btn-wrapper mt-1 upload-item">
                            <div class="uploaded-file valid-field valid-check" id="fileupload2Span" >${stup.uploadDocumentAcademicName!=null?stup.uploadDocumentAcademicName:'Upload Highest degree'}</div>
                            <input onchange="uploadDocsFun(this, \'academic\');" class="file-input" type="file" name="fileupload2" id="fileupload2" fileType="2" elem-id="2"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <label class="full">Updated CV <sup class="sup">*</sup></label>
                    <div class="full">
                        <div class="upload-btn-wrapper mt-1">
                            <div class="uploaded-file valid-field valid-check" id="fileupload1Span">${stup.uploadDocumentCVName!=null?stup.uploadDocumentCVName:'Upload CV'}</div>
                            <input onchange="uploadDocsFun(this, \'academic\');" class="file-input" type="file" name="fileupload1" id="fileupload1" fileType="4" elem-id="1"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <label class="full">Proof of last Work-Experience <sup class="sup"></sup></label>
                    <div class="full upload-item-wrapper clone-item">
                        <div class="upload-btn-wrapper mt-1 upload-item">
                            <div class="uploaded-file valid-field valid-check" id="fileupload3Span" >${stup.uploadDocumentExperienceName!=null? stup.uploadDocumentExperienceName:'Upload Proof of last Work-Experience'}</div>
                            <input onchange="uploadDocsFun(this, \'academic\');" class="file-input" type="file" name="fileupload3" id="fileupload3" fileType="3" elem-id="3"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="form-holder">
                    <label class="full">Passport/National ID <sup class="sup">*</sup></label>
                    <div class="full">
                        <div class="upload-btn-wrapper mt-1">
                            <div class="uploaded-file valid-field valid-check" id="fileupload4Span">${stup.uploadDocumentPassport!=null?stup.uploadDocumentPassport:'Upload Passport/National ID'}</div>
                            <input onchange="uploadDocsFun(this, \'academic\');" class="file-input" type="file" name="fileupload4" id="fileupload4" fileType="19" elem-id="4"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-holder">
                    <label class="full">Internet Speed Test Screenshot <sup class="sup">*</sup></label>
                    <div class="full upload-item-wrapper clone-item">
                        <div class="upload-btn-wrapper mt-1 upload-item">
                            <div class="uploaded-file valid-field valid-check" id="fileupload11Span" >${stup.uploadNetSpeedTestSSName!=null?stup.uploadNetSpeedTestSSName:'Upload Internet Speed Test Screenshot*'}</div>
                            <input onchange="uploadDocsFun(this, \'academic\');" class="file-input" type="file" name="fileupload11" id="fileupload11" fileType="75" elem-id="11"> <span
                                class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        if(stup.demoVedioLink != null && stup.demoVedioLink != undefined && stup.demoVedioLink != ""){
            html+=`<div class="form-row">
                <div class="form-holder des-holder">
                    <div class="form-group">
                        <div class="icon-field error-top-0  valid-field">
                            <a class="primary-txt-color" data-toggle="modal" data-target="#vedioInstruction"> <i
                                class="zmdi zmdi-info" data-toggle="tooltip" title=""
                                data-original-title="Demo Video Instructions"></i>
                            </a>
                            <input
                                type="text"
                                onkeydown="return M.isAddressLine(event);"
                                class="form-control-field"
                                id="demoVedioLink"
                                name="demoVedioLink"
                                placeholder="Please provide a link of your demo*"
                                value="${escapeCharacters(stup.demoVedioLink)}"
                            />
                        </div>
                        <span>The link should be publicly accessible e.g. public
                            YouTube, or Google Drive links (Click on the info icon for the
                            instructions).</span>
                    </div>
                </div>
            </div>`
        }else{
            html+=`<div style="margin: 20px auto; display: flex; flex-direction: column;">
                <h3 class="text mb-0">Record Your Demo</h3>
                <div id="approvedDemoRecording"></div>`;
                // entityIds = stup.sessionEntityIdList;
                // if(entityIds.length == 2 && stup.firstMeetingStatus == 'second_joined'){
                //     html+=`<a id="recordYourDemoOutsideBtn" href="javascript:void(0);" class="btn btn-sm btn-primary" style="border-radius: 12px;font-weight: bold; padding: 10px;" onclick="openModalForDemoVideo('teacherSignupStage2');">
                //         <i class="fa fa-video-camera" style="margin-right: 4px;background-color: white;border-radius: 50%;color:var(--pc);padding: 5px;" aria-hidden="true"></i>
                //         <span>Select Recording(s)</span>
                //     <a>`;
                // }else if((entityIds.length == 1 && stup.firstMeetingStatus == 'first_joined') || (entityIds.length == 2 && stup.firstMeetingStatus == '')){
                //     html+=`<a id="recordYourDemoOutsideBtn" href="javascript:void(0);" class="btn btn-sm btn-primary" style="border-radius: 12px;font-weight: bold; padding: 10px;" onclick="openModalForDemoVideo('teacherSignupStage2');">
                //         <i class="fa fa-video-camera" style="margin-right: 4px;background-color: white;border-radius: 50%;color:var(--pc);padding: 5px;" aria-hidden="true"></i>
                //         <span>Record your Demo (2nd Attempt)</span>
                //     <a>`;
                // }else{
                //     html+=`<a id="recordYourDemoOutsideBtn" href="javascript:void(0);" class="btn btn-sm btn-primary" style="border-radius: 12px;font-weight: bold; padding: 10px;" onclick="openModalForDemoVideo('teacherSignupStage2');">
                //         <i class="fa fa-video-camera" style="margin-right: 4px;background-color: white;border-radius: 50%;color:var(--pc);padding: 5px;" aria-hidden="true"></i>
                //         <span>Record your Demo</span>
                //     <a>`;
                // }
                html+=`<a id="recordYourDemoOutsideBtn" href="javascript:void(0);" class="btn btn-sm btn-primary" style="border-radius: 12px;font-weight: bold; padding: 10px; width: fit-content; margin: auto;" onclick="openModalForDemoVideo('teacherSignupStage2');">
                    <i class="fa fa-video-camera" style="margin-right: 4px;background-color: white;border-radius: 50%;color:var(--pc);padding: 5px;" aria-hidden="true"></i>
                    <span>LIVE RECORD YOUR DEMO</span>
                </a>
            </div>`;
        }
        html+=`<div class="form-row">
            <div class="form-holder">
                <div class="custom-checkbox-policy">
                    <input type="checkbox"
                    class="wishSameParent"
                    name="declConfirmation"
                    id="declConfirmation"
                    value="${stup.declConfirmation=='Y'?'Y':'N'}" ${stup.declConfirmation=='Y'?'checked':''}> <span
                    class="undertaking ml-3"> I confirm that the information given in
                    this form is true, complete and accurate. I, hereby, undertake to
                    present the original documents immediately upon demand by the
                    concerned authorities of ${schoolSettingsOffice.schoolName}. I, further declare
                    that my appointment may be canceled, at any stage, if I am found
                    ineligible and/or the information provided by me is found to be
                    incorrect. I, hereby undertake to inform the concerned person, about
                    any changes in information submitted by me, in the Application Form
                    and any other documents, including change in addresses and contact
                    numbers, from time to time.</span>
                </div>
            </div>
        </div>

        <div id="selectedSubjects"></div>`
    return html;
}

function getTeacherReviewAndApprovalContent(){
    var html=
        `<h3>
           Demo Under Review <br>
            <p style="font-size: 14px;">Kindly Review your details</p>
        </h3>
        <div class="form-row">
            <div class="form-holder w-100">
                <div class="full">
                    <ul class="accordion">
                        <li>
                            <div class="basic-information">
                                <div class="full">
                                    <h4 class="a-title ">
                                        Personal Details <i class="fa plus-icon fa-minus"></i>
                                    </h4>
                                </div>
                                <div class="a-content" style="display: none;">
                                    <div class="table-responsive">
                                        <table class="table-style">
                                            <tbody>
                                                <tr>
                                                    <th style="width:50%;">Name:</th>
                                                    <td><span id="editStage2FirstName"></span> <span id="editStage2MiddleName"></span> <span id="editStage2LastName"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Email:</th>
                                                    <td><span id="editStage2Email"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Gender:</th>
                                                    <td><span id="editStage2Gender"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Phone Number:</th>
                                                    <td><span id="editStage2Phoneno"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Date of Birth:</th>
                                                    <td><span id="editStage2Dob"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Country/ State/ City:</th>
                                                    <td><span id="editStage2Country"></span>/ <span id="editStage2State"></span>/ <span id="editStage2City"></span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="edit-btn">
                                        <button class="primary-bg white-txt-color" onclick="setSteps(1)">
                                            Edit <i class="fa fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div class="academic-professional-details">
                                <div class="full">
                                    <h4 class="a-title ">
                                        Professional Details <i class="fa fa-plus plus-icon"></i>
                                    </h4>
                                </div>
                                <div class="a-content overflow-auto">
                                    <div class="table-responsive">
                                        <table class="table-style">
                                            <tbody>
                                                <tr>
                                                    <th style="width:50%;">Highest Education Degree:</th>
                                                    <td><span id="editStage3highestQualificationId"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Degree Specialization:</th>
                                                    <td><span id="editStage3teacherSubjectSpecialization"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Total Online Teaching Experience:</th>
                                                    <td></strong> <span id="edittotalExperianceFromYYYY"></span> Years</td>
                                                </tr>
                                                <tr>
                                                    <th>Last/Current Organization Name:</th>
                                                    <td> <span id="editStage3lastOrganizationName"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Why Should We Hire You?:</th>
                                                    <td><span id="editStage3lastJobDesc"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Grades you have taught:</th>
                                                    <td id="editGradesTaught"></td>
                                                </tr>
                                                <tr>
                                                    <th>Courses you have taught:</th>
                                                    <td id="editCoursesTaught"></td>
                                                </tr>
                                                <tr>
                                                    <th>Supporting Document for Highest Degree</th>
                                                    <td><span id="editStage3teacherSupportingDocumentAcademic"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Supporting Document for Last Work Experience</th>
                                                    <td><span id="editStage3teacherSupportingDocumentExperiance"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Supporting Document for Passport/National ID</th>
                                                    <td><span id="editStage3teacherPassport"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Updated CV:</th>
                                                    <td><span id="editStage3teacherSupportingDocumentCV"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Internet Speed Test Screenshot:</th>
                                                    <td><span id="editStage3teacherInternetSpeedTestSS"></span></td>
                                                </tr>
                                                <tr>
                                                    <th>Demo Video:</th>
                                                    <td><span id="editStage3teacherDemoVedioLink"></span></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="edit-btn">
                                        <button class="primary-bg white-txt-color" onclick="setSteps(2)">
                                            Edit <i class="fa fa-edit"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>`
    return html;
}

function getTeacherVerificationDetailsContent(data){
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>
        <input type="hidden" id="countryData1" value="${data.employeeReference?.[0]?.isoCode || 'US'}">
        <input type="hidden" id="countryIsd1" value="${data.employeeReference?.[0]?.isdCode || '1'}">
        <input type="hidden" id="countryData2" value="${data.employeeReference?.[1]?.isoCode || 'US'}">
        <input type="hidden" id="countryIsd2" value="${data.employeeReference?.[1]?.isdCode || '1'}">
        <h3 style="margin-bottom: 30px !important;">Verification</h3>
        <div>
            <h3 class="text-left">COMPLETE SOCIAL MEDIA DETAILS (BACKGROUND CHECK)</h3>
            <div style="border: #eee 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px; ">
                <p style="color: red; margin-bottom: 15px">You can add links to all your social media profiles. However, adding at least one profile link in mandatory(*).</p>
                <div class="form-row mb-2">
                    <div class="form-holder" style="flex: 1; min-width: 250px;">
                        <div class="form-group">
                            <label for="linkedinProfileUrl" class="mb-2" style="font-size: 16px; font-weight: 600;">
                                LinkedIn Profile URL
                            </label>
                            <input id="linkedinProfileUrl" name="linkedinProfileUrl" type="text" class="form-control-field" placeholder="LinkedIn Profile URL" value="${checkValueValidation(data.teacherVerification.linkedIn, "")}">
                        </div>
                    </div>
                    <div class="form-holder" style="flex: 1; min-width: 250px;">
                        <div class="form-group">
                            <label for="facebookProfileUrl" class="mb-2" style="font-size: 16px; font-weight: 600;">
                                Facebook Profile URL
                            </label>
                            <input id="facebookProfileUrl" name="facebookProfileUrl" type="text" class="form-control-field" placeholder="Facebook Profile URL" value="${checkValueValidation(data.teacherVerification.facebook, "")}">
                        </div>
                    </div>
                    <div class="form-holder" style="flex: 1; min-width: 250px;">
                        <div class="form-group">
                            <label for="instagramProfileUrl" class="mb-2" style="font-size: 16px; font-weight: 600;">
                                Instagram Profile URL
                            </label>
                            <input id="instagramProfileUrl" name="instagramProfileUrl" type="text" class="form-control-field" placeholder="Instagram Profile URL" value="${checkValueValidation(data.teacherVerification.instagram, "")}">
                        </div>
                    </div>
                </div>
                <div class="form-row mt-2">
                    <div class="form-holder" style="width: 500px !important;">
                        <div class="form-group">
                            <label for="twitterProfileUrl" class="mb-2" style="font-size: 16px; font-weight: 600;">
                                X (Twitter) Profile URL
                            </label>
                            <input id="twitterProfileUrl" name="twitterProfileUrl" type="text" class="form-control-field" placeholder="Twitter/X Profile URL" value="${checkValueValidation(data.teacherVerification.twitter, "")}">
                        </div>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-holder">
                        <div class="custom-checkbox-policy" style="align-items: center !important;">
                            <input type="checkbox"
                                class="mb-2"
                                name="socialMediaCheckbox"
                                id="socialMediaCheckbox"
                                value="${data.teacherVerification?.haveSocialMediaAccount == "Y" ? "Y" : "N"}"
                                ${data.teacherVerification?.haveSocialMediaAccount == "Y" ? "checked" : ""}
                            >
                            <label for="socialMediaCheckbox" class="ml-3" style="color:gray;font-size:15px;">I hereby declare that I do not have any active social media accounts.</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h3 class="text-left">RECOMMENDATION LETTER OR ANY REFERENCE</h3>
            <div style="border: #eee 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px; ">
                <p style="color: red; margin-bottom: 15px">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
                <div class="form-row">
                    <div class="form-holder">
                        <label class="full">Recommendation Letter 1<sup class="text-danger">*</sup></label>
                        <div class="full upload-item-wrapper clone-item">
                            <div class="upload-btn-wrapper mt-1 upload-item">
                                <div class="uploaded-file valid-field valid-check" id="fileupload7Span" >${checkValueValidation(data.attachments.recommendationLetter1Name, "Upload Recommendation Letter 1")}</div>
                                <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload7" id="fileupload7" fileType="73" elem-id="7"> <span
                                    class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <label class="full">Recommendation Letter 2<sup class="text-danger">*</sup></label>
                        <div class="full">
                            <div class="upload-btn-wrapper mt-1">
                                <div class="uploaded-file valid-field valid-check" id="fileupload8Span">${checkValueValidation(data.attachments.recommendationLetter2Name, "Upload Recommendation Letter 2")}</div>
                                <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload8" id="fileupload8" fileType="74" elem-id="8"> <span
                                    class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <h6 class="mb-1" style="font-weight: bold;color: gray;">Reference 1<sup class="text-danger">*</sup></h6>
                    <div class="form-row d-flex flex-wrap gap-3">
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference1Name" type="text" class="form-control-field" placeholder="Name" value="${data.employeeReference?.[0]?.name || ''}" onkeydown="return M.isChars(event);" maxlength="50">
                        </div>
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference1Email" type="email" class="form-control-field" placeholder="Email" value="${data.employeeReference?.[0]?.email || ''}" maxlength="50">
                        </div>
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference1Phone" type="tel" class="form-control-field" placeholder="Phone Number" value="${data.employeeReference?.[0]?.number || ''}" maxlength="20">
                        </div>
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference1Designation" type="text" class="form-control-field" placeholder="Designation" value="${data.employeeReference?.[0]?.designation || ''}" maxlength="50">
                        </div>
                    </div>
                    <h6 class="mt-2 mb-1" style="font-weight: bold;color: gray;">Reference 2<sup class="text-danger">*</sup></h6>
                    <div class="form-row d-flex flex-wrap gap-3">
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference2Name" type="text" class="form-control-field" placeholder="Name" value="${data.employeeReference?.[1]?.name || ''}" onkeydown="return M.isChars(event);" maxlength="50">
                        </div>
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference2Email" type="email" class="form-control-field" placeholder="Email" value="${data.employeeReference?.[1]?.email || ''}" maxlength="50">
                        </div>
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference2Phone" type="tel" class="form-control-field" placeholder="Phone Number" value="${data.employeeReference?.[1]?.number || ''}" maxlength="20">
                        </div>
                        <div class="form-holder" style="flex: 1; min-width: 200px;">
                            <input id="reference2Designation" type="text" class="form-control-field" placeholder="Designation" value="${data.employeeReference?.[1]?.designation || ''}" maxlength="50">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h3 class="text-left">POLICE VERIFICATION</h3>
            <div style="border: #eee 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px; color: gray;">
                <p class="mb-2">I, ${USER_FULL_NAME} do hereby declare and undertake that:</p>
                <p class="mb-2">I have undergone a police verification process in my city/town of residence and obtained a valid police clearance certificate.</p>
                <p class="mb-2">The verification confirms that I do not have any criminal record, and I am eligible for employment as per the institution's requirements.</p>
                <p class="mb-2">I take full responsibility for the accuracy of this information and understand that any false declaration may result in disciplinary action, including termination of employment.</p>
                <p class="mb-4">I also undertake to notify the institution immediately in case of any legal proceedings initiated against me in the future.</p>
                <div class="form-row">
                    <div class="form-holder">
                        <div class="custom-checkbox-policy" style="align-items: center !important;">
                            <input type="checkbox"
                                class="mb-2"
                                name="policeVerificationCheck"
                                id="policeVerificationCheck"
                                value="${data.teacherVerification?.policeVerificationAcceptance == "Y" ? "Y" : "N"}"
                                ${data.teacherVerification?.policeVerificationAcceptance == "Y" ? "checked" : ""}
                            >
                            <label for="policeVerificationCheck" class="ml-3" style="color:gray;font-size:15px;">I declare that the above statements are true and correct to the best of my knowledge and belief.</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h3 class="text-left">UPLOAD DOCUMENTS</h3>
            <div style="border: #eee 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px; ">
                <p style="color: red; margin-bottom: 15px">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
                <div class="form-row">
                    <div class="form-holder">
                        <label class="full">Police Verification<sup class="text-danger">*</sup></label>
                        <div class="full upload-item-wrapper clone-item">
                            <div class="upload-btn-wrapper mt-1 upload-item">
                                <div class="uploaded-file valid-field valid-check" id="fileupload9Span" >${checkValueValidation(data.attachments.policeVerificationName, "Upload Police Verification")}</div>
                                <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload9" id="fileupload9" fileType="72" elem-id="9"> <span
                                    class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <label class="full">Last Salary Slip<sup class="text-danger">*</sup></label>
                        <div class="full">
                            <div class="upload-btn-wrapper mt-1">
                                <div class="uploaded-file valid-field valid-check" id="fileupload10Span">${checkValueValidation(data.attachments.previousSalarySlipName, "Upload Last Salary Slip")}</div>
                                <input onchange="uploadDocsFun(this, \'verify\');" class="file-input" type="file" name="fileupload10" id="fileupload10" fileType="41" elem-id="10"> <span
                                    class="upload-btn primary-txt-color"> <i class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function getContractDetailsContent(agreement){
    agreement = agreement.details.teacherAgreementDetails;
    var formattedPublishDateTime = changeDateFormat(new Date(agreement.publishDateTime), "MMM dd, yyyy hh:mm A");
    var datePart = formattedPublishDateTime.substring(0, 12);
    var timePart = formattedPublishDateTime.substring(13);
    var html=
        `<input type="hidden" id="userIdAgreement" value="${agreement.userId}" />
        <input type="hidden" id="agreementLogId" value="${agreement.agreementLogId}" />
        <input type="hidden" id="agreementAcceptanceFrom" value="${agreement.agreementAcceptanceFrom}" />
        <input type="hidden" id="location" value="" />

        <h3>Contract Details</h3>

        <div class="form-row">
            <div class="form-holder paypal-details primary-border-color">
                <div class="contact-detail-header">
                    <div class="">`
                        if(schoolSettingsOffice.schoolType == "WLP"){
                            html+=`<img src="${schoolSettingsTechnical.letterHeadImg}${SCRIPT_VERSION}" width="300px;" />`
                        }else{
                            html+=`<img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" width="300px;" />`
                        }
                    html+=`</div>
                    ${/*<div class="com_add primary-txt-color">
                        <span style="float: right; width: 28%; height: 75px; text-align: right;">
                            ${schoolSettingsOffice.address}
                        </span>
                    </div>*/''}
                </div>
                <div class="text-editor-content" style="min-height: 250px; padding-top: 65px">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div style="width:60%;">
                            <div style="font-weight:bold; margin-bottom:4px;">
                                ${agreement.salutation}${agreement.salutation ? '. ' : ''}${agreement.name},
                            </div>
                            <div style="font-weight:normal;">
                                ${agreement.city}${agreement.city ? ',<br/>' : ''}
                                ${agreement.state}${agreement.state ? ',<br/>' : ''}
                                ${agreement.country}
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
                        ${cleanBase64Images(agreement.content)}
                    </div>
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
                                onchange="handleRecipientSignatureUpload(this, 'rightSignatureBox'); updateFileName(this); handleFileInputCancel('teacherSignupStage4', 'recipientSignatureUpload', 'rightSignatureBox');"
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
                        ${agreement.publishDateTime != "" ? `<p class="m-0"><b>Date:</b> ${formattedPublishDateTime}</p>`:``}
                    </div>
                    <div class="form-row" style="display: flex; flex-direction: column; gap: 3px; margin-top: 10px;">
                        <p class="mb-0" style="font-weight: bold;">Acceptance of Offer</p>
                        <div class="custom-checkbox-policy">
                            <input type="checkbox" class="wishSameParent" id="agreementDeclarationConfirm" name="agreementDeclarationConfirm" ${agreement.firstReset == 22 ? 'checked':''}>
                            <label for="agreementDeclarationConfirm" class="undertaking ml-2" style="color: #000;cursor:pointer;">
                                I hereby confirm that I have read and agree to the Terms. I understand that this agreement is digitally signed and does not require a physical signature.
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function getTeacherBankAccountDetails(){
    var html=
        `<style>
            .valid-check:after{translate: -12px;}
        </style>

        <h3>Account Details</h3>
        <div class="form-row">
            <div class="form-holder bank-details secondary-border-color">
                <div class="full">
                    <h5 class="text-center k8-theme-text text-capitalize secondary-txt-color">
                        <b>BANK DETAILS</b>
                    </h5>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Currency <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field valid-field">
                                <i class="zmdi zmdi-money"></i>
                                <select name="accountCurrency" id="accountCurrency" class="form-control-field form-control secondary-focus-border-color">
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Number <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountNumber" name="accountNumber" type="text"
                                    value="" autocomplete="off"
                                    class="form-control-field form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">IBAN (If Available)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account-calendar"></i>
                                <input id="iban" name="iban" type="text" autocomplete="off"
                                    value=""
                                    class="form-control-field form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Type <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-balance"></i>
                                <select name="accountCategory" id="accountCategory" class="form-control-field form-control secondary-focus-border-color">
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-row m-0">
                    <h6 class="m-0"><b>Account Holder Name</b><span class="fontf-italic">&nbsp;(as per bank record)</span></h6>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">First <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountHolderFirstName" name="accountHolderFirstName" type="text"
                                    value="" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Middle</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountHolderMiddleName" name="accountHolderMiddleName" type="text"
                                    value="" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Last <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i>
                                <input id="accountHolderLastName" name="accountHolderLastName" type="text"
                                    value="" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Account Holder Address<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i> <input 
                                type="text" maxlength="100" 
                                id="accountHolderAddress"  
                                name="accountHolderAddress"
                                style="text-transform:capitalize" 
                                value=""
                                class="form-control-field form-control secondary-focus-border-color"
                                onkeydown="return M.isAddressLine(event);"
                                autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label>Country <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control-field " name="accountHolderCountryId" id="accountHolderCountryId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>State <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control-field " name="accountHolderStateId" id="accountHolderStateId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>City <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control-field " name="accountHolderCityId" id="accountHolderCityId"></select>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Postal Code<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <input id="accountHolderPostal" name="accountHolderPostal" type="text"
                                    autocomplete="off" value=""
                                    class="form-control-field form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Phone No.<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-phone"></i>
                                <input id="accountHolderPhone"  name="accountHolderPhone" value="" 
                                    type="text" autocomplete="off"
                                    style="text-transform:capitalize"
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="return M.digit(event);" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Email-ID<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field valid-field">
                                <i class="zmdi zmdi-email"></i>
                                <input id="accountHolderEmail" value="" 
                                    name="accountHolderEmail" type="text" autocomplete="off"
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Name <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-city-alt"></i> 
                                <input type="text" id="bankName" name="bankName"
                                    value=""
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" style="text-transform:capitalize"
                                    autocomplete="off" maxlength="50">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Branch Name<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-city-alt"></i> <input
                                    class="form-control-field form-control secondary-focus-border-color"
                                    onkeydown="return M.isChars(event);" id="bankBranchName" type="text"
                                    style="text-transform:capitalize" value=""
                                    name="bankBranchName" autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Branch Address<sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i> <input 
                                type="text" maxlength="100" 
                                id="bankBranchAddress"  
                                name="bankBranchAddress"
                                style="text-transform:capitalize"
                                value=""
                                class="form-control-field form-control secondary-focus-border-color"
                                onkeydown="return M.isAddressLine(event);"
                                autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label>Country <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control-field " name="bankCountryId" id="bankCountryId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>State <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control-field " name="bankStateId" id="bankStateId"></select>
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label>City <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <select class="select_dropdown form-control-field " name="bankCityId" id="bankCityId"></select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Postal Code <sup class="sup" title="required">*</sup></label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <input id="bankPostal" name="bankPostal" type="text"
                                    autocomplete="off" value=""
                                    class="form-control-field form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Other Details</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-pin"></i>
                                <input id="otherDetails" name="otherDetails" type="text"
                                    autocomplete="off" value=""
                                    class="form-control-field form-control secondary-focus-border-color">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="form-row m-0">
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank Swift Code (If Applicable)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-code"></i>
                                <input type="text" id="swiftCode" name="swiftCode"
                                    value=""
                                    class="form-control-field form-control secondary-focus-border-color"
                                    maxlength="50" autocomplete="off"
                                    onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">Bank IFSC Code (If Applicable)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-code"></i> 
                                <input type="text" id="bankIfsc" name="bankIfsc"
                                    value=""
                                    class="form-control-field form-control secondary-focus-border-color"
                                    maxlength="50" autocomplete="off"
                                    onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);">
                            </div>
                        </div>
                    </div>
                    <div class="form-holder">
                        <div class="form-group">
                            <label class="secondary-txt-color">IBAN/Routing Number (If Applicable)</label>
                            <div class="icon-field  valid-field">
                                <i class="zmdi zmdi-account"></i> <input
                                    class="form-control-field form-control secondary-focus-border-color"
                                    id="routeNumber" type="text" name="routeNumber"
                                    value="" maxlength="50" tabindex="8"
                                    onkeydown="return M.isAlphaNumericWithNoSpecialCharacter(event);"
                                    autocomplete="off">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        ${/*<div class="form-row">
            <div class="form-holder paypal-details primary-border-color"  style="width:50% !important;margin:auto; background-color:#fffbf5;">
                <p style="color: red; margin-bottom: 15px">NOTE:- Please upload files in following formats (jpg, jpeg, pdf or png) with maximum size of 10 MB</p>
                <div class="form-row">
                    <div class="form-holder">
                        <div class="form-group p-0 m-0">
                            <label class="primary-txt-color">Proof of Address <sup class="sup" title="required">*</sup>
                            </label> <label class="custom-tooltip primary-txt-color"> 
                                <div class="tooltip-content">
                                    <span class="full tooltip-heading"><strong>The
                                            following documents can be used to verify your personal
                                            address:</strong></span>
                                    <ul>
                                        <li><span class="number">1)</span> <span class="content">
                                                Utility bill - gas, electricity, water, internet (we cannot
                                                accept mobile phone bills)</span></li>
                                        <li><span class="number">2)</span> <span class="content">
                                                Bank or credit card statement (a physical letter or a PDF,
                                                not a screenshot)</span></li>
                                        <li><span class="number">3)</span> <span class="content">
                                                Mortgage statement or lease agreement</span></li>
                                        <li><span class="number">4)</span> <span class="content">
                                                Vehicle registration</span></li>
                                        <li><span class="number">5)</span> <span class="content">
                                                Driving Licence with address</span></li>
                                    </ul>
                                </div>
                            </label>
                        </div>
                        <div class="full upload-item-wrapper">
                            <div class="upload-btn-wrapper mt-1 upload-item">
                                <div class="uploaded-file valid-field valid-check" id="fileupload5Span">No file Selected*</div>
                                <input onchange="uploadDocsFun(this, \'bank\')" class="file-input" type="file" name="fileupload5" id="fileupload5" fileType="15" elem-id="5"
                                    onblur="" /> <span class="upload-btn primary-txt-color"> <i
                                        class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>*/''}
        `
    return html;
}

function gradeSelectionModal(data){
    var html=
        `<div class="modal modal-design  fade  " id="select_grade" role="dialog">
            <div class="modal-dialog modal-md modal-style">
                <!-- Modal content-->
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close secondary-bg white-txt-color" data-dismiss="modal"
                            aria-label="Close">&times;</button>
                        <h4 class="modal-title">Grades Taught</h4>
                        
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid relative-select2 primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg p-0">
                            <div class="full relative-wrapper grade_selection_wrapper">
                                <select id="e2_2" name="e2_2" multiple="multiple" style="width: 100%" class="select2-multi-col course-selection-dropdown">`;
                                    html+=getStandardContentByCourseProviderId(SCHOOL_ID);
                                html+=`</select>
                            </div>
                        </div>
                        <div class="modal-footer p-0">
                            <button type="button" class="btn k8-theme-btn-alt pull-left primary-bg white-txt-color"data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn k8-theme-btn secondary-bg white-txt-color" onclick="getSelectedGrades()" >Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function courseSelectionModal(data){
    var html=
    `<div class="modal modal-design fade " id="select_course" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-style">
            <div class="modal-content">
                <div class="modal-header m-0 primary-bg white-txt-color">
                    <button type="button" class="close secondary-bg white-txt-color" data-dismiss="modal"
                        aria-label="Close">&times;</button>
                    <h4 class="modal-title">Courses Taught</h4>
                </div>
                <div class="modal-body">
                    <div class="full selected_course_containter">
                        <div class="full">
                            <h3 class="text-left m-0">Selected Courses</h3>
                        </div>
                        <div class="selected_course_wrapper primary-select2-option-bg">
                            <ul class="elementary_selected_course_list">
                                <li class="gray-border-color light-gray-bg">
                                    <div class="course-category-wrapper">
                                        <ul class="elementary_selected_course">`;
                                            var selectedCourseArray = data.subjectDetails.elementrySelectedSubject.concat(data.subjectDetails.middleSelectedSubject,data.subjectDetails.highSelectedSubject)
                                            $.each(selectedCourseArray, function(i, sub){
                                                html+=
                                                `<li class="select2-selection__choice">
                                                    <span courseId="${sub.replace(/\s+/g, '')}" class="select2-selection__choice__display">${sub}</span>
                                                </li>`;
                                            });
                                        html+=`</ul>
                                    </div>
                                </li> 
                            </ul>
                        </div>
                    </div>
                    <div class="full">
                        <ul class="custom-tab-wrapper">
                            <li class="primary-bg secondary-bg-active active-tab" onclick="selectedCourseCategory()">
                                <a href="javascript:void(0)" id="elementary">Elementary School</a>
                            </li>
                            <li class="primary-bg secondary-bg-active" onclick="selectedCourseCategory()">
                                <a href="javascript:void(0)" id="middle_school">Middle School</a>
                            </li>
                            <li class="primary-bg secondary-bg-active" onclick="selectedCourseCategory()">
                                <a href="javascript:void(0)" id="high_school">High School</a>
                            </li>
                        </ul>
                        <div class="full courses-category-wrapper">
                            <div class="full relative-select2 custom-tab-item primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg" id="elementaryC">
                                <div class="full relative-wrapper course_wrapper">
                                    <div class="course-tabs-format">
                                        <ul class="course-list">
                                            <li class="elementary_course_item secondary-bg-active-tab-anchor white-txt-color  active-tab" courseType="elementary-0">
                                                <div class="course-list-wrapper elementary-0-wrapper" id="elementary_course_list_0C">
                                                    <select multiple="multiple" style="width: 100%" class="select2-multi-col elementary_list elementary-0">`;
                                                        $.each(data.subjectDetails.elementryAllSubject, function(i, status){
                                                            html+=`<option value="${status}">${status}</option>`;
                                                        })
                                                    html+=`</select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="full relative-select2 primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg custom-tab-item" id="middle_schoolC">
                                <div class="full relative-wrapper course_wrapper">
                                    <div class="course-tabs-format">
                                        <ul class="course-list">
                                            <li class="elementary_course_item secondary-bg-active-tab-anchor white-txt-color active-tab" courseType="middle-school-0">
                                                <div class="course-list-wrapper middle-school-0-wrapper" id="middle_course_list_0C">
                                                    <select multiple="multiple" style="width: 100%" class="select2-multi-col middle-eng-art-list middle-school-0">`;
                                                        $.each(data.subjectDetails.middleAllSubject, function(i, status){
                                                            html+=`<option value="${status}">${status}</option>`;
                                                        });
                                                    html+=`</select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="full relative-select2 primary-select2-option-bg white-select2-option-txt secondary-select2-hov-option-bg custom-tab-item" id="high_schoolC">
                                <div class="full relative-wrapper course_wrapper">
                                    <div class="course-tabs-format">
                                        <ul class="course-list">
                                            <li class="elementary_course_item secondary-bg-active-tab-anchor white-txt-color active-tab" courseType="high-school-0">
                                                <div class="course-list-wrapper high-school-0-wrapper" id="high_course_list_0C">
                                                    <select multiple="multiple" style="width: 100%" class="select2-multi-col high-school-eng-list high-school-0">`;
                                                        $.each(data.subjectDetails.highAllSubject, function(i, status){
                                                            html+=`<option value="${status}">${status}</option>`;
                                                        });    
                                                    html+=`</select>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input type="submit" class="btn k8-theme-btn secondary-bg white-txt-color" onclick="getSelectedSubjectes()" value="Apply">
                        <button type="button" class="btn k8-theme-btn-alt pull-left primary-bg white-txt-color" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return html;
}

function step1Skeleton(){
	var html=
	`<h3 class="alternate-txt-color">Personal Details</h3>
	<div class="step1-skeleton">
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
	</div>`;
	return html;
}

function step2Skeleton(){
	var html=
	`<h3 class="alternate-txt-color">Professional Details</h3>
	<div class="step1-skeleton">
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:32px"></div>
			<div class="form-holder skeleton" style="height:32px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:65px"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:42px"></div>
			<div class="form-holder skeleton" style="height:42px"></div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
			<div class="form-holder skeleton" style="height:14px;margin-bottom:15px;"></div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
        <div class="form-row" style="margin-bottom:5px;">
			<div class="form-holder skeleton" style="height:45px;width:200px !important;"></div>
		</div>
        <br/>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
		<div class="form-row" style="margin-bottom:4px;">
            <div class="form-holder skeleton" style="height:14px;"></div>
		</div>
	</div>`;
	return html;
}

function step3Skeleton(){
	var html=
	`<h3 class="alternate-txt-color">
        Demo Under Review
        <br/>
        <p style="font-size: 14px;">Kindly Review your details</p>
    </h3>
	<div class="step1-skeleton">
		<div class="form-row">
			<div class="form-holder skeleton" style="height:37px"></div>
		</div>
		<div class="form-row">
			<div class="table-responsive">
                <table class="table table-bordered" style="margin:0px;">
                    <tbody>
                        <tr>
                            <td class="skeleton" height="38px"></td>
                            <td class="skeleton" height="38px"></td>
                        </tr>
                        <tr>
                            <td class="skeleton" height="38px"></td>
                            <td class="skeleton" height="38px"></td>
                        </tr>
                        <tr>
                            <td class="skeleton" height="38px"></td>
                            <td class="skeleton" height="38px"></td>
                        </tr>
                        <tr>
                            <td class="skeleton" height="38px"></td>
                            <td class="skeleton" height="38px"></td>
                        </tr>
                        <tr>
                            <td class="skeleton" height="38px"></td>
                            <td class="skeleton" height="38px"></td>
                        </tr>
                        <tr>
                            <td class="skeleton" height="38px"></td>
                            <td class="skeleton" height="38px"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:38px;max-width:92px;border-radius:5px;margin-left:auto;"></div>
		</div>
		<div class="form-row">
			<div class="form-holder skeleton" style="height:42px"></div>
		</div>
	</div>`;
	return html;
}

function step4Skeleton(){
	var html=
	`<h3 class="alternate-txt-color">Contract Details</h3>
	<div class="step1-skeleton">
		<div class="form-row">
			<div class="form-holder skeleton" style="height:893px;"></div>
		</div>
	</div>`;
	return html;
}

function step5Skeleton(){
	var html=
	`<h3 class="alternate-txt-color" style="margin-bottom: 30px !important;">Verification</h3>
	<div class="step1-skeleton">
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
			<div class="form-holder skeleton" style="height:14px;margin-bottom:15px;width:50% !important"></div>
            <div class="form-row">
                 <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px;width:33.3% !important;"></div>
            </div>
            <div class="form-holder skeleton" style="height:14px;margin-bottom:15px;width:50% !important"></div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <div class="form-row">
                <div class="form-holder skeleton" style="height:80px;"></div>
            </div>
		</div>
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
                <div class="form-holder skeleton" style="height:32px;width:25% !important;"></div>
            </div>
		</div>
	</div>`;
	return html;
}

function step6Skeleton(){
	var html=
	`<h3 class="alternate-txt-color">Account Details</h3>
	<div class="step1-skeleton">
		<div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
            <h5 class="text-center k8-theme-text text-capitalize secondary-txt-color">
                <b>BANK DETAILS</b>
            </h5>
            <div class="form-row" style="margin-top:10px;">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
        <div style="border: rgb(232, 237, 239) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px;">
			<div class="form-holder skeleton" style="height:14px;margin-bottom:15px;"></div>
            <div class="form-row">
                <div class="form-holder skeleton" style="height:32px"></div>
                <div class="form-holder skeleton" style="height:32px"></div>
            </div>
		</div>
	</div>`;
	return html;
}

function showSkeleton (isShow, skeletonType){
    if(isShow && skeletonType == "step1"){
        $(".step-1-skeleton").html(step1Skeleton()).show();
        $("#teacherSignupStage1").hide();
    }else if(isShow && skeletonType == "step2"){
        $(".step-2-skeleton").html(step2Skeleton()).show();
        $("#teacherSignupStage2").hide();
    }else if(isShow && skeletonType == "step3"){
        $(".step-3-skeleton").html(step3Skeleton()).show();
        $("#teacherSignupStage3").hide();
    }else if(isShow && skeletonType == "step4"){
        $(".step-4-skeleton").html(step4Skeleton()).show();
        $("#teacherSignupStage4").hide();
    }else if(isShow && skeletonType == "step5"){
        $(".step-5-skeleton").html(step5Skeleton()).show();
        $("#teacherSignupStage5").hide();
    }else if(isShow && skeletonType == "step6"){
        $(".step-6-skeleton").html(step6Skeleton()).show();
        $("#teacherSignupStage6").hide();
    }
}


function populateRecordingModalForSignup(recordings, title) {
    const titles = {
        "shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
        "active_speaker.mp4": "Active Speaker",
        "shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
        "gallery_view.mp4": "Gallery View",
        "shared_screen.mp4": "Shared Screen",
        "shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
        "-1.1.mp4": "Recording",
        "-1.2.mp4": "Recording 2",
        "audio_only": "Audio File",
    };

    let modalContent = `
        <div id="recordingModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog" style="max-width:70%; width: 100%;">
                <div class="modal-content">
                    <div style="padding: 15px 10px; background: var(--pc); display: flex; justify-content: space-between; align-items: center;">
                        <h5 style="font-size: 18px; font-weight: bold; color: #FFF; margin-bottom: 0px;">Available Recordings | ${title}</h5>
                        <button onclick="closeAllVideoModal();" type="button" class="text-white btn btn-sm btn-danger" data-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;">&times;</button>
                    </div>
                    <div class="" style="padding: 20px; height: 70vh; overflow-y: auto">`;
                    const filteredRecordings = recordings.filter(urlObj => !urlObj.url.toLowerCase().endsWith('.json'));
    if (filteredRecordings.length > 0) {
        modalContent += `<div class="session-block pb-4">`;
        // const transcriptUrl = recordings[recordings.length - 1]?.url;
        const transcriptUrl = filteredRecordings[filteredRecordings.length - 1].url;
    
        filteredRecordings.forEach((urlObj, index) => {
            let label = "Recording";
            for (const key in titles) {
                if (urlObj.url.includes(key)) {
                    label = titles[key];
                    break;
                }
            }
    
            modalContent += `
                <div class="recording-item d-flex" style="border-bottom:1px solid #eee; justify-content: space-between; align-items: center; padding: 3px 5px 5px;">
                    <h4>${index + 1}. ${label}</h4>
                    <button class="btn btn-sm rounded" style="background-color:var(--pc); border: 1px solid var(--pc);" onclick="playRecordingSignup('${urlObj.url}', '${label}')">Play</button>
                </div>
            `;
        });
    
        if (transcriptUrl) {
            modalContent += `
                <div class="recording-item d-flex" style="border-bottom:1px solid #eee; justify-content: space-between; align-items: center; padding: 3px 5px 5px;">
                    <h4>${recordings.length + 1}. Transcript</h4>
                    <button class="btn btn-sm rounded" style="background-color:var(--pc); border: 1px solid var(--pc);" onclick="showVTTFile('${transcriptUrl}', 'Transcript', true)">Read</button>
                </div>`;
        }
    
        modalContent += `</div>`;
    }

    modalContent += `
                    </div>
                </div>
            </div>
        </div>
    `;

    let modalElement = $("#recordingModal");
    if (modalElement.length > 0) {
        modalElement.remove();
    }

    $("body").append(modalContent);
    $("#recordingModal").modal("show");
}

function showStartMeetingPopupTeacher(meetingName, url) {
    var html=`
        <div class="modal fade" id="start-meeting-popup-teacher" tabindex="-1" role="dialog" aria-labelledby="startMeetingLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header text-white d-flex justify-content-between align-items-center" style="background-color:var(--pc); color:#fff;">
                        <div class="d-flex align-items-center">
                            <i class="fa fa-info-circle mr-2" style="font-size: 24px;"></i>
                            <h5 class="modal-title font-weight-bold">Information</h5>
                        </div>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <h6 class="text-center mb-3">
                            <strong>${meetingName}</strong>
                        </h6>
                        <div class="text-center mb-3">
                            <a href="${url}" target="_blank" class="btn btn-primary font-weight-bold">Start Demo</a>
                        </div>
                        <hr class="my-4 border-top-dashed">
                        <h6 class="text-center mb-2">
                            If you face issues with joining, copy the host link below and paste it into a new tab on your browser:
                        </h6>
                        <p class="copy-msg-1 text-center font-weight-bold mb-2"></p>
                        ${DEPLOYMENT_MODE != "PROD" ?
                            `<textarea readonly class="form-control mb-3">${url}</textarea>`
                            :
                            `<input type="hidden">`
                        }
                        <div class="text-center">
                            <button class="btn btn-success font-weight-bold copy-link-button" data-url="${url}" onclick="copyURL('copyURL1','copy-msg-1')">
                                Copy Link
                            </button>
                        </div>
                        <input type="text" id="copyURL1" value="${url}" style="opacity:0;height:0;">
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function contractExpiredModalContent() {
    return `
    <div id="contractExpiredModal" class="modal modal-design fade" role="dialog"
         data-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-md">
            <div class="modal-content">
                <div class="modal-header primary-bg white-txt-color">
                    <h4 class="modal-title">Contract Expired</h4>
                </div>
                <div class="modal-body">
                    <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">
                        Dear <span class="text-capitalize">${USER_FULL_NAME}</span>,<br><br>
                        Your agreement has <span class="text-danger">expired</span>.
                        Please contact the administration for further assistance.<br><br>
                        Thanks<br>
                        ${schoolSettingsOffice.schoolName}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button"
                            class="btn k8-theme-btn primary-bg white-txt-color"
                            onclick="logout();">
                        Log out
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

function confirmationContractModal(){
    var html=
        `<div id="confirmationContractModal" class="modal modal-design fade" role="dialog">
            <div class="modal-dialog modal-md">
                <div class="modal-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <h4 class="modal-title">Are you sure you want to proceed?</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body" style="margin-top: 0 !important">
                            <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">
                                Please note that once the contract is accepted, you will not be able to go back to the previous step.
                            </p>
                        </div>
                    </div>
                    <div class="modal-footer text-center" style="padding:0 15px">
                        <button type="button" class="btn k8-theme-btn primary-bg white-txt-color" onclick="confirmAcceptContractYes();">Yes</button>
                        <button type="button" class="btn k8-theme-btn" style="background-color: red;" data-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}