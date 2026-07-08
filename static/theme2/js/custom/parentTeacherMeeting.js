var PARENT_TEACHER_MEETING_TEACHERS = [
    {
        teacherName: "Sarah Mitchell",
        salutation: "Ms.",
        courseName: "Mathematics",
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-female.jpeg",
        isFree: true,
        feeText: "First meeting free",
        slots: [
            {time: "9:00 AM", status: "past", timeRange: "9:00 AM - 9:30 AM"},
            {time: "10:30 AM", status: "booked", timeRange: "10:30 AM - 11:00 AM"},
            {time: "1:00 PM", status: "past", timeRange: "1:00 PM - 1:30 PM"},
            {time: "3:30 PM", status: "available", timeRange: "3:30 PM - 4:00 PM"}
        ]
    },
    {
        teacherName: "David Chen",
        salutation: "Mr.",
        courseName: "Spanish IV Honors",
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-male.jpeg",
        isFree: false,
        feeText: "$15 per meeting",
        slots: [
            {time: "9:00 AM", status: "past", timeRange: "9:00 AM - 9:30 AM"},
            {time: "10:30 AM", status: "booked", timeRange: "10:30 AM - 11:00 AM"},
            {time: "1:00 PM", status: "past", timeRange: "1:00 PM - 1:30 PM"},
            {time: "3:30 PM", status: "available", timeRange: "3:30 PM - 4:00 PM"}
        ]
    },
    {
        teacherName: "Aisha Khan",
        salutation: "Ms.",
        courseName: "Cybersecurity Essentials",
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-female.jpeg",
        isFree: false,
        feeText: "$15 per meeting",
        slots: [
            {time: "9:00 AM", status: "past", timeRange: "9:00 AM - 9:30 AM"},
            {time: "10:30 AM", status: "booked", timeRange: "10:30 AM - 11:00 AM"},
            {time: "1:00 PM", status: "past", timeRange: "1:00 PM - 1:30 PM"},
            {time: "3:30 PM", status: "available", timeRange: "3:30 PM - 4:00 PM"}
        ]
    },
    {
        teacherName: "Robert Lee",
        salutation: "Mr.",
        courseName: "Principles of Entrepreneurship",
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-male.jpeg",
        isFree: true,
        feeText: "First meeting free",
        slots: [
            {time: "9:00 AM", status: "past", timeRange: "9:00 AM - 9:30 AM"},
            {time: "10:30 AM", status: "booked", timeRange: "10:30 AM - 11:00 AM"},
            {time: "1:00 PM", status: "past", timeRange: "1:00 PM - 1:30 PM"},
            {time: "3:30 PM", status: "available", timeRange: "3:30 PM - 4:00 PM"}
        ]
    },
    {
        teacherName: "Omar Farooq",
        salutation: "Mr.",
        courseName: "Calculus",
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-male.jpeg",
        isFree: true,
        feeText: "First meeting free",
        slots: [
            {time: "9:00 AM", status: "past", timeRange: "9:00 AM - 9:30 AM"},
            {time: "10:30 AM", status: "booked", timeRange: "10:30 AM - 11:00 AM"},
            {time: "1:00 PM", status: "past", timeRange: "1:00 PM - 1:30 PM"},
            {time: "3:30 PM", status: "available", timeRange: "3:30 PM - 4:00 PM"}
        ]
    }
];

var PARENT_TEACHER_MEETINGS = [
    {
        title: "PTM with Mr. David Chen for Spanish IV Honors",
        host: "Mr. David Chen",
        courseName: "Spanish IV Honors",
        date: parentTeacherMeetingFormatDate(new Date()),
        time: "3:30 PM - 4:00 PM"
    },
    {
        title: "PTM with Ms. Aisha Khan for Cybersecurity Essentials",
        host: "Ms. Aisha Khan",
        courseName: "Cybersecurity Essentials",
        date: parentTeacherMeetingFormatDate(new Date()),
        time: "10:00 AM - 10:30 AM"
    }
];

var SELECTED_PTM_TEACHER_INDEX = 0;
var SELECTED_PTM_SLOT_INDEX = "";
var SELECTED_PTM_DAY_INDEX = 0;

function parentTeacherMeetingFormatDate(date){
    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
}

function getParentTeacherMeetingWeekDays(){
    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var days = [];
    var today = new Date();
    var monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    for(var i = 0; i < 7; i++){
        var day = new Date(monday);
        day.setDate(monday.getDate() + i);
        days.push({
            dayName: dayNames[day.getDay()],
            dayNo: String(day.getDate()),
            fullDate: parentTeacherMeetingFormatDate(day)
        });
    }
    return days;
}

function getParentTeacherMeetingSelectedDayDate(){
    var weekDays = getParentTeacherMeetingWeekDays();
    var day = weekDays[SELECTED_PTM_DAY_INDEX] || weekDays[0];
    return day.fullDate;
}

