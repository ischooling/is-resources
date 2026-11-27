function validateRequestForRecurringClass(formId){
	var meetingType = $("#" +formId+" #meetingType").val();
	if(formId!='classroomSessionFilter'){
		if(meetingType!="CUSTOM"){
			if($("#" + formId + " #studentId").val()==undefined || $("#" + formId + " #studentId").val()==''){
				showMessageTheme2(0, "Search student using StudentId");
				return false;
			}
			if($("#" + formId + " #subjectIds").val()==undefined || $("#" + formId + " #subjectIds").val()==''){
				showMessageTheme2(0, "Course is required.");
				return false;
			}
			if($("#" + formId + " #teacherId").val()==undefined || $("#" + formId + " #teacherId").val()==''){
				showMessageTheme2(0, "Teacher is required.");
				return false;
			}
		
			// if($("#" + formId + " #recurringType").val()==undefined || $("#" + formId + " #recurringType").val()==''){
			// 	showMessageTheme2(0, "CLass Type is required.");
			// 	return false;
			// }
		}

		if($("#" + formId + " #meetingVendor").val()==undefined || $("#" + formId + " #meetingVendor").val()==''){
			showMessageTheme2(0, "Meeting Vendor is required.");
			return false;
		}
		if($("#" + formId + " #meetingVendor").val()=='External'){
			if($("#" + formId + " #joiningLink").val()==undefined || $("#" + formId + " #joiningLink").val()==''){
				showMessageTheme2(0, "Joining Link is required.");
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
			showMessageTheme2(0, "TimeZone is required.");
		}else{
			showMessageTheme2(0, "TimeZone is required.");
		}
		return false;
	}
	if($("#" + formId + " #classDuration").val()==undefined || $("#" + formId + " #classDuration").val()=='00'){
		if(USER_ROLE!='TEACHER'){
			showMessageTheme2(0, "Classroom Duration is required.");
		}else{
			showMessageTheme2(0, "Classroom Duration is required.");
		}
		
		return false;
	}
	if($("#" + formId + " #bufferTime").val()==undefined || $("#" + formId + " #bufferTime").val()=='00'){
		if(USER_ROLE!='TEACHER'){
			showMessageTheme2(0, "Buffer Time Duration is required.");
		}else{
			showMessageTheme2(0, "Buffer Time Duration is required.");
		}
		
		return false;
	}
	if($("#" + formId + " #classStartDate").val()==undefined || $("#" + formId + " #classStartDate").val()==''){
		if(USER_ROLE!='TEACHER'){
			showMessageTheme2(0, "Start Date is required.");
		}else{
			showMessageTheme2(0, "Start Date is required.");
		}
		
		return false;
	}
	if($("#" + formId + " #classEndDate").val()==undefined || $("#" + formId + " #classEndDate").val()==''){
		if(USER_ROLE!='TEACHER'){
			showMessageTheme2(0, "End Date is required.");
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
			showMessageTheme2(0, "Please select both day and time.");
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
	hideMessageTheme2('');
	if(!validateRequestForRecurringClass(formId)){
		return false;
	}
	var teacherWait = USER_ROLE == 'TEACHER';
	if (teacherWait) {
		showBookingWait();
	}
	
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', USER_ROLE == 'TEACHER' ? 'recurring-class-submit-by-teacher' : 'recurring-class-submit'),
		complete : function() {
			if (teacherWait) {
				hideBookingWait();
			}
		},
		data : JSON.stringify(getRequestForRecurringClass(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(USER_ROLE!='TEACHER'){
					showMessageTheme2(0, data['message']);
				}else{
					showMessageTheme2(0, data['message']);
				}
			} else {
				$('#'+formId+ ' #studentId').val('').trigger("change");
				$('#'+formId)[0].reset();
				var ticketFailed = data['statusCode'] == 'NOT_NOTIFIED';
				showMessageTheme2(ticketFailed ? 0 : 1, data['message']);
				var reloadAfter = ticketFailed ? 8000 : 1000;
				if(formId=='classroomSessionFilter'){
					window.setTimeout(function(){callDashboardPageSchool(155,'schedule-a-session');},reloadAfter)
				}else{
					$("#recurringClassShowModelValidation").modal("hide");
					window.setTimeout(function(){callDashboardPageSchool(moduleId,'recurring-class-list')},reloadAfter)
				}
				$(".classRecodsTumbs").hide();
			}
			return false;
		},
		error : function(e) {
			if (teacherWait) {
				showMessageTheme2(0, 'Booking took too long or failed. Please check the class list before trying again.');
			}
			return false;
		}
	});
}

function showBookingWait() {
	$('#recurringClassShowModel, #remarksresetDelete1, #booksclassOutsideAvailabilityConfirmationModal').modal('hide');
	window.setTimeout(function () {
		$('.modal-backdrop').remove();
		$('body').removeClass('modal-open').css('padding-right', '');
	}, 400);
	if (!document.getElementById('bookingWaitOverlay')) {
		$('<div id="bookingWaitOverlay" style="position:fixed;inset:0;z-index:20000;background:rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;color:#1a1a1a">Booking classes, please wait. Do not close or refresh this page.</div>').appendTo('body');
	}
}

function hideBookingWait() {
	$('#bookingWaitOverlay').remove();
	$('.modal-backdrop').remove();
	$('body').removeClass('modal-open').css('padding-right', '');
}

var ADMIN_CREATE_OVER_LIMIT = false;
var ADMIN_SKIP_SCHOOL_ADDED = false;

function tidyAdminValidation(rows, oneDay) {
	if (typeof USER_ROLE != 'undefined' && USER_ROLE == 'TEACHER') {
		return;
	}
	var modal = $('#recurringClassShowModelValidation');
	if (!modal.length || !rows || !$('#trRecurring').closest('#recurringClassShowModelValidation').length) {
		return;
	}
	ensureTeacherBookingStyles();
	ensureRecurringUiStyles();
	if (!document.getElementById('adminValidationStyles')) {
		$('<style id="adminValidationStyles"></style>').text(
			'#recurringClassShowModelValidation thead th{position:sticky;top:0;z-index:2;background:#fff}'
			+ '#adminValidationSummary{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:0 0 10px}'
			+ '.tb-adminfooter{display:flex !important;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:8px}'
			+ '.tb-adminfooter .full{flex:1 1 100%;margin:0}'
			+ '.tb-adminfooter .validator-message-count{margin:0 0 4px}'
			+ '.tb-adminfooter .tb-btn{margin:0 !important;float:none !important}'
			+ '#adminOverLimitBox{flex:1 1 100%;background:#fff8e1;border:1px solid #ffe08a;border-radius:12px;padding:12px 14px;margin:0 !important}'
			+ '#adminOverLimitBox textarea{border-radius:10px}'
			+ '#adminOverLimitBox #adminCreateAnywayBtn{float:none !important;display:block;margin-left:auto}'
			+ '.tb-btn-warn{background:#ffc107 !important;border-color:#ffc107 !important;color:#000 !important}'
			+ '.tb-btn-warn:disabled{opacity:.55}'
		).appendTo('head');
	}
	var can = 0, cannot = 0, holiday = 0, schoolAdded = 0, overLimitRows = 0;
	$.each(rows, function (i, r) {
		var st = r.bookingStatus || '';
		if (st == 'Can be booked') {
			can++;
			if (r.drawsFrom && String(r.drawsFrom).indexOf('School-added') == 0) { schoolAdded++; }
		} else if (st == 'Holiday') {
			holiday++;
		} else if (st != '') {
			cannot++;
			if (String(r.bookingReason || '').indexOf('School-added limit reached') == 0) { overLimitRows++; }
		}
	});
	var bar = $('#teacherBookingFooter');
	if (!bar.length) {
		bar = $('#adminValidationSummary');
		if (!bar.length) {
			bar = $('<div id="adminValidationSummary"></div>');
			$('#trRecurring').closest('table').parent().before(bar);
		}
	}
	if (can + cannot + holiday == 0) {
		bar.empty();
	} else {
		var pills = ('<span class="tb-pill tb-pill-ok">' + (can - schoolAdded) + ' can be booked</span>'
			+ (schoolAdded > 0 ? '<span class="tb-pill" style="background:#ffc107 !important;color:#000 !important">' + schoolAdded + ' School-added</span>' : '')
			+ (cannot - overLimitRows > 0 ? '<span class="tb-pill tb-pill-no">' + (cannot - overLimitRows) + ' not available</span>' : '')
			+ (overLimitRows > 0 ? '<span class="tb-pill" style="background:#7a4dff !important">' + overLimitRows + ' over School-added limit</span>' : '')
			+ (holiday > 0 ? '<span class="tb-pill tb-pill-grey">' + holiday + ' holiday</span>' : ''));
		var note = (cannot - overLimitRows > 0 ? (cannot - overLimitRows) + ' not available (slot busy, weekly cap, etc.) are not created. ' : '')
			+ (overLimitRows > 0 ? overLimitRows + ' over the School-added limit can be created with a reason below.' : '');
		bar.html('<div class="tb-sumbar" id="adminValidationSummary">' + pills + '</div>' + (note ? '<p class="tb-note">' + note + '</p>' : ''));
	}
	var ssId = $('#recurringClass #studentStandardId').val();
	var courseId = $('#recurringClass #subjectIds').val();
	if ($('#teacherBookingTiles').length && ssId && courseId && typeof loadTeacherBalanceTiles === 'function') {
		loadTeacherBalanceTiles('#teacherBookingTiles', ssId, courseId, true);
	}
	var footer = modal.find('.modal-footer').first().addClass('tb-adminfooter');
	if (!footer.find('#adminValidationCancel').length) {
		footer.prepend('<button type="button" id="adminValidationCancel" class="tb-btn tb-btn-ghost" data-dismiss="modal">Cancel</button>');
	}
	footer.find('.create-class-btn, .meetingSlotAdd, .proceedRecurringClassbtn').removeClass('float-right btn btn-sm btn-primary btn-success').addClass('tb-btn tb-btn-primary');
	footer.find('#adminCreateAnywayBtn').removeClass('float-right btn btn-warning btn-sm').addClass('tb-btn tb-btn-warn');
	var saveBtn = footer.find('.proceedRecurringClassbtn').first();
	var plain = can - schoolAdded;
	$('#adminWithinBtn').remove();
	if (!oneDay && saveBtn.length && schoolAdded > 0) {
		saveBtn.html('<i class="fa fa-check"></i> Book ' + can + ' (incl. ' + schoolAdded + ' School-added)');
		if (plain > 0) {
			var within = $('<button type="button" id="adminWithinBtn" class="tb-btn tb-btn-primary"></button>')
				.html('<i class="fa fa-check"></i> Book ' + plain + ' (within availability)');
			within.on('click', function () {
				ADMIN_SKIP_SCHOOL_ADDED = true;
				ADMIN_CREATE_OVER_LIMIT = false;
				saveBtn[0].click();
			});
			within.insertBefore(saveBtn);
		}
	}
}

function adminOverLimitReason() {
	return $.trim($('#adminOverLimitReason').val() || '');
}

function adminOverLimitControls(rows, oneDay) {
	$('#adminOverLimitBox').remove();
	ADMIN_CREATE_OVER_LIMIT = false;
	ADMIN_SKIP_SCHOOL_ADDED = false;
	if (USER_ROLE == 'TEACHER' || !rows) {
		return;
	}
	var can = 0, over = 0, blocked = 0;
	$.each(rows, function (i, r) {
		if (r.bookingStatus == 'Can be booked') { can++; }
		else if (r.bookingStatus && r.bookingStatus != 'Holiday') { blocked++; if (r.overLimit) { over++; } }
	});
	if (!rows.some(function (r) { return !!r.bookingStatus; })) {
		return;
	}
	var bookBtn = oneDay ? $('.meetingSlotAdd') : $('.proceedRecurringClassbtn');
	if (can > 0) {
		bookBtn.show();
		if (!oneDay && blocked > 0) {
			bookBtn.html('<i class="fa fa-check"></i> Book ' + can);
		}
		$('.validator-message, .validator-message-count').hide();
	} else {
		bookBtn.hide();
	}
	bookBtn.off('mousedown.overLimit').on('mousedown.overLimit', function () { ADMIN_CREATE_OVER_LIMIT = false; ADMIN_SKIP_SCHOOL_ADDED = false; });
	if (over == 0) {
		return;
	}
	var footer = $('#trRecurring').closest('.modal-content').find('.modal-footer').first();
	var box = $('<div id="adminOverLimitBox" class="w-100 mb-2"></div>');
	box.html('<p class="mb-1" style="font-size:13px">' + over + ' class' + (over > 1 ? 'es are' : ' is') + ' over the School-added limit. Book only the classes that can be booked, or create the extra ones anyway with a reason.</p>'
		+ '<textarea id="adminOverLimitReason" class="form-control mb-2" rows="2" placeholder="Reason for creating classes over the School-added limit (required)"></textarea>'
		+ '<button type="button" id="adminCreateAnywayBtn" class="btn btn-warning btn-sm float-right" disabled><i class="fa fa-exclamation-triangle"></i>&nbsp;Create anyway (' + (can + over) + ')</button>');
	if (footer.length) { footer.prepend(box); } else { $('#trRecurring').closest('table').parent().after(box); }
	$('#adminOverLimitReason').on('input', function () { $('#adminCreateAnywayBtn').prop('disabled', adminOverLimitReason() == ''); });
	$('#adminCreateAnywayBtn').on('click', function () {
		if (adminOverLimitReason() == '') { return; }
		ADMIN_CREATE_OVER_LIMIT = true;
		ADMIN_SKIP_SCHOOL_ADDED = false;
		bookBtn.first().trigger('click');
	});
}

function getRequestForRecurringClass(formId) {
	var recurringClassRequest = {};
	var authentication = {};
	var recurringClassDTO = {};
	recurringClassDTO['createOverLimit'] = ADMIN_CREATE_OVER_LIMIT;
	recurringClassDTO['skipSchoolAdded'] = ADMIN_SKIP_SCHOOL_ADDED;
	recurringClassDTO['overLimitReason'] = ADMIN_CREATE_OVER_LIMIT ? adminOverLimitReason() : '';

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
		recurringClassDTO['recurringType'] = 'Complement';
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
	daysDifference = getDaysDifference(classStartDate, classEndDate);
	recurringClassDTO['timezoneId'] = $("#" + formId + " #countryTimezoneFromId").val();
	recurringClassDTO['studentTimezoneId'] = $("#" + formId + " #studentTimezoneId").val();
	recurringClassDTO['classDuration'] = $("#" + formId + " #meetingType").val() == 'PTM' ? '15' : $("#" + formId + " #classDuration").val();
	recurringClassDTO['buffertime'] = $("#" + formId + " #bufferTime").val();
	recurringClassDTO['checkDateSpecific']=daysDifference;

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
	recurringClassRequest['adminReason'] = $.trim($('#teacherAdminReason').val() || '');
	recurringClassRequest['bookMode'] = TEACHER_BOOK_MODE;

    return recurringClassRequest;
}


function callSubjectNameByStudent(formId, value) {
	if(value==''){
		return false;
	}
	// if($("#" + formId + " #classDuration").val()==undefined || $("#" + formId + " #classDuration").val()=='00'){
	// 	showMessageTheme2(0, "Classroom Duration is required.");
	// 	return false;
	// }
	// if($("#" + formId + " #bufferTime").val()==undefined || $("#" + formId + " #bufferTime").val()=='00'){
	// 	showMessageTheme2(0, "Buffer Time Duration is required.");
	// 	return false;
	// }
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','SUBJECT-BY-STUDENT',value)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster(formId,'TEACHER-BY-SUBJECT',value, studentId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
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
				var meetingVendor='';
				recurringMaxMonths = 3;
				startDaysCount=15;
				$.each(result, function(k, v) {
					dropdown.append('<option value="' + v.key + '">'+ v.value + ' ('+ v.extra +') </option>');
					userTimezone=v.extra2;
					coursesEndDate=v.extra1;
					meetingVendor=v.extra3;
					recurringMaxMonths = parseInt(v.extra4) || 3;
					startDaysCount=v.extra5;
				});
				if(formId!='classroomSessionFilter'){
					if($("#"+formId+" #countryTimezoneFromId").length>0){
						$("#"+formId+" #countryTimezoneFromId").val(userTimezone).trigger('change');
					}
				}
				dropdown.val('');
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
					coursesEndDate.setMonth(coursesEndDate.getMonth() + 10);
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
				if(typeof refreshCustomFieldState === 'function'){
					refreshCustomFieldState($('#'+formId));
				}
			}
		}
	});
}

