/**
 * DownloadReportsContent.js
 * -------------------------------------------------------------------------
 * Lead List "Excel Export" modal.
 *
 * Flow:
 *   1. "Excel Export" opens this modal (see LeadListContent.js #exportLead).
 *   2. "Generate New Report" — report name is prefilled from the current
 *      advanced-search filter selection (editable), then POSTed. The server
 *      builds the .xlsx on a background thread and uploads it to S3.
 *   3. Below it, the history table lists past reports (newest first) with
 *      Download (12h presigned link), Email to me, and Delete (with confirm).
 *
 * While any report is still "Under process" the list is polled every few
 * seconds so the progress bar / download link update on their own.
 *
 * Backend base: {schoolId}/dashboard/report/download-reports/<action>/<UNIQUEUUID>
 * (matches the existing dashboard export URL convention.)
 */

var DOWNLOAD_REPORTS_POLL_MS = 20000;
var __downloadReportsPollTimer = null;

/** Build the base URL for a download-reports action, mirroring getAsPost(). */
function downloadReportsUrl(action, id) {
	var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/report/download-reports/' + action;
	if (id !== undefined && id !== null && id !== '') {
		url += '/' + id;
	}
	url += '/' + UNIQUEUUID;
	return url;
}

/**
 * Collect the current advanced-search filter selection into the same key set
 * the server expects (identical to the legacy exportLead handler).
 */
function collectLeadReportFilters() {
	var formId = 'advanceLeadNewSearchForm';
	var f = {};

	var clickFrom = OBJECT_RIGHTS.clickFrom + '-' + OBJECT_RIGHTS.clickUserid;
	var callBadge = '';
	var calbag = clickFrom.split('-');
	if (calbag[0] == 'totalGreen') { callBadge = 'green'; }
	else if (calbag[0] == 'totalYellow') { callBadge = 'yellow'; }
	else if (calbag[0] == 'totalRed') { callBadge = 'red'; }
	else if (calbag[0] == 'totalWhite') { callBadge = 'white'; }
	else { callBadge = $("input[name='callBadgeSearch']:checked").val(); }
	if (callBadge == undefined) { callBadge = ''; }

	var clickBy = 'totalleads';
	if (OBJECT_RIGHTS.clickFrom != '') { clickBy = OBJECT_RIGHTS.clickFrom; }

	function selVal(id) {
		var v = $('#' + formId + ' #' + id).val();
		return v != undefined && v != null ? v : '';
	}
	function joined(id) {
		var v = $('#' + formId + ' #' + id).val();
		return (v != undefined && v != null && v.length > 0) ? v.join('@') : '';
	}

	f.callBadge = callBadge;
	f.clickBy = clickBy;
	f.leadFrom = OBJECT_RIGHTS.leadFrom;
	f.clickFrom = clickFrom;
	f.leadNo = selVal('leadNoSearch');
	f.leadSource = joined('leadSourceSearch');
	f.leadStatus = joined('leadStatusSearch');
	f.assignTo = joined('leadAssignToSearch');
	f.followupBy = $('#' + formId + " #followMedSearch option:selected").val() || '';
	f.email = selVal('leademailIdSearch');
	f.phoneNo = selVal('phoneNoSearch');
	f.stdFname = selVal('leadstdfnameSearch');
	f.gurdianFname = '';
	f.standard = $('#' + formId + " #leadGradeSearch option:selected").val() || '';
	f.country = selVal('countryIds');
	f.state = $('#' + formId + " #stateId option:selected").val() || '';
	f.city = $('#' + formId + " #cityId option:selected").val() || '';
	f.priority = '';
	f.toCall = selVal('callWithSearch');
	f.leadFollowStatus = '';
	f.demoAssignTo = $('#' + formId + " #leadDemoAssignSearch option:selected").val() || '';
	f.leadStartDate = selVal('leadStartDateSearch');
	f.leadEndDate = selVal('leadEndDateSearch');
	f.searchDateType = $('#' + formId + " #searchDateType option:selected").val() || '';
	f.lastTotalCallDay = '';
	f.acadmicYear = selVal('leadAcadmicYear');
	f.leadFullSearch = selVal('leadFullSearch');
	f.utmSource = selVal('utmSourceSearch');
	f.utmCampaign = joined('leadSearchCampaign');
	f.leadTemplate = selVal('leadSearchTemplate');
	var leadsFollowCount = $('#leadsFollowCount').val();
	f.totalCallDay = leadsFollowCount != undefined ? leadsFollowCount : 0;

	return f;
}

