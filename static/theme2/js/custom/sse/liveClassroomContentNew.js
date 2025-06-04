function liveClassConent(){
  $("body").append(liveClassConentPage());
  var startDateTime=new Date(new Date().getTime() - 0*3600*1000);
	var endDateTime=new Date(new Date().getTime() + 0*3600*1000);
  $("#startDate").datepicker({
    autoclose: true,
    format: 'M dd, yyyy',
    todayHighlight : true,
  });
  $("#endDate").datepicker({
    autoclose: true,
    format: 'M dd, yyyy',
    todayHighlight : true,
  });
  $("#startDate").datepicker().datepicker("setDate", startDateTime);
  $("#endDate").datepicker().datepicker("setDate", endDateTime);
  // $('#startHours').val(startDateTime.getHours()<10?'0'+startDateTime.getHours():startDateTime.getHours());
  // $('#endHours').val(endDateTime.getHours()<10?'0'+endDateTime.getHours():endDateTime.getHours());
  $('#startHours').val('00');
  $('#endHours').val('23');
  // $('#startMins').val('00');
  // $('#endMins').val('00');
  
  // setInterval(function () {
  //   getSchoolClassTime();
  // },1000);
  getSchoolClassTime();
  // initiateEvensforClass('LIVE-CLASS-STATUS',USER_ID,'0','0');
}
function liveClassConentPage(){
  var html =
          '<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">'
            //+liveClassConentPageHeader()
            +liveClassConentPageBody()
          +'</div>'
          +liveClassConentPageFooter()
          +customLoaderContent()
          +attendanceModelContent()
        return html;
}
async function liveClassConentPageHeader(){
  var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
  var html =
          '<div class="sticky-header">'
          +'<div class="app-header header-shadow">'
            +'<div class="app-header__logo">'
              +'<a href="'+schoolSettingsLinks.websiteUrl+'" target="blank" class="logo-src" style="background:url('+schoolSettingsLinks.websiteLogoUrl+');"></a>'
            +'</div>'
            +'<div class="app-header__logo"></div>'
          +'</div>'
        +'</div>';
      return html; 
}

function headClasscount(){
  var html =
  '<div class="main-card mb-3 card" style="font-size:12px !important"> '
  +'<div class="no-gutters row"> '
  +'<div class="col-md-3"> '
  +'<div class="pt-0 pb-0 card-body"> '
  +'<ul class="list-group list-group-flush"> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Contract Hours</div> '
  +'<div class="widget-subheading"></div> '
  +' </div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-primary agreedHrs"  style="font-size:13px !important">00:00:00</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</li> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Total Class</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-primary totalClasses" style="font-size:13px !important" >00</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</li> '
  +' </ul> '
  +'</div> '
  +'</div> '
  +'<div class="col-md-3"> '
  +'<div class="pt-0 pb-0 card-body"> '
  +'<ul class="list-group list-group-flush"> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Teacher Hours</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-success teacherHrs" style="font-size:13px !important">00:00:00</div> '
  +' </div> '
  +'</div> '
  +' </div> '
  +'</div> '
  +'</li> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Live Class</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-warning totalLiveClasses" style="font-size:13px !important">00</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</li> '
  +' </ul> '
  +'</div> '
  +'</div> '
  +'<div class="col-md-3"> '
  +'<div class="pt-0 pb-0 card-body"> '
  +'<ul class="list-group list-group-flush"> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Spent Hours</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-danger spentHrs" style="font-size:13px !important">00:00:00</div> '
  +' </div> '
  +'</div> '
  +' </div> '
  +'</div> '
  +'</li> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Complete Class</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-warning totalCompleted" style="font-size:13px !important">00</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</li> '
  +' </ul> '
  +'</div> '
  +'</div> '
  +'<div class="col-md-3"> '
  +'<div class="pt-0 pb-0 card-body"> '
  +'<ul class="list-group list-group-flush"> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Remaing Hours</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right"> '
  +'<div class="widget-numbers text-warning remainHrs" style="font-size:13px !important">00:00:00</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</li> '
  +'<li class="list-group-item"> '
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-outer"> '
  +'<div class="widget-content-wrapper"> '
  +'<div class="widget-content-left"> '
  +'<div class="widget-heading">Not attend Class</div> '
  +'<div class="widget-subheading"></div> '
  +'</div> '
  +'<div class="widget-content-right">'
  +'<div class="widget-numbers text-success totalNotAttended" style="font-size:13px !important">00</div> '
  +'</div> '
  +' </div> '
  +'</div> '
  +' </div> '
  +'</li> '
  +'</ul> '
  +'</div> '
  +'</div> '
  +'</div> '
  +'</div> ';
  return html;
}

