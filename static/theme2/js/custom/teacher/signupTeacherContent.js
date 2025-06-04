var schoolSettingsTechnical;              
var schoolSettingsLinks;
var schoolSettingsOffice;
async function renderTeacherEnrollmentPage(signupPage, moduleName){
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
    $("body").append(generateTeacherEnrollmentContent(moduleName) + loaderContent());
    createStepsImage();
    getFormsValidation();
    if(signupPage >= 5){
        await getStage5Data();
    }
    if(signupPage==6){
        await getStage6Data();
    }else if(signupPage < 5){
        if(signupPage>=2){
            if(signupPage == 2){
                await getStage2Data();
            }
        }
        if(signupPage>=3){
            if(signupPage == 3){
                await getStage2Data('2');
            }
            await getStage3Data();
        }
        if(signupPage>=4){
            await getStage4Data();
        }
    }
    $('.select-option-wrapper .option').click(function() {
        var selectedValue = $(this).text();
        var selectedId = $(this).attr('value');
        $(this).parent().closest('.select-option-field').find('.select-option-input').val(selectedValue);
        $(this).parent().closest('.select-option-field').find('.select-option-input').attr('selectedValue',selectedId);
    });

    $('[data-toggle="tooltip"]').tooltip().show();
    $('#editStageFirstName').text($("#teacherSignupStage2 #teacherFirstName").val());
    $('#editStageMiddleName').text($('#teacherSignupStage2 #teacherMiddleName').val());
    $('#editStageLastName').text($('#teacherSignupStage2 #teacherLastName').val());
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
        $("#teacherSignupContentStage3 #select_course .close, #teacherSignupContentStage3 #select_course .k8-theme-btn").click(function(){
            $(".modal-backdrop").remove();
        });
    });
}

