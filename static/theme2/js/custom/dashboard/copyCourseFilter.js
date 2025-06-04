function callAllStandardList(formId, elementId) {
	resetDropdown($('#'+formId+' #'+elementId), 'Select Grade');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'ALL-STANDARD-LIST', 'gradeList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['standards'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Grade</option>');
				$.each(result, function(k, v) {
					dropdown.append('<option value="' + v.key + '">' + v.value+ ' </option>');
				});
			}
		}
	});
}

function callCourseProviderList(formId, elementId) {
	resetDropdown($('#studentFilter #lmsPlatform'), 'Select LMS Platform');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				//dropdown.append('<option value="0">Select LMS Platform</option>');
				$.each(result, function(k, v) {
					if(v.key>=36){
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
						//dropdown.prop("disabled",true)
					}
				});
			}
		}
	});
}

function callCategoryNameList(formId, value,elementId) {
	resetDropdown($('#'+formId+' #'+elementId), 'Select Category Name');
	var requestExtra = $('#lmsPlatform').val()[0];
	if(requestExtra==undefined || requestExtra==''){
		$('#duplicateCourseForm #duplicateCourseErrMessage').text('Please choose LMS Platform');
		return false;
	}
	if(value == undefined || value == ""){
		value = 0;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId', 'ALL-CATEGORY-NAME-LIST', value, requestExtra)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Category Name</option>');
				$.each(result, function(k, v) {
					if(elementId=='categoryNameDC'){
						dropdown.append('<option value="' + v.key + '">'+ v.value + ' </option>');
					}else{
						dropdown.append('<option value="' + v.value + '">'+ v.value + ' </option>');
					}
				});
			}
		}
	});
}

function resetCourseSearchFilter(formId) {
	$("#" + formId + " #courseName").val('').trigger('change');
	;
	$("#" + formId + " #searchFor").val('CC').trigger('change');
	$("#" + formId + " #lmsPlatform").val('').trigger('change');
	$("#" + formId + " #gradeDropDown").val("").trigger('change');
	$("#" + formId + " #categoryName").val("").trigger('change');
	$("#" + formId + " #courseType").val("").trigger('change');
	$("#" + formId + " #lmsCourseType").val("").trigger('change');
	$("#" + formId + " #lmsCourseId").val('').trigger('change');
	;
	$("#" + formId + " #SyncedLms").val('').trigger('change');
	$("#" + formId + " #courseStatus").val('').trigger('change');

}

function advanceCourseSearchFilter(formId) {
	
	if($("#lmsPlatform").val() <= 0){
		$('#searchCourseErrMessage').text('Please choose LMS Platform');
		setTimeout(function(){$('#searchCourseErrMessage').text('');}, 3000);
		return false;
	}
	hideMessage('');
	$
	.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'filter-copy-course-content'),
		data : JSON
				.stringify(getCallRequestForAdvanceCourseSearchFilter(formId)),
		dataType : 'json',
		//async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, stringMessage[1]);
			} else {
				$('#copyCourseTable tbody').html('');
				console.log("Subject data",
						data['subjectListB2CInfoDTO'])
				if (data['subjectListB2CInfoDTO'].length > 0) {
					var sno = 0;
					$.each(data['subjectListB2CInfoDTO'],function(k, subject) {
						sno++;
						copyCourseTableTr = '<tr id="'
								+ subject.entityId
								+ '" entityName="'
								+ subject.entityName
								+ '">'
								+ '<td><input type="checkbox" class="checkCopySubject" value="'
								+ subject.subjectId
								+ '"></td>'
								+ '<td>'
								+ sno
								+ '</td>'
								+ '<td>'
								+ subject.courseProviderName
								+ '</td>' + '<td>'
								+ subject.standardName
								+ '</td>' + '<td>'
								+ subject.courseName
								+ '</td>' + '<td>'
								+ subject.courseType
								+ '</td>' + '<td>'
								+ subject.parentsId
								+ '</td>' + '<td>'
								+ subject.subjectName
								+ '</td>' + '<td> <span id="courseIdFromLmsError'+subject.subjectId+'" class="text-danger"></span><br/><input type="text" id="courseIdFromLms'+subject.subjectId+'" class="form-control" onkeydown="return M.digit(event);" value="'
								+ subject.lmsCourseId
								+ '"/>'
								+ subject.syncedStatus
								+ '</td>' + '<td class="text-center">'
								+ '<button class="btn btn-sm btn-primary" onclick="saveCourseLmsId('+subject.subjectId+');">Save</button>'
								+ '</td>' + '</tr >';
						// console.log(v.entityId)
						$('#copyCourseTable tbody').append(copyCourseTableTr);
					});
				} else {
					copyCourseTableTr = '<tr><td colspan=10 style="font-size:22px; text-align:center"> No data available in table</td></tr>'
					$('#copyCourseTable tbody').append(copyCourseTableTr);
				}
				var startDate = new Date();
				startDate.setDate(startDate.getDate() + 1);
				$(".subjectSemesterStartDateCl").datepicker({
					startDate : startDate,
					format : 'mm-dd-yyyy',
					autoclose : true,
				// todayHighlight : true,
				});
			}
		},
	});
	$("#selectallrow").prop("checked", false);
	$("#copyCourseTable  tbody .checkCopySubject").click(function(){
		var total_check_boxes = $("#copyCourseTable  tbody .checkCopySubject").length;
		var total_checked_boxes = $("#copyCourseTable  tbody .checkCopySubject:checked").length;
		if (total_check_boxes === total_checked_boxes) {
			$("#selectallrow").prop("checked", true);
		}
		else {
			$("#selectallrow").prop("checked", false);
		}
	});
}

