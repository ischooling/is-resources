/*
 * Login Highlights - JS-rendered admin module (no JSP).
 *
 * Review what the login page "Today's highlight" card shows: AI-written national / international /
 * on-this-day items, the seeded fixed days, and items added here by hand. Admins approve, reject, edit
 * and add items. Rendered from adminController.js contentHandlers ('manage-login-highlights').
 *
 * Layout and controls follow teacherRatingContent.js (custom-field floating labels, select2 bootstrap4,
 * datepicker, uppercase stat cards). Data follows MotivationalQuotesContent.js: one JSON call
 * (/dashboard/login-highlights/data) loads the page; save / status POST plain JSON and bypass the global
 * encrypt-wrap beforeSend, because the controller reads @RequestBody records directly.
 */

var __loginHighlightsData = null;
var __loginHighlightsFilter = { from: '', to: '', annual: false, type: '', status: '', search: '', pageSize: 25 };

var LH_TYPES = {
	NATIONAL_DAY: { label: 'National day', color: '#1d8a3a', icon: 'fa-flag' },
	INTERNATIONAL_DAY: { label: 'International day', color: 'var(--pc)', icon: 'fa-globe' },
	ON_THIS_DAY: { label: 'On this day', color: '#f57c00', icon: 'fa-flask' }
};
var LH_STATUS = {
	APPROVED: { label: 'Approved', badge: 'badge-success', icon: 'fa-check-circle' },
	PENDING: { label: 'Pending', badge: 'badge-warning', icon: 'fa-clock-o' },
	REJECTED: { label: 'Rejected', badge: 'badge-danger', icon: 'fa-times-circle' }
};
var LH_SOURCE = {
	AI: { label: 'AI', badge: 'badge-info' },
	SEED: { label: 'Fixed list', badge: 'badge-secondary' },
	MANUAL: { label: 'Admin', badge: 'badge-primary' }
};
var LH_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function loginHighlightsUrl(action, extra) {
	var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/login-highlights/' + action;
	if (extra) {
		url += '/' + extra;
	}
	return url + '/' + UNIQUEUUID;
}

