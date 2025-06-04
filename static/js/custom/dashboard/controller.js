function getContent(moduleId, pageNo, replaceDiv, extraParam) {
  customLoader(false);
  roleAndModule = getUserRights(
    SCHOOL_ID_OF_USER,
    USER_ROLE_ID,
    USER_ID,
    moduleId
  );
  if (pageNo == "student-teacher-sessions") {
    $("#dashboardContentInHTML").html(
      getManageSessionContent(
        "Manage Classes",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    $("#classJoinInSameWindowModal").remove();
    $("body").append(calendarMeetingLinkValidate());
    $(".filterDates").datepicker("destroy");
    $(".filterDates").datepicker({
      autoclose: true,
      format: "M dd, yyyy",
    });
    $("#dashboardContentInHTML").append(
      getUpdateMeetingResultModal(roleAndModule, USER_ROLE)
    );
    $("#dashboardContentInHTML").append(
      getMeetingUrlModal(roleAndModule, USER_ROLE)
    );
    $("#dashboardContentInHTML").append(
      getSendMailModal(roleAndModule, USER_ROLE)
    );
    $("#dashboardContentInHTML").append(
      getPublicRecordModal(roleAndModule, USER_ROLE)
    );
    $("#dashboardContentInHTML").append(
      getRevokeModal(roleAndModule, USER_ROLE)
    );
    getSessionMasterList("classroomSessionFilter", "sessionId");
    $("#classroomSessionFilter #sessionId").select2();
  } else if (pageNo == "create-manage-sessions") {
    $("#dashboardContentInHTMLAdditional").html(
      getManageSessionContentTeacher(
        "All Classes",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    $(".filterDates").datepicker("destroy");
    $(".filterDates").datepicker({
      autoclose: true,
      format: "dd-mm-yyyy",
    });
    $("#dashboardContentInHTMLAdditional").append(
      getUpdateMeetingResultModal(roleAndModule, USER_ROLE)
    );
    $("#dashboardContentInHTMLAdditional").append(
      getMeetingUrlModal(roleAndModule, USER_ROLE)
    );
    $("#dashboardContentInHTMLAdditional").append(
      getSendMailModal(roleAndModule, USER_ROLE)
    );
    $("#standardId").select2({
      theme: "bootstrap4",
    });
    $("#classStatus").select2({
      theme: "bootstrap4",
      minimumResultsForSearch: Infinity,
    });
    $("#markStatus").select2({
      theme: "bootstrap4",
    });
    $("#sortBy").select2({
      theme: "bootstrap4",
      minimumResultsForSearch: Infinity,
    });
  } else if (pageNo == "manage-lms-user") {
    $("#dashboardContentInHTML").html(
      getManageLmsUserContent(
        "Manage LMS User",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    getSessionMasterList("lmsStudentFilter", "activeSession");
    $("#standardId").select2({});
    $("#standardId option[value='17']").remove();
    //		$(".filterDates").datepicker("destroy");
    $(".filterDates").datepicker({
      todayBtn: 1,
      autoclose: true,
      format: "M dd, yyyy",
      todayHighlight: true,
    });
  } else if (pageNo == "student-assigned-report") {
    $("#dashboardContentInHTML").html(
      getStudentAssignedReportContent(
        "Student Assigned Report",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    $("#dashboardContentInHTML").append(filterTeacherReportModal(SCHOOL_ID));

    $(".multiselect-dropdown").select2({});
    $(".singleSelect2-dropdown").select2({});

    $("#startDate")
      .datepicker({
        autoclose: true,
        format: "M d, yyyy",
      })
      .on("changeDate", function (selected) {
        $("#endDate").removeAttr("disabled");
        $("#endDate").datepicker("minDate", endDate);
      });
    $("#endDate")
      .datepicker({
        autoclose: true,
        format: "M d, yyyy",
      })
      .on("changeDate", function (selected) {
        studentTeacherValidDate("studentTeacherValidDate");
      });
    teacherReportByDate("studentTeacherValidDate");
    if (ENVIRONMENT == "dev") {
      $("#studentAssignedReportFilter #officialEmail").val(
        "devaleenaray@gmail.com"
      ); //FOR TESTING PURPOSES ONLY
    }
  } else if (pageNo == "manage-session") {
    $("#dashboardContentInHTML").html(
      getManageSessionUserContent(
        "Manage Enrollments",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    $("#standardId").select2({});
    $("#standardId option[value='17']").remove();
    $(".filterDates").datepicker({
      todayBtn: 1,
      autoclose: true,
      format: "M dd, yyyy",
      todayHighlight: true,
    });
    getSessionMasterList("lmsStudentFilter", "sessionId");
  } else if (pageNo == "offline-classes") {
    $("#dashboardContentInHTML").html(
      getOfflineClassContent(
        "Add Links",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    getTeacherDetails(
      "offlineClassFilter",
      "userId",
      "userIdOfflineClass",
      SCHOOL_ID
    );
  } else if (pageNo == "payment") {
    $("#dashboardContentInHTML").html(
      getManagePaymentContent(
        "Payment Details",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    getSessionMasterList("advancePaymentSearchForm", "academicSession");
    callCountries("advancePaymentSearchForm", "", "countryId");
    if (SCHOOL_ID == 4 || SCHOOL_ID == 5) {
      $("#gradeId option[value=9]").remove();
      $("#gradeId option[value=10]").remove();
    }
    $("#advSerch .modal-body .multiselect-dropdown").select2({
      placeholder: "Select an option",
      dropdownParent: "#advSerch .modal-body",
      minimumResultsForSearch: Infinity,
    });
    $("#paymentType1").on("change", function () {
      if ($(this).val() == "REGISTRATION_FEE_ADV") {
        $("#addStudentPaymentForm #paymentName1").val(
          "Reserve a Seat for Next Grade"
        );
        $("#addStudentPaymentForm #paymentName1").prop("disabled", true);
      } else {
        $("#addStudentPaymentForm #paymentName1").val("");
        $("#addStudentPaymentForm #paymentName1").prop("disabled", false);
      }
    });
    $("#addPaymentModal .modal-body .multiselect-dropdown")
      .select2({
        placeholder: "Select an option",
        dropdownParent: "#addPaymentModal .modal-body",
        minimumResultsForSearch: Infinity,
      })
      .on("change", function () {
        if ($(this).attr("id") == "status1" && $(this).val() == "SCHEDULED") {
          $("#paymentDate1").val("").datepicker("update");
          $("#paymentDate1").prop("disabled", true);
          $(".hideWhenStatusScheduled").hide();
        } else {
          $("#paymentDate1").prop("disabled", false);
          $(".hideWhenStatusScheduled").show();
        }
      });
    setpaymentDateFrom();
    setpaymentDateTo();
    initEditor(1, "descriptionDiv", "Put description if any", false);
    $("#paymentDate1").datepicker({
      autoclose: true,
      endDate: new Date(),
      format: "mm-dd-yyyy",
      disableTouch: false,
    });
    $("#scheduleDate1").datepicker({
      startDate: new Date(),
      autoclose: true,
      format: "mm-dd-yyyy",
      disableTouch: false,
    });
  } else if (pageNo == "user-leave") {
    $("#dashboardContentInHTML").html(
      getManageLeaveContent(
        "User Leave",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE,
        false
      )
    );
    $("#teacherLeaveTable").dataTable();
    $("#leaveDates").datepicker({
      //autoclose: true,//
      startDate: new Date(),
      multidate: true,
      format: "M dd, yyyy",
      container: "#leaveFromModal .modal-body",
    });
    getUserLeaveData(USER_ID, USER_ID);
  } else if (pageNo == "manage-leave") {
    $("#dashboardContentInHTML").html(
      getManageLeaveContent(
        "Manage Leave",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE,
        false
      )
    );
    $("#teacherLeaveTable").dataTable();
    $("#leaveDates").datepicker({
      //autoclose: true,//
      startDate: new Date(),
      multidate: true,
      format: "M dd, yyyy",
      container: "#leaveFromModal .modal-body",
    });
    getUserLeaveData(USER_ID);
  } else if (pageNo == "email-logs") {
    $("#dashboardContentInHTML").html(getEmailLogsContent("Email Logs", false));
    $("#startDate").datepicker({
      autoclose: true,
      format: "yyyy-mm-dd",
      todayHighlight: true,
    });
    $("#endDate").datepicker({
      autoclose: true,
      format: "yyyy-mm-dd",
      todayHighlight: true,
    });
  } else if (pageNo == "wati-numbers") {
    $("#dashboardContentInHTML").html(getWatiNumbersContent());
  } else if (pageNo == "email-status") {
    $("#dashboardContentInHTML").html(
      getEmailVerifyContent("Email Verification", false)
    );
  } else if (pageNo == "admin-task") {
    $("#dashboardContentInHTML").html(
      getAdminTaskContent(
        "Admin Tasks",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    getTeacherDetails(
      "adminTaskFilter",
      "userId",
      "userIdOfflineClass",
      SCHOOL_ID
    );
    $("#adminTaskFilter #userId").select2({});

    $(".filterDates").datepicker({
      todayBtn: 1,
      autoclose: true,
      format: "M dd, yyyy",
      todayHighlight: true,
    });
    getMeetingVendorUserStatus(SCHOOL_ID, USER_ID, "LENS");
  } else if (pageNo == "payment-reports") {
    customLoader(false);
  } else if (pageNo == "user-review") {
    $("#dashboardContentInHTML").html(
      getReviewContent(
        "User Review",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
    getReview(USER_ID);
  } else if (pageNo == "partner-dashboard") {
    $("#dashboardContentInHTML").html(
      renderPartnerDashboard(
        "Partner Dashboard",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
  } else if (pageNo == "partner-enrollment-list") {
    $("#dashboardContentInHTML").html(
      renderPartnerList(
        "Enrollment List",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
  } else if (pageNo == "admin-partner-enrollment-list") {
    $("#dashboardContentInHTML").html(
      renderPartnerList(
        "Enrollment List",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
  } else if (pageNo == "referral-and-links") {
    $("#dashboardContentInHTML").html(
      renderReferralCodeAndLinks(
        "Referral Code & Links",
        roleAndModule,
        SCHOOL_ID,
        USER_ID,
        USER_ROLE
      )
    );
  } else if (pageNo === "meeting-management") {
    getMeetingManagementContent("Meeting Management");
  }
}

// function getUserRights(schoolId, roleId, userId, moduleId){
// 	var data={};
//           data['schoolId']=schoolId;
//           data['roleId']=roleId;
//           data['userId']=userId;
//           data['moduleId']=moduleId;
// 	$.ajax({
// 		type : "POST",
// 		contentType : "application/json",
// 		url : getURLFor('module',''),
// 		data : JSON.stringify(data),
// 		dataType : 'json',
// 		async: false,
// 		global: false,
// 		success : function(data) {
// 			roleAndModule=data
// 		},
// 		error : function(e) {
// 			showMessage(true, e.responseText);
// 		}
// 	});
// 	return roleAndModule;
// }

function getModuleDetails(
  schoolId,
  roleId,
  userId,
  parentId,
  moduleType,
  moduleId
) {
  var data = {};
  data["schoolId"] = schoolId;
  data["roleId"] = roleId;
  data["userId"] = userId;
  data["parentId"] = parentId;
  data["moduleType"] = moduleType;
  data["moduleId"] = moduleId;
  $.ajax({
    type: "POST",
    contentType: "application/json",
    url: getURLFor("module-details", ""),
    data: JSON.stringify(data),
    dataType: "json",
    async: false,
    global: false,
    success: function (data) {
      roleAndModule = data;
    },
    error: function (e) {
      if (checkonlineOfflineStatus()) {
        return;
      }else{
        showMessage(true, e.responseText);
      }
    },
  });
  return roleAndModule;
}
