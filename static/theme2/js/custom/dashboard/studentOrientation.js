
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
				showMessage(true, "Please select Lead Source");
			}
		return false;
	}
	if($("#"+formId+" #leadSource").val()==5){
		if ($("#"+formId+" #leadDemoAssign").val()==null || $("#"+formId+" #leadDemoAssign").val()==0) {
			if(newTheme){
				showMessageTheme2(0, "Please choose Demo Assigned to",'',true);
			}else{
				showMessage(true, "Please choose Demo Assigned to");
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
	 contentType : "application/json",
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
				 showMessage(true, data['message']);
			 }
		 } else {
				showMessageTheme2(1, data['message'],'',true);
				$("#leadPopupForm").modal('hide');
			 
		 }
		 return false;
	 },
	 error : function(e) {
		 //showMessage(true, e.responseText);
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
		contentType : "application/json",
		url : getURLFor('orientation','get-orientation-student'),
		data : JSON.stringify(getCallRequestForAdvanceSearchStudentOrient(formId, moduleId, dataFrom, clickFrom, currentPage, userWiseStatus, newTheme)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async:false,
		success : function(data) {
			console.log(data);
			if (data['status'] == 'FAILED' || data['status'] == 'EXCEPTION' || data['status'] == 'SESSIONOUT' ) {
				if(newTheme){
					showMessageTheme2(0, data['message'],'',true);
				}else{
					showMessage(true, data['message']);
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
					$('#orientTbl').DataTable();
					var orientTable = $('#orientTbl').DataTable();
					if (!orientTable.data().any()){
						$(".moveOrientation-wrapper").addClass("d-none");
					}else{
						$(".moveOrientation-wrapper").removeClass("d-none");
					}
					$("#orientationSearch").modal("hide");   
			}
		},
		error : function(e) {
			console.log(e);
			customLoader(false);
		}
 	});
}

