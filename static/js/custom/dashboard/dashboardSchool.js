var demo_Type = "pending";
var ENCRYPTED_USER_ID;
function callDashboardPageSchool(moduleId, pageNo, replaceDiv, extraParam) {
  customLoader(true);
  if (pageNo == "home") {
    callForDashboardData(
      "formIdIfAny",
      "school-admin-content?moduleId=" + moduleId + "&schoolId=" + SCHOOL_ID
    );
  } else if (pageNo == "dashboard") {
    if (SCHOOL_TYPE == "WLP") {
      var urlSend = "/dashboard/admin-partner-dashboard?moduleId=" + moduleId;
      getAsPost(urlSend);
      customLoader(false);
      //partner-dashboard
      //$('#dashboardContentInHTML').html(renderPartnerDashboard('Partner Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
    } else {
      callForDashboardData(
        "formIdIfAny",
        "dashboard-content?moduleId=" + moduleId,
        replaceDiv
      );
    }
  } else if (pageNo == "dashboard-white-school") {
    callForDashboardData(
      "formIdIfAny",
      "dashboard-content?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "create-school") {
    callForDashboardData(
      "formIdIfAny",
      "create-school-content?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "created-school-list") {
    callForDashboardData(
      "formIdIfAny",
      "created-school-list?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "create-user") {
    callForDashboardData(
      "formIdIfAny",
      "create-user-content?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "user-list") {
    callForDashboardData(
      "formIdIfAny",
      "user-list?moduleId=" + moduleId + "&profileFor=common"
    );
  } else if (pageNo == "student-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=student" +
        extraParam,
      replaceDiv
    );
    $("#studentTab").show();
    $("#teacherTab").hide();
    $("#parentsTab").show();
    $("#flexStudentTab").hide();
    $("#batchStudentTab").hide();
    //$('.modal-backdrop').remove();
  } else if (pageNo == "teacher-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=teacher" +
        extraParam,
      replaceDiv
    );
    $("#studentTab").hide();
    $("#teacherTab").show();
    $("#parentsTab").hide();
    $("#flexStudentTab").hide();
    $("#batchStudentTab").hide();
    $("#studentTab").css("display", "none");
    $("#teacherTab").css("display", "block");
    $("#parentsTab").css("display", "none");
    $("#flexStudentTab").css("display", "none");
    $("#batchStudentTab").css("display", "none");
  } else if (pageNo == "parent-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=parent" +
        extraParam,
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").show();
      $("#flexStudentTab").hide();
      $("#batchStudentTab").hide();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#parentsTab").css("display", "block");
      $("#flexStudentTab").css("display", "none");
      $("#batchStudentTab").css("display", "none");
    }, 100);
  } else if (pageNo == "school-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=school" +
        extraParam,
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").hide();
      $("#schoolTab").show();
      $("#flexStudentTab").hide();
      $("#batchStudentTab").hide();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#schoolTab").css("display", "block");
      $("#flexStudentTab").css("display", "none");
      $("#batchStudentTab").css("display", "none");
    }, 100);
  } else if (pageNo == "flex-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=flexStudent" +
        extraParam,
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").hide();
      $("#schoolTab").hide();
      $("#flexStudentTab").show();
      $("#batchStudentTab").hide();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#schoolTab").css("display", "none");
      $("#flexStudentTab").css("display", "block");
      $("#batchStudentTab").css("display", "none");
    }, 100);
  } else if (pageNo == "batch-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=batchStudent" +
        extraParam,
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").hide();
      $("#schoolTab").hide();
      $("#flexStudentTab").hide();
      $("#batchStudentTab").show();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#schoolTab").css("display", "none");
      $("#flexStudentTab").css("display", "none");
      $("#batchStudentTab").css("display", "block");
    }, 100);
  } else if (pageNo == "manage-batch-student") {
    callForDashboardData(
      "formIdIfAny",
      "manage-batch-student?moduleId=" + moduleId
    );
  } else if (pageNo == "online-user") {
    callForDashboardData(
      "formIdIfAny",
      "online-users-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "5a") {
    callForDashboardData("formIdIfAny", "teacher-salary-content");
  } else if (pageNo == "teacher-profile") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-content?moduleId=" +
        moduleId +
        "&ids=13,24&types=0,1"
    );
  } else if (pageNo == "pending-interview-remarks") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-interview-content?moduleId=" +
        moduleId +
        "&ids=19,20,22,23&types=0,1"
    );
  } else if (pageNo == "pending-training-remarks") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-content?moduleId=" +
        moduleId +
        "&ids=16&types=0,1"
    );
  } else if (pageNo == "5e") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-content?moduleId=" +
        moduleId +
        "&ids=0,14,16,17,19,20&types=0,1"
    );
  } else if (pageNo == "approved-teachers") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-approved-request-content?moduleId=" +
        moduleId +
        "&ids=0&types=0,1"
    );
  } else if (pageNo == "withdraw-teachers") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-withdraw-request-content?moduleId=" +
        moduleId +
        "&ids=1&types=0,1"
    );
  } else if (pageNo == "rejected-teachers") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-content?moduleId=" +
        moduleId +
        "&ids=15,18,21&types=2"
    );
  } else if (pageNo == "6a") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-content?moduleId=" + moduleId + "&ids=1&types=2"
    );
  } else if (pageNo == "manage-school-list") {
    callForDashboardData(
      "formIdIfAny",
      "school-profile-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "6c") {
    callForDashboardData("formIdIfAny", "school-list-request-content");
  } else if (pageNo == "rejected-school") {
    callForDashboardData(
      "formIdIfAny",
      "rejected-school-profile-content?moduleId=" + moduleId
    );
  } else if (pageNo == "review-school-payment") {
    callForDashboardData(
      "formIdIfAny",
      "review-school-payment-content?moduleId=" + moduleId
    );
  } else if (pageNo == "6f") {
    callForDashboardData(
      "formIdIfAny",
      "school-date-of-visit-content?visitSubmitted="
    );
  } else if (pageNo == "6g") {
    callForDashboardData("formIdIfAny", "school-visit-travel-content");
  } else if (pageNo == "evaluation-form") {
    callForDashboardData(
      "formIdIfAny",
      "school-evaluation-form-content?moduleId=" + moduleId
    );
  } else if (pageNo == "student-transcript") {
    callForDashboardData("formIdIfAny", "student-list?moduleId=" + moduleId);
  } else if (pageNo == "add-view-syllabus") {
    callForDashboardData(
      "formIdIfAny",
      "current-syllabus-request-content?moduleId=" +
        moduleId +
        "&controlType=add"
    );
  } else if (pageNo == "8b") {
    callForDashboardData("formIdIfAny", "previous-syllabus-request-content");
  } else if (pageNo == "current-task-request") {
    callForDashboardData("formIdIfAny", "current-task-request-content");
  } else if (pageNo == "9b") {
    callForDashboardData("formIdIfAny", "previous-task-request-content");
  } else if (pageNo == "10a") {
    callForDashboardData(
      "formIdIfAny",
      "email-compose-content?schoolId=" + SCHOOL_ID
    );
  } else if (pageNo == "10b") {
    callForDashboardData(
      "formIdIfAny",
      "email-inbox-content?schoolId=" + SCHOOL_ID
    );
  } else if (pageNo == "10c") {
    callForDashboardData(
      "formIdIfAny",
      "email-sent-content?schoolId=" + SCHOOL_ID
    );
  } else if (pageNo == "3") {
    // callForDashboardData("formIdIfAny", "student-teacher-mapping-content");
  } else if (pageNo == "manage-events") {
    callForDashboardData("formIdIfAny", "school-events-content");
  } else if (pageNo == "inquiries") {
    callForDashboardData(
      "formIdIfAny",
      "inquiry-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "14") {
    callForDashboardData("formIdIfAny", "school-teacher-question-content");
  } else if (pageNo == "teacher-interview-slot") {
    callForDashboardData(
      "formIdIfAny",
      "meeting-slots-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "scholarship") {
    callForDashboardData(
      "formIdIfAny",
      "scholarship-request-content?moduleId=" + moduleId+"&themetype="
    );
  } else if (pageNo == "payment") {
    // $('#userPaymentHistoryDetails').hide();
    // callForDashboardData('formIdIfAny','payment-history-content?moduleId='+moduleId+'&userId=');
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "graduation-ceremony-attendees") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "conflicted-user-list") {
    callForDashboardData(
      "formIdIfAny",
      "conflicted-user-content?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-slots") {
    callForDashboardData(
      "formIdIfAny",
      "school-enabled-date-content?moduleId=" +
        moduleId +
        "&startDate=&endDate="
    );
  } else if (pageNo == "18b") {
    callForDashboardData(
      "formIdIfAny",
      "school-enabled-date-submit-content?moduleId=" + moduleId
    );
  } else if (pageNo == "delete-user") {
    callForDashboardData(
      "formIdIfAny",
      "delete-user-content?moduleId=" + moduleId + "&u="
    );
  } else if (pageNo == "maintenance-down-message") {
    callForDashboardData(
      "formIdIfAny",
      "maintenance-down-message?moduleId=" + moduleId
    );
  } else if (pageNo == "20") {
    callForDashboardData("formIdIfAny", "lms-user-content");
  } else if (pageNo == "manage-course") {
    callForDashboardData(
      "formIdIfAny",
      "manage-subjects-content?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-students") {
    callForDashboardData(
      "formIdIfAny",
      "choose-school-content?moduleId=" + moduleId + "&schoolId="
    );
  } else if (pageNo == "21a") {
    callForDashboardData(
      "formIdIfAny",
      "school-list-content?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "21b") {
    callForDashboardData(
      "formIdIfAny",
      "school-student-list?moduleId=" +
        moduleId +
        "&controlType=4" +
        extraParam,
      replaceDiv
    );
  } else if (pageNo == "21c") {
    callForDashboardData(
      "formIdIfAny",
      "school-student-list?moduleId=" +
        moduleId +
        "&controlType=5" +
        extraParam,
      replaceDiv
    );
  } else if (pageNo == "school-student-list") {
    callForDashboardData(
      "formIdIfAny",
      "student-list-content?moduleId=" +
        moduleId +
        "&controlType=1" +
        extraParam,
      replaceDiv
    );
  } else if (pageNo == "req-subjects") {
    callForDashboardData(
      "formIdIfAny",
      "getSchoolListFor-ReqSubjects-content?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "all-subjects") {
    callForDashboardData(
      "formIdIfAny",
      "getSchoolListFor-AllSubjects-content?moduleId=" + moduleId,
      replaceDiv
    );
  } else if (pageNo == "24") {
    callForDashboardData("formIdIfAny", "add-RM", replaceDiv);
  } else if (pageNo == "24a") {
    callForDashboardData("formIdIfAny", "edit-RM?rmId=", replaceDiv);
  } else if (pageNo == "manage-not-lms-user") {
    callForDashboardData(
      "formIdIfAny",
      "show-Student-not-lms-List?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-lms-user") {
    //		callForDashboardData('formIdIfAny','show-Student-lms-List?moduleId='+moduleId);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "27") {
    //		callForDashboardData('formIdIfAny','reports');
  } else if (pageNo == "manage-course-provider") {
    callForDashboardData(
      "formIdIfAny",
      "manage-course-provider-content?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-categories") {
    callForDashboardData(
      "formIdIfAny",
      "manage-course-content?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-courses") {
    callForDashboardData(
      "formIdIfAny",
      "manage-subject-content?moduleId=" + moduleId
    );
    //	}else if(pageNo=='30'){
    //		callForDashboardData('formIdIfAny','manage-placement-course');
    //	}else if(pageNo=='31'){
    //		callForDashboardData('formIdIfAny','manage-placement-subject-content');
    //	}else if(pageNo=='32'){
    //		callForDashboardData('formIdIfAny','current-placement-syllabus-request-content');
  } else if (pageNo == "request-demo") {
    demo_Type = "pending";
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=student&campaign=admin&demotype=pool&demoClickFrom=list"
    );
  } else if (pageNo == "accept-demo-list") {
    demo_Type = "accept";
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=student&campaign=admin&demotype=accept&demoClickFrom=list"
    );
  } else if (pageNo == "meet-counselor") {
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=student&campaign=counselor&demoClickFrom=list"
    );
  } else if (pageNo == "ppc-school") {
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=school&demoClickFrom=list"
    );
  } else if (pageNo == "student-meet-slot") {
    callForDashboardData(
      "formIdIfAny",
      "demo-request-meeting-content?moduleId=" +
        moduleId +
        "&requestType=REQUESTDEMO"
    );
  } else if (pageNo == "counselor-meet-slot") {
    callForDashboardData(
      "formIdIfAny",
      "demo-request-meeting-content?moduleId=" +
        moduleId +
        "&requestType=COUNSELORMEET"
    );
  } else if (pageNo == "Connect-to-impact-slot") {
    callForDashboardData(
      "formIdIfAny",
      "demo-request-meeting-content?moduleId=" +
        moduleId +
        "&requestType=CONNECTMEET"
    );
  } else if (pageNo == "ppc-student") {
    callForDashboardData(
      "formIdIfAny",
      "ppc-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "lms-student-performance") {
    callForDashboardData(
      "formIdIfAny",
      "lms-student-mail?moduleId=" + moduleId
    );
  } else if (pageNo == "student-weekly-progress") {
    callForDashboardData(
      "formIdIfAny",
      "student-weekly-progress?moduleId=" + moduleId
    );
  } else if (pageNo == "3c") {
    callForDashboardData(
      "formIdIfAny",
      "student-list-content?controlType=2&schoolId=" +
        SCHOOL_ID +
        "&moduleId=" +
        moduleId
    );
  } else if (pageNo == "evaluation-test-form-details") {
    callForDashboardData(
      "formIdIfAny",
      "evaluation-test-form?moduleId=" + moduleId
    );
  } else if (pageNo == "accelerated-mode") {
    callForDashboardData(
      "formIdIfAny",
      "accelerated-mode-students-details?moduleId=" + moduleId+"&themetype="
    );
  } else if (pageNo == "extra-activity") {
    callForDashboardData(
      "formIdIfAny",
      "add-extra-activity?moduleId=" + moduleId
    );
  }
  //this condition will be evaluate when Admin click on Tips for Educator Ref: IS-191
  else if (pageNo == "tips-educators") {
    callForDashboardData(
      "formIdIfAny",
      "tips-for-educator?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-educational-counselor") {
    callForDashboardData(
      "formIdIfAny",
      "manage-counselor-content?moduleId=" + moduleId
    );
  } else if (pageNo == "add-counselor") {
    callForDashboardData(
      "formIdIfAny",
      "add-counseler-content" + extraParam,
      replaceDiv
    );
    //IF RETURN HTML NOT RETURN FROM JSP
  } else if (pageNo == "student-teacher-sessions") {
    //callForDashboardData('formIdIfAny','student-teacher-sessions-report?moduleId='+moduleId);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
    //IF RETURN HTML NOT RETURN FROM JSP
  } else if (pageNo == "manage-session") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "notifications" || pageNo == "parent-notifications") {
    callForDashboardData("formIdIfAny", "notifications" + extraParam);
  } else if (pageNo == "module") {
    callForDashboardData("formIdIfAny", "get-modules?moduleId=" + moduleId);
  } else if (pageNo == "modulerole") {
    callForDashboardData("formIdIfAny", "get-roles?moduleId=" + moduleId);
  } else if (pageNo == "extra-session-details") {
    callForDashboardData(
      "formIdIfAny",
      "extra-session-details?moduleId=" + moduleId
    );
  } else if (pageNo == "academic-year-date-settings") {
    callForDashboardData(
      "formIdIfAny",
      "academic-year-date-settings?moduleId=" + moduleId
    );
  } else if (pageNo == "rolerights") {
    callForDashboardData(
      "formIdIfAny",
      "get-module-rights?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-user-list") {
    callForDashboardData(
      "formIdIfAny",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=common" +
        extraParam
    );
  } else if (pageNo == "date-visit-request") {
    callForDashboardData(
      "formIdIfAny",
      "school-date-of-visit-content?moduleId=" +
        moduleId +
        "&visitSubmitted=" +
        extraParam
    );
  } else if (pageNo == "edit-subject") {
    callForDashboardData(
      "formIdIfAny",
      "edit-subject-content" + extraParam,
      replaceDiv
    );
  } else if (pageNo == "edit-subjectB2C") {
    callForDashboardData(
      "formIdIfAny",
      "edit-subjectB2C-content" + extraParam,
      replaceDiv
    );
  } else if (pageNo == "3syllabus") {
    callForDashboardData(
      "formIdIfAny",
      "view-syllabus-content" + extraParam,
      replaceDiv
    );
  } else if (pageNo == "3syllabusContent") {
    callForDashboardData(
      "formIdIfAny",
      "current-syllabus-request-content" + extraParam,
      replaceDiv
    );
  } else if (pageNo == "withdrawn-request-list") {
    callForDashboardData(
      "formIdIfAny",
      "withdrawn-request-list?moduleId=" + moduleId + "&currentPage=0",
      replaceDiv
    );
  } else if (pageNo == "batch-schedule") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-batch-time-schedule?moduleId=" +
        moduleId +
        "&userId=" +
        extraParam
    );
  } else if (pageNo == "bulk-transcript-print") {
    callForDashboardData(
      "formIdIfAny",
      "bulk-transcript-print?moduleId=" + moduleId
    );
  } else if (pageNo == "admission-reports") {
    // urlSend = CONTEXT_PATH+UNIQUEUUID+'/report/school-admission-reports?moduleId='+moduleId+'&schoolId='+SCHOOL_ID+'&countryId=101&sessionId='+SESSION_ID+'&euid='+ENCRYPTED_USER_ID
    // window.open(urlSend, '_blank');
    // customLoader(false)
    var urlSend =
      "/report/school-admission-reports?moduleId=" +
      moduleId +
      "&schoolId=" +
      SCHOOL_ID +
      "&countryId=101&sessionId=" +
      SESSION_ID +
      "&euid=" +
      ENCRYPTED_USER_ID;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "school-reports" || pageNo == "reports") {
    // urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/school-data-reports?moduleId='+moduleId
    // window.open(urlSend, '_blank');
    // customLoader(false)
    var urlSend =
      "/dashboard/school-data-reports?moduleId=" +
      moduleId +
      "&schoolId=" +
      SCHOOL_ID +
      "&year=";
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "flex-billing-report") {
    urlSend = "/dashboard/get-lmsbuzz-billing?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "addons-academic-year") {
    callForDashboardData(
      "formIdIfAny",
      "addons-academic-year?moduleId=" + moduleId
    );
  } else if (pageNo == "critical-students") {
    urlSend = "/dashboard/get-critical-students?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "nongrading-students") {
    urlSend = "/dashboard/get-nongrading-students?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "school-announce") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-school-announce?moduleId=" + moduleId
    );
  } else if (pageNo == "school-announce-list") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-school-announce-list?moduleId=" + moduleId
    );
  } else if (pageNo == "holiday-form") {
    callForDashboardData(
      "formIdIfAny",
      "school-holiday-form?moduleId=" + moduleId
    );
  } else if (pageNo == "holiday-list") {
    callForDashboardData(
      "formIdIfAny",
      "school-holiday-list?moduleId=" + moduleId
    );
  } else if (pageNo == "manage-attendance") {
    //callForDashboardData('formIdIfAny','get-student-attendance?moduleId='+moduleId);
    var urlSend = "/dashboard/get-student-attendance?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "batch-attendance") {
    callForDashboardData(
      "formIdIfAny",
      "get-student-attendance?moduleId=" + moduleId
    );
  } else if (pageNo == "lead-list") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var leadType = "B2C"; //|| USER_ROLE=="B2B_PARTNER"
    if (USER_ROLE == "B2B_LEAD") {
      leadType = "B2B";
    }
    if (SCHOOL_TYPE == "WLP") {
      leadType = "B2B";
    }
    var urlSend =
      "/dashboard/lead-data-list?moduleId=" +
      moduleId +
      "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +
      ENCRYPTED_USER_ID +
      "&leadType=" +
      leadType;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "lead-assign-form") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var urlSend =
      "/dashboard/lead-assign-form?moduleId=" + moduleId + "&todayDate=";
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "lead-report-list") {
    //var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/lead-data-reports?moduleId='+moduleId+'&euid='+ENCRYPTED_USER_ID
    //window.open(urlSend, '_blank');
    //customLoader(false)
    var urlSend =
      "/dashboard/lead-data-reports?moduleId=" +
      moduleId +
      "&euid=" +
      ENCRYPTED_USER_ID;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "recurring-class") {
    callForDashboardData(
      "formIdIfAny",
      "recurring-class?moduleId=" + moduleId + extraParam
    );
  } else if (pageNo == "recurring-class-list") {
    callForDashboardData(
      "formIdIfAny",
      "recurring-class-content?moduleId=" + moduleId
    );
  } else if (pageNo == "teacher-class-review") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var urlSend = "/dashboard/teacher-class-review?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "live-classroom-status") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var urlSend =
      CONTEXT_PATH +
      SCHOOL_UUID +
      "/dashboard/live-classroom-status-new/" +
      UNIQUEUUID;
    window.open(urlSend, "_blank");
    customLoader(false);
  } else if (pageNo == "teacher-assign-form") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var urlSend = "/report/teacher-assign-form?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "teacher-time-availability") {
    var urlSend = "/report/teacher-time-availability?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "lead-calculation-chart") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var urlSend =
      "/dashboard/lead-calculation-chart?moduleId=" +
      moduleId +
      "&euid=" +
      ENCRYPTED_USER_ID;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "assign-orientation") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    // var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/orientation-assign-form?moduleId='+moduleId+'&todayDate=';
    // window.open(urlSend, '_blank');
    // customLoader(false)

    var urlSend =
      "/dashboard/orientation-assign-form?moduleId=" +
      moduleId +
      "&schoolId=" +
      SCHOOL_ID +
      "&todayDate=&themetype=";
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "student-orientation-list") {
    // var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/student-orientation-list?moduleId='+moduleId;
    // window.open(urlSend, '_blank');
    // customLoader(false)

    var urlSend = "/dashboard/student-orientation-list?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "lead-expenses") {
    // var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/student-orientation-list?moduleId='+moduleId;
    // window.open(urlSend, '_blank');
    // customLoader(false)

    var urlSend = "/dashboard/lead-expenses?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "teacher-time-dashboard") {
    var urlSend = "/report/teacher-time-dashboard?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "admin-partner-enrollment-list") {
    var urlSend =
      "/dashboard/admin-partner-enrollment-list?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
    // getContent(moduleId, pageNo, replaceDiv, extraParam);
  }
  if (pageNo == "partner-dashboard") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "referral-and-links") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "time-availability") {
    var urlSend =
      "/timeavailability/time-availability?moduleId=" +
      moduleId +
      "&schoolId=" +
      SCHOOL_ID +
      "&euid=" +
      USER_ID;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "meeting-management") {
    var urlSend =
      "/dashboard/meeting-management-request?moduleId=" +
      moduleId +
      "&schoolId=" +
      SCHOOL_ID;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "lead-demo-list") {
    var urlSend = "/dashboard/lead-demo-list?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  }

  //Student - left-side
  else if (pageNo == "student-login-details") {
    callForDashboardData("formIdIfAny", "attendance-content" + extraParam);
  } else if (pageNo == "syllabus-assigned-teacher") {
    callForDashboardData(
      "formIdIfAny",
      "student-task-content?moduleId=" + moduleId
    );
  } else if (pageNo == "book-a-session") {
    callForDashboardData(
      "formIdIfAny",
      "student-book-a-session-subjects?moduleId=" + moduleId
    );
  } else if (pageNo == "fee-details") {
    callForDashboardData(
      "formIdIfAny",
      "student-due-fees-content?moduleId=" + moduleId
    );
  } else if (pageNo == "user-guide") {
    callForDashboardData(
      "formIdIfAny",
      "user-guide-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "student-handbook") {
    callForDashboardData("formIdIfAny", "studenthandbook?moduleId=" + moduleId);
  } else if (pageNo == "student-addon") {
    callForDashboardData("formIdIfAny", "student-addons-content");
  } else if (pageNo == "01addonfee") {
    callForDashboardData("formIdIfAny", "student-session-content");
  } else if (pageNo == "notifications" || pageNo == "parent-notifications") {
    callForDashboardData("formIdIfAny", "notifications" + args);
  } else if (pageNo == "batch-student-examination-sheet") {
    callForDashboardData(
      "formIdIfAny",
      "batch-student-examination-sheet?moduleId=" + moduleId
    );
  } else if (pageNo == "academic-year-extention") {
    callForDashboardData(
      "formIdIfAny",
      "academic-year-extention-content?moduleId=" + moduleId
    );
  } else if (pageNo == "student-progress-report") {
    callForDashboardData(
      "formIdIfAny",
      "student-progress-report?moduleId=" + moduleId
    );
  } else if (pageNo == "auto-progress-report") {
    callForDashboardData(
      "formIdIfAny",
      "auto-weekly-progress?moduleId=" + moduleId
    );
  } else if (pageNo == "progress-detail") {
    callForDashboardData(
      "formIdIfAny",
      "weekly-progress-detail?moduleId=" + moduleId
    );
  } else if (pageNo == "student-id-card") {
    callForDashboardData(
      "formIdIfAny",
      "student/id-card?download=0&moduleId=" +
        moduleId +
        "&userId=" +
        extraParam
    );
  } else if (pageNo == "email-logs") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "email-status") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "wati-numbers") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }

  //Teacher
  else if (pageNo == "assigned-courses") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-subject-content?moduleId=" + moduleId
    );
  } else if (pageNo == "assigned-student") {
    callForDashboardData(
      "formIdIfAny",
      "assigned-students-content?moduleId=" + moduleId
    );
  } else if (pageNo == "assigned-batch-student") {
    callForDashboardData(
      "formIdIfAny",
      "assigned-batch-students-content?moduleId=" + moduleId
    );
    //IF RETURN HTML NOT RETURN FROM JSP
  } else if (pageNo == "create-manage-sessions") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-create-session-content?moduleId=" + moduleId
    );
    //IF RETURN HTML NOT RETURN FROM JSP
  } else if (pageNo == "student-attendance") {
    callForDashboardData(
      "formIdIfAny",
      "student-attendance-list?moduleId=" + moduleId
    );
  } else if (pageNo == "teacher-training") {
    callForDashboardData(
      "formIdIfAny",
      "techer-user-guide-request-content?moduleId=" + moduleId
    );
  } else if (pageNo == "payment-history") {
    callForDashboardData("formIdIfAny", "payment-history-list" + extraParam);
  } else if (pageNo == "monthly-pay-slip") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-monthly-pay-slip/" + UNIQUEUUID + extraParam
    );
  } else if (pageNo == "teacher-tips-educator") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-view-tips-attachement" + extraParam
    );
  } else if (pageNo == "teacher-login-details") {
    callForDashboardData("formIdIfAny", "attendance-content" + extraParam);
  } else if (pageNo == "student-attendance") {
    callForDashboardData(
      "formIdIfAny",
      "student-attendance-list?moduleId=" + moduleId
    );
  } else if (pageNo == "set-teacher-comp") {
    callForDashboardData(
      "formIdIfAny",
      "set-teacher-compensation?moduleId=" + moduleId
    );
  } else if (pageNo == "class-management") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-class-management?moduleId=" + moduleId + "&syear=&smonth="
    );
  } else if (pageNo == "student-assigned-report") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "schedule-a-session") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-create-session-content?moduleId=" + moduleId
    );
  } else if (pageNo == "offline-classes") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "user-leave") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "manage-leave") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "user-review") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "admin-task") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "payment-reports") {
    // getContent(moduleId, pageNo, replaceDiv, extraParam);
    var urlSend = "/dashboard/payment-reports?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo === "meeting-management") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }

  //Parent
  else if (pageNo == "parent-student-home") {
    // callForDashboardData('formIdIfAny', 'parent-content?moduleId=' + moduleId);
  } else if (pageNo == "parent-student-login-details") {
    callForDashboardData("formIdIfAny", "attendance-content" + extraParam);
  } else if (pageNo == "parent-syllabus-assigned-teacher") {
    // 	callForDashboardData('formIdIfAny', 'parent-student-task-content?moduleId=' + moduleId);
  } else if (pageNo == "parent-student-transcript") {
    callForDashboardData("formIdIfAny", "student-list?moduleId=" + moduleId);
  } else if (pageNo == "parent-fee-details") {
    callForDashboardData(
      "formIdIfAny",
      "student-due-fees-content?moduleId=" + moduleId
    );
  } else if (pageNo == "parent-student-handbook") {
    callForDashboardData("formIdIfAny", "studenthandbook?moduleId=" + moduleId);
  }
  //Counselor
  else if (pageNo == "counselor-dashboard") {
    callForDashboardData(
      "formIdIfAny",
      "counselor-content?moduleId=" + moduleId
    );
  } else if (pageNo == "COUNS1a") {
    callForDashboardData(
      "formIdIfAny",
      "counselor-manage-student-content" + extraParam
    );
  } else if (pageNo == "COUNS1b") {
    callForDashboardData(
      "formIdIfAny",
      "counselor-manage-referral-content" + extraParam
    );
  } else if (pageNo == "2002") {
    callForDashboardData("formIdIfAny", "notifications" + args);
  }

  //Auditors
  else if (pageNo == "auditor-previous-report") {
    callForDashboardData(
      "formIdIfAny",
      "previous-submitted-reports-content?moduleId=" + moduleId
    );
  } else if (pageNo == "auditor-previous-report") {
    callForDashboardData(
      "formIdIfAny",
      "previous-submitted-reports-content?moduleId=" + moduleId
    );
  } else if (pageNo == "auditor-pending-report") {
    callForDashboardData(
      "formIdIfAny",
      "pending-reports-content?moduleId=" + moduleId
    );
  } else if (pageNo == "auditor-submit-evaluation") {
    callForDashboardData(
      "formIdIfAny",
      "submitted-evaluation-content?moduleId=" + moduleId
    );
  } else if (pageNo == "auditor-save-evaluation") {
    callForDashboardData(
      "formIdIfAny",
      "saved-evaluation-content?moduleId=" + moduleId
    );
  }
}

