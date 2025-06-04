$(document).ready(function() {
	console.log('inside dashboardTipsEducator.js');
});
function saveTipsForEducator(formId,moduleId, roleModuleId) {
	hideMessage('');
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	var labelName = $("#" + formId + " #tips_setTitle").val().trim();
	if (labelName == "" || labelName == undefined) {
		showMessage(true, 'Title is Required.');
		return false
	}

	var attachmentName = $("#" + formId + " #fileupload1ChoosenFile").text();
	if (attachmentName.trim() == "" || attachmentName.trim() == undefined || attachmentName.trim() == "No file chosen..." ) {
		showMessage(true, "Attachment is Required");
		return false;
	}

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'tips-educator-submit'),
		data : JSON.stringify(getRequestForEducatorMapp(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log("response data is:", data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				$('#tips_educatorModal').modal('toggle');
				$('#' + formId)[0].reset();
				setTimeout(function(){ callDashboardPageSchool(roleModuleId,'tips-educators'); }, 1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

	function getRequestForEducatorMapp(formId) {
		var request = {};
		var authentication = {};
		var requestData = {};
		var tipsForEducatorDTO = {};

		tipsForEducatorDTO['attachementName'] = $("#" + formId + " #fileupload1ChoosenFile").text();
		tipsForEducatorDTO['labelName'] =escapeCharacters($("#" + formId + " #tips_setTitle").val().trim());
		tipsForEducatorDTO['isPublished'] = 1;
		tipsForEducatorDTO['controlType'] = 'ADD-TIPS';

		authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
		// authentication['userType'] = moduleId;
		authentication['userId'] = $("#" + formId + " #userId").val();
		request['authentication'] = authentication;
		request['tipsForEducatorDTO'] = tipsForEducatorDTO;
		return request;
	}

}
/**
 * 
 * @param formId :
 *            identifies the formId : String type
 * @param titleId :
 *            titleId contains the encrypted value of primary key of
 *            TIPS_FOR_EDUCATOR
 * @returns : returns the consolidated object of request.
 */
function callForChangeStatus(formId, titleId, flag,roleModuleId) {

	var request = {};
	var authentication = {};
	var requestData = {};
	var tipsForEducatorDTO = {};
	tipsForEducatorDTO['isPublished'] = flag;
	tipsForEducatorDTO['title_ID'] = titleId;
	tipsForEducatorDTO['controlType'] = 'UPDATE_TIPS_STATUS';
	requestData['tipsForEducatorDTO'] = tipsForEducatorDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	// authentication['userType'] = moduleId;
	authentication['userId'] = $("#" + formId + " #userId").val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'update_educator_tips_status'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log("response data is:", data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				setTimeout(function() {
					callDashboardPageSchool(roleModuleId,'tips-educators');

				}, 1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});

}

function sendNotificationsForAddTips(titleId){
	
	var request = {};
	var authentication = {};
	var tipsForEducatorDTO = {};
	tipsForEducatorDTO['title_ID'] = titleId;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	// authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['tipsForEducatorDTO'] = tipsForEducatorDTO;

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'tips_for_educator_send_Mail'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log("response data is:", data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				setTimeout(function() {
					callDashboardPageSchool(roleModuleId,'tips-educators');

				}, 1000);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
	
}
