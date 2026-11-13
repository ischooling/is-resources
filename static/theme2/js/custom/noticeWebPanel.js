/* Dashboard right-rail web notices — all roles. */

window.WEB_NOTIFICATION_STATE = window.WEB_NOTIFICATION_STATE || {
  enabled: true,
  globalEnabled: true,
  effectiveEnabled: true,
  loaded: false
};

function noticeWebApiUrl(suffix) {
  if (typeof getURLForNotice === "function") {
    return getURLForNotice(suffix);
  }
  return BASE_URL + API_VERSION + "notice/" + suffix;
}

function initWebNoticeDashboard() {
  $.ajax({
    type: "POST",
    contentType: typeof APPLICATION_JSON_VALUE !== "undefined" ? APPLICATION_JSON_VALUE : "application/json",
    url: noticeWebApiUrl("web-notification/preference/get"),
    data: JSON.stringify({}),
    dataType: "json",
    complete: function () {
      refreshWebNoticeBadge();
      if (typeof checkNoticeInbox === "function") {
        checkNoticeInbox();
      }
    },
    success: function (pref) {
      applyWebNoticePreference(pref);
      if (WEB_NOTIFICATION_STATE.effectiveEnabled && typeof registerWebFcmTokenIfEnabled === "function") {
        registerWebFcmTokenIfEnabled();
      }
    }
  });
}

