var _zohoConvPage = 0;
var _zohoConvSize = 50;
var _zohoConvTotal = 0;
var _zohoRefreshTimer = null;
var _zohoPageObserver = null;
var _zohoActiveCard = 'total';

function renderZohoConversationList(title, roleAndModule, schoolId, userId, userRole) {
    _zohoStopRefresh();
    _zohoConvPage = 0;
    _zohoConvTotal = 0;
    _zohoActiveCard = 'total';
    $('#dashboardContentInHTML').html(_zohoShellHtml());
    _zohoBindEvents();
    _zohoCheckConnection();
    _zohoLoadStats();
    _zohoLoadChats();
    _zohoStartRefresh();
}

function _zohoStartRefresh() {
    _zohoStopRefresh();
    _zohoRefreshTimer = setInterval(_zohoLoadStats, 60000);
    _zohoPageObserver = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
            if (!document.getElementById('zohoStatsStrip')) {
                _zohoStopRefresh();
                break;
            }
        }
    });
    var container = document.getElementById('dashboardContentInHTML');
    if (container) _zohoPageObserver.observe(container, { childList: true });
}

function _zohoStopRefresh() {
    if (_zohoRefreshTimer) { clearInterval(_zohoRefreshTimer); _zohoRefreshTimer = null; }
    if (_zohoPageObserver) { _zohoPageObserver.disconnect(); _zohoPageObserver = null; }
}

var _zohoConnStatus = null;
var _zohoAuthListenerBound = false;

function _zohoCheckConnection() {
    $.ajax({
        url: getURLForHTML('', 'api/v1/zoho/salesiq/chats/connection-status'),
        type: 'GET',
        success: function (res) {
            _zohoConnStatus = res || {};
            var labels = { CONNECTED: ['badge-success', 'Connected'], EXPIRED: ['badge-warning', 'Expired – re-authorize'], NOT_CONNECTED: ['badge-danger', 'Not Connected'] };
            var l = labels[_zohoConnStatus.state] || labels.NOT_CONNECTED;
            var tip = [];
            if (_zohoConnStatus.connectedAt) tip.push('Connected: ' + _zohoFormatEpoch(_zohoConnStatus.connectedAt));
            if (_zohoConnStatus.lastRefreshAt) tip.push('Last refresh: ' + _zohoFormatEpoch(_zohoConnStatus.lastRefreshAt));
            if (_zohoConnStatus.accessTokenExpiry) tip.push('Token valid until: ' + _zohoFormatEpoch(_zohoConnStatus.accessTokenExpiry));
            if (_zohoConnStatus.grantedScopes) tip.push('Scopes: ' + _zohoConnStatus.grantedScopes);
            if (_zohoConnStatus.lastError) tip.push('Last error: ' + _zohoConnStatus.lastError);
            $('#zohoConnStatus')
                .removeClass('badge-secondary badge-success badge-danger badge-warning')
                .addClass(l[0]).text(l[1]).attr('title', tip.join('\n'));
            $('#zohoAuthorizeBtn').show().html('<i class="fa fa-key"></i> ' + (_zohoConnStatus.state === 'NOT_CONNECTED' ? 'Zoho Authorize' : 'Re-authorize Zoho'));
        },
        error: function (xhr) {
            $('#zohoAuthorizeBtn').hide();
            if (xhr && xhr.status === 403) {
                $('#zohoConnStatus').hide();
                return;
            }
            $('#zohoConnStatus').removeClass('badge-secondary badge-success').addClass('badge-danger').text('Status unavailable');
        }
    });
}

function _zohoFormatEpoch(sec) {
    return _zohoFormatDateTime(new Date(Number(sec) * 1000).toISOString());
}

