function liveClassroomContent(){
    // var date='2023-05-11';
    // var dateForLiveAttendance = new Date(date)
    var html=
    '<div class="py-4 full">'
		+'<div class="main-card mb-3 card ">'
            +'<div class="card-body">'
                +'<div id="liveClassContentDiv" class="full border live-classes-design-wrapper">'
                    +'<h4 class="text-center bg-primary live-classes-head d-flex  flex-d-md-inherit flex-column justify-content-center">'
                        +'<div class="p-1 px-2 bg-green text-white">'
                            +'<span>Live Classes&nbsp;</span>'
                        +'</div>'
                        +'<span class="d-inline-block datepicker-parent">'
                                +'<input type="text" id="dateForLiveAttendance" class="form-control w-auto mx-1 mb-2 mb-md-0 d-inline-block" name="dateForLiveAttendance">'
                                +'<select id="standardId" name="standardId" onchange="return getLiveClassroom();">'
                                    +'<option value="" disabled>Select Grade*</option>'
                                    +getStandardContent(SCHOOL_ID,false, false)
                                +'</select>'
                            +'</span>'
                    +'</h4>'
                +'</div>'
                +'<div id="liveClassroomsDiv" class="full d-flex pb-3 pl-3 pr-3  flex-wrap">'
                +'</div>'
            +'</div>'
        +'</div>'
    +'</div>'
    +liveClassAttendanceModal();
    return html;
}

function getLiveClassrommTime(data){
    var html='';
    $.each(data.liveClassrooms, function(k, liveClassroom) {
        html+=
        '<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 p-0 mb-2">'
            +'<div class="full">'
                +'<p class="bg-primary text-white p-2 m-0 border">'
                    +'<span calss="batch-title">&nbsp;'+(k+1)+'.&nbsp;'+liveClassroom.entityType+' time:<strong class="batch-name pr-1">&nbsp;'+liveClassroom.startTime+' - '+liveClassroom.endTime+'</strong></span>'
                    +'<span calss="batch-title">&nbsp;TIMEZONE:<strong class="batch-name">&nbsp;'+liveClassroom.timezone+'&nbsp;'+liveClassroom.utc+'</strong></span>'
                +'</p>'
            +'</div>'
            +'<div class="full">'
                +'<div id="liveClassroomBatchDiv'+(k+1)+'" class="d-flex flex-wrap border pb-3">';
                    $.each(liveClassroom.liveClassroomBatches, function(k, liveClassroomBatch) {
                        html+=getLiveClassromSingle(liveClassroomBatch)
                    });
                html+=
                '</div>'
            +'</div>'
        +'</div>';
    });
    return html;
}

function getLiveClassromSingle(liveClassroomBatch){
    var html=
    '<div id="'+liveClassroomBatch.entityId+'" class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12 mt-2 '+liveClassroomBatch.entityType+'">'
        +'<div class="p-2 pt-3 w-100 text-center class-card">'
            +'<div>'
                +'<div id="classroomStatus_'+liveClassroomBatch.meetingId+'">'
                    +getLiveClassroomStatus(liveClassroomBatch.classroomStatus)
                +'</div>'
                +'<div class="py-1 class-detail-row time">'
                    +'<strong>'+liveClassroomBatch.entityName+'('+liveClassroomBatch.entityId+')'+'</strong>'
                +'</div>'
                +'<div class="py-1 class-detail-row grade text-uppercase">'
                    +'<strong>'+liveClassroomBatch.standardName+'</strong>'
                +'</div>'
                +'<div class="py-1 class-detail-row subject">'
                    +'<strong>'+liveClassroomBatch.subjectName+'</strong>'
                +'</div>'
                +'<div class="py-1 class-detail-row time">'
                    +'<strong>Host:<br/>'+liveClassroomBatch.hostEmail+'<br/>'+liveClassroomBatch.hostName+'</strong>'
                +'</div>'
                +'<div class="py-1 class-detail-row time">'
                    +'<strong>Meeting Vendor:&nbsp;'+liveClassroomBatch.meetingVendor
                    +' ('+liveClassroomBatch.meetingId+')'
                    +'</strong>'
                +'</div>'
            +'</div>'
            +'<div class="enter-classroom-btn">';
                if(liveClassroomBatch.joinUrl!=''){
                    html+=`<button  value="${liveClassroomBatch.joinUrl}" class="btn btn-sm mb-1 copy-link-btn" onclick="copyLink('${liveClassroomBatch.joinUrl}')"><i class="fa fa-copy"></i>&nbsp;Copy Class Link</button>`;
                }
                html+='<button class="btn btn-primary btn-sm mb-1" onclick="showAttendanceDetailsModal(\''+liveClassroomBatch.hostEmail+'\',\''+liveClassroomBatch.hostName+'\',\''+liveClassroomBatch.entityType+'\','+liveClassroomBatch.entityId+')"><i class="fa fa-eye"></i>&nbsp;Attendance Details</button>'
                +'<p class="copy-msg"></p>'
            +'</div>'
        +'</div>'
    +'</div>';
    return html;
}

