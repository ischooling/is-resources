/*
 * Contact problems (admin, Communications): behaviour. Markup and styles are in contactProblemsContent.js.
 * Server: {schoolUuid}/dashboard/contact-check/admin/* (list, ask, remind). The server decides who may
 * open the page and what they may do; refusals are shown as the server words them.
 * Every value from the server is escaped before it reaches the page.
 */

var CP_STATE = { page: 1, total: 0, request: 0, busy: false };
var CP_ROLE_LABELS = { STUDENT: 'Student', PARENT: 'Parent', TEACHER: 'Teacher' };

function initContactProblems() {
	CP_STATE = { page: 1, total: 0, request: 0, busy: false };
	$('#dashboardContentInHTML').html(getContactProblemsContent('Contact problems'));
	ensureContactProblemsStyles();
	$('#cpForm').on('submit', function (e) {
		e.preventDefault();
		loadContactProblems(1);
	});
	$('#cpChannel, #cpStatus').on('change', function () {
		loadContactProblems(1);
	});
	// A count chip shows only that channel; pressing it again shows every channel.
	$('.cp-chip').on('click', function () {
		var code = this.getAttribute('data-cp-channel');
		$('#cpChannel').val($('#cpChannel').val() === code ? '' : code);
		loadContactProblems(1);
	});
	$('#cpPrev').on('click', function () { loadContactProblems(CP_STATE.page - 1); });
	$('#cpNext').on('click', function () { loadContactProblems(CP_STATE.page + 1); });
	$('#cpRows').on('click', '[data-cp-action]', function () {
		contactProblemAction(this);
	});
	loadContactProblems(1);
}

