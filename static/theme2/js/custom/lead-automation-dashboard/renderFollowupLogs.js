function leadAutomationGetFollowupLogsContent() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var logs = state.followupLogs || [];
	var totalCount = state.followupLogsTotalCount || 0;
	var filterLeadId = state.followupLogsFilterLeadId || "";

	var html = [];
	html.push('<div class="lead-automation-sectionHeader">');
	html.push('<div class="lead-automation-sectionHeader__title">AI Follow-up Logs</div>');
	html.push('<div class="lead-automation-sectionHeader__sub">History of all automated follow-ups processed by the AI engine</div>');
	html.push('</div>');

	html.push(leadAutomationBuildCard(
		"Follow-up log (" + leadAutomationEscapeHtml(String(totalCount)) + " total)",
		'<div class="lead-automation-toolbar">' +
			'<input type="text" class="lead-automation-input" id="leadAutomationLogsFilterLeadId" placeholder="Filter by Lead No" value="' + leadAutomationEscapeHtml(filterLeadId) + '" style="max-width:200px;display:inline-block;">' +
			'<button type="button" class="lead-automation-btn ml-2" data-lead-automation-action="logs-search">Search</button>' +
			'<button type="button" class="lead-automation-btn lead-automation-btn--ghost ml-2" data-lead-automation-action="logs-clear">Clear</button>' +
		'</div>' +
		'<div class="lead-automation-tableWrap mt-3">' +
			'<table class="lead-automation-table">' +
				'<thead><tr>' +
					'<th>SR. No</th>' +
					'<th>Date</th>' +
					'<th>Lead No</th>' +
					'<th>Matched Resources</th>' +
					'<th>AI?</th>' +
					'<th>Template Mode</th>' +
					'<th>Status</th>' +
					'<th>Channel</th>' +
					'<th>Attachments</th>' +
					'<th>Action</th>' +
				'</tr></thead>' +
				'<tbody id="leadAutomationLogsTableBody">' +
					leadAutomationBuildFollowupLogsRows(logs) +
				'</tbody>' +
			'</table>' +
		'</div>' +
		'<div id="leadAutomationLogsPagination" class="mt-3"></div>',
		""
	));

	html.push(leadAutomationBuildFollowupLogDetailModal());

	return html.join("");
}

function leadAutomationBuildFollowupLogsRows(logs) {
	if (!logs || !logs.length) {
		return '<tr><td colspan="10" class="text-center text-muted">No follow-up logs found.</td></tr>';
	}
	var rows = "";
	var pageNum = (window.LEAD_AUTOMATION_STATE && window.LEAD_AUTOMATION_STATE.followupLogsPage) || 0;
	var pageSize = 10;
	$.each(logs, function (index, logItem) {
		var srNo = pageNum * pageSize + index + 1;
		var statusBadge = leadAutomationFollowupLogStatusBadge(logItem.sendStatus, logItem);
		var aiBadge = logItem.aiGenerated === "Y"
			? '<span class="lead-automation-badge lead-automation-badge--success">AI ✓</span>'
			: '<span class="lead-automation-badge lead-automation-badge--neutral">Template</span>';
		var tplMode = String(logItem.templateMode || "").trim();
		var tplModeBadge = tplMode === "Auto"
			? '<span class="lead-automation-badge lead-automation-badge--info">Auto</span>'
			: tplMode === "MANUAL"
				? '<span class="lead-automation-badge lead-automation-badge--neutral">MANUAL</span>'
				: '<span class="text-muted">-</span>';
		// Build attachment cell — clickable badge that opens file preview modal
		var mediaIdsStr    = String(logItem.selectedMediaIds  || "").trim();
		var fileUrlsStr    = String(logItem.selectedFileUrls  || "").trim();
		var resourceTitles = String(logItem.matchedResourceTitles || "").trim();
		var mediaCell;
		if (mediaIdsStr || fileUrlsStr) {
			var fileUrls = fileUrlsStr ? fileUrlsStr.split("\t").filter(function(u){ return u.trim() !== ""; }) : [];
			var idParts  = mediaIdsStr ? mediaIdsStr.split(",").filter(function(x){ return x.trim() !== ""; }) : [];
			var fileCount = fileUrls.length || idParts.length;
			// Encode data for the preview click handler
			var encodedUrls   = leadAutomationEscapeHtml(fileUrlsStr);
			var encodedTitles = leadAutomationEscapeHtml(resourceTitles);
			mediaCell = '<button type="button" class="lead-automation-badge lead-automation-badge--neutral" ' +
				'style="cursor:pointer;border:none;background:none;padding:0;" ' +
				'data-lead-automation-action="logs-preview-attachments" ' +
				'data-file-urls="' + encodedUrls + '" ' +
				'data-titles="' + encodedTitles + '" ' +
				'title="Click to preview attachments">' +
				fileCount + ' file' + (fileCount !== 1 ? 's' : '') +
				'</button>';
		} else {
			mediaCell = '<span class="text-muted">-</span>';
		}
		rows += '<tr data-followup-log-id="' + leadAutomationEscapeHtml(String(logItem.id || "")) + '">' +
			'<td>' + srNo + '</td>' +
			'<td>' + leadAutomationEscapeHtml(logItem.createdDate || "") + '</td>' +
			'<td><strong>' + leadAutomationEscapeHtml(String(logItem.leadNo || logItem.leadId || "")) + '</strong></td>' +
			'<td>' + leadAutomationEscapeHtml(logItem.matchedResourceTitles || "-") + '</td>' +
			'<td>' + aiBadge + '</td>' +
			'<td>' + tplModeBadge + '</td>' +
			'<td>' + statusBadge + '</td>' +
			'<td>' + leadAutomationEscapeHtml(logItem.channel || "-") + '</td>' +
			'<td>' + mediaCell + '</td>' +
			'<td>' +
				'<button type="button" class="lead-automation-rowAction" data-lead-automation-action="logs-view-detail" data-log-id="' + leadAutomationEscapeHtml(String(logItem.id || "")) + '" title="View email"><i class="fa fa-eye"></i></button>' +
			'</td>' +
			'</tr>';
	});
	return rows;
}

