function renderStudentFeedbackPage(title){
    $('#dashboardContentInHTML').html(getFeedbackContent(title));
     let email =  $("#userName").val();
    loadFeedbackQuestions(2, [0,1], 0, 0, 100, 0, email, '', '');
}
async function loadFeedbackQuestions(eventid, questiontype, parentId, start, end, feedbackid, email, callfrom){
  var questionRequest = {};	
        questionRequest['schoolId'] =SCHOOL_ID;
        questionRequest['eventId'] =eventid;
        questionRequest['questionType'] =questiontype;
        questionRequest['parentId'] =parentId;
        questionRequest['startLimit'] =start;
        questionRequest['endLimit'] =end;
        questionRequest['feedbackid'] = feedbackid
        questionRequest['userId'] = email;
        questionRequest['callfrom'] = callfrom;

    var ajaxReqDetails = {
        method: "POST",
        url : getURLFor('review','get-question'),
        body: questionRequest,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.responseStatus.status == 1){
        bindFeedbackQuestions(responseData.questionList);
    }else{
        showMessageTheme2(0, responseData.responseStatus.message);
    }
}
function selectRate(ratingid, callFrom){
    console.log(ratingid);
    var ratings = $("#"+ratingid).val();
    if(callFrom=='SUMMARY'){
      $("#"+ratingid).prop('checked', true)
    }
    var qstid=0;
    var ratingids = ratingid.split("-");
    $(".selectedStar-"+ratingids[1]+"-"+ratingids[2]).text(ratings);
}

async function saveStudentFeedback(){
    var validationResult = validateStudentFeedback();
    if(!validationResult.isValid){
        showMessageTheme2(0, validationResult.message);
        return;
    }

    var ajaxReqDetails = {
        method: "POST",
        url : getURLFor('review','submit-student-feedback-answers'),
        body: getSaveStudentFeedbackRequest(),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        $("#clubRegistrationSuccessModal").remove();
        $("body").append(thankyouFeedback());
        $("#studentFeedbackThankyouPopup").modal("show");
        $("#questionContainer :input").prop("disabled", true);
        $("#questionSubmit").prop("disabled", true);
        feedbackRefresh();
    }else{
        showMessageTheme2(0, responseData.message);
    }
}


function validateStudentFeedback() {
    var isValid = false; 
    var message = '';

    $(".question").each(function(index){
        var questionIdParts = $(this).attr('id').split("-");
        var questionNameId = questionIdParts[0];
        var elementId = questionIdParts[1] || '';

        if(elementId === 'RATING'){
            var ratingSelected = $("#star1-"+questionNameId).prop('checked') ||
                                 $("#star2-"+questionNameId).prop('checked') ||
                                 $("#star3-"+questionNameId).prop('checked') ||
                                 $("#star4-"+questionNameId).prop('checked') ||
                                 $("#star5-"+questionNameId).prop('checked');

            if(ratingSelected){
                isValid = true;
                return false; 
            }
        }
    });

    if(!isValid){
        message = "Please fill at least one Feedback.";
    }

    return {isValid, message};
}

function getSaveStudentFeedbackRequest(){ 
 var answersRequest = {};
  var answers = [];
  var ansW = {};
  var questionId = '';
  var questionNameId = '';
  var elementId = '';
  
  $( ".question" ).each(function( index ) {
    ansW = {};
    let pushData = false;
    questionId = $(this).attr('id').split("-");
    if(questionId.length>1){
      questionNameId = questionId[0];
      elementId = questionId[1];
    }else{
      questionNameId = $(this).attr('id');
    }
    if(elementId =='RATING'){
            ansW ['questionId'] = questionNameId;
            var rating = 0;
            if($("#star5-"+questionNameId).prop('checked')){
                rating=5;
            }
            if($("#star4-"+questionNameId).prop('checked')){
                rating=4;
            }
            if($("#star3-"+questionNameId).prop('checked')){
                rating=3;
            }
            if($("#star2-"+questionNameId).prop('checked')){
                rating=2;
            }
            if($("#star1-"+questionNameId).prop('checked')){
                rating=1;
            }
            if(rating){
                ansW ['answer'] = rating;
                ansW ['remarks'] = $("#studentFeedBackText-"+questionNameId).val();
                pushData = true;
            }
    }
    if(pushData){
        answers.push(ansW);
    }

  });
  answersRequest['userId'] = USER_ID;
  answersRequest['feedbackId'] = 0;
  answersRequest['answers']=answers;
  console.log("answersRequest=> ",JSON.stringify(answersRequest));
    return answersRequest;
}


function feedbackRefresh(){
    $( ".question" ).each(function( index ) {
        questionId = $(this).attr('id').split("-");
        if(questionId.length>1){
        questionNameId = questionId[0];
        elementId = questionId[1];
        }else{
        questionNameId = $(this).attr('id');
        }
        if(elementId =='RATING'){
            $("#star1-"+questionNameId).prop('checked', false);
            $("#star2-"+questionNameId).prop('checked', false);
            $("#star3-"+questionNameId).prop('checked', false);
            $("#star4-"+questionNameId).prop('checked', false);
            $("#star5-"+questionNameId).prop('checked', false);
        $("#studentFeedBackText-"+questionNameId).val('')
        }
    });
}