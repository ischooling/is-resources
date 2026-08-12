var STUDENT_DASHBOARD_MANAGEMENT_ROWS = [];
var STUDENT_DASHBOARD_MANAGEMENT_STUDENT_NAMES = [];
var STUDENT_DASHBOARD_FIXED_SUBJECT_GRADE_IDS = ["11", "12", "13", "14", "15", "16"];
var STUDENT_DASHBOARD_FIXED_SUBJECTS = [
    { name: "Language Arts", pattern: /\blanguage\s+arts\b/i },
    { name: "Art", pattern: /\bart\b/i },
    { name: "Science", pattern: /\bscience\b/i },
    { name: "Mathematics", pattern: /\bmath(?:s|ematics)?\b/i },
    { name: "Technology", pattern: /\btech(?:nology)?\b/i }
];

function renderStudentDashboardManagementPage(title) {
    $("#dashboardContentInHTML").html(getStudentDashboardManagementContent(title || "Dummy Student Dashboard"));
    initStudentDashboardManagementMasters();
    loadStudentDashboardManagementData();
    studentDashboardManagementClearFieldValidationOnInput($("#studentDashboardManagementForm"));
}

function initStudentDashboardManagementMasters() {
    var learningProgramHtml = getLearningProgramAndCourseProviderMappingBySchoolId(SCHOOL_ID, "Select Learning Program", "");
    $("#studentDashboardManagementForm #learningProgram").html(learningProgramHtml);
    $("#studentDashboardManagementFilterForm #filterLearningProgram").html('<option value="">All Learning Program</option>' + learningProgramHtml.replace('value="" data-id="" >Select Learning Program', 'value="" data-id="" >All Learning Program'));
    $("#studentDashboardManagementFilterForm #filterGradeId").html('<option value="">All Grade</option>' + getGrades(getGradesData(grades_KG_12)));
    studentDashboardManagementOnLearningProgramChange("studentDashboardManagementForm");
    studentDashboardManagementApplySelect2();
}

function studentDashboardManagementApplySelect2() {
    ["learningProgram", "gradeId", "courseName", "filterLearningProgram", "filterGradeId"].forEach(function (id) {
        var elem = $("#" + id);
        if (elem.length && $.fn.select2) {
            elem.select2({ theme: "bootstrap4", placeholder: studentDashboardManagementSelectPlaceholder(id) });
        }
    });
}

function studentDashboardManagementSelectPlaceholder(id) {
    if (id === "courseName") {
        return "Select Course";
    }
    return "";
}

function studentDashboardManagementCleanCourseName(courseName) {
    return $.trim(String(courseName || "").replace(/\s*\((?:BUZZ|GS|BUZZ-GC)\)\s*/gi, " ").replace(/\s{2,}/g, " "));
}

function studentDashboardManagementStudentNameOptions(names) {
    var html = '<option value="">Select Student</option>';
    $.each(names || [], function (index, name) {
        html += '<option value="' + studentDashboardManagementEscape(name) + '">' + studentDashboardManagementEscape(name) + '</option>';
    });
    return html;
}

async function studentDashboardManagementLoadStudentNames() {
    var currentValue = $("#studentDashboardManagementForm #studentName").val() || "";
    var response = await getDashboardDataBasedUrlAndPayload(false, false, "student-dashboard-management/student-names", {});
    STUDENT_DASHBOARD_MANAGEMENT_STUDENT_NAMES = response && response.details ? response.details : [];
    $("#studentDashboardManagementForm #studentName").html(studentDashboardManagementStudentNameOptions(STUDENT_DASHBOARD_MANAGEMENT_STUDENT_NAMES));
    if (currentValue) {
        studentDashboardManagementEnsureStudentOption(currentValue);
        $("#studentDashboardManagementForm #studentName").val(currentValue);
    }
    $("#studentDashboardManagementForm #studentName").trigger("change");
}

function studentDashboardManagementOnLearningProgramChange(formId) {
    var learningProgram = $("#" + formId + " #learningProgram").val();
    var actualGrades = grades_KG_12;
    if (learningProgram === "ONE_TO_ONE_FLEX") {
        actualGrades = ["13", "14", "15", "16", "17"];
    } else if (learningProgram === "DUAL_DIPLOMA") {
        actualGrades = ["9", "10", "11", "12"];
    }
    $("#" + formId + " #gradeId").html('<option value="">Select Grade</option>' + getGrades(getGradesData(actualGrades)));
    studentDashboardManagementLoadCourses(formId);
}

