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


function openAiSummaryModal(summary) {

    // $("#aiSummaryModalCustom").remove();

    //   var modalHtml = `
    //       <div class="modal fade show" id="aiSummaryModalCustom" tabindex="-1" role="dialog" style="display:block; z-index: 99999;">
    //         <div class="modal-dialog modal-lg" role="document" style="z-index:100000;">
              
    //           <div class="modal-content" style="border-radius:12px; overflow:hidden;">
                
    //             <div class="modal-header py-2 bg-primary text-white">
    //               <h5 class="modal-title">AI Summary</h5>
    //               <button type="button" class="close text-white" onclick="closeAiSummaryModal();" aria-label="Close">
    //                 <span aria-hidden="true"><i class="fa fa-times"></i></span>
    //               </button>
    //             </div>

    //             <div class="modal-body" id="ai-summary-content" style="height:70vh; overflow-y:auto; padding:20px;">
    //             </div>

    //           </div>

    //         </div>
    //       </div>

    //       <!-- Backdrop -->
    //       <div class="modal-backdrop fade show" style="z-index: 99990;"></div>
    //       `;
    // $("body").append(modalHtml);

	var html = ''
    + '<h3 style="font-size:22px;"><b>AI Summary</b></h3>'
    + '<hr>'
    + '<h4 style="font-size:20px;"><b>' + summary.summaryTitle + '</b></h4>'
    + '<p style="font-size:15px;">' + summary.summaryOverview + '</p>'
    + '<h5 style="font-size:18px; margin-top:20px;"><b>AI Summary Details</b></h5>'
    + '<hr>';

	summary.summaryDetails.forEach(function(item, i) {
		html += ''
			+ '<h4 style="font-size:17px;"><b>' + (i + 1) + '. ' + item.label + '</b></h4>'
			+ '<p style="font-size:15px;">' + item.summary + '</p>'
			+ '<hr>';
	});

    $("#ai-summary-content").html(html);
}