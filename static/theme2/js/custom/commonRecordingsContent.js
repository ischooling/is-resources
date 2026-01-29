function populateRecordingModal(recordings, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName, body,message,status, callFrom, userId) {
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
    let entityId = body.entityId;
	let entityName = body.entityName;

    let modalContent = `
    <div id="recordingModal" class="modal fade" tabindex="-1">
        <div class="modal-dialog" style="max-width:70%;">
            <div class="modal-content">
                <div class="modal-header theme-bg">
                    <h5 class="modal-title text-white">
                        Available Recordings
                        ${callFrom != 'TEACHER_DEMO'
                            ? ` | ${inviteeName ? inviteeName + ' | ' : ''}${meetingTitle} | ${meetingStartDate} ${meetingStartTime} | ${hostName}`
                            : ''
                        }
                    </h5>
                    <button onclick="closeAllVideoModal();" type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                </div>
                <div class="modal-body" style='max-height: 80vh; overflow-y: auto;'>`;
                    if(status === "UnAuthorized" || status === "Pending" || status === "Denied" ){
                        modalContent+=
                        `<div class="alert ${status === 'Denied'?'alert-danger':'alert-warning'}  mt-3 py-2 d-flex justify-content-between align-items-center" id="request-status-containt">
                            <span id="request-status-message">${message}</span>
                            <button type="button" class="btn btn-sm btn-outline-dark ms-3 ${status === 'Pending'?'':'d-none'}" id="refreshBtn">Refresh</button>
                        </div>
                        <div class="alert alert-success mt-3 py-2 d-none" id="successMsg">Request sent successfully</div>`;
                    }
                    if(status === "UnAuthorized"){
                        modalContent+=
                        `<div class="card" id="request-permission-card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">Request for Recordings</h5>
                                <div class="d-flex gap-2 align-items-start flex-wrap">
                                    <div class="">
                                        <textarea class="form-control" id="remark" rows="1" maxlength="500" placeholder="Enter your remark (max 500 characters)..."></textarea>
                                        <div class="form-text text-end">
                                            <span id="charCount">0</span>/500
                                        </div>
                                    </div>

                                    <div class="mx-2">
                                        <button class="btn btn-primary px-4" id="sendBtn" disabled>Send Request</button>
                                    </div>
                                </div>
                            </div>
                        </div>`;     
                    }
                    if(callFrom.includes("TEACHER_DEMO")){
                        var filteredRecordings = recordings.urls.filter(urlObj => !urlObj.url.toLowerCase().endsWith('.json'));
                        if (filteredRecordings.length > 0) {
                            modalContent += `<div class="">`;

                            const transcriptUrl = filteredRecordings[filteredRecordings.length - 1]?.url;

                            filteredRecordings.forEach((urlObj, index) => {
                                let label = "Recording";
                                for (const key in titles) {
                                    if (urlObj.url.includes(key)) {
                                        label = titles[key];
                                        break;
                                    }
                                }

                                modalContent += `
                                <div class="recording-item d-flex justify-content-between align-items-center border-bottom py-2">
                                    <h5 class="mb-0">${index + 1}. ${label}</h5>
                                    <button class="btn btn-primary rounded" onclick="playRecording('${urlObj.url}', '${label}')">Play</button>
                                </div>`;
                            });

                            if (transcriptUrl) {
                                modalContent += `
                                <div class="recording-item d-flex justify-content-between align-items-center border-bottom py-2">
                                    <h5 class="mb-0">${recordings.urls.length + 1}. Transcript/AI Summaries</h5>
                                    <button class="btn btn-primary rounded" onclick="openTranscriptAndSummaryModal('${recordings.meetingId}','${entityId}','${entityName}')">Read</button>
                                </div>`;
                            }
                            modalContent += `</div>`;
                        }
                    }else{
                        recordings.forEach(record => {
                            var meetingId = record.meetingId;
                            var sessionUrls = record.urls
                                .map(urlData => {
                                    for (const key in titles) {
                                        if (urlData.url.includes(key)) {
                                            return { url: urlData.url, title: titles[key] };
                                        }
                                    }
                                })
                            var transcriptUrl = record.urls[record.urls.length - 1]?.url;
                            if (sessionUrls.length > 0) {
                                modalContent+=`
                                <div class="session-block mb-0" style="border-bottom: 0;">
                                    <h5>Meeting ID: ${meetingId}</h5>
                                    ${sessionUrls.map((recording, index) =>
                                        `<div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                                            <h6>${index + 1}. ${recording.title}</h6>
                                            <div class="d-flex align-items-center gap-2">
                                                <button class="btn btn-primary" onclick="playRecording('${recording.url}', '${recording.title}')">Play</button>
                                                <button onclick="copyToClipboardSignedUrl('${recording.url}')" class="btn btn-sm d-flex align-items-center justify-content-center" style="border:0; background:transparent; color:darkblue; padding:5px;">
                                                    <i class="fa fa-clone" style="font-size:20px;"></i>
                                                </button>
                                            </div>
                                            <div id="toast" style="visibility: hidden;min-width: 120px; background-color: #333; color: #fff; text-align: center; border-radius: 5px; padding: 8px; position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 1000;">Copied!</div>
                                        </div>`).join("")
                                    }
                                    ${transcriptUrl ?
                                        `<div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                                            <h6>${sessionUrls.length + 1}. Transcript/AI Summaries</h6>
                                            <button class="btn btn-secondary " onclick="openTranscriptAndSummaryModal('${meetingId}','${entityId}','${entityName}')">Read</button>
                                        </div>`
                                        : ""
                                    }
                                </div>`;
                            }
                        });
                    }
                modalContent+=`</div>`
                if(callFrom == "TEACHER_DEMO"){
                    modalContent+=`<div class="modal-footer">
                        <a href="javascript:void(0);" onclick="showWarningMessageShow('Are you sure you want to re-attempt recordings?', \'enableReattemptRecording(${userId})\');" class="btn btn-primary">Enable Re-Attempt Recordings</a>
                    </div>`
                }
            modalContent+=`</div>
        </div>
    </div>`;
    let modalElement = $("#recordingModal");
    if (modalElement.length > 0) {
        modalElement.remove();
    }
    $("body").append(modalContent);
    $("#recordingModal").modal("show");
}