function liveClassBox(){
  var html=
  '<div class="col-lg-6">'
  +'<div class="main-card mb-3 card"> '
  +'<ul class="list-group list-group-flush">'
  +'<li class="list-group-item">'
  +'<div class="widget-content p-0"> '
  +'<div class="widget-content-wrapper"> '

  // +'<div class="row">'
  // +'<div class="col-lg-6">'

  +'<div class="widget-content-left mr-3"> '
  +'<div class="widget-content-left"> '
  +'<img width="42" class="rounded" src="'+PATH_FOLDER_IMAGE2+'/avatars/9.jpg" alt=""> '
  +'</div> '
  +'</div> '
  +'<div class="widget-content-left flex4 "> '
  +'<div class="widget-heading">Isadora Beaumord Perillo Ribeiro Bokos</div> '
  +'<div class="widget-subheading opacity-10"> '
  +'<span class="pr-2">Time - <b>00:00:00</b> | Spent - <b class="text-success">00:00:00</b></span><br/>'
  +'<span class="pr-2">Joined - 12:00 AM - 12:48 AM</span><br/>Meeting - 93520328956'
  +'<br/><a href="javaScript:void(0);" class="badge badge-primary" onclick="getLiveAttendeeDetails(this,\'461701_MEETINGS\',\'93520328956\',1,\'livecl-93520328956\')">View</a>'
  +'</div> '
  +'</div> '

  // +'</div> '
  // +'<div class="col-lg-6">'

  +'<div class="widget-content-right text-left"> '
  +'<div class="widget-heading">Grade 10 | One-To-One-Recurring<br/>Student - Pedro Ivan Cabrera Ferreira<br/>Title - Digital Information Technology</div> '
  +'<div class="widget-subheading opacity-10"> '
  +'<span class="pr-2">Scheduled - 12:00 AM - 12:50 AM</span>'
  +'<br/><label class="badge badge-info">Completed</label>'
  +'</div> '
  +'</div> '

  // +'</div> '
  // +'</div>'

  +'</div> '
  +'</li> '
  +'</ul>'
  +'</div>'
  +'</div>'
  
  return html;

}


