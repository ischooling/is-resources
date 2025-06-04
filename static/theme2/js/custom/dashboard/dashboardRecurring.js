function validateRequestForRecurringClass(formId){
	var meetingType = $("#" +formId+" #meetingType").val();
	if(formId!='classroomSessionFilter'){
		if(meetingType!="CUSTOM"){
			if($("#" + formId + " #studentId").val()==undefined || $("#" + formId + " #studentId").val()==''){
				showMessage(true, "Search student using email or name");
				return false;
			}
			if($("#" + formId + " #subjectIds").val()==undefined || $("#" + formId + " #subjectIds").val()==''){
				showMessage(true, "Course is required.");
				return false;
			}
			if($("#" + formId + " #teacherId").val()==undefined || $("#" + formId + " #teacherId").val()==''){
				showMessage(true, "Teacher is required.");
				return false;
			}
		
			if($("#" + formId + " #recurringType").val()==undefined || $("#" + formId + " #recurringType").val()==''){
				showMessage(true, "CLass Type is required.");
				return false;
			}
		}

		if($("#" + formId + " #meetingVendor").val()==undefined || $("#" + formId + " #meetingVendor").val()==''){
			showMessage(true, "Meeting Vendor is required.");
			return false;
		}
		if($("#" + formId + " #meetingVendor").val()=='External'){
			if($("#" + formId + " #joiningLink").val()==undefined || $("#" + formId + " #joiningLink").val()==''){
				showMessage(true, "Joining Link is required.");
				return false;
			}
		}
	}
	var formIdNew=formId;
	if(formId=='classroomSessionFilter'){
		var meetingType = $('#classroomSessionFilter #meetingFor').val();
		if(meetingType == "ODM" || meetingType == "RM"){
			meetingType = "STUDENT_DOUBT_SESSION";
		}
		if(meetingType=='STUDENT_DOUBT_SESSION'){
			var sName = $('#classroomSessionFilter #studentName').val();
			var cName = $('#classroomSessionFilter #subjectIds').val();
			var stndard = $('#classroomSessionFilter #standardId').val();
			if(stndard=='' || stndard==0){
				showMessageTheme2(0, "Grade field is required");
				return false;
			}
			if(sName=='' || sName==0 || sName==null || sName==undefined){
				showMessageTheme2(0, "Student Name required");
				return false;
			}
			if(cName=='' || cName==0 || cName==null || cName==undefined){
				showMessageTheme2(0, "Course Name required");
				return false;
			}
		}
		
		//formId='recurringClass'
	}
	if($("#" + formId + " #startFromTime").val()==undefined || $("#" + formId + " #startFromTime").val()==''){
		showMessageTheme2(0, "Start From Time is required");
		return false;
	}
	if($("#" + formId + " #countryTimezoneFromId").val()==undefined || $("#" + formId + " #countryTimezoneFromId").val()==''){
		if(USER_ROLE!='TEACHER'){
			showMessage(true, "TimeZone is required.");
		}else{
			showMessageTheme2(0, "TimeZone is required.");
		}
		return false;
	}
	if($("#" + formId + " #classDuration").val()==undefined || $("#" + formId + " #classDuration").val()=='00'){
		if(USER_ROLE!='TEACHER'){
			showMessage(true, "Classroom Duration is required.");
		}else{
			showMessageTheme2(0, "Classroom Duration is required.");
		}
		
		return false;
	}
	if($("#" + formId + " #bufferTime").val()==undefined || $("#" + formId + " #bufferTime").val()=='00'){
		if(USER_ROLE!='TEACHER'){
			showMessage(true, "Buffer Time Duration is required.");
		}else{
			showMessageTheme2(0, "Buffer Time Duration is required.");
		}
		
		return false;
	}
	if($("#" + formId + " #classStartDate").val()==undefined || $("#" + formId + " #classStartDate").val()==''){
		if(USER_ROLE!='TEACHER'){
			showMessage(true, "Start Date is required.");
		}else{
			showMessageTheme2(0, "Start Date is required.");
		}
		
		return false;
	}
	if($("#" + formId + " #classEndDate").val()==undefined || $("#" + formId + " #classEndDate").val()==''){
		if(USER_ROLE!='TEACHER'){
			showMessage(true, "End Date is required.");
		}else{
			showMessageTheme2(0, "End Date is required.");
		}
		
		return false;
	}
	var validTimeSlot=true;
	//formId='recurringClass';
	var i=1;
	var uncheckCount=0;
	if($(".teachDays").html()==undefined){
		getSplitTime(formId);
	}
	$(".teachDays").each(function(){
		if(this.checked){
			if($("#" + formId + " #scheduleTime"+i+"").val()==''){
				validTimeSlot=false;
			}
		}else if($("#" + formId + " #scheduleTime"+i+"").val()!=''){
			validTimeSlot=false;
			uncheckCount++;
		}else{
			uncheckCount++;
		}
		i++;
	});
	if(!validTimeSlot || uncheckCount==7){
		if(USER_ROLE!='TEACHER'){
			showMessage(true, "Please select both day and time.");
		}else{
			showMessageTheme2(0, "Please select both day and time.");
		}
		
		return false;
	}
	if(formIdNew=='classroomSessionFilter'){
		formId='classroomSessionFilter';
	}
	return true;
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

function submitRecurringClassWarning(formId,moduleId){
	$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
	var message;
	if(formId=='classroomSessionFilter'){
		message='Are you sure you want to create recurring classes for '
		+$('#studentName option:selected').text().split(" (")[0]+' of '+$('#standardId option:selected').text()
		+' for '+$('#subjectIds option:selected').text()
		+'? Please note that all the classes will be created in about 30 mins from the time of saving.';
	}else{
		message='Are you sure you want to create recurring classes for '
		+$('#studentName').val()+' of '+$('#gradeName').val()
		+' and '+$('#teacherId option:selected').text().split(" (")[0]
		+' for '+$('#subjectIds option:selected').text()
		+'? Please note that all the classes will be created in about 30 mins from the time of saving.';
	}
	return sendRecurringWarning(message, 'submitRecurringClass(\''+formId+'\',\''+moduleId+'\')');
}

function submitRecurringClass(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForRecurringClass(formId)){
		return false;
	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'recurring-class-submit'),
		data : JSON.stringify(getRequestForRecurringClass(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(USER_ROLE!='TEACHER'){
					showMessage(true, data['message']);
				}else{
					showMessageTheme2(0, data['message']);
				}
			} else {
				$('#'+formId+ ' #studentId').val('').trigger("change");
				$('#'+formId)[0].reset();
				if(USER_ROLE!='TEACHER'){
					showMessage(false, data['message']);
				}else{
					showMessageTheme2(1, data['message']);
				}
				if(formId=='classroomSessionFilter'){
					window.setTimeout(function(){callDashboardPageSchool(155,'schedule-a-session');},1000)
				}else{

					window.setTimeout(function(){callDashboardPageSchool(moduleId,'recurring-class-list')},1000)
				}
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForRecurringClass(formId) {
	var recurringClassRequest = {};
	var authentication = {};
	var recurringClassDTO = {};

    recurringClassDTO['userId'] =$("#userId").val();
    recurringClassDTO['schoolId'] = SCHOOL_ID;
	if(formId=='recurringClass'){
		recurringClassDTO['paymentCheck'] = $("#" + formId + " #paymentCheck").val();
		// recurringClassDTO['enrollType'] = $("#" + formId + " #enrollType").val();
		// recurringClassDTO['courseProIds'] = $("#" + formId + " #lmsPlatform").val();
		// recurringClassDTO['standardIds'] = $("#" + formId + " #standardId").val();
		// recurringClassDTO['batchIds'] = $("#" + formId + " #batchId").val();
		recurringClassDTO['studUserId'] = $("#" + formId + " #studentId").val();
		recurringClassDTO['subjectIds'] = $("#" + formId + " #subjectIds").val();
		recurringClassDTO['teachUserId'] = $("#" + formId + " #teacherId").val();
		recurringClassDTO['recurringType'] = $("#" + formId + " #recurringType").val();
		recurringClassDTO['meetingVendor'] = $("#" + formId + " #meetingVendor").val();
		recurringClassDTO['joiningLink'] = $("#" + formId + " #joiningLink").val();
		recurringClassDTO['showLinkBefore'] = $("#" + formId + " #showLinkBefore").val();

	}else{
		recurringClassDTO['studentStandardId'] = $('#classroomSessionFilter #studentName option:selected').attr('data-studentStandardId');
		recurringClassDTO['studUserId'] = $('#classroomSessionFilter #studentName option:selected').attr('data-studentid');
		recurringClassDTO['subjectIds'] = $("#classroomSessionFilter #subjectIds").val();
		recurringClassDTO['teachUserId'] = $("#userId").val();
		recurringClassDTO['meetingVendor'] = "LENS";
		recurringClassDTO['recurringType'] ="Complement";
		recurringClassDTO['showLinkBefore'] ="30";
		//formId='recurringClass';
	}
	
	var classStartDate =getDateInDateFormat($("#"+formId+" #classStartDate").val());
	recurringClassDTO['startDate'] = changeDateFormat(classStartDate, 'mm-dd-yyyy');
	var classEndDate =getDateInDateFormat($("#"+formId+" #classEndDate").val());
	recurringClassDTO['endDate'] = changeDateFormat(classEndDate, 'mm-dd-yyyy');
	
	recurringClassDTO['timezoneId'] = $("#" + formId + " #countryTimezoneFromId").val();
	recurringClassDTO['studentTimezoneId'] = $("#" + formId + " #studentTimezoneId").val();
	recurringClassDTO['classDuration'] = $("#" + formId + " #classDuration").val();
	recurringClassDTO['buffertime'] = $("#" + formId + " #bufferTime").val();


	var scheduleTime=[];
	var i=1;
	var strTimeDay;
	var dayId;
	$(".teachDays").each(function(){
		if(this.checked){
			strTimeDay=$("#" + formId + " #scheduleTime"+i+"").val();
			dayId=$("#" + formId + " #teachDays"+i+"").val()
			$.each(strTimeDay,function(key,value){
				scheduleTime.push(value+"-"+dayId);
			});
			console.log(scheduleTime);
		}
		i=i+1;
	});
	
	recurringClassDTO['scheduleTime']=scheduleTime;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId']=$('#userId').val();
	authentication['sessionUserId']=USER_ID;
	recurringClassRequest['authentication'] = authentication;
	recurringClassRequest['recurringClassDTO'] = recurringClassDTO;

    return recurringClassRequest;
}


function callSubjectNameByStudent(formId, value) {
	if(value==''){
		return false;
	}
	// if($("#" + formId + " #classDuration").val()==undefined || $("#" + formId + " #classDuration").val()=='00'){
	// 	showMessage(true, "Classroom Duration is required.");
	// 	return false;
	// }
	// if($("#" + formId + " #bufferTime").val()==undefined || $("#" + formId + " #bufferTime").val()=='00'){
	// 	showMessage(true, "Buffer Time Duration is required.");
	// 	return false;
	// }
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','SUBJECT-BY-STUDENT',value)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$("#"+formId+" #teacherId").empty();
				var result = data['mastersData']['courseList'];
				var dropdown = $("#"+formId+" #subjectIds");
				dropdown.html('');
				dropdown.append('<option value="">Select</option>');
				$.each(result, function(k, v) {
					dropdown.append('<option value="' + v.key + '">'
							+ v.value + ' </option>');
				});
			}
		}
	});
}
var daysCount;
var startDaysCount;
function callTeacherBySubject(formId, value, studentId, meetingType, studentEmail) {
	if(value==''){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster(formId,'TEACHER-BY-SUBJECT',value, studentId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				
				var result = data['mastersData']['data'];
				if(meetingType != "CUSTOM" || studentEmail != '' ){
					var dropdown = $("#"+formId+" #teacherId");
				}else{
					var dropdown = $("#"+formId+" #customTeacherId");
				}
				dropdown.html('');
				dropdown.append('<option value="">Select</option>');
				var userTimezone='';
				var coursesEndDate='';
				var teacherId='';
				var meetingVendor='';
				daysCount = 15;
				startDaysCount=15;
				$.each(result, function(k, v) {
					dropdown.append('<option value="' + v.key + '">'+ v.value + ' ('+ v.extra +') </option>');
					userTimezone=v.extra2;
					coursesEndDate=v.extra1;
					teacherId=v.key;
					meetingVendor=v.extra3;
					daysCount = v.extra4
					startDaysCount=v.extra5;
				});
				if(formId!='classroomSessionFilter'){
					if($("#"+formId+" #countryTimezoneFromId").length>0){
						$("#"+formId+" #countryTimezoneFromId").val(userTimezone).trigger('change');
					}
				}
				$("#"+formId+" #teacherId").val(teacherId);
				if(meetingVendor!=undefined && meetingVendor!=''){
					$("#"+formId+" #meetingVendor").val(meetingVendor);
					$("#"+formId+" #meetingVendor").prop('disabled',true);
				}else{
					$("#"+formId+" #meetingVendor").val('');
					$("#"+formId+" #meetingVendor").prop('disabled',false);
				}
				
				console.log('coursesEndDate '+coursesEndDate);
				if(coursesEndDate==''){
					coursesEndDate = new Date();
					startDate.setMonth(startDate.getMonth() + 10);
				}else{
					coursesEndDate = new Date(coursesEndDate);
				}
				console.log('coursesEndDate '+coursesEndDate);
				$("#"+formId+" #classStartDate").val('');
				var startMaxDate = new Date();
				startMaxDate.setDate(startMaxDate.getDate() + parseInt(startDaysCount));
				
				if(USER_ROLE == "TEACHER"){
					initiateRecurringDateStart(formId,'classStartDate','classEndDate',coursesEndDate, startMaxDate);
				}else{
					$("#"+formId+" #classEndDate").val(changeDateFormat(coursesEndDate, 'MMM-dd-yyyy'));
					initiateRecurringDateStart(formId,'classStartDate','classEndDate',coursesEndDate,'');
				}
				initiateRecurringDateEnd(formId,'classStartDate','classEndDate',coursesEndDate);
			}
		}
	});
}

