function filterSearchConflictUserReset(formId){
	$('#' + formId)[0].reset();
	$("#"+formId+" #emailId").val('');
	$("#"+formId+" #roleUser").val('');
	$("#"+formId+" #createdDate").val('').trigger('change');
	$("#"+formId+" #UpdatedDate").val('').trigger('change');
}

function advanceSearchDeleteReset(formId){
	$('#' + formId)[0].reset();
	$("#"+formId+" #emailId").val('');
	$("#"+formId+" #roleUser").val('').trigger('change');
	$("#"+formId+" #userName").val('');
}

function searchAdminFilterReset(formId){
	$('#' + formId)[0].reset();
	$("#"+formId+" #Name").val('');
	$("#"+formId+" #roleUser").val('').trigger('change');
	$("#"+formId+" #userName").val('');
	$("#"+formId+" #addedDate").val('').trigger('change');
}

function filterOnlineUserReset(formId){
	$('#' + formId)[0].reset();
	$("#"+formId+" #emailId").val('');
	$("#"+formId+" #roleUser").val('').trigger('change');
	$("#"+formId+" #userName").val('');
	$("#"+formId+" #standardId").val('').trigger('change');
}

// function searchOnlineUser(formId, moduleId){
// 	$.ajax({
// 		type : "POST",
// 		contentType : "application/json",
// 		url : getURLForHTML('dashboard','online-users-request-content'),
// 		data : JSON.stringify(getCallRequestForOnlineUser(formId, moduleId)),
// 		dataType : 'html',
// 		async:false,
// 		success : function(htmlContent) {
// 			if(htmlContent!=""){
//             	var stringMessage = [];
//             	stringMessage = htmlContent.split("|");
//         		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
//         			if(stringMessage[0] == "SESSIONOUT"){
//         				redirectLoginPage();
//         			}else{
//         				showMessage(true, stringMessage[1]);
//         			}
//         		} else {
//         			$(".filter-fields").stop();
        			
//     				$('#teacherQuestion').html(htmlContent);
//         		}
//         		return false;
// 			}
// 		}
// 	});	
// }

function getCallRequestForOnlineUser(formId, moduleId){
	
	var request = {};
	var authentication = {};
	var onlineUserDTO = {};
	onlineUserDTO['moduleId'] = moduleId;
	onlineUserDTO['userName'] = $("#"+formId+" #UserName").val();
	onlineUserDTO['email'] = $("#"+formId+" #emailId").val();
	onlineUserDTO['rollType'] = $("#"+formId+" #roleUser").val();
	onlineUserDTO['userStandard'] = $("#"+formId+" #standardId").val();
	request['onlineUserDTO'] = onlineUserDTO;
	authentication['hash'] = getHash();
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function getCallRequestForConflictUser(formId, moduleId){
	customLoader = true ;
	var request = {};
	var requestData = {};
	var authentication = {};
	var conflictDetailDTO = {};
	conflictDetailDTO['moduleId'] = moduleId;
	conflictDetailDTO['email'] = $("#"+formId+" #emailId").val();
	conflictDetailDTO['createdDate'] = $("#"+formId+" #createdDate").val();
	conflictDetailDTO['updatedDate'] = $("#"+formId+" #updatedDate").val();
	conflictDetailDTO['rollType'] = $("#"+formId+" #roleUser").val();
	conflictDetailDTO['status'] = $("#"+formId+" #filterEnrollStatus").val();
	requestData['conflictDetailDTO'] = conflictDetailDTO;
	request['requestData'] = requestData;
	authentication['hash'] = getHash();
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	return request;
}
function getCallRequestForDeleteUser(formId, moduleId){
	var request = {};
	var requestData = {};
	var authentication = {};
	var deleteUserDetailDTO = {};
	deleteUserDetailDTO['moduleId'] = moduleId;
	deleteUserDetailDTO['email'] = $("#"+formId+" #emailId").val();
	deleteUserDetailDTO['username'] = $("#"+formId+" #userName").val();
	deleteUserDetailDTO['rollType'] = $("#"+formId+" #roleUser").val();
	requestData['deleteUserDetailDTO'] = deleteUserDetailDTO;
	request['requestData'] = requestData;
	authentication['hash'] = getHash();
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	return request;
}
function getCallRequestForAdminUser(formId, moduleId){

	
	var request = {};
	var requestData = {};
	var authentication = {};
	var adminDetailDTO = {};
	adminDetailDTO['moduleId'] = moduleId;
	adminDetailDTO['name'] = $("#"+formId+" #Name").val();
	adminDetailDTO['userName'] = $("#"+formId+" #UserName").val();
	adminDetailDTO['addedDate'] = $("#"+formId+" #addedDate").val();
	adminDetailDTO['rollType'] = $("#"+formId+" #roleUser").val();
	requestData['adminDetailDTO'] = adminDetailDTO;
	request['requestData'] = requestData;
	authentication['hash'] = getHash();
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	return request;
}