function leadAutomationFollowupLogStatusBadge(status, logItem) {
	var s = String(status || "").toUpperCase();
	var variant = "neutral";
	var label = s || "N/A";
	if (s === "SENT") { variant = "success"; }
	else if (s === "SCHEDULED") { variant = "info"; label = "Scheduled"; }
	else if (s === "FAILED") { variant = "danger"; }
	else if (s === "PREVIEW") { variant = "blue"; }
	else if (s === "PAUSED") { variant = "warning"; label = "Paused"; }
	else if (s === "SKIPPED") { variant = "neutral"; label = "Skipped"; }
	else if (s === "RESUMED") { variant = "info"; label = "Scheduled"; }
	else if (s === "PENDING_APPROVAL") { variant = "warning"; label = "Pending Approval"; }
	var badge = '<span class="lead-automation-badge lead-automation-badge--' + variant + '">' + leadAutomationEscapeHtml(label) + '</span>';
	// For Scheduled rows — append countdown timer if nextAllowedSlot is available
	if ((s === "SCHEDULED" || s === "RESUMED") && logItem && logItem.nextAllowedSlot) {
		var slotAttr = leadAutomationEscapeHtml(String(logItem.nextAllowedSlot));
		var friendlyText = logItem.nextSendText ? leadAutomationEscapeHtml(String(logItem.nextSendText)) : "";
		badge += '<div class="la-log-countdown" data-next-slot="' + slotAttr + '" style="margin-top:4px;font-size:11px;color:#1570ef;font-weight:500;white-space:nowrap;">'
			+ '<span class="la-log-countdown__timer"></span>'
			+ (friendlyText ? '<div style="font-size:10px;color:#667085;font-weight:400;margin-top:1px;">' + friendlyText + '</div>' : '')
			+ '</div>';
	}
	return badge;
}

/**
 * Starts a 1-second interval that refreshes all countdown timers in the logs table.
 * Call once after the table is rendered.
 */
