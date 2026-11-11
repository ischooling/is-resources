/*
 * Communications > Email Logs: markup and styles.
 * Behaviour is in emailLogs.js. Colours come from the school theme variables (--pc, --plc,
 * --sc, --success, --danger, --warning, --gray), never fixed values.
 */

var EMAIL_LOG_DELIVERY_FILTERS = [
	['DELIVERED', 'Delivered'], ['PROCESSED', 'Accepted by SendGrid'], ['DEFERRED', 'Delayed'],
	['BOUNCED', 'Bounced'], ['BLOCKED', 'Blocked'], ['DROPPED', 'Dropped'], ['OPTED_OUT', 'Not sent (switched off by the person or unsubscribed by the school)'],
	['NO_EVENT', 'No report yet'], ['SPAM_REPORT', 'Marked as spam'], ['UNSUBSCRIBED', 'Unsubscribed']
];
var EMAIL_LOG_SEND_FILTERS = [
	['SUCCESS', 'Sent'], ['FAILED', 'Refused by provider'], ['EXCEPTION', 'Error while sending'],
	['CAPTURED', 'Not sent (captured)'], ['QUEUED', 'Queued'], ['INITIATE', 'Not sent (test mode)'],
	['OPTED_OUT', 'Not sent (everyone switched it off or is unsubscribed)']
];
var EMAIL_LOG_ROLE_FILTERS = [
	['STUDENT', 'Student'], ['PARENT', 'Parent'], ['TEACHER', 'Teacher'], ['STAFF', 'Staff'], ['LEAD', 'Lead'],
	['UNKNOWN', 'Not matched to an account']
];
/* STUDENT_STANDARD.REGISTRATION_TYPE codes (EmailLogQueryBuilder.ENROLMENT_TYPES). */
var EMAIL_LOG_ENROLMENT_FILTERS = [
	['ONE_TO_ONE', 'One to one'], ['ONE_TO_ONE_FLEX', 'One to one (flex)'], ['BATCH', 'Batch'], ['SCHOLARSHIP', 'Scholarship'],
	['SSP', 'SSP'], ['CWS', 'CWS'], ['DUAL_DIPLOMA', 'Dual diploma']
];
var EMAIL_LOG_PROVIDER_FILTERS = [['SENDGRID', 'SendGrid'], ['BREVO', 'Brevo'], ['OTHER', 'Other / not sent']];

function emailLogCheckboxes(group, options) {
	var html = '<div class="el-checks">';
	options.forEach(function (option) {
		var id = 'el_' + group + '_' + option[0];
		html += '<div class="custom-control custom-checkbox">'
			+ '<input type="checkbox" class="custom-control-input" id="' + id + '" name="' + group + '" value="' + option[0] + '">'
			+ '<label class="custom-control-label" for="' + id + '">' + option[1] + '</label>'
			+ '</div>';
	});
	return html + '</div>';
}