function getCallRequestForAdvanceCourseSearchFilter(formId) {
	var requestFilterCopyCourse = {};
	var authentication = {};
	var filterAndCopyCourseDTO = {};
	filterAndCopyCourseDTO['gradeId'] = $("#" + formId + " #gradeDropDown")
			.select2('val');
	filterAndCopyCourseDTO['lmsPlatform'] = $("#" + formId + " #lmsPlatform")
			.select2('val');
	filterAndCopyCourseDTO['courseName'] = $("#" + formId + " #courseName")
			.val().trim();
	filterAndCopyCourseDTO['numberOfRecords'] = $(
			"#" + formId + " #numberOfRecords").val().trim();
	if($("#" + formId + " #lmsCourseId").val().length>0){
		filterAndCopyCourseDTO['lmsCourseId'] = $("#" + formId + " #lmsCourseId").val().replace(/ /g,"").split(",");
	}
	filterAndCopyCourseDTO['categoryName'] = $("#" + formId + " #categoryName")
			.select2('val');
	filterAndCopyCourseDTO['lmsCourseType'] = $(
			"#" + formId + " #lmsCourseType").select2('val');
	filterAndCopyCourseDTO['courseType'] = $("#" + formId + " #courseType")
			.select2('val');
	filterAndCopyCourseDTO['syncedLms'] = $("#" + formId + " #SyncedLms").select2('val');
	filterAndCopyCourseDTO['courseStatus'] = $("#" + formId + " #courseStatus")
			.select2('val');
	filterAndCopyCourseDTO['schoolUUID'] = SCHOOL_UUID;
	filterAndCopyCourseDTO['schoolId'] = SCHOOL_ID;

	requestFilterCopyCourse['filterAndCopyCourseDTO'] = filterAndCopyCourseDTO;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	requestFilterCopyCourse['authentication'] = authentication;

	return requestFilterCopyCourse;

}

function validateRequestForCopyCourse(formId,controlType){
	if(controlType !='SYNC' && controlType !='UPDATECOURSE'){
		
		if($("#" + formId + " #suffixNo").val()==''){
			$('#copyCourseForm #copyCourseErrMessage').text('Please enter suffix number');
			return false;
		}
		if($("#" + formId + " #type").val()=='' || $("#" + formId + " #type").val()==undefined){
			$('#copyCourseForm #copyCourseErrMessage').text('Please choose type');
			return false;
		}
		if($("#" + formId + " #type").val()=='Range'){
			if($("#" + formId + " #startDate").val()=='' || $("#" + formId + " #startDate").val()==undefined){
				$('#copyCourseForm #copyCourseErrMessage').text('Please choose start Date');
				return false;
			}
			if($("#" + formId + " #endDate").val()=='' || $("#" + formId + " #endDate").val()==undefined){
				$('#copyCourseForm #copyCourseErrMessage').text('Please choose end Date');
				return false;
			}
		}
		if($("#" + formId + " #type").val()=='Continous'){
			if($("#" + formId + " #daysCount").val()==''){
				$('#copyCourseForm #copyCourseErrMessage').text('Please enter days');
				return false;
			}
		}
//		if($("#" + formId + " #term").val()==''){
//			$('#copyCourseForm #copyCourseErrMessage').text('Please enter term');
//			return false;
//		}
	}
	if($("#lmsPlatform").val() <= 0){
		$('#copyCourseForm #copyCourseErrMessage').text('Please choose LMS Platform');
		return false;
	}
	return true;
}

