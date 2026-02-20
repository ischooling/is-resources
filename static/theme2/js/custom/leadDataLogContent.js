function renderLeadDataLogContent(rootId, leadData) {
  var data = leadData || getLeadDataLogDummyData();
  var root = $('#' + rootId);
  if (!root.length) return;

  var facebookBadge='';
  if(data.facebookStatus=='Enrolled'){
    facebookBadge='green';
  }else if(data.facebookStatus=='Positive'){
    facebookBadge='#aeae64';
  }else if(data.facebookStatus=='Demo'){
    facebookBadge='orange';
  }else if(data.facebookStatus=='Lead'){
    facebookBadge='blue';
  }
  var categoryBadge="";
  if(data.leadCategory=='Hot'){
    categoryBadge='bg-success text-white'
  }else if(data.leadCategory=='Cold'){
    categoryBadge='bg-primary text-white'
  }else if(data.leadCategory=='Warm'){
    categoryBadge='bg-warning'
  }

  var priorityColor='bg-warning text-dark';
    if(data.leadPriority=='Urgent'){
        priorityColor='bg-success';
    }else if(data.leadPriority=='Normal'){
        priorityColor='bg-orange';
    }else if(data.leadPriority=='Important'){
        priorityColor='bg-warning text-dark';
    }else{
      priorityColor='';
    }



  var html = '';

  html += '<div class="row">';

  html += '<div class="col-lg-8 mb-3">';
  html += '<div class="main-card card">';
  html += '<div class="card-header bg-primary text-white">Basic Info Section</div>';
  html += '<div class="card-body p-3">';
  html += '<div class="row mb-2">'
    + '<div class="col-md-3 col-6 mb-2"><div class="border rounded p-2 bg-light"><small class="text-muted">LEAD NO</small><div class="font-weight-bold">' + safe(data.leadNo) + '</div></div></div>'
    + '<div class="col-md-3 col-6 mb-2"><div class="border rounded p-2 bg-light"><small class="text-muted">Lead Score</small><div class="font-weight-bold">' + safe(data.leadScore) + ' <span class="badge '+priorityColor+' ml-1">' + safe(data.leadPriority) + '</span></div></div></div>'
    + '<div class="col-md-3 col-6 mb-2"><div class="border rounded p-2 bg-light"><small class="text-muted">Lead Status</small><div class="font-weight-bold">' + safe(data.leadStatus) + '</div></div></div>'
    + '<div class="col-md-3 col-6 mb-2"><div class="border rounded p-2 bg-light"><small class="text-muted">Assigned To</small><div class="font-weight-bold">' + safe(data.assignedTo) + '</div></div></div>'
    + '</div>';

  html += '<div class="border rounded mb-2">';
  html += '<div class="px-2 py-1 bg-primary text-white border-bottom d-flex align-items-center justify-content-between font-weight-bold">Lead Details</div>';
  html += '<table class="table table-bordered mb-0" style="font-size:11px"><tbody>';
  html += '<tr><td style="width:20%"><b>Lead Category</b></td><td style="width:30%"><span class="'+categoryBadge+' text-center  badge font-10">' + safe(data.leadCategory) + '</span></td><td style="width:20%"><b>Source</b></td><td style="width:30%">' + safe(data.source) + '<span style="color: '+facebookBadge+';font-size:15px;"><i class="fa fa-check-circle"></i></span></td></tr>';
  html += '<tr><td><b>Created date & time</b></td><td>' + safe(data.createdAt) + '</td><td><b>Added By</b></td><td>' + safe(data.addedBy) + '</td></tr>';
  html += '<tr><td><b>Parent Name</b></td><td>' + safe(data.parentName) + '</td><td><b>Child Name</b></td><td>' + safe(data.childName) + '</td></tr>';
  html += '<tr><td><b>Age</b></td><td>' + safe(data.age) + '</td><td><b>Grade</b></td><td>' + safe(data.grade) + '</td></tr>';
  html += '<tr><td><b>City | Country</b></td><td>' + safe(data.location) + '</td><td></td><td></td></tr>';
  html += '<tr><td><b>Mobile</b></td><td>' + safe(data.mobile) + '</td><td><b>Alt Mobile</b></td><td>' + safe(data.altmobile) + '</td></tr>';
  html += '<tr><td><b>Email</b></td><td>' + safe(data.email) + '</td><td><b>Alt Email</b></td><td>' + safe(data.alteremail || data.altemail) + '</td></tr>';
  html += '<tr><td><b>Modified Date</b></td><td>' + safe(data.modifiedDate) + '</td><td><b>Modified By</b></td><td>' + safe(data.modifiedBy) + '</td></tr>';
  html += '<tr><td><b>Moved Date</b></td><td>' + safe(data.movedDate) + '</td><td><b>Moved By</b></td><td>' + safe(data.movedBy) + '</td></tr>';
  html += '<tr><td><b>Moved Remark</b></td><td colspan="3">' + safe(data.movedRemark) + '</td></tr>';
  html += '</tbody></table></div>';

  html += '<div class="border rounded mb-2">';
  html += '<div><table class="table table-bordered mb-0" style="font-size:11px"><tbody>';
  html += '<tr><td style="width:20%"><b>Communication Notes</b></td><td>'
    + '<b>Remarks:</b> ' + safe(data.academicRemark)
    + ' | <b>Message:</b> ' + safe(data.message)
    + '</td></tr>';
  html += '</tbody></table></div></div>';

  html += '<div class="border rounded mb-2">';
  html += '<div class="px-2 py-1 bg-primary text-white border-bottom d-flex justify-content-between align-items-center font-weight-bold">Agent Call Detail<span class="badge badge-light text-primary">' + ((data.aidataList && data.aidataList.length) ? data.aidataList.length : 0) + '</span></div>';
  html += '<div class="table-responsive" style="overflow-x:auto;">';
  html += '<table class="table table-bordered table-sm mb-0" style="font-size:11px;width:100%;min-width:1500px;"><thead class="bg-light">';
  html += '<tr><th>Call Summary</th><th>Recording URL</th><th>Child Name</th><th>Child Age</th><th>Total Duration (Seconds)</th><th>Updated Demo Timezone</th><th>Updated Demo Time</th></tr>';
  html += '</thead><tbody>';
  if (data.aidataList && data.aidataList.length>0) {
    var getAgentValue = function (entries, key) {
      for (var e = 0; e < entries.length; e++) {
        var entry = entries[e] || {};
        if (String(entry.key || '') === key) {
          return entry.value;
        }
      }
      return '';
    };
    for (var a = 0; a < data.aidataList.length; a++) {
      var adRaw = data.aidataList[a] || {};
      var adParsed = adRaw.dataAgent;
      if (typeof adParsed === 'string') {
        try {
          adParsed = JSON.parse(adParsed);
        } catch (err) {
          adParsed = [];
        }
      }

      var adEntries = [];
      if (Array.isArray(adParsed)) {
        adEntries = adParsed;
      } else if (adParsed && typeof adParsed === 'object') {
        if (adParsed.key !== undefined) {
          adEntries = [adParsed];
        } else {
          var keys = Object.keys(adParsed);
          for (var k = 0; k < keys.length; k++) {
            adEntries.push({ key: keys[k], value: adParsed[keys[k]] });
          }
        }
      }

      var call_summary = getAgentValue(adEntries, 'call_summary');
      var recordingUrl = getAgentValue(adEntries, 'recording_url');
      var child_name = getAgentValue(adEntries, 'child_name');
      var child_age = getAgentValue(adEntries, 'child_age');
      var total_duration_seconds = getAgentValue(adEntries, 'total_duration_seconds') || '0';
      var updated_demo_timezone = getAgentValue(adEntries, 'updated_demo_timezone');
      var updated_demo_time = getAgentValue(adEntries, 'updated_demo_time');

      var recordingCell = recordingUrl
        ? '<audio controls style="height:40px; transform:scale(0.9);">'
            + '<source src="' + safe(recordingUrl) + '">'
            + 'Your browser does not support the audio element.'
          + '</audio>'
        : '<span style="margin-left: 22%;">N/A</span>';
      html += '<tr>'
        + '<td style="white-space:normal;word-break:break-word;min-width:360px;max-width:520px;">' + safe(call_summary) + '</td>'
        + '<td>' + recordingCell + '</td>'
        + '<td>' + safe(child_name) + '</td>'
        + '<td>' + safe(child_age) + '</td>'
        + '<td>' + safe(total_duration_seconds) + '</td>'
        + '<td>' + safe(updated_demo_timezone) + '</td>'
        + '<td>' + safe(updated_demo_time) + '</td>'
        + '</tr>';
    }
  } else {
    html += '<tr><td colspan="7" class="text-center text-muted">No agent call details.</td></tr>';
  }
  html += '</tbody></table></div></div>';

  

  html += '<div class="border rounded">';
  html += '<div class="px-2 py-1 bg-primary text-white border-bottom d-flex justify-content-between align-items-center font-weight-bold">UTM Campaign Info Logs<span class="badge badge-light text-primary">' + ((data.utmLogs && data.utmLogs.length) ? data.utmLogs.length : 0) + '</span></div>';
  html += '<div class="table-responsive" style="overflow-x:auto;">';
  html += '<table class="table table-bordered mb-0" style="font-size:11px;width:100%;min-width:1700px;"><thead class="bg-light">';
  html += '<tr><th>#</th><th>Date & Time</th><th>Lead No</th><th>Utm Source</th><th>Utm Medium</th><th>Utm Campaign</th><th>Utm Content</th><th>GCLID</th><th>Source</th><th>Active Status</th><th>Added Type</th></tr>';
  html += '</thead><tbody>';
  var utmLogsInline = data.utmLogs || (data.utm ? [data.utm] : []);
  if (utmLogsInline.length) {
    for (var ul = 0; ul < utmLogsInline.length; ul++) {
      var ut = utmLogsInline[ul] || {};
      html += '<tr>'
        + '<td>' + (ul + 1) + '</td>'
        + '<td>' + safe(ut.at) + '</td>'
        + '<td>' + safe(ut.utmLeadNo) + '</td>'
        + '<td>' + safe(ut.sourceName) + '</td>'
        + '<td>' + safe(ut.source) + '</td>'
        + '<td>' + safe(ut.medium) + '</td>'
        + '<td>' + safe(ut.campaign) + '</td>'
        + '<td>' + safe(ut.content) + '</td>'
        + '<td>' + safe(ut.term) + '</td>'
        + '<td>' + safe(ut.activeStatus) + '</td>'
        + '<td>' + safe(ut.addedType) + '</td>'
        + '</tr>';
    }
  } else {
    html += '<tr><td colspan="12" class="text-center text-muted">No UTM campaign logs.</td></tr>';
  }
  html += '</tbody></table></div></div>';

  html += '<div class="border rounded mt-2">';
  html += '<div class="px-2 py-1 bg-primary text-white border-bottom d-flex justify-content-between align-items-center font-weight-bold">Demo Info Logs<span class="badge badge-light text-primary">' + ((data.demoLogs && data.demoLogs.length) ? data.demoLogs.length : 0) + '</span></div>';
  html += '<div class="table-responsive" style="overflow-x:auto;">';
  html += '<table class="table table-bordered table-sm mb-0" style="font-size:11px;width:100%;min-width:900px;"><thead class="bg-light">';
  html += '<tr><th>Date & Time</th><th>Status</th><th>Assigned To</th><th>Transcript</th><th>Remarks</th></tr>';//<th>Recording Link</th>
  html += '</thead><tbody>';
  if (data.demoLogs && data.demoLogs.length) {
    for (var i = 0; i < data.demoLogs.length; i++) {
      var d = data.demoLogs[i] || {};
      var recLink = d.recordingSummary; //? '<a href="' + safe(d.recordingSummary) + '" target="_blank">View</a>' : 'N/A';
      html += '<tr>'
        + '<td>' + safe(d.at) + '</td>'
        + '<td>' + safe(d.status) + '</td>'
        + '<td>' + safe(d.assignedTo) + '</td>';
        if(d.recordingSummary!=""){
          html += '<td><button type="button" class="btn btn-sm btn-primary" onclick="callMeetingRecordingSummary(\''+d.leadId+'\',\''+d.leadNo+'\')">View Detail Summary</button></td>';
        }else{
          html += '<td></td>';
        }
        html += ''
        + '<td>' + safe(d.remarks) + '</td>'
        + '</tr>';
    }
  } else {
    html += '<tr><td colspan="6" class="text-center text-muted">No demo logs.</td></tr>';
  }
  html += '</tbody></table></div></div>';

  html += '<div class="border rounded mt-2">';
  html += '<div class="px-2 py-1 bg-primary text-white border-bottom d-flex justify-content-between align-items-center font-weight-bold">History Logs | Lead merge Info<span class="badge badge-light text-primary">' + ((data.mergeLeadLogs && data.mergeLeadLogs.length) ? data.mergeLeadLogs.length : 0) + '</span></div>';
  html += '<div class="table-responsive" style="overflow-x:auto;">';
  html += '<table class="table table-bordered table-sm mb-0" style="font-size:11px;width:100%;min-width:3300px;"><thead class="bg-light">';
  html += '<tr><th>Lead No</th><th>Lead Score</th><th>Lead Priority</th><th>Lead Category</th><th>Source</th><th>Created Date & Time</th><th>Parent Name</th><th>Child Name</th><th>Age</th><th>Grade</th><th>Email</th><th>Alt Email</th><th>City | Country</th><th>Mobile</th><th>Alt Mobile</th><th>Lead Status</th><th>Assigned To</th><th>Added By</th><th>Modified Date</th><th>Modified By</th><th>Moved Date</th><th>Moved By</th><th>Moved Remark</th><th>Lead Remark</th><th>Message</th></tr>';//<th>Academic Remark</th><th>Agent</th><th>Call Recording</th><th>Call Badge</th>
  html += '</thead><tbody>';
  if (data.mergeLeadLogs && data.mergeLeadLogs.length) {
    for (var m = 0; m < data.mergeLeadLogs.length; m++) {
      var ml = data.mergeLeadLogs[m] || {};
      html += '<tr>'
        + '<td>' + safe(ml.leadNo) + '</td>'
        + '<td>' + safe(ml.leadScore) + '</td>'
        + '<td>' + safe(ml.leadPriority) + '</td>'
        + '<td>' + safe(ml.leadCategory) + '</td>'
        + '<td>' + safe(ml.source) + '</td>'
        + '<td>' + safe(ml.createdAt) + '</td>'
        + '<td>' + safe(ml.parentName) + '</td>'
        + '<td>' + safe(ml.childName) + '</td>'
        + '<td>' + safe(ml.age) + '</td>'
        + '<td>' + safe(ml.grade) + '</td>'
        + '<td>' + safe(ml.email) + '</td>'
        + '<td>' + safe(ml.alteremail) + '</td>'
        + '<td>' + safe(ml.location) + '</td>'
        + '<td>' + safe(ml.mobile) + '</td>'
        + '<td>' + safe(ml.altmobile) + '</td>'
        + '<td>' + safe(ml.leadStatus) + '</td>'
        + '<td>' + safe(ml.assignedTo) + '</td>'
        + '<td>' + safe(ml.addedBy) + '</td>'
        + '<td>' + safe(ml.modifiedDate) + '</td>'
        + '<td>' + safe(ml.modifiedBy) + '</td>'
        + '<td>' + safe(ml.movedDate) + '</td>'
        + '<td>' + safe(ml.movedBy) + '</td>'
        + '<td>' + safe(ml.movedRemark) + '</td>'
        + '<td>' + safe(ml.leadRemark) + '</td>'
        + '<td>' + safe(ml.message) + '</td>'
        + '</tr>';
    }
  } else {
    html += '<tr><td colspan="29" class="text-center text-muted">No lead merge | History Logs.</td></tr>';
  }
  html += '</tbody></table></div></div>';

  html += '<div class="border rounded mt-2">';
  html += '<div class="px-2 py-1 bg-primary text-white border-bottom d-flex justify-content-between align-items-center font-weight-bold">Changes Info Logs<span class="badge badge-light text-primary">' + ((data.basicInfoLogs && data.basicInfoLogs.length) ? data.basicInfoLogs.length : 0) + '</span></div>';
  html += '<div class="table-responsive" style="overflow-x:auto;">';
  html += '<table class="table table-bordered table-sm mb-0" style="font-size:11px;width:100%;min-width:1200px;"><thead class="bg-light">';
  html += '<tr><th>Field</th><th>Old Value</th><th>New Value</th><th>Lead No</th><th>Changed At</th><th>Changed By</th></tr>';
  html += '</thead><tbody>';
  var basicInfoLogsSorted = (data.basicInfoLogs || []).slice().sort(function (a, b) {
    var fieldA = (a && a.field ? String(a.field) : '').toLowerCase();
    var fieldB = (b && b.field ? String(b.field) : '').toLowerCase();
    if (fieldA < fieldB) return -1;
    if (fieldA > fieldB) return 1;

    var atRawA = a && a.at ? String(a.at) : '';
    var atRawB = b && b.at ? String(b.at) : '';
    var atTimeA = Date.parse(atRawA.replace(/,/g, ''));
    var atTimeB = Date.parse(atRawB.replace(/,/g, ''));

    if (!isNaN(atTimeA) && !isNaN(atTimeB)) {
      if (atTimeA < atTimeB) return -1;
      if (atTimeA > atTimeB) return 1;
      return 0;
    }

    var atA = atRawA.toLowerCase();
    var atB = atRawB.toLowerCase();
    if (atA < atB) return -1;
    if (atA > atB) return 1;
    return 0;
  });
  if (basicInfoLogsSorted.length) {
    for (var b = 0; b < basicInfoLogsSorted.length; b++) {
      var c = basicInfoLogsSorted[b] || {};
      html += '<tr>'
        
        + '<td>' + safe(c.field) + '</td>'
        + '<td>' + safe(c.oldValue) + '</td>'
        + '<td>' + safe(c.newValue) + '</td>'
        + '<td>' + safe(c.leadNo) + '</td>'
        + '<td>' + safe(c.at) + '</td>'
        + '<td>' + safe(c.by) + '</td>'
        + '</tr>';
    }
  } else {
    html += '<tr><td colspan="6" class="text-center text-muted">No basic info history logs.</td></tr>';
  }
  html += '</tbody></table></div></div>';
  html += '</div></div>';
  html += '</div>';

  html += '<div class="col-lg-4 mb-3">';

  html += '<div class="main-card mb-3 card">';
  html += '<div class="card-header bg-primary text-white">Follow-up Logs (Timeline)</div>';
  html += '<div class="card-body">';
  html += '<div class="vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column">';

  if (data.followups && data.followups.length) {
    for (var j = 0; j < data.followups.length; j++) {
      var f = data.followups[j] || {};
      html += '<div class="vertical-timeline-item vertical-timeline-element"><div>'
        + '<span class="vertical-timeline-element-icon bounce-in"><i class="badge badge-dot badge-dot-xl badge-primary d-inline-block"> </i></span>'
        + '<div class="vertical-timeline-element-content bounce-in">'
        + '<h5 class="timeline-title mb-1"><i class="fa fa-calendar-alt mr-1"></i>' + safe(f.at) + '</h5>'
        + '<span class="bold">' + safe(f.title) + '</span>'
        + '<p class="mb-1">' + safe(f.remarks) + '</p>'
        + '<small class="text-muted">' + safe(f.by) + '</small>'
        + '</div></div></div>';
    }
  } else {
    html += '<div class="vertical-timeline-item vertical-timeline-element">'
      + '<div class="vertical-timeline-element-content bounce-in">'
      + '<h4 class="timeline-title">No follow-up logs.</h4>'
      + '</div></div>';
  }

  html += '</div></div></div>';
  html += '</div>';

  html += '</div>';

  root.html(html);
}

