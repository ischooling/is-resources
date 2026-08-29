/*
 * Enrollment Analytics — the last tab of the Lead Report screen.
 *
 *  Two sub-tabs:
 *   - Reports : a copy of the "School Enrollment List Day wise" year-wise chart
 *               (reuses callEnrollmentListDaywise from leads.js into #eaChart),
 *               plus a monthwise analytic that compares each month's actual
 *               enrollments against the configured Settings target (% vs target)
 *               and against the previous month (% MoM growth).
 *   - Settings: CRUD over Enrollment / Re-Enrollment monthly targets
 *               (ENROLLMENT_TARGETS), Add Target modal + DataTable.
 *
 *  Backend: EnrollmentTargetController (plain JSON, resolved by UNIQUEUUID).
 *  Rendered from LeadReportListContent.js (getReportsTab / renderCounselorLeadReportDashboard).
 */

var __enrollmentTargetsData = null;
var __eaDaywiseChart = null;
var __eaLegendYoy = {}; // year(string) -> YoY % vs previous year (or null), for the legend

var EA_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Build a module URL, mirroring motivationalQuotesUrl(). */
function enrollmentTargetsUrl(action, id) {
	var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/enrollment-targets/' + action;
	if (id !== undefined && id !== null && id !== '') {
		url += '/' + id;
	}
	url += '/' + UNIQUEUUID;
	return url;
}

