var mailTesterState = {
	templates: [],
	preview: null,
	activeTab: "rendered",
	selfEmail: "",
};

function emailTemplateTesterPageLoadEvent(){
	mailTesterSetTabs("rendered");
	mailTesterState.selfEmail = String($("#mailTesterSelfEmail").val() || "").trim();
	mailTesterPrefillRecipient();
	mailTesterFetchTemplates();

	$("#mailTesterPreviewBtn")
		.off("click")
		.on("click", function () {
			mailTesterFetchPreview();
		});

	$("#mailTesterApplyOverridesBtn")
		.off("click")
		.on("click", function () {
			mailTesterFetchPreview({
				includeOverrides: true,
				subject: $("#mailTesterSubject").val() || "",
			});
		});

	$("#mailTesterTemplate")
		.off("change")
		.on("change", function () {
			if ($(this).val()) {
				mailTesterFetchPreview();
			} else {
				mailTesterClearMeta();
			}
		});

	$("#mailTesterSendBtn")
		.off("click")
		.on("click", function () {
			mailTesterSend();
		});

	$("#mailTesterSendSelfBtn")
		.off("click")
		.on("click", function () {
			mailTesterSendToMyself();
		});

	$("#mailTesterResetBtn")
		.off("click")
		.on("click", function () {
			mailTesterReset();
		});

	$("#mailTesterLoadRangeBtn")
		.off("click")
		.on("click", function () {
			mailTesterLoadRange();
		});

	$("[data-mailtester-tab]")
		.off("click")
		.on("click", function () {
			mailTesterSetTabs($(this).attr("data-mailtester-tab"));
	});
}

