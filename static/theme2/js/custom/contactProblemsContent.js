/*
 * Contact problems (admin, Communications): markup and styles. Behaviour is in contactProblems.js.
 * One row per contact detail the school cannot reach: email, mobile (SMS), WhatsApp, or no app installed.
 * Table and paging follow the Email Logs page. Colours come from the school theme variables.
 */

var CP_CHANNELS = {
	EMAIL: ['fa-envelope-o', 'Email', 'email'],
	MOBILE: ['fa-mobile', 'Mobile', 'mobile'],
	WHATSAPP: ['fa-whatsapp', 'WhatsApp', 'WhatsApp'],
	APP: ['fa-bell-o', 'App', 'no app']
};
/* Request status as the server filters it. */
var CP_STATUS_FILTERS = [['', 'Any request status'], ['NOT_ASKED', 'Not asked'], ['WAITING', 'Waiting for user'], ['FIXED', 'Fixed']];

/* The problem codes of ContactProblems.java (and the app row) in a few words; the table shows these, not the codes. */
var CP_PROBLEM_LABELS = {
	EMAIL_BOUNCED: 'Email bounced',
	EMAIL_INVALID: 'Email address not valid',
	NOT_ON_WHATSAPP: 'Not on WhatsApp',
	ASKED_BY_ADMIN: 'Asked by the school',
	APP_NOT_INSTALLED: 'App not installed',
	MOBILE_NO_DIGITS: 'Number has no digits',
	MOBILE_NO_COUNTRY_CODE: 'No country code',
	MOBILE_BAD_COUNTRY_CODE: 'Unknown country code',
	MOBILE_UNKNOWN_COUNTRY_CODE: 'Unknown country code',
	MOBILE_TOO_SHORT: 'Number too short',
	MOBILE_TOO_LONG: 'Number too long',
	MOBILE_BAD_LENGTH_FOR_INDIA: 'Indian number needs 10 digits',
	MOBILE_ONE_DIGIT_REPEATED: 'One digit repeated'
};

function getContactProblemsContent(title) {
	var chips = Object.keys(CP_CHANNELS).map(function (code) {
		var c = CP_CHANNELS[code];
		return '<button type="button" class="cp-chip" data-cp-channel="' + code + '" aria-pressed="false">'
			+ '<i class="fa ' + c[0] + '" aria-hidden="true"></i> <strong class="cp-num" id="cpCount' + code + '">&ndash;</strong> ' + c[2] + '</button>';
	}).join('');
	var channels = '<option value="">All channels</option>' + Object.keys(CP_CHANNELS).map(function (code) {
		return '<option value="' + code + '">' + CP_CHANNELS[code][1] + '</option>';
	}).join('');
	var statuses = CP_STATUS_FILTERS.map(function (s) {
		return '<option value="' + s[0] + '">' + s[1] + '</option>';
	}).join('');
	return '<div id="contactProblemsScreen" class="cp-screen">'
		+ '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper"><div class="page-title-heading">'
		+ '<div class="page-title-icon"><i class="fa fa-address-book-o text-primary" aria-hidden="true"></i></div>'
		+ '<div><h1 class="cp-title">' + title + '</h1>'
		+ '<div class="page-title-subheading">Students, parents and teachers the school cannot reach by email, SMS, WhatsApp or the app. '
		+ 'Ask them to correct the detail; they see a popup on their dashboard.</div></div>'
		+ '</div></div></div>'

		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '<div class="cp-chips mb-3" role="group" aria-label="Problems by channel">' + chips + '</div>'
		+ '<form id="cpForm" class="form-row align-items-end" novalidate>'
		+ '<div class="form-group col-lg-3 col-md-4"><label for="cpChannel">Channel</label><select id="cpChannel" class="form-control">' + channels + '</select></div>'
		+ '<div class="form-group col-lg-3 col-md-4"><label for="cpStatus">Request status</label><select id="cpStatus" class="form-control">' + statuses + '</select></div>'
		+ '<div class="form-group col-lg-4 col-md-4"><label for="cpSearch">Search</label>'
		+ '<input type="search" id="cpSearch" class="form-control" autocomplete="off" placeholder="Name, email or number"></div>'
		+ '<div class="form-group col-lg-2 col-md-12"><button type="submit" class="btn btn-primary btn-block" id="cpShow">Show</button></div>'
		+ '</form>'
		+ '</div></div>'

		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '<p id="cpSummary" class="mb-2" aria-live="polite"></p>'
		+ '<div class="cp-table-wrap" role="region" aria-labelledby="cpCaption" tabindex="0">'
		+ '<table class="cp-table"><caption id="cpCaption" class="sr-only">Contact problems</caption>'
		+ '<thead><tr><th scope="col">Channel</th><th scope="col">Contact</th><th scope="col">Account</th><th scope="col">Problem</th>'
		+ '<th scope="col">Request</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>'
		+ '<tbody id="cpRows"></tbody></table></div>'
		+ '<nav class="d-flex justify-content-between align-items-center mt-3" aria-label="Contact problem pages">'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="cpPrev" disabled>&larr; Previous</button>'
		+ '<span id="cpPage"></span>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="cpNext" disabled>Next &rarr;</button>'
		+ '</nav>'
		+ '</div></div>'
		+ '</div>';
}

