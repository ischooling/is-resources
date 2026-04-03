var mailTesterState = {
	templates: [],
	preview: null,
	activeTab: "rendered",
	selfEmail: "",
};

(function () {
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
				'<div class="mailTesterLoader"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span>' +
					text +
					"</span></div>"
			)
			.show();
		$("#mailTesterPreviewFrame").hide();
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
			.show();
		$("#mailTesterPreviewFrame").hide();
		$("#mailTesterUnresolvedWrap").removeClass("mailTesterNotice--warn").hide();
		$("#mailTesterUnresolvedText").text("None");
		mailTesterState.preview = null;
	}

	function mailTesterSetTabs(tabName) {
		mailTesterState.activeTab = tabName || "rendered";
		$("[data-mailtester-tab]").removeClass("active");
		$('[data-mailtester-tab="' + mailTesterState.activeTab + '"]').addClass("active");
		$("[data-mailtester-pane]").removeClass("active");
		$('[data-mailtester-pane="' + mailTesterState.activeTab + '"]').addClass("active");
	}

	function mailTesterWriteFrame(html) {
		var iframe = document.getElementById("mailTesterPreviewFrame");
		if (!iframe) {
			return;
		}
		var previewHtml = String(html || "");
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
		$("#mailTesterRenderedWrap").hide();
		$("#mailTesterPreviewFrame").show();
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
		$(".mailTesterTokenInput").each(function () {
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
				'<td><span class="mailTesterTokenCode">#' +
				mailTesterEsc(row.token || "") +
				"#</span></td>" +
				'<td><textarea class="form-control form-control-sm mailTesterTokenInput" data-token="' +
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
			$("#mailTesterUnresolvedWrap").addClass("mailTesterNotice--warn").show();
			$("#mailTesterUnresolvedText").text(
				"These placeholders still remain after sample injection: " + unresolvedTokens.join(", ")
			);
		} else {
			$("#mailTesterUnresolvedWrap").removeClass("mailTesterNotice--warn").hide();
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
						.show();
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
					.toggleClass("mailTesterNotice--warn", !isSuccess)
					.show();
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
				$("#mailTesterSendResult").addClass("mailTesterNotice--warn").show();
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
		$("#mailTesterSendResult").hide().removeClass("mailTesterNotice--warn");
		$("#mailTesterSendResultText").text("No mail sent yet.");
		mailTesterClearMeta();
		mailTesterPrefillRecipient();
	}

	window.initEmailTemplateTester = function () {
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

		$("[data-mailtester-tab]")
			.off("click")
			.on("click", function () {
				mailTesterSetTabs($(this).attr("data-mailtester-tab"));
			});
	};
})();


function mailTesterContentEsc(value) {
	return String(value === undefined || value === null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}