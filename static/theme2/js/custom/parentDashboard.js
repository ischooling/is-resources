var STUDENT_LIST=[];
var ACTIVE_STUDENT_ID;
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var CLASS_STATUS_INTERVAL = null;
if(typeof window.PARENT_DASHBOARD_GREETING_SHOWN_ONCE === "undefined"){
    window.PARENT_DASHBOARD_GREETING_SHOWN_ONCE = false;
}
function getClassesAttendanceCircleValue(monthStat) {
    var normalized = normalizeMonthStat(monthStat);
    if (normalized.daysInMonth === 0) {
        return 0;
    }
    if (
        normalized.classesAttendedCount === normalized.daysInMonth &&
        normalized.late === 0 &&
        normalized.earlyLeave === 0
    ) {
        return 100;
    }
    return Math.round((normalized.classesAttendedCount / normalized.daysInMonth) * 100);
}

function getMonthlyAttendanceCountSeries(monthStat) {
    var normalized = normalizeMonthStat(monthStat);
    return [
        normalized.classesAttendedCount,
        normalized.late,
        normalized.earlyLeave,
        normalized.absent
    ];
}

function getMonthlyAttendancePercentSeries(monthStat) {
    var normalized = normalizeMonthStat(monthStat);
    if (normalized.daysInMonth === 0) {
        return [0, 0, 0, 0];
    }
    return [
        Math.round((normalized.classesAttendedCount / normalized.daysInMonth) * 100),
        Math.round((normalized.late / normalized.daysInMonth) * 100),
        Math.round((normalized.earlyLeave / normalized.daysInMonth) * 100),
        Math.round((normalized.absent / normalized.daysInMonth) * 100)
    ];
}

