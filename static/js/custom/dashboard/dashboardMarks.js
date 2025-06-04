//ADD PROVIDERID 01-06-2020 BY VIPIN
function addSemesterMarks(formId, userId, studentId, semesterType,standardId,studentStandardId,studentSessionId, providerId,roleModuleId) {
	hideMessage('');
	var postData = "userId="+userId+"&studentId="+studentId+"&semesterType="+semesterType+"&standardId="+standardId+"&studentStandardId="+studentStandardId+"&studentSessionId="+studentSessionId+"&providerId="+providerId+"&moduleId="+roleModuleId;
	$.ajax({
		type : "GET",
		url : getURLForHTML('dashboard','get-semester-marks'),
		data : postData,
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else {
        				showMessage(true, stringMessage[1]);
        			}
        		} else {
        			$('#semesterMarksUploadContents').html(htmlContent);
        		}
        		return false;
			}
		},
		error : function(e) {
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function requestForSaveSemesterData(formId, submitType, courseProviderId, semSubjectStatus){
	var request={};
	var marksRepresentDTO = {};
	marksRepresentDTO['submitType']=submitType;
	marksRepresentDTO['schoolId']=SCHOOL_ID;
	marksRepresentDTO['userId']=$('#'+formId+' #userId').val();
	marksRepresentDTO['studentId']=$('#'+formId+' #studentId').val();
	marksRepresentDTO['standardId']=$('#'+formId+' #standardId').val();
	marksRepresentDTO['studentStandardId']=$('#'+formId+' #studentStandardId').val();
	marksRepresentDTO['studentSessionId']=$('#'+formId+' #studentSessionId').val();
	marksRepresentDTO['courseProviderId']=$('#'+formId+' #courseProviderId').val();
	marksRepresentDTO['semSubjectStatus']=semSubjectStatus;
	var semesterMarksDTO=[];

	var semesterMarksA={};
		if(editor1!=undefined){
			marksRepresentDTO['marksRemarks']=escapeCharacters(editor1.getData());
		}
//	if(!semSubjectStatus){
		//	marksRepresentDTO['marksRemarks']=$('#'+formId+' #marksRemarks').val();
			if(semesterType=='SEMESTERA'){
				marksRepresentDTO['semesterGraduateDateT']=$('#'+formId+' #semesterAGraduateDate').val();
				marksRepresentDTO['semesterIssueDateT']=$('#'+formId+' #semesterAIssueDate').val();
			}
			if(semesterType=='SEMESTERB'){
				marksRepresentDTO['semesterGraduateDateT']=$('#'+formId+' #semesterBGraduateDate').val();
				marksRepresentDTO['semesterIssueDateT']=$('#'+formId+' #semesterBIssueDate').val();
			}

			semesterMarksA['semester']='Semester A';
			if($("#currentSemesterAMarks").attr('session_id')!=undefined){
				semesterMarksA['sessionId']= $("#currentSemesterAMarks").attr('session_id');
			}else{
				semesterMarksA['sessionId']= $('#'+formId+' #studentSessionId').val();
			}

			var semesterMarks=[];
			$("#currentSemesterAMarks tbody tr").each(function() {
				var marksDTO = {};
				marksDTO['courseType']=$(this).find(".courseType").val();
				marksDTO['marksId']=$(this).find(".marksId").val();
				marksDTO['subjectId']=$(this).find(".subjectId").val();
				var percentageObtained = $(this).find(".percentageObtained").val()
				marksDTO['percentageObtained']=$(this).find(".percentageObtained").val();
				marksDTO['gradeObtained']=$(this).find(".gradeObtained").val();
				marksDTO['gradeCalculated']=$(this).find(".gradeCalculated").text();
				marksDTO['credits']=$(this).find(".credit").text();
				console.log("currentSemesterAMarks=> ",$(this).find(".credit").text());
				marksDTO['status']=$(this).find(".status").val();
				marksDTO['gpaCalculated']=$(this).find(".gpaCalculated").text();
				semesterMarks.push(marksDTO);
			});
			semesterMarksA['semesterMarks']=semesterMarks;
			semesterMarksDTO.push(semesterMarksA);

			if(semesterType=='SEMESTERB'){
				var semesterMarksB={};
				semesterMarksB['semester']='Semester B';
				semesterMarksB['sessionId']= $("#currentSemesterBMarks").attr('session_id');
				var semesterMarks=[];
				$("#currentSemesterBMarks tbody tr").each(function() {
					var marksDTO = {};
					marksDTO['courseType']=$(this).find(".courseType").val();
					marksDTO['marksId']=$(this).find(".marksId").val();
					marksDTO['subjectId']=$(this).find(".subjectId").val();
					marksDTO['percentageObtained']=$(this).find(".percentageObtained").val();
					marksDTO['gradeObtained']=$(this).find(".gradeObtained").val();
					marksDTO['gradeCalculated']=$(this).find(".gradeCalculated").text();
					marksDTO['credits']=$(this).find(".credit").text();
					console.log("currentSemesterBMarks=> ",$(this).find(".credit").text());
					marksDTO['status']=$(this).find(".status").val();
					marksDTO['gpaCalculated']=$(this).find(".gpaCalculated").text();
					semesterMarks.push(marksDTO);
				});
				semesterMarksB['semesterMarks']=semesterMarks;
				semesterMarksDTO.push(semesterMarksB);
			}
		marksRepresentDTO['cumulativeGPA']=$('#cumulativeGrade').html();
//	}
	marksRepresentDTO['marks']=semesterMarksDTO;
	request['marksRepresentDTO'] = marksRepresentDTO;
	request['sessionUserId'] = USER_ID;
	return request;
}

function saveSemesterMarks(formId, submitType, semSubjectStatus,roleModuleId){
	var validationType='self';
	var courseProviderId = $('#'+formId+' #courseProviderId').val();
	if(semSubjectStatus=='false'){
		if(submitType==1){
			validationType='all';
			if(semesterType=='SEMESTERA'){
				if($('#'+formId+' #semesterAGraduateDate').val()==''){
					showMessage(true, 'Graduated Date is mandatory.');
					return false;
				}
				if($('#'+formId+' #semesterAIssueDate').val()=='' || $('#'+formId+' #semesterAIssueDate').val()==undefined){
					showMessage(true, 'Date of Issuance is mandatory.');
					return false;
				}
			}
			if(semesterType=='SEMESTERB'){
				if($('#'+formId+' #semesterBGraduateDate').val()=='' || $('#'+formId+' #semesterBGraduateDate').val()==undefined){
					showMessage(true, 'Graduated Date is mandatory.');
					return false;
				}
				if($('#'+formId+' #semesterBIssueDate').val()=='' || $('#'+formId+' #semesterBGraduateDate').val()==undefined){
					showMessage(true, 'Date of Issuance is mandatory.');
					return false;
				}
			}
		}
		if($('#marksRemarks').val().length>200){
			showMessage(true, 'Remarks can not more than 200 characters.');
		}
		getCumulativeGrade();
		if(semesterType=="SEMESTERA"){
			var validationFlag = validateSemesterMarks('currentSemesterAMarks', submitType, validationType, courseProviderId);
			if(!validationFlag){
				return false;
			}
		}
		if(semesterType=="SEMESTERB"){
			validationFlag = validateSemesterMarks('currentSemesterBMarks', submitType, validationType, courseProviderId);
			if(!validationFlag){
				return false;
			}
		}
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','save-semester-marks'),
		data : JSON.stringify(requestForSaveSemesterData(formId, submitType, courseProviderId, semSubjectStatus)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['status'] == '2'){
					redirectLoginPage();
				}else{
					showMessage(true, data['message']);
				}
			} else {
				showMessage(true, data['message']);
				$('#semesterMarksUploadModule').modal('hide');
				setTimeout(function(){
					hideMessage('');
					//callDashboardPageSchool(roleModuleId,'student-transcript')
				}, 3100);
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function validateSemesterMarks(tableId, submitType, validationType, courseProviderId){
	console.log('validateSemesterMarks :: '+tableId);
	var returnStatus=true;
	var position=1;
	var gradeCount=0;
	var statusCount=0;
	var percentageCount=0;
	var calculatePassingRuleStatus=true;
	var validEntryCount=0;
	$("#"+tableId+ " tbody tr").each(function() {
		$(this).removeClass('tr-red');
		var status = $(this).find(".status").val();
		var gradeObtained = $(this).find(".gradeObtained").val();
		console.log('gradeObtained: '+gradeObtained)
		if(gradeObtained!=''){
			gradeCount+=1;
		}else{
			if(status=='Incomplete'){
				gradeCount+=1;
			}
		}
		var percentageObtained = $(this).find(".percentageObtained").val();
		if(percentageObtained!=''){
			percentageCount+=1;
		}else{
			if(status=='Incomplete'){
				percentageCount+=1;
			}
		}
		if(status=='Completed' || status=='Repeated' || status=='Incomplete'){
			statusCount+=1;
			var ruleStatus=calculateSemesterPassingRule(tableId, position, true, true, submitType, false, courseProviderId);
			console.log('ruleStatus :: '+ruleStatus);
			if(ruleStatus){
				validEntryCount+=1;
			}
			if(!ruleStatus){
				if(calculatePassingRuleStatus){
					calculatePassingRuleStatus = false;
				}
			}
		}
		position++;
	});
	if(validationType=='all'){
		if(statusCount == percentageCount && statusCount == gradeCount){

		}else{
			showMessage(true, 'You have missed some relevant data.');
			return false;
		}
	}
	if(statusCount==0){
		showMessage(true, 'You can not withdraw all courses!');
		return false;
	}
	if(validEntryCount==0){
		showMessage(true, 'Please provide grades for atleast one course.');
		return false;
	}
	return calculatePassingRuleStatus;
}
//submitType==1 save & confirm
//submitType==2 save
function calculateSemesterPassingRule(tableId, position, errorWaring, errorMessage, submitType, needToCalCumuGrade, courseProviderId){
	console.log('calculateSemesterPassingRule position: '+position);
	console.log('data credit',$('#'+tableId+' #percentageObtained-'+position).attr("data-credit"));
	$('#'+tableId+' #tr-'+position).removeClass('tr-red');
	var courseType = $('#'+tableId+' #courseType-'+position).val();
	var marksId = $('#'+tableId+' #marksId-'+position).val();
	var subjectId = $('#'+tableId+' #subjectId-'+position).val();
	var percentageObtained = $('#'+tableId+' #percentageObtained-'+position).val();
	var duration = $('#'+tableId+' #percentageObtained-'+position).attr("data-duration");
	var subjectCredit = $('#'+tableId+' #percentageObtained-'+position).attr("data-credit");
	var gradeObtained = $('#'+tableId+' #gradeObtained-'+position +' option:selected').val();
	var gradeCalculated = $('#'+tableId+' #gradeCalculated-'+position).html();
	var credit = $('#'+tableId+' #credit-'+position).html();
	var status = $('#'+tableId+' #status-'+position +' option:selected').val();
	var checkCondition=true;
	var validationFlag=true;
	console.log("credit=> ", credit);
	console.log("duration=> ", duration);
	if(status=='Withdrawn' || status=='Incomplete'){
		checkCondition=false;
	}else{
		if(percentageObtained=='' && gradeObtained=='' ){
			if(submitType==2){
				checkCondition=false;
			}
		}
	}
	if(checkCondition){
		if (percentageObtained==''){
			validationFlag=false;
			if(errorMessage){
				showMessage(true, 'Percentage scored cannot be blank');
			}
		}else if (parseFloat(percentageObtained) < 0 ){
			validationFlag=false;
			if(errorMessage){
				showMessage(true, 'Percentage scored cannot be less than 0');
			}
		}else if (parseFloat(percentageObtained)>100){
			validationFlag=false;
			if(errorMessage){
				showMessage(true, 'Percentage scored cannot be more than 100');
			}
		}
		if(gradeObtained==''){
			validationFlag=false;
			if(errorMessage){
				showMessage(true, 'Please select LMS grade');
			}
		}
	}
	if(status!='Incomplete'){
		getSemesterGrade(tableId, courseType, percentageObtained, position, courseProviderId, duration,subjectCredit, status);
	}
	if(needToCalCumuGrade){
		getCumulativeGrade();
	}
	if(!validationFlag){
		if(errorWaring){
			$('#'+tableId+' #tr-'+position).addClass('tr-red');
		}
	}
	return validationFlag;
}

//gradeType = 1 :: FULL-TIME-SUBJECT
//gradeType = 2 :: CREDIT-RECOVERY-SUBJECT
//gradeType = 3 :: Honors Course
function getSemesterGrade(tableId, courseType, percentage, position, courseProviderId, duration,subjectCredit, status) {
	console.log("getSemesterGrade=> ", courseProviderId);
	console.log("getSemesterGrade duration=> ", duration);
	var gpa = "0.00";
	var grade = "F";
	if(status=='Incomplete'){
		grade = "I";
	}else if(status=='-'){
		grade = "F";
	}else{
		console.log('getSemesterGrade: courseType: '+ courseType+ ' percentage: '+percentage+' position: '+position);
		//apply condition here
		if(courseType == 'FT' || courseType == 'CR' || courseType == 'ADV' || courseType == 'CTE'){
			if(percentage>100){
				grade = "F";
				gpa = "0.00";
			}else if(percentage>=96){
				grade = "A+";
				gpa = "4.00";
			}else if(percentage>=93){
				grade = "A";
				gpa = "4.00";
			}else if(percentage>=89){
				grade = "A-";
				gpa = "3.70";
			}else if(percentage>=86){
				grade = "B+";
				gpa = "3.30";
			}else if(percentage>=83){
				grade = "B";
				gpa = "3.00";
			}else if(percentage>=79){
				grade = "B-";
				gpa = "2.70";
			}else if(percentage>=76){
				grade = "C+";
				gpa = "2.30";
			}else if(percentage>=73){
				grade = "C";
				gpa = "2.00";
			}else if(percentage>=69){
				grade = "C-";
				gpa = "1.70";
			}else if(percentage>=66){
				grade = "D+";
				gpa = "1.30";
			}else if(percentage>=63){
				grade = "D";
				gpa = "1.00";
			}else if(percentage>=60){
				grade = "D-";
				gpa = "0.70";
			}else{
				grade = "F";
				gpa = "0.00";
			}
		}else if(courseType == 'AP'){
			if(percentage>100){
				grade = "F";
				gpa = "1.00";
			}else if(percentage>=96){
				grade = "A+";
				gpa = "5.00";
			}else if(percentage>=93){
				grade = "A";
				gpa = "5.00";
			}else if(percentage>=89){
				grade = "A-";
				gpa = "4.70";
			}else if(percentage>=86){
				grade = "B+";
				gpa = "4.30";
			}else if(percentage>=83){
				grade = "B";
				gpa = "4.00";
			}else if(percentage>=79){
				grade = "B-";
				gpa = "3.70";
			}else if(percentage>=76){
				grade = "C+";
				gpa = "3.30";
			}else if(percentage>=73){
				grade = "C";
				gpa = "3.00";
			}else if(percentage>=69){
				grade = "C-";
				gpa = "2.70";
			}else if(percentage>=66){
				grade = "D+";
				gpa = "2.30";
			}else if(percentage>=63){
				grade = "D";
				gpa = "2.00";
			}else if(percentage>=60){
				grade = "D-";
				gpa = "1.70";
			}else{
				grade = "F";
				gpa = "1.00";
			}
		}else if(courseType == 'HON'){
			if(percentage>100){
				grade = "F";
			}else if(percentage>=95.1){
				grade = "A+";
			}else if(percentage>=92.1){
				grade = "A";
			}else if(percentage>=88.1){
				grade = "A-";
			}else if(percentage>=85.1){
				grade = "B+";
			}else if(percentage>=82.1){
				grade = "B";
			}else if(percentage>=78.1){
				grade = "B-";
			}else if(percentage>=75.1){
				grade = "C+";
			}else if(percentage>=72.1){
				grade = "C";
			}else if(percentage>=68.1){
				grade = "C-";
			}else if(percentage>=65.1){
				grade = "D+";
			}else if(percentage>=62.1){
				grade = "D";
			}else if(percentage>=59.1){
				grade = "D-";
			}else{
				grade = "F";
			}
		}
	}

	$('#'+tableId+' #gradeCalculated-'+position).html(grade);
	$('#'+tableId+' #gpaCalculated-'+position).html(parseFloat(gpa).toFixed(2));
//	if(grade=='F'){
//		$('#'+tableId+' #credit-'+position).html('0.0');
//	}else{
		if(courseProviderId==2 || courseProviderId==31|| courseProviderId==36 || courseProviderId==37 || courseProviderId==38){
			$('#'+tableId+' #credit-'+position).html(subjectCredit);
		}else{
			$('#'+tableId+' #credit-'+position).html('0.5');
		}
//	}
	return grade;
}

function getCumulativeGrade(){
	var cumulativeGpa=0.0;
	var noOfCourse=0;
	$("#currentSemesterAMarks tbody tr").each(function() {
		if($(this).find(".status").val()=='Completed'){
			cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
			console.log('currentSemesterAMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
			noOfCourse+=1;
		}else if($(this).find(".status").val()=='Repeated'){
			cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
			console.log('currentSemesterAMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
			noOfCourse+=1;
		}
	});
	if($('#currentSemesterBMarks')){
		$("#currentSemesterBMarks tbody tr").each(function() {
			if($(this).find(".status").val()=='Completed'){
				cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
				console.log('currentSemesterBMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
				noOfCourse+=1;
			}else if($(this).find(".status").val()=='Repeated'){
				cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
				console.log('currentSemesterBMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
				noOfCourse+=1;
			}
		});
	}
	if(cumulativeGpa==0 && noOfCourse==0){
		$('#cumulativeGrade').html('0.00');
	}else{
		var cumulativeGrade = Math.round(parseFloat(cumulativeGpa/noOfCourse)*Math.pow(10,3))/Math.pow(10,3);
		console.log('final noOfCourse '+noOfCourse +', cumulativeGpa '+cumulativeGpa+', cumulativeGrade '+cumulativeGrade)
		cumulativeGrade = Math.round(parseFloat(cumulativeGrade)*Math.pow(10,2))/Math.pow(10,2);
		$('#cumulativeGrade').html(parseFloat(cumulativeGrade).toFixed(2));
	}
}
function publishSemesterMarks(studentId, standardId, studentStandardId){
	$('#publishSemestermarks').attr('disabled','disabled');
	var showTranscriptToStudent =$('#showTranscriptToStudent').val();
	if($('#showTranscriptToStudent').val()==undefined || $('#showTranscriptToStudent').val()==null) {
		showTranscriptToStudent='Y';
	}
	var data={};
	data['studentId']=studentId;
	data['standardId']=standardId;
	data['studentStandardId']=studentStandardId;
	data['showTranscriptToStudent']=showTranscriptToStudent;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','publish-student-semester-transcript'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			alert("Student Transcript has been published on student dashboard");
			$('#publishSemestermarks').hide();
		},
		error : function(e) {
			$('#sendSWPR').removeAttr('disabled','disabled');
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}

function saveShowTranscriptToStudent(studentId, standardId, studentStandardId, saveType){
	var showTranscriptToStudent = $('#showTranscriptToStudent').val();
	var progressionGrade = $('#progressionGrade').val();
	var data={};
	data['studentId']=studentId;
	data['standardId']=standardId;
	data['studentStandardId']=studentStandardId;
	data['showTranscriptToStudent']=showTranscriptToStudent;
	data['progressionGrade']=progressionGrade;
	data['saveType']=saveType;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType:"application/json",
		url : getURLForHTML('dashboard','save-show-student-transcript'),
		data : JSON.stringify(data),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(saveType==3) {
				$('#showTranscriptUploadMessage').show();
				setTimeout(function(){
					$('#showTranscriptUploadMessage').hide();
					//callDashboardPageSchool(roleModuleId,'student-transcript')
				}, 3000);
			}else {

				$('#showTranscriptToStudentMessage').show();
				setTimeout(function(){
					$('#showTranscriptToStudentMessage').hide();
					//callDashboardPageSchool(roleModuleId,'student-transcript')
				}, 3000);
			}

		},
		error : function(e) {
			$('#sendSWPR').removeAttr('disabled','disabled');
			//showMessage(true, TECHNICAL_GLITCH);
			return false;
		}
	});
}


function checkStatus(tableId, position, courseProviderId){
	console.log("checkStatus=> ", courseProviderId);
	if($('#'+tableId+' #status-'+position).val()=='Incomplete'){
		$('#'+tableId+' #tr-'+position).removeClass('tr-red');
		$('#'+tableId+' #gradeObtained-'+position).val('');
		$('#'+tableId+' #gradeObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #percentageObtained-'+position).val('');
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #gradeCalculated-'+position).html('I');
		$('#'+tableId+' #credit-'+position).html('0.00');
		$('#'+tableId+' #gpaCalculated-'+position).html('0.00');
	}else if($('#'+tableId+' #status-'+position).val()=='Withdrawn'){
		$('#'+tableId+' #tr-'+position).removeClass('tr-red');
		$('#'+tableId+' #gradeObtained-'+position).val('');
		$('#'+tableId+' #gradeObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #percentageObtained-'+position).val('');
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #gradeCalculated-'+position).html('W');
		$('#'+tableId+' #credit-'+position).html('-');
		$('#'+tableId+' #gpaCalculated-'+position).html('0.00');
	}else if($('#'+tableId+' #status-'+position).val()=='Repeated'){
		$('#'+tableId+' #gradeObtained-'+position).prop('disabled', false);
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', false);
		//$('#'+tableId+' #gradeCalculated-'+position).html('');
		if(courseProviderId==2){
			$('#'+tableId+' #credit-'+position).html('1.0');
		}else{
			$('#'+tableId+' #credit-'+position).html('0.5');
		}
	}else{
		$('#'+tableId+' #gradeObtained-'+position).prop('disabled', false);
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', false);
		//$('#'+tableId+' #gradeCalculated-'+position).html('');
		if(courseProviderId==2){
			$('#'+tableId+' #credit-'+position).html('1.0');
		}else{
			$('#'+tableId+' #credit-'+position).html('0.5');
		}

	}
	getCumulativeGrade();
}
function checkObtainedGrade(tableId, position){
	if($('#'+tableId+' #gradeObtained-'+position).val()!=''){
		$('#'+tableId+' #tr-'+position).removeClass('tr-red');
	}
}

function callForBackStageTranscript(studentStandardId) {
	
	if (studentStandardId == null || studentStandardId == undefined || studentStandardId == '') {
		return false;
	}
	var data={};
	data['studentStandardId']=studentStandardId;
	data['UNIQUEUUID']=UNIQUEUUID;
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','go-backstage-transcript'),
		data : JSON.stringify(data),
		contentType : "application/json",
		dataType : 'html',
		success : function(htmlContent) {
			if (htmlContent != "") {
				var obj = JSON.parse(htmlContent);
				if (obj.statusResponse.status == "FAILED"
						|| obj.statusResponse.status == "EXCEPTION"
						|| obj.statusResponse.status == "SESSIONOUT") {
					if(obj.statusResponse.status == "SESSIONOUT"){
						redirectLoginPage();
					}else {
						setTimeout(function(){$('#backStageTranscriptMessageDiv').show();
						$('#backStageTranscriptMessage').html(obj.statusResponse.message);}, 3000);
					}
				}else if(obj.statusResponse.status == "SUCCESS"){
					setTimeout(function(){$('#backStageTranscriptMessageDiv').show();
					$('#backStageTranscriptMessage').html(obj.statusResponse.message);}, 3000);
				}
				return false;
			}
		},
		error : function(e) {
			console.log(true, e.responseText);
		}
	});
}