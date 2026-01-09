function callDashboardPageStudent(pageNo, args){

}

function callStudentInneraction(actionType, arg0){
}

function checkBoxDisable() {
	if($('#checkParentDetails').is(':checked')){
		$("input[name=guardianEmail]").attr("disabled", true);
		$("input[name=guardianEmail]").val("").trim();
	    $("input[name=guardianEmail]").removeAttr("required");

	 }else{
		$("input[name=guardianEmail]").removeAttr('disabled');
		$("input[name=guardianEmail]").attr("required",true);
	 }
	}

function submitTask(formId) {
	$(".disabledFields").each(function(){
		$(this).removeAttr('disabled');
	});
	var serializedString = $('#' + formId).serialize();
	console.log('serializedString '+serializedString);
	$(".disabledFields").each(function(){
		$(this).attr('disabled','disabled');
	});
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','student-task-submit-content'),
		data : serializedString,
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else {
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
        			$('#dashboardContentInHTML').html(htmlContent)
        		}
        		return false;
			}
		}
	});
}

//function showEligibleCourseToChoose(providerId){
//	if(providerId==2){
//		$('#eligibleCourseToChooseModal').modal({backdrop: 'static', keyboard: false});
//	}else{
//		$('#eligibleCourseToChooseModal').modal('show');
//	}
//}

function showEligibleCourseToChoose(){
	$('#eligibleCourseToChooseModal').modal({backdrop: 'static', keyboard: false});
}
function cancelEligbileCourse(){
	$(".subjectToChooseId").each(function() {
		if ($(this).hasClass("selected-course")) {
			$(this).removeClass("selected-course");
		}
	});
	$('#eligibleCourseToChooseModal').modal('hide');
}

async function getProfileFields() {
	var payload = {};
	payload['schoolId'] = SCHOOL_ID;
	payload['userId'] = USER_ID;
	return await getDashboardDataBasedUrlAndPayload(true, true,'get-profile-field', payload);
}

function saveEligibleCourse(elegibleToChoose,currentSizeLeftTable1,currentSizeLeftTable2){
//	var totalSize=6;
//	var currentSizeLeft = totalSize-elegibleToChoose;
	var selectedSubject=0;
	$(".subjectToChooseId").each(function() {
		if ($(this).hasClass("selected-course")) {
			selectedSubject++;
		}
	})
	if(selectedSubject != elegibleToChoose){
		showMessageTheme2(2, ' Please select at most '+elegibleToChoose+' course(s).',true);
		return false;
	}
	$(".subjectToChooseId").each(function() {
		$('#semester1table #'+this.id).remove();
		$('#semester2table #'+this.id).remove();
	})
//	var currentSizeLeftTable1 = currentSizeLeft;
//	var currentSizeLeftTable2 = currentSizeLeft;
	$(".subjectToChooseId").each(function() {
		if ($(this).hasClass("selected-course")) {
			var html = '<tr id="'+this.id+'" entityName="'+$(this).attr('entityName')+'"><td>'+(++currentSizeLeftTable1)+'</td><td>'+$(this).attr('nameAndCode')+'</td></tr>';
			$('#semester1table').append(html);
		}else{
			var html = '<tr id="'+this.id+'" entityName="'+$(this).attr('entityName')+'"><td>'+(++currentSizeLeftTable2)+'</td><td>'+$(this).attr('nameAndCode')+'</td></tr>';
			$('#semester2table').append(html);
		}
	});
	$('#eligibleCourseToChooseModal').modal('hide');
	setTimeout(function(){$('body').addClass('modal-open');},1000);
}

function saveCurrentSelectedSubjects(studentId, standardId, enrollmentType, registrationType){
	if(registrationType!='Batch' && registrationType!='BATCH'){
		if($('#chooseDateToStartSemster').val()=='' || $('#chooseDateToStartSemster').val()==undefined){
			showMessageTheme2(2," Please select your academic year start date.",'',false);
			return false;
		}
	}
	$('#selectStudentCourseProceed').attr('disabled', false);
	var selectedSemester1Subject="";
	var selectedSemester1SubjectDate = "";
	var selectedSemester2Subject="";
	var selectedSemester2SubjectDate = "";
	var selectedSemesterAPSubject="";

	$('#semester1table tbody tr').each(function() {
//		entityName = $(this).attr('entityName');
//		if(entityName=='PLACEMENT-SUBJECT'){
//			selectedSemesterAPSubject+=this.id+',';
//		}else{
//		}
		selectedSemester1Subject+=this.id+',';
		//selectedSemester1SubjectDate+=this.id+':'+$("#chooseDateToStartSemsterA-"+this.id).val().trim()+',';
		selectedSemester1SubjectDate+=this.id+',';
	});
	$('#semester2table tbody tr').each(function() {
//		entityName = $(this).attr('entityName');
//		if(entityName=='PLACEMENT-SUBJECT'){
//			//selectedSemesterAPSubject+=this.id+',';
//		}else{
//		}
		selectedSemester2Subject+=this.id+',';
		//selectedSemester2SubjectDate+=this.id+':'+$("#chooseDateToStartSemsterB-"+this.id).val().trim()+',';
		selectedSemester2SubjectDate+=this.id+',';
	});
	selectedSemester1Subject = selectedSemester1Subject.substr(0,selectedSemester1Subject.length-1);
	selectedSemester1SubjectDate = selectedSemester1SubjectDate.substr(0,selectedSemester1SubjectDate.length-1);
	selectedSemester2Subject = selectedSemester2Subject.substr(0,selectedSemester2Subject.length-1);
	selectedSemester2SubjectDate = selectedSemester2SubjectDate.substr(0,selectedSemester2SubjectDate.length-1);
	selectedSemesterAPSubject = selectedSemesterAPSubject.substr(0,selectedSemesterAPSubject.length-1)
	var length1=selectedSemester1Subject.split(',').length;
	var length2=selectedSemester2Subject.split(',').length;
	var length3=0;
	if(selectedSemesterAPSubject!=''){
		length3 = selectedSemesterAPSubject.split(',').length;
	}
	//REGISTRATION_FRESH, REGISTRATION_NEXT_GRADE
//	TODO model course selection blank for flex signup

//	if(enrollmentType=='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_NEXT_GRADE'){
//		if(parseInt(length1+length3) == 6 && parseInt(length2+length3) == 6){
//		}else {
//			showMessageTheme2(0, 'Please select courses for this semester.')
//			return false;
//		}
//	}
	$('#selectedSemester1Subject').val(selectedSemester1Subject);
	$('#selectedSemester1SubjectDate').val(selectedSemester1SubjectDate);
	$('#selectedSemester2Subject').val(selectedSemester2Subject);
	$('#selectedSemester2SubjectDate').val(selectedSemester2SubjectDate);
	$('#selectedSemesterAPSubject').val(selectedSemesterAPSubject);
	var payload = "studentId="+studentId
	+"&standardId="+standardId
	+"&semester1Subject="+$('#selectedSemester1Subject').val()
	+"&semester2Subject="+$('#selectedSemester2Subject').val()
	+"&semesterAPSubject="+$('#selectedSemesterAPSubject').val()
	+"&selectedSemester1SubjectDate="+$('#selectedSemester1SubjectDate').val()
	+"&selectedSemester2SubjectDate="+$('#selectedSemester2SubjectDate').val()
	+"&semesterStartDate="+($('#chooseDateToStartSemster').val() != undefined?$('#chooseDateToStartSemster').val():'');
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','save-student-course-selection-content'),
		data : payload,
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
					if(stringMessage[0] == "SESSIONOUT"){
						redirectLoginPage();
					}else{
						showMessageTheme2(2, stringMessage[1],'',true);
					}
				}
				showMessageTheme2(1, stringMessage[1],'',true);
				$('#selectStudentCourseProceed').attr('disabled', true);
				$('#studentCourseSelectionModel').modal('hide');
				if(USER_ROLE == 'STUDENT'){
				}else{
					setTimeout(function(){
						hideMessageTheme2('');
						DEFAULT_SEARCH_STATE=true;
						setTimeout(function() { callDashboardPageSchool('8','manage-user-list','&schoolId='+SCHOOL_ID+'&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2'); }, 1000);
//						callDashboardPageSchool('2b','studentTab','','&schoolId='+SCHOOL_ID);
					}, 3100);
				}
			}
		}
	});
}

