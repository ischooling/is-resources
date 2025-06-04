var retryCount=0;
var eventSource = '';
var myTriggerEvent='';
var retryCountAfterScheduleTime=0;
var initiateRequest=false;
var eventInitiated=false;
function initiateEvensforClass(type,userId,entityId,entityType){
    if(!initiateRequest){
        initiateRequest=true;
        var SSE_KEY=entityType+'_'+entityId+'~'+userId;
        eventSource = new EventSource(BASE_URL+CONTEXT_PATH+'sse/subscribe?key='+SSE_KEY);
        eventSource.onopen = (e) => {
            console.log("The connection has been established.");
        };
        eventSource.onmessage = (e) => {
            console.log("The connection has been called.");
        };
        eventSource.onerror = function(e) {
            console.log("Event: error");
            if (this.readyState == EventSource.CONNECTING) {
                console.log(`Reconnecting (readyState=${this.readyState})...`);
            } else {
                console.log("Error has occured.");
            }
            eventSource.close();
        };
        eventSource.addEventListener('class-started', function(event){
            var liveClassStatus = JSON.parse(event.data);
            console.log('class-started '+JSON.stringify(liveClassStatus));
            if(type=='I' || type=='E'){
                window.setTimeout(function(){
                    if(type=='I'){
                        if(entityType=='ORIENTATION'){
                            proceedForOrientation('N',type,userId,entityId,entityType);
                        }else if(entityType=='EXTRA_ACTIVITY_DETAILS'){
                                checkClassStatus(userId,entityType,entityId)
                        }else{
                                checkClassStatus(userId,entityType,entityId)
                        }
                    }else{
                        // if(entityType=='EXTRA_ACTIVITY_DETAILS' || entityType=='MEETINGS'){
                            proceedForExternalClass(type,userId,entityId,entityType);
                        // }else{
                            // checkClassStatus(userId,entityType,entityId)
                        // }
                    }
                    retryCount++;
                    if(retryCount==2){
                        window.location.reload();
                    }
                },10000);
            }else if(type=='LIVE-CLASS-STATUS'){
                liveClassStatus
            }
        });
    }
}

function stopEvensforClass() {
    if(eventSource!=''){
        eventSource.close();
        console.log("eventSource.close()");
        eventSource='';
    }
}

function callClassOrActivityExternalClass(type,userId,entityId,entityType){
    if(retryCountAfterScheduleTime<15){
        console.log('retryCountAfterScheduleTime '+retryCountAfterScheduleTime)
        retryCountAfterScheduleTime++;
        proceedForExternalClass(type,userId,entityId,entityType)
    }
}

function triggerReloadExternalClass(type,userId,entityId,entityType,startDateTime,timezone){
    currentDate = new Date();
    var scheduledDate = convertTZ(startDateTime,timezone);
    console.log('triggerReloadExternalClass currentDate '+currentDate);
    console.log('triggerReloadExternalClass scheduledDate'+scheduledDate);
    if((scheduledDate.getTime()-1000)<=currentDate.getTime()){
        stopFunction();
        setInterval(function(){
            callClassOrActivityExternalClass(type,userId,entityId,entityType,startDateTime,timezone);
        },60000)
    }
}

function proceedForExternalClass(type,userId,entityId,entityType,timezone,hostId,meetingType){
    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/external-class-status',
        data : JSON.stringify(prepareClassJoinRequest(type,userId,entityId,entityType,timezone,hostId,meetingType)),
        dataType : 'json',
        async : true,
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                }
            } else {
                stopEvensforClass();
                window.location.href=data['redirectUrl'];
            }
        },
		error : function(e) {
			console.log('error ',e)
			return false;
		}
    });
}

function prepareClassJoinRequest(type,userId,entityId,entityType,timezone,hostId,subject){
    var lensExternalUserRequest = {};
    lensExternalUserRequest['schoolId'] = SCHOOL_ID;
    lensExternalUserRequest['type'] = type;
    lensExternalUserRequest['userId'] = userId;
    lensExternalUserRequest['entityId'] = entityId;
    lensExternalUserRequest['entityType'] = entityType;
    lensExternalUserRequest['profile'] = 'student';
    lensExternalUserRequest['hostId'] = hostId;
    lensExternalUserRequest['timezone'] = timezone;
    lensExternalUserRequest['subject'] = subject;
    return lensExternalUserRequest;
}

function changeIFrameUrl(zoomURL) {
    // Get the iframe element
    var iframe = document.getElementById('zoom-meeting-iframe');
    $("#hide-when-zoom-meeting-start").hide();
    // Set the new URL for the iframe
    iframe.src = zoomURL;
    $("#meeting-after-join-ui").removeClass("d-none");
}

function checkClassStatus(userIdTeacher,entityType,entityId){
    customLoader(true);
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/'+UNIQUEUUID+'/check-class-status/'+userIdTeacher+'/'+entityType+'/'+entityId,
        dataType : 'json',
        async : true,
        global:false,
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessage(false, data['message']);
                }
                initiateEvensforClass("I",data['userId'],entityId,entityType);
            } else {
                stopEvensforClass();
                changeIFrameUrl(data['redirectUrl']);
                stopFunction();
                // window.location.href=data['redirectUrl'];
            }
            customLoader(false);
        },
        error: function(e){
            if (checkonlineOfflineStatus()) {
				return;
			}
        }
    });
}

