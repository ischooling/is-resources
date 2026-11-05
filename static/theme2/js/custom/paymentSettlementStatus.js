/* Payment return page (CommonPaymentResponse.jsp), "confirming" state.
   Rendered when the server could not yet confirm a Stripe/Airwallex return
   (model attribute paymentConfirming=true). Polls payment-settlement-status every 4 s
   for about 60 s:
     SETTLED   -> reload (the server now renders the normal thank-you page)
     NOT_PAID  -> failure state with the server's message
     DUPLICATE -> the server's message (the second payment will be refunded)
     UNDER_REVIEW -> paid, but held for the school to check (no "try again")
     CONFIRMING or a failed poll -> keep polling; after ~60 s show the "we'll email" message. */
var PAYMENT_SETTLEMENT_POLL_MS = 4000;
var PAYMENT_SETTLEMENT_MAX_POLLS = 15;

function getPaymentSettlementStatusUrl($block) {
	var url = $block.data('statusUrl') || '';
	var ref = $block.data('settlementRef') || '';
	if (!url && typeof getURLForHTML === 'function') {
		url = getURLForHTML('common', 'payment-settlement-status');
	}
	if (url && ref && url.indexOf('ref=') === -1) {
		url += (url.indexOf('?') === -1 ? '?' : '&') + 'ref=' + encodeURIComponent(ref);
	}
	return url;
}

function showPaymentSettlementOutcome(iconClass, title, message, hint) {
	$('#paymentSettlementIcon').html(`<i class="fa ${iconClass}" aria-hidden="true"></i>`);
	$('#paymentSettlementTitle').text(title);
	$('#paymentSettlementMessage').text(message);
	$('#paymentSettlementHint').text(hint || '');
}

function startPaymentSettlementPolling() {
	var $block = $('#paymentSettlementConfirming');
	if ($block.length === 0) {
		return;
	}
	var url = getPaymentSettlementStatusUrl($block);
	var timeoutMessage = "We'll email your receipt as soon as the payment gateway confirms. You don't need to pay again.";
	var polls = 0;
	function timedOut() {
		showPaymentSettlementOutcome('fa-envelope-o payment-settlement-icon-info', 'Your payment is still being confirmed', timeoutMessage, '');
	}
	function poll() {
		if (!url) {
			timedOut();
			return;
		}
		polls++;
		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'json',
			cache: false,
			global: false,
			timeout: 10000,
			success: function (resp) {
				var code = resp && resp.statusCode ? resp.statusCode : '';
				if (code === 'SETTLED') {
					window.location.reload();
					return;
				}
				if (code === 'NOT_PAID') {
					showPaymentSettlementOutcome('fa-times payment-settlement-icon-err', 'Payment not received',
						resp.message || "The payment gateway hasn't received this payment.",
						'You can go back to your fee page and try the payment again.');
					return;
				}
				if (code === 'UNDER_REVIEW') {
					showPaymentSettlementOutcome('fa-info payment-settlement-icon-info', 'Your payment is being checked',
						resp.message || "We received your payment, but the school needs to check it before it's applied. Please don't pay again.", '');
					return;
				}
				if (code === 'DUPLICATE') {
					showPaymentSettlementOutcome('fa-check payment-settlement-icon-ok', 'This fee is already paid',
						resp.message || "This fee was already paid, so this second payment will be refunded. You don't need to do anything.", '');
					return;
				}
				next();
			},
			error: function () {
				// A failed poll is not a failed payment: keep trying until the time limit.
				next();
			}
		});
	}
	function next() {
		if (polls >= PAYMENT_SETTLEMENT_MAX_POLLS) {
			timedOut();
		} else {
			setTimeout(poll, PAYMENT_SETTLEMENT_POLL_MS);
		}
	}
	setTimeout(poll, PAYMENT_SETTLEMENT_POLL_MS);
}

$(document).ready(startPaymentSettlementPolling);
