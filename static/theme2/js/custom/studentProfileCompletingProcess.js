var STUDENT_PROFILE_SETTING_MAP = {};
var STUDENT_PROFILE_SETTING_PENDING_ACTION = null;
var fieldOptions = [];
var DYNAMIC_FIELDS_LIST = {};
var EDIT_INDEX = { section: null, index: null};
var CALL_CUSTOM_PROFILE_FIELD_FLAG = true;
var CUSTOM_FIELD_MAP = {};
var LAST_HIGHLIGHTED_ROW_INDEX = null;
$(document).ready(function () {
	$("#studentProfileSettingConfirmationModal").on("hidden.bs.modal", function () {
		clearStudentProfileSettingConfirmationModal();
	});
	// bindStudentProfileSettingActions();
	
});

function initStudentProfileSettingSelects() {
	$("body").append(dynamicProfileFieldBuilder());
	var learningProgram = `<option value="ALL" selected>All Program</option>`;
	learningProgram+=getLearningProgramContent(SCHOOL_ID, "N");
	$("#learningProgramIds").html(learningProgram);
	var gradeOptions = `<option value="ALL" selected>All Grade</option>`;
	gradeOptions += getGrades(getGradesData(grades_KG_12), false);
	$("#gradeIds").html(gradeOptions);

	$("#learningProgramIds").select2({
		theme: "bootstrap4",
		placeholder: "Select Learning Program",
		width: "100%"
	});
	$("#gradeIds").select2({
		theme: "bootstrap4",
		placeholder: "Select Grade",
		width: "100%"
	});
	$("#profileFieldId").select2({
		theme: "bootstrap4",
		placeholder: "Select Profile Field",
		width: "100%"
	}).on("change", function(){
		if($(this).val().length<1){
			$("#studentProfileSettingTable tbody tr").removeClass("bg-warning");
		}
	});
	$("#scheduleType").select2({
		theme: "bootstrap4",
		minimumResultsForSearch: Infinity,
		width: "100%"
	});
	$("#mandatoryOption").select2({
		theme: "bootstrap4",
		minimumResultsForSearch: Infinity,
		width: "100%"
	});

	if ($.fn.datepicker) {
		$("#scheduleDate").datepicker({
			autoclose: true,
	   		format : 'M dd, yyyy',
			defaultDate: new Date(),
			// startDate:new Date(),
			container: '#requestForProfileDataModal',
		});
	}
	$("#scheduleTime").html(generateTimeDropdown("12:00 AM", "11:59 PM", 5));
	$('#scheduleTime').select2({
		theme:"bootstrap4",
		placeholder: "Select Time*",
	});
	toggleScheduleDateTimeFields();
}


function resetStudentProfileSettingForm() {
	$("#profileSettingId").val("0");
	$("#learningProgramIds").val(null).trigger("change");
	$("#gradeIds").val(null).trigger("change");
	$("#profileFieldId").val(null).trigger("change");
	$("#scheduleType").val("NOW").trigger("change");
	$("#scheduleDate").datepicker("update", "");
	$("#scheduleTime").val("").trigger("change");
	$("#mandatoryOption").val("").trigger("change");
	$("#saveStudentProfileSetting").text("Save");
	toggleScheduleDateTimeFields();
	$("#studentProfileSettingTable tbody tr").removeClass("bg-warning");
}

function saveStudentProfileSetting() {
	var learningPrograms = $("#learningProgramIds").val() || [];
	var grades = $("#gradeIds").val() || [];
	var profileFieldValues = $("#profileFieldId").val() || [];
	var scheduleType = $("#scheduleType").val();
	var scheduleDate = $("#scheduleDate").val();
	var scheduleTime = $("#scheduleTime").val();
	var mandatoryOption = $("#mandatoryOption").val();
	if (learningPrograms === null || learningPrograms === undefined || learningPrograms.length < 1) {
		showMessageTheme2(0, "Please select learning program.");
		return false;
	}
	if (grades === null || grades === undefined || grades.length < 1) {
		showMessageTheme2(0, "Please select learning grade.");
		return false;
	}
	if (profileFieldValues.length === 0) {
		showMessageTheme2(0, "Please select profile field.");
		return false;
	}
	if (scheduleType === null || scheduleType === undefined || scheduleType === "") {
		showMessageTheme2(0, "Please select schedule type.");
		return false;
	}
	if (scheduleType === "SCHEDULE_LATER") {
		if (!scheduleDate) {
			showMessageTheme2(0, "Please select schedule date.");
			return false;
		}
		if (!scheduleTime) {
			showMessageTheme2(0, "Please enter schedule time.");
			return false;
		}
		if (!isValidTimeAmPm(scheduleTime)) {
			showMessageTheme2(0, "Please enter time in hh:mm AM/PM format.");
			return false;
		}
		
	}
	if (mandatoryOption === "" || mandatoryOption === null) {
		showMessageTheme2(0, "Please select mandatory option.");
		return false;
	}
	if($("#saveStudentProfileSetting").text() != "Update"){
		var validation = validateDuplicateAndConfirm();
		if (!validation) {
			return false;
		}
	}
	saveProfileSetting();
}

function saveProfileSetting(){
	var pg=[];
	var lg=[];
	var learningPrograms = $("#learningProgramIds").val() || [];
	if(learningPrograms.includes("ALL")){
		$("#learningProgramIds option").each(function(){
    		if($(this).val() != "ALL"){
				pg.push($(this).val())
			}
		});
		learningPrograms=pg;
	}
	var grades = $("#gradeIds").val() || [];
	if(grades.includes("ALL")){
		$("#gradeIds option").each(function(){
    		if($(this).val() != "ALL"){
				lg.push($(this).val())
			}
		});
		grades = lg;
	}
	
	var scheduleType = $("#scheduleType").val();
	var scheduleDate = $("#scheduleDate").val();
	var scheduleTime = $("#scheduleTime").val();
	var scheduleDateTime = `${scheduleDate} ${scheduleTime}`;
	var scheduleDateUTC = "";
	var mandatoryOption = $("#mandatoryOption").val();
	var recordId = $("#profileSettingId").val();
	if(scheduleType == "SCHEDULE_LATER"){
		scheduleDateUTC = convertLocalToUTCWithRequiredFormat(scheduleDateTime,DISPLAY_DATE_AND_TIME,USER_TIMEZONE,DATETIME_UTC_FORMATTER);
	}
	var payload = {
		id: parseInt(recordId || "0", 10),
		learningProgramIds: JSON.stringify(learningPrograms),
		gradeIds: JSON.stringify(grades),
		profileFieldId: JSON.stringify(getSelectedOptionTexts("#profileFieldId")),
		scheduleType: scheduleType,
		scheduleDateTime: scheduleDateUTC,
		mandatoryOption: mandatoryOption,
		forceSave: false
	};

	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "student-profile-setting/save/" + UNIQUEUUID),
		data: JSON.stringify(payload),
		dataType: "json",
		cache: false,
		timeout: 600000,
		success: function (response) {
			if (response && (response.status === "0" || response.status === "2")) {
				showMessageTheme2(0, response.message || "Unable to save profile setting.");
				return;
			}
			showMessageTheme2(1, response.message || "Profile setting saved.");
			resetStudentProfileSettingForm();
			loadStudentProfileSettingList();
			// if (response && response.warning) {
			// 	openStudentProfileSettingConfirmationModal(
			// 		response.message || "We already have a record with the same learning program, grade, and profile field. Proceeding will overwrite the earlier one. Do you want to continue?",
			// 		function () {
			// 			payload.forceSave = true;
			// 			submitStudentProfileSettingPayload(payload);
			// 		}
			// 	);
			// 	return;
			// }
			//handleStudentProfileSettingSaveResponse(response);
			$("#studentProfileSettingConfirmationModal").modal("hide");
		},
		error: function () {
			showMessageTheme2(0, "Unable to save profile setting.");
		}
	});
}

