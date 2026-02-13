function getFeedbackContent(title) {
    var html = `
    <div class="card mx-auto mt-2 rounded-10 perfect-scrollbar-on" style="max-width: 550px;>
        <div class="card-body">
            <div class="card-content theme-card">
                <div class="card-header pgc text-white">
                    <h5 class="card-title font-20 text-white mt-2">Feedback</h5>
                </div>
                <div class="card-body text-center">
                    <div class="mb-3">
                        <img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/FeedbackHeaderIcon.png" style="width:60px;">
                    </div>
                    <h4 class="font-weight-bold mb-4">
                        We Would like to know your Feedback
                    </h4>
                    <div id="questionContainer" class="overflow-y-auto" style="max-height:500px;"></div>
                    <div class="d-flex justify-content-between mt-4">
                <button type="submit" class="btn btn-primary mx-auto" name="submit" id="questionSubmit" value="Submit" onclick="saveStudentFeedback()">
                    Submit Feedback
                </button>
          </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}
function bindFeedbackQuestions(questions) {

    $('#questionContainer').empty();

    if (!questions || questions.length === 0) {
        $('#questionContainer').html(
            `<p class="text-muted text-center">No questions available</p>`
        );
        return;
    }

  $.each(questions, function (index, question) {
        var starHtml = '';
        for (var i = 1; i <= 5; i++) {
               starHtml = "";
                starHtml = starHtml + " <div class=\"question\" id=\""+question.questionId+"-"+question.elementName.toUpperCase()+"\">";
                starHtml = starHtml + " <div class=\"row align-items-center\"><div class=\"col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex align-items-center justify-content-start\">"
                starHtml = starHtml + " <div class=\"rate pr-0\">";
                starHtml = starHtml + " <input type=\"radio\" id=\"star5-"+question.questionId+"\" name=\"rate-"+question.questionId+"\" value=\"5\" onClick=\"selectRate('star5-"+question.questionId+"', '')\" />";
                starHtml = starHtml + " <label for=\"star5-"+question.questionId+"\" title=\"5 Stars\">5 stars</label>";
                starHtml = starHtml + " <input type=\"radio\" id=\"star4-"+question.questionId+"\" name=\"rate-"+question.questionId+"\" value=\"4\" onClick=\"selectRate('star4-"+question.questionId+"', '')\" />";
                starHtml = starHtml + " <label for=\"star4-"+question.questionId+"\" title=\"4 Stars\">4 stars</label>";
                starHtml = starHtml + " <input type=\"radio\" id=\"star3-"+question.questionId+"\" name=\"rate-"+question.questionId+"\" value=\"3\" onClick=\"selectRate('star3-"+question.questionId+"', '')\" />";
                starHtml = starHtml + " <label for=\"star3-"+question.questionId+"\" title=\"3 Stars\">3 stars</label>";
                starHtml = starHtml + " <input type=\"radio\" id=\"star2-"+question.questionId+"\" name=\"rate-"+question.questionId+"\" value=\"2\" onClick=\"selectRate('star2-"+question.questionId+"', '')\" />";
                starHtml = starHtml + " <label for=\"star2-"+question.questionId+"\" title=\"2 Stars\">2 stars</label>";
                starHtml = starHtml + " <input type=\"radio\" id=\"star1-"+question.questionId+"\" name=\"rate-"+question.questionId+"\" value=\"1\" onClick=\"selectRate('star1-"+question.questionId+"', '')\" />";
                starHtml = starHtml + " <label for=\"star1-"+question.questionId+"\" title=\"1 Star\">1 star</label>";
                starHtml = starHtml + " </div> </div></div></div>";
        }
        var html = `
            <div class="card-body bg-light p-4 mb-4 text-left rounded">
                     <div class="form-tagline d-flex align-items-start">
                        <span class="bg-primary text-white d-flex justify-content-center align-items-center rounded-circle me-2 mr-2 mt-1"
                            style="width:24px; height:24px; flex-shrink: 0;">
                            ?
                        </span>
                        <p style="
                            font-size: 18px;
                            margin: 0;
                            flex: 1;         
                            word-break: break-word; 
                            white-space: normal; ">
                            ${question.question}
                        </p>
                    </div>
                    <div class="star-part col-md-12 mt-2">
                        ${starHtml}
                        <span class="selectedStar-${USER_ID}-${question.questionId} ml-2 text-primary font-weight-bold"></span>
                    </div>
              <span class="mt-2">
                <label class="d-block mb-2">
                    Additional feedback (optional)
                </label>

                <textarea 
                    id="studentFeedBackText-${question.questionId}"
                    class="form-control theme-textarea"
                    rows="3"
                    placeholder="Tell us more about your experience..."
                ></textarea>
              </span>

        </div>
        `;

        $('#questionContainer').append(html);
    });
}



function thankyouFeedback(title) {
    var html = `
    <div class="modal fade" id="studentFeedbackThankyouPopup" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered no-shadow rounded-b-full" style="max-width: 400px;" role="document">
            <div class="modal-content">
                <button type="button" class="close ml-auto mr-2 mt-2" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-body text-center">
                    <div class="">
                        <img src="${PATH_FOLDER_IMAGE2}Star Success.gif" alt="check-gif" class="" style="max-width: 150px;">
                    </div>
                    <p class="font-20">
                        Thank You for your valuable <br>
                        Feedback
                    </p>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}
// var html = `
// <div class="card-body bg-light-primary p-4 mb-4 text-left rounded overflow-y-auto">
//     <div class="d-flex align-items-center mb-3">
//         <span class="badge badge-primary rounded-b-full mr-2">?</span>
//         <strong>${question.question}</strong>
//     </div>

//     <div class="form-row flex-column">

//         <span class="mb-3">
//             ${starHtml}
//         </span>

//         <span class="mt-2">
//             <label class="d-block mb-2">
//                 Additional feedback (optional)
//             </label>

//             <textarea 
//                 id="studentFeedBackText-${question.questionId}"
//                 class="form-control theme-textarea"
//                 rows="3"
//                 placeholder="Tell us more about your experience..."
//             ></textarea>
//         </span>
//     </div>
// </div>
// `;