/** Build a human-friendly report name from the selected filters. */
function buildDynamicReportName() {
	var formId = 'advanceLeadNewSearchForm';
	var parts = ['Leads'];

	function selectedTexts(id, max) {
		var texts = [];
		$('#' + formId + ' #' + id + ' option:selected').each(function () {
			var t = $(this).text();
			if (t) { texts.push($.trim(t)); }
		});
		if (max && texts.length > max) {
			texts = texts.slice(0, max);
		}
		return texts;
	}

	var src = selectedTexts('leadSourceSearch', 2);
	if (src.length) { parts.push(src.join('-')); }
	var status = selectedTexts('leadStatusSearch', 2);
	if (status.length) { parts.push(status.join('-')); }
	var country = selectedTexts('countryIds', 2);
	if (country.length) { parts.push(country.join('-')); }
	var grade = $('#' + formId + " #leadGradeSearch option:selected").text();
	if (grade && $.trim(grade) && $('#' + formId + ' #leadGradeSearch').val()) {
		parts.push('Grade-' + $.trim(grade));
	}

	var start = $('#' + formId + ' #leadStartDateSearch').val();
	var end = $('#' + formId + ' #leadEndDateSearch').val();
	if (start && end) { parts.push(start + '_to_' + end); }
	else if (start) { parts.push('from_' + start); }

	var now = new Date();
	var stamp = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate())
		+ '_' + pad2(now.getHours()) + pad2(now.getMinutes());
	parts.push(stamp);

	// No spaces in report/file names — S3 keys and download filenames stay clean.
	var name = parts.join('_').replace(/\s+/g, '-');
	if (name.length > 200) { name = name.substring(0, 200); }
	return name;
}

function pad2(n) { return (n < 10 ? '0' : '') + n; }

/** Build (once) and open the modal. */
function openDownloadReportsModal() {
	if ($('#downloadReportsModal').length === 0) {
		injectDownloadReportsStyles();
		$('body').append(downloadReportsModalMarkup());
		bindDownloadReportsEvents();
	}
	$('#drReportName').val(buildDynamicReportName());
	setDownloadReportsMessage('', '');
	$('#downloadReportsModal').modal('show');
	loadDownloadReports();
}

function downloadReportsModalMarkup() {
	var html = '';
	html += '<div class="modal fade" id="downloadReportsModal" tabindex="-1" role="dialog" aria-hidden="true">';
	html += '  <div class="modal-dialog modal-lg" role="document">';
	html += '    <div class="modal-content">';
	html += '      <div class="modal-header">';
	html += '        <h5 class="modal-title">Excel Export &ndash; Reports</h5>';
	html += '        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	html += '      </div>';
	html += '      <div class="modal-body">';
	html += '        <div class="dr-generate-box">';
	html += '          <div class="dr-section-title">Generate New Report</div>';
	html += '          <div class="dr-generate-row">';
	html += '            <input type="text" id="drReportName" class="form-control" placeholder="Report name" maxlength="255" />';
	html += '            <button type="button" id="drGenerateBtn" class="btn btn-primary">Generate</button>';
	html += '          </div>';
	html += '          <div id="drMessage" class="dr-message"></div>';
	html += '        </div>';
	html += '        <div class="dr-section-title" style="margin-top:14px;">Generated Reports</div>';
	html += '        <div class="table-responsive">';
	html += '          <table class="table table-striped dr-table">';
	html += '            <thead><tr>';
	html += '              <th>S.No.</th><th>Report Name</th><th>Request Date</th><th>Duration</th>';
	html += '              <th>Generated By</th><th>Status</th><th class="text-center">Action</th>';
	html += '            </tr></thead>';
	html += '            <tbody id="drReportRows"><tr><td colspan="7" class="text-center">Loading&hellip;</td></tr></tbody>';
	html += '          </table>';
	html += '        </div>';
	html += '      </div>';
	html += '    </div>';
	html += '  </div>';
	html += '</div>';
	return html;
}