function getEmailLogsContent(title) {
	return '<div id="emailLogsScreen" class="el-screen">'
		+ '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper"><div class="page-title-heading">'
		+ '<div class="page-title-icon"><i class="fas fa-envelope-open-text text-primary" aria-hidden="true"></i></div>'
		+ '<div><h1 class="el-title">' + title + '</h1>'
		+ '<div class="page-title-subheading">Every email the school sent, with delivery, opens and clicks reported by SendGrid. Times are IST.</div></div>'
		+ '</div><div class="page-title-actions">'
		+ '<div class="d-flex flex-wrap" style="gap:.5rem">'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elDeliverabilityOpen"><i class="fa fa-line-chart" aria-hidden="true"></i>&nbsp;Email analytics</button>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elPersonOpen"><i class="fa fa-user" aria-hidden="true"></i>&nbsp;Person</button>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elProblemsOpen"><i class="fa fa-exclamation-triangle" aria-hidden="true"></i>&nbsp;Problem addresses</button>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elUnsubOpen"><i class="fa fa-ban" aria-hidden="true"></i>&nbsp;Unsubscribed addresses</button>'
		+ '</div>'
		+ '</div></div></div>'

		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '<form id="emailLogForm" novalidate>'
		// Super admins only (filled by loadEmailLogOptions): which school's emails the whole screen shows.
		+ '<div class="form-row" id="elSchoolRow" hidden>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elSchool">School</label>'
		+ '<select id="elSchool" class="form-control" aria-describedby="elSchoolHelp"></select>'
		+ '<small id="elSchoolHelp" class="form-text text-muted">As a super admin you can look at another school\'s emails. Every list and panel on this screen follows this choice.</small></div>'
		+ '</div>'
		+ '<div class="form-row">'
		+ '<div class="form-group col-lg-4 col-md-6">'
		+ '<label for="elRecipient">Recipient</label>'
		+ '<input type="search" id="elRecipient" class="form-control" autocomplete="off" aria-describedby="elRecipientHelp">'
		+ '<small id="elRecipientHelp" class="form-text text-muted">Email address, name, mobile number or account ID. Names and numbers find emails sent since tracking began.</small>'
		+ '</div>'
		+ '<div class="form-group col-lg-2 col-md-6">'
		+ '<label for="elSentPreset">Sent</label>'
		+ '<select id="elSentPreset" class="form-control">'
		+ '<option value="TODAY">Today</option><option value="YESTERDAY">Yesterday</option>'
		+ '<option value="LAST_7">Last 7 days</option><option value="LAST_30">Last 30 days</option>'
		+ '<option value="CUSTOM">Custom dates</option>'
		+ '</select>'
		+ '</div>'
		+ '<div class="form-group col-lg-2 col-md-3 el-custom-date" hidden>'
		+ '<label for="elSentFrom">From</label><input type="date" id="elSentFrom" class="form-control">'
		+ '</div>'
		+ '<div class="form-group col-lg-2 col-md-3 el-custom-date" hidden>'
		+ '<label for="elSentTo">To</label><input type="date" id="elSentTo" class="form-control">'
		+ '</div>'
		+ '<div class="form-group col-lg-4 col-md-6">'
		+ '<label for="elSubject">Subject contains</label><input type="search" id="elSubject" class="form-control" autocomplete="off">'
		+ '</div>'
		+ '</div>'

		+ '<div class="el-quick mb-3" role="group" aria-label="Quick filters">'
		+ '<span class="el-quick__label">Quick filters:</span>'
		+ '<button type="button" class="el-chip" data-preset="bounced">Bounced or blocked this week</button>'
		+ '<button type="button" class="el-chip" data-preset="failed">Failed to send today</button>'
		+ '<button type="button" class="el-chip" data-preset="notOpened">Not opened this week</button>'
		+ '<button type="button" class="el-chip" data-preset="feesNotOpened">Fee emails not opened (30 days)</button>'
		+ '<button type="button" class="el-chip" data-preset="spam">Spam reports (30 days)</button>'
		+ '</div>'

		+ '<details class="el-more mb-3" id="elMoreFilters"><summary>More filters</summary>'
		+ '<div class="form-row mt-3">'
		+ '<fieldset class="form-group col-lg-6"><legend class="el-legend">Recipient type</legend>' + emailLogCheckboxes('role', EMAIL_LOG_ROLE_FILTERS) + '</fieldset>'
		+ '<fieldset class="form-group col-lg-6"><legend class="el-legend">Provider</legend>' + emailLogCheckboxes('provider', EMAIL_LOG_PROVIDER_FILTERS) + '</fieldset>'
		+ '<fieldset class="form-group col-12"><legend class="el-legend">Delivery (per recipient)</legend>' + emailLogCheckboxes('delivery', EMAIL_LOG_DELIVERY_FILTERS) + '</fieldset>'
		+ '<fieldset class="form-group col-12"><legend class="el-legend">Send status</legend>' + emailLogCheckboxes('send', EMAIL_LOG_SEND_FILTERS) + '</fieldset>'
		+ '</div>'
		+ '<fieldset class="form-row" aria-describedby="elEnrolmentHelp"><legend class="el-legend col-12">Recipient\'s current enrolment</legend>'
		+ '<small id="elEnrolmentHelp" class="form-text text-muted col-12 mt-n1 mb-2">A student\'s own enrolment, or for a parent the child the email was matched to. '
		+ 'It uses today\'s enrolment, not the one when the email was sent. Teachers and staff have none, so these leave them out.</small>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elGrades">Grade</label><select id="elGrades" class="form-control" multiple></select></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elBatches">Batch</label><select id="elBatches" class="form-control" multiple></select></div>'
		+ '<div class="form-group col-lg-4 col-12"><span class="el-legend d-block" id="elEnrolmentTypeLabel">Enrolment type</span>'
		+ '<div role="group" aria-labelledby="elEnrolmentTypeLabel">' + emailLogCheckboxes('enrolment', EMAIL_LOG_ENROLMENT_FILTERS) + '</div></div>'
		+ '</fieldset>'
		+ '<div class="form-row">'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elOpened">Opened</label>'
		+ '<select id="elOpened" class="form-control"><option value="ANY">Any</option><option value="HUMAN">Opened by a person</option>'
		+ '<option value="AUTO_ONLY">Only auto-opened by a mail app</option><option value="NONE">Not opened</option></select></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elClicked">Clicked a link</label>'
		+ '<select id="elClicked" class="form-control"><option value="ANY">Any</option><option value="YES">Yes</option><option value="NO">No</option></select></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elMinOpens">At least this many opens</label><input type="number" min="1" step="1" id="elMinOpens" class="form-control" inputmode="numeric"></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elMinClicks">At least this many clicks</label><input type="number" min="1" step="1" id="elMinClicks" class="form-control" inputmode="numeric"></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elCategories">Category</label><select id="elCategories" class="form-control" multiple></select></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elEmailType">Email type</label><input type="search" id="elEmailType" class="form-control" list="elEmailTypeList" autocomplete="off"><datalist id="elEmailTypeList"></datalist></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elAttachments">Attachments</label>'
		+ '<select id="elAttachments" class="form-control"><option value="">Any</option><option value="Y">With attachments</option><option value="N">Without attachments</option></select></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elBody">Email text contains</label><input type="search" id="elBody" class="form-control" autocomplete="off" aria-describedby="elBodyHelp">'
		+ '<small id="elBodyHelp" class="form-text text-muted">Needs a sent range of 31 days or less.</small></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elBounceReason">Bounce or block reason contains</label><input type="search" id="elBounceReason" class="form-control" autocomplete="off"></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elClickedLink">Clicked link contains</label><input type="search" id="elClickedLink" class="form-control" autocomplete="off"></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elSentBy">Sent by</label>'
		+ '<input type="search" id="elSentBy" class="form-control" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-describedby="elSentByHelp">'
		+ '<small id="elSentByHelp" class="form-text text-muted">Name, email or account ID of the person whose action sent it. '
		+ 'Recorded only for emails sent since this was released; older and automatic emails have no sender.</small></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elEventFrom">Events from</label><input type="date" id="elEventFrom" class="form-control" aria-describedby="elEventHelp"></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elEventTo">Events to</label><input type="date" id="elEventTo" class="form-control" aria-describedby="elEventHelp"></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elSort">Order</label>'
		+ '<select id="elSort" class="form-control"><option value="NEWEST">Newest first</option><option value="OLDEST">Oldest first</option></select></div>'
		+ '<div class="form-group col-lg-3 col-md-6"><label for="elPageSize">Per page</label>'
		+ '<select id="elPageSize" class="form-control"><option value="25">25</option><option value="50">50</option><option value="100">100</option></select></div>'
		+ '<small id="elEventHelp" class="form-text text-muted col-12 mt-n2 mb-2">Events from / to: for example, emails whose bounce happened last week (pick Bounced above).</small>'
		+ '<div class="form-group col-12"><div class="custom-control custom-checkbox">'
		+ '<input type="checkbox" class="custom-control-input" id="elIncludeArchived" aria-describedby="elArchivedHelp">'
		+ '<label class="custom-control-label" for="elIncludeArchived">Include archived emails</label></div>'
		+ '<small id="elArchivedHelp" class="form-text text-muted">Older emails the nightly archive moved out of the live tables. Needs a sent range of 31 days or less.</small></div>'
		+ '</div>'
		+ '<div class="form-row align-items-end">'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elSaved">Saved filters (this browser)</label><select id="elSaved" class="form-control"><option value="">Choose…</option></select></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><button type="button" class="btn btn-outline-primary mr-2" id="elApplySaved">Apply</button><button type="button" class="btn btn-outline-danger" id="elDeleteSaved">Delete</button></div>'
		+ '<div class="form-group col-lg-4 col-md-6"><label for="elSaveName">Save these filters as</label>'
		+ '<div class="input-group"><input type="text" id="elSaveName" class="form-control" maxlength="40"><div class="input-group-append"><button type="button" class="btn btn-outline-primary" id="elSaveFilters">Save</button></div></div></div>'
		+ '</div>'
		+ '</details>'

		+ '<div class="d-flex flex-wrap justify-content-end">'
		+ '<button type="button" class="btn btn-outline-secondary mr-2" id="elReset"><i class="fa fa-undo" aria-hidden="true"></i>&nbsp;Reset</button>'
		+ '<button type="button" class="btn btn-outline-primary mr-2" id="elExport"><i class="fa fa-file-excel-o" aria-hidden="true"></i>&nbsp;Export to Excel</button>'
		+ '<button type="submit" class="btn btn-primary" id="elSearch"><i class="fa fa-search" aria-hidden="true"></i>&nbsp;Search</button>'
		+ '</div>'
		+ '</form>'
		+ '</div></div>'

		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '<details class="el-more mb-3" id="elExports"><summary>Exports</summary>'
		+ '<p class="el-muted mt-2 mb-2">Your Excel files of searches, one row per recipient (up to 50,000 emails each). They are prepared in the background.</p>'
		+ '<ul class="list-unstyled mb-0" id="elExportList"></ul></details>'
		+ '<p id="elSummary" class="mb-2" aria-live="polite"></p>'
		+ '<div class="el-table-wrap" role="region" aria-labelledby="elCaption" tabindex="0">'
		+ '<table class="el-table" id="emailLogsTable">'
		+ '<caption id="elCaption" class="sr-only">Emails matching your filters</caption>'
		+ '<thead><tr><th scope="col">Sent</th><th scope="col">Email</th><th scope="col">Recipients</th><th scope="col">Send</th>'
		+ '<th scope="col">Delivery</th><th scope="col">Opened</th><th scope="col">Clicked</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>'
		+ '<tbody id="elRows"></tbody>'
		+ '</table>'
		+ '</div>'
		+ '<nav class="d-flex justify-content-between align-items-center mt-3" aria-label="Email log pages">'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elPrev" disabled>&larr; Previous</button>'
		+ '<span id="elPageInfo"></span>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elNext" disabled>Next &rarr;</button>'
		+ '</nav>'
		+ '</div></div>'

		+ emailLogDrawerContent()
		+ emailLogProblemsContent()
		+ emailLogDeliverabilityContent()
		+ emailLogPersonContent()
		+ emailLogUnsubscribedContent()
		+ emailLogUnsubscribeAskContent()
		+ '</div>';
}