/* Escape for safe use inside HTML. */
function eaEsc(value) {
	if (value === undefined || value === null) {
		return '';
	}
	return String(value)
		.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* ------------------------------------------------------------------ *
 *  Tab markup (called by getReportsTab in LeadReportListContent.js)
 * ------------------------------------------------------------------ */

function getEnrollmentAnalytics(objRights) {
	var html = '';
	// Inner Reports / Settings nav
	html += '<ul class="nav nav-pills mb-3" id="eaSubNav">'
		+ '<li class="nav-item"><a class="nav-link active" id="eaTabReportsLink" data-toggle="tab" href="#eaTabReports" role="tab">Reports</a></li>'
		+ '<li class="nav-item"><a class="nav-link" id="eaTabSettingsLink" data-toggle="tab" href="#eaTabSettings" role="tab">Settings</a></li>'
		+ '</ul>';

	html += '<div class="tab-content">';

	// ── Reports sub-tab ─────────────────────────────────────────────
	// width:100%/min-width:0 guards against the pane being laid out inside a
	// shrink-to-fit/flex context (which squeezed Section B into a narrow column).
	html += '<div class="tab-pane fade show active" id="eaTabReports" role="tabpanel" style="width:100%;min-width:0;">';

	// Section A — copy of the day-wise year-wise chart
	html += '<h6 class="font-weight-bold mb-2">Enrollment Trend (Year-wise) '
		+ '<span id="eaTrendPeriod" class="text-muted" style="font-size:12px;font-weight:400;"></span></h6>';
	html += '<div class="custom-field-scope">'
		+ '<div class="d-flex flex-wrap align-items-start" style="gap:14px;">'
		+   '<div class="custom-field mb-0" style="width:200px;">'
		+     '<select class="form-control" id="eaReportType">'
		+       '<option value="Enrollment">Fresh Enrollment</option>'
		+       '<option value="ReEnrollment">Re-Enrollment</option>'
		+       '<option value="Leads">Leads</option>'
		+     '</select><label class="m-0 d-block mb-0">Report Type</label>'
		+   '</div>'
		+   '<div class="custom-field mb-0" style="width:170px;">'
		+     '<select class="form-control" id="eaViewType">'
		+       '<option value="DAY">Today</option><option value="WEEK">Week</option>'
		+       '<option value="MONTH">Month Wise</option><option value="CUSTOM">Custom</option>'
		+     '</select><label class="m-0 d-block mb-0">View Type</label>'
		+   '</div>'
		+   '<div class="custom-field mb-0" style="width:160px;">'
		+     '<select class="form-control" id="eaTrendYears">'
		+       '<option value="5" selected>Last 5 years</option><option value="4">Last 4 years</option>'
		+       '<option value="3">Last 3 years</option><option value="2">Last 2 years</option>'
		+     '</select><label class="m-0 d-block mb-0">Years</label>'
		+   '</div>'
		+   '<div class="eaHideCustom" style="display:none;">'  // no d-flex here: Bootstrap's .d-flex is !important and would defeat show/hide
		+     '<div style="display:flex;flex-wrap:wrap;align-items:flex-start;gap:10px;">'
		+       '<div class="custom-field mb-0" style="width:150px;"><input type="text" id="eaStartDate" class="form-control" placeholder=" " readonly onkeydown="return false" /><label class="m-0 d-block mb-0">Start Date</label></div>'
		+       '<div class="custom-field mb-0" style="width:150px;"><input type="text" id="eaEndDate" class="form-control" placeholder=" " readonly onkeydown="return false" /><label class="m-0 d-block mb-0">End Date</label></div>'
		+       '<button class="btn btn-primary" id="eaSubmit" type="button" style="height:44px;">Submit</button>'
		+     '</div>'
		+   '</div>'
		+ '</div></div>';
	html += '<div class="mb-3 card"><div class="pt-0 px-0 card-body"><div id="eaChart"></div>'
		+ '<div id="eaTargetLegend" class="d-flex justify-content-center flex-wrap px-2 pb-2" style="gap:6px 16px;font-size:12px;"></div>'
		+ '</div></div>';

	html += '</div>'; // eaTabReports

	// ── Settings sub-tab ────────────────────────────────────────────
	html += '<div class="tab-pane fade" id="eaTabSettings" role="tabpanel">';
	html += '<div class="d-flex align-items-center flex-wrap mb-3" style="gap:0.75rem">'
		+ '<h6 class="font-weight-bold m-0">Enrollment | Re-Enrollment Targets</h6>'
		+ '<select class="form-control form-control-sm" id="eaSettingsType" style="width:auto">'
		+   '<option value="ENROLLMENT">Fresh Enrollment</option>'
		+   '<option value="RE_ENROLLMENT">Re-Enrollment</option>'
		+ '</select>'
		+ '<a onclick="openTargetModal()" href="javascript:void(0);" class="btn btn-primary btn-sm ml-auto">&nbsp;Add Target</a>'
		+ '</div>';
	html += '<div style="width:100%;display:inline-block">'
		+ '<table class="table table-bordered table-striped font-12 nowrap" id="enrollmentTargetsTable" style="width:100% !important">'
		+ '<thead><tr class="bg-primary text-white">'
		+ '<th>S.No</th><th>Duration</th>'
		+ '<th>Jan</th><th>Feb</th><th>Mar</th><th>Apr</th><th>May</th><th>Jun</th>'
		+ '<th>Jul</th><th>Aug</th><th>Sep</th><th>Oct</th><th>Nov</th><th>Dec</th>'
		+ '<th>Total</th><th>Action</th>'
		+ '</tr></thead><tbody></tbody></table>'
		+ '</div>';
	html += '</div>'; // eaTabSettings

	html += '</div>'; // tab-content

	html += getTargetModalHtml();
	return html;
}

/* ------------------------------------------------------------------ *
 *  Tab init (called by renderCounselorLeadReportDashboard)
 * ------------------------------------------------------------------ */

function initEnrollmentAnalyticsTab() {
	// Section A: year-wise day-wise chart (self-contained — see eaCallDaywise below).
	eaCallDaywise('Enrollment', 'DAY', '', '');
	$('#eaViewType, #eaTrendYears').off('change').on('change', function () {
		if ($('#eaViewType').val() === 'CUSTOM') {
			$('.eaHideCustom').show();
			// wait for Submit; but still redraw if we already have custom dates
			if ($('#eaStartDate').val() && $('#eaEndDate').val()) {
				$('#eaSubmit').click();
			}
		} else {
			$('.eaHideCustom').hide();
			eaCallDaywise($('#eaReportType').val(), $('#eaViewType').val(), '', '');
		}
	});
	$('#eaReportType').off('change').on('change', function () {
		eaCallDaywise($('#eaReportType').val(), $('#eaViewType').val(), $('#eaStartDate').val() || '', $('#eaEndDate').val() || '');
	});
	$('#eaSubmit').off('click').on('click', function () {
		var s = $('#eaStartDate').val();
		var e = $('#eaEndDate').val();
		if (!s) { showMessageTheme2(1, 'Please choose a start date', '', true); return false; }
		if (!e) { showMessageTheme2(1, 'Please choose an end date', '', true); return false; }
		// eaResolvePeriod derives CUSTOM vs CUSTOM_MONTH from the dates.
		eaCallDaywise($('#eaReportType').val(), 'CUSTOM', s, e);
	});

	// Settings: load table + type filter.
	$('#eaSettingsType').off('change').on('change', function () { loadEnrollmentTargets(); });
	loadEnrollmentTargets();
}

/* ------------------------------------------------------------------ *
 *  Reports » year-wise day-wise chart (self-contained)
 *  Calls the shared get-enrolled-list-daywise / get-enrolled-country-wise
 *  controllers directly (the global $.ajaxSetup beforeSend wraps + encrypts
 *  the JSON body and sets the UNIQUEUUID header), and renders into #eaChart.
 * ------------------------------------------------------------------ */

function eaBuildDaywiseRequest(reportType, modeSearch, startDate, endDate, year) {
	var req = {
		schoolId: SCHOOL_ID,
		modeSearch: modeSearch,
		startDate: startDate,
		endDate: endDate,
		reportType: reportType,
		authentication: {
			hash: (typeof getHash === 'function' ? getHash() : ''),
			schoolId: SCHOOL_ID,
			schoolUUID: SCHOOL_UUID,
			userId: USER_ID,
			userType: 'COMMON',
		},
	};
	if (year !== undefined && year !== null && year !== '') {
		req.year = parseInt(year);
	}
	return req;
}

/* Two-digit day/month. */
function eaPad(n) { return ('0' + n).slice(-2); }

/**
 * Resolve the effective backend mode + dates for a View Type so every period is a
 * single window per year (one bar per year), and the target pro-rates to it:
 *  - DAY   → today (backend DAY)
 *  - WEEK  → current week (backend WEEK)
 *  - MONTH → current month only, sent as a CUSTOM range (NOT the 12-month view)
 *  - CUSTOM→ the picked range
 * Returns {mode, start, end} (dates dd-MM-yyyy where relevant).
 */
function eaResolvePeriod(viewType, startDate, endDate) {
	var now = new Date();
	if (viewType === 'MONTH') {
		var first = new Date(now.getFullYear(), now.getMonth(), 1);
		var last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		var s = eaPad(first.getDate()) + '-' + eaPad(first.getMonth() + 1) + '-' + first.getFullYear();
		var e = eaPad(last.getDate()) + '-' + eaPad(last.getMonth() + 1) + '-' + last.getFullYear();
		return { mode: 'CUSTOM', start: s, end: e };
	}
	if (viewType === 'CUSTOM') {
		// Preserve the same-month vs multi-month distinction the Submit handler uses.
		var mode = 'CUSTOM';
		if (startDate && endDate) {
			var sp = startDate.split('-'), ep = endDate.split('-');
			var sd = new Date(sp[2], parseInt(sp[1]) - 1, sp[0]);
			var ed = new Date(ep[2], parseInt(ep[1]) - 1, ep[0]);
			if (sd.getMonth() !== ed.getMonth() || sd.getFullYear() !== ed.getFullYear()) { mode = 'CUSTOM_MONTH'; }
		}
		return { mode: mode, start: startDate || '', end: endDate || '' };
	}
	// DAY / WEEK handled natively by the backend.
	return { mode: viewType, start: '', end: '' };
}

function eaCallDaywise(reportType, viewType, startDate, endDate) {
	// Re-Enrollment isn't supported by the day-wise endpoint (fixed enrolment
	// types), so it uses the dedicated per-year period-actual endpoint.
	if (reportType === 'ReEnrollment') {
		eaLoadReEnrollment(viewType, startDate, endDate);
		return;
	}
	var period = eaResolvePeriod(viewType, startDate, endDate);
	$.ajax({
		type: 'POST',
		contentType: (typeof APPLICATION_JSON_VALUE !== 'undefined' ? APPLICATION_JSON_VALUE : 'application/json'),
		url: getURLForHTML('dashboard', 'get-enrolled-list-daywise'),
		data: JSON.stringify(eaBuildDaywiseRequest(reportType, period.mode, period.start, period.end)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'] || 'Unable to load the report.');
				return;
			}
			eaRenderDaywiseChart(data, reportType, period.mode, period.start, period.end, viewType);
		},
		error: function () { showMessageTheme2(0, 'Unable to load the report. Please try again.'); },
	});
}

