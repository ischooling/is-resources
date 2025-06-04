var schoolSettingsLinks;
var schoolSettingsTechnical;
var schoolSettings;
var commonProfileDTO;
var CALENDAR_EVENT=false;
async function initiateSetting(){
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
	schoolSettings = await getSchoolSettingsOffice(SCHOOL_ID);
	commonProfileDTO = await getUserShortProfile(USER_ID);
}
initiateSetting();
function getContent(moduleId, pageNo, replaceDiv, extraParam){
	customLoader(false);
	roleAndModule = getUserRights(SCHOOL_ID_OF_USER, USER_ROLE_ID, USER_ID, moduleId);
	if(pageNo=='student-home'){
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
		$('#classroomSessionFilter #sessionId').select2();
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
		$("#standardId").select2({});
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

		$(".multiselect-dropdown").select2({});
		$(".singleSelect2-dropdown").select2({});

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
		$('#dashboardContentInHTML').html(getManageSessionUserContent('Manage Session',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		$("#standardId").select2({});
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
	}else if(pageNo=='payment'){
		$('#dashboardContentInHTML').html(getManagePaymentContent('Payment Details',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		getSessionMasterList('advancePaymentSearchForm', 'academicSession',false);
		callCountries('advancePaymentSearchForm', '', 'countryId');
		if(SCHOOL_ID==4 || SCHOOL_ID==5){
			$('#gradeId option[value=9]').remove();
			$('#gradeId option[value=10]').remove();
		}
		$('.multiselect-dropdown').select2({
			placeholder: "Select an option"
		});
		setpaymentDateFrom();
		setpaymentDateTo();
		initEditor(1, 'descriptionDiv','Put description if any', false);
		$('#paymentDate1').datepicker({
			autoclose: true,
			endDate: new Date(),
			format: 'mm-dd-yyyy',
		});
		$('#scheduleDate1').datepicker({
			startDate: new Date(),
			autoclose: true,
			format: 'mm-dd-yyyy',
		});
	}else if(pageNo=='schedule-a-session'){
		customLoader(true);
		$('#dashboardContentInHTML').html(getScheduleSessionContentTeacher('Book a Class',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		
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
	}else if(pageNo=='user-review'){
		$('#dashboardContentInHTML').html(getReviewContent('User Review',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		getReview(USER_ID);
	}else if(pageNo=='partner-dashboard'){
		$('#dashboardContentInHTML').html(renderPartnerDashboard('Partner Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	}else if(pageNo=='counselor-dashboard'){
		$('#dashboardContentInHTML').html(renderCounselorDashboard('Counselor Dashboard',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	}else if(pageNo=='partner-enrollment-list'){
		$('#dashboardContentInHTML').html(renderPartnerList('Enrollment List',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	}else if(pageNo=='counselor-enrollment-list'){
		$('#dashboardContentInHTML').html(renderCounselorEnrollList('Enrollment List',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	}else if(pageNo=='admin-partner-enrollment-list'){
		$('#dashboardContentInHTML').html(renderPartnerList('Enrollment List',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
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
		$('#dashboardContentInHTML').html(renderCounselorLeadReportDashboard('Lead Report',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE, LEAD_CATEGORY));
	}else if(pageNo=='referral-and-links'){
		$('#dashboardContentInHTML').html(renderReferralCodeAndLinks('Referral Code & Links',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
	}else if(pageNo=='teacher-recurring-classes-list'){
		$('#dashboardContentInHTML').html(getRecurringClassesContentTeacher('My Recurring Classes',roleAndModule,SCHOOL_ID,USER_ID,USER_ROLE));
		getSessionMasterList('recurringClassFilter','activeSession', false)
		getTeacherAssignedGrade('recurringClassFilter', USER_ID)
		$("#activeSession").val('0').trigger('change');
		$(".filterDates").datepicker("destroy");
		$('.filterDates').datepicker({
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
	} else if (pageNo === "meeting-management") {
    	getMeetingManagementContent("Meeting Management")
  	}
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
		contentType : "application/json",
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