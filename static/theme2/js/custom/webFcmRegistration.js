/**
 * Registers the browser FCM token in MySQL DEVICE (DEVICE_TYPE = WEB).
 */
(function () {
  var FIREBASE_SCRIPTS = [
    "https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js",
    "https://www.gstatic.com/firebasejs/8.4.1/firebase-messaging.js"
  ];

  function noticeWebApiUrl(suffix) {
    if (typeof getURLForNotice === "function") {
      return getURLForNotice(suffix);
    }
    return BASE_URL + API_VERSION + "notice/" + suffix;
  }

  function getWebFcmDeviceId() {
    var key = "is_web_fcm_device_id";
    var id = localStorage.getItem(key);
    if (!id) {
      id = "web-" + (typeof USER_ID !== "undefined" ? USER_ID : "0") + "-" + Date.now();
      localStorage.setItem(key, id);
    }
    return id;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        resolve();
        return;
      }
      var s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function loadFirebase() {
    return FIREBASE_SCRIPTS.reduce(function (chain, src) {
      return chain.then(function () { return loadScript(src); });
    }, Promise.resolve());
  }

  function postNoticeApi(path, body) {
    return $.ajax({
      type: "POST",
      contentType: typeof APPLICATION_JSON_VALUE !== "undefined" ? APPLICATION_JSON_VALUE : "application/json",
      url: noticeWebApiUrl(path),
      data: JSON.stringify(body || {}),
      dataType: "json"
    });
  }

  function resolveServiceWorkerPath(config) {
    var path = (config && config.serviceWorkerPath) || "/firebase-messaging-sw.js";
    if (path.indexOf("http") === 0) {
      return path;
    }
    var ctx = typeof CONTEXT_PATH !== "undefined" ? CONTEXT_PATH : "";
    if (!ctx) {
      return path;
    }
    if (ctx.endsWith("/") && path.charAt(0) === "/") {
      return ctx.replace(/\/$/, "") + path;
    }
    if (!ctx.endsWith("/") && path.charAt(0) !== "/") {
      return ctx + "/" + path;
    }
    return ctx + path;
  }

  window.unregisterWebFcmToken = function () {
    return postNoticeApi("web-notification/fcm/unregister", { deviceId: getWebFcmDeviceId() });
  };

  window.registerWebFcmTokenIfEnabled = function () {
    if (window.WEB_NOTIFICATION_STATE && WEB_NOTIFICATION_STATE.globalEnabled === false) {
      return $.Deferred().resolve(null).promise();
    }
    if (window.WEB_NOTIFICATION_STATE && WEB_NOTIFICATION_STATE.effectiveEnabled === false) {
      return $.Deferred().resolve(null).promise();
    }
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      return $.Deferred().resolve(null).promise();
    }

    return postNoticeApi("web-notification/fcm/config", {})
      .then(function (config) { return loadFirebase().then(function () { return config; }); })
      .then(function (config) {
        if (typeof firebase === "undefined") {
          return null;
        }
        if (!firebase.apps.length) {
          firebase.initializeApp({
            apiKey: config.apiKey,
            authDomain: config.authDomain,
            projectId: config.projectId,
            storageBucket: config.storageBucket,
            messagingSenderId: config.messagingSenderId,
            appId: config.appId
          });
        }
        var swPath = resolveServiceWorkerPath(config);
        return navigator.serviceWorker.register(swPath).then(function (registration) {
          return Notification.requestPermission().then(function (perm) {
            if (perm !== "granted") {
              return null;
            }
            var messaging = firebase.messaging();
            messaging.useServiceWorker(registration);
            var tokenOpts = { serviceWorkerRegistration: registration };
            if (config.vapidKey) {
              tokenOpts.vapidKey = config.vapidKey;
            }
            return messaging.getToken(tokenOpts);
          });
        });
      })
      .then(function (token) {
        if (!token) {
          return null;
        }
        return postNoticeApi("web-notification/fcm/register", {
          token: token,
          deviceId: getWebFcmDeviceId()
        }).then(function () { return token; });
      })
      .fail(function (err) {
        console.warn("registerWebFcmTokenIfEnabled", err);
        return null;
      });
  };
})();