/* Sum-per-year legend, mirroring the day-wise report's legend. */
function eaLegendFormatter(seriesName, opts) {
	var seriesVal = opts.w.globals.series[opts.seriesIndex];
	var total = 0;
	for (var i = 0; i < seriesVal.length; i++) { total += seriesVal[i]; }
	// YoY % vs the previous year for the SAME period, shown inline in the legend.
	var yoy = __eaLegendYoy[String(seriesName)];
	var yoyHtml = '';
	if (yoy !== null && yoy !== undefined) {
		var up = yoy >= 0;
		yoyHtml = '<span class="d-inline-flex align-items-center" style="color:' + (up ? 'var(--success)' : 'var(--danger)')
			+ ';font-size:11px;">(' + (up ? '▲' : '▼') + ' ' + Math.abs(yoy).toFixed(1) + '%)</span>';
	}
	return '<div class="d-flex justify-content-center flex-wrap align-items-center data-count-year" style="gap:4px;">'
		+ '<span class="d-inline-flex align-items-center">' + seriesName + ':</span>'
		+ '<span class="d-inline-flex align-items-center"><b>' + total + '</b></span>'
		+ yoyHtml + '</div>';
}

/* Human date-range label for the current View Type. */
function eaPeriodLabel(modeSearch, startDate, endDate) {
	function fmt(d) {
		var dd = ('0' + d.getDate()).slice(-2);
		var mm = ('0' + (d.getMonth() + 1)).slice(-2);
		return dd + '-' + mm + '-' + d.getFullYear();
	}
	var now = new Date();
	if (modeSearch === 'DAY') {
		return '— ' + fmt(now) + ' (today, vs same day prior years)';
	}
	if (modeSearch === 'WEEK') {
		var dow = now.getDay(); // 0=Sun
		var monOffset = (dow === 0 ? -6 : 1 - dow);
		var ws = new Date(now); ws.setDate(now.getDate() + monOffset);
		var we = new Date(ws); we.setDate(ws.getDate() + 6);
		return '— ' + fmt(ws) + ' → ' + fmt(we) + ' (this week, vs same week prior years)';
	}
	if (modeSearch === 'MONTH') {
		var ms = new Date(now.getFullYear(), now.getMonth(), 1);
		var me = new Date(now.getFullYear(), now.getMonth() + 1, 0);
		return '— ' + fmt(ms) + ' → ' + fmt(me) + ' (this month, vs same month prior years)';
	}
	if ((modeSearch === 'CUSTOM' || modeSearch === 'CUSTOM_MONTH') && startDate && endDate) {
		return '— ' + startDate + ' → ' + endDate + ' (vs same range prior years)';
	}
	return '';
}

/* Short x-axis category label for the single period group. */
function eaPeriodShort(viewType, startDate, endDate) {
	var mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var now = new Date();
	if (viewType === 'DAY') { return eaPad(now.getDate()) + ' ' + mon[now.getMonth()]; }
	if (viewType === 'WEEK') { return 'This week'; }
	if (viewType === 'MONTH') { return mon[now.getMonth()]; }
	if ((viewType === 'CUSTOM' || viewType === 'CUSTOM_MONTH') && startDate && endDate) { return startDate + ' – ' + endDate; }
	return 'Period';
}

