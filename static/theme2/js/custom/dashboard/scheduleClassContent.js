
function meetingDataByType(data, userId){
	$('#classroomSessionFilter #meetingSubject').val('');
	$('#classroomSessionFilter #meetingDate').val('');
	$('#classroomSessionFilter #duration').val('50');
	if(data=='SELF'){
		$('#studentNameDiv').hide();
		$('#courseNameDiv').hide();
		$('#meetingTypeDiv').hide();
		$('#classroomSessionFilter #meetingSubject').prop('disabled',false);
		$('#classroomSessionFilter #meetingSubject').val("");
		$('#classroomSessionFilter #standardIdDiv').hide();
		$('#manageSessionContentDiv').hide();
		$(".countryTimezoneWrapper, .meetingDateWrapper, .startTimeHoursWrapper, .durationWrapper").show();
	}else{
		$('#studentNameDiv').show();
		$('#courseNameDiv').show();
		$('#meetingTypeDiv').show();
		$('#classroomSessionFilter #standardIdDiv').show();
		$('#classroomSessionFilter #meetingSubject').prop('disabled',true);
		if($('#classroomSessionFilter #meetingFor').val()=='RM'){
			$('#manageSessionContentDiv').show();
			$(".countryTimezoneWrapper, .meetingDateWrapper, .startTimeHoursWrapper, .durationWrapper").hide();
		}
		
	}
}

function getMeetingTitle(){
	var stname = $('#classroomSessionFilter #studentName option:selected').text().split('(')[0].trim();
	var subjectName =$('#classroomSessionFilter #subjectIds option:selected').text();
	//var meetingSubject = "Student Doubt Class - " + stname + " (" + subjectName + ")";
	var meetingSubject =  stname + " | " + subjectName;
	
	$('#classroomSessionFilter #meetingSubject').val(meetingSubject);
	// getTeacherList('classroomSessionFilter');
}

function getRequestForSubmitMeetingForStudentSessionSlotsNew(formId,moduleId,controllType, requestType){
	var request = {};
	var authentication = {};
	var dashboardCommonDTO = {}
	var meetingSlotDTO= {};
	var subjectId = $('#'+formId+' #subjectIds').val();
	var mTitle = $('#'+formId+' #meetingSubject').val();
	var mType ='STUDENT_DOUBT_SESSION';
	var mFor=$('#'+formId+' #meetingFor').val();
	if(mFor=="PTM"){
		mType =mFor;
	}
	if(formId=='recurringClass'){
		if($('#'+formId+' #meetingType').val()=="PTM"){
			mType='PTM';
		}
		if($('#'+formId+' #meetingType').val()=="CUSTOM"){
			mType='CUSTOM';
		}
		meetingSlotDTO['durationMins'] = $('#'+formId+' #classDuration').val();
		meetingSlotDTO['timezone'] = $('#'+formId+' #countryTimezoneFromId').val();
		meetingSlotDTO['studentTimezone'] = $("#" + formId + " #studentTimezoneId").val();
		meetingSlotDTO['meetingPersoneId'] = $("#" + formId + " #studentId").val();
		meetingSlotDTO['schoolPersonId'] = $("#" + formId + " #teacherId").val();
		meetingSlotDTO['paymentCheck'] = $("#" + formId + " #paymentCheck").val();
		authentication['userId'] = $("#" + formId + " #teacherId").val();
		if($("#" + formId + " #teacherId").val()==null || $("#" + formId + " #teacherId").val()==undefined || $("#" + formId + " #teacherId").val()=='' ){
			if(mType=='CUSTOM'){
				authentication['userId'] = $("#" + formId + " #customTeacherId").val();
			}
		}
		meetingSlotDTO['subjectId'] = $("#" + formId + " #subjectIds").val();
		meetingSlotDTO['meetingVendor'] = $("#" + formId + " #meetingVendor").val();
		meetingSlotDTO['studentStandardId'] = $("#" + formId + " #studentStandardId").val();
	}else{
		 mType = $('#classroomSessionFilter #meetingType').val();
		var studentStandardId = $('#classroomSessionFilter #studentName').val();
		var stndard = $('#classroomSessionFilter #standardId').val();
		if(mFor=="PTM" || mFor=="CUSTOM" ){
			mType =mFor;
		}
		if(mType==null || mType==undefined || mType=='0' ||mType=='' ){
			mType = 'STUDENT_DOUBT_SESSION'
		}
			
		meetingSlotDTO['studentStandardId'] = studentStandardId;
		meetingSlotDTO['standardId'] = stndard;
		meetingSlotDTO['timezone'] = $("#classroomSessionFilter #countryTimezone").val();
		meetingSlotDTO['durationMins'] = $('#classroomSessionFilter #duration').val();
		meetingSlotDTO['subjectId'] = $("#classroomSessionFilter #subjectIds").val();
		authentication['userId'] = $("#classroomSessionFilter #userId").val().trim();
	}
	
	meetingSlotDTO['meetingType'] = mType;//"STUDENT_DOUBT_SESSION";
	var  mDtae= $('#' + formId +' #meetingDate').val();
	
	mDtae=changeDateFormat(new Date(mDtae), 'dd-mm-yyyy');
	
	meetDate = mDtae.split("-");
	meetingDate = meetDate[2]+"-"+meetDate[1]+"-"+meetDate[0];
	meetingSlotDTO['meetingDate'] = meetingDate;
	meetingSlotDTO['subject'] = mType;
	if(mType=="CUSTOM"){
		meetingSlotDTO['subject']=$('#'+formId+' #customTitle').val();
	}
	meetingSlotDTO['timeHrsFrom'] = $('#'+formId+' #startTimeHours').val();
	meetingSlotDTO['timeMinFrom'] = $('#'+formId+' #startTimeMins').val();
	
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	
	request['authentication'] = authentication;
	request['meetingSlotsDTO'] = meetingSlotDTO;
	return request;
}

