/*
 * Inbox > Write a message: message templates and AI writing help. Loaded with inbox.js; it only reacts
 * to two events inbox.js sends on document, and fills the two containers inboxContent.js provides:
 *   inbox:compose-open        detail { writerKind, writerName, recipientCount }
 *   inbox:compose-recipients  detail { writerKind, recipients: [{ kind, name, childName }], reply }
 *   #ibComposeAssist (template picker, above Subject) and #ibAiToolbar (AI buttons, under the message).
 * It writes into #ibSubject and #ibMessage and fires 'input' on them, so the page's own counters and
 * "unsaved" checks see the change. Server: {schoolId}/dashboard/inbox/compose/{assist|templates|ai-help}
 * (MailboxAssistController). The AI never sends anything: its answer is a preview the writer accepts or
 * dismisses. Every value from the server reaches the page as text, never as HTML.
 */

var IBX = { bound: false, writerName: '', options: null, optionsRequest: null, templates: {}, kind: null, busy: false, token: 0 };
var IBX_AI_ACTIONS = [
	['FIX_GRAMMAR', 'Fix spelling and grammar'], ['POLITE', 'Make it polite'], ['SHORTER', 'Make it shorter'],
	['CLEARER', 'Make it clearer'], ['TRANSLATE', 'Translate to English'], ['HELP_WRITE', 'Help me write']
];
var IBX_WORKING = {
	FIX_GRAMMAR: 'Checking your spelling and grammar', POLITE: 'Making your message more polite', SHORTER: 'Shortening your message',
	CLEARER: 'Making your message clearer', TRANSLATE: 'Translating your message', HELP_WRITE: 'Writing your message'
};

