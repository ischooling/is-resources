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
      contentType : APPLICATION_JSON_VALUE,
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
              scheduleSmartLiveRefresh(data);
             // showMessageTheme2(data['status'], data['message'],'',true);
              // setTimeout(getColleps(), 5000);
          }
      }
  });
}

// Parse an IST ("Asia/Kolkata", +05:30) datetime string ("YYYY-MM-DD HH:mm:ss") into an absolute Date.
function parseISTToDate(s){
  if(!s){ return null; }
  var d = new Date(s.replace(' ', 'T') + '+05:30');
  return isNaN(d.getTime()) ? null : d;
}

// Smart live-status refresh: only auto-poll while at least one visible class is inside its near-live
// window [scheduledStart - graceBefore, scheduledEnd + graceAfter]. Rows that are already completed or
// far in the future trigger no polling, so a schedule with nothing happening now stays idle.
var __liveRefreshTimer = null;
function scheduleSmartLiveRefresh(data){
  if(__liveRefreshTimer){ clearTimeout(__liveRefreshTimer); __liveRefreshTimer = null; }
  var rooms = (data && data.liveClassrooms) ? data.liveClassrooms : [];
  var graceBefore = parseInt(data && data.graceBeforeMin != null ? data.graceBeforeMin : 10, 10);
  var graceAfter  = parseInt(data && data.graceAfterMin  != null ? data.graceAfterMin  : 20, 10);
  var now = new Date().getTime();
  var nearLive = false;
  for(var i=0; i<rooms.length; i++){
    if(rooms[i]['meetingState'] == 'LIVE'){ nearLive = true; break; }
    var st = parseISTToDate(rooms[i]['startTimeOrder']);
    var en = parseISTToDate(rooms[i]['schedEndOrder']);
    if(!st || !en){ continue; }
    var winStart = st.getTime() - graceBefore*60000;
    var winEnd   = en.getTime() + graceAfter*60000;
    if(now >= winStart && now <= winEnd){ nearLive = true; break; }
  }
  if(nearLive){
    __liveRefreshTimer = setTimeout(function(){ getCurrentClassLiveNew(); }, 30000);
  }
}

function getLiveAttendeeDetails(src,elementId,meetingId,attendanceCalculated,parentRowId){
  $.ajax({
    type : "POST",
    contentType : APPLICATION_JSON_VALUE,
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
    }
  });
}


function calculateAttendance(elementId,meetingId,attendanceCalculated){
  $.ajax({
      type : "GET",
      contentType : APPLICATION_JSON_VALUE,
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
      contentType : APPLICATION_JSON_VALUE,
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
      }
  });
}