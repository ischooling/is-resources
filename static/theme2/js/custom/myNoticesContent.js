function myNoticesPageHtml() {
  return pageHead("pe-7s-bell", "My Notices", "Notices addressed to you &mdash; website channel") +
    '<div class="card mb-4"><div class="card-body">' +
      '<div class="d-flex align-items-center mb-3">' +
        '<div class="input-group col-12 col-md-5 px-0 mr-auto">' +
          '<input type="text" class="form-control" placeholder="Search notices…" oninput="filterMyNotices(event)">' +
        '</div>' +
      '</div>' +
      '<div class="table-responsive">' +
        '<table class="table table-hover">' +
          '<thead><tr>' +
            '<th>Notice</th><th>Type</th><th>Priority</th>' +
            '<th>Status</th><th>Received</th><th></th>' +
          '</tr></thead>' +
          '<tbody id="myNoticeRows"></tbody>' +
        '</table>' +
      '</div>' +
    '</div></div>';
}

function myNoticeRowsHtml(list) {
  if (!list || !list.length) {
    return '<tr><td colspan="6" class="text-center text-muted py-5">No notices yet.</td></tr>';
  }
  return list.map(function (n) {
    var unread = !n.read;
    var titleCell = unread
      ? '<b>' + esc(n.heading || '(no heading)') + '</b> <span class="badge badge-primary badge-pill" style="font-size:0.65rem;">New</span>'
      : esc(n.heading || '(no heading)');
    return '<tr style="' + (unread ? 'font-weight:600;' : '') + '">' +
      '<td>' + titleCell + '<div class="text-muted small font-weight-normal">NT-' + n.id + '</div></td>' +
      '<td class="font-weight-normal">' + esc(n.typeName || '—') + '</td>' +
      '<td>' + prioLabel(n.priority) + '</td>' +
      '<td>' + _myNoticeStatusPill(n) + '</td>' +
      '<td class="text-muted small font-weight-normal">' + (n.createdDate ? fmtDateTime(n.createdDate) : '—') + '</td>' +
      '<td><button class="btn btn-sm btn-outline-primary" onclick="openMyNotice(this)" data-id="' + n.id + '">View</button></td>' +
    '</tr>';
  }).join('');
}

function _myNoticeStatusPill(n) {
  if (!n.read) return '<span class="badge badge-info">Unread</span>';
  if ((n.deliveryStatus || '').toLowerCase() === 'delivered') return '<span class="badge badge-success">Read</span>';
  return '<span class="badge badge-secondary">Read</span>';
}

function myNoticeDetailHtml(n) {
  var ackBanner = '';
  if (n.ackRequired) {
    if (n.ackAction === 'accepted') {
      ackBanner = '<div class="alert alert-success py-2">&#10003; You accepted this notice.</div>';
    } else if (n.ackAction === 'declined') {
      ackBanner = '<div class="alert alert-danger py-2">&#10007; You declined this notice.</div>';
    } else if (n.ackAction === 'skipped') {
      ackBanner = '<div class="alert alert-warning py-2">&#9651; You skipped this notice ' + (n.skipCount || 1) + ' time(s).</div>';
    }
  }

  var declarationBlock = '';
  if (n.ackRequired && n.declarationText && !n.ackAction) {
    declarationBlock = '<div class="alert alert-light border mt-3 mb-0" id="noticeDeclaration">' +
      '<label class="d-flex align-items-start mb-0" style="cursor:pointer;">' +
        '<input type="checkbox" id="ackCheckbox" onchange="toggleAckButtons(this)" class="mt-1 mr-2"> ' +
        '<span>' + esc(n.declarationText) + '</span>' +
      '</label>' +
    '</div>';
  } else if (n.ackRequired && n.declarationText && n.ackAction) {
    declarationBlock = '<div class="alert alert-light border mt-3 mb-0">' +
      '<input type="checkbox" checked disabled class="mr-2">' +
      '<span class="text-muted">' + esc(n.declarationText) + '</span>' +
    '</div>';
  }

  var collectBlock = '';
  if (n.collectFields && n.collectFields.length) {
    collectBlock = '<div class="border rounded p-3 mt-3">' +
      '<h6 class="mb-1">' + esc(n.collectHeading || 'Information requested') + '</h6>' +
      '<p class="text-muted small mb-3">Complete the requested information and save your response.</p>' +
      n.collectFields.map(myNoticeCollectFieldHtml).join('') +
    '</div>';
  }

  return '<div class="mb-3">' +
    '<div class="d-flex align-items-center mb-2">' +
      prioLabel(n.priority) +
      '<span class="ml-2 text-muted small">' + esc(n.typeName || '') + '</span>' +
      (n.ackRequired ? '<span class="ml-auto badge badge-' + (n.enforcement === 'hard' ? 'danger' : 'info') + '">' +
        (n.enforcement === 'hard' ? 'Acknowledgment required' : 'Acknowledgment requested') + '</span>' : '') +
    '</div>' +
    '<h5 class="mb-3">' + esc(n.heading || '') + '</h5>' +
    '<div class="border-top pt-3">' + (n.body ? esc(n.body).replace(/\n/g, '<br>') : '<span class="text-muted">No content.</span>') + '</div>' +
    (n.attachmentUrl
      ? '<div class="mt-3"><a class="btn btn-outline-primary btn-sm" href="' + esc(n.attachmentUrl) + '" target="_blank" rel="noopener">&#128206; ' + esc(n.attachmentName || 'Download attachment') + '</a></div>'
      : '') +
    ackBanner +
    declarationBlock +
    collectBlock +
  '</div>';
}

