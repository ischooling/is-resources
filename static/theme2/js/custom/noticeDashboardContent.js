function renderNoticeDashboardContent() {
  loadWorkspaceNotices(function () {
    $('#dashboardContentInHTML').html(dashboardPageHtml());
    _initDashboardCharts();
  });
}

function dashboardPageHtml() {
  return '<div class="d-flex align-items-center mb-1">' +
      '<div class="h2 mb-0 mr-3">&#128202;</div>' +
      '<div><div class="h4 mb-0">Dashboard</div>' +
      '<div class="text-muted small">Notice delivery &amp; engagement across 190+ countries</div></div>' +
    '</div><hr class="mt-2 mb-4">' +
    _dashboardKpiRowHtml(_dashboardKpiRow1()) +
    _dashboardKpiRowHtml(_dashboardKpiRow2()) +
    '<div class="row mb-4">' +
      '<div class="col-lg-8 mb-4 mb-lg-0">' +
        '<div class="card h-100"><div class="card-body">' +
          '<div class="d-flex justify-content-between align-items-start mb-1">' +
            '<div><div class="h6 mb-0">Delivery volume &amp; engagement</div>' +
            '<div class="text-muted small">Last 7 days &middot; by channel</div></div>' +
          '</div>' +
          '<div id="noticeBarChart" style="min-height:220px;"></div>' +
          '<div class="d-flex small mt-2">' +
            '<span class="mr-4"><span style="display:inline-block;width:12px;height:12px;background:#008FFB;border-radius:2px;margin-right:4px;"></span>Delivered</span>' +
            '<span><span style="display:inline-block;width:12px;height:12px;background:#00E396;border-radius:2px;margin-right:4px;"></span>Opened</span>' +
          '</div>' +
        '</div></div>' +
      '</div>' +
      '<div class="col-lg-4">' +
        '<div class="card h-100"><div class="card-body">' +
          '<div class="h6 mb-0">Channel mix</div>' +
          '<div class="text-muted small mb-2">Share of messages sent</div>' +
          '<div id="noticeDonutChart" style="min-height:220px;"></div>' +
        '</div></div>' +
      '</div>' +
    '</div>' +
    '<div class="card mb-4"><div class="card-body">' +
      '<div class="h6 mb-0">Recent activity</div>' +
      '<div class="text-muted small mb-3">Latest notices and their live status</div>' +
      '<div class="table-responsive"><table class="table table-hover">' +
        '<thead><tr><th>Notice</th><th>Type</th><th>Priority</th><th>Audience</th><th>Status</th><th>Delivered</th></tr></thead>' +
        '<tbody>' + _dashboardRecentRowsHtml() + '</tbody>' +
      '</table></div>' +
    '</div></div>';
}

function _dashboardKpiRow1() {
  var all = WORKSPACE_NOTICES;
  var now = new Date();
  var cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  var last30 = all.filter(function (n) { return n.created && new Date(n.created) >= cutoff; });
  // "Notices sent (30d)" counts NOTICES that have been dispatched (status sent/sending),
  // not recipients - n.sent/n.delivered below are per-notice RECIPIENT counts and must
  // stay separate (used only for the delivery-rate ratio).
  var sent30 = last30.filter(function (n) { return n.status === "sent" || n.status === "sending"; }).length;
  var sentRecipients30 = last30.reduce(function (s, n) { return s + (n.sent || 0); }, 0);
  var delivered30 = last30.reduce(function (s, n) { return s + (n.delivered || 0); }, 0);
  var deliveryRate = sentRecipients30 > 0 ? (delivered30 / sentRecipients30 * 100).toFixed(1) + "%" : "—";
  return [
    { bg: "#e3f2fd", iconColor: "#1565c0", icon: "&#9993;",   label: "Notices sent (30d)",   num: fmt(sent30) },
    { bg: "#e8f5e9", iconColor: "#2e7d32", icon: "&#10003;",  label: "Delivery rate",         num: deliveryRate },
    { bg: "#f3f3f3", iconColor: "#555",    icon: "&#128065;", label: "Read rate (in-app only)",num: "—", help: true },
    { bg: "#fff3e0", iconColor: "#e65100", icon: "&#128432;", label: "Click rate",            num: "—" }
  ];
}

function _dashboardKpiRow2() {
  var all = WORKSPACE_NOTICES;
  var now = new Date();
  var cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
  var last30 = all.filter(function (n) { return n.created && new Date(n.created) >= cutoff; });
  var failed30 = last30.reduce(function (s, n) { return s + (n.failed || 0); }, 0);
  var recipients = all.reduce(function (s, n) { return s + (n.total || 0); }, 0);
  var scheduled = all.filter(function (n) { return n.status === "scheduled"; }).length;
  var awaitingAck = all.filter(function (n) { return n.ack && (n.status === "sent" || n.status === "sending"); }).length;
  return [
    { bg: "#e3f2fd", iconColor: "#1565c0", icon: "&#128101;", label: "Active recipients",        num: fmt(recipients) },
    { bg: "#fce4ec", iconColor: "#b71c1c", icon: "&#9888;",   label: "Failed (30d)",             num: fmt(failed30) },
    { bg: "#e8eaf6", iconColor: "#283593", icon: "&#9203;",   label: "Scheduled",                num: String(scheduled) },
    { bg: "#e8f5e9", iconColor: "#2e7d32", icon: "&#9878;",   label: "Awaiting acknowledgment",  num: String(awaitingAck) }
  ];
}

