var LEAD_PREDICT_STATE = {
  requestId: '',
  startLimit: 0,
  batchSize: 200,
  totalRecords: 0,
  processedRecords: 0,
  currentRows: []
};

function renderLeadPredictListDashboard(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE) {
  $('#dashboardContentInHTML').html(getLeadPredictListMasterContent(title));
  callLeadPredictList(LEAD_PREDICT_STATE.requestId, LEAD_PREDICT_STATE.startLimit, LEAD_PREDICT_STATE.batchSize);

  $('#btnPredictLoad').on('click', function () {
    callLeadPredictList(LEAD_PREDICT_STATE.requestId, LEAD_PREDICT_STATE.startLimit, LEAD_PREDICT_STATE.batchSize);
  });
  
}

function renderPredictTableRows(data) {
  var predict_response=data && data.predict_response;
  
  var leadsList = data && data.leads ? data.leads : [];

  var html = '';
  if (!leadsList || leadsList.length === 0) {
    html = '<tr><td colspan="5" class="text-center text-muted">No records found.</td></tr>';
  } else {
    var srno=1;
    for (var l = 0; l < leadsList.length; l++) {
      var row = leadsList[l] || {};
      var priority="";

      if(predict_response!=null &&  predict_response.length>0){
          for (let li = 0; li < predict_response.length; li++) {
            var predict_results = predict_response[li].results;
            let matchingPredictions = predict_results.filter(result => result.lead_id === row.lead_id);
    
            for (let i = 0; i < matchingPredictions.length; i++) {
                let prediction = matchingPredictions[i];
    
                let conversion = prediction.conversion_probability != null
                    ? (Number(prediction.conversion_probability) * 100).toFixed(2) + '%'
                    : 'N/A';
    
                let reasonsText = prediction.reasons && prediction.reasons.length > 0
                    ? prediction.reasons.join(', ')
                    : 'N/A';
                
                priority=prediction.priority;
                // html += '<tr>'
                //     + '<td>' + (prediction.scores) + '</td>'
                //     + '<td>' + conversion + '</td>'
                //     + '<td>' + (prediction.priority) + '</td>'
                //     + '<td>' + (prediction.recommended_action) + '</td>'
                //     + '<td>' + reasonsText + '</td>'
                //     + '</tr>';
            }
            
          }
        }

        if(priority=='HIGH' || priority=='MEDIUM'){

          html += '<tr>'
            + '<td>' + (srno++) + '</td>'
            + '<td>' + (row.lead_id || 'N/A') + ' | '+priority+'</td>'
            + '<td>' + (row.source || 'N/A') + '</td>'
            + '<td>' + (row.country || 'N/A') + '</td>'
            + '<td>' + (row.lead_score) + '</td>'
            + '<td>' + (row.total_followups) + '</td>'
            + '<td>' + (row.total_calls) + '</td>'
            + '<td>' + (row.connected_calls) + '</td>'
            + '<td>' + (row.talk_time_seconds) + '</td>'
            + '<td>' + (row.whatsapp_count) + '</td>'
            + '<td>' + (row.email_count) + '</td>'
            + '<td>' + (row.demo_count) + '</td>'
            + '<td>' + (row.last_demo_days) + '</td>'
            + '<td>' + (row.demo_status) + '</td>'
            + '<td>' + (row.last_activity_days) + '</td>'
    
            + '</tr>';
        }
        
    }
  }

  $('#predictLeadTbody').html(html);
  
  //updatePredictPagerAndMeta(data);
  // var isDataTable = $.fn.dataTable.isDataTable('#tblPridictList');
  // if(isDataTable){
  //   $('#tblPridictList').dataTable().fnDestroy();
  // }
  // $('#tblPridictList').DataTable({
  //   pageLength: 100
  // });
}

function updatePredictPagerAndMeta(data) {
  var start = LEAD_PREDICT_STATE.startLimit;
  var shown = LEAD_PREDICT_STATE.currentRows.length;
  var fromNo = LEAD_PREDICT_STATE.totalRecords === 0 ? 0 : (start + 1);
  var toNo = LEAD_PREDICT_STATE.totalRecords === 0 ? 0 : (start + shown);
  var pageNo = LEAD_PREDICT_STATE.totalRecords === 0 ? 0 : (Math.floor(start / LEAD_PREDICT_STATE.batchSize) + 1);

  $('#predictMeta').text('Showing ' + fromNo + '-' + toNo + ' of ' + LEAD_PREDICT_STATE.totalRecords + ' records');
  $('#predictPageInfo').text('Page ' + pageNo + ' | Batch Size ' + LEAD_PREDICT_STATE.batchSize);

  //$('#predictRequestMeta').text(data.request_id || LEAD_PREDICT_STATE.requestId || 'N/A');
  $('#predictTotalMeta').text(LEAD_PREDICT_STATE.totalRecords);
  $('#predictProcessedMeta').text(LEAD_PREDICT_STATE.processedRecords);
  $('#predictBatchMeta').text(shown);

  var hasPrev = start > 0;
  var hasNext = (start + LEAD_PREDICT_STATE.batchSize) < LEAD_PREDICT_STATE.totalRecords;

  $('#btnPredictLoad').prop('disabled', false);
  $('#btnPredictPrev').prop('disabled', !hasPrev);
  $('#btnPredictNext').prop('disabled', !hasNext);
}
