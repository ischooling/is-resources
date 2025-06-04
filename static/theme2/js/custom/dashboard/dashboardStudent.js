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
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#dashboardContentInHTML').html(htmlContent)
        		}
        		return false;
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
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
//			showMessage(true, 'Please select courses for this semester.')
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
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
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
		contentType : "application/json",
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
		},
		error : function(e) {
			//showMessage(true, e.responseText);
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
		contentType : "application/json",
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
		},
		error : function(e) {
			//showMessage(true, e.responseText);
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
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#studentSemesterStartDateEntryHTML').html(htmlContent)
        		}
			}
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
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
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#studentSemesterStartDateEntryHTML1').html(htmlContent)
        		}
			}
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
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
        				showMessage(true, stringMessage[1]);
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
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
		}
	});
}
//function saveSemesterStartDateEntry(studentId){
//	if($('#semesterStartDateA').val().trim()=='' || $('#semesterEndDateA').val().trim()==''){
//		showMessage(true, 'Please choose semester A start and end date');
//		return false;
//	}
//	if($('#semesterAStatus').val().trim()==''){
//		showMessage(true, 'Please choose semester A status');
//		return false;
//	}
//	if($('#semesterStartDateB').val().trim()=='' && $('#semesterEndDateB').val().trim()==''){
//
//	}else{
//		if($('#semesterStartDateB').val().trim()!='' && $('#semesterEndDateB').val().trim()==''){
//			showMessage(true, 'Please choose semester B start and end date');
//			return false;
//		}
//		if($('#semesterStartDateB').val().trim()=='' && $('#semesterEndDateB').val().trim()!=''){
//			showMessage(true, 'Please choose semester B start and end date');
//			return false;
//		}
//		if($('#semesterBStatus').val().trim()==''){
//			showMessage(true, 'Please choose semester B status');
//			return false;
//		}
//	}
//
//	if($('#weeklyReportFrequency').val().trim()==''){
//		showMessage(true, 'Please select week day');
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
//        				showMessage(true, stringMessage[1]);
//        			}
//        		} else {
//        			$('#studentSemesterStartDateEntryModel').modal('hide');
//        			showMessage(true, stringMessage[1]);
//        			setTimeout(function(){
//						hideMessage('');
//						DEFAULT_SEARCH_STATE=true;
//						callDashboardPageSchool('2b','studentTab','','&schoolId='+SCHOOL_ID);
//					}, 3100);
//        		}
//			}
//		},
//		error : function(e) {
//			//showMessage(true, TECHNICAL_GLITCH);
//		}
//	});
//}

function validateRequestForsaveSemesterStartDateEntry1(formId){

	if ($("#"+formId+" #sessionName").val().trim()=='' || $("#"+formId+" #sessionName").val()==null) {
		showModalMessage(true, 'Session Name is required');
		return false
	}

	if ($("#"+formId+" #semesterDateStart").val()==null || $("#"+formId+" #semesterDateStart").val().trim()=='') {
		showModalMessage(true, 'Semester Start Date is required');
		return false
	}
	if ($("#"+formId+" #semesterDateEnd").val()==null || $("#"+formId+" #semesterDateEnd").val().trim()=='') {
		showModalMessage(true, 'Semester End Date is required');
		return false
	}
	if ($("#"+formId+" #weeklyReportFrequency").val()==null || $("#"+formId+" #weeklyReportFrequency").val().trim()=='') {
		showModalMessage(true, 'Please select week day');
		return false;
	}
	if ($("#"+formId+" #semesterStatus").val()==null || $("#"+formId+" #semesterStatus").val().trim()=='') {
		showModalMessage(true, 'Please choose semester  status');
		return false;
	}

	return true;
}
function saveSemesterStartDateEntry1(formId, studentId) {
	if(!validateRequestForsaveSemesterStartDateEntry1(formId)){
		return false;
	}
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','save-student-semester-start-date-entry1'),
		data : JSON.stringify(getRequestForSaveSemesterStartDateEntry1(formId, studentId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showModalMessage(true, data['message']);
			} else {
				showModalMessage(true, data['message']);
				setTimeout(function(){ $('#studentSemesterStartDateEntryModel').modal('hide'); }, 1000);

				$("#sessionAddNew").show();
    			$("#sessionSave").hide();
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
		contentType:"application/json",
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
        				showMessageTheme2(true, stringMessage[1]);
        			}
        		}else if(stringMessage[0] == "SUCCESS"){
        			showMessageTheme2(true, stringMessage[1]);
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

function bookSessionTerm(formId){
	getBookSessionPayment(formId);
}


$(document).on("click","#chkvalBookSession", function(){
	if($("#chkvalBookSession").is(":checked")){
		$("#payTabBookingSessionModal #payBookingSessionTabData").removeAttr("disabled");
	}else{
		$("#payTabBookingSessionModal #payBookingSessionTabData").attr("disabled", true);
	}
});



function applyAddonScholarship(formId, appliedScholarshipCode ){
	hideMessage('');
	if($('#scholarshipCodeInside').length>0){
		if (!validateCharacters($('#scholarshipCodeInside').val().trim())) {
			showMessageTheme2(0, 'Please use the English Keyboard while providing information','',true);
			return false
		}
		if($('#scholarshipCodeInside').val().trim()=='' || $('#scholarshipCodeInside').val().trim()==' '){
			showMessageTheme2(0, "Enter a valid Scholarship code.",'',true);
			return false;
		}
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','apply-addon-scholarship'),
		data : JSON.stringify(getRequestForStudentAddonScholarship(formId, appliedScholarshipCode)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
				return false;
			}else{
				if(appliedScholarshipCode==2){
					$('#'+formId+' #scholarshipCodeInside').val('');
					$('#'+formId+' #scholarshipCode').val('');
					$('#scholarshipCodeInside').val('');
					showMessageTheme2(1, ' Discount code removed successfully ','',true);
				}else{
					showMessageTheme2(1, ' Discount code applied successfully','',true);
				}
				var passData = $('#userIdAddon').val().trim()+'&type=add&bookId=';
				console.log("data to pass ",passData);
				setTimeout(function(){callInneraction('addToCart',passData); },1000);
			}

			return false;
		}
	});
}

