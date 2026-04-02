var callHippoDialerConfigPromise = null;
var callHippoDialerScriptPromise = null;
var callHippoOriginalSdkCall = null;
var callHippoWindowEventsBound = false;


function showCallHippoLoader() {
  if ($("#callHippoLoader").length) return;

  if (!$("#callHippoLoaderStyle").length) {
    $("<style>", { id: "callHippoLoaderStyle" })
      .text("@keyframes chSpin{to{transform:rotate(360deg)}}")
      .appendTo("head");
  }

  $("<div>", { id: "callHippoLoader" }).css({
    position: "fixed",
    inset: "0",
    zIndex: "99999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(4px)",
    webkitBackdropFilter: "blur(4px)"
  }).html(
    '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;">'
      + '<div style="width:44px;height:44px;border:4px solid rgba(255,255,255,0.25);border-top-color:#fff;border-radius:50%;animation:chSpin 0.75s linear infinite;"></div>'
      + '<span style="color:#fff;font-size:14px;font-family:sans-serif;letter-spacing:0.3px;">Connecting\u2026</span>'
    + '</div>'
  ).appendTo("body");
}

function hideCallHippoLoader() {
  $("#callHippoLoader").remove();
}

function getCallHippoDialerModal() {
  return $("#callHippoDialerModal");
}

function getCallHippoDialerContainer() {
  return $("#ch-dialer-container");
}

function getCallHippoDialerPreferredHeight() {
  return 640;
}

function styleCallHippoModalBackdrop() {
  setTimeout(function () {
    var backdrop = $(".modal-backdrop").last();
    if (backdrop.length) {
      backdrop.css({
        background: "rgba(0,0,0,0.55)",
        opacity: "1",
        backdropFilter: "blur(8px)",
        webkitBackdropFilter: "blur(8px)"
      });
    }
  }, 10);
}

function ensureCallHippoDialerContainer(showDialer) {
  var $dialerModal = getCallHippoDialerModal();

  if (!$dialerModal.length) {
    $dialerModal = $("<div>", {
      id: "callHippoDialerModal",
      "class": "modal fade",
      tabindex: "-1",
      role: "dialog",
      "aria-hidden": "true",
      "data-backdrop": "static",
      "data-keyboard": "false"
    }).html(
      '<div class="modal-dialog modal-dialog-centered" role="document" style="width:calc(100vw - 16px);max-width:400px;margin:0.5rem auto;">'
        + '<div class="modal-content border-0" style="overflow:visible;border-radius:16px;background:transparent;box-shadow:none;">'
          + '<div style="position:relative;">'
            + '<button type="button" class="close" aria-label="Close" style="position:absolute;right:0px;top:-40px;z-index:9999;width:32px;height:32px;border-radius:50%;background:#333;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,0.2);opacity:1;border:2px solid #fff;cursor:pointer;">'
              + '<span aria-hidden="true" style="color:#fff;font-size:20px;line-height:1;">&times;</span>'
            + '</button>'
            + '<div class="modal-body" style="padding:0;background:transparent;">'
              + '<div id="ch-dialer-container" style="width:100%;height:600px;min-height:600px;max-height:600px;background:#fff;overflow:hidden;border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.35);"></div>'
            + '</div>'
          + '</div>'
        + '</div>'
      + '</div>'
    );

    $("body").append($dialerModal);

    $dialerModal.on("hidden.bs.modal", function () {
      destroyCallHippoDialerModal();
    });

    $dialerModal.on("shown.bs.modal", function () {
      styleCallHippoModalBackdrop();
      bindCallHippoDialerGlobals();
    });

    $dialerModal.find(".close").on("click", function () {
      hideCallHippoDialer();
    });
  }

  if (showDialer) {
    $dialerModal.modal("show");
    styleCallHippoModalBackdrop();
  }

  return {
    wrapper: $dialerModal[0],
    container: getCallHippoDialerContainer()[0]
  };
}

function hideCallHippoDialer() {
  var $dialerModal = getCallHippoDialerModal();
  var $dialerPopup = $("#chCallMePopup");

  if ($dialerPopup.length) $dialerPopup.hide();
  if ($dialerModal.length) $dialerModal.modal("hide");
}

