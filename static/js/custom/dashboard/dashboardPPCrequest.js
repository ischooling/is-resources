$(document).ready(function () {

});

function validateRequestForPPComments(formId) {
	if ($("#" + formId + " #comments").val() == '' || $("#" + formId + " #comments").val() == null) {
		showMessage(true, 'Comments is required');
		return false
	}
	if (!validateEmail($("#" + formId + " #ppcRequestId").val())) {
		showMessage(true, 'PPCRequestId is required');
		return false
	}
	return true;
}

function callForPPCComments(formId, controllType, ppcRequestId) {
	hideMessage('');
	//	if(!validateRequestForPPComments(formId)){
	//		return false;
	//	}
	var request = { controllType: controllType, ppcRequestId: ppcRequestId };
	$('#ppcCommentsLogsModel').modal('show');
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'ppc-comments-by-ppc-request-id'),
		contentType: "application/json",
		data: JSON.stringify(request),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					$('#ppcCommentsLogsModelContents').html(htmlContent);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(e)
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function savePPCComments(formId) {
	hideMessage('');
	if ($("#" + formId + " #ppcRequestId").val() == '' || $("#" + formId + " #ppcRequestId").val() == null) {
		showMessage(true, 'PPCRequestId is required');
		return false
	}
	if ($("#" + formId + " #comments").val() == '' || $("#" + formId + " #comments").val() == null) {
		showMessage(true, 'Comments is required');
		return false
	}
	if ($("#" + formId + " #comments").val().length > 500) {
		showMessage(true, 'Comments length should not more than 500 characters');
		return false
	}
	$.ajax({
		type: "POST",
		url: getURLForHTML('dashboard', 'save-ppc-comments-content'),
		contentType: "application/json",
		data: JSON.stringify(getRequestForSavePPCComments(formId, moduleId)),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					showMessage(true, stringMessage[1]);
				} else {
					callForPPCComments(formId, 'add', $("#" + formId + " #ppcRequestId").val());
					showMessage(true, stringMessage[1]);
				}
				return false;
			}
		},
		error: function (e) {
			console.log(e)
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}
function getRequestForSavePPCComments(formId, moduleId) {
	var request = {};
	var authentication = {};
	var ppcCommentsDTO = {};
	ppcCommentsDTO['ppcRequestId'] = $("#" + formId + " #ppcRequestId").val();
	ppcCommentsDTO['comments'] = $("#" + formId + " #comments").val();
	ppcCommentsDTO['addedBy'] = $("#" + formId + " #userId").val();
	request['ppcCommentsDTO'] = ppcCommentsDTO

	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	return request;
}