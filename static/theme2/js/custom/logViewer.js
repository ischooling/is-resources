var LOG_VIEWER_TAIL_TIMER = null;
var LOG_VIEWER_TAIL_POSITION = -1;

function getLogViewerFilters() {
	return {
		logFilePath: $.trim($("#logViewerPath").val()),
		searchTerm: $.trim($("#logViewerSearchTerm").val()),
		resultLines: $.trim($("#logViewerResultLines").val()),
		startDateTime: $.trim($("#logViewerStartDateTime").val()),
		endDateTime: $.trim($("#logViewerEndDateTime").val())
	};
}

function getLogViewerDefaultPath() {
	try {
		return String(window.LOG_VIEWER_DEFAULT_PATH || "");
	} catch (e) {
		return "";
	}
}

function loadLogViewerDefaultPath() {
	return $.ajax({
		url: getURLForHTML("dashboard", "log-viewer-default-path"),
		type: "GET",
		dataType: "json"
	});
}

function getCurrentDateTimeLocal(offsetMinutes) {
	var now = new Date();
	if (typeof offsetMinutes === "number") {
		now = new Date(now.getTime() + offsetMinutes * 60000);
	}
	var local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return local.toISOString().slice(0, 16);
}

function applyLogViewerDefaults() {
	var defaultPath = getLogViewerDefaultPath();
	if (defaultPath) {
		$("#logViewerPath").val(defaultPath);
	}
	if (!$("#logViewerStartDateTime").val()) {
		$("#logViewerStartDateTime").val(getCurrentDateTimeLocal(-60));
	}
	if (!$("#logViewerEndDateTime").val()) {
		$("#logViewerEndDateTime").val(getCurrentDateTimeLocal(0));
	}
}

function validateLogViewerFilters(filters) {
	if (!filters.logFilePath) {
		logViewerContent.setStatus("Log file path is required.", true);
		return false;
	}
	if (!filters.startDateTime || !filters.endDateTime) {
		logViewerContent.setStatus("Start DateTime and End DateTime are required.", true);
		return false;
	}
	if (filters.startDateTime > filters.endDateTime) {
		logViewerContent.setStatus("End DateTime must be greater than or equal to Start DateTime.", true);
		return false;
	}
	var parsedLines = parseInt(filters.resultLines, 10);
	if (isNaN(parsedLines) || parsedLines <= 0) {
		logViewerContent.setStatus("Results lines must be a positive number.", true);
		return false;
	}
	return true;
}

function stopLogViewerTail() {
	if (LOG_VIEWER_TAIL_TIMER) {
		clearInterval(LOG_VIEWER_TAIL_TIMER);
		LOG_VIEWER_TAIL_TIMER = null;
	}
	$("#logViewerTailToggleBtn").attr("data-live", "off").text("Start Live");
}

function searchLogViewerData() {
	stopLogViewerTail();
	var filters = getLogViewerFilters();
	if (!validateLogViewerFilters(filters)) {
		return false;
	}

	logViewerContent.setStatus("Loading logs...", false);
	$("#logViewerOutput").html("");

	$.ajax({
		url: getURLForHTML("dashboard", "log-viewer-search"),
		type: "GET",
		dataType: "json",
		data: {
			logFilePath: filters.logFilePath,
			searchTerm: filters.searchTerm,
			resultLines: filters.resultLines,
			startDateTime: filters.startDateTime,
			endDateTime: filters.endDateTime
		},
		success: function (response) {
			var status = response && response.status ? response.status : "";
			if (status === "SESSIONOUT" && typeof redirectLoginPage === "function") {
				redirectLoginPage();
				return;
			}
			var isError = status && status !== "SUCCESS";
			logViewerContent.setStatus(response && response.message ? response.message : "", isError);
			logViewerContent.renderLines(response ? response.resolvedPath : "", response ? response.lines : []);
		},
		error: function () {
			logViewerContent.setStatus("Unable to load logs. Please try again.", true);
		}
	});
	return false;
}

