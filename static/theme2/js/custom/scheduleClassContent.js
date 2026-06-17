
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
	refreshScheduleCustomFields('classroomSessionFilter');
}

function getMeetingTitle(){
	var stname = $('#classroomSessionFilter #studentName option:selected').text().split('(')[0].trim();
	var subjectName =$('#classroomSessionFilter #subjectIds option:selected').text();
	//var meetingSubject = "Student Doubt Class - " + stname + " (" + subjectName + ")";
	var meetingSubject =  stname + " | " + subjectName;
	
	$('#classroomSessionFilter #meetingSubject').val(meetingSubject);
	refreshScheduleCustomFields('classroomSessionFilter');
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
		meetingSlotDTO['studentStandardId'] = $("#" + formId + " #studentStandardId").val();
		if( $("#" + formId + " #boughtWeek").val()!=undefined &&  $("#" + formId + " #boughtWeek").val()!=''){
			meetingSlotDTO['anotherWeekStartDate'] = $("#" + formId + " #boughtWeek").val().split(" - ")[0];
			meetingSlotDTO['anotherWeekEndDate'] = $("#" + formId + " #boughtWeek").val().split(" - ")[1];
		}
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
	if($('#'+formId+' #meetingType').val()=="ODM"){
		meetingSlotDTO['week']=$('#' + formId +' #boughtWeek').val();
	}
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
	if(formId=='recurringClass'){
		var meetingType = $('#'+formId+' #meetingType').val();
		if(meetingType == null || meetingType == undefined || meetingType == ""){
			showMessageTheme2(0, "Meeting Type is required");
			return false;
		}
	}
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
		var userNameOrEmail = $('#'+formId+' #studentId').val();
		if(meetingType!="CUSTOM"){
			if(userNameOrEmail==undefined  || userNameOrEmail==null || userNameOrEmail==0 || userNameOrEmail==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Student Id is required");
				return false;
	
			}
			var sName = $('#recurringClass #studentName').val();
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Student Name is required");
				return false;
			}
			var cName = $('#recurringClass #subjectIds').val();
			if(cName==undefined || cName==null ||  cName==0 || cName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Course Name required");
				return false;
			}
		}else{
			var teacherId = $("#" + formId + " #customTeacherId").val();
			if(teacherId == undefined || teacherId == null ||  teacherId == 0 || teacherId == ''){
				teacherId = $("#" + formId + " #teacherId").val();
			}
			if(teacherId == undefined || teacherId == null ||  teacherId == 0 || teacherId == ''){
				showMessageTheme2(0, "Please select teacher to create custom class.");
				return false;
			}
		}
		// if($("#" + formId + " #recurringType").val()==undefined || $("#" + formId + " #recurringType").val()==''){
		// 	showMessageTheme2(0, "Class Type is required.");
		// 	return false;
		// }
		if(meetingVendor==undefined  || meetingVendor==null || meetingVendor==0 || meetingVendor==''){
			showMessageTheme2(0, "Meeting Vendor is required.");
			return false;
		}
		if(classDuration==undefined  || classDuration==null || classDuration==0 || classDuration==''){
			showMessageTheme2(0, "Classroom Duration is required.");
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
				showMessageTheme2(0, "Student Name required")
				return false;
			}
			if($('#classroomSessionFilter #meetingFor').val()!='PTM'){
				if(cName==undefined || cName==null ||  cName==0 || cName==''){
					$(".meetingSlotAdd").prop("disabled", false);
					showMessageTheme2(0, "Course Name required");
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
			showMessageTheme2(0, "Duration field is required");
			return false;
		}
	}
	if(meetingFor=="CUSTOM"){
		var customTitleVal = $("#" + formId + " #customTitle").val();
		if(customTitleVal==undefined || customTitleVal==''){
			showMessageTheme2(0, "Class Title is required");
			return false;
		}
	}
	if(mDate==undefined || mDate==null || mDate==0 || mDate==''){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessageTheme2(0, "Meeting Date field is required");
		return false;
	}
	if(sTimeHours==undefined || sTimeHours==null || sTimeHours==''){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessageTheme2(0, "Start Time field is required");
		return false;
	}
	if(sTimeMins==undefined || sTimeMins==null || sTimeMins=='' ){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessageTheme2(0, "Start Time field is required");
		return false;
	}
	$(".meetingSlotAdd").prop("disabled", true);
	hideMessageTheme2('');
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('dashboard','validate-meetingslots-new-submit-by-teacher'),
		data : JSON.stringify(getRequestForSubmitMeetingForStudentSessionSlotsNew(formId, moduleId,controllType, meetingType)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				customLoader(false);
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, data['message']);
			} else {
				$('.meetingSlotAdd').show();
				customLoader(false);
				var meetingTypeValue = $("#meetingType").val();
				if(meetingTypeValue==null || meetingTypeValue==undefined || meetingTypeValue==''){
					meetingTypeValue =meetingType;
				}
				var recurringclassForAA = data['recurringClassListForAvailability'];
				if(meetingTypeValue != "RM" && USER_ROLE != 'TEACHER'){
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
				var totalAvailableClass = $('#totalClass').html() - $('#totalBookedClass').html();
				var saveForcefullyIfClassCountExceeds = data['saveForcefullyIfClassCountExceeds'];
				var validRecurringClass=true;
				var showValidatemessage=true;
				var notAvailabileClassCount=0;
				$('.meetingSlotAdd').html('<i class="fa fa-check"></i> Create Class');
				for(var i=0;i<recurringclass.length;i++){
					if(recurringclass[i]['slotAvailable']!='Available' || recurringclass[i]['classBookedStatus']=='NA'){
						//$("#teacherAvailabilityWarningTitle").html(``);
						htmlRecu = htmlRecu +"<tr class='text-danger'>";
						if(recurringclass[i]['slotAvailable']!='Available'){
							notAvailabileClassCount++;
						}
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
					if(totalAvailableClass == 0){
						htmlRecu = htmlRecu +" <td>Student does not have any classes to book</td>";
					}else{
						var weekClassStatus =recurringclass[i]['classBookedStatus'];
						if(weekClassStatus=="NA"){
							htmlRecu = htmlRecu +" <td> Student does not have any classes to book</td>";
						}else{
							htmlRecu = htmlRecu +" <td>"+weekClassStatus+"</td>";
						}
					}
					
					htmlRecu = htmlRecu +"</tr>";
					if(recurringclass[i]['slotAvailable']!='Available' || recurringclass[i]['classBookedStatus']=='NA'){
						validRecurringClass=false;
						
						if(recurringclass[i]['classBookedStatus']=='NA'){
							showValidatemessage=false;
						}
					}
					if(USER_ROLE != 'TEACHER'){
						if(saveForcefullyIfClassCountExceeds == 'Y' && recurringclass[i]['classBookedStatus']=='NA' && recurringclass[i]['slotAvailable']=='Available'){
							validRecurringClass = true;
							$('.meetingSlotAdd').html('<i class="fa fa-check"></i> Create Class anyway');
						}
					}
				}
				if(validRecurringClass){
					$('.meetingSlotAdd').show();
					$(".validator-message").hide()
				}else{
					$('.meetingSlotAdd').hide();
					if(showValidatemessage){
						$(".validator-message").show()
					}else{
						$(".validator-message").hide()
					}
				}
				$("#trRecurring").html(htmlRecu);
				if(USER_ROLE != 'TEACHER'){
					if(totalAvailableClass<=0 && saveForcefullyIfClassCountExceeds=='N'){
						$('.meetingSlotAdd').hide();
						$(".validator-message-count").show()
					}else{
						$(".validator-message-count").hide()
					}
				}

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
		var userNameOrEmail = $('#'+formId+' #studentId').val();
		if(meetingType!="CUSTOM"){
			if(userNameOrEmail==undefined  || userNameOrEmail==null || userNameOrEmail==0 || userNameOrEmail==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Student ID is required");
				return false;
			}
			var sName = $('#recurringClass #studentName').val();
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Student Name is required");
				return false;
			}
			var cName = $('#recurringClass #subjectIds').val();
			if(cName==undefined || cName==null ||  cName==0 || cName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Course Name required");
				return false;
			}
		}else{
			if(userNameOrEmail==undefined  || userNameOrEmail==null || userNameOrEmail==0 || userNameOrEmail==''){
				if($("#" + formId + " #customTeacherId").val()==undefined || $("#" + formId + " #customTeacherId").val()==''){
					showMessageTheme2(0, "Please Select teacher to create custom class");
					return false;
				}
			}
		}
		// 	showMessageTheme2(0, "Class Type is required.");
		// 	return false;
		// }

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
				showMessageTheme2(0, "Grade field is required");
				return false;
			}
			if(sName==undefined  || sName==null || sName==0 || sName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Student Name required");
				return false;
			}
			if(cName==undefined || cName==null ||  cName==0 || cName==''){
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, "Course Name required");
				return false;
			}
		}
		
		if(duration==undefined || duration==null || duration==0 || duration==''){
			$(".meetingSlotAdd").prop("disabled", false);
			showMessageTheme2(0, "Duration field is required");
			return false;
		}
	}
	if(mDate==undefined || mDate==null || mDate==0 || mDate==''){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessageTheme2(0, "Meeting Date field is required");
		return false;
	}
	if(sTimeHours==undefined || sTimeHours==null || sTimeHours==''){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessageTheme2(0, "Start Time field is required");
		return false;
	}
	if(sTimeMins==undefined || sTimeMins==null || sTimeMins=='' ){
		$(".meetingSlotAdd").prop("disabled", false);
		showMessageTheme2(0, "Start Time field is required");
		return false;
	}
	$(".meetingSlotAdd").prop("disabled", true);
	hideMessage('');
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('dashboard','meetingslots-new-submit-by-teacher'),
		data : JSON.stringify(getRequestForSubmitMeetingForStudentSessionSlotsNew(formId, moduleId,controllType, meetingType)),
		dataType : 'json',
		success : function(data) {
			$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
			if (data['status'] == '0' || data['status'] == '2') {
				customLoader(false);
				$(".meetingSlotAdd").prop("disabled", false);
				showMessageTheme2(0, data['message']);
			} else {
				customLoader(false);
				$(".meetingSlotAdd").prop("disabled", false);
				if(data['message']=='MEETING SAVED SUCCESSFULLY'){
					showMessageTheme2(1, data['message']);
				}else{
					showMessageTheme2(0, data['message']);
				}
				if(controllType=='ADD'){
					$('#'+formId)[0].reset();
					$("#standardId").val('');
					$("#startTimeHours").val('');
					$("#startTimeMins").val('');
					$('#studentName').empty().trigger("change");
					$('#subjectIds').find('option').remove();
					$('#studentId').val('');
					meetingDataByType('STUDENT_DOUBT_SESSION');
					$("#recurringClassShowModel").modal('hide');
					if(meetingType=="CUSTOM"){
						$("#meetingLinkInput").val(data.extra);
						if(!$("#copyMeetingLinkModal").hasClass("show")){
							$(".meeting-link-copy-btn").html('Copy Link<i class="fa fa-copy ml-2"></i>');
							$(".meeting-link-copy-btn").removeClass("btn-success");
							$(".meeting-link-copy-btn").addClass("btn-primary");
						}
						$("#copyMeetingLinkModal").modal("show");
					}
					generateTinyUrls();
					$("#customTitleDiv").hide();
				}
				$(".classRecodsTumbs").hide();
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

	refreshScheduleCustomFields('classroomSessionFilter');
}
function getScheduleCustomField(columnClass, label, fieldHtml, wrapperAttr){
	wrapperAttr = wrapperAttr == undefined ? '' : wrapperAttr;
	return '<div class="'+columnClass+'" '+wrapperAttr+'>'
		+'<div class="custom-field">'
			+fieldHtml
			+'<label>'+label+'</label>'
		+'</div>'
	+'</div>';
}

function getScheduleTextInput(name, id, value, extraAttr){
	value = value == undefined ? '' : value;
	extraAttr = extraAttr == undefined ? '' : extraAttr;
	return '<input type="text" name="'+name+'" id="'+id+'" class="form-control" value="'+value+'" placeholder=" " '+extraAttr+'>';
}

function getScheduleInput(type, name, id, value, extraAttr){
	type = type == undefined ? 'text' : type;
	value = value == undefined ? '' : value;
	extraAttr = extraAttr == undefined ? '' : extraAttr;
	return '<input type="'+type+'" name="'+name+'" id="'+id+'" class="form-control" value="'+value+'" placeholder=" " '+extraAttr+'>';
}

function getScheduleSelect(name, id, options, extraAttr){
	extraAttr = extraAttr == undefined ? '' : extraAttr;
	return '<select name="'+name+'" id="'+id+'" class="form-control" '+extraAttr+'>'
		+options
	+'</select>';
}

function refreshScheduleCustomFields(formId){
	if(typeof refreshCustomFieldState == 'function'){
		setTimeout(function(){
			refreshCustomFieldState($('#'+formId));
		}, 0);
	}
}

function initScheduleClassSelect2(){
	// These fields are plain inputs now, so no Select2 setup is needed here.
}

function addScheduleStudentNameCss(){
	if($('#scheduleStudentNameCss').length > 0){
		return;
	}
	$('head').append('<style id="scheduleStudentNameCss">'
		+'.schedule-class-line-height-scope #classroomSessionFilter .custom-field input,'
		+'.schedule-class-line-height-scope #classroomSessionFilter .custom-field select{height:44px !important;line-height:44px !important;padding-top:0 !important;padding-bottom:0 !important;}'
		+'#classroomSessionFilter #standardIdDiv select,'
		+'#classroomSessionFilter #standardIdDiv select option{color:#000 !important;}'
		+'.schedule-class-line-height-scope #classroomSessionFilter .custom-field .select2-container,'
		+'.schedule-class-line-height-scope #classroomSessionFilter .custom-field .select2-selection--single{height:44px !important;min-height:44px !important;}'
		+'.schedule-class-line-height-scope #classroomSessionFilter .custom-field .select2-selection__rendered{line-height:44px !important;padding-top:0 !important;padding-bottom:0 !important;}'
		+'.schedule-class-line-height-scope #classroomSessionFilter .custom-field .select2-selection__arrow{height:44px !important;}'
		+'.schedule-class-line-height-scope #classroomSessionFilter #studentNameDiv .select2-selection--single{display:flex !important;align-items:center !important;}'
		+'.schedule-class-line-height-scope #classroomSessionFilter #studentNameDiv .select2-selection__rendered{line-height:normal !important;width:100%;}'
		+'#classroomSessionFilter #studentNameDiv .custom-field label:not(.error-msg){z-index:20;background:#fff;}'
		+'#classroomSessionFilter #studentNameDiv .custom-field.has-value label:not(.error-msg),'
		+'#classroomSessionFilter #studentNameDiv .custom-field.active label:not(.error-msg),'
		+'#classroomSessionFilter #studentNameDiv .custom-field:has(.select2-container--focus) label:not(.error-msg){top:0;transform:translateY(-46%);font-size:12px;font-weight:500;color:var(--custom-field-active);}'
		+'#classroomSessionFilter #studentNameDiv .custom-field .select2-container{position:relative;z-index:1;}'
	+'</style>');
}

function getScheduleSessionFilter(roleAndModule, schoolId, userId, role){
	addScheduleStudentNameCss();
	var html=
	'<div class="filter-wrapper custom-field-scope schedule-class-line-height-scope">'
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
					html+=getScheduleCustomField(
						'col-lg-3 col-md-4 col-sm-3 col-12',
						'Select Learning Program',
						getScheduleSelect('enrollmentType', 'enrollmentType', getLearningProgramContent(schoolId))
					);
				}
				if(role=='TEACHER'){
					html+=getScheduleCustomField(
						'col-lg-3 col-md-4 col-sm-3 col-12 d-none',
						'Create Class For',
						getScheduleSelect('meetingType', 'meetingType', '<option value="STUDENT_DOUBT_SESSION" selected disabled>Student</option>', 'onchange=" meetingDataByType(this.value)" disabled')
					);
				}
						
				html+=getScheduleCustomField(
					'col-lg-3 col-md-4 col-sm-6 col-12',
					'Type of Class',
					getScheduleSelect('meetingFor', 'meetingFor', '<option value="ODM" selected>One Day Class</option><option value="PTM">Book a PTM</option><option value="CUSTOM">Create Custom Class</option>', 'onchange="showHideMeetingCreationForm(this.value, '+roleAndModule.moduleId+')"'),
					'id="meetingTypeDiv"'
				);
				html+=getScheduleCustomField(
					'col-lg-3 col-md-4 col-sm-3 col-12',
					'Class Title',
					getScheduleTextInput('customTitle', 'customTitle', '', 'maxlength="100" onkeydown="return M.isEmail(event);"'),
					'id="customTitleDiv" style="display:none;"'
				);
				html+='<div class="col-lg-3 col-md-4 col-sm-3 col-12" id="standardIdDiv">'
					+'<div class="custom-field">'
						+getScheduleSelect('standardId', 'standardId', '<option value="" selected disabled hidden></option>'+getStandardContent(schoolId,false,false), 'onchange="return getTeacherAssignedStudent(this.value,'+userId+');" style="color:#000 !important;padding-left:16px !important;line-height:18px !important;"')
					+'</div>'
				+'</div>';
					
					if(role!='TEACHER'){
						html+=getScheduleCustomField(
							'col-lg-3 col-md-4 col-sm-3 col-12',
							'Select LMS Platform',
							getScheduleSelect('courseProviderId', 'courseProviderId', getLmsPlatformContent(schoolId))
						);
					}
						if(role!='TEACHER'){
							html+=getScheduleCustomField(
								'col-lg-3 col-md-4 col-sm-6 col-12',
								'Student ID',
								getScheduleTextInput('studentIdSearch', 'studentIdSearch', '', 'maxlength="100"')
							);
						}
					html+=getScheduleCustomField(
						'col-lg-3 col-md-4 col-sm-6 col-12',
						'Student Name',
						role=='TEACHER'
							? getScheduleSelect('studentName', 'studentName', '', 'onchange="return callCoursesAssignedToteacher(this.value,'+userId+')"')
							: getScheduleTextInput('studentName', 'studentName', '', 'maxlength="100" onkeydown="return M.isChars(event);"'),
						'id="studentNameDiv"'
					);
					html+=getScheduleCustomField(
						'col-lg-3 col-md-4 col-sm-6 col-12',
						'Course Name',
						role=='TEACHER'
							? getScheduleSelect('subjectIds', 'subjectIds', '', 'onchange="getMeetingTitle()"')
							: getScheduleTextInput('subjectIds', 'subjectIds', '', 'maxlength="40" onkeydown="return M.isChars(event);"'),
						'id="courseNameDiv"'
					);
					if(role!='TEACHER'){
						html+=getScheduleCustomField(
							'col-lg-3 col-md-4 col-sm-6 col-12',
							'Meeting Title',
							getScheduleTextInput('meetingSubject', 'meetingSubject', '', 'maxlength="200" disabled'),
							'id="meetingSubjectDiv"'
						);
					}
					html+=getScheduleCustomField(
						'col-lg-2 col-md-4 col-sm-6 col-12 meetingDateWrapper',
						'Meeting Date',
						getScheduleTextInput('meetingDate', 'meetingDate', '', 'onchange="createClassButtonHide()" readonly onkeydown="return false"')
					);
					html+='<div class="col-lg-2 col-md-4 col-sm-6 col-12 startTimeHoursWrapper">'
							+'<div class="d-flex align-items-center w-100">'
								+'<div class="custom-field flex-grow-1 mb-0">'
								+getScheduleSelect('startTimeHours', 'startTimeHours', '<option value="" disabled selected style="color:#000 !important;">HH</option>'+getHoursAndMins(23,1), 'onchange="createClassButtonHide()" style="color:#000 !important;-webkit-text-fill-color:#000 !important;opacity:1;"')
								+'<label>HH</label>'
							+'</div>'
							+'<span class="d-inline-block mx-1">:</span>'
							+'<div class="custom-field flex-grow-1 mb-0">'
								+getScheduleSelect('startTimeMins', 'startTimeMins', '<option value="" disabled selected style="color:#000 !important;">MM</option>'+getHoursAndMins(55,5), 'onchange="createClassButtonHide()" style="color:#000 !important;-webkit-text-fill-color:#000 !important;opacity:1;"')
								+'<label>MM</label>'
							+'</div>'
						+'</div>'
					+'</div>';
							html+=getRecurringClassContent(roleAndModule.moduleId);
					html+=getScheduleCustomField(
						'col-lg-2 col-md-4 col-sm-6 col-12 durationWrapper',
						'Duration (mins)',
						getScheduleTextInput('duration', 'duration', '50', 'disabled')
					);
					html+='<div class="col-md-12 col-sm-12 col-12 mt-2 text-right" id="showMeetingModalDiv">'
							+'<button class="btn btn-primary mr-1 validationBtn" onclick="return meetingSlotModalForValidateScheduleClass(\'classroomSessionFilter\','+roleAndModule.moduleId+');">Validate Class</button>'
							+'<button class="btn btn-danger" type="button" onclick="resetRecurring(\'classroomSessionFilter\','+roleAndModule.moduleId+')"><i class="fa fa-undo"></i>&nbsp;Reset</button>'
						+'</div>'
			+'</div>'
		+'</form>'
	+'</div>'
	initScheduleClassSelect2();
	refreshScheduleCustomFields('classroomSessionFilter');
	return html;
}