function ensureContactProblemsStyles() {
	if (document.getElementById('contactProblemsStyles')) {
		return;
	}
	var css = ''
		+ '.cp-screen{container-type:inline-size}'
		+ '.cp-title{font-size:inherit;font-weight:inherit;margin:0}'
		+ '.cp-chips{display:flex;flex-wrap:wrap;gap:.5rem}'
		+ '.cp-chip{border:1px solid var(--pc);color:var(--pc);background:var(--white);border-radius:999px;padding:.3rem .9rem;font-size:13px;cursor:pointer}'
		+ '.cp-chip[aria-pressed="true"],.cp-chip:hover,.cp-chip:focus-visible{background:var(--pc);color:var(--white)}'
		+ '.cp-num{font-variant-numeric:tabular-nums}'
		+ '.cp-table-wrap{overflow:auto;max-inline-size:100%;max-block-size:min(70vh,900px);container-type:inline-size}'
		+ '.cp-table-wrap:focus-visible{outline:2px solid var(--pc);outline-offset:2px}'
		+ '.cp-table{border-collapse:separate;border-spacing:0;inline-size:100%;font-size:12px}'
		+ '.cp-table thead th{position:sticky;inset-block-start:0;z-index:1;background:var(--pc);color:var(--white);font-weight:600;white-space:nowrap}'
		+ '.cp-table th,.cp-table td{padding:.5rem .6rem;border-block-end:1px solid var(--light);vertical-align:top;text-align:start}'
		+ '.cp-table tbody tr:hover{background:var(--plc)}'
		+ '.cp-muted{color:var(--gray)}'
		+ '.cp-addr{overflow-wrap:anywhere}'
		+ '.cp-nowrap{white-space:nowrap}'
		+ '.cp-badge{display:inline-block;padding:.1rem .45rem;border-radius:4px;font-size:11px;font-weight:600;line-height:1.5;white-space:nowrap;background:var(--gray);color:var(--white)}'
		+ '.cp-badge--ok{background:var(--success)}'
		+ '.cp-badge--bad{background:var(--danger)}'
		+ '.cp-badge--warn{background:var(--warning);color:var(--gray-dark)}'
		+ '.cp-badge--info{background:var(--pc)}'
		+ '.cp-badge--role{background:var(--light);color:var(--gray-dark);font-weight:500}'
		+ '@container (width < 760px){'
		+ '.cp-table,.cp-table thead,.cp-table tbody,.cp-table tr,.cp-table th,.cp-table td{display:block}'
		+ '.cp-table thead{display:none}'
		+ '.cp-table tr{margin-block-end:1rem;border:1px solid var(--light);border-radius:6px;padding:.25rem}'
		+ '.cp-table td{border:0}'
		+ '.cp-table td[data-label]::before{content:attr(data-label) ": ";font-weight:600;color:var(--gray)}'
		+ '}';
	$('head').append('<style id="contactProblemsStyles">' + css + '</style>');
}
