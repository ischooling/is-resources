/*
 * Contact check (student, parent, teacher): markup and styles. Behaviour is in contactCheck.js.
 * The popup follows the "Complete Your Profile" popup (#profileFielddModal): primary header,
 * red "Later", green main action. Colours come from the school theme variables
 * (--pc, --plc, --sc, --success, --warning, --danger, --gray, --light).
 * Every server value is escaped with ccEscape() before it reaches the page.
 */

var CC_CHANNELS = {
	EMAIL: { icon: 'fa-envelope-o', name: 'email address', label: 'Email', check: 'Check your email address' },
	MOBILE: { icon: 'fa-mobile', name: 'mobile number', label: 'Mobile (SMS)', check: 'Check your mobile number' },
	WHATSAPP: { icon: 'fa-whatsapp', name: 'WhatsApp number', label: 'WhatsApp', check: 'Check your WhatsApp number' },
	APP: { icon: 'fa-bell-o', name: 'app', label: 'App notifications', check: '' }
};

/* What the user can choose for each channel: [action, icon, title, explanation]. */
var CC_OPTIONS = {
	EMAIL: [
		['CHANGE', 'fa-pencil', 'Update my email', 'The address is wrong. I\'ll enter the correct one.'],
		['CONFIRM', 'fa-check-circle-o', 'It is correct', 'This address is right. Send a code to it so I can confirm.'],
		['ALTERNATE', 'fa-plus-circle', 'Add another email', 'Keep this one, and also send school emails to a second address.']
	],
	MOBILE: [
		['CHANGE', 'fa-pencil', 'Change my number', 'Enter the correct number. We\'ll text you a code.'],
		['CONFIRM', 'fa-check-circle-o', 'It is correct', 'We\'ll text a code to this number to confirm it.']
	],
	WHATSAPP: [
		['CHANGE', 'fa-whatsapp', 'Give my WhatsApp number', 'Use a different number for WhatsApp. We\'ll send a code there.'],
		['CONFIRM', 'fa-check-circle-o', 'It is correct', 'This number has WhatsApp. We\'ll send a code on WhatsApp.'],
		['NO_WHATSAPP', 'fa-ban', 'I don\'t use WhatsApp', 'Stop WhatsApp messages. You\'ll still get email and SMS.']
	]
};

var CC_STATUS = {
	VERIFIED: ['Verified', 'ok'],
	OK: ['Working', 'ok'],
	INVALID: ['Invalid', 'bad'],
	NOT_REACHABLE: ['Not reachable', 'warn'],
	APP_NOT_INSTALLED: ['App not installed', 'info'],
	UNKNOWN: ['Not checked yet', 'none']
};

