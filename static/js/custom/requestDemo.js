$(document).ready(function() {
	console.log("demo");
});
function validateRequestForRequestDemo(formId,moduleId){
	hideMessageRequestDemoPage('usernameError','username');
//	hideMessageRequestDemoPage('userLNameError','userLName');
//	hideMessageRequestDemoPage('emailError','email');
	hideMessageRequestDemoPage('isdCodeMobileNoError','isdCodeMobileNo');
	hideMessageRequestDemoPage('isdCodeMobileNoError','userphone');
	hideMessageRequestDemoPage('isdCodeWhatsupNoError','isdCodeWhatsupNoError');
//	hideMessageRequestDemoPage('sdobError','dobMM');
//	hideMessageRequestDemoPage('sdobError','dobDD');
//	hideMessageRequestDemoPage('sdobError','dobYY');
	
//	hideMessageRequestDemoPage('sdobError','sdobError');
//	hideMessageRequestDemoPage('descriptionError');
	
	hideMessageRequestDemoPage('relationTypeError','relationType');
//	hideMessageRequestDemoPage('titleError','title');
	hideMessageRequestDemoPage('parentNameError','parentName');
//	hideMessageRequestDemoPage('parentLNameError','parentLName');
	hideMessageRequestDemoPage('parentEmailError','parentEmail');
	hideMessageRequestDemoPage('countryIdError','countryId');
	
	hideMessageRequestDemoPage('freeSlotListError','viewFreeSlot');
	hideMessageRequestDemoPage('countryTimezoneIdError','countryTimezoneId');
	//hideMessageRequestDemoPage('chooseDateError','chooseDate');
	hideMessageRequestDemoPage('chooseDateError','newDateslected');
	hideMessageRequestDemoPage('countryTimezoneIdError','countryTimezoneId');
	hideMessageRequestDemoPage('otpCodeError','otpCode');
	var flag=true;
//	if (!validateFormAscii(formId)) {
//		showMessageRequestDemoPage(false, 'Please use the English Keyboard while providing information');
//		flag=false;
//	}
	if('BOOKMEETING'==moduleId){
		/*if ($("#"+formId+" #dobMM").val()==0 || $("#"+formId+" #dobMM").val()==null || 
			$("#"+formId+" #dobDD").val()==0 || $("#"+formId+" #dobDD").val()==null || 
			$("#"+formId+" #dobYY").val()==0 || $("#"+formId+" #dobYY").val()==null) {
			
			if($("#"+formId+" #dobMM").val()==0 || $("#"+formId+" #dobMM").val()==null){
				showMessageRequestDemoPage(true, 'Student Date Of Birth is required','sdobError','dobMM');
				flag=false;
			}else if($("#"+formId+" #dobDD").val()==0 || $("#"+formId+" #dobDD").val()==null){
				showMessageRequestDemoPage(true, 'Student Date Of Birth is required','sdobError','dobDD');
				flag=false;
			}else if($("#"+formId+" #dobYY").val()==0 || $("#"+formId+" #dobYY").val()==null){
				showMessageRequestDemoPage(true, 'Student Date Of Birth is required','sdobError','dobYY');
				flag=false;
			}
		}
		*/
		/*if ($("#"+formId+" #dobMM").val()!=0 || $("#"+formId+" #dobMM").val()!=null ||
			$("#"+formId+" #dobDD").val()!=0 || $("#"+formId+" #dobDD").val()!=null || 
			$("#"+formId+" #dobYY").val()!=0 || $("#"+formId+" #dobYY").val()!=null) {
			
			var dob=new Date(parseInt($("#"+formId+" #dobYY").val()),parseInt($("#"+formId+" #dobMM").val())-1,parseInt($("#"+formId+" #dobDD").val()));
			if(dob == undefined){
				showMessageRequestDemoPage(true, 'Student Date Of Birth is not valid','sdobError','dobYY');
				flag=false;
			}
		}*/
		if($("#"+formId+" #relationType").length>0){
			if ($("#"+formId+" #relationType").val()=='' || $("#"+formId+" #relationType").val()==null) {
				showMessageRequestDemoPage(true, 'Relation Type is required', 'relationTypeError','relationType');
				flag=false;
			}
		}
//		if ($("#"+formId+" #title").val()=='' || $("#"+formId+" #title").val()==null) {
//			showMessageRequestDemoPage(true, 'Title is required', 'titleError','title');
//			flag=false;
//		}
	
		/*if ($("#"+formId+" #parentName").val()=='' || $("#"+formId+" #parentName").val()==null) {
			showMessageRequestDemoPage(true, 'First Name is required', 'parentNameError','parentName');
			flag=false;
		}*/
		
//		if ($("#"+formId+" #parentLName").val()=='' || $("#"+formId+" #parentLName").val()==null) {
//			showMessageRequestDemoPage(true, 'Last Name is required', 'parentLNameError','parentLName');
//			flag=false;
//		}
		if ($("#"+formId+" #username").val()=='' || $("#"+formId+" #username").val()==null) {
			showMessageRequestDemoPage(true, 'Student Name is required','usernameError','username');
			flag=false;
		}
//		if ($("#"+formId+" #userLName").val()=='' || $("#"+formId+" #userLName").val()==null) {
//			showMessageRequestDemoPage(true, 'Student Last Name is required','userLNameError','userLName');
//			flag=false;
//		}
		if (!validateEmail($("#" + formId + " #parentEmail").val().trim())) {
			showMessageRequestDemoPage(false, 'Parent/Student email is either empty or invalid', 'parentEmailError','parentEmail');
			flag=false;
		}
		if ($("#"+formId+" #countryId").val()=='' || $("#"+formId+" #countryId").val()==null) {
			showMessageRequestDemoPage(true, 'Country is required', 'countryIdError','countryId');
			flag=false;
		}
//		if($("#" + formId + " #email").val()!=""){
//			if (!validateEmail($("#" + formId + " #email").val().trim())) {
//				showMessageRequestDemoPage(false, 'Email is invalid', 'emailError','email');
//				flag=false;
//			}
//		}
	}else {
		if ($("#"+formId+" #username").val()=='' || $("#"+formId+" #username").val()==null) {
			showMessageRequestDemoPage(true, 'Name is required','usernameError','username');
			flag=false;
		}
//		if (!validateEmail($("#" + formId + " #email").val().trim())) {
//			showMessageRequestDemoPage(false, 'Email is either empty or invalid', 'emailError','email');
//			flag=false;
//		}
	}
	if ($("#"+formId+" #grade").val()=='' || $("#"+formId+" #grade").val()==null) {
		showMessageRequestDemoPage(true, 'Grade is required', 'gradeError','grade');
		flag=false;
	}
	if($("#"+formId+" #IsdCodeApiStatus").val()=='true'){
		if ($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null) {
			showMessageRequestDemoPage(true, 'ISD Code is required', 'isdCodeMobileNoError','isdCodeMobileNo');
			flag=false;
		} 
	}
	if ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null) {
		showMessageRequestDemoPage(true, 'Phone Number is required', 'isdCodeMobileNoError','userphone');
		flag=false;
	}
	if($("#"+formId+" #IsdCodeApiStatus").val()=='true'){
		if (($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null)  &&  ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null)) {
			showMessageRequestDemoPage(true, 'ISD Code and Phone No. are required', 'isdCodeMobileNoError','isdCodeMobileNo');
			flag=false;
		}
	}
	if ($("#"+formId+" #wtspNumber").val()!='' && $("#"+formId+" #isdCodeWhatsupNo").val()=='' && ($("#"+formId+" #IsdCodeApiStatus").val()=='true')) {	
		showMessageRequestDemoPage(true, 'ISD Code for whats app number is required', 'isdCodeWhatsupNoError','isdCodeWhatsupNo');
		flag=false;
	}