/* Email analytics: headline numbers, three single-axis charts, and the tables behind them
   (by day, by email type with the "rarely opened" flag, by category, by provider). */
function emailLogDeliverabilityContent() {
	return '<dialog id="elDeliverability" class="el-drawer" closedby="any" aria-labelledby="elDeliverabilityTitle">'
		+ '<div class="el-drawer__head"><h2 id="elDeliverabilityTitle" class="el-drawer__title">Email analytics</h2>'
		+ '<button type="button" class="btn btn-sm btn-light ml-auto" id="elDeliverabilityClose">Close</button></div>'
		+ '<div class="el-drawer__body">'
		+ '<div class="d-flex flex-wrap align-items-end mb-3" style="gap:1rem">'
		+ '<div><label for="elDeliverabilityDays">Period</label><select id="elDeliverabilityDays" class="form-control">'
		+ '<option value="1" selected>Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option>'
		+ '<option value="90">Last 90 days</option></select></div>'
		+ '<p class="el-muted mb-1">Emails your school sent, by the day they were sent (IST). Rates use the addresses SendGrid has reported on; '
		+ 'archived emails are included.</p></div>'
		+ '<p id="elDeliverabilitySummary" aria-live="polite" class="mb-2"></p>'
		+ '<div id="elDeliverabilityAlerts"></div>'
		+ '<div id="elDeliverabilityTiles"></div>'
		+ '<h3>Emails sent per day</h3><div class="el-chart" id="elChartSent" role="img" aria-labelledby="elChartSentText"></div>'
		+ '<p class="sr-only" id="elChartSentText"></p>'
		+ '<h3>Bounced, blocked or dropped (% of reported addresses)</h3><div class="el-chart" id="elChartFailed" role="img" aria-labelledby="elChartFailedText"></div>'
		+ '<p class="sr-only" id="elChartFailedText"></p>'
		+ '<h3>Opened and clicked (% of delivered addresses)</h3><div class="el-chart" id="elChartEngaged" role="img" aria-labelledby="elChartEngagedText"></div>'
		+ '<p class="sr-only" id="elChartEngagedText"></p>'
		+ '<details class="el-more mt-2"><summary>Show the days as a table</summary><div id="elDeliverabilityDaysTable" class="mt-2"></div></details>'
		+ '<h3 id="elByTypeTitle">By email type</h3><p class="el-muted mb-2" id="elByTypeHelp"></p><div id="elDeliverabilityTypes"></div>'
		+ '<h3>By category</h3><div id="elDeliverabilityCategories"></div>'
		+ '<h3>By provider</h3><div id="elDeliverabilityProviders"></div>'
		+ '</div></dialog>';
}