function getCallRequestForAdvanceSearchStudentOrient(formId, moduleId, searchType, clickFrom, currentPage, userWiseStatus, newTheme ){
	$(".orientationErrorText").html('');
	var studentOrientAssignReqest = {};
	studentOrientAssignReqest['searchType']=searchType;
	studentOrientAssignReqest['userWiseStatus']=userWiseStatus;
	studentOrientAssignReqest['studentName'] = $("#"+formId+" #stdfnameSearch").val();
	studentOrientAssignReqest['parentName'] = $("#"+formId+" #parentfnameSearch").val();
	studentOrientAssignReqest['country'] = $("#"+formId+" #countryId option:selected").val();
	studentOrientAssignReqest['state'] = $("#"+formId+" #stateId option:selected").val();
	studentOrientAssignReqest['city'] = $("#"+formId+" #cityId option:selected").val();
	studentOrientAssignReqest['standardId'] = $("#"+formId+" #gradeSearch option:selected").val();
	studentOrientAssignReqest['email'] = $("#"+formId+" #emailIdSearch").val();
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
			html=html+"<td class='position-relative'>"+dlist.status;
			html += "<a href=\"" + dlist.startUrl + "\" target=\"_blank\" class='text-decoration-none full'" 
				+ (dlist.meetingId == null ? " style='pointer-events: none; color: grey; text-decoration: none; cursor: default;' onclick='return false;'" : "") 
				+ ">Start System Training</a>"
			html += "<a href=\"" + dlist.rescheduleUrl + "\" target=\"_blank\" class='text-decoration-none full'" 
				+ (dlist.meetingId == null ? " style='pointer-events: none; color: grey; text-decoration: none; cursor: default;' onclick='return false;'" : "") 
				+ ">Reschedule System Training</a>"
			html += "<a href=\"javascript:void(0);\" class='text-decoration-none full'" 
				+ (dlist.meetingId == null ? " style='pointer-events: none; color: grey; text-decoration: none; cursor: default;'" : " onclick=\"" + onclick + "\"") 
				+ ">Update</a>"
			html=html+"<b class=\"copy-msg-"+i+" text-success\"></b></br>"
			html=html+"<div class='position-absolute' style='top:0;left:0;'><input type='text' id='copyUrl"+i+"' value=\""+dlist.joinUrl+"\" style='opacity:0;height:0px'></div>"
			html += "<button class='text-decoration-none btn btn-sm btn-primary' " + (dlist.meetingId == null ? "disabled " : "") + "onclick='copyURL(\"copyUrl" + i + "\",\"copy-msg-" + i + "\");'></i>Copy joining link</button>";
			html=html+"</td>";
			if(dlist.sendMailStatus == 'Y'){
				html=html+"<td>Mail sent</td>";
			}else{
				html=html+"<td>"
				html=html+"<p class='m-0'></p>"
				html=html+"<a href=\"javascript:void(0);\" onclick=\""+sendMail+"\" class='text-decoration-none full font-weight-semi-bold' style='margin-bottom:5px;'>Send Mail</a>";
				if(dlist.recordingsCount != 0 && (USER_ROLE == "DIRECTOR" || showRecordingButton)){
					html=html+'<a href=\"javascript:void(0);\" class="text-primary font-weight-semi-bold" style="display: inline-block;width: max-content;" onclick="openRecordingModal(\''+dlist.meetingId+'\',\'MEETINGS\',\''+dlist.studentName+'\',\'System Training\',\''+bookDate[0]+'\',\''+bookTime[0]+'\',\''+dlist.assignName+'\',\''+dlist.bookStartDateTimeSingapore+'\')">View Recording <i class="fa fa-eye mt-2"><i/></a>'
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
	$("#"+formId+" #emailIdSearch").val('');
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
		contentType : "application/json",
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
		},
		error : function(e) {
			//showMessage(true, e.responseText);
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
		contentType : "application/json",
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
		},
		error : function(e) {
			//showMessage(true, e.responseText);
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
		contentType : "application/json",
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
				advanceSearchStudentOrient('orientationSearchForm', roleModuleId, 'advance-search', '', 0, false, true); 
			}
			customLoader(false);
			return false;
		},
		error : function(e) {
			customLoader(false);
			//showMessage(true, e.responseText);
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
		contentType : "application/json",
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
					showMessage(true, data['message']);
					$("#leadNoMove").val('')
				}
				
			} else {
			   if(newTheme){
				   showMessageTheme2(1, data['message'],'',false);
				   $("#leadNoMove").val('')
				   setTimeout(function(){
					   location.reload();
				   }, 1500);
			   }else{
				   showMessage(true, data['message']);
				   $('#moveLeads').modal('hide');
				   setTimeout(function(){
					   callForDashboardData('formIdIfAny','lead-list?moduleId='+roleModuleId+'&leadFrom='+leadFrom+'&clickFrom=list&currentPage='+currentPage);
				   }, 1500);
			   }
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
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

function openRecordingModal(entityId, entityType, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName, bookStartDateTimeSingapore) {
    const body = {
        entityId: entityId,
        entityName: entityType,
		meetingDate: formatDateToYYYYMMDDHH(convertLocalToUTC(bookStartDateTimeSingapore, "YYYY-MM-DD HH:mm:ss", BASE_TIMEZONE, "YYYY-MM-DD HH:mm:ss")),
		meetingType: "SYS-TRAINING"
    };

    $.ajax({
        type: "POST",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/v1/leads/get-event-recordings",
        data: JSON.stringify(body),
        contentType: "application/json",
        success: function (response) {
            const res = JSON.parse(response);
            if (res.statusCode === 0 && res.status === "success") {
                const recordings = res.data.recordingUrls;
                if (recordings && recordings.length > 0) {
                    populateRecordingModal(recordings, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName);
                } else {
                    showMessageTheme2(0, "No recordings available.", '', true);
                }
            } else {
                showMessageTheme2(0, `Error: ${res.message}`, '', true);
            }
        },
        error: function (e) {
            console.error("Error Fetching the data:", e.message);
        }
    });
}

function populateRecordingModal(recordings, inviteeName, meetingTitle, meetingStartDate, meetingStartTime, hostName) {
    const titles = {
        "shared_screen_with_speaker_view.mp4": "Shared Screen with Speaker View",
        "active_speaker.mp4": "Active Speaker",
        "shared_screen_with_gallery_view.mp4": "Shared Screen With Gallery View",
        "gallery_view.mp4": "Gallery View",
		"shared_screen.mp4": "Shared Screen",
		"shared_screen_with_speaker_view_CC.mp4": "Shared Screen With Speaker View CC",
        "-1.1.mp4": "Recording",
		"-1.2.mp4": "Recording 2",
        "audio_only": "Audio File",
    };

    let modalContent = `
        <div id="recordingModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog" style="max-width:70%;">
                <div class="modal-content">
                    <div class="modal-header theme-bg">
                        <h5 class="modal-title text-white">Available Recordings | ${inviteeName} | ${meetingTitle} | ${meetingStartDate} ${meetingStartTime} | ${hostName}</h5>
                        <button onclick="closeAllVideoModal();" type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                    </div>
                    <div class="modal-body">`;

    recordings.forEach(record => {
        const meetingId = record.meetingId;
        const sessionUrls = record.urls
            .map(urlData => {
                for (const key in titles) {
                    if (urlData.url.includes(key)) {
                        return { url: urlData.url, title: titles[key] };
                    }
                }
                // return { url: urlData.url, title: "Unknown Recording" };
            })
            // .filter(recording => !recording.url.includes("shared_screen.mp4"));

        const transcriptUrl = record.urls[record.urls.length - 1]?.url;

        if (sessionUrls.length > 0) {
            modalContent += `
                <div class="session-block pb-4">
                    <h5>Meeting ID: ${meetingId}</h5>
                    ${sessionUrls.map((recording, index) => `
                        <div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                            <h6>${index + 1}. ${recording.title}</h6>
                            <button class="btn btn-primary" onclick="playRecording('${recording.url}', '${recording.title}')">Play</button>
                        </div>
                    `).join("")}
                    ${
                        transcriptUrl 
                            ? `
                            <div class="recording-item pb-3 pt-2 px-3 d-flex justify-content-between align-items-center" style="border-bottom:1px solid #eee;">
                                <h6>${sessionUrls.length + 1}. Transcript</h6>
                                <button class="btn btn-secondary" onclick="showVTTFile('${transcriptUrl}', 'Transcript')">Read</button>
                            </div>`
                            : ""
                    }
                </div>`;
        }
    });

    modalContent += `
                    </div>
                </div>
            </div>
        </div>
    `;

    let modalElement = $("#recordingModal");
    if (modalElement.length > 0) {
        modalElement.remove();
    }

    $("body").append(modalContent);
    $("#recordingModal").modal("show");
}

function playRecording(videoUrl, title) {
    let videoModal = $("#videoModal");
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        url: getURLForSignVideo(videoUrl),
        success: function (responseData) {
            if (responseData.status == 0) {
                const signedUrl = responseData.url;

                if (videoModal.length == 0) {
                    $("body").append(`
                        <div id="videoModal" class="modal fade" tabindex="-1">
                            <div class="modal-dialog" style="max-width:70%;">
                                <div class="modal-content">
                                    <div class="modal-header theme-bg">
                                        <h5 class="modal-title text-white">${title}</h5>
                                        <button onclick="closeVideoModal();" type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close">&times;</button>
                                    </div>
                                    <div class="modal-body text-center">
                                        <video class="videoTag w-100" controls>
                                            <source src="${signedUrl}" type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `);
                } else {
					videoModal.find(".modal-title").text(title);
					videoModal.find(".videoTag source").attr("src", signedUrl);
					videoModal.find(".videoTag")[0]?.load();
                }

                $("#videoModal").modal("show");
                // videoModal.find(".videoTag")[0]?.play();
            } else {
                showMessageTheme2(0, responseData.message || "Failed to fetch video URL", '', true);
            }

            customLoader(false);
        },
        error: function (e) {
            console.error("Error fetching signed video URL:", e.message);
            showMessageTheme2(0, "Error fetching video.", '', true);
            customLoader(false);
        }
    });
}