function injectDownloadReportsStyles() {
	if ($('#downloadReportsStyles').length > 0) { return; }
	var css = '';
	// Wide dialog so the report table is fully visible without scrolling.
	css += '#downloadReportsModal .modal-dialog{max-width:1140px;width:92%;}';
	css += '#downloadReportsModal .modal-body{max-height:calc(100vh - 180px);overflow-y:auto;}';
	css += '#downloadReportsModal .dr-generate-box{background:#f6f8fa;border:1px solid #e2e6ea;border-radius:6px;padding:14px;}';
	css += '#downloadReportsModal .dr-section-title{font-weight:600;margin-bottom:8px;font-size:14px;}';
	css += '#downloadReportsModal .dr-generate-row{display:flex;gap:10px;}';
	css += '#downloadReportsModal .dr-generate-row input{flex:1;}';
	css += '#downloadReportsModal .dr-message{margin-top:8px;font-size:13px;min-height:18px;}';
	css += '#downloadReportsModal .dr-message.success{color:green;}';
	css += '#downloadReportsModal .dr-message.error{color:#d9534f;}';
	css += '#downloadReportsModal .dr-table{font-size:12px;margin-top:6px;}';
	css += '#downloadReportsModal .dr-table th{white-space:nowrap;}';
	css += '#downloadReportsModal .dr-progress{background:#e9ecef;border-radius:10px;height:14px;width:120px;display:inline-block;overflow:hidden;vertical-align:middle;}';
	css += '#downloadReportsModal .dr-progress > span{display:block;height:100%;background:#4caf50;width:0;transition:width 2.5s linear;}';
	css += '#downloadReportsModal .dr-status-txt{font-size:11px;display:block;margin-top:2px;color:#555;}';
	css += '#downloadReportsModal .dr-badge-ready{color:#2e7d32;font-weight:600;text-decoration:underline;cursor:pointer;}';
	css += '#downloadReportsModal .dr-actions .dr-icon-btn{margin:0 3px;font-size:15px;}';
	css += '#downloadReportsModal .dr-badge-failed{color:#d9534f;font-weight:600;}';
	css += '#downloadReportsModal .dr-icon-btn{background:none;border:none;cursor:pointer;padding:2px 6px;font-size:14px;}';
	css += '#downloadReportsModal .dr-icon-btn.disabled{opacity:.35;cursor:not-allowed;}';
	css += '#downloadReportsModal .dr-download{color:#1565c0;}';
	css += '#downloadReportsModal .dr-email{color:#00897b;}';
	css += '#downloadReportsModal .dr-delete{color:#d9534f;}';
	$('head').append('<style id="downloadReportsStyles" type="text/css">' + css + '</style>');
}

function bindDownloadReportsEvents() {
	$('#downloadReportsModal').on('click', '#drGenerateBtn', function () {
		generateDownloadReport();
	});
	$('#downloadReportsModal').on('click', '.dr-download', function () {
		if ($(this).hasClass('disabled')) { return; }
		downloadOneReport($(this).data('id'));
	});
	$('#downloadReportsModal').on('click', '.dr-email', function () {
		if ($(this).hasClass('disabled')) { return; }
		emailOneReport($(this).data('id'));
	});
	$('#downloadReportsModal').on('click', '.dr-delete', function () {
		deleteOneReport($(this).data('id'), $(this).data('name'));
	});
	// Stop polling when the modal closes.
	$('#downloadReportsModal').on('hidden.bs.modal', function () {
		if (__downloadReportsPollTimer) {
			clearTimeout(__downloadReportsPollTimer);
			__downloadReportsPollTimer = null;
		}
	});
}

function setDownloadReportsMessage(text, type) {
	var el = $('#drMessage');
	el.removeClass('success error');
	if (type) { el.addClass(type); }
	el.html(text || '');
}

