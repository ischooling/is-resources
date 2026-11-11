/*
 * Communications > Email Logs: behaviour. Markup and styles are in emailLogsContent.js.
 * Server: {schoolId}/dashboard/email-logs/{search|detail|options} (EmailLogsAdminController),
 * which checks the session user, their school and their right on the email-logs menu.
 * Every value from the server is escaped before it reaches the page.
 */

var EMAIL_LOGS_STATE = { page: 1, total: 0, pageSize: 25, loading: false };
var EMAIL_LOGS_SAVED_KEY = 'emailLogs.savedFilters';

var EMAIL_LOG_SEND_LABELS = {
	SUCCESS: ['Sent', 'info'], FAILED: ['Refused by provider', 'bad'], EXCEPTION: ['Error while sending', 'bad'],
	CAPTURED: ['Not sent (captured)', 'warn'], QUEUED: ['Queued', 'warn'], INITIATE: ['Not sent (test mode)', 'warn'],
	OPTED_OUT: ['Not sent (everyone switched it off or is unsubscribed)', 'muted']
};
var EMAIL_LOG_DELIVERY_LABELS = {
	PROCESSED: ['Accepted', 'info'], DEFERRED: ['Delayed', 'warn'], DELIVERED: ['Delivered', 'ok'],
	BOUNCED: ['Bounced', 'bad'], BLOCKED: ['Blocked', 'bad'], DROPPED: ['Dropped', 'bad'],
	OPTED_OUT: ['Switched off by the person', 'muted']
};
var EMAIL_LOG_EVENT_LABELS = {
	processed: 'Accepted by SendGrid', deferred: 'Delayed by the receiving server', delivered: 'Delivered',
	open: 'Opened', click: 'Clicked a link', bounce: 'Bounced', dropped: 'Dropped by SendGrid',
	spamreport: 'Marked as spam', unsubscribe: 'Unsubscribed', group_unsubscribe: 'Unsubscribed from a group',
	group_resubscribe: 'Resubscribed'
};
var EMAIL_LOG_ROLE_LABELS = { STUDENT: 'Student', PARENT: 'Parent', TEACHER: 'Teacher' };
/* STATUS_REASON of an address the school unsubscribed (EmailSuppressionList.STATUS_REASON). */
var EMAIL_LOG_SCHOOL_UNSUBSCRIBED = 'Not sent: unsubscribed by the school';

/* [label, badge kind] for one address's delivery status; OPTED_OUT says which rule left it out. */
function elDeliveryLabel(status, reason) {
	if (!status) {
		return ['No report yet', 'muted'];
	}
	if (status === 'OPTED_OUT' && reason === EMAIL_LOG_SCHOOL_UNSUBSCRIBED) {
		return ['Unsubscribed by the school', 'muted'];
	}
	return EMAIL_LOG_DELIVERY_LABELS[status] || [status, 'muted'];
}

/* ---------- entry points (adminController.js and controller.js call getEmailLogsByEmail) ---------- */

function getEmailLogsByEmail(page) {
	initEmailLogsScreen();
	runEmailLogSearch(page || 1);
	// A profile's "Communications" shortcut asked for one person (adminController.js openPersonCommunications).
	var pending = null;
	try {
		pending = sessionStorage.getItem('emailLogs.person');
		sessionStorage.removeItem('emailLogs.person');
	} catch (e) {
		pending = null;
	}
	if (pending && parseInt(pending, 10) > 0) {
		openEmailLogPerson(parseInt(pending, 10));
	}
}

function initEmailLogsScreen() {
	if (!document.getElementById('emailLogsScreen')) {
		$('#dashboardContentInHTML').html(getEmailLogsContent('Email Logs'));
	}
	var screen = document.getElementById('emailLogsScreen');
	if (screen.dataset.bound === '1') {
		return;
	}
	screen.dataset.bound = '1';
	ensureEmailLogsStyles();
	setEmailLogSentPreset('TODAY');
	refreshEmailLogSavedList();

	$('#emailLogForm').on('submit', function (e) {
		e.preventDefault();
		runEmailLogSearch(1);
	});
	$('#elSentPreset').on('change', function () {
		setEmailLogSentPreset(this.value);
	});
	$('#elReset').on('click', function () {
		resetEmailLogFilters();
		runEmailLogSearch(1);
	});
	$(screen).on('click', '.el-chip', function () {
		applyEmailLogPreset(this.getAttribute('data-preset'));
		runEmailLogSearch(1);
	});
	$('#elPrev').on('click', function () {
		runEmailLogSearch(EMAIL_LOGS_STATE.page - 1);
	});
	$('#elNext').on('click', function () {
		runEmailLogSearch(EMAIL_LOGS_STATE.page + 1);
	});
	$('#elRows').on('click', '[data-email-id]', function () {
		openEmailLogDetail(parseInt(this.getAttribute('data-email-id'), 10), this.getAttribute('data-archived') === 'Y');
	});
	bindEmailLogProblems();
	bindEmailLogExports();
	bindEmailLogDeliverability();
	bindEmailLogPerson();
	bindEmailLogUnsubscribed();
	// "Unsubscribe this address": from an email's recipients or a problem address (asks why first).
	$('#elDrawerBody, #elProblemsRows').on('click', '[data-unsub-email]', function () {
		askEmailLogUnsubscribe('add', this.getAttribute('data-unsub-email'));
	});
	$('#elProblemsRows').on('click', '[data-suppression-email]', function () {
		loadEmailLogSuppressions(this.getAttribute('data-suppression-email'));
	});
	$('#elSuppression').on('click', '[data-clear-list]', function () {
		clearEmailLogSuppression(this.getAttribute('data-clear-email'), this.getAttribute('data-clear-list'));
	});
	$('#elDrawerBody').on('click', '#elResendButton', function () {
		resendEmailLog(parseInt(this.getAttribute('data-email-id'), 10), this.getAttribute('data-archived') === 'Y');
	});
	$('#elDrawerBody').on('click', '[data-open-email]', function () {
		openEmailLogDetail(parseInt(this.getAttribute('data-open-email'), 10), false);
	});
	$('#elSaveFilters').on('click', saveEmailLogFilters);
	$('#elApplySaved').on('click', function () {
		applySavedEmailLogFilters($('#elSaved').val());
	});
	$('#elDeleteSaved').on('click', function () {
		deleteSavedEmailLogFilters($('#elSaved').val());
	});
	bindEmailLogDrawer();
	loadEmailLogOptions();
}

/* ---------- small helpers ---------- */