// (function () {
	function mailTesterEsc(value) {
		return String(value === undefined || value === null ? "" : value)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function mailTesterToast(type, message) {
		if (typeof showMessageTheme2 === "function" && message) {
			showMessageTheme2(type, message, "", true);
		}
	}

	function mailTesterUrl(path) {
		return getURLForHTML("dashboard", path);
	}

	function mailTesterSetLoader(message) {
		var text = message || "Loading template preview...";
		$("#mailTesterRenderedWrap")
			.html(
				'<div class="d-inline-flex align-items-center gap-10 text-muted font-weight-semi-bold"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span>' +
					text +
					"</span></div>"
			)
			.removeClass("d-none");
		$("#mailTesterPreviewFrame").addClass("d-none");
	}

	function mailTesterClearMeta() {
		$("#mailTesterMetaFor").text("--");
		$("#mailTesterMetaHeader").text("--");
		$("#mailTesterMetaAlign").text("--");
		$("#mailTesterMetaId").text("--");
		$("#mailTesterSubject").val("");
		$("#mailTesterRawContent").val("");
		$("#mailTesterTokenRows").html(
			'<tr><td colspan="2" class="text-center text-muted py-4">Choose a template to inspect generated values.</td></tr>'
		);
		$("#mailTesterRenderedWrap")
			.text("Choose a template to generate a rendered preview.")
			.removeClass("d-none");
		$("#mailTesterPreviewFrame").addClass("d-none");
		$("#mailTesterUnresolvedWrap")
			.addClass("d-none")
			.removeClass("alert-warning");
		$("#mailTesterUnresolvedText").text("None");
		mailTesterState.preview = null;
	}

	function mailTesterSetTabs(tabName) {
		mailTesterState.activeTab = tabName || "rendered";
		$("[data-mailtester-tab]")
			.removeClass("btn-primary active")
			.addClass("btn-outline-primary");
		$('[data-mailtester-tab="' + mailTesterState.activeTab + '"]')
			.removeClass("btn-outline-primary")
			.addClass("btn-primary active");
		$("[data-mailtester-pane]").addClass("d-none");
		$('[data-mailtester-pane="' + mailTesterState.activeTab + '"]').removeClass("d-none");
	}

	function mailTesterPreparePreviewHtml(html) {
		var previewHtml = String(html || "");
		var safeHeadStyle =
			'<style id="mailTesterPreviewFrameStyle">html,body{margin:0;padding:0;max-width:100%;overflow-x:hidden;scroll-behavior:smooth;word-break:break-word;overflow-wrap:anywhere;}img,table,pre,code{max-width:100% !important;}img{height:auto !important;}*{box-sizing:border-box;}</style>';
		if (/<head[^>]*>/i.test(previewHtml)) {
			return previewHtml.replace(/<head([^>]*)>/i, "<head$1>" + safeHeadStyle);
		}
		return safeHeadStyle + previewHtml;
	}

	function mailTesterWriteFrame(html) {
		var iframe = document.getElementById("mailTesterPreviewFrame");
		if (!iframe) {
			return;
		}
		var previewHtml = mailTesterPreparePreviewHtml(html);
		try {
			if ("srcdoc" in iframe) {
				iframe.srcdoc = previewHtml;
			} else {
				var doc = iframe.contentWindow.document;
				doc.open();
				doc.write(previewHtml);
				doc.close();
			}
		} catch (e) {
			try {
				var fallbackDoc = iframe.contentWindow.document;
				fallbackDoc.open();
				fallbackDoc.write(previewHtml);
				fallbackDoc.close();
			} catch (ignore) {}
		}
		$("#mailTesterRenderedWrap").addClass("d-none");
		$("#mailTesterPreviewFrame").removeClass("d-none");
	}

	function mailTesterPrefillRecipient() {
		if ($("#mailTesterRecipient").val()) {
			return;
		}
		var possibleValue = String(mailTesterState.selfEmail || "").trim();
		try {
			if (!possibleValue) {
				possibleValue = String(window.USER_EMAIL || window.USERNAME || "").trim();
			}
		} catch (e) {}
		if (possibleValue) {
			$("#mailTesterRecipient").val(possibleValue);
		}
	}

	function mailTesterGetOverrideMap() {
		var overrides = {};
		$("[data-mailtester-token-input]").each(function () {
			var token = String($(this).attr("data-token") || "").trim();
			if (!token) {
				return;
			}
			overrides[token] = String($(this).val() || "");
		});
		return overrides;
	}

	function mailTesterHandleSession(response) {
		if (!response || String(response.status || "") !== "3") {
			return false;
		}
		if (typeof redirectLoginPage === "function") {
			redirectLoginPage();
			return true;
		}
		mailTesterToast(0, response.message || "Session expired");
		return true;
	}

	function mailTesterRenderTemplateOptions() {
		var options = ['<option value="">Select Email Template</option>'];
		(mailTesterState.templates || []).forEach(function (template) {
			options.push(
				'<option value="' +
					mailTesterEsc(template.id || "") +
					'">' +
					mailTesterEsc(template.displayName || template.templateFor || "") +
					"</option>"
			);
		});
		$("#mailTesterTemplate").html(options.join(""));
		try {
			if ($.fn && $.fn.select2) {
				if ($("#mailTesterTemplate").hasClass("select2-hidden-accessible")) {
					$("#mailTesterTemplate").select2("destroy");
				}
				$("#mailTesterTemplate").select2({
					theme:"bootstrap4",
					width: "100%",
					minimumResultsForSearch: 0,
				});
			}
		} catch (e) {}
	}

	function mailTesterRenderSampleRows(rows) {
		var html = "";
		(rows || []).forEach(function (row) {
			html +=
				"<tr>" +
				'<td><span class="badge badge-primary">#' +
				mailTesterEsc(row.token || "") +
				"#</span></td>" +
				'<td><textarea class="form-control form-control-sm rounded" data-mailtester-token-input="1" data-token="' +
				mailTesterEsc(row.token || "") +
				'" rows="2">' +
				mailTesterEsc(row.value || "") +
				"</textarea></td>" +
				"</tr>";
		});
		if (!html) {
			html =
				'<tr><td colspan="2" class="text-center text-muted py-4">No unresolved placeholders were found for this template.</td></tr>';
		}
		$("#mailTesterTokenRows").html(html);
	}

	function mailTesterRenderPreview(response) {
		mailTesterState.preview = response || null;
		$("#mailTesterMetaFor").text(response.templateFor || "--");
		$("#mailTesterMetaHeader").text(
			String(response.includeHeaderFooter || "").toUpperCase() === "Y" ? "Included" : "Not Included"
		);
		$("#mailTesterMetaAlign").text(response.templateTextAlign || "Default");
		$("#mailTesterMetaId").text(response.templateId || "--");
		$("#mailTesterSubject").val(response.subject || "");
		$("#mailTesterRawContent").val(response.rawTemplateContent || "");
		mailTesterRenderSampleRows(response.sampleValueRows || []);
		mailTesterWriteFrame(response.renderedHtml || "");

		var unresolvedTokens = response.unresolvedTokens || [];
		if (unresolvedTokens.length) {
			$("#mailTesterUnresolvedWrap")
				.removeClass("d-none")
				.addClass("alert-warning");
			$("#mailTesterUnresolvedText").text(
				"These placeholders still remain after sample injection: " + unresolvedTokens.join(", ")
			);
		} else {
			$("#mailTesterUnresolvedWrap")
				.addClass("d-none")
				.removeClass("alert-warning");
			$("#mailTesterUnresolvedText").text("None");
		}
	}

	function mailTesterFetchTemplates() {
		mailTesterSetLoader("Loading templates...");
		$.ajax({
			type: "GET",
			url: mailTesterUrl("email-template-tester/templates"),
			dataType: "json",
			success: function (response) {
				if (mailTesterHandleSession(response)) {
					return;
				}
				if (String(response.status || "") !== "1") {
					mailTesterClearMeta();
					mailTesterToast(0, response.message || "Unable to load email templates");
					return;
				}
				mailTesterState.templates = response.templates || [];
				mailTesterRenderTemplateOptions();
				mailTesterClearMeta();
				if (!mailTesterState.templates.length) {
					$("#mailTesterRenderedWrap")
						.text("No active email templates were found in TEMPLATE.")
						.removeClass("d-none");
					return;
				}
			},
			error: function () {
				mailTesterClearMeta();
				mailTesterToast(0, "Unable to load email templates");
			},
		});
	}

	function mailTesterFetchPreview(options) {
		options = options || {};
		var includeOverrides = !!options.includeOverrides;
		var templateId = String($("#mailTesterTemplate").val() || "").trim();
		if (!templateId) {
			mailTesterClearMeta();
			mailTesterToast(0, "Please select an email template");
			return;
		}
		mailTesterSetLoader("Rendering live preview...");
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: mailTesterUrl("email-template-tester/preview"),
			data: JSON.stringify({
				templateId: templateId,
				subject: options.subject || "",
				sampleValues: includeOverrides ? mailTesterGetOverrideMap() : {},
			}),
			dataType: "json",
			success: function (response) {
				if (mailTesterHandleSession(response)) {
					return;
				}
				if (String(response.status || "") !== "1") {
					mailTesterClearMeta();
					mailTesterToast(0, response.message || "Unable to render preview");
					return;
				}
				mailTesterRenderPreview(response);
				mailTesterToast(1, includeOverrides ? "Overrides applied" : "Preview refreshed");
			},
			error: function () {
				mailTesterClearMeta();
				mailTesterToast(0, "Unable to render preview");
			},
		});
	}

	function mailTesterPreviewRequest(payload) {
		return new Promise(function (resolve, reject) {
			$.ajax({
				type: "POST",
				contentType: "application/json",
				url: mailTesterUrl("email-template-tester/preview"),
				data: JSON.stringify(payload || {}),
				dataType: "json",
				success: function (response) {
					resolve(response);
				},
				error: function (xhr) {
					reject(xhr);
				},
			});
		});
	}

	function mailTesterRangeItemHtml(response) {
		var previewHtml = mailTesterPreparePreviewHtml(response.renderedHtml || "");
		var escapedPreview = mailTesterEsc(previewHtml);
		return (
			'<div class="border rounded mb-3 bg-white">' +
				'<div class="bg-light p-2 d-flex flex-wrap justify-content-between align-items-center">' +
					'<div class="font-weight-semi-bold">#' + mailTesterEsc(response.templateId) + " - " + mailTesterEsc(response.displayName || response.templateFor || "") + "</div>" +
					'<div class="text-muted font-12 mt-1 mt-sm-0">' + mailTesterEsc(response.subject || "") + "</div>" +
				"</div>" +
				'<div class="p-2">' +
					'<iframe class="w-100 border rounded bg-white" style="height: 320px; overflow-x: hidden;" loading="lazy" srcdoc="' + escapedPreview + '"></iframe>' +
				"</div>" +
			"</div>"
		);
	}

	async function mailTesterLoadRange() {
		var fromId = parseInt($("#mailTesterFromId").val(), 10);
		var toId = parseInt($("#mailTesterToId").val(), 10);
		var limit = parseInt($("#mailTesterRangeLimit").val(), 10);
		if (isNaN(fromId) || fromId <= 0 || isNaN(toId) || toId <= 0) {
			mailTesterToast(0, "Valid From ID and To ID are required");
			return;
		}
		if (toId < fromId) {
			mailTesterToast(0, "To ID must be greater than or equal to From ID");
			return;
		}
		if (isNaN(limit) || limit <= 0) {
			limit = 25;
		}
		if (limit > 100) {
			limit = 100;
			$("#mailTesterRangeLimit").val("100");
		}

		var templatesInRange = (mailTesterState.templates || [])
			.filter(function (template) {
				var id = parseInt(template.id, 10);
				return !isNaN(id) && id >= fromId && id <= toId;
			})
			.sort(function (a, b) {
				return parseInt(a.id, 10) - parseInt(b.id, 10);
			})
			.slice(0, limit);

		if (!templatesInRange.length) {
			$("#mailTesterRangeInfo").text("No templates found for selected range.");
			$("#mailTesterRangeList").html('<div class="text-muted text-center py-4">No templates found.</div>');
			mailTesterSetTabs("range");
			return;
		}

		$("#mailTesterLoadRangeBtn").prop("disabled", true).text("Loading...");
		$("#mailTesterRangeInfo").text("Loading " + templatesInRange.length + " templates...");
		$("#mailTesterRangeList").html('<div class="text-muted text-center py-4">Loading range preview...</div>');
		mailTesterSetTabs("range");

		var renderedItems = [];
		var successCount = 0;
		for (var i = 0; i < templatesInRange.length; i++) {
			try {
				var response = await mailTesterPreviewRequest({
					templateId: String(templatesInRange[i].id || ""),
					subject: "",
					sampleValues: {}
				});
				if (mailTesterHandleSession(response)) {
					break;
				}
				if (String(response.status || "") === "1") {
					successCount++;
					renderedItems.push(mailTesterRangeItemHtml(response));
				}
			} catch (e) {}
		}

		$("#mailTesterLoadRangeBtn").prop("disabled", false).text("Load Range");
		if (!renderedItems.length) {
			$("#mailTesterRangeInfo").text("No preview could be rendered.");
			$("#mailTesterRangeList").html('<div class="text-muted text-center py-4">No preview could be rendered.</div>');
			mailTesterToast(0, "Unable to render range preview");
			return;
		}

		$("#mailTesterRangeInfo").text(
			"Showing " + successCount + " template(s) for ID range " + fromId + " to " + toId + " (limit " + limit + ")."
		);
		$("#mailTesterRangeList").html(renderedItems.join(""));
		mailTesterToast(1, "Range preview loaded");
	}

	function mailTesterSend() {
		var recipientEmail = String($("#mailTesterRecipient").val() || "").trim();
		if (!recipientEmail) {
			mailTesterToast(0, "Recipient email is required");
			return;
		}
		if (!mailTesterState.preview || !mailTesterState.preview.templateId) {
			mailTesterToast(0, "Generate a preview before sending");
			return;
		}
		$("#mailTesterSendBtn").prop("disabled", true).text("Sending...");
		$.ajax({
			type: "POST",
			contentType: "application/json",
			url: mailTesterUrl("email-template-tester/send"),
			data: JSON.stringify({
				templateId: mailTesterState.preview.templateId,
				recipientEmail: recipientEmail,
				subject: mailTesterState.preview.subject || "",
				sampleValues: mailTesterGetOverrideMap(),
			}),
			dataType: "json",
			success: function (response) {
				$("#mailTesterSendBtn").prop("disabled", false).text("Send Test Mail");
				if (mailTesterHandleSession(response)) {
					return;
				}
				var isSuccess = String(response.status || "") === "1";
				$("#mailTesterSendResult")
					.removeClass("d-none alert-warning alert-success")
					.addClass(isSuccess ? "alert-success" : "alert-warning");
				$("#mailTesterSendResultText").html(
					(isSuccess ? "Mail sent to <b>" : "Mail send failed for <b>") +
						mailTesterEsc(response.recipientEmail || recipientEmail) +
						"</b><br/>Subject: <b>" +
						mailTesterEsc(response.subject || mailTesterState.preview.subject || "") +
						"</b>"
				);
				mailTesterToast(isSuccess ? 1 : 0, response.message || (isSuccess ? "Mail sent" : "Mail send failed"));
			},
			error: function () {
				$("#mailTesterSendBtn").prop("disabled", false).text("Send Test Mail");
				$("#mailTesterSendResult")
					.removeClass("d-none alert-success")
					.addClass("alert-warning");
				$("#mailTesterSendResultText").text("Unable to send test mail");
				mailTesterToast(0, "Unable to send test mail");
			},
		});
	}

	function mailTesterSendToMyself() {
		var selfEmail = String(mailTesterState.selfEmail || "").trim();
		if (!selfEmail) {
			mailTesterToast(0, "Logged-in user email not available");
			return;
		}
		$("#mailTesterRecipient").val(selfEmail);
		mailTesterSend();
	}

	function mailTesterReset() {
		try {
			if ($.fn && $.fn.select2 && $("#mailTesterTemplate").hasClass("select2-hidden-accessible")) {
				$("#mailTesterTemplate").val("").trigger("change");
			} else {
				$("#mailTesterTemplate").val("");
			}
		} catch (e) {
			$("#mailTesterTemplate").val("");
		}
		$("#mailTesterRecipient").val("");
		$("#mailTesterSendResult")
			.addClass("d-none")
			.removeClass("alert-warning alert-success");
		$("#mailTesterSendResultText").text("No mail sent yet.");
		$("#mailTesterRangeInfo").text("No range loaded yet.");
		$("#mailTesterRangeList").html('<div class="text-muted text-center py-4">Use Range Preview controls to load templates.</div>');
		mailTesterClearMeta();
		mailTesterPrefillRecipient();
	}

	
// })();


function mailTesterContentEsc(value) {
	return String(value === undefined || value === null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
