var enrAvailMasters = {
	loaded: false,
	countries: [],
	programs: [],
	grades: [],
};

var enrAvailRecords = [];
var enrAvailEditingId = null;
var ENR_AVAIL_PREVIEW_KEY = "enrAvailPreviewPayload";

var enrAvailSavedViewMode = "summary"; 
var enrAvailSavedFilters = { countryId: "", programId: "", gradeId: "", q: "" };
var enrAvailAppliedFilters = { countryId: "", programId: "", gradeId: "" };
var enrAvailSummaryDrill = { kind: "", id: "" };
var enrAvailSelectedIds = {};
var ENR_AVAIL_EDIT_FROM_PREVIEW_KEY = "enrAvailEditFromPreviewId";
var enrAvailEditCtx = null; 
var enrAvailInlineEditKey = ""; 
var enrAvailInlineLastEdited = {};
var enrAvailLastLoadRequest = null; 

window.enrAvailJumpToEdit = async function (id) {
	try {
		var rid = String(id || "");
		if (!rid) return;

		try {
			enrAvailSwitchTab("entry");
		} catch (e) {}

		var rec =
			(enrAvailRecords || []).find(function (r) {
				return r && String(r.id) === rid;
			}) || null;

		if (!rec) {
			try {
				await enrAvailLoadSeatsFromServer({ id: rid });
			} catch (e) {}
			rec =
				(enrAvailRecords || []).find(function (r) {
					return r && String(r.id) === rid;
				}) || null;
		}

		if (!rec) {
			enrAvailToast(0, "Record not found to edit");
			return;
		}
		enrAvailSavedFilters = {
			countryId: String(rec.countryId || ""),
			programId: String(rec.programId || ""),
			gradeId: String(rec.gradeId || ""),
			userId: USER_ID,
			q: "",
		};
		try {
			$("#enrAvailS_Search").val("");
		} catch (e) {}
		enrAvailSummaryDrill = { kind: "grade", id: String(rec.gradeId) + "||" + String(rec.countryId) };
		enrAvailEditingId = rid;

		enrAvailRenderSaved();
		try {
			setTimeout(function () {
				var el = document.getElementById("enrAvailSummaryEditor");
				if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 0);
		} catch (e) {}
	} catch (e) {}
};

	function enrAvailBeginSingleRecordEdit(id) {
		try {
			var rid = String(id || "");
			if (!rid) return false;

		var rec =
			(enrAvailRecords || []).find(function (r) {
				return r && String(r.id) === rid;
			}) || null;
		if (!rec) return false;
		if (!enrAvailEditCtx) {
			enrAvailEditCtx = {
				filters: Object.assign({}, enrAvailSavedFilters || {}),
				summaryDrill: Object.assign({}, enrAvailSummaryDrill || {}),
				viewMode: String(enrAvailSavedViewMode || "summary"),
			};
		}
		enrAvailSavedFilters = {
			countryId: String(rec.countryId || ""),
			programId: String(rec.programId || ""),
			gradeId: String(rec.gradeId || ""),
			userId: USER_ID,
			q: "",
		};
		try {
			$("#enrAvailS_Search").val("");
		} catch (e) {}
			enrAvailSummaryDrill = { kind: "grade", id: String(rec.gradeId) + "||" + String(rec.countryId) };
			enrAvailEditingId = rid;

		enrAvailRenderSaved();
		try {
			setTimeout(function () {
				var el = document.getElementById("enrAvailSummaryEditor");
				if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
			}, 0);
		} catch (e) {}
			return true;
		} catch (e) {
			return false;
		}
	}

	function enrAvailBeginSingleRecordEditWithDrill(id, drillKind, drillId) {
		try {
			var rid = String(id || "");
			if (!rid) return false;

			var rec =
				(enrAvailRecords || []).find(function (r) {
					return r && String(r.id) === rid;
				}) || null;
			if (!rec) return false;

			if (!enrAvailEditCtx) {
				enrAvailEditCtx = {
					filters: Object.assign({}, enrAvailSavedFilters || {}),
					summaryDrill: Object.assign({}, enrAvailSummaryDrill || {}),
					viewMode: String(enrAvailSavedViewMode || "summary"),
				};
			}
			enrAvailSavedFilters = {
				countryId: String(rec.countryId || ""),
				programId: String(rec.programId || ""),
				gradeId: String(rec.gradeId || ""),
				userId: USER_ID,
				q: "",
			};
			try {
				$("#enrAvailS_Search").val("");
			} catch (e) {}

			enrAvailSummaryDrill = { kind: String(drillKind || "grade"), id: String(drillId || "") };
			enrAvailEditingId = rid;

			enrAvailRenderSaved();
			try {
				setTimeout(function () {
					var el = document.getElementById("enrAvailSummaryEditor");
					if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 0);
			} catch (e) {}
			return true;
		} catch (e) {
			return false;
		}
	}

function enrAvailRecId() {
	return "enrAvailRec_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
}

function enrAvailSafeDomId(value) {
	return String(value === undefined || value === null ? "" : value).replace(/[^a-zA-Z0-9_-]/g, "_");
}

function enrAvailComboKey(countryId, programId, gradeId) {
	return (
		encodeURIComponent(String(countryId === undefined || countryId === null ? "" : countryId)) +
		"::" +
		encodeURIComponent(String(programId === undefined || programId === null ? "" : programId)) +
		"::" +
		encodeURIComponent(String(gradeId === undefined || gradeId === null ? "" : gradeId))
	);
}

function enrAvailParseComboKey(key) {
	var s = String(key || "");
	var parts = s.split("::");
	return {
		countryId: decodeURIComponent(parts[0] || ""),
		programId: decodeURIComponent(parts[1] || ""),
		gradeId: decodeURIComponent(parts[2] || ""),
	};
}

function enrAvailIsRealId(id) {
	return /^[0-9]+$/.test(String(id || ""));
}

function enrAvailIsRealRecord(r) {
	return !!(r && enrAvailIsRealId(r.id));
}

async function renderEnrollmentAvalabilityContent() {
	$("#dashboardContentInHTML").html(getEnrollmentAvailabilityContent());
	await enrAvailLoadMasters();
	enrAvailInitUI();
	enrAvailRenderSaved();
}

function enrAvailInitUI() {
	$("#enrAvailNavEntry").off("click").on("click", function () {
		enrAvailSwitchTab("entry");
	});
	$("#enrAvailNavView").off("click").on("click", function () {
		enrAvailSwitchTab("view");
	});
	$("#enrAvailViewBtn").off("click").on("click", function () {
		enrAvailOpenViewInNewTab();
	});

	$("#enrAvailS_Load").off("click").on("click", async function () {
		var request = enrAvailGetFilterRequestFromUI();
		if (!enrAvailHasRequiredFilters(request)) {
			enrAvailToast(0, "Please select Country first");
			return;
		}
		enrAvailAppliedFilters = {
			countryId: String(request.countryId || ""),
			programId: String(request.programId || ""),
			gradeId: String(request.gradeId || ""),
		};
		await enrAvailLoadSeatsFromServer(request);
		try {
			enrAvailUpdatePreviewCache();
		} catch (e) {}
		enrAvailRenderSaved();
	});

	$("#enrAvailAddBtn").off("click").on("click", function () {
		enrAvailAddRow();
	});
	$("#enrAvailSaveBtn").off("click").on("click", function () {
		enrAvailSaveAll();
	});

	$("#enrAvailDeleteSelectedBtn").off("click").on("click", function () {
		enrAvailDeleteSelected();
	});

	$("#enrAvailSelAll")
		.off("change")
		.on("change", function () {
			enrAvailToggleSelectAll($(this).is(":checked"));
		});

	// Global selection handlers (works in Table + Summary drill)
	$(document)
		.off("change.enrAvailSelOne", ".enrAvailSelOne")
		.on("change.enrAvailSelOne", ".enrAvailSelOne", function () {
			var id = $(this).attr("data-id") || "";
			if (!id) return;
			if ($(this).is(":checked")) enrAvailSelectedIds[String(id)] = true;
			else delete enrAvailSelectedIds[String(id)];
			enrAvailUpdateSelectionUI();
			enrAvailUpdateSelectAllState();
			enrAvailUpdateDrillSelectAllState();
		});

	$(document)
		.off("change.enrAvailSelAllDrill", ".enrAvailSelAllDrill")
		.on("change.enrAvailSelAllDrill", ".enrAvailSelAllDrill", function () {
			var kind = $(this).attr("data-kind") || "";
			var gid = $(this).attr("data-groupid") || "";
			var checked = $(this).is(":checked");
			enrAvailToggleSelectGroup(kind, gid, checked);
		});

	$("#enrAvailEntryRows").off("input change").on("input change", "input, select", function (e) {
		enrAvailCalcRow(e.target);
	});
	$("#enrAvailEntryRows").off("click").on("click", ".rm-btn", function () {
		var rowId = $(this).attr("data-rowid");
		enrAvailRmRow(rowId);
	});

	enrAvailInitSavedSummaryUI();
	enrAvailSeedIfEmpty();
}

function enrAvailMonthLabel(ts) {
	try {
		var d = ts ? new Date(ts) : new Date();
		return d.toLocaleString(undefined, { month: "long", year: "numeric" });
	} catch (e) {
		return "";
	}
}

function enrAvailSetSavedViewMode(mode) {
	enrAvailSavedViewMode = mode === "table" ? "table" : "summary";
	var isSummary = enrAvailSavedViewMode === "summary";

	$("#enrAvailSavedViewSummary").toggleClass("active", isSummary);
	$("#enrAvailSavedViewSummary").toggleClass("btn-primary btn-shadow", isSummary);
	$("#enrAvailSavedViewSummary").toggleClass("btn-white border", !isSummary);

	$("#enrAvailSavedViewTable").toggleClass("active", !isSummary);
	$("#enrAvailSavedViewTable").toggleClass("btn-primary btn-shadow", !isSummary);
	$("#enrAvailSavedViewTable").toggleClass("btn-white border", isSummary);

	$("#enrAvailSavedSummary").toggleClass("d-none", !isSummary);
	$("#enrAvailSavedTable").toggleClass("d-none", isSummary);
}

function enrAvailFindProgramById(programId) {
	return (enrAvailMasters.programs || []).find(function (x) {
		return String(x && x.id) === String(programId || "");
	});
}

function enrAvailIsFlexyProgramSelection(programId) {
	var program = enrAvailFindProgramById(programId);
	var label = String((program && program.label) || "").trim().toLowerCase();
	return label === "flexy program";
}

function enrAvailIsDualDiplomaProgramSelection(programId) {
	var program = enrAvailFindProgramById(programId);
	var label = String((program && program.label) || "").trim().toLowerCase();
	return label === "dual diploma";
}

function enrAvailAllowedSavedSummaryGrades(programId) {
	var allGrades = enrAvailMasters.grades || [];
	return allGrades.filter(function (g) {
		var label = String((g && g.label) || "").trim();
		if (!label) return false;
		if (enrAvailIsDualDiplomaProgramSelection(programId)) {
			return /^Grade (9|10|11|12)$/i.test(label);
		}
		if (enrAvailIsFlexyProgramSelection(programId)) {
			return /^Flexy/i.test(label);
		}
		return /^Grade (K|[1-9]|1[0-2])$/i.test(label);
	});
}

function enrAvailPopulateSavedSummaryGradeFilter() {
	var $g = $("#enrAvailS_FGrade");
	if (!$g.length) return;

	if ($.fn && $.fn.select2) {
		try {
			if ($g.hasClass("select2-hidden-accessible")) $g.select2("destroy");
		} catch (e) {}
	}

	var opt = function (label, value, selected) {
		return '<option value="' + enrAvailEsc(value) + '" ' + (selected ? "selected" : "") + ">" + enrAvailEsc(label) + "</option>";
	};
	var allowedGrades = enrAvailAllowedSavedSummaryGrades(enrAvailSavedFilters.programId);
	var hasSelectedGrade = allowedGrades.some(function (x) {
		return String(x && x.id) === String(enrAvailSavedFilters.gradeId || "");
	});
	if (!hasSelectedGrade) {
		enrAvailSavedFilters.gradeId = "";
	}

	var gHtml = opt("Select Grade", "", enrAvailSavedFilters.gradeId === "");
	gHtml += allowedGrades
		.map(function (x) {
			return opt(x.label, x.id, String(enrAvailSavedFilters.gradeId) === String(x.id));
		})
		.join("");
	$g.html(gHtml);

	if ($.fn && $.fn.select2) {
		try {
			$g.select2({ width: "100%", minimumResultsForSearch: 0 });
		} catch (e) {}
	}
}

function enrAvailPopulateSavedSummaryFilters() {
	var $c = $("#enrAvailS_FCountry");
	var $p = $("#enrAvailS_FProgram");
	var $g = $("#enrAvailS_FGrade");
	if (!$g.length || !$p.length || !$c.length) return;

	if ($.fn && $.fn.select2) {
		try {
			if ($c.hasClass("select2-hidden-accessible")) $c.select2("destroy");
			if ($p.hasClass("select2-hidden-accessible")) $p.select2("destroy");
			if ($g.hasClass("select2-hidden-accessible")) $g.select2("destroy");
		} catch (e) {}
	}

	var opt = function (label, value, selected) {
		return '<option value="' + enrAvailEsc(value) + '" ' + (selected ? "selected" : "") + ">" + enrAvailEsc(label) + "</option>";
	};

	var pHtml = opt("Select Program", "", enrAvailSavedFilters.programId === "");
	pHtml += (enrAvailMasters.programs || [])
		.slice(0)
		.sort(function (a, b) {
			var ai = enrAvailProgramSequenceIndex(a && a.label);
			var bi = enrAvailProgramSequenceIndex(b && b.label);
			if (ai !== bi) return ai - bi;
			return String((a && a.label) || "").localeCompare(String((b && b.label) || ""));
		})
		.map(function (x) {
			return opt(x.label, x.id, String(enrAvailSavedFilters.programId) === String(x.id));
		})
		.join("");
	$p.html(pHtml);

	var cHtml = opt("Select Country", "", enrAvailSavedFilters.countryId === "");
	cHtml += (enrAvailMasters.countries || [])
		.map(function (x) {
			return opt(x.label, x.id, String(enrAvailSavedFilters.countryId) === String(x.id));
		})
		.join("");
	$c.html(cHtml);

	if ($.fn && $.fn.select2) {
		try {
			$c.select2({ width: "100%", minimumResultsForSearch: 0 });
			$p.select2({ width: "100%", minimumResultsForSearch: 0 });
		} catch (e) {}
	}
	enrAvailPopulateSavedSummaryGradeFilter();
}

function enrAvailUpdateSavedSummaryPills() {
	if ($("#enrAvailS_Month").length) $("#enrAvailS_Month").text(enrAvailMonthLabel());

	var gradeLabel = "Select Grade";
	if (enrAvailSavedFilters.gradeId) {
		var g = (enrAvailMasters.grades || []).find(function (x) {
			return String(x.id) === String(enrAvailSavedFilters.gradeId);
		});
		if (g && g.label) gradeLabel = g.label;
	}
	if ($("#enrAvailS_GradePill").length) $("#enrAvailS_GradePill").text(gradeLabel);

	var countryLabel = "Select Country";
	if (enrAvailSavedFilters.countryId) {
		var c = (enrAvailMasters.countries || []).find(function (x) {
			return String(x.id) === String(enrAvailSavedFilters.countryId);
		});
		if (c && c.label) countryLabel = c.label;
	}
	if ($("#enrAvailS_CountryPill1").length) $("#enrAvailS_CountryPill1").text(countryLabel);
	if ($("#enrAvailS_CountryPill2").length) $("#enrAvailS_CountryPill2").text(countryLabel);
}

function enrAvailHasRequiredFilters(filters) {
	try {
		var data = filters || {};
		return !!String(data.countryId || "");
	} catch (e) {
		return false;
	}
}

function enrAvailResetLoadedData() {
	enrAvailRecords = [];
	enrAvailLastLoadRequest = null;
	enrAvailEditingId = null;
	enrAvailInlineEditKey = "";
}

function enrAvailUpdateLoadButtonState() {
	var canLoad = enrAvailHasRequiredFilters(enrAvailSavedFilters);
	if ($("#enrAvailS_Load").length) $("#enrAvailS_Load").prop("disabled", !canLoad);
}

function enrAvailFiltersMatchLoadRequest(filters, loadRequest) {
	try {
		var current = filters || {};
		var applied = loadRequest || {};
		return (
			String(applied.countryId || "") === String(current.countryId || "") &&
			String(applied.programId || "") === String(current.programId || "") &&
			String(applied.gradeId || "") === String(current.gradeId || "")
		);
	} catch (e) {
		return false;
	}
}

function enrAvailHasAppliedSelection() {
	try {
		if (enrAvailEditingId) return true;
		if (!enrAvailHasRequiredFilters(enrAvailAppliedFilters)) return false;
		if (!enrAvailLastLoadRequest) return false;
		return enrAvailFiltersMatchLoadRequest(enrAvailAppliedFilters, enrAvailLastLoadRequest);
	} catch (e) {
		return false;
	}
}

	function enrAvailInitSavedSummaryUI() {
	try {
		enrAvailSavedViewMode = "summary";
		if ($("#enrAvailSavedViewTable").length) $("#enrAvailSavedViewTable").addClass("d-none");
		if ($("#enrAvailSavedTable").length) $("#enrAvailSavedTable").addClass("d-none");
	} catch (e) {}

	$("#enrAvailSavedViewSummary")
		.off("click")
		.on("click", function () {
			enrAvailSetSavedViewMode("summary");
		});

	$("#enrAvailS_Clear")
		.off("click")
		.on("click", function () {
			enrAvailSavedFilters = { countryId: "", programId: "", gradeId: "", q: "" };
			enrAvailAppliedFilters = { countryId: "", programId: "", gradeId: "" };
			$("#enrAvailS_Search").val("");
			enrAvailResetLoadedData();
			enrAvailPopulateSavedSummaryFilters();
			enrAvailUpdateSavedSummaryPills();
			enrAvailUpdateLoadButtonState();
			enrAvailRenderSavedSummary();
			try {
				enrAvailUpdatePreviewCache();
			} catch (e) {}
		});

	$("#enrAvailS_FGrade")
		.off("change")
		.on("change", function () {
			enrAvailSavedFilters.gradeId = $(this).val() || "";
			enrAvailUpdateSavedSummaryPills();
			enrAvailUpdateLoadButtonState();
			enrAvailRenderSavedSummary();
		});
	$("#enrAvailS_FProgram")
		.off("change")
		.on("change", function () {
			enrAvailSavedFilters.programId = $(this).val() || "";
			enrAvailPopulateSavedSummaryGradeFilter();
			enrAvailUpdateSavedSummaryPills();
			enrAvailUpdateLoadButtonState();
			enrAvailRenderSavedSummary();
		});
	$("#enrAvailS_FCountry")
		.off("change")
		.on("change", function () {
			enrAvailSavedFilters.countryId = $(this).val() || "";
			try {
				enrAvailUpdatePreviewCache();
			} catch (e) {}
			enrAvailUpdateLoadButtonState();
			enrAvailRenderSavedSummary();
		});
	$("#enrAvailS_Search")
		.off("input")
		.on("input", function () {
			enrAvailSavedFilters.q = String($(this).val() || "").trim();
			enrAvailRenderSavedSummary();
		});

		$(document)
			.off("click.enrAvailSummary", ".enrAvailSumEditBtn")
			.on("click.enrAvailSummary", ".enrAvailSumEditBtn", function (e) {
			try {
				e.preventDefault();
				e.stopPropagation();
			} catch (ex) {}
				var kind = $(this).attr("data-kind") || "";
				var id = $(this).attr("data-id") || "";
				enrAvailSummaryEdit(kind, id);
			});

		// Inline Free/Rsv/Wait editor (delegate)
		$(document)
			.off("click.enrAvailInlineEdit", ".enrAvailInlineEditBtn")
			.on("click.enrAvailInlineEdit", ".enrAvailInlineEditBtn", function (e) {
				try {
					e.preventDefault();
					e.stopPropagation();
				} catch (ex) {}
				enrAvailInlineEditKey = String($(this).attr("data-key") || "");
				try {
					if (enrAvailInlineEditKey) delete enrAvailInlineLastEdited[enrAvailInlineEditKey];
				} catch (ex) {}
				enrAvailRenderSavedSummary();
			});
		$(document)
			.off("click.enrAvailInlineCancel", ".enrAvailInlineCancelBtn")
			.on("click.enrAvailInlineCancel", ".enrAvailInlineCancelBtn", function (e) {
				try {
					e.preventDefault();
					e.stopPropagation();
				} catch (ex) {}
				enrAvailInlineEditKey = "";
				// no need to keep last-edited hints after cancel
				try {
					delete enrAvailInlineLastEdited[String($(this).attr("data-key") || "")];
				} catch (ex) {}
				enrAvailRenderSavedSummary();
			});
			$(document)
				.off("click.enrAvailInlineSave", ".enrAvailInlineSaveBtn")
				.on("click.enrAvailInlineSave", ".enrAvailInlineSaveBtn", function (e) {
					try {
						e.preventDefault();
						e.stopPropagation();
					} catch (ex) {}
					var key = String($(this).attr("data-key") || "");
					if (key) enrAvailSaveInlineTotalFreeRsvWait(key);
				});

			// Inline Total/Free/Rsv/Wait sync (delegate)
		$(document)
			.off("input.enrAvailInlineSync change.enrAvailInlineSync", ".enrAvailInlineInput")
			.on("input.enrAvailInlineSync change.enrAvailInlineSync", ".enrAvailInlineInput", function () {
				try {
					var key = String($(this).attr("data-key") || "");
					var field = String($(this).attr("data-field") || "");
					if (key && field) {
						enrAvailInlineLastEdited[key] = field;
						enrAvailSyncInlineSeatFields(key);
					}
				} catch (e) {}
			});

			enrAvailPopulateSavedSummaryFilters();
			enrAvailUpdateSavedSummaryPills();
			enrAvailUpdateLoadButtonState();
			enrAvailSetSavedViewMode(enrAvailSavedViewMode);
		}

async function enrAvailLoadSeatsFromServer() {
	try {
		var payload = arguments && arguments.length ? arguments[0] : {};
		payload = payload || {};

		// Require country for list loads; program/grade remain optional. Allow id-based fetch.
		try {
			var hasId = payload && String(payload.id || "");
			if (!hasId && !enrAvailHasRequiredFilters(payload)) {
				enrAvailResetLoadedData();
				return;
			}
		} catch (e) {}

		// remember last successful load context (for reload after save/delete)
		try {
			if (payload && enrAvailHasRequiredFilters(payload)) {
				enrAvailLastLoadRequest = {
					countryId: String(payload.countryId || ""),
					programId: String(payload.programId || ""),
					gradeId: String(payload.gradeId || ""),
					userId: USER_ID,
				};
			}
		} catch (e) {}

		var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, false, "get-enrollment-availability-seats", payload, "dashboard");
		if (data && String(data.status) === "1") {
			enrAvailRecords =
				(data.records || []).map(function (r) {
					var total = r.total || 0;
					var booked = r.booked || 0;
					var about = r.about || 0; // reserved (pending)
					var wait = r.waitlist !== undefined ? r.waitlist : r.wait;
					if (wait === undefined || wait === null || wait === "") wait = 0;
					var seatMeta = enrAvailCalcSeatMeta(total, booked, about, wait);
					return {
						id: r.id,
						countryId: r.countryId,
						country: enrAvailLabelById(enrAvailMasters.countries, r.countryId),
						programId: r.programId,
						program: enrAvailLabelById(enrAvailMasters.programs, r.programId),
						gradeId: r.gradeId,
						grade: enrAvailLabelById(enrAvailMasters.grades, r.gradeId),
						total: total,
						booked: booked,
						about: about,
						free: seatMeta.free,
						wait: seatMeta.wait,
						overbooked: seatMeta.overbooked,
						remaining: seatMeta.free,
						lastYearStrength: r.lastYearStrength || 0,
					};
				}) || [];
		}
	} catch (e) {
		// keep existing in-memory list if API fails
	}

	// Dummy feed (for localhost/demo)
	// enrAvailSeedDummyRecordsIfNeeded();
}

function enrAvailGetFilterRequestFromUI() {
	try {
		return {
			countryId: String($("#enrAvailS_FCountry").val() || ""),
			programId: String($("#enrAvailS_FProgram").val() || ""),
			gradeId: String($("#enrAvailS_FGrade").val() || ""),
			userId: USER_ID,
		};
	} catch (e) {
		return {};
	}
}

function enrAvailIsLocalhost() {
	try {
		var h = (window && window.location && window.location.hostname) || "";
		return h === "localhost" || h === "127.0.0.1" || h === "::1";
	} catch (e) {
		return false;
	}
}

// function enrAvailSeedDummyRecordsIfNeeded() {
// 	try {
// 		if (!enrAvailMasters || !enrAvailMasters.loaded) return;
// 		if (!(enrAvailMasters.countries || []).length || !(enrAvailMasters.programs || []).length || !(enrAvailMasters.grades || []).length) return;
// 		if (!enrAvailIsLocalhost()) return;

// 		var realCount = (enrAvailRecords || []).filter(function (r) {
// 			return r && !r.__dummy;
// 		}).length;
// 		// If you already have enough real data, don't pollute with dummy
// 		if (realCount >= 10) return;

// 		// Ensure at least 10 countries exist for dummy demo
// 		var desiredCountries = ["India", "United States", "United Kingdom", "UAE", "Singapore", "Canada", "Australia", "Germany", "France", "Japan"];
// 		var countriesList = enrAvailMasters.countries || [];
// 		var countriesByLabel = {};
// 		countriesList.forEach(function (x) {
// 			countriesByLabel[String(x.label || "").toLowerCase()] = x;
// 		});

// 		var countries = [];
// 		desiredCountries.forEach(function (name, idx) {
// 			var hit = null;
// 			var lower = String(name).toLowerCase();
// 			// try exact
// 			if (countriesByLabel[lower]) hit = countriesByLabel[lower];
// 			// try partial match
// 			if (!hit) {
// 				for (var i = 0; i < countriesList.length; i++) {
// 					var lbl = String(countriesList[i].label || "").toLowerCase();
// 					if (lbl && (lbl.indexOf(lower) >= 0 || lower.indexOf(lbl) >= 0)) {
// 						hit = countriesList[i];
// 						break;
// 					}
// 				}
// 			}
// 			if (!hit) {
// 				hit = { id: "DUMMY_COUNTRY_" + (idx + 1), label: name };
// 				countriesList.push(hit);
// 			}
// 			countries.push(hit);
// 		});

// 		var programs = (enrAvailMasters.programs || []).slice(0, 4);
// 		var grades = (enrAvailMasters.grades || []).slice(0, 12);
// 		if (!countries.length || !programs.length || !grades.length) return;

// 		// Avoid duplicates with existing records
// 		var existing = {};
// 		(enrAvailRecords || []).forEach(function (r) {
// 			if (!r) return;
// 			var k = String(r.countryId) + "|" + String(r.programId) + "|" + String(r.gradeId);
// 			existing[k] = true;
// 		});

// 		var recs = [];
// 		var seed = 17;
// 		function rnd(min, max) {
// 			seed = (seed * 9301 + 49297) % 233280;
// 			var r = seed / 233280;
// 			return Math.floor(min + r * (max - min + 1));
// 		}

// 		countries.forEach(function (c, ci) {
// 			var g = grades[ci % grades.length];
// 			programs.forEach(function (p, pi) {
// 				var total = rnd(40, 140);
// 				var booked = rnd(10, Math.max(10, total - 5));
// 				var about = rnd(0, 40);
// 				var seatMeta = enrAvailCalcSeatMeta(total, booked, about, 0);

// 				var rec = {
// 					id: enrAvailRecId(),
// 					countryId: c.id,
// 					country: c.label,
// 					programId: String(p.id || ""),
// 					program: p.label,
// 					gradeId: g.id,
// 					grade: g.label,
// 					total: total,
// 					booked: booked,
// 					remaining: seatMeta.free,
// 					about: about,
// 					free: seatMeta.free,
// 					wait: seatMeta.wait,
// 					overbooked: seatMeta.overbooked,
// 					__dummy: true,
// 				};
// 				var key = String(rec.countryId) + "|" + String(rec.programId) + "|" + String(rec.gradeId);
// 				if (!existing[key]) {
// 					existing[key] = true;
// 					recs.push(rec);
// 				}
// 			});
// 		});

// 		// Add a couple of overbooked examples for demo (e.g. 20 seats, 21 students)
// 		if (recs.length >= 1) {
// 			recs[0].total = 20;
// 			recs[0].booked = 21;
// 			recs[0].about = 0;
// 			recs[0].wait = 0;
// 			recs[0].remaining = enrAvailCalcSeatMeta(recs[0].total, recs[0].booked, recs[0].about, recs[0].wait).free;
// 			recs[0].free = recs[0].remaining;
// 			recs[0].overbooked = enrAvailCalcSeatMeta(recs[0].total, recs[0].booked, recs[0].about, recs[0].wait).overbooked;
// 		}
// 		if (recs.length >= 2) {
// 			recs[1].total = 50;
// 			recs[1].booked = 45;
// 			recs[1].about = 10;
// 			recs[1].wait = 0;
// 			recs[1].remaining = enrAvailCalcSeatMeta(recs[1].total, recs[1].booked, recs[1].about, recs[1].wait).free;
// 			recs[1].free = recs[1].remaining;
// 			recs[1].overbooked = enrAvailCalcSeatMeta(recs[1].total, recs[1].booked, recs[1].about, recs[1].wait).overbooked;
// 		}

// 		enrAvailRecords = (enrAvailRecords || []).concat(recs);
// 	} catch (e) {
// 		// ignore dummy seeding errors
// 	}
// }

function enrAvailUpdatePreviewCache() {
	try {
		var html = enrAvailRecords.length ? enrAvailRenderCounselorPreview() : "";
		if (!html) {
			html = '<div class="text-muted text-center py-5">no records - go to entry tab and save some data</div>';
		}

		localStorage.setItem(
			ENR_AVAIL_PREVIEW_KEY,
			JSON.stringify({
				ts: Date.now(),
				title: "Enrollment Availability — View Records",
				html: html,
			})
		);
	} catch (e) {
		// ignore (localStorage may be blocked)
	}
}

function enrAvailOpenViewInNewTab() {
	enrAvailUpdatePreviewCache();

	var w = null;
	var url = "";
	try {
		var base = typeof BASE_URL !== "undefined" ? String(BASE_URL || "") : "";
		var ctx = typeof CONTEXT_PATH !== "undefined" ? String(CONTEXT_PATH || "") : "";
		var school = typeof SCHOOL_UUID !== "undefined" ? String(SCHOOL_UUID || "") : "";
		if (school) {
			url = base + ctx + school + "/dashboard/enrollment-availability-view?hideActivityTimer=1";
		}
	} catch (e) {}
	try {
		w = window.open(url || "", "_blank");
	} catch (e) {}

	if (!w) {
		// popup blocked -> fallback to in-page view
		enrAvailSwitchTab("view");
		enrAvailToast(2, "Popup blocked — showing View Records here");
		return;
	}

	// If we could open a real URL, stop here (refresh will work on that page).
	if (url) {
		return;
	}

	var cssHref = typeof PATH_FOLDER_CSS2 !== "undefined" ? PATH_FOLDER_CSS2 + "app.css" + (typeof SCRIPT_VERSION !== "undefined" ? SCRIPT_VERSION : "") : "";
	var cssSelect2Href = typeof PATH_FOLDER_CSS2 !== "undefined" ? PATH_FOLDER_CSS2 + "select2.min.css" + (typeof SCRIPT_VERSION !== "undefined" ? SCRIPT_VERSION : "") : "";
	var jqHref = typeof PATH_FOLDER_JS2 !== "undefined" ? PATH_FOLDER_JS2 + "jquery-3.3.1.min.js" + (typeof SCRIPT_VERSION !== "undefined" ? SCRIPT_VERSION : "") : "";
	var select2Href = typeof PATH_FOLDER_JS2 !== "undefined" ? PATH_FOLDER_JS2 + "select2.min.js" + (typeof SCRIPT_VERSION !== "undefined" ? SCRIPT_VERSION : "") : "";

	var headerHTML = "";
	var footerHTML = "";
	try {
		headerHTML =
			($(".app-header").length && $(".app-header")[0].outerHTML) ||
			($("header").length && $("header")[0].outerHTML) ||
			"";
		footerHTML =
			($(".app-footer").length && $(".app-footer")[0].outerHTML) ||
			($("footer").length && $("footer")[0].outerHTML) ||
			"";
	} catch (e) {}

	var hasShell = !!(headerHTML || footerHTML);

	var doc =
		"<!doctype html>" +
		'<html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>' +
		"<title>Enrollment Availability — View Records</title>" +
		(cssHref ? '<link rel="stylesheet" href="' + cssHref + '"/>' : "") +
		(cssSelect2Href ? '<link rel="stylesheet" href="' + cssSelect2Href + '"/>' : "") +
		"<style>html,body{height:100%;}body{min-height:100vh;display:flex;flex-direction:column;}#enrAvailPreviewMain{flex:1 0 auto;}footer,.app-footer{margin-top:auto;text-align:center !important;}.app-footer .app-footer__inner{justify-content:center !important;}.app-footer .app-footer__inner>div{justify-content:center !important;}/* select2 tidy */.select2-container--default .select2-selection--single{min-height:32px;border-radius:10px;border:1px solid #e3e6f0;}.select2-container--default .select2-selection--single .select2-selection__rendered{line-height:30px;padding-left:10px;}.select2-container--default .select2-selection--single .select2-selection__arrow{height:30px;right:6px;}.select2-container{min-width:0;}</style>" +
		"</head>" +
		'<body style="background:#f4f7fe;">' +
		'<div id="enrAvailPreviewMain">' +
		(hasShell ? headerHTML : "") +
		'<div class="container-fluid py-3 px-4">' +
		(hasShell ? "" : '<div class="d-flex align-items-center justify-content-between mb-3 flex-wrap"><div class="font-weight-bold font-20 text-dark">Enrollment Availability</div></div>') +
		'<div id="enrAvailPreviewRoot"></div>' +
		"</div>" +
		"</div>" +
		(hasShell ? footerHTML : "") +
		(jqHref ? '<script src="' + jqHref + '"></script>' : "") +
		(select2Href ? '<script src="' + select2Href + '"></script>' : "") +
		"<script>(function(){function qa(s){try{return Array.prototype.slice.call(document.querySelectorAll(s));}catch(e){return[];}}function q(s){try{return document.querySelector(s);}catch(e){return null;}}function norm(s){return String(s||'').toLowerCase().replace(/\\s+/g,' ').trim();}function val(el){try{return norm((el&&el.value)||'');}catch(e){return'';}}function toInt(x){var n=parseInt(String(x||''),10);return isNaN(n)?0:n;}function hasSelect2(el){try{return !!(window.jQuery&&jQuery.fn&&jQuery.fn.select2&&el&&jQuery(el).hasClass('select2-hidden-accessible'));}catch(e){return false;}}function clearEl(el){if(!el)return;try{if(hasSelect2(el)){jQuery(el).val('').trigger('change');return;}}catch(e){}try{el.value='';}catch(e2){}}function init(){var root=q('#enrAvailPreviewRoot');if(!root)return;var raw=null;try{raw=localStorage.getItem('" +
			ENR_AVAIL_PREVIEW_KEY +
			"');}catch(e){}if(!raw){root.innerHTML='<div class=\"text-muted text-center py-5\">No preview data</div>';return;}var d={};try{d=JSON.parse(raw)||{};}catch(e2){d={};}document.title=d.title||document.title;root.innerHTML=d.html||'';var strip=q('#enrAvailFilterStrip');if(!strip)return;var selCountry=q('#enrAvailF_Country');var selProgram=q('#enrAvailF_Program');var selGrade=q('#enrAvailF_Grade');var btnClear=q('#enrAvailF_Clear');var countEl=q('#enrAvailF_Count');var titleEl=q('#enrAvailCH_Title');var subEl=q('#enrAvailCH_Subtitle');var statTotal=q('#enrAvailS_Total');var statAvail=q('#enrAvailS_Available');var statRes=q('#enrAvailS_Reserved');var statCon=q('#enrAvailS_Confirmed');var statWait=q('#enrAvailS_Wait');var barTotal=q('#enrAvailBar_Total');var barAvail=q('#enrAvailBar_Available');var barRes=q('#enrAvailBar_Reserved');var barCon=q('#enrAvailBar_Confirmed');var barWait=q('#enrAvailBar_Wait');var rows=qa('.enrAvailRecRow');var emptyRow=q('#enrAvailCounselorEmpty');function pct(x,total){return total?Math.max(0,Math.min(100,Math.round((x/total)*100))):0;}function apply(){var fc=val(selCountry),fp=val(selProgram),fg=val(selGrade);var visible=0,sumTotal=0,sumBooked=0,sumAbout=0,sumRemaining=0,sumWait=0,sumOverbooked=0;rows.forEach(function(row){var ok=true;var rc=norm(row.getAttribute('data-enr-country'));var rp=norm(row.getAttribute('data-enr-program'));var rg=norm(row.getAttribute('data-enr-grade'));if(fc&&rc!==fc)ok=false;if(ok&&fp&&rp!==fp)ok=false;if(ok&&fg&&rg!==fg)ok=false;row.style.display=ok?'':'none';if(ok){visible++;sumTotal+=toInt(row.getAttribute('data-enr-total'));sumBooked+=toInt(row.getAttribute('data-enr-booked'));sumAbout+=toInt(row.getAttribute('data-enr-about'));sumRemaining+=toInt(row.getAttribute('data-enr-free')||row.getAttribute('data-enr-remaining'));sumWait+=toInt(row.getAttribute('data-enr-wait'));sumOverbooked+=toInt(row.getAttribute('data-enr-overbooked'));}});if(countEl)countEl.textContent=visible.toLocaleString()+' record'+(visible===1?'':'s');if(emptyRow)emptyRow.style.display=visible?'none':'';var ctx=[];if(fg)ctx.push((selGrade&&selGrade.value)||'');if(fp)ctx.push((selProgram&&selProgram.value)||'');if(fc)ctx.push((selCountry&&selCountry.value)||'');var ctxTxt=ctx.length?(' — '+ctx.join(' · ')):'';if(titleEl)titleEl.textContent=sumRemaining.toLocaleString()+' seats available'+ctxTxt;if(subEl)subEl.textContent=sumBooked.toLocaleString()+' confirmed enrollments · '+sumAbout.toLocaleString()+' reserved (pending) · '+sumWait.toLocaleString()+' waitlist · '+sumOverbooked.toLocaleString()+' overbooked · '+sumTotal.toLocaleString()+' total seats';if(statTotal)statTotal.textContent=sumTotal.toLocaleString();if(statAvail)statAvail.textContent=sumRemaining.toLocaleString();if(statRes)statRes.textContent=sumAbout.toLocaleString();if(statCon)statCon.textContent=sumBooked.toLocaleString();if(statWait)statWait.textContent=sumWait.toLocaleString();if(barTotal)barTotal.style.width='100%';if(barAvail)barAvail.style.width=pct(sumRemaining,sumTotal)+'%';if(barRes)barRes.style.width=pct(sumAbout,sumTotal)+'%';if(barCon)barCon.style.width=pct(sumBooked,sumTotal)+'%';if(barWait)barWait.style.width=pct(sumWait,sumTotal)+'%';}function bind(el){if(!el||!el.addEventListener)return;['change','input'].forEach(function(evt){try{el.addEventListener(evt,apply);}catch(e){}});}bind(selCountry);bind(selProgram);bind(selGrade);try{if(window.jQuery&&jQuery.fn&&jQuery.fn.select2){[selCountry,selProgram,selGrade].forEach(function(el){if(!el)return;try{var $el=jQuery(el);if($el.hasClass('select2-hidden-accessible'))$el.select2('destroy');}catch(e){}try{jQuery(el).select2({width:'100%',minimumResultsForSearch:0,dropdownParent:jQuery(strip)}).on('change',apply);}catch(e2){}});}}catch(e3){}if(btnClear&&btnClear.addEventListener){btnClear.addEventListener('click',function(){clearEl(selCountry);clearEl(selProgram);clearEl(selGrade);apply();});}try{if(!root.__enrAvailClickBound){root.__enrAvailClickBound=true;root.addEventListener('click',function(e){var t=e&&e.target;while(t&&t!==root&&!(t.classList&&t.classList.contains('enrAvailEditBtn'))){t=t.parentNode;}if(!t||t===root)return;try{e.preventDefault&&e.preventDefault();}catch(ex){}var id=t.getAttribute('data-id')||'';if(!id)return;try{if(window.opener&&typeof window.opener.enrAvailJumpToEdit==='function'){window.opener.enrAvailJumpToEdit(id);try{window.opener.focus&&window.opener.focus();}catch(ex2){}try{window.close();}catch(ex3){}return;}}catch(ex4){}try{localStorage.setItem('" +
			ENR_AVAIL_EDIT_FROM_PREVIEW_KEY +
				"',String(id));}catch(ex5){}alert('Edit is available in the dashboard window.');});}}catch(e4){}apply();}try{init();}catch(e){try{var r=q('#enrAvailPreviewRoot');if(r)r.innerHTML='<div class=\"text-muted text-center py-5\">Unable to render preview</div>';}catch(ex){}}try{if(!window.__enrAvailStorageBound){window.__enrAvailStorageBound=true;window.addEventListener('storage',function(){try{init();}catch(e){}});}}catch(e5){}})();</script>" +
		"</body></html>";

	try {
		w.document.open();
		w.document.write(doc);
		w.document.close();
	} catch (e) {
		// if write fails, fallback to in-page view
		enrAvailSwitchTab("view");
	}
}

function enrAvailSeedIfEmpty() {
	if (!$("#enrAvailEntryRows .entry-row").length) {
		enrAvailAddRow({
			countryId: enrAvailMasters.countries[0] ? enrAvailMasters.countries[0].id : "",
			// Program/Grade optional: if left empty, Save expands to all programs+grades
			programId: "",
			gradeId: "",
			total: "",
			booked: "",
			about: "",
		});
	}
}

function enrAvailRowId() {
	return "enrAvailRow_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
}

function enrAvailOptions(options, selectedId, placeholder, includeAll) {
	var html = "";
	var selectedSet = {};
	if (Array.isArray(selectedId)) {
		selectedId.forEach(function (x) {
			selectedSet[String(x)] = true;
		});
	}
	if (placeholder !== undefined && placeholder !== null) {
		html += '<option value="">' + placeholder + "</option>";
	}
	if (includeAll) {
		var selAll = String(selectedId) === "ALL" || !!selectedSet["ALL"] ? "selected" : "";
		html += '<option value="ALL" ' + selAll + ">Any</option>";
	}
	html += (options || [])
		.map(function (o) {
			var sel = selectedSet[String(o.id)] || String(o.id) === String(selectedId) ? "selected" : "";
			return '<option value="' + enrAvailEsc(o.id) + '" ' + sel + ">" + enrAvailEsc(o.label) + "</option>";
		})
		.join("");
	return html;
}

function enrAvailAddRow(base) {
	var $rows = $("#enrAvailEntryRows");
	var $last = $rows.children().last();

	var b = base;
	if (!b && $last.length) {
		var g = function (name) {
			return $last.find("[name=" + name + "]").val();
		};
		b = {
			countryId: g("countryId"),
			programId: g("programId"),
			gradeId: g("gradeId"),
			total: g("total"),
			booked: g("booked"),
			about: g("about"),
		};
	}

	b =
		b || {
			countryId: "",
			programId: "",
			gradeId: "",
			total: "",
			booked: "",
			about: "",
		};

	var id = enrAvailRowId();
	var isBase = $rows.children().length === 0;
	var isMulti = true;

	var html =
		'<div class="entry-row border rounded-10 p-2 p-md-3 mb-2 bg-light-primary ' +
		(isBase ? "border-primary" : "") +
		'" id="' +
		id +
		'">' +
		'<div class="row">' +
		'<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">Country</label>' +
		'<select class="form-control form-control-sm" name="countryId">' +
		enrAvailOptions(enrAvailMasters.countries, b.countryId, "Select", false) +
		"</select>" +
		"</div>" +
		'<div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">Program</label>' +
		'<select class="form-control form-control-sm" name="programId" ' +
		(isMulti ? 'multiple="multiple"' : "") +
		">" +
		enrAvailOptions(enrAvailMasters.programs, b.programId, "Any Program", false) +
		"</select>" +
		"</div>" +
		'<div class="col-xl-2 col-lg-3 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">Grade</label>' +
		'<select class="form-control form-control-sm" name="gradeId" ' +
		(isMulti ? 'multiple="multiple"' : "") +
		">" +
		enrAvailOptions(enrAvailMasters.grades, b.gradeId, "Any Grade", false) +
		"</select>" +
		"</div>" +
		'<div class="col-xl-1 col-lg-2 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">Total seats</label>' +
		'<input class="form-control form-control-sm" type="number" min="0" name="total" value="' +
		(enrAvailEsc(b.total) || "") +
		'" placeholder="0"/>' +
		"</div>" +
		'<div class="col-xl-1 col-lg-2 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">Booked</label>' +
		'<input class="form-control form-control-sm" type="number" min="0" name="booked" value="' +
		(enrAvailEsc(b.booked) || "") +
		'" placeholder="0"/>' +
		"</div>" +
		'<div class="col-xl-1 col-lg-2 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">Remaining <span class="text-success"></span></label>' +
		'<input class="form-control form-control-sm" type="number" name="remaining" readonly value="" placeholder="auto"/>' +
		"</div>" +
		'<div class="col-xl-1 col-lg-2 col-md-6 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1">About to book</label>' +
		'<input class="form-control form-control-sm" type="number" min="0" name="about" value="' +
		(enrAvailEsc(b.about) || "") +
		'" placeholder="0"/>' +
		"</div>" +
		'<div class="col-xl-1 col-lg-12 col-md-12 col-sm-12 mb-2">' +
		'<label class="font-12 text-muted mb-1 d-block">&nbsp;</label>' +
		'<div class="d-flex justify-content-end">' +
		'<button type="button" class="btn btn-outline-danger btn-sm rounded-10 rm-btn" data-rowid="' +
		id +
		'" title="Remove"><i class="fa fa-times"></i></button>' +
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>";

	$rows.append(html);
	enrAvailUpdateBaseRow();
	enrAvailEnhanceEntryRow(id);
	var $newRow = $("#" + id);
	enrAvailCalcRow($newRow.find("[name=booked]")[0] || $newRow.find("[name=total]")[0]);
}

function enrAvailEnhanceEntryRow(rowId) {
	if (!rowId) return;
	var $row = $("#" + rowId);
	if (!$row.length) return;

	var $program = $row.find("[name=programId]");
	var $grade = $row.find("[name=gradeId]");

	if ($.fn && $.fn.select2) {
		try {
			if ($program.hasClass("select2-hidden-accessible")) $program.select2("destroy");
			if ($grade.hasClass("select2-hidden-accessible")) $grade.select2("destroy");
		} catch (e) {}

		$program.select2({ width: "100%", placeholder: "Select Program(s)", closeOnSelect: false });
		$grade.select2({ width: "100%", placeholder: "Select Grade(s)", closeOnSelect: false });
	}
}

function enrAvailRmRow(id) {
	$("#" + id).remove();
	enrAvailUpdateBaseRow();
	if (!$("#enrAvailEntryRows .entry-row").length) {
		enrAvailSeedIfEmpty();
	}
}

function enrAvailUpdateBaseRow() {
	$("#enrAvailEntryRows .entry-row").each(function (i) {
		$(this).toggleClass("border-primary shadow-sm", i === 0);
	});
}

function enrAvailCalcRow(el) {
	var $row = $(el).closest(".entry-row");
	if (!$row.length) return;

	var total = parseInt($row.find("[name=total]").val(), 10) || 0;
	var about = parseInt($row.find("[name=about]").val(), 10) || 0;
	// Remaining/Free follows: total = reserved + wait + free.
	// Entry form has no wait field, so remaining is derived from total - reserved.
	var remaining = total > 0 ? Math.max(0, total - about) : "";
	$row.find("[name=remaining]").val(remaining);
}

function enrAvailCalcSeatMeta(total, booked, reserved, wait) {
	var t = parseInt(total, 10) || 0;
	var bk = parseInt(booked, 10) || 0;
	var rv = parseInt(reserved, 10) || 0;
	var wt = parseInt(wait, 10) || 0;
	if (bk < 0) bk = 0;
	if (rv < 0) rv = 0;
	if (wt < 0) wt = 0;

	var used = bk + rv + wt;
	var free = Math.max(0, t - used);
	var overbooked = Math.max(0, used - t);
	var filled = t ? Math.round((used / t) * 100) : 0;

	var status = "Available";
	var pill = { badgeClass: "bg-light-success text-success", barClass: "bg-success" };
	if (overbooked > 0) {
		status = "Overbooked";
		pill = { badgeClass: "bg-light-danger text-danger", barClass: "bg-danger" };
	} else if (free === 0) {
		status = "Full";
		pill = { badgeClass: "bg-light-danger text-danger", barClass: "bg-danger" };
	} else if (free < 5) {
		status = "Almost Full";
		pill = { badgeClass: "bg-light-warning text-warning", barClass: "bg-warning" };
	}

	return {
		t: t,
		b: bk,
		rv: rv,
		wt: wt,
		used: used,
		filled: filled,
		free: free,
		overbooked: overbooked,
		wait: wt,
		status: status,
		pill: pill,
	};
}

function enrAvailSyncInlineSeatFields(key) {
	try {
		var k = String(key || "");
		if (!k) return;
		var px = "enrAvailInline_" + enrAvailSafeDomId(k);
		var $total = $("#" + px + "_total");
		var $confirm = $("#" + px + "_confirm");
		var $rsv = $("#" + px + "_rsv");
		var $wait = $("#" + px + "_wait");
		var $free = $("#" + px + "_free");
		if (!$total.length || !$confirm.length || !$rsv.length || !$wait.length || !$free.length) return;

		var total = parseInt($total.val(), 10);
		var confirm = parseInt($confirm.val(), 10);
		var rsv = parseInt($rsv.val(), 10);
		var wait = parseInt($wait.val(), 10);
		if (isNaN(total) || total < 0) total = 0;
		if (isNaN(confirm) || confirm < 0) confirm = 0;
		if (isNaN(rsv) || rsv < 0) rsv = 0;
		if (isNaN(wait) || wait < 0) wait = 0;

		$confirm.val(confirm);
		$rsv.val(rsv);
		$wait.val(wait);
		$free.val(Math.max(0, total - confirm - rsv - wait));
	} catch (e) {}
}

async function enrAvailSaveAll() {
	var $rows = $("#enrAvailEntryRows .entry-row");
	if (!$rows.length) {
		enrAvailToast(0, "No rows to save!");
		return;
	}

	var toSave = [];
	$rows.each(function () {
		var $r = $(this);
		var get = function (name) {
			return $r.find("[name=" + name + "]").val();
		};

		var total = parseInt(get("total"), 10) || 0;
		if (!total) return;

		var booked = parseInt(get("booked"), 10) || 0;
		var about = parseInt(get("about"), 10) || 0;

		var countryId = get("countryId");
		var programId = $r.find("[name=programId]").val();
		var gradeId = $r.find("[name=gradeId]").val();

		var combos = enrAvailExpandCombos(countryId, programId, gradeId);
		if (!combos.length) return;

		combos.forEach(function (c) {
			toSave.push({
				countryId: parseInt(c.countryId, 10) || 0,
				programId: String(c.programId || ""),
				gradeId: parseInt(c.gradeId, 10) || 0,
				total: total,
				booked: booked,
				about: about,
			});
		});
	});

	if (!toSave.length) {
		enrAvailToast(0, "Fill in total seats for at least one row");
		return;
	}

	try {
		var res = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, "save-enrollment-availability-seats", { records: toSave }, "dashboard");
		if (res && String(res.status) === "1") {
			$("#enrAvailEntryRows").html("");
			enrAvailSeedIfEmpty();
			enrAvailEditingId = null;
			await enrAvailLoadSeatsFromServer(enrAvailLastLoadRequest || enrAvailGetFilterRequestFromUI());
			enrAvailUpdatePreviewCache();
			enrAvailRenderSaved();
			enrAvailToast(1, (res.upserted || toSave.length) + " entries saved ✓");
		}
	} catch (e) {}
}