function meetingSlotModalForValidateScheduleClass(formId,moduleId){
	$(".meetingSlotAdd").prop("disabled", true);
	var controllType ='VALIDATE';
	var meetingType = $('#'+formId+' #meetingType').val();
	var tZone = $('#'+formId+' #countryTimezone').val();
	var mDate = $('#'+formId+' #meetingDate').val();
	var sTimeHours = $('#'+formId+' #startTimeHours').val();
	var sTimeMins = $('#'+formId+' #startTimeMins').val();
	var duration = $('#'+formId+' #duration').val();
	var mTitle = $('#'+formId+' #meetingSubject').val();
	var meetingVendor = $("#" + formId + " #meetingVendor").val();
	var meetingFor = $("#" + formId + " #meetingFor").val();
	var classDuration = $("#" + formId + " #classDuration").val();
	$("#teacherAvailabilityTable").hide();
	$(".proceedRecurringClassbtn").hide();	
	if(formId=='recurringClass'){
		meetingFor=meetingType;
		duration = $('#'+formId+' #classDuration').val();
		var userNameOrEmail = $('#'+formId+' #userNameOrEmail').val();
		if(meetingType!="CUSTOM"){
			if(userNameOrEmail==undefined  || userNameOrEmail==null || userNameOrEmail==0 || userNameOrEmail==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Student Email is required");
				return false;
	
			}
			var sName = $('#recurringClass #studentName').val();
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Student Name is required");
				return false;
			}
			var cName = $('#recurringClass #subjectIds').val();
			if(cName==undefined || cName==null ||  cName==0 || cName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Course Name required");
				return false;
			}
		}else{
			var teacherId = $("#" + formId + " #customTeacherId").val();
			if(teacherId == undefined || teacherId == null ||  teacherId == 0 || teacherId == ''){
				teacherId = $("#" + formId + " #teacherId").val();
			}
			if(teacherId == undefined || teacherId == null ||  teacherId == 0 || teacherId == ''){
				showMessage(true, "Please select teacher to create custom class.");
				return false;
			}
		}
		if($("#" + formId + " #recurringType").val()==undefined || $("#" + formId + " #recurringType").val()==''){
			showMessage(true, "Class Type is required.");
			return false;
		}
		if(meetingVendor==undefined  || meetingVendor==null || meetingVendor==0 || meetingVendor==''){
			showMessage(true, "Meeting Vendor is required.");
			return false;
		}classDuration
		if(classDuration==undefined  || classDuration==null || classDuration==0 || classDuration==''){
			showMessage(true, "Classroom Duration is required.");
			return false;
		}

	}else{
		meetingType = 'STUDENT_DOUBT_SESSION';
		if(meetingFor=="CUSTOM"){
			meetingType ="CUSTOM";
		}
		if(meetingType=='STUDENT_DOUBT_SESSION'){
			var sName = $('#classroomSessionFilter #studentName').val();
			var cName = $('#classroomSessionFilter #subjectIds').val();
			var stndard = $('#classroomSessionFilter #standardId').val();
			if(stndard==undefined  || stndard=='' || stndard==0){
				$(".meetingSlotAdd").prop("disabled", false);
				if(USER_ROLE == 'TEACHER'){
					showMessageTheme2(0, "Grade field is required")
				}else{
					showMessage(true, "Grade field is required");
				}
				return false;
			}
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				if(USER_ROLE == 'TEACHER'){
					showMessageTheme2(0, "Student Name required")
				}else{
					showMessage(true, "Student Name required");
				}
				return false;
			}
			if($('#classroomSessionFilter #meetingFor').val()!='PTM'){
				if(cName==undefined || cName==null ||  cName==0 || cName==''){
					$(".meetingSlotAdd").prop("disabled", false);
					if(USER_ROLE == 'TEACHER'){
						showMessageTheme2(0, "Course Name required");
					}else{
						showMessage(true, "Course Name required");
					}
					return false;
				}
			}else{
				cName=0;
			}
			
		}
		// if(mTitle==undefined || mTitle==null ||  mTitle==''){
		// 	$(".meetingSlotAdd").prop("disabled", false);
		// 	showMessage(true, "Meeting Title field is required");
		// 	return false;
		// }
		if(duration==undefined || duration==null || duration==0 || duration==''){
			$(".meetingSlotAdd").prop("disabled", false);
			showMessage(true, "Duration field is required");
			return false;
		}
	}
	if(meetingFor=="CUSTOM"){
		if($("#" + formId + " #customTitle").val()==undefined || $("#" + formId + " #customTitle").val()==''){
			if(USER_ROLE != 'TEACHER'){
				showMessage(true, "Class Title is required");
			}else{
				showMessageTheme2(0, "Class Title is required");
			}
			return false;
		}
	}
	if(mDate==undefined || mDate==null || mDate==0 || mDate==''){
		$(".meetingSlotAdd").prop("disabled", false);
		if(USER_ROLE == 'TEACHER'){
			showMessageTheme2(0, "Meeting Date field is required");
		}else{
			showMessage(true, "Meeting Date field is required");
		}
		return false;
	}
	if(sTimeHours==undefined || sTimeHours==null || sTimeHours==''){
		$(".meetingSlotAdd").prop("disabled", false);
		if(USER_ROLE == 'TEACHER'){
			showMessageTheme2(0, "Start Time field is required");
		}else{
			showMessage(true, "Start Time field is required");
		}
		return false;
	}
	if(sTimeMins==undefined || sTimeMins==null || sTimeMins=='' ){
		$(".meetingSlotAdd").prop("disabled", false);
		if(USER_ROLE == 'TEACHER'){
			showMessageTheme2(0, "Start Time field is required");
		}else{
			showMessage(true, "Start Time field is required");
		}
		return false;
	}
	$(".meetingSlotAdd").prop("disabled", true);
	hideMessage('');
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('dashboard','validate-meetingslots-new-submit-by-teacher'),
		data : JSON.stringify(getRequestForSubmitMeetingForStudentSessionSlotsNew(formId, moduleId,controllType, meetingType)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				customLoader(false);
				$(".meetingSlotAdd").prop("disabled", false);
				if(USER_ROLE == 'TEACHER'){
					showMessageTheme2(0, data['message']);
				}else{
					showMessage(true, data['message']);
				}
			} else {
				$('.meetingSlotAdd').show();
				customLoader(false);
				if(tt == "theme2"){
					var meetingTypeValue = $("#meetingFor").val();
				}else{
					var meetingTypeValue = $("#meetingType").val();
				}
				var recurringclassForAA = data['recurringClassListForAvailability'];
				if(meetingTypeValue != "RM" && tt != "theme2"){
					$("#recurringClassShowModel").modal("hide");
					$("#recurringClassShowModelValidation").modal("show");
					if(recurringclassForAA.length > 0){
						$("#teacherAvailabilityWarningTitle").html(`<h4 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h4>`);
						
					}else{
						$("#teacherAvailabilityWarningTitle").html(``);
					}
				}else{
					$("#recurringClassShowModel").modal('show');
					if(recurringclassForAA.length > 0){
						$("#teacherAvailabilityWarningTitle").html(`<h5 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h5>`);
						$(".meetingSlotAdd > span").text("Save anyway");
					}else{
						$("#teacherAvailabilityWarningTitle").html(``);
						$(".meetingSlotAdd > span").text("Save");
					}
				}
				var recurringclass = data['recurringClassList'];
				var htmlRecu = "";
				var inc=1;
				var validRecurringClass=true;
				for(var i=0;i<recurringclass.length;i++){
					if(recurringclass[i]['slotAvailable']!='Available'){
						$("#teacherAvailabilityWarningTitle").html(``);
						htmlRecu = htmlRecu +"<tr class='text-danger'>";
					}else{
						htmlRecu = htmlRecu +"<tr>";
					}
					htmlRecu = htmlRecu +" <td>"+(inc++)+"</td>";
					htmlRecu = htmlRecu +"<td>"
					+'<p class="mb-0">'+recurringclass[i]['studentName']+'</p>'
					+'<p class="mb-0">'+recurringclass[i]['teachName']+'</p>'
					+'<p class="mb-0">'+recurringclass[i]['subjects']+'</p>'
					+"</td>";
					htmlRecu = htmlRecu +"<td>"
						+'<p class="mb-0"><b>Teacher Timezone: </b>'+recurringclass[i]['teacherTime']+'</p>'
						var studentTime = recurringclass[i]['studentTime'];
						if(studentTime!=null && studentTime!=undefined && studentTime!=''){
							htmlRecu +='<p class="mb-0"><b>Student Timezone: </b>'+studentTime+'</p>';
						}
						if(USER_ROLE == 'TEACHER'){
						}else{
							htmlRecu +='<p class="mb-0"><b>Admin Timezone: </b>'+recurringclass[i]['meetingDate']+" ("+recurringclass[i]['startTime']+" - "+recurringclass[i]['endTime']+')</p>';
						}
					htmlRecu +="</td>";
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
					$('.meetingSlotAdd').show();
					$(".validator-message").hide()
				}else{
					$('.meetingSlotAdd').hide();
					$(".validator-message").show()
				}
				$("#trRecurring").html(htmlRecu);
				

				if(meetingTypeValue==null || meetingTypeValue==undefined || meetingTypeValue==''){
					meetingTypeValue ="ODM";
				}
				
				if(meetingTypeValue == "ODM" || meetingTypeValue == "PTM"  ){
					if(formId!='classroomSessionFilter'){
						$("#meetingType").val(meetingTypeValue);
					}
					$(".hide-on-odm").hide();
					$(".hide-on-rm, #meetingTypeNote").show();
				}else if(meetingTypeValue == "RM"){
					$(".hide-on-odm").show();
					$(".hide-on-rm, #meetingTypeNote").hide();
				}
				$(".meetingSlotAdd").prop("disabled", false);
				// if(USER_ROLE == 'TEACHER'){
				// 	showMessageTheme2(0, data['message']);
				// }else{
				// 	showMessage(false, data['message']);
				// }
				if(controllType=='ADD'){
					$('#'+formId)[0].reset();
					meetingDataByType('STUDENT_DOUBT_SESSION');
					
					// setTimeout(function(){ callDashboardPageSchool(moduleId,'schedule-a-session',''); }, 1000);
				}
		
			}
			customLoader(false);
			return false;
		}
	});
	$(".meetingSlotAdd").prop("disabled", false);
}

