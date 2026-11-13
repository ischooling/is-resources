/* =========================================================
   noticeUserPreferencesContent.js
   HTML generation for the User Preferences view.
   Plain string-returning functions.
   ========================================================= */

function userPreferencesSegRowHtml(labelHtml, toggleHtml) {
  return '<div class="d-flex justify-content-between align-items-center py-2 border-bottom"><div>' + labelHtml + "</div>" + toggleHtml + "</div>";
}

function userPreferencesChannelRowsHtml() {
  return CHANNELS.map(function (ch, i) {
    return userPreferencesSegRowHtml(ch.icon + " " + ch.name, switchToggle("pref-chan-" + ch.id, i < 4, "", { k: ch.id }));
  }).join("");
}

function userPreferencesCategoryRowsHtml() {
  return TYPES.filter(function (t) { return t.cat !== "emergency"; }).map(function (t) {
    return userPreferencesSegRowHtml(t.name + ' <span class="text-muted small">(' + t.cat + ")</span>", switchToggle("pref-cat-" + t.id, t.cat === "transactional", "", { k: t.id }));
  }).join("");
}

function userPreferencesPageHtml() {
  return pageHead("pe-7s-tools", "User Preferences", "What a parent / student controls — Critical &amp; legal notices override these") +
    '<div class="row">' +
      '<div class="col-lg-6 mb-4"><div class="card h-100"><div class="card-body">' +
        '<h3 class="h5">Channels</h3><div class="text-muted small mb-2">Turn delivery channels on or off</div>' +
        '<div id="chanPrefs">' + userPreferencesChannelRowsHtml() + "</div>" +
      "</div></div></div>" +
      '<div class="col-lg-6 mb-4"><div class="card h-100"><div class="card-body">' +
        '<h3 class="h5">Categories</h3><div class="text-muted small mb-2">Mute notice types you don\'t want (managed list, not hardcoded)</div>' +
        '<div id="catPrefs">' + userPreferencesCategoryRowsHtml() + "</div>" +
      "</div></div></div>" +
      '<div class="col-lg-6 mb-4"><div class="card h-100"><div class="card-body">' +
        '<h3 class="h5">Quiet hours</h3><div class="text-muted small mb-3">Non-critical notices are queued and released after</div>' +
        '<div class="form-row"><div class="form-group col-6"><label>From</label><input type="text" class="form-control" id="qFrom" value="22:00"></div>' +
        '<div class="form-group col-6"><label>To</label><input type="text" class="form-control" id="qTo" value="07:00"></div></div>' +
      "</div></div></div>" +
      '<div class="col-lg-6 mb-4"><div class="card h-100"><div class="card-body">' +
        '<h3 class="h5">Language</h3><div class="text-muted small mb-3">Preferred locale for message + declaration variants</div>' +
        '<div class="form-group"><label>Language</label><select id="prefLang" class="form-control"><option>English (EN)</option><option>Arabic (AR)</option><option>Hindi (HI)</option><option>French (FR)</option></select></div>' +
        '<div class="alert alert-danger mb-0">&#9878; Emergency &amp; legal-acknowledgment notices are delivered regardless of these preferences, per the override configuration.</div>' +
      "</div></div></div>" +
    "</div>" +
    '<div class="text-right mb-4"><button class="btn btn-success" onclick="savePreferences()">Save preferences</button></div>';
}
