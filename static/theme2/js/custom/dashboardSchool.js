function callDashboardPageSchool(moduleId, pageNo, replaceDiv, extraParam) {
  showAndHideDashboardAndAdditionalContent("main");
  if(!getSession()){
      redirectLoginPage();
      return false;
  }
  //customLoader(true);
  if (pageNo == "home") {
   
    // callForDashboardData(
    //   "formIdIfAny",
    //   "school-admin-content?moduleId=" + moduleId + "&schoolId=" + SCHOOL_ID
    // );
    if(SCHOOL_ID>1){
      callForDashboardData(
        "formIdIfAny",
        "dashboard-content?moduleId=" + moduleId,
        replaceDiv
      );
    }else{
      getContent(1,'home','','');
    }
  } else if (pageNo == "dashboard") {
    if (SCHOOL_TYPE == "WLP") {
      // var urlSend = "/dashboard/admin-partner-dashboard?moduleId=" + moduleId;
      // getAsPost(urlSend);
      // customLoader(false);
      //partner-dashboard
      if(SCHOOL_ID != 2){
        $('#dashboardContentInHTML').html(renderPartnerDashboard('Partner Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
      }else{
       $('#dashboardContentInHTML').html(renderPartnerDashboard('Partner Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)); 
      }
    } else {
      callForDashboardData(
        "formIdIfAny",
        "dashboard-content?moduleId=" + moduleId,
        replaceDiv
      );
    }
  } else if (pageNo == "dashboard-white-school") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "dashboard-content?moduleId=" + moduleId,
    //   replaceDiv
    // );
    getContent(1,'dashboard-white-school','','');
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
      "create-user-content?moduleId=" + moduleId+'&themeType=theme2',
      replaceDiv
    );
  } else if (pageNo == "user-list") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "user-list?moduleId=" + moduleId + "&profileFor=common&themeType=theme2"
    // );
     getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "student-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=student&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2",
      replaceDiv
    );
    $("#studentTab").show();
    $("#teacherTab").hide();
    $("#parentsTab").show();
    $("#flexStudentTab").hide();
    //$('.modal-backdrop').remove();
  } else if (pageNo == "teacher-list") {
    callForDashboardData(
      "form",
"manage-profile-content?moduleId="+moduleId+"&profileFor=teacher&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2",replaceDiv
    );
    $("#studentTab").hide();
    $("#teacherTab").show();
    $("#parentsTab").hide();
    $("#flexStudentTab").hide();
    $("#studentTab").css("display", "none");
    $("#teacherTab").css("display", "block");
    $("#parentsTab").css("display", "none");
    $("#flexStudentTab").css("display", "none");
  } else if (pageNo == "parent-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=parent&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2",
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").show();
      $("#flexStudentTab").hide();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#parentsTab").css("display", "block");
      $("#flexStudentTab").css("display", "none");
    }, 100);
  } else if (pageNo == "school-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=school&userClickFrom=list&registrationType=ONE_TO_ONE",
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").hide();
      $("#schoolTab").show();
      $("#flexStudentTab").hide();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#schoolTab").css("display", "block");
      $("#flexStudentTab").css("display", "none");
    }, 100);
  } else if (pageNo == "flex-list") {
    callForDashboardData(
      "form",
      "manage-profile-content?moduleId=" +
        moduleId +
        "&profileFor=flexStudent&userClickFrom=list&registrationType=ONE_TO_ONE",
      replaceDiv
    );
    window.setTimeout(function () {
      $("#studentTab").hide();
      $("#teacherTab").hide();
      $("#parentsTab").hide();
      $("#schoolTab").hide();
      $("#flexStudentTab").show();
      $("#studentTab").css("display", "none");
      $("#teacherTab").css("display", "none");
      $("#schoolTab").css("display", "none");
      $("#flexStudentTab").css("display", "block");
    }, 100);
  } else if (pageNo == "online-user") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
    // callForDashboardData(
    //   "formIdIfAny",
    //   "online-users-request-content?moduleId=" + moduleId+"&themeType=theme2"
    // );
  } else if (pageNo == "5a") {
    callForDashboardData("formIdIfAny", "teacher-salary-content");
  } else if (pageNo == "teacher-profile") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "teacher-profile-request-content?moduleId=" +
    //     moduleId +
    //     "&ids=13&types=0,1"
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "pending-interview-remarks") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
    // callForDashboardData(
    //   "formIdIfAny",
    //   "teacher-profile-request-interview-content?moduleId=" +
    //     moduleId +
    //     "&ids=19,20,22,23&types=0,1"
    // );
  } else if (pageNo == "pending-training-remarks") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "teacher-profile-request-content?moduleId=" +
    //     moduleId +
    //     "&ids=16&types=0,1"
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "5e") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-profile-request-content?moduleId=" +
        moduleId +
        "&ids=0,14,16,17,19,20&types=0,1"
    );
  } else if (pageNo == "approved-teachers") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "teacher-profile-approved-request-content?moduleId=" +
    //     moduleId +
    //     "&ids=0&types=0,1"
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam );
  }else if (pageNo == "withdraw-teachers") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "teacher-profile-withdraw-request-content?moduleId=" +
    //     moduleId +
    //     "&ids=1&types=0,1"
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam );
  } else if (pageNo == "rejected-teachers") {
    getContent(moduleId, pageNo, replaceDiv, extraParam );
    // callForDashboardData(
    //   "formIdIfAny",
    //   "teacher-profile-request-content?moduleId=" +
    //     moduleId +
    //     "&ids=15,18,21&types=2"
    // );
  } else if (pageNo == "teacher-profile-pending-bank-details") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "teacher-profile-pending-verification") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
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
  }else if (pageNo == "student-transcript") {
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
      "scholarship-request-content?moduleId=" + moduleId+"&themetype=theme2"
    );
  } else if (pageNo == "payment") {
    // $('#userPaymentHistoryDetails').hide();
    // callForDashboardData('formIdIfAny','payment-history-content?moduleId='+moduleId+'&userId=');
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "graduation-ceremony-attendees") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "conflicted-user-list") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
    // callForDashboardData(
    //   "formIdIfAny",
    //   "conflicted-user-content?moduleId=" + moduleId+"&themeType=theme2"
    // );
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
    getContent(moduleId, pageNo, replaceDiv, extraParam);
    // callForDashboardData(
    //   "formIdIfAny",
    //   "delete-user-content?moduleId=" + moduleId + "&username=&themeType=theme2"
    // );
  } else if (pageNo == "maintenance-down-message") {
    
    callForDashboardData(
      "formIdIfAny",
      "maintenance-down-message?moduleId=" + moduleId+ "&username=&themeType=theme2"
    );
  } else if (pageNo == "20") {
    callForDashboardData("formIdIfAny", "lms-user-content");
  } else if (pageNo == "manage-course") {
    callForDashboardData(
      "formIdIfAny",
      "manage-subjects-content?moduleId=" + moduleId
    );
  }else if (pageNo == "manage-batch-student") {
    callForDashboardData("formIdIfAny", "manage-batch-student?moduleId=" + moduleId+"&themeType=theme2");
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
    callForDashboardData("formIdIfAny", "reports");
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
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=student&campaign=admin&demotype=pool&clickFrom=list"
    );
  } else if (pageNo == "accept-demo-list") {
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=student&campaign=admin&demotype=accept&clickFrom=list"
    );
  } else if (pageNo == "meet-counselor") {
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=student&campaign=counselor&clickFrom=list"
    );
  } else if (pageNo == "ppc-school") {
    callForDashboardData(
      "formIdIfAny",
      "raise-demo-request-content?moduleId=" +
        moduleId +
        "&requestRaisedBy=school&demotype=&clickFrom=list"
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
      "student-weekly-progress-report?moduleId=" + moduleId
    );
  } else if (pageNo == "evaluation-test-form-details") {
    callForDashboardData(
      "formIdIfAny",
      "evaluation-test-form?moduleId=" + moduleId+"&themeType=theme2"
    );
  } else if (pageNo == "accelerated-mode") {
    callForDashboardData(
      "formIdIfAny",
      "accelerated-mode-students-details?moduleId=" + moduleId+"&themetype=theme2"
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
    //callForDashboardData("formIdIfAny", "get-modules?moduleId=" + moduleId);
     getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "modulerole") {
    //callForDashboardData("formIdIfAny", "get-roles?moduleId=" + moduleId);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "rolerights") {
    callForDashboardData(
      "formIdIfAny",
      "get-module-rights?moduleId=" + moduleId+"&themeType=theme2"
    );
  } else if (pageNo == "manage-user-list") {
    console.log(pageNo);
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
  } else if (pageNo == "school-reports" || pageNo == "reports") {
    // var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/school-data-reports?moduleId='+moduleId
    // window.open(urlSend, '_blank');
    // customLoader(false)
    var urlSend ="/dashboard/school-data-reports?moduleId=" +moduleId +"&schoolId=" + SCHOOL_ID + "&year=";
    getAsPost(urlSend);
    customLoader(false);
    //getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "flex-billing-report") {
    urlSend = "/dashboard/get-lmsbuzz-billing?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "addons-academic-year") {
    callForDashboardData( "formIdIfAny", "addons-academic-year?moduleId=" + moduleId );
  }else if (pageNo == "critical-students") {
    urlSend = "/dashboard/get-critical-students?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  }else if (pageNo == "nongrading-students") {
    urlSend = "/dashboard/get-nongrading-students?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "lead-list") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    // var leadType = "B2C";//|| USER_ROLE=="B2B_PARTNER"
    // if (USER_ROLE == "B2B_LEAD") {
    //   leadType = "B2B";
    // }
    // if(SCHOOL_TYPE=='WLP'){
    //   leadType = "B2B";
    // }
    // var urlSend =
    //   "/dashboard/lead-data-list?moduleId=" +
    //   moduleId +
    //   "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +
    //   ENCRYPTED_USER_ID +
    //   "&leadType=" +
    //   leadType;
    // getAsPost(urlSend);
    // customLoader(false);
  
    //  callForDashboardData(
    //   "formIdIfAny",
    //   "lead-list?moduleId=" +moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +leadType
    // );

    getContent(moduleId, pageNo, replaceDiv, extraParam);
    
  } else if (pageNo == "lead-assign-form") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    // var urlSend =
    //   "/dashboard/lead-assign-form?moduleId=" + moduleId + "&todayDate=";
    // getAsPost(urlSend);
    // customLoader(false);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "lead-report-list") {
    //var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/lead-data-reports?moduleId='+moduleId+'&euid='+ENCRYPTED_USER_ID
    //window.open(urlSend, '_blank');
    //customLoader(false)
    // var urlSend ="/dashboard/lead-data-reports?moduleId=" +moduleId +"&euid=" +ENCRYPTED_USER_ID;
    // getAsPost(urlSend);
    // customLoader(false);
   getContent(moduleId, pageNo, replaceDiv, extraParam);

  }else if (pageNo == "lead-setting") {
    //var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/lead-data-reports?moduleId='+moduleId+'&euid='+ENCRYPTED_USER_ID
    //window.open(urlSend, '_blank');
    //customLoader(false)
    // var urlSend ="/dashboard/lead-data-reports?moduleId=" +moduleId +"&euid=" +ENCRYPTED_USER_ID;
    // getAsPost(urlSend);
    // customLoader(false);
   getContent(moduleId, pageNo, replaceDiv, extraParam);

  }else if (pageNo == "task") {
    //var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/lead-data-reports?moduleId='+moduleId+'&euid='+ENCRYPTED_USER_ID
    //window.open(urlSend, '_blank');
    //customLoader(false)
    // var urlSend ="/dashboard/lead-data-reports?moduleId=" +moduleId +"&euid=" +ENCRYPTED_USER_ID;
    // getAsPost(urlSend);
    // customLoader(false);
   getContent(moduleId, pageNo, replaceDiv, extraParam);

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
  } else if (pageNo == "teacher-manage-slot") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-manage-class-time?moduleId=" + moduleId
    );
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
    var urlSend =
      CONTEXT_PATH +
      UNIQUEUUID +
      "/dashboard/teacher-class-review/" +
      SCHOOL_UUID +
      "?moduleId=" +
      moduleId;
    window.open(urlSend, "_blank");
    customLoader(false);
  } else if (pageNo == "live-classroom-status") {
    //callForDashboardData('formIdIfAny','lead-list?moduleId='+moduleId+'&leadFrom=LEAD&clickFrom=list&currentPage=0');
    var urlSend =
      CONTEXT_PATH +
      UNIQUEUUID +
      "/dashboard/live-classroom-status/" +
      SCHOOL_UUID;
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
  }else if (pageNo == "lead-calculation-chart") {
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

    // var urlSend =
    //   "/dashboard/orientation-assign-form?moduleId=" +
    //   moduleId +
    //   "&schoolId=" +
    //   SCHOOL_ID +
    //   "&todayDate=";
    // getAsPost(urlSend);
    // customLoader(false);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "student-orientation-list") {
    // var urlSend = CONTEXT_PATH+UNIQUEUUID+'/dashboard/student-orientation-list?moduleId='+moduleId;
    // window.open(urlSend, '_blank');
    // customLoader(false)

    // var urlSend = "/dashboard/student-orientation-list?moduleId=" + moduleId;
    // getAsPost(urlSend);
    // customLoader(false);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }
  // else if (pageNo == "teacher-manage-slot") {
  //   callForDashboardData(
  //     "formIdIfAny",
  //     "teacher-manage-slot-availability?moduleId=" + moduleId
  //   );
  // }
  else if (pageNo == "teacher-time-dashboard") {
    var urlSend = "/report/teacher-time-dashboard?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
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
  }else if (pageNo == "lead-demo-list") {
    
    // var urlSend = "/dashboard/lead-demo-list?moduleId=" + moduleId;
    // getAsPost(urlSend);
    // customLoader(false);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "academic-year-date-settings") {
    callForDashboardData(
      "formIdIfAny",
      "academic-year-date-settings?moduleId=" + moduleId
    );
  }else if (pageNo == "extra-session-details") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "extra-session-details?moduleId=" + moduleId
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }
  else if (pageNo == "counselor-daily-report") {
    //getContent(moduleId, pageNo, replaceDiv, extraParam);
    var urlSend ="/dashboard/counselor-daily-report?moduleId=" + moduleId +"&userId=" + USER_ID;
    getAsPost(urlSend);
  }


  //Student - left-side
  else if (pageNo == "student-home") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "student-login-details") {
    callForDashboardData("formIdIfAny", "attendance-content" + extraParam);
  } else if (pageNo == "syllabus-assigned-teacher") {
    callForDashboardData(
      "formIdIfAny",
      "student-task-content?moduleId=" + moduleId
    );
  } else if (pageNo == "book-a-session") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
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
    renderBuyExtraClasses(USER_ID);
  } else if (pageNo == "01addonfee") {
    callForDashboardData("formIdIfAny", "student-session-content");
  } else if (pageNo == "notifications" || pageNo == "parent-notifications") {
    callForDashboardData("formIdIfAny", "notifications" + args);
  } else if (pageNo == "syllabus-assigned-batch-teacher") {
    callForDashboardData(
      "formIdIfAny",
      "student-batch-teacher-content?moduleId=" + moduleId
    );
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
    if (extraParam != undefined) {
      callForDashboardData(
        "formIdIfAny",
        "student-progress-report/" +
          UNIQUEUUID +
          "?moduleId=" +
          moduleId +
          extraParam
      );
    } else {
      callForDashboardData(
        "formIdIfAny",
        "student-progress-report/" + UNIQUEUUID + "?moduleId=" + moduleId
      );
    }
  } else if (pageNo == "auto-progress-report") {
    // callForDashboardData(
    //   "formIdIfAny",
    //   "auto-weekly-progress-report?moduleId=" + moduleId
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam);
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
  }

  //Teacher
  else if (pageNo == "teacher-home") {
    //callForDashboardData("formIdIfAny", "teacher-content");
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "assigned-courses") {
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
    showAndHideDashboardAndAdditionalContent("additional");
    callForDashboardData(
      "formIdIfAny",
      "teacher-create-session-content?moduleId=" + moduleId
    );
    window.setTimeout(function () {
      getContent(moduleId, pageNo, replaceDiv, extraParam);
    }, 4000);
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
  }else if (pageNo == "set-teacher-comp") {
    callForDashboardData(
      "formIdIfAny",
      "set-teacher-compensation?moduleId=" + moduleId
    );
  } else if (pageNo == "student-assigned-report") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "class-management") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-class-management?moduleId=" + moduleId
    );
  } else if (pageNo == "monthly-pay-slip") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-monthly-pay-slip/" + UNIQUEUUID + extraParam
    );
  } else if (pageNo == "schedule-a-session") {
    // callForDashboardData('formIdIfAny', 'teacher-create-session-content?moduleId=' + moduleId);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "offline-classes") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "teacher-my-performance") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-my-performance?moduleId=" + moduleId
    );
  } else if (pageNo == "teacher-rating") {
    callForDashboardData("formIdIfAny", "teacher-rating?moduleId=" + moduleId);
  } else if (pageNo == "teacher-student-performance") {
    callForDashboardData(
      "formIdIfAny",
      "teacher-student-performance?moduleId=" + moduleId
    );
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
  }else if (pageNo == "onboarded-teacher-list") {
    // getContent(moduleId, pageNo, replaceDiv, extraParam);
    var urlSend = "/dashboard/onboarded-teacher-list?moduleId=" + moduleId;
    getAsPost(urlSend);
    customLoader(false);
  } else if (pageNo == "teacher-recurring-classes-list") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo === "meeting-management") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "email-logs") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "email-status") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "wati-numbers") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "withdrawn-request-list") {
    callForDashboardData(
      "formIdIfAny",
      "withdrawn-request-list?moduleId=" + moduleId + "&currentPage=0",
      replaceDiv
    );
  }

  //Parent
  else if (pageNo == "parent-student-home") {
    // callForDashboardData('formIdIfAny', 'parent-content?moduleId=' + moduleId);
  } else if (pageNo == "parent-student-login-details") {
    callForDashboardData("formIdIfAny", "attendance-content" + extraParam);
  } else if (pageNo == "parent-syllabus-assigned-teacher") {
    // callForDashboardData('formIdIfAny', 'parent-student-task-content?moduleId=' + moduleId);
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
    // callForDashboardData(
    //   "formIdIfAny",
    //   "counselor-content?moduleId=" + moduleId
    // );
    getContent(moduleId, pageNo, replaceDiv, extraParam);
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

  //B2B Partner
  else if (pageNo == "partner-dashboard" || pageNo == "partner-enrollment-list" || pageNo == "counselor-enrollment-list" || pageNo == "add-student-enrollment") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "admin-partner-enrollment-list") {
    // var urlSend =
    //   "/dashboard/admin-partner-enrollment-list?moduleId=" + moduleId;
    // getAsPost(urlSend);
    // customLoader(false);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "partner-school-payment") {
    // var urlSend ="/dashboard/get-partner-school-payment?moduleId=" + moduleId;
    // getAsPost(urlSend);
    // customLoader(false);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  }else if (pageNo == "partner-enrollment-students-wlp") {
    // var urlSend ="/dashboard/get-partner-enrollment-students?moduleId=" + moduleId;
    // getAsPost(urlSend);
    getContent(moduleId, pageNo, replaceDiv, extraParam);
    customLoader(false);
  }else if (pageNo == "referral-and-links") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
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
  } else if (pageNo == "teacher-assign-interview") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "teacher-screening-profiles") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "dashboard-monitoring") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "user-screening-profiles") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "partner-fee-structure") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else if (pageNo == "add-sub-partner") {
    getContent(moduleId, pageNo, replaceDiv, extraParam);
  } else {
    customLoader(false);
  }
}

