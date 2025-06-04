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
    if($("#counselorName").val() == ''){
        showMessageTheme2(0, "Please select a counselor")
        customLoader(false);
        return false;
    }
	$.ajax({
		 type : "POST",
		 contentType : "application/json",
		 url : getURLForHTML('timeavailability','get-data-for-scheduled-events'),
		 data : JSON.stringify(getCallRequestForAdvanceSearchOfEvents(formId, clickFrom,currentPageNo,boxSearchCondition)),
		 dataType : 'json',
		 async:true,
		 global:false,
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
				$("#scheduleEventThumbAndTableDate").html(scheduleEventthumb(data)+scheduleEventListDetails(data.eventDetails,clickFrom,currentPage,boxSearchCondition, showPagination, countType)+moveEventModal())
				//showMessageTheme2(1, data['message'],'',true);
				$("#scheduleEventsSearchForm").slideUp(700);
				customLoader(false);
				// renderStudentEnrollmentRecord(data, moduleId, clickFrom, currentPage);
				
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
		 contentType : "application/json",
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
		 },
		 error:function(e){
			// console.log(e);
			 customLoader(false);
		 }
	 });
}

function updateMeetingStatus(meetingId, leadId) {
	
	var status = $('#status').val();
	var remarks = $('#remarks').val();
	if(status==undefined || status==null || status==0 || status==''){
		showMessageTheme2(0, "Status field is required.",'',true);
		return false;
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
	data['remarks']=remarks;
	customLoader(true);
	 $.ajax({
		 type : "POST",
		 contentType : "application/json",
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
				$('#meetingStatus_'+leadId).html($('#scheduleEventMeetingStatus #status option:selected').text());
				$('#meetingComments_'+leadId).html($('#scheduleEventMeetingStatus #remarks').val());
				$('#confirmeUpdateSystemTraningModal').modal('hide');
				$('#updateSystemTraningModal').modal('hide');					
				showMessageTheme2(1, data['message'],'',true);
				customLoader(false);
			}
		 },
		 error:function(e){
			// console.log(e);
			 customLoader(false);
		 }
	 });
}




function openUpdateStatusModal(meetingId, leadId, eventName, name, meetingStartTime, meetingEndTime, meetingDate, meetingEndDate, counselorTimeZone, inviteeStartTime, inviteeEndTime, inviteeMeetingDate, inviteeMeetingEndDate, inviteeTimezone, standardName, inviteeName, inviteeEmail, isdCode, phoneNo, countryName, inviteeCountry){
	confirmationFlag=true;
	$("#updateModalWrapper").html(updateSystemTraningModal(meetingId, leadId));
	$("#confirmeUpdateModalWrapper").html(confirmeUpdateSystemTraningModal(meetingId, leadId, eventName, name, meetingStartTime, meetingEndTime, meetingDate, meetingEndDate, counselorTimeZone, inviteeStartTime, inviteeEndTime, inviteeMeetingDate, inviteeMeetingEndDate, inviteeTimezone, standardName, inviteeName, inviteeEmail, isdCode, phoneNo, countryName, inviteeCountry));
	$('#updateSystemTraningModal').modal('show');
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

function openRecordingModal(entityId, entityType, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName, meetingDateSingapore, meetingStartTimeSingapore) {
    const body = {
        entityId: entityId,
        entityName: entityType,
		meetingDate: formatDateToYYYYMMDDHH(convertLocalToUTC(meetingDateSingapore + " " + meetingStartTimeSingapore, "YYYY-MM-DD HH:mm:ss", BASE_TIMEZONE, "YYYY-MM-DD HH:mm:ss")),
        meetingType: "DEMO"
    };

    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-event-recordings",
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function (response) {
            const res = JSON.parse(response);
            if (res.statusCode === 0 && res.status === "success") {
                const recordings = res.data.recordingUrls;
                if (recordings && recordings.length > 0) {
                    populateRecordingModal(recordings, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName);
                } else {
                    showMessageTheme2(0, "No recordings available.", '', true);
                }
            } else {
                showMessageTheme2(0, `Error: ${res.message}`, '', true);
            }
        },
        error: function (e) {
            console.error("Error Fetching the data:", e.message);
        }
    });
}

function populateRecordingModal(recordings, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName) {
    const titles = {
        "shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
        "active_speaker.mp4": "Active Speaker",
        "shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
        "gallery_view.mp4": "Gallery View",
        "shared_screen.mp4": "Shared Screen",
        "shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
        "-1.1.mp4": "Recording",
        "-1.2.mp4": "Recording 2",
        "audio_only": "Audio File",
    };

    let modalContent = `
        <div id="recordingModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog" style="max-width:70%;">
                <div class="modal-content">
                    <div class="modal-header theme-bg">
                        <h5 class="modal-title text-white">Available Recordings | ${inviteeName} | ${meetingTitle} | ${meetingStartDate} ${meetingStartTime} | ${hostName}</h5>
                        <button onclick="closeAllVideoModal();" type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body" style='max-height: 80vh; overflow-y: auto;'>`;

    recordings.forEach(record => {
        const meetingId = record.meetingId;
        const sessionUrls = record.urls
            .map(urlData => {
                for (const key in titles) {
                    if (urlData.url.includes(key)) {
                        return { url: urlData.url, title: titles[key] };
                    }
                }
                // return { url: urlData.url, title: "Unknown Recording" };
            })
            // .filter(recording => !recording.url.includes("shared_screen.mp4"));

        const transcriptUrl = record.urls[record.urls.length - 1]?.url;

        if (sessionUrls.length > 0) {
            modalContent += `
                <div class="session-block pb-4">
                    <h5>Meeting ID: ${meetingId}</h5>
                    ${sessionUrls.map((recording, index) => `
                        <div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                            <h6>${index + 1}. ${recording.title}</h6>
                            <button class="btn btn-primary" onclick="playRecording('${recording.url}', '${recording.title}')">Play</button>
                        </div>
                    `).join("")}
                    ${
                        transcriptUrl 
                            ? `
                            <div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                                <h6>${sessionUrls.length + 1}. Transcript</h6>
                                <button class="btn btn-secondary" onclick="showVTTFile('${transcriptUrl}', 'Transcript')">Read</button>
                            </div>`
                            : ""
                    }
                </div>`;
        }
    });

    modalContent += `
                    </div>
                </div>
            </div>
        </div>
    `;

    let modalElement = $("#recordingModal");
    if (modalElement.length > 0) {
        modalElement.remove();
    }

    $("body").append(modalContent);
    $("#recordingModal").modal("show");
}