function meetingSlotModalForScheduleClass(formId,moduleId){
	$(".meetingSlotAdd").prop("disabled", true);
	var controllType ='ADD';
	var meetingType = $('#'+formId+' #meetingType').val();
	var tZone = $('#'+formId+' #countryTimezone').val();
	var mDate = $('#'+formId+' #meetingDate').val();
	var sTimeHours = $('#'+formId+' #startTimeHours').val();
	var sTimeMins = $('#'+formId+' #startTimeMins').val();
	var duration = $('#'+formId+' #duration').val();
	var mTitle = $('#'+formId+' #meetingSubject').val();
	var meetingFor = $("#" + formId + " #meetingFor").val();
	if((meetingType == null || meetingType == undefined || meetingType == '') && USER_ROLE == "TEACHER"){
		if(meetingFor == 'ODM'){
			meetingType = "STUDENT_DOUBT_SESSION";
		}else{
			meetingType = meetingFor;
		}
	}
	if(formId=='recurringClass'){
		duration = $('#'+formId+' #classDuration').val();
		var userNameOrEmail = $('#'+formId+' #userNameOrEmail').val();
		if(meetingType!="CUSTOM"){
			if(userNameOrEmail==undefined  || userNameOrEmail==null || userNameOrEmail==0 || userNameOrEmail==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Student Email is required");
				return false;
	
			}
			var sName = $('#recurringClass #studentName').val();
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Student Name is required");
				return false;
			}
			var cName = $('#recurringClass #subjectIds').val();
			if(cName==undefined || cName==null ||  cName==0 || cName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Course Name required");
				return false;
			}
		}else{
			if(userNameOrEmail==undefined  || userNameOrEmail==null || userNameOrEmail==0 || userNameOrEmail==''){
				if($("#" + formId + " #customTeacherId").val()==undefined || $("#" + formId + " #customTeacherId").val()==''){
					showMessage(true, "Please Select teacher to create custom class");
					return false;
				}
	
			}
		}
		if($("#" + formId + " #recurringType").val()==undefined || $("#" + formId + " #recurringType").val()==''){
			showMessage(true, "Class Type is required.");
			return false;
		}

	}else{
		if(meetingFor=="PTM" || meetingFor == "CUSTOM"){
			meetingType =meetingFor;
		}
		if(meetingType==null || meetingType==undefined || meetingType=='0' ||meetingType=='' ){
			mType = 'STUDENT_DOUBT_SESSION'
		}
		if(meetingType=='STUDENT_DOUBT_SESSION'){
			var sName = $('#classroomSessionFilter #studentName').val();
			var cName = $('#classroomSessionFilter #subjectIds').val();
			var stndard = $('#classroomSessionFilter #standardId').val();
			if(stndard=='' || stndard==0){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Grade field is required");
				return false;
			}
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Student Name required");
				return false;
			}
			if(cName==undefined || cName==null ||  cName==0 || cName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessage(true, "Course Name required");
				return false;
			}
		}
		
		if(duration==undefined || duration==null || duration==0 || duration==''){
			$(".meetingSlotAdd").prop("disabled", false);
			showMessage(true, "Duration field is required");
			return false;
		}
	}
	if(mDate==undefined || mDate==null || mDate==0 || mDate==''){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessage(true, "Meeting Date field is required");
		return false;
	}
	if(sTimeHours==undefined || sTimeHours==null || sTimeHours==''){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessage(true, "Start Time field is required");
		return false;
	}
	if(sTimeMins==undefined || sTimeMins==null || sTimeMins=='' ){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessage(true, "Start Time field is required");
		return false;
	}
	$(".meetingSlotAdd").prop("disabled", true);
	hideMessage('');
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('dashboard','meetingslots-new-submit-by-teacher'),
		data : JSON.stringify(getRequestForSubmitMeetingForStudentSessionSlotsNew(formId, moduleId,controllType, meetingType)),
		dataType : 'json',
		success : function(data) {
			$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
			if (data['status'] == '0' || data['status'] == '2') {
				customLoader(false);
				$(".meetingSlotAdd").prop("disabled", false);
				if(tt=="theme2"){
					showMessageTheme2(0, data['message']);
				}else{
					showMessage(true, data['message']);
				}
			} else {
				customLoader(false);
				$(".meetingSlotAdd").prop("disabled", false);
				if(USER_ROLE=='TEACHER'){
					if(data['message']=='MEETING SAVED SUCCESSFULLY'){
						showMessageTheme2(1, data['message']);
					}else{
						showMessageTheme2(0, data['message']);
					}
				}else{
					showMessage(false, data['message']);
				}
				if(controllType=='ADD'){
					$('#'+formId)[0].reset();
					$("#standardId").prop('selectedIndex',0);
					$("#startTimeHours").prop('selectedIndex',0);
					$("#startTimeMins").prop('selectedIndex',0);
					$('#studentName').empty().trigger("change");
					$('#subjectIds').find('option').remove();
					$('#studentId').val('');
					meetingDataByType('STUDENT_DOUBT_SESSION');
					$("#recurringClassShowModel").modal('hide');
					$('#'+formId+" #meetingType").val(meetingType).trigger("change");
					if(meetingType=="CUSTOM"){
						$("#meetingLinkInput").val(data.extra);
						if(!$("#copyMeetingLinkModal").hasClass("show")){
							$(".meeting-link-copy-btn").html('Copy Link<i class="fa fa-copy ml-2"></i>');
							$(".meeting-link-copy-btn").removeClass("btn-success");
							$(".meeting-link-copy-btn").addClass("btn-primary");
						}
						$("#copyMeetingLinkModal").modal("show");
						
					}
					$("#customTitleDiv").hide();
					// setTimeout(function(){ callDashboardPageSchool(moduleId,'schedule-a-session',''); }, 1000);
				}
		
			}
			customLoader(false);
			$("#modalMessage, #recurringClassShowModelValidation").modal("hide");
			return false;
		}
	});
	$(".meetingSlotAdd").prop("disabled", false);
}