/* Build one bar series per academic year + the shared x-axis categories. */
function eaBuildSeries(enrollList, colType, modeSearch) {
	var attrMonth = [], series = [];
	if (!enrollList || !enrollList.length) { return { series: series, attrMonth: attrMonth }; }
	for (var ind = 0; ind < enrollList.length; ind++) {
		var yearBlock = enrollList[ind];
		var yearName = yearBlock.academicYear;
		var monthList = yearBlock.enrollListMonth || [];
		var data = [];
		var isLast = (ind === enrollList.length - 1);
		for (var t = 0; t < monthList.length; t++) {
			var em = monthList[t];
			if (modeSearch == 'MONTH' || modeSearch == 'CUSTOM_MONTH') {
				data.push(colType == 'Leads' ? em.totalLead : em.totalEnrollment);
				if (isLast) { attrMonth.push(em.meetingDate); }
			} else {
				var dayList = em.enrollDayList || [];
				for (var d = 0; d < dayList.length; d++) {
					var se = dayList[d];
					data.push(colType == 'Leads' ? se.leadDaywise : se.enrollDaywise);
					if (isLast) { attrMonth.push(se.meetingDate.replace(', ' + yearName, '')); }
				}
			}
		}
		series.push({ name: yearName, data: data });
	}
	return { series: series, attrMonth: attrMonth };
}

function eaRenderDaywiseChart(data, colType, modeSearch, startDate, endDate, viewType) {
	// One aggregated value per year for the selected period (not day-wise/12-month).
	var nYears = parseInt($('#eaTrendYears').val() || '5', 10);
	var allYears = (data.enrollListMonth || []).slice().sort(function (a, b) { return (a.academicYear || 0) - (b.academicYear || 0); });
	var summaryList = allYears.slice(-(nYears + 1)); // one extra oldest year for YoY
	var totalsBuilt = eaBuildSeries(summaryList, colType, modeSearch).series;
	var perYearTotals = totalsBuilt.map(function (s) {
		var sum = 0;
		(s.data || []).forEach(function (v) { sum += (v || 0); });
		return { year: s.name, total: sum };
	});
	eaApplyTrend(perYearTotals, {
		tooltipWord: colType, viewType: viewType, modeSearch: modeSearch,
		startDate: startDate, endDate: endDate, nYears: nYears,
		labelType: colType === 'Leads' ? 'Leads' : 'Fresh Enrollment',
		targetType: colType === 'Leads' ? null : 'ENROLLMENT',
		allowCompare: true, compareColType: colType,
	});
}

/* Re-Enrollment path — per-year totals from the dedicated period-actual endpoint. */
function eaLoadReEnrollment(viewType, startDate, endDate) {
	var nYears = parseInt($('#eaTrendYears').val() || '5', 10);
	var period = eaResolvePeriod(viewType, startDate, endDate);
	var latest = new Date().getFullYear();
	var url = enrollmentTargetsUrl('period-actual')
		+ '?type=RE_ENROLLMENT&year=' + latest + '&years=' + nYears
		+ '&modeSearch=' + encodeURIComponent(period.mode)
		+ '&start=' + encodeURIComponent(period.start || '')
		+ '&end=' + encodeURIComponent(period.end || '');
	$.ajax({
		url: url,
		type: 'GET',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			if (!res || res.status != '1') { showMessageTheme2(0, (res && res.message) ? res.message : 'Unable to load Re-Enrollment.'); return; }
			var perYearTotals = (res.years || []).map(function (y, i) {
				return { year: String(y), total: (res.actuals || [])[i] || 0 };
			});
			eaApplyTrend(perYearTotals, {
				tooltipWord: 'Re-Enrollment', viewType: viewType, modeSearch: period.mode,
				startDate: period.start, endDate: period.end, nYears: nYears,
				labelType: 'Re-Enrollment', targetType: 'RE_ENROLLMENT', allowCompare: false,
			});
		},
		error: function () { showMessageTheme2(0, 'Unable to load Re-Enrollment. Please try again.'); },
	});
}

/* Shared: render the one-bar-per-year trend chart + legend YoY + heading + summary. */
function eaApplyTrend(perYearTotals, opts) {
	// Legend YoY map: each year vs the previous year in the ordered list.
	__eaLegendYoy = {};
	perYearTotals.forEach(function (r, i) {
		if (i > 0) {
			var prev = perYearTotals[i - 1].total;
			__eaLegendYoy[String(r.year)] = prev > 0 ? (Math.round(((r.total - prev) * 1000.0) / prev) / 10.0) : null;
		} else {
			__eaLegendYoy[String(r.year)] = null;
		}
	});

	$('#eaTrendPeriod').text(eaPeriodLabel(opts.viewType || opts.modeSearch, opts.startDate, opts.endDate));

	var chartYears = perYearTotals.slice(-opts.nYears);
	var series = chartYears.map(function (r) { return { name: String(r.year), data: [r.total] }; });
	var category = eaPeriodShort(opts.viewType || opts.modeSearch, opts.startDate, opts.endDate);
	var tooltipWord = opts.tooltipWord;

	var chartCfg = {
		height: 350, type: 'bar',
	};
	if (opts.allowCompare) {
		chartCfg.events = {
			legendClick: function (chartContext, seriesIndex, config) {
				var clickedYear = config.config.series[seriesIndex].name;
				eaOpenCountryModal(clickedYear, opts.modeSearch, opts.compareColType, opts.startDate, opts.endDate);
			},
		};
	}
	var options = {
		series: series,
		chart: chartCfg,
		plotOptions: { bar: { borderRadius: 8, columnWidth: chartYears.length > 3 ? '60%' : '35%', dataLabels: { position: 'top' } } },
		legend: { show: true, formatter: eaLegendFormatter, onItemClick: { toggleDataSeries: false } },
		dataLabels: { enabled: true, formatter: function (val) { return val; }, offsetY: -22, style: { fontSize: '12px', colors: ['#304758'] } },
		xaxis: { categories: [category], position: 'bottom', axisBorder: { show: false }, axisTicks: { show: false } },
		yaxis: { axisBorder: { show: false }, axisTicks: { show: false }, labels: { show: false } },
		tooltip: { y: { formatter: function (val) { return tooltipWord + ' ' + val; } } },
	};

	var el = document.querySelector('#eaChart');
	if (el) { el.innerHTML = ''; }
	if (__eaDaywiseChart) { try { __eaDaywiseChart.destroy(); } catch (e) {} }
	__eaDaywiseChart = new ApexCharts(el, options);
	__eaDaywiseChart.render();

	// Enrollment Compare is country-based (fresh/leads only); hide it for Re-Enrollment.
	if (opts.allowCompare) {
		if ($('#eaBtnCompare').length === 0) {
			$('#eaChart').after('<div class="text-center mt-2 mb-3" id="eaCompareWrap"><button type="button" class="btn btn-outline-primary btn-sm" id="eaBtnCompare"><i class="fa fa-balance-scale mr-1"></i><span id="eaBtnCompareLabel">Enrollment Compare</span></button></div>');
		}
		$('#eaCompareWrap').show();
		$('#eaBtnCompareLabel').text(opts.compareColType === 'Leads' ? 'Leads Compare' : 'Enrollment Compare');
		var years = chartYears.map(function (r) { return parseInt(r.year, 10); });
		$('#eaBtnCompare').off('click').on('click', function () {
			eaOpenCompareModal(years, opts.modeSearch, opts.compareColType, opts.startDate, opts.endDate);
		});
	} else {
		$('#eaCompareWrap').hide();
	}

	// Second legend: each year's actual vs its (period pro-rated) target.
	eaLoadTargetLegend(chartYears, opts);
}

