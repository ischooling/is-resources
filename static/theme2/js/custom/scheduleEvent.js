var renderRecord=10;
var noOfPages;
var currentPage=1;
var showPageLimit=2
var leftLimit=currentPage-showPageLimit; 
var rightLimit=currentPage+showPageLimit+1
var startPageLimit=5
var startDots=1
var meeting_Id;
var advSearch=false;
var noRecordFlag=false;
var confirmationFlag = true;
function renderDataForScheduledEvents(formId,clickFrom,currentPageNo,boxSearchCondition,countType){
	getScheduleEventContent();
	getDataForScheduledEvents(formId,clickFrom,currentPageNo,boxSearchCondition,countType);
}

function getDataForScheduledEvents(formId,clickFrom,currentPageNo,boxSearchCondition,countType) {
	customLoader(true);
	if(boxSearchCondition=='ADV'){
		advSearch=true;
		if(noRecordFlag){
			noRecordFlag=false;
		}
	}
    // if($("#counselorName").val() == ''){
    //     showMessageTheme2(0, "Please select a counselor")
    //     customLoader(false);
    //     return false;
    // }
	$.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('timeavailability','get-data-for-scheduled-events'),
		 data : JSON.stringify(getCallRequestForAdvanceSearchOfEvents(formId, clickFrom,currentPageNo,boxSearchCondition)),
		 dataType : 'json',
		 global:true,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				var showPagination = false;
				var pageSize =$("#"+formId+" #pageSize").val();
				if(pageSize == undefined){
					pageSize = 10;
				}
				if($("#"+formId+" #pageSize").val() >= data[countType] || data[countType] <= pageSize){
					showPagination=true;
				}
				if(data[countType] != null && data[countType] != undefined && data[countType] != ""){
					currentPage = parseInt(currentPageNo);
					noOfPages = parseInt(data[countType])/10;
					noOfPages = noOfPages.toString().split(".");
					if(noOfPages.length>1){
						noOfPages=parseInt(noOfPages[0])+1;
					}else{
						noOfPages=parseInt(noOfPages[0]);
					}
				}else{
					noRecordFlag=true;
				}
				console.log(data.eventDetails)
				//getScheduleEventContent(data, clickFrom, currentPageNo, boxSearchCondition);
				$("#scheduleEventThumbAndTableDate").html(scheduleEventthumb(data)+scheduleEventListDetails(data.eventDetails,clickFrom,currentPage,boxSearchCondition, showPagination, countType,data.remarkMendatory,data.minRemarkCount)+moveEventModal())
				//showMessageTheme2(1, data['message'],'',true);
				$("#scheduleEventsSearchForm").slideUp(700);
				customLoader(false);
				// renderStudentEnrollmentRecord(data, moduleId, clickFrom, currentPage);
				generateTinyUrls();
			}
		 },
		 error:function(e){
            if (checkonlineOfflineStatus()) {
				return;
			}
			// console.log(e);
			customLoader(false);
		 }
	 });
}
function getCallRequestForAdvanceSearchOfEvents(formId, clickFrom, currentPage,boxSearchCondition){
	var scheduledEventsRequest={};
	scheduledEventsRequest['noRecordFlag'] = noRecordFlag;
	scheduledEventsRequest['advSearch'] = advSearch;
	scheduledEventsRequest['userId'] = USER_ID;
	scheduledEventsRequest['schoolId'] = SCHOOL_ID;
	scheduledEventsRequest['clickFrom'] = clickFrom;
	scheduledEventsRequest['currentPage'] = currentPage;
	if($("#"+formId+" #eventType option:selected").val()==''){
		scheduledEventsRequest['eventId']=0
	}else{
		scheduledEventsRequest['eventId']=$("#"+formId+" #eventType option:selected").val();
	}
	scheduledEventsRequest['counselorId'] = $("#userId").val();
	
	if(clickFrom=='advance-search'){
		var sortBy = $("#sortBy").val();
		var withRecordings = $("#withRecordings").val();
		scheduledEventsRequest['learningProgram'] = $("#"+formId+" #learningProgram option:selected").val();
		scheduledEventsRequest['standardId'] = $("#"+formId+" #gradeId option:selected").val();
		scheduledEventsRequest['inviteeName'] = $("#"+formId+" #inviteeName").val();
		scheduledEventsRequest['inviteeEmail'] = $("#"+formId+" #inviteeEmail").val();
		scheduledEventsRequest['phNo'] = $("#"+formId+" #inviteePhoneNo").val();
		scheduledEventsRequest['eventId'] = $("#"+formId+" #eventType option:selected").val();
		scheduledEventsRequest['counselorId'] = $("#"+formId+" #counselorName option:selected").val();
		scheduledEventsRequest['countryId'] = $("#"+formId+" #countryId option:selected").val();
		if($("#"+formId+" #countryId option:selected").val()!=undefined && $("#"+formId+" #countryId option:selected").val()!=''){
			scheduledEventsRequest['country'] = $("#"+formId+" #countryId option:selected").text();
		}
		scheduledEventsRequest['startDate'] = $("#"+formId+" #startDate").val();
		scheduledEventsRequest['endDate'] = $("#"+formId+" #endDate").val();
		if($("#"+formId+" #searchBy option:selected").val()!=undefined && $("#"+formId+" #searchBy option:selected").val()!=''){
			scheduledEventsRequest['searchByDate'] = $("#"+formId+" #searchBy option:selected").text();
		}
		scheduledEventsRequest['meetingStatus'] = $("#"+formId+" #meetingStatus option:selected").val();
		scheduledEventsRequest['sortBy']=sortBy;
		scheduledEventsRequest['withRecordings']=withRecordings;
		scheduledEventsRequest['subSearch'] =boxSearchCondition;
	}
	if(boxSearchCondition==undefined || boxSearchCondition==""){
		scheduledEventsRequest['subSearch'] ="TD";
	}
	scheduledEventsRequest['pageSize']=$("#"+formId+" #pageSize").val();
	console.log(scheduledEventsRequest);
	return scheduledEventsRequest;
}

