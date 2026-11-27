/*
 * Contact check (student, parent, teacher): behaviour. Markup and styles are in contactCheckContent.js.
 * Server: {schoolUuid}/dashboard/contact-check/* , always for the logged-in user.
 *
 * - contactCheckThen(next): on dashboard load, asks the server what is wrong with the user's
 *   email / mobile / WhatsApp, shows one popup per problem, and runs next() when the user is done.
 *   The profile-completing popup and the app-install popup are started through it, so the contact
 *   check comes first and they are never open together. If the check is off, fails or has nothing
 *   to show, next() runs straight away.
 * - openContactCheckReview(reviewId, onClose): the same popup for one problem ("Fix now" on the profile).
 * - mountContactCheckSummary(selector): the "My contact details" card on the profile page.
 */

var CC = null;        // the open popup: { items, index, item, step, action, manual, busy, sent, ... }
var CC_GATE = null;   // the one dashboard check of this page load (a jQuery promise)
var CC_ORDER = ['EMAIL', 'MOBILE', 'WHATSAPP'];
var CC_RESEND_SECONDS = 30;
var CC_FALLBACK_TIMEZONE = 'Asia/Singapore';
var CC_LOAD_TIMEOUT = 8000;   // "pending" and "summary": the dashboard never waits longer than this for them

/* ---------- helpers ---------- */

/*
 * onDone(data, message, refused, refusal): data is null when the call did not succeed. Nothing is shown here.
 * refused: the server said no (status "0"); otherwise a failure is an error (status "2", no answer, timed out).
 * refusal: what the server sent with a refusal ({} when nothing), e.g. { mandatory: true } from "later".
 * timeout (ms, optional): the call is given up after this long and ends as an error.
 */
function ccPost(path, request, onDone, timeout) {
	var options = {
		contentType: APPLICATION_JSON_VALUE,
		type: 'POST',
		url: getURLForHTML('dashboard', 'contact-check/' + path),
		data: JSON.stringify(request || {}),
		dataType: 'json',
		success: function (response) {
			if (!response || response.status !== '1') {
				var refused = !!response && response.status === '0';
				onDone(null, (response && response.message) || 'This could not be done just now. Please try again in a minute.',
					refused, (refused && response.data) || {});
				return;
			}
			onDone(response.data || {}, response.message || '', false, {});
		},
		error: function () {
			onDone(null, 'The school server could not be reached. Check your connection and try again.', false, {});
		}
	};
	if (timeout) {
		options.timeout = timeout;
	}
	$.ajax(options);
}

/* A time in the user's own time zone (USER_TIMEZONE); Asia/Singapore when that is missing or not valid. */
function ccWhen(value) {
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
	var options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
	var zone = (typeof USER_TIMEZONE !== 'undefined' && USER_TIMEZONE && String(USER_TIMEZONE).trim()) || CC_FALLBACK_TIMEZONE;
	try {
		options.timeZone = zone;
		return new Intl.DateTimeFormat(undefined, options).format(date);
	} catch (e) {
		options.timeZone = CC_FALLBACK_TIMEZONE;
		return new Intl.DateTimeFormat(undefined, options).format(date);
	}
}

function isContactCheckOpen() {
	return !!CC;
}

/* Resolves when no contact-check popup is open (used by the profile-completing popup before it shows). */
function contactCheckClosed() {
	var closed = $.Deferred();
	var check = function () {
		if (!CC) {
			closed.resolve();
			return;
		}
		window.setTimeout(check, 500);
	};
	check();
	return closed.promise();
}

function ccIsContactCheckRole() {
	return typeof USER_ROLE !== 'undefined' && $.inArray(USER_ROLE, ['STUDENT', 'PARENT', 'TEACHER']) > -1;
}

