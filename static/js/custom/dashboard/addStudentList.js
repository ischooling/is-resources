/*$('#prevGrade').change(function(){
	 $("#subHide").hide();
	if($("#prevGrade").val() !=null  && $("#prevGrade").val()!=0 ){
		$("#subHide").show();
     callSubjectsByGrade('addStudent',$("#currentGrade").val(),'currentGrade');
	}else{
		$("#subHide").hide();
	}
	
});*/
function validateRequestForAddStudent(formId){
	
	
	if (!validateFormAscii(formId)) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	if (!validateFormAscii('tbl_gen_marks_pre tbody tr')) {
		showMessage(false, 'Please use the English Keyboard while providing information');
		return false
	}
	
	
	if ($("#"+formId+" #studentFirstName").val().trim()=='' || $("#"+formId+" #studentFirstName").val()==null) {
		showMessage(false, 'Student Name is required');
		return false
	}
	
	if ($("#"+formId+" #fatherFirstName").val().trim()=='' || $("#"+formId+" #fatherFirstName").val()==null) {
		showMessage(false, 'Father Name is required');
		return false
	}
	if ($("#"+formId+" #fatherLastName").val().trim()=='' || $("#"+formId+" #fatherLastName").val()==null) {
		showMessage(false, 'Father Last Name is required');
		return false
	}
	if ($("#"+formId+" #motherFirstName").val().trim()=='' || $("#"+formId+" #motherFirstName").val()==null) {
		showMessage(false, 'Mother Name is required');
		return false
	}
	if ($("#"+formId+" #motherLastName").val().trim()=='' || $("#"+formId+" #motherLastName").val()==null) {
		showMessage(false, 'Mother Last Name is required');
		return false
	}
	if($("#"+formId+" #gender").val().trim()=='0' || $("#"+formId+" #gender").val()==null) {
		showMessage(false,'Gender is required');
		return false
	}
	if($("#"+formId+" #dob").val().trim()=='' || $("#"+formId+" #dob").val()==null) {
		showMessage(false,'DOB is required');
		return false
	}
	if($('#currentGrade option:selected').index()==0){
		showMessage(false,'Grade must be selected');
		return false
	}
	var imageName =$('#fileupload1').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg']) == -1){
			showMessage(true, 'Please upload Student Passport Size Photo in following formats (jpg, jpeg or png).');
			return false
		}
	}
	return true;
}	
function callForAddStudentDetails(formId) {
	console.log('validateDuplicateSubjects: '+validateDuplicateSubjects());
	if(!validateDuplicateSubjects()){
		customLoader(false);
		return false;
	}
	hideMessage('');
	$.ajax({
		type : "POST",
		url : getURLForHTML('dashboard','save-student-details'),
		data : encodeURI("request="+JSON.stringify(getRequestForAddStudentDetails(formId))),
		dataType : 'html',
		cache : false,
		timeout : 600000,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		console.log('stringMessage: '+stringMessage);
            	if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT" ){
        			//redirectLoginPage();
            		showMessage(true, stringMessage[1]);
        		}else{
        			showMessage(true, stringMessage[1]);
        			$('#form-modal').modal('hide');
        			$('#studentFirstName').val('');
        			$('#studentMiddleName').val('');
        			$('#studentLastName').val('');
        			$('#fatherFirstName').val('');
        			$('#fatherMiddleName').val('');
        			$('#fatherLastName').val('');
        			$('#motherFirstName').val('');
        			$('#motherMiddleName').val('');
        			$('#motherLastName').val('');
        			$('#gender').val("0");
        			$('#disablityTypes').val('');
        			$('#currentGrade').val('0');
        			$("#disablityTypes").hide();
        			$("#subHide").hide();
        			$('#passportPhoto').val('');
        			$('#dob').val('');
        			$("#fileupload1").parents(".file-tab").find("span.fileName").text('');
        			$("#fileupload2").parents(".file-tab").find("span.fileName").text('');
        			$('#fileupload6').parents(".file-tab").find("span.fileName").text('');
        			$('#fileupload4').parents(".file-tab").find("span.fileName").text('');
        			$('#fileupload5').parents(".file-tab").find("span.fileName").text('');
        			$('#subject').hide('');
        			
        			
        			var dashboardFor=$('#dashboardFor').val().trim();
        			if(dashboardFor!='' && dashboardFor!=undefined && dashboardFor!='SCHOOL_ADMIN'){
        				setTimeout(function(){ callDashboardPageSchoolB2B('3a'); }, 1000);
        				$('html, body').animate({scrollTop: $('#divStudentBucketList').offset().top -100 }, 'slow');
        			}else{
        				setTimeout(function(){ callDashboardPageSchool('21a1'); }, 1000);
        			}
        		}
    			return false;
			}
			customLoader(false);
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			//customLoader(false);
			return false;
		}
	});
	
}
function callForAddStudentModal(formId) {
	customLoader(true);
	if(!validateRequestForAddStudent(formId)){
		customLoader(false);
		return false;
	}	
	if(!validateCurrSubjectDetails()){ //validation for Current Subject
		customLoader(false);
		return false;
	}
	
	var flag=validateMarks('tbl_gen_marks_pre');
	if(!flag){
		customLoader(false);
		$('#callPreviousSubMarksModal').modal('show');
		//showMessage(true, "Previous Record subjects is not valid.");
		return false;
	}
	$('#form-modal').modal({backdrop: 'static', keyboard: false}) 
	customLoader(false);
}
function getRequestForAddStudentDetails(formId){
	var request = {};
	var authentication = {};
	var requestData = {};
	var addStudentListDTO = {};
	var studentPreQualficationDTO = {};
	var studentPrevGenerateMarksDTO = {};
	addStudentListDTO['id'] = $("#studentId").val().trim();
	addStudentListDTO['schoolId'] = $("#schoolId").val().trim();
	addStudentListDTO['studentFirstName'] = escapeCharacters($("#"+formId+" #studentFirstName").val().trim());
	addStudentListDTO['studentMiddleName'] = escapeCharacters($("#"+formId+" #studentMiddleName").val().trim());
	addStudentListDTO['studentLastName'] = escapeCharacters($("#"+formId+" #studentLastName").val().trim());
	addStudentListDTO['fatherFirstName'] = escapeCharacters($("#"+formId+" #fatherFirstName").val().trim());
	addStudentListDTO['fatherMiddleName'] = escapeCharacters($("#"+formId+" #fatherMiddleName").val().trim());
	addStudentListDTO['fatherLastName'] = escapeCharacters($("#"+formId+" #fatherLastName").val().trim());
	addStudentListDTO['motherFirstName'] = escapeCharacters($("#"+formId+" #motherFirstName").val().trim());
	addStudentListDTO['motherMiddleName'] = escapeCharacters($("#"+formId+" #motherMiddleName").val().trim());
	addStudentListDTO['motherLastName'] = escapeCharacters($("#"+formId+" #motherLastName").val().trim());
	addStudentListDTO['gender'] = $("#"+formId+" #gender").val().trim();
	
	var imageName =$('#fileupload1').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg']) == -1){
			showMessage(true, 'Please upload Student Sign in following formats (jpg, jpeg or png).');
			//return false
		}else{
			addStudentListDTO['passportPhoto'] = imageName;
		}
	}
	var imageName =$('#fileupload2').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg','pdf']) == -1){
	
		}else{
			addStudentListDTO['birthCertificate'] = imageName;
		}
	}
	var imageName =$('#fileupload6').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg','pdf']) == -1){
	
		}else{
			addStudentListDTO['addressProof'] = imageName;
		}
	}
	var imageName =$('#fileupload4').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg','pdf']) == -1){
	
		}else{
			addStudentListDTO['immunizationCard'] = imageName;
		}
	}
	var imageName =$('#fileupload5').parent('span').parent('p').parent('div').find('span.fileName').html();
	if(imageName!='' && imageName!=undefined ){
		if ($.inArray($.trim(imageName.split('.').pop().toLowerCase()), ['gif','png','jpg','jpeg','pdf']) == -1){
	
		}else{
			addStudentListDTO['academicProof'] = imageName;
		}
	}
	
	addStudentListDTO['currentGrade'] = $("#"+formId+" #currentGrade").val().trim();
