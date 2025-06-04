function validateRequestForAgilixbuzzSyncEnrollment(formId, moduleId, requestKey, lmsProviderId) {
	return true;
}

function getRequestForAgilixbuzzSyncEnrollment(formId, moduleId, requestKey, value, lmsProviderId) {
	var  AgilixbuzzSyncRequest= {};
	var request={};
	AgilixbuzzSyncRequest['uniqueId']= UNIQUEUUID;
	AgilixbuzzSyncRequest['moduleId'] = moduleId;
	AgilixbuzzSyncRequest['requestKey'] = requestKey;
	if(moduleId=='TEACHER' && requestKey=='PULLENROLLMENT'){
		AgilixbuzzSyncRequest['lmsProviderId'] = $('#courseProvider').val();
	}else{
		AgilixbuzzSyncRequest['lmsProviderId'] = lmsProviderId;
	}

	var requestValues=[];

	var requestValue={};
	requestValue['value']=value;
	requestValues.push(requestValue);
	if(moduleId=='TEACHER' && requestKey=='PULLENROLLMENT'){
		requestValue['lmsProviderId']=$('#courseProvider').val();;
	}else{
		requestValue['lmsProviderId']=lmsProviderId;
	}

	AgilixbuzzSyncRequest['requestValues'] = requestValues;
	request['agilixbuzzSyncRequest']=AgilixbuzzSyncRequest;
	request['userId']=USER_ID;
	return request;
}

function callAgilixbuzzSyncEnrollment(formId, moduleId, requestKey, value, lmsProviderId, rowId) {
	var startDate  = $("#lmsSubjectStart"+rowId).val();
	var endDate  = $("#lmsSubjectEnd"+rowId).val();
	console.log("startDate="+startDate+", endDate="+endDate)
	if(startDate==''){
		showMessage(true, "Enrollment start date required");
		return;
	}
	if(endDate==''){
		showMessage(true, "Enrollment end date required");
		return;
	}

	hideMessage('');
	if (!validateRequestForAgilixbuzzSyncEnrollment(formId, moduleId, requestKey, value, lmsProviderId)) {
		return false;
	}
	var loaderHtml = `<div class="unique-loader loader-bg" style="width: 100px; height: 100px; position: inherit;">
    					<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="International Schooling Loader" class="new-loader-2024">
					</div>`;
	$("#"+formId+" #studentEnrollSemester tbody tr .lmsEnrollmentIdTd").each(function(){
		$(this).html(loaderHtml)
	});
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('lms-sync','enrollment'),
		data : JSON.stringify(getRequestForAgilixbuzzSyncEnrollment(formId, moduleId, requestKey, value, lmsProviderId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessage(true, data['message']);
				if(data['status'] == '3'){
					redirectLoginPage();
				}
			} else {
				showMessage(true, data['message']);
				$.each(data.details, function(i, value){
					$("#"+formId+" #studentEnrollSemester tbody").find("#"+value.entityId).find(".lmsEnrollmentIdTd").text(value.entityValue);
				});
			}
			return false;
		}
	});
}

function getRequestForAgilixbuzzSyncAllEnrollment(moduleId, value, lmsProviderId) {
	var  AgilixbuzzSyncRequest= {};
	var request={};
	AgilixbuzzSyncRequest['uniqueId']= UNIQUEUUID;
	AgilixbuzzSyncRequest['moduleId'] = moduleId;
	if(moduleId=='TEACHER'){
		AgilixbuzzSyncRequest['lmsProviderId'] = $('#courseProvider').val();
	}else{
		AgilixbuzzSyncRequest['lmsProviderId'] = lmsProviderId;
	}
	var requestValues=[];
	$.each(value, function (k, v) {
		var requestValue={};
		requestValue['value']=v;
		if(moduleId=='TEACHER'){
			requestValue['lmsProviderId']=$('#courseProvider').val();;
		}else{
			requestValue['lmsProviderId']=lmsProviderId;
		}
		requestValues.push(requestValue);
	});
	AgilixbuzzSyncRequest['requestValues'] = requestValues;
	request['agilixbuzzSyncRequest']=AgilixbuzzSyncRequest;
	request['userId']=USER_ID;
	return request;
}

