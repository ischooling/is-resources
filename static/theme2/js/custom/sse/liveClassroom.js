function getLiveClassroom(){
    var standardId=$('#standardId').val();
    if(standardId==''){
        standardId=0;
    }
    var date = $('#dateForLiveAttendance').val();
    var dateForLiveAttendance = new Date(date)
    var dayId = dateForLiveAttendance.getDay()+1;
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : getURLForHTML('dashboard','live-classroom-details'+'/'+SCHOOL_ID+'/'+dayId+'/'+standardId),
        dataType : 'json',
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
                if(data['status'] == '3'){
                    redirectLoginPage();
                }else{
                    if(tt=='theme2'){
                        showMessageTheme2(2, data['message'],'',true);
                    }else if(tt=='theme1'){
                        showMessage(true, data['message']);
                    }
                }
                $('#liveClassroomsDiv').html('');
            }else {
                var html=getLiveClassrommTime(data);
                $('#liveClassroomsDiv').html(html);
            }
        },
        error : function(e) {
            if(tt=='theme2'){
                showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
            }else if(tt=='theme1'){
                showMessage(true, TECHNICAL_GLITCH);
            }
        }
    });
}

function getLiveClassroomAttendance(schoolId,entityType,entityId,dayId){
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : getURLForHTML('dashboard','live-classroom-attendance'+"/"+schoolId+'/'+entityType+'/'+entityId+'/'+dayId),
        dataType : 'json',
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
                if(data['status'] == '3'){
                    redirectLoginPage();
                }else{
                    if(tt=='theme2'){
                        showMessageTheme2(2, data['message'],'',true);
                    }else if(tt=='theme1'){
                        showMessage(true, data['message']);
                    }
                }
                $('#attendanceBody').html('');
            }else {
                var html=attendanceBody(data);
                $('#attendanceBody').html(html);
            }
        },
        error : function(e) {
            if(tt=='theme2'){
                showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
            }else if(tt=='theme1'){
                showMessage(true, TECHNICAL_GLITCH);
            }
        }
    });
}

const showAttendanceDetailsModal = (hostEmail,hostName,entityType,entityId) => {
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : getURLForHTML('dashboard','live-classroom-attendance'+'?hostEmail='+hostEmail+'&hostName='+hostName+'&entityType='+entityType+'&entityId='+entityId),
        dataType : 'json',
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
                if(data['status'] == '3'){
                    redirectLoginPage();
                }else{
                    if(tt=='theme2'){
                        showMessageTheme2(2, data['message'],'',true);
                    }else if(tt=='theme1'){
                        showMessage(true, data['message']);
                    }
                }
                $('#attendanceBody').html('')
            }else {
                $('#attendanceBody').html(liveClassroomAttendanceContent(data))
                $("#attendanceModal").modal({backdrop: 'static', keyboard: false});
               
            }
        },
        error : function(e) {
            if(tt=='theme2'){
                showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
            }else if(tt=='theme1'){
                showMessage(true, TECHNICAL_GLITCH);
            }
        }
    });
}

function copyLink(src) {
    var copyURL = $(src).attr('value');
    var https = copyURL.split(":")[0];
    var textarea = document.createElement("textarea");
    if(copyURL.length>0 || https === "https"){
        textarea.textContent = copyURL;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        $(src).parent().find(".copy-msg").removeClass("text-danger")
        $(src).parent().find(".copy-msg").addClass("text-success").text("Link copied!"),
        setTimeout(function(){
            $(src).parent().find(".copy-msg").text("")
        }, 3000) 
        document.body.removeChild(textarea);
    }else{
        copyURL = "Link Not Found";
        textarea.textContent = copyURL;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        $(src).parent().find(".copy-msg").removeClass("text-danger")
        $(src).parent().find(".copy-msg").addClass("text-danger").text("Invalid Link"),
        setTimeout(function(){
            $(src).parent().find(".copy-msg").text("")
        }, 3000) 
    }
}

function copyLinkUrl(link) {
	if (!link || link == '') {
	  showMessage(false, "Url Invalid");
	} else {
	  navigator.clipboard.writeText(link).then(
		() => showMessage(false, "URL copied successfully!")
	  );
	}
  }