var recurringMaxMonths = 3;

function getRecurringEndLimit(startDate, coursesEndDate){
	var limit = new Date(startDate);
	if (typeof USER_ROLE !== 'undefined' && USER_ROLE != 'TEACHER') {
		limit.setFullYear(limit.getFullYear() + 20);
		return limit;
	}
	limit.setMonth(limit.getMonth() + (parseInt(recurringMaxMonths) || 3));
	if(coursesEndDate){
		var courseEnd = new Date(coursesEndDate);
		if(!isNaN(courseEnd.valueOf())){
			courseEnd.setDate(courseEnd.getDate() + (6 - courseEnd.getDay()));
			if(courseEnd.valueOf() < limit.valueOf()){
				limit = courseEnd;
			}
		}
	}
	return limit;
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
			var endDate = getRecurringEndLimit(selected.date, coursesEndDate);
			$('#'+formId+' #'+toElementId).val(changeDateFormat(endDate, 'MMM-dd-yyyy'));
			getSplitTime(formId);
			initiateRecurringDateEnd(formId, fromElementId, toElementId, endDate);
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


function ensureRecurringSlotStyles() {
	if (document.getElementById('recurringSlotStyles')) {
		return;
	}
	$('<style id="recurringSlotStyles"></style>').text(
		'.recurring-mapping-set-time-item>div{align-items:flex-start !important;padding-top:4px !important;padding-bottom:4px !important}'
		+ '.recurring-mapping-set-time-item>div>span:first-child{padding-top:6px}'
		+ '.recurring-mapping-set-time-item>div>span:last-child{width:220px;min-width:0}'
		+ '.recurring-mapping-set-time-item .select2-container{width:100% !important}'
		+ '.recurring-mapping-set-time-item .select2-selection--multiple .select2-selection__rendered{display:flex !important;flex-wrap:wrap;gap:2px;white-space:normal}'
		+ '.recurring-mapping-set-time-item .select2-selection__choice{white-space:nowrap;font-size:12px}'
	).appendTo('head');
}

function callTimeSlotByStartTime(formId, startTime,endTime, intervalTime, bufferTime, startFromTime, endDate, teacherTimezoneId) {
	if(startTime==''){
		return false;
	}
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster(formId,'SPLIT-TIMESLOT-BY-STARTTIME',startTime,endTime, intervalTime, bufferTime, startFromTime,endDate, teacherTimezoneId)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(0, data['message']);
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
					ensureRecurringSlotStyles();
					$(".scheduleTime").select2({
						placeholder: "Select Time",
						theme:select2ThemeType,
						width: '100%'
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
		showMessageTheme2(1, "Please select start date");
		return false;
	}
	var endDate = $("#"+formId+" #classEndDate").val();
	if(endDate==''){
		showMessageTheme2(1, "Please select end date");
		return false;
	}
	var teacherId = $("#"+formId+" #teacherId").val();
	if(teacherId==''){
		showMessageTheme2(1, "Please select teacher");
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster(formId,'AVAILABLE-TEACHER-TIME-SLOT',value,startDate, endDate, timeSlot)),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
				return false;
			} else {
				var result = data['mastersData']['teacherTimeAvaile'];
				if(result===false){
					showMessageTheme2(0, "your time already book");
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
	hideMessageTheme2('');
	var data={};
	data['controllType']=controllType;
	data['recurringClassId']=recurringClassId;
	data['schoolId']=SCHOOL_ID;
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','recurring-update'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				
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
	hideMessageTheme2('');
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
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', USER_ROLE == 'TEACHER' ? 'validate-recurring-class-by-teacher' : 'recurring-show-class'),
		data : JSON.stringify(getRequestForRecurringClass(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['message'] != null){
					showMessageTheme2(0, data['message']);
				}else{
					showMessageTheme2(0, "Recurring class range does not match the date(s) selected.");
				}
			}else {
				//showMessageTheme2(1, data['message']);
				var saveForcefully= data['extra'];
				var dateSpecificDays = data['dateSpecificDays'];
				var saveForcefullyIfClassCountExceeds = data['saveForcefullyIfClassCountExceeds'];
				var isTeacherForm = formId == 'classroomSessionFilter';
				var meetingFor = isTeacherForm ? 'RM' : $("#meetingType").val();
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
									<td><span class="rc-badge">`+recurringclassForAA[k]['slotAvailableReason']+`</span></td>
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
				var availableClassCount =0;
				var notAvailabileClassCount=0;
				var holidayRowCount=0;
				var totalAvailableClass = $('#totalClass').html() - $('#totalBookedClass').html();
				$('.proceedRecurringClassbtn').html('<i class="fa fa-check"></i> Save');
				for(var i=0;i<recurringclass.length;i++){
					var isHolidayRow = recurringclass[i]['slotAvailable']=='Holiday';
					if(isHolidayRow){
						holidayRowCount++;
						htmlRecu = htmlRecu +"<tr class='recurring-holiday-row' style='background:#eef0f2;color:#6c757d;'>";
						availableClassCount++;
					}else if(recurringclass[i]['bookingStatus'] ? recurringclass[i]['bookingStatus']!='Can be booked' : (recurringclass[i]['slotAvailable']!='Available' || recurringclass[i]['classBookedStatus']=='NA')){
						htmlRecu = htmlRecu +"<tr class='text-danger'>";
						if(recurringclass[i]['classBookedStatus']=='NA'){
							notAvailabileClassCount++;
						}
						if(recurringclass[i]['slotAvailable']=='Available'){
							availableClassCount++;
						}
					}else{
						htmlRecu = htmlRecu +"<tr>";
						availableClassCount++;
					}
					htmlRecu = htmlRecu +" <td class='text-center'>"+(inc++)+"</td>";
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
						+(USER_ROLE == 'TEACHER' ? '' : '<p class="mb-0"><b>Admin Timezone: </b>'+recurringclass[i]['meetingDate']+" ("+recurringclass[i]['startTime']+" - "+recurringclass[i]['endTime']+')</p>')
					+"</td>";
					htmlRecu = htmlRecu +" <td>"+recurringStatusBadge(recurringclass[i]['slotAvailable'])+"</td>";
					var reason =recurringclass[i]['slotAvailableReason'];
					if(recurringclass[i]['slotAvailable']=='Available' && (reason==null || reason=='' || reason=='NA' || reason=='N/A')){
						reason='Available';
					}
					if(reason!=null && reason!='' && reason!='NA' && reason!=undefined){
						htmlRecu = htmlRecu +" <td>"+reason.replaceAll("~","<br>")+"</td>";
					}else{
						htmlRecu = htmlRecu +" <td>"+reason+"</td>";
					}
					var bookingStatus = recurringclass[i]['bookingStatus'];
					var bookableByPlan = bookingStatus=='Can be booked';
					var weekClassStatus =recurringclass[i]['classBookedStatus'];
					if(isHolidayRow){
						htmlRecu = htmlRecu +" <td><span class='badge badge-secondary'><i class='fa fa-calendar-times-o'></i> Holiday</span></td>";
					}else if(bookableByPlan && (totalAvailableClass == 0 || weekClassStatus=="NA")){
						htmlRecu = htmlRecu +" <td>Booked from "+escapeTeacherText(recurringclass[i]['drawsFrom']||'other balance')+"</td>";
					}else if(totalAvailableClass == 0 || weekClassStatus=="NA"){
						htmlRecu = htmlRecu +" <td>Student does not have any classes to book</td>";
					}else{
						htmlRecu = htmlRecu +" <td>"+weekClassStatus+"</td>";
					}
					htmlRecu = htmlRecu +"</tr>";
					if(!isHolidayRow){
						if(bookingStatus){
							if(!bookableByPlan){
								validRecurringClass=false;
							}
						}else if(recurringclass[i]['slotAvailable']!='Available' || weekClassStatus=='NA'){
							validRecurringClass=false;
						}
					}
				}
				var plannedRows = recurringclass.some(function(r){ return !!r['bookingStatus']; });
				if(!plannedRows && saveForcefullyIfClassCountExceeds == 'Y' &&  notAvailabileClassCount>0 && availableClassCount==recurringclass.length){
					validRecurringClass = true;
					$('.proceedRecurringClassbtn').html('<i class="fa fa-check"></i> Save anyway');
				}
				var allHolidays = recurringclass.length>0 && holidayRowCount==recurringclass.length;
				if(allHolidays){
					$('.proceedRecurringClassbtn').hide();
					$(".validator-message-count").text("All selected dates are holidays, so no class will be created.").show();
				}else{
					$(".validator-message-count").hide();
				}
				if(validRecurringClass && !allHolidays){
					$('.proceedRecurringClassbtn').show();
					$(".validator-message").hide()
				}else{
					$('.proceedRecurringClassbtn').hide();
					$(".validator-message").show()
				}
				// if(availableClassCount>totalAvailableClass && notAvailabileClassCount==0 && saveForcefullyIfClassCountExceeds=='N'){
				// 	$('.proceedRecurringClassbtn').hide();
				// 	$(".validator-message-count").show()
				// }else{
				// 	$(".validator-message-count").hide()
				// }
				ensureRecurringUiStyles();
				$("#trRecurring").closest('table').addClass('rc-validation-table');
				$("#trRecurring").html(htmlRecu);
				if(typeof enhanceTeacherValidation === 'function'){
					enhanceTeacherValidation(recurringclass, {oneDay: false});
				}
				if(!isTeacherForm && !allHolidays){
					adminOverLimitControls(recurringclass, false);
					tidyAdminValidation(recurringclass, false);
				}
				if(isTeacherForm){
					$('#recurringClassShowModel .meetingSlotAdd').hide();
					if(saveForcefully != 'Y' && daysDifference > dateSpecificDays && recurringclassForAA.length > 0){
						$('.proceedRecurringClassbtn').hide();
						$("#teacherAvailabilityWarningTitle").html(`<h5 class="text-center bold text-danger">Some of these slots are not in your availability. Please add them to your availability and check again.</h5>`);
					}
					$("#recurringClassShowModel").modal('show');
				}
				if(meetingTypeValue == "ODM"){
					$("#meetingType").val("ODM");
					$(".hide-on-odm").hide();
					$(".hide-on-rm, #meetingTypeNote").show();
				}else if(meetingTypeValue == "RM"){
					$(".hide-on-odm").show();
					$(".hide-on-rm, #meetingTypeNote").hide();
				}
				$('#recurringClassShowModelValidation .modal-body').animate({scrollTop: "0px"}, 'slow');
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
	var rollNo='';
	if($('#'+formId+ ' #meetingType').val() == null || $('#'+formId+ ' #meetingType').val() == undefined || $('#'+formId+ ' #meetingType').val() == ''){
		showMessageTheme2(0, 'Meeting Type Required');
		return false;
	}
	if(formId=='classroomSessionFilter'){
		rollNo = $('#'+formId+ ' #studentName option:selected').attr('data-studentemail');
	}else{
		rollNo = $('#'+formId+ ' #rollNo').val().trim();
	}
	if(rollNo==''){
		showMessageTheme2(0, "Student ID is empty or invalid");
		return false;
	}
	var data={};
          data['rollNo']=rollNo;
          data['schoolId']=SCHOOL_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
				if(formId=='classroomSessionFilter' && tt=='theme2'){
					showMessageTheme2(0, data['message']);
				}else{
					showMessageTheme2(0, data['message']);
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
					$('#'+formId+ ' #standardId').val(userData['standardId']);
					$('#'+formId+ ' #studentStandardId').val(userData['studentStandardId']);
					if(userData['meetingVendor']!=undefined && userData['meetingVendor']!=''){
						$("#"+formId+" #meetingVendor").val(userData['meetingVendor']);
						$("#"+formId+" #meetingVendor").prop('disabled',true);
					}else{
						$("#"+formId+" #meetingVendor").val('');
						$("#"+formId+" #meetingVendor").prop('disabled',false);
					}
				} 	
				if(formId=='recurringClass' && $("#"+formId+" #meetingType").val()== "ODM"){
					$("#boughtWeekDropdownWrapper").show();
					var dropdown=`<option value="">Select Week</option>`;
					$.each(data.userData.weekList, function(i,v){
						dropdown+=`<option value="${v}">${v}</option>`;
					});
					$("#"+formId+" #boughtWeekDropdownWrapper #boughtWeek").html(dropdown);
					if ($.fn.select2 && $("#"+formId+" #boughtWeekDropdownWrapper #boughtWeek").hasClass('select2-hidden-accessible')) {
						$("#"+formId+" #boughtWeekDropdownWrapper #boughtWeek").select2('destroy');
					}
					$("#"+formId+" #boughtWeekDropdownWrapper #boughtWeek").select2({
						theme:"bootstrap4"
					});
				}else{
					$("#boughtWeekDropdownWrapper").hide();
				}
				callSubjectNameByStudent(formId, userData['userId']);
				if((data.userData.standardId >= 11 && data.userData.standardId <= 17) || (data.userData.standardId == 19) || (data.userData.registrationType == "SSP")){
					bookedCalssCotentFun(0, userData['studentStandardId'])
				}else{
					$("#classRecodsTumbs").html("")
				}
				$("#selectTeacher").show();
				$("#customTeacherDropDown").hide();
				//showMessageTheme2(1, data['message']);
			}
			return false;
		}
	});
}