function liveClassConentPageBody(){
  var html =
    '<div class="pb-4">'
      +' <div class="col p-0">'
        +'<div class="app-main__inner p-0">'
          +'<div id="liveClassContent" class="main-card mt-0 mb-3 card body-tabs-shadow">'
            +'<div class="card-body pt-0" id="classList">'
              +liveClassConentSearchForm()
              +'<div class="row">'
                +'<div class="col-lg-12">'
                  // +'<h5 class="card-title">'
                  //   +'Total Classes - <span class="totalClasses">--</span> |  '
                  //   +'Not Attended Classes - <span class="totalNotAttended">--</span> |'
                  //   +'Completed Classes - <span class="totalCompleted">--</span> | '
                  //   +'Live Classes - <span class="totalLiveClasses">--</span> | '
                  //   +'Upcoming Classes - <span class="totalUpcoming">--</span>'
                  // +'</h5>'
                  +headClasscount()
                  //+liveClassBox()
                  // +'<div class="row" style="font-size:12px !important" id="live-class-now">'
                  // +liveClassBox()
                  // +'</div>'
                  
                  
                  +'<div class="col-md-12 p-0" style="overflow: auto; height: 500px;font-size:12px">'
                    +'<table class="table row-height-small table-bordered" stlye="min-width:1300px">'
                      +'<thead>'
                        +'<tr>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">S No.</th>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">'
                            +'<spna class="full">'
                              +'Scheduled Time | Class Time'
                            +'</spna>'
                            +'<spna class="full">(Asia/Kolkata)</spna>'
                          +'</th>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">Meeting Status</th>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">'
                            +'<span class="full">Grade | Learning Program</span>'
                          +'</th>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">'
                            +'<span class="full">Title | Teacher Name</span>'
                          +'</th>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">Total</th>'
                          +'<th class="position-sticky bg-primary text-white" style="top:0;z-index:1">Attendance</th>'
                        +'</tr>'
                      +'</thead>'
                      +'<tbody id="live-class-now">'
                      +'</tbody>'
                    +'</table>'
                    +'<div id="live-class-now-meetingid"></div>'
                  +'</div>'


                +'</div>'
              +'</div>'
            +'</div>'
          +'</div>'
        +'</div>'
      +'</div>'
    +'</div>'
  return html;  
}
async function liveClassConentPageFooter(){
  var schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
  var html = 
            '<div class="app-wrapper-footer">'
              +'<div class="app-footer">'
                +'<div class="app-footer__inner">'
                  +'<div class="app-footer__inner">'
                    +'<div class="col">'
                      +'<p>'+schoolSettingsLinks.copywriteYear+'&Copy;'+schoolSettingsLinks.copywriteUrl+'</p>'
                    +'</div>'
                  +'</div>'
                +'</div>'
                +'<div class="server-message">'
                  +'<span class="msg" id="msgTheme2"></span>'
                +'</div>'
              +'</div>'
          +'</div>';
        return html;
}

function liveClassConentSearchForm(){
  var html =
    '<div class="row mb-2 bg-light pt-2" style="font-size:12px !important">'
      +'<div class="col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label>Start Date</label>'
        +'<input type="text" class="form-control" id="startDate" placeholder="Select a date" style="font-size:12px !important"/>'
      +'</div>'
      +'<div class="col-lg-1 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label>Start Time</label>'
          +'<select id="startHours" class="form-control" style="font-size:12px !important">'
          +'<option disabled selected>HH</option>'
            +getHoursAndMins(23,1)
          +'</select>'
      +'</div>'
      +'<div class="col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label>End Date</label>'
        +'<input type="text" class="form-control" id="endDate" placeholder="Select a date" style="font-size:12px !important"/>'
      +'</div>'
      +'<div class="col-lg-1 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label>End Time</label>'
          +'<select id="endHours" class="form-control" style="font-size:12px !important">'
            +'<option disabled selected>HH</option>'
            +getHoursAndMins(23,1)
          +'</select>'
      +'</div>'
      +'<div class="col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label>Learning Program</label>'
          +'<select id="learningProgram" class="form-control" style="font-size:12px !important">'
            +'<option value="">Select Learning Program</option>'
            +'<option value="ONE_TO_ONE">One-To-One</option>'
            +'<option value="GROUP">Group</option>'
            +'<option value="EXTRA_ACTIVITY">Extra Activity</option>'
          +'</select>'
      +'</div>'
      +'<div class="col-lg-1 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label>Class Status</label>'
          +'<select id="classStatus" class="form-control" style="font-size:12px !important">'
            +'<option value="">Select Status</option>'
            +'<option value="UPCOMING">UPCOMING</option>'
            +'<option value="LIVE">LIVE</option>'
            +'<option value="NOT ATTENDED">NOT ATTENDED</option>'
            +'<option value="COMPLETED">COMPLETED</option>'
          +'</select>'
      +'</div>'
      +'<div class="col-lg-2 col-md-3 col-sm-6 col-12 mb-2">'
        +'<label class="full">&nbsp;</label>'
        +'<a href="javascript:void(0)" class="btn btn-success" onClick="getCurrentClassLiveNew();">Search</a>'
      +'</div>'
    +'</div>';
    return html;
}

