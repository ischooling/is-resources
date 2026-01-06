// let AI_MODEL= "qwen2.5:3b";
// let AI_MODEL= "deepseek-custom";
let AI_MODEL= "gemma2:2b-instruct-q4_K_M";
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
    if(responseData.details == null){
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

function checkAiSummaryAvailable(entityId, entityType) {
    var isAvailable = false;
    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-recordings-summary",
        contentType: "application/json",
        async: false,
        data: JSON.stringify({
            entityId: entityId,
            entityType: entityType
        }),
        success: function(res) {
            if (res.summary && res.summary.summaryDetails && res.summary.summaryDetails.length > 0) {
                isAvailable = true;
            }
        },
        error: function() {
            isAvailable = false;
        }
    });

    return isAvailable;
}

function showAiSummary(entityId, entityType) {

    const requestObj = {
        entityId: entityId,
        entityType: entityType
    };

    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-recordings-summary",
        contentType: "application/json",
        data: JSON.stringify(requestObj),

        success: function (res) {
            if (!res.summary) {
                showMessage(0, "AI Summary not available");
                return;
            }

            openAiSummaryModal(res.summary);
        },

        error: function () {
            showMessage(0, "Failed to load AI Summary");
        }
    });
}


function closeAiSummaryModal() {
    $("#aiSummaryModalCustom").remove();
    $(".modal-backdrop").remove();
}

function generateAiSummary(meetingId, entityId, entityName) {

  $.ajax({
      type: "GET",
      url: BASE_URL + CONTEXT_PATH + "crons/backfill-meetings-summary-details",
      data: {
          meetingId: meetingId,
          pageSize: 10
      },
      success: function(response) {
          showAiSummary(entityId, entityName);
          showMessage(true, "Summary Generated: " + response);
      },
      error: function() {
          showMessage(true, "Failed to generate AI Summary");
      }
  });
}
