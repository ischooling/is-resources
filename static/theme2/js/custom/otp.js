$(document).ready(function() {
	//entityType==REQUEST-DEMO
	//entityType==STUDENT-SIGNUP
	//entityType==TEACHER-SIGNUP
//	$("#sendOTP").click(function(event) {
//		event.preventDefault();
//		callForOTP('userSignupForm',moduleId, 1, 'S', 'REQUEST-DEMO','0');
//	});

//	$("#resendOTP").click(function(event) {
//		event.preventDefault();
//		callForOTP('userSignupForm',moduleId, 2, 'S', 'REQUEST-DEMO','0');
//	});

//	$("#verifyOTP").click(function(event) {
//		event.preventDefault();
//		callForOTP('userSignupForm',moduleId, 3, 'S', 'REQUEST-DEMO','0');
//	});

});

//otpType = 1 = SEND-OTP
//otpType = 2 = RESEND-OTP
//otpType = 3 = VERIFY-OTP

function callForOTP(formId, moduleId, otpType, messageChannel, entityType, entityId, via) {

	if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
		hideMessage('');
		hideMessageRequestDemoPage('serverError','');
	}else if(entityType=='SCHOLARSHIP-PROGRAM'){
		hideMessageScholarship('serverError');
	}else if(entityType=='REQUEST-DEMO'){
		hideMessage('');
		hideMessageRequestDemoPage('serverError','userphone');
	}

	if(!validateRequestForOTP(formId, moduleId, otpType, messageChannel, entityType, entityId, via)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('otp-process'),
		data : JSON.stringify(getRequestForOTP(formId, moduleId, otpType, messageChannel, entityType, entityId, via)),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
					showMessageRequestDemoPage(false, data['message'], 'serverError','');
				}else if(entityType=='SCHOLARSHIP-PROGRAM'){
					showMessageScholarship(0, data['message'], 'serverError');
				}else if(entityType=='REQUEST-DEMO'){
					$('#otpMessage').addClass('danger').html(data['message']);
					$('.send-otp-message').addClass('show-otp-message');
					$('.confirm-meeting-form').addClass('otp-overlay');
					setTimeout(function(){
						$('.send-otp-message').removeClass('show-otp-message');
						$('.confirm-meeting-form').removeClass('otp-overlay');
					}, 4000);
					showMessage(false, data['message']);
					showMessageRequestDemoPage(false, data['message'],'otpCodeError','otpCode');
				}else if(entityType=='EVALUATION-FORM'){
					showMessageRequestDemoPageWithTimeout(true, data['message'],'otpModelMesg','');
				}else if(entityType=='B2B-REQUEST'){
					let otpfieldId =  "";
					if(via == 'E'){
						otpfieldId = "otpCodeEmail";
						if(otpType == 1){
							showMessageRequestDemoPage(false, data['message'], 'emailError', 'email');
						}else if(otpType == 2 || otpType == 3){
							showMessageRequestDemoPage(false, data['message'], 'otpCodeEmailError', 'otpCodeEmail');
						}
					}else if(via == 'N'){
						otpfieldId = "userphone";
						if(otpType == 1){
							showMessageRequestDemoPage(false, data['message'], 'isdCodeMobileNoError', 'userphone');
						}else if(otpType == 2 || otpType == 3){
							showMessageRequestDemoPage(false, data['message'], 'otpCodePhoneNumberError', 'userphone');
						}
					}else{
						otpfieldId = "otpCodeNumber";
						if(otpType == 1){
							showMessageRequestDemoPage(false, data['message'], 'wtspNumberNoError', 'wtspNumber');
						}else if(otpType == 2 || otpType == 3){
							showMessageRequestDemoPage(false, data['message'], 'otpCodeNumberError', 'otpCodeNumber');
						}
					}
					$('#otpMessage').addClass('danger').html(data['message']);
					$('.send-otp-message').addClass('show-otp-message');
					$('.confirm-meeting-form').addClass('otp-overlay');
					setTimeout(function(){
						$('.send-otp-message').removeClass('show-otp-message');
						$('.confirm-meeting-form').removeClass('otp-overlay');
					}, 4000);
					showMessage(false, data['message']);
					showMessageRequestDemoPage(false, data['message'],'otpCodeError',otpfieldId);
				}
				return false;
			}
			if(otpType==1){
				if(data['statusCode']=='OTP009'){
					if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
						$('.otp-field-wrapper').slideDown();
						$('#userphone').prop('disabled', true);
						$('#sendOtp').hide()
						$('#changeNumber').show()
						showMessage(false, data['message']);
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}else if(entityType=='SCHOLARSHIP-PROGRAM'){
						$('#sendOtp').hide()
						$('#changeNumber').show()
						showMessageScholarship(1, data['message'], 'serverError');
						$('#verifyOTP').attr('disabled',false)
						$('#userphone').attr('disabled',true)
						$('#otpCode').val('')
						$('#otp-div').show();
						$('#otp-div-btn').show();
					}else if(entityType=='REQUEST-DEMO'){
						
						var PhoneNumLength = $("#"+formId+" #userphone").val().length;
						var PhoneNumber = $("#"+formId+" #userphone").val();
						var isdcode = $("#"+formId+" #isdCodeMobileNo").val()
						if(PhoneNumLength > 9 && PhoneNumLength < 11 ){
							$('.otp-field-wrapper').css("display","block");
							$('.otp-message').css("display","none");
							$('.send-otp').addClass('hide-btn');
							$('.change-number').removeClass('hide-btn');
							$('#userphone').attr('disabled', true);
							$('#otpMessage').html('An OTP has been sent to <b>'+isdcode+'-' + PhoneNumber+'</b>');
							$('.send-otp-message').addClass('show-otp-message');
							$('.confirm-meeting-form').addClass('otp-overlay');
							setTimeout(function(){
								$('.send-otp-message').removeClass('show-otp-message');
								$('.confirm-meeting-form').removeClass('otp-overlay');
							}, 4000);
						}
					}else if(entityType=='EVALUATION-FORM'){
						var PhoneNumber = $("#"+formId+" #userphone").val();
						$('#userNoForOtp').html("We've sent a verification code to your registered number "+PhoneNumber);
						var counter = 15;
						var interval = setInterval(function() {
						    // Display 'counter' wherever you want to display it.
						    if (counter <= 0) {
						     		clearInterval(interval);
						      	/* $('#timer').html("<h4><b>Count down complete</b></h4>");  */
						      	$('#OTP_MODAL .modal-body').find('.disable-otp-item').removeClass('disable-otp-item')
						      	$('#time').text("");
						      	$('#timer').hide()
						        return;
						    }else{
						    	$('#time').text(counter+" Sec.");
						      //console.log("Timer --> " + counter);
						    }
						    counter--;
						}, 1000);
						$("#OTP_MODAL").modal({backdrop: 'static',keyboard: false});
					}else if(entityType=='B2B-REQUEST'){
						if(via=="E"){
							let email = $("#email").val();
							$('.otp-process-wrapper.via_email_otp .otp-field-wrapper').css("display","block");
							$('.send-otp-to-mail').addClass('hide-btn');
							$('.change-number').removeClass('hide-btn');
							$('#email').attr('disabled', true);
							showMessageRequestDemoPage(true, 'An OTP has been sent to ' + email, 'otpCodeEmailError', 'otpCodeEmail');
						}else if(via=="N"){
							var PhoneNumLength = $("#"+formId+" #userphone").val().length;
							var PhoneNumber = $("#"+formId+" #userphone").val();
							var isdcode = $("#"+formId+" #isdCodeMobileNo").val()
							if(PhoneNumLength > 5 && PhoneNumLength < 11 ){
								$('.otp-process-wrapper.via_phone_otp .otp-field-wrapper').css("display","block");
								showMessageRequestDemoPage(true, 'An OTP has been sent to +'+isdcode+' ' + PhoneNumber, 'otpCodePhoneNumberError', 'otpCodePhoneNumber');
								$('.otp-message').css("display","none");
								$('.send-otp-to-phone').addClass('hide-btn');
								$('.change-number').removeClass('hide-btn');
								$('#userphone').attr('disabled', true);
								//$('#otpMessage').html('An OTP has been sent to <b>'+isdcode+'-' + PhoneNumber+'</b>');
								$('.send-otp-message').addClass('show-otp-message');
								$('.confirm-meeting-form').addClass('otp-overlay');
								setTimeout(function(){
									$('.send-otp-message').removeClass('show-otp-message');
									$('.confirm-meeting-form').removeClass('otp-overlay');
								}, 4000);
							}
						}else{
							var PhoneNumLength = $("#"+formId+" #wtspNumber").val().length;
							var PhoneNumber = $("#"+formId+" #wtspNumber").val();
							var isdcode = $("#"+formId+" #isdCodeWtspStudent").val()
							if(PhoneNumLength > 5 && PhoneNumLength < 11 ){
								$('.otp-process-wrapper.via_mobile_otp .otp-field-wrapper').css("display","block");
								showMessageRequestDemoPage(true, 'An OTP has been sent to +'+isdcode+' ' + PhoneNumber, 'otpCodeNumberError', 'otpCodeNumber');
								// showMessageRequestDemoPage(false, data['message'], 'otpCodeNumberError', 'otpCodeNumber');
								$('.otp-message').css("display","none");
								$('.send-otp').addClass('hide-btn');
								$('.change-number').removeClass('hide-btn');
								$('#wtspNumber').attr('disabled', true);
								// $('#otpMessage').html('An OTP has been sent to <b>'+isdcode+'-' + PhoneNumber+'</b>');
								$('.send-otp-message').addClass('show-otp-message');
								$('.confirm-meeting-form').addClass('otp-overlay');
								setTimeout(function(){
									$('.send-otp-message').removeClass('show-otp-message');
									$('.confirm-meeting-form').removeClass('otp-overlay');
								}, 4000);
							}
						}
				}
				}else if(data['statusCode']=='OTP012'){
					if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}else if(entityType=='SCHOLARSHIP-PROGRAM'){
						showMessageScholarship(0, data['message'], 'serverError');
					}else if(entityType=='REQUEST-DEMO'){
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}else if(entityType=='EVALUATION-FORM'){
						showMessageRequestDemoPageWithTimeout(true, data['message'],'evaluationFieldError','');
					}
					return false;
				}else{
					if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
						$('.otp-field-wrapper').slideDown();
						$('#mobileNumber').prop('disabled', true);
						$('#sendOTP').hide()
						$('#changeNumber').show()
					}else if(entityType=='SCHOLARSHIP-PROGRAM'){
						$('#mobileNumber').prop('disabled', true);
						$('#sendOTP').hide()
						$('#changeNumber').show()
					}else if(entityType=='REQUEST-DEMO'){
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}else if(entityType=='EVALUATION-FORM'){
						showMessageRequestDemoPageWithTimeout(true, data['message'],'evaluationFieldError','');
					}else if(entityType=='B2B-REQUEST'){
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}
				}
			}else if(otpType==2){
				if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
					$('.otp-field-wrapper').slideDown();
					$('#userphone').prop('disabled', true);
					$('#sendOTP').hide()
					$('#changeNumber').show()
					showMessage(false, data['message']);
					showMessageRequestDemoPage(false, data['message'], 'serverError','');
				}else if(entityType=='SCHOLARSHIP-PROGRAM'){
					$('#userphone').prop('disabled', true);
					$('#sendOTP').hide()
					$('#changeNumber').show()
					$('#otpCode').val('')
					showMessageScholarship(1, data['message'], 'serverError');
				}else if(entityType=='REQUEST-DEMO'){
					if(data['statusCode']=='OTP006'){
						var PhoneNumber = $('#userphone').val()
						var isdcode = $("#isdCodeMobileNo").val()
						$('#otpMessage').html('An OTP has been sent to <b>'+isdcode+'' + PhoneNumber+'</b>');
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
					}else{
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}
				}else if(entityType=='EVALUATION-FORM'){
					if(data['statusCode']=='OTP006'){
						var PhoneNumber = $("#"+formId+" #userphone").val();
						$('#userNoForOtp').html("We've resent a verification code to your registered number "+PhoneNumber);
						$('#OTP_MODAL .modal-body').find('#resendOTP').addClass('disable-otp-item')
						$('#OTP_MODAL .modal-body').find('#editMobileNo').addClass('disable-otp-item')

						var counter = 15;
						var interval = setInterval(function() {

						    // Display 'counter' wherever you want to display it.
						    if (counter <= 0) {
						     		clearInterval(interval);
						      	/* $('#timer').html("<h4><b>Count down complete</b></h4>");  */
						      	$('#OTP_MODAL .modal-body').find('.disable-otp-item').removeClass('disable-otp-item')
						      	$('#time').text("");
						      	$('#timer').hide()
						        return;
						    }else{
						    	$('#timer').show()
						    	$('#time').text(counter+" Sec.");
						      //console.log("Timer --> " + counter);
						    }
						    counter--;
						}, 1000);
					}
				}else if(entityType=='B2B-REQUEST'){
					if(data['statusCode']=='OTP006'){
						if(via == "E"){
							let email = $("#email").val();
							
							$('#otpMessage').html('An OTP has been sent to '+ email);
							$('.send-otp-message').addClass('show-otp-message');
							$('.confirm-meeting-form').addClass('otp-overlay');
							setTimeout(function(){
								$('.send-otp-message').removeClass('show-otp-message');
								$('.confirm-meeting-form').removeClass('otp-overlay');
							}, 4000);
						}else if(via == "N"){
							var PhoneNumber = $('#userphone').val()
							var isdcode = $("#isdCodeMobileNo").val()
							showMessageRequestDemoPage(true, 'Verification OTP sent to +'+isdcode+' '+PhoneNumber, 'otpCodePhoneNumberError', 'otpCodePhoneNumber');
							// showMessageRequestDemoPage(false, 'An OTP has been sent to '+isdcode+'' + PhoneNumber, 'otpCodePhoneNumberError', 'otpCodePhoneNumber');
							$('#otpMessage').html('An OTP has been sent to <b>'+isdcode+'' + PhoneNumber+'</b>');
							$('.send-otp-message').addClass('show-otp-message');
							$('.confirm-meeting-form').addClass('otp-overlay');
							setTimeout(function(){
								$('.send-otp-message').removeClass('show-otp-message');
								$('.confirm-meeting-form').removeClass('otp-overlay');
							}, 4000);
						}else{
							var PhoneNumber = $('#wtspNumber').val()
							var isdcode = $("#isdCodeMobileNo").val()
							// showMessageRequestDemoPage(false, data['message'], 'otpCodeNumberError', 'otpCodeNumber');
							
							showMessageRequestDemoPage(true, 'Verification OTP sent to +'+isdcode+' '+PhoneNumber, 'otpCodeNumberError', 'otpCodeNumber');
							// showMessageRequestDemoPage(false, 'An OTP has been sent to '+isdcode+'' + PhoneNumber, 'otpCodeNumberError', 'otpCodeNumber');
							$('.send-otp-message').addClass('show-otp-message');
							$('.confirm-meeting-form').addClass('otp-overlay');
							setTimeout(function(){
								$('.send-otp-message').removeClass('show-otp-message');
								$('.confirm-meeting-form').removeClass('otp-overlay');
							}, 4000);
						}
					}else{
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						// showMessageRequestDemoPage(false, data['message'], 'serverError','');
					}
					if(via=="N"){
						showMessageRequestDemoPage(true, data['message'], 'otpCodeNumberError', 'otpCodeNumber');
					}else{
						showMessageRequestDemoPage(true, data['message'], 'otpCodeEmailError', 'otpCodeEmail');
					}
				}
			}else if(otpType==3){
				if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
					if (data['statusCode'] == 'MIDPAGE001') {
						url = CONTEXT_PATH +SCHOOL_UUID+ "/student/enrollment/process";
						goAhead(url, '');
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
						return false;
					}else if(data['statusCode']=='TECMID001'){
						url = CONTEXT_PATH+SCHOOL_UUID+"/teacher/signup/process";
						showMessageRequestDemoPage(false, data['message'], 'serverError','');
						goAhead(url, '');
						return false;
					}else {
						$('#heading-id').addClass('hide')
						$('.fixed-height-desktop').removeClass('hide-step');
						$('.opt-step').addClass('hide')
						showMessageRequestDemoPage(true, data['message'], 'serverError', '');
					}

				}else if(entityType=='SCHOLARSHIP-PROGRAM'){
					showMessageScholarship(1, 'Phone number verified successfully', 'serverError');
					$('#userphone').attr('disabled',false)
					$('#changeNumber').hide();
					$('#sendOTP').show();
					$('#verifyOTP').attr('disabled',true)
					$('#otp-div').hide();
					$('#otp-div-btn').hide();
					$('#rzp-button1').trigger('click');
				}else if(entityType=='REQUEST-DEMO'){
					if(data['statusCode']=='OTP009'){
						$('.change-number').addClass('hide-btn');
						$('.otp-field-wrapper').css("display","none");
						$('#userphone').attr('disabled', true);
						$('#sendOtp').addClass('hide');
						$('#verifiedNumber').removeClass('hide')
						$('#otpMessage').addClass('verified').html('Your mobile number is verified');
						$(".verified-number-icon").show();
						$('.send-otp-message').addClass('show-otp-message');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
							$(".send-otp-message-wrapper").hide()
						}, 4000);
						$('#otpVerifiedstatus').val('true');
						// validateRequestForActiveConfirm(formId, moduleId);
					}else{
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						showMessageRequestDemoPage(false, data['message'],'otpCodeError','otpCode');
					}
				}else if(entityType=='EVALUATION-FORM'){
					if(data['statusCode']=='OTP009'){
						$("#OTP_MODAL").modal('toggle');
						$('#otpVerifiedstatus').val('true');
						$('#userphone').attr('disabled', true);
						callForEvaluationForm(formId, moduleId);
					}else{
						showMessageRequestDemoPageWithTimeout(true, data['message'],'otpModelMesg','');
					}
				}else if(entityType=='B2B-REQUEST'){
					if(data['statusCode']=='OTP009'){
						if(via == "E"){
							$('.change-number').addClass('hide-btn');
							$('.otp-field-wrapper').css("display","none");
							$('#email').attr('disabled', true);
							$('#sendOtp').addClass('hide');
							$('#verifiedEmail').removeClass('hide');
							//$('#otpMessage').addClass('verified').html('Your mobile number is verified');
						}else if(via == "N"){
							$('.change-number').addClass('hide-btn');
							$('.otp-field-wrapper').css("display","none");
							$('#userphone').attr('disabled', true);
							$('#sendOtp').addClass('hide');
							$('#verifiedPhoneNumber').removeClass('hide');
							//$('#otpMessage').addClass('verified').html('Your mobile number is verified');
						}
						else{
							$('.change-number').addClass('hide-btn');
							$('.otp-field-wrapper').css("display","none");
							$('#wtspNumber').attr('disabled', true);
							$('#sendOtp').addClass('hide');
							$('#verifiedNumber').removeClass('hide');
							//$('#otpMessage').addClass('verified').html('Your mobile number is verified');
						}
						$("#isOtpVerifed").val('Y');
						$(".verified-number-icon").show();
						$('.send-otp-message').addClass('show-otp-message');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
							$(".send-otp-message-wrapper").hide()
						}, 4000);
						$('#otpVerifiedstatus').val('true');
						// validateRequestForActiveConfirm(formId, moduleId);
					}else{
						$("#isOtpVerifed").val('N');
						$('#otpMessage').addClass('danger').html(data['message']);
						$('.send-otp-message').addClass('show-otp-message');
						$('.confirm-meeting-form').addClass('otp-overlay');
						setTimeout(function(){
							$('.send-otp-message').removeClass('show-otp-message');
							$('.confirm-meeting-form').removeClass('otp-overlay');
						}, 4000);
						showMessage(false, data['message']);
						// showMessageRequestDemoPage(false, data['message'],'otpCodeError','otpCode');
					}
					if(via="N"){
						showMessageRequestDemoPage(false, data['message'], 'otpCodeNumberError', 'otpCodeNumber');
					}else{
						showMessageRequestDemoPage(false, data['message'], 'otpCodeEmailError', 'otpCodeEmail');
					}
				}

			}
			console.log($("#isOtpVerifed").val());
			return true;
		}
	});
}

