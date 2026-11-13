/* =========================================================
   noticeModal.js
   Plain functions over the single reusable Bootstrap 4.6 modal
   (#nmsModal) declared in index.html. Replaces the old custom
   overlay/popup. Callable directly: openModal(...), closeModal().
   Modal body/footer markup uses the same inline onclick="fn(event)"
   handlers as the rest of the app, so their buttons need no special
   wiring (e.g. onclick="closeModal()").
   ========================================================= */

function openModal(title, body, footer, opts) {
  noticeDestroyHtmlEditor("tplBody");
  $("#nmsModalTitle").html(title);
  $("#nmsModalBody").html(body);
  $("#nmsModalFooter").html(footer || "");

  var $dialog = $("#nmsModalDialog");
  var wide = !!(opts && opts.wide);
  $dialog.toggleClass("modal-xl", wide);
  $dialog.toggleClass("modal-lg", !wide);
  $("#nmsModal").modal("show");
}

function closeModal() {
  noticeDestroyHtmlEditor("tplBody");
  $("#nmsModal").modal("hide");
}
