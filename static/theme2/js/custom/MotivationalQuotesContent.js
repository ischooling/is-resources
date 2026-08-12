/*
 * Motivational Quotes — JS-rendered module (no JSP).
 *
 *  - Admin screen: one JSON call (/dashboard/motivational-quotes/data) returns
 *    the role list, grade options and every visible quote row; the page shell,
 *    DataTable and add/edit modal are all built client-side here.
 *    Rendered from adminController.js contentHandlers ('manage-motivational-quotes').
 *
 *  - Dashboard widget: showQuoteOfMoment() fetches a random role-matched quote
 *    (/my-quote) and shows a "Quote of the Moment" card at the top of the
 *    dashboard for Student / Teacher / Parent / Admin. Called from the role
 *    "home" handlers in adminController.js.
 *
 * Follows the ManageBatchStudentContent.js / DownloadReportsContent.js pattern.
 * Save/toggle/delete POST plain JSON and override the global encrypt-wrap
 * beforeSend, because the controller reads @RequestBody records directly.
 */

var __motivationalQuotesData = null;

/* Build a module URL, mirroring downloadReportsUrl(). */
function motivationalQuotesUrl(action, id) {
	var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/motivational-quotes/' + action;
	if (id !== undefined && id !== null && id !== '') {
		url += '/' + id;
	}
	url += '/' + UNIQUEUUID;
	return url;
}