function getLiveClassroomStatus(status){
    var html='';
    if(status=='LIVE'){
        html+='<div class="ball-beat live-label">'
            +'<div class="bg-danger"></div><strong class="live-label-titel">LIVE</strong>'
        +'</div>';
    }else if(status=='NOT_STARTED'){
        html+='<div class="class-not-start text-center text-white live-label">'
            +'<strong class="live-label-titel">Schedule Class not started</strong>'
        +'</div>';
    }else if(status=='OVER'){
        html+='<div class="class-over text-center live-label">'
            +'<strong class="live-label-titel">Class Over</strong>'
        +'</div>';
    }else if(status=='N/A'){
        html+='<div class="class-over text-center live-label">'
            +'<strong class="live-label-titel">N/A</strong>'
        +'</div>';
    }
    return html;
}

function liveClassAttendanceModal(){
    var html=
    '<div class="modal fade" id="attendanceModal" tabindex="-1">'
		+'<div class="modal-dialog modal-xl" role="document">'
            +'<div class="modal-content">'
                +'<div class="modal-header pt-2 pb-2 bg-primary text-white">'
                    +'<h5 class="modal-title">Attendance Details</h5>'
					+'<button type="button" class="close"  aria-label="Close" data-dismiss="modal">'
					    +'<span aria-hidden="true" style="color: #fff;">&times;</span>'
                    +'</button>'
                +'</div>'
				+'<div id="attendanceBody" class="modal-body">'
                +'</div>'
            +'</div>'
        +'</div>'
    +'</div>'
    return html;
}

function liveClassroomAttendanceContent(data){
    var attendanceRecords='';
    $.each(data.attendances, function(k, attendance) {
        attendanceRecords+=
        '<tr>'
            +'<td>'+attendance.role+'</td>'
            +'<td>'+attendance.name+'</td>'
            +'<td>'+attendance.email+'</td>'
            +'<td>'+attendance.joinTime+'</td>'
            +'<td>'+attendance.leaveTime+'</td>'
            +'<td>'+attendance.duration+'</td>'
            +'<td>'+attendance.leaveReason+'</td>'
        +'</tr>'
    });
    var html=
    '<div>'
        +'<div class="full">'
            +'<h5 class="font-weight-bold m-0">Host: '+data.hostName+'</h5>'
        +'</div>'
        +'<div class="full mb-2">'
            +'<strong class="text-primary">Total Students: '+data.totalStudent+'&nbsp;</strong>'
            +'<strong class="text-success">Present: '+data.countPresent+'&nbsp;</strong>'
            +'<strong class="text-danger">Absent: '+data.countAbsent+'</strong>'
        +'</div>'
        +'<table class="table table-bordered">'
            +'<thead>'
                +'<tr>'
                    +'<th>Role</th>'
                    +'<th>Name</th>'
                    +'<th>Email</th>'
                    +'<th>Join Time</th>'
                    +'<th>Leave Time</th>'
                    +'<th>Duration</th>'
                    +'<th>Leave Reason</th>'
                +'</tr>'
            +'</thead>'
            +'<tbody>'
                +attendanceRecords
            +'</tbody>'
        +'</table>'
    +'</div>'
    return html;
}