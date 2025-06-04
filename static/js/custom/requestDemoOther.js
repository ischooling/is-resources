$(document).ready(function() {
});
function validateRequestForRequestDemo(formId){
	
//	if (!validateFormAscii(formId)) {
//		showMessage(false, 'Please use the English Keyboard while providing information');
//		return false
//	}
	/*
	if ($("#"+formId+" #relationType").val()=='' || $("#"+formId+" #relationType").val()==null) {
		showMessage(true, 'Please select relation type');
		return false
	}
	if ($("#"+formId+" #parentName").val()=='' || $("#"+formId+" #parentName").val()==null) {
		showMessage(true, 'Parent Name is required');
		return false
	}
	*/
	if ($("#"+formId+" #username").val()=='' || $("#"+formId+" #username").val()==null) {
		showMessage(true, 'Name is required');
		return false
	}
	if ($("#"+formId+" #grade").val()==null || $("#"+formId+" #grade").val()=='') {
			showMessage(true, 'Please select a grade');
			return false
		}
	if ($("#"+formId+" #parentEmail").val()=='' || $("#"+formId+" #parentEmail").val()==null) {
		showMessage(true, 'Parent/Student Email is required');
		return false
	}
	
	/*if ($("#"+formId+" #isdCodeMobileNo").val()=='' || $("#"+formId+" #isdCodeMobileNo").val()==null) {
		showMessage(true, 'ISD Code is required');
		return false
	}*/
	if ($("#"+formId+" #userphone").val()=='' || $("#"+formId+" #userphone").val()==null) {
		showMessage(true, 'Phone Number is required');
		return false
	}
	if ($("#"+formId+" #wtspNumber").val()=='' ) {	
		showMessage(true, 'Whats app number is required');
		return false
	}
//	if ($("#"+formId+" #description").val()=='' || $("#"+formId+" #description").val()==null) {
//		showMessage(true, 'Description is required');
//		return false
//	}
		if ($("#"+formId+" #countryTimezoneId").val()==null || $("#"+formId+" #countryTimezoneId").val()==0) {
			showMessage(true, 'Please select a Time Zone');
			return false
		}
//		if ($("#countryTimezoneIdSearch").val()==null || $("#countryTimezoneIdSearch").val()=='') {
//			showMessage(true, 'Please select a Time Zone');
//			return false;
//		}
		if ($("#"+formId+" #newDateslected").val()==null || $("#"+formId+" #newDateslected").val()=='') {
			showMessage(true, 'Please select a date');
			return false
		}
		
		if($("input[name='slotTime']:checked").val()==undefined){
			showMessage(true, 'Please select any one Slot.');
			return false;
		}
	return true;
}


function callForRequestDemoForm(formId, moduleId) {
	hideMessage('');
	if(!validateRequestForRequestDemo(formId)){
		return false;
	}
	$("#inquiry").prop("disabled", true);
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
        			if(stringMessage[1]=='CONTACTUS DATA OBJECT IS NOT AVAILABLE IN REQUEST BODY'){
            			goAhead(CONTEXT_PATH+"common/appointment/booking/%20", "");
            			}
        		} else {
        			$("#sendRequest").prop("disabled", true);
        			if($('#campaingnType').val()=='Request-demo'){
        				goAhead(CONTEXT_PATH+"common/request-demo-thank-you", "");
        			}else if($('#campaingnType').val()=='Book-a-demo'){
        				goAhead(CONTEXT_PATH+"common/book-a-demo-thank-you", "");
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
	requestDemoDTO['encryptedRequestDemoId'] = $("#" + formId + " #encryptedRequestDemoId").val();
	//requestDemoDTO['parentName'] = $("#" + formId + " #parentName").val();
	requestDemoDTO['parentEmail'] = $("#" + formId + " #parentEmail").val()
	requestDemoDTO['name'] = $("#" + formId + " #username").val();
	requestDemoDTO['grade'] = $("#" + formId + " #grade").val();
	requestDemoDTO['isdCode'] = $("#" + formId + " #isdCodeMobileNo").val();
	requestDemoDTO['contactNumber'] = $("#" + formId + " #userphone").val();
	requestDemoDTO['isdCodeWtsp'] = $("#" + formId + " #isdCodeWhatsupNo").val();
	requestDemoDTO['wtspNumber'] = $("#" + formId + " #wtspNumber").val();
	requestDemoDTO['contactDescription'] = escapeCharacters($("#" + formId + " #description").val());
	requestDemoDTO['location'] = $("#" + formId + " #location").val();
	requestDemoDTO['campaignName'] = $("#" + formId + " #campaingnType").val();
	
	requestDemoDTO['countryTimezoneId'] = $('#countryTimezoneId option:selected').attr('custom_timezone_id');
	requestDemoDTO['timeZone'] = $("#" + formId + " #countryTimezoneId").val();
	requestDemoDTO['studentTimeZone']=$("#" + formId + " #countryTimezoneId option:selected").text();
		
	requestDemoDTO['meetingDate'] =$("input[name='slotTime']:checked").attr('slotDateAttr');
	requestDemoDTO['meetingSlotId'] = $("input[name='slotTime']:checked").attr('slotidattr');
	requestDemoDTO['meetingSlotTime'] = $("input[name='slotTime']:checked").val();
	requestDemoDTO['moduleName'] =moduleId;
	if($("#counselorUserId").val()!=undefined && $("#counselorUserId").val()!=null && $("#counselorUserId").val()!=0){
		requestDemoDTO['counselorUserId'] = $("#counselorUserId").val();
	}
	/*
	requestDemoDTO['relationType'] = $("#" + formId + " #relationType").val();
	if("Mother" ==$("#" + formId + " #relationType").val()){
		requestDemoDTO['title'] = "Ms.";
	}else if("Father" ==$("#" + formId + " #relationType").val()){
		requestDemoDTO['title'] = "Mr.";
	}
	*/
	requestDemoDTO['countryId'] = $("#" + formId + " #countryId option:selected").attr('custom_country_value').trim();
	requestDemoDTO['countryName'] = $("#" + formId + " #countryId option:selected").text().trim();
	requestDemoDTO['IsdCodeApiStatus'] =$("#"+formId+" #IsdCodeApiStatus").val();
	
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
        			showMessage(true, stringMessage[1]);
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

function emptyDateAndSlots(){
	$('#chooseDate').val("");
	$('#freeSlotList').html("");
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