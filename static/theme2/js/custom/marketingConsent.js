/*
 * Marketing (Meta / Facebook) cookie consent for the server-rendered pages: the opt-in card, shown until the visitor
 * chooses, and a "Manage cookies" view. Same card as on the website and the enrollment app.
 *
 * One cookie shared by every *.internationalschooling.org app:  is_marketing_consent = "granted" | "denied"
 * (absent = not chosen yet). The choice is announced with a "is:marketing-consent" event (detail = the value); the Meta
 * side (cookiesLib.js) listens for it. window.openCookieSettings() reopens the card in the Manage view.
 *
 * Skipped inside iframes and in headless browsers (PDF / receipt rendering), where a banner would only be in the way.
 */
(function () {
  if (window.__iscConsentLoaded) return;
  window.__iscConsentLoaded = true;
  if (window.top !== window.self || /HeadlessChrome/i.test(navigator.userAgent)) return;

  var CONSENT_COOKIE = "is_marketing_consent";
  var META_COOKIES = ["_fbp", "_fbc", "_fbi"];
  var PROBE_COOKIE = "__isc_cd_probe";

  // Registrable domain so the choice is shared with the website and the enrollment app; none on localhost / IPs.
  // "Last two labels" is only a guess: on a customer domain whose public suffix is itself two labels
  // (foo.co.in, foo.co.uk, foo.com.au, ...) that guess IS the public suffix, and every browser silently
  // refuses to store a cookie scoped to it — the consent is then never actually saved, so the banner
  // reopens on every page. Probe instead: try the broadest candidate first and keep the first the
  // browser actually accepts, falling back to the host itself (always accepted). Resolved once per page.
  var resolvedDomain;
  function candidateDomains(host) {
    if (!host || host.indexOf(".") === -1 || /^[0-9.]+$/.test(host)) return [];
    var labels = host.split(".");
    var candidates = [];
    for (var take = 2; take <= labels.length; take++) candidates.push(labels.slice(-take).join("."));
    return candidates;
  }
  function domainAccepted(domain) {
    document.cookie = PROBE_COOKIE + "=1; path=/; max-age=60" + (domain ? "; domain=" + domain : "");
    var stored = document.cookie.indexOf(PROBE_COOKIE + "=1") !== -1;
    document.cookie = PROBE_COOKIE + "=; path=/; max-age=0" + (domain ? "; domain=" + domain : "");
    return stored;
  }
  function cookieDomain() {
    if (resolvedDomain !== undefined) return resolvedDomain;
    var candidates = candidateDomains(window.location.hostname);
    resolvedDomain = "";
    for (var i = 0; i < candidates.length; i++) {
      if (domainAccepted(candidates[i])) { resolvedDomain = candidates[i]; break; }
    }
    return resolvedDomain;
  }

  function readConsent() {
    var m = document.cookie.match("(?:^|; )" + CONSENT_COOKIE + "=([^;]*)");
    return m && (m[1] === "granted" || m[1] === "denied") ? m[1] : null;
  }

  function expire(name, domain) {
    document.cookie = name + "=; path=/; max-age=0" + (domain ? "; domain=" + domain : "");
  }

  function writeConsent(value) {
    var domain = cookieDomain();
    document.cookie =
      CONSENT_COOKIE + "=" + value + "; path=/; max-age=" + 365 * 24 * 60 * 60 + "; samesite=lax" +
      (domain ? "; domain=" + domain : "") + (window.location.protocol === "https:" ? "; secure" : "");
    if (value !== "granted") {
      META_COOKIES.forEach(function (name) {
        expire(name, "");
        if (domain) expire(name, domain);
      });
    }
    if (typeof window.fbq === "function") window.fbq("consent", value === "granted" ? "grant" : "revoke");
    var evt;
    try {
      evt = new CustomEvent("is:marketing-consent", { detail: value });
    } catch (e) {
      evt = document.createEvent("CustomEvent");
      evt.initCustomEvent("is:marketing-consent", false, false, value);
    }
    window.dispatchEvent(evt);
  }

function injectConsentStyles() {
  if (document.getElementById("is-consent-style")) return;
  var st = document.createElement("style");
  st.id = "is-consent-style";
  st.textContent =
    ".isc-wrap{position:fixed;left:0;right:0;bottom:160px;z-index:2147483000;display:flex;justify-content:center;padding:0 12px;pointer-events:none;font:14px/1.5 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1f2937}" +
    "@media (min-width:1280px){.isc-wrap{bottom:16px}}" +
    ".isc-card{pointer-events:auto;box-sizing:border-box;width:100%;max-width:768px;background:rgba(255,255,255,.96);border:1px solid #dbeafe;border-radius:16px;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);padding:16px 20px;animation:isc-in .35s ease-out both}" +
    "@media (min-width:1280px){.isc-card{width:min(768px,calc(100vw - 736px))}}" +
    "@keyframes isc-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}" +
    "@media (prefers-reduced-motion:reduce){.isc-card{animation:none}}" +
    ".isc-row{display:flex;gap:20px;align-items:center}" +
    ".isc-icon{width:48px;height:48px;flex-shrink:0;border-radius:50%;background:#eff6ff;color:#1d4ed8;display:flex;align-items:center;justify-content:center}" +
    ".isc-main{flex:1;min-width:0}" +
    ".isc-title{margin:0;font-size:16px;font-weight:700;color:#111827}" +
    ".isc-text{margin:4px 0 0;color:#4b5563}" +
    ".isc-text a{color:#1d4ed8;text-decoration:underline;font-weight:500}" +
    ".isc-actions{display:flex;flex-direction:column;gap:8px;width:160px;flex-shrink:0}" +
    ".isc-btn{border:1px solid #d1d5db;background:#fff;color:#374151;border-radius:999px;padding:10px 20px;font:600 14px/1.2 inherit;font-family:inherit;cursor:pointer;white-space:nowrap}" +
    ".isc-btn:hover{background:#f9fafb}" +
    ".isc-btn.isc-primary{border:0;background:linear-gradient(90deg,#2563eb,#1e40af);color:#fff;box-shadow:0 4px 6px rgba(0,0,0,.15)}" +
    ".isc-btn.isc-primary:hover{filter:brightness(1.1);background:linear-gradient(90deg,#2563eb,#1e40af)}" +
    ".isc-btn:focus-visible,.isc-sw:focus-visible,.isc-link:focus-visible{outline:2px solid #2563eb;outline-offset:2px}" +
    ".isc-list{list-style:none;margin:12px 0 0;padding:0;border:1px solid #f3f4f6;border-radius:12px}" +
    ".isc-list li{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:12px;border-top:1px solid #f3f4f6}" +
    ".isc-list li:first-child{border-top:0}" +
    ".isc-li-title{font-size:14px;font-weight:600;color:#111827;margin:0}" +
    ".isc-li-text{font-size:12px;color:#4b5563;margin:0}" +
    ".isc-sw{position:relative;width:44px;height:24px;flex-shrink:0;border:0;border-radius:999px;background:#d1d5db;cursor:pointer;padding:0;transition:background .2s}" +
    ".isc-sw::after{content:'';position:absolute;top:2px;left:2px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.3);transition:transform .2s}" +
    ".isc-sw[aria-checked=true]{background:#1d4ed8}" +
    ".isc-sw[aria-checked=true]::after{transform:translateX(20px)}" +
    ".isc-sw[disabled]{opacity:.6;cursor:not-allowed}" +
    ".isc-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:16px}" +
    ".isc-foot .isc-btns{display:flex;gap:8px}" +
    ".isc-link{background:none;border:0;padding:0;color:#4b5563;text-decoration:underline;font:500 14px/1.2 inherit;font-family:inherit;cursor:pointer}" +
    "@media (max-width:639px){.isc-row{flex-direction:column;align-items:stretch;gap:12px}.isc-icon{display:none}.isc-actions{width:auto;flex-direction:row}.isc-actions .isc-btn{flex:1}.isc-foot{flex-direction:column-reverse;align-items:stretch}.isc-foot .isc-btns .isc-btn{flex:1}.isc-link{align-self:flex-start}}";
  document.head.appendChild(st);
}

function showMarketingConsentBanner(startInManage) {
  injectConsentStyles();
  var root = document.getElementById("is-marketing-consent");
  if (!root) {
    root = document.createElement("div");
    root.id = "is-marketing-consent";
    root.className = "isc-wrap";
    // child of <html>, not <body>: pages such as the login page rebuild the whole body after load
    document.documentElement.appendChild(root);
  }
  var fromSummary = !startInManage;
  var marketing = startInManage ? readConsent() === "granted" : false;

  function close() {
    if (root.parentNode) root.parentNode.removeChild(root);
  }
  function choose(value) {
    writeConsent(value);
    close();
  }
  function on(selector, handler) {
    var el = root.querySelector(selector);
    if (el) el.onclick = handler;
  }

  function renderSummary() {
    root.innerHTML =
      '<div class="isc-card" role="dialog" aria-labelledby="isc-title"><div class="isc-row">' +
      '<div class="isc-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg></div>' +
      '<div class="isc-main"><h2 class="isc-title" id="isc-title">Your privacy matters</h2>' +
      '<p class="isc-text">We use cookies and similar technologies, including Meta (Facebook) tools, to measure our ads and improve your experience. Accept to allow them, or manage your choices. ' +
      '<a href="https://internationalschooling.org/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></p></div>' +
      '<div class="isc-actions"><button type="button" class="isc-btn" data-a="manage">Manage cookies</button>' +
      '<button type="button" class="isc-btn isc-primary" data-a="accept">Accept all</button></div></div></div>';
    on('[data-a="manage"]', function () {
      marketing = readConsent() === "granted";
      fromSummary = true;
      renderManage();
    });
    on('[data-a="accept"]', function () { choose("granted"); });
  }

  function renderManage() {
    root.innerHTML =
      '<div class="isc-card" role="dialog" aria-labelledby="isc-title">' +
      '<h2 class="isc-title" id="isc-title">Manage cookies</h2>' +
      '<p class="isc-text">Choose which cookies we may use. You can change your choice at any time.</p>' +
      '<ul class="isc-list">' +
      '<li><div><p class="isc-li-title">Strictly necessary</p><p class="isc-li-text">Needed for the site to work, such as sign-in, security and your preferences. Always on.</p></div>' +
      '<button type="button" class="isc-sw" role="switch" aria-checked="true" aria-label="Strictly necessary" disabled></button></li>' +
      '<li><div><p class="isc-li-title">Marketing (Meta / Facebook)</p><p class="isc-li-text">Lets us measure our ads and connect an enquiry to the ad that led to it. Off unless you allow it.</p></div>' +
      '<button type="button" class="isc-sw" role="switch" aria-checked="' + (marketing ? "true" : "false") + '" aria-label="Marketing (Meta / Facebook)" data-a="toggle"></button></li>' +
      '</ul>' +
      '<div class="isc-foot"><button type="button" class="isc-link" data-a="back">Back</button>' +
      '<div class="isc-btns"><button type="button" class="isc-btn" data-a="reject">Reject all</button>' +
      '<button type="button" class="isc-btn isc-primary" data-a="save">Save my choices</button></div></div></div>';
    on('[data-a="toggle"]', function () {
      marketing = !marketing;
      this.setAttribute("aria-checked", marketing ? "true" : "false");
    });
    on('[data-a="back"]', function () {
      if (fromSummary) renderSummary();
      else close();
    });
    on('[data-a="reject"]', function () { choose("denied"); });
    on('[data-a="save"]', function () { choose(marketing ? "granted" : "denied"); });
  }

  if (startInManage) renderManage();
  else renderSummary();
}


  window.openCookieSettings = function () {
    showMarketingConsentBanner(true);
  };

  if (readConsent() === null) {
    showMarketingConsentBanner(false);
  }
})();