function callSchoolInneraction(actionType, arg0, replaceDiv, roleModuleId) {
  customLoader(true);
  //	if(actionType=='3PlacementSyllabusContent'){
  ////		callForDashboardData('formIdIfAny','current-placement-syllabus-request-content'+arg0,replaceDiv);
  //	}else
  if (actionType == "3set") {
    callForDashboardData(
      "formIdIfAny",
      "question-answer-set-content?setId=" + arg0
    );
  } else if (actionType == "1admin") {
    callForDashboardData(
      "formIdIfAny",
      "edit-profile-content?userId=" + arg0 + "&moduleId=" + roleModuleId+"&themetype="
    );
  } else if (actionType == "edit-user") {
    callForDashboardData("formIdIfAny", "create-user-edit?userId=" + arg0);
  } else if (actionType == "edit-school") {
    callForDashboardData(
      "formIdIfAny",
      "create-school-content?schoolId=" + arg0 + "&moduleId=" + roleModuleId
    );
  } else if (actionType == "2Attendance") {
    callForDashboardData("formIdIfAny", "attendance-content" + arg0);
  } else if (actionType == "1delete") {
    callForDashboardData("formIdIfAny", "delete-user?userId=" + arg0);
  } else if (actionType == "transcript") {
    callForDashboardData(
      "formIdIfAny",
      "school-student-transcript-content?userId=" + arg0
    );
  } else if (actionType == "17a") {
    $("#userPaymentHistoryDetails").show();
    callForDashboardData(
      "formIdIfAny",
      "payment-history-content?userId=" + arg0 + "&moduleId=" + roleModuleId,
      "userPaymentHistoryDetails"
    );
  } else if (actionType == "19a") {
    callForDashboardData("formIdIfAny", "delete-user-content?u=" + arg0);
    setTimeout(function () {
      callDashboardPageSchool(roleModuleId, "delete-user");
    }, 1000);
  } else if (actionType == "18a1") {
    callForDashboardData(
      "formIdIfAny",
      "school-enabled-date-content?" + arg0,
      replaceDiv
    );
  } else if (actionType == "6f1") {
    callForDashboardData(
      "formIdIfAny",
      "travel-details-content?userId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "6fv") {
    callForDashboardData(
      "formIdIfAny",
      "travel-details-content-view?userId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "6f2") {
    callForDashboardData(
      "formIdIfAny",
      "RM-details-content?userId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "6fview") {
    callForDashboardData(
      "formIdIfAny",
      "RM-details-content-view?userId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "7a") {
    callForDashboardData(
      "formIdIfAny",
      "add-student-content" + arg0,
      replaceDiv
    );
  } else if (actionType == "22a") {
    callForDashboardData(
      "formIdIfAny",
      "getApprovalSubjectsBySchoolId-content?schoolId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "22b") {
    callForDashboardData(
      "formIdIfAny",
      "getApprovalPreSubjectsBySchoolId-content?schoolId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "schoolStudentList") {
    callForDashboardData(
      "formIdIfAny",
      "search-school-student-list" + arg0,
      replaceDiv
    );
  } else if (actionType == "addRm") {
    callForDashboardData("formIdIfAny", "edit-RM?rmId=", replaceDiv);
  } else if (actionType == "21a11") {
    callForDashboardData(
      "formIdIfAny",
      "choose-school-content?schoolId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "historyRemarks") {
    callForDashboardData(
      "formIdIfAny",
      "remarks-history-content" + arg0,
      replaceDiv
    );
  } else if (actionType == "edit-courseDetails") {
    callForDashboardData(
      "formIdIfAny",
      "edit-course-content" + arg0,
      replaceDiv
    );
  } else if (actionType == "edit-placementCourseDetails") {
    callForDashboardData(
      "formIdIfAny",
      "edit-placement-course-content" + arg0,
      replaceDiv
    );
  } else if (actionType == "edit-placementSubjectB2C") {
    callForDashboardData(
      "formIdIfAny",
      "edit-placementSubjectB2C" + arg0,
      replaceDiv
    );
  } else if (actionType == "placement-syllabus") {
    callForDashboardData(
      "formIdIfAny",
      "view-placement-syllabus-content?subjectId=" + arg0
    );
  } else if (actionType == "teacher-agreement") {
    callForDashboardData(
      "formIdIfAny",
      "view-teacher-agreement-content" + arg0,
      replaceDiv
    );
  } else if (actionType == "show-school-receipt") {
    callForDashboardData(
      "formIdIfAny",
      "show-school-receipt-content?userPaymentDetailsId=" + arg0,
      replaceDiv
    );
  } else if (actionType == "counselor") {
    callForDashboardData(
      "formIdIfAny",
      "add-counseler-content" + arg0,
      replaceDiv
    );
  } else if (actionType == "edit-teacher-comp") {
    callForDashboardData(
      "formIdIfAny",
      "edit-teacher-compensation" + arg0,
      replaceDiv
    );
  } else if (actionType.startsWith("COUNS1c")) {
    var res = actionType.split("-");
    var cuserId = 0;
    if (res.length > 1) {
      actionType = res[0];
      cuserId = res[1];
    }

    callForDashboardData(
      "formIdIfAny",
      "profile-view-content/" +
        SCHOOL_UUID +
        "?userId=" +
        arg0 +
        "&actionType=" +
        actionType +
        "-" +
        cuserId +
        "&moduleId=" +
        roleModuleId
    );
  } else if (actionType == "3syllabus") {
    callForDashboardData(
      "formIdIfAny",
      "student-syllabus-content?subjectId=" + arg0 + "&moduleId=" + roleModuleId
    );
  } else if (actionType == "3classWork") {
    callForDashboardData(
      "formIdIfAny",
      "student-task-request-content?subjectId=" + arg0
    );
  } else if (actionType == "3homeWork") {
    callForDashboardData(
      "formIdIfAny",
      "student-task-request-content?subjectId=" + arg0
    );
  } else if (actionType == "12b") {
    callCommonPaymentGateway("paymentForm", "student", arg0);
  } else if (actionType == "addonpayment") {
    callForDashboardData(
      "formIdIfAny",
      "student-addons-subject-content?subjectId=" + arg0,
      "subject-plan"
    );
  } else if (actionType == "1a") {
    callForDashboardData(
      "formIdIfAny",
      "profile-view-content?userId=" +
        arg0 +
        "&actionType=" +
        actionType +
        "&moduleId=" +
        roleModuleId
    );
  } else if (actionType == "attendance") {
    callForDashboardData("formIdIfAny", "attendance-content" + arg0);
  } else if (actionType == "subjectsession") {
    callForDashboardData(
      "formIdIfAny",
      "student-subject-session?subjectId=" + arg0 + "&moduleId=" + roleModuleId
    );
  } else if (actionType == "syllabus-assigned-batch-teacher") {
    callForDashboardData(
      "formIdIfAny",
      "student-batch-teacher-content?moduleId=" + moduleId
    );
  } else if (actionType == "extention") {
    callForDashboardData(
      "formIdIfAny",
      "student-acacdemic-year-extention?subjectId=" +
        arg0 +
        "&moduleId=" +
        roleModuleId +
        "&extraSubjStatus=" +
        replaceDiv
    );
  }
  //teacher
  else if (actionType == "teacher-3syllabus") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-syllabus-content" + arg0 + "&moduleId=" + roleModuleId
    );
  }
  //parent
  if (actionType == "parent-3syllabus") {
    // callForDashboardData('formIdIfAny', 'parent-student-syllabus-content' + arg0);
  } else if (actionType == "1ParentStudentAdmin") {
    callForDashboardData(
      "formIdIfAny",
      "profile-view-content/" +
        SCHOOL_UUID +
        "?userId=" +
        arg0 +
        "&actionType=" +
        actionType +
        "&moduleId=" +
        roleModuleId
    );
  } else if (actionType == "demoRequestEdit") {
    callForDashboardData(
      "formIdIfAny",
      "request-demo-edit-form?requestId=" +
        arg0 +
        "&actionType=" +
        actionType +
        "&moduleId=" +
        roleModuleId
    );
  }
}

function submitTask(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForSubmitTask(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "task-submit"),
    data: JSON.stringify(getRequestForSubmitTask(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#" + formId)[0].reset();
        $("#" + formId + " #schoolId option:selected").val(1);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitTask(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var taskdto = {};
  taskdto["schoolId"] = $("#" + formId + " #schoolId").val();
  taskdto["standardId"] = $("#" + formId + " #standardId").val();
  taskdto["subjectId"] = $("#" + formId + " #subjectId").val();
  taskdto["taskName"] = $("#" + formId + " #taskName").val();
  var startDateEndDate = $("#" + formId + " #startDateEndDate").val();
  var dates = startDateEndDate.split(" - ");
  taskdto["startDate"] = dates[0];
  taskdto["endDate"] = dates[1];
  if (editor1 != undefined) {
    taskdto["content"] = escapeCharacters(editor1.getData());
  }
  requestData["taskdto"] = taskdto;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function validateRequestForSubmitTask(formId, moduleId) {
  return true;
}

function submitTeacherQuestion(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForSubmitSet(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "question-set-submit"),
    data: JSON.stringify(getRequestForSubmitSet(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#teacherQuestionModal").modal("hide");
        $("#" + formId)[0].reset();
        setTimeout(function () {
          callDashboardPageSchool(0, "14");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitSet(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var questionSetDTO = {};
  questionSetDTO["setId"] = $("#" + formId + " #setId").val();
  questionSetDTO["setNameId"] = $(
    "#" + formId + " #setName option:selected"
  ).val();
  questionSetDTO["setTitle"] = $("#" + formId + " #setTitle").val();
  questionSetDTO["status"] = "1";
  questionSetDTO["videoUrl"] = $("#" + formId + " #videoUrl").val();
  questionSetDTO["gradeName"] = $(
    "#" + formId + " #standardId option:selected"
  ).val();
  questionSetDTO["subjectName"] = $(
    "#" + formId + " #subjectId option:selected"
  ).val();

  requestData["questionSetDTO"] = questionSetDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function validateRequestForSubmitSet(formId, moduleId) {
  if (
    $("#setName").val() == undefined ||
    $("#setName").val() == "" ||
    $("#setName").val() == 0
  ) {
    showMessage(true, "Set Name is required.");
    return false;
  }
  if ($("#setTitle").val() == undefined || $("#setTitle").val().trim() == "") {
    showMessage(true, "Set Title is required.");
    return false;
  }
  if (
    $("#standardId").val() == undefined ||
    $("#standardId").val() == "" ||
    $("#standardId").val() == 0
  ) {
    showMessage(true, "Standard is required.");
    return false;
  }
  if (
    $("#subjectId").val() == undefined ||
    $("#subjectId").val() == "" ||
    $("#subjectId").val() == 0
  ) {
    showMessage(true, "Course Name is required.");
    return false;
  }
  return true;
}

function submitQuestionAnswer(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForSubmitQuestion(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "question-answer-submit"),
    data: JSON.stringify(getRequestForSubmitQuestion(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        $("#questionAnsModel").modal("hide");
        showMessage(false, data["message"]);
        //	$('#'+formId)[0].reset();
        setTimeout(function () {
          //var params = $("#setName1").val()+','+$("#setId").val();
          //callSchoolInneraction('3set',params);
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitQuestion(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var questionAnswerDTO = {};
  questionAnswerDTO["questionId"] = $("#" + formId + " #questionId").val();
  questionAnswerDTO["setId"] = $("#" + formId + " #setId").val();
  if (editor1 != undefined) {
    questionAnswerDTO["questionTitle"] = escapeCharacters(editor1.getData());
  }
  questionAnswerDTO["status"] = "1";
  questionAnswerDTO["option1"] = $("#" + formId + " #option1").val();
  questionAnswerDTO["option2"] = $("#" + formId + " #option2").val();
  questionAnswerDTO["option3"] = $("#" + formId + " #option3").val();
  questionAnswerDTO["option4"] = $("#" + formId + " #option4").val();
  questionAnswerDTO["correctAnswer"] = $(
    "#" + formId + " #correctAns option:selected"
  ).val();
  questionAnswerDTO["userAnswer"] = "-1";

  requestData["questionAnswerDTO"] = questionAnswerDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function validateRequestForSubmitQuestion(formId, moduleId) {
  if (editor1 != undefined) {
    if (editor1.getData() == null) {
      showMessage(true, "please add question");
      return false;
    }
  }

  if ($("#option1").val() == null || $("#option1").val().trim() == "") {
    showMessage(true, "option 1 is required.");
    return false;
  }
  if ($("#option2").val() == null || $("#option2").val() == "") {
    showMessage(true, "option 2 is required.");
    return false;
  }
  if ($("#option3").val() == null || $("#option3").val() == "") {
    showMessage(true, "option 3 is required.");
    return false;
  }
  if ($("#option4").val() == null || $("#option4").val() == "") {
    showMessage(true, "option 4 is required.");
    return false;
  }
  if ($("#correctAns").val() == 0 || $("#correctAns").val() == "") {
    showMessage(true, "correct answer is required.");
    return false;
  }
  return true;
}

function submitScholarship(
  formId,
  moduleId,
  modalId,
  isForSpecificUser,
  controlType,
  scholarId,
  roleModuleId,
  schoolId
) {
  hideMessage("");
  if ("add" == controlType) {
    if (!validateRequestForSubmitScholarship(formId, moduleId, modalId)) {
      return false;
    }
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "scholar-submit"),
    data: JSON.stringify(
      getRequestForSubmitScholarship(
        formId,
        moduleId,
        isForSpecificUser,
        controlType,
        scholarId,
        schoolId
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        if ("add" == controlType) {
          $("#" + formId)[0].reset();
          $("#" + modalId).modal("toggle");
        }
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "scholarship");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitScholarship(
  formId,
  moduleId,
  isForSpecificUser,
  controlType,
  scholarId,
  schoolId
) {
  var request = {};
  var authentication = {};

  var scholarShipCodeDTO = {};
  if ("add" == controlType) {
    scholarShipCodeDTO["scholarId"] = $("#" + formId + " #ScholarCodeId").val();
    scholarShipCodeDTO["scholarCodeName"] = $(
      "#" + formId + " #scholarCode"
    ).val();
    scholarShipCodeDTO["scholarType"] = $(
      "#" + formId + " #scholarType option:selected"
    ).val();
    if (
      $("#" + formId + " #scholarMadeFor option:selected").text() ==
      "Full-Time Program"
    ) {
      scholarShipCodeDTO["scholarMadeFor"] =
        "Signup for Full-Time/Flexy - Single Course";
    } else {
      scholarShipCodeDTO["scholarMadeFor"] = $(
        "#" + formId + " #scholarMadeFor option:selected"
      ).text();
    }
    scholarShipCodeDTO["scholarApplicableFor"] = $(
      "#" + formId + " #scholarApplicableFor option:selected"
    ).text();
    scholarShipCodeDTO["learningPlan"] = $(
      "#" + formId + " #learningPlan"
    ).val();
    scholarShipCodeDTO["scholarPercent"] = $(
      "#" + formId + " #scholarPercent"
    ).val();
    scholarShipCodeDTO["scholarValidDays"] = $(
      "#" + formId + " #scholarValid"
    ).val();
    scholarShipCodeDTO["scholarStatus"] = "1";
    scholarShipCodeDTO["isForSpecificUser"] = isForSpecificUser;
    scholarShipCodeDTO["startDate"] = $(
      "#" + formId + " #scholarStartDate"
    ).val();
    scholarShipCodeDTO["endDate"] = $("#" + formId + " #scholarEndDate").val();
    scholarShipCodeDTO["controlType"] = controlType;
  } else {
    scholarShipCodeDTO["scholarId"] = scholarId;
    scholarShipCodeDTO["scholarStatus"] = "0";
    scholarShipCodeDTO["controlType"] = controlType;
  }
  scholarShipCodeDTO["schoolId"] = schoolId;
  request["scholarShipCodeDTO"] = scholarShipCodeDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  return request;
}

function validateRequestForSubmitScholarship(formId, moduleId, modalId) {
  if (
    $("#" + formId + " #scholarCode").val() == 0 ||
    $("#" + formId + " #scholarCode").val() == null
  ) {
    showMessage(true, "Discount Code Name is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarMadeFor").val() == undefined ||
    $("#" + formId + " #scholarMadeFor").val() == ""
  ) {
    showMessage(true, "Please fill Discount Code for");
    return false;
  }
  if (
    $("#" + formId + " #learningPlan").val() == undefined ||
    $("#" + formId + " #learningPlan").val() == ""
  ) {
    showMessage(true, "Learning Plan is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarApplicableFor").val() == undefined ||
    $("#" + formId + " #scholarApplicableFor").val() == ""
  ) {
    showMessage(true, "Applicability of Discount Code Name is required.");
    return false;
  }
  if (
    $("#" + formId + " #scholarStartDate").val() == "" ||
    $("#" + formId + " #scholarStartDate").val() == null
  ) {
    showMessage(true, "Discount Start Date is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarEndDate").val() == "" ||
    $("#" + formId + " #scholarEndDate").val() == null
  ) {
    showMessage(true, "Discount End Date is required");
    return false;
  }
  var date = $("#scholarStartDate").val();
  var newDate = date.split("-");
  var startDate = new Date(newDate[2] + "-" + newDate[0] + "-" + newDate[1]);

  var date1 = $("#scholarEndDate").val();
  var newDate1 = date1.split("-");
  var endDate = new Date(newDate1[2] + "-" + newDate1[0] + "-" + newDate1[1]);

  if (endDate < startDate) {
    showMessage(
      false,
      "Discount End Date should be greater than Discount Start Date."
    );
    return false;
  }
  if (
    $("#" + formId + " #scholarType").val() == 0 ||
    $("#" + formId + " #scholarType").val() == null
  ) {
    showMessage(true, "Discount type is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarPercent").val() == 0 ||
    $("#" + formId + " #scholarPercent").val() == null
  ) {
    showMessage(true, "Please enter Discount amount");
    return false;
  }
  return true;
}

function sendToSpecificUser(formId, moduleId, isForSpecificUser, roleModuleId) {
  if ($("#" + formId + " #userEmailId").val() == "") {
    showMessage(true, "Please enter student email");
    return false;
  }
  if ($("#" + formId + " #scholarshipApplicableFor").val() == "") {
    showMessage(true, "Please select applicable for option");
    return false;
  }

  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "send-scholarshipCode-to-user"),
    data: JSON.stringify(
      getRequestForSpecificUserScholarship(formId, moduleId, isForSpecificUser)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#addSpecificModal").modal("hide");
        //					setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'scholarship'); }, 1000);
      }
      return false;
    },
    error: function (e) {
      return false;
    },
  });
}

function getRequestForSpecificUserScholarship(
  formId,
  moduleId,
  isForSpecificUser
) {
  var request = {};
  var authentication = {};
  var scholarShipCodeDTO = {};
  scholarShipCodeDTO["schoolId"] = SCHOOL_ID;
  scholarShipCodeDTO["scholarId"] = $("#" + formId + " #scholarCode").val();
  scholarShipCodeDTO["scholarCodeName"] = $(
    "#" + formId + " #scholarCode option:selected"
  ).attr("codeName");
  scholarShipCodeDTO["userEmailId"] = $("#" + formId + " #userEmailId").val();
  scholarShipCodeDTO["isForSpecificUser"] = isForSpecificUser;
  scholarShipCodeDTO["scholarshipApplicableFor"] = $(
    "#" + formId + " #scholarshipApplicableFor"
  ).val();
  //		scholarShipCodeDTO['scholarType']= $("#"+formId+" #scholarshipApplicableFor").val();
  request["scholarShipCodeDTO"] = scholarShipCodeDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;

  return request;
}

function validateRequestForSubmitMeetingTeacherSlots(formId, moduleId) {
  //		var meetDate = $("#"+formId+" #meetingDate").val();
  //		meetDate = meetDate.split("-");
  //		meetingDate = meetDate[2]+"-"+meetDate[0]+"-"+meetDate[1];
  //		var selectDate = new Date(meetingDate);
  //		var todayDate = new Date();
  if (
    $("#" + formId + " #meetingDate").val() == null ||
    $("#" + formId + " #meetingDate").val() == ""
  ) {
    showMessage(true, "Please select Meeting Date");
    return false;
  }
  if (
    $("#" + formId + " #startTime").val() == null ||
    $("#" + formId + " #startTime").val() == ""
  ) {
    showMessage(true, "Please select Start Time");
    return false;
  }
  if (
    $("#" + formId + " #timeInterval").val() == null ||
    $("#" + formId + " #timeInterval").val() == 0
  ) {
    showMessage(true, "Please select Time Interval");
    return false;
  }
  return true;
}

function submitMeetingSlots(formId, moduleId, roleModuleId) {
  hideMessage("");
  if (!validateRequestForSubmitMeetingTeacherSlots(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "meetingslots-submit"),
    data: JSON.stringify(
      getRequestForSubmitMeetingTeacherSlots(formId, moduleId)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#meetingSlotsModal").modal("toggle");
        $("#" + formId)[0].reset();
        $("body").removeClass("modal-open");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "teacher-interview-slot");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitMeetingTeacherSlots(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var meetingSlotDTO = {};

  meetingSlotDTO["meetingType"] = "INTERVIEW";
  var meetDate = $("#" + formId + " #meetingDate").val();
  meetDate = meetDate.split("-");
  meetingDate = meetDate[2] + "-" + meetDate[0] + "-" + meetDate[1];
  meetingSlotDTO["meetingDate"] = meetingDate;
  var startTime = $("#" + formId + " #startTime").val();
  var interval = $("#" + formId + " #timeInterval option:selected").val();
  meetingSlotDTO["startTime"] = startTime;

  var endTime = new Date("2016/09/12 " + startTime + ":00");
  endTime.setMinutes(endTime.getMinutes() + parseInt(interval));
  endTime = endTime.getHours() + ":" + endTime.getMinutes();

  meetingSlotDTO["endTime"] = endTime;
  meetingSlotDTO["subject"] = "TRAINING";
  meetingSlotDTO["status"] = "0";

  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["meetingSlotDTO"] = meetingSlotDTO;
  return request;
}

function validateRequestDemoMeetingSlots(
  formId,
  moduleId,
  controllType,
  requestType
) {
  if ("ADD" == controllType) {
    var meetDate = $("#" + formId + " #meetingDate").val();
    meetDate = meetDate.split("-");
    meetingDate = meetDate[2] + "-" + meetDate[0] + "-" + meetDate[1];
    var selectDate = new Date(meetingDate);
    var todayDate = new Date();
    if (
      $("#" + formId + " #meetingDate").val() == null ||
      $("#" + formId + " #meetingDate").val() == ""
    ) {
      showMessage(true, "Please select Meeting Date");
      return false;
    }
    if (
      $("#" + formId + " #startTime").val() == null ||
      $("#" + formId + " #startTime").val() == ""
    ) {
      showMessage(true, "Please select Start Time");
      return false;
    }
    if (
      $("#" + formId + " #timeInterval").val() == null ||
      $("#" + formId + " #timeInterval").val() == 0
    ) {
      showMessage(true, "Please select Time Interval");
      return false;
    }
  }
  return true;
}

function submitSyllabus(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForSubmitSyllabus(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "syllabus-submit"),
    data: JSON.stringify(getRequestForSubmitSyllabus(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#" + formId)[0].reset();
        $("#currentSyllabus").find("a").trigger("click");
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitSyllabus(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var syllabusDTO = {};
  syllabusDTO["standardId"] = $("#" + formId + " #currentGradId").val();
  syllabusDTO["subjectId"] = $("#" + formId + " #subjectId").val();
  syllabusDTO["courseProviderId"] = $(
    "#" + formId + " #courseProviderId"
  ).val();
  syllabusDTO["syllabusType"] = $("#" + formId + " #syllabusType").val();
  syllabusDTO["taskName"] = "SYLLABUS";
  if (editor1 != undefined) {
    syllabusDTO["content"] = escapeCharactersForSyllabus(editor1.getData());
  }
  requestData["syllabusDTO"] = syllabusDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}
function showWorkingHoursAndPayOutFields(data) {
  if (data == "Full-Time") {
    $("#workingHoursDiv").show();
    $("#payOutDiv").show();
  } else {
    $("#workingHoursDiv").hide();
    $("#payOutDiv").hide();
  }
}
function submitTeacherAgreement(formId, moduleId, roleModuleId, saveType) {
  if (roleModuleId == "" || roleModuleId == undefined) {
    roleModuleId = $("#userId").val();
  }
  hideMessage("");
  if ($("#" + formId + " #agreementRefNumber").val() == "") {
    showMessage(true, "Reference number is required");
    return false;
  }
  if ($("#" + formId + " #agreementDate").val() == "") {
    showMessage(true, "Agreement date is required");
    return false;
  }

  if ($("#" + formId + " #employeeType").val() == "") {
    showMessage(true, "Employment Type is required");
    return false;
  }
  if ($("#" + formId + " #typeOfTeacher").val() == "") {
    showMessage(true, "Type of Teacher is required");
    return false;
  }
  if ($("#" + formId + " #teacherDesignation").val() == "") {
    showMessage(true, "Teacher Designation is required");
    return false;
  }
  if ($("#" + formId + " #teacherDepartment").val() == "") {
    showMessage(true, "Teacher Department is required");
    return false;
  }

  if ($("#" + formId + " #employeeType").val() == "Full-Time") {
    if ($("#" + formId + " #workingHours").val() == "") {
      showMessage(true, "Working Hours per month is required");
      return false;
    }
    if ($("#" + formId + " #adminTasksHours").val() == "") {
      showMessage(true, "Admin Tasks Hours is required");
      return false;
    }
    if ($("#" + formId + " #payOut").val() == "") {
      showMessage(true, "Pay Out is required");
      return false;
    }
    // if ($("#" + formId + " #employeeSpecialization").val() == "") {
    //   showMessage(true, "Specialization is required");
    //   return false;
    // }
  }
  if (editor1.getData() == "") {
    showMessage(true, "Agreement content is required");
    return false;
  }
  // var actualURL = "";
  // // if(DEPLOYMENT_MODE=='PROD'){
  // // actualURL='http://34.225.54.254:8080/edueye/'+UNIQUEUUID+'/api/v1/dashboard/submit-teacher-agreement-content';
  // // }else{
  // actualURL = getURLFor("dashboard", "submit-teacher-agreement-content");
  // }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "submit-teacher-agreement-content"),
    data: JSON.stringify(
      getRequestForSubmitTeacherAgreement(formId, moduleId, saveType)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        if (
          formId == "interviewApprovalId" ||
          formId == "teacherEditAgreement"
        ) {
          $("#interviewApprovalModal").modal("hide");
          $("#teacherAgreementModal").modal("hide");
          $("#" + formId)[0].reset();
          //						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'pending-interview-remarks'); }, 1000);
        } else if (formId == "profileApprovalId") {
          $("#profileApprovalModal").modal("hide");
          $("#" + formId)[0].reset();
          //setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'teacher-profile'); }, 1000);
        }
        var userId = $("#profileApprovalId #userId").val();
        $("#profileId_" + userId).remove();
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}
function getRequestForSubmitTeacherAgreement(formId, moduleId, saveType) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var teacherAgreementDTO = {};
  if (editor1 != undefined) {
    teacherAgreementDTO["content"] = escapeCharacters(editor1.getData());
  }
  teacherAgreementDTO["agreementRefNumber"] = escapeCharacters(
    $("#" + formId + " #agreementRefNumber").val()
  );
  teacherAgreementDTO["agreementDate"] = $(
    "#" + formId + " #agreementDate"
  ).val();
  teacherAgreementDTO["employeeType"] = $(
    "#" + formId + " #employeeType"
  ).val();
  teacherAgreementDTO["typeOfTeacher"] = $(
    "#" + formId + " #typeOfTeacher"
  ).val();
  teacherAgreementDTO["workingHours"] = $(
    "#" + formId + " #workingHours"
  ).val();
  teacherAgreementDTO["adminTaskHours"] = $(
    "#" + formId + " #adminTaskHours"
  ).val();
  teacherAgreementDTO["employeeSpecialization"] = $(
    "#" + formId + " #employeeSpecialization"
  ).select2("val");
  teacherAgreementDTO["payOut"] = $("#" + formId + " #payOut").val();
  teacherAgreementDTO["teacherDesignation"] = toTitleCase(
    $("#" + formId + " #teacherDesignation").val()
  );
  teacherAgreementDTO["teacherDepartment"] = toTitleCase(
    $("#" + formId + " #teacherDepartment").val()
  );
  teacherAgreementDTO["interviewId"] = $("#" + formId + " #meetingId").val();
  teacherAgreementDTO["remarksInterview"] = escapeCharacters(
    $("#" + formId + " #remarksInterview").val()
  );
  teacherAgreementDTO["agreementSaveType"] = saveType;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["teacherAgreementDTO"] = teacherAgreementDTO;
  return request;
}
function validateRequestForSubmitSyllabus(formId, moduleId) {
  return true;
}

function submitSlot(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForSubmitSlot(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "slot-submit"),
    data: JSON.stringify(getRequestForSubmitSlot(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#" + formId)[0].reset();
        $("#enabledDateModal").modal("toggle");
        setTimeout(function () {
          callDashboardPageSchool("18a");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitSlot(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var enabledDateDTO = {};
  enabledDateDTO["status"] = $("#" + formId + " #status").val();
  enabledDateDTO["slotId"] = $("#" + formId + " #slotId").val();
  enabledDateDTO["publish"] = $(
    "#" + formId + " #status option:selected"
  ).val();
  enabledDateDTO["reason"] = $("#" + formId + " #txtReason").val();
  enabledDateDTO["timeZoneId"] = $(
    "#" + formId + " #countryTimezoneId option:selected"
  ).val();

  requestData["enabledDateDTO"] = enabledDateDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function validateRequestForSubmitSlot(formId, moduleId) {
  return true;
}

function submitTrvlSlot(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForSubmitTrvlSlot(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "travel-Visit-detail-submit"),
    data: JSON.stringify(getRequestForSubmitTrvlSlot(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#" + formId)[0].reset();
        callSchoolInneraction("6f", "2");
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitTrvlSlot(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var enabledDateDTO = {};

  enabledDateDTO["slotId"] = $("#" + formId + " #slotId").val();
  enabledDateDTO["travelDetail"] = $("#" + formId + " #txtTravelDetail").val();

  requestData["enabledDateDTO"] = enabledDateDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function validateRequestForSubmitTrvlSlot(formId, moduleId) {
  return true;
}

function callForLMSUserSignUp(formId, moduleId, roleModuleId) {
  hideMessage("");
  $("#lmsUserForm").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForSignup("create-lms-user", moduleId),
    data: JSON.stringify(getRequestForLMSUserSignup(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#lmsUserModal1").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-lms-user");
        }, 1000);
      }
      $("#lmsUserForm").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
      $("#lmsUserForm").prop("disabled", false);
    },
  });
}

function callForEditSemsterStartDate(formId, moduleId, roleModuleId) {
  hideMessage("");
  var payload =
    "userId=" +
    $("#editSemesterStartDateForm #userId2").val() +
    "&studentStandardId=" +
    $("#editSemesterStartDateForm #studentStandardId").val() +
    "&semesterStartDate=" +
    $("#editSemesterStartDateForm #chooseDateToStartSemster").val();
  $.ajax({
    type: "POST",
    url: getURLForHTML("dashboard", "save-edited-semeseter-start-date"),
    data: payload,
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          if (stringMessage[0] == "SESSIONOUT") {
            redirectLoginPage();
          }
        }
        showMessage(true, stringMessage[1]);
        $("#editSemesterStartDate").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-not-lms-user");
        }, 1000);
      }
    },
    error: function (e) {
      //showMessage(true, TECHNICAL_GLITCH);
    },
  });
}

function changeLmsUserPassword(formId, moduleId, roleModuleId) {
  hideMessage("");
  $("#lmsUserForm").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForSignup("change-lms-user-password", moduleId),
    data: JSON.stringify(getRequestForLMSPasswordChange(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#lmsChangePasswordModal1").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-lms-user");
        }, 1000);
      }
      $("#lmsUserForm").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
      $("#lmsUserForm").prop("disabled", false);
    },
  });
}

function getRequestForLMSUserSignup(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var lmsUserInfoDTO = {};
  //lmsUserInfoDTO['userEmail'] = $("#"+formId+" #userEmail").val();
  lmsUserInfoDTO["courseProviderId"] = $(
    "#" + formId + " #courseProviderId"
  ).val();
  lmsUserInfoDTO["userId"] = $("#" + formId + " #userId1").val();
  lmsUserInfoDTO["lmsUserName"] = escapeCharacters(
    $("#" + formId + " #lmsUserName")
      .val()
      .trim()
  );
  lmsUserInfoDTO["password"] = $("#" + formId + " #password").val();
  lmsUserInfoDTO["confirmPassword"] = $(
    "#" + formId + " #confirmPassword"
  ).val();
  lmsUserInfoDTO["lmsRegNumber"] = $("#" + formId + " #lmsRegNumber")
    .val()
    .trim();
  requestData["lmsUserInfoDTO"] = lmsUserInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}
function getRequestForLMSPasswordChange(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var lmsUserInfoDTO = {};
  //lmsUserInfoDTO['userEmail'] = $("#"+formId+" #userEmail").val();
  lmsUserInfoDTO["userId"] = $("#" + formId + " #userId1")
    .val()
    .trim();
  lmsUserInfoDTO["lmsRegNumber"] = $("#" + formId + " #lmsRegNumber")
    .val()
    .trim();
  lmsUserInfoDTO["password"] = $("#" + formId + " #password").val();
  lmsUserInfoDTO["confirmPassword"] = $(
    "#" + formId + " #confirmPassword"
  ).val();

  requestData["lmsUserInfoDTO"] = lmsUserInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function getAllEmailsForStudentRole() {
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "EMAIL_LIST", "asda")),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        var data = data["mastersData"]["emailList"];
        $.each(data, function (key, val) {
          emailList.push(val.value);
        });
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
    },
  });
}

function approveSubject(formId, moduleId, isApproved, subjectId) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "approve-subjects"),
    data: JSON.stringify(
      getRequestForApproveSubject(formId, moduleId, isApproved, subjectId)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        callSchoolInneraction("22a", $("#schoolId").val());
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}
function callForSubjectApproval(formId) {
  hideMessage("");
  if (!validateRequestForApprovalSubject(formId)) {
    return false;
  }
  if (!validatePassengerDetails()) {
    return false;
  }
  $.ajax({
    type: "POST",
    url: getURLForHTML("school", "admin-approve-subject"),
    data: encodeURI(
      "request=" + JSON.stringify(getRequestForAddTravelDetails(formId))
    ),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          //redirectLoginPage();
          showMessage(true, stringMessage[1]);
        } else {
          showMessage(true, stringMessage[1]);
          $("#travelDataModal").modal("hide");
          //callSchoolInneraction('6f',$('#sortById').val());
        }
        return false;
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function validateRequestForApprovalSubject() {
  if ($("#status").val() == "0" || $("#status").val() == null) {
    showMessage(false, "please select status");
    return false;
  }
  if ($("#remarks").val() == "" || $("#remarks").val() == null) {
    showMessage(false, "Remarks is required");
    return false;
  }
  return true;
}
function getRequestForApproveSubject(formId, moduleId, isApproved, subjectId) {
  var request = {};
  var authentication = {};
  var requestData = {};

  var subjectListInfoDTO = {};
  subjectListInfoDTO["subjectId"] = subjectId;
  subjectListInfoDTO["schoolId"] = $("#schoolId").val();
  subjectListInfoDTO["isApproved"] = isApproved;

  requestData["subjectListInfoDTO"] = subjectListInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function saveCourse(formId, moduleId, courseId, controlType, roleModuleId) {
  hideMessage("");
  if (!validateRequestForAddCourse(formId, controlType)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "save-course-details"),
    data: JSON.stringify(
      getRequestForSaveCourse(formId, moduleId, courseId, controlType)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#courseInfoModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-categories");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}
function getRequestForSaveCourse(formId, moduleId, courseId, controlType) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var courseInfoDTO = {};
  if (
    controlType == "delete" ||
    controlType == "active" ||
    controlType == "inactive"
  ) {
    courseInfoDTO["isForDelete"] = "Y";
    courseInfoDTO["courseId"] = courseId;
  } else if (controlType == "add" || controlType == "edit") {
    courseInfoDTO["courseProviderId"] = $(
      "#" + formId + " #courseProvider"
    ).val();
    courseInfoDTO["courseType"] = $("#" + formId + " #courseType").val();
    courseInfoDTO["standardId"] = $("#" + formId + " #standardId").val();
    courseInfoDTO["courseId"] = courseId;
    courseInfoDTO["courseName"] = $("#" + formId + " #courseName").val();
    courseInfoDTO["order"] = $("#" + formId + " #orderId").val();
    courseInfoDTO["creditLimit"] = $("#" + formId + " #creditId").val();
    courseInfoDTO["minCreditLimit"] = $("#" + formId + " #minCreditId").val();
    courseInfoDTO["creditLimitBatch"] = $(
      "#" + formId + " #creditIdBatch"
    ).val();
    courseInfoDTO["minCreditLimitBatch"] = $(
      "#" + formId + " #minCreditIdBatch"
    ).val();
    courseInfoDTO["isForDelete"] = "N";
  }
  courseInfoDTO["controlType"] = controlType;
  requestData["courseInfoDTO"] = courseInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}
function validateRequestForAddCourse(formId, controlType) {
  if (
    controlType == "" &&
    controlType != "add" &&
    controlType != "edit" &&
    controlType != "delete"
  ) {
    showMessage(true, "Invalid control type.");
    return false;
  }
  if (controlType == "delete") {
  } else {
    if (
      $("#" + formId + " #standardId").val() == 0 &&
      controlType != "delete"
    ) {
      showMessage(true, "Please choose grade.");
      return false;
    }
    if (
      $("#" + formId + " #courseName").val() == "" &&
      controlType != "delete"
    ) {
      showMessage(true, "Please enter category name.");
      return false;
    }
    if ($("#" + formId + " #orderId").val() == "" && controlType != "delete") {
      showMessage(true, "Please set order.");
      return false;
    }
    if ($("#" + formId + " #creditId").val() == "0.0") {
      showMessage(true, "Please set maximum credit limit.");
      return false;
    }
    if (
      $("#" + formId + " #minCreditId").val() >
      $("#" + formId + " #creditId").val()
    ) {
      showMessage(
        true,
        "Minimum credit limit should be less than maximum credit limit."
      );
      return false;
    }
    if ($("#" + formId + " #minCreditIdBatch").val() == "0") {
      showMessage(true, "Please set minimum credit limit for batch.");
      return false;
    }
    if ($("#" + formId + " #creditIdBatch").val() == "0") {
      showMessage(true, "Please set maximum credit limit for batch.");
      return false;
    }
    if (
      $("#" + formId + " #minCreditIdBatch").val() >
      $("#" + formId + " #creditIdBatch").val()
    ) {
      showMessage(
        true,
        "Minimum credit limit for batch should be less than maximum credit limit of Batch."
      );
      return false;
    }
  }
  return true;
}
function savePlacementCourse(formId, moduleId, courseId, isForDelete) {
  hideMessage("");
  if (!validateRequestForAddPlacementCourse(formId, isForDelete)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "placement-save-course-details"),
    data: JSON.stringify(
      getRequestForSavePlacementCourse(formId, moduleId, courseId, isForDelete)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#courseInfoModal").modal("hide");
        setTimeout(function () {
          return callDashboardPageSchool("30");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSavePlacementCourse(
  formId,
  moduleId,
  courseId,
  isForDelete
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var placementCourseInfoDTO = {};

  placementCourseInfoDTO["courseId"] = $("#" + formId + " #courseId").val();
  placementCourseInfoDTO["courseName"] = $("#" + formId + " #courseName").val();
  placementCourseInfoDTO["standardId"] = $("#" + formId + " #standardId").val();
  placementCourseInfoDTO["controlType"] = $("#controlType").val();
  placementCourseInfoDTO["order"] = $("#" + formId + " #orderId").val();
  placementCourseInfoDTO["creditLimit"] = $("#" + formId + " #creditId").val();
  if (isForDelete != "" && isForDelete != undefined && isForDelete == "Y") {
    placementCourseInfoDTO["isForDelete"] = "Y";
    placementCourseInfoDTO["courseId"] = courseId;
    placementCourseInfoDTO["controlType"] = "delete";
  }

  requestData["placementCourseInfoDTO"] = placementCourseInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}
function validateRequestForAddPlacementCourse(formId, isForDelete) {
  if (
    $("#" + formId + " #standardId").val() == 0 ||
    ($("#" + formId + " #standardId").val() == undefined && isForDelete != "Y")
  ) {
    showMessage(true, "Please choose grade.");
    return false;
  }
  if ($("#" + formId + " #courseName").val() == "" && isForDelete != "Y") {
    showMessage(true, "Please enter category name.");
    return false;
  }
  if ($("#" + formId + " #orderId").val() == "" && isForDelete != "Y") {
    showMessage(true, "Please set order.");
    return false;
  }
  if ($("#" + formId + " #creditId").val() == "0.0" && isForDelete != "Y") {
    showMessage(true, "Please set credit limit.");
    return false;
  }
  return true;
}
function saveSubjectB2C(
  formId,
  moduleId,
  subjectId,
  isForDelete,
  roleModuleId
) {
  hideMessage("");
  if (!validateRequestForAddSubjectB2C(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "save-subejctB2C-details"),
    data: JSON.stringify(
      getRequestForSaveSubjectB2C(formId, moduleId, subjectId, isForDelete)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#subjectInfoModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-courses");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function validateRequestForAddSubjectB2C(formId) {
  return true;
}
function getRequestForSaveSubjectB2C(formId, moduleId, subjectId, isForDelete) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var subjectListB2CInfoDTO = {};
  subjectListB2CInfoDTO["subjectId"] = $("#" + formId + " #subjectId").val();
  subjectListB2CInfoDTO["courseProviderId"] = $(
    "#" + formId + " #courseProvider"
  ).val();
  subjectListB2CInfoDTO["standardId"] = $("#" + formId + " #standardId").val();
  subjectListB2CInfoDTO["courseId"] = $("#" + formId + " #courseId").val();
  subjectListB2CInfoDTO["courseType"] = $("#" + formId + " #courseType").val();
  subjectListB2CInfoDTO["subjectName"] = $(
    "#" + formId + " #subjectName"
  ).val();
  subjectListB2CInfoDTO["subjectCode"] = $(
    "#" + formId + " #subjectCode"
  ).val();
  subjectListB2CInfoDTO["lmsCourseId"] = $(
    "#" + formId + " #lmsCourseId"
  ).val();
  subjectListB2CInfoDTO["parentId"] = $("#" + formId + " #parentId").val();
  subjectListB2CInfoDTO["selfPid"] = $("#" + formId + " #selfPid").val();
  subjectListB2CInfoDTO["subjectHint"] = $(
    "#" + formId + " #subjectHint"
  ).val();
  subjectListB2CInfoDTO["isCompulsory"] = $(
    "#" + formId + " #isCompulsory"
  ).val();
  subjectListB2CInfoDTO["duration"] = $("#" + formId + " #duration").val();
  subjectListB2CInfoDTO["costAnnual"] = $("#" + formId + " #costAnnual").val();
  subjectListB2CInfoDTO["costThreeMonth"] = $(
    "#" + formId + " #costThreeMonth"
  ).val();
  subjectListB2CInfoDTO["costSixMonth"] = $(
    "#" + formId + " #costSixMonth"
  ).val();
  subjectListB2CInfoDTO["costNineMonth"] = $(
    "#" + formId + " #costNineMonth"
  ).val();
  subjectListB2CInfoDTO["subjectIcon"] = $(
    "#" + formId + " #subjectIcon"
  ).val();
  subjectListB2CInfoDTO["controlType"] = $("#courseType").val();

  if (editor1 != undefined) {
    subjectListB2CInfoDTO["requirement"] = escapeCharacters(editor1.getData());
  }
  if (editor2 != undefined) {
    subjectListB2CInfoDTO["optional"] = escapeCharacters(editor2.getData());
  }
  if (editor3 != undefined) {
    subjectListB2CInfoDTO["additional"] = escapeCharacters(editor3.getData());
  }
  if (editor4 != undefined) {
    subjectListB2CInfoDTO["materialRequired"] = escapeCharacters(
      editor4.getData()
    );
  }

  if (isForDelete != "" && isForDelete != undefined && isForDelete == "Y") {
    subjectListB2CInfoDTO["isForDelete"] = "Y";
    subjectListB2CInfoDTO["subjectId"] = subjectId;
  }

  requestData["subjectListB2CInfoDTO"] = subjectListB2CInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}
function savePlacementSubjectB2C(formId, moduleId, subjectId, isForDelete) {
  hideMessage("");
  if (!validateRequestForAddSubjectB2C(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "placement-save-subejctB2C-details"),
    data: JSON.stringify(
      getRequestForPlacementSaveSubjectB2C(
        formId,
        moduleId,
        subjectId,
        isForDelete
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#placementSubjectInfoModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool("31");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForPlacementSaveSubjectB2C(
  formId,
  moduleId,
  subjectId,
  isForDelete
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var placementSubjectListB2CInfoDTO = {};

  placementSubjectListB2CInfoDTO["subjectId"] = $(
    "#" + formId + " #subjectId"
  ).val();
  placementSubjectListB2CInfoDTO["standardId"] = $(
    "#" + formId + " #standardId"
  ).val();
  placementSubjectListB2CInfoDTO["courseId"] = $(
    "#" + formId + " #courseId"
  ).val();
  placementSubjectListB2CInfoDTO["subjectName"] = $(
    "#" + formId + " #subjectName"
  ).val();
  placementSubjectListB2CInfoDTO["subjectCode"] = $(
    "#" + formId + " #subjectCode"
  ).val();
  placementSubjectListB2CInfoDTO["placementCourseId"] = $(
    "#" + formId + " #placementCourseId"
  ).val();
  placementSubjectListB2CInfoDTO["parentId"] = $(
    "#" + formId + " #parentId"
  ).val();
  placementSubjectListB2CInfoDTO["selfPid"] = $(
    "#" + formId + " #selfPid"
  ).val();
  placementSubjectListB2CInfoDTO["subjectHint"] = $(
    "#" + formId + " #subjectHint"
  ).val();
  placementSubjectListB2CInfoDTO["isCompulsory"] = $(
    "#" + formId + " #isCompulsory"
  ).val();
  placementSubjectListB2CInfoDTO["duration"] = $(
    "#" + formId + " #duration"
  ).val();
  placementSubjectListB2CInfoDTO["costAnnual"] = $(
    "#" + formId + " #costAnnual"
  ).val();
  placementSubjectListB2CInfoDTO["costThreeMonth"] = $(
    "#" + formId + " #costThreeMonth"
  ).val();
  placementSubjectListB2CInfoDTO["costSixMonth"] = $(
    "#" + formId + " #costSixMonth"
  ).val();
  placementSubjectListB2CInfoDTO["costNineMonth"] = $(
    "#" + formId + " #costNineMonth"
  ).val();
  placementSubjectListB2CInfoDTO["subjectIcon"] = $(
    "#" + formId + " #subjectIcon"
  ).val();
  placementSubjectListB2CInfoDTO["controlType"] = $("#controlType").val();

  if (isForDelete != "" && isForDelete != undefined && isForDelete == "Y") {
    placementSubjectListB2CInfoDTO["isForDelete"] = "Y";
    placementSubjectListB2CInfoDTO["subjectId"] = subjectId;
  }
  if (editor1 != undefined) {
    placementSubjectListB2CInfoDTO["requirement"] = escapeCharacters(
      editor1.getData()
    );
  }
  if (editor2 != undefined) {
    placementSubjectListB2CInfoDTO["optional"] = escapeCharacters(
      editor2.getData()
    );
  }
  if (editor3 != undefined) {
    placementSubjectListB2CInfoDTO["additional"] = escapeCharacters(
      editor3.getData()
    );
  }
  if (editor4 != undefined) {
    placementSubjectListB2CInfoDTO["materialRequired"] = escapeCharacters(
      editor4.getData()
    );
  }

  requestData["placementSubjectListB2CInfoDTO"] =
    placementSubjectListB2CInfoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callCourseListBySubjectId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId).val(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "COURSE-LIST-BY-STANDARD-ID",
        value,
        requestExtra,
        requestExtra1
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        //buildDropdown(data['mastersData']['courseList'], $("#"+formId+" #"+toElementId), 'Select course');
        var result = data["mastersData"]["courseList"];
        var dropdown = $("#" + formId + " #" + toElementId);
        dropdown.html("");
        dropdown.append('<option value="0">Select course</option>');
        $.each(result, function (k, v) {
          dropdown.append(
            '<option value="' +
              v.key +
              '" parentid="' +
              v.extra +
              '">' +
              v.value +
              "</option>"
          );
        });

        $("#" + formId + " #courseId").prop("disabled", false);
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      $("#" + formId + " #courseId").prop("disabled", false);
    },
  });
}

function callPlacementCourseListByStandardId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra
) {
  hideMessage("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select Category");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId).val(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster(
        formId,
        "PLACEMENT-COURSE-LIST-BY-STANDARD-ID",
        value,
        requestExtra
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["courseList"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        $("#" + formId + " #courseId").prop("disabled", false);
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      $("#" + formId + " #courseId").prop("disabled", false);
    },
  });
}

function sendEmailForCommon(userId, controlType) {
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("common", "send-mail-content"),
    data: JSON.stringify(getRequestForSendEmailForCommon(userId, controlType)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
    },
  });
}

function getRequestForSendEmailForCommon(userId, controlType) {
  var request = {};
  var authentication = {};
  var data = {};

  authentication["userType"] = "common";
  authentication["userId"] = userId;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  data["controlType"] = controlType;
  request["authentication"] = authentication;
  request["data"] = data;
  return request;
}
function sendMailRequestDemo(formId, moduleId, roleModuleId) {
  hideMessage("");
  if (!validateRequestForRaiseRequestDemo(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "send-demo-request-mail"),
    data: JSON.stringify(getRequestForRaiseDemoRequest(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#requestContentModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(
            roleModuleId,
            "request-demo",
            "",
            "?requestRaisedBy=student&campaign=admin"
          );
        }, 1000);
      }
      $("#requestContentModal").prop("disabled", false);
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
    },
  });
}
function validateRequestForRaiseRequestDemo() {
  if ($("#email").val() == "" || $("#email").val() == null) {
    showMessage(false, "Email is required");
    return false;
  }
  return true;
}
function getRequestForRaiseDemoRequest(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var requestDemoDTO = {};
  requestDemoDTO["name"] = $("#" + formId + " #username").val();
  requestDemoDTO["email"] = $("#" + formId + " #email").val();
  requestDemoDTO["campaignName"] = "Request-demo";
  requestData["requestDemoDTO"] = requestDemoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callForLMSStudentPerformance(formId, moduleId, roleModuleId) {
  hideMessage("");
  if (!validateRequestForLMSStudentPerformance(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForSignup("save-lmsStudent-Performance", moduleId),
    data: JSON.stringify(getRequestForLMSStudentPerformance(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#lmsStudentContentModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "lms-student-performance");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
      $("#lmsUserForm").prop("disabled", false);
    },
  });
}
function validateRequestForLMSStudentPerformance() {
  if ($("#studentName").val() == "" || $("#studentName").val() == null) {
    showMessage(false, "Student Name  is required");
    return false;
  }
  if ($("#studentEmail").val() == "" || $("#studentEmail").val() == null) {
    showMessage(false, "Student Email is required");
    return false;
  }
  if ($("#teacherName").val() == "" || $("#teacherName").val() == null) {
    showMessage(false, "Teacher Name is required");
    return false;
  }
  if ($("#teacherEmail").val() == "" || $("#teacherEmail").val() == null) {
    showMessage(false, "Teacher Email is required");
    return false;
  }
  if ($("#courseProvider").val() == "0" || $("#courseProvider").val() == null) {
    showMessage(false, "Please select LMS Platform");
    return false;
  }
  if ($("#subjectEventId").val() == "0" || $("#subjectEventId").val() == null) {
    showMessage(false, "Please select course type");
    return false;
  }
  if (
    $("#subjectEventId").val() == "CR" ||
    $("#subjectEventId").val() == "FT"
  ) {
    if ($("#standardId").val() == "0" || $("#standardId").val() == null) {
      showMessage(false, "Grade is required");
      return false;
    }
    if ($("#subjectId").val() == "0" || $("#subjectId").val() == null) {
      showMessage(false, "Course is required");
      return false;
    }
  }
  if ($("#subjectEventId").val() == "AP") {
    if (
      $("#placementStandardId").val() == "0" ||
      $("#placementStandardId").val() == null
    ) {
      showMessage(false, "Grade is required");
      return false;
    }
    if (
      $("#placementSubjectId").val() == "0" ||
      $("#placementSubjectId").val() == null
    ) {
      showMessage(false, "Course is required");
      return false;
    }
  }
  if ($("#status").val() == "0" || $("#status").val() == null) {
    showMessage(false, "Please select status");
    return false;
  }
  return true;
}

function getRequestForLMSStudentPerformance(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var lmsStudentPerformanceTrackDTO = {};
  lmsStudentPerformanceTrackDTO["studentName"] = $(
    "#" + formId + " #studentName"
  ).val();
  lmsStudentPerformanceTrackDTO["studentEmail"] = $(
    "#" + formId + " #studentEmail"
  ).val();
  lmsStudentPerformanceTrackDTO["teacherName"] = $(
    "#" + formId + " #teacherName"
  ).val();
  lmsStudentPerformanceTrackDTO["teacherEmail"] = $(
    "#" + formId + " #teacherEmail"
  ).val();
  lmsStudentPerformanceTrackDTO["courseProviderId"] = $(
    "#" + formId + " #courseProvider"
  ).val();
  lmsStudentPerformanceTrackDTO["comments"] = $(
    "#" + formId + " #idComments"
  ).val();
  if ($("#standardId").val() != 0 && $("#standardId").val() != null) {
    lmsStudentPerformanceTrackDTO["standardId"] = $("#standardId").val();
  }
  if ($("#subjectId").val() != 0 && $("#subjectId").val() != null) {
    lmsStudentPerformanceTrackDTO["subjectId"] = $("#subjectId").val();
  }
  if (
    $("#placementStandardId").val() != 0 &&
    $("#placementStandardId").val() != null
  ) {
    lmsStudentPerformanceTrackDTO["placementStandardId"] = $(
      "#placementStandardId"
    ).val();
  }
  if (
    $("#placementSubjectId").val() != 0 &&
    $("#placementSubjectId").val() != null
  ) {
    lmsStudentPerformanceTrackDTO["placementSubjectId"] = $(
      "#placementSubjectId"
    ).val();
  }
  lmsStudentPerformanceTrackDTO["status"] = $("#" + formId + " #status").val();

  requestData["lmsStudentPerformanceTrackDTO"] = lmsStudentPerformanceTrackDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callScholarshipAssignedUserList(
  scholarId,
  scholarCode,
  scholarApplicableFor
) {
  //		hideMessage('');
  var data = {
    scholarId: scholarId,
    scholarCode: scholarCode,
    scholarApplicableFor: scholarApplicableFor,
  };
  $.ajax({
    type: "POST",
    url: getURLForHTML("dashboard", "scholarship-assigned-user-list"),
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessage(true, stringMessage[1]);
        } else {
          $("#scholarshipAssignedList").html(htmlContent);
          $("#viewAvailedScholarshipModal").modal("show");
        }
        return false;
      }
    },
    error: function (e) {
      //showMessage(true, TECHNICAL_GLITCH);
      return false;
    },
  });
}

function getCourseByGradeAndCourseId(formId) {
  hideMessage("");
  gradeId = $("#" + formId + " #standardId").val();
  courseId = $("#" + formId + " #courseId option:selected").attr("parentid");
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: getURLFor(
      "school",
      "get-course-by-grade-and-course-id/" + gradeId + "/" + courseId
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        $("#" + formId + " #parentId").html("");
        $("#" + formId + " #selfPid").html("");
        $("#" + formId + " #parentId").html(
          '<option value="0"> Self </option>'
        );
        $("#" + formId + " #selfPid").html('<option value="0"> Self </option>');
        $("#" + formId + " #selfPid").append(
          '<option value="1"> None </option>'
        );
        $.each(data.courseByGradeAndCourseIdList, function (k, v) {
          $("#" + formId + " #parentId").append(
            '<option value="' +
              v.subjectId +
              '">' +
              v.subjectCode +
              " - " +
              v.subjectName +
              "</option>"
          );
          $("#" + formId + " #selfPid").append(
            '<option value="' +
              v.subjectId +
              '">' +
              v.subjectCode +
              " - " +
              v.subjectName +
              "</option>"
          );
        });
      }
      return false;
    },
    error: function (e) {
      return false;
    },
  });
}
function getCourseForPlacement(formId) {
  hideMessage("");
  courseId = $("#" + formId + " #courseId").val();
  $.ajax({
    type: "GET",
    contentType: "application/json",
    url: getURLFor("school", "get-course-for-placement/" + courseId),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        $("#" + formId + " #parentId").html("");
        $("#" + formId + " #selfPid").html("");
        $("#" + formId + " #parentId").html(
          '<option value="0"> Self </option>'
        );
        $("#" + formId + " #selfPid").html('<option value="0"> Self </option>');
        $("#" + formId + " #selfPid").append(
          '<option value="1"> None </option>'
        );
        $.each(data.courseForPlacementList, function (k, v) {
          $("#" + formId + " #parentId").append(
            '<option value="' +
              v.subjectId +
              '">' +
              v.subjectCode +
              " - " +
              v.subjectName +
              "</option>"
          );
          $("#" + formId + " #selfPid").append(
            '<option value="' +
              v.subjectId +
              '">' +
              v.subjectCode +
              " - " +
              v.subjectName +
              "</option>"
          );
        });
      }
      return false;
    },
    error: function (e) {
      return false;
    },
  });
}

function followUpStatusDropdown(formId) {
  var meeetingResult = $("#" + formId + " #meetingResult").val();
  if (
    meeetingResult != null &&
    meeetingResult != "" &&
    meeetingResult == "Yes"
  ) {
    $("#followupDiv").css("display", "block");
  } else {
    $("#follupStatus").val("");
    $("#followupDiv").css("display", "none");
  }
}

function callCommentModel(
  meetingId,
  meetingResult,
  requestDemoId,
  comment,
  meetingfollupStatus
) {
  $("#addComentsModal").modal("show");
  $("#addComentsId #requestDemoId").val(requestDemoId);
  $("#addComentsId #meetingId").val(meetingId);
  $("#addComentsId #comment").val(comment);
  $("#addComentsId #meetingResult").val(meetingResult);
  $("#addComentsId #follupStatus").val(meetingfollupStatus);

  $("#addComentsId #meetingResult").removeAttr("disabled");
  $("#addComentsId #comment").removeAttr("disabled");
  $("#addComentsId #follupStatus").removeAttr("disabled");
  $("#addComentsId #followupDiv").css("display", "none");
  $("#addComentsId #sendCommentMail").show();
  $("#addComentsId #note").show();
  if (meetingResult != "") {
    $("#addComentsId #note").hide();
    if (meetingfollupStatus != "") {
      $("#followupDiv").css("display", "block");
    } else {
      $("#followupDiv").css("display", "none");
    }
    $("#addComentsId #meetingResult").attr("disabled", true);
    $("#addComentsId #comment").attr("disabled", true);
    $("#addComentsId #follupStatus").attr("disabled", true);
    $("#addComentsId #sendCommentMail").hide();
  }
}

function sendMailForMeetCounselor(formId, roleModuleId, controllType) {
  if ("ADD_URL" == controllType) {
    if (
      $("#" + formId + " #meetingUrl").val() == undefined ||
      $("#" + formId + " #meetingUrl").val() == ""
    ) {
      showMessage(true, "Add meeting Link");
      return false;
    }
  } else {
    if (
      $("#" + formId + " #meetingResult").val() == undefined ||
      $("#" + formId + " #meetingResult").val() == ""
    ) {
      showMessage(true, "Please select User tour completed?.");
      return false;
    }
    if ("Yes" == $("#" + formId + " #meetingResult").val()) {
      if (
        $("#" + formId + " #follupStatus").val() == null ||
        $("#" + formId + " #follupStatus").val() == ""
      ) {
        showMessage(true, "Please select Live Online School Tour Status.");
        return false;
      }
    }
    if (
      $("#" + formId + " #comment").val() == undefined ||
      $("#" + formId + " #comment").val() == ""
    ) {
      showMessage(true, "Comment is required");
      return false;
    }
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("dashboard", "send-mail-for-meet-counselor"),
    data: JSON.stringify(
      getRequestForsendMailForMeetCounselor(formId, controllType)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        if ("ADD_URL" == controllType) {
          $("#demoMeetingUrlModal").modal("hide");
        } else {
          $("#addComentsModal").modal("hide");
        }
        $("#" + formId)[0].reset();
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "accept-demo-list");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      console.log("ERROR : ", e);
    },
  });
}
function getRequestForsendMailForMeetCounselor(formId, controllType) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var meetCounselorMailDTO = {};

  meetCounselorMailDTO["meetingId"] = $("#" + formId + " #meetingId").val();
  meetCounselorMailDTO["requestDemoId"] = $(
    "#" + formId + " #requestDemoId"
  ).val();
  meetCounselorMailDTO["controllType"] = controllType;
  if ("ADD_URL" == controllType) {
    meetCounselorMailDTO["meetingLink"] = $("#" + formId + " #meetingUrl")
      .val()
      .trim();
    meetCounselorMailDTO["comment"] = escapeCharacters(
      $("#" + formId + " #remarks").val()
    );
  } else {
    meetCounselorMailDTO["meetingResult"] = $(
      "#" + formId + " #meetingResult"
    ).val();
    meetCounselorMailDTO["meetingfollupStatus"] = $(
      "#" + formId + " #follupStatus"
    ).val();
  }

  requestData["meetCounselorMailDTO"] = meetCounselorMailDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}
function saveCourseProvider(
  formId,
  controllType,
  providerId,
  status,
  roleModuleId
) {
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("school", "save-courseProvider-details"),
    data: JSON.stringify(
      getRequestForSaveCourseProvider(formId, controllType, providerId, status)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-course-provider");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      console.log("ERROR : ", e);
    },
  });
}
function getRequestForSaveCourseProvider(
  formId,
  controllType,
  providerId,
  status
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var courseProviderDTO = {};

  courseProviderDTO["courseProviderId"] = providerId;
  courseProviderDTO["controllType"] = controllType;
  courseProviderDTO["status"] = status;

  requestData["courseProviderDTO"] = courseProviderDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL_ADMIN";
  authentication["userId"] = $("#userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callModuleCreate(formId, moduleId, roleModuleId) {
  hideMessage("");
  if (!validateRequestForNewModule(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "submit-module"),
    data: JSON.stringify(getRequestForNewModule(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#" + formId)[0].reset();
        $("#moduleFormModal").modal("hide");
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        $(".navbar-toggler").css("margin-right","0px");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "module");
        }, 1000);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForNewModule(formId, moduleId) {
  var request = {};
  var authentication = {};
  var modulesRequest = {};
  modulesRequest["moduleId"] = $("#" + formId + " #moduleId").val();
  modulesRequest["moduleName"] = $("#" + formId + " #moduleName").val();
  modulesRequest["pageLink"] = $("#" + formId + " #pageLink").val();
  modulesRequest["moduleIcon"] = $("#" + formId + " #moduleIcon").val();
  modulesRequest["moduleType"] = $("#" + formId + " #moduleType").val();
  modulesRequest["parentId"] = $("#" + formId + " #parentModule").val();
  modulesRequest["orderSet"] = $("#" + formId + " #orderSet").val();
  modulesRequest["activated"] = $("#" + formId + " #moduleActive").val();

  request["modulesRequest"] = modulesRequest;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function validateRequestForNewModule(formId, moduleId) {
  if (
    $("#" + formId + " #moduleName").val() == 0 ||
    $("#" + formId + " #moduleName").val() == ""
  ) {
    showMessage(true, "Module name is required.");
    return false;
  }

  if ($("#" + formId + " #pageLink").val() == "") {
    showMessage(true, "Page link is required.");
    return false;
  }
  if (
    $("#" + formId + " #moduleType").val() == 0 ||
    $("#" + formId + " #moduleType").val() == ""
  ) {
    showMessage(true, "Module type is required.");
    return false;
  }

  if ($("#" + formId + " #moduleType").val() == "M") {
    if (
      $("#" + formId + " #moduleIcon").val() == 0 ||
      $("#" + formId + " #moduleIcon").val() == ""
    ) {
      showMessage(true, "Module icon is required.");
      return false;
    }
  }

  if ($("#" + formId + " #parentModule").val() == "") {
    showMessage(true, "Module parent is required.");
    return false;
  }

  //	if($('#'+formId+' #orderSet').val()==0 || $('#'+formId+' #orderSet').val()==''){
  //		showMessage(true, 'Module order is required.');
  //		return false;
  //	}

  if (
    $("#" + formId + " #moduleActive").val() == undefined ||
    $("#" + formId + " #moduleActive") == ""
  ) {
    showMessage(true, " Module active is required.");
    return false;
  }
  return true;
}

function callModuleEdit(formId, moduleId) {
  var result = "";
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "module-edit"),
    data: JSON.stringify(getCallRequestForModuleEdit(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        result = true;
      } else {
        getFormFillModule(formId, data.modulesDTO);
        $("#moduleFormModal").modal("show");
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
    },
  });
  return result;
}

function getCallRequestForModuleEdit(formId, moduleId) {
  var request = {};
  var authentication = {};
  request["requestKey"] = "MODULE-EDIT";
  request["requestValue"] = moduleId;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function getFormFillModule(formId, modulesDTO) {
  modulesDTO = JSON.parse(modulesDTO);
  $("#" + formId + " #moduleId").val(modulesDTO.moduleId);
  $("#" + formId + " #moduleName").val(modulesDTO.moduleName);
  $("#" + formId + " #pageLink").val(modulesDTO.pageLink);
  $("#" + formId + " #moduleIcon").val(modulesDTO.moduleIcon);
  $("#" + formId + " #moduleType").val(modulesDTO.moduleType);
  $("#" + formId + " #parentModule").val(modulesDTO.parentId);
  $("#" + formId + " #orderSet").val(modulesDTO.orderSet);
  $("#" + formId + " #moduleActive").val(modulesDTO.activated);
}

function callRoleCreate(formId, moduleId, roleModuleId) {
  hideMessage("");
  if (!validateRequestForNewRole(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "submit-role"),
    data: JSON.stringify(getRequestForNewRole(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
        $("#" + formId)[0].reset();
        $("#roleFormModal").modal("hide");
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        callDashboardPageSchool(roleModuleId, "modulerole");
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForNewRole(formId, moduleId) {
  var request = {};
  var authentication = {};
  var roleDTO = {};
  roleDTO["roleId"] = $("#" + formId + " #roleId").val();
  roleDTO["roleName"] = $("#" + formId + " #roleName").val();
  roleDTO["parentId"] = $("#" + formId + " #parentRole").val();
  roleDTO["activated"] = $("#" + formId + " #roleActive").val();
  roleDTO["schoolId"] = $("#" + formId + " #schoolId").val();

  request["roleDTO"] = roleDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function validateRequestForNewRole(formId, moduleId) {
  if (
    $("#" + formId + " #roleName").val() == 0 ||
    $("#" + formId + " #roleName").val() == ""
  ) {
    showMessage(true, "Role type is required.");
    return false;
  }

  //	if($('#'+formId+' #parentRole').val()==''){
  //		showMessage(true, 'Role parent is required.');
  //		return false;
  //	}

  if (
    $("#" + formId + " #roleActive").val() == undefined ||
    $("#" + formId + " #roleActive") == ""
  ) {
    showMessage(true, " Role active is required.");
    return false;
  }
  return true;
}

function callRoleEdit(formId, moduleId) {
  var result = "";
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "role-edit"),
    data: JSON.stringify(getCallRequestForRoleEdit(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        result = true;
      } else {
        getFormFillRole(formId, data.roleDTO);
        $("#roleFormModal").modal("show");

        //showMessage(true, "Email doesn't exist");
        //result=false;
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
    },
  });
  return result;
}

function getCallRequestForRoleEdit(formId, roleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  request["requestKey"] = "ROLE-EDIT";
  request["requestValue"] = roleId;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function getFormFillRole(formId, roleDTO) {
  roleDTO = JSON.parse(roleDTO);
  $("#" + formId + " #roleId").val(roleDTO.roleId);
  $("#" + formId + " #schoolId").val(roleDTO.schoolId);
  $("#" + formId + " #roleName").val(roleDTO.roleName);
  $("#" + formId + " #parentRole").val(roleDTO.parentId);
  $("#" + formId + " #roleActive").val(roleDTO.activated);
}

function callModuleRights(formId, roleId, divId) {
  hideMessage("");
  if (!validateRequestModuleRights(formId, roleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "get-module-byrole"),
    data: JSON.stringify(getRequestForModuleRights(formId, roleId)),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        $("#" + divId).html(data);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForModuleRights(formId, roleId) {
  var request = {};
  var authentication = {};
  var roleModuleAssignRequest = {};
  roleModuleAssignRequest["schoolId"] = $("#" + formId + " #schoolId").val();
  roleModuleAssignRequest["roleId"] = roleId;
  roleModuleAssignRequest["moduleType"] = "M";
  roleModuleAssignRequest["parentId"] = 0;

  request["roleModuleAssignRequest"] = roleModuleAssignRequest;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function validateRequestModuleRights(formId, moduleId) {
  return true;
}

function callRoleSubmitAssign(formId) {
  var result = "";
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "submit-rolerights-assign"),
    data: JSON.stringify(getCallRequestForRoleAssign(formId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        result = true;
      } else {
        showMessage(true, data["message"]);
        //result=false;
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
    },
  });
  return result;
}

function getCallRequestForRoleAssign(formId) {
  var request = {};
  var authentication = {};
  var roleRightsRequest = {};
  var roleRightsDTO = [];
  var roleRights = {};
  roleRightsRequest["roleId"] = $("#" + formId + " #roleId").val();

  $(".checkModule").each(function () {
    roleRights = {};
    var chkId = $(this).attr("id").split("_");
    if (chkId.length > 0) {
      if (chkId[0] == "moduleId") {
        roleRights["moduleId"] = chkId[1];
        if ($("#moduleId_" + chkId[1]).is(":checked")) {
          roleRights["moduleActive"] = "Y";
          roleRights["moduleType"] = $("#moduleId_" + chkId[1]).attr(
            "data-moduletype"
          );
        } else {
          roleRights["moduleActive"] = "N";
          roleRights["moduleType"] = $("#moduleId_" + chkId[1]).attr(
            "data-moduletype"
          );
        }

        if ($("#moduleAddId_" + chkId[1]).is(":checked")) {
          roleRights["moduleAdd"] = "Y";
          roleRights["moduleType"] = $("#moduleAddId_" + chkId[1]).attr(
            "data-moduletype"
          );
        } else {
          roleRights["moduleAdd"] = "N";
          roleRights["moduleType"] = $("#moduleAddId_" + chkId[1]).attr(
            "data-moduletype"
          );
        }

        if ($("#moduleUpdateId_" + chkId[1]).is(":checked")) {
          roleRights["moduleUpdate"] = "Y";
          roleRights["moduleType"] = $("#moduleUpdateId_" + chkId[1]).attr(
            "data-moduletype"
          );
        } else {
          roleRights["moduleUpdate"] = "N";
          roleRights["moduleType"] = $("#moduleUpdateId_" + chkId[1]).attr(
            "data-moduletype"
          );
        }

        if ($("#moduleViewId_" + chkId[1]).is(":checked")) {
          roleRights["moduleView"] = "Y";
          roleRights["moduleType"] = $("#moduleViewId_" + chkId[1]).attr(
            "data-moduletype"
          );
        } else {
          roleRights["moduleView"] = "N";
          roleRights["moduleType"] = $("#moduleViewId_" + chkId[1]).attr(
            "data-moduletype"
          );
        }

        if ($("#moduleDeleteId_" + chkId[1]).is(":checked")) {
          roleRights["moduleDelete"] = "Y";
          roleRights["moduleType"] = $("#moduleDeleteId_" + chkId[1]).attr(
            "data-moduletype"
          );
        } else {
          roleRights["moduleDelete"] = "N";
          roleRights["moduleType"] = $("#moduleDeleteId_" + chkId[1]).attr(
            "data-moduletype"
          );
        }
      }
    }
    roleRightsDTO.push(roleRights);
  });
  roleRightsRequest["roleRightsDTO"] = roleRightsDTO;
  request["roleRightsRequest"] = roleRightsRequest;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}
function validateRequestForNewSchool(formId) {
  if (!validateFormAscii(formId)) {
    showMessage(
      false,
      "Please use the English Keyboard while providing information"
    );
    return false;
  }
  if (
    $("#" + formId + " #schoolName").val() == null ||
    $("#" + formId + " #schoolName").val() == ""
  ) {
    showMessage(true, "School Name is required");
    return false;
  }

  if (
    $("#" + formId + " #schoolUrl").val() == null ||
    $("#" + formId + " #schoolUrl").val() == ""
  ) {
    showMessage(true, "School Url is required");
    return false;
  }
  if (
    $("#" + formId + " #schoolWebsite").val() == null ||
    $("#" + formId + " #schoolWebsite").val() == ""
  ) {
    showMessage(true, "School website is required");
    return false;
  }

  if (
    $("#" + formId + " #countryId").val() == 0 ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessage(true, "Country is required");
    return false;
  }

  if (
    $("#" + formId + " #stateId").val() == 0 ||
    $("#" + formId + " #stateId").val() == null
  ) {
    showMessage(true, "State is required");
    return false;
  }

  if (
    $("#" + formId + " #cityId").val() == 0 ||
    $("#" + formId + " #cityId").val() == null
  ) {
    showMessage(true, "City is required");
    return false;
  }
  if ($("#" + formId + " #addressAddress1").val() == "") {
    showMessage(true, "Address 1 is required");
    return false;
  }
  if ($("#" + formId + " #addressAddress2").val() == "") {
    showMessage(true, "Address 2 is required");
    return false;
  }

  if ($("#" + formId + " #pincode").val() == "") {
    showMessage(true, "Pincode is required");
    return false;
  }
  if (!validateEmail($("#" + formId + " #email").val())) {
    showMessage(false, "School Email is either empty or invalid");
    return false;
  }

  if (!validateEmail($("#" + formId + " #schoolCommEmail").val())) {
    showMessage(false, "School communication email is either empty or invalid");
    return false;
  }
  if (
    $("#" + formId + " #countryCode").val() == 0 ||
    $("#" + formId + " #countryCode").val() == "" ||
    $("#" + formId + " #countryCode").val() == null
  ) {
    showMessage(true, "ISD code is required");
    return false;
  }
  if ($("#" + formId + " #contactNumber").val() == "") {
    showMessage(true, "School Phone No is required");
    return false;
  }
  if (
    $("#" + formId + " #countryTimezoneId").val() == "" ||
    $("#" + formId + " #countryTimezoneId").val() == null
  ) {
    showMessage(true, "School Timezone is required");
    return false;
  }
  if ($("#" + formId + " #schoolLogo").val() == "") {
    showMessage(true, "School Logo is required");
    return false;
  }
  if ($("#" + formId + " #schoolSignupUrl").val() == "") {
    showMessage(true, "School signup url is required");
    return false;
  }
  if ($("#" + formId + " #ticketRaisedUrl").val() == "") {
    showMessage(true, "Ticket Raised Url is required");
    return false;
  }

  //	if ($("#"+formId+" #userActive").val()=="") {
  //		showMessage(true, 'Status is required');
  //		return false
  //	}

  return true;
}
function callForNewSchool(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForNewSchool(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "create-new-school"),
    data: JSON.stringify(getRequestForNewSchool(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        if (data["status"] == "1") {
          $("#" + formId)[0].reset();
          setTimeout(function () {
            callDashboardPageSchool(moduleId, "created-school-list");
          }, 1000);
        }
      }
      return false;
    },
  });
}

function getRequestForNewSchool(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var signupSchoolDTO = {};
  var url = window.location.href;
  signupSchoolDTO["schoolId"] = $("#" + formId + " #schoolId").val();
  signupSchoolDTO["schoolUrl"] = $("#" + formId + " #schoolUrl").val();
  signupSchoolDTO["userId"] = $("#" + formId + " #userId").val();
  signupSchoolDTO["schoolName"] = escapeCharacters(
    $("#" + formId + " #schoolName").val()
  );
  signupSchoolDTO["email"] = $("#" + formId + " #email").val();
  signupSchoolDTO["communicationEmail"] = escapeCharacters(
    $("#" + formId + " #schoolCommEmail").val()
  );
  signupSchoolDTO["countryId"] = $("#" + formId + " #countryId").val();
  signupSchoolDTO["countryName"] = $(
    "#" + formId + " #countryId option:selected"
  ).text();
  signupSchoolDTO["stateId"] = $("#" + formId + " #stateId").val();
  signupSchoolDTO["stateName"] = $(
    "#" + formId + " #stateId option:selected"
  ).text();
  signupSchoolDTO["cityId"] = $("#" + formId + " #cityId").val();
  signupSchoolDTO["cityName"] = $(
    "#" + formId + " #cityId option:selected"
  ).text();
  signupSchoolDTO["addressAddress1"] = escapeCharacters(
    $("#" + formId + " #address1").val()
  );
  signupSchoolDTO["addressAddress2"] = escapeCharacters(
    $("#" + formId + " #address2").val()
  );
  signupSchoolDTO["pincode"] = escapeCharacters(
    $("#" + formId + " #pincode").val()
  );

  signupSchoolDTO["countryCode"] = $("#" + formId + " #countryCode").val();
  signupSchoolDTO["contactNumber"] = $("#" + formId + " #contactNumber").val();

  signupSchoolDTO["website"] = escapeCharacters(
    $("#" + formId + " #schoolWebsite").val()
  );
  signupSchoolDTO["schoolLogo"] = escapeCharacters(
    $("#" + formId + " #schoolLogo").val()
  );
  signupSchoolDTO["schoolSignupUrl"] = escapeCharacters(
    $("#" + formId + " #schoolSignupUrl").val()
  );
  signupSchoolDTO["ticketRaisedUrl"] = escapeCharacters(
    $("#" + formId + " #ticketRaisedUrl").val()
  );
  signupSchoolDTO["timezone"] = $(
    "#" + formId + " #countryTimezoneId option:selected"
  ).attr("custom_timezone_id");

  signupSchoolDTO["countryCodeWhatsapp"] = $(
    "#" + formId + " #whtsapCountCode"
  ).val();
  signupSchoolDTO["WhatsappContactNumber"] = $(
    "#" + formId + " #whtsappNumber"
  ).val();

  signupSchoolDTO["termsOfUserUrl"] = escapeCharacters(
    $("#" + formId + " #termsOfUserUrl").val()
  );
  signupSchoolDTO["privacyPolicyUrl"] = escapeCharacters(
    $("#" + formId + " #privacyPolcyUrl").val()
  );
  signupSchoolDTO["codOfConductUrl"] = escapeCharacters(
    $("#" + formId + " #codCondUrl").val()
  );
  signupSchoolDTO["fbAddress"] = escapeCharacters(
    $("#" + formId + " #fbAddress").val()
  );
  signupSchoolDTO["instaAddress"] = escapeCharacters(
    $("#" + formId + " #instaAddress").val()
  );
  signupSchoolDTO["twitAddress"] = escapeCharacters(
    $("#" + formId + " #twitterAddress").val()
  );
  signupSchoolDTO["pintrestAddress"] = escapeCharacters(
    $("#" + formId + " #pintrstAddress").val()
  );
  signupSchoolDTO["linkdinAddress"] = escapeCharacters(
    $("#" + formId + " #linkdinAddress").val()
  );

  signupSchoolDTO["studentRole"] = $("#" + formId + " #assignStudRole").val();
  signupSchoolDTO["parentRole"] = $("#" + formId + " #assignParentRole").val();
  signupSchoolDTO["teacherRole"] = $(
    "#" + formId + " #assignTeacherRole"
  ).val();
  signupSchoolDTO["landlineCode"] = $("#" + formId + " #LandlineCode").val();
  signupSchoolDTO["landlineNumber"] = $(
    "#" + formId + " #landlineNumber"
  ).val();
  signupSchoolDTO["handBookUrl"] = escapeCharacters(
    $("#" + formId + " #handBookUrl").val()
  );
  signupSchoolDTO["favIconUrl"] = escapeCharacters(
    $("#" + formId + " #favIcondUrl").val()
  );
  signupSchoolDTO["emailLogoUrl"] = escapeCharacters(
    $("#" + formId + " #emailLogoUrl").val()
  );
  signupSchoolDTO["chatBoatUrl"] = escapeCharacters(
    $("#" + formId + " #chatBoatUrl").val()
  );
  signupSchoolDTO["contactUsURl"] = escapeCharacters(
    $("#" + formId + " #contactUsUrl").val()
  );
  signupSchoolDTO["hiringEmail"] = $("#" + formId + " #hiringEmail").val();
  signupSchoolDTO["clSignupEmail"] = $(
    "#" + formId + " #clientSignupEmail"
  ).val();
  signupSchoolDTO["ppcRequestEmail"] = $(
    "#" + formId + " #ppcRequestEmail"
  ).val();
  signupSchoolDTO["studInstEmail"] = $(
    "#" + formId + " #studentInstEmail"
  ).val();
  signupSchoolDTO["counsellingEmail"] = $(
    "#" + formId + " #counsellingEmail"
  ).val();
  signupSchoolDTO["classroomSesEmail"] = $(
    "#" + formId + " #classroomEmail"
  ).val();
  signupSchoolDTO["teachnicalEmail"] = $(
    "#" + formId + " #technicalEmail"
  ).val();
  signupSchoolDTO["otherAdminEmail"] = $(
    "#" + formId + " #otherAdminEmail"
  ).val();
  signupSchoolDTO["adminEmail"] = $("#" + formId + " #adminEmail").val();
  signupSchoolDTO["supportEmail"] = $("#" + formId + " #supportEmail").val();
  signupSchoolDTO["studHandbukUrl"] = escapeCharacters(
    $("#" + formId + " #studentHbUrl").val()
  );
  signupSchoolDTO["supportEmail"] = $("#" + formId + " #supportEmail").val();
  signupSchoolDTO["emailAcountName"] = $(
    "#" + formId + " #emailAcountName"
  ).val();

  //	signupSchoolDTO['status'] = $("#"+formId+" #userActive").val();
  signupSchoolDTO["signupType"] = "Offline";
  signupSchoolDTO["userType"] = "SCHOOL";
  userId;
  requestData["signupSchoolDTO"] = signupSchoolDTO;
  authentication["hash"] = getHash();
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callForNewUser(formId, moduleId) {
  hideMessage("");
  if (!validateRequestForNewUser(formId)) {
    //refreshCaptcha('captchaImage');
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "create-new-user"),
    data: JSON.stringify(getRequestForNewUser(formId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        if (data["status"] == "1") {
          resetCreateUserForm(formId);
          setTimeout(function () {
            callDashboardPageSchool(moduleId, "user-list");
          }, 1000);
        }
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
    },
  });
}

function resetCreateUserForm(formId) {
  $("#" + formId + " #firstName").val("");
  $("#" + formId + " #middleName").val("");
  $("#" + formId + " #lastName").val("");
  $("#" + formId + " #gender").val("0");
  $("#" + formId + " #dob").val("");
  $("#" + formId + " #roleUser").val("0");
  $("#" + formId + " #countryId").val("0");
  $("#" + formId + " #stateId").val("0");
  $("#" + formId + " #cityId").val("0");
  $("#" + formId + " #schoolId").val("0");
  $("#" + formId + " #emailId").val("");
  $("#" + formId + " #password").val("");
}
function validateRequestForNewUser(formId) {
  if (!validateFormAscii(formId)) {
    showMessage(
      false,
      "Please use the English Keyboard while providing information"
    );
    return false;
  }
  if ($("#" + formId + " #firstName").val() == "") {
    showMessage(true, "First Name is required");
    return false;
  }

  if (
    $("#" + formId + " #roleUser").val() == 0 ||
    $("#" + formId + " #roleUser").val() == null
  ) {
    showMessage(true, "Role is required");
    return false;
  }

  // if ($("#" + formId + " #lastName").val() == "") {
  // 	showMessage(true, 'Last Name is required');
  // 	return false
  // }

  // if ($("#" + formId + " #schoolId").val() == 0 || $("#" + formId + " #schoolId").val() == null) {
  // 	showMessage(true, 'School is required');
  // 	return false
  // }
  // if ($("#" + formId + " #roleUser").val() == 0 || $("#" + formId + " #roleUser").val() == null) {
  // 	showMessage(true, 'Role is required');
  // 	return false
  // }

  // if ($("#" + formId + " #userActive").val() == "") {
  // 	showMessage(true, 'Status is required');
  // 	return false
  // }
  // if ($("#" + formId + " #userTimeZone").val() == 0 || $("#" + formId + " #userTimeZone").val() == null) {
  // 	showMessage(true, 'Timezone is required');
  // 	return false
  // }
  if (!validateEmail($("#" + formId + " #emailId").val())) {
    showMessage(false, "Email is either empty or invalid");
    return false;
  }
  // if ($("#" + formId + " #password").length) {
  //   if (!validPassword($("#" + formId + " #password").val())) {
  //     showMessage(false, "Either password is empty or invalid");
  //     return false;
  //   }
  //   var pass = $("#" + formId + " #password").val();
  //   if (pass != undefined) {
  //     if (!pattern.test(pass)) {
  //       showMessage(false, "Passwords must match all requirements.");
  //       return false;
  //     }
  //   }
  // }
  // if ($("#" + formId + " #confirmPassword").length) {
  //   if (!validPassword($("#" + formId + " #confirmPassword").val())) {
  //     showMessage(false, "Either confirm password is empty or invalid");
  //     return false;
  //   }
  //   if (
  //     $("#" + formId + " #password").val() !=
  //     $("#" + formId + " #confirmPassword").val()
  //   ) {
  //     showMessage(false, "Password and Confirm Password do not match");
  //     return false;
  //   }
  //   var pass = $("#" + formId + " #password").val();
  //   if (pass != undefined) {
  //     if (!pattern.test(pass)) {
  //       showMessage(false, "Passwords must match all requirements.");
  //       return false;
  //     }
  //   }
  // }
  // if (
  //   $("#" + formId + " #reset").length > 0 &&
  //   $("#" + formId + " #reset").val() != ""
  // ) {
  //   if (!validPassword($("#" + formId + " #reset").val())) {
  //     showMessage(false, "Reset Passwords is empty or invalid");
  //     return false;
  //   }
  //   var pass = $("#" + formId + " #reset").val();
  //   if (pass != undefined) {
  //     if (!pattern.test(pass)) {
  //       showMessage(false, "Reset Passwords must match all requirements.");
  //       return false;
  //     }
  //   }
  // }
  return true;
}

function getRequestForNewUser(formId) {
  var request = {};
  var authentication = {};
  var signupStudentDTO = {};
  var url = window.location.href;
  signupStudentDTO["userId"] = $("#" + formId + " #userId").val();
  signupStudentDTO["firstName"] = $("#" + formId + " #firstName").val();
  signupStudentDTO["middleName"] = $("#" + formId + " #middleName").val();
  signupStudentDTO["lastName"] = $("#" + formId + " #lastName").val();
  signupStudentDTO["gender"] = $("#" + formId + " #gender").val();
  signupStudentDTO["roleUserId"] = $("#" + formId + " #roleUser").val();
  signupStudentDTO["roleUser"] = $(
    "#" + formId + " #roleUser option:selected"
  ).text();
  signupStudentDTO["countryId"] = $("#" + formId + " #countryId").val();
  signupStudentDTO["stateId"] = $("#" + formId + " #stateId").val();
  signupStudentDTO["cityId"] = $("#" + formId + " #cityId").val();
  signupStudentDTO["referralCode"] = $(
    "#" + formId + " #referralCodeCheckbox"
  ).prop("checked");
  signupStudentDTO["referralCodeText"] = $(
    "#" + formId + " #updateReferralCode"
  ).val();
  signupStudentDTO["countryTimezone"] = $(
    "#" + formId + " #userTimeZone option:selected"
  ).attr("data-timezone");
  signupStudentDTO["countryTimezoneId"] = $(
    "#" + formId + " #userTimeZone"
  ).val();
  signupStudentDTO["communicationEmail"] = $("#" + formId + " #emailId").val();
  signupStudentDTO["whatsappNumber"] = $(
    "#" + formId + " #whatsappNumber"
  ).val();
  signupStudentDTO["position"] = $("#" + formId + " #position").val();
  signupStudentDTO["countryIsdCode"] = $("#" + formId + " #isdCode").val();
  if ($("#" + formId + " #password").length) {
    signupStudentDTO["password"] = encode($("#" + formId + " #password").val());
  }
  if ($("#" + formId + " #confirmPassword").length) {
    signupStudentDTO["confirmPassword"] = encode(
      $("#" + formId + " #confirmPassword").val()
    );
  }
  if (
    $("#" + formId + " #reset").length > 0 &&
    $("#" + formId + " #reset").val() != ""
  ) {
    signupStudentDTO["reset"] = encode($("#" + formId + " #reset").val());
  }
  signupStudentDTO["dob"] = $("#" + formId + " #dob").val();
  signupStudentDTO["schoolId"] = $("#" + formId + " #schoolId").val();
  signupStudentDTO["userActive"] = $("#" + formId + " #userActive").val();
  signupStudentDTO["signupType"] = "Offline";
  signupStudentDTO["userType"] = "SCHOOL";
  signupStudentDTO["supportRoleId"] = $("#" + formId + " #supportRoleId").val();

  request["signupStudentDTO"] = signupStudentDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = "SCHOOL";
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function showDemoLeadActionModelFunction(
  functionName,
  type,
  meetingDate,
  meetingSlotTime,
  demoPersonName
) {
  if ("reschedule-demo" == type) {
    functionName = "$('#reshedulemodle').modal('hide');" + functionName + ";";
    $("#warningTitleMessage").html(
      "Are you sure you want to reschedule this Live Online School Tour ?"
    );
    $("#reshedulemodleWarningYes").attr("onclick", functionName);
    $("#reshedulemodle").modal("show");
  } else if ("release-demo" == type) {
    functionName = "$('#reshedulemodle').modal('hide');" + functionName + ";";
    $("#warningTitleMessage").html(
      "Are you sure you want to release this Live Online School Tour ?"
    );
    $("#reshedulemodleWarningYes").attr("onclick", functionName);
    $("#reshedulemodle").modal("show");
  } else {
    functionName =
      "$('#acceptDiscardModel').modal('hide');" + functionName + ";";
    $("#acceptDiscardModelWarningYes").attr("onclick", functionName);
    var meetingDateTime = meetingDate + meetingSlotTime;
    $("#meetingDateTime").html(meetingDateTime);
    if ("discard-demo" == type) {
      $("#warningTitleMessage").html(
        "Are you sure you want to discard this Live Online School Tour ?"
      );
      $("#warningHeadMessage").html(
        "You are discarding the following Live Online School Tour:"
      );
    } else if ("accept-demo" == type) {
      $("#warningTitleMessage").html(
        "Are you sure you want to accept this Live Online School Tour ?"
      );
      $("#warningHeadMessage").html(
        "You are accepting the following Live Online School Tour:"
      );
    }
    $("#demoPersonName").html(demoPersonName);
    $("#acceptDiscardModel").modal("show");
  }
}

function showDiscardRawLeadModelFunction(
  functionName,
  leadSource,
  studentName,
  studentEmail,
  studentPhoneNo,
  createdDate
) {
  functionName =
    "$('#discardRawLeadModel').modal('hide');" + functionName + ";";
  $("#discardRawLeadWarningYes").attr("onclick", functionName);
  $("#leadSource").html(leadSource);
  $("#studentName").html(studentName);
  $("#studentEmail").html(studentEmail);
  $("#studentPhoneNo").html(studentPhoneNo);
  $("#createdDate").html(createdDate);
  $("#discardRawLeadModel").modal("show");
}
function showDiscardLeadModelFunction(
  functionName,
  leadSource,
  studentName,
  studentEmail,
  studentPhoneNo,
  createdDate,
  leadNo
) {
  functionName = "$('#discardLeadModel').modal('hide');" + functionName + ";";
  $("#discardLeadWarningYes").attr("onclick", functionName);
  $("#leadDisplayNo").html(leadNo);
  $("#leadDisplaySource").html(leadSource);
  $("#studentName").html(studentName);
  $("#studentEmail").html(studentEmail);
  $("#studentPhoneNo").html(studentPhoneNo);
  $("#createdDate").html(createdDate);
  $("#discardLeadModel").modal("show");
}

function demoRequestAccept(
  requestDemoId,
  roleModuleId,
  userId,
  controlType,
  demoType
) {
  hideMessage("");
  $.ajax({
    type: "POST",
    url: getURLForHTML("dashboard", "demo-request-accepted"),
    data: encodeURI(
      "request=" +
        JSON.stringify(
          getRequestForDemoRequestAcceptSave(requestDemoId, userId, controlType)
        )
    ),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessage(true, stringMessage[1]);
        } else {
          showMessage(true, stringMessage[1]);
          if (demoType == "pool") {
            setTimeout(function () {
              callDashboardPageSchool(roleModuleId, "request-demo");
            }, 3000);
          } else if (demoType == "accept") {
            callDashboardPageSchool(roleModuleId, "accept-demo-list");
          }
        }
        return false;
      }

      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}
function getRequestForDemoRequestAcceptSave(
  requestDemoId,
  userId,
  controlType
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var requestDemoDTO = {};
  requestDemoDTO["requestDemoId"] = requestDemoId;
  requestDemoDTO["controlType"] = controlType;
  requestData["requestDemoDTO"] = requestDemoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = userId;
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function callForUpdateRequestDemo(formId, moduleId) {
  hideMessage("");
  if (!validateForUpdateRequestDemo(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "update-demo-request-content"),
    data: JSON.stringify(getRequestForUpdateRequestDemo(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        callDashboardPageSchool(moduleId, "accept-demo-list");
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      console.log("ERROR : ", e);
    },
  });
}

function validateForUpdateRequestDemo(formId) {
  //	if ($("#"+formId+" #title").val()=='' || $("#"+formId+" #title").val()==null) {
  //		showMessage(true, 'Title is required');
  //		return false
  //	}
  /*if ($("#"+formId+" #parentName").val()=='' || $("#"+formId+" #parentName").val()==null) {
    showMessage(true, 'First Name is required');
    return false
  }*/
  /*if ($("#"+formId+" #parentLName").val()=='' || $("#"+formId+" #parentLName").val()==null) {
    showMessage(true, 'Last Name is required');
    return false
  }*/
  /*if ($("#"+formId+" #relationType").val()=='' || $("#"+formId+" #relationType").val()==null) {
    showMessage(true, 'Relation Type is required');
    return false
  }*/
  if (
    !validateEmail(
      $("#" + formId + " #parentEmail")
        .val()
        .trim()
    )
  ) {
    showMessage(false, "Parent Email is either empty or invalid");
    return false;
  }
  if (
    $("#" + formId + " #username").val() == "" ||
    $("#" + formId + " #username").val() == null
  ) {
    showMessage(true, "Student First Name is required");
    return false;
  }
  /*if ($("#"+formId+" #userLName").val()=='' || $("#"+formId+" #userLName").val()==null) {
    showMessage(true, 'Student Last Name is required');
    return false
  }*/
  /*if ($("#"+formId+" #sdob").val()=='' || $("#"+formId+" #sdob").val()==null) {
    showMessage(true, 'Student Date Of Birth is required');
    return false
  }*/
  /*if($("#" + formId + " #email").val()!=""){
    if (!validateEmail($("#" + formId + " #email").val().trim())) {
      showMessage(false, 'Email is invalid');
      return false
    }
  }*/
  if (
    $("#" + formId + " #countryId").val() == "" ||
    $("#" + formId + " #countryId").val() == null
  ) {
    showMessage(true, "Country is required");
    return false;
  }
  if (
    $("#" + formId + " #grade").val() == "" ||
    $("#" + formId + " #grade").val() == null
  ) {
    showMessage(true, "Grade is required");
    return false;
  }
  if (
    $("#" + formId + " #isdCodeMobileNo").val() == "" ||
    $("#" + formId + " #isdCodeMobileNo").val() == null
  ) {
    showMessage(true, "ISD Code is required");
    return false;
  }
  if (
    $("#" + formId + " #userphone").val() == "" ||
    $("#" + formId + " #userphone").val() == null
  ) {
    showMessage(true, "Phone Number is required");
    return false;
  }
  if (
    ($("#" + formId + " #isdCodeMobileNo").val() == "" ||
      $("#" + formId + " #isdCodeMobileNo").val() == null) &&
    ($("#" + formId + " #userphone").val() == "" ||
      $("#" + formId + " #userphone").val() == null)
  ) {
    showMessage(true, "ISD Code and Phone No. are required");
    return false;
  }
  if (
    $("#" + formId + " #wtspNumber").val() != "" &&
    $("#" + formId + " #isdCodeWhatsupNo").val() == ""
  ) {
    showMessage(true, "ISD Code for whats app number is required");
    return false;
  }
  return true;
}

function getRequestForUpdateRequestDemo(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var requestDemoDTO = {};
  var url = window.location.href;
  requestDemoDTO["encryptedRequestDemoId"] = $(
    "#" + formId + " #encryptedRequestDemoId"
  ).val();
  requestDemoDTO["name"] = $("#" + formId + " #username").val();
  requestDemoDTO["lastName"] = $("#" + formId + " #userLName").val();
  requestDemoDTO["email"] = $("#" + formId + " #email")
    .val()
    .trim();

  requestDemoDTO["isdCode"] = $("#" + formId + " #isdCodeMobileNo").val();
  requestDemoDTO["isdCodeIcon"] = $(
    "#" + formId + " #isdCodeMobileNoIcon"
  ).val();

  requestDemoDTO["contactNumber"] = $("#" + formId + " #userphone").val();

  requestDemoDTO["isdCodeWtsp"] = $("#" + formId + " #isdCodeWhatsupNo").val();
  requestDemoDTO["isdCodeWtspIcon"] = $(
    "#" + formId + " #isdCodeWhatsupNoIcon"
  ).val();

  requestDemoDTO["wtspNumber"] = $("#" + formId + " #wtspNumber").val();
  requestDemoDTO["contactDescription"] = escapeCharacters(
    $("#" + formId + " #description").val()
  );
  requestDemoDTO["grade"] = $("#" + formId + " #grade").val();
  requestDemoDTO["sdob"] = $("#" + formId + " #sdob").val();

  requestDemoDTO["relationType"] = $("#" + formId + " #relationType").val();
  requestDemoDTO["title"] = $("#" + formId + " #title").val();
  requestDemoDTO["parentName"] = $("#" + formId + " #parentName").val();
  requestDemoDTO["parentLName"] = $("#" + formId + " #parentLName").val();
  requestDemoDTO["parentEmail"] = $("#" + formId + " #parentEmail")
    .val()
    .trim();
  requestDemoDTO["countryId"] = $("#" + formId + " #countryId")
    .val()
    .trim();
  requestDemoDTO["countryName"] = $(
    "#" + formId + " #countryId option:selected"
  )
    .text()
    .trim();
  requestDemoDTO["moduleName"] = moduleId;

  requestData["requestDemoDTO"] = requestDemoDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

function submitWithDrawnRequestRemark(
  formId,
  moduleId,
  requestId,
  status,
  userId
) {
  hideMessage("");
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "withdrawn-request-submit"),
    data: JSON.stringify(
      getRequestForSubmitWithDrawnRemark(
        formId,
        moduleId,
        requestId,
        status,
        userId
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
        $("#withdrawnAppovelModal").hide();
        $(".modal-backdrop").remove();
        $("body").removeClass("modal-open");
        callDashboardPageSchool(114, "withdrawn-request-list");
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitWithDrawnRemark(
  formId,
  moduleId,
  requestId,
  status,
  userId
) {
  var request = {};
  var authentication = {};
  var withdrawnRequestDTO = {};
  withdrawnRequestDTO["requestId"] = requestId;
  withdrawnRequestDTO["status"] = status;
  withdrawnRequestDTO["userId"] = userId;
  if ($("#remarks").val() != undefined) {
    withdrawnRequestDTO["remarks"] = $("#remarks").val();
  }

  request["withdrawnRequestDTO"] = withdrawnRequestDTO;
  authentication["hash"] = getHash();
  authentication["userType"] = moduleId;
  authentication["userId"] = USER_ID;
  request["authentication"] = authentication;
  return request;
}

function saveUpdateGotomeetingUser(callFrom, moduleId) {
  var userId = $("#userIdforGoto").val();
  var gotoMeetingId = $("#gotoId").val();
  var meetingVendor = "LENS";
  var data = {};
  data["meetingVendor"] = meetingVendor;
  data["userId"] = userId;
  data["UNIQUEUUID"] = UNIQUEUUID;
  if (gotoMeetingId == "" || gotoMeetingId == "0") {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: getURLForHTML("gotomeeting", "createUser"),
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        showMessage(true, data["message"]);
        if ("teacherPage" == callFrom) {
          setTimeout(function () {
            callDashboardPageSchool(moduleId, "approved-teachers");
          }, 1000);
        } else {
          setTimeout(function () {
            callDashboardPageSchool(moduleId, "user-list");
          }, 1000);
        }
      },
      error: function (e) {
        //showMessage(true, TECHNICAL_GLITCH);
      },
    });
  } else {
    $.ajax({
      type: "POST",
      contentType: "application/json",
      url: getURLForHTML("gotomeeting", "update-goto-meeting-user"),
      data: JSON.stringify({ gotoMeetingUserId: gotoMeetingId }),
      dataType: "json",
      success: function (data) {
        showMessage(true, data["message"]);
        if ("teacherPage" == callFrom) {
          setTimeout(function () {
            callDashboardPageSchool(moduleId, "approved-teachers");
          }, 1000);
        } else {
          setTimeout(function () {
            callDashboardPageSchool(moduleId, "user-list");
          }, 1000);
        }
      },
      error: function (e) {
        //showMessage(true, TECHNICAL_GLITCH);
      },
    });
  }
}

function showTeacherStatusPopup(
  message,
  status,
  gotoId,
  userId,
  meetingVendor
) {
  $("#userIdforGoto").val(userId);
  $("#gotoId").val(gotoId);
  $("#meetingvendor").val(meetingVendor);
  if (status == "Active") {
    $("#statusMessage-1").html(
      '<i class="fa fa-user-plus text-primary fa-4x"></i>'
    );
    $("#showMessageCreateUser .modal-header")
      .addClass("bg-primary")
      .removeClass("bg-danger, bg-success");
    $("#resetDeleteErrorWarningNo")
      .text("Inactivate")
      .addClass("btn-primary")
      .removeClass("btn-danger,btn-success");
  } else if (status == "Inactive") {
    $("#statusMessage-1").html('<i class="fa fa-times text-danger fa-4x"></i>');
    $("#showMessageCreateUser .modal-header")
      .addClass("bg-danger")
      .removeClass("bg-success, bg-primary");
    $("#resetDeleteErrorWarningNo")
      .text("Activate")
      .addClass("btn-danger")
      .removeClass("btn-success, btn-primary");
  } else if (status == "create") {
    $("#statusMessage-1").html(
      '<i class="fa fa-check text-success fa-4x"></i>'
    );
    $("#showMessageCreateUser .modal-header")
      .addClass("bg-success")
      .removeClass("bg-danger, bg-primary");
    $("#resetDeleteErrorWarningNo")
      .text("Create")
      .addClass("btn-success")
      .removeClass("btn-danger, btn-primary");
  }
  $("#gotoMeetingUserstatus").html(message);
  $("#showMessageCreateUser").modal("show");
}

function dashboardRequestDemo() {
  var strDate = "";
  dateFrom = $("#formdate").val();
  dateto = $("#todate").val();
  if (dateFrom != "" && dateFrom != undefined) {
    strDate =
      dateFrom.split("-")[2] +
      "-" +
      dateFrom.split("-")[0] +
      "-" +
      dateFrom.split("-")[1];
  } else {
    strDate = "";
  }
  var strDateTo = "";
  if (dateto != "" && dateto != undefined) {
    strDateTo =
      dateto.split("-")[2] +
      "-" +
      dateto.split("-")[0] +
      "-" +
      dateto.split("-")[1];
  } else {
    strDateTo = "";
  }
  var data = {};
  data["todayDate"] = strDate;
  data["toDate"] = strDateTo;
  data["userId"] = USER_ID;
  $.ajax({
    global: false,
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "get-request-demo-user"),
    data: JSON.stringify(data),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          if (stringMessage[0] == "SESSIONOUT") {
            redirectLoginPage();
          } else {
            showMessage(true, stringMessage[1]);
          }
        } else {
          $("#dashboardRequestDemo").html(htmlContent);
        }
        return false;
      }
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
        return;
      }else{
        customLoaderDashBoard(6, false);
        showMessage(true, e.responseText);
      }
    },
  });
}

function dashboardRequestDemoDateWise(strDate) {
  var dateStr = strDate;
  dateStr =
    dateStr.split("-")[2] +
    "-" +
    dateStr.split("-")[0] +
    "-" +
    dateStr.split("-")[1];
  var data = {};
  data["todayDate"] = dateStr;
  data["userId"] = USER_ID;
  $.ajax({
    global: false,
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "get-request-demo-datewise"),
    data: JSON.stringify(data),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          if (stringMessage[0] == "SESSIONOUT") {
            redirectLoginPage();
          } else {
            showMessage(true, stringMessage[1]);
          }
        } else {
          $("#daywiseDemo").html(htmlContent);
        }
        return false;
      }
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
        return;
      }else{
        customLoaderDashBoard(6, false);
        showMessage(true, e.responseText);
      }
    },
  });
}

function advanceRequestDemoSearch(formId, moduleId) {
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "advance-request-demo-search"),
    data: JSON.stringify(
      getCallRequestForadvanceRequestDemoSearch(formId, moduleId)
    ),
    dataType: "html",
    async: false,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          if (stringMessage[0] == "SESSIONOUT") {
            redirectLoginPage();
          } else {
            showMessage(true, stringMessage[1]);
          }
        } else {
          $(".filter-fields").stop();
          $("#demoRequestAdvance").html(htmlContent);
        }
        return false;
      }
    },
  });
}

