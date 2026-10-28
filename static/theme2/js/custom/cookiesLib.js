function urlParam(name) {
  if (name == undefined || name == "") {
    return false;
  }
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  if (results == null) {
    return null;
  }
  return decodeURI(results[1]) || null;
}

// Registrable domain of the current host (e.g. sms-is.ischoolusa.com -> ischoolusa.com) so cookies are
// shared across subdomains; empty for localhost/IPs (host-only cookie).
//
// "Last two labels" is only a guess: on a customer domain whose public suffix is itself two labels
// (foo.co.in, foo.co.uk, foo.com.au, ...) that guess IS the public suffix, and every browser silently
// refuses to store a cookie scoped to it — nothing gets saved and e.g. the consent cookie never sticks.
// Probe instead: try the broadest candidate first and keep the first the browser actually accepts,
// falling back to the host itself (always accepted). Resolved once per page.
var __iscCookieDomainProbe = "__isc_cd_probe2";
var __iscResolvedCookieDomain;
function __iscCandidateDomains(host) {
  if (!host || host.indexOf(".") === -1 || /^[0-9.]+$/.test(host)) return [];
  var labels = host.split(".");
  var candidates = [];
  for (var take = 2; take <= labels.length; take++) candidates.push(labels.slice(-take).join("."));
  return candidates;
}
function __iscDomainAccepted(domain) {
  document.cookie = __iscCookieDomainProbe + "=1; path=/; max-age=60" + (domain ? "; domain=" + domain : "");
  var stored = document.cookie.indexOf(__iscCookieDomainProbe + "=1") !== -1;
  document.cookie = __iscCookieDomainProbe + "=; path=/; max-age=0" + (domain ? "; domain=" + domain : "");
  return stored;
}
function getCookieDomain() {
  if (__iscResolvedCookieDomain !== undefined) return __iscResolvedCookieDomain;
  var candidates = __iscCandidateDomains(window.location.hostname);
  __iscResolvedCookieDomain = "";
  for (var i = 0; i < candidates.length; i++) {
    if (__iscDomainAccepted(candidates[i])) { __iscResolvedCookieDomain = candidates[i]; break; }
  }
  return __iscResolvedCookieDomain;
}

function setCookie(key, value) {
  if (value == undefined || value == "") {
    return false;
  }
  var expires = new Date();
  expires.setTime(expires.getTime() + 31 * 24 * 60 * 60 * 1000);
  var cname =
    key +
    "=" +
    value +
    ";expires=" +
    expires.toUTCString() +
    (getCookieDomain() ? ";domain=" + getCookieDomain() : "") +
    ";path=/";
  console.log("setCookie cname:: " + cname);
  document.cookie = cname;
}

function getCookie(key) {
  if (key == undefined || key == "") {
    return false;
  }
  var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  // console.log("getCookie keyValue:: " + keyValue);
  return keyValue ? keyValue[2] : "Test";
}

// getCookie returns "Test" when the cookie is absent, so treat that as missing too
function isCookieEmpty(v) {
  return !v || v === "0" || v === "N/A" || v === "undefined" || v === "Test";
}

const us = getCookie("us");
if (isCookieEmpty(us)) {
  const utm_source = urlParam("utm_source");
  if (utm_source) {
    setCookie("us", utm_source);
  }
}
const um = getCookie("um");
if (isCookieEmpty(um)) {
  const utm_medium = urlParam("utm_medium");
  if (utm_medium) {
    setCookie("um", utm_medium);
  }
}
const uc = getCookie("uc");
if (isCookieEmpty(uc)) {
  const utm_content = urlParam("utm_content");
  if (utm_content) {
    setCookie("uc", utm_content);
  }
}
const gc = getCookie("gclid");
if (isCookieEmpty(gc)) {
  const gclid = urlParam("gclid");
  if (gclid) {
    setCookie("gclid", gclid);
  }
  const fbclid = urlParam("fbclid");
  if (fbclid) {
    setCookie("gclid", fbclid);
  }
}
// Meta Conversions API match keys. _fbp / _fbc are kept in Meta's own format
// (fb.<subdomain_index>.<creation_time_ms>.<value>) and captured on the first page load,
// so every later lead / demo / payment form can send them untouched. If the Meta Pixel
// already set the cookie it is left as is; _fbc is case sensitive and never changed.
function getRawCookie(key) {
  var m = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  return m ? m[2] : "";
}