/* Unsubscribed addresses: the school's own list. An address on it gets none of the school's
   emails except "Account & security" ones (password resets, sign-in codes). */
function emailLogUnsubscribedContent() {
	return '<dialog id="elUnsub" class="el-drawer" closedby="any" aria-labelledby="elUnsubTitle">'
		+ '<div class="el-drawer__head"><h2 id="elUnsubTitle" class="el-drawer__title">Unsubscribed addresses</h2>'
		+ '<button type="button" class="btn btn-sm btn-light ml-auto" id="elUnsubClose">Close</button></div>'
		+ '<div class="el-drawer__body">'
		+ '<p class="el-muted mb-3">Addresses your school has unsubscribed. They get none of your school\'s emails except account and security ones '
		+ '(password resets, sign-in codes). Each email is still logged, and shows these addresses as "Unsubscribed by the school"; '
		+ 'people with an account still see the email in their Inbox.</p>'
		+ '<form id="elUnsubAddForm" class="form-row align-items-end mb-2" novalidate hidden>'
		+ '<div class="form-group col-md-4"><label for="elUnsubEmail">Email address</label>'
		+ '<input type="email" id="elUnsubEmail" name="email" class="form-control" required maxlength="254" autocomplete="off" '
		+ 'autocorrect="off" autocapitalize="off" spellcheck="false"></div>'
		+ '<div class="form-group col-md-5"><label for="elUnsubReason">Why</label>'
		+ '<input type="text" id="elUnsubReason" name="reason" class="form-control" required minlength="5" maxlength="500" aria-describedby="elUnsubReasonHelp"></div>'
		+ '<div class="form-group col-md-3"><button type="submit" class="btn btn-danger btn-block" id="elUnsubAdd">Unsubscribe address</button></div>'
		+ '<small id="elUnsubReasonHelp" class="form-text text-muted col-12 mt-n2 mb-2">Why: at least 5 characters, for example "Parent asked us to stop emailing this address".</small>'
		+ '</form>'
		+ '<form id="elUnsubSearchForm" class="form-row align-items-end" role="search" novalidate>'
		+ '<div class="form-group col-md-9"><label for="elUnsubSearch">Address or reason contains</label>'
		+ '<input type="search" id="elUnsubSearch" name="search" class="form-control" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></div>'
		+ '<div class="form-group col-md-3"><button type="submit" class="btn btn-primary btn-block">Search</button></div>'
		+ '</form>'
		+ '<p id="elUnsubSummary" class="mb-2" aria-live="polite"></p>'
		+ '<div class="el-table-wrap" role="region" aria-labelledby="elUnsubCaption" tabindex="0">'
		+ '<table class="el-table"><caption id="elUnsubCaption" class="sr-only">Addresses your school has unsubscribed</caption>'
		+ '<thead><tr><th scope="col">Address</th><th scope="col">Why</th><th scope="col">Added by</th><th scope="col">Added (IST)</th>'
		+ '<th scope="col"><span class="sr-only">Actions</span></th></tr></thead>'
		+ '<tbody id="elUnsubRows"></tbody></table></div>'
		+ '<nav class="d-flex justify-content-between align-items-center mt-3" aria-label="Unsubscribed address pages">'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elUnsubPrev" disabled>&larr; Previous</button>'
		+ '<span id="elUnsubPage"></span>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elUnsubNext" disabled>Next &rarr;</button>'
		+ '</nav>'
		+ '</div></dialog>';
}