function changeMobileNumber(entityType){
	if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'||entityType==undefined){
		$('.otp-field-wrapper').slideUp();
		$('.fixed-height-desktop').addClass('hide-step');
		$('.opt-step').removeClass('hide')
		$('#userphone').prop('disabled', false);
		$('#sendOTP').show()
		$('#changeNumber').hide()
	}else if(entityType=='SCHOLARSHIP-PROGRAM'){

	}else if(entityType=='REQUEST-DEMO'){

	}

}

function validateRequestForOTP(formId, moduleId, otpType, messageChannel, entityType, entityId, via){
	var flag=true;

	if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
		hideMessageRequestDemoPage('serverError','');
		hideMessageRequestDemoPage('userphoneError','userphone');
		hideMessageRequestDemoPage('otpCodeError','otpCode');
	}else if(entityType=='SCHOLARSHIP-PROGRAM'){
		hideMessageScholarship('serverError');
	}else if(entityType=='REQUEST-DEMO'){
		hideMessageRequestDemoPage('serverError','');
		hideMessageRequestDemoPage('userphoneError','userphone');
		hideMessageRequestDemoPage('otpCodeError','otpCode');
	}else if(entityType=='B2B-REQUEST'){
		if(via == "E"){
			hideMessageRequestDemoPage('serverError','');
			hideMessageRequestDemoPage('emailError','email');
			hideMessageRequestDemoPage('otpCodeError','otpCode');
		}else if(via == "N"){
			hideMessageRequestDemoPage('serverError','');
			hideMessageRequestDemoPage('isdCodeMobileNoError','userphone');
			hideMessageRequestDemoPage('otpCodeError','otpCode');
		}else{
			hideMessageRequestDemoPage('serverError','');
			hideMessageRequestDemoPage('wtspNumberNoError','wtspNumber');
			hideMessageRequestDemoPage('otpCodeError','otpCode');
		}
		
	}

	if (!validateFormAscii(formId)) {
		if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
			showMessageRequestDemoPage(false, 'Please use the English Keyboard while providing information','serverError','');
		}else if(entityType=='SCHOLARSHIP-PROGRAM'){
			showMessageScholarship(0, 'Please use the English Keyboard while providing information','serverError');
		}else if(entityType=='REQUEST-DEMO'){
			showMessageRequestDemoPage(false, 'Please use the English Keyboard while providing information','serverError','');
		}else if(entityType=='EVALUATION-FORM'){
			showMessageRequestDemoPageWithTimeout(true, 'Please use the English Keyboard while providing information','otpModelMesg','');
		}else if(entityType=='B2B-REQUEST'){
			showMessageRequestDemoPage(true, 'Please use the English Keyboard while providing information','otpModelMesg','');
		}
		return false
	}
	if(via == "W"){
		$("#"+formId+" #wtspNumber").removeClass('bdr-red');
		if (M.isNRIMobile($("#"+formId+" #wtspNumber").val()) == null) {
			if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
				$("#"+formId+" #wtspNumber").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid', 'wtspNumberNoError','wtspNumber');
			}else if(entityType=='SCHOLARSHIP-PROGRAM'){
				showMessageScholarship(0, 'Phone number is either invalid or empty','serverError');
				$("#"+formId+" #wtspNumber").addClass('bdr-red');
			}else if(entityType=='REQUEST-DEMO'){
				$("#"+formId+" #wtspNumber").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid', 'wtspNumberNoError','wtspNumber');
			}else if(entityType=='EVALUATION-FORM'){
				$("#"+formId+" #wtspNumber").css('color', '#a9a9a9');
				showMessageRequestDemoPageWithTimeout(true, 'Mobile number is either empty or invalid','otpModelMesg','');
			}else if(entityType=='B2B-REQUEST'){
				$("#"+formId+" #wtspNumber").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid','wtspNumberNoError','wtspNumber');
			}
			return false
		}
	}else if(via == "E"){
		$("#"+formId+" #email").removeClass('bdr-red');
		if ($("#"+formId+" #email").val() == null || $("#"+formId+" #email").val() == undefined || $("#"+formId+" #email").val() == "") {
			if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
				$("#"+formId+" #email").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid', 'emailError','email');
			}else if(entityType=='SCHOLARSHIP-PROGRAM'){
				showMessageScholarship(0, 'Phone number is either invalid or empty','serverError');
				$("#"+formId+" #email").addClass('bdr-red');
			}else if(entityType=='REQUEST-DEMO'){
				$("#"+formId+" #email").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid', 'emailError','email');
			}else if(entityType=='EVALUATION-FORM'){
				$("#"+formId+" #email").css('color', '#a9a9a9');
				showMessageRequestDemoPageWithTimeout(true, 'Mobile number is either empty or invalid','otpModelMesg','');
			}else if(entityType=='B2B-REQUEST'){
				$("#"+formId+" #email").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Email is either empty or invalid','emailError','email');
			}
			return false
		}
	}else{
		$("#"+formId+" #userphone").removeClass('bdr-red');
		if (M.isNRIMobile($("#"+formId+" #userphone").val()) == null) {
			if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
				$("#"+formId+" #userphone").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid', 'mobileNumberError','userphone');
			}else if(entityType=='SCHOLARSHIP-PROGRAM'){
				showMessageScholarship(0, 'Phone number is either invalid or empty','serverError');
				$("#"+formId+" #userphone").addClass('bdr-red');
			}else if(entityType=='REQUEST-DEMO'){
				$("#"+formId+" #userphone").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Mobile number is either empty or invalid', 'mobileNumberError','userphone');
			}else if(entityType=='EVALUATION-FORM'){
				$("#"+formId+" #userphone").css('color', '#a9a9a9');
				showMessageRequestDemoPageWithTimeout(true, 'Mobile number is either empty or invalid','otpModelMesg','');
			}
			else if(entityType=='B2B-REQUEST'){
				$("#"+formId+" #userphone").css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Number is either empty or invalid','isdCodeMobileNoError','userphone');
			}
			return false
		}
	}
	
	
	if(otpType==3){
		let otpfieldId =  "";
		if(via == 'E'){
			otpfieldId = "#"+formId+" #otpCodeEmail";
		}else if(via == 'N'){
			otpfieldId = "#"+formId+" #otpCodePhoneNumber";
		}else{
			otpfieldId = "#"+formId+" #otpCodeNumber";
		}

		$(otpfieldId).removeClass('bdr-red');
		if(entityType=='EVALUATION-FORM'){
			formId='evalutionOTPModelForm';
		}
		if ($(otpfieldId).val().length !=6 ) {
			if(entityType=='STUDENT-SIGNUP' || entityType=='TEACHER-SIGNUP'){
				$(otpfieldId).css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Please enter valid OTP', 'otpCodeError','otpCode');
			}else if(entityType=='SCHOLARSHIP-PROGRAM'){
				showMessageScholarship(0, 'Please enter valid OTP','serverError');
				$(otpfieldId).addClass('bdr-red');
			}else if(entityType=='REQUEST-DEMO'){
				$(otpfieldId).css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Please enter valid OTP', 'otpCodeError','otpCode');
			}else if(entityType=='EVALUATION-FORM'){
				$(otpfieldId).css('color', '#a9a9a9');
				showMessageRequestDemoPageWithTimeout(true, 'Please enter valid OTP','otpModelMesg','otpCode');
			}else if(entityType=='B2B-REQUEST'){
				$(otpfieldId).css('color', '#a9a9a9');
				showMessageRequestDemoPage(true, 'Please enter valid OTP','otpCodeEmailError','otpCodeEmail');
			}
			flag=false
		}
	}
	return flag;
}
function getRequestForOTP(formId, moduleId, otpType, messageChannel, entityType, entityId, via){
	var RequestOTP = {};
	var authentication = {};
	var RequestOTPData = {};
	var url=window.location.href;
	var isDemoUser=url.split('?isDemoUser')[1];
	RequestOTPData['messageChannel'] = messageChannel;
	RequestOTPData['location'] = $("#"+formId+" #location").val();
	RequestOTPData['otpType'] = otpType;
	RequestOTPData['isdCode'] = $("#" + formId + " #isdCodeMobileNo").val();
	let number = $("#"+formId+" #wtspNumber").val();
	if(number == null || number == undefined || number == "")
	{
		number = $("#"+formId+" #userphone").val();
	}
	RequestOTPData['userphone'] = number;
	RequestOTPData['userEmail'] = $("#"+formId+" #email").val();;
	RequestOTPData['signupType'] = 'Online';
	RequestOTPData['schoolUUID'] = SCHOOL_UUID;
	RequestOTPData['schoolId'] = SCHOOL_ID;
	let otpfieldId = "";
	if(via == "E"){
		RequestOTPData['varifiedUsing'] = "E";
		otpfieldId = "#"+formId+" #otpCodeEmail";
	}else if(via == "N"){
		RequestOTPData['varifiedUsing'] = "N";
		otpfieldId = "#"+formId+" #otpCodePhoneNumber";
	}else{
		RequestOTPData['varifiedUsing'] = "W";
		otpfieldId = "#"+formId+" #otpCodeNumber";
	}

	if(entityType=='EVALUATION-FORM'){
		RequestOTPData['otpCode'] = $("#evalutionOTPModelForm #otpCode").val();
	}else{
		RequestOTPData['otpCode'] = $(otpfieldId).val();
	}
	RequestOTPData['entityType'] = entityType;
	if(entityId==''){
		RequestOTPData['entityId'] = entityId;
	}else{
		RequestOTPData['entityId'] = entityId;
	}

	if(isDemoUser!=undefined && isDemoUser!=''){
		isDemoUser=isDemoUser.split('=')[1];
		RequestOTPData['isDemoUser'] = isDemoUser;
	}
	RequestOTP['requestOTPData'] = RequestOTPData;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	RequestOTP['authentication'] = authentication;
	RequestOTP['requestData'] = RequestOTPData;
	var payload = {};
	payload['payload'] = encode(JSON.stringify(RequestOTP));
	return payload;
}

function encode(payload){
	return window.btoa(encodeURI(payload));
}