function getHoursAndMins(ends, duration){
  var html='';
  for(var start=0;start<=ends;){
    if(start<10){
      html+='<option val="0'+start+'">0'+start+'</option>';
    }else{
      html+='<option val="'+start+'">'+start+'</option>';
    }
    start=start+duration;
  }
  return html;
}
function customLoaderContent(){
	var html = 
		'<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
			// +'<div class="loader primary-border-top-color">'
			// 	+'<div class="full">'
			// 		+'<img src="'+PATH_FOLDER_IMAGE2+'is_loader.gif" alt="'+SCHOOL_NAME+' Loader"/>'
			// 	+'</div>'
			// +'</div>'
      +'<img src="'+PATH_FOLDER_IMAGE2+'loader-new.gif" alt="'+SCHOOL_NAME+' Loader" class="new-loader-2024" />'
		+'</div>';
	return html;
}

function attendanceModelContent(){
	var html =
   '<div class="modal fade" id="viewAttendanceModal" tabindex="-1" role="dialog" aria-labelledby="viewAttendanceModalTitle" aria-hidden="true">'
    +'<div class="modal-dialog" role="document">'
        +'<div class="modal-content">'
            +'<div class="modal-header py-2 bg-primary">'
                +'<h5 class="modal-title text-white">View Attendance</h5>'
                +'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
                    +'<span aria-hidden="true">&times;</span>'
                +'</button>'
            +'</div>'
            +'<div class="modal-body">'
              +'<table id="attendanceTable" class="table table-hover table-striped table-bordered">'
              +'</table>'
            +'</div>'
            +'<div class="modal-footer">'
                +'<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
            +'</div>'
        +'</div>'
    +'</div>'
  +'</div>';
  return html;
}