function ccProblems(data) {
	if (!data || !data.enabled || !$.isArray(data.items)) {
		return [];
	}
	return data.items.filter(function (item) {
		return item && item.id !== undefined && item.id !== null && $.inArray(item.channel, CC_ORDER) > -1;
	}).sort(function (a, b) {
		return $.inArray(a.channel, CC_ORDER) - $.inArray(b.channel, CC_ORDER);
	});
}

/* ---------- dashboard sequencing ---------- */

/* Runs next() after this page load's contact check is over (at once when there is nothing to show). */
function contactCheckThen(next) {
	var run = function () {
		try {
			next();
		} catch (e) {
			console.error('contactCheckThen', e);
		}
	};
	if (!ccIsContactCheckRole()) {
		run();
		return;
	}
	if (!CC_GATE) {
		CC_GATE = ccStartDashboardCheck();
	}
	CC_GATE.always(run);
}

/* Resolves once the popups are finished, or as soon as it is clear none will be shown
   (also when the call fails or gets no answer within CC_LOAD_TIMEOUT). */
function ccStartDashboardCheck() {
	var gate = $.Deferred();
	try {
		ccPost('pending', {}, function (data) {
			try {
				var items = ccProblems(data);
				if (!items.length) {
					gate.resolve();
					return;
				}
				ccWhenNotInLiveClass(function (allowed) {
					if (!allowed) {
						gate.resolve();
						return;
					}
					ccWhenNoOtherPopup(function (clear) {
						if (!clear || CC) {
							gate.resolve();
							return;
						}
						openContactCheckPopup(items, { manual: false, onClose: function () { gate.resolve(); } });
					});
				});
			} catch (e) {
				gate.resolve();
			}
		}, CC_LOAD_TIMEOUT);
	} catch (e) {
		gate.resolve();
	}
	return gate.promise();
}

/* Same gate as the app-install popup: not during the user's live class (and not when that is unknown). */
function ccWhenNotInLiveClass(callback) {
	if (typeof resolveLiveClassSuppression !== 'function') {
		callback(true);
		return;
	}
	try {
		resolveLiveClassSuppression(function (suppress) {
			callback(!suppress);
		});
	} catch (e) {
		callback(true);
	}
}

/* Never opens on top of another popup: waits up to a minute for it to close, then gives up for this load. */
function ccWhenNoOtherPopup(callback) {
	var waited = 0;
	var check = function () {
		if ($('.modal.show').length === 0) {
			callback(true);
			return;
		}
		waited += 500;
		if (waited >= 60000) {
			callback(false);
			return;
		}
		window.setTimeout(check, 500);
	};
	check();
}

/* ---------- popup ---------- */

function openContactCheckPopup(items, options) {
	if (CC || !items || !items.length) {
		if (options && options.onClose) {
			options.onClose(false);
		}
		return;
	}
	CC = { items: items, index: 0, item: null, step: '', action: '', manual: !!(options && options.manual),
		onClose: options && options.onClose, busy: false, sent: null, wait: 0, timer: null, otp: null, changed: false, shown: false };
	ensureContactCheckStyles();
	$('#contactCheckModal').remove();
	// The profile-completing popup is never left open underneath (its own timer brings it back later).
	if ($('#profileFielddModal').hasClass('show')) {
		$('#profileFielddModal').modal('hide');
	}
	$('body').append(getContactCheckModalContent());
	ccBind();
	ccShowItem();
	$('#contactCheckModal').modal({ backdrop: 'static', keyboard: false });
}