function getParentTeacherMeetingSubjectImage(courseName){
    var name = String(courseName || "").toLowerCase();
    if(name.indexOf("spanish") >= 0) return "spanish.jpg";
    if(name.indexOf("cyber") >= 0 || name.indexOf("computer") >= 0 || name.indexOf("technology") >= 0) return "computer-science.jpg";
    if(name.indexOf("calculus") >= 0) return "Pre-Calculus.jpg";
    if(name.indexOf("math") >= 0 || name.indexOf("algebra") >= 0 || name.indexOf("geometry") >= 0) return "Mathematics.jpg";
    if(name.indexOf("entrepreneur") >= 0 || name.indexOf("business") >= 0) return "ENTREPRENEURSHIP.jpg";
    if(name.indexOf("language arts") >= 0 || name.indexOf("english") >= 0) return "English.jpg";
    if(name.indexOf("science") >= 0 || name.indexOf("biology") >= 0 || name.indexOf("physics") >= 0 || name.indexOf("chemistry") >= 0) return "Science.jpg";
    return "banner.jpg";
}

function getParentTeacherMeetingJoinUrl(meeting){
    var host = meeting.host || (String(meeting.title || "").match(/PTM with (.*) for /) || [])[1] || "";
    var courseName = meeting.courseName || (String(meeting.title || "").match(/ for (.*)$/) || [])[1] || "";
    return BASE_URL + CONTEXT_PATH + "ptm-demo-meeting"
        + "?title=" + encodeURIComponent(meeting.title || "")
        + "&host=" + encodeURIComponent(host)
        + "&date=" + encodeURIComponent(meeting.date || "")
        + "&time=" + encodeURIComponent(meeting.time || "")
        + "&img=" + encodeURIComponent(getParentTeacherMeetingSubjectImage(courseName));
}

function ParentTeacherMeetingOnLoad(){
    setDefaultParentTeacherMeetingStudent();
    parentTeacherMeetingOnLoadEvent();
    onRangeChange();
    bindParentTeacherMeetingData();
}

function setDefaultParentTeacherMeetingStudent(){
    if(typeof ACTIVE_STUDENT_ID !== "undefined" && ACTIVE_STUDENT_ID){
        return;
    }
    if(typeof STUDENT_LIST !== "undefined" && STUDENT_LIST.studentBasicDetails && STUDENT_LIST.studentBasicDetails.length > 0){
        ACTIVE_STUDENT_ID = STUDENT_LIST.studentBasicDetails[0].userId;
    }else if(typeof USER_ID !== "undefined"){
        ACTIVE_STUDENT_ID = USER_ID;
    }
}

function parentTeacherMeetingOnLoadEvent(){
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: getParentTeacherMeetingSlidesToShow(),
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            responsive: [
                {breakpoint: 992, settings: {slidesToShow: 3}},
                {breakpoint: 768, settings: {slidesToShow: 2}},
                {breakpoint: 576, settings: {slidesToShow: 1}}
            ]
        });
    }
}

function getParentTeacherMeetingSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}

function renderParentTeacherMeetingByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
    bindParentTeacherMeetingData();
}

function bindParentTeacherMeetingData(){
    $("#parentTeacherMeetingListWrapper").html(getParentTeacherMeetingRowsContent(getParentTeacherMeetingFilteredMeetings()));
    $("#parentTeacherMeetingTeacherWrapper").html(getParentTeacherMeetingTeacherCardsContent(PARENT_TEACHER_MEETING_TEACHERS));
    $("#ptmFreeRemaining").text(6 - PARENT_TEACHER_MEETINGS.length);
}

function parentTeacherMeetingParseDate(value){
    if(!value){
        return null;
    }
    var parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
}