function copySelectedCourse(formId, tableId, controlType) {
	$('#copyCourseForm #copyCourseErrMessage').text('');
	var subjectIds = "";
	$('#' + tableId + '> tbody  > tr').each(
			function(index, tr) {
				if ($(this).find(".checkCopySubject").is(":checked")) {
					subjectIds = subjectIds+ $(this).find(".checkCopySubject").val() + ',';
				}
			});
	if (subjectIds == "") {
		$('#copyCourseForm #copyCourseErrMessage').parent().removeClass("text-success");
		$('#copyCourseForm #copyCourseErrMessage').parent().addClass("text-danger");
		$('#copyCourseForm #copyCourseErrMessage').text('Please select atleast one subject to copy');
		return;
	} else {
		$('#copyCourseForm #copyCourseErrMessage').parent().removeClass("text-success");
		$('#copyCourseForm #copyCourseErrMessage').parent().addClass("text-danger");
		$("#copyCourseForm #selectSubjectIds").val(subjectIds.substring(0, subjectIds.length - 1));
	}
	
	if(!validateRequestForCopyCourse(formId, controlType)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'copy-course'),
		data : JSON.stringify(getRequestForCopyCourse(formId, controlType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$('#copyCourseForm #copyCourseErrMessage').text( data['message']);
				$('#copyCourseForm #copyCourseErrMessage').parent().removeClass("text-success");
				$('#copyCourseForm #copyCourseErrMessage').parent().addClass("text-danger");
			} else {
				$('#copyCourseForm #copyCourseErrMessage').parent().removeClass("text-danger");
				$('#copyCourseForm #copyCourseErrMessage').parent().addClass("text-success");
				if(controlType !='SAVE'){
					var result = data['copyCourseSyncStatus'];
					var msg = $('#copyCourseForm #copyCourseErrMessage');
					$.each(result, function(k, v) {
						msg.append(v.message+'<br/>');
					});
					//$('#' + formId)[0].reset();
				}else{
					$('#copyCourseForm #copyCourseErrMessage').text( data['message']);
					//$('#' + formId)[0].reset();
					$('#copyCourseForm #forTeacher').val('0').trigger('change');
				}
			}
			return false;
		},
		error : function(e) {
			// showMessage(true, e.responseText);
			console.log("ERROR : ", e);
		}
	});
	$('#type').val("");
    $('#type').select2({
    	theme:"bootstrap4",
    }).trigger('change');

}

function getRequestForCopyCourse(formId, controlType) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var filterAndCopyCourseDTO = {};
	// filterAndCopyCourseDTO['userId'] = $("#"+formId+" #userId").val();
	if(controlType=='SAVE' || controlType=='SAVEANDSYNC'){
		if($('#forTeacher').val()!=''){
			filterAndCopyCourseDTO['userId'] = $('#forTeacher').val();
			filterAndCopyCourseDTO['forTeacher'] = $("#" + formId + " #forTeacher").val();
		}else{
			filterAndCopyCourseDTO['userId'] = '';
			filterAndCopyCourseDTO['forTeacher'] = '';
		}
	}else{
		filterAndCopyCourseDTO['userId'] = '';
		filterAndCopyCourseDTO['forTeacher'] = '';
	}
	
	filterAndCopyCourseDTO['controlType'] =controlType;
	filterAndCopyCourseDTO['copySubjectIds'] = $("#" + formId + " #selectSubjectIds").val();
	filterAndCopyCourseDTO['derivative'] = $("#" + formId + " #derivative")
			.val();
	filterAndCopyCourseDTO['suffix'] = $("#" + formId + " #suffix").val();
	if($("#" + formId + " #suffixNo").val() != 0){
		filterAndCopyCourseDTO['suffixNo'] = $("#" + formId + " #suffixNo").val();
	}else{
		filterAndCopyCourseDTO['suffixNo'] = "00";
	}
	filterAndCopyCourseDTO['externalId'] = $("#" + formId + " #externalId")
			.val();
	filterAndCopyCourseDTO['type'] = $("#" + formId + " #type").val();
	filterAndCopyCourseDTO['daysCount'] = $("#" + formId + " #daysCount").val();
	filterAndCopyCourseDTO['startDate'] = $("#" + formId + " #startDate").val();
	filterAndCopyCourseDTO['endDate'] = $("#" + formId + " #endDate").val().trim();
	filterAndCopyCourseDTO['term'] = $("#" + formId + " #term").val();
	filterAndCopyCourseDTO['lmsPlatform'] = $("#lmsPlatform").val();
	filterAndCopyCourseDTO['schoolId'] = SCHOOL_ID;
	requestData['filterAndCopyCourseDTO'] = filterAndCopyCourseDTO;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}

