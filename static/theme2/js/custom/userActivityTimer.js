$(document).ready(function () {
    if($("#activityTimerCss").length < 1){
        $("head").append(
            `<style id="activityTimerCss">
                .indicator-circle {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
                @keyframes blink {
                    0% { opacity: 1; }
                    50% { opacity: 0.2; }
                    100% { opacity: 1; }
                }

                #liveIndicator i {
                    animation: blink 1s infinite;
                }
            </style>`
        )
    }
    $("#userActivtyTimerWrapper").append(`
       <div id="activityTimer" class="bg-primary text-white p-2 rounded shadow">
            <div class="small text-light">Today's Active Time</div>
            <div class="mb-0 font-weight-bold font-14">
                <span id="timerValue">00:00:00</span>
                <span id="liveIndicator" class="indicator-circle bg-success ml-2" style="display: none;">
                    <i class="fa fa-circle text-white small" aria-hidden="true"></i>
                </span>
                <span id="pausedIndicator" class="indicator-circle bg-warning ml-2" style="display: none;">
                    <i class="fa fa-pause text-white small" aria-hidden="true"></i>
                </span>
            </div>
        </div>
    `);

    getActivityTotalTimeByDate();
    
    if (document.hasFocus()) {
        startTimer();
    }
});

let IS_USER_ACTIVE = false;
let ACTIVE_SECONDS = 0;
let TIMER = null;
let IDLE_TIMER = null;
let IDLE_TIME = 0;
let START_TIME = null;
let END_TIME = null;
const getIdleTimeForTracker = getSettingsByTypeAndKey('CONFIGURATION','IDLE_TIME_FOR_TRACKER');
let IDLE_LIMIT = parseInt(JSON.parse(getIdleTimeForTracker)?.data?.metaValue);
// let IDLE_LIMIT = 10;
let TAB_PRESS_EVENTS = [];
let IS_SUSPICIOUS_ACTIVITY = false;
let SUSPICIOUS_ACTIVITY_TIMEOUT = null;
let KEY_PRESS_EVENTS = [];
const SUSPICIOUS_THRESHOLD = 50;   // number of keypresses allowed
const SUSPICIOUS_WINDOW = 5000; 

const sessionId = Date.now() + "-" + Math.floor(Math.random() * 1000);
let timerUpdateInterval = null;
let currentSessionTimer = null;
let TOTAL_ACTIVE_TIME = "00:00:00";

function startTimer() {
    if (!IS_USER_ACTIVE) {
        IS_USER_ACTIVE = true;
        START_TIME = new Date();
        console.log("⏱ Activity started at:", START_TIME);
        
        $('#pausedIndicator').hide();
        $('#liveIndicator').show();
        
        TIMER = setInterval(() => { 
            ACTIVE_SECONDS++; 
            updateCurrentSessionDisplay();
        }, 1000);
        
        startLiveTimerUpdates();
    }
}

async function stopTimer() {
    if (IS_USER_ACTIVE) {
        IS_USER_ACTIVE = false;
        END_TIME = new Date();
        clearInterval(TIMER);
        console.log("🛑 Activity stopped at:", END_TIME);
        
        $('#liveIndicator').hide();
        $('#pausedIndicator').show();
        
        await sendActivityData();
    }
}

function resetIdleTimer() {
    IDLE_TIME = 0;
    if (!IS_USER_ACTIVE && !IS_SUSPICIOUS_ACTIVITY) {
        startTimer();
    }
}

function checkIdleStatus() {
    IDLE_TIME++;
    if (IDLE_TIME >= IDLE_LIMIT) {
       console.log("💤 User idle for", IDLE_LIMIT, "seconds. Logging session...");
        stopTimer();
    }
}

async function sendActivityData() {
    if (ACTIVE_SECONDS === 0) return;
    var payload = {}
    payload = {
        userId: USER_ID,
        sessionId: sessionId,
        pageName: "Dashboard",
        activeSeconds: ACTIVE_SECONDS,
        startTime: convertLocalToUTCWithRequiredFormat(START_TIME, DATETIME_UTC_FORMATTER, USER_TIMEZONE, DATETIME_UTC_FORMATTER),
        endTime: convertLocalToUTCWithRequiredFormat(END_TIME, DATETIME_UTC_FORMATTER, USER_TIMEZONE, DATETIME_UTC_FORMATTER),
    }
    var responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'save-activity-track-time', payload);
    if(responseData.status == 1){
        await getActivityTotalTimeByDate();
        ACTIVE_SECONDS = 0;
        START_TIME = new Date();
        END_TIME = new Date();
    }
}