function saveOrientationAcceptance(orientationId){
	hideMessageTheme2('');
	var data={};
	var orientationID = $("#"+orientationId).val()
	data['orientationId']=orientationID;
	data['schoolId']=SCHOOL_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','save-orientation-acceptance'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
				$("#iAcknowledgeOrientation").modal("hide");
				$("#timePreferencePopup").modal("hide");
				$("#timePreferencePopup").addClass("d-none");
				$("#rescheduleOrientationBtn").hide();
				$("#iAcknowledgeOrientationBtn").hide();
				$("#orientationClassLink").show();
			}
			return false;
		}
	});
}

function orientationSkip(){
	var redirectUrl = $("#dashboardUrl").val()
	hideMessageTheme2('');
	var data={};
	var studentStandardId = $("#studentStandardId").val();
	data['studentStandardId']=studentStandardId;
	data['schoolId']=SCHOOL_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','save-orientation-skip-status'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
				showContentByStep("Y", "Skipped", data['semesterStartDate'])  
			}
			return false;
		}
	});
	
}

function callSemesterStartDateEntry(studentId){
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','student-semester-start-date-entry-content'),
		data : "studentId="+studentId,
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
        			$('#studentSemesterStartDateEntryHTML').html(htmlContent)
        		}
			}
		}
	});
}
function callSemesterStartDateEntry1(studentId, standardId, studentName, moduleId){
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','student-semester-start-date-entry-content1'),
		data : "studentId="+studentId+"&standardId="+standardId+"&moduleId="+moduleId,
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
        			$('#studentSemesterStartDateEntryHTML1').html(htmlContent)
        		}
			}
		}
	});
}
function callForSession(studentId,standardId, semesterType, sessionId, startDate, controllType){
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','student-semester-content'),
		data : 	"studentId="+studentId
				+"&standardId="+standardId
				+"&semesterType="+semesterType
				+"&sessionId="+sessionId
				+"&startDate="+startDate
				+"&controllType="+controllType,
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
        			$('#studentAddNewSemesterData').html(htmlContent)
        			if(controllType=='VIEW'){
        				$('#studentSessionForm .subjcheck').attr('disabled', true);
        				$('#studentSessionForm .full .detail-input').attr('disabled', true);
        				$("#sessionSave").hide();
        			}else{
        				$("#sessionSave").show();
        			}
        			$("#sessionAddNew").hide();
        		}
			}
		}
	});
}
//function saveSemesterStartDateEntry(studentId){
//	if($('#semesterStartDateA').val().trim()=='' || $('#semesterEndDateA').val().trim()==''){
//		showMessageTheme2(0, 'Please choose semester A start and end date');
//		return false;
//	}
//	if($('#semesterAStatus').val().trim()==''){
//		showMessageTheme2(0, 'Please choose semester A status');
//		return false;
//	}
//	if($('#semesterStartDateB').val().trim()=='' && $('#semesterEndDateB').val().trim()==''){
//
//	}else{
//		if($('#semesterStartDateB').val().trim()!='' && $('#semesterEndDateB').val().trim()==''){
//			showMessageTheme2(0, 'Please choose semester B start and end date');
//			return false;
//		}
//		if($('#semesterStartDateB').val().trim()=='' && $('#semesterEndDateB').val().trim()!=''){
//			showMessageTheme2(0, 'Please choose semester B start and end date');
//			return false;
//		}
//		if($('#semesterBStatus').val().trim()==''){
//			showMessageTheme2(0, 'Please choose semester B status');
//			return false;
//		}
//	}
//
//	if($('#weeklyReportFrequency').val().trim()==''){
//		showMessageTheme2(0, 'Please select week day');
//		return false;
//	}
//	var payLoad="studentId="+studentId
//				+"&semesterAStartDate="+$('#semesterStartDateA').val().trim()
//				+"&semesterAEndDate="+$('#semesterEndDateA').val().trim()
//				+"&semesterAStatus="+$('#semesterAStatus').val().trim()
//				+"&semesterBStartDate="+$('#semesterStartDateB').val().trim()
//				+"&semesterBEndDate="+$('#semesterEndDateB').val().trim()
//				+"&semesterBStatus="+$('#semesterBStatus').val().trim()
//				+"&weeklyReportFrequency="+$('#weeklyReportFrequency').val().trim();
//	$.ajax({
//		type : "POST",
//		url : getURLForHTML('dashboard','save-student-semester-start-date-entry'),
//		data : payLoad,
//		dataType : 'html',
//		cache : false,
//		timeout : 600000,
//		success : function(htmlContent) {
//			if(htmlContent!=""){
//            	var stringMessage = [];
//            	stringMessage = htmlContent.split("|");
//        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
//        			if(stringMessage[0] == "SESSIONOUT"){
//        				redirectLoginPage();
//        			}else{
//        				showMessageTheme2(0, stringMessage[1]);
//        			}
//        		} else {
//        			$('#studentSemesterStartDateEntryModel').modal('hide');
//        			showMessageTheme2(0, stringMessage[1]);
//        			setTimeout(function(){
//						hideMessage('');
//						DEFAULT_SEARCH_STATE=true;
//						callDashboardPageSchool('2b','studentTab','','&schoolId='+SCHOOL_ID);
//					}, 3100);
//        		}
//			}
//		},
//		error : function(e) {
//			//showMessageTheme2(0, TECHNICAL_GLITCH);
//		}
//	});
//}

function validateRequestForsaveSemesterStartDateEntry1(formId){

	if ($("#"+formId+" #sessionName").val().trim()=='' || $("#"+formId+" #sessionName").val()==null) {
		showMessageTheme2(0, 'Session Name is required');
		return false
	}

	if ($("#"+formId+" #semesterDateStart").val()==null || $("#"+formId+" #semesterDateStart").val().trim()=='') {
		showMessageTheme2(0, 'Semester Start Date is required');
		return false
	}
	if ($("#"+formId+" #semesterDateEnd").val()==null || $("#"+formId+" #semesterDateEnd").val().trim()=='') {
		showMessageTheme2(0, 'Semester End Date is required');
		return false
	}
	if ($("#"+formId+" #weeklyReportFrequency").val()==null || $("#"+formId+" #weeklyReportFrequency").val().trim()=='') {
		showMessageTheme2(0, 'Please select week day');
		return false;
	}
	if ($("#"+formId+" #semesterStatus").val()==null || $("#"+formId+" #semesterStatus").val().trim()=='') {
		showMessageTheme2(0, 'Please choose semester  status');
		return false;
	}

	return true;
}
function saveSemesterStartDateEntry1(formId, studentId) {
	if(!validateRequestForsaveSemesterStartDateEntry1(formId)){
		return false;
	}
	hideMessageTheme2('');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','save-student-semester-start-date-entry1'),
		data : JSON.stringify(getRequestForSaveSemesterStartDateEntry1(formId, studentId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				setTimeout(function(){ $('#studentSemesterStartDateEntryModel').modal('hide'); }, 1000);

				$("#sessionAddNew").show();
    			$("#sessionSave").hide();
//				callSemesterStartDateEntry(studentId);
				/*$('#studentSemesterStartDateEntryModel').modal('hide');
				setTimeout(function(){ callDashboardPageSchool('2b','studentTab','','&schoolId='+SCHOOL_ID); }, 1000);*/
			}
			return false;
		}
	});
}
function getRequestForSaveSemesterStartDateEntry1(formId, studentId){
	var request = {};
	var authentication = {};
	var requestData = {};

	var studentSesssionDTO = {};
	studentSesssionDTO['studentId']=studentId;
	studentSesssionDTO['sesssionId']=$("#"+formId+" #sesssionId").val().trim();
	studentSesssionDTO['sessionName'] = $("#"+formId+" #sessionName").val().trim();
	studentSesssionDTO['semesterDateStart'] = $("#"+formId+" #semesterDateStart").val().trim();
	studentSesssionDTO['semesterDateEnd'] = $("#"+formId+" #semesterDateEnd").val().trim();
	studentSesssionDTO['frequencyDayId'] = $("#"+formId+" #weeklyReportFrequency").val().trim();
	studentSesssionDTO['standardId'] = $("#"+formId+" #standardId").val().trim();
	studentSesssionDTO['semesterType'] = $("#"+formId+" #semesterType").val().trim();
	var subjectList = [];
	var unSubjectList=[];
	 $.each($("input[name='subjcheck']"), function(){
       if(this.checked){
			subjectList.push($(this).val().trim());
		}else{
			unSubjectList.push($(this).val().trim());
		}
	 });

	studentSesssionDTO['selectedSubjects'] = subjectList.join();
	studentSesssionDTO['withdrownSubjects'] = unSubjectList.join();
//	studentSesssionDTO['selectedAPSubjects'] =subjectList.join();
//	studentSesssionDTO['withdrownAPSubjects'] = unSubjectList.join();
	studentSesssionDTO['semesterStatus'] =$("#"+formId+" #semesterStatus").val().trim();

	requestData['studentSesssionDTO'] = studentSesssionDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "STUDENT";
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function studentStatusUpdate(userId,status,rolemoduleId){
	console.log('studentStatusUpdate 1')
	var data={};
	data['userId']=userId;
	data['status']=status;
	data['sessionUserId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student-withdrown-join'),
		data:JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		async:false,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else {
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		}else if(stringMessage[0] == "SUCCESS"){
        			showMessageTheme2(1, stringMessage[1]);
        			setTimeout(function(){ callDashboardPageSchool(rolemoduleId,'manage-user-list','','&schoolId='+SCHOOL_ID+'&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2'); }, 1000);
        		}
        		return false;
			}
		}
	});
}