function _zohoOpenScopeModal() {
    var status = _zohoConnStatus || {};
    var available = status.availableScopes || ['SalesIQ.conversations.READ'];
    var required = status.requiredScope || 'SalesIQ.conversations.READ';
    var granted = (status.grantedScopes || '').split(',');
    var rows = '';
    for (var i = 0; i < available.length; i++) {
        var s = available[i];
        var isReq = s === required;
        var checked = isReq || granted.indexOf(s) >= 0;
        rows += '<div class="custom-control custom-checkbox mb-2">'
            + '<input type="checkbox" class="custom-control-input zoho-scope-cb" id="zohoScope' + i + '" value="' + _zohoEsc(s) + '"'
            + (checked ? ' checked' : '') + (isReq ? ' disabled' : '') + '>'
            + '<label class="custom-control-label" for="zohoScope' + i + '">' + _zohoEsc(s)
            + (isReq ? ' <small class="text-muted">(required for sync)</small>' : '') + '</label></div>';
    }
    $('#zohoScopeModal').remove();
    $('body').append(''
        + '<div class="modal fade" id="zohoScopeModal" tabindex="-1" role="dialog">'
        + '  <div class="modal-dialog" role="document"><div class="modal-content">'
        + '    <div class="modal-header"><h5 class="modal-title">Authorize Zoho SalesIQ</h5>'
        + '      <button type="button" class="close" data-dismiss="modal">&times;</button></div>'
        + '    <div class="modal-body">'
        + '      <p class="text-muted small">Choose the SalesIQ permissions to grant. Zoho will ask you to approve them, then the access and refresh tokens are saved automatically.</p>'
        + rows
        + '    </div>'
        + '    <div class="modal-footer">'
        + '      <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'
        + '      <button type="button" class="btn btn-primary" id="zohoScopeContinueBtn">Continue to Zoho</button>'
        + '    </div>'
        + '  </div></div>'
        + '</div>');
    $('#zohoScopeContinueBtn').on('click', function () {
        var scopes = [];
        $('.zoho-scope-cb:checked').each(function () { scopes.push($(this).val()); });
        $('#zohoScopeModal').modal('hide');
        _zohoOpenAuthorize(scopes);
    });
    $('#zohoScopeModal').modal('show');
}

function _zohoOpenAuthorize(scopes) {
    var url = BASE_URL + CONTEXT_PATH + 'api/v1/zoho/salesiq/authorize?scopes=' + encodeURIComponent(scopes.join(','));
    var popup = window.open(url, 'zohoSalesIQAuth', 'width=600,height=700');
    if (!popup) {
        showMessageTheme2(0, 'Your browser blocked the Zoho login popup. Allow popups for this site and click Zoho Authorize again.');
        return;
    }
    if (!_zohoAuthListenerBound) {
        _zohoAuthListenerBound = true;
        window.addEventListener('message', function (e) {
            if (e.origin !== window.location.origin || !e.data || !e.data.zohoSalesIQAuth) return;
            if (e.data.zohoSalesIQAuth === 'success') {
                showMessageTheme2(1, 'Zoho SalesIQ connected. Tokens saved and will refresh automatically.');
            }
            _zohoCheckConnection();
        });
    }
    var timer = setInterval(function () {
        if (popup.closed) {
            clearInterval(timer);
            _zohoCheckConnection();
        }
    }, 1000);
}

