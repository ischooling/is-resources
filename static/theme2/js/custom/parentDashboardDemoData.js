var PARENT_DEMO_DATA_ROWS = [];
var PARENT_DEMO_STUDENT_NAMES = [];
var PARENT_DEMO_FIXED_SUBJECT_GRADE_IDS = ["11", "12", "13", "14", "15", "16"];
var PARENT_DEMO_FIXED_SUBJECTS = [
    { name: "Language Arts", pattern: /\blanguage\s+arts\b/i },
    { name: "Art", pattern: /\bart\b/i },
    { name: "Science", pattern: /\bscience\b/i },
    { name: "Mathematics", pattern: /\bmath(?:s|ematics)?\b/i },
    { name: "Technology", pattern: /\btech(?:nology)?\b/i }
];

function renderParentDashboardDemoDataPage(title) {
    $("#dashboardContentInHTML").html(getParentDashboardDemoDataContent(title || "Dummy Parent Dashboard"));
    initParentDashboardDemoDataMasters();
    loadParentDashboardDemoData();
}

function initParentDashboardDemoDataMasters() {
    var learningProgramHtml = getLearningProgramAndCourseProviderMappingBySchoolId(SCHOOL_ID, "Select Learning Program", "");
    $("#parentDemoDataForm #learningProgram").html(learningProgramHtml);
    $("#parentDemoDataFilterForm #filterLearningProgram").html(parentDemoDataFilterLearningProgramOptions(learningProgramHtml));
    $("#parentDemoDataFilterForm #filterGradeId").html('<option value="">All Grade</option>' + getGrades(getGradesData(grades_KG_12)));
    parentDemoDataOnLearningProgramChange("parentDemoDataForm");
    parentDemoDataApplySelect2();
    parentDemoDataBindFilterEvents();
}

function parentDemoDataApplySelect2() {
    ["learningProgram", "gradeId", "courseName", "filterLearningProgram", "filterGradeId"].forEach(function (id) {
        var elem = $("#" + id);
        if (elem.length && $.fn.select2) {
            elem.select2({ theme: "bootstrap4", placeholder: parentDemoDataSelectPlaceholder(id) });
        }
    });
}

function parentDemoDataSelectPlaceholder(id) {
    if (id === "courseName") {
        return "Select Course";
    }
    return "";
}

function parentDemoDataFilterLearningProgramOptions(learningProgramHtml) {
    var wrapper = $("<select></select>").html(learningProgramHtml || "");
    wrapper.find("option").filter(function () {
        return !$.trim($(this).val() || "");
    }).remove();
    return '<option value="">All Learning Program</option>' + wrapper.html();
}

function parentDemoDataBindFilterEvents() {
    $("#parentDemoDataFilterForm").off("submit.parentDemoData").on("submit.parentDemoData", function (event) {
        event.preventDefault();
        loadParentDashboardDemoData();
    });
    $("#parentDemoDataFilterForm #filterStudentName").off("keypress.parentDemoData").on("keypress.parentDemoData", function (event) {
        if (event.which === 13) {
            event.preventDefault();
            loadParentDashboardDemoData();
        }
    });
}

function parentDemoDataCleanCourseName(courseName) {
    return $.trim(String(courseName || "").replace(/\s*\((?:BUZZ|GS|BUZZ-GC)\)\s*/gi, " ").replace(/\s{2,}/g, " "));
}

function parentDemoDataStudentNameOptions(names) {
    var html = '<option value="">Select Student</option>';
    $.each(names || [], function (index, name) {
        html += '<option value="' + parentDemoDataEscape(name) + '">' + parentDemoDataEscape(name) + '</option>';
    });
    return html;
}