function playRecording(videoUrl, title) {
    let videoModal = $("#videoModal");
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        url: getURLForSignVideo(videoUrl),
        success: function (responseData) {
            if (responseData.status == 0) {
                const signedUrl = responseData.url;

                if (videoModal.length == 0) {
                    $("body").append(`
                        <div id="videoModal" class="modal fade" tabindex="-1">
                            <div class="modal-dialog" style="max-width:70%;">
                                <div class="modal-content">
                                    <div class="modal-header theme-bg">
                                        <h5 class="modal-title text-white">${title}</h5>
                                        <button onclick="closeVideoModal();" type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                                    </div>
                                    <div class="modal-body text-center">
                                        <video class="videoTag w-100" controls>
                                            <source src="${signedUrl}" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                } else {
					videoModal.find(".modal-title").text(title);
					videoModal.find(".videoTag source").attr("src", signedUrl);
					videoModal.find(".videoTag")[0]?.load();
                }

                $("#videoModal").modal("show");
                // videoModal.find(".videoTag")[0]?.play();
            } else {
                showMessageTheme2(0, responseData.message || "Failed to fetch video URL", '', true);
            }

            customLoader(false);
        },
        error: function (e) {
            console.error("Error fetching signed video URL:", e.message);
            showMessageTheme2(0, "Error fetching video.", '', true);
            customLoader(false);
        }
    });
}

function getURLForSignVideo(videoUrl) {
    const payload = JSON.stringify({ url: videoUrl });
    const encodePayload = window.btoa(payload);
    return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
}

function getURLForTranscriptContent(transcriptUrl) {
    var payload = JSON.stringify({ url: transcriptUrl });
    var encodePayload = window.btoa(payload);
    return BASE_URL + CONTEXT_PATH + "transcript/show-content?payload=" + encodePayload;
}

function convertToVTT(videoUrl) {
    if (!videoUrl.endsWith(".mp4")) {
        return null;
    }
    const urlParts = new URL(videoUrl);
    const filePath = urlParts.pathname.replace(
        /\/([^\/]+)-(\d+\.\d+)\.mp4$/,
        "/$1-transcript-$2.vtt"
    );
    let transcriptUrl = urlParts.origin + filePath;

    if (transcriptUrl === videoUrl) {
        const prefixUrl = "https://ischoolingwise.s3.us-east-1.amazonaws.com/recordings/";
        const sessionId = videoUrl.split(prefixUrl)[1].split("-")[0];
        transcriptUrl = `${prefixUrl}${sessionId}-transcript-1.1.vtt`;
    }
    return transcriptUrl;
}

function displayVTT(content, title) {
    const output = $("#transcript-modal-body");
    output.empty();

	if(content.includes("<Error><Code>")){
		output.append(`<p style="font-size: 18px;">No Transcript Available</p>`)
	} else {
		var lines = content.split("\n");
		lines.forEach(line => {
			var p = $("<p></p>").text(line);
			output.append(p);
		});
	}

    $("#transcriptModalTitle").html(title);
    $("#transcriptModal").modal("show");
}

function showVTTFile(url, title) {
    let transcriptModal = $("#transcriptModal");

    if (transcriptModal.length === 0) {
        $("body").append(`
            <div id="transcriptModal" class="modal fade" tabindex="-1">
                <div class="modal-dialog" style="max-width:70%;">
                    <div class="modal-content" style="height: 80vh;">
                        <div class="modal-header theme-bg">
                            <h5 id="transcriptModalTitle" class="modal-title text-white">Transcript</h5>
                            <button type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close" onclick="closeTranscriptModal();">&times;</button>
                        </div>
                        <div id="transcript-modal-body" class="modal-body text-left" style="overflow-y: auto;">
                            <!-- Transcript content will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    customLoader(true);
	const vttFile = convertToVTT(url);
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        url: getURLForTranscriptContent(vttFile),
        success: function(responseData) {
            customLoader(false); 
            displayVTT(responseData.content, title);
        },
        error: function() {
            customLoader(false);
            showMessageTheme2(0, "Failed to load transcript.", '', true);
        }
    });
}

function closeAllVideoModal(){
	$("#recordingModal").modal("hide");
}

function closeVideoModal(){
	const videoElement = $("#videoModal .videoTag")[0];
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
    }
    $("#videoModal").modal("hide");
}

function closeTranscriptModal(){
    $("#transcriptModal").modal("hide");
}

function formatDateToYYYYMMDD(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateToYYYYMMDDHH(dateStr) {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    if (isNaN(date)) return null;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const finalDate = year + '-' + month + '-' + day + " " + hours;
    return finalDate;
}