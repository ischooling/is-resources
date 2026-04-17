window.LEAD_AUTOMATION_MEDIA_STATE = window.LEAD_AUTOMATION_MEDIA_STATE || {
	activeTab: "images",
	mediaList: [],
};

function leadAutomationMediaGetApiBase() {
	var cfg = window.LEAD_AUTOMATION_MEDIA_CONFIG || {};
	if (cfg.apiBase) {
		return cfg.apiBase;
	}
	var unique = window.UNIQUEUUID || "";
	if (!unique) return "";
	if (window.APP_BASE_URL) {
		return window.APP_BASE_URL + unique + "/dashboard/lead-automation-media";
	}
	return "";
}

function leadAutomationMediaEncodePayload(data) {
	var json = JSON.stringify(data || {});
	return window.btoa(unescape(encodeURIComponent(json)));
}

function leadAutomationMediaBuildRequestPayload(data) {
	return {
		payload: leadAutomationMediaEncodePayload(data),
	};
}

function leadAutomationMediaParseResponse(resp) {
	if (resp == null) {
		return {};
	}
	if (typeof resp === "object") {
		return resp;
	}
	try {
		return JSON.parse(resp);
	} catch (e) {
		return {};
	}
}

function leadAutomationMediaReadFile(file) {
	return new Promise(function (resolve, reject) {
		var reader = new FileReader();
		reader.onload = function () {
			resolve(String(reader.result || ""));
		};
		reader.onerror = function () {
			reject(new Error("Unable to read file"));
		};
		reader.readAsDataURL(file);
	});
}

function leadAutomationMediaFileToJson(file) {
	return leadAutomationMediaReadFile(file).then(function (dataUrl) {
		var base64 = String(dataUrl || "");
		var commaIndex = base64.indexOf(",");
		if (commaIndex >= 0) {
			base64 = base64.substring(commaIndex + 1);
		}
		return {
			name: file.name || "media-file",
			type: file.type || "",
			content: base64,
		};
	});
}

function leadAutomationMediaParseListValue(value) {
	if (Array.isArray(value)) {
		return value.slice();
	}
	var text = String(value == null ? "" : value).trim();
	if (!text) {
		return [];
	}
	if (text.charAt(0) !== "[" && text.charAt(0) !== "{") {
		return [text];
	}
	try {
		var parsed = JSON.parse(text);
		if (Array.isArray(parsed)) {
			return parsed;
		}
	} catch (e) {
		return [text];
	}
	return [text];
}

function leadAutomationMediaGetGroupNames(item) {
	var names = leadAutomationMediaParseListValue(item && item.originalFileName);
	return names.length ? names : [item && item.originalFileName ? item.originalFileName : item && item.title ? item.title : "Untitled"];
}

function leadAutomationMediaGetGroupStoredNames(item) {
	var names = leadAutomationMediaParseListValue(item && item.storedFileName);
	return names.length ? names : [item && item.storedFileName ? item.storedFileName : ""];
}

function leadAutomationMediaGetGroupTypes(item) {
	var types = leadAutomationMediaParseListValue(item && item.contentType);
	return types.length ? types : [item && item.contentType ? item.contentType : ""];
}

function leadAutomationMediaBuildUrl(fileName) {
	var base = String(window.FILE_UPLOAD_PATH || "");
	var name = String(fileName || "").trim();
	if (!name) return "";
	if (!base) {
		return name;
	}
	if (/^https?:\/\//i.test(name)) {
		return name;
	}
	var bucket = "";
	try {
		var baseParts = base.replace(/\\/g, "/").split("/").filter(Boolean);
		bucket = baseParts.length ? baseParts[baseParts.length - 1] : "";
	} catch (e) {
		bucket = "";
	}
	if (bucket && name.indexOf(bucket + "/") === 0) {
		name = name.substring(bucket.length + 1);
	}
	return leadAutomationMediaEncodeUrl(base + name);
}

function leadAutomationMediaNormalizeUrl(url, fallbackFileName) {
	var raw = String(url || "").trim();
	if (!raw) {
		return leadAutomationMediaBuildUrl(fallbackFileName);
	}
	if (!/^https?:\/\//i.test(raw)) {
		return leadAutomationMediaBuildUrl(raw || fallbackFileName);
	}
	var base = String(window.FILE_UPLOAD_PATH || "");
	var bucket = "";
	try {
		var baseParts = base.replace(/\\/g, "/").split("/").filter(Boolean);
		bucket = baseParts.length ? baseParts[baseParts.length - 1] : "";
	} catch (e) {
		bucket = "";
	}
	if (bucket) {
		var duplicatePrefix = "/" + bucket + "/" + bucket + "/";
		while (raw.indexOf(duplicatePrefix) >= 0) {
			raw = raw.replace(duplicatePrefix, "/" + bucket + "/");
		}
	}
	return leadAutomationMediaEncodeUrl(raw);
}