function enrAvailSwitchTab(tab) {
	enrAvailSetTabBtn($("#enrAvailNavEntry"), tab === "entry");
	enrAvailSetTabBtn($("#enrAvailNavView"), tab === "view");
	$("#enrAvailPageEntry").toggleClass("d-none", tab !== "entry");
	$("#enrAvailPageView").toggleClass("d-none", tab !== "view");
	if (tab === "view") {
		enrAvailRenderView();
	}
}

function enrAvailSetTabBtn($btn, isActive) {
	$btn.toggleClass("active", !!isActive);
	$btn.toggleClass("btn-primary btn-shadow", !!isActive);
	$btn.toggleClass("btn-white border", !isActive);
}

function enrAvailGetPct(r) {
	// Fill% follows seat distribution: total = confirmed + reserved + wait + free.
	return r && r.total
		? Math.round((((enrAvailToInt(r.booked) + enrAvailToInt(r.about) + enrAvailToInt(r.wait)) / enrAvailToInt(r.total))) * 100)
		: 0;
}

function enrAvailBarColor(p) {
	return p > 80 ? "var(--red)" : p > 50 ? "var(--amber)" : "var(--green)";
}

function enrAvailFlagOf(country) {
	return enrAvailCountryColors(country).split("|");
}

function enrAvailIni(country) {
	return (country || "")
		.split(" ")
		.map(function (w) {
			return w ? w[0] : "";
		})
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function enrAvailRenderSaved() {
	$("#enrAvailRecCount").text(enrAvailRecords.length + " records");
	enrAvailNormalizeSelection();
	enrAvailUpdateSelectionUI();
	enrAvailUpdateSelectAllState();
	enrAvailUpdateDrillSelectAllState();
	enrAvailPopulateSavedSummaryFilters();
	enrAvailUpdateSavedSummaryPills();
	enrAvailUpdateLoadButtonState();
	enrAvailRenderSavedSummary();
	enrAvailSetSavedViewMode(enrAvailSavedViewMode);
	enrAvailRenderTable();
}

function enrAvailNormalizeSelection() {
	try {
		var existing = {};
		(enrAvailRecords || []).forEach(function (r) {
			if (r && r.id !== undefined && r.id !== null) existing[String(r.id)] = true;
		});
		Object.keys(enrAvailSelectedIds || {}).forEach(function (k) {
			if (!existing[k]) delete enrAvailSelectedIds[k];
		});
	} catch (e) {}
}

function enrAvailSelectedCount() {
	try {
		return Object.keys(enrAvailSelectedIds || {}).length;
	} catch (e) {
		return 0;
	}
}

	function enrAvailUpdateSelectionUI() {
		var n = enrAvailSelectedCount();
		if ($("#enrAvailSelCount").length) $("#enrAvailSelCount").text(n ? "(" + n + ")" : "");
		// Keep delete-selected clickable when there are records; if none selected, we guide user to select rows.
		var hasRecords = false;
		try {
			hasRecords = !!enrAvailFilteredRealSavedRecords().length;
		} catch (e) {}
		if ($("#enrAvailDeleteSelectedBtn").length) $("#enrAvailDeleteSelectedBtn").prop("disabled", !hasRecords);
	}

	function enrAvailToggleSelectAll(checked) {
		var recs = enrAvailFilteredRealSavedRecords();
		recs.forEach(function (r) {
			if (!r || r.id === undefined || r.id === null) return;
			if (checked) enrAvailSelectedIds[String(r.id)] = true;
			else delete enrAvailSelectedIds[String(r.id)];
		});
		enrAvailUpdateSelectionUI();
		enrAvailRenderTable();
	}

	function enrAvailRecordsByGroup(kind, id) {
		var recs = enrAvailFilteredRealSavedRecords();
		var k = String(kind || "");
		var gid = String(id || "");
		if (!k || !gid) return [];

	if (k === "grade") {
		if (gid.indexOf("||") >= 0) {
			var parts = gid.split("||");
			var g = String(parts[0] || "");
			var c = String(parts[1] || "");
			return recs.filter(function (r) {
				if (g && String(r.gradeId) !== g) return false;
				if (c && String(r.countryId) !== c) return false;
				return true;
			});
		}
		return recs.filter(function (r) {
			return String(r.gradeId) === gid;
		});
	}

	if (k === "program") {
		if (gid.indexOf("||") >= 0) {
			var partsP = gid.split("||");
			var p = String(partsP[0] || "");
			var c2 = String(partsP[1] || "");
			return recs.filter(function (r) {
				if (p && String(r.programId) !== p) return false;
				if (c2 && String(r.countryId) !== c2) return false;
				return true;
			});
		}
		return recs.filter(function (r) {
			return String(r.programId) === gid;
		});
	}

	return [];
}

function enrAvailToggleSelectGroup(kind, groupId, checked) {
	var list = enrAvailRecordsByGroup(kind, groupId);
	list.forEach(function (r) {
		if (!r || r.id === undefined || r.id === null) return;
		if (checked) enrAvailSelectedIds[String(r.id)] = true;
		else delete enrAvailSelectedIds[String(r.id)];
	});
	enrAvailUpdateSelectionUI();
	enrAvailUpdateSelectAllState();
	enrAvailUpdateDrillSelectAllState();
}

function enrAvailUpdateDrillSelectAllState() {
	try {
		var $boxes = $(".enrAvailSelAllDrill");
		if (!$boxes.length) return;
		$boxes.each(function () {
			var $b = $(this);
			var kind = $b.attr("data-kind") || "";
			var gid = $b.attr("data-groupid") || "";
			var list = enrAvailRecordsByGroup(kind, gid);
			var total = list.length;
			var sel = 0;
			list.forEach(function (r) {
				if (r && enrAvailSelectedIds[String(r.id)]) sel++;
			});
			if (!total) {
				$b.prop("checked", false);
				this.indeterminate = false;
				return;
			}
			$b.prop("checked", sel === total);
			this.indeterminate = sel > 0 && sel < total;
		});
	} catch (e) {}
}

async function enrAvailDeleteSelected() {
	var ids = Object.keys(enrAvailSelectedIds || {});
	if (!ids.length) {
		enrAvailSetSavedViewMode("table");
		enrAvailToast(2, "Select records to delete");
		return;
	}
	if (!confirm("Delete selected records?")) return;

	try {
		// delete one-by-one to reuse existing API
		for (var i = 0; i < ids.length; i++) {
			await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, "delete-enrollment-availability-seat", { id: ids[i] }, "dashboard");
		}
		enrAvailSelectedIds = {};
		enrAvailEditingId = null;
		await enrAvailLoadSeatsFromServer(enrAvailLastLoadRequest || enrAvailGetFilterRequestFromUI());
		enrAvailUpdatePreviewCache();
		enrAvailRenderSaved();
		enrAvailToast(2, ids.length + " record" + (ids.length === 1 ? "" : "s") + " deleted");
	} catch (e) {}
}

	function enrAvailMatchQ(r, q) {
		if (!q) return true;
		var s = (r.country || "") + " " + (r.program || "") + " " + (r.grade || "");
		return s.toLowerCase().indexOf(String(q).toLowerCase()) >= 0;
	}

	function enrAvailFilteredRealSavedRecords() {
		var f = enrAvailSavedFilters || {};
		var countryId = String(f.countryId || "");
		var programId = String(f.programId || "");
		var gradeId = String(f.gradeId || "");
		var q = String(f.q || "").trim();

		return (enrAvailRecords || []).filter(function (r) {
			if (!r || !enrAvailIsRealRecord(r)) return false;
			if (countryId && String(r.countryId) !== countryId) return false;
			if (programId && String(r.programId) !== programId) return false;
			if (gradeId && String(r.gradeId) !== gradeId) return false;
			if (q && !enrAvailMatchQ(r, q)) return false;
			return true;
		});
	}

	function enrAvailFilteredSavedRecords() {
		var f = enrAvailAppliedFilters || {};
		var countryId = String(f.countryId || "");
		var programId = String(f.programId || "");
		var gradeId = String(f.gradeId || "");
		var q = String((enrAvailSavedFilters || {}).q || "").trim();

		if (!enrAvailHasAppliedSelection()) {
			return [];
		}

		var base = (enrAvailRecords || []).filter(function (r) {
			if (!r) return false;
			if (countryId && String(r.countryId) !== countryId) return false;
			if (programId && String(r.programId) !== programId) return false;
			if (gradeId && String(r.gradeId) !== gradeId) return false;
			if (q && !enrAvailMatchQ(r, q)) return false;
			return true;
		});

		return base;
	}