/* Escape for safe use inside HTML text / attributes. */
function mqEsc(value) {
	if (value === undefined || value === null) {
		return '';
	}
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/* ------------------------------------------------------------------ *
 *  Admin management screen
 * ------------------------------------------------------------------ */

async function renderMotivationalQuotesDashboard(title, roleAndModule, schoolId, userId, userRole) {
	try {
		customLoader(true);
		var data = await callCommonAjax({
			method: 'GET',
			url: motivationalQuotesUrl('data'),
			global: false,
			showMessage: false,
		});
		customLoader(false);
		if (!data || data.status != '1') {
			showMessageTheme2(0, (data && data.message) ? data.message : 'Unable to load Motivational Quotes. Please try again.');
			return;
		}
		__motivationalQuotesData = data;

		if ($('#motivationalQuotesCss').length < 1) {
			$('head').append('<style id="motivationalQuotesCss">'
				+ '.mq-active{color:green;font-weight:600;} .mq-inactive{color:#c00;font-weight:600;}'
				+ '.mq-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;background:var(--pc);color:#fff;}'
				+ '#motivationalQuotesTable td{vertical-align:middle;}'
				+ '</style>');
		}

		var rowsHtml = '';
		var quotes = data.quotes || [];
		for (var i = 0; i < quotes.length; i++) {
			rowsHtml += buildQuoteRowHtml(quotes[i], i, data.canManage);
		}

		var addBtn = data.canManage
			? '<a onclick="openQuoteModal()" href="javascript:void(0);" class="btn btn-primary fa-pull-right">&nbsp;Add Quote</a>'
			: '';

		var html = ''
			+ '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper">'
			+   '<div class="page-title-heading">'
			+     '<div class="page-title-icon"><i class="fas fa-quote-right text-primary"></i></div>'
			+     '<div>' + mqEsc(title || 'Motivational Quotes') + '</div>'
			+   '</div>'
			+   '<div class="btn-actions-pane-right">' + addBtn + '</div>'
			+ '</div></div>'
			+ '<div class="main-card mt-3 mb-3 card body-tabs-shadow"><div class="card-body">'
			+   '<div style="width:100%;display:inline-block">'
			+     '<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap" id="motivationalQuotesTable" style="width:100% !important">'
			+       '<thead><tr class="bg-primary text-white">'
			+         '<th>S. No.</th><th>Quote</th><th>Author</th><th>Role</th><th>Grades</th><th>Scope</th><th>Status</th><th>Action</th>'
			+       '</tr></thead>'
			+       '<tbody>' + rowsHtml + '</tbody>'
			+     '</table>'
			+   '</div>'
			+ '</div></div>'
			+ getQuoteModalHtml(data);

		$('#dashboardContentInHTML').html(html);
		initMotivationalQuotesTable();
		bindQuoteRoleToggle();
	} catch (e) {
		console.error(e);
		customLoader(false);
		showMessageTheme2(0, 'Unable to load Motivational Quotes. Please try again.');
	}
}

function initMotivationalQuotesTable() {
	$('#motivationalQuotesTable').DataTable({
		'processing': true,
		'serverSide': false,
		'pagingType': 'full',
		'pageLength': 10,
		'order': [],
		'search': { 'smart': false, 'regex': false },
	});
}

function buildQuoteRowHtml(quote, index, canManage) {
	var isActive = quote.active === 'Y';
	var actions = '';
	if (canManage) {
		var delCall = 'deleteQuote(' + quote.id + ')';
		actions += '<div class="dropdown">'
			+ '<button class="btn btn-sm dropdown-toggle" style="background-color:var(--pc);border-color:var(--pc);color:#fff;box-shadow:none;" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>'
			+ '<ul class="dropdown-menu"><li>'
			+ '<a href="javascript:void(0);" class="dropdown-item" onclick="openQuoteModal(' + quote.id + ')"><i class="fa fa-edit"></i>&nbsp;Edit</a>'
			+ '<a href="javascript:void(0);" class="dropdown-item" onclick="toggleQuote(' + quote.id + ')"><i class="fa fa-power-off"></i>&nbsp;' + (isActive ? 'Deactivate' : 'Activate') + '</a>'
			+ '<a href="javascript:void(0);" class="dropdown-item" onclick="showWarningMessage(\'Are you sure you want to delete this quote?\', \'' + delCall + '\')"><i class="fa fa-trash"></i>&nbsp;Delete</a>'
			+ '</li></ul></div>';
	} else {
		actions = '<span class="text-muted">—</span>';
	}

	var row = '<tr>';
	row += '<td>' + (index + 1) + '</td>';
	row += '<td>' + mqEsc(quote.quoteText) + '</td>';
	row += '<td>' + (quote.author ? mqEsc(quote.author) : '<span class="text-muted">—</span>') + '</td>';
	row += '<td>' + mqEsc(quote.targetRole) + '</td>';
	row += '<td>' + mqEsc(quote.gradeNames || 'All Grades') + '</td>';
	row += '<td><span class="mq-badge">' + (quote.scope === 'GLOBAL' ? 'Global' : 'School') + '</span></td>';
	row += '<td class="' + (isActive ? 'mq-active' : 'mq-inactive') + '">' + (isActive ? 'Active' : 'Inactive') + '</td>';
	row += '<td>' + actions + '</td>';
	row += '</tr>';
	return row;
}

function getQuoteRoleOptionsHtml(roles) {
	var html = '<option value="">Select Role</option>';
	(roles || []).forEach(function (r) {
		html += '<option value="' + mqEsc(r) + '">' + mqEsc(r) + '</option>';
	});
	return html;
}

function getQuoteModalHtml(data) {
	return ''
		+ '<div class="modal fade fade-scale" id="quoteFormModal" tabindex="-1" role="dialog" aria-hidden="true">'
		+  '<div class="modal-dialog modal-lg" role="document"><div class="modal-content">'
		+   '<div class="modal-header bg-primary text-white">'
		+     '<h5 class="modal-title" id="quoteModalTitle">Add Quote</h5>'
		+     '<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+   '</div>'
		+   '<div class="modal-body">'
		+     '<input type="hidden" id="quoteId" />'
		+     '<div class="form-group"><label>Quote <span class="text-danger">*</span></label>'
		+       '<textarea id="quoteText" class="form-control" rows="3" maxlength="1000" placeholder="Enter an encouraging quote"></textarea>'
		+       '<small class="text-muted">Wrap any phrase in **double asterisks** to highlight it in accent color, e.g. a **happy team** builds a happy school.</small></div>'
		+     '<div class="form-group"><label>Author</label>'
		+       '<input type="text" id="quoteAuthor" class="form-control" maxlength="255" placeholder="Optional" /></div>'
		+     '<div class="form-group"><label>Role <span class="text-danger">*</span></label>'
		+       '<select id="quoteRole" class="form-control">' + getQuoteRoleOptionsHtml(data.roles) + '</select></div>'
		+     '<div class="form-group" id="quoteGradeGroup" style="display:none;"><label>Grades</label>'
		+       '<input type="text" class="form-control" value="All Grades" disabled /></div>'
		+     '<div class="form-group form-check"><input type="checkbox" class="form-check-input" id="quoteGlobal" />'
		+       '<label class="form-check-label" for="quoteGlobal">Make this a global quote (all schools)</label></div>'
		+   '</div>'
		+   '<div class="modal-footer">'
		+     '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'
		+     '<button type="button" class="btn btn-primary" id="quoteSaveBtn" onclick="saveQuote()">Save</button>'
		+   '</div>'
		+  '</div></div>'
		+ '</div>';
}

/* Show/hide the (always "All Grades") grade note based on the chosen role. */
function bindQuoteRoleToggle() {
	$('#quoteRole').off('change.mq').on('change.mq', function () {
		var role = $(this).val();
		if (role === 'STUDENT' || role === 'PARENT') {
			$('#quoteGradeGroup').show();
		} else {
			$('#quoteGradeGroup').hide();
		}
	});
}

function openQuoteModal(id) {
	// Reset form.
	$('#quoteId').val('');
	$('#quoteText').val('');
	$('#quoteAuthor').val('');
	$('#quoteRole').val('');
	$('#quoteGlobal').prop('checked', false);
	$('#quoteGradeGroup').hide();
	$('#quoteModalTitle').text('Add Quote');

	if (id !== undefined && id !== null) {
		var quote = ((__motivationalQuotesData && __motivationalQuotesData.quotes) || []).filter(function (q) {
			return q.id === id;
		})[0];
		if (quote) {
			$('#quoteModalTitle').text('Edit Quote');
			$('#quoteId').val(quote.id);
			$('#quoteText').val(quote.quoteText);
			$('#quoteAuthor').val(quote.author || '');
			$('#quoteRole').val(quote.targetRole);
			$('#quoteGlobal').prop('checked', quote.scope === 'GLOBAL');
			if (quote.targetRole === 'STUDENT' || quote.targetRole === 'PARENT') {
				$('#quoteGradeGroup').show();
			}
		}
	}
	$('#quoteFormModal').modal('show');
}

function saveQuote() {
	var text = ($('#quoteText').val() || '').trim();
	var role = $('#quoteRole').val();
	if (!text) {
		showMessageTheme2(0, 'Please enter the quote text.');
		return;
	}
	if (!role) {
		showMessageTheme2(0, 'Please choose a role for this quote.');
		return;
	}
	var idVal = $('#quoteId').val();
	var payload = {
		id: idVal ? parseInt(idVal, 10) : null,
		quoteText: text,
		author: ($('#quoteAuthor').val() || '').trim(),
		targetRole: role,
		global: $('#quoteGlobal').is(':checked'),
		gradeIds: [], // Grade targeting is no longer offered — always "All Grades".
	};

	$('#quoteSaveBtn').prop('disabled', true).text('Saving...');
	$.ajax({
		url: motivationalQuotesUrl('save'),
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		// Bypass the global encrypt-wrap beforeSend — /save reads @RequestBody directly.
		beforeSend: function (xhr) {
			xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID);
		},
		success: function (res) {
			$('#quoteSaveBtn').prop('disabled', false).text('Save');
			if (res && res.status == '1') {
				$('#quoteFormModal').modal('hide');
				// modal('hide') is async — it waits for the modal's CSS
				// transition-end event to strip the backdrop / body lock.
				// renderMotivationalQuotesDashboard() below replaces the
				// modal's DOM immediately, so that event never fires; clean
				// up the backdrop ourselves so the page doesn't stay stuck
				// dimmed/unresponsive.
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open').css({ 'overflow': '', 'padding-right': '' });
				showMessageTheme2(1, res.message || 'Saved.');
				renderMotivationalQuotesDashboard('Motivational Quotes', { moduleId: (typeof MODULE_ID !== 'undefined' ? MODULE_ID : null) }, SCHOOL_ID, USER_ID, USER_ROLE);
			} else {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Could not save the quote.');
			}
		},
		error: function () {
			$('#quoteSaveBtn').prop('disabled', false).text('Save');
			showMessageTheme2(0, 'Could not save the quote. Please try again.');
		},
	});
}