function showHideMeetingCreationForm(data, moduleId){
	$('#classroomSessionFilter #standardId').val('');
	$('#classroomSessionFilter #studentName').val('');
	$('#classroomSessionFilter #subjectIds').val('');
	$('#classroomSessionFilter #meetingSubject').val('');
	$('#classroomSessionFilter #duration').val('50');
	$("#studentName").val(null).trigger('change');
	$("#meetingDate").datepicker('update','');
	$("#startTimeHours").val('');
	$("#startTimeMins").val('');
	$("#customTitle").val('');
	
	
	if(data=="ODM" || data=="PTM" || data=="CUSTOM"){
		$('#showMeetingModalDiv').show()
		$('#manageSessionContentDiv').hide();
		$(".countryTimezoneWrapper, .meetingDateWrapper, .startTimeHoursWrapper, .durationWrapper").show();
		$(".hide-on-odm").hide();
		if(data=="PTM"){
			$('#classroomSessionFilter #courseNameDiv').hide();
		}else{
			$('#classroomSessionFilter #courseNameDiv').show();
		}
		if(data=="CUSTOM"){
			$('#classroomSessionFilter #customTitleDiv').show();
		}else{
			$('#classroomSessionFilter #customTitleDiv').hide();
		}
	}else{
		$('#classroomSessionFilter #customTitleDiv').hide();
		$('#manageSessionContentDiv').show();
		$('#showMeetingModalDiv').hide();
		$(".countryTimezoneWrapper, .meetingDateWrapper, .startTimeHoursWrapper, .durationWrapper").hide();
		customLoader(true);
		var data={};
		data['moduleId']=147;
		data['callFrom']='classroomSessionFilter';
		data['userId']=USER_ID;
		$(".hide-on-odm").show();
		$("#timeSlotSession").hide();
		
		customLoader(false);
	}

}
function getScheduleSessionFilter(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="filter-wrapper">'
		// +'<div class="full">'
		// +'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'classroomSessionFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
		// +'</div>'
		+'<form name="classroomSessionFilter" id="classroomSessionFilter" action="javascript:void(0)">'
			+'<div class="filter-fields d-flex flex-wrap">';
				html+='<input type="hidden" name="userId" id="userId" class="form-control" value="'+userId+'">';
				html+='<input type="hidden" name="meetingSubject" id="meetingSubject" class="form-control" value="">';
				html+='<input type="hidden" id="userId" name="userId" value="${userId}" />';
				html+='<input type="hidden" id="schoolId" name="schoolId" value="${schoolId}" />';
				html+='<input type="hidden" id="recurringId" name="recurringId" value="" />';
				html+='<input type="hidden" id="studentId" name="studentId" value="" />';
				html+='<input type="hidden" id="studentTimezoneId" name="studentTimezoneId" value="" />';
				html+='<input type="hidden" id="gradeName" name="gradeName" value="" />';
				html+='<input type="hidden" id="controlType" name="controlType" value="${controlType}" />';
				if(role!='TEACHER'){
						html+='<div class="col-lg-3 col-md-4 col-sm-3 col-12 mb-3">'
									+'<label>Select Learning Program</label>'
									+'<select name="enrollmentType" id="enrollmentType" class="form-control">'
										+getLearningProgramContent(schoolId)
									+'</select>'
								+'</div>';
							}
							if(role=='TEACHER'){
								html+='<div class="col-lg-3 col-md-4 col-sm-3 col-12 mb-3 d-none" >'
											+'<label>Create Class For</label>'
											+'<select name="meetingType" id="meetingType" class="form-control" onchange=" meetingDataByType(this.value)" disabled>'
												+'<option value="STUDENT_DOUBT_SESSION" selected disabled>Student</option>'
												// +'<option value="SELF">Self</option>'
											+'</select>'
										+'</div>';
							}
						
						html+='<div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"  id="meetingTypeDiv">'
							+'<label>Type of Class</label>'
							+'<select name="meetingFor" id="meetingFor" class="form-control" onchange="showHideMeetingCreationForm(this.value, '+roleAndModule.moduleId+')">'
								+'<option value="ODM" selected>One Day Class</option>'
								// +'<option value="RM">Recurring Class</option>'
								+'<option value="PTM">Book a PTM</option>'
								+'<option value="CUSTOM">Create Custom Class</option>'
							+'</select>'
						+'</div>';
						html+='<div class="col-lg-3 col-md-4 col-sm-3 col-12 mb-3 " id="customTitleDiv" style="display:none;">'
									+'<label>Class Title</label>'
									+'<input type="text" name="customTitle" id="customTitle" class="form-control" value="" maxlength="100" onkeydown="return M.isEmail(event);">'
								+'</div>';	
						html+='<div class="col-lg-3 col-md-4 col-sm-3 col-12 mb-3" id="standardIdDiv">'
								+'<label>Grade</label>'
									+'<select name="standardId" id="standardId" class="form-control" onchange="return getTeacherAssignedStudent(this.value,'+userId+');">'
									+'</select>'
							+'</div>';
					
					if(role!='TEACHER'){
						html+='<div class="col-lg-3 col-md-4 col-sm-3 col-12">'
									+'<label>Select LMS Platform</label>'
									+'<select name="courseProviderId" id="courseProviderId" class="form-control">'
										+getLmsPlatformContent(schoolId)
									+'</select>'
								+'</div>';
					}
					html+='<div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-3" id="studentNameDiv">'
								+'<label>Student Name</label>';
								if(role=='TEACHER'){
									html+='<select name="studentName" id="studentName" class="form-control" onchange="return callCoursesAssignedToteacher(this.value,'+userId+')">'
										+'</select>';
								}else{
									html+='<input type="text" name="studentName" id="studentName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);">';
								}
					html+='</div>';
					if(role!='TEACHER'){
						html+='<div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">'
									+'<label>Student Email</label>'
									+'<input type="text" name="studentEmail" id="studentEmail" class="form-control" value="" maxlength="100" onkeydown="return M.isEmail(event);"/>'
								+'</div>';
					}
					html+='<div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"  id="courseNameDiv">'
						+'<label>Course Name</label>';
						if(role=='TEACHER'){
							html+='<select name="subjectIds" id="subjectIds" class="form-control" onchange="getMeetingTitle()">'
								+'</select>';
						}else{
							html+='<input type="text" name="subjectIds" id="subjectIds" class="form-control" value="" maxlength="40" onkeydown="return M.isChars(event);">';
						}
					html+='</div>';
					if(role!='TEACHER'){
						html+='<div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"  id="meetingSubjectDiv">'
									+'<label>Meeting Title</label>'
									+'<input type="text" name="meetingSubject" id="meetingSubject" class="form-control" value="" maxlength="200" disabled>'
								+'</div>';
					}
					html+='<div class="col-lg-2 col-md-4 col-sm-6 col-12 mb-3 meetingDateWrapper"  id="">'
								+'<label>Meeting Date</label>'
								+'<input type="text" name="meetingDate" id="meetingDate" class="form-control" value="" onchange="createClassButtonHide()">'
							+'</div>';
					html+='<div class="col-lg-2 col-md-4 col-sm-6 col-12 mb-3 startTimeHoursWrapper"  id="">'
								+'<label>Start Time</label>'

								+'<div class="d-flex align-items-center w-100">'
									+'<div class="flex-grow-1">'
										+'<select name="" id="startTimeHours" class="form-control" onchange="createClassButtonHide()">'
										+'<option value="" disabled selected>HH</option>'
										+getHoursAndMins(23,1)
										+'</select>'		
									+'</div>'
									+'<span class="d-inline-block mx-1">:</span>'
									+'<div class="flex-grow-1">'
										+'<select name="" id="startTimeMins" class="form-control" onchange="createClassButtonHide()">'
											+'<option value="" disabled selected>MM</option>'
											+getHoursAndMins(59,5)
										+'</select>'	
									+'</div>'
								+'</div>'
							+'</div>';
							html+=getRecurringClassContent(roleAndModule.moduleId);
					html+='<div class="col-lg-2 col-md-4 col-sm-6 col-12 mb-3 durationWrapper">'
							+'<label>Duration <i>(mins)</i></label>'
							+'<div class="row">'
								+'<div class="col-lg-5 col-md-6 col-sm-6 col-12 mb-3 durationWrapper">'
									+'<input type="text" name="duration" id="duration" class="form-control" value="50" disabled>'
								+'</div>'
							+'</div>'
						+'</div>';	
					html+='<div class="col-md-12 col-sm-12 col-12 mt-2 text-right" id="showMeetingModalDiv">'
							+'<button class="btn btn-primary mr-1 validationBtn" onclick="return meetingSlotModalForValidateScheduleClass(\'classroomSessionFilter\','+roleAndModule.moduleId+');">Validate Class</button>'
							+'<button class="btn btn-info" type="button" onclick="resetRecurring(\'classroomSessionFilter\','+roleAndModule.moduleId+')">Reset</button>'
						+'</div>'
			+'</div>'
		+'</form>'
	+'</div>'
	return html;
}