function enrAvailSummaryMeta(total, booked, reserved, wait) {
	return enrAvailCalcSeatMeta(total, booked, reserved, wait);
}

function enrAvailSummaryCloseDrill() {
	try {
		enrAvailSummaryDrill = { kind: "", id: "" };
		enrAvailEditingId = null;
		enrAvailRenderSaved();
	} catch (e) {}
}

	function enrAvailSummaryEdit(kind, id) {
		try {
			var k = String(kind || "");
			var gid = String(id || "");
			if (!k || !gid) return;

			// If this group resolves to multiple records, we still open ONLY one record editor
			// (pick a deterministic first) so user edits a single row.
			var list = enrAvailRecordsByGroup(k, gid) || [];
			if (list.length) {
				var pick = list[0];
				try {
					if (k === "grade") {
						list = list.slice(0);
						list.sort(function (a, b) {
							var ai = enrAvailProgramSequenceIndex(a && a.program);
							var bi = enrAvailProgramSequenceIndex(b && b.program);
							if (ai !== bi) return ai - bi;
							return String((a && a.program) || "").localeCompare(String((b && b.program) || ""));
						});
						pick = list[0];
					} else if (k === "program") {
						list = list.slice(0);
						list.sort(function (a, b) {
							var ag = parseInt(String((a && a.grade) || "").replace(/[^0-9]/g, ""), 10);
							var bg = parseInt(String((b && b.grade) || "").replace(/[^0-9]/g, ""), 10);
							if (!isNaN(ag) && !isNaN(bg) && ag !== bg) return ag - bg;
							return String((a && a.country) || "").localeCompare(String((b && b.country) || ""));
						});
						pick = list[0];
					}
				} catch (e) {}

				if (pick && pick.id !== undefined && pick.id !== null) {
					if (enrAvailBeginSingleRecordEditWithDrill(pick.id, k, gid)) return;
				}
			}

			// Fallback: open drill list for this group (Grade / Program)
			enrAvailSummaryDrill = { kind: k, id: gid };
			enrAvailEditingId = null;
			enrAvailRenderSaved();

			// scroll to editor section
			setTimeout(function () {
				try {
					var el = document.getElementById("enrAvailSummaryEditor");
				if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "start" });
			} catch (e) {}
		}, 0);
	} catch (e) {}
}