function toggleQuote(id) {
	mqWriteAction(motivationalQuotesUrl('toggle', id));
}

function deleteQuote(id) {
	mqWriteAction(motivationalQuotesUrl('delete', id));
}

function mqWriteAction(url) {
	$.ajax({
		url: url,
		type: 'POST',
		contentType: 'application/json',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID);
		},
		success: function (res) {
			if (res && res.status == '1') {
				showMessageTheme2(1, res.message || 'Done.');
				renderMotivationalQuotesDashboard('Motivational Quotes', { moduleId: (typeof MODULE_ID !== 'undefined' ? MODULE_ID : null) }, SCHOOL_ID, USER_ID, USER_ROLE);
			} else {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Action failed.');
			}
		},
		error: function () {
			showMessageTheme2(0, 'Action failed. Please try again.');
		},
	});
}

/* ------------------------------------------------------------------ *
 *  Dashboard widget — "Quote of the Moment"
 * ------------------------------------------------------------------ */

/* Once the user dismisses the card, keep it closed for the rest of the session
   (mqDashboardWidget re-runs showQuoteOfMoment shortly after render). */
var __quoteOfMomentDismissed = false;

function closeQuoteOfMoment() {
	__quoteOfMomentDismissed = true;
	$('#quoteOfMoment').remove();
}

/* Escape the quote text but let admins highlight a phrase by wrapping it in
   **double asterisks** (e.g. "a **happy team** builds a happy school") —
   rendered as an accent-colored span on the "Quote of the Moment" card. */
function mqHighlightHtml(value) {
	var raw = String(value === undefined || value === null ? '' : value);
	var parts = raw.split('**');
	var html = '';
	for (var i = 0; i < parts.length; i++) {
		html += (i % 2 === 1) ? ('<span class="quote-of-moment-highlight">' + mqEsc(parts[i]) + '</span>') : mqEsc(parts[i]);
	}
	return html;
}