function initiateRecurringDateStart(formId, fromElementId, toElementId,coursesEndDate, startMaxDate){
	var minDateToday = new Date();
	var minDate = minDateToday
	// minDate.setDate(minDate.getDate() + 1)
	// minDate.setMonth(minDate.getMonth() - 5);
	console.log('initiateRecurringDateStart minDate: '+minDate);
	console.log('initiateRecurringDateStart coursesEndDate: '+coursesEndDate);
	// $('#'+formId+' #'+fromElementId).datepicker('destroy');
	if($('#'+formId+' #'+fromElementId).data('datepicker')){
		$('#'+formId+' #'+fromElementId).datepicker('setStartDate', minDate);
		$('#'+formId+' #'+fromElementId).datepicker('setEndDate', coursesEndDate);
	}else{
		$('#'+formId+' #'+fromElementId).datepicker({
			autoclose : true,
			format: 'M dd, yyyy',
			startDate: minDate,
			endDate: startMaxDate,
		}).on("changeDate",function(selected){
			$("#timeSlotSession").show();
			console.log('initiateRecurringDateStart : '+new Date(selected.date.valueOf()));
			var startDate = selected.date;
			var endDate = new Date(startDate);
			endDate.setDate(endDate.getDate() + parseInt(daysCount));
			if(endDate.valueOf() > coursesEndDate.valueOf() ){
				endDate = new Date(coursesEndDate);
			}
			if(USER_ROLE == "TEACHER"){
				$('#'+formId+' #'+toElementId).val(changeDateFormat(endDate, 'MMM-dd-yyyy'))
			}
			// console.log("End Date is===>"+endDate);
			getSplitTime(formId);
			if(USER_ROLE == "TEACHER"){
				initiateRecurringDateEnd(formId, fromElementId, toElementId,endDate);
			}else{
				initiateRecurringDateEnd(formId, fromElementId, toElementId,coursesEndDate);
			}
			checkUpdates();
		});

	}
}