function enrAvailRenderActiveSummaryEditor() {
	try {
		var d = enrAvailSummaryDrill || { kind: "", id: "" };
		if (!d.kind || !d.id) return "";
		return enrAvailRenderSummaryDrill(String(d.kind));
	} catch (e) {
		return "";
	}
}

function enrAvailSummaryDrillRecords() {
	var k = String((enrAvailSummaryDrill && enrAvailSummaryDrill.kind) || "");
	var id = String((enrAvailSummaryDrill && enrAvailSummaryDrill.id) || "");
	return enrAvailRecordsByGroup(k, id);
}

function enrAvailRenderSummaryDrill(kind) {
	var k = String(kind || "");
	var d = enrAvailSummaryDrill || { kind: "", id: "" };
	if (String(d.kind) !== k || !d.id) return "";

	var list = enrAvailSummaryDrillRecords();
	// Sort drill rows so program order is consistent
	try {
		list = (list || []).slice(0);
		list.sort(function (a, b) {
			if (k === "grade") {
				var ai = enrAvailProgramSequenceIndex(a && a.program);
				var bi = enrAvailProgramSequenceIndex(b && b.program);
				if (ai !== bi) return ai - bi;
				return String((a && a.program) || "").localeCompare(String((b && b.program) || ""));
			}
			// program drill -> sort by grade number then country
			var ag = parseInt(String((a && a.grade) || "").replace(/[^0-9]/g, ""), 10);
			var bg = parseInt(String((b && b.grade) || "").replace(/[^0-9]/g, ""), 10);
			if (!isNaN(ag) && !isNaN(bg) && ag !== bg) return ag - bg;
			return String((a && a.country) || "").localeCompare(String((b && b.country) || ""));
		});
	} catch (e) {}

	if (!list.length) {
		return (
			'<div class="border rounded-10 p-3 bg-light">' +
			'<div class="d-flex align-items-center justify-content-between mb-2">' +
			'<div class="font-weight-bold text-dark">Records</div>' +
			'<button type="button" class="btn btn-outline-secondary btn-sm rounded-10" onclick="enrAvailSummaryCloseDrill()">Close</button>' +
			"</div>" +
			'<div class="text-muted font-12">No records found for this selection</div>' +
			"</div>"
		);
	}

	var groupId = String(d.id || "");
	var selAllId = "enrAvailSumSelAll_" + enrAvailSafeDomId(k + "_" + groupId);

	var rows = "";
	list.forEach(function (r, i) {
		var p = enrAvailGetPct(r);
		var pBar = Math.max(0, Math.min(100, p));
		var programBadge = enrAvailProgramBadge(r.programId);
		var px = "enrAvailSumEdit_" + enrAvailSafeDomId(r.id);
		var rid = String(r.id);
		var isChecked = !!enrAvailSelectedIds[rid];

		if (enrAvailEditingId == r.id) {
			rows += '<tr><td colspan="9">' + enrAvailEditFields(r, px) + "</td></tr>";
			return;
		}

		rows +=
			"<tr>" +
			'<td class="border-0 py-2 px-2"><input type="checkbox" class="enrAvailSelOne" data-id="' +
			enrAvailEsc(rid) +
			'" ' +
			(isChecked ? "checked" : "") +
			"/></td>" +
			'<td class="text-muted font-weight-bold border-0 py-2 px-2">' +
			(i + 1) +
			"</td>" +
			'<td class="border-0 py-2 px-2">' +
			enrAvailEsc(r.country) +
			"</td>" +
			'<td class="border-0 py-2 px-2"><span class="badge badge-pill ' +
			programBadge +
			'">' +
			enrAvailEsc(r.program) +
			"</span></td>" +
			'<td class="border-0 py-2 px-2">' +
			enrAvailEsc(r.grade) +
			"</td>" +
			'<td class="font-weight-bold border-0 py-2 px-2">' +
			(r.total || 0) +
			"</td>" +
			'<td class="text-info font-weight-bold border-0 py-2 px-2">' +
			(r.booked || 0) +
			"</td>" +
			'<td class="text-success font-weight-bold border-0 py-2 px-2">' +
			(r.remaining || 0) +
			"</td>" +
			'<td class="border-0 text-right py-2 px-2"><div class="d-inline-flex">' +
			'<button type="button" class="btn btn-outline-primary btn-sm mr-2" onclick="enrAvailStartEdit(\'' +
			r.id +
			"')\">Edit</button>" +
			'<button type="button" class="btn btn-outline-danger btn-sm" onclick="enrAvailDelRec(\'' +
			r.id +
			"')\">Delete</button>" +
			"</div></td>" +
			"</tr>" +
			'<tr><td colspan="9" class="border-0 pt-0 pb-2 px-2">' +
			'<div class="d-flex align-items-center">' +
			'<div class="progress progress-bar-xs progress-bar-rounded flex-grow-1 mr-2">' +
			'<div class="progress-bar ' +
			enrAvailProgressClass(p) +
			'" role="progressbar" style="width:' +
			pBar +
			'%"></div></div>' +
			'<span class="font-12 font-weight-bold">' +
			p +
			"%</span></div>" +
			"</td></tr>";
	});

	return (
		'<div class="border rounded-10 p-3 bg-light">' +
		'<div class="d-flex align-items-center justify-content-between mb-2">' +
		'<div class="font-weight-bold text-dark">Records <span class="text-muted font-12">(' +
		list.length +
		")</span></div>" +
		'<div class="d-flex align-items-center">' +
		'<button type="button" class="btn btn-outline-danger btn-sm rounded-10 mr-2" onclick="enrAvailDeleteSelected()">Delete selected</button>' +
		'<button type="button" class="btn btn-outline-secondary btn-sm rounded-10" onclick="enrAvailSummaryCloseDrill()">Close</button>' +
		"</div>" +
		"</div>" +
		'<div class="table-responsive">' +
		'<table class="table table-borderless table-hover mb-0">' +
		"<thead>" +
		"<tr>" +
		'<th class="text-muted font-12 border-0 py-2 px-2" style="width:32px;">' +
		'<input type="checkbox" class="enrAvailSelAllDrill" id="' +
		enrAvailEsc(selAllId) +
		'" data-kind="' +
		enrAvailEsc(k) +
		'" data-groupid="' +
		enrAvailEsc(groupId) +
		'" />' +
		"</th>" +
		'<th class="text-muted font-12 border-0 py-2 px-2">#</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2">Country</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2">Program</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2">Grade</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2">Total</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2">Confirm</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2">Remaining</th>' +
		'<th class="text-muted font-12 border-0 py-2 px-2 text-right">Actions</th>' +
		"</tr>" +
		"</thead>" +
		"<tbody>" +
		rows +
		"</tbody></table></div></div>"
	);
}

		function enrAvailRenderSummaryRows(items) {
			if (!items || !items.length) {
				return '<div class="text-center text-muted py-4">No records found</div>';
			}

		return items
			.map(function (it, idx) {
				var meta = enrAvailSummaryMeta(it.total, it.booked, it.reserved, it.wait);
				var p = meta.filled;
				var pBar = Math.max(0, Math.min(100, p));
				var barClass = meta.pill.barClass || enrAvailProgressClass(p);

				var key = String(it && it.key ? it.key : "");
				var isEditing = !!(key && enrAvailInlineEditKey && String(enrAvailInlineEditKey) === key);
				var px = "enrAvailInline_" + enrAvailSafeDomId(key);

				var editBtn = "";
				if (key && !isEditing) {
					editBtn =
						'<button type="button" class="btn btn-outline-primary btn-sm rounded-10 enrAvailInlineEditBtn" data-key="' +
						enrAvailEsc(key) +
						'">Edit</button>';
				}
					if (key && isEditing) {
						editBtn =
							'<button type="button" class="btn btn-primary btn-sm rounded-10 enrAvailInlineSaveBtn" data-key="' +
							enrAvailEsc(key) +
							'">Save</button>' +
							'<button type="button" class="btn btn-outline-secondary btn-sm rounded-10 ml-2 enrAvailInlineCancelBtn" data-key="' +
							enrAvailEsc(key) +
							'">Cancel</button>';
					}

					var totalEl = isEditing
						? '<div class="text-right" style="width:90px;">' +
							'<div class="text-muted font-10 mb-1">Total</div>' +
							'<input type="number" min="0" class="form-control form-control-sm text-right enrAvailInlineInput" style="width:90px;" id="' +
							enrAvailEsc(px + "_total") +
							'" data-key="' +
							enrAvailEsc(key) +
							'" data-field="total" data-orig="' +
							enrAvailEsc(meta.t) +
							'" data-booked="' +
							enrAvailEsc(meta.b) +
							'" value="' +
							enrAvailEsc(meta.t) +
							'"/></div>'
						: '<div class="text-center"><div class="text-dark font-weight-bold" style="font-size:18px;line-height:1;">' +
							meta.t.toLocaleString() +
							'</div><div class="text-muted font-10">Total</div></div>';

					var confirmEl = isEditing
						? '<div class="text-right" style="width:90px;">' +
							'<div class="text-muted font-10 mb-1">Confirm</div>' +
							'<input type="number" min="0" class="form-control form-control-sm text-right enrAvailInlineInput" style="width:90px;" id="' +
							enrAvailEsc(px + "_confirm") +
							'" data-key="' +
							enrAvailEsc(key) +
							'" data-field="confirm" data-orig="' +
							enrAvailEsc(meta.b) +
							'" value="' +
							enrAvailEsc(meta.b) +
							'"/></div>'
						: '<div class="text-center"><div class="text-info font-weight-bold" style="font-size:18px;line-height:1;">' +
							meta.b.toLocaleString() +
							'</div><div class="text-muted font-10">Confirm</div></div>';

					var rsvEl = isEditing
						? '<div class="text-right" style="width:90px;">' +
							'<div class="text-muted font-10 mb-1">Reserve</div>' +
							'<input type="number" min="0" class="form-control form-control-sm text-right enrAvailInlineInput" style="width:90px;" id="' +
							enrAvailEsc(px + "_rsv") +
							'" data-key="' +
							enrAvailEsc(key) +
							'" data-field="rsv" data-orig="' +
							enrAvailEsc(meta.rv) +
							'" value="' +
							enrAvailEsc(meta.rv) +
							'"/></div>'
						: '<div class="text-center"><div class="text-warning font-weight-bold" style="font-size:18px;line-height:1;">' +
							meta.rv.toLocaleString() +
							'</div><div class="text-muted font-10">Reserve</div></div>';

					var waitEl = isEditing
						? '<div class="text-right" style="width:90px;">' +
							'<div class="text-muted font-10 mb-1">Waiting</div>' +
							'<input type="number" min="0" class="form-control form-control-sm text-right enrAvailInlineInput" style="width:90px;" id="' +
							enrAvailEsc(px + "_wait") +
							'" data-key="' +
							enrAvailEsc(key) +
							'" data-field="wait" data-orig="' +
							enrAvailEsc(meta.wait) +
							'" value="' +
							enrAvailEsc(meta.wait) +
							'"/></div>'
						: '<div class="text-center"><div class="text-primary font-weight-bold" style="font-size:18px;line-height:1;">' +
							meta.wait.toLocaleString() +
							'</div><div class="text-muted font-10">Waiting</div></div>';
					
						var freeEl = isEditing
							? '<div class="text-right" style="width:90px;">' +
								'<div class="text-muted font-10 mb-1">Free</div>' +
								'<input type="number" min="0" class="form-control form-control-sm text-right bg-light" style="width:90px;" id="' +
								enrAvailEsc(px + "_free") +
								'" data-key="' +
								enrAvailEsc(key) +
								'" data-field="free" data-orig="' +
								enrAvailEsc(meta.free) +
								'" value="' +
								enrAvailEsc(meta.free) +
								'" readonly/></div>'
							: '<div class="text-center"><div class="text-success font-weight-bold" style="font-size:18px;line-height:1;">' +
								meta.free.toLocaleString() +
								'</div><div class="text-muted font-10">Free</div></div>';

					var lysVal = it.lastYearStrength || 0;
					var lysEl = isEditing
						? '<div class="text-right" style="width:90px;">' +
							'<div class="text-muted font-10 mb-1">Last Year Strength(%)</div>' +
							'<input type="number" min="0" max="100" class="form-control form-control-sm text-right enrAvailInlineInput" style="width:90px;" id="' +
							enrAvailEsc(px + "_lys") +
							'" data-key="' +
							enrAvailEsc(key) +
							'" data-field="lys" data-orig="' +
							enrAvailEsc(lysVal) +
							'" value="' +
							enrAvailEsc(lysVal) +
							'"/></div>'
						: '<div class="text-center"><div class="text-secondary font-weight-bold" style="font-size:18px;line-height:1;">' +
							lysVal + '%' +
							'</div><div class="text-muted font-10">Last Year Strength(%)</div></div>';

				return (
					'<div class="py-2' +
					(idx ? " border-top" : "") +
					'">' +
				'<div class="d-flex align-items-start justify-content-between flex-wrap">' +
				'<div class="pr-2" style="min-width:220px;flex:1 1 auto;">' +
					'<div class="font-weight-bold text-dark mb-1">' +
					enrAvailEsc(it.label) +
					"</div>" +
					(it.subLabel
						? '<div class="text-muted font-12 mb-1">' + enrAvailEsc(it.subLabel) + "</div>"
						: "") +
					'<div class="progress progress-bar-xs progress-bar-rounded w-100 mb-1">' +
					'<div class="progress-bar ' +
					barClass +
					'" role="progressbar" style="width:' +
					pBar +
					'%"></div></div>' +
						'<div class="text-muted font-12">' +
						meta.b.toLocaleString() +
						" confirmed · " +
						meta.rv.toLocaleString() +
						" reserved · " +
						meta.wait.toLocaleString() +
						" wait · " +
						meta.t.toLocaleString() +
						" total · " +
						meta.filled +
						"% filled</div>" +
						"</div>" +
						'<div class="d-flex align-items-center" style="gap:12px;flex:0 0 auto;">' +
						'<div class="d-flex align-items-center" style="gap:16px;">' +
						totalEl +
						confirmEl +
						rsvEl +
						waitEl +
						freeEl +
						lysEl +
						"</div>" +
						'<span class="badge badge-pill ' +
					meta.pill.badgeClass +
					' px-3 py-1 font-12" style="text-transform:none;">' +
					enrAvailEsc(meta.status) +
					"</span>" +
					editBtn +
					"</div>" +
					"</div>" +
					"</div>"
				);
			})
				.join("");
		}

		async function enrAvailSaveInlineTotalFreeRsvWait(key) {
			try {
				var k = String(key || "");
				if (!k) return;

				var px = "enrAvailInline_" + enrAvailSafeDomId(k);
				var $total = $("#" + px + "_total");
				var $confirm = $("#" + px + "_confirm");
				var $free = $("#" + px + "_free");
				var $rsv = $("#" + px + "_rsv");
				var $wait = $("#" + px + "_wait");

				var confirm = parseInt($confirm.val(), 10);
				var free = parseInt($free.val(), 10);
				var rsv = parseInt($rsv.val(), 10);
				var wait = parseInt($wait.val(), 10);
				var total = parseInt($total.val(), 10);
				if (isNaN(total) || total < 0) total = 0;
				if (isNaN(confirm) || confirm < 0) confirm = 0;
				if (isNaN(rsv) || rsv < 0) rsv = 0;
				if (isNaN(wait) || wait < 0) wait = 0;
				free = Math.max(0, total - confirm - rsv - wait);
				$confirm.val(confirm);
				$rsv.val(rsv);
				$wait.val(wait);
				$free.val(free);
				$total.val(total);

			var ids = enrAvailParseComboKey(k);
			var countryId = parseInt(ids.countryId, 10) || 0;
			var programId = String(ids.programId || "");
			var gradeId = parseInt(ids.gradeId, 10) || 0;

			var rec =
				(enrAvailRecords || []).find(function (r) {
					return r && String(r.countryId) === String(ids.countryId) && String(r.programId) === String(ids.programId) && String(r.gradeId) === String(ids.gradeId);
				}) || null;

				var $lys = $("#" + px + "_lys");
				var lys = parseInt($lys.val(), 10);
				if (isNaN(lys) || lys < 0) lys = 0;
				if (lys > 100) lys = 100;
				$lys.val(lys);

				var payloadRec = {
					countryId: countryId,
					programId: programId,
					gradeId: gradeId,
				total: total,
				booked: confirm,
				about: rsv,
				wait: wait,
				lastYearStrength: lys,
			};
			if (rec && enrAvailIsRealId(rec.id)) {
				payloadRec.id = rec.id;
			}

			await getDashboardDataBasedUrlAndPayloadWithParentUrl(
				true,
				true,
				"save-enrollment-availability-seats",
				{
					records: [payloadRec],
				},
				"dashboard"
			);

			enrAvailInlineEditKey = "";
			try {
				delete enrAvailInlineLastEdited[k];
			} catch (e) {}
			await enrAvailLoadSeatsFromServer(enrAvailLastLoadRequest || enrAvailGetFilterRequestFromUI());
			enrAvailUpdatePreviewCache();
			enrAvailRenderSaved();
			enrAvailToast(1, "Record updated ✓");
		} catch (e) {
			try {
				enrAvailToast(0, "Unable to save");
			} catch (ex) {}
		}
	}

	function enrAvailRenderSavedSummary() {
		var recs = enrAvailFilteredSavedRecords();

		if ($("#enrAvailS_Count").length) {
			$("#enrAvailS_Count").text(recs.length.toLocaleString() + " Record" + (recs.length === 1 ? "" : "s"));
		}

		if (!recs.length) {
			if ($("#enrAvailSumByGrade").length) $("#enrAvailSumByGrade").html('<div class="text-center text-muted py-4">No records yet</div>');
			if ($("#enrAvailSumByProgram").length) $("#enrAvailSumByProgram").html('<div class="text-center text-muted py-4">No records yet</div>');
			if ($("#enrAvailSummaryEditor").length) {
				var msg = "select a country and click check";
				try {
					if (
						enrAvailSavedFilters &&
						(enrAvailSavedFilters.countryId || enrAvailSavedFilters.programId || enrAvailSavedFilters.gradeId) &&
						!enrAvailHasRequiredFilters(enrAvailSavedFilters)
					) {
						msg = "select a country and click check";
					} else if (enrAvailHasRequiredFilters(enrAvailSavedFilters) && !enrAvailHasAppliedSelection()) {
						msg = "click check to fetch records for the selected filters";
					}
					if (
						enrAvailLastLoadRequest &&
						enrAvailHasAppliedSelection() &&
						enrAvailHasRequiredFilters(enrAvailAppliedFilters) &&
						String(enrAvailLastLoadRequest.countryId || "") === String(enrAvailAppliedFilters.countryId || "") &&
						String(enrAvailLastLoadRequest.programId || "") === String(enrAvailAppliedFilters.programId || "") &&
						String(enrAvailLastLoadRequest.gradeId || "") === String(enrAvailAppliedFilters.gradeId || "")
					) {
						msg = "no records found for the selected filters";
					}
				} catch (e) {}
				$("#enrAvailSummaryEditor").html('<div class="text-muted text-center py-4">' + enrAvailEsc(msg) + "</div>");
			}
			return;
		}

		var gradeItems = (recs || [])
			.map(function (r) {
				var key = enrAvailComboKey(r.countryId, r.programId, r.gradeId);
				return {
					key: key,
					label: (r.grade || "—") + " - " + (r.country || "—"),
					subLabel: r.program || "—",
					total: r.total || 0,
					booked: r.booked || 0,
					reserved: r.about || 0,
					wait: r.wait || 0,
					lastYearStrength: r.lastYearStrength || 0,
				};
			})
			.sort(function (a, b) {
				// sort by grade number, then country, then program order
				var ag = parseInt(String(a.label || "").replace(/[^0-9]/g, ""), 10);
				var bg = parseInt(String(b.label || "").replace(/[^0-9]/g, ""), 10);
				if (!isNaN(ag) && !isNaN(bg) && ag !== bg) return ag - bg;
				var ac = String((a.label || "").split(" - ")[1] || "");
				var bc = String((b.label || "").split(" - ")[1] || "");
				if (ac !== bc) return ac.localeCompare(bc);
				var api = enrAvailProgramSequenceIndex(a && a.subLabel);
				var bpi = enrAvailProgramSequenceIndex(b && b.subLabel);
				if (api !== bpi) return api - bpi;
				return String(a.subLabel || "").localeCompare(String(b.subLabel || ""));
			});

		var programItems = (recs || [])
			.map(function (r) {
				var key = enrAvailComboKey(r.countryId, r.programId, r.gradeId);
				return {
					key: key,
					label: (r.program || "—") + " - " + (r.country || "—"),
					subLabel: r.grade || "—",
					total: r.total || 0,
					booked: r.booked || 0,
					reserved: r.about || 0,
					wait: r.wait || 0,
					lastYearStrength: r.lastYearStrength || 0,
				};
			})
				.sort(function (a, b) {
					var ai = enrAvailProgramSequenceIndex(a && a.label);
					var bi = enrAvailProgramSequenceIndex(b && b.label);
					if (ai !== bi) return ai - bi;
					var ac = String((a.label || "").split(" - ")[1] || "");
					var bc = String((b.label || "").split(" - ")[1] || "");
					if (ac !== bc) return ac.localeCompare(bc);
					var ag = parseInt(String(a.subLabel || "").replace(/[^0-9]/g, ""), 10);
					var bg = parseInt(String(b.subLabel || "").replace(/[^0-9]/g, ""), 10);
					if (!isNaN(ag) && !isNaN(bg) && ag !== bg) return ag - bg;
					return String(a.subLabel || "").localeCompare(String(b.subLabel || ""));
				});

		if ($("#enrAvailSumByGrade").length) $("#enrAvailSumByGrade").html(enrAvailRenderSummaryRows(gradeItems));
		if ($("#enrAvailSumByProgram").length) $("#enrAvailSumByProgram").html(enrAvailRenderSummaryRows(programItems));

		// no drill editor for inline-only editing
		if ($("#enrAvailSummaryEditor").length) $("#enrAvailSummaryEditor").html("");
		if ($("#enrAvailSumByGradeDrill").length) $("#enrAvailSumByGradeDrill").html("");
		if ($("#enrAvailSumByProgramDrill").length) $("#enrAvailSumByProgramDrill").html("");
	}