function getTeacherList(formId){
	var meetingType = $("#"+formId+" #meetingType").val();
	var studentEmail = $("#"+formId+" #rollNo").val();
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
	var standardId = $("#"+formId+" #standardId").val();
	var registrationType = $("#"+formId+" #learningProgram").val();
	if((standardId < 11 || standardId == 18 || standardId>19) && (registrationType != "SSP")){
		bookedCalssCotentFun($("#"+formId+" #subjectIds").val(), $("#"+formId+" #studentStandardId").val())
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
		// 	showMessageTheme2(1, "Please select start from Time");
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

	}
	// var standardId = $("#"+formId+" #standardId").val();
	// var registrationType = $("#"+formId+" #learningProgram").val();
	// if((standardId < 11 || standardId == 18 || standardId>19) && (registrationType != "SSP")){
	// 	bookedCalssCotentFun($("#"+formId+" #subjectIds").val(), $("#"+formId+" #studentStandardId").val(),startDate,endDate)
	// }else{
	// 	bookedCalssCotentFun(0, $("#"+formId+" #studentStandardId").val(),startDate,endDate)
	// }
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
		showMessageTheme2(0, "Meeting Vendor is required.");
		return false;
	}
	if($("#" + formId + " #meetingVendor").val()=='External'){
		if($("#" + formId + " #joiningLink").val()==undefined || $("#" + formId + " #joiningLink").val()==''){
			showMessageTheme2(0, "Joining Link is required.");
			return false;
		}
	}
	if($('#'+formId+' #currentMeetingVendor').val()==$("#" + formId + " #meetingVendor").val()){
		showMessageTheme2(0, "Existing and opted meeting vendor cann't same.");
		return false;
	}
	return true;
}
function updateRecurringClassVendorWarning(formId,moduleId){
	var message='Are you sure you want to update recurring classes URL ';
	return sendRecurringWarning(message, 'updateRecurringClasses(\''+formId+'\',\''+moduleId+'\')');
}

