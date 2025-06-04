function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
    return null;
}
function getFeedbackQuestion(eventid, questiontype, parentId, start, end, feedbackid, userId, popupId, callfrom) {
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('review','get-question'),
		data : JSON.stringify(getRequestForFeedbackQuestion(eventid, questiontype, parentId, start, end, feedbackid, userId, callfrom)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data.responseStatus.status == 'SUBMITTED') {
				  var htmlPage = "";
          htmlPage = htmlPage + " <section class=\"center-content\"> <div class=\"row\"><div class=\"col-12 text-center\"><p class=\"thanku-emoji\"><i class=\"em em-thumbsup\"></i></p>";
          htmlPage = htmlPage + "   <p class=\"thanks-reaction\">"+data.responseStatus.message+"!</p></div> </div></section> ";
          $(".main-div").html(htmlPage);
			}else if (data.responseStatus.status == 'FAILED') {
				
			} else {
        if(callfrom=='student-feedback'){
          window.setTimeout(function(){$("#"+popupId).modal('show');},8020);
        }
        if(data.feedbackSubject!='' && data.feedbackSubject!=null){
          $("#feedback_title").text(data.feedbackSubject);
        }
        $("#feedbackId").val(feedbackid);
        $("#userName").val(userId);
        
              $(".main-heading").text("We Would like to know your Feedback.");
              //$("#feedbackbtn").html("<div class=\"col-12 text-right\"><button class=\"btn btn-success\" id=\"saveFeedback\">Submit</button></div>");
              $("#feedbackbtn").css({"display": "block"});
              for(i=0; i<data.questionList.length; i++){
                  var htmlQuest = "";
                  var htmlQuestAns = "";
                  if(data.questionList[i].elementName.toUpperCase()=='TEXTAREA'){
                      htmlQuest = "";
                      htmlQuest = htmlQuest + " <div class=\"question\" id=\""+data.questionList[i].questionId+"-"+data.questionList[i].elementName.toUpperCase()+"\"><div class=\"row\"><div class=\"col-12\"><p class='mb-1'><strong>"+data.questionList[i].question+"</strong></p></div> </div></div>";
                      htmlQuest = htmlQuest + " <div class=\"row\"><div class=\"col-12\"><textarea rows=\"3\" cols=\"\" class=\"form-control\" name=\"answer-"+data.questionList[i].questionId+"\"></textarea></div></div><hr />";
                      $(".textarea").append(htmlQuest);
                  }  
                  if(data.questionList[i].elementName.toUpperCase()=='RADIO'){
                      htmlQuest = "";
                      htmlQuestAns = "";
                      htmlQuest = htmlQuest + " <div class=\"question\" id=\""+data.questionList[i].questionId+"-"+data.questionList[i].elementName.toUpperCase()+"\"><div class=\"row\"><div class=\"col-12\"><p class='mb-1'><strong>"+data.questionList[i].question+"</strong></p></div></div></div>";
                      htmlQuest = htmlQuest + "<div class=\"row\"><div class=\"col-12\">";
                      for(r=0; r<data.questionList[i].questionContentDTO.length; r++){
                        htmlQuestAns = htmlQuestAns + " <div class=\"radio\"><input id=\"radio-"+data.questionList[i].questionContentDTO[r].questionContentId+"\" name=\"radio-answer-"+data.questionList[i].questionId+"\" value=\""+data.questionList[i].questionContentDTO[r].questionContentId+"\" type=\"radio\" ><label for=\"radio-"+data.questionList[i].questionContentDTO[r].questionContentId+"\" class=\"radio-label\">"+data.questionList[i].questionContentDTO[r].questionLable+"</label></div>";
                      }
                      htmlQuest = htmlQuest + htmlQuestAns + "</div></div><hr />";
                      $(".radio-buttons").append(htmlQuest);
                  }
                  if(data.questionList[i].elementName.toUpperCase()=='CHECKBOX'){
                      htmlQuest = "";
                      htmlQuestAns = "";
                      htmlQuest = htmlQuest + " <div class=\"question\" id=\""+data.questionList[i].questionId+"-"+data.questionList[i].elementName.toUpperCase()+"\"><div class=\"row\"><div class=\"col-12\"><p class='mb-1'><strong>"+data.questionList[i].question+"</strong></p></div></div></div>";
                      htmlQuest = htmlQuest + " <div class=\"row\"><div class=\"col-12\"><div class=\"checkbox-block\"> ";
                      for(r=0; r<data.questionList[i].questionContentDTO.length; r++){
                        htmlQuestAns = htmlQuestAns + " <input class=\"checkbox-effect checkbox-effect-6\" id=\"get-up-"+data.questionList[i].questionContentDTO[r].questionContentId+"\" type=\"checkbox\" value=\""+data.questionList[i].questionContentDTO[r].questionContentId+"\" name=\"checkbox-answer-"+data.questionList[i].questionId+"\"/><label for=\"get-up-"+data.questionList[i].questionContentDTO[r].questionContentId+"\">"+data.questionList[i].questionContentDTO[r].questionLable+"</label>";
                      }
                      htmlQuest = htmlQuest + htmlQuestAns +  " </div></div></div><hr /> ";
                      $(".checkbox").append(htmlQuest);
                  }
                  if(data.questionList[i].elementName.toUpperCase()=='RATING'){
                      htmlQuest = "";
                      htmlQuestAns = "";
                      htmlQuest = htmlQuest + " <div class=\"question\" id=\""+data.questionList[i].questionId+"-"+data.questionList[i].elementName.toUpperCase()+"\"><div class=\"row\"><div class=\"col-12\"><p class='mb-1'><strong>"+data.questionList[i].question+"</strong></p></div></div>";
                      htmlQuest = htmlQuest + " <div class=\"row align-items-center\"><div class=\"col-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex align-items-center justify-content-end\">"
                      htmlQuest = htmlQuest + " <div class=\"rate pr-0\">";
                      htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star5-"+data.questionList[i].questionId+"\" name=\"rate-"+data.questionList[i].questionId+"\" value=\"5\" onClick=\"selectRate('star5-"+data.questionList[i].questionId+"')\" />";
                      htmlQuest = htmlQuest + " <label for=\"star5-"+data.questionList[i].questionId+"\" title=\"5 Stars\">5 stars</label>";
                      htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star4-"+data.questionList[i].questionId+"\" name=\"rate-"+data.questionList[i].questionId+"\" value=\"4\" onClick=\"selectRate('star4-"+data.questionList[i].questionId+"')\" />";
                      htmlQuest = htmlQuest + " <label for=\"star4-"+data.questionList[i].questionId+"\" title=\"4 Stars\">4 stars</label>";
                      htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star3-"+data.questionList[i].questionId+"\" name=\"rate-"+data.questionList[i].questionId+"\" value=\"3\" onClick=\"selectRate('star3-"+data.questionList[i].questionId+"')\" />";
                      htmlQuest = htmlQuest + " <label for=\"star3-"+data.questionList[i].questionId+"\" title=\"3 Stars\">3 stars</label>";
                      htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star2-"+data.questionList[i].questionId+"\" name=\"rate-"+data.questionList[i].questionId+"\" value=\"2\" onClick=\"selectRate('star2-"+data.questionList[i].questionId+"')\" />";
                      htmlQuest = htmlQuest + " <label for=\"star2-"+data.questionList[i].questionId+"\" title=\"2 Stars\">2 stars</label>";
                      htmlQuest = htmlQuest + " <input type=\"radio\" id=\"star1-"+data.questionList[i].questionId+"\" name=\"rate-"+data.questionList[i].questionId+"\" value=\"1\" onClick=\"selectRate('star1-"+data.questionList[i].questionId+"')\" />";
                      htmlQuest = htmlQuest + " <label for=\"star1-"+data.questionList[i].questionId+"\" title=\"1 Star\">1 star</label>";
                      htmlQuest = htmlQuest + " </div>&nbsp;<b class=\"selectedStar-"+data.questionList[i].questionId+"\">0</b>&nbsp;<span><b>Rating</b><span></div></div></div>";
                      $(".rating").append(htmlQuest);
                  }
              } 
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForFeedbackQuestion(eventid, questiontype, parentId, start, end, feedbackid, userId, callfrom){
	var questionRequest = {};
	
	questionRequest['schoolId'] =SCHOOL_ID;
  questionRequest['eventId'] =eventid;
	questionRequest['questionType'] =questiontype;
  questionRequest['parentId'] =parentId;
  questionRequest['startLimit'] =start;
  questionRequest['endLimit'] =end;
  questionRequest['feedbackid'] = feedbackid
  questionRequest['userId'] = userId;
  questionRequest['callfrom'] = callfrom;
  
	
	return questionRequest;
}
function selectRate(ratingid){
  console.log(ratingid);
  var ratings = $("#"+ratingid).val();
  console.log(ratings);
  var qstid=0;
  var ratingids = ratingid.split("-");
  $(".selectedStar-"+ratingids[1]).text(ratings);
}




function saveFeedbackQuestion() {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('review','submit-answers'),
		data : JSON.stringify(getRequestForSaveFeedback()),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(response) {
			//console.log(JSON.stringify(response));
            if(response.responseStatus.status=='SUCCESS'){
                var htmlPage = "";
                htmlPage = htmlPage + " <section class=\"center-content\"> <div class=\"row\"><div class=\"col-12 text-center\"><p class=\"thanku-emoji\"><i class=\"em em-thumbsup\"></i></p>";
                htmlPage = htmlPage + "   <p class=\"thanks-reaction\">"+response.responseStatus.message+"!</p></div> </div></section> ";
                $(".main-div").html(htmlPage);
                if($("#callfrom").val()=='student-feedback'){
                  window.setTimeout(function(){$("#feedback_review").modal('hide');},1000);
                }
            }
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForSaveFeedback(){
	var answersRequest = {};
  var userId='';
  var answers = [];
  var ansW = {};
  var questionId = '';
  var answer='';
  var questionNameId = '';
  var elementId = '';
  
  answersRequest['userId']= $("#userName").val();
  answersRequest['feedbackId']= $("#feedbackId").val();
  answersRequest['callfrom']= $("#callfrom").val();
  $( ".question" ).each(function( index ) {
    ansW = {};
    questionId = $(this).attr('id').split("-");
    if(questionId.length>1){
      questionNameId = questionId[0];
      elementId = questionId[1];
    }else{
      questionNameId = $(this).attr('id');
    }
    if(elementId =='RADIO'){
      ansW ['questionId'] = questionNameId;
      ansW ['answer'] = $("input[name='radio-answer-"+questionNameId+"']:checked"). val();
    }
    if(elementId =='CHECKBOX'){
      ansW ['questionId'] = questionNameId;
        var favorite = '';
        $.each($("input[name='checkbox-answer-"+questionNameId+"']:checked"), function(){
          favorite = favorite + $(this).val() +',';
        });
      ansW ['answer'] = favorite;
    }
    if(elementId =='TEXTAREA'){
      ansW ['questionId'] = questionNameId;
      ansW ['answer'] = $("textarea[name='answer-"+questionNameId+"']").val();
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
        ansW ['answer'] = rating;
    }
    answers.push(ansW);

  });

  answersRequest['answers']=answers;
  console.log("answersRequest=> ",JSON.stringify(answersRequest));
    return answersRequest;
}


function updateFeedback(userid, key, value) {
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('review','update-feedback'),
		data : JSON.stringify(getRequestForUpdateFeedback(userid, key, value)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}
function getRequestForUpdateFeedback(userid, key, value){
	var updateFeedbackDetailsRequest = {};
	
	updateFeedbackDetailsRequest['userId'] =userid;
  updateFeedbackDetailsRequest['key'] =key;
	updateFeedbackDetailsRequest['value'] =value;
  
	
	return updateFeedbackDetailsRequest;
}