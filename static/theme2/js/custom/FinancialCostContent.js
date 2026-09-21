/*
 * Financial Cost Distribution — JS-rendered module (no JSP).
 *
 *  Five tabs (matches the design mockup): Overview, Cost Items, Categories,
 *  Distribution & Run, Reports. One JSON call (/dashboard/financial-cost/data
 *  [/{sessionId}]) hydrates the master + dropdowns; runs and reports load on
 *  demand. Rendered from adminController.js contentHandlers ('financial-cost').
 *
 *  Follows the MotivationalQuotesContent.js pattern. Save/delete/run POST plain
 *  JSON and override the global encrypt-wrap beforeSend (controller reads
 *  @RequestBody directly). Theme colour = var(--pc) (PARENT_COLOR); currency =
 *  SCHOOL_SETTINGS_TECHNICAL.CURRENCY_ISO_CODE (data.currency).
 */

var __financialCostData = null;
var __fcCurrentSessionId = null;
var __fcCurrency = 'USD';
var __fcCharts = {};             // id -> ApexCharts instance (destroy before re-render)
var __fcOverviewLoaded = false;

function financialCostUrl(action, id) {
	var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/financial-cost/' + action;
	if (id !== undefined && id !== null && id !== '') { url += '/' + id; }
	url += '/' + UNIQUEUUID;
	return url;
}

function fcEsc(value) {
	if (value === undefined || value === null) { return ''; }
	return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function fcMoney(amount, currency) {
	if (amount === undefined || amount === null || amount === '') { return '<span class="text-muted">Linked</span>'; }
	var num = Number(amount);
	if (isNaN(num)) { return fcEsc(amount); }
	return fcEsc(currency || __fcCurrency) + ' ' + num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Format a small per-second money rate with up to 6 decimals; 0/empty -> em dash. */
function fcRate(amount) {
	if (amount === undefined || amount === null || amount === '') { return '<span class="text-muted">—</span>'; }
	var num = Number(amount);
	if (isNaN(num)) { return fcEsc(amount); }
	if (num === 0) { return '<span class="text-muted">—</span>'; }
	return fcEsc(__fcCurrency) + ' ' + num.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 });
}

/** Format a seconds count as hh:mm:ss (hours are not zero-padded; 0 -> 00:00:00). */
function fcDuration(seconds) {
	var s = Math.max(0, Math.round(Number(seconds) || 0));
	var h = Math.floor(s / 3600);
	var m = Math.floor((s % 3600) / 60);
	var sec = s % 60;
	var pad = function (n) { return (n < 10 ? '0' : '') + n; };
	return pad(h) + ':' + pad(m) + ':' + pad(sec);
}

function fcAccent() {
	return (getComputedStyle(document.documentElement).getPropertyValue('--pc') || '#3378b7').trim();
}

/** The href (e.g. '#fcTabReports') of the currently active Cost-distribution tab. */
function fcActiveTab() {
	return $('#fcTabs .nav-link.active').attr('href');
}

function fcDestroyChart(id) {
	if (__fcCharts[id]) { try { __fcCharts[id].destroy(); } catch (e) {} delete __fcCharts[id]; }
	var el = document.querySelector('#' + id);
	if (el) { el.innerHTML = ''; }
}

function fcBarChart(id, categories, values, title, horizontal) {
	var el = document.querySelector('#' + id);
	if (!el) { return; }
	fcDestroyChart(id);
	if (!values || values.length === 0) { el.innerHTML = '<p class="text-muted small">No data yet.</p>'; return; }
	var opts = {
		series: [{ name: 'Cost', data: values }],
		chart: { height: 300, type: 'bar', toolbar: { show: false } },
		colors: [fcAccent()],
		plotOptions: { bar: { borderRadius: 6, horizontal: !!horizontal, columnWidth: '45%', dataLabels: { position: 'top' } } },
		dataLabels: { enabled: !horizontal, formatter: function (v) { return __fcCurrency + ' ' + Number(v).toLocaleString(); }, offsetY: -20, style: { fontSize: '11px', colors: ['#304758'] } },
		xaxis: { categories: categories, axisBorder: { show: false }, axisTicks: { show: false } },
		yaxis: { labels: { formatter: function (v) { return Number(v).toLocaleString(); } } },
		tooltip: { y: { formatter: function (v) { return __fcCurrency + ' ' + Number(v).toLocaleString(); } } },
		title: { text: title, align: 'left', style: { fontSize: '13px', color: '#5a6473' } },
	};
	__fcCharts[id] = new ApexCharts(el, opts);
	__fcCharts[id].render();
}

/* ------------------------------------------------------------------ entry */
async function renderFinancialCost(title, roleAndModule, schoolId, userId, userRole) {
	await loadFinancialCost(null);
}

async function loadFinancialCost(sessionId, month, keepTab) {
	try {
		customLoader(true);
		var seg = sessionId ? (sessionId + '/' + (month || 'ALL')) : '';
		var data = await callCommonAjax({ method: 'GET', url: financialCostUrl('data', seg), global: false, showMessage: false });
		customLoader(false);
		if (!data || data.status != '1') {
			if (data && data.sessions && data.sessions.length === 0) {
				$('#dashboardContentInHTML').html('<div class="main-card mb-3 card"><div class="card-body">' + fcEsc(data.message) + '</div></div>');
				return;
			}
			showMessageTheme2(0, (data && data.message) ? data.message : 'Unable to load cost data. Please try again.');
			return;
		}
		__financialCostData = data;
		__fcCurrentSessionId = data.sessionId;
		__fcCurrency = data.currency || 'USD';
		__fcOverviewLoaded = false;
		fcInjectCss();
		$('#dashboardContentInHTML').html(fcBuildShell(data));
		fcRenderOverviewStatic(data);
		fcRenderCategoryChart(data);
		fcRenderItemsTable(data);
		fcRenderCategories(data);
		fcBindEvents();
		fcLoadOverviewRun(); // fill distributed / per-product KPIs from latest completed run
		// Re-render rebuilds the shell (Overview active by default). On a session/month
		// change, stay on whichever tab the user was on and reload just that tab's data.
		if (keepTab && keepTab !== '#fcTabOverview' && $('#fcTabs a[href="' + keepTab + '"]').length) {
			$('#fcTabs a[href="' + keepTab + '"]').tab('show');
		}
	} catch (e) {
		customLoader(false);
		showMessageTheme2(0, 'Unable to load cost data. Please try again.');
	}
}

function fcInjectCss() {
	if ($('#financialCostCss').length > 0) { return; }
	$('head').append('<style id="financialCostCss">'
		+ '.fc-kpis{display:flex;flex-wrap:wrap;gap:14px;margin-bottom:16px;}'
		+ '.fc-kpi{flex:1 1 170px;background:#fff;border:1px solid #e6e9ee;border-radius:8px;padding:14px 16px;}'
		+ '.fc-kpi .lbl{font-size:11px;letter-spacing:.02em;color:#8a94a2;}'
		+ '.fc-kpi .val{font-size:22px;font-weight:700;margin-top:6px;color:#1c2430;}'
		+ '.fc-kpi.accent{border-top:3px solid var(--pc);}'
		+ '.fc-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;}'
		+ '.fc-badge.direct{background:rgba(51,120,183,.12);color:var(--pc);}'
		+ '.fc-badge.overhead{background:#f1f3f6;color:#5a6473;border:1px solid #e0e4ea;}'
		+ '.fc-badge.grade{background:rgba(43,74,122,.10);color:#2b4a7a;}'
		+ '.fc-badge.gradeall{background:#f1f3f6;color:#8a94a2;}'
		+ '.fc-badge.draft{background:#f6ebd8;color:#8a5a12;}'
		+ '.fc-badge.active{background:rgba(15,92,74,.12);color:#0f5c4a;}'
		+ '.fc-desc{max-width:320px;font-size:12px;color:#5a6473;}'
		+ '.fc-method{border:1.5px solid #e3e8ef;border-radius:10px;padding:14px;height:100%;}'
		+ '.fc-method h6{color:var(--pc);} .fc-method .formula{margin-top:8px;font-family:monospace;font-size:11.5px;background:#f6f8fb;border:1px dashed #ccd4de;border-radius:6px;padding:8px;}'
		+ '.fc-step{background:#f6f8fb;border:1px solid #e3e8ef;border-radius:8px;padding:10px;height:100%;}'
		+ '.fc-step .n{font-family:monospace;color:var(--pc);font-weight:600;font-size:11px;} .fc-step b{display:block;margin:3px 0;font-size:12.5px;} .fc-step span{font-size:11.5px;color:#5a6473;}'
		+ '#financialCostTable td,#fcStudentTable td{vertical-align:middle;}'
		+ '</style>');
}

