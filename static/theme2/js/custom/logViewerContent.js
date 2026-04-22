function getLogViewerContent() {
	return `
	<style>
	.log-console-toolbar {
		padding: 0;
	}

	.log-console-toolbar label {
		font-size: 13px;
		font-weight: 700;
		color: #303030;
		display: block;
		margin-bottom: 6px;
		white-space: nowrap;
	}

	.log-console-toolbar .form-control,
	.log-console-toolbar .btn {
		height: 38px;
		font-size: 14px;
	}

	.log-console-toolbar .btn-primary {
		min-width: 120px;
	}

	.log-console-filter-row > div {
		margin-bottom: 12px;
	}

	.log-console-status {
		padding: 2px 0 10px;
		font-size: 12px;
		color: #555;
	}

	.log-console-output {
		background: #000;
		color: #f0f0f0;
		border: 1px solid #2d2d2d;
		border-radius: 4px;
		min-height: 320px;
		max-height: 560px;
		overflow: auto;
		padding: 12px;
		font-family: "Consolas", "Courier New", monospace;
		font-size: 13px;
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.log-highlight {
		background: #f7d24a;
		color: #111;
		padding: 0 1px;
		border-radius: 2px;
	}
	</style>

	<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
			<div class="page-title-heading">
				<div class="page-title-icon"><i class="fa fa-cog text-primary"></i></div>
				<div>ViewerLogs</div>
			</div>
		</div>
	</div>

	<div class="main-card mb-3 card">
		<div class="card-body">
			<div class="log-console-toolbar">
				<form id="logViewerSearchForm" class="row">
					<div class="row col-12 log-console-filter-row m-0 p-0">
						<div class="col-lg-2 col-md-6 col-sm-12">
							<label for="logViewerRegistryFile">Registry File</label>
							<select id="logViewerRegistryFile" class="form-control">
								<option value="custom">Custom File</option>
								<option value="configured">Configured Log File</option>
							</select>
						</div>
						<div class="col-lg-3 col-md-6 col-sm-12">
							<label for="logViewerPath">Log file path</label>
							<input type="text" class="form-control" id="logViewerPath"
								placeholder="/usr/local/src/logs/IS-LOGS/IS-DEBUG.log" autocomplete="off">
						</div>
						<div class="col-lg-2 col-md-6 col-sm-12">
							<label for="logViewerSearchTerm">Search Term</label>
							<input type="text" class="form-control" id="logViewerSearchTerm" placeholder="Search text">
						</div>
						<div class="col-lg-1 col-md-6 col-sm-12">
							<label for="logViewerResultLines">Results lines</label>
							<input type="number" class="form-control" id="logViewerResultLines" min="1" max="1000" value="10">
						</div>
						<div class="col-lg-2 col-md-6 col-sm-12">
							<label for="logViewerStartDateTime">Start DateTime</label>
							<input type="datetime-local" class="form-control" id="logViewerStartDateTime">
						</div>
						<div class="col-lg-2 col-md-6 col-sm-12">
							<label for="logViewerEndDateTime">End DateTime</label>
							<input type="datetime-local" class="form-control" id="logViewerEndDateTime">
						</div>
					</div>
					<div class="col-lg-12 mt-1 pl-0">
						<button type="submit" class="btn btn-primary" id="logViewerSearchBtn">Search</button>
						<button type="button" class="btn btn-dark ml-2" id="logViewerTailToggleBtn" data-live="off">Start Live</button>
					</div>
				</form>
			</div>

			<div id="logViewerStatus" class="log-console-status">Enter filters and click Search.</div>
			<pre id="logViewerOutput" class="log-console-output"></pre>
		</div>
	</div>
	`;
}

window.logViewerContent = (function () {
	function escapeHtml(value) {
		return String(value || "")
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");
	}

	function escapeRegex(value) {
		return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	function highlightRenderedLine(line, searchTerm) {
		var escapedLine = escapeHtml(line);
		var safeSearch = $.trim(searchTerm || "");
		if (!safeSearch) {
			return escapedLine;
		}
		var regex = new RegExp("(" + escapeRegex(safeSearch) + ")", "gi");
		return escapedLine.replace(regex, '<span class="log-highlight">$1</span>');
	}

	function setStatus(message, isError) {
		var $status = $("#logViewerStatus");
		$status.removeClass("text-danger text-muted").addClass(isError ? "text-danger" : "text-muted");
		$status.text(message || "");
	}

	function renderLines(resolvedPath, lines, searchTerm) {
		if (!lines || !lines.length) {
			$("#logViewerOutput").html("");
			return;
		}
		var rendered = [];
		for (var i = 0; i < lines.length; i++) {
			rendered.push(highlightRenderedLine((resolvedPath || "") + ": " + lines[i], searchTerm));
		}
		$("#logViewerOutput").html(rendered.join("\n"));
	}

	function appendLines(resolvedPath, lines, maxLines, searchTerm) {
		if (!lines || !lines.length) {
			return;
		}
		var existing = $("#logViewerOutput").text();
		var allLines = existing ? existing.split(/\r?\n/) : [];
		for (var i = 0; i < lines.length; i++) {
			allLines.push((resolvedPath || "") + ": " + lines[i]);
		}
		var safeLimit = parseInt(maxLines, 10);
		if (isNaN(safeLimit) || safeLimit <= 0) {
			safeLimit = 50;
		}
		if (allLines.length > safeLimit) {
			allLines = allLines.slice(allLines.length - safeLimit);
		}
		var rendered = [];
		for (var j = 0; j < allLines.length; j++) {
			rendered.push(highlightRenderedLine(allLines[j], searchTerm));
		}
		$("#logViewerOutput").html(rendered.join("\n"));
		var output = document.getElementById("logViewerOutput");
		if (output) {
			output.scrollTop = output.scrollHeight;
		}
	}

	function applyRegistryMode(defaultConfiguredPath) {
		var mode = $.trim($("#logViewerRegistryFile").val());
		if (mode === "configured") {
			$("#logViewerPath").val(defaultConfiguredPath).prop("readonly", true);
			return;
		}
		$("#logViewerPath").prop("readonly", false);
	}

	return {
		setStatus: setStatus,
		renderLines: renderLines,
		appendLines: appendLines,
		applyRegistryMode: applyRegistryMode
	};
})();