function ccBind() {
	var $modal = $('#contactCheckModal');
	$modal.on('shown.bs.modal', function () {
		if (CC) {
			CC.shown = true;
			ccFocus();
		}
	});
	$modal.on('hidden.bs.modal', function () {
		var state = CC;
		ccStopTimer();
		ccStopOtpListener();
		$modal.remove();
		CC = null;
		if (state && state.onClose) {
			state.onClose(state.changed);
		}
	});
	$('#ccForm').on('submit', function (e) {
		e.preventDefault();
		if (!CC || CC.busy) {
			return;
		}
		if (CC.step === 'choose') {
			ccContinue();
		} else if (CC.step === 'code') {
			ccVerify();
		} else if (CC.step === 'nowhatsapp') {
			ccNoWhatsapp();
		} else {
			ccNext();
		}
	});
	// The popup is static: Esc and a click outside never skip or close a problem (only the "Later" button
	// spends a skip). On the last step, where everything is saved, they move on like its OK / Next button.
	$modal.on('keydown', function (e) {
		if (e.key === 'Escape' || e.keyCode === 27) {
			ccDismiss();
		}
	});
	$modal.on('click', function (e) {
		if (e.target === this) {
			ccDismiss();
		}
	});
	$modal.on('click', '#ccLater', ccLater);
	$modal.on('click', '#ccClose', ccClose);
	$modal.on('click', '#ccCloseNow', ccCloseNow);
	$modal.on('click', '#ccBack', function () {
		if (CC && !CC.busy) {
			ccShowItem();
		}
	});
	$modal.on('click', '#ccSend, #ccResend', function () {
		ccSendCode();
	});
	// Messages appear once the user has left the field, and go as soon as the value is right.
	$modal.on('change', '#ccValue, #ccIsd', function () {
		ccValidateValue(true);
	});
	$modal.on('input', '#ccValue, #ccIsd', function () {
		if (this.id === 'ccValue' && this.getAttribute('aria-invalid') === 'true') {
			ccValidateValue(true);
		}
		ccValueEdited();
	});
	$modal.on('input', '#ccCode', function () {
		var digits = this.value.replace(/\D/g, '').slice(0, 6);
		if (digits !== this.value) {
			this.value = digits;
		}
		if (this.getAttribute('aria-invalid') === 'true' && digits.length === 6) {
			ccSetError('ccCode', '');
		}
	});
}

function ccDismiss() {
	if (!CC || CC.busy) {
		return;
	}
	if (CC.step === 'done') {
		ccNext();
	}
}

function ccClose() {
	$('#contactCheckModal').modal('hide');
}

/* A mandatory problem whose code cannot be sent or checked just now: "Close for now" is offered from here on. */
function ccAllowCloseNow(item) {
	if (!CC || CC.manual || !item || !item.mandatory) {
		return;
	}
	item.closeNow = true;
	$('#ccCloseNow').prop('hidden', false);
}

/* Closes the popup for this page load only: "later" is not called, so no skip is spent and it is asked again next time. */
function ccCloseNow() {
	if (!CC || CC.busy || CC.manual || !CC.item || !CC.item.closeNow) {
		return;
	}
	ccClose();
}

function ccRender(icon, title, body, footer) {
	$('#ccTitleIcon').attr('class', 'fa mr-2 ' + icon);
	$('#ccTitle').text(title);
	$('#ccBody').html(body);
	$('#ccFooter').html(footer);
	ccAlert('');
	ccButtons();
	if (CC.shown) {
		ccFocus();
	}
}

/* Each step starts on its first control, so keyboard and screen-reader users land in the right place. */
function ccFocus() {
	var target = $('#ccBody').find('input:not([readonly]):not([type=hidden]):checked, input[type=email], input[type=tel], #ccSend').filter(':visible').first();
	if (!target.length) {
		target = $('#ccFooter .btn-success').first();
	}
	window.setTimeout(function () {
		target.trigger('focus');
	}, 0);
}

function ccAlert(message) {
	$('#ccAlert').text(message || '').prop('hidden', !message);
}

/* Buttons are off while a call is running; otherwise each follows the state of its step. */
function ccButtons() {
	if (!CC) {
		return;
	}
	var $modal = $('#contactCheckModal');
	$modal.find('button').prop('disabled', CC.busy);
	$('#ccForm').attr('aria-busy', CC.busy ? 'true' : 'false');
	if (!CC.busy) {
		$('#ccVerify').prop('disabled', !CC.sent);
		$('#ccResend').prop('disabled', CC.wait > 0);
	}
}