/* Asks why before an address is unsubscribed (from an email's recipients or a problem address)
   or taken off the list. A small modal opened with showModal(): Esc or Cancel close it; it does
   not close on an outside click, so a typed reason is not lost. Enter sends (the only submit button). */
function emailLogUnsubscribeAskContent() {
	return '<dialog id="elUnsubAsk" class="el-dialog" aria-labelledby="elUnsubAskTitle" aria-describedby="elUnsubAskText">'
		+ '<form id="elUnsubAskForm" novalidate>'
		+ '<h2 id="elUnsubAskTitle" class="el-dialog__title"></h2>'
		+ '<p id="elUnsubAskText"></p>'
		+ '<div class="form-group"><label for="elUnsubAskReason">Why</label>'
		+ '<input type="text" id="elUnsubAskReason" name="reason" class="form-control" required minlength="5" maxlength="500" autofocus '
		+ 'aria-describedby="elUnsubAskHelp elUnsubAskError">'
		+ '<small id="elUnsubAskHelp" class="form-text text-muted">At least 5 characters. Kept in the list\'s history with your name.</small>'
		+ '<div id="elUnsubAskError" class="text-danger small" aria-live="polite"></div></div>'
		+ '<div class="d-flex justify-content-end" style="gap:.5rem">'
		+ '<button type="button" class="btn btn-light" id="elUnsubAskCancel">Cancel</button>'
		+ '<button type="submit" class="btn btn-danger" id="elUnsubAskConfirm"></button>'
		+ '</div></form></dialog>';
}