function setMetaCookie(key, value) {
  var expires = new Date();
  expires.setTime(expires.getTime() + 90 * 24 * 60 * 60 * 1000);
  document.cookie =
    key + "=" + value + ";expires=" + expires.toUTCString() +
    (getCookieDomain() ? ";domain=" + getCookieDomain() : "") + ";path=/;SameSite=Lax";
}

function captureMetaParams() {
  try {
    var subdomainIndex = getCookieDomain() ? 1 : 0;
    if (!getRawCookie("_fbp")) {
      var rand = Math.floor(1000000000 + Math.random() * 9000000000);
      setMetaCookie("_fbp", "fb." + subdomainIndex + "." + Date.now() + "." + rand);
    }
    var m = /[?&]fbclid=([^&#]+)/.exec(window.location.search);
    if (m && !getRawCookie("_fbc")) {
      setMetaCookie("_fbc", "fb." + subdomainIndex + "." + Date.now() + "." + m[1]);
    } else if (m) {
      // a new ad click replaces the stored click only when the fbclid changed
      // Meta's client library appends an appendix to the stored value ("<fbclid>.<appendix>")
      var stored = getRawCookie("_fbc").split(".").slice(3).join(".");
      if (stored !== m[1] && stored.indexOf(m[1] + ".") !== 0) {
        setMetaCookie("_fbc", "fb." + subdomainIndex + "." + Date.now() + "." + m[1]);
      }
    }
  } catch (e) {}
}
// ---- Marketing (Meta) cookie consent: opt-in. Nothing Meta-related (the _fbp / _fbc / _fbi cookies, the
// Meta client library) runs until the visitor accepts. One cookie shared by every *.internationalschooling.org app:
//   is_marketing_consent = "granted" | "denied"   (absent = not chosen yet)
var MARKETING_CONSENT_COOKIE = "is_marketing_consent";

function getMarketingConsent() {
  var v = getRawCookie(MARKETING_CONSENT_COOKIE);
  return v === "granted" || v === "denied" ? v : null;
}

function expireCookie(name, domain) {
  document.cookie = name + "=; path=/; max-age=0" + (domain ? "; domain=" + domain : "");
}

function deleteMetaCookies() {
  ["_fbp", "_fbc", "_fbi"].forEach(function (name) {
    expireCookie(name, "");
    if (getCookieDomain()) expireCookie(name, getCookieDomain());
  });
}

function loadMetaParamBuilder() {
  try {
    if (document.getElementById("meta-capi-param-builder")) return;
    var s = document.createElement("script");
    s.id = "meta-capi-param-builder";
    s.async = true;
    s.src = "/static/vendor/meta/clientParamBuilder.bundle.js?v=1.3.2";
    s.onload = function () {
      // The library logs "Invalid IP address" when its IP function returns nothing usable, so the IP is fetched
      // first and an IP function is passed only when it is valid.
      fetch("/api/v1/ip-location/ip", { credentials: "include" })
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (t) { return (t || "").trim(); })
        .catch(function () { return ""; })
        .then(function (ip) {
          try {
            var valid = /^[0-9a-fA-F:.]+$/.test(ip);
            window.clientParamBuilder.processAndCollectAllParams(
              window.location.href,
              valid ? function () { return ip; } : undefined
            );
          } catch (e) {}
        });
    };
    document.head.appendChild(s);
  } catch (e) {}
}

var metaTrackingStarted = false;
function startMetaTracking() {
  if (metaTrackingStarted) return;
  metaTrackingStarted = true;
  captureMetaParams();
  loadMetaParamBuilder();
}

// The consent card itself lives in marketingConsent.js (loaded on every page). Here only the Meta side: start when the
// visitor has accepted (now or earlier), and clean up when the choice is withdrawn.
if (getMarketingConsent() === "granted") {
  startMetaTracking();
}
window.addEventListener("is:marketing-consent", function (e) {
  var value = e && e.detail;
  if (value === "granted") {
    startMetaTracking();
  } else {
    deleteMetaCookies();
  }
  if (typeof window.fbq === "function") {
    window.fbq("consent", value === "granted" ? "grant" : "revoke");
  }
});