//	if($('#currentsubject11').val()!='null' && $('#currentsubject11').val()!=null && $('#currentsubject11').val()!=''){
//		var value = decodeURIComponent($('#currentsubject11').val());
//	}
	addStudentListDTO['currentSubjectId'] = calculateCurrentSubjects();
	addStudentListDTO['dob'] = $("#"+formId+" #dob").val().trim();
	addStudentListDTO['disablity']=$("input[name='isDisablity']:checked"). val().trim();
	addStudentListDTO['disablityType'] = escapeCharacters($("#"+formId+" #disablityType").val().trim());
	addStudentListDTO['isFromSameSchool'] = $("input[name='isFromSameSchool']:checked"). val().trim();
	
	//addStudentListDTO['courseType'] = $("#"+formId+" #courseType").val().trim();
//	addStudentListDTO['paymentStatus'] = $("#"+formId+" #paymentStatus").val().trim();
	var studentPrevQualificationMarksDTO={};
	studentPrevQualificationMarksDTO['studentPrevGenerateMarksDTO'] = calculatePreviousMarks();
	addStudentListDTO['prevQualificationData'] = JSON.stringify(studentPrevQualificationMarksDTO);

	requestData['addStudentListDTO'] = addStudentListDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	authentication['userId'] = $("#"+formId+" #userId").val().trim();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function calculatePreviousMarks(){
	var previousMarksDTO = [];
	var studentPrevGenerateMarksDTO=[];
	$("#tbl_gen_marks_pre tbody tr").each(function() {
		var prevMarksDTO = {};
		if($(this).find("select.subjectId option:selected").val().trim()>0){
			prevMarksDTO['practicalMarks'] = $(this).find("input.e_p_marks").val().trim();
			prevMarksDTO['theoryMarks'] = $(this).find("input.e_t_marks").val().trim();
			prevMarksDTO['marksCount'] = $(this).find("span.marks-count").text();
			prevMarksDTO['subjectId'] = $(this).find("select.subjectId option:selected").val().trim();
			prevMarksDTO['subjectName'] = $(this).find("select.subjectId option:selected").attr('subNameAttr');
			
			prevMarksDTO['maxTheoryMarks']=$(this).find("span.maxTheoryMarks").text();
			prevMarksDTO['theoryPassingMarks']=$(this).find("span.theoryPassingMarks").text();
			prevMarksDTO['maxPracticalMarks']=$(this).find("span.maxPracMarks").text();
			prevMarksDTO['practicalPassingMarks']=$(this).find("span.pracPassigMarks").text();
			var maxMarks = $(this).find("input.sub_maxid").val();
			if(maxMarks!=''){
				prevMarksDTO['maxMarks'] = parseInt(maxMarks);
			}else{
				prevMarksDTO['maxMarks'] = '0';
			}
			prevMarksDTO['grade'] = $(this).find("span.grade").text();
			console.log('grade::: :'+prevMarksDTO['grade']);
			prevMarksDTO['cumulativeGrade'] = escapeCharacters($(this).find("input.credit").val().trim());
			prevMarksDTO['preSubResult'] = $(this).find("span.result").text();
		}
		previousMarksDTO.push(prevMarksDTO);
	});
	
	return previousMarksDTO;
}
function validateDuplicateSubjects(){
	var status=true;
	var subjectsArray = [];
	$("#tbl_gen_marks_pre tbody tr").each(function() {
		var subjectId = {};
		subjectId = $(this).find("select.subjectId option:selected").val();
		if(subjectId!=0){
			subjectsArray.push(subjectId);
		}
	});
	console.log('sorted: '+subjectsArray.sort());
	
	var duplicateSubjectsArray = subjectsArray.sort();
	for(var i=0;i<subjectsArray.length-1;i++){
		if(subjectsArray[i+1]==subjectsArray[i]){
			showMessage(true, 'Two Subjects can not be same');
			status=false;
			return status;
		}
	}
	return status;
}
$("#exampleRadios1").click(function(){
	$("#disablityTypes").show();

});
$("#exampleRadios2").click(function(){
	$("#disablityTypes").hide();

});
$("#isFromSameSchool1").click(function(){
	$("#isFromSameSchool").show();

});
$("#isFromSameSchool2").click(function(){
	$("#isFromSameSchool").hide();

});

