$(document).ready(function() {
});

function callDashboardPageParent(pageNo, args){
	if(pageNo=='1'){
		// callForDashboardData('formIdIfAny','parent-content');
	}else if(pageNo=='3'){
	// 	callForDashboardData('formIdIfAny','parent-student-task-content');
	}
	else if(pageNo=='4'){
		// callForDashboardData('formIdIfAny','parent-student-coursetimings-content');
	}else if(pageNo=='5a'){
		callForDashboardData('formIdIfAny','email-compose-content?schoolId='+SCHOOL_ID);
	}else if(pageNo=='5b'){
		callForDashboardData('formIdIfAny','email-inbox-content?schoolId='+SCHOOL_ID);
	}else if(pageNo=='5c'){
		callForDashboardData('formIdIfAny','email-sent-content?schoolId='+SCHOOL_ID);
	}else if(pageNo=='6'){
		callForDashboardData('formIdIfAny','notification-inbox-content?priority=');
	}else if(pageNo=='6a'){
		callForDashboardData('formIdIfAny','notification-inbox-content?priority=urgent');
	}else if(pageNo=='6b'){
		callForDashboardData('formIdIfAny','notification-inbox-content?priority=medium');
	}else if(pageNo=='6c'){
		callForDashboardData('formIdIfAny','notification-inbox-content?priority=normal');
	}else if(pageNo=='7'){
		// callForDashboardData('formIdIfAny','parent-student-events-content');
	}else if(pageNo=='8'){
		//callForDashboardData('formIdIfAny','teacher-profile-request-content?ids=14,1&type=0,1');
	}else if(pageNo=='9'){
		callForDashboardData('formIdIfAny','student-exam-details-content');
	}else if(pageNo=='10'){
		// callForDashboardData('formIdIfAny','parent-student-performance-content');
	}else if(pageNo=='11'){
		// callForDashboardData('formIdIfAny','parent-student-PTM-report-content');
	}else if(pageNo=='12'){
		callForDashboardData('formIdIfAny','student-due-fees-content');
	}else if(pageNo=='12b'){

	}else if(pageNo=='13'){
		// callForDashboardData('formIdIfAny','parent-student-transcript-content');
	}else if(pageNo=='14'){
		// callForDashboardData('formIdIfAny','book-ptm-slots-request-content');
	}else if(pageNo=='15'){
		// callForDashboardData('formIdIfAny','attempt-ptm-slots-request-content');
	}
	else if(pageNo=='16'){
		callForDashboardData('formIdIfAny','studenthandbook');
	}
	else if(pageNo=='7b'){
		callForDashboardData('formIdIfAny','student-list');
	}else if(pageNo=='2002'){
		callForDashboardData('formIdIfAny','notifications'+args);
	}
}

function callParentInneraction(actionType, arg0){
	if(actionType=='3syllabus'){
		// callForDashboardData('formIdIfAny','parent-student-syllabus-content?subjectId='+arg0);	
	}else if(actionType=='home-placement-syllabus'){
		callForDashboardData('formIdIfAny','parent-student-placement-syllabus-content?subjectId='+arg0);	
	}else if(actionType=='3classWork'){
		// callForDashboardData('formIdIfAny','parent-student-task-request-content?subjectId='+arg0);
	}else if(actionType=='3homeWork'){
		// callForDashboardData('formIdIfAny','parent-student-task-request-content?subjectId='+arg0);
	}else if(actionType=='2'){
		callForDashboardData('formIdIfAny','attendance-content'+arg0);
	}else if(actionType=='meetingBook'){
		// callForDashboardData('formIdIfAny','booking-ptmslots-submit?meetingId='+arg0);
	}
}