async function enrAvailDeleteAll() {
	if (!enrAvailRecords.length) return;
	if (!confirm("Delete all saved records?")) return;
	try {
		await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, "delete-enrollment-availability-seats", {}, "dashboard");
		enrAvailRecords = [];
		enrAvailEditingId = null;
		enrAvailRenderSaved();
		enrAvailToast(2, "All records deleted");
	} catch (e) {}
}

function enrAvailStartEdit(id) {
	// In Saved records, Edit should isolate and edit only the selected row.
	// If we can't find the record, fallback to the old behavior.
	if (!enrAvailBeginSingleRecordEdit(id)) {
		enrAvailEditingId = id;
		enrAvailRenderSaved();
	}
}

function enrAvailCancelEdit() {
	enrAvailEditingId = null;
	if (enrAvailEditCtx) {
		enrAvailSavedFilters = Object.assign({}, enrAvailEditCtx.filters || {});
		enrAvailSummaryDrill = Object.assign({}, enrAvailEditCtx.summaryDrill || {});
		enrAvailSetSavedViewMode(enrAvailEditCtx.viewMode || "summary");
		enrAvailEditCtx = null;
	}
	enrAvailRenderSaved();
}

async function enrAvailSaveEdit(id, px) {
	var countryId = $("#" + px + "-countryId").val();
	var programId = $("#" + px + "-programId").val();
	var gradeId = $("#" + px + "-gradeId").val();
	var total = parseInt($("#" + px + "-total").val(), 10) || 0;
	var booked = parseInt($("#" + px + "-booked").val(), 10) || 0;
	var about = parseInt($("#" + px + "-about").val(), 10) || 0;
	var wait = parseInt($("#" + px + "-wait").val(), 10) || 0;
	var remaining = Math.max(0, total - booked - about - wait);
	$("#" + px + "-remaining").val(remaining);

	try {
		// Edit should update only the selected record (no "All" expansion)
		await getDashboardDataBasedUrlAndPayloadWithParentUrl(
			true,
			true,
			"save-enrollment-availability-seats",
			{
				records: [
					{
						id: id,
						countryId: parseInt(countryId, 10) || 0,
						programId: String(programId || ""),
						gradeId: parseInt(gradeId, 10) || 0,
						total: total,
						booked: booked,
						about: about,
						wait: wait,
					},
				],
			},
			"dashboard"
		);

		enrAvailEditingId = null;
		await enrAvailLoadSeatsFromServer(enrAvailLastLoadRequest || enrAvailGetFilterRequestFromUI());
		enrAvailUpdatePreviewCache();
		if (enrAvailEditCtx) {
			enrAvailSavedFilters = Object.assign({}, enrAvailEditCtx.filters || {});
			enrAvailSummaryDrill = Object.assign({}, enrAvailEditCtx.summaryDrill || {});
			enrAvailSetSavedViewMode(enrAvailEditCtx.viewMode || "summary");
			enrAvailEditCtx = null;
		}
		enrAvailRenderSaved();
		enrAvailToast(1, "Record updated ✓");
	} catch (e) {}
}

