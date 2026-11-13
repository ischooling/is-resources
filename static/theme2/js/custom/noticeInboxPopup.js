function checkNoticeInbox() {
  if (window.WEB_NOTIFICATION_STATE && WEB_NOTIFICATION_STATE.effectiveEnabled === false) {
    return;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("my-notices/pending"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (notices) {
      if (notices && notices.length) {
        _showNoticeInboxModal(notices);
      }
    },
    error: function () {}
  });
}

function _goToMyNotices() {
  var currentModuleId = typeof MODULE_ID !== "undefined" ? MODULE_ID : (typeof moduleId !== "undefined" ? moduleId : "");
  if (typeof callDashboardPageSchool === "function") {
    callDashboardPageSchool(currentModuleId, "my-notices");
  }
}

function _showNoticeInboxModal(notices) {
  var count = notices.length;
  var rows = notices.slice(0, 5).map(function (n) {
    return '<div class="d-flex align-items-start border-bottom py-2">' +
      '<div class="mr-2 mt-1">' + prioLabel(n.priority) + '</div>' +
      '<div class="flex-grow-1">' +
        '<div class="font-weight-bold">' + esc(n.heading || '(no heading)') +
        (n.ackRequired ? ' <span class="badge badge-warning badge-pill" style="font-size:0.6rem;">Ack</span>' : '') + '</div>' +
        '<div class="text-muted small">' + esc(n.typeName || '') +
          (n.createdDate ? ' &middot; ' + fmtDateTime(n.createdDate) : '') + '</div>' +
      '</div>' +
      '<button class="btn btn-sm btn-outline-primary ml-2 flex-shrink-0" ' +
        'onclick="openMyNotice(this)" data-id="' + n.id + '">View</button>' +
    '</div>';
  }).join('');

  var body = '<div class="alert alert-info py-2 mb-3">' +
    '&#128235; You have <b>' + count + '</b> unread notice' + (count > 1 ? 's' : '') +
    '</div>' + rows +
    (count > 5 ? '<div class="text-muted small mt-2">+ ' + (count - 5) + ' more — open My Notices to see all</div>' : '');

  var footer = '<button class="btn btn-light" onclick="closeModal()">Dismiss</button>' +
    '<button class="btn btn-primary" onclick="closeModal();_goToMyNotices()">View all notices</button>';

  openModal('&#128235; You have new notices', body, footer);
}