function updateRecurringClasses(formId,moduleId) {
	hideMessageTheme2('');
	if(!validateRequestForUpdateRecurringClassUrl(formId)){
		return false;
	}
	
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'recurring-class-update'),
		data : JSON.stringify(getRequestForUpdateRecurringClassUrl(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
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
	authentication['userId']=USER_ID;

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


function bookedCalssCotentFun(subjectId, studentStandardId,startDate,endDate) {
	var data = {};
	data['userId'] = USER_ID;
	data['subjectId'] = subjectId;
	data['studentStandardId'] = studentStandardId;
	data['callFrom']=USER_ROLE;
	data['startDate'] = startDate;
	data['endDate'] = endDate;
	data['dateType'] = "";
	// data['roleModuleId'] = roleModuleId;
	if (typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyStudentBookedClassesDetailsResponse === "function") {
		var dummyData = getDummyStudentBookedClassesDetailsResponse(subjectId);
		$("#classRecodsTumbs").html(getClassRecodsContent(dummyData.subjectCountDatials));
		$("#classRecodsTumbs").show();
		customLoader(false);
		return;
	}
	$.ajax({
		type: "GET",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'student-booked-classes-details?payload='+encode(JSON.stringify(data))),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessage(true, data['message'], '');
				}
			} else {
				$("#classRecodsTumbs").html(getClassRecodsContent(data.subjectCountDatials));
				$("#classRecodsTumbs").show();
				$(window).off('scroll.recurringTiles');
				$('#classRecodsTumbsSpacer').remove();
				$('#classRecodsTumbs').css({position: '', top: '', left: '', width: '', zIndex: '', background: '', padding: '', boxShadow: ''}).addClass('rc-sticky-tiles');
			}
			customLoader(false);
		},
		error: function (e) {
			//showMessage(true, TECHNICAL_GLITCH);
		}
	});

}