function syncAll(formId, moduleId, lmsProviderId){
	var saveFlag =  true;
	var enrollmentIds = [];
	$("#"+formId+" #studentEnrollSemester tbody tr").each(function(i){
		var startDate  = $(this).find("#lmsSubjectStart"+(i+1)).val();
		var endDate  = $(this).find("#lmsSubjectEnd"+(i+1)).val();
		var lmsSubjectId  = $(this).find("#lmsSubjectId"+(i+1)).val();	
		console.log("startDate="+startDate+", endDate="+endDate)
		if(startDate==''){
			saveFlag =false;
			showMessage(true, "Enrollment start date required");
			return;
		}
		if(endDate==''){
			saveFlag =false;
			showMessage(true, "Enrollment end date required");
			return;
		}
		// if(lmsSubjectId==''){
		// 	saveFlag =false;
		// 	showMessage(true, "LMS Course Name required");
		// 	return;
		// }
		if(lmsSubjectId!=''){
			enrollmentIds.push($(this).attr("id"));
		}
	});
	if(saveFlag){
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLFor('lms-sync','enrollment'),
			data : JSON.stringify(getRequestForAgilixbuzzSyncAllEnrollment(moduleId, enrollmentIds, lmsProviderId)),
			dataType : 'json',
			success : function(data) {
				if (data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT') {
					showMessage(true, data['message']);
					if(data['status'] == '3'){
						redirectLoginPage();
					}
				} else {
					showMessage(true, data['message']);
					$.each(data.details, function(i, value){
						$("#"+formId+" #studentEnrollSemester tbody").find("#"+value.entityId).find(".lmsEnrollmentIdTd").text(value.entityValue);
					});
				}
				return false;
			}
		});
	}
}




function validateRequestForAgilixbuzzSyncUser(formId, moduleId, requestKey, lmsProviderId) {
	return true;
}

function getRequestForAgilixbuzzSyncUser(formId, moduleId, requestKey, value, lmsProviderId) {
	var AgilixbuzzSyncRequest = {};
	AgilixbuzzSyncRequest['uniqueId']= UNIQUEUUID;
	AgilixbuzzSyncRequest['moduleId'] = moduleId;
	AgilixbuzzSyncRequest['requestKey'] = requestKey;
	AgilixbuzzSyncRequest['lmsProviderId'] = lmsProviderId;
	var requestValues=[];

	var requestValue={};
	requestValue['value']=value;
	requestValue['lmsProviderId']=lmsProviderId;

	requestValues.push(requestValue);

	AgilixbuzzSyncRequest['requestValues'] = requestValues;
	return AgilixbuzzSyncRequest;
}


function callAgilixbuzzSyncUser(formId, moduleId, requestKey, value, lmsProviderId) {
	hideMessage('');
	if (!validateRequestForAgilixbuzzSyncUser(formId, moduleId, requestKey, value, lmsProviderId)) {
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('lms-sync','user'),
		data : JSON.stringify(getRequestForAgilixbuzzSyncUser(formId, moduleId, requestKey, value, lmsProviderId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessage(true, data['message']);
				if(data['status'] == '3'){
					redirectLoginPage();
				}
			} else {
				$("#studentLmsContent tbody").find("."+value).text(data.lmsUserId)
				showMessage(true, data['message']);
			}
			return false;
		}
	});
}


function validateRequestForBuzzGetUserGradeBookSummery(formId, moduleId, requestKey, lmsProviderId) {
	return true;
}

function getRequestForBuzzGetUserGradeBookSummery(formId, moduleId, requestKey,lmsProviderId) {
	var  GetEnrollmentRequests= {};
	GetEnrollmentRequests['uniqueId']= UNIQUEUUID;
	GetEnrollmentRequests['moduleId'] = moduleId;
	GetEnrollmentRequests['lmsUserId'] = requestKey;
	GetEnrollmentRequests['lmsProviderId'] = lmsProviderId;

	return GetEnrollmentRequests;
}

function callBuzzGetUserGradeBookSummery(formId, moduleId, requestKey, lmsProviderId) {
	hideMessage('');
	if (!validateRequestForBuzzGetUserGradeBookSummery(formId, moduleId, requestKey, lmsProviderId)) {
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('lms-sync','get-grade-book-summery'),
		data : JSON.stringify(getRequestForBuzzGetUserGradeBookSummery(formId, moduleId, requestKey,lmsProviderId)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessage(true, data['message']);
				if(data['status'] == '3'){
					redirectLoginPage();
				}
			} else {
				showMessage(true, data['message']);
			}
			return false;
		}
	});
}

function validateRequestForAgilixbuzzLMSSync(formId, moduleId, lmsProviderId) {
	return true;
}