function ccBusy(busy) {
	if (CC) {
		CC.busy = busy;
		ccButtons();
	}
}

function ccSetError(inputId, message) {
	var input = document.getElementById(inputId);
	if (!input) {
		return;
	}
	var errorId = input.getAttribute('data-error');
	var described = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (id) {
		return id && id !== errorId;
	});
	if (message) {
		described.push(errorId);
		input.setAttribute('aria-invalid', 'true');
	} else {
		input.removeAttribute('aria-invalid');
	}
	if (described.length) {
		input.setAttribute('aria-describedby', described.join(' '));
	} else {
		input.removeAttribute('aria-describedby');
	}
	$('#' + errorId).prop('hidden', !message).find('.cc-error__text').text(message || '');
}

function ccShowItem() {
	ccStopTimer();
	ccStopOtpListener();
	CC.item = CC.items[CC.index];
	CC.step = 'choose';
	CC.action = '';
	CC.sent = null;
	var channel = CC_CHANNELS[CC.item.channel];
	ccRender(channel.icon, channel.check, ccChooseBody(CC.item, CC.manual), ccChooseFooter(CC.item, CC.manual));
}

function ccContinue() {
	var action = $('#ccBody input[name="ccAction"]:checked').val();
	if (!action) {
		ccAlert('Choose one of the options to continue.');
		return;
	}
	var item = CC.item;
	var channel = CC_CHANNELS[item.channel];
	CC.action = action;
	CC.sent = null;
	if (action === 'NO_WHATSAPP') {
		CC.step = 'nowhatsapp';
		ccRender('fa-ban', 'Stop WhatsApp messages?', ccNoWhatsappBody(item), ccNoWhatsappFooter());
		return;
	}
	var titles = {
		EMAIL: { CHANGE: 'Update your email', CONFIRM: 'Keep this email', ALTERNATE: 'Add another email' },
		MOBILE: { CHANGE: 'Update your mobile number', CONFIRM: 'Confirm your mobile number' },
		WHATSAPP: { CHANGE: 'Give your WhatsApp number', CONFIRM: 'Confirm your WhatsApp number' }
	};
	var icons = { CHANGE: 'fa-pencil', CONFIRM: 'fa-check-circle-o', ALTERNATE: 'fa-plus-circle' };
	CC.step = 'code';
	ccRender(item.channel === 'WHATSAPP' ? channel.icon : icons[action], titles[item.channel][action], ccCodeBody(item, action), ccCodeFooter(item, CC.manual));
}

/* The ISD code goes back in the form the server gave it ("+91" or "91"). */
function ccIsdOut(digits) {
	var given = CC.item.isdCode === null || CC.item.isdCode === undefined ? '' : String(CC.item.isdCode);
	return (given && given.charAt(0) !== '+') ? digits : '+' + digits;
}

/* What the code will be sent to: null (with the message shown, when show is set) if it is not usable yet. */
function ccValidateValue(show) {
	var item = CC.item;
	if (CC.action === 'CONFIRM') {
		return { value: item.value, isdCode: item.isdCode === undefined ? null : item.isdCode };
	}
	var raw = $.trim($('#ccValue').val() || '');
	var message = '';
	var result = null;
	if (item.channel === 'EMAIL') {
		if (!raw) {
			message = 'Enter the email address.';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw)) {
			message = 'Enter an email address in the format name@example.com.';
		} else if (raw.toLowerCase() === String(item.value || '').toLowerCase()) {
			message = CC.action === 'ALTERNATE' ? 'This is your current address. Enter a different one.'
				: 'This is the address that is not working. Enter a different one, or go back and choose "It is correct".';
		} else {
			result = { value: raw, isdCode: null };
		}
	} else {
		var isd = String($('#ccIsd').val() || '').replace(/\D/g, '');
		var number = raw.replace(/[\s\-().]/g, '');
		if (!isd) {
			message = 'Choose the country code.';
		} else if (!number) {
			message = 'Enter the number.';
		} else if (!/^\d{6,15}$/.test(number)) {
			message = 'Enter only the digits of the number, without the country code (6 to 15 digits).';
		} else {
			result = { value: number, isdCode: ccIsdOut(isd) };
		}
	}
	if (show) {
		ccSetError('ccValue', message);
	}
	return result;
}

