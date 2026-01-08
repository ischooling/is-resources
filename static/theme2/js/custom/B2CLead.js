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
