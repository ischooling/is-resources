
$(function () {
	// $('[data-toggle="tooltip"]').tooltip()
});

function validateRequestForBookOrientation(formId, newTheme, leadFrom){
 hideMessage('');
 var flag=true;
	if ($("#"+formId+" #leadSource").val()==null || $("#"+formId+" #leadSource").val()=='0') {
		if(newTheme){
				showMessageTheme2(0, "Please select Lead Source",'',true);
			}else{
				showMessageTheme2(0, "Please select Lead Source");
			}
		return false;
	}
	if($("#"+formId+" #leadSource").val()==5){
		if ($("#"+formId+" #leadDemoAssign").val()==null || $("#"+formId+" #leadDemoAssign").val()==0) {
			if(newTheme){
				showMessageTheme2(0, "Please choose Demo Assigned to",'',true);
			}else{
				showMessageTheme2(0, "Please choose Demo Assigned to");
			}
			return false;
		}
	}
 
 return flag;
}
function submitBookOrientation(formId, roleModuleId, leadsFrom, newTheme, leadFrom) {
 console.log("submitBookOrientation", leadFrom);
 if(newTheme){
			 hideMessageTheme2('');
		 }else{
			 hideMessage('');
		 }
 if(!validateRequestForBookOrientation(formId, newTheme, leadFrom)){
	 return false;
 }
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('orientation','save-book-orientation'),
	 data : JSON.stringify(getRequestForBookOrientation(formId, leadFrom)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT' ) {
			 if(newTheme){
				 showMessageTheme2(0, data['message'],'',true);
			 }else{
				 showMessageTheme2(0, data['message']);
			 }
		 } else {
				showMessageTheme2(1, data['message'],'',true);
				$("#leadPopupForm").modal('hide');
			 
		 }
		 return false;
	 }
 });
}
function getRequestForBookOrientation(formId, leadFrom){
	var studentOrientAssignReqest = {};
	studentOrientAssignReqest['bookDate'] = false;
	studentOrientAssignReqest['bookStartTime'] = false;
	studentOrientAssignReqest['bookEndTime'] = false;
	studentOrientAssignReqest['controlType'] = false;
	
	studentOrientAssignReqest['schoolId'] = SCHOOL_ID;
	studentOrientAssignReqest['userId'] = USER_ID;
	return studentOrientAssignReqest;
}

function advanceSearchStudentOrient(formId, moduleId, dataFrom, clickFrom, currentPage, userWiseStatus, newTheme ) {
	customLoader(true);
 	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','get-orientation-student'),
		data : JSON.stringify(getCallRequestForAdvanceSearchStudentOrient(formId, moduleId, dataFrom, clickFrom, currentPage, userWiseStatus, newTheme)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		// async:false,
		success : function(data) {
			console.log(data);
			if (data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT' ) {
				if(newTheme){
					showMessageTheme2(0, data['message'],'',true);
				}else{
					showMessageTheme2(0, data['message']);
				}
			} else {
				// showMessageTheme2(1, data['message'],'',true);
				
				var isDataTable = $.fn.dataTable.isDataTable('#orientTbl');
					if(isDataTable){
						$('#orientTbl').dataTable().fnDestroy();
					}
					var rhtml = getOrientList(data);
					$("#studentOrientList").html(rhtml).promise().done(function(){
						customLoader(false);
					});
					generateTinyUrls();
					$('#orientTbl').DataTable();
					var orientTable = $('#orientTbl').DataTable();
					if (!orientTable.data().any()){
						$(".moveOrientation-wrapper").addClass("d-none");
					}else{
						$(".moveOrientation-wrapper").removeClass("d-none");
					}
					$("#orientationSearch").modal("hide");   
			}
		}
 	});
}