function getRequestForAgilixbuzzLMSSync(formId, moduleId, lmsProviderId) {
	var AgilixbuzzSyncRequest = {};
	AgilixbuzzSyncRequest['uniqueId']= UNIQUEUUID;
	AgilixbuzzSyncRequest['moduleId'] = moduleId;
	AgilixbuzzSyncRequest['requestKey'] = $('#schoolId').val();
	AgilixbuzzSyncRequest['lmsProviderId'] = $('#'+lmsProviderId).val();;
	return AgilixbuzzSyncRequest;
}

function callAgilixbuzzLMSSync(formId, moduleId, lmsProviderId) {
	hideMessage('');
	customLoaderExternalPage(true);
	$("#errMsg").text('');
	if (!validateRequestForAgilixbuzzLMSSync(formId, moduleId, lmsProviderId)) {
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('lms-sync',''),
		data : JSON.stringify(getRequestForAgilixbuzzLMSSync(formId, moduleId, lmsProviderId)),
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data['code'] == 'FAILED' || data['code'] == 'EXCEPTION' || data['code'] == 'SESSIONOUT') {
				$("#errMsg").text(data['message']);
				if(data['code'] == 'SESSIONOUT'){
					redirectLoginPage();
				}
				customLoaderExternalPage(false);
			} else {
				$("#errMsg").text(data['message']);
				if(moduleId=='USER'){
					prefillLMSUserSyncResponse('lmsUserSyncResponse', data['responses']);
				}else if(moduleId=='LMSENNROLLMENT'){
					prefillLMSEnrollmentSyncResponse('lmsSyncEnrollmentResponse', data['responses']);
					}else if(moduleId=='VERIFYLMMSUSER'){
					prefillLMSUserVerifyEmailResponse('lmsUserEmailVerifyResponse', data['responses']);
				}
				customLoaderExternalPage(false);
			}
			return false;
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function prefillLMSUserVerifyEmailResponse(responseId, responses){
	$('#'+responseId+' tbody').html('')
	$.each(responses, function(k, v) {
		var td1='<td>'+(k+1)+'</td>';
		var td2='<td>'+getLmsProviderName(v.lmsProviderId)+'</td>';
		var td3='<td>'+v.id+'</td>';
		var td4='<td>'+v.username+'</td>';
		var td5='<td>'+v.firstname+'</td>';
		var td6='<td>'+v.email+'</td>';
		var td8='<td>'+v.sync+'</td>';
		var tr='<tr>'+td1+td2+td3+td4+td5+td6+td8+'</tr>';
		$('#'+responseId).append(tr)
	});
	$('#'+responseId).dataTable().fnSetFilteringEnterPress();
}


function prefillLMSUserSyncResponse(responseId, responses){
	$('#'+responseId+' tbody').html('')
	$.each(responses, function(k, v) {
		var td1='<td>'+(k+1)+'</td>';
		var td2='<td>'+getLmsProviderName(v.lmsProviderId)+'</td>';
		var td3='<td>'+v.reference+'</td>';
		var td4='<td>'+v.id+'</td>';
		var td5='<td>'+v.username+'</td>';
		var td6='<td>'+v.firstname+' '+v.lastname+'</td>';
		var td7='<td>'+v.email+'</td>';
		var td8='<td>'+v.sync+'</td>';
		var tr='<tr>'+td1+td2+td3+td4+td5+td6+td7+td8+'</tr>';
		$('#'+responseId).append(tr)
	});
	$('#'+responseId).dataTable().fnSetFilteringEnterPress();
}

function prefillLMSEnrollmentSyncResponse(responseId, responses){
	$('#'+responseId+' tbody').html('')
	$.each(responses, function(k, v) {
		var td1='<td>'+(k+1)+'</td>';
		var td2='<td>'+getLmsProviderName(v.lmsProviderId)+'</td>';
		var td3='<td>'+v.reference+'</td>';
		var td9='<td>'+v.enrolmentId+'</td>';
		var td4='<td>'+v.type+'</td>';
		var td5='<td>'+v.courseid+'</td>';
		var td6='<td>'+v.title+'</td>';
		var td8='<td>'+v.sync+'</td>';
		var tr='<tr>'+td1+td2+td3+td9+td4+td5+td6+td8+'</tr>';
		$('#'+responseId).append(tr)
	});
	$('#'+responseId).dataTable().fnSetFilteringEnterPress();
}

function getLmsProviderName(lmsProviderId){
	if(lmsProviderId==36){
		return 'BUZZ';
	}else if(lmsProviderId==37){
		return 'BUZZ-GC';
	}else if(lmsProviderId==38){
		return 'BUZZ-GR';
	}else if(lmsProviderId==39){
		return 'Exact-Path';
	}else if(lmsProviderId==40){
		return 'Edmentum-Canvas';
	}else if(lmsProviderId==41){
		return 'Courseware';
	}else{
		return 'N/A';
	}
}


function callCourseProviderListForLMSSync(formId, elementId, type) {
	resetDropdown($('#studentFilter #lmsPlatform'), 'Select LMS Platform');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType : 'json',
		cache : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				$.each(result, function(k, v) {
					if((type=='LMSUSER' || type=='LMSENNROLLMENT') && (v.key==37 || v.key==38|| v.key==39|| v.key==40)){
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
					}else if(type=='VERIFYLMMSUSER' && (v.key==36 || v.key==37|| v.key==38|| v.key==39|| v.key==40)){
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
					}
				});
			}
		}
	});
}

