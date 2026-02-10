


function getQuestionList(userId, currentPage, recordsPerPage) {
    if (userId == undefined || userId == null) {
        userId = ''
    }
    data={}
    data["userId"]=userId;
    data["schoolId"]=SCHOOL_ID;
    data["startDate"]=$("#startDateSearch").val();
    data["endDate"]=$("#endDateSearch").val();
    data["questionSearch"]=$("#questionDataSearch").val();
    data["currentPage"]=currentPage!=undefined?currentPage:0;
    data["recordsPerPage"]=recordsPerPage!=undefined?recordsPerPage:50;
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('review','get-question-list'),
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
                 $("#questionListBody").html("");
                var tableHtml='';
                $.each(data.questionList, function (index, value) {
                        tableHtml='';
                        tableHtml+=`<tr>
                            <td>${(index + 1)}</td>
                            <td>${value.eventName}</td>
                            <td>${value.questionCategory !=0 ? 'Multiple' :'Single'}</td>
                            <td>${value.question}</td>
                            <td>${value.elementName}${value.questionType>0?'<a href="javascript:void(0);" onclick="viewQuestionContent('+value.questionId+')"><i class="font-icon-wrapper lnr-eye" title="View"></i></a>':''}</td>
                            <td>${value.parentQuestion}</td>
                            <td>${value.activated=='Y'?'Active':'Inactive'}</td>
                            <td>${value.createDate}</td>
                            <td><a href="javascript:void(0);" class="dropdown-item" onclick="return showWarningMessage('Are you sure you want to delete?', 'deleteQuestion(\\\'${value.questionId}\\\',\\\'DELETE\\\')')">
										<i class="fa fa-trash m-r-10"></i>&nbsp;Delete
									</a></td>
                           </tr> 
                          `;
                        $("#questionListBody").append(tableHtml);
                    
                
                })
                 var htmlpage=dataquestionPagging(data, userId);
                    $(".questionpaging").html(htmlpage);
                return data;
            }
        }
    });
}


function showQuestionFormModel(questionId) {
	if($("#questionFormModal").length){
		$("#questionFormModal").remove();
	}
	$("body").append(questionSaveModal());
    $('#questionFormModal').modal('show');
    $("#addNewLabel").on('click', function(e) {
            e.preventDefault();
            var addNewText = '<div class="row newrow"><div class="col-md-6">';
            addNewText = addNewText + ' <input type="text" class="form-control" name="answerLabel" placeholder="Answer Lable">';
            addNewText = addNewText + ' </div><div class="col-md-6">';
            addNewText = addNewText + ' <button type="button" class="btn btn-primary remove_this" name="addRemoveLabel" value="Remove">-</button>';
            addNewText = addNewText + ' </div></div>';
            $(".inc").append(addNewText);
            return false;
        });

        $(document).on('click', '.remove_this', function() {
            $(this).parents('.newrow').remove();
            return false;
        });
        
        $("#questionSubmit").on('click', function(e){
            callForGetSubmitQuestion('questionForm');
        });

        // callForGetElementMaster();
	    callForGetEventsMaster();
}

function callForGetSubmitQuestion(formId) {
	if(!validateRequestForSubmitQuestion(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
        contentType: APPLICATION_JSON_VALUE,
		url : getURLFor('review','submit-question'), 
		data : JSON.stringify(getRequestForSubmitQuestion(formId)),
		dataType : 'json',
		success : function(jsonContent) {
			if(jsonContent!=""){
				if(jsonContent.statusCode=='SUCCESS'){
                    
					showMessageTheme2(1, jsonContent['message'], '', true);
                    getQuestionList(USER_ID, 0, 30)
                    $("#questionFormModal").modal('hide');
				}
			}
		},
		error : function(e) {
			console.log(true, e.responseText);
		}
	});
}

