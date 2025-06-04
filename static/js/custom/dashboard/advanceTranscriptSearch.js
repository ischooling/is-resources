function advanceTranscriptSearchStudent(formId, moduleId) {
	customLoader(true);
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','advance-transcript-search-content'),
		data : JSON.stringify(getCallRequestForAdvanceTranscriptSearchStudent(formId, moduleId)),
		dataType : 'html',
		async:true,
		success : function(htmlContent) {
			if(htmlContent!=""){
            	var stringMessage = [];
            	stringMessage = htmlContent.split("|");
        		if(stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT"){
        			if(stringMessage[0] == "SESSIONOUT"){
        				redirectLoginPage();
        			}else{
        				showMessage(true, stringMessage[1]);
						customLoader(false);
        			}
        		} else {
    				$('#advTranscriptSearch').modal('hide');
    				$('#advance-search-content').html(htmlContent);
					customLoader(false);
        		}
				customLoader(false);
        		return false;
			}
		}
	});
}

function getCallRequestForAdvanceTranscriptSearchStudent(formId, moduleId){
	var requestTranscriptSearch = {};
	var authentication = {};
	var advanceTranscriptSearchDTO = {};
	advanceTranscriptSearchDTO['moduleId'] = moduleId;
	advanceTranscriptSearchDTO['gradeId'] = $("#"+formId+" #gradeId").select2('val');
	advanceTranscriptSearchDTO['studentName'] = $("#"+formId+" #studentName").val().trim();
	advanceTranscriptSearchDTO['studentEmail'] = $("#"+formId+" #studentEmail").val().trim();
	advanceTranscriptSearchDTO['countryId'] = $("#"+formId+" #countryId").select2('val');
	advanceTranscriptSearchDTO['studentRollNumber'] = $("#"+formId+" #studentRollNumber").val().trim();
	advanceTranscriptSearchDTO['sortBy'] = $("#"+formId+" #sortBy").select2('val');
	advanceTranscriptSearchDTO['startPosition'] = $("#"+formId+" #startPosition").val().trim();
	advanceTranscriptSearchDTO['activeSession'] = $("#"+formId+" #activeSession").val();
	advanceTranscriptSearchDTO['numberOfRecords'] = $("#"+formId+" #numberOfRecords").val().trim();
	advanceTranscriptSearchDTO['schoolUUID'] = SCHOOL_UUID;
	advanceTranscriptSearchDTO['schoolId'] = SCHOOL_ID;
	advanceTranscriptSearchDTO['transcriptStatus'] = $("#"+formId+" #transcriptStatus").select2('val');
	requestTranscriptSearch['advanceTranscriptSearchDTO'] = advanceTranscriptSearchDTO;
	authentication['hash'] = getHash();
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "SCHOOL";
	authentication['schoolId'] = SCHOOL_ID;
	authentication['userId'] = USER_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	requestTranscriptSearch['authentication'] = authentication;

	return requestTranscriptSearch;

}

function advanceTranscriptSearchStudentReset(formId){
	$("#"+formId+" #schoolId").val(SCHOOL_ID).trigger('change');
	$("#"+formId+" #gradeId").val('').trigger('change');
	$("#"+formId+" #activeSession").val('').trigger('change');
	$("#"+formId+" #studentName").val('');
	$("#"+formId+" #studentEmail").val('');
	$("#"+formId+" #countryId").val('').trigger('change');
	$("#"+formId+" #studentRollNumber").val('');
	$("#"+formId+" #sortBy").val('DESC').trigger('change');

	$("#"+formId+" #startPosition").val('0');
	$("#"+formId+" #numberOfRecords").val('25');
}