function getDaysInMonth(year, monthIndex) {
    return new Date(year, monthIndex + 1, 0).getDate();
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

function normalizeMonthStat(monthStat) {
    if (!monthStat) {
        return {
            daysInMonth: 0,
            classesAttendedCount: 0,
            late: 0,
            earlyLeave: 0,
            absent: 0
        };
    }
    var daysInMonth = getDaysInMonth(monthStat.year, monthStat.monthIndex);
    var classesAttendedCount = clamp(Number(monthStat.classesAttendedCount || 0), 0, daysInMonth);
    var late = clamp(Number(monthStat.late || 0), 0, daysInMonth);
    var earlyLeave = clamp(Number(monthStat.earlyLeave || 0), 0, daysInMonth);
    var absent = monthStat.absent == null
        ? Math.max(0, daysInMonth - classesAttendedCount)
        : clamp(Number(monthStat.absent), 0, daysInMonth);

    if (classesAttendedCount === daysInMonth && late === 0 && earlyLeave === 0) {
        absent = 0;
    }
    return {
        daysInMonth: daysInMonth,
        classesAttendedCount: classesAttendedCount,
        late: late,
        earlyLeave: earlyLeave,
        absent: absent
    };
}

async function parentDashbaordOnLoadEvent(){
    // $("head").append(`<style>.attendance-tab.active{background:#409f5b !important;color:#fff !important}</style>`)
    var activeStudentTimezone = STUDENT_LIST?.studentBasicDetails?.find(s => s.userId == ACTIVE_STUDENT_ID) ?.studentTimezone || moment.tz.guess();
    $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, activeStudentTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    setInterval(function(){
        $('#currentTimeForUser').html(convertUTCToTimezoneAs(getUTCTime(), DATETIME_FORMATTER, activeStudentTimezone).format('MMM DD, YYYY hh:mm:ss a'));
    }, 1000);
    
    $('.user-slider').slick({
        slidesToShow:getSlidesToShow(),
        slidesToScroll:1,
        infinite:false,
        arrows:true,
        responsive:[
            {breakpoint:992, settings:{slidesToShow:3}},
            {breakpoint:768, settings:{slidesToShow:2}},
            {breakpoint:576, settings:{slidesToShow:1}}
        ]
    });

    // Active state styling fix
    $('.nav-link').on('shown.bs.tab', function () {
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
    });
    $("#news_side_wrapper, #newsBtn").hide();
}
function getSlidesToShow() {
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220; // approx width of one tab
    return Math.floor(containerWidth / itemWidth);
}
async function getStudentDetailsByStudentID(studentId){
    ACTIVE_STUDENT_ID=studentId;
    $(".student-thumb").removeClass("active-student");
    $(".student-"+studentId).addClass("active-student");
    var studentPerformanceData =  await getStudentPerformanceData(studentId);
    $("#studentPerformanceDetails").html(getStudentPerformanceDetailsCard(studentPerformanceData.details));
    initParentGreetingBannerAutoHide();
    renderAvgGrade(studentPerformanceData.details.summary.avgGradeLastMonth, studentPerformanceData.details.summary.avgGradeThisMonth);
    initializeAttendanceChart(studentPerformanceData.details.attendanceOverview);

    initializeGradeChartCurrentYear(studentPerformanceData.details.gradeOverview);
    var classAndActivityList = await getUpcomingClassesAndActivityData(studentId);
    // console.log("class and activity list", classAndActivityList)
    $("#studentUpcomingClassActivityWrapper").html(getStudentUpcomingClassActivityListing(classAndActivityList));
    if (CLASS_STATUS_INTERVAL) {
        clearInterval(CLASS_STATUS_INTERVAL);
    }
    CLASS_STATUS_INTERVAL = setInterval(function () {
        updateClassStatusBadges('studentUpcomingClassActivityWrapper');
    }, 1000);
    var paymentList =  await getStudentFeeData(studentId);
    $("#studentPaymentListingWrapper").html(getStudentPaymentListing(paymentList.details.userPaymentDetailsList));
    renderNews(STUDENT_LIST.studentBasicDetails[0].userId);
    renderAnnouncement(STUDENT_LIST.studentBasicDetails[0].userId);
}

function initializeAttendanceChart(data) {

    var currentYear = new Date().getFullYear().toString();

    /* =========================
       Step 1: Filter Current Year
    ========================= */
    var onlyCurrentYear = data.filter(item =>
        item.monthKey.startsWith(currentYear)
    );

    /* =========================
       Step 2: Fixed Months
    ========================= */
    var monthNumbers = ["01","02","03","04","05","06","07","08","09","10","11","12"];
    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"];

    // X-axis labels → Jan 2026, Feb 2026 ...
    var months = monthNames.map(m => m + " " + currentYear);

    /* =========================
       Step 3: Create Month Map
    ========================= */
    var monthMap = {};
    onlyCurrentYear.forEach(item => {
        monthMap[item.monthKey] = item.attendancePercent;
    });

    /* =========================
       Step 4: Build Attendance Data
    ========================= */
    var attendanceData = monthNumbers.map(num => {
        var key = currentYear + "-" + num;
        return monthMap[key] ?? 0;
    });

    /* =========================
       Attendance Chart
    ========================= */

    var attendanceOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        series: [{
            name: 'Attendance',
            data: attendanceData
        }],
        tooltip: {
            enabled: true,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {

                var value = series[seriesIndex][dataPointIndex];
                var month = w.globals.labels[dataPointIndex];

                return `
                    <div class="bg-white p-2 rounded-10 box-shadow text-center" style="min-width:140px;">
                        <div class="font-18 font-weight-bold text-dark">
                            ${value}%
                        </div>
                        <div class="font-14 font-weight-semi-bold text-dark">
                            Attendance
                        </div>
                        <div class="font-12 text-dark">
                            ${month} | Batch 2025-2026
                        </div>
                    </div>
                `;
            }
        },
        legend: { show: false },
        plotOptions: {
            bar: {
                columnWidth: '45%',
                borderRadius: 6,
                distributed: true
            }
        },
        colors: attendanceData.map(val =>
            val === 0 ? '#e3e8e6' : '#1e8e3e'
        ),
        xaxis: {
            categories: months
        },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 4,
            labels: {
                formatter: function(val) {
                    return val + "%";
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4
        },
        dataLabels: { enabled: false }
    };

    var attendanceChart = new ApexCharts(
        document.querySelector("#attendanceChart"),
        attendanceOptions
    );

    attendanceChart.render();
}
function getGradeFromPercentage(percentage) {
	var score = parseFloat(percentage);
	if (isNaN(score)) {
		return "F";
	}
	if (score > 100 || score >= 95.1) {
		return "A+";
	} else if (score >= 92.1) {
		return "A";
	} else if (score >= 88.1) {
		return "A-";
	} else if (score >= 85.1) {
		return "B+";
	} else if (score >= 82.1) {
		return "B";
	} else if (score >= 78.1) {
		return "B-";
	} else if (score >= 75.1) {
		return "C+";
	} else if (score >= 72.1) {
		return "C";
	} else if (score >= 68.1) {
		return "C-";
	} else if (score >= 65.1) {
		return "D+";
	} else if (score >= 62.1) {
		return "D";
	} else if (score >= 59.1) {
		return "D-";
	}
	return "F";
}

function initializeGradeChartCurrentYear(gradeOverview) {

    var currentYear = new Date().getFullYear().toString();

    /* =========================
       1️⃣ Filter Current Year
    ========================= */
    var currentYearData = gradeOverview.filter(item =>
        item.monthKey.startsWith(currentYear)
    );

    /* =========================
       2️⃣ Month Setup
    ========================= */
    var monthNumbers = ["01","02","03","04","05","06",
                        "07","08","09","10","11","12"];

    var monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
                      "Jul","Aug","Sep","Oct","Nov","Dec"];

    // X-axis labels: Jan 2026
    var months = monthNames.map(m => m + " " + currentYear);

    /* =========================
       3️⃣ Create MonthKey Map
       (Example: 2026-01 → 85)
    ========================= */
    var monthMap = {};
    currentYearData.forEach(item => {
        monthMap[item.monthKey] = parseFloat(item.averagePercentage) || 0;
    });

    /* =========================
       4️⃣ Build Final Grade Values
    ========================= */
    var gradeValues = monthNumbers.map(num => {
        var key = currentYear + "-" + num;
        return monthMap[key] ?? 0;
    });

    /* =========================
       Destroy Previous Chart
    ========================= */
    if (window.gradesChartInstance) {
        window.gradesChartInstance.destroy();
    }

    /* =========================
       Chart Configuration
    ========================= */
    var gradesOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show: false }
        },
        series: [{
            name: 'Grades',
            data: gradeValues
        }],
        tooltip: {
            enabled: true,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {

                var value = series[seriesIndex][dataPointIndex];
                var month = w.globals.labels[dataPointIndex];

                var gradeLabel = getGradeFromPercentage(value);

                return `
                    <div class="bg-white p-2 rounded-10 box-shadow text-center" style="min-width:150px;">
                        <div class="font-18 font-weight-bold text-dark">
                            ${gradeLabel}
                        </div>
                        <div class="font-12 text-dark">
                            ${value}%
                        </div>
                        <div class="font-12 text-dark">
                            ${month}
                        </div>
                    </div>
                `;
            }
        },
        legend: { show: false },
        plotOptions: {
            bar: {
                columnWidth: '45%',
                borderRadius: 6
            }
        },
        colors: gradeValues.map(val =>
            val === 0 ? '#e3e8e6' : '#1a73e8'
        ),
        xaxis: {
            categories: months
        },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 5,
            labels: {
                formatter: function(val){
                    return getGradeFromPercentage(val);
                }
            }
        },
        grid: {
            borderColor: '#e5e7eb',
            strokeDashArray: 4
        },
        dataLabels: { enabled: false }
    };

    /* =========================
       Render Chart
    ========================= */
    window.gradesChartInstance = new ApexCharts(
        document.querySelector("#gradesChart"),
        gradesOptions
    );

    window.gradesChartInstance.render();
}