function lhEsc(value) {
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

/* yyyy-mm-dd <-> Date, in local time (the datepicker works with local dates). */
function lhParseYmd(value) {
	if (!value) {
		return null;
	}
	var p = value.split('-');
	return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
}

function lhToYmd(date) {
	if (!date) {
		return '';
	}
	return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
}

function lhFormatDate(isoDate, withYear) {
	var d = lhParseYmd(isoDate);
	if (!d) {
		return '';
	}
	return LH_MONTHS[d.getMonth()] + ' ' + ('0' + d.getDate()).slice(-2) + (withYear ? ', ' + d.getFullYear() : '');
}

/* ------------------------------------------------------------------ *
 *  Page
 * ------------------------------------------------------------------ */

async function renderLoginHighlightsDashboard(title, roleAndModule, schoolId, userId, userRole) {
	try {
		customLoader(true);
		var f = __loginHighlightsFilter;
		var query = '?annual=' + (f.annual ? 'Y' : 'N')
			+ (f.from ? '&from=' + encodeURIComponent(f.from) : '')
			+ (f.to ? '&to=' + encodeURIComponent(f.to) : '');
		var data = await callCommonAjax({
			method: 'GET',
			url: loginHighlightsUrl('data') + query,
			global: false,
			showMessage: false,
		});
		customLoader(false);
		if (!data || data.status != '1') {
			showMessageTheme2(0, (data && data.message) ? data.message : 'Unable to load login highlights. Please try again.');
			return;
		}
		__loginHighlightsData = data;
		f.from = data.from;
		f.to = data.to;

		$('#dashboardContentInHTML').html(lhPageHtml(title || 'Login Highlights', data) + lhModalHtml(data));
		lhInitFilters();
		lhInitModal();
		lhRenderTable();
		refreshCustomFieldState('#dashboardContentInHTML');
	} catch (e) {
		console.error(e);
		customLoader(false);
		showMessageTheme2(0, 'Unable to load login highlights. Please try again.');
	}
}

function lhReload() {
	renderLoginHighlightsDashboard('Login Highlights', { moduleId: (typeof MODULE_ID !== 'undefined' ? MODULE_ID : null) },
		SCHOOL_ID, USER_ID, USER_ROLE);
}

function lhPageHtml(title, data) {
	var f = __loginHighlightsFilter;
	var typeOptions = '<option value="">All Types</option>';
	Object.keys(LH_TYPES).forEach(function (key) {
		typeOptions += '<option value="' + key + '"' + (f.type === key ? ' selected' : '') + '>' + LH_TYPES[key].label + '</option>';
	});
	var statusOptions = '<option value="">All Statuses</option>';
	Object.keys(LH_STATUS).forEach(function (key) {
		statusOptions += '<option value="' + key + '"' + (f.status === key ? ' selected' : '') + '>' + LH_STATUS[key].label + '</option>';
	});
	var sizeOptions = '';
	[10, 25, 50, 100].forEach(function (size) {
		sizeOptions += '<option value="' + size + '"' + (f.pageSize === size ? ' selected' : '') + '>' + size + '</option>';
	});
	var addBtn = data.canManage
		? '<div class="page-title-actions"><button type="button" class="btn btn-primary" onclick="openLoginHighlightModal()"><i class="fa fa-plus mr-1"></i>Add Highlight</button></div>'
		: '';
	var rows = data.rows || [];
	var approved = rows.filter(function (r) { return r.status === 'APPROVED'; }).length;

	return ''
	/* Theme CSS hides select2 text whenever the chosen option's value is "" (even with .is-filled); here
	   "" is a real choice (All Types / All Statuses), so keep it visible. Same fix as teacherRatingContent.js. */
	+ '<style>#lhPage .custom-field.is-filled .select2-selection__rendered,'
	+ '#loginHighlightModal .custom-field.is-filled .select2-selection__rendered{color:var(--custom-field-value, #3c4043) !important;}</style>'
	+ '<div class="custom-field-scope" id="lhPage">'
	+ '<div class="app-page-title mb-3 py-2"><div class="page-title-wrapper">'
	+   '<div class="page-title-heading">'
	+     '<div class="page-title-icon"><i class="fa fa-calendar-check-o text-primary"></i></div>'
	+     '<div><span class="text-primary welcome-name-text">' + lhEsc(title) + '</span></div>'
	+   '</div>'
	+   addBtn
	+ '</div></div>'

	/* Filters */
	+ '<div class="card shadow-sm mb-3"><div class="card-body"><div class="row align-items-end">'
	+   '<div class="col-md-2 mb-2"><div class="form-group custom-field mb-0 is-filled">'
	+     '<select class="form-control" id="lhFilterShow">'
	+       '<option value="range"' + (f.annual ? '' : ' selected') + '>Date Range</option>'
	+       '<option value="annual"' + (f.annual ? ' selected' : '') + '>Fixed Days (Every Year)</option>'
	+     '</select><label class="font-weight-bold mb-1">Show</label></div></div>'
	+   '<div class="col-md-2 mb-2 lhRangeWrap"' + (f.annual ? ' style="display:none"' : '') + '><div class="form-group custom-field mb-0">'
	+     '<input type="text" class="form-control" id="lhFilterFrom" placeholder="From date" autocomplete="off" readonly>'
	+     '<label class="font-weight-bold mb-1">From Date</label></div></div>'
	+   '<div class="col-md-2 mb-2 lhRangeWrap"' + (f.annual ? ' style="display:none"' : '') + '><div class="form-group custom-field mb-0">'
	+     '<input type="text" class="form-control" id="lhFilterTo" placeholder="To date" autocomplete="off" readonly>'
	+     '<label class="font-weight-bold mb-1">To Date</label></div></div>'
	+   '<div class="col-md-2 mb-2"><div class="form-group custom-field mb-0 is-filled">'
	+     '<select class="form-control" id="lhFilterType">' + typeOptions + '</select>'
	+     '<label class="font-weight-bold mb-1">Type</label></div></div>'
	+   '<div class="col-md-2 mb-2"><div class="form-group custom-field mb-0 is-filled">'
	+     '<select class="form-control" id="lhFilterStatus">' + statusOptions + '</select>'
	+     '<label class="font-weight-bold mb-1">Status</label></div></div>'
	+   '<div class="col-12 col-md-auto mb-2">'
	+     '<button class="btn btn-success btn-lg mr-2" onclick="applyLoginHighlightsFilter()"><i class="fa fa-search mr-1"></i>Search</button>'
	+     '<button class="btn btn-danger btn-lg" onclick="resetLoginHighlightsFilter()">Reset</button>'
	+   '</div>'
	+ '</div></div></div>'

	/* Summary stat cards */
	+ '<div class="row mb-3">'
	+   lhStatCard('Waiting For Review', data.pendingCount || 0, (data.pendingCount ? 'text-warning' : ''), 'Pending items, all dates')
	+   lhStatCard('Login Page Card', data.serviceOn ? 'On' : 'Off', data.serviceOn ? 'text-success' : 'text-danger', 'LOGIN_HIGHLIGHT_SERVICE')
	+   lhStatCard('Auto-Approve', data.autoApprove ? 'On' : 'Off', data.autoApprove ? 'text-success' : 'text-warning',
			data.autoApprove ? 'AI items show straight away' : 'AI items wait here as Pending')
	+   lhStatCard('In This View', rows.length, '', approved + ' approved')
	+ '</div>'

	/* Table */
	+ '<div class="main-card card"><div class="card-body table-responsive">'
	/* Fixed-width wrappers: the theme gives every .custom-field width:100%, so size the box around it instead. */
	+   '<div class="d-flex align-items-center justify-content-between flex-wrap mb-2" style="gap:12px">'
	+     '<div style="flex:0 0 100px;width:100px">'
	+       '<div class="form-group custom-field mb-0 is-filled">'
	+         '<select class="form-control" id="lhFilterPageSize">' + sizeOptions + '</select>'
	+         '<label class="font-weight-bold mb-1">Size</label></div></div>'
	+     '<div style="flex:0 1 280px;width:280px;max-width:100%">'
	+       '<div class="form-group custom-field mb-0">'
	+         '<input type="text" class="form-control" id="lhFilterSearch" placeholder="Title or text" autocomplete="off" value="' + lhEsc(f.search) + '">'
	+         '<label class="font-weight-bold mb-1"><i class="fa fa-search mr-1"></i>Search</label></div></div>'
	+   '</div>'
	+   '<div id="lhTableWrap"></div>'
	+ '</div></div>'
	+ '</div>';
}

function lhStatCard(label, value, valueClass, sub) {
	return '<div class="col-md-3 col-6 mb-2"><div class="main-card card h-100"><div class="card-body py-2">'
		+ '<div class="small text-muted text-uppercase font-weight-bold" style="letter-spacing:.4px">' + lhEsc(label) + '</div>'
		+ '<div class="h4 mb-0 mt-1 ' + valueClass + '">' + lhEsc(value) + '</div>'
		+ '<div class="small text-muted">' + lhEsc(sub) + '</div>'
		+ '</div></div></div>';
}

function lhInitFilters() {
	var f = __loginHighlightsFilter;
	$('#lhFilterShow, #lhFilterType, #lhFilterStatus').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
	$('#lhFilterPageSize').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%' });
	$('#lhFilterFrom, #lhFilterTo').datepicker({ autoclose: true, format: 'M dd, yyyy', todayHighlight: true, container: 'body' });
	$('#lhFilterFrom').datepicker('update', lhParseYmd(f.from));
	$('#lhFilterTo').datepicker('update', lhParseYmd(f.to));

	$('#lhFilterShow').on('change', function () {
		$('.lhRangeWrap').toggle($(this).val() !== 'annual');
	});
	$('#lhFilterFrom, #lhFilterTo').on('changeDate clearDate', function () {
		refreshCustomFieldState($(this).closest('.custom-field'));
	});
	var searchTimer = null;
	$('#lhFilterSearch').on('input', function () {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(function () {
			f.search = ($('#lhFilterSearch').val() || '').trim();
			lhRenderTable();
		}, 250);
	});
	// Type, status, search and size only narrow the rows already loaded; no reload needed.
	$('#lhFilterType, #lhFilterStatus').on('change', function () {
		f.type = $('#lhFilterType').val();
		f.status = $('#lhFilterStatus').val();
		lhRenderTable();
	});
	$('#lhFilterPageSize').on('change', function () {
		f.pageSize = parseInt($(this).val(), 10) || 25;
		lhRenderTable();
	});
}

function applyLoginHighlightsFilter() {
	var f = __loginHighlightsFilter;
	var annual = $('#lhFilterShow').val() === 'annual';
	var from = lhToYmd($('#lhFilterFrom').datepicker('getDate'));
	var to = lhToYmd($('#lhFilterTo').datepicker('getDate'));
	f.type = $('#lhFilterType').val();
	f.status = $('#lhFilterStatus').val();
	f.search = ($('#lhFilterSearch').val() || '').trim();
	// Date range / fixed days come from the server; the rest is filtered in the table.
	if (annual !== f.annual || from !== f.from || to !== f.to) {
		f.annual = annual;
		f.from = from;
		f.to = to;
		lhReload();
	} else {
		lhRenderTable();
	}
}

function resetLoginHighlightsFilter() {
	__loginHighlightsFilter = { from: '', to: '', annual: false, type: '', status: '', search: '', pageSize: 25 };
	lhReload();
}

/* ------------------------------------------------------------------ *
 *  Table
 * ------------------------------------------------------------------ */

function lhRenderTable() {
	var data = __loginHighlightsData || {};
	var f = __loginHighlightsFilter;
	var search = (f.search || '').toLowerCase();
	var rows = (data.rows || []).filter(function (row) {
		if ((f.type && row.type !== f.type) || (f.status && row.status !== f.status)) {
			return false;
		}
		if (!search) {
			return true;
		}
		return [row.title, row.message, row.funFact, row.countryName].join(' ').toLowerCase().indexOf(search) > -1;
	});

	if ($.fn.DataTable.isDataTable('#loginHighlightsTable')) {
		$('#loginHighlightsTable').DataTable().clear().destroy();
	}
	var body = '';
	if (!rows.length) {
		body = '<tr><td colspan="8" class="text-center text-muted py-4">No highlights found</td></tr>';
	} else {
		rows.forEach(function (row, index) {
			body += lhRowHtml(row, index, data.canManage);
		});
	}
	$('#lhTableWrap').html(
		'<table class="table table-bordered border-radius-table font-12" id="loginHighlightsTable" style="width:100%">'
		+ '<thead class="bg-primary text-white"><tr>'
		+   '<th>#</th><th>Date</th><th>Type</th><th>Country</th><th style="min-width:300px">Highlight</th><th>Source</th><th>Status</th><th>Action</th>'
		+ '</tr></thead><tbody>' + body + '</tbody></table>');
	if (rows.length) {
		$('#loginHighlightsTable').DataTable({
			destroy: true,
			ordering: false,
			searching: false,
			lengthChange: false,
			info: true,
			autoWidth: false,
			pageLength: f.pageSize || 25,
		});
	}
}

function lhRowHtml(row, index, canManage) {
	var type = LH_TYPES[row.type] || { label: row.type, color: '#6c757d', icon: 'fa-calendar' };
	var status = LH_STATUS[row.status] || { label: row.status, badge: 'badge-secondary', icon: 'fa-circle' };
	var source = LH_SOURCE[row.source] || { label: row.source, badge: 'badge-secondary' };

	var dateCell = row.annual
		? '<div class="font-weight-bold">' + lhEsc(lhFormatDate(row.date, false)) + '</div>'
			+ '<span class="badge badge-light border mt-1"><i class="fa fa-repeat mr-1"></i>Every year</span>'
		: '<div class="font-weight-bold">' + lhEsc(lhFormatDate(row.date, true)) + '</div>';
	var typeLabel = type.label + (row.type === 'ON_THIS_DAY' && row.eventYear ? ' &middot; ' + row.eventYear : '');
	var highlight = '<div class="font-weight-bold mb-1">' + (row.emoji ? '<span class="mr-1">' + lhEsc(row.emoji) + '</span>' : '') + lhEsc(row.title) + '</div>'
		+ '<div class="text-muted">' + lhEsc(row.message) + '</div>';
	if (row.funFact) {
		highlight += '<div class="small mt-1"><span class="badge badge-light border mr-1">Did you know?</span>' + lhEsc(row.funFact) + '</div>';
	}

	var actions = '<span class="text-muted">&mdash;</span>';
	if (canManage) {
		actions = '<div class="d-flex" style="gap:6px">'
			+ (row.status !== 'APPROVED'
				? '<button class="btn btn-outline-success btn-sm" title="Approve" onclick="confirmLoginHighlightStatus(' + row.id + ', \'APPROVED\')"><i class="fa fa-check"></i></button>' : '')
			+ (row.status !== 'REJECTED'
				? '<button class="btn btn-outline-danger btn-sm" title="Reject" onclick="confirmLoginHighlightStatus(' + row.id + ', \'REJECTED\')"><i class="fa fa-ban"></i></button>' : '')
			+ '<button class="btn btn-outline-primary btn-sm" title="Edit" onclick="openLoginHighlightModal(' + row.id + ')"><i class="fa fa-pencil"></i></button>'
			+ '</div>';
	}

	return '<tr>'
		+ '<td>' + (index + 1) + '</td>'
		+ '<td style="white-space:nowrap">' + dateCell + '</td>'
		+ '<td style="white-space:nowrap"><span class="badge badge-light border" style="font-size:11px;color:' + type.color + '"><i class="fa ' + type.icon + ' mr-1"></i>' + typeLabel + '</span></td>'
		+ '<td>' + lhEsc(row.countryName) + '</td>'
		+ '<td style="white-space:normal">' + highlight + '</td>'
		+ '<td style="white-space:nowrap"><span class="badge ' + source.badge + '">' + lhEsc(source.label) + '</span>'
		+   (row.edited ? '<div class="small text-muted mt-1">Updated by ' + lhEsc(row.updatedByName) + '</div>' : '') + '</td>'
		+ '<td style="white-space:nowrap"><span class="badge ' + status.badge + '"><i class="fa ' + status.icon + ' mr-1"></i>' + lhEsc(status.label) + '</span>'
		+   lhReviewHtml(row) + '</td>'
		+ '<td>' + actions + '</td>'
		+ '</tr>';
}

/* Under the status: who decided it. Nobody has touched it yet = the daily job (or the fixed list) set it on its own;
   otherwise the last person who approved, rejected or edited it. */
function lhReviewHtml(row) {
	if (row.edited) {
		return '<div class="small text-muted mt-1"><i class="fa fa-user mr-1"></i>Manual &middot; ' + lhEsc(row.updatedByName) + '</div>';
	}
	if (row.status === 'PENDING') {
		return '';
	}
	return '<div class="small text-muted mt-1"><i class="fa fa-magic mr-1"></i>Auto</div>';
}

/* Approve / reject go live on the login page, so ask first (same confirm popup as the other admin modules). */
function confirmLoginHighlightStatus(id, status) {
	var message = status === 'REJECTED'
		? 'Are you sure you want to reject this highlight? It will no longer show on the login page.'
		: 'Are you sure you want to approve this highlight? It will show on the login page.';
	showWarningMessage(message, 'setLoginHighlightStatus(' + id + ', "' + status + '")');
}

function setLoginHighlightStatus(id, status) {
	$.ajax({
		url: loginHighlightsUrl('status', id + '/' + status),
		type: 'POST',
		contentType: 'application/json',
		beforeSend: function (xhr) {
			xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID);
		},
		success: function (res) {
			if (res && res.status == '1') {
				showMessageTheme2(1, res.message || 'Done.');
				lhReload();
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
 *  Add / edit modal
 * ------------------------------------------------------------------ */

function lhModalHtml(data) {
	var typeOptions = '';
	Object.keys(LH_TYPES).forEach(function (key) {
		typeOptions += '<option value="' + key + '">' + LH_TYPES[key].label + '</option>';
	});
	var countryOptions = '<option value="">Select Country</option>';
	(data.countries || []).forEach(function (c) {
		countryOptions += '<option value="' + lhEsc(c.code) + '">' + lhEsc(c.name) + '</option>';
	});
	return ''
	+ '<div class="modal fade" id="loginHighlightModal" tabindex="-1" role="dialog" aria-hidden="true">'
	+  '<div class="modal-dialog modal-dialog-centered modal-lg shadow-none" role="document"><div class="modal-content">'
	+   '<div class="modal-header bg-primary text-white">'
	+     '<h5 class="modal-title"><i class="fa fa-calendar-check-o mr-2"></i><span id="lhModalTitle">Add Highlight</span></h5>'
	+     '<button type="button" class="close text-white" data-dismiss="modal"><i class="fa fa-times"></i></button>'
	+   '</div>'
	+   '<div class="modal-body custom-field-scope">'
	+     '<input type="hidden" id="lhId" />'
	+     '<div class="row">'
	+       '<div class="col-md-4 mb-3"><div class="form-group custom-field mb-0">'
	+         '<input type="text" class="form-control" id="lhDate" placeholder="Date" autocomplete="off" readonly>'
	+         '<label class="font-weight-bold mb-1">Date <span class="text-danger">*</span></label></div></div>'
	+       '<div class="col-md-4 mb-3"><div class="form-group custom-field mb-0 is-filled">'
	+         '<select class="form-control" id="lhFormType">' + typeOptions + '</select>'
	+         '<label class="font-weight-bold mb-1">Type <span class="text-danger">*</span></label></div></div>'
	+       '<div class="col-md-4 mb-3" id="lhCountryWrap"><div class="form-group custom-field mb-0">'
	+         '<select class="form-control" id="lhCountry">' + countryOptions + '</select>'
	+         '<label class="font-weight-bold mb-1">Country <span class="text-danger">*</span></label></div></div>'
	+       '<div class="col-md-4 mb-3" id="lhYearWrap"><div class="form-group custom-field mb-0">'
	+         '<input type="number" class="form-control" id="lhYear" min="1" max="' + new Date().getFullYear() + '" placeholder="Year it happened">'
	+         '<label class="font-weight-bold mb-1">Year It Happened <span class="text-danger">*</span></label></div></div>'
	+     '</div>'
	+     '<div class="row"><div class="col-md-9">' + lhTextField('lhTitle', 'Title', 60, true, false) + '</div>'
	+     '<div class="col-md-3">' + lhTextField('lhEmoji', 'Emoji', 16, false, false) + '</div></div>'
	+     lhTextField('lhMessage', 'Message', 200, true, true)
	+     lhTextField('lhFunFact', 'Fun Fact (Did you know?)', 160, false, true)
	+     '<div class="row align-items-center">'
	+       '<div class="col-md-6 mb-3"><div class="form-group custom-field mb-0 is-filled">'
	+         '<select class="form-control" id="lhFormStatus">'
	+           '<option value="APPROVED">Approved (shows on the login page)</option>'
	+           '<option value="PENDING">Pending (hidden until approved)</option>'
	+         '</select><label class="font-weight-bold mb-1">Status</label></div></div>'
	+       '<div class="col-md-6 mb-3" id="lhAnnualWrap"><div class="custom-control custom-checkbox">'
	+         '<input type="checkbox" class="custom-control-input" id="lhFormAnnual">'
	+         '<label class="custom-control-label" for="lhFormAnnual">Repeat every year on this date</label></div></div>'
	+     '</div>'
	+     '<div class="small text-muted"><i class="fa fa-info-circle mr-1"></i>Keep it suitable for students aged 5 to 18: no religious, political, war, disaster or mourning days.</div>'
	+   '</div>'
	+   '<div class="modal-footer">'
	+     '<button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>'
	+     '<button type="button" class="btn btn-success" id="lhSaveBtn" onclick="saveLoginHighlight()"><i class="fa fa-check mr-1"></i>Save</button>'
	+   '</div>'
	+  '</div></div>'
	+ '</div>';
}

function lhTextField(id, label, max, required, multiline) {
	var input = multiline
		? '<textarea class="form-control" id="' + id + '" rows="2" maxlength="' + max + '" placeholder="' + lhEsc(label) + '"></textarea>'
		: '<input type="text" class="form-control" id="' + id + '" maxlength="' + max + '" placeholder="' + lhEsc(label) + '" autocomplete="off">';
	return '<div class="mb-3"><div class="form-group custom-field mb-0">' + input
		+ '<label class="font-weight-bold mb-1">' + label + (required ? ' <span class="text-danger">*</span>' : '') + '</label></div>'
		+ '<div class="small text-muted text-right lh-counter" data-for="' + id + '" data-max="' + max + '"></div></div>';
}

function lhInitModal() {
	$('#lhFormType, #lhFormStatus').select2({ theme: 'bootstrap4', minimumResultsForSearch: Infinity, width: '100%', dropdownParent: $('#loginHighlightModal') });
	$('#lhCountry').select2({ theme: 'bootstrap4', width: '100%', dropdownParent: $('#loginHighlightModal') });
	$('#lhDate').datepicker({ autoclose: true, format: 'M dd, yyyy', todayHighlight: true, container: '#loginHighlightModal' });
	$('#lhDate').on('changeDate clearDate', function () {
		refreshCustomFieldState($(this).closest('.custom-field'));
	});
	$('#lhFormType').on('change', lhSyncTypeFields);
	$('#lhTitle, #lhMessage, #lhFunFact').on('input', lhUpdateCounters);
}

/* National day needs a country; on-this-day needs a year and never repeats; the others repeat by default. */
function lhSyncTypeFields() {
	var type = $('#lhFormType').val();
	$('#lhCountryWrap').toggle(type === 'NATIONAL_DAY');
	$('#lhYearWrap').toggle(type === 'ON_THIS_DAY');
	$('#lhAnnualWrap').toggle(type !== 'ON_THIS_DAY');
}

function lhUpdateCounters() {
	$('.lh-counter').each(function () {
		var max = parseInt($(this).data('max'), 10);
		var length = ($('#' + $(this).data('for')).val() || '').length;
		$(this).text(length + ' / ' + max).toggleClass('text-danger', length >= max).toggleClass('text-muted', length < max);
	});
}

function openLoginHighlightModal(id) {
	var row = null;
	if (id !== undefined && id !== null) {
		row = ((__loginHighlightsData && __loginHighlightsData.rows) || []).filter(function (r) {
			return r.id === id;
		})[0] || null;
	}
	$('#lhModalTitle').text(row ? 'Edit Highlight' : 'Add Highlight');
	$('#lhId').val(row ? row.id : '');
	$('#lhDate').datepicker('update', row ? lhParseYmd(row.date) : (__loginHighlightsFilter.annual ? '' : new Date()));
	$('#lhFormType').val(row ? row.type : 'INTERNATIONAL_DAY').trigger('change.select2');
	$('#lhCountry').val(row && row.type === 'NATIONAL_DAY' ? row.countryCode : '').trigger('change.select2');
	$('#lhYear').val(row && row.eventYear ? row.eventYear : '');
	$('#lhTitle').val(row ? row.title : '');
	$('#lhEmoji').val(row && row.emoji ? row.emoji : '');
	$('#lhMessage').val(row ? row.message : '');
	$('#lhFunFact').val(row && row.funFact ? row.funFact : '');
	$('#lhFormStatus').val(row && row.status === 'PENDING' ? 'PENDING' : 'APPROVED').trigger('change.select2');
	$('#lhFormAnnual').prop('checked', row ? row.annual : true);
	lhSyncTypeFields();
	lhUpdateCounters();
	refreshCustomFieldState('#loginHighlightModal');
	$('#loginHighlightModal').modal('show');
}

function saveLoginHighlight() {
	var type = $('#lhFormType').val();
	var payload = {
		id: $('#lhId').val() ? parseInt($('#lhId').val(), 10) : null,
		date: lhToYmd($('#lhDate').datepicker('getDate')),
		type: type,
		countryCode: type === 'NATIONAL_DAY' ? $('#lhCountry').val() : '',
		title: ($('#lhTitle').val() || '').trim(),
		emoji: ($('#lhEmoji').val() || '').trim(),
		message: ($('#lhMessage').val() || '').trim(),
		funFact: ($('#lhFunFact').val() || '').trim(),
		eventYear: type === 'ON_THIS_DAY' && $('#lhYear').val() ? parseInt($('#lhYear').val(), 10) : null,
		annual: type !== 'ON_THIS_DAY' && $('#lhFormAnnual').is(':checked'),
		status: $('#lhFormStatus').val()
	};
	if (!payload.date) {
		showMessageTheme2(0, 'Please choose a date.');
		return;
	}
	if (type === 'NATIONAL_DAY' && !payload.countryCode) {
		showMessageTheme2(0, 'Please choose the country for this national day.');
		return;
	}
	if (type === 'ON_THIS_DAY' && !payload.eventYear) {
		showMessageTheme2(0, 'Please enter the year it happened.');
		return;
	}
	if (!payload.title || !payload.message) {
		showMessageTheme2(0, 'Please enter a title and a message.');
		return;
	}

	$('#lhSaveBtn').prop('disabled', true);
	$.ajax({
		url: loginHighlightsUrl('save'),
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		// Bypass the global encrypt-wrap beforeSend: /save reads @RequestBody directly.
		beforeSend: function (xhr) {
			xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID);
		},
		success: function (res) {
			$('#lhSaveBtn').prop('disabled', false);
			if (res && res.status == '1') {
				$('#loginHighlightModal').modal('hide');
				// The page is re-rendered right away, so the modal's hide transition never finishes;
				// clear its backdrop / body lock here (same as MotivationalQuotesContent.js).
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open').css({ 'overflow': '', 'padding-right': '' });
				showMessageTheme2(1, res.message || 'Saved.');
				lhReload();
			} else {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Could not save the highlight.');
			}
		},
		error: function () {
			$('#lhSaveBtn').prop('disabled', false);
			showMessageTheme2(0, 'Could not save the highlight. Please try again.');
		},
	});
}