function submitStudentProfileSettingPayload(payload) {
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "student-profile-setting/save/" + UNIQUEUUID),
		data: JSON.stringify(payload),
		dataType: "json",
		cache: false,
		timeout: 600000,
		success: function (response) {
			handleStudentProfileSettingSaveResponse(response);
		},
		error: function () {
			showMessageTheme2(0, "Unable to save profile setting.");
		}
	});
}

function handleStudentProfileSettingSaveResponse(response) {
	if (response && (response.status === "0" || response.status === "2")) {
		showMessageTheme2(0, response.message || "Unable to save profile setting.");
		return;
	}
	showMessageTheme2(1, response.message || "Profile setting saved.");
	resetStudentProfileSettingForm();
	loadStudentProfileSettingList();
}

function validateDuplicateAndConfirm() {

	var table = $("#studentProfileSettingTable").DataTable();

	var learningPrograms = $("#learningProgramIds option:selected").map(function () {
		return $(this).text().trim();
	}).get();

	var grades = $("#gradeIds option:selected").map(function () {
		return $(this).text().trim();
	}).get();

	var profileFields = $("#profileFieldId option:selected").map(function () {
		return $(this).text().trim();
	}).get();

	var isDuplicate = false;
	var duplicateFields = [];
	var matchedRowIndex = -1;

	// 🔥 detect ALL case
	var isAllProgram = learningPrograms.includes("All Program");
	var isAllGrade = grades.includes("All Grade");

	// 🔥 remove old highlight
	$("#studentProfileSettingTable tbody tr").removeClass("bg-danger");

	// 🔥 helper
	function getText(val) {
		if (!val) return "";
		if (typeof val === "string") {
			return $("<div>").html(val).text().trim();
		}
		return val.toString().trim();
	}

	// 🔥 BREAKABLE LOOP
	var indexes = table.rows().indexes().toArray();

	indexes.some(function (rowIdx) {

		var data = table.row(rowIdx).data();

		var rowLPs = getText(data[1]).split(",").map(e => e.trim());
		var rowGrades = getText(data[2]).split(",").map(e => e.trim());
		var rowFields = getText(data[3]).split(",").map(e => e.trim());

		// 🔥 match logic with ALL case
		var lpMatch = isAllProgram || learningPrograms.some(lp => rowLPs.includes(lp));
		var gradeMatch = isAllGrade || grades.some(g => rowGrades.includes(g));

		if (!lpMatch || !gradeMatch) return false;

		var matched = profileFields.filter(f => rowFields.includes(f));
		if (matched.length === 0) return false;

		// ✅ DUPLICATE FOUND → STOP LOOP
		isDuplicate = true;
		duplicateFields = matched;
		matchedRowIndex = rowIdx;

		return true; // 🔥 break loop
	});

	// 🔥 FINAL ACTION
	if (isDuplicate && matchedRowIndex !== -1) {

		var pageLength = table.page.len();
		var pageIndex = Math.floor(matchedRowIndex / pageLength);

		// go to correct page
		table.page(pageIndex).draw(false);

		// highlight after draw
		setTimeout(function () {

			var rowNode = table.row(matchedRowIndex).node();

			if (rowNode) {
				$(rowNode).addClass("bg-danger");

				$('html, body').animate({
					scrollTop: $(rowNode).offset().top - 200
				}, 500);
			}

		}, 300);

		// dynamic message
		var msg = (isAllProgram || isAllGrade)
			? `Duplicate found for: ${duplicateFields.join(", ")} across All Programs/Grades. Continue?`
			: `Duplicate found for: ${duplicateFields.join(", ")}. Do you want to continue?`;

		$("#profileSettingOverwriteConfirmationMessage").text(msg);
		$("#profileSettingOverwriteConfirmationModal").modal("show");

		return false;
	}

	return true;
}



function loadStudentProfileSettingList() {
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "student-profile-setting/list/" + UNIQUEUUID),
		data: "{}",
		dataType: "json",
		cache: false,
		timeout: 600000,
		success: function (response) {
			if (response && (response.status === "0" || response.status === "2")) {
				showMessageTheme2(0, response.message || "Unable to load profile settings.");
				return;
			}
			renderStudentProfileSettingTable(response.data || []);
		},
		error: function () {
			showMessageTheme2(0, "Unable to load profile settings.");
		}
	});
}

function renderStudentProfileSettingTable(dataList) {
	STUDENT_PROFILE_SETTING_MAP = {};
	var rowsHtml = "";
	if (dataList && dataList.length > 0) {
		$.each(dataList, function (index, item) {
			STUDENT_PROFILE_SETTING_MAP[item.id] = item;
			var learningProgramText = mapMultiSelectLabels("learningProgramIds", item.learningProgramIds);
			var gradeText = mapMultiSelectLabels("gradeIds", item.gradeIds);
			var profileFieldText = mapProfileFieldDisplay(item.profileFieldId);
			var scheduleDateTimeText = moment.utc(item.scheduleDateTime,"MMM DD, YYYY hh:mm A").format(DATE_UTC+'T'+TIME_UTC+"[Z]");
			scheduleDateTimeText = convertDatetimeWithFormat(scheduleDateTimeText, "UTC", USER_TIMEZONE, DISPLAY_DATE_AND_TIME)
			var scheduleTypeText = formatScheduleType(item.scheduleType,scheduleDateTimeText );
			var mandatoryText = formatMandatoryOption(item.mandatoryOption);
			var statusText = item.active === "Y" ? "Active" : "Inactive";

			rowsHtml += "<tr>"
				+ "<td>" + (index + 1) + "</td>"
				+ "<td class='text-wrap'>" + learningProgramText + "</td>"
				+ "<td class='text-wrap'>" + gradeText + "</td>"
				+ "<td class='text-wrap'>" + profileFieldText + "</td>"
				+ "<td>" + scheduleTypeText + "</td>"
				+ "<td>" + scheduleDateTimeText + "</td>"
				+ "<td class='text-center'>" + (mandatoryText == "Y"? 'Yes':'No' ) + "</td>"
				+ "<td>" + statusText + "</td>"
				+ "<td>" + getStudentProfileSettingAction(item.id, item.active) + "</td>"
				+ "</tr>";
		});
	}
	
	if ($.fn.DataTable && $.fn.DataTable.isDataTable("#studentProfileSettingTable")) {
		$("#studentProfileSettingTable").DataTable().destroy();
	}
	$("#studentProfileSettingTable tbody").html(rowsHtml);
	$("#studentProfileSettingTable").DataTable({
		// scrollX: true,
		pageLength: 10,
		responsive:true,
		language: {
			emptyTable: "No data available"
		}
	});
}