function getLiveClass(){
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : getURLForHTML('dashboard','today-class/'+"/"+SCHOOL_ID),
        dataType : 'json',
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
                if(data['status'] == '3'){
                    redirectLoginPage();
                }else{
                    if(tt=='theme2'){
                        showMessageTheme2(2, data['message'],'',true);
                    }else if(tt=='theme1'){
                        showMessage(true, data['message']);
                    }
                }
            }else {
                getLiveClassChart(data);
            }
        },
        error : function(e) {
            if(tt=='theme2'){
                showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
            }else if(tt=='theme1'){
                showMessage(true, TECHNICAL_GLITCH);
            }
        }
    });
}

function getLiveClassChart(data){
    var batchtime=[];
    var totalClass=[];
    var totalStudent=[];
    var totalTeacher=[];
    var liveClass=[];
    var offClass=[];
    var liveStudent=[];
    var offStudent=[];
    var liveTeacher=[];
    var offTeacher=[];
    for(var i=0;i<data.liveClassrooms.length;i++)
    {
        var classLive = data.liveClassrooms[i];
        batchtime.push(classLive.startTime+'-'+classLive.endTime);
        totalClass.push(classLive.totalClass);
        totalStudent.push(classLive.totalStudent);
        totalTeacher.push(classLive.totalTeacher);
        liveClass.push(classLive.liveClass);
        offClass.push(classLive.offClass);
        liveStudent.push(classLive.liveStudent);
        offStudent.push(classLive.offStudent);
        liveTeacher.push(classLive.liveTeacher);
        offTeacher.push(classLive.offTeacher);
    }    
    var options = {
        series: [{
        name: 'Total Class',
        data: totalClass
      }, {
        name: 'Live Class',
        data: liveClass
      }, {
        name: 'Off Class',
        data: offClass
      }, {
        name: 'Offline Student',
        data: offStudent
      },{
        name: 'Live Student',
        data: liveStudent
      }],
        chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: false,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      // title: {
      //   text: 'Fiction Books Sales'
      // },
      xaxis: {
        categories: batchtime,
        labels: {
          formatter: function (val) {
            return val + ""
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ""
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 20
      }
      };

      var chart = new ApexCharts(document.querySelector("#total-class-chart"), options);
      chart.render();

}

function getClassOfflineMeeting(meetingId, meetingStatus){
    $.ajax({
        type : "GET",
        contentType : "application/json",
        url : getURLForHTML('dashboard','offline-meeting-class'+"/"+SCHOOL_ID+"/"+meetingId+"/"+meetingStatus),
        dataType : 'json',
        success : function(data) {
            if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
                if(data['status'] == '3'){
                    redirectLoginPage();
                }else{
                    if(tt=='theme2'){
                    }else if(tt=='theme1'){
                        //showMessage(true, data['message']);
                    }
                }
            }else {
                   // getNowRunClassChart(data);
                   var liveTbl= liveClassTable(data.liveClassrooms);
                    
                    $('#live-class-now-meetingid').append(liveTbl);
                    setTimeout(getColleps(), 5000);
                
            }
        },
        error : function(e) {
            if(tt=='theme2'){
                showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
            }else if(tt=='theme1'){
                showMessage(true, TECHNICAL_GLITCH);
            }
        }
    });
}

function getClassMeetingRunning(meetingId){
  $.ajax({
      type : "GET",
      contentType : "application/json",
      url : getURLForHTML('dashboard','live-class-with-meeting'+"/"+SCHOOL_ID+"/"+meetingId),
      dataType : 'json',
      success : function(data) {
          if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                  if(tt=='theme2'){
                  }else if(tt=='theme1'){
                      //showMessage(true, data['message']);
                  }
              }
          }else {
                 // getNowRunClassChart(data);
                 var liveTbl= liveClassTable(data.liveClassrooms);
                  $('#live-class-now-meetingid').append(liveTbl);
                  setTimeout(getColleps(), 5000);
              
          }
      },
      error : function(e) {
          if(tt=='theme2'){
              showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
          }else if(tt=='theme1'){
              showMessage(true, TECHNICAL_GLITCH);
          }
      }
  });
}