function fcBuildShell(data) {
	var sessionOpts = (data.sessions || []).map(function (s) {
		return '<option value="' + s.id + '"' + (s.id === data.sessionId ? ' selected' : '') + '>'
			+ fcEsc(s.name) + (s.serving ? ' (serving)' : '') + '</option>';
	}).join('');
	var monthOpts = (data.months || []).map(function (m) {
		return '<option value="' + fcEsc(m.value) + '"' + (m.value === data.month ? ' selected' : '') + '>' + fcEsc(m.label) + '</option>';
	}).join('') || '<option value="ALL">Whole academic year</option>';
	var repProductOpts = (data.products || []).map(function (o) {
		return '<option value="' + fcEsc(o.value) + '">' + fcEsc(o.label) + '</option>';
	}).join('');
	var repGradeOpts = '<option value="0">All grades</option>' + (data.grades || []).map(function (g) {
		return '<option value="' + g.id + '">' + fcEsc(g.name) + '</option>';
	}).join('');

	return ''
		+ '<div class="main-card mb-3 card"><div class="card-body">'
		+ '  <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">'
		+ '    <h5 class="mb-0" style="color:var(--pc);">Cost distribution</h5>'
		+ '    <div class="d-flex align-items-center" style="gap:10px;">'
		+ '      <label class="mb-0 small text-muted">Academic year</label>'
		+ '      <select id="fcSessionSelect" class="form-control form-control-sm" style="width:auto;">' + sessionOpts + '</select>'
		+ '      <label class="mb-0 small text-muted">Month</label>'
		+ '      <select id="fcTopMonth" class="form-control form-control-sm" style="width:auto;">' + monthOpts + '</select>'
		+ '    </div>'
		+ '  </div>'
		+ '  <ul class="nav nav-tabs mb-3" id="fcTabs">'
		+ '    <li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#fcTabOverview">Overview</a></li>'
		+ '    <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#fcTabReports">Reports</a></li>'
		+ '    <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#fcTabIncome">Income &amp; P/L</a></li>'
		+ '    <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#fcTabItems">Cost items</a></li>'
		+ '    <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#fcTabCats">Categories</a></li>'
		+ '  </ul>'
		+ '  <div class="tab-content">'
		+ fcOverviewPane()
		+ fcItemsPane(data)
		+ fcCategoriesPane(data)
		+ '    <div class="tab-pane fade" id="fcTabReports">'
		+ fcMethodCards()
		+ '      <div class="d-flex align-items-center flex-wrap mb-3" style="gap:10px;">'
		+ '        <label class="mb-0 small text-muted">View</label>'
		+ '        <select id="fcRepView" class="form-control form-control-sm" style="width:auto;">'
		+ '          <option value="product">By Learning Program</option><option value="teacher">By teacher</option><option value="student">By student</option><option value="salaries">Teacher salaries</option></select>'
		+ '        <select id="fcStudentLpFilter" class="form-control form-control-sm" style="width:auto;display:none;" title="Filter the per-student cost sheet"></select>'
		+ '        <select id="fcRepLp" class="form-control form-control-sm" style="width:auto;display:none;">' + repProductOpts + '</select>'
		+ '        <select id="fcRepGrade" class="form-control form-control-sm" style="width:auto;display:none;">' + repGradeOpts + '</select>'
		+ '        <select id="fcRepPicker" class="form-control form-control-sm" style="width:260px;display:none;"></select>'
		+ '        <button type="button" id="fcRepReset" class="btn btn-sm btn-light" style="display:none;">Reset</button>'
		+ '        <input type="hidden" id="fcRepEntity">'
		+ '        <span class="text-muted small ml-auto">Uses the academic year &amp; month selected at the top right.</span>'
		+ '      </div>'
		+ '      <div id="fcReportBody"><p class="text-muted">Choose a view, session and month to generate the report.</p></div>'
		+ '    </div>'
		+ '    <div class="tab-pane fade" id="fcTabIncome"><div id="fcIncomeBody"><p class="text-muted">Loading…</p></div></div>'
		+ '  </div>'
		+ '</div></div>'
		+ fcItemModal(data) + fcCategoryModal(data) + fcCategoryItemsModal();
}

/* ---------------- Overview ---------------- */
function fcOverviewPane() {
	return ''
		+ '    <div class="tab-pane fade show active" id="fcTabOverview">'
		+ '      <div class="fc-kpis">'
		+ '        <div class="fc-kpi accent"><div class="lbl">Total school cost</div><div class="val" id="fcKpiTotal">—</div></div>'
		+ '        <div class="fc-kpi"><div class="lbl">Distributed to students</div><div class="val" id="fcKpiDistributed">—</div></div>'
		+ '        <div class="fc-kpi"><div class="lbl">Avg cost / student</div><div class="val" id="fcKpiAvg">—</div></div>'
		+ '        <div class="fc-kpi"><div class="lbl">Last computation run</div><div class="val" id="fcKpiLastRun" style="font-size:15px;">—</div></div>'
		+ '      </div>'
		+ '      <div class="row">'
		+ '        <div class="col-md-6"><div id="fcOvProductChart"></div></div>'
		+ '        <div class="col-md-6"><div id="fcOvCategoryChart"></div></div>'
		+ '      </div>'
		+ '      <h6 class="mt-3">How a cost flows to a student</h6>'
		+ '      <div class="row">'
		+ fcStep('01', 'Cost item', 'Admin adds an amount for the year + a distribution method.')
		+ fcStep('02', 'Pick population', 'Active students, scoped by learning program &amp; grade.')
		+ fcStep('03', 'Compute weights', 'Equal, teacher-seconds, meeting-minutes or product weight.')
		+ fcStep('04', 'Allocate', 'Amount × weight → per-student rows, snapshotted per run.')
		+ fcStep('05', 'Roll up', 'Totals by product, category &amp; student for reporting.')
		+ '      </div>'
		+ '    </div>';
}
function fcStep(n, title, desc) {
	return '<div class="col"><div class="fc-step"><span class="n">' + n + '</span><b>' + title + '</b><span>' + desc + '</span></div></div>';
}
function fcRenderOverviewStatic(data) {
	$('#fcKpiTotal').html(fcMoney(data.grandTotal || 0, __fcCurrency));
	var totals = data.categoryTotals || [];
	fcBarChart('fcOvCategoryChart', totals.map(function (t) { return t.categoryName; }),
		totals.map(function (t) { return Number(t.total || 0); }), 'Cost by category');
}
function fcLoadOverviewRun() {
	// Overview reflects a live computation for the selected month (or whole year).
	var m = $('#fcTopMonth').val() || 'ALL';
	$.ajax({
		url: financialCostUrl('live-report', __fcCurrentSessionId + '/' + m), type: 'GET',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			if (!res || res.status != '1' || !res.run) {
				$('#fcKpiDistributed').text('—'); $('#fcKpiAvg').text('—'); $('#fcKpiLastRun').text('Live');
				return;
			}
			var run = res.run;
			$('#fcKpiDistributed').html(fcMoney(run.allocatedCost, __fcCurrency));
			var avg = (run.studentCount > 0) ? (Number(run.allocatedCost) / run.studentCount) : 0;
			$('#fcKpiAvg').html(fcMoney(avg, __fcCurrency));
			$('#fcKpiLastRun').html('<span class="fc-badge active">Live</span> ' + (run.studentCount || 0) + ' students');
			var bp = res.byProduct || [];
			fcBarChart('fcOvProductChart', bp.map(function (p) { return p.lpLabel; }),
				bp.map(function (p) { return Number(p.total || 0); }), 'Cost by learning program');
		},
	});
}