function ensureQuoteOfMomentCss() {
	if ($('#quoteOfMomentCss').length > 0) {
		return;
	}
	$('head').append(''
		+ '<style id="quoteOfMomentCss">'
		+ '#quoteOfMoment{margin:0 0 16px;}'
		+ '#quoteOfMoment .quote-of-moment-paper{position:relative;display:inline-flex;align-items:center;gap:18px;width:auto;max-width:100%;box-sizing:border-box;overflow:hidden;'
		+   'background:linear-gradient(135deg, var(--plc), var(--slc));border-radius:16px;padding:16px 60px 16px 20px;box-shadow:0 4px 14px rgba(0,0,0,0.06);}'
		+ '#quoteOfMoment .quote-of-moment-icon{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;'
		+   'color:var(--pc);font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,0.10);}'
		+ '#quoteOfMoment .quote-of-moment-divider{flex:0 0 auto;align-self:stretch;width:2px;border-radius:2px;background:var(--pc);opacity:0.35;}'
		+ '#quoteOfMoment .quote-of-moment-body{flex:1;min-width:0;position:relative;z-index:1;}'
		+ '#quoteOfMoment .quote-of-moment-text{font-size:16px;color:#2b2b2b;line-height:1.5;}'
		+ '#quoteOfMoment .quote-of-moment-highlight{color:var(--pc);font-style:italic;font-weight:600;}'
		+ '#quoteOfMoment .quote-of-moment-author{margin-top:4px;font-size:13px;color:#6b6b6b;font-weight:600;}'
		+ '#quoteOfMoment .quote-of-moment-close{position:absolute;top:10px;right:12px;font-size:18px;line-height:1;opacity:0.4;cursor:pointer;border:none;background:transparent;z-index:2;color:#2b2b2b;}'
		+ '#quoteOfMoment .quote-of-moment-close:hover{opacity:0.8;}'
		+ '#quoteOfMoment .quote-of-moment-sparkle{position:absolute;color:var(--sc);pointer-events:none;}'
		+ '#quoteOfMoment .quote-of-moment-sparkle-1{top:8px;right:46px;font-size:8px;opacity:0.55;}'
		+ '#quoteOfMoment .quote-of-moment-sparkle-2{bottom:10px;right:30px;font-size:10px;opacity:0.7;}'
		+ '#quoteOfMoment .quote-of-moment-sparkle-3{top:50%;right:14px;font-size:14px;opacity:0.85;transform:translateY(-50%);}'
		+ '@media (max-width: 576px){#quoteOfMoment .quote-of-moment-paper{padding:14px 20px 14px 14px;gap:12px;flex-wrap:wrap;}'
		+   '#quoteOfMoment .quote-of-moment-icon{width:36px;height:36px;font-size:13px;}'
		+   '#quoteOfMoment .quote-of-moment-text{font-size:13px;}'
		+   '#quoteOfMoment .quote-of-moment-author{font-size:11px;}'
		+   '#quoteOfMoment .quote-of-moment-sparkle{display:none;}}'
		+ '</style>');
}

function showQuoteOfMoment() {
	if (__quoteOfMomentDismissed) {
		return;
	}
	try {
		$.ajax({
			url: motivationalQuotesUrl('my-quote'),
			type: 'GET',
			beforeSend: function (xhr) {
				xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID);
			},
			success: function (res) {
				if (!res || res.status != '1' || !res.quoteText) {
					$('#quoteOfMoment').remove();
					return;
				}
				ensureQuoteOfMomentCss();
				var authorHtml = res.author ? '<div class="quote-of-moment-author">— ' + mqEsc(res.author) + '</div>' : '';
				var card = ''
					+ '<div id="quoteOfMoment">'
					+   '<div class="quote-of-moment-paper">'
					+     '<button type="button" class="quote-of-moment-close" aria-label="Close" title="Dismiss" onclick="closeQuoteOfMoment()">&times;</button>'
					+     '<div class="quote-of-moment-body"><div class="quote-of-moment-text">' + mqHighlightHtml(res.quoteText) + '</div>'
					+       authorHtml
					+     '</div>'
					+     '<i class="fas fa-star quote-of-moment-sparkle quote-of-moment-sparkle-1"></i>'
					+     '<i class="fas fa-star quote-of-moment-sparkle quote-of-moment-sparkle-2"></i>'
					+     '<i class="fas fa-star quote-of-moment-sparkle quote-of-moment-sparkle-3"></i>'
					+   '</div>'
					+ '</div>';
				$('#quoteOfMoment').remove();
				$('#dashboardContentInHTML').before(card);
			},
			error: function () {
				$('#quoteOfMoment').remove();
			},
		});
	} catch (e) {
		console.error(e);
	}
}