function bookSessionUpgrade(planId, preAmount, amount){
	$('#subjectAmountDescription').show();
	$("#session-plan").hide();
	$(".heading-modal").html("Fee Detail");

	var amt=parseInt(amount);
	var totalAmt = parseInt(amount) - parseInt(preAmount);
	var totalPayAmt = parseInt(amount) - parseInt(preAmount);
	console.log("subjectAmountDescription=>", totalAmt+" "+totalPayAmt);
	$("#totalCourseAmt").html("$"+totalAmt);
	$("#amountPayble").html("$"+totalPayAmt);
	$("#planAmount").val(amt);
	$("#planId").val(planId);
	$("#amount").val(totalPayAmt);
	$(".confirmBookSession").show();
	$('.backOptionBookSession').show();
}

function bookSessionBack(){
	$("#session-plan").show();
	$(".heading-modal").html("Select the number of extra classes you would like to attend per week:");
	$('#subjectAmountDescription').hide();
	$('.backOptionBookSession').hide();
	$(".confirmBookSession").hide();
}

function withdrawnRequest(userId){
	$.ajax({
		type : "GET",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student/withdrawn-request'),
		data :'userId='+userId,
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(1, stringMessage[1],'',true);
        			}
        			return false;
        		} else {
        			$('#withdrawn-request').html(htmlContent)
        			return true;
        		}
			}
		}
	});
}

function submitWithDrawnRequest(formId,moduleId,requestId,status, studentUserId,userRole) {
	hideMessage('');
	if(status!='BANKDETAIL'){
		if(!validateRequestForSubmitWithDrawnRequest(formId,moduleId, status,userRole)){
			return false;
		}
	}

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','withdrawn-request-submit'),
		data : JSON.stringify(getRequestForSubmitWithDrawnRequest(formId, moduleId, requestId,status, studentUserId,userRole)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {

				if(status=='INITIATED'){
					showMessageTheme2(1, data['message']);
					$("#resonFeel").hide();
					$("#verifyEmail").hide();
					$("#reasonOtp").show();
					$("#submitWithdrawn").show();
					$('#successWithdrawalRequestDiv').hide();
				}else if(status=='PENDING'){
					if(userRole !='STUDENT'){
						$("#resonFeel").hide();
						$('#successWithdrawalRequestDiv').hide();
					}
					$("#crossButton").hide();
					$("#reasonOtp").hide();
					$("#submitWithdrawn").hide();
					$("#submitWithdrawnAdmin").hide();
					$("#closeButton").hide();
					$('#successWithdrawalRequestDiv').show();
					$("#successMessageSubmitted").show();
					$("#withdrawn-request-modal").find('.modal-dialog').addClass('modal-dialog-centered')
					$('#'+formId)[0].reset();
				}else if(status=='CANCELLED'){
					showMessageTheme2(1, data['message']);
					callInneraction('1a',studentUserId);
					location.reload();
				}else if(status=='BANKDETAIL'){
					$('#'+formId)[0].reset();
					$('#withdrawn-request-bank-modal').modal('hide');
					if(userRole !='STUDENT'){
						showModalMessage(false,"Bank details updated successfully.");
						location.reload();
						// setTimeout(function(){return callDashboardPageSchool(106,'withdrawn-request-list');},5000);
					}else{
						showMessageTheme2(1, data['message']);
						setTimeout(function(){redirectLoginPage();},1000);
					}
				}

			}
			return false;
		}
	});
}