function studentDashboardManagementLoadCourses(formId, selectedCourseName) {
    var gradeId = $("#" + formId + " #gradeId").val();
    var selectedProgram = $("#" + formId + " #learningProgram option:selected");
    var courseProviderIds = studentDashboardManagementCourseProviderIds(selectedProgram.attr("data-id") || "");
    var dropdown = $("#" + formId + " #courseName");
    dropdown.html("");
    if (!gradeId) {
        dropdown.prop("disabled", false);
        dropdown.trigger("change");
        return;
    }
    if (courseProviderIds.length === 0) {
        courseProviderIds = ["37", "38", "39", "40", "41"];
    }

    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForCommon("masters"),
        data: JSON.stringify(getRequestForMaster("formId", "SUBJECT-NAME-LIST-BASED-ON-BATCHES", USER_ID, courseProviderIds.join(","), "student", "STANDARD_WISE", gradeId)),
        dataType: "json",
        cache: false,
        timeout: 600000
    }).done(function (data) {
        var seenCourses = {};
        $.each((data && data.mastersData ? data.mastersData.courseList : []) || [], function (k, v) {
            var rawLabel = v.value || "";
            var titleLabel = $.trim(v.extra || "");
            var label = titleLabel || studentDashboardManagementCleanCourseName(rawLabel);
            var value = v.key || label;
            var uniqueKey = String(label || rawLabel).toLowerCase();
            if (!seenCourses[uniqueKey]) {
                seenCourses[uniqueKey] = true;
                dropdown.append('<option value="' + studentDashboardManagementEscape(label) + '" data-course-id="' + studentDashboardManagementEscape(value) + '" data-raw-course-name="' + studentDashboardManagementEscape(rawLabel) + '" title="' + studentDashboardManagementEscape(label) + '">' + studentDashboardManagementEscape(label) + '</option>');
            }
        });
        var fixedSubjectsGrade = studentDashboardManagementIsFixedSubjectGrade(gradeId);
        if (fixedSubjectsGrade) {
            studentDashboardManagementSelectFixedSubjects(dropdown);
        } else if (selectedCourseName) {
            var selectedCourseNames = $.isArray(selectedCourseName) ? selectedCourseName : [selectedCourseName];
            dropdown.find("option").filter(function () {
                var optionText = $.trim($(this).text());
                var optionValue = $.trim($(this).val());
                var optionCourseId = $.trim($(this).attr("data-course-id") || "");
                var optionRawCourseName = $.trim($(this).attr("data-raw-course-name") || "");
                var cleanRawCourseName = studentDashboardManagementCleanCourseName(optionRawCourseName);
                return selectedCourseNames.some(function (courseName) {
                    courseName = $.trim(courseName);
                    var cleanCourseName = studentDashboardManagementCleanCourseName(courseName);
                    return optionText === courseName || optionValue === courseName || optionRawCourseName === courseName || optionText === cleanCourseName || optionValue === cleanCourseName || cleanRawCourseName === cleanCourseName || optionCourseId === courseName;
                });
            }).prop("selected", true);
        }
        dropdown.prop("disabled", fixedSubjectsGrade);
        dropdown.trigger("change");
    }).fail(function () {
        dropdown.prop("disabled", false);
        dropdown.html('<option value="">Select Course</option>');
    });
}

function studentDashboardManagementIsFixedSubjectGrade(gradeId) {
    return STUDENT_DASHBOARD_FIXED_SUBJECT_GRADE_IDS.indexOf(String(gradeId || "")) !== -1;
}

function studentDashboardManagementSelectFixedSubjects(dropdown) {
    $.each(STUDENT_DASHBOARD_FIXED_SUBJECTS, function (index, subject) {
        dropdown.find("option").filter(function () {
            return !$(this).prop("selected") && subject.pattern.test($.trim($(this).text()));
        }).first().prop("selected", true);
    });
}

function studentDashboardManagementCourseProviderIds(courseProviderIds) {
    return String(courseProviderIds || "")
        .split(",")
        .map(function (id) {
            return $.trim(id);
        })
        .filter(function (id) {
            return /^\d+$/.test(id);
        });
}

async function loadStudentDashboardManagementData() {
    var payload = {
        studentName: $("#studentDashboardManagementFilterForm #filterStudentName").val(),
        learningProgram: $("#studentDashboardManagementFilterForm #filterLearningProgram").val(),
        gradeId: $("#studentDashboardManagementFilterForm #filterGradeId").val() ? parseInt($("#studentDashboardManagementFilterForm #filterGradeId").val(), 10) : null
	};
	var response = await getDashboardDataBasedUrlAndPayload(true, false, "student-dashboard-management/list", payload);
	STUDENT_DASHBOARD_MANAGEMENT_ROWS = response && response.details ? response.details : [];
	renderStudentDashboardManagementTable(STUDENT_DASHBOARD_MANAGEMENT_ROWS);
}