/* The value was changed after a code went out: that code is for the old value, so a new one is needed. */
function ccValueEdited() {
	if (!CC || !CC.sent || CC.action === 'CONFIRM') {
		return;
	}
	var now = ccValidateValue(false);
	if (now && now.value === CC.sent.value && String(now.isdCode) === String(CC.sent.isdCode)) {
		return;
	}
	CC.sent = null;
	ccStopOtpListener();
	$('#ccCodeGroup').prop('hidden', true);
	$('#ccCode').val('');
	$('#ccSent').text('');
	ccButtons();
}

function ccSendCode() {
	if (!CC || CC.busy || CC.step !== 'code') {
		return;
	}
	var target = ccValidateValue(true);
	if (!target) {
		$('#ccValue').trigger('focus');
		return;
	}
	var same = CC.sent && CC.sent.value === target.value && String(CC.sent.isdCode) === String(target.isdCode);
	if (same && CC.wait > 0) {
		ccAlert('You can ask for a new code in ' + CC.wait + ' second' + (CC.wait === 1 ? '' : 's') + '.');
		return;
	}
	var item = CC.item;
	ccAlert('');
	ccBusy(true);
	ccPost('send-code', { reviewId: item.id, action: CC.action, value: target.value, isdCode: target.isdCode }, function (data, message) {
		if (!CC || CC.item !== item) {
			return;
		}
		ccBusy(false);
		if (!data) {
			// Refused (the "too many codes" limit included) or failed: a mandatory problem must not block the dashboard.
			ccAllowCloseNow(item);
			ccAlert(message);
			return;
		}
		CC.sent = target;
		var how = { EMAIL: 'by email', MOBILE: 'by SMS', SMS: 'by SMS', WHATSAPP: 'on WhatsApp' }[data.channel || item.channel] || '';
		var sentTo = data.sentTo || ccDisplayValue({ channel: item.channel, value: target.value, isdCode: target.isdCode });
		$('#ccSent').text('We sent a 6-digit code ' + how + ' to ' + sentTo + '.');
		$('#ccCodeGroup').prop('hidden', false);
		$('#ccCode').val('').trigger('focus');
		ccSetError('ccCode', '');
		ccStartTimer();
		ccButtons();
		ccStartOtpListener((data.channel || item.channel) !== 'EMAIL' && (data.channel || item.channel) !== 'WHATSAPP');
	});
}

/* "Resend code" is off for 30 seconds after each code. */
function ccStartTimer() {
	ccStopTimer();
	CC.wait = CC_RESEND_SECONDS;
	var tick = function () {
		if (!CC) {
			return;
		}
		$('#ccResendWait').text(CC.wait > 0 ? '(in ' + CC.wait + 's)' : '');
		if (CC.wait <= 0) {
			ccStopTimer();
			ccButtons();
		}
	};
	tick();
	CC.timer = window.setInterval(function () {
		if (CC) {
			CC.wait = Math.max(0, CC.wait - 1);
		}
		tick();
	}, 1000);
}

function ccStopTimer() {
	if (CC && CC.timer) {
		window.clearInterval(CC.timer);
		CC.timer = null;
	}
	if (CC) {
		CC.wait = 0;
	}
}