function getStudentProfileSettingAction(id, active) {
	var inactiveLabel = active === "Y" ? "Inactive" : "Inactive";
	var inactiveDisabled = active === "Y" ? "" : " disabled";
	return '<div class="btn-group">'
		+ '<button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
		+ '<i class="fa fa-ellipsis-v"></i>'
		+ '</button>'
		+ '<div class="dropdown-menu">'
		+ '<a href="javascript:void(0);" class="dropdown-item" onclick="editStudentProfileSetting(' + id + ')"><i class="fa fa-edit"></i>&nbsp;Edit</a>'
		+ '<a href="javascript:void(0);" class="dropdown-item' + inactiveDisabled + '" onclick="inactiveStudentProfileSetting(' + id + ')"><i class="fa fa-times"></i>&nbsp;' + inactiveLabel + '</a>'
		+ '</div>'
		+ '</div>';
}

function editStudentProfileSetting(id) {
	var item = STUDENT_PROFILE_SETTING_MAP[id];
	if (!item) {
		return;
	}
	$("#profileSettingId").val(id);
	$("#learningProgramIds").val(parseStoredValues(item.learningProgramIds)).trigger("change");
	$("#gradeIds").val(parseStoredValues(item.gradeIds)).trigger("change");
	var storedProfileFields = parseStoredValues(item.profileFieldId);
	var mappedProfileFields = mapSelectTextsToValues("profileFieldId", storedProfileFields);
	if (mappedProfileFields.length === 0 && storedProfileFields.length > 0) {
		mappedProfileFields = storedProfileFields;
	}
	$("#profileFieldId").val(mappedProfileFields).trigger("change");
	$("#scheduleType").val(item.scheduleType).trigger("change");
	var scheduleDateTimeText = moment.utc(item.scheduleDateTime,"MMM DD, YYYY hh:mm A").format(DATE_UTC+'T'+TIME_UTC+"[Z]");
	scheduleDateTimeText = convertDatetimeWithFormat(scheduleDateTimeText, "UTC", USER_TIMEZONE, DISPLAY_DATE_AND_TIME)
	$("#scheduleDate").datepicker("update", new Date(scheduleDateTimeText));
	var scheduleParts = parseScheduleDateTime(scheduleDateTimeText);
	$("#scheduleTime").val(scheduleParts.time).trigger("change");
	$("#mandatoryOption").val(item.mandatoryOption).trigger("change");
	$("#saveStudentProfileSetting").text("Update");
}

function inactiveStudentProfileSetting(id) {
	var item = STUDENT_PROFILE_SETTING_MAP[id];
	if (!item || item.active !== "Y") {
		return;
	}
	openStudentProfileSettingConfirmationModal(
		"Are you sure you want to inactive this record?",
		function () {
			updateStudentProfileSettingStatus(id, "N");
		}
	);
}

function updateStudentProfileSettingStatus(id, active) {
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", "student-profile-setting/status/" + UNIQUEUUID),
		data: JSON.stringify({ id: id, active: active }),
		dataType: "json",
		cache: false,
		timeout: 600000,
		success: function (response) {
			if (response && (response.status === "0" || response.status === "2")) {
				showMessageTheme2(0, response.message || "Unable to update status.");
				return;
			}
			showMessageTheme2(1, response.message || "Status updated.");
			loadStudentProfileSettingList();
		},
		error: function () {
			showMessageTheme2(0, "Unable to update status.");
		}
	});
}

function openStudentProfileSettingConfirmationModal(message, onConfirm) {
	STUDENT_PROFILE_SETTING_PENDING_ACTION = typeof onConfirm === "function" ? onConfirm : null;
	$("#studentProfileSettingConfirmationMessage").text(message || "Are you sure you want to continue?");
	$("#studentProfileSettingConfirmationModal").modal("show");
}

function confirmStudentProfileSettingAction() {
	$("#studentProfileSettingConfirmationModal").modal("hide");
	if (typeof STUDENT_PROFILE_SETTING_PENDING_ACTION === "function") {
		var pendingAction = STUDENT_PROFILE_SETTING_PENDING_ACTION;
		STUDENT_PROFILE_SETTING_PENDING_ACTION = null;
		pendingAction();
	}
}

function clearStudentProfileSettingConfirmationModal() {
	STUDENT_PROFILE_SETTING_PENDING_ACTION = null;
	$("#studentProfileSettingConfirmationMessage").text("");
}

function mapMultiSelectLabels(selectId, storedValues) {
	var values = parseStoredValues(storedValues);
	if (values.length === 0) {
		return "N/A";
	}
	var labels = [];
	$.each(values, function (_, value) {
		var label = $("#" + selectId + " option[value='" + value + "']").text();
		labels.push(label ? label : value);
	});
	return labels.join(", ");
}

function parseStoredValues(value) {
	if (!value) {
		return [];
	}
	if (Array.isArray(value)) {
		return value;
	}
	if (typeof value === "string") {
		var trimmed = value.trim();
		if (trimmed.startsWith("[")) {
			try {
				var parsed = JSON.parse(trimmed);
				return Array.isArray(parsed) ? parsed : [];
			} catch (e) {
				// fallback to csv
			}
		}
		return trimmed.split(",").map(function (item) {
			return item.trim();
		}).filter(function (item) {
			return item !== "";
		});
	}
	return [];
}

function mapStoredTextArray(value) {
	var values = parseStoredValues(value);
	if (values.length === 0) {
		return "N/A";
	}
	return values.join(", ");
}