function ccEscape(value) {
	if (value === null || value === undefined) {
		return '';
	}
	return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function ccBadge(label, kind) {
	return '<span class="cc-badge cc-badge--' + kind + '">' + ccEscape(label) + '</span>';
}

/* A number as people read it: "+91 98765 4321" when the ISD code is known. */
function ccDisplayValue(item) {
	var value = item && item.value ? String(item.value) : '';
	if (item && item.channel !== 'EMAIL' && item.isdCode && value.charAt(0) !== '+') {
		return '+' + String(item.isdCode).replace(/^\+/, '') + ' ' + value;
	}
	return value;
}

/* The popup shell; contactCheck.js fills the title, body and footer for each step. */
function getContactCheckModalContent() {
	return '<div class="modal fade" id="contactCheckModal" tabindex="-1" role="dialog" aria-modal="true" aria-labelledby="ccTitle">'
		+ '<div class="modal-dialog modal-md" role="document" style="max-width:560px;width:calc(100% - 20px)">'
		+ '<div class="modal-content border-0 shadow">'
		+ '<div class="modal-header bg-primary text-white py-2 px-4">'
		+ '<h5 class="modal-title d-flex align-items-center mb-0">'
		+ '<i class="fa mr-2" id="ccTitleIcon" aria-hidden="true"></i><span id="ccTitle" tabindex="-1"></span></h5>'
		+ '</div>'
		+ '<form id="ccForm" novalidate autocomplete="off" action="javascript:void(0);">'
		+ '<div class="modal-body overflow-y-auto">'
		+ '<div id="ccAlert" class="cc-alert" role="alert" hidden></div>'
		+ '<div id="ccBody"></div>'
		+ '</div>'
		+ '<div class="modal-footer bg-white" id="ccFooter"></div>'
		+ '</form>'
		+ '</div></div></div>';
}

/* Step 1: what is wrong, and what the user wants to do about it. */
function ccChooseBody(item, manual) {
	var channel = CC_CHANNELS[item.channel];
	var value = '<span class="cc-value">' + ccEscape(ccDisplayValue(item)) + '</span>';
	var about = item.about ? ' about <strong>' + ccEscape(item.about) + '</strong>' : '';
	var problem;
	if (item.channel === 'EMAIL') {
		problem = 'School emails' + about + ' to ' + value + ' are not being delivered.';
	} else if (item.channel === 'MOBILE') {
		problem = 'Text messages' + about + ' to your mobile number ' + value + ' are not reaching you.';
	} else {
		problem = 'We couldn\'t reach you on WhatsApp at ' + value + (item.about ? ' (messages about <strong>' + ccEscape(item.about) + '</strong>)' : '') + '.';
	}
	var details = [];
	if (item.reason) {
		details.push(ccEscape(item.reason));
	}
	if (item.lastFailedAt) {
		details.push('last tried ' + ccEscape(ccWhen(item.lastFailedAt)));
	}
	var options = (CC_OPTIONS[item.channel] || []).filter(function (o) {
		return o[0] !== 'ALTERNATE' || item.canAddAlternate;
	}).map(function (o, i) {
		return '<label class="cc-option" for="ccAction' + o[0] + '">'
			+ '<input type="radio" class="cc-option__input" name="ccAction" id="ccAction' + o[0] + '" value="' + o[0] + '"' + (i === 0 ? ' checked' : '') + '>'
			+ '<i class="fa ' + o[1] + ' cc-option__icon" aria-hidden="true"></i>'
			+ '<span><span class="cc-option__title">' + o[2] + '</span><span class="cc-option__text">' + o[3] + '</span></span>'
			+ '</label>';
	}).join('');
	var skip = '';
	if (!manual) {
		skip = item.mandatory
			? '<p class="cc-note mb-0" id="ccSkipNote">Please fix this now to keep getting messages from the school. It can no longer be skipped.</p>'
			: (item.laterLeft > 0 ? '<p class="cc-note mb-0" id="ccSkipNote">You can skip this ' + parseInt(item.laterLeft, 10) + ' more time'
				+ (parseInt(item.laterLeft, 10) === 1 ? '' : 's') + '.</p>' : '');
	}
	return '<div class="cc-warning"><i class="fa fa-exclamation-triangle mr-2" aria-hidden="true"></i><div>'
		+ '<div>' + problem + '</div>'
		+ (details.length ? '<div class="cc-warning__reason">' + details.join(' &middot; ') + '</div>' : '')
		+ '</div></div>'
		+ '<fieldset class="mb-2"><legend class="cc-legend">What would you like to do?</legend>' + options + '</fieldset>'
		+ skip;
}

/* "Close for now": only on a mandatory item whose code could not be sent or checked (item.closeNow), so the
   dashboard is never blocked by a code that cannot arrive. It closes the popup for this page load; no skip is spent. */
function ccCloseNowButton(item, manual) {
	if (manual || !item || !item.mandatory) {
		return '';
	}
	return '<button type="button" class="btn btn-light border" id="ccCloseNow"' + (item.closeNow ? '' : ' hidden') + '>Close for now</button>';
}

function ccChooseFooter(item, manual) {
	var left = manual
		? '<button type="button" class="btn btn-danger" id="ccClose">Close</button>'
		: (item.mandatory ? ccCloseNowButton(item, manual) : '<button type="button" class="btn btn-danger" id="ccLater">Later</button>');
	return left + '<button type="submit" class="btn btn-success rounded" id="ccContinue"><i class="fa fa-arrow-right mr-1" aria-hidden="true"></i>Continue</button>';
}

/* The ISD list comes from the phone library the profile page already uses (itiGetCountryList). */
function ccIsdField(selectedIsd) {
	var wanted = String(selectedIsd || '').replace(/\D/g, '');
	var countries = [];
	try {
		countries = (typeof itiGetCountryList === 'function' ? itiGetCountryList() : []) || [];
	} catch (e) {
		countries = [];
	}
	if (!countries.length) {
		// The list is not on this page: the code is typed instead.
		return '<input type="text" class="form-control cc-isd" id="ccIsd" inputmode="numeric" maxlength="5" aria-label="Country code" '
			+ 'placeholder="+91" autocomplete="tel-country-code" value="' + (wanted ? '+' + wanted : '') + '">';
	}
	var chosen = false;
	var options = countries.map(function (c) {
		var selected = '';
		if (!chosen && wanted && String(c.dialCode) === wanted) {
			chosen = true;
			selected = ' selected';
		}
		return '<option value="' + ccEscape(c.dialCode) + '"' + selected + '>+' + ccEscape(c.dialCode) + ' ' + ccEscape(c.name) + '</option>';
	}).join('');
	return '<select class="form-control cc-isd" id="ccIsd" aria-label="Country code" autocomplete="tel-country-code">'
		+ (chosen ? '' : '<option value="" selected>Country code</option>') + options + '</select>';
}

function ccFieldError(id) {
	return '<div class="cc-error" id="' + id + '" hidden><i class="fa fa-exclamation-circle" aria-hidden="true"></i> <span class="sr-only">Error: </span><span class="cc-error__text"></span></div>';
}

/* Step 2: the new value (change / another email) or the stored one (it is correct), then the code. */
function ccCodeBody(item, action) {
	var channel = CC_CHANNELS[item.channel];
	var isEmail = item.channel === 'EMAIL';
	var sendLabel = item.channel === 'MOBILE' ? 'Send SMS code' : (item.channel === 'WHATSAPP' ? 'Send WhatsApp code' : 'Send code');
	var html = '';
	if (action === 'CONFIRM') {
		html += '<p class="mb-2">We\'ll send a 6-digit code to <span class="cc-value">' + ccEscape(ccDisplayValue(item)) + '</span>'
			+ (item.channel === 'WHATSAPP' ? ' on WhatsApp' : (item.channel === 'MOBILE' ? ' by SMS' : ''))
			+ '. Enter the code here to confirm the ' + channel.name + ' is yours.</p>'
			+ '<button type="button" class="btn btn-primary mb-3" id="ccSend">' + sendLabel + '</button>';
	} else if (isEmail) {
		if (action === 'CHANGE') {
			html += '<div class="form-group"><label for="ccCurrent">Current email</label>'
				+ '<input type="text" class="form-control" id="ccCurrent" value="' + ccEscape(item.value) + '" readonly></div>';
		}
		html += '<div class="form-group mb-2"><label for="ccValue">' + (action === 'CHANGE' ? 'New email' : 'Second email')
			+ ' <span class="text-danger" aria-hidden="true">*</span></label>'
			+ (action === 'ALTERNATE' ? '<div class="cc-note mb-1" id="ccValueHint">After you enter the code, school emails also go to this address. Your current one is kept.</div>' : '')
			+ '<div class="input-group">'
			+ '<input type="email" class="form-control" id="ccValue" required maxlength="150" autocomplete="email" inputmode="email" '
			+ 'placeholder="name@example.com"' + (action === 'ALTERNATE' ? ' aria-describedby="ccValueHint"' : '') + ' data-error="ccValueError">'
			+ '<div class="input-group-append"><button type="button" class="btn btn-primary" id="ccSend">' + sendLabel + '</button></div>'
			+ '</div>' + ccFieldError('ccValueError') + '</div>';
	} else {
		html += '<div class="form-group mb-2"><label for="ccValue">' + (item.channel === 'WHATSAPP' ? 'WhatsApp number' : 'New mobile number')
			+ ' <span class="text-danger" aria-hidden="true">*</span></label>'
			+ '<div class="input-group cc-phone">'
			+ '<div class="input-group-prepend">' + ccIsdField(item.isdCode) + '</div>'
			+ '<input type="tel" class="form-control" id="ccValue" required maxlength="15" autocomplete="tel-national" inputmode="numeric" '
			+ 'placeholder="Number without the country code" data-error="ccValueError">'
			+ '<div class="input-group-append"><button type="button" class="btn btn-primary" id="ccSend">' + sendLabel + '</button></div>'
			+ '</div>' + ccFieldError('ccValueError') + '</div>';
	}
	html += '<p class="cc-sent" id="ccSent" role="status"></p>'
		+ '<div id="ccCodeGroup" hidden>'
		+ '<div class="form-group mb-2"><label for="ccCode">Enter the code</label>'
		// The hint sits above the box so the phone keyboard and autofill bar never cover it.
		+ '<div class="cc-note mb-1" id="ccCodeHint">Type the 6-digit code we sent you.</div>'
		+ '<input type="text" class="form-control cc-code" id="ccCode" inputmode="numeric" autocomplete="one-time-code" pattern="\\d{6}" maxlength="6" '
		+ 'aria-describedby="ccCodeHint" data-error="ccCodeError">'
		+ ccFieldError('ccCodeError') + '</div>'
		+ '<p class="cc-note mb-2">Didn\'t get it? <button type="button" class="btn btn-link p-0 align-baseline cc-resend" id="ccResend" disabled>Resend code</button>'
		+ ' <span id="ccResendWait" aria-live="off"></span></p>'
		+ '</div>';
	if (item.channel === 'WHATSAPP' && action === 'CHANGE') {
		html += '<div class="custom-control custom-checkbox mb-2"><input type="checkbox" class="custom-control-input" id="ccAlsoMobile">'
			+ '<label class="custom-control-label" for="ccAlsoMobile">Also use this as my mobile number</label></div>';
	}
	if (isEmail) {
		html += '<p class="cc-note mb-0"><i class="fa fa-info-circle" aria-hidden="true"></i> Your sign-in email does not change.'
			+ ' This address is only used for school emails.</p>';
	}
	return html;
}

function ccCodeFooter(item, manual) {
	return '<button type="button" class="btn btn-light border" id="ccBack">Back</button>'
		+ ccCloseNowButton(item, manual)
		+ '<button type="submit" class="btn btn-success rounded" id="ccVerify" disabled><i class="fa fa-save mr-1" aria-hidden="true"></i>Verify and save</button>';
}

function ccNoWhatsappBody(item) {
	return '<p class="mb-2">We\'ll stop sending WhatsApp messages to <span class="cc-value">' + ccEscape(ccDisplayValue(item)) + '</span>.</p>'
		+ '<p class="cc-note mb-0">You\'ll still get school messages by email and SMS. You can give a WhatsApp number later from your profile.</p>';
}

function ccNoWhatsappFooter() {
	return '<button type="button" class="btn btn-light border" id="ccBack">Back</button>'
		+ '<button type="submit" class="btn btn-success rounded" id="ccNoWhatsapp">Yes, stop WhatsApp messages</button>';
}

function ccDoneBody(title, text) {
	return '<div class="text-center py-3">'
		+ '<div class="cc-done__icon"><i class="fa fa-check-circle" aria-hidden="true"></i></div>'
		+ '<h6 class="font-weight-bold mt-2 mb-1" id="ccDoneTitle">' + ccEscape(title) + '</h6>'
		+ '<p class="mb-0">' + ccEscape(text) + '</p>'
		+ '</div>';
}

function ccDoneFooter(hasNext) {
	return '<button type="submit" class="btn btn-success rounded mx-auto" id="ccDoneOk">' + (hasNext ? 'Next' : 'OK') + '</button>';
}

/* True when a profile row is worth showing the card for: the contact has a problem, or there is a button to press. */
function ccSummaryNeedsAttention(c) {
	return !!c && (c.status === 'INVALID' || c.status === 'NOT_REACHABLE' || c.status === 'APP_NOT_INSTALLED');
}

/* Profile page: "My contact details" (one row per channel, a button only where something is wrong). */
function getContactCheckSummaryShell() {
	return '<div class="card mt-3 mb-3 cc-summary" id="contactCheckSummary" hidden>'
		+ '<div class="card-body">'
		+ '<div class="d-flex align-items-center flex-wrap mb-2">'
		+ '<h5 class="text-dark font-weight-semi-bold d-flex align-items-center mb-0 flex-grow-1">'
		+ '<span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">'
		+ '<i class="fa fa-address-card-o font-12" aria-hidden="true"></i></span><span>My contact details</span></h5>'
		+ '<span class="cc-note">How the school reaches you</span>'
		+ '</div>'
		+ '<ul class="cc-summary__list" id="contactCheckSummaryRows"></ul>'
		+ '</div></div>';
}

function ccSummaryRow(c) {
	var channel = CC_CHANNELS[c.channel] || { icon: 'fa-address-card-o', label: c.channel };
	var status = CC_STATUS[c.status] || CC_STATUS.UNKNOWN;
	var action = '';
	if (c.status === 'APP_NOT_INSTALLED') {
		action = '<button type="button" class="btn btn-primary btn-sm" data-cc-app="1">Get the app</button>';
	} else if (c.reviewId && (c.status === 'INVALID' || c.status === 'NOT_REACHABLE')) {
		action = '<button type="button" class="btn btn-primary btn-sm" data-cc-review="' + ccEscape(c.reviewId) + '">Fix now'
			+ '<span class="sr-only"> ' + ccEscape(c.label || channel.label) + '</span></button>';
	}
	return '<li class="cc-summary__row">'
		+ '<i class="fa ' + channel.icon + ' cc-summary__icon" aria-hidden="true"></i>'
		+ '<div class="cc-summary__what"><div class="font-weight-semi-bold">' + ccEscape(c.label || channel.label) + '</div>'
		+ '<div class="cc-note cc-wrap">' + ccEscape(c.value || (c.channel === 'APP' ? 'No phone signed in' : 'Not given')) + '</div></div>'
		+ '<div class="cc-summary__status">' + ccBadge(status[0], status[1])
		+ (c.detail ? '<div class="cc-note">' + ccEscape(c.detail) + '</div>' : '') + '</div>'
		+ '<div class="cc-summary__action">' + action + '</div>'
		+ '</li>';
}

function ensureContactCheckStyles() {
	if (document.getElementById('contactCheckStyles')) {
		return;
	}
	var css = ''
		+ '.cc-warning{display:flex;align-items:flex-start;background:var(--plc);border-inline-start:4px solid var(--warning);border-radius:6px;padding:.6rem .75rem;margin-block-end:1rem;overflow-wrap:anywhere}'
		+ '.cc-warning>.fa{color:var(--warning);margin-block-start:.2rem}'
		+ '.cc-warning__reason{font-size:12px;color:var(--gray);margin-block-start:.15rem}'
		+ '.cc-value{font-weight:600;overflow-wrap:anywhere}'
		+ '.cc-legend{font-size:.9rem;font-weight:600;margin-block-end:.5rem}'
		+ '.cc-option{display:flex;align-items:flex-start;gap:.75rem;border:1px solid var(--light);border-radius:8px;padding:.6rem .75rem;margin-block-end:.5rem;cursor:pointer;min-block-size:48px}'
		+ '.cc-option:hover{border-color:var(--pc)}'
		+ '.cc-option:has(.cc-option__input:checked){border-color:var(--pc);background:var(--plc);box-shadow:0 0 0 1px var(--pc)}'
		+ '.cc-option:has(.cc-option__input:focus-visible){outline:2px solid var(--pc);outline-offset:2px}'
		+ '.cc-option__input{margin-block-start:.3rem;accent-color:var(--pc)}'
		+ '.cc-option__icon{color:var(--pc);margin-block-start:.25rem;inline-size:1rem;text-align:center}'
		+ '.cc-option__title{display:block;font-weight:600}'
		+ '.cc-option__text{display:block;font-size:12px;color:var(--gray)}'
		+ '.cc-note{font-size:12px;color:var(--gray)}'
		+ '.cc-wrap{overflow-wrap:anywhere}'
		+ '.cc-alert{border-inline-start:4px solid var(--danger);background:var(--light);border-radius:4px;padding:.5rem .75rem;margin-block-end:.75rem;font-size:13px;overflow-wrap:anywhere}'
		+ '.cc-error{color:var(--danger);font-size:12px;margin-block-start:.25rem}'
		+ '#contactCheckModal [aria-invalid="true"]{border-color:var(--danger)}'
		+ '.cc-sent{color:var(--success);font-size:12px;margin-block-end:.5rem;overflow-wrap:anywhere}'
		+ '.cc-sent:empty{display:none}'
		// One box for the whole code (autofill and paste keep working); 16px+ stops phones zooming in.
		+ '.cc-code{font-family:ui-monospace,monospace;font-size:1.25rem;letter-spacing:.35em;min-block-size:48px;max-inline-size:14rem}'
		+ '.cc-isd{max-inline-size:8.5rem;border-start-end-radius:0;border-end-end-radius:0}'
		+ '.cc-phone .form-control,.cc-phone .btn{min-block-size:38px}'
		+ '.cc-resend:disabled{color:var(--gray);text-decoration:none}'
		+ '.cc-done__icon{font-size:3rem;line-height:1;color:var(--success)}'
		+ '.cc-badge{display:inline-block;padding:.1rem .45rem;border-radius:4px;font-size:11px;font-weight:600;line-height:1.5;white-space:nowrap;background:var(--gray);color:var(--white)}'
		+ '.cc-badge--ok{background:var(--success)}'
		+ '.cc-badge--bad{background:var(--danger)}'
		+ '.cc-badge--warn{background:var(--warning);color:var(--gray-dark)}'
		+ '.cc-badge--info{background:var(--pc)}'
		+ '.cc-summary__list{list-style:none;margin:0;padding:0}'
		+ '.cc-summary__row{display:grid;grid-template-columns:1.5rem minmax(0,2fr) minmax(0,1.5fr) auto;gap:.25rem .75rem;align-items:center;padding:.5rem 0;border-block-start:1px solid var(--light)}'
		+ '.cc-summary__icon{color:var(--pc);text-align:center}'
		+ '.cc-summary__action{min-inline-size:5.5rem;text-align:end}'
		+ '@media (max-width:575.98px){'
		+ '.cc-summary__row{grid-template-columns:1.5rem minmax(0,1fr) auto}'
		+ '.cc-summary__status{grid-column:2}'
		+ '.cc-summary__action{grid-column:3;grid-row:1 / span 2}'
		+ '.cc-phone{flex-wrap:wrap}.cc-phone>.input-group-append{inline-size:100%;margin:.5rem 0 0}.cc-phone>.input-group-append .btn{inline-size:100%;border-radius:.25rem}'
		+ '}';
	$('head').append('<style id="contactCheckStyles">' + css + '</style>');
}
