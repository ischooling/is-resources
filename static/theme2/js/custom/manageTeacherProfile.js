function getReceivedTeachedProfileListRequestApi(formId, moduleId) {
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','get-recevied-teacher-profile'),
	 data : JSON.stringify(getReceivedTeachedProfileRequest(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getReceivedTeachedProfileListHtml(data.receivedTeachedProfileList);
			$("#receivedTeachedProfileListBody").html(html);
			 var table = $('#receivedTeachedProfileListTable').DataTable({"pagingType":"full"}); 
			$('#receivedTeachedProfileListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}

function getPendingTeachedTrainingListRequestApi(formId, moduleId) {
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','get-recevied-teacher-profile'),
	 data : JSON.stringify(getPendingTeachedTrainingRequest(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getPendingTeachedTrainingListHtml(data.receivedTeachedProfileList);
			$("#pendingTeachedTrainingListBody").html(html);
			
			 var table = $('#pendingTeachedTrainingListTable').DataTable({"pagingType":"full"}); 
			$('#pendingTeachedTrainingListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}

function getPendingContractListRequestApi(formId, moduleId) {
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','get-teacher-pending-contract'),
	 data : JSON.stringify(getPendingContractRequest(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getPendingContractListHtml(data.teacherPendingBankRequestDTO);
			$("#pendingContractListBody").html(html);
			
			 var table = $('#pendingContractListTable').DataTable({"pagingType":"full"}); 
			$('#pendingContractListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}

function getRejectedTeacherListRequestApi(formId, moduleId) {
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','get-rejected-teacher-contract'),
	 data : JSON.stringify(getRejectedTeacherListRequest(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getRejectedTeacherListListHtml(data.teacherRequestDTO);
			$("#rejectedTeacherListBody").html(html);
			
			 var table = $('#rejectedTeacherListTable').DataTable({"pagingType":"full"}); 
			$('#rejectedTeacherListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}



function getReceivedTeachedProfileRequest(formId, moduleId){
	var requestBody = {};
  	requestBody['userId'] = USER_ID;
  	requestBody['moduleId'] = moduleId;
  	requestBody['types'] = "0,1";
  	requestBody['ids'] = "13,24"; 
	return requestBody;
}

function getPendingTeachedTrainingRequest(formId, moduleId){
	var requestBody = {};
  	requestBody['userId'] = USER_ID;
  	requestBody['moduleId'] = moduleId;
  	requestBody['types'] = "0,1";
  	requestBody['ids'] = "16";
	return requestBody;
}

function getPendingContractRequest(formId, moduleId){
	var requestBody = {};
  	requestBody['userId'] = USER_ID;
  	requestBody['moduleId'] = moduleId;
  	requestBody['types'] = "0,1";
  	// requestBody['ids'] = "19,20,22,23";
  	requestBody['ids'] = "19";
	return requestBody;
}


function getRejectedTeacherListRequest(formId, moduleId){
	var requestBody = {};
  	requestBody['userId'] = USER_ID;
  	requestBody['moduleId'] = moduleId;
  	requestBody['types'] = "2";
  	requestBody['ids'] = "15,18,21,25";
	return requestBody;
}

function getReceivedTeachedProfileListHtml(receivedTeachedProfileList){
	var html='';
	if(receivedTeachedProfileList.length>0){
		for (let iu = 0; iu < receivedTeachedProfileList.length; iu++) {
			const receivedTeachedProfile = receivedTeachedProfileList[iu];
			
			html+=`<tr id="profileId_${receivedTeachedProfile.userId}" class="profileId_${receivedTeachedProfile.userId}">	
            <td style="text-align:center;">${iu+1}</td>
			<td>${receivedTeachedProfile.countryName}</td>
           	<td>${receivedTeachedProfile.name}</td>
           	<td>${receivedTeachedProfile.mobileNumber}</td>
			<td>${receivedTeachedProfile.userName}</td>
			<td id="status_${receivedTeachedProfile.userId}">`;
				if(receivedTeachedProfile.teacherFirstReset == 13){
					html+=`Demo under review`;
				}else if(receivedTeachedProfile.teacherFirstReset == 24){
					html+=`On hold`;
				}else{
					html+=`NA`;
				}
			html+=`</td>
			<td class="text-center">`
				if(ROLE_MODULE.viewed == 'Y'){
					if(receivedTeachedProfile.generalMeetingId != 0){
						html+=`<a onclick="openRecordingModal('${receivedTeachedProfile.generalMeetingId}', 'GENERAL_MEETINGS', '', '', '', '', '', '', '', 'TEACHER_DEMO' ,'${receivedTeachedProfile.userId}')" class="btn btn-primary btn-sm " href="javascript:void(0);">Recording</a>`;
					}else if(receivedTeachedProfile.demoVedioLink == ""){
						html+=`N/A`
					}else{
						html+=`<a onclick="checkLinkValid(event, this)" href="${receivedTeachedProfile.demoVedioLink}" class="btn btn-primary btn-sm " target="_blank">View</a>`;
					}
				}
			html+=`</td>
			<td class="text-center">${ROLE_MODULE.viewed == "Y"?`<a href="javascript:void(0);"  class="btn btn-primary btn-sm " onclick="getAsPost('/dashboard/profile-view-content?userId=${receivedTeachedProfile.userId}&moduleId=${receivedTeachedProfile.mangeUserListModId}&actionType=1a')"  >Click here</a> `:""}</td>
			<td class="text-center">
				${
					ROLE_MODULE.updated == "Y"
					? `
					<div class="dropdown">
						<button class="btn btn-sm btn-outline-secondary" type="button" data-toggle="dropdown" aria-expanded="false">
							<i class="fas fa-ellipsis-v"></i>
						</button>
						<div class="dropdown-menu dropdown-menu-right">
							<a class="dropdown-item" href="javascript:void(0);" onclick="return callPendingReqModel('${receivedTeachedProfile.userId}', '${receivedTeachedProfile.teacherFirstReset}', '${receivedTeachedProfile.isTeacherPoliceVerifide}');">
								<i class="fas fa-edit mr-2"></i> Update Status
							</a>
							<a class="dropdown-item edit-agreement-btn-${receivedTeachedProfile.userId}" data-contract-id="${receivedTeachedProfile.contractId}" href="javascript:void(0);" onclick="addTeacherContract('${receivedTeachedProfile.userId}', '${escapeCharacters(receivedTeachedProfile.name)}', '${receivedTeachedProfile.userName}', $(this).attr('data-contract-id'));">
								<i class="fas fa-file-contract mr-2"></i> <span id="addContractSpan${receivedTeachedProfile.userId}">${receivedTeachedProfile.contractId > 0 ? "Add/Edit Contract" : "Add Contract"}</span>
							</a>
							<a class="dropdown-item" href="javascript:void(0);" onclick="openCommunicationLogsModalForUserApplication('${receivedTeachedProfile.userScreeningId}', 'USER_SCREENING', 'TEACHER_PROFILE');">
								<i class="fas fa-comment me-2"></i>&nbsp;Communication Log
							</a>
						</div>
					</div>
					`
					: ""
				}
			</td>
			</tr>`;
		}
	}
	return html;
}

function getPendingTeachedTrainingListHtml(pendingTeachedTrainingList){
	var html='';
	if(pendingTeachedTrainingList.length>0){
		for (let iu = 0; iu < pendingTeachedTrainingList.length; iu++) {
			const pendingTeachedTraining = pendingTeachedTrainingList[iu];
			html+=`<tr>	
            <td style="text-align:center;">${iu+1}</td>
           	<td>${pendingTeachedTraining.name}</td>
			<td>${pendingTeachedTraining.userName}</td>
			<td>${pendingTeachedTraining.set1Mark}</td>
			<td>${pendingTeachedTraining.set2Mark}</td>
			<td>${pendingTeachedTraining.lastUpdate}</td>
			<td><div id="approvedRequest${pendingTeachedTraining.userId}">
			${ROLE_MODULE.updated=='Y'?`<a href="javascript:void(0);" onclick="return callRemarksModel('${pendingTeachedTraining.userId}');" class="waves-effect">Update Status</a>`:""}
			<div></td>
			</tr>`;
		}
	}
	return html;
}


function getPendingContractListHtml(pendingContractList){
	var html='';
	if(pendingContractList.length>0){
		for (let iu = 0; iu < pendingContractList.length; iu++) {
			const pendingContract = pendingContractList[iu];
			html+=`<tr id="profileId_${pendingContract.userId}">	
            <td style="text-align:center;">${iu+1}</td>

           	<td>${pendingContract.name}</td>
			<td>${pendingContract.mobileNumber}</td>
			<td>${pendingContract.userName}</td>
			<td>
				${/*<a onclick="return callSchoolInneraction('teacher-agreement','?userId=${pendingContract.userId}&controlType=edit&moduleId=${moduleId}','section-linebox');" href="javascript:void(0);" class="waves-effect">Click here</a>*/''}
				<a onclick="addTeacherContract('${pendingContract.userId}', '${escapeCharacters(pendingContract.name)}', '${pendingContract.userName}', $(this).attr('data-contract-id'));" href="javascript:void(0);" class="waves-effect edit-agreement-btn-${pendingContract.userId}" data-contract-id="${pendingContract.contractId}">Click here</a>
			</td>
			<td><a href="javascript:void(0);" onclick="return callAgreementReqModel('${pendingContract.userId}','${pendingContract.meetingId}');" class="waves-effect">Update Status</a></td>
			<td>
				${/*<a href="${pendingContract.agreementUrl!=null?pendingContract.agreementUrl:'javascript:void(0);alert(\'No agreement yet generated\')'}" target="_blank"
					class="waves-effect" style="position:relative;top:5px;"><i class="fa fa-download"></i>
				</a> |*/''}
				<a href="${pendingContract.agreementViewUrl!=null?pendingContract.agreementViewUrl:'javascript:void(0);alert(\'No agreement yet generated\')'}" target="_blank"
					class="waves-effect" style="position:relative;top:5px;"><i class="fa fa-eye"></i>
				</a>
			</td>
			</tr>`;
		}
	}
	return html;
}


function getRejectedTeacherListListHtml(rejectedTeacherList){
	var html='';
	if(rejectedTeacherList.length>0){
		for (let iu = 0; iu < rejectedTeacherList.length; iu++) {
			const rejectedTeacher = rejectedTeacherList[iu];
			html+=`<tr id="profileId_${rejectedTeacher.userId}">	
            <td style="text-align:center;">${iu+1}</td>
           	<td>${rejectedTeacher.countryName}</td>
           	<td>${rejectedTeacher.name}</td>
           	<td>${rejectedTeacher.applicationNo}</td>
			<td>${rejectedTeacher.userName}</td>`;
			// if(roleAndModule.viewed=='Y'){
			// 	html+=`<td><a href="${BASE_URL}${CONTEXT_PATH}${UNIQUEUUID}/dashboard/profile-view-content?userId=${rejectedTeacher.userId}&moduleId=${rejectedTeacher.mangeUserListModId}&actionType=1a" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa fa-eye"></i>&nbsp;View</a></td>
			// 	<td><a onclick="return callUserActivity('formId','${rejectedTeacher.userId}','true','false',${moduleId});" href="javascript:void(0);" class="btn btn-outline-primary btn-sm"><i class="fa fa-cogs"></i>&nbsp;Click here</a></td>`;
			// }
			if(ROLE_MODULE.viewed=='Y'){
				html+=`<td>`;
					if(rejectedTeacher.teacherFirstReset == '14' || rejectedTeacher.teacherFirstReset == '17' || rejectedTeacher.teacherFirstReset == '20'){
						html+=`<a onclick="getAsPost('/dashboard/profile-view-content?userId=${rejectedTeacher.userId}&moduleId=${ROLE_MODULE.moduleId}&actionType=1a')" href="javascript:void(0);" class="btn btn-outline-primary btn-sm"><i class="fa fa-eye"></i>&nbsp;View</a></a>`;
					}else if(rejectedTeacher.teacherFirstReset == '15' || rejectedTeacher.teacherFirstReset == '18' || rejectedTeacher.teacherFirstReset == '21'){
						html+=`<a onclick="getAsPost('/dashboard/profile-view-content?userId=${rejectedTeacher.userId}&moduleId=${ROLE_MODULE.moduleId}&actionType=1a')" href="javascript:void(0);" class="btn btn-outline-primary btn-sm"><i class="fa fa-eye"></i>&nbsp;View</a></a>`;
					}else{
						html+=`<a onclick="getAsPost('/dashboard/profile-view-content?userId=${rejectedTeacher.userId}&moduleId=${ROLE_MODULE.moduleId}&actionType=1a')" href="javascript:void(0);" class="btn btn-outline-primary btn-sm"><i class="fa fa-eye"></i>&nbsp;View</a></a>`;
					}
				html+=`</td><td>
					<a onclick="return callUserActivity('formId','${rejectedTeacher.userId}','true','false',${ROLE_MODULE.moduleId});" href="javascript:void(0);" class="btn btn-outline-primary btn-sm"><i class="fa fa-cogs"></i>&nbsp;Click here</a>
				</td>`;
				}
			html+=`<td>
				<a onclick="return showWarningMessageShow('Are you sure you want to reactivate teacher profile?', 'callCommonAction(\\\'\\\',\\\'update-teacher-request\\\',\\\'dashboard\\\',\\\'re-active\\\',\\\'${rejectedTeacher.userId}\\\',\\\'Teacher Re-Active\\\',\\\'\\\',\\\'${ROLE_MODULE.moduleId}\\\')');" href="javascript:void(0);" class="btn btn-outline-primary btn-sm">Re-activate profile</a>
			</td>
			</tr>`;
		}
	}
	return html;
}


function checkLinkValid(e, src){
		var url = $(src).attr("href").trim();
		try {
			if (!url.startsWith("http") && !url.includes('://')) {
				throw new Error('URL is invalid');
			}

			if (url.includes(' ')) {
				throw new Error("URL contains spaces.");
			}

			if ((url.match(/https?:\/\//g) || []).length > 1) {
				throw new Error("Multiple URLs detected.");
			}

			new URL(url);
		} catch (error) {
			e.preventDefault();
			$("#modalMessageInvalidLink").text(url);
			$("#invalidLinkModal").modal("show");
		}
	}

		function callTeacherAgreement(userId){
	   	 	callSchoolInneraction('teacher-agreement',userId);
	   	    callDashboardPageSchool('5b');
		}
	    var statusUpdateHold = {};
	    function callPendingReqModel(userId, firstReset, isTeacherPoliceVerifide){
			console.log("pending remarks");
			$("#profileApprovalId").trigger('reset')
			$('#profileApprovalModal #moduleId').val('${moduleId}');
			$('#profileApprovalId #pendingRemark').show();
			$('#profileApprovalId #techerAgreementShow').hide();
			$('#profileApprovalModal #profileApproval').removeClass('modal-xl');
	    	$('#profileApprovalId #remarksStatus').val('0');
	    	$('#profileApprovalId #remarks').val('');
	    	$('#showAgreement1').hide();
	    	$('#showRemark1').show();
	    	$('#profileApprovalModal').modal('show');
			$('#profileApprovalId #remarks').val('');
	    	$('#profileApprovalModal #userId').val(userId);
	    	$('#profileApprovalModal #firstReset').val(firstReset);
			let htmlOption = '';
			htmlOption = ``;
			if(firstReset == 21 || firstReset == 22 ){
				htmlOption = 
				`<option value="0">Select status</option>
				<option value="6" ${isTeacherPoliceVerifide == undefined || isTeacherPoliceVerifide == "N" ? 'disabled' : ''}>Redirect to Bank Details Step</option>
				<option value="2">Decline</option>`
			}else if(firstReset == 23){
				htmlOption = `<option value="0">Select status</option>
							  <option value="2">Decline</option>`;
			}else{
				htmlOption = `
							<option value="0">Select status</option>
							<!-- <option value="1">Approve</option>
							<option value="3">Redirect to Contract Details</option> -->
							<option value="4">On Hold</option>
							<option value="2">Decline</option>`;
			}
			// else if(firstReset == 20 || (isTeacherPoliceVerifide == 'Y' && firstReset == 21) || (Object.keys(statusUpdateHold).length != 0 && statusUpdateHold[userId] == 'verified')){
			// 	htmlOption = `
			// 					<option value="0">Select status</option>
			// 					<!-- <option value="1">Approve</option> -->
			// 					<option value="3">Approve Verification & Redirect to Contract Details</option>
			// 					<option value="4">Profile On Hold</option>
			// 					<option value="2">Decline</option>`;
			// }else if(isTeacherPoliceVerifide == 'N' && firstReset == 24 && (Object.keys(statusUpdateHold).length == 0 || statusUpdateHold[userId] != 'verified')){
			// 	htmlOption = `
			// 					<option value="0">Select status</option>
			// 					<!-- <option value="1">Approve</option> -->
			// 					<option value="5">Approve & Redirect to Verification Details</option>
			// 					<!-- <option value="4">Profile On Hold</option> -->
			// 					<option value="2">Decline</option>`;
			// }else if(isTeacherPoliceVerifide == 'Y' && firstReset == 24 || (Object.keys(statusUpdateHold).length != 0 && statusUpdateHold[userId] == 'verified')){
			// 	htmlOption = `
			// 					<option value="0">Select status</option>
			// 					<!-- <option value="1">Approve</option> -->
			// 					<option value="3">Approve Verification & Redirect to Contract Details</option>
			// 					<!-- <option value="4">Profile On Hold</option> -->
			// 					<optionU value="2">Decline</option>`;
			// }else if((Object.keys(statusUpdateHold).length == 0 || statusUpdateHold[userId] != 'verified')){
			// 	htmlOption = `
			// 					<option value="0">Select status</option>
			// 					<!-- <option value="1">Approve</option> -->
			// 					<option value="5">Approve & Redirect to Verification Details</option>
			// 					<option value="3">Approve Verification & Redirect to Contract Details</option>
			// 					<option value="4">Profile On Hold</option>
			// 					<option value="2">Decline</option>`;
			// }
			$("#profileApprovalModal #remarksStatus").html(htmlOption);
			$('#profileApprovalId #remarksStatus').val('0');
			// getEmployeeSpecializationDropDown('profileApprovalId','employeeSpecialization');
			
	    //  $('#profileApprovalModal #meetingId').val(meetingId);

	    }
		function getEmployeeSpecializationDropDown(formId, elementId){
				$.ajax({
				type : "POST",
				contentType : APPLICATION_JSON_VALUE,
				url : getURLForCommon('masters'),
				data : JSON.stringify(getRequestForMaster('formId','SPECIALIZATION_STATUS_LIST')),
				dataType : 'json',
				async : false,
				success : function(data) {
					if (data['status'] == '0' || data['status'] == '2') {
						showMessage(true, data['message']);
					} else {
						var result = data['mastersData']['data'];
						var dropdown = $('#'+formId+' #'+elementId);
						dropdown.html('');
						$.each(result, function(k, v) {
							dropdown.append('<option value="' + v.key + '">' + v.value+ ' </option>');
						});
					}
				}
			});
		}
	   	function callAgreementReqModel(userId, meetingId){
			console.log("callAgreementReqModel ");
	    	$('#teacherAgreementApprovalId #remarksStatus').val('0');
	    	$('#teacherAgreementApprovalId #remarks').val('');
	    	if(meetingId==0){
	    		$('#teacherAgreementApprovalId #meetingStatus').val('N');
	    	}else{
	    		$('#teacherAgreementApprovalId #meetingStatus').val('Y');
	    	}
	    	$('#teacherAgreementApprovalModal').modal('show');
	    	//$('#profileApprovalId #showAgreement').hide();
	    	$('#teacherAgreementApprovalId #userId').val(userId);
	    }
	    function callRemarksModel(userId){
	    	console.log('ph');
	    	$('#interviewModal #remarksStatus').val('9999');
	    	$('#interviewModal #remarks').val('');
	    	$('#remarksModal').modal('show');
	    	$('#userId').val(userId);
	    }
	    function callInterviewRemarksModel(userId, meetingId, mailSendStatus){
			console.log("pending remarks");
			//if(mailSendStatus=='Y' ){
				$('#interviewApprovalId #pendingRemark').show();
				$('#interviewApprovalId #techerAgreementShow').hide();
				$('#interviewApprovalModal #interviewApproval').removeClass('modal-lg');
		    	$('#interviewApprovalId #remarksStatus').val('0');
		    	$('#interviewApprovalId #remarks').val('');
		    	$('#showAgreement').hide();
		    	 $('#showRemark').show();
		    	$('#interviewApprovalModal').modal('show');
		    	$('#interviewApprovalModal #userId').val(userId);
		    	$('#interviewApprovalModal #meetingId').val(meetingId);
			//}else{
			//	showMessage(true, 'Please send mail before updating status');
	    	//	return false;
			//}
	    }

	    function updateInterviewRemarks(formId,roleModuleId){
	    	if($("#"+formId+" #remarksStatus").val()==undefined || $("#"+formId+" #remarksStatus").val()=='' || $("#"+formId+" #remarksStatus").val()=='9999' ){
	    		showMessage(false, 'Please chose remark status.');
	    		return false;
			 }
	    	if($("#"+formId+" #remarks").val()=='' || $("#"+formId+" #userId").val()==''){
	    		showMessage(false, 'Remarks is required.');
	    		return false;
			   }
			 if(roleModuleId=='' || roleModuleId==undefined){
				 roleModuleId=$("#"+formId+" #userId").val();
				}
	    	console.log("test");
			   var remarks=escapeCharacters($("#"+formId+" #remarks").val());
			   var userId=$("#"+formId+" #userId").val();
			   var meetingId=$("#"+formId+" #meetingId").val();
			   if(meetingId!=undefined && meetingId!=''){
				   if($("#"+formId+" #remarksStatus").val()==1){
					   callCommonAction('','update-teacher-request','dashboard','qualified',userId,remarks,meetingId,roleModuleId);
				   }else{
					   callCommonAction('','update-teacher-request','dashboard','non-qualified',userId,remarks,meetingId,roleModuleId);
				   }
			   }else{
				   if($("#"+formId+" #remarksStatus").val()==0){
					   callCommonAction('','update-teacher-request','dashboard','non-qualified',userId,remarks,roleModuleId);
				   }else{
					   callCommonAction('','update-teacher-request','dashboard','qualified',userId,remarks,roleModuleId);
				   }
			   }
			   $('#remarksModal').modal('hide');
	    }

	    function updateRemarksTeacher(roleModuleId){
		    console.log("updateRemarks ManageTeacherProfileContent ");
	    	if($('#profileApprovalId #remarksStatus').val()==undefined || $('#profileApprovalId #remarksStatus').val()=='0'){
				showMessageTheme2(0, 'Remarks status is required.');
	    		return false;
			}

			if(roleModuleId==''){
				roleModuleId =$('#profileApprovalId #userId').val()
			}
			if($('#profileApprovalId #remarksStatus').val()!='3'){
	    	if($('#profileApprovalId #remarks').val()==''){
	    		showMessageTheme2(0, 'Remarks is required.');
	    		return false;
			  }
			}

	    	if (!validateCharacters($('#profileApprovalId #remarksStatus').val())) {
	    		showMessageTheme2(0, 'Please use the English Keyboard while providing information');
	    		return false
	    		}

			if (!validateCharacters($('#profileApprovalId #remarks').val())) {
	    		showMessageTheme2(0,'Please use the English Keyboard while providing information');
	    		return false
	    		}

			   var remarks=escapeCharacters($('#profileApprovalId #remarks').val());
			   var userId=$('#profileApprovalId #userId').val();
			  	console.log('userId: '+userId);
			   if($('#profileApprovalId #remarksStatus').val()==1){
				   callCommonAction('','update-teacher-request','dashboard','approve',userId,remarks,'',roleModuleId);
			   }else if($('#profileApprovalId #remarksStatus').val()==2){
				   $('#profileApprovalModal').modal('hide');
				   openInactiveReasonModal(userId, remarks, roleModuleId);
				   return false;
			   }else if($('#profileApprovalId #remarksStatus').val()==4){
				   callCommonAction('','update-teacher-request','dashboard','hold',userId,remarks,'',roleModuleId);
				   $("#status_"+userId).text('On Hold')
			   }else if($('#profileApprovalId #remarksStatus').val()==5){
				   callCommonAction('','update-teacher-request','dashboard','verification',userId,remarks,'',roleModuleId);
				   $("#status_"+userId).text('Profile On verification');
				// setTimeout(function(){ callDashboardPageSchool(moduleId,'teacher-profile'); }, 1000);
				   statusUpdateHold[userId] = 'verified'
			   }else if($('#profileApprovalId #remarksStatus').val()==6){
				   callCommonAction('','update-teacher-request','dashboard','RedirectToBankDetails',userId,remarks,'',roleModuleId);
				//    $("#status_"+userId).text('Profile On verification');
				// setTimeout(function(){ callDashboardPageSchool(moduleId,'teacher-profile'); }, 1000);
				//    statusUpdateHold[userId] = 'verified'
			   }
			   $('#profileApprovalModal').modal('hide');
			   if($('#profileApprovalId #remarksStatus').val() != 4 && $('#profileApprovalId #remarksStatus').val() != 5){
			   		$('#profileId_'+userId).remove();
			   }
			   //setTimeout(function(){ callDashboardPageSchool(roleModuleId,'teacher-profile'); }, 1000);

	    }
	    function updateAgreementRemarks(roleModuleId){
 			if(roleModuleId=='' || roleModuleId==undefined){
 				roleModuleId=$('#profileApprovalId #userId').val();
 	 		}
			if($('#teacherAgreementApprovalId #remarksStatus').val()==undefined || $('#teacherAgreementApprovalId #remarksStatus').val()=='0'){
				showMessage(false, 'Remarks status is required.');
	    		return false;
			}

			if($('#teacherAgreementApprovalId #remarks').val()==''){
	    		showMessage(false, 'Remarks is required.');
	    		return false;
			}
			if (!validateCharacters($('#teacherAgreementApprovalId #remarksStatus').val())) {
	    		showMessage(false,
	    				'Please use the English Keyboard while providing information');
	    		return false
	    	}

			if (!validateCharacters($('#teacherAgreementApprovalId #remarks').val())) {
	    		showMessage(false,'Please use the English Keyboard while providing information');
	    		return false
	    	}

			var remarks=escapeCharacters($('#teacherAgreementApprovalId #remarks').val());
			var userId=$('#teacherAgreementApprovalId #userId').val();
			var meetingStatus= $('#teacherAgreementApprovalId #meetingStatus').val();
			if($('#teacherAgreementApprovalId #remarksStatus').val()==3){
				callCommonAction('','update-teacher-request','dashboard','RedirectToBankDetails',userId,remarks,roleModuleId,meetingStatus);
			}else if($('#teacherAgreementApprovalId #remarksStatus').val()==2){
				callCommonAction('','update-teacher-request','dashboard','decline',userId,remarks,roleModuleId,meetingStatus);
			}
			$('#teacherAgreementApprovalModal').modal('hide');
			setTimeout(function(){ callDashboardPageSchool('24','pending-interview-remarks'); }, 1000);

	    }

	    function sendMailInterViewModel(meetingId,userId,interviewLink,mailSendStatus,roleModuleId){
	    	if(interviewLink=='' || interviewLink==undefined){
	    		showMessage(true, 'Add Interview Link before Sending Mail');
	    		return false;
//	    	}
//	    	else if(mailSendStatus=='Y'){
//	    		showMessage(true, 'Mail Already Send');
//	    		return false;
	    	}else {
	    		$('#sendMailInterViewModel').modal('show');
	    		$('#sendMailInterViewForm #meetingId').val(meetingId);
	    		$('#sendMailInterViewForm #userId').val(userId);
	    	}
	    }

	    function interviewLinkModal(meetingId,userId,interviewLink,mailSendStatus){
	    	$('#interviewLinkModal').modal('show');
	    	$('#interviewLinkForm #meetingId').val(meetingId);
	    	$('#interviewLinkForm #userId').val(userId);
	    	$('#interviewLinkForm #interviewLink').val(interviewLink);
	    	$('#interviewLinkForm #mailSendStatus').val(mailSendStatus);
	    	/* if(mailSendStatus=='Y'){
	    		$('#meetingUrlForm #meetingUrl').attr('disabled', true);
	    		$('#meetingUrlForm #saveMeetingUrl').hide();
	    	} */
	    }

	    $(".interviewLink").click(function(){
	    	submitForTeacherInterviewSlots("interviewLinkForm","SCHOOL","ADDURL",moduleId);
		});
	    $(".sendInterViewMail").click(function(){
	    	submitForTeacherInterviewSlots("sendMailInterViewForm","SCHOOL","SENDMAIL",moduleId);
		});
		
function getPendingVerificationProfileListRequestApi(formId, moduleId) {
 hideMessageTheme2('');
 var data = {}
 data['firstReset'] = "21,22";
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','get-pending-verification-teacher-profile'),
	 data : JSON.stringify(data),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getPendingVerificationTeachedProfileListHtml(data.teacherDetails);
			$("#PendingVerificationProfileListBody").html(html);
			 var table = $('#PendingVerificationProfileListTable').DataTable({"pagingType":"full"}); 
			$('#PendingVerificationProfileListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}

function getPendingVerificationTeachedProfileListHtml(teacherDetails){
	var html='';
	if(teacherDetails.length>0){
		for (let iu = 0; iu < teacherDetails.length; iu++) {
			const teacherDetail = teacherDetails[iu];
			
			html+=`<tr id="profileId_${teacherDetail.userId}">	
            <td style="text-align:center;">${iu+1}</td>
			<td>${teacherDetail.countryName}</td>
           	<td>${teacherDetail.teacherName}</td>
           	<td>${teacherDetail.contactNumber}</td>
			<td>${teacherDetail.email}</td>
			<td id="status_${teacherDetail.userId}">`;
				if(teacherDetail.policeVerificationAcceptance == 'Y'){
					html+=`Submitted`;
				}else{
					html+=`Pending`
				}
			html+=`</td>
			<td class="text-center">`
				if(ROLE_MODULE.viewed == 'Y'){
					if(teacherDetail.policeVerificationAcceptance == 'Y'){
						html+=`<a href="javascript:void(0);" onclick="openVerficationModal(${teacherDetail.userId});" class="btn btn-primary btn-sm text-white">View</a>`;
					}else{
						html+=`N/A`;
					}
				}
			html+=`</td>
			<td class="text-center">${ROLE_MODULE.viewed == "Y"?`<a href="javascript:void(0);"  class="btn btn-primary btn-sm " onclick="getAsPost('/dashboard/profile-view-content?userId=${teacherDetail.userId}&moduleId=${ROLE_MODULE.moduleId}&actionType=1a')"  >Click here</a> `:""}</td>
			<td class="text-center">${ROLE_MODULE.updated == "Y"?`<a href="javascript:void(0);" class="btn btn-primary btn-sm " onclick="return callPendingReqModel('${teacherDetail.userId}', '${teacherDetail.firstReset}', '${teacherDetail.policeVerificationAcceptance == undefined ? "N" : teacherDetail.policeVerificationAcceptance}');">Update Status</a>`:""}</td>
			</tr>`;
		}
	}
	return html;
}

async function openVerficationModal(userId) {
    var payload = { userId: userId };
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-verification-details', payload, '/teacher/signup');
	if($("#verificationModal").length == 1){
		$("#verificationModal").remove();
	}
	$("body").append(`
		<div class="modal fade" id="verificationModal" tabindex="-1" role="dialog" aria-labelledby="verificationModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-xl" role="document">
				<div class="modal-content">
					<div class="modal-header bg-primary text-white">
						<h5 class="modal-title" id="verificationModalLabel">Teacher Verification Details</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body" id="verificationModalBody" style="max-height: 600px; overflow: auto;">
						<!-- Content will be injected here -->
					</div>
				</div>
			</div>
		</div>
	`);
    $("#verificationModalBody").html(getVerificationModalContent(responseData.details, userId));
    $("#verificationModal").modal("show");
	if($("#teacherVerificationAttchamentModal").length<1){
		$("body").append(`<div class="modal fade fade-scale" id="teacherVerificationAttchamentModal" tabindex="-1">
			<div class="modal-dialog modal-md  box-shadow-none" role="document">
				<div class="modal-content">
					<div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">
						<h6 class="heading text-white">Preview File</h6>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body m-0 py-2" style="margin-top:0 !important">
						
					</div>
				</div>
			</div>
		</div>`);
	}
}



function getPendingBankDetailsProfileListRequestApi(formId, moduleId) {
 hideMessageTheme2('');
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','get-pending-bank-details-teacher-profile'),
	 data : JSON.stringify(getReceivedTeachedProfileRequest(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getPendingBankDetailsTeacherProfileListHtml(data.teacherDetails);
			$("#BankDetailsProfileListBody").html(html);
			 var table = $('#BankDetailsProfileListTable').DataTable({"pagingType":"full"}); 
			$('#BankDetailsProfileListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}


function getPendingBankDetailsTeacherProfileListHtml(teacherDetails){
	var html='';
	if(teacherDetails.length>0){
		for (let iu = 0; iu < teacherDetails.length; iu++) {
			const teacherDetail = teacherDetails[iu];
			
			html+=`<tr id="profileId_${teacherDetail.userId}">	
            <td style="text-align:center;">${iu+1}</td>
			<td>${teacherDetail.countryName}</td>
           	<td>${teacherDetail.teacherName}</td>
           	<td>${teacherDetail.contactNumber}</td>
			<td>${teacherDetail.email}</td>
			<td class="text-center">${ROLE_MODULE.viewed == "Y"?`<a href="javascript:void(0);"  class="btn btn-primary btn-sm " onclick="getAsPost('/dashboard/profile-view-content?userId=${teacherDetail.userId}&moduleId=${ROLE_MODULE.moduleId}&actionType=1a')"  >Click here</a> `:""}</td>
			<td class="text-center">${ROLE_MODULE.updated == "Y"?`<a href="javascript:void(0);" class="btn btn-primary btn-sm " onclick="return callPendingReqModel('${teacherDetail.userId}', '${teacherDetail.firstReset}', '${teacherDetail.isTeacherPoliceVerifide}');">Update Status</a>`:""}</td>
			</tr>`;
		}
	}
	return html;
}

async function enableReattemptRecording(userId){
	var payload = {};
	payload['userId'] = userId;
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'teacher-demo-recording-reattempt', payload, '/teacher/signup');
	if(responseData.statusCode == "SUCCESS"){
		showMessageTheme2(1, responseData.message);
		$("#recordingModal").modal("hide");
		$('#profileId_'+userId).remove();
	}
}

function teacherVerificationAttchament(src){
	console.log(src)
	var fileExtension = $(src).attr("data-src").split('.').pop();
	if(fileExtension == "pdf"){
		
	}else{
		$("#teacherVerificationAttchamentModal .modal-body").html(
			`<div class="full">
				<img src="${$(src).attr("data-src")}" class="w-100"/>
			</div>`
		)
	}
	$("#teacherVerificationAttchamentModal").modal("show");
}

async function addTeacherContract(userId, name, email, contractId) {
    name = unescapeCharacters(name);
    $("#addTeacherContractModal").remove();
    var payload = { userId: userId };
    const responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-signup-agreement-details', payload, '/teacher/signup');
    
    $("body").append(addTeacherContractModal(responseData.details.teacherAgreementDetails, userId, name, email, contractId));
    
    if (contractId != 0) {
        $("#previewTeacherContractBtn").show();
        if (responseData.details.teacherAgreementDetails.publishDateTime) {
            $("#publishTeacherContractBtn").hide();
        } else {
            $("#publishTeacherContractBtn").show();
        }
    }
    
    // Jodit is initialized while the modal is still hidden/animating, so it
    // measures the wrong height. Recompute its layout once the modal is fully
    // visible (fixes the collapsed/overlapping editor render).
    $("#addTeacherContractModal").off("shown.bs.modal.jodit").on("shown.bs.modal.jodit", function () {
        setTimeout(function () {
            if (typeof editor !== "undefined" && editor) {
                try { editor.e.fire("resize"); } catch (e) { }
            }
            try { window.dispatchEvent(new Event("resize")); } catch (e) { }
        }, 50);
    });

    setTimeout(() => {
        $("#addTeacherContractModal").modal("show");
    }, 300);
    
    $('#teacherContractForm #specialization').select2({
        theme: "bootstrap4",
        dropdownParent: "#addTeacherContractModal .modal-body"
    });
    
	getAllNationalityList("teacherContractForm", "teacherNationality");
    getEmployeeSpecializationDropDown("teacherContractForm", "specialization");
    renderWorkingDaysCheckboxes();
    initializeCountryStateCity("teacherContractForm", "teacherContractCountry", "teacherContractState", "teacherContractCity");
    var data = responseData.details.teacherAgreementDetails;

	$(".working-day-checkbox").each(function () {
        var val = parseInt($(this).val());
        if (data?.workingDays.includes(val)) {
            $(this).prop("checked", true);
        }
    });

	if (data.countryId) {
		setTimeout(() => {
			$("#teacherContractForm #teacherNationality").val(data.countryId).trigger("change");
			$("#teacherContractForm #teacherContractCountry").val(data.countryId).trigger("change");
		}, 300);
	}

	if (data.stateId) {
		setTimeout(() => {
			$("#teacherContractForm #teacherContractState").val(data.stateId).trigger("change");
		}, 600);
	}

	if (data.cityId) {
		setTimeout(() => {
			$("#teacherContractForm #teacherContractCity").val(data.cityId).trigger("change");
		}, 900);
	}

    if (data.specialization) {
        setTimeout(() => {
            $('#teacherContractForm #specialization').val(data.specialization.split(',')).trigger('change');
        }, 500);
    }
    
    editor = new Jodit('#teacherContractCommentData', {
        width: 794,
        height: 400,
        toolbarSticky: true,
        readonly: true,
        uploader: { insertImageAsBase64URI: true },
        toolbarAdaptive: false,
        events: {
            change: function () {
                toggleContractEditor("teacherContractForm");
            }
        }
    });

    // The editor is display-only: content is set programmatically from the
    // selected template + live variable updates, never typed by hand.
    editor.setReadOnly(true);

    if (data.content && data.content.trim() !== "") {
        editor.value = cleanBase64Images(data.content);
		$("#teacherContractForm label[for='recipientSignatureUpload']").text($("#leftSignatureBox img").data("name"));
    } else {
        editor.value = '<p class="text-muted">Select a template above to load the contract.</p>';
    }

	$("#teacherContractForm #teacherNationality").select2({
		theme:"bootstrap4"
	})

    $("#teacherContractForm #contractDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#teacherContractForm #contractStartDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#teacherContractForm #contractEndDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#teacherContractForm #contractValidityStartDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#teacherContractForm #contractValidityEndDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });

    if (data.validityStart && data.validityEnd) {
        var start = new Date(data.validityStart);
        var end = new Date(data.validityEnd);
        var duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (duration > 0) {
            $('#teacherContractForm #contractValidityDuration').val(duration).trigger('change');
        }
    }
    
    if (data.contractDurationYears > 0) {
        setTimeout(() => {
            calculateEndDate('teacherContractForm', 'contractStartDate', 'contractDuration', 'contractEndDate', 'YEAR');
        }, 100);
    }
    
    $("#teacherContractForm").on(
        "keyup change",
        "#referenceNumber, #firstPartyName, #firstPartyDesignation, #teacherName, #teacherEmail, #teacherType, #teacherDesignation, #employmentType, #workingHours, #adminHours, #monthlySalary, #contractStartDate, #contractDuration, #teacherContractCountry, #teacherContractState, #teacherContractCity",
        function () {
            computeLiveClassesHours("teacherContractForm");
            toggleContractEditor("teacherContractForm");
            updateContractVariables("teacherContractForm");
        }
    );

    // Currency is driven by nationality; keep salary token in sync when it changes.
    $("#teacherContractForm").on("change", "#teacherNationality, #teacherCurrency, #contractEndDate", function () {
        updateContractVariables("teacherContractForm");
    });

    computeLiveClassesHours("teacherContractForm");
    loadMasterAgreementTemplates("TEACHER");
}

/* Live Classes Hours = Agreed Working Hours - Admin Task Hours (read-only field). */
function computeLiveClassesHours(formId) {
    var $form = $("#" + formId);
    var wv = ($form.find("#workingHours").val() || "").trim();
    if (wv === "") {
        $form.find("#liveClassesHours").val("");
        return;
    }
    var live = (parseInt(wv, 10) || 0) - (parseInt($form.find("#adminHours").val(), 10) || 0);
    if (live < 0) live = 0;
    $form.find("#liveClassesHours").val(live);
}

/* Holds fetched master-agreement templates keyed by their id, so the editor
   can be re-filled without another network call. */
var masterAgreementTemplateMap = {};

async function loadMasterAgreementTemplates(roleType) {
    masterAgreementTemplateMap = {};
    var $select = $("#teacherContractForm #contractTemplateSelect");
    $select.find("option:not(:first)").remove();
    try {
        var ajaxReqDetails = {
            method: "POST",
            url: getURLFor("dashboard", "get-master-agreement-content"),
            body: { roleType: roleType, schoolId: SCHOOL_ID },
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };
        var responseData = await callCommonAjax(ajaxReqDetails);
        if (responseData.status != 1 || !responseData.details) {
            return;
        }
        // Backend may return a single object or an array of templates.
        var templates = Array.isArray(responseData.details) ? responseData.details : [responseData.details];
        templates.forEach(function (tpl) {
            if (!tpl || tpl.id == null) return;
            masterAgreementTemplateMap[tpl.id] = tpl.content || "";
            $select.append('<option value="' + tpl.id + '">' + (tpl.templateName || ("Template " + tpl.id)) + '</option>');
        });
    } catch (e) {
        console.log("loadMasterAgreementTemplates error", e);
    }
}

/* On template selection, paste its content into the Jodit editor with all
   #variable_name# (and {{variable_name}}) tokens replaced by the current
   form values. */
function applyContractTemplate(formId) {
    if (typeof editor === "undefined") return;
    var templateId = $("#" + formId + " #contractTemplateSelect").val();
    if (!templateId) return;
    var content = masterAgreementTemplateMap[templateId];
    if (content == null) return;
    var filled = replaceContractVariables(content, buildContractVariableMap(formId));
    editor.setReadOnly(false);
    editor.value = filled;
    editor.setReadOnly(true);
    // Ensure the id/data-var spans reflect the latest field values.
    updateContractVariables(formId);
    $("#uploadTeacherSignatureBtn").prop("disabled", false);
}

/* Live-updates the contract body: every <span class="contract-var" data-var="..">
   inside the editor is re-filled from the current form values. Handles repeated
   tokens (e.g. total_working_hours appears twice) since it selects by data-var. */
function updateContractVariables(formId) {
    if (typeof editor === "undefined" || !editor.editor) return;
    var nodes = editor.editor.querySelectorAll(".contract-var");
    if (!nodes.length) return;
    var map = buildContractVariableMap(formId);
    nodes.forEach(function (node) {
        var key = node.getAttribute("data-var");
        if (key && Object.prototype.hasOwnProperty.call(map, key)) {
            node.textContent = map[key];
        }
    });
}

/* Builds the token => value map from the contract form fields. */
function buildContractVariableMap(formId) {
    var $form = $("#" + formId);
    var workingHours = parseInt($form.find("#workingHours").val(), 10) || 0;
    var adminHours = parseInt($form.find("#adminHours").val(), 10) || 0;
    // Agreed working hours is the total monthly commitment; live-class hours are derived.
    var liveClassesHours = Math.max(0, workingHours - adminHours);
    var currency = $form.find("#teacherCurrency").val() || "";
    var salary = $form.find("#monthlySalary").val() || "";

    var durationText = $form.find("#contractDuration option:selected").val() === "0"
        ? "" : $form.find("#contractDuration option:selected").text().trim();

    var workingDays = [];
    $(".working-day-checkbox:checked").each(function () {
        workingDays.push($(this).data("short"));
    });

    var specText = [];
    $form.find("#specialization option:selected").each(function () {
        var t = $(this).text().trim();
        if (t && t.toLowerCase() !== "select") specText.push(t);
    });

    return {
        "agreement_ref_number": $form.find("#referenceNumber").val() || "",
        "agreement_date": $form.find("#contractDate").val() || "",
        "role_type": $form.find("#roleType").val() || "",
        "first_party_name": $form.find("#firstPartyName").val() || "",
        "first_party_designation": $form.find("#firstPartyDesignation").val() || "",
        "teacher_name": $form.find("#teacherName").val() || "",
        "teacher_email": $form.find("#teacherEmail").val() || "",
        "designation": $form.find("#teacherDesignation").val() || "",
        "employee_type": $form.find("#employmentType").val() || "",
        "working_hours": workingHours ? String(workingHours) : "",
        "admin_task_hours": adminHours ? String(adminHours) : "",
        "live_classes_hours": workingHours ? String(liveClassesHours) : "",
        "total_working_hours": (workingHours + adminHours) ? String(workingHours + adminHours) : "",
        "currency": currency,
        "salary_with_currency": (salary ? (salary + (currency ? " " + currency : "")) : ""),
        "contract_duration": durationText,
        "duration_start": $form.find("#contractStartDate").val() || "",
        "duration_end": $form.find("#contractEndDate").val() || "",
        "validity_start": $form.find("#contractValidityStartDate").val() || "",
        "validity_end": $form.find("#contractValidityEndDate").val() || "",
        "validity_days": ($form.find("#contractValidityDuration").val() && $form.find("#contractValidityDuration").val() !== "0") ? $form.find("#contractValidityDuration").val() : "",
        "working_days": workingDays.join(", "),
        "specialization": specText.join(", "),
        "nationality": $form.find("#teacherNationality option:selected").text().trim(),
        "country": $form.find("#teacherContractCountry option:selected").text().trim(),
        "state": $form.find("#teacherContractState option:selected").text().trim(),
        "city": $form.find("#teacherContractCity option:selected").text().trim()
    };
}

/* Replaces every #token# and {{token}} in the html with its mapped value.
   A single pass over each key handles repeated occurrences of the same token. */
function replaceContractVariables(html, map) {
    if (!html) return html;
    Object.keys(map).forEach(function (key) {
        var value = map[key] == null ? "" : String(map[key]);
        var hashToken = new RegExp("#" + key + "#", "g");
        var curlyToken = new RegExp("\\{\\{\\s*" + key + "\\s*\\}\\}", "g");
        html = html.replace(hashToken, value).replace(curlyToken, value);
    });
    return html;
}

function validateTeacherContractForm(formId) {

    if ($("#" + formId + " #referenceNumber").val().trim() === "") {
        showMessageTheme2(0, "Please enter reference number");
        return false;
    }

    if ($("#" + formId + " #contractDate").val().trim() === "") {
        showMessageTheme2(0, "Please select contract creation date");
        return false;
    }

    if ($("#" + formId + " #firstPartyName").val().trim() === "") {
        showMessageTheme2(0, "Please enter first party name");
        return false;
    }

    if ($("#" + formId + " #firstPartyDesignation").val().trim() === "") {
        showMessageTheme2(0, "Please enter first party designation");
        return false;
    }

    if ($("#" + formId + " #teacherName").val().trim() === "") {
        showMessageTheme2(0, "Please enter teacher's name");
        return false;
    }

    if ($("#" + formId + " #teacherEmail").val().trim() === "") {
        showMessageTheme2(0, "Please enter teacher's email");
        return false;
    }

    if ($("#" + formId + " #teacherType").val() === "") {
        showMessageTheme2(0, "Please select type of teacher");
        return false;
    }

    if ($("#" + formId + " #teacherDesignation").val().trim() === "") {
        showMessageTheme2(0, "Please enter teacher designation");
        return false;
    }

    var employmentType = $("#" + formId + " #employmentType").val();
    if (employmentType === "") {
        showMessageTheme2(0, "Please select employment type");
        return false;
    }

    if (employmentType === "Full-Time") {
        if ($("#" + formId + " #workingHours").val().trim() === "") {
            showMessageTheme2(0, "Please enter agreed working hours per month");
            return false;
        }

        if ($("#" + formId + " #adminHours").val().trim() === "") {
            showMessageTheme2(0, "Please enter admin task hours per month");
            return false;
        }
    }

	if ($("#" + formId + " #monthlySalary").val().trim() === "") {
		showMessageTheme2(0, "Please enter monthly salary");
		return false;
	}

	var selectedWorkingDays = getSelectedWorkingDayIds();
	if (selectedWorkingDays.length === 0) {
		showMessageTheme2(0, "Please select at least one working day");
		return false;
	}

    if (typeof editor === "undefined" || editor.value.trim() === "" || editor.value.trim() == "<p><br></p>") {
        showMessageTheme2(0, "Please add contract comment");
        return false;
    }

	// if ($("#" + formId + " label[for='recipientSignatureUpload']").text() == "Choose file...") {
	// 	showMessageTheme2(0, "Please upload your signature");
	// 	return false;
	// }
	
	if ($("#" + formId + " #teacherSignatureBox").length == 0) {
		showMessageTheme2(0, "Please upload your signature");
		return false;
	}

    if ($("#" + formId + " #contractStartDate").val().trim() === "") {
        showMessageTheme2(0, "Please select contract start date");
        return false;
    }

    if ($("#" + formId + " #contractEndDate").val().trim() === "") {
        showMessageTheme2(0, "Please select contract duration");
        return false;
    }

    if ($("#" + formId + " #contractValidityStartDate").val().trim() === "") {
        showMessageTheme2(0, "Please select validity start date");
        return false;
    }

    if ($("#" + formId + " #contractValidityEndDate").val().trim() === "") {
        showMessageTheme2(0, "Please select validity duration");
        return false;
    }

    return true;
}

function getRequestForTeacherContract(formId, userId) {
    var request = {};
    var authentication = {};
    var teacherAgreementDTO = {};

    if (typeof editor !== "undefined") {
        // teacherAgreementDTO["content"] = escapeCharacters(editor.value.trim());
        teacherAgreementDTO["content"] = editor.getEditorValue();
    }
    teacherAgreementDTO["agreementRefNumber"] = escapeCharacters($("#" + formId + " #referenceNumber").val());
    teacherAgreementDTO["agreementDate"] = changeDateFormat(new Date($("#" + formId + " #contractDate").val()), "yyyy-mm-dd");
    teacherAgreementDTO["roleType"] = $("#" + formId + " #roleType").val();
    teacherAgreementDTO["firstPartyName"] = escapeCharacters($("#" + formId + " #firstPartyName").val());
    teacherAgreementDTO["firstPartyDesignation"] = escapeCharacters($("#" + formId + " #firstPartyDesignation").val());
    teacherAgreementDTO["teacherName"] = escapeCharacters($("#" + formId + " #teacherName").val());
    teacherAgreementDTO["teacherEmail"] = escapeCharacters($("#" + formId + " #teacherEmail").val());
    // teacherAgreementDTO["typeOfTeacher"] = $("#" + formId + " #teacherType").val();
    teacherAgreementDTO["teacherDesignation"] = toTitleCase($("#" + formId + " #teacherDesignation").val());
    // teacherAgreementDTO["teacherDepartment"] = toTitleCase($("#" + formId + " #teacherDepartment").val());
    teacherAgreementDTO["employeeType"] = $("#" + formId + " #employmentType").val();
    teacherAgreementDTO["workingHours"] = $("#" + formId + " #workingHours").val();
    teacherAgreementDTO["adminTaskHours"] = $("#" + formId + " #adminHours").val();
    teacherAgreementDTO["currency"] = $("#" + formId + " #teacherCurrency").val();
    teacherAgreementDTO["payOut"] = $("#" + formId + " #monthlySalary").val();
	teacherAgreementDTO["workingDays"] = getSelectedWorkingDayIds();
    teacherAgreementDTO["nationality"] = $("#" + formId + " #teacherNationality").val();
    teacherAgreementDTO["countryId"] = $("#" + formId + " #teacherContractCountry").val();
    teacherAgreementDTO["stateId"] = $("#" + formId + " #teacherContractState").val();
    teacherAgreementDTO["cityId"] = $("#" + formId + " #teacherContractCity").val();
    teacherAgreementDTO["durationStart"] = changeDateFormat(new Date($("#" + formId + " #contractStartDate").val()), "yyyy-mm-dd");
    teacherAgreementDTO["durationEnd"] = changeDateFormat(new Date($("#" + formId + " #contractEndDate").val()), "yyyy-mm-dd");
    teacherAgreementDTO["contractDurationYears"] = $("#" + formId + " #contractDuration").val();
    teacherAgreementDTO["validityStart"] = changeDateFormat(new Date($("#" + formId + " #contractValidityStartDate").val()), "yyyy-mm-dd");
    teacherAgreementDTO["validityEnd"] = changeDateFormat(new Date($("#" + formId + " #contractValidityEndDate").val()), "yyyy-mm-dd");
    teacherAgreementDTO["validityDurationDays"] = $("#" + formId + " #contractValidityDuration").val();
    teacherAgreementDTO["employeeSpecialization"] = $("#" + formId + " #specialization").val();
    teacherAgreementDTO["agreementSaveType"] = "D";
    authentication["hash"] = getHash();
    authentication["schoolId"] = SCHOOL_ID;
    authentication["schoolUUID"] = SCHOOL_UUID;
    authentication["userType"] = ROLE_MODULE.moduleId;
    authentication["userId"] = userId;

    request["authentication"] = authentication;
    request["teacherAgreementDTO"] = teacherAgreementDTO;

    return request;
}


async function saveTeacherContract(formId, userId){
	if (!validateTeacherContractForm(formId)) {
        return;
    }
	var ajaxReqDetails = {
        method: "POST",
        url: getURLFor("dashboard", "submit-teacher-agreement-content"),
        body: getRequestForTeacherContract(formId, userId),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
		showMessageTheme2(1, responseData.message);
		$("#publishTeacherContractBtn").show();
		$("#previewTeacherContractBtn").show();
		$("#" + formId + " #contractId").val(responseData.responseData.contractId);
		$(".edit-agreement-btn-" + userId).attr("data-contract-id", responseData.responseData.contractId);
		$("#addContractSpan" + userId).text("Add/Edit Contract")
	}else{
		showMessageTheme2(0, responseData.message);
	}
}

function canEnableContractEditor(formId) {
    if ($("#" + formId + " #referenceNumber").val().trim() === "") return false;
    if ($("#" + formId + " #contractDate").val().trim() === "") return false;
    if ($("#" + formId + " #firstPartyName").val().trim() === "") return false;
    if ($("#" + formId + " #firstPartyDesignation").val().trim() === "") return false;
    if ($("#" + formId + " #teacherName").val().trim() === "") return false;
    if ($("#" + formId + " #teacherEmail").val().trim() === "") return false;
    if ($("#" + formId + " #teacherType").val() === "") return false;
    if ($("#" + formId + " #teacherDesignation").val().trim() === "") return false;
    if ($("#" + formId + " #employmentType").val() === "") return false;
    var employmentType = $("#" + formId + " #employmentType").val();
    if (employmentType === "Full-Time") {
        if ($("#" + formId + " #workingHours").val().trim() === "") return false;
        if ($("#" + formId + " #adminHours").val().trim() === "") return false;
    }
    if ($("#" + formId + " #monthlySalary").val().trim() === "") return false;
	if ($("#" + formId + " #teacherContractCountry").val() === "") return false;
    if ($("#" + formId + " #teacherContractState").val() === "") return false;
    if ($("#" + formId + " #teacherContractCity").val() === "") return false;
    if ($("#" + formId + " #contractStartDate").val().trim() === "") return false;
    if ($("#" + formId + " #contractDuration").val() === "0") return false;

    return true;
}

function toggleContractEditor(formId) {
    if (typeof editor === "undefined") return;
    // Editor is always read-only (display-only). Only gate the signature button:
    // it becomes available once the contract body has content (template loaded).
    editor.setReadOnly(true);
    $("#uploadTeacherSignatureBtn").prop("disabled", isEditorEmpty());
}

function isEditorEmpty() {
    if (typeof editor === "undefined") return true;
    var val = editor.value.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, "").trim();
    if (val === "Select a template above to load the contract.") {
        return true;
    }
    return val === "";
}

function signatureTableTeacher(formId) {
	if (typeof editor === "undefined") return;
	var editorContent = $(".jodit-workplace");
	if (editorContent.find("#leftSignatureBox").length || editorContent.find("#rightSignatureBox").length) {
		return;
	}
	var firstPartyName = $("#" + formId + " #firstPartyName").val() || "";
	var firstPartyDesignation = $("#" + formId + " #firstPartyDesignation").val() || "";

	var secondPartyName = $("#" + formId + " #teacherName").val() || "";
	var secondPartyDesignation = $("#" + formId + " #teacherDesignation").val() || "";

	var todayDate = changeDateFormat(new Date(), "MMM-dd-yyyy");

	var html =
	`<table id="teacherSignatureBox" style="border-collapse:collapse; width:100%; text-align:center;">
		<tbody>
			<tr>
				<td style="width:50%; padding:10px; vertical-align:top;">
					For <b>${firstPartyName}</b>
					<div id="leftSignatureBox" style="margin-top:40px; min-height:80px;"></div>
					<p style="margin:0;"><i>(Signature)</i></p>
				</td>
				<td style="width:50%; padding:10px; vertical-align:top;">
					For <b>${secondPartyName}</b>
					<div id="rightSignatureBox" style="margin-top:40px; min-height:80px;"></div>
					<p style="margin:0;"><i>(Signature)</i></p>
				</td>
			</tr>

			<tr>
				<td style="padding:10px; text-align:left; font-size:14px; text-align: center;">
					Authorized Signatory - 
					<span class="txt-capitalize-case">${firstPartyName}</span><br/>
					Designation – 
					<span class="txt-capitalize-case">${firstPartyDesignation}</span><br/>
					Date: ${todayDate}
				</td>

				<td style="padding:10px; text-align:left; font-size:14px; text-align: center;">
					Authorized Signatory - 
					<span class="txt-capitalize-case">${secondPartyName}</span><br/>
					Designation – 
					<span class="txt-capitalize-case">${secondPartyDesignation}</span><br/>
					Date: <span id="rightDate">____</span>
				</td>
			</tr>
		</tbody>
	</table><br/>`;
	// Editor is read-only; briefly allow the programmatic signature insert.
	editor.setReadOnly(false);
	editor.s.setCursorIn(editor.editor, false);
	editor.s.insertHTML(html);
	editor.setReadOnly(true);
}

function getRequestForTeacherPublishContract(formId, userId){
	var request = {};
    var authentication = {};
    var teacherAgreementDTO = {};
	teacherAgreementDTO["agreementSaveType"] = "P";
	teacherAgreementDTO["contractId"] = $("#" + formId + " #contractId").val();
	authentication["hash"] = getHash();
    authentication["schoolId"] = SCHOOL_ID;
    authentication["schoolUUID"] = SCHOOL_UUID;
    authentication["userType"] = ROLE_MODULE.moduleId;
    authentication["userId"] = userId;

    request["authentication"] = authentication;
    request["teacherAgreementDTO"] = teacherAgreementDTO;
    return request;
}

async function publishTeacherContract(formId, userId){
	var ajaxReqDetails = {
        method: "POST",
        url: getURLFor("dashboard", "submit-teacher-agreement-content"),
        body: getRequestForTeacherPublishContract(formId, userId),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
		$("#addTeacherContractModal").modal("hide");
		$(".profileId_"+userId).remove();
		showMessageTheme2(1, responseData.message);
	}else{
		showMessageTheme2(0, responseData.message);
	}
}

function insertTeacherSignature(formId) {
    signatureTableTeacher(formId);
    const signatureUrl = PATH_FOLDER_IMAGE2 +"letter/"+ schoolSettingsTechnical.teachAgreementSign;
    if (!signatureUrl) return;

    convertImageToBase64(signatureUrl, function (base64) {
        const imgHtml = `
            <img
                src="${base64}"
                alt="Authorized Signature"
                style="max-width:120px; display:block; margin:auto;"
                data-type="FIRST_PARTY_SIGNATURE"
            />
        `;

        $("#leftSignatureBox").html(imgHtml);
    });
}

function preSelectCurrency(src){
	if($(src).val() == "101"){
		$("#teacherContractForm #teacherCurrency").val("INR");
	}else{
		$("#teacherContractForm #teacherCurrency").val("USD");
	}
}

function renderWorkingDaysCheckboxes() {
	var days = getWeekDays();
	var html = "";

  	$.each(days, function (index, day) {
		html += 
		`<div class="form-check form-check-inline">
			<input 
				class="form-check-input working-day-checkbox"
				type="checkbox"
				id="day_${day.dayId}"
				value="${day.dayId}"
				data-short="${day.shortName}"
			/>
			<label class="form-check-label" for="day_${day.dayId}">
				${day.shortName}
			</label>
		</div>`
  	});

  	$("#workingDaysContainer").html(html);
}

function getSelectedWorkingDayIds() {
    var dayIds = [];
    $(".working-day-checkbox:checked").each(function () {
        dayIds.push(parseInt($(this).val()));
    });
    return dayIds;
}

/* ---- Inactive Reason Modal (decline flow) ---- */
function openInactiveReasonModal(userId, remarks, roleModuleId) {
    if ($('#inactiveReasonModal').length === 0) {
        $('body').append(buildInactiveReasonModalHtml());
        $('#inactiveReasonModal #inactiveReasonSelect').on('change', function () {
            var selectedText = $(this).find('option:selected').text().trim();
            if (selectedText === 'Other') {
                $('#inactiveReasonModal #otherReasonGroup').show();
            } else {
                $('#inactiveReasonModal #otherReasonGroup').hide();
                $('#inactiveReasonModal #otherReasonText').val('');
            }
        });
        $('#inactiveReasonModal #confirmDeclineBtn').on('click', function () {
            var reasonId = $('#inactiveReasonModal #inactiveReasonSelect').val();
            if (!reasonId || reasonId === '0') {
                showMessageTheme2(0, 'Please select a reason for declining.');
                return false;
            }
            var selectedText = $('#inactiveReasonModal #inactiveReasonSelect option:selected').text().trim();
            var otherReason = '';
            if (selectedText === 'Other') {
                otherReason = $.trim($('#inactiveReasonModal #otherReasonText').val());
                if (!otherReason) {
                    showMessageTheme2(0, 'Please enter a reason in the Other Reason field.');
                    return false;
                }
            }
            $('#inactiveReasonModal').modal('hide');
            callDeclineWithReason(userId, remarks, reasonId, otherReason, roleModuleId);
        });
    }
    $('#inactiveReasonModal #inactiveReasonSelect').val('0');
    $('#inactiveReasonModal #otherReasonGroup').hide();
    $('#inactiveReasonModal #otherReasonText').val('');
    loadInactiveReasons(roleModuleId, function () {
        $('#inactiveReasonModal').modal('show');
    });
}

function loadInactiveReasons(roleModuleId, callback) {
    $.ajax({
        type: 'GET',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('dashboard', 'inactive-reasons'),
        dataType: 'json',
        cache: false,
        timeout: 30000,
        success: function (data) {
            var select = $('#inactiveReasonModal #inactiveReasonSelect');
            select.find('option:not(:first)').remove();
            if (data && data.reasonsList) {
                $.each(data.reasonsList, function (i, r) {
                    select.append('<option value="' + r.id + '">' + r.reason + '</option>');
                });
            }
            if (callback) callback();
        },
        error: function () {
            showMessageTheme2(0, 'Failed to load decline reasons. Please try again.');
        }
    });
}

function callDeclineWithReason(userId, remarks, inactiveReasonId, otherReason, roleModuleId) {
    var request = {};
    var authentication = {};
    var requestData = {};
    authentication['hash'] = getHash();
    authentication['schoolId'] = SCHOOL_ID;
    authentication['schoolUUID'] = SCHOOL_UUID;
    authentication['userType'] = 'dashboard';
    authentication['userId'] = userId;
    request['authentication'] = authentication;
    requestData['requestKey'] = 'decline';
    requestData['requestValue'] = 'decline';
    requestData['requestExtra'] = remarks;
    requestData['requestExtra1'] = inactiveReasonId;
    requestData['requestExtra2'] = otherReason;
    request['requestData'] = requestData;
    $.ajax({
        type: 'POST',
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('dashboard', 'update-teacher-request'),
        data: JSON.stringify(request),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(0, data['message']);
            } else {
                showMessageTheme2(1, data['message']);
                $('#approvedRequest' + userId).text('Declined');
                $('#profileId_' + userId).remove();
            }
        }
    });
}

function buildInactiveReasonModalHtml() {
    return `<div id="inactiveReasonModal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content modal-md">
                <div class="modal-header primary-bg white-txt-color">
                    <button type="button" class="close white-txt-color" data-dismiss="modal" style="color:#fff;opacity:1">&times;</button>
                    <h5 class="modal-title" style="color:white;text-align:center;"><strong>Select Decline Reason</strong></h5>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label>Reason <span class="text-danger">*</span></label>
                        <select id="inactiveReasonSelect" class="form-control">
                            <option value="0">-- Select Reason --</option>
                        </select>
                    </div>
                    <div id="otherReasonGroup" class="form-group" style="display:none;">
                        <label>Other Reason <span class="text-danger">*</span></label>
                        <textarea id="otherReasonText" class="form-control" rows="3" maxlength="500" placeholder="Enter reason..."></textarea>
                    </div>
                </div>
                <div class="modal-footer" style="text-align:center;">
                    <button type="button" class="btn btn-danger" id="confirmDeclineBtn">Confirm Decline</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                </div>
            </div>
        </div>
    </div>`;
}