function myNoticeCollectFieldHtml(field) {
  var id = 'noticeCollectField_' + field.id;
  var required = field.mandatory === 'Y';
  var attrs = 'id="' + id + '" class="form-control noticeCollectResponse" data-field-id="' + field.id +
    '" data-mandatory="' + (required ? 'Y' : 'N') + '" data-label="' + esc(field.label || 'this field') + '"';
  var label = '<label for="' + id + '">' + esc(field.label || 'Field') + (required ? ' <span class="text-danger">*</span>' : '') + '</label>';
  var value = field.fieldValue || '';
  var input;

  if (field.fieldType === 'date') {
    input = '<input type="date" ' + attrs + ' value="' + esc(value) + '" style="-webkit-appearance:auto;">';
  } else if (field.fieldType === 'dropdown') {
    var options = String(field.options || '').split(',').map(function (option) { return option.trim(); }).filter(Boolean);
    input = '<select ' + attrs + '><option value="">— select —</option>' + options.map(function (option) {
      return '<option value="' + esc(option) + '"' + (value === option ? ' selected' : '') + '>' + esc(option) + '</option>';
    }).join('') + '</select>';
  } else if (field.fieldType === 'file') {
    var existingFileName = value;
    try { existingFileName = JSON.parse(value).name || value; } catch (ignore) { }
    input = '<input type="file" ' + attrs + ' data-existing-value="' + esc(value) + '">' +
      (value ? '<small class="form-text text-muted">Previously saved: ' + esc(existingFileName) + '</small>' : '');
  } else {
    input = '<input type="text" ' + attrs + ' value="' + esc(value) + '">';
  }
  return '<div class="form-group">' + label + input + '</div>';
}

function myNoticeDetailFooterHtml(n) {
  var collectButton = n.collectFields && n.collectFields.length
    ? '<button class="btn btn-primary" data-notice-id="' + n.id + '" onclick="submitCollectResponses(this)">Save response</button>'
    : '';
  if (!n.ackRequired || n.ackAction === 'accepted' || n.ackAction === 'declined') return collectButton;

  var isSoft = (n.enforcement || '').toLowerCase() !== 'hard';
  var dataAttrs = 'data-notice-id="' + n.id + '" data-ack-config-id="' + (n.ackConfigId || 0) + '"';

  var acceptBtn = '<button class="btn btn-success" id="ackAcceptBtn" ' + dataAttrs + ' onclick="submitAck(this,\'accepted\')" disabled>&#10003; I Accept</button>';
  var declineBtn = '<button class="btn btn-outline-danger" ' + dataAttrs + ' onclick="submitAck(this,\'declined\')" disabled id="ackDeclineBtn">Decline</button>';
  var skipBtn = isSoft ? '<button class="btn btn-link text-muted" ' + dataAttrs + ' onclick="submitAck(this,\'skipped\')">Skip for now</button>' : '';

  return skipBtn + declineBtn + acceptBtn + collectButton;
}