function renderStudentDashboardManagementTable(rows) {
	var html = "";
	$.each(rows || [], function (index, row) {
		var recordId = row.id || row.ID || row.demoDataId || row.studentDashboardDemoDataId || "";
		html += `<tr>
			<td>${studentDashboardManagementEscape(row.studentName)}</td>
			<td>${studentDashboardManagementEscape(row.learningProgramName || row.learningProgram)}</td>
			<td>${studentDashboardManagementEscape(row.gradeName)}</td>
			<td class="student-dashboard-course-name" title="${studentDashboardManagementEscape(studentDashboardManagementCleanCourseName(row.courseName))}">${studentDashboardManagementEscape(studentDashboardManagementCleanCourseName(row.courseName))}</td>
			<td>${row.classCount || 0}</td>
			<td>${row.activityCount || 0}</td>
			<td>${row.active === "Y" ? "Active" : "Inactive"}</td>
			<td class="student-dashboard-actions-cell">
				<button type="button" class="btn btn-sm btn-primary" title="View Student Dashboard"
					data-row-index="${index}" 
					data-user-type="DS" 
                    data-record-id="${studentDashboardManagementEscape(recordId)}"
					onclick="openStudentDashboardManagementSpoofUrlModal(this)"><i class="fa fa-eye"></i></button>
				<button type="button" class="btn btn-sm btn-danger" title="Delete"
					data-row-index="${index}" 
                    data-user-type="DS" 
					data-record-id="${studentDashboardManagementEscape(recordId)}"
					onclick="deleteStudentDashboardManagementData(${index}, this)"><i class="fa fa-trash"></i></button>
			</td>
		</tr>`;
	});
	if (!html) {
		html = '<tr><td colspan="8" class="text-center">No student dashboard data found.</td></tr>';
	}
	$("#studentDashboardManagementTable tbody").html(html);
}

async function openStudentDashboardManagementSpoofUrlModal(indexOrSrc) {
    if (typeof openSpoofUrlModal !== "function") {
        showMessageTheme2(0, "Spoof URL modal not available.", "", true);
        return false;
    }
    var row = studentDashboardManagementResolveRow(indexOrSrc, indexOrSrc) || {};
    return openSpoofUrlModal("DS", row.id, row.studentName, "student-demo");
}

function studentDashboardManagementClearFieldValidation(form) {
    form.find("#studentName, #learningProgram, #gradeId, #courseName").removeClass("is-invalid");
    form.find("#studentNameValidationMsg, #learningProgramValidationMsg, #gradeIdValidationMsg, #courseNameValidationMsg").addClass("d-none");
}

function studentDashboardManagementShowFieldValidation(form, fieldId, msgId) {
    form.find("#" + fieldId).first().addClass("is-invalid");
    form.find("#" + msgId).first().removeClass("d-none");
}

