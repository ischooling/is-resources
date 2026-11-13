/* =========================================================
   noticeOverrideConfiguration.js
   Override Configuration behaviour + rule CRUD.
   Console-callable: renderOverrideConfiguration()
   ========================================================= */

var _overrideRules = [];

function renderOverrideConfiguration() {
  function _fetchRules() {
    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForNotice("override/get"),
      data: JSON.stringify({}),
      dataType: "json",
      success: function (rows) {
        _overrideRules = rows || [];
        $('#dashboardContentInHTML').html(overrideConfigurationPageHtml(_overrideRules));
      },
      error: function () {
        toast("Could not load override rules.", "err");
        $('#dashboardContentInHTML').html(overrideConfigurationPageHtml([]));
      }
    });
  }

  if (ROLES.length) {
    _fetchRules();
  } else {
    loadNoticeRoles(function () { _fetchRules(); });
  }
}

function newOverrideRule() {
  openModal("New override rule", overrideRuleFormHtml(null),
    '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-success" onclick="saveOverrideRule(event)" data-i="-1">Add rule</button>');
}

function editOverrideRule(e) {
  const i = +e.currentTarget.dataset.i;
  openModal("Edit override rule", overrideRuleFormHtml(_overrideRules[i]),
    '<button class="btn btn-danger" onclick="deleteOverrideRule(event)" data-id="' + _overrideRules[i].id + '">Delete</button>' +
    '<button class="btn btn-light" onclick="closeModal()">Cancel</button>' +
    '<button class="btn btn-success" onclick="saveOverrideRule(event)" data-i="' + i + '">Save</button>');
}

function saveOverrideRule(e) {
  const i = +e.currentTarget.dataset.i;
  const existing = i >= 0 ? _overrideRules[i] : null;
  const roleId = document.getElementById("ovRole").value;
  const userId = document.getElementById("ovUserId") ? document.getElementById("ovUserId").value : null;
  const appliesTo = document.getElementById("ovApplies").value;
  const effect = document.getElementById("ovEffect").value;

  if (!roleId) { toast("Select a role", "err"); return; }

  const payload = {
    id: existing ? existing.id : undefined,
    roleId: parseInt(roleId, 10),
    userId: userId ? parseInt(userId, 10) : null,
    appliesTo: appliesTo,
    effect: effect
  };

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("override/save"),
    data: JSON.stringify(payload),
    dataType: "json",
    success: function () {
      closeModal();
      toast(existing ? "Rule updated" : "Rule added", "success");
      renderOverrideConfiguration();
    },
    error: function () { toast("Could not save rule.", "err"); }
  });
}

function deleteOverrideRule(e) {
  const id = e.currentTarget.dataset.id;
  if (!confirm("Delete this override rule?")) return;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForNotice("override/delete"),
    data: JSON.stringify({ id: parseInt(id, 10) }),
    dataType: "json",
    success: function () {
      closeModal();
      toast("Rule deleted", "warn");
      renderOverrideConfiguration();
    },
    error: function () { toast("Could not delete rule.", "err"); }
  });
}