function getCallRequestForadvanceRequestDemoSearch(formId, moduleId) {
  var request = {};
  // var requestData = {};
  var authentication = {};
  var requestDemoDTO = {};
  requestDemoDTO["moduleId"] = moduleId;
  requestDemoDTO["requestRaisedBy"] = "student";
  requestDemoDTO["demotype"] = $("#" + formId + " #filterDemoType").val();
  requestDemoDTO["campaign"] = "admin";
  requestDemoDTO["name"] = $("#" + formId + " #studName").val();
  requestDemoDTO["lastName"] = $("#" + formId + " #lastName").val();
  requestDemoDTO["standardId"] = $("#" + formId + " #filterStandardId").val();
  requestDemoDTO["schoolId"] = 1;
  requestDemoDTO["email"] = $("#" + formId + " #emailId").val();
  requestDemoDTO["contactNumber"] = $("#" + formId + " #mobileNo").val();
  requestDemoDTO["countryId"] = $("#" + formId + " #countryId").val();
  requestDemoDTO["sortBy"] = $("#" + formId + " #sortFilter").val();
  requestDemoDTO["orderBy"] = $("#" + formId + " #orderFilter").val();
  if ($("#" + formId + " #demoStartDate").val() != "") {
    var demoStart = $("#" + formId + " #demoStartDate").val();
    requestDemoDTO["demoStartDate"] =
      demoStart.split("-")[2] +
      "-" +
      demoStart.split("-")[0] +
      "-" +
      demoStart.split("-")[1];
  }
  if ($("#" + formId + " #demoEndDate").val() != "") {
    var demoEnd = $("#" + formId + " #demoEndDate").val();
    requestDemoDTO["demoEndDate"] =
      demoEnd.split("-")[2] +
      "-" +
      demoEnd.split("-")[0] +
      "-" +
      demoEnd.split("-")[1];
  }
  if ($("#" + formId + " #demoMeetingStartDate").val() != "") {
    var demoMeetingStart = $("#" + formId + " #demoMeetingStartDate").val();
    requestDemoDTO["demoMeetingStartDate"] =
      demoMeetingStart.split("-")[2] +
      "-" +
      demoMeetingStart.split("-")[0] +
      "-" +
      demoMeetingStart.split("-")[1];
  }
  if ($("#" + formId + " #demoMeetingEndDate").val() != "") {
    var demoMeetingEnd = $("#" + formId + " #demoMeetingEndDate").val();
    requestDemoDTO["demoMeetingEndDate"] =
      demoMeetingEnd.split("-")[2] +
      "-" +
      demoMeetingEnd.split("-")[0] +
      "-" +
      demoMeetingEnd.split("-")[1];
  }

  requestDemoDTO["demoClickFrom"] = $("#" + formId + " #demoClickFrom").val();

  requestDemoDTO["schoolUUID"] = SCHOOL_UUID;
  //requestData['requestDemoDTO'] = requestDemoDTO;
  request["requestDemoDTO"] = requestDemoDTO;
  authentication["hash"] = getHash();
  authentication["userType"] = "SCHOOL";
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  request["authentication"] = authentication;
  return request;
}