function getURLForSignVideo(videoUrl) {
    const payload = JSON.stringify({ url: videoUrl });
    const encodePayload = window.btoa(payload);
    return BASE_URL + CONTEXT_PATH + "videos/signed-url?payload=" + encodePayload;
}

function getURLForTranscriptContent(transcriptUrl) {
    var payload = JSON.stringify({ url: transcriptUrl });
    var encodePayload = window.btoa(payload);
    return BASE_URL + CONTEXT_PATH + "transcript/show-content?payload=" + encodePayload;
}

function convertToVTT(videoUrl) {
    if (!videoUrl.endsWith(".mp4")) {
        return null;
    }
    const urlParts = new URL(videoUrl);
    const filePath = urlParts.pathname.replace(
        /\/([^\/]+)-(\d+\.\d+)\.mp4$/,
        "/$1-transcript-$2.vtt"
    );
    let transcriptUrl = urlParts.origin + filePath;

    if (transcriptUrl === videoUrl) {
        const prefixUrl = "https://ischoolingwise.s3.us-east-1.amazonaws.com/recordings/";
        const sessionId = videoUrl.split(prefixUrl)[1].split("-")[0];
        transcriptUrl = `${prefixUrl}${sessionId}-transcript-1.1.vtt`;
    }
    return transcriptUrl;
}