/* Render a "vs target" legend row under the chart: per year, % gain/short vs target. */
function eaLoadTargetLegend(chartYears, opts) {
	var $box = $('#eaTargetLegend');
	if (!opts.targetType) { $box.empty(); return; } // Leads have no target
	var latest = chartYears.length ? chartYears[chartYears.length - 1].year : new Date().getFullYear();
	var url = enrollmentTargetsUrl('period-target')
		+ '?type=' + encodeURIComponent(opts.targetType) + '&year=' + encodeURIComponent(latest)
		+ '&years=' + encodeURIComponent(opts.nYears)
		+ '&modeSearch=' + encodeURIComponent(opts.modeSearch)
		+ '&start=' + encodeURIComponent(opts.startDate || '')
		+ '&end=' + encodeURIComponent(opts.endDate || '');
	$box.html('<span class="text-muted">Loading target comparison…</span>');
	$.ajax({
		url: url, type: 'GET',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			var targetByYear = {};
			if (res && res.status == '1' && res.years) {
				res.years.forEach(function (y, i) { targetByYear[y] = (res.targets || [])[i]; });
			}
			eaRenderTargetLegend(chartYears, targetByYear);
		},
		error: function () { $box.empty(); },
	});
}

function eaRenderTargetLegend(chartYears, targetByYear) {
	var items = chartYears.map(function (r) {
		var t = targetByYear[parseInt(r.year, 10)];
		if (t === null || t === undefined) {
			return '<span class="d-inline-flex align-items-center">' + eaEsc(r.year)
				+ ': <span class="text-muted ml-1">no target</span></span>';
		}
		var pctHtml, tip;
		if (t > 0) {
			var pct = Math.round(((r.total - t) * 1000.0) / t) / 10.0;
			var up = pct >= 0;
			pctHtml = '<span style="color:' + (up ? 'var(--success)' : 'var(--danger)') + ';font-weight:600;">('
				+ (up ? '▲' : '▼') + ' ' + Math.abs(pct).toFixed(1) + '%)</span>';
		} else {
			pctHtml = '<span class="text-muted">(—)</span>';
		}
		return '<span class="d-inline-flex align-items-center" style="gap:4px;">'
			+ eaEsc(r.year) + ': <b>' + r.total + '</b> / tgt <b>' + t + '</b> ' + pctHtml + '</span>';
	}).join('');
	$('#eaTargetLegend').html(
		'<span class="w-100 text-center text-muted mb-1" style="font-size:11px;">Actual vs Target (period pro-rated)</span>' + items
	);
}

/* ── Country drill-down (legend click) ─────────────────────────── */

function eaEnsureCountryModal() {
	if ($('#eaCountryModal').length) return;
	$('body').append(''
		+ '<div class="modal fade bd-example-modal-lg fade-scale" id="eaCountryModal" tabindex="-1" role="dialog" aria-hidden="true">'
		+ '  <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document"><div class="modal-content border-0">'
		+ '    <div class="modal-header py-2 bg-primary text-white">'
		+ '      <h5 class="modal-title"><span id="eaCountryModalTitle">Enrollments</span> by Country &mdash; <span id="eaCountryModalYear"></span></h5>'
		+ '      <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+ '    </div><div class="modal-body" id="eaCountryModalBody"></div>'
		+ '  </div></div></div>');
}

function eaRenderCountryTable(countryList, reportType) {
	var isLeads = reportType === 'Leads';
	var metricLabel = isLeads ? 'Leads' : 'Enrolled Students';
	var metricWord = isLeads ? 'leads' : 'enrolled students';
	if (!countryList || !countryList.length) {
		$('#eaCountryModalBody').html('<div class="text-center text-muted py-4">No ' + metricWord + ' found for this year.</div>');
		return;
	}
	var total = 0;
	countryList.forEach(function (r) { total += (r.count || 0); });
	var html = '<div class="mb-2 text-muted" style="font-size:13px;">' + countryList.length + ' countries &middot; <b>' + total + '</b> total ' + metricWord + '</div>';
	html += '<table id="eaCountryTable" class="table table-bordered table-hover mb-0" style="width:100%;"><thead><tr class="bg-primary text-white"><th>S.No.</th><th>Country</th><th class="text-center">' + metricLabel + '</th></tr></thead><tbody>';
	countryList.forEach(function (r, idx) {
		html += '<tr><td>' + (idx + 1) + '</td><td>' + eaEsc(r.country || 'Unknown') + '</td><td class="text-center"><b>' + r.count + '</b></td></tr>';
	});
	html += '</tbody></table>';
	$('#eaCountryModalBody').html(html);
	if ($.fn.DataTable.isDataTable('#eaCountryTable')) { $('#eaCountryTable').DataTable().destroy(); }
	$('#eaCountryTable').DataTable({ theme: 'bootstrap4', order: [[2, 'desc']], pageLength: 10, lengthMenu: [10, 20, 50, 100, 200] });
}