async function getStudentPerformanceData(studentId){
    var todayDate = new Date();
    todayDate = todayDate.toISOString().split('T')[0];
    var payload = {studentUserId: studentId};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-dashboard-overview",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    getChat("", "PARENT");
    return await callCommonAjax(ajaxReqDetails);
}

async function getUpcomingClassesAndActivityData(studentId){
    var todayDate = new Date();
    todayDate = todayDate.toISOString().split('T')[0];
    var payload = {studentUserId: studentId, startDate: todayDate, endDate: todayDate};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-schedule",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    return await callCommonAjax(ajaxReqDetails);
}

async function getStudentFeeData(studentId){
    var todayDate = new Date();
    todayDate = todayDate.toISOString().split('T')[0];
    var payload = {userId:USER_ID,studentUserId: studentId};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-fee-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    return await callCommonAjax(ajaxReqDetails);
}

function updateClassStatusBadges(elementId) {

    var currentTime = new Date($("#currentTimeForUser").text()).getTime();

    $("#"+elementId+" .class-card").each(function () {

        var card = $(this);
        var startTime = new Date(card.data("start")).getTime();
        var endTime = new Date(card.data("end")).getTime();
        var classStatus = ((card.data("class-status") || "").toString().trim() || "Not Started");

        var badgeContainer = card.find(".badge-pill");
        badgeContainer.remove(); // old badge remove

        var badgeHtml = "";

        if (currentTime >= startTime && currentTime <= endTime) {
            // Live
            badgeHtml = `
                <div class="badge-pill bg-light-success text-success ml-auto font-12 font-weight-semi-bold">
                    <span class="badge badge-dot badge-dot-lg badge-success badge-pulse mr-1">Badge</span>
                    Live
                </div>`;
        }
        else if (currentTime > endTime) {
            // Completed
           
            badgeHtml = `
                <div class="badge-pill ${classStatus == "Not Started" ? 'bg-light-danger text-danger' : 'bg-light-secondary text-secondary'} ml-auto font-12 font-weight-semi-bold">
                    <span class="badge badge-dot badge-dot-lg  ${classStatus == "Not Started" ? 'badge-danger' : 'badge-secondary'} mr-1">Badge</span>
                    ${classStatus}
                </div>`;
        }
        else {
            // Upcoming (Yellow)
            badgeHtml = `
                <div class="badge-pill bg-light-warning text-dark ml-auto font-12 font-weight-semi-bold">
                    <span class="badge badge-dot badge-dot-lg badge-warning mr-1">Badge</span>
                    Upcoming
                </div>`;
        }

        card.find(".d-flex").append(badgeHtml);
    });
}