function ibxEscape(value) {
	return String(value === null || value === undefined ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* One request; resolves with the response's data, or rejects with a sentence for the writer. */
function ibxPost(path, request) {
	return new Promise(function (resolve, reject) {
		$.ajax({
			contentType: APPLICATION_JSON_VALUE,
			type: 'POST',
			url: getURLForHTML('dashboard', 'inbox/' + path),
			data: JSON.stringify(request || {}),
			dataType: 'json',
			success: function (response) {
				if (response && response.status === '1') {
					resolve(response.data);
				} else {
					reject((response && response.message) || 'Writing help could not be loaded just now. Please try again in a minute.');
				}
			},
			error: function () {
				reject('Writing help could not be reached. Check your connection and try again.');
			}
		});
	});
}

function ibxStyles() {
	if (document.getElementById('ibxStyles')) {
		return;
	}
	$('head').append('<style id="ibxStyles">'
		+ '.ibx-box{margin:0 0 1rem;padding:.75rem;border:1px solid var(--gray,#ccc);border-radius:.5rem;background:var(--light,#f7f7f7)}'
		+ '.ibx-box[hidden]{display:none}'
		+ '.ibx-row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}'
		+ '.ibx-row label{margin:0;font-weight:600}'
		+ '.ibx-row select,.ibx-row input[type=text]{flex:1 1 14rem;min-width:0}'
		+ '.ibx-btn{padding:.25rem .65rem;border:1px solid var(--pc,#0b5ed7);border-radius:1rem;background:var(--white,#fff);color:var(--pc,#0b5ed7);font-size:.85rem;cursor:pointer}'
		+ '.ibx-btn:hover:not(:disabled){background:var(--pc,#0b5ed7);color:var(--white,#fff)}'
		+ '.ibx-btn:disabled{opacity:.55;cursor:not-allowed}'
		+ '.ibx-btn:focus-visible{outline:2px solid var(--pc,#0b5ed7);outline-offset:2px}'
		+ '.ibx-hint{margin:.5rem 0 0;font-size:.8rem;color:var(--gray-dark,#555)}'
		+ '.ibx-preview{margin-top:.75rem;padding:.75rem;border:1px solid var(--pc,#0b5ed7);border-radius:.5rem;background:var(--white,#fff)}'
		+ '.ibx-preview p{margin:0 0 .75rem;white-space:pre-wrap;overflow-wrap:anywhere}'
		+ '.ibx-preview__title{font-size:.8rem;font-weight:600;color:var(--gray-dark,#555);margin-bottom:.35rem}'
		+ '.ibx-error{margin:.75rem 0 0;color:var(--danger,#b02a37)}'
		+ '.ibx-progress{display:flex;gap:.5rem;align-items:center;margin-top:.75rem;font-size:.85rem}'
		+ '.ibx-progress progress{width:8rem}'
		+ '.ibx-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}'
		+ '</style>');
}

/* One polite region for everything announced (the picker's "Template applied", the AI's "Suggestion ready"). */
function ibxAnnounce(text) {
	var region = document.getElementById('ibxStatus');
	if (!region) {
		region = document.createElement('div');
		region.id = 'ibxStatus';
		region.className = 'ibx-sr';
		region.setAttribute('role', 'status');
		region.setAttribute('aria-live', 'polite');
		var host = document.getElementById('ibAiToolbar') || document.body;
		host.parentNode.insertBefore(region, host);
	}
	region.textContent = '';
	window.setTimeout(function () { region.textContent = text; }, 50);
}

function ibxFire(id) {
	var el = document.getElementById(id);
	if (el) {
		el.dispatchEvent(new Event('input', { bubbles: true }));
	}
}

function ibxLoadOptions() {
	if (!IBX.optionsRequest) {
		IBX.optionsRequest = ibxPost('compose/assist', {}).then(function (options) {
			IBX.options = options || {};
			return IBX.options;
		}, function () {
			IBX.options = { aiEnabled: false, schoolName: '' };
			return IBX.options;
		});
	}
	return IBX.optionsRequest;
}

/* ---------- events from inbox.js ---------- */

function ibxBind() {
	if (IBX.bound) {
		return;
	}
	IBX.bound = true;
	document.addEventListener('inbox:compose-open', function (e) {
		var detail = (e && e.detail) || {};
		IBX.writerName = detail.writerName || '';
		IBX.kind = null;
		IBX.token++;
		IBX.options = null;
		IBX.optionsRequest = null;
		IBX.busy = false;
		ibxStyles();
		$('#ibComposeAssist').prop('hidden', true).empty();
		$('#ibAiToolbar').prop('hidden', true).empty();
		ibxLoadOptions().then(function (options) {
			if (options.aiEnabled) {
				ibxRenderToolbar(options);
			}
		});
	});
	document.addEventListener('inbox:compose-recipients', function (e) {
		var detail = (e && e.detail) || {};
		if (detail.writerName) {
			IBX.writerName = detail.writerName;
		}
		ibxRecipients(detail);
	});
}

function ibxKindOf(recipients) {
	var kinds = {};
	recipients.forEach(function (r) {
		kinds[String(r.kind || '').toUpperCase()] = true;
	});
	var list = Object.keys(kinds);
	return list.length === 1 ? list[0] : '';
}

function ibxRecipients(detail) {
	var box = $('#ibComposeAssist');
	var recipients = detail.recipients || [];
	if (detail.reply) {
		IBX.kind = null;
		box.prop('hidden', true).empty();
		return;
	}
	// Nobody chosen yet, or people of different kinds: every template for this writer, grouped by who it is for.
	var kind = (recipients.length && ibxKindOf(recipients)) || 'ALL';
	if (IBX.kind === kind && box.children().length) {
		IBX.recipients = recipients;
		return;
	}
	IBX.kind = kind;
	IBX.recipients = recipients;
	var token = IBX.token;
	var cached = IBX.templates[kind];
	var ready = cached ? Promise.resolve(cached) : ibxPost('compose/templates', { recipientKind: kind }).then(function (list) {
		IBX.templates[kind] = list || [];
		return IBX.templates[kind];
	});
	ready.then(function (list) {
		if (token !== IBX.token || IBX.kind !== kind) {
			return;
		}
		ibxRenderPicker(list, kind === 'ALL');
	}, function () {
		box.prop('hidden', true).empty();
	});
}

/* ---------- template picker ---------- */

var IBX_KIND_GROUPS = [['TEACHER', 'To a teacher'], ['OFFICE', 'To the school office'], ['STUDENT', 'To a student'],
	['PARENT', 'To a parent'], ['ADMIN', 'To a school admin'], ['ANY', 'To anyone']];

/* grouped: the templates for every kind of recipient, under "To a teacher", "To the school office", ... */
function ibxRenderPicker(list, grouped) {
	var box = $('#ibComposeAssist');
	if (!list.length) {
		box.prop('hidden', true).empty();
		return;
	}
	var option = function (t) {
		return '<option value="' + list.indexOf(t) + '">' + ibxEscape(t.title) + '</option>';
	};
	var options = !grouped ? list.map(option).join('') : IBX_KIND_GROUPS.map(function (g) {
		var inGroup = list.filter(function (t) { return String(t.recipientKind).toUpperCase() === g[0]; });
		return inGroup.length ? '<optgroup label="' + ibxEscape(g[1]) + '">' + inGroup.map(option).join('') + '</optgroup>' : '';
	}).join('');
	box.addClass('ibx-box').html('<div class="ibx-row"><label for="ibxTemplate">Start from a template</label>'
		+ '<select id="ibxTemplate" class="form-control"><option value="">Choose a template (optional)</option>'
		+ options + '</select></div>'
		+ '<p class="ibx-hint">Words like &lt;date&gt; or [Child name] that are left in the text are for you to fill in.</p>');
	box.prop('hidden', false);
	$('#ibxTemplate').on('change', function () {
		var template = list[parseInt(this.value, 10)];
		this.value = '';
		if (template) {
			ibxApplyTemplate(template);
		}
	});
}

function ibxApplyTemplate(template) {
	var written = $.trim($('#ibSubject').val()) || $.trim($('#ibMessage').val());
	if (written && !window.confirm('Replace what you have written with the template "' + template.title + '"?')) {
		return;
	}
	var values = ibxPlaceholders();
	$('#ibSubject').val(ibxFill(template.subject, values));
	$('#ibMessage').val(ibxFill(template.body, values));
	ibxFire('ibSubject');
	ibxFire('ibMessage');
	ibxAnnounce('The template "' + template.title + '" is in your message. Fill in anything in angle brackets.');
	$('#ibMessage').trigger('focus');
}

function ibxPlaceholders() {
	var recipients = IBX.recipients || [];
	var child = '';
	recipients.forEach(function (r) {
		child = child || r.childName || '';
	});
	return {
		'[Recipient name]': recipients.length === 1 ? (recipients[0].name || 'there') : 'there',
		'[Child name]': child,
		'[Your name]': IBX.writerName,
		'[School name]': (IBX.options && IBX.options.schoolName) || ''
	};
}

/* A placeholder with no value stays as written, so the writer sees what is left to fill in. */
function ibxFill(text, values) {
	var out = String(text || '');
	Object.keys(values).forEach(function (key) {
		if (values[key]) {
			out = out.split(key).join(values[key]);
		}
	});
	return out;
}

/* ---------- AI toolbar ---------- */

function ibxRenderToolbar(options) {
	var actions = options.aiActions || [];
	var buttons = IBX_AI_ACTIONS.filter(function (a) {
		return actions.indexOf(a[0]) >= 0;
	});
	if (!buttons.length) {
		return;
	}
	var box = $('#ibAiToolbar');
	box.addClass('ibx-box').html('<div class="ibx-row" role="group" aria-label="AI writing help">'
		+ buttons.map(function (a) {
			return '<button type="button" class="ibx-btn" data-action="' + a[0] + '">' + ibxEscape(a[1]) + '</button>';
		}).join('') + '</div>'
		+ '<div class="ibx-row" id="ibxBrief" hidden style="margin-top:.5rem"><label for="ibxBriefText">What do you want to say?</label>'
		+ '<input type="text" id="ibxBriefText" class="form-control" maxlength="500" autocomplete="off">'
		+ '<button type="button" class="ibx-btn" id="ibxBriefGo">Write it</button></div>'
		+ '<div id="ibxResult"></div>'
		+ '<p class="ibx-hint" id="ibxLeft"></p>');
	ibxLeft(options.aiRemaining);
	box.prop('hidden', false);
	box.on('click', '.ibx-btn[data-action]', function () {
		var action = this.getAttribute('data-action');
		if (action === 'HELP_WRITE') {
			$('#ibxBrief').prop('hidden', false);
			$('#ibxBriefText').trigger('focus');
			return;
		}
		$('#ibxBrief').prop('hidden', true);
		ibxAsk(action, '');
	});
	box.on('click', '#ibxBriefGo', function () {
		ibxAsk('HELP_WRITE', $.trim($('#ibxBriefText').val()));
	});
	box.on('keydown', '#ibxBriefText', function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			ibxAsk('HELP_WRITE', $.trim($('#ibxBriefText').val()));
		}
	});
	box.on('click', '#ibxAccept', function () {
		$('#ibMessage').val($('#ibxSuggestion').text());
		ibxFire('ibMessage');
		$('#ibxResult').empty();
		ibxAnnounce('The suggestion is now your message.');
		$('#ibMessage').trigger('focus');
	});
	box.on('click', '#ibxDismiss', function () {
		$('#ibxResult').empty();
		$('#ibMessage').trigger('focus');
	});
}