//	if ($("#"+formId+" #description").val()=='' || $("#"+formId+" #description").val()==null) {
//		showMessageRequestDemoPage(true, 'Description is required', 'descriptionError');
//		flag=false;
//	}
	if ($("#"+formId+" #countryTimezoneId").val()==null || $("#"+formId+" #countryTimezoneId").val()==0) {
		showMessageRequestDemoPage(true, 'Please select a Time Zone', 'countryTimezoneIdError','countryTimezoneId');
		flag=false;
	}
	
//	if ($("#"+formId+" #chooseDate").val()==null || $("#"+formId+" #chooseDate").val()=='') {
//		showMessageRequestDemoPage(true, 'Please select a Month', 'chooseDateError','chooseDate');
//		flag=false;
//	}
	if ($("#"+formId+" #newDateslected").val()==null || $("#"+formId+" #newDateslected").val()=='') {
		showMessageRequestDemoPage(true, 'Please select a Month', 'chooseDateError','newDateslected');
		flag=false;
	}
	if($("input[name='slotTime']:checked").val()==undefined){
		showMessageRequestDemoPage(true, 'Please select any one Slot.', 'freeSlotListError','viewFreeSlot');
		flag=false;
	}
	return flag;
}

function validateElement(formId,fieldId, fielderrorId,moduleId){
	flag=true;
	if(fieldId=='username'){
		if ($("#"+formId+" #username").val()=='' || $("#"+formId+" #username").val()==null) {
			if('BOOKMEETING'==moduleId){
				showMessageRequestDemoPage(true, 'Student Name is required','usernameError','username');
			}else{
				showMessageRequestDemoPage(true, 'Student Name is required','usernameError','username');
			}
			flag=false;
		}else{
			hideMessageRequestDemoPage('usernameError','username');
		}
	}
/*
	if(fieldId=='userLName'){
		if ($("#"+formId+" #userLName").val()=='' || $("#"+formId+" #userLName").val()==null) {
			showMessageRequestDemoPage(true, 'Student Last Name is required','userLNameError','userLName');
			flag=false;
		}else{
			hideMessageRequestDemoPage('userLNameError','userLName');
		}
	} 
*/
/*
	if(fieldId=='dobMM' || fieldId=='dobDD' ||  fieldId=='dobYY' ){
//		if ($("#"+formId+" #sdob").val()=='' || $("#"+formId+" #sdob").val()==null) {
//			showMessageRequestDemoPage(true, 'Student Date Of Birth	is required','sdobError','sdob');
//			flag=false;
//		}else{
//			hideMessageRequestDemoPage('sdobError','sdob');
//		}
		if ($("#"+formId+" #dobMM").val()==0 || $("#"+formId+" #dobMM").val()==null || 
			$("#"+formId+" #dobDD").val()==0 || $("#"+formId+" #dobDD").val()==null || 
			$("#"+formId+" #dobYY").val()==0 || $("#"+formId+" #dobYY").val()==null) {
				if($("#"+formId+" #dobMM").val()==0 || $("#"+formId+" #dobMM").val()==null){
					showMessageRequestDemoPage(true, 'Student Date Of Birth is required','sdobError','dobMM');
					flag=false;
				}else if($("#"+formId+" #dobDD").val()==0 || $("#"+formId+" #dobDD").val()==null){
					showMessageRequestDemoPage(true, 'Student Date Of Birth is required','sdobError','dobDD');
					flag=false;
				}else if($("#"+formId+" #dobYY").val()==0 || $("#"+formId+" #dobYY").val()==null){
					showMessageRequestDemoPage(true, 'Student Date Of Birth is required','sdobError','dobYY');
					flag=false;
				}
		}else {
			hideMessageRequestDemoPage('sdobError','dobMM');
			hideMessageRequestDemoPage('sdobError','dobDD');
			hideMessageRequestDemoPage('sdobError','dobYY');
		}
	}
*/
/*
	 if(fieldId=='email'){
		if('BOOKMEETING'==moduleId){
			if($("#" + formId + " #email").val()!=""){
				if (!validateEmail($("#" + formId + " #email").val().trim())) {
					showMessageRequestDemoPage(false, 'Email is invalid', 'emailError','email');
					flag=false;
				}else{
					hideMessageRequestDemoPage('emailError','email');
				}
			}else{
				hideMessageRequestDemoPage('emailError','email');
			}
		}else{
			if (!validateEmail($("#" + formId + " #email").val().trim())) {
				showMessageRequestDemoPage(false, 'Email is either empty or invalid', 'emailError','email');
				flag=false;
			}else{
				hideMessageRequestDemoPage('emailError','email');
			}
		}
	}else 
*/
	if(fieldId=='grade'){
		if ($("#"+formId+" #grade").val()=='' || $("#"+formId+" #grade").val()==null) {
			showMessageRequestDemoPage(true, 'Grade is required', 'gradeError','grade');
			flag=false;
		}else{
			hideMessageRequestDemoPage('gradeError','grade');
		}	
	}else if(fieldId=='isdCodeMobileNo'){
		if($("#"+formId+" #IsdCodeApiStatus").val()=='true'){
			if ($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null) {
				showMessageRequestDemoPage(true, 'ISD Code is required', 'isdCodeMobileNoError','isdCodeMobileNo');
				flag=false;
			} else{
				hideMessageRequestDemoPage('isdCodeMobileNoError','isdCodeMobileNo');
			}
		}
	}else if(fieldId=='userphone'){
		if ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null) {
			showMessageRequestDemoPage(true, 'Phone Number is required', 'isdCodeMobileNoError','userphone');
			flag=false;
		}
		//else if ($("#"+formId+" #otpVerifiedstatus").val()=='true') {

		//}
		
		else{
			hideMessageRequestDemoPage('isdCodeMobileNoError','userphone');
		}
	}else if(fieldId=='parentName'){
		if ($("#"+formId+" #parentName").val()=='' || $("#"+formId+" #parentName").val()==null) {
			showMessageRequestDemoPage(true, 'First Name is required', 'parentNameError','parentName');
			flag=false;
		}else{
			hideMessageRequestDemoPage('parentNameError','parentName');
		}
	/*
	}else if(fieldId=='parentLName'){
		if ($("#"+formId+" #parentLName").val()=='' || $("#"+formId+" #parentLName").val()==null) {
			showMessageRequestDemoPage(true, 'Last Name is required', 'parentLNameError','parentLName');
			flag=false;
		}else{
			hideMessageRequestDemoPage('parentLNameError','parentLName');
		}
	*/
	}else if(fieldId=='parentEmail'){
		if (!validateEmail($("#" + formId + " #parentEmail").val().trim())) {
			showMessageRequestDemoPage(false, 'Parent/Student email is either empty or invalid', 'parentEmailError','parentEmail');
			flag=false;
		}else{
			hideMessageRequestDemoPage('parentEmailError','parentEmail');
		}
	}else if(fieldId=='title'){
		if ($("#"+formId+" #title").val()=='' || $("#"+formId+" #title").val()==null) {
			showMessageRequestDemoPage(true, 'Title is required', 'titleError','title');
			flag=false;
		}else{
			hideMessageRequestDemoPage('titleError','title');
		}	
	}else if(fieldId=='countryId'){
		if ($("#"+formId+" #countryId").val()=='' || $("#"+formId+" #countryId").val()==null) {
			showMessageRequestDemoPage(true, 'Country is required', 'countryIdError','countryId');
			flag=false;
		}else{
			hideMessageRequestDemoPage('countryIdError','countryId');
			if('BOOKMEETING'==moduleId){
				var icon= $('#countryId option:selected').attr('custom_country_icon');
				var dialCode= $('#countryId option:selected').attr('custom_dial_code');
				inputContact = document.querySelector("#userphone");

				itiContcat.setCountry('');
				itiContcat.setCountry(icon);
				$('#isdCodeMobileNoIcon').val(itiContcat.getSelectedCountryData().iso2);
				$('#isdCodeMobileNo').val(itiContcat.getSelectedCountryData().dialCode);
				
				inputContact1 = document.querySelector("#wtspNumber");
				itiContcat1.setCountry('');
				itiContcat1.setCountry(icon);
				$('#isdCodeWhatsupNoIcon').val(itiContcat1.getSelectedCountryData().iso2);
				$('#isdCodeWhatsupNo').val(itiContcat1.getSelectedCountryData().dialCode);
				
			}
		}
	}else if(fieldId=='relationType'){
		if ($("#"+formId+" #relationType").val()=='' || $("#"+formId+" #relationType").val()==null) {
			showMessageRequestDemoPage(true, 'Relation Type is required', 'relationTypeError','relationType');
			flag=false;
		}else{
			hideMessageRequestDemoPage('relationTypeError','relationType');
		}	
	}
	validateRequestForActiveConfirm(formId,moduleId);
	return flag;
}