async function parentDemoDataLoadStudentNames() {
    var currentValue = $("#parentDemoDataForm #studentName").val() || "";
    var response = await getDashboardDataBasedUrlAndPayload(false, false, "parent-dashboard-demo-data/student-names", {});
    PARENT_DEMO_STUDENT_NAMES = response && response.details ? response.details : [];
    $("#parentDemoDataForm #studentName").html(parentDemoDataStudentNameOptions(PARENT_DEMO_STUDENT_NAMES));
    if (currentValue) {
        parentDemoDataEnsureStudentOption(currentValue);
        $("#parentDemoDataForm #studentName").val(currentValue);
    }
    $("#parentDemoDataForm #studentName").trigger("change");
}

function parentDemoDataOnLearningProgramChange(formId) {
    var learningProgram = $("#" + formId + " #learningProgram").val();
    var actualGrades = grades_KG_12;
    if (learningProgram === "ONE_TO_ONE_FLEX") {
        actualGrades = ["13", "14", "15", "16", "17"];
    } else if (learningProgram === "DUAL_DIPLOMA") {
        actualGrades = ["9", "10", "11", "12"];
    }
    $("#" + formId + " #gradeId").html('<option value="">Select Grade</option>' + getGrades(getGradesData(actualGrades)));
    parentDemoDataLoadCourses(formId);
}