function cpEscape(value) {
	if (value === null || value === undefined) {
		return '';
	}
	return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function cpBadge(label, kind) {
	return '<span class="cp-badge cp-badge--' + kind + '">' + cpEscape(label) + '</span>';
}

/* A date in the admin's own time zone (USER_TIMEZONE); Asia/Singapore when that is missing or not valid. */
function cpDate(value) {
	if (value === null || value === undefined || value === '') {
		return '';
	}
	var date;
	if (typeof value === 'number' || /^\d+$/.test(String(value))) {
		date = new Date(Number(value));
	} else if (/^\d{4}-\d{2}-\d{2}[T ]/.test(String(value))) {
		date = new Date(String(value).replace(' ', 'T'));
	} else {
		return String(value);
	}
	if (isNaN(date.getTime())) {
		return String(value);
	}
	var options = { day: '2-digit', month: 'short', year: 'numeric' };
	var zone = (typeof USER_TIMEZONE !== 'undefined' && USER_TIMEZONE && String(USER_TIMEZONE).trim()) || 'Asia/Singapore';
	try {
		options.timeZone = zone;
		return new Intl.DateTimeFormat(undefined, options).format(date);
	} catch (e) {
		options.timeZone = 'Asia/Singapore';
		return new Intl.DateTimeFormat(undefined, options).format(date);
	}
}

/* onDone(data): null when the call did not succeed (the reason has already been shown).
   okMessage: what to say after a successful action when the server sends no message of its own. */
function cpPost(path, request, onDone, okMessage) {
	$.ajax({
		contentType: APPLICATION_JSON_VALUE,
		type: 'POST',
		url: getURLForHTML('dashboard', 'contact-check/admin/' + path),
		data: JSON.stringify(request),
		dataType: 'json',
		success: function (response) {
			if (!response || response.status !== '1') {
				showMessageTheme2(0, (response && response.message) || 'The contact problems could not be loaded just now. Please try again in a minute.');
				onDone(null);
				return;
			}
			if (response.message || okMessage) {
				showMessageTheme2(1, response.message || okMessage);
			}
			onDone(response.data || {});
		},
		error: function () {
			showMessageTheme2(0, 'The contact problems could not be reached. Check your connection and try again.');
			onDone(null);
		}
	});
}

function loadContactProblems(page) {
	if (page < 1) {
		return;
	}
	var request = {
		channel: $('#cpChannel').val() || '',
		status: $('#cpStatus').val() || '',
		search: $.trim($('#cpSearch').val()),
		// The page numbers on screen start at 1; the server counts pages from 0.
		page: page - 1
	};
	var requestNo = ++CP_STATE.request;
	$('.cp-chip').each(function () {
		this.setAttribute('aria-pressed', this.getAttribute('data-cp-channel') === request.channel ? 'true' : 'false');
	});
	$('#cpSummary').text('Loading…');
	$('#cpPrev, #cpNext').prop('disabled', true);
	cpPost('list', request, function (data) {
		if (requestNo !== CP_STATE.request) {
			return;
		}
		if (!data) {
			$('#cpSummary').text('');
			$('#cpPrev').prop('disabled', CP_STATE.page <= 1);
			return;
		}
		var rows = $.isArray(data.rows) ? data.rows : [];
		var total = parseInt(data.total, 10) || 0;
		var counts = data.counts || {};
		CP_STATE.page = page;
		CP_STATE.total = total;
		Object.keys(CP_CHANNELS).forEach(function (code) {
			$('#cpCount' + code).text((parseInt(counts[code], 10) || 0).toLocaleString());
		});
		$('#cpRows').html(rows.map(contactProblemRowHtml).join(''));
		$('#cpSummary').text(total === 0 ? 'No contact problems match these filters.'
			: total.toLocaleString() + (total === 1 ? ' contact problem.' : ' contact problems.'));
		$('#cpPage').text(total === 0 ? '' : 'Page ' + page);
		$('#cpPrev').prop('disabled', page <= 1);
		$('#cpNext').prop('disabled', !data.more);
	});
}

/* A code the page has no wording for, as words: "SOME_NEW_CODE" -> "Some new code". */
function cpSentence(code) {
	var words = String(code || '').replace(/_+/g, ' ').trim().toLowerCase();
	return words ? words.charAt(0).toUpperCase() + words.slice(1) : '';
}

/* The problem in a few words (CP_PROBLEM_LABELS); a code without wording is shown as plain words. */
function cpProblemLabel(problem) {
	if (!problem) {
		return 'Problem';
	}
	return Object.prototype.hasOwnProperty.call(CP_PROBLEM_LABELS, problem) ? CP_PROBLEM_LABELS[problem] : cpSentence(problem);
}

/*
 * The request column and the row's button, from the exact status the server sends:
 * no request / NOT_ASKED, PENDING, CHANGED, CONFIRMED, ALTERNATE_ADDED, NO_WHATSAPP, DISMISSED.
 * An answered row has no "Ask to update"; a confirmed or dismissed one can be asked again.
 */
function contactProblemRowHtml(r) {
	var channel = CP_CHANNELS[r.channel] || ['fa-address-card-o', r.channel || ''];
	var status = String(r.status || 'NOT_ASKED').toUpperCase();
	var isApp = r.channel === 'APP';
	var hasReview = r.id !== null && r.id !== undefined;
	var name = cpEscape(r.accountName || 'Unknown account');
	var role = r.role ? ' ' + cpBadge(CP_ROLE_LABELS[r.role] || r.role, 'role') : '';
	var who = '<span class="sr-only"> ' + name + '</span></button>';
	var resolved = r.resolvedAt ? '<div class="cp-muted">' + cpEscape(cpDate(r.resolvedAt)) + '</div>' : '';
	var askAgain = hasReview
		? '<button type="button" class="btn btn-outline-primary btn-sm cp-nowrap" data-cp-action="ask" data-cp-review="' + cpEscape(r.id) + '">Ask again' + who
		: '';
	var request;
	var action = '';
	if (status === 'NOT_ASKED') {
		request = cpBadge('Not asked', 'info');
		if (isApp) {
			// The server does not take a request about the app: nothing to press here.
			action = '<span class="cp-muted cp-nowrap">No app installed</span>';
		} else if (hasReview || r.userId) {
			action = '<button type="button" class="btn btn-primary btn-sm cp-nowrap" data-cp-action="ask"'
				+ (hasReview ? ' data-cp-review="' + cpEscape(r.id) + '"' : '')
				+ ' data-cp-user="' + cpEscape(r.userId) + '" data-cp-channel="' + cpEscape(r.channel) + '">Ask to update' + who;
		}
	} else if (status === 'PENDING') {
		var later = parseInt(r.laterCount, 10) || 0;
		request = cpBadge('Waiting for user', 'warn')
			+ '<div class="cp-muted">' + (r.lastAskedAt ? 'Asked ' + cpEscape(cpDate(r.lastAskedAt)) : 'Asked')
			+ (later > 0 ? ' &middot; Later &times;' + later : '') + '</div>';
		if (hasReview) {
			action = '<button type="button" class="btn btn-outline-primary btn-sm cp-nowrap" data-cp-action="remind" data-cp-review="' + cpEscape(r.id) + '">'
				+ 'Remind again' + who;
		}
	} else if (status === 'CHANGED') {
		request = cpBadge('Updated', 'ok')
			+ (r.newValue ? '<div class="cp-addr">&rarr; ' + cpEscape(r.newValue) + '</div>' : '') + resolved;
	} else if (status === 'CONFIRMED') {
		request = cpBadge('Confirmed correct', 'ok') + resolved;
		action = askAgain;
	} else if (status === 'ALTERNATE_ADDED') {
		request = cpBadge('Second email added', 'ok')
			+ (r.newValue ? '<div class="cp-addr">+ ' + cpEscape(r.newValue) + '</div>' : '') + resolved;
	} else if (status === 'NO_WHATSAPP') {
		request = cpBadge('Doesn\'t use WhatsApp', 'none') + resolved;
	} else if (status === 'DISMISSED') {
		request = cpBadge('Dismissed', 'none') + resolved;
		action = askAgain;
	} else {
		// A status this page does not know: shown as it is, with nothing to press.
		request = cpBadge(cpSentence(status), 'none') + resolved;
	}
	return '<tr>'
		+ '<td data-label="Channel" class="cp-nowrap"><i class="fa ' + channel[0] + '" aria-hidden="true"></i> ' + cpEscape(channel[1]) + '</td>'
		+ '<td data-label="Contact" class="cp-addr">' + (r.value ? cpEscape(r.value) : '<span class="cp-muted">&mdash;</span>') + '</td>'
		+ '<td data-label="Account">' + name + role + '</td>'
		+ '<td data-label="Problem">' + cpBadge(cpProblemLabel(r.problem), 'bad')
		+ (r.reason ? '<div class="cp-muted cp-addr">' + cpEscape(r.reason) + '</div>' : '') + '</td>'
		+ '<td data-label="Request">' + request + '</td>'
		+ '<td class="text-right">' + action + '</td>'
		+ '</tr>';
}

/* "Ask to update" / "Ask again" / "Remind again": one call at a time, then the page is read again. */
function contactProblemAction(button) {
	if (CP_STATE.busy) {
		return;
	}
	var remind = button.getAttribute('data-cp-action') === 'remind';
	var reviewId = button.getAttribute('data-cp-review');
	var request;
	if (remind || reviewId) {
		request = { reviewId: /^\d+$/.test(reviewId) ? Number(reviewId) : reviewId };
	} else {
		var userId = button.getAttribute('data-cp-user');
		request = { userId: /^\d+$/.test(userId) ? Number(userId) : userId, channel: button.getAttribute('data-cp-channel') };
	}
	CP_STATE.busy = true;
	$('#cpRows [data-cp-action]').prop('disabled', true);
	cpPost(remind ? 'remind' : 'ask', request, function (data) {
		CP_STATE.busy = false;
		if (!data) {
			$('#cpRows [data-cp-action]').prop('disabled', false);
			return;
		}
		loadContactProblems(CP_STATE.page);
	}, remind ? 'Reminder sent. They will see the popup on their dashboard.' : 'Request sent. They will be asked on their dashboard.');
}
