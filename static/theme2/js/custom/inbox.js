/*
 * Inbox (every user): behaviour. Markup and styles are in inboxContent.js.
 * Server: {schoolId}/dashboard/inbox/* (InboxController), always for the logged-in user.
 * Every value from the server is escaped before it reaches the page.
 * Writing messages (Compose, Sent, Reply): inbox/compose/*, inbox/sent; who may write to whom is
 * decided on the server (emailtracking.mailbox), the page only offers what it is given.
 */

var INBOX_STATE;
var INBOX_ICONS = { EMAIL: ['fa-envelope', 'Email'], NOTIFICATION: ['fa-bell', 'Notification'], ANNOUNCEMENT: ['fa-bullhorn', 'Announcement'],
	WHATSAPP: ['fa-comments', 'WhatsApp message'] };
var INBOX_UNDELIVERED = 'We couldn\'t deliver this email to your email address. You can read it here. '
	+ 'Please check the email address in your profile, or ask the school office to update it.';

/* options.compose: opened from Communication > Compose, so a new message opens as soon as writing is allowed. */
function initInbox(options) {
	// Fresh state each time the page opens: the markup starts on "All", page 1.
	INBOX_STATE = { channel: 'ALL', page: 1, pageSize: 20, total: 0, request: 0, sent: {} };
	INBOX_MAILBOX = newInboxMailbox();
	INBOX_DRAFT = newInboxDraft(null);
	INBOX_TO = newInboxTo();
	$('#dashboardContentInHTML').html(getInboxContent());
	ensureInboxStyles();
	setInboxDates('LAST_30');
	$('#inboxForm').on('submit', function (e) {
		e.preventDefault();
		loadInbox(1);
	});
	$('#ibDate').on('change', function () {
		setInboxDates(this.value);
	});
	$('.ib-tab').on('click', function () {
		INBOX_STATE.channel = this.getAttribute('data-channel');
		$('.ib-tab').attr('aria-pressed', 'false');
		this.setAttribute('aria-pressed', 'true');
		// Read state, categories, children, attachments and stars do not apply to what you sent.
		$('.ib-not-sent').prop('hidden', INBOX_STATE.channel === 'SENT');
		$('#ibChildGroup').prop('hidden', INBOX_STATE.channel === 'SENT' || $('#ibChild option').length < 2);
		loadInbox(1);
	});
	$('#ibPrev').on('click', function () { loadInbox(INBOX_STATE.page - 1); });
	$('#ibNext').on('click', function () { loadInbox(INBOX_STATE.page + 1); });
	$('#ibMarkAll').on('click', function () {
		inboxPost('mark-all-read', {}, function (data) {
			if (data) {
				loadInbox(INBOX_STATE.page);
				refreshInboxBadge();
			}
		});
	});
	$('#ibList').on('click', '.ib-item__open', function () {
		openInboxItem(this.getAttribute('data-channel'), this.getAttribute('data-id'), this.getAttribute('data-child'));
	});
	$('#ibList').on('click', '.ib-star', function () {
		var button = this;
		inboxPost('star', { channel: button.getAttribute('data-channel'), id: button.getAttribute('data-id') }, function (data) {
			if (data) {
				button.setAttribute('aria-pressed', data.starred ? 'true' : 'false');
			}
		});
	});
	bindInboxReader();
	bindInboxSettings();
	bindInboxCompose();
	loadInboxMailbox(!!(options && options.compose));
	inboxPost('children', {}, function (children) {
		var ids = children ? Object.keys(children) : [];
		if (ids.length) {
			$('#ibChild').append(ids.map(function (id) {
				return '<option value="' + ibEscape(id) + '">' + ibEscape(children[id] || 'Child') + '</option>';
			}).join(''));
			$('#ibChildGroup').prop('hidden', false);
		}
	});
	loadInbox(1);
}

/* ---------- helpers ---------- */