function getRecurringClassContent(moduleId){
			var html = 	
				getScheduleCustomField(
					'col-md-3 col-sm-6 col-12',
					'TimeZone (Teacher)',
					getScheduleSelect('countryTimezoneFromId', 'countryTimezoneFromId', ''),
					'style="display: none;"'
				)
				+getScheduleCustomField(
					'col-md-2 col-sm-6 col-12 hide-on-odm',
					'Classroom Duration',
					getScheduleSelect('classDuration', 'classDuration', '<option value="50" selected>50</option>', 'onchange="createClassButtonHide()"'),
					'style="display: none;"'
				)
				+getScheduleCustomField(
					'col-md-2 col-sm-6 col-12 hide-on-odm',
					'Buffer Time',
					getScheduleSelect('bufferTime', 'bufferTime', '<option value="10" selected>10</option>'),
					'style="display: none;"'
				)
				+getScheduleCustomField(
					'col-md-2 col-sm-6 col-12 hide-on-odm',
					'Start From Time',
					getScheduleSelect('startFromTime', 'startFromTime', '<option value="00">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option>', 'multiple="multiple"'),
					'style="display: none;"'
				)
				+'<div class="col-md-4 col-sm-6 col-12 hide-on-odm" style="display: none;">'
					+'<div class="d-flex align-items-center">'
							+'<span class="custom-field mb-0" style="padding:0 5px">'
								+'<input type="text" class="teachStartDate form-control" name="classStartDate" placeholder=" " id="classStartDate" value="" autocomplete="off" readonly onkeydown="return false" />'
								+'<label>Start Date</label>'
							+'</span>'
							+'<span class="custom-field mb-0" style="padding:0 5px">'
								+'<input type="text" class="teachEndDate form-control " name="classEndDate" placeholder=" " id="classEndDate" value="" autocomplete="off" readonly onkeydown="return false" />'
								+'<label>End Date</label>'
							+'</span>'
							+'<a href="javascript:void(0);" class="btn btn-sm bg-primary text-white" onclick="getSplitTime(\'classroomSessionFilter\');"> <i class="pe-7s-refresh-2"></i></a>  '
					+'</div>'
				+'</div>'
				+'<div class="row hide-on-odm col-12 row" id="timeSlotSession" style="display:none"></div>'
				+'<div class="col-md-12 text-right hide-on-odm" style="display: none;">'
					+'<button class="btn btn-primary mr-1" type="button" onclick="callRecurringShow(\'classroomSessionFilter\')">Check Class Availability</button>'
					+'<button class="btn btn-success proceedRecurringClassbtn mr-1" type="submit" onclick="booksclassOutsideAvailabilityConfirmationModal(\'hide-on-odm\',\'classroomSessionFilter\','+moduleId+');" style="display: none;"> <i class="fa fa-check"></i> Save</button>'
					+'<button class="btn btn-danger" type="button" onclick="resetRecurring(\'classroomSessionFilter\','+moduleId+')">Reset</button>'
				+'</div>'
			return html;
}