function getRequestForSubmitQuestion(formId){
	var questionSubmitRequest = {};
	var questionContentDTO = [];
	var questionContent = {};
	questionSubmitRequest['questionId'] = $("#"+formId+" #questionId").val();
	questionSubmitRequest['questionCategory'] = $("#"+formId+" #questionCategory").val();
	questionSubmitRequest['schoolId'] = SCHOOL_ID;
	questionSubmitRequest['eventId'] = $("#"+formId+" #eventId").val();
	questionSubmitRequest['questionType'] = $("#"+formId+" #questionType").val();
	questionSubmitRequest['question'] = $("#"+formId+" #question").val();
	questionSubmitRequest['elementId'] = $("#"+formId+" #questionElementType").val();
	questionSubmitRequest['mendetory'] = '1';
	questionSubmitRequest['parentId'] = $("#"+formId+" #parentQuestion").val();
	questionSubmitRequest['activated'] = $("#"+formId+" #questionActive").val();

	$("input[name='answerLabel']").each(function() {
		questionContent = {};
	    questionContent['questionLable'] = $(this).val();
		questionContent['rightAnswer'] = '0';
		questionContentDTO.push(questionContent);
	});
		
	questionSubmitRequest['questionContentDTO'] = questionContentDTO;		
	console.log("questionSubmitRequest=> ",questionSubmitRequest);
	return questionSubmitRequest;
}


function validateRequestForSubmitQuestion(formId){
	if ($('#eventId').val() == 0 || $('#eventId').val() == '') {
		showMessageTheme2(0, 'event is required.');
		return false;
	}
	if ($('#questionCategory').val() == '') {
		showMessageTheme2(0, 'Question Category is required.');
		return false;
	}
	if ($('#questionType').val() == '') {
		showMessageTheme2(0, 'Question Type is required.');
		return false;
	}
	
	
	
	if ($('#questionElementType').val() == '') {
		showMessageTheme2(0, 'Question Element Type is required.');
		return false;
	}
	
	if ($('#question').val() == '') {
		showMessageTheme2(0, 'Question is required.');
		return false;
	}
	
	return true;
}

function deleteQuestion(questionId, callFrom) {
    data={}
    data["userId"]=USER_ID;
    data["schoolId"]=SCHOOL_ID;
    data["questionId"]=questionId;
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('review','delete-question'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                showMessageTheme2(1, data['message'], '', true);
                getQuestionList(USER_ID, 0, 30)
            }
        }
    });
}


function callForGetElementMaster() {
	$.ajax({
		type : "POST",
        contentType: APPLICATION_JSON_VALUE,
		url : getURLFor('review','get-element-list'),  
		data : JSON.stringify(getRequestForElementMaster()),
		dataType : 'json',
		success : function(jsonContent) {
			if(jsonContent!=""){
				console.log(JSON.stringify(jsonContent));
				var htlContent ="<option value=\"0\">--Select element--</option>";
				var quest = jsonContent.elementTypeList;
				if(quest!=null){
					for (var i = 0; i < quest.length; i++) {
						htlContent = htlContent + " <option value=\""+quest[i].elementId+"\">"+quest[i].elementName+"</option>";
					}
					$("#questionElementType").html(htlContent);
				}
			}
		},
		error : function(e) {
			console.log(true, e.responseText);
		}
	});
}

function getRequestForElementMaster(){
	var elementTypeRequest = {};
    elementTypeRequest['schoolId']=SCHOOL_ID;
	return elementTypeRequest;
}

function callForGetEventsMaster() {
	$.ajax({
		type : "POST",
        contentType: APPLICATION_JSON_VALUE,
		url : getURLFor('review','get-event-list'),  
		data : JSON.stringify(getRequestForEventMaster()),
		dataType : 'json',
		success : function(jsonContent) {
			if(jsonContent!=""){
				console.log(JSON.stringify(jsonContent));
				var htlContent ="<option value=\"0\">--Select Event--</option>";
				var quest = jsonContent.eventTypeList;
				if(quest!=null){
					for (var i = 0; i < quest.length; i++) {
						htlContent = htlContent + " <option value=\""+quest[i].eventId+"\">"+quest[i].eventName+"</option>";
					}
					$("#eventId").html(htlContent);
				}
			}
		},
		error : function(e) {
			console.log(true, e.responseText);
		}
	});
}