function callMandSubjects(formId, value, elementId) {
	hideMessage('');
	if (!validateRequestForMaster(formId, elementId)) {
		$("#"+formId+" #currentsubject11").val().trim(0);
		resetDropdown($("#"+formId+" #currentsubject11"), 'Select course');
		return false;
	}
	$("#"+formId+" #currentsubject11").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'COMP-SUBJECT-LIST-BY-GRADE', value,$('#schoolId').val)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//buildDropdown(data['mastersData']['currentSub'], $('#currentsubject11'), 'Select course');
				console.log("mastersData "+ data['mastersData']['currentSub']);
				$.each(data['mastersData']['currentSub'], function(k, v) {
					var tr = '<tr onclick="selectSubject(this, false);" id="'+v.key+'" class="block greenDiv"><td><strong>'+v.value+' - '+v.extra+'</strong>'
					+'</td><td style="text-align:center;"><i class="fa fa-check"></i></td></tr>';
					$('#mandatorySubjects tbody').append(tr);
					});
					$("#"+formId+" #countAreaOfspecialization").text(data['mastersData']['currentSub'].length);
			}
			$("#currentsubject11").prop("disabled", false);
			//return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#currentsubject11").prop("disabled", false);
		}
	});
}

function callOptSubjects(formId, value, elementId) {
	hideMessage('');
	if (!validateRequestForMaster(formId, elementId)) {
		$("#"+formId+" #currentsubject11").val().trim(0);
		resetDropdown($("#"+formId+" #currentsubject11"), 'Select course');
		return false;
	}
	$("#"+formId+" #currentsubject11").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'OPTIONAL-SUBJECT-LIST-BY-GRADE', value,$('#schoolId').val)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				//buildDropdown(data['mastersData']['currentSub'], $('#currentsubject11'), 'Select course');
				console.log("mastersData "+ data['mastersData']['currentSub']);
				$.each(data['mastersData']['currentSub'], function(k, v) {
					var tr = '<tr onclick="selectSubject(this, true);" id="'+v.key+'" class="block "><td><strong>'+v.value+' - '+v.extra+'</strong>'
					+'</td><td style="text-align:center;"><i class="fa fa-check"></i></td></tr>';
					$('#optionalSubjects tbody').append(tr);
					});
					$("#"+formId+" #countAreaOfspecialization").text(data['mastersData']['currentSub'].length);
			}
			$("#currentsubject11").prop("disabled", false);
			//return false;
		},
		error : function(e) {
			showMessage(true, e.responseText);
			$("#currentsubject11").prop("disabled", false);
		}
	});
}