function scheduleEventFormReset(formId){
    $("#"+formId+" .form-control").each(function(){
        if($(this).hasClass("select2-hidden-accessible")){
			if($(this).children().length>1 && $(this).first().children().val() == ''){
				$(this).val("").trigger("change");
			}
        }else if($(this).hasClass("datepicker")){
            $(this).val("").datepicker("update");
        }else if($(this).hasClass("select-first-value")){
            var id = $(this).attr("id");
            var firstValue = $("#"+id+" option:first-child").val(); 
            $(this).val(firstValue).trigger("change");
        }else if($(this).attr("id") == "pageSize"){
            $(this).val("10");
        }
        else{
            $(this).val("");
        }
    });
}

function sendMailToInviteeForDemo(meetingId) {
	var data={};
	data['meetingId']=meetingId;
	data['userId']=USER_ID;
	data['schoolId']=SCHOOL_ID;
	customLoader(true);
	 $.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('timeavailability','send-demo-mail-to-invitee'),
		 data : JSON.stringify(data),
		 dataType : 'json',
		 async:true,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				
				showMessageTheme2(1, data['message'],'',true);
				customLoader(false);
			}
		 }
	 });
}

function validateFinalRoundBeforeConfirmScheduleEvent() {
    var eventStatus = $('#applicationStatus').val();
    if (!eventStatus) {
        showMessageTheme2(2, "Please select status");
        return false;
    }

    if (!$("#assignedToInterview").val()) {
        showMessageTheme2(2, "Please select assign to");
        return false;
    }

    const slots = buildFinalSlotArray("scheduleEventMeetingStatus");
    if (!slots) return false;

    const remarks = $("#remarks").val()?.trim();
    if (!remarks || remarks.length < 25) {
        showMessageTheme2(2, "Remarks can not be less than 25 characters.");
        return false;
    }

    return true;
}