/* ---------------- Cost Items ---------------- */
function fcItemsPane(data) {
	var addBtn = data.canManage ? '<button class="btn btn-primary btn-sm" id="fcAddItemBtn" style="background-color:var(--pc);border-color:var(--pc);"><i class="fa fa-plus"></i> Add cost item</button>' : '';
	return ''
		+ '    <div class="tab-pane fade" id="fcTabItems">'
		+ '      <div class="d-flex justify-content-end mb-2">' + addBtn + '</div>'
		+ '      <div id="fcCategoryChart"></div>'
		+ '      <div class="table-responsive mt-3"><table id="financialCostTable" class="table table-hover table-striped" style="width:100%">'
		+ '        <thead><tr><th>Item</th><th>Category</th><th>Type</th><th>Grade</th><th>Description</th>'
		+ '        <th class="text-right">Amount</th><th>Distribution</th><th>Status</th>' + (data.canManage ? '<th></th>' : '') + '</tr></thead>'
		+ '        <tbody></tbody></table></div>'
		+ '    </div>';
}
function fcRenderCategoryChart(data) {
	var totals = data.categoryTotals || [];
	fcBarChart('fcCategoryChart', totals.map(function (t) { return t.categoryName; }),
		totals.map(function (t) { return Number(t.total || 0); }), 'Cost by category');
}
function fcRenderItemsTable(data) {
	var canManage = data.canManage;
	if ($.fn.DataTable.isDataTable('#financialCostTable')) { $('#financialCostTable').DataTable().destroy(); }
	var rows = (data.items || []).map(function (i) {
		var typeBadge = (i.costType === 'DIRECT') ? '<span class="fc-badge direct">Direct</span>' : '<span class="fc-badge overhead">Overhead</span>';
		var gradeBadge = (i.appliesToStandard === null || i.appliesToStandard === undefined) ? '<span class="fc-badge gradeall">All grades</span>' : '<span class="fc-badge grade">' + fcEsc(i.appliesToStandardLabel) + '</span>';
		var statusBadge = (i.status === 'DRAFT') ? '<span class="fc-badge draft">Draft</span>' : '<span class="fc-badge active">Active</span>';
		var actions = canManage ? '<div class="btn-group"><button class="btn btn-sm btn-light fc-edit" data-id="' + i.id + '"><i class="fa fa-pencil"></i></button><button class="btn btn-sm btn-light fc-delete" data-id="' + i.id + '" data-name="' + fcEsc(i.itemName) + '"><i class="fa fa-trash text-danger"></i></button></div>' : '';
		return '<tr><td><strong>' + fcEsc(i.itemName) + '</strong></td><td>' + fcEsc(i.categoryName) + '</td><td>' + typeBadge + '</td><td>' + gradeBadge
			+ '</td><td class="fc-desc">' + fcEsc(i.description) + '</td><td class="text-right">' + fcMoney(i.amount, i.currency) + '</td><td>' + fcEsc(i.distributionLabel)
			+ '</td><td>' + statusBadge + '</td>' + (canManage ? '<td class="text-right">' + actions + '</td>' : '') + '</tr>';
	}).join('');
	$('#financialCostTable tbody').html(rows);
	$('#financialCostTable').DataTable({ order: [[1, 'asc']], pageLength: 25, language: { search: 'Filter:', emptyTable: 'No cost items for this academic year yet.' } });
}

/* ---------------- Categories ---------------- */
function fcCategoriesPane(data) {
	var addBtn = data.canManage ? '<button class="btn btn-primary btn-sm" id="fcAddCatBtn" style="background-color:var(--pc);border-color:var(--pc);"><i class="fa fa-plus"></i> Add category</button>' : '';
	return ''
		+ '    <div class="tab-pane fade" id="fcTabCats">'
		+ '      <div class="d-flex justify-content-between align-items-center mb-2"><span class="text-muted small">A category carries a default distribution method that new items inherit.</span>' + addBtn + '</div>'
		+ '      <div class="table-responsive"><table id="fcCatsTable" class="table table-hover table-striped" style="width:100%">'
		+ '        <thead><tr><th>Category</th><th>Type</th><th>Default distribution</th><th class="text-right">Items</th><th class="text-right">Total</th>' + (data.canManage ? '<th></th>' : '') + '</tr></thead>'
		+ '        <tbody></tbody></table></div>'
		+ '    </div>';
}
function fcDistLabel(value) {
	var found = (__financialCostData.distributions || []).find(function (d) { return d.value === value; });
	return found ? found.label : value;
}
function fcRenderCategories(data) {
	var canManage = data.canManage;
	var totalsById = {};
	(data.categoryTotals || []).forEach(function (t) { totalsById[t.categoryId] = t; });
	var rows = (data.categories || []).map(function (c) {
		var t = totalsById[c.id] || {};
		var typeBadge = (c.costType === 'DIRECT') ? '<span class="fc-badge direct">Direct</span>' : '<span class="fc-badge overhead">Overhead</span>';
		var actions = canManage ? '<button class="btn btn-sm btn-light fc-cat-edit" data-id="' + c.id + '"><i class="fa fa-pencil"></i></button>' : '';
		var itemCount = t.itemCount || 0;
		var itemsCell = itemCount > 0
			? '<a href="javascript:void(0);" class="fc-cat-items" data-id="' + c.id + '" data-name="' + fcEsc(c.name) + '">' + itemCount + '</a>'
			: '0';
		return '<tr><td><strong>' + fcEsc(c.name) + '</strong></td><td>' + typeBadge + '</td><td>' + fcEsc(fcDistLabel(c.defaultDistribution))
			+ '</td><td class="text-right">' + itemsCell + '</td><td class="text-right">' + fcMoney(t.total || 0, __fcCurrency)
			+ '</td>' + (canManage ? '<td class="text-right">' + actions + '</td>' : '') + '</tr>';
	}).join('');
	if ($.fn.DataTable.isDataTable('#fcCatsTable')) { $('#fcCatsTable').DataTable().destroy(); }
	$('#fcCatsTable tbody').html(rows);
	$('#fcCatsTable').DataTable({ pageLength: 25, searching: false, info: false, paging: false, language: { emptyTable: 'No categories yet.' } });
	$('#fcCatsTable').off('click', '.fc-cat-items').on('click', '.fc-cat-items', function () {
		fcOpenCategoryItems(Number($(this).data('id')), $(this).data('name'));
	});
}