function callAgilixbuzzSMSSync(access_token) {
	hideMessage('');
	customLoaderExternalPage(true);
	$("#errMsg").text('');
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : 'http://ims.internationalschooling.org:8090/ims/oneroster/sis-sync?access_token='+access_token,
		dataType : 'json',
		global : false,
		success : function(data) {
			if (data['code'] == 'failed' || data['code'] == 'exception') {
				$("#errMsg").text(data['message']);
				customLoaderExternalPage(false);
			} else {
				$("#errMsg").text('OneRoster.zip upload on "ftp.agilixbuzz.com" successfully, you will receive a SIS sync status mail on komal.ganjoo@internationalschooling.org');
				customLoaderExternalPage(false);
			}
			return false;
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}
var countCheck=0;
var lmsSyncInterval; 
async function syncLMS(token){
	var payload = {};
	payload['schoolId'] = SCHOOL_ID;
	payload['accessToken'] = token;
    var data = await getDashboardDataBasedUrlAndPayload(false, false,'sis-sync', payload);
	if (data.status == "1") {
		$("#syncLMSWrapper").removeClass("d-none");
		lmsSyncInterval = setInterval(syncLMSProcess, 30000);
	}else{
		return false;
	}
}

async function syncLMSProcess() {
	countCheck++;
	var payload = {};
	payload['schoolId'] = SCHOOL_ID;
	var data = await getDashboardDataBasedUrlAndPayload(false, false,'sis-sync-status', payload);
	if (data.status == "1") {
		$(".lms-sync-process-1 #process-status-1").html(getSyncLMSProcessStatusContent(data.details.CSV_DOWNLOAD ));
		$(".lms-sync-process-2 #process-status-2").html(getSyncLMSProcessStatusContent(data.details.CSV_UPLOAD));
		$(".lms-sync-process-3 #process-status-3").html(getSyncLMSProcessStatusContent(data.details.USER_SYNCED));
		$(".lms-sync-process-4 #process-status-4").html(getSyncLMSProcessStatusContent(data.details.EMAIL_VERIFIED));
		$(".lms-sync-process-5 #process-status-5").html(getSyncLMSProcessStatusContent(data.details.ENROLLMENT_SYNCED));
		var breakIntervalCheck=false;
		if(data.details.CSV_DOWNLOAD=='W' && data.details.CSV_UPLOAD=='W' && data.details.USER_SYNCED=='W' && data.details.EMAIL_VERIFIED=='W'  && data.details.ENROLLMENT_SYNCED=='W'){
			breakIntervalCheck=true;
		}else if(data.details.CSV_DOWNLOAD=='C' && data.details.CSV_UPLOAD=='C' && data.details.USER_SYNCED=='C' && data.details.EMAIL_VERIFIED=='C'  && data.details.ENROLLMENT_SYNCED=='C'){
			breakIntervalCheck=true;
		}
		if(countCheck>=50){
			breakIntervalCheck=true;
		}
		if(breakIntervalCheck){
			clearInterval(lmsSyncInterval);
			countCheck=0;
		}
	}else{
		return false;
	}
}

function getSyncLMSProcessStatusContent(status){
	var html=``;
	if(status == "P"){
		html+=
		`<div class="spinner-border spinner-border-sm text-primary" role="status">
			<span class="sr-only">Loading...</span>
		</div>`;
	}else if(status == "W"){
		html+=
		`<span>
			<i class="fa fa-clock text-warning"></i>
		</span>`;
	}else if(status == "C"){
		html+=
		`<span>
			<i class="fa fa-check text-success"></i>
		</span>`;
	}
	return html;
}