function timeToSeconds(timeString) {
    if (!timeString || timeString === 'undefined' || timeString === 'null') {
        return 0;
    }
    const timeParts = timeString.split(':');
    if (timeParts.length !== 3) {
        console.warn('Invalid time format:', timeString);
        return 0;
    }
    const hours = parseInt(timeParts[0]) || 0;
    const minutes = parseInt(timeParts[1]) || 0;
    const seconds = parseInt(timeParts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
}

function formatTimeForActivityTimer(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateCurrentSessionDisplay() {
    if (IS_USER_ACTIVE && ACTIVE_SECONDS > 0) {
        const totalSeconds = timeToSeconds(TOTAL_ACTIVE_TIME || "00:00:00") + ACTIVE_SECONDS;
        $('#timerValue').text(formatTimeForActivityTimer(totalSeconds));
    }
}

function startLiveTimerUpdates() {
    if (timerUpdateInterval) {
        clearInterval(timerUpdateInterval);
    }
    
    timerUpdateInterval = setInterval(async () => {
        await getActivityTotalTimeByDate();
    }, 30000);
}

function stopLiveTimerUpdates() {
    if (timerUpdateInterval) {
        clearInterval(timerUpdateInterval);
        timerUpdateInterval = null;
    }
}

async function getActivityTotalTimeByDate(trackerDate) {
    var payload = {}
    if(trackerDate == undefined || trackerDate == '' || trackerDate == null){
        trackerDate = new Date();
    }
    payload = {
        userId: USER_ID,
        timezone: USER_TIMEZONE,
        activeTrackerDate: convertLocalToUTCWithRequiredFormat(trackerDate, DATETIME_UTC_FORMATTER, USER_TIMEZONE, DATETIME_UTC_FORMATTER),
    }
    try {
        var responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'get-activity-track-time', payload);
        if(responseData.status == 1){
            TOTAL_ACTIVE_TIME = responseData.totalActiveTimeOfCurrentDate || "00:00:00";
            
            if (IS_USER_ACTIVE) {
                const totalSeconds = timeToSeconds(TOTAL_ACTIVE_TIME) + ACTIVE_SECONDS;
                $('#timerValue').text(formatTimeForActivityTimer(totalSeconds));
                $('#liveIndicator').show();
                $('#pausedIndicator').hide();
            } else {
                $('#timerValue').text(TOTAL_ACTIVE_TIME);
                $('#liveIndicator').hide();
                $('#pausedIndicator').show();
            }
        }else{
            TOTAL_ACTIVE_TIME = "00:00:00";
        }
    } catch (error) {
        console.error('Error fetching activity time:', error);
        TOTAL_ACTIVE_TIME = "00:00:00";
    }
}

// function getActivityTotalTimeByFilterRequest(formId){

//     var payload = {}
//     var trackerDateTo=$('#'+formId+' #trackerDateTo').val();
//     var trackerDateFrom=$('#'+formId+' #trackerDateFrom').val();
//     var userId = $('#'+formId+' #userId').val()
//     if(trackerDateTo==undefined || trackerDateTo=='' || trackerDateTo==null){
//         trackerDateTo = new Date();
//     }
//     if(trackerDateFrom==undefined || trackerDateFrom=='' || trackerDateFrom==null){
//         trackerDateFrom = new Date();
//     }
//      if(userId==undefined || userId=='' || userId==null){
//         userId = USER_ID;
//     }
//     payload['userId']= $('#'+formId+' #userName').val();
//     // payload['userName']= $('#'+formId+' #userName').text();
//     payload['userEmail']= $('#'+formId+' #userEmail').val();
//     payload['activeTrackerDateTo']= trackerDateTo;
//     payload['activeTrackerDateFrom']= trackerDateFrom;
//     payload['numberOfRecords']= $('#'+formId+' #numberOfRecords').val();
//     return payload;
// }

// async function getActivityTotalTimeByFilter(formId) {

//     var payload = getActivityTotalTimeByFilterRequest(formId);
//     var responseData = await getDashboardDataBasedUrlAndPayload(false, false, 'get-activity-track-time-by-filter', payload);
//     if(responseData.status == 1){
//        renderDashboardMonitoringTableData(responseData);
//     }else{
//          $("#dashboardMonitoringTable tbody").empty();
//         $("#dashboardMonitoringTable tbody").html(
//             `<tr>
//                 <td colspan="6" class="text-center">No data found</td>
//             </tr>`
//         );
//     }
// }

document.addEventListener("keydown", function(event) {

    const now = Date.now();

    // Track all key presses
    KEY_PRESS_EVENTS.push(now);

    // Keep only last 5 seconds
    KEY_PRESS_EVENTS = KEY_PRESS_EVENTS.filter(t => now - t < SUSPICIOUS_WINDOW);

    // Detect suspicious fast key spam
    if (KEY_PRESS_EVENTS.length > SUSPICIOUS_THRESHOLD) {
        
        console.warn("🚨 Suspicious Key Spam Detected:", KEY_PRESS_EVENTS.length);

        IS_SUSPICIOUS_ACTIVITY = true;
        stopTimer();

        $('#liveIndicator').hide();
        $('#pausedIndicator').show();
        $('#timerValue').text("Suspicious Activity");

        // Reset suspicious activity after cool-down
        clearTimeout(SUSPICIOUS_ACTIVITY_TIMEOUT);

        SUSPICIOUS_ACTIVITY_TIMEOUT = setTimeout(() => {
            IS_SUSPICIOUS_ACTIVITY = false;
            KEY_PRESS_EVENTS = [];
            console.log("✅ Suspicious activity cleared");
            getActivityTotalTimeByDate();
        }, 5000);

        return; 
    }

    // // Optional: keep your existing TAB-specific logic
    // if (event.key === 'Tab') {
    //     // Your TAB spam logic stays
    // }

    // Normal user activity resets idle timer
    if (!IS_SUSPICIOUS_ACTIVITY) {
        resetIdleTimer();
    }

}, false);

window.onfocus = function() {
    if (!IS_SUSPICIOUS_ACTIVITY) {
        startTimer();
    }
};

window.onblur = function() {
    stopTimer();
};

["mousemove", "keydown", "scroll", "click"].forEach(evt => {
    document.addEventListener(evt, resetIdleTimer, false);
});

IDLE_TIMER = setInterval(checkIdleStatus, 1000);

document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
        console.log("📴 Tab hidden / switched away");
        stopTimer();
    } else {
        console.log("📱 Tab visible again");
        startTimer();
        getActivityTotalTimeByDate();
    }
});

window.addEventListener("beforeunload", function() {
    stopTimer();
    stopLiveTimerUpdates();
});