function elEscape(value) {
	if (value === null || value === undefined) {
		return '';
	}
	return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function elBadge(label, kind, extraClass) {
	return '<span class="el-badge el-badge--' + kind + (extraClass ? ' ' + extraClass : '') + '">' + elEscape(label) + '</span>';
}

/* Today's date in IST as yyyy-mm-dd, whatever the admin's own time zone. */
function elIstDate(daysAgo) {
	var date = new Date(Date.now() - (daysAgo || 0) * 86400000);
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

function elChecked(group) {
	return $('#emailLogForm input[name="' + group + '"]:checked').map(function () { return this.value; }).get();
}

function elSetChecked(group, values) {
	$('#emailLogForm input[name="' + group + '"]').each(function () {
		this.checked = (values || []).indexOf(this.value) >= 0;
	});
}

/* Selected ids of a multiple select, as numbers. */
function elIds(id) {
	return ($('#' + id).val() || []).map(function (v) { return parseInt(v, 10); }).filter(function (v) { return v > 0; });
}

function elNumber(id) {
	var value = parseInt($('#' + id).val(), 10);
	return isNaN(value) || value < 1 ? null : value;
}

/* onRefused (optional) gets the server's refusal or the connection message instead of the toast,
   for a dialog that shows it next to the field. */
function elPost(path, request, onSuccess, onRefused) {
	// A super admin looking at another school: every call says which (EmailLogAccess checks it).
	if (EMAIL_LOGS_STATE.viewSchoolId) {
		request = $.extend({}, request, { viewSchoolId: EMAIL_LOGS_STATE.viewSchoolId });
	}
	$.ajax({
		contentType: APPLICATION_JSON_VALUE,
		type: 'POST',
		url: getURLForHTML('dashboard', 'email-logs/' + path),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function (response) {
			if (!response || response.status !== '1') {
				var refusal = (response && response.message) || 'The email logs could not be loaded just now. Please try again in a minute.';
				if (onRefused) {
					onRefused(refusal);
				} else {
					showMessageTheme2(0, refusal);
				}
				onSuccess(null);
				return;
			}
			if (response.message) {
				showMessageTheme2(1, response.message);
			}
			onSuccess(response.data);
		},
		error: function () {
			var unreachable = 'The email logs could not be reached. Check your connection and try again.';
			if (onRefused) {
				onRefused(unreachable);
			} else {
				showMessageTheme2(0, unreachable);
			}
			onSuccess(null);
		}
	});
}

/* ---------- filters ---------- */

function setEmailLogSentPreset(preset) {
	$('#elSentPreset').val(preset);
	var custom = preset === 'CUSTOM';
	$('.el-custom-date').prop('hidden', !custom);
	var ranges = { TODAY: [0, 0], YESTERDAY: [1, 1], LAST_7: [6, 0], LAST_30: [29, 0] };
	if (!custom && ranges[preset]) {
		$('#elSentFrom').val(elIstDate(ranges[preset][0]));
		$('#elSentTo').val(elIstDate(ranges[preset][1]));
	}
}

function collectEmailLogFilter(page) {
	return {
		sentFrom: $('#elSentFrom').val(),
		sentTo: $('#elSentTo').val(),
		recipient: $.trim($('#elRecipient').val()),
		subject: $.trim($('#elSubject').val()),
		roles: elChecked('role'),
		providers: elChecked('provider'),
		deliveryStatuses: elChecked('delivery'),
		sendStatuses: elChecked('send'),
		opened: $('#elOpened').val(),
		clicked: $('#elClicked').val(),
		minOpens: elNumber('elMinOpens'),
		minClicks: elNumber('elMinClicks'),
		categories: $('#elCategories').val() || [],
		emailType: $.trim($('#elEmailType').val()),
		attachments: $('#elAttachments').val(),
		body: $.trim($('#elBody').val()),
		bounceReason: $.trim($('#elBounceReason').val()),
		clickedLink: $.trim($('#elClickedLink').val()),
		eventFrom: $('#elEventFrom').val(),
		eventTo: $('#elEventTo').val(),
		sort: $('#elSort').val(),
		pageSize: parseInt($('#elPageSize').val(), 10) || 25,
		includeArchived: $('#elIncludeArchived').is(':checked'),
		sentBy: $.trim($('#elSentBy').val()),
		standardIds: elIds('elGrades'),
		batchIds: elIds('elBatches'),
		enrolmentTypes: elChecked('enrolment'),
		page: page
	};
}

function applyEmailLogFilter(f) {
	$('#elRecipient').val(f.recipient || '');
	$('#elSubject').val(f.subject || '');
	elSetChecked('role', f.roles);
	elSetChecked('provider', f.providers);
	elSetChecked('delivery', f.deliveryStatuses);
	elSetChecked('send', f.sendStatuses);
	$('#elOpened').val(f.opened || 'ANY');
	$('#elClicked').val(f.clicked || 'ANY');
	$('#elMinOpens').val(f.minOpens || '');
	$('#elMinClicks').val(f.minClicks || '');
	$('#elCategories').val(f.categories || []).trigger('change');
	$('#elEmailType').val(f.emailType || '');
	$('#elAttachments').val(f.attachments || '');
	$('#elBody').val(f.body || '');
	$('#elBounceReason').val(f.bounceReason || '');
	$('#elClickedLink').val(f.clickedLink || '');
	$('#elEventFrom').val(f.eventFrom || '');
	$('#elEventTo').val(f.eventTo || '');
	$('#elSort').val(f.sort || 'NEWEST');
	$('#elPageSize').val(String(f.pageSize || 25));
	$('#elIncludeArchived').prop('checked', !!f.includeArchived);
	$('#elSentBy').val(f.sentBy || '');
	$('#elGrades').val((f.standardIds || []).map(String)).trigger('change');
	$('#elBatches').val((f.batchIds || []).map(String)).trigger('change');
	elSetChecked('enrolment', f.enrolmentTypes);
	if (f.sentPreset && f.sentPreset !== 'CUSTOM') {
		setEmailLogSentPreset(f.sentPreset);
	} else {
		setEmailLogSentPreset('CUSTOM');
		$('#elSentFrom').val(f.sentFrom || '');
		$('#elSentTo').val(f.sentTo || '');
	}
}

function resetEmailLogFilters() {
	applyEmailLogFilter({ sentPreset: 'TODAY' });
}

function applyEmailLogPreset(name) {
	var presets = {
		bounced: { sentPreset: 'LAST_7', deliveryStatuses: ['BOUNCED', 'BLOCKED', 'DROPPED'] },
		failed: { sentPreset: 'TODAY', sendStatuses: ['FAILED', 'EXCEPTION'] },
		notOpened: { sentPreset: 'LAST_7', sendStatuses: ['SUCCESS'], opened: 'NONE' },
		feesNotOpened: { sentPreset: 'LAST_30', sendStatuses: ['SUCCESS'], opened: 'NONE', categories: ['Fees & payments'] },
		spam: { sentPreset: 'LAST_30', deliveryStatuses: ['SPAM_REPORT'] }
	};
	applyEmailLogFilter(presets[name] || { sentPreset: 'TODAY' });
	var more = presets[name] && (presets[name].deliveryStatuses || presets[name].opened || presets[name].categories || presets[name].sendStatuses);
	if (more) {
		document.getElementById('elMoreFilters').open = true;
	}
}

function loadEmailLogOptions() {
	elPost('options', {}, function (data) {
		if (!data) {
			return;
		}
		EMAIL_LOGS_STATE.canUpdate = !!data.canUpdate;
		// Reloaded when a super admin switches school: keep what was picked in the shared lists.
		var keptCategories = $('#elCategories').val() || [];
		var keptGrades = $('#elGrades').val() || [];
		var categories = (data.categories || []).map(function (c) {
			return '<option value="' + elEscape(c) + '">' + elEscape(c) + '</option>';
		}).join('');
		$('#elCategories').html(categories);
		$('#elEmailTypeList').html((data.emailTypes || []).map(function (t) {
			return '<option value="' + elEscape(t.emailType) + '">' + elEscape(t.category) + '</option>';
		}).join(''));
		$('#elGrades').html((data.grades || []).map(function (g) {
			return '<option value="' + elEscape(g.id) + '">' + elEscape(g.name) + '</option>';
		}).join(''));
		var gradeNames = {};
		(data.grades || []).forEach(function (g) { gradeNames[g.id] = g.name; });
		$('#elBatches').html((data.batches || []).map(function (b) {
			var grade = b.gradeId && gradeNames[b.gradeId] ? ' (' + gradeNames[b.gradeId] + ')' : '';
			return '<option value="' + elEscape(b.id) + '">' + elEscape((b.name || 'Batch ' + b.id) + grade) + '</option>';
		}).join(''));
		$('#elCategories').val(keptCategories);
		$('#elGrades').val(keptGrades);
		renderEmailLogSchools(data);
		if ($.fn.select2) {
			$('#elCategories').select2({ theme: 'bootstrap4', placeholder: 'Any category', width: '100%' });
			$('#elGrades').select2({ theme: 'bootstrap4', placeholder: 'Any grade', width: '100%' });
			$('#elBatches').select2({ theme: 'bootstrap4', placeholder: 'Any batch', width: '100%' });
		}
		$('#elCategories, #elGrades, #elBatches').trigger('change');
	});
}

/* Super admins get a school picker; everyone else never sees it and never sends viewSchoolId. */
function renderEmailLogSchools(data) {
	var schools = data.schools || null;
	if (!schools || schools.length < 2) {
		$('#elSchoolRow').prop('hidden', true);
		return;
	}
	$('#elSchool').html(schools.map(function (school) {
		return '<option value="' + elEscape(school.id) + '">' + elEscape(school.name) + '</option>';
	}).join('')).val(String(data.schoolId));
	$('#elSchoolRow').prop('hidden', false);
	var select = document.getElementById('elSchool');
	if (select.dataset.bound !== '1') {
		select.dataset.bound = '1';
		$(select).on('change', function () {
			var picked = parseInt(this.value, 10);
			EMAIL_LOGS_STATE.viewSchoolId = picked > 0 ? picked : null;
			// Batches belong to a school: reload them, and drop any picked from the previous school.
			$('#elBatches').val([]).trigger('change');
			// Panels still showing the previous school's people and addresses.
			$('#elPersonSummary, #elPersonCandidates, #elPersonHeader, #elPersonItems, #elPersonPage').empty();
			$('#elProblemsSummary, #elProblemsRows, #elSuppression, #elProblemsPage').empty();
			loadEmailLogOptions();
			runEmailLogSearch(1);
		});
	}
}

/* ---------- saved filters: this browser only (localStorage), never needed for the screen to work ---------- */

function readSavedEmailLogFilters() {
	try {
		return JSON.parse(window.localStorage.getItem(EMAIL_LOGS_SAVED_KEY) || '{}') || {};
	} catch (e) {
		return {};
	}
}

function writeSavedEmailLogFilters(saved) {
	try {
		window.localStorage.setItem(EMAIL_LOGS_SAVED_KEY, JSON.stringify(saved));
		return true;
	} catch (e) {
		showMessageTheme2(0, 'Saved filters are not available in this browser (private window or storage turned off).');
		return false;
	}
}

function refreshEmailLogSavedList() {
	var saved = readSavedEmailLogFilters();
	var html = '<option value="">Choose…</option>';
	Object.keys(saved).sort().forEach(function (name) {
		html += '<option value="' + elEscape(name) + '">' + elEscape(name) + '</option>';
	});
	$('#elSaved').html(html);
}

function saveEmailLogFilters() {
	var name = $.trim($('#elSaveName').val());
	if (!name) {
		showMessageTheme2(0, 'Type a name for these filters, then press Save.');
		$('#elSaveName').trigger('focus');
		return;
	}
	var filter = collectEmailLogFilter(1);
	filter.sentPreset = $('#elSentPreset').val();
	delete filter.page;
	var saved = readSavedEmailLogFilters();
	saved[name] = filter;
	if (writeSavedEmailLogFilters(saved)) {
		refreshEmailLogSavedList();
		$('#elSaved').val(name);
		$('#elSaveName').val('');
		showMessageTheme2(1, 'Filters saved as "' + name + '".');
	}
}

function applySavedEmailLogFilters(name) {
	var saved = readSavedEmailLogFilters();
	if (!name || !saved[name]) {
		showMessageTheme2(0, 'Choose saved filters first.');
		return;
	}
	applyEmailLogFilter(saved[name]);
	runEmailLogSearch(1);
}

function deleteSavedEmailLogFilters(name) {
	var saved = readSavedEmailLogFilters();
	if (!name || !saved[name]) {
		showMessageTheme2(0, 'Choose saved filters first.');
		return;
	}
	delete saved[name];
	if (writeSavedEmailLogFilters(saved)) {
		refreshEmailLogSavedList();
	}
}

/* ---------- search and results ---------- */

function runEmailLogSearch(page) {
	if (EMAIL_LOGS_STATE.loading || page < 1) {
		return;
	}
	var filter = collectEmailLogFilter(page);
	if ($('#elSentPreset').val() === 'CUSTOM' && (!filter.sentFrom || !filter.sentTo)) {
		showMessageTheme2(0, 'Choose both the From and To dates, or pick a preset such as Last 7 days.');
		return;
	}
	EMAIL_LOGS_STATE.loading = true;
	$('#elSearch').prop('disabled', true);
	$('#elSummary').text('Loading emails…');
	elPost('search', filter, function (data) {
		EMAIL_LOGS_STATE.loading = false;
		$('#elSearch').prop('disabled', false);
		if (!data) {
			$('#elSummary').text('');
			return;
		}
		EMAIL_LOGS_STATE.page = data.page;
		EMAIL_LOGS_STATE.total = data.total;
		EMAIL_LOGS_STATE.capped = !!data.capped;
		EMAIL_LOGS_STATE.pageSize = data.pageSize;
		renderEmailLogRows(data.rows || []);
		renderEmailLogPaging();
	});
}

function renderEmailLogPaging() {
	var s = EMAIL_LOGS_STATE;
	var pages = Math.max(1, Math.ceil(s.total / s.pageSize));
	var first = s.total === 0 ? 0 : (s.page - 1) * s.pageSize + 1;
	var last = Math.min(s.total, s.page * s.pageSize);
	$('#elSummary').text(s.total === 0 ? 'No emails match these filters.'
		: 'Showing ' + first.toLocaleString() + '–' + last.toLocaleString() + ' of ' + s.total.toLocaleString()
			+ (s.capped ? '+ emails. Add filters to see the rest.' : ' emails.'));
	$('#elPageInfo').text(s.total === 0 ? '' : 'Page ' + s.page + ' of ' + pages);
	$('#elPrev').prop('disabled', s.page <= 1);
	$('#elNext').prop('disabled', s.page >= pages);
}

function renderEmailLogRows(rows) {
	$('#elRows').html(rows.map(emailLogRowHtml).join(''));
}

function elRecipientLine(r) {
	var label = r.role ? (EMAIL_LOG_ROLE_LABELS[r.role] || 'Staff') : (r.childUserId ? 'Parent' : null);
	return '<div class="el-addr">' + elEscape(r.email)
		+ (label ? ' ' + elBadge(label, 'role') : '')
		+ (r.type && r.type !== 'TO' ? ' <span class="el-muted">(' + elEscape(r.type) + ')</span>' : '')
		+ '</div>';
}

function emailLogRowHtml(row) {
	var recipients = row.recipients || [];
	var people;
	if (recipients.length) {
		people = recipients.slice(0, 3).map(elRecipientLine).join('')
			+ (recipients.length > 3 ? '<div class="el-muted">+' + (recipients.length - 3) + ' more</div>' : '');
	} else {
		people = (row.to || []).concat(row.cc || []).slice(0, 3).map(function (a) {
			return '<div class="el-addr">' + elEscape(a) + '</div>';
		}).join('');
	}
	var send = EMAIL_LOG_SEND_LABELS[row.sendStatus] || [row.sendStatus || 'Unknown', 'muted'];
	var t = row.totals || {};
	var delivery;
	if (!recipients.length) {
		delivery = '<span class="el-muted">Not tracked</span>';
	} else if (row.sendStatus !== 'SUCCESS') {
		delivery = '<span class="el-muted">—</span>';
	} else {
		delivery = elBadge(t.delivered + ' of ' + t.recipients + ' delivered', t.delivered === t.recipients ? 'ok' : 'info')
			+ (t.failed ? '<div>' + elBadge(t.failed + ' failed', 'bad') + '</div>' : '')
			+ (t.noEventYet ? '<div class="el-muted">' + t.noEventYet + ' no report yet</div>' : '');
	}
	var opened = recipients.length ? (t.opened + ' of ' + t.recipients) : '—';
	if (t.autoOpenedOnly) {
		opened += '<div class="el-muted">' + t.autoOpenedOnly + ' auto-opened only</div>';
	}
	var contentUrl = BASE_URL + CONTEXT_PATH + UNIQUEUUID + '/dashboard/email-content/' + SCHOOL_ID
		+ '?payload=' + encodeURIComponent(row.contentPayload || '');
	return '<tr>'
		+ '<td data-label="Sent">' + elEscape(row.sentAt) + '</td>'
		+ '<td data-label="Email"><div class="el-subject">' + elEscape(row.subject || '(no subject)') + '</div>'
		+ elBadge(row.category || 'Other', 'cat')
		+ (row.emailType ? ' <span class="el-muted">' + elEscape(row.emailType) + '</span>' : '')
		+ (row.attachments ? ' <i class="fa fa-paperclip" aria-label="Has attachments"></i>' : '')
		+ (row.archived ? ' ' + elBadge('Archived', 'role') : '')
		+ '</td>'
		+ '<td data-label="Recipients">' + people + '</td>'
		+ '<td data-label="Send">' + elBadge(send[0], send[1])
		+ '<div class="el-muted">' + elEscape(row.provider || '') + '</div>'
		+ (row.errorMessage ? '<div class="text-danger" title="' + elEscape(row.errorMessage) + '">'
			+ elEscape(row.errorMessage.length > 80 ? row.errorMessage.substring(0, 80) + '…' : row.errorMessage) + '</div>' : '')
		+ '</td>'
		+ '<td data-label="Delivery">' + delivery + '</td>'
		+ '<td data-label="Opened">' + opened + '</td>'
		+ '<td data-label="Clicked">' + (recipients.length ? t.clicked + ' of ' + t.recipients : '—') + '</td>'
		+ '<td data-label="Actions"><div class="d-flex flex-wrap" style="gap:.35rem">'
		+ '<button type="button" class="btn btn-sm btn-primary" data-email-id="' + row.id + '" data-archived="'
		+ (row.archived ? 'Y' : 'N') + '" aria-label="Details of: '
		+ elEscape(row.subject || 'email') + '">Details</button>'
		+ '<a class="btn btn-sm btn-outline-primary" target="_blank" rel="noopener" href="' + elEscape(contentUrl)
		+ '" aria-label="Open the email in a new tab">Open</a>'
		+ '</div></td>'
		+ '</tr>';
}

/* ---------- detail drawer ---------- */

function bindEmailLogDrawer() {
	var dialog = document.getElementById('emailLogDrawer');
	$('#elDrawerClose').on('click', function () {
		dialog.close();
	});
	$('#elDrawerPrint').on('click', function () {
		window.print();
	});
	dialog.addEventListener('close', function () {
		$('#elDrawerBody').empty();
	});
	elLightDismiss(dialog);
}

/* Click-outside where <dialog closedby> is not supported (Safari): require the press and the
   release outside the panel, so a text selection that ends on the backdrop does not close it. */
function elLightDismiss(dialog) {
	if (!('closedBy' in HTMLDialogElement.prototype)) {
		var outside = function (e) {
			var r = dialog.getBoundingClientRect();
			return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
		};
		var pressedOutside = false;
		dialog.addEventListener('pointerdown', function (e) { pressedOutside = outside(e); });
		dialog.addEventListener('pointerup', function (e) {
			if (pressedOutside && outside(e)) {
				dialog.close();
			}
		});
	}
}

function openEmailLogDetail(emailId, archived) {
	if (!emailId) {
		return;
	}
	var dialog = document.getElementById('emailLogDrawer');
	$('#elDrawerTitle').text('Email details');
	$('#elDrawerBody').html('<p aria-live="polite">Loading…</p>');
	if (!dialog.open) {
		dialog.showModal();
	}
	elPost('detail', { emailId: emailId, archived: !!archived }, function (data) {
		if (!data) {
			dialog.close();
			return;
		}
		renderEmailLogDetail(data);
	});
}

function renderEmailLogDetail(detail) {
	var e = detail.email;
	var send = EMAIL_LOG_SEND_LABELS[e.sendStatus] || [e.sendStatus || 'Unknown', 'muted'];
	var contentUrl = BASE_URL + CONTEXT_PATH + UNIQUEUUID + '/dashboard/email-content/' + SCHOOL_ID
		+ '?payload=' + encodeURIComponent(e.contentPayload || '');
	$('#elDrawerTitle').text(e.subject || '(no subject)');

	var html = '<dl class="el-facts">'
		+ '<dt>Sent</dt><dd>' + elEscape(e.sentAt) + ' IST</dd>'
		+ '<dt>From</dt><dd>' + elEscape(e.fromName || '—') + '</dd>'
		+ '<dt>Sent by</dt><dd>' + (detail.sentBy ? elEscape(detail.sentBy) : '<span class="el-muted">Not recorded (automatic, or sent before this was tracked)</span>') + '</dd>'
		+ '<dt>Send status</dt><dd>' + elBadge(send[0], send[1]) + (e.errorMessage ? ' <span class="text-danger">' + elEscape(e.errorMessage) + '</span>' : '') + '</dd>'
		+ '<dt>Provider</dt><dd>' + elEscape(e.provider || '—') + '</dd>'
		+ '<dt>Category</dt><dd>' + elBadge(e.category || 'Other', 'cat') + (e.emailType ? ' <span class="el-muted">' + elEscape(e.emailType) + '</span>' : '') + '</dd>'
		+ (e.archived ? '<dt>Stored</dt><dd>' + elBadge('Archived', 'role') + ' moved out of the live tables by the nightly archive</dd>' : '')
		+ (detail.resentFromId ? '<dt>Resent copy</dt><dd>Re-sent by an admin from <button type="button" class="btn btn-link btn-sm p-0" data-open-email="'
			+ elEscape(detail.resentFromId) + '">email #' + elEscape(detail.resentFromId) + '</button></dd>' : '')
		+ '</dl>';
	var resends = detail.resends || [];
	if (resends.length) {
		html += '<h3>Resent</h3><ul class="list-unstyled mb-0">' + resends.map(function (r) {
			var status = EMAIL_LOG_SEND_LABELS[r.sendStatus] || [r.sendStatus || 'Unknown', 'muted'];
			return '<li>To ' + elEscape(r.to) + ' on ' + elEscape(r.at) + (r.by ? ' by ' + elEscape(r.by) : '') + ' ' + elBadge(status[0], status[1])
				+ ' <button type="button" class="btn btn-link btn-sm p-0" data-open-email="' + elEscape(r.id) + '">Details</button></li>';
		}).join('') + '</ul>';
	}
	if (EMAIL_LOGS_STATE.canUpdate) {
		if (e.category === 'Account & security') {
			html += '<h3>Resend</h3><p class="el-muted">Account and security emails (password resets, sign-in links, codes) cannot be resent: '
				+ 'their links are personal and may have expired.</p>';
		} else {
			html += '<h3>Resend to another address</h3><div class="form-inline" style="gap:.5rem">'
				+ '<label class="sr-only" for="elResendTo">Email address</label>'
				+ '<input type="email" id="elResendTo" class="form-control form-control-sm" autocomplete="off" placeholder="name@example.com" style="min-inline-size:16rem">'
				+ '<button type="button" class="btn btn-sm btn-primary" id="elResendButton" data-email-id="' + e.id + '" data-archived="'
				+ (e.archived ? 'Y' : 'N') + '">Resend</button></div>'
				+ '<small class="form-text text-muted">The same subject, text and attachments go to this one address, as a new email linked to this one.</small>';
		}
	}

	html += '<h3>Recipients</h3>';
	var recipients = e.recipients || [];
	if (!recipients.length) {
		html += '<p class="el-muted">This email was sent before delivery tracking began, so there is no per-recipient report. '
			+ 'To: ' + elEscape((e.to || []).join(', ')) + (e.cc && e.cc.length ? ' · CC: ' + elEscape(e.cc.join(', ')) : '')
			+ (e.bcc && e.bcc.length ? ' · BCC: ' + elEscape(e.bcc.join(', ')) : '') + '</p>';
	} else {
		html += '<div class="el-table-wrap" role="region" aria-label="Recipients" tabindex="0"><table class="el-table">'
			+ '<thead><tr><th scope="col">Address</th><th scope="col">Account</th><th scope="col">Delivery</th>'
			+ '<th scope="col">Opens</th><th scope="col">Clicks</th></tr></thead><tbody>'
			+ recipients.map(emailLogRecipientRowHtml).join('') + '</tbody></table></div>';
	}

	html += '<h3>What happened</h3>';
	var events = detail.events || [];
	if (!events.length) {
		html += '<p class="el-muted">' + (recipients.length ? 'SendGrid has not reported anything for this email yet.'
			: 'No events: events are recorded only for emails sent through SendGrid since delivery tracking began.') + '</p>';
	} else {
		html += '<ol class="el-timeline">' + events.map(emailLogEventHtml).join('') + '</ol>';
		if (detail.eventsTruncated) {
			html += '<p class="el-muted">Showing the first 500 events.</p>';
		}
	}

	var attachments = detail.attachments || [];
	if (attachments.length) {
		// Each link is checked again on the server, which then hands out a 5-minute download link.
		html += '<h3>Attachments</h3><ul class="list-unstyled mb-0">' + attachments.map(function (a) {
			var href = BASE_URL + CONTEXT_PATH + UNIQUEUUID + '/dashboard/email-logs/attachment?payload=' + encodeURIComponent(a.payload || '');
			return '<li><a target="_blank" rel="noopener" href="' + elEscape(href) + '"><i class="fa fa-paperclip" aria-hidden="true"></i> '
				+ elEscape(a.name) + '</a></li>';
		}).join('') + '</ul>';
	}

	html += '<h3>Email as sent</h3>'
		+ '<p class="mb-2"><a target="_blank" rel="noopener" href="' + elEscape(contentUrl) + '">Open in a new tab</a></p>'
		// sandbox without allow-scripts: a stored email can never run script in the admin's session;
		// allow-same-origin only lets this page size the frame to its content. Links open sandboxed
		// too (no allow-popups-to-escape-sandbox), so a page they open cannot drive this one.
		+ '<iframe class="el-preview" id="elPreview" title="Email as sent" sandbox="allow-same-origin allow-popups" src="'
		+ elEscape(contentUrl) + '"></iframe>';

	$('#elDrawerBody').html(html);
	$('#elPreview').on('load', function () {
		try {
			var height = this.contentWindow.document.documentElement.scrollHeight;
			this.style.blockSize = Math.min(Math.max(height + 16, 200), 2000) + 'px';
		} catch (err) {
			// Keep the default height if the frame cannot be measured.
		}
	});
}

/* ---------- Excel exports (built in the background, see EmailLogExport) ---------- */

var EMAIL_LOG_EXPORT_TIMER = null;

function bindEmailLogExports() {
	$('#elExport').on('click', function () {
		var filter = collectEmailLogFilter(1);
		if ($('#elSentPreset').val() === 'CUSTOM' && (!filter.sentFrom || !filter.sentTo)) {
			showMessageTheme2(0, 'Choose both the From and To dates, or pick a preset such as Last 7 days.');
			return;
		}
		var button = this;
		button.disabled = true;
		elPost('export', filter, function (data) {
			button.disabled = false;
			if (data) {
				document.getElementById('elExports').open = true;
				loadEmailLogExports();
			}
		});
	});
	$('#elExports').on('toggle', function () {
		if (this.open) {
			loadEmailLogExports();
		}
	});
	$('#elExportList').on('click', '[data-report-id]', function () {
		downloadEmailLogExport(this.getAttribute('data-report-id'));
	});
}

function loadEmailLogExports() {
	clearTimeout(EMAIL_LOG_EXPORT_TIMER);
	elPost('exports', {}, function (reports) {
		if (!reports || !document.getElementById('elExportList')) {
			return;
		}
		$('#elExportList').html(reports.length ? reports.map(emailLogExportHtml).join('')
			: '<li class="el-muted">No exports yet. Search, then choose Export to Excel.</li>');
		// Check again while a file is still being prepared and this screen is open.
		if (reports.some(function (r) { return r.status === 'UNDER_PROCESS'; })) {
			EMAIL_LOG_EXPORT_TIMER = setTimeout(function () {
				if (document.getElementById('elExportList')) {
					loadEmailLogExports();
				}
			}, 5000);
		}
	});
}

function emailLogExportHtml(r) {
	var state;
	if (r.status === 'READY') {
		state = elBadge('Ready', 'ok') + (r.totalRecords != null ? ' <span class="el-muted">' + r.totalRecords.toLocaleString() + ' rows</span>' : '')
			+ ' <button type="button" class="btn btn-sm btn-outline-primary ml-2" data-report-id="' + elEscape(r.id) + '">Download</button>';
	} else if (r.status === 'FAILED') {
		state = elBadge('Failed', 'bad') + (r.errorMessage ? ' <span class="el-muted">' + elEscape(r.errorMessage) + '</span>' : '');
	} else {
		state = elBadge('Preparing ' + (r.progress || 0) + '%', 'info');
	}
	return '<li class="mb-2"><strong>' + elEscape(r.reportName) + '</strong> <span class="el-muted">' + elEscape(r.requestDate || '')
		+ (r.generatedBy ? ' · ' + elEscape(r.generatedBy) : '') + '</span><div>' + state + '</div></li>';
}

function downloadEmailLogExport(id) {
	elPost('export-download', { id: parseInt(id, 10) }, function (data) {
		if (data && data.url) {
			// An .xlsx link downloads without leaving the page; a new tab opened after a request is often blocked.
			window.location.assign(data.url);
		}
	});
}

/* ---------- email analytics (stage D1, extended in stage F) ---------- */

// Categorical slots 1 and 2 of the validated chart palette (dataviz reference palette; both pass the
// colour-blind separation and contrast checks on a white surface). Text never uses these colours.
var EMAIL_LOG_SERIES = ['#2a78d6', '#eb6834'];
var EMAIL_LOG_CHARTS = [];

function elPct(part, whole) {
	return whole > 0 ? Math.round(part * 1000 / whole) / 10 : null;
}

function elPctText(value) {
	return value === null ? '—' : value.toLocaleString(undefined, { maximumFractionDigits: 1 }) + '%';
}

function bindEmailLogDeliverability() {
	var dialog = document.getElementById('elDeliverability');
	$('#elDeliverabilityOpen').on('click', function () {
		dialog.showModal();
		loadEmailLogDeliverability();
	});
	$('#elDeliverabilityClose').on('click', function () {
		dialog.close();
	});
	$('#elDeliverabilityDays').on('change', loadEmailLogDeliverability);
	dialog.addEventListener('close', function () {
		elDestroyCharts();
	});
	elLightDismiss(dialog);
}

function elDestroyCharts() {
	EMAIL_LOG_CHARTS.forEach(function (chart) {
		try {
			chart.destroy();
		} catch (e) {
			// Already gone.
		}
	});
	EMAIL_LOG_CHARTS = [];
}

function loadEmailLogDeliverability() {
	$('#elDeliverabilitySummary').text('Loading…');
	elPost('deliverability', { days: parseInt($('#elDeliverabilityDays').val(), 10) || 30 }, function (report) {
		if (!report) {
			$('#elDeliverabilitySummary').text('');
			return;
		}
		renderEmailLogDeliverability(report);
	});
}

/* Every day of the period, with zeros for days nothing was sent. */
function elFillDays(report) {
	var byDay = {};
	(report.days || []).forEach(function (d) {
		byDay[d.label] = d;
	});
	var days = [];
	var cursor = new Date(report.from + 'T00:00:00Z');
	var end = new Date(report.to + 'T00:00:00Z');
	while (cursor <= end) {
		var key = cursor.toISOString().substring(0, 10);
		days.push(byDay[key] || { label: key, emails: 0, notSent: 0, recipients: 0, reported: 0, delivered: 0, failed: 0, spam: 0, opened: 0,
			clicked: 0, openedMoreThanOnce: 0, autoOpenedOnly: 0, notOpened: 0, unsubscribedOrSpam: 0, unsubscribedBySchool: 0, switchedOff: 0 });
		cursor.setUTCDate(cursor.getUTCDate() + 1);
	}
	return days;
}

function elDayLabel(isoDay) {
	return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(isoDay + 'T00:00:00Z'));
}

function renderEmailLogDeliverability(report) {
	var t = report.total || {};
	var nothing = !t.emails && !t.notSent && !t.unsubscribedBySchool && !t.switchedOff;
	$('#elDeliverabilitySummary').text(nothing ? (report.period === 1 ? 'No emails were sent today.' : 'No emails were sent in this period.') : '');
	$('#elDeliverabilityAlerts').html((report.alerts || []).map(function (a) {
		var what = a.kind === 'SPAM' ? 'spam reports' : 'bounced, blocked or dropped';
		return '<div class="el-alert" role="note"><strong>Alert</strong> ' + elEscape(a.at) + ': ' + elEscape(a.rate) + '% ' + what
			+ ' (' + Number(a.sample).toLocaleString() + ' addresses). '
			+ (a.notifiedTo ? 'Emailed to ' + elEscape(a.notifiedTo) + '.' : 'No alert address is set, so it was not emailed.') + '</div>';
	}).join(''));
	$('#elDeliverabilityTiles').html(elAnalyticsTiles(t, report));

	var days = elFillDays(report);
	var labels = days.map(function (d) { return elDayLabel(d.label); });
	var sent = days.map(function (d) { return d.emails; });
	var failed = days.map(function (d) { return elPct(d.failed, d.reported); });
	var opened = days.map(function (d) { return elPct(d.opened, d.delivered); });
	var clicked = days.map(function (d) { return elPct(d.clicked, d.delivered); });
	$('#elChartSentText').text('Bar chart of emails sent per day, ' + labels[0] + ' to ' + labels[labels.length - 1]
		+ ', ' + Number(t.emails || 0).toLocaleString() + ' in total. The same numbers are in the table below.');
	$('#elChartFailedText').text('Line chart of the daily percentage of addresses that bounced, were blocked or dropped; '
		+ elPctText(elPct(t.failed, t.reported)) + ' over the period. The alert limit is ' + report.bounceLimitPercent + '%.');
	$('#elChartEngagedText').text('Line chart of the daily percentage of delivered addresses that opened (' + elPctText(elPct(t.opened, t.delivered))
		+ ' overall) and clicked (' + elPctText(elPct(t.clicked, t.delivered)) + ' overall).');

	elDestroyCharts();
	if (typeof ApexCharts === 'undefined') {
		$('.el-chart').html('<p class="el-muted">Charts are not available on this page; the numbers are in the tables below.</p>');
	} else {
		var common = {
			chart: { height: 240, toolbar: { show: false }, animations: { enabled: false }, fontFamily: 'inherit', zoom: { enabled: false } },
			dataLabels: { enabled: false },
			grid: { borderColor: '#e9ecef', strokeDashArray: 0 },
			xaxis: { categories: labels, tickAmount: Math.min(labels.length, 10), labels: { rotate: 0, hideOverlappingLabels: true, style: { colors: '#6c757d' } },
				axisBorder: { color: '#ced4da' }, axisTicks: { show: false } },
			legend: { show: false }
		};
		// Today is a single point: show it as a marker (8px), since a one-point line draws nothing.
		var oneDay = labels.length === 1;
		var pctAxis = { min: 0, labels: { formatter: function (v) { return v === null ? '' : Math.round(v) + '%'; }, style: { colors: '#6c757d' } } };
		EMAIL_LOG_CHARTS.push(new ApexCharts(document.getElementById('elChartSent'), $.extend(true, {}, common, {
			chart: { type: 'bar' },
			series: [{ name: 'Emails sent', data: sent }],
			colors: [EMAIL_LOG_SERIES[0]],
			plotOptions: { bar: { borderRadius: 4, borderRadiusApplication: 'end', columnWidth: '60%' } },
			yaxis: { labels: { formatter: function (v) { return Math.round(v).toLocaleString(); }, style: { colors: '#6c757d' } } },
			tooltip: { y: { formatter: function (v) { return Number(v).toLocaleString() + ' emails'; } } }
		})));
		EMAIL_LOG_CHARTS.push(new ApexCharts(document.getElementById('elChartFailed'), $.extend(true, {}, common, {
			chart: { type: 'line' },
			series: [{ name: 'Bounced, blocked or dropped', data: failed }],
			colors: [EMAIL_LOG_SERIES[0]],
			stroke: { width: 2, curve: 'straight' },
			markers: { size: oneDay ? 4 : 0, hover: { size: 4 } },
			yaxis: pctAxis,
			annotations: { yaxis: [{ y: parseFloat(report.bounceLimitPercent), borderColor: '#6c757d', strokeDashArray: 4,
				label: { text: 'Alert limit ' + report.bounceLimitPercent + '%', borderWidth: 0, style: { color: '#495057', background: '#ffffff' } } }] },
			tooltip: { shared: true, intersect: false, y: { formatter: function (v) { return elPctText(v); } } }
		})));
		var lastIndex = labels.length - 1;
		EMAIL_LOG_CHARTS.push(new ApexCharts(document.getElementById('elChartEngaged'), $.extend(true, {}, common, {
			chart: { type: 'line' },
			series: [{ name: 'Opened', data: opened }, { name: 'Clicked', data: clicked }],
			colors: EMAIL_LOG_SERIES,
			stroke: { width: 2, curve: 'straight' },
			markers: { size: oneDay ? 4 : 0, hover: { size: 4 } },
			yaxis: pctAxis,
			legend: { show: true, position: 'top', horizontalAlign: 'left', labels: { colors: '#495057' } },
			// Direct labels at the right end, so the two lines are told apart without colour.
			dataLabels: { enabled: true, formatter: function (v, o) { return o.dataPointIndex === lastIndex && v !== null ? o.w.globals.seriesNames[o.seriesIndex] : ''; },
				background: { enabled: false }, style: { colors: ['#495057'], fontWeight: 500 }, offsetY: -6 },
			tooltip: { shared: true, intersect: false, y: { formatter: function (v) { return elPctText(v); } } }
		})));
		EMAIL_LOG_CHARTS.forEach(function (chart) { chart.render(); });
	}

	$('#elDeliverabilityDaysTable').html(elDeliverabilityTable(days.slice().reverse(), 'Day', function (d) { return elDayLabel(d.label); }));
	$('#elByTypeHelp').text('"Rarely opened": at least ' + Number(report.rarelyOpenedMinAddresses).toLocaleString()
		+ ' addresses got this email in the period and fewer than ' + report.rarelyOpenedPercent + '% of the delivered ones opened it. '
		+ 'Opened, not opened and clicked count delivered addresses.');
	$('#elDeliverabilityTypes').html(elAnalyticsTypeTable(report.byType || []));
	$('#elDeliverabilityCategories').html(elDeliverabilityTable(report.byCategory || [], 'Category'));
	$('#elDeliverabilityProviders').html(elDeliverabilityTable(report.byProvider || [], 'Provider'));
}

function elCount(value) {
	return Number(value || 0).toLocaleString();
}

function elAddresses(value) {
	return elCount(value) + (Number(value) === 1 ? ' address' : ' addresses');
}

/* The period's headline numbers, in three labelled groups; every number has a text label. */
function elAnalyticsTiles(t, report) {
	var groups = [
		['Sending', [
			['Emails sent', elCount(t.emails), 'to ' + elAddresses(t.recipients)],
			['Failed to send', elCount(t.notSent), 'refused by the provider or an error'],
			['Addresses delivered', elCount(t.delivered), elPctText(elPct(t.delivered, t.reported)) + ' of ' + elCount(t.reported) + ' reported'],
			['Bounced, blocked or dropped', elPctText(elPct(t.failed, t.reported)), elAddresses(t.failed) + '; alert above ' + report.bounceLimitPercent + '%'],
			['Marked as spam', elPctText(elPct(t.spam, t.delivered)), elAddresses(t.spam) + '; alert above ' + report.spamLimitPercent + '%']
		]],
		['Opens and clicks (of delivered addresses)', [
			['Opened', elCount(t.opened), elPctText(elPct(t.opened, t.delivered)) + ', by a person'],
			['Opened more than once', elCount(t.openedMoreThanOnce), elPctText(elPct(t.openedMoreThanOnce, t.delivered))],
			['Only auto-opened', elCount(t.autoOpenedOnly), 'a mail app opened it; the person may not have'],
			['Delivered, not opened', elCount(t.notOpened), elPctText(elPct(t.notOpened, t.delivered))],
			['Clicked a link', elCount(t.clicked), elPctText(elPct(t.clicked, t.delivered))]
		]],
		['Not sent on purpose (addresses)', [
			['Unsubscribed by the school', elCount(t.unsubscribedBySchool), 'on your school\'s unsubscribe list'],
			['Switched off by the person', elCount(t.switchedOff), 'in their own email settings']
		]]
	];
	return groups.map(function (g, i) {
		var id = 'elTileGroup' + i;
		return '<section class="el-tile-group" aria-labelledby="' + id + '"><h3 id="' + id + '">' + g[0] + '</h3><div class="el-tiles">'
			+ g[1].map(function (tile) {
				return '<div class="el-tile"><div class="el-tile__label">' + tile[0] + '</div><div class="el-tile__value">' + elEscape(tile[1]) + '</div>'
					+ '<div class="el-tile__note">' + elEscape(tile[2]) + '</div></div>';
			}).join('') + '</div></section>';
	}).join('');
}

/* One row per email type, most addresses first; "Rarely opened" is text and an icon, not colour alone. */
function elAnalyticsTypeTable(types) {
	if (!types.length) {
		return '<p class="el-muted">Nothing in this period.</p>';
	}
	return '<div class="el-table-wrap" role="region" aria-labelledby="elByTypeTitle" tabindex="0"><table class="el-table">'
		+ '<caption class="sr-only">Email analytics by email type, most addresses first</caption>'
		+ '<thead><tr><th scope="col">Email type</th><th scope="col">Addresses</th><th scope="col">Delivered</th><th scope="col">Opened</th>'
		+ '<th scope="col">Opened more than once</th><th scope="col">Not opened</th><th scope="col">Clicked</th>'
		+ '<th scope="col">Bounced / blocked / dropped</th><th scope="col">Unsubscribed / spam</th><th scope="col">Not sent</th></tr></thead><tbody>'
		+ types.map(function (type) {
			var r = type.counts || {};
			var name = type.emailType ? elEscape(type.emailType) : '<span class="el-muted">No type (hand-built or bulk email)</span>';
			// Under the name, so it is seen without scrolling the table sideways.
			var flag = type.rarelyOpened
				? '<div class="mt-1"><span class="el-flag"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Rarely opened</span>'
					+ '<div class="el-muted font-weight-normal">Few people open this email: consider rewriting it or sending it less.</div></div>'
				: '';
			var left = (r.unsubscribedBySchool ? '<div class="el-muted">' + elCount(r.unsubscribedBySchool) + ' unsubscribed by the school</div>' : '')
				+ (r.switchedOff ? '<div class="el-muted">' + elCount(r.switchedOff) + ' switched off by the person</div>' : '')
				+ (r.notSent ? '<div class="el-muted">' + elCount(r.notSent) + (r.notSent === 1 ? ' email' : ' emails') + ' failed to send</div>' : '');
			return '<tr><th scope="row" data-label="Email type" class="el-type-cell"><div class="el-addr">' + name + '</div>'
				+ elBadge(type.category || 'Other', 'cat') + flag + '</th>'
				+ '<td data-label="Addresses" class="el-num">' + elCount(r.recipients) + '</td>'
				+ '<td data-label="Delivered" class="el-num">' + elCount(r.delivered) + '</td>'
				+ '<td data-label="Opened" class="el-num">' + elPctText(elPct(r.opened, r.delivered)) + ' <span class="el-muted">(' + elCount(r.opened) + ')</span></td>'
				+ '<td data-label="Opened more than once" class="el-num">' + elCount(r.openedMoreThanOnce) + '</td>'
				+ '<td data-label="Not opened" class="el-num">' + elCount(r.notOpened) + '</td>'
				+ '<td data-label="Clicked" class="el-num">' + elPctText(elPct(r.clicked, r.delivered)) + ' <span class="el-muted">(' + elCount(r.clicked) + ')</span></td>'
				+ '<td data-label="Bounced / blocked / dropped" class="el-num">' + elCount(r.failed) + '</td>'
				+ '<td data-label="Unsubscribed / spam" class="el-num">' + elCount(r.unsubscribedOrSpam) + '</td>'
				+ '<td data-label="Not sent">' + (left || '<span class="el-muted">—</span>') + '</td></tr>';
		}).join('') + '</tbody></table></div>';
}

function elDeliverabilityTable(rows, first, labelOf) {
	if (!rows.length) {
		return '<p class="el-muted">Nothing in this period.</p>';
	}
	var id = 'elDt' + first;
	return '<div class="el-table-wrap" role="region" aria-labelledby="' + id + '" tabindex="0"><table class="el-table">'
		+ '<caption id="' + id + '" class="sr-only">Email analytics by ' + first.toLowerCase() + '</caption>'
		+ '<thead><tr><th scope="col">' + first + '</th><th scope="col">Sent</th><th scope="col">Not sent</th><th scope="col">Reported</th>'
		+ '<th scope="col">Delivered</th><th scope="col">Bounced / blocked / dropped</th><th scope="col">Spam</th>'
		+ '<th scope="col">Opened</th><th scope="col">Clicked</th></tr></thead><tbody>'
		+ rows.map(function (r) {
			return '<tr><td data-label="' + first + '">' + elEscape(labelOf ? labelOf(r) : r.label) + '</td>'
				+ '<td data-label="Sent">' + Number(r.emails).toLocaleString() + '</td>'
				+ '<td data-label="Not sent">' + Number(r.notSent).toLocaleString() + '</td>'
				+ '<td data-label="Reported">' + Number(r.reported).toLocaleString() + '</td>'
				+ '<td data-label="Delivered">' + elPctText(elPct(r.delivered, r.reported)) + '</td>'
				+ '<td data-label="Bounced / blocked / dropped">' + elPctText(elPct(r.failed, r.reported)) + '</td>'
				+ '<td data-label="Spam">' + elPctText(elPct(r.spam, r.delivered)) + '</td>'
				+ '<td data-label="Opened">' + elPctText(elPct(r.opened, r.delivered)) + '</td>'
				+ '<td data-label="Clicked">' + elPctText(elPct(r.clicked, r.delivered)) + '</td></tr>';
		}).join('') + '</tbody></table></div>';
}

/* ---------- one person's communications (stage D1) ---------- */

var EMAIL_LOG_PERSON = { userId: null, page: 1, request: 0 };
var EMAIL_LOG_CHANNEL_LABELS = { EMAIL: 'Email', NOTIFICATION: 'Notification', ANNOUNCEMENT: 'Announcement', WHATSAPP: 'WhatsApp' };

function bindEmailLogPerson() {
	var dialog = document.getElementById('elPerson');
	$('#elPersonOpen').on('click', function () {
		elPersonDefaults();
		dialog.showModal();
		$('#elPersonQuery').trigger('focus');
	});
	$('#elPersonClose').on('click', function () {
		dialog.close();
	});
	$('#elPersonForm').on('submit', function (e) {
		e.preventDefault();
		EMAIL_LOG_PERSON.userId = null;
		loadEmailLogPerson(1);
	});
	$('#elPersonCandidates, #elPersonHeader').on('click', '[data-person-id]', function () {
		EMAIL_LOG_PERSON.userId = parseInt(this.getAttribute('data-person-id'), 10);
		loadEmailLogPerson(1);
	});
	$('#elPersonItems').on('click', '[data-email-id]', function () {
		openEmailLogDetail(parseInt(this.getAttribute('data-email-id'), 10), false);
	});
	$('#elPersonPrev').on('click', function () { loadEmailLogPerson(EMAIL_LOG_PERSON.page - 1); });
	$('#elPersonNext').on('click', function () { loadEmailLogPerson(EMAIL_LOG_PERSON.page + 1); });
	elLightDismiss(dialog);
}

function elPersonDefaults() {
	if (!$('#elPersonFrom').val()) {
		$('#elPersonFrom').val(elIstDate(89));
		$('#elPersonTo').val(elIstDate(0));
	}
}

/* Opened from a profile's "Communications" shortcut (adminController.js openPersonCommunications). */
function openEmailLogPerson(userId) {
	var dialog = document.getElementById('elPerson');
	if (!dialog) {
		return;
	}
	elPersonDefaults();
	$('#elPersonQuery').val('');
	EMAIL_LOG_PERSON.userId = userId;
	if (!dialog.open) {
		dialog.showModal();
	}
	loadEmailLogPerson(1);
}

function loadEmailLogPerson(page) {
	if (page < 1) {
		return;
	}
	var query = $.trim($('#elPersonQuery').val());
	if (!EMAIL_LOG_PERSON.userId && !query) {
		showMessageTheme2(0, 'Type a name, email address, mobile number or account ID.');
		return;
	}
	var request = {
		userId: EMAIL_LOG_PERSON.userId, query: query, channel: $('#elPersonChannel').val(),
		from: $('#elPersonFrom').val(), to: $('#elPersonTo').val(), page: page, pageSize: 20
	};
	var requestNo = ++EMAIL_LOG_PERSON.request;
	$('#elPersonSummary').text('Loading…');
	elPost('person', request, function (data) {
		if (requestNo !== EMAIL_LOG_PERSON.request) {
			return;
		}
		$('#elPersonCandidates, #elPersonHeader, #elPersonItems').empty();
		$('#elPersonPage').text('');
		$('#elPersonPrev, #elPersonNext').prop('disabled', true);
		if (!data) {
			$('#elPersonSummary').text('');
			return;
		}
		if (data.message) {
			$('#elPersonSummary').text(data.message);
			return;
		}
		if (data.candidates && data.candidates.length) {
			$('#elPersonSummary').text(data.candidates.length + ' people match. Choose one:');
			$('#elPersonCandidates').html('<div class="d-flex flex-wrap" style="gap:.5rem">' + data.candidates.map(elPersonButton).join('') + '</div>');
			return;
		}
		EMAIL_LOG_PERSON.userId = data.person.userId;
		EMAIL_LOG_PERSON.page = data.page;
		var p = data.person;
		$('#elPersonHeader').html('<h3 class="mt-0">' + elEscape(p.name || ('Account #' + p.userId)) + ' '
			+ (p.role ? elBadge(EMAIL_LOG_ROLE_LABELS[p.role] || p.role, 'role') : '') + ' <span class="el-muted">#' + p.userId
			+ (p.email ? ' · ' + elEscape(p.email) : '') + '</span></h3>'
			+ (data.related && data.related.length ? '<p class="mb-2">Also see: ' + data.related.map(elPersonButton).join(' ') + '</p>' : ''));
		$('#elPersonSummary').text(data.total === 0 ? 'Nothing was sent to this person in this period.'
			: Number(data.total).toLocaleString() + (data.total === 1 ? ' item, as their Inbox shows it.' : ' items, as their Inbox shows them.'));
		$('#elPersonItems').html((data.items || []).map(elPersonItemHtml).join(''));
		$('#elPersonPage').text(data.total === 0 ? '' : 'Page ' + data.page + ' of ' + data.lastPage);
		$('#elPersonPrev').prop('disabled', data.page <= 1);
		$('#elPersonNext').prop('disabled', data.page >= data.lastPage);
	});
}

function elPersonButton(p) {
	return '<button type="button" class="btn btn-sm btn-outline-primary" data-person-id="' + elEscape(p.userId) + '">'
		+ elEscape(p.name || ('Account #' + p.userId)) + (p.role ? ' · ' + elEscape(EMAIL_LOG_ROLE_LABELS[p.role] || p.role) : '') + '</button>';
}

function elIstTime(epochMillis) {
	if (!epochMillis) {
		return '';
	}
	return new Intl.DateTimeFormat(undefined, { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric',
		hour: '2-digit', minute: '2-digit' }).format(new Date(epochMillis)) + ' IST';
}

function elPersonItemHtml(entry) {
	var i = entry.item;
	var copies = (entry.copies || []).map(function (c) {
		var status = elDeliveryLabel(c.deliveryStatus, c.reason);
		return '<div class="el-addr">' + elEscape(c.email) + (c.recipientType && c.recipientType !== 'TO' ? ' <span class="el-muted">(' + elEscape(c.recipientType) + ')</span>' : '')
			+ ' ' + elBadge(status[0], status[1]) + ' <span class="el-muted">' + c.opens + ' opens'
			+ (c.autoOpens ? ' (+' + c.autoOpens + ' auto)' : '') + ', ' + c.clicks + ' clicks</span>'
			+ (c.reason && c.deliveryStatus !== 'OPTED_OUT' ? '<div class="el-muted">' + elEscape(c.reason.length > 160 ? c.reason.substring(0, 160) + '…' : c.reason) + '</div>' : '')
			+ '</div>';
	}).join('');
	return '<li class="el-person-item">'
		+ '<div class="d-flex flex-wrap align-items-baseline" style="gap:.5rem">'
		+ elBadge(EMAIL_LOG_CHANNEL_LABELS[i.channel] || i.channel, 'info')
		+ '<span class="el-person-item__title">' + elEscape(i.title || '(no subject)') + '</span>'
		+ (i.childName ? elBadge('For ' + i.childName, 'cat') : '')
		+ (i.read ? '' : elBadge('Unread', 'warn'))
		+ '<span class="el-muted ml-auto">' + elEscape(elIstTime(i.at)) + '</span></div>'
		+ (i.preview ? '<div class="el-muted">' + elEscape(i.preview) + '</div>' : '')
		+ copies
		+ (i.channel === 'EMAIL' ? '<button type="button" class="btn btn-sm btn-link px-0" data-email-id="' + elEscape(i.id) + '">Email details</button>' : '')
		+ '</li>';
}

/* ---------- SendGrid's blocked lists for one address (stage D1) ---------- */

function loadEmailLogSuppressions(email) {
	var box = $('#elSuppression');
	box.html('<p>Checking SendGrid for ' + elEscape(email) + '…</p>');
	elPost('suppressions', { email: email }, function (data) {
		if (!data) {
			box.empty();
			return;
		}
		var entries = data.entries || [];
		var html = '<h3>SendGrid lists for ' + elEscape(email) + '</h3>';
		if (!entries.length) {
			html += '<p>SendGrid sends to this address normally: it is not on any blocked list.</p>';
		} else {
			html += '<ul class="list-unstyled">' + entries.map(function (e) {
				var clear = '';
				if (e.removable && data.canRemove) {
					var id = 'elSupReason' + e.list;
					clear = '<div class="form-inline mt-1" style="gap:.5rem"><label class="sr-only" for="' + id + '">Why clear it</label>'
						+ '<input type="text" class="form-control form-control-sm" id="' + id + '" maxlength="500" placeholder="Why (e.g. mailbox fixed)">'
						+ '<button type="button" class="btn btn-sm btn-outline-danger" data-clear-list="' + elEscape(e.list) + '" data-clear-email="'
						+ elEscape(email) + '">Let SendGrid try again</button></div>';
				} else if (!e.removable) {
					clear = '<div class="el-muted">The person asked for this, so it cannot be cleared here.</div>';
				}
				return '<li class="mb-2">' + elBadge(e.label, e.removable ? 'bad' : 'warn')
					+ (e.since ? ' <span class="el-muted">since ' + elEscape(e.since) + '</span>' : '')
					+ (e.reason ? '<div class="el-muted">' + elEscape(e.reason) + '</div>' : '') + clear + '</li>';
			}).join('') + '</ul>';
		}
		box.html(html);
	});
}

function clearEmailLogSuppression(email, list) {
	var reason = $.trim($('#elSupReason' + list).val());
	if (reason.length < 5) {
		showMessageTheme2(0, 'Please say why (for example "Parent fixed their mailbox").');
		return;
	}
	elPost('suppressions/remove', { email: email, list: list, reason: reason }, function (data) {
		if (data) {
			showMessageTheme2(1, data.removed ? 'Cleared. SendGrid will try this address again.' : 'It was no longer on that list.');
			loadEmailLogSuppressions(email);
		}
	});
}

/* ---------- the school's unsubscribe list (stage F) ---------- */

var EMAIL_LOG_UNSUB = { page: 1, pageSize: 25, total: 0, request: 0, canUpdate: false, ask: null };

function bindEmailLogUnsubscribed() {
	var dialog = document.getElementById('elUnsub');
	$('#elUnsubOpen').on('click', function () {
		dialog.showModal();
		loadEmailLogUnsubscribed(1);
	});
	$('#elUnsubClose').on('click', function () {
		dialog.close();
	});
	$('#elUnsubSearchForm').on('submit', function (e) {
		e.preventDefault();
		loadEmailLogUnsubscribed(1);
	});
	$('#elUnsubPrev').on('click', function () {
		loadEmailLogUnsubscribed(EMAIL_LOG_UNSUB.page - 1);
	});
	$('#elUnsubNext').on('click', function () {
		loadEmailLogUnsubscribed(EMAIL_LOG_UNSUB.page + 1);
	});
	$('#elUnsubAddForm').on('submit', function (e) {
		e.preventDefault();
		addEmailLogUnsubscribed();
	});
	$('#elUnsubRows').on('click', '[data-unsub-remove]', function () {
		askEmailLogUnsubscribe('remove', this.getAttribute('data-unsub-remove'));
	});
	elLightDismiss(dialog);

	// The "why" dialog: Enter or the confirm button sends; Cancel and Esc close it.
	var ask = document.getElementById('elUnsubAsk');
	$('#elUnsubAskForm').on('submit', function (e) {
		e.preventDefault();
		submitEmailLogUnsubscribe();
	});
	$('#elUnsubAskCancel').on('click', function () {
		ask.close();
	});
	$('#elUnsubAskReason').on('input', function () {
		$('#elUnsubAskError').text('');
		this.removeAttribute('aria-invalid');
	});
	ask.addEventListener('close', function () {
		EMAIL_LOG_UNSUB.ask = null;
		$('#elUnsubAskReason').val('').removeAttr('aria-invalid');
		$('#elUnsubAskError').text('');
		$('#elUnsubAskConfirm').prop('disabled', false);
	});
}

function loadEmailLogUnsubscribed(page) {
	if (page < 1) {
		return;
	}
	var search = $.trim($('#elUnsubSearch').val());
	var requestNo = ++EMAIL_LOG_UNSUB.request;
	$('#elUnsubSummary').text('Loading…');
	elPost('unsubscribed', { search: search, page: page, pageSize: EMAIL_LOG_UNSUB.pageSize }, function (data) {
		if (requestNo !== EMAIL_LOG_UNSUB.request) {
			return;
		}
		if (!data) {
			$('#elUnsubSummary').text('');
			return;
		}
		EMAIL_LOG_UNSUB.page = data.page;
		EMAIL_LOG_UNSUB.total = data.total;
		EMAIL_LOG_UNSUB.canUpdate = !!data.canUpdate;
		$('#elUnsubAddForm').prop('hidden', !data.canUpdate);
		var pages = Math.max(1, Math.ceil(data.total / data.pageSize));
		$('#elUnsubRows').html((data.rows || []).map(emailLogUnsubRowHtml).join(''));
		$('#elUnsubSummary').text(data.total === 0
			? (search ? 'No unsubscribed address matches "' + search + '".' : 'Your school has not unsubscribed any address.')
			: data.total.toLocaleString() + (data.total === 1 ? ' address' : ' addresses') + (search ? ' match.' : ' unsubscribed by your school.'));
		$('#elUnsubPage').text(data.total === 0 ? '' : 'Page ' + data.page + ' of ' + pages);
		$('#elUnsubPrev').prop('disabled', data.page <= 1);
		$('#elUnsubNext').prop('disabled', data.page >= pages);
	});
}

function emailLogUnsubRowHtml(e) {
	var by = e.addedBy ? elEscape(e.addedBy) : (e.addedById ? 'Account #' + elEscape(e.addedById) : '<span class="el-muted">Not known</span>');
	return '<tr>'
		+ '<td data-label="Address" class="el-addr">' + elEscape(e.email) + '</td>'
		+ '<td data-label="Why">' + elEscape(e.reason) + '</td>'
		+ '<td data-label="Added by">' + by + '</td>'
		+ '<td data-label="Added (IST)">' + elEscape(e.addedAt || '') + '</td>'
		+ '<td data-label="Actions">' + (EMAIL_LOG_UNSUB.canUpdate ? '<button type="button" class="btn btn-sm btn-outline-primary" data-unsub-remove="'
			+ elEscape(e.email) + '" aria-label="Take ' + elEscape(e.email) + ' off the unsubscribe list">Take off the list</button>' : '') + '</td>'
		+ '</tr>';
}

function addEmailLogUnsubscribed() {
	var email = $.trim($('#elUnsubEmail').val());
	var reason = $.trim($('#elUnsubReason').val());
	if (!email) {
		showMessageTheme2(0, 'Type the email address to unsubscribe.');
		$('#elUnsubEmail').trigger('focus');
		return;
	}
	if (reason.length < 5) {
		showMessageTheme2(0, 'Please say why, in at least 5 characters (for example "Parent asked us to stop emailing this address").');
		$('#elUnsubReason').trigger('focus');
		return;
	}
	var button = $('#elUnsubAdd').prop('disabled', true);
	elPost('unsubscribed/add', { email: email, reason: reason }, function (data) {
		button.prop('disabled', false);
		if (data) {
			$('#elUnsubEmail, #elUnsubReason').val('');
			showMessageTheme2(1, data.email + ' is unsubscribed. It will get none of your school\'s emails except password and sign-in emails.');
			loadEmailLogUnsubscribed(1);
		}
	});
}

/* mode "add": unsubscribe this address; "remove": take it off the list. Both ask why. */
function askEmailLogUnsubscribe(mode, email) {
	if (!email) {
		return;
	}
	var adding = mode === 'add';
	EMAIL_LOG_UNSUB.ask = { mode: mode, email: email };
	$('#elUnsubAskTitle').text(adding ? 'Unsubscribe this address?' : 'Take this address off the list?');
	$('#elUnsubAskText').text(adding
		? email + ' will get none of your school\'s emails from now on, except password and sign-in emails. Emails are still logged, and people with an account still see them in their Inbox.'
		: email + ' will get your school\'s emails again from now on.');
	$('#elUnsubAskConfirm').text(adding ? 'Unsubscribe' : 'Take off the list').toggleClass('btn-danger', adding).toggleClass('btn-primary', !adding);
	document.getElementById('elUnsubAsk').showModal();
}

function submitEmailLogUnsubscribe() {
	var ask = EMAIL_LOG_UNSUB.ask;
	if (!ask) {
		return;
	}
	var field = $('#elUnsubAskReason');
	var reason = $.trim(field.val());
	if (reason.length < 5) {
		$('#elUnsubAskError').text('Please say why, in at least 5 characters.');
		field.attr('aria-invalid', 'true').trigger('focus');
		return;
	}
	var button = $('#elUnsubAskConfirm').prop('disabled', true);
	var adding = ask.mode === 'add';
	elPost(adding ? 'unsubscribed/add' : 'unsubscribed/remove', { email: ask.email, reason: reason }, function (data) {
		button.prop('disabled', false);
		if (!data) {
			return;
		}
		document.getElementById('elUnsubAsk').close();
		showMessageTheme2(1, adding ? data.email + ' is unsubscribed. It will get none of your school\'s emails except password and sign-in emails.'
			: data.email + ' is off the list and will get your school\'s emails again.');
		if (document.getElementById('elUnsub').open) {
			loadEmailLogUnsubscribed(adding ? 1 : EMAIL_LOG_UNSUB.page);
		}
	}, function (refusal) {
		$('#elUnsubAskError').text(refusal);
		field.trigger('focus');
	});
}

/* ---------- resend to another address (stage D1) ---------- */

function resendEmailLog(emailId, archived) {
	var to = $.trim($('#elResendTo').val());
	if (!to) {
		showMessageTheme2(0, 'Type the email address to send it to.');
		return;
	}
	var button = $('#elResendButton').prop('disabled', true);
	elPost('resend', { emailId: emailId, archived: !!archived, to: to }, function (data) {
		button.prop('disabled', false);
		if (data) {
			showMessageTheme2(data.sent ? 1 : 0, data.sent ? 'Sent to ' + to + '.'
				: 'SendGrid did not accept it. The attempt is listed in Email Logs with the reason.');
			openEmailLogDetail(emailId, archived);
		}
	});
}

/* ---------- problem addresses ---------- */

var EMAIL_LOG_PROBLEMS = { page: 1, pageSize: 25, total: 0, request: 0 };

function bindEmailLogProblems() {
	var dialog = document.getElementById('elProblems');
	$('#elProblemsOpen').on('click', function () {
		if (!$('#elProblemsFrom').val()) {
			$('#elProblemsFrom').val(elIstDate(89));
			$('#elProblemsTo').val(elIstDate(0));
			elSetChecked('problem', ['BOUNCED', 'BLOCKED', 'DROPPED']);
		}
		dialog.showModal();
		loadEmailLogProblems(1);
	});
	$('#elProblemsClose').on('click', function () {
		dialog.close();
	});
	$('#elProblemsForm').on('submit', function (e) {
		e.preventDefault();
		loadEmailLogProblems(1);
	});
	$('#elProblemsPrev').on('click', function () {
		loadEmailLogProblems(EMAIL_LOG_PROBLEMS.page - 1);
	});
	$('#elProblemsNext').on('click', function () {
		loadEmailLogProblems(EMAIL_LOG_PROBLEMS.page + 1);
	});
	// "Emails": show this address's emails in the main list for the same dates.
	$('#elProblemsRows').on('click', '[data-problem-email]', function () {
		var email = this.getAttribute('data-problem-email');
		dialog.close();
		resetEmailLogFilters();
		setEmailLogSentPreset('CUSTOM');
		$('#elSentFrom').val($('#elProblemsFrom').val());
		$('#elSentTo').val($('#elProblemsTo').val());
		$('#elRecipient').val(email);
		runEmailLogSearch(1);
	});
	elLightDismiss(dialog);
}

function loadEmailLogProblems(page) {
	if (page < 1) {
		return;
	}
	if (!$('#elProblemsFrom').val() || !$('#elProblemsTo').val()) {
		showMessageTheme2(0, 'Choose both the From and To dates.');
		return;
	}
	var request = {
		from: $('#elProblemsFrom').val(),
		to: $('#elProblemsTo').val(),
		statuses: elChecked('problem'),
		address: $.trim($('#elProblemsAddress').val()),
		page: page,
		pageSize: EMAIL_LOG_PROBLEMS.pageSize
	};
	var requestNo = ++EMAIL_LOG_PROBLEMS.request;
	$('#elProblemsSummary').text('Loading…');
	elPost('problem-addresses', request, function (data) {
		if (requestNo !== EMAIL_LOG_PROBLEMS.request) {
			return;
		}
		if (!data) {
			$('#elProblemsSummary').text('');
			return;
		}
		EMAIL_LOG_PROBLEMS.page = data.page;
		EMAIL_LOG_PROBLEMS.total = data.total;
		var pages = Math.max(1, Math.ceil(data.total / data.pageSize));
		$('#elProblemsRows').html((data.rows || []).map(emailLogProblemRowHtml).join(''));
		$('#elProblemsSummary').text(data.total === 0 ? 'No problem addresses in this period.'
			: data.total.toLocaleString() + (data.total === 1 ? ' address' : ' addresses') + ' with problems.');
		$('#elProblemsPage').text(data.total === 0 ? '' : 'Page ' + data.page + ' of ' + pages);
		$('#elProblemsPrev').prop('disabled', data.page <= 1);
		$('#elProblemsNext').prop('disabled', data.page >= pages);
	});
}

function emailLogProblemRowHtml(p) {
	var labels = { BOUNCED: 'Bounced', BLOCKED: 'Blocked', DROPPED: 'Dropped' };
	var problem = [];
	if (labels[p.lastStatus]) {
		problem.push(elBadge(labels[p.lastStatus], 'bad'));
	}
	if (p.spamReported) {
		problem.push(elBadge('Marked as spam', 'warn'));
	}
	if (p.unsubscribed) {
		problem.push(elBadge('Unsubscribed', 'warn'));
	}
	var role = p.role ? (EMAIL_LOG_ROLE_LABELS[p.role] || 'Staff') : (p.childUserId ? 'Parent' : null);
	var account = p.name ? elEscape(p.name) + (p.userId ? ' <span class="el-muted">#' + p.userId + '</span>' : '')
		: (p.childName ? 'Parent of ' + elEscape(p.childName) : '<span class="el-muted">Not matched to an account</span>');
	return '<tr>'
		+ '<td data-label="Address" class="el-addr">' + elEscape(p.email) + '</td>'
		+ '<td data-label="Account">' + account + (role ? ' ' + elBadge(role, 'role') : '') + '</td>'
		+ '<td data-label="Latest problem">' + problem.join(' ')
		+ (p.reason ? '<div class="el-muted">' + elEscape(p.reason.length > 140 ? p.reason.substring(0, 140) + '…' : p.reason) + '</div>' : '')
		+ (p.deliveredSince ? '<div>' + elBadge('Delivered since', 'ok') + '</div>' : '')
		+ '</td>'
		+ '<td data-label="Failed emails">' + p.failures + '</td>'
		+ '<td data-label="Last">' + elEscape(p.lastAt) + '</td>'
		+ '<td data-label="Actions"><div class="d-flex flex-wrap" style="gap:.35rem">'
		+ '<button type="button" class="btn btn-sm btn-outline-primary" data-problem-email="'
		+ elEscape(p.email) + '" aria-label="Emails to ' + elEscape(p.email) + '">Emails</button>'
		+ '<button type="button" class="btn btn-sm btn-outline-secondary" data-suppression-email="' + elEscape(p.email)
		+ '" aria-label="SendGrid lists for ' + elEscape(p.email) + '">SendGrid lists</button>'
		+ (EMAIL_LOGS_STATE.canUpdate ? '<button type="button" class="btn btn-sm btn-outline-danger" data-unsub-email="' + elEscape(p.email)
			+ '" aria-label="Unsubscribe ' + elEscape(p.email) + ' from the school\'s emails">Unsubscribe</button>' : '')
		+ '</div></td>'
		+ '</tr>';
}

function emailLogRecipientRowHtml(r) {
	var status = elDeliveryLabel(r.deliveryStatus, r.reason);
	var role = r.role ? (EMAIL_LOG_ROLE_LABELS[r.role] || 'Staff') : (r.childUserId ? 'Parent' : null);
	var who = r.name ? elEscape(r.name) : '';
	if (r.childName && !r.userId) {
		who += (who ? ' · ' : '') + 'Parent contact of ' + elEscape(r.childName);
	}
	if (!who && !role) {
		who = '<span class="el-muted">Not matched</span>';
	}
	var flags = (r.spamReported ? ' ' + elBadge('Marked as spam', 'bad') : '') + (r.unsubscribed ? ' ' + elBadge('Unsubscribed', 'warn') : '');
	var schoolUnsubscribed = r.deliveryStatus === 'OPTED_OUT' && r.reason === EMAIL_LOG_SCHOOL_UNSUBSCRIBED;
	var unsubscribe = EMAIL_LOGS_STATE.canUpdate && !schoolUnsubscribed
		? '<div><button type="button" class="btn btn-link btn-sm p-0" data-unsub-email="' + elEscape(r.email)
			+ '" aria-label="Unsubscribe ' + elEscape(r.email) + ' from the school\'s emails">Unsubscribe this address</button></div>' : '';
	return '<tr>'
		+ '<td data-label="Address"><div class="el-addr">' + elEscape(r.email) + '</div>'
		+ (r.type && r.type !== 'TO' ? '<span class="el-muted">' + elEscape(r.type) + '</span>' : '') + unsubscribe + '</td>'
		+ '<td data-label="Account">' + (role ? elBadge(role, 'role') + ' ' : '') + who
		+ (r.userId ? ' <span class="el-muted">#' + r.userId + '</span>' : '') + '</td>'
		+ '<td data-label="Delivery">' + elBadge(status[0], status[1]) + flags
		+ (r.deliveredAt ? '<div class="el-muted">' + elEscape(r.deliveredAt) + '</div>' : '')
		+ (r.reason && r.deliveryStatus !== 'OPTED_OUT' ? '<div class="text-danger">' + elEscape(r.reason) + '</div>' : '') + '</td>'
		+ '<td data-label="Opens">' + r.opens + (r.autoOpens ? '<div class="el-muted">+' + r.autoOpens + ' auto</div>' : '')
		+ (r.lastOpenedAt ? '<div class="el-muted">Last ' + elEscape(r.lastOpenedAt) + '</div>' : '') + '</td>'
		+ '<td data-label="Clicks">' + r.clicks + (r.lastClickedAt ? '<div class="el-muted">Last ' + elEscape(r.lastClickedAt) + '</div>' : '') + '</td>'
		+ '</tr>';
}

function emailLogEventHtml(ev) {
	var label = EMAIL_LOG_EVENT_LABELS[ev.type] || ev.type;
	if (ev.type === 'open' && ev.machineOpen) {
		label = 'Auto-opened by a mail app';
	}
	if (ev.type === 'bounce' && ev.bounceType === 'blocked') {
		label = 'Blocked';
	}
	var details = [];
	if (ev.reason) {
		details.push(elEscape(ev.reason));
	}
	if (ev.bounceClassification) {
		details.push('Classification: ' + elEscape(ev.bounceClassification));
	}
	if (ev.url) {
		details.push('Link: <span class="el-addr">' + elEscape(ev.url) + '</span>');
	}
	if (ev.userAgent && (ev.type === 'open' || ev.type === 'click')) {
		details.push('<span class="el-muted">' + elEscape(ev.userAgent) + (ev.ip ? ' · ' + elEscape(ev.ip) : '') + '</span>');
	}
	return '<li><div><strong>' + elEscape(label) + '</strong> <span class="el-muted">' + elEscape(ev.email || '') + '</span></div>'
		+ '<div class="el-when">' + elEscape(ev.at) + ' IST</div>'
		+ (details.length ? '<div>' + details.join('<br>') + '</div>' : '')
		+ '</li>';
}

/* ---------- Email Verification page (unchanged apart from escaping the table values) ---------- */

function getEmailVerifyByEmail() {
    var email = $("#emailVerifyForm" + " #getVEmail").val();
    console.log("email is " + email);
    if (!validateEmail(email)) {
        showMessageTheme2(0, 'Email is either empty or invalid', 'studEmailIdError');
        return false;
    }
    if (email != '') {
        var data={};
          data['email']=email;
        $.ajax({
            contentType: APPLICATION_JSON_VALUE,
            type: "POST",
            url: getURLForHTML('dashboard', 'email-status-data'),
		    data : JSON.stringify(data),
            dataType: 'json',
            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                    return false;
                } else {
                    var isDataTable = $.fn.dataTable.isDataTable('#emailVTable');
                    if (isDataTable) {
                        $('#emailVTable').dataTable().fnDestroy();
                    }
                    $("#verificationDataTableWrapper").html(emailVerificationTable(data));
                    $('#emailVTable').dataTable()
                    return false;
                }
            },
            error: function (e) {
                console.log(e)
                return false;
            }
        });
    } else {
        return false;
    }
}