function renderAvgGrade(avgGradeLastMonth, avgGradeThisMonth) {
    var iconSVG = "";
    var bgClass = "";
    var text = "";

    if (avgGradeThisMonth > avgGradeLastMonth) {
        // Improved
        bgClass = "bg-light-success";
        text = getGradeFromPercentage(avgGradeThisMonth) + " from " + getGradeFromPercentage(avgGradeLastMonth);

        iconSVG = `<svg viewBox="0 0 576 512" style="width:15px;height:15px;fill:#3ac47d">
            <path d="M384 160c17.7 0 32-14.3 32-32s-14.3-32-32-32L224 96c-17.7 0-32 14.3-32 32l0 160c0 17.7 14.3 32 32 32s32-14.3 32-32l0-82.7L425.4 374.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0L160 306.7 242.7 224 384 160z"/>
        </svg>`;
    }
    else if (avgGradeThisMonth < avgGradeLastMonth) {
        // Decreased
        bgClass = "bg-light-danger";
        text = getGradeFromPercentage(avgGradeThisMonth) + " from " + getGradeFromPercentage(avgGradeLastMonth);

        iconSVG = `<svg viewBox="0 0 576 512" style="width:15px;height:15px;fill:#d92550">
            <path d="M384 352c-17.7 0-32 14.3-32 32s14.3 32 32 32l160 0c17.7 0 32-14.3 32-32l0-160c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 82.7-169.4-169.4c-12.5-12.5-32.8-12.5-45.3 0L192 242.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0L320 205.3 466.7 352 384 352z"/>
        </svg>`;
    }
    else {
        // Same
        bgClass = "bg-light-warning";
        text = getGradeFromPercentage(avgGradeThisMonth) + " from " + getGradeFromPercentage(avgGradeLastMonth);

        iconSVG = `<svg viewBox="0 0 448 512" style="width:15px;height:15px;fill:#f7b924">
            <path d="M448 256c0 17.7-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
        </svg>`;
    }

    $("#gradeCompare").html(`
        <span class="${bgClass} circle mr-1 d-inline-flex justify-content-center align-items-center p-1"
              style="width:20px;height:20px;border-radius:50%;">
            ${iconSVG}
        </span>
        ${text}
    `);
}

function getStudentFirstfName(studentName){
    if(studentName != null && studentName != undefined && studentName != ""){
        return studentName.split(" ")[0];
    }else{
        showMessageTheme2(0, "Student first name not found.")
    }
}

function initParentGreetingBannerAutoHide(){
    var $greetingWrap = $('#studentPerformanceDetails .js-parent-greeting-banner-wrap:visible').first();
    if($greetingWrap.length === 0){
        return;
    }
    window.PARENT_DASHBOARD_GREETING_SHOWN_ONCE = true;

    if($greetingWrap.data('hideScheduled')){
        return;
    }
    $greetingWrap.data('hideScheduled', true);

    setTimeout(function(){
        $greetingWrap.css({
            maxHeight: '0px',
            opacity: '0',
            transform: 'translateY(-18px)',
            marginBottom: '0px'
        });
        setTimeout(function(){
            $greetingWrap.remove();
        }, 650);
    }, 6000);
}