function displayVTT(content, title) {
    const output = $("#transcript-modal-body");
    output.empty();

    if(content.includes("<Error><Code>")){
		output.append(`<p style="font-size: 18px;">No Transcript Available</p>`)
	} else {
		var lines = content.split("\n");
		lines.forEach(line => {
			var p = $("<p></p>").text(line);
			output.append(p);
		});
	}

    $("#transcriptModalTitle").html(title);
    $("#transcriptModal").modal("show");
}

function showVTTFile(url, title) {
    let transcriptModal = $("#transcriptModal");

    if (transcriptModal.length === 0) {
        $("body").append(`
            <div id="transcriptModal" class="modal fade" tabindex="-1">
                <div class="modal-dialog" style="max-width:70%;">
                    <div class="modal-content" style="height: 80vh;">
                        <div class="modal-header theme-bg">
                            <h5 id="transcriptModalTitle" class="modal-title text-white">Transcript</h5>
                            <button type="button" class="close btn-close text-white" data-bs-dismiss="modal" aria-label="Close" onclick="closeTranscriptModal();">&times;</button>
                        </div>
                        <div id="transcript-modal-body" class="modal-body text-left" style="overflow-y: auto;">
                            <!-- Transcript content will be populated here -->
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    customLoader(true);
	const vttFile = convertToVTT(url);
    $.ajax({
        type: "GET",
        contentType: "application/json",
        dataType: 'json',
        url: getURLForTranscriptContent(vttFile),
        success: function(responseData) {
            customLoader(false); 
            displayVTT(responseData.content, title);
        },
        error: function() {
            customLoader(false);
            showMessageTheme2(0, "Failed to load transcript.", '', true);
        }
    });
}

function closeAllVideoModal(){
	$("#recordingModal").modal("hide");
}

function closeVideoModal(){
	const videoElement = $("#videoModal .videoTag")[0];
    if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
    }
    $("#videoModal").modal("hide");
}

function closeTranscriptModal(){
     $("#transcriptModal").modal("hide");
}

function formatDateToYYYYMMDD(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateToYYYYMMDDHH(dateStr) {
    if (!dateStr) return null;
    
	const date = new Date(dateStr);
	if (isNaN(date)) return null;

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const finalDate = year + '-' + month + '-' + day + " " + hours;
	return finalDate;
}