function emailVerificationTable(data) {
    var html=`
        <table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="emailVTable">
            <thead class="bg-primary text-white">
                <tr>
                    <th>Email</th>
                    <th>Verification Status</th>
                    <th>Checked Date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${getVTableData(data)}
            </tbody>
        </table>`;
    return html;
}


function getVTableData(data) {
    var button = '';
    if (data.emailStatus === 'Verified') {
        button = `<td>
                    <button onClick="getChangeEmailVerification(0)" class="btn btn-primary ">Unverify</button>
                  </td>`;
    } else {
        button = `<td>
                    <button onClick="getChangeEmailVerification(1)" class="btn btn-primary ">Verify</button>
                  </td>`;
    }
    var row =
        `<tr>
            <td>${elEscape(data.email)}</td>
            <td>${elEscape(data.emailStatus)}</td>
            <td>${elEscape(data.dateTime)}</td>
            ${button}
        </tr>`;
    return row;
}



function getChangeEmailVerification(status) {
    var email = $("#emailVerifyForm" + " #getVEmail").val();
    var data={};
    data['email']=email;
    data['status']=status;
    $.ajax({
        contentType: APPLICATION_JSON_VALUE,
        type: "POST",
        url: getURLForHTML('dashboard', 'email-status-change'),
        data : JSON.stringify(data),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(0, data['message']);
                return false;
            } else {
                getEmailVerifyByEmail();
                return false;
            }
        }
    });
}
