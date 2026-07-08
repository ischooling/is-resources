var TEACHER_FEEDBACK_LIST = [
    {
        teacherName: "Sarah Mitchell",
        courseName: "Mathematics",
        rating: "4.4",
        responseCount: 9,
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-female.jpeg",
        feedback: "Sarah Mitchell has received steady positive feedback across Mathematics classes.",
        ratings: [
            {label: "Teaching Effectiveness", rating: "4.6"},
            {label: "Engagement & Support", rating: "4.3"},
            {label: "Professional Presentation", rating: "4.5"},
            {label: "Punctuality & Regularity", rating: "4.2"}
        ]
    },
    {
        teacherName: "David Chen",
        courseName: "Spanish IV Honors",
        rating: "4.8",
        responseCount: 12,
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-male.jpeg",
        feedback: "David Chen has received strong ratings for clear explanations and class engagement.",
        ratings: [
            {label: "Teaching Effectiveness", rating: "4.9"},
            {label: "Engagement & Support", rating: "4.8"},
            {label: "Professional Presentation", rating: "4.7"},
            {label: "Punctuality & Regularity", rating: "4.8"}
        ]
    },
    {
        teacherName: "Aisha Khan",
        courseName: "Cybersecurity Essentials",
        rating: "4.0",
        responseCount: 6,
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-female.jpeg",
        feedback: "Aisha Khan has received helpful feedback for practical examples and support.",
        ratings: [
            {label: "Teaching Effectiveness", rating: "4.1"},
            {label: "Engagement & Support", rating: "4.0"},
            {label: "Professional Presentation", rating: "4.2"},
            {label: "Punctuality & Regularity", rating: "3.8"}
        ]
    },
    {
        teacherName: "Robert Lee",
        courseName: "Principles of Entrepreneurship",
        rating: "4.5",
        responseCount: 8,
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-male.jpeg",
        feedback: "Robert Lee has received positive feedback for making entrepreneurship concepts easy to understand.",
        ratings: [
            {label: "Teaching Effectiveness", rating: "4.5"},
            {label: "Engagement & Support", rating: "4.4"},
            {label: "Professional Presentation", rating: "4.6"},
            {label: "Punctuality & Regularity", rating: "4.5"}
        ]
    },
    {
        teacherName: "Nina Roberts",
        courseName: "World Literature",
        rating: "4.1",
        responseCount: 7,
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-female.jpeg",
        feedback: "Nina Roberts has received good feedback for discussion-led literature classes.",
        ratings: [
            {label: "Teaching Effectiveness", rating: "4.2"},
            {label: "Engagement & Support", rating: "4.1"},
            {label: "Professional Presentation", rating: "4.0"},
            {label: "Punctuality & Regularity", rating: "4.1"}
        ]
    },
    {
        teacherName: "Omar Farooq",
        courseName: "Calculus",
        rating: "",
        responseCount: 0,
        profilePic: PATH_FOLDER_IMAGE2 + "letter/dummy-male.jpeg",
        feedback: "",
        ratings: []
    }
];

function TeacherFeedbackOnLoad(){
    setDefaultTeacherFeedbackStudent();
    teacherFeedbackOnLoadEvent();
    bindTeacherFeedbackData();
}

function setDefaultTeacherFeedbackStudent(){
    if(typeof ACTIVE_STUDENT_ID !== "undefined" && ACTIVE_STUDENT_ID){
        return;
    }
    if(typeof STUDENT_LIST !== "undefined" && STUDENT_LIST.studentBasicDetails && STUDENT_LIST.studentBasicDetails.length > 0){
        ACTIVE_STUDENT_ID = STUDENT_LIST.studentBasicDetails[0].userId;
    }else if(typeof USER_ID !== "undefined"){
        ACTIVE_STUDENT_ID = USER_ID;
    }
}

function teacherFeedbackOnLoadEvent(){
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: getTeacherFeedbackSlidesToShow(),
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

function getTeacherFeedbackSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}

function renderTeacherFeedbackByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
    bindTeacherFeedbackData();
}

function bindTeacherFeedbackData(){
    $("#teacherFeedbackCardWrapper").html(getTeacherFeedbackCardsContent(TEACHER_FEEDBACK_LIST));
    bindTeacherFeedbackSummary();
}

function bindTeacherFeedbackSummary(){
    var ratedTeacherCount = 0;
    var totalResponseCount = 0;

    $.each(TEACHER_FEEDBACK_LIST, function(index, teacher){
        if(parseFloat(teacher.rating || 0) > 0){
            ratedTeacherCount++;
        }
        totalResponseCount += parseInt(teacher.responseCount || 0);
    });

    $("#teacherFeedbackTeacherRatio").text(ratedTeacherCount + " / " + TEACHER_FEEDBACK_LIST.length);
    $("#teacherFeedbackResponseCount").text(totalResponseCount);
}

function viewTeacherFeedbackDetails(index){
    var teacher = TEACHER_FEEDBACK_LIST[index];
    if(!teacher || !teacher.rating){
        return;
    }
    $("#teacherFeedbackDetailsBody").html(getTeacherFeedbackDetailsContent(teacher));
    $("#teacherFeedbackDetailsModal").modal("show");
}