function _zohoShellHtml() {
    return ''
        + '<style>'
        + '.zoho-stat-strip{display:flex;gap:6px;margin-bottom:10px}'
        + '.zoho-stat-card{flex:1;display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:6px;'
        + ' background:#f8fafc;cursor:pointer;border:1.5px solid transparent;transition:border-color .15s,box-shadow .15s;min-width:0}'
        + '.zoho-stat-card:hover{box-shadow:0 1px 4px rgba(0,0,0,.06)}'
        + '.zoho-stat-active{border-color:var(--pc,#2563eb)!important;background:rgba(37,99,235,.04)!important}'
        + '.zoho-stat-icon{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0}'
        + '.zoho-stat-num{font-size:15px;font-weight:800;line-height:1}'
        + '.zoho-stat-lbl{font-size:8px;font-weight:600;text-transform:uppercase;letter-spacing:.3px;color:#64748b;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
        + '.zs-total .zoho-stat-icon{background:rgba(37,99,235,.1);color:#2563eb} .zs-total .zoho-stat-num{color:#2563eb}'
        + '.zs-attended .zoho-stat-icon{background:rgba(22,163,74,.1);color:#16a34a} .zs-attended .zoho-stat-num{color:#16a34a}'
        + '.zs-missed .zoho-stat-icon{background:rgba(220,38,38,.1);color:#dc2626} .zs-missed .zoho-stat-num{color:#dc2626}'
        + '.zs-waiting .zoho-stat-icon{background:rgba(217,119,6,.1);color:#d97706} .zs-waiting .zoho-stat-num{color:#d97706}'
        + '.zs-proactive .zoho-stat-icon{background:rgba(124,58,237,.1);color:#7c3aed} .zs-proactive .zoho-stat-num{color:#7c3aed}'
        + '.zs-linked .zoho-stat-icon{background:rgba(8,145,178,.1);color:#0891b2} .zs-linked .zoho-stat-num{color:#0891b2}'
        + '.zs-cron .zoho-stat-icon{background:rgba(71,85,105,.1);color:#475569} .zs-cron .zoho-stat-num{color:#475569}'
        + '.zs-webhook .zoho-stat-icon{background:rgba(234,88,12,.1);color:#ea580c} .zs-webhook .zoho-stat-num{color:#ea580c}'
        + '.zoho-live-dot{width:5px;height:5px;border-radius:50%;background:var(--pc,#2563eb);animation:zohoPulse 2s ease-in-out infinite;display:inline-block}'
        + '@keyframes zohoPulse{0%,100%{opacity:.3}50%{opacity:1}}'
        + '.zoho-conv-item.active,.zoho-conv-item.active *{color:#fff!important}'
        + '.zoho-conv-item.active .badge{background:rgba(255,255,255,.25)!important;color:#fff!important}'
        + '.zoho-conv-item.active .text-muted{color:rgba(255,255,255,.8)!important}'
        + '.zoho-conv-item.active div[style*="background:var(--pc"]{background:rgba(255,255,255,.25)!important}'
        + '</style>'
        + '<div class="main-card mb-3 card">'
        + '  <div class="card-header d-flex justify-content-between align-items-center">'
        + '    <span>Zoho SalesIQ Conversations</span>'
        + '    <div class="d-flex align-items-center">'
        + '      <span id="zohoConnStatus" class="badge badge-secondary mr-2">Checking...</span>'
        + '      <button type="button" class="btn btn-sm btn-primary" id="zohoAuthorizeBtn" style="display:none;">'
        + '        <i class="fa fa-key"></i> Zoho Authorize'
        + '      </button>'
        + '    </div>'
        + '  </div>'
        + '  <div class="card-body">'
        + '    <div class="zoho-stat-strip" id="zohoStatsStrip">'
        + _zohoStatCard('total', '&#x2211;', 'Total', true)
        + _zohoStatCard('attended', '&#x2714;', 'Attended', false)
        + _zohoStatCard('missed', '&#x2716;', 'Missed', false)
        + _zohoStatCard('waiting', '&#x23F3;', 'Waiting', false)
        + _zohoStatCard('proactive', '&#x25B6;', 'Proactive', false)
        + _zohoStatCard('linked', '&#x1F517;', 'Linked', false)
        + _zohoStatCard('cron', '&#x23F0;', 'Cron', false)
        + _zohoStatCard('webhook', '&#x26A1;', 'Webhook', false)
        + '    </div>'
        + '    <div class="d-flex align-items-center justify-content-end mb-2">'
        + '      <span class="zoho-live-dot mr-1"></span>'
        + '      <small class="text-muted" style="font-size:9px;">Live &middot; refreshes every 60s</small>'
        + '    </div>'
        + '    <form class="row align-items-end custom-field-scope" id="zohoFilterForm">'
        + '      <div class="col-xl-2 col-lg-2 col-md-4 col-sm-6 col-12 mb-2">'
        + '        <div class="custom-field mb-0">'
        + '          <select class="form-control" id="zohoDateRange">'
        + '            <option value="today">Today</option>'
        + '            <option value="yesterday">Yesterday</option>'
        + '            <option value="week">Week</option>'
        + '            <option value="month" selected>Month</option>'
        + '            <option value="custom">Custom</option>'
        + '            <option value="all">All</option>'
        + '          </select>'
        + '          <label class="text-primary m-0">Date Range</label>'
        + '        </div>'
        + '      </div>'
        + '      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-2" id="zohoFromDateCol" style="display:none;">'
        + '        <div class="custom-field mb-0">'
        + '          <input type="text" class="form-control" id="zohoFromDate" placeholder=" " readonly />'
        + '          <label class="text-primary m-0">From Date</label>'
        + '        </div>'
        + '      </div>'
        + '      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-2" id="zohoToDateCol" style="display:none;">'
        + '        <div class="custom-field mb-0">'
        + '          <input type="text" class="form-control" id="zohoToDate" placeholder=" " readonly />'
        + '          <label class="text-primary m-0">To Date</label>'
        + '        </div>'
        + '      </div>'
        + '      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        + '        <div class="custom-field mb-0">'
        + '          <input type="text" class="form-control" id="zohoEmail" placeholder=" " />'
        + '          <label class="text-primary m-0">Email</label>'
        + '        </div>'
        + '      </div>'
        + '      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        + '        <div class="custom-field mb-0">'
        + '          <input type="text" class="form-control" id="zohoPhone" placeholder=" " />'
        + '          <label class="text-primary m-0">Phone</label>'
        + '        </div>'
        + '      </div>'
        + '      <div class="col-xl-2 col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        + '        <div class="custom-field mb-0">'
        + '          <input type="text" class="form-control" id="zohoVisitorName" placeholder=" " />'
        + '          <label class="text-primary m-0">Visitor Name</label>'
        + '        </div>'
        + '      </div>'
        + '      <div class="col-xl-2 col-lg-1 col-md-2 col-sm-6 col-12 mb-2">'
        + '        <button type="button" class="btn btn-primary w-100" id="zohoSearchBtn">'
        + '          <i class="fa fa-search"></i> Search'
        + '        </button>'
        + '      </div>'
        + '    </form>'
        + '  </div>'
        + '</div>'
        + '<div class="row">'
        + '  <div class="col-xl-4 col-lg-5 col-md-12">'
        + '    <div class="main-card mb-3 card" style="height:calc(100vh - 260px);overflow:hidden;display:flex;flex-direction:column;">'
        + '      <div class="card-header p-2 d-flex justify-content-between align-items-center">'
        + '        <span id="zohoListCount" class="text-muted small">0 conversations</span>'
        + '        <div>'
        + '          <button class="btn btn-sm btn-outline-secondary" id="zohoPrevBtn" disabled>&laquo; Prev</button>'
        + '          <button class="btn btn-sm btn-outline-secondary" id="zohoNextBtn" disabled>Next &raquo;</button>'
        + '        </div>'
        + '      </div>'
        + '      <div id="zohoConvList" style="overflow-y:auto;flex:1;">'
        + '        <div class="text-center p-4 text-muted">Loading...</div>'
        + '      </div>'
        + '    </div>'
        + '  </div>'
        + '  <div class="col-xl-8 col-lg-7 col-md-12">'
        + '    <div class="main-card mb-3 card" id="zohoChatPanel" style="height:calc(100vh - 260px);overflow:hidden;display:flex;flex-direction:column;">'
        + '      <div class="card-header p-2" id="zohoChatHeader" style="display:none;">'
        + '        <div class="d-flex align-items-center">'
        + '          <div class="avatar-icon-wrapper mr-2"><div class="avatar-icon rounded-circle" style="width:40px;height:40px;background:var(--pc,#2563eb);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;" id="zohoChatAvatar">?</div></div>'
        + '          <div>'
        + '            <div class="font-weight-bold" id="zohoChatName"></div>'
        + '            <small class="text-muted" id="zohoChatMeta"></small>'
        + '          </div>'
        + '        </div>'
        + '      </div>'
        + '      <div id="zohoChatBody" style="overflow-y:auto;flex:1;padding:16px;">'
        + '        <div class="text-center text-muted p-5">Select a conversation to view the transcript</div>'
        + '      </div>'
        + '    </div>'
        + '  </div>'
        + '</div>';
}

