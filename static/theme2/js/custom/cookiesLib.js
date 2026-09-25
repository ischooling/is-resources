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

// Registrable domain of the current host (e.g. sms-is.ischoolusa.com -> ischoolusa.com)
// so cookies are shared across subdomains; empty for localhost/IPs (host-only cookie).
function getCookieDomain() {
  var host = window.location.hostname;
  if (!host || host.indexOf(".") === -1 || /^[0-9.]+$/.test(host)) {
    return "";
  }
  var parts = host.split(".");
  return parts.slice(-2).join(".");
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
const ucamCheck = getCookie("ucam");
if (isCookieEmpty(ucamCheck)) {
  const utm_campaign = urlParam("utm_campaign");
  if (utm_campaign) {
    setCookie("ucam", utm_campaign);
  }
}
const ut = getCookie("ut");
if (isCookieEmpty(ut)) {
  const utm_term = urlParam("utm_term");
  if (utm_term) {
    setCookie("ut", utm_term);
  }
}

// lu: first page the visitor landed on; set once, never overwritten
if (isCookieEmpty(getCookie("lu"))) {
  setCookie("lu", window.location.href);
}
// cu: first URL that carried campaign params; set once, never overwritten
if (
  isCookieEmpty(getCookie("cu")) &&
  (urlParam("utm_source") || urlParam("utm_medium") || urlParam("utm_campaign") ||
    urlParam("utm_content") || urlParam("utm_term") || urlParam("gclid") || urlParam("fbclid"))
) {
  setCookie("cu", window.location.href);
}