function getRequestForSubmitWithDrawnRequest(formId, moduleId, requestId, status, userId, userRole){
	var request = {};
	var authentication = {};
	var withdrawnRequestDTO = {};
	withdrawnRequestDTO['requestId'] = requestId;
	withdrawnRequestDTO['status']=status;
	if(status=='PENDING'){
		withdrawnRequestDTO['otpNumber'] = $("#reasonOtpNumber").val();
		if(userRole != 'STUDENT'){
			withdrawnRequestDTO['reasonId'] = $("input[name=reasonId]:checked"). val();
			withdrawnRequestDTO['otherReason'] = $("#otherReason").val();
			if($("#remarks").val()!=undefined){
				withdrawnRequestDTO['remarks']=$("#remarks").val();
			}
		}
	}else if(status=='BANKDETAIL'){
		withdrawnRequestDTO['accountPersonName'] = $("#accountPersonName").val();
		withdrawnRequestDTO['bankName'] = $("#bankName").val();
		withdrawnRequestDTO['accountNumber'] = $("#accountNumber").val();
		withdrawnRequestDTO['swiftCode'] = $("#swiftCode").val();
		withdrawnRequestDTO['bankBranchName'] = $("#bankBranchName").val();
		withdrawnRequestDTO['bankBranchAddress'] = escapeCharacters($("#bankBranchAddress").val());
		withdrawnRequestDTO['countryId'] = $("#countryId").val();
		withdrawnRequestDTO['stateId'] = $("#stateId").val();
		withdrawnRequestDTO['cityId'] = $("#cityId").val();
		withdrawnRequestDTO['streetPostalCode'] = $("#streetPostalCode").val();
		withdrawnRequestDTO['routeNumber'] = $("#routeNumber").val();
		withdrawnRequestDTO['beneficiaryAddress'] = $("#beneficiaryAddress").val();
		withdrawnRequestDTO['beneficiaryCountryId'] = $("#beneficiaryCountryId").val();
		withdrawnRequestDTO['beneficiaryStateId'] = $("#beneficiaryStateId").val();
		withdrawnRequestDTO['beneficiaryCityId'] = $("#beneficiaryCityId").val();
		withdrawnRequestDTO['beneficiaryPostalCode'] = $("#beneficiaryPostalCode").val();
		withdrawnRequestDTO['beneficiaryPhone'] = $("#beneficiaryPhone").val();
		if($("#bankTermCond").is(":checked")){
			withdrawnRequestDTO['checkTermCondition'] = 'Y';
		}else{
			withdrawnRequestDTO['checkTermCondition'] = 'N';
		}
		withdrawnRequestDTO['refundAmount'] = $("#refundAmount").val();

	}else{
		withdrawnRequestDTO['reasonId'] = $("input[name=reasonId]:checked"). val();
		withdrawnRequestDTO['otherReason'] = $("#otherReason").val();
		if($("#remarks").val()!=undefined){
			withdrawnRequestDTO['remarks']=$("#remarks").val();
		}
	}
	withdrawnRequestDTO['userId']=userId;
	request['withdrawnRequestDTO'] = withdrawnRequestDTO;
	authentication['hash'] = getHash();
	authentication['userType'] = moduleId;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function validateRequestForSubmitWithDrawnRequest(formId,moduleId, status, userRole){
	
	if(status=='INITIATED'){
		if($("input[name=reasonId]:checked").val()=='6'){
			if($("#otherReason").val()=='' || $("#otherReason").val()==' '){
				showMessageTheme2(0, "Please fill your reason.",'',true);
				return false;
			}
		}
		if($("input[name=reasonId]:checked").val()){
		}else {
			showMessageTheme2(0, "Please fill your reason.",'',true);
			return false;
		}

	}else if(status=='PENDING' && userRole=='STUDENT'){
		if($("#reasonOtpNumber"). val()=='' || $("#reasonOtpNumber"). val()==' '){
			showMessageTheme2(0, " Please enter the OTP",'',true);
			return false;
		}

	}else if (status=='BANKDETAIL'){
		console.log('BANKDETAIL');
		if(userRole=='STUDENT'){

			if($("#accountPersonName").val()==''  || $("#accountPersonName").val()==' '){
				showMessageTheme2(0, "Please fill Account Holder Name.",'',true);
				return false;
			}
			if($("#bankName").val()==''  || $("#bankName").val()==' '){
				showMessageTheme2(0, "Please fill Bank Name.",'',true);
				return false;
			}
			if($("#accountNumber").val()==''  || $("#accountNumber").val()==' '){
				showMessageTheme2(0, "Please fill Account number.",'',true);
				return false;
			}
			if($("#swiftCode").val()==''  || $("#swiftCode").val()==' '){
				showMessageTheme2(0, "Please fill Swift Code.",'',true);
				return false;
			}
			if($("#bankBranchName").val()==''  || $("#bankBranchName").val()==' '){
				showMessageTheme2(0, "Please fill Bank Branch name.",'',true);
				return false;
			}
			if($("#bankBranchAddress").val()==''  || $("#bankBranchAddress").val()==' '){
				showMessageTheme2(0, "Please fill Bank Branch address.",'',true);
				return false;
			}
			if($("#countryId").val()==''  || $("#countryId").val()==' '){
				showMessageTheme2(0, "Please Select Bank Branch country.",'',true);
				return false;
			}
			if($("#stateId").val()==''  || $("#stateId").val()==' '){
				showMessageTheme2(0, "Please Select Bank Branch state.",'',true);
				return false;
			}
			if($("#cityId").val()==''  || $("#cityId").val()==' '){
				showMessageTheme2(0, "Please Select Bank Branch city.",'',true);
				return false;
			}
			if($("#streetPostalCode").val()==''  || $("#streetPostalCode").val()==' '){
				showMessageTheme2(0, "Please fill Bank Branch Street postal code.",'',true);
				return false;
			}
			if($("#beneficiaryAddress").val()==''  || $("#beneficiaryAddress").val()==' '){
				showMessageTheme2(0, "Please fill Beneficiary Address.",'',true);
				return false;
			}
			if($("#beneficiaryCountryId").val()==''  || $("#beneficiaryCountryId").val()==' '){
				showMessageTheme2(0, "Please Select Beneficiary Country.",'',true);
				return false;
			}
			if($("#beneficiaryStateId").val()==''  || $("#beneficiaryStateId").val()==' '){
				showMessageTheme2(0, "Please Select Beneficiary State.",'',true);
				return false;
			}
			if($("#beneficiaryCityId").val()==''  || $("#beneficiaryCityId").val()==' '){
				showMessageTheme2(0, "Please Select Beneficiary City.",'',true);
				return false;
			}
			if($("#beneficiaryPostalCode").val()==''  || $("#beneficiaryPostalCode").val()==' '){
				showMessageTheme2(0, "Please Fill Beneficiary postal code.",'',true);
				return false;
			}
			if($("#beneficiaryPhone").val()==''  || $("#beneficiaryPhone").val()==' '){
				showMessageTheme2(0, "Please Fill Beneficiary phone.",'',true);
				return false;
			}
			if($("#bankTermCond").is(":checked")){
	
			}else{
				showMessageTheme2(0, "Please check term & condition.",'',true);
				return false;
			}
		}else{
			if($("#accountPersonName").val()==''  || $("#accountPersonName").val()==' '){
				showMessageBankDetails(false, "Please fill Account Holder Name.");
				return false;
			}
			if($("#bankName").val()==''  || $("#bankName").val()==' '){
				showMessageBankDetails(false, "Please fill Bank Name.");
				return false;
			}
			if($("#accountNumber").val()==''  || $("#accountNumber").val()==' '){
				showMessageBankDetails(false, "Please fill Account number.");
				return false;
			}
			if($("#swiftCode").val()==''  || $("#swiftCode").val()==' '){
				showMessageBankDetails(false, "Please fill Swift Code.");
				return false;
			}
			if($("#bankBranchName").val()==''  || $("#bankBranchName").val()==' '){
				showMessageBankDetails(false, "Please fill Bank Branch name.");
				return false;
			}
			if($("#bankBranchAddress").val()==''  || $("#bankBranchAddress").val()==' '){
				showMessageBankDetails(false, "Please fill Bank Branch address.");
				return false;
			}
			if($("#countryId").val()==''  || $("#countryId").val()==' '){
				showMessageBankDetails(false, "Please Select Bank Branch country.");
				return false;
			}
			if($("#stateId").val()==''  || $("#stateId").val()==' '){
				showMessageBankDetails(false, "Please Select Bank Branch state.");
				return false;
			}
			if($("#cityId").val()==''  || $("#cityId").val()==' '){
				showMessageBankDetails(false, "Please Select Bank Branch city.");
				return false;
			}
			if($("#streetPostalCode").val()==''  || $("#streetPostalCode").val()==' '){
				showMessageBankDetails(false, "Please fill Bank Branch Street postal code.");
				return false;
			}
			if($("#beneficiaryAddress").val()==''  || $("#beneficiaryAddress").val()==' '){
				showMessageBankDetails(false, "Please fill Beneficiary Address.");
				return false;
			}
			if($("#beneficiaryCountryId").val()==''  || $("#beneficiaryCountryId").val()==' '){
				showMessageBankDetails(false, "Please Select Beneficiary Country.");
				return false;
			}
			if($("#beneficiaryStateId").val()==''  || $("#beneficiaryStateId").val()==' '){
				showMessageBankDetails(false, "Please Select Beneficiary State.");
				return false;
			}
			if($("#beneficiaryCityId").val()==''  || $("#beneficiaryCityId").val()==' '){
				showMessageBankDetails(false, "Please Select Beneficiary City.");
				return false;
			}
			if($("#beneficiaryPostalCode").val()==''  || $("#beneficiaryPostalCode").val()==' '){
				showMessageBankDetails(false, "Please Fill Beneficiary postal code.");
				return false;
			}
			if($("#beneficiaryPhone").val()==''  || $("#beneficiaryPhone").val()==' '){
				showMessageBankDetails(false, "Please Fill Beneficiary phone.");
				return false;
			}
			if($("#bankTermCond").is(":checked")){
	
			}else{
				showMessageBankDetails(false, "Please check term & condition.");
				return false;
			}
		}
	}

	return true;
}

function withdrawnBankRequest(requestId, userId){
	var data={};
	data['userId']=userId;
	data['requestId']=requestId;
	data['sessionUserId']=USER_ID;
	data['themeType']=tt;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student/withdrawn-bank-request'),
		data :JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(1, stringMessage[1],'',true);
        			}
        			return false;
        		} else {
        			$('#withdrawn-bank-detail').html(htmlContent)
					$('#withdrawn-request-bank-modal').modal({
						backdrop: 'static',
						keyboard: false,
					})
        			return true;
        		}
			}
		}
	});
}
function  prefillWithdrawnBankRequest(requestId,userId,accountPersonName,accountNumber,swiftCode,bankName,
	bankBranchName,bankBranchAddress,streetPostalCode,routeNumber,beneficiaryAddress,beneficiaryPostalCode,
 beneficiaryPhone,refundAmount){
	var data={};
	data['userId']=userId;
	data['requestId']=requestId;
	data['sessionUserId']=USER_ID;
	data['themeType']=tt;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student/withdrawn-bank-request'),
		data :JSON.stringify(data),
		dataType : 'html',
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(1, stringMessage[1],'',true);
        			}
        			return false;
        		} else {
        			$('#withdrawn-bank-detail').html(htmlContent)
					$("#accountPersonName").val(accountPersonName);
					$("#accountNumber").val(accountNumber)
					$("#swiftCode").val(swiftCode)
					$("#bankName").val(bankName)
					$("#bankBranchName").val(bankBranchName)
					$("#bankBranchAddress").val(bankBranchAddress)
					$("#streetPostalCode").val(streetPostalCode)
					$("#routeNumber").val(routeNumber)
					$("#beneficiaryAddress").val(beneficiaryAddress)
					$("#beneficiaryPostalCode").val(beneficiaryPostalCode)
					$("#beneficiaryPhone").val(beneficiaryPhone)
					$("#refundAmount").val(refundAmount)
        			return true;
        		}
			}
		}
	});

}

