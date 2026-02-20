function callMeetingRecordingSummary(leadid, leadno) {
	data={};
	data['leadid']=leadid;
	data['userId']=USER_ID;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-meeting-recordings-summary'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
        console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$("#demosummaryleadno").text(leadno)
				$("#demosummarytxt").html(formatOpenAIText(data.demoDetailsummary))
				$("#demodetailsummary").modal('show')
			}
		}
	});
}

function callLeadPredictList(requestId, startLimit, batchSize) {
	var request = {};
	request['request_id'] = requestId;
	request['start_limit'] = startLimit
	request['batch_size'] = batchSize;
	

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-lead-predict-list'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log(data)
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			}else{
				renderPredictTableRows(data)
			}
			
		},
		error : function(err) {
			console.log(err)
		}
	});
}

function callLeadLogData(leadNo, leadType, callbackFn) {
	var request = {};
	request['userId'] = USER_ID;
	request['schoolId'] = SCHOOL_ID;
	request['leadNo'] = leadNo;
	request['leadType'] = leadType || 'B2C';
	request['moduleId'] = typeof MODULE_ID !== 'undefined' ? MODULE_ID : 0;
	

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-lead-log-data'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
				return;
			}
			if (typeof callbackFn === 'function') {
				callbackFn(data);
			}
		},
		error : function(err) {
			console.log(err);
		}
	});
}