function renderLeadDataLogPage(containerId, pageConfig, leadData) {
  var cfg = pageConfig || {};
  var root = $('#' + containerId);
  if (!root.length) return;

  var html = '';
  html += '<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">';
  html += '  <div class="sticky-header">';
  html += '    <div class="app-header header-shadow">';
  html += '      <div class="app-header__logo">';
  html += '        <a href="' + safe(cfg.schoolWebsite) + '" target="_blank" class="logo-src" style="background:url(' + safe(cfg.logoUrl) + ');"></a>';
  html += '      </div>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="app-main pb-4">';
  html += '    <div class="col p-0">';
  html += '      <div class="app-main__inner">';
  html += '        <div class="app-page-title mb-3 py-2">';
  html += '          <div class="page-title-wrapper">';
  html += '            <div class="page-title-heading">';
  html += '              <div class="page-title-icon"><i class="pe-7s-note2 text-primary"></i></div>';
  html += '              <div id="leadDataLogTitle">' + safe(cfg.title || 'Lead Logs Data') + '</div>';
  html += '            </div>';
  html += '          </div>';
  html += '        </div>';
  html += '        <div id="schoolReportContent" class="main-card mb-3 card body-tabs-shadow">';
  html += '          <div class="card-body">';
  html += '            <div id="leadDataLogRoot"></div>';
  html += '          </div>';
  html += '        </div>';
  html += '      </div>';
  html += '    </div>';
  html += '  </div>';
  html += '  <div class="app-wrapper-footer">';
  html += '    <div class="app-footer">';
  html += '      <div class="app-footer__inner">';
  html += '        <p style="margin: 0">Copyright &copy; ' + safe(cfg.copyrightYear || '') + ' - ' + safe(cfg.copyrightName || '') + ' - All Rights Reserved.</p>';
  html += '      </div>';
  html += '    </div>';
  html += '    <div class="server-message">';
  html += '      <span class="msg" id="msgTheme2"></span>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';
  html+=getDemoLogDetailSummary();
  root.html(html);
  renderLeadDataLogContent('leadDataLogRoot', leadData);
}