function callSubjectsByGrade(formId, value, elementId) {
	hideMessage('');
	if (!validateRequestForMasterGrade(formId, elementId)) {
		$("#"+formId+" #"+elementId).val().trim(0);
		resetDropdown($("#"+formId+" #"+elementId), 'Select course');
		return false;
	}
	$("#"+formId+" #prevSubject").prop("disabled", true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster(formId, 'PREVSUBJECT-LIST', value)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				buildDropdown(data['mastersData']['prevSub'], $('#prevSubject'), 'Select course');
				$("#"+formId+" #prevSubject").prop("disabled", false);
			}
			$("#"+formId+" #prevSubject").prop("disabled", false);
		},
		error : function(e) {
			//showMessage(true, e.responseText);
			$("#"+formId+" #prevSubject").prop("disabled", false);
		}
	});
}

function selectSubject(src, flag){
	if(flag){
		if (!$(src).hasClass("greenDiv")) {
			$(src).addClass("greenDiv");
		} else {
			$(src).removeClass("greenDiv");
		}
	}
}
var PRESERVE_AREA_OF_SPECIALIZATION='';

function calculateCurrentSubjects(standardId) {
	if(standardId==undefined || standardId==''){
		
	}else{
		if($('#currentGrade').val()==null || $('#currentGrade').val()==0 || $('#currentGrade').val()==''){
			return "0";
		}
	}
	var selSubjectd = "";
	var count=1;
	$("#mandatorySubjects tbody tr").each(function() {
		if (this.className.indexOf("greenDiv") != -1) {
			selSubjectd = selSubjectd + "," + this.id;
			$('#totalSubjectSelected').text(count);
			count++;
		}
	});
	$("#optionalSubjects tbody tr").each(function() {
		if (this.className.indexOf("greenDiv") != -1) {
			selSubjectd = selSubjectd + "," + this.id;
			$('#totalSubjectSelected').text(count);
			count++;
		}
	});
	var backupSubject=PRESERVE_AREA_OF_SPECIALIZATION;
	$("#countAreaOfspecialization").text(selSubjectd.substr(1).split(',').length);
	PRESERVE_AREA_OF_SPECIALIZATION=selSubjectd.substr(1);
	if(backupSubject!='' && backupSubject!=PRESERVE_AREA_OF_SPECIALIZATION){
		needToCallPreviousSubject=true;
	}
	return PRESERVE_AREA_OF_SPECIALIZATION;
}

function validateCurrSubjectDetails(){
	var result=false;
	$("#mandatorySubjects tbody tr").each(function() {
		console.log();
		if($(this).hasClass('greenDiv')){
			result=true;
		}
	});
	if(!result){
		showMessage(true, 'Mandatory Subjects are required.');
		showCurrentSubject(true);
	}
	return result;
}

