async function callDashboardPageSchool(moduleId, pageNo, replaceDiv, extraParam) {
    showAndHideDashboardAndAdditionalContent("main");
    console.time();
    var pageRequest = {
        "home":{url:"",file:[{role:"",fileName:["schoolDashboardContent.js","schoolDashboard.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "module":{url:"",file:[{role:"",fileName:["moduleListContent.js","moduleList.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "modulerole":{url:"",file:[{role:"",fileName:["roleListContent.js","roleList.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "rolerights":{url:"get-module-rights?moduleId="+moduleId+"&themeType=theme2"+extraParam,file:[{role:"",fileName:[]}],type:"JSP",pageReqType:"IN"},
        "create-user":{url:"create-user-content?moduleId="+moduleId+"&themeType=theme2"+extraParam,file:[{role:"",fileName:["adminManageuserListContent.js","adminManageuserList.js"]}],type:"JSP",pageReqType:"IN"},
        "user-list":{url:"",file:[{role:"",fileName:["adminManageuserListContent.js","adminManageuserList.js","roleList.js","dashboardUserActivity.js","dashboardStudent.js","agilixbuzzApi.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "manage-user-list":{url:"manage-profile-content?moduleId="+moduleId+"&profileFor=common"+extraParam,file:[{role:"",fileName:["dashboardManageUser.js","dashboardUserActivity.js","dashboardStudentTeacherSession.js","studentProfileCompletingProcess.js"]},{role:"",fileName:["dashboardStudent.js"]}],type:"JSP",pageReqType:"IN"},
        "student-list":{url:"manage-profile-content?moduleId="+moduleId+"&profileFor=student&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2",file:[],type:"JSP",init: function () {$("#studentTab").show();$("#teacherTab").hide();$("#parentsTab").hide();$("#flexStudentTab").hide();$("#batchStudentTab").hide();},pageReqType:"IN"},
        "teacher-list":{url:"manage-profile-content?moduleId="+moduleId+"&profileFor=teacher&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2",file:[],type:"JSP",init: function () {$("#studentTab").hide();$("#teacherTab").show();$("#parentsTab").hide();$("#flexStudentTab").hide();$("#batchStudentTab").hide();},pageReqType:"IN"},
        "parent-list":{url:"manage-profile-content?moduleId="+moduleId+"&profileFor=parent&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2",file:[],type:"JSP",init: function () {$("#studentTab").hide();$("#teacherTab").hide();$("#parentsTab").show();$("#flexStudentTab").hide();$("#batchStudentTab").hide();},pageReqType:"IN"},
        "online-user":{url:"",file:[{role:"",fileName:["onlineUserLiveListContent.js","onlineUserLiveList.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "delete-user":{url:"",file:[{role:"",fileName:["deletedUserListContent.js","deletedUserList.js","roleList.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "maintenance-down-message":{url:"maintenance-down-message?moduleId="+moduleId+"&username=&themeType=theme2",file:[{role:"",fileName:["dashboardCommonComment.js","dashboardUserActivity.js"]}],type:"JSP",pageReqType:"IN"},
        "manage-batch-student":{url:"manage-batch-student?moduleId="+moduleId+"&themeType=theme2",file:[{role:"",fileName:["dashboardSchoolBatches.js","zoomRegistration.js"]}],type:"JSP",pageReqType:"IN"},
        "payment-reports":{url:"",file:[{role:"",fileName:["paymentReportContent.js","paymentReport.js","dashboardManageUser.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        // "payment-reports":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/payment-reports?moduleId="+moduleId},
        "assign-orientation":{url:"",file:[{role:"",fileName:["studentOrientationAssignContent.js","studentOrientation.js", "leads.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-orientation-list":{url:"",file:[{role:"",fileName:["studentOrientationContent.js","studentOrientation.js", "commonRecordingsContent.js", "commonRecordings.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "academic-year-date-settings":{url:"academic-year-date-settings?moduleId="+moduleId,file:[],type:"JSP",pageReqType:"IN"},
        "manage-lms-user":{url:"",file:[{role:"",fileName:["manageLMSContent.js","manageLMS.js","agilixbuzzApi.js","adminManageuserList.js"]}, {role:"",fileName:["dashboardStudent.js","dashboardStudentTeacherSession.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "manage-session":{url:"",file:[{role:"",fileName:["manageSessionContent.js","manageSession.js","agilixbuzzApi.js"]}, {role:"",fileName:["dashboardStudent.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "extra-session-details":{url:"",file:[{role:"",fileName:["manageClassesContent.js","manageClasses.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-teacher-sessions":{url:"",file:[{role:"",fileName:["manageClassesContent.js","manageClasses.js"]}, {role:"",fileName:["dashboardCalendar.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-transcript":{url:"student-list?moduleId="+moduleId,file:[{role:"",fileName:["advanceTranscriptSearch.js"]}],type:"JSP",pageReqType:"IN"},
        "bulk-transcript-print":{url:"bulk-transcript-print?moduleId="+moduleId,file:[{role:"",fileName:["copyCourseFilter.js"]}],type:"JSP",pageReqType:"IN"},
        "flex-billing-report":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/get-lmsbuzz-billing?moduleId="+moduleId},
        "critical-students":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/get-critical-students?moduleId="+moduleId},
        "nongrading-students":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/get-nongrading-students?moduleId="+moduleId},
        "recurring-class-list":{url:"recurring-class-content?moduleId="+moduleId,file:[{role:"",fileName:["reuccurringClasses.js","dashboardRecurring.js","masterContent.js","scheduleClassContent.js","scheduleClass.js"]}],type:"JSP",init: function () {getWaringContent1()},pageReqType:"IN"},
        "recurring-class":{url:"recurring-class?moduleId="+moduleId+extraParam,file:[],type:"JSP",init: function () {getWaringContent1()},pageReqType:"IN"},
        "auto-progress-report":{url:"",file:[{role:"",fileName:["bulkStudentProgressListContent.js","bulkStudentProgressList.js","dashboardWeeklyProgress.js"]}, {role:"",fileName:["dashboardExtraActivity.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-screening-profiles":{url:"",file:[{role:"",fileName:["teacherScreeningProfileContent.js","teacherScreeningProfile.js","leads.js","cropperImageChatSupportDocument.js","jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-profile":{url:"",file:[{role:"",fileName:["manageTeacherProfileContent.js","manageTeacherProfile.js","userApplicationContent.js","userApplication.js","dashboardSchoolRemark.js", "jquery.ckeditor.js","cropperImageChatSupportDocument.js","commonRecordingsContent.js","commonRecordings.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "pending-interview-remarks":{url:"",file:[{role:"",fileName:["manageTeacherProfileContent.js","manageTeacherProfile.js","dashboardSchoolRemark.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-profile-pending-verification":{url:"",file:[{role:"",fileName:["manageTeacherProfileContent.js","manageTeacherProfile.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-profile-pending-bank-details":{url:"",file:[{role:"",fileName:["manageTeacherProfileContent.js","manageTeacherProfile.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "approved-teachers":{url:"",file:[{role:"",fileName:["approvedTeacherListContent.js","approvedTeacherList.js","dashboardExtraActivity.js","dashboardUserActivity.js","dashboardTeacherPayment.js","manageLMSContent.js","manageLMS.js","dashboardStudent.js","manageTeacherProfile.js","manageTeacherProfileContent.js","adminManageuserListContent.js","adminManageuserList.js","additionalLayer.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "rejected-teachers":{url:"",file:[{role:"",fileName:["manageTeacherProfileContent.js","manageTeacherProfile.js","dashboardUserActivity.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "withdraw-teachers":{url:"",file:[{role:"",fileName:["approvedTeacherListContent.js","approvedTeacherList.js","dashboardExtraActivity.js","dashboardUserActivity.js","dashboardTeacherPayment.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-class-review":{url:"",file:[],funName:function(){},type:"JSP",init: function(){window.open(CONTEXT_PATH+UNIQUEUUID+"/dashboard/teacher-class-review/"+SCHOOL_UUID+"?moduleId="+moduleId, "_blank");},pageReqType:"EX",urlSend:""},
        "teacher-assign-form":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/report/teacher-assign-form?moduleId="+moduleId},
        "live-classroom-status":{url:"",file:[],funName:function(){},type:"JSP",init: function(){window.open(CONTEXT_PATH+UNIQUEUUID+"/dashboard/live-classroom-status/"+SCHOOL_UUID, "_blank");},pageReqType:"EX",urlSend:""},
        "teacher-time-availability":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/report/teacher-time-availability?moduleId="+moduleId},
        "onboarded-teacher-list":{url:"",file:[{role:"",fileName:["onboardedTeacherListContent.js","onboardedTeacherList.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-assign-interview":{url:"",file:[{role:"",fileName:["assignTeacherInterviewContent.js","assignTeacherInterview.js","studentOrientation.js","leads.js","leadAssignForm.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "manage-course-provider":{url:"manage-course-provider-content?moduleId="+moduleId,file:[],type:"JSP",init: function () {},pageReqType:"IN"},
        "manage-categories":{url:"manage-course-content?moduleId="+moduleId,file:[],type:"JSP",init: function () {},pageReqType:"IN"},
        "manage-courses":{url:"manage-subject-content?moduleId="+moduleId,file:[],type:"JSP",init: function () {},pageReqType:"IN"},
        "edit-subjectB2C":{url:"edit-subjectB2C-content"+extraParam,file:[{role:"",fileName:["jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js"]}],type:"JSP",init: function () {},pageReqType:"IN"},
        "Connect-to-impact-slot":{url:"demo-request-meeting-content?moduleId="+moduleId+"&requestType=CONNECTMEET",file:[{role:"",fileName:["dashboardStudentTeacherSession.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "scholarship":{url:"scholarship-request-content?moduleId="+moduleId+"&themetype=theme2",file:[{role:"js",fileName:["typeahead.bundle.js"]},{role:"",fileName:["scholarship.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "payment":{url:"",file:[{role:"",fileName:["managePaymentContent.js","managePayment.js","jquery.ckeditor.js","invoiceContent.js","invoice.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "evaluation-test-form-details":{url:"evaluation-test-form?moduleId="+moduleId+"&themeType=theme2",file:[{role:"",fileName:["evaluationRecommendation.js",""]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "reports":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/school-data-reports?moduleId="+moduleId+"&schoolId="+SCHOOL_ID+"&year="},
        "school-announce-list":{url:"teacher-school-announce-list?moduleId="+moduleId,file:[{role:"",fileName:["dashboardExtraActivity.js","dashboardAnnouncement.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "school-announce":{url:"teacher-school-announce?moduleId="+moduleId,file:[{role:"",fileName:["jquery.ckeditor.js","dashboardAnnouncement.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "release-note":{url:"",file:[{role:"",fileName:["releaseNoteContent.js","releaseNote.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "release-note-admin-list":{url:"",file:[{role:"",fileName:["releaseNoteContent.js","releaseNote.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "release-note-admin-editor":{url:"",file:[{role:"",fileName:["releaseNoteContent.js","releaseNote.js","jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "release-note-user-list":{url:"",file:[{role:"",fileName:["releaseNoteContent.js","releaseNote.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "holiday-list":{url:"school-holiday-list?moduleId="+moduleId,file:[{role:"",fileName:["dashboardCalendar.js","masterContent.js"]}],funName:function(){},type:"JSP",init: function(){getWaringContent1()},pageReqType:"IN"},
        "holiday-form":{url:"school-holiday-form?moduleId="+moduleId,file:[{role:"",fileName:["jquery.ckeditor.js","dashboardCalendar.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "lead-automation":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/lead-automation?moduleId="+moduleId+"&userId="+USER_ID},
        "lead-report-list":{url:"",file:[{role:"",fileName:["LeadReportListContent.js","CounselorDashboardContent.js","leads.js","LeadReportSearchPopup.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-report-campaign":{url:"",file:[{role:"",fileName:["LeadReportCampaignContent.js","LeadReportListContent.js","CounselorDashboardContent.js","leads.js","LeadReportSearchPopup.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-logs":{url:"",file:[{role:"",fileName:["LeadReportListContent.js","LeadReportLogsContent.js","CounselorDashboardContent.js","leads.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-detail-by-campaign":{url:"",file:[{role:"",fileName:["LeadReportListContent.js","CounselorDashboardContent.js","leads.js","LeadReportSearchPopup.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-list":{url:"",file:[{role:"",fileName:["LeadListContent.js","B2CLeadListContent.js","B2CLead.js","B2BLeadListContent.js","leads.js","leadsContent.js","leadsPartnerContent.js","leadsPartner.js","schoolSetupContent.js","cropperImageChatSupportDocument.js","cropperImageLeadDocument.js", "schoolSetup.js", "CounselorData.js", "forceLeadsUpdate.js","commonRecordings.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-assign-form":{url:"",file:[{role:"",fileName:["leadAssignFormContent.js","leadAssignForm.js","leads.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-calculation-chart":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/lead-calculation-chart?moduleId="+moduleId+"&euid="+ENCRYPTED_USER_ID},
        "admin-partner-enrollment-list":{url:"",file:[{role:"",fileName:["b2bPartnerContent.js","b2bPartner.js","signupStudentContent.js","signupStudentStage1.js","signupStudentStage2.js","signupStudentStage3.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-demo-list":{url:"",file:[{role:"",fileName:["leadDemoContent.js","leads.js","LeadSettingListContent.js","LeadSettings.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-demo-report":{url:"",file:[{role:"",fileName:["leadDemoReportContent.js","leadDemoReport.js","leads.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-setting":{url:"",file:[{role:"",fileName:["LeadSettingListContent.js","LeadSettings.js","leads.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "counselor-daily-report":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/counselor-daily-report?moduleId="+moduleId+"&userId="+USER_ID},
        "lead-sales-research":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/lead-sales-research?moduleId="+moduleId+"&userId="+USER_ID},
        "extra-activity":{url:"add-extra-activity?moduleId="+moduleId,file:[{role:"",fileName:["dashboardExtraActivity.js","commonActivityModel.js","scheduleEventContent.js","scheduleEvent.js", "commonRecordingsContent.js", "commonRecordings.js"]}],type:"JSP",pageReqType:"IN"},
        "email-status":{url:"",file:[{role:"",fileName:["emailLogsContent.js","emailLogs.js","emailVerifyContent.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "email-logs":{url:"",file:[{role:"",fileName:["emailLogsContent.js","emailLogs.js","emailVerifyContent.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "meeting-management":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/dashboard/meeting-management-request?moduleId="+moduleId+"&schoolId="+SCHOOL_ID},
        "wati-numbers":{url:"",file:[{role:"",fileName:["watiNumbersContent.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "partner-school-payment":{url:"",file:[{role:"",fileName:["partnerSchoolPaymentContent.js","partnerSchoolPayment.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "graduation-ceremony-attendees":{url:"",file:[{role:"",fileName:["graduationCeremonyAttendeesContent.js","graduationCeremonyAttendees.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "user-screening-profiles":{url:"",file:[{role:"",fileName:["userApplicationContent.js","userApplication.js", "teacherScreeningProfileContent.js", "teacherScreeningProfile.js","jquery.ckeditor.js","cropperImageChatSupportDocument.js","finalRoundOfInterviewSlotsContent.js", "finalRoundOfInterviewSlots.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-weekly-progress":{url:"student-weekly-progress-report?moduleId="+moduleId,file:[{role:"",fileName:["dashboardWeeklyProgress.js"]}],type:"JSP",pageReqType:"IN"},
        "task":{url:"",file:[{role:"",fileName:["taskListContent.js","taskList.js","jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "dashboard-monitoring":{url:"",file:[{role:"",fileName:["dashboardMonitoringContent.js","dashboardMonitoring.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "manage-club":{url:"",file:[{role:"",fileName:["manageClubsContent.js","manageClubs.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "Parent-dashboard":{url:"",file:[{role:"",fileName:[""]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-class-schedule":{url:"",file:[{role:"",fileName:["parentStudentClassScheduleContent.js","parentStudentClassSchedule.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-attendance":{url:"",file:[{role:"",fileName:["attendaceByStudentIdContent.js","attendaceByStudentId.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        // STUDENT PAGE CONFIG
        "batch-schedule":{url:"teacher-batch-time-schedule?moduleId="+moduleId+"&userId="+extraParam,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "student-handbook":{url:"",file:[{role:"",fileName:["studentHandbookContent.js","studentHandbook.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        // "notifications":{url:"notifications"+extraParam,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "parent-notifications":{url:"notifications"+extraParam,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "syllabus-assigned-batch-teacher":{url:"student-batch-teacher-content?moduleId="+moduleId,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "academic-year-extention":{url:"",file:[{role:"",fileName:["studentAcademicYearExtentionContent.js","studentAcademicYearExtention.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-login-details":{url:"",file:[{role:"",fileName:["studentLoginHistoryContent.js","studentLoginHistory.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "syllabus-assigned-teacher":{url:"",file:[{role:"",fileName:["studentSyllabusAssignedTeacherContent.js","studentSyllabusAssignedTeacher.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "fee-details":{url:"",file:[{role:"",fileName:["studentFeeDetailsContent.js","studentFeeDetails.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-progress-report":{url:"",file:[{role:"",fileName:["studentAcademicPerformanceContent.js","studentAcademicPerformance.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "progress-detail":{url:"",file:[{role:"",fileName:["studentProgressDetailContent.js","studentProgressDetail.js","dashboardWeeklyProgress.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "batch-student-examination-sheet":{url:"",file:[{role:"",fileName:["studentExaminationSheetContent.js","studentExaminationSheet.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        //JS
        "student-home":{url:"",file:[],type:"JS",pageReqType:"IN"},
        "student-addon":{url:"buy-extra-class",file:[{role:"",fileName:["buyExtraClassContent.js","buyExtraClass.js"]}],funName:function(){},init: function(){buyExtraClassOnLoadEvent()},type:"JS",pageReqType:"IN"},
        "book-a-session":{url:"book-a-session",file:[{role:"",fileName:["studentBookClassContent.js","studentBookClass.js","manageTeacherAvailability.js"]}],funName:function(){},init: function(){studentBookClassOnLoad()},type:"JS",pageReqType:"IN"},
        "clubs":{url:"clubs",file:[{role:"",fileName:["clubsContent.js","clubs.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "spanish-club":{url:"spanish-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "french-club":{url:"french-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "german-club":{url:"german-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "english-club":{url:"english-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "chinese-club":{url:"chinese-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "team-building-club":{url:"team-building-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "cultural-exchange-club":{url:"cultural-exchange-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "leadership-skills-club":{url:"leadership-skills-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "debate-club":{url:"debate-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "drama-expression-club":{url:"drama-expression-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "public-speaking-club":{url:"public-speaking-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "focus-reaction-training-club":{url:"focus-reaction-training-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "skill-development-club":{url:"skill-development-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "team-communication-club":{url:"team-communication-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "online-tournaments-club":{url:"online-tournaments-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "strategy-games-club":{url:"strategy-games-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "competitive-gaming":{url:"competitive-gaming",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "global-competitions-club":{url:"global-competitions-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "game-strategy-analysis-club":{url:"game-strategy-analysis-club",file:[{role:"",fileName:["clubsCommonContent.js","clubsCommon.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},
        "student-feedback":{url:"student-feedback",file:[{role:"",fileName:["studentfeedbackContent.js","studentfeedback.js"]}],funName:function(){},init: function(){},type:"JS",pageReqType:"IN"},

        // PARENT //
        "parent-student-login-details":{url:"",file:[{role:"",fileName:["studentParentLoginHistoryContent.js","studentParentLoginHistory.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-syllabus-assigned-teacher":{url:"",file:[{role:"",fileName:["parentSyllabusAssignedTeacherContent.js","parentSyllabusAssignedTeacher.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-fee-details":{url:"",file:[{role:"",fileName:["parentFeeDetailsContent.js","parentFeeDetails.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-download-academic-docs":{url:"",file:[{role:"",fileName:["parentAcademicDocsContent.js","parentAcademicDocs.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-academic-performance":{url:"",file:[{role:"",fileName:["parentAcademicPerformanceContent.js","parentAcademicPerformance.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "parent-progress":{url:"",file:[{role:"",fileName:["parentProgressContent.js","parentProgress.js","dashboardWeeklyProgress.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        
        // TEACHER //
        "teacher-home":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"IN"},
        "teacher-manage-slot":{url:"teacher-manage-class-time?moduleId="+moduleId,file:[{role:"",fileName:["timeAvailability.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "teacher-my-performance":{url:"teacher-my-performance?moduleId="+moduleId,file:[{role:"",fileName:["studentAssignedReportContent.js","studentAssignedReport.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "teacher-student-performance":{url:"teacher-student-performance?moduleId="+moduleId,file:[{role:"",fileName:["dashboardManageUser.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "assigned-courses":{url:"teacher-subject-content?moduleId="+moduleId,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "assigned-student":{url:"assigned-students-content?moduleId="+moduleId,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "teacher-login-details":{url:"",file:[{role:"",fileName:["teacherLoginHistoryContent.js","teacherLoginHistory.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "student-attendance":{url:"student-attendance-list?moduleId="+moduleId,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "class-management":{url:"teacher-class-management?moduleId="+moduleId,file:[{role:"",fileName:["studentAssignedReportContent.js","studentAssignedReport.js", "liveClassroomContent.js", "liveClassroom.js"]}],funName:function(){},type:"JSP",pageReqType:"IN"},
        "monthly-pay-slip":{url:"teacher-monthly-pay-slip/"+UNIQUEUUID+extraParam,file:[],funName:function(){},type:"JSP",pageReqType:"IN"},
        "create-manage-sessions":{url:"teacher-create-session-content?moduleId="+moduleId,file:[{role:"",fileName:["manageClassesContent.js","manageClasses.js", "scheduleClassContent.js","scheduleClass.js"]}],type:"JSP",init: function () {showAndHideDashboardAndAdditionalContent("additional");window.setTimeout(function(){getContent(moduleId, pageNo, replaceDiv, extraParam);}, 4000);},pageReqType:"IN"},
        "schedule-a-session":{url:"",file:[{role:"",fileName:["scheduleClassContent.js","scheduleClass.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "admin-task":{url:"",file:[{role:"",fileName:["adminTasksContent.js","adminTasks.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        
        // PARTNER //
        "time-availability":{url:"",file:[],funName:function(){},type:"JS",pageReqType:"EX",urlSend:"/timeavailability/time-availability?moduleId="+moduleId+"&schoolId="+SCHOOL_ID+"&euid="+USER_ID},
        "partner-enrollment-list":{url:"",file:[{role:"",fileName:["b2bPartnerContent.js","b2bPartner.js","signupStudentContent.js","signupStudentStage1.js","signupStudentStage2.js","signupStudentStage3.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "counselor-enrollment-list":{url:"",file:[{role:"",fileName:["CounselorDashboardContent.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "add-student-enrollment":{url:"",file:[{role:"",fileName:["b2bPartnerContent.js","b2bPartner.js","signupStudentContent.js","signupStudentStage1.js","signupStudentStage2.js","signupStudentStage3.js","signupCommon.js","cookiesLib.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "dashboard":{url:"",file:[{role:"",fileName:["b2bPartnerContent.js","b2bPartner.js","signupStudentContent.js","signupStudentStage1.js","signupStudentStage2.js","signupStudentStage3.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "partner-enrollment-students-wlp":{url:"",file:[{role:"",fileName:["partnerEnrollmentStudentsContent.js","partnerEnrollmentStudents.js","signupStudentContent.js","signupStudentStage1.js","signupStudentStage2.js","signupStudentStage3.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "counselor-dashboard":{url:"",file:[{role:"",fileName:["CounselorDashboardContent.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "add-sub-partner":{url:"",file:[{role:"",fileName:["b2bSubPartnerContent.js","b2bSubPartner.js", "leadsPartnerContent.js", "leadsPartner.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "partner-fee-structure":{url:"",file:[{role:"",fileName:["b2bPartnerFeeStructureContent.js","b2bPartnerFeeStructure.js", "leadsPartnerContent.js", "leadsPartner.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "partner-dashboard":{url:"",file:[{role:"",fileName:["b2bPartnerContent.js","b2bPartner.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        
        
        "conflicted-user-list":"conflicted-user-content?moduleId="+moduleId,
        "withdrawn-request-list":"withdrawn-request-list?moduleId="+moduleId+"&currentPage=0",replaceDiv,
        "lms-student-performance":"lms-student-mail?moduleId="+moduleId,
        // "student-weekly-progress":"student-weekly-progress?moduleId="+moduleId,
        "pending-training-remarks":"teacher-profile-request-content?moduleId="+moduleId+"&ids=16&types=0,1",
        "teacher-interview-slot":"meeting-slots-request-content?moduleId="+moduleId,
        "tips-educators":"tips-for-educator?moduleId="+moduleId,
        "set-teacher-comp":"set-teacher-compensation?moduleId="+moduleId,
        "manage-school-list":"school-profile-request-content?moduleId="+moduleId,
        "review-school-payment":"review-school-payment-content?moduleId="+moduleId,
        "rejected-school":"rejected-school-profile-content?moduleId="+moduleId,
        "date-visit-request":"school-date-of-visit-content?moduleId="+moduleId+"&visitSubmitted="+extraParam,
        "evaluation-form":"school-evaluation-form-content?moduleId="+moduleId,
        "manage-slots":"school-enabled-date-content?moduleId="+moduleId+"&startDate=&endDate=",
        "manage-course":"manage-subjects-content?moduleId="+moduleId,
        "manage-students":"choose-school-content?moduleId="+moduleId+"&schoolId=",
        "add-view-syllabus":"current-syllabus-request-content?moduleId="+moduleId +"&controlType=add",
        "manage-educational-counselor":"manage-counselor-content?moduleId="+moduleId,
        "inquiries":"inquiry-request-content?moduleId="+moduleId,
        "student-meet-slot":"demo-request-meeting-content?moduleId="+moduleId +"&requestType=REQUESTDEMO",
        "counselor-meet-slot":"demo-request-meeting-content?moduleId="+moduleId+"&requestType=COUNSELORMEET",
        "request-demo":"raise-demo-request-content?moduleId="+moduleId+"&requestRaisedBy=student&campaighn=admin&demotype=pool&demoClickFrom=list",
        "accept-demo-list":"raise-demo-request-content?moduleId="+moduleId+"&requestRaisedBy=student&campaighn=admin&demotype=accept&demoClickFrom=list",
        "meet-counselor":"raise-demo-request-content?moduleId="+moduleId+"&requestRaisedBy=student&campaighn=counselor&demoClickFrom=list",
        "ppc-student":"ppc-request-content?moduleId="+moduleId,
        "ppc-school":"raise-demo-request-content?moduleId="+moduleId+"&requestRaisedBy=school&demoClickFrom=list",
        "accelerated-mode":"accelerated-mode-students-details?moduleId="+moduleId,
        "user-feedback":{url:"",file:[{role:"",fileName:["reviewContent.js","review.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "question-list":{url:"",file:[{role:"",fileName:["feedbackQuestionContent.js","feedbackQuestion.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "lead-predict-list":{url:"",file:[{role:"",fileName:["leadPredictListContent.js","leadPredictList.js","B2CLead.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "enrollment-availability":{url:"",file:[{role:"",fileName:["enrollmentavailabilityContent.js","enrollmentavailability.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "enrollment-reports":{url:"",file:[],funName:function(){},type:"JS",init: function(){},pageReqType:"EX",urlSend:"/dashboard/enrollment-availability-view"},
        "email-template-tester":{url:"",file:[{role:"",fileName:["emailTemplateTesterContent.js","emailTemplateTester.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        "log-viewer":{url:"",file:[{role:"",fileName:["logViewerContent.js","logViewer.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
        
    };
    
    var pageMapJSPWithFun = {
        "student-orientation-list":"/dashboard/student-orientation-list?moduleId="+moduleId,
        "nongrading-students":"/dashboard/get-nongrading-students?moduleId="+moduleId,
        "flex-billing-report":"/dashboard/get-lmsbuzz-billing?moduleId="+moduleId,
        "critical-students":"/dashboard/get-critical-students?moduleId="+moduleId,
        "live-classroom-status":function(){
            var urlSend=APP_BASE_URL+SCHOOL_UUID+"/dashboard/live-classroom-status-new/"+UNIQUEUUID;
            window.open(urlSend, "_blank");
            customLoader(false);
        },
        "teacher-assign-form":"/report/teacher-assign-form?moduleId="+moduleId,
        
        "admission-reports":"/report/school-admission-reports?moduleId="+moduleId+"&schoolId="+SCHOOL_ID+"&countryId=101&sessionId="+SESSION_ID+"&euid="+ENCRYPTED_USER_ID,
        "reports":"/dashboard/school-data-reports?moduleId="+moduleId+"&schoolId="+SCHOOL_ID+"&year=",
        "school-reports":"/dashboard/school-data-reports?moduleId="+moduleId+"&schoolId="+SCHOOL_ID+"&year=",
        "manage-attendance":"/dashboard/get-student-attendance?moduleId="+moduleId,
        "lead-assign-form":"/dashboard/lead-assign-form?moduleId="+moduleId+"&todayDate=",
        "admin-partner-enrollment-list":"/dashboard/admin-partner-enrollment-list?moduleId="+moduleId,
        "meeting-management":'/dashboard/meeting-management-request?moduleId='+moduleId+'&schoolId='+SCHOOL_ID
    };

    var pageMapJS = {
        
        "manage-session":"manage-session",
        // "student-teacher-sessions":"student-teacher-sessions",
        "offline-classes":"offline-classes",
        "student-assigned-report":"student-assigned-report",
        // "admin-task":"admin-task",
        "email-logs":"email-logs",
        "email-status":"email-status",
        "extra-activity": "add-extra-activity?moduleId="+moduleId,
    };

    var requestType = pageRequest[pageNo];
    if (requestType.type == "JSP") {
        try{
            if(requestType.file.length>0){
              await  loadScript(requestType.file);
            }
            if(requestType.pageReqType != "EX"){
              await callForDashboardData("formIdIfAny", requestType.url, replaceDiv, extraParam);
            }
            if (requestType.init && typeof requestType.init === "function") {
                requestType.init();
            }
        }catch(error){
            console.error("Error fetching data:", error);
        }
    } else if(requestType.type == "JS") {
        if(requestType.file.length>0){
            await loadScript(requestType.file);
        }
        if(requestType.pageReqType == "IN"){
            getContent(moduleId, pageNo, replaceDiv, extraParam);
        }else if(requestType.pageReqType == "EX"){
            getAsPost(requestType.urlSend);
        }else{
            console.error("Invalid pageNo: " + pageNo);
        }
        if(typeof requestType.funName == "function"){
            requestType.funName();
        }
    } else {
        console.error("Invalid pageNo: " + pageNo);
    }
    // console.timeEnd();
    
}

// async function openEmailTemplateTesterModule() {
    
//     try {
//         await loadScript([{role:"",fileName:["emailTemplateTesterContent.js","emailTemplateTester.js"]}]);
//         if (typeof renderEmailTemplateTesterContent === "function") {
//             renderEmailTemplateTesterContent();
//         } else {
//             throw new Error("Email template tester renderer unavailable");
//         }
//     } catch (error) {
//         console.error("openEmailTemplateTesterModule error:", error);
//         showMessageTheme2(0, "Unable to open Email Template Tester");
//     } finally {
//         customLoader(false);
//     }
//     return false;
// }














// function callSchoolInneractionOld(actionType, arg0, replaceDiv, roleModuleId) {
//     var innerPageMap = {
//         "teacher-3syllabus":"teacher-syllabus-content"+arg0+"&moduleId="+roleModuleId,
//         "attendance":"attendance-content"+arg0,
//         "1a":"profile-view-content?userId="+arg0+"&actionType="+actionType+"&moduleId="+roleModuleId,
//         "edit-user":"create-user-edit?userId="+arg0,
//         "19a":"delete-user-content?u="+arg0,
//         "edit-courseDetails":"edit-course-content"+arg0,replaceDiv,
//         "edit-teacher-comp":"edit-teacher-compensation"+arg0,replaceDiv,
//         "teacher-agreement":"view-teacher-agreement-content"+arg0,replaceDiv
//     };
//     var url = innerPageMap[actionType];
//     if (url) {
//         callForDashboardData("formIdIfAny", url);
//     } else {
//         console.error("Invalid pageNo: " + actionType);
//     }
// }


async function callSchoolInneraction(actionType, arg0, replaceDiv, roleModuleId) {
    customLoader(true);
    var pageRequest = 
    {
      "teacher-agreement":{url:"view-teacher-agreement-content"+arg0,file:[{role:"",fileName:["jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js"]}],type:"JSP",pageReqType:"IN"},
      "edit-courseDetails":{url:"edit-course-content"+arg0,file:[],type:"JSP",pageReqType:"IN"},
      "attendance":{url:"attendance-content"+arg0,file:[],type:"JSP",pageReqType:"IN"},
      "extention":{url:"student-acacdemic-year-extention?subjectId="+arg0+"&moduleId="+roleModuleId+"&extraSubjStatus="+replaceDiv,file:[],type:"JSP",pageReqType:"IN"},
      "edit-user":{url:"create-user-edit?userId="+arg0,file:[],type:"JSP",pageReqType:"IN"},
      "1a":{url:"",file:[{role:"",fileName:["profileViewNewContent.js","profileViewNew.js", "jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js","circle-progress.js"]}],funName:function(){},type:"JS",pageReqType:"IN"},
      "profile-view":{url:"",file:[{role:"",fileName:["profileViewNewContent.js","profileViewNew.js", "jquery.ckeditor.js"]},{role:"js",fileName:["ckeditor.js","circle-progress.js"]}],funName:function(){},type:"JS",pageReqType:"IN"}
    };
    var requestType = pageRequest[actionType];
    if (requestType.type == "JSP") {
        try{
            if(requestType.file.length>0){
              await loadScript(requestType.file);
            }
            await callForDashboardData("formIdIfAny", requestType.url, replaceDiv, roleModuleId);
            if (requestType.init && typeof requestType.init === "function") {
            requestType.init();
            }
        }catch(error){
            console.error("Error fetching data:", error);
        }
    } else if(requestType.type == "JS") {
        if(requestType.file.length>0){
            await loadScript(requestType.file);
        }
        if(requestType.pageReqType == "IN"){
            getContent(roleModuleId, actionType, replaceDiv, arg0);
        }else if(requestType.pageReqType == "EX"){
            getAsPost(requestType.urlSend);
        }else{
            console.error("Invalid pageNo: " + pageNo);
        }
        if(typeof requestType.funName == "function"){
            requestType.funName();
        }
    }else{
        console.error("Page Request Invalid: " + actionType + ", Page Request Type: " + requestType.type);
    }
}

async function callInneraction(actionType, arg0) {
    if(!getSession()){
            redirectLoginPage();
    }else{
        customLoader(true);
        var pageRequest = 
        {
            "1a":{url:"",file:[{role:"",fileName:["adminProfileContent.js","adminProfile.js"]}],funName:function(){renderProfilePage(arg0);},type:"JS"},
        
        };
        var requestType = pageRequest[actionType];
        if (requestType.type == "JSP") {
            try{
                await callForDashboardData("formIdIfAny", requestType.url);
                if(requestType.file.length>0){
                    await  loadScript(requestType.file);
                }
                if (requestType.init && typeof requestType.init === "function") {
                requestType.init();
                }
            }catch(error){
                console.error("Error fetching data:", error);
            }
        } else if(requestType.type == "JS") {
            if(requestType.file.length>0){
              await loadScript(requestType.file);
            }
            if(typeof requestType.funName == "function"){
                requestType.funName();
            }
        }else{
            console.error("Page Request Invalid: " + actionType + ", Page Request Type: " + requestType.type);
        }
        
        // if (actionType == '1ta') {
        //     callForDashboardData('formIdIfAny', 'teacher-action?actionType=approve&ids=' + arg0);
        // } else if (actionType == '1td') {
        //     callForDashboardData('formIdIfAny', 'teacher-action?actionType=decline&ids=' + arg0);
        // } else if (actionType == '3a') {
        //     callForDashboardData('formIdIfAny', 'view-task-content?taskname=class_work&subjectid=' + arg0);
        // } else if (actionType == '3b') {
        //     callForDashboardData('formIdIfAny', 'view-task-content?taskname=home_work&subjectid=' + arg0);
        // } else if (actionType == 'inbox') {
        //     callForDashboardData('formIdIfAny', 'email-detail-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
        // } else if (actionType == 'sent') {
        //     callForDashboardData('formIdIfAny', 'email-detail-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
        // } else if (actionType == 'reply') {
        //     callForDashboardData('formIdIfAny', 'email-compose-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
        // } else if (actionType == 'forward') {
        //     callForDashboardData('formIdIfAny', 'email-compose-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
        // } else if (actionType == 'draft') {
        //     callForDashboardData('formIdIfAny', 'email-compose-content?emailType=' + actionType + '&emailId=' + arg0 + '&schoolId=' + SCHOOL_ID);
        // } else if (actionType == 'attendance') {
        //     callForDashboardData('formIdIfAny', 'attendance-content' + arg0);
        // } else if (actionType == '1a') {// It has been written in dashboardSchool.js
        //     //callForDashboardData('formIdIfAny', 'profile-view-content/' + SCHOOL_UUID + '?userId=' + arg0 + '&actionType=' + actionType);
        //     renderProfilePage(arg0);
        // } else if (actionType == '1StudentAdmin') {
        //     callForDashboardData('formIdIfAny', 'student-profile-view-content?userId=' + arg0);
        // } else if (actionType == '1ParentStudentAdmin') {
        //     callForDashboardData('formIdIfAny', 'profile-view-content/' + SCHOOL_UUID + '?userId=' + arg0 + '&actionType=' + actionType);
        //     //	}else if(actionType=='1ParentStudentAdmin'){														// no Use of that controller now 
        //     //		callForDashboardData('formIdIfAny','parent-student-profile-view-content?userId='+arg0);			//	view by common student profile
        // } else if (actionType == '1StudentLogin') {
        //     callForDashboardData('formIdIfAny', 'login-student-profile-view-content?userId=' + arg0);
        // } else if (actionType == '1teacherAdmin') {
        //     callForDashboardData('formIdIfAny', 'teacher-profile-view-content?userId=' + arg0);
        // } else if (actionType == '1ApproveTeacherAdmin') {
        //     callForDashboardData('formIdIfAny', 'approve-teacher-profile-view-content?userId=' + arg0);
        // } else if (actionType == '1RejectTeacherAdmin') {
        //     callForDashboardData('formIdIfAny', 'reject-teacher-profile-view-content?userId=' + arg0);
        // } else if (actionType == '1b') {
        //     callForDashboardData('formIdIfAny', 'edit-profile-content?userId=' + arg0);
        // } else if (actionType == 'schoolProfileView') {
        //     callForDashboardData('formIdIfAny', 'new-school-profile-view-content?userId=' + arg0);
        // } else if (actionType == 'rejectSchoolProfileView') {
        //     callForDashboardData('formIdIfAny', 'reject-school-profile-view-content?userId=' + arg0);
        // } else if (actionType == 'rejectSchoolProfileView') {
        //     callForDashboardData('formIdIfAny', 'reject-school-profile-view-content?userId=' + arg0);
        // }
    }
    
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
function sendEmailForCommon(userId, controlType) {
  hideMessageTheme2('');
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("common", "send-mail-content"),
    data: JSON.stringify(getRequestForSendEmailForCommon(userId, controlType)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
      }
      return false;
    }
  });
}

function saveDaysCountOfAcademicYearStart(formId) {
  var daysCount = $("#" + formId + " #daysCount").val();
  var daysCountMax = $("#" + formId + " #daysCountMax").val();
  var academicYearBlockDate = $("#" + formId + " #academicYearBlockDate").val();
  if (daysCount == "" || daysCount == undefined) {
    showMessageTheme2(0, " Lower limit is mandatory", "", false);
    return false;
  }
  if (daysCountMax == "" || daysCountMax == undefined) {
    showMessageTheme2(0, " Upper limit is mandatory", "", false);
    return false;
  }
  if (parseInt(daysCountMax) <= parseInt(daysCount)) {
    showMessageTheme2(
      0,
      " Upper limit can not be less or equal to lower limit",
      "",
      false
    );
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
    contentType: APPLICATION_JSON_VALUE,
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
        showMessageTheme2(0, data["message"], "", false);
      } else {
        showMessageTheme2(1, data["message"], "", false);
      }
    }
  });
}
function confirmationOfStudies(payload) {
  customLoader(false);
  urlSend =BASE_URL+CONTEXT_PATH+SCHOOL_UUID+"/dashboard/confirmation-of-studies?payload="+payload;
  window.open(urlSend, "_blank");
}
function callAllAcademicYear(formId) {
  resetDropdown($("#" + formId + " #academicYear"), "Select Academic Year");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForCommon("masters"),
    data: JSON.stringify(
      getRequestForMaster("formId", "ALL-ACADEMIC-YEAR-LIST", "academicYear")
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    async: false,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
        var result = data["mastersData"]["standards"];
        var dropdown = $("#" + formId + " #academicYear");
        dropdown.html("");
        dropdown.append('<option value="0">Select Academic Year</option>');
        $.each(result, function (k, v) {
          dropdown.append(
            '<option value="' +
              v.key +
              '">' +
              v.key +
              "-" +
              v.value +
              " </option>"
          );
        });
      }
    }
  });
}
function resetBulkTranscriptSearchFilter(formId) {
  $("#" + formId + " #academicYear").val("").trigger("change");
  $("#" + formId + " #certificateType").val("0").trigger("change");
  $("#" + formId + " #gradeDropDown").val("").trigger("change");
  $("#" + formId + " #showSealSignature").val("0").trigger("change");
  $("#" + formId + " #studentRollNumber").val("");
  $("#" + formId + " #studentEmail").val("");
  $("#" + formId + " #studentName").val("");
  $("#" + formId + " #className").val("");
}

function printStudentCertificates(formId, moduleId) {
  if (
    $("#" + formId + " #certificateType").val() == 0 ||
    $("#" + formId + " #certificateType").val() == undefined
  ) {
   showMessageTheme2(0, "Please choose certificate type");
    return false;
  }
  if ($("#" + formId + " #certificateType").val() == "AV") {
    if (
      $("#" + formId + " #showSealSignature").val() == 0 ||
      $("#" + formId + " #showSealSignature").val() == undefined
    ) {
     showMessageTheme2(0, "Please choose option from show Seal and Signature.");
      return false;
    }
  }
  var gradeId = $("#" + formId + " #gradeDropDown").val();
  var learningProgram = $("#" + formId + " #learningProgram").val();
  var academicYear = $("#" + formId + " #academicYear").val();
  var certificateType = $("#" + formId + " #certificateType").val();
  var showSealAndSignature = $("#" + formId + " #showSealSignature").val();
  var batchName = $("#" + formId + " #className").val();
  var studentName = $("#" + formId + " #studentName").val();
  var studentEmail = $("#" + formId + " #studentEmail").val();
  var studentRollNumber = $("#" + formId + " #studentRollNumber").val();
  var sortBy = $("#" + formId + " #sortBy").val();
  var startPosition = $("#" + formId + " #startPosition").val();
  var numberOfRecords = $("#" + formId + " #numberOfRecords").val();
  var transcriptStatus = $("#" + formId + " #transcriptStatus").select2("val");
  var data =
    "gradeId=" +
    gradeId +
    "&learningProgram=" +
    learningProgram +
    "&academicYear=" +
    academicYear +
    "&certificateType=" +
    certificateType +
    "&batchName=" +
    batchName +
    "&studentName=" +
    studentName +
    "&studentEmail=" +
    studentEmail +
    "&studentRollNumber=" +
    studentRollNumber +
    "&sortBy=" +
    sortBy +
    "&startPosition=" +
    startPosition +
    "&numberOfRecords=" +
    numberOfRecords +
    "&showSealAndSignature=" +
    showSealAndSignature +
    "&transcriptStatus=" +
    transcriptStatus +
    "&download=" +
    false;
  var urlSend = "/dashboard/print-certificates?" + data;
  getAsPost(urlSend);
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

function submitTeacherAgreement(formId, moduleId, roleModuleId, saveType) {
  if (roleModuleId == "" || roleModuleId == undefined) {
    roleModuleId = $("#userId").val();
  }
  hideMessageTheme2("");
  if ($("#" + formId + " #agreementRefNumber").val() == "") {
   showMessageTheme2(0, "Reference number is required");
    return false;
  }
  if ($("#" + formId + " #agreementDate").val() == "") {
   showMessageTheme2(0, "Agreement date is required");
    return false;
  }

  if ($("#" + formId + " #employeeType").val() == "") {
   showMessageTheme2(0, "Employment Type is required");
    return false;
  }
  if ($("#" + formId + " #typeOfTeacher").val() == "") {
   showMessageTheme2(0, "Type of Teacher is required");
    return false;
  }
  if ($("#" + formId + " #teacherDesignation").val() == "") {
   showMessageTheme2(0, "Teacher Designation is required");
    return false;
  }
  if ($("#" + formId + " #teacherDepartment").val() == "") {
   showMessageTheme2(0, "Teacher Department is required");
    return false;
  }
  if ($("#" + formId + " #employeeType").val() == "Full-Time") {
    if ($("#" + formId + " #workingHours").val() == "") {
     showMessageTheme2(0, "Working Hours per month is required");
      return false;
    }
    if ($("#" + formId + " #adminTaskHours").val() == "") {
     showMessageTheme2(0, "Admin Task Hours is required");
      return false;
    }
    if ($("#" + formId + " #payOut").val() == "") {
     showMessageTheme2(0, "Pay Out is required");
      return false;
    }
  }
  if (editor1.getData() == "") {
   showMessageTheme2(0, "Agreement content is required");
    return false;
  }
  var actualURL = "";
  // if(DEPLOYMENT_MODE=='PROD'){
  // 	actualURL='http://34.225.54.254:8080/edueye/'+UNIQUEUUID+'/api/v1/dashboard/submit-teacher-agreement-content';
  // }else{
  actualURL = getURLFor("dashboard", "submit-teacher-agreement-content");
  // }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: actualURL,
    data: JSON.stringify(
      getRequestForSubmitTeacherAgreement(formId, moduleId, saveType)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
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
        if(formId != "teacherEditAgreement"){
          var userId = $("#profileApprovalId #userId").val();
          $("#profileId_" + userId).remove();
        }
      }
      return false;
    }
  });
}

function getRequestForSubmitTeacherAgreement(formId, moduleId, saveType) {
  var request = {};
  var authentication = {};
  // var requestData = {};
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
  // requestData['teacherAgreementDTO'] = teacherAgreementDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["teacherAgreementDTO"] = teacherAgreementDTO;
  return request;
}
function redirectToBankDetailsOnProfileRequest(){
	if($('#profileApprovalId #remarksStatus').val()=="3"){
		$('#profileApproval').addClass('modal-xl');
		$('#profileApprovalId #pendingRemark').hide();
		$('#profileApprovalId #techerAgreementShow').show();
		$('#showAgreement1').show();
		$('#showRemark1').hide();
		$('#agreementRefNumber').val('');
		$('#agreementDate').val('');
		$('#remarksInterview').val('');
		$("#employeeSpecialization").select2()
		$('#employeeType').val('');
		$('#typeOfTeacher').val('');
		$('#teacherDesignation').val('');
		$('#teacherDepartment').val('');
		initEditor(1, 'techerAgreementTinymce','Please provide teacher agreement, if any', true);
		$('#employeeSpecialization').select2({
			theme:"bootstrap4",
			dropdownParent:".employeeSpecializationWrapper"
		});
	}else{
		$('#profileApproval').removeClass('modal-xl');
		$('#profileApprovalId #pendingRemark').show();
		$('#showAgreement1').hide();
		$('#showRemark1').show();
		$('#profileApprovalId #techerAgreementShow').hide();
	}
}

function showTeacherStatusPopup(message,status,gotoId,userId,meetingVendor) {
  $("#userIdforGoto").val(userId);
  $("#gotoId").val(gotoId);
  $("#meetingvendor").val(meetingVendor);
  if (status == "Active") {
    $("#statusMessage-1").html('<i class="fa fa-user-plus text-primary fa-4x"></i>');
    $("#showMessageCreateUser .modal-header").addClass("bg-primary").removeClass("bg-danger, bg-success");
    $("#resetDeleteErrorWarningNo").text("Inactivate").addClass("btn-primary").removeClass("btn-danger,btn-success");
  } else if (status == "Inactive") {
    $("#statusMessage-1").html('<i class="fa fa-times text-danger fa-4x"></i>');
    $("#showMessageCreateUser .modal-header").addClass("bg-danger").removeClass("bg-success, bg-primary");
    $("#resetDeleteErrorWarningNo").text("Activate").addClass("btn-danger").removeClass("btn-success, btn-primary");
  } else if (status == "create") {
    $("#statusMessage-1").html('<i class="fa fa-check text-success fa-4x"></i>');
    $("#showMessageCreateUser .modal-header").addClass("bg-success").removeClass("bg-danger, bg-primary");
    $("#resetDeleteErrorWarningNo").text("Create").addClass("btn-success").removeClass("btn-danger, btn-primary");
  }
  $("#gotoMeetingUserstatus").html(message);
  $("#showMessageCreateUser").modal("show");
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

function saveCourse(formId, moduleId, courseId, controlType, roleModuleId) {
  hideMessageTheme2("");
  if (!validateRequestForAddCourse(formId, controlType)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "save-course-details"),
    data: JSON.stringify(
      getRequestForSaveCourse(formId, moduleId, courseId, controlType)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#courseInfoModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-categories");
        }, 1000);
      }
      return false;
    }
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
   showMessageTheme2(0, "Invalid control type.");
    return false;
  }
  if (controlType == "delete") {
  } else {
    if (
      $("#" + formId + " #standardId").val() == 0 &&
      controlType != "delete"
    ) {
     showMessageTheme2(0, "Please choose grade.");
      return false;
    }
    if (
      $("#" + formId + " #courseName").val() == "" &&
      controlType != "delete"
    ) {
     showMessageTheme2(0, "Please enter category name.");
      return false;
    }
    if ($("#" + formId + " #orderId").val() == "" && controlType != "delete") {
     showMessageTheme2(0, "Please set order.");
      return false;
    }
    if ($("#" + formId + " #creditId").val() == "0.0") {
     showMessageTheme2(0, "Please set credit limit.");
      return false;
    }
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
  hideMessageTheme2("");
  if (!validateRequestForAddSubjectB2C(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "save-subejctB2C-details"),
    data: JSON.stringify(
      getRequestForSaveSubjectB2C(formId, moduleId, subjectId, isForDelete)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#subjectInfoModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "manage-courses");
        }, 1000);
      }
      return false;
    }
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
  hideMessageTheme2("");
  if (!validateRequestForAddSubjectB2C(formId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(0, data["message"]);
        $("#placementSubjectInfoModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool("31");
        }, 1000);
      }
      return false;
    }
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

function submitScholarship(
  formId,
  moduleId,
  modalId,
  isForSpecificUser,
  controlType,
  scholarId,
  roleModuleId
) {
  hideMessageTheme2("");
  if ("add" == controlType) {
    if (!validateRequestForSubmitScholarship(formId, moduleId, modalId)) {
      return false;
    }
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("dashboard", "scholar-submit"),
    data: JSON.stringify(
      getRequestForSubmitScholarship(
        formId,
        moduleId,
        isForSpecificUser,
        controlType,
        scholarId
      )
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        showMessageTheme2(0, data["message"]);
      } else {
        showMessageTheme2(1, data["message"]);
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
      //showMessageTheme2(true, e.responseText);
      return false;
    },
  });
}

function getRequestForSubmitScholarship(
  formId,
  moduleId,
  isForSpecificUser,
  controlType,
  scholarId
) {
  var request = {};
  var authentication = {};
  var requestData = {};
  var scholarShipCodeDTO = {};
  if ("add" == controlType) {
    scholarShipCodeDTO["scholarId"] = $("#" + formId + " #ScholarCodeId").val();
    scholarShipCodeDTO["scholarCodeName"] = $("#" + formId + " #scholarCode").val();
    scholarShipCodeDTO["scholarMadeFor"] = $("#" + formId + " #scholarMadeFor option:selected" ).text();
    scholarShipCodeDTO["learningPlan"] = $("#" + formId + " #learningPlan").val();
    scholarShipCodeDTO["scholarApplicableFor"] = $("#" + formId + " #scholarApplicableFor option:selected" ).text();
    scholarShipCodeDTO["scholarType"] = $("#" + formId + " #scholarType option:selected" ).val();
    scholarShipCodeDTO["scholarPercent"] = $("#" + formId + " #scholarPercent").val();
    scholarShipCodeDTO["scholarValidDays"] = $("#" + formId + " #scholarValid").val();
    scholarShipCodeDTO["scholarStatus"] = "1";
    scholarShipCodeDTO["isForSpecificUser"] = isForSpecificUser;
    scholarShipCodeDTO["startDate"] = $("#" + formId + " #scholarStartDate").val();
    scholarShipCodeDTO["endDate"] = $("#" + formId + " #scholarEndDate").val();
    scholarShipCodeDTO["controlType"] = controlType;
  } else {
    scholarShipCodeDTO["scholarId"] = scholarId;
    scholarShipCodeDTO["scholarStatus"] = "0";
    scholarShipCodeDTO["controlType"] = controlType;
  }
  //requestData["scholarShipCodeDTO"] = scholarShipCodeDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;
  request["scholarShipCodeDTO"] = scholarShipCodeDTO;
  return request;
}

function validateRequestForSubmitScholarship(formId, moduleId, modalId) {
  if (
    $("#" + formId + " #scholarCode").val() == 0 ||
    $("#" + formId + " #scholarCode").val() == null
  ) {
   showMessageTheme2(0, "Discount Code Name is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarMadeFor").val() == undefined ||
    $("#" + formId + " #scholarMadeFor").val() == ""
  ) {
   showMessageTheme2(0, "Please fill Discount Code for");
    return false;
  }
  if (
    $("#" + formId + " #learningPlan").val() == undefined ||
    $("#" + formId + " #learningPlan").val() == ""
  ) {
   showMessageTheme2(0, "Learning Plan is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarApplicableFor").val() == undefined ||
    $("#" + formId + " #scholarApplicableFor").val() == ""
  ) {
   showMessageTheme2(0, "Applicability of Discount Code Name is required.");
    return false;
  }
  if (
    $("#" + formId + " #scholarStartDate").val() == "" ||
    $("#" + formId + " #scholarStartDate").val() == null
  ) {
   showMessageTheme2(0, "Discount Start Date is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarEndDate").val() == "" ||
    $("#" + formId + " #scholarEndDate").val() == null
  ) {
   showMessageTheme2(0, "Discount End Date is required");
    return false;
  }
  var date = $("#scholarStartDate").val();
  var newDate = date.split("-");
  var startDate = new Date(newDate[2] + "-" + newDate[0] + "-" + newDate[1]);

  var date1 = $("#scholarEndDate").val();
  var newDate1 = date1.split("-");
  var endDate = new Date(newDate1[2] + "-" + newDate1[0] + "-" + newDate1[1]);

  if (endDate < startDate) {
    showMessageTheme2( 0,"Discount End Date should be greater than Discount Start Date.");
    return false;
  }
  if (
    $("#" + formId + " #scholarType").val() == 0 ||
    $("#" + formId + " #scholarType").val() == null
  ) {
   showMessageTheme2(0, "Discount type is required");
    return false;
  }
  if (
    $("#" + formId + " #scholarPercent").val() == 0 ||
    $("#" + formId + " #scholarPercent").val() == null
  ) {
   showMessageTheme2(0, "Please enter Discount amount");
    return false;
  }
  return true;
}

function callScholarshipAssignedUserList(scholarId, scholarCode) {
  var data = { scholarId: scholarId, scholarCode: scholarCode, themetype:'theme2' };
  $.ajax({
    type: "POST",
    url: getURLForHTML("dashboard", "scholarship-assigned-user-list"),
    contentType: APPLICATION_JSON_VALUE,
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
         showMessageTheme2(0, stringMessage[1]);
        } else {
          $("#scholarshipAssignedList").html(htmlContent);
          $("#viewAvailedScholarshipModal").modal("show");
        }
        return false;
      }
    }
  });
}

function sendToSpecificUser(formId, moduleId, isForSpecificUser, roleModuleId) {
  if ($("#" + formId + " #userStudentId").val() == "") {
   showMessageTheme2(0, "Please enter student id");
    return false;
  }
  if ($("#" + formId + " #scholarshipApplicableFor").val() == "") {
   showMessageTheme2(0, "Please select applicable for option");
    return false;
  }

  hideMessageTheme2("");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("school", "send-scholarshipCode-to-user"),
    data: JSON.stringify(
      getRequestForSpecificUserScholarship(formId, moduleId, isForSpecificUser)
    ),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
       showMessageTheme2(1, data["message"]);
        $("#addSpecificModal").modal("hide");
        setTimeout(function () {
          callDashboardPageSchool(roleModuleId, "scholarship");
        }, 1000);
      }
      return false;
    }
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
  scholarShipCodeDTO["userEmailId"] = $("#" + formId + " #userStudentId").val();
  scholarShipCodeDTO["isForSpecificUser"] = isForSpecificUser;
  scholarShipCodeDTO["scholarshipApplicableFor"] = $(
    "#" + formId + " #scholarshipApplicableFor"
  ).val();

  request["scholarShipCodeDTO"] = scholarShipCodeDTO;
  authentication["hash"] = getHash();
  authentication["schoolId"] = SCHOOL_ID;
  authentication["schoolUUID"] = SCHOOL_UUID;
  authentication["userType"] = moduleId;
  authentication["userId"] = $("#" + formId + " #userId").val();
  request["authentication"] = authentication;

  return request;
}