function advanceStudentSearchReset(formId) {
  $("#" + formId)[0].reset();
  $("#" + formId + " #schoolId")
    .val(SCHOOL_ID)
    .trigger("change");
  $("#" + formId + " #filterEnrollStatus")
    .val("")
    .trigger("change");
  $("#" + formId + " #countryTimezoneFromId")
    .val("")
    .trigger("change");
  $("#" + formId + " #countryTimezoneToId")
    .val("")
    .trigger("change");
  $("#" + formId + " #filterStandardId")
    .val("")
    .trigger("change");
  $("#" + formId + " #studName").val("");
  $("#" + formId + " #emailId").val("");
  $("#" + formId + " #mobileNo").val("");
  $("#" + formId + " #countryId")
    .val("")
    .trigger("change");
  $("#" + formId + " #filterStateId")
    .val("")
    .trigger("change");
  $("#" + formId + " #filterCityId")
    .val("")
    .trigger("change");
  $("#" + formId + " #sortFilter")
    .val("")
    .trigger("change");
  $("#" + formId + " #orderFilter")
    .val("")
    .trigger("change");
}

function sendGotoMettingLinkForAcceptingDemo(meetingLogsId, requestDemoId) {
  hideMessage("");
  $.ajax({
    type: "GET",
    url: getURLForHTML(
      "dashboard",
      "send-gotomeetinglink-mail-on-accepting-demo"
    ),
    data: "meetingLogsId=" + meetingLogsId + "&requestDemoId=" + requestDemoId,
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (
        data["status"] == "0" ||
        data["status"] == "2" ||
        data["status"] == "3"
      ) {
        showMessage(true, data["message"]);
      } else {
        showMessage(false, data["message"]);
      }
      return false;
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function callCommentModel2(
  meetingId,
  requestDemoId,
  comment,
  userId,
  meetingUrl,
  meetingUrlRem
) {
  $("#demoMeetingUrlModal").modal("show");
  $("#demoMeetingUrlForm #note").show();
  $("#demoMeetingUrlForm #meetingId").val(meetingId);
  $("#demoMeetingUrlForm #requestDemoId").val(requestDemoId);
  $("#demoMeetingUrlForm #meetingUrl").val(meetingUrl);
  $("#demoMeetingUrlForm #remarks").val(meetingUrlRem);
}

function saveDaysCountOfAcademicYearStart(formId) {
  var daysCount = $("#" + formId + " #daysCount").val();
  var daysCountMax = $("#" + formId + " #daysCountMax").val();
  var academicYearBlockDate = $("#" + formId + " #academicYearBlockDate").val();
  if (daysCount == "" || daysCount == undefined) {
    showMessage(true, " Lower limit is mandatory");
    return false;
  }
  if (daysCountMax == "" || daysCountMax == undefined) {
    showMessage(true, " Upper limit is mandatory");
    return false;
  }
  if (parseInt(daysCountMax) <= parseInt(daysCount)) {
    showMessage(true, " Upper limit can not be less or equal to lower limit");
    return false;
  }
  var data = {};
  data["daysCount"] = daysCount;
  data["academicYearBlockDate"] = academicYearBlockDate;
  data["daysCountMax"] = daysCountMax;
  data["userId"] = USER_ID;
  data["schoolId"] = SCHOOL_ID;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "save-academic-year-date-settings"),
    data: JSON.stringify(data),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (
        data["status"] == "0" ||
        data["status"] == "2" ||
        data["status"] == "3"
      ) {
        showMessage(true, data["message"]);
      } else {
        showMessage(true, data["message"]);
      }
    },
    error: function (e) {
      //showMessage(true, e.responseText);
      return false;
    },
  });
}