function generateDownloadReport() {
	var name = $.trim($('#drReportName').val());
	if (!name) {
		setDownloadReportsMessage('Please enter a report name.', 'error');
		return;
	}
	// Reuse the exact filter set the legacy CSV export sends
	// (getFormDataForExcelExport in LeadListContent.js) so the generated
	// report matches the existing export behaviour field-for-field.
	var filters;
	if (typeof getFormDataForExcelExport === 'function') {
		filters = parseUrlToJson('?' + getFormDataForExcelExport());
	} else {
		filters = collectLeadReportFilters();
	}
	var payload = {
		reportName: name,
		reportType: 'LEAD_SEARCH',
		filters: filters
	};
	$('#drGenerateBtn').prop('disabled', true).text('Starting...');
	$.ajax({
		url: downloadReportsUrl('create'),
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		// Override the global beforeSend (jquery.commonFunction.js), which wraps
		// every application/json body into {payload: encode(...)}. The /create
		// endpoint reads @RequestBody CreateReportRequest directly, so the body
		// must be sent as-is — otherwise reportName/filters arrive null and the
		// report ignores the Advance Search filters.
		beforeSend: function (xhr) {
			xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID);
		},
		success: function (res) {
			$('#drGenerateBtn').prop('disabled', false).text('Generate');
			if (res && res.status == 1) {
				setDownloadReportsMessage('Report generation started. It will appear below when ready.', 'success');
				$('#drReportName').val(buildDynamicReportName());
				loadDownloadReports();
			} else {
				setDownloadReportsMessage((res && res.message) ? res.message : 'Could not start report generation.', 'error');
			}
		},
		error: function () {
			$('#drGenerateBtn').prop('disabled', false).text('Generate');
			setDownloadReportsMessage('Could not start report generation. Please try again.', 'error');
		}
	});
}

function loadDownloadReports() {
	$.ajax({
		url: downloadReportsUrl('list'),
		type: 'GET',
		success: function (res) {
			if (res && res.status == 1) {
				renderDownloadReports(res.reports || []);
			} else {
				$('#drReportRows').html('<tr><td colspan="7" class="text-center">' +
					((res && res.message) ? res.message : 'Unable to load reports.') + '</td></tr>');
			}
		},
		error: function () {
			$('#drReportRows').html('<tr><td colspan="7" class="text-center">Unable to load reports.</td></tr>');
		}
	});
}