function mapProfileFieldDisplay(value) {
	var values = parseStoredValues(value);
	if (values.length === 0) {
		return "N/A";
	}
	var labels = [];
	var mappedCount = 0;
	$.each(values, function (_, item) {
		var label = $("#profileFieldId option[value='" + item + "']").text();
		if (label) {
			labels.push(label);
			mappedCount += 1;
		} else {
			labels.push(item);
		}
	});
	if (mappedCount === values.length) {
		return labels.join(", ");
	}
	return values.join(", ");
}

function toggleScheduleDateTimeFields() {
	var scheduleType = $("#scheduleType").val();
	if (scheduleType === "SCHEDULE_LATER") {
		$(".schedule-date-time-wrapper").show();
	} else {
		$(".schedule-date-time-wrapper").hide();
		$("#scheduleDate").datepicker("update", "");
		$("#scheduleTime").val("").trigger("change");
	}
}

function isValidTimeAmPm(value) {
	return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i.test(value || "");
}

// function parseScheduleDateTime(value) {
// 	if (!value) {
// 		return { date: "", time: "" };
// 	}
// 	var parts = value.split(" ");
// 	if (parts.length < 2) {
// 		return { date: "", time: "" };
// 	}
// 	var datePart = parts[0];
// 	var timePart = parts[1];
// 	var datePieces = datePart.split("-");
// 	if (datePieces.length !== 3) {
// 		return { date: "", time: "" };
// 	}
// 	var year = parseInt(datePieces[0], 10);
// 	var month = parseInt(datePieces[1], 10) - 1;
// 	var day = parseInt(datePieces[2], 10);
// 	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// 	var displayDate = monthNames[month] + " " + String(day).padStart(2, "0") + ", " + year;

// 	var timePieces = timePart.split(":");
// 	if (timePieces.length !== 2) {
// 		return { date: displayDate, time: "" };
// 	}
// 	var hours = parseInt(timePieces[0], 10);
// 	var minutes = timePieces[1];
// 	var ampm = hours >= 12 ? "PM" : "AM";
// 	var displayHours = hours % 12;
// 	if (displayHours === 0) {
// 		displayHours = 12;
// 	}
// 	var displayTime = String(displayHours).padStart(2, "0") + ":" + minutes + " " + ampm;
// 	return { date: displayDate, time: displayTime };
// }
function parseScheduleDateTime(value) {
	if (!value) return { date: "", time: "" };

	var dateObj = new Date(value);

	if (isNaN(dateObj)) return { date: "", time: "" };

	// Date format: Apr 16, 2026
	var date = dateObj.toLocaleDateString("en-US", {
		month: "short",
		day: "2-digit",
		year: "numeric"
	});

	// Time format: 7:30 AM (NO leading zero)
	var hours = dateObj.getHours();
	var minutes = String(dateObj.getMinutes()).padStart(2, "0");

	var ampm = hours >= 12 ? "PM" : "AM";
	var displayHours = hours % 12;
	if (displayHours === 0) displayHours = 12;

	var time = displayHours + ":" + minutes + " " + ampm;

	return { date, time };
}

// function formatScheduleDateTime(value) {

// 	var parts = parseScheduleDateTime(value);
// 	if (!parts.date || !parts.time) {
// 		return value || "N/A";
// 	}
// 	return parts.date + " " + parts.time;
// }

function getSelectedOptionTexts(selectId) {
	var texts = [];
	$(selectId + " option:selected").each(function () {
		var text = $(this).text();
		if (text) {
			texts.push(text);
		}
	});
	return texts;
}

function mapSelectTextsToValues(selectId, texts) {
	if (!texts || texts.length === 0) {
		return [];
	}
	var values = [];
	$("#" + selectId + " option").each(function () {
		var optionText = $(this).text();
		var optionValue = $(this).val();
		if (texts.indexOf(optionText) !== -1 || texts.indexOf(optionValue) !== -1) {
			values.push(optionValue);
		}
	});
	return values;
}

function formatScheduleType(value, dateTime) {
	if (value === "NOW") {
		return "Now";
	}
	if (value === "SCHEDULE_LATER") {
		return "Scheduled from "+dateTime;
	}
	return value || "N/A";
}

function formatMandatoryOption(value) {
	if (value === "MANDATORY") {
		return "Mandatory";
	}
	if (value === "NON_MANDATORY") {
		return "Non Mandatory";
	}
	return value || "N/A";
}

function profileSetting() {
	// var urlSend = getURLForHTML("dashboard", "student-profile-setting/" + UNIQUEUUID + "?moduleId=" + moduleId);
	// window.open(urlSend, "_blank");
	$("#requestForProfileDataModal").modal("show");
	$('#requestForProfileDataModal').on('shown.bs.modal', function () {
		if ($.fn.DataTable && $.fn.DataTable.isDataTable("#studentProfileSettingTable")) {
            $("#studentProfileSettingTable").DataTable().destroy();
        }

         $("#studentProfileSettingTable").DataTable({
			// scrollX: true,
			pageLength: 10,
			responsive:true,
			language: {
				emptyTable: "No data available"
			}
		});
    });

}

// Dynamic Add Profile Fields code start here//


