async function getStudentOwnAttendanceDetails(studentId){
    var studentPerformanceData = await getStudentOwnAttendanceData(studentId);
    if(!studentPerformanceData || !studentPerformanceData.details){
        showMessageTheme2(0, "Attendance details not found");
        return;
    }
    $("#studentOwnAttendanceDetailsCard").html(
        getStudentOwnShortOverviewContent(studentPerformanceData.details.summary) + getStudentOwnAttendanceDetailsContent()
    );
    initializeStudentOwnAttendanceChart(studentPerformanceData.details.attendanceOverview);
    initializeStudentOwnSummaryChart(studentPerformanceData.details.summary);
}

async function getStudentOwnAttendanceData(studentId){
    var payload = {userId: studentId, studentUserId: studentId};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-attendance-full",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function initializeStudentOwnAttendanceChart(data){
    if(!Array.isArray(data)){
        data = [];
    }

    var currentYear = String(new Date().getFullYear());
    var currentYearData = data.filter(item => item.monthKey && item.monthKey.startsWith(currentYear));

    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    var monthMap = {};
    currentYearData.forEach(item => {
        monthMap[item.monthLabel] = item.attendancePercent;
    });

    var attendanceData = months.map(month => monthMap[month] ?? null);

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
                            ${month} ${new Date().getFullYear()}
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
        colors: attendanceData.map(val => val === null ? '#e3e8e6' : '#1e8e3e'),
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

    if (window.studentOwnAttendanceChart &&
        typeof window.studentOwnAttendanceChart.destroy === "function") {
        window.studentOwnAttendanceChart.destroy();
    }

    window.studentOwnAttendanceChart = new ApexCharts(
        document.querySelector("#studentOwnAttendanceChart"),
        attendanceOptions
    );

    window.studentOwnAttendanceChart.render();
}

function initializeStudentOwnSummaryChart(data){

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

    if (window.studentOwnSummaryChart &&
        typeof window.studentOwnSummaryChart.destroy === "function") {
        window.studentOwnSummaryChart.destroy();
    }

    window.studentOwnSummaryChart = new ApexCharts(
        document.querySelector("#studentOwnSummaryChart"),
        options
    );

    window.studentOwnSummaryChart.render();
}
