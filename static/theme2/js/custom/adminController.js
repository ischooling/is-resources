var schoolSettingsLinks;
var schoolSettingsTechnical;
var schoolSettings;
var schoolSettingsOffice;
var commonProfileDTO;
var schoolList;
var CALENDAR_EVENT=false;
var parentColor;

async function initiateSetting(){
    try {
        schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
        schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
        schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
        commonProfileDTO = await getUserShortProfile(USER_ID);
        schoolList = await getOfflineSchoolList(USER_ID);

        parentColor = schoolSettingsTechnical.parentColor;
        SCHOOL_TYPE = schoolSettingsOffice.schoolType;

    } catch (e) {
        console.error("initiateSetting failed:", e);
        showMessageTheme2(0, "Failed to load initial settings.");
    }
}

initiateSetting();

const contentHandlers = {
    'student-home': () => { CALENDAR_EVENT = false; rendereDashboardContent(isParent); },
    'student-addon': () => renderBuyExtraClasses(USER_ID),
    'book-a-session': ({ moduleId }) => renderBookClassContent('', '', '', true, moduleId),
    'home': () => renderSchoolDashboard('School Dashboard', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'module': () => renderModuleListDashboard('Module List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'modulerole': () => renderRoleListDashboard('Roles List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'user-list': () => renderAdminManageUserListDashboard('Admin Users', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'online-user': () => renderOnlineUserListDashboard('Live Online Users', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'delete-user': () => renderDeletedUserListDashboard('Delete User List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'assign-orientation': () => renderStudentOrientationAssignDashboard('Assign Users', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'student-orientation-list': () => renderStudentOrientationListDashboard('System training Students List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'manage-lms-user': () => initManageLmsUser(),
    'manage-session': () => initManageSession(),
    'extra-session-details': () => initExtraSessionDetails(),
    'student-teacher-sessions': () => initStudentTeacherSessions(),
    'auto-progress-report': () => renderAutoProgressReportDashboard("Bulk Student Progress Report", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'teacher-screening-profiles': () => initTeacherScreeningProfiles(),
    'teacher-profile': () => renderReceivedTeachedProfileListDashboard('Received Teacher Profile', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'pending-interview-remarks': () => renderPendingContractListDashboard('Pending Contract', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'teacher-profile-pending-verification': () => renderPendingVerificationTeachedProfileListDashboard('Pending Verification', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'teacher-profile-pending-bank-details': () => renderBankDetailsTeacherProfleListDashboard('Pending Bank Details', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'approved-teachers': () => renderApprovedTeacherDashboard("Approved Teachers", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, "0", "0,1", "approved"),
    'rejected-teachers': () => renderRejectedTeacherListDashboard('Rejected Teachers', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'withdraw-teachers': () => renderApprovedTeacherDashboard("Withdrawn Teachers", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, "1", "0,1", "withdraw"),
    'teacher-assign-interview': () => renderTeacherInterviewAssignDashboard('Assign Teacher Interview', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'payment': () => initPayment(),
    'invoice': () => initInvoice(),
    'lead-report-list': () => initLeadReportList(),
    'lead-detail-by-campaign': () => initLeadDetailByCampaign(),
    'lead-report-campaign': () => initLeadReportCampaign(),
    'lead-list': () => initLeadList(),
    'lead-assign-form': () => renderLeadAssignDashboard('Lead Assign Form', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'admin-partner-enrollment-list': () => renderPartnerList('Student Enrollments', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'lead-demo-list': () => renderMeetingTimeDashboard('Lead Demo Calendar', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'lead-demo-report': () => renderLeadDemoReportDashboard('Lead Demo Report', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'lead-predict-list': () => renderLeadPredictListDashboard('Lead Predict List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'lead-setting': () => initLeadSetting(),
    'email-status': () => $("#dashboardContentInHTML").html(getEmailVerifyContent("Email Verification", false)),
    'email-logs': () => initEmailLogs(),
    'wati-numbers': () => renderWatiNumbersContent(),
    'partner-school-payment': () => initPartnerSchoolPayment(),
    'graduation-ceremony-attendees': () => initGraduationCeremonyAttendees(),
    'event-discount': () => initEventDiscount(),
    'user-screening-profiles': () => initUserScreeningProfiles(),
    'teacher-home': () => { CALENDAR_EVENT = false; rendereTeacherHomeContent(); },
    'create-manage-sessions': () => initCreateManageSessions(),
    'schedule-a-session': () => initScheduleASession(),
    'admin-task': () => initAdminTask(),
    'partner-dashboard': () => renderPartnerDashboard('Partner Dashboard', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'partner-enrollment-list': () => renderPartnerList('Student Enrollments', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'add-student-enrollment': () => enrollmentPartnerStudent(0),
    'dashboard': () => initDashboard(),
    'partner-enrollment-students-wlp': () => initPartnerEnrollmentStudentsWlp(),
    'dashboard-monitoring': () => getDashboardMonitoringContent(),
    'counselor-dashboard': () => renderCounselorDashboard('Counselor Dashboard', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'counselor-enrollment-list': () => renderCounselorEnrollList('Student Enrollments', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'task': () => renderTaskListDashboard("Task", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'add-sub-partner': () => renderB2BSubPartnerContent("Sub Partner List", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'partner-fee-structure': () => renderB2BPartnerFeeStructureContent("Fee Structure", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'profile-view': ({ extraParam }) => renderStudentProfilePage(extraParam),
    'payment-reports': () => getPaymentReportContent(),
    'onboarded-teacher-list': () => getOnboardedTeacherContent(),
    'user-feedback': () => getReviewDashboardContent('User Feedback', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'question-list': () => getQuestionDashboardContent('Question List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'clubs': () => renderClubsPage("Clubs"),
    'manage-club': () => renderManageClubsPage("Manage Clubs"),
    'spanish-club': () => renderClubsCommonPage("Spanish Club"),
    'french-club': () => renderClubsCommonPage("French Club"),
    'german-club': () => renderClubsCommonPage("German Club"),
    'english-club': () => renderClubsCommonPage("English Club"),
    'chinese-club': () => renderClubsCommonPage("Chinese Club"),
    'team-building-club': () => renderClubsCommonPage("Team Building Club"),
    'cultural-exchange-club': () => renderClubsCommonPage("Cultural Exchange Club"),
    'leadership-skills-club': () => renderClubsCommonPage("Leadership Skills Club"),
    'debate-club': () => renderClubsCommonPage("Debate Club"),
    'drama-expression-club': () => renderClubsCommonPage("Drama & Expression Club"),
    'public-speaking-club': () => renderClubsCommonPage("Public Speaking Club"),
    'focus-reaction-training-club': () => renderClubsCommonPage("Focus & Reaction Training Club"),
    'skill-development-club': () => renderClubsCommonPage("Skill Development Club"),
    'team-communication-club': () => renderClubsCommonPage("Team Communication Club"),
    'online-tournaments-club': () => renderClubsCommonPage("Online Tournaments Club"),
    'strategy-games-club': () => renderClubsCommonPage("Strategy Games Club"),
    'competitive-gaming': () => renderClubsCommonPage("Competitive Gaming Club"),
    'global-competitions-club': () => renderClubsCommonPage("Global Competitions Club"),
    'game-strategy-analysis-club': () => renderClubsCommonPage("Game Strategy & Analysis Club"),
    'parent-student-login-details': () => renderStudentParentLoginHistoryPage('Login History', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'parent-syllabus-assigned-teacher': () => renderParentSyllabusAssignedTeacherPage('Assigned Course Teachers', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'parent-fee-details': () => renderParentFeeDetailsPage('Fee Details', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'parent-download-academic-docs': () => renderParentAcademicDocsPage('Academic Documents', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'parent-academic-performance': () => renderParentAcademicPerformancePage('Academic Performance', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'parent-progress': () => renderParentProgressPage('Progress Report', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'student-login-details': ({ extraParam }) => renderStudentLoginHistoryPage(extraParam),
    'teacher-login-details': () => renderTeacherLoginHistoryPage('Login History', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'syllabus-assigned-teacher': () => renderStudentSyllabusAssignedTeacherPage('Assigned Course Teachers', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'academic-year-extention': () => renderStudentAcademicYearExtentionPage('Academic Year Extension', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'fee-details': () => renderStudentFeeDetailsPage('Fee Details', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'student-progress-report': () => renderStudentAcademicPerformancePage('Academic Performance', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'progress-detail': () => renderStudentProgressDetailPage('Progress Report', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'student-feedback': () => renderStudentFeedbackPage('Student Feedback', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'student-handbook': () => renderStudentHandbookPage('Student Handbook', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'batch-student-examination-sheet': () => renderStudentExaminationSheetPage("Student's Examination Schedule", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE),
    'Parent-dashboard': () => renderParentDashboardContent(),
    'parent-class-schedule': () => renderParentStudentClassScheduleContent(),
    'parent-attendance': () => renderAtendaceByStudentIdContent(),
    'enrollment-availability': () => renderEnrollmentAvalabilityContent(),
    'enrollment-reports': () => renderEnrollmentAvalabilityReportContent(),
    'email-template-tester': () => getEmailerTemplateViewerContent(),
    'release-note': ({ pageNo, moduleId, extraParam }) => renderReleaseNoteDashboardPage(pageNo, moduleId, roleAndModule, extraParam),
    'release-note-admin-list': ({ pageNo, moduleId, extraParam }) => renderReleaseNoteDashboardPage(pageNo, moduleId, roleAndModule, extraParam),
    'release-note-admin-editor': ({ pageNo, moduleId, extraParam }) => renderReleaseNoteDashboardPage(pageNo, moduleId, roleAndModule, extraParam),
    'release-note-user-list': ({ pageNo, moduleId, extraParam }) => renderReleaseNoteDashboardPage(pageNo, moduleId, roleAndModule, extraParam),
    'log-viewer': () => renderLogViewerContent(),
    'lead-logs': () => renderCounselorLeadLogsDashboard('Lead Logs',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY)
};

const getLeadCategory = () => {
    let category = "B2C";
    if (USER_ROLE == "B2B_LEAD") category = "B2B";
    if (SCHOOL_TYPE == 'WLP') category = "B2B";
    return category;
};

function initManageLmsUser() {
    $('#dashboardContentInHTML').html(getManageLmsUserContent('Manage LMS User', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    getSessionMasterList('lmsStudentFilter', 'activeSession', false);
    $("#standardId").select2({ theme: "bootstrap4" });
    $("#standardId option[value='17']").remove();
    $(".filterDates").datepicker({ todayBtn: 1, autoclose: true, format: 'M dd, yyyy', todayHighlight: true });
}

function initManageSession() {
    $('#dashboardContentInHTML').html(getManageSessionUserContent('Manage Enrollments', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    $("#standardId").select2({ theme: "bootstrap4", dropdownParent: "#lmsStudentFilter" });
    $("#standardId option[value='17']").remove();
    $(".filterDates").datepicker({ todayBtn: 1, autoclose: true, format: 'M dd, yyyy', todayHighlight: true });
    getSessionMasterList('lmsStudentFilter', 'sessionId', false);
}

function initExtraSessionDetails() {
    $("#dashboardContentInHTML").html(renderManageClassContent('Manage Extra Classes', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    getExtraSessionDetails('extraSessionDetails', 0, '' + roleAndModule.moduleId + '');
    $("#extraDetailSearch").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            getExtraSessionDetails('extraSessionDetails', 0, '' + roleAndModule.moduleId + '');
        }
    });
}

function initStudentTeacherSessions() {
    console.log("hello");
    $('#dashboardContentInHTML').html(getManageSessionContent('Classes', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    $('#classJoinInSameWindowModal').remove();
    $("body").append(calendarMeetingLinkValidate());
    $(".filterDates").datepicker("destroy");
    $('.filterDates').datepicker({ autoclose: true, format: 'M dd, yyyy' });
    $('#dashboardContentInHTML').append(getUpdateManageMeetingResultModal(roleAndModule, USER_ROLE));
    $('#dashboardContentInHTML').append(getMeetingUrlModal(roleAndModule, USER_ROLE));
    $('#dashboardContentInHTML').append(getSendMailModal(roleAndModule, USER_ROLE));
    $('#dashboardContentInHTML').append(getPublicRecordModal(roleAndModule, USER_ROLE));
    $('#dashboardContentInHTML').append(getRevokeModal(roleAndModule, USER_ROLE));
    getSessionMasterList('classroomSessionFilter', 'sessionId', false);
    $('#classroomSessionFilter #sessionId').select2({ theme: "bootstrap4", dropdownParent: "#classroomSessionFilter" });
}

async function initTeacherScreeningProfiles() {
    await getRenderTeacherPreScreeningProfileContent("Teacher Applications", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE);
    $("#filterGrades").select2({ theme: "bootstrap4" });
    $("#filterCourses").select2({ theme: "bootstrap4" });
    teacherScreeningProfileOnloadFunction();
}

function initPayment() {
    isDiscountApplied = false;
    $("#dashboardContentInHTML").html(getManagePaymentContent("Payment Details", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    getSessionMasterList("advancePaymentSearchForm", "academicSession", false);
    callCountries("advancePaymentSearchForm", "", "countryId");
    if (SCHOOL_ID == 4 || SCHOOL_ID == 5) {
        $("#gradeId option[value=9]").remove();
        $("#gradeId option[value=10]").remove();
    }
    $("#advSerch .modal-body .multiselect-dropdown").select2({ placeholder: "Select an option", theme: "bootstrap4", dropdownParent: "#advSerch .modal-body", minimumResultsForSearch: Infinity });
    $("#paymentType1").on("change", function () {
        if ($(this).val() == "REGISTRATION_FEE_ADV") {
            $("#addStudentPaymentForm #paymentName1").val("Reserve a Seat for " + getNextGrade('addStudentPaymentForm', 'standardId1'));
            $("#addStudentPaymentForm #paymentName1").prop("disabled", true);
        } else {
            $("#addStudentPaymentForm #paymentName1").val("");
            $("#addStudentPaymentForm #paymentName1").prop("disabled", false);
        }
    });
    $("#addPaymentModal .modal-body .multiselect-dropdown").select2({ placeholder: "Select an option", theme: "bootstrap4", dropdownParent: "#addPaymentModal .modal-body", minimumResultsForSearch: Infinity }).on("change", function () {
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
    $("#paymentDate1").datepicker({ autoclose: true, endDate: new Date(), format: "mm-dd-yyyy", disableTouch: false });
    $("#scheduleDate1").datepicker({ startDate: new Date(), autoclose: true, format: "mm-dd-yyyy", disableTouch: false });
    $("#addCountryId").select2({ theme: "bootstrap4", dropdownParent: "#addPaymentModal" });
    $("#addStateId").select2({ theme: "bootstrap4", dropdownParent: "#addPaymentModal" });
    $("#addCityId").select2({ theme: "bootstrap4", dropdownParent: "#addPaymentModal" });
    getAllCountryList('addPaymentModal', 'addCountryId');
    $("select#addCountryId").on("change", function () { callStates('addPaymentModal', this.value, 'addCountryId', 'addStateId'); });
    $("select#addStateId").on("change", function () { callCities('addPaymentModal', this.value, 'addStateId', 'addCityId'); });
}

function initInvoice() {
    $("#dashboardContentInHTML").hide();
    $("#dashboardContentInHTMLAdditional").show();
    renderInvoiceContent("Y", "Y", "", true);
}

function initLeadReportList() {
    LEAD_CATEGORY = getLeadCategory();
    renderCounselorLeadReportDashboard('Lead Report', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, LEAD_CATEGORY);
}

function initLeadDetailByCampaign() {
    LEAD_CATEGORY = getLeadCategory();
    renderCounselorLeadReportDashboard('Lead Detail By Campaign', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, LEAD_CATEGORY, 'campaign');
}

function initLeadReportCampaign() {
    LEAD_CATEGORY = getLeadCategory();
    renderLeadReportCampaignDashboard('Lead Campaign',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY)
}

function initLeadList() {
    LEAD_CATEGORY = getLeadCategory();
    $('#dashboardContentInHTML').html(renderCounselorLeadListDashboard('Lead List', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, LEAD_CATEGORY));
}

function initLeadSetting() {
    LEAD_CATEGORY = getLeadCategory();
    renderLeadSettingDashboard('Lead Settings', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, LEAD_CATEGORY);
}

function initEmailLogs() {
    $("#dashboardContentInHTML").html(getEmailLogsContent("Email Logs"));
    $("#startDate").datepicker({ autoclose: true, format: 'yyyy-mm-dd' });
    $("#endDate").datepicker({ autoclose: true, format: 'yyyy-mm-dd' });
    $("#classStatus").select2({ theme: "bootstrap4", minimumResultsForSearch: Infinity });
    $("#markStatus").select2({ theme: "bootstrap4" });
    $("#sortBy").select2({ theme: "bootstrap4", minimumResultsForSearch: Infinity });
    getEmailLogsByEmail();
}

function initPartnerSchoolPayment() {
    $('#dashboardContentInHTML').html(renderSchoolPayment());
    initializeSchoolPaymentPage();
    getPartnerSchoolList();
}

function initGraduationCeremonyAttendees() {
    $("#dashboardContentInHTML").html(getGraduationCeremonyAttendeesContent("Graduation Ceremony Attendees", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    loadGraduationCeremonyAttendees();
}


function initEventDiscount() {
    $('#dashboardContentInHTML').html(getEventDiscountPageContent('Event Discount'));
    eventDiscountOnLoad();
}

function initUserScreeningProfiles() {
    $('#dashboardContentInHTML').html(renderUserApplicationContent("Job Applicants", roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    userApplicationProfileOnloadFunction();
}

function initCreateManageSessions() {
    $('#dashboardContentInHTMLAdditional').html(getManageSessionContentTeacher('All Classes', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    $(".filterDates").datepicker("destroy");
    $('.filterDates').datepicker({ autoclose: true, format: 'dd-mm-yyyy' });
    $('#dashboardContentInHTMLAdditional').append(getUpdateMeetingResultModal(roleAndModule, USER_ROLE));
    $('#dashboardContentInHTMLAdditional').append(getMeetingUrlModal(roleAndModule, USER_ROLE));
    $('#dashboardContentInHTMLAdditional').append(getSendMailModal(roleAndModule, USER_ROLE));
    $("#standardId").select2({ theme: "bootstrap4" });
    $("#classStatus").select2({ theme: "bootstrap4", minimumResultsForSearch: Infinity });
    $("#markStatus").select2({ theme: "bootstrap4" });
    $("#sortBy").select2({ theme: "bootstrap4", minimumResultsForSearch: Infinity });
}

async function initScheduleASession() {
    $('#dashboardContentInHTML').html(await getScheduleSessionContentTeacher('Book a Class', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    generateTinyUrls();
    $("#meetingDate").datepicker("destroy");
    $("#meetingDate").datepicker({ autoclose: true, startDate: new Date(), format: 'M dd, yyyy', container: '.meetingDateWrapper' });
    $(".filterDates").datepicker("destroy");
    $('.filterDates').datepicker({ autoclose: true, format: 'M dd, yyyy' });
    $('#showMeetingModalDiv').show();
    await getTimeZones('classroomSessionFilter', 'countryTimezone', 'countryTimezoneId');
    await getTeacherAssignedGrade('classroomSessionFilter', USER_ID);
    $("#countryTimezone").select2({ theme: "bootstrap4" });
    $("#studentName").select2({ theme: "bootstrap4" });
    $("#startFromTime").select2({ theme: "bootstrap4" });
}

function initAdminTask() {
    $('#dashboardContentInHTML').html(getAdminTaskContent('Admin Tasks', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    getTeacherDetails('adminTaskFilter', 'userId', 'userIdOfflineClass', SCHOOL_ID);
    $('#adminTaskFilter #userId').select2({ theme: "bootstrap4" });
    $(".filterDates").datepicker({ todayBtn: 1, autoclose: true, format: 'M dd, yyyy', todayHighlight: true });
    getMeetingVendorUserStatus(SCHOOL_ID, USER_ID, 'LENS');
}

function initDashboard() {
    if (SCHOOL_TYPE == "WLP") {
        $('#dashboardContentInHTML').html(renderPartnerDashboard('Partner Dashboard', roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE));
    } else {
        callForDashboardData("formIdIfAny", "dashboard-content?moduleId=" + moduleId);
    }
}

function initPartnerEnrollmentStudentsWlp() {
    $('#dashboardContentInHTML').html(renderSchoolEnrollmentStudents(`${schoolSettingsOffice.schoolType == "WLP" ? "Student Enrollment List" : "Enrollment Partner Student List"}`));
    getSchoolSessionMasterList('partnerEnrollFilterForm', "academicYear", SCHOOL_ID);
    callPartnerCountries('partnerEnrollFilterForm', 0, 'countryId');
    getPartnerSchools(SCHOOL_ID);
    callAllStandardList('partnerEnrollFilterForm', 'gradeId');

    $("select#schoolName").on("change", function () { getSchoolSessionMasterList('partnerEnrollFilterForm', "academicYear", this.value); });
    $("select#countryId").on("change", function () { callStates('partnerEnrollFilterForm', this.value, 'countryId'); });
    $("select#stateId").on("change", function () { callCities('partnerEnrollFilterForm', this.value, 'stateId'); });
    $("select#partnerName").on("change", function () { $("#referralCode").val($('option:selected', this).attr('dail-referral-code')); });

    $("#partnerName, #academicYear, #enrollmentStatus, #learningProgram, #gradeId, #commissionStatus, #countryId, #stateId, #cityId").select2({ theme: "bootstrap4" });
    $("#paymentDateFrom, #paymentDateTo").datepicker({ autoclose: true, format: 'M dd, yyyy' });

    $(".follow-up-no").click(function () {
        $(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
        $(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
        $(this).parent().find(".follow-up-content").slideDown();
        $(this).parent().siblings().find(".follow-up-content").slideUp();
        $(this).parent().addClass("follow-up-accordian-active");
        $(this).parent().siblings().removeClass("follow-up-accordian-active");
    });

    callStudentListByPartnerWLP('partnerEnrollFilterForm');
    $("#searchEnrolled").on('click', function () {
        currentPagePartnerEnrollmentList = 1;
        callStudentListByPartnerWLP('partnerEnrollFilterForm');
    });

    $("#startDate").datepicker({ autoclose: true, format: 'M dd, yyyy' }).on('changeDate', function (e) {
        $('#endDate').val('');
        $('#endDate').prop('disabled', false);
        $('#endDate').datepicker('setStartDate', e.date);
    });
    $("#endDate").datepicker({ autoclose: true, format: 'M dd, yyyy' }).on('changeDate', function () {
        if ($("#startDate").val() && $("#endDate").val()) { getMonthlyRevenue(); }
    });

    getLearningProgramContentFromServer(SCHOOL_ID, 'partnerEnrollFilterForm', 'learningProgram');
    populateMonths();
}

async function getContent(moduleId, pageNo, replaceDiv, extraParam) {
    customLoader(true);
    try {
        roleAndModule = await getUserRights(SCHOOL_ID_OF_USER, USER_ROLE_ID, USER_ID, moduleId);
        ROLE_MODULE = roleAndModule;

        const handler = contentHandlers[pageNo];
        if (handler) {
            await handler({ pageNo, moduleId, replaceDiv, extraParam });
        } else {
            console.warn(`No handler found for pageNo: ${pageNo}`);
        }
    } catch (err) {
        console.error("getContent error:", err);
        if (err === "offline") {
            showMessageTheme2(0, "You are offline. Please check internet.");
        } else if (err === "Empty response") {
            showMessageTheme2(0, "Permission data not available.");
        } else {
            showMessageTheme2(0, "Something went wrong. Please reload.");
        }
    } finally {
        customLoader(false);
    }
}
function backToDedicatedModule(moduleUrl){
  if(moduleUrl=='partner-enrollment-list'){
    callDashboardPageSchool('176','partner-enrollment-list');
  }else if(moduleUrl=='partner-enrollment-students-wlp'){
	callDashboardPageSchool('194','partner-enrollment-students-wlp');
  }
}
function backToMain(tableId, modalID){
	$("#dashboardContentInHTML").show();
	$("#dashboardContentInHTMLAdditional").hide();
	$('html, body').animate({ scrollTop: 0 }, 500);
	if(tableId != "" && tableId != undefined){
		if($.fn.DataTable.isDataTable('#'+tableId)){
			$('#'+tableId).DataTable().destroy();
		}
		$('#'+tableId).DataTable();
	}
  if(modalID != null && modalID != undefined && modalID != ""){$("#"+modalID).modal("hide")}
}

function callUserReferralUpdate(formId, studentStandardId, roleModuleId) {
  $("#studentStandardId").val(studentStandardId);
  $("#updateReferralCodeModal").modal("show");
}
function saveNewReferralCode() {
  hideMessageTheme2("");
  var refCode = $("#newReferralCode").val();
  if (
    refCode == null ||
    refCode == "" ||
    refCode == undefined ||
    refCode == 0
  ) {
   showMessageTheme2(0, "Invalid referral code");
    return false;
  }
  var studentStandardId = $("#studentStandardId").val();
  var data = {};
  data["studentStandardId"] = studentStandardId;
  data["sessionUserId"] = USER_ID;
  data["referralCode"] = refCode;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
         showMessageTheme2(0, stringMessage[1]);
        } else {
         showMessageTheme2(1, stringMessage[1]);
          $("#updateReferralCodeModal").modal("hide");
        }
        return false;
      }
    }
  });
}
function callModuleRights(formId, roleId, divId) {
  hideMessageTheme2("");
  if (!validateRequestModuleRights(formId, roleId)) {
    return false;
  }
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "get-module-byrole"),
    data: JSON.stringify(getRequestForModuleRights(formId, roleId)),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
       showMessageTheme2(0, data["message"]);
      } else {
        $("#" + divId).html(data);
      }
      return false;
    }
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
  hideMessageTheme2("");

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "submit-rolerights-assign"),
    data: JSON.stringify(getCallRequestForRoleAssign(formId)),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["status"] == "0" || data["status"] == "2") {
        result = true;
      } else {
       showMessageTheme2(1, data["message"]);
        //result=false;
      }
    }
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

function callEvaluationFormDocs(evaluationId) {
  hideMessageTheme2("");
  var data = {};
  data["evaluationId"] = evaluationId;
  data['themetype']='theme2';
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
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
         showMessageTheme2(0, stringMessage[1]);
        } else {
          $("#evaluationImageContent").html(htmlContent);
        }
        return false;
      }
    },
    error: function (e) {
      console.log(e);
      //	showMessageTheme2(true, TECHNICAL_GLITCH);
      return false;
    },
  });
}









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