function validateRequestForActiveConfirm(formId,moduleId){
	flag=true;
	if('BOOKMEETING'==moduleId){
		if ($("#"+formId+" #username").val()=='' || $("#"+formId+" #username").val()==null) {
			flag=false;
//		}else if ($("#"+formId+" #userLName").val()=='' || $("#"+formId+" #userLName").val()==null) {
//			flag=false;
		}else if ($("#"+formId+" #grade").val()=='' || $("#"+formId+" #grade").val()==null) {
			flag=false;
		}else  if (($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null) && ($("#"+formId+" #IsdCodeApiStatus").val()=='true')) {
			flag=false;
		}else if ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null) {
			flag=false;
		}else if ((($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null)&& ($("#"+formId+" #IsdCodeApiStatus").val()=='true'))  &&  ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null)) {
			flag=false;
		}else if (!validateEmail($("#" + formId + " #parentEmail").val().trim())) {
			flag=false;
//		}else if ($("#"+formId+" #title").val()=='' || $("#"+formId+" #title").val()==null) {
//			flag=false;
		}else if ($("#"+formId+" #countryId").val()=='' || $("#"+formId+" #countryId").val()==null) {
			flag=false;
//		}else if ($("#"+formId+" #dobMM").val()==0 || $("#"+formId+" #dobMM").val()==null || 
//				$("#"+formId+" #dobDD").val()==0 || $("#"+formId+" #dobDD").val()==null || 
//				$("#"+formId+" #dobYY").val()==0 || $("#"+formId+" #dobYY").val()==null) {
//			flag=false;
//		}else if ($("#"+formId+" #relationType").val()=='' || $("#"+formId+" #relationType").val()==null) {
//			flag=false;
//		}else if ($("#"+formId+" #parentName").val()=='' || $("#"+formId+" #parentName").val()==null) {
//			flag=false;
//		}else if ($("#"+formId+" #parentLName").val()=='' || $("#"+formId+" #parentLName").val()==null) {
//			flag=false;
//		}else if (!validateEmail($("#" + formId + " #parentEmail").val().trim())) {
//			flag=false;
//		}else if($("#" + formId + " #email").val()!=""){
//			if (!validateEmail($("#" + formId + " #email").val().trim())) {
//				flag=false;
//			}
		}
		
		//else if ($("#"+formId+" #otpVerifiedstatus").val()=='false') {
		//	flag=false;
		//}
		
	}else{
		if ($("#"+formId+" #username").val()=='' || $("#"+formId+" #username").val()==null) {
			flag=false;
//		}else if (!validateEmail($("#" + formId + " #email").val().trim())) {
//			flag=false;
		}else if ($("#"+formId+" #grade").val()=='' || $("#"+formId+" #grade").val()==null) {
			flag=false;
		}else  if ($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null) {
			flag=false;
		}else if ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null) {
			flag=false;
		}else if (($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null)  &&  ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null)) {
			flag=false;
		}
	}
	
	if(flag){
		$('#sendRequest').addClass('active');
	}else{
		$('#sendRequest').removeClass('active');
	}
	
}
function callForRequestDemoForm(formId, moduleId) {
	console.log("callForRequestDemoForm")
	hideMessage('');
	$("#sendRequest").prop("disabled", true);
	if(!validateRequestForRequestDemo(formId,moduleId)){
		$("#sendRequest").prop("disabled", false);
		return false;
	}
	$.ajax({
		type : "POST",
		url : getURLForHTML('common','reqeust-demo-content'),
		contentType : "application/json",
		data : JSON.stringify(getRequestForRequestDemo(formId, moduleId)),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessage(true, stringMessage[1]);
        			$("#sendRequest").prop("disabled", false);
        			if(stringMessage[1]=='Meeting slot is unavailable, please book another slot'){
        				$('.meeting-form, .dropdown-menu, .first-step-title').show();
        				$('.confirm-meeting-form').hide();
        				if($('#campaingnType').val()=='meet-a-counselor'){
        					freeslotsList(formId,true,'counselor');
        				}else{
        					freeslotsList(formId,true,'admin');
        				}
//        				$('.today active day').trigger('click');
        			}
        		} else {
        			$("#sendRequest").prop("disabled", true);
        			if($('#campaingnType').val()=='Request-demo'){
        				goAhead(CONTEXT_PATH+"common/request-demo-thank-you", "");
        			}else if($('#campaingnType').val()=='Book-a-demo'){
        				goAhead(CONTEXT_PATH+"common/book-a-demo-thank-you", "");
        			}else if($('#campaingnType').val()=='meet-a-counselor'){
        				goAhead(CONTEXT_PATH+"common/meet-a-counselor-thank-you", "");
        			}else{
        				goAhead(CONTEXT_PATH+"common/book-meeting-thank-you", "");
        			}
        		}
        		return false;
			}
			return false;
		},
		error : function(e) {
			$("#sendRequest").prop("disabled", false);
		}
	});
}