function getCallRequestForAdvanceSearchStudentOrient(formId, moduleId, searchType, clickFrom, currentPage, userWiseStatus, newTheme ){
	$(".orientationErrorText").html('');
	var studentOrientAssignReqest = {};
	var searchTypeData=searchType;
	if($("#"+formId+" #stdfnameSearch").val()==''
		&& $("#"+formId+" #parentfnameSearch").val()==''
		&& $("#"+formId+" #countryId option:selected").val()==""
		&& $("#"+formId+" #stateId option:selected").val()=="0"
		&& $("#"+formId+" #cityId option:selected").val()=="0"
		&& $("#"+formId+" #gradeSearch option:selected").val()=="0"
		&& $("#"+formId+" #studentIdSearch").val()==""
		&& $("#"+formId+" #phoneNoSearch").val()==""
		&& $("#"+formId+" #startDateSearch").val()==""
		&& $("#"+formId+" #endDateSearch").val()==""
		&& $("#"+formId+" #statusSearch").val()==""
		&& $("#"+formId+" #assignToSearch").val()==undefined 
		){
			searchTypeData="full-search";
		}
	studentOrientAssignReqest['searchType']=searchTypeData;
	studentOrientAssignReqest['userWiseStatus']=userWiseStatus;
	studentOrientAssignReqest['studentName'] = $("#"+formId+" #stdfnameSearch").val().trim();
	studentOrientAssignReqest['parentName'] = $("#"+formId+" #parentfnameSearch").val().trim();
	studentOrientAssignReqest['country'] = $("#"+formId+" #countryId option:selected").val();
	studentOrientAssignReqest['state'] = $("#"+formId+" #stateId option:selected").val();
	studentOrientAssignReqest['city'] = $("#"+formId+" #cityId option:selected").val();
	studentOrientAssignReqest['standardId'] = $("#"+formId+" #gradeSearch option:selected").val();
	studentOrientAssignReqest['studentStringId'] = $("#"+formId+" #studentIdSearch").val().trim();
	studentOrientAssignReqest['phoneNo'] = $("#"+formId+" #phoneNoSearch").val();
	studentOrientAssignReqest['bookStartDate'] = $("#"+formId+" #startDateSearch").val();
	studentOrientAssignReqest['bookEndDate'] = $("#"+formId+" #endDateSearch").val();
	studentOrientAssignReqest['orientStatus'] = $("#"+formId+" #statusSearch").val();
	if($("#"+formId+" #assignToSearch option:selected").val()!=undefined){
		studentOrientAssignReqest['assignTo'] = $("#"+formId+" #assignToSearch option:selected").val();
	}
	
	if(currentPage==undefined){
		currentPage=0;
	}
	studentOrientAssignReqest['currentPage'] = currentPage;
	studentOrientAssignReqest['recordsPerPage']=10;
	studentOrientAssignReqest['userId']=USER_ID;
	studentOrientAssignReqest['schoolId']=SCHOOL_ID;
	//console.log(studentOrientAssignReqest);
	return studentOrientAssignReqest;
}

