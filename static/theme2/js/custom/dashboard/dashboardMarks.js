
//ADD PROVIDERID 01-06-2020 BY VIPIN
function addSemesterMarks(formId, userId, studentId, semesterType,standardId,studentStandardId,studentSessionId, providerId) {
	hideMessage('');
	var postData = "userId="+userId+"&studentId="+studentId+"&semesterType="+semesterType+"&standardId="+standardId+"&studentStandardId="+studentStandardId+"&studentSessionId="+studentSessionId+"&providerId="+providerId;
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
	var request = {};
	var marksRepresentDTO = {};
	marksRepresentDTO['submitType']=submitType;
	marksRepresentDTO['schoolId']=SCHOOL_ID;
	marksRepresentDTO['userId']=$('#'+formId+' #userId').val();
	marksRepresentDTO['studentId']=$('#'+formId+' #studentId').val();
	marksRepresentDTO['standardId']=$('#'+formId+' #standardId').val();
	marksRepresentDTO['studentStandardId']=$('#'+formId+' #studentStandardId').val();
	marksRepresentDTO['studentSessionId']=$('#'+formId+' #studentSessionId').val();
	marksRepresentDTO['courseProviderId']=$('#'+formId+' #courseProviderId').val();
	marksRepresentDTO['studentName']=$('#'+formId+' #studentName').val();
	marksRepresentDTO['guardianName']=$('#'+formId+' #parentName').val();
	// var dob = new Date($('#'+formId+' #birthDate').val());
	marksRepresentDTO['dateOfBirth']=$('#'+formId+' #birthDate').val();//changeDateFormat(dob, 'yyyy-mm-dd');
	marksRepresentDTO['gender']=$('#'+formId+' #gender').val();
	marksRepresentDTO['parentGender']=$('#'+formId+' #parentGender').val();
	marksRepresentDTO['nationality']=$('#'+formId+' #nationality').val();
	marksRepresentDTO['programStatus']=$('#'+formId+' #programStatus').val();
	marksRepresentDTO['semSubjectStatus']=semSubjectStatus;
	if($('#'+formId+' #progressionGrade').val()!=''){
		marksRepresentDTO['progressionGrade']=$('#'+formId+' #progressionGrade').val();
	}else{
		marksRepresentDTO['progressionGrade']=parseInt($('#'+formId+' #standardId').val())+1;
	}
	var semesterMarksDTO=[];

	var semesterMarksA={};
		if(editor1!=undefined){
			marksRepresentDTO['marksRemarks']=escapeCharacters(editor1.getData());
		}
//	if(!semSubjectStatus){
		//	marksRepresentDTO['marksRemarks']=$('#'+formId+' #marksRemarks').val();

			marksRepresentDTO['semesterGraduateDateT']=$('#'+formId+' #semesterBGraduateDate').val();
			marksRepresentDTO['semesterIssueDateT']=$('#'+formId+' #semesterBIssueDate').val();
			semesterMarksA['semester']='Semester A';
			if($("#currentSemesterMarks").attr('session_id')!=undefined){
				semesterMarksA['sessionId']= $("#currentSemesterMarks").attr('session_id');
			}else{
				semesterMarksA['sessionId']= $('#'+formId+' #studentSessionId').val();
			}

			var semesterMarks=[];
			$("#currentSemesterMarks tbody tr").each(function() {
				var marksDTO = {};
				marksDTO['courseType']=$(this).find(".courseType").val();
				marksDTO['marksId']=$(this).find(".marksId").val();
				marksDTO['subjectId']=$(this).find(".subjectId").val();
				var percentageObtained = $(this).find(".percentageObtained").val()
				marksDTO['percentageObtained']=$(this).find(".percentageObtained").val();
				marksDTO['courseProgress']=$(this).find(".courseProgress").val();
				marksDTO['gradeObtained']=$(this).find(".gradeCalculated").val();
				marksDTO['gradeCalculated']=$(this).find(".gradeCalculated").text();
				marksDTO['credits']=$(this).find(".credit").text();
				console.log("currentSemesterMarks=> ",$(this).find(".credit").text());
				marksDTO['status']=$(this).find(".status").val();
				marksDTO['gpaCalculated']=$(this).find(".gpaCalculated").text();
				semesterMarks.push(marksDTO);
			});
		semesterMarksA['semesterMarks']=semesterMarks;
		semesterMarksDTO.push(semesterMarksA);

		marksRepresentDTO['cumulativeGpa']=$('#'+formId+' #cumulativeGrade').html();
		marksRepresentDTO['marks']=semesterMarksDTO;
		request['marksRepresentDTO'] = marksRepresentDTO;
		request['sessionUserId'] = USER_ID;
	return request;
}

