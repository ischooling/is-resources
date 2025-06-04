function getCurrentClassLiveNew(){
  var startDateTime=new Date($('#startDate').val()+' '+$('#startHours').val()+':00:00');
  var endDateTime=new Date($('#endDate').val()+' '+$('#endHours').val()+':59:59');
  startDateTime=changeDateFormat(startDateTime, 'yyyy-mm-dd hh:mm:ss');
  endDateTime=changeDateFormat(endDateTime, 'yyyy-mm-dd hh:mm:ss');
  var lprogram = $('#learningProgram').val();
  var cStatus = $('#classStatus').val();
	customLoader(true)
  var data = {
    's': startDateTime,
    'e': endDateTime,
    'lp': lprogram,
    'cs': cStatus,
    'schoolId' : SCHOOL_ID
  }
  $.ajax({
      type : "POST",
      contentType : "application/json",
      url : getURLForHTML('dashboard','live-class-new'),
      data : JSON.stringify(data),
      dataType : 'json',
      success : function(data) {
        getSchoolClassTime();
       if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                $("#live-class-now").html("No live class now")
              }
          }else {
              $('#live-class-now').html(liveClassTableNew(data.liveClassrooms, 'old'));
             // showMessageTheme2(data['status'], data['message'],'',true);
              // setTimeout(getColleps(), 5000);
          }
      },
      error : function(e) {
        showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
      }
  });
}

function getLiveAttendeeDetails(src,elementId,meetingId,attendanceCalculated,parentRowId){
  $.ajax({
    type : "POST",
    contentType : "application/json",
    url : getURLForHTML('dashboard','live-class-attendance-new'),
    data : JSON.stringify({'meetingId' : meetingId, 'schoolId' : SCHOOL_ID}),
    dataType : 'json',
    success : function(data) {
        if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
            if(data['status'] == '3'){
                redirectLoginPage();
            }else{
              showMessageTheme2(data['status'], data['message'],'',true);
            }
        }else {
            $('#attendanceTable').html(attendanceData(data))
            $("#viewAttendanceModal").modal("show");
          
      }
    },
    error : function(e) {
      showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
    }
  });
}


function calculateAttendance(elementId,meetingId,attendanceCalculated){
  $.ajax({
      type : "GET",
      contentType : "application/json",
      url : BASE_URL+CONTEXT_PATH+'crons/api-zoom-attendance-new?schoolId=1&meetingId='+meetingId,
      dataType : 'json',
      success : function(data) {
          if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                showMessageTheme2(2, data['message'],'',true);
              }
          }else {
             if(attendanceCalculated==0){
               $('.attendanceCalculated_'+elementId).html('<a href="javaScript:void(0);" class="btn btn-sm btn-primary" onClick="getLiveAttendeeDetails(this,\''+elementId+'\',\''+meetingId+'\',1,\'livecl-'+meetingId+'\')">View Attendance</a>');
             }else{
              showMessageTheme2(2, data['message'],'',true);
             }
          }
      },
      error : function(e) {
        showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
      }
  });
}


function getSchoolClassTime(){
  var startDateTime=new Date($('#startDate').val()+' '+$('#startHours').val()+':00:00');
  var endDateTime=new Date($('#endDate').val()+' '+$('#endHours').val()+':59:59');
  startDateTime=changeDateFormat(startDateTime, 'yyyy-mm-dd hh:mm:ss');
  endDateTime=changeDateFormat(endDateTime, 'yyyy-mm-dd hh:mm:ss');
	//customLoader(true)
  var data = {
    's': startDateTime,
    'e': endDateTime,
    'schoolId' : SCHOOL_ID
  }
  $.ajax({
      type : "POST",
      contentType : "application/json",
      url : getURLForHTML('dashboard','school-class-time'),
      data : JSON.stringify(data),
      dataType : 'json',
      success : function(data) {
        console.log(data);
       if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                $("#live-class-now").html("No live class now")
              }
          }else {
              //$('#live-class-now').html(liveClassTableNew(data.liveClassrooms));
              //showMessageTheme2(data['status'], data['message'],'',true);
              // setTimeout(getColleps(), 5000);
              var classtie = data.liveClassrooms[0];
              console.log(classtie);
              $(".agreedHrs").text(classtie.agreedTime);
              $(".teacherHrs").text(classtie.teacherTime);
              if(classtie.totalTime!=''){
                $(".spentHrs").text(classtie.totalTime);
              }
              if(classtie.remainTime!=''){
                $(".remainHrs").text(classtie.remainTime);
              }
;
          }
      },
      error : function(e) {
        showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
      }
  });
}