function getClassRecodsContent(data){
	ensureRecurringUiStyles();
	var tiles = [
		{label:'Total', id:'totalClass', value:data.total, tone:'primary', icon:'fa-calendar'},
		{label:'Booked', id:'totalBookedClass', value:data.booked, tone:'success', icon:'fa-check-circle'},
		{label:'Left', id:'totalLeftClass', value:data.left, tone:'warning', icon:'fa-hourglass-half'},
		{label:'Expired', id:'', value:data.expired, tone:'danger', icon:'fa-clock-o'},
		{label:'Missed by Student', id:'', value:data.missedByYou, tone:'dark', icon:'fa-user-times'},
		{label:'Rescheduled', id:'totalReschedule', value:data.rescheduled, tone:'orange', icon:'fa-refresh'},
		{label:'Completed', id:'totalCompleted', value:data.completed, tone:'alternate', icon:'fa-flag-checkered'},
		{label:'Class Missed by Teacher', id:'', value:data.missedByTeacher, tone:'pink', icon:'fa-ban'}
	];
	var html = '<div class="rc-tiles course-detials mb-3">';
	$.each(tiles, function(i, t){
		html += '<div class="rc-tile rc-tone-'+t.tone+'">'
			+ '<span class="rc-tile-icon"><i class="fa '+t.icon+'"></i></span>'
			+ '<span class="rc-tile-text"><span class="rc-tile-label">'+t.label+'</span>'
			+ '<span class="rc-tile-value"'+(t.id ? ' id="'+t.id+'"' : '')+'>'+t.value+'</span></span>'
			+ '</div>';
	});
	html += '</div>';
	return html;
}

function ensureRecurringUiStyles(){
	if(document.getElementById('recurringUiStyles')){
		return;
	}
	var css = ''
		+ '.rc-sticky-tiles{position:sticky;top:5px;z-index:20;background:#fff;padding-block:6px}'
		+ '.rc-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}'
		+ '.rc-tile{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;background:#fff;border:1px solid #e9ecef;border-left:4px solid currentColor}'
		+ '.rc-tile-icon{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.05);flex:0 0 32px}'
		+ '.rc-tile-text{display:flex;flex-direction:column;line-height:1.2;min-width:0}'
		+ '.rc-tile-label{font-size:11px;color:#6c757d;line-height:1.25}'
		+ '.rc-tile-value{font-size:18px;font-weight:700;color:#343a40}'
		+ '.rc-tone-primary{color:var(--pc,#007bff)}.rc-tone-success{color:#28a745}.rc-tone-warning{color:#f0ad00}.rc-tone-danger{color:#dc3545}'
		+ '.rc-tone-dark{color:#495057}.rc-tone-orange{color:#fd7e14}.rc-tone-alternate{color:#6f42c1}.rc-tone-pink{color:#e83e8c}'
		+ '.rc-validation-table{border-radius:10px}'
		+ '.rc-validation-table thead th{background:var(--pc,#007bff);color:#fff;border-color:transparent;font-weight:600;white-space:nowrap}'
		+ '.rc-validation-table tbody td{vertical-align:middle;font-size:12px}'
		+ '.rc-validation-table tbody tr:hover{background:#f8f9fb}'
		+ '.rc-validation-table tbody tr.text-danger{background:#fff5f5;color:#212529 !important}'
		+ '.rc-validation-table tbody tr.recurring-holiday-row,.rc-validation-table tbody tr.recurring-holiday-row:hover{background:#eef0f2 !important;color:#6c757d}'
		+ '.rc-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;white-space:nowrap}'
		+ '.rc-badge-ok{background:#e6f4ea;color:#1e7e34}.rc-badge-no{background:#fdecea;color:#b02a37}.rc-badge-holiday{background:#e2e5e9;color:#495057}.rc-badge-warn{background:#fff4e0;color:#9a6100}';
	$('<style id="recurringUiStyles"></style>').text(css).appendTo('head');
}

function recurringStatusBadge(value){
	var text = value==null ? '' : String(value);
	var tone = text=='Available' ? 'ok' : (text=='Holiday' ? 'holiday' : (text=='NA' ? 'warn' : 'no'));
	if(text==''){
		return '';
	}
	return '<span class="rc-badge rc-badge-'+tone+'">'+text+'</span>';
}

var HOLIDAY_DAYS_CACHE = {};
$(document).on('show', '#meetingDate', function () {
	if ($(this).data('datepicker')) {
		$(this).datepicker('setStartDate', new Date());
	}
	syncHolidayDisabledDates($(this));
});

function holidayBookingTeacherId() {
	if (typeof USER_ROLE != 'undefined' && USER_ROLE == 'TEACHER') {
		return USER_ID;
	}
	var custom = $('#customTeacherId');
	if (custom.length && custom.is(':visible') && custom.val()) {
		return custom.val();
	}
	return $('#teacherId').val() || '';
}

function syncHolidayDisabledDates(picker) {
	var studentStandardId = $('#studentStandardId').val() || $('#studentName').val() || '';
	var teacherUserId = holidayBookingTeacherId();
	var key = studentStandardId + '|' + teacherUserId;
	if (HOLIDAY_DAYS_CACHE[key]) {
		applyHolidayDisabledDates(picker, HOLIDAY_DAYS_CACHE[key]);
		return;
	}
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'holiday-days'),
		data: JSON.stringify({ userId: USER_ID, studentStandardId: studentStandardId, teacherUserId: teacherUserId }),
		dataType: 'json',
		global: false,
		success: function (response) {
			if (response.status == '1') {
				HOLIDAY_DAYS_CACHE[key] = response.days || [];
				applyHolidayDisabledDates(picker, HOLIDAY_DAYS_CACHE[key]);
			}
		}
	});
}

function applyHolidayDisabledDates(picker, days) {
	if (!picker.data('datepicker')) {
		return;
	}
	var dates = $.map(days, function (d) {
		var p = d.split('-');
		return new Date(Date.UTC(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10)));
	});
	picker.datepicker('setDatesDisabled', dates);
}

var TEACHER_BOOKING_CTX = null;
var TB_LAST_COUNTS = {};
var TEACHER_BOOK_MODE = 'ALL_NOTIFY';

var TB_RULE_SETTINGS = null;

function applyTeacherRuleSettings() {
	if (TB_RULE_SETTINGS) {
		$('#tbRuleCancelHours').text(TB_RULE_SETTINGS.cancelCutoffHours);
		$('.tbRuleSaLimit').text(TB_RULE_SETTINGS.schoolAddedLimit);
	}
}

function loadTeacherRuleSettings() {
	if (TB_RULE_SETTINGS) {
		setTimeout(applyTeacherRuleSettings, 0);
		return;
	}
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'booking-rules-settings'),
		data: '{}',
		dataType: 'json',
		global: false,
		success: function (r) {
			if (r && r.status == '1' && r.settings) {
				TB_RULE_SETTINGS = r.settings;
				applyTeacherRuleSettings();
			}
		}
	});
}

