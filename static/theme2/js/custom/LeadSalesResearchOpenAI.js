function getAskDataFromLLM() {
	data={};
	data['user_query']=$("#salesresearch").val();
	data['userId']=USER_ID;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','ask-query-llm'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
        console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(data.recodSummary!=null && data.recodSummary!=""){
					var recodsSummary = JSON.parse(data.recodSummary)
					$("#lead-sales-research-text").html(formatOpenAIText(recodsSummary.reply))
				}else{
					$("#lead-sales-research-text").html("No relevant information found in the documents.");
				}
			}
		}
	});
}