function enrAvailLiveCalc(px) {
	var total = parseInt($("#" + px + "-total").val(), 10) || 0;
	var c = parseInt($("#" + px + "-booked").val(), 10) || 0;
	var a = parseInt($("#" + px + "-about").val(), 10) || 0;
	var w = parseInt($("#" + px + "-wait").val(), 10) || 0;
	$("#" + px + "-booked").val(Math.max(0, c));
	$("#" + px + "-about").val(Math.max(0, a));
	$("#" + px + "-wait").val(Math.max(0, w));
	$("#" + px + "-remaining").val(Math.max(0, total - Math.max(0, c) - Math.max(0, a) - Math.max(0, w)));
}

async function enrAvailDelRec(id) {
	if (!confirm("Delete this record?")) return;
	try {
		await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, "delete-enrollment-availability-seat", { id: id }, "dashboard");
		enrAvailEditingId = null;
		await enrAvailLoadSeatsFromServer(enrAvailLastLoadRequest || enrAvailGetFilterRequestFromUI());
		enrAvailUpdatePreviewCache();
		enrAvailRenderSaved();
		enrAvailToast(2, "Record deleted");
	} catch (e) {}
}

function enrAvailEditFields(r, px) {
	return (
		'<div class="row">' +
		'<div class="col-md-4 mb-2"><label class="font-12 text-muted mb-1">Country</label><select class="form-control form-control-sm" id="' +
		px +
		'-countryId">' +
		enrAvailOptions(enrAvailMasters.countries, r.countryId, "Select", false) +
		"</select></div>" +
		'<div class="col-md-4 mb-2"><label class="font-12 text-muted mb-1">Program</label><select class="form-control form-control-sm" id="' +
		px +
		'-programId">' +
		enrAvailOptions(enrAvailMasters.programs, r.programId, "Select", false) +
		"</select></div>" +
		'<div class="col-md-4 mb-2"><label class="font-12 text-muted mb-1">Grade</label><select class="form-control form-control-sm" id="' +
		px +
		'-gradeId">' +
		enrAvailOptions(enrAvailMasters.grades, r.gradeId, "Select", false) +
		"</select></div>" +
		'<div class="col-md-3 mb-2"><label class="font-12 text-muted mb-1">Total</label><input class="form-control form-control-sm" type="number" id="' +
		px +
		'-total" value="' +
		(r.total || 0) +
		'" oninput="enrAvailLiveCalc(\'' +
		px +
		'\')"/></div>' +
		'<div class="col-md-3 mb-2"><label class="font-12 text-muted mb-1">Confirm</label><input class="form-control form-control-sm" type="number" id="' +
		px +
		'-booked" value="' +
		(r.booked || 0) +
		'" oninput="enrAvailLiveCalc(\'' +
		px +
		'\')"/></div>' +
		'<div class="col-md-3 mb-2"><label class="font-12 text-muted mb-1">Free</label><input class="form-control form-control-sm bg-light" type="number" id="' +
		px +
		'-remaining" value="' +
		(r.remaining || 0) +
		'" readonly/></div>' +
		'<div class="col-md-3 mb-2"><label class="font-12 text-muted mb-1">Rsv</label><input class="form-control form-control-sm" type="number" id="' +
		px +
		'-about" value="' +
		(r.about || 0) +
		'" oninput="enrAvailLiveCalc(\'' +
		px +
		'\')"/></div>' +
		'<div class="col-md-3 mb-2"><label class="font-12 text-muted mb-1">Waiting</label><input class="form-control form-control-sm" type="number" id="' +
		px +
		'-wait" value="' +
		(r.wait || 0) +
		'" oninput="enrAvailLiveCalc(\'' +
		px +
		'\')"/></div>' +
		"</div>" +
		'<div class="d-flex justify-content-end">' +
		'<button type="button" class="btn btn-primary btn-sm" onclick="enrAvailSaveEdit(\'' +
		r.id +
		"','" +
		px +
		'\')">Save</button>' +
		'<button type="button" class="btn btn-outline-secondary btn-sm ml-2" onclick="enrAvailCancelEdit()">Cancel</button>' +
		"</div>"
	);
}

	function enrAvailRenderTable() {
		var $tbody = $("#enrAvailTblBody");
		var recs = enrAvailFilteredRealSavedRecords();
		if (!recs.length) {
			$tbody.html('<tr><td colspan="11" class="text-center text-muted py-4">No records yet</td></tr>');
			if ($("#enrAvailSelAll").length) $("#enrAvailSelAll").prop("checked", false).prop("indeterminate", false);
			return;
	}

	var html = "";
	recs.forEach(function (r, i) {
		var p = enrAvailGetPct(r);
		var pBar = Math.max(0, Math.min(100, p));
		var programBadge = enrAvailProgramBadge(r.programId);
		var px = "enrAvailTblEdit_" + enrAvailSafeDomId(r.id);
		var rid = String(r.id);
		var isChecked = !!enrAvailSelectedIds[rid];

		if (enrAvailEditingId == r.id) {
			html +=
				'<tr class="editing-row"><td colspan="11">' +
				'<div class="font-weight-bold mb-2">Edit record #' +
				(i + 1) +
				"</div>" +
				enrAvailEditFields(r, px) +
				"</td></tr>";
			return;
		}

		html +=
			"<tr>" +
			'<td class="border-0 py-2 px-2"><input type="checkbox" class="enrAvailSelOne" data-id="' +
			enrAvailEsc(rid) +
			'" ' +
			(isChecked ? "checked" : "") +
			"/></td>" +
			'<td class="text-muted font-weight-bold border-0 py-2 px-2">' +
			(i + 1) +
			"</td>" +
			'<td class="font-weight-semi-bold border-0 py-2 px-2">' +
			enrAvailEsc(r.country) +
			"</td>" +
			'<td class="border-0 py-2 px-2"><span class="badge badge-pill ' +
			programBadge +
			'">' +
			enrAvailEsc(r.program) +
			"</span></td>" +
			'<td class="border-0 py-2 px-2">' +
			enrAvailEsc(r.grade) +
			"</td>" +
			'<td class="font-weight-bold border-0 py-2 px-2">' +
			(r.total || 0) +
			"</td>" +
			'<td class="text-info font-weight-bold border-0 py-2 px-2">' +
			(r.booked || 0) +
			"</td>" +
			'<td class="text-success font-weight-bold border-0 py-2 px-2">' +
			(r.remaining || 0) +
			"</td>" +
			'<td class="text-warning font-weight-bold border-0 py-2 px-2">' +
			(r.about || 0) +
			"</td>" +
			'<td class="border-0 py-2 px-2">' +
			'<div class="d-flex align-items-center">' +
			'<div class="progress progress-bar-xs progress-bar-rounded flex-grow-1 mr-2">' +
			'<div class="progress-bar ' +
			enrAvailProgressClass(p) +
			'" role="progressbar" style="width:' +
			pBar +
			'%"></div></div>' +
			'<span class="font-12 font-weight-bold">' +
			p +
			"%</span></div>" +
			"</td>" +
			'<td class="border-0 text-right py-2 px-2"><div class="d-inline-flex">' +
			'<button type="button" class="btn btn-outline-primary btn-sm mr-2" onclick="enrAvailStartEdit(\'' +
			r.id +
			"')\">Edit</button>" +
			'<button type="button" class="btn btn-outline-danger btn-sm" onclick="enrAvailDelRec(\'' +
			r.id +
			"')\">Delete</button>" +
			"</div></td>" +
			"</tr>";
	});

	$tbody.html(html);

	enrAvailUpdateSelectionUI();
	enrAvailUpdateSelectAllState();
}

	function enrAvailUpdateSelectAllState() {
		try {
			var recs = enrAvailFilteredRealSavedRecords();
			var total = recs.length;
			var selected = 0;
			recs.forEach(function (r) {
				if (r && enrAvailSelectedIds[String(r.id)]) selected++;
			});
		var $all = $("#enrAvailSelAll");
		if (!$all.length) return;
		if (!total) {
			$all.prop("checked", false).prop("indeterminate", false);
			return;
		}
		$all.prop("checked", selected === total);
		$all.prop("indeterminate", selected > 0 && selected < total);
	} catch (e) {}
}

function enrAvailRenderView() {
	var total = enrAvailRecords.reduce(function (a, r) {
		return a + (r.total || 0);
	}, 0);
	var booked = enrAvailRecords.reduce(function (a, r) {
		return a + (r.booked || 0);
	}, 0);
	var remaining = enrAvailRecords.reduce(function (a, r) {
		return a + (r.remaining || 0);
	}, 0);
	var about = enrAvailRecords.reduce(function (a, r) {
		return a + (r.about || 0);
	}, 0);

	if ($("#enrAvailSvTotal").length) $("#enrAvailSvTotal").text(total.toLocaleString());
	if ($("#enrAvailSvBooked").length) $("#enrAvailSvBooked").text(booked.toLocaleString());
	if ($("#enrAvailSvRemaining").length) $("#enrAvailSvRemaining").text(remaining.toLocaleString());
	if ($("#enrAvailSvAbout").length) $("#enrAvailSvAbout").text(about.toLocaleString());

	var $cg = $("#enrAvailCountryGrid");
	if (!enrAvailRecords.length) {
		$cg.text("No records — go to Entry tab and save some data");
		return;
	}

	$cg.removeClass("text-muted text-center py-4").addClass("py-2");
	$cg.html(enrAvailRenderCountryPreview());
	enrAvailInitPreviewFilters($cg[0]);
}

function enrAvailUrgencyMeta(pct, remaining) {
	var p = parseInt(pct, 10) || 0;
	var r = parseInt(remaining, 10);
	if (isNaN(r)) r = 0;

	// Use remaining + filled to decide urgency
	if (r <= 0) {
		return { bg: "bg-light-danger", text: "text-danger", dot: "bg-danger", border: "#d92550", bar: "bg-danger" };
	}
	if (p > 80 || r <= 10) {
		return { bg: "bg-light-warning", text: "text-warning", dot: "bg-warning", border: "#f7b924", bar: "bg-warning" };
	}
	return { bg: "bg-light-success", text: "text-success", dot: "bg-success", border: "#1fc747", bar: "bg-success" };
}

function enrAvailToInt(v) {
	var n = parseInt(String(v === undefined || v === null ? "" : v), 10);
	return isNaN(n) ? 0 : n;
}

function enrAvailFmtInt(v) {
	return enrAvailToInt(v).toLocaleString();
}

function enrAvailBuildDemoCounselorRecords() {
	return [
		{ id: "DEMO_1", country: "India", program: "Self Learning", grade: "Grade 8", total: 20, booked: 7, about: 3, remaining: 10, programId: "SELF", lastYearStrength: 65 },
		{ id: "DEMO_2", country: "India", program: "Flexy", grade: "Grade 9", total: 15, booked: 14, about: 0, remaining: 1, programId: "FLEXY", lastYearStrength: 80 },
		{ id: "DEMO_3", country: "United States", program: "Flexy", grade: "Grade 6", total: 10, booked: 10, about: 0, remaining: 0, programId: "FLEXY", lastYearStrength: 95 },
		{ id: "DEMO_4", country: "United Kingdom", program: "Group", grade: "Grade 10", total: 25, booked: 12, about: 6, remaining: 13, programId: "GROUP", lastYearStrength: 48 },
		{ id: "DEMO_5", country: "UAE", program: "1:1 & Group", grade: "Grade 7", total: 12, booked: 11, about: 2, remaining: 1, programId: "ONEGROUP", lastYearStrength: 72 },
	];
}

function enrAvailCounselorPreviewRecords() {
	var recs = Array.isArray(enrAvailRecords) ? enrAvailRecords : [];
	return recs.length ? recs : enrAvailBuildDemoCounselorRecords();
}

function enrAvailNormKey(v) {
	return String(v || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "");
}

function enrAvailProgramSequenceIndex(label) {
	var k = enrAvailNormKey(label);
	// tolerant matching: production labels may vary slightly
	if (!k) return 999;
	// ONE_TO_ONE
	if (k.indexOf("onetoone") >= 0 && k.indexOf("flex") < 0) return 0;
	// BATCH
	if (k.indexOf("batch") >= 0 || k.indexOf("group") >= 0) return 1;
	// SCHOLARSHIP
	if (k.indexOf("scholarship") >= 0) return 2;
	// SSP
	if (k.indexOf("ssp") >= 0 || k.indexOf("selfstudy") >= 0) return 3;
	// ONE_TO_ONE_FLEX
	if (k.indexOf("onetoone") >= 0 && k.indexOf("flex") >= 0) return 4;
	if (k.indexOf("flexy") >= 0) return 4;
	// DUAL_DIPLOMA
	if (k.indexOf("dual") >= 0) return 5;
	return 999;
}