function getStateWiseData(moduleId, schoolId, countryName, year) {
  hideMessage("");

  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML(
      "dashboard",
      "statewise-data-reports?moduleId=" +
        moduleId +
        "&schoolId=" +
        schoolId +
        "&countryName=" +
        countryName +
        "&year=" +
        year
    ),
    data: "",
    dataType: "html",
    async: false,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          if (stringMessage[0] == "SESSIONOUT") {
            redirectLoginPage();
          } else {
            showMessage(true, stringMessage[1]);
          }
        } else {
          $("#modalStateReportMsg").html(htmlContent);
          $("#modalStateReport").show();
        }
        return false;
      }
    },
  });
}

function callEvaluationFormDocs(evaluationId) {
  hideMessage("");
  var data = {};
  data["evaluationId"] = evaluationId;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url:
      BASE_URL +
      CONTEXT_PATH +
      SCHOOL_UUID +
      "/evaluation-form-student-documents-content",
    data: JSON.stringify(data),
    dataType: "html",
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessage(true, stringMessage[1]);
        } else {
          $("#evaluationImageContent").html(htmlContent);
        }
        return false;
      }
    },
    error: function (e) {
      console.log(e);
      //	showMessage(true, TECHNICAL_GLITCH);
      return false;
    },
  });
}
function changeVendor(formId, elementId, toElement) {
  $("#" + formId + " #" + toElement).val("");
  if ($("#" + formId + " #" + elementId).val() == "External") {
    $("#" + formId + " #" + toElement).attr("readonly", false);
  } else {
    $("#" + formId + " #" + toElement).attr("readonly", true);
  }
  if ($("#" + formId + " #joiningType").val() == "Multiple") {
    $("#" + formId + " #" + toElement).val("");
  }
}

