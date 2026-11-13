/* =========================================================
   noticeUserPreferences.js
   User Preferences behaviour.
   Console-callable: renderUserPreferences(), savePreferences()
   ========================================================= */

function renderUserPreferences() {
  document.getElementById("main").innerHTML = userPreferencesPageHtml();
}

function readPrefToggles(containerId) {
  const map = {};
  qsa("#" + containerId + " .custom-control-input").forEach(function (t) { map[t.dataset.k] = t.checked; });
  return map;
}

function savePreferences() {
  S.prefs = {
    channels: readPrefToggles("chanPrefs"),
    categories: readPrefToggles("catPrefs"),
    quiet: { from: qs("#qFrom").value, to: qs("#qTo").value },
    lang: qs("#prefLang").value
  };
  toast("Preferences saved for " + S.prefs.lang, "ok");
}