function getNowRunClassChart(data){
    var batchName=[];
    var batchtime=[];
    var totalClass=[];
    var totalStudent=[];
    var totalTeacher=[];
    var liveClass=[];
    var offClass=[];
    var liveStudent=[];
    var offStudent=[];
    var liveTeacher=[];
    var offTeacher=[];
    for(var i=0;i<data.liveClassrooms.length;i++)
    {
        var classLive = data.liveClassrooms[i];
        batchtime.push(classLive.startTime+'-'+classLive.endTime);
        totalClass.push(classLive.totalClass);
        totalStudent.push(classLive.totalStudent);
        totalTeacher.push(classLive.totalTeacher);
        liveClass.push(classLive.liveClass);
        offClass.push(classLive.offClass);
        liveStudent.push(classLive.liveStudent);
        offStudent.push(classLive.offStudent);
        liveTeacher.push(classLive.liveTeacher);
        offTeacher.push(classLive.offTeacher);
        batchName.push(classLive.batchName)
    }    
    //console.log(batchtime);
    var options = {
        series: [{
        name: 'Total Class',
        data: totalClass
      }, {
        name: 'Live Class',
        data: liveClass
      }, {
        name: 'Off Class',
        data: offClass
      }, {
        name: 'Offline Student',
        data: offStudent
      },{
        name: 'Live Student',
        data: liveStudent
      }],
        chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            total: {
              enabled: false,
              offsetX: 0,
              style: {
                fontSize: '13px',
                fontWeight: 900
              }
            }
          }
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      // title: {
      //   text: 'Fiction Books Sales'
      // },
      xaxis: {
        categories: batchName,
        labels: {
          formatter: function (val) {
            return val + ""
          }
        }
      },
      yaxis: {
        title: {
          text: undefined
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + ""
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 20
      }
      };

      var chart = new ApexCharts(document.querySelector("#current-class-chart"), options);
      chart.render();

}

function getClassMeetingRunning(meetingId){
  $.ajax({
      type : "GET",
      contentType : "application/json",
      url : getURLForHTML('dashboard','live-class-with-meeting'+"/"+SCHOOL_ID+"/"+meetingId),
      dataType : 'json',
      success : function(data) {
          if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                  if(tt=='theme2'){
                  }else if(tt=='theme1'){
                      //showMessage(true, data['message']);
                  }
              }
          }else {
                 // getNowRunClassChart(data);
                 var liveTbl= liveClassTable(data.liveClassrooms);
                 $('#live-class-now-meetingid').append(liveTbl);
                  setTimeout(getColleps(), 5000);
              
          }
      },
      error : function(e) {
          if(tt=='theme2'){
              showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
          }else if(tt=='theme1'){
              showMessage(true, TECHNICAL_GLITCH);
          }
      }
  });
  
}

function getCurrentClassLive(){
  $.ajax({
      type : "GET",
      contentType : "application/json",
      url : getURLForHTML('dashboard','live-class'+"/"+SCHOOL_ID),
      dataType : 'json',
      success : function(data) {
        // console.log(data.liveClassrooms);
          if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                  if(tt=='theme2'){
                      //showMessageTheme2(2, data['message'],'',true);
                     $("#live-class-now").html("No live class now")
                  }else if(tt=='theme1'){
                      showMessage(true, data['message']);
                  }
              }
          }else {
              var liveTbl= liveClassTable(data.liveClassrooms);
              $('#live-class-now').html(liveTbl);
              setTimeout(getColleps(), 5000);
          }
      },
      error : function(e) {
          if(tt=='theme2'){
              showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
          }else if(tt=='theme1'){
              showMessage(true, TECHNICAL_GLITCH);
          }
      }
  });
}