function initiateRecurringDateEnd(formId, fromElementId, toElementId,coursesEndDate){
	var minDate = $('#'+formId+' #'+fromElementId).val();
	
	console.log('initiateRecurringDateEnd minDate: '+minDate);
	if(minDate!=''){
		minDate = new Date(minDate);
	}else{
		minDate = new Date();
		// minDate.setMonth(minDate.getMonth() - 5);
	}
	if(USER_ROLE != "TEACHER"){
		if($('#'+formId+' #'+toElementId).val()!=undefined && $('#'+formId+' #'+toElementId).val()!=''){
			coursesEndDate = $('#'+formId+' #'+toElementId).val();
		}
	}
	console.log('initiateRecurringDateEnd minDate: '+minDate);
	console.log('initiateRecurringDateEnd coursesEndDate: '+coursesEndDate);
	// $('#'+formId+' #'+toElementId).datepicker('destroy');
	var checkDateSelected = false;
	if($('#'+formId+' #'+toElementId).data('datepicker')){
		$('#'+formId+' #'+toElementId).datepicker('setStartDate', minDate);
		$('#'+formId+' #'+toElementId).datepicker('setEndDate', coursesEndDate);
		if(USER_ROLE == "TEACHER"){
			$('#'+formId+' #'+toElementId).val("").datepicker('update');
		}
	}else{
		$('#'+formId+' #'+toElementId).datepicker({
			autoclose : true,
			format: 'M dd, yyyy',
			todayHighlight : true,
			startDate: minDate,
			endDate: coursesEndDate,
		}).on("changeDate",function(selected){
			checkDateSelected = true;
			getSplitTime(formId);
			checkUpdates();
		}).on("hide",function(selected){
			if(!checkDateSelected){
				if(USER_ROLE != "TEACHER"){
					$('#'+formId+' #'+toElementId).val(changeDateFormat(coursesEndDate, 'MMM-dd-yyyy'));
				}
			}
		});
	}
}

