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
			
			html+=`<tr id="profileId_${receivedTeachedProfile.userId}">	
            <td style="text-align:center;">${iu+1}</td>
			<td>${receivedTeachedProfile.countryName}</td>
           	<td>${receivedTeachedProfile.name}</td>
           	<td>${receivedTeachedProfile.mobileNumber}</td>
			<td>${receivedTeachedProfile.userName}</td>
			<td id="status_${receivedTeachedProfile.userId}">`;
				if(receivedTeachedProfile.teacherFirstReset == 13){
					html+=`Profile under review`;
				}else if(receivedTeachedProfile.teacherFirstReset == 24){
					html+=`Profile on hold`;
				}else{
					html+=`NA`;
				}
			html+=`</td>
			<td class="text-center">`
				if(ROLE_MODULE.viewed == 'Y'){
					if(receivedTeachedProfile.generalMeetingId != 0){
						html+=`<a onclick="openDemoRecordingModal('${receivedTeachedProfile.generalMeetingId}', '${receivedTeachedProfile.userId}')" class="btn btn-primary btn-sm " href="javascript:void(0);">View Recording</a>`;
					}else if(receivedTeachedProfile.demoVedioLink == ""){
						html+=`N/A`
					}else{
						html+=`<a onclick="checkLinkValid(event, this)" href="${receivedTeachedProfile.demoVedioLink}" class="btn btn-primary btn-sm " target="_blank">View</a>`;
					}
				}
			html+=`</td>
			<td class="text-center">${ROLE_MODULE.viewed == "Y"?`<a href="javascript:void(0);"  class="btn btn-primary btn-sm " onclick="getAsPost('/dashboard/profile-view-content?userId=${receivedTeachedProfile.userId}&moduleId=${receivedTeachedProfile.mangeUserListModId}&actionType=1a')"  >Click here</a> `:""}</td>
			<td class="text-center">${ROLE_MODULE.updated == "Y"?`<a href="javascript:void(0);" class="btn btn-primary btn-sm " onclick="return callPendingReqModel('${receivedTeachedProfile.userId}', '${receivedTeachedProfile.teacherFirstReset}', '${receivedTeachedProfile.isTeacherPoliceVerifide}');">Update Status</a>`:""}</td>
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
			<td><a onclick="return callSchoolInneraction('teacher-agreement','?userId=${pendingContract.userId}&controlType=edit&moduleId=${moduleId}','section-linebox');" href="javascript:void(0);" class="waves-effect">Click here</a></td>
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
							<!-- <option value="1">Approve</option> -->
							<option value="3">Redirect to Contract Details</option>
							<option value="4">Profile On Hold</option>
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
			getEmployeeSpecializationDropDown('profileApprovalId','employeeSpecialization');
			
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
				   callCommonAction('','update-teacher-request','dashboard','decline',userId,remarks,'',roleModuleId);
			   }else if($('#profileApprovalId #remarksStatus').val()==4){
				   callCommonAction('','update-teacher-request','dashboard','hold',userId,remarks,'',roleModuleId);
				   $("#status_"+userId).text('Profile On Hold')
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

		function openDemoRecordingModal(meetingId, userId){
			const payload = {
				entityId: meetingId,
				entityName: "GENERAL_MEETINGS"
			};
			$.ajax({
				type : "POST",
				contentType : APPLICATION_JSON_VALUE,
				url : APP_BASE_URL + SCHOOL_UUID + "/teacher/signup/get-teacher-demo-recordings",
				data : JSON.stringify(payload),
				dataType : 'json',
				async : false,
				success : function(response) {
					if (response.recordingArray[0].urls && response.recordingArray[0].urls.length > 0) {
						populateTeacherRecordingModal(response.recordingArray[0].urls, userId);
					} else {
						showMessage(false, "No recordings available.");
					}
				}
			})
		}
		function populateTeacherRecordingModal(recordings, userId) {
			const titles = {
				"shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
				"active_speaker.mp4": "Active Speaker",
				"shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
				"gallery_view.mp4": "Gallery View",
				"shared_screen.mp4": "Shared Screen",
				"shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
				"-1.1.mp4": "Recording",
				"-1.2.mp4": "Recording 2",
				"audio_only": "Audio File",
			};

			let modalContent = `
				<div class="modal fade" id="recordingModal" tabindex="-1" role="dialog" aria-labelledby="recordingModalLabel" aria-hidden="true">
					<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
						<div class="modal-content rounded">
								<div class="modal-header bg-primary text-white">
								<h5 class="modal-title" id="recordingModalLabel" style="font-weight: bold;">Available Recordings</h5>
								<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div class="modal-body" style="height: 70vh; overflow-y: auto;">`;
							const filteredRecordings = recordings.filter(urlObj => !urlObj.url.toLowerCase().endsWith('.json'));
				if (filteredRecordings.length > 0) {
				modalContent += `<div class="">`;

				const transcriptUrl = filteredRecordings[filteredRecordings.length - 1]?.url;

				filteredRecordings.forEach((urlObj, index) => {
					let label = "Recording";
					for (const key in titles) {
					if (urlObj.url.includes(key)) {
						label = titles[key];
						break;
					}
					}

					modalContent += `
					<div class="recording-item d-flex justify-content-between align-items-center border-bottom py-2">
						<h5 class="mb-0">${index + 1}. ${label}</h5>
						<button class="btn btn-primary rounded" onclick="playRecording('${urlObj.url}', '${label}')">Play</button>
					</div>
					`;
				});

				if (transcriptUrl) {
					modalContent += `
					<div class="recording-item d-flex justify-content-between align-items-center border-bottom py-2">
						<h5 class="mb-0">${recordings.length + 1}. Transcript</h5>
						<button class="btn btn-primary rounded" onclick="showVTTFile('${transcriptUrl}', 'Transcript')">Read</button>
					</div>
					`;
				}
				modalContent += `</div>`;
				}

				modalContent += `
							</div>
							<div class="modal-footer">
								<a href="javascript:void(0);" onclick="showWarningMessageShow('Are you sure you want to re-attempt recordings?', \'enableReattemptRecording(${userId})\');" class="btn btn-primary">Enable Re-Attempt Recordings</a>
							</div>
						</div>
					</div>
				</div>
				`;


			let modalElement = $("#recordingModal");
			if (modalElement.length > 0) {
				modalElement.remove();
			}

			$("body").append(modalContent);
			$("#recordingModal").modal("show");
		}

		function playRecording(videoUrl, title) {
			var videoModal = $("#videoModal");
			$.ajax({
			type: "GET",
			contentType: APPLICATION_JSON_VALUE,
			dataType: 'json',
			url: getURLForSignVideo(videoUrl),
			success: function (responseData) {
				if (responseData.status == 0) {
				const signedUrl = responseData.url;
				if (videoModal.length == 0) {
					$("body").append(`
						<div class="modal fade" id="videoModal" tabindex="-1" role="dialog" aria-labelledby="videoModalLabel" aria-hidden="true">
						  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
							<div class="modal-content rounded">
							  <div class="modal-header bg-primary text-white">
								<h5 class="modal-title mb-0" id="videoModalLabel" style="font-weight: bold;">
								  Demo Video | ${title}
								</h5>
								<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close" onclick="closeVideoModal();">
								  <span aria-hidden="true">&times;</span>
								</button>
							  </div>
							  <div class="modal-body d-flex justify-content-center">
								<video class="videoTag w-100" style="height: 70vh; overflow-y: auto;" controls>
								  <source src="${signedUrl}" type="video/mp4" />
								  Your browser does not support the video tag.
								</video>
							  </div>
							</div>
						  </div>
						</div>
						`);
				} else {
					videoModal.find(".modal-title").text(title);
					videoModal.find(".videoTag source").attr("src", signedUrl);
					videoModal.find(".videoTag")[0]?.load();
				}
		
				$("#videoModal").modal("show");
				} else {
				showMessage(0, responseData.message || "Failed to fetch video URL");
				}
				customLoader(false);
			},
			error: function (e) {
				console.error("Error fetching signed video URL:", e.message);
				showMessage(0, "Error fetching video.");
				customLoader(false);
			}
			});
		}

		function closeVideoModal(){
			const videoElement = $("#videoModal .videoTag")[0];
			if (videoElement) {
				videoElement.pause();
				videoElement.currentTime = 0;
			}
			$("#videoModal").modal("hide");
			setTimeout(() => {
				$("#videoModal").remove();
			}, 500);
		}

		function getURLForSignVideo(videoUrl) {
			const payload = JSON.stringify({ url: videoUrl });
			const encodePayload = window.btoa(payload);
			return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
		}

		function getURLForSignVideo(videoUrl) {
			const payload = JSON.stringify({ url: videoUrl });
			const encodePayload = window.btoa(payload);
			return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
		}
		
		function getURLForTranscriptContent(transcriptUrl) {
			var payload = JSON.stringify({ url: transcriptUrl });
			var encodePayload = window.btoa(payload);
			return BASE_URL + CONTEXT_PATH + "transcript/show-content?payload=" + encodePayload;
		}
		
		function convertToVTT(videoUrl) {
			if (!videoUrl.endsWith(".mp4")) {
				return null;
			}
			const urlParts = new URL(videoUrl);
			const filePath = urlParts.pathname.replace(
				/\/([^\/]+)-(\d+\.\d+)\.mp4$/,
				"/$1-transcript-$2.vtt"
			);
			let transcriptUrl = urlParts.origin + filePath;

			if (transcriptUrl === videoUrl) {
				const prefixUrl = "https://ischoolingwise.s3.us-east-1.amazonaws.com/recordings/";
				const sessionId = videoUrl.split(prefixUrl)[1].split("-")[0];
				transcriptUrl = prefixUrl + sessionId + "-transcript-1.1.vtt";
			}
			return transcriptUrl;
		}
		
		function displayVTT(content, title) {
			const output = $("#transcript-modal-body");
			output.empty();

			if(content.includes("<Error><Code>")){
				output.append(`<p style="font-size: 18px;">No Transcript Available</p>`)
			} else {
				var lines = content.split("\n");
				lines.forEach(line => {
				var p = $("<p></p>").text(line);
				output.append(p);
				});
			}

			$("#transcriptModalTitle").html(title);
			$("#transcriptModal").modal("show");
		}
		
		function showVTTFile(url, title) {
			let transcriptModal = $("#transcriptModal");
			if (transcriptModal.length === 0) {
				$("body").append(`
				<div class="modal fade" id="transcriptModal" tabindex="-1" role="dialog" aria-labelledby="transcriptModalTitle" aria-hidden="true">
				  <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
					<div class="modal-content rounded d-flex flex-column h-100">
					  <div class="modal-header bg-primary text-white">
						<h5 class="modal-title mb-0" id="transcriptModalTitle" style="font-weight: bold;">${title}</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
						  <span aria-hidden="true">&times;</span>
						</button>
					  </div>
					  <div id="transcript-modal-body" class="modal-body text-left" style="height: 70vh; overflow-y: auto;">
						<!-- Transcript content will be populated here -->
					  </div>
					</div>
				  </div>
				</div>
				`);
			}

			customLoader(true);
			const vttFile = convertToVTT(url);
			$.ajax({
				type: "GET",
				contentType: APPLICATION_JSON_VALUE,
				dataType: 'json',
				url: getURLForTranscriptContent(vttFile),
				success: function(responseData) {
					customLoader(false);
					displayVTT(responseData.content, title);
				},
				error: function() {
					customLoader(false);
					showMessage(0, "Failed to load transcript.");
				}
			});
		}

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