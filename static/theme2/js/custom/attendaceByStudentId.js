
var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

async function attendaceByStudentIdContentOnLoadEvent(){
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
}
function getSlidesToShow() {
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220; // approx width of one tab
    return Math.floor(containerWidth / itemWidth);
}
async function getStudentAttendanceDetails(studentId){
    ACTIVE_STUDENT_ID = studentId;
    $(".student-thumb").removeClass("active-student");
    $(".student-"+studentId).addClass("active-student");
    
    var studentPerformanceData =  await getAttendanceChartDetailsData(studentId);
    $("#attendanceDetailsCard").html(getStudentShortOverviewByIdContent(studentPerformanceData.details.summary)+getStudentAttendanceDetailsContent())
    initializeAttendanceChartDetails(studentPerformanceData.details.attendanceOverview);  
    initializeSummaryChartDetails(studentPerformanceData.details.summary);
    var classAndActivityList = await getUpcomingClassesAndActivityData(studentId);
    console.log("class and activity list", classAndActivityList)
    $("#todayStudentSessionWrapper").html(getStudentTodaySessionList(classAndActivityList));
    if (CLASS_STATUS_INTERVAL) {
    clearInterval(CLASS_STATUS_INTERVAL);
    }
    CLASS_STATUS_INTERVAL = setInterval(function () {
        updateClassStatusBadges('todayStudentSessionWrapper');
    }, 1000);
}

async function getAttendanceChartDetailsData(studentId){
    // var todayDate = new Date();
    // todayDate = todayDate.toISOString().split('T')[0];
    var payload = {studentUserId: studentId};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-attendance-full",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    return await callCommonAjax(ajaxReqDetails);
}


function initializeAttendanceChartDetails(data) {

    var only2026 = data.filter(item =>
        item.monthKey.startsWith("2026")
    );

    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Step 3: Create month map
    var monthMap = {};
    only2026.forEach(item => {
        monthMap[item.monthLabel] = item.attendancePercent;
    });

    // Step 4: Build final attendance array (null if missing)
    var attendanceData = months.map(month =>
        monthMap[month] ?? null
    );

    var attendanceOptions = {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: { show:false }
        },
        series: [{
            name: 'Attendance',
            data: attendanceData
        }],
        tooltip:{
            enabled: true,
            custom: function({ series, seriesIndex, dataPointIndex, w }) {

                var value = series[seriesIndex][dataPointIndex];
                var month = w.globals.labels[dataPointIndex];

                if (value === null) return "";

                return `
                    <div class="bg-white p-2 rounded-10 box-shadow text-center" style="min-width:140px;">
                        <div class="font-18 font-weight-bold text-dark">
                            ${value}%
                        </div>
                        <div class="font-14 font-weight-semi-bold text-dark">
                            Attendance
                        </div>
                        <div class="font-12 text-dark">
                            ${month} ${new Date().getFullYear()} | Batch 2025-2026
                        </div>
                    </div>
                `;
            }
        },
        legend:{ show:false },
        plotOptions: {
            bar: {
                columnWidth: '45%',
                borderRadius: 6,
                distributed: true
            }
        },
        colors: attendanceData.map(val =>
            val === null ? '#e3e8e6' : '#1e8e3e'
        ),
        xaxis: {
            categories: months
        },
        yaxis: {
            min: 0,
            max: 100,
            tickAmount: 4,
            labels:{
                formatter: function(val){
                    return val + "%";
                }
            }
        },
        grid:{
            borderColor:'#e5e7eb',
            strokeDashArray:4
        },
        dataLabels:{ enabled:false }
    };

    var attendanceChart = new ApexCharts(
        document.querySelector("#attendanceChartDetails"),
        attendanceOptions
    );

    attendanceChart.render();
}

function initializeSummaryChartDetails(data) {

    if (!data) return;

    var totalHeld = Number(data.totalClassesHeldThisMonth || 0);
    var attended = Number(data.classesAttended || 0);
    var late = Number(data.late || 0);
    var earlyLeave = Number(data.earlyLeave || 0);
    var absent = Number(data.absent || 0);

    var countSeries = [
        attended,
        late,
        earlyLeave,
        absent
    ];

    var percentSeries = totalHeld > 0
        ? [
            (attended / totalHeld) * 100,
            (late / totalHeld) * 100,
            (earlyLeave / totalHeld) * 100,
            (absent / totalHeld) * 100
        ].map(v => Number(v.toFixed(1)))
        : [0, 0, 0, 0];

    var options = {
        series: percentSeries,
        chart: {
            height: 390,
            type: 'radialBar'
        },
        plotOptions: {
            radialBar: {
                startAngle: 0,
                endAngle: 270,
                hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent'
                },
                dataLabels: {
                    name: { show: false },
                    value: { show: false }
                },
                barLabels: {
                    enabled: true,
                    useSeriesColors: true,
                    offsetX: -8,
                    fontSize: '16px',
                    formatter: function (seriesName, opts) {
                        return seriesName + ": " + countSeries[opts.seriesIndex];
                    }
                }
            }
        },
        colors: ['#16a34a', '#ffbb38', '#027ffe', '#ff4181'],
        labels: ['Present', 'Late', 'Early Leave', 'Absent']
    };

    if (window.customAngleCircleChart && 
        typeof window.customAngleCircleChart.destroy === "function") {
        window.customAngleCircleChart.destroy();
    }

    window.customAngleCircleChart = new ApexCharts(
        document.querySelector("#customAngleCircleChart"),
        options
    );

    window.customAngleCircleChart.render();
}

function getStudentFirstfName(studentName){
    if(studentName != null && studentName != undefined && studentName != ""){
        return studentName.split(" ")[0];
    }else{
        showMessageTheme2(0, "Student first name not found.")
    }
}