function parentDemoDataLoadCourses(formId, selectedCourseName) {
    var gradeId = $("#" + formId + " #gradeId").val();
    var selectedProgram = $("#" + formId + " #learningProgram option:selected");
    var courseProviderIds = parentDemoDataCourseProviderIds(selectedProgram.attr("data-id") || "");
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

    var userRole = "student";
    var dataType = "STANDARD_WISE";
    var lmsPlatform = courseProviderIds.join(",");
    var request = $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForCommon("masters"),
        data: JSON.stringify(getRequestForMaster("formId", "SUBJECT-NAME-LIST-BASED-ON-BATCHES", USER_ID, lmsPlatform, userRole, dataType, gradeId)),
        dataType: "json",
        cache: false,
        timeout: 600000
    });

    request.done(function (data) {
        var seenCourses = {};
        var result = data && data.mastersData ? data.mastersData.courseList : [];
        $.each(result || [], function (k, v) {
            var rawLabel = v.value || "";
            var titleLabel = $.trim(v.extra || "");
            var label = titleLabel || parentDemoDataCleanCourseName(rawLabel);
            var value = v.key || label;
            var uniqueKey = String(label || rawLabel).toLowerCase();
            if (!seenCourses[uniqueKey]) {
                seenCourses[uniqueKey] = true;
                dropdown.append('<option value="' + parentDemoDataEscape(label) + '" data-course-id="' + parentDemoDataEscape(value) + '" data-raw-course-name="' + parentDemoDataEscape(rawLabel) + '" title="' + parentDemoDataEscape(label) + '">' + parentDemoDataEscape(label) + '</option>');
            }
        });
        var fixedSubjectsGrade = parentDemoDataIsFixedSubjectGrade(gradeId);
        if (fixedSubjectsGrade) {
            parentDemoDataSelectFixedSubjects(dropdown);
        } else if (selectedCourseName) {
            var selectedCourseNames = $.isArray(selectedCourseName) ? selectedCourseName : [selectedCourseName];
            dropdown.find("option").filter(function () {
                var optionText = $.trim($(this).text());
                var optionValue = $.trim($(this).val());
                var optionCourseId = $.trim($(this).attr("data-course-id") || "");
                var optionRawCourseName = $.trim($(this).attr("data-raw-course-name") || "");
                var cleanRawCourseName = parentDemoDataCleanCourseName(optionRawCourseName);
                return selectedCourseNames.some(function (courseName) {
                    courseName = $.trim(courseName);
                    var cleanCourseName = parentDemoDataCleanCourseName(courseName);
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

function parentDemoDataIsFixedSubjectGrade(gradeId) {
    return PARENT_DEMO_FIXED_SUBJECT_GRADE_IDS.indexOf(String(gradeId || "")) !== -1;
}

function parentDemoDataSelectFixedSubjects(dropdown) {
    $.each(PARENT_DEMO_FIXED_SUBJECTS, function (index, subject) {
        dropdown.find("option").filter(function () {
            return !$(this).prop("selected") && subject.pattern.test($.trim($(this).text()));
        }).first().prop("selected", true);
    });
}

function parentDemoDataCourseProviderIds(courseProviderIds) {
    return String(courseProviderIds || "")
        .split(",")
        .map(function (id) {
            return $.trim(id);
        })
        .filter(function (id) {
            return /^\d+$/.test(id);
        });
}

function parentDemoDataCourseTypeByGrade(gradeId) {
    if (String(gradeId) === "20") {
        return "CR";
    }
    if (String(gradeId) === "21") {
        return "AP";
    }
    return "FT";
}

async function loadParentDashboardDemoData() {
    var filters = parentDemoDataFilterPayload();
    var response = await getDashboardDataBasedUrlAndPayload(true, false, "parent-dashboard-demo-data/list", {});
    var rows = response && response.details ? response.details : [];
    PARENT_DEMO_DATA_ROWS = parentDemoDataApplyFilters(rows, filters);
    renderParentDashboardDemoDataTable(PARENT_DEMO_DATA_ROWS, response.parentDetails);
}

function parentDemoDataFilterPayload() {
    var gradeValue = parentDemoDataFilterSelectValue($("#parentDemoDataFilterForm #filterGradeId"));
    return {
        studentName: $.trim($("#parentDemoDataFilterForm #filterStudentName").val() || ""),
        learningProgram: parentDemoDataFilterSelectValue($("#parentDemoDataFilterForm #filterLearningProgram")),
        learningProgramName: parentDemoDataFilterSelectText($("#parentDemoDataFilterForm #filterLearningProgram")),
        gradeId: gradeValue ? parseInt(gradeValue, 10) : null,
        gradeName: parentDemoDataFilterSelectText($("#parentDemoDataFilterForm #filterGradeId"))
    };
}

function parentDemoDataFilterSelectValue(select) {
    var value = $.trim(select.val() || "");
    if (value || !($.fn.select2 && select.data("select2"))) {
        return value;
    }
    var selectedData = select.select2("data") || [];
    return selectedData.length ? $.trim(selectedData[0].id || "") : "";
}

function parentDemoDataFilterSelectText(select) {
    var value = parentDemoDataFilterSelectValue(select);
    if (!value) {
        return "";
    }
    var selectedOptionText = $.trim(select.find("option:selected").text() || "");
    if (selectedOptionText && !/^all\s/i.test(selectedOptionText)) {
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

function parentDemoDataApplyFilters(rows, filters) {
    filters = filters || {};
    var studentName = $.trim(filters.studentName || "").toLowerCase();
    var learningProgram = $.trim(filters.learningProgram || "").toLowerCase();
    var learningProgramName = $.trim(filters.learningProgramName || "").toLowerCase();
    var gradeId = filters.gradeId;
    var gradeName = $.trim(filters.gradeName || "").toLowerCase();
    return (rows || []).filter(function (row) {
        var rowStudentName = $.trim(row.studentName || "").toLowerCase();
        var rowLearningProgram = $.trim(row.learningProgram || "").toLowerCase();
        var rowLearningProgramName = $.trim(row.learningProgramName || "").toLowerCase();
        var rowGradeName = $.trim(row.gradeName || "").toLowerCase();
        if (studentName && rowStudentName.indexOf(studentName) === -1) {
            return false;
        }
        if (learningProgram && rowLearningProgram !== learningProgram && rowLearningProgramName !== learningProgram && rowLearningProgramName !== learningProgramName) {
            return false;
        }
        if (gradeId && String(row.gradeId || "") !== String(gradeId)) {
            return false;
        }
        if (!gradeId && gradeName && rowGradeName !== gradeName) {
            return false;
        }
        return true;
    });
}

function renderParentDashboardDemoDataTable(rows, parentDetails) {
    var html = "";
    var groupedRows = parentDemoDataGroupRows(rows || []);
    $.each(groupedRows || [], function (index, row) {
        html += `<tr>
            <td>${parentDemoDataEscape(row.studentName)}</td>
            <td>${parentDemoDataEscape(row.learningProgramName || row.learningProgram)}</td>
            <td>${parentDemoDataEscape(row.gradeName)}</td>
            <td class="parent-demo-course-name" title="${parentDemoDataEscape(row.courseName)}">${parentDemoDataEscape(row.courseName)}</td>
            <td class="parent-demo-actions-cell">
                <span class="parent-demo-actions-inline">
                    <button type="button" class="btn btn-sm btn-info" title="View Parent Dashboard" onclick="openParentDashboardDemoSpoofUrlModal(${index}, ${parentDetails.userId}, '${parentDetails.userName}')"><i class="fa fa-eye"></i></button>
                    <button type="button" class="btn btn-sm btn-danger" title="Delete"
                        data-row-index="${index}"
                        data-user-type="DP" 
                        data-record-ids="${parentDemoDataEscape((row.recordIds || []).join(","))}"
                        onclick="deleteParentDashboardDemoDataGroup(${index}, this)"><i class="fa fa-trash"></i></button>
                </span>
            </td>
        </tr>`;
    });
    if (!html) {
        html = '<tr><td colspan="5" class="text-center">No demo data found.</td></tr>';
    }
    $("#parentDemoDataTable tbody").html(html);
}

function parentDemoDataGroupRows(rows) {
    var grouped = {};
    var orderedKeys = [];
    $.each(rows || [], function (index, row) {
        var key = [
            $.trim(row.studentName || "").toLowerCase(),
            $.trim(row.learningProgramName || row.learningProgram || "").toLowerCase(),
            $.trim(row.gradeName || "").toLowerCase()
        ].join("|");
        if (!grouped[key]) {
            grouped[key] = $.extend({}, row, {
                courseName: "",
                courseNames: [],
                courseNameLookup: {},
                recordIds: []
            });
            orderedKeys.push(key);
        }
        if (row.id) {
            grouped[key].recordIds.push(row.id);
        }
        if (row.ID) {
            grouped[key].recordIds.push(row.ID);
        }
        if (row.demoDataId) {
            grouped[key].recordIds.push(row.demoDataId);
        }
        if (row.parentDashboardDemoDataId) {
            grouped[key].recordIds.push(row.parentDashboardDemoDataId);
        }
        var courseName = parentDemoDataCleanCourseName(row.courseName || "");
        var courseKey = courseName.toLowerCase();
        if (courseName && !grouped[key].courseNameLookup[courseKey]) {
            grouped[key].courseNameLookup[courseKey] = true;
            grouped[key].courseNames.push(courseName);
        }
    });
    return orderedKeys.map(function (key) {
        grouped[key].courseName = grouped[key].courseNames.join(", ");
        delete grouped[key].courseNames;
        delete grouped[key].courseNameLookup;
        return grouped[key];
    });
}

async function openParentDashboardDemoSpoofUrlModal(index, parentUserId, parentUsername) {
    var feedUserId = String(typeof USER_ID !== "undefined" ? USER_ID : "").trim();
    var row = parentDemoDataGroupRows(PARENT_DEMO_DATA_ROWS || [])[index] || {};
    if (!feedUserId) {
        showMessageTheme2(0, "User ID not found for preview.", "", true);
        return false;
    }
    try {
        localStorage.setItem("PARENT_DEMO_FEED_USER_ID", feedUserId);
    } catch (e) {
        console.warn("Unable to set parent demo feed user id", e);
    }
    if (typeof openSpoofUrlModal !== "function") {
        showMessageTheme2(0, "Spoof URL modal not available.", "", true);
        return false;
    }
    return openSpoofUrlModal("DP", parentUserId, parentUsername, "parent-demo");
}

async function saveParentDashboardDemoData(src) {
    var form = src ? $(src).closest("form") : $("#parentDemoDataForm:visible").last();
    if (!form.length) {
        form = $("#parentDemoDataForm").last();
    }
    var courseSelect = form.find("#courseName").first();
    var learningProgramSelect = form.find("#learningProgram").first();
    var gradeSelect = form.find("#gradeId").first();
    var learningProgramOption = learningProgramSelect.find("option:selected");
    var gradeOption = gradeSelect.find("option:selected");
    var studentName = $.trim(form.find("#studentName").first().val() || "");
    if (!studentName && src) {
        var nativeForm = src.closest ? src.closest("form") : null;
        var nativeStudentName = nativeForm ? nativeForm.querySelector("[name='studentName'], #studentName") : null;
        studentName = $.trim(nativeStudentName && nativeStudentName.value ? nativeStudentName.value : "");
    }
    var demoDataId = form.find("#demoDataId").val() ? parseInt(form.find("#demoDataId").val(), 10) : null;
    var learningProgram = $.trim(learningProgramSelect.val() || learningProgramOption.val() || "");
    var learningProgramName = parentDemoDataSelectDisplayText(learningProgramSelect) || $.trim(learningProgramOption.text() || "");
    if (!learningProgramName || learningProgramName === "Select Learning Program") {
        learningProgramName = learningProgram;
    }
    if (!learningProgram) {
        learningProgram = learningProgramName;
    }
    var gradeIdValue = $.trim(gradeSelect.val() || gradeOption.val() || "");
    var gradeName = parentDemoDataSelectDisplayText(gradeSelect) || $.trim(gradeOption.text() || "");
    if (!gradeName || gradeName === "Select Grade") {
        gradeName = "";
    }
    var gradeId = parentDemoDataResolveGradeId(gradeIdValue, gradeName);
    if (!gradeName) {
        gradeName = parentDemoDataResolveGradeName(gradeId) || gradeIdValue;
    }
    var typeValue = "CLASS";
    var activeValue = "Y";
    var orderSetValue = 0;
    var payload = {
        id: demoDataId,
        studentName: studentName,
        learningProgram: learningProgram || learningProgramName,
        learningProgramName: learningProgramName,
        gradeId: gradeId,
        gradeName: gradeName,
        type: typeValue,
        orderSet: orderSetValue ? parseInt(orderSetValue, 10) : 0,
        active: activeValue
    };
    if (!payload.studentName || !payload.learningProgram || !payload.learningProgramName || !payload.gradeId || !payload.gradeName) {
        console.warn("Dummy Parent Dashboard missing required values", {
            payload: payload,
            rawStudentNameValue: $.trim(form.find("#studentName").first().val() || ""),
            rawLearningProgramValue: learningProgramSelect.val(),
            rawGradeValue: gradeIdValue,
            selectedLearningProgramText: parentDemoDataSelectDisplayText(learningProgramSelect),
            selectedGradeText: parentDemoDataSelectDisplayText(gradeSelect)
        });
        showMessageTheme2(0, "Please enter student name and select learning program and grade.", "", true);
        return false;
    }
    var selectedCourses = parentDemoDataSelectedCourses(courseSelect);
    if (selectedCourses.length === 0) {
        showMessageTheme2(0, "Please select actual course value.", "", true);
        return false;
    }
    if (demoDataId && selectedCourses.length > 1) {
        selectedCourses = [selectedCourses[0]];
    }

    for (var i = 0; i < selectedCourses.length; i++) {
        var coursePayload = $.extend({}, payload, {
            id: i === 0 ? demoDataId : null,
            courseId: selectedCourses[i].courseId,
            courseName: selectedCourses[i].courseName,
            orderSet: payload.orderSet + i
        });
        var response = await getDashboardDataBasedUrlAndPayload(true, true, "parent-dashboard-demo-data/save", coursePayload);
        if (!response || response.status != "1") {
            return false;
        }
    }
    showMessageTheme2(1, selectedCourses.length > 1 ? "Demo courses saved successfully." : "Demo data saved successfully.", "", true);
    resetParentDashboardDemoDataForm();
    loadParentDashboardDemoData();
}

function parentDemoDataSelectedCourses(courseSelect) {
    var selectedCourses = [];
    var seenCourses = {};
    var addCourse = function (courseId, courseName) {
        courseId = $.trim(courseId || "");
        courseName = parentDemoDataCleanCourseName(courseName || "");
        if (!courseName) {
            courseName = courseId;
        }
        if (!courseId && !courseName) {
            return;
        }
        var key = courseName.toLowerCase() || courseId.toLowerCase();
        if (seenCourses[key]) {
            return;
        }
        seenCourses[key] = true;
        selectedCourses.push({
            courseId: courseId || courseName,
            courseName: courseName
        });
    };

    courseSelect.find("option:selected").each(function () {
        addCourse($(this).attr("data-course-id") || $(this).val(), $(this).text());
    });

    if ($.fn.select2 && courseSelect.data("select2")) {
        $.each(courseSelect.select2("data") || [], function (index, item) {
            addCourse(item.id, item.text);
        });
    }

    courseSelect.next(".select2").find(".select2-selection__choice").each(function () {
        var chipText = $.trim($(this).attr("title") || $(this).text() || "");
        chipText = chipText.replace(/^\s*[×x]\s*/i, "");
        addCourse(chipText, chipText);
    });

    var selectedValues = courseSelect.val();
    if (selectedValues && !$.isArray(selectedValues)) {
        selectedValues = [selectedValues];
    }
    $.each(selectedValues || [], function (index, value) {
        var option = courseSelect.find("option").filter(function () {
            return String($(this).val()) === String(value);
        }).first();
        addCourse(value, option.length ? option.text() : value);
    });

    return selectedCourses;
}

function parentDemoDataSelectDisplayText(select) {
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
    var renderedText = $.trim(select.next(".select2").find(".select2-selection__rendered").text() || "");
    if (renderedText && renderedText !== "Select Learning Program" && renderedText !== "Select Grade") {
        return renderedText;
    }
    return "";
}

function parentDemoDataResolveGradeId(gradeValue, gradeName) {
    gradeValue = $.trim(gradeValue || "");
    gradeName = $.trim(gradeName || "");
    if (/^\d+$/.test(gradeValue)) {
        return parseInt(gradeValue, 10);
    }
    var gradeText = gradeName || gradeValue;
    if (typeof SCHOOL_STANDARD_GRADE_MASTER !== "undefined") {
        var matchedGrade = SCHOOL_STANDARD_GRADE_MASTER.find(function (grade) {
            return String(grade.key) === gradeValue || String(grade.value).toLowerCase() === gradeText.toLowerCase();
        });
        if (matchedGrade && matchedGrade.key) {
            return parseInt(matchedGrade.key, 10);
        }
    }
    return 0;
}

function parentDemoDataResolveGradeName(gradeId) {
    if (!gradeId || typeof SCHOOL_STANDARD_GRADE_MASTER === "undefined") {
        return "";
    }
    var matchedGrade = SCHOOL_STANDARD_GRADE_MASTER.find(function (grade) {
        return String(grade.key) === String(gradeId);
    });
    return matchedGrade ? matchedGrade.value : "";
}

function editParentDashboardDemoData(index) {
    var row = PARENT_DEMO_DATA_ROWS[index];
    if (!row) {
        return;
    }
    var form = $("#parentDemoDataForm");
    form.find("#demoDataId").val(row.id || "");
    parentDemoDataEnsureStudentOption(row.studentName || "");
    form.find("#studentName").val(row.studentName || "").trigger("change");
    form.find("#learningProgram").val(row.learningProgram || "").trigger("change");
    form.find("#gradeId").val(row.gradeId || "").trigger("change");
    parentDemoDataLoadCourses("parentDemoDataForm", [row.courseId || row.courseName || ""]);
    $("html, body").animate({ scrollTop: form.offset().top - 80 }, 300);
}

async function toggleParentDashboardDemoData(id, active) {
    var response = await getDashboardDataBasedUrlAndPayload(true, true, "parent-dashboard-demo-data/toggle", { id: id, active: active });
    if (response && response.status == "1") {
        loadParentDashboardDemoData();
    }
}

async function deleteParentDashboardDemoData(id) {
    if (!(await parentDemoDataConfirmDelete())) {
        return false;
    }
    var response = await getDashboardDataBasedUrlAndPayload(true, true, "parent-dashboard-demo-data/delete", { id: id });
    if (response && response.status == "1") {
        loadParentDashboardDemoData();
    }
}

async function deleteParentDashboardDemoDataGroup(index, src) {
    var groupedRows = parentDemoDataGroupRows(PARENT_DEMO_DATA_ROWS || []);
    var rowIndex = $.isNumeric(index) && groupedRows[index] ? index : -1;
    if (rowIndex < 0) {
        var button = src || (window.event && (window.event.currentTarget || window.event.target));
        rowIndex = button ? $(button).closest("tr").index() : -1;
    }
    var row = groupedRows[rowIndex];
    if (!row && src) {
        var buttonData = $(src).data();
        row = {
            recordIds: String(buttonData.recordIds || "").split(",").filter(function (id) { return $.trim(id); }),
            studentName: buttonData.studentName,
            learningProgram: buttonData.learningProgram,
            learningProgramName: buttonData.learningProgramName,
            gradeId: buttonData.gradeId,
            gradeName: buttonData.gradeName
        };
    }
    var recordIds = row && row.recordIds ? row.recordIds : [];
    if (!row) {
        showMessageTheme2(0, "Record not found.", "", true);
        return false;
    }
    if (!(await parentDemoDataConfirmDelete())) {
        return false;
    }
    if (recordIds.length === 0) {
        var groupResponse = await getDashboardDataBasedUrlAndPayload(true, true, "parent-dashboard-demo-data/delete-group", {
            studentName: row.studentName,
            learningProgram: row.learningProgram,
            learningProgramName: row.learningProgramName || row.learningProgram,
            gradeId: row.gradeId || null,
            gradeName: row.gradeName
        });
        if (groupResponse && groupResponse.status == "1") {
            loadParentDashboardDemoData();
        }
        return false;
    }
    for (var i = 0; i < recordIds.length; i++) {
        var response = await getDashboardDataBasedUrlAndPayload(true, true, "parent-dashboard-demo-data/delete", { id: recordIds[i] });
        if (!response || response.status != "1") {
            return false;
        }
    }
    loadParentDashboardDemoData();
}

function parentDemoDataConfirmDelete() {
    return new Promise(function (resolve) {
        var modal = $("#parentDemoDeleteConfirmModal");
        if (!modal.length || !$.fn.modal) {
            resolve(false);
            return;
        }
        var resolved = false;
        var complete = function (value) {
            if (resolved) {
                return;
            }
            resolved = true;
            modal.off(".parentDemoDelete");
            $("#parentDemoDeleteConfirmYes").off(".parentDemoDelete");
            modal.modal("hide");
            resolve(value);
        };
        $("#parentDemoDeleteConfirmYes").off(".parentDemoDelete").on("click.parentDemoDelete", function () {
            complete(true);
        });
        modal.off(".parentDemoDelete").on("hidden.bs.modal.parentDemoDelete", function () {
            complete(false);
        });
        modal.modal({ backdrop: "static", keyboard: true });
    });
}

function resetParentDashboardDemoDataForm() {
    $("#parentDemoDataForm #demoDataId").val("");
    $("#parentDemoDataForm #studentName").val("");
    $("#parentDemoDataForm #learningProgram").val("").trigger("change");
    parentDemoDataOnLearningProgramChange("parentDemoDataForm");
}

function parentDemoDataEnsureStudentOption(studentName) {
    $("#parentDemoDataForm #studentName").val($.trim(studentName || ""));
}

function resetParentDashboardDemoDataFilter() {
    $("#parentDemoDataFilterForm #filterStudentName").val("");
    $("#parentDemoDataFilterForm #filterLearningProgram").val("").trigger("change");
    $("#parentDemoDataFilterForm #filterGradeId").val("").trigger("change");
    loadParentDashboardDemoData();
}

function parentDemoDataEscape(value) {
    return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