function saveSemesterMarks(formId, submitType, semSubjectStatus,roleModuleId,roundOfRule){
	$('#transcriptErrMsg').text('');
	var validationType='self';
	var courseProviderId = $('#'+formId+' #courseProviderId').val();
	if(semSubjectStatus=='false'){
	validationType='all';
//		if($('#'+formId+' #semesterBGraduateDate').val()=='' || $('#'+formId+' #semesterBGraduateDate').val()==undefined){
//			$('#transcriptErrMsg').text('Graduated Date is mandatory.');
//			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
//			return false;
//		}
		if($('#'+formId+' #semesterBIssueDate').val()=='' || $('#'+formId+' #semesterBGraduateDate').val()==undefined){
			$('#transcriptErrMsg').text('Date of Issuance is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}

		if($('#marksRemarks').val().length>200){
			$('#transcriptErrMsg').text('Remarks can not more than 200 characters.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			 return false;
		}
		if($('#'+formId+' #programStatus').val()=="" || $('#'+formId+' #programStatus').val()==undefined){
			$('#transcriptErrMsg').text('Please choose program status.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			 return false;
		}
		if($('#'+formId+' #standardId').val()!=3 && $('#'+formId+' #standardId').val()!=9 && $('#'+formId+' #standardId').val()!=10 && !$('#'+formId+' #standardId').val()>=19){
			if($('#'+formId+' #progressionGrade').val()=="" || $('#'+formId+' #progressionGrade').val()==undefined){
				$('#transcriptErrMsg').text('Grade for Progression is mandatory');
				 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
				 return false;
			}
		}
		if($('#'+formId+' #studentName').val()=='' || $('#'+formId+' #studentName').val()==undefined){
			$('#transcriptErrMsg').text('Student Name is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}
		if($('#'+formId+' #parentName').val()=='' || $('#'+formId+' #parentName').val()==undefined){
			$('#transcriptErrMsg').text('Parent Name is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}
		if($('#'+formId+' #gender').val()=='' || $('#'+formId+' #gender').val()==undefined){
			$('#transcriptErrMsg').text('gender is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}
		if($('#'+formId+' #nationality').val()=='' || $('#'+formId+' #nationality').val()==undefined){
			$('#transcriptErrMsg').text('Nationality is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}
		if($('#'+formId+' #birthDate').val()=='' || $('#'+formId+' #birthDate').val()==undefined){
			$('#transcriptErrMsg').text('Date of Birth is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}
		if($('#'+formId+' #parentGender').val()=='' || $('#'+formId+' #parentGender').val()==undefined){
			$('#transcriptErrMsg').text('Parent gender is mandatory.');
			 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			return false;
		}
		getCumulativeGrade();
		validationFlag = validateSemesterMarks('currentSemesterMarks', submitType, validationType, courseProviderId,roundOfRule);
		if(!validationFlag){
			return false;
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
					$('#transcriptErrMsg').text(data['message']);
					 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
				}
			} else {
				$('#transcriptErrMsg').text(data['message']);
				$("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
				setTimeout(function(){hideMessage('');}, 3100);

			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function validateSemesterMarks(tableId, submitType, validationType, courseProviderId,roundOfRule){
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
		// var gradeObtained = $(this).find(".gradeObtained").val();
		var credit= $(this).find(".credit").html();
		// console.log('gradeObtained: '+gradeObtained)
		// if(gradeObtained!=''){
		// 	gradeCount+=1;
		// }else{
		 	if(status=='Incomplete'){
				gradeCount+=1;
			}
		// }
		
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
			var ruleStatus=calculateSemesterPassingRule(tableId, position, true, true, submitType, false, courseProviderId,credit,roundOfRule);
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
//	if(statusCount == percentageCount && statusCount == gradeCount){
//
//	}else{
//		$('#transcriptErrMsg').text('You have missed some relevant data.');
//		$("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
//		return false;
//	}
//
//	if(statusCount==0){
//		$('#transcriptErrMsg').text('You can not withdraw all courses!');
//		 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
//		return false;
//	}
//	if(validEntryCount==0){
//		$('#transcriptErrMsg').text('Please provide grades for atleast one course.');
//		 $("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top}, 800);
//		return false;
//	}
	return calculatePassingRuleStatus;
}
//submitType==1 save & confirm
//submitType==2 save
function calculateSemesterPassingRule(tableId, position, errorWaring, errorMessage, submitType, needToCalCumuGrade, courseProviderId, credit,roundOfRule){
	var standardId =$('#studentSemesterMarksForm #standardId').val();
	console.log("needToCalCumuGrade=>",needToCalCumuGrade);
	$('#transcriptErrMsg').text('');
	console.log('calculateSemesterPassingRule position: '+position);
	$('#'+tableId+' #tr-'+position).removeClass('tr-red');
	var courseType = $('#'+tableId+' #courseType-'+position).val();
	var marksId = $('#'+tableId+' #marksId-'+position).val();
	var subjectId = $('#'+tableId+' #subjectId-'+position).val();
	var percentageObtained = $('#'+tableId+' #percentageObtained-'+position).val();
	var courseProgress = $('#'+tableId+' #courseProgress-'+position).val();
	var duration = $('#'+tableId+' #percentageObtained-'+position).attr("data-duration");
	// var gradeObtained = $('#'+tableId+' #gradeObtained-'+position +' option:selected').val();
	var gradeCalculated = $('#'+tableId+' #gradeCalculated-'+position).html();
	var credit = credit;
	var status = $('#'+tableId+' #status-'+position +' option:selected').val();
	var checkCondition=true;
	var validationFlag=true;
	console.log("credit=> ", credit);
	console.log("duration=> ", duration);

	if(standardId>3 && standardId<11){
		if(percentageObtained>=50 & percentageObtained<59.5){
			$('#'+tableId+' #tr-'+position).addClass('tr-yellow1');
		}else{
			$('#'+tableId+' #tr-'+position).removeClass('tr-yellow1');
		}
	}
	if(status=='Withdrawn' || status=='Incomplete'){
		checkCondition=false;
	}else{
		if(percentageObtained==''){
			if(submitType==2){
				checkCondition=false;
			}
		}
	}
	
	
	if(checkCondition){
		if (percentageObtained==''){
			validationFlag=false;
			if(errorMessage){
				$('#transcriptErrMsg').text('Percentage scored cannot be blank');
				$("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			}
		}else if (parseFloat(percentageObtained) < 0 ){
			validationFlag=false;
			if(errorMessage){
				$('#transcriptErrMsg').text('Percentage scored cannot be less than 0');
				$("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			}
		}else if (parseFloat(percentageObtained)>110){
			validationFlag=false;
			if(errorMessage){
				$('#transcriptErrMsg').text('Percentage scored cannot be more than 100');
				$("body,html").animate({scrollTop: $("#transcriptErrMsg").offset().top - 70}, 800);
			}
		}
	}
	if(status!='Incomplete'){
		 getSemesterGrade(tableId, courseType, percentageObtained, position, courseProviderId, duration,credit,status, courseProgress,roundOfRule);
	}
	if(courseProgress<100){
		$('#'+tableId+' #status-'+position).val('Incomplete');
		$('#'+tableId+' #credit-'+position).html('0.0');
		$('#'+tableId+' #gpaCalculated-'+position).html('0.0');
		$('#'+tableId+' #gradeCalculated-'+position).html('I');
	}else{
		$('#'+tableId+' #status-'+position).val('Completed');
		status = 'Completed';
		if(!$('#'+tableId+' #courseProgress-'+position).prop('disabled')){
			credit = $('#'+tableId+' #subjectCredit-'+position).html();
		}
		$('#'+tableId+' #credit-'+position).html(credit);
		getSemesterGrade(tableId, courseType, percentageObtained, position, courseProviderId, duration,credit,status, courseProgress,roundOfRule);
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

function getRemarks(){
	
	customLoader(true);
	var cgpaRemarks = parseFloat($('#cumulativeGrade').html()).toFixed(2);
	var standardId =$('#studentSemesterMarksForm #standardId').val();
	var ProgressionGrade = $('#studentSemesterMarksForm #progressionGrade').val();
	
	var remarks = editor1.getData();
	var ProgressionGradeNm = $('#studentSemesterMarksForm #progressionGrade option:selected').text().replace('GRADE','Grade');
	var updateGrade=true;
	var failstatus = false;
	$("#currentSemesterMarks tbody tr").each(function() {
		var grade = $(this).find(".gradeCalculated").html();
		if(grade=='F' || grade=='I' || grade=='W'){
			failstatus = true;
			updateGrade=false;
		}
	});
	if(standardId==7){
		$('#studentSemesterMarksForm #progressionGrade').val(standardId);
		ProgressionGradeNm = $('#studentSemesterMarksForm #progressionGrade option:selected').text().replace('GRADE','Grade');
		if(failstatus){
			if(cgpaRemarks<1.05){
				editor1.setData('Credit Requirement - Incomplete <br/><br/> Needs to Repeat '+ProgressionGradeNm);
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.05){
				editor1.setData('Academic Performance - Needs Improvement <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.55){
				editor1.setData('Academic Performance - Satisfactory <br/><br/>  Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.05){
				editor1.setData('Academic Performance - Good <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.55){
				editor1.setData('Academic Performance - Very Good <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.99){
				editor1.setData('Academic Performance - Excellent <br/><br/>  Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else {
				editor1.setData('Academic Performance - Outstanding <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}
		}else{

			if(cgpaRemarks<1.05){
				editor1.setData('Credit Requirement - Incomplete <br/><br/> Needs to Repeat '+ProgressionGradeNm);
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.05){
				editor1.setData('Academic Performance - Needs Improvement <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.55){
				editor1.setData('Academic Performance - Satisfactory <br/><br/>  Credit Requirement - Complete ');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.05){
				editor1.setData('Academic Performance - Good <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.55){
				editor1.setData('Academic Performance - Very Good <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.99){
				editor1.setData('Academic Performance - Excellent <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else {
				editor1.setData('Academic Performance - Outstanding <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}
		}

	}else if(standardId<7 || (standardId>=11 && standardId<=17) ){
		if(cgpaRemarks<1.05){
			$('#studentSemesterMarksForm #progressionGrade').val(ProgressionGrade - 1);
			if(ProgressionGrade == standardId){
				$('#studentSemesterMarksForm #progressionGrade').val(standardId);
				var pGNew = $('#studentSemesterMarksForm #progressionGrade option:selected').text().split(' ');
				ProgressionGradeNm=pGNew[0].replace('GRADE','Grade')+' '+ ++pGNew[1];
				editor1.setData('Not Eligible for '+ProgressionGradeNm);
			}else{
				editor1.setData('Not Eligible for '+ProgressionGradeNm);
			}
			editor1.execute( 'alignment', { value: 'center' } );
			$('#studentSemesterMarksForm #progressionGrade').val(standardId);
		}else {
			if(updateGrade){
				if(standardId==ProgressionGrade){
					if(standardId==16){
						$('#studentSemesterMarksForm #progressionGrade').val(1);
					}else{
						$('#studentSemesterMarksForm #progressionGrade').val(++ProgressionGrade);
					}
					ProgressionGradeNm = $('#studentSemesterMarksForm #progressionGrade option:selected').text().replace('GRADE','Grade');
				}
			}else{
				if(standardId!=ProgressionGrade){
					$('#studentSemesterMarksForm #progressionGrade').val(standardId);
					var pGNew = $('#studentSemesterMarksForm #progressionGrade option:selected').text().split(' ');
					ProgressionGradeNm=pGNew[0].replace('GRADE','Grade')+' '+ ++pGNew[1];
	
				}else{
					var pGNew = $('#studentSemesterMarksForm #progressionGrade option:selected').text().split(' ');
					ProgressionGradeNm=pGNew[0].replace('GRADE','Grade')+' '+ ++pGNew[1];
				}
			}
			
			if(failstatus){
				if(cgpaRemarks<=2.05){
					editor1.setData('Academic Performance - Needs Improvement <br/> <br/> Credit Requirement - Incomplete <br/><br/> Not Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=2.55){
					editor1.setData('Academic Performance - Satisfactory <br/><br/>  Credit Requirement - Incomplete <br/> <br/> Not Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=3.05){
					editor1.setData('Academic Performance - Good <br/> <br/> Credit Requirement - Incomplete <br/> <br/> Not Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=3.55){
					editor1.setData('Academic Performance - Very Good <br/> <br/> Credit Requirement - Incomplete <br/><br/>  Not Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=3.99){
					editor1.setData('Academic Performance - Excellent <br/><br/>  Credit Requirement - Incomplete <br/> <br/> Not Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else {
					editor1.setData('Academic Performance - Outstanding <br/> <br/> Credit Requirement - Incomplete <br/><br/>  Not Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}
			}else{
				if(cgpaRemarks<=2.05){
					editor1.setData('Academic Performance - Needs Improvement <br/><br/>  Credit Requirement - Complete <br/> <br/> Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=2.55){
					editor1.setData('Academic Performance - Satisfactory <br/><br/>  Credit Requirement - Complete <br/><br/>  Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=3.05){
					editor1.setData('Academic Performance - Good <br/><br/>  Credit Requirement - Complete <br/><br/> Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=3.55){
					editor1.setData('Academic Performance - Very Good <br/><br/>  Credit Requirement - Complete <br/><br/>  Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else if(cgpaRemarks<=3.99){
					editor1.setData('Academic Performance - Excellent <br/><br/>  Credit Requirement - Complete <br/><br/>  Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}else {
					editor1.setData('Academic Performance - Outstanding <br/><br/>  Credit Requirement - Complete <br/><br/>  Eligible for '+ProgressionGradeNm);
					editor1.execute( 'alignment', { value: 'center' } );
				}
			}
		}
	}else if(standardId==19 || standardId==9 || standardId==10 || standardId==20 || standardId==21){
		$('#studentSemesterMarksForm #progressionGrade').val('');
		if(failstatus){
			if(cgpaRemarks<1.05){
				editor1.setData('Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.05){
				editor1.setData('Academic Performance - Needs Improvement <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.55){
				editor1.setData('Academic Performance - Satisfactory <br/><br/>  Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.05){
				editor1.setData('Academic Performance - Good <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.55){
				editor1.setData('Academic Performance - Very Good <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.99){
				editor1.setData('Academic Performance - Excellent <br/><br/>  Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else {
				editor1.setData('Academic Performance - Outstanding <br/> <br/> Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}
		}else{

			if(cgpaRemarks<1.05){
				editor1.setData('Credit Requirement - Incomplete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.05){
				editor1.setData('Academic Performance - Needs Improvement <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=2.55){
				editor1.setData('Academic Performance - Satisfactory <br/><br/>  Credit Requirement - Complete ');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.05){
				editor1.setData('Academic Performance - Good <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.55){
				editor1.setData('Academic Performance - Very Good <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else if(cgpaRemarks<=3.99){
				editor1.setData('Academic Performance - Excellent <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}else {
				editor1.setData('Academic Performance - Outstanding <br/><br/>  Credit Requirement - Complete');
				editor1.execute( 'alignment', { value: 'center' } );
			}
		}

	}
	customLoader(false);
}

//gradeType = 1 :: FULL-TIME-SUBJECT
//gradeType = 2 :: CREDIT-RECOVERY-SUBJECT
//gradeType = 3 :: Honors Course
function getSemesterGrade(tableId, courseType, percentage, position, courseProviderId, duration,subjectCredit, status, courseProgress,roundOfRule) {
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
		if(roundOfRule==2){
			percentage = Math.round(percentage);
			console.log('Round off percentge :: ',percentage)
		}
		//apply condition here
		if(courseType == 'FT' || courseType == 'CR'|| courseType == 'CTE'){
			if(percentage>100){
				grade = "A+";
				gpa = 4.00 * subjectCredit;
			}else if(percentage>=95.1){
				grade = "A+";
				gpa = 4.00 * subjectCredit;
			}else if(percentage>=92.1){
				grade = "A";
				gpa = 4.00 * subjectCredit;
			}else if(percentage>=88.1){
				grade = "A-";
				gpa = 3.70 * subjectCredit;
			}else if(percentage>=85.1){
				grade = "B+";
				gpa = 3.30 * subjectCredit;
			}else if(percentage>=82.1){
				grade = "B";
				gpa = 3.00 * subjectCredit;
			}else if(percentage>=78.1){
				grade = "B-";
				gpa = 2.70 * subjectCredit;
			}else if(percentage>=75.1){
				grade = "C+";
				gpa = 2.30 * subjectCredit;
			}else if(percentage>=72.1){
				grade = "C";
				gpa = 2.00 * subjectCredit;
			}else if(percentage>=68.1){
				grade = "C-";
				gpa = 1.70 * subjectCredit;
			}else if(percentage>=65.1){
				grade = "D+";
				gpa = 1.30 * subjectCredit;
			}else if(percentage>=62.1){
				grade = "D";
				gpa = 1.00 * subjectCredit;
			}else if(percentage>=59.1){
				grade = "D-";
				gpa = 0.70 * subjectCredit;
			}else{
				grade = "F";
				gpa = "0.00";
			}
		}else if(courseType == 'AP'){
			if(percentage>100){
				grade = "A+";
				gpa = 5.00 * subjectCredit;
			}else if(percentage>=95.1){
				grade = "A+";
				gpa = 5.00 * subjectCredit;
			}else if(percentage>=92.1){
				grade = "A";
				gpa = 5.00 * subjectCredit;
			}else if(percentage>=88.1){
				grade = "A-";
				gpa = 4.70 * subjectCredit;
			}else if(percentage>=85.1){
				grade = "B+";
				gpa = 4.30 * subjectCredit;
			}else if(percentage>=82.1){
				grade = "B";
				gpa = 4.00 * subjectCredit;
			}else if(percentage>=78.1){
				grade = "B-";
				gpa = 3.70 * subjectCredit;
			}else if(percentage>=75.1){
				grade = "C+";
				gpa = 3.30 * subjectCredit;
			}else if(percentage>=72.1){
				grade = "C";
				gpa = 3.00 * subjectCredit;
			}else if(percentage>=68.1){
				grade = "C-";
				gpa = 2.70 * subjectCredit;
			}else if(percentage>=65.1){
				grade = "D+";
				gpa = 2.30 * subjectCredit;
			}else if(percentage>=62.1){
				grade = "D";
				gpa = 2.00 * subjectCredit;
			}else if(percentage>=59.1){
				grade = "D-";
				gpa = 1.70 * subjectCredit;
			}else{
				grade = "F";
				gpa = 1.00 * subjectCredit;
			}
		}else if(courseType == 'HON' || courseType == 'ADV'){
			if(percentage>100){
				grade = "A+";
				gpa = 4.50 * subjectCredit;
			}else if(percentage>=95.1){
				grade = "A+";
				gpa = 4.50 * subjectCredit;
			}else if(percentage>=92.1){
				grade = "A";
				gpa = 4.50 * subjectCredit;
			}else if(percentage>=88.1){
				grade = "A-";
				gpa = 4.20 * subjectCredit;
			}else if(percentage>=85.1){
				grade = "B+";
				gpa = 3.80 * subjectCredit;
			}else if(percentage>=82.1){
				grade = "B";
				gpa = 3.50 * subjectCredit;
			}else if(percentage>=78.1){
				grade = "B-";
				gpa = 3.20 * subjectCredit;
			}else if(percentage>=75.1){
				grade = "C+";
				gpa = 2.80 * subjectCredit;
			}else if(percentage>=72.1){
				grade = "C";
				gpa = 2.50 * subjectCredit;
			}else if(percentage>=68.1){
				grade = "C-";
				gpa = 2.20 * subjectCredit;
			}else if(percentage>=65.1){
				grade = "D+";
				gpa = 1.80 * subjectCredit;
			}else if(percentage>=62.1){
				grade = "D";
				gpa = 1.50 * subjectCredit;
			}else if(percentage>=59.1){
				grade = "D-";
				gpa = 1.20 * subjectCredit;
			}else{
				grade = "F";
				gpa = 0.5 * subjectCredit;
			}
		}
	}
	$('#'+tableId+' #gradeCalculated-'+position).html(grade);
	$('#'+tableId+' #gpaCalculated-'+position).html(parseFloat(gpa).toFixed(2));
	if(grade=='F'){
		$('#'+tableId+' #credit-'+position).html('0.0');
	}else{
		if(courseProviderId==2 || courseProviderId==31 || courseProviderId==36 || courseProviderId==37 || courseProviderId==38){
			$('#'+tableId+' #credit-'+position).html(subjectCredit);
		}
	}
	return grade;
}

function getCumulativeGrade(){
	var cumulativeGpa=0.0;
	var sumPreCgpa=0.0;
	var standardId = $('#studentSemesterMarksForm #standardId').val();
	var noOfCourse=0;
	var currentSubjectId=0;
	var cgpaSubjectCreditStaus = $('#cgpaSubjectCreditStaus').val();
	var needTocalculatePrevious =true;
	if(cgpaSubjectCreditStaus=='Apply'){
		$("#currentSemesterMarks tbody tr").each(function() {
			currentSubjectId =$(this).find(".subjectId").val();
			if($(this).find(".status").val()=='Completed' || $(this).find(".status").val()=='Incomplete' ){
				cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
				console.log('currentSemesterMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
				noOfCourse = parseFloat( parseFloat(noOfCourse)+ parseFloat($(this).find(".subjectCredit").text().trim()) );
			}else if($(this).find(".status").val()=='Repeated'){
				cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
				console.log('currentSemesterMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
				noOfCourse = parseFloat( parseFloat(noOfCourse)+ parseFloat($(this).find(".subjectCredit").text().trim()) );
			}
			if($('#studentSemesterMarksForm #showPrevMarks').val() == 'show'){
				if(needTocalculatePrevious) {
					$("#prevSemesterMarks tbody tr").each(function() {
						var preSubjectId=$(this).find(".subjectId").val();
						if(preSubjectId!=currentSubjectId){
							cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
							console.log('currentSemesterMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
							if($(this).find(".credit").text().trim()!='-'){
								noOfCourse = parseFloat( parseFloat(noOfCourse)+ parseFloat($(this).find(".credit").text().trim()) );
							}
						}
						preSubjectId=0;
					});
					needTocalculatePrevious=false;
				}
			}
			currentSubjectId=0;
		});
	}else{
		$("#currentSemesterMarks tbody tr").each(function() {
			currentSubjectId =$(this).find(".subjectId").val();
			if($(this).find(".status").val()=='Completed' || $(this).find(".status").val()=='Incomplete' ){
				cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
				console.log('currentSemesterMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
				noOfCourse = parseFloat( parseFloat(noOfCourse)+ parseFloat($(this).find(".credit").text().trim()) );
			}else if($(this).find(".status").val()=='Repeated'){
				cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
				console.log('currentSemesterMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
				noOfCourse = parseFloat( parseFloat(noOfCourse)+ parseFloat($(this).find(".credit").text().trim()) );
			}
			if($('#studentSemesterMarksForm #showPrevMarks').val() == 'show'){
				$("#prevSemesterMarks tbody tr").each(function() {
					var preSubjectId=$(this).find(".subjectId").val();
					if(preSubjectId!=currentSubjectId){
						cumulativeGpa = parseFloat( parseFloat(cumulativeGpa)+ parseFloat($(this).find(".gpaCalculated").text().trim()) );
						console.log('currentSemesterMarks cumulativeGpa '+cumulativeGpa + ' = '+$(this).find(".gpaCalculated").text().trim())
						noOfCourse = parseFloat( parseFloat(noOfCourse)+ parseFloat($(this).find(".credit").text().trim()) );
					}
					preSubjectId=0;
				});
			}
			currentSubjectId=0;
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
	if(standardId==16 || standardId==3 || standardId==7){
		if(cumulativeGpa!=0){
			var currentGpa = parseFloat(cumulativeGpa/noOfCourse).toFixed(2);
			 sumPreCgpa = $('#studentSemesterMarksForm #cumulativeGpaForPreGrade').val();
			var avgCgpa = parseFloat(sumPreCgpa)+ parseFloat(currentGpa);
			console.log("avg Cgpa", avgCgpa);
			if(standardId==16){
				$('#avgCumulativeGrade').html(parseFloat(avgCgpa/5).toFixed(2));
			}else if(standardId==3){
				$('#avgCumulativeGrade').html(parseFloat(avgCgpa/3).toFixed(2));
			}else if(standardId==7){
				$('#avgCumulativeGrade').html(parseFloat(avgCgpa/4).toFixed(2));
			}else{

			}

		}
	}
}
function publishSemesterMarks(studentId, standardId, studentStandardId){
	$('#publishSemestermarks').attr('disabled','disabled');
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

function checkStatus(tableId, position, courseProviderId, subjectCredit){
	console.log("checkStatus=> ", courseProviderId);
	var credit = parseFloat(subjectCredit).toFixed(1);
	console.log("nmsacmcbmdnc dcnmdc",credit);
	if($('#'+tableId+' #status-'+position).val()=='Incomplete'){
		$('#'+tableId+' #tr-'+position).removeClass('tr-red');
		// $('#'+tableId+' #gradeObtained-'+position).val('');
		// $('#'+tableId+' #gradeObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #percentageObtained-'+position).val('');
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #gradeCalculated-'+position).html('I');
		$('#'+tableId+' #credit-'+position).html('0.00');
		$('#'+tableId+' #gpaCalculated-'+position).html('0.00');
	}else if($('#'+tableId+' #status-'+position).val()=='Withdrawn'){
		$('#'+tableId+' #tr-'+position).removeClass('tr-red');
		// $('#'+tableId+' #gradeObtained-'+position).val('');
		// $('#'+tableId+' #gradeObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #percentageObtained-'+position).val('');
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', true);
		$('#'+tableId+' #gradeCalculated-'+position).html('W');
		$('#'+tableId+' #credit-'+position).html('-');
		$('#'+tableId+' #gpaCalculated-'+position).html('0.00');
	}else if($('#'+tableId+' #status-'+position).val()=='Repeated'){
		// $('#'+tableId+' #gradeObtained-'+position).prop('disabled', false);
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', false);
		//$('#'+tableId+' #gradeCalculated-'+position).html('');
		$('#'+tableId+' #credit-'+position).html(credit);

	}else{
		// $('#'+tableId+' #gradeObtained-'+position).prop('disabled', false);
		$('#'+tableId+' #percentageObtained-'+position).prop('disabled', false);
		//$('#'+tableId+' #gradeCalculated-'+position).html('');
		if(credit==0.5){
			$('#'+tableId+' #credit-'+position).html(parseFloat(credit));
		}else{
			$('#'+tableId+' #credit-'+position).html(parseFloat(credit)+".0");
		}
	}
	getCumulativeGrade();
}
function checkObtainedGrade(tableId, position){
	if($('#'+tableId+' #gradeObtained-'+position).val()!=''){
		$('#'+tableId+' #tr-'+position).removeClass('tr-red');
	}
}

function submitPreSemesterMark(formId,moduleId) {
	hideMessage('');
	if(!validateRequestForPreSemesterMark(formId,moduleId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','pre-grade-submit'),
		data : JSON.stringify(getRequestForPreSemesterMark(formId, moduleId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'],'', false);
			} else {
				showMessageTheme2(1, data['message'],'', false);
				$('#'+formId)[0].reset();
				location.reload();
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			return false;
		}
	});
}

function getRequestForPreSemesterMark(formId,moduleId){
	var request = {};
	var authentication = {};
	var marksRepresentDTO = {};
	marksRepresentDTO['schoolId'] = $("#"+formId+" #schoolId").val();
	marksRepresentDTO['studentStandardId'] = $("#"+formId+" #studentStandardId").val();
	marksRepresentDTO['studentId'] = $("#"+formId+" #studentId").val();

	marksRepresentDTO['standardId'] = $("#"+formId+" #standardId").val();
	marksRepresentDTO['gradeCalculated'] = $("#"+formId+" #gradeCalculated").val();
	marksRepresentDTO['gpaCalculated'] = $("#"+formId+" #gpaCalculated").val();
	marksRepresentDTO['preMarksId']  = $("#"+formId+" #marksPreGradeId").val();
	request['marksRepresentDTO'] = marksRepresentDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	request['authentication'] = authentication;
	return request;
}

function validateRequestForPreSemesterMark(formId){
	var standardId = $("#"+formId+" #standardId").val();
	var gradeCalculated = $("#"+formId+" #gradeCalculated").val();
	var gpaCalculated = $("#"+formId+" #gpaCalculated").val();
	if(standardId==''){
		showMessageTheme2(0, 'Please select grade','', false);
		return false;
	}
	if(gradeCalculated==''){
		showMessageTheme2(0, 'Please select grade Calculated','', false);
		return false;
	}

	if(gpaCalculated==''){
		showMessageTheme2(0, 'Please enter gpa','', false);
		return false;
	}


	return true;
}

function removePreGrade(preGradeId){
		hideMessage('');
		if(preGradeId==''){
			return false;
		}
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard','remove-pre-grade-marks'),
			data : JSON.stringify(getRequestForRemovePreGrade(preGradeId)),
			dataType : 'json',
			cache : false,
			//timeout : 600000,
				success : function(data) {
					if (data['status'] == '0' || data['status'] == '2') {
						showMessageTheme2(0, data['message'],'', false);
					} else {
						showMessageTheme2(1, data['message'],'', false);
						location.reload();
					}
					return false;
			},
			error : function(e) {
				//showMessage(true, e.responseText);
			}
		});
	}


	function getRequestForRemovePreGrade(preGradeId){
		var request = {};
		var authentication = {};
		var requestData = {};
		var marksRepresentDTO = {}
		marksRepresentDTO['preMarksId'] = preGradeId;
		requestData['marksRepresentDTO'] = marksRepresentDTO;
		authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
		authentication['userType'] = moduleId;
		authentication['userId'] = $("#userId").val();
		request['authentication'] = authentication;
		request['requestData'] = requestData;
		return request;
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