/* Person: one student, parent, teacher or staff member, as their Inbox shows it, with admin details. */
function emailLogPersonContent() {
	return '<dialog id="elPerson" class="el-drawer" closedby="any" aria-labelledby="elPersonTitle">'
		+ '<div class="el-drawer__head"><h2 id="elPersonTitle" class="el-drawer__title">Person</h2>'
		+ '<button type="button" class="btn btn-sm btn-light ml-auto" id="elPersonClose">Close</button></div>'
		+ '<div class="el-drawer__body">'
		+ '<form id="elPersonForm" class="form-row align-items-end" novalidate>'
		+ '<div class="form-group col-md-5"><label for="elPersonQuery">Name, email, mobile or account ID</label>'
		+ '<input type="search" id="elPersonQuery" class="form-control" autocomplete="off"></div>'
		+ '<div class="form-group col-md-2"><label for="elPersonFrom">From</label><input type="date" id="elPersonFrom" class="form-control"></div>'
		+ '<div class="form-group col-md-2"><label for="elPersonTo">To</label><input type="date" id="elPersonTo" class="form-control"></div>'
		+ '<div class="form-group col-md-2"><label for="elPersonChannel">Show</label><select id="elPersonChannel" class="form-control">'
		+ '<option value="ALL">Everything</option><option value="EMAIL">Emails</option><option value="NOTIFICATION">Notifications</option>'
		+ '<option value="ANNOUNCEMENT">Announcements</option><option value="WHATSAPP">WhatsApp</option></select></div>'
		+ '<div class="form-group col-md-1"><button type="submit" class="btn btn-primary btn-block">Find</button></div>'
		+ '</form>'
		+ '<p id="elPersonSummary" aria-live="polite" class="mb-2"></p>'
		+ '<div id="elPersonCandidates"></div>'
		+ '<div id="elPersonHeader"></div>'
		+ '<ul class="list-unstyled mb-0" id="elPersonItems"></ul>'
		+ '<nav class="d-flex justify-content-between align-items-center mt-3" aria-label="Person pages">'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elPersonPrev" disabled>&larr; Newer</button>'
		+ '<span id="elPersonPage"></span>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elPersonNext" disabled>Older &rarr;</button>'
		+ '</nav>'
		+ '</div></dialog>';
}

/* "Problem addresses": one row per address whose emails bounced, were blocked or dropped,
   or were marked as spam / unsubscribed. Same modal side panel as the details. */
function emailLogProblemsContent() {
	return '<dialog id="elProblems" class="el-drawer" closedby="any" aria-labelledby="elProblemsTitle">'
		+ '<div class="el-drawer__head">'
		+ '<h2 id="elProblemsTitle" class="el-drawer__title">Problem addresses</h2>'
		+ '<button type="button" class="btn btn-sm btn-light ml-auto" id="elProblemsClose">Close</button>'
		+ '</div>'
		+ '<div class="el-drawer__body">'
		+ '<p class="el-muted mb-3">Addresses your school\'s emails could not reach, newest problem first. '
		+ 'SendGrid stops sending to an address after it bounces, so these people may be missing every email until the address is corrected. '
		+ 'Emails the nightly archive has moved are not counted here.</p>'
		+ '<form id="elProblemsForm" class="form-row align-items-end" novalidate>'
		+ '<div class="form-group col-md-3"><label for="elProblemsFrom">From</label><input type="date" id="elProblemsFrom" class="form-control"></div>'
		+ '<div class="form-group col-md-3"><label for="elProblemsTo">To</label><input type="date" id="elProblemsTo" class="form-control"></div>'
		+ '<div class="form-group col-md-6"><label for="elProblemsAddress">Address contains</label><input type="search" id="elProblemsAddress" class="form-control" autocomplete="off"></div>'
		+ '<fieldset class="form-group col-md-9"><legend class="el-legend">Problem</legend>'
		+ emailLogCheckboxes('problem', [['BOUNCED', 'Bounced'], ['BLOCKED', 'Blocked'], ['DROPPED', 'Dropped'],
			['SPAM_REPORT', 'Marked as spam'], ['UNSUBSCRIBED', 'Unsubscribed']])
		+ '</fieldset>'
		+ '<div class="form-group col-md-3"><button type="submit" class="btn btn-primary btn-block">Show</button></div>'
		+ '</form>'
		+ '<p id="elProblemsSummary" class="mb-2" aria-live="polite"></p>'
		+ '<div class="el-table-wrap" role="region" aria-labelledby="elProblemsCaption" tabindex="0">'
		+ '<table class="el-table"><caption id="elProblemsCaption" class="sr-only">Problem addresses</caption>'
		+ '<thead><tr><th scope="col">Address</th><th scope="col">Account</th><th scope="col">Latest problem</th>'
		+ '<th scope="col">Failed emails</th><th scope="col">Last</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead>'
		+ '<tbody id="elProblemsRows"></tbody></table></div>'
		+ '<div id="elSuppression" class="mt-3" aria-live="polite"></div>'
		+ '<nav class="d-flex justify-content-between align-items-center mt-3" aria-label="Problem address pages">'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elProblemsPrev" disabled>&larr; Previous</button>'
		+ '<span id="elProblemsPage"></span>'
		+ '<button type="button" class="btn btn-outline-primary btn-sm" id="elProblemsNext" disabled>Next &rarr;</button>'
		+ '</nav>'
		+ '</div>'
		+ '</dialog>';
}

