$(document).ready(function() {

});
function callForCommonComments(formId, controllType, entityId, entityName, title) {
	hideMessage('');
	if(title!=undefined && title!=''){
		$('#commonCommentTitle').html(title);
	}
	$('#commonCommentsLogsModel').modal('show');
	var data={};
	data['controllType']=controllType;
	data['entityId']=entityId;
	data['entityName']=entityName;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','common-comments-by-entity-id'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessage(true, stringMessage[1]);
        		} else {
        			$('#commonCommentsLogsModelContents').html(htmlContent);
        		}
        		return false;
			}
		},
		error : function(e) {
			console.log(e)
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function saveCommonComments(formId, controllType, entityId, entityName, title) {
	hideMessage('');
	if ($("#"+formId+" #entityId").val()=='') {
		showMessage(true, 'Entity is required');
		return false
	}
	if ($("#"+formId+" #comments").val()=='' || $("#"+formId+" #comments").val()==null) {
		showMessage(true, 'Comments is required');
		return false
	}
	if($("#"+formId+" #comments").val().length>500){
		showMessage(true, 'Comments length should not more than 500 characters');
		return false
	}
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','save-common-comments-content'),
		data : JSON.stringify(getRequestForSaveCommonComments(formId, moduleId)),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			showMessage(true, stringMessage[1]);
        		} else {
        			callForCommonComments(formId, controllType, entityId, entityName, title)
        			showMessage(true, stringMessage[1]);
        		}
        		return false;
			}
		},
		error : function(e) {
			console.log(e)
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function getRequestForSaveCommonComments(formId, moduleId){
	var request = {};
	var authentication = {};
	var commonCommentsDTO = {};
	commonCommentsDTO['entityId']=$("#"+formId+" #entityId").val();
	commonCommentsDTO['entityName']=$("#"+formId+" #entityName").val();
	commonCommentsDTO['comments']=escapeCharacters($("#"+formId+" #comments").val());
	commonCommentsDTO['addedBy']=$("#"+formId+" #userId").val();
	request['commonCommentsDTO'] = commonCommentsDTO
	
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	return request;
}