//function validatePreSubjectDetails(){
//	var result=false;
//	var isEmpty=false;
//	$("#tbl_gen_marks_pre tbody tr").each(function() {
//		if($(this).find("input.e_p_marks").val()!='' || $(this).find("input.e_t_marks").val()!='' || $(this).find("select.subjectId").val()!='0'   
//			 || $(this).find("input.credit").val()!='' || $(this).find("input.cumulativeGrade").val()!=''){
//			isEmpty=true;
//			result=false;
//			if($(this).find("select.subjectId").val()=='0'){
//				showMessage(true, 'Please Select course in Previous Subject');
//				return false;
//			}
//			if($(this).find("input.e_p_marks").val()=='' && $(this).find("select.subjectId option:selected").attr('pracMandAttr')==1){
//				showMessage(true, 'Practical Marks is required in Previous Subject');
//				return false;
//			}
//			if($(this).find("input.e_t_marks").val()==''){
//				showMessage(true, 'Theory Marks is required in Previous Subject');
//				return false;
//			}
//			if($(this).find("input.credit").val()==''){
//				showMessage(true, 'Credit is required in Previous Subject');
//				return false;
//			}
//			var maxPracMarks=$(this).find("select.subjectId option:selected").attr('maxPracMarks');
//			if(parseInt($(this).find("input.e_p_marks").val())>parseInt(maxPracMarks)){
//				showMessage(true, 'Practical Marks can not be more than Maximum Practical marks '+maxPracMarks);
//				return false;
//			}
//			var maxTheoryMarks=$(this).find("select.subjectId option:selected").attr('maxTheoryMarks');
//			if(parseInt($(this).find("input.e_t_marks").val())>parseInt(maxTheoryMarks)){
//				showMessage(true, 'Theory Marks can not be more than Maximum Theory marks '+maxTheoryMarks);
//				return false;
//			}
//		}else{
//			result=true;
//		}
//		result=true;
//	});
//	if(!isEmpty){
//		showMessage(true, 'Previous Subject Marks is required.');
//		$('#callPreviousSubMarksModal').modal('show');
//		result=false;
//	}
//	if(result){
//		$('#callPreviousSubMarksModal').modal('hide');
//	}else{
//		$('#callPreviousSubMarksModal').modal('show');
//	}
//	return result;
//}

function applyPassingRule(src, position){
	console.log('src.id '+src.id)
	console.log('applyPassingRule called');
	var ispraccompulsory=$('#'+src.id+' option:selected').attr('pracMandAttr');
	if(ispraccompulsory==1){
		$('#maxPracMarks-'+position).text($('#'+src.id+' option:selected').attr('maxpracmarks'));
		$('#pracPassigMarks-'+position).text($('#'+src.id+' option:selected').attr('maxpracmarks'));
		$('#practicalMarks-'+position).val('');
		$('#practicalMarks-'+position).prop('disabled', false);
	}else{
		$('#maxPracMarks-'+position).text('N/A');
		$('#pracPassigMarks-'+position).text('N/A');
		$('#practicalMarks-'+position).val('');
		$('#practicalMarks-'+position).prop('disabled', true);
	}
	
	$('#maximumMarks-'+position).text($('#'+src.id+' option:selected').attr('totalMarks'));
	$('#maxTheoryMarks-'+position).text($('#'+src.id+' option:selected').attr('maxTheoryMarks'));
	if(ispraccompulsory==1){
		$('#pracPassigMarks-'+position).text($('#'+src.id+' option:selected').attr('pracPassingMarks'));
	}
	$('#theoryPassingMarks-'+position).text($('#'+src.id+' option:selected').attr('theoryPassingMarks'));
	$('#maximumMarks-'+position).val($('#'+src.id+' option:selected').attr('totalMarks'));
	
	var subjectId=$(src).val();
	if(subjectId==0){
		$('#maxTheoryMarks-'+position).text('');
		$('#theoryPassingMarks-'+position).text('');
		$('#theoryMarks-'+position).val('');
		$('#practicalMarks-'+position).val('');
		$('#pracPassigMarks-'+position).text('');
		$('#practicalMarks-'+position).val('');
		$('#maxPracMarks-'+position).text('');
		$('#marksCount-'+position).text('');
		$('#grade-'+position).text('');
		$('#credits-'+position).val('');
		$('#cumulativeGrade-'+position).val('');
		$('#result-'+position).text('');
	}
	var subjectId=$(src).val();
	var schoolId=$('#schoolId').val();
	console.log('subjectId: '+subjectId+' schoolId: '+schoolId);
	if (subjectId==0 || subjectId==undefined) {
		showMessage(true, 'Please select course');
		return false;
	}
	if($("input[name='isFromSameSchool']:checked").val()==1){
		//getCurrentSubjectMarks('',subjectId,'');
	}else{
		$('.sub_maxid').val('100');
	}

	return true;
}

function changeMarks(src, position){
	$('#cumulativeGrade-'+position).val('');
}