function callSchoolInneraction(actionType, arg0, replaceDiv, roleModuleId) {
  //customLoader(true);
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
      "edit-profile-content?userId=" + arg0 + "&moduleId=" + roleModuleId+"&themetype=theme2"
    );
  } else if (actionType == "edit-user") {
    callForDashboardData("formIdIfAny", "create-user-edit?userId=" + arg0);
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
    //callForDashboardData("formIdIfAny", "delete-user-content?username=" + arg0+"&themeType=theme2");
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
  } else if (actionType == "1a") {
    callForDashboardData("formIdIfAny",
      "profile-view-content?userId=" + arg0 + "&actionType=" + actionType + "&moduleId=" +roleModuleId+"&themeType=theme2"
    );
  } else if (actionType == "attendance") {
    callForDashboardData("formIdIfAny", "attendance-content" + arg0);
  } else if (actionType == "subjectsession") {
    callForDashboardData(
      "formIdIfAny",
      "student-subject-session?subjectId=" + arg0 + "&moduleId=" + roleModuleId
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
  hideMessageTheme2("");
  if (!validateRequestForSubmitTask(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "task-submit"),
    data: JSON.stringify(getRequestForSubmitTask(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#" + formId)[0].reset();
        $("#" + formId + " #schoolId option:selected").val(1);
      }
      return false;
    }
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
  hideMessageTheme2("");
  if (!validateRequestForSubmitSet(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "question-set-submit"),
    data: JSON.stringify(getRequestForSubmitSet(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#teacherQuestionModal").modal("hide");
        $("#" + formId)[0].reset();
        setTimeout(function () {
          callDashboardPageSchool(0, "14");
        }, 1000);
      }
      return false;
    }
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
   showMessageTheme2(0, "Set Name is required.");
    return false;
  }
  if ($("#setTitle").val() == undefined || $("#setTitle").val().trim() == "") {
   showMessageTheme2(0, "Set Title is required.");
    return false;
  }
  if (
    $("#standardId").val() == undefined ||
    $("#standardId").val() == "" ||
    $("#standardId").val() == 0
  ) {
   showMessageTheme2(0, "Standard is required.");
    return false;
  }
  if (
    $("#subjectId").val() == undefined ||
    $("#subjectId").val() == "" ||
    $("#subjectId").val() == 0
  ) {
   showMessageTheme2(0, "Course Name is required.");
    return false;
  }
  return true;
}

function submitQuestionAnswer(formId, moduleId) {
  hideMessageTheme2("");
  if (!validateRequestForSubmitQuestion(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "question-answer-submit"),
    data: JSON.stringify(getRequestForSubmitQuestion(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
        $("#questionAnsModel").modal("hide");
       showMessageTheme2(1, data["message"]);
        //	$('#'+formId)[0].reset();
        setTimeout(function () {
          //var params = $("#setName1").val()+','+$("#setId").val();
          //callSchoolInneraction('3set',params);
        }, 1000);
      }
      return false;
    }
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
     showMessageTheme2(0, "please add question");
      return false;
    }
  }

  if ($("#option1").val() == null || $("#option1").val().trim() == "") {
   showMessageTheme2(0, "option 1 is required.");
    return false;
  }
  if ($("#option2").val() == null || $("#option2").val() == "") {
   showMessageTheme2(0, "option 2 is required.");
    return false;
  }
  if ($("#option3").val() == null || $("#option3").val() == "") {
   showMessageTheme2(0, "option 3 is required.");
    return false;
  }
  if ($("#option4").val() == null || $("#option4").val() == "") {
   showMessageTheme2(0, "option 4 is required.");
    return false;
  }
  if ($("#correctAns").val() == 0 || $("#correctAns").val() == "") {
   showMessageTheme2(0, "correct answer is required.");
    return false;
  }
  return true;
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
   showMessageTheme2(0, "Please select Meeting Date");
    return false;
  }
  if (
    $("#" + formId + " #startTime").val() == null ||
    $("#" + formId + " #startTime").val() == ""
  ) {
   showMessageTheme2(0, "Please select Start Time");
    return false;
  }
  if (
    $("#" + formId + " #timeInterval").val() == null ||
    $("#" + formId + " #timeInterval").val() == 0
  ) {
   showMessageTheme2(0, "Please select Time Interval");
    return false;
  }
  return true;
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
     showMessageTheme2(0, "Please select Meeting Date");
      return false;
    }
    if (
      $("#" + formId + " #startTime").val() == null ||
      $("#" + formId + " #startTime").val() == ""
    ) {
     showMessageTheme2(0, "Please select Start Time");
      return false;
    }
    if (
      $("#" + formId + " #timeInterval").val() == null ||
      $("#" + formId + " #timeInterval").val() == 0
    ) {
     showMessageTheme2(0, "Please select Time Interval");
      return false;
    }
  }
  return true;
}