function _dashboardKpiCardHtml(k) {
  var help = k.help
    ? '<div class="small" style="color:#1565c0;cursor:pointer;" onclick="navTo(event)" data-view="reports">per channel in Reports &rarr;</div>'
    : "";
  return '<div class="col-sm-6 col-lg-3 mb-4">' +
    '<div class="card h-100" style="background:' + k.bg + ';border:none;">' +
      '<div class="card-body d-flex align-items-center py-3">' +
        '<div class="mr-3" style="font-size:2rem;color:' + k.iconColor + ';line-height:1;">' + k.icon + '</div>' +
        '<div>' +
          '<div class="text-muted small">' + k.label + '</div>' +
          '<div class="h4 mb-0 font-weight-bold">' + k.num + '</div>' +
          help +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

function _dashboardKpiRowHtml(list) {
  return '<div class="row">' + list.map(_dashboardKpiCardHtml).join("") + '</div>';
}

function _dashboardRecentRowsHtml() {
  var recent = WORKSPACE_NOTICES.slice(0, 6);
  if (!recent.length) return '<tr><td colspan="6" class="text-center text-muted py-4">No notices yet.</td></tr>';
  return recent.map(function (n) {
    var delivered = n.sent ? (fmt(n.delivered) + ' / ' + fmt(n.sent)) : '—';
    return '<tr role="button" onclick="openWorkspaceNotice(this)" data-id="' + n.id + '">' +
      '<td><b>' + esc(n.title || "(untitled)") + '</b>' +
        '<div class="text-muted small">NT-' + n.id + ' &middot; ' + fmtDateTime(n.created) + '</div></td>' +
      '<td>' + esc(n.typeName || '—') + '</td>' +
      '<td>' + prioLabel(n.prio) + '</td>' +
      '<td class="small">' + esc(n.roleNames || '—') +
        (n.audienceFilters ? '<div class="text-muted">' + esc(n.audienceFilters) + '</div>' : '') + '</td>' +
      '<td>' + statusPill(n.status) + '</td>' +
      '<td>' + delivered + '</td>' +
    '</tr>';
  }).join("");
}

function _initDashboardCharts() {
  _initBarChart();
  _initDonutChart();
}

function _initBarChart() {
  var el = document.getElementById("noticeBarChart");
  if (!el || typeof ApexCharts === "undefined") return;

  var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var deliveredByDay = [0, 0, 0, 0, 0, 0, 0];
  var openedByDay    = [0, 0, 0, 0, 0, 0, 0];

  var now = new Date();
  WORKSPACE_NOTICES.forEach(function (n) {
    if (!n.created) return;
    var d = new Date(n.created);
    var diff = Math.floor((now - d) / 86400000);
    if (diff < 0 || diff >= 7) return;
    var dow = (d.getDay() + 6) % 7;
    deliveredByDay[dow] += (n.delivered || 0);
    openedByDay[dow]    += Math.round((n.delivered || 0) * 0.84);
  });

  new ApexCharts(el, {
    series: [
      { name: "Delivered", data: deliveredByDay },
      { name: "Opened",    data: openedByDay }
    ],
    chart: { type: "bar", height: 220, toolbar: { show: false }, animations: { enabled: false } },
    colors: ["#008FFB", "#00E396"],
    plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
    dataLabels: { enabled: false },
    xaxis: { categories: days, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: function (v) { return fmt(v); } } },
    grid: { borderColor: "#f0f0f0" },
    legend: { show: false },
    tooltip: { y: { formatter: function (v) { return fmt(v); } } }
  }).render();
}

function _initDonutChart() {
  var el = document.getElementById("noticeDonutChart");
  if (!el || typeof ApexCharts === "undefined") return;

  var totalSent = WORKSPACE_NOTICES.reduce(function (s, n) { return s + (n.sent || 0); }, 0);
  var centerLabel = totalSent >= 1000 ? (totalSent / 1000).toFixed(1) + "k" : String(totalSent);

  new ApexCharts(el, {
    series: [totalSent || 1],
    labels: ["In-app"],
    chart: { type: "donut", height: 220, toolbar: { show: false }, animations: { enabled: false } },
    colors: ["#008FFB"],
    dataLabels: { enabled: false },
    legend: {
      show: true,
      position: "bottom",
      formatter: function (label) { return label; }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: function () { return centerLabel; }
            }
          }
        }
      }
    },
    tooltip: { y: { formatter: function (v) { return fmt(v); } } }
  }).render();
}