function getRequestForRequestDemo(formId, moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var requestDemoDTO = {};
	requestDemoDTO['campaignSource'] = $("#" + formId + " #campaignSource").val();
	requestDemoDTO['encryptedRequestDemoId'] = $("#" + formId + " #encryptedRequestDemoId").val();
	requestDemoDTO['name'] = $("#" + formId + " #username").val();
//	requestDemoDTO['lastName'] = $("#" + formId + " #userLName").val();
//	requestDemoDTO['email'] = $("#" + formId + " #email").val().trim();

	requestDemoDTO['isdCode'] = $("#" + formId + " #isdCodeMobileNo").val();
	requestDemoDTO['isdCodeIcon'] = $("#" + formId + " #isdCodeMobileNoIcon").val();
	if($("#"+formId+" #sameWhatsapp").is(':checked')){
		requestDemoDTO['sameWhatsapp'] = "Y";
	}else{
		requestDemoDTO['sameWhatsapp'] = "N";
	}
	
	requestDemoDTO['contactNumber'] = $("#" + formId + " #userphone").val();
	
	requestDemoDTO['isdCodeWtsp'] = $("#" + formId + " #isdCodeWhatsupNo").val();
	requestDemoDTO['isdCodeWtspIcon'] = $("#" + formId + " #isdCodeWhatsupNoIcon").val();
	
	requestDemoDTO['wtspNumber'] = $("#" + formId + " #wtspNumber").val();
	requestDemoDTO['contactDescription'] = escapeCharacters($("#" + formId + " #description").val());
	requestDemoDTO['location'] = $("#" + formId + " #location").val();
	requestDemoDTO['grade'] = $("#" + formId + " #grade").val();
//	requestDemoDTO['sdob'] = $("#" + formId + " #sdob").val();
//	var sdob=$("#" + formId + " #dobMM").val()+"-"+$("#" + formId + " #dobDD").val()+"-"+$("#" + formId + " #dobYY").val();
//	requestDemoDTO['sdob'] = sdob;
	requestDemoDTO['countryTimezoneId'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
	requestDemoDTO['timeZone'] = $("#" + formId + " #countryTimezoneId").val().trim();
	requestDemoDTO['studentTimeZone']=$("#" + formId + " #countryTimezoneId option:selected").text().trim();
	requestDemoDTO['meetingDate'] =$("input[name='slotTime']:checked").attr('slotDateAttr');
	requestDemoDTO['meetingSlotId'] = $("input[name='slotTime']:checked").attr('slotidattr');
	requestDemoDTO['meetingSlotTime'] = $("input[name='slotTime']:checked").val();
	requestDemoDTO['campaignName'] = $("#" + formId + " #campaingnType").val();
	if($("#counselorUserId").val()!=undefined && $("#counselorUserId").val()!=null && $("#counselorUserId").val()!=0){
		requestDemoDTO['counselorUserId'] = $("#counselorUserId").val();
	}
	requestDemoDTO['relationType'] = $("#" + formId + " #relationType").val();
	if("Mother" ==$("#" + formId + " #relationType").val()){
		requestDemoDTO['title'] = "Ms.";
	}else if("Father" ==$("#" + formId + " #relationType").val()){
		requestDemoDTO['title'] = "Mr.";
	}
//	requestDemoDTO['title'] = $("#" + formId + " #title").val();
//	requestDemoDTO['parentName'] = $("#" + formId + " #parentName").val();
//	requestDemoDTO['parentLName'] = $("#" + formId + " #parentLName").val();
	requestDemoDTO['parentEmail'] = $("#" + formId + " #parentEmail").val().trim();
	requestDemoDTO['countryId'] = $("#" + formId + " #countryId option:selected").attr('custom_country_value');
	requestDemoDTO['countryName'] = $("#" + formId + " #countryId option:selected").text().trim();
	requestDemoDTO['IsdCodeApiStatus'] =$("#"+formId+" #IsdCodeApiStatus").val();
	requestDemoDTO['moduleName'] =moduleId;
	
	requestData['requestDemoDTO'] = requestDemoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function callRequestDemoFreeSlots(formId, actionUrl) {
//	hideMessage('');
	var finalUrl='/get-request-demo-free-slots?'+actionUrl;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +finalUrl.split('?')[0],
		data : JSON.stringify(parseUrlToJson(finalUrl)),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			if("Please select a Time Zone"==stringMessage[1]){
        				showMessageRequestDemoPage(true, stringMessage[1], 'countryTimezoneIdError','countryTimezoneId');
        			}else{
        				showMessage(true, stringMessage[1]);
        			}
        			$('#freeSlotList').html('');
        		} else {
        			$('#freeSlotList').html(htmlContent);
        		}
        		return false;
			}
			return false;
		},
		error : function(e) {
			showMessage(true, e.responseText);
		}
	});
}

