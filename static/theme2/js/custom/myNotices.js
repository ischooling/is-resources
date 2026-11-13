var MY_NOTICES = [];

function renderMyNotices() {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("my-notices/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      MY_NOTICES = rows || [];
      $('#dashboardContentInHTML').html(myNoticesPageHtml());
      _drawMyNoticeRows(MY_NOTICES);
    },
    error: function () {
      toast("Could not load notices.", "err");
    }
  });
}

function _drawMyNoticeRows(list) {
  var tbody = document.getElementById("myNoticeRows");
  if (tbody) tbody.innerHTML = myNoticeRowsHtml(list);
}

function filterMyNotices(e) {
  var q = (e.currentTarget.value || "").toLowerCase();
  var filtered = MY_NOTICES.filter(function (n) {
    return !q || (n.heading || "").toLowerCase().includes(q) || String(n.id).includes(q) || (n.typeName || "").toLowerCase().includes(q);
  });
  _drawMyNoticeRows(filtered);
}

function openMyNotice(el) {
  var id = el && el.dataset ? el.dataset.id : el;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("my-notices/detail"),
    data: JSON.stringify({ noticeId: parseInt(id, 10) }),
    dataType: "json",
    success: function (n) {
      var cached = MY_NOTICES.find(function (x) { return String(x.id) === String(id); });
      var detail = Object.assign({}, cached || {}, n);
      openModal(
        esc(detail.heading || 'Notice'),
        myNoticeDetailHtml(detail),
        myNoticeDetailFooterHtml(detail),
        { wide: true }
      );
      var row = MY_NOTICES.find(function (x) { return String(x.id) === String(id); });
      if (row) { row.read = true; }
      _drawMyNoticeRows(MY_NOTICES);
    },
    error: function () { toast("Could not load notice.", "err"); }
  });
}

function toggleAckButtons(checkbox) {
  var enabled = checkbox.checked;
  var acceptBtn = document.getElementById("ackAcceptBtn");
  var declineBtn = document.getElementById("ackDeclineBtn");
  if (acceptBtn) acceptBtn.disabled = !enabled;
  if (declineBtn) declineBtn.disabled = !enabled;
}

function submitAck(el, action) {
  var noticeId = parseInt(el.dataset.noticeId, 10);
  var ackConfigId = parseInt(el.dataset.ackConfigId, 10);

  if (action !== 'skipped') {
    var checkbox = document.getElementById("ackCheckbox");
    if (checkbox && !checkbox.checked) {
      toast("Please read and check the declaration first.", "warn");
      return;
    }
  }

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("my-notices/ack"),
    data: JSON.stringify({ noticeId: noticeId, ackConfigId: ackConfigId, action: action }),
    dataType: "json",
    success: function () {
      closeModal();
      var label = action === 'accepted' ? 'Accepted' : action === 'declined' ? 'Declined' : 'Skipped';
      toast(label, action === 'accepted' ? 'success' : action === 'declined' ? 'err' : 'warn');
      var row = MY_NOTICES.find(function (x) { return String(x.id) === String(noticeId); });
      if (row) { row.ackAction = action; }
      _drawMyNoticeRows(MY_NOTICES);
    },
    error: function () { toast("Could not save acknowledgment.", "err"); }
  });
}

function submitCollectResponses(el) {
  var noticeId = parseInt(el.dataset.noticeId, 10);
  var controls = document.querySelectorAll('.noticeCollectResponse');
  var responses = [];

  for (var i = 0; i < controls.length; i++) {
    var control = controls[i];
    var value;
    if (control.type === 'file') {
      var file = control.files && control.files[0];
      value = file ? JSON.stringify({ name: file.name, type: file.type, size: file.size }) : (control.dataset.existingValue || '');
    } else {
      value = control.value || '';
    }
    if (control.dataset.mandatory === 'Y' && !value.trim()) {
      toast('Please complete ' + control.dataset.label + '.', 'warn');
      control.focus();
      return;
    }
    responses.push({ fieldId: parseInt(control.dataset.fieldId, 10), fieldValue: value });
  }

  el.disabled = true;
  $.ajax({
    type: 'POST',
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice('my-notices/collect-response'),
    data: JSON.stringify({ noticeId: noticeId, responses: responses }),
    dataType: 'json',
    success: function () {
      toast('Your response has been saved.', 'ok');
      el.disabled = false;
    },
    error: function (xhr) {
      el.disabled = false;
      toast((xhr.responseJSON && xhr.responseJSON.message) || 'Could not save your response.', 'err');
    }
  });
}
