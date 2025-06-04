

function addRecommendation(evaluationId) {
	customLoader(false)
	var data = {};
	data['evaluationId'] = evaluationId;
	var payload=JSON.stringify(data);
	payload=encode(payload);
	urlSend = BASE_URL + CONTEXT_PATH + SCHOOL_UUID+'/dashboard/cti-recommendation-add/'+UNIQUEUUID+'?payload='+payload;
	window.open(urlSend, '_blank');
}

function getCTIDetails(userId, evaluationId) {
	var responseData={};
	var data = {};
	data['evaluationId'] = evaluationId;
	data['userId'] = userId;
	data['download'] = 'false';
	var payload=JSON.stringify(data);
	payload=encode(payload);
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID+'/dashboard/cti-recommendation-details/'+UNIQUEUUID+'?payload='+payload,
		dataType : 'json',
		async : false,
		success : function(data) {
			responseData=data;
		}
	});
	return responseData;
}

function confirmCTIRecommendation(userId, evaluationId) {
	if($("#remarks1").val() == null || $("#remarks1").val() == undefined || $("#remarks1").val() == ''){
		showMessageTheme2(0, 'Language Arts Remarks is required', '', true);
		return false;
	}
	if($("#remarks2").val() == null || $("#remarks2").val() == undefined || $("#remarks2").val() == ''){
		showMessageTheme2(0, 'Mathematics Remarks is required', '', true);
		return false;
	}
	if($("#remarks3").val() == null || $("#remarks3").val() == undefined || $("#remarks3").val() == ''){
		showMessageTheme2(0, 'Science Remarks is required', '', true);
		return false;
	}
	if($("#finalRemarks").val() == null || $("#finalRemarks").val() == undefined || $("#finalRemarks").val() == ''){
		showMessageTheme2(0, 'Final Remarks is required', '', true);
		return false;
	}
	if($("#recommendedBy").val() == null || $("#recommendedBy").val() == undefined || $("#recommendedBy").val() == '0'){
		showMessageTheme2(0, 'Academic Expert is required', '', true);
		return false;
	}
	var data = {};
	data['evaluationId'] = evaluationId;
	data['userId'] = userId;
	data['download'] = 'false';
	var payload=JSON.stringify(data);
	payload=encode(payload);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID+'/dashboard/cti-recommendation-save/'+UNIQUEUUID+'?payload='+payload,
		data : JSON.stringify(getRequestForConfirmCTIRecommendation(evaluationId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(false, data['message']);
				}
			} else {
				showMessageTheme2(1, 'Recommendations saved successfully', '', true);
			}
		}
	});
}

function getRequestForConfirmCTIRecommendation(evaluationId){
	var recommendation = {};
	var coursesRecommendations = [];
	for(var index=1;index<=3;index++){
		var coursesRecommendation = {};
		coursesRecommendation['courseName']=$('#courseName'+index).text();
		coursesRecommendation['score']=$('#score'+index).val();
		coursesRecommendation['remarks']=$('#remarks'+index).val();
		coursesRecommendations.push(coursesRecommendation);
	}
	recommendation['evaluationId']=evaluationId;
	recommendation['coursesRecommendations']=coursesRecommendations;
	recommendation['finalRemarks']=$('#finalRemarks').val();
	recommendation['recommendedGradeId']=$('#recommendedGradeId').val();
	recommendation['recommendedBy']=$("#recommendedBy").val();
	return recommendation;
}

function publishCtiRecommendationLetter(publishUrl){
	$('#publishCtiRL').attr('disabled',true);
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : publishUrl,
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$('#msgTheme2').text(data['message']);
				alert(data['message']);
			} else {
				$('#msgTheme2').text(data['message']),
				alert(data['message']);
				$('#resendMailCtiRLDiv').attr("style", "display:inline-block");
				$('#publishCtiRL').attr('disabled',false);
				$('#publishCtiRL').hide();
			}
			return false;
		},
		error : function(e) {
			$('#sendSWPR').removeAttr('disabled','disabled');
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function resendCtiInvitaionMail(evaluationId){
	customLoader(false)
	var data = {};
	data['evaluationId'] = evaluationId;
	var payload=JSON.stringify(data);
	payload=encode(payload);
	urlSend = BASE_URL + CONTEXT_PATH + SCHOOL_UUID+'/dashboard/cti-invitaion-mail-resend/'+UNIQUEUUID+'?payload='+payload;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : urlSend,
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(false,data['message']);
			} else {
				showMessageTheme2(true,data['message']);
			}
			return false;
		},
		error : function(e) {
			$('#sendSWPR').removeAttr('disabled','disabled');
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}