function enrAvailRenderCounselorPreview(opts) {
	opts = opts || {};
	var recs = enrAvailCounselorPreviewRecords();

	// Filter strip options (use full masters list so filters always show all values)
	function uniqStr(list) {
		var out = [];
		var seen = {};
		(list || []).forEach(function (x) {
			var s = String(x || "").trim();
			if (!s) return;
			if (seen[s]) return;
			seen[s] = true;
			out.push(s);
		});
		return out;
	}
	function sortText(a, b) {
		return String(a).localeCompare(String(b));
	}

	var allCountries = uniqStr((enrAvailMasters.countries || []).map(function (x) { return x && x.label; }));
	if (!allCountries.length) {
		allCountries = uniqStr((recs || []).map(function (r) { return r && r.country; }));
	}
	allCountries.sort(sortText);

	var allPrograms = uniqStr((enrAvailMasters.programs || []).map(function (x) { return x && x.label; }));
	if (!allPrograms.length) {
		allPrograms = uniqStr((recs || []).map(function (r) { return r && r.program; }));
	}
	allPrograms.sort(function (a, b) {
		var ai = enrAvailProgramSequenceIndex(a);
		var bi = enrAvailProgramSequenceIndex(b);
		if (ai !== bi) return ai - bi;
		return String(a).localeCompare(String(b));
	});

	var allGrades = uniqStr((enrAvailMasters.grades || []).map(function (x) { return x && x.label; }));
	if (!allGrades.length) {
		allGrades = uniqStr((recs || []).map(function (r) { return r && r.grade; })).sort(sortText);
	}

	function optionHtml(values) {
		return (values || [])
			.map(function (v) {
				return '<option value="' + enrAvailEsc(v) + '">' + enrAvailEsc(v) + "</option>";
			})
			.join("");
	}

	var countryOpts = optionHtml(allCountries);
	var programOpts = optionHtml(allPrograms);
	var gradeOpts = optionHtml(allGrades);

	var previewTidyStyle =
		"<style>" +
		".enrAvailClearBtn:hover,.enrAvailClearBtn:focus,.enrAvailClearBtn:active{color:#000 !important;}" +
		"</style>";

	var filterStrip =
		previewTidyStyle +
		(opts.hideFilterStrip
			? ""
			:
		'<div id="enrAvailFilterStrip" class="card rounded-10 mb-3">' +
		'<div class="card-body py-2">' +
		'<div class="d-flex flex-wrap align-items-end">' +
		'<div class="mr-2 mb-2" style="min-width:200px;">' +
		'<div class="text-muted font-12 mb-1">Country</div>' +
		'<select id="enrAvailF_Country" class="form-control form-control-sm rounded-10">' +
		'<option value="">Select Country</option>' +
		countryOpts +
		"</select>" +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:200px;">' +
		'<div class="text-muted font-12 mb-1">Program</div>' +
		'<select id="enrAvailF_Program" class="form-control form-control-sm rounded-10">' +
		'<option value="">Select Program</option>' +
		programOpts +
		"</select>" +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:160px;">' +
		'<div class="text-muted font-12 mb-1">Grade</div>' +
		'<select id="enrAvailF_Grade" class="form-control form-control-sm rounded-10">' +
		'<option value="">Select Grade</option>' +
		gradeOpts +
		"</select>" +
		"</div>" +
		'<div class="d-flex align-items-center mb-2">' +
		'<button type="button" class="btn btn-outline-secondary btn-sm rounded-10 mr-2 enrAvailClearBtn" id="enrAvailF_Clear">Clear</button>' +
		'<span class="badge badge-pill bg-light-primary text-primary" id="enrAvailF_Count" style="text-transform:none;"></span>' +
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>");

	var sumTotal = 0;
	var sumBooked = 0;
	var sumAbout = 0;
	var sumRemaining = 0;
	var sumWait = 0;
	var sumOverbooked = 0;
	(recs || []).forEach(function (r) {
		var sm = enrAvailSummaryMeta(r && r.total, r && r.booked, r && r.about, r && r.wait);
		sumTotal += enrAvailToInt(r && r.total);
		sumBooked += enrAvailToInt(r && r.booked);
		sumAbout += enrAvailToInt(r && r.about);
		sumRemaining += enrAvailToInt((r && (r.free !== undefined ? r.free : r.remaining)) || 0);
		sumWait += enrAvailToInt(r && r.wait);
		sumOverbooked += enrAvailToInt(sm && sm.overbooked);
	});

	var header =
		'<div class="card rounded-15 mb-3" id="enrAvailSummaryCard">' +
		'<div class="card-body py-3">' +
		'<div class="font-24 font-weight-bold text-dark" id="enrAvailCH_Title">' +
		sumRemaining.toLocaleString() +
		" seats available</div>" +
		'<div class="text-muted font-12 mt-1" id="enrAvailCH_Subtitle">' +
		sumBooked.toLocaleString() +
		" confirmed enrollments · " +
		sumAbout.toLocaleString() +
		" reserved (pending) · " +
		sumWait.toLocaleString() +
		" waitlist · " +
		sumOverbooked.toLocaleString() +
		" overbooked · " +
		sumTotal.toLocaleString() +
		" total seats</div>" +
		"</div>" +
		"</div>";
	if (opts.hideHeader) header = "";

	// Intentionally removed: individual stats cards (Total/Reserved/Confirmed/Wait/Available)
	var stats = "";

	var sortedRecs = (recs || []).slice(0);
	sortedRecs.sort(function (a, b) {
		var ap = enrAvailProgramSequenceIndex(a && a.program);
		var bp = enrAvailProgramSequenceIndex(b && b.program);
		if (ap !== bp) return ap - bp;
		return String((a && a.program) || "").localeCompare(String((b && b.program) || ""));
	});

	var rowsHtml = (sortedRecs || [])
		.map(function (r, idx) {
			var sm = enrAvailSummaryMeta(r.total, r.booked, r.about, r.wait);
			var pct = sm.filled;
			var pctBar = Math.max(0, Math.min(100, pct));
			var free = enrAvailToInt(sm.free);
			var confirmed = enrAvailToInt(r && r.booked);
			var wait = enrAvailToInt(r && r.wait);
			var overbooked = enrAvailToInt(sm && (sm.overbooked !== undefined ? sm.overbooked : sm.wait));
			var badgeClass = (sm && sm.pill && sm.pill.badgeClass) || "bg-light-secondary text-muted";
			var pal = enrAvailProgramPalette(r.programId || r.program || "");

				return (
					'<tr class="enrAvailRecRow" data-enr-country="' +
						enrAvailEsc(r.country) +
						'" data-enr-program="' +
						enrAvailEsc(r.program) +
						'" data-enr-grade="' +
						enrAvailEsc(r.grade) +
					'" data-enr-id="' +
					enrAvailEsc(r.id) +
					'" data-enr-total="' +
					enrAvailEsc(enrAvailToInt(r.total)) +
				'" data-enr-booked="' +
				enrAvailEsc(enrAvailToInt(r.booked)) +
				'" data-enr-about="' +
				enrAvailEsc(enrAvailToInt(r.about)) +
				'" data-enr-free="' +
				enrAvailEsc(free) +
				'" data-enr-wait="' +
				enrAvailEsc(wait) +
				'" data-enr-overbooked="' +
				enrAvailEsc(overbooked) +
					'" data-enr-remaining="' +
					enrAvailEsc(free) +
					'" data-enr-lys="' +
					enrAvailEsc(enrAvailToInt(r.lastYearStrength)) +
					'">' +
					'<td class="text-muted font-12 font-weight-semi-bold text-center">' +
					enrAvailEsc(idx + 1) +
					"</td>" +
					'<td class="text-center">' +
					enrAvailEsc(r.country) +
					"</td>" +
					'<td class="text-center"><span class="badge badge-pill px-3 py-1 d-inline-block text-truncate" title="' +
					enrAvailEsc(r.program) +
					'" style="max-width:230px;background:' +
					enrAvailEsc(pal.bg) +
					";color:" +
					enrAvailEsc(pal.fg) +
					';border:1px solid rgba(0,0,0,.06);">' +
					enrAvailEsc(r.program) +
					"</span></td>" +
					'<td class="text-center"><span class="badge badge-pill bg-light-secondary text-muted px-3 py-1">' +
					enrAvailEsc(r.grade) +
					"</span></td>" +
					'<td class="font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailFmtInt(r.total)) +
					"</td>" +
					'<td class="text-info font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailFmtInt(confirmed)) +
					"</td>" +
					'<td class="text-warning font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailFmtInt(r.about)) +
					"</td>" +
					'<td class="text-primary font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailFmtInt(wait)) +
					"</td>" +
					'<td class="text-success font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailFmtInt(free)) +
					"</td>" +
					'<td class="text-danger font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailFmtInt(overbooked)) +
					"</td>" +
					'<td class="font-weight-semi-bold text-center">' +
					enrAvailEsc(enrAvailToInt(r.lastYearStrength)) +
					'%</td>' +
							'<td class="text-left" style="min-width:200px;">' +
							'<div class="d-inline-flex flex-column align-items-start justify-content-start">' +
							'<div class="d-inline-flex align-items-center justify-content-start" style="gap:12px;">' +
							'<span class="text-muted font-12 font-weight-semi-bold" style="width:46px;text-align:center;line-height:1;">' +
							enrAvailEsc(pct) +
							'%</span>' +
							'<div class="progress progress-bar-xs progress-bar-rounded" style="width:160px;height:6px;background:rgba(0,0,0,.08);border-radius:999px;overflow:hidden;">' +
							'<div class="progress-bar ' +
							enrAvailProgressClass(pct) +
							'" role="progressbar" style="height:100%;border-radius:999px;width:' +
							pctBar +
							'%"></div></div>' +
							"</div>" +
							"</div>" +
							"</td>" +
						'<td class="text-center"><span class="badge badge-pill ' +
						badgeClass +
						' px-3 py-1" style="text-transform:none;">' +
						enrAvailEsc(sm.status) +
						"</span></td>" +
						"</tr>"
				);
			})
			.join("");

	var table =
		'<div class="card rounded-15">' +
		'<div class="card-body py-3">' +
		'<div class="d-flex align-items-center justify-content-between flex-wrap mb-2">' +
		'<div class="font-weight-bold text-dark">Data</div>' +
		'<div class="text-muted font-12"></div>' +
		"</div>" +
		'<div class="table-responsive">' +
		'<table class="table table-hover mb-0">' +
				"<thead>" +
				"<tr>" +
				'<th class="text-muted font-12 text-center">#</th>' +
				'<th class="text-muted font-12 text-center">Country</th>' +
				'<th class="text-muted font-12 text-center">Program</th>' +
				'<th class="text-muted font-12 text-center">Grade</th>' +
				'<th class="text-muted font-12 text-center">Capacity</th>' +
					'<th class="text-muted font-12 text-center">Confirmed</th>' +
					'<th class="text-muted font-12 text-center">Reserved</th>' +
					'<th class="text-muted font-12 text-center">Waiting</th>' +
					'<th class="text-muted font-12 text-center">Available</th>' +
					'<th class="text-muted font-12 text-center">Overbooked</th>' +
					'<th class="text-muted font-12 text-center">Last Year Strength(%)</th>' +
						'<th class="text-muted font-12 text-left" style="padding-left:20px;">Current Year Strength(%)</th>' +
					'<th class="text-muted font-12 text-center">Status</th>' +
					"</tr>" +
					"</thead>" +
				"<tbody>" +
				rowsHtml +
				'<tr id="enrAvailCounselorEmpty" style="display:none;"><td colspan="13" class="text-muted text-center py-4">No records match these filters</td></tr>' +
				"</tbody>" +
				"</table>" +
			"</div>" +
			"</div>" +
			"</div>";

	return filterStrip + header + stats + table;
}

function enrAvailRenderCountryPreview() {
	// Filter strip options (use full masters list so filters always show all values)
	function uniqStr(list) {
		var out = [];
		var seen = {};
		(list || []).forEach(function (x) {
			var s = String(x || "").trim();
			if (!s) return;
			if (seen[s]) return;
			seen[s] = true;
			out.push(s);
		});
		return out;
	}
	function sortText(a, b) {
		return String(a).localeCompare(String(b));
	}

	var allCountries = uniqStr((enrAvailMasters.countries || []).map(function (x) { return x && x.label; }));
	if (!allCountries.length) {
		allCountries = uniqStr((enrAvailRecords || []).map(function (r) { return r && r.country; }));
	}
	allCountries.sort(sortText);

	var allPrograms = uniqStr((enrAvailMasters.programs || []).map(function (x) { return x && x.label; }));
	if (!allPrograms.length) {
		allPrograms = uniqStr((enrAvailRecords || []).map(function (r) { return r && r.program; }));
	}
	allPrograms.sort(function (a, b) {
		var ai = enrAvailProgramSequenceIndex(a);
		var bi = enrAvailProgramSequenceIndex(b);
		if (ai !== bi) return ai - bi;
		return String(a).localeCompare(String(b));
	});

	var allGrades = uniqStr((enrAvailMasters.grades || []).map(function (x) { return x && x.label; }));
	if (!allGrades.length) {
		allGrades = uniqStr((enrAvailRecords || []).map(function (r) { return r && r.grade; })).sort(sortText);
	}

	var countryOpts = (allCountries || [])
		.map(function (c) {
			return '<option value="' + enrAvailEsc(c) + '">' + enrAvailEsc(c) + "</option>";
		})
		.join("");

	var programOpts = (allPrograms || [])
		.map(function (p) {
			return '<option value="' + enrAvailEsc(p) + '">' + enrAvailEsc(p) + "</option>";
		})
		.join("");

	var gradeOpts = (allGrades || [])
		.map(function (g) {
			return '<option value="' + enrAvailEsc(g) + '">' + enrAvailEsc(g) + "</option>";
		})
		.join("");

	var filterStrip =
		'<div id="enrAvailFilterStrip" class="card rounded-10 mb-3">' +
		'<div class="card-body py-2">' +
		'<div class="d-flex flex-wrap align-items-end">' +
		'<div class="mr-2 mb-2" style="min-width:180px;">' +
		'<div class="text-muted font-12 mb-1">Country</div>' +
		'<select id="enrAvailF_Country" class="form-control form-control-sm rounded-10">' +
		'<option value="">Select Country</option>' +
		countryOpts +
		"</select>" +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:180px;">' +
		'<div class="text-muted font-12 mb-1">Program</div>' +
		'<select id="enrAvailF_Program" class="form-control form-control-sm rounded-10">' +
		'<option value="">Select Program</option>' +
		programOpts +
		"</select>" +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:160px;">' +
		'<div class="text-muted font-12 mb-1">Grade</div>' +
		'<select id="enrAvailF_Grade" class="form-control form-control-sm rounded-10">' +
		'<option value="">Select Grade</option>' +
		gradeOpts +
		"</select>" +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:120px;">' +
		'<div class="text-muted font-12 mb-1">Total seats</div>' +
		'<input id="enrAvailF_TotalMin" type="number" min="0" step="1" class="form-control form-control-sm rounded-10" placeholder="Min" />' +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:120px;">' +
		'<div class="text-muted font-12 mb-1">Booked</div>' +
		'<input id="enrAvailF_BookedMin" type="number" min="0" step="1" class="form-control form-control-sm rounded-10" placeholder="Min" />' +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:130px;">' +
		'<div class="text-muted font-12 mb-1">Remaining</div>' +
		'<input id="enrAvailF_RemainingMin" type="number" min="0" step="1" class="form-control form-control-sm rounded-10" placeholder="Min" />' +
		"</div>" +
		'<div class="mr-2 mb-2" style="min-width:150px;">' +
		'<div class="text-muted font-12 mb-1">About to book</div>' +
		'<input id="enrAvailF_AboutMin" type="number" min="0" step="1" class="form-control form-control-sm rounded-10" placeholder="Min" />' +
		"</div>" +
		'<div class="d-flex align-items-center mb-2">' +
		'<button type="button" class="btn btn-outline-secondary btn-sm rounded-10 mr-2" id="enrAvailF_Clear">Clear</button>' +
		'<span class="badge badge-pill bg-light-primary text-primary" id="enrAvailF_Count" style="text-transform:none;"></span>' +
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>";

	var groups = {};
	(enrAvailRecords || []).forEach(function (r) {
		var c = r.country || "";
		if (!groups[c]) groups[c] = [];
		groups[c].push(r);
	});

	var countries = Object.keys(groups).sort(function (a, b) {
		return String(a).localeCompare(String(b));
	});

	var listHtml = countries
		.map(function (country) {
			var recs = groups[country] || [];

			var cTotal = recs.reduce(function (a, r) {
				return a + (r.total || 0);
			}, 0);
			var cBooked = recs.reduce(function (a, r) {
				return a + (r.booked || 0);
			}, 0);
			var cRemaining = recs.reduce(function (a, r) {
				return a + (r.remaining || 0);
			}, 0);
			var cPct = cTotal ? Math.round((cBooked / cTotal) * 100) : 0;
			var cPctBar = Math.max(0, Math.min(100, cPct));

			var uniqPrograms = {};
			recs.forEach(function (r) {
				uniqPrograms[String(r.programId || r.program || "")] = true;
			});
			var programCount = Object.keys(uniqPrograms).filter(Boolean).length || recs.length;

			var colors = enrAvailFlagOf(country);
			var bg = colors[0] || "#eef3ff";
			var fg = colors[1] || "var(--pc)";
			var headerBar = '<div class="progress progress-bar-xs progress-bar-rounded" style="width:110px;">' +
				'<div class="progress-bar ' +
				enrAvailProgressClass(cPct) +
				'" role="progressbar" style="width:' +
				cPct +
				'%"></div></div>';

			var header =
				'<div class="d-flex align-items-center justify-content-between flex-wrap mb-2 mx-auto px-2 px-md-3" style="max-width:1180px;width:100%;">' +
				'<div class="d-flex align-items-center">' +
				'<div class="rounded-15 d-flex align-items-center justify-content-center font-weight-bold mr-3" style="width:44px;height:44px;background:' +
				bg +
				";color:" +
				fg +
				';">' +
				enrAvailEsc(enrAvailIni(country)) +
				"</div>" +
				'<div>' +
				'<div class="font-20 font-weight-bold text-dark mb-1">' +
				enrAvailEsc(country) +
				"</div>" +
				'<div class="text-muted font-14">' +
				enrAvailEsc(programCount) +
				" program" +
				(programCount > 1 ? "s" : "") +
				' <span class="mx-2">·</span> <span class="' +
				enrAvailUrgencyMeta(cPct, cRemaining).text +
				' font-weight-bold">' +
				cRemaining.toLocaleString() +
				" seats remaining overall</span></div>" +
				"</div>" +
				"</div>" +
				'<div class="d-flex align-items-center mt-2 mt-md-0">' +
				'<div class="text-muted font-14 font-weight-bold mr-3">' +
				cPct +
				"% filled</div>" +
				'<div class="progress progress-bar-xs progress-bar-rounded" style="width:90px;">' +
				'<div class="progress-bar ' +
				enrAvailProgressClass(cPct) +
				'" role="progressbar" style="width:' +
				cPctBar +
				'%"></div></div>' +
				"</div>" +
				"</div>";

			var rows = recs
				.map(function (r) {
					var p = enrAvailGetPct(r);
					var pBar = Math.max(0, Math.min(100, p));
					var remaining = r.remaining || 0;
					var meta = enrAvailUrgencyMeta(p, remaining);
					var bookedText = (r.booked || 0).toLocaleString() + " booked of " + (r.total || 0).toLocaleString();

					var programPill =
						'<span class="badge badge-pill bg-light-primary text-primary px-3 py-1 d-inline-block mb-1 font-12">' +
						enrAvailEsc(r.program) +
						"</span>";
					var gradePill =
						'<span class="badge badge-pill bg-light-secondary text-muted px-3 py-1 d-inline-block font-12">' +
						enrAvailEsc(r.grade) +
						"</span>";

					var availText = remaining > 0 ? remaining.toLocaleString() + " seats available" : "No seats available";

					return (
						'<div class="enrAvailRecCard border rounded-15 mx-auto ' +
						meta.bg +
						' py-2 px-3 mb-3" style="border-left:6px solid ' +
						meta.border +
						' !important;max-width:1180px;width:100%;" data-enr-country="' +
						enrAvailEsc(r.country) +
						'" data-enr-program="' +
						enrAvailEsc(r.program) +
						'" data-enr-grade="' +
						enrAvailEsc(r.grade) +
						'" data-enr-total="' +
						enrAvailEsc(r.total || 0) +
						'" data-enr-booked="' +
						enrAvailEsc(r.booked || 0) +
						'" data-enr-remaining="' +
						enrAvailEsc(r.remaining || 0) +
						'" data-enr-about="' +
						enrAvailEsc(r.about || 0) +
						'">' +
						'<div class="row align-items-center">' +
						'<div class="col-lg-3 col-md-12 mb-2 mb-lg-0">' +
						'<div class="d-flex flex-column">' +
						programPill +
						gradePill +
						"</div>" +
						"</div>" +
						'<div class="col-lg-6 col-md-12 mb-2 mb-lg-0">' +
						'<div class="progress progress-bar-xs progress-bar-rounded w-100 mb-1">' +
						'<div class="progress-bar ' +
						meta.bar +
						'" role="progressbar" style="width:' +
						pBar +
						'%"></div></div>' +
						'<div class="d-flex align-items-center justify-content-between flex-wrap">' +
						'<div class="text-muted font-14 font-weight-semi-bold">' +
						enrAvailEsc(bookedText) +
						"</div>" +
						'<div class="' +
						meta.text +
						' font-14 font-weight-bold">' +
						p +
						"% filled</div>" +
						"</div>" +
						"</div>" +
						'<div class="col-lg-3 col-md-12 text-right">' +
						'<div class="' +
						meta.text +
						' font-weight-bold" style="font-size:36px;line-height:1;">' +
						remaining.toLocaleString() +
						"</div>" +
						'<div class="text-muted font-12 font-weight-semi-bold mb-1">seats remaining</div>' +
						'<div class="d-inline-flex align-items-center badge badge-pill ' +
						meta.bg +
						" " +
						meta.text +
						' px-3 py-1 font-12">' +
						'<span class="rounded-circle ' +
						meta.dot +
						' mr-2" style="width:8px;height:8px;"></span>' +
						enrAvailEsc(availText) +
						"</div>" +
						"</div>" +
						"</div>" +
						"</div>"
					);
				})
				.join("");

			return '<div class="enrAvailCountrySection mb-4" data-enr-country="' + enrAvailEsc(country) + '">' + header + rows + "</div>";
		})
		.join("");

	return filterStrip + '<div id="enrAvailPreviewList">' + listHtml + "</div>";
}

function enrAvailInitPreviewFilters(rootEl) {
	try {
		var root = rootEl || document;
		var strip = root.querySelector && root.querySelector("#enrAvailFilterStrip");
		if (!strip) return;

		var selCountry = root.querySelector("#enrAvailF_Country");
		var selProgram = root.querySelector("#enrAvailF_Program");
		var selGrade = root.querySelector("#enrAvailF_Grade");
		var inTotal = root.querySelector("#enrAvailF_TotalMin");
		var inBooked = root.querySelector("#enrAvailF_BookedMin");
		var inRemaining = root.querySelector("#enrAvailF_RemainingMin");
		var inAbout = root.querySelector("#enrAvailF_AboutMin");
		var btnClear = root.querySelector("#enrAvailF_Clear");
		var countEl = root.querySelector("#enrAvailF_Count");

		var cards = Array.prototype.slice.call(root.querySelectorAll(".enrAvailRecCard"));
		var sections = Array.prototype.slice.call(root.querySelectorAll(".enrAvailCountrySection"));

		// Make dropdowns searchable (select2) if available
		try {
			if (window.$ && $.fn && $.fn.select2) {
				[selCountry, selProgram, selGrade].forEach(function (el) {
					if (!el) return;
					if (String(el.tagName || "").toLowerCase() !== "select") return;
					var $el = $(el);
					try {
						if ($el.hasClass("select2-hidden-accessible")) $el.select2("destroy");
					} catch (e) {}
					$el.select2({ width: "100%", minimumResultsForSearch: 0, dropdownParent: $(strip) });
				});
			}
		} catch (e) {}

		function v(el) {
			return String((el && el.value) || "").trim();
		}
		function n(el) {
			var x = parseInt(v(el), 10);
			return isNaN(x) ? null : x;
		}

		function apply() {
			var fc = v(selCountry);
			var fp = v(selProgram);
			var fg = v(selGrade);

			var tMin = n(inTotal);
			var bMin = n(inBooked);
			var rMin = n(inRemaining);
			var aMin = n(inAbout);

			var visibleCount = 0;
			var visibleSections = {};

			cards.forEach(function (card) {
				var ok = true;
				if (fc && card.getAttribute("data-enr-country") !== fc) ok = false;
				if (ok && fp && card.getAttribute("data-enr-program") !== fp) ok = false;
				if (ok && fg && card.getAttribute("data-enr-grade") !== fg) ok = false;

				if (ok && tMin !== null && (parseInt(card.getAttribute("data-enr-total") || "0", 10) || 0) < tMin) ok = false;
				if (ok && bMin !== null && (parseInt(card.getAttribute("data-enr-booked") || "0", 10) || 0) < bMin) ok = false;
				if (ok && rMin !== null && (parseInt(card.getAttribute("data-enr-remaining") || "0", 10) || 0) < rMin) ok = false;
				if (ok && aMin !== null && (parseInt(card.getAttribute("data-enr-about") || "0", 10) || 0) < aMin) ok = false;

				card.style.display = ok ? "" : "none";
				if (ok) {
					visibleCount++;
					var sec = card.closest ? card.closest(".enrAvailCountrySection") : null;
					if (sec) visibleSections[sec.getAttribute("data-enr-country") || sec] = true;
				}
			});

			sections.forEach(function (sec) {
				var any = false;
				var scards = sec.querySelectorAll(".enrAvailRecCard");
				for (var i = 0; i < scards.length; i++) {
					if (scards[i].style.display !== "none") {
						any = true;
						break;
					}
				}
				sec.style.display = any ? "" : "none";
			});

			if (countEl) {
				countEl.textContent = visibleCount.toLocaleString() + " record" + (visibleCount === 1 ? "" : "s");
			}
		}

		function bind(el, evt) {
			if (!el || !el.addEventListener) return;
			el.addEventListener(evt, apply);
		}

		["change"].forEach(function (e) {
			bind(selCountry, e);
			bind(selProgram, e);
			bind(selGrade, e);
		});
		["input", "change"].forEach(function (e) {
			bind(inTotal, e);
			bind(inBooked, e);
			bind(inRemaining, e);
			bind(inAbout, e);
		});

		if (btnClear && btnClear.addEventListener) {
			btnClear.addEventListener("click", function () {
				function clearSel(el) {
					if (!el) return;
					try {
						if (window.$ && $.fn && $.fn.select2) {
							var $el = $(el);
							if ($el.hasClass("select2-hidden-accessible")) {
								$el.val("").trigger("change");
								return;
							}
						}
					} catch (e) {}
					el.value = "";
				}

				clearSel(selCountry);
				clearSel(selProgram);
				clearSel(selGrade);
				if (inTotal) inTotal.value = "";
				if (inBooked) inBooked.value = "";
				if (inRemaining) inRemaining.value = "";
				if (inAbout) inAbout.value = "";
				apply();
			});
		}

		apply();
	} catch (e) {
		// ignore filter init errors
	}
}

function enrAvailToast(msg) {
	var messageType = 1;
	var message = msg;
	if (arguments.length > 1) {
		messageType = arguments[0];
		message = arguments[1];
	}
	if (!message) return;
	if (typeof showMessageTheme2 === "function") {
		showMessageTheme2(messageType, message, "", true);
	}
}

async function enrAvailLoadMasters() {
	if (enrAvailMasters.loaded) return enrAvailMasters;

	enrAvailMaybeLoader(true);
	try {
		var results = await Promise.all([
			enrAvailFetchMasters("COUNTRIES-LIST", "", "", "countries"),
			enrAvailFetchLearningPrograms(),
			enrAvailFetchMasters("ALL-STANDARD-LIST", "", "gradeList", "standards"),
		]);

		enrAvailMasters.countries = (results[0] || []).map(function (c) {
			return { id: c.key, label: c.value };
		});
		enrAvailMasters.programs = (results[1] || []).map(function (p) {
			return { id: p.key, label: p.value, enrollmentFor: p.extra, courseProviderIds: p.extra1 };
		});
		enrAvailMasters.grades = (results[2] || []).map(function (g) {
			return { id: g.key, label: g.value };
		});

		enrAvailMasters.loaded = true;
	} catch (e) {
		console.error(e);
		showMessageTheme2(0, "Unable to load Country/Program/Grade masters.", "", true);
	} finally {
		enrAvailMaybeLoader(false);
	}

	return enrAvailMasters;
}

function enrAvailFetchLearningPrograms() {
	return new Promise(function (resolve, reject) {
		var request = enrAvailBuildRequest("LEARNING_PROGRAM_LIST", String(SCHOOL_ID || 1), "N");
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: getURLForCommon("masters"),
			data: JSON.stringify(request),
			dataType: "json",
			cache: false,
			timeout: 600000,
			success: function (data) {
				var list = (data && data.mastersData && data.mastersData.learningPrograms) || [];
				var filtered = list.filter(function (x) {
					return x && x.extra === "enrollment";
				});
				resolve(filtered.length ? filtered : list);
			},
			error: function (xhr, status, err) {
				reject(err || status || "error");
			},
		});
	});
}

