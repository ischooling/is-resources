var STUDENT_PROFILE_SETTING_MAP = {};
var STUDENT_PROFILE_SETTING_PENDING_ACTION = null;

$(document).ready(function () {
	$("#studentProfileSettingConfirmationModal").on("hidden.bs.modal", function () {
		clearStudentProfileSettingConfirmationModal();
	});
	// bindStudentProfileSettingActions();
	
});

function initStudentProfileSettingSelects() {

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
