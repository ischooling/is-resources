/* HTML for the dashboard right-rail web notifications panel (all roles). */

function webNoticePanelShellHtml() {
  return (
    '<div class="web-notice-panel p-3">' +
      '<div class="web-notice-panel__header d-flex align-items-center mb-3">' +
        '<div class="web-notice-panel__icon mr-3" aria-hidden="true">&#128276;</div>' +
        '<div class="flex-grow-1">' +
          '<h5 class="mb-0 font-weight-bold">Web notifications</h5>' +
          '<p class="text-muted small mb-0">Alerts and updates on this dashboard</p>' +
        '</div>' +
      '</div>' +
      '<div class="web-notice-panel__pref card border-0 shadow-sm mb-3">' +
        '<div class="card-body py-3">' +
          '<div class="d-flex justify-content-between align-items-center">' +
            '<div class="pr-3">' +
              '<div class="font-weight-bold">Web notifications</div>' +
              '<div class="text-muted small" id="webNoticePrefHint">Show alerts and unread counts on this dashboard</div>' +
            '</div>' +
            '<div class="web-notice-panel__switch-wrap flex-shrink-0">' +
              '<div class="custom-control custom-switch custom-switch-lg web-notice-panel__switch mb-0">' +
                '<input type="checkbox" class="custom-control-input" id="webNoticeEnabledToggle" checked ' +
                  'onchange="onWebNoticeToggleChange(this)" aria-labelledby="webNoticeEnabledToggleLabel" />' +
                '<label class="custom-control-label" id="webNoticeEnabledToggleLabel" for="webNoticeEnabledToggle">' +
                  '<span class="sr-only">Enable web notifications</span></label>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="alert alert-light border small mb-0 mt-3 py-2" id="webNoticeDisabledBanner" style="display:none;">' +
            '&#128683; Web notifications are off. You can still open this panel anytime; turn the switch on to see pop-ups and badge counts again.' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="webNoticeListHost">' +
        '<div class="text-muted small py-4 text-center">Loading…</div>' +
      '</div>' +
      '<div class="text-center mt-3" id="webNoticeViewAllWrap" style="display:none;">' +
        '<button type="button" class="btn btn-outline-primary btn-sm" onclick="openMyNoticesFromWebPanel()">View all</button>' +
      '</div>' +
    '</div>'
  );
}

function webNoticeListHtml(notices, enabled) {
  if (!enabled) {
    return '<div class="text-muted small text-center py-3">Enable web notifications above to see unread items here.</div>';
  }
  if (!notices || !notices.length) {
    return '<div class="text-center py-4">' +
      '<div class="text-muted mb-1">&#10003; You&apos;re all caught up</div>' +
      '<div class="text-muted small">No unread notifications right now.</div>' +
    '</div>';
  }
  return notices.slice(0, 8).map(function (n) {
    var title = (n.heading || "(no heading)").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
    var meta = (n.typeName || "") + (n.createdDate ? " · " + n.createdDate.replace("T", " ").substring(0, 16) : "");
    return (
      '<div class="web-notice-panel__item d-flex align-items-start border-bottom py-2">' +
        '<div class="flex-grow-1 pr-2">' +
          '<div class="font-weight-bold small">' + title + '</div>' +
          '<div class="text-muted" style="font-size:0.75rem;">' + meta + '</div>' +
        '</div>' +
        '<button type="button" class="btn btn-sm btn-outline-primary flex-shrink-0" data-notice-id="' + n.id + '" ' +
          'onclick="openMyNoticeFromWebPanel(this)">View</button>' +
      '</div>'
    );
  }).join("");
}