/* Where the browser can read the SMS itself (WebOTP), the code is filled in and checked for the user. */
function ccStartOtpListener(bySms) {
	ccStopOtpListener();
	if (!bySms || !('OTPCredential' in window) || !navigator.credentials || typeof AbortController === 'undefined') {
		return;
	}
	var controller = new AbortController();
	CC.otp = controller;
	navigator.credentials.get({ otp: { transport: ['sms'] }, signal: controller.signal }).then(function (otp) {
		if (!otp || !otp.code || !CC || CC.otp !== controller || CC.step !== 'code') {
			return;
		}
		CC.otp = null;
		$('#ccCode').val(String(otp.code).replace(/\D/g, '').slice(0, 6));
		ccVerify();
	}).catch(function () {
		// Stopped (verify, resend, back, close) or not allowed: the user types the code.
	});
}

function ccStopOtpListener() {
	if (CC && CC.otp) {
		try {
			CC.otp.abort();
		} catch (e) { /* already finished */ }
		CC.otp = null;
	}
}

function ccVerify() {
	if (!CC || CC.busy || CC.step !== 'code') {
		return;
	}
	if (!CC.sent) {
		ccAlert('Send the code first, then enter it here.');
		return;
	}
	var code = $.trim($('#ccCode').val() || '');
	if (!/^\d{6}$/.test(code)) {
		ccSetError('ccCode', code ? 'The code has 6 digits. Check it and try again.' : 'Enter the 6-digit code we sent you.');
		$('#ccCode').trigger('focus');
		return;
	}
	ccSetError('ccCode', '');
	ccStopOtpListener();
	var item = CC.item;
	var action = CC.action;
	var sent = CC.sent;
	var alsoMobile = $('#ccAlsoMobile').is(':checked');
	ccAlert('');
	ccBusy(true);
	ccPost('verify', { reviewId: item.id, action: action, value: sent.value, isdCode: sent.isdCode, code: code, alsoMobile: alsoMobile },
		function (data, message, refused) {
			if (!CC || CC.item !== item) {
				return;
			}
			ccBusy(false);
			if (!data) {
				if (!refused) {
					// The code could not be checked (server error, no answer): not the user's doing, so they are not held here.
					ccAllowCloseNow(item);
				}
				ccAlert(message);
				$('#ccCode').trigger('focus').trigger('select');
				return;
			}
			var shown = ccDisplayValue({ channel: item.channel, value: sent.value, isdCode: sent.isdCode });
			var done = {
				EMAIL: { CHANGE: ['Email updated', 'School emails now go to ' + shown + '.'],
					CONFIRM: ['Email confirmed', 'We\'ll send school emails to ' + shown + ' again.'],
					ALTERNATE: ['Email added', 'School emails now also go to ' + shown + '.'] },
				MOBILE: { CHANGE: ['Mobile number updated', 'Text messages from the school now go to ' + shown + '.'],
					CONFIRM: ['Mobile number confirmed', 'We\'ll keep sending text messages to ' + shown + '.'] },
				WHATSAPP: { CHANGE: ['WhatsApp number saved', 'WhatsApp messages from the school now go to ' + shown
						+ (alsoMobile ? '. It is also your mobile number now.' : '.')],
					CONFIRM: ['WhatsApp number confirmed', 'We\'ll keep sending WhatsApp messages to ' + shown + '.'] }
			}[item.channel][action];
			ccShowDone(done[0], done[1]);
		});
}

function ccNoWhatsapp() {
	var item = CC.item;
	ccAlert('');
	ccBusy(true);
	ccPost('no-whatsapp', { reviewId: item.id }, function (data, message) {
		if (!CC || CC.item !== item) {
			return;
		}
		ccBusy(false);
		if (!data) {
			ccAlert(message);
			return;
		}
		ccShowDone('WhatsApp messages stopped', 'The school will reach you by email and SMS instead.');
	});
}