function getOrientList(data){
	var html = "";
	var getRecordingLimit = getSettingsByTypeAndKey("CONFIGURATION", "SHOW_RECORDINGS_LIMIT");
    getRecordingLimit = JSON.parse(getRecordingLimit);
    var recordingLimit = getRecordingLimit.data.metaValue;
    var pastDateLimit = new Date();
	pastDateLimit.setDate(pastDateLimit.getDate() - recordingLimit);
	if(data.studentOrientationList.length>0){
		var srno=1;
		for(var i=0;i<data.studentOrientationList.length;i++){
			var dlist = data.studentOrientationList[i];
			var onclick = "return callOrientPopup('orientStatusUpdate','"+dlist.id+"','edit','"+dlist.rescheduleNumber+"','"+dlist.totalRescheduleNumber+"')";
			var createOrientationMeeting = "return createOrientMeeting('orientStatusUpdate','"+dlist.id+"','createMeeting')";
			var sendMail = "return sendOrientationMail('orientStatusUpdate','"+dlist.id+"','sendMail')";
			var bookDate = dlist.bookDate.split('<br/>');
			var bookTime = bookDate[1].split('-');	
			var sessionDate = new Date(bookDate[0]);
    		var showRecordingButton = sessionDate >= pastDateLimit;		
			html=html+"<tr class='row-status-"+dlist.status+"'>";
			html=html+"<td><input type='checkbox' class='mt-1 checkOrientation' id='orientation-"+dlist.id+"' name='orientation-move-another' value="+dlist.id+" data-assignToUserId="+dlist.assignToUserId+" onchange='toggleOption(this)' /></td>";
			html=html+"<td>"+srno+"</td>";
			html=html+"<td><b>"+dlist.studentName+"</b><br/>"+dlist.learningPlan+"<br/>"+dlist.grade+"<br/>"+dlist.studentStringId+"</td>";
			html=html+"<td>"+dlist.bookDate+" ("+dlist.teacherTimeZone+")</td>";
			html=html+"<td>"+dlist.bookStudentDate+" ("+dlist.studentTimeZone+")</td>";
			html=html+"<td>"+dlist.assignName+"</td>";
			html=html+"<td class='position-relative'>";
			html=html+"<div>";
			html=html+dlist.status;
			html=html+"</div>";
			html += "<div><a href=\"" + dlist.startUrl + "\" target=\"_blank\" class='text-decoration-none full'" 
				+ (dlist.meetingId == null ? " style='pointer-events: none; color: grey; text-decoration: none; cursor: default;' onclick='return false;'" : "") 
				+ ">Start System Training</a></div>"
			html += "<div><a href=\"" + dlist.rescheduleUrl + "\" target=\"_blank\" class='text-decoration-none full'" 
				+ (dlist.meetingId == null ? " style='pointer-events: none; color: grey; text-decoration: none; cursor: default;' onclick='return false;'" : "") 
				+ ">Reschedule System Training</a></div>"
			html += "<div><a href=\"javascript:void(0);\" class='text-decoration-none full'" 
				+ (dlist.meetingId == null ? " style='pointer-events: none; color: grey; text-decoration: none; cursor: default;'" : " onclick=\"" + onclick + "\"") 
				+ ">Update</a></div>"
			html=html+"<b class=\"copy-msg-"+i+" text-success\" style=\""+(dlist.status=="RESCHEDULE"?"color:#fff !important":"")+"\"></b></br>"
			html=html+"<div class='position-absolute' style='top:0;left:0;'><input class='tinyUrl' type='text' id='copyUrl"+i+"' value=\""+dlist.joinUrl+"\" style='opacity:0;height:0px'></div>"
			html += "<button class='text-decoration-none btn btn-sm btn-success ' " + (dlist.meetingId == null ? "disabled " : "") + "onclick='copyURL(\"copyUrl" + i + "\",\"copy-msg-" + i + "\");'></i>Copy joining link <i class='pe-7s-copy-file'></i></button>";
			html=html+"</td>";
			if(dlist.sendMailStatus == 'Y'){
				html=html+"<td>Mail sent</td>";
			}else{
				html=html+"<td>"
				html=html+"<p class='m-0'></p>"
				html=html+"<div><a href=\"javascript:void(0);\" onclick=\""+sendMail+"\" class='btn btn-sm btn-warning mb-1 '>Send Mail <i class='pe-7s-paper-plane'></i></a></div>";
				if(dlist.recordingsCount != 0 && (USER_ROLE == "DIRECTOR" || showRecordingButton)){
					var signaporeDate = dlist.bookStartDateTimeSingapore.split(" ")[0];
					var signaporeTime = dlist.bookStartDateTimeSingapore.split(" ")[1];
					html=html+'<div><a href=\"javascript:void(0);\" class="btn btn-sm btn-primary " onclick="openRecordingModal(\''+dlist.meetingId+'\',\'MEETINGS\',\''+dlist.studentName+'\',\'System Training\',\''+bookDate[0]+'\',\''+bookTime[0]+'\',\''+dlist.assignName+'\',\''+signaporeDate+'\', \''+signaporeTime+'\', \'SYSTEM_TRAINING\')">Recording <i class="pe-7s-video"></i></a></div>'
				}
				html=html+"</td>";
			}
			html=html+"<td>"+dlist.remarks+"</td>";
			html=html+"<td>"+dlist.createDate+"</td>";
			// html=html+"<td>"
			// 				+"<div class='dropdown d-inline-block'>"
			// 					+"<button type='button' aria-haspopup='true' aria-expanded='false' data-toggle='dropdown' class='mb-2 mr-2 dropdown-toggle btn btn-primary'>"
			// 						+"<i class='fa fa-ellipsis-v'></i>"
			// 					+"</button>"
			// 					+"<div tabindex='-1' role='menu' aria-hidden='true' class='dropdown-menu dropdown-menu-right'>"
			// 						+"<ul class='nav'>"
			// 							+"<li class='nav-item-header nav-item py-0 w-100'>"
			// 								+"<a href=\"javascript:void(0);\" onclick=\""+onclick+"\" class='text-decoration-none full py-2 mb-1'><i class=\"fa fa-edit\"></i>&nbsp;Update</a>"
			// 							+"</li>"
			// 							+"<li class='nav-item-header nav-item py-0 w-100'>"
			// 								+"<a href=\"javascript:void(0);\" onclick=\""+createOrientationMeeting+"\" class='text-decoration-none full py-2 mb-1'><i class=\"fa fa-edit\"></i>&nbsp;Create Meeting</a>"
			// 							+"</li>"
			// 							+"<li class='nav-item-header nav-item py-0 w-100'>"
			// 								+"<a href=\"javascript:void(0);\" onclick=\""+sendMail+"\" class='text-decoration-none full py-2 mb-1'><i class=\"fa fa-edit\"></i>&nbsp;Send Mail</a>"
			// 							+"</li>"
			// 					+"</div>"
			// 				+"</div>"
			// 			+"</td>"
					html=html+"</tr>";
			srno=srno+1;
		}
	}
	// else{
	// 	html=html+"<tr>";
	// 	html=html+"<td colspan=\"9\" class=\"text-center\">No Records</td>";
	// 	html=html+"</tr>";
	// }
	return html;
}