function submitMeetingSlots(formId, moduleId, roleModuleId) {
  hideMessageTheme2("");
  if (!validateRequestForSubmitMeetingTeacherSlots(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "meetingslots-submit"),
    data: JSON.stringify(
      getRequestForSubmitMeetingTeacherSlots(formId, moduleId)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#meetingSlotsModal").modal("toggle");
        $("#" + formId)[0].reset();
        $("body").removeClass("modal-open");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "teacher-interview-slot");
        }, 1000);
      }
      return false;
    }
  });
}


function submitSyllabus(formId, moduleId) {
  hideMessageTheme2("");
  if (!validateRequestForSubmitSyllabus(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "syllabus-submit"),
    data: JSON.stringify(getRequestForSubmitSyllabus(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#" + formId)[0].reset();
        $("#currentSyllabus").find("a").trigger("click");
      }
      return false;
    }
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
  authentication["userId"] = USER_ID;//$("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["requestData"] = requestData;
  return request;
}

// function submitTeacherAgreement(formId, moduleId, roleModuleId, saveType) {
//   if (roleModuleId == "" || roleModuleId == undefined) {
//     roleModuleId = $("#userId").val();
//   }
//   hideMessageTheme2("");
//   if ($("#" + formId + " #agreementRefNumber").val() == "") {
//    showMessageTheme2(0, "Reference number is required");
//     return false;
//   }
//   if ($("#" + formId + " #agreementDate").val() == "") {
//    showMessageTheme2(0, "Agreement date is required");
//     return false;
//   }

//   if ($("#" + formId + " #employeeType").val() == "") {
//    showMessageTheme2(0, "Employment Type is required");
//     return false;
//   }
//   if ($("#" + formId + " #typeOfTeacher").val() == "") {
//    showMessageTheme2(0, "Type of Teacher is required");
//     return false;
//   }
//   if ($("#" + formId + " #teacherDesignation").val() == "") {
//    showMessageTheme2(0, "Teacher Designation is required");
//     return false;
//   }
//   if ($("#" + formId + " #teacherDepartment").val() == "") {
//    showMessageTheme2(0, "Teacher Department is required");
//     return false;
//   }
//   if ($("#" + formId + " #employeeType").val() == "Full-Time") {
//     if ($("#" + formId + " #workingHours").val() == "") {
//      showMessageTheme2(0, "Working Hours per Week is required");
//       return false;
//     }
//     if ($("#" + formId + " #payOut").val() == "") {
//      showMessageTheme2(0, "Pay Out is required");
//       return false;
//     }
//   }
//   if (editor1.getData() == "") {
//    showMessageTheme2(0, "Agreement content is required");
//     return false;
//   }
//   var actualURL = "";
//   // if(DEPLOYMENT_MODE=='PROD'){
//   // 	actualURL='http://34.225.54.254:8080/edueye/'+UNIQUEUUID+'/api/v1/dashboard/submit-teacher-agreement-content';
//   // }else{
//   actualURL = getURLFor("dashboard", "submit-teacher-agreement-content");
//   // }
//   $.ajax({
//     type: "POST",
//     contentType: "application/json",
//     url: actualURL,
//     data: JSON.stringify(
//       getRequestForSubmitTeacherAgreement(formId, moduleId, saveType)
//     ),
//     dataType: "json",
//     cache: false,
//     timeout: 600000,
//     success: function (data) {
//       if (data["status"] == "0" || data["status"] == "2") {
//        showMessageTheme2(0, data["message"]);
//       } else {
//        showMessageTheme2(1, data["message"]);
//         if (
//           formId == "interviewApprovalId" ||
//           formId == "teacherEditAgreement"
//         ) {
//           $("#interviewApprovalModal").modal("hide");
//           $("#teacherAgreementModal").modal("hide");
//           $("#" + formId)[0].reset();
//           //						setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'pending-interview-remarks'); }, 1000);
//         } else if (formId == "profileApprovalId") {
//           $("#profileApprovalModal").modal("hide");
//           $("#" + formId)[0].reset();
//           //setTimeout(function(){ callDashboardPageSchool(roleModuleId, 'teacher-profile'); }, 1000);
//         }
//         var userId = $("#profileApprovalId #userId").val();
//         $("#profileId_" + userId).remove();
//       }
//       return false;
//     },
//     error: function (e) {
//       //showMessageTheme2(true, e.responseText);
//       return false;
//     },
//   });
// }



function submitSlot(formId, moduleId) {
  hideMessageTheme2("");
  if (!validateRequestForSubmitSlot(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "slot-submit"),
    data: JSON.stringify(getRequestForSubmitSlot(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#" + formId)[0].reset();
        $("#enabledDateModal").modal("toggle");
        setTimeout(function () {
          callDashboardPageSchool("18a");
        }, 1000);
      }
      return false;
    }
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
  hideMessageTheme2("");
  if (!validateRequestForSubmitTrvlSlot(formId, moduleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "travel-Visit-detail-submit"),
    data: JSON.stringify(getRequestForSubmitTrvlSlot(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#" + formId)[0].reset();
        callSchoolInneraction("6f", "2");
      }
      return false;
    }
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

function getAllEmailsForStudentRole() {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(getRequestForMaster("formId", "EMAIL_LIST", "asda")),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
        var data = data["mastersData"]["emailList"];
        $.each(data, function (key, val) {
          emailList.push(val.value);
        });
      }
      return false;
    }
  });
}
 