function leadAutomationMediaEncodeUrl(url) {
	var value = String(url || "").trim();
	if (!value) return "";
	value = value.replace(/\u00A0/g, " ").replace(/\u202F/g, " ");
	try {
		value = decodeURI(value);
	} catch (e) {
		// keep original value when it is not safely decoded
	}
	return encodeURI(value);
}

function leadAutomationMediaGetGroupItems(item) {
	var names = leadAutomationMediaGetGroupNames(item);
	var storedNames = leadAutomationMediaGetGroupStoredNames(item);
	var types = leadAutomationMediaGetGroupTypes(item);
	var list = [];
	for (var i = 0; i < storedNames.length; i++) {
		var storedName = String(storedNames[i] || "");
		var originalName = String(names[i] || names[0] || storedName || "Untitled");
		var type = String(types[i] || types[0] || "");
		var resolvedUrl = leadAutomationMediaNormalizeUrl(item && item.fileUrl ? item.fileUrl : "", storedName);
		list.push({
			name: originalName,
			storedFileName: storedName,
			fileUrl: resolvedUrl,
			contentType: type,
		});
	}
	return list;
}

function leadAutomationMediaEscapeHtml(value) {
	return String(value == null ? "" : value)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function leadAutomationMediaFileLabel(fileName) {
	var lower = String(fileName || "").toLowerCase();
	if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(lower)) return "Image";
	if (/\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i.test(lower)) return "Video";
	if (/\.(pdf|doc|docx|rtf|odt)$/i.test(lower)) return "Document";
	return "File";
}

function leadAutomationMediaFormatSize(bytes) {
	var size = Number(bytes || 0);
	if (!size) return "";
	var units = ["B", "KB", "MB", "GB"];
	var idx = 0;
	while (size >= 1024 && idx < units.length - 1) {
		size = size / 1024;
		idx++;
	}
	return (size >= 10 || idx === 0 ? size.toFixed(0) : size.toFixed(1)) + " " + units[idx];
}