function fetchLogViewerTail(initialLoad) {
	var filters = getLogViewerFilters();
	if (!filters.logFilePath) {
		logViewerContent.setStatus("Log file path is required.", true);
		stopLogViewerTail();
		return;
	}
	var parsedLines = parseInt(filters.resultLines, 10);
	if (isNaN(parsedLines) || parsedLines <= 0) {
		parsedLines = 50;
	}
	$.ajax({
		url: getURLForHTML("dashboard", "log-viewer-tail"),
		type: "GET",
		dataType: "json",
		global: false,
		data: {
			logFilePath: filters.logFilePath,
			searchTerm: filters.searchTerm,
			resultLines: parsedLines,
			position: initialLoad ? -1 : LOG_VIEWER_TAIL_POSITION,
			initialLoad: initialLoad
		},
		success: function (response) {
			var status = response && response.status ? response.status : "";
			if (status === "SESSIONOUT" && typeof redirectLoginPage === "function") {
				stopLogViewerTail();
				redirectLoginPage();
				return;
			}
			if (status !== "SUCCESS") {
				logViewerContent.setStatus(response && response.message ? response.message : "Tail failed.", true);
				stopLogViewerTail();
				return;
			}
			LOG_VIEWER_TAIL_POSITION = parseInt(response.nextPosition, 10);
			if (isNaN(LOG_VIEWER_TAIL_POSITION) || LOG_VIEWER_TAIL_POSITION < 0) {
				LOG_VIEWER_TAIL_POSITION = -1;
			}
			if (initialLoad) {
				logViewerContent.renderLines(response.resolvedPath || "", response.lines || []);
			} else {
				logViewerContent.appendLines(response.resolvedPath || "", response.lines || [], parsedLines);
			}
			logViewerContent.setStatus("Live streaming logs...", false);
		},
		error: function () {
			logViewerContent.setStatus("Unable to stream logs. Please try again.", true);
			stopLogViewerTail();
		}
	});
}

function toggleLogViewerTail() {
	var current = $("#logViewerTailToggleBtn").attr("data-live");
	if (current === "on") {
		stopLogViewerTail();
		logViewerContent.setStatus("Live stream stopped.", false);
		return;
	}
	LOG_VIEWER_TAIL_POSITION = -1;
	$("#logViewerTailToggleBtn").attr("data-live", "on").text("Stop Live");
	fetchLogViewerTail(true);
	LOG_VIEWER_TAIL_TIMER = setInterval(function () {
		fetchLogViewerTail(false);
	}, 2000);
}

function initLogViewer() {
	var $container = $("#dashboardContentInHTML");
	if (!$container.length || !$("#logViewerSearchForm").length) {
		return;
	}
	var defaultConfiguredPath = getLogViewerDefaultPath();
	if (defaultConfiguredPath) {
		$("#logViewerPath").val(defaultConfiguredPath);
	}
	applyLogViewerDefaults();
	defaultConfiguredPath = $.trim($("#logViewerPath").val());
	$container
		.off("change.logViewerMode", "#logViewerRegistryFile")
		.on("change.logViewerMode", "#logViewerRegistryFile", function () {
			logViewerContent.applyRegistryMode(defaultConfiguredPath);
		});
	logViewerContent.applyRegistryMode(defaultConfiguredPath);

	$container
		.off("submit.logViewerSearch", "#logViewerSearchForm")
		.on("submit.logViewerSearch", "#logViewerSearchForm", function (event) {
			event.preventDefault();
			searchLogViewerData();
		});

	$container
		.off("click.logViewerSearch", "#logViewerSearchBtn")
		.on("click.logViewerSearch", "#logViewerSearchBtn", function (event) {
			event.preventDefault();
			searchLogViewerData();
		});

	$container
		.off("click.logViewerTail", "#logViewerTailToggleBtn")
		.on("click.logViewerTail", "#logViewerTailToggleBtn", function (event) {
			event.preventDefault();
			toggleLogViewerTail();
		});

	loadLogViewerDefaultPath()
		.done(function (response) {
			if (!response || response.status !== "SUCCESS") {
				return;
			}
			var resolvedPath = $.trim(response.defaultLogFilePath || "");
			if (!resolvedPath) {
				return;
			}
			window.LOG_VIEWER_DEFAULT_PATH = resolvedPath;
			defaultConfiguredPath = resolvedPath;
			if (!$.trim($("#logViewerPath").val()) || $.trim($("#logViewerRegistryFile").val()) === "configured") {
				$("#logViewerPath").val(resolvedPath);
			}
			logViewerContent.applyRegistryMode(defaultConfiguredPath);
		});
}

async function renderLogViewerContent() {
	stopLogViewerTail();
	$("#dashboardContentInHTML").html(getLogViewerContent());
	initLogViewer();
}