function calculatePassingRule(src, position){
	console.log('calculatePassingRule called');
	var returnStatus=true;
	$('#tr-'+position).removeClass('tr-red');
	var subjectId = $('#subjectId-'+position).val();
	var isPracticalMand = $('#subjectId-'+position +' option:selected').attr('pracMandAttr');
	var maxTheoryMarks = parseInt($('#maxTheoryMarks-'+position).text());
	var theoryPassingMarks = $('#theoryPassingMarks-'+position).text();
	var theoryMarks = $('#theoryMarks-'+position).val();
	var maxPracMarks = $('#maxPracMarks-'+position).text();
	var pracPassigMarks = $('#pracPassigMarks-'+position).text();
	var practicalMarks = $('#practicalMarks-'+position).val();
	var maximumMarks = parseInt($('#maximumMarks-'+position).val());
	var cumulativeGrade = $('#cumulativeGrade-'+position).val();
	var grade = $('#grade-'+position).text();
	var result = $('#result-'+position).text();
	
	if (subjectId > 0 && (practicalMarks >=0 || theoryMarks >=0) ){
		if(theoryMarks>0 && practicalMarks>0){
			theoryMarks=parseInt(theoryMarks);
			practicalMarks=parseInt(practicalMarks);
		}
		if(theoryMarks>maxTheoryMarks){
			showMessage(true, 'Theory Marks can not be more than Max Theory Marks');
			$('#tr-'+position).addClass('tr-red');
			returnStatus=false;
			return returnStatus;
		}
		if(isPracticalMand==1){
			if(practicalMarks>maxPracMarks){
				showMessage(true, 'Practical Marks can not be more than Max Practical Marks');
				$('#tr-'+position).addClass('tr-red');
				returnStatus=false;
				return returnStatus;
			}
		}
		if(theoryMarks==''){
			showMessage(true, 'Theory Marks is required');
			$('#tr-'+position).addClass('tr-red');
			returnStatus=false;
			return returnStatus;
		}
		if(isPracticalMand==1 && practicalMarks==''){
			showMessage(true, 'Practical Marks is required');
			$('#tr-'+position).addClass('tr-red');
			returnStatus=false;
			return returnStatus;
		}
		if(cumulativeGrade==''){
			showMessage(true, 'Credit is required');
			$('#tr-'+position).addClass('tr-red');
			returnStatus=false;
			return returnStatus;
		}
		
		var totalMarksObtained=0;
		if(isPracticalMand==1){
			totalMarksObtained = parseInt(theoryMarks)+parseInt(practicalMarks);
		}else{
			totalMarksObtained = theoryMarks;
		}
		$('#marksCount-'+position).text(totalMarksObtained);
		var grade = getGradeNew(totalMarksObtained, 50);
		$('#grade-'+position).html(grade);
		var result = getResult(totalMarksObtained, 50);
		$('#result-'+position).text(result);
		
		if(grade!='' && (grade=='NA' || grade=='N/A')){
			showMessage(true, 'Grade is not valid');
			$('#tr-'+position).addClass('tr-red');
			returnStatus=false;
			return returnStatus;
		}
		if(result!='' && (result=='NA' || result=='N/A')){
			showMessage(true, 'Result is not valid');
			$('#tr-'+position).addClass('tr-red');
			returnStatus=false;
			return returnStatus;
		}
	}
	
	return returnStatus;
}