function _zohoStatCard(key, icon, label, active) {
    return '<div class="zoho-stat-card zs-' + key + (active ? ' zoho-stat-active' : '') + '" id="zohoCard_' + key + '" onclick="_zohoOnCardClick(\'' + key + '\')">'
        + '  <div class="zoho-stat-icon">' + icon + '</div>'
        + '  <div><div class="zoho-stat-num" id="zohoStat_' + key + '">-</div><div class="zoho-stat-lbl">' + label + '</div></div>'
        + '</div>';
}

function _zohoBindEvents() {
    $('#zohoDateRange').on('change', function () {
        if ($(this).val() === 'custom') {
            $('#zohoFromDateCol, #zohoToDateCol').show();
        } else {
            $('#zohoFromDateCol, #zohoToDateCol').hide();
        }
    });

    $('#zohoFromDate, #zohoToDate').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true
    });

    $('#zohoAuthorizeBtn').on('click', _zohoOpenScopeModal);

    $('#zohoSearchBtn').on('click', function () {
        _zohoConvPage = 0;
        _zohoActiveCard = 'total';
        $('.zoho-stat-card').removeClass('zoho-stat-active');
        $('#zohoCard_total').addClass('zoho-stat-active');
        _zohoLoadStats();
        _zohoLoadChats();
    });

    $('#zohoPrevBtn').on('click', function () {
        if (_zohoConvPage > 0) {
            _zohoConvPage--;
            _zohoLoadChats();
        }
    });

    $('#zohoNextBtn').on('click', function () {
        if ((_zohoConvPage + 1) * _zohoConvSize < _zohoConvTotal) {
            _zohoConvPage++;
            _zohoLoadChats();
        }
    });
}