function eaOpenCountryModal(year, modeSearch, reportType, startDate, endDate) {
	eaEnsureCountryModal();
	$('#eaCountryModalTitle').text(reportType === 'Leads' ? 'Leads' : 'Enrollments');
	$('#eaCountryModalYear').text(year);
	$('#eaCountryModalBody').html('<div class="text-center py-4 text-muted"><i class="fa fa-spinner fa-spin mr-2"></i>Loading...</div>');
	$('#eaCountryModal').modal('show');
	$.ajax({
		type: 'POST',
		contentType: (typeof APPLICATION_JSON_VALUE !== 'undefined' ? APPLICATION_JSON_VALUE : 'application/json'),
		url: getURLForHTML('dashboard', 'get-enrolled-country-wise'),
		data: JSON.stringify(eaBuildDaywiseRequest(reportType, modeSearch, startDate, endDate, year)),
		dataType: 'json',
		cache: false,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				$('#eaCountryModalBody').html('<div class="text-center text-danger py-4">' + (data['message'] || 'Unable to load data.') + '</div>');
				return;
			}
			eaRenderCountryTable(data.countryList || [], reportType);
		},
		error: function () { $('#eaCountryModalBody').html('<div class="text-center text-danger py-4">Unable to load country breakdown.</div>'); },
	});
}

/* ── Enrollment Compare (all years side-by-side, by country) ────── */

function eaEnsureCompareModal() {
	if ($('#eaCompareModal').length) return;
	$('body').append(''
		+ '<div class="modal fade bd-example-modal-lg fade-scale" id="eaCompareModal" tabindex="-1" role="dialog" aria-hidden="true">'
		+ '  <div class="modal-dialog modal-xl modal-dialog-scrollable" role="document"><div class="modal-content border-0">'
		+ '    <div class="modal-header py-2 bg-primary text-white">'
		+ '      <h5 class="modal-title"><span id="eaCompareModalTitle">Enrollment</span> Compare &mdash; Year over Year by Country</h5>'
		+ '      <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+ '    </div><div class="modal-body" id="eaCompareModalBody"></div>'
		+ '  </div></div></div>');
}

function eaRenderCompareTable(years, perYearData, reportType) {
	var metricWord = reportType === 'Leads' ? 'leads' : 'enrolled students';
	var countryRows = {}, countryOrder = [];
	years.forEach(function (year, idx) {
		(perYearData[idx] || []).forEach(function (row) {
			var country = row.country || 'Unknown';
			if (!countryRows[country]) { countryRows[country] = {}; countryOrder.push(country); }
			countryRows[country][year] = row.count || 0;
		});
	});
	if (!countryOrder.length) {
		$('#eaCompareModalBody').html('<div class="text-center text-muted py-4">No ' + metricWord + ' found for these years.</div>');
		return;
	}
	var yearColTotals = {}; years.forEach(function (y) { yearColTotals[y] = 0; });
	var grandTotal = 0;
	var rows = countryOrder.map(function (country) {
		var rowTotal = 0;
		var cells = years.map(function (y) { var v = countryRows[country][y] || 0; rowTotal += v; yearColTotals[y] += v; return v; });
		grandTotal += rowTotal;
		return { country: country, cells: cells, total: rowTotal };
	});
	rows.sort(function (a, b) { return b.total - a.total; });

	var html = '<div class="mb-2 text-muted" style="font-size:13px;">' + rows.length + ' countries &middot; <b>' + grandTotal + '</b> total ' + metricWord + ' across ' + years.length + ' years</div>';
	html += '<table id="eaCompareTable" class="table table-bordered table-hover mb-0" style="width:100%;"><thead><tr class="bg-primary text-white"><th>S.No.</th><th>Country</th>';
	years.forEach(function (y) { html += '<th class="text-center">' + y + '</th>'; });
	html += '<th class="text-center">Total</th></tr></thead><tbody>';
	rows.forEach(function (row, idx) {
		html += '<tr><td>' + (idx + 1) + '</td><td>' + eaEsc(row.country) + '</td>';
		row.cells.forEach(function (v) { html += '<td class="text-center">' + v + '</td>'; });
		html += '<td class="text-center"><b>' + row.total + '</b></td></tr>';
	});
	html += '</tbody><tfoot><tr class="bg-light"><th></th><th>Column Total</th>';
	years.forEach(function (y) { html += '<th class="text-center">' + yearColTotals[y] + '</th>'; });
	html += '<th class="text-center">' + grandTotal + '</th></tr></tfoot></table>';
	$('#eaCompareModalBody').html(html);
	if ($.fn.DataTable.isDataTable('#eaCompareTable')) { $('#eaCompareTable').DataTable().destroy(); }
	$('#eaCompareTable').DataTable({ theme: 'bootstrap4', order: [[years.length + 2, 'desc']], pageLength: 10, lengthMenu: [10, 20, 50, 100, 200] });
}