function saveCourseLmsId(subjectId){
	if($('#courseIdFromLms'+subjectId).val()=='' || $('#courseIdFromLms'+subjectId).val()==undefined){
		$('#courseIdFromLmsError'+subjectId).text('Lms Course Id is mandatory.')
		return false;
	}
	var lmsCourseId = $('#courseIdFromLms'+subjectId).val();
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'save-copy-course-lms-id'),
		data : "subjectId="+subjectId+"&lmsCourseId="+lmsCourseId,
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$('#courseIdFromLmsError'+subjectId).text('Lms Course Id not saved.');
			} else {
				$('#courseIdFromLmsError'+subjectId).removeClass('text-danger');
				$('#courseIdFromLmsError'+subjectId).addClass('text-success');
				$('#courseIdFromLmsError'+subjectId).text('Lms Course Id saved successfully.');
			}
			return false;
		},
		error : function(e) {
			// showMessage(true, e.responseText);
			console.log("ERROR : ", e);
		}
	});
}
function getRequestForDuplicateCourse(formId, controlType) {
	var request = {};
	var authentication = {};
	var filterAndCopyCourseDTO = {};
	// filterAndCopyCourseDTO['userId'] = $("#"+formId+" #userId").val();
	filterAndCopyCourseDTO['controlType'] =controlType;
	filterAndCopyCourseDTO['copySubjectIds'] = $("#" + formId + " #selectSubjectIdsDC").val();
	filterAndCopyCourseDTO['shownOnSignup'] = $("#" + formId + " #shownOnSignup").val();
	filterAndCopyCourseDTO['shownOnMigration'] = $("#" + formId + " #shownOnMigration").val();
	filterAndCopyCourseDTO['standardId'] = $("#" + formId + " #gradeDropDownDC").val();
	filterAndCopyCourseDTO['lmsPlatform'] = $("#lmsPlatform").val();
	filterAndCopyCourseDTO['courseId']=$("#" + formId + " #categoryNameDC").val();
	filterAndCopyCourseDTO['schoolId'] = SCHOOL_ID;
	request['filterAndCopyCourseDTO'] = filterAndCopyCourseDTO;
	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = 'SCHOOL';
	request['authentication'] = authentication;
	return request;
}

function duplicateSelectedCourse(formId, tableId, controlType) {
	$('#'+formId+' #duplicateCourseErrMessage').text('');
	var subjectIds = "";
	$('#' + tableId + '> tbody  > tr').each(
		function(index, tr) {
			if ($(this).find(".checkCopySubject").is(":checked")) {
				subjectIds = subjectIds+ $(this).find(".checkCopySubject").val() + ',';
			}
	});
	if (subjectIds == "") {
		$('#'+formId+' #duplicateCourseErrMessage').text('Please select atleast one course to create duplicate course.');
		return;
	} else {
		$("#"+formId+" #selectSubjectIdsDC").val(subjectIds.substring(0, subjectIds.length - 1));
	}
	
	if(!validateRequestForDuplicateCourse(formId, controlType)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'duplicate-course'),
		data : JSON.stringify(getRequestForDuplicateCourse(formId, controlType)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$('#'+formId+' #duplicateCourseErrMessage').text( data['message']);
				$('#' + formId)[0].reset();
			} else {
				var result = data['message'];
				var msg = $('#'+formId+' #duplicateCourseErrMessage');
				$.each(result, function(k, v) {
					msg.append(v+'<br/>');
					if(v.includes("not")){
						$('#'+formId+' #duplicateCourseErrMessage').parent().addClass('text-danger');
						$('#'+formId+' #duplicateCourseErrMessage').parent().removeClass('text-success');
					}else{
						$('#'+formId+' #duplicateCourseErrMessage').parent().removeClass('text-danger');
						$('#'+formId+' #duplicateCourseErrMessage').parent().addClass('text-success');
					}
				});
				
				$('#' + formId)[0].reset();
			}
			return false;
		},
		error : function(e) {
			// showMessage(true, e.responseText);
			console.log("ERROR : ", e);
		}
	});
}

function validateRequestForDuplicateCourse(formId,controlType){
		$('#'+formId+' #duplicateCourseErrMessage').text('');
		if($("#" + formId + " #gradeDropDownDC").val()==''){
			$('#'+formId+' #duplicateCourseErrMessage').text('Please select copy to grade');
			return;
		}
		if($("#" + formId + " #categoryNameDC").val()=='0' || $("#" + formId + " #categoryNameDC").val()==undefined){
			$('#'+formId+' #duplicateCourseErrMessage').text('Please select atleast one master course to duplicate course');
			return;
		}
		if($("#" + formId + " #shownOnSignup").val()==''){
			$('#'+formId+' #duplicateCourseErrMessage').text('Please select shown on signup');
			return;
		}
		if($("#" + formId + " #shownOnMigration").val()==''){
			$('#'+formId+' #duplicateCourseErrMessage').text('Please select shown on migration');
			return;
		}
	
		if($("#lmsPlatform").val() <= 0){
			$('#'+formId+' #duplicateCourseErrMessage').text('Please choose LMS Platform');
			return false;
		}
	return true;
}