function destroyCallHippoDialerModal() {
  var $dialerModal     = getCallHippoDialerModal();
  var $dialerContainer = getCallHippoDialerContainer();

  if ($dialerContainer.length) $dialerContainer.empty();

  if ($dialerModal.length) {
    $dialerModal.off("hidden.bs.modal shown.bs.modal");
    $dialerModal.remove();
  }

  resetCallHippoDialerState();
}

function applyCallHippoDialerLayout() {
  var $dialerContainer  = getCallHippoDialerContainer();
  var $openButton       = $dialerContainer.find(".ch-open-button");
  var $incomingPopup    = $("#chPopup");
  var $popupCloseIcon   = $dialerContainer.find(".ch-close_icon");
  var $dialerPopup      = $("#chCallMePopup");
  var $dialerPopupForm  = $("#chCallMePopupForm");
  var $dialerFrame      = $("#chFrame");
  var dialerPreferredHeight = getCallHippoDialerPreferredHeight();

  if ($dialerContainer.length) {
    $dialerContainer.css({
      width: "100%",
      height: dialerPreferredHeight + "px",
      minHeight: dialerPreferredHeight + "px",
      maxHeight: dialerPreferredHeight + "px",
      padding: "0",
      background: "#fff",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center"
    });

    $dialerContainer.children().css({
      width: "100%",
      height: "auto",
      minHeight: "0",
      maxWidth: "100%",
      maxHeight: "100%",
      margin: "0",
      padding: "0",
      overflow: "hidden",
      boxSizing: "border-box"
    });
  }

  if ($openButton.length) {
    $openButton.css({
      display: "none",
      visibility: "hidden",
      pointerEvents: "none",
      width: "0",
      height: "0",
      overflow: "hidden",
      position: "absolute"
    });
  }

  if ($incomingPopup.length) $incomingPopup.hide();

  if ($popupCloseIcon.length) {
    $popupCloseIcon.attr("onclick", "hideCallHippoDialer()");
    $popupCloseIcon.css("cursor", "pointer");
  }

  if ($dialerPopup.length) {
    $dialerPopup.parent().css({
      width: "100%",
      height: "auto",
      minHeight: "0",
      maxWidth: "100%",
      maxHeight: "100%",
      margin: "0",
      padding: "0",
      overflow: "hidden"
    });

    $dialerPopup.css({
      display: "block",
      position: "relative",
      top: "0", left: "0", right: "0", bottom: "0",
      width: "100%",
      height: "auto",
      minHeight: "0",
      maxWidth: "100%",
      maxHeight: "100%",
      borderRadius: "0",
      boxShadow: "none",
      margin: "0",
      padding: "0",
      background: "#fff",
      overflow: "hidden"
    });
  }

  if ($dialerPopupForm.length) {
    $dialerPopupForm.css({
      width: "100%",
      height: "auto",
      minHeight: "0",
      background: "#fff",
      padding: "0",
      margin: "0",
      overflow: "hidden"
    });
  }

  if ($dialerFrame.length) {
    $dialerFrame.css({
      width: "100%",
      height: dialerPreferredHeight + "px",
      minHeight: dialerPreferredHeight + "px",
      maxHeight: dialerPreferredHeight + "px",
      border: "0",
      background: "#fff",
      display: "block"
    });
  }
}


function isCallHippoAutoCloseEvent(event) {
  var eventData = event && event.data ? event.data : {};
  var eventType = eventData.type ? eventData.type.toString() : "";
  var dialerFrame = $("#chFrame")[0];
  var isFromDialerFrame     = !!(dialerFrame && dialerFrame.contentWindow && event.source === dialerFrame.contentWindow);
  var isFromCallHippoOrigin = !!(event.origin && event.origin.indexOf("callhippo.com") !== -1);

  if (!isFromDialerFrame && !isFromCallHippoOrigin) return false;

  return /CALL.*(END|ENDED|DISCONNECT|DISCONNECTED|HANGUP|HUNGUP|COMPLETE|COMPLETED|CLOSE|CLOSED)/i.test(eventType);
}