function ibxLeft(remaining) {
	if (typeof remaining === 'number') {
		$('#ibxLeft').text(remaining > 0 ? 'AI help left today: ' + remaining
			+ '. Your text is sent to an AI service to make the suggestion; it is not kept.'
			: 'You have used your AI writing help for today. Try again tomorrow.');
		$('#ibAiToolbar .ibx-btn').prop('disabled', remaining <= 0);
	}
}

function ibxAsk(action, instruction) {
	if (IBX.busy) {
		return;
	}
	var text = $('#ibMessage').val();
	if (action === 'HELP_WRITE' ? !instruction : !$.trim(text)) {
		ibxShowError(action === 'HELP_WRITE' ? 'Tell the assistant what you want to say, then try again.'
			: 'Write your message first, then choose how you want it improved.');
		return;
	}
	IBX.busy = true;
	var token = IBX.token;
	$('#ibAiToolbar .ibx-btn').prop('disabled', true);
	$('#ibxResult').html('<div class="ibx-progress"><progress aria-label="' + ibxEscape(IBX_WORKING[action]) + '"></progress>'
		+ '<span>' + ibxEscape(IBX_WORKING[action]) + '...</span></div>');
	ibxPost('compose/ai-help', { action: action, text: text, instruction: instruction }).then(function (data) {
		if (token !== IBX.token) {
			return;
		}
		ibxShowSuggestion(data.suggestion);
		ibxLeft(data.remainingToday);
		ibxAnnounce('The suggestion is ready below your message. Choose Use this or Dismiss.');
	}, function (message) {
		if (token === IBX.token) {
			ibxShowError(message);
			if (/used your AI writing help/.test(message)) {
				ibxLeft(0);
			}
		}
	}).then(function () {
		if (token === IBX.token) {
			IBX.busy = false;
			if (!/used your AI writing help/.test($('#ibxLeft').text())) {
				$('#ibAiToolbar .ibx-btn').prop('disabled', false);
			}
		}
	});
}

function ibxShowSuggestion(suggestion) {
	$('#ibxResult').html('<div class="ibx-preview" role="group" aria-labelledby="ibxPreviewTitle">'
		+ '<div class="ibx-preview__title" id="ibxPreviewTitle">Suggestion (nothing changes until you choose Use this)</div>'
		+ '<p id="ibxSuggestion"></p>'
		+ '<button type="button" class="btn btn-primary btn-sm" id="ibxAccept">Use this</button> '
		+ '<button type="button" class="btn btn-outline-secondary btn-sm" id="ibxDismiss">Dismiss</button></div>');
	$('#ibxSuggestion').text(suggestion);
	document.getElementById('ibxAccept').focus();
}

function ibxShowError(message) {
	$('#ibxResult').html('<p class="ibx-error" role="alert"></p>');
	$('#ibxResult .ibx-error').text(message);
}

ibxBind();
