var summaryPollInterval = null;
// let AI_MODEL= "qwen2.5:3b";
// let AI_MODEL= "deepseek-custom";
let AI_MODEL= "gemma2:2b-instruct-q4_K_M";
function openRecordingModal(entityId, entityType, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName, meetingDateSingapore, meetingStartTimeSingapore, callFrom, userId) {
    var apiEndPoint = "/api/v1/leads/get-event-recordings";
    var payload = {}
    payload["entityId"] = entityId;
    payload["entityName"] = entityType;
    if(callFrom.includes("TEACHER_DEMO")){
        apiEndPoint = "/teacher/signup/get-teacher-demo-recordings";
    }else if(callFrom == "SCHEDULE_EVENTS" || callFrom == "SYSTEM_TRAINING"){
        payload["meetingDate"] = formatDateToYYYYMMDDHH(convertLocalToUTC(meetingDateSingapore + " " + meetingStartTimeSingapore, "YYYY-MM-DD HH:mm:ss", BASE_TIMEZONE, "YYYY-MM-DD HH:mm:ss"))
        if(callFrom == "SCHEDULE_EVENTS"){
            payload["meetingType"] = "DEMO";
        }else if(callFrom == "SYSTEM_TRAINING"){
            payload["meetingType"] = "SYS-TRAINING";
        }
    }else if(callFrom == "MEETING_MANAGEMENT" || callFrom == "USER_APPLICATIONS"){
        payload["meetingDate"] = changeDateFormat(new Date(meetingStartDate), "yyyy-mm-dd")
        payload["meetingType"] = entityType;
    }else if(callFrom == "EXTRA_ACTIVITY"){
        payload["meetingDate"] = changeDateFormat(new Date(meetingStartDate), "yyyy-mm-dd")
        payload["meetingType"] = "CLASS";
    }
    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + apiEndPoint,
        data: JSON.stringify(payload),
        contentType: APPLICATION_JSON_VALUE,
        success: function (response) {
            const res = JSON.parse(response);
            if (res.statusCode === 0 || res.statusCode == "SUCCESS") {
                const recordings =  callFrom.includes("TEACHER_DEMO") ? res.recordingArray[0] : res.data.recordingUrls;
                if (recordings) {
                    populateRecordingModal(recordings, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName, payload, res.message, res.status, callFrom, userId);
                    const maxChars = 500;
                    $('#remark').on('input', function () {
                        const length = $(this).val().trim().length;
                        $('#charCount').text(length);
                        $('#sendBtn').prop('disabled', length === 0 || length > maxChars);
                    });
                    $('#sendBtn').on('click', function () {
                        const remark = $('#remark').val().trim();
                        if (!remark || remark.length > maxChars) {
                            return;
                        }
                        const recordingDetails = `${meetingTitle} - ${changeDateFormat(new Date(meetingStartDate), "MMM-dd-yyyy")} ${meetingStartTime} | ${hostName}`;
                        sendRequestRecording(remark, entityId, entityType, recordingDetails);
                        $('#remark').val('');
                        $('#charCount').text(0);
                        $('#sendBtn').prop('disabled', true);
                    });
                    $('#refreshBtn').on('click', function () {
                        closeAllVideoModal();
                        openRecordingModal(entityId, entityType, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName, meetingDateSingapore, meetingStartTimeSingapore);
                    });
                } else {
                    showMessageTheme2(0, "No recordings available.", '', true);
                }
            } else {
                showMessageTheme2(0, `Error: ${res.message}`, '', true);
            }
        }
    });
}