function liveClassTable(classes ){
    console.log(classes);
    $(".totalLiveClass").html('<b>'+classes.length+'<b/>');
    var htmlTbl ='';

var a=1;
for(md=0;md<classes.length;md++){
      var cssatt =  classes[md]['liveClass']==0?'badge-danger':'badge-success';
      var csstext =  classes[md]['liveClass']==0?'Offline':'Live';
      var cssattteach =  classes[md]['liveTeacher']==0?'badge-danger':'badge-success';
      var csstexteach =  classes[md]['liveTeacher']==0?'Offline':'Live';

      var meetingtype='';
      if(classes[md]['meetingType']=='OFFLINE_MEETING'){
        meetingtype = "Teacher Created Link ";
      }else if(classes[md]['meetingType']=='BATCH_TEACHER_MAPPING'){
        meetingtype = "Group Learning ";
      }else if(classes[md]['meetingType']=='MEETINGS'){
        meetingtype = "1:1 ";
      }else if(classes[md]['meetingType']=='RECURRING_CLASS'){
        meetingtype = "1:1 ";
      }
      var areaExp = "false";
      if(a==1){
        areaExp = "true";
      }
    //htmlTbl='';
    var livest = 0;
    if(classes[md]['liveStudent']!=''){
      livest=(parseInt(classes[md]['liveStudent'])>0?(parseInt(classes[md]['liveStudent'])-1):0);
    }
    if($("#live-class-now-meetingid").find('span.accordion').hasClass("offclass-"+classes[md]['meetingid'])){
      $(".offclass-"+classes[md]['meetingid']).remove();
    }
    if($("#live-class-now" ).find('span.accordion').hasClass("offclass-"+classes[md]['meetingid'])){
      $(".offclass-"+classes[md]['meetingid']).remove();
    }
    
    htmlTbl+='<span class="accordion offclass-'+classes[md]['meetingid']+'">'
        +'<table class="table row-height-small table-bordered">'
        +'<tr class="livecl-'+classes[md]['meetingid']+'">'
        +'<td class="text-dark" style="width:5%">'+(a)+'</td>'
        +'<td class="text-dark" style="width:12%">'+classes[md]['startTime']+'-'+classes[md]['endTime']+'</td>'
        +'<td class="text-dark" style="width:10%"><a href="'+classes[md]['meetingUrl']+'" target="_blank"> '+classes[md]['meetingid']+'</td>'
        +'<td class="text-dark text-left" style="width:8%">'+classes[md]['grade']+'</td>'
        +'<td class="text-dark text-left" style="width:40%"><div class="badge '+cssatt+' ml-2">'+csstext+'</div> '+classes[md]['batchName']+'</td>'
        +'<td class="text-dark text-left" style="width:20%"><div class="badge '+cssattteach+' ml-2">'+csstexteach+'</div> '+classes[md]['teachName']+'</td>'
        +'<td class="text-dark text-left" style="width:5%">'+classes[md]['totalStudent']+'</td>'
        +'<td class="text-dark text-left" style="width:5%">'+livest+'</td>'
        +'</tr>'
        +'</table></span>';

        htmlTbl+='<div class="panel">'
              +'<table class="table row-height-small table-bordered text-left" style="font-size:11px">'
              +'<thead>'
              +'<tr class="bg-primary">'
              +'<th class="text-white"><b>Student</b></th>'
              +'</tr></thead><tbody>';
            var b=0;
            var clsStud=classes[md]['liveClassStudent'];
            if(clsStud!=undefined && clsStud.length>0){
              for(rw=0;rw<clsStud.length;rw++){
                  var cssattstd =  clsStud[rw]['liveStudent']==0?'badge-danger':'badge-success';
                  var csstextstd =  clsStud[rw]['liveStudent']==0?'Offline':'Live';
                  htmlTbl+='<tr class="livecl-'+clsStud[rw]['meetingid']+'">'
                    +'<td class="text-dark text-left"><div class="badge '+cssattstd+' ml-2">'+csstextstd+'</div> '+clsStud[rw]['studName']+'</td>'
                    +'</tr>';
              }
            }
    htmlTbl+='</tbody></table>';
    htmlTbl+='</div>';
    a++;
}


    return htmlTbl;
}

function getColleps(){
  var acc = document.getElementsByClassName("accordion");
      var i;
      for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
          //$('.panel').css({'display':'none'});
          //$('.accordion').removeClass('active');
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }
        });
      }
}

function getTeacherClassReview(formid, startDate, enddate){
  console.log("getTeacherClassReview");
  $.ajax({
      type : "POST",
      contentType : "application/json",
      url : getURLForHTML('dashboard','teacher-class-review-content'),
      data : JSON.stringify({'startDate': startDate, 'endDate' : enddate, 'schoolId' : SCHOOL_ID}),
      dataType : 'json',
      success : function(data) {
          if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                  if(tt=='theme2'){
                      //showMessageTheme2(2, data['message'],'',true);
                     $("#teacher-class-review").html("No class for review")
                  }else if(tt=='theme1'){
                      showMessage(true, data['message']);
                  }
              }
          }else {
              var liveTbl= classReviewTable(data.teacherClassReview, data.startDate, data.endDate);
              $('#teacher-class-review').html(liveTbl);
              //var table = $('#listTeacherReview').DataTable();
              //table.destroy();
              $("#listTeacherReview").dataTable({
                "pageLength": 100
              });
            
          }
      },
      error : function(e) {
          if(tt=='theme2'){
              showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
          }else if(tt=='theme1'){
              showMessage(true, TECHNICAL_GLITCH);
          }
      }
  });
}

