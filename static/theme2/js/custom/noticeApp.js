/* =========================================================
   noticeApp.js
   Application boot + backward-compatible navigation shims.

   Routing now lives in pageConfig.js (NOTICE_PAGES + callNoticePage).
   This file only:
     - boots the app (delegation + first page)
     - keeps showView()/navTo() working so existing callers
       (newCompose, loadComposeNotice, workspaceAckLedger, sidebar
       onclick="navTo(event)") route through the central loader unchanged.
   ========================================================= */

/* Backward-compatible alias: every showView("x") now flows through the
   central page loader. Kept so module code that calls showView(...) needs
   no edits. Prefer callNoticePage() in new code. */
function showView(view) {
  return callNoticePage(view);
}

/* Sidebar/link click handler (onclick="navTo(event)").
   Reads the page key from data-page (preferred) or data-view (legacy). */
function navTo(e) {
  const el = e.currentTarget;
  callNoticePage(el.getAttribute("data-page") || el.getAttribute("data-view"));
}

/* One-time startup. S.compose is no longer seeded here — the Compose page
   seeds it in its own init hook (see NOTICE_PAGES.compose), because the
   Compose module is now lazy-loaded and blankCompose() isn't available yet. */
function bootNoticeApp() {
  callNoticePage("dashboard");
}

document.addEventListener("DOMContentLoaded", bootNoticeApp);
