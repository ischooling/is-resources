var form;
$(function(){
    var form_validation = $("#formvalidation");
    var back_button = $("[href='#previous']");
    $.validator.addMethod("letterRegex", function(value, element) {
        return this.optional(element) || /^[A-Z-a-z\s]+$/.test(value);
        }, "Field must contain only letters");

    $.validator.addMethod("numberRegex", function(value, element) {
        return this.optional(element) || /^[0-9-]+$/.test(value);
        }, "Field must contain only Numerical and without space");

    $.validator.addMethod("mobileRegex", function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
            return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^(1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
    }, "Please enter a valid phone number");

    $.validator.addMethod("dateFormat", function (value, element) {
        var year = value.split('/');
        if ( value.match(/^\d\d?\/\d\d?\/\d\d\d\d$/) && parseInt(year[2]) <= 2002 &&  parseInt(year[2]) >= 1970 && parseInt(year[1]) <= 12)
            return true;
        else
            return false;

    },"Please enter a date in the format dd/mm/yyyy" );

    form = $("#teacherSignupStage1");
    form.validate({});

    $('.separate-user input').click(function(){
        var checkedValue = $(this).val()
        if($(this).is(":checked") ==  true && checkedValue == "yes"){
            $('.password-field').css({"transform":"scale(1)","opacity":"1","visibility":"visible"})
            $('.password-field2').find('.parent-password').attr('name', 'parentPassword')
            $('.password-field').find('.parent-confirm-password').attr('name', 'parentConfirPassword')
            $('.wish_SameParent').find('.wishSameParent').attr('name', 'wishSameParent')
            $('.confirmation_email').addClass('show');
        }
        else{
            $('.password-field').css({"transform":"scale(0.5)","opacity":"0","visibility":"hidden"})
            $('.password-field').find('.parent-password').attr('name', '')
            $('.password-field').find('.parent-confirm-password').attr('name', '')
            $('.wish_SameParent').find('.wishSameParent').attr('name', '')
            $('.confirmation_email').removeClass('show');
        }
    });

    // Custom Button Jquery Steps
    $('.forward').click(function(){
        $("#formSteps").steps('next');

    })
    $('.backward').click(function(){
        $("#formSteps").steps('previous');
    })
    // Click to see password
    $('.password i').click(function(){
        if ( $('.password input').attr('type') === 'password' ) {
            $(this).next().attr('type', 'text');
        } else {
            $('.password input').attr('type', 'password');
        }
    })
    // Count input
    $(".quantity span").on("click", function() {

        var $button = $(this);
        var oldValue = $button.parent().find("input").val();

        if ($button.hasClass('plus')) {
        var newVal = parseFloat(oldValue) + 1;
        } else {
        // Don't allow decrementing below zero
        if (oldValue > 0) {
            var newVal = parseFloat(oldValue) - 1;
            } else {
            newVal = 0;
        }
        }
        $button.parent().find("input").val(newVal);
    });

    $('.grade_list li').click(function(){
    var slected_grade = $(this).attr('value');
    if(slected_grade > 5){
        $('.course-img-wrapper').hide();
        $('.course-selection-wrapper').show();
    }
    else{
        $('.course-img-wrapper').show();
        $('.course-selection-wrapper').hide();
    }
    });
    $(document).mouseup(function(e){
        var optionContainer = $(".select-option-wrapper");
        if (!optionContainer.is(e.target)){
            optionContainer.removeClass('show');
        }
    });
    $('.select-option-input').keyup(function(){
        var value = $(this).val().toLowerCase();
        $(this).parent().find('.select-option-wrapper li').filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $(".select-option-input").on('click', function(e) {
        $(this).parent().find('.select-option-wrapper li').show()
        $(this).parent().find('.select-option-wrapper').addClass('show').promise().done(function(){
            if ($('.select-option-wrapper').length) {
                var scrollTop = $(window).scrollTop();
                var elm = $(this).parent();
                var dropdownHeight = $(this).parent().find('.select-option-wrapper').height()
                var off = elm.offset();
                var l = off.top;
                var docH = $(window).height();
                var currentElementOffset = l - scrollTop;
                var bottom = docH - currentElementOffset - elm.height();
                if (bottom > dropdownHeight) {
                        $(this).parent().find('.select-option-wrapper').removeClass('edge');
                    } else {
                        $(this).parent().find('.select-option-wrapper').addClass('edge');
                    }
            }
        });
    });
    $(window).scroll(function(){
        var scrollTop = $(window).scrollTop();
        var elm = $('.show').parent();
        if(elm.length){
            var dropdownHeight = $('.show').height()
            var off = elm.offset();
            var l = off.top;
            var docH = $(window).height();
            var currentElementOffset = l - scrollTop;
            var bottom = docH - currentElementOffset - elm.height();
            if (bottom > dropdownHeight) {
                $('.show').removeClass('edge');
            } else {
                $('.show').addClass('edge');
            }
        }
    });
});
 
function closeSubmitSlotModel(){
    $('#submitInterviewSlotModal').modal('hide');
}
function closeVerificationModal(){
    $('#submitVerificationModal').modal('hide');
}
 
function setSteps(step){
    var sectionLength = $(".step").length;
    $("body .content .step:nth-child("+(step)+")").siblings().removeClass("active-step");
    $("body .content .step:nth-child("+(step)+")").addClass("active-step");
    if(step > sectionLength || step < 1){
        console.log("Invalid Step")
    }
    if ( step === 1) {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-personal-details-active.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:0');
        $(".step1, .step2, .step3, .step4, .step5").removeClass("done-step-teacher");
    } else {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-personal-details-active.png');
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-professional-details-deactive.png');
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-application-under-review-deactive.png');
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-verification-deactive.png');
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-deactive.png');
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:0');
        $(".step1, .step2, .step3, .step4, .step5").removeClass("done-step-teacher");
    }
    if ( step === 2) {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-professional-details-active.png');
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-application-under-review-deactive.png');
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-verification-deactive.png');
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-deactive.png');
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $(".step1").addClass("done-step-teacher")
        $(".step2, .step3, .step4, .step5").removeClass("done-step-teacher");
        } else {
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-professional-details-deactive.png');
    }

    if ( step === 3) {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-application-under-review-active.png');
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-verification-deactive.png');
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-deactive.png');
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $(".step1, .step2").addClass("done-step-teacher")
        $(".step3, .step4").removeClass("done-step-teacher");

    } else {
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-application-under-review-deactive.png');
    }
    if ( step === 4) {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-verification-active.png');
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-deactive.png');
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $(".step1, .step2, .step3").addClass("done-step-teacher")
        $(".step4, .step5").removeClass("done-step-teacher");
        $(".prev-btn").hide();
        $(".next-btn").css("margin-left", "auto");
    } else {
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-verification-deactive.png');
    }
    if ( step === 5) {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-active.png');
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:0');
        $(".step1, .step2, .step3, .step4").addClass("done-step-teacher")
        $(".step5").removeClass("done-step-teacher");
        $( ".dropdown-toggle" ).hover(function(event) {
            var offsetTop=$(this).offset().top+$(this).outerHeight()-$(window).scrollTop();
            var offsetBottom=$(window).outerHeight()-$(this).outerHeight()-$(this).offset().top+$(window).scrollTop();
            var ulHeight=$(".tooltip-content").outerHeight();
            if((offsetBottom > ulHeight) && (offsetTop < ulHeight)) {
                    $(this).parent().find(".tooltip-content").css({'top':'100%', 'bottom':'inherit'});
                    $(this).parent().find(".tooltip-content").css({"display":"inline-block"})
                }
                else{
                    $(this).parent().find(".tooltip-content").css({'bottom':'100%', 'top':'inherit'});
                    $(this).parent().find(".tooltip-content").css({"display":"inline-block"})
                }
            },
            function() {
                $(this).parent().find(".tooltip-content").css({"display":"none"})
            });
            $(".next-btn").css("margin-left", "auto");
    } else {
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-deactive.png');
    }
    if ( sectionLength == step) {
        $('.steps ul li:first-child a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(2) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(3) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(4) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(5) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-complete-step.png');
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-active.png');
        $('.actions > ul > li:first-child').attr('style', 'opacity:1');
        $(".step1, .step2, .step3, .step4, .step5").addClass("done-step-teacher");
        $(".next-btn").hide();
        $(".finish-btn").show();
    } else {
        $(".next-btn").show();
        $(".finish-btn").hide();
        $('.steps ul li:nth-child(6) a img').attr('src',PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png');
    }
}

function base64ImageFileAsURL(f, fileType, src, uploadType) {
    var reader = new FileReader();
	var elemId = $(src).attr('elem-id');
    reader.onload = function (e) {
		var binaryData = reader.result.substr(reader.result.indexOf(',') + 1);
		var acceptFileTypes = /^image\/(png|jpe?g)$/i;
		var acceptFileTypesPDF = /^application\/pdf$/i;
		var uploadFlag = true;
		if(f.type.length && (acceptFileTypes.test(f.type) || acceptFileTypesPDF.test(f.type))) {

		}else {
			showMessageTheme2(false, 'Please upload files in following formats (jpg, jpeg, pdf or png).');
			uploadFlag = false;
			return false;
		} if(f.size > 10276044.8){
			showMessageTheme2(false, MAX_SIZE_LIMIT_FOR_TEACHER);
			uploadFlag = false;
			return false;
		}
		if(uploadFlag){
			var obj = {
				"fileName": f.name,
				"fileType": fileType,
				"fileContent": binaryData
			};
            if(uploadType == "academic"){
                academicUploadDocsObj.filter(function(item){
                    if(item.fileType == fileType){
                        var index = getObjectIndex(academicUploadDocsObj, fileType);
                        if(index != -1){
                            academicUploadDocsObj.splice(index, 1);
                        }
                    }
                })
                academicUploadDocsObj.push(obj);
            }
            if(uploadType == "bank"){
                bankUploadDocsObj.filter(function(item){
                    if(item.fileType == fileType){
                        var index = getObjectIndex(bankUploadDocsObj, fileType);
                        if(index != -1){
                            bankUploadDocsObj.splice(index, 1);
                        }
                    }
                })
                bankUploadDocsObj.push(obj);
            }
            if(uploadType == "verify"){
                verifyUploadDocsObj.filter(function(item){
                    if(item.fileType == fileType){
                        var index = getObjectIndex(verifyUploadDocsObj, fileType);
                        if(index != -1){
                            verifyUploadDocsObj.splice(index, 1);
                        }
                    }
                })
                verifyUploadDocsObj.push(obj);
            }
			$("#fileupload" + elemId + "Span").text(f.name);
            validEndInvalidField(true, "fileupload" + elemId + "Span");
		}
    };
    reader.readAsDataURL(f); 
}

function getObjectIndex(obj, value){
	return obj.findIndex(function(item){
		return item.fileType == value;
	})
}

function uploadDocsFun(src, uploadType) {
    var fileType = $(src).attr('fileType');
    var file = src.files[0];
    if (file) {
        base64ImageFileAsURL(file, fileType, src, uploadType);
    }
}

async function moveStep(moveType, isRender){
    var sectionLength = $(".step").length;
    var currentStep = $(".step.active-step").index()+1;
    var signupStage1Form = $('#teacherSignupStage1');
    var signupStage2Form = $('#teacherSignupStage2');
    // var signupStage5Form = $('#teacherSignupStage5');
    // var signupStage6Form = $('#teacherSignupStage6');
    var isBackButtonClicked=false;
    if(getSession()){
        if(moveType == "prev"){
            if(currentStep > 1){
                var prevStep = currentStep-1;
            }else{
                var prevStep = currentStep;
            }
        }else{
            var prevStep = currentStep;
        }
        if(sectionLength == currentStep){
            var nextStep = currentStep;
        }else{
            var nextStep = currentStep+1;
        }
        if(currentStep>nextStep){
            isBackButtonClicked=true;
        }
        if(isReload){
            if(currentStep>nextStep){
                isBackButtonClicked=true;
            }
            if(currentStep==0 && nextStep==3 ){
                isBackButtonClicked=true;
            }
            isReload=false;
        }
        if(moveType == "next"){
            if(nextStep === 1){
                setSteps(1);
                getStage1Data();
            }
            else if(nextStep==2){
                if (signupStage1Form.valid()) {
                    if(!isRender){
                        var serverCheck = await callForSignupTeacherBasicDetailsForm('teacherSignupStage1');
                        if(serverCheck){
                            setSteps(2);
                            return true;
                        } else {
                            return false;
                        }
                    }else{
                        await getStage1Data();
                        if(signupPage < 3){
                            return false;
                        }else{
                            setSteps(2);
                        }
                    }
                }else{
                    return false;
                }
            }
            else if(nextStep==3){
                if(GRADES_TAUGHT.length!==0){
                    if (signupStage2Form.valid()) {
                        if(submitted==true){
                            setSteps(2);
                            return true;
                        }
                        var serverCheck =callForSignupTeacherUpdateProfile('teacherSignupStage2',elementary_subjects,middleSchool_subjects,highSchool_subjects);
                        if(serverCheck){
                            setSteps(3);
                            showSkeleton(true, 'step3');
                            return true;
                        } else {
                            return false;
                        }
                    }
                    else{
                        return false;
                    }
                }else{
                    showMessageTheme2(2, 'Please choose grades taught');
                    return false;
                }
            }
            else if(nextStep==4){
                if(reviewDone==false){
                    $('#submitInterviewSlotModal').modal({backdrop: 'static', keyboard: false});
                    return false;
                }else{
                    setSteps(4);
                    getStage5Data();
                    return true;
                }
            }
            else if(nextStep==5){
                if(reviewDone==false){
                    if(verificationValidationOnSave("teacherSignupStage4")){
                        $('#submitVerificationModal').modal({backdrop: 'static', keyboard: false});
                    }
                    return false;
                }else{
                    setSteps(5);
                    getStage5Data();
                    return true;
                }
            }
            else if(nextStep==6){
                var serverCheck = callForSignupTeacherAgreement('teacherSignupStage5','','','');
                if(serverCheck){
                    setSteps(6);
                    return true;
                } else {
                    return false;
                }
            }
        }
        if(moveType == "next"){
            $("body .content .step:nth-child("+(nextStep)+")").addClass("active-step");
            $("body .content .step:nth-child("+(currentStep)+")").removeClass("active-step");
            
            if(nextStep > 1 ){
                $(".prev-btn").css({"visibility":"visible", "opacity":"1"});    
            }else{
                $(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
            } 
            if(nextStep == sectionLength){
                $(".next-btn").hide();
                $(".finish-btn").show(); 
            }
        }
        else if(moveType == "prev"){
            setSteps(prevStep);
            $("body .content .step:nth-child("+(prevStep)+")").addClass("active-step"); 
            $("body .content .step:nth-child("+(currentStep)+")").removeClass("active-step");
            
            if(prevStep == 1 ){
                $(".prev-btn").css({"visibility":"hidden", "opacity":"0"});
                GRADES_TAUGHT = [];
                $("#e2_2").val(GRADES_TAUGHT).trigger("change");
                SUBJECTS_TAUGHT = [];
                $(".elementary-0").val([]).trigger("change");
                $(".middle-school-0").val([]).trigger("change");
                $(".high-school-0").val([]).trigger("change");
                applySubejctflag = false;
            }else if(prevStep == 3){

            }else{
                $(".prev-btn").css({"visibility":"visible", "opacity":"1"});    
            } 
            if(nextStep == sectionLength){
                $(".next-btn").show();
                $(".finish-btn").hide(); 
                $(".prev-btn").hide(); 
            }
        }
        if(moveType == "finish"){
            var serverCheck= await callForSignupTeacherAccountAndContact('teacherSignupStage6');
            if(serverCheck){
                return true;
            } else {
                return false;
            }
        }
    }else{
        redirectLoginPage();
    }
}

function getFormsValidation(){
    var signupStage1Form = $('#teacherSignupStage1');
    var signupStage2Form = $('#teacherSignupStage2');
    // var signupStage5Form = $('#teacherSignupStage5');
    // var signupStage6Form = $('#teacherSignupStage6');
    signupStage1Form.validate({
        rules: {
            teacherFirstName: {
                required: true,
            },
            teacherMiddleName: {
            },
            teacherLastName: {
                required: true,
            },
            teacherDob:{
                required:true,
            },
            teacherGender:{
                required:true,
            },
            teacherEmailId:{
                required:true,
            },
            phone_no:{
                required:true,
            },

        },
        messages:{
            teacherFirstName:{
                required: "Please enter first name",
            },
            teacherLastName:{
                required: "Please enter last name",
            },
            teacherDob:{
                required:"Please enter date of birth"
            },
            teacherGender:{
                required:"Please select gender"
            },
            teacherEmailId:{
                required:"Please enter email"
            },
            phone_no:{
                required:"Please enter phone number	"
            },
        }
    });

    signupStage2Form.validate({
        rules: {
            highestQualificationId: {
                required: true,
            },
            teacherSubjectSpecialization: {
                required: true,
            },
            totalExperianceFromYYYY: {
                required: true
            },
            totalExperianceFromMM: {
                required: true,
            },
            lastOrganizationName:{
                required:true
            },
            lastJobTitle:{
                required:true,
            },
            lastJobFromYYYY:{
                required:true,
            },
            lastJobFromMM: {
                required: true,
            },
            lastJobToYYYY:{
                required:true,
            },
            lastJobToMM: {
                required: true,
            },
            lastJobDesc:{
                required:true
            },
            declConfirmation:{
                required:true,
            },
            demoVedioLink:{
                required:true,
            },

        },
        messages:{
            highestQualificationId: {
                required: "Please select highest education degree",
            },
            teacherSubjectSpecialization: {
                required: "Enter the degree specialization",
            },
            totalExperianceFromYYYY: {
                required: "Select the experience in years"
            },
            totalExperianceFromMM: {
                required: "Select the experience in months",
            },
            lastOrganizationName:{
                required: "Enter the name of last organisation"
            },
            lastJobTitle:{
                required: "Enter the title of last job.",
            },
            lastJobFromYYYY:{
                required: "Select the Last/Current job year",
            },
            lastJobFromMM: {
                required: "Select the Last/Current job month",
            },
            lastJobToYYYY: {
                required: "Select the last working year",
            },
            lastJobToMM: {
                required: "Select the last working month",
            },
            lastJobDesc:{
                required: "Enter why should we hire you?"
            },
            declConfirmation:{
                required: "Please accept the declaration",
            },
            demoVedioLink:{
                required:"Please provide a link of your demo video",
            },
        }
    });

    // signupStage5Form.validate({
    //     rules: {
    //         accountPersonName: {
    //             required: true,
    //         },
    //         bankName: {
    //             required: true
    //         },
    //         bankBranchName: {
    //             required: true,
    //         },
    //         bankBranchAddress:{
    //             required:true
    //         },
    //         accountNumber:{
    //             required:true,
    //         },
    //         swiftCode: {
    //             required: true,
    //         },
    //         paypalEmailId:{
    //             required:true
    //         },

    //     },
    //     messages:{
    //         accountPersonName: {
    //             required: "Please Enter Account Holder Name",
    //         },
    //         bankName: {
    //             required: "Please Enter Bank Name"
    //         },
    //         bankBranchName: {
    //             required: "Please Enter Bank Branch Name",
    //         },
    //         bankBranchAddress:{
    //             required: "Please Enter Bank Branch Address"
    //         },
    //         accountNumber:{
    //             required: "Please Enter the Account Number/IBAN/CLABE",
    //         },
    //         swiftCode: {
    //             required: "Please Enter Swift Code",
    //         },
    //         paypalEmailId: {
    //             required: "PayPal Email",
    //         },
    //     }
    // });

    // signupStage6Form.validate({
    //     rules: {
    //         agreementDeclarationConfirm: {
    //             required: true,
    //         },
    //     },
    //     messages:{
    //         agreementDeclarationConfirm:{
    //             required: "Please accept the declaration",
    //         },
    //     }
    // });
}

function createStepsImage(){
    // Create Steps Image
    $('.steps ul li:first-child').append('<span class="step-arrow-teacher step1"/>').find('a').append('<span class="step-order" style="text-transform: capitalize !important;">Step 01</span>').append('<img src="'+PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-personal-details-active.png" alt=""> ').append('<span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Personal Details</span>');
    $('.steps ul li:nth-child(2').append('<span class="step-arrow-teacher step2"/>').find('a').append('<span class="step-order" style="text-transform: capitalize !important;">Step 02</span>').append('<img src="'+PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-professional-details-deactive.png" alt="">').append('<span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Professional Details</span>');
    $('.steps ul li:nth-child(3)').append('<span class="step-arrow-teacher step3"/>').find('a').append('<span class="step-order" style="text-transform: capitalize !important;">Step 03</span>').append('<img src="'+PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-application-under-review-deactive.png" alt="">').append('<span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Application Under Review</span>');
    $('.steps ul li:nth-child(4)').append('<span class="step-arrow-teacher step4"/>').find('a').append('<span class="step-order" style="text-transform: capitalize !important;">Step 04</span>').append('<img src="'+PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-verification-deactive.png" alt="">').append('<span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Verification</span>');
    $('.steps ul li:nth-child(5)').append('<span class="step-arrow-teacher step5"/>').find('a').append('<span class="step-order" style="text-transform: capitalize !important;">Step 05</span>').append('<img src="'+PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-contract-details-deactive.png" alt="">').append('<span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Contract Details</span>');
    $('.steps ul li:last-child a').append('<span class="step-order" style="text-transform: capitalize !important;">Step 06</span>').append('<img src="'+PATH_FOLDER_IMAGE2+'/teacher-signup-new/teacher-bank-details-deactive.png" alt="">').append('<span class="step-order" style="text-transform: capitalize !important;font-weight: bold;">Bank Details</span>');
}

function buildDropdownCountry(result, dropdown, emptyMessage) {
    dropdown.html('');
	if (result != '') {
		dropdown.append('<option value>' + emptyMessage + '</option>');
		$.each(result, function (k, v) {
            if (v.extra != null && v.extra1 != null) {
				dropdown.append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="' + v.key + '"> ' + v.value + '</option>');
			} else if (v.extra != null) {
				if (v.extra == 'selected') {
					dropdown.append('<option disabled selected value="' + v.key + '">' + v.value + '</option>');
				} else if (v.extra == 'non-selected') {
					dropdown.append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="' + v.key + '"> ' + v.value + '</option>');
				} else {
					dropdown.append('<option dailCode="'+v.extra1+'" dail-country-code="'+v.extra+'" value="' + v.key + '"> ' + v.value + '</option>');
				}

			} else {
				dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
			}
		});
	} else {
		dropdown.append('<option value="0">' + emptyMessage + '</option>');
	}
}

function showLoader(flag){
    if(flag){
        $("#commonloaderId").show();
    }else{
        $("#commonloaderId").hide();
    }
}

$(document).ajaxStart(function () {
	showLoader(true);
});

$(document).ajaxStop(function () {
	showLoader(false);
});