function callForEmailVerificationResend(emailId, moduleId) {
	hideMessage('');
	if(!validateForEmailResend(emailId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','withdrawn-verify-email'),
		data : JSON.stringify(getRequestForEmailVerificationResend(emailId,moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if (data['statusCode'] == '0022') {
					showMessageTheme2(0, data['message'],'',true);
				}else{
					showMessageTheme2(1, data['message'],'',true);
				}
			}else {
				showMessageTheme2(1, data['message'],'',true);
			}
			return false;
		}
	});
}

function validateForEmailResend(emailId){
	//GLOBAL_EMAIL
	if (!validateEmail(emailId)) {
		showMessage(0, 'Email is either empty or invalid');
		return false
	}
	return true;
}

function getRequestForEmailVerificationResend(emailId, moduleId){
	var request = {};
	var authentication = {};
	var requestData = {};
	requestData['requestKey'] = 'EMAIL-RESEND';
	requestData['requestValue'] =emailId;
	authentication['hash'] = getHash();
	authentication['userType'] = moduleId;
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request
}

function showMobileViewSystemTrainingInfo(){
	if($(window).width()>600){
		return;
	}else{
		$("#mobileViewSystemTrainingInfo").modal("show");
	}
}

function saveTeacherTimePreferenceStudent(stepFlag) {
	var redirectUrl = $("#dashboardUrl").val();
	var saveType = $("#saveType").val();
	var enrollmentType = $("#enrollmentType").val();
	var startSemsterStartDate = $('#chooseDateToStartSemster').val();
	if(startSemsterStartDate == undefined || startSemsterStartDate == null || startSemsterStartDate == ''){
		startSemsterStartDate =  $('#semesterStartDateMMM').val();
	}
	hideMessageTheme2('');
	if(saveType=='SKIP' ){
		if ($('#chooseDateToStartSemster').val() == null || $('#chooseDateToStartSemster').val() == '' || $('#chooseDateToStartSemster').val() == undefined) {
			showMessageTheme2(0, "Please choose your academic year start date.", '', true);
			return false;
		}
	}
	else{
		if ($('#chooseDateSystemTrainingDate').val() == undefined || $('#chooseDateSystemTrainingDate').val() == '' || $('#chooseDateSystemTrainingDate').val() == null) {
			showMessageTheme2(0, "Please choose your school system training date.", '', true);
			return false;
		}
	}
	if((saveType=='ORIENT' || saveType=='RESH')){
		if ($(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == null || $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == undefined || $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == '') {
			showMessageTheme2(0, "Please choose your school system training time.", '', true);
			return false;
		}
	}
	$.ajax({
		type:"POST",
		contentType:APPLICATION_JSON_VALUE,
		url:getURLForHTML('report', 'save-time-preference'),
		data:JSON.stringify(getRequestForStudentTimePreference()),
		dataType:'json',
		cache:false,
		timeout:600000,
		success:function(data){
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'], '', true);
				}
			}else{
				if(stepFlag == "academicYear"){
					var academicYearSelectedType = "Y";
					var systemTrainingSelectedType = "Skipped";
					showMessageTheme2(1, data['message'], '', true,10000);
				}else if(stepFlag == "systemtraining"){
					var academicYearSelectedType = "Y";
					var systemTrainingSelectedType = "Y";
					var systemTrainingDate = $("#chooseDateSystemTrainingDate").val();
					var bookStTime = $(".meeting-time input[name='slotTime']:checked").attr("slottime");
					var stdt = systemTrainingDate + " " + bookStTime;
					showMessageTheme2(1, data['message'], '', true);
				}
				// if((enrollmentType =='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_FLEX_COURSE')){
					showContentByStep(academicYearSelectedType, systemTrainingSelectedType, startSemsterStartDate == "" ? $("#chooseDateSystemTrainingDate").val() : startSemsterStartDate, stdt)
				// }else{
				// 	// window.location.href=redirectUrl;
				// 	showContentByStep(academicYearSelectedType, "Skipped", startSemsterStartDate == "" ? $("#chooseDateSystemTrainingDate").val() : startSemsterStartDate, '')
				// }
			}
			return false;
		}
	});
}