function leadAutomationStartLogCountdowns() {
	if (window._laLogCountdownTimer) clearInterval(window._laLogCountdownTimer);
	function tick() {
		var now = new Date();
		$(".la-log-countdown").each(function () {
			var slotStr = $(this).data("next-slot");
			var timerEl = $(this).find(".la-log-countdown__timer");
			if (!slotStr) { timerEl.text(""); return; }
			// Parse "yyyy-MM-dd HH:mm:ss"
			var parts = String(slotStr).replace("T", " ").split(/[\s\-:]/);
			if (parts.length < 6) { timerEl.text(""); return; }
			var target = new Date(
				parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]),
				parseInt(parts[3]), parseInt(parts[4]), parseInt(parts[5])
			);
			var diffMs = target - now;
			if (diffMs <= 0) {
				timerEl.text("Sending soon");
				return;
			}
			var totalSec = Math.floor(diffMs / 1000);
			var days  = Math.floor(totalSec / 86400);
			var hrs   = Math.floor((totalSec % 86400) / 3600);
			var mins  = Math.floor((totalSec % 3600) / 60);
			var secs  = totalSec % 60;
			var text = "";
			if (days > 0)      text = days + "d " + hrs + "h " + mins + "m";
			else if (hrs > 0)  text = hrs + "h " + mins + "m " + secs + "s";
			else if (mins > 0) text = mins + "m " + secs + "s";
			else               text = secs + "s";
			timerEl.text(text);
		});
	}
	tick();
	window._laLogCountdownTimer = setInterval(tick, 1000);
}

function leadAutomationBuildFollowupLogDetailModal() {
	return [
		'<div id="leadAutomationLogDetailModal" class="lead-automation-modalBackdrop" aria-hidden="true">',
		'  <div class="lead-automation-modalCard" role="dialog" aria-modal="true" aria-labelledby="leadAutomationLogDetailModalTitle">',
		'    <div class="lead-automation-modalHeader">',
		'      <h5 class="lead-automation-modalTitle" id="leadAutomationLogDetailModalTitle">Follow-up email detail</h5>',
		'      <button type="button" class="lead-automation-modalClose" data-lead-automation-action="log-detail-close" aria-label="Close">&times;</button>',
		'    </div>',
		'    <div class="lead-automation-modalBody">',
		'      <div id="leadAutomationLogDetailRecipient" class="mb-2"></div>',
		'      <div id="leadAutomationLogDetailBody" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;font-size:13px;line-height:1.7;max-height:400px;overflow-y:auto;"></div>',
		'    </div>',
		'    <div class="lead-automation-modalFooter">',
		'      <button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-lead-automation-action="log-detail-close">Close</button>',
		'    </div>',
		'  </div>',
		'</div>',
	].join("");
}

/**
 * Opens a modal showing thumbnail previews for the attachments of a log row.
 * fileUrlsStr  — tab-separated file URLs
 * titlesStr    — comma-separated resource titles (used as fallback names)
 */