function changeJoiningType(formId, toElement) {
  if ($("#" + formId + " #joiningType").val() == "Multiple") {
    $("#" + formId + " #" + toElement).val("");
  }
}

function getChat(email, role) {
  var payload = {};
  payload["role"] = role;
  payload["email"] = email;
  payload["userId"] = USER_ID;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/chat",
    data: JSON.stringify(payload),
    dataType: "json",
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        $(".UNSEEN").html("0");
      } else {
        $(".UNSEEN").html(data["sumUnseen"]);
        sumUnseen = data["sumUnseen"];
      }
    },
    error: function (e) {
      console.log("ERROR : ", e);
    },
  });
}
function confirmationOfStudies(payload) {
  customLoader(false);
  urlSend =
    BASE_URL +
    CONTEXT_PATH +
    SCHOOL_UUID +
    "/dashboard/confirmation-of-studies?payload=" +
    payload;
  window.open(urlSend, "_blank");
}
function callUserReferralUpdate(formId, studentStandardId, roleModuleId) {
  $("#studentStandardId").val(studentStandardId);
  $("#updateReferralCodeModal").modal("show");
}

function saveNewReferralCode() {
  hideMessage("");
  var refCode = $("#newReferralCode").val();
  if (
    refCode == null ||
    refCode == "" ||
    refCode == undefined ||
    refCode == 0
  ) {
    showMessage(true, "Invalid referral code");
    return false;
  }
  var studentStandardId = $("#studentStandardId").val();
  var data = {};
  data["studentStandardId"] = studentStandardId;
  data["sessionUserId"] = USER_ID;
  data["referralCode"] = refCode;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLForHTML("dashboard", "update-referral-code"),
    data: JSON.stringify(data),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
          showMessage(true, stringMessage[1]);
        } else {
          showMessage(true, stringMessage[1]);
          $("#updateReferralCodeModal").modal("hide");
        }
        return false;
      }
    },
    error: function (e) {
      console.log(e);
      //	showMessage(true, TECHNICAL_GLITCH);
      return false;
    },
  });
}