function getRequestForStudentTimePreference(){
	var teacherAssign = {};
	var teacherTimeList = [];
	var teacherLeaveDateList =[];
	var teacherAssignTime = {};
	var activeDays=[];
	teacherAssign['userId'] = USER_ID;
	teacherAssign['schoolId']= SCHOOL_ID;
	teacherAssign['slotAddUserId']=USER_ID;
	var callFrom='STUDENT';
	teacherAssign['studentStandardId']=$("#studentStandardId").val();
	teacherAssign['userRole'] = 'STUDENT';
	teacherAssign['saveType'] =$("#saveType").val();
	var startDate=changeDateFormat(new Date($('#chooseDateSystemTrainingDate').val()),"mm-dd-yyyy");
	teacherAssignTime['startDate']=$('#chooseDateSystemTrainingDate').val();
	var enrollmentType = $("#enrollmentType").val();
	if(enrollmentType !='REGISTRATION_FRESH' && enrollmentType !='REGISTRATION_FLEX_COURSE'){
		if($("#saveType").val()=='SKIP'){
			startDate=changeDateFormat(new Date($('#chooseDateToStartSemster').val()),"mm-dd-yyyy");
			teacherAssignTime['startDate']=$('#chooseDateToStartSemster').val();
		}
	}
	teacherAssign['semesterStartDate']=startDate;
	if($("#saveType").val()=='ORIENT'){
		teacherAssignTime['startTime']="09:00:00";
		teacherAssignTime['endTime']="09:00:00";
		teacherTimeList.push(teacherAssignTime);
	}
	
	if($("#saveType").val()=='ORIENT' || $("#saveType").val()=='RESH'){
		var userbookDate = $('#chooseDateSystemTrainingDate').val();
		var bookStTime = $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotsttime");
		var bookEnTime = $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime");
		var duration = $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotduration");
		console.log(bookStTime)
		console.log(bookEnTime)
		teacherAssign['bookDate']=userbookDate;
		teacherAssign['bookStartTime']=bookStTime;
		bookStTime=bookStTime.split(':')
		var fromT = new Date(1990, 1, 1, bookStTime[0], bookStTime[1], 0);
		var timestamp = Date.parse(fromT);
		var dateObject = new Date(timestamp);
		var timeinter = getTimePlusInterval(dateObject,duration);
		var bookEnTime = convertTo24Hour(timeinter);
		teacherAssign['bookEndTime']=bookEnTime+':00';
	}
	
	
	//return false;
	teacherAssign['teacherTimeList']=teacherTimeList;
	
	console.log(teacherAssign);
//return false;
return teacherAssign;
}
function showContentByStep(academicYearSelectedType, systemTrainingSelectedType, startSemsterStartDate, systemTrainingDateTime){
	$("#semesterStartDateLabel").text(startSemsterStartDate+".");
	if(academicYearSelectedType == '' && systemTrainingSelectedType == '' && startSemsterStartDate =='' && systemTrainingDateTime == ''){
		$(".school-system-training-step, .academic-step, .semesterYearDate, .first-line, .seconde-line").hide();
		$(".moveToDashboard-step, .batchAcademicYear").show();
		$(".moveToDashboard-step-heading").text("Academic Year Start Date");
		$("#pageHeading").text("an important reminder");
	}else{
		if(academicYearSelectedType == "N"){
			$("#saveType").val("ORIENT");
			if(($('#enrollmentType').val() !='REGISTRATION_FRESH' && $('#enrollmentType').val() !='REGISTRATION_FLEX_COURSE')){
				$("#saveType").val("SKIP");
				if(systemTrainingSelectedType=='N'){
					$("#saveType").val("ORIENT");
					$(".school-system-training-step").show();
					$(".academic-step, .moveToDashboard-step").hide();
				}else{
					$(".academic-step").show();
					$(".school-system-training-step, .moveToDashboard-step").hide();
				}
			}else{
				$(".school-system-training-step").show();
				$(".academic-step, .moveToDashboard-step").hide();
			}
			
			$("#pageHeading").text("let's set up your dashboard");
			var academicYearBlockDate = $('#academicYearBlockDate').val();
			var daysCount = $('#daysCount').val();
			var daysCountMax = $('#daysCountMax').val();
			var paymentCompletedDate = $("#paymentCompletedDate").val()
			var datesForDisable = academicYearBlockDate.split(',');
			var date = paymentCompletedDate.split("-");
			var startDate = new Date(parseInt(date[2]), parseInt(date[0])-1, parseInt(date[1]));
			var endDate = new Date(parseInt(date[2]), parseInt(date[0])-1, parseInt(date[1]));
			startDate.setDate(startDate.getDate()+parseInt(daysCount));
			endDate.setDate(endDate.getDate()+parseInt(daysCountMax));
			$('#chooseDateToStartSemster').datepicker('destroy').datepicker({
				autoclose: true,
				container: '#datepickerModalView',
				format: 'M dd, yyyy',
				startDate: startDate,
				endDate:endDate,
				beforeShowDay: function (currentDate) {
					var dayNr = currentDate.getDay();
					var dateNr = moment(currentDate.getDate()).format("YYYY-MM-DD");
					if (datesForDisable.length > 0 && datesForDisable !="") {
						for (var i = 0; i < datesForDisable.length; i++) {
							if (moment(currentDate).unix()==moment(datesForDisable[i],'YYYY-MM-DD').unix()){
								return false;
							}
						}
					}
					return true;
				}
			}).on("change", function(){
				$("#datepickerModal").modal("hide");
				$("#chooseAcademicDateBtnToCountinue").removeClass("disabled btn-light");
				$("#chooseAcademicDateBtnToCountinue").addClass("btn-success");
				$("#chooseAcademicDateBtnToCountinue").text("Confirm");
			});
			if(startSemsterStartDate == ""){
				var semesterStartDate = changeDateFormat(new Date(),"mm-dd-yyyy");
			}else{
				var semesterStartDate = changeDateFormat(new Date(startSemsterStartDate),"mm-dd-yyyy");
			}
			var activeNumberOfDaysForSystemTraining = $("#activeNumberOfDaysForSystemTraining").val();
			var semesterStartDate = semesterStartDate.split("-");
			var systrainingStartDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
			var systrainingEndDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
			systrainingEndDate.setDate(systrainingEndDate.getDate()+(activeNumberOfDaysForSystemTraining-1));
			$("#chooseDateSystemTrainingDate").datepicker({
				autoclose:true,
				format: 'M dd, yyyy',
				container: 'div#datepickerModalView',
				// startDate: systrainingStartDate,
				//endDate:systrainingEndDate,
				startDate: startDate,
				endDate:endDate,
				beforeShowDay: function (currentDate) {
					var dayNr = currentDate.getDay();
					var dateNr = moment(currentDate.getDate()).format("YYYY-MM-DD");
					if (datesForDisable.length > 0 && datesForDisable !="") {
						for (var i = 0; i < datesForDisable.length; i++) {
							if (moment(currentDate).unix()==moment(datesForDisable[i],'YYYY-MM-DD').unix()){
								return false;
							}
						}
					}
					return true;
				}
			}).on("change", function(){
				$("#datepickerModal").modal("hide");
				$("#moveToDashboardProcess").text("Choose Slot");
				callOrientationtime();
			});
		}
		else if(academicYearSelectedType == "Y" && (systemTrainingSelectedType == 'Y' || systemTrainingSelectedType == 'Skipped')){
			$(".moveToDashboard-step").show();
			$(".school-system-training-step, .academic-step").hide();
			if(systemTrainingSelectedType!='Skipped'){
				$("#systemTrainingDateAndTimeLabel").text(systemTrainingDateTime);
				$(".batchAcademicYear").hide();
			}else{
				customLoader(false);
				$("#skipSystemTraining").modal("hide");
				$(".first-line, .seconde-line, .batchAcademicYear").hide();
			}
			$("#pageHeading").text("very well done. Let's get started!");
			$("#confirmationAcademicYearModal").modal("hide");
	
		}else{
			$("#confirmationAcademicYearModal").modal("hide");
			$("#pageHeading").text("let's set up your dashboard");
			$("#saveType").val("ORIENT")
			$(".school-system-training-step").show()
			$(".academic-step, .moveToDashboard-step").hide()
			var semesterStartDate = changeDateFormat(new Date(startSemsterStartDate),"mm-dd-yyyy");;
			var activeNumberOfDaysForSystemTraining = $("#activeNumberOfDaysForSystemTraining").val();
			var semesterStartDate = semesterStartDate.split("-");
			var systrainingStartDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
			var systrainingEndDate = new Date(parseInt(semesterStartDate[2]), parseInt(semesterStartDate[0])-1, parseInt(semesterStartDate[1]));
			systrainingEndDate.setDate(systrainingEndDate.getDate()+(activeNumberOfDaysForSystemTraining-1));
			$("#chooseDateSystemTrainingDate").datepicker({
				autoclose:true,
				format: 'M dd, yyyy',
				container: 'div#datepickerModalView',
				startDate: systrainingStartDate,
				endDate:systrainingEndDate,
	
			}).on("change", function(){
				$("#datepickerModal").modal("hide");
				$("#moveToDashboardProcess").text("Choose Slot");
				callOrientationtime();
			});
		}
	}
	
}

function updateAnnouncementAcknowledgeStatus(){
	hideMessageTheme2('');
	var data={};
	var batchStudentMappingId = $("#batchStudentMappingId").val();
	data['batchStudentMappingId']=batchStudentMappingId;
	data['schoolId']=SCHOOL_ID;
	data['userId'] = USER_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','update-announcement-acknowledge-status'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, "Announcement acknowledged.",'',false);
				$('#batchImpAnnouncementModal').modal('hide');
			}
			return false;
		}
	});
	
}


function callForLMSContent(userId,controllType,courseProId,lmsId){
	var data={}
	data['userId']=userId;
	data['controllType']=controllType;
	data['courseProId']=courseProId;
	data['lmsId']=lmsId;
	data['sessionUserId']=USER_ID;
	data['themeType']="theme2";
	$.ajax({
		type : "POST",
		contentType:APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student-lms-content'),
		data : 	JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
        			if(controllType=='ACTIVE' || controllType=='INACTIVE'){
        				if(controllType=='ACTIVE'){
            				$('#lmsuserInactive'+lmsId).show();
            				$('#lmsuserActive'+lmsId).hide();
            			}else if(controllType=='INACTIVE'){
            				$('#lmsuserInactive'+lmsId).hide();
            				$('#lmsuserActive'+lmsId).show();
            			}
        			}else{
        				$('#studentViewEditLMSData').html(htmlContent)
        				if(controllType=='VIEW'){
        					$('#studentLmsContentForm .subjcheck').attr('disabled', true);
        					$("#lmsContentSave").hide();
        					$("#lmsContentAdd").hide();
        					$("#lmsContentAddNewUser").show();
        				}else if(controllType=='EDIT'){
        					$("#lmsContentSave").show();
        					$("#lmsContentAdd").hide();
        					$("#lmsContentAddNewUser").show();
        				}else{
        					$("#lmsContentAddNewUser").hide();
        					$("#lmsContentSave").hide();
        					$("#lmsContentAdd").show();
        				}
        			}
        		}
			}
		}
	});
}