function validateRequestDemo(formId, status,type){
//	hideMessageRequestDemoPage('chooseDateError','chooseDate');
	hideMessageRequestDemoPage('chooseDateError','newDateslected');
	hideMessageRequestDemoPage('countryTimezoneIdError','countryTimezoneId');
	hideMessageRequestDemoPage('freeSlotListError','viewFreeSlot');
//	var meetingDate=$('#'+formId+' #chooseDate').val();
	var meetingDate=$('#'+formId+' #newDateslected').val();
	//console.log("meetingDate: "+meetingDate);
	if("admin"==type){
		if(meetingDate=='' || meetingDate==undefined){
			$('#freeSlotList').html("");
			//showMessageRequestDemoPage(true, "Please select a date", 'chooseDateError','chooseDate');
			showMessageRequestDemoPage(true, "Please select a date", 'chooseDateError','newDateslected');
			return false;
		}
	}else{
		if(meetingDate=='' || meetingDate==undefined){
			$('#freeSlotList').html("");
			//showMessageRequestDemoPage(true, "Please select a Month", 'chooseDateError','chooseDate');
			showMessageRequestDemoPage(true, "Please select a date", 'chooseDateError','newDateslected');
			return false;
		}
	}	
		var countryTimezoneId = $('#'+formId+' #countryTimezoneId').val();
		if(countryTimezoneId!=null &&  countryTimezoneId!=0){
			freeslotsList(formId, status,type)
			$('#bookMeetingslot').removeClass('active');
		}else{
			$('#freeSlotList').html("");
			showMessageRequestDemoPage(true, "Please select a Time Zone", 'countryTimezoneIdError','countryTimezoneId');
			return false;
		}
}