function renderDownloadReports(reports) {
	if (__downloadReportsPollTimer) {
		clearTimeout(__downloadReportsPollTimer);
		__downloadReportsPollTimer = null;
	}
	if (!reports.length) {
		$('#drReportRows').html('<tr><td colspan="7" class="text-center">No reports generated yet.</td></tr>');
		return;
	}

	// If only progress changed (same ids + statuses), update the bars in
	// place so the CSS width transition animates smoothly instead of the
	// whole table being re-rendered (which would reset each bar to 0).
	var signature = reports.map(function (r) { return r.id + ':' + r.status; }).join('|');
	var anyProcessingNow = reports.some(function (r) {
		return r.status !== 'READY' && r.status !== 'FAILED';
	});
	if ($('#drReportRows').data('signature') === signature && anyProcessingNow) {
		for (var k = 0; k < reports.length; k++) {
			var rp = reports[k];
			if (rp.status !== 'READY' && rp.status !== 'FAILED') {
				var pctNow = rp.progress || 0;
				$('#drRow-' + rp.id + ' .dr-progress > span').css('width', pctNow + '%');
				$('#drRow-' + rp.id + ' .dr-status-txt').html('Under process &ndash; ' + pctNow + '%');
			}
		}
		if ($('#downloadReportsModal').is(':visible')) {
			__downloadReportsPollTimer = setTimeout(loadDownloadReports, DOWNLOAD_REPORTS_POLL_MS);
		}
		return;
	}

	var html = '';
	var anyProcessing = false;
	for (var i = 0; i < reports.length; i++) {
		var r = reports[i];
		var statusCell = '';
		if (r.status === 'READY') {
			// Clickable — triggers the same presigned download as the icon.
			statusCell = '<a href="javascript:void(0)" class="dr-badge-ready dr-download" data-id="' + r.id + '">Ready for download</a>';
		} else if (r.status === 'FAILED') {
			statusCell = '<span class="dr-badge-failed">Failed</span>';
			if (r.errorMessage) {
				statusCell += '<span class="dr-status-txt">' + escapeHtmlDR(r.errorMessage) + '</span>';
			}
		} else {
			anyProcessing = true;
			var pct = r.progress || 0;
			statusCell = '<span class="dr-progress"><span style="width:' + pct + '%"></span></span>';
			statusCell += '<span class="dr-status-txt">Under process &ndash; ' + pct + '%</span>';
		}

		var ready = (r.status === 'READY');
		var dlDisabled = ready ? '' : ' disabled';
		// Single Action column: Download | Email | Delete (font-awesome, same
		// icon set the rest of the dashboard uses).
		var actionCell =
			'<button type="button" class="dr-icon-btn dr-download' + dlDisabled + '" title="Download" data-id="' + r.id + '"><i class="fa fa-download"></i></button>' +
			'<button type="button" class="dr-icon-btn dr-email' + dlDisabled + '" title="Email to me" data-id="' + r.id + '"><i class="fa fa-envelope"></i></button>' +
			'<button type="button" class="dr-icon-btn dr-delete" title="Delete" data-id="' + r.id +
			'" data-name="' + escapeAttrDR(r.reportName) + '"><i class="fa fa-trash"></i></button>';

		html += '<tr id="drRow-' + r.id + '">';
		html += '<td>' + (i + 1) + '</td>';
		html += '<td>' + escapeHtmlDR(r.reportName) + '</td>';
		html += '<td>' + escapeHtmlDR(r.requestDate) + '</td>';
		html += '<td>' + escapeHtmlDR(r.duration || '-') + '</td>';
		html += '<td>' + escapeHtmlDR(r.generatedBy || '-') + '</td>';
		html += '<td>' + statusCell + '</td>';
		html += '<td class="text-center dr-actions">' + actionCell + '</td>';
		html += '</tr>';
	}
	$('#drReportRows').html(html).data('signature', signature);

	// Keep polling while anything is still generating.
	if (anyProcessing && $('#downloadReportsModal').is(':visible')) {
		__downloadReportsPollTimer = setTimeout(loadDownloadReports, DOWNLOAD_REPORTS_POLL_MS);
	}
}

function downloadOneReport(id) {
	$.ajax({
		url: downloadReportsUrl('download', id),
		type: 'GET',
		success: function (res) {
			if (res && res.status == 1 && res.url) {
				window.open(res.url, '_blank');
			} else {
				setDownloadReportsMessage((res && res.message) ? res.message : 'This report is not ready to download yet.', 'error');
			}
		},
		error: function () {
			setDownloadReportsMessage('Could not fetch the download link. Please try again.', 'error');
		}
	});
}

function emailOneReport(id) {
	setDownloadReportsMessage('Sending report to your email&hellip;', '');
	$.ajax({
		url: downloadReportsUrl('email', id),
		type: 'POST',
		success: function (res) {
			if (res && res.status == 1) {
				setDownloadReportsMessage(res.message || 'Report emailed to you.', 'success');
			} else {
				setDownloadReportsMessage((res && res.message) ? res.message : 'Could not email the report.', 'error');
			}
		},
		error: function () {
			setDownloadReportsMessage('Could not email the report. Please try again.', 'error');
		}
	});
}

function deleteOneReport(id) {
	showWarningMessage('Are you sure you want to delete?', 'deleteOneReportConfirmed(' + id + ')');
}

function deleteOneReportConfirmed(id) {
	$.ajax({
		url: downloadReportsUrl('delete', id),
		type: 'POST',
		success: function (res) {
			if (res && res.status == 1) {
				setDownloadReportsMessage(res.message || 'Report deleted.', 'success');
				loadDownloadReports();
			} else {
				setDownloadReportsMessage((res && res.message) ? res.message : 'Could not delete the report.', 'error');
			}
		},
		error: function () {
			setDownloadReportsMessage('Could not delete the report. Please try again.', 'error');
		}
	});
}

function escapeHtmlDR(s) {
	if (s === undefined || s === null) { return ''; }
	return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttrDR(s) {
	if (s === undefined || s === null) { return ''; }
	return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