function liveClassTableNew(classes, htmlType){
  console.log(liveClassTableNew);
  var html ='';
  var sno=1;
  var totalClasses=classes.length;
  var totalNotAttended=0;
  var totalCompleted=0;
  var totalLiveClasses=0;
  var totalUpcoming=0;
  var firstLiveClass='';
  for(md=0;md<classes.length;md++){
    var elementId=classes[md]['entityId']+'_'+classes[md]['entityType'];
    var entityId=classes[md]['entityType']+'_'+classes[md]['entityId'];;
    var badgeName = 'Upcoming';
    var badgeClassName = 'badge-warning';
    var firstLiveClass=0;
    if(classes[md]['meetingStatus']=='started' && classes[md]['actualStartTime']!=""){
      badgeName = 'Live';
      badgeClassName = 'badge-success'
      totalLiveClasses++;
    }else if(classes[md]['meetingStatus']=='ended' && classes[md]['actualEndTime']!=""){
      badgeName = 'Completed';
      badgeClassName = 'badge-info'
      totalCompleted++;
      if(firstLiveClass==0){
        firstLiveClass='1';
      }
    }else{
      if(new Date(classes[md]['startTimeOrder']).getTime()<new Date().getTime()){
        badgeName = 'Not Attended';
        totalNotAttended++;
      }else{
        badgeName = 'Upcoming';
        totalUpcoming++;
      }
      //based on current time singapore
    }
    // var badgeClassName = classes[md]['meetingStatus']=='started'?'badge-success':'badge-danger';
    // var badgeName =  classes[md]['meetingStatus']=='started'?'Live':'Offline';
    // var cssattteach =  classes[md]['liveTeacher']=='started'?'badge-success':'badge-danger';
    // var csstexteach =  classes[md]['liveTeacher']=='started'?'Live':'Offline';
    // var meetingtype=classes[md]['meetingType'];
    
    var areaExp = "false";
    if(sno==1){
      areaExp = "true";
    }
    //html='';
    var livest = 0;
    if(classes[md]['liveStudent']!=''){
      livest=(parseInt(classes[md]['liveStudent'])>0?(parseInt(classes[md]['liveStudent'])-1):0);
    }
    if($("#live-class-now-meetingid").find('span.accordion').hasClass("offclass-"+classes[md]['meetingId'])){
      $(".offclass-"+classes[md]['meetingId']).remove();
    }
    if($("#live-class-now" ).find('span.accordion').hasClass("offclass-"+classes[md]['meetingId'])){
      $(".offclass-"+classes[md]['meetingId']).remove();
    }
    if(firstLiveClass=='1'){
      firstLiveClass='currentLiveClass'
    }
    if(htmlType=='new'){
      var htmlclick= "";
      if(classes[md]['attendanceCalculated']==0 && classes[md]['meetingStatus']=='ended'){
        htmlclick="calculateAttendance('"+elementId+"','"+classes[md]['meetingId']+"','"+classes[md]['attendanceCalculated']+"')";
      }else if(classes[md]['attendanceCalculated']==1 && classes[md]['meetingStatus']=='ended'){
        htmlclick="getLiveAttendeeDetails(this,'"+elementId+"','"+classes[md]['meetingId']+"','"+classes[md]['attendanceCalculated']+"','livecl-"+classes[md]['meetingId']+"')";
      }else if(classes[md]['attendanceCalculated']==2){
        htmlclick="calculateAttendance('"+elementId+"','"+classes[md]['meetingId']+"','"+classes[md]['attendanceCalculated']+"')";
      }else{
        htmlclick='';
      }
      html+='<div class="col-lg-6 '+(firstLiveClass!=0?firstLiveClass:'')+' livecl-'+classes[md]['meetingId']+'" >'
      +'<div class="main-card mb-3 card" style="margin-bottom: 2px !important"> '
      +'<ul class="list-group list-group-flush">'
      +'<li class="list-group-item">'
      +'<div class="widget-content p-0"> '
      +'<div class="widget-content-wrapper"> '
      +'<div class="widget-content-left mr-3"> '
      +'<div class="widget-content-left"> '
      +'<img width="42" class="rounded" src="'+PATH_FOLDER_IMAGE2+'/avatars/9.jpg" alt=""> '
      +'</div> '
      +'</div> '
      +'<div class="widget-content-left flex2 "> '
      +'<div class="widget-heading">'+classes[md]['teacherName']+'</div> '
      +'<div class="widget-subheading opacity-10"> '
      +'<span class="pr-2">Time - <b>00:00:00</b> | Spent - <b class="text-success">00:00:00</b></span><br/>'
      +'<span class="pr-2">MeetingId - '+classes[md]['meetingId']+''
      +'<br/>Joined - '+classes[md]['actualStartTime']+' - '+classes[md]['actualEndTime']+'</span>';
      if(htmlclick!=''){
        html+='<br/><a href="javaScript:void(0);" class="badge badge-primary" onclick="'+htmlclick+'">View</a>';
      }
     // html+=htmlclick;
      html+='</div> '
      +'</div> '
      +'<div class="widget-content-left flex2 "> '
      +'<div class="widget-heading">'+classes[md]['grade'] +" <b> | </b> "+classes[md]['classType']+'<br/>Student - '+classes[md]['className'].replace('|','<br/>Title - ')+'</div> '
      +'<div class="widget-subheading opacity-10"> '
      +'<span class="pr-2">Scheduled - '+classes[md]['scheduleStartDate']+' - '+classes[md]['scheduleEndDate']+'</span>'
      +'<br/><label class="badge '+badgeClassName+'">'+badgeName+'</label>'
      
      +'</div> '
      
      +'</div> '
      +'</div> '
      +'</li> '
      +'</ul>'
      +'</div>'
      +'</div>';

    }else{

      html+='<tr id="tr_'+entityId+'" class="classlive_'+entityId+' '+(firstLiveClass!=0?firstLiveClass:'')+' livecl-'+classes[md]['meetingId']+'">'
            +'<td class="text-dark">'+sno+'</td>'
            +'<td class="text-dark">'
            +'<span class="full">Scheduled - '+classes[md]['scheduleStartDate']+' - '+classes[md]['scheduleEndDate']+'</span>'
            +'<span class="full">Joined - '+classes[md]['actualStartTime']+' - '+classes[md]['actualEndTime']+'</span>'
            +'</td>'
            +'<td class="text-dark meeting_id">'
              +'<div class="d-flex">'
                +'<div class="flex-grow-1">'
                  +'<span id="td_badge_'+entityId+'" class="full"><label class="badge '+badgeClassName+' full">'+badgeName+'</label></span>'
                +'</div>'
              +'</div>'
            +'<td class="text-dark text-left">'
              +'<span class="full">'+classes[md]['grade'] +" <b> | </b> "+classes[md]['classType']+'</span>'
              +'<span id="td_meeting_'+entityId+'" class="full">'+classes[md]['meetingId']+'</span>'
            +'</td>'
            +'<td class="text-dark text-left className">'
              +'<div class="d-flex">'
                +'<div>'
                  +'<span class="full">Title - '+classes[md]['className']+'</span>'
                  +'<span class="full">Teacher - '+classes[md]['teacherName']+'</span>'
                  +'<div class="d-flex flex-wrap w-100 mt-1">'
                    +'<span class="d-inline-flex mr-1 border-right pr-1 border-dark">'
                      +getMeetingUrl('attendee', entityId)
                    +'</span>'
                    +'<span class="d-inline-flex mr-1">'
                      +getMeetingUrl('host', entityId)
                    +'</span>'
                    // +'<span class="d-inline-flex mr-1">'
                    //   +getMeetingUrl('cohost', entityId)
                    // +'</span>'
                  +'</div>'
                +'</div>'
              +'</div>'
            +'</td>'
            +'<td class="text-dark text-left totalStudent">'+classes[md]['totalStudent']+'</td>'
            // +'<td class="text-dark text-left" style="width:5%">'+livest+'</td>'
            +'<td class="attendanceCalculated_'+elementId+' text-dark text-left" id="'+entityId+'">';
              if(classes[md]['attendanceCalculated']==0 && classes[md]['meetingStatus']=='ended'){
                html+='<a href="javaScript:void(0);" class="btn btn-sm btn-primary" onClick="calculateAttendance(\''+elementId+'\',\''+classes[md]['meetingId']+'\','+classes[md]['attendanceCalculated']+')">Calculate Attendance</a>';
              }else if(classes[md]['attendanceCalculated']==1 && classes[md]['meetingStatus']=='ended'){
                html+='<a href="javaScript:void(0);" class="btn btn-sm btn-primary" onClick="getLiveAttendeeDetails(this,\''+elementId+'\',\''+classes[md]['meetingId']+'\','+classes[md]['attendanceCalculated']+',\''+'livecl-'+classes[md]['meetingId']+'\''+')">View Attendance</a>';
              }else if(classes[md]['attendanceCalculated']==2){
                html+='<a href="javaScript:void(0);" class="btn btn-sm btn-primary" onClick="calculateAttendance(\''+elementId+'\',\''+classes[md]['meetingId']+'\','+classes[md]['attendanceCalculated']+')">Calculate Attendance</a>';
              }else{
                html+='--';
              }
            html+=
            '</td>'
          +'</tr>'
        sno++;
      }

  }
  if(firstLiveClass=='currentLiveClass'){
    firstLiveClass='';
  }
  $(".totalClasses").html('<b>'+totalClasses+'<b/>');
  $(".totalNotAttended").html('<b>'+totalNotAttended+'<b/>');
  $(".totalCompleted").html('<b>'+totalCompleted+'<b/>');
  $(".totalLiveClasses").html('<b>'+totalLiveClasses+'<b/>');
  $(".totalUpcoming").html('<b>'+totalUpcoming+'<b/>');
  return html;
}
function attendanceData(data){
  var html = '';
  $.each(data.attendance, function (key, val) {
    html+='<tr id="row_id_'+val.id+'">'
          +'<td>'+val.name+' ('+val.joinType+')'+'</td>'
          +'<td>'+val.joinTime+'</td>'
          +'<td>'+val.leaveTime+'</td>'
          +'<td>'+val.duration+'</td>'
          +'<td>'+val.leaveReason+'</td>'
      +'</tr>';
  });
  html=
    '<thead>'
      +'<tr>'
        +'<th>Name</th>'
        +'<th>JoinTime</th>'
        +'<th>LeaveTime</th>'
        +'<th>Duration</th>'
        +'<th>leaveReason</th>'
      +'</tr>'
    +'<thead>'
    +'<tbody>'
      +html
    +'<tbody>'
  return html;    
}