function leadAutomationMediaRenderTags(tags) {
	var values = String(tags || "")
		.split(",")
		.map(function (item) {
			return $.trim(item);
		})
		.filter(Boolean);
	if (!values.length) {
		return '<span class="text-muted">-</span>';
	}
	return values
		.map(function (tag) {
			return '<span class="badge badge-light border mr-1 mb-1">#' + leadAutomationMediaEscapeHtml(tag.replace(/^#/, "")) + "</span>";
		})
		.join("");
}

function leadAutomationMediaRenderThumb(item) {
	var groupItems = leadAutomationMediaGetGroupItems(item);
	var firstItem = groupItems[0] || {};
	var name = firstItem.name || item.originalFileName || item.title || "Untitled";
	var url = leadAutomationMediaNormalizeUrl(firstItem.fileUrl || item.fileUrl || "", firstItem.storedFileName || item.storedFileName || name);
	var ext = String(item.fileExtension || "").toLowerCase();
	var type = String(firstItem.contentType || item.contentType || "").toLowerCase();
	var count = groupItems.length;
	var bucket = String(item.mediaType || "images").toLowerCase();
	var preview = '<div class="leadAutomationMedia-thumbPlaceholder">' + leadAutomationMediaEscapeHtml(bucket.toUpperCase()) + "</div>";
	if (type.indexOf("image/") === 0 && url) {
		preview = '<img src="' + leadAutomationMediaEscapeHtml(url) + '" alt="' + leadAutomationMediaEscapeHtml(name) + '" class="leadAutomationMedia-thumbImg">';
	} else if (type.indexOf("video/") === 0 && url) {
		preview = '<video src="' + leadAutomationMediaEscapeHtml(url) + '" muted playsinline preload="metadata" class="leadAutomationMedia-thumbVideo"></video>';
	} else if (ext === "pdf" || ext === "doc" || ext === "docx" || ext === "odt" || ext === "rtf") {
		preview = '<div class="leadAutomationMedia-thumbPlaceholder">' + leadAutomationMediaMediaFileKind(ext) + "</div>";
	}
	if (count > 1) {
		preview = [
			'<div style="position:relative">',
			preview,
			'<span style="position:absolute;right:8px;bottom:8px;background:#1f2937;color:#fff;font-size:11px;font-weight:700;border-radius:999px;padding:2px 8px;box-shadow:0 4px 10px rgba(15,23,42,.2);">+' + (count - 1) + '</span>',
			"</div>",
		].join("");
	}
	return [
		'<div class="leadAutomationMedia-card" data-media-id="' + leadAutomationMediaEscapeHtml(String(item.id || "")) + '">',
		'  <button type="button" class="leadAutomationMedia-cardDelete" data-media-delete="' + leadAutomationMediaEscapeHtml(String(item.id || "")) + '" title="Delete"><i class="fa fa-trash"></i></button>',
		'  <div class="leadAutomationMedia-cardPreview">' + preview + "</div>",
		'  <div class="leadAutomationMedia-cardBody">',
		'    <div class="leadAutomationMedia-cardTitle">' + leadAutomationMediaEscapeHtml(item.title || name) + "</div>",
		'    <div class="leadAutomationMedia-cardMeta">' + leadAutomationMediaEscapeHtml(name) + "</div>",
		'    <div class="leadAutomationMedia-cardMeta">' + leadAutomationMediaEscapeHtml(leadAutomationMediaFileLabel(name)) + (item.fileSizeLabel ? " · " + leadAutomationMediaEscapeHtml(item.fileSizeLabel) : "") + "</div>",
		'    <div class="leadAutomationMedia-cardMeta"><strong>Channel:</strong> ' + leadAutomationMediaEscapeHtml(item.channel || "WhatsApp") + "</div>",
		'    <div class="leadAutomationMedia-cardTags">' + leadAutomationMediaRenderTags(item.tags) + "</div>",
		"  </div>",
		"</div>",
	].join("");
}

function leadAutomationMediaMediaFileKind(ext) {
	if (ext === "doc" || ext === "docx") return "DOC";
	if (ext === "pdf") return "PDF";
	return "FILE";
}

function leadAutomationMediaRenderGrid(list) {
	var html = "";
	if (!list || !list.length) {
		html = '<div class="leadAutomationMedia-empty">No media found for this tab.</div>';
	} else {
		$.each(list, function (_, item) {
			html += leadAutomationMediaRenderThumb(item);
		});
	}
	$("#leadAutomationMediaGrid").html(html);
}

function leadAutomationMediaRenderTable(list) {
	var html = "";
	if (!list || !list.length) {
		html = '<tr><td colspan="6"><div class="leadAutomationMedia-empty">No media found for this tab.</div></td></tr>';
	} else {
		$.each(list, function (_, item) {
			var groupItems = leadAutomationMediaGetGroupItems(item);
			var firstItem = groupItems[0] || {};
			var name = firstItem.name || item.originalFileName || item.title || "Untitled";
			var countLabel = groupItems.length > 1 ? " +" + (groupItems.length - 1) + " more" : "";
			html += [
				'<tr>',
				'  <td>' + leadAutomationMediaEscapeHtml(item.title || name) + '</td>',
				'  <td>' + leadAutomationMediaEscapeHtml(name) + leadAutomationMediaEscapeHtml(countLabel) + '</td>',
				'  <td>' + leadAutomationMediaEscapeHtml(leadAutomationMediaFileLabel(name)) + '</td>',
				'  <td>' + leadAutomationMediaEscapeHtml(item.fileSizeLabel || "") + '</td>',
				'  <td>' + leadAutomationMediaEscapeHtml(item.channel || "WhatsApp") + '</td>',
				'  <td>' + leadAutomationMediaRenderTags(item.tags) + '</td>',
				'  <td>',
				'    <button type="button" class="btn btn-sm btn-outline-danger" data-media-delete="' + leadAutomationMediaEscapeHtml(String(item.id || "")) + '">Delete</button>',
				'  </td>',
				'</tr>',
			].join("");
		});
	}
	$("#leadAutomationMediaTableBody").html(html);
}

function leadAutomationMediaLoadList() {
	var apiBase = leadAutomationMediaGetApiBase();
	if (!apiBase) {
		return $.Deferred().resolve([]).promise();
	}
	return $.ajax({
		type: "POST",
		url: apiBase + "/list",
		data: JSON.stringify(leadAutomationMediaBuildRequestPayload({
			mediaType: window.LEAD_AUTOMATION_MEDIA_STATE.activeTab,
		})),
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
	}).done(function (data) {
		var resp = leadAutomationMediaParseResponse(data);
		window.LEAD_AUTOMATION_MEDIA_STATE.mediaList = $.isArray(resp.mediaList) ? resp.mediaList : [];
		leadAutomationMediaRenderGrid(window.LEAD_AUTOMATION_MEDIA_STATE.mediaList);
		leadAutomationMediaRenderTable(window.LEAD_AUTOMATION_MEDIA_STATE.mediaList);
	}).fail(function () {
		leadAutomationMediaRenderGrid([]);
		leadAutomationMediaRenderTable([]);
		if (window.leadAutomationShowMessage) {
			leadAutomationShowMessage("Unable to load media list.", "error");
		}
	});
}

function leadAutomationMediaSave() {
	var apiBase = leadAutomationMediaGetApiBase();
	if (!apiBase) return false;

	var fileInput = $("#leadAutomationMediaFiles")[0];
	var files = fileInput && fileInput.files ? fileInput.files : [];
	if (!files.length) {
		if (window.leadAutomationShowMessage) {
			leadAutomationShowMessage("Please choose at least one file.", "error");
		}
		return false;
	}

	var mediaType = $("#leadAutomationMediaTypeSelect").val() || "images";

	// Validate file sizes before upload
	var limitInfo = (typeof leadAutomationGetMediaLimitInfo === "function") ? leadAutomationGetMediaLimitInfo(mediaType) : { maxBytes: 10 * 1024 * 1024, label: "Max 10 MB each" };
	var oversizeFiles = [];
	var validFiles = [];
	for (var i = 0; i < files.length; i++) {
		var f = files[i];
		if (f && limitInfo.maxBytes && Number(f.size || 0) > limitInfo.maxBytes) {
			oversizeFiles.push((f.name || "file") + " (" + (f.size ? (f.size / (1024 * 1024)).toFixed(1) + " MB" : "?") + ")");
		} else if (f) {
			validFiles.push(f);
		}
	}
	if (oversizeFiles.length) {
		leadAutomationShowMessage("File too large. " + limitInfo.label + ". Skipped: " + oversizeFiles.join(", "), "error");
		if (!validFiles.length) return false;
	}

	var filePromises = [];
	for (var i = 0; i < validFiles.length; i++) {
		filePromises.push(leadAutomationMediaFileToJson(validFiles[i]));
	}

	var controllerRoot = (typeof leadAutomationGetMediaControllerRoot === "function") ? leadAutomationGetMediaControllerRoot() : apiBase;
	if (!controllerRoot) {
		controllerRoot = apiBase;
	}

	Promise.all(filePromises).then(function (fileJsonList) {
		if (!fileJsonList.length) {
			leadAutomationShowMessage("Selected files could not be processed.", "error");
			return;
		}
		var tagsVal = $("#leadAutomationMediaTags").val();
		var tags = "";
		if ($.isArray(tagsVal)) {
			tags = tagsVal.join(",");
		} else {
			tags = String(tagsVal || "");
		}
		var tagsForRequest = tags;
		if ($.isArray(tagsForRequest)) {
			tagsForRequest = tagsForRequest.join(",");
		}
		tagsForRequest = String(tagsForRequest || "");

		var request = {
			title: String($("#leadAutomationMediaTitle").val() || ""),
			channel: String($("#leadAutomationMediaChannel").val() || "WhatsApp"),
			tags: tagsForRequest,
			mediaType: String(mediaType || "images"),
			filesJson: JSON.stringify(fileJsonList),
		};

		var payloadData = (typeof leadAutomationBuildPayloadRequest === "function")
			? leadAutomationBuildPayloadRequest(request)
			: leadAutomationMediaBuildRequestPayload(request);

		$.ajax({
			type: "POST",
			url: controllerRoot + "/save",
			data: JSON.stringify(payloadData),
			contentType: "application/json; charset=utf-8",
			dataType: "text",
			cache: false,
			global: false,
			timeout: 120000,
			beforeSend: function () {
				leadAutomationSetBusy(true, "Uploading media...", "Please wait while files are being saved.");
			},
		}).done(function (data) {
			leadAutomationSetBusy(false);
			var resp = leadAutomationMediaParseResponse(data);
			var status = String((resp && resp.status) || "").toUpperCase();
			if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
				leadAutomationShowMessage(resp && resp.message ? resp.message : "Unable to save media.", "error");
				return;
			}
			$("#leadAutomationMediaTitle").val("");
			$("#leadAutomationMediaTags").val("").trigger("change");
			$("#leadAutomationMediaFiles").val("");
			window.LEAD_AUTOMATION_STAGED_FILES = [];
			$("#leadAutomationMediaFilePreview").html("");
			leadAutomationShowMessage((resp && resp.message) || "Media saved successfully.", "success");
			if (typeof leadAutomationLoadAllMedia === "function") {
				leadAutomationLoadAllMedia();
			}
		}).fail(function (xhr) {
			leadAutomationSetBusy(false);
			leadAutomationShowMessage("Upload failed. Status: " + (xhr && xhr.status ? xhr.status : "unknown"), "error");
		});
	}).catch(function (err) {
		leadAutomationSetBusy(false);
		leadAutomationShowMessage("Unable to read selected file(s): " + (err && err.message ? err.message : ""), "error");
	});
	return false;
}

function leadAutomationMediaDelete(id) {
	var apiBase = leadAutomationMediaGetApiBase();
	if (!apiBase || !id) return false;
	if (typeof leadAutomationShowConfirmDialog !== "function") {
		return false;
	}
	return leadAutomationShowConfirmDialog(
		"Delete this media item?",
		function () {
			leadAutomationMediaDeleteConfirmed(apiBase, id);
		},
		"Delete media"
	);
}

function leadAutomationMediaDeleteConfirmed(apiBase, id) {

	$.ajax({
		type: "POST",
		url: apiBase + "/delete",
		data: JSON.stringify(leadAutomationMediaBuildRequestPayload({ id: Number(id) })),
		contentType: "application/json; charset=utf-8",
		dataType: "text",
		cache: false,
	}).done(function (data) {
		var resp = leadAutomationMediaParseResponse(data);
		var status = String((resp && resp.status) || "").toUpperCase();
		if (status === "FAILED" || status === "EXCEPTION" || status === "SESSIONOUT") {
			if (window.leadAutomationShowMessage) {
				leadAutomationShowMessage(resp && resp.message ? resp.message : "Unable to delete media.", "error");
			}
			return;
		}
		if (window.leadAutomationShowMessage) {
			leadAutomationShowMessage((resp && resp.message) || "Media deleted successfully.", "success");
		}
		leadAutomationMediaLoadList();
	}).fail(function () {
		if (window.leadAutomationShowMessage) {
			leadAutomationShowMessage("Unable to delete media.", "error");
		}
	});
	return false;
}

function leadAutomationMediaBindEvents() {
	$(document)
		.off("click.leadAutomationMediaTab")
		.on("click.leadAutomationMediaTab", "[data-media-tab]", function () {
			window.LEAD_AUTOMATION_MEDIA_STATE.activeTab = String($(this).data("media-tab") || "images");
			$("[data-media-tab]").removeClass("active");
			$(this).addClass("active");
			leadAutomationMediaLoadList();
		});

	$(document)
		.off("click.leadAutomationMediaSave")
		.on("click.leadAutomationMediaSave", "[data-media-save]", function () {
			leadAutomationMediaSave();
		});

	$(document)
		.off("click.leadAutomationMediaDelete")
		.on("click.leadAutomationMediaDelete", "[data-media-delete]", function () {
			leadAutomationMediaDelete(String($(this).data("media-delete") || ""));
		});

	$(document)
		.off("click.leadAutomationMediaConfirmYes")
		.on("click.leadAutomationMediaConfirmYes", '[data-lead-automation-action="confirm-modal-yes"]', function () {
			var callback = window.LEAD_AUTOMATION_STATE.confirmCallback;
			leadAutomationCloseConfirmDialog();
			if (typeof callback === "function") {
				callback();
			}
		});

	$(document)
		.off("click.leadAutomationMediaConfirmCancel")
		.on("click.leadAutomationMediaConfirmCancel", '[data-lead-automation-action="confirm-modal-cancel"], [data-lead-automation-action="confirm-modal-close"]', function () {
			leadAutomationCloseConfirmDialog();
		});

	$(document)
		.off("click.leadAutomationMediaConfirmBackdrop")
		.on("click.leadAutomationMediaConfirmBackdrop", "#leadAutomationConfirmModal", function (event) {
			if (event.target === this) {
				leadAutomationCloseConfirmDialog();
			}
		});
}

$(function () {
	leadAutomationMediaBindEvents();
	leadAutomationMediaLoadList();
});