function _zohoGetBaseFilterParams() {
    return {
        dateRange: $('#zohoDateRange').val(),
        startDate: $('#zohoFromDate').val() || '',
        endDate: $('#zohoToDate').val() || '',
        email: $('#zohoEmail').val() || '',
        phone: $('#zohoPhone').val() || '',
        visitorName: $('#zohoVisitorName').val() || ''
    };
}

function _zohoGetFilterParams() {
    var p = _zohoGetBaseFilterParams();
    p.page = _zohoConvPage;
    p.size = _zohoConvSize;
    var cardFilters = _zohoGetCardFilter();
    if (cardFilters.status) p.status = cardFilters.status;
    if (cardFilters.statusGroup) p.statusGroup = cardFilters.statusGroup;
    if (cardFilters.source) p.source = cardFilters.source;
    if (cardFilters.linkedOnly) p.linkedOnly = 1;
    return p;
}

function _zohoGetCardFilter() {
    var f = { status: '', statusGroup: '', source: '', linkedOnly: false };
    switch (_zohoActiveCard) {
        case 'attended': f.statusGroup = 'attended'; break;
        case 'missed': f.status = 'missed'; break;
        case 'waiting': f.statusGroup = 'waiting'; break;
        case 'proactive': f.status = 'proactive'; break;
        case 'linked': f.linkedOnly = true; break;
        case 'cron': f.source = 'CRON'; break;
        case 'webhook': f.source = 'WEBHOOK'; break;
    }
    return f;
}

function _zohoLoadStats() {
    var params = _zohoGetBaseFilterParams();
    $.ajax({
        url: getURLForHTML('', 'api/v1/zoho/salesiq/chats/stats'),
        type: 'GET',
        data: params,
        global: false,
        success: function (s) {
            _zohoRenderStats(s);
        },
        error: function () {
            $('#zohoStatsStrip').hide();
        }
    });
}

function _zohoRenderStats(s) {
    var map = {
        total: s.total || 0,
        attended: s.attended || 0,
        missed: s.missed || 0,
        waiting: s.waiting || 0,
        proactive: s.proactive || 0,
        linked: s.linkedToLead || 0,
        cron: s.cronSource || 0,
        webhook: s.webhookSource || 0
    };
    for (var key in map) {
        var $el = $('#zohoStat_' + key);
        if ($el.length) $el.text(map[key].toLocaleString());
    }
}

function _zohoOnCardClick(card) {
    _zohoActiveCard = card;
    _zohoConvPage = 0;
    $('.zoho-stat-card').removeClass('zoho-stat-active');
    $('#zohoCard_' + card).addClass('zoho-stat-active');
    _zohoLoadChats();
}