function createIframe(soruceUrl) {
  var iframe = document.createElement("iframe");
  iframe.src = soruceUrl;
  return iframe;
}

function proceedwithControll(url, response) {
  if (
    response["status"] == "0" ||
    response["status"] == "2" ||
    response["status"] == "3"
  ) {
    if (response["status"] == "3") {
      redirectLoginPage();
    } else {
      if (response["message"]) {
        var message = response["message"];
        if ("Too many attempts. Please try after some time" == message) {
          message = "Please click on the class again";
        }
        if (tt == "theme2") {
          showMessageTheme2(false, message);
        } else {
          showMessage(false, message);
        }
      } else {
        if (
          response["dateStatus"] == "past" ||
          response["dateStatus"] == "future"
        ) {
          $("#classJoinInSameWindowModal").modal({
            backdrop: "static",
            keyboard: false,
          });
          $("#classTime").html(response["classDate"]);
          $("#className").html(response["className"]);
          $("#subjectName").html(response["subjectName"]);
          if (response["userRole"] != "TEACHER") {
            $("#classJoinInSameWindowBody").html(
              calendarMeetingLinkValidateStudent(url, response)
            );
          } else {
            $("#classJoinInSameWindowBody").html(
              calendarMeetingLinkValidateTeacher(url, response)
            );
          }
        }
      }
    }
  } else {
    if (response["dateStatus"] == "between") {
      var classUrl = response["redirectUrl"];
      $("#classJoinInSameWindowModal").modal({
        backdrop: "static",
        keyboard: false,
      });
      $("#classJoinInSameWindowBody").html(
        calendarMeetingLinkValidateStudent(classUrl, response)
      );
      window.setTimeout(function () {
        $("#classJoinInSameWindowModal").modal("hide");
      }, response["meetingJoinModalHideMin"] * 1000);
      window.open(classUrl, "_blank");
    }
  }
}