function classReviewTable(rclasses, startDate, endDate){
  //console.log(rclasses);
  var htmlTbl ='';
  htmlTbl='<table class="table row-height-small table-bordered table-hover text-center" id="listTeacherReview">'
  +'<thead>'
  +'<tr class="bg-primary">'
  +'<th class="text-white"><b>Sr.no</b></th>'
  +'<th class="text-white"><b>Teacher Name/Application No.</b></th>'
  +'<th class="text-white"><b>Class Review</b></th>'
  +'<th class="text-white"><b>Total Class </b></th>'
  +'<th class="text-white"><b>Submitted Hours</b></th>'
  +'<th class="text-white"><b>Deducted Hours</b></th>'
  +'<th class="text-white"><b>Accepted Hours</b></th>'
  +'<th class="text-white"><b>Accepted 1:1 Hours</b></th>'
  +'<th class="text-white"><b>Accepted Batch Hours</b></th>'
  +'<th class="text-white"><b>Accepted Admin Hours</b></th>'
  +'</tr></thead><tbody>';
  var a=1;
  for(md=0;md<rclasses.length;md++){
    // var cssatt =  rclasses[md]['liveClass']==0?'badge-danger':'badge-success';
    // var csstext =  rclasses[md]['liveClass']==0?'Offline':'Live';
    var urlSend = "getAsPost('/report/teacher-class-report?moduleId=150&euid="+rclasses[md]['tencryptedUserId']+"&profileStatus=A&startDateFilter="+startDate+"&endDateFilter="+endDate+"')";
    var meetingid='';
    var userid = rclasses[md]['userId'];
    var funcVar = "getTeacherClassReviewById('"+userid+"','"+meetingid+"','class-review','','','0')";
    htmlTbl+='<tr class="reviewcl-'+rclasses[md]['userId']+'">'
    +'<td class="text-dark">'+(a++)+'</td>'
    +'<td class="text-dark text-left"><a onclick='+urlSend+' href=\"javascript:void(0)\"  class=\"bold text-dark\">'+rclasses[md]['tname']+'</a><br/>'+rclasses[md]['applicationNo']+'<br/>'+rclasses[md]['tofficeMail']+'</td>'
    +'<td class="text-dark text-left"><a href="javascript:void(0)" onClick="'+funcVar+'">'+rclasses[md]['totalReview']+'</a></td>'
    +'<td class="text-dark text-center ">'+rclasses[md]['totalClass']+'</td>'
    +'<td class="text-dark text-center bold" style=\"background-color: #c9dff5 !important;\">'+rclasses[md]['reviewTime']+'</td>'
    +'<td class="text-dark text-center bold" style=\"background-color: #c9dff5 !important;\">'+rclasses[md]['deductTime']+'</td>'
    +'<td class="text-dark text-center bold" style=\"background-color: #c9dff5 !important;\">'+rclasses[md]['acceptTime']+'</td>'
    +'<td class="text-dark text-center">'+rclasses[md]['oneTime']+'</td>'
    +'<td class="text-dark text-center">'+rclasses[md]['batchTime']+'</td>'
    +'<td class="text-dark text-center">'+rclasses[md]['adminTime']+'</td>'
    
    +'</tr>';
  }
  htmlTbl+='</tbody></table>';
  return htmlTbl;
}


function getTeacherClassReviewById(userid, meetingid, callFrom, startDate, endDate, publishData){
  $("#editAttuserid").val(userid);
  if(callFrom=='class-review'){
    startDate = $('#startDate').val();
    endDate = $('#endDate').val();
  }
  var data={};
      data['teacherUserId']=userid;
      data['meetingId']=meetingid;
      data['startDate']=startDate;
      data['endDate']=endDate;
      data['publishData']=publishData;

  $.ajax({
      type : "POST",
      contentType : "application/json",
      url : getURLForHTML('dashboard','teacher-class-review-content-byid'),
      data : JSON.stringify(data),
      dataType : 'json',
      success : function(data) {
          if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
              if(data['status'] == '3'){
                  redirectLoginPage();
              }else{
                  if(tt=='theme2'){
                      //showMessageTheme2(2, data['message'],'',true);
                     $("#teacher-class").html("No class for review")
                  }else if(tt=='theme1'){
                      showMessage(true, data['message']);
                  }
              }
          }else {
              if(callFrom=='class-review' || callFrom=='search'){
                var liveTbl= classReviewByidTable(data.attendanceOfMonthDetails);
                $('#teacher-class').html(liveTbl);
                $('#tclassReview').DataTable();
                if(callFrom=='search'){
                }else{
                  $("#teacherClassReviewModel").modal('show');
                }
              }else if(callFrom=='class-salary'){
                var htmlSal= getTotalAttendanceDetail(data.attendanceOfMonthDetails);
                $("#teacherAllClassBody").html(htmlSal);
                $("#teacher_AllClassModel").modal('show');
              }
              
          }
      },
      error : function(e) {
          if(tt=='theme2'){
              showMessageTheme2(2, TECHNICAL_GLITCH,'',true);
          }else if(tt=='theme1'){
              showMessage(true, TECHNICAL_GLITCH);
          }
      }
  });
}