async function saveStudentDashboardManagementData(src) {
    var form = src ? $(src).closest("form") : $("#studentDashboardManagementForm");
    var courseSelect = form.find("#courseName").first();
    var learningProgramSelect = form.find("#learningProgram").first();
    var gradeSelect = form.find("#gradeId").first();
    var studentName = $.trim(form.find("#studentName").first().val() || "");
    var demoDataId = form.find("#demoDataId").val() ? parseInt(form.find("#demoDataId").val(), 10) : null;
    var learningProgram = $.trim(learningProgramSelect.val() || "");
    var learningProgramName = studentDashboardManagementSelectDisplayText(learningProgramSelect) || learningProgram;
    var gradeId = gradeSelect.val() ? parseInt(gradeSelect.val(), 10) : 0;
    var gradeName = studentDashboardManagementSelectDisplayText(gradeSelect);
    var selectedCourses = studentDashboardManagementSelectedCourses(courseSelect);
    var classCount = parseInt(form.find("#classCount").val() || "0", 10);
    var activityCount = parseInt(form.find("#activityCount").val() || "0", 10);

    studentDashboardManagementClearFieldValidation(form);
    var isValid = true;
    var focusField = null;
    if (!studentName) {
        studentDashboardManagementShowFieldValidation(form, "studentName", "studentNameValidationMsg");
        focusField = focusField || "studentName";
        isValid = false;
    }
    if (!learningProgram || !learningProgramName) {
        studentDashboardManagementShowFieldValidation(form, "learningProgram", "learningProgramValidationMsg");
        focusField = focusField || "learningProgram";
        isValid = false;
    }
    if (!gradeId || !gradeName) {
        studentDashboardManagementShowFieldValidation(form, "gradeId", "gradeIdValidationMsg");
        focusField = focusField || "gradeId";
        isValid = false;
    }
    if (selectedCourses.length === 0) {
        studentDashboardManagementShowFieldValidation(form, "courseName", "courseNameValidationMsg");
        focusField = focusField || "courseName";
        isValid = false;
    }
    if (!isValid) {
        if (focusField) {
            form.find("#" + focusField).first().trigger("focus");
        }
        return false;
    }
    var response = await getDashboardDataBasedUrlAndPayload(true, true, "student-dashboard-management/save", {
        id: demoDataId,
        dashboardType: "STUDENT",
        studentName: studentName,
        learningProgram: learningProgram,
        learningProgramName: learningProgramName,
        gradeId: gradeId,
        gradeName: gradeName,
        courseId: selectedCourses.map(function (course) { return course.courseId; }).join(", "),
        courseName: selectedCourses.map(function (course) { return course.courseName; }).join(", "),
        type: "CLASS",
        classCount: isNaN(classCount) ? 0 : classCount,
        activityCount: isNaN(activityCount) ? 0 : activityCount,
        orderSet: 0,
        active: "Y"
    });
    if (!response || response.status != "1") {
        return false;
    }
    showMessageTheme2(1, "Student dashboard data saved successfully.", "", true);
    resetStudentDashboardManagementForm();
    loadStudentDashboardManagementData();
}

function studentDashboardManagementClearFieldValidationOnInput(form) {
    form.find("#studentName").off("input.studentDashboardValidation").on("input.studentDashboardValidation", function () {
        $(this).removeClass("is-invalid");
        form.find("#studentNameValidationMsg").addClass("d-none");
    });
    form.find("#learningProgram, #gradeId, #courseName").off("change.studentDashboardValidation").on("change.studentDashboardValidation", function () {
        $(this).removeClass("is-invalid");
        form.find("#" + $(this).attr("id") + "ValidationMsg").addClass("d-none");
    });
}

function studentDashboardManagementSelectedCourses(courseSelect) {
    var selectedCourses = [];
    var seenCourses = {};
    var addCourse = function (courseId, courseName) {
        courseId = $.trim(courseId || "");
        courseName = studentDashboardManagementCleanCourseName(courseName || courseId);
        if (!courseId && !courseName) {
            return;
        }
        var key = courseName.toLowerCase() || courseId.toLowerCase();
        if (!seenCourses[key]) {
            seenCourses[key] = true;
            selectedCourses.push({ courseId: courseId || courseName, courseName: courseName });
        }
    };
    courseSelect.find("option:selected").each(function () {
        addCourse($(this).attr("data-course-id") || $(this).val(), $(this).text());
    });
    if ($.fn.select2 && courseSelect.data("select2")) {
        $.each(courseSelect.select2("data") || [], function (index, item) {
            addCourse(item.id, item.text);
        });
    }
    return selectedCourses;
}

function studentDashboardManagementSelectDisplayText(select) {
    var selectedOptionText = $.trim(select.find("option:selected").text() || "");
    if (selectedOptionText && selectedOptionText !== "Select Learning Program" && selectedOptionText !== "Select Grade") {
        return selectedOptionText;
    }
    if ($.fn.select2 && select.data("select2")) {
        var selectedData = select.select2("data") || [];
        if (selectedData.length && $.trim(selectedData[0].text || "")) {
            return $.trim(selectedData[0].text || "");
        }
    }
    return "";
}

function editStudentDashboardManagementData(index) {
    var row = STUDENT_DASHBOARD_MANAGEMENT_ROWS[index];
    if (!row) {
        return;
    }
    var form = $("#studentDashboardManagementForm");
    studentDashboardManagementClearFieldValidation(form);
    form.find("#demoDataId").val(row.id || "");
    studentDashboardManagementEnsureStudentOption(row.studentName || "");
    form.find("#studentName").val(row.studentName || "").trigger("change");
    form.find("#learningProgram").val(row.learningProgram || "").trigger("change");
    form.find("#gradeId").val(row.gradeId || "").trigger("change");
    form.find("#classCount").val(row.classCount || 0);
    form.find("#activityCount").val(row.activityCount || 0);
    studentDashboardManagementLoadCourses("studentDashboardManagementForm", studentDashboardManagementSplitCourseValues(row.courseId || row.courseName || ""));
    $("html, body").animate({ scrollTop: form.offset().top - 80 }, 300);
}

