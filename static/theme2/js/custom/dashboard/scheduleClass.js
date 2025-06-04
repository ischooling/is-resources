$(document).ready(function() {
	getWaringContent1();
});



function classroomSessionsForOther(elementId, argument){
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	$('#'+elementId).DataTable( {
		"stateSave": true,
		"searching": true,
        "processing": true,
        "serverSide": true,
        "pagingType":"full",
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+UNIQUEUUID+"/dashboard/student-teacher-sessions-report-data"+argument,
            "data": function ( data ) {
            	console.log('data '+data)
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	$(nRow).find('td:eq(3)').css('text-align','left');
        	$(nRow).find('td:eq(4)').css('text-align','left');
        	$(nRow).find('td:eq(5)').css('text-align','left');
        	//$('tr').addClass('success');
        },
        "columns": [
        	 { "data": "sno", "name" : "sno", "title" : "S. No"},
        	 { "data": "subjectName", "name" : "subjectName", "title" : "Course Name"},//standardName
        	 { "data": "teacherName", "name" : "teacherName", "title" : "Teacher Details"},//teacherEmail
        	 { "data": "studentName", "name" : "studentName", "title" : "Student Details"},//studentEmail
        	 { "data": "studentDateTime", "name" : "studentDateTime", "title" : "Student Time Zone"},//studentTimezone studentDaylightResponse
        	 { "data": "teacherDateTime", "name" : "teacherTimeZone", "title" : "Teacher Time Zone"},//teacherTimezone teacherDaylightResponse
        	 { "data": "adminDateTime", "name" : "adminDateTime", "title" : "Admin Time Zone"},//adminDateTime
        	 { "data": "recordingUrl", "name" : "recordingUrl", "title" : "Join/View Class"},
       	 	//{ "data": "moderator", "name" : "moderator", "title" : "Join Class"},
       		//{ "data": "attendee", "name" : "attendee", "title" : "Join/View Class As Attendee"},
        	 { "data": "attendeeStatus", "name" : "attendeeStatus", "title" : "Link Generation Status"},
        	 { "data": "sessionLink", "name" : "sessionLink", "title" : "Class Link"},
        	 { "data": "sendMail", "name" : "sendMail", "title" : "Send Mail"},
        	 { "data": "markSession", "name" : "markSession", "title" : "Mark Session"},
        	 { "data": "status", "name" : "status", "title" : "Session Status"},
        	 { "data": "createdDate", "name" : "createdDate", "title" : "Created Date / Booked Date"},//bookedDate
//        	 { "data": "recordingPublished", "name" : "recordingPublished", "title" : "Action"},
//        	 { "data": "endMeeting", "name" : "endMeeting", "title" : "End meeting"},
	          ],
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	bindHover();
}

function extraSessionDetails(elementId, argument){
	var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
	if(isDataTable){
		$('#'+elementId).dataTable().fnDestroy();
	}
	$('#'+elementId).DataTable( {
		"stateSave": true,
		"searching": true,
        "processing": true,
        "serverSide": true,
        "pagingType":"full",
        "searching": true,
        "pageLength": 10,
        "stateLoadParams": function (settings, data) {
        	if (!DEFAULT_SEARCH_STATE) {
	            return false;
        	}
          },
        "ajax": {
            "url": CONTEXT_PATH+UNIQUEUUID+"/dashboard/extra-session-details-data"+argument,
            "data": function ( data ) {
            	console.log('data '+data)
            }
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
        	$(nRow).find('td:eq(3)').css('text-align','left');
        	$(nRow).find('td:eq(4)').css('text-align','left');
        	$(nRow).find('td:eq(5)').css('text-align','left');
        	//$('tr').addClass('success');
        },
        "columns": [
         {"data": "sno", "name" : "sno", "title" : "S. No"},
       	 { "data": "studentName", "name" : "studentName", "title" : "Student Name"},
		 { "data": "studentStringId", "name": "studentStringId", "title": "Student ID" },
       	 { "data": "email", "name" : "email", "title" : "Email"},
       	 { "data": "grade", "name" : "grade", "title" : "Grade"},
       	 { "data": "referenceNo", "name" : "referenceNo", "title" : "Transaction Reference no"},
       	 { "data": "paymentDate", "name" : "paymentDate", "title" : "Payment Date"},
       	 { "data": "totalAmount", "name" : "totalAmount", "title" : "Total Amount"},
       	 { "data": "courseDetails", "name" : "courseDetails", "title" : "Course PlanDetails"},
//       	 { "data": "attendeeStatus", "name" : "attendeeStatus", "title" : "Link Generation Status"},
//       	 { "data": "sessionLink", "name" : "sessionLink", "title" : "Session Link"},
//       	 { "data": "sendMail", "name" : "sendMail", "title" : "Send Mail"},
//       	 { "data": "markSession", "name" : "markSession", "title" : "Mark Session"},
//       	 { "data": "status", "name" : "status", "title" : "Session Status"},
//       	 { "data": "createdDate", "name" : "createdDate", "title" : "Created Date / Booked Date"},//bookedDate
//       	 { "data": "recordingPublished", "name" : "recordingPublished", "title" : "Action"},
//       	 { "data": "endMeeting", "name" : "endMeeting", "title" : "End meeting"},

	          ],
	});
	$('#'+elementId).dataTable().fnSetFilteringEnterPress();
	bindHover();
}

function toggleFilter(elementID){
	$('#'+elementID).stop().slideToggle();
}

function updateClassroomSession(moduleId, role){
	if($('#meetingResult').val()=="N/A" || $('#meetingResult').val()==""){
		showMessage(true, 'Please Choose Mark Session');
	}else{
		submitMeetingForStudentSessionSlots("updateMeetingResultForm","SCHOOL","UPDATE",moduleId, "STUDENT_DOUBT_SESSION", role);
	}
}
function validateRequestForSubmitMeetingForStudentSessionSlots(formId,moduleId,controllType){
	//	if(controllType=='ADD'){
	//		if($('#standardId').val()==0 || $('#standardId').val()==undefined){
	//			showMessage(true, 'Grade is required');
	//			return false;
	//		}
	//		if($('#subjectId').val()==0 || $('#subjectId').val()==undefined){
	//			showMessage(true, 'Course is required');
	//			return false;
	//		}
	//		if($('#countryTimezoneId').val()==0 || $('#countryTimezoneId').val()==undefined){
	//			showMessage(true, 'Time-Zone is required');
	//			return false;
	//		}
	//		if($('#weekPickerId').val()==0 || $('#weekPickerId').val()==undefined){
	//			showMessage(true, 'Meeting week is required');
	//			return false;
	//		}
	//		if($('#meetingDate').val()=='' || $('#meetingDate').val()==undefined){
	//			showMessage(true, 'Meeting Date is required');
	//			return false;
	//		}
	//		if($('#startTime').val()=='' || $('#startTime').val()==undefined){
	//			showMessage(true, 'Start Time is required');
	//			return false;
	//		}
	//		if($('#timeInterval').val()==0 || $('#timeInterval').val()==undefined){
	//			showMessage(true, 'Time Interval is required');
	//			return false;
	//		}
	////		var selDate=$('#meetingDate').val().split('-');
	////	    var selTime = $('#startTime').val().split(':');
	////	    var selectedDate = new Date(selDate[2],selDate[0]-1,selDate[1], selTime[0],selTime[1]);
	////	    var currentDate=new Date();
	////	    //var currentDate = new Date(curDate.getFullYear(), curDate.getMonth(), curDate.getDate())
	////	    console.log('selectedDate=>'+selectedDate.getTime()+' currentDate=>'+currentDate.getTime())
	////	    if(selectedDate.getTime()<=currentDate.getTime()){
	////	    	showMessage(true, 'Please create future meeting slots');
	////	    	return false;
	////	    }
	//	}else
			if(controllType=='UPDATE'){
			if($('#meetingResult').val()=='' || $('#meetingResult').val()==undefined){
				showMessage(true, 'Session Status is required');
				return false;
			}
		}else if(controllType=='ADDURL'){
			if($('#meetingUrl').val()=='' || $('#meetingUrl').val()==undefined){
				showMessage(true, 'Class Link is required');
				return false;
			}
		}
		return true;
	}


function meetingResultModal(meetingId, userId,meetingresult, meetingCurStatus, role){
	$('#updateMeetingResultModal').modal('show');
	$('#updateMeetingResultForm #userId').val(userId);
	$('#updateMeetingResultForm #meetingId').val(meetingId);
	$('#updateMeetingResultForm #meetingCurStatus').val(meetingCurStatus);

	html='<option value="" selected>Select Status</option>';
	
	html+='<option value="Reschedule Session">Reschedule Class</option>';
	html+='<option value="Missed by Student">Missed by Student</option>';
	if('TEACHER'==role){
	}else{
		html+='<option value="Missed by Teacher">Missed by Teacher</option>';
	}
	html+='<option value="Completed">Completed</option>'
	
	$('#updateMeetingResultForm #meetingResult').html(html);
//	$('#updateMeetingResultForm #meetingResult option:selected').val(meetingresult);
	if(meetingresult==''){
		if($('#updateMeetingResultForm #meetingResult option:selected').val().trim()==''){
		}else{
			$('#updateMeetingResultForm #meetingResult').val($('#updateMeetingResultForm #meetingResult option:selected').text());
		}
	}else{
		$('#updateMeetingResultForm #meetingResult').val(meetingresult);
	}
}

function meetingUrlModalTeacher(meetingId,userId,meetingUrl,mailSendStatus,urlRemarks){
	if(meetingUrl=='N/A'){
		meetingUrl=''
	}
	if(mailSendStatus=='N/A'){
		mailSendStatus='N'
	}
	if(urlRemarks=='N/A'){
		urlRemarks=''
	}
	$('#meetingUrlForm #meetingUrl').attr('disabled', false);
	$('#meetingUrlForm #remarks').attr('disabled', false);
	$('#meetingUrlForm #saveMeetingUrl').show();
	$('#meetingUrlForm #note').show();

	$('#meetingUrlModal').modal('show');
	$('#meetingUrlForm #meetingId').val(meetingId);
	$('#meetingUrlForm #userId').val(userId);
	$('#meetingUrlForm #meetingUrl').val(meetingUrl);
	$('#meetingUrlForm #mailSendStatus').val(mailSendStatus);
	$('#meetingUrlForm #remarks').val(urlRemarks);
	if(mailSendStatus=='Y' || meetingUrl !=''){
		$('#meetingUrlForm #meetingUrl').attr('disabled', true);
		$('#meetingUrlForm #remarks').attr('disabled', true);
		$('#meetingUrlForm #saveMeetingUrl').hide();
		$('#meetingUrlForm #note').hide();
	}
}


function submitRequestDemoMeetingSlots(formId,moduleId,controllType, meetingId,requestType, roleModuleId,userId) {
	hideMessage('');
	console.log("submitRequestDemoMeetingSlots ",requestType);
	if(!validateRequestDemoMeetingSlots(formId,moduleId,controllType,requestType)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('dashboard','meetingslots-submit'),
		data : JSON.stringify(getRequestForSubmitRequestDemoMeetingSlots(formId, moduleId,controllType, meetingId,requestType,userId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				if(requestType=='COUNSELORMEET'){
					if("ADD"==controllType){
						showMessage(false, data['message']);
						$('#meetingSlotsModal').modal('toggle');
						$('#'+formId)[0].reset();
						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'counselor-meet-slot','','?moduleId='+roleModuleId+'&requestType='+requestType); }, 1000);
					}else if("EDIT"==controllType){
						showMessage(false, data['message']);
						$('#'+formId)[0].reset();
						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'counselor-meet-slot','','?moduleId='+roleModuleId+'&requestType='+requestType); }, 1000);
					}
				}else if(requestType=='REQUESTDEMO'){
					if("ADD"==controllType){
						showMessage(false, data['message']);
						$('#meetingSlotsModal').modal('toggle');
						$('#'+formId)[0].reset();
						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'student-meet-slot','','?moduleId='+roleModuleId+'&requestType='+requestType); }, 1000);
					}else if("EDIT"==controllType){
						showMessage(false, data['message']);
						$('#'+formId)[0].reset();
						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'student-meet-slot','','?moduleId='+roleModuleId+'&requestType='+requestType); }, 1000);
					}
				}else if(requestType=='CONNECTMEET'){
					if("ADD"==controllType){
						showMessage(false, data['message']);
						$('#meetingSlotsModal').modal('toggle');
						$('#'+formId)[0].reset();
						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'Connect-to-impact-slot','','?moduleId='+roleModuleId+'&requestType='+requestType); }, 1000);
					}else if("EDIT"==controllType){
						showMessage(false, data['message']);
						$('#'+formId)[0].reset();
						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'Connect-to-impact-slot','','?moduleId='+roleModuleId+'&requestType='+requestType); }, 1000);
					}
				}else{
					if("EDIT"==controllType){
						if(tt=='theme1'){
							showMessage(false, data['message']);
						}else{
							showMessageTheme2(0, data['message'],'',true);
						}
						// if($('#'+formId).length>0){
						// 	$('#'+formId)[0].reset();
						// }
						$('#classrommTr'+meetingId).remove();
						//setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'create-manage-sessions','',''); }, 1000);
					}
				}
			}
			return false;
		},
		error : function(e) {
			showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForSubmitRequestDemoMeetingSlots(formId,moduleId, controllType,meetingId,requestType,userId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var meetingSlotDTO = {};
	if("ADD"==controllType){
		meetingSlotDTO['meetingType'] = requestType;
		var meetDate = $("#"+formId+" #meetingDate").val();
		meetDate = meetDate.split("-");
		meetingDate = meetDate[2]+"-"+meetDate[0]+"-"+meetDate[1];
		meetingSlotDTO['meetingDate'] = meetingDate;
		var startTime = $("#"+formId+" #startTime").val();
		var interval = $("#"+formId+" #timeInterval option:selected").val();
		meetingSlotDTO['startTime'] = startTime;

		var endTime= new Date("2016/09/12 "+startTime+":00");
		endTime.setMinutes(endTime.getMinutes() + parseInt(interval));
		endTime = endTime.getHours()+":"+endTime.getMinutes();

		meetingSlotDTO['endTime'] = endTime;
		meetingSlotDTO['subject'] = requestType;
		meetingSlotDTO['status'] = "0";
		meetingSlotDTO['controllType'] = controllType;
	}else if("EDIT"==controllType){
		meetingSlotDTO['meetingType'] = requestType;
		meetingSlotDTO['meetingId'] = meetingId;
		meetingSlotDTO['controllType'] = controllType;
	}
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = userId;//$("#teacherMeetingSlotsForm #userId").val();
	request['authentication'] = authentication;
	request['meetingSlotDTO'] = meetingSlotDTO;
	return request;
}

function advanceClassroomSearchReset(formId){
	$('#' + formId)[0].reset();
}





$('#classDuration').val('50');
$('#bufferTime').val('10');
$("#countryTimezoneFromId").select2();
$("#meetingDate").datepicker("destroy");
$("#meetingDate").datepicker({
	autoclose: true,
	format: 'M dd, yyyy',
});
$("#meetingType").on("change", function(){
	var mt= $(this).val();
	if(mt == 'ODM'){
		$(".hide-on-odm").hide();
		$(".hide-on-rm, #meetingTypeNote").show();
		
		
	}else{
		$(".hide-on-odm").show();
		$(".hide-on-rm, #meetingTypeNote").hide();
		
	}

});
$(document).ready(function() {
	
	$(".meetingSlotAdd").hide();
	$(".hide-on-odm").show();
	$(".hide-on-rm").hide();
	role='${USER_ROLE}';
	if('${USER_ROLE}'=='TEACHER'){
		role='STUDENT';
	}
});


$(".blur-check-btn").blur(function(){

})

function createClassButtonHide(){
	$(".create-class-btn").hide()
}


function booksclassOutsideAvailabilityConfirmationModal(flag,formId, moduleId){
	var studentAName = $("#studentName option:selected").text().split(" (")[0];
	var courseName = $("#subjectIds option:selected").text().split(" (")[0];
	var meetingDateTime = $("#meetingDate").val();
	var hour = $("#startTimeHours").val();
	var mins = $("#startTimeMins").val();
	var amPm = " AM"
	
	var meetingFor = $("#meetingType").val();
	if(hour >= 12){
		if(hour != 12){
			hour = hour-12;
		}
		amPm = " PM"
	}
	meetingDateTime = meetingDateTime+" at "+hour+":"+mins
	$("#booksclassOutsideAvailabilityConfirmationModal").modal("show");
	// var needToAddTimePref = $("#needToAddTimePreferrence").val();
	// var saveForcefully = $("#saveForcefully").val();
	// if(needToAddTimePref=='true'){
	// 	$("#confirmationBookClassBtn").hide();
	// }else{
	// 	$("#confirmationBookClassBtn").show();
	// }
	//$("#confirmationBookClassBtn").show();
	// if(saveForcefully=='Y' || meetingFor=='ODM' || meetingFor=='PTM' || meetingFor=='CUSTOM'){
	// 	$("#confirmationBookClassBtn").show();
	// }
	$("#confirmationBookClassBtn").show();
	if(studentAName != undefined && studentAName != "" ){
		$("#studentBatchName").text(studentAName);
	}else{
		studentAName = $("#studentName").val();
		if(studentAName != undefined && studentAName != "" ){
			$("#studentBatchName").text(studentAName);
		}
	}
	if(courseName != undefined && courseName != "" ){
		$("#courseActivity").text(courseName);
	}
	if(meetingDateTime != undefined && meetingDateTime != "" ){
		if(flag != "hide-on-odm"){
			$("#meetingDateTime").text(" for "+meetingDateTime+amPm);
		}
	}
	var fun;
	if(flag == "hide-on-odm"){
		fun = "submitRecurringClassWarning('"+formId+"','"+moduleId+"')";
		$("#confirmationBookClassBtn").attr("onclick", fun);
	}else{
		fun = "meetingSlotModalForScheduleClass('"+formId+"','"+moduleId+"')";
		$("#confirmationBookClassBtn").attr("onclick", fun);
	}
}

function resetRecurring(formId,moduleId){
	var meetingValue = $('#'+formId+ ' #meetingType').val();
	var meetingFor = $('#'+formId+ ' #meetingFor').val();
	$('#'+formId)[0].reset();
	if(tt != "theme2"){
		$('#'+formId+ ' #meetingType').val(meetingValue).trigger('change');
	}else{
		$('#'+formId+ ' #meetingFor').val(meetingFor).trigger('change');
	}
	if(meetingValue == "CUSTOM"){
		$("#customTeacherDropDown").show();
		$("#selectTeacher").hide();
	}else{
		$("#teacherId").html("");	
	}
	$("#studentName").html("");
	// $('#'+formId+ ' #countryTimezoneFromId').val('').trigger("change");
	$('#'+formId+' #joiningLink').prop('readonly',true);
	$('#'+formId+ ' #startFromTime').select2('val', ' ');
	$('#'+formId+ ' .scheduleTime').select2('val', ' ');
	$('#'+formId+ ' .scheduleTime option').each(function() {
		$(this).prop('disabled', false);		
	});	
	$('#'+formId+ ' #subjectIds').html("");
	$('#'+formId+ ' #standardId').val("").trigger("change");
	$('#'+formId+ ' #studentName').val("").trigger("change");
	$('#'+formId+ ' #meetingDate').val("").datepicker("update");
	$("#timeSlotSession .select2-search__field").css({"width":"100%"});
	
	// $("#"+formId+" #batchId").html('');
}