function bindCallHippoWindowEvents() {
  if (callHippoWindowEventsBound) return;

  window.addEventListener("message", function (event) {
    var eventData = event && event.data ? event.data : {};
    var eventType = eventData.type ? eventData.type.toString() : "";

    if (eventType === "INCOMING_CALL_NOTIFICATION" || eventType === "CLICKTOCALL_MESSAGE_ACKNOWLEDGED") {
      ensureCallHippoDialerContainer(true);
      bindCallHippoDialerGlobals();
      return;
    }

    if (isCallHippoAutoCloseEvent(event)) hideCallHippoDialer();
  });

  callHippoWindowEventsBound = true;
}

function bindCallHippoDialerGlobals() {
  var $dialerPopup = $("#chCallMePopup");
  var $dialerFrame = $("#chFrame");
  var dialerPopup  = $dialerPopup[0];
  var dialerFrame  = $dialerFrame[0];

  applyCallHippoDialerLayout();
  bindCallHippoWindowEvents();

  if (dialerPopup) {
    window.chCallMePopup = dialerPopup;
    try { chCallMePopup = dialerPopup; } catch (ignore) {}
  }

  if (dialerFrame) {
    window.chFrame = dialerFrame;
    try { chFrame = dialerFrame; } catch (ignore) {}
  }

  return !!(dialerPopup && dialerPopup.style && dialerFrame);
}

function resetCallHippoDialerState() {
  $("#callHippoDialerScript").remove();
  callHippoDialerScriptPromise     = null;
  callHippoOriginalSdkCall         = null;
  window.__callHippoSdkCallWrapped = false;
  window.chCall                    = undefined;
  window.chCallMePopup             = null;
  window.chFrame                   = null;
  try { chCallMePopup = null; } catch (ignore) {}
  try { chFrame = null; }      catch (ignore) {}
}

function wrapCallHippoSdkCall() {
  if (window.__callHippoSdkCallWrapped || typeof window.chCall !== "function") return;
  callHippoOriginalSdkCall = window.chCall;
  window.chCall = function (phoneNumber, customParams, isEncrypted) {
    ensureCallHippoDialerContainer(true);
    bindCallHippoDialerGlobals();

    if (!window.chCallMePopup || !window.chCallMePopup.style || !$("#chFrame").length) {
      throw new Error("CallHippo dialer is not ready yet.");
    }

    return callHippoOriginalSdkCall(phoneNumber, customParams, isEncrypted);
  };

  window.__callHippoSdkCallWrapped = true;
}

function waitForChCallFunction(maxRetries, intervalMs) {
  maxRetries = maxRetries || 60;  // 60 × 300 ms = 18 s ceiling
  intervalMs = intervalMs || 300;

  return new Promise(function (resolve, reject) {
    if (typeof window.chCall === "function") { resolve(); return; }

    var retries = 0;
    var timer = setInterval(function () {
      if (typeof window.chCall === "function") {
        clearInterval(timer);
        resolve();
        return;
      }
      retries++;
      if (retries >= maxRetries) {
        clearInterval(timer);
        reject(new Error("CallHippo SDK did not expose chCall in time."));
      }
    }, intervalMs);
  });
}

function waitForCallHippoDialerReady(maxRetries, intervalMs) {
  maxRetries = maxRetries || 60;  // 60 × 300 ms = 18 s ceiling
  intervalMs = intervalMs || 300;

  return new Promise(function (resolve, reject) {
    if (bindCallHippoDialerGlobals()) {
      wrapCallHippoSdkCall();
      resolve();
      return;
    }

    var retries = 0;
    var timer = setInterval(function () {
      if (bindCallHippoDialerGlobals()) {
        wrapCallHippoSdkCall();
        clearInterval(timer);
        resolve();
        return;
      }
      retries++;
      if (retries >= maxRetries) {
        clearInterval(timer);
        reject(new Error("CallHippo dialer DOM did not appear in time."));
      }
    }, intervalMs);
  });
}