function eaOpenCompareModal(years, modeSearch, reportType, startDate, endDate) {
	if (!years || !years.length) { showMessageTheme2(0, 'No years available to compare.'); return; }
	eaEnsureCompareModal();
	$('#eaCompareModalTitle').text(reportType === 'Leads' ? 'Leads' : 'Enrollment');
	$('#eaCompareModalBody').html('<div class="text-center py-4 text-muted"><i class="fa fa-spinner fa-spin mr-2"></i>Loading...</div>');
	$('#eaCompareModal').modal('show');
	var requests = years.map(function (year) {
		return $.ajax({
			type: 'POST',
			contentType: (typeof APPLICATION_JSON_VALUE !== 'undefined' ? APPLICATION_JSON_VALUE : 'application/json'),
			url: getURLForHTML('dashboard', 'get-enrolled-country-wise'),
			data: JSON.stringify(eaBuildDaywiseRequest(reportType, modeSearch, startDate, endDate, year)),
			dataType: 'json',
			cache: false,
		});
	});
	Promise.all(requests).then(function (responses) {
		var perYearData = responses.map(function (data) {
			if (!data || data['status'] == '0' || data['status'] == '2') return [];
			return data.countryList || [];
		});
		eaRenderCompareTable(years, perYearData, reportType);
	}).catch(function () {
		$('#eaCompareModalBody').html('<div class="text-center text-danger py-4">Unable to load comparison data.</div>');
	});
}


/* ------------------------------------------------------------------ *
 *  Settings » targets table
 * ------------------------------------------------------------------ */

function loadEnrollmentTargets() {
	var type = $('#eaSettingsType').val() || 'ENROLLMENT';
	$.ajax({
		url: enrollmentTargetsUrl('data') + '?type=' + encodeURIComponent(type),
		type: 'GET',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			if (!res || res.status != '1') {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Unable to load targets.');
				return;
			}
			__enrollmentTargetsData = res;
			renderEnrollmentTargetsTable(res);
		},
		error: function () { showMessageTheme2(0, 'Unable to load targets. Please try again.'); },
	});
}

function renderEnrollmentTargetsTable(res) {
	if ($.fn.DataTable.isDataTable('#enrollmentTargetsTable')) {
		$('#enrollmentTargetsTable').DataTable().destroy();
	}
	var targets = res.targets || [];
	var canManage = res.canManage;
	var rows = '';
	for (var i = 0; i < targets.length; i++) {
		rows += buildTargetRowHtml(targets[i], i, canManage);
	}
	$('#enrollmentTargetsTable tbody').html(rows);
	$('#enrollmentTargetsTable').DataTable({
		processing: true,
		serverSide: false,
		pageLength: 10,
		order: [],
		searching: false,
	});
}

function buildTargetRowHtml(t, index, canManage) {
	var months = t.months || [];
	var monthCells = '';
	for (var i = 0; i < 12; i++) {
		monthCells += '<td class="text-center">' + (months[i] !== undefined ? months[i] : 0) + '</td>';
	}
	var actions = '<span class="text-muted">—</span>';
	if (canManage) {
		var delCall = 'deleteEnrollmentTarget(' + t.id + ')';
		actions = '<div class="dropdown">'
			+ '<button class="btn btn-sm dropdown-toggle" style="background-color:var(--pc);border-color:var(--pc);color:#fff;box-shadow:none;" data-toggle="dropdown"><i class="fa fa-ellipsis-v"></i></button>'
			+ '<ul class="dropdown-menu"><li>'
			+ '<a href="javascript:void(0);" class="dropdown-item" onclick="openTargetModal(' + t.id + ')"><i class="fa fa-edit"></i>&nbsp;Edit</a>'
			+ '<a href="javascript:void(0);" class="dropdown-item" onclick="showWarningMessage(\'Are you sure you want to delete this target?\', \'' + delCall + '\')"><i class="fa fa-trash"></i>&nbsp;Delete</a>'
			+ '</li></ul></div>';
	}
	return '<tr>'
		+ '<td>' + (index + 1) + '</td>'
		+ '<td class="text-nowrap">' + eaEsc(t.startDate) + ' &mdash; ' + eaEsc(t.endDate) + '</td>'
		+ monthCells
		+ '<td class="text-center"><b>' + (t.total !== undefined ? t.total : 0) + '</b></td>'
		+ '<td>' + actions + '</td>'
		+ '</tr>';
}

/* ------------------------------------------------------------------ *
 *  Settings » Add / Edit target modal
 * ------------------------------------------------------------------ */