function ccShowDone(title, text) {
	ccStopTimer();
	CC.step = 'done';
	CC.changed = true;
	ccRender('fa-check', 'Done', ccDoneBody(title, text), ccDoneFooter(CC.index + 1 < CC.items.length));
}

/* The next problem, or the end of the popup. */
function ccNext() {
	if (CC.index + 1 < CC.items.length) {
		CC.index++;
		ccShowItem();
		return;
	}
	ccClose();
}

function ccLater() {
	if (!CC || CC.busy || CC.manual || CC.item.mandatory) {
		return;
	}
	var item = CC.item;
	ccAlert('');
	ccBusy(true);
	ccPost('later', { reviewId: item.id }, function (data, message, refused, refusal) {
		if (!CC || CC.item !== item) {
			return;
		}
		ccBusy(false);
		if (!data && refused && refusal.mandatory === true) {
			// The skips are used up: say so and keep it open (only this refusal makes the problem mandatory).
			item.mandatory = true;
			item.laterLeft = 0;
			ccShowItem();
			ccAlert(message);
			return;
		}
		if (!data && refused) {
			// Any other refusal (already answered, switched off, signed out…): say why and leave this problem,
			// so the user goes on to the next one or back to the dashboard.
			if (message && typeof showMessageTheme2 === 'function') {
				showMessageTheme2(0, message);
			}
			ccNext();
			return;
		}
		if (!data) {
			// The server could not be reached: the user is not held here, the popup comes back next time.
			ccClose();
			return;
		}
		ccNext();
	});
}

/* ---------- profile page ---------- */

/* "Fix now": the popup for one problem. onClose(changed) runs when it closes. */
function openContactCheckReview(reviewId, onClose) {
	if (CC) {
		return;
	}
	ccPost('pending', {}, function (data, message) {
		if (!data) {
			// Refused or failed: say why, and read the card again so it shows how things stand now.
			showMessageTheme2(0, message);
			if (onClose) {
				onClose(false);
			}
			return;
		}
		var item = ccProblems($.extend({}, data, { enabled: true })).filter(function (i) {
			return String(i.id) === String(reviewId);
		})[0];
		if (!item) {
			showMessageTheme2(1, 'This contact detail no longer needs fixing.');
			if (onClose) {
				onClose(true);
			}
			return;
		}
		openContactCheckPopup([item], { manual: true, onClose: onClose });
	});
}

function mountContactCheckSummary(selector) {
	var $mount = $(selector);
	if (!$mount.length || !ccIsContactCheckRole()) {
		return;
	}
	ensureContactCheckStyles();
	$mount.html(getContactCheckSummaryShell());
	$mount.off('click.contactCheck').on('click.contactCheck', '[data-cc-review]', function () {
		openContactCheckReview(this.getAttribute('data-cc-review'), function () {
			loadContactCheckSummary();
		});
	}).on('click.contactCheck', '[data-cc-app]', function () {
		// The app's own install popup (appInstallNotification.js), opened the way its "Get App" button does.
		if (typeof openAppInstallNotificationManually === 'function') {
			openAppInstallNotificationManually('button');
		} else {
			showMessageTheme2(0, 'The app download screen could not be opened. Please refresh the page and try again.');
		}
	});
	loadContactCheckSummary();
}

/* The card stays hidden when the server has nothing to show (feature off, the call failed or timed out, no
   contacts) and when no contact has a problem or anything to act on: it is never empty and never a list of
   details that need nothing from the user. */
function loadContactCheckSummary() {
	ccPost('summary', {}, function (data) {
		var contacts = (data && $.isArray(data.contacts) ? data.contacts : []).filter(function (c) {
			return c && c.channel;
		});
		var show = contacts.some(ccSummaryNeedsAttention);
		$('#contactCheckSummaryRows').html(show ? contacts.map(ccSummaryRow).join('') : '');
		$('#contactCheckSummary').prop('hidden', !show);
	}, CC_LOAD_TIMEOUT);
}