function validateMarks(tableId){
	console.log('validateMarks called');
	var subjectIds=[];
	var returnStatus=true;
	var position=1;
	var calculatePassingRuleStatus=true;
	$("#"+tableId+ " tbody tr").each(function() {
		$(this).removeClass('tr-red');
		var subjectId = $(this).find("select.sub_id").val();
		if(subjectId>0){
			var isExist = $.inArray(subjectId,subjectIds);
			if(isExist==0){
				$('#tr-'+position).addClass('tr-red');
				returnStatus=false;
			}else{
				subjectIds.push(subjectId);
			}
		}
		if(returnStatus){
			var ruleStatus=calculatePassingRule(this, position);
			console.log('ruleStatus :: '+ruleStatus);
			if(!ruleStatus){
				if(calculatePassingRuleStatus){
					calculatePassingRuleStatus = false;
				}
			}
		}
		position++;
	});
	if(subjectIds.length==0){
		showMessage(true, 'Subjects is required');
		return false;
	}
	if(!returnStatus){
		showMessage(true, 'Two Subjects cannot be same');
		return false;
	}
	if(calculatePassingRuleStatus){
		$('#callPreviousSubMarksModal').modal('hide');
	}
	if(!calculatePassingRuleStatus){
		return calculatePassingRuleStatus;
	}else{
		return returnStatus;
	}
}
//function calcMarks(tableId) {
//	console.log('aya');
//	var isSuccess=true;
//	var fin_tot = 0;
//	var fin_max_marks = 0;
//	var final_result = "Pass";
//	var percent = 0;
//	var rowCount = $('#tbl_gen_marks_pre tbody tr').length;
//	rowCount = (rowCount / 2);
//	var i = 1;
//	
////	percent = (fin_tot * 100) / fin_max_marks;
////	if (percent < 60) {
////		final_result = "Fail";
////	} else {
////		final_result = "Pass";
////	}
////	$("span.tot_marks").html(fin_tot);
////	$("span.fin_percent").html(percent.toFixed(2));
////	$("span.fin_result").html(final_result);
//	
//	
//	// ///////////////////////////Pre
//	var allSubjectIds=[];
//	$("#"+tableId+ " tbody tr").each(function() {
//		// if(i<=rowCount){
//		var subjectId = 0;
//		var p_marks = 0;
//		var t_marks = 0;
//		var max_marks_each_subject=0;
//		var p_marks_pre = 0;
//		var t_marks_pre = 0;
//		var p_p_marks_pre = 0; // pract pass marks
//		var t_p_marks_pre = 0; // theory pass marks
//		var p_m_marks_pre = 0; // pract max marks
//		var t_m_marks_pre = 0; // theory max marks
//
//		var tot_pre = 0;
//		var max_tot_pre = 0;
//		var min_tot_pre = 0;
//		
//		$(this).removeClass('tr-red');
//		if ($(this).find("select.sub_id").val() > 0){
//			subjectId = $(this).find("select.sub_id").val();
//		}
//		if ($(this).find("select.sub_id").val() > 0 && $(this).find("input.e_p_marks").val() >=0 && $(this).find("input.e_t_marks").val() >=0){
//			if ($(this).find("input.e_p_marks").length > 0) {
//				if ($(this).find("input.e_p_marks").val().length > 0){
//					p_marks_pre = parseInt($(this).find("input.e_p_marks").val());
//				}
//				if ($(this).find("input.sub_maxid").val().length > 0){
//					max_marks_each_subject = parseInt($(this).find("input.sub_maxid").val());
//				}
//				p_p_marks_pre = parseInt($(this).find("input.e_p_marks").attr("data-pm"));
//				p_m_marks_pre = parseInt($(this).find("input.e_p_marks").attr("data-mm"));
//			}
//			if ($(this).find("input.e_t_marks").length > 0) {
//				if ($(this).find("input.e_t_marks").val().length > 0){
//					t_marks_pre = parseInt($(this).find("input.e_t_marks").val());
//				}
//				if ($(this).find("input.sub_maxid").val().length > 0){
//					max_marks_each_subject = parseInt($(this).find("input.sub_maxid").val());
//				}
//				t_p_marks_pre = parseInt($(this).find("input.e_t_marks").attr("data-pm"));
//				t_m_marks_pre = parseInt($(this).find("input.e_t_marks").attr("data-mm"));
//			}
//			var flag = true;
//			if(parseInt(subjectId)==0 && parseInt(p_marks_pre)==0 && parseInt(t_marks_pre)==0){
//				flag = false;
//			}else{
//				if( parseInt(p_marks_pre+t_marks_pre) > parseInt(max_marks_each_subject)
//						|| parseInt(p_marks_pre) > parseInt(max_marks_each_subject)
//						|| parseInt(t_marks_pre) > parseInt(max_marks_each_subject)
//						|| parseInt(subjectId) < 1 || subjectId ==''
//				){
//					$(this).addClass('tr-red');
//					isSuccess=false;
//				}
//				allSubjectIds.push(subjectId);
//			}
//			
//			var sortedSubjectIds = allSubjectIds.sort();
//			var results = [];
//			for (var i = 0; i < allSubjectIds.length - 1; i++) {
//				if (sortedSubjectIds[i + 1] == sortedSubjectIds[i]) {
//					results.push(sortedSubjectIds[i]);
//				}
//			}
//			$('#previousMarksError').html('');
//			if(flag){
//				if(results.length>0){
//					$(this).addClass('tr-red');
//					$('#previousMarksError').html('You have selected same subject multiple times');
//					isSuccess=false;
//				}
//			}
//			tot_pre = p_marks_pre + t_marks_pre;
//			max_tot_pre = p_m_marks_pre + t_m_marks_pre;
//			min_tot_pre = p_p_marks_pre + t_p_marks_pre;
//	
//			fin_tot = fin_tot + tot_pre;
//			if (tot_pre > 0) {
//				fin_max_marks = fin_max_marks + max_tot_pre;
//			}
//	
//			$(this).find("span.marks-count").html(tot_pre);
//			var grade = getGrade(tot_pre, min_tot_pre);
//			$(this).find("span.grade").html(grade);
//			var result_pre = getResult(grade);
//			var final_result_pre = "Pass"
//			if (p_p_marks_pre > p_marks_pre || t_p_marks_pre > t_marks_pre) {
//				result_pre = "Fail"
//				final_result_pre = "Fail";
//			}
//			$(this).find("span.result").html(result_pre);
//			i = i + 1;
//			// }
//		}
//	});
////	if(isSuccess){
////		$('#previousMarksModal').modal('hide');
////	}
//	return  isSuccess;
//}