function advanceOrientationSearchStudentReset(formId){
	$("#"+formId+" #statusSearch").val('').trigger('change');
	$("#"+formId+" #assignToSearch").val('').trigger('change');
	$("#"+formId+" #followMedSearch").val('').trigger('change');
	$("#"+formId+" #gradeSearch").val('').trigger('change');
	$("#"+formId+" #studentIdSearch").val('');
	$("#"+formId+" #phoneNoSearch").val('');
	$("#"+formId+" #stdfnameSearch").val('');
	$("#"+formId+" #parentfnameSearch").val('');
	$("#"+formId+" #gradeSearch").val('');
	$("#"+formId+" #city").val('0').trigger('change');
	$("#"+formId+" #stateId").val('0').trigger('change');
	$("#"+formId+" #countryId").val('0').trigger('change');
	$("#"+formId+" #startDateSearch").val('');
	$("#"+formId+" #endDateSearch").val('');
	$("#"+formId+" #leadModifyStartDateSearch").val('');
	$("#"+formId+" #leadModifyEndDateSearch").val('');
	$("#"+formId+" #leadCallStartDateSearch").val('');
	$("#"+formId+" #leadCallEndDateSearch").val('');
}


function callOrientPopup(popupId, orientId, popType,rescheduleNumber,totalRescheduleNumber){
	$("#orientStatus").val("").trigger("change");
	$("#"+popupId).modal('show');
	$("#orientId").val(orientId);
	$("#rescheduleNumber").val(rescheduleNumber);
	$("#totalRescheduleNumber").val(totalRescheduleNumber);
}

function createOrientMeeting(formId, orientId, popType) {
	hideMessageTheme2('');
	var data={};
	data['orientationId']=orientId;
	data['schoolId']=SCHOOL_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','create-orientation-meeting'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
			}
			return false;
		}
	});
   }
   function sendOrientationMail(formId, orientId, popType) {
	hideMessageTheme2('');
	var data={};
	data['orientationId']=orientId;
	data['schoolId']=SCHOOL_ID;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','send-orientation-mail'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',false);
			}
			return false;
		}
	});
   }