/** Modal listing every cost item in a category, with the same meaningful columns as Cost items. */
function fcCategoryItemsModal() {
	return ''
		+ '<div class="modal fade" id="fcCatItemsModal" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg" role="document"><div class="modal-content">'
		+ '<div class="modal-header"><h5 class="modal-title" id="fcCatItemsModalTitle">Category items</h5><button type="button" class="close" data-dismiss="modal">&times;</button></div>'
		+ '<div class="modal-body">'
		+ '  <div class="table-responsive"><table id="fcCatItemsTable" class="table table-hover table-striped" style="width:100%">'
		+ '    <thead><tr><th>Item</th><th>Type</th><th>Grade</th><th>Description</th><th class="text-right">Amount</th><th>Distribution</th><th>Status</th></tr></thead>'
		+ '    <tbody></tbody></table></div>'
		+ '</div><div class="modal-footer"><button type="button" class="btn btn-light" data-dismiss="modal">Close</button></div>'
		+ '</div></div></div>';
}
function fcOpenCategoryItems(categoryId, categoryName) {
	var items = ((__financialCostData && __financialCostData.items) || []).filter(function (i) { return i.categoryId === categoryId; });
	$('#fcCatItemsModalTitle').text(categoryName ? (categoryName + ' — cost items') : 'Category items');
	var rows = items.map(function (i) {
		var typeBadge = (i.costType === 'DIRECT') ? '<span class="fc-badge direct">Direct</span>' : '<span class="fc-badge overhead">Overhead</span>';
		var gradeBadge = (i.appliesToStandard === null || i.appliesToStandard === undefined) ? '<span class="fc-badge gradeall">All grades</span>' : '<span class="fc-badge grade">' + fcEsc(i.appliesToStandardLabel) + '</span>';
		var statusBadge = (i.status === 'DRAFT') ? '<span class="fc-badge draft">Draft</span>' : '<span class="fc-badge active">Active</span>';
		return '<tr><td><strong>' + fcEsc(i.itemName) + '</strong></td><td>' + typeBadge + '</td><td>' + gradeBadge
			+ '</td><td class="fc-desc">' + fcEsc(i.description) + '</td><td class="text-right">' + fcMoney(i.amount, i.currency) + '</td><td>' + fcEsc(i.distributionLabel)
			+ '</td><td>' + statusBadge + '</td></tr>';
	}).join('');
	if ($.fn.DataTable.isDataTable('#fcCatItemsTable')) { $('#fcCatItemsTable').DataTable().destroy(); }
	$('#fcCatItemsTable tbody').html(rows);
	$('#fcCatItemsTable').DataTable({ pageLength: 10, searching: items.length > 10, info: false, paging: items.length > 10, language: { emptyTable: 'No cost items in this category.' } });
	$('#fcCatItemsModal').modal('show');
}

/* ---------------- Reports: distribution-method explainer ---------------- */
/* How each cost item's amount is split across students — shown atop the Reports tab. */
function fcMethodCards() {
	return ''
		+ '      <div class="row mb-2">'
		+ '        <div class="col-md-4"><div class="fc-method"><h6>Equal split</h6><p class="small mb-0">Every eligible student pays the same share.</p><div class="formula">share = amount ÷ students</div></div></div>'
		+ '        <div class="col-md-4"><div class="fc-method"><h6>Usage-based</h6><p class="small mb-0">By teacher-seconds or meeting-minutes each student consumed.</p><div class="formula">share = amount × (secs ÷ Σ secs)</div></div></div>'
		+ '        <div class="col-md-4"><div class="fc-method"><h6>Learning Program weighted</h6><p class="small mb-0">By learning program weight, then per student.</p><div class="formula">1:1/Flexy/Dual/Self Study Plus ×1.0 · Group ×(1 ÷ batch size) · Self ×0.0</div></div></div>'
		+ '      </div>'
		+ '      <div class="alert alert-light border small"><b>Teacher-seconds.</b> Each teacher\'s pro-rata payout (TEACHER_AGREEMENT_LOG) is split across attending students by their engaged GOTO_MEETING_ATTENDEES.DURATION: 1:1 → full, group of N → shared. The method is chosen <b>per cost item</b> on the Cost items tab.</div>';
}