function getGradeNew(total, passing_marks) {
	var gradeVal = "N/A";
	console.log('GRADE_CAL_RULE: '+GRADE_CAL_RULE);
	//console.log("Markes-"+total);
	$.each(GRADE_CAL_RULE, function(idx, obj) {
		if (parseInt(obj.minMark) <= total && parseInt(obj.maxMark) >= total){
			//console.log(obj.grade+" "+total);
			gradeVal =  obj.grade;
		}
			
	});	
	return gradeVal;
}

//function getGrade(total, passing_marks) {
//	switch (true) {
//	case (total >= 96):
//		return "A+";
//		break;
//	case (total >= 93):
//		return "A";
//		break;
//	case (total >= 89):
//		return "A-";
//		break;
//	case (total >= 86):
//		return "B+";
//		break;
//	case (total >= 83):
//		return "B";
//		break;
//	case (total >= 79):
//		return "B-";
//		break;
//	case (total >= 76):
//		return "C+";
//		break;
//	case (total >= 73):
//		return "C";
//		break;
//	case (total >= 69):
//		return "C-";
//		break;
//	case (total >= 66):
//		return "D+";
//		break;
//	case (total >= 63):
//		return "D";
//		break;
//	case (total >= 60):
//		return "D-";
//		break;
//	case (total >= passing_marks):
//		return "F";
//		break;
//	default:
//		return "E";
//		break;
//	}
//}

function getResult(total, passing_marks) {
	var result = "N/A";
	//console.log('GRADE_CAL_RULE: '+GRADE_CAL_RULE);
	//console.log("Markes-"+total);
	$.each(GRADE_CAL_RULE, function(idx, obj) {
		if (parseInt(obj.minMark) <= total && parseInt(obj.maxMark) >= total){
			//console.log(obj.grade+" "+total);
			result =  obj.result;
		}
	});	
	return result;
}

function getCurrentSubjectMarks(formId, value, elementId) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'GET_CURRENT_SUBJECT_MARKS_BY_SUBJECT_ID', value,$('#schoolId').val())),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				console.log("mastersData "+ data['mastersData']['currentSubjectMarks']['value']);
				$("#tbl_gen_marks_pre tbody tr").each(function() {
					if($(this).find("select.subjectId").val()==value){
						$(this).find("input.sub_maxid").val(data['mastersData']['currentSubjectMarks']['value']);
					}
				});
				$("#currentSubMarkstbl tbody tr").each(function() {
					if($(this).find("select.subjectId").val()==value){
						$(this).find("input.sub_maxid").val(data['mastersData']['currentSubjectMarks']['value']);
					}
				});
			}
		},
		error : function(e) {
			//showMessage(true, e.responseText);
		}
	});
}
function removeDocument(uploadIndex, uploadMethodType){
	console.log(uploadIndex);
	if(uploadMethodType==1){
		
	}else if(uploadMethodType==2){
		
	}else if(uploadMethodType==3){
		$('#fileupload'+uploadIndex).parent('span').next('a.view').hide();
		$('#fileupload'+uploadIndex).parent('span').next('a.view').next('a.remove').hide();
		$('#fileupload'+uploadIndex).parent('span').parent('p').parent('div').find('span.fileName').html('');
		$('#fileupload'+uploadIndex).parent('span').parent('p').parent('div').find('i').removeClass('fa-check-circle-o');
		$('#fileupload'+uploadIndex).parent('span').parent('p').parent('div').find('i').removeClass('fa-close');
		$('#fileupload'+uploadIndex).parent('span').parent('p').parent('div').find('h1').removeAttr('style');
		$('#fileupload'+uploadIndex).parent('span').next('a.view').attr('href','');
		$('#fileupload'+uploadIndex).parent('span').next('a.remove').attr('href','');
	}
}