function saveOrientStatus(formId, roleModuleId) {
	customLoader(true)
	hideMessageTheme2('');
	if($("#orientStatus").val()==""||$("#orientStatus").val()==undefined || $("#orientStatus").val()==0){
		showMessageTheme2(0,"Please select status to update system training.");
		customLoader(false);
		return false;
	}

	if($("#orientRemark").val()==""||$("#orientRemark").val()==undefined || $("#orientRemark").val()==0){
		showMessageTheme2(0,"Please fill remarks to update system training.");
		customLoader(false);
		return false;
	}
	if($("#orientStatus").val()=="RESCHEDULE"){
		var rescheduleNumber = $("#rescheduleNumber").val();
		var totalRescheduleNumber =  $("#totalRescheduleNumber").val();
		if(rescheduleNumber == totalRescheduleNumber && rescheduleNumber != 0){
			if($("#rescheduleFeeStatus").is(':checked')){

			}else{
				showMessageTheme2(0,"Please Check if student has paid fee for rescheduling system training.");
				customLoader(false);
				return false;
			}
		}
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','update-orientation-status'),
		data : JSON.stringify(getRequestForOrientStatus(formId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == 'FAILED') {
				showMessageTheme2(0, data['message'],'',true);
				$('#'+formId)[0].reset();
			} else {
				showMessageTheme2(1, data['message'],'',false);
				$('#'+formId)[0].reset();
				$("#orientStatusUpdate").modal('hide');
				advanceSearchStudentOrient('orientationSearchForm', roleModuleId, 'advance-search', '', 0, OBJECT_RIGHTS.userWiseStatus, true); 
			}
			customLoader(false);
			return false;
		}
	});
   }
   function getRequestForOrientStatus(formId){
	var studentOrientAssignReqest = {};
	var meetingDate=$("#meetingDate").val();;
	var sTime=$("#startTimeHour").val()+":"+$("#startTimeMin").val()+":00";
	var eTime=$("#endTimeHour").val()+":"+$("#endTimeMin").val()+":00";
	studentOrientAssignReqest['orientId'] =$("#orientId").val();
	studentOrientAssignReqest['userId'] = USER_ID;
	studentOrientAssignReqest['orientStatus']=$("#orientStatus").val();
	 if($("#orientStatus").val()=='RESCHEDULE'){
	// 	studentOrientAssignReqest['bookDate']=meetingDate;
	// 	studentOrientAssignReqest['bookStartTime']=sTime
	// 	studentOrientAssignReqest['bookEndTime']=eTime
		if($("#rescheduleFeeStatus").is(':checked')){
			studentOrientAssignReqest['paymentStatus']='SUCCESS';
		}
	 }
	
	studentOrientAssignReqest['orientRemark']=$("#orientRemark").val();
	
	return studentOrientAssignReqest;
   }

function moveOrientationData(userId, roleModuleId, callFrom, currentPage, newTheme) {
	if(newTheme){
		hideMessageTheme2('');
	}else{
		hideMessage('');
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('orientation','move-orientation'),
		data : JSON.stringify(getRequestForMoveOrientationsData(userId)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
		   console.log(data);
			if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['status'] == 'FAILED') {
				if(newTheme){
					showMessageTheme2(0, data['message'],'',true);
					$("#orientationAssignMove").val('0')
				}else{
					showMessageTheme2(0, data['message']);
					$("#leadNoMove").val('');
					$("#moveOrientations").modal('hide');
				}
				
			} else {
			   showMessageTheme2(1, data['message'],'',false);
				$("#leadNoMove").val('')
				$("#moveOrientations").modal('hide');
				advanceSearchStudentOrient('orientationSearchForm', ROLE_MODULE.moduleId, 'advance-search', '', 0,  OBJECT_RIGHTS.userWiseStatus, true ); 
				
			}
			return false;
		}
	});
}

function getRequestForMoveOrientationsData(userId){
	var request = {};
	var authentication = {};
	var studentOrientationDto = {};
	var moveOrientationNo = $("#orientationNoMove").val();
	studentOrientationDto['orientationNo'] =moveOrientationNo.substring(1,moveOrientationNo.length);
	studentOrientationDto['assignTo'] =$("#orientationAssignMove").val();
	if($("#orientationAssignMove").val()==0 || $("#orientationAssignMove").val()==undefined || $("#orientationAssignMove").val()==""){
		showMessageTheme2(2,"Please select atleast one asignee to move system training.");
		return false;
	}
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	authentication['userType'] = 'COMMON';
	request['authentication'] = authentication;
	request['studentOrientationDto'] = studentOrientationDto;
	return request;
}


 function updateOrientStatus(src){
	if($(src).val() == "RESCHEDULE"){
		// $(".reschedule-Orient-Status").show();
		var rescheduleNumber=$('#rescheduleNumber').val();
		var totalRescheduleNumber=$('#totalRescheduleNumber').val();
		if(rescheduleNumber==totalRescheduleNumber && rescheduleNumber!=0 ){
			$(".checkboxStatus").show();
		}else{
			$(".checkboxStatus").hide();
		}
	}else{
		$(".checkboxStatus").hide();
		$(".reschedule-Orient-Status").hide();
	}
}