function parseTime(timeStr) {
	var parts = timeStr.split(':');
	var date = new Date();
	date.setHours(parseInt(parts[0], 10));
	date.setMinutes(parseInt(parts[1], 10));
	return date;
}

function overlapExists(selectedTimes, optionStartTime, optionEndTime) {
	return selectedTimes.some(function(selected) {
		var selectedParts = selected.split('-');
		var selectedStartTime = parseTime(selectedParts[0]);
		var selectedEndTime = parseTime(selectedParts[1]);
		if (selectedEndTime < selectedStartTime) {
			selectedEndTime.setDate(selectedEndTime.getDate() + 1);
		}
		return (selectedStartTime < optionEndTime && selectedEndTime > optionStartTime);
	});
}


function callTimeSlotByStartTime(formId, startTime,endTime, intervalTime, bufferTime, startFromTime, endDate, teacherTimezoneId) {
	if(startTime==''){
		return false;
	}
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster(formId,'SPLIT-TIMESLOT-BY-STARTTIME',startTime,endTime, intervalTime, bufferTime, startFromTime,endDate, teacherTimezoneId)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['timeTableList'];
					var htmlTime="";
					var days = [];
					days.push('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
					$.each(days, function(i, day) {
						i=i+1;
						htmlTime = htmlTime + " <div class=\"col-md-4 col-sm-4 col-xs-12 mb-1 recurring-mapping-set-time-item\">";
						htmlTime = htmlTime + " <div style=\"display:flex;align-items:center;justify-content:space-between;border: 1px solid #e3e3e3; padding: 0 5px\"> ";
						htmlTime = htmlTime + " <span><input type=\"checkbox\" class=\"teachDays\" style=\"position:relative;top:2px;\" name=\"teachDays1\" value=\""+i+"\" data-batchid=\"0\" id=\"teachDays"+i+"\" onchange='checkUpdates()'> ";
						htmlTime = htmlTime + " <label>"+day+"</label></span> ";
						htmlTime = htmlTime + " <span style=\"width:220px;display:inline-block\"><select name=\"scheduleTime\" class=\"scheduleTime form-control time-selec2\" multiple=\"multiple\" id=\"scheduleTime"+i+"\" onchange='checkUpdates()'> ";
						$.each(result, function(k, v) {
							htmlTime = htmlTime + " <option value="+v.startTime+"-"+v.endTime+">"+v.startTime+" - "+v.endTime+"</option>";
						});
						htmlTime = htmlTime + " </select></span></div></div> ";	
					});
					$("#timeSlotSession").html(htmlTime);
					var select2ThemeType = '';
					if(tt!='theme1'){
						select2ThemeType='bootstrap4';
					}else{
						select2ThemeType=undefined;
					}
					$(".scheduleTime").select2({
						placeholder: "Select Time",
						theme:select2ThemeType
					}).on('select2:select select2:unselect', function(e) {
						var selectedTimes = $(this).val() || [];
						
						$('#' + this.id + ' option').each(function() {
							var optionParts = $(this).val().split('-');
							var optionStartTime = parseTime(optionParts[0]);
							var optionEndTime = parseTime(optionParts[1]);
							if (optionEndTime < optionStartTime) {
								optionEndTime.setDate(optionEndTime.getDate() + 1);
							}
							if (overlapExists(selectedTimes, optionStartTime, optionEndTime)) {
								$(this).prop('disabled', true);
							} else {
								$(this).prop('disabled', false);
							}
						});
						// Re-enable already selected options
						selectedTimes.forEach(function(selected) {
							$('#' + e.target.id + ' option[value="' + selected + '"]').prop('disabled', false);
						});
					});
				}
			}
		});
}
// onchange=\"dropdownTeachertimeSlot('"+formId+"','"+i+"')\"

function dropdownTeachertimeSlot(formId, dropdownId){
	var  scheduleTime = $("#scheduleTime"+dropdownId).val();
	var teachDays = $("#teachDays"+dropdownId).val();

	var startDate = $("#"+formId+" #classStartDate").val();
	if(startDate==''){
		showMessage(false, "Please select start date");
		return false;
	}
	var endDate = $("#"+formId+" #classEndDate").val();
	if(endDate==''){
		showMessage(false, "Please select end date");
		return false;
	}
	var teacherId = $("#"+formId+" #teacherId").val();
	if(teacherId==''){
		showMessage(false, "Please select teacher");
		return false;
	}

	checkTimeSlotByTeacher(formId, teacherId, startDate, endDate, (scheduleTime+"-"+teachDays), dropdownId);
	
}

function checkTimeSlotByTeacher(formId, value, startDate, endDate, timeSlot, dropdownId) {
	if(value==''){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster(formId,'AVAILABLE-TEACHER-TIME-SLOT',value,startDate, endDate, timeSlot)),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
				return false;
			} else {
				var result = data['mastersData']['teacherTimeAvaile'];
				if(result===false){
					showMessage(true, "your time already book");
					$("#scheduleTime"+dropdownId).val('');
					return false;
				}
			}
		}
	});
}


function sendRecurringWarning(message, functionName){
	$('#resetDeleteErrorWarningYes1').show();
	$('#resetDeleteErrorWarningNo1').show();
	$('#resetDeleteErrorWarningCancel1').hide();
	$('#remarksresetDelete1Icon').removeAttr('class');
	$('#remarksresetDelete1Icon').attr('class','fa fa-ban fa-4x');
	functionName = "$('#remarksresetDelete1').modal('hide');"+functionName+";";
    $('#warningMessage1').html(message);
	$('#resetDeleteErrorWarningYes1').attr('onclick',functionName);
	$('#remarksresetDelete1').modal('show');
}