async function toggleStudentDashboardManagementData(id, active) {
    var response = await getDashboardDataBasedUrlAndPayload(true, true, "student-dashboard-management/toggle", { id: id, active: active });
    if (response && response.status == "1") {
        loadStudentDashboardManagementData();
    }
}

async function deleteStudentDashboardManagementData(indexOrId, src) {
    var row = studentDashboardManagementResolveRow(indexOrId, src);
    if (!row) {
        showMessageTheme2(0, "Record not found.", "", true);
        return false;
    }
    if (!confirm("Are you sure you want to delete this student dashboard data?")) {
        return false;
    }
    var id = row.id || row.ID || row.demoDataId || row.studentDashboardDemoDataId;
    if (!id) {
        var detailResponse = await getDashboardDataBasedUrlAndPayload(true, true, "student-dashboard-management/delete-by-details", {
            studentName: row.studentName,
            learningProgram: row.learningProgram,
            learningProgramName: row.learningProgramName || row.learningProgram,
            gradeId: row.gradeId || null,
            gradeName: row.gradeName,
            courseName: row.courseName
        });
        if (detailResponse && detailResponse.status == "1") {
            loadStudentDashboardManagementData();
        }
        return false;
    }
    var response = await getDashboardDataBasedUrlAndPayload(true, true, "student-dashboard-management/delete", { id: id });
    if (response && response.status == "1") {
        loadStudentDashboardManagementData();
    }
}

function studentDashboardManagementResolveRow(indexOrId, src) {
    var button = src || (window.event && (window.event.currentTarget || window.event.target));
    var buttonData = button ? $(button).data() : null;
    var id = $.trim(buttonData && buttonData.recordId ? buttonData.recordId : (indexOrId == null ? "" : indexOrId));
    if (id && !/^\[object\s+/.test(id)) {
        for (var i = 0; i < STUDENT_DASHBOARD_MANAGEMENT_ROWS.length; i++) {
            var row = STUDENT_DASHBOARD_MANAGEMENT_ROWS[i] || {};
            if (String(row.id || row.ID || row.demoDataId || row.studentDashboardDemoDataId || "") === id) {
                return row;
            }
        }
    }
    if ($.isNumeric(indexOrId) && STUDENT_DASHBOARD_MANAGEMENT_ROWS[indexOrId]) {
        return STUDENT_DASHBOARD_MANAGEMENT_ROWS[indexOrId];
    }
    if (button) {
        if (buttonData && (buttonData.recordId || buttonData.studentName || buttonData.courseName)) {
            return {
                id: buttonData.recordId,
                dummyLmsUserId: buttonData.dummyLmsUserId
            };
        }
        var rowIndex = $(button).closest("tr").index();
        if (rowIndex >= 0 && STUDENT_DASHBOARD_MANAGEMENT_ROWS[rowIndex]) {
            return STUDENT_DASHBOARD_MANAGEMENT_ROWS[rowIndex];
        }
    }
    return null;
}

function resetStudentDashboardManagementForm() {
    $("#studentDashboardManagementForm #demoDataId").val("");
    $("#studentDashboardManagementForm #studentName").val("");
    $("#studentDashboardManagementForm #learningProgram").val("").trigger("change");
    $("#studentDashboardManagementForm #classCount").val("3");
    $("#studentDashboardManagementForm #activityCount").val("2");
    studentDashboardManagementOnLearningProgramChange("studentDashboardManagementForm");
    studentDashboardManagementClearFieldValidation($("#studentDashboardManagementForm"));
}

function studentDashboardManagementEnsureStudentOption(studentName) {
    $("#studentDashboardManagementForm #studentName").val($.trim(studentName || ""));
}

function studentDashboardManagementSplitCourseValues(value) {
    return String(value || "")
        .split(",")
        .map(function (course) {
            return $.trim(course);
        })
        .filter(function (course) {
            return !!course;
        });
}

function resetStudentDashboardManagementFilter() {
    $("#studentDashboardManagementFilterForm #filterStudentName").val("");
    $("#studentDashboardManagementFilterForm #filterLearningProgram").val("").trigger("change");
    $("#studentDashboardManagementFilterForm #filterGradeId").val("").trigger("change");
    loadStudentDashboardManagementData();
}

function studentDashboardManagementEscape(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