function parentTeacherMeetingAddDays(date, days){
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function getParentTeacherMeetingFilteredMeetings(){
    var start = parentTeacherMeetingParseDate($("#mf-start").val());
    var end = parentTeacherMeetingParseDate($("#mf-end").val());
    if(!start || !end){
        return PARENT_TEACHER_MEETINGS;
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return $.grep(PARENT_TEACHER_MEETINGS, function(meeting){
        var meetingDate = parentTeacherMeetingParseDate(meeting.date);
        return meetingDate && meetingDate >= start && meetingDate <= end;
    });
}

function onRangeChange(){
    var range = $("#mf-range").val();
    var today = new Date();
    if(range == "today"){
        $("#mf-start").val(parentTeacherMeetingFormatDate(today));
        $("#mf-end").val(parentTeacherMeetingFormatDate(today));
    }else if(range == "yesterday"){
        var yesterday = parentTeacherMeetingAddDays(today, -1);
        $("#mf-start").val(parentTeacherMeetingFormatDate(yesterday));
        $("#mf-end").val(parentTeacherMeetingFormatDate(yesterday));
    }else if(range == "week"){
        var weekStart = parentTeacherMeetingAddDays(today, -((today.getDay() + 6) % 7));
        var weekEnd = parentTeacherMeetingAddDays(weekStart, 6);
        $("#mf-start").val(parentTeacherMeetingFormatDate(weekStart));
        $("#mf-end").val(parentTeacherMeetingFormatDate(weekEnd));
    }else if(range == "month"){
        var monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        var monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        $("#mf-start").val(parentTeacherMeetingFormatDate(monthStart));
        $("#mf-end").val(parentTeacherMeetingFormatDate(monthEnd));
    }else{
        $("#mf-start").val("");
        $("#mf-end").val("");
    }
}

function searchParentTeacherMeetings(){
    bindParentTeacherMeetingData();
}

function resetParentTeacherMeetings(){
    $("#mf-range").val("today");
    onRangeChange();
    bindParentTeacherMeetingData();
}

function openParentTeacherMeetingModal(index){
    SELECTED_PTM_TEACHER_INDEX = index;
    SELECTED_PTM_SLOT_INDEX = "";
    SELECTED_PTM_DAY_INDEX = (new Date().getDay() + 6) % 7;
    $.each(PARENT_TEACHER_MEETING_TEACHERS[index].slots, function(slotIndex, slot){
        slot.selected = false;
    });
    $("#parentTeacherMeetingModalBody").html(getParentTeacherMeetingModalBodyContent(PARENT_TEACHER_MEETING_TEACHERS[index]));
    $("#parentTeacherMeetingModal").modal("show");
}

function selectParentTeacherMeetingDay(index){
    SELECTED_PTM_DAY_INDEX = index;
    $("#ptmDayWrapper .btn").removeClass("btn-primary").addClass("btn-light border");
    $("#ptmDayWrapper .btn").eq(index).removeClass("btn-light border").addClass("btn-primary");
    if(SELECTED_PTM_SLOT_INDEX !== ""){
        var teacher = PARENT_TEACHER_MEETING_TEACHERS[SELECTED_PTM_TEACHER_INDEX];
        $("#ptmSelectedSlotSummary").html(getParentTeacherMeetingSelectedSummaryContent(teacher, teacher.slots[SELECTED_PTM_SLOT_INDEX], getParentTeacherMeetingSelectedDayDate()));
    }
}

function selectParentTeacherMeetingSlot(index){
    var teacher = PARENT_TEACHER_MEETING_TEACHERS[SELECTED_PTM_TEACHER_INDEX];
    SELECTED_PTM_SLOT_INDEX = index;
    $.each(teacher.slots, function(slotIndex, slot){
        slot.selected = slotIndex == index;
    });
    $("#ptmSlotWrapper").html(getParentTeacherMeetingSlotButtonsContent(teacher.slots));
    $("#ptmSelectedSlotSummary").html(getParentTeacherMeetingSelectedSummaryContent(teacher, teacher.slots[index], getParentTeacherMeetingSelectedDayDate()));
    $("#ptmConfirmMeetingBtn").removeClass("disabled").text(teacher.isFree ? "Confirm Free Meeting" : "Confirm Meeting");
}

function confirmParentTeacherMeeting(){
    if(SELECTED_PTM_SLOT_INDEX === ""){
        return;
    }
    var teacher = PARENT_TEACHER_MEETING_TEACHERS[SELECTED_PTM_TEACHER_INDEX];
    var slot = teacher.slots[SELECTED_PTM_SLOT_INDEX];
    PARENT_TEACHER_MEETINGS.unshift({
        title: "PTM with " + teacher.salutation + " " + teacher.teacherName + " for " + teacher.courseName,
        host: teacher.salutation + " " + teacher.teacherName,
        courseName: teacher.courseName,
        date: getParentTeacherMeetingSelectedDayDate(),
        time: slot.timeRange
    });
    $("#parentTeacherMeetingModal").modal("hide");
    bindParentTeacherMeetingData();
    parentTeacherMeetingShowConfirmMessage();
}

function parentTeacherMeetingShowConfirmMessage(){
    var message = "Meeting confirmed succesfully";
    if(typeof showMessageTheme2 === "function"){
        showMessageTheme2(1, message, "", true);
        return;
    }
    if($("#parentTeacherMeetingSuccessModal").length === 0){
        $("body").append(`
            <div class="modal fade" id="parentTeacherMeetingSuccessModal" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-sm" role="document">
                    <div class="modal-content rounded-10 border-0 text-center">
                        <div class="modal-body p-4">
                            <div class="bg-light-success text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style="width:56px;height:56px;">
                                <i class="fa fa-check font-24"></i>
                            </div>
                            <h5 class="text-dark font-weight-bold mb-3">${message}</h5>
                            <button type="button" class="btn btn-primary px-4" data-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    $("#parentTeacherMeetingSuccessModal").modal("show");
}
