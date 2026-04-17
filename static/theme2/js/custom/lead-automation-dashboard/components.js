function leadAutomationEscapeHtml(value) {
	return String(value === undefined || value === null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function leadAutomationBuildBadge(text, type) {
	return (
		'<span class="lead-automation-badge lead-automation-badge--' +
		leadAutomationEscapeHtml(type || "neutral") +
		'">' +
		leadAutomationEscapeHtml(text) +
		"</span>"
	);
}

function leadAutomationBuildToggle(id, on, label) {
	return (
		'<button type="button" class="lead-automation-toggle ' +
		(on ? "is-on" : "is-off") +
		'" data-lead-automation-toggle="' +
		leadAutomationEscapeHtml(id) +
		'" aria-pressed="' +
		(on ? "true" : "false") +
		'">' +
		'<span class="lead-automation-toggle__dot"></span>' +
		'<span class="lead-automation-toggle__label">' +
		leadAutomationEscapeHtml(label || id) +
		"</span>" +
		"</button>"
	);
}

function leadAutomationBuildStat(label, value, hint) {
	return (
		'<div class="lead-automation-stat">' +
		'<div class="lead-automation-stat__label">' +
		leadAutomationEscapeHtml(label) +
		"</div>" +
		'<div class="lead-automation-stat__value">' +
		leadAutomationEscapeHtml(value) +
		"</div>" +
		(hint
			? '<div class="lead-automation-stat__hint">' +
			  leadAutomationEscapeHtml(hint) +
			  "</div>"
			: "") +
		"</div>"
	);
}

function leadAutomationBuildCard(title, body, footer) {
	return (
		'<article class="lead-automation-card">' +
		'<div class="lead-automation-card__title">' +
		leadAutomationEscapeHtml(title) +
		"</div>" +
		'<div class="lead-automation-card__body">' +
		body +
		"</div>" +
		(footer ? '<div class="lead-automation-card__footer">' + footer + "</div>" : "") +
		"</article>"
	);
}

function leadAutomationNormalizeTagValues(value) {
	if (Array.isArray(value)) {
		return $.map(value, function (item) {
			return String(item == null ? "" : item).trim();
		}).filter(Boolean);
	}
	var text = String(value == null ? "" : value).trim();
	if (!text) {
		return [];
	}
	return $.map(text.split(","), function (item) {
		return String(item == null ? "" : item).trim();
	}).filter(Boolean);
}

function leadAutomationGetTagOptions() {
	var options = [];
	var source = $("#leadAutomationTagSource");
	if (source.length) {
		source.find("option").each(function () {
			var option = $(this);
			var value = String(option.attr("value") || option.text() || "").trim();
			if (!value) {
				return;
			}
			options.push({
				value: value,
				label: String(option.text() || value).trim() || value,
			});
		});
	}
	if (options.length) {
		return options;
	}
	var fallback = window.LEAD_AUTOMATION_TAG_OPTIONS;
	if ($.isArray(fallback)) {
		$.each(fallback, function (_, item) {
			if (!item) return;
			var value = String(item.value || item.label || item.text || "").trim();
			if (!value) return;
			options.push({
				value: value,
				label: String(item.label || item.text || value).trim() || value,
			});
		});
	}
	return options;
}

function leadAutomationBuildTagOptionsHtml(selectedValues) {
	var selected = {};
	$.each(leadAutomationNormalizeTagValues(selectedValues), function (_, item) {
		selected[String(item)] = true;
	});
	var options = leadAutomationGetTagOptions();
	var html = "";
	$.each(options, function (_, option) {
		var value = String(option.value || "").trim();
		if (!value) {
			return;
		}
		html +=
			'<option value="' +
			leadAutomationEscapeHtml(value) +
			'"' +
			(selected[value] ? ' selected="selected"' : "") +
			">" +
			leadAutomationEscapeHtml(option.label || value) +
			"</option>";
	});
	return html;
}

function leadAutomationBuildTagSelectHtml(id, selectedValues, extraClass, placeholder, extraAttrs) {
	var classes = ["lead-automation-input", "lead-automation-tagSelect"];
	if (extraClass) {
		classes = classes.concat(String(extraClass).split(/\s+/).filter(Boolean));
	}
	var html = '<div class="full relative-select2 lead-automation-tagSelectWrap">';
	html += '<div class="full relative-wrapper">';
	html += '<select multiple class="form-control ' + classes.join(" ") + '" data-lead-automation-tag-select="true" id="' + leadAutomationEscapeHtml(id) + '"';
	if (placeholder) {
		html += ' data-placeholder="' + leadAutomationEscapeHtml(placeholder) + '"';
	}
	if (extraAttrs) {
		html += " " + String(extraAttrs).trim();
	}
	html += ">";
	if (placeholder) {
		html += '<option value=""></option>';
	}
	html += leadAutomationBuildTagOptionsHtml(selectedValues) + "</select></div></div>";
	return html;
}

function leadAutomationSetTagSelectValues(selector, values) {
	var target = $(selector);
	if (!target.length) {
		return [];
	}
	var normalized = leadAutomationNormalizeTagValues(values);
	$.each(normalized, function (_, value) {
		var exists = target.find("option").filter(function () {
			return String($(this).val() || "") === String(value);
		}).length;
		if (!exists) {
			target.append(
				'<option value="' +
				leadAutomationEscapeHtml(value) +
				'" selected="selected">' +
				leadAutomationEscapeHtml(value) +
				"</option>"
			);
		}
	});
	target.val(normalized).trigger("change");
	return normalized;
}

function leadAutomationInitTagSelects(root) {
	var scope = root ? $(root) : $(document);
	scope.find("select[data-lead-automation-tag-select='true']").each(function () {
		var select = $(this);
		if (!select.find("option").length) {
			select.html(leadAutomationBuildTagOptionsHtml(select.val()));
		}
		if (select.hasClass("select2-hidden-accessible") && typeof select.select2 === "function") {
			select.select2("destroy");
		}
		if (typeof select.select2 !== "function") {
			return;
		}
		select.select2({
			theme: "bootstrap4",
			dir: "ltr",
			width: "100%",
			closeOnSelect: false,
			tags: true,
			createTag: function (params) {
				var term = String(params.term || "").trim();
				if (!term) {
					return null;
				}
				var lowerTerm = term.toLowerCase();
				var exists = false;
				select.find("option").each(function () {
					var optionValue = String($(this).val() || "").trim().toLowerCase();
					if (optionValue === lowerTerm) {
						exists = true;
						return false;
					}
					return true;
				});
				if (exists) {
					return null;
				}
				return {
					id: term,
					text: term,
					newTag: true,
				};
			},
			placeholder: String(select.data("placeholder") || "Select tags"),
			dropdownParent: select.closest(".lead-automation-modalBackdrop").length
				? select.closest(".lead-automation-modalBackdrop")
				: (select.closest(".modal").length ? select.closest(".modal") : $(document.body)),
		});
		var initialValues = leadAutomationNormalizeTagValues(select.val());
		if (initialValues.length) {
			select.val(initialValues).trigger("change");
		}
	});
}

function leadAutomationDestroyEditorInstance(stateKey) {
	var editor = window.LEAD_AUTOMATION_STATE ? window.LEAD_AUTOMATION_STATE[stateKey] : null;
	if (editor && typeof editor.destruct === "function") {
		editor.destruct();
	} else if (editor && typeof editor.destroy === "function") {
		editor.destroy();
	}
	if (window.LEAD_AUTOMATION_STATE) {
		window.LEAD_AUTOMATION_STATE[stateKey] = null;
	}
}

function leadAutomationSetEditorValue(stateKey, selector, value, isReadOnly) {
	var editor = window.LEAD_AUTOMATION_STATE ? window.LEAD_AUTOMATION_STATE[stateKey] : null;
	var text = String(value === undefined || value === null ? "" : value);
	if (editor && typeof editor.setEditorValue === "function") {
		editor.setEditorValue(text);
	} else if (editor && typeof editor.value !== "undefined") {
		editor.value = text;
	} else if (selector) {
		$(selector).val(text);
	}
	if (editor && typeof editor.setReadOnly === "function") {
		editor.setReadOnly(!!isReadOnly);
	} else if (selector) {
		$(selector).prop("disabled", !!isReadOnly);
	}
	return editor;
}

function leadAutomationGetEditorValue(stateKey, selector) {
	var editor = window.LEAD_AUTOMATION_STATE ? window.LEAD_AUTOMATION_STATE[stateKey] : null;
	if (editor && typeof editor.getEditorValue === "function") {
		return String(editor.getEditorValue() || "");
	}
	if (editor && typeof editor.value !== "undefined") {
		return String(editor.value || "");
	}
	if (selector && $(selector).length) {
		return String($(selector).val() || "");
	}
	return "";
}

function leadAutomationInitRichTextEditor(stateKey, selector, value, isReadOnly) {
	var target = $(selector);
	if (!target.length) {
		return null;
	}
	leadAutomationDestroyEditorInstance(stateKey);
	target.prop("disabled", !!isReadOnly).val(String(value === undefined || value === null ? "" : value));
	if (typeof Jodit === "undefined") {
		return null;
	}
	var compactButtons = [
		"bold",
		"italic",
		"underline",
		"|",
		"ul",
		"ol",
		"|",
		"link",
		"hr",
		"|",
		"undo",
		"redo",
	];
	var editor = new Jodit(target[0], {
		height: 220,
		width: "100%",
		toolbarSticky: true,
		toolbarAdaptive: false,
		buttons: compactButtons,
		showCharsCounter: false,
		showWordsCounter: false,
		showXPathInStatusbar: false,
		spellcheck: false,
		placeholder: "Write message body...",
		readonly: !!isReadOnly,
		readOnly: !!isReadOnly,
		uploader: { insertImageAsBase64URI: true },
	});
	leadAutomationSetEditorValue(stateKey, selector, value, isReadOnly);
	window.LEAD_AUTOMATION_STATE[stateKey] = editor;
	return editor;
}

function leadAutomationShowMessage(message, type) {
	var typeStr = String(type || "").toLowerCase();
	// Use global popup when available so messages appear on top of any modal
	if (typeof window.showMessageTheme2 === "function") {
		window.showMessageTheme2((typeStr === "success" ? 1 : 0), message || "", "", true);
		return;
	}
	// Fallback: inline alert in #leadAutomationMessage
	var target = $("#leadAutomationMessage");
	if (!target.length) {
		return;
	}
	var alertType = typeStr === "error" ? "danger" : (typeStr === "success" ? "success" : "info");
	target.html(
		'<div class="alert alert-' +
		alertType +
		' mb-0">' +
		leadAutomationEscapeHtml(message || "") +
		"</div>"
	);
	(function () {
		var targetTop = target.offset() ? target.offset().top - 16 : 0;
		if (typeof window !== "undefined") {
			$("html, body").stop(true).animate({ scrollTop: Math.max(targetTop, 0) }, 200);
		}
		var scrollParent = target.parents().filter(function () {
			var $parent = $(this);
			var overflowY = String($parent.css("overflowY") || "");
			return (overflowY === "auto" || overflowY === "scroll") && this.scrollHeight > this.clientHeight;
		}).first();
		if (scrollParent.length) {
			var parentTop = scrollParent.offset() ? scrollParent.offset().top : 0;
			var scrollTop = scrollParent.scrollTop() + (targetTop + 16 - parentTop) - 12;
			scrollParent.stop(true).animate({ scrollTop: Math.max(scrollTop, 0) }, 200);
		}
	})();
	clearTimeout(window.LEAD_AUTOMATION_STATE.toastTimer);
	window.LEAD_AUTOMATION_STATE.toastTimer = setTimeout(function () {
		target.empty();
	}, 2200);
}

function leadAutomationShowPopup(message, type) {
	var isSuccess = String(type || "").toLowerCase() === "success";
	if (typeof window.showMessageTheme2 === "function") {
		window.showMessageTheme2(isSuccess ? 1 : 0, message || "", "", true);
		return;
	}
	leadAutomationShowMessage(message, isSuccess ? "success" : "error");
}

function leadAutomationEnsureConfirmDialog() {
	var dialog = $("#leadAutomationConfirmModal");
	if (dialog.length) {
		return dialog;
	}
	dialog = $(
		'<div id="leadAutomationConfirmModal" class="lead-automation-modalBackdrop" aria-hidden="true">' +
		'  <div class="lead-automation-modalCard lead-automation-confirmCard" role="dialog" aria-modal="true" aria-labelledby="leadAutomationConfirmTitle">' +
		'    <div class="lead-automation-modalHeader">' +
		'      <h5 class="lead-automation-modalTitle" id="leadAutomationConfirmTitle">Confirm action</h5>' +
		'      <button type="button" class="lead-automation-modalClose" data-lead-automation-action="confirm-modal-close" aria-label="Close">&times;</button>' +
		"    </div>" +
		'    <div class="lead-automation-modalBody">' +
		'      <div class="lead-automation-confirmText" id="leadAutomationConfirmMessage"></div>' +
		"    </div>" +
		'    <div class="lead-automation-modalFooter lead-automation-confirmActions">' +
		'      <button type="button" class="lead-automation-confirmBtn lead-automation-confirmBtn--no" data-lead-automation-action="confirm-modal-cancel">No</button>' +
		'      <button type="button" class="lead-automation-confirmBtn lead-automation-confirmBtn--yes" data-lead-automation-action="confirm-modal-yes">Yes</button>' +
		"    </div>" +
		"  </div>" +
		"</div>"
	);
	$("body").append(dialog);
	return dialog;
}

function leadAutomationCloseConfirmDialog() {
	window.LEAD_AUTOMATION_STATE.confirmCallback = null;
	var dialog = $("#leadAutomationConfirmModal");
	if (dialog.length) {
		dialog.removeClass("show").attr("aria-hidden", "true");
	}
	return false;
}

function leadAutomationShowConfirmDialog(message, onConfirm, title) {
	var dialog = leadAutomationEnsureConfirmDialog();
	if (!dialog.length) {
		if (typeof onConfirm === "function") {
			onConfirm();
		}
		return true;
	}
	window.LEAD_AUTOMATION_STATE.confirmCallback = typeof onConfirm === "function" ? onConfirm : null;
	$("#leadAutomationConfirmTitle").text(title || "Confirm action");
	$("#leadAutomationConfirmMessage").text(message || "");
	dialog.find("[data-lead-automation-action='confirm-modal-yes']").text(title && /delete/i.test(title) ? "Yes" : "Yes");
	dialog.find("[data-lead-automation-action='confirm-modal-cancel']").text("No");
	dialog.addClass("show").attr("aria-hidden", "false");
	return true;
}

function leadAutomationEnsureBusyOverlay() {
	var overlay = $("#leadAutomationBusyOverlay");
	if (overlay.length) {
		return overlay;
	}
	overlay = $(
		'<div id="leadAutomationBusyOverlay" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:20000;display:none;align-items:center;justify-content:center;background:rgba(15,23,42,0.42);backdrop-filter:blur(1.5px);">' +
		'  <div style="min-width:240px;max-width:340px;padding:28px 32px;border-radius:18px;background:#fff;box-shadow:0 18px 44px rgba(15,23,42,0.22);text-align:center;">' +
		'    <div style="width:42px;height:42px;margin:0 auto 14px;border-radius:50%;border:4px solid rgba(37,99,235,0.18);border-top-color:#2563eb;animation:leadAutomationSpin 0.9s linear infinite;"></div>' +
		'    <div id="leadAutomationBusyOverlayTitle" style="font-size:17px;font-weight:800;color:#0f172a;">Working...</div>' +
		'    <div id="leadAutomationBusyOverlayCopy" style="margin-top:6px;font-size:13px;color:#64748b;">Please wait</div>' +
		"  </div>" +
		"</div>"
	);
	$("body").append(overlay);
	return overlay;
}

function leadAutomationSetBusy(isBusy, title, copy) {
	var overlay = leadAutomationEnsureBusyOverlay();
	if (!overlay || !overlay.length) {
		return;
	}
	if (isBusy) {
		$("#leadAutomationBusyOverlayTitle").text(title || "Working...");
		$("#leadAutomationBusyOverlayCopy").text(copy || "Please wait");
		overlay.css("display", "flex");
	} else {
		overlay.css("display", "none");
	}
}

function leadAutomationBuildTab(id, label) {
	return (
		'<li class="nav-item">' +
		'<a href="javascript:void(0);" class="nav-link lead-automation-tab" data-lead-automation-tab="' +
		leadAutomationEscapeHtml(id) +
		'">' +
		leadAutomationEscapeHtml(label) +
		"</a>" +
		"</li>"
	);
}

function leadAutomationBuildPageShell() {
	var tabs = "";
	$.each(window.LEAD_AUTOMATION_CONFIG.tabs || [], function (index, item) {
		tabs += leadAutomationBuildTab(item.id, item.label);
	});

	return [
		'<div class="app-page-title mb-3 py-2">',
		'  <div class="page-title-wrapper">',
		'    <div class="page-title-heading">',
		'      <div class="page-title-icon"><i class="fa fa-bolt text-primary"></i></div>',
		'      <div>',
		leadAutomationEscapeHtml(window.LEAD_AUTOMATION_CONFIG.brandName),
		'        <div class="page-title-subtitle">Content library and settings</div>',
		"      </div>",
		"    </div>",
		"  </div>",
		"</div>",
		'<div class="main-card mb-3 card">',
		'  <div class="card-body">',
		'    <div id="leadAutomationMessage"></div>',
		'    <ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav lead-automation-tabs">',
		tabs,
		"    </ul>",
		'    <div id="leadAutomationSection"></div>',
		"  </div>",
		"</div>",
	].join("");
}
