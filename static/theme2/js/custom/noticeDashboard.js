/* =========================================================
   noticeDashboard.js
   Dashboard behaviour. Row clicks (onclick="openWorkspaceNotice(this)")
   and the Reports link (onclick="navTo(event)") are served by the
   Workspace / router handlers, so the Dashboard only needs to mount.
   Callable from console: renderDashboard()
   ========================================================= */

function renderDashboard() {
  renderNoticeDashboardContent();
}