function getActualURL(baseUrl) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      url: baseUrl,
      async: true,
      success: function (data) {
        resolve(data);
      },
      error: function (xhr, status, error) {
        console.error("Error: " + error);
        reject(error);
      },
    });
  });
}

async function classDetailsOnModal(url) {
  try {
    const responseData = await getActualURL(url);
    if (responseData) {
      if (responseData.redirect) {
          window.open(responseData.redirectUrl, '_blank');
      }
      proceedwithControll(url, responseData);
  }
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

function calendarMeetingLinkValidate() {
  var html = `<div class="calendarClassDetails modal fade" id="classJoinInSameWindowModal" tabindex="-1" role="dialog" aria-labelledby="classJoinInSameWindowModalLabel" aria-hidden="true">
			 <div class="modal-dialog modal-lg">
				 <div class="modal-content">
					 <div class="modal-header py-2 bg-primary">
						 <h5 class="modal-title text-white">
							 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20px" fill="#fff"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>&nbsp;Information
						 </h5>
					 </div>
					 <div id="classJoinInSameWindowBody" class="modal-body py-4">
					 </div>
				 </div>
			 </div>
		 </div>`;
  return html;
}

function calendarMeetingLinkValidateTeacher(url, response) {
  var warringMessage = false;
  if (response["dateStatus"] == "past") {
    if (response["pastClassWarning"]) {
      warringMessage = true;
    }
  } else if (response["dateStatus"] == "future") {
    if (response["futureClassWarning"]) {
      warringMessage = true;
    }
  }
  if (warringMessage) {
    var jfmUrl = url + "?jfm=Y";
    var html =
      `<div class="full text-center mb-2">
      <h5 class="font-weight-bold">You are about to start the following class:</h5>
    </div>
    <div id="classJoinWaringDiv">
      <div id="classWaringMessage" class="full text-center my-4">
        <h5>The class ` + response.classDate + ` | ` + response.className + ` | ` + response.subjectName + `</h5>
        <h5>The current time does not match this scheduled class time. Do you still wish to proceed?</h5>
      </div>
      <div class="full text-center mt-2">
        <button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">No</button>
        <a id="classJoinWaring" href="javascript:void(0)" class="btn btn-primary font-size-lg" onclick="classDetailsOnModal('` + jfmUrl + `')"> Start Class</a>
      </div>
    </div>`;
    return html;
  }
  var html =
    `<div id="classJoinWaringDiv">
    <div id="classWaringMessage" class="full text-center my-4">
      <h5>The class ` + response.className + ` is scheduled for ` + convertDatetimeWithFormat((response.classDate), BASE_TIMEZONE, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5>
      <h5>You can start the class on ` + response.canJoindateStart + `.</h5>
    </div>
    <div class="full text-center mt-2">
      <button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">Close</button>
    </div>
  </div>`;
  return html;
}

function calendarMeetingLinkValidateStudent(url, response) {
  var warringMessage = false;
  if (response["dateStatus"] == "past") {
    warringMessage = true;
  } else if (response["dateStatus"] == "future") {
    warringMessage = true;
  }
  var html =
    `<div id="classJoinWaringDiv">
		<div id="classWaringMessage" class="full text-center my-4">
			<h5>The class ` + response.className + ` | ` + response.subjectName + ` is scheduled for ` + convertDatetimeWithFormat((response.classDate), BASE_TIMEZONE, USER_TIMEZONE, DISPLAY_DATE_AND_TIME) + `.</h5><br/>`;
  if ( response.meetingId && response.meetingPasscode && response.meetingId != "" && response.meetingPasscode != "" ) {
    html +=
      `<h6>If you are having issues with redirection to the class, please join with the credentials given below. </h6>
        <h5> Meeting ID : ` + response.meetingId + "<br/>  Meeting Passcode : " + response.meetingPasscode + `</h6>
        <div class="copy-msg font-size-lg mb-2"></div>`;
  }
  if (!warringMessage) {
    html +=
      `<b class="copy-msg-0 text-success"></b></br>
             <a target="_blank" id="classJoinWaring" href="` +
      url +
      `" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-primary font-size-lg">Join Class Now</a>
             <button class="btn btn-success font-size-lg" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-copy"></i>&nbsp;Copy Class Link</button>`;
  }
  html +=
    `</div>
    <div class="position-absolute" style="top:0;left:0;">
      <input type="text" id="copyURL0" value="` +
    url +
    `" style="opacity:0;height:0px">
    </div>
		<div class="full text-center mt-2">
			<button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">Close</button>
		</div>
	</div>`;
  return html;
}
