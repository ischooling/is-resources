function getChildActivityList(parentActivityTypeId) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','CHILD-ACTIVITY-LIST-BY-PARENT-ID', parentActivityTypeId, SCHOOL_ID)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['remarksList'];
					$('#extraActivityForm #subActivityLength').val(result.length);
					if(result.length>0){
						$("#subActivityTypeDiv").show();
						var dropdown = $('#extraActivityForm #subActivityType');
						dropdown.html('');
						dropdown.append('<option value="0">Select Sub Activity</option>');
						$.each(result, function(k, v) {
							dropdown.append('<option value="' + v.key + '">'
									+ v.value + ' </option>');
						});
					}else{
						$("#subActivityTypeDiv").hide();
					}
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}

function callBatchNameList(formId) {
	var value= $("#"+formId+" #standardIds").select2('val');
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','BATCH-NAME-LIST-BASED-ON-STANDARD','','','','', value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['remarksList'];
					var dropdown = $('#extraActivityForm #batchIds');
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}

function callSubjectNameList(formId) {
	$("#userIds").val('').trigger('change');
	var value= $("#"+formId+" #batchIds").select2('val');
	if(value.length===0){
		$("#"+formId+" #subjectIds").html('');
		return false;
	}
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','SUBJECT-NAME-LIST-BASED-ON-BATCHES','','','','', value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['courseList'];
					var dropdown = $('#extraActivityForm #subjectIds');
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}

function callBatchNameListForTeacher(formId) {
	var value= $("#"+formId+" #userId").val();
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','BATCH-NAME-LIST-BASED-ON-TEACHER', value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['remarksList'];
					var result2 = data['mastersData']['courseList'];
					var dropdown = $('#extraActivityForm #batchIds');
					var dropdown2 = $('#extraActivityForm #subjectIds');
					dropdown.html('');
					dropdown2.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
					$.each(result2, function(k, v) {
						dropdown2.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
				}
			},
				error : function(e) {
					console.log(e);
					// showMessage(true, e.responseText);
					// $("#"+formId+" #pastTaughtSubjectId").prop("disabled",
					// false);
				}
			});
}

function validateExtraActivityDetails(formId){
	if($("#" + formId + " #activityType").val()==0 || $("#" + formId + " #activityType").val()==undefined){
		showMessage(true, "Activity Type is required.");
		return false;
	}
	if($("#" + formId + " #subActivityLength").val()>0){
		if($("#" + formId + " #subActivityType").val()==0 || $("#" + formId + " #subActivityType").val()==undefined){
			showMessage(true, "Sub Activity Type is required.");
			return false;
		}
	}
	if($("#" + formId + " #activityFor").val()=='' || $("#" + formId + " #activityFor").val()==undefined){
		showMessage(true, "Activity For is required.");
		return false;
	}
	if($("#" + formId + " #activityMeetingType").val()=='ODM'){
		if($("#" + formId + " #startDate").val()=='' || $("#" + formId + " #startDate").val()==undefined){
			showMessage(true, "Start Date is required.");
			return false;
		}
		
	}else{
		if($("#" + formId + " #startDate").val()=='' || $("#" + formId + " #startDate").val()==undefined){
			showMessage(true, "Start Date is required.");
			return false;
		}
		if($("#" + formId + " #endDate").val()=='' || $("#" + formId + " #endDate").val()==undefined){
			showMessage(true, "End Date is required.");
			return false;
		}
		var ckBoxLength = $("#" + formId + " #daycheckboxDiv input:checked").length;	
		if (ckBoxLength==undefined || ckBoxLength == ""  || ckBoxLength==0) {
			showMessage(true, "Please Select atleast a day to add activity.");
			return false;
		}
	}

	if($("#" + formId + " #timeHrsFrom").val()=='' || $("#" + formId + " #timeHrsFrom").val()==undefined){
		showMessage(true, " Start time hour is required.");
		return false;
	}
	if($("#" + formId + " #timeMinFrom").val()=='' || $("#" + formId + " #timeMinFrom").val()==undefined){
		showMessage(true, " Start time minute is required.");
		return false;
	}
	if($("#" + formId + " #durationMin").val()=='' || $("#" + formId + " #durationMin").val()==undefined){
		showMessage(true, " Duration minute is required.");
		return false;
	}
	// if($("#" + formId + " #durationMin").val()=='0' && $("#" + formId + " #timeMinFrom").val()=='0'){
	// 	showMessage(true, " Duration minute is required if duration hours are not selected.");
	// 	return false;
	// }
	if($("#" + formId + " #activityTitle").val()=='' || $("#" + formId + " #activityTitle").val()==undefined){
		showMessage(true, "Activity Title is required.");
		return false;
	}
	if($("#" + formId + " #meetingVendor").val()=='' || $("#" + formId + " #meetingVendor").val()==undefined){
		showMessage(true, "Meeting Vendor is required.");
		return false;
	}
	if($("#" + formId + " #meetingVendor").val()=='External'){
		if($("#" + formId + " #joiningLink").val()=='' || $("#" + formId + " #joiningLink").val()==undefined){
			showMessage(true, "Joining Link is required.");
			return false;
		}
	}
	return true;
}