function getRequestForStudentOrientReports(moduleId , userId){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['userId']=userId;
	data['moduleId'] = moduleId;
	return data;
}

function getStudentOrientData(moduleId, userId) {
	if(!getSession()){
		redirectLoginPage();
		return false;
	}
	//"lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/student-orientaion-data',
			data : JSON.stringify(getRequestForStudentOrientReports(moduleId, userId)),
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

function getOrientaionAssignUser() {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['todayDate']=$("#formdate").val();
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'orientaion-assign-user-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                console.log(data);
				var assignUserList= data.assignUserList!=""?JSON.parse(data.assignUserList):"";
              
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    var html =getAssignUserTableHtml(assignUserList);
                    $("#orientAssignUser").html(html);                    
                }
                
			}
	   });
   }


   function getAssignUserTableHtml(assignUserList){
    var html='';
    var ti=0;
	if(assignUserList!=""){
		var inc=1;
		for (let m = 0; m < assignUserList.length; m++) {
			const assignUser = assignUserList[m];
			var autoInc=assignUser.orderBy!=''?assignUser.orderBy:inc
			html+=`<tr class="assignItem">	
				 <td>${inc}</td>
				 <td class="text-left"><input type="hidden" class="assignto"  value="${assignUser.assignTo}">
				<b>${assignUser.assignName}</b><br/>
				${assignUser.cityName } | ${assignUser.countryName } | ${assignUser.countryTimezone }</td>
				 <td><input type="text" name="orderBy" class="rowindex" value="${autoInc}" size="5"  maxlength="5" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/></td>
				 <td><input type="text" name="totalAssignLead" class="totalAssignLead" value="${assignUser.totalAssignLeads}" size="5"  maxlength="5"  ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/></td>
				 <td>
				 <label class="switch" >
						<input class="switch-input assignActiveCouns" id="counselorCheckbox${assignUser.assignTo}"  type="checkbox" ${assignUser.counselorActivate == 'Y' ? 'checked':''}  value="${assignUser.counselorActivate}" 
						onclick="activeOrientCounselor(this.value, '${assignUser.assignTo}', '${autoInc}')" data-size="mini"/>
						<span class="switch-label" data-on="Yes" data-off="No"></span> <span class="switch-handle"></span> 
					</label>
				 </td>
				 <td>${assignUser.totalAutoAssignLeads}/${assignUser.totalLeads}</td>
				 <td><a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="getAvailability('${assignUser.assignTo}');" >Add | Edit Availablity</a></td>
			 </tr>`;
			//getSelectGrade('grades'+assignUser.assignTo+','assignUser.grades');
			//getSelectCountries('leadCountry'+assignUser.assignTo+','assignUser.countries');
			 inc=inc+1;
		}
	}else{

	}
        return html;
  }



function saveInactiveAssignCounselorOrient(userId, checkedVal, orderBy, forUse) {
 hideMessageTheme2('');
 
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLFor('leads','inactive-assign-counselor'),
	 data : JSON.stringify(getRequestForInactiveAssignCounselorOrient(userId, checkedVal, orderBy, forUse)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			showMessageTheme2(1, data['message'],'',true);
			if(forUse == 'INITIAL-INTERVIEW'){
				getTeacherInterviewAssign();
			}else{
				getOrientaionAssignUser();
			}
		 }
		 return false;
	 }
 });
}
function getRequestForInactiveAssignCounselorOrient(userId, checkedVal, orderBy, forUse){
	var leadAddFormRequestDTO = {};
	var authentication = {};
	var leadCommonDTO = {};
	var leadDemoInfo={};
	var leadCallFollowupDTO={};
	var leadModifyDTO={};

	leadDemoInfo['orderBy']=orderBy;
	leadDemoInfo['counselorActivate']=checkedVal;
	leadModifyDTO['assignTo']=userId;
	leadCallFollowupDTO['assignUserType']=forUse;

	leadCommonDTO['leadDemoInfo']=leadDemoInfo;
	leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = userId;
	authentication['userType'] = 'COMMON';
	leadAddFormRequestDTO['authentication'] = authentication;
	leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
	return leadAddFormRequestDTO;
}