/* ---------------- Reports ---------------- */
function fcRenderReport(res) {
	var run = res.run || {}, byProduct = res.byProduct || [], students = res.students || [], ccy = res.currency || __fcCurrency;
	var html = ''
		+ '<div class="fc-kpis">'
		+ '  <div class="fc-kpi accent"><div class="lbl">Total cost</div><div class="val">' + fcMoney(run.totalCost, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Allocated</div><div class="val">' + fcMoney(run.allocatedCost, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Unallocated</div><div class="val">' + fcMoney(run.unallocatedCost, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Students</div><div class="val">' + (run.studentCount || 0) + '</div></div>'
		+ '</div>'
		+ '<div class="row"><div class="col-md-5"><div id="fcProductChart"></div></div>'
		+ '  <div class="col-md-7"><div class="table-responsive"><table class="table table-sm table-striped">'
		+ '    <thead><tr><th>Learning program</th><th class="text-right">Students</th><th class="text-right">Total</th><th class="text-right">Avg/student</th></tr></thead><tbody>'
		+ byProduct.map(function (p) { return '<tr><td>' + fcEsc(p.lpLabel) + '</td><td class="text-right">' + p.students + '</td><td class="text-right">' + fcMoney(p.total, ccy) + '</td><td class="text-right">' + fcMoney(p.avgPerStudent, ccy) + '</td></tr>'; }).join('')
		+ '  </tbody></table></div></div></div>'
		+ '<h6 class="mt-3">Per-student cost sheet <small class="text-muted" id="fcStudentSheetCount">(' + students.length + ' shown)</small></h6>'
		+ '<div class="table-responsive"><table id="fcStudentTable" class="table table-hover table-striped" style="width:100%">'
		+ '  <thead><tr><th>Student</th><th>Learning program</th><th>Grade</th><th class="text-right">Engagement (Duration)</th><th class="text-right">Teaching cost</th><th class="text-right">Shared cost</th><th class="text-right">Total</th><th class="text-right" title="Effective teacher cost per engaged second under the learning-program weighting (1:1/Flexy/Dual/Self Study Plus ×1.0, Group ×(1÷monthly batch size), Self Study ×0.0)">Teacher $/sec</th></tr></thead><tbody></tbody></table></div>';
	$('#fcReportBody').html(html);

	fcDestroyChart('fcProductChart');
	var el = document.querySelector('#fcProductChart');
	if (el && byProduct.length > 0) {
		__fcCharts['fcProductChart'] = new ApexCharts(el, {
			series: byProduct.map(function (p) { return Number(p.total || 0); }),
			labels: byProduct.map(function (p) { return p.lpLabel; }),
			chart: { type: 'donut', height: 300 }, legend: { position: 'bottom' },
			title: { text: 'Cost by learning program', align: 'left', style: { fontSize: '13px', color: '#5a6473' } },
			tooltip: { y: { formatter: function (v) { return ccy + ' ' + Number(v).toLocaleString(); } } },
			colors: [fcAccent(), '#a67c1a', '#2b4a7a', '#8a94a2', '#0f5c4a'],
		});
		__fcCharts['fcProductChart'].render();
	}
	// Learning-program filter lives in the top controls row (after the View dropdown);
	// it filters ONLY this per-student sheet — KPIs/donut/by-program summary stay fixed.
	$('#fcStudentLpFilter')
		.html('<option value="">All Learning Programs</option>'
			+ byProduct.map(function (p) { return '<option value="' + fcEsc(p.lpId) + '">' + fcEsc(p.lpLabel) + '</option>'; }).join(''))
		.val('').show();
	fcRenderStudentSheet(students, ccy);
	$('#fcStudentLpFilter').off('change').on('change', function () {
		var lp = $(this).val();
		var filtered = lp ? students.filter(function (s) { return s.lpId === lp; }) : students;
		fcRenderStudentSheet(filtered, ccy);
	});
}
function fcRenderStudentSheet(students, ccy) {
	$('#fcStudentSheetCount').text('(' + students.length + ' shown)');
	var rows = students.map(function (s) {
		return '<tr><td>' + fcEsc(s.studentName || ('#' + s.studentId)) + '</td><td>' + fcEsc(s.lpLabel || '—') + '</td><td>' + fcEsc(s.gradeName || '—')
			+ '</td><td class="text-right" data-order="' + (s.basisSeconds || 0) + '">' + fcDuration(s.basisSeconds)
			+ '</td><td class="text-right">' + fcMoney(s.teachingCost, ccy) + '</td><td class="text-right">' + fcMoney(s.sharedCost, ccy)
			+ '</td><td class="text-right"><strong>' + fcMoney(s.total, ccy) + '</strong>'
			+ '</td><td class="text-right" data-order="' + (Number(s.perSecondTeacherCost) || 0) + '">' + fcRate(s.perSecondTeacherCost) + '</td></tr>';
	}).join('');
	if ($.fn.DataTable.isDataTable('#fcStudentTable')) { $('#fcStudentTable').DataTable().destroy(); }
	$('#fcStudentTable tbody').html(rows);
	$('#fcStudentTable').DataTable({ order: [[6, 'desc']], pageLength: 25, language: { emptyTable: 'No students for this learning program.' } });
}

/* ---------------- Modals ---------------- */
function fcItemModal(data) {
	function opts(list, vk, lk) { return (list || []).map(function (o) { return '<option value="' + fcEsc(o[vk]) + '">' + fcEsc(o[lk]) + '</option>'; }).join(''); }
	var sessionOpts = (data.sessions || []).map(function (s) { return '<option value="' + s.id + '">' + fcEsc(s.name) + (s.serving ? ' (serving)' : '') + '</option>'; }).join('');
	var gradeOpts = '<option value="">All grades</option>' + (data.grades || []).map(function (g) { return '<option value="' + g.id + '">' + fcEsc(g.name) + '</option>'; }).join('');
	return ''
		+ '<div class="modal fade" id="fcItemModal" tabindex="-1" role="dialog"><div class="modal-dialog modal-lg"><div class="modal-content">'
		+ '<div class="modal-header"><h5 class="modal-title" id="fcModalTitle">Add cost item</h5><button type="button" class="close" data-dismiss="modal">&times;</button></div>'
		+ '<div class="modal-body"><input type="hidden" id="fcItemId">'
		+ '  <div class="form-group"><label>Item name</label><input type="text" class="form-control" id="fcItemName" maxlength="150"></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Category</label><select class="form-control" id="fcCategory">' + opts(data.categories, 'id', 'name') + '</select></div>'
		+ '    <div class="form-group col-md-6"><label>Cost type</label><select class="form-control" id="fcCostType">' + opts(data.costTypes, 'value', 'label') + '</select></div></div>'
		+ '  <div class="form-group"><label>Description — service details &amp; why it\'s needed</label><textarea class="form-control" id="fcDescription" rows="3" maxlength="1000"></textarea></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Amount</label><input type="number" step="0.01" class="form-control" id="fcAmount"></div>'
		+ '    <div class="form-group col-md-6"><label>Currency</label><select class="form-control" id="fcCurrency"><option>USD</option><option>INR</option></select></div></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Academic year</label><select class="form-control" id="fcSession">' + sessionOpts + '</select></div>'
		+ '    <div class="form-group col-md-6"><label>Applies to grade</label><select class="form-control" id="fcGrade">' + gradeOpts + '</select></div></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Applies to product</label><select class="form-control" id="fcProduct">' + opts(data.products, 'value', 'label') + '</select></div>'
		+ '    <div class="form-group col-md-6"><label>Distribution method</label><select class="form-control" id="fcDistribution">' + opts(data.distributions, 'value', 'label') + '</select></div></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Rate basis <small class="text-muted">(usage only)</small></label><select class="form-control" id="fcRateBasis"><option value="">—</option><option value="TEACHER_AGREEMENT_LOG">From TEACHER_AGREEMENT_LOG</option><option value="TOTAL_PAY_PER_SECOND">Total pay ÷ total seconds</option></select></div>'
		+ '    <div class="form-group col-md-6"><label>Linked source table <small class="text-muted">(optional)</small></label><input type="text" class="form-control" id="fcLinkedSource" placeholder="e.g. TEACHER_AGREEMENT_LOG"></div></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Recurrence</label><select class="form-control" id="fcIsAnnual"><option value="Y">Annual (per year)</option><option value="N">One-off</option></select></div>'
		+ '    <div class="form-group col-md-6"><label>Status</label><select class="form-control" id="fcStatus"><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option></select></div></div>'
		+ '</div><div class="modal-footer"><button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="fcSaveItemBtn" style="background-color:var(--pc);border-color:var(--pc);">Save cost item</button></div>'
		+ '</div></div></div>';
}
function fcCategoryModal(data) {
	function opts(list) { return (list || []).map(function (o) { return '<option value="' + fcEsc(o.value) + '">' + fcEsc(o.label) + '</option>'; }).join(''); }
	return ''
		+ '<div class="modal fade" id="fcCatModal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content">'
		+ '<div class="modal-header"><h5 class="modal-title" id="fcCatModalTitle">Add category</h5><button type="button" class="close" data-dismiss="modal">&times;</button></div>'
		+ '<div class="modal-body"><input type="hidden" id="fcCatId">'
		+ '  <div class="form-group"><label>Category name</label><input type="text" class="form-control" id="fcCatName" maxlength="120"></div>'
		+ '  <div class="form-row"><div class="form-group col-md-6"><label>Cost type</label><select class="form-control" id="fcCatCostType">' + opts(data.costTypes) + '</select></div>'
		+ '    <div class="form-group col-md-6"><label>Default distribution</label><select class="form-control" id="fcCatDistribution">' + opts(data.distributions) + '</select></div></div>'
		+ '</div><div class="modal-footer"><button type="button" class="btn btn-light" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary" id="fcSaveCatBtn" style="background-color:var(--pc);border-color:var(--pc);">Save category</button></div>'
		+ '</div></div></div>';
}

/* ---------------- Events + save/delete ---------------- */
function fcBindEvents() {
	$('#fcSessionSelect').off('change').on('change', function () { loadFinancialCost($(this).val(), 'ALL', fcActiveTab()); });
	$('#fcTopMonth').off('change').on('change', function () { loadFinancialCost($('#fcSessionSelect').val(), $(this).val(), fcActiveTab()); });
	$('#fcAddItemBtn').off('click').on('click', function () { fcOpenItemModal(null); });
	$('#fcAddCatBtn').off('click').on('click', function () { fcOpenCatModal(null); });
	$('#financialCostTable').off('click', '.fc-edit').on('click', '.fc-edit', function () { fcOpenItemModal($(this).data('id')); });
	$('#financialCostTable').off('click', '.fc-delete').on('click', '.fc-delete', function () { fcDeleteItem($(this).data('id'), $(this).data('name')); });
	$('#fcCatsTable').off('click', '.fc-cat-edit').on('click', '.fc-cat-edit', function () { fcOpenCatModal($(this).data('id')); });
	$('#fcSaveItemBtn').off('click').on('click', fcSaveItem);
	$('#fcSaveCatBtn').off('click').on('click', fcSaveCategory);
	$('#fcTabs a[href="#fcTabReports"]').off('shown.bs.tab').on('shown.bs.tab', function () {
		if (!$('#fcReportBody').data('loaded')) { fcLoadReport(); }
	});
	$('#fcTabs a[href="#fcTabIncome"]').off('shown.bs.tab').on('shown.bs.tab', fcLoadIncome);
	$('#fcRepView').off('change').on('change', fcRepViewChanged);
	$('#fcRepLp').off('change').on('change', fcRepFilterChanged);
	$('#fcRepGrade').off('change').on('change', fcRepFilterChanged);
	$('#fcRepPicker').off('change').on('change', function () {
		$('#fcRepEntity').val($(this).val());
		if ($(this).val()) { fcLoadReport(); } else { fcRepPrompt(); }
	});
	$('#fcRepReset').off('click').on('click', function () {
		$('#fcRepPicker').val(''); $('#fcRepEntity').val(''); fcRepPrompt();
	});
}

/** Placeholder message shown in the report body when no teacher/student is picked. */
function fcRepPrompt() {
	var label = $('#fcRepView').val() === 'teacher' ? 'teacher' : 'student';
	$('#fcReportBody').html('<p class="text-muted">Select a ' + label + ' from the list above.</p>');
}

function fcRepViewChanged() {
	var v = $('#fcRepView').val();
	$('#fcRepEntity').val('');
	$('#fcRepLp,#fcRepGrade,#fcRepPicker,#fcRepReset,#fcStudentLpFilter').hide();
	if (v === 'product' || v === 'salaries') {
		fcLoadReport();
	} else if (v === 'teacher') {
		$('#fcRepPicker,#fcRepReset').show();
		fcLoadPickerOptions('teacher');
		fcRepPrompt();
	} else {
		$('#fcRepLp,#fcRepGrade,#fcRepPicker,#fcRepReset').show();
		fcLoadPickerOptions('student');
		fcRepPrompt();
	}
}

function fcRepFilterChanged() {
	// Student program/grade changed — reload the (filtered) full picker list.
	$('#fcRepEntity').val('');
	fcLoadPickerOptions('student');
	fcRepPrompt();
}

/** Preload the full teacher/student list into the picker (no typing needed). */
function fcLoadPickerOptions(view) {
	var sessionId = $('#fcSessionSelect').val() || __fcCurrentSessionId;
	var label = (view === 'teacher') ? 'teacher' : 'student';
	var url = (view === 'teacher')
		? financialCostUrl('search-teachers', '')
		: financialCostUrl('search-students', sessionId + '/' + ($('#fcRepLp').val() || 'ALL') + '/' + ($('#fcRepGrade').val() || '0'));
	$('#fcRepPicker').html('<option value="">Loading ' + label + 's…</option>').prop('disabled', true);
	$.ajax({
		url: url, type: 'GET', beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			var list = res || [];
			var opts = '<option value="">All ' + label + 's (' + list.length + ') — select one…</option>'
				+ list.map(function (o) { return '<option value="' + o.id + '">' + fcEsc(o.name || ('#' + o.id)) + '</option>'; }).join('');
			$('#fcRepPicker').html(opts).prop('disabled', false).val('');
		},
		error: function () { $('#fcRepPicker').html('<option value="">Unable to load ' + label + 's</option>').prop('disabled', false); },
	});
}

function fcLoadReport() {
	var view = $('#fcRepView').val();
	var sessionId = $('#fcSessionSelect').val() || __fcCurrentSessionId;
	var month = $('#fcTopMonth').val() || 'ALL';
	var hdr = function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); };
	var fail = function () { $('#fcReportBody').html('<p class="text-danger">Unable to generate the report.</p>'); };
	$('#fcReportBody').data('loaded', true);

	if (view === 'product') {
		$('#fcReportBody').html('<p class="text-muted">Generating report…</p>');
		$.ajax({
			url: financialCostUrl('live-report', sessionId + '/' + month), type: 'GET', beforeSend: hdr,
			success: function (res) {
				if (!res || res.status != '1') { $('#fcReportBody').html('<p class="text-danger">' + ((res && res.message) ? fcEsc(res.message) : 'Unable to generate the report.') + '</p>'); return; }
				fcRenderReport(res);
			}, error: fail,
		});
		return;
	}
	if (view === 'salaries') {
		$('#fcReportBody').html('<p class="text-muted">Calculating teacher salaries…</p>');
		$.ajax({
			url: financialCostUrl('teacher-salaries', sessionId + '/' + month), type: 'GET', beforeSend: hdr,
			success: function (res) {
				if (!res || res.status != '1') { $('#fcReportBody').html('<p class="text-danger">' + ((res && res.message) ? fcEsc(res.message) : 'Unable to generate the report.') + '</p>'); return; }
				fcRenderTeacherSalaries(res);
			}, error: fail,
		});
		return;
	}
	var id = $('#fcRepEntity').val();
	if (!id) {
		$('#fcReportBody').html('<p class="text-muted">Select a ' + (view === 'teacher' ? 'teacher' : 'student') + ' from the list above.</p>');
		return;
	}
	$('#fcReportBody').html('<p class="text-muted">Generating report…</p>');
	var action = (view === 'teacher') ? 'report-teacher' : 'report-student';
	$.ajax({
		url: financialCostUrl(action, sessionId + '/' + month + '/' + id), type: 'GET', beforeSend: hdr,
		success: function (res) {
			if (!res || res.status != '1') { $('#fcReportBody').html('<p class="text-danger">' + ((res && res.message) ? fcEsc(res.message) : 'Unable to generate the report.') + '</p>'); return; }
			if (view === 'teacher') { fcRenderTeacherReport(res); } else { fcRenderStudentReport(res); }
		}, error: fail,
	});
}