function validateRequestForSubmitSyllabus(formId, moduleId) {
  return true;
}
function callForLMSUserSignUp(formId, moduleId, roleModuleId) {
  hideMessageTheme2("");
  $("#lmsUserForm").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForSignup("create-lms-user", moduleId),
    data: JSON.stringify(getRequestForLMSUserSignup(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(0, data["message"]);
        $("#lmsUserModal1").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-lms-user");
        }, 1000);
      }
      $("#lmsUserForm").prop("disabled", false);
      return false;
    }
  });
}
function changeLmsUserPassword(formId, moduleId, roleModuleId) {
  hideMessageTheme2("");
  $("#lmsUserForm").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForSignup("change-lms-user-password", moduleId),
    data: JSON.stringify(getRequestForLMSPasswordChange(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(0, data["message"]);
        $("#lmsChangePasswordModal1").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-lms-user");
        }, 1000);
      }
      $("#lmsUserForm").prop("disabled", false);
      return false;
    }
  });
}

function getRequestForLMSUserSignup(formId, moduleId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var lmsUserInfoDTO = {};
  //lmsUserInfoDTO['userEmail'] = $("#"+formId+" #userEmail").val();
  lmsUserInfoDTO["userId"] = $("#" + formId + " #userId1").val();
  lmsUserInfoDTO["lmsUserName"] = escapeCharacters(
    $("#" + formId + " #lmsUserName").val()
  );
  lmsUserInfoDTO["password"] = $("#" + formId + " #password").val();
  lmsUserInfoDTO["confirmPassword"] = $(
    "#" + formId + " #confirmPassword"
  ).val();
  lmsUserInfoDTO["lmsRegNumber"] = $("#" + formId + " #lmsRegNumber").val();
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
  lmsUserInfoDTO["userId"] = $("#" + formId + " #userId1").val();
  lmsUserInfoDTO["lmsRegNumber"] = $("#" + formId + " #lmsRegNumber").val();
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



function approveSubject(formId, moduleId, isApproved, subjectId) {
  hideMessageTheme2("");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "approve-subjects"),
    data: JSON.stringify(
      getRequestForApproveSubject(formId, moduleId, isApproved, subjectId)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(0, data["message"]);
        callSchoolInneraction("22a", $("#schoolId").val());
      }
      return false;
    }
  });
}
function callForSubjectApproval(formId) {
  hideMessageTheme2("");
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
         showMessageTheme2(0, stringMessage[1]);
        } else {
         showMessageTheme2(0, stringMessage[1]);
          $("#travelDataModal").modal("hide");
          //callSchoolInneraction('6f',$('#sortById').val());
        }
        return false;
      }
    }
  });
}

