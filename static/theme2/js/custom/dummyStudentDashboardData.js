(function (window) {
    var GRADE_CONFIG = {
        K: { standardId: 11, standardName: "KINDERGARTEN", nextGradeId: 12, nextGrade: "GRADE 1", label: "Grade K" },
        1: { standardId: 12, standardName: "GRADE 1", nextGradeId: 13, nextGrade: "GRADE 2", label: "Grade 1" },
        2: { standardId: 13, standardName: "GRADE 2", nextGradeId: 14, nextGrade: "GRADE 3", label: "Grade 2" },
        3: { standardId: 14, standardName: "GRADE 3", nextGradeId: 15, nextGrade: "GRADE 4", label: "Grade 3" },
        4: { standardId: 15, standardName: "GRADE 4", nextGradeId: 16, nextGrade: "GRADE 5", label: "Grade 4" },
        5: { standardId: 16, standardName: "GRADE 5", nextGradeId: 1, nextGrade: "GRADE 6", label: "Grade 5" },
        6: { standardId: 1, standardName: "GRADE 6", nextGradeId: 2, nextGrade: "GRADE 7", label: "Grade 6" },
        7: { standardId: 2, standardName: "GRADE 7", nextGradeId: 3, nextGrade: "GRADE 8", label: "Grade 7" },
        8: { standardId: 3, standardName: "GRADE 8", nextGradeId: 4, nextGrade: "GRADE 9", label: "Grade 8" },
        9: { standardId: 4, standardName: "GRADE 9", nextGradeId: 5, nextGrade: "GRADE 10", label: "Grade 9" },
        10: { standardId: 5, standardName: "GRADE 10", nextGradeId: 6, nextGrade: "GRADE 11", label: "Grade 10" },
        11: { standardId: 6, standardName: "GRADE 11", nextGradeId: 7, nextGrade: "GRADE 12", label: "Grade 11" },
        12: { standardId: 7, standardName: "GRADE 12", nextGradeId: 0, nextGrade: "", label: "Grade 12" }
    };
    var SUBJECT_ROWS = {
        K: [["LA", "Language Arts Grade K", "Language-Arts.jpg"], ["MATH", "Mathematics Grade K", "Mathematics.jpg"], ["SCI", "Science Grade K", "Science.jpg"], ["TECH", "Technology Grade K", "Technology-and-Research.jpg"], ["ART", "Art Grade K", "Fine-arts.jpg"], ["PE", "Physical Education Grade K", "Physical education.jpg"]],
        1: [["LA", "Language Arts Grade 1", "Language-Arts.jpg"], ["MATH", "Mathematics Grade 1", "Mathematics.jpg"], ["SCI", "Science Grade 1", "Science.jpg"], ["SOC", "Social Studies Grade 1", "Social-science.jpg"], ["ART", "Art Grade 1", "Fine-arts.jpg"], ["PE", "Physical Education Grade 1", "Physical education.jpg"]],
        2: [["LA", "Language Arts Grade 2", "Language-Arts.jpg"], ["MATH", "Mathematics Grade 2", "Mathematics.jpg"], ["SCI", "Science Grade 2", "Science.jpg"], ["SOC", "Social Studies Grade 2", "Social-science.jpg"], ["MUSIC", "Music Grade 2", "Music.jpg"], ["PE", "Physical Education Grade 2", "Physical education.jpg"]],
        3: [["LA", "Language Arts Grade 3", "Language-Arts.jpg"], ["MATH", "Mathematics Grade 3", "Mathematics.jpg"], ["SCI", "Science Grade 3", "Science.jpg"], ["SOC", "Social Studies Grade 3", "Social-science.jpg"], ["COMP", "Computer Basics Grade 3", "Computer Basics.jpg"], ["ART", "Art Grade 3", "Fine-arts.jpg"]],
        4: [["LA", "Language Arts Grade 4", "Language-Arts.jpg"], ["MATH", "Mathematics Grade 4", "Mathematics.jpg"], ["SCI", "Science Grade 4", "Science.jpg"], ["SOC", "Social Studies Grade 4", "Social-science.jpg"], ["TECH", "Technology and Research Grade 4", "Technology-and-Research.jpg"], ["PE", "Physical Education Grade 4", "Physical education.jpg"]],
        5: [["LA", "Language Arts Grade 5", "Language-Arts.jpg"], ["MATH", "Mathematics Grade 5", "Mathematics.jpg"], ["SCI", "Science Grade 5", "Science.jpg"], ["SOC", "Social Studies Grade 5", "Social-science.jpg"], ["COMP", "Computer Science Grade 5", "computer-science.jpg"], ["HEALTH", "Health Grade 5", "Health.jpg"]],
        6: [["ENG", "English Grade 6", "English.jpg"], ["MATH", "Math Grade 6", "Math.jpg"], ["SCI", "Science Grade 6", "Science.jpg"], ["SOC", "Social Science Grade 6", "Social-science.jpg"], ["TECH", "Technology Grade 6", "Technology-and-Research.jpg"], ["PE", "Physical Education Grade 6", "Physical education.jpg"]],
        7: [["ENG", "English Grade 7", "English.jpg"], ["MATH", "Math Grade 7", "Math.jpg"], ["SCI", "Science Grade 7", "Science.jpg"], ["HIST", "History Grade 7", "History.jpg"], ["GEO", "Geography Grade 7", "Geography.jpg"], ["COMP", "Computer Science Grade 7", "computer-science.jpg"]],
        8: [["ENG", "English Grade 8", "English.jpg"], ["PREALG", "Pre-Algebra Grade 8", "Pre-Algebra.jpg"], ["SCI", "Physical Science Grade 8", "Physical-Science.jpg"], ["HIST", "World History Grade 8", "World History.jpg"], ["TECH", "Information Technology Grade 8", "IT.jpg"], ["ART", "Fine Arts Grade 8", "Fine-arts.jpg"]],
        9: [["ENG", "English 9", "English.jpg"], ["ALG1", "Algebra 1", "Algebra-1.jpg"], ["BIO", "Biology", "Biology.jpg"], ["WH", "World History", "World History.jpg"], ["SPAN", "Spanish", "spanish.jpg"], ["PE", "Physical Fitness", "Physical-Fitness.jpg"]],
        10: [["ENG", "English 10", "English.jpg"], ["GEO", "Geometry", "geometry.jpg"], ["CHEM", "Chemistry", "chemistry.jpg"], ["GOV", "Government and Politics", "Comparative-Government-and-Politics.jpg"], ["COMP", "Computer Science", "computer-science.jpg"], ["HEALTH", "Health", "Health.jpg"]],
        11: [["ENG", "English 11", "English.jpg"], ["ALG2", "Algebra 2", "Algebra-2.jpg"], ["PHY", "Physics", "Physics.jpg"], ["ECON", "Economics", "Economics.jpg"], ["PSY", "Psychology", "Psychology.jpg"], ["CS", "Computer Science", "computer-science.jpg"]],
        12: [["ENG", "English 12", "English.jpg"], ["PRECAL", "Pre-Calculus", "Pre-Calculus.jpg"], ["ENV", "Environmental Studies", "ENVIRONMENTAL-STUDIES.jpg"], ["GOV", "Government and Politics", "Comparative-Government-and-Politics.jpg"], ["FIN", "Personal Financial Literacy", "Personal-Financial-Literacy.jpg"], ["MEDIA", "Media Studies", "Media-Studies.jpg"]]
    };
    var TEACHERS = ["Ms. Olivia Parker", "Ms. Emma Johnson", "Mr. Daniel Carter", "Ms. Sophia Williams", "Mr. Ethan Brooks", "Ms. Ava Thompson", "Dr. Mia Roberts", "Mr. Noah Anderson", "Ms. Lily Morgan", "Mr. Liam Foster", "Ms. Grace Bennett", "Mr. Lucas Rivera", "Ms. Isabella Clark", "Ms. Chloe Adams", "Mr. Henry Lee"];
    var ACTIVITY_ROWS = {
        K: ["Creative Play", "Story Circle"],
        1: ["Reading Club", "Math Games"],
        2: ["Spelling Bee", "Puzzle Lab"],
        3: ["Science Discovery", "Book Talk"],
        4: ["Research Skills", "Creative Writing"],
        5: ["STEM Lab", "Public Speaking"],
        6: ["Robotics Club", "Debate Basics"],
        7: ["History Quest", "Geography Challenge"],
        8: ["Pre-Algebra Practice", "World History Club"],
        9: ["Biology Lab Prep", "Spanish Conversation"],
        10: ["Chemistry Practice", "Civic Awareness"],
        11: ["Economics Forum", "Physics Problem Solving"],
        12: ["College Readiness", "Financial Literacy Lab"]
    };
    var GRADE_KEYS = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
    var DUMMY_STUDENT_TIMEZONE = "America/New_York";
    var DUMMY_STUDENT_FEE_STRUCTURE = {
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
    var SOURCE = {};
    var DB_DATA_LOADED = false;
    var DB_ROWS = [];

    function params() { try { return new URLSearchParams(window.location.search || ""); } catch (e) { return { get: function () { return null; } }; } }
    function yes(v) { return v === true || v === "Y" || v === "y" || v === "1" || v === "true" || v === "TRUE"; }
    function pad(v) { return v < 10 ? "0" + v : "" + v; }
    function fmt(dt) { return typeof moment === "function" ? moment(dt).format("YYYY-MM-DD HH:mm:ss") : dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate()) + " " + pad(dt.getHours()) + ":" + pad(dt.getMinutes()) + ":" + pad(dt.getSeconds()); }
    function fdate(dt) { return typeof moment === "function" ? moment(dt).format("YYYY-MM-DD") : dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate()); }
    function plusDays(dt, days) { var n = new Date(dt.getTime()); n.setDate(n.getDate() + days); return n; }
    function plusMinutes(dt, mins) { return new Date(dt.getTime() + mins * 60000); }
    function plusMonths(dt, months) { var n = new Date(dt.getTime()); n.setMonth(n.getMonth() + months); return n; }
    function gradeKeyByStandardId(id) { id = String(id || "").trim(); for (var k in GRADE_CONFIG) { if (GRADE_CONFIG.hasOwnProperty(k) && String(GRADE_CONFIG[k].standardId) === id) return k; } return ""; }
    function gradeKeyByLabel(label) {
        label = String(label || "").trim().toUpperCase();
        if (!label) return "";
        if (label === "K" || label === "KG" || label === "GRADE K" || label === "KINDERGARTEN") return "K";
        var match = label.match(/(?:GRADE\s*)?(\d{1,2})/);
        return match && GRADE_CONFIG[match[1]] ? match[1] : "";
    }
    function pageStandardId() { return typeof $ === "function" && $("#standardId").length && $("#standardId").val() ? $("#standardId").val() : ""; }
    function globalStandardId() {
        if (typeof USER_STANDARD_ID !== "undefined" && USER_STANDARD_ID) return USER_STANDARD_ID;
        if (window.USER_STANDARD_ID) return window.USER_STANDARD_ID;
        return "";
    }
    function queryGradeKey() {
        return gradeKeyByStandardId(params().get("dummyStandardId"))
            || gradeKeyByStandardId(params().get("standardId"))
            || gradeKeyByLabel(params().get("dummyGrade"))
            || gradeKeyByLabel(params().get("grade"));
    }
    function demoContextPayload() {
        return {
            userId: typeof USER_ID !== "undefined" ? USER_ID : "",
            demoFeedUserId: params().get("demoFeedUserId") || "",
            demoDataId: params().get("demoDataId") || "",
            demoStudentName: params().get("demoStudentName") || "",
            demoLearningProgram: params().get("demoLearningProgram") || "",
            demoLearningProgramName: params().get("demoLearningProgramName") || "",
            demoGradeId: params().get("demoGradeId") || "",
            demoGradeName: params().get("demoGradeName") || "",
            demoCourseId: params().get("demoCourseId") || "",
            demoCourseName: params().get("demoCourseName") || "",
            dummyLmsUserId: params().get("dummyLmsUserId") || ""
        };
    }
    function selectedDemoCourseId() {
        return String(params().get("demoCourseId") || "").trim();
    }
    function selectedDemoCourseName() {
        return cleanCourseName(params().get("demoCourseName") || "");
    }
    function matchesSelectedDemoCourse(row) {
        var courseId = selectedDemoCourseId(), courseName = selectedDemoCourseName();
        if (!courseId && !courseName) {
            return true;
        }
        row = row || {};
        var rowCourseId = String(row.courseId || "").trim();
        var rowCourseName = cleanCourseName(row.courseName || "");
        return (!!courseId && (rowCourseId === courseId || rowCourseName === cleanCourseName(courseId)))
            || (!!courseName && (rowCourseName === courseName || rowCourseId === courseName));
    }
    function hydrateDbRows() {
        if (DB_DATA_LOADED || !(typeof $ === "function") || !window.isDummyStudentMode || !window.isDummyStudentMode()) {
            return;
        }
        DB_DATA_LOADED = true;
        try {
            const [type, entityId, counselorUserId] = DEMO_DASHBOARD_USER.split("|");
            $.ajax({
                type: "POST",
                contentType: APPLICATION_JSON_VALUE,
                url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/student/demo-data",
                data: JSON.stringify({
                    userId: USER_ID,
                    entityId: entityId,
                    demoFeedUserId: counselorUserId
                }),
                dataType: "json",
                async: false,
                global: false,
                success: function (response) {
                    if (response && response.status == "1" && response.details && response.details.length > 0) {
                        DB_ROWS = (response.details || []).filter(matchesSelectedDemoCourse);
                        syncDummyStudentProfileName();
                    }
                }
            });
        } catch (e) {
            console.warn("Unable to load student dashboard demo data", e);
        }
    }
    function dbRows() {
        hydrateDbRows();
        return DB_ROWS || [];
    }
    function hasDbRows() {
        return dbRows().length > 0;
    }
    function hasDemoContext() {
        var payload = demoContextPayload();
        return !!(payload.demoDataId || payload.demoFeedUserId || payload.demoStudentName || payload.demoLearningProgram || payload.demoGradeId
            || payload.demoGradeName || payload.demoCourseId || payload.demoCourseName);
    }
    function firstDbRow() {
        return hasDbRows() ? dbRows()[0] : null;
    }
    function dummyLmsUserId() {
        var row = firstDbRow();
        return String(params().get("dummyLmsUserId") || (row && row.dummyLmsUserId) || "").trim();
    }
    function dummyLmsProviderUrl() {
        var lmsUserId = dummyLmsUserId();
        if (!lmsUserId) {
            return "";
        }
        return APP_BASE_URL + SCHOOL_UUID + "/lms-platform/redirect-dummy-user-to-LMS/" + (typeof UNIQUEUUID !== "undefined" ? UNIQUEUUID : "") + "?dummyLmsUserId=" + encodeURIComponent(lmsUserId);
    }
    function dbGradeKey() {
        var row = firstDbRow();
        return row ? (gradeKeyByStandardId(row.gradeId) || gradeKeyByLabel(row.gradeName)) : "";
    }
    function dbCount(fieldName, fallback) {
        var row = firstDbRow();
        if (!row) return fallback;
        var value = parseInt(row[fieldName] || 0, 10);
        return isNaN(value) || value < 0 ? 0 : value;
    }
    function configuredClassCount(fallback) {
        return hasDbRows() ? dbCount("classCount", fallback || 0) : fallback;
    }
    function configuredActivityCount(fallback) {
        return hasDbRows() ? dbCount("activityCount", fallback || 0) : fallback;
    }
    function cleanCourseName(courseName) {
        var cleaned = String(courseName || "")
            .replace(/\bv\d+(?:[._-]\d+)*\b/gi, " ")
            .replace(/\s*\((?:BUZZ(?:-[A-Z]+)?|GS|Honors?|Advanced|Standard|Regular)\)\s*/gi, " ")
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
    function feeGradeName() {
        var g = grade();
        if (gradeKey() === "K" || /kindergarten|grade\s*k|^kg$/i.test(g.label || g.standardName || "")) {
            return "Kindergarten";
        }
        var match = String(g.label || g.standardName || "").match(/(\d{1,2})/);
        return match ? "Grade " + parseInt(match[1], 10) : "Grade 5";
    }
    function feeProgramKey() {
        var learningProgram = String(params().get("demoLearningProgramName") || params().get("demoLearningProgram") || "").toLowerCase();
        if (learningProgram.indexOf("group") >= 0 || learningProgram.indexOf("batch") >= 0) {
            return "group";
        }
        return "oneToOne";
    }
    function feePlan() {
        var feeGrade = feeGradeName();
        var structure = DUMMY_STUDENT_FEE_STRUCTURE[feeGrade] || DUMMY_STUDENT_FEE_STRUCTURE["Grade 5"];
        var programKey = feeProgramKey();
        return {
            gradeName: feeGrade,
            programKey: programKey,
            monthAmounts: structure[programKey] || structure.oneToOne,
            installmentTotal: structure.installment[programKey],
            lumpsumTotal: structure.lumpsum[programKey]
        };
    }
    function receiptStudentCode() {
        return "US" + String(uid()).replace(/\D/g, "").slice(-9);
    }
    function receiptCourses() {
        var list = subjects();
        return list.map(function (subject) {
            return cleanCourseName(subject.subjectName || subject.subjectTitle || "Course") + " (1.0 Credit)";
        });
    }
    function receiptBasePath() {
        return APP_BASE_URL+'static/theme2/';
    }
    function receiptUrl(paymentId, paidDate) {
        var paidOn = typeof moment === "function" ? moment(paidDate).format("MMM DD, YYYY 11:00 AM") : displayDateOnly(paidDate) + " 11:00 AM";
        return receiptBasePath() + "dummy-parent-fee-receipt.html?studentId=" + encodeURIComponent(uid()) + "&paymentId=" + encodeURIComponent(paymentId) + "&paidOn=" + encodeURIComponent(paidOn);
    }
    function dummyInstallmentPaymentName(gradeName, installmentIndex) {
        var labels = ["1st", "2nd", "3rd"];
        return gradeName + " - " + (labels[installmentIndex] || (installmentIndex + 1) + "th") + " of 3 Months Installment";
    }
    function dummyReceiptNumber(paymentId, paidDate) {
        var date = paidDate || window.getDummyStudentBaseDate();
        var datePart = typeof moment === "function" ? moment(date).format("YYMMDD") : fdate(date).replace(/-/g, "").slice(2);
        var digits = String(paymentId || "").replace(/\D/g, "");
        return "REF" + datePart + (digits.slice(0, 4) || "0000") + "_" + (digits.slice(-5) || "00000");
    }
    function saveReceiptData(paymentId, receiptData) {
        try {
            var receiptMap = JSON.parse(localStorage.getItem("DUMMY_FEE_RECEIPT_DATA_BY_PAYMENT_ID") || "{}");
            receiptMap[String(paymentId)] = receiptData;
            localStorage.setItem("DUMMY_FEE_RECEIPT_DATA_BY_PAYMENT_ID", JSON.stringify(receiptMap));
        } catch (e) {
            console.warn("Unable to save dummy student receipt data", e);
        }
    }
    function buildReceiptData(payment, paidOnText) {
        var plan = feePlan();
        return {
            studentName: userName(),
            studentCode: receiptStudentCode(),
            countryCity: "United States | New York",
            learningPlan: params().get("demoLearningProgramName") || params().get("demoLearningProgram") || "One-to-One Learning",
            grade: plan.gradeName,
            parentName: userName(),
            location: "United States, New York",
            feeFor: payment.paymentName || dummyInstallmentPaymentName(plan.gradeName, payment.installmentIndex || 0),
            receiptNo: dummyReceiptNumber(payment.id, payment.payDate || window.getDummyStudentBaseDate()),
            paidOn: paidOnText,
            totalFee: payment.totalFeeWithMaterialFee,
            feeAmount: payment.totalFeeWithMaterialFee,
            courses: receiptCourses(),
            schedule: [[payment.paymentName || dummyInstallmentPaymentName(plan.gradeName, payment.installmentIndex || 0), payment.totalFeeWithMaterialFee, "RECEIVED"]]
        };
    }
    function subjectIconForCourseName(courseName) {
        var name = String(courseName || "").toLowerCase();
        if (name.indexOf("spanish") >= 0) return "spanish.jpg";
        if (name.indexOf("world history") >= 0) return "World History.jpg";
        if (name.indexOf("history") >= 0) return "History.jpg";
        if (name.indexOf("math") >= 0 || name.indexOf("algebra") >= 0 || name.indexOf("geometry") >= 0) return "Mathematics.jpg";
        if (name.indexOf("science") >= 0 || name.indexOf("biology") >= 0 || name.indexOf("physics") >= 0 || name.indexOf("chemistry") >= 0) return "Science.jpg";
        if (name.indexOf("english") >= 0 || name.indexOf("language arts") >= 0) return "English.jpg";
        if (name.indexOf("physical education") >= 0 || name.indexOf(" pe ") >= 0) return "Physical education.jpg";
        if (name.indexOf("computer") >= 0 || name.indexOf("technology") >= 0) return "computer-science.jpg";
        if (name.indexOf("economics") >= 0) return "Economics.jpg";
        return "World History.jpg";
    }
    function splitCommaValues(value) {
        return String(value || "")
            .split(",")
            .map(function (item) {
                return cleanCourseName(item);
            })
            .filter(function (item) {
                return !!item;
            });
    }
    function dbSubjectsByGradeKey(key) {
        if (!hasDbRows() || key !== dbGradeKey()) {
            return [];
        }
        var seen = {}, rows = [];
        for (var i = 0; i < dbRows().length; i++) {
            var row = dbRows()[i], courseNames = splitCommaValues(row.courseName || ""), courseIds = splitCommaValues(row.courseId || "");
            for (var courseIndex = 0; courseIndex < courseNames.length; courseIndex++) {
                var courseName = courseNames[courseIndex], rawCourseId = courseIds[courseIndex] || courseName;
                if (!courseName) continue;
                var subjectId = parseInt(rawCourseId || 0, 10);
                var uniqueKey = courseName.toLowerCase();
                if (seen[uniqueKey]) continue;
                seen[uniqueKey] = true;
                rows.push({
                    subjectId: subjectId || (9300001 + i * 100 + courseIndex),
                    subjectCode: String(rawCourseId || "COURSE-" + (i + 1) + "-" + (courseIndex + 1)),
                    subjectName: courseName,
                    subjectIcon: subjectIconForCourseName(courseName),
                    sourceRow: row,
                    teachers: [TEACHERS[((i + courseIndex) * 2) % TEACHERS.length], TEACHERS[((i + courseIndex) * 2 + 1) % TEACHERS.length], TEACHERS[((i + courseIndex) * 2 + 2) % TEACHERS.length]]
                });
            }
        }
        return rows;
    }
    function rememberGradeKey(key) {
        try {
            if (key && typeof USER_ID !== "undefined" && USER_ID) {
                window.sessionStorage.setItem("DUMMY_STUDENT_GRADE_KEY_" + USER_ID, key);
            }
        } catch (e) {}
        return key;
    }
    function rememberedGradeKey() {
        try {
            return typeof USER_ID !== "undefined" && USER_ID ? (window.sessionStorage.getItem("DUMMY_STUDENT_GRADE_KEY_" + USER_ID) || "") : "";
        } catch (e) {
            return "";
        }
    }
    function gradeKey() {
        return rememberGradeKey(
            dbGradeKey()
            || queryGradeKey()
            || gradeKeyByStandardId(globalStandardId())
            || gradeKeyByStandardId(SOURCE.standardId)
            || gradeKeyByStandardId(pageStandardId())
            || rememberedGradeKey()
            || "K"
        );
    }
    function grade() { return GRADE_CONFIG[gradeKey()] || GRADE_CONFIG.K; }
    function offset() { var idx = GRADE_KEYS.indexOf(gradeKey()); return idx < 0 ? 0 : idx; }
    function subjectsByGradeKey(key) {
        var dbSubjects = hasDbRows() ? dbSubjectsByGradeKey(dbGradeKey() || key) : [];
        if (dbSubjects.length > 0) {
            return dbSubjects;
        }
        if (hasDemoContext()) {
            return [];
        }
        var rows = SUBJECT_ROWS[key] || SUBJECT_ROWS.K, list = [];
        for (var i = 0; i < rows.length; i++) {
            list.push({ subjectId: 9300001 + offset() * 100 + i, subjectCode: "G" + key + "-" + rows[i][0], subjectName: rows[i][1], subjectIcon: rows[i][2], teachers: [TEACHERS[(i * 2 + offset()) % TEACHERS.length], TEACHERS[(i * 2 + offset() + 1) % TEACHERS.length], TEACHERS[(i * 2 + offset() + 2) % TEACHERS.length]] });
        }
        return list;
    }
    function subjects() { 
        return subjectsByGradeKey(gradeKey());
    }
    function tz() { 
        return DUMMY_STUDENT_TIMEZONE;
    }
    function schoolId() {
         return typeof SCHOOL_ID !== "undefined" && SCHOOL_ID ? SCHOOL_ID : 1; 
    }
    function demoDashboardProfileName() {
        if (typeof commonProfileDTO === "object" && commonProfileDTO && commonProfileDTO.profileName) {
            window.USER_FULL_NAME = commonProfileDTO.profileName;
            $(".header-user-info .widget-heading").text(commonProfileDTO.profileName);
            $(".dropdown-menu-header .widget-heading").text(commonProfileDTO.profileName + ", ");
            $("title").text($("title").text().replace(/^\s*[^|]+(\s*\|\s*Dashboard\s*)$/i, commonProfileDTO.profileName + "$1"));
            return commonProfileDTO.profileName;
        }
        return window.DEMO_DASHBOARD_PROFILE_NAME || "";
    }
    function userName() {
         var row = firstDbRow();
         return demoDashboardProfileName() || (row && row.studentName) || params().get("demoStudentName") || SOURCE.userName || (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME ? USER_FULL_NAME : "Demo Student");
    }
    function syncDummyStudentProfileName() {
        if (!window.isDummyStudentMode || !window.isDummyStudentMode() || !hasDemoContext()) {
            return;
        }
        var name = String(userName() || "").trim();
        if (!name) {
            return;
        }
        try {
            window.USER_FULL_NAME = name;
        } catch (e) {}
        window.DUMMY_STUDENT_PROFILE_NAME = name;
        if (typeof $ !== "function") {
            return;
        }
        $(".header-user-info .widget-heading").text(name);
        $(".dropdown-menu-header .widget-heading").text(name + ", ");
        $("title").text($("title").text().replace(/^\s*[^|]+(\s*\|\s*Dashboard\s*)$/i, name + "$1"));
    }
    function scheduleDummyStudentProfileNameSync() {
        var attempts = 0;
        syncDummyStudentProfileName();
        if (typeof $ !== "function") {
            return;
        }
        var timer = window.setInterval(function () {
            syncDummyStudentProfileName();
            attempts++;
            if (attempts >= 20) {
                window.clearInterval(timer);
            }
        }, 250);
    }
    function uid() { 
        return SOURCE.userId || (9000001 + offset()); 
    }
    function studentId() { return SOURCE.studentId || SOURCE.studentUserId || (9100001 + offset()); }
    function studentStandardId() { return SOURCE.studentStandardId || (9200001 + offset()); }
    function imageBase() {
        var base = typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2 : "";
        var contextPath = typeof CONTEXT_PATH !== "undefined" ? CONTEXT_PATH : "";
        if (contextPath && contextPath.charAt(contextPath.length - 1) !== "/") contextPath += "/";
        if (base.indexOf("/static/") === 0 && contextPath && base.indexOf(contextPath) !== 0) {
            return contextPath.replace(/\/$/, "") + base;
        }
        if (/^https?:\/\/[^/]+\/static\//.test(base) && contextPath) {
            return base.replace(/^(https?:\/\/[^/]+)(\/static\/)/, "$1" + contextPath.replace(/\/$/, "") + "$2");
        }
        return base;
    }
    function img(s) { return imageBase() + "subjects/" + s.subjectIcon; }
    function safeTeacherName(value) {
        value = String(value == null ? "" : value).trim();
        return value && value.toLowerCase() !== "undefined" && value.toLowerCase() !== "null" ? value : "";
    }
    function teacher(s, i) {
        var teachers = ((s && s.teachers) || []).map(safeTeacherName).filter(function (name) { return !!name; });
        return teachers.length ? teachers[i % teachers.length] : TEACHERS[i % TEACHERS.length];
    }
    function teacherList(s) {
        var teachers = ((s && s.teachers) || []).map(safeTeacherName).filter(function (name) { return !!name; });
        return teachers.length ? teachers : [teacher(s, 0)];
    }
    function dummyStudentScheduleResponse() {
        var base = window.getDummyStudentBaseDate();
        var list = subjects();
        var schedule = [];
        var classCount = Math.max(3, Math.min(configuredClassCount(3) || 3, 5));
        if (!list.length) {
            var fallbackRows = SUBJECT_ROWS[gradeKey()] || SUBJECT_ROWS.K || [];
            list = fallbackRows.map(function (row, index) {
                return {
                    subjectId: 9300001 + offset() * 100 + index,
                    subjectCode: "G" + gradeKey() + "-" + row[0],
                    subjectName: row[1],
                    subjectIcon: row[2],
                    teachers: [TEACHERS[(index * 2 + offset()) % TEACHERS.length], TEACHERS[(index * 2 + offset() + 1) % TEACHERS.length]]
                };
            });
        }
        for (var i = 0; i < classCount && i < list.length; i++) {
            var subject = list[i % list.length];
            var start = i === 0 ? plusMinutes(base, -15) : new Date(base.getFullYear(), base.getMonth(), base.getDate(), 10 + i * 2, 0, 0);
            var end = plusMinutes(start, 90);
            var courseName = cleanSubjectName(subject.subjectName || subject.subjectTitle || "Demo Class");
            schedule.push(applyTeacherFields({
                id: "dummy-student-schedule-" + (i + 1),
                title: courseName,
                eventTitle: courseName,
                courseName: courseName,
                subjectName: courseName,
                start: fmt(start),
                end: fmt(end),
                timezone: tz(),
                classStatus: i === 0 ? "Live" : "Upcoming",
                eventType: "ONE_TO_ONE",
                category: "CLASS",
                icon: img(subject),
                url: "dummy-student-class://dummy-student-schedule-" + (i + 1),
                grade: grade().label,
                session: i === 0 ? "Live Demo" : "Demo"
            }, teacher(subject, i)));
        }
        return { status: "1", statusCode: "S001", message: "Dummy student schedule success", details: { schedule: schedule } };
    }
    function dummyStudentAttendanceResponse() {
        var base = window.getDummyStudentBaseDate();
        var monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        var currentMonth = base.getMonth();
        var overview = [];
        for (var i = 0; i <= currentMonth; i++) {
            overview.push({
                monthKey: base.getFullYear() + "-" + pad(i + 1),
                monthLabel: monthsList[i],
                attendancePercent: Math.min(96, 76 + i + (offset() % 4)),
                classesAttendedCount: 18 + (i % 5),
                late: i % 3,
                earlyLeave: i % 2,
                absent: i % 2,
                year: base.getFullYear(),
                monthIndex: i
            });
        }
        var activeMonth = overview[overview.length - 1] || {};
        var schedule = dummyStudentScheduleResponse().details.schedule || [];
        var summary = {
            classesToday: schedule.length,
            attendancePercentThisMonth: activeMonth.attendancePercent || 84,
            attendanceDeltaFromLastMonth: 7,
            latePercentThisMonth: 1,
            lateDeltaFromLastMonth: 1,
            classesAttendedCount: activeMonth.classesAttendedCount || 20,
            late: activeMonth.late || 1,
            earlyLeave: activeMonth.earlyLeave || 0,
            absent: activeMonth.absent || 1,
            year: base.getFullYear(),
            monthIndex: currentMonth
        };
        return { status: "1", statusCode: "S001", message: "Dummy student attendance success", details: { summary: summary, attendanceOverview: overview } };
    }
    function dummyStudentLoginHistoryResponse() {
        var base = window.getDummyStudentBaseDate();
        var rows = [
            { start: plusMinutes(base, -95), end: plusMinutes(base, -45), location: "New York, United States", duration: "50 mins" },
            { start: plusDays(base, -1), end: plusMinutes(plusDays(base, -1), 42), location: "New York, United States", duration: "42 mins" },
            { start: plusDays(base, -2), end: plusMinutes(plusDays(base, -2), 55), location: "New York, United States", duration: "55 mins" },
            { start: plusDays(base, -4), end: plusMinutes(plusDays(base, -4), 38), location: "New York, United States", duration: "38 mins" }
        ];
        var loginHistories = rows.map(function (row) {
            return {
                loginTime: displayDateOnly(row.start) + " " + displayTime(row.start),
                logOutTime: displayDateOnly(row.end) + " " + displayTime(row.end),
                loginLocation: row.location,
                totalLoginDuretion: row.duration
            };
        });
        return {
            status: "1",
            statusCode: "S001",
            message: "Dummy student login history success",
            details: {
                studentName: userName(),
                firstLogin: loginHistories[loginHistories.length - 1].loginTime,
                lastLogin: loginHistories[0].loginTime,
                duration: loginHistories[0].totalLoginDuretion,
                totalLoginDuretion: "3 hrs 5 mins",
                loginHistories: loginHistories
            }
        };
    }
    function dummyStudentAssignedTeacherResponse() {
        var schedule = dummyStudentScheduleResponse().details.schedule || [];
        return {
            status: "1",
            statusCode: "S001",
            message: "Dummy student assigned teachers success",
            details: {
                assignedTeachers: schedule.map(function (row) {
                    return {
                        selectedCourses: row.courseName || row.subjectName || "Course",
                        courseName: row.courseName || row.subjectName || "Course",
                        subjectName: row.courseName || row.subjectName || "Course",
                        teacherAssignedForTeacherSupport: row.teacherName || row.name || "Teacher",
                        teacherName: row.teacherName || row.name || "Teacher"
                    };
                })
            }
        };
    }
    function dummyStudentClassSummaryResponse(meetingId) {
        var schedule = dummyStudentScheduleResponse().details.schedule || [];
        var event = schedule[0] || {};
        for (var i = 0; i < schedule.length; i++) {
            if (String(schedule[i].id) === String(meetingId) || String(schedule[i].meetingId || "") === String(meetingId)) {
                event = schedule[i];
                break;
            }
        }
        var start = event.start ? new Date(String(event.start).replace(" ", "T")) : window.getDummyStudentBaseDate();
        var end = event.end ? new Date(String(event.end).replace(" ", "T")) : plusMinutes(start, 90);
        return {
            status: "1",
            statusCode: "S001",
            message: "Dummy student class summary success",
            details: {
                studentName: userName(),
                studentId: uid(),
                profilePic: (typeof PATH_FOLDER_FONT2 !== "undefined" ? PATH_FOLDER_FONT2 : "") + "dummy-user.png",
                attendanceStatus: "Present",
                subjectName: event.courseName || event.subjectName || "Demo Class",
                teacherName: event.teacherName || event.name || "Teacher",
                classDate: displayDateOnly(start),
                classTime: displayTime(start) + " - " + displayTime(end),
                classDuration: "90 minutes",
                summaryDetails: [
                    { title: "Overview", summary: "The student attended the demo class and reviewed the key learning points for " + (event.courseName || event.subjectName || "the course") + "." },
                    { title: "Next Steps", summary: "Revise today's class notes and keep the practice worksheet ready for the next session." }
                ]
            }
        };
    }
    function dummyStudentDiaryThreads() {
        var schedule = dummyStudentScheduleResponse().details.schedule || [];
        var firstClass = schedule[0] || { courseName: "Language Arts", teacherName: "Olivia Parker", teacherGender: "FEMALE" };
        return [
            {
                threadId: "dummy-student-teacher-" + uid(),
                studentUserId: String(typeof USER_ID !== "undefined" ? USER_ID : uid()),
                studentName: userName(),
                teacherName: firstClass.teacherName || firstClass.name || "Olivia Parker",
                teacherGender: firstClass.teacherGender || firstClass.senderGender || "FEMALE",
                chatWithRole: "TEACHER",
                latestMessage: "Please revise today's " + (firstClass.courseName || "Language Arts") + " notes before the next class.",
                unreadCount: 1,
                profilePic: "",
                learningProgram: params().get("demoLearningProgram") || "ONE_TO_ONE",
                threadStatus: "OPEN"
            },
            {
                threadId: "dummy-student-school-" + uid(),
                studentUserId: String(typeof USER_ID !== "undefined" ? USER_ID : uid()),
                studentName: userName(),
                teacherName: "School Office",
                teacherGender: "DONOTWANTTOSPECIFY",
                chatWithRole: "SCHOOL",
                latestMessage: "Your monthly progress review is available in the dashboard.",
                unreadCount: 0,
                profilePic: "",
                learningProgram: params().get("demoLearningProgram") || "ONE_TO_ONE",
                threadStatus: "OPEN"
            }
        ];
    }
    function dummyStudentDiaryMessages(threadId) {
        var base = window.getDummyStudentBaseDate();
        var threads = dummyStudentDiaryThreads();
        var teacherThread = threads[0];
        var schoolThread = threads[1];
        var isSchoolThread = String(threadId) === String(schoolThread.threadId);
        var teacherName = teacherThread.teacherName || "Olivia Parker";
        var courseName = (dummyStudentScheduleResponse().details.schedule[0] || {}).courseName || "Language Arts";
        var messages = isSchoolThread ? [
            {
                id: schoolThread.threadId + "-1",
                senderRole: "SCHOOL",
                senderName: "School Office",
                senderGender: "DONOTWANTTOSPECIFY",
                message: "Hello " + userName() + ", your monthly progress review is available in the dashboard. Please review it before Friday.",
                createdAt: plusDays(base, -3).toISOString(),
                mentions: []
            },
            {
                id: schoolThread.threadId + "-2",
                senderRole: "STUDENT",
                senderName: userName(),
                senderUserId: typeof USER_ID !== "undefined" ? USER_ID : uid(),
                message: "Thank you. I will review the progress report today.",
                createdAt: plusDays(base, -2).toISOString(),
                mentions: [{ userName: "School Office", roleType: "SCHOOL" }]
            },
            {
                id: schoolThread.threadId + "-3",
                senderRole: "SCHOOL",
                senderName: "School Office",
                senderGender: "DONOTWANTTOSPECIFY",
                message: "Great. Your attendance record for this month is also updated.",
                createdAt: plusDays(base, -1).toISOString(),
                mentions: []
            }
        ] : [
            {
                id: teacherThread.threadId + "-1",
                senderRole: "TEACHER",
                senderName: teacherName,
                teacherName: teacherName,
                teacherGender: teacherThread.teacherGender,
                senderGender: teacherThread.teacherGender,
                message: "Hi " + userName() + ", you answered the comprehension questions well in today's class.",
                createdAt: plusDays(base, -2).toISOString(),
                mentions: []
            },
            {
                id: teacherThread.threadId + "-2",
                senderRole: "STUDENT",
                senderName: userName(),
                senderUserId: typeof USER_ID !== "undefined" ? USER_ID : uid(),
                message: "Thank you. I will complete the worksheet before the next session.",
                createdAt: plusDays(base, -1).toISOString(),
                mentions: [{ userName: teacherName, roleType: "TEACHER" }]
            },
            {
                id: teacherThread.threadId + "-3",
                senderRole: "TEACHER",
                senderName: teacherName,
                teacherName: teacherName,
                teacherGender: teacherThread.teacherGender,
                senderGender: teacherThread.teacherGender,
                message: "Please revise today's " + courseName + " notes before the next class and keep your notebook ready.",
                createdAt: base.toISOString(),
                mentions: []
            }
        ];
        return {
            status: 1,
            details: {
                threadId: threadId,
                studentUserId: String(typeof USER_ID !== "undefined" ? USER_ID : uid()),
                sourceTimezone: tz(),
                threadStatus: "OPEN",
                courseName: isSchoolThread ? "" : courseName,
                messages: messages
            }
        };
    }
    function dummyStudentDiaryMentions() {
        var threads = dummyStudentDiaryThreads();
        return {
            status: 1,
            details: [
                { roleType: "STUDENT", userId: typeof USER_ID !== "undefined" ? USER_ID : uid(), userName: userName() },
                { roleType: "TEACHER", userId: 8800001 + offset(), userName: threads[0].teacherName || "Olivia Parker" },
                { roleType: "SCHOOL", userId: 1, userName: "School Office" }
            ]
        };
    }
    function applyTeacherFields(event, teacherName) {
        var safeName = safeTeacherName(teacherName) || "Teacher";
        event.salutation = "";
        event.name = safeName;
        event.teacherName = safeName;
        event.teacherFullName = safeName;
        event.classTeacherName = safeName;
        event.meetingTeacherName = safeName;
        event.teacherNames = [safeName];
        return event;
    }
    function cleanSubjectName(name) { return name.replace(/ Grade K$/i, "").replace(/ Grade \d+$/i, ""); }
    function activityNames() {
        var names = ACTIVITY_ROWS[gradeKey()] || ACTIVITY_ROWS.K;
        if (!hasDbRows()) {
            if (hasDemoContext()) {
                return [];
            }
            return names;
        }
        var count = configuredActivityCount(names.length);
        var rows = [];
        for (var i = 0; i < count; i++) {
            rows.push(names[i % names.length] || ("Activity " + (i + 1)));
        }
        return rows;
    }
    function activityTypeRows() {
        var names = activityNames(), rows = [];
        for (var i = 0; i < names.length; i++) {
            rows.push({ id: 5000 + offset() * 10 + i + 1, parentId: 0, activityName: names[i] });
        }
        return rows;
    }
    function activityDetails(baseDate) {
        var types = activityTypeRows(), rows = [];
        for (var i = 0; i < types.length; i++) {
            var start = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i + 1, 15 + i, 0, 0);
            rows.push({ id: 6000 + offset() * 10 + i + 1, meetingId: 0, activityTypeId: types[i].id, subActivityTypeId: 0, activityTitle: types[i].activityName, startDateTime: fmt(start), endDateTime: fmt(plusMinutes(start, 45)), joiningBefore: 15 });
        }
        return rows;
    }
    function displayDate(dt) { return typeof moment === "function" ? moment(dt).format("ddd MMM DD, YYYY") : dt.toDateString().replace(/^(\S+) (\S+) (\d+) (\d+)$/, "$1 $2 $3, $4"); }
    function displayDateOnly(dt) { return typeof moment === "function" ? moment(dt).format("MMM DD, YYYY") : dt.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }); }
    function displayTime(dt) { return typeof moment === "function" ? moment(dt).format("hh:mm A") : dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }); }
    function firstDayOfWeek(dt) { var d = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()); d.setDate(d.getDate() - d.getDay()); return d; }
    function dummySubjectById(subjectId) {
        var list = subjects();
        for (var i = 0; i < list.length; i++) {
            if (String(list[i].subjectId) === String(subjectId)) return list[i];
        }
        return list[0] || { subjectId: 0, subjectCode: "", subjectName: "", subjectIcon: "World History.jpg", teachers: [] };
    }
    function dummyBookClassSubjectRows() {
        var base = window.getDummyStudentBaseDate(), list = subjects(), rows = [];
        for (var i = 0; i < list.length; i++) {
            var total = configuredClassCount(12), booked = Math.min(total, i % 2), completed = Math.min(Math.max(total - booked, 0), i % 3), rescheduled = total > 1 && i === 1 ? 1 : 0, missedByYou = 0, missedByTeacher = total > 2 && i === 2 ? 1 : 0, expired = 0;
            rows.push({ img: img(list[i]), assignedTeacherCount: 1, name: list[i].subjectName, subjectId: list[i].subjectId, studentStandardId: studentStandardId(), teacherName: teacher(list[i], i), total: total, booked: booked, completed: completed, rescheduled: rescheduled, missedByYou: missedByYou, missedByTeacher: missedByTeacher, expired: expired, left: total - booked - completed - rescheduled - missedByYou - missedByTeacher - expired, complimentaryTotal: 2, extraClassTotal: 10, weekLeftClass: 3 });
        }
        return rows;
    }
    function dummyClassCount(subject) {
        return { img: subject.img, name: subject.name, subjectId: subject.subjectId, studentStandardId: subject.studentStandardId, total: subject.total, booked: subject.booked, completed: subject.completed, rescheduled: subject.rescheduled, missedByYou: subject.missedByYou, missedByTeacher: subject.missedByTeacher, expired: subject.expired, left: subject.left };
    }
    function isElementaryExtraClassGrade() {
        return ["K", "1", "2", "3", "4", "5"].indexOf(gradeKey()) !== -1;
    }
    function dummyExtraClassPlans() {
        if (isElementaryExtraClassGrade()) {
            return [
                { planId: 710010, planName: "plan-10", singleClassFee: 10, amount: 90, classCount: 10, saving: 10, validity: 4 },
                { planId: 710030, planName: "plan-30", singleClassFee: 10, amount: 275, classCount: 30, saving: 25, validity: 5 },
                { planId: 710050, planName: "plan-50", singleClassFee: 10, amount: 450, classCount: 50, saving: 50, validity: 5 },
                { planId: 710099, planName: "plan-custom", singleClassFee: 9, amount: 9, classCount: 1, saving: 0, validity: 5 }
            ];
        }
        return [
            { planId: 710001, planName: "plan-4", singleClassFee: 25, amount: 100, classCount: 4, saving: 20, validity: 4 },
            { planId: 710002, planName: "plan-8", singleClassFee: 25, amount: 180, classCount: 8, saving: 40, validity: 8 },
            { planId: 710003, planName: "plan-12", singleClassFee: 25, amount: 240, classCount: 12, saving: 60, validity: 12 },
            { planId: 710099, planName: "plan-custom", singleClassFee: 25, amount: 25, classCount: 1, saving: 0, validity: 12 }
        ];
    }
    function dummyExtraClassSubjects() {
        var base = window.getDummyStudentBaseDate(), list = subjects(), rows = [];
        if (isElementaryExtraClassGrade()) {
            var subjectId = gradeKey() === "K" ? grade().standardId : 6512 + parseInt(gradeKey(), 10);
            var gradeSubjects = SUBJECT_ROWS[gradeKey()] || SUBJECT_ROWS.K;
            var fallbackSubject = list[0] || { subjectIcon: gradeSubjects[0][2] };
            return [{ subjectId: subjectId, subjectName: grade().label, subjectCode: gradeKey() === "K" ? "GRADE-K" : "GRADE-" + gradeKey(), imgURl: img(fallbackSubject), enrollmentEndDate: fdate(plusMonths(base, 3)) }];
        }
        if (hasDbRows()) {
            for (var dbIndex = 0; dbIndex < list.length; dbIndex++) {
                rows.push({ subjectId: list[dbIndex].subjectId, subjectName: list[dbIndex].subjectName, subjectCode: list[dbIndex].subjectCode, imgURl: img(list[dbIndex]), enrollmentEndDate: fdate(plusMonths(base, 3)) });
            }
            return rows;
        }
        for (var i = 0; i < list.length; i++) {
            rows.push({ subjectId: list[i].subjectId, subjectName: list[i].subjectName, subjectCode: list[i].subjectCode, imgURl: img(list[i]), enrollmentEndDate: fdate(plusMonths(base, 3)) });
        }
        return rows;
    }
    function dummyExtraClassSubjectById(subjectId) {
        var list = dummyExtraClassSubjects();
        for (var i = 0; i < list.length; i++) {
            if (String(list[i].subjectId) === String(subjectId)) return list[i];
        }
        return list[0];
    }
    function dummyCartStorageKey() { return "DUMMY_EXTRA_CLASS_CART_" + uid(); }
    function readDummyCartItems() {
        try { return JSON.parse(window.localStorage.getItem(dummyCartStorageKey()) || "[]"); } catch (e) { return []; }
    }
    function writeDummyCartItems(items) {
        try { window.localStorage.setItem(dummyCartStorageKey(), JSON.stringify(items || [])); } catch (e) {}
    }
    function dummyCartItemFromPayload(payload) {
        payload = payload || {};
        var s = dummyExtraClassSubjectById(payload.subjectId), amount = parseFloat(payload.planAmount || payload.amount || 0), count = parseInt(payload.sessionCount || payload.classCount || 1, 10);
        if (!amount || amount < 0) amount = count * 25;
        return { cartId: 810000 + parseInt(s.subjectId, 10) + count, subjectId: s.subjectId, subjectName: s.subjectName, imgURl: s.imgURl, classCount: count, planAmount: amount, planStartDate: payload.planStartDate || fdate(window.getDummyStudentBaseDate()), planEndDate: payload.planEndDate || fdate(plusDays(window.getDummyStudentBaseDate(), 28)) };
    }
    function dummyCartDetailsFromItems(items) {
        items = items || readDummyCartItems();
        var total = 0, ids = [], subjectId = "";
        for (var i = 0; i < items.length; i++) { total += parseFloat(items[i].planAmount || 0); ids.push(items[i].cartId); subjectId = items[i].subjectId; }
        return { cartCount: items.length, cart: { cartItems: items, cartTotal: total, discountCode: "", cpDiscount: 0, totalPayAmount: total, bookSessionIds: ids.join(","), subjectId: subjectId, errorMsg: "" } };
    }
    function dummyAcademicPerformanceRows() {
        var base = window.getDummyStudentBaseDate(), list = subjects(), rows = [];
        for (var i = 0; i < list.length; i++) {
            var gradableProgress = Math.min(100, (i === 0 ? 0 : 4 + (i * 2)));
            var allProgress = Math.min(100, 3 + (i * 2));
            var score = i === 1 ? 100 : (i % 3 === 0 ? 0 : 82 + i);
            rows.push({
                lmsEnrollmentId: "DUMMY-STUDENT-ENROLL-" + uid() + "-" + (i + 1),
                lmsCourseId: String(list[i].subjectId || ("DUMMY-STUDENT-COURSE-" + (i + 1))),
                courseName: cleanCourseName(list[i].subjectName || "Course " + (i + 1)),
                score: score,
                progressPace: i % 4 === 2 ? "GettingStarted" : "OnTrack",
                teacherName: teacher(list[i], i),
                teacherGender: i % 2 === 0 ? "FEMALE" : "MALE",
                endDate: displayDateOnly(plusMonths(base, 9)),
                remainingDays: Math.max(1, Math.ceil((plusMonths(base, 9) - new Date()) / 86400000)),
                pendingAssignment: i === 2 ? 3 : i % 2,
                progressGradable: gradableProgress,
                progressAllActivity: allProgress
            });
        }
        return rows;
    }
    function dummyAcademicPerformanceCourse(lmsEnrollmentId, lmsCourseId) {
        var rows = dummyAcademicPerformanceRows();
        for (var i = 0; i < rows.length; i++) {
            if (String(rows[i].lmsEnrollmentId) === String(lmsEnrollmentId) || String(rows[i].lmsCourseId) === String(lmsCourseId)) {
                return rows[i];
            }
        }
        return rows[0] || {};
    }
    function dummyAcademicProgressDetail(lmsEnrollmentId, lmsCourseId) {
        var course = dummyAcademicPerformanceCourse(lmsEnrollmentId, lmsCourseId), base = window.getDummyStudentBaseDate();
        var totalAssignment = 8, pendingAssign = parseInt(course.pendingAssignment || 0, 10), submitted = Math.max(0, totalAssignment - pendingAssign - 1), items = [];
        for (var i = 0; i < totalAssignment; i++) {
            var submittedStatus = i < submitted ? "SUBMITTED" : (i === submitted ? "EXCUSED" : "");
            items.push({
                itemid: "DUMMY-STUDENT-ITEM-" + (i + 1),
                title: course.courseName + " Assignment " + (i + 1),
                duedate: displayDateOnly(plusDays(base, i * 5)),
                submitteddate: submittedStatus === "SUBMITTED" ? displayDateOnly(plusDays(base, (i * 5) - 1)) : "N/A",
                unitTimeSpent: "00:" + pad(24 + i) + ":00",
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
            submitOntimeAssign: submitted > 0 ? 1 : 0,
            submitLateAssign: 0,
            response: { enrollments: { enrollment: [{
                id: lmsEnrollmentId,
                startdate: displayDateOnly(plusMonths(base, -1)),
                enddate: course.endDate || displayDateOnly(plusMonths(base, 9)),
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
            }] } }
        };
    }
    function dummyAcademicGradeHistory(itemId) {
        var base = window.getDummyStudentBaseDate(), grades = [];
        for (var i = 0; i < 3; i++) {
            grades.push({
                lastactivitydate: displayDateOnly(plusDays(base, -i - 1)),
                attempts: i + 1,
                expTime: "00:" + pad(18 + (i * 4)) + ":00",
                achieved: 88 + i,
                possible: 100,
                percent: (88 + i) + "%",
                user: { firstname: userName().split(" ")[0] || "Demo", lastname: "Student" }
            });
        }
        return { code: "SUCCESS", response: { grades: { grade: grades } }, itemId: itemId };
    }
    function dummyStudentProgressReports() {
        var base = window.getDummyStudentBaseDate(), rows = [];
        for (var i = 0; i < 2; i++) {
            var reportEnd = plusDays(base, -(i * 7) - 3);
            var reportStart = plusDays(reportEnd, -6);
            rows.push({
                daysType: 7,
                reportStartDate: displayDateOnly(reportStart),
                reportEndDate: displayDateOnly(reportEnd),
                createdDate: displayDateOnly(plusDays(reportEnd, 1)),
                reportUrl: "dummy-student-progress-report://" + (i + 1)
            });
        }
        return rows;
    }
    function dummyStudentProgressReportIndex(url) {
        var match = String(url || "").match(/dummy-student-progress-report:\/\/(\d+)/);
        return match ? parseInt(match[1], 10) || 1 : 1;
    }
    function dummyStudentProgressReportStyle() {
        return ".student-progress-dummy-report{display:block!important;width:100%!important;max-width:none!important;min-width:100%!important}.student-progress-dummy-report .col,.student-progress-dummy-report .report-shell,.student-progress-dummy-report .main-card,.student-progress-dummy-report .card,.student-progress-dummy-report .card-body,.student-progress-dummy-report #enrollMentGrade{display:block!important;width:100%!important;max-width:none!important;flex:0 0 100%!important}.student-progress-dummy-report .body-tabs-shadow{box-shadow:none!important}.blue-border-table .table td,.blue-border-table .table th{border:1px solid #80bdff!important}.blue-border-table .table th{font-weight:600}.blue-border-table .bold{font-weight:700}.blue-border-table .right-title h3{color:#007fff;font-size:28px;margin-bottom:6px}.blue-border-table .right-title h4{font-size:20px}.blue-border-table .progress-summary-table td{font-size:15px}.blue-border-table .activity-report-table th,.blue-border-table .activity-report-table td{vertical-align:middle}.blue-border-table .site-logo img{max-width:240px}.blue-border-table .skew-border{height:8px;background:#007fff}.hideOnPrint{display:block}";
    }
    function dummyStudentProgressCourseHtml(course, reportIndex, index) {
        var base = window.getDummyStudentBaseDate();
        var reportEnd = plusDays(base, -((reportIndex - 1) * 7) - 3);
        var reportStart = plusDays(reportEnd, -6);
        var score = index === 1 ? 100 : (index % 3 === 0 ? 90 : 84 + index);
        var activityRows = "";
        for (var i = 0; i < 4; i++) {
            var percent = Math.min(100, score + (i % 2));
            activityRows += "<tr>"
                + "<td>" + pad(i + 1) + ".00</td>"
                + "<td>" + (i % 2 === 0 ? "QUIZ" : "ASSIGNMENT") + "</td>"
                + "<td style='text-align:left;'>" + cleanCourseName(course.subjectName) + " Activity " + (i + 1) + "</td>"
                + "<td>0:" + pad(18 + i * 4) + ":00</td>"
                + "<td>" + displayDateOnly(plusDays(reportStart, i + 2)) + "</td>"
                + "<td>" + displayDateOnly(plusDays(reportStart, i + 1)) + "</td>"
                + "<td>" + percent + "%</td>"
                + "<td>" + (percent >= 90 ? "A-" : "B") + "</td>"
                + "</tr>";
        }
        return "<div class='headerSection'>"
            + "<div class='page-head'><table cellspacing='0' cellpadding='5' style='width:100%;position:relative;top:0;' class='academic-details'><thead>"
            + "<tr><td><table style='margin:0;width:100%;'><tbody><tr>"
            + "<td align='left' style='border:0;'><table style='margin:0;width:100%;'><tbody>"
            + "<tr><td><div class='site-logo mb-1'><img src='" + imagePath() + "is_logo_2026_blue.png' style='max-width:240px;width:100%;float:left'></div></td></tr>"
            + "<tr><td><table class='tr-blue-border table table-striped table-bordered details-table text-left progress-summary-table mt-4'><tbody>"
            + "<tr><td><span class='bold'>Student Name: </span>" + userName() + "</td></tr>"
            + "<tr><td><span class='bold'>Grade: </span>" + grade().label + "</td></tr>"
            + "<tr><td><span class='bold'>Course: </span>" + cleanCourseName(course.subjectName) + "</td></tr>"
            + "</tbody></table></td></tr></tbody></table></td>"
            + "<td align='left' style='border:0;padding-left:20px'><table class='tr-blue-border table table-bordered progress-summary-table'><tbody>"
            + "<tr><td><span class='bold'>Academic Year Start Date: </span>" + displayDateOnly(plusMonths(base, -1)) + "</td></tr>"
            + "<tr><td><span class='bold'>Academic Year End Date: </span>" + displayDateOnly(plusMonths(base, 9)) + "</td></tr>"
            + "</tbody></table><table class='tr-blue-border table table-striped table-bordered details-table text-left progress-summary-table'><tbody>"
            + "<tr><td><span class='bold'>Student ID: </span>MEXDIDI" + (260600000 + uid()) + "</td></tr>"
            + "<tr><td><span class='bold'>Country: </span>Mexico</td></tr>"
            + "<tr><td><span class='bold'>Teacher Name: </span>" + teacher(course, index) + "</td></tr>"
            + "</tbody></table></td></tr></tbody></table></td></tr>"
            + "<tr><td colspan='2'><div class='right-part text-center mt-1 mb-2' style='width:auto;'><div class='right-title m-0'><h3 class='text-center text-uppercase bold'>Detailed Student Grading Report</h3><h4 class='text-uppercase bold'>Duration: " + displayDateOnly(reportStart) + " - " + displayDateOnly(reportEnd) + "</h4></div></div></td></tr>"
            + "</thead></table></div></div>"
            + "<div class='tab-pane tabs-animation fade show active'><div class='main-card mb-3' style='overflow-x:auto'>"
            + "<table class='blue-border table table-striped table-bordered dt-responsive text-center details-table activity-report-table' style='width:100%;'><thead><tr>"
            + "<th>Module | <span class='text-info'>Activity</span></th><th>Type</th><th>Activity Name</th><th>Time Spent<br>(hh:mm:ss)</th><th>Target Due Date</th><th>Submitted Date<br>(hh:mm:ss)</th><th>Percentage</th><th>Grade</th>"
            + "</tr></thead><tbody>" + activityRows + "</tbody></table>"
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
            + "<tr><td style='text-align:right;font-weight:bold'>Course Completion Percentage:</td><td class='pl-2'>" + Math.min(100, 72 + (index * 6)) + "%</td></tr>"
            + "</tbody></table></td></tr></tbody></table><br>"
            + "</div></div>";
    }
    function dummyStudentProgressReportHtml(url) {
        var reportIndex = dummyStudentProgressReportIndex(url);
        var list = subjects();
        var courseHtml = "";
        for (var i = 0; i < list.length; i++) {
            courseHtml += dummyStudentProgressCourseHtml(list[i], reportIndex, i);
        }
        return "<!doctype html><html><head><style id='gradebookSummaryStyleBlock'>" + dummyStudentProgressReportStyle() + "</style></head><body>"
            + "<div class='app-main pb-4 blue-border-table pt-0 student-progress-dummy-report'><div class='col p-0'><div class='app-main__inner p-0 report-shell'>"
            + "<div class='app-page-title mb-3 py-2 mt-2 hideOnPrint'><div class='page-title-wrapper'><div class='page-title-heading'><div class='page-title-icon'><i class='fas fa-university text-primary'></i></div><div>Grade book summary | " + userName() + "</div></div></div></div>"
            + "<div class='main-card mb-3 card body-tabs-shadow'><div class='card-body'><div class='tab-content' id='enrollMentGrade'>" + courseHtml + "</div>"
            + "<div class='text-center font-italic'>Note: This report has been graded by the teacher and is not system-generated.</div>"
            + "</div></div>"
            + "</div></div></div><script id='gradebookSummaryInitScript'></script></body></html>";
    }
    function money(v) { return parseFloat(v || 0).toFixed(2); }
    function dashboardUrl() { return window.location.href.split("?")[0]; }
    function imagePath() { return typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2 : "/static/theme2/images/"; }
    function dummyCheckoutAmount() {
        var details = dummyCartDetailsFromItems(readDummyCartItems());
        var amount = parseFloat(details.cart.totalPayAmount || 0);
        return amount > 0 ? amount : 90;
    }
    function dummyCheckoutEmail() {
        return SOURCE.email || (typeof USER_EMAIL !== "undefined" && USER_EMAIL ? USER_EMAIL : "giulina.gioia@gmail.com");
    }
    function renderDummyBookSessionPaymentOptionsModal(userPaymentDetailsId, schoolId) {
        var schoolName = typeof schoolSettingsOffice !== "undefined" && schoolSettingsOffice && schoolSettingsOffice.schoolName ? schoolSettingsOffice.schoolName : "International Schooling";
        var images = imagePath();
        var subHeading = schoolName + " is trusted by the safest and most reputed payment gateways, banks and wallets";
        var pgTick = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>`;
        var arrowIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`;
        return `<div id="dummyPaymentOptionsModal" class="modal fade pg-modal-v2" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog pg-dialog" role="document">
                <div class="modal-content pg-content">
                    <div class="modal-header primary-bg white-txt-color">
                        <button type="button" class="close close-with-red-color ml-auto" aria-label="Close" data-dismiss="modal" style="margin-right: 5px;">
                            <span style="color: #fff;">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="pg-layout">
                            <aside class="pg-sidebar">
                                <div class="choose_payment_title_on_mobile">
                                    <h3 class="pg-title text-left">Payment Options Available</h3>
                                    <p class="pg-subtitle">${subHeading}</p>
                                </div>
                                <ul class="nav pg-tablist" role="tablist">
                                    <li role="presentation" class="pg-tab-item">
                                        <a href="#dummy_payment_option_1" aria-controls="dummy_payment_option_1" role="tab" data-toggle="tab" class="pg-tab active">
                                            <span class="pg-tab-ico"><img src="${images}STRIPE.png" alt=""/></span>
                                            <span class="pg-tab-text">Option 1: Pay via Stripe</span>
                                        </a>
                                    </li>
                                    <li role="presentation" class="pg-tab-item">
                                        <a href="#dummy_payment_option_2" aria-controls="dummy_payment_option_2" role="tab" data-toggle="tab" class="pg-tab">
                                            <span class="pg-tab-ico"><img src="${images}airwallex_icon.png" alt=""/></span>
                                            <span class="pg-tab-text">Option 2: Pay via Airwallex</span>
                                        </a>
                                    </li>
                                </ul>
                                <div class="pg-trust">
                                    <div class="pg-trust-head">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path></svg>
                                        Secure &amp; Trusted
                                    </div>
                                    <ul class="pg-trust-list">
                                        <li>${pgTick} SSL Secured</li>
                                        <li>${pgTick} PCI-DSS Certified</li>
                                        <li>${pgTick} Global Gateways</li>
                                        <li>${pgTick} We never store your card details</li>
                                    </ul>
                                </div>
                            </aside>
                            <section class="pg-main">
                                <div class="choose_payment_title_on_desktop">
                                    <h3 class="pg-title text-left">Payment Options Available</h3>
                                    <p class="pg-subtitle">${subHeading}</p>
                                </div>
                                <div class="tab-content pg-panels">
                                    <div role="tabpanel" id="dummy_payment_option_1" class="tab-pane pg-panel active">
                                        <div class="pg-gateway-banner"><img class="payment_STRIPE" src="${images}STRIPE.png" alt=""></div>
                                        <div class="pg-methods">
                                            <div class="payment-method-icon" onclick="commonPayment('dummyPayButton1')" style="cursor:pointer"><img src="${images}visa.png"><p>Visa</p></div>
                                            <div class="payment-method-icon" onclick="commonPayment('dummyPayButton1')" style="cursor:pointer"><img src="${images}master-card.png"><p>Mastercard</p></div>
                                        </div>
                                        <div class="pg-actions">
                                            <div id="dummyPayButton1" class="pg-paynow" onclick="invokePaymentGateway('signupStage4','${userPaymentDetailsId}','${uid()}','${schoolId}','STRIPE','${schoolId}');">
                                                <span class="pg-paynow-text">Pay Now</span>${arrowIcon}
                                            </div>
                                        </div>
                                    </div>
                                    <div role="tabpanel" id="dummy_payment_option_2" class="tab-pane pg-panel">
                                        <div class="pg-gateway-banner"><img class="payment_Airwallex" src="${images}Airwallex.png" alt=""></div>
                                        <div class="pg-actions">
                                            <div id="dummyPayButton2" class="pg-paynow" onclick="invokePaymentGateway('signupStage4','${userPaymentDetailsId}','${uid()}','${schoolId}','Airwallex','${schoolId}');">
                                                <span class="pg-paynow-text">Pay Now</span>${arrowIcon}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                    <div class="modal-footer pg-footer">
                        <button type="button" class="pg-pay-mobile" onclick="payDummyActivePaymentOption()">
                            <span class="pg-paynow-text">Pay Now</span>${arrowIcon}
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }
    function syncDummyMobilePayButton() {
        var modalEl = document.getElementById("dummyPaymentOptionsModal");
        if (!modalEl) return;
        var footer = modalEl.querySelector(".pg-footer");
        if (!footer) return;
        var active = modalEl.querySelector(".pg-panel.active");
        var hasPayBtn = active && active.querySelector('[id^="dummyPayButton"]');
        footer.style.display = hasPayBtn ? "" : "none";
    }
    function bindDummyPaymentOptionMobileScroll() {
        $(document).off("shown.bs.tab.dummyPgMobileScroll").on("shown.bs.tab.dummyPgMobileScroll", "#dummyPaymentOptionsModal .pg-tab", function () {
            syncDummyMobilePayButton();
            if (!window.matchMedia || !window.matchMedia("(max-width: 767px)").matches) return;
            var modalEl = document.getElementById("dummyPaymentOptionsModal");
            var scroller = modalEl ? modalEl.querySelector(".modal-body") : null;
            var target = modalEl ? modalEl.querySelector(".pg-main") : null;
            if (!scroller || !target) return;
            var delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
            $(scroller).stop(true).animate({ scrollTop: scroller.scrollTop + delta - 8 }, 400);
        });
    }
    window.payDummyActivePaymentOption = function () {
        var modalEl = document.getElementById("dummyPaymentOptionsModal");
        if (!modalEl) return;
        var active = modalEl.querySelector(".pg-panel.active");
        var payBtn = active ? active.querySelector('[id^="dummyPayButton"]') : null;
        if (payBtn) { $(payBtn).trigger("click"); }
    };
    function renderDummyStripeCheckoutPage(paymentGateway) {
        var usd = dummyCheckoutAmount(), inr = usd * 98.2304, gateway = paymentGateway || "STRIPE", images = imagePath();
        return `<!doctype html>
            <html>
            <head>
                <title>INTERNATIONAL SCHOOLING</title>
                <style>
                    *{box-sizing:border-box}
                    body{margin:0;background:#fff;color:#30313d;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;font-size:16px}
                    .DummyStripePage{display:grid;grid-template-columns:380px 380px;column-gap:160px;justify-content:center;min-height:100vh;padding-top:58px}
                    .DummyStripePage:after{content:"";position:fixed;top:0;bottom:0;left:50%;width:1px;background:#f1f3f5}
                    .DummyStripeLeft,.DummyStripeRight{position:relative;z-index:1;background:#fff}
                    .DummyBack{font-size:24px;color:#aab1bd;text-decoration:none;margin-right:12px;font-weight:700;line-height:1}
                    .DummyBrand{display:flex;align-items:center;color:#30313d;font-size:16px;font-weight:600;letter-spacing:.01em;white-space:nowrap}
                    .DummyLogo{width:28px;height:28px;border-radius:50%;background:#1685fe;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:17px;margin-right:13px;box-shadow:0 2px 8px rgba(22,133,254,.2)}
                    .DummySandbox{font-size:14px;background:#16335a;color:#fff;border-radius:5px;padding:4px 10px;margin-left:10px;font-weight:700}
                    .DummyCurrencyTitle{margin-top:86px;font-size:18px;font-weight:600}
                    .DummyCurrencyRow{display:flex;gap:8px;margin-top:20px}
                    .DummyCurrency{height:48px;border:1px solid #e6e8eb;border-radius:6px;min-width:178px;display:flex;align-items:center;padding:0 16px;font-size:20px;font-weight:600;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.03)}
                    .DummyCurrency.active{border-color:#30313d;box-shadow:0 0 0 1px #30313d inset}
                    .DummyFlag{font-size:16px;margin-right:10px;color:#667085}
                    .DummyRate{font-size:14px;color:#697386;margin-top:10px}
                    .DummyRate span{text-decoration:underline;text-decoration-style:dotted}
                    .DummyFeeRow{margin-top:64px;display:flex;justify-content:space-between;font-size:16px;font-weight:600}
                    .DummyExpress{display:grid;grid-template-columns:1fr 1fr;gap:8px}
                    .DummyExpress button{height:58px;border:0;border-radius:5px;font-size:26px;font-weight:700;cursor:pointer}
                    .DummyApple{background:#000;color:#fff}
                    .DummyLink{background:#00d66f;color:#001b44}
                    .DummyDivider{display:flex;align-items:center;gap:12px;margin:28px 0 26px;color:#8a8f98;font-size:14px}
                    .DummyDivider:before,.DummyDivider:after{content:"";height:1px;background:#e6e8eb;flex:1}
                    .DummySectionTitle{font-size:17px;font-weight:600;margin:0 0 15px}
                    .DummyInput{height:52px;border:1px solid #e2e8f0;border-radius:6px;background:#fafafa;display:flex;align-items:center;padding:0 15px;color:#4b5563;margin-bottom:32px;box-shadow:0 2px 5px rgba(0,0,0,.04)}
                    .DummyInput label{color:#6b7280;width:88px}
                    .DummyInput input{border:0;background:transparent;outline:0;width:100%;font-size:15px;color:#4b5563}
                    .DummyCardBox{border:1px solid #e2e8f0;border-radius:8px;padding:18px 16px 17px;margin-bottom:22px;box-shadow:0 2px 5px rgba(0,0,0,.04)}
                    .DummyCardTitle{font-size:16px;font-weight:600;margin-bottom:24px;display:flex;align-items:center;gap:12px}
                    .DummyCardIcon{width:18px;height:13px;background:#111;border-radius:2px;display:inline-block;position:relative}
                    .DummyCardIcon:after{content:"";position:absolute;left:0;right:0;top:4px;height:3px;background:#fff}
                    .DummyFieldLabel{font-size:14px;color:#4b5563;font-weight:500;margin-bottom:7px}
                    .DummyFieldGroup{border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;box-shadow:0 2px 5px rgba(0,0,0,.04);margin-bottom:21px}
                    .DummyField{height:38px;background:#fff;display:flex;align-items:center;padding:0 12px;color:#8a8f98}
                    .DummyField input,.DummyField select{border:0;background:transparent;outline:0;width:100%;height:100%;font-size:15px;color:#4b5563}
                    .DummyField select{appearance:auto;color:#30313d}
                    .DummyField.top{border-bottom:1px solid #e2e8f0}
                    .DummyField.split{display:grid;grid-template-columns:1fr 1fr;padding:0}
                    .DummyField.split input{height:38px;padding:0 12px}
                    .DummyField.split input+input{border-left:1px solid #e2e8f0}
                    .DummyField.single{height:42px;border:1px solid #e2e8f0;border-radius:6px;margin-bottom:21px;box-shadow:0 2px 5px rgba(0,0,0,.04)}
                    .DummyCardBrands{display:flex;gap:4px;margin-left:auto;align-items:center}
                    .DummyCardBrands img{width:25px;height:16px;object-fit:contain;border-radius:2px}
                    .DummyBrandBadge{width:25px;height:16px;border-radius:2px;background:#1773e6;color:#fff;font-size:8px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;line-height:1}
                    .DummySave{border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:24px;color:#6b7280;display:flex;gap:10px;box-shadow:0 2px 5px rgba(0,0,0,.04);font-size:15px}
                    .DummySave strong{color:#4b5563;font-weight:600}
                    .DummyCheckbox{width:18px;height:18px;margin-top:2px}
                    .SubmitButton-IconContainer{width:100%;height:58px;border:0;border-radius:6px;background:#0878d9;color:#b9ddff;font-size:17px;font-weight:700;cursor:pointer;box-shadow:0 2px 4px rgba(0,0,0,.12)}
                    .DummyFooter{text-align:center;color:#8a8f98;font-size:12px;margin-top:18px}
                    .DummyFooter strong{color:#6b7280}
                    @media(max-width:980px){.DummyStripePage{grid-template-columns:minmax(0,380px);padding:32px 20px}.DummyStripePage:after{display:none}.DummyStripeLeft{margin-bottom:40px}}
                </style>
            </head>
            <body>
                <div class="DummyStripePage">
                    <section class="DummyStripeLeft">
                        <div class="DummyBrand"><a href="javascript:void(0)" class="DummyBack">&lt;</a><span class="DummyLogo">i</span><span>INTERNATIONAL SCHOOLING</span><span class="DummySandbox">Sandbox</span></div>
                        <div class="DummyCurrencyTitle">Choose a currency:</div>
                        <div class="DummyCurrencyRow">
                            <div class="DummyCurrency active"><span class="DummyFlag">IN</span> Rs ${money(inr)}</div>
                            <div class="DummyCurrency"><span class="DummyFlag">US</span>US$${money(usd)}</div>
                        </div>
                        <div class="DummyRate">1 USD = 98.2304 INR <span>(includes 3.75% conversion fee)</span></div>
                        <div class="DummyFeeRow"><span>Extra Class Fee</span><span>Rs ${money(inr)}</span></div>
                    </section>
                    <section class="DummyStripeRight">
                        <div class="DummyExpress"><button class="DummyApple">Apple Pay</button><button class="DummyLink">link</button></div>
                        <div class="DummyDivider">OR</div>
                        <h3 class="DummySectionTitle">Contact information</h3>
                        <div class="DummyInput"><label>Email</label><input type="email" value="${dummyCheckoutEmail()}" placeholder="Email"></div>
                        <h3 class="DummySectionTitle">Payment method</h3>
                        <div class="DummyCardBox">
                            <div class="DummyCardTitle"><span class="DummyCardIcon"></span>Card</div>
                            <div class="DummyFieldLabel">Card information</div>
                            <div class="DummyFieldGroup">
                                <div class="DummyField top"><input type="text" inputmode="numeric" maxlength="19" placeholder="1234 1234 1234 1234"><span class="DummyCardBrands"><img src="${images}visa.png"><img src="${images}master-card.png"><span class="DummyBrandBadge">AM<br>EX</span><img src="${images}JCB-Pay.png"></span></div>
                                <div class="DummyField split"><input type="text" inputmode="numeric" maxlength="5" placeholder="MM / YY"><input type="text" inputmode="numeric" maxlength="4" placeholder="CVC"></div>
                            </div>
                            <div class="DummyFieldLabel" style="margin-top:18px">Cardholder name</div>
                            <div class="DummyField single"><input type="text" placeholder="Full name on card"></div>
                            <div class="DummyFieldLabel">Country or region</div>
                            <div class="DummyField single"><select><option value="India">India</option><option value="United States">United States</option><option value="United Arab Emirates">United Arab Emirates</option><option value="United Kingdom">United Kingdom</option></select></div>
                        </div>
                        <label class="DummySave"><input type="checkbox" class="DummyCheckbox"><span><strong>Save my information for faster checkout</strong><br>Pay securely at INTERNATIONAL SCHOOLING and everywhere Link is accepted.</span></label>
                        <button type="button" class="SubmitButton-IconContainer" onclick="return window.showDummyPaymentSuccessPage();">Pay</button>
                        <div class="DummyFooter">Powered by <strong>${gateway === "Airwallex" ? "airwallex" : "stripe"}</strong> &nbsp; | &nbsp; Terms &nbsp; Privacy</div>
                    </section>
                </div>
            </body>
            </html>`;
    }
    function renderDummyPaymentSuccessPage() {
        var amount = dummyCheckoutAmount();
        var logo = (typeof schoolSettingsLinks !== "undefined" && schoolSettingsLinks && schoolSettingsLinks.logoUrl) ? schoolSettingsLinks.logoUrl : imagePath() + "logo.png";
        var student = userName();
        return `<!doctype html>
            <html>
            <head>
                <title>Payment Successful</title>
                <style>
                    *{box-sizing:border-box}
                    body{margin:0;background:#fff;color:#1f2937;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
                    .DummyPaymentResponse{min-height:100vh;padding:34px 20px 56px;display:flex;flex-direction:column;align-items:center}
                    .DummyPaymentLogo{max-width:330px;width:90%;height:auto;margin:0 auto 58px;display:block}
                    .DummyPaymentCard{width:min(860px,100%);text-align:center;margin:auto}
                    .DummyPaymentIcon{width:112px;height:112px;border-radius:50%;background:#16a34a;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-size:66px;line-height:1;margin-bottom:24px;box-shadow:0 14px 32px rgba(22,163,74,.22)}
                    .DummyPaymentThank{font-size:42px;font-weight:700;color:#16a34a;margin:0 0 8px}
                    .DummyPaymentTitle{font-size:30px;font-weight:700;color:#111827;margin:0 0 18px}
                    .DummyPaymentName{font-size:22px;font-weight:700;color:#027fff;margin:0 0 10px}
                    .DummyPaymentGreeting{font-size:20px;font-weight:700;margin:0 0 28px}
                    .DummyPaymentText{font-size:18px;line-height:1.65;max-width:760px;margin:0 auto 12px;color:#374151}
                    .DummyPaymentTimer{font-size:16px;color:#6b7280;margin:20px 0 0}
                    .DummyPaymentTimer strong{color:#027fff}
                    .DummyPaymentAction{display:inline-block;margin-top:28px;background:#027fff;color:#fff;text-decoration:none;border-radius:6px;padding:12px 30px;font-size:17px;font-weight:700;box-shadow:0 4px 12px rgba(2,127,255,.22)}
                    .DummyPaymentFooter{margin-top:60px;color:#4b5563;font-size:15px}
                    @media(max-width:640px){.DummyPaymentThank{font-size:34px}.DummyPaymentTitle{font-size:25px}.DummyPaymentText{font-size:16px}.DummyPaymentLogo{margin-bottom:34px}}
                </style>
            </head>
            <body>
                <main class="DummyPaymentResponse">
                    <img class="DummyPaymentLogo" src="${logo}" alt="International Schooling">
                    <section class="DummyPaymentCard">
                        <div class="DummyPaymentIcon">&#10003;</div>
                        <h1 class="DummyPaymentThank">Thank You!</h1>
                        <h2 class="DummyPaymentTitle">Payment Successful</h2>
                        <h3 class="DummyPaymentName">Dear ${student}</h3>
                        <p class="DummyPaymentGreeting"><i>Greetings from International Schooling!</i></p>
                        <p class="DummyPaymentText">We confirm your online payment of <strong>$${money(amount)}</strong> is completed successfully.</p>
                        <p class="DummyPaymentText">Kindly refer to the fee details in your profile for the receipt.</p>
                        <p class="DummyPaymentTimer">Redirecting to dashboard in <strong id="dummyPaymentRedirectTimer">5</strong> seconds.</p>
                        <a href="javascript:void(0)" class="DummyPaymentAction" onclick="return window.dummyGoToDashboard();">Click here for Dashboard</a>
                    </section>
                    <div class="DummyPaymentFooter">Copyright &copy; 2026 - International Schooling - All Rights Reserved.</div>
                </main>
                <script>
                    (function(){
                        var count = 5;
                        var timer = document.getElementById("dummyPaymentRedirectTimer");
                        var interval = setInterval(function(){
                            count -= 1;
                            if (timer) timer.textContent = count;
                            if (count <= 0) {
                                clearInterval(interval);
                                window.dummyGoToDashboard();
                            }
                        }, 1000);
                    })();
                <\/script>
            </body>
            </html>`;
    }
    function dummyTranscriptUrl(rowIndex) {
        return "dummy-student-transcript://" + encodeURIComponent(rowIndex || 0);
    }
    function dummyTranscriptRows() {
        var rows = dbRows();
        if (rows.length > 0) {
            return rows;
        }
        var g = grade();
        return [{
            studentName: userName(),
            learningProgramName: params().get("demoLearningProgramName") || params().get("demoLearningProgram") || "One-to-One Learning",
            gradeId: g.standardId,
            gradeName: g.label,
            courseId: subjects().map(function (s) { return s.subjectCode; }).join(", "),
            courseName: subjects().map(function (s) { return s.subjectName; }).join(", "),
            classCount: 0,
            activityCount: 0
        }];
    }
    function dummyTranscriptCourses(rows) {
        var seen = {}, courses = [];
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i] || {};
            var names = splitCommaValues(row.courseName || "");
            var ids = splitCommaValues(row.courseId || "");
            for (var j = 0; j < names.length; j++) {
                var name = names[j];
                if (!name) continue;
                var code = ids[j] || ("DUMMY-" + (courses.length + 1));
                var key = String(code + "|" + name).toLowerCase();
                if (seen[key]) continue;
                seen[key] = true;
                courses.push({ code: code, name: name });
            }
        }
        return courses;
    }
    function renderDummyStudentTranscriptHtml(rowIndex) {
        var rows = dummyTranscriptRows();
        var row = rows[parseInt(rowIndex || 0, 10)] || rows[0] || {};
        var courses = dummyTranscriptCourses(rows);
        var base = moment(getDummyBaseDate());
        var gradeLabel = row.gradeName || grade().label;
        var learningProgram = row.learningProgramName || row.learningProgram || "One-to-One Learning";
        var student = row.studentName || userName();
        var rollNo = "DUMMY" + String(uid()).replace(/\D/g, "").slice(-8);
        var courseRows = courses.map(function (course) {
            return "<tr><td>" + escapeHtml(gradeLabel) + "<br><span>" + escapeHtml(base.format("YYYY")) + "-" + escapeHtml(base.clone().add(1, "year").format("YYYY")) + "</span></td><td>" + escapeHtml(course.code) + "</td><td>" + escapeHtml(course.name) + "</td><td>A</td><td>1.0</td></tr>";
        }).join("");
        if (!courseRows) {
            courseRows = "<tr><td colspan='5' class='empty'>No courses saved for this dummy transcript.</td></tr>";
        }
        return `<!doctype html>
            <html>
            <head>
                <title>${escapeHtml(student)} Transcript</title>
                <style>
                    *{box-sizing:border-box}body{margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937}.page{width:210mm;min-height:297mm;margin:0 auto;background:#f7fff5;padding:18mm 16mm}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}.brand{font-size:32px;font-weight:700;color:#0b83ff}.brand span{display:block;font-size:24px;font-weight:400;color:#5c6670}.meta{font-size:12px;text-align:right;color:#52616f}.title{text-align:center;font-size:30px;font-family:Georgia,serif;color:#655d2d;margin:16px 0 22px}.details,.marks{width:100%;border-collapse:collapse;background:rgba(237,246,245,.58)}.details td{border:1px solid #77bfbd;padding:8px 10px;font-size:14px}.details b{display:inline-block;min-width:118px}.marks{margin-top:24px}.marks th{border:1px solid #77bfbd;padding:8px;background:rgba(227,245,244,.7);font-size:12px;text-align:left}.marks td{border-left:1px solid #77bfbd;border-right:1px solid #77bfbd;padding:7px 8px;font-size:13px;vertical-align:top}.marks tr:last-child td{border-bottom:1px solid #77bfbd}.marks td:nth-child(4),.marks td:nth-child(5),.marks th:nth-child(4),.marks th:nth-child(5){text-align:center}.empty{text-align:center;color:#667085}.footer{margin-top:24px;display:flex;justify-content:space-between;gap:18px;font-size:12px}.summary{border:1px solid #77bfbd;padding:10px;width:52%;background:rgba(237,246,245,.58)}.actions{position:fixed;right:18px;top:18px}.actions button{border:0;background:#0b83ff;color:#fff;border-radius:6px;padding:9px 14px;cursor:pointer}@media print{body{background:#fff}.page{margin:0}.actions{display:none}@page{size:A4;margin:0}}
                </style>
            </head>
            <body>
                <div class="actions"><button onclick="window.print()">Print / Save PDF</button></div>
                <main class="page">
                    <div class="header">
                        <div class="brand">International<span>Schooling</span></div>
                        <div class="meta">Dummy Student Dashboard Transcript<br>${escapeHtml(learningProgram)}</div>
                    </div>
                    <div class="title">American School Transcript</div>
                    <table class="details">
                        <tr><td><b>Student ID.:</b> ${escapeHtml(rollNo)}</td><td><b>Grade:</b> ${escapeHtml(gradeLabel)}</td><td><b>Status:</b> Regular</td></tr>
                        <tr><td colspan="2"><b>Student:</b> ${escapeHtml(student)}</td><td><b>Issued:</b> ${escapeHtml(base.format("MMM DD, YYYY"))}</td></tr>
                        <tr><td colspan="2"><b>Learning Program:</b> ${escapeHtml(learningProgram)}</td><td><b>School:</b> International Schooling</td></tr>
                    </table>
                    <table class="marks">
                        <thead><tr><th>Grade</th><th>Course Code</th><th>Course</th><th>Grades</th><th>Credits</th></tr></thead>
                        <tbody>${courseRows}</tbody>
                    </table>
                    <div class="footer">
                        <div class="summary"><b>Total Courses:</b> ${courses.length}<br><b>Saved Classes:</b> ${escapeHtml(row.classCount || 0)}<br><b>Saved Activities:</b> ${escapeHtml(row.activityCount || 0)}</div>
                        <div class="summary"><b>Source:</b> Student Dashboard Management dummy data<br>This preview is generated only for dummy student mode.</div>
                    </div>
                </main>
            </body>
            </html>`;
    }
    function openDummyStudentTranscript(rowIndex) {
        hydrateDbRows();
        var win = window.open("", "_blank");
        if (!win) return false;
        win.document.open();
        win.document.write(renderDummyStudentTranscriptHtml(rowIndex));
        win.document.close();
        return false;
    }

    window.isDummyStudentMode = function () {
        if (params().get("parentDemoPreview") === "Y") return false;
        // isDemoUser true -> show dummy data, false -> keep existing flow.
        if (typeof isDemoUser !== "undefined" && yes(isDemoUser)) return true;
        return yes(params().get("dummyStudent"));
    };
    if (window.isDummyStudentMode()) {
        window.USER_TIMEZONE = DUMMY_STUDENT_TIMEZONE;
        try { USER_TIMEZONE = DUMMY_STUDENT_TIMEZONE; } catch (e) {}
    }

    window.showDummyBookSessionPaymentOptions = function (userPaymentDetailsId, schoolId) {
        $("#dummyPaymentOptionsModal").remove();
        $("body").append(renderDummyBookSessionPaymentOptionsModal(userPaymentDetailsId, schoolId));
        bindDummyPaymentOptionMobileScroll();
        syncDummyMobilePayButton();
        $("#dummyPaymentOptionsModal").modal({ backdrop: "static", keyboard: false });
        return false;
    };
    window.showDummyStripeCheckoutPage = function (formId, userPaymentDetailsId, paidByUserId, schoolId, paymentGateway, schoolIdOfPaymentGateway) {
        window.__DUMMY_STUDENT_DASHBOARD_URL = dashboardUrl();
        try { localStorage.setItem("DUMMY_STUDENT_DASHBOARD_URL", window.__DUMMY_STUDENT_DASHBOARD_URL); } catch (e) {}
        document.open();
        document.write(renderDummyStripeCheckoutPage(paymentGateway));
        document.close();
        return false;
    };
    window.showDummyPaymentSuccessPage = function () {
        if (!(typeof isDummyStudentMode === "function" && isDummyStudentMode())) return true;
        document.open();
        document.write(renderDummyPaymentSuccessPage());
        document.close();
        return false;
    };
    window.dummyGoToDashboard = function () {
        try {
            localStorage.removeItem(dummyCartStorageKey());
            window.location.href = window.__DUMMY_STUDENT_DASHBOARD_URL || localStorage.getItem("DUMMY_STUDENT_DASHBOARD_URL") || dashboardUrl();
        } catch (e) {
            window.location.href = dashboardUrl();
        }
        return false;
    };
    window.dummyBookSessionPaymentSuccess = window.showDummyPaymentSuccessPage;
    window.openDummyStudentTranscript = openDummyStudentTranscript;
    window.openDummyStudentTranscriptFromUrl = function (url) {
        var match = String(url || "").match(/^dummy-student-transcript:\/\/(.+)$/);
        return openDummyStudentTranscript(match ? decodeURIComponent(match[1]) : 0);
    };
    window.getDummyStudentTranscriptUrl = dummyTranscriptUrl;
    var DUMMY_STUDENT_LMS_USERS = {
        "155688458": "demostudent1",
        "155688459": "demostudent2",
        "155688460": "demostudent3"
    };
    function dummyStudentDashboardManagementLmsOptions(selectedValue) {
        var html = '<option value="">Select Dummy LMS</option>';
        Object.keys(DUMMY_STUDENT_LMS_USERS).forEach(function (key) {
            html += '<option value="' + key + '"' + (String(selectedValue || "") === key ? " selected" : "") + '>' + DUMMY_STUDENT_LMS_USERS[key] + '</option>';
        });
        return html;
    }
    function dummyStudentDashboardManagementStyle() {
        if ($("#dummyStudentDashboardManagementStyle").length) return;
        $("head").append(`
            <style id="dummyStudentDashboardManagementStyle">
                .student-dashboard-management-table-wrap{overflow-x:auto;border:1px solid #e8edf3;border-radius:8px;}
                #studentDashboardManagementTable{min-width:1320px;margin-bottom:0;table-layout:fixed;}
                #studentDashboardManagementTable th,#studentDashboardManagementTable td{vertical-align:middle;padding:12px 10px;white-space:normal;overflow-wrap:anywhere;word-break:normal;line-height:1.35;}
                #studentDashboardManagementTable thead th{position:sticky;top:0;z-index:1;background:#f8fbff;color:#263238;font-weight:600;border-bottom:1px solid #dfe7ef;}
                #studentDashboardManagementTable .student-dashboard-count-cell,#studentDashboardManagementTable .student-dashboard-status-cell,#studentDashboardManagementTable .student-dashboard-lms-cell,#studentDashboardManagementTable .student-dashboard-actions-cell{text-align:center;}
                #studentDashboardManagementTable .student-dashboard-actions-cell{white-space:nowrap;}
                #studentDashboardManagementTable .student-dashboard-actions-cell .btn{width:34px;height:34px;padding:0;display:inline-flex;align-items:center;justify-content:center;margin:0 2px;}
            </style>
        `);
    }
    function dummyStudentDashboardManagementEnsureForm() {
        var form = $("#studentDashboardManagementForm");
        if (!form.length || form.find("#dummyLmsUserId").length) return;
        var html = `
            <div class="col-xl-2 col-lg-3 col-md-4 col-12 mb-3 dummy-student-lms-field">
                <div class="form-group custom-field">
                    <select id="dummyLmsUserId" name="dummyLmsUserId" class="form-control">${dummyStudentDashboardManagementLmsOptions("")}</select>
                    <label>Dummy LMS User</label>
                </div>
            </div>`;
        form.find("#courseName").closest(".col-xl-4, .col-lg-8, .col-md-7, .col-12").after(html);
        if ($.fn.select2) {
            form.find("#dummyLmsUserId").select2({ theme: "bootstrap4", placeholder: "" });
        }
    }
    function dummyStudentDashboardManagementPatchTable(rows) {
        dummyStudentDashboardManagementStyle();
        var table = $("#studentDashboardManagementTable");
        if (!table.length) return;
        table.closest(".table-responsive").addClass("student-dashboard-management-table-wrap");
        if (!table.find("colgroup").length) {
            table.prepend('<colgroup><col style="width:150px;"><col style="width:190px;"><col style="width:95px;"><col style="width:500px;"><col style="width:130px;"><col style="width:95px;"><col style="width:105px;"><col style="width:95px;"><col style="width:120px;"></colgroup>');
        }
        var headerRow = table.find("thead tr").first();
        if (!headerRow.find(".student-dashboard-dummy-lms-head").length) {
            headerRow.find("th").eq(3).after('<th class="student-dashboard-dummy-lms-head">Dummy LMS User</th>');
            headerRow.find("th").eq(5).text("Classes");
            headerRow.find("th").eq(6).text("Activities");
        }
        table.find("tbody tr").each(function (index) {
            var cells = $(this).children("td");
            if (cells.length === 1 && cells.attr("colspan")) {
                cells.attr("colspan", "9");
                return;
	            }
	            if (!$(this).find(".student-dashboard-lms-cell").length) {
	                var row = (rows || [])[index] || {};
	                var dummyLmsUserId = $.trim(row.dummyLmsUserId || "");
                var label = DUMMY_STUDENT_LMS_USERS[dummyLmsUserId] || dummyLmsUserId || "-";
                cells.eq(3).after('<td class="student-dashboard-lms-cell"><span class="badge badge-light border">' + escapeDummyHtml(label) + '</span></td>');
            }
            $(this).children("td").eq(5).addClass("student-dashboard-count-cell");
            $(this).children("td").eq(6).addClass("student-dashboard-count-cell");
            var statusCell = $(this).children("td").eq(7).addClass("student-dashboard-status-cell");
            if (!statusCell.find(".badge").length) {
                var active = $.trim(statusCell.text()) === "Active";
                statusCell.html('<span class="badge ' + (active ? "badge-success" : "badge-secondary") + '">' + (active ? "Active" : "Inactive") + '</span>');
            }
        });
    }
    function dummyStudentDashboardManagementPatchFunctions() {
        if (window.__dummyStudentDashboardManagementPatched) return;
        if (typeof renderStudentDashboardManagementPage !== "function"
            || typeof renderStudentDashboardManagementTable !== "function"
            || typeof editStudentDashboardManagementData !== "function"
            || typeof resetStudentDashboardManagementForm !== "function") return;
        window.__dummyStudentDashboardManagementPatched = true;
        var originalRenderPage = renderStudentDashboardManagementPage;
        renderStudentDashboardManagementPage = function (title) {
            var result = originalRenderPage.apply(this, arguments);
            dummyStudentDashboardManagementEnsureForm();
            return result;
        };
        var originalRenderTable = renderStudentDashboardManagementTable;
        renderStudentDashboardManagementTable = function (rows) {
            var result = originalRenderTable.apply(this, arguments);
            dummyStudentDashboardManagementPatchTable(rows || []);
            return result;
        };
        var originalEdit = editStudentDashboardManagementData;
        editStudentDashboardManagementData = function (index) {
            var result = originalEdit.apply(this, arguments);
            dummyStudentDashboardManagementEnsureForm();
            var row = (window.STUDENT_DASHBOARD_MANAGEMENT_ROWS || [])[index] || {};
            $("#studentDashboardManagementForm #dummyLmsUserId").val(row.dummyLmsUserId || "").trigger("change");
            return result;
        };
        var originalReset = resetStudentDashboardManagementForm;
        resetStudentDashboardManagementForm = function () {
            var result = originalReset.apply(this, arguments);
            $("#studentDashboardManagementForm #dummyLmsUserId").val("").trigger("change");
            return result;
        };
        dummyStudentDashboardManagementEnsureForm();
        if (window.STUDENT_DASHBOARD_MANAGEMENT_ROWS) {
            dummyStudentDashboardManagementPatchTable(window.STUDENT_DASHBOARD_MANAGEMENT_ROWS);
        }
    }
    function dummyStudentDashboardManagementPatchAjax() {
        if (window.__dummyStudentDashboardManagementAjaxPatched || typeof getDashboardDataBasedUrlAndPayload !== "function") return;
        window.__dummyStudentDashboardManagementAjaxPatched = true;
        var originalAjax = getDashboardDataBasedUrlAndPayload;
        getDashboardDataBasedUrlAndPayload = function (loader, message, url, payload) {
            if (url === "student-dashboard-management/save" && $("#studentDashboardManagementForm #dummyLmsUserId").length) {
                payload = payload || {};
                payload.dummyLmsUserId = $.trim($("#studentDashboardManagementForm #dummyLmsUserId").val() || "");
            }
            return originalAjax.apply(this, [loader, message, url, payload]);
        };
    }
    dummyStudentDashboardManagementPatchAjax();
    var dummyStudentDashboardManagementPatchTimer = setInterval(function () {
        dummyStudentDashboardManagementPatchAjax();
        dummyStudentDashboardManagementPatchFunctions();
        if (window.__dummyStudentDashboardManagementPatched && window.__dummyStudentDashboardManagementAjaxPatched) {
            clearInterval(dummyStudentDashboardManagementPatchTimer);
        }
    }, 50);
    window.getStudentDashboardManagementSpoofUrlParams = function (row, cleanCourseNameFn) {
        row = row || {};
        var cleanCourseName = typeof cleanCourseNameFn === "function" ? cleanCourseNameFn : function (value) { return String(value || "").trim(); };
        return {
            dummyStudent: "Y",
            demoFeedUserId: String(row.userId || row.createdBy || (typeof USER_ID !== "undefined" ? USER_ID : "")),
            demoDataId: row.id || row.ID || row.demoDataId || row.studentDashboardDemoDataId || "",
            demoStudentName: row.studentName || "",
            demoLearningProgram: row.learningProgram || row.learningProgramName || "",
            demoLearningProgramName: row.learningProgramName || row.learningProgram || "",
            demoGradeId: row.gradeId || "",
            demoGradeName: row.gradeName || "",
            demoCourseId: row.courseId || "",
            demoCourseName: cleanCourseName(row.courseName || ""),
            dummyLmsUserId: row.dummyLmsUserId || ""
        };
    };
    $(document).on("click", ".SubmitButton-IconContainer", function () {
        if (typeof isDummyStudentMode === "function" && isDummyStudentMode()) {
            return window.showDummyPaymentSuccessPage();
        }
    });
    $(scheduleDummyStudentProfileNameSync);
    window.setDummyStudentSourceData = function (data) { SOURCE = data || {}; };
    window.getDummyStudentProfileName = userName;
    window.syncDummyStudentProfileName = syncDummyStudentProfileName;
    window.updateDemoDashboardProfile = window.updateDemoDashboardProfile || function (responseData) {
        if (!responseData || typeof $ !== "function") {
            return;
        }
        if (responseData.profileName) {
            window.USER_FULL_NAME = responseData.profileName;
            $(".header-user-info .widget-heading").text(responseData.profileName);
            $(".dropdown-menu-header .widget-heading").text(responseData.profileName + ", ");
            $("title").text($("title").text().replace(/^\s*[^|]+(\s*\|\s*Dashboard\s*)$/i, responseData.profileName + "$1"));
        }
        if (responseData.profileImagePath) {
            $("#topProfileImage").attr("src", responseData.profileImagePath);
            $("#dropDownProfileImage").attr("src", responseData.profileImagePath);
        }
    };
    window.getDummyStudentGradeKey = gradeKey;
    window.getDummyStudentLmsProviderUrl = dummyLmsProviderUrl;
    window.getDummyStudentLmsPendingMessage = function () {
        return dummyLmsUserId() ? "" : "Dummy LMS user is not mapped.";
    };
    window.getDummySubjectOptionsByGrade = function (standardId) {
        var key = gradeKeyByStandardId(standardId) || gradeKey(), list = subjectsByGradeKey(key);
        return list.map(function (s) { return { key: s.subjectId, value: s.subjectName, extra: s.subjectCode, extra1: s.subjectIcon }; });
    };
    window.getDummyStudentBaseDate = function () {
        var d = params().get("dummyDate"), now = new Date();
        if (!d) return now;
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) { var p = d.split("-"); return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10), now.getHours(), now.getMinutes(), now.getSeconds()); }
        var parsed = new Date(d); return isNaN(parsed.getTime()) ? now : parsed;
    };
    window.getDummyStudentCurrentTimeText = function () { return typeof moment === "function" ? moment(window.getDummyStudentBaseDate()).tz(DUMMY_STUDENT_TIMEZONE).format("MMM DD, YYYY hh:mm:ss a") : window.getDummyStudentBaseDate().toLocaleString("en-US", { timeZone: DUMMY_STUDENT_TIMEZONE, month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }); };
    window.getDummyGradeKDashboardOrMigrationSection = function () {
        var g = grade();
        return { status: "1", statusCode: "S001", message: "Dummy " + g.label + " dashboard details", userId: uid(), schoolId: schoolId(), studentId: studentId(), standardId: g.standardId, studentStandardId: studentStandardId(), providerId: 40, userName: userName(), email: "demo.student@test.local", studentGraduate: "N", sessionCreated: true, showStudentCourseSelectionModel: "N", lastPassUpdatedDate: false, firstTimeRequest: "N", timePrefrenceSelectionStatus: "Y", systemTrainingStatus: "Skipped", showBatchImpAnnouncementModal: "N", batchStudentMappingId: studentStandardId(), batchAcademicYearStartDate: "", feePayDueDate: "", showAcademicYearSelectionModel: "N", showSystemTrainingSelectionModel: "N", registrationType: "ONE_TO_ONE", showGraduationCeremonyPopup: "N", graduationCeremonyRegistrationDeadline: "", showBatchReEnrollmentPopUp: "N", showBatchReEnrollmentDate: "" };
    };
    window.getDummyGradeKDashboardDetails = function () {
        var g = grade(), base = window.getDummyStudentBaseDate();
        return { status: "1", statusCode: "S001", message: "Dummy " + g.label + " dashboard content success", userId: uid(), userRole: "STUDENT", userName: userName(), uniqueId: typeof UNIQUEUUID !== "undefined" ? UNIQUEUUID : "dummy", schoolId: schoolId(), standardId: g.standardId, studentStandardId: studentStandardId(), moduleId: typeof moduleId !== "undefined" ? moduleId : 0, sessionCreated: true, isPayLmsPaymentPending: dummyLmsUserId() ? "" : "Dummy LMS user is not mapped.", lmsProviderURL: dummyLmsProviderUrl(), schoolLogo: "", email: "demo.student@test.local", feedbackId: 0, eventId: 0, videoUrl: "N", timePrefrenceSelectionStatus: "Y", activityTypes: activityTypeRows(), extraActivities: activityDetails(base), dashboardDetail: subjects().map(function (s, i) { return { userId: uid(), studentId: studentId(), standardId: g.standardId, standardName: g.standardName, imgURl: img(s), subjectId: s.subjectId, subjectCode: s.subjectCode, subjectName: s.subjectName, moduleName: s.subjectName, subjectTitle: s.subjectName, subjectIcon: s.subjectIcon, teacherNames: teacherList(s), subjectDesc: s.subjectName, subjectRating: 5, bgColor: "#027fff", courseType: "FT", subjectType: "FT", subjectTypeFullName: "Full Time", duration: 12, providerId: 40, studentSessionId: 9400001 + offset() * 100 + i, planCount: 0, planTotalCount: 0, remainMeeting: 0, planStartDate: fdate(plusMonths(base, -1)), planEndDate: fdate(plusMonths(base, 1)) }; }), roleAndModuleAssign: {}, schoolAnnouncements: { newAnnouncementCount: 0, schoolAnnounceDTO: [] }, registrationType: "ONE_TO_ONE", userTimezone: tz(), showGraduationCeremonyPopup: "N", graduationCeremonyRegistrationDeadline: "", countryISOCode: "US", nextGradeId: g.nextGradeId, nextGrade: g.nextGrade, payload: "", studentFeedback: 0, inactiveFlag: false };
    };
    window.getDummyAnnouncementDetails = function () {
        var base = window.getDummyStudentBaseDate(), g = grade(), rows = [[700001 + offset(), "Welcome to " + g.label, "Welcome to your " + g.label + " demo dashboard. Please review your class schedule and join your live class on time."], [700101 + offset(), "Class Readiness Reminder", "Keep your notebook, pencils, and learning materials ready before every online class."]];
        return { status: "1", newAnnouncementCount: rows.length, announcements: rows.map(function (r, i) { return { announcementId: r[0], announceId: r[0], announceTitle: r[1], createdDate: fmt(plusDays(base, -i)), replyStatus: "N", latestStatus: "Y", userId: uid(), moduleId: 58, teacherRemark: r[2], fileType: "", attachment: "" }; }) };
    };
    window.getDummyAnnouncementById = function (id) { var a = window.getDummyAnnouncementDetails().announcements; for (var i = 0; i < a.length; i++) if (a[i].announcementId == id) return { status: 1, announcement: a[i] }; return { status: 0, message: "Announcement not found" }; };
    window.getDummyNewsList = function () {
        var base = window.getDummyStudentBaseDate(), g = grade(), imageUrl = (typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2 : "") + "waiting-page-school-demo.png", logoUrl = (typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2 : "") + "waiting-page-school-demo-logo.png", rows = [[800001 + offset(), g.label + " Learners Begin Their Demo Week", "International Schooling welcomes " + g.label + " learners to a week of interactive online classes.", "International Schooling"], [800101 + offset(), "Simple Tips for Online Classroom Success", "Learners do best with a quiet study corner, a charged device, and a few minutes of preparation.", "International Schooling"]];
        return { code: 200, totalNews: rows.length, list: rows.map(function (r, i) { return { id: r[0], title: r[1], content: r[2], sourceName: r[3], image: imageUrl, sourceLogo: logoUrl, sourceUrl: "javascript:void(0)", publishDate: fmt(plusDays(base, -i)), country: "Global", readTime: 2 }; }) };
    };
    window.getDummyNewsById = function (id) { var a = window.getDummyNewsList().list; for (var i = 0; i < a.length; i++) if (a[i].id == id) return { code: 200, data: a[i] }; return { code: 404, message: "News not found" }; };
    window.getDummyActivityDetailsResponse = function () {
        return { status: 1, activityTypes: activityTypeRows(), activities: activityDetails(window.getDummyStudentBaseDate()) };
    };
    window.getDummyViewActivityResponse = function (activityId) {
        var details = activityDetails(window.getDummyStudentBaseDate()), types = activityTypeRows(), activity = details[0], category = types[0];
        if (!activity || !category) {
            return { status: 0, message: "Activity not found" };
        }
        for (var i = 0; i < details.length; i++) {
            if (String(details[i].id) === String(activityId)) {
                activity = details[i];
                category = types[i] || types[0];
                break;
            }
        }
        return { status: 1, activityId: activity.id, categoryName: category.activityName, activityTitle: activity.activityTitle, activityPurpose: "Practice activity for " + grade().label, uploadFile: "", filePath: "", startDatetime: activity.startDateTime, endDatetime: activity.endDateTime, showLinkBeforeMinutes: activity.joiningBefore, joiningLink: "javascript:void(0)", message: "" };
    };
    window.getDummyGradeKSchoolCalendarResponse = function () {
        var base = window.getDummyStudentBaseDate(), g = grade(), list = subjects(), events = [], startDate = plusMonths(base, -1), endDate = plusMonths(base, 1), eventId = 1;
        if (!list.length) {
            return { status: "1", statusCode: "S001", message: "Dummy " + g.label + " calendar success", event: [], holidays: [], activityTypes: activityTypeRows(), activitiesWithClass: true };
        }
        var classCount = configuredClassCount(0);
        if (hasDbRows()) {
            for (var classIndex = 1; classIndex <= classCount; classIndex++) {
                var subject = list[(classIndex - 1) % list.length], classStart = classIndex === 1 ? plusMinutes(base, -15) : plusDays(base, classIndex - 1);
                classStart = classIndex === 1 ? classStart : new Date(classStart.getFullYear(), classStart.getMonth(), classStart.getDate(), 10 + classIndex % 4, 0, 0);
                var classEnd = plusMinutes(classStart, 90), classTitle = cleanSubjectName(subject.subjectName), session = classIndex === 1 ? "Live Demo" : "Demo";
                events.push(applyTeacherFields({ id: "dummy-grade-" + gradeKey() + "-class-" + classIndex, title: classTitle, eventTitle: classTitle, url: "dummy-student-class://dummy-grade-" + gradeKey() + "-class-" + classIndex, start: fmt(classStart), end: fmt(classEnd), timezone: tz(), eventType: "ONE_TO_ONE", category: "CLASS", icon: img(subject), grade: g.label, session: session, activities: "" }, teacher(subject, classIndex)));
            }
        } else {
            for (var cur = new Date(startDate.getTime()); cur <= endDate; cur = plusDays(cur, 3)) { var s = list[(eventId - 1) % list.length], st = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate(), 10 + eventId % 4, 0, 0), en = plusMinutes(st, 90), title = cleanSubjectName(s.subjectName); events.push(applyTeacherFields({ id: "dummy-grade-" + gradeKey() + "-class-" + eventId, title: title, eventTitle: title, url: "dummy-student-class://dummy-grade-" + gradeKey() + "-class-" + eventId, start: fmt(st), end: fmt(en), timezone: tz(), eventType: "ONE_TO_ONE", category: "CLASS", icon: img(s), grade: g.label, session: "Demo", activities: "" }, teacher(s, eventId))); eventId++; }
            var live = list[base.getDate() % list.length], liveTitle = cleanSubjectName(live.subjectName), liveTeacher = teacher(live, base.getDate());
            events.push(applyTeacherFields({ id: "dummy-grade-" + gradeKey() + "-live-class", title: liveTitle, eventTitle: liveTitle, url: "dummy-student-class://dummy-grade-" + gradeKey() + "-live-class", start: fmt(plusMinutes(base, -15)), end: fmt(plusMinutes(base, 75)), timezone: tz(), eventType: "ONE_TO_ONE", category: "CLASS", icon: img(live), grade: g.label, session: "Live Demo", activities: "" }, liveTeacher));
        }
        var activityList = activityDetails(base);
        for (var activityIndex = 0; activityIndex < activityList.length; activityIndex++) {
            var activity = activityList[activityIndex];
            events.push({ id: "activity" + activity.id, title: activity.activityTitle + "~" + g.label, eventTitle: "Activity", name: "", teacherName: "", url: "", start: activity.startDateTime, end: activity.endDateTime, timezone: tz(), eventType: "ACTIVITY", category: "ACTIVITY", icon: (typeof PATH_FOLDER_IMAGE2 !== "undefined" ? PATH_FOLDER_IMAGE2 : "") + "Addon-Subject.png", grade: g.label, session: "Demo", activities: [activity] });
        }
        return { status: "1", statusCode: "S001", message: "Dummy " + g.label + " calendar success", event: events, holidays: [], activityTypes: activityTypeRows(), activitiesWithClass: true };
    };
    window.getDummyGradeKClassDetailsResponse = function (url) {
        var eventId = (url || "").replace("dummy-student-class://", ""), response = window.getDummyGradeKSchoolCalendarResponse(), event = null;
        for (var i = 0; i < response.event.length; i++) if (response.event[i].id === eventId) { event = response.event[i]; break; }
        if (!event) return { status: "0", message: "Class details not found" };
        var st = new Date(event.start.replace(" ", "T")), en = new Date(event.end.replace(" ", "T")), now = window.getDummyStudentBaseDate().getTime(), dateStatus = now < st.getTime() ? "future" : (now > en.getTime() ? "past" : "between"), parts = event.start.split(" "), endParts = event.end.split(" "), contextPath = typeof CONTEXT_PATH !== "undefined" && CONTEXT_PATH ? CONTEXT_PATH : "/" + window.location.pathname.split("/")[1] + "/", redirectUrl = window.location.origin + contextPath + "static/theme2/dummy-live-class.html";
        var eventTeacher = safeTeacherName(event.teacherName || event.name) || "Teacher";
        try { window.localStorage.setItem("DUMMY_TEACHER_NAME", eventTeacher); window.localStorage.setItem("DUMMY_CLASS_NAME", event.title || grade().label); window.localStorage.setItem("DUMMY_CLASS_DATE", parts[0] || ""); window.localStorage.setItem("DUMMY_CLASS_TIME", (parts[1] || "") + (endParts[1] ? " - " + endParts[1] : "")); } catch (e) {}
        return { status: dateStatus === "between" ? "1" : "0", statusCode: "S001", redirect: false, redirectUrl: redirectUrl, commonJoinUrlOfSMS: redirectUrl, dateStatus: dateStatus, userRole: typeof USER_ROLE !== "undefined" ? USER_ROLE : "STUDENT", className: grade().label + " - SEP Batch 1 2025-26", subjectName: event.title, teacherName: eventTeacher, name: eventTeacher, classDate: event.start, canJoindateStart: event.start, classTimezone: event.timezone, classType: event.eventType, joinType: "N", meetingJoinModalHideMin: 30 };
    };
    window.getDummyBookAClassResponse = function () {
        return { status: "1", statusCode: "S001", message: "Book a Class", details: { studentStandardId: studentStandardId(), showAcademicYearValidation: "N", classPlanCount: configuredClassCount(3) } };
    };
    window.getDummyStudentBookClassDetailsResponse = function () {
        var rows = dummyBookClassSubjectRows();
        var classCount = configuredClassCount(3);
        return { status: "1", statusCode: "S001", message: "data fetched successfully", classData: { year: [{ comp: classCount, plan: 0, extra: 120, bookedComp: Math.min(classCount, 1), bookedExtra: 0, leftExtra: 120, leftComp: Math.max(classCount - 1, 0), expiredComp: 0, expiredExtra: 0 }], week: [{ comp: classCount, plan: 0, extra: 6, bookedComp: 0, bookedExtra: 0, leftExtra: 6, leftComp: classCount, expiredComp: 0, expiredExtra: 0 }] }, registerType: "ONE_TO_ONE", compClassPerweek: classCount, compClassYear: classCount, subjectList: rows };
    };
    window.getDummyAssignedTeacherDetailsResponse = function (subjectId) {
        var s = dummySubjectById(subjectId);
        return { status: "1", statusCode: "EX01", message: "You do not have a teacher assigned yet.", subjectName: s.subjectName, standardId: grade().standardId, registerType: "ONE_TO_ONE", subjectId: s.subjectId, teacherName: teacher(s, 0), assignedTeacherId: 8800001 + offset(), assignedTeacherUserId: 8900001 + offset(), studentUserId: uid(), studentStandardId: studentStandardId(), studentTimeZone: tz(), teacherAssigned: "YES" };
    };
    window.getDummyTeacherWeeklyCalendarResponse = function (teacherUserId, subjectId, selectedDate) {
        var base = selectedDate instanceof Date && !isNaN(selectedDate.getTime()) ? selectedDate : window.getDummyStudentBaseDate(), weekStart = firstDayOfWeek(base), s = dummySubjectById(subjectId), teacherName = teacher(s, 0), week = [];
        var slotHours = [9, 11, 15];
        for (var d = 0; d < 7; d++) {
            var day = plusDays(weekStart, d), dayData = [];
            for (var h = 0; h < slotHours.length; h++) {
                var st = new Date(day.getFullYear(), day.getMonth(), day.getDate(), slotHours[h], 0, 0), en = plusMinutes(st, 45);
                dayData.push({ status: d === 2 && h === 1 ? "Booked" : "Available", bookedDate: fdate(day), bookedStartDate: fmt(st), bookedEndDate: fmt(en), displayStartTime: displayTime(st), displayEndTime: displayTime(en) });
            }
            week.push({ teacherAllDataInOneList: [{ displayStartDate: displayDate(day), displayStartDateWithoutDay: displayDateOnly(day), dayWiseAllData: dayData }] });
        }
        return { status: "1", statusCode: "S001", message: "Dummy teacher weekly calendar success", teacherUserId: teacherUserId || 8900001 + offset(), teacherName: teacherName, subjectName: s.subjectName, timeZoneName: tz(), showSlotAfter: 0, skipDateList: [], classDuration: 45, teacherWeeklyTimeCurrLiveClass: { teacherAssignTimeWeekList: week }, teacherWeeklyTimeNextLiveClass: null };
    };
    window.getDummyStudentBookedClassesDetailsResponse = function (subjectId) {
        var details = window.getDummyStudentBookClassDetailsResponse(), subject = details.subjectList[0];
        for (var i = 0; i < details.subjectList.length; i++) {
            if (String(details.subjectList[i].subjectId) === String(subjectId)) subject = details.subjectList[i];
        }
        var base = window.getDummyStudentBaseDate(), meetingDetails = [];
        var meetingCount = configuredClassCount(3);
        for (var j = 0; j < meetingCount; j++) {
            var st = plusDays(base, -j - 1), en = plusMinutes(st, 45);
            meetingDetails.push({ meetingJoinDate: fdate(st), startTime: displayTime(st), endTime: displayTime(en), timezone: tz(), subjectName: subject.name, name: subject.teacherName || teacher(dummySubjectById(subject.subjectId), 0), bookedDate: fdate(plusDays(st, -2)), classTypeExtraOrComp: j === 0 ? "Complimentary" : "Extra", meetingResult: j === 0 ? "Completed" : (j === 1 ? "Reschedule Session" : "Missed by Teacher") });
        }
        return { status: "1", statusCode: "S001", message: "data fetched successfully", subjectName: subject.name, standardId: grade().standardId, registerType: "ONE_TO_ONE", subjectCountDatials: dummyClassCount(subject), meetingDetails: meetingDetails };
    };
    window.getDummyStudentBookClassSubmitResponse = function () {
        return { status: "1", statusCode: "S001", message: "Class booked successfully", studentStandardId: studentStandardId() };
    };
    window.getDummyBuyExtraClassResponse = function () {
        return { status: 1, statusCode: "S001", message: "Dummy Buy Extra Classes", details: { standardId: grade().standardId, standardName: grade().standardName, subjects: dummyExtraClassSubjects(), customPlans: dummyExtraClassPlans(), purchasedItems: [] } };
    };
    window.getDummyStudentAcademicPerformanceResponse = function () {
        return { status: 1, details: { courseProviderId: 37, studentAcademicPerformances: dummyAcademicPerformanceRows() } };
    };
    window.getDummyStudentAcademicProgressDetailResponse = function (studentUserId, lmsEnrollmentId, lmsCourseId) {
        return dummyAcademicProgressDetail(lmsEnrollmentId, lmsCourseId);
    };
    window.getDummyStudentAcademicGradeHistoryResponse = function (itemId) {
        return dummyAcademicGradeHistory(itemId);
    };
    window.getDummyStudentScheduleResponse = function () {
        return dummyStudentScheduleResponse();
    };
    window.getDummyStudentAttendanceFullResponse = function () {
        return dummyStudentAttendanceResponse();
    };
    window.getDummyStudentParentLoginHistoryResponse = function () {
        return dummyStudentLoginHistoryResponse();
    };
    window.getDummyStudentAssignedTeacherResponse = function () {
        return dummyStudentAssignedTeacherResponse();
    };
    window.getDummyStudentClassSummaryResponse = function (meetingId) {
        return dummyStudentClassSummaryResponse(meetingId);
    };
    window.getDummyStudentDiaryThreadList = function () {
        return { status: 1, details: { threads: dummyStudentDiaryThreads() } };
    };
    window.getDummyStudentDiaryMessages = function (threadId) {
        return dummyStudentDiaryMessages(threadId);
    };
    window.getDummyStudentDiaryMentions = function () {
        return dummyStudentDiaryMentions();
    };
    window.getDummyStudentDiaryUnreadCount = function () {
        return { status: 1, details: { unreadThreadCount: 1, unreadMessageCount: 1 } };
    };
    window.getDummyStudentProgressReportsResponse = function () {
        return { status: 1, details: { studentWeeklyProgressReports: dummyStudentProgressReports() } };
    };
    window.getDummyStudentProgressReportHtml = function (url) {
        return dummyStudentProgressReportHtml(url);
    };
    window.getDummyStudentFeeDetailsResponse = function () {
        var base = window.getDummyStudentBaseDate();
        var plan = feePlan();
        var paidDate = plusMonths(base, -1);
        var paidDateText = displayDateOnly(paidDate);
        var paymentId = 970001 + uid();
        var paymentName = dummyInstallmentPaymentName(plan.gradeName, 0);
        var courseFeePayment = {
            id: paymentId,
            scheduledPayDate: paidDateText,
            standardName: plan.gradeName,
            paymentName: paymentName,
            totalFeeWithMaterialFee: plan.lumpsumTotal,
            payAmount: plan.lumpsumTotal,
            payDate: paidDateText,
            status: "SUCCESS",
            dummyStatusLabel: "PAID",
            paymentTitle: "TUITION_FEE",
            paymentTransferType: 1,
            pgName: "Stripe",
            installmentIndex: 0
        };
        courseFeePayment.recieptLink = receiptUrl(paymentId, paidDate);
        saveReceiptData(paymentId, buildReceiptData(courseFeePayment, (typeof moment === "function" ? moment(paidDate).format("MMM DD, YYYY 11:00 AM") : paidDateText + " 11:00 AM")));

        return {
            status: 1,
            details: {
                nextUserPaymentDetailsId: 0,
                userPaymentDetailsList: [
                    {
                        id: 970000 + uid(),
                        scheduledPayDate: displayDateOnly(plusDays(base, 13)),
                        standardName: plan.gradeName,
                        paymentName: "Graduation Ceremony 2026 | Dubai",
                        totalFeeWithMaterialFee: 600,
                        payAmount: 600,
                        payDate: "",
                        status: "SCHEDULED",
                        paymentTitle: "GRADUATION_CEREMONY_FEE",
                        paymentTransferType: 1,
                        pgName: "Stripe",
                        recieptLink: ""
                    },
                    courseFeePayment
                ]
            }
        };
    };
    window.getDummyAddToCartResponse = function (payload) {
        var item = dummyCartItemFromPayload(payload);
        var items = readDummyCartItems().filter(function (existing) { return String(existing.cartId) !== String(item.cartId); });
        items.push(item);
        writeDummyCartItems(items);
        return { status: "1", statusCode: "S001", message: "Item added to your cart", details: dummyCartDetailsFromItems(items) };
    };
    window.getDummyCartCountResponse = function () {
        return { status: "1", statusCode: "S001", cartCount: readDummyCartItems().length };
    };
    window.getDummyCartDetailsResponse = function () {
        return { status: "1", statusCode: "S001", details: dummyCartDetailsFromItems(readDummyCartItems()) };
    };
    window.getDummyUpdateCartDetailsResponse = function (payload) {
        var items = readDummyCartItems();
        if (payload && payload.type === "remove") {
            items = items.filter(function (item) { return String(item.cartId) !== String(payload.bookId); });
            writeDummyCartItems(items);
        }
        return { status: "1", statusCode: "S001", details: dummyCartDetailsFromItems(items) };
    };
    window.getDummyApplyDiscountOnCartResponse = function () {
        return { status: "1", statusCode: "S001", message: "Discount updated", details: dummyCartDetailsFromItems(readDummyCartItems()) };
    };
    window.getDummyCartPaymentResponse = function () {
        return { status: "1", statusCode: "S001", details: { planStatus: "b", standardId: grade().standardId, userPaymentDetailsId: 0 } };
    };
    function escapeDummyHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
    function dummyTranscriptGradeNames() {
        var seen = {}, grades = [], rows = dbRows();
        for (var i = 0; i < rows.length; i++) {
            var name = String(rows[i].gradeName || "").trim();
            if (!name) {
                var key = gradeKeyByStandardId(rows[i].gradeId);
                name = key && GRADE_CONFIG[key] ? GRADE_CONFIG[key].label : "";
            }
            if (!name) continue;
            var uniqueKey = name.toLowerCase();
            if (!seen[uniqueKey]) {
                seen[uniqueKey] = true;
                grades.push(name);
            }
        }
        if (!grades.length) {
            grades.push(grade().label);
        }
        return grades;
    }
    function dummyTranscriptGradeShort(gradeName) {
        if (/k|kinder/i.test(String(gradeName || "")) && !/\d/.test(String(gradeName || ""))) {
            return "K";
        }
        var match = String(gradeName || "").match(/(\d{1,2})/);
        return match ? match[1] : "5";
    }
    function dummyTranscriptCourses(gradeName) {
        var courses = subjects().map(function (subject) {
            return cleanCourseName(subject.subjectName || "");
        }).filter(function (courseName) {
            return !!courseName;
        });
        if (!courses.length) {
            var rows = SUBJECT_ROWS[gradeKeyByLabel(gradeName)] || SUBJECT_ROWS[gradeKey()] || SUBJECT_ROWS.K;
            courses = rows.map(function (row) { return row[1]; });
        }
        return courses;
    }
    function dummyTranscriptBirthDate(gradeName) {
        var base = window.getDummyStudentBaseDate();
        var gradeIndex = GRADE_KEYS.indexOf(gradeKeyByLabel(gradeName) || gradeKey());
        if (gradeIndex < 0) gradeIndex = 5;
        return "Mar 14, " + (base.getFullYear() - (6 + gradeIndex));
    }
    function dummyTranscriptGender() {
        var firstName = String(userName() || "").trim().split(" ")[0].toLowerCase();
        return /[ai]$/.test(firstName) ? "Female" : "Male";
    }
    function dummyStudentTranscriptUrl(gradeName, studentCode) {
        var base = window.getDummyStudentBaseDate();
        return receiptBasePath() + "dummy-parent-transcript.html"
            + "?studentName=" + encodeURIComponent(userName())
            + "&gradeName=" + encodeURIComponent(gradeName)
            + "&gradeShort=" + encodeURIComponent(dummyTranscriptGradeShort(gradeName))
            + "&studentCode=" + encodeURIComponent(studentCode || receiptStudentCode())
            + "&birthDate=" + encodeURIComponent(dummyTranscriptBirthDate(gradeName))
            + "&gender=" + encodeURIComponent(dummyTranscriptGender())
            + "&gpa=3.85"
            + "&courses=" + encodeURIComponent(dummyTranscriptCourses(gradeName).join("|"))
            + "&dummyDate=" + encodeURIComponent(fdate(base));
    }
    function applyDummyStudentTranscriptContent() {
        if (!window.isDummyStudentMode || !window.isDummyStudentMode() || typeof $ !== "function") {
            return;
        }
        var table = $("#myTable");
        if (!table.length || table.attr("data-dummy-transcript") === "Y") {
            return;
        }
        var headText = table.find("thead").text() || "";
        if (headText.indexOf("Student ID") < 0 || headText.indexOf("Grade") < 0 || !hasDbRows()) {
            return;
        }
        var firstRow = table.find("tbody tr").first();
        var existingEmail = $.trim(firstRow.find("td").eq(2).text() || "");
        var existingRollNo = $.trim(firstRow.find("td").eq(4).text() || "");
        var dummyStudentCode = existingRollNo && existingRollNo.toUpperCase() !== "NA" ? existingRollNo : receiptStudentCode();
        var gradeNames = dummyTranscriptGradeNames();
        var dropdownItems = "";
        for (var i = 0; i < gradeNames.length; i++) {
            dropdownItems += '<a class="dropdown-item" target="_blank" href="' + escapeDummyHtml(dummyStudentTranscriptUrl(gradeNames[i], dummyStudentCode)) + '"><i class="fa fa-file-text"></i>&nbsp; Transcript - ' + escapeDummyHtml(gradeNames[i]) + '</a>';
        }
        var rowHtml = '<tr>'
            + '<td style="text-align:center;">1</td>'
            + '<td>' + escapeDummyHtml(userName()) + '</td>'
            + '<td>' + escapeDummyHtml(existingEmail || "demo.student@test.local") + '</td>'
            + '<td>' + escapeDummyHtml(gradeNames[0]) + '</td>'
            + '<td>' + escapeDummyHtml(dummyStudentCode) + '</td>'
            + '<td style="text-align: center;">'
                + '<div class="btn-group">'
                    + '<button type="button" class="btn btn-danger dropdown-toggle btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Action" style="background-color:var(--pc) !important;border-color:var(--pc);box-shadow:none;"><i class="fa fa-ellipsis-v"></i></button>'
                    + '<div class="dropdown-menu">' + dropdownItems + '</div>'
                + '</div>'
            + '</td>'
        + '</tr>';
        try {
            if ($.fn.DataTable && $.fn.DataTable.isDataTable(table.get(0))) {
                table.DataTable().destroy();
            }
        } catch (e) {}
        table.attr("data-dummy-transcript", "Y");
        table.find("tbody").html(rowHtml);
        try {
            if ($.fn.DataTable) {
                table.DataTable({ responsive: true });
                table.find("tbody tr td:first-child").addClass("dtr-control");
            }
        } catch (e) {}
    }
    function watchDummyStudentTranscriptContent() {
        if (!window.isDummyStudentMode || !window.isDummyStudentMode() || typeof $ !== "function" || typeof MutationObserver === "undefined") {
            return;
        }
        var target = document.getElementById("dashboardContentInHTML") || document.body;
        if (!target) {
            return;
        }
        var pending = null;
        new MutationObserver(function () {
            if (pending) {
                return;
            }
            pending = window.setTimeout(function () {
                pending = null;
                applyDummyStudentTranscriptContent();
            }, 200);
        }).observe(target, { childList: true, subtree: true });
        applyDummyStudentTranscriptContent();
    }
    window.applyDummyStudentTranscriptContent = applyDummyStudentTranscriptContent;
    if (typeof $ === "function") {
        $(watchDummyStudentTranscriptContent);
    }
})(window);