// DYNAMIC REUSEABLE FIELDS START HERE //
function renderDynamicField(fieldConfig, value = "") {

    const {
        fieldId,
        label,
        fieldType,
        inputType,
        options
    } = fieldConfig;

    const oldValue = value || '';

    let html = '';

    // ================= INPUT TEXT =================
    if (fieldType === 'input' && inputType === 'text') {
        html = `
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <input type="text" id="${fieldId}" class="form-control form-control-sm group-append-hide-input" placeholder=" " value="${typeof escapeHtml === 'function' ? escapeHtml(oldValue) : oldValue}">
            <label for="${fieldId}">${label}</label>
		</div>`;
    }

    // ================= DATEPICKER =================
    else if (fieldType === 'input' && inputType === 'date') {
        html = `
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <input type="text" id="${fieldId}" class="form-control form-control-sm group-append-hide-input" placeholder=" " value="${typeof escapeHtml === 'function' ? escapeHtml(oldValue) : oldValue}" readonly />
            <label for="${fieldId}">${label}</label>
		</div>`;
    }

    // ================= FILE =================
    else if (fieldType === 'input' && inputType === 'file') {

		const hasFile = value && value !== "";
		const fileName = fieldConfig.fileName || '';
		const attachmentType = fieldConfig.attachmentType || 'I';

		html = `
		<div class="full mb-2">
			<span class="font-weight-semi-bold text-primary">${label}:</span>
			<div class="d-flex">
				<!-- VIEW MODE -->
				<div class="w-100" id="${fieldId}ViewBtn" style="${hasFile ? '' : 'display:none'}">
					<div class="d-flex w-100 align-items-center">
						<div class="d-inline-flex align-items-center border btn-dashed border-primary px-2 py-1 rounded flex-grow-1 mr-1 overflow-hidden">
							<span class="bg-light-primary rounded-circle mr-2 d-inline-flex align-items-center justify-content-center" style="width:20px;height:20px;">
								<i class="fa fa-file text-primary"></i>    
							</span>
							<span class="bar_count" id="${fieldId}FileName">
								${fileName}
							</span>    
						</div>
						<div class="d-inline-flex">
							<!-- VIEW -->
							<a href="javascript:void(0)" class="btn btn-success btn-sm mr-1 view-btn" onclick="viewAttachmentProfile(this, 'uploadFile','${attachmentType}','${fieldId}div')">
								<img id="${fieldId}imgIcon"
									class="full crop-uplod-img d-none"
									src="${hasFile ? value : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}"
									thumbtype="${attachmentType === 'I' ? 'img' : 'pdf'}">
								<i class="fa fa-eye"></i>    
							</a>  
						</div>   
					</div>
				</div>
				<!-- UPLOAD -->
				<div class="upload-btn-wrapper"
					id="${fieldId}div"
					data-pdfurl="${hasFile ? value : PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION}"
					style="${hasFile ? 'display:none' : ''}">
					<input type="file"
						class="file-input group-append-hide-input"
						id="${fieldId}"
						onchange="cropImage(event,'${fieldId}','${fieldId}imgIcon','${label}','','',true)">
					<span class="upload-btn d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded justify-content-center">
						<i class="fa fa-upload"></i>&nbsp;Upload
					</span>
				</div>

			</div>
		</div>`;
	}

    // ================= DROPDOWN =================
    else if (fieldType === 'dropdown') {
        let optionsHtml = `<option value="">Select</option>`;
        $.each(options, function(i, opt) {
            const selected = opt == oldValue ? 'selected' : '';
            optionsHtml += `<option value="${opt}" ${selected}>${opt}</option>`;
        });
        html = `
        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
            <select id="${fieldId}"
                class="form-control form-control-sm group-append-hide-input"
                onchange="controlEditField(this,'${fieldId}','${oldValue}','select')">
                ${optionsHtml}
            </select>
            <label for="${fieldId}">${label}</label>
        </div>`;
    }

    // ================= CHECKBOX =================
    else if (fieldType === 'checkbox') {
        let optionsHtml = '';
        $.each(options, function(i, opt) {
            const id = `${fieldId}_${i}`;
            const checked = Array.isArray(oldValue) && oldValue.includes(opt) ? 'checked' : '';
            optionsHtml += `
            <div class="custom-control custom-checkbox mr-3 mb-2">
                <input type="checkbox"
                    id="${id}"
                    class="custom-control-input group-append-hide-input"
                    ${checked}/>

                <label class="custom-control-label" for="${id}">${opt}</label>
            </div>`;
        });
        html = `
        <div>
            <span class="font-weight-semi-bold">${label}:</span>
            <div class="d-flex flex-wrap">${optionsHtml}</div>
        </div>`;
    }

    // ================= RADIO =================
    else if (fieldType === 'radio') {
		var optionsHtml = '';
        $.each(options, function(i, opt) {
            const id = `${fieldId}_${i}`;
            const checked = opt == oldValue ? 'checked' : '';
            optionsHtml += `
            <div class="custom-control custom-radio mr-3 mb-2">
                <input type="radio"
                    name="${fieldId}"
                    id="${id}"
                    class="custom-control-input group-append-hide-input"
                    ${checked} >
                <label class="custom-control-label" for="${id}">${opt}</label>
            </div>`;
        });
        html = `
        <div>
            <span class="font-weight-semi-bold">${label}:</span>
            <div class="d-flex flex-wrap">${optionsHtml}</div>
		</div>`;
    }

    return html;
} 
// DYNAMIC REUSEABLE FIELDS END HERE // 

// ===============================
// OPEN MODAL
// ===============================
async function openDynamicBuilder() {
    if (!$('#dynamicFieldModal').length) {
        $('body').append(dynamicProfileFieldBuilder());
    }
    
	$('#dynamicFieldModal').modal('show');
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#dynamicFieldModal'));
	}
	if ($("#cropModal").length < 1) {
		$("body").append(cropperImageModalContent()+viewUploadFileModal());
		setTimeout(function () {
			$("head").append(`<script src="${PATH_FOLDER_JS2}${RESOURCES_FROM_MIN_LOCATION}custom/cropperImage.js?v=1.1.26">`)
		}, 1000);
	}
	$(document).off('shown.bs.tab', 'a[data-toggle="tab"]').on('shown.bs.tab', 'a[data-toggle="tab"]', async function (e) {
		var target = $(e.target).attr("href"); // active tab ka id
		if (target === "#viewAddProfileFields" && CALL_CUSTOM_PROFILE_FIELD_FLAG) {
			await getCustomProfileFieldsRecords();
			CALL_CUSTOM_PROFILE_FIELD_FLAG=false;
		}
		// ✅ IMPORTANT: tab visible hone ke baad adjust
        var table = $('#customProfileFieldsTable').DataTable();
        table.columns.adjust();

	});
}

async function getCustomProfileFieldsRecords() {

    var payload = {
        userId: USER_ID
    };

    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + `/dashboard/custom-profile-fields/list/${UNIQUEUUID}`,
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var responseData = await callCommonAjax(ajaxReqDetails);

    // ✅ destroy first
    if ($.fn.DataTable.isDataTable('#customProfileFieldsTable')) {
        $('#customProfileFieldsTable').DataTable().clear().destroy();
    }

    var rows = ``;

    $.each(responseData.data, function (index, item) {
		CUSTOM_FIELD_MAP[item.id] = item;
        rows += `
        <tr id="row_${item.id}">
            <td>${item.parentFieldName}</td>
            <td class="text-capitalize">${item.inputType == ""? item.fieldType:item.inputType}</td>
            <td>${item.labelName}</td>
            <td>${item.createdBy}</td>
            <td>${item.createdAt}</td>
            <td>
                <div class="btn-group">
                    <button type="button" class="btn btn-primary dropdown-toggle btn-sm"
                        data-toggle="dropdown">
                        <i class="fa fa-ellipsis-v"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="javaScript:void(0);" class="dropdown-item" onclick="showWarningMessageShow(
                            \'Are you sure you want to remove this field?\',
                            \'reoveCustomProfileFields(\\\'row_${item.id}\\\', \\\'${item.id}\\\')\'
                        )">
                            <i class="fa fa-trash"></i>&nbsp;Remove
                        </a>
						${/*<a href="javaScript:void(0);"
                           onclick="editFieldFromTable('${item.id}')"
                           class="dropdown-item">
                            <i class="fa fa-pencil"></i> Edit
                        </a>*/''}
                    </div>
                </div>
            </td>
        </tr>`;

    });

    $("#customProfileFieldsTable tbody").html(rows);

    // ✅ reinitialize immediately (no timeout needed)
    $('#customProfileFieldsTable').DataTable({
        scrollX: true,
		autoWidth: false,
		destroy: true,   // safety
		order: [],
		columnDefs: [
			{ orderable: false, targets: -1 } // action column disable sorting
		]
    });

    console.log("custom fields records", responseData);
}