function validateRequestForApprovalSubject() {
  if ($("#status").val() == "0" || $("#status").val() == null) {
   showMessageTheme2(1, "please select status");
    return false;
  }
  if ($("#remarks").val() == "" || $("#remarks").val() == null) {
   showMessageTheme2(1, "Remarks is required");
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


function savePlacementCourse(formId, moduleId, courseId, isForDelete) {
  hideMessageTheme2("");
  if (!validateRequestForAddPlacementCourse(formId, isForDelete)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "placement-save-course-details"),
    data: JSON.stringify(
      getRequestForSavePlacementCourse(formId, moduleId, courseId, isForDelete)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(0, data["message"]);
        $("#courseInfoModal").modal("hide");
        setTimeout(function () {
          return callDashboardPageSchool("30");
        }, 1000);
      }
      return false;
    }
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
   showMessageTheme2(0, "Please choose grade.");
    return false;
  }
  if ($("#" + formId + " #courseName").val() == "" && isForDelete != "Y") {
   showMessageTheme2(0, "Please enter category name.");
    return false;
  }
  if ($("#" + formId + " #orderId").val() == "" && isForDelete != "Y") {
   showMessageTheme2(0, "Please set order.");
    return false;
  }
  if ($("#" + formId + " #creditId").val() == "0.0" && isForDelete != "Y") {
   showMessageTheme2(0, "Please set credit limit.");
    return false;
  }
  return true;
}


