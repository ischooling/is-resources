


function getTaskData(moduleId, userId) {
	//"lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
	var data={}
  data['moduleId']=moduleId;
  data['userId']=userId;
  data['schoolId']=SCHOOL_ID;

  return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/task-data',
			data : JSON.stringify(data),
			dataType : 'json',
			async:true,
			global : true,
			success : function(data) {
				console.log(data);
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} 
					return reject()
				}else{
					resolve(data)
	
				}
			}
		});
	});
}


function getAllTaskList(assignTo, currentPage, taskid) {
	if(!getSession()){
		redirectLoginPage();
    return false;
	}
  var startDate = $("#dataStartDate").val()!=undefined?$("#dataStartDate").val():'';
	var endDate = $("#dataEndDate").val()!=undefined?$("#dataEndDate").val():'';
	var dataRequest={};
	dataRequest['taskid']=taskid;
	dataRequest['assignTo']=assignTo;
	dataRequest['modeSearch']=$("#searchtypeTotalLead").val()!=undefined?$("#searchtypeTotalLead").val():"DAY";
	dataRequest['startDate']=startDate;
	dataRequest['endDate']=endDate;
  dataRequest['currentPage']=currentPage;
	dataRequest['userId']=USER_ID;
	dataRequest['schoolId']=SCHOOL_ID;
	$.ajax({
			type : "POST",
      contentType : APPLICATION_JSON_VALUE,
      url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-counselor-task',
      data : JSON.stringify(dataRequest),
      dataType : 'json',
      async : false,
      global : false,
			success : function(data) {
            if (data['status'] == '0' || data['status'] == '2') {
               if(data['statusCode'] == "SESSIONOUT"){
                  redirectLoginPage();
                }else{
                  //showMessageTheme2(0, data['message']);
                  var html=getTaskTableHtml(data.taskList);
				          $("#adminTaskTbody").html(html);
                }
            } else {

                var taskList=data.taskList;
                if(taskid>0){
                  var task=taskList[0];
                  var startTime=convertTo24Hour(task.starttime);
                  var endTime=convertTo24Hour(task.endtime);
                  $("#counselorAddTask #taskid").val(task.taskid)
                  $("#counselorAddTask #taskname").val(task.taskName);
                  $("#counselorAddTask #fromTime").val(startTime).trigger('change');
                  $("#counselorAddTask #toTime").val(endTime).trigger('change');
                  $("#counselorAddTask #status").val(task.status);
                  $("#counselorAddTask #description").val(task.description);
                  $('#adminAddTaskpopup').modal('show');
                }else{
                    var html =getTaskTableHtml(taskList);
                    $("#adminTaskTbody").html(html); 
                }

                // var html =getTaskTableHtml(taskList);
                //     $("#adminTaskTbody").html(html); 

                // var htmlpage=dataPagging(data, updated);
                // $(".modulepaging").html(htmlpage);
                
                // $("#orderSet").val(data.moduleOrderNumber);
            }
                
			  }
	   });
}


function getTaskTableHtml(taskList){
	//$("#counselorTaskTitle").text(data.assignName+" Task")
	var html='';
	var sr=1;
	if(taskList.length>0){	
		for (let u = 0; u < taskList.length; u++) {	
			const leadtask = taskList[u];
			html+=`<tr><td class="p-1">${sr++}</td>
				<td class="p-1">${leadtask.taskName}</td>
				<td class="p-1">${leadtask.startDateTime} - ${leadtask.endtime}</td>
				<td class="p-1">${leadtask.status}</td>
				<td class="p-1">${leadtask.description}</td>`;
				//if(!OBJECT_RIGHTS.searchUser){
					html+=`<td class="p-1"><a href="javascript:void(0)" class="btn btn-sm btn-outline-primary" onclick="getAllTaskList('${USER_ID}', 0, '${leadtask.taskid}')"><i class="icon ion-android-create" style="font-size:15px;line-height:13px"></i></a>
					<a href="javascript:void(0)" class="btn btn-sm btn-outline-primary" onclick="saveTask('counselorAddTask','delete','${leadtask.taskid}','admin');"><i class="lnr-trash" style="font-size:15px;line-height:13px"></i></a>
					</td></tr>`;
				//}
			}
		}else{
			html+=`<tr><td class="p-1 text-center bold" colspan="6">No Task</td>`;
		}
	return html;
}