function _zohoLoadChats() {
    var params = _zohoGetFilterParams();
    $('#zohoConvList').html('<div class="text-center p-4"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');

    $.ajax({
        url: getURLForHTML('', 'api/v1/zoho/salesiq/chats/count'),
        type: 'GET',
        data: params,
        success: function (count) {
            _zohoConvTotal = count || 0;
            $('#zohoListCount').text(_zohoConvTotal + ' conversation' + (_zohoConvTotal !== 1 ? 's' : ''));
            _zohoUpdatePagination();
        }
    });

    $.ajax({
        url: getURLForHTML('', 'api/v1/zoho/salesiq/chats/list'),
        type: 'GET',
        data: params,
        success: function (data) {
            _zohoRenderConversationList(data);
        },
        error: function () {
            $('#zohoConvList').html('<div class="text-center p-4 text-danger">Failed to load conversations</div>');
        }
    });
}

function _zohoUpdatePagination() {
    $('#zohoPrevBtn').prop('disabled', _zohoConvPage === 0);
    $('#zohoNextBtn').prop('disabled', (_zohoConvPage + 1) * _zohoConvSize >= _zohoConvTotal);
}

function _zohoRenderConversationList(data) {
    if (!data || data.length === 0) {
        $('#zohoConvList').html('<div class="text-center p-4 text-muted">No conversations found</div>');
        return;
    }

    var html = '<ul class="list-group list-group-flush">';
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var id = row[0];
        var name = row[2] || 'Unknown Visitor';
        var email = row[3] || '';
        var phone = row[4] || '';
        var channel = row[5] || '';
        var department = row[6] || '';
        var status = row[7] || '';
        var source = row[8] || '';
        var question = row[9] || '';
        var startTime = row[10] || '';
        var leadName = row[13] || '';

        var initials = _zohoGetInitials(name);
        var timeStr = _zohoFormatDateTime(startTime);
        var preview = question.length > 60 ? question.substring(0, 60) + '...' : question;
        var statusBadge = _zohoGetStatusBadge(status);
        var sourceBadge = source ? '<span class="badge badge-' + (source === 'WEBHOOK' ? 'info' : 'secondary') + ' ml-1" style="font-size:10px;">' + source + '</span>' : '';

        html += '<li class="list-group-item list-group-item-action p-2 zoho-conv-item" style="cursor:pointer;" '
            + 'data-id="' + id + '" data-name="' + _zohoEsc(name) + '" data-email="' + _zohoEsc(email)
            + '" data-phone="' + _zohoEsc(phone) + '" data-channel="' + _zohoEsc(channel)
            + '" data-department="' + _zohoEsc(department) + '" data-lead="' + _zohoEsc(leadName) + '">'
            + '<div class="d-flex align-items-start">'
            + '  <div class="mr-2" style="min-width:36px;">'
            + '    <div style="width:36px;height:36px;border-radius:50%;background:var(--pc,#2563eb);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px;">' + initials + '</div>'
            + '  </div>'
            + '  <div style="flex:1;min-width:0;">'
            + '    <div class="d-flex justify-content-between">'
            + '      <strong style="font-size:13px;" class="text-truncate">' + _zohoEsc(name) + '</strong>'
            + '      <small class="text-muted text-nowrap ml-2" style="font-size:11px;">' + timeStr + '</small>'
            + '    </div>'
            + '    <div class="text-muted text-truncate" style="font-size:12px;">' + _zohoEsc(preview) + '</div>'
            + '    <div class="mt-1">'
            + statusBadge + sourceBadge
            + (channel ? '<span class="badge badge-light ml-1" style="font-size:10px;">' + _zohoEsc(channel) + '</span>' : '')
            + (leadName.trim() ? '<span class="badge badge-success ml-1" style="font-size:10px;">Lead: ' + _zohoEsc(leadName.trim()) + '</span>' : '')
            + '    </div>'
            + '  </div>'
            + '</div>'
            + '</li>';
    }
    html += '</ul>';
    $('#zohoConvList').html(html);

    $('.zoho-conv-item').on('click', function () {
        $('.zoho-conv-item').removeClass('active');
        $(this).addClass('active');
        _zohoLoadTranscript($(this).data('id'), $(this));
    });
}