/* Modal side panel for one email. A native <dialog> opened with showModal(): focus, Esc,
   the backdrop and focus return come from the browser; closedby="any" adds click-outside
   (emailLogs.js adds the same where closedby is not supported). */
function emailLogDrawerContent() {
	return '<dialog id="emailLogDrawer" class="el-drawer" closedby="any" aria-labelledby="elDrawerTitle">'
		+ '<div class="el-drawer__head">'
		+ '<h2 id="elDrawerTitle" class="el-drawer__title">Email details</h2>'
		+ '<button type="button" class="btn btn-sm btn-light ml-auto el-no-print" id="elDrawerPrint"><i class="fa fa-print" aria-hidden="true"></i>&nbsp;Print</button>'
		+ '<button type="button" class="btn btn-sm btn-light el-no-print" id="elDrawerClose" autofocus>Close</button>'
		+ '</div>'
		+ '<div class="el-drawer__body" id="elDrawerBody"></div>'
		+ '</dialog>';
}

function ensureEmailLogsStyles() {
	if (document.getElementById('emailLogsStyles')) {
		return;
	}
	var css = ''
		+ '.el-screen{container-type:inline-size}'
		+ '.el-title{font-size:inherit;font-weight:inherit;margin:0}'
		+ '.el-legend{font-size:.875rem;font-weight:600;margin-bottom:.25rem}'
		+ '.el-checks{display:flex;flex-wrap:wrap;gap:.25rem 1.25rem}'
		+ '.el-quick{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}'
		+ '.el-quick__label{font-size:12px;color:var(--gray)}'
		+ '.el-chip{border:1px solid var(--pc);color:var(--pc);background:var(--white);border-radius:999px;padding:.2rem .75rem;font-size:12px;cursor:pointer}'
		+ '.el-chip:hover,.el-chip:focus-visible{background:var(--pc);color:var(--white)}'
		+ '.el-more>summary{cursor:pointer;color:var(--pc);font-weight:600}'
		+ '.el-table-wrap{overflow:auto;max-inline-size:100%;max-block-size:min(70vh,900px);container-type:inline-size}'
		+ '.el-table-wrap:focus-visible{outline:2px solid var(--pc);outline-offset:2px}'
		+ '.el-table{border-collapse:separate;border-spacing:0;inline-size:100%;font-size:12px}'
		+ '.el-table thead th{position:sticky;inset-block-start:0;z-index:1;background:var(--pc);color:var(--white);font-weight:600;white-space:nowrap}'
		+ '.el-table th,.el-table td{padding:.5rem .6rem;border-block-end:1px solid var(--light);vertical-align:top;text-align:start}'
		+ '.el-table tbody tr:hover{background:var(--plc)}'
		+ '.el-subject{font-weight:600;max-inline-size:28rem;overflow-wrap:anywhere}'
		+ '.el-muted{color:var(--gray)}'
		+ '.el-addr{overflow-wrap:anywhere}'
		+ '.el-badge{display:inline-block;padding:.1rem .45rem;border-radius:4px;font-size:11px;font-weight:600;line-height:1.5;white-space:nowrap;background:var(--gray);color:var(--white)}'
		+ '.el-badge--ok{background:var(--success)}'
		+ '.el-badge--bad{background:var(--danger)}'
		+ '.el-badge--warn{background:var(--warning);color:var(--gray-dark)}'
		+ '.el-badge--info{background:var(--pc)}'
		+ '.el-badge--cat{background:var(--plc);color:var(--sc);font-weight:500}'
		+ '.el-badge--role{background:var(--light);color:var(--gray-dark);font-weight:500}'
		+ '@container (width < 760px){'
		+ '.el-table,.el-table thead,.el-table tbody,.el-table tr,.el-table th,.el-table td{display:block}'
		+ '.el-table thead{display:none}'
		+ '.el-table tr{margin-block-end:1rem;border:1px solid var(--light);border-radius:6px;padding:.25rem}'
		+ '.el-table td{border:0}'
		+ '.el-table td[data-label]::before{content:attr(data-label) ": ";font-weight:600;color:var(--gray)}'
		+ '}'
		+ 'dialog.el-drawer{margin:0 0 0 auto;padding:0;border:0;inline-size:min(980px,100vw);max-inline-size:100vw;block-size:100dvh;max-block-size:100dvh;background:var(--white)}'
		+ 'dialog.el-drawer:modal{overscroll-behavior:contain}'
		+ 'dialog.el-drawer::backdrop{background:rgba(0,0,0,.45);overflow:hidden;overscroll-behavior:contain}'
		+ '.el-drawer__head{position:sticky;inset-block-start:0;z-index:2;display:flex;align-items:center;gap:1rem;padding:.75rem 1rem;background:var(--pc);color:var(--white)}'
		+ '.el-drawer__title{font-size:1rem;margin:0;overflow-wrap:anywhere}'
		+ '.el-drawer__body{padding:1rem}'
		+ '.el-drawer__body h3{font-size:.95rem;font-weight:600;margin:1.25rem 0 .5rem}'
		+ '.el-facts{display:grid;grid-template-columns:max-content 1fr;gap:.35rem 1rem;margin:0;font-size:13px}'
		+ '.el-facts dt{color:var(--gray);font-weight:500}'
		+ '.el-facts dd{margin:0;overflow-wrap:anywhere}'
		+ '.el-timeline{list-style:none;margin:0;padding:0 0 0 1rem;border-inline-start:2px solid var(--light);font-size:13px}'
		+ '.el-timeline li{position:relative;padding:.1rem 0 .8rem .5rem}'
		+ '.el-timeline li::before{content:"";position:absolute;inset-inline-start:-1.4rem;inset-block-start:.45rem;inline-size:10px;block-size:10px;border-radius:50%;background:var(--pc)}'
		+ '.el-timeline .el-when{color:var(--gray);font-size:12px}'
		+ '.el-preview{inline-size:100%;block-size:420px;border:1px solid var(--light);border-radius:4px;background:var(--white)}'
		+ '.el-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.75rem;margin-block:.5rem 1rem}'
		+ '.el-tile-group h3{margin-block-end:.25rem}'
		+ '.el-num{font-variant-numeric:tabular-nums}'
		+ '.el-flag{display:inline-flex;align-items:center;gap:.3rem;padding:.1rem .45rem;border-radius:4px;font-size:11px;font-weight:600;'
		+ 'white-space:nowrap;background:var(--warning);color:var(--gray-dark)}'
		+ '.el-table tbody th{font-weight:600}'
		+ '.el-type-cell{min-inline-size:14rem;max-inline-size:20rem}'
		+ 'dialog.el-dialog{padding:1.25rem;border:0;border-radius:8px;inline-size:min(32rem,calc(100vw - 2rem));background:var(--white)}'
		+ 'dialog.el-dialog:modal{overscroll-behavior:contain}'
		+ 'dialog.el-dialog::backdrop{background:rgba(0,0,0,.45);overflow:hidden;overscroll-behavior:contain}'
		+ '.el-dialog__title{font-size:1rem;font-weight:600;margin:0 0 .75rem;overflow-wrap:anywhere}'
		+ '#elUnsubAskText{overflow-wrap:anywhere}'
		+ '.el-tile{border:1px solid var(--light);border-radius:6px;padding:.6rem .8rem}'
		+ '.el-tile__label{font-size:12px;color:var(--gray)}'
		+ '.el-tile__value{font-size:1.4rem;font-weight:600;line-height:1.2}'
		+ '.el-tile__note{font-size:11px;color:var(--gray)}'
		+ '.el-chart{min-block-size:240px}'
		+ '.el-alert{border-inline-start:4px solid var(--danger);background:var(--light);padding:.5rem .75rem;margin-block-end:.5rem;font-size:13px}'
		+ '.el-person-item{border-block-end:1px solid var(--light);padding:.6rem 0}'
		+ '.el-person-item__title{font-weight:600;overflow-wrap:anywhere}'
		// Print only the open email details (admin view).
		+ '@media print{body *{visibility:hidden !important}'
		+ '#emailLogDrawer[open],#emailLogDrawer[open] *{visibility:visible !important}'
		+ '#emailLogDrawer[open]{position:absolute;inset:0 auto auto 0;margin:0;inline-size:100%;block-size:auto;max-block-size:none;overflow:visible}'
		+ '#emailLogDrawer::backdrop{display:none}'
		+ '.el-no-print,#emailLogDrawer .form-inline{display:none !important}'
		+ '.el-drawer__head{position:static;background:none;color:#000}'
		+ '.el-table-wrap{max-block-size:none;overflow:visible}}';
	$('head').append('<style id="emailLogsStyles">' + css + '</style>');
}