function ibEscape(value) {
	if (value === null || value === undefined) {
		return '';
	}
	return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/*
 * Notification and announcement text is written by staff and may hold HTML. Only its text
 * is shown: it is parsed in a separate, inert document (nothing in it loads or runs) and
 * never handed to jQuery .html() or innerHTML.
 */
function ibPlainText(html) {
	var withBreaks = String(html || '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h[1-6])>/gi, '\n');
	var text = new DOMParser().parseFromString(withBreaks, 'text/html').body.textContent || '';
	return text.replace(/\n{3,}/g, '\n\n').trim();
}

/* A date as yyyy-mm-dd in IST (how the server reads date ranges). */
function ibIstDate(daysAgo) {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' })
		.format(new Date(Date.now() - (daysAgo || 0) * 86400000));
}

/* A time in the user's own time zone (USER_TIMEZONE), falling back to the browser's. */
function ibTime(epochMillis) {
	if (!epochMillis) {
		return '';
	}
	var options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
	try {
		if (typeof USER_TIMEZONE !== 'undefined' && USER_TIMEZONE) {
			options.timeZone = USER_TIMEZONE;
		}
		return new Intl.DateTimeFormat(undefined, options).format(new Date(epochMillis));
	} catch (e) {
		delete options.timeZone;
		return new Intl.DateTimeFormat(undefined, options).format(new Date(epochMillis));
	}
}

function inboxPost(path, request, onDone) {
	$.ajax({
		contentType: APPLICATION_JSON_VALUE,
		type: 'POST',
		url: getURLForHTML('dashboard', 'inbox/' + path),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function (response) {
			if (!response || response.status !== '1') {
				showMessageTheme2(0, (response && response.message) || 'Your inbox could not be loaded just now. Please try again in a minute.');
				onDone(null);
				return;
			}
			onDone(response.data);
		},
		error: function () {
			showMessageTheme2(0, 'Your inbox could not be reached. Check your connection and try again.');
			onDone(null);
		}
	});
}

function setInboxDates(preset) {
	$('#ibDate').val(preset);
	$('.ib-custom').prop('hidden', preset !== 'CUSTOM');
	var ranges = { TODAY: [0, 0], YESTERDAY: [1, 1], LAST_7: [6, 0], LAST_30: [29, 0] };
	if (ranges[preset]) {
		$('#ibFrom').val(ibIstDate(ranges[preset][0]));
		$('#ibTo').val(ibIstDate(ranges[preset][1]));
	}
}

/* ---------- list ---------- */

function loadInbox(page) {
	if (page < 1) {
		return;
	}
	if ($('#ibDate').val() === 'CUSTOM' && (!$('#ibFrom').val() || !$('#ibTo').val())) {
		showMessageTheme2(0, 'Choose both the From and To dates, or pick a preset such as Last 30 days.');
		return;
	}
	if (INBOX_STATE.channel === 'SENT') {
		loadInboxSent(page);
		return;
	}
	var category = $('#ibCategory').val();
	var request = {
		channel: INBOX_STATE.channel,
		read: $('#ibRead').val(),
		from: $('#ibFrom').val(),
		to: $('#ibTo').val(),
		categories: category ? [category] : [],
		childUserId: $('#ibChild').val() ? parseInt($('#ibChild').val(), 10) : null,
		search: $.trim($('#ibSearch').val()),
		withAttachments: $('#ibAttachments').is(':checked'),
		starred: $('#ibStarred').is(':checked'),
		page: page,
		pageSize: INBOX_STATE.pageSize
	};
	// The newest request wins: an answer to an older one (filters changed meanwhile) is dropped.
	var requestNo = ++INBOX_STATE.request;
	$('#ibSummary').text('Loading…');
	inboxPost('list', request, function (data) {
		if (requestNo !== INBOX_STATE.request) {
			return;
		}
		if (!data) {
			$('#ibSummary').text('');
			return;
		}
		INBOX_STATE.page = data.page;
		INBOX_STATE.total = data.total;
		// WhatsApp items open from what the list already has (only the message name is stored).
		INBOX_STATE.items = {};
		(data.items || []).forEach(function (item) {
			INBOX_STATE.items[item.channel + ':' + item.id] = item;
		});
		$('#ibList').html((data.items || []).map(inboxItemHtml).join(''));
		var summary = data.total === 0 ? 'Nothing here for these filters.' : data.total.toLocaleString() + (data.total === 1 ? ' item' : ' items');
		if (data.total > data.lastPage * data.pageSize) {
			summary += '. The newest ' + (data.lastPage * data.pageSize).toLocaleString()
				+ ' are listed; choose shorter dates or search to find older ones.';
		}
		$('#ibSummary').text(summary);
		setInboxPager(data);
	});
}

function setInboxPager(data) {
	$('#ibPageInfo').text(data.total === 0 ? '' : 'Page ' + data.page + ' of ' + data.lastPage);
	$('#ibPrev').prop('disabled', data.page <= 1);
	$('#ibNext').prop('disabled', data.page >= data.lastPage);
}

function inboxItemHtml(item) {
	var icon = INBOX_ICONS[item.channel] || ['fa-envelope', item.channel];
	var meta = [ibEscape(item.sender || 'School')];
	if (item.childName) {
		meta.push('<span class="ib-chip">For ' + ibEscape(item.childName) + '</span>');
	}
	if (item.category && item.channel === 'EMAIL') {
		meta.push('<span class="ib-chip">' + ibEscape(item.category) + '</span>');
	}
	return '<li class="ib-item' + (item.read ? '' : ' ib-item--unread') + '">'
		+ '<span class="ib-icon"><i class="fa ' + icon[0] + '" aria-hidden="true"></i><span class="sr-only">' + icon[1] + '</span></span>'
		+ '<button type="button" class="ib-item__open" data-channel="' + ibEscape(item.channel) + '" data-id="' + ibEscape(item.id)
		+ '" data-child="' + ibEscape(item.childUserId || '') + '">'
		+ (item.read ? '' : '<span class="sr-only">Unread: </span>')
		+ '<span class="ib-item__title">' + ibEscape(item.title || '(no subject)') + '</span>'
		+ '<span class="ib-item__meta">' + meta.join(' ') + '</span>'
		+ (item.preview ? '<span class="ib-item__preview">' + ibEscape(item.preview) + '</span>' : '')
		+ (item.undelivered ? '<span class="ib-item__meta ib-warn"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Not delivered to your email</span>' : '')
		+ '</button>'
		+ '<span class="ib-item__side"><span>' + ibEscape(ibTime(item.at)) + '</span>'
		+ (item.attachments ? '<i class="fa fa-paperclip" aria-label="Has attachments"></i>' : '')
		+ '<button type="button" class="ib-star" data-channel="' + ibEscape(item.channel) + '" data-id="' + ibEscape(item.id)
		+ '" aria-pressed="' + (item.starred ? 'true' : 'false') + '" aria-label="Star"><i class="fa fa-star" aria-hidden="true"></i></button>'
		+ '</span>'
		+ '</li>';
}

/* ---------- email settings (which optional emails reach the person's mailbox) ---------- */

var INBOX_SETTING_LABELS = {
	'Announcements & events': ['Announcements and events', 'School news, events and general announcements.'],
	'School partnerships': ['School partnerships', 'News about programmes the school runs with partners.'],
	'Other': ['Other school emails', 'Anything the school has not put in another group.'],
	'WEEKLY_DIGEST': ['Weekly summary', 'On Sundays, a short list of what you have not read yet.']
};

function bindInboxSettings() {
	var dialog = document.getElementById('ibSettings');
	$('#ibSettingsOpen').on('click', function () {
		$('#ibSettingsList').html('<p aria-live="polite">Loading…</p>');
		dialog.showModal();
		inboxPost('email-settings', {}, renderInboxSettings);
	});
	$('#ibSettingsClose').on('click', function () {
		dialog.close();
	});
	$('#ibSettingsList').on('change', 'input[data-setting]', function () {
		var input = this;
		input.disabled = true;
		inboxPost('email-settings/save', { key: input.getAttribute('data-setting'), on: input.checked }, function (settings) {
			input.disabled = false;
			if (!settings) {
				input.checked = !input.checked;
				return;
			}
			renderInboxSettings(settings);
			showMessageTheme2(1, input.checked ? 'Switched on.' : 'Switched off. These will still appear in your Inbox.');
		});
	});
	ibLightDismiss(dialog);
}

function renderInboxSettings(settings) {
	if (!settings) {
		document.getElementById('ibSettings').close();
		return;
	}
	// Only the switches the school offers (a group shows once it has emails people may switch off).
	$('#ibSettingsList').html(Object.keys(settings).filter(function (key) { return INBOX_SETTING_LABELS[key]; }).map(function (key, index) {
		var label = INBOX_SETTING_LABELS[key];
		var id = 'ibSetting' + index;
		// The native switch control where supported; elsewhere the same input is an ordinary checkbox.
		return '<div class="ib-setting"><input type="checkbox" switch id="' + id + '" data-setting="' + ibEscape(key) + '"'
			+ (settings[key] === false ? '' : ' checked') + ' aria-describedby="' + id + 'Hint">'
			+ '<label for="' + id + '" class="mb-0">' + ibEscape(label[0]) + '<span class="ib-setting__hint" id="' + id + 'Hint">'
			+ ibEscape(label[1]) + '</span></label></div>';
	}).join(''));
}

/* ---------- reading pane ---------- */

function bindInboxReader() {
	var dialog = document.getElementById('ibReader');
	$('#ibReaderClose').on('click', function () {
		dialog.close();
	});
	$('#ibReaderPrint').on('click', function () {
		window.print();
	});
	$('#ibReaderBody').on('click', '#ibAcknowledge', function () {
		acknowledgeInboxAnnouncement(this);
	});
	$('#ibReaderBody').on('click', '#ibReply', function () {
		replyInboxMessage(this);
	});
	$('#ibReaderBody').on('click', '.ib-inreply', function () {
		openInboxItem('EMAIL', this.getAttribute('data-id'), '');
	});
	dialog.addEventListener('close', function () {
		$('#ibReaderBody').empty();
		loadInbox(INBOX_STATE.page);
		refreshInboxBadge();
	});
	ibLightDismiss(dialog);
}

/* Click-outside where <dialog closedby> is not supported (Safari): press and release both outside the panel. */
function ibLightDismiss(dialog) {
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

function openInboxItem(channel, id, child) {
	var dialog = document.getElementById('ibReader');
	$('#ibReaderTitle').text('Message');
	$('#ibReaderBody').html('<p aria-live="polite">Loading…</p>');
	if (!dialog.open) {
		dialog.showModal();
	}
	if (channel === 'WHATSAPP') {
		renderInboxWhatsApp((INBOX_STATE.items || {})['WHATSAPP:' + id]);
		return;
	}
	var path = channel === 'EMAIL' ? 'email' : channel === 'NOTIFICATION' ? 'notification' : 'announcement';
	var request = { id: id };
	if (channel === 'ANNOUNCEMENT' && child) {
		request.childUserId = parseInt(child, 10);
	}
	inboxPost(path, request, function (data) {
		if (!data) {
			dialog.close();
			return;
		}
		if (channel === 'EMAIL') {
			renderInboxEmail(data);
		} else {
			renderInboxMessage(data, channel === 'ANNOUNCEMENT' ? id : null, child);
		}
	});
}

function renderInboxEmail(email) {
	var contentUrl = BASE_URL + CONTEXT_PATH + UNIQUEUUID + '/dashboard/inbox/email-content?payload=' + encodeURIComponent(email.contentPayload || '');
	$('#ibReaderTitle').text(email.subject || '(no subject)');
	var html = '<p class="mb-2">From <strong>' + ibEscape(email.sender) + '</strong> · ' + ibEscape(ibTime(email.at))
		+ (email.childName ? ' · <span class="ib-chip">For ' + ibEscape(email.childName) + '</span>' : '') + '</p>';
	html += inboxMessageExtrasHtml(email);
	if (email.undelivered) {
		html += '<div class="ib-notice" role="note">' + ibEscape(INBOX_UNDELIVERED) + '</div>';
	}
	var attachments = email.attachments || [];
	if (attachments.length) {
		// Each link is checked again on the server, which then hands out a 5-minute download link.
		html += '<p class="mb-2">' + attachments.map(function (a) {
			var href = BASE_URL + CONTEXT_PATH + UNIQUEUUID + '/dashboard/inbox/attachment?payload=' + encodeURIComponent(a.payload || '');
			return '<a target="_blank" rel="noopener" href="' + ibEscape(href) + '"><i class="fa fa-paperclip" aria-hidden="true"></i> '
				+ ibEscape(a.name) + '</a>';
		}).join(' &nbsp; ') + '</p>';
	}
	// sandbox without allow-scripts: an email's own HTML can never run script in the user's session.
	html += '<iframe class="ib-frame" id="ibFrame" title="Email" sandbox="allow-same-origin allow-popups" src="' + ibEscape(contentUrl) + '"></iframe>';
	$('#ibReaderBody').html(html);
	$('#ibFrame').on('load', function () {
		try {
			this.style.blockSize = Math.min(Math.max(this.contentWindow.document.documentElement.scrollHeight + 16, 200), 3000) + 'px';
		} catch (err) {
			// Keep the default height.
		}
	});
}

function renderInboxWhatsApp(item) {
	if (!item) {
		document.getElementById('ibReader').close();
		return;
	}
	$('#ibReaderTitle').text(item.title || 'WhatsApp message');
	$('#ibReaderBody').html('<p class="mb-2 text-muted">' + ibEscape(ibTime(item.at))
		+ (item.childName ? ' · <span class="ib-chip">For ' + ibEscape(item.childName) + '</span>' : '') + '</p>'
		+ (item.undelivered ? '<div class="ib-notice" role="note">' + ibEscape(item.preview) + ' Please check the mobile number in your profile, '
			+ 'or ask the school office to update it.</div>' : '<p>' + ibEscape(item.preview) + '</p>')
		+ '<p class="text-muted mb-0">The school sent this through WhatsApp. Only the message\'s name is kept here, not its text: '
		+ 'open WhatsApp on your phone to read it.</p>');
}

function renderInboxMessage(message, announceId, child) {
	$('#ibReaderTitle').text(message.title || 'Message');
	var html = '<p class="mb-2 text-muted">' + ibEscape(ibTime(message.at))
		+ (message.childName ? ' · <span class="ib-chip">For ' + ibEscape(message.childName) + '</span>' : '') + '</p>'
		+ '<div class="ib-text">' + ibEscape(ibPlainText(message.message)) + '</div>';
	if (message.attachment) {
		html += '<p class="mt-3"><a target="_blank" rel="noopener" href="' + ibEscape(FILE_UPLOAD_PATH + message.attachment)
			+ '"><i class="fa fa-paperclip" aria-hidden="true"></i> Attachment</a></p>';
	}
	if (announceId && message.requiresAck) {
		html += message.acknowledged
			? '<p class="ib-confirmed mt-3" role="status"><i class="fa fa-check" aria-hidden="true"></i> You confirmed you have read this.</p>'
			: '<div class="mt-3 ib-no-print"><p class="mb-2">The school asked you to confirm you have read this.</p>'
				+ '<button type="button" class="btn btn-primary" id="ibAcknowledge" data-id="' + ibEscape(announceId) + '" data-child="'
				+ ibEscape(child || '') + '">I have read this</button></div>';
	}
	$('#ibReaderBody').html(html);
}

function acknowledgeInboxAnnouncement(button) {
	button.disabled = true;
	var request = { id: parseInt(button.getAttribute('data-id'), 10) };
	if (button.getAttribute('data-child')) {
		request.childUserId = parseInt(button.getAttribute('data-child'), 10);
	}
	inboxPost('acknowledge', request, function (data) {
		if (!data) {
			button.disabled = false;
			return;
		}
		$(button).parent().replaceWith('<p class="ib-confirmed mt-3" role="status"><i class="fa fa-check" aria-hidden="true"></i> '
			+ 'Thank you. You confirmed you have read this.</p>');
	});
}

/* ---------- writing messages: Compose, Sent, Reply ---------- */

var INBOX_MAILBOX = newInboxMailbox();
var INBOX_DRAFT = newInboxDraft(null);
var INBOX_FILTER = { loaded: false };
var INBOX_TO = newInboxTo();
var INBOX_ATTACHMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];
var INBOX_SENT_LABELS = { SENT: 'sent', NOT_SENT: 'not sent by email; it is still in their Inbox', SENDING: 'sending' };

/* Empty state, the one place it is spelled out: initInbox and a new message start from these, so a field
   added here is never missing after the page is opened again. */
function newInboxMailbox() {
	return { enabled: false, canCompose: false, search: false, filter: false, max: 10, contacts: [], writer: null, backgroundFrom: 0 };
}

/* The To list's filter: the audience it is narrowed to (null: everyone), how that reads, and a teacher's filtered people. */
function newInboxTo() {
	return { filter: null, filterLabel: '', shown: [], error: '' };
}

function newInboxDraft(reply) {
	return { replyTo: reply, picked: reply ? [reply.to] : [], groups: [] };
}

/* A request whose refusal the caller shows itself (no page-wide message). onDone(response or null). */
function ibQuietPost(path, request, onDone) {
	return $.ajax({
		contentType: APPLICATION_JSON_VALUE,
		type: 'POST',
		url: getURLForHTML('dashboard', 'inbox/' + path),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function (response) {
			onDone(response || null);
		},
		error: function () {
			onDone(null);
		}
	});
}

/* Whether this person may write: shows the Sent tab and the Compose button only when the server says so.
   openCompose: also open a new message (Communication > Compose), or say plainly why it cannot be written. */
function loadInboxMailbox(openCompose) {
	ibQuietPost('compose/contacts', {}, function (response) {
		var book = response && response.status === '1' ? response.data : null;
		INBOX_MAILBOX.enabled = !!(book && book.enabled);
		INBOX_MAILBOX.canCompose = !!(book && book.canCompose);
		$('#ibSentTab').prop('hidden', !INBOX_MAILBOX.enabled);
		$('#ibComposeOpen').prop('hidden', !INBOX_MAILBOX.canCompose);
		if (book) {
			applyInboxBook(book);
		}
		if (openCompose) {
			if (INBOX_MAILBOX.canCompose) {
				openInboxCompose(null);
			} else {
				showMessageTheme2(0, (book && book.reason) || (response && response.message)
					|| 'Writing messages could not be opened just now. Please try again in a minute.');
			}
		}
	});
}

function applyInboxBook(book) {
	INBOX_MAILBOX.search = !!book.search;
	INBOX_MAILBOX.max = book.maxRecipients || INBOX_MAILBOX.max;
	INBOX_MAILBOX.writer = book.writer || INBOX_MAILBOX.writer;
	INBOX_MAILBOX.backgroundFrom = book.backgroundFrom || INBOX_MAILBOX.backgroundFrom;
	if (!book.search) {
		INBOX_MAILBOX.contacts = book.contacts || [];
	}
	INBOX_MAILBOX.filter = !!book.filter;
	var writer = INBOX_MAILBOX.writer;
	$('#ibComposeFrom').text(writer && writer.name ? 'From: ' + writer.name + (writer.role ? ' \u00b7 ' + writer.role : '') : '')
		.prop('hidden', !(writer && writer.name));
	$('#ibToRole').prop('hidden', !INBOX_MAILBOX.search || !!INBOX_TO.filter);
	// Admins and teachers may narrow the list with the filter; only an admin adds a whole group at once.
	$('#ibToFilterOpen').prop('hidden', !INBOX_MAILBOX.filter || !!INBOX_DRAFT.replyTo);
	$('.ib-admin-only').prop('hidden', !INBOX_MAILBOX.search).filter('option').prop('disabled', !INBOX_MAILBOX.search);
	$('.ib-teacher-only').prop('hidden', INBOX_MAILBOX.search);
	$('#ibToHint').text((INBOX_MAILBOX.search ? 'Open the list to see everyone in the school, or type a name or email address to narrow it.'
		: 'Open the list to see everyone you can write to, or type a name to narrow it.') + ' Up to ' + INBOX_MAILBOX.max + ' people.');
	setupInboxToSelect();
}

function bindInboxCompose() {
	var dialog = document.getElementById('ibCompose');
	$('#ibComposeOpen').on('click', function () {
		openInboxCompose(null);
	});
	// Close and Esc keep what was written; it is there when Compose opens again.
	$('#ibComposeClose').on('click', function () {
		dialog.close();
	});
	$('#ibComposeDiscard').on('click', function () {
		resetInboxDraft(null);
		dialog.close();
	});
	$('#ibComposeForm').on('submit', function (e) {
		e.preventDefault();
		sendInboxMessage();
	});
	$('#ibMessage').on('input', function () {
		$('#ibMessageCount').text(this.value.length.toLocaleString() + ' of 10,000 characters');
		clearInboxComposeError();
	});
	$('#ibSubject').on('input', clearInboxComposeError);
	$('#ibFiles').on('change', function () {
		var problem = inboxFileProblem(this.files);
		if (problem) {
			showInboxComposeError(problem);
		} else {
			clearInboxComposeError();
		}
	});
	// The visible label belongs to Select2's own search box, not to the hidden select underneath.
	$('#ibToLabel').on('click', function (e) {
		e.preventDefault();
		focusInboxTo();
	});
	// An admin's list is read again for the chosen role the next time it opens.
	$('#ibToRole').on('change', function () {
		setupInboxToSelect();
	});
	// Esc closes an open To list first, not the whole composer.
	dialog.addEventListener('cancel', function (e) {
		var select2 = $('#ibToSelect').data('select2');
		if (select2 && select2.isOpen()) {
			e.preventDefault();
			$('#ibToSelect').select2('close');
		}
	});
	// Only groups have a remove button here; people are removed in the To list (a reply's one person cannot be).
	$('#ibToChips').on('click', '.ib-person__remove[data-group]', function () {
		removeInboxGroup(parseInt(this.getAttribute('data-group'), 10));
	});
	bindInboxFilter();
	// The check-before-send dialog: only "Send" sends; Go back, Esc and a click outside return to the message.
	var check = document.getElementById('ibCheckSend');
	check.addEventListener('close', function () {
		var chosen = check.returnValue;
		check.returnValue = '';
		if (chosen === 'send') {
			postInboxMessage();
		}
	});
}

/* reply: null for a new message, or what compose/reply answered (inReplyToId, to, subject). */
function openInboxCompose(reply) {
	var dialog = document.getElementById('ibCompose');
	var sameDraft = reply ? !!(INBOX_DRAFT.replyTo && INBOX_DRAFT.replyTo.inReplyToId === reply.inReplyToId) : !INBOX_DRAFT.replyTo;
	$('#ibComposeNote').prop('hidden', true);
	if (!sameDraft) {
		if (inboxDraftDirty()) {
			// Never lose what someone wrote: the unsent one stays until it is sent or discarded.
			$('#ibComposeNote').text((INBOX_DRAFT.replyTo ? 'You have an unsent reply.' : 'You have an unsent message.')
				+ ' Send it, or choose Discard and start again.').prop('hidden', false);
		} else {
			resetInboxDraft(reply);
		}
	}
	clearInboxComposeError();
	if (!dialog.open) {
		dialog.showModal();
	}
	announceInboxComposeOpen();
	if (INBOX_DRAFT.replyTo) {
		$('#ibMessage').trigger('focus');
		return;
	}
	if (INBOX_DRAFT.picked.length) {
		$('#ibSubject').trigger('focus');
	} else {
		focusInboxTo();
	}
	// Read again each time: someone assigned this morning is offered now, someone who left is not.
	ibQuietPost('compose/contacts', {}, function (response) {
		if (!response || response.status !== '1' || !response.data) {
			return;
		}
		applyInboxBook(response.data);
		announceInboxComposeOpen();
		if (!response.data.canCompose) {
			showInboxComposeError(response.data.reason || 'You cannot write messages just now.');
		}
	});
}

/* Helpers beside the composer (templates, AI writing help) listen to these two events on document. */
function inboxWriterKind() {
	return (INBOX_MAILBOX.writer && INBOX_MAILBOX.writer.kind) || '';
}

function inboxRecipientCount() {
	return INBOX_DRAFT.picked.length + INBOX_DRAFT.groups.reduce(function (sum, g) { return sum + g.count; }, 0);
}

function announceInboxComposeOpen() {
	document.dispatchEvent(new CustomEvent('inbox:compose-open', { detail: {
		writerKind: inboxWriterKind(),
		writerName: (INBOX_MAILBOX.writer && INBOX_MAILBOX.writer.name) || '',
		recipientCount: inboxRecipientCount()
	} }));
	announceInboxRecipients();
}

/* kind: STUDENT, PARENT, TEACHER, OFFICE (the school office) or ADMIN; childName for a parent offered as "Parent of Asha Rao". */
function inboxRecipientKind(role) {
	var r = String(role || '').toLowerCase();
	return r === 'student' ? 'STUDENT' : r === 'parent' ? 'PARENT' : r === 'teacher' ? 'TEACHER' : r === 'school office' ? 'OFFICE' : 'ADMIN';
}

function announceInboxRecipients() {
	var recipients = INBOX_DRAFT.picked.map(function (p) {
		var child = /^Parent of (.+)$/.exec(p.context || '');
		return { kind: inboxRecipientKind(p.role), name: p.name, childName: child ? child[1] : '' };
	}).concat(INBOX_DRAFT.groups.map(function (g) {
		return { kind: g.who, name: g.label, childName: '' };
	}));
	document.dispatchEvent(new CustomEvent('inbox:compose-recipients', { detail: {
		writerKind: inboxWriterKind(),
		recipients: recipients,
		reply: !!INBOX_DRAFT.replyTo
	} }));
}

function resetInboxDraft(reply) {
	INBOX_DRAFT = newInboxDraft(reply);
	INBOX_TO = newInboxTo();
	$('#ibFilterPanel').prop('hidden', true);
	$('#ibFilterActive').prop('hidden', true);
	$('#ibToFilterOpen').attr('aria-expanded', 'false').prop('hidden', !INBOX_MAILBOX.filter || !!reply);
	document.getElementById('ibComposeForm').reset();
	$('#ibSubject').val(reply ? reply.subject : '').prop('readOnly', !!reply);
	$('#ibMessageCount').text('0 of 10,000 characters');
	$('#ibComposeTitle').text(reply ? 'Reply' : 'New message');
	$('#ibToPicker').prop('hidden', !!reply);
	$('#ibToRole').prop('hidden', !INBOX_MAILBOX.search);
	renderInboxChips();
	setupInboxToSelect();
	clearInboxComposeError();
}

function inboxDraftDirty() {
	return !!($.trim($('#ibMessage').val()) || document.getElementById('ibFiles').files.length
		|| (!INBOX_DRAFT.replyTo && ($.trim($('#ibSubject').val()) || INBOX_DRAFT.picked.length || INBOX_DRAFT.groups.length)));
}

function showInboxComposeError(text) {
	$('#ibComposeError').text(text).prop('hidden', false);
}

function clearInboxComposeError() {
	$('#ibComposeError').text('').prop('hidden', true);
}

/* The server checks the same; this only saves a round trip. */
function inboxFileProblem(files) {
	if (files.length > 3) {
		return 'You can attach at most 3 files to one message.';
	}
	for (var i = 0; i < files.length; i++) {
		var name = files[i].name;
		var dot = name.lastIndexOf('.');
		var ext = dot < 0 ? '' : name.substring(dot + 1).toLowerCase();
		if (INBOX_ATTACHMENT_EXTENSIONS.indexOf(ext) < 0) {
			return 'The file "' + name + '" cannot be attached. You can attach PDF, Word, Excel, PowerPoint, picture (JPG, PNG, GIF), text and CSV files.';
		}
		if (files[i].size > 5 * 1024 * 1024) {
			return 'The file "' + name + '" is larger than 5 MB. Please make it smaller, or share a link to it instead.';
		}
		if (files[i].size === 0) {
			return 'The file "' + name + '" is empty. Please choose it again.';
		}
	}
	return null;
}

/* ---------- the To field: a Select2 list of the people this person may write to ---------- */

function inboxContactOption(c) {
	var about = c.context && c.context !== c.role ? c.role + ' · ' + c.context : c.role;
	return { id: String(c.userId), text: c.name + (c.emailOnly ? ' (email only)' : ''), about: about || '', contact: c };
}

function inboxPickTemplate(item) {
	if (!item.id || !item.about) {
		return item.text;
	}
	return $('<span>').text(item.text).append($('<span class="ib-pick__context">').text(item.about));
}

function inboxIsPicked(id) {
	return INBOX_DRAFT.picked.some(function (p) { return String(p.userId) === String(id); });
}

/*
 * (Re)builds the To list. An admin's list is the whole school (or the filter's people), read from the server a
 * page at a time as it scrolls; everyone else's is their whole list, or a teacher's filtered part of it. Typing
 * narrows either. The people already chosen stay chosen.
 */
function setupInboxToSelect() {
	var $select = $('#ibToSelect');
	if (!$select.length || !$.fn.select2) {
		return;
	}
	if ($select.data('select2')) {
		$select.select2('destroy');
	}
	$select.off('.inboxTo').empty();
	INBOX_DRAFT.picked.forEach(function (p) {
		$select.append(new Option(inboxContactOption(p).text, String(p.userId), true, true));
	});
	var options = {
		theme: 'bootstrap4',
		width: '100%',
		closeOnSelect: false,
		// The composer is a modal <dialog> in the top layer: the list must open inside it to be seen and clicked.
		dropdownParent: $('#ibCompose'),
		placeholder: INBOX_MAILBOX.search ? 'Choose people, or type a name or email address' : 'Choose people, or type a name',
		templateResult: inboxPickTemplate,
		language: {
			noResults: function () { return 'Nobody found.'; },
			searching: function () { return 'Looking…'; },
			loadingMore: function () { return 'Loading more people…'; },
			errorLoading: function () { return INBOX_TO.error || 'The list could not be loaded just now. Please try again in a minute.'; }
		}
	};
	if (INBOX_MAILBOX.search) {
		options.ajax = {
			delay: 300,
			data: function (params) {
				return { term: params.term || '', page: params.page || 1 };
			},
			transport: function (params, success, failure) {
				var request = { search: params.data.term, role: INBOX_TO.filter ? '' : $('#ibToRole').val(), page: params.data.page - 1 };
				if (INBOX_TO.filter) {
					request.filter = INBOX_TO.filter;
				}
				return ibQuietPost('compose/contacts', request, function (response) {
					if (!response || response.status !== '1' || !response.data) {
						INBOX_TO.error = response && response.message;
						failure();
						return;
					}
					success(response.data);
				});
			},
			processResults: function (data) {
				return { results: (data.contacts || []).map(inboxContactOption), pagination: { more: !!data.more } };
			}
		};
	} else {
		options.data = (INBOX_TO.filter ? INBOX_TO.shown : INBOX_MAILBOX.contacts).filter(function (c) {
			return !inboxIsPicked(c.userId);
		}).map(inboxContactOption);
		options.matcher = function (params, item) {
			var q = $.trim(params.term || '').toLowerCase();
			return !q || (item.text + ' ' + (item.about || '')).toLowerCase().indexOf(q) >= 0 ? item : null;
		};
	}
	$select.select2(options);
	$select.data('select2').$container.find('.select2-search__field').attr({ 'aria-label': 'To', 'aria-describedby': 'ibToHint' });
	$select.on('select2:selecting.inboxTo', function (e) {
		if (inboxRecipientCount() >= INBOX_MAILBOX.max) {
			e.preventDefault();
			showInboxComposeError('You can write to at most ' + INBOX_MAILBOX.max + ' people in one message.');
		}
	});
	$select.on('select2:select.inboxTo', function (e) {
		var contact = e.params.data.contact;
		if (contact && !inboxIsPicked(contact.userId)) {
			INBOX_DRAFT.picked.push(contact);
			clearInboxComposeError();
			announceInboxRecipients();
			$('#ibToStatus').text(contact.name + ' added.');
		}
	});
	$select.on('select2:unselect.inboxTo', function (e) {
		var id = String(e.params.data.id);
		var removed = INBOX_DRAFT.picked.filter(function (p) { return String(p.userId) === id; })[0];
		INBOX_DRAFT.picked = INBOX_DRAFT.picked.filter(function (p) { return String(p.userId) !== id; });
		announceInboxRecipients();
		if (removed) {
			$('#ibToStatus').text(removed.name + ' removed.');
		}
	});
}

function focusInboxTo() {
	var select2 = $('#ibToSelect').data('select2');
	if (select2) {
		select2.$container.find('.select2-search__field').trigger('focus');
	}
}

function renderInboxChips() {
	// A new message shows the people chosen inside the To list itself; a reply has no list, so its one person is shown here.
	var people = !INBOX_DRAFT.replyTo ? [] : INBOX_DRAFT.picked.map(function (p) {
		var note = (p.context ? ' (' + p.context + ')' : '') + (p.emailOnly ? ' (email only: no school account)' : '');
		return '<li class="ib-person' + (p.emailOnly ? ' ib-person--email' : '') + '"><span class="ib-person__name">' + ibEscape(p.name)
			+ (note ? '<span class="sr-only">' + ibEscape(note) + '</span>' : '')
			+ (p.emailOnly ? '<span class="ib-hint" aria-hidden="true"> (email only)</span>' : '') + '</span>'
			+ (INBOX_DRAFT.replyTo ? '' : '<button type="button" class="ib-person__remove" data-id="' + ibEscape(p.userId)
				+ '" aria-label="Remove ' + ibEscape(p.name) + '"><span aria-hidden="true">&times;</span></button>')
			+ '</li>';
	});
	var groups = INBOX_DRAFT.groups.map(function (g, i) {
		return '<li class="ib-person ib-person--group"><span class="ib-person__name">' + ibEscape(g.label) + '</span>'
			+ '<button type="button" class="ib-person__remove" data-group="' + i + '" aria-label="Remove ' + ibEscape(g.label)
			+ '"><span aria-hidden="true">&times;</span></button></li>';
	});
	$('#ibToChips').html(groups.concat(people).join('')).prop('hidden', people.length + groups.length === 0);
	announceInboxRecipients();
}

/* ---------- an admin's group filter ---------- */

function bindInboxFilter() {
	$('#ibToFilterOpen').on('click', function () {
		var open = $('#ibFilterPanel').prop('hidden');
		$('#ibFilterPanel').prop('hidden', !open);
		$(this).attr('aria-expanded', open ? 'true' : 'false');
		if (open) {
			loadInboxFilterOptions();
			$('#ibFilterWho').trigger('focus');
		}
	});
	$('#ibFilterClose').on('click', function () {
		$('#ibFilterPanel').prop('hidden', true);
		$('#ibToFilterOpen').attr('aria-expanded', 'false').trigger('focus');
	});
	$('#ibFilterWho').on('change', syncInboxFilterFields);
	$('#ibFilterShow').on('click', showInboxFiltered);
	$('#ibFilterAdd').on('click', addInboxGroup);
	$('#ibFilterAddAll').on('click', addAllInboxShown);
	$('#ibFilterClear').on('click', clearInboxFilter);
}

/* The filter as the server reads it: who, and for students and parents their current enrolment. */
function readInboxFilter() {
	var who = $('#ibFilterWho').val();
	var enrolment = who === 'STUDENT' || who === 'PARENT';
	return {
		who: who,
		grade: enrolment ? $('#ibFilterGrade').val() : '',
		learningProgram: enrolment ? $('#ibFilterProgram').val() : '',
		sessionId: enrolment && $('#ibFilterSession').val() ? parseInt($('#ibFilterSession').val(), 10) : null,
		batchId: enrolment && $('#ibFilterBatch').val() ? parseInt($('#ibFilterBatch').val(), 10) : null
	};
}

/* "Grade 4 · One to one · Students", from the filter's own lists. */
function inboxFilterText() {
	var parts = ['#ibFilterGrade', '#ibFilterProgram', '#ibFilterSession', '#ibFilterBatch'].filter(function (id) {
		return !$(id).prop('disabled') && $(id).val();
	}).map(function (id) {
		return $(id).find('option:selected').text();
	});
	parts.push($('#ibFilterWho').find('option:selected').text());
	return parts.join(' \u00b7 ');
}

/* "Show in the list": the To list shows only the filter's people, to pick some of them. */
function showInboxFiltered() {
	showInboxFilterError('');
	var audience = readInboxFilter();
	var button = document.getElementById('ibFilterShow');
	button.disabled = true;
	// An admin's list is read page by page, so only its size is asked for now; a teacher's is read whole.
	var admin = INBOX_MAILBOX.search;
	ibQuietPost(admin ? 'compose/audience' : 'compose/contacts', admin ? audience : { filter: audience }, function (response) {
		button.disabled = false;
		if (!response || response.status !== '1' || !response.data) {
			showInboxFilterError((response && response.message) || 'This filter could not be used just now. Please try again in a minute.');
			return;
		}
		var count = admin ? response.data.count : (response.data.contacts || []).length;
		if (!count) {
			showInboxFilterError('Nobody matches this filter. Change the filter and try again.');
			return;
		}
		INBOX_TO.filter = audience;
		INBOX_TO.shown = admin ? [] : response.data.contacts;
		INBOX_TO.filterLabel = admin ? response.data.label : inboxFilterText() + ' (' + count + ')';
		$('#ibFilterActiveText').text('Showing only: ' + INBOX_TO.filterLabel);
		$('#ibFilterActive').prop('hidden', false);
		$('#ibToRole').prop('hidden', true);
		$('#ibFilterPanel').prop('hidden', true);
		$('#ibToFilterOpen').attr('aria-expanded', 'false');
		setupInboxToSelect();
		$('#ibToSelect').select2('open');
		$('#ibToStatus').text('The list now shows only ' + INBOX_TO.filterLabel + '.');
	});
}

function clearInboxFilter() {
	INBOX_TO = newInboxTo();
	$('#ibFilterActive').prop('hidden', true);
	$('#ibToRole').prop('hidden', !INBOX_MAILBOX.search);
	setupInboxToSelect();
	$('#ibToStatus').text('Filter cleared. The list shows everyone you can write to.');
	focusInboxTo();
}

/* A teacher's "Add everyone shown": the filter's people, each added by name (only an admin adds a whole group). */
function addAllInboxShown() {
	showInboxFilterError('');
	var audience = readInboxFilter();
	var button = document.getElementById('ibFilterAddAll');
	button.disabled = true;
	ibQuietPost('compose/contacts', { filter: audience }, function (response) {
		button.disabled = false;
		if (!response || response.status !== '1' || !response.data) {
			showInboxFilterError((response && response.message) || 'This filter could not be used just now. Please try again in a minute.');
			return;
		}
		var adding = (response.data.contacts || []).filter(function (c) { return !inboxIsPicked(c.userId); });
		if (!adding.length) {
			showInboxFilterError((response.data.contacts || []).length ? 'Everyone this filter shows is already in To.'
				: 'Nobody matches this filter. Change the filter and try again.');
			return;
		}
		var total = inboxRecipientCount() + adding.length;
		if (total > INBOX_MAILBOX.max) {
			showInboxFilterError('That would make ' + total + ' people, and one message may go to at most ' + INBOX_MAILBOX.max
				+ '. Narrow the filter, or use "Show in the list" and pick people.');
			return;
		}
		INBOX_DRAFT.picked = INBOX_DRAFT.picked.concat(adding);
		setupInboxToSelect();
		announceInboxRecipients();
		$('#ibFilterPanel').prop('hidden', true);
		$('#ibToFilterOpen').attr('aria-expanded', 'false');
		$('#ibToStatus').text(adding.length + (adding.length === 1 ? ' person added.' : ' people added.'));
	});
}

/* Grade, program, session and batch narrow down students and parents only. */
function syncInboxFilterFields() {
	var enrolment = $('#ibFilterWho').val() === 'STUDENT' || $('#ibFilterWho').val() === 'PARENT';
	$('.ib-filter-enrol').prop('hidden', !enrolment).find('select').prop('disabled', !enrolment);
}

function loadInboxFilterOptions() {
	syncInboxFilterFields();
	if (INBOX_FILTER.loaded) {
		return;
	}
	ibQuietPost('compose/audience-options', {}, function (response) {
		if (!response || response.status !== '1' || !response.data) {
			showInboxFilterError((response && response.message) || 'The filter lists could not be loaded just now. Please close the filter and open it again.');
			return;
		}
		var fill = function (id, label, list) {
			$('#' + id).html('<option value="">' + ibEscape(label) + '</option>' + (list || []).map(function (c) {
				return '<option value="' + ibEscape(c.value) + '">' + ibEscape(c.label) + '</option>';
			}).join(''));
		};
		fill('ibFilterGrade', 'Any grade', response.data.grades);
		fill('ibFilterProgram', 'Any learning program', response.data.programs);
		fill('ibFilterSession', 'Any session', response.data.sessions);
		fill('ibFilterBatch', 'Any batch', response.data.batches);
		INBOX_FILTER.loaded = true;
	});
}

function showInboxFilterError(text) {
	$('#ibFilterError').text(text).prop('hidden', !text);
}

function addInboxGroup() {
	showInboxFilterError('');
	var audience = readInboxFilter();
	var button = document.getElementById('ibFilterAdd');
	button.disabled = true;
	ibQuietPost('compose/audience', audience, function (response) {
		button.disabled = false;
		if (!response || response.status !== '1' || !response.data) {
			showInboxFilterError((response && response.message) || 'This group could not be worked out just now. Please try again in a minute.');
			return;
		}
		var group = response.data;
		if (group.count === 0) {
			showInboxFilterError('Nobody matches this filter, so there is no one to write to. Change the filter and try again.');
			return;
		}
		if (group.tooMany) {
			showInboxFilterError('This group has ' + group.count.toLocaleString() + ' people, more than the ' + group.max.toLocaleString()
				+ ' one message may go to. Narrow it down, for example by grade or batch.');
			return;
		}
		var total = inboxRecipientCount() + group.count;
		if (total > INBOX_MAILBOX.max) {
			showInboxFilterError('Adding this group would make ' + total.toLocaleString() + ' people; one message may go to at most '
				+ INBOX_MAILBOX.max.toLocaleString() + '.');
			return;
		}
		// Only the filter is kept: the server works the group out again when the message is sent.
		audience.label = group.label;
		audience.count = group.count;
		INBOX_DRAFT.groups.push(audience);
		renderInboxChips();
		$('#ibToStatus').text(group.label + ' added.');
	});
}

function removeInboxGroup(index) {
	var removed = INBOX_DRAFT.groups.splice(index, 1)[0];
	renderInboxChips();
	$('#ibToFilterOpen').trigger('focus');
	if (removed) {
		$('#ibToStatus').text(removed.label + ' removed.');
	}
}

/* ---------- sending ---------- */

/* Checks the form, then shows the check-before-send dialog; "Send" there calls postInboxMessage. */
function sendInboxMessage() {
	var button = document.getElementById('ibComposeSend');
	if (button.disabled) {
		return;
	}
	var subject = $.trim($('#ibSubject').val());
	var message = $('#ibMessage').val();
	var files = document.getElementById('ibFiles').files;
	var problem = !INBOX_DRAFT.picked.length && !INBOX_DRAFT.groups.length ? ['Please choose at least one person to write to.', '#ibToSelect']
		: !subject ? ['Please add a subject.', '#ibSubject']
			: !$.trim(message) ? ['Please write your message.', '#ibMessage']
				: inboxFileProblem(files) ? [inboxFileProblem(files), '#ibFiles'] : null;
	if (problem) {
		showInboxComposeError(problem[0]);
		if (problem[1] === '#ibToSelect') {
			focusInboxTo();
		} else {
			$(problem[1]).trigger('focus');
		}
		return;
	}
	clearInboxComposeError();
	fillInboxCheck(subject, message, files);
	document.getElementById('ibCheckSend').showModal();
}

var INBOX_CHECK_LISTED = 20;

/* "AR" for "Asha Rao"; "?" when there is no name. */
function inboxInitials(name) {
	var words = String(name || '').trim().split(/\s+/).filter(Boolean);
	var letters = words.length > 1 ? words[0].charAt(0) + words[words.length - 1].charAt(0) : (words[0] || '?').charAt(0);
	return letters.toUpperCase();
}

var INBOX_CHECK_PREVIEW = 320;

function fillInboxCheck(subject, message, files) {
	var picked = INBOX_DRAFT.picked;
	var chip = function (name, extra, group) {
		return '<li class="ib-check__chip' + (group ? ' ib-check__chip--group' : '') + '"><span class="ib-check__avatar" aria-hidden="true">'
			+ (group ? '<i class="fa fa-users"></i>' : ibEscape(inboxInitials(name))) + '</span>' + ibEscape(name)
			+ (extra ? ' <span class="ib-hint">' + ibEscape(extra) + '</span>' : '') + '</li>';
	};
	var groups = INBOX_DRAFT.groups.map(function (g) { return chip(g.label, '', true); }).join('');
	var listed = picked.slice(0, INBOX_CHECK_LISTED).map(function (p) { return chip(p.name, p.emailOnly ? '(email only)' : '', false); }).join('');
	var more = picked.length > INBOX_CHECK_LISTED ? '<li class="ib-check__chip">+ ' + (picked.length - INBOX_CHECK_LISTED) + ' more</li>' : '';
	var people = inboxRecipientCount();
	var emailOnly = picked.filter(function (p) { return p.emailOnly; }).length;
	var warnings = [];
	if (/\b(attach|attached|attaching|attachment|attachments|file|files)\b/i.test(message) && !files.length) {
		warnings.push('No attachment found: your message mentions an attachment or a file, but nothing is attached.');
	}
	if (/<[^<>]{1,40}>|\[[^\[\]]{1,40}\]/.test(subject + ' ' + message)) {
		warnings.push('Something is still to fill in: the subject or message has a word in <angle> or [square] brackets from the template.');
	}
	if (emailOnly) {
		warnings.push(emailOnly + (emailOnly === 1 ? ' parent will' : ' parents will')
			+ ' receive this by email only (they do not have a school account).');
	}
	if (INBOX_MAILBOX.backgroundFrom && people >= INBOX_MAILBOX.backgroundFrom) {
		warnings.push('This message will go to ' + people.toLocaleString() + ' people. It will be sent in the background; follow it in Sent.');
	}
	var text = $.trim(message);
	var preview = text.length > INBOX_CHECK_PREVIEW ? text.substring(0, INBOX_CHECK_PREVIEW).replace(/\s+\S*$/, '') + '…' : text;
	var fileList = Array.prototype.map.call(files, function (f) {
		return '<li><i class="fa fa-file-o" aria-hidden="true"></i> ' + ibEscape(f.name) + ' <span class="ib-hint">('
			+ Math.max(1, Math.round(f.size / 1024)).toLocaleString() + ' KB)</span></li>';
	}).join('');
	var row = function (icon, key, value) {
		return '<div class="ib-check__row"><div class="ib-check__key"><i class="fa ' + icon + '" aria-hidden="true"></i> ' + key + '</div>'
			+ '<div class="ib-check__value">' + value + '</div></div>';
	};
	$('#ibCheckBody').html(
		row('fa-user-o', 'To', '<p class="sr-only">' + people.toLocaleString() + (people === 1 ? ' person' : ' people') + '</p>'
			+ '<ul class="ib-check__chips">' + groups + listed + more + '</ul>'
			+ '<p class="ib-hint">' + people.toLocaleString() + (people === 1 ? ' person' : ' people') + ' will get this.</p>')
		+ row('fa-tag', 'Subject', '<span class="ib-check__subject">' + ibEscape(subject) + '</span>')
		+ row('fa-align-left', 'Message', '<p class="ib-check__preview">' + ibEscape(preview) + '</p>')
		+ row('fa-paperclip', 'Files', files.length ? '<ul class="ib-check__files">' + fileList + '</ul>' : '<span class="ib-hint">No attachments</span>')
		+ warnings.map(function (w) {
			return '<p class="ib-check__warn" role="note"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i><span>' + ibEscape(w) + '</span></p>';
		}).join(''));
}

function postInboxMessage() {
	var button = document.getElementById('ibComposeSend');
	if (button.disabled) {
		return;
	}
	var subject = $.trim($('#ibSubject').val());
	var message = $('#ibMessage').val();
	var files = document.getElementById('ibFiles').files;
	var request = {
		to: INBOX_DRAFT.picked.map(function (p) { return p.userId; }),
		audiences: INBOX_DRAFT.groups.map(function (g) {
			return { who: g.who, grade: g.grade, learningProgram: g.learningProgram, sessionId: g.sessionId, batchId: g.batchId };
		}),
		subject: subject,
		message: message,
		inReplyToId: INBOX_DRAFT.replyTo ? INBOX_DRAFT.replyTo.inReplyToId : null
	};
	// Multipart: the request is encoded like every JSON request (the server decodes "payload"); files beside it.
	var form = new FormData();
	form.append('payload', encode(JSON.stringify(request)));
	for (var i = 0; i < files.length; i++) {
		form.append('files', files[i], files[i].name);
	}
	var label = button.innerHTML;
	button.disabled = true;
	button.textContent = 'Sending…';
	var done = function () {
		button.disabled = false;
		button.innerHTML = label;
	};
	$.ajax({
		url: getURLForHTML('dashboard', 'inbox/compose/send'),
		type: 'POST',
		data: form,
		processData: false,
		contentType: false,
		dataType: 'json',
		success: function (response) {
			done();
			if (!response || response.status !== '1' || !response.data) {
				showInboxComposeError((response && response.message)
					|| 'Your message could not be sent just now. Please try again in a minute; what you wrote is still here.');
				return;
			}
			resetInboxDraft(null);
			document.getElementById('ibCompose').close();
			showMessageTheme2(response.data.sent ? 1 : 0, response.data.message);
			if (INBOX_STATE.channel === 'SENT') {
				loadInbox(1);
			}
		},
		error: function () {
			done();
			showInboxComposeError('Your message could not be sent: the server could not be reached. Check your connection and try again; '
				+ 'what you wrote is still here.');
		}
	});
}

function replyInboxMessage(button) {
	button.disabled = true;
	ibQuietPost('compose/reply', { id: parseInt(button.getAttribute('data-id'), 10) }, function (response) {
		button.disabled = false;
		if (!response || response.status !== '1' || !response.data) {
			showMessageTheme2(0, (response && response.message) || 'This message cannot be answered just now. Please try again in a minute.');
			return;
		}
		openInboxCompose(response.data);
	});
}

/* ---------- the Sent folder and the reader's message lines ---------- */

function loadInboxSent(page) {
	var request = { from: $('#ibFrom').val(), to: $('#ibTo').val(), search: $.trim($('#ibSearch').val()), page: page, pageSize: INBOX_STATE.pageSize };
	var requestNo = ++INBOX_STATE.request;
	$('#ibSummary').text('Loading…');
	inboxPost('sent', request, function (data) {
		if (requestNo !== INBOX_STATE.request) {
			return;
		}
		if (!data) {
			$('#ibSummary').text('');
			return;
		}
		INBOX_STATE.page = data.page;
		INBOX_STATE.total = data.total;
		INBOX_STATE.sent = {};
		(data.items || []).forEach(function (item) {
			INBOX_STATE.sent[item.id] = item;
		});
		$('#ibList').html((data.items || []).map(inboxSentItemHtml).join(''));
		$('#ibSummary').text(data.total === 0 ? 'You have not sent any messages in these dates.'
			: data.total.toLocaleString() + (data.total === 1 ? ' message' : ' messages'));
		setInboxPager(data);
	});
}

function inboxSentItemHtml(item) {
	var people = item.recipients || [];
	var names = people.map(function (r) { return r.name; });
	var count = Math.max(item.recipientCount || 0, names.length);
	var to = names.slice(0, 3).join(', ') + (count > 3 ? ' and ' + (count - 3) + ' more' : '');
	var notSent = people.filter(function (r) { return r.state === 'NOT_SENT'; }).map(function (r) { return r.name; });
	var notSentCount = Math.max(item.notSentCount || 0, notSent.length);
	var progress = item.progress;
	return '<li class="ib-item">'
		+ '<span class="ib-icon"><i class="fa fa-paper-plane" aria-hidden="true"></i><span class="sr-only">Sent message</span></span>'
		+ '<button type="button" class="ib-item__open" data-channel="EMAIL" data-id="' + ibEscape(item.id) + '" data-child="">'
		+ '<span class="ib-item__title">' + ibEscape(item.subject || '(no subject)') + '</span>'
		+ '<span class="ib-item__meta">To: ' + ibEscape(to || 'nobody') + '</span>'
		+ (progress ? '<span class="ib-item__meta">Sending in the background: ' + progress.done.toLocaleString() + ' of '
			+ progress.total.toLocaleString() + ' people <progress class="ib-progress" max="' + ibEscape(progress.total) + '" value="'
			+ ibEscape(progress.done) + '" aria-label="Sending progress"></progress></span>'
			: item.state === 'SENDING' ? '<span class="ib-item__meta">Sending…</span>' : '')
		+ (notSentCount ? '<span class="ib-item__meta ib-warn"><i class="fa fa-exclamation-circle" aria-hidden="true"></i> Not sent by email to '
			+ (notSentCount > 5 ? notSentCount.toLocaleString() + ' people' : ibEscape(notSent.join(', '))) + ' (it is still in their Inbox)</span>' : '')
		+ '</button>'
		+ '<span class="ib-item__side"><span>' + ibEscape(ibTime(item.at)) + '</span>'
		+ (item.attachments ? '<i class="fa fa-paperclip" aria-label="Has attachments"></i>' : '') + '</span>'
		+ '</li>';
}

/* For a message: who it went to (opened from Sent), which message it answers, and Reply. */
function inboxMessageExtrasHtml(email) {
	var html = '';
	var sent = INBOX_STATE.channel === 'SENT' ? (INBOX_STATE.sent || {})[email.id] : null;
	if (sent && (sent.recipients || []).length) {
		html += '<p class="mb-2">To: ' + sent.recipients.map(function (r) {
			return ibEscape(r.name) + (r.state === 'SENT' ? '' : ' <span class="ib-sent-state' + (r.state === 'NOT_SENT' ? ' ib-sent-state--no' : '')
				+ '">(' + ibEscape(INBOX_SENT_LABELS[r.state] || r.state) + ')</span>');
		}).join(', ') + (sent.recipientCount > sent.recipients.length ? ' and ' + (sent.recipientCount - sent.recipients.length).toLocaleString()
			+ ' more' : '') + '</p>';
	}
	if (email.inReplyTo) {
		html += '<p class="mb-2 ib-hint">In reply to ' + (email.inReplyTo.visible
			? '<button type="button" class="btn btn-link p-0 align-baseline ib-inreply" data-id="' + ibEscape(email.inReplyTo.id) + '">'
				+ ibEscape(email.inReplyTo.subject || '(no subject)') + '</button>'
			: 'an earlier message') + '</p>';
	}
	if (email.canReply && INBOX_MAILBOX.enabled) {
		html += '<p class="mb-2 ib-no-print"><button type="button" class="btn btn-sm btn-primary" id="ibReply" data-id="' + ibEscape(email.id)
			+ '"><i class="fa fa-reply" aria-hidden="true"></i>&nbsp;Reply</button></p>';
	}
	return html;
}