function getCallHippoDialerConfig() {
  if (window.callHippoDialerConfig && window.callHippoDialerConfig.apiToken && window.callHippoDialerConfig.agentEmail) {
    return Promise.resolve(window.callHippoDialerConfig);
  }
  if (callHippoDialerConfigPromise) return callHippoDialerConfigPromise;
  callHippoDialerConfigPromise = new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      url: BASE_URL + CONTEXT_PATH + "callhippo/v1/get-dialer-config",
      dataType: "json",
      success: function (response) {
        if (response.status === "success") {
          window.callHippoDialerConfig = response;
          resolve(response);
          return;
        }
        if (response.status === "3") {
          redirectLoginPage();
          reject(new Error(response.message));
          return;
        }
        reject(new Error(response.message || "Unable to load CallHippo dialer configuration."));
      },
      error: function () {
        reject(new Error("Unable to load CallHippo dialer configuration."));
      }
    });
  }).catch(function (error) {
    callHippoDialerConfigPromise = null;
    throw error;
  });

  return callHippoDialerConfigPromise;
}

function loadCallHippoDialer(config) {
  window.TOKEN  = config.apiToken;
  window.EMAIL  = config.agentEmail;
  window.REGION = config.region || "global";

  ensureCallHippoDialerContainer(true);
  if (typeof window.chCall === "function" && bindCallHippoDialerGlobals()) {
    wrapCallHippoSdkCall();
    return Promise.resolve();
  }
  if (callHippoDialerScriptPromise) return callHippoDialerScriptPromise;

  callHippoDialerScriptPromise = new Promise(function (resolve, reject) {
    var $existingScript = $("#callHippoDialerScript");

    if ($existingScript.length) {
      waitForChCallFunction()
        .then(function () { return waitForCallHippoDialerReady(); })
        .then(resolve)
        .catch(reject);
      return;
    }
    var $script = $("<script>", {
      id:    "callHippoDialerScript",
      type:  "text/javascript",
      src:   "https://d1x9dsge91xf6g.cloudfront.net/callhippo/files/ch-dialer.js",
      async: true
    });

    $script.on("load", function () {
      waitForChCallFunction()
        .then(function () { return waitForCallHippoDialerReady(); })
        .then(resolve)
        .catch(reject);
    });

    $script.on("error", function () {
      reject(new Error("Unable to load CallHippo dialer script."));
    });
    $("body").append($script);

  }).catch(function (error) {
    callHippoDialerScriptPromise = null;
    throw error;
  });

  return callHippoDialerScriptPromise;
}

function getCallHippoDialNumber(fullNumber, isdCode, phoneNumber) {
  var dialNumber = (fullNumber || "").toString().replace(/[^0-9]/g, "");
  if (dialNumber !== "") return dialNumber;
  var sanitizedPhone = (phoneNumber || "").toString().replace(/[^0-9]/g, "");
  var sanitizedIsd   = (isdCode    || "").toString().replace(/[^0-9]/g, "");
  if (sanitizedPhone === "") return "";

  if (sanitizedIsd !== "" && sanitizedPhone.indexOf(sanitizedIsd) === 0) {
    return sanitizedPhone;
  }
  return sanitizedIsd + sanitizedPhone;
}

function callLeadViaCallHippo(allowService, bypassNumber, fullNumber, isdCode, phoneNumber) {
  var dialNumber = getCallHippoDialNumber(fullNumber, isdCode, phoneNumber);

  if (allowService != true && allowService != "true") {
    showMessageTheme2(0, "Calling service is off");
    return;
  }

  if (dialNumber === "") {
    showMessageTheme2(0, "Phone number is not available for calling.");
    return;
  }

  if (ENVIRONMENT === "uat" || ENVIRONMENT === "dev") {
    dialNumber = bypassNumber;
  }

  ensureCallHippoDialerContainer(true);
  showCallHippoLoader();

  getCallHippoDialerConfig()
    .then(function (config) {
      loadCallHippoDialer(config);
      setTimeout(() => {
        hideCallHippoLoader();
        bindCallHippoDialerGlobals();
      window.chCall(dialNumber);
      }, 3000);
    })
    .then(function () {
      hideCallHippoLoader();
      bindCallHippoDialerGlobals();
      window.chCall(dialNumber);
    })
    .catch(function (error) {
      hideCallHippoLoader();
      var message = (error && error.message) || "";
      if (!message.includes("window.chCall is not a function")) {
        showMessageTheme2(
          0,
          message || error || "Unable to start the call right now."
        );
      }
    });
}