function leadAutomationShowAttachmentPreviewModal(fileUrlsStr, titlesStr) {
	// Remove stale modal if any
	$("#laAttachPreviewModal").remove();

	var fileUrls = (fileUrlsStr || "").split("\t").map(function(u){ return u.trim(); }).filter(Boolean);
	var titles   = (titlesStr  || "").split(",").map(function(t){ return t.trim(); }).filter(Boolean);

	var gridHtml = "";
	if (fileUrls.length === 0) {
		gridHtml = '<p class="text-muted" style="padding:20px;text-align:center;">No file URLs available for preview.</p>';
	} else {
		gridHtml = '<div style="display:flex;flex-wrap:wrap;gap:14px;padding:4px;">';
		for (var i = 0; i < fileUrls.length; i++) {
			var url   = fileUrls[i];
			var name  = titles[i] || ("File " + (i + 1));
			var lower = url.toLowerCase();
			var isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/.test(lower);
			var isVideo = /\.(mp4|webm|ogg|mov)(\?|$)/.test(lower);

			var thumbHtml;
			if (isImage) {
				thumbHtml = '<img src="' + leadAutomationEscapeHtml(url) + '" alt="' + leadAutomationEscapeHtml(name) + '" ' +
					'style="width:100%;height:100%;object-fit:cover;border-radius:6px;" />';
			} else if (isVideo) {
				thumbHtml = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f1f5f9;border-radius:6px;color:#64748b;">' +
					'<span style="font-size:32px;">&#127916;</span>' +
					'<span style="font-size:11px;margin-top:4px;">video</span></div>';
			} else {
				// PDF / other document
				thumbHtml = '<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fef3f2;border-radius:6px;color:#b42318;">' +
					'<span style="font-size:32px;">&#128196;</span>' +
					'<span style="font-size:11px;margin-top:4px;">pdf</span></div>';
			}

			gridHtml +=
				'<div style="width:130px;flex-shrink:0;cursor:pointer;" onclick="window.open(\'' + leadAutomationEscapeHtml(url) + '\',\'_blank\')" title="Open ' + leadAutomationEscapeHtml(name) + '">' +
					'<div style="width:130px;height:100px;border:1px solid #e4e7ec;border-radius:8px;overflow:hidden;background:#f9fafb;">' +
						thumbHtml +
					'</div>' +
					'<div style="margin-top:5px;font-size:11px;color:#344054;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;" title="' + leadAutomationEscapeHtml(name) + '">' +
						leadAutomationEscapeHtml(name) +
					'</div>' +
				'</div>';
		}
		gridHtml += '</div>';
	}

	var modalHtml =
		'<div id="laAttachPreviewModal" style="position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;">' +
			'<div id="laAttachPreviewBackdrop" style="position:absolute;inset:0;background:rgba(0,0,0,.5);"></div>' +
			'<div style="position:relative;background:#fff;border-radius:12px;width:640px;max-width:96vw;max-height:85vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.25);">' +
				'<div style="padding:14px 18px;border-bottom:1px solid #e4e7ec;display:flex;justify-content:space-between;align-items:center;">' +
					'<strong style="font-size:14px;color:#1f2937;">Attachments (' + fileUrls.length + ' file' + (fileUrls.length !== 1 ? 's' : '') + ')</strong>' +
					'<button type="button" id="laAttachPreviewClose" style="background:none;border:none;font-size:20px;cursor:pointer;color:#64748b;line-height:1;">&times;</button>' +
				'</div>' +
				'<div style="overflow-y:auto;padding:16px;flex:1;">' +
					gridHtml +
				'</div>' +
				'<div style="padding:10px 18px;border-top:1px solid #e4e7ec;text-align:right;">' +
					'<button type="button" id="laAttachPreviewCloseBtn" style="padding:6px 16px;border:1px solid #d0d5dd;border-radius:6px;background:#fff;font-size:13px;cursor:pointer;">Close</button>' +
				'</div>' +
			'</div>' +
		'</div>';

	$("body").append(modalHtml);

	$("#laAttachPreviewClose, #laAttachPreviewCloseBtn, #laAttachPreviewBackdrop").one("click", function () {
		$("#laAttachPreviewModal").remove();
	});
}

function leadAutomationRenderLogsPagination() {
	var state = window.LEAD_AUTOMATION_STATE || {};
	var totalCount = state.followupLogsTotalCount || 0;
	var pageSize = 10;
	var currentPage = state.followupLogsPage || 0;
	var totalPages = Math.ceil(totalCount / pageSize);
	var target = $("#leadAutomationLogsPagination");
	if (!target.length || totalPages <= 1) {
		if (target.length) target.html("");
		return;
	}
	var html = '<div style="display:flex;align-items:center;justify-content:center;gap:4px;flex-wrap:wrap;">';
	if (currentPage > 0) {
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-logs-page="' + (currentPage - 1) + '" style="padding:4px 10px;font-size:13px;">&larr; Prev</button>';
	}
	var startPage = Math.max(0, currentPage - 2);
	var endPage = Math.min(totalPages - 1, currentPage + 2);
	if (startPage > 0) {
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-logs-page="0" style="padding:4px 10px;font-size:13px;">1</button>';
		if (startPage > 1) html += '<span style="padding:0 4px;color:#94a3b8;">...</span>';
	}
	for (var p = startPage; p <= endPage; p++) {
		if (p === currentPage) {
			html += '<button type="button" class="lead-automation-btn" style="padding:4px 12px;font-size:13px;" disabled>' + (p + 1) + '</button>';
		} else {
			html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-logs-page="' + p + '" style="padding:4px 10px;font-size:13px;">' + (p + 1) + '</button>';
		}
	}
	if (endPage < totalPages - 1) {
		if (endPage < totalPages - 2) html += '<span style="padding:0 4px;color:#94a3b8;">...</span>';
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-logs-page="' + (totalPages - 1) + '" style="padding:4px 10px;font-size:13px;">' + totalPages + '</button>';
	}
	if (currentPage < totalPages - 1) {
		html += '<button type="button" class="lead-automation-btn lead-automation-btn--ghost" data-logs-page="' + (currentPage + 1) + '" style="padding:4px 10px;font-size:13px;">Next &rarr;</button>';
	}
	html += '<span style="margin-left:10px;font-size:12px;color:#94a3b8;">Page ' + (currentPage + 1) + ' of ' + totalPages + '</span>';
	html += '</div>';
	target.html(html);
}