function safe(v) {
  if (v === null || v === undefined || v === '') return 'N/A';
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLeadDataLogDummyData() {
  return {
    leadNo: '',
    leadScore: '',
    leadPriority: '',
    leadCategory: '',
    source: '',
    createdAt: '',
    parentName: '',
    grade: '',
    email: '',
    altemail: '',
    alteremail: '',
    location: '',
    mobile: '',
    altmobile: '',
    leadStatus: '',
    assignedTo: '',
    addedBy: '',
    modifiedDate: '',
    modifiedBy: '',
    movedDate: '',
    movedBy: '',
    movedRemark: '',
    childName: '',
    age: '',
    academicRemark: '',
    message: '',
    agent: '',
    callRecording: '',
    mergeLeadLogs: [],
    aidataList: [],
    utmLogs: [],
    demoLogs: [],
    basicInfoLogs: [],
    followups: []
  };
}

function normalizeLeadDataLogData(apiResponse) {
  var base = getLeadDataLogDummyData();
  var apiData = apiResponse && apiResponse.data ? apiResponse.data : (apiResponse || {});
  var merged = Object.assign({}, base, apiData);

  if (!Array.isArray(merged.utmLogs)) merged.utmLogs = [];
  if (!Array.isArray(merged.demoLogs)) merged.demoLogs = [];
  if (!Array.isArray(merged.mergeLeadLogs)) merged.mergeLeadLogs = [];
  if (!Array.isArray(merged.aidataList)) merged.aidataList = [];
  if (!Array.isArray(merged.basicInfoLogs)) merged.basicInfoLogs = [];
  if (!Array.isArray(merged.followups)) merged.followups = [];
  return merged;
}

function renderLeadDataLogFromApi(rootId, apiResponse) {
  var normalized = normalizeLeadDataLogData(apiResponse);
  renderLeadDataLogContent(rootId, normalized);
  var titleEl = $('#leadDataLogTitle');
  if (titleEl.length && normalized && normalized.leadNo) {
    titleEl.text('Lead Logs Data - ' + normalized.leadNo);
  }
}

function getDemoLogDetailSummary(){
    var html=
        `<div class="modal fade" id="demodetailsummary" tabindex="-1" role="dialog" aria-labelledby="userActivityModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Demo detail summary (<span id="demosummaryleadno"></span>)</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="demosummarytxt" style="max-height: 75vh; overflow: auto;">
                        
                    </div>
                </div>
            </div>
        </div>`
    return html;
}