function fcRenderTeacherSalaries(res) {
	var teachers = res.teachers || [];
	var warn = res.anyConversionFailed
		? '<div class="alert alert-warning py-2 small">Some non-USD payouts could not be converted and are excluded from the grand total (see the row warnings).</div>' : '';
	var scope = (res.month && res.month !== 'ALL') ? 'this month' : 'whole academic year';
	// "(till now)" only for the ongoing (current) month; past months and whole-year read just "Salary".
	var now = new Date();
	var curMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
	var tillNow = ($('#fcTopMonth').val() || res.month) === curMonth;
	var salaryHdr = tillNow ? 'Salary (till now)' : 'Salary';
	var salaryUsdHdr = tillNow ? 'Salary (till now, USD)' : 'Salary (USD)';
	var html = ''
		+ '<div class="fc-kpis">'
		+ '  <div class="fc-kpi accent"><div class="lbl">Grand total salary <span class="text-muted">(' + scope + ', USD)</span></div><div class="val" style="font-size:26px;">' + fcMoney(res.grandTotalUsd, 'USD') + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Teachers</div><div class="val">' + (res.teacherCount || 0) + '</div></div>'
		+ '</div>' + warn
		+ '<div class="table-responsive"><table id="fcSalaryTable" class="table table-hover table-striped" style="width:100%">'
		+ '  <thead><tr><th>Teacher</th><th>Type</th><th class="text-right">Accepted hrs</th><th class="text-right">Working hrs</th>'
		+ '    <th class="text-right">Salary agreed</th><th class="text-right">Per hour</th><th>Ccy</th><th class="text-right">' + salaryHdr + '</th><th class="text-right">' + salaryUsdHdr + '</th></tr></thead><tbody>'
		+ teachers.map(function (t) {
			var typeBadge = (t.salaryType === 'FIXED') ? '<span class="fc-badge draft">Fixed</span>' : '<span class="fc-badge active">Hourly</span>';
			var usd = (t.conversionFailed || t.salaryTillNowUsd === null || t.salaryTillNowUsd === undefined)
				? '<span class="text-danger" title="' + fcEsc(t.warning || 'conversion failed') + '">—</span>'
				: '<strong>' + fcMoney(t.salaryTillNowUsd, 'USD') + '</strong>';
			var perHour = (t.salaryPerHourOriginal === null || t.salaryPerHourOriginal === undefined) ? '—' : fcMoney(t.salaryPerHourOriginal, t.agreementCurrency);
			return '<tr><td>' + fcEsc(t.teacherName || ('#' + (t.userId || t.teacherId)))
				+ (t.warning ? ' <i class="fa fa-exclamation-triangle text-warning" title="' + fcEsc(t.warning) + '"></i>' : '')
				+ '</td><td>' + typeBadge + '</td><td class="text-right">' + (t.acceptedHours != null ? t.acceptedHours.toFixed(2) : '0.00')
				+ '</td><td class="text-right">' + (t.workingHours != null ? t.workingHours : '—')
				+ '</td><td class="text-right">' + fcMoney(t.salaryAgreedOriginal, t.agreementCurrency)
				+ '</td><td class="text-right">' + perHour + '</td><td>' + fcEsc(t.agreementCurrency || 'USD')
				+ '</td><td class="text-right">' + fcMoney(t.salaryTillNowOriginal, t.agreementCurrency)
				+ '</td><td class="text-right">' + usd + '</td></tr>';
		}).join('')
		+ '  </tbody></table></div>';
	$('#fcReportBody').html(html);
	if ($.fn.DataTable.isDataTable('#fcSalaryTable')) { $('#fcSalaryTable').DataTable().destroy(); }
	$('#fcSalaryTable').DataTable({ order: [[8, 'desc']], pageLength: 25 });
}