function selectDateOnTypeChange(src) {
  if ($(src).val() == "custom") {
    $("#startDateSearch, #endDateSearch").datepicker("destroy"); // Remove previous datepickers
    $("#startDateSearch")
      .datepicker({
        format: "mm-dd-yyyy",
        container: "#orientationSearchForm .datepickerStartWrapper",
        autoclose: true,
        //startDate:new Date()
      })
      .on("change", function () {
        // Get the startDate
        var startDate = new Date($(this).val());
        var endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Increment by 1 day

        // Remove and reinitialize #endDate with updated startDate
        $("#endDateSearch").datepicker("destroy");
        $("#endDateSearch").datepicker({
          format: "mm-dd-yyyy",
          container: "#orientationSearchForm .datepickerEndWrapper",
          autoclose: true,
          startDate: endDate, // Set minimum date for #endDate
        });
      });

    // Initialize #endDate initially without restrictions
    $("#endDateSearch").datepicker({
      format: "mm-dd-yyyy",
      container: "#orientationSearchForm .datepickerEndWrapper",
      autoclose: true,
    });

    // Enable and clear the fields
    $("#startDateSearch, #endDateSearch").attr("disabled", false).removeClass("bg-light-primary");
    $("#startDateSearch, #endDateSearch").val("");
  } else {
    // Disable fields for non-custom types
    $("#startDateSearch, #endDateSearch").attr("disabled", true).addClass("bg-light-primary");
    // $("#startDate, #endDate").val("");
  }

  	if ($("#orientationSearchForm #selectedType").val() == "today") {
		let today = new Date();
		let month = today.getMonth() + 1; // Month is 0-indexed, so add 1
		let day = today.getDate();
		let year = today.getFullYear();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		let formattedDate =`${month}-${day}-${year}`;
		startDate = formattedDate;
		endDate = startDate;
		$("#orientationSearchForm #startDateSearch").val(startDate);
		$("#orientationSearchForm #endDateSearch").val(endDate);
	} else if ($("#orientationSearchForm #selectedType").val() == "yesterday") {
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		let month = yesterday.getMonth() + 1; // Month is 0-indexed, so add 1
		let day = yesterday.getDate();
		let year = yesterday.getFullYear();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		let formattedDate =`${month}-${day}-${year}`;
		startDate = formattedDate;
		endDate = startDate;
		$("#orientationSearchForm #startDateSearch").val(startDate);
		$("#orientationSearchForm #endDateSearch").val(endDate);
	} else if ($("#orientationSearchForm #selectedType").val() == "week") {
		let today = new Date();
		let firstDay = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
		let lastDay = new Date(today.setDate(today.getDate() + 6)); // End of the week (Saturday)
		let month = firstDay.getMonth() + 1; // Month is 0-indexed, so add 1
		let day = firstDay.getDate();
		let year = firstDay.getFullYear();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		let startDate = `${month}-${day}-${year}`;
		month = lastDay.getMonth() + 1; // Month is 0-indexed, so add 1
		day = lastDay.getDate();
		year = lastDay.getFullYear();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		let endDate = `${month}-${day}-${year}`;
		$("#orientationSearchForm #startDateSearch").val(startDate);
		$("#orientationSearchForm #endDateSearch").val(endDate);
	} else if ($("#orientationSearchForm #selectedType").val() == "month") {
		let today = new Date();
		let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
		let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		let month = firstDay.getMonth() + 1; // Month is 0-indexed, so add 1
		let day = firstDay.getDate();
		let year = firstDay.getFullYear();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		let startDate = `${month}-${day}-${year}`;
		month = lastDay.getMonth() + 1; // Month is 0-indexed, so add 1
		day = lastDay.getDate();
		year = lastDay.getFullYear();
		month = month < 10 ? '0' + month : month;
		day = day < 10 ? '0' + day : day;
		let endDate = `${month}-${day}-${year}`;
		$("#orientationSearchForm #startDateSearch").val(startDate);
		$("#orientationSearchForm #endDateSearch").val(endDate);
	}
}