function callCourseListBySubjectId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra,
  requestExtra1
) {
  hideMessageTheme2("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select course");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId).val(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
       showMessageTheme2(0, data["message"]);
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
    }
  });
}

function callPlacementCourseListByStandardId(
  formId,
  value,
  elementId,
  toElementId,
  requestExtra
) {
  hideMessageTheme2("");
  resetDropdown($("#" + formId + " #" + toElementId), "Select Category");
  if (!validateRequestForMasterGrade(formId, elementId)) {
    $("#" + formId + " #" + elementId).val(0);
    //resetDropdown($("#"+formId+" #"+elementId), 'Select course');
    return false;
  }
  //$("#"+formId+" #pastTaughtSubjectId").prop("disabled", true);
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
       showMessageTheme2(0, data["message"]);
      } else {
        buildDropdown(
          data["mastersData"]["courseList"],
          $("#" + formId + " #" + toElementId),
          "Select course"
        );
        $("#" + formId + " #courseId").prop("disabled", false);
      }
    }
  });
}




function sendMailRequestDemo(formId, moduleId, roleModuleId) {
  hideMessageTheme2("");
  if (!validateRequestForRaiseRequestDemo(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "send-demo-request-mail"),
    data: JSON.stringify(getRequestForRaiseDemoRequest(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
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
    }
  });
}
function validateRequestForRaiseRequestDemo() {
  if ($("#email").val() == "" || $("#email").val() == null) {
   showMessageTheme2(0, "Email is required");
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
  hideMessageTheme2("");
  if (!validateRequestForLMSStudentPerformance(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForSignup("save-lmsStudent-Performance", moduleId),
    data: JSON.stringify(getRequestForLMSStudentPerformance(formId, moduleId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#lmsStudentContentModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "lms-student-performance");
        }, 1000);
      }
      return false;
    }
  });
}
function validateRequestForLMSStudentPerformance() {
  if ($("#studentName").val() == "" || $("#studentName").val() == null) {
   showMessageTheme2(0, "Student Name  is required");
    return false;
  }
  if ($("#studentEmail").val() == "" || $("#studentEmail").val() == null) {
   showMessageTheme2(0, "Student Email is required");
    return false;
  }
  if ($("#teacherName").val() == "" || $("#teacherName").val() == null) {
   showMessageTheme2(0, "Teacher Name is required");
    return false;
  }
  if ($("#teacherEmail").val() == "" || $("#teacherEmail").val() == null) {
   showMessageTheme2(0, "Teacher Email is required");
    return false;
  }
  if ($("#courseProvider").val() == "0" || $("#courseProvider").val() == null) {
   showMessageTheme2(0, "Please select LMS Platform");
    return false;
  }
  if ($("#subjectEventId").val() == "0" || $("#subjectEventId").val() == null) {
   showMessageTheme2(0, "Please select course type");
    return false;
  }
  if (
    $("#subjectEventId").val() == "CR" ||
    $("#subjectEventId").val() == "FT"
  ) {
    if ($("#standardId").val() == "0" || $("#standardId").val() == null) {
     showMessageTheme2(0, "Grade is required");
      return false;
    }
    if ($("#subjectId").val() == "0" || $("#subjectId").val() == null) {
     showMessageTheme2(0, "Course is required");
      return false;
    }
  }
  if ($("#subjectEventId").val() == "AP") {
    if (
      $("#placementStandardId").val() == "0" ||
      $("#placementStandardId").val() == null
    ) {
     showMessageTheme2(0, "Grade is required");
      return false;
    }
    if (
      $("#placementSubjectId").val() == "0" ||
      $("#placementSubjectId").val() == null
    ) {
     showMessageTheme2(0, "Course is required");
      return false;
    }
  }
  if ($("#status").val() == "0" || $("#status").val() == null) {
   showMessageTheme2(0, "Please select status");
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



function getCourseByGradeAndCourseId(formId) {
  hideMessageTheme2("");
  gradeId = $("#" + formId + " #standardId").val();
  courseId = $("#" + formId + " #courseId option:selected").attr("parentid");
  $.ajax({
    type: "GET",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor(
      "school",
      "get-course-by-grade-and-course-id/" + gradeId + "/" + courseId
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
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
    }
  });
}
function getCourseForPlacement(formId) {
  hideMessageTheme2("");
  courseId = $("#" + formId + " #courseId").val();
  $.ajax({
    type: "GET",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "get-course-for-placement/" + courseId),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
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
    }
  });
}