function getRequestForEventMaster(){
	var eventTypeRequest = {};
    eventTypeRequest['schoolId']=SCHOOL_ID;
	return eventTypeRequest;
}

function callForGetQuestion(formId, questionCategory) {
	data={}
    data["userId"]=userId;
    data["schoolId"]=SCHOOL_ID;
    data["eventId"]=$("#eventId").val();
    data["feedbackCategory"]=questionCategory;
    data["startDate"]='';
    data["endDate"]='';
    data["currentPage"]=0
    data["recordsPerPage"]=50
	$.ajax({
		type : "POST",
        contentType: APPLICATION_JSON_VALUE,
		url: getURLFor('review','get-question-list'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
		success : function(jsonContent) {
			$("#parentQuestion").html('');
			if(jsonContent!=""){
				console.log("parentQuestion",jsonContent);
				var htlContent ="<option value=\"0\">--Select--</option>";
				var quest = jsonContent.questionList;
				if(quest!=null){
					var parentId = 0;
					for (var i = 0; i < quest.length; i++) {
						if(quest[i].questionType==1){
							parentId = quest[i].questionId;
							htlContent = htlContent + " <option value=\""+quest[i].questionId+"\">"+quest[i].question+"</option>";
						}
						if(parentId == quest[i].parentId){
							htlContent = htlContent + " <option value=\""+quest[i].questionId+"\">"+quest[i].question+"</option>";
						}
						
					}
					
				}
				$("#parentQuestion").html(htlContent);
				
			}else{
				var htlContent ="<option value=\"0\">--Select--</option>";
				$("#parentQuestion").html(htlContent);
			}
		},
		error : function(e) {
			console.log(true, e.responseText);
		}
	});
}


function getRequestForQuestionContent(questionId){
	var questionRequest = {};
	questionRequest['questionId']=questionId;
	
	questionRequest = JSON.stringify(questionRequest)
	return questionRequest;
}

function viewQuestionContent(questionId) {
	initCustomeModal();
	$.ajax({
		type : "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('review','get-question-content-list'),
		data : getRequestForQuestionContent(questionId),
		dataType : 'json',
        async: false,
		success : function(data) {
			if(data!=""){
				if(data.status==0){
        			showMessageTheme2(0, data['message']);
        		} else {
                   var tableHtml=`<table class="table table-hover table-striped table-bordered" id="questionContentlisting">`; 
                        if(data.questionContentDTO.length>0){
                            $.each(data.questionContentDTO, function (index, value) {
                                tableHtml+=`<tr>
                                    <td>${(index + 1)}</td>
                                    <td>${value.questionLable}</td>
                                    </tr>`;
                            });
                        }
                    tableHtml+`</table>`;
        			showCustomeModal('modelQuestionContentId', tableHtml, 'Question Contents', true)
        		}
			}
		},
		error : function(e) {
			console.log(true, e.responseText);
		}
	});
}


function showCustomeModal(modalElementId, modalContent, modalTitle, needToShow){
	$('#'+modalElementId+'Content').html(modalContent);
	$('#'+modalElementId+'Title').html(modalTitle);
	if(needToShow){
		$('#'+modalElementId).modal('show');
	}
}

function bindElementType(el) {
    var type = $(el).val();
    var $elementType = $('#questionElementType');
    $elementType.html('<option value="0">--Select element--</option>');
    if (type === "0") {
        $elementType.append(`
            <option value="3">TEXTAREA</option>
            <option value="4">RATING</option>
        `);
    } 
    else if (type === "1") {
        $elementType.append(`
            <option value="1">RADIO</option>
            <option value="2">CHECKBOX</option>
        `);
    } 
    else {
        $elementType.append(`
            <option value="1">RADIO</option>
            <option value="2">CHECKBOX</option>
            <option value="3">TEXTAREA</option>
            <option value="4">RATING</option>
        `);
    }
}
