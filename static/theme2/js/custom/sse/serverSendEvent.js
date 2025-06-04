$(document).ready(function() {
    if(USER_ROLE=='STUDENT' || USER_ROLE=='TEACHER'){

    }else{
        var SSE_KEY=USER_ID;
        var eventSource = new EventSource(BASE_URL+CONTEXT_PATH+'sse/subscribe?key='+SSE_KEY);
        eventSource.addEventListener('push-event-first', function(event){
            var sendEvents = JSON.parse(event.data);
            console.log('sendEvents '+JSON.stringify(sendEvents));
        });
    
        eventSource.addEventListener('live-class-status', function(event){
            var liveClassStatus = JSON.parse(event.data);
            console.log('liveClassStatus '+JSON.stringify(liveClassStatus));
            if(liveClassStatus['meetingId']!=''){
                var msg = 'Class with meeting id '+liveClassStatus['meetingId']+' just '+liveClassStatus['classStatus'];
                showMessageTheme2(1, msg,'',true);
                //$('#classroomStatus_'+liveClassStatus['meetingId']).html(getLiveClassroomStatus(liveClassStatus['classStatus']))
                //getLiveClass();
	            //getClassNowRun();
                getCurrentClassLive();
                getClassMeetingRunning(liveClassStatus['meetingId']);
                getClassOfflineMeeting(liveClassStatus['meetingId'], liveClassStatus['classStatus']);
            }
        });

        eventSource.addEventListener('live-attendance-status', function(event){
	        var liveAttendance = JSON.parse(event.data);
	        console.log('liveAttendance '+JSON.stringify(liveAttendance));
	        if(liveAttendance['meetingId']!=''){
	            $('#classroomStatus_'+liveClassStatus['meetingId']).html(getLiveClassroomStatus(liveAttendance['classStatus']))
	        }
	    });
    }
});