function generateTeacherEnrollmentContent(moduleName){
    var html=
        `<div class="wrapper-style">
            <a class="tab-and-mobile-logout-btn primary-bg white-txt-color" style="background: #027FFF;" href="${CONTEXT_PATH}${SCHOOL_UUID}/common/logout/${UNIQUEUUID}">
                <i class="zmdi zmdi-power"></i>
                Logout
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
            html+=`</section>
            ${/*<div class="timer" id="stepsMessage">Takes less than 1 minute to complete this step</div>*/''}`;
            // html+=`<div class="fixed-button">
            //     <a class="primary-bg white-txt-color" href="${CONTEXT_PATH}${SCHOOL_UUID}/common/logout/${UNIQUEUUID}">
            //         Logout
            //     </a>
            //     <a class="primary-bg white-txt-color" href="${schoolSettingsLinks.schoolWebsite}/contact-us/" target="_blank">Contact US</a>
            // </div>`;
            if(MAINTENANCEDOWNTIME !=''){
                html+=
                `<div class="full">
                    <marquee id="marqueeDiv" direction="left" style="color: red" width="100%">${MAINTENANCEDOWNTIME}</marquee>
                </div>`;
            }
            html+=
            `<div id="messageDiv" class="server-error-message" style="display: none;">
                <span id="messageDiv1" class="msg error"><i class="fa fa-times"></i> Error Message </span>
            </div>
            <div id="formSteps">
                <div class="steps clearfix">
                    <ul role="tablist">
                        <li role="tab" aria-disabled="false" class="first current" aria-selected="true"><a></a></li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true"><a></a></li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true"><a></a></li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true"><a></a></li>
                        <li role="tab" aria-disabled="false" class="" aria-selected="true"><a></a></li>
                    </ul>
                </div>
                <div class="content">
                    <section class="step active-step" id="step-1">
                        <div class="full step-1-skeleton"></div>
                        <form id="teacherSignupStage2" name="teacherSignupStage2" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage2"></div>
                        </form>
                    </section>
                    <section class="step" id="step-2">
                        <div class="full step-2-skeleton"></div>
                        <form id="teacherSignupStage3" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage3"></div>
                        </form>
                    </section>
                    <section class="step" id="step-3">
                        <div class="full step-3-skeleton"></div>
                        <form id="teacherSignupStage4" name="teacherSignupStage4" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage4"></div>
                        </form>
                    </section>
                    <section class="step" id="step-4">
                        <div class="full step-4-skeleton"></div>
                        <form id="teacherSignupStage5" name="teacherSignupStage5" method="post" autocomplete="off" action="javascript:void(0);" style="display:none;">
                            <div id="teacherSignupContentStage5"></div>
                        </form>
                    </section>
                    <section class="step" id="step-5">
                        <div class="full step-5-skeleton"></div>
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
                        <h4 class="modal-title">Confirmation</h4>
                    </div>
                    <div class="modal-body">
                        <h4>
                            <b>Dear <span id="fullName"></span>,<br>
                                <br>
                                Kindly review your application properly before clicking the submit button as there will be no further changes in your details once the application has been submitted.<br>
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
                        <h4 class="modal-title">Application Under Review</h4>
                    </div>
                    <div class="modal-body">
                        <div class="modal-body" style="margin-top: 0 !important">
                            <p style="font: bold 16px Arial, Helvetica, sans-serif; text-align: justify">Dear 
                                <span class="text-capitalize" id="teacherFullName">${USER_FULL_NAME}</span>
                                <td></td>,<br>
                                <br> Your application is <span class="text-primary primary-txt-color">Under
                                    Review</span>. We will get back to you within 1 week.<br>
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
                            <span aria-hidden="true">×</span>
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

function getTeacherBasicInfoContent(signupTeacher){
    signupTeacher = signupTeacher.details.teacher;
    var html=
        `<input type="hidden" id="userId" value="${USER_ID}" />
        <input type="hidden" id="countryData" value="IN" />
        <input type="hidden" id="countryIsd" value="91" />
        <h3 id="first_step" >Basic Information</h3>
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
                                class="form-control-field" name="teacherDob" id="teacherDob" readonly
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
                                onkeydown="return M.digit(event);">
                        </div>
                    </div>
                </div>
            </div>`
            // <div class="form-row text-center">
            //     <div class="notes">
            //         <p>
            //             <b>Note:</b> Kindly use the English language while providing information. If you do not have an English keyboard, add the input language for:
            //         </p>
            //         <ul>
            //             <li><a class="primary-txt-color primary-border-color" href="https://support.microsoft.com/en-sg/help/4027670/windows-10-add-and-switch-input-and-display-language-preferences" target="_blank">Windows 10</a></li>
            //             <li><a class="primary-txt-color primary-border-color" href="https://support.microsoft.com/en-sg/help/17424/windows-change-keyboard-layout" target="_blank">Windows 7/8.1</a></li>
            //             <li><a class="primary-txt-color primary-border-color" href="https://support.apple.com/en-sg/guide/mac-help/mchlp1406/10.15/mac/10.15" target="_blank">macOS</a></li>
            //         </ul>
            //     </div>
            // </div>`
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
        <h3 id="second_step">Academic & Professional Details</h3>
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
                ${/*<div class="col-lg-4 col-md-3 col-sm-3 col-xs-12" style="padding: 0px;">
                    <label>Are you currently employed elsewhere?</label>
                    <div class="full">
                        <label class="switch">
                            <input
                                id="currentlyWorking" name="currentlyWorking"
                                class="switch-input currently_working" type="checkbox"  onchange="changeOrgNameLabel()"
                                changeUrl="https://internationalschooling.owschools.com/owsoo/login/auth"
                                value="${stup.currentlyWorking=='Y'?'Y':'N'}" ${stup.currentlyWorking=='Y'?'checked':''} />
                            <span class="switch-label primary-bg-checked" data-on="Yes" data-off="No"></span>
                            <span class="switch-handle"></span>
                        </label>
                    </div>
                </div>*/''}
                ${/*<div class="col-lg-8 col-md-3 col-sm-3 col-xs-12" style="padding: 0px;">*/''}
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
                ${/*</div>*/''}
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
        <div style="border: rgb(117, 186, 255) 2px solid; border-radius: 5px; padding-inline: 10px; padding-top: 10px; margin-bottom: 15px; ">
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
        </div>
        <div class="form-row">
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
        </div>
        <div class="form-row">
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
            Review & Approval <br>
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
                                        Basic Information <i class="fa plus-icon fa-minus"></i>
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
                                        Academic & Professional Details <i class="fa fa-plus plus-icon"></i>
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
                                                ${/*<tr>
                                                    <th>Are you currently employed elsewhere?:</th>
                                                    <td></strong> <span id="editStage3currentlyWorkingHere"></span></td>
                                                </tr>*/''}
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

function getContractDetailsContent(agreement){
    agreement = agreement.details.teacherAgreementDetails;
    var html=
        `<input type="hidden" id="userIdAgreement" value="${agreement.userId}" />
        <input type="hidden" id="agreementLogId" value="${agreement.agreementLogId}" />
        <input type="hidden" id="agreementAcceptanceFrom" value="${agreement.agreementAcceptanceFrom}" />

        <h3>Contract Details</h3>

        <div class="form-row or">
            <div class="form-holder paypal-details primary-border-color">
                <div class="contact-detail-header">
                    <div class="com_logo">
                        <img src="${PATH_FOLDER_IMAGE}${schoolSettingsTechnical.letterHeadImg}${SCRIPT_VERSION}" width="300px;" />
                    </div>
                    <div class="com_add primary-txt-color">
                        <span style="float: right; width: 28%; height: 75px; text-align: right;">
                            ${schoolSettingsOffice.address}
                        </span>
                    </div>
                </div>
                <div class="text-editor-content" style="min-height: 250px; padding-top: 65px">
                    <span style="float: left; width: 50%; margin-top: 5px;">
                        <strong>Ref No.:</strong> ${agreement.agreementRefNumber}
                    </span>
                    <span style="float: right; width: 50%; margin-top: 5px; text-align: right;">
                        <strong>Date:</strong> ${agreement.agreementDate}
                    </span>
                    <span style="float: left; width: 100%; margin-top: 20px; font-weight: bold; height: auto;">
                        ${agreement.salutation}${agreement.salutation!=''?'. ':''}${agreement.name},<br />
                    </span>
                    <span style="float: left; width: 100%; margin-top: 0px; font-weight: normal; height: auto;">
                        ${agreement.address1}${agreement.address1!=''?',<br />':''}
                        ${agreement.address2}${agreement.address2!=''?',<br />':''}
                        ${agreement.city}${agreement.city!=''?',<br />':''}
                        ${agreement.state}${agreement.state!=''?',<br />':''}
                        ${agreement.country}${agreement.country!=''?',<br />':''}
                        ${agreement.pincode}
                    </span>
                    <span style="float: left; width: 45%; margin-top: 10px;"></span>
                    <span style="text-align: center; margin-top: 10px;">
                        <strong><u>Sub: Offer Letter</u></strong>
                    </span>
                    <span style="float: left; width: 100%; margin-top: 10px;margin-bottom:10px;">
                        Dear <strong>${agreement.salutation}${agreement.salutation!=''?'. ':''}${agreement.name}</strong>
                    </span>
                    ${agreement.content}
                    <p style="margin-bottom: 40px;">With Best Regards</p>
                
                </div>
                <div class="contact-detail-footer" style="padding-top: 65px">
                    <div class="row">
                        <div class="col-md-12">
                            <img src="${PATH_FOLDER_IMAGE}${schoolSettingsTechnical.teachAgreementSign}${SCRIPT_VERSION}" 
                        alt="Authorized Signature" title="Authorized Signature" style="width: 150px;"/>
                        </div>

                        <div class="col-md-12">
                            <br />
                            <p>${schoolSettingsTechnical.authorizedPersonName}</p> 
                            <p>${schoolSettingsOffice.schoolName}</p>
                            <p>(Authorised Signatory for ${schoolSettingsOffice.schoolName})</p>
                        </div>
                        <div class="col-md-12">
                            <br />
                            <p>
                                <strong>Acceptance of Offer:</strong>
                            </p>
                            <p>I have read the above offer letter and hereby acknowledge my
                                acceptance of the above terms and conditions of employment.</p>
                        </div>
                        <div class="col-md-12">
                            <br />
                            <p>
                                <strong>Place:</strong> ${agreement.schoolCountry}
                            </p>
                            <div class="row">
                                <div class="col-md-6 col-sm-6 col-xs-12">
                                    <p>
                                        <strong>Date:</strong>   ${agreement.agreementDate}
                                    </p>
                                </div>
                                <div class="col-md-6 col-sm-6 col-xs-12 text-right text-xs-left">
                                    <strong>Name:</strong> ${agreement.salutation}${agreement.salutation!=''?'. ':''}${agreement.name}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="custom-checkbox-policy">
                            <br /> <br />
                            <input type="checkbox" class="wishSameParent" id="agreementDeclarationConfirm" name="agreementDeclarationConfirm" ${agreement.firstReset == 22 ? 'checked':''}>
                            <span class="undertaking ml-2" style="color: #000">By
                                clicking (ticking) the box here, I understand the responsibility
                                to abide by all the rules, regulations and the above mentioned
                                policies/points as established by ${schoolSettingsOffice.schoolName}
                            </span>
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
        <div class="form-row">
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
                                ${/*<div class="uploaded-file valid-field valid-check" id="fileupload5Span">${tupDTO.uploadDocumentAddressProof!=null?tupDTO.uploadDocumentAddressProof:'No file Selected*'}</div>*/''}
                                <div class="uploaded-file valid-field valid-check" id="fileupload5Span">No file Selected*</div>
                                <input onchange="uploadDocsFun(this, \'bank\')" class="file-input" type="file" name="fileupload5" id="fileupload5" fileType="15" elem-id="5"
                                    onblur="" /> <span class="upload-btn primary-txt-color"> <i
                                        class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                     ${/*<div class="form-holder ">
                        <div class="form-group p-0 m-0">
                            <label class="primary-txt-color">Passport <supclass="sup">*</sup></label><label class="custom-tooltip primary-txt-color"> 
                                        ${/*<!-- <i class="zmdi zmdi-eye dropdown-toggle"></i> -->
                                <div class="tooltip-content">
                                    <span class="full tooltip-heading"><strong>The
                                            following documents can be used to verify your
                                            identification:</strong></span>
                                    <p>Please confirm your citizenship and if you are holding
                                        any permanent residency. Kindly provide document proof issued
                                        by government authorities demonstrating the citizenship or
                                        lawful permanent residency in the country.</p>
                                    <p>For proof of citizenship, you can provide a copy of your
                                        passport or a valid government-issued national ID.</p>
                                </div>
                            </label>
                        </div>
                        <div class="full upload-item-wrapper">
                            <div class="upload-btn-wrapper mt-1 upload-item">
                                ${/*<div class="uploaded-file valid-field valid-check" id="fileupload6Span">${tupDTO.uploadDocumentIdentityProof!=null?tupDTO.uploadDocumentIdentityProof:'No file Selected*'}</div>
                                <div class="uploaded-file valid-field valid-check" id="fileupload6Span">No file Selected*</div>
                                <input onchange="uploadDocsFun(this, \'bank\')" class="file-input" type="file" name="fileupload6" id="fileupload6" fileType="19" elem-id="6"
                                    onblur="" /> <span class="upload-btn primary-txt-color"> <i
                                        class="fa fa-upload"></i>
                                </span>
                            </div>
                        </div>
                    </div>*/''}
                </div>
            </div>
        </div>`
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
                                    // if(allSchoolgradeList != undefined){
                                    //     $.each(allSchoolgradeList, function(i, grade){
                                    //         html+=`<option value="${grade.key}">${grade.value}</option>`;
                                    //     }); 
                                    // }
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
	`<h3 class="alternate-txt-color">Basic Information</h3>
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
		${/*<div class="form-row">
			<div class="form-holder skeleton" style="height:14px"></div>
		</div>
		<div class="form-row" style="justify-content:center;">
			<div class="form-holder skeleton" style="max-width:97px;height:14px"></div>
			<div class="form-holder skeleton" style="max-width:97px;height:14px"></div>
			<div class="form-holder skeleton" style="max-width:97px;height:14px"></div>
		</div>*/''}
	</div>`;
	return html;
}

function step2Skeleton(){
	var html=
	`<h3 class="alternate-txt-color">Academic & Professional Details</h3>
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
			<div class="form-holder skeleton" style="height:32px;"></div>
		</div>
        <div class="form-row">
            <div class="form-holder skeleton" style="height:14px;"></div>
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
        Review & Approval
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

// function showSkeleton(stepNum){
// 	if(stepNum == 1){
// 		$("#step-1").html(step1Skeleton());
// 	}else if(stepNum == 2){
// 		$("#step-2").html(step2Skeleton());
// 	}else if(stepNum == 3){
// 		$("#step-3").html(step3Skeleton());
// 	}else if(stepNum == 4){
// 		$("#step-4").html(step4Skeleton());
// 	}else if(stepNum == 5){
// 		$("#step-5").html(step5Skeleton());
//     }
// }

function showSkeleton (isShow, skeletonType){
    if(isShow && skeletonType == "step1"){
        $(".step-1-skeleton").html(step1Skeleton()).show();
        $("#teacherSignupStage2").hide();
    }else if(isShow && skeletonType == "step2"){
        $(".step-2-skeleton").html(step2Skeleton()).show();
        $("#teacherSignupStage3").hide();
    }else if(isShow && skeletonType == "step3"){
        $(".step-3-skeleton").html(step3Skeleton()).show();
        $("#teacherSignupStage4").hide();
    }else if(isShow && skeletonType == "step4"){
        $(".step-4-skeleton").html(step4Skeleton()).show();
        $("#teacherSignupStage5").hide();
    }else if(isShow && skeletonType == "step5"){
        $(".step-5-skeleton").html(step5Skeleton()).show();
        $("#teacherSignupStage6").hide();
    }
}

function loaderContent(){
    var html=`
        <div id="commonloaderId" class="unique-loader loader-bg" style="display:none;">`
        if(SCHOOL_ID==1){
            html+=`<img src="${PATH_FOLDER_IMAGE2}loader-new.gif" alt="${SCHOOL_NAME} Loader" class="new-loader-2024" />`;
        }else{
            html+=
            `<div id="commonloaderBody" class="loader" style="display:none">
            Please Wait... <span></span>
            </div>`
        } 
        html+=`</div>`;
    return html;
}