function getRecurringClassContent(moduleId){
			var html = 	
				'<div class="col-md-3 col-sm-6 col-12" style="display: none;">'
					+'<div class="form-group">'
						+'<label>TimeZone (Teacher)<sup class="text-danger sup">*</sup></label>'
						+'<select name="countryTimezoneFromId" id="countryTimezoneFromId" class="form-control">'
						+'</select>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-2 col-sm-6 col-12 hide-on-odm" style="display: none;">'
					+'<div class="form-group">'
						+'<label>Classroom Duration<sup class="text-danger sup">*</sup></label>'
						+'<select name="classDuration" id="classDuration" class="form-control" onchange="createClassButtonHide()">'
							+'<option value="50"  selected>50</option>'
							// <c:forEach var="hrsTime" begin="0" end="90" step="5">
							// 	<option value="${hrsTime>9? hrsTime : '0'.concat(hrsTime)}">${hrsTime>9? hrsTime : '0'.concat(hrsTime)}</option>
							// </c:forEach>
						+'</select>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-2 col-sm-6 col-12 hide-on-odm" style="display: none;">'
					+'<div class="form-group">'
						+'<label>Buffer Time<sup class="text-danger sup">*</sup></label>'
						+'<select name="bufferTime" id="bufferTime" class="form-control">'
							+'<option value="10"  selected>10</option>'
						+'</select>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-2 col-sm-6 col-12 hide-on-odm" style="display: none;">'
					+'<div class="form-group">'
						+'<label>Start From Time<sup class="text-danger sup">*</sup></label>'
						+'<select name="startFromTime" id="startFromTime" class="form-control" multiple="multiple">'
							+'<option value="00">00</option>'
							+'<option value="15">15</option>'
							+'<option value="30">30</option>'
							+'<option value="45">45</option>'
						+'</select>'
					+'</div>'
				+'</div>'
				+'<div class="col-md-4 col-sm-6 col-12 hide-on-odm" style="display: none;">'
					+'<div class="form-group">'
						+'<label>Set Time<sup class="text-danger sup">*</sup></label>'
						+'<div style="display:flex;align-items:center">'
							+'<span style="padding:0 5px">'
								+'<input type="text" class="teachStartDate form-control" name="classStartDate" placeholder="Select Start Date" id="classStartDate" value="" autocomplete="off" />'
							+'</span>'
							+'<span style="padding:0 5px">'
								+'<input type="text" class="teachEndDate form-control " name="classEndDate" placeholder="Select End Date" id="classEndDate" value="" autocomplete="off"/>'
							+'</span>'
							+'<a href="javascript:void(0);" class="btn btn-sm bg-primary text-white" onclick="getSplitTime(\'classroomSessionFilter\');"> <i class="pe-7s-refresh-2"></i></a>  '
						+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="row hide-on-odm col-12 row" id="timeSlotSession" style="display:none"></div>'
				+'<div class="col-md-12 text-right hide-on-odm" style="display: none;">'
					+'<button class="btn btn-primary mr-1" type="button" onclick="callRecurringShow(\'classroomSessionFilter\')">Check Class Availability</button>'
					+'<button class="btn btn-success proceedRecurringClassbtn mr-1" type="submit" onclick="booksclassOutsideAvailabilityConfirmationModal(\'hide-on-odm\',\'classroomSessionFilter\','+moduleId+');" style="display: none;"> <i class="fa fa-check"></i> Save</button>'
					+'<button class="btn btn-info" type="button" onclick="resetRecurring(\'classroomSessionFilter\','+moduleId+')">Reset</button>'
				+'</div>'
			return html;
}