function validateRequestForSaveUserEditedLmsContent(formId,controllType){
	if ($("#"+formId+" #lmsPlatform").val().trim()==undefined || $("#"+formId+" #lmsPlatform").val().trim()=="0") {
		showMessageTheme2(0, 'LMS Platform is required');
		return false;
	}
	if ($("#"+formId+" #fName").val().trim()=='' || $("#"+formId+" #fName").val()==null) {
		showMessageTheme2(0, 'First Name is required');
		return false
	}

	if ($("#"+formId+" #userEmail").val()==null || $("#"+formId+" #userEmail").val().trim()=='') {
		showMessageTheme2(0, 'Email is required');
		return false
	}
	if ($("#"+formId+" #reference").val()==null || $("#"+formId+" #reference").val().trim()=='') {
		showMessageTheme2(0, 'External Id is required');
		return false;
	}
	if ($("#"+formId+" #userData").val()==null || $("#"+formId+" #userData").val().trim()=='') {
		showMessageTheme2(0, 'Description is required');
		return false;
	}
	if(controllType=='ADD'){
		if ($("#"+formId+" #lmsPlatform").val().trim()=="0") {
			showMessageTheme2(0, 'LMS Platform is required');
			return false;
		}
//		if ($("#"+formId+" #lmsUserId").val()==null || $("#"+formId+" #lmsUserId").val().trim()=='') {
//			showMessageTheme2(0, 'LMS User Id is required');
//			return false;
//		}
		if ($("#"+formId+" #password").val()==null || $("#"+formId+" #password").val().trim()=='') {
			showMessageTheme2(0, 'Password is required');
			return false;
		}
		if ($("#"+formId+" #confirmPassword").val()==null || $("#"+formId+" #confirmPassword").val().trim()=='') {
			showMessageTheme2(0, 'Confirm Password is required');
			return false;
		}
		if ($("#"+formId+" #password").val().trim()!= $("#"+formId+" #confirmPassword").val().trim()) {
			showMessageTheme2(0, 'Password and confirm password does not match.');
			return false;
		}
	}
	return true;
}
function saveUserEditedLmsContent(formId, controllType) {

	if(!validateRequestForSaveUserEditedLmsContent(formId,controllType)){
		return false;
	}
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','save-user-edited-lms-content'),
		data : JSON.stringify(getRequestForSaveUserEditedLmsContent(formId,controllType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
//				setTimeout(function(){ $('#studentViewLmsEntryModel').modal('hide'); }, 1000);
    			$("#lmsContentSave").hide();
//				callSemesterStartDateEntry(studentId);
				/*$('#studentSemesterStartDateEntryModel').modal('hide');
				setTimeout(function(){ callDashboardPageSchool('2b','studentTab','','&schoolId='+SCHOOL_ID); }, 1000);*/
			}
			return false;
		}
	});
}
function getRequestForSaveUserEditedLmsContent(formId,controllType){
	var request = {};
	var authentication = {};
	var LMSUserInfoDTO = {};
	LMSUserInfoDTO['controllType']=controllType;
	LMSUserInfoDTO['userId']=$("#"+formId+" #userId").val().trim();
	LMSUserInfoDTO['entityRole']=$("#"+formId+" #entityRole").val().trim();
	LMSUserInfoDTO['firstName']=$("#"+formId+" #fName").val().trim();
	LMSUserInfoDTO['lastName'] = $("#"+formId+" #lName").val().trim();
	LMSUserInfoDTO['reference'] = $("#"+formId+" #reference").val().trim();
	if($("#"+formId+" #lmsPlatform").val().trim()=='Odysseyware'){
		LMSUserInfoDTO['courseProviderId']=2;
	}else if($("#"+formId+" #lmsPlatform").val().trim()=='Agilix Buzz'){
		LMSUserInfoDTO['courseProviderId'] =1;
	}else if($("#"+formId+" #lmsPlatform").val().trim()==='Buzz'){
		LMSUserInfoDTO['courseProviderId'] =31;
	}else if($("#"+formId+" #lmsPlatform").val()==='BUZZ'){
		LMSUserInfoDTO['courseProviderId'] =36;
	}else if($("#"+formId+" #lmsPlatform").val()==='BUZZ-GC'){
		LMSUserInfoDTO['courseProviderId'] =37;
	}else if($("#"+formId+" #lmsPlatform").val()==='BUZZ-GR'){
		LMSUserInfoDTO['courseProviderId'] =38;
	}else if($("#"+formId+" #lmsPlatform").val()==='Exact-Path'){
		LMSUserInfoDTO['courseProviderId'] =39;
	}else if($("#"+formId+" #lmsPlatform").val()==='Edmentum-Canvas'){
		LMSUserInfoDTO['courseProviderId'] =40;
	}else if($("#"+formId+" #lmsPlatform").val()==='Courseware'){
		LMSUserInfoDTO['courseProviderId'] =41;
	}else{
		LMSUserInfoDTO['courseProviderId'] = $("#"+formId+" #lmsPlatform").val().trim();
	}
	LMSUserInfoDTO['lmsRegNumber'] = $("#"+formId+" #lmsUserId").val().trim();
	LMSUserInfoDTO['password'] =($("#"+formId+" #password").val() ==undefined || $("#"+formId+" #password").val() == null || $("#"+formId+" #password").val() == "" ) ?
			$("#"+formId+" #passwordfieldHidden").val().trim() : $("#"+formId+" #password").val().trim() ;
	LMSUserInfoDTO['confirmPassword'] = ($("#"+formId+" #confirmPassword").val() ==undefined || $("#"+formId+" #confirmPassword").val() == null || $("#"+formId+" #confirmPassword").val() == "" ) ?
			$("#"+formId+" #confirmPasswordField").val().trim() : $("#"+formId+" #confirmPassword").val().trim() ;
	LMSUserInfoDTO['lmsId'] = $("#"+formId+" #lmsId").val().trim();
	LMSUserInfoDTO['userData'] = $("#"+formId+" #userData").val().trim();
	LMSUserInfoDTO['email'] = $("#"+formId+" #userEmail").val().trim();
	LMSUserInfoDTO['lmsUserName'] = $("#"+formId+" #lmsUserName").val().trim();
	request['lmsUserInfoDTO'] = LMSUserInfoDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "STUDENT";
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}

function callForBuzzSession(controllType, moduleId,studentStandardId){
	var data={};
	data['controllType']=controllType;
	data['moduleId']=moduleId;
	data['studentStandardId']=studentStandardId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','student-semester-buzz-content'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
				var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessageTheme2(0, stringMessage[1]);
        			}
        		} else {
        			$('#studentSemesterStartDateEntryHTML1').html(htmlContent);
        			$("#sessionSave").show();
        		}
			}
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
		}
	});
}

function changeEnrollmentStatus(rowPosition){
	var subjectStatus = $('#subjectStatus'+rowPosition).val().trim();
	if(subjectStatus=='MOVE'){
		$('#lmsSubjectIdMove'+rowPosition).prop('disabled',false);
	}else{
		$('#lmsSubjectIdMove'+rowPosition).prop('disabled',true);
	}
}