function classReviewByidTable(rclasses){
  console.log(rclasses);
  var htmlTbl ='';
  
  var a=1;
  for(md=0;md<rclasses.length;md++){
    // var cssatt =  rclasses[md]['liveClass']==0?'badge-danger':'badge-success';
    // var csstext =  rclasses[md]['liveClass']==0?'Offline':'Live';
    var subjectName = rclasses[md]['subjectName'];
    if(rclasses[md]['meetingType']=='OFFLINE_MEETING'){
        subjectName = "N/A";
    }
    var publSts = rclasses[md]['publishStatus']==1?'Published':'Unpublished';
		var publStsCss = rclasses[md]['publishStatus']==1?'text-success':'text-danger';

    htmlTbl+='<tr class="attend-'+rclasses[md]['attendId']+'">'
    +'<td class="text-dark">'+(a++)+'</td>'
    +'<td class="text-dark text-left vertical-align-top"><span class="attendanceDate'+rclasses[md]['attendId']+'">'+rclasses[md]['attendanceDate']+'</span> (<span class=\"startTimes'+rclasses[md]['attendId']+'\">'+rclasses[md]['attendanceJoinTime']+'</span>-<span class=\"endTimes'+rclasses[md]['attendId']+'\">'+rclasses[md]['attendanceLeaveTime']+'</span>)<br/>';
    htmlTbl+="<b>Spent time:</b><span class=\"durations"+rclasses[md]['attendId']+"\">"+rclasses[md]['attendanceDuration']+"</span><br/>";
    var spelTim = rclasses[md]['attendanceDuration'].split(":");

    htmlTbl+="<input type=\"text\" class=\"attendHours\" id=\"attendHours"+rclasses[md]['attendId']+"\" name=\"attendHours"+rclasses[md]['attendId']+"\" value=\""+spelTim[0]+"\" placeholder=\"HH\" maxlength=\"2\" style=\"font-size:11px;width:50px\" />";
		htmlTbl+="<input type=\"text\" class=\"attendMinuts\" id=\"attendMinuts"+rclasses[md]['attendId']+"\" name=\"attendMinuts"+rclasses[md]['attendId']+"\" value=\""+spelTim[1]+"\" placeholder=\"MM\"  maxlength=\"2\" style=\"font-size:11px;width:50px\"/>";
    htmlTbl+="<input type=\"text\" class=\"attendSecond\" id=\"attendSecond"+rclasses[md]['attendId']+"\" name=\"attendSecond"+rclasses[md]['attendId']+"\" value=\""+spelTim[2]+"\" placeholder=\"SS\"  maxlength=\"2\" style=\"font-size:11px;width:50px\"/>";
    
    htmlTbl+="<input type=\"text\" class=\"attendRemark form-control\" id=\"attendRemark" + rclasses[md]['attendId'] + "\" name=\"attendRemark" + rclasses[md]['attendId'] + "\" placeholder=\"Enter Comments, word limit 250\" maxlength=\"250\" />";
    htmlTbl+="<div><button class=\"mb-2 mr-2 btn-pill btn btn-info\" id=\"saveRecordAttend\" onclick=\"saveAttend('"+rclasses[md]['attendId']+"', '"+rclasses[md]['attendanceJoinTime']+"', 'edit');\">Save</button><button class=\"mb-2 mr-2 btn-pill btn btn-info\" id=\"publishRecordAttend\" onclick=\"saveAttend('"+rclasses[md]['attendId']+"', '"+rclasses[md]['attendanceJoinTime']+"', 'publish');\">Publish</button></div>";
    htmlTbl+="</td>";
    htmlTbl+="<td class='vertical-align-top'><b>Meeting Topic:</b> "+rclasses[md]['meetingtopic']+"<br/><b>Subject Name:</b> "+subjectName;
    if(rclasses[md]['timezone']!=''){
      htmlTbl+="<br/><b>Meeting Timzone:</b> "+rclasses[md]['timezone']
    }
    if(rclasses[md]['meetingId']!=''){
      htmlTbl+="<br/><b>Meeting ID:</b> "+rclasses[md]['meetingId']
    }
    if(rclasses[md]['sessionId']!=''){
      htmlTbl+="<br/><b>Session ID:</b> "+rclasses[md]['sessionId']
    }
    if(rclasses[md]['userMeetingPerson']!=''){
      htmlTbl+="<br/><b>Teacher:</b> "+rclasses[md]['meetingPerson']+" ("+rclasses[md]['teachtimezone']+")<br/><b>Student:</b> "+rclasses[md]['userMeetingPerson']+" ("+rclasses[md]['stdtimezone']+")";
    }
      htmlTbl+="<br/><span class=\"publish"+rclasses[md]['attendId']+" "+publStsCss+"\">"+publSts+"</span><br/>";
      

  var attRemark = rclasses[md]['attendanceRemarks'];

      if(attRemark.length>0){
        htmlTbl+="<br/><b>Comments:</b>";
        for(r=0;r<attRemark.length;r++){
          if(attRemark[r]['comments']!=''){
            htmlTbl+="<br/><span class=\"comments"+attRemark[r]['attendid']+"\">"+decodeURIComponent(attRemark[r]['comments']);
          }
            if(attRemark[r]['userType']!='TEACHER'){
              htmlTbl+="<span style=\"font-size:14px;color:red;float:right\"><a href=\"javascript:void(0);\" class=\"click-to-catalog\" onclick=\"return editAttendanceComments('"+attRemark[r]['attendid']+"','"+attRemark[r]['remarkId']+"','N','remove-comment');\"><i class=\"fa fa-times\"></i></a></span>";
            }
            htmlTbl+="</span>";
          }
        
      }
        
        
        htmlTbl+="</td>";
    +'</tr>';
  }
  return htmlTbl;
}


