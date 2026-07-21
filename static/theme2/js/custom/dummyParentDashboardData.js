// var isDemoUser=true;
(function (window) {
    var DUMMY_PARENT_STUDENTS = [
        { userId: 990001, studentName: "Aarav Mehta", grade: "Grade 8", learningProgram: "ONE_TO_ONE" },
        { userId: 990002, studentName: "Anaya Mehta", grade: "Grade 5", learningProgram: "ONE_TO_ONE_FLEX" }
    ];
    var DUMMY_PARENT_TIMEZONES = ["America/New_York"];
    var DUMMY_PARENT_COUNTRY_ISO_CODES = ["US"];
    var DUMMY_MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var DUMMY_PARENT_SUMMARY = {
        990001: {
            totalCourses: 6,
            totalClassesThisMonth: 22,
            attendancePercentThisMonth: 96,
            attendanceDeltaFromLastMonth: 5,
            avgGradeLastMonth: 88,
            avgGradeThisMonth: 93,
            attendanceValues: [88, 90, 92, 94, 96, 0, 0, 0, 0, 0, 0, 0],
            gradeValues: [84, 86, 88, 90, 93, 0, 0, 0, 0, 0, 0, 0]
        },
        990002: {
            totalCourses: 5,
            totalClassesThisMonth: 18,
            attendancePercentThisMonth: 91,
            attendanceDeltaFromLastMonth: 3,
            avgGradeLastMonth: 84,
            avgGradeThisMonth: 89,
            attendanceValues: [82, 84, 86, 88, 91, 0, 0, 0, 0, 0, 0, 0],
            gradeValues: [78, 80, 82, 85, 89, 0, 0, 0, 0, 0, 0, 0]
        }
    };

    var DUMMY_PARENT_CLASS_SCHEDULE_ROWS = {
        990001: [
            { type: "CLASS", courseName: "Pre-Algebra Live Class", teacherName: "Olivia Parker", teacherGender: "FEMALE", offsetMinutes: -90, duration: 45, attendance: "Attended", hasFeedback: true },
            { type: "ACTIVITY", courseName: "Reading Club Activity", teacherName: "Daniel Carter", teacherGender: "MALE", offsetMinutes: 90, duration: 45, attendance: "N/A", hasFeedback: false },
            { type: "CLASS", courseName: "World History Class", teacherName: "Sophia Williams", teacherGender: "FEMALE", offsetMinutes: 180, duration: 45, attendance: "N/A", hasFeedback: false }
        ],
        990002: [
            { type: "CLASS", courseName: "Mathematics Practice Class", teacherName: "Emma Johnson", teacherGender: "FEMALE", offsetMinutes: -60, duration: 40, attendance: "Attended", hasFeedback: false },
            { type: "ACTIVITY", courseName: "Science Discovery Activity", teacherName: "Ethan Brooks", teacherGender: "MALE", offsetMinutes: 75, duration: 40, attendance: "N/A", hasFeedback: false },
            { type: "CLASS", courseName: "Creative Writing Class", teacherName: "Ava Thompson", teacherGender: "FEMALE", offsetMinutes: 165, duration: 40, attendance: "N/A", hasFeedback: false }
        ]
    };
    var DUMMY_PARENT_DIARY_THREADS = {};
    var DUMMY_PARENT_DIARY_MESSAGES = {};
    var DUMMY_PARENT_DB_DATA_LOADED = false;
    var DUMMY_PARENT_DB_DATA_LOADING = null;
    var DUMMY_PARENT_DB_ROWS = [];
    var DUMMY_PARENT_FEED_USER_IDS = [];
    var DUMMY_PARENT_SELECTED_FEED_USER_ID = "";
    var DUMMY_PARENT_REQUESTED_ACTIVE_STUDENT_ID = "";
    var DUMMY_PARENT_ACTIVE_STUDENT_HOOKED = false;
    var DUMMY_PARENT_ACTIVE_STUDENT_TIMER = null;
    var DUMMY_PARENT_TEACHERS = [
        { teacherName: "Olivia Parker", teacherGender: "FEMALE" },
        { teacherName: "Daniel Carter", teacherGender: "MALE" },
        { teacherName: "Sophia Williams", teacherGender: "FEMALE" },
        { teacherName: "Emma Johnson", teacherGender: "FEMALE" },
        { teacherName: "Ethan Brooks", teacherGender: "MALE" },
        { teacherName: "Ava Thompson", teacherGender: "FEMALE" }
    ];
    var DUMMY_PARENT_FEE_STRUCTURE = {
        Kindergarten: { group: [1186, 627, 627], oneToOne: [1470, 840, 840], installment: { group: 2440, oneToOne: 3150 }, lumpsum: { group: 2140, oneToOne: 2750 } },
        "Grade 1": { group: [1186, 627, 627], oneToOne: [1470, 840, 840], installment: { group: 2440, oneToOne: 3150 }, lumpsum: { group: 2140, oneToOne: 2750 } },
        "Grade 2": { group: [1186, 627, 627], oneToOne: [1470, 840, 840], installment: { group: 2440, oneToOne: 3150 }, lumpsum: { group: 2140, oneToOne: 2750 } },
        "Grade 3": { group: [1186, 627, 627], oneToOne: [1470, 840, 840], installment: { group: 2440, oneToOne: 3150 }, lumpsum: { group: 2140, oneToOne: 2750 } },
        "Grade 4": { group: [1186, 627, 627], oneToOne: [1470, 840, 840], installment: { group: 2440, oneToOne: 3150 }, lumpsum: { group: 2140, oneToOne: 2750 } },
        "Grade 5": { group: [1186, 627, 627], oneToOne: [1470, 840, 840], installment: { group: 2440, oneToOne: 3150 }, lumpsum: { group: 2140, oneToOne: 2750 } },
        "Grade 6": { group: [1330, 735, 735], oneToOne: [1690, 1005, 1005], installment: { group: 2800, oneToOne: 3700 }, lumpsum: { group: 2500, oneToOne: 3250 } },
        "Grade 7": { group: [1330, 735, 735], oneToOne: [1690, 1005, 1005], installment: { group: 2800, oneToOne: 3700 }, lumpsum: { group: 2500, oneToOne: 3250 } },
        "Grade 8": { group: [1330, 735, 735], oneToOne: [1690, 1005, 1005], installment: { group: 2800, oneToOne: 3700 }, lumpsum: { group: 2500, oneToOne: 3250 } },
        "Grade 9": { group: [1810, 1095, 1095], oneToOne: [2190, 1380, 1380], installment: { group: 4000, oneToOne: 4950 }, lumpsum: { group: 3700, oneToOne: 4550 } },
        "Grade 10": { group: [1810, 1095, 1095], oneToOne: [2190, 1380, 1380], installment: { group: 4000, oneToOne: 4950 }, lumpsum: { group: 3700, oneToOne: 4550 } },
        "Grade 11": { group: [1820, 1102.5, 1102.5], oneToOne: [2190, 1380, 1380], installment: { group: 4025, oneToOne: 4950 }, lumpsum: { group: 3725, oneToOne: 4550 } },
        "Grade 12": { group: [1830, 1110, 1110], oneToOne: [2190, 1380, 1380], installment: { group: 4050, oneToOne: 4950 }, lumpsum: { group: 3750, oneToOne: 4550 } }
    };

    function getQueryParam(name) {
        try {
            return new URLSearchParams(window.location.search || "").get(name);
        } catch (e) {
            return "";
        }
    }

    function isYes(value) {
        return value === true || value === "Y" || value === "y" || value === "1" || value === "true" || value === "TRUE";
    }

    function getImagePath(fileName) {
        return (typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2 : "") + fileName;
    }

    function getDummyTimezone(studentUserId) {
        for (var i = 0; i < DUMMY_PARENT_STUDENTS.length; i++) {
            if (String(DUMMY_PARENT_STUDENTS[i].userId) === String(studentUserId)) {
                return DUMMY_PARENT_TIMEZONES[i % DUMMY_PARENT_TIMEZONES.length];
            }
        }
        return DUMMY_PARENT_TIMEZONES[0];
    }

    function getDummyCountryISOCode(studentUserId) {
        for (var i = 0; i < DUMMY_PARENT_STUDENTS.length; i++) {
            if (String(DUMMY_PARENT_STUDENTS[i].userId) === String(studentUserId)) {
                return DUMMY_PARENT_COUNTRY_ISO_CODES[i % DUMMY_PARENT_COUNTRY_ISO_CODES.length];
            }
        }
        return DUMMY_PARENT_COUNTRY_ISO_CODES[0];
    }

    function twoDigits(value) {
        return value < 10 ? "0" + value : "" + value;
    }

    function formatDate(date) {
        return date.getFullYear() + "-" + twoDigits(date.getMonth() + 1) + "-" + twoDigits(date.getDate());
    }

    function formatDisplayDate(date) {
        return typeof moment === "function" ? moment(date).format("MMM DD, YYYY") : date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
    }

    function formatDateTime(date) {
        return formatDate(date) + " " + twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()) + ":" + twoDigits(date.getSeconds());
    }

    function addDays(date, days) {
        var nextDate = new Date(date.getTime());
        nextDate.setDate(nextDate.getDate() + days);
        return nextDate;
    }

    function addMinutes(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    }

    function getDummyBaseDate() {
        var dummyDate = getQueryParam("dummyDate");
        var now = new Date();

        if (!dummyDate) {
            return now;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(dummyDate)) {
            var parts = dummyDate.split("-");
            return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), now.getHours(), now.getMinutes(), now.getSeconds());
        }

        var parsedDate = new Date(dummyDate);
        return isNaN(parsedDate.getTime()) ? now : parsedDate;
    }

    function getDummyStudent(studentUserId) {
        for (var i = 0; i < DUMMY_PARENT_STUDENTS.length; i++) {
            if (String(DUMMY_PARENT_STUDENTS[i].userId) === String(studentUserId)) {
                return DUMMY_PARENT_STUDENTS[i];
            }
        }
        return DUMMY_PARENT_STUDENTS[0];
    }

    function getDummyClassRows(studentUserId) {
        var activeStudentId = typeof ACTIVE_STUDENT_ID !== "undefined" ? ACTIVE_STUDENT_ID : "";
        var student = getDummyStudent(studentUserId || activeStudentId);
        return DUMMY_PARENT_CLASS_SCHEDULE_ROWS[student.userId] || DUMMY_PARENT_CLASS_SCHEDULE_ROWS[990001];
    }

    async function hydrateDummyParentDataFromDb() {
        if (!window.isDummyParentDashboardMode || !window.isDummyParentDashboardMode()) {
            return;
        }
        if (DUMMY_PARENT_DB_DATA_LOADED) {
            return;
        }
        if (DUMMY_PARENT_DB_DATA_LOADING) {
            return DUMMY_PARENT_DB_DATA_LOADING;
        }
        DUMMY_PARENT_DB_DATA_LOADING = (async function () {
            try {
                const [type, entityId, counselorUserId] = DEMO_DASHBOARD_USER.split("|");
                var response = await callCommonAjax({
                    method: "POST",
                    url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/demo-data",
                    body: {
                        userId: USER_ID,
                        demoFeedUserId: counselorUserId
                    },
                    global: false,
                    showMessage: false,
                    onFaildResolved: true,
                    onSuccessResolved: true
                });
                if (response && response.status == "1" && response.details && response.details.length > 0) {
                    DUMMY_PARENT_DB_ROWS = response.details;
                    DUMMY_PARENT_FEED_USER_IDS = getDummyParentFeedUserIds(DUMMY_PARENT_DB_ROWS);
                    if (!DUMMY_PARENT_SELECTED_FEED_USER_ID) {
                        DUMMY_PARENT_SELECTED_FEED_USER_ID = getQueryParam("demoFeedUserId") || localStorage.getItem("PARENT_DEMO_FEED_USER_ID") || "";
                    }
                    if (DUMMY_PARENT_FEED_USER_IDS.length > 0 && DUMMY_PARENT_FEED_USER_IDS.indexOf(String(DUMMY_PARENT_SELECTED_FEED_USER_ID)) === -1) {
                        DUMMY_PARENT_SELECTED_FEED_USER_ID = DUMMY_PARENT_FEED_USER_IDS[0];
                    }
                    applyDbDummyParentRows(getSelectedDummyParentRows());
                }
            } catch (e) {
                console.warn("Unable to load parent dashboard demo data", e);
            } finally {
                DUMMY_PARENT_DB_DATA_LOADED = true;
                DUMMY_PARENT_DB_DATA_LOADING = null;
            }
        })();
        return DUMMY_PARENT_DB_DATA_LOADING;
    }

    function getDummyParentFeedUserIds(rows) {
        var map = {};
        var userIds = [];
        (rows || []).forEach(function (row) {
            var userId = String(row.userId || row.createdBy || "").trim();
            if (userId && !map[userId]) {
                map[userId] = true;
                userIds.push(userId);
            }
        });
        return userIds;
    }

    function escapeDummyParentHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function cleanDummyParentCourseName(courseName) {
        var cleaned = String(courseName || "")
            .replace(/\bv\d+(?:[._-]\d+)*\b/gi, " ")
            .replace(/\s*\((?:BUZZ(?:-[A-Z]+)?|GS|Honors?|Advanced|Standard|Regular)\)\s*/gi, " ")
            .replace(/\s+Live Class$/i, "")
            .replace(/\s+Class$/i, "")
            .replace(/\s+Activity$/i, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        var name = cleaned.toLowerCase();
        if (/(english|language\s*arts|reading|writing|literature)/i.test(name)) return "Language Arts";
        if (/(math|algebra|geometry|calculus|trigonometry|statistics|pre-?calculus|pre-?algebra)/i.test(name)) return "Mathematics";
        if (/(science|biology|physics|chemistry|environmental|earth|space|marine|anatomy|physiology)/i.test(name)) return "Science";
        if (/(technology|computer|coding|programming|cybersecurity|information\s*technology|multimedia|web)/i.test(name)) return "Technology";
        if (/(fine\s*arts?|visual\s*arts?|painting|drawing|music|theatre|drama|graphic\s*design)/i.test(name)) return "Art";
        if (/(history|geography|social\s*studies|social\s*science|government|civics|economics|political)/i.test(name)) return "Social Studies";
        if (/(physical\s*education|physical\s*fitness|\bpe\b|health)/i.test(name)) return "Physical Education";
        return cleaned;
    }

    function getSelectedDummyParentRows() {
        if (!DUMMY_PARENT_SELECTED_FEED_USER_ID) {
            return DUMMY_PARENT_DB_ROWS;
        }
        return (DUMMY_PARENT_DB_ROWS || []).filter(function (row) {
            return String(row.userId || row.createdBy || "").trim() === String(DUMMY_PARENT_SELECTED_FEED_USER_ID);
        });
    }

    function resetDefaultDummyParentRows() {
        DUMMY_PARENT_STUDENTS = [
            { userId: 990001, studentName: "Aarav Mehta", grade: "Grade 8", learningProgram: "ONE_TO_ONE" },
            { userId: 990002, studentName: "Anaya Mehta", grade: "Grade 5", learningProgram: "ONE_TO_ONE_FLEX" }
        ];
        DUMMY_PARENT_SUMMARY = {
            990001: {
                totalCourses: 6,
                totalClassesThisMonth: 22,
                attendancePercentThisMonth: 96,
                attendanceDeltaFromLastMonth: 5,
                avgGradeLastMonth: 88,
                avgGradeThisMonth: 93,
                attendanceValues: [88, 90, 92, 94, 96, 95, 96, 0, 0, 0, 0, 0],
                gradeValues: [84, 86, 88, 90, 93, 94, 93, 0, 0, 0, 0, 0]
            },
            990002: {
                totalCourses: 5,
                totalClassesThisMonth: 18,
                attendancePercentThisMonth: 91,
                attendanceDeltaFromLastMonth: 3,
                avgGradeLastMonth: 84,
                avgGradeThisMonth: 89,
                attendanceValues: [82, 84, 86, 88, 91, 90, 92, 0, 0, 0, 0, 0],
                gradeValues: [78, 80, 82, 85, 89, 90, 89, 0, 0, 0, 0, 0]
            }
        };
        DUMMY_PARENT_CLASS_SCHEDULE_ROWS = {
            990001: [
                { type: "CLASS", courseName: "Pre-Algebra Live Class", teacherName: "Olivia Parker", teacherGender: "FEMALE", offsetMinutes: -90, duration: 45, attendance: "Attended", hasFeedback: true },
                { type: "ACTIVITY", courseName: "Reading Club Activity", teacherName: "Daniel Carter", teacherGender: "MALE", offsetMinutes: 90, duration: 45, attendance: "N/A", hasFeedback: false },
                { type: "CLASS", courseName: "World History Class", teacherName: "Sophia Williams", teacherGender: "FEMALE", offsetMinutes: 180, duration: 45, attendance: "N/A", hasFeedback: false }
            ],
            990002: [
                { type: "CLASS", courseName: "Mathematics Practice Class", teacherName: "Emma Johnson", teacherGender: "FEMALE", offsetMinutes: -60, duration: 40, attendance: "Attended", hasFeedback: false },
                { type: "ACTIVITY", courseName: "Science Discovery Activity", teacherName: "Ethan Brooks", teacherGender: "MALE", offsetMinutes: 75, duration: 40, attendance: "N/A", hasFeedback: false },
                { type: "CLASS", courseName: "Creative Writing Class", teacherName: "Ava Thompson", teacherGender: "FEMALE", offsetMinutes: 165, duration: 40, attendance: "N/A", hasFeedback: false }
            ]
        };
        buildDummyDiaryData();
    }

    function applyDbDummyParentRows(rows) {
        resetDefaultDummyParentRows();
        var studentMap = {};
        var students = [];
        var schedules = {};
        var summaries = {};
        var courseSeenByStudent = {};

        rows.forEach(function (row) {
            var studentName = $.trim(row.studentName || "");
            if (!studentName) {
                return;
            }
            var gradeName = row.gradeName || row.grade || "";
            var learningProgram = row.learningProgramName || row.learningProgram || "";
            var key = studentName.toLowerCase() + "|" + gradeName.toLowerCase() + "|" + learningProgram.toLowerCase();
            if (!studentMap[key]) {
                var userId = 990000 + students.length + 1;
                studentMap[key] = {
                    userId: userId,
                    studentName: studentName,
                    grade: gradeName,
                    standardName: gradeName,
                    learningProgram: learningProgram
                };
                students.push(studentMap[key]);
                schedules[userId] = [];
                summaries[userId] = getGeneratedSummary(students.length - 1);
                courseSeenByStudent[userId] = {};
            }
            var student = studentMap[key];
            var displayCourseName = cleanDummyParentCourseName(row.courseName || "");
            var displayCourseKey = displayCourseName.toLowerCase();
            if (!displayCourseName || courseSeenByStudent[student.userId][displayCourseKey]) {
                return;
            }
            courseSeenByStudent[student.userId][displayCourseKey] = true;
            var courseIndex = schedules[student.userId].length;
            var teacher = DUMMY_PARENT_TEACHERS[courseIndex % DUMMY_PARENT_TEACHERS.length];
            schedules[student.userId].push({
                type: normalizeDemoType(row.type),
                courseName: displayCourseName,
                teacherName: teacher.teacherName,
                teacherGender: teacher.teacherGender,
                offsetMinutes: courseIndex === 0 ? -90 : 75 + (courseIndex * 45),
                duration: courseIndex % 2 === 0 ? 45 : 40,
                attendance: courseIndex === 0 ? "Attended" : "N/A",
                hasFeedback: courseIndex === 0
            });
        });

        if (students.length > 0) {
            students.forEach(function (student) {
                var totalCourses = schedules[student.userId].length;
                summaries[student.userId].totalCourses = totalCourses;
                summaries[student.userId].totalClassesThisMonth = Math.max(totalCourses * 4, totalCourses);
            });
            DUMMY_PARENT_STUDENTS = students;
            DUMMY_PARENT_CLASS_SCHEDULE_ROWS = schedules;
            DUMMY_PARENT_SUMMARY = summaries;
            buildDummyDiaryData();
        }
    }

    function normalizeDemoType(type) {
        type = String(type || "").toUpperCase();
        if (type === "ACTIVITY" || type === "COURSE") {
            return type;
        }
        return "CLASS";
    }

    function getGeneratedSummary(index) {
        var attendance = Math.max(82, 96 - (index * 3));
        var grade = Math.max(78, 93 - (index * 4));
        return {
            totalCourses: 4 + index,
            totalClassesThisMonth: 18 + (index * 2),
            attendancePercentThisMonth: attendance,
            attendanceDeltaFromLastMonth: 3 + index,
            avgGradeLastMonth: grade - 4,
            avgGradeThisMonth: grade,
            attendanceValues: [attendance - 8, attendance - 6, attendance - 4, attendance - 2, attendance - 1, attendance, attendance + 1, 0, 0, 0, 0, 0],
            gradeValues: [grade - 9, grade - 7, grade - 5, grade - 3, grade - 1, grade, grade, 0, 0, 0, 0, 0]
        };
    }

    function getMonthRows(values, valueKey) {
        var year = getDummyBaseDate().getFullYear();
        var rows = [];

        var currentMonthIndex = getDummyBaseDate().getMonth();
        for (var i = 0; i <= currentMonthIndex; i++) {
            var row = { monthKey: year + "-" + twoDigits(i + 1) };
            row[valueKey] = values[i];
            rows.push(row);
        }

        return rows;
    }

    function getDummyAttendanceOverviewRows(values) {
        var rows = [];

        for (var i = 0; i < 12; i++) {
            rows.push({
                monthKey: "2026-" + twoDigits(i + 1),
                monthLabel: DUMMY_MONTH_LABELS[i],
                attendancePercent: values[i] || 0
            });
        }

        return rows;
    }

    function getDummyStudentBasicDetails() {
        return DUMMY_PARENT_STUDENTS.map(function (student) {
            return {
                userId: student.userId,
                studentName: student.studentName,
                standardName: student.standardName || student.grade,
                profilePic: getImagePath("user.png"),
                studentTimezone: getDummyTimezone(student.userId),
                countryISOCode: getDummyCountryISOCode(student.userId)
            };
        });
    }

    function getDummyReceiptStudentCode(student) {
        if (String(student.userId) === "990001") {
            return "US260529001";
        }
        if (String(student.userId) === "990002") {
            return "US260529002";
        }
        return "US" + String(student.userId || "").replace(/\D/g, "").slice(-9);
    }

    function getDummyReceiptLearningPlan(student) {
        var learningProgram = student.learningProgramName || student.learningProgram || "";
        var map = {
            ONE_TO_ONE: "One-to-One Learning",
            ONE_TO_ONE_FLEX: "Flexy Program",
            BATCH: "Batch Learning"
        };
        return map[learningProgram] || learningProgram || "One-to-One Learning";
    }

    function getDummyFeeGradeName(gradeName) {
        gradeName = $.trim(String(gradeName || ""));
        if (/kindergarten|grade\s*kg|^kg$/i.test(gradeName)) {
            return "Kindergarten";
        }
        var match = gradeName.match(/(\d{1,2})/);
        return match ? "Grade " + parseInt(match[1], 10) : "Grade 5";
    }

    function getDummyFeeProgramKey(student) {
        var learningProgram = String(student.learningProgramName || student.learningProgram || "").toLowerCase();
        if (learningProgram.indexOf("group") >= 0 || learningProgram.indexOf("batch") >= 0) {
            return "group";
        }
        return "oneToOne";
    }

    function getDummyFeePlan(student) {
        var gradeName = getDummyFeeGradeName(student.standardName || student.grade);
        var feeStructure = DUMMY_PARENT_FEE_STRUCTURE[gradeName] || DUMMY_PARENT_FEE_STRUCTURE["Grade 5"];
        var programKey = getDummyFeeProgramKey(student);
        var amounts = feeStructure[programKey] || feeStructure.oneToOne;
        return {
            gradeName: gradeName,
            programKey: programKey,
            monthAmounts: amounts,
            installmentTotal: feeStructure.installment[programKey],
            lumpsumTotal: feeStructure.lumpsum[programKey]
        };
    }

    function getDummyInstallmentPaymentName(gradeName, installmentIndex) {
        var labels = ["1st", "2nd", "3rd"];
        return gradeName + " - " + (labels[installmentIndex] || (installmentIndex + 1) + "th") + " of 3 Months Installment";
    }

    function getDummyReceiptNumber(paymentId, paidDate) {
        var date = paidDate || getDummyBaseDate();
        var datePart = typeof moment === "function" ? moment(date).format("YYMMDD") : formatDate(date instanceof Date ? date : new Date(date)).replace(/-/g, "").slice(2);
        var digits = String(paymentId || "").replace(/\D/g, "");
        return "REF" + datePart + (digits.slice(0, 4) || "0000") + "_" + (digits.slice(-5) || "00000");
    }

    function getDummyReceiptCountryCity(studentUserId) {
        return getDummyCountryISOCode(studentUserId) === "US" ? "United States | New York" : "India | Delhi";
    }

    function getDummyReceiptCourses(studentUserId) {
        var rows = DUMMY_PARENT_CLASS_SCHEDULE_ROWS[studentUserId] || [];
        var courses = [];
        var seen = {};
        rows.forEach(function (row) {
            var courseName = String(row.courseName || "")
                .replace(/\s+Live Class$/i, "")
                .replace(/\s+Class$/i, "")
                .replace(/\s+Activity$/i, "");
            var key = courseName.toLowerCase();
            if (courseName && !seen[key]) {
                seen[key] = true;
                courses.push(courseName + " (1.0 Credit)");
            }
        });
        return courses;
    }

    function getDummyReceiptSchedule(feePlan, paidIndex, paymentName) {
        return [
            [paymentName || getDummyInstallmentPaymentName(feePlan.gradeName, 0), feePlan.monthAmounts[0], paidIndex >= 0 ? "RECEIVED" : "PENDING"],
            [getDummyInstallmentPaymentName(feePlan.gradeName, 1), feePlan.monthAmounts[1], paidIndex >= 1 ? "RECEIVED" : "PENDING"],
            [getDummyInstallmentPaymentName(feePlan.gradeName, 2), feePlan.monthAmounts[2], paidIndex >= 2 ? "RECEIVED" : "PENDING"]
        ];
    }

    function saveDummyReceiptData(paymentId, receiptData) {
        try {
            var allReceipts = JSON.parse(localStorage.getItem("PARENT_DEMO_RECEIPT_DATA_BY_PAYMENT_ID") || "{}");
            allReceipts[String(paymentId)] = receiptData;
            localStorage.setItem("PARENT_DEMO_RECEIPT_DATA_BY_PAYMENT_ID", JSON.stringify(allReceipts));
        } catch (e) {
            console.warn("Unable to save dummy parent receipt data", e);
        }
    }

    function getDummyReceiptData(student, payment, paidOn) {
        var courses = getDummyReceiptCourses(student.userId);
        var feePlan = payment.feePlan || getDummyFeePlan(student);
        var totalFee = feePlan.installmentTotal;

        return {
            studentName: student.studentName,
            studentCode: getDummyReceiptStudentCode(student),
            countryCity: getDummyReceiptCountryCity(student.userId),
            learningPlan: getDummyReceiptLearningPlan(student),
            grade: student.standardName || student.grade,
            parentName: typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME ? USER_FULL_NAME : "Demo Parent",
            location: getDummyReceiptCountryCity(student.userId).replace(" | ", ", "),
            feeFor: payment.paymentName || getDummyInstallmentPaymentName(feePlan.gradeName, payment.installmentIndex || 0),
            receiptNo: getDummyReceiptNumber(payment.id, payment.payDate || getDummyBaseDate()),
            paidOn: paidOn,
            totalFee: totalFee,
            feeAmount: totalFee,
            courses: courses,
            schedule: getDummyReceiptSchedule(feePlan, payment.installmentIndex || 0, payment.paymentName)
        };
    }

    function normalizeCompareValue(value) {
        return $.trim(String(value || "")).toLowerCase();
    }

    function getDummyParentRequestedStudentId() {
        var requestedStudentName = normalizeCompareValue(getQueryParam("demoStudentName"));
        var requestedLearningProgram = normalizeCompareValue(getQueryParam("demoLearningProgramName") || getQueryParam("demoLearningProgram"));
        var requestedGradeName = normalizeCompareValue(getQueryParam("demoGradeName"));

        if (!requestedStudentName) {
            return "";
        }

        for (var i = 0; i < DUMMY_PARENT_STUDENTS.length; i++) {
            var student = DUMMY_PARENT_STUDENTS[i];
            var studentName = normalizeCompareValue(student.studentName);
            var studentLearningProgram = normalizeCompareValue(student.learningProgramName || student.learningProgram);
            var studentGradeName = normalizeCompareValue(student.standardName || student.grade);

            if (studentName !== requestedStudentName) {
                continue;
            }
            if (requestedLearningProgram && studentLearningProgram !== requestedLearningProgram) {
                continue;
            }
            if (requestedGradeName && studentGradeName !== requestedGradeName) {
                continue;
            }
            return student.userId;
        }

        return "";
    }

    function installDummyParentActiveStudentHook() {
        if (DUMMY_PARENT_ACTIVE_STUDENT_HOOKED || typeof window.getStudentDetailsByStudentID !== "function") {
            return;
        }
        var originalGetStudentDetailsByStudentID = window.getStudentDetailsByStudentID;
        var dummyParentGetStudentDetailsByStudentID = async function (studentUserId) {
            return await originalGetStudentDetailsByStudentID.apply(this, arguments);
        };
        window.getStudentDetailsByStudentID = dummyParentGetStudentDetailsByStudentID;
        try {
            getStudentDetailsByStudentID = dummyParentGetStudentDetailsByStudentID;
        } catch (e) {
            console.warn("Unable to bind dummy parent active student hook", e);
        }
        DUMMY_PARENT_ACTIVE_STUDENT_HOOKED = true;
    }

    function scheduleRequestedDummyParentStudentActivation() {
        var requestedStudentId = DUMMY_PARENT_REQUESTED_ACTIVE_STUDENT_ID || getDummyParentRequestedStudentId();
        if (!requestedStudentId) {
            return;
        }
        if (DUMMY_PARENT_ACTIVE_STUDENT_TIMER) {
            clearTimeout(DUMMY_PARENT_ACTIVE_STUDENT_TIMER);
        }
        DUMMY_PARENT_ACTIVE_STUDENT_TIMER = setTimeout(async function () {
            try {
                if (window.isDummyParentDashboardMode && window.isDummyParentDashboardMode()
                    && typeof getStudentDetailsByStudentID === "function"
                    && String(ACTIVE_STUDENT_ID || "") !== String(requestedStudentId)) {
                    await getStudentDetailsByStudentID(requestedStudentId);
                }
            } catch (e) {
                console.warn("Unable to activate requested dummy parent student", e);
            }
        }, 250);
    }

    function getDummyOverview(studentUserId) {
        var student = getDummyStudent(studentUserId);
        var summary = DUMMY_PARENT_SUMMARY[student.userId] || DUMMY_PARENT_SUMMARY[990001];

        return {
            status: 1,
            details: {
                activitiesWithClass: true,
                student: {
                    userId: student.userId,
                    studentName: student.studentName,
                    profilePic: getImagePath("user.png"),
                    lastActive: "Today",
                    grade: student.grade,
                    learningProgram: student.learningProgram
                },
                summary: {
                    totalCourses: summary.totalCourses,
                    totalClassesThisMonth: summary.totalClassesThisMonth,
                    attendancePercentThisMonth: summary.attendancePercentThisMonth,
                    attendanceDeltaFromLastMonth: summary.attendanceDeltaFromLastMonth,
                    avgGradeLastMonth: summary.avgGradeLastMonth,
                    avgGradeThisMonth: summary.avgGradeThisMonth
                },
                attendanceOverview: getMonthRows(summary.attendanceValues, "attendancePercent"),
                gradeOverview: getMonthRows(summary.gradeValues, "averagePercentage")
            }
        };
    }

    function getDummySchedule(studentUserId) {
        var baseDate = getDummyBaseDate();
        var icon = getImagePath("Icon/sidebar/Examination_Schedule_icon.png");
        var rows = getDummyClassRows(studentUserId);
        var schedule = [];

        for (var i = 0; i < Math.min(rows.length, 3); i++) {
            var startOffset = i === 0 ? -15 : 120 + ((i - 1) * 120);
            schedule.push({
                courseName: rows[i].courseName,
                start: formatDateTime(addMinutes(baseDate, startOffset)),
                end: formatDateTime(addMinutes(baseDate, startOffset + rows[i].duration)),
                timezone: getDummyTimezone(studentUserId),
                icon: icon,
                classStatus: i === 0 ? "In Progress" : "Not Started"
            });
        }

        return {
            status: 1,
            details: {
                schedule: schedule
            }
        };
    }

    function getDummyFeeDetails(studentUserId) {
        debugger
        var baseDate = getDummyBaseDate();
        var student = getDummyStudent(studentUserId);
        var gradeName = student.grade;
        var feePlan = getDummyFeePlan(student);
        var feeRows = [
            {
                paymentName: getDummyInstallmentPaymentName(gradeName, 0),
                scheduledPayDate: formatDisplayDate(baseDate),
                payDate: formatDisplayDate(baseDate),
                status: "SUCCESS",
                amount: feePlan.monthAmounts[0],
                paymentTitle: "TUITION_FEE"
            },
            {
                paymentName: getDummyInstallmentPaymentName(gradeName, 1),
                scheduledPayDate: formatDisplayDate(addDays(baseDate, 30)),
                payDate: formatDisplayDate(baseDate),
                status: "SUCCESS",
                amount: feePlan.monthAmounts[1],
                paymentTitle: "TUITION_FEE"
            },
            {
                paymentName: getDummyInstallmentPaymentName(gradeName, 2),
                scheduledPayDate: formatDisplayDate(addDays(baseDate, 60)),
                payDate: formatDisplayDate(baseDate),
                status: "SUCCESS",
                amount: feePlan.monthAmounts[2],
                paymentTitle: "TUITION_FEE"
            }
        ];
        var paymentList = [];

        for (var i = 0; i < feeRows.length; i++) {
            var paymentId = 960001 + student.userId + i;
            var paidOn = moment(feeRows[i].payDate, "MMM DD, YYYY").format("MMM DD, YYYY 11:00 AM");
            var payment = {
                id: paymentId,
                scheduledPayDate: feeRows[i].scheduledPayDate,
                standardName: gradeName,
                paymentName: feeRows[i].paymentName,
                totalFeeWithMaterialFee: feeRows[i].amount,
                payAmount: feeRows[i].amount,
                payDate: feeRows[i].payDate,
                status: feeRows[i].status,
                paymentTitle: feeRows[i].paymentTitle,
                paymentTransferType: 1,
                pgName: "Stripe",
                installmentIndex: i,
                feePlan: feePlan
            };
            payment.recieptLink = getDummyReceiptUrl(student.userId, paymentId, feeRows[i].payDate);
            saveDummyReceiptData(paymentId, getDummyReceiptData(student, payment, paidOn));
            paymentList.push({
                id: payment.id,
                scheduledPayDate: payment.scheduledPayDate,
                standardName: payment.standardName,
                paymentName: payment.paymentName,
                totalFeeWithMaterialFee: payment.totalFeeWithMaterialFee,
                payAmount: payment.payAmount,
                payDate: payment.payDate,
                status: payment.status,
                dummyStatusLabel: "PAID",
                paymentTitle: payment.paymentTitle,
                paymentTransferType: payment.paymentTransferType,
                pgName: payment.pgName,
                recieptLink: payment.recieptLink
            });
        }

        return {
            status: 1,
            details: {
                nextUserPaymentDetailsId: paymentList[0].id,
                userPaymentDetailsList: paymentList
            }
        };
    }

    function getDummyReceiptUrl(studentUserId, paymentId, paidDate) {
        // var basePath = typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2.replace(/images\/?$/, "") : "static/theme2/";
        var basePath = APP_BASE_URL+'static/theme2/';
        return basePath + "dummy-parent-fee-receipt.html?studentId=" + encodeURIComponent(studentUserId) + "&paymentId=" + encodeURIComponent(paymentId) + "&paidOn=" + encodeURIComponent(moment(paidDate, "MMM DD, YYYY").format("MMM DD, YYYY 11:00 AM"));
    }

    function buildDummyDiaryData() {
        DUMMY_PARENT_DIARY_THREADS = {};
        DUMMY_PARENT_DIARY_MESSAGES = {};
        var baseDate = moment(getDummyBaseDate());
        DUMMY_PARENT_STUDENTS.forEach(function (student, studentIndex) {
            var courseRows = DUMMY_PARENT_CLASS_SCHEDULE_ROWS[student.userId] || [];
            var teacherCourse = courseRows[0] || { courseName: "Language Arts", teacherName: "Olivia Parker", teacherGender: "FEMALE" };
            var schoolThreadId = "dummy-school-" + student.userId;
            var teacherThreadId = "dummy-teacher-" + student.userId;
            DUMMY_PARENT_DIARY_THREADS[student.userId] = [
                {
                    threadId: teacherThreadId,
                    studentUserId: student.userId,
                    studentName: student.studentName,
                    teacherName: teacherCourse.teacherName,
                    teacherGender: teacherCourse.teacherGender,
                    chatWithRole: "TEACHER",
                    latestMessage: "Great focus in today's " + cleanDummyParentCourseName(teacherCourse.courseName) + " session.",
                    unreadCount: studentIndex === 0 ? 1 : 0,
                    profilePic: "",
                    learningProgram: student.learningProgram,
                    threadStatus: "OPEN"
                },
                {
                    threadId: schoolThreadId,
                    studentUserId: student.userId,
                    studentName: student.studentName,
                    teacherName: "School Office",
                    teacherGender: "",
                    chatWithRole: "SCHOOL",
                    latestMessage: "Monthly progress review has been updated for " + student.studentName + ".",
                    unreadCount: 0,
                    profilePic: "",
                    learningProgram: student.learningProgram,
                    threadStatus: "OPEN"
                }
            ];
            DUMMY_PARENT_DIARY_MESSAGES[teacherThreadId] = {
                courseName: cleanDummyParentCourseName(teacherCourse.courseName),
                messages: [
                    {
                        id: teacherThreadId + "-1",
                        senderRole: "TEACHER",
                        senderName: teacherCourse.teacherName,
                        teacherName: teacherCourse.teacherName,
                        teacherGender: teacherCourse.teacherGender,
                        senderGender: teacherCourse.teacherGender,
                        message: "Hello, " + student.studentName + " participated well and completed the warm-up activity on time.",
                        createdAt: baseDate.clone().subtract(2, "days").hour(15).minute(20).second(0).toISOString(),
                        mentions: []
                    },
                    {
                        id: teacherThreadId + "-2",
                        senderRole: "PARENT",
                        senderName: typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME ? USER_FULL_NAME : "Demo Parent",
                        message: "Thank you for the update. We will revise the practice worksheet tonight.",
                        createdAt: baseDate.clone().subtract(1, "days").hour(19).minute(5).second(0).toISOString(),
                        mentions: [{ userName: teacherCourse.teacherName, roleType: "TEACHER" }]
                    },
                    {
                        id: teacherThreadId + "-3",
                        senderRole: "TEACHER",
                        senderName: teacherCourse.teacherName,
                        teacherName: teacherCourse.teacherName,
                        teacherGender: teacherCourse.teacherGender,
                        senderGender: teacherCourse.teacherGender,
                        message: "Great. Please keep the notebook ready for the next live class.",
                        createdAt: baseDate.clone().hour(10).minute(15).second(0).toISOString(),
                        mentions: []
                    }
                ]
            };
            DUMMY_PARENT_DIARY_MESSAGES[schoolThreadId] = {
                courseName: "",
                messages: [
                    {
                        id: schoolThreadId + "-1",
                        senderRole: "SCHOOL",
                        senderName: "School Office",
                        senderGender: "DONOTWANTTOSPECIFY",
                        message: "Monthly attendance and academic progress have been reviewed for " + student.studentName + ".",
                        createdAt: baseDate.clone().subtract(3, "days").hour(11).minute(30).second(0).toISOString(),
                        mentions: []
                    },
                    {
                        id: schoolThreadId + "-2",
                        senderRole: "PARENT",
                        senderName: typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME ? USER_FULL_NAME : "Demo Parent",
                        message: "Received, thank you. We will continue following the study plan.",
                        createdAt: baseDate.clone().subtract(2, "days").hour(18).minute(40).second(0).toISOString(),
                        mentions: [{ userName: "School Office", roleType: "SCHOOL" }]
                    }
                ]
            };
        });
    }

    function getDummyDiaryThreads(studentUserId) {
        if (!Object.keys(DUMMY_PARENT_DIARY_THREADS).length) {
            buildDummyDiaryData();
        }
        var student = getDummyStudent(studentUserId || (typeof ACTIVE_STUDENT_ID !== "undefined" ? ACTIVE_STUDENT_ID : ""));
        return DUMMY_PARENT_DIARY_THREADS[student.userId] || [];
    }

    function getDummyDiaryMessages(threadId, studentUserId) {
        if (!Object.keys(DUMMY_PARENT_DIARY_MESSAGES).length) {
            buildDummyDiaryData();
        }
        var thread = DUMMY_PARENT_DIARY_MESSAGES[threadId] || { courseName: "", messages: [] };
        return {
            status: 1,
            details: {
                threadId: threadId,
                studentUserId: studentUserId || "",
                sourceTimezone: getDummyTimezone(studentUserId),
                threadStatus: "OPEN",
                courseName: thread.courseName,
                messages: thread.messages
            }
        };
    }

    function getDummyAnnouncements() {
        var baseDate = getDummyBaseDate();

        return {
            status: "1",
            newAnnouncementCount: 2,
            announcements: [
                {
                    announcementId: 880001,
                    announceId: 880001,
                    announceTitle: "Parent Demo Dashboard",
                    createdDate: formatDate(baseDate),
                    replyStatus: "N",
                    latestStatus: "Y",
                    userId: 990001,
                    moduleId: 58,
                    teacherRemark: "This is dummy announcement data for the parent dashboard preview.",
                    fileType: "",
                    attachment: ""
                },
                {
                    announcementId: 880002,
                    announceId: 880002,
                    announceTitle: "Class Readiness Reminder",
                    createdDate: formatDate(addDays(baseDate, -1)),
                    replyStatus: "N",
                    latestStatus: "Y",
                    userId: 990001,
                    moduleId: 58,
                    teacherRemark: "Please keep notebooks and learning material ready before the live class.",
                    fileType: "",
                    attachment: ""
                }
            ]
        };
    }

    function getActiveParentStudent() {
        var studentList = (typeof STUDENT_LIST !== "undefined" && STUDENT_LIST.studentBasicDetails) ? STUDENT_LIST.studentBasicDetails : [];
        for (var i = 0; i < studentList.length; i++) {
            if (String(studentList[i].userId) === String(ACTIVE_STUDENT_ID)) {
                return studentList[i];
            }
        }
        return studentList[0] || {};
    }

    function getParentScheduleEvent(row, index, studentUserId) {
        var start = moment(getDummyBaseDate()).add(row.offsetMinutes, "minutes");
        var end = start.clone().add(row.duration, "minutes");
        var isClass = row.type === "CLASS";

        return {
            id: "dummy-parent-schedule-" + index,
            entityId: 770001 + index,
            meetingId: 880001 + index,
            type: row.type,
            category: row.type,
            courseName: row.courseName,
            teacherName: row.teacherName,
            teacherGender: row.teacherGender,
            start: start.format("YYYY-MM-DD HH:mm:ss"),
            end: end.format("YYYY-MM-DD HH:mm:ss"),
            timezone: getDummyTimezone(studentUserId),
            icon: getImagePath("Icon/sidebar/Examination_Schedule_icon.png"),
            classStatus: start.isBefore(moment(getDummyBaseDate())) ? "Completed" : "Not Started",
            classesAttendance: isClass ? row.attendance : "N/A",
            classesAttendanceDuration: isClass && row.attendance === "Attended" ? row.duration + " min" : "",
            classesAttendanceStartTime: isClass && row.attendance === "Attended" ? start.format("hh:mm A") : "",
            classesAttendanceEndTime: isClass && row.attendance === "Attended" ? end.format("hh:mm A") : "",
            hasFeedback: row.hasFeedback
        };
    }

    function getDummyClassSchedule(studentUserId) {
        var rows = getDummyClassRows(studentUserId);
        var events = [];
        for (var i = 0; i < rows.length; i++) {
            events.push(getParentScheduleEvent(rows[i], i, studentUserId));
        }
        return { status: 1, details: { schedule: events } };
    }

    function getDummyAssignedTeacherList(studentUserId) {
        var rowsData = getDummyClassRows(studentUserId);
        var rows = [];
        for (var i = 0; i < rowsData.length; i++) {
            var item = rowsData[i];
            rows.push({
                selectedCourses: item.courseName,
                teacherAssignedForTeacherSupport: item.teacherName,
                teacherGender: item.teacherGender
            });
        }
        return { status: 1, details: { assignedTeachers: rows } };
    }

    function getDummyAttendanceChartDetails(studentUserId) {
        var student = getDummyStudent(studentUserId);
        var summary = DUMMY_PARENT_SUMMARY[student.userId] || DUMMY_PARENT_SUMMARY[990001];
        var rows = getDummyClassRows(student.userId);
        var isAnaya = student.userId === 990002;
        var totalHeld = summary.totalClassesThisMonth;
        var late = isAnaya ? 2 : 1;
        var earlyLeave = isAnaya ? 1 : 0;
        var absent = isAnaya ? 2 : 1;
        var attended = Math.max(0, totalHeld - absent);

        return {
            status: 1,
            details: {
                summary: {
                    classesToday: rows.length,
                    totalClassesHeldThisMonth: totalHeld,
                    classesAttended: attended,
                    attendancePercentThisMonth: summary.attendancePercentThisMonth,
                    attendanceDeltaFromLastMonth: summary.attendanceDeltaFromLastMonth,
                    late: late,
                    latePercentThisMonth: Math.round((late / totalHeld) * 100) + "%",
                    lateDeltaFromLastMonth: isAnaya ? 1 : 2,
                    earlyLeave: earlyLeave,
                    absent: absent
                },
                attendanceOverview: getDummyAttendanceOverviewRows(summary.attendanceValues)
            }
        };
    }

    function getDummyAcademicPerformanceRows(studentUserId) {
        var student = getDummyStudent(studentUserId);
        var summary = DUMMY_PARENT_SUMMARY[student.userId] || DUMMY_PARENT_SUMMARY[990001];
        var rows = getDummyClassRows(student.userId);
        var baseScore = student.userId === 990002 ? 84 : 88;
        var paceList = student.userId === 990002 ? ["OnTrack", "Ahead", "GettingStarted"] : ["Ahead", "OnTrack", "Behind"];
        var list = [];

        for (var i = 0; i < rows.length; i++) {
            var score = Math.min(99, baseScore + (i * 3));
            list.push({
                lmsEnrollmentId: "DUMMY-ENROLL-" + student.userId + "-" + (i + 1),
                lmsCourseId: "DUMMY-COURSE-" + student.userId + "-" + (i + 1),
                courseName: rows[i].courseName.replace(" Live Class", "").replace(" Class", "").replace(" Activity", ""),
                score: score,
                progressPace: paceList[i % paceList.length],
                teacherName: rows[i].teacherName,
                teacherGender: rows[i].teacherGender,
                endDate: moment(getDummyBaseDate()).add(45 + (i * 15), "days").format("MMM DD, YYYY"),
                remainingDays: 45 + (i * 15),
                pendingAssignment: i + (student.userId === 990002 ? 1 : 0),
                progressGradable: Math.min(100, summary.gradeValues[4] - 8 + (i * 4)),
                progressAllActivity: Math.min(100, summary.attendanceValues[4] - 10 + (i * 3))
            });
        }

        return list;
    }

    function getDummyAcademicPerformance(studentUserId) {
        return {
            status: 1,
            details: {
                courseProviderId: 37,
                studentAcademicPerformances: getDummyAcademicPerformanceRows(studentUserId)
            }
        };
    }

    function getDummyAcademicPerformanceCourse(studentUserId, lmsEnrollmentId, lmsCourseId) {
        var rows = getDummyAcademicPerformanceRows(studentUserId);
        for (var i = 0; i < rows.length; i++) {
            if (String(rows[i].lmsEnrollmentId) === String(lmsEnrollmentId) || String(rows[i].lmsCourseId) === String(lmsCourseId)) {
                return rows[i];
            }
        }
        return rows[0] || {};
    }

    function getDummyAcademicProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId) {
        var course = getDummyAcademicPerformanceCourse(studentUserId, lmsEnrollmentId, lmsCourseId);
        var baseDate = moment(getDummyBaseDate());
        var totalAssignment = 8;
        var pendingAssign = Number(course.pendingAssignment || 0);
        var submitted = Math.max(0, totalAssignment - pendingAssign - 1);
        var items = [];

        for (var i = 0; i < totalAssignment; i++) {
            var submittedStatus = i < submitted ? "SUBMITTED" : (i === submitted ? "EXCUSED" : "");
            items.push({
                itemid: "DUMMY-ITEM-" + (i + 1),
                title: course.courseName + " Assignment " + (i + 1),
                duedate: baseDate.clone().add(i * 5, "days").format("MMM DD, YYYY"),
                submitteddate: submittedStatus === "SUBMITTED" ? baseDate.clone().add((i * 5) - 1, "days").format("MMM DD, YYYY") : "N/A",
                unitTimeSpent: "00:" + twoDigits(24 + i) + ":00",
                submissionStatus: submittedStatus,
                lateTime: "",
                status: submittedStatus,
                unitPercent: Math.min(100, Number(course.score || 0) + (i % 3)),
                letter: Number(course.score || 0) >= 90 ? "A" : "B",
                teacherGradeStatus: submittedStatus === "SUBMITTED" ? "Y" : "N",
                colorDueText: "",
                colorScoreText: "text-success"
            });
        }

        return {
            code: "SUCCESS",
            totalAssignment: totalAssignment,
            excusedAssign: 1,
            submiteAssign: submitted,
            upcomingAssign: pendingAssign,
            pendingAssign: pendingAssign,
            passesAssign: submitted,
            failedAssign: 0,
            submitBeforeTimeAssign: Math.max(0, submitted - 1),
            submitOntimeAssign: 1,
            submitLateAssign: 0,
            gradeByTeacher: submitted,
            response: {
                enrollments: {
                    enrollment: [{
                        id: lmsEnrollmentId,
                        startdate: baseDate.format("MMM DD, YYYY"),
                        enddate: baseDate.clone().add(Number(course.remainingDays || 45), "days").format("MMM DD, YYYY"),
                        entity: { title: course.courseName || "Course" },
                        grades: {
                            percentage: course.score || 0,
                            letter: Number(course.score || 0) >= 90 ? "A" : "B",
                            complete: course.progressGradable || 0,
                            completedgradable: submitted,
                            gradable: totalAssignment,
                            completeall: course.progressAllActivity || 0,
                            completed: submitted + 2,
                            completable: totalAssignment + 2,
                            items: { item: items }
                        }
                    }]
                }
            }
        };
    }

    function getDummyAcademicGradeHistory(itemId) {
        var baseDate = moment(getDummyBaseDate());
        var grades = [];

        for (var i = 0; i < 3; i++) {
            grades.push({
                lastactivitydate: baseDate.clone().subtract(i + 1, "days").format("MMM DD, YYYY"),
                attempts: i + 1,
                expTime: "00:" + twoDigits(18 + i * 4) + ":00",
                achieved: 88 + i,
                possible: 100,
                percent: (88 + i) + "%",
                user: {
                    firstname: i === 0 ? "Teacher" : "Auto",
                    lastname: itemId ? "Review" : "Grade"
                }
            });
        }

        return { code: "SUCCESS", response: { grades: { grade: grades } } };
    }

    function getDummyAcademicDocsUrl(fileName, studentUserId) {
        var basePath = typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2.replace(/images\/?$/, "") : "static/theme2/";
        return basePath + fileName + "?studentId=" + encodeURIComponent(studentUserId) + "&dummyDate=" + encodeURIComponent(formatDate(getDummyBaseDate()));
    }

    function getDummyAcademicDocs(studentUserId) {
        var student = getDummyStudent(studentUserId);
        var isAnaya = student.userId === 990002;
        var baseDate = moment(getDummyBaseDate());
        var learningProgram = isAnaya ? "One-to-One Flex" : "One-to-One Learning";
        var rows = [
            {
                sessionName: "2026-2027",
                gradeName: student.grade,
                learningProgram: learningProgram,
                documentDate: baseDate.format("YYYY-MM-DD"),
                showTranscript: "N",
                transcriptUrl: "",
                diplomaUrl: "",
                deplomaUrl: "",
                academicVerificationUrl: "",
                academicVerficationUrl: ""
            },
            {
                sessionName: "2026-2027",
                gradeName: student.grade,
                learningProgram: learningProgram,
                documentDate: baseDate.clone().subtract(1, "days").format("YYYY-MM-DD"),
                showTranscript: "Y",
                transcriptUrl: getDummyAcademicDocsUrl("dummy-parent-transcript.html", student.userId),
                diplomaUrl: "",
                deplomaUrl: "",
                academicVerificationUrl: "",
                academicVerficationUrl: ""
            },
            {
                sessionName: "2025-2026",
                gradeName: student.grade,
                learningProgram: learningProgram,
                documentDate: baseDate.clone().subtract(14, "days").format("YYYY-MM-DD"),
                showTranscript: "N",
                transcriptUrl: "",
                diplomaUrl: "",
                deplomaUrl: "",
                academicVerificationUrl: getDummyAcademicDocsUrl("dummy-parent-academic-verification.html", student.userId),
                academicVerficationUrl: getDummyAcademicDocsUrl("dummy-parent-academic-verification.html", student.userId)
            }
        ];

        return {
            status: 1,
            details: {
                academicDocuments: rows
            }
        };
    }

    function patchDummyParentAcademicDocsFunctions() {
        if (window.__dummyParentAcademicDocsPatched) return;
        if (typeof parentAcademicDocsMapRows !== "function"
            || typeof parentAcademicDocsResolveList !== "function") return;

        window.__dummyParentAcademicDocsPatched = true;

        parentAcademicDocsMapRows = function (apiResponse) {
            var rowList = parentAcademicDocsResolveList(apiResponse);
            var rows = [];
            $.each(rowList || [], function (index, item) {
                rows.push({
                    batch: item.sessionName || "N/A",
                    grade: item.gradeName || "N/A",
                    learningProgram: item.learningProgram || "N/A",
                    documentDate: item.documentDate || item.createdDate || item.publishedDate || "",
                    showTranscript: "N",
                    transcriptUrl: item.transcriptUrl || "",
                    diplomaUrl: item.deplomaUrl || item.diplomaUrl || "",
                    academicVerificationUrl: item.academicVerficationUrl || item.academicVerificationUrl || ""
                });
            });
            return rows;
        };
    }

    function getDummyProgressUrl(studentUserId, reportIndex) {
        return "dummy-parent-progress://" + studentUserId + "/" + reportIndex;
    }

    function getDummyProgressReports(studentUserId) {
        var baseDate = moment(getDummyBaseDate());
        var reports = [];

        for (var i = 0; i < 2; i++) {
            var endDate = baseDate.clone().subtract(i * 7, "days");
            var startDate = endDate.clone().subtract(6, "days");
            reports.push({
                daysType: 7,
                reportStartDate: startDate.format("MMM DD, YYYY"),
                reportEndDate: endDate.format("MMM DD, YYYY"),
                createdDate: endDate.clone().add(1, "days").format("MMM DD, YYYY"),
                playloadUrl: getDummyProgressUrl(studentUserId, i + 1),
                payloadUrl: getDummyProgressUrl(studentUserId, i + 1)
            });
        }

        return {
            status: 1,
            details: {
                studentWeeklyProgressReports: reports
            }
        };
    }

    function getDummyProgressStudentIdFromUrl(url) {
        var match = String(url || "").match(/dummy-parent-progress:\/\/([^/]+)\/(\d+)/);
        return match && match[1] ? match[1] : (typeof ACTIVE_STUDENT_ID !== "undefined" ? ACTIVE_STUDENT_ID : DUMMY_PARENT_STUDENTS[0].userId);
    }

    function getDummyProgressReportIndexFromUrl(url) {
        var match = String(url || "").match(/dummy-parent-progress:\/\/([^/]+)\/(\d+)/);
        return match && match[2] ? parseInt(match[2], 10) : 1;
    }

    function getDummyProgressActivities(courseName, score) {
        var names = ["Lesson Review", "Practice Assignment", "Checkpoint Quiz", "Reflection Task"];
        var rows = [];

        for (var i = 0; i < names.length; i++) {
            rows.push({
                module: "Module " + (i + 1),
                type: i === 2 ? "Quiz" : "Assignment",
                title: courseName + " - " + names[i],
                timeSpent: "00:" + twoDigits(28 + (i * 6)) + ":00",
                dueDate: moment(getDummyBaseDate()).subtract(8 - i, "days").format("MMM DD, YYYY"),
                submittedDate: moment(getDummyBaseDate()).subtract(7 - i, "days").format("MMM DD, YYYY"),
                percent: Math.min(100, score + i) + "%",
                letter: score >= 90 ? "A" : "B"
            });
        }

        return rows;
    }

    function getDummyProgressGradebookStyle() {
        return [
            ".parent-progress-dummy-report{width:100%;max-width:none;margin:0;background:#fff;font-size:13px}",
            ".parent-progress-dummy-report table{margin:0 auto;width:100%;height:auto;border-collapse:collapse}",
            ".parent-progress-dummy-report .report-shell{border:1px solid #e5eef8;background:#fff;padding:12px}",
            ".blue-border-table .table-bordered th,.blue-border-table .table-bordered td{border:1px solid #6fb0f1!important}",
            ".blue-border-table .details-table thead tr th{vertical-align:middle!important;padding:.28rem!important;font-size:12px}",
            ".details-table{margin:0 auto;text-align:center;width:100%;border-collapse:collapse}",
            ".details-table tbody tr td{padding:.35rem!important;font-size:12px}",
            ".details-table tbody tr:nth-child(odd) td{background-color:#f5fafc}",
            ".details-table tbody tr:nth-child(even) td{background-color:#fff}",
            ".headerSection{width:100%;display:inline-block}",
            ".page-head{width:100%;display:inline-block;padding:10px;background:#fafdff;position:relative}",
            ".site-logo{max-width:260px;float:left}",
            ".site-logo img{display:inline-block;margin-bottom:16px}",
            ".right-part{width:calc(100% - 280px);display:flex;flex-wrap:wrap;text-align:right;align-content:space-between}",
            ".right-part .right-title{width:100%;display:inline-block;margin-bottom:14px}",
            ".right-part h3{font-size:24px;text-align:right;margin:0;color:#007fff}",
            ".right-part h4{font-size:14px;margin:4px 0 0}",
            ".skew-border{border:0;background:#fafdff;border-bottom:2px dashed #91c8ff;width:100%;transform:skew(-30deg,0deg)}",
            ".grades-table{border-right:1px solid #71c4c1!important}",
            ".grades-table td{padding:3px;border:1px solid #71c4c1;font-size:10px;color:#000}",
            ".progress-summary-table td{font-size:12px}",
            ".activity-report-table{min-width:820px!important}",
            "@media only screen and (max-width:780px){.parent-progress-dummy-report{max-width:100%}.right-part,.site-logo{width:100%;max-width:100%;float:none}.details-table{min-width:760px}}"
        ].join("\n");
    }

    function getDummyProgressCourseHtml(student, course, reportIndex, index) {
        var score = Math.min(98, 86 + (index * 4) + (student.userId === 990002 ? 1 : 4));
        var activities = getDummyProgressActivities(course.courseName.replace(" Live Class", "").replace(" Class", "").replace(" Activity", ""), score);
        var rowsHtml = "";

        for (var i = 0; i < activities.length; i++) {
            rowsHtml += "<tr>"
                + "<td>" + activities[i].module + "</td>"
                + "<td>" + activities[i].type + "</td>"
                + "<td style='text-align:left;'>" + activities[i].title + "</td>"
                + "<td>" + activities[i].timeSpent + "</td>"
                + "<td>" + activities[i].dueDate + "</td>"
                + "<td>" + activities[i].submittedDate + "</td>"
                + "<td class='text-success'>" + activities[i].percent + "</td>"
                + "<td class='text-success'>" + activities[i].letter + "</td>"
                + "</tr>";
        }

        return "<div class='headerSection'>"
            + "<div class='page-head'>"
            + "<table cellspacing='0' cellpadding='5' style='width:100%;position:relative;top:0;' class='academic-details'><thead>"
            + "<tr><td><table style='margin:0;width:100%;'><tbody><tr>"
            + "<td align='left' style='border:0;'><table style='margin:0;width:100%;'><tbody>"
            + "<tr><td><div class='site-logo mb-1'><img src='" + getImagePath("is_logo_2026_blue.png") + "' style='max-width:240px;width:100%;float:left'></div></td></tr>"
            + "<tr><td><table class='tr-blue-border table table-striped table-bordered details-table text-left progress-summary-table mt-4 '><tbody>"
            + "<tr><td><span class='bold'>Student Name: </span>" + student.studentName + "</td></tr>"
            + "<tr><td><span class='bold'>Grade: </span>" + student.grade + "</td></tr>"
            + "<tr><td><span class='bold'>Course: </span>" + course.courseName.replace(" Live Class", "").replace(" Class", "").replace(" Activity", "") + "</td></tr>"
            + "</tbody></table></td></tr></tbody></table></td>"
            + "<td align='left' style='border:0;padding-left:20px'><table class='tr-blue-border table table-bordered progress-summary-table'><tbody>"
            + "<tr><td><span class='bold'>Academic Year Start Date: </span>Aug 01, 2027</td></tr>"
            + "<tr><td><span class='bold'>Academic Year End Date: </span>Jun 30, 2028</td></tr>"
            + "</tbody></table><table class='tr-blue-border table table-striped table-bordered details-table text-left progress-summary-table'><tbody>"
            + "<tr><td><span class='bold'>Student ID: </span>" + student.userId + "</td></tr>"
            + "<tr><td><span class='bold'>Country: </span>India</td></tr>"
            + "<tr><td><span class='bold'>Teacher Name: </span>" + course.teacherName + "</td></tr>"
            + "</tbody></table></td>"
            + "</tr></tbody></table></td></tr>"
            + "<tr><td colspan='2'><div class='right-part text-center mt-1 mb-2' style='width:auto;'><div class='right-title m-0 '><h3 class='text-center text-uppercase bold'>Detailed Student Grading Report</h3><h4 class='text-uppercase bold'>Duration: " + moment(getDummyBaseDate()).subtract((reportIndex * 7) - 1, "days").format("MMM DD, YYYY") + " - " + moment(getDummyBaseDate()).subtract((reportIndex - 1) * 7, "days").format("MMM DD, YYYY") + "</h4></div></div></td></tr>"
            + "</thead></table></div></div>"
            + "<div class='tab-pane tabs-animation fade show active'><div class='main-card mb-3' style='overflow-x:auto'>"
            + "<table class='blue-border table table-striped table-bordered dt-responsive text-center details-table activity-report-table' style='width:100%;'><thead><tr>"
            + "<th>Module | <span class='text-info'>Activity</span></th><th>Type</th><th>Activity Name</th><th>Time Spent<br>(hh:mm:ss)</th><th>Target Due Date</th><th>Submitted Date<br>(hh:mm:ss)</th><th>Percentage</th><th>Grade</th>"
            + "</tr></thead><tbody>" + rowsHtml + "</tbody></table>"
            + "<table class='m-0' style='width:100%' cellpadding='0'><tbody><tr>"
            + "<td style='border:0;background-color:#fff' class='align-bottom'><table class='m-0 details-table tr-blue-border' style='width:100%'><tbody>"
            + "<tr><td style='text-align:center;background-color:#fff;font-size:18px;'>Total Activity Time:&nbsp;<b>02:32:00</b></td></tr>"
            + "<tr><td style='text-align:center;background-color:#fff;font-size:18px;'>Number of Activities - Submitted & Graded:&nbsp;<b>4</b></td></tr>"
            + "<tr><td style='text-align:center;background-color:#fff;font-size:18px;'>Number of Activities - Waiting for the Grade:&nbsp;<b>0</b></td></tr>"
            + "<tr><td style='text-align:center;background-color:#fff;font-size:18px;'>Number of Activities - Not Submitted:&nbsp;<b>0</b></td></tr>"
            + "</tbody></table></td><td>&nbsp;&nbsp;&nbsp;</td>"
            + "<td style='border:0;background-color:#fff'><table class='m-0 text-left details-table tr-blue-border' style='width:100%'><tbody>"
            + "<tr><td style='text-align:right;font-weight:bold'>Course Grade:</td><td class='pl-2'>" + (score >= 90 ? "A" : "B") + "</td></tr>"
            + "<tr><td style='text-align:right;font-weight:bold'>Current Overall Percentage:</td><td class='pl-2'>" + score + "%</td></tr>"
            + "<tr><td style='text-align:right;font-weight:bold'>Current Week Percentage:</td><td class='pl-2'>" + Math.min(100, score + 2) + "%</td></tr>"
            + "<tr><td style='text-align:right;font-weight:bold'>Course Completion Percentage:</td><td class='pl-2'>" + (72 + (index * 8)) + "%</td></tr>"
            + "</tbody></table></td></tr></tbody></table>"
            + "<br><table style='width:100%;position:relative;top:0;'><tbody><tr><td colspan='8' class='skew-border'></td></tr><tr><td colspan='8' class='skew-border'></td></tr></tbody></table><br>"
            + "</div></div>";
    }

    function getDummyProgressReportHtml(url) {
        var studentUserId = getDummyProgressStudentIdFromUrl(url);
        var reportIndex = getDummyProgressReportIndexFromUrl(url);
        var student = getDummyStudent(studentUserId);
        var courses = getDummyClassRows(student.userId);
        var courseHtml = "";

        for (var i = 0; i < Math.min(2, courses.length); i++) {
            courseHtml += getDummyProgressCourseHtml(student, courses[i], reportIndex, i);
        }

        return "<!doctype html><html><head><style id='gradebookSummaryStyleBlock'>" + getDummyProgressGradebookStyle() + "</style></head><body>"
            + "<div class='app-main pb-4 blue-border-table pt-0 parent-progress-dummy-report'><div class='col p-0'><div class='app-main__inner p-0 report-shell'>"
            + "<div class='app-page-title mb-3 py-2 mt-2 hideOnPrint'><div class='page-title-wrapper'><div class='page-title-heading'><div class='page-title-icon'><i class='fas fa-university text-primary'></i></div><div>Grade book summary | " + student.studentName + "</div></div></div></div>"
            + "<div class='main-card mb-3 card body-tabs-shadow'><div class='card-body'><div class='tab-content' id='enrollMentGrade'>"
            + courseHtml
            + "<div><table cellpadding='0' cellspacing='0' class='table m-0'><tbody><tr><td class='p-0' style='border:0'><img src='" + getImagePath("repost-bottom-graphic.png") + "' style='max-width:300px;width:100%;float:left'></td>"
            + "<td style='border:0' class='align-top p-0'><table cellpadding='0' cellspacing='0' class='table m-0'><tbody><tr><td class='text-right p-0' style='border:0'><div class='full'><div class='pr-2 d-inline-block position-relative'><img src='" + getImagePath("is-stamp.png") + "' style='max-width:100px;width:100%;float:left'><span class='pr-2 d-inline-block' style='position:absolute;left:-30px;bottom:-30px;'><img src='" + getImagePath("signature-report.png") + "' style='max-width:100px;width:100%;float:left'></span></div></div><p class='full text-right'>School Official</p></td></tr>"
            + "<tr><td style='border:0' class='align-top p-0'><table cellspacing='0' cellpadding='0' class='grades-table m-0 float-right mt-3' style='max-width:600px;border-collapse:collapse;width:100%;position:relative;top:5px;text-align:center;border:none;'><tbody><tr><td colspan='14' align='center' style='font-size:13px;'><b>GRADING SYSTEM</b></td></tr><tr><td>Grade</td><td>A+</td><td>A</td><td>A-</td><td>B+</td><td>B</td><td>B-</td><td>C+</td><td>C</td><td>C-</td><td>D+</td><td>D</td><td>D-</td><td>F</td></tr><tr><td>Percentage</td><td>96-100</td><td>93-95</td><td>89-92</td><td>86-88</td><td>83-85</td><td>79-82</td><td>76-78</td><td>73-75</td><td>69-72</td><td>66-68</td><td>63-65</td><td>60-62</td><td>Below 60</td></tr></tbody></table></td></tr>"
            + "</tbody></table></td></tr></tbody></table></div>"
            + "<div class='text-center font-italic'>Note: This report has been graded by the teacher and is not system-generated.</div>"
            + "</div></div></div></div></div></div>"
            + "<script id='gradebookSummaryInitScript'></script></body></html>";
    }

    function getDummyLoginHistory(studentUserId) {
        var baseDate = moment(getDummyBaseDate());
        var isParent = typeof USER_ID !== "undefined" && String(studentUserId) === String(USER_ID);
        var student = isParent ? { studentName: typeof USER_FULL_NAME !== "undefined" ? USER_FULL_NAME : "Parent" } : getDummyStudent(studentUserId);
        var location = isParent ? "America | New York | Parent Portal" : "America | New York | Student Portal";
        var rows = [];

        for (var i = 0; i < 6; i++) {
            var loginAt = baseDate.clone().subtract(i, "days").hour(9 + (i % 3)).minute(i * 7).second(0);
            var logoutAt = loginAt.clone().add(54 + (i * 6), "minutes");
            rows.push({
                loginHistoryId: 970001 + i,
                loginTime: loginAt.format("MMM DD, YYYY hh:mm A"),
                logOutTime: logoutAt.format("MMM DD, YYYY hh:mm A"),
                loginLocation: location,
                totalLoginDuretion: Math.floor(logoutAt.diff(loginAt, "minutes") / 60) + "h " + twoDigits(logoutAt.diff(loginAt, "minutes") % 60) + "m"
            });
        }

        return {
            status: 1,
            details: {
                userName: student.studentName,
                firstLogin: rows[rows.length - 1].loginTime,
                lastLogin: rows[0].loginTime,
                duration: rows[0].totalLoginDuretion,
                totalLoginDuretion: isParent ? "6h 42m" : "8h 18m",
                loginHistories: rows
            }
        };
    }

    function getDummyClassScheduleEventByMeetingId(meetingId) {
        var activeStudentId = typeof ACTIVE_STUDENT_ID !== "undefined" ? ACTIVE_STUDENT_ID : "";
        var events = getDummyClassSchedule(activeStudentId).details.schedule;
        for (var i = 0; i < events.length; i++) {
            if (String(events[i].meetingId) === String(meetingId)) {
                return events[i];
            }
        }
        return events[0];
    }

    window.isDummyParentDashboardMode = function () {
        return (typeof isDemoUser !== "undefined" && isYes(isDemoUser)) || isYes(getQueryParam("parentDemoPreview"));
    };

    window.updateDemoDashboardProfile = function (responseData) {
        if (!responseData) {
            return;
        }
        if (responseData.profileName) {
            $(".header-user-info .widget-heading").text(responseData.profileName);
            $(".dropdown-menu-header .widget-heading").text(responseData.profileName + ", ");
        }
        if (responseData.profileImagePath) {
            $("#topProfileImage").attr("src", responseData.profileImagePath);
            $("#dropDownProfileImage").attr("src", responseData.profileImagePath);
        }
    };

    window.isDummyStudentMode = window.isDummyStudentMode || window.isDummyParentDashboardMode;

    window.dummyGetUserShortProfile = function () {
        return window.DEMO_DASHBOARD_USER_DETAILS || {};
    };

    window.dummyGetParentDashboardCurrentDate = function (fallbackDate) {
        return window.isDummyParentDashboardMode() ? getDummyBaseDate() : (fallbackDate || null);
    };

    window.dummyGetParentCurrentTimeText = function (activeStudentTimezone) {
        if (window.isDummyParentDashboardMode()) {
            return moment(getDummyBaseDate()).format("MMM DD, YYYY hh:mm:ss a");
        }
        return convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, activeStudentTimezone).format("MMM DD, YYYY hh:mm:ss a");
    };

    window.dummyGetParentStudentList = async function (ajaxReqDetails) {
        debugger
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        DUMMY_PARENT_REQUESTED_ACTIVE_STUDENT_ID = getDummyParentRequestedStudentId();
        installDummyParentActiveStudentHook();
        scheduleRequestedDummyParentStudentActivation();
        return { status: 1, studentBasicDetails: getDummyStudentBasicDetails() };
    };

    window.dummyGetParentStudentPerformanceData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            getChat("", "PARENT");
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyOverview(studentUserId);
    };

    window.dummyGetParentUpcomingClassesAndActivityData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummySchedule(studentUserId);
    };

    window.dummyGetParentStudentFeeData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyFeeDetails(studentUserId);
    };

    window.dummyGetParentAttendanceChartDetailsData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyAttendanceChartDetails(studentUserId);
    };

    window.dummyGetParentAcademicPerformanceData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyAcademicPerformance(studentUserId);
    };

    window.dummyLoadParentAcademicPerformanceProgressDetail = function (studentUserId, lmsEnrollmentId, lmsCourseId, payload) {
        if (window.isDummyParentDashboardMode()) {
            parentAcademicPerformanceBindProgressDetailData(getDummyAcademicProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId));
            customLoader(false);
            return;
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML("dashboard", "get-student-progress-report-detail"),
            data: JSON.stringify(payload),
            dataType: "json",
            cache: false,
            timeout: 600000,
            success: function (data) {
                if (data && data.code === "SUCCESS") {
                    parentAcademicPerformanceBindProgressDetailData(data);
                } else {
                    showMessageTheme2(0, data && data.message ? data.message : "Unable to load course progress detail.");
                    showAndHideDashboardAndAdditionalContent("main");
                }
                customLoader(false);
            },
            error: function () {
                showMessageTheme2(0, "Unable to load course progress detail.");
                customLoader(false);
                showAndHideDashboardAndAdditionalContent("main");
            }
        });
    };

    window.dummyLoadParentAcademicPerformanceGradeHistory = function (enrollId, itemId, payload) {
        if (window.isDummyParentDashboardMode()) {
            parentAcademicPerformanceBindGradeHistoryRows(getDummyAcademicGradeHistory(itemId));
            customLoader(false);
            return;
        }
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: getURLForHTML("dashboard", "get-progress-report-grade-history"),
            data: JSON.stringify(payload),
            dataType: "json",
            success: function (data) {
                if (data && data.code === "SUCCESS") {
                    parentAcademicPerformanceBindGradeHistoryRows(data);
                } else {
                    $("#studentGradeHistory").html('<tr><td colspan="5" class="text-center">No Record</td></tr>');
                    showMessageTheme2(0, data && data.message ? data.message : "Unable to load grade history.");
                }
                customLoader(false);
            },
            error: function () {
                customLoader(false);
                $("#studentGradeHistory").html('<tr><td colspan="5" class="text-center">No Record</td></tr>');
                showMessageTheme2(0, "Unable to load grade history.");
            }
        });
    };

    window.dummyGetParentAcademicDocsData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        patchDummyParentAcademicDocsFunctions();
        await hydrateDummyParentDataFromDb();
        return getDummyAcademicDocs(studentUserId);
    };

    var dummyParentAcademicDocsPatchAttempts = 0;
    var dummyParentAcademicDocsPatchTimer = setInterval(function () {
        patchDummyParentAcademicDocsFunctions();
        dummyParentAcademicDocsPatchAttempts++;
        if (window.__dummyParentAcademicDocsPatched || dummyParentAcademicDocsPatchAttempts > 400) {
            clearInterval(dummyParentAcademicDocsPatchTimer);
        }
    }, 50);

    window.dummyGetParentProgressData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyProgressReports(studentUserId);
    };

    window.dummyOpenParentProgressReport = function (url) {
        if (window.isDummyParentDashboardMode()) {
            parentProgressRenderDetailHtml(getDummyProgressReportHtml(url));
            customLoader(false);
            return;
        }
        $.ajax({
            type: "GET",
            url: url,
            dataType: "html",
            cache: false,
            timeout: 600000,
            success: function (htmlContent) {
                if (htmlContent != "") {
                    var stringMessage = htmlContent.split("|");
                    if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
                        if (stringMessage[0] == "SESSIONOUT") {
                            redirectLoginPage();
                        } else {
                            showMessageTheme2(0, stringMessage[1]);
                            showAndHideDashboardAndAdditionalContent("main");
                        }
                        customLoader(false);
                        return false;
                    }
                }
                parentProgressRenderDetailHtml(htmlContent);
                customLoader(false);
            },
            error: function () {
                showMessageTheme2(0, "Unable to load progress report detail.");
                customLoader(false);
                showAndHideDashboardAndAdditionalContent("main");
            }
        });
    };

    window.dummyGetParentLoginHistoryData = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyLoginHistory(studentUserId);
    };

    window.dummyRenderParentSchoolDiaryBtnCount = async function (studentUserId) {
        if (!window.isDummyParentDashboardMode()) {
            return await renderSchoolDaiaryBtnCount(studentUserId);
        }
        $("#schoolDiaryBadge, .schoolDiaryBadge").text(0).removeClass("d-none");
        if ($("#schoolDiaryDiv").length > 0 && typeof getParentSchoolDiaryEntriesHtml === "function") {
            if ($("#parentSchoolDiaryStyles").length === 0 && typeof parentSchoolDiaryGetStyles === "function") {
                $("head").append(parentSchoolDiaryGetStyles());
            }
            $("#schoolDiaryDiv").html(getParentSchoolDiaryEntriesHtml());
        }
        return false;
    };

    window.dummyGetParentDiaryThreadList = async function (studentUserId) {
        await hydrateDummyParentDataFromDb();
        var threads = getDummyDiaryThreads(studentUserId);
        return { status: 1, details: { threads: threads } };
    };

    window.dummyGetParentDiaryMessages = async function (threadId, studentUserId) {
        await hydrateDummyParentDataFromDb();
        return getDummyDiaryMessages(threadId, studentUserId);
    };

    window.dummyGetParentDiaryMentions = function () {
        return {
            status: 1,
            details: [
                { roleType: "PARENT", userName: typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME ? USER_FULL_NAME : "Demo Parent" },
                { roleType: "TEACHER", userName: "Olivia Parker" },
                { roleType: "SCHOOL", userName: "School Office" }
            ]
        };
    };

    window.getDummyAnnouncementDetails = window.getDummyAnnouncementDetails || function () {
        return getDummyAnnouncements();
    };

    window.getDummyAnnouncementById = window.getDummyAnnouncementById || function (announcementId) {
        var announcements = getDummyAnnouncements().announcements;
        for (var i = 0; i < announcements.length; i++) {
            if (String(announcements[i].announcementId) === String(announcementId)) {
                return { status: 1, announcement: announcements[i] };
            }
        }
        return { status: 0, message: "Announcement not found" };
    };

    window.dummyGetParentClassScheduleBaseMoment = function () {
        return moment(window.dummyGetParentDashboardCurrentDate(new Date()));
    };

    window.dummyGetParentStudentClassScheduleData = async function (studentId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyClassSchedule(studentId);
    };

    window.dummyGetParentStudentClassSummary = async function (meetingId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        var event = getDummyClassScheduleEventByMeetingId(meetingId);
        var activeStudent = getActiveParentStudent();

        return {
            status: 1,
            details: {
                studentName: activeStudent.studentName || "",
                studentId: activeStudent.userId || ACTIVE_STUDENT_ID,
                profilePic: activeStudent.profilePic || ((typeof PATH_FOLDER_FONT2 !== "undefined" ? PATH_FOLDER_FONT2 : "") + "dummy-user.png"),
                attendanceStatus: event.classesAttendance === "Attended" ? "Present" : "N/A",
                subjectName: event.courseName,
                teacherName: event.teacherName,
                classDate: moment(event.start).format("MMMM D, YYYY"),
                classTime: moment(event.start).format("hh:mm A") + " - " + moment(event.end).format("hh:mm A"),
                classDuration: moment(event.end).diff(moment(event.start), "minutes") + " minutes",
                summaryDetails: [
                    {
                        title: "Overview",
                        summary: "The student participated in the session activities and reviewed the key learning points for " + event.courseName + "."
                    },
                    {
                        title: "Next Steps",
                        summary: "Continue practice with the assigned worksheet and revise the class notes before the next session."
                    }
                ]
            }
        };
    };

    window.dummyGetParentAssignedTeacherList = async function (studentUserId, ajaxReqDetails) {
        if (!window.isDummyParentDashboardMode()) {
            return await callCommonAjax(ajaxReqDetails);
        }
        await hydrateDummyParentDataFromDb();
        return getDummyAssignedTeacherList(studentUserId);
    };

    window.getDummyParentFeedSelectorHtml = function () {
        if (!window.isDummyParentDashboardMode || !window.isDummyParentDashboardMode()) {
            return "";
        }
        var feedUserIds = DUMMY_PARENT_FEED_USER_IDS.length > 0 ? DUMMY_PARENT_FEED_USER_IDS : [DUMMY_PARENT_SELECTED_FEED_USER_ID || (typeof USER_ID !== "undefined" ? String(USER_ID) : "")];
        feedUserIds = feedUserIds.filter(function (userId) { return $.trim(userId || "") !== ""; });
        var disabled = feedUserIds.length === 0 ? "disabled" : "";
        var html = '<div class="main-card mb-3 card parent-demo-feed-layer">'
            + '<div class="card-body py-3"><div class="form-row align-items-center">'
            + '<div class="col-md-3 col-sm-12 mb-2 mb-md-0"><label class="m-0 font-weight-semi-bold">Demo Data User ID</label></div>'
            + '<div class="col-md-4 col-sm-12 mb-2 mb-md-0"><select id="dummyParentFeedUserId" class="form-control" onchange="changeDummyParentFeedUserId(this.value)" ' + disabled + '>';
        if (feedUserIds.length === 0) {
            html += '<option value="">No demo feed found</option>';
        } else {
            feedUserIds.forEach(function (userId) {
                html += '<option value="' + escapeDummyParentHtml(userId) + '" ' + (String(userId) === String(DUMMY_PARENT_SELECTED_FEED_USER_ID) ? "selected" : "") + '>' + escapeDummyParentHtml(userId) + '</option>';
            });
        }
        html += '</select></div>'
            + '<div class="col-md-3 col-sm-12"><button type="button" class="btn btn-sm btn-primary" onclick="reloadDummyParentFeedUserIds()">Refresh</button></div>'
            + '</div></div></div>';
        return html;
    };

    window.applyStudentDashboardManagementDummyStyles = function () {
        if (typeof document === "undefined" || document.getElementById("studentDashboardManagementDummyStyles")) {
            return;
        }
        var style = document.createElement("style");
        style.id = "studentDashboardManagementDummyStyles";
        style.textContent = [
            "#studentDashboardManagementForm{padding-top:10px;}",
            "#studentDashboardManagementForm.custom-field-scope .custom-field,#studentDashboardManagementFilterForm.custom-field-scope .custom-field{margin-top:8px;margin-bottom:0;}",
            "#studentDashboardManagementTable{table-layout:fixed;width:100%;}",
            "#studentDashboardManagementTable th,#studentDashboardManagementTable td{vertical-align:middle;}",
            "#studentDashboardManagementTable th:nth-child(1),#studentDashboardManagementTable td:nth-child(1){width:12%;}",
            "#studentDashboardManagementTable th:nth-child(2),#studentDashboardManagementTable td:nth-child(2){width:14%;}",
            "#studentDashboardManagementTable th:nth-child(3),#studentDashboardManagementTable td:nth-child(3){width:7%;}",
            "#studentDashboardManagementTable th:nth-child(4),#studentDashboardManagementTable td:nth-child(4){width:39%;}",
            "#studentDashboardManagementTable th:nth-child(5),#studentDashboardManagementTable td:nth-child(5),#studentDashboardManagementTable th:nth-child(6),#studentDashboardManagementTable td:nth-child(6){width:7%;}",
            "#studentDashboardManagementTable th:nth-child(7),#studentDashboardManagementTable td:nth-child(7){width:7%;}",
            "#studentDashboardManagementTable th:nth-child(8),#studentDashboardManagementTable td:nth-child(8){width:7%;}",
            "#studentDashboardManagementTable .student-dashboard-course-name{white-space:normal;overflow-wrap:anywhere;word-break:break-word;line-height:1.4;}",
            "#studentDashboardManagementTable .student-dashboard-actions-cell{white-space:nowrap;text-align:center;}",
            "#studentDashboardManagementTable .student-dashboard-actions-cell .btn{width:34px;height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;}"
        ].join("");
        document.head.appendChild(style);
    };

    window.changeDummyParentFeedUserId = function (userId) {
        DUMMY_PARENT_SELECTED_FEED_USER_ID = String(userId || "");
        localStorage.setItem("PARENT_DEMO_FEED_USER_ID", DUMMY_PARENT_SELECTED_FEED_USER_ID);
        applyDbDummyParentRows(getSelectedDummyParentRows());
        if (typeof renderParentDashboardContent === "function") {
            renderParentDashboardContent();
        }
    };

    window.reloadDummyParentFeedUserIds = async function () {
        DUMMY_PARENT_DB_DATA_LOADED = false;
        DUMMY_PARENT_DB_DATA_LOADING = null;
        await hydrateDummyParentDataFromDb();
        if (typeof renderParentDashboardContent === "function") {
            renderParentDashboardContent();
        }
    };
    $(window.applyStudentDashboardManagementDummyStyles);
})(window);