async function updateMeetingStatus(meetingId, leadId) {
    var eventStatus = $('#applicationStatus').val();
    if (eventStatus == "Final Round of Interview") {
        if (!validateFinalRoundBeforeConfirmScheduleEvent()) {
            return;
        }
        if($("#finalSlotConfirmModal").length){
            $("#finalSlotConfirmModal").remove();
        }
        $("body").append(finalSlotConfirmationModal());
        $("#finalSlotConfirmModal").modal("show");
        $("#finalSlotYesBtn").off("click").on("click", async function () {
            $("#finalSlotConfirmModal").modal("hide");
            await proceedUpdateMeetingStatus(meetingId, leadId);
        });
        $("#finalSlotNoBtn").off("click").on("click", function () {
            $("#finalSlotConfirmModal").modal("hide");
        });
        return;
    }
    await proceedUpdateMeetingStatus(meetingId, leadId);
}

async function proceedUpdateMeetingStatus(meetingId, leadId) {
	var status = $('#status').val();
    var userId = $('#userId').val();
    var eventStatus = $('#applicationStatus').val();
    var duration=0;
    var assignToUserId=0;
    var slotArray = [];
    if(eventStatus!='' && eventStatus!=undefined && (eventStatus=='Another Round of Interview' || eventStatus=='Final Round of Interview')){
        duration=$('#duration').val();
        assignToUserId=$('#assignedToInterview').val();
        if(eventStatus=='Final Round of Interview'){
            slotArray = buildFinalSlotArray("scheduleEventMeetingStatus");
            if (!slotArray) return false;
        }
    }
    if(status=='COMPLETED'){
        if($("#meetingType").val()=='Initial-Interview' || $("#meetingType").val()=='Interview' ){
            if(eventStatus=='' || eventStatus==undefined){
                showMessageTheme2(0, "Application Status field is required.",'',true);
                return false;
            }
        }

    }
    var leadSource = $('#leadSource option:selected').text();
    leadSource= (leadSource=='Select Source'?'':leadSource);
	var remarks = $('#remarks').val();
    var tentativeDate = $('#tentativeDate').val();
	if(status==undefined || status==null || status==0 || status==''){
		showMessageTheme2(0, "Status field is required.",'',true);
		return false;
	}
    if($("#meetingType").val()=='School Demo'){
        if(leadSource==undefined || leadSource==null || leadSource==0 || leadSource==''){
            showMessageTheme2(0, "Lead Source field is required.",'',true);
            return false;
        }
    }

    let isRemarkMendatory =  $('.schedule_remarks').attr('isRemarkMendatory') === "true";
    if(isRemarkMendatory){
        let minMendatoryCount = parseInt($('.schedule_remarks').attr('minlength'))
        if(remarks==undefined || remarks==null || remarks==''){
            showMessageTheme2(0, "Remarks field is required.",'',true);
            return false;
        }
        if(remarks.length < minMendatoryCount){
            showMessageTheme2(0, "Minimum " + minMendatoryCount+ " character required.",'',true);
            return false;
        }
    }
   

	// if(remarks==undefined || remarks==null || remarks==0 || remarks==''){
	// 	showMessageTheme2(0, "Remarks field is required.",'',true);
	// 	return false;
	// }
	if(confirmationFlag && status == "CANCELLED" && leadId !=0){
		$('#confirmeUpdateSystemTraningModal').modal('show');
		return false;
	}
	var data={};
	data['meetingId']=meetingId;
	data['leadId']=leadId;
	data['userId']=USER_ID;
	data['schoolId']=SCHOOL_ID;
	data['status']=status;
	data['meetingType']=$("#meetingType").val();
	data['remarks']=remarks;
    data['tentativeDate']=tentativeDate;
    data['leadSource']=leadSource;
    data['eventStatus']=eventStatus;
    data['duration']=duration;
    data['assignToUserId']=assignToUserId;
    data["slotsList"] = slotArray;
	customLoader(true);
	$.ajax({
        type : "POST",
        contentType : APPLICATION_JSON_VALUE,
        url : getURLForHTML('timeavailability','update-meeting-status'),
        data : JSON.stringify(data),
        dataType : 'json',
        async:true,
        success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
                if(eventStatus!='' && eventStatus!=undefined && (eventStatus=='Another Round of Interview' || eventStatus=='Final Round of Interview') && assignToUserId!=userId){
                    $('#confirmeUpdateSystemTraningModal').modal('hide');
                    $('#updateSystemTraningModal').modal('hide');					
                    showMessageTheme2(1, data['message'],'',true);
                    customLoader(false);
                    setTimeout(() => { renderDataForScheduledEvents('scheduleEventSearchForm','first-search',1,'','count'); }, 300);
                    
                }else{
                    $('#meetingStatus_'+meetingId).html($('#scheduleEventMeetingStatus #status option:selected').text());
                    $('#meetingComments_'+meetingId).html($('#scheduleEventMeetingStatus #remarks').val());
                    $('#confirmeUpdateSystemTraningModal').modal('hide');
                    $('#updateSystemTraningModal').modal('hide');
                    showMessageTheme2(1, data['message'],'',true);
                    customLoader(false);
                    var $meetingRow = $('#meetingStatus_'+meetingId).closest('tr');
                    if (status === 'Red Flag') {
                        $meetingRow.addClass('red-flag-lead').css('pointer-events', 'none');
                    } else {
                        $meetingRow.removeClass('red-flag-lead').css('pointer-events', '');
                    }
                }
			}
		}
	});
}