function callCommentModel(meetingId, meetingResult, requestDemoId, comment) {
  $("#addComentsModal").modal("show");
  $("#addComentsId #requestDemoId").val(requestDemoId);
  $("#addComentsId #meetingId").val(meetingId);
  $("#addComentsId #comment").val(comment);
  $("#addComentsId #meetingResult").val(meetingResult);
  $("#addComentsId #meetingResult").removeAttr("disabled");
  $("#addComentsId #comment").removeAttr("disabled");
  $("#addComentsId #sendCommentMail").show();
  $("#addComentsId #note").show();
  if (meetingResult != "") {
    $("#addComentsId #note").hide();
    $("#addComentsId #meetingResult").attr("disabled", true);
    $("#addComentsId #comment").attr("disabled", true);
    $("#addComentsId #sendCommentMail").hide();
  }
}
function sendMailForMeetCounselor(formId, roleModuleId) {
  if (
    $("#" + formId + " #meetingResult").val() == undefined ||
    $("#" + formId + " #meetingResult").val() == ""
  ) {
   showMessageTheme2(0, "Please select meeting status.");
    return false;
  }

  if (
    $("#" + formId + " #comment").val() == undefined ||
    $("#" + formId + " #comment").val() == ""
  ) {
   showMessageTheme2(0, "Comment is required");
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "send-mail-for-meet-counselor"),
    data: JSON.stringify(getRequestForsendMailForMeetCounselor(formId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#addComentsModal").modal("hide");
        $("#" + formId)[0].reset();
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "request-demo");
        }, 1000);
      }
      return false;
    }
  });
}
function getRequestForsendMailForMeetCounselor(formId) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var meetCounselorMailDTO = {};

  meetCounselorMailDTO["meetingId"] = $("#" + formId + " #meetingId").val();
  meetCounselorMailDTO["requestDemoId"] = $(
    "#" + formId + " #requestDemoId"
  ).val();
  meetCounselorMailDTO["comment"] = escapeCharacters(
    $("#" + formId + " #comment").val()
  );
  meetCounselorMailDTO["meetingResult"] = $(
    "#" + formId + " #meetingResult"
  ).val();

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
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "save-courseProvider-details"),
    data: JSON.stringify(
      getRequestForSaveCourseProvider(formId, controllType, providerId, status)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-course-provider");
        }, 1000);
      }
      return false;
    }
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
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForHTML("gotomeeting", "createUser"),
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
         if (data["status"] == "0" || data["status"] == "2") {
            showMessageTheme2(0, data["message"]);
         }else{
            showMessageTheme2(1, data["message"]);
            if ("teacherPage" == callFrom) {
              setTimeout(function () {
                callDashboardPageSchool(moduleId, "approved-teachers");
              }, 1000);
            } else {
              setTimeout(function () {
                callDashboardPageSchool(moduleId, "user-list");
              }, 1000);
            }
         }
        
      }
    });
  } else {
    $.ajax({
      type: "POST",
      contentType: APPLICATION_JSON_VALUE,
      url: getURLForHTML("gotomeeting", "update-goto-meeting-user"),
      data: JSON.stringify({ gotoMeetingUserId: gotoMeetingId }),
      dataType: "json",
      success: function (data) {

        if (data["status"] == "0" || data["status"] == "2") {
            showMessageTheme2(0, data["message"]);
         }else{
            showMessageTheme2(1, data["message"]);
            if ("teacherPage" == callFrom) {
              setTimeout(function () {
                callDashboardPageSchool(moduleId, "approved-teachers");
              }, 1000);
            } else {
              setTimeout(function () {
                callDashboardPageSchool(moduleId, "user-list");
              }, 1000);
            }
          }
      }
    });
  }
}