function refreshWebNoticeBadge() {
  $.ajax({
    type: "POST",
    contentType: typeof APPLICATION_JSON_VALUE !== "undefined" ? APPLICATION_JSON_VALUE : "application/json",
    url: noticeWebApiUrl("web-notification/pending-count"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (resp) {
      if (resp && resp.effectiveEnabled === false) {
        WEB_NOTIFICATION_STATE.effectiveEnabled = false;
      } else if (resp) {
        WEB_NOTIFICATION_STATE.effectiveEnabled = resp.effectiveEnabled !== false;
      }
      var badge = document.getElementById("webNoticeBadge");
      if (badge) {
        badge.textContent = resp && resp.count ? String(resp.count) : "";
        if (typeof updateNotificationBadge === "function") {
          updateNotificationBadge(badge);
        }
      }
    }
  });
}

function loadWebNoticePanel() {
  var host = document.getElementById("webNoticePanelRoot");
  if (!host || host.dataset.loaded === "true") {
    refreshWebNoticeList();
    return;
  }
  host.innerHTML = typeof webNoticePanelShellHtml === "function" ? webNoticePanelShellHtml() : "";
  host.dataset.loaded = "true";
  $.ajax({
    type: "POST",
    contentType: typeof APPLICATION_JSON_VALUE !== "undefined" ? APPLICATION_JSON_VALUE : "application/json",
    url: noticeWebApiUrl("web-notification/preference/get"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (pref) {
      applyWebNoticePreference(pref);
      refreshWebNoticeList();
    },
    error: function () {
      refreshWebNoticeList();
    }
  });
}

function applyWebNoticePreference(pref) {
  if (!pref) return;
  WEB_NOTIFICATION_STATE.enabled = pref.enabled !== "N";
  WEB_NOTIFICATION_STATE.globalEnabled = pref.globalEnabled !== false && pref.globalEnabled !== "N";
  WEB_NOTIFICATION_STATE.effectiveEnabled = WEB_NOTIFICATION_STATE.globalEnabled && WEB_NOTIFICATION_STATE.enabled;
  if (pref.effectiveEnabled === false || pref.effectiveEnabled === "N") {
    WEB_NOTIFICATION_STATE.effectiveEnabled = false;
  }
  var toggle = document.getElementById("webNoticeEnabledToggle");
  if (toggle) {
    toggle.checked = WEB_NOTIFICATION_STATE.enabled && WEB_NOTIFICATION_STATE.globalEnabled;
    toggle.disabled = !WEB_NOTIFICATION_STATE.globalEnabled;
  }
  var banner = document.getElementById("webNoticeDisabledBanner");
  var hint = document.getElementById("webNoticePrefHint");
  if (!WEB_NOTIFICATION_STATE.globalEnabled) {
    if (hint) hint.textContent = "Web notices are turned off for your school.";
    if (banner) banner.style.display = "block";
  } else if (!WEB_NOTIFICATION_STATE.enabled) {
    if (banner) banner.style.display = "block";
  } else if (banner) {
    banner.style.display = "none";
  }
}

function onWebNoticeToggleChange(el) {
  var enabled = el.checked ? "Y" : "N";
  $.ajax({
    type: "POST",
    contentType: typeof APPLICATION_JSON_VALUE !== "undefined" ? APPLICATION_JSON_VALUE : "application/json",
    url: noticeWebApiUrl("web-notification/preference/save"),
    data: JSON.stringify({ enabled: enabled }),
    dataType: "json",
    success: function (pref) {
      applyWebNoticePreference(pref);
      refreshWebNoticeList();
      refreshWebNoticeBadge();
      if (typeof toast === "function") {
        toast(WEB_NOTIFICATION_STATE.effectiveEnabled ? "Web notifications enabled" : "Web notifications disabled", "ok");
      }
      if (WEB_NOTIFICATION_STATE.effectiveEnabled && typeof registerWebFcmTokenIfEnabled === "function") {
        registerWebFcmTokenIfEnabled();
      } else if (!WEB_NOTIFICATION_STATE.effectiveEnabled && typeof unregisterWebFcmToken === "function") {
        unregisterWebFcmToken();
      }
    },
    error: function () {
      if (typeof toast === "function") toast("Could not save preference.", "err");
      el.checked = !el.checked;
    }
  });
}

function refreshWebNoticeList() {
  var listHost = document.getElementById("webNoticeListHost");
  if (!listHost) return;
  if (!WEB_NOTIFICATION_STATE.effectiveEnabled) {
    listHost.innerHTML = webNoticeListHtml([], false);
    var wrapOff = document.getElementById("webNoticeViewAllWrap");
    if (wrapOff) wrapOff.style.display = "none";
    return;
  }
  $.ajax({
    type: "POST",
    contentType: typeof APPLICATION_JSON_VALUE !== "undefined" ? APPLICATION_JSON_VALUE : "application/json",
    url: noticeWebApiUrl("my-notices/pending"),
    data: JSON.stringify({}),
    dataType: "json",
    success: function (rows) {
      listHost.innerHTML = webNoticeListHtml(rows || [], true);
      var wrap = document.getElementById("webNoticeViewAllWrap");
      if (wrap) wrap.style.display = rows && rows.length ? "block" : "none";
      var badge = document.getElementById("webNoticeBadge");
      if (badge) {
        badge.textContent = rows && rows.length ? String(rows.length) : "";
        if (typeof updateNotificationBadge === "function") updateNotificationBadge(badge);
      }
    },
    error: function () {
      listHost.innerHTML = '<div class="text-danger small py-3 text-center">Could not load notices.</div>';
    }
  });
}

function openMyNoticesFromWebPanel() {
  if (typeof openRightSideBar === "function") {
    openRightSideBar("notice_side_wrapper");
  }
  if (typeof _goToMyNotices === "function") {
    _goToMyNotices();
  } else if (typeof callDashboardPageSchool === "function") {
    var moduleId = typeof MODULE_ID !== "undefined" ? MODULE_ID : "";
    callDashboardPageSchool(moduleId, "my-notices");
  }
}

function openMyNoticeFromWebPanel(btn) {
  var id = btn && btn.dataset ? btn.dataset.noticeId : null;
  if (!id) return;
  if (typeof openMyNotice === "function") {
    openMyNotice({ dataset: { id: id } });
    return;
  }
  if (typeof loadScript === "function") {
    loadScript([{
      role: "",
      fileName: ["noticeConstants.js", "noticeUtils.js", "noticeModal.js", "noticeCommon.js", "myNoticesContent.js", "myNotices.js"]
    }]).then(function () {
      if (typeof openMyNotice === "function") {
        openMyNotice({ dataset: { id: id } });
      } else {
        openMyNoticesFromWebPanel();
      }
    });
    return;
  }
  openMyNoticesFromWebPanel();
}

window.initWebNoticeDashboard = initWebNoticeDashboard;
window.loadWebNoticePanel = loadWebNoticePanel;
window.refreshWebNoticeBadge = refreshWebNoticeBadge;