function openTranscriptAndSummaryModal(meetingId, entityId, entityName) {
    let transcriptAndSummaryModal = $("#transcriptAndSummaryModal");

    if (transcriptAndSummaryModal.length === 0) {
        $("body").append(`
            <div id="transcriptAndSummaryModal" class="modal fade" tabindex="-1">
                <div class="modal-dialog modal-xl modal-dialog-centered" style="box-shadow: 0 0;">
                    <div class="modal-content">
                        <div class="modal-header theme-bg">
                            <h5 class="modal-title text-white">Transcript/AI Summaries</h5>
                            <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                        </div>

                        <div class="modal-body p-0">
                            <div class="container-fluid h-100">
                                <div class="row h-100">
                                    <div class="col-md-6 border-end d-flex flex-column p-0 h-100">
                                        <div class="p-3 border-bottom bg-light">
                                            <h6 class="mb-0 font-weight-bold">Transcript</h6>
                                        </div>
                                        <div id="transcript-modal-body" class="p-3" style="max-height: 70vh; overflow: auto;"></div>
                                    </div>

                                    <div class="col-md-6 d-flex flex-column p-0 h-100">
                                        <div class="d-flex flex-column">
                                            <div class="p-3 border-bottom bg-light">
                                                <h6 class="mb-0 font-weight-bold">Deepseek AI Summary</h6>
                                            </div>
                                            <div id="ollama-ai-summary" class="p-3" style="max-height: 35vh; overflow: auto;">
                                                <div id="ollama-summary-content" class="d-none"></div>
                                                <div id="ollama-generate-btn" class="text-center mt-3 d-none">
                                                    <button class="btn btn-sm btn-outline-dark" onclick="generateAiSummary('${meetingId}','${entityId}','${entityName}', 'OLLAMA')">
                                                        Generate Deepseek AI Summary
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column border-bottom">
                                            <div class="p-3 border-bottom bg-light">
                                                <h6 class="mb-0 font-weight-bold">Zoom AI Summary</h6>
                                            </div>
                                            <div id="zoom-ai-summary" class="p-3" style="max-height: 35vh; overflow: auto;">
                                                <div id="zoom-summary-content" class="d-none"></div>
                                                <div id="zoom-generate-btn" class="text-center mt-3 d-none">
                                                    <button class="btn btn-sm btn-outline-dark" onclick="generateAiSummary('${meetingId}','${entityId}','${entityName}', 'ZOOM')">
                                                        Generate Zoom AI Summary
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }

    $("#transcriptAndSummaryModal").modal("show");
    fetchTranscriptAndSummary(meetingId, entityId, entityName);
}