function teacherBookingRulesCard() {
	ensureTeacherBookingStyles();
	loadTeacherRuleSettings();
	return '<div class="tb-rules">'
		+ '<h6 class="tb-rules-h">Booking rules</h6>'
		+ '<ul class="tb-rules-list">'
		+ '<li>You can book only for students and courses assigned to you.</li>'
		+ '<li>The student\'s weekly classes are used first. Unused ones expire at week end.</li>'
		+ '<li>Next, rescheduled, extra, or upcoming-week classes are used.</li>'
		+ '<li>If none are left, the class is booked as School-added (limit <span class="tbRuleSaLimit">10</span> per year). These are exceptions made by the school.</li>'
		+ '<li>Click Validate before booking. Nothing is booked until you confirm.</li>'
		+ '<li><span class="tb-pill tb-pill-ok">Can be booked</span> classes are booked on confirm. <span class="tb-pill tb-pill-no">Cannot be booked</span> classes are not booked or held.</li>'
		+ '<li>If you need to book beyond the limit, enter a reason for any class that cannot be booked. The admin is notified and will book it or contact the student.</li>'
		+ '<li>Rescheduling a class can only be done after the class time; it returns the class to the student.</li>'
		+ '</ul></div>';
}

function teacherBalanceTilesHtml(t, title) {
	if (!t) {
		return '';
	}
	var tile = function (cls, n, label, sub) {
		return '<div class="tb-tile ' + cls + '"><span class="tb-n">' + n + '</span><span class="tb-l">' + label + '<small>' + sub + '</small></span></div>';
	};
	var schoolAdded = t.schoolAddedUsed + (t.schoolAddedLimit != null ? ' <em>of ' + t.schoolAddedLimit + '</em>' : '');
	return '<div class="tb-box">' + (title ? '<div class="tb-title">' + escapeTeacherText(title) + ' · balance before this booking</div>' : '')
		+ '<div class="tb-tiles">'
		+ tile('tb-c', t.complimentary, 'Complimentary', 'left this week')
		+ tile('tb-r', t.rescheduled, 'Rescheduled', 'open')
		+ tile('tb-e', t.extra, 'Extra', 'left')
		+ tile('tb-a', schoolAdded, 'School-added', 'this year')
		+ tile('tb-t', '<span class="tbTotal">' + (TB_LAST_COUNTS.total != null ? TB_LAST_COUNTS.total : '-') + '</span>', 'Total', 'classes')
		+ tile('tb-b', '<span class="tbBooked">' + (TB_LAST_COUNTS.booked != null ? TB_LAST_COUNTS.booked : '-') + '</span>', 'Booked', 'classes')
		+ tile('tb-g', '<span class="tbLeft">' + (TB_LAST_COUNTS.left != null ? TB_LAST_COUNTS.left : '-') + '</span>', 'Left', 'classes')
		+ '</div></div>';
}

function ensureTeacherBookingStyles() {
	if (document.getElementById('teacherBookingStyles')) {
		return;
	}
	var css = '.tb-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;margin:6px 0}'
		+ '.tb-tile{display:flex;align-items:center;gap:8px;border:2px solid;border-radius:10px;padding:6px 10px;background:#fff}'
		+ '.tb-n{font-size:24px;font-weight:700;line-height:1}.tb-n em{font-size:11px;font-style:normal;color:#212529}'
		+ '.tb-l{font-size:12px;font-weight:600;line-height:1.2;color:#212529}.tb-l small{display:block;font-weight:400}'
		+ '.tb-c{border-color:#1a8cff}.tb-c .tb-n{color:#1a8cff}.tb-r{border-color:#f39c12}.tb-r .tb-n{color:#f39c12}'
		+ '.tb-e{border-color:#7b3f99}.tb-e .tb-n{color:#7b3f99}.tb-a{border-color:#343a40}.tb-a .tb-n{color:#343a40}.tb-g{border-color:#28a745}.tb-g .tb-n{color:#28a745}.tb-t{border-color:#0d6efd}.tb-t .tb-n{color:#0d6efd}.tb-b{border-color:#6c757d}.tb-b .tb-n{color:#6c757d}'
		+ 'tr.tb-blocked td{background:#fde8ea;color:#212529 !important}tr.tb-blocked td *:not(.tb-pill){color:#212529 !important}'
		+ '.tb-box{background:#f8fafc;border:1px solid #e3e8ef;border-radius:12px;padding:10px 14px;margin:4px 0 14px}'
		+ '.tb-title{font-weight:600;font-size:13.5px;margin-bottom:4px}'
		+ '.tb-scroll thead th{position:sticky;top:0;z-index:2;background:#fff}'
		+ '.tb-scroll .rc-validation-table thead th{background:var(--pc,#007bff);color:#fff}'
		+ '.tb-sumbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:14px 0 6px}'
		+ '.tb-sumbar .tb-pill{font-size:13px;padding:4px 14px}'
		+ '.tb-note{margin:6px 0 14px;font-size:13.5px}'
		+ '.tb-field{position:relative;max-width:820px;margin:10px 0 4px}'
		+ '.tb-field label{position:absolute;top:-9px;left:14px;background:#fff;padding:0 6px;font-size:12px;color:#1967d2;margin:0}'
		+ '.tb-field textarea{width:100%;min-height:70px;border:1px solid #dbe3ee;border-radius:14px;padding:14px 16px;font:inherit;resize:vertical}'
		+ '.tb-hint{color:#dc3545;font-size:13.5px;margin:6px 2px 10px}'
		+ '.tb-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:flex-end;border-top:1px solid #e3e8ef;margin-top:12px;padding:12px 0 0}'
		+ '.tb-actions-note{margin-right:auto;font-size:13px}'
		+ '.tb-actions{gap:6px}.tb-actions .tbModeBtn{padding:6px 11px !important;font-size:12px !important;white-space:nowrap}.tb-actions .tbModeBtn i{font-size:11px}.tb-actions .tb-btn-ghost{padding:6px 12px !important;font-size:12px !important;white-space:nowrap}'
		+ '.tb-btn{border-radius:22px !important;padding:8px 18px !important;font-weight:600;font-size:13.5px;border:1px solid transparent}'
		+ '.tb-btn-ghost{background:#fff;border-color:#cfe0ff;color:#212529}'
		+ '.tb-btn-primary{background:#1a8cff !important;border-color:#1a8cff !important;color:#fff !important}'
		+ '.tb-btn-primary:disabled{opacity:.55}'
		+ '.tb-rules{background:#fff;border:1px solid #e3e8ef;border-radius:14px;padding:16px 20px}'
		+ '.tb-rules-h{font-size:16px;font-weight:600;margin:0 0 10px;display:flex;align-items:center}'
		+ '.tb-rules-h::before{content:"";display:inline-block;width:4px;height:18px;border-radius:2px;background:#1a8cff;margin-right:10px}'
		+ 'ul.tb-rules-list{list-style:disc outside !important;padding-left:22px !important;margin:0}'
		+ 'ul.tb-rules-list li{display:list-item !important;list-style:disc outside !important;margin:6px 0;line-height:1.6}'
		+ '.tb-pill{display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;color:#fff !important;white-space:nowrap}'
		+ '.tb-pill-ok{background:#28a745}.tb-pill-no{background:#dc3545}.tb-pill-grey{background:#e9ecef;color:#212529 !important}';
	$('<style id="teacherBookingStyles"></style>').text(css).appendTo('head');
}

function loadTeacherClassCounts(studentStandardId, subjectId) {
	var data = { userId: USER_ID, subjectId: subjectId, studentStandardId: studentStandardId, callFrom: USER_ROLE, startDate: '', endDate: '', dateType: '' };
	$.ajax({
		type: 'GET',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'student-booked-classes-details?payload=' + encode(JSON.stringify(data))),
		dataType: 'json',
		cache: false,
		global: false,
		success: function (r) {
			var c = r && r.subjectCountDatials;
			if (c) {
				TB_LAST_COUNTS = { total: c.total, booked: c.booked, left: c.left };
				$('.tbTotal').text(c.total);
				$('.tbBooked').text(c.booked);
				$('.tbLeft').text(c.left);
			}
		}
	});
}