function openUpdateStatusModal(meetingId, leadId, eventName, name, meetingStartTime, meetingEndTime, meetingDate, meetingEndDate, counselorTimeZone, inviteeStartTime, inviteeEndTime, inviteeMeetingDate, inviteeMeetingEndDate, inviteeTimezone, standardName, inviteeName, inviteeEmail, isdCode, phoneNo, countryName, inviteeCountry,remarkMendatory,minRemarkCount){
	confirmationFlag=true;
	$("#updateModalWrapper").html(updateSystemTraningModal(meetingId, leadId,remarkMendatory,minRemarkCount,eventName,name));
	$("#confirmeUpdateModalWrapper").html(confirmeUpdateSystemTraningModal(meetingId, leadId, eventName, name, meetingStartTime, meetingEndTime, meetingDate, meetingEndDate, counselorTimeZone, inviteeStartTime, inviteeEndTime, inviteeMeetingDate, inviteeMeetingEndDate, inviteeTimezone, standardName, inviteeName, inviteeEmail, isdCode, phoneNo, countryName, inviteeCountry));
	$('#updateSystemTraningModal').modal('show');
    $('.tentativeDate').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
	});
    const interviewBookLinkValidityDaysSetting = getSettingsByTypeAndKey('CONFIGURATION','INTERVIEW_BOOK_LINK_VALIDITY_DAYS');
    const interviewBookLinkValidityDays = JSON.parse(interviewBookLinkValidityDaysSetting).data.metaValue
    var today = new Date();
    today.setDate(today.getDate() + parseInt(interviewBookLinkValidityDays));
    $("#scheduleEventMeetingStatus #interviewValidDate").datepicker({
        format: "M dd, yyyy",
        autoclose: true
    }).datepicker("setDate", today);
    $("#scheduleEventMeetingStatus #status").on('change',function(){
		if($('#scheduleEventMeetingStatus #status').val()=="Positive to enrollment"){
			$('.tentative_date').css("display", "block" );
			$('#tentativeDate').val('');
		}else{
			$('.tentative_date').css( "display", "none" );
		}
	});

    $("#leadSource").select2({
		theme:"bootstrap4"
	});

    $("#meetingType").val(eventName);
    if($("#meetingType").val()!=='School Demo'){
        $(".leadSourceHide").hide();
    }
    callScheduleLeadSourceList('scheduleEventMeetingStatus','B2C','leadSource', true);
    getAllInterviewerList('scheduleEventMeetingStatus','assignedToInterview');
}

function comfirmeupdateMeetingStatus(meetingId, leadId,status){
	if(status=='Yes'){
		confirmationFlag=false;
		updateMeetingStatus(meetingId, leadId);
	}else{
		$("#confirmeUpdateSystemTraningModal").modal("hide");
		$('#updateSystemTraningModal').modal('show');
	}
}