function updateMeetingAndBadge(elementID, meetingID, meetingStatus){
  // var html='';
  //td_badge_EXTRA_ACTIVITY_DETAILS_247
  //td_meeting_MEETINGS_484702
  if(meetingStatus == 'start'){
    $('#td_badge_'+elementID).html('<label class="badge badge-success full">Live</label>');
    $('#'+elementID).html('--');
  }else{
    $('#td_badge_'+elementID).html('<label class="badge badge-primary full">Completed</label>');
    $('#'+elementID).html('<a href="javaScript:void(0);" class="btn btn-sm btn-primary" onClick="calculateAttendance(\''+elementID+'\',\''+meetingID+'\',0)">Calculate Attendance</td>');
  }
  $('#td_meeting_'+elementID).text(meetingID);
}

function getMeetingUrl(joinType, elementID){
  //BATCH_TEACHER_MAPPING_1151
  //MEETINGS_523186
  var entityId='';
  var entityType='';
  if(elementID.startsWith('BATCH_TEACHER_MAPPING')){
    entityId=elementID.split('BATCH_TEACHER_MAPPING_')[1];
    entityType='BATCH_TEACHER_MAPPING';
  }else if(elementID.startsWith('MEETINGS')){
    entityId=elementID.split('MEETINGS_')[1];
    entityType='MEETINGS';
  }else if(elementID.startsWith('EXTRA_ACTIVITY_DETAILS')){
    entityId=elementID.split('EXTRA_ACTIVITY_DETAILS_')[1];
    entityType='EXTRA_ACTIVITY_DETAILS';
  }else if(elementID.startsWith('ORINETATION')){
    entityId=elementID.split('ORINETATION_')[1];
    entityType='ORINETATION';
  }

  var payload={};
  payload['entityId']=entityId;
  payload['entityType']=entityType;
  payload['joinAs']=joinType
  
  var html='';
  var URL=BASE_URL+CONTEXT_PATH+SCHOOL_UUID;

  var buttonLabel='';
  if(joinType=='attendee'){
    URL+='/join?payload='
    buttonLabel='Attendee Link';
  }else if(joinType=='cohost'){
    URL+='/prepare?payload='
    buttonLabel='Alt Host Link';
  }else if(joinType=='host'){
    URL+='/prepare?payload='
    buttonLabel='Host Link';
  }
  payload=encode(JSON.stringify(payload));
  URL+=payload;
  html+='<button value="'+URL+'" class="mr-1 btn btn-primary btn-sm" id="'+joinType+'joinUrl_'+elementID+'" onclick="copyURL(\''+joinType+'joinUrl_'+elementID+'\',\''+joinType+'joinUrl_copy'+elementID+'\')"><i class="fa fa-copy"></i></button><label class="position-relative"><b class="referral-code full">'+buttonLabel+'</b><span class="'+joinType+'joinUrl_copy'+elementID+' position-absolute" style="bottom:-7px;left:0"></span></label>';
  return html;
}