function loadTeacherBalanceTiles(target, studentStandardId, subjectId, allowAdmin) {
	var mf = $('#classroomSessionFilter #meetingFor').val() || (allowAdmin ? $('#recurringClass #meetingType').val() : '');
	if (mf == 'PTM' || mf == 'CUSTOM') {
		$(target).html('');
		return;
	}
	if (typeof USER_ROLE == 'undefined' || (USER_ROLE != 'TEACHER' && !allowAdmin) || !studentStandardId || !subjectId) {
		$(target).html('');
		return;
	}
	ensureTeacherBookingStyles();
	ensureRecurringUiStyles();
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'booking-balance-tiles'),
		data: JSON.stringify({ userId: USER_ID, studentStandardId: studentStandardId, subjectId: subjectId }),
		dataType: 'json',
		global: false,
		success: function (response) {
			var student = $('#classroomSessionFilter #studentName option:selected').text().split(' (')[0] || (allowAdmin ? $.trim($('#recurringClass #studentName').val() || '') : '');
			var course = $('#classroomSessionFilter #subjectIds option:selected').text().split(' (')[0] || (allowAdmin ? $('#recurringClass #subjectIds option:selected').text().split(' (')[0] : '');
			var title = student && course ? student + ' · ' + course : '';
			$(target).html(response.status == '1' ? teacherBalanceTilesHtml(response.tiles, title) : '');
			if (response.status == '1' && response.tiles) {
				loadTeacherClassCounts(studentStandardId, response.tiles.countSubjectId != null ? response.tiles.countSubjectId : subjectId);
				if (response.tiles.cancelCutoffHours != null) {
					$('#tbRuleCancelHours').text(response.tiles.cancelCutoffHours);
				}
				if (response.tiles.schoolAddedLimit != null) {
					$('.tbRuleSaLimit').text(response.tiles.schoolAddedLimit);
				}
			}
		}
	});
}

var TEACHER_TILES_TIMER = null;
$(document).on('change', '#classroomSessionFilter #meetingFor, #classroomSessionFilter #standardId', function () {
	clearInterval(TEACHER_TILES_TIMER);
	$('#teacherFormBalanceTiles').html('');
});
$(document).on('change', '#classroomSessionFilter #subjectIds, #classroomSessionFilter #studentName', function () {
	clearInterval(TEACHER_TILES_TIMER);
	var tries = 0;
	var load = function () {
		var subjectId = $('#classroomSessionFilter #subjectIds').val();
		if (!$('#classroomSessionFilter #studentName').val()) {
			clearInterval(TEACHER_TILES_TIMER);
			$('#teacherFormBalanceTiles').html('');
			return;
		}
		if (subjectId || tries++ > 20) {
			clearInterval(TEACHER_TILES_TIMER);
			loadTeacherBalanceTiles('#teacherFormBalanceTiles', $('#classroomSessionFilter #studentName').val(), subjectId);
		}
	};
	TEACHER_TILES_TIMER = setInterval(load, 300);
	load();
});

function escapeTeacherText(value) {
	return $('<div/>').text(value == null ? '' : String(value)).html();
}

function enhanceTeacherValidation(rows, ctx) {
	var table = $('#trRecurring').closest('table');
	if (table.find('thead th').length < 8) {
		return;
	}
	ensureRecurringUiStyles();
	ensureTeacherBookingStyles();
	TEACHER_BOOKING_CTX = ctx;
	var can = 0, cannot = 0, notify = 0, overLimitCount = 0;
	$('#trRecurring > tr').each(function (i) {
		var r = rows[i] || {};
		var status = r.bookingStatus || '';
		var pill = status == 'Can be booked' ? 'tb-pill tb-pill-ok' : (status == 'Holiday' ? 'tb-pill tb-pill-grey' : 'tb-pill tb-pill-no');
		if (status == 'Can be booked') { can++; } else if (status != 'Holiday' && status != '') {
			cannot++;
			$(this).addClass('tb-blocked');
			if (String(r.bookingReason || '').indexOf('School-added limit reached') == 0) { overLimitCount++; }
		}
		if (r.notifyAdmin) { notify++; }
		var schoolAddedRow = status == 'Can be booked' && r.drawsFrom && String(r.drawsFrom).indexOf('School-added') == 0;
		if (schoolAddedRow) { pill = 'tb-pill tb-pill-ok tb-sa-pill'; }
		var reason = r.bookingReason ? '<div class="font-12">' + escapeTeacherText(r.bookingReason).split('~').join('<br>') + '</div>' : '';
		var saBg = '';
		$(this).append('<td' + saBg + '>' + (status ? '<span class="' + pill + '"' + (schoolAddedRow ? ' style="background:#ffc107 !important;color:#000 !important"' : '') + '>' + escapeTeacherText(status) + '</span>' : '') + reason + '</td>');
		$(this).append('<td' + saBg + '>' + (r.drawsFrom ? '<span class="rc-badge ' + 'rc-badge-holiday' + '">' + escapeTeacherText(r.drawsFrom) + '</span>' : '—') + '</td>');
	});
	if (USER_ROLE != 'TEACHER') {
		return;
	}
	var studentStandardId = $('#classroomSessionFilter #studentName').val() || $('#studentStandardId').val();
	var subjectId = $('#classroomSessionFilter #subjectIds').val() || $('#subjectIds').val();
	loadTeacherBalanceTiles('#teacherBookingTiles', studentStandardId, subjectId);
	var schoolAddedPlanned = 0;
	$.each(rows, function (i, r) {
		if (r.bookingStatus == 'Can be booked' && r.drawsFrom && r.drawsFrom.indexOf('School-added') == 0) {
			schoolAddedPlanned++;
		}
	});
	var footer = '<div class="tb-sumbar">'
		+ '<span class="tb-pill tb-pill-ok">' + can + ' can be booked</span>'
		+ (cannot - overLimitCount > 0 ? '<span class="tb-pill tb-pill-no">' + (cannot - overLimitCount) + ' not available</span>' : '')
		+ (overLimitCount > 0 ? '<span class="tb-pill" style="background:#7a4dff !important">' + overLimitCount + ' over School-added limit</span>' : '')
		+ '<span class="tb-pill tb-pill-grey" id="teacherAfterBooking" style="display:none"></span>'
		+ '</div>';
	if (cannot > 0) {
		footer += '<p class="tb-note">'
			+ (cannot - overLimitCount > 0 ? (cannot - overLimitCount) + ' not available (slot busy, weekly cap, etc.) are not created. ' : '')
			+ (overLimitCount > 0 ? (notify > 0 ? overLimitCount + ' over the School-added limit are sent to school admin as a support request when you choose notify.' : overLimitCount + ' over the School-added limit are not created.') : '')
			+ '</p>';
	}
	if (notify > 0) {
		footer += '<div class="tb-field"><label for="teacherAdminReason">Reason for admin (required when any class cannot be booked)<span class="text-danger"> *</span></label>'
			+ '<textarea id="teacherAdminReason" rows="3" placeholder="Why does the student need the blocked classes? Admin reads this before booking or contacting the parent."></textarea></div>'
			+ '<div class="tb-hint" id="teacherAdminReasonHint">Enter a reason to continue. The blocked classes are sent to school admin on chat.</div>';
	}
	footer += '<div class="tb-actions" id="teacherBookingActions"><span class="tb-actions-note">Nothing is booked until you confirm.'
		+ (notify > 0 ? ' Admin is notified on chat about the ' + notify + ' blocked class' + (notify > 1 ? 'es' : '') + '.' : '') + '</span>'
		+ '<button type="button" class="tb-btn tb-btn-ghost" data-dismiss="modal">Cancel · book nothing</button></div>';
	var movedButtons = $('#teacherBookingActions').find('.meetingSlotAdd, .proceedRecurringClassbtn, #teacherNotifyAdminBtn').detach();
	$('#teacherBookingFooter').html(footer);
	$('#teacherBookingActions').append(movedButtons);
	teacherAfterBookingLine(studentStandardId, subjectId, schoolAddedPlanned);
	$('.validator-message').hide();
	$('.proceedRecurringClassbtn, .meetingSlotAdd').not('#recurringClassShowModel .proceedRecurringClassbtn, #recurringClassShowModel .meetingSlotAdd').hide();
	var saveBtn = ctx.oneDay ? $('#recurringClassShowModel .meetingSlotAdd') : $('#recurringClassShowModel .proceedRecurringClassbtn');
	var notifyBtn = $('#teacherNotifyAdminBtn');
	notifyBtn.hide();
	if (ctx.oneDay) {
		$('#recurringClassShowModel .proceedRecurringClassbtn').hide();
		if (can > 0) {
			saveBtn.show().html('<i class="fa fa-check"></i>&nbsp;<span>Book</span>');
		} else {
			saveBtn.hide();
			if (notify > 0) {
				notifyBtn.show();
			}
		}
	} else if (can > 0) {
		saveBtn.show().html('<i class="fa fa-check"></i>&nbsp;<span>Book ' + can + (notify > 0 ? ' and notify admin' : '') + '</span>');
	} else if (notify > 0) {
		saveBtn.hide();
		notifyBtn.show();
	} else {
		saveBtn.hide();
	}
	var actions = $('#teacherBookingActions');
	saveBtn.addClass('tb-btn tb-btn-primary').removeClass('float-right btn-sm btn-success').appendTo(actions);
	notifyBtn.addClass('tb-btn tb-btn-primary').removeClass('float-right btn-sm btn-primary ml-2').appendTo(actions);
	TEACHER_BOOK_MODE = 'ALL_NOTIFY';
	var modeBtns = [];
	if (!ctx.oneDay && can > 0 && (schoolAddedPlanned > 0 || notify > 0)) {
		var plain = can - schoolAddedPlanned;
		var addMode = function (label, mode, needsReason) {
			var b = $('<button type="button" class="tb-btn tb-btn-primary tbModeBtn"></button>').html('<i class="fa fa-check"></i> ' + label);
			b.on('click', function () {
				TEACHER_BOOK_MODE = mode;
				saveBtn.prop('disabled', false);
				saveBtn[0].click();
			});
			b.data('needsReason', needsReason);
			modeBtns.push(b);
			b.appendTo(actions);
		};
		if (schoolAddedPlanned > 0 && plain > 0) {
			addMode('Book ' + plain + ' (within balance)', 'BALANCE', false);
		}
		addMode('Book ' + can + (schoolAddedPlanned > 0 ? ' (incl. ' + schoolAddedPlanned + ' School-added)' : ''), 'ALL', false);
		if (notify > 0) {
			addMode('Book ' + can + ' and notify admin for ' + notify, 'ALL_NOTIFY', true);
		}
		saveBtn.hide();
	}
	var gate = function () {
		var ok = notify == 0 || $.trim($('#teacherAdminReason').val() || '') != '';
		saveBtn.prop('disabled', !ok);
		notifyBtn.prop('disabled', !ok);
		$.each(modeBtns, function (i, b) { b.prop('disabled', b.data('needsReason') && !ok); });
		var needReasonVisible = !ok && (modeBtns.length == 0 || notify > 0);
		$('#teacherAdminReasonHint').toggle(needReasonVisible);
	};
	$(document).off('input.teacherReason').on('input.teacherReason', '#teacherAdminReason', gate);
	gate();
}