function _zohoLoadTranscript(id, $item) {
    var name = $item.data('name');
    var email = $item.data('email');
    var phone = $item.data('phone');
    var channel = $item.data('channel');
    var department = $item.data('department');
    var lead = $item.data('lead');

    $('#zohoChatHeader').show();
    $('#zohoChatAvatar').text(_zohoGetInitials(name));
    $('#zohoChatName').text(name);
    var metaParts = [];
    if (email) metaParts.push(email);
    if (phone) metaParts.push(phone);
    if (channel) metaParts.push(channel);
    if (department) metaParts.push(department);
    if (lead && lead.trim()) metaParts.push('Lead: ' + lead.trim());
    $('#zohoChatMeta').text(metaParts.join(' | '));

    $('#zohoChatBody').html('<div class="text-center p-4"><i class="fa fa-spinner fa-spin"></i></div>');

    $.ajax({
        url: getURLForHTML('', 'api/v1/zoho/salesiq/chats/transcript') + '?id=' + id,
        type: 'GET',
        success: function (chat) {
            _zohoRenderTranscript(chat, name);
        },
        error: function () {
            $('#zohoChatBody').html('<div class="text-center p-4 text-danger">Failed to load transcript</div>');
        }
    });
}

function _zohoRenderTranscript(chat, visitorName) {
    var transcript = chat.chatTranscript || '';
    if (!transcript) {
        $('#zohoChatBody').html('<div class="text-center p-4 text-muted">No transcript available</div>');
        return;
    }

    var lines = transcript.split('\n');
    var html = '<div class="chat-wrapper p-2">';

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;

        var colonIdx = line.indexOf(':');
        var sender = 'Unknown';
        var text = line;
        if (colonIdx > 0 && colonIdx < 30) {
            sender = line.substring(0, colonIdx).trim();
            text = line.substring(colonIdx + 1).trim();
        }

        var isVisitor = sender.toLowerCase() === 'visitor'
            || sender.toLowerCase() === visitorName.toLowerCase()
            || sender.toLowerCase().indexOf('visitor') >= 0;

        if (isVisitor) {
            html += '<div class="d-flex justify-content-end mb-2">'
                + '  <div style="max-width:70%;background:var(--pc,#2563eb);color:#fff;padding:8px 12px;border-radius:12px 12px 0 12px;font-size:13px;">'
                + _zohoEsc(text)
                + '    <div style="font-size:10px;opacity:0.7;margin-top:4px;">' + _zohoEsc(sender) + '</div>'
                + '  </div>'
                + '</div>';
        } else {
            html += '<div class="d-flex justify-content-start mb-2">'
                + '  <div style="max-width:70%;background:#f0f0f0;color:#333;padding:8px 12px;border-radius:12px 12px 12px 0;font-size:13px;">'
                + _zohoEsc(text)
                + '    <div style="font-size:10px;opacity:0.6;margin-top:4px;">' + _zohoEsc(sender) + '</div>'
                + '  </div>'
                + '</div>';
        }
    }

    html += '</div>';
    $('#zohoChatBody').html(html);
    $('#zohoChatBody').scrollTop($('#zohoChatBody')[0].scrollHeight);
}

function _zohoGetInitials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

function _zohoGetStatusBadge(status) {
    if (!status) return '';
    var color = 'secondary';
    var s = status.toLowerCase();
    if (s === 'completed' || s === 'ended') color = 'success';
    else if (s === 'missed') color = 'danger';
    else if (s === 'waiting' || s === 'open') color = 'warning';
    else if (s === 'connected' || s === 'active') color = 'primary';
    return '<span class="badge badge-' + color + '" style="font-size:10px;">' + _zohoEsc(status) + '</span>';
}

function _zohoFormatDateTime(dt) {
    if (!dt) return '';
    try {
        var d = new Date(dt);
        if (isNaN(d.getTime())) return dt;
        var now = new Date();
        var isToday = d.toDateString() === now.toDateString();
        var h = d.getHours();
        var m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        var time = h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
        if (isToday) return time;
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return d.getDate() + ' ' + months[d.getMonth()] + ' ' + time;
    } catch (e) {
        return dt;
    }
}

function _zohoEsc(text) {
    if (!text) return '';
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