function callClassOrActivityOrientation(type,userId,entityId,entityType,startDateTime,timezone,hostId,subject){
    if(retryCountAfterScheduleTime<15){
        console.log('callClassOrActivityOrientation '+retryCountAfterScheduleTime)
        retryCountAfterScheduleTime++;
        if(subject == "REQUESTDEMO"){
            proceedForDemoClass('N',type,userId,entityId,entityType,startDateTime,timezone,subject,hostId)
        }else{
            proceedForOrientation('Y',type,userId,entityId,entityType,startDateTime,timezone,hostId,subject)
        }
       
    }
}

function triggerReloadOrientation(type,userId,entityId,entityType,startDateTime,timezone,hostId,subject){
    currentDate = new Date();
    var scheduledDate = convertTZ(startDateTime,timezone);
    console.log('triggerReloadOrientation currentDate '+currentDate);
    console.log('triggerReloadOrientation scheduledDate'+scheduledDate);
    if((scheduledDate.getTime()-1000)<=currentDate.getTime()){
        stopFunction();
        setInterval(function(){
            callClassOrActivityOrientation(type,userId,entityId,entityType,startDateTime,timezone,hostId,subject);
        },10000)
        
    }
}


function proceedForOrientation(showMessage,type,userId,entityId,entityType,startDateTime,timezone,hostId,subject){
    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/orientation-class-status',
        data : JSON.stringify(prepareClassJoinRequest(type,userId,entityId,entityType,timezone,hostId,subject)),
        dataType : 'json',
        async : true,
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    // redirectLoginPage();
                }
            }else{
                if(data['redirectUrl']!=null && data['redirectUrl']!=''){
                    stopEvensforClass();
                    window.location.href=data['redirectUrl'];
                }else{
                    var currentDate = new Date();
                    var scheduledDate = convertTZ(startDateTime,timezone);
                    console.log('proceedForOrientation currentDate '+currentDate);
                    console.log('proceedForOrientation scheduledDate '+scheduledDate);
                    // if((scheduledDate.getTime()-1000)<=currentDate.getTime()){
                    //     if(myTriggerEvent==''){
                    //         console.log('triggerReloadOrientation called');
                    //         myTriggerEvent = window.setInterval(function(){
                    //             triggerReloadOrientation(type,userId,entityId,entityType,startDateTime,timezone);
                    //         },20000);
                    //     }
                    // }
                    //else{
                        if(!eventInitiated){
                            eventInitiated=true;
                            if(showMessage=='Y'){
                                // showMessageTheme2(0, data['message']);
                                $('.showValidationMessage').html('<br/><strong>Your system training has not started yet. You will be redirected automatically when it begins..</strong>');
                            }else{
                                $('.showValidationMessage').html('');
                            }
                            initiateEvensforClass(type,userId,entityId,entityType);
                        }
                        if(myTriggerEvent==''){
                            console.log('triggerReloadOrientation called');
                            myTriggerEvent = window.setInterval(function(){
                                triggerReloadOrientation(type,userId,entityId,entityType,startDateTime,timezone,hostId,subject);
                            },20000);
                        }
                    //}
                }
            }
        }
    });
}
function stopFunction(){
    console.log('stopFunction called');
    clearInterval(myTriggerEvent);
}

function registerExternalClass(checkValidation,type,userId,entityId,entityType,startDateTime,timezone,meetingType,hostId,subject){
    if($('#userName').val()==undefined || $('#userName').val()==''){
        if(checkValidation){
            showMessageTheme2(0, "Name is mandatory to join class");
        }
        return false;
    }
    // if(meetingType!='CUSTOM_WITHOUT_STUDENT'){
    //     if($('#userEmail').val()==undefined || $('#userEmail').val()==''){
    //         if(checkValidation){
    //             showMessageTheme2(0, "Email is mandatory to join class");
    //         }
    //         return false;
    //     }
    // }
    if($('#userEmail').val()!=null && $('#userEmail').val()!=undefined && $('#userEmail').val()!=''){
        if (!validateEmail($("#userEmail").val().trim())) {
            showMessageTheme2(0, "Invalid Email");
            return false;
        }
    }
    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/register-external-class',
        data : JSON.stringify(registerExternalClassRequest(type,userId,entityId,entityType,hostId,timezone,subject)),
        dataType : 'json',
        async : true,
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                }
            } else {
                $('#server-message').html(data['message']);
                if(data['redirectUrl']!=null && data['redirectUrl']!=''){
                    window.location.href=data['redirectUrl'];
                }else{
                    $('#server-message').html(data['message']);
                }
            }
        },
		error : function(e) {
			console.log('error ',e)
			return false;
		}
    });
}

function registerExternalClassRequest(type,userId,entityId,entityType,hostId,timezone,subject){
    var lensExternalUserRequest = {};
    lensExternalUserRequest['schoolId'] = SCHOOL_ID;
    lensExternalUserRequest['type'] = type;
    lensExternalUserRequest['userId'] = userId;
    lensExternalUserRequest['entityId'] = entityId;
    lensExternalUserRequest['entityType'] = entityType;
    lensExternalUserRequest['name'] = $('#userName').val();
    lensExternalUserRequest['email'] = $('#userEmail').val();
    lensExternalUserRequest['profile'] = 'student';
    lensExternalUserRequest['hostId'] = hostId;
    lensExternalUserRequest['timezone'] = timezone;
    lensExternalUserRequest['subject'] = subject;
    return lensExternalUserRequest;
}