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
    ";domain=internationalschooling.org;path=/";
  console.log("setCookie cname:: " + cname);
  document.cookie = cname;
}

function getCookie(key) {
  if (key == undefined || key == "") {
    return false;
  }
  var keyValue = document.cookie.match("(^|;) ?" + key + "=([^;]*)(;|$)");
  console.log("getCookie keyValue:: " + keyValue);
  return keyValue ? keyValue[2] : "Test";
}

const us = getCookie("us");
if (us === "0" || !us || us === "N/A" || us === "undefined") {
  const utm_source = urlParam("utm_source");
  if (utm_source) {
    setCookie("us", utm_source);
  }
}
const um = getCookie("um");
if (um === "0" || !um || um === "N/A" || um === "undefined") {
  const utm_medium = urlParam("utm_medium");
  if (utm_medium) {
    setCookie("um", utm_medium);
  }
}
const uc = getCookie("uc");
if (uc === "0" || !uc || uc === "N/A" || uc === "undefined") {
  const utm_content = urlParam("utm_content");
  if (utm_content) {
    setCookie("uc", utm_content);
  }
}
const gc = getCookie("gclid");
if (gc === "0" || !gc || gc === "N/A" || gc === "undefined") {
  const gclid = urlParam("gclid");
  if (gclid) {
    setCookie("gclid", gclid);
  }
  const fbclid = urlParam("fbclid");
  if (fbclid) {
    setCookie("gclid", fbclid);
  }
}
const ucamCheck = getCookie("utm_campaign");
if (
  ucamCheck === "0" ||
  !ucamCheck ||
  ucamCheck === "N/A" ||
  ucamCheck === "undefined"
) {
  const utm_campaign = urlParam("utm_campaign");
  if (utm_campaign) {
    setCookie("ucam", utm_campaign);
  }
}
const ut = getCookie("utm_term");
if (ut === "0" || !ut || ut === "N/A" || ut === "undefined") {
  const utm_term = urlParam("utm_term");
  if (utm_term) {
    setCookie("ut", utm_term);
  }
}

setCookie("cu", window.location.href);
