function getAskDataFromLLM() {
	if($("#salesresearch").val().trim()==''){
		showMessageTheme2(0, 'Please enter your query','',true);
		return;
	}

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
					if(data.userquerylist!=null && data.userquerylist.length>0){
						var userQueryList=data.userquerylist;
						var html=`${userQueryList.map(query=>`
							<li class="list-group-item" onclick="getSalesQueryResponse('${query.id}')">${query.userQuery}</li>
						`).join('')}`;
						$("#lead-sales-research-query-list").html(html);
					}

				}else{
					$("#lead-sales-research-text").html("No relevant information found in the documents.");
				}
			}
		}
	});
}


function getSalesQueryResponse(id) {
	data={};
	data['user_query_id']=id;
	data['userId']=USER_ID;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-querydata-byid'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
        console.log(data.aiSalesQueryResponse);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				if(data.response!=null && data.response!=""){
					var recodsSummary = JSON.parse(data.response)
					$("#lead-sales-research-text").html(formatOpenAIText(recodsSummary.reply))
				}else{
					$("#lead-sales-research-text").html("No relevant information found in the documents.");
				}
			}
		}
	});
}