function getSchoolTourData(formId) {
  $("#errMsg").text("");
  var reportStartDate = $("#startDate").val();
  var reportEndDate = $("#endDate").val();
  if (reportStartDate == "") {
   showMessageTheme2(0, "Report start date required");
    return false;
  }
  if (reportEndDate == "") {
   showMessageTheme2(0, "Report end date required");
    return false;
  }

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "/report/live-online-school-tour"),
    data: JSON.stringify({
      reportStartDate: reportStartDate,
      reportEndDate: reportEndDate,
    }),
    dataType: "json",
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        $("#errMsg").text(data["message"]);
        $("body,html").animate(
          { scrollTop: $("#errMsg").offset().top - 70 },
          800
        );
      } else {
        $("#errMsg").text(data["message"]);
        $("body,html").animate(
          { scrollTop: $("#errMsg").offset().top - 70 },
          800
        );
      }
      return false;
    },
  });
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
    contentType: APPLICATION_JSON_VALUE,
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
            showMessageTheme2(1, stringMessage[1], "", false);
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
        showMessageTheme2(0, e.responseText, "", false);
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
    contentType: APPLICATION_JSON_VALUE,
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
            showMessageTheme2(0, stringMessage[1], "", false);
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
        showMessageTheme2(0, e.responseText, "", false);
      }
    },
  });
}

function advanceRequestDemoSearch(formId, moduleId) {
  hideMessageTheme2("");

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
            showMessageTheme2(0, stringMessage[1], "", false);
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
  hideMessageTheme2("");
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
        showMessageTheme2(0, data["message"], "", false);
      } else {
        showMessageTheme2(1, data["message"], "", false);
      }
      return false;
    }
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



function getStateWiseData(moduleId, schoolId, countryName, year) {
  hideMessageTheme2("");

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
            showMessageTheme2(0, stringMessage[1], "", false);
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





function changeJoiningType(formId, toElement) {
  if ($("#" + formId + " #joiningType").val() == "Multiple") {
    $("#" + formId + " #" + toElement).val("");
  }
}




function createIframe(soruceUrl){
	var iframe = document.createElement('iframe');
	iframe.src = soruceUrl;
	return iframe;
}



//  <div class="full text-center mt-2">
// 			<button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">Close</button>
// 	</div>

 

function AdminTaskModalWarnings(response){
	var html=`<div id="classJoinWaringDiv">
		<div id="classWaringMessage" class="full text-center my-4">
			<h5>You can start your admin task now...</h5><br/>`
           if(response.meetingId && response.meetingPasscode && response.meetingId!='' && response.meetingPasscode!=''){
            html+=`<h6>If you are having issues with redirection to the class, please join with the credentials given below. </h6>
            <h5> Meeting ID : ` + response.meetingId + '<br/>  Meeting Passcode : ' + response.meetingPasscode + `</h6>
            <div class="copy-msg font-size-lg mb-2"></div>`;
           }
             html+=`<b class="copy-msg-0 text-success"></b></br>
             <a target="_blank" id="classJoinWaring" href="`+response.canJoindateStart+`" onclick="autodiposeModel('classJoinInSameWindowModal')" class="btn btn-primary font-size-lg">Join Now</a>
             <button class="btn btn-success font-size-lg" onclick="copyURL('copyURL0','copy-msg-0')"><i class="fa fa-copy"></i>&nbsp;Copy Link</button>
		  </div>
    <div class="position-absolute" style="top:0;left:0;">
      <input type="text" id="copyURL0" value="`+response.canJoindateStart+`" style="opacity:0;height:0px">
    </div>
		<div class="full text-center mt-2">
			<button type="button" class="btn btn-outline-dark font-size-lg" data-dismiss="modal">Close</button>
		</div>
	</div>`;
	return html;
 }


