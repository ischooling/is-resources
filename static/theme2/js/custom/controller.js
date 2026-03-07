var schoolSettingsLinks;
var schoolSettingsTechnical;
var schoolSettings;
var schoolSettingsOffice;
var commonProfileDTO;
var schoolList;
var CALENDAR_EVENT=false;
var parentColor;
async function initiateSetting(){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	// schoolSettings = await getSchoolSettingsOffice(SCHOOL_ID);
	schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
	commonProfileDTO = await getUserShortProfile(USER_ID);
	schoolList= await getOfflineSchoolList(USER_ID);
	parentColor=schoolSettingsTechnical.parentColor;
	SCHOOL_TYPE=schoolSettingsOffice.schoolType;

}
initiateSetting();
function getContent(moduleId, pageNo, replaceDiv, extraParam){
	$("#dashboardContentInHTMLAdditional").html('');
	$('#dashboardContentInHTML').show();
	customLoader(false);
	roleAndModule = getUserRights(SCHOOL_ID_OF_USER, USER_ROLE_ID, USER_ID, moduleId);
	ROLE_MODULE=roleAndModule;
	if(pageNo=='module'){
		$('#dashboardContentInHTML').html(renderModuleListDashboard('Module List', roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE));
	}if(pageNo=='modulerole'){
		$('#dashboardContentInHTML').html(renderRoleListDashboard('Roles List', roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE));
	}else if(pageNo=='home'){
		renderSchoolDashboard('School Dashboard', roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE);
	}else if(pageNo=='student-home'){
		CALENDAR_EVENT=false;
		rendereDashboardContent(isParent);
	}else if(pageNo=='teacher-home'){
		CALENDAR_EVENT=false;
		rendereTeacherHomeContent();
	}else if(pageNo=='student-teacher-sessions'){
		console.log("hello");
		$('#dashboardContentInHTML').html(getManageSessionContent('Classes',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		$('#classJoinInSameWindowModal').remove();
		$("body").append(calendarMeetingLinkValidate());
		$(".filterDates").datepicker("destroy");
		$('.filterDates').datepicker({
			autoclose: true,
			format: 'M dd, yyyy',

		});
		
		$('#dashboardContentInHTML').append(getUpdateManageMeetingResultModal(roleAndModule, USER_ROLE));
		$('#dashboardContentInHTML').append(getMeetingUrlModal(roleAndModule, USER_ROLE));
		$('#dashboardContentInHTML').append(getSendMailModal(roleAndModule, USER_ROLE));
		$('#dashboardContentInHTML').append(getPublicRecordModal(roleAndModule, USER_ROLE));
		$('#dashboardContentInHTML').append(getRevokeModal(roleAndModule, USER_ROLE));
		getSessionMasterList('classroomSessionFilter', 'sessionId', false);
		$('#classroomSessionFilter #sessionId').select2({
			theme:"bootstrap4",
			dropdownParent:"#classroomSessionFilter"
		});
	}else if(pageNo=='create-manage-sessions'){
		$('#dashboardContentInHTMLAdditional').html(getManageSessionContentTeacher('All Classes',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		$(".filterDates").datepicker("destroy");
		$('.filterDates').datepicker({
			autoclose: true,
			format: 'dd-mm-yyyy',

		});
		$('#dashboardContentInHTMLAdditional').append(getUpdateMeetingResultModal(roleAndModule, USER_ROLE));
		$('#dashboardContentInHTMLAdditional').append(getMeetingUrlModal(roleAndModule, USER_ROLE));
		$('#dashboardContentInHTMLAdditional').append(getSendMailModal(roleAndModule, USER_ROLE));
		$("#standardId").select2({
			theme:"bootstrap4"
		});
		$("#classStatus").select2({
			theme:"bootstrap4",
			minimumResultsForSearch:Infinity

		});
		$("#markStatus").select2({
			theme:"bootstrap4",
		});
		$("#sortBy").select2({
			theme:"bootstrap4",
			minimumResultsForSearch:Infinity

		});
	}else if(pageNo=='manage-lms-user'){
		$('#dashboardContentInHTML').html(getManageLmsUserContent('Manage LMS User',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		getSessionMasterList('lmsStudentFilter', 'activeSession',false);
		$("#standardId").select2({
			theme:"bootstrap4",
		});
		$("#standardId option[value='17']").remove();
//		$(".filterDates").datepicker("destroy");
		$(".filterDates").datepicker({
			todayBtn:  1,
	       	autoclose: true,
	       	format: 'M dd, yyyy',
	       	todayHighlight : true,

		});
	}else if(pageNo=='student-assigned-report'){
		$('#dashboardContentInHTML').html(getStudentAssignedReportContent('Student Assigned Report',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		$('#dashboardContentInHTML').append(filterTeacherReportModal(SCHOOL_ID));

		$(".multiselect-dropdown").select2({theme:"bootstrap4"});
		$(".singleSelect2-dropdown").select2({theme:"bootstrap4"});

		$("#startDate").datepicker({
			autoclose: true,
			format: 'M d, yyyy',
		}).on('changeDate', function (selected) {
			$("#endDate").removeAttr('disabled');
			$( "#endDate" ).datepicker( "minDate", endDate);
		});
		$("#endDate").datepicker({
			autoclose: true,
			format: 'M d, yyyy',
		}).on('changeDate', function (selected) {
			studentTeacherValidDate('studentTeacherValidDate');
		});
		teacherReportByDate('studentTeacherValidDate');
		if(ENVIRONMENT=='dev'){
			$('#studentAssignedReportFilter #officialEmail').val('devaleenaray@gmail.com');//FOR TESTING PURPOSES ONLY
		}
	}else if(pageNo=='manage-session'){
		$('#dashboardContentInHTML').html(getManageSessionUserContent('Manage Enrollments',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		$("#standardId").select2({
			theme:"bootstrap4",
			dropdownParent:"#lmsStudentFilter"
		});
		$("#standardId option[value='17']").remove();
		$(".filterDates").datepicker({
			todayBtn:  1,
	       	autoclose: true,
	       	format: 'M dd, yyyy',
	       	todayHighlight : true,
		});
		getSessionMasterList('lmsStudentFilter', 'sessionId',false);
	}else if(pageNo=='offline-classes'){
		$('#dashboardContentInHTML').html(getOfflineClassContent('Add Links',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		getTeacherDetails('offlineClassFilter','userId','userIdOfflineClass',SCHOOL_ID);
		$('#offlineClassFilter #userId').select2({
			theme:"bootstrap4",
		});
		$('#offlineClassFilter #classType').select2({
			theme:"bootstrap4",
			minimumResultsForSearch:Infinity
		});
		$('#offlineClassFilter #sortBy').select2({
			theme:"bootstrap4",
			minimumResultsForSearch:Infinity
		});
	}
	// else if(pageNo=='payment'){
	// 	$('#dashboardContentInHTML').html(getManagePaymentContent('Payment Details',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	// 	getSessionMasterList('advancePaymentSearchForm', 'academicSession',false);
	// 	callCountries('advancePaymentSearchForm', '', 'countryId');
	// 	if(SCHOOL_ID==4 || SCHOOL_ID==5){
	// 		$('#gradeId option[value=9]').remove();
	// 		$('#gradeId option[value=10]').remove();
	// 	}
	// 	$('.multiselect-dropdown').select2({
	// 		placeholder: "Select an option",
	// 		theme:"bootstrap4",
	// 		dropdownParent:"#advSerch",
	// 	});
	// 	setpaymentDateFrom();
	// 	setpaymentDateTo();
	// 	initEditor(1, 'descriptionDiv','Put description if any', false);
	// 	$('#paymentDate1').datepicker({
	// 		autoclose: true,
	// 		endDate: new Date(),
	// 		format: 'mm-dd-yyyy',
	// 	});
	// 	$('#scheduleDate1').datepicker({
	// 		startDate: new Date(),
	// 		autoclose: true,
	// 		format: 'mm-dd-yyyy',
	// 	});
	// }
	else if(pageNo=='schedule-a-session'){
		customLoader(true);
		$('#dashboardContentInHTML').html(getScheduleSessionContentTeacher('Book a Class',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		generateTinyUrls();
		$("#meetingDate").datepicker("destroy");
		$("#meetingDate").datepicker({
			autoclose: true,
			startDate: new Date(),
			format: 'M dd, yyyy',
			container: '.meetingDateWrapper',
		});
		$(".filterDates").datepicker("destroy");
		$('.filterDates').datepicker({
			autoclose: true,
			format: 'M dd, yyyy',
		});
		$('#showMeetingModalDiv').show();
		getTimeZones('classroomSessionFilter','countryTimezone','countryTimezoneId');
		getTeacherAssignedGrade('classroomSessionFilter',USER_ID);
		$("#countryTimezone").select2({
			theme:"bootstrap4"
		});
		$("#studentName").select2({
			theme:"bootstrap4"
		});
		$("#startFromTime").select2({
			theme:"bootstrap4"
		});
		customLoader(false);
		// $('#dashboardContentInHTML').append(getUpdateMeetingResultModal(roleAndModule, USER_ROLE));
		// $('#dashboardContentInHTML').append(getMeetingUrlModal(roleAndModule, USER_ROLE));
		// $('#dashboardContentInHTML').append(getSendMailModal(roleAndModule, USER_ROLE));
	}else if(pageNo=='user-leave'){
	$('#dashboardContentInHTML').html(getManageLeaveContent('Leave Detail',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, true));
	$("#teacherLeaveTable").dataTable();
	$("#leaveDates").datepicker({
		//autoclose: true,//
		startDate:new Date(),
		multidate:true,
		format: 'M dd, yyyy',
		container:'#leaveFromModal .modal-body'
	});
	getUserLeaveData(USER_ID, USER_ID);
	}else if(pageNo=='manage-leave'){
		$('#dashboardContentInHTML').html(getManageLeaveContent('Manage Leave',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, true));
		$("#teacherLeaveTable").dataTable();
		$("#leaveDates").datepicker({
			//autoclose: true,//
			startDate:new Date(),
			multidate:true,
			format: 'M dd, yyyy',
			container:'#leaveFromModal .modal-body'
		});
		getUserLeaveData(USER_ID);
	}else if(pageNo=='admin-task'){
		$('#dashboardContentInHTML').html(getAdminTaskContent('Admin Tasks',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		getTeacherDetails('adminTaskFilter','userId','userIdOfflineClass',SCHOOL_ID);
		$('#adminTaskFilter #userId').select2({
			theme:"bootstrap4",
		});
		$(".filterDates").datepicker({
			todayBtn:  1,
			autoclose: true,
			format: 'M dd, yyyy',
			todayHighlight : true,
			
		});
		getMeetingVendorUserStatus(SCHOOL_ID,USER_ID,'LENS');
	}else if(pageNo=='user-feedback'){
		getReviewDashboardContent('User Feedback',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
	}else if(pageNo=='question-list'){
      getQuestionDashboardContent('Question List',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
    }else if(pageNo=='partner-dashboard'){
		renderPartnerDashboard('Partner Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
	}else if(pageNo=='counselor-dashboard'){
		renderCounselorDashboard('Counselor Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
	}else if(pageNo=='partner-enrollment-list'){
		renderPartnerList('Student Enrollments',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
	}else if(pageNo=='add-student-enrollment'){
		enrollmentPartnerStudent(0);
	}else if(pageNo=='counselor-enrollment-list'){
		renderCounselorEnrollList('Student Enrollments',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
	}else if(pageNo=='admin-partner-enrollment-list'){
		//$('#dashboardContentInHTML').html(
			renderPartnerList('Student Enrollments',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE);
		//);
	}else if(pageNo=='lead-list'){
		if (USER_ROLE == "B2B_LEAD") {
			LEAD_CATEGORY = "B2B";
		}
		if(SCHOOL_TYPE=='WLP'){
			LEAD_CATEGORY = "B2B";
		}
		$('#dashboardContentInHTML').html(renderCounselorLeadListDashboard('Lead List',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY));
	}else if(pageNo=='lead-report-list'){
		LEAD_CATEGORY="B2C";
		if (USER_ROLE == "B2B_LEAD") {
			LEAD_CATEGORY = "B2B";
		}
		if(SCHOOL_TYPE=='WLP'){
			LEAD_CATEGORY = "B2B";
		}
		renderCounselorLeadReportDashboard('Lead Report',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY)
	}else if(pageNo=='lead-demo-list'){
		renderMeetingTimeDashboard('Lead Demo Calendar',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE);
	}else if(pageNo=='lead-demo-report'){
		renderLeadDemoReportDashboard('Lead Demo Report',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE);
	}else if(pageNo=='lead-assign-form'){
		renderLeadAssignDashboard('Lead Assign Form',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE);
	}else if(pageNo=='referral-and-links'){
		$('#dashboardContentInHTML').html(renderReferralCodeAndLinks('Referral Code & Links',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	}else if(pageNo=='teacher-recurring-classes-list'){
		getRecurringClassesContentTeacher('My Recurring Classes',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
		
		
	} else if (pageNo === "meeting-management") {
    	getMeetingManagementContent("Meeting Management")
  	}else if (pageNo === "book-a-session") {
    	renderBookClassContent('','','', true, moduleId);
  	}else if (pageNo === "student-orientation-list") {
		renderStudentOrientationListDashboard('System training Students List',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE)
  	}else if (pageNo === "assign-orientation") {
		renderStudentOrientationAssignDashboard('Assign Users', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE)
  	}else if (pageNo === "user-list") {
		renderAdminManageUserListDashboard('Admin Users', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE)
  	}else if (pageNo == "email-logs") {
		$("#dashboardContentInHTML").html(getEmailLogsContent("Email Logs"));
		$("#startDate").datepicker({
			autoclose: true,
			format: 'yyyy-mm-dd',
		});
		$("#endDate").datepicker({
			autoclose: true,
			format: 'yyyy-mm-dd',
		});
		$("#classStatus").select2({
			theme:"bootstrap4",
			minimumResultsForSearch:Infinity

		});
		$("#markStatus").select2({
			theme:"bootstrap4",
		});
		$("#sortBy").select2({
			theme:"bootstrap4",
			minimumResultsForSearch:Infinity

		});
		getEmailLogsByEmail()
	} else if (pageNo === "meeting-management") {
    	getMeetingManagementContent("Meeting Management")
	} else if (pageNo == "wati-numbers") {
		renderWatiNumbersContent();
  	} else if (pageNo == "email-status") {
		$("#dashboardContentInHTML").html(getEmailVerifyContent("Email Verification", false));
  	}else if (pageNo == "extra-session-details") {
    		$("#dashboardContentInHTML").html(renderManageClassContent('Manage Extra Classes', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
		getExtraSessionDetails('extraSessionDetails',0, ''+roleAndModule.moduleId+'');
		$("#extraDetailSearch").on('keyup', function (e) {
			if (e.key === 'Enter' || e.keyCode === 13) {
				getExtraSessionDetails('extraSessionDetails',0, ''+roleAndModule.moduleId+'');
			}
		});
  }else if (pageNo == "auto-progress-report") {
		renderAutoProgressReportDashboard("Bulk Student Progress Report", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE)
  }else if (pageNo == "graduation-ceremony-attendees") {
    $("#dashboardContentInHTML").html(getGraduationCeremonyAttendeesContent( "Graduation Ceremony Attendees", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    loadGraduationCeremonyAttendees();
  }else if (pageNo == "payment") {
	isDiscountApplied=false;
    $("#dashboardContentInHTML").html(getManagePaymentContent( "Payment Details", roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE ) );
    getSessionMasterList("advancePaymentSearchForm", "academicSession", false);
    callCountries("advancePaymentSearchForm", "", "countryId");
    if (SCHOOL_ID == 4 || SCHOOL_ID == 5) {
      $("#gradeId option[value=9]").remove();
      $("#gradeId option[value=10]").remove();
    }
	$("#advSerch .modal-body .multiselect-dropdown").select2({
      placeholder: "Select an option",
	  theme:"bootstrap4",
      dropdownParent: "#advSerch .modal-body",
      minimumResultsForSearch: Infinity,
    });
    $("#paymentType1").on("change", function () {
      if ($(this).val() == "REGISTRATION_FEE_ADV") {
        $("#addStudentPaymentForm #paymentName1").val("Reserve a Seat for "+getNextGrade('addStudentPaymentForm', 'standardId1'));
        $("#addStudentPaymentForm #paymentName1").prop("disabled", true);
      } else {
        $("#addStudentPaymentForm #paymentName1").val("");
        $("#addStudentPaymentForm #paymentName1").prop("disabled", false);
      }
    });
    $("#addPaymentModal .modal-body .multiselect-dropdown")
      .select2({
        placeholder: "Select an option",
		theme:"bootstrap4",
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
	$("#addCountryId").select2({
		theme:"bootstrap4",
		dropdownParent:"#addPaymentModal"
	});	
	$("#addStateId").select2({
		theme:"bootstrap4",
		dropdownParent:"#addPaymentModal"
	});
	$("#addCityId").select2({
		theme:"bootstrap4",
		dropdownParent:"#addPaymentModal"
	});
	getAllCountryList('addPaymentModal','addCountryId');
	$("select#addCountryId").on("change",function(){
		callStates('addPaymentModal', this.value, 'addCountryId', 'addStateId');
	});
		
	$("select#addStateId").on("change",function(){
		callCities('addPaymentModal', this.value, 'addStateId', 'addCityId');
	});
  }else if(pageNo == "invoice"){
	$("#dashboardContentInHTML").hide();
	$("#dashboardContentInHTMLAdditional").show();
	renderInvoiceContent("Y", "Y", "", true);
  }else if (pageNo == "approved-teachers") {
    $("#dashboardContentInHTML").html(renderApprovedTeacherDashboard( "Approved Teachers", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, "0","0,1", "approved" ));
  }else if (pageNo == "withdraw-teachers") {
    $("#dashboardContentInHTML").html(renderApprovedTeacherDashboard( "Withdrawn Teachers", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, "1","0,1","withdraw" ));
  }else if(pageNo == "online-user"){
	$('#dashboardContentInHTML').html(renderOnlineUserListDashboard('Live Online Users', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "conflicted-user-list"){
	$('#dashboardContentInHTML').html(renderConflictedUserListDashboard('Conflicted User List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "delete-user"){
	$('#dashboardContentInHTML').html(renderDeletedUserListDashboard('Delete User List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "teacher-profile"){
	$('#dashboardContentInHTML').html(renderReceivedTeachedProfileListDashboard('Received Teacher Profile', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "pending-training-remarks"){
	$('#dashboardContentInHTML').html(renderPendingTeachedTrainingListDashboard('Pending Training Remarks', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "pending-interview-remarks"){
	$('#dashboardContentInHTML').html(renderPendingContractListDashboard('Pending Contract', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "rejected-teachers"){
	$('#dashboardContentInHTML').html(renderRejectedTeacherListDashboard('Rejected Teachers', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "teacher-profile-pending-verification"){
	$('#dashboardContentInHTML').html(renderPendingVerificationTeachedProfileListDashboard('Pending Verification', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if(pageNo == "teacher-profile-pending-bank-details"){
	$('#dashboardContentInHTML').html(renderBankDetailsTeacherProfleListDashboard('Pending Bank Details', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
  }else if (pageNo === "teacher-assign-interview") {
	renderTeacherInterviewAssignDashboard('Assign Teacher Interview', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE)
  }else if(pageNo == "teacher-screening-profiles"){
	$('#dashboardContentInHTML').html(renderTeacherPreScreeningProfileContent("Teacher Applications", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
	teacherScreeningProfileOnloadFunction();
  }else if(pageNo == "partner-school-payment"){
	$('#dashboardContentInHTML').html(renderSchoolPayment());
	initializeSchoolPaymentPage();
	getPartnerSchoolList()
  }else if (pageNo == "partner-enrollment-students-wlp") {
	$('#dashboardContentInHTML').html(renderSchoolEnrollmentStudents(`${schoolSettingsOffice.schoolType == "WLP" ? "Student Enrollment List" :"Enrollment Partner Student List"}`));
	getSchoolSessionMasterList('partnerEnrollFilterForm', "academicYear", SCHOOL_ID);
    callPartnerCountries('partnerEnrollFilterForm', 0, 'countryId');
    // callPartnerListBy('partnerEnrollFilterForm','partnerName');
    getPartnerSchools(SCHOOL_ID);
    callAllStandardList('partnerEnrollFilterForm', 'gradeId');

    $("select#schoolName").on("change",function(){
        getSchoolSessionMasterList('partnerEnrollFilterForm', "academicYear", this.value);
    });

    $("select#countryId").on("change",function(){
        callStates('partnerEnrollFilterForm', this.value, 'countryId');
    });
        
    $("select#stateId").on("change",function(){
        callCities('partnerEnrollFilterForm', this.value, 'stateId');
    });

    $("select#partnerName").on("change",function(){
		$("#referralCode").val($('option:selected', this).attr('dail-referral-code'));
   	});

	$("#partnerName").select2({
		theme:"bootstrap4"
	});
	$("#academicYear").select2({
		theme:"bootstrap4"
	});
	$("#enrollmentStatus").select2({
		theme:"bootstrap4"
	});
	$("#learningProgram").select2({
		theme:"bootstrap4"
	});
	$("#gradeId").select2({
		theme:"bootstrap4"
	});
	$("#commissionStatus").select2({
		theme:"bootstrap4"
	});
	$("#countryId").select2({
		theme:"bootstrap4"
	});
	$("#stateId").select2({
		theme:"bootstrap4"
	});
	$("#cityId").select2({
		theme:"bootstrap4"
	});
	$("#paymentDateFrom").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
	});
	$("#paymentDateTo").datepicker({
		autoclose: true,
		format: 'M dd, yyyy',
	});
	
	$(".follow-up-no").click(function(){
		$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
		$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
		$(this).parent().find(".follow-up-content").slideDown();
		$(this).parent().siblings().find(".follow-up-content").slideUp();
		$(this).parent().addClass("follow-up-accordian-active");
		$(this).parent().siblings().removeClass("follow-up-accordian-active");
	});

	callStudentListByPartnerWLP('partnerEnrollFilterForm');
	$("#searchEnrolled").on('click',function(){
        currentPagePartnerEnrollmentList = 1;
		callStudentListByPartnerWLP('partnerEnrollFilterForm');
	});

    $("#startDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
    }).on('changeDate', function (e) {
        $('#endDate').val('');
        $('#endDate').prop('disabled', false);
        $('#endDate').datepicker('setStartDate', e.date);
    });
    
    $("#endDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
    }).on('changeDate', function () {
        if ($("#startDate").val() && $("#endDate").val()) {
            getMonthlyRevenue();
        }
    });

    getLearningProgramContentFromServer(SCHOOL_ID,'partnerEnrollFilterForm','learningProgram');
    populateMonths();
  }else if(pageNo == "dashboard-monitoring"){
	$("#dashboardContentInHTML").html(dashboardMonitoringContent());
	dashboardMonitoringOnLoad("dashboardMonitoringFilterForm");
  }else if(pageNo=='lead-setting'){
		LEAD_CATEGORY="B2C";
		if (USER_ROLE == "B2B_LEAD") {
			LEAD_CATEGORY = "B2B";
		}
		if(SCHOOL_TYPE=='WLP'){
			LEAD_CATEGORY = "B2B";
		}
		renderLeadSettingDashboard('Lead Settings',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY)
	}else if(pageNo=='profile-view'){
		renderUserProfilePage(extraParam);
	}else if(pageNo=='user-screening-profiles'){
		$('#dashboardContentInHTML').html(renderUserApplicationContent("Job Applicants", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
		userApplicationProfileOnloadFunction();
	}else if(pageNo=='task'){
		renderTaskListDashboard("Task", roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE)
	}
	else if(pageNo=='partner-fee-structure'){
		renderB2BPartnerFeeStructureContent("Fee Structure", roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE)
	}
	else if(pageNo=='add-sub-partner'){
		renderB2BSubPartnerContent("Sub Partner List", roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE)
	}
//   else if(pageNo=='lead-report-list'){
// 	$('#dashboardContentInHTML').html(renderSchoolReportDashboard('School Report',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY));
//   }
  
}

// function getUserRights(schoolId, roleId, userId, moduleId){
// 	var data={};
// 	data['schoolId']=schoolId;
// 	data['roleId']=roleId;
// 	data['userId']=userId;
// 	data['moduleId']=moduleId;
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

function getModuleDetails(schoolId, roleId, userId, parentId, moduleType, moduleId){
	var data={};
	data['schoolId']=schoolId;
	data['roleId']=roleId;
	data['userId']=userId;
	data['parentId']=parentId;
	data['moduleType']=moduleType;
	data['moduleId']=moduleId;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('module-details',''),
		data : JSON.stringify(data),
		dataType : 'json',
		async: false,
		global: false,
		success : function(data) {
			roleAndModule=data
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			} else {
				showMessage(true, e.responseText);
			}
		}
	});
	return roleAndModule;
}


function backToDedicatedModule(moduleUrl){
  if(moduleUrl=='partner-enrollment-list'){
    callDashboardPageSchool('176','partner-enrollment-list');
  }else if(moduleUrl=='partner-enrollment-students-wlp'){
	callDashboardPageSchool('194','partner-enrollment-students-wlp');
  }
}