function chooseEnrollmentSubject(rowPosition){
	$('#lmsSubjectIdMove'+rowPosition).val($('#lmsSubjectId'+rowPosition).val());
	var id =$('#lmsSubjectId'+rowPosition).val();
	if(id!=0){
		$.ajax({
		type: "GET",
		url: getURLForHTML('dashboard', 'get-subject-parent-id'),
		data: "id=" + id,
		dataType: 'html',
		success: function(data) {
			var stringMessage = [];
			stringMessage = data.split("|");
			if(stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
    			if(stringMessage[0] == "SESSIONOUT"){
    				showMessageTheme2(0, stringMessage[1]);
    				redirectLoginPage();
    			}else {
    				showMessageTheme2(0, stringMessage[1]);
    			}
    		}  else {
    			if(stringMessage[0] == "SUCCESS"){
    				$('#lmsSubjectParentId'+rowPosition).val('NOT PARENT');
    			}else{
    				showMessageTheme2(0, 'You can not assign a master copy. Please choose a copy course');
    				$('#lmsSubjectParentId'+rowPosition).val('PARENT');
    			}
			}
		},
		error: function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
  }
}


function validateRequestForsaveBuzzSemester(formId){
	hideModalMessage();
	var status = true;
	var mesg = "";
	if ($("#"+formId+" #semesterDateStart").val()==null || $("#"+formId+" #semesterDateStart").val().trim()=='') {
		mesg='Academic Start Date is required';
		status= false;
	}else if ($("#"+formId+" #semesterDateYear").val()==null || $("#"+formId+" #semesterDateYear").val().trim()=='') {
		mesg='Academic Year is required';
		status= false;
	}else if ($("#"+formId+" #weeklyReportFrequency").val()==null || $("#"+formId+" #weeklyReportFrequency").val().trim()=='') {
		mesg='Please select week day';
		status= false;
	}else{
		$('#studentEnrollSemester > tbody  > tr').each(function() {
			var sessionSubjectDTO = {}
			var sessionSubjectId = $(this).attr("id");
			var sessionId = $(this).find(".sessionName option:selected").attr("data-sessionId");//$(this).find(".sessionId").val();
			var sessionName = $(this).find(".sessionName").val();
			var subjectId = $(this).find(".subjectId").val();
			var lmsSubjectId = $(this).find(".lmsSubjectId").val();
			var lmsSubjectStart = $(this).find(".lmsSubjectStart").val();
			var lmsSubjectEnd = $(this).find(".lmsSubjectEnd").val();
			if (lmsSubjectStart==null || lmsSubjectStart=='') {
				mesg='Enrollment start date is required';
				status= false;
			}else if (lmsSubjectEnd==null || lmsSubjectEnd=='') {
				mesg='Enrollment end date is required';
				status= false;
			}
			if(lmsSubjectStart!='' && lmsSubjectEnd!='' ){
				var stDate = lmsSubjectStart.split('-');
				var edDate = lmsSubjectEnd.split('-');
				var startTime = new Date(stDate[2], stDate[0]-1, stDate[1]).getTime();
				var endTime = new Date(edDate[2], edDate[0]-1, edDate[1]).getTime();

				if(startTime > endTime){
					mesg='Enrollment start date must be less than Enrollment end date.';
					status= false;
				}
			}
			var sessionActive = 1;//$(this).find(".sessionActive").val();
			var subjectStatus = $(this).find(".subjectStatus").val();
			if(subjectStatus=='MOVE'){
				subjectStatus='A';
				var lmsSubjectIdMove = $(this).find(".lmsSubjectIdMove").val();
				if(lmsSubjectId != lmsSubjectIdMove){
					lmsSubjectId=lmsSubjectIdMove;
				}
			}
			var subjectStatusDate = $(this).find(".subjectStatusDate").val();
			var lmsSubjectReference = $(this).find(".lmsSubjectReference").val();

			if((subjectId==null || subjectId=="") && $(this).find(".subjectStatus").val()!='W' ){
				mesg='Course Name is required';
				status= false;
				return false;
			}
			else if($(this).find(".parentSubject").val()=='PARENT'){
				mesg='Can not assign master course. Please choose copy course.';
				status= false;
				return false;
			}
		});
	}

	if(!status){
		$('#modalMessageNew').show();
		$('.modal').animate({scrollTop: $('#modalMessageNew').offset().top }, 'slow');
		showMessageTheme2(0, mesg);
		return status;
	}else{
		return status;
	}

//	return status;
}
function saveBuzzSemester(formId, moduleId, studentStandardId) {
	hideModalMessage();
	if(!validateRequestForsaveBuzzSemester(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','save-student-buzz-semester'),
		data : JSON.stringify(getRequestForSaveBuzzSemester(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				showMessageTheme2(1, data['message']);
				setTimeout(function(){ 
					$('#studentBuzzSemesterModel').modal('hide'); 
					$('.modal-backdrop').remove();
					$('body').removeClass('modal-open');
					$('body').css({"padding":"0"});
				}, 800);
				setTimeout(function(){ callForBuzzSession('EDIT', moduleId,studentStandardId); }, 800);
//				$("#sessionAddNew").show();
//    			$("#sessionSave").hide();
//				callSemesterStartDateEntry(studentId);
				/*$('#studentSemesterStartDateEntryModel').modal('hide');
				setTimeout(function(){ callDashboardPageSchool('2b','studentTab','','&schoolId='+SCHOOL_ID); }, 1000);*/
			}
			return false;
		},
		error : function(e) {
			console.log("ERROR : ", e);
		}
	});
}
function getRequestForSaveBuzzSemester(formId){
	var request = {};
	var authentication = {};
	var studentSesssionList=[];
	var studentSesssionDTO = {};
	var sessionSubject=[];
	var subjectList = [];
	var unSubjectList=[];
	studentSesssionDTO['studentUserId']=$("#"+formId+" studentUserId").val();
	studentSesssionDTO['studentStandardId']=$("#"+formId+" #studentStandardId").val().trim();
	studentSesssionDTO['standardId']=$("#"+formId+" #standardId").val().trim();
	studentSesssionDTO['semesterDateStart']=$("#"+formId+" #semesterDateStart").val().trim();
	studentSesssionDTO['frequencyDayId']=$("#"+formId+" #weeklyReportFrequency").val().trim();
	studentSesssionDTO['academicYear']=$("#"+formId+" #semesterDateYear").val().trim();

	studentSesssionDTO['standardId']=$("#"+formId+" #standardId").val().trim();
	studentSesssionDTO['userId']=$("#"+formId+" #userId").val().trim();


	$('#studentEnrollSemester > tbody  > tr').each(function() {
		 var sessionSubjectDTO = {}
		 var sessionSubjectId = $(this).attr("id");
		 var sessionId = $(this).find(".sessionName option:selected").attr("data-sessionId");//$(this).find(".sessionId").val().trim();
		 var sessionName = $(this).find(".sessionName").val().trim();
		 var subjectId = $(this).find(".subjectId").val().trim();
		 var lmsSubjectId = $(this).find(".lmsSubjectId").val().trim();
		 var lmsSubjectStart = $(this).find(".lmsSubjectStart").val().trim();
		 var lmsSubjectEnd = $(this).find(".lmsSubjectEnd").val().trim();
		 var sessionActive = 1;//$(this).find(".sessionActive").val().trim();
		 var subjectStatus = $(this).find(".subjectStatus").val().trim();
		 if(subjectStatus=='MOVE'){
			 subjectStatus='A';
			 var lmsSubjectIdMove = $(this).find(".lmsSubjectIdMove").val().trim();
			 if(lmsSubjectId != lmsSubjectIdMove){
				 lmsSubjectId=lmsSubjectIdMove;
			 }
		 }
		 var subjectStatusDate = $(this).find(".subjectStatusDate").val().trim();
		 var lmsSubjectReference = $(this).find(".lmsSubjectReference").val().trim();

		 sessionSubjectDTO['sessionSubjectId']=sessionSubjectId;
		 sessionSubjectDTO['sessionId']=sessionId;

		 sessionSubjectDTO['sessionName']=sessionName;
		 sessionSubjectDTO['subjectId']=subjectId;
		 if(lmsSubjectId!=0){
			 sessionSubjectDTO['lmsSubjectId']=lmsSubjectId;
		 }
		 sessionSubjectDTO['startDate']=lmsSubjectStart;
		 sessionSubjectDTO['endDate']=lmsSubjectEnd;
		 sessionSubjectDTO['sessionActive']=sessionActive;
		 sessionSubjectDTO['subjectStatus']=subjectStatus;
		 sessionSubjectDTO['statusDate']=subjectStatusDate;
		 sessionSubjectDTO['lmsSubjectReference']= lmsSubjectReference
		 sessionSubject.push(sessionSubjectDTO);
		 if(subjectStatus=='A'){
				subjectList.push(subjectId);
			}else{
				unSubjectList.push(subjectId);
			}

	 });
	 studentSesssionDTO['sessionSubjectDTO'] = sessionSubject
	 studentSesssionDTO['selectedSubjects'] = subjectList.join();
	 studentSesssionDTO['withdrownSubjects'] = unSubjectList.join();
	 studentSesssionDTO['semesterStatus'] =$("#"+formId+" #semesterStatus").val();

	request['studentSesssionDTO'] = studentSesssionDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "STUDENT";
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	//console.log(JSON.stringify(request));

	return request;
}


function validateSubjectSelectionMangaeSession(formId, subjectId){
	var errorStatus = 'Dont Show';
	$('#studentEnrollSemester > tbody  > tr').each(function() {
		var sessionSubjectDTO = {}
		var sessionSubjectId = $(this).attr("id");
		var sessionName = $(this).find(".sessionName").val();
		var subjectIdRow = $(this).find(".subjectId").val();
		if (subjectIdRow==subjectId  && sessionSubjectId!=0) {
			errorStatus = 'Show';
		}
	});
	if(errorStatus=='Show'){
		return false;
	}else{
		return true;
	}

}

function callLmsSubjectBySubject(formId, subjectId, toElementId, toElementIdAlternate, studentSchoolId) {
	hideMessageTheme2('');
	if(subjectId==null || subjectId==""){
		$('#modalMessageNew').show();
		showMessageTheme2(0, 'Course Name is required');
		return false
	}
	if(!validateSubjectSelectionMangaeSession(formId, subjectId)){
		$('.modal').animate({scrollTop: $('#modalMessageNew').offset().top }, 'slow');
		$('#modalMessageNew').show();
		showMessageTheme2(0, 'Course already assigned. Please choose another course.');
		var seq = toElementId.split("Id")[1];
		$('#subjectId'+seq).val('');
		setTimeout(function(){ $('#modalMessageNew').hide(); }, 3000);
		return false;
	}

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster(formId, 'LMS-SUBJECT-LIST', subjectId, studentSchoolId)),
		dataType : 'json',
		async: false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message']);
			} else {
				buildDropdown(data['mastersData']['subject'], $("#"+formId+" #"+toElementId), 'Select course');
				buildDropdown(data['mastersData']['subject'], $("#"+formId+" #"+toElementIdAlternate), 'Select course');
			}
		}
	});
}

