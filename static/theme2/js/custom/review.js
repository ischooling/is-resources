function getReview(userId, eventId, evSrno, callType, questionId, currentPage, recordsPerPage) {
    if (userId == undefined || userId == null) {
        userId = ''
    }
    data={}
    data["userId"]=userId;
    data["schoolId"]=SCHOOL_ID;
    data['eventId']=eventId;
    data["academicYear"]=$("#acadmicYear").val();
    data["startDate"]=$("#startDateSearch").val();
    data["endDate"]=$("#endDateSearch").val();
    data["questionId"]=questionId;
    data["callType"]=callType;
    data["reviewSearch"]=$("#reviewDataSearch").val();
    data["currentPage"]=currentPage!=undefined?currentPage:0;
    data["recordsPerPage"]=recordsPerPage!=undefined?recordsPerPage:50;
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('review','get-review'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data);
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                 if(callType=='SUMMARY'){
                     $("#answerReviewTbody").html("");
                 }else{
                     $("#teacherReviewTbody"+evSrno).html("");
                 }
                var tableHtml='';
                $.each(data.reviewDTOs, function (index, value) {
                    if(callType=='SUMMARY'){
                        $("#feedback_title").text(value.question);
                        tableHtml='';
                        var htmlQuest = " <div class=\"row align-items-center\"><div class=\"col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex align-items-center justify-content-end\">"
                        htmlQuest = htmlQuest + " <div class=\"rate pr-0\">";
                        htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star5-"+value.userId+"-"+value.questionId+"\" name=\"rate-"+value.userId+"-"+value.questionId+"\" value=\"5\"  disabled=\"true\"/>";
                        htmlQuest = htmlQuest + " <label for=\"star5-"+value.userId+"-"+value.questionId+"\" title=\"5 Stars\">5 stars</label>";
                        htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star4-"+value.userId+"-"+value.questionId+"\" name=\"rate-"+value.userId+"-"+value.questionId+"\" value=\"4\"  disabled=\"true\"  />";
                        htmlQuest = htmlQuest + " <label for=\"star4-"+value.userId+"-"+value.questionId+"\" title=\"4 Stars\">4 stars</label>";
                        htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star3-"+value.userId+"-"+value.questionId+"\" name=\"rate-"+value.userId+"-"+value.questionId+"\" value=\"3\"  disabled=\"true\"  />";
                        htmlQuest = htmlQuest + " <label for=\"star3-"+value.userId+"-"+value.questionId+"\" title=\"3 Stars\">3 stars</label>";
                        htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star2-"+value.userId+"-"+value.questionId+"\" name=\"rate-"+value.userId+"-"+value.questionId+"\" value=\"2\"  disabled=\"true\"  />";
                        htmlQuest = htmlQuest + " <label for=\"star2-"+value.userId+"-"+value.questionId+"\" title=\"2 Stars\">2 stars</label>";
                        htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star1-"+value.userId+"-"+value.questionId+"\" name=\"rate-"+value.userId+"-"+value.questionId+"\" value=\"1\"  disabled=\"true\"  />";
                        htmlQuest = htmlQuest + " <label for=\"star1-"+value.userId+"-"+value.questionId+"\" title=\"1 Star\">1 star</label>";
                        htmlQuest = htmlQuest + " </div>&nbsp;<b class=\"selectedStar-"+value.userId+"-"+value.questionId+"\">0</b>&nbsp;<span><b>Rating</b><span></div></div></div>";

                      tableHtml+=`<tr>
                        <td>${(index + 1)}</td>
                        <td>${value.userName}</td>
                        <td>${htmlQuest}</td>
                      `;
                      $("#answerReviewTbody").append(tableHtml);
                      selectRate("star"+value.answerKey+"-"+value.userId+"-"+value.questionId+"", "SUMMARY" );
                    }else{
                        tableHtml='';
                        tableHtml+=`<tr>
                            <td>${(index + 1)}</td>
                            <td>${value.question}</td>
                            <td>${value.totalSent}</td>
                            <td>${value.totalAnswer}</td>
                            <td><a href="javascript:void(0)" onclick="showReviewModel('${value.questionId}','${eventId}','${evSrno}')">View Detail</a></td>
                           </tr> 
                          `;
                        $("#teacherReviewTbody"+evSrno).append(tableHtml);
                    }
                
                })
                if(callType=='SUMMARY'){
                    var htmlpage=dataReviewPagging(data, userId, questionId);
                    $(".reviewpaging").html(htmlpage);

                }else{
                     $("#teacherReviewTable").dataTable({
                        //"pageLength": 50
                    });
                }
                return data;
            }
        }
    });
}