function updateRecurring(userId,recurringClassId,controllType,moduleId,rowID) {
	hideMessage('');
	var data={};
	data['controllType']=controllType;
	data['recurringClassId']=recurringClassId;
	data['schoolId']=SCHOOL_ID;
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','recurring-update'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				
				var table = $('#recurringClasses').DataTable();
                table.row($("#"+rowID)).remove().draw();
				// setTimeout(function (){callDashboardPageSchool(moduleId,'recurring-class-list');},1000);
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

var recruringMappingSetTime = [];
var updatedRecruringMappingSetTime = [];

const callRecurringShowDebounce = debouncing(callRecurringShow, 300)

function getDaysDifference(date1, date2) {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

function callRecurringShow(formId) {
	var meetingTypeValue = $("#meetingFor").val();
	if(meetingTypeValue==null || meetingTypeValue==undefined){
		meetingTypeValue=$("#meetingType").val()
	}
	hideMessage('');
	if(!validateRequestForRecurringClass(formId)){
		return false;
	}
	recruringMappingSetTime = [];
	
	$("#timeSlotSession .recurring-mapping-set-time-item").each(function(key){
		var teachStartDate = $("#classStartDate").val();
		var teachEndDate  = $("#classEndDate").val();
		var dayCheckValue = $("#teachDays"+(key+1)).prop("checked");
		var timeInterval = $(this).find("#scheduleTime"+(key+1)).val();
		recruringMappingSetTime.push(new Object({"startDate":teachStartDate,"endDate":teachEndDate,"dayValue":dayCheckValue,"timeInterval":timeInterval})); 
	});
	console.log(recruringMappingSetTime)
	if(JSON.stringify(updatedRecruringMappingSetTime) === JSON.stringify(recruringMappingSetTime)){
		$(".proceedRecurringClassbtn").show();
	}else{
		$(".proceedRecurringClassbtn").hide();
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','recurring-show-class'),
		data : JSON.stringify(getRequestForRecurringClass(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['message'] != null){
					showMessage(true, data['message']);
				}else{
					showMessage(true, "Recurring class range does not match the date(s) selected.");
				}
			}else {
				//showMessage(false, data['message']);
				var saveForcefully= data['extra'];
				var dateSpecificDays = data['dateSpecificDays'];
				var meetingFor = $("#meetingType").val();
				var html='';
				$("#teacherAvailabilityTable #teacherAvailabilityTbody").html(html);
				$("#availaibilityHeading").hide();
				var recurringclassForAA = data['recurringClassListForAvailability'];
				var daysDifference=0;
				if(meetingFor == "RM"){
					var classStartDate =getDateInDateFormat($("#"+formId+" #classStartDate").val());
					var classEndDate =getDateInDateFormat($("#"+formId+" #classEndDate").val());
					daysDifference = getDaysDifference(classStartDate, classEndDate);
				}
				if(recurringclassForAA.length > 0 && (meetingFor != "RM")){
					$("#teacherAvailabilityWarningTitle").html(`<h4 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h4>`);
				}else if(recurringclassForAA.length > 0 && (meetingFor == "RM") && daysDifference<=dateSpecificDays){
					$("#teacherAvailabilityWarningTitle").html(`<h4 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h4>`);
				}else{
					$("#teacherAvailabilityWarningTitle").html(``);
				}
				if(meetingFor=='RM' && saveForcefully=='N' && daysDifference>dateSpecificDays ){
					if(recurringclassForAA.length>0){
						var givenAvailabilityArray = [];
						$.each(recurringclassForAA, function(i, v) {
							var givenAvailability = v.meetingDate.split("<br/>");
							var timesArray = [];
							$.each(givenAvailability, function(index, time) {
								if (index != 0 && time.trim() !== "") { // Avoid empty values
									timesArray.push(time);
								}
							});
							givenAvailabilityArray.push({ time: timesArray });
						});
						var classTimingArray = [];
						$.each(recurringclassForAA, function(i, v) {
							var classTiming = v.teacherTime.split("<br/>");
							var ctimesArray = [];
							$.each(classTiming, function(index, time) {
								if (index != 0 && time.trim() !== "") { // Avoid empty values
									ctimesArray.push(time);
								}
							});
							classTimingArray.push({ time: ctimesArray });
						});

						$("#needToAddTimePreferrence").val(true);
						$("#teacherAvailabilityTable").show();
						$("#availaibilityHeading").show();
						for(var k=0; k < recurringclassForAA.length; k++){
							html+=`<tr class='text-danger'>
									<td>`+recurringclassForAA[k]['meetingDate']+`</td>`;
									var slotResult = findMatchingAndMissMatchingSlots(classTimingArray[k].time, givenAvailabilityArray[k].time);
									html+=`<td>`;
										$.each(slotResult, function(k,classtimingList){
											if(k == 0){
												$.each(classtimingList.Matching, function(i,machingTime){
													html+=`<span class="text-success">${machingTime}</span><br/>`;
												})
											}else{
												$.each(classtimingList.MissMatching, function(index,missMachingTime){
													html+=`<span class="text-danger">${missMachingTime}</span><br/>`;
												});
											}
										});
									html+=`</td>
									<td>`+recurringclassForAA[k]['slotAvailableReason']+`</td>
								</tr>`;
									// html+=`<td>`+recurringclassForAA[k]['teacherTime']+`</td>
						}
						$("#teacherAvailabilityTable #teacherAvailabilityTbody").html(html);
						if( meetingFor=='RM'){
							$(".proceedRecurringClassbtn").hide();
							$("#recurringClassShowModel").modal('show');
						}
					}else{
						$("#recurringClassShowModelValidation").modal('show');
						$("#recurringClassShowModel").modal('hide');
						$("#teacherAvailabilityTable").hide();
						$("#needToAddTimePreferrence").val(false);
					}
					
					if(saveForcefully=='Y' && meetingFor=='RM'){
						$("#recurringClassShowModel").modal('hide');
						$("#recurringClassShowModelValidation").modal('show');
						$(".proceedRecurringClassbtn").show();
					}
					$("#saveForcefully").val(saveForcefully);
				}else{
					$("#recurringClassShowModel").modal('hide');
					$("#recurringClassShowModelValidation").modal('show');
					$(".proceedRecurringClassbtn").show();
					$("#saveForcefully").val(saveForcefully);
				}
				var recurringclass = data['recurringClassList'];
				var htmlRecu = "";
				var inc=1;
				var validRecurringClass=true;
				for(var i=0;i<recurringclass.length;i++){
					if(recurringclass[i]['slotAvailable']!='Available'){
						htmlRecu = htmlRecu +"<tr class='text-danger'>";
					}else{
						htmlRecu = htmlRecu +"<tr>";
					}
					htmlRecu = htmlRecu +" <td>"+(inc++)+"</td>";
					// htmlRecu = htmlRecu +" <td>"+recurringclass[i]['studentName']+"</td>";
					// htmlRecu = htmlRecu +" <td>"+recurringclass[i]['subjects']+"</td>";
					// htmlRecu = htmlRecu +" <td>"+recurringclass[i]['teachName']+"</td>";
					// htmlRecu = htmlRecu +" <td>"+recurringclass[i]['studentTime']+"</td>";
					// htmlRecu = htmlRecu +" <td>"+recurringclass[i]['teacherTime']+"</td>";
					// htmlRecu = htmlRecu +" <td>"+recurringclass[i]['meetingDate']+" ("+recurringclass[i]['startTime']+" - "+recurringclass[i]['endTime']+")</td>";
					htmlRecu = htmlRecu +"<td>"
						+'<p class="mb-0">'+recurringclass[i]['studentName']+'</p>'
						+'<p class="mb-0">'+recurringclass[i]['teachName']+'</p>'
						+'<p class="mb-0">'+recurringclass[i]['subjects']+'</p>'
					+"</td>";
					htmlRecu = htmlRecu +"<td>"
						+'<p class="mb-0"><b>Teacher Timezone: </b>'+recurringclass[i]['teacherTime']+'</p>'
						+'<p class="mb-0"><b>Student Timezone: </b>'+recurringclass[i]['studentTime']+'</p>'
						+'<p class="mb-0"><b>Admin Timezone: </b>'+recurringclass[i]['meetingDate']+" ("+recurringclass[i]['startTime']+" - "+recurringclass[i]['endTime']+')</p>'
					+"</td>";
					htmlRecu = htmlRecu +" <td>"+recurringclass[i]['slotAvailable']+"</td>";
					var reason =recurringclass[i]['slotAvailableReason'];
					if(reason!=null && reason!='' && reason!='NA' && reason!=undefined){
						htmlRecu = htmlRecu +" <td>"+reason.replaceAll("~","<br>")+"</td>";
					}else{
						htmlRecu = htmlRecu +" <td>"+reason+"</td>";
					}
					htmlRecu = htmlRecu +"</tr>";
					if(recurringclass[i]['slotAvailable']!='Available'){
						validRecurringClass=false;
					}
				}
				if(validRecurringClass){
					$('.proceedRecurringClassbtn').show();
					$(".validator-message").hide()
				}else{
					$('.proceedRecurringClassbtn').hide();
					$(".validator-message").show()
				}
				$("#trRecurring").html(htmlRecu);
				if(meetingTypeValue == "ODM"){
					$("#meetingType").val("ODM");
					$(".hide-on-odm").hide();
					$(".hide-on-rm, #meetingTypeNote").show();
				}else if(meetingTypeValue == "RM"){
					$(".hide-on-odm").show();
					$(".hide-on-rm, #meetingTypeNote").hide();
				}
			}
		}
	});
}
function checkUpdates(){
	updatedRecruringMappingSetTime = [];
	if($("#timeSlotSession .recurring-mapping-set-time-item").length>0){
		$("#timeSlotSession .recurring-mapping-set-time-item").each(function(key){
			var teachStartDate = $("#classStartDate").val();
			var teachEndDate  = $("#classEndDate").val();
			var dayCheckValue = $("#teachDays"+(key+1)).prop("checked");
			var timeInterval = $(this).find("#scheduleTime"+(key+1)).val();
			updatedRecruringMappingSetTime.push(new Object({"startDate":teachStartDate,"endDate":teachEndDate,"dayValue":dayCheckValue,"timeInterval":timeInterval})); 
		});
		console.log(updatedRecruringMappingSetTime)
		if(JSON.stringify(updatedRecruringMappingSetTime) === JSON.stringify(recruringMappingSetTime)){
			// $(".proceedRecurringClassbtn").show();
		}else{
			$(".proceedRecurringClassbtn").hide();
		}
		console.log(updatedRecruringMappingSetTime)
	}
}

function getStudentDetails(formId,moduleId) {
	hideMessage('');
	var userNameOrEmail='';
	if($('#'+formId+ ' #meetingType').val() == null || $('#'+formId+ ' #meetingType').val() == undefined || $('#'+formId+ ' #meetingType').val() == ''){
		showMessage(true, 'Meeting Type Required');
		return false;
	}
	if(formId=='classroomSessionFilter'){
		userNameOrEmail = $('#'+formId+ ' #studentName option:selected').attr('data-studentemail');
	}else{
		userNameOrEmail = $('#'+formId+ ' #userNameOrEmail').val().trim();
	}
	if(userNameOrEmail==''){
		return false;
	}
	var data={};
          data['userNameOrEmail']=userNameOrEmail;
          data['schoolId']=SCHOOL_ID;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-student-for-recurring'),
		dataType : 'json',
		data : JSON.stringify(data),
		success : function(data) {
			if(formId!='classroomSessionFilter'){
				$('#'+formId+ ' #studentId').val('');
				$('#'+formId+ ' #studentName').val('');
				$('#'+formId+ ' #subjectIds').html('');
				$('#'+formId+ ' #teacherId').html('');
				$('#'+formId+ ' #studentStandardId').html('');
			}
			if (data['status'] == '0' || data['status'] == '2') {
				if(formId=='classroomSessionFilter'){
					showMessageTheme2(0, data['message']);
				}else{
					showMessage(true, data['message']);
				}
				customLoader(false);
			} else {
				var userData = data['userData'];
				if(formId!='classroomSessionFilter'){
					$('#'+formId+ ' #studentId').val(userData['userId']);
					$('#'+formId+ ' #studentName').val(userData['studentName']);
					$('#'+formId+ ' #studentTimezone').val(userData['countryTimezone']);
					$('#'+formId+ ' #studentTimezoneId').val(userData['studentTimezoneId']);
					$('#'+formId+ ' #learningProgram').val(userData['registrationType']);
					$('#'+formId+ ' #gradeName').val(userData['gradeName']);
					$('#'+formId+ ' #studentStandardId').val(userData['studentStandardId']);
					if(userData['meetingVendor']!=undefined && userData['meetingVendor']!=''){
						$("#"+formId+" #meetingVendor").val(userData['meetingVendor']);
						$("#"+formId+" #meetingVendor").prop('disabled',true);
					}else{
						$("#"+formId+" #meetingVendor").val('');
						$("#"+formId+" #meetingVendor").prop('disabled',false);
					}
				} 	
				callSubjectNameByStudent(formId, userData['userId']);
				$("#selectTeacher").show();
				$("#customTeacherDropDown").hide();
				//showMessage(false, data['message']);
			}
			return false;
		}
	});
}

function getTeacherList(formId){
	var meetingType = $("#"+formId+" #meetingType").val();
	var studentEmail = $("#"+formId+" #userNameOrEmail").val();
	var studentId= $("#"+formId+" #studentId").val();
	if(formId=='classroomSessionFilter'){
		studentId=$('#'+formId+ ' #studentName option:selected').attr('data-studentid');
	}else{
		var stname = $("#"+formId+" #studentName").val();
		var subjectName =$("#"+formId+" #subjectIds option:selected").text();
		// var meetingSubject = "Student Doubt Class - " + stname + " (" + subjectName + ")";
		var meetingSubject = stname + " (" + subjectName + ")";
		
		$("#"+formId+" #meetingSubject").val(meetingSubject);
	}
	var subjectId= $("#"+formId+" #subjectIds").val();
	if(studentId!='' && studentId!=undefined){
		if(studentId.length>0 && subjectId.length>0){
			callTeacherBySubject(formId, subjectId, studentId, meetingType, studentEmail);
		}else{
			if(meetingType != "CUSTOM" || studentEmail != '' ){
				$("#"+formId+" #teacherId").html("");
				$("#"+formId+" #countryTimezoneFromId").val('').trigger('change');
			}else{
				$("#"+formId+" #customTeacherId").html("");
			}
		}
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

function getSplitTime(formId){
	
	if(formId=='classroomSessionFilter'){
		var classDuration = $("#"+formId+" #classDuration").val();
		if(classDuration=='00'){
			showMessageTheme2(0, "Please select class Duration");
			return false;
		}
		var bufferTime = $("#"+formId+" #bufferTime").val();
		if(bufferTime=='00'){
			showMessageTheme2(0, "Please select buffer Time");
			return false;
		}

		var startFromTime = $("#"+formId+" #startFromTime").val();
		// if(startFromTime=='00'){
		// 	showMessage(false, "Please select start from Time");
		// 	return false;
		// }

		var startDate = $("#"+formId+"  #classStartDate").val();
		if(startDate==''){
			showMessageTheme2(0, "Please select start date");
			return false;
		}
		var endDate = $("#"+formId+" #classEndDate").val();
		if(endDate==''){
			showMessageTheme2(0, "Please select end date");
			return false;
		}
		var checkStartDate = new Date(startDate).getTime();
		var checkEndDate = new Date(endDate).getTime();
		if(checkStartDate > checkEndDate){
			showMessageTheme2(0, "End Date Should be Greater than Start Date");
			return false;
		}
		var teacherTimezone= $("#"+formId+" #countryTimezoneFromId option:selected").text().trim();
		if(teacherTimezone==null || teacherTimezone==undefined || teacherTimezone==''){
			showMessageTheme2(0, "Please select timezone");
			return false;
		}
	}else{
		var classDuration = $("#"+formId+" #classDuration").val();
		if(classDuration=='00'){
			showMessage(false, "Please select class Duration");
			return false;
		}
		var bufferTime = $("#"+formId+" #bufferTime").val();
		if(bufferTime=='00'){
			showMessage(false, "Please select buffer Time");
			return false;
		}

		var startFromTime = $("#"+formId+" #startFromTime").val();
		// if(startFromTime=='00'){
		// 	showMessage(false, "Please select start from Time");
		// 	return false;
		// }

		var startDate = $("#"+formId+"  #classStartDate").val();
		if(startDate==''){
			showMessage(false, "Please select start date");
			return false;
		}
		var endDate = $("#"+formId+" #classEndDate").val();
		if(endDate==''){
			showMessage(false, "Please select end date");
			return false;
		}
		var checkStartDate = new Date(startDate).getTime();
		var checkEndDate = new Date(endDate).getTime();
		if(checkStartDate > checkEndDate){
			showMessage(false, "End Date Should be Greater than Start Date");
			return false;
		}
		var teacherTimezone= $("#"+formId+" #countryTimezoneFromId option:selected").text().trim();
		if(teacherTimezone==null || teacherTimezone==undefined || teacherTimezone==''){
			showMessageTheme2(0, "Please select timezone");
			return false;
		}

	}
	
	callTimeSlotByStartTime('recurringClass','00:00:00','23:59:00',classDuration, bufferTime, startFromTime, endDate, teacherTimezone);
}

function updateRecurringClassProceed(formId,userId,recurringClassId,controllType,moduleId,currentMeetingVendor){
	$('#'+formId+' #userId').val(userId);
	$('#'+formId+' #recurringClassId').val(recurringClassId);
	$('#'+formId+' #controllType').val(controllType);
	$('#'+formId+' #moduleId').val(moduleId);
	$('#'+formId+' #currentMeetingVendor').val(currentMeetingVendor);
	$('#updateRecurringClassModel').modal({backdrop: 'static', keyboard: false});
}

function validateRequestForUpdateRecurringClassUrl(formId){
	if($("#" + formId + " #meetingVendor").val()==undefined || $("#" + formId + " #meetingVendor").val()==''){
		showMessage(true, "Meeting Vendor is required.");
		return false;
	}
	if($("#" + formId + " #meetingVendor").val()=='External'){
		if($("#" + formId + " #joiningLink").val()==undefined || $("#" + formId + " #joiningLink").val()==''){
			showMessage(true, "Joining Link is required.");
			return false;
		}
	}
	if($('#'+formId+' #currentMeetingVendor').val()==$("#" + formId + " #meetingVendor").val()){
		showMessage(true, "Existing and opted meeting vendor cann't same.");
		return false;
	}
	return true;
}
function updateRecurringClassVendorWarning(formId,moduleId){
	var message='Are you sure you want to update recurring classes URL ';
	return sendRecurringWarning(message, 'updateRecurringClasses(\''+formId+'\',\''+moduleId+'\')');
}

function updateRecurringClasses(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForUpdateRecurringClassUrl(formId)){
		return false;
	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'recurring-class-update'),
		data : JSON.stringify(getRequestForUpdateRecurringClassUrl(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				//window.setTimeout(function(){callDashboardPageSchool(moduleId,'recurring-class-list')},3100)
				var recurringId=$('#'+formId+' #recurringClassId').val();
				var meetingVendor=$("#" + formId + " #meetingVendor").val();
				var html='('+meetingVendor+')<br/>';
				if(meetingVendor=='ZOOM'){
					html+='<button value="'+data['startMeetingUrl']+'" id="start_url_'+recurringId+'"  onclick="copyURL(\'start_url_'+recurringId+'\', \'start-copy-msg-'+recurringId+'\')" class="btn btn-primary btn-sm">Copy Start URL</button> <b class="start-copy-msg-'+recurringId+'"></b><br/>';
					html+='<button value="'+data['joinMeetingUrl']+'" id="start_url_'+recurringId+'"  onclick="copyURL(\'start_url_'+recurringId+'\', \'start-copy-msg-'+recurringId+'\')" class="btn btn-primary btn-sm">Copy Join URL</button> <b class="start-copy-msg-'+recurringId+'"></b>';
				}else{
					html+='<button value="'+data['startMeetingUrl']+'" id="start_url_'+recurringId+'"  onclick="copyURL(\'start_url_'+recurringId+'\', \'start-copy-msg-'+recurringId+'\')" class="btn btn-primary btn-sm">Copy URL</button> <b class="start-copy-msg-'+recurringId+'"></b>';
				}
				$('#recurring_class_'+recurringId).html(html);
				resetUpdateRecurringClass(formId,moduleId);
				$('#updateRecurringClassModel').modal('hide');
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

function getRequestForUpdateRecurringClassUrl(formId, moduleId) {
	var recurringClassRequest = {};
	var authentication = {};
	var recurringClassDTO = {};

	recurringClassDTO['id']=$("#" + formId + " #recurringClassId").val();
	recurringClassDTO['meetingVendor'] = $("#" + formId + " #meetingVendor").val();
	recurringClassDTO['joiningLink'] = $("#" + formId + " #joiningLink").val();
	recurringClassDTO['showLinkBefore'] = $("#" + formId + " #showLinkBefore").val();

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId']=$('#userId').val();

	recurringClassRequest['authentication'] = authentication;
	recurringClassRequest['recurringClassDTO'] = recurringClassDTO;

    return recurringClassRequest;
}

function resetUpdateRecurringClass(formId,moduleId){
	$('#'+formId)[0].reset();
	$('#'+formId+' #joiningLink').prop('readonly',true);
}

// Function to convert time range strings into comparable time objects
function parseTimeFor(timeStr) {
	if(timeStr!=' Not Available '){
		var timeParts = timeStr.match(/(\d+):(\d+) (\w+)/);
		var hours = parseInt(timeParts[1]);
		var minutes = parseInt(timeParts[2]);
		var meridian = timeParts[3];
		if (meridian === "PM" && hours !== 12) {
			hours += 12;
		} else if (meridian === "AM" && hours === 12) {
			hours = 0;
		}
		return { hours, minutes };
	}
	return true;
}

// Updated function to check for time overlap
function matchSlotBetweenGivenAvailability(slot, range) {
	if(range!=' Not Available '){
		var [slotStart, slotEnd] = slot.split(" - ").map(parseTimeFor);
		var [rangeStart, rangeEnd] = range.split(" - ").map(parseTimeFor);
		var slotStartMinutes = slotStart.hours * 60 + slotStart.minutes;
		var slotEndMinutes = slotEnd.hours * 60 + slotEnd.minutes;
		var rangeStartMinutes = rangeStart.hours * 60 + rangeStart.minutes;
		var rangeEndMinutes = rangeEnd.hours * 60 + rangeEnd.minutes;
		return ((slotStartMinutes >= rangeStartMinutes && slotStartMinutes < rangeEndMinutes) && (slotEndMinutes > rangeStartMinutes && slotEndMinutes < rangeEndMinutes));
	}
	return 0;
}

// Function to filter timing slots
function findMatchingAndMissMatchingSlots(slots, givetime) {
    var matching = [];
    var missMatching = [];
	for (var i = 0; i < slots.length; i++) {
        var matched = false;
		for (var j = 0; j < givetime.length; j++) {
            if (matchSlotBetweenGivenAvailability(slots[i], givetime[j])) {
                matching.push(slots[i]);
                matched = true;
                break; // Stop checking once matched
            }
        }
		if (!matched) {
            missMatching.push(slots[i]);
        }
    }
	return [
        { Matching: matching },
        { MissMatching: missMatching }
    ];
}