function getTotalAttendanceDetail(data){
	var html="";
	var i=1;
	attendanceArr = data;
	console.log(attendanceArr);
  //return html;
	$.each( attendanceArr, function( index, value ){
		var meetingtype='online';
			$('.popTeacherClassHead').text(value.attendanceDate);
			var entityType='1:1';
			var subjectName=value.subjectName;
			var batchName = value.batchName;
			if(value.meetingType=='OFFLINE_MEETING'){
				entityType='';
				if(value.offMeetingType==''){
					entityType='Admin Task';
				}
				meetingtype='offline';
				subjectName='N/A'
			}else if(value.meetingType=='BATCH_TEACHER_MAPPING' || value.meetingType=='BATCH_TEACHER_MAPPING'){
				entityType ='Group';
			}else if(value.meetingType=='EXTRA_ACTIVITY_DETAILS'){
				entityType = 'Activity';
				subjectName='N/A'
			}
			if(value.meetingType=='OFFLINE_MEETING' && value.offMeetingType=='A' ){
				entityType = entityType+'Admin Task'
				subjectName='N/A'
			}else if(value.meetingType=='OFFLINE_MEETING' && (value.offMeetingType=='R' || value.offMeetingType=='O')){
				entityType = entityType+'1:1'
			}else if(value.meetingType=='OFFLINE_MEETING' && value.offMeetingType=='G'){
				entityType = entityType+'Group'
			}
   			html+="<tr>";
			html+="<td class='text-center'>"+(i++)+"</td>";
			html+="<td class='vertical-align-top' style='min-width:200px'><b>Mode:</b> "+entityType+"<br/>";
			html+="<br/>";
			if(value.attendanceRecording!=null && value.attendanceRecording!=''){
				$.each(value.attendanceRecording, function( kes, vel ){
					var publSts = vel.publishStatus==1?'Published':'Under Review';
					var publStsCss = vel.publishStatus==1?'text-success':'text-danger';
					html+="<b>Joined Time:</b><span class=\"startTimes"+vel.rattendid+"\">"+vel.jointimes+"</span>";
					html+="<br/><b>Ended Time:</b><span class=\"endTimes"+vel.rattendid+"\">"+vel.endTimes+"</span>";
					if(vel.publishStatus==1){
						html+="<br/><b>Spent time:</b><span class=\"durations"+vel.rattendid+"\">"+vel.review_durations+"</span>";
						html+="<br/><b>Accepted time:</b><span class=\"durations"+vel.rattendid+"\">"+vel.durations+"</span><br/>";
					}else{
						html+="<br/><b>Spent time:</b><span class=\"durations"+vel.rattendid+"\">"+vel.review_durations+"</span>";
					}
					html+="<br/>";
					if(vel.publishStatus==0){
						html+="<span class="+publStsCss+">"+publSts+"</span><br/>";
					}
				});
			}else{
				var publSts = value.publishStatus==1?'Published':'Under Review';
				var publStsCss = value.publishStatus==1?'text-success':'text-danger';
				html+="<b>Joined Time: </b> <span class=\"startTimes"+value.attendId+"\">"+value.attendanceJoinTime+"</span>";
				html+="<br/><b>Ended Time:</b><span class=\"endTimes"+value.attendId+"\">"+value.attendanceLeaveTime+"</span>";
				html+="<br/><b>Spent time:</b><span class=\"durations"+value.attendId+"\">"+value.attendanceDuration+"</span><br/>";
				if(value.publishStatus==0){
					html+="<span class="+publStsCss+">"+publSts+"</span><br/>";
				}
			}
			
			html+="</td>";
			html+="<td class='vertical-align-top'>"
				+"<b>Meeting Topic:</b> "+value.meetingtopic+"<br/>";
				html+="<b>Course Name:</b> "+subjectName;
				if(batchName!=null && batchName!=''){
					html+="<br/><b>Group Name:</b> "+batchName;
				}
				if(value.timezone!=''){
					html+="<br/><b>Meeting Timzone:</b> "+value.timezone
				}
				if(value.userMeetingPerson!=''){
					html+="<br/><b>Teacher:</b> "+value.meetingPerson+" ("+value.teachtimezone+")<br/><b>Student:</b> "+value.userMeetingPerson+" ("+value.stdtimezone+")";
				}
				if(value.meetingId!=''){
					html+="<br/><b>Meeting Id:</b> "+value.meetingId;
				}
				html+="<br/>";
				if(value.attendanceRecording!=null && value.attendanceRecording!=''){
					$.each( value.attendanceRecording, function( ks, vl ){
						if(vl.recordingUrl!=null && vl.recordingUrl!=''){
							var recordding = vl.recordingUrl==null?'Recording not present ':vl.recordingUrl;
							html+="<br/><b>Recording Url:</b> "+recordding;
							
							//
						}
						if(vl.password!=null && vl.password!=''){
							html+="<br/><b>Password:</b> "+vl.password;
						}
						if(vl.recordingPlayPasscode!=null && vl.recordingPlayPasscode!=''){
							html+="<br/><b>Recording Play Passcode:</b> "+vl.recordingPlayPasscode;
						}
						
					});
				}
				if(value.attendanceRemarks!=null && value.attendanceRemarks!=''){
					if(value.publishStatus==1){
					html+="<br/><b>Comments:</b>";
						$.each( value.attendanceRemarks, function( ks, vl ){
							if(vl.comments!=null){
								html+="<br/>"+vl.comments;
							}
						});
					}
				}
			html+="</td>";
			html+="<td class='vertical-align-top' style='width:285px'>";
				if(value.meetingVendor=='LENS'){
					html+="<span><b>Lens Attentive Duration: </b>"+convertMsToTime(value.lensAttentiveDuration*1000)+"</span></br>";
					html+="<span><b>Lens Speaking Duration: </b>"+convertMsToTime(value.lensSpeakingDuration*1000)+"</span></br>";
					html+="<span><b>Lens Video On Duration: </b>"+convertMsToTime(value.lensVideoOnDuration*1000)+"</span></br>";
					if(value.lensParticipants==0){

					}else if(value.lensParticipants==1 && entityType!='Admin Task'){
						html+="<span class='float-left d-inline-block p-2 mt-1' style='border:2px dashed #ff0000; border-radius:4px;color:#ff0000'><b>Meeting Participants:</b> "+value.lensParticipants+"</span>";
					}else if(value.lensParticipants>1 && entityType=='Admin Task'){
						html+="<span class='float-left d-inline-block p-2 mt-1' style='border:2px dashed #ff0000; border-radius:4px;color:#ff0000'><b>Meeting Participants:</b> "+value.lensParticipants+"</span>";
					}else{
						html+="<span class='float-left d-inline-block p-2 mt-1' style='border:2px dashed #007fff; border-radius:4px;color:#007fff'><b>Meeting Participants:</b> "+value.lensParticipants+"</span>";
					}
					html+="</td>";
				}
			html+="</tr>";
	});

  return html;
	
}