function showaddExtraActivityModal(){
	$("#addExtraActivityModal").modal("show");
	$("#booksclassOutsideAvailabilityConfirmationModal").modal("hide");
}

function getDaysDifference(date1, date2) {
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

function validateExtraActivityDetail(formId,roleModuleId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'validate-extra-activity'),
		data : JSON.stringify(getRequestForExtraActivity(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			}else {
					var meetingFor = $("#"+formId+" #activityMeetingType").val();
					var recurringclassForAA = data['recurringClassListForAvailability'];
					var dateSpecificDays = data['dateSpecificDays'];
					if(meetingFor == "REC"){
						var classStartDate =getDateInDateFormat($("#"+formId+" #startDate").val());
						var classEndDate =getDateInDateFormat($("#"+formId+" #endDate").val());
						daysDifference = getDaysDifference(classStartDate, classEndDate);
					}
					if(recurringclassForAA.length > 0 && (meetingFor != "REC")){
						$("#teacherAvailabilityWarningTitle").html(`<h4 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h4>`);
					}else if(recurringclassForAA.length > 0 && (meetingFor == "REC") && daysDifference<=dateSpecificDays){
						$("#teacherAvailabilityWarningTitle").html(`<h4 class="text-center bold text-danger">This slot is not in teacher's availability. If you book this class a date-specific availability will be created for this date.</h4>`);
					}else{
						$("#teacherAvailabilityWarningTitle").html(``);
					}
					//showMessage(false, data['message']);
					var message = data['message'];
					$("#availaibilityHeading").hide();
					if(message=='Admin Host'){
						$("#teacherAvailabilityTable, .teacherAvailabilityTableWrapper").hide();
						$('.activitySave').show();
						var htmlRecu = "<tr><td colspan='5'>Please Proceed to save Extra Activity</td></tr>";
						$("#trRecurring").html(htmlRecu);
						$("#tableRecurring").hide();
						$("#activityValidationHeading").hide();
						$("#recurringTableHeading").text("This Activity will be held by Admin as there is no host selected. Please Proceed to confirm the activity.");
						$("#recurringTableHeading").show();
						$("#validateActivityShowValidationModel").modal('show');
					}else{
						$("#tableRecurring").show();
						$("#activityValidationHeading").show();
						var saveForcefully= data['saveForcefully'];
						if($("#" + formId + " #activityMeetingType").val()=='REC' && saveForcefully=='N' && daysDifference>dateSpecificDays){
							$("#recurringTableHeading").text("");
							$("#recurringTableHeading").hide();
							var html='';
							$("#teacherAvailabilityTable #teacherAvailabilityTbody").html(html);
							var recurringclassForAA = data['recurringClassListForAvailability'];
							if(recurringclassForAA.length>0){
								$("#availaibilityHeading").show();
								$("#needToAddTimePreferrence").val(true);
								$("#teacherAvailabilityTable, .teacherAvailabilityTableWrapper").show();
								for(var k=0; k < recurringclassForAA.length; k++){
									html+=`<tr class='text-danger'>
											<td>`+recurringclassForAA[k]['meetingDate']+`</td>
											<td>`+recurringclassForAA[k]['teacherTime']+`</td>
											<td>`+recurringclassForAA[k]['slotAvailableReason']+`</td>
										</tr>`;
								}
								$("#teacherAvailabilityTable #teacherAvailabilityTbody").html(html);
								$(".activitySave").hide();
								$("#validateActivityShowModel").modal('show');
							}else{
								$("#teacherAvailabilityTable, .teacherAvailabilityTableWrapper").hide();
								$("#needToAddTimePreferrence").val(false);
								$("#validateActivityShowValidationModel").modal('show');
							}
						}else{
							saveForcefully='Y'
							$("#teacherAvailabilityTable, .teacherAvailabilityTableWrapper").hide();
							$("#needToAddTimePreferrence").val(false);
							$("#validateActivityShowValidationModel").modal('show');
						}	
						
						if(saveForcefully=='Y'){
							$(".activitySave").show();
						}
						$("#saveForcefully").val(saveForcefully);
						
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
							htmlRecu = htmlRecu +"<td>"
								+'<p class="mb-0">'+recurringclass[i]['teachName']+'</p>'
							+"</td>";
							htmlRecu = htmlRecu +"<td>"
								+'<p class="mb-0"><b>Teacher Timezone: </b>'+recurringclass[i]['teacherTime']+'</p>'
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
						$('.activitySave').show();
					}else{
						$('.activitySave').hide();
					}
					$("#trRecurring").html(htmlRecu);
				}
				
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}
var saveExtraActivityDetails = debouncing(saveExtraActivityDetailsFun, 300);
function saveExtraActivityDetailsFun(formId,moduleId, roleModuleId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'save-extra-activity'),
		data : JSON.stringify(getRequestForExtraActivity(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				$("#booksclassOutsideAvailabilityConfirmationModal, #validateActivityShowValidationModel").modal("hide");
				$('#addExtraActivityModal').modal('hide');
				setTimeout(function(){ callDashboardPageSchool(roleModuleId,'extra-activity'); }, 2000);
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}

	function getRequestForExtraActivity(formId) {
		var request = {};
		var authentication = {};
		//var requestData = {};
		var extraActivityDetailsDTO = {};
		extraActivityDetailsDTO['activityTypeId'] =$("#" + formId + " #activityType").val();
		if($("#" + formId + " #subActivityLength").val()!=null){
			extraActivityDetailsDTO['subActivityTypeId'] =$("#" + formId + " #subActivityType").val();
		}
		extraActivityDetailsDTO['activityFor'] = $("#" + formId + " #activityFor").val();
		extraActivityDetailsDTO['enrollType'] = $("#" + formId + " #enrollType").val();
		if($("#" + formId + " #enrollType").val()=='BATCH'){
			extraActivityDetailsDTO['courseProIds'] = '38';
		}else if($("#" + formId + " #enrollType").val()=='ALL'){
			extraActivityDetailsDTO['courseProIds'] = '37,38,39,40,41';
		}else if($("#" + formId + " #enrollType").val()=='SSP'){
			extraActivityDetailsDTO['courseProIds'] = '37,40,41';
		}else if($("#" + formId + " #enrollType").val()=='SCHOLARSHIP'){
			extraActivityDetailsDTO['courseProIds'] = '37,39,40,41';
		}else if($("#" + formId + " #enrollType").val()=='ONE_TO_ONE_FLEX'){
			extraActivityDetailsDTO['courseProIds'] = '37';
		}else{
			extraActivityDetailsDTO['courseProIds'] = '37,39,41';
		}
		if($("#" + formId + " #activityFor").val()=='Teachers'){
			extraActivityDetailsDTO['courseProIds'] = '37,38,39,40,41';
		}
		extraActivityDetailsDTO['standardIds'] = $("#" + formId + " #standardIds").select2('val');
		extraActivityDetailsDTO['batchIds'] = $("#" + formId + " #batchIds").select2('val');

		extraActivityDetailsDTO['userIds'] = $("#" + formId + " #userIds").select2('val');
		extraActivityDetailsDTO['teacherIds'] = [$("#" + formId + " #teacherIds").select2('val')];
		if($("#" + formId + " #teacherIds").select2('val')==null || $("#" + formId + " #teacherIds").select2('val')==undefined || $("#" + formId + " #teacherIds").select2('val')==0 || $("#" + formId + " #teacherIds").select2('val')=='[null]'){
			extraActivityDetailsDTO['teacherIds'] = [10547];
		}
		extraActivityDetailsDTO['subjectIds'] = $("#" + formId + " #subjectIds").select2('val');
		extraActivityDetailsDTO['activityMeetingType'] = $("#" + formId + " #activityMeetingType").val();
		
		extraActivityDetailsDTO['startDate'] = $("#" + formId + " #startDate").val();
		if($("#"+formId+" #activityMeetingType").val() == "ODM"){
			extraActivityDetailsDTO['endDate'] = $("#" + formId + " #startDate").val();
		}else{
			extraActivityDetailsDTO['endDate'] = $("#" + formId + " #endDate").val();
		}
		extraActivityDetailsDTO['startTimeHrsFrom'] = $("#" + formId + " #timeHrsFrom").val();
		extraActivityDetailsDTO['startTimeMinFrom'] = $("#" + formId + " #timeMinFrom").val();
		extraActivityDetailsDTO['durationHours'] = $("#" + formId + " #duration").val();
		extraActivityDetailsDTO['durationMinutes'] = $("#" + formId + " #durationMin").val();
		extraActivityDetailsDTO['showLinkBefore'] = $("#" + formId + " #showLinkBefore").val();
		extraActivityDetailsDTO['activityTitle'] = $("#" + formId + " #activityTitle").val();
		if($("#" + formId + " #fileupload1Span").text()=='No file chosen...'){
			extraActivityDetailsDTO['uploadFile'] = "";
		}else{
			extraActivityDetailsDTO['uploadFile'] = $("#" + formId +" #fileupload1Span").text();
		}
		extraActivityDetailsDTO['joiningLink'] = $("#" + formId + " #joiningLink").val();
		extraActivityDetailsDTO['activityPurpose'] = $("#" + formId + " #activityPurpose").val();
		extraActivityDetailsDTO['meetingVendor'] = $("#" + formId + " #meetingVendor").val();
		extraActivityDetailsDTO['schoolId'] = SCHOOL_ID;
		if($("#" + formId + " #activityMeetingType").val()=='REC'){
			var ckBoxValues = $("#" + formId + " #daycheckboxDiv input[type='checkbox']:checked").map(function() {
				return this.value;
			  }).get();
			if(ckBoxValues.length>0){
				extraActivityDetailsDTO['daysId'] = ckBoxValues;
			}
			getAllDaysDate(formId);
		}
		extraActivityDetailsDTO['recurringDates'] = $("#" + formId + " #recurringDates").val();
		extraActivityDetailsDTO['schoolId']= SCHOOL_ID;
		request['extraActivityDetailsDTO'] = extraActivityDetailsDTO;

		authentication['hash'] = getHash();
		authentication['schoolId'] = SCHOOL_ID;
		authentication['schoolUUID'] = SCHOOL_UUID;
		authentication['userId'] = USER_ID;
		request['authentication'] = authentication;
		//request['requestData'] = requestData;
		return request;
	}



function getWeekdayDates(startDate, endDate, weekdays) {
	var weekdayDates = [];
	var current = moment(startDate).startOf('day');
	var end = moment(endDate).startOf('day');

	while (current.isBefore(end) || current.isSame(end, 'day')) {
		if(weekdays.includes(current.day())) {
			weekdayDates.push(current.format('YYYY-MM-DD'));
		}
		current.add(1, 'days');
	}

	return weekdayDates;
}

function getAllDaysDate(formId){
	var startDate = $("#" + formId + " #startDate").val();
	var endDate = $("#" + formId + " #endDate").val();
	var weekdays = $("#" + formId + " #daycheckboxDiv input[type='checkbox']:checked").map(function() {
		return parseInt(this.value - 1);
	}).get();
	var weekdayDates = getWeekdayDates(startDate, endDate, weekdays);
	$("#" + formId + " #recurringDates").val(weekdayDates.join(', '))
}
function resetExtraActivityForm(formId){
	$("#"+formId+" #activityFor").val('').trigger('change');
	$("#"+formId+" #standardIds").val('').trigger('change');
	$("#"+formId+" #batchIds").val('').trigger('change');
	$("#"+formId+" #subjectIds").val('').trigger('change');

	$('#'+formId+' #activityTitle').val('');
	$('#'+formId+' #startDate').val('');
	$('#'+formId+' #endDate').val('');
	$("#"+formId+" #recurringDates").val('');
	$('#'+formId+' #timeHrsFrom').val('');
	$('#'+formId+' #timeMinFrom').val('');
	$('#'+formId+' #duration').val('0');
	$('#'+formId+' #durationMin').val('0');
	$("#"+formId+" #fileupload1Span").text('');
	$('#'+formId+' #activityMeetingType').val('ODM').trigger('change');
	$('#'+formId+' #joiningLink').val('');
	$('#'+formId+' #activityPurpose').val('');

	
}
function activeInactiveExtraActivity(formId,status,id,roleModuleId) {

	var request = {};
	var authentication = {};
	//var requestData = {};
	var extraActivityDetailsDTO = {};
	extraActivityDetailsDTO['activeInactiveStatus'] = status;
	extraActivityDetailsDTO['id'] = id;
	request['extraActivityDetailsDTO'] = extraActivityDetailsDTO;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	//request['requestData'] = requestData;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'active-inactive-extra-activity'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				setTimeout(function() {
					callDashboardPageSchool(roleModuleId,'extra-activity');}, 3000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}

function editExtraActivity(id){
	var request = {};
	var authentication = {};
	var requestData = {};
	var extraActivityDetailsDTO = {};
	extraActivityDetailsDTO['id'] = id;
	requestData['extraActivityDetailsDTO'] = extraActivityDetailsDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['requestData'] = requestData;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'edit-extra-activity'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}

function sendMailForExtraActivity(id){
	var request = {};
	var authentication = {};
	//var requestData = {};
	var extraActivityDetailsDTO = {};
	extraActivityDetailsDTO['id'] = id;
	request['extraActivityDetailsDTO'] = extraActivityDetailsDTO;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	//request['requestData'] = requestData;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'extra-activity-send-Mail'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}

function copyExtraActivityDetails(activityTypeId,activityFor,activityMeetingType,activityTitle,joiningLink,activityPurpose, startDate,endDate,
		batchIds,subjectIds,recurringDates,startTimeHours,startTimeMin,duration,durationMin,uploadFlie, subActivityName, users, enrollType, lmsPlatform){

	$('#addExtraActivityModal').modal('show');
	$('#extraActivityForm #activityTitle').val(activityTitle.replace('- Assessment',''));
	$('#extraActivityForm #activityType').val(activityTypeId).trigger('change');
	$('#extraActivityForm #activityFor').val(activityFor).trigger('change');
	$('#extraActivityForm #startDate').val(startDate);
	$('#extraActivityForm #endDate').val(endDate);
	$("#extraActivityForm #recurringDates").val(recurringDates);
	$('#extraActivityForm #subActivityType option:selected').text(subActivityName);
	$('#extraActivityForm #enrollType').val(enrollType);
	$.each(batchIds.split(","), function(i,e){
		$("#extraActivityForm #batchIds option[value='" + e + "']").prop("selected", true);
	});
	$.each(subjectIds.split(","), function(i,e){
		callSubjectNameList('extraActivityForm');
		$("#extraActivityForm #subjectIds option[value='" + e + "']").prop("selected", true);
	});
	if(users!='' && users!=undefined && users!=null){
		getUserListByActivityFor('extraActivityForm',128);
		$.each(users.split(","), function(i,e){
			$("#extraActivityForm #userIds option[value='" + e + "']").prop("selected", true);
		});
	}
	$('#extraActivityForm #timeHrsFrom').val(startTimeHours);
	$('#extraActivityForm #timeMinFrom').val(startTimeMin);
	$('#extraActivityForm #duration').val(duration);
	if(durationMin<60){
		$('#extraActivityForm #durationMin').val(durationMin);
	}else{
		$('#extraActivityForm #durationMin').val('0');
	}
	$("#extraActivityForm #fileupload1Span").text(uploadFlie);
	if(activityMeetingType=='One Day Meeting'){
		$('#extraActivityForm #activityMeetingType').val('ODM').trigger('change');
	}else{
		$('#extraActivityForm #activityMeetingType').val('REC').trigger('change');
	}

	$('#extraActivityForm #joiningLink').val(joiningLink);
	$('#extraActivityForm #activityPurpose').val(activityPurpose);
	
}



function getHash() {
	return 'ajslfkjalksdf'
}


function callSubjectNameMultipleList(formId, value, userId,courseProviderId ,userRole, dataType) {
	value = value.toString();
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','SUBJECT-NAME-LIST-BASED-ON-BATCHES',userId,courseProviderId,userRole,dataType, value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['courseList'];
					var dropdown = $("#"+formId+" #subjectIds");
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}

function courseProviderList(formId, elementId) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				//dropdown.append('<option value="">Select LMS Platform</option>');
				$.each(result, function(k, v) {
					if(v.key==36 || v.key==37 || v.key==38 || v.key==39 || v.key==40 || v.key==41){
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
						//dropdown.prop("disabled",true)
					}
				});
			}
		}
	});
}

function getRequestForHostList(key){
	var request = {};
	var requestData = {};
	var authentication = {};
	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'COMMON';
	requestData['requestKey'] = key;
	requestData['requestValue'] = SCHOOL_ID;
	request['requestData'] = requestData;
	request['authentication'] = authentication;
	return request;
}