function showReviewModel(questionId, eventId, evSrno) {
    $('#reviewModal').modal('show');
    getReview(USER_ID, eventId, evSrno, "SUMMARY", questionId, 0, 50);

    $("#reviewDataSearch").on('keyup', function (e) {
        if($("#reviewDataSearch").val().length>=3){
            getReview(USER_ID, eventId, evSrno, "SUMMARY", questionId, 0, 50);
        }else if($("#reviewDataSearch").val().length==0){
            getReview(USER_ID, eventId, evSrno, "SUMMARY", questionId, 0, 50);
        }
    });
}

function reviewAdvSearchModel() {
    $('#reviewPopupSearch').modal('show');
    
}


function callForFeedbackQuestionViewList(userId, currentPage, recordsPerPage) {
    if (userId == undefined || userId == null) {
        userId = ''
    }
    data={}
    data["userId"]=userId;
    data["schoolId"]=SCHOOL_ID;
    data["academicYear"]=$("#acadmicYear").val();
    data["startDate"]=$("#startDateSearch").val();
    data["endDate"]=$("#endDateSearch").val();
    data["questionSearch"]=$("#questionDataSearch").val();
    data["currentPage"]=currentPage!=undefined?currentPage:0;
    data["recordsPerPage"]=recordsPerPage!=undefined?recordsPerPage:50;
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('review','feedback-question-view'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            console.log(data);
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    var tableHtml='<tr class="collapse"><td colspan="7">'+data["message"]+'</td></tr>';
                    $("#feedbackReviewTbody").html(tableHtml)
                }
            } else {
                var sr=1;
                var tableHtml='';
                $("#feedbackReviewTbody").html('')
                if(data.feedbackSendReportDTO.length>0){

                    $.each(data.feedbackSendReportDTO, function (index, value) {
                        tableHtml='';
                        tableHtml+=`<tr>
                            <td>${(index + 1)}</td>
                            <td><a href="javascript:void(0)" data-target="#collapseOne${sr}" data-toggle="collapse" aria-expanded="false" aria-controls="collapse${sr}" class="collapsed" onclick="getEventReviewList('${value.eventId}','${sr}','0')"  >${value.eventName}</a></span></td>
                            <td>${value.totalQuestion}</td>
                            <td>${value.sendEmailIdCount}</td>
                            <td>${value.isMailSendCount}</td>
                            <td>${value.isClickedCount}</td>
                            <td>${value.isRepliedCount}</td>
                        </tr> 
                        <tr data-parent="#accordion" id="collapseOne${sr}" class="collapse feedback-tr-${sr}"><td colspan="7" >
                            <table class="table table-bordered table-striped responsive dt-responsive" id="teacherReviewTable${sr}">
                                <thead>
                                    <tr>
                                        <th class="bg-primary text-white">S.No.</th>
                                        <th class="bg-primary text-white">Question</th>
                                        <th class="bg-primary text-white">Sent Feedback</th>
                                        <th class="bg-primary text-white">Reply Feedback</th>
                                        <th class="bg-primary text-white">Action</th>
                                    </tr>
                                </thead>
                                <tbody id="teacherReviewTbody${sr}"></tbody>
                            </table>
                        </td></tr>
                        `;
                        $("#feedbackReviewTbody").append(tableHtml);
                        sr=sr+1;
                    })
                }else{
                    var tableHtml='<tr class=""><td colspan="7" class="text-center ">'+data["message"]+'</td></tr>';
                    $("#feedbackReviewTbody").html(tableHtml)
                }
                //return data;
            }
        }
    });
}


function getEventReviewList(eventId, evSrno, questionId){
    getReview(USER_ID, eventId,evSrno, "", questionId, 0, 50);
}

