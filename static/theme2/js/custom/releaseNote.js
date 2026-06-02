var releaseNoteState = {
	moduleId: 0,
	isAdmin: false,
	mode: "user-list",
	renderInAdditional: false,
	currentReleaseNoteId: 0,
	editorAttachments: [],
	editorPreviewIndex: -1,
	joditEditor: null,
	availableRoleOptions: [],
	editorSelectedRoles: [],
	editorRoleSearchTerm: "",
	userReleaseCache: [],
	adminDetailAttachments: [],
	userDetailAttachments: [],
	adminDetailPreviewIndex: -1,
	userDetailPreviewIndex: -1,
};

(function () {
	var RN_JODIT_CSS_URL = "https://cdn.jsdelivr.net/npm/jodit@3.24.9/build/jodit.min.css";
	var RN_JODIT_JS_URL = "https://cdn.jsdelivr.net/npm/jodit@3.24.9/build/jodit.min.js";
	var rnJoditLoadPromise = null;
	var RELEASE_NOTE_ADMIN_ROLES = [
		"ADMIN",
		"ADMIN1",
		"SCHOOL_ADMIN",
		"SUPER_ADMIN",
		"SUB_ADMIN",
		"DIRECTOR",
	];

	function rnToInt(value, fallback) {
		var number = parseInt(value, 10);
		if (isNaN(number)) {
			return fallback === undefined ? 0 : fallback;
		}
		return number;
	}

	function rnEsc(value) {
		return String(value === undefined || value === null ? "" : value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function rnStripHtml(value) {
		return $("<div>").html(value || "").text();
	}

	function rnFileExt(name) {
		var value = String(name || "").trim();
		if (!value || value.indexOf(".") < 0) {
			return "";
		}
		return value.split(".").pop().toLowerCase();
	}

	function rnResolveAttachmentType(item) {
		var rawType = String((item || {}).fileType || "").toUpperCase();
		if (rawType === "IMAGE" || rawType === "VIDEO" || rawType === "PDF") {
			return rawType;
		}
		var ext = rnFileExt((item || {}).fileName || "");
		if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].indexOf(ext) >= 0) {
			return "IMAGE";
		}
		if (["mp4", "mov", "avi", "mkv", "webm"].indexOf(ext) >= 0) {
			return "VIDEO";
		}
		if (ext === "pdf") {
			return "PDF";
		}
		return "FILE";
	}

	function rnAttachmentTypeClass(type) {
		if (type === "IMAGE") {
			return "badge-success";
		}
		if (type === "VIDEO") {
			return "badge-primary";
		}
		if (type === "PDF") {
			return "badge-danger";
		}
		return "badge-secondary";
	}

	function rnAttachmentTypeIcon(type) {
		if (type === "IMAGE") {
			return "fa-file-image-o";
		}
		if (type === "VIDEO") {
			return "fa-file-video-o";
		}
		if (type === "PDF") {
			return "fa-file-pdf-o";
		}
		return "fa-file-o";
	}

	function rnGetAttachmentName(item, index) {
		return String((item || {}).displayName || (item || {}).fileName || ("Attachment " + (index + 1)));
	}

	function rnNormalizeRoleCode(value) {
		return String(value || "").trim().toUpperCase().replace(/\s+/g, "_");
	}

	function rnRoleLabel(roleCode) {
		var code = rnNormalizeRoleCode(roleCode);
		if (!code) {
			return "";
		}
		return code.split("_").map(function (part) {
			var lower = String(part || "").toLowerCase();
			return lower ? lower.charAt(0).toUpperCase() + lower.slice(1) : "";
		}).join(" ");
	}

	function rnFormatUtcDateTime(dateTimeValue) {
		var raw = String(dateTimeValue || "").trim();
		if (!raw) {
			return "-";
		}
		var timezone = String(window.USER_TIMEZONE || "").trim() || "UTC";
		var displayFormat = (typeof DISPLAY_DATETIME_FORMATTER_WITHOUT_DAY !== "undefined" && DISPLAY_DATETIME_FORMATTER_WITHOUT_DAY)
			? DISPLAY_DATETIME_FORMATTER_WITHOUT_DAY
			: "DD MMM, YYYY hh:mm A";
		try {
			if (typeof convertUTCToTimezoneAs === "function" && typeof DATETIME_UTC_FORMATTER !== "undefined") {
				return convertUTCToTimezoneAs(raw, DATETIME_UTC_FORMATTER, timezone).format(displayFormat);
			}
		} catch (e) {}
		try {
			if (typeof moment === "function" && moment.utc) {
				return moment.utc(raw, "YYYY-MM-DD HH:mm:ss").tz(timezone).format(displayFormat);
			}
		} catch (e) {}
		return raw;
	}

	function rnResolvePublishedDate(item) {
		var note = item || {};
		return rnFormatUtcDateTime(note.publishedDateUtc || note.publishedDate);
	}

	function rnResolveUpdatedDate(item) {
		var note = item || {};
		return rnFormatUtcDateTime(note.updatedDateUtc || note.updatedDate);
	}

	function rnRenderInlineAttachmentPreview(titleId, bodyId, attachment, emptyText) {
		var $title = $("#" + titleId);
		var $body = $("#" + bodyId);
		if (!$title.length || !$body.length) {
			return;
		}
		if (!attachment) {
			$title.text(emptyText || "No attachment selected.");
			$body.html("<div class='text-muted'>Select an attachment to preview.</div>");
			return;
		}

		var name = rnGetAttachmentName(attachment, 0);
		var url = String(attachment.fileUrl || "").trim();
		var type = rnResolveAttachmentType(attachment);
		$title.text(name + " (" + type + ")");

		if (!url) {
			$body.html("<div class='text-muted'>Preview unavailable.</div>");
			return;
		}

		var safeUrl = rnEsc(url);
		var html = "";
		if (type === "IMAGE") {
			html = "<img src='" + safeUrl + "' alt='' class='img-fluid rounded border' style='max-height:430px;width:100%;object-fit:contain;background:#fff;' />";
		} else if (type === "VIDEO") {
			html = "<video controls class='w-100 rounded border' style='max-height:430px;background:#000;'><source src='" + safeUrl + "'></video>";
		} else if (type === "PDF") {
			html = "<object data='" + safeUrl + "' type='application/pdf' class='w-100 rounded border' style='height:500px;background:#fff;'></object>";
		} else {
			html = "" +
				"<iframe src='" + safeUrl + "' class='w-100 rounded border' style='height:420px;background:#fff;'></iframe>" +
				"<div class='small text-muted mt-2'>If preview is not supported by browser for this file type, use download.</div>" +
				"<a class='btn btn-sm btn-outline-primary mt-2' href='" + safeUrl + "' download>Download File</a>";
		}
		$body.html(html);
	}

	function rnSetAttachmentActive(listSelector, selectedIndex) {
		var $list = $(listSelector);
		if (!$list.length) {
			return;
		}
		$list.find("[data-rn-attachment-index]").removeClass("active");
		$list.find("[data-rn-attachment-index='" + selectedIndex + "']").addClass("active");
	}

	function rnNormalizeResponse(response) {
		if (typeof response === "string") {
			try {
				return JSON.parse(response);
			} catch (e) {
				return {};
			}
		}
		return response || {};
	}

	function rnHandleSession(response) {
		if (!response || String(response.status || "") !== "3") {
			return false;
		}
		if (typeof redirectLoginPage === "function") {
			redirectLoginPage();
			return true;
		}
		if (typeof showMessageTheme2 === "function") {
			showMessageTheme2(0, response.message || response.MESSAGE || "Session expired", "", true);
		}
		return true;
	}

	function rnIsSuccess(response) {
		var status = String(response.status || "").toUpperCase();
		var statusCode = String(response.statusCode || "").toUpperCase();
		return status === "1" || status === "SUCCESS" || statusCode === "SUCCESS";
	}

	function rnShowToast(type, message) {
		if (typeof showMessageTheme2 === "function" && message) {
			showMessageTheme2(type, message, "", true);
		}
	}

	function rnApiUrl(path) {
		return getURLForHTML("api/v1/release-note", path);
	}

	function rnGetRequestBasePayload() {
		return {
			userId: rnToInt(window.USER_ID),
			schoolId: rnToInt(window.SCHOOL_ID),
			moduleId: rnToInt(releaseNoteState.moduleId),
		};
	}

	function rnGetRole() {
		var directRole = String(window.USER_ROLE || "").trim().toUpperCase();
		if (directRole) {
			return directRole;
		}
		return String(window.PARENT_USER_ROLE || "").trim().toUpperCase();
	}

	function rnCheckAdminRole() {
		return RELEASE_NOTE_ADMIN_ROLES.indexOf(rnGetRole()) >= 0;
	}

	function rnResolveMode(pageNo, isAdmin) {
		var value = String(pageNo || "").trim();
		if (value === "release-note-admin-list") {
			return isAdmin ? "admin-list" : "user-list";
		}
		if (value === "release-note-admin-editor") {
			return isAdmin ? "admin-editor" : "user-list";
		}
		if (value === "release-note-user-list") {
			return "user-list";
		}
		return isAdmin ? "admin-list" : "user-list";
	}

	function rnParseReleaseNoteId(extraParam) {
		var value = String(extraParam || "").trim();
		if (!value) {
			return 0;
		}
		var query = value;
		if (query.indexOf("?") !== 0 && query.indexOf("&") !== 0) {
			query = "?" + query;
		}
		if (query.indexOf("&") === 0) {
			query = "?" + query.substring(1);
		}
		try {
			var params = new URLSearchParams(query);
			return rnToInt(params.get("releaseNoteId"), 0);
		} catch (e) {
			var match = value.match(/releaseNoteId=([0-9]+)/);
			return rnToInt(match && match[1], 0);
		}
	}

	function rnGetParam(extraParam, key) {
		var paramKey = String(key || "").trim();
		if (!paramKey) {
			return "";
		}
		var value = String(extraParam || "").trim();
		if (!value) {
			return "";
		}
		var query = value;
		if (query.indexOf("?") !== 0 && query.indexOf("&") !== 0) {
			query = "?" + query;
		}
		if (query.indexOf("&") === 0) {
			query = "?" + query.substring(1);
		}
		try {
			var params = new URLSearchParams(query);
			return String(params.get(paramKey) || "");
		} catch (e) {
			return "";
		}
	}

	function rnShouldRenderInAdditional(extraParam) {
		var raw = rnGetParam(extraParam, "renderInAdditional");
		var normalized = String(raw || "").trim().toUpperCase();
		return normalized === "Y" || normalized === "YES" || normalized === "TRUE" || normalized === "1";
	}

	function rnGetRenderContainerSelector() {
		return releaseNoteState.renderInAdditional ? "#dashboardContentInHTMLAdditional" : "#dashboardContentInHTML";
	}

	function rnCallDetailApi(releaseNoteId, markAsRead, successCallback) {
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("detail"),
			data: JSON.stringify({
				userId: rnToInt(window.USER_ID),
				schoolId: rnToInt(window.SCHOOL_ID),
				releaseNoteId: rnToInt(releaseNoteId),
				markAsRead: markAsRead === true,
			}),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to fetch release note details.");
					return;
				}
				if (typeof successCallback === "function") {
					successCallback(response);
				}
			},
			error: function () {
				rnShowToast(0, "Unable to fetch release note details.");
			},
		});
	}

	function rnCallViewApi(releaseNoteId, markAsRead, successCallback) {
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("detail-view"),
			data: JSON.stringify({
				userId: rnToInt(window.USER_ID),
				schoolId: rnToInt(window.SCHOOL_ID),
				releaseNoteId: rnToInt(releaseNoteId),
				markAsRead: markAsRead === true,
			}),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to fetch release note view.");
					return;
				}
				if (typeof successCallback === "function") {
					successCallback(response);
				}
			},
			error: function () {
				rnShowToast(0, "Unable to fetch release note view.");
			},
		});
	}

	function rnRenderAdminCounters(response) {
		var draftNotes = response.draftReleaseNotes || [];
		var publishedNotes = response.publishedReleaseNotes || [];
		var allNotes = response.releaseNotes || [];
		$("#rnAdminTotalCount").text(allNotes.length || 0);
		$("#rnAdminDraftCount").text(draftNotes.length || 0);
		$("#rnAdminPublishedCount").text(publishedNotes.length || 0);
	}

	function rnRenderAdminTable(notes) {
		var html = [];
		if (!notes || !notes.length) {
			html.push("<tr><td></td><td></td><td class='text-center'>No release notes found.</td><td></td><td></td></tr>");
		} else {
			for (var i = 0; i < notes.length; i++) {
				var item = notes[i] || {};
				var releaseNoteId = rnToInt(item.releaseNoteId, 0);
				var status = String(item.status || "DRAFT").toUpperCase();
				var statusBadge = status === "PUBLISHED"
					? '<span class="badge badge-success">PUBLISHED</span>'
					: '<span class="badge badge-warning">DRAFT</span>';
				var mailTriggered = String(item.mailTriggered || "N").toUpperCase() === "Y";
				var mailLabel = mailTriggered ? "Send Again" : "Send Mail";
				var attachmentCount = rnToInt(item.attachmentCount, 0);
				var releaseCellHtml = "" + 
					"<div class='small'>Version: " + rnEsc(item.versionLabel || "N/A") + " | <i class='fa fa-paperclip'></i> (" + attachmentCount + ") | "+ statusBadge +"</div>" +
					"<div class='small'>" + rnEsc(item.title || "") + "</div>";
					// +"<div class='small'><i class='fa fa-paperclip'></i> (" + attachmentCount + ")</div>";
				var impactAndNoteHtml = "" +
					"<div><b>Impact:</b> " + rnEsc(item.impactModule || "N/A") + "</div>" +
					"<div class='small'><b>Note:</b>" + rnEsc(rnStripHtml(item.contentPreview || item.summary || "")) + "</div>" +
					"<div class='small'><b>Role:</b>" + rnEsc(item.targetRolesText || "All Roles") + "</div>"
				var datesCellHtml = "" +
					"<div class='small'><b>Updated:</b> " + rnEsc(rnResolveUpdatedDate(item)) + "</div>" +
					"<div class='small'><b>Published:</b> " + rnEsc(rnResolvePublishedDate(item)) + "</div>";

				html.push(
					"<tr>" +
						"<td>" + (i + 1) + "</td>" +
						"<td>" + releaseCellHtml + "</td>" +
						"<td>" + impactAndNoteHtml + "</td>" +
						// "<td>" + rnEsc(item.targetRolesText || "All Roles") + "</td>" +
						// "<td>" + statusBadge + "</td>" +
						"<td>" + datesCellHtml + "</td>" +
						"<td>" +
							'<button class="btn btn-sm btn-primary mr-1 mb-1" type="button" onclick="releaseNoteAdminOpenEditor(' + releaseNoteId + ')"><i class="fa fa-pencil"></i>&nbsp;Edit</button>' +
							'<button class="btn btn-sm btn-outline-secondary mr-1 mb-1" type="button" onclick="releaseNoteAdminOpenDetail(' + releaseNoteId + ')"><i class="fa fa-eye"></i>&nbsp;View</button>' +
							'<button class="btn btn-sm btn-outline-info" type="button" onclick="releaseNoteAdminOpenSendMailModal(' + releaseNoteId + ')"><i class="fa fa-envelope"></i>&nbsp;' + rnEsc(mailLabel) + "</button>" +
						"</td>" +
					"</tr>"
				);
			}
		}

		$("#rnAdminTableBody").html(html.join(""));

		if ($.fn.DataTable) {
			if ($.fn.DataTable.isDataTable("#releaseNoteAdminTable")) {
				$("#releaseNoteAdminTable").DataTable().destroy();
			}
			$("#releaseNoteAdminTable").DataTable({
				pagingType: "full",
				lengthChange: true,
				searching: true,
				dom: "<'row'<'col-sm-6'l><'col-sm-6'f>>rt<'row'<'col-sm-5'i><'col-sm-7'p>><'clear'>",
			});
		}
	}

	function rnLoadAdminReleaseNotes() {
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("admin/list"),
			data: JSON.stringify(rnGetRequestBasePayload()),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to load release notes.");
					rnRenderAdminCounters({});
					rnRenderAdminTable([]);
					return;
				}
				if (Array.isArray(response.availableRoles) && response.availableRoles.length) {
					releaseNoteState.availableRoleOptions = response.availableRoles.slice(0);
				}
				rnRenderAdminCounters(response);
				rnRenderAdminTable(response.releaseNotes || []);
			},
			error: function () {
				rnShowToast(0, "Unable to load release notes.");
				rnRenderAdminCounters({});
				rnRenderAdminTable([]);
			},
		});
	}

	// function rnAdminSendMail(releaseNoteId, btnEl) {
	// 	var noteId = rnToInt(releaseNoteId, 0);
	// 	if (noteId <= 0) {
	// 		return;
	// 	}
	// 	var $btn = btnEl ? $(btnEl) : $();
	// 	if ($btn.length) {
	// 		if ($btn.data("mailSending") === true) {
	// 			return;
	// 		}
	// 		$btn.data("mailSending", true).prop("disabled", true);
	// 	}
	// 	$.ajax({
	// 		type: "POST",
	// 		contentType: APPLICATION_JSON_VALUE,
	// 		url: rnApiUrl("send-mail"),
	// 		data: JSON.stringify({
	// 			userId: rnToInt(window.USER_ID),
	// 			schoolId: rnToInt(window.SCHOOL_ID),
	// 			releaseNoteId: noteId,
	// 		}),
	// 		dataType: "json",
	// 		success: function (rawResponse) {
	// 			var response = rnNormalizeResponse(rawResponse);
	// 			if (rnHandleSession(response)) {
	// 				return;
	// 			}
	// 			if (!rnIsSuccess(response)) {
	// 				rnShowToast(0, response.message || response.MESSAGE || "Unable to send release note mail.");
	// 				return;
	// 			}
	// 			rnShowToast(1, response.message || response.MESSAGE || "Release note mail sent successfully.");
	// 			rnLoadAdminReleaseNotes();
	// 		},
	// 		error: function () {
	// 			rnShowToast(0, "Unable to send release note mail.");
	// 		},
	// 		complete: function () {
	// 			if ($btn.length) {
	// 				$btn.data("mailSending", false).prop("disabled", false);
	// 			}
	// 		},
	// 	});
	// }

	function rnIsValidEmail(value) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
	}

	function rnParseCommaEmails(rawValue) {
		var list = String(rawValue || "").split(",");
		var emails = [];
		for (var i = 0; i < list.length; i++) {
			var email = String(list[i] || "").trim();
			if (!email) {
				continue;
			}
			if (!rnIsValidEmail(email)) {
				return { valid: false, invalidEmail: email, emails: [] };
			}
			emails.push(email);
		}
		return { valid: true, emails: emails };
	}

	function rnOpenSendMailModal(releaseNoteId) {
		var noteId = rnToInt(releaseNoteId, 0);
		if (noteId <= 0) {
			return;
		}
		$("#rnSendMailReleaseNoteId").val(noteId);
		$("#rnSendMailToEmails").val("syeed@serionline.in");
		$("#rnSendMailCcEmails").val("kedar@seriindia.org, qa02@seriindia.org, qa01@seriindia.org, dev@seriindia.org, priyanshi.malik@seriindia.org");
		$("#releaseNoteSendMailModal").modal("show");
	}

	function rnSubmitSendMail() {
		var noteId = rnToInt($("#rnSendMailReleaseNoteId").val(), 0);
		if (noteId <= 0) {
			return;
		}
		var parsedTo = rnParseCommaEmails($("#rnSendMailToEmails").val());
		if (!parsedTo.valid) {
			rnShowToast(0, "Invalid TO email: " + parsedTo.invalidEmail);
			return;
		}
		if (!parsedTo.emails.length) {
			rnShowToast(0, "At least one TO email is required.");
			return;
		}
		var parsedCc = rnParseCommaEmails($("#rnSendMailCcEmails").val());
		if (!parsedCc.valid) {
			rnShowToast(0, "Invalid CC email: " + parsedCc.invalidEmail);
			return;
		}
		var $btn = $("#rnSendMailSubmitBtn");
		$btn.prop("disabled", true);
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("send-mail"),
			data: JSON.stringify({
				userId: rnToInt(window.USER_ID),
				schoolId: rnToInt(window.SCHOOL_ID),
				releaseNoteId: noteId,
				toEmails: parsedTo.emails,
				ccEmails: parsedCc.emails
			}),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to send release note mail.");
					return;
				}
				$("#releaseNoteSendMailModal").modal("hide");
				rnShowToast(1, response.message || response.MESSAGE || "Release note mail sent successfully.");
				rnLoadAdminReleaseNotes();
			},
			error: function () {
				rnShowToast(0, "Unable to send release note mail.");
			},
			complete: function () {
				$btn.prop("disabled", false);
			}
		});
	}

	function rnRenderAdminAttachmentList(attachments) {
		if (!attachments || !attachments.length) {
			return "<p class='mb-0'>No attachment</p>";
		}
		var html = [
			"<div class='row'>",
				"<div class='col-lg-4 col-md-5 mb-2'>",
					"<div class='small text-muted mb-2'>Attachments</div>",
					"<div class='list-group' id='rnAdminDetailAttachmentList'>"
		];
		for (var i = 0; i < attachments.length; i++) {
			var item = attachments[i] || {};
			var type = rnResolveAttachmentType(item);
			var name = rnEsc(rnGetAttachmentName(item, i));
			html.push(
				"<button type='button' class='list-group-item list-group-item-action p-2' data-rn-attachment-index='" + i + "' onclick='releaseNoteAdminPreviewAttachment(" + i + ")'>" +
					"<div class='d-flex align-items-center'>" +
						"<i class='fa " + rnAttachmentTypeIcon(type) + " mr-2 text-muted'></i>" +
						"<div class='flex-grow-1' style='min-width:0;'>" +
							"<div class='font-weight-semi-bold text-truncate'>" + name + "</div>" +
							"<span class='badge " + rnAttachmentTypeClass(type) + "'>" + rnEsc(type) + "</span>" +
						"</div>" +
					"</div>" +
				"</button>"
			);
		}
		html.push(
					"</div>",
				"</div>",
				"<div class='col-lg-8 col-md-7 mb-2'>"
		);
		html.push(
			"<div class='card mb-0 h-100'>" +
				"<div class='card-body p-3'>" +
					"<div id='rnAdminDetailPreviewTitle' class='small text-muted mb-2'>Select an attachment to preview.</div>" +
					"<div id='rnAdminDetailPreviewBody'><div class='text-muted'>Choose an attachment from the left list.</div></div>" +
				"</div>" +
			"</div>" +
				"</div>" +
			"</div>"
		);
		return html.join("");
	}

	function rnShowAdminDetail(releaseNoteId) {
		if (rnToInt(releaseNoteId, 0) <= 0) {
			return;
		}
		rnCallViewApi(releaseNoteId, false, function (response) {
			var note = response.releaseNoteView || {};
			releaseNoteState.adminDetailAttachments = (note.attachments || []).slice(0);
			releaseNoteState.adminDetailPreviewIndex = releaseNoteState.adminDetailAttachments.length ? 0 : -1;
			var publishedDate = rnResolvePublishedDate({ publishedDateUtc: note.publishedDateUtc });
			var detailHtml = "" +
				"<div class='card mb-3'>" +
					"<div class='card-body p-3'>" +
						"<div class='mb-2'><b>Version:</b> " + rnEsc(note.versionLabel || "N/A") + "</div>" +
						"<div class='mb-2'><b>Impact Module:</b> " + rnEsc(note.impactModule || "N/A") + "</div>" +
						"<div class='mb-2'><b>Target Roles:</b> " + rnEsc(note.targetRolesText || "All Roles") + "</div>" +
						"<div class='mb-2'><b>Published Date:</b> " + rnEsc(publishedDate) + "</div>" +
						"<div class='mb-2'><b>Updated Date:</b> " + rnEsc(rnFormatUtcDateTime(note.updatedDateUtc)) + "</div>" +
						"<div class='mb-2'><b>Summary:</b><div class='mt-1'>" + rnEsc(note.summary || "N/A") + "</div></div>" +
						"<div class='mb-0'><b>Description:</b><div class='mt-1'>" + (note.description || "<span class='text-muted'>N/A</span>") + "</div></div>" +
					"</div>" +
				"</div>" +
				"<h6>Attachments</h6>" +
				rnRenderAdminAttachmentList(note.attachments || []);
			$("#rnAdminDetailBody").html(detailHtml);
			$("#releaseNoteAdminDetailModal .modal-title").text(note.title || "Release Note View");
			$("#releaseNoteAdminDetailModal").modal("show");
			if (releaseNoteState.adminDetailAttachments.length) {
				releaseNoteAdminPreviewAttachment(0);
			}
			if($("#rnAdminDetailBody table").length >0){

				$(".table table").addClass("table table-bordered font-12");
				if($("#rnAdminDetailBody table thead").length <1){
					if($(".table table tbody tr:first-child > td").length >= 5){
						$("#releaseNoteAdminDetailModal .modal-dialog").removeClass("modal-lg").addClass("modal-xl");
					}else{
						if(!$("#releaseNoteAdminDetailModal .modal-dialog").hasClass("modal-lg")){
							$("#releaseNoteAdminDetailModal .modal-dialog").removeClass("modal-xl").addClass("modal-lg");	
						}
					}
					$(".table table tbody tr:first-child").addClass("bg-primary text-white");
				}else{
					$(".table table thead").addClass("bg-primary text-white");
				}

			}
		});
	}

	function rnAdminPreviewAttachment(index) {
		var idx = rnToInt(index, -1);
		if (idx < 0 || idx >= (releaseNoteState.adminDetailAttachments || []).length) {
			return;
		}
		releaseNoteState.adminDetailPreviewIndex = idx;
		rnSetAttachmentActive("#rnAdminDetailAttachmentList", idx);
		rnRenderInlineAttachmentPreview(
			"rnAdminDetailPreviewTitle",
			"rnAdminDetailPreviewBody",
			releaseNoteState.adminDetailAttachments[idx],
			"No attachment selected."
		);
	}

	function rnBackToAdminList() {
		callDashboardPageSchool(String(releaseNoteState.moduleId || 0), "release-note-admin-list");
		return false;
	}

	function rnOpenAdminEditor(releaseNoteId) {
		var noteId = rnToInt(releaseNoteId, 0);
		var extraParam = noteId > 0 ? "&releaseNoteId=" + noteId : "";
		callDashboardPageSchool(String(releaseNoteState.moduleId || 0), "release-note-admin-editor", "", extraParam);
	}

	function rnEditorGetSelectedRoles() {
		var selected = [];
		var map = {};
		var list = Array.isArray(releaseNoteState.editorSelectedRoles) ? releaseNoteState.editorSelectedRoles : [];
		for (var i = 0; i < list.length; i++) {
			var roleCode = rnNormalizeRoleCode(list[i]);
			if (!roleCode || map[roleCode]) {
				continue;
			}
			map[roleCode] = true;
			selected.push(roleCode);
		}
		return selected;
	}

	function rnEditorSetSelectedRoles(roleCodes) {
		releaseNoteState.editorSelectedRoles = [];
		var map = {};
		var list = Array.isArray(roleCodes) ? roleCodes : [];
		for (var i = 0; i < list.length; i++) {
			var roleCode = rnNormalizeRoleCode(list[i]);
			if (!roleCode || map[roleCode]) {
				continue;
			}
			map[roleCode] = true;
			releaseNoteState.editorSelectedRoles.push(roleCode);
		}
		rnEditorRenderRoleOptions();
	}

	function rnEditorRenderRoleOptions() {
		var $container = $("#rnTargetRolesContainer");
		if (!$container.length) {
			return;
		}
		var roleOptions = releaseNoteState.availableRoleOptions || [];
		if (!roleOptions.length) {
			$container.html("<div class='text-muted'>No role found for this school.</div>");
			return;
		}

		var selectedMap = {};
		var selectedRoles = releaseNoteState.editorSelectedRoles || [];
		for (var i = 0; i < selectedRoles.length; i++) {
			selectedMap[rnNormalizeRoleCode(selectedRoles[i])] = true;
		}

		var searchTerm = String(releaseNoteState.editorRoleSearchTerm || "").trim().toLowerCase();
		var normalizedRoleOptions = [];
		var filteredRoleOptions = [];
		var totalRoleCount = 0;
		var selectedRoleCount = 0;
		for (var j = 0; j < roleOptions.length; j++) {
			var roleItem = roleOptions[j] || {};
			var normalizedRoleCode = rnNormalizeRoleCode(roleItem.roleCode || roleItem.roleName || roleItem.value);
			if (!normalizedRoleCode) {
				continue;
			}
			normalizedRoleOptions.push({
				roleCode: normalizedRoleCode,
				roleLabel: String(roleItem.roleLabel || rnRoleLabel(normalizedRoleCode) || "")
			});
			totalRoleCount++;
			if (selectedMap[normalizedRoleCode]) {
				selectedRoleCount++;
			}
			var normalizedRoleLabel = String(roleItem.roleLabel || rnRoleLabel(normalizedRoleCode) || "").toLowerCase();
			if (!searchTerm || normalizedRoleCode.toLowerCase().indexOf(searchTerm) >= 0 || normalizedRoleLabel.indexOf(searchTerm) >= 0) {
				filteredRoleOptions.push({
					roleCode: normalizedRoleCode,
					roleLabel: String(roleItem.roleLabel || rnRoleLabel(normalizedRoleCode) || "")
				});
			}
		}

		var selectedRoleCards = [];
		for (var k = 0; k < normalizedRoleOptions.length; k++) {
			var normalizedRoleItem = normalizedRoleOptions[k];
			if (selectedMap[normalizedRoleItem.roleCode]) {
				selectedRoleCards.push(normalizedRoleItem);
			}
		}

		var allChecked = totalRoleCount > 0 && selectedRoleCount === totalRoleCount;
		var showAllRolesToggle = !searchTerm;
		var html = [
			"<div class='row'>",
				"<div class='col-lg-4 col-md-5 col-12 mb-3'>",
					"<div class='card h-100 border-0 shadow-sm'>",
						"<div class='card-body p-3'>",
							"<div class='d-flex justify-content-between align-items-center mb-3'>",
								"<h6 class='mb-0'>Selected Roles</h6>",
								"<span class='badge badge-primary'>" + selectedRoleCount + "</span>",
							"</div>",
							"<div id='rnSelectedRoleList' class='border rounded p-2' style='min-height: 220px; background: #f8fbff;'>"
		];
		if (selectedRoleCards.length) {
			for (var m = 0; m < selectedRoleCards.length; m++) {
				var selectedRoleItem = selectedRoleCards[m];
				html.push(
					"<button type='button' class='btn btn-sm mr-2 mb-2 px-3 py-2 rounded-pill border-0' style='background:#eaf3ff;color:#1f6fe5;font-weight:600;' data-rn-selected-role='" + rnEsc(selectedRoleItem.roleCode) + "'>" +
						"<span>" + rnEsc(selectedRoleItem.roleLabel) + "</span>" +
						"<span class='ml-2 d-inline-flex align-items-center justify-content-center rounded-circle' style='width:18px;height:18px;background:#d7e8ff;color:#1f6fe5;font-size:12px;'>&times;</span>" +
					"</button>"
				);
			}
		} else {
			html.push("<div class='text-muted small'>No roles selected yet.</div>");
		}
		html.push(
							"</div>",
						"</div>",
					"</div>",
				"</div>",
				"<div class='col-lg-8 col-md-7 col-12 mb-3'>",
					"<div class='card h-100 border-0 shadow-sm'>",
						"<div class='card-body p-3'>",
							"<div class='d-flex justify-content-between align-items-center mb-3 flex-wrap'>",
								"<h6 class='mb-2 mb-md-0'>Role List</h6>"
		);
		if (showAllRolesToggle) {
			html.push(
								"<label class='d-inline-flex align-items-center mb-0 cursor-pointer small font-weight-semi-bold text-primary'>",
									"<input type='checkbox' class='mr-2' id='rnTargetRoleAll' " + (allChecked ? "checked" : "") + " />",
									"<span>Select All</span>",
								"</label>"
			);
		}
		html.push(
							"</div>",
							"<div class='mb-3'>",
								"<input type='text' class='form-control' id='rnTargetRoleSearch' placeholder='Search roles...' value='" + rnEsc(releaseNoteState.editorRoleSearchTerm || "") + "' />",
							"</div>",
							"<div class='border rounded p-2' style='max-height: 360px; overflow-y: auto; background: #fcfdff;'>"
		);
		for (var n = 0; n < filteredRoleOptions.length; n++) {
			var item = filteredRoleOptions[n] || {};
			var roleCode = item.roleCode;
			var roleLabel = rnEsc(item.roleLabel || rnRoleLabel(roleCode));
			var isSelected = selectedMap[roleCode] === true;
			html.push(
				"<div class='d-flex justify-content-between align-items-center border rounded px-3 py-3 mb-2 bg-white'>" +
					"<div class='font-weight-semi-bold pr-3'>" + roleLabel + "</div>" +
					"<button type='button' class='btn btn-sm rounded-pill px-4 " + (isSelected ? "btn-outline-secondary" : "btn-primary") + "' data-rn-role-toggle='" + rnEsc(roleCode) + "'>" +
						(isSelected ? "Selected" : "Select") +
					"</button>" +
				"</div>"
			);
		}
		if (!filteredRoleOptions.length) {
			html.push("<div class='text-muted p-3'>No roles match your search.</div>");
		}
		html.push(
							"</div>",
						"</div>",
					"</div>",
				"</div>",
			"</div>"
		);
		$container.html(html.join(""));

		var $allCheckbox = $("#rnTargetRoleAll");
		if ($allCheckbox.length) {
			$allCheckbox.prop("indeterminate", selectedRoleCount > 0 && selectedRoleCount < totalRoleCount);
		}

		$("#rnTargetRoleSearch").off("input").on("input", function () {
			releaseNoteState.editorRoleSearchTerm = String($(this).val() || "");
			var cursorPosition = this.selectionStart;
			rnEditorRenderRoleOptions();
			var $searchInput = $("#rnTargetRoleSearch");
			if ($searchInput.length) {
				$searchInput.focus();
				try {
					$searchInput[0].setSelectionRange(cursorPosition, cursorPosition);
				} catch (e) {}
			}
		});

		$("#rnTargetRoleAll").off("change").on("change", function () {
			var shouldSelectAll = $(this).is(":checked");
			var allRoles = [];
			var allRoleMap = {};
			for (var p = 0; p < roleOptions.length; p++) {
				var option = roleOptions[p] || {};
				var optionRoleCode = rnNormalizeRoleCode(option.roleCode || option.roleName || option.value);
				if (!optionRoleCode || allRoleMap[optionRoleCode]) {
					continue;
				}
				allRoleMap[optionRoleCode] = true;
				allRoles.push(optionRoleCode);
			}
			releaseNoteState.editorSelectedRoles = shouldSelectAll ? allRoles : [];
			rnEditorRenderRoleOptions();
		});

		$container.find("[data-rn-role-toggle]").off("click").on("click", function () {
			var roleCode = rnNormalizeRoleCode($(this).attr("data-rn-role-toggle"));
			if (!roleCode) {
				return;
			}
			var existingRoles = rnEditorGetSelectedRoles();
			var updatedRoles = [];
			var alreadySelected = false;
			var shouldSelect = $(this).text().trim().toLowerCase() !== "selected";
			for (var q = 0; q < existingRoles.length; q++) {
				if (existingRoles[q] === roleCode) {
					alreadySelected = true;
					if (shouldSelect) {
						updatedRoles.push(roleCode);
					}
				} else {
					updatedRoles.push(existingRoles[q]);
				}
			}
			if (shouldSelect && !alreadySelected) {
				updatedRoles.push(roleCode);
			}
			releaseNoteState.editorSelectedRoles = updatedRoles;
			rnEditorRenderRoleOptions();
		});

		$container.find("[data-rn-selected-role]").off("click").on("click", function () {
			var roleCode = rnNormalizeRoleCode($(this).attr("data-rn-selected-role"));
			if (!roleCode) {
				return;
			}
			var existingRoles = rnEditorGetSelectedRoles();
			var updatedRoles = [];
			for (var r = 0; r < existingRoles.length; r++) {
				if (existingRoles[r] !== roleCode) {
					updatedRoles.push(existingRoles[r]);
				}
			}
			releaseNoteState.editorSelectedRoles = updatedRoles;
			rnEditorRenderRoleOptions();
		});
	}

	function rnLoadRoleOptions(callback) {
		if (releaseNoteState.availableRoleOptions && releaseNoteState.availableRoleOptions.length) {
			rnEditorRenderRoleOptions();
			if (typeof callback === "function") {
				callback();
			}
			return;
		}

		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("roles"),
			data: JSON.stringify(rnGetRequestBasePayload()),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to load role list.");
					$("#rnTargetRolesContainer").html("<div class='text-danger'>Unable to load roles.</div>");
					return;
				}
				releaseNoteState.availableRoleOptions = (response.availableRoles || []).slice(0);
				rnEditorRenderRoleOptions();
				if (typeof callback === "function") {
					callback();
				}
			},
			error: function () {
				rnShowToast(0, "Unable to load role list.");
				$("#rnTargetRolesContainer").html("<div class='text-danger'>Unable to load roles.</div>");
			},
		});
	}

	function rnEditorGetImpactModules() {
		var value = String($("#rnImpactModules").val() || "").trim();
		if (!value) {
			return [];
		}
		var parts = value.split(",");
		var map = {};
		var list = [];
		for (var i = 0; i < parts.length; i++) {
			var moduleName = $.trim(parts[i] || "");
			if (!moduleName) {
				continue;
			}
			var key = moduleName.toLowerCase();
			if (!map[key]) {
				map[key] = true;
				list.push(moduleName);
			}
		}
		return list;
	}

	function rnEditorGetContent() {
		try {
			if (releaseNoteState.joditEditor && releaseNoteState.joditEditor.value !== undefined) {
				return String(releaseNoteState.joditEditor.value || "").trim();
			}
			if (window.editor1 && typeof window.editor1.getData === "function") {
				return String(window.editor1.getData() || "").trim();
			}
		} catch (e) {}
		return String($("#releaseNoteContentEditor").val() || "").trim();
	}

	function rnLoadExternalCss(id, href) {
		if (document.getElementById(id)) {
			return;
		}
		var link = document.createElement("link");
		link.id = id;
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	}

	function rnEnsureJoditListStyles() {
		if (document.getElementById("releaseNoteJoditListStyle")) {
			return;
		}
		$("head").append(
			"<style id='releaseNoteJoditListStyle'>" +
				"#releaseNoteAdminForm .jodit-wysiwyg ul,.jodit-container .jodit-wysiwyg ul{list-style:disc outside!important;list-style-type:disc!important;margin:0 0 12px 24px!important;padding-left:22px!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg ol,.jodit-container .jodit-wysiwyg ol{list-style:decimal outside!important;list-style-type:decimal!important;margin:0 0 12px 24px!important;padding-left:22px!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg ul>li,.jodit-container .jodit-wysiwyg ul>li{display:list-item!important;list-style:disc outside!important;list-style-type:disc!important;margin:0 0 6px!important;padding-left:2px!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg ol>li,.jodit-container .jodit-wysiwyg ol>li{display:list-item!important;list-style:decimal outside!important;list-style-type:decimal!important;margin:0 0 6px!important;padding-left:2px!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg li ul,.jodit-container .jodit-wysiwyg li ul{list-style:circle outside!important;list-style-type:circle!important;margin-top:6px!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg li ul>li,.jodit-container .jodit-wysiwyg li ul>li{list-style:circle outside!important;list-style-type:circle!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg li ol,.jodit-container .jodit-wysiwyg li ol{list-style:lower-alpha outside!important;list-style-type:lower-alpha!important;margin-top:6px!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg li::marker,.jodit-container .jodit-wysiwyg li::marker{display:inline!important;color:inherit!important;}" +
				"#releaseNoteAdminForm .jodit-wysiwyg i,#releaseNoteAdminForm .jodit-wysiwyg em,.jodit-container .jodit-wysiwyg i,.jodit-container .jodit-wysiwyg em{font-style:italic!important;}" +
			"</style>"
		);
	}

	function rnLoadExternalScript(id, src) {
		return new Promise(function (resolve, reject) {
			var existingScript = document.getElementById(id);
			if (existingScript && existingScript.getAttribute("data-loaded") === "Y") {
				resolve();
				return;
			}
			if (existingScript) {
				existingScript.addEventListener("load", resolve);
				existingScript.addEventListener("error", reject);
				return;
			}
			var script = document.createElement("script");
			script.id = id;
			script.src = src;
			script.onload = function () {
				script.setAttribute("data-loaded", "Y");
				resolve();
			};
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	function rnLoadJoditAssets() {
		rnEnsureJoditListStyles();
		if (window.Jodit) {
			return Promise.resolve();
		}
		if (!rnJoditLoadPromise) {
			rnLoadExternalCss("releaseNoteJoditCss", RN_JODIT_CSS_URL);
			rnJoditLoadPromise = rnLoadExternalScript("releaseNoteJoditJs", RN_JODIT_JS_URL);
		}
		return rnJoditLoadPromise;
	}

	function rnDestroyJoditEditor() {
		if (!releaseNoteState.joditEditor) {
			return;
		}
		try {
			releaseNoteState.joditEditor.destruct();
		} catch (e) {}
		releaseNoteState.joditEditor = null;
	}

	function rnExecJoditCommand(editor, command) {
		try {
			if (editor && typeof editor.execCommand === "function") {
				editor.execCommand(command);
			}
			if (editor && typeof editor.synchronizeValues === "function") {
				editor.synchronizeValues();
			}
		} catch (e) {}
	}

	function rnGetJoditSelectionNode(editor) {
		try {
			if (editor && editor.s && typeof editor.s.current === "function") {
				var currentNode = editor.s.current();
				if (currentNode) {
					return currentNode;
				}
			}
			var editorRoot = editor && editor.editor ? editor.editor : null;
			var selection = window.getSelection ? window.getSelection() : null;
			if (selection && selection.anchorNode && editorRoot && editorRoot.contains(selection.anchorNode)) {
				return selection.anchorNode;
			}
		} catch (e) {}
		return null;
	}

	function rnIsJoditCommandActive(editor, command) {
		var node = rnGetJoditSelectionNode(editor);
		var editorRoot = editor && editor.editor ? editor.editor : null;
		if (node && node.nodeType === 3) {
			node = node.parentNode;
		}
		while (node && node !== editorRoot) {
			var tagName = String(node.tagName || "").toLowerCase();
			var styleValue = String(node.getAttribute && node.getAttribute("style") || "").toLowerCase();
			if (command === "bold" && (tagName === "b" || tagName === "strong" || /font-weight\s*:\s*(bold|[6-9]00)/i.test(styleValue))) {
				return true;
			}
			if (command === "italic" && (tagName === "i" || tagName === "em" || /font-style\s*:\s*italic/i.test(styleValue))) {
				return true;
			}
			node = node.parentNode;
		}
		return false;
	}

	function rnInitJoditEditor() {
		var editorElement = document.getElementById("releaseNoteContentEditor");
		if (!editorElement) {
			return;
		}
		rnLoadJoditAssets().then(function () {
			var currentElement = document.getElementById("releaseNoteContentEditor");
			if (!currentElement || !window.Jodit) {
				return;
			}
			rnDestroyJoditEditor();
			releaseNoteState.joditEditor = window.Jodit.make(currentElement, {
				height: 380,
				minHeight: 280,
				toolbarAdaptive: false,
				toolbarSticky: false,
				defaultMode: 1,
				askBeforePasteHTML: false,
				askBeforePasteFromWord: false,
				defaultActionOnPaste: "insert_as_html",
				beautifyHTML: false,
				showCharsCounter: false,
				showWordsCounter: false,
				showXPathInStatusbar: false,
				buttons: [
					"paragraph", "|",
					"rnBold", "rnItalic", "link", "|",
					"fontsize", "brush", "|",
					"ul", "ol", "outdent", "indent", "|",
					"image", "table", "|",
					"undo", "redo"
				],
				controls: {
					rnBold: {
						icon: "bold",
						tooltip: "Bold",
						exec: function (editor) {
							rnExecJoditCommand(editor, "bold");
						},
						isActive: function (editor) {
							return rnIsJoditCommandActive(editor, "bold");
						}
					},
					rnItalic: {
						icon: "italic",
						tooltip: "Italic",
						exec: function (editor) {
							rnExecJoditCommand(editor, "italic");
						},
						isActive: function (editor) {
							return rnIsJoditCommandActive(editor, "italic");
						}
					},
					fontsize: {
						list: {
							"10px": "Tiny",
							"12px": "Small",
							"14px": "Default",
							"22px": "Big",
							"32px": "Huge"
						}
					}
				},
				cleanHTML: {
					removeEmptyElements: false,
					fillEmptyParagraph: false
				},
				uploader: {
					insertImageAsBase64URI: true
				}
			});
			releaseNoteState.joditEditor.value = String($(currentElement).val() || "");
		}).catch(function () {
			rnShowToast(0, "Unable to load release note editor. Textarea fallback is available.");
		});
	}

	function rnMergeInlineStyle(element, styleText) {
		if (!element || !styleText) {
			return;
		}
		var existingStyle = String(element.getAttribute("style") || "").trim();
		if (existingStyle && existingStyle.charAt(existingStyle.length - 1) !== ";") {
			existingStyle += ";";
		}
		element.setAttribute("style", styleText + existingStyle);
	}

	function rnAppendInlineStyle(element, styleText) {
		if (!element || !styleText) {
			return;
		}
		var existingStyle = String(element.getAttribute("style") || "").trim();
		if (existingStyle && existingStyle.charAt(existingStyle.length - 1) !== ";") {
			existingStyle += ";";
		}
		element.setAttribute("style", existingStyle + styleText);
	}

	function rnApplyStyleToTags(root, selector, styleText) {
		var nodes = root.querySelectorAll(selector);
		for (var i = 0; i < nodes.length; i++) {
			rnMergeInlineStyle(nodes[i], styleText);
		}
	}

	function rnApplyStyleToClass(root, className, styleText) {
		var nodes = root.querySelectorAll("." + className);
		for (var i = 0; i < nodes.length; i++) {
			rnMergeInlineStyle(nodes[i], styleText);
		}
	}

	function rnRemoveUnsafeMailHtml(root) {
		var unsafeNodes = root.querySelectorAll("script, style");
		for (var i = unsafeNodes.length - 1; i >= 0; i--) {
			unsafeNodes[i].parentNode.removeChild(unsafeNodes[i]);
		}

		var allNodes = root.querySelectorAll("*");
		for (var j = 0; j < allNodes.length; j++) {
			var attrs = allNodes[j].attributes;
			for (var k = attrs.length - 1; k >= 0; k--) {
				if (/^on/i.test(attrs[k].name)) {
					allNodes[j].removeAttribute(attrs[k].name);
				}
			}
		}
	}

	function rnHslToHex(h, s, l) {
		var hue = (((parseFloat(h) % 360) + 360) % 360) / 360;
		var saturation = Math.max(0, Math.min(100, parseFloat(s))) / 100;
		var lightness = Math.max(0, Math.min(100, parseFloat(l))) / 100;
		var r;
		var g;
		var b;
		if (saturation === 0) {
			r = g = b = lightness;
		} else {
			var q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
			var p = 2 * lightness - q;
			var hueToRgb = function (t) {
				if (t < 0) {
					t += 1;
				}
				if (t > 1) {
					t -= 1;
				}
				if (t < 1 / 6) {
					return p + (q - p) * 6 * t;
				}
				if (t < 1 / 2) {
					return q;
				}
				if (t < 2 / 3) {
					return p + (q - p) * (2 / 3 - t) * 6;
				}
				return p;
			};
			r = hueToRgb(hue + 1 / 3);
			g = hueToRgb(hue);
			b = hueToRgb(hue - 1 / 3);
		}
		var toHex = function (value) {
			var hex = Math.round(value * 255).toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		};
		return "#" + toHex(r) + toHex(g) + toHex(b);
	}

	function rnNormalizeMailCssColors(root) {
		var nodes = root.querySelectorAll("[style]");
		var hslPattern = /hsl\(\s*([0-9.]+)(?:deg)?\s*,\s*([0-9.]+)%\s*,\s*([0-9.]+)%\s*\)/gi;
		for (var i = 0; i < nodes.length; i++) {
			var styleText = String(nodes[i].getAttribute("style") || "");
			styleText = styleText.replace(hslPattern, function (match, h, s, l) {
				return rnHslToHex(h, s, l);
			});
			nodes[i].setAttribute("style", styleText);
		}
	}

	function rnGetListDepth(listElement) {
		var depth = 0;
		var parent = listElement.parentElement;
		while (parent) {
			if (parent.tagName && /^(UL|OL)$/i.test(parent.tagName)) {
				depth++;
			}
			parent = parent.parentElement;
		}
		return depth;
	}

	function rnApplyNestedListMailStyles(root) {
		var lists = root.querySelectorAll("ul, ol");
		for (var i = 0; i < lists.length; i++) {
			var list = lists[i];
			var depth = rnGetListDepth(list);
			var marginLeft = 22 + (depth * 18);
			var isOrdered = list.tagName.toLowerCase() === "ol";
			var listType = isOrdered ? (depth > 0 ? "lower-alpha" : "decimal") : (depth % 3 === 0 ? "disc" : (depth % 3 === 1 ? "circle" : "square"));
			list.setAttribute("type", isOrdered ? (depth > 0 ? "a" : "1") : listType);
			rnAppendInlineStyle(list, "margin:0 0 12px " + marginLeft + "px!important;padding-left:22px!important;list-style:" + listType + " outside!important;list-style-type:" + listType + "!important;list-style-position:outside!important;");

			var childItems = list.children || [];
			for (var j = 0; j < childItems.length; j++) {
				if (childItems[j].tagName && childItems[j].tagName.toLowerCase() === "li") {
					rnAppendInlineStyle(childItems[j], "display:list-item!important;list-style:" + listType + " outside!important;list-style-type:" + listType + "!important;margin:0 0 6px!important;padding-left:2px!important;");
				}
			}
		}

		var items = root.querySelectorAll("li");
		for (var k = 0; k < items.length; k++) {
			rnAppendInlineStyle(items[k], "display:list-item!important;margin:0 0 6px!important;padding-left:2px!important;");
		}
	}

	function rnStripEditorOnlyAttributes(root) {
		var nodes = root.querySelectorAll("*");
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].removeAttribute("class");
			nodes[i].removeAttribute("contenteditable");
			nodes[i].removeAttribute("data-cke-filler");
		}
	}

	function rnBuildEmailSafeContent(rawContent) {
		var content = String(rawContent || "").trim();
		if (!content) {
			return "";
		}

		var wrapper = document.createElement("div");
		wrapper.innerHTML = content;
		rnRemoveUnsafeMailHtml(wrapper);

		rnApplyStyleToClass(wrapper, "text-tiny", "font-size:10px;line-height:1.45;");
		rnApplyStyleToClass(wrapper, "text-small", "font-size:12px;line-height:1.5;");
		rnApplyStyleToClass(wrapper, "text-big", "font-size:22px;line-height:1.35;");
		rnApplyStyleToClass(wrapper, "text-huge", "font-size:32px;line-height:1.2;");
		rnApplyStyleToClass(wrapper, "marker-yellow", "background-color:#fef08a;");
		rnApplyStyleToClass(wrapper, "marker-green", "background-color:#bbf7d0;");
		rnApplyStyleToClass(wrapper, "pen-red", "color:#dc2626;");
		rnApplyStyleToClass(wrapper, "pen-green", "color:#16a34a;");

		rnApplyStyleToTags(wrapper, "h1", "font-family:Arial,Helvetica,sans-serif;font-size:26px;line-height:1.25;color:#111827;margin:0 0 14px;font-weight:700;");
		rnApplyStyleToTags(wrapper, "h2", "font-family:Arial,Helvetica,sans-serif;font-size:22px;line-height:1.3;color:#111827;margin:0 0 12px;font-weight:700;");
		rnApplyStyleToTags(wrapper, "h3", "font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:1.35;color:#111827;margin:0 0 10px;font-weight:700;");
		rnApplyStyleToTags(wrapper, "h4", "font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.4;color:#111827;margin:0 0 10px;font-weight:700;");
		rnApplyStyleToTags(wrapper, "p", "font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#1f2937;margin:0 0 12px;");
		rnApplyStyleToTags(wrapper, "div", "font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#1f2937;");
		rnApplyStyleToTags(wrapper, "span", "font-family:Arial,Helvetica,sans-serif;");
		rnApplyStyleToTags(wrapper, "i", "font-style:italic!important;");
		rnApplyStyleToTags(wrapper, "em", "font-style:italic!important;");
		rnApplyStyleToTags(wrapper, "ul", "font-family:Arial,Helvetica,sans-serif!important;font-size:14px!important;line-height:1.65!important;color:#1f2937!important;margin:0 0 12px 22px!important;padding-left:18px!important;list-style-type:disc!important;list-style-position:outside!important;");
		rnApplyStyleToTags(wrapper, "ol", "font-family:Arial,Helvetica,sans-serif!important;font-size:14px!important;line-height:1.65!important;color:#1f2937!important;margin:0 0 12px 22px!important;padding-left:18px!important;list-style-type:decimal!important;list-style-position:outside!important;");
		rnApplyStyleToTags(wrapper, "li", "font-family:Arial,Helvetica,sans-serif!important;font-size:14px!important;line-height:1.65!important;color:#1f2937!important;display:list-item!important;margin:0 0 6px!important;padding-left:2px!important;");
		rnApplyStyleToTags(wrapper, "blockquote", "font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#374151;margin:0 0 12px;padding:10px 14px;border-left:4px solid #d1d5db;background:#f9fafb;");
		rnApplyStyleToTags(wrapper, "a", "color:#2563eb;text-decoration:underline;");
		rnApplyStyleToTags(wrapper, "table", "border-collapse:collapse;width:100%;margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#1f2937;");
		rnApplyStyleToTags(wrapper, "th", "border:1px solid #d1d5db;padding:8px 10px;background:#f3f4f6;color:#111827;font-weight:700;text-align:left;");
		rnApplyStyleToTags(wrapper, "td", "border:1px solid #d1d5db;padding:8px 10px;color:#1f2937;");
		rnApplyStyleToTags(wrapper, "img", "max-width:100%;height:auto;border:0;display:block;");
		rnApplyStyleToTags(wrapper, "figure", "margin:0 0 14px;padding:0;");
		rnApplyStyleToTags(wrapper, "figcaption", "font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#6b7280;margin-top:6px;text-align:center;");
		rnApplyNestedListMailStyles(wrapper);
		rnNormalizeMailCssColors(wrapper);
		rnStripEditorOnlyAttributes(wrapper);

		return "<div style='font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#1f2937;'>" + wrapper.innerHTML + "</div>";
	}

	function rnEditorSetContent(content) {
		try {
			if (releaseNoteState.joditEditor && releaseNoteState.joditEditor.value !== undefined) {
				releaseNoteState.joditEditor.value = content || "";
				return;
			}
			if (window.editor1 && typeof window.editor1.setData === "function") {
				window.editor1.setData(content || "");
				return;
			}
		} catch (e) {}
		$("#releaseNoteContentEditor").val(content || "");
	}

	function rnEditorRenderAttachments() {
		if (!releaseNoteState.editorAttachments || !releaseNoteState.editorAttachments.length) {
			$("#rnAttachmentCountBadge").text("0");
			$("#rnAttachmentList").html("No attachment uploaded.");
			releaseNoteState.editorPreviewIndex = -1;
			rnRenderInlineAttachmentPreview("rnAttachmentPreviewTitle", "rnAttachmentPreviewBody", null, "No attachment selected.");
			return;
		}

		$("#rnAttachmentCountBadge").text(String(releaseNoteState.editorAttachments.length));
		var html = ["<div>"];
		for (var i = 0; i < releaseNoteState.editorAttachments.length; i++) {
			var item = releaseNoteState.editorAttachments[i] || {};
			var name = rnEsc(rnGetAttachmentName(item, i));
			var type = rnResolveAttachmentType(item);
			var isActive = releaseNoteState.editorPreviewIndex === i;
			html.push(
				"<div class='border rounded p-3 mb-2 " + (isActive ? "shadow-sm" : "") + "' style='background:" + (isActive ? "#edf5ff" : "#fff") + ";border-color:" + (isActive ? "#b7d3ff" : "#dee2e6") + ";' data-rn-attachment-index='" + i + "'>" +
					"<div class='d-flex align-items-start'>" +
						"<div class='mr-3 d-flex align-items-center justify-content-center rounded' style='width:42px;height:42px;background:#f3f7ff;color:#2a74e6;flex:0 0 42px;'>" +
							"<i class='fa " + rnAttachmentTypeIcon(type) + "'></i>" +
						"</div>" +
						"<div class='flex-grow-1' style='min-width:0;'>" +
							"<div class='font-weight-semi-bold text-truncate mb-2'>" + name + "</div>" +
							"<div class='d-flex justify-content-between align-items-center flex-wrap'>" +
								"<span class='badge " + rnAttachmentTypeClass(type) + " px-2 py-1'>" + rnEsc(type) + "</span>" +
								"<div class='mt-2 mt-sm-0'>" +
									"<button class='btn btn-sm " + (isActive ? "btn-primary" : "btn-outline-primary") + " mr-2 rounded-pill px-3' type='button' onclick='releaseNoteEditorPreviewAttachment(" + i + ")'>Preview</button>" +
									"<button class='btn btn-sm btn-outline-danger rounded-pill px-3' type='button' onclick='releaseNoteEditorRemoveAttachment(" + i + ")'>Remove</button>" +
								"</div>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>"
			);
		}
		html.push("</div>");
		$("#rnAttachmentList").html(html.join(""));

		if (releaseNoteState.editorPreviewIndex < 0 || releaseNoteState.editorPreviewIndex >= releaseNoteState.editorAttachments.length) {
			releaseNoteState.editorPreviewIndex = 0;
		}
		rnSetAttachmentActive("#rnAttachmentList", releaseNoteState.editorPreviewIndex);
		rnRenderInlineAttachmentPreview(
			"rnAttachmentPreviewTitle",
			"rnAttachmentPreviewBody",
			releaseNoteState.editorAttachments[releaseNoteState.editorPreviewIndex],
			"No attachment selected."
		);
	}

	function rnEditorMergeAttachments(newAttachments) {
		if (!newAttachments || !newAttachments.length) {
			return;
		}
		if (!releaseNoteState.editorAttachments) {
			releaseNoteState.editorAttachments = [];
		}
		for (var i = 0; i < newAttachments.length; i++) {
			var item = newAttachments[i] || {};
			var fileName = String(item.fileName || "").trim();
			if (!fileName) {
				continue;
			}
			var exists = false;
			for (var j = 0; j < releaseNoteState.editorAttachments.length; j++) {
				if (String((releaseNoteState.editorAttachments[j] || {}).fileName || "") === fileName) {
					exists = true;
					break;
				}
			}
			if (!exists) {
				releaseNoteState.editorAttachments.push(item);
			}
		}
	}

	function rnEditorValidate(isDraft) {
		var title = String($("#rnTitle").val() || "").trim();
		var content = rnEditorGetContent();
		var impactModules = rnEditorGetImpactModules();
		var targetRoles = rnEditorGetSelectedRoles();
		releaseNoteState.editorSelectedRoles = targetRoles.slice(0);
		if (!title) {
			rnShowToast(0, "Release note title is required.");
			return false;
		}
		if (!content) {
			rnShowToast(0, "Release note content is required.");
			return false;
		}
		if (!isDraft && impactModules.length === 0) {
			rnShowToast(0, "Impact module is required before publish.");
			return false;
		}
		if (!isDraft && targetRoles.length === 0) {
			rnShowToast(0, "Select at least one target role before publish.");
			return false;
		}
		return true;
	}

	function rnEditorUploadAttachments() {
		var input = $("#rnAttachmentInput")[0];
		if (!input || !input.files || !input.files.length) {
			rnShowToast(0, "Please choose at least one file to upload.");
			return false;
		}

		var formData = new FormData();
		for (var i = 0; i < input.files.length; i++) {
			formData.append("file" + i, input.files[i]);
		}

		$.ajax({
			type: "POST",
			url: rnApiUrl("upload/" + (window.UNIQUEUUID || "")),
			data: formData,
			processData: false,
			contentType: false,
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to upload attachment.");
					return;
				}
				rnEditorMergeAttachments(response.attachments || []);
				rnEditorRenderAttachments();
				$("#rnAttachmentInput").val("");
				rnShowToast(1, response.message || response.MESSAGE || "Attachment uploaded successfully.");
			},
			error: function () {
				rnShowToast(0, "Unable to upload attachment.");
			},
		});
		return false;
	}

	function rnEditorSave(isDraft) {
		if (!rnEditorValidate(isDraft)) {
			return false;
		}

		var content = rnEditorGetContent();
		var payload = rnGetRequestBasePayload();
		payload.releaseNoteId = rnToInt(releaseNoteState.currentReleaseNoteId, 0);
		payload.versionLabel = String($("#rnVersionLabel").val() || "").trim();
		payload.title = String($("#rnTitle").val() || "").trim();
		payload.impactModules = rnEditorGetImpactModules();
		payload.targetRoles = rnEditorGetSelectedRoles();
		payload.summary = String($("#rnSummary").val() || "").trim();
		payload.content = rnBuildEmailSafeContent(content);
		payload.attachments = releaseNoteState.editorAttachments || [];
		payload.isDraft = isDraft === true;
		payload.publish = isDraft !== true;
		payload.status = isDraft ? "DRAFT" : "PUBLISHED";

		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("save"),
			data: JSON.stringify(payload),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to save release note.");
					return;
				}

				var releaseNote = response.releaseNote || {};
				if (rnToInt(releaseNote.releaseNoteId, 0) > 0) {
					releaseNoteState.currentReleaseNoteId = rnToInt(releaseNote.releaseNoteId, 0);
					$("#rnEditorHeading").text("Edit Release Note");
				}
				if (Object.prototype.hasOwnProperty.call(releaseNote, "attachments")) {
					releaseNoteState.editorAttachments = (releaseNote.attachments || []).slice(0);
					rnEditorRenderAttachments();
				}
				if (Object.prototype.hasOwnProperty.call(releaseNote, "targetRoles")) {
					rnEditorSetSelectedRoles(releaseNote.targetRoles || []);
				}

				rnShowToast(1, response.message || response.MESSAGE || "Release note saved successfully.");
				if (!isDraft) {
					setTimeout(function () {
						rnBackToAdminList();
					}, 700);
				}
			},
			error: function () {
				rnShowToast(0, "Unable to save release note.");
			},
		});
		return false;
	}

	function rnEditorPreviewAttachment(index) {
		var idx = rnToInt(index, -1);
		if (idx < 0 || idx >= (releaseNoteState.editorAttachments || []).length) {
			return;
		}
		releaseNoteState.editorPreviewIndex = idx;
		rnSetAttachmentActive("#rnAttachmentList", idx);
		rnEditorRenderAttachments();
	}

	function rnEditorRemoveAttachment(index) {
		var idx = rnToInt(index, -1);
		if (idx < 0 || idx >= (releaseNoteState.editorAttachments || []).length) {
			return;
		}
		releaseNoteState.editorAttachments.splice(idx, 1);
		if (releaseNoteState.editorPreviewIndex >= releaseNoteState.editorAttachments.length) {
			releaseNoteState.editorPreviewIndex = releaseNoteState.editorAttachments.length - 1;
		}
		rnEditorRenderAttachments();
	}

	function rnEditorReset() {
		$("#rnVersionLabel").val("");
		$("#rnTitle").val("");
		$("#rnImpactModules").val("");
		$("#rnSummary").val("");
		$("#rnAttachmentInput").val("");
		rnEditorSetContent("");
		releaseNoteState.editorAttachments = [];
		releaseNoteState.editorPreviewIndex = -1;
		releaseNoteState.editorRoleSearchTerm = "";
		rnEditorSetSelectedRoles([]);
		rnEditorRenderAttachments();
	}

	function rnEditorFillFromDetail(note) {
		note = note || {};
		$("#rnEditorHeading").text("Edit Release Note");
		$("#rnVersionLabel").val(note.versionLabel || "");
		$("#rnTitle").val(note.title || "");
		$("#rnImpactModules").val(note.impactModule || "");
		$("#rnSummary").val(note.summary || "");
		rnEditorSetContent(note.content || "");
		releaseNoteState.editorAttachments = (note.attachments || []).slice(0);
		releaseNoteState.editorPreviewIndex = releaseNoteState.editorAttachments.length ? 0 : -1;
		rnEditorSetSelectedRoles(note.targetRoles || []);
		rnEditorRenderAttachments();
	}

	function rnEditorLoadDetailForEdit(releaseNoteId) {
		rnCallDetailApi(releaseNoteId, false, function (response) {
			rnEditorFillFromDetail(response.releaseNote || {});
		});
	}

	function rnInitEditorScreen() {
		rnDestroyJoditEditor();
		releaseNoteState.editorAttachments = [];
		releaseNoteState.editorPreviewIndex = -1;
		releaseNoteState.editorSelectedRoles = [];
		releaseNoteState.editorRoleSearchTerm = "";
		rnEditorRenderAttachments();
		rnEditorRenderRoleOptions();
		rnEditorSetContent("");
		rnInitJoditEditor();
		rnLoadRoleOptions();
		if (rnToInt(releaseNoteState.currentReleaseNoteId, 0) > 0) {
			rnEditorLoadDetailForEdit(releaseNoteState.currentReleaseNoteId);
		}
	}

	function rnUserRenderBadge() {
		var count = 0;
		for (var i = 0; i < releaseNoteState.userReleaseCache.length; i++) {
			if (releaseNoteState.userReleaseCache[i] && releaseNoteState.userReleaseCache[i].isNew) {
				count++;
			}
		}
		if (count > 0) {
			$("#rnUserNewCountBadge").text(count + " NEW").show();
		} else {
			$("#rnUserNewCountBadge").hide();
		}
	}

	function rnUserRenderLatest(latest) {
		if (!latest || !rnToInt(latest.releaseNoteId, 0)) {
			$("#rnLatestContainer").html("<div class='text-muted'>No published release note available.</div>");
			return;
		}
		var noteId = rnToInt(latest.releaseNoteId, 0);
		var newBadge = latest.isNew ? "<span class='badge badge-danger ml-2'>NEW</span>" : "";
		var publishedDate = rnResolvePublishedDate(latest);
		var html = "" +
			"<div class='d-flex justify-content-between align-items-start'>" +
				"<div>" +
					"<h5 class='mb-1'>" + rnEsc(latest.title || "Untitled Release") + newBadge + "</h5>" +
					"<div class='text-muted small mb-1'>Version: " + rnEsc(latest.versionLabel || "N/A") + "</div>" +
					"<div class='text-muted small mb-2'>Published: " + rnEsc(publishedDate) + "</div>" +
				"</div>" +
				"<div>" +
					"<button class='btn btn-primary btn-sm' type='button' onclick='releaseNoteUserOpenDetail(" + noteId + ", true)'>" +
						"<i class='fa fa-eye'></i>&nbsp;View" +
					"</button>" +
				"</div>" +
			"</div>" +
			"<div class='mt-2'><b>Impact Module:</b> " + rnEsc(latest.impactModule || "N/A") + "</div>" +
			"<div class='mt-2'>" + rnEsc(rnStripHtml(latest.contentPreview || latest.summary || "")) + "</div>" +
			"<div class='mt-2 text-muted small'>Attachments: " + rnEsc((latest.attachments || []).length) + "</div>";
		$("#rnLatestContainer").html(html);
	}

	function rnUserRenderPast(pastNotes) {
		if (!pastNotes || !pastNotes.length) {
			$("#rnPastContainer").html("<div class='text-muted'>No past release notes available.</div>");
			return;
		}
		var html = ["<div class='table-responsive'><table class='table table-bordered table-striped'><thead><tr class='bg-light'><th>S.No</th><th>Version</th><th>Title</th><th>Impact Module</th><th>Published Date</th><th>Action</th></tr></thead><tbody>"];
		for (var i = 0; i < pastNotes.length; i++) {
			var note = pastNotes[i] || {};
			var noteId = rnToInt(note.releaseNoteId, 0);
			var tag = note.isNew ? " <span class='badge badge-danger'>NEW</span>" : "";
			var publishedDate = rnResolvePublishedDate(note);
			html.push(
				"<tr>" +
					"<td>" + (i + 1) + "</td>" +
					"<td>" + rnEsc(note.versionLabel || "N/A") + "</td>" +
					"<td>" + rnEsc(note.title || "") + tag + '<div class="small text-muted">' + rnEsc(rnStripHtml(note.contentPreview || "")) + "</div></td>" +
					"<td>" + rnEsc(note.impactModule || "N/A") + "</td>" +
					"<td>" + rnEsc(publishedDate) + "</td>" +
					"<td><button type='button' class='btn btn-sm btn-outline-primary' onclick='releaseNoteUserOpenDetail(" + noteId + ", true)'><i class='fa fa-eye'></i>&nbsp;View</button></td>" +
				"</tr>"
			);
		}
		html.push("</tbody></table></div>");
		$("#rnPastContainer").html(html.join(""));
	}

	function rnUserRenderAttachmentPreview(attachments) {
		if (!attachments || !attachments.length) {
			return "<p class='mb-0'>No attachment</p>";
		}
		var html = [
			"<div class='row'>",
				"<div class='col-lg-4 col-md-5 mb-2'>",
					"<div class='small text-muted mb-2'>Attachments</div>",
					"<div class='list-group' id='rnUserDetailAttachmentList'>"
		];
		for (var i = 0; i < attachments.length; i++) {
			var item = attachments[i] || {};
			var type = rnResolveAttachmentType(item);
			var name = rnEsc(rnGetAttachmentName(item, i));
			html.push(
				"<button type='button' class='list-group-item list-group-item-action p-2' data-rn-attachment-index='" + i + "' onclick='releaseNoteUserPreviewAttachment(" + i + ")'>" +
					"<div class='d-flex align-items-center'>" +
						"<i class='fa " + rnAttachmentTypeIcon(type) + " mr-2 text-muted'></i>" +
						"<div class='flex-grow-1' style='min-width:0;'>" +
							"<div class='font-weight-semi-bold text-truncate'>" + name + "</div>" +
							"<span class='badge " + rnAttachmentTypeClass(type) + "'>" + rnEsc(type) + "</span>" +
						"</div>" +
					"</div>" +
				"</button>"
			);
		}
		html.push(
					"</div>",
				"</div>",
				"<div class='col-lg-8 col-md-7 mb-2'>"
		);
		html.push(
			"<div class='card mb-0 h-100'>" +
				"<div class='card-body p-3'>" +
					"<div id='rnUserDetailPreviewTitle' class='small text-muted mb-2'>Select an attachment to preview.</div>" +
					"<div id='rnUserDetailPreviewBody'><div class='text-muted'>Choose an attachment from the left list.</div></div>" +
				"</div>" +
			"</div>" +
				"</div>" +
			"</div>"
		);
		return html.join("");
	}

	function rnUserMarkAsReadInCache(releaseNoteId) {
		var noteId = rnToInt(releaseNoteId, 0);
		for (var i = 0; i < releaseNoteState.userReleaseCache.length; i++) {
			if (rnToInt((releaseNoteState.userReleaseCache[i] || {}).releaseNoteId, 0) === noteId) {
				releaseNoteState.userReleaseCache[i].isNew = false;
			}
		}
	}

	function rnUserRenderFromCache() {
		var latest = releaseNoteState.userReleaseCache.length > 0 ? releaseNoteState.userReleaseCache[0] : null;
		var past = releaseNoteState.userReleaseCache.length > 1 ? releaseNoteState.userReleaseCache.slice(1) : [];
		rnUserRenderLatest(latest);
		rnUserRenderPast(past);
		rnUserRenderBadge();
	}

	function rnLoadUserReleaseNotes() {
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: rnApiUrl("user/list"),
			data: JSON.stringify(rnGetRequestBasePayload()),
			dataType: "json",
			success: function (rawResponse) {
				var response = rnNormalizeResponse(rawResponse);
				if (rnHandleSession(response)) {
					return;
				}
				if (!rnIsSuccess(response)) {
					rnShowToast(0, response.message || response.MESSAGE || "Unable to load release notes.");
					releaseNoteState.userReleaseCache = [];
					rnUserRenderFromCache();
					return;
				}
				releaseNoteState.userReleaseCache = (response.releaseNotes || []).slice(0);
				rnUserRenderFromCache();
			},
			error: function () {
				rnShowToast(0, "Unable to load release notes.");
				releaseNoteState.userReleaseCache = [];
				rnUserRenderFromCache();
			},
		});
	}

	function rnUserOpenDetail(releaseNoteId, markAsRead) {
		if (rnToInt(releaseNoteId, 0) <= 0) {
			return;
		}
		rnCallViewApi(releaseNoteId, markAsRead === true, function (response) {
			var note = response.releaseNoteView || {};
			releaseNoteState.userDetailAttachments = (note.attachments || []).slice(0);
			releaseNoteState.userDetailPreviewIndex = releaseNoteState.userDetailAttachments.length ? 0 : -1;
			var publishedDate = rnResolvePublishedDate({ publishedDateUtc: note.publishedDateUtc });
			var detailHtml = "" +
				"<div class='card mb-3'>" +
					"<div class='card-body p-3'>" +
						"<div class='mb-2'><b>Version:</b> " + rnEsc(note.versionLabel || "N/A") + "</div>" +
						"<div class='mb-2'><b>Impact Module:</b> " + rnEsc(note.impactModule || "N/A") + "</div>" +
						"<div class='mb-2'><b>Target Roles:</b> " + rnEsc(note.targetRolesText || "All Roles") + "</div>" +
						"<div class='mb-2'><b>Published Date:</b> " + rnEsc(publishedDate) + "</div>" +
						"<div class='mb-2'><b>Updated Date:</b> " + rnEsc(rnFormatUtcDateTime(note.updatedDateUtc)) + "</div>" +
						"<div class='mb-2'><b>Summary:</b><div class='mt-1'>" + rnEsc(note.summary || "N/A") + "</div></div>" +
						"<div class='mb-0'><b>Description:</b><div class='mt-1'>" + (note.description || "<span class='text-muted'>N/A</span>") + "</div></div>" +
					"</div>" +
				"</div>" +
				"<h6>Attachments</h6>" +
				rnUserRenderAttachmentPreview(note.attachments || []);
			$("#rnUserDetailBody").html(detailHtml);
			$("#releaseNoteUserDetailModal .modal-title").text(note.title || "Release Note View");
			$("#releaseNoteUserDetailModal").modal("show");
			if (releaseNoteState.userDetailAttachments.length) {
				releaseNoteUserPreviewAttachment(0);
			}

			if (markAsRead === true) {
				rnUserMarkAsReadInCache(releaseNoteId);
				rnUserRenderFromCache();
			}
		});
	}

	function rnUserPreviewAttachment(index) {
		var idx = rnToInt(index, -1);
		if (idx < 0 || idx >= (releaseNoteState.userDetailAttachments || []).length) {
			return;
		}
		releaseNoteState.userDetailPreviewIndex = idx;
		rnSetAttachmentActive("#rnUserDetailAttachmentList", idx);
		rnRenderInlineAttachmentPreview(
			"rnUserDetailPreviewTitle",
			"rnUserDetailPreviewBody",
			releaseNoteState.userDetailAttachments[idx],
			"No attachment selected."
		);
	}

	function rnRenderByMode(mode) {
		releaseNoteState.mode = mode;
		var containerSelector = rnGetRenderContainerSelector();
		if (mode === "admin-list") {
			$(containerSelector).html(getReleaseNoteAdminListContent("Release Notes (Admin)"));
			rnLoadAdminReleaseNotes();
			if($("#releaseNoteStyle").length<1){
				$("head").append(
					`<style id="releaseNoteStyle">
						#rnAdminDetailBody ul{padding-left:16px !important;}
						#rnAdminDetailBody ul li{list-style-type:disc !important;line-height:24px}
						.table table{border-collapse:collapse;}
					</style>`)
			}
			return;
		}
		if (mode === "admin-editor") {
			var title = rnToInt(releaseNoteState.currentReleaseNoteId, 0) > 0 ? "Edit Release Note" : "Create Release Note";
			$(containerSelector).html(getReleaseNoteAdminEditorContent(title));
			rnInitEditorScreen();
			return;
		}
		$(containerSelector).html(getReleaseNoteUserListContent("Release Notes"));
		rnLoadUserReleaseNotes();
	}

	window.renderReleaseNoteDashboardPage = function (pageNo, moduleId, roleAndModule, extraParam) {
		releaseNoteState.renderInAdditional = rnShouldRenderInAdditional(extraParam);
		if (releaseNoteState.renderInAdditional) {
			showAndHideDashboardAndAdditionalContent("additional");
		} else {
			showAndHideDashboardAndAdditionalContent("main");
			$("#dashboardContentInHTMLAdditional").html("");
			$("#dashboardContentInHTML").show();
		}

		releaseNoteState.moduleId = rnToInt(moduleId, 0);
		releaseNoteState.isAdmin = rnCheckAdminRole();
		releaseNoteState.currentReleaseNoteId = rnParseReleaseNoteId(extraParam);

		var mode = rnResolveMode(pageNo, releaseNoteState.isAdmin);
		rnRenderByMode(mode);
	};

	window.releaseNoteAdminRefresh = function () {
		rnLoadAdminReleaseNotes();
	};

	window.releaseNoteAdminOpenEditor = function (releaseNoteId) {
		rnOpenAdminEditor(releaseNoteId);
	};

	window.releaseNoteAdminOpenDetail = function (releaseNoteId) {
		rnShowAdminDetail(releaseNoteId);
	};

	// window.releaseNoteAdminSendMail = function (releaseNoteId, btnEl) {
	// 	rnAdminSendMail(releaseNoteId, btnEl);
	// };
	window.releaseNoteAdminOpenSendMailModal = function (releaseNoteId) {
		rnOpenSendMailModal(releaseNoteId);
	};
	window.releaseNoteAdminSubmitSendMail = function () {
		rnSubmitSendMail();
	};

	window.releaseNoteAdminPreviewAttachment = function (index) {
		rnAdminPreviewAttachment(index);
	};

	window.releaseNoteBackToAdminList = function () {
		return rnBackToAdminList();
	};

	window.releaseNoteEditorUpload = function () {
		return rnEditorUploadAttachments();
	};

	window.releaseNoteEditorSaveDraft = function () {
		return rnEditorSave(true);
	};

	window.releaseNoteEditorPublish = function () {
		return rnEditorSave(false);
	};

	window.releaseNoteEditorPreviewAttachment = function (index) {
		rnEditorPreviewAttachment(index);
	};

	window.releaseNoteEditorRemoveAttachment = function (index) {
		rnEditorRemoveAttachment(index);
	};

	window.releaseNoteEditorReset = function () {
		rnEditorReset();
	};

	window.releaseNoteUserRefresh = function () {
		rnLoadUserReleaseNotes();
	};

	window.releaseNoteUserBack = function () {
		if (releaseNoteState.renderInAdditional) {
			$("#dashboardContentInHTMLAdditional").html("").hide();
			$("#dashboardContentInHTML").show();
			return;
		}
		if (typeof callDashboardPageSchool === "function") {
			callDashboardPageSchool(String(releaseNoteState.moduleId || 0), "dashboard");
		}
	};

	window.releaseNoteUserOpenDetail = function (releaseNoteId, markAsRead) {
		rnUserOpenDetail(releaseNoteId, markAsRead);
	};

	window.releaseNoteUserPreviewAttachment = function (index) {
		rnUserPreviewAttachment(index);
	};
})();