function getRequestForStudentAddonScholarship(formId, appliedScholarshipCode){
	var request = {};
	var authentication = {};
	var data = {};
	data['requestKey']='APPLY-SCHOLARSHIP';
	data['scholarshipCode']=$("#scholarshipCodeInside").val().trim();
	data['appliedScholarshipCode']=appliedScholarshipCode;
	data['paymentMode']='annually'
	data['scholarshipFor']='Teacher Assistance';
	authentication['userId'] = $("#userIdAddon").val().trim();
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'STUDENT';
	authentication['schoolId'] = SCHOOL_ID;
	request['authentication'] = authentication;
	request['data'] = data;
	return request;
}


function withdrawnRequest(userId){
	$.ajax({
		type : "GET",
		contentType : "application/json",
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
		contentType : "application/json",
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
		},
		error : function(e) {
			//showMessage(true, e.responseText);
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
		contentType : "application/json",
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
		contentType : "application/json",
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
		contentType : "application/json",
		url : getURLForHTML('dashboard','withdrawn-verify-email'),
		data : JSON.stringify(getRequestForEmailResend(emailId,moduleId)),
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
		},
		error : function(e) {
			//showMessage(1, e.responseText);
			console.log("ERROR : ", e);
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

function getRequestForEmailResend(emailId, moduleId){
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

function redirectLms(e, isPayLmsPaymentPending) {
	if (isPayLmsPaymentPending != null && isPayLmsPaymentPending != "") {
		showMessageTheme2(0, isPayLmsPaymentPending);
		setTimeout(function() {
			$('.switch').find('.switch-input').prop('checked', false);
		}, 600);

	} else {
		var go_to_url = $(e).attr('changeurl');
		var checkedValue = $('.redirectLmsUrl').val()
		if ($('.redirectLmsUrl').is(":checked") == true && checkedValue == "yes") {
			setTimeout(function() {
				$('.switch').find('.switch-input').prop('checked', false);
			}, 600);
			setTimeout(function() {
				if(getSession()){
					window.open(go_to_url, '_blank');
				}else{
					redirectLoginPage();
				}
			}, 500);
		}
	}
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
	if((enrollmentType=='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_FLEX_COURSE') && (saveType=='ORIENT' || saveType=='RESH')){
		if ($(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == null || $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == undefined || $(".viewOrientFreeSlot input[name='slotTime']:checked").attr("slotedtime") == '') {
			showMessageTheme2(0, "Please choose your school system training time.", '', true);
			return false;
		}
	}
	$.ajax({
		type:"POST",
		contentType:"application/json",
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
					var systemTrainingSelectedType = "N";
					showMessageTheme2(1, data['message'], '', true,10000);
				}else if(stepFlag == "systemtraining"){
					var academicYearSelectedType = "Y";
					var systemTrainingSelectedType = "Y";
					var systemTrainingDate = $("#chooseDateSystemTrainingDate").val();
					var bookStTime = $(".meeting-time input[name='slotTime']:checked").attr("slottime");
					var stdt = systemTrainingDate + " " + bookStTime;
					showMessageTheme2(1, data['message'], '', true);
				}
				if((enrollmentType =='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_FLEX_COURSE')){
					showContentByStep(academicYearSelectedType, systemTrainingSelectedType, startSemsterStartDate, stdt)
				}else{
					// window.location.href=redirectUrl;
					showContentByStep(academicYearSelectedType, "Skipped", startSemsterStartDate, '')
				}
			}
			return false;
		},
		error: function (e) {
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
	
	var startDate=changeDateFormat(new Date($('#chooseDateToStartSemster').val()),"mm-dd-yyyy");
	teacherAssignTime['startDate']=$('#chooseDateToStartSemster').val();
	teacherAssign['semesterStartDate']=startDate;
	if($("#saveType").val()=='SKIP'){
		teacherAssignTime['startTime']="09:00:00";
		teacherAssignTime['endTime']="09:00:00";
		teacherTimeList.push(teacherAssignTime);
	}
	var enrollmentType = $("#enrollmentType").val();
	if(enrollmentType=='REGISTRATION_FRESH' || enrollmentType=='REGISTRATION_FLEX_COURSE'){
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
			$("#saveType").val("SKIP")
			$(".academic-step").show()
			$(".school-system-training-step, .moveToDashboard-step").hide();
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
		contentType : "application/json",
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
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
	
}