function freeslotsList(formId,status,type){
//	var meetingDate=$('#'+formId+' #chooseDate').val();
	var meetingDate=$('#'+formId+' #newDateslected').val();
	var countryTimezoneId =$('#countryTimezoneId').val();
	var requestType="";
	var lat="";
	var lon="";
	var book=""
	if(status){
		if($('#location').val()!=''){
			var locations = JSON.parse($('#location').val())
			lat=locations.lat;
			lon=locations.lon;
		}
	}
	if(type=='admin'){
		requestType='REQUESTDEMO';
		book='Y'
	}else if(type=='counselor'){
		requestType='COUNSELORMEET';
		book='N'
	} 
	var schoolId=$('#'+formId+' #schoolId').val();
	callRequestDemoFreeSlots('#requestDemo',"date="+meetingDate+"&countryTimezoneId="+countryTimezoneId+"&lat="+lat+"&lon="+lon+"&requestType="+requestType+"&book="+book+"&schoolId="+schoolId);
}

function backToChoose(){
	$('.meeting-form, .dropdown-menu, .first-step-title').show();
	$('.confirm-meeting-form').hide();
}
function saveMeetingSlot(formId,type,rescheduleStatus,moduleId){
	var flag=true;
	//hideMessageRequestDemoPage('chooseDateError','chooseDate');
	hideMessageRequestDemoPage('chooseDateError','newDateslected');
	hideMessageRequestDemoPage('countryTimezoneIdError','countryTimezoneId');
	hideMessageRequestDemoPage('freeSlotListError','viewFreeSlot');
//	if("admin"==type){
//		if ($("#chooseDate").val()==null || $("#chooseDate").val()=='') {
//			showMessageRequestDemoPage(true, 'Please select a date', 'chooseDateError','chooseDate');
//			flag=false;
//		}
//	}else{
//		if ($("#chooseDate").val()==null || $("#chooseDate").val()=='') {
//			showMessageRequestDemoPage(true, 'Please select a Month', 'chooseDateError','chooseDate');
//			flag=false;
//		}
//	}
	if("admin"==type){
		if ($("#newDateslected").val()==null || $("#newDateslected").val()=='') {
			showMessageRequestDemoPage(true, 'Please select a date', 'chooseDateError','newDateslected');
			flag=false;
		}
	}else{
		if ($("#newDateslected").val()==null || $("#newDateslected").val()=='') {
			showMessageRequestDemoPage(true, 'Please select a Month', 'chooseDateError','newDateslected');
			flag=false;
		}
	}
	if ($("#countryTimezoneId").val()==null || $("#countryTimezoneId").val()==0) {
		showMessageRequestDemoPage(true, 'Please select a Time Zone', 'countryTimezoneIdError','countryTimezoneId');
		flag=false;
	}
	$('#viewFreeSlot').removeClass('pt-37');
	if($("input[name='slotTime']:checked").val()==undefined){
		$('#viewFreeSlot').addClass('pt-37');
		showMessageRequestDemoPage(true, 'Please select any one Slot.', 'freeSlotListError','viewFreeSlot');
		flag=false;
	}
	if(flag){
	//	var selectedTime= $("input[name='slotTime']:checked").attr('slotDateAttr') +' ('+$("input[name='slotTime']:checked").val()+')';
		var selectedCountry= $('#countryTimezoneId option:selected').text();
		var selectedTime= "Your preferred date & time is: "+$("input[name='slotTime']:checked").attr('slotDateAttr') +' ('+$("input[name='slotTime']:checked").val()+') '+ $('#countryTimezoneId option:selected').text();
		$('#hideTime').html(selectedTime);
		$('#selectedCountry').html(selectedCountry);
		$('.meeting-form, .dropdown-menu, .first-step-title').hide();
		$('.confirm-meeting-form').show();
		if("pending"==rescheduleStatus){
			validateRequestForActiveConfirm(formId,moduleId);
		}
	}
	if($('.iti--allow-dropdown').length){
		$('#IsdCodeApiStatus').val(true);
	}else {
		$('#IsdCodeApiStatus').val(false);
	}
	return flag;
}