async function reoveCustomProfileFields(rowID, customFieldID) {

    var payload = {
        userId: USER_ID,
		customProfileFieldId:customFieldID
    };

    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + `/dashboard/custom-profile-fields/inactivate/${UNIQUEUUID}`,
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var responseData = await callCommonAjax(ajaxReqDetails);
	showMessageTheme2(1, responseData.message);
	$("#"+rowID).remove();
	if($('#customProfileFieldsTable tbody tr').length<1){
		$('#customProfileFieldsTable tbody').html(`<tr><td colspan="4" class="text-center">No data available in table</td></tr>`);
	}
	var table = $('#customProfileFieldsTable').DataTable();
	table.columns.adjust();
    
}

// ===============================
// MODAL HTML
// ===============================
function dynamicProfileFieldBuilder() {
    return `
    <div class="modal fade" id="dynamicFieldModal">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
				<div class="modal-header bg-primary text-white py-2">
                    <h5>Dynamic Profile Builder</h5>
                    <button class="close text-white" data-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body px-0 pt-0">
                    <div class="full custom-field-scope">
						<div class="card-header card-header-tab-animation mb-3" id="multiple-tab-table tab-multiple-table">
							<ul class="nav">
								<li class="nav-item"><a role="tab" data-toggle="tab" href="#addProfileFields" class="active nav-link">Add Field</a></li>
								<li class="nav-item"><a role="tab" data-toggle="tab" href="#viewAddProfileFields" class="nav-link">Added Field</a></li>
							</ul>
						</div>
						<div class="tab-content">
							<div class="tab-pane active" id="addProfileFields" role="tabpanel">
								<div class="col-12">
									<div class="row">
										<!-- LEFT -->
										<div class="col-xl-7 col-lg-7 col-md-6 col-sm-12 col-12 border-right">
											<div class="row">
												<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
													<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
														<select id="profileSection" class="form-control">
															<option value="">Select Profile Section</option>
															<option value="1">Personal Information</option>
															<option value="21">Parent/Guardian Information</option>
															<option value="44">Academic Information</option>
															<option value="60">Sport & Extra Curriculars</option>
														</select>
														<label for="profileSection">Select Profile Section</label>
													</div>
												</div>
												<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
													<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
														<select id="fieldType" class="form-control mb-2" onchange="handleFieldTypeChange()">
															<option value="">Select Field Type</option>
															<option value="input_text">Text</option>
															<option value="input_date">Date</option>
															<option value="input_file">File</option>
															<option value="dropdown">Dropdown</option>
															${/*
																<option value="checkbox">Checkbox</option>
																<option value="radio">Radio</option>	
															*/''}
														</select>
														<label for="fieldType">Select Field Type</label>
													</div>
												</div>
												<div class="col-12">
													<div class="input-group position-relative custom-field mb-2 mt-3 p-0">
														<input id="fieldLabel" class="form-control mb-2 d-none" placeholder=" ">
														<label for="fieldLabel">Enter Label Name</label>
													</div>
												</div>
												
											</div>
											<div id="optionsWrapper" class="d-none">
												<input id="optionInput" class="form-control mb-2" placeholder="Option">
												<button class="btn btn-sm btn-primary mb-2" onclick="addFieldOption()">Add</button>
												<ul id="optionsList"></ul>
											</div>
											<div class="row">
												<div class="col-12">
													<div class="alert alert-warning fade show" role="alert">Before adding any new field to the student profile, please ensure that a similar field does not already exist. Creating duplicate fields may lead to data inconsistency and system inefficiencies. It is recommended to review existing fields carefully prior to adding new ones.</div>
												</div>
											</div>
											<button class="btn btn-primary mt-2" onclick="fieldPreview()">Add & Preview</button>
										</div>
										<!-- RIGHT -->
										<div class="col-xl-5 col-lg-5 col-md-6 col-sm-12 col-12">
											<div id="previewContainer" class="custom-field-scope"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="viewAddProfileFields" role="tabpanel">
								<div class="col-12">
									<div class="table-responsive">
										<table id="customProfileFieldsTable" class="table table-bordered border-radius-table font-12 nowrap" style="min-width:750px;width:100% !important;">
											<thead class="bg-primary text-white">
												<tr>
													<th>Profile Section</th>
													<th>Field Type</th>
													<th>Field Label</th>
													<th>Created by</th>
													<th>Created at</th>
													<th>Action</th>
												</tr>
											</thead>
											<tbody></tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// ===============================
// HANDLE TYPE
// ===============================
function handleFieldTypeChange() {
    let type = $('#fieldType').val();

    $('#fieldLabel').removeClass('d-none');

    if (['dropdown','checkbox','radio'].includes(type)) {
        $('#optionsWrapper').removeClass('d-none');
    } else {
        $('#optionsWrapper').addClass('d-none');
        fieldOptions = [];
        $('#optionsList').empty();
    }
}

// ===============================
// OPTIONS
// ===============================


function addMoreProfileFields() {
    if (!$('#dynamicFieldModal').length) {
        $('body').append(dynamicProfileFieldBuilder());
    }
    $('#dynamicFieldModal').modal("show");
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#dynamicFieldModal'));
	}
}


// ===============================
// OPTIONS
// ===============================
// function addFieldOption() {

//     var option = $('#optionInput').val().trim();
//     if (!option) return;

//     var hasSpecialCharacter = /[^a-zA-Z0-9 ]/.test(option);
//     if (hasSpecialCharacter) {
//         showMessageTheme2(0, "Special characters are not allowed in option.");
//         return;
//     }

//     var normalizedOption = option.toLowerCase();
//     var isDuplicateOption = fieldOptions.some(function(existingOption) {
//         return (existingOption || '').trim().toLowerCase() === normalizedOption;
//     });

//     if (isDuplicateOption) {
//         showMessageTheme2(0, "Duplicate option is not allowed.");
//         return;
//     }

//     fieldOptions.push(option);
//     $('#optionInput').val('');
//     renderOptions();
// }
function addFieldOption() {

    var option = $('#optionInput').val().trim();
    if (!option) return;

    var hasSpecialCharacter = /[^a-zA-Z0-9 +\-]/.test(option);
    if (hasSpecialCharacter) {
        showMessageTheme2(0, "Special characters are not allowed in option.");
        return;
    }

    var normalizedOption = option.toLowerCase();
    var isDuplicateOption = fieldOptions.some(function(existingOption) {
        return (existingOption || '').trim().toLowerCase() === normalizedOption;
    });

    if (isDuplicateOption) {
        showMessageTheme2(0, "Duplicate option is not allowed.");
        return;
    }

    fieldOptions.push(option);
    $('#optionInput').val('');
    renderOptions();
}

function renderOptions() {

    var html = '';

    $.each(fieldOptions, function(index, value) {
        html += `
        <li class="list-group-item d-flex justify-content-between">
            ${value}
            <button class="btn btn-sm btn-danger" onclick="removeFieldOption(${index})">X</button>
        </li>`;
    });

    $('#optionsList').html(html);
}

function removeFieldOption(index) {
    fieldOptions.splice(index, 1);
    renderOptions();
}


// ===============================
// SAVE / UPDATE FIELD
// ===============================


function fieldPreview() {

    var section = $('#profileSection option:selected').text();
    var sectionID = $('#profileSection').val();
    var type = $('#fieldType').val();
    var label = $('#fieldLabel').val().trim();

    // ✅ VALIDATION
    if (sectionID == "") {
        showMessageTheme2(0, "Section is required.");
        return;
    } else if (!type) {
        showMessageTheme2(0, "Field type is required.");
        return;
    } else if (!label) {
        showMessageTheme2(0, "Label is required.");
        return;
    }
    if (["dropdown", "checkbox", "radio"].includes(type) && fieldOptions.length < 2) {
        showMessageTheme2(0, "Please add at least 2 options.");
        return;
    }

    // ✅ INIT SECTION ARRAY
    if (!DYNAMIC_FIELDS_LIST[section]) {
        DYNAMIC_FIELDS_LIST[section] = [];
    }

    // ✅ DUPLICATE LABEL CHECK (case-insensitive)
    // let isDuplicate = DYNAMIC_FIELDS_LIST[section].some((f, i) =>
    //     f.label.toLowerCase() === label.toLowerCase() &&
    //     !(EDIT_INDEX.section === section && EDIT_INDEX.index === i)
    // );

	// var isDuplicate = Object.keys(DYNAMIC_FIELDS_LIST).some(sec =>
    // 	DYNAMIC_FIELDS_LIST[sec].some((f, i) =>
	// 			f.label.toLowerCase() === label.toLowerCase() 
	// 			&&
	// 			!(EDIT_INDEX.section === sec && EDIT_INDEX.index === i)
	// 		)
	// 	);
	var isDuplicate = checkDuplicate(label, section, EDIT_INDEX);

    if (isDuplicate) {
        showMessageTheme2(0, "Field label already exists in this section!");
        return;
    }

	var isDuplicateInTable = false;

	isDuplicateInTable = checkDuplicateInTable(label, EDIT_INDEX.id);

	if (isDuplicateInTable) {
		showMessageTheme2(0, "Field label already exists in Added Fields!");
		return;
	}

    // ✅ GENERATE FIELD TYPE
    let fieldType = '';
    let inputType = null;

    if (type === 'input_text') {
        fieldType = 'input';
        inputType = 'text';
    }
    else if (type === 'input_date') {
        fieldType = 'input';
        inputType = 'date';
    }
    else if (type === 'input_file') {
        fieldType = 'input';
        inputType = 'file';
	}
    else {
        fieldType = type;
    }

    // ✅ FIELD ID GENERATION (ONLY WHEN ADD)
    let fieldId;
	var existingEditField = null;

    if (EDIT_INDEX.section !== null && !EDIT_INDEX.isFromTable){
		if (
			DYNAMIC_FIELDS_LIST[EDIT_INDEX.section]
			&& DYNAMIC_FIELDS_LIST[EDIT_INDEX.section][EDIT_INDEX.index]
		) {
			existingEditField = DYNAMIC_FIELDS_LIST[EDIT_INDEX.section][EDIT_INDEX.index];
		}

        // EDIT → same ID rakho (if record still exists)
		if (existingEditField) {
        	fieldId = existingEditField.fieldId;
		}
    } else {
        // ADD → unique ID banao
    }
	
	// ADD mode ya stale edit reference dono case me safe unique ID generate karo
	if (!fieldId) {
		let baseId = label.toLowerCase()
			.replace(/\s+/g, '_')
			.replace(/[^a-z0-9_]/g, '');

		fieldId = baseId;
		let counter = 1;

		while (
			Object.values(DYNAMIC_FIELDS_LIST)
				.flat()
				.some(f => f.fieldId === fieldId)
		) {
			fieldId = baseId + "_" + counter++;
		}
	}

    // ✅ FINAL OBJECT
    let data = {
		// section,
		sectionID,
		fieldId,
		fieldType,
		inputType,
		label,
		
	};

	// ✅ ONLY FOR FILE TYPE
	if (inputType === 'file') {
		data.fileName = "";
		data.attachmentType = 'I';
	}

	// ✅ ONLY FOR DROPDOWN TYPE
	if (fieldType === 'dropdown' || fieldType === 'radio' || fieldType === 'checkbox') {
		data.options = [...fieldOptions];
	}

	// ✅ SAVE / UPDATE
    if (EDIT_INDEX.section !== null && !EDIT_INDEX.isFromTable) {

		var oldSection = EDIT_INDEX.section;
		var oldIndex = EDIT_INDEX.index;
		var targetIndex = null;

		// section same hai to normal replace, warna old section se remove karke new section me add
		if (oldSection === section) {
        	DYNAMIC_FIELDS_LIST[oldSection][oldIndex] = data;
			targetIndex = oldIndex;
		} else {
			DYNAMIC_FIELDS_LIST[oldSection].splice(oldIndex, 1);
			if (DYNAMIC_FIELDS_LIST[oldSection].length === 0) {
				delete DYNAMIC_FIELDS_LIST[oldSection];
			}
			if (!DYNAMIC_FIELDS_LIST[section]) {
				DYNAMIC_FIELDS_LIST[section] = [];
			}
			DYNAMIC_FIELDS_LIST[section].push(data);
			targetIndex = DYNAMIC_FIELDS_LIST[section].length - 1;
		}
		EDIT_INDEX = { section: section, index: targetIndex };
    } else {
        DYNAMIC_FIELDS_LIST[section].push(data);
    }
	renderAllFields();	
	resetBuilder();
}

function checkDuplicate(label, targetSection, editIndex) {
    var isDuplicate = false;
	var fields = DYNAMIC_FIELDS_LIST[targetSection] || [];

    for (var i = 0; i < fields.length; i++) {
        var f = fields[i];

		var isSameEditingRow = editIndex
			&& editIndex.section === targetSection
			&& editIndex.index === i;
		if (isSameEditingRow) {
			continue;
		}

        if (f.label.toLowerCase() === label.toLowerCase()) {
            isDuplicate = true;
            break;
        }
	}

    return isDuplicate;
}
function checkDuplicateInTable(label, currentId){

    var table = $('#customProfileFieldsTable').DataTable();
    var foundIndex = -1;

    // remove old highlight
    

    // ✅ loop through ALL rows (internal)
    table.rows().every(function(rowIdx){
        var data = this.data();

        var existingLabel = $('<div>').html(data[2]).text().trim();

        // ✅ ignore current editing row
        var rowItem = Object.values(CUSTOM_FIELD_MAP)[rowIdx];
        if(rowItem && rowItem.id === currentId){
            return true; // continue
        }

        if(existingLabel.toLowerCase() === label.toLowerCase()){
            foundIndex = rowIdx;
            return false; // break
        }
    });

    if(foundIndex !== -1){

        // ✅ get display order indexes (IMPORTANT FIX)
        var displayIndexes = table
            .rows({ order: 'applied', search: 'applied' })
            .indexes()
            .toArray();

        var displayPosition = displayIndexes.indexOf(foundIndex);

        if(displayPosition === -1){
            return false; // safety
        }

        // ✅ correct page calculation
        var pageLength = table.page.len();
        var pageIndex = Math.floor(displayPosition / pageLength);

        // 👉 go to correct page
        table.page(pageIndex).draw(false);

        setTimeout(function(){

            // ✅ get correct row node AFTER pagination
            var rowNode = table.row(foundIndex).node();

            if(rowNode){
                $(rowNode).addClass("bg-warning");

                // 👉 switch tab
                $('a[href="#viewAddProfileFields"]').tab('show');
				
				setTimeout(function () {
					var table = $('#customProfileFieldsTable').DataTable();
					table.columns.adjust().draw(false);
				}, 300);
                // 👉 scroll to row
                $('html, body').animate({
                    scrollTop: $(rowNode).offset().top - 200
                }, 500);
            }

        }, 300);

        return true;
    }

    return false;
}

function saveField() {
	$.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML("dashboard", "custom-profile-fields/save/" + UNIQUEUUID),
        data: JSON.stringify(DYNAMIC_FIELDS_LIST),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(0, data['message'], '', false);
				// DYNAMIC_FIELDS_LIST={};
                EDIT_INDEX = { section: null, index: null };
                return false;
            }else{
				// ✅ RESET EDIT MODE
    			EDIT_INDEX = { section: null, index: null };
				DYNAMIC_FIELDS_LIST={};
				// ✅ UI UPDATE
				// renderAllFields();
				resetBuilder();
				$("#previewContainer").html('');
				CALL_CUSTOM_PROFILE_FIELD_FLAG=true;
				showMessageTheme2(1, "Field Saved Successfully");
			}
        }
    });
}





// ===============================
// RENDER ALL
// ===============================

function renderAllFields() {
	var html =
		`<div class="d-flex align-items-center justify-content-between">
			<h6>Preview</h6>`;
			// if(!SAVE_FIELDS_BTN_FLAG){
				html+=`<button class="btn btn-success mt-2 ml-auto" onclick="saveField()">Save</button>`;
				// SAVE_FIELDS_BTN_FLAG=true;
			// }
		html+=`</div>`;
	if(Object.keys(DYNAMIC_FIELDS_LIST).length>0){
		Object.keys(DYNAMIC_FIELDS_LIST).forEach(section => {
			html += `<h5 class="mt-3">${section}</h5>`;
			DYNAMIC_FIELDS_LIST[section].forEach((f, i) => {
				html += `
				<div class="border p-2 mb-2">
					${renderDynamicField(f)}
					<div class="d-flex justify-content-between">
						<div>
							<button class="btn btn-sm btn-outline-primary" onclick="editField('${section}','${f.sectionID}', ${i})">Edit</button>
							<button class="btn btn-sm btn-danger" onclick="deleteField('${section}', ${i})">Delete</button>
						</div>
					</div>
				</div>`;

				onclick=""
			});
		});
	}
	$('#previewContainer').html(html);
	// datepicker init
    Object.values(DYNAMIC_FIELDS_LIST).forEach(sectionArr => {
        sectionArr.forEach(f => {
			if (f.inputType === 'date') {
                if (!$('#' + f.fieldId).hasClass('hasDatepicker')) {
                    $('#' + f.fieldId).datepicker({
						autoclose: true,
	   					format : 'M dd, yyyy',
                    });
                }
            }
        });
    });
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#previewContainer'));
	}

}

// ===============================
// DELETE
// ===============================
function deleteField(section, index){
    DYNAMIC_FIELDS_LIST[section].splice(index,1);

    // agar section empty ho gaya to remove kar do
    if (DYNAMIC_FIELDS_LIST[section].length === 0) {
        delete DYNAMIC_FIELDS_LIST[section];
    }
	
	if(Object.keys(DYNAMIC_FIELDS_LIST).length<1){
		SAVE_FIELDS_BTN_FLAG=false;		
	}
    renderAllFields();
	resetBuilder();
}

// ===============================
// EDIT
// ===============================
function editField(section, sectionID, index){

    let f = DYNAMIC_FIELDS_LIST[section][index];

    $('#profileSection').val(sectionID);
    $('#fieldLabel').val(f.label);
    $('#fieldType').val(
        f.inputType ? 'input_'+f.inputType : f.fieldType
    );

    handleFieldTypeChange();

    fieldOptions = [...(f.options || [])];
    renderOptions();

    EDIT_INDEX = { section, index };
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#dynamicFieldModal'));
	}
}

function editFieldFromTable(id){

    var item = CUSTOM_FIELD_MAP[id];
    if (!item) return;

    // ✅ 1. Switch to Add Field tab
    $('a[href="#addProfileFields"]').tab('show');

    // ✅ 2. Fill form
    $('#profileSection').val(item.fieldParent);
    $('#fieldType').val(item.fieldType);
    $('#fieldLabel').val(item.labelName);

    handleFieldTypeChange();

    // ✅ 3. Options (if exist)
    fieldOptions = item.options ? [...item.options] : [];
    renderOptions();

    // ✅ 4. Set EDIT MODE (separate from old function)
    EDIT_INDEX = {
        id: id,
        isFromTable: true
    };
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#dynamicFieldModal'));
	}
}


function resetBuilder() {
    fieldOptions = [];
    EDIT_INDEX = { section: null, index: null };;
	$('#fieldLabel').removeClass('d-none');
    $('#fieldLabel').val('');
    $('#fieldType').val('');
    $('#profileSection').val('');
    $('#optionsWrapper').addClass('d-none');
    $('#optionsList').empty();
	if (typeof refreshCustomFieldState === 'function') {
		refreshCustomFieldState($('#dynamicFieldModal'));
	}
}




// Dynamic Add Profile Fields code end here//