function fcRenderTeacherReport(res) {
	var ccy = res.currency || __fcCurrency, students = res.students || [];
	var html = ''
		+ '<h6>' + fcEsc(res.teacherName || ('#' + res.teacherId)) + '</h6>'
		+ '<div class="fc-kpis">'
		+ '  <div class="fc-kpi accent"><div class="lbl">Actual payout (pro-rata)</div><div class="val">' + fcMoney(res.payout, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Teaching cost</div><div class="val">' + fcMoney(res.teachingCost, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Admin cost</div><div class="val">' + fcMoney(res.adminCost, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Conducted / agreed hrs</div><div class="val" style="font-size:16px;">' + (Math.round((res.conductedHours || 0) * 10) / 10) + ' / ' + (Math.round((res.agreedHours || 0) * 10) / 10) + '</div></div>'
		+ '</div>'
		+ '<h6 class="mt-3">Cost distributed to students <small class="text-muted">(' + students.length + ')</small></h6>'
		+ '<div class="table-responsive"><table id="fcStudentTable" class="table table-hover table-striped" style="width:100%">'
		+ '  <thead><tr><th>Student</th><th>Learning program</th><th>Grade</th><th class="text-right">Engagement (Duration)</th><th class="text-right">Teacher cost</th></tr></thead><tbody>'
		+ students.map(function (s) {
			return '<tr><td>' + fcEsc(s.studentName || ('#' + s.studentId)) + '</td><td>' + fcEsc(s.lpLabel || '—') + '</td><td>' + fcEsc(s.gradeName || '—')
				+ '</td><td class="text-right" data-order="' + (s.basisSeconds || 0) + '">' + fcDuration(s.basisSeconds) + '</td><td class="text-right">' + fcMoney(s.total, ccy) + '</td></tr>';
		}).join('')
		+ '  </tbody></table></div>';
	$('#fcReportBody').html(html);
	if ($.fn.DataTable.isDataTable('#fcStudentTable')) { $('#fcStudentTable').DataTable().destroy(); }
	$('#fcStudentTable').DataTable({ order: [[4, 'desc']], pageLength: 25 });
}

/* ---------------- Income & P/L ---------------- */
function fcLoadIncome() {
	var sessionId = $('#fcSessionSelect').val() || __fcCurrentSessionId;
	var month = $('#fcTopMonth').val() || 'ALL';
	$('#fcIncomeBody').html('<p class="text-muted">Generating income report…</p>');
	$.ajax({
		url: financialCostUrl('income', sessionId + '/' + month), type: 'GET',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			if (!res || res.status != '1') { $('#fcIncomeBody').html('<p class="text-danger">' + ((res && res.message) ? fcEsc(res.message) : 'Unable to generate the income report.') + '</p>'); return; }
			fcRenderIncome(res);
		},
		error: function () { $('#fcIncomeBody').html('<p class="text-danger">Unable to generate the income report.</p>'); },
	});
}

function fcRenderIncome(res) {
	var ccy = res.currency || __fcCurrency, m = res.monthly || [];
	var isProfit = !!res.profit;
	var netColor = isProfit ? '#0f5c4a' : '#a5342b';
	var scopeLabel = (res.month && res.month !== 'ALL') ? 'this month' : 'whole academic year';

	var html = ''
		+ '<div class="fc-kpis">'
		+ '  <div class="fc-kpi" style="border-top:3px solid ' + netColor + ';flex:1 1 260px;">'
		+ '    <div class="lbl">' + (isProfit ? 'Net profit' : 'Net loss') + ' <span class="text-muted">(' + scopeLabel + ')</span></div>'
		+ '    <div class="val" style="color:' + netColor + ';font-size:28px;">' + fcMoney(res.net, ccy) + '</div>'
		+ '    <div class="small text-muted">Collected income − expense</div>'
		+ '  </div>'
		+ '  <div class="fc-kpi"><div class="lbl">Collected (received)</div><div class="val">' + fcMoney(res.collected, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Upcoming (scheduled)</div><div class="val">' + fcMoney(res.upcoming, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Incomplete</div><div class="val">' + fcMoney(res.incomplete, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Total expense</div><div class="val">' + fcMoney(res.expense, ccy) + '</div></div>'
		+ '</div>'
		+ '<div id="fcIncomeChart"></div>'
		+ '<div class="table-responsive mt-3"><table id="fcIncomeTable" class="table table-sm table-striped" style="width:100%">'
		+ '  <thead><tr><th>Month</th><th class="text-right">Collected</th><th class="text-right">Upcoming</th><th class="text-right">Incomplete</th><th class="text-right">Expense</th><th class="text-right">Net</th></tr></thead><tbody>'
		+ m.map(function (r) {
			var nColor = (Number(r.net) >= 0) ? '#0f5c4a' : '#a5342b';
			return '<tr><td>' + fcEsc(r.label) + '</td><td class="text-right">' + fcMoney(r.collected, ccy) + '</td><td class="text-right">' + fcMoney(r.upcoming, ccy)
				+ '</td><td class="text-right">' + fcMoney(r.incomplete, ccy) + '</td><td class="text-right">' + fcMoney(r.expense, ccy)
				+ '</td><td class="text-right" style="color:' + nColor + ';font-weight:600;">' + fcMoney(r.net, ccy) + '</td></tr>';
		}).join('')
		+ '  </tbody></table></div>';
	$('#fcIncomeBody').html(html);

	fcDestroyChart('fcIncomeChart');
	var el = document.querySelector('#fcIncomeChart');
	if (el && m.length > 0) {
		__fcCharts['fcIncomeChart'] = new ApexCharts(el, {
			series: [
				{ name: 'Collected', type: 'column', data: m.map(function (r) { return Number(r.collected || 0); }) },
				{ name: 'Upcoming', type: 'column', data: m.map(function (r) { return Number(r.upcoming || 0); }) },
				{ name: 'Expense', type: 'column', data: m.map(function (r) { return Number(r.expense || 0); }) },
				{ name: 'Net', type: 'line', data: m.map(function (r) { return Number(r.net || 0); }) },
			],
			chart: { height: 380, type: 'line', toolbar: { show: false } },
			stroke: { width: [0, 0, 0, 3], curve: 'smooth' },
			colors: ['#0f5c4a', '#a67c1a', '#a5342b', fcAccent()],
			plotOptions: { bar: { borderRadius: 4, columnWidth: '70%' } },
			dataLabels: { enabled: false },
			markers: { size: [0, 0, 0, 4] },
			xaxis: { categories: m.map(function (r) { return r.label; }) },
			yaxis: { labels: { formatter: function (v) { return Number(v).toLocaleString(); } } },
			legend: { position: 'top' },
			title: { text: 'Income vs expense by month', align: 'left', style: { fontSize: '13px', color: '#5a6473' } },
			tooltip: { shared: true, y: { formatter: function (v) { return ccy + ' ' + Number(v).toLocaleString(); } } },
		});
		__fcCharts['fcIncomeChart'].render();
	}
	if ($.fn.DataTable.isDataTable('#fcIncomeTable')) { $('#fcIncomeTable').DataTable().destroy(); }
	$('#fcIncomeTable').DataTable({ paging: false, searching: false, info: false, ordering: false });
}

function fcRenderStudentReport(res) {
	var ccy = res.currency || __fcCurrency, items = res.items || [];
	var html = ''
		+ '<h6>' + fcEsc(res.studentName || ('#' + res.studentId)) + ' <small class="text-muted">' + fcEsc(res.lpLabel || '') + (res.gradeName ? ' · ' + fcEsc(res.gradeName) : '') + '</small></h6>'
		+ '<div class="fc-kpis">'
		+ '  <div class="fc-kpi accent"><div class="lbl">Total cost</div><div class="val">' + fcMoney(res.total, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Teaching cost</div><div class="val">' + fcMoney(res.teachingCost, ccy) + '</div></div>'
		+ '  <div class="fc-kpi"><div class="lbl">Shared / services cost</div><div class="val">' + fcMoney(res.sharedCost, ccy) + '</div></div>'
		+ '</div>'
		+ '<h6 class="mt-3">Cost consumed, by item</h6>'
		+ '<div class="table-responsive"><table id="fcStudentItemsTable" class="table table-hover table-striped" style="width:100%">'
		+ '  <thead><tr><th>Item</th><th>Category</th><th>Type</th><th class="text-right">Engagement (Duration)</th><th class="text-right">Cost</th></tr></thead><tbody>'
		+ items.map(function (it) {
			var typeBadge = (it.costType === 'DIRECT') ? '<span class="fc-badge direct">Direct</span>' : '<span class="fc-badge overhead">Overhead</span>';
			return '<tr><td>' + fcEsc(it.itemName) + '</td><td>' + fcEsc(it.categoryName || '—') + '</td><td>' + typeBadge
				+ '</td><td class="text-right" data-order="' + (it.basisSeconds || 0) + '">' + fcDuration(it.basisSeconds) + '</td><td class="text-right">' + fcMoney(it.amount, ccy) + '</td></tr>';
		}).join('')
		+ '  </tbody></table></div>';
	$('#fcReportBody').html(html);
	if ($.fn.DataTable.isDataTable('#fcStudentItemsTable')) { $('#fcStudentItemsTable').DataTable().destroy(); }
	$('#fcStudentItemsTable').DataTable({ order: [[4, 'desc']], pageLength: 25, searching: false, paging: false, info: false });
}

/**
 * Hide a Bootstrap modal and run `then` only after it is fully hidden.
 * loadFinancialCost() rebuilds #dashboardContentInHTML, which destroys the modal
 * DOM. If we reload while the fade-out is still animating, `hidden.bs.modal` never
 * fires and Bootstrap's .modal-backdrop (appended to <body>, outside the rebuilt
 * container) is left orphaned — a stuck overlay. Deferring the reload lets the
 * backdrop be cleaned up first. A timeout guards the case where the event is missed.
 */
function fcHideModalThen(selector, then) {
	var $m = $(selector), done = false;
	var run = function () { if (done) { return; } done = true; then(); };
	$m.off('hidden.bs.modal.fc').one('hidden.bs.modal.fc', run);
	$m.modal('hide');
	setTimeout(run, 500);
}
function fcOpenItemModal(itemId) {
	var item = itemId ? (__financialCostData.items || []).find(function (i) { return i.id === itemId; }) : null;
	$('#fcModalTitle').text(item ? 'Edit cost item' : 'Add cost item');
	$('#fcItemId').val(item ? item.id : '');
	$('#fcItemName').val(item ? item.itemName : '');
	$('#fcCategory').val(item ? item.categoryId : ($('#fcCategory option:first').val() || ''));
	$('#fcCostType').val(item ? item.costType : 'OVERHEAD');
	$('#fcDescription').val(item ? item.description : '');
	$('#fcAmount').val(item && item.amount !== null ? item.amount : '');
	$('#fcCurrency').val(item ? (item.currency || 'USD') : 'USD');
	$('#fcSession').val(item ? (item.sessionId || __fcCurrentSessionId) : __fcCurrentSessionId);
	$('#fcGrade').val(item && item.appliesToStandard != null ? item.appliesToStandard : '');
	$('#fcProduct').val(item ? item.appliesToLp : 'ALL');
	$('#fcDistribution').val(item ? item.distributionMethod : 'EQUAL');
	$('#fcRateBasis').val(item && item.rateBasis ? item.rateBasis : '');
	$('#fcLinkedSource').val(item && item.linkedSource ? item.linkedSource : '');
	$('#fcIsAnnual').val(item ? (item.isAnnual || 'Y') : 'Y');
	$('#fcStatus').val(item ? (item.status || 'ACTIVE') : 'ACTIVE');
	$('#fcItemModal').modal('show');
}
function fcSaveItem() {
	var amountRaw = $('#fcAmount').val();
	var payload = {
		id: $('#fcItemId').val() ? Number($('#fcItemId').val()) : null,
		sessionId: $('#fcSession').val() ? Number($('#fcSession').val()) : null,
		categoryId: $('#fcCategory').val() ? Number($('#fcCategory').val()) : null,
		itemName: $('#fcItemName').val(), costType: $('#fcCostType').val(), description: $('#fcDescription').val(),
		amount: amountRaw === '' ? null : Number(amountRaw), currency: $('#fcCurrency').val(),
		distributionMethod: $('#fcDistribution').val(), rateBasis: $('#fcRateBasis').val() || null,
		linkedSource: $('#fcLinkedSource').val() || null, appliesToLp: $('#fcProduct').val(),
		appliesToStandard: $('#fcGrade').val() ? Number($('#fcGrade').val()) : null,
		isAnnual: $('#fcIsAnnual').val(), status: $('#fcStatus').val(),
	};
	if (!payload.itemName || !payload.itemName.trim()) { showMessageTheme2(0, 'Please enter a name for the cost item.'); return; }
	$.ajax({
		url: financialCostUrl('save'), type: 'POST', contentType: 'application/json', data: JSON.stringify(payload),
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) { if (res && res.status == '1') { fcHideModalThen('#fcItemModal', function () { showMessageTheme2(1, res.message || 'Saved.'); loadFinancialCost(__fcCurrentSessionId, $('#fcTopMonth').val() || 'ALL', '#fcTabItems'); }); } else { showMessageTheme2(0, (res && res.message) ? res.message : 'Could not save the cost item. Please try again.'); } },
		error: function () { showMessageTheme2(0, 'Could not save the cost item. Please try again.'); },
	});
}
function fcDeleteItem(itemId, itemName) {
	if (!confirm('Remove "' + (itemName || 'this cost item') + '"? This cannot be undone.')) { return; }
	$.ajax({
		url: financialCostUrl('delete', itemId), type: 'POST',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) { if (res && res.status == '1') { showMessageTheme2(1, res.message || 'Removed.'); loadFinancialCost(__fcCurrentSessionId, $('#fcTopMonth').val() || 'ALL', '#fcTabItems'); } else { showMessageTheme2(0, (res && res.message) ? res.message : 'Could not remove the cost item. Please try again.'); } },
		error: function () { showMessageTheme2(0, 'Could not remove the cost item. Please try again.'); },
	});
}
function fcOpenCatModal(catId) {
	var cat = catId ? (__financialCostData.categories || []).find(function (c) { return c.id === catId; }) : null;
	$('#fcCatModalTitle').text(cat ? 'Edit category' : 'Add category');
	$('#fcCatId').val(cat ? cat.id : '');
	$('#fcCatName').val(cat ? cat.name : '');
	$('#fcCatCostType').val(cat ? cat.costType : 'OVERHEAD');
	$('#fcCatDistribution').val(cat ? cat.defaultDistribution : 'EQUAL');
	$('#fcCatModal').modal('show');
}
function fcSaveCategory() {
	var payload = {
		id: $('#fcCatId').val() ? Number($('#fcCatId').val()) : null,
		name: $('#fcCatName').val(), costType: $('#fcCatCostType').val(), defaultDistribution: $('#fcCatDistribution').val(),
	};
	if (!payload.name || !payload.name.trim()) { showMessageTheme2(0, 'Please enter a category name.'); return; }
	$.ajax({
		url: financialCostUrl('category/save'), type: 'POST', contentType: 'application/json', data: JSON.stringify(payload),
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) { if (res && res.status == '1') { fcHideModalThen('#fcCatModal', function () { showMessageTheme2(1, res.message || 'Saved.'); loadFinancialCost(__fcCurrentSessionId, $('#fcTopMonth').val() || 'ALL', '#fcTabCats'); }); } else { showMessageTheme2(0, (res && res.message) ? res.message : 'Could not save the category. Please try again.'); } },
		error: function () { showMessageTheme2(0, 'Could not save the category. Please try again.'); },
	});
}