function booksclassOutsideAvailabilityConfirmationModalContent(){
	var html =
		'<div class="modal fade fade-scale" id="booksclassOutsideAvailabilityConfirmationModal" tabindex="-1">'
			+'<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none" role="document" style="max-width:600px;">'
				+'<div class="modal-content border-primary" style="border-top: 10px solid;">'
					+'<div class="modal-body">'
						+'<div class="text-center text-warning mb-2"></div>'
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
		'<div class="app-page-title mb-3 py-2">'
			+'<div class="page-title-wrapper">'
				+'<div class="page-title-heading">'
				+'<div class="page-title-icon">'
					+'<img src="'+PATH_FOLDER_IMAGE2+'/Icon/sidebar/Book_a_Class.webp" '
					+'style="width:40px; height:40px; object-fit:contain;">'
			    +'</div>'
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
					+'<div class="modal-header py-2 bg-primary text-white">'
						+'<h5 class="modal-title" id="myLargeModalLabel">Update Class Status</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>'
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
							html+='<button type="button" class="send btn btn-primary  text-left meetingSaveResult" onClick="updateClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\', \'updateMeetingResultForm\');"><i class="fa fa-envelope-o"></i> Save</button>';
						}
						html+='<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">Close</button>'
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
					+'<div class="modal-header py-2 bg-primary text-center">'
						+'<h5 class="modal-title" id="myLargeModalLabel">Class Link</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>'
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
							html+='<button type="button" id="saveMeetingUrl" class="send btn btn-success text-left meetingUrl" onClick="saveClassroomSessionMeetingUrl(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Save</button>';
						}
						html+='<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">Close</button>'
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
					+'<div class="modal-header py-2 bg-primary text-center">'
						+'<h5 class="modal-title" id="myLargeModalLabel">Send Mail</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>'
					+'</div>'
					+'<div style="text-align:center;">'
						+'<p>Are you sure you want to send this mail?</p>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left sendMail" onClick="sendClassroomSessionMail(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>'
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
					+'<div class="modal-header py-2 bg-primary text-center">'
						+'<h5 class="modal-title" id="myLargeModalLabel"><span id="publishHeadId"></span> Recording</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>'
					+'</div>'
					+'<div style="text-align:center;">'
						+'<p>Are you sure you want to <span id="publishId"></span> Recording?</p>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left publishRecord" onClick="publishClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>'
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
					+'<div class="modal-header py-2 bg-primary text-center">'
						+'<h5 class="modal-title" id="myLargeModalLabel"><span id="publishHeadId"></span> Revoke</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-hidden="true">&times;</button>'
					+'</div>'
					+'<div style="text-align:center;">'
						+'<p>Are you sure you want to Revoke?</p>'
					+'</div>'
					+'<div class="modal-footer">';
						if(roleAndModule.added=='Y'){
							html+='<button type="button" class="send btn btn-primary  text-left meetingRevoke" onClick="revokeClassroomSession(\''+roleAndModule.moduleId+'\',\''+role+'\');"><i class="fa fa-envelope-o"></i> Yes</button>';
						}
						html+='<button type="button" class="btn btn-danger  waves-effect text-right" data-dismiss="modal">No</button>'
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
												+'<th class="" style="font-weight: bold">Student\'s Weekly Class Status</th>'
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
								+'<input class="tinyUrl" type="text" value="" id="meetingLinkInput" class="position-absolute" style="top:0;left:0;opacity:0;"/>'
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
	console.log('hide');
	$(".meetingSlotAdd").hide();
}