function sendRequestRecording(remark, entityId, entityType, recordingDetails) {
  const body = {
    entityId: entityId,
    entityName: entityType,
    remark: remark,
    recordingDetails: recordingDetails,
    userId:USER_ID
  };
  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/send-recording-request",
    data: JSON.stringify(body),
    contentType: APPLICATION_JSON_VALUE,
    success: function (response) {
      const res = JSON.parse(response);
      if (res.statusCode === 0 && res.status === "success") {
        $('#successMsg').removeClass('d-none');
        $('#request-permission-card').addClass('d-none');
        $('#request-status-message').text('Request is in pending');
        $('#refreshBtn').removeClass('d-none');
        setTimeout(() => {
            $('#successMsg').addClass('d-none');
        }, 2000);
      } else {
        showMessageTheme2(0, `Error: ${res.message}`, '', true);
      }
    }
  });
}
function playRecording(videoUrl, title) {
    let videoModal = $("#videoModal");
    $.ajax({
        type: "GET",
        contentType: APPLICATION_JSON_VALUE,
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
            } else {
                showMessageTheme2(0, responseData.message || "Failed to fetch video URL", '', true);
            }

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

function displayVTT(content) {
    const output = $("#transcript-modal-body");
    output.empty();
    if (!content || content.includes("<Error><Code>")) {
        output.append(`<p style="font-size:16px;">No Transcript Available</p>`);
    } else {
        const lines = content.split("\n");
        lines.forEach(line => {
            line = line.trim();
            if (
                line === "WEBVTT" ||
                /^\d+$/.test(line) ||
                line.includes("-->")
            ) {
                return;
            }

            if (line.length) {
                output.append(
                    `<p style="font-size:14px; margin-bottom:6px;">${line}</p>`
                );
            }
        });
    }
}

function showVTTFile(url, title) {
	let transcriptModal = $("#transcriptModal");
    transcriptModal.remove();
    $("body").append(`
        <div id="transcriptModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog" style="max-width:70%; width: 100%;">
                <div class="modal-content">
                    <div style="padding: 15px 10px; background: #027FFF; display: flex; justify-content: space-between; align-items: center;">
                        <h5 id="transcriptModalTitle" style="font-size: 18px; font-weight: bold; color: #FFF; margin-bottom: 0px;">${title}</h5>
                        <button type="button" class="text-white btn btn-sm btn-danger" data-dismiss="modal" aria-label="Close" style="font-size: 20px !important; margin: 0; padding: 0px 8px;" onclick="closeTranscriptModal();">&times;</button>
                    </div>
                    <div id="transcript-modal-body" class="text-left" style="flex-grow: 1; padding: 20px; height: 70vh; overflow-y: auto;">
                        <!-- Transcript content will be populated here -->
                    </div>
                </div>
            </div>
        </div>
    `);

	customLoader(true);
	const vttFile = convertToVTT(url);
	$.ajax({
		type: "GET",
		contentType: APPLICATION_JSON_VALUE,
		dataType: 'json',
		url: getURLForTranscriptContent(vttFile),
		success: function(responseData) {
            customLoader(false);
            displayVTT(responseData.content, title);
            $("#transcriptModal").modal("show");
		},
		error: function() {
            customLoader(false);
            showMessageTheme2(0, "Failed to load transcript.");
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

function formatOllamaText(text) {
    if (!text) return "";
    return text
        .replace(/### (.*)/g, "<h5>$1</h5>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\n\n/g, "<br/><br/>")
        .replace(/\n/g, "<br/>");
}

function showTranscriptAndSummaryFromApi(apiResponse, meetingId, entityId, entityName) {
    displayVTT(apiResponse.details.transcript);

    if (apiResponse.details.zoomSummary) {
        var zoom = apiResponse.details.zoomSummary;
        let zoomHtml = `
            <h5>${zoom.summaryTitle}</h5>
            <p style="font-size:14px;">${zoom.summaryOverview}</p>
            <hr/>
        `;

        zoom.summaryDetails.forEach((item, i) => {
            zoomHtml += `
                <h6>${i + 1}. ${item.label}</h6>
                <p style="font-size:13px;">${item.summary}</p>
                <hr/>
            `;
        });

        $("#zoom-summary-content")
            .removeClass("d-none")
            .html(zoomHtml);
    } else {
        $("#zoom-generate-btn").removeClass("d-none");
    }
    if (apiResponse.details.ollamaSummary) {
        var formattedOllama = formatOllamaText(apiResponse.details.ollamaSummary);

        $("#ollama-summary-content")
            .removeClass("d-none")
            .html(formattedOllama);
    } else {
        $("#ollama-generate-btn").removeClass("d-none");
    }
}

async function fetchTranscriptAndSummary(meetingId, entityId, entityName) {
    showLoadingState();
    var payload = {};
    payload["model"] = AI_MODEL;
    payload["userId"] = USER_ID;
    payload["entityType"] = entityName;
    payload["entityId"] = entityId;
    payload["forceGenerate"] = false;
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "ai/summary",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.details == null || responseData.details.transcript == null){
        pollSummaryStatus(entityId, entityName, meetingId);
    }else if(responseData.details){
        if (!responseData.details.ollamaSummary) {
            pollSummaryStatus(entityId, entityName, meetingId);
        }
        showTranscriptAndSummaryFromApi(responseData, meetingId, entityId, entityName);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

function showLoadingState() {
    if($("#summaryLoader").length == 0){
        var loadingHtml = `
            <div id="summaryLoader" class="text-center text-muted">
                <i class='fa fa-spinner fancytree-helper-spin text-primary' aria-hidden='true'></i>
                <span class="ms-2">Generating...</span>
            </div>
        `;
    }
    $("#transcript-modal-body").html(loadingHtml);
    $("#zoom-summary-content").removeClass("d-none").html(loadingHtml);
    $("#ollama-summary-content").removeClass("d-none").html(loadingHtml);
    $("#zoom-generate-btn").addClass("d-none");
    $("#ollama-generate-btn").addClass("d-none");
}

async function pollSummaryStatus(entityId, entityName, meetingId) {
    summaryPollInterval = setInterval(async () => {
        var statusPayload = {};
        statusPayload["model"] = AI_MODEL;
        statusPayload["userId"] = USER_ID;
        statusPayload["entityType"] = entityName;
        statusPayload["entityId"] = entityId;
        statusPayload["forceGenerate"] = false;
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + "ai/summary-status",
            body: statusPayload,
            global: false,
            showMessage: false
        };
        var statusResponse = await callCommonAjax(ajaxReqDetails);
        if (statusResponse.details && statusResponse.details.ollamaSummary) {
            clearInterval(summaryPollInterval);
            summaryPollInterval = null;
            showTranscriptAndSummaryFromApi(statusResponse, meetingId, entityId, entityName);
        }
    }, 30000);
}