function enrAvailFetchMasters(requestKey, requestValue, requestExtra, listKey) {
	return new Promise(function (resolve, reject) {
		var request = enrAvailBuildRequest(requestKey, requestValue, requestExtra);
		$.ajax({
			type: "POST",
			contentType: APPLICATION_JSON_VALUE,
			url: getURLForCommon("masters"),
			data: JSON.stringify(request),
			dataType: "json",
			cache: false,
			timeout: 600000,
			success: function (data) {
				var md = data && data.mastersData ? data.mastersData : {};
				if (listKey === "countries") return resolve(md.countries || []);
				if (listKey === "standards") return resolve(md.standards || []);
				resolve(md.data || []);
			},
			error: function (xhr, status, err) {
				reject(err || status || "error");
			},
		});
	});
}

function enrAvailBuildRequest(requestKey, requestValue, requestExtra) {
	var request = {};
	var requestData = {};
	var authentication = {};
	authentication["hash"] = typeof getHash === "function" ? getHash() : Math.random().toString(36);
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userType"] = "COMMON";
	requestData["requestKey"] = requestKey;
	requestData["requestValue"] = requestValue;
	if (requestExtra !== undefined && requestExtra !== null && requestExtra !== "") requestData["requestExtra"] = requestExtra;
	request["requestData"] = requestData;
	request["authentication"] = authentication;
	return request;
}

function enrAvailLabelById(list, id) {
	if (String(id) === "ALL") return "Any";
	var found = (list || []).find(function (x) {
		return String(x.id) === String(id);
	});
	return found ? found.label : "";
}

function enrAvailExpandCombos(countryId, programId, gradeId) {
	if (!countryId) return [];

	var programIds = [];
	var pvals = Array.isArray(programId) ? programId : [programId];
	pvals = (pvals || []).filter(function (x) {
		return x !== undefined && x !== null && String(x) !== "";
	});
	// If nothing selected -> apply to all programs
	if (!pvals.length) {
		programIds = (enrAvailMasters.programs || []).map(function (p) {
			return p.id;
		});
	} else if (pvals.map(String).indexOf("ALL") >= 0) {
		programIds = (enrAvailMasters.programs || []).map(function (p) {
			return p.id;
		});
	} else {
		programIds = pvals;
	}

	var gradeIds = [];
	var gvals = Array.isArray(gradeId) ? gradeId : [gradeId];
	gvals = (gvals || []).filter(function (x) {
		return x !== undefined && x !== null && String(x) !== "";
	});
	// If nothing selected -> apply to all grades
	if (!gvals.length) {
		gradeIds = (enrAvailMasters.grades || []).map(function (g) {
			return g.id;
		});
	} else if (gvals.map(String).indexOf("ALL") >= 0) {
		gradeIds = (enrAvailMasters.grades || []).map(function (g) {
			return g.id;
		});
	} else {
		gradeIds = gvals;
	}

	var combos = [];
	programIds.forEach(function (pid) {
		gradeIds.forEach(function (gid) {
			if (!pid || !gid) return;
			combos.push({ countryId: countryId, programId: pid, gradeId: gid });
		});
	});
	return combos;
}

function enrAvailUpsertRecord(input) {
	var countryId = input.countryId;
	var programId = input.programId;
	var gradeId = input.gradeId;

	var existing = enrAvailRecords.find(function (r) {
		return String(r.countryId) === String(countryId) && String(r.programId) === String(programId) && String(r.gradeId) === String(gradeId);
	});

	if (existing) {
		existing.total = input.total || 0;
		existing.booked = input.booked || 0;
		existing.about = input.about || 0;
		existing.wait = input.wait || 0;
		existing.remaining = Math.max(0, (existing.total || 0) - (existing.booked || 0) - (existing.about || 0) - (existing.wait || 0));
		existing.free = existing.remaining;
		existing.overbooked = Math.max(0, ((existing.booked || 0) + (existing.about || 0) + (existing.wait || 0)) - (existing.total || 0));
		existing.countryId = countryId;
		existing.programId = programId;
		existing.gradeId = gradeId;
		existing.country = enrAvailLabelById(enrAvailMasters.countries, countryId);
		existing.program = enrAvailLabelById(enrAvailMasters.programs, programId);
		existing.grade = enrAvailLabelById(enrAvailMasters.grades, gradeId);
		return false;
	}

	enrAvailRecords.push({
		id: enrAvailRecId(),
		countryId: countryId,
		country: enrAvailLabelById(enrAvailMasters.countries, countryId),
		programId: programId,
		program: enrAvailLabelById(enrAvailMasters.programs, programId),
		gradeId: gradeId,
		grade: enrAvailLabelById(enrAvailMasters.grades, gradeId),
		total: input.total || 0,
		booked: input.booked || 0,
		remaining: Math.max(0, (input.total || 0) - (input.booked || 0) - (input.about || 0) - (input.wait || 0)),
		about: input.about || 0,
		wait: input.wait || 0,
		free: Math.max(0, (input.total || 0) - (input.booked || 0) - (input.about || 0) - (input.wait || 0)),
		overbooked: Math.max(0, ((input.booked || 0) + (input.about || 0) + (input.wait || 0)) - (input.total || 0)),
	});
	return true;
}

function enrAvailHash(str) {
	var s = String(str || "");
	var h = 0;
	for (var i = 0; i < s.length; i++) {
		h = (h << 5) - h + s.charCodeAt(i);
		h |= 0;
	}
	return Math.abs(h);
}

function enrAvailCountryColors(countryLabel) {
	var palettes = [
		["#e8f0fe", "#4f8ef7"],
		["#e6f9f0", "#22c97e"],
		["#fdeaea", "#f76b6b"],
		["#fef6e4", "#f5a623"],
		["#eeecfe", "#7c6ff7"],
		["#e0fafa", "#14b8b8"],
	];
	var idx = enrAvailHash(countryLabel) % palettes.length;
	return palettes[idx][0] + "|" + palettes[idx][1];
}

function enrAvailProgramBadge(programId) {
	var badges = ["badge-primary", "badge-success", "badge-warning", "badge-info", "badge-danger", "badge-secondary"];
	var idx = enrAvailHash(programId) % badges.length;
	return badges[idx];
}

function enrAvailProgramDot(programId) {
	var dots = ["var(--blue)", "var(--green)", "var(--amber)", "var(--purple)", "var(--teal)", "var(--red)"];
	var idx = enrAvailHash(programId) % dots.length;
	return dots[idx];
}

function enrAvailProgramPalette(programKey) {
	var key = String(programKey || "").toLowerCase();

	// Pastel background + strong foreground (matches overall theme)
	var palettes = [
		{ bg: "#e8f0fe", fg: "#4f8ef7" }, // blue
		{ bg: "#e6f9f0", fg: "#22c97e" }, // green
		{ bg: "#fef6e4", fg: "#f5a623" }, // amber
		{ bg: "#eeecfe", fg: "#7c6ff7" }, // purple
		{ bg: "#e0fafa", fg: "#14b8b8" }, // teal
		{ bg: "#fdeaea", fg: "#f76b6b" }, // red
	];

	// Flexy: avoid red palette
	var list = key.indexOf("flexy") >= 0 ? palettes.slice(0, 5) : palettes;

	// Self study/learning: prefer blue-ish palette for readability
	if (key.indexOf("self") >= 0 || key.indexOf("study") >= 0 || key.indexOf("learning") >= 0) {
		return palettes[0];
	}

	var idx = enrAvailHash(programKey) % list.length;
	return list[idx];
}

function enrAvailProgressClass(pct) {
	var p = parseInt(pct, 10) || 0;
	if (p > 80) return "bg-danger";
	if (p > 50) return "bg-warning";
	return "bg-success";
}

function enrAvailMaybeLoader(on) {
	try {
		if (typeof customLoader === "function") customLoader(!!on);
	} catch (e) {}
}

function enrAvailEsc(v) {
	if (v === undefined || v === null) return "";
	return String(v)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