function calendar_width(){
    var blue_bg_width = $('.blue-bg').outerWidth();
    if($(window).outerWidth() > 768){
	    $('.dropdown-menu').css({width: `calc(${blue_bg_width}px - 30px)`});
		$('.datepicker td, .table-condensed').css({'width':'100%'});
    }
    else if($(window).outerWidth() < 480){
		$('.dropdown-menu').css({width: `calc(${blue_bg_width}px - 0px)`});
		$('.datepicker td, .table-condensed').css({'width':'100%'});
	}
 }
function validateWhatsapp(formId,fieldId, fielderrorId,moduleId){
	var icon= $('#isdCodeMobileNo').attr('value');
	var dialCode= $('#isdCodeMobileNoIcon').attr('value');
	flag=true;
	if($("#"+formId+" #sameWhatsapp").is(':checked')){
		if($("#" + formId + " #userphone").val()==null || $("#" + formId + " #userphone").val()==''){
			showMessageRequestDemoPage(true, 'Phone Number is required', 'isdCodeMobileNoError','userphone');
			flag=false;
		}else{
			$("#"+formId+" #sameWhatsapp").is(':checked');
			$("#"+formId+" #wtspNumber").val($("#" + formId + " #userphone").val());
			$("#"+formId+" #wtspNumber").attr('disabled',true).css({'cursor':'not-allowed'});
			$("#"+formId+" #userphone").attr('disabled',true).css({'cursor':'not-allowed'});
			$('.same-as').css({'opacity':'1'});
			var icon= $('#isdCodeMobileNo').attr('value');
			var dialCode= $('#isdCodeMobileNoIcon').attr('value');
			inputContact1 = document.querySelector("#wtspNumber");
			itiContcat1.setCountry('');
			itiContcat1.setCountry(dialCode);
			$('#isdCodeWhatsupNoIcon').val(itiContcat1.getSelectedCountryData().iso2);
			$('#isdCodeWhatsupNo').val(itiContcat1.getSelectedCountryData().dialCode);
		}
	}else{
		var PhoneNumLength = $('#userphone').val().length;
		$("#"+formId+" #wtspNumber").val('');
		$("#"+formId+" #wtspNumber").attr('disabled',false).css({'cursor':'inherit'});
		if($("#"+formId+" #otpVerifiedstatus").val()=='false'){
			/*$("#"+formId+" #userphone").attr('disabled',false).css({'cursor':'inherit'});*/
			$("#"+formId+" #userphone").focus();
			$("#"+formId+" #userphone").attr('disabled', false);
			$('.otp-message').css("display","inline-block");
			$('.otp-field-wrapper').css("display","none");
			if(PhoneNumLength > 6 ){
				$('.send-otp').removeClass('disable-btn');
				$("#"+formId+" #userphone").css({"cursor":"inherit"});
			}
			else{
				$('.send-otp').removeClass('hide-btn').addClass('disable-btn');
			}
			$('.send-otp').removeClass("hide-btn");
			$('.change-number').addClass('hide-btn');
		}
//		$('.same-as').css({'opacity':'0.5'});
		
	}
	return flag;
}