function getTargetModalHtml() {
	var monthInputs = '';
	EA_MONTHS.forEach(function (m) {
		monthInputs += '<div class="col-6 col-md-2 mb-3">'
			+ '<div class="custom-field mb-0">'
			+   '<input type="number" min="0" class="form-control eaMonthInput" id="target' + m + '" value="0" placeholder=" " />'
			+   '<label>' + m + '</label>'
			+ '</div></div>';
	});
	return ''
		+ '<div class="modal fade fade-scale" id="targetFormModal" tabindex="-1" role="dialog" aria-hidden="true">'
		+  '<div class="modal-dialog modal-xl" role="document"><div class="modal-content">'
		+   '<div class="modal-header bg-primary text-white">'
		+     '<h5 class="modal-title" id="targetModalTitle">Add Target</h5>'
		+     '<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
		+   '</div>'
		+   '<div class="modal-body custom-field-scope">'
		+     '<input type="hidden" id="targetId" />'
		+     '<div class="form-row">'
		+       '<div class="col-md-4 mb-3"><div class="custom-field mb-0">'
		+         '<select id="targetType" class="form-control"><option value="ENROLLMENT">Fresh Enrollment</option><option value="RE_ENROLLMENT">Re-Enrollment</option></select>'
		+         '<label>Type <span class="text-danger">*</span></label></div></div>'
		+       '<div class="col-md-4 mb-3"><div class="custom-field mb-0">'
		+         '<input type="text" id="targetStartDate" class="form-control" placeholder=" " readonly onkeydown="return false" />'
		+         '<label>Start Date <span class="text-danger">*</span></label></div></div>'
		+       '<div class="col-md-4 mb-3"><div class="custom-field mb-0">'
		+         '<input type="text" id="targetEndDate" class="form-control" placeholder=" " readonly onkeydown="return false" />'
		+         '<label>End Date <span class="text-danger">*</span></label></div></div>'
		+     '</div>'
		+     '<hr class="my-2"/>'
		+     '<div class="form-row">' + monthInputs + '</div>'
		+     '<div class="form-row align-items-center">'
		+       '<div class="col-md-4 mb-0"><div class="custom-field mb-0">'
		+         '<input type="number" min="0" class="form-control" id="targetTotal" value="0" placeholder=" " />'
		+         '<label>Total Target</label></div></div>'
		+       '<div class="col-md-8 text-muted" style="font-size:12px;">Total auto-sums the 12 months; edit it if you want a different overall target.</div>'
		+     '</div>'
		+   '</div>'
		+   '<div class="modal-footer">'
		+     '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'
		+     '<button type="button" class="btn btn-primary" id="targetSaveBtn" onclick="saveTarget()">Save</button>'
		+   '</div>'
		+  '</div></div>'
		+ '</div>';
}

/* Keep Total in sync with the 12 month inputs (user can still override). */
function bindTargetAutoSum() {
	$('.eaMonthInput').off('input.ea').on('input.ea', function () {
		var sum = 0;
		$('.eaMonthInput').each(function () { sum += parseInt($(this).val() || 0, 10) || 0; });
		$('#targetTotal').val(sum);
	});
}

function openTargetModal(id) {
	// Reset.
	$('#targetId').val('');
	$('#targetType').val($('#eaSettingsType').val() || 'ENROLLMENT');
	$('#targetStartDate').val('');
	$('#targetEndDate').val('');
	$('.eaMonthInput').val(0);
	$('#targetTotal').val(0);
	$('#targetModalTitle').text('Add Target');

	if (id !== undefined && id !== null) {
		var t = ((__enrollmentTargetsData && __enrollmentTargetsData.targets) || []).filter(function (x) { return x.id === id; })[0];
		if (t) {
			$('#targetModalTitle').text('Edit Target');
			$('#targetId').val(t.id);
			$('#targetType').val(t.enrollmentType);
			$('#targetStartDate').val(t.startDate);
			$('#targetEndDate').val(t.endDate);
			var months = t.months || [];
			for (var i = 0; i < 12; i++) {
				$('#target' + EA_MONTHS[i]).val(months[i] !== undefined ? months[i] : 0);
			}
			$('#targetTotal').val(t.total !== undefined ? t.total : 0);
		}
	}
	bindTargetAutoSum();
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#targetFormModal'));
	}
	$('#targetFormModal').modal('show');
}

function saveTarget() {
	var start = $('#targetStartDate').val();
	var end = $('#targetEndDate').val();
	if (!start || !end) {
		showMessageTheme2(0, 'Please choose both a start and end date.');
		return;
	}
	var idVal = $('#targetId').val();
	var months = {};
	var keys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
	for (var i = 0; i < 12; i++) {
		months[keys[i]] = parseInt($('#target' + EA_MONTHS[i]).val() || 0, 10) || 0;
	}
	var payload = Object.assign({
		id: idVal ? parseInt(idVal, 10) : null,
		enrollmentType: $('#targetType').val(),
		startDate: start,
		endDate: end,
		total: parseInt($('#targetTotal').val() || 0, 10) || 0,
	}, months);

	$('#targetSaveBtn').prop('disabled', true).text('Saving...');
	$.ajax({
		url: enrollmentTargetsUrl('save'),
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(payload),
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			$('#targetSaveBtn').prop('disabled', false).text('Save');
			if (res && res.status == '1') {
				$('#targetFormModal').modal('hide');
				$('.modal-backdrop').remove();
				$('body').removeClass('modal-open').css({ 'overflow': '', 'padding-right': '' });
				showMessageTheme2(1, res.message || 'Saved.');
				// Reflect the saved type in the Settings filter.
				$('#eaSettingsType').val(payload.enrollmentType);
				loadEnrollmentTargets();
			} else {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Could not save the target.');
			}
		},
		error: function () {
			$('#targetSaveBtn').prop('disabled', false).text('Save');
			showMessageTheme2(0, 'Could not save the target. Please try again.');
		},
	});
}

function deleteEnrollmentTarget(id) {
	$.ajax({
		url: enrollmentTargetsUrl('delete', id),
		type: 'POST',
		contentType: 'application/json',
		beforeSend: function (xhr) { xhr.setRequestHeader('UNIQUEUUID', UNIQUEUUID); },
		success: function (res) {
			if (res && res.status == '1') {
				showMessageTheme2(1, res.message || 'Deleted.');
				loadEnrollmentTargets();
			} else {
				showMessageTheme2(0, (res && res.message) ? res.message : 'Could not delete the target.');
			}
		},
		error: function () { showMessageTheme2(0, 'Could not delete the target. Please try again.'); },
	});
}