// will remove this
function formatDateToYYYYMMDD(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
// will remove this 



function callScheduleLeadSourceList(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	customLoader(false);
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'LEAD-SOURCE-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Source</option>');
				$.each(result, function (k, v) {
					if(keyStatus){
						dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
					}else{
						dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
					}
				});
				//buildDropdown(data['mastersData']['data'], 0, 'Select Status');
			}
		}
	});
}

function showAndHideDuration(formId){
    if($("#"+formId+ " #applicationStatus").val() == "Another Round of Interview" || $("#"+formId+ " #applicationStatus").val() == "Final Round of Interview"){
        $("#"+formId+ " #durationDiv").show();
        $("#"+formId+ " #assignedToInterviewDiv").show();
        $("#"+formId+ " #interviewValidDateDiv").show();
        if($("#"+formId+ " #applicationStatus").val() == "Final Round of Interview"){
            $("#"+formId+ " #duration option[value='15']").remove();
            var slotsCountSetting = getSettingsByTypeAndKey('CONFIGURATION','FINAL_INTERVIEW_SLOTS_COUNT');
            FINAL_INTERVIEW_SLOTS_COUNT = parseInt(JSON.parse(slotsCountSetting).data.metaValue);
            var slotsIntervalSetting = getSettingsByTypeAndKey('CONFIGURATION','FINAL_INTERVIEW_SLOTS_INTERVAL');
            FINAL_INTERVIEW_SLOTS_INTERVAL = parseInt(JSON.parse(slotsIntervalSetting).data.metaValue);
            renderFinalInterviewSlots(formId);
            // $(".slot-date").datepicker({
            //     format: "M dd, yyyy",
            //     autoclose: true,
            //     startDate: new Date()
            // })
            $("#"+formId + " #finalInterviewSlotsWrapper").show();
        }else{
            if($("#"+formId+ " #duration option[value='15']").length === 0) {
                $("#"+formId+ " #duration option[value='30']").before('<option value="15">15 Min</option>');
            }
            $("#"+formId + " #finalInterviewSlotsWrapper").hide();
        }
    }else{
        $("#"+formId+ " #durationDiv").hide();
        $("#"+formId+ " #assignedToInterviewDiv").hide();
        $("#"+formId+ " #interviewValidDateDiv").hide();
        $("#"+formId + " #finalInterviewSlotsWrapper").hide();
    }
}

function moveCounselorInScheduleEvents(meetingId){
    $("#moveCounselorInScheduleEventModal").remove();
    $("body").append(moveCounselorInScheduleEventModal(meetingId));
    setTimeout(() => {
        $("#moveCounselorInScheduleEventModal").modal("show");
    }, 300);

    getAllInterviewerList('moveCounselorInScheduleEventForm','assigneeMove');
}

function moveInterviewData(meetingId) {
  var data={};
	data['meetingId']=meetingId;
    data['assignToUserId']=$('#assigneeMove').val();
    data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('timeavailability','move-interview'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
		   console.log(data);
			if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
			   showMessageTheme2(1, data['message'],'',false);
                $("#moveCounselorInScheduleEventModal").modal("hide");
                renderDataForScheduledEvents('scheduleEventSearchForm','first-search',1,'','count');
			}
			return false;
		}
	});
}

function showHideApplicationStatus(src){
    var status = $(src).val();
    if (status == "CANCELLED" || status == "RESCHEDULE" || status == ""){
        $("#applicationStatusDiv").hide();
        $("#durationDiv").hide();
        $("#assignedToInterviewDiv").hide();
        $("#applicationStatus").val('').trigger('change');
    } else {
        $("#applicationStatusDiv").show();
        // $("#durationDiv").show();
        // $("#assignedToInterviewDiv").show();
        if(status == "COMPLETED" || status == "NOTATTENDED"){
            if($("#applicationStatus option[value='Final Round of Interview']").length === 0) {
                $("#applicationStatus option[value='Another Round of Interview']").after('<option value="Final Round of Interview">Final Round of Interview</option>');
            }
        }else{
            $("#applicationStatus option[value='Final Round of Interview']").remove();
        }
    }
}