function teacherAfterBookingLine(studentStandardId, subjectId, schoolAddedPlanned) {
	if (!studentStandardId || !subjectId) {
		return;
	}
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'booking-balance-tiles'),
		data: JSON.stringify({ userId: USER_ID, studentStandardId: studentStandardId, subjectId: subjectId }),
		dataType: 'json',
		global: false,
		success: function (response) {
			if (response.status != '1' || !response.tiles) {
				return;
			}
			var t = response.tiles;
			var used = t.schoolAddedUsed + schoolAddedPlanned;
			$('#teacherAfterBooking').text('After booking: School-added ' + used + (t.schoolAddedLimit != null ? ' of ' + t.schoolAddedLimit : '')).show();
		}
	});
}

function teacherNotifyAdmin() {
	var ctx = TEACHER_BOOKING_CTX;
	if (!ctx) {
		return false;
	}
	var reason = $.trim($('#teacherAdminReason').val() || '');
	if (reason == '') {
		showMessageTheme2(0, 'Please enter the reason for admin.');
		return false;
	}
	if (!ctx.oneDay) {
		$('#teacherNotifyAdminBtn').prop('disabled', true);
		$('#recurringClassShowModel').modal('hide');
		submitRecurringClass('classroomSessionFilter', typeof MODULE_ID != 'undefined' ? MODULE_ID : 0);
		return false;
	}
	var request = getRequestForSubmitMeetingForStudentSessionSlotsNew(ctx.formId, ctx.moduleId, 'VALIDATE', ctx.meetingType);
	request['adminReason'] = reason;
	request['userId'] = USER_ID;
	$('#teacherNotifyAdminBtn').prop('disabled', true);
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'over-limit-notify-admin'),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function (response) {
			if (response.status == '1') {
				$('#recurringClassShowModel').modal('hide');
				showMessageTheme2(response.statusCode == 'NOTIFIED' ? 1 : 0, response.message);
			} else {
				$('#teacherNotifyAdminBtn').prop('disabled', false);
				showMessageTheme2(0, response.message);
			}
		},
		error: function () {
			$('#teacherNotifyAdminBtn').prop('disabled', false);
			showMessageTheme2(0, 'Could not send the message to admin. Please try again.');
		}
	});
	return false;
}


function syncPtmSaturdayOnly() {
	var ptm = $('#recurringClass #meetingType').val() == 'PTM' || $('#classroomSessionFilter #meetingFor').val() == 'PTM';
	if (!document.getElementById('ptmSaturdayStyle')) {
		$('<style id="ptmSaturdayStyle"></style>').text('body.ptm-saturday-only .datepicker-days td.day:not(:nth-child(7)){opacity:.3;pointer-events:none;cursor:not-allowed}').appendTo('head');
	}
	$('body').toggleClass('ptm-saturday-only', ptm);
	if (ptm) {
		var picker = $('#recurringClass #meetingDate');
		var chosen = picker.length && picker.data('datepicker') ? picker.datepicker('getDate') : null;
		if (chosen && chosen.getDay() !== 6) {
			picker.val('');
		}
	}
}

function lockRecurringPtmDuration() {
	syncPtmSaturdayOnly();
	var form = $('#recurringClass');
	if (!form.length) {
		return;
	}
	var duration = form.find('#classDuration');
	if (form.find('#meetingType').val() == 'PTM') {
		if (duration.find('option[value="15"]').length == 0) {
			duration.append('<option value="15">15</option>');
		}
		if (duration.val() != '15') {
			duration.val('15').trigger('change');
		}
		duration.prop('disabled', true);
	} else if (duration.prop('disabled')) {
		duration.prop('disabled', false);
		if (duration.val() == '15') {
			duration.val('50').trigger('change');
		}
	}
}

$(document).on('change', '#recurringClass #meetingType', lockRecurringPtmDuration);
$(document).ajaxComplete(function () {
	setTimeout(lockRecurringPtmDuration, 0);
});


function hideCountTilesForPtmAndCustom() {
	var forType = $('#classroomSessionFilter #meetingFor').val();
	var recurringType = $('#recurringClass #meetingType').val();
	var noCount = forType == 'PTM' || forType == 'CUSTOM' || recurringType == 'PTM' || recurringType == 'CUSTOM';
	if (noCount) {
		$('#classRecodsTumbs, #teacherFormBalanceTiles, #teacherBookingTiles').hide();
	} else {
		$('#teacherFormBalanceTiles, #teacherBookingTiles').show();
	}
}

$(document).on('change', '#classroomSessionFilter #meetingFor, #recurringClass #meetingType', function () {
	hideCountTilesForPtmAndCustom();
	if ($('#classroomSessionFilter #meetingFor').val() != 'PTM' && $('#classroomSessionFilter #meetingFor').val() != 'CUSTOM'
		&& $('#recurringClass #meetingType').val() != 'PTM' && $('#recurringClass #meetingType').val() != 'CUSTOM') {
		$('#classRecodsTumbs').show();
	}
});
$(document).ajaxComplete(function () {
	setTimeout(hideCountTilesForPtmAndCustom, 0);
});


if (!window.__ptmRecurringDurationTimer) {
	window.__ptmRecurringDurationTimer = setInterval(lockRecurringPtmDuration, 300);
}