function booksclassOutsideAvailabilityConfirmationModalContent(){
	var html =
		'<div class="modal fade fade-scale" id="booksclassOutsideAvailabilityConfirmationModal" tabindex="-1">'
			+'<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="max-width:600px;">'
				+'<div class="modal-content border-primary" style="border-top: 10px solid;">'
					+'<div class="modal-body">'
						+'<div class="text-center text-warning mb-2"><i class="fa fa-exclamation-triangle fa-3x" aria-hidden="true"></i></div>'
						+'<div class="full my-2">'
							+' <p class="text-center mb-1 font-weight-semi-bold text-primary">The class for <span id="studentBatchName"></span> - <span id="courseActivity"></span> will be scheduled<span id="meetingDateTime"></span>. If this class is outside your current availability, it will be added to your availability. Do you wish to proceed?</p>'
						+'</div>'
					+'</div>'
					+'<div class="modal-footer justify-content-between">'
						+' <button type="button" class="btn btn-outline-danger" data-dismiss="modal">Cancel</button>'
						+'<button type="button" class="btn btn-outline-success" id="confirmationBookClassBtn" data-Url="" onclick="">Confirm</button>'
					+' </div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

// function getScheduleSessionContent(title, roleAndModule, schoolId, userId, role){
// 	var html=
// 		'<div class="row">'
// 			+'<div class="col-md-12 col-lg-12 col-sm-12">'
// 				+'<div class="card">'
// 					+'<div class="card-header card-header-primary">'
// 						+'<h4 class="card-title">'+title+'</h4>'
// 					+'</div>'
// 					+'<div class="card-body">'
// 						+'<div class="row">'
// 							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12">'
// 							+getScheduleSessionFilter(roleAndModule,schoolId,userId,role)
// 							+'</div>'
// 						+'</div>'
// 						// +'<br>'
// 						// +'<div class="col-md-12">'
// 						// 	+'<div class="row">'
// 						// 		+'<div style="width:100%;">'
// 						// 			+'<div class="tab-content clearfix">'
// 						// 				+'<div class="row">'
// 						// 					+'<div id="manageSessionContentDiv" style="width:100%;display:inline-block">'
// 						// 					+'</div>'
// 						// 				+'</div>'
// 						// 			+'</div>'
// 						// 		+'</div>'
// 						// 	+'</div>'
// 						// +'</div>'
// 					+'</div>'
// 				+'</div>'
// 			+'</div>'
// 		+'</div>';
// 	return html;
// }

function getScheduleSessionContentTeacher(title, roleAndModule, schoolId, userId, role){
	var html=
		//'<style>.sticky-header{z-index:9}</style>'
		'<div class="app-page-title">'
			+'<div class="page-title-wrapper">'
				+'<div class="page-title-heading">'
					+'<div class="page-title-icon"><i class="pe-7s-notebook text-primary"></i></div>'
					+'<div>'+title+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="main-card mb-3 card">'
			+'<div class="card-body">'
				+getScheduleSessionFilter(roleAndModule,schoolId,userId,role)
				+'<br>'
				+'<div class="col-md-12">'
					+'<div class="row">'
						+'<div style="width:100%;">'
							+'<div class="tab-content clearfix">'
								+'<div class="row">'
									+'<div id="manageSessionContentDiv" style="width:100%;display:inline-block">'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+validateOneDayMeetingByTeacherModal(roleAndModule.moduleId)
		+copyMeetingLink()
		+booksclassOutsideAvailabilityConfirmationModalContent(roleAndModule.moduleId);
	return html;
}


function getUpdateMeetingResultModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="updateMeetingResultModal">'
		+'<div class="modal-dialog modal-md">'
			+'<form name="updateMeetingResultForm" id="updateMeetingResultForm">'
				+'<div class="modal-content" style="border: none; border-radius: 1px">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<input type="hidden" class="form-control" id="meetingCurStatus" name="meetingCurStatus" value="">'
					+'<div class="modal-header p-2 bg-primary text-white">'
						+'<h4 class="modal-title" id="myLargeModalLabel">Update Class Status</h4>'
						+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
					+'</div>'
					+'<div class="modal-body">'
						+'<div class="col-md-12 col-sm-12 col-12">'
							+'<div class="form-group">'
								+'<label>Update Class Status</label> '
								+'<select class="form-control" name="meetingResult" id="meetingResult" required>'
								+'</select>'
							+'</div>'
						+'</div>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.updated=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left meetingSaveResult" onClick="updateClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Save</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">Close</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getMeetingUrlModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="meetingUrlModal">'
	   +'<div class="modal-dialog modal-md">'
			+'<form name="meetingUrlForm" id="meetingUrlForm">'
				+'<div class="modal-content" style="border: none; border-radius: 1px">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<input type="hidden" class="form-control" id="mailSendStatus" name="mailSendStatus" value="">'
					+'<div class="modal-header text-center">'
						+'<h4 class="modal-title" id="myLargeModalLabel">Class Link</h4>'
						+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
					+' </div>'
					+'<div class="modal-body">'
						+'<div class="col-md-12 col-sm-12 col-12">'
							+'<div class="form-group">'
								+'<label>Class Link</label>'
							   +'<input type="text" class="form-control" id="meetingUrl" name="meetingUrl" maxlength=150 value="">'
							+'</div>'
						+'</div>'
					   +'<div class="col-md-12 col-sm-12 col-12">'
							+'<div class="form-group">'
								+'<label>Remarks</label>'
								+'<input type="text" class="form-control" id="remarks" name="remarks" maxlength=200 value="">'
							+'</div>'
						+'</div>'
				+'</div>'
				+'<div style="text-align:center;"  id="note">'
					+'<p>Note: Once the link is added, you won\'t be able to change the link.</p>'
				+'</div>'
				   +'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" id="saveMeetingUrl" class="send btn btn-primary  text-left meetingUrl" onClick="saveClassroomSessionMeetingUrl(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Save</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">Close</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getSendMailModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="sendMailModal">'
		+'<div class="modal-dialog modal-md">'
			+'<form name="sendMailForm" id="sendMailForm">'
				+'<div class="modal-content" style="border: none; border-radius: 1px">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<div class="modal-header text-center">'
						+'<h4 class="modal-title" id="myLargeModalLabel">Send Mail</h4>'
						+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
					+'</div>'
					+'<div style="text-align:center;">'
						+'<p>Are you sure you want to send this mail?</p>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left sendMail" onClick="sendClassroomSessionMail(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getPublicRecordModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="publishRecordModal">'
		+'<div class="modal-dialog modal-md">'
			+'<form name="publishRecordForm" id="publishRecordForm">'
				+'<div class="modal-content" style="border: none; border-radius: 1px">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<input type="hidden" class="form-control" id="meetingStrId" name="meetingStrId" value="">'
					+'<div class="modal-header text-center">'
						+'<h4 class="modal-title" id="myLargeModalLabel"><span id="publishHeadId"></span> Recording</h4>'
						+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
					+'</div>'
					+'<div style="text-align:center;">'
						+'<p>Are you sure you want to <span id="publishId"></span> Recording?</p>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left publishRecord" onClick="publishClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getRevokeModal(roleAndModule, role){
	var html=
	'<div class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" id="revokeModal">'
		+'<div class="modal-dialog modal-md">'
			+'<form name="revokeForm" id="revokeForm">'
				+'<div class="modal-content" style="border: none; border-radius: 1px">'
					+'<input type="hidden" class="form-control" id="userId" name="userId" value="">'
					+'<input type="hidden" class="form-control" id="meetingId" name="meetingId" value="">'
					+'<input type="hidden" class="form-control" id="meetingStrId" name="meetingStrId" value="">'
					+'<div class="modal-header text-center">'
						+'<h4 class="modal-title" id="myLargeModalLabel"><span id="publishHeadId"></span> Revoke</h4>'
						+'<button type="button" class="close" data-dismiss="modal" aria-hidden="true" style="color:#fff;">x</button>'
					+'</div>'
					+'<div style="text-align:center;">'
						+'<p>Are you sure you want to Revoke?</p>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left meetingRevoke" onClick="revokeClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger waves-effect text-right" data-dismiss="modal">No</button>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}
function validateOneDayMeetingByTeacherModal(moduleId){
	var html = 
			'<div class="modal fade" id="recurringClassShowModel"  role="dialog" aria-labelledby="recurringClassShowModelLabel">'
				+'<div class="modal-dialog modal-xl" role="document">'
					+'<div class="modal-content">'
						+'<div class="modal-header py-2 bg-primary">'
							+'<h5 class="modal-title text-white" id="recurringClassShowModelLabel">Validate Class</h5>'
							+'<button type="button" class="close remove-backdrop" data-dismiss="modal" aria-label="Close">'
								+'<span aria-hidden="true" class="text-white">&times;</span>'
							+'</button>'
						+'</div>'
						+'<div class="modal-body">'
							+'<div class="col-12" id="teacherAvailabilityWarningTitle"></div>'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 p-0">'
								+'<div class="full">'
									+'<table class="table table-bordered nowrap" >'
										+'<thead>'
											+'<tr>'
												+'<th class="" style="text-align: center; font-weight: bold">S.No</th>'
												+'<th class="" style="font-weight: bold">Student Name | Teacher Name | Course Name</th>'
												+'<th class="" style="font-weight: bold">Class Timings</th>'
												+'<th class="" style="font-weight: bold">Slot Available</th>'
												+'<th class="" style="font-weight: bold">Reason for Availability</th>'
											+'</tr>'
										+'</thead>'
										+'<tbody id="trRecurring"></tbody>'
									+'</table>'
								+'</div>'
								+'<div class="full">'
									+'<p class="font-weight-bold validator-message">A class has already been scheduled for this time. Please either reschedule the existing class through "Class Status" or choose a different time.</p>'
									+'<button class="btn btn-sm btn-success meetingSlotAdd float-right" style="display:none" onclick="booksclassOutsideAvailabilityConfirmationModal(\'\',\'classroomSessionFilter\','+moduleId+');"><i class="fa fa-check"></i>&nbsp;<span>Save</span></button>'
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
		
}

function copyMeetingLink(){
	var html = 
			'<div class="modal fade" id="copyMeetingLinkModal"  role="dialog">'
				+'<div class="modal-dialog modal-sm box-shadow-none modal-dialog-centered" role="document">'
					+'<div class="modal-content">'
						+'<div class="modal-header py-2 bg-primary">'
							+'<h5 class="modal-title text-white" id="recurringClassShowModelLabel">Copy Meeting Link</h5>'
							+'<button type="button" class="close remove-backdrop" data-dismiss="modal" aria-label="Close">'
								+'<span aria-hidden="true" class="text-white">&times;</span>'
							+'</button>'
						+'</div>'
						+'<div class="modal-body">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-12 p-0 text-center position-relative">'
								+'<input type="text" value="" id="meetingLinkInput" class="position-absolute" style="top:0;left:0;opacity:0;"/>'
								+'<div class="full text-center my-4">'
								+'<a href="javascript:void(0)" class="btn btn-primary meeting-link-copy-btn" onclick="copyToClipboard(\'meetingLinkInput\',this, true)">Copy Link<i class="fa fa-copy ml-2"></i></a>'			
								+'</div>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
}

function createClassButtonHide(){
	$(".meetingSlotAdd").hide()
}