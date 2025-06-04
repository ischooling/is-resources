var slickSiderRender = false;
function customModalShow(src, zIndex, ){
	$(src).css('z-index', zIndex);
	$(src).find('.modal-dialog').css('margin-top', 46 * $('.right-slide-modal:visible').length); // Adjust margin-top dynamically
	$(src).find(".modal-content").css("height", 'calc(100% - ' + (60 * $('.right-slide-modal:visible').length) + 'px)');
	$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack '+(zIndex-1));
}
function scrollMoreAvailability(){
	$('#availiblityModal .modal-body').animate({scrollTop:0},500);
	$(".blink-btn").addClass("blink");
	setTimeout(function(){
		$(".blink-btn").removeClass("blink");
	}, 2000);
}

function courseProviderList(formId, elementId) {
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster('formId', 'ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#' + formId + ' #' + elementId);
				dropdown.html('');
				if (formId == 'teacherAssignForm') { } else {
					dropdown.append('<option value="">Select LMS Platform</option>');
				}

				$.each(result, function (k, v) {
					if (formId == 'teacherAssignForm') {
						// if (v.key == 37) {
						// 	dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
						// 	//dropdown.prop("disabled",true)
						// }
						if (v.key == 36 || v.key == 37 || v.key == 38|| v.key==39|| v.key==40) {
							dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
							//dropdown.prop("disabled",true)
						}
					} else {
						if (v.key == 36 || v.key == 37 || v.key == 38|| v.key==39|| v.key==40) {
							dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
							//dropdown.prop("disabled",true)
						}
					}
				});
			}
		}
	});
}

function getAllTimeZone(fromTimeId) {
	//hideMessage('');
	//<option value="${timeZone.key}" data-timezone="${timeZone.extra4}">(${timeZone.extra}) - ${timeZone.value}</option>
	$("#"+fromTimeId).append('<option  value="">Select Timezone</option>');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('', 'TIMEZONE-LIST', '')),
		dataType : 'json',
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
			} else {
				$.each(data['mastersData']['countryTimeZones'], function(k, v) {
					$("#"+fromTimeId).append('<option custom_timezone_id="'+v.key+'" value="' + v.extra4 + '" data-timezone="' + v.value + '">(' + v.extra + ') - ' + v.extra1 +'/'+ v.extra3+ '</option>');
				});
			}
		}
	});
}
var trObj = [];
var serialNumberUpdateFlag = true;
var requestajax=[];
var isDataTable = false;
var datatableinc=0;
function callTeacherListForAvailability(formId, teacherUserId) {
    customLoader(true);

    if (teacherUserId == '') {
        if (requestajax.length > 0) {
            requestajax.forEach(function(request, index) {
                try {
                    request.abort(); // Abort each AJAX request
                } catch (er) {
                    console.log(er);
                }
            });
        }
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('report', 'get-teacher-availability'),
        data: JSON.stringify(getRequestForTeacherAvailability(formId, teacherUserId)),
        dataType: 'json',
        success: function(data) {
            console.log(data);

            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(false, data['message']);
                $(".teacher-time-body").html('');
                var htmlss = '';
                htmlss += '<tr class="td-border-design">';
                htmlss += '<td class="bold" style="border-width:1px;border-color:#eee; text-align:center;" colspan="10">No Record Found</td>';
                htmlss += '</tr>';
                $(".teacher-time-body").html(htmlss);
            } else {
                // Update teacher count and other summary stats
                $("#totalTeacherLive").text(data.teacherList.length);
                $("#totalTeacher").text(data.teacherList.length);
                $("#agreedHrs").text(data.strTotalagreedHrs);
                $("#availableHrs").text(data.strTotalAvailabelHrs);
                $("#occupiedHrs").text(data.strTotalDaywiseoccupiedHrs);
                $("#unoccupiedHrs").text(data.strTotalDaywiseunoccupiedHrs);
                $("#remaining").text(data.strTotalDaywiseRemaining);

                requestajax = []; // Clear previous requests if needed

                // Generate the HTML content for the teacher availability table
				// var isDataTable = $.fn.DataTable.isDataTable('#teacher-available-timelist');
				// if(isDataTable){
				// 	$('#teacher-available-timelist').dataTable().fnDestroy();
				// }
				var isDataTableNew = $.fn.DataTable.isDataTable('#teacher-available-timelist');
				if(isDataTableNew){
					$('#teacher-available-timelist').dataTable().fnDestroy();
					isDataTable = $.fn.DataTable.isDataTable('#teacher-available-timelist');
				}
				datatableinc=0;
                var htmls = getTimeAvailableTeacherHtml(data.teacherList, data.USER_ID);
				$(".teacher-time-body").html(htmls);
				
				// $.fn.dataTable.ext.type.order['time-pre'] = function (data) {
				// 	var time = data.split(':');
				// 	return parseInt(time[0], 10) * 60 + parseInt(time[1], 10);
				// };
				// if(!isDataTable){
				// 	$("#teacher-available-timelist").DataTable({
				// 		"pageLength": 150,
				// 		"scrollX": true,
				// 		"ordering": true,
				// 		"drawCallback": function(settings) {
				// 			var api = this.api();
				// 			api.rows({ page: 'current' }).every(function(rowIdx, tableLoop, rowLoop) {
				// 				if (serialNumberUpdateFlag) {
				// 					trObj.push(settings.aiDisplay);
				// 					serialNumberUpdateFlag = false;
				// 					updateSerialNumber(trObj);
				// 				}
				// 				this.invalidate();
				// 			});
				// 		}
				// 	});
				// 	isDataTable=true;
				// }
				customLoader(false);
            }
        },
        error: function(e) {
            console.log(e);
            customLoader(false);
        }
    });
}





function getRequestForTeacherAvailability(formId, teacherUserId){
	var data={};
	var teacherTimeListFilterDTO={};
	
	teacherTimeListFilterDTO['userId']=USER_ID;
	if(teacherUserId!=''){
		teacherTimeListFilterDTO['teacherUserId']=teacherUserId;
	}
	teacherTimeListFilterDTO['datetype']=$("#"+formId+" #timeAvailableSearchtype").val();
	teacherTimeListFilterDTO['teacherName']=$("#"+formId+" #teacherName").val();
	teacherTimeListFilterDTO['teacherProfileStatus']=$("#"+formId+" #teacherProfileStatus").select2('val');
	teacherTimeListFilterDTO['email']=$("#"+formId+" #teacherEmail").val();
	teacherTimeListFilterDTO['timeZoneFrom']=$("#"+formId+" #timeZoneFrom").val();
	teacherTimeListFilterDTO['timeZoneTo']=$("#"+formId+" #timeZoneTo").val();

	var starttime=$("#"+formId+" #timeAvailableDateFrom").val()+" "+$("#"+formId+" #startTime").val();
	var endTime=$("#"+formId+" #timeAvailableDateTo").val()+" "+$("#"+formId+" #endTime").val();

	teacherTimeListFilterDTO['paymentDateFrom']=starttime;
	teacherTimeListFilterDTO['paymentDateTo']=endTime;
	
	teacherTimeListFilterDTO['teacherName']=$("#"+formId+" #teacherName").val();
	teacherTimeListFilterDTO['lmsPlatform']=$("#"+formId+" #lmsPlatform").val();
	teacherTimeListFilterDTO['standarId']=$("#"+formId+" #standardId").val();
	teacherTimeListFilterDTO['subjectId']=$("#"+formId+" #subjectId").val();
	data['teacherTimeListFilterDTO']=teacherTimeListFilterDTO;
	//console.log(data);
	return data;
}

function getDataForAllRecommendedTeacher(formId){
	var recommendedTeacherRequest={};
	recommendedTeacherRequest['studentStandardId'] = $("#studentStandardId").val();
	recommendedTeacherRequest['studentUserId'] = $("#studentUserId").val();
	recommendedTeacherRequest['subjectId'] = $("#"+formId +" #courseName").val();
	recommendedTeacherRequest['userId'] = USER_ID;
	recommendedTeacherRequest['schoolId'] = SCHOOL_ID;
	
	return recommendedTeacherRequest;
}

function getAllRecommendedTeacher(formId) {
	if($("#"+formId + " #typeahead").val() == null || $("#"+formId+" #typeahead").val() == undefined || $("#"+formId+" #typeahead").val() == ""){
		showMessageTheme2(0, "Please search for a student.");
		return false;
	}
	// if($("#"+formId+" #courseName").val() == null || $("#"+formId+" #courseName").val() == undefined || $("#"+formId+" #courseName").val() == ""){
	// 	showMessageTheme2(0, "Please select course name.");
	// 	return false;
	// }
	if($("#"+formId+" #timePreferenceSlotWrapper .selectedPreferenceSlot").length<1){
		showMessageTheme2(0, "Please add time preference.");
		return false;
	}
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('teacherautoassign', 'student-teacher-subject-list'),
		data : JSON.stringify(getDataForAllRecommendedTeacher(formId)),
		async:true,
		globle:false,
		success : function(data) {
			data = JSON.parse(data)
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				$(".bulkUpdateBtnWrapper .btn").show();
				var standardId = $("#standardIdInput").val();
				$("#recommendedTeachers tbody").html(recommendedTeacherTr(data.subjectList, standardId));
				$(".bulkUpdateBtnWrapper .btn").addClass("disabled"); 
				if(standardId>=11 && standardId<=17){
					$(".bulkUpdateBtnWrapper .btn").hide();
				}else{
					$(".bulkUpdateBtnWrapper .btn").show();
				}
			}
		}
	});
}

function getDataForRecommendedTeacherBySubject(subjectId){
	var recommendedTeacherRequest={};
	recommendedTeacherRequest['studentStandardId'] = $("#studentStandardId").val();
	recommendedTeacherRequest['studentUserId'] = $("#studentUserId").val();
	recommendedTeacherRequest['subjectId'] = subjectId;
	recommendedTeacherRequest['userId'] = USER_ID;
	recommendedTeacherRequest['schoolId'] = SCHOOL_ID;
	var recomHrs=[];
	$('.selectedPreferenceSlot').each(function(index, sp) { 
		var rtime={};
		var sTime = $(this).find(".startTimeText").text();
		var eTime = $(this).find(".endTimeText").text();
		rtime['startTime']=sTime;
		rtime['endTime']=eTime;
		recomHrs.push(rtime);
	});
	recommendedTeacherRequest['selectTime']=recomHrs;
	return recommendedTeacherRequest;
}

function getAllRecommendedTeacherBySubject(subjectId, elementId, elementrySubjectID,uppderIndex, teacherUserId) {
	customLoader(false);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('teacherautoassign', 'teacher-recommended-list'),
		data : JSON.stringify(getDataForRecommendedTeacherBySubject(subjectId)),
		//async:true,
		globle:false,
		success : function(data) {
			data = JSON.parse(data)
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				var htmml=recommendedTeacherBySubjectTr(data, subjectId, elementrySubjectID,uppderIndex, teacherUserId);
				if(htmml!=''){
					$("."+elementId).html(htmml);
					$("."+elementId).removeClass("font-weight-semi-bold font-size-md");
				}else{
					$(".recommended-total-"+subjectId).html("");
					$("."+elementId).html("No teachers are available for this course");
					$("."+elementId).addClass("font-weight-semi-bold font-size-md");
				}
				
			}
		}
	});
}

function getDataForTeacherTimeAvailable(teacherUserId, subjectId){
	var recommendedTeacherRequest={};
	recommendedTeacherRequest['studentUserId'] = $("#studentUserId").val();
	recommendedTeacherRequest['teacherUserId'] = teacherUserId;
	recommendedTeacherRequest['subjectId'] = subjectId;
	recommendedTeacherRequest['userId'] = USER_ID;
	recommendedTeacherRequest['schoolId'] = SCHOOL_ID;
	var recomHrs=[];
	$('.selectedPreferenceSlot').each(function(index, sp) { 
		var rtime={};
		var sTime = $(this).find(".startTimeText").text();
		var eTime = $(this).find(".endTimeText").text();
		rtime['startTime']=sTime;
		rtime['endTime']=eTime;
		recomHrs.push(rtime);
	});
	recommendedTeacherRequest['selectTime']=recomHrs;
	return recommendedTeacherRequest;
}

function getTeacherTimeAvailable(teacherUserId, subjectId) {
	customLoader(false);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('teacherautoassign', 'teacher-available-time'),
		data : JSON.stringify(getDataForTeacherTimeAvailable(teacherUserId, subjectId)),
		//async:true,
		globle:false,
		success : function(data) {
			data = JSON.parse(data)
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				//$("."+elementId).html(recommendedTeacherBySubjectTr(data, subjectId));
				$(".available-"+teacherUserId).text(data.availability);
				$(".remaining-"+teacherUserId).text(data.remaining);
				$(".booked-"+teacherUserId).text(data.booked);

			}
		}
	});
}


function saveAutoAssignTeacherRequest(formId, subjectId,teacherUserId, elementrySubjectID, bulkSaveflag) {
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('teacherautoassign','save-auto-assign-teacher'),
		data : JSON.stringify(getRequestForAutoAssignTeacherRequest(formId, subjectId,teacherUserId,elementrySubjectID)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			customLoader(false);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',true);
				$(".bulkUpdateBtnWrapper .btn").addClass("disabled");
					if(bulkSaveflag){
						var onclickFun = [];
						$(".select-teacher").each(function() {
							// Get the current onclick attribute value
							var currentOnclick = $(this).find(".btn-primary").attr("onclick");
							
							// Append the "bulk" parameter
							var newOnclick = currentOnclick.replace(/\)$/, ", 'bulk')");
							
							// Push the modified onclick value into the array
							onclickFun.push(newOnclick);
						});
						assignTeacherBulk(onclickFun);
					} 
					
			}
			return false;
		},
		error : function(e) {
			console.log("ERROR : ", e);
		}
	});
}
function getRequestForAutoAssignTeacherRequest(formId, subjectId, teacherUserId, elementrySubjectID){
	var request = {};
	var authentication = {};
	var autoAssignTeacherList=[];
	var timePrefList = [];
	request['studentUserId']=$("#"+formId+" #studentUserId").val().trim();
	request['studentStandardId']=$("#"+formId+" #studentStandardId").val().trim();
	$('#timePreferenceSlotWrapper').each(function() { 
		$($(this).find('.selectedPreferenceSlot')).each(function() { 
			var pref={};
			var startTime = $(this).attr('startTime');
			var endTime = $(this).attr('endTime');
			if(startTime!=undefined){
				pref['startTime']=convertTo24Hour(startTime);
				pref['endTime']=convertTo24Hour(endTime);
				timePrefList.push(pref);
			}
		});
	});
	request['timePreferenceList'] = timePrefList;
	if(elementrySubjectID != undefined && elementrySubjectID != null && elementrySubjectID != ''){
		elementrySubjectID = elementrySubjectID.split(",");
		$.each(elementrySubjectID, function(i,v){
			var assignData = {};
			assignData = {'subjectId':v,"teacherUserId":teacherUserId}
			autoAssignTeacherList.push(assignData);
		});
		console.log(autoAssignTeacherList);
	}else{
		if(subjectId!=undefined && subjectId!=null && subjectId!=0 && subjectId!=''){
			var assignData = {};
			assignData['subjectId']=subjectId;
			assignData['teacherUserId']=teacherUserId;
			autoAssignTeacherList.push(assignData);
			
		}else{
			$('#recommendedTeachers > tbody  > tr').each(function() {
				var assignData = {}
				var subjectId = $(this).find(".subjectId").val().trim();//$(this).find(".sessionId").val().trim();
				var teacherUserId = $(this).find(".selectedTeacherUserId").val().trim();
				if(subjectId!=undefined && subjectId!=null && subjectId!=0 && subjectId!='' && teacherUserId!=undefined && teacherUserId!=null && teacherUserId!=0 && teacherUserId!=''){
					assignData['subjectId']=subjectId;
					assignData['teacherUserId']=teacherUserId;
					autoAssignTeacherList.push(assignData);
				}
			});
		}
		
	}
	request['autoAssignTeacher'] = autoAssignTeacherList;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = "STUDENT";
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	return request;
}
function sendMailFromAutoTeacherAssign(subjectId) {
	hideMessage('');
	var data = {};
	data["userId"] = USER_ID;
	data["studentStandardId"] = $('#studentStandardId').val();
	data["subjectId"] = subjectId;
	$.ajax({
	  type: "GET",
	  contentType: "application/json",
	  url: getURLForHTML('teacherautoassign', "send-mail-from-auto-assign-teacher?payload="+encode(JSON.stringify(data))),
	  dataType: "json",
	  cache: false,
	  timeout: 600000,
	  success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				showMessageTheme2(1, data['message'],'',true);
			}
		},
		error: function (e) {
			//showMessage(true, e.responseText);
		}
	});
}

function callTeacherAvailability(formId, teacherUserId, elementId, sreno) {
	if(teacherUserId!=''){
		customLoader(false);
	}
	
		var request = $.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('report', 'get-teacher-availability-content'),
			data : JSON.stringify(getRequestForTeacherAvailability(formId, teacherUserId)),
			dataType : 'json',
			//global : false,
			async:true,
			success : function(data) {
				console.log(data);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessageTheme2(false, data['message']);
					$(".teacher-time-body").html('');
					var htmlss='';
					htmlss+='<tr class="td-border-design">';
					htmlss+='<td class="bold" style="border-width:1px;border-color:#eee; text-align:center;" colspan="10">No Record Found</td>'
					htmlss+='</tr>';
					$(".teacher-time-body").html(htmlss);
				} else {
						getTimeCalculateHtml(data.teacherList, data.USER_ID, elementId, sreno);
						// var totalTeacher=parseInt($("#totalTeacher").attr('data-total-teacher'));
						// var totaltr= $('#teacher-available-timelist tbody tr').length;
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
		requestajax.push(request);
	
}


function updateSerialNumber(index){
	for(var i = 0; i<=index[0].length;i++){
		$("#teacher-available-timelist tbody tr:nth-child("+i+") td:first-child").text(i)
	}
	serialNumberUpdateFlag=true;
	trObj=[];
}

function getTimeAvailableTeacherHtml(teacherList, userId){
	var htmlTime='';
	if(teacherList.length>0){
		var sreno=1;
		for (let s = 0; s < teacherList.length; s++) {
			const teachlist = teacherList[s];
			//onclick="$(`#availiblityModal`).modal(`show`);"
			const formatDate = (date) => date.toISOString().split('T')[0];
			var cdateFrom=new Date();
			var startDate=formatDate(cdateFrom);
			var endDate=formatDate(cdateFrom);
			if($("#timeAvailableDateFrom").val()!='' && $("#timeAvailableDateTo").val()!=''){
				var strDate = $("#timeAvailableDateFrom").val();
				var enDate = $("#timeAvailableDateTo").val();
				const currentDate = new Date(strDate);
				const currentStDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
				currentStDate.setDate(currentStDate.getDate() + 1);
				var currentEnDate = new Date(enDate);
				currentEnDate = new Date(currentEnDate.getFullYear(), currentEnDate.getMonth() + 1, 0);
				currentEnDate.setDate(currentEnDate.getDate() + 1);
				
				startDate=formatDate(currentStDate);
				endDate=formatDate(currentEnDate);
			}

			var gradehtml = divClassGradePopup("Grade's", 'grade', teachlist.teacherId);
			var coursehtml = divClassGradePopup("Course", 'course', teachlist.teacherId);

			// getAssignStudentOfTeacher('Grade', 'STANDARD', 'grade', teachlist.teacherId,teachlist.totalAgreedHours);
			// getAssignStudentOfTeacher('Course', 'SUBJECT', 'course', teachlist.teacherId, teachlist.totalAgreedHours);


			var totalAgreeHrs = parseInt(teachlist.avgAgree.replaceAll(':',''));
			var liveAvailiblityHrs = parseInt(teachlist.liveAvailiblity.replaceAll(':',''));
			var totalOccuHrs = parseInt(teachlist.occupied.replaceAll(':',''));
			var totalUnoccupiedHrs = parseInt(teachlist.unoccupied.replaceAll(':',''));
			
			var urlSend = "getAsPost('/report/teacher-class-report?moduleId=150&euid="+teachlist.tencryptedUserId+"&profileStatus=A&startDateFilter="+startDate+"&endDateFilter="+endDate+"')";
			var funClick="getTeacherAllTime('"+teachlist.teacherId+"','"+teachlist.teachUserId+"','TEACHER','availiblityModal','open-class')";
			var funSaveTeacherTime="getTeacherAllTime('"+teachlist.teacherId+"','"+teachlist.teachUserId+"','TEACHER','availiblityModal','class-time-save')";
			// onclick="'+funClick+'"

				htmlTime+='<tr class="td-border-design" id="teacher_'+teachlist.teachUserId+'">';
				htmlTime+='<td class="rounded-bottom-left-10 " style="border-width:1px;border-color:#eee">'+sreno+'.</td>'
					+ '<td data-order="'+teachlist.teachName+'" class="" style="border-width:1px;border-color:#eee">'
						+ '<div id="teacherName_'+teachlist.teachUserId+'"><b>'+teachlist.teachName+'</b></div>'
						+ '<br/>' + gradehtml + ' |  ' + coursehtml
						+ '<div>'+teachlist.countryName+' | '+teachlist.teachTimeZone+' | '+teachlist.offSet+' </div>'
					+ '</td>'
					+ '<td data-order="'+teachlist.agreedHrs.replaceAll(':','')+'" class="" style="border-width:1px;border-color:#eee">'
					+'<span class="d-inline-block text-white font-weight-bold mr-1 mb-1 text-center">'		
					+ '<a href="javascript:void(0)" class="btn btn-sm btn-primary font-weight-semi-bold '+teachlist.teachUserId+'_total_agreedhrs" style="min-width:50px" onclick="'+funClick+'" >'+teachlist.totalAgreedHours+'='+teachlist.agreedHrs+'+'+teachlist.adminTaskHours+'</a>';
						if(userId==1){
							htmlTime+='<a href="javascript:void(0)" class="btn btn-sm font-weight-semi-bold" style="min-width:50px" onclick="'+funSaveTeacherTime+'"><i class="fas fa-sync text-success"></i></a>';
						}
					htmlTime+='</span>';		
					//htmlTime+='<br/><span class="d-inline-block bg-alternate text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;" id="ass_student_' + teachlist.teacherId + '">0</span>';
					htmlTime+='<br/><span class="d-inline-block bg-info text-white p-1 font-weight-bold mr-1 mb-1 text-center" id="total_student_' + teachlist.teacherId + '">0</span>= ';
					htmlTime+='<span class="d-inline-block bg-dark text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;" id="pl_student_' + teachlist.teacherId + '">0</span>+ ';
					htmlTime+='<span class="d-inline-block text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px; background-color: #ff059d;" id="gl_student_' + teachlist.teacherId + '">0</span>';
					htmlTime+='</td>';
					
							
					var htmlLoader='<div class="loader-wrapper d-flex justify-content-center align-items-center"> <div class="loader">';
						htmlLoader+='<div class="line-scale"><div></div><div></div><div></div><div></div><div></div></div></div> </div>';
	
					if(teachlist.liveAvailiblity=='00:00:00' && teachlist.adminAvailiblity=='00:00:00'){
						htmlTime+='<td data-order="'+teachlist.liveAvailiblity.replaceAll(':','')+'" class="'+teachlist.teachUserId+'_total_availability" style="border-width:1px;border-color:#eee;text-align:center">'+htmlLoader+'</td>';
					}else{
						htmlTime+='<td data-order="'+parseInt(teachlist.liveAvailiblity.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_availability " style="border-width:1px;border-color:#eee;text-align:center"><span class="'+((totalAgreeHrs>liveAvailiblityHrs)?'text-danger':'')+'">'+teachlist.liveAvailiblity+'</span>' 
						// +'| '+teachlist.adminAvailiblity+
						+'</td>';
					}

					
					htmlTime+='<td data-order="'+parseInt(teachlist.occupied.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_occupied" style="border-width:1px;border-color:#eee;text-align:center"><span class="'+(totalUnoccupiedHrs>0?'text-success':'')+'">'+(teachlist.occupied=='00:00:00'?''+htmlLoader+'':teachlist.occupied)+'</span></td>'
					+ '<td data-order="'+parseInt(teachlist.unoccupied.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_unoccupied" style="border-width:1px;border-color:#eee;text-align:center"><span style="padding:2px;" class="'+(totalUnoccupiedHrs>0?'bg-success text-white':'')+'">'+(teachlist.unoccupied=='00:00:00'?''+htmlLoader+'':teachlist.unoccupied)+'</span></td>'
					+ '<td data-order="'+parseInt(teachlist.teacherRemaining.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_remaining " style="border-width:1px;border-color:#eee;text-align:center"><span style="padding:2px;" class="'+((totalAgreeHrs>liveAvailiblityHrs)?'bg-danger text-white':'')+'">'+(teachlist.teacherRemaining=='00:00:00'?''+htmlLoader+'':teachlist.teacherRemaining)+'</span></td>'//'+teachlist.remaining+' | '+teachlist.teacherRemaining+'
					+ '<td data-order="'+parseInt(teachlist.totalSubmitted.replaceAll(':',''))+'" class="" style="border-width:1px;border-color:#eee;text-align:center">';
					htmlTime+='<a href="javascript:void(0)" class="btn btn-sm font-weight-semi-bold '+teachlist.teachUserId+'_total_submitted" style="min-width:50px" onclick="'+urlSend+'">'+(teachlist.submitted=='00:00:00'?'-':teachlist.submitted)+' | '+(teachlist.totalSubmitted=='00:00:00'?'-':teachlist.totalSubmitted)+'</a></td>';
					// + '<td class="" style="border-width:1px;border-color:#eee;text-align:center">'+(teachlist.deducted=='00:00:00'?'-':teachlist.deducted)+'</td>'
					// + '<td class="rounded-bottom-right-10 " style="border-width:1px;border-color:#eee;text-align:center">'+(teachlist.accepted=='00:00:00'?'-':teachlist.accepted)+'</td>'
				
				htmlTime+='</tr>';
				callTeacherAvailability('teacherFilterTime',''+teachlist.teachUserId+'','teacher_'+teachlist.teachUserId+'',''+sreno+'');
				sreno=sreno+1;
		}
	}else{
		htmlTime+='<tr class="td-border-design">';
		htmlTime+='<td class="bold" style="border-width:1px;border-color:#eee; text-align:center;" colspan="10">No Record Found</td>'
		htmlTime+='</tr>';
	}

	return htmlTime;
}


function getTimeCalculateHtml(teacherList, userId, elementId, sreno){
	if(teacherList.length>0){
		var totalAvail=parseInt($("#availableHrs").attr('data-available-second'));
		var totalOccup=parseInt($("#occupiedHrs").attr('data-occupied-second'));
		var totalUnoccup=parseInt($("#unoccupiedHrs").attr('data-unoccupied-second'));
		var totalRemain=parseInt($("#remaining").attr('data-remaining-second'));
		var totalTeacher=parseInt($("#totalTeacher").attr('data-total-teacher'));
		

		for (let s = 0; s < teacherList.length; s++) {
			var htmlTime='';
			const teachlist = teacherList[s];
			//onclick="$(`#availiblityModal`).modal(`show`);"
			const formatDate = (date) => date.toISOString().split('T')[0];
			var cdateFrom=new Date();
			var startDate=formatDate(cdateFrom);
			var endDate=formatDate(cdateFrom);
			if($("#timeAvailableDateFrom").val()!='' && $("#timeAvailableDateTo").val()!=''){
				var strDate = $("#timeAvailableDateFrom").val();
				var enDate = $("#timeAvailableDateTo").val();
				const currentDate = new Date(strDate);
				const currentStDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
				currentStDate.setDate(currentStDate.getDate() + 1);
				var currentEnDate = new Date(enDate);
				currentEnDate = new Date(currentEnDate.getFullYear(), currentEnDate.getMonth() + 1, 0);
				currentEnDate.setDate(currentEnDate.getDate() + 1);
				
				startDate=formatDate(currentStDate);
				endDate=formatDate(currentEnDate);
			}
			var totalAgreeHrs = parseInt(teachlist.avgAgree.replaceAll(':',''));
			var liveAvailiblityHrs = parseInt(teachlist.liveAvailiblity.replaceAll(':',''));
			var totalOccuHrs = parseInt(teachlist.occupied.replaceAll(':',''));
			var totalUnoccupiedHrs = parseInt(teachlist.unoccupied.replaceAll(':',''));

			var gradehtml = divClassGradePopup("Grade's", 'grade', teachlist.teacherId);
			var coursehtml = divClassGradePopup("Course", 'course', teachlist.teacherId);
			var twseconds=parseInt(teachlist.totalAgreedHours) * 3600;
			var req = getAssignStudentOfTeacher('Grade', 'STANDARD', 'grade', teachlist.teacherId,twseconds);
			requestajax.push(req);
			var req = getAssignStudentOfTeacher('Course', 'SUBJECT', 'course', teachlist.teacherId, twseconds);
			requestajax.push(req);
			
			var urlSend = "getAsPost('/report/teacher-class-report?moduleId=150&euid="+teachlist.tencryptedUserId+"&profileStatus=A&startDateFilter="+startDate+"&endDateFilter="+endDate+"')";
			var funClick="getTeacherAllTime('"+teachlist.teacherId+"','"+teachlist.teachUserId+"','TEACHER','availiblityModal','open-class')";
			var funSaveTeacherTime="getTeacherAllTime('"+teachlist.teacherId+"','"+teachlist.teachUserId+"','TEACHER','availiblityModal','class-time-save')";
			// onclick="'+funClick+'"
				htmlTime+='<td class="rounded-bottom-left-10 " style="border-width:1px;border-color:#eee">'+sreno+'.</td>'
					+ '<td data-order="'+teachlist.teachName+'" class="" style="border-width:1px;border-color:#eee">'
						+ '<span id="teacherName_'+teachlist.teachUserId+'"><b>'+teachlist.teachName+'</b></span>'
						+ '<br/>' + gradehtml + ' |  ' + coursehtml
						+ '<div>'+teachlist.countryName+' | '+teachlist.teachTimeZone+' | '+teachlist.offSet+' </div>'
					+ '</td>'
					+ '<td data-order="'+teachlist.agreedHrs.replaceAll(':','')+'" class="" style="border-width:1px;border-color:#eee">'
					+ '<span class="d-inline-block text-white font-weight-bold mr-1 mb-1 text-center">'			
					+ '<a href="javascript:void(0)" class="btn btn-sm btn-primary font-weight-semi-bold '+teachlist.teachUserId+'_total_agreedhrs" style="min-width:50px" onclick="'+funClick+'" >'+teachlist.totalAgreedHours+'='+teachlist.agreedHrs+'+'+teachlist.adminTaskHours+'</a>';
							if(userId==1){
								htmlTime+='<a href="javascript:void(0)" class="btn btn-sm font-weight-semi-bold" style="min-width:50px" onclick="'+funSaveTeacherTime+'"><i class="fas fa-sync text-success"></i></a>';
							}
					htmlTime+='</span>';		
					//htmlTime+='<br/><span class="d-inline-block bg-alternate text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;" id="ass_student_' + teachlist.teacherId + '">0</span>';
					htmlTime+='<br/><span class="d-inline-block bg-info text-white p-1 font-weight-bold mr-1 mb-1 text-center" id="total_student_' + teachlist.teacherId + '">0</span>= ';
					htmlTime+='<span class="d-inline-block bg-dark text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px;" id="pl_student_' + teachlist.teacherId + '">0</span>+ ';
					htmlTime+='<span class="d-inline-block text-white p-1 font-weight-bold mr-1 mb-1 text-center" style="min-width:30px; background-color: #ff059d;" id="gl_student_' + teachlist.teacherId + '">0</span>';
					htmlTime+='</td>';
					
					if(teachlist.liveAvailiblity=='00:00:00' && teachlist.adminAvailiblity=='00:00:00'){
						htmlTime+='<td data-order="'+teachlist.liveAvailiblity.replaceAll(':','')+'" class="'+teachlist.teachUserId+'_total_availability" style="border-width:1px;border-color:#eee;text-align:center">-</td>';
					}else{
						htmlTime+='<td data-order="'+teachlist.liveAvailiblity.replaceAll(':','')+'" class="'+teachlist.teachUserId+'_total_availability " style="border-width:1px;border-color:#eee;text-align:center"><span class="'+((totalAgreeHrs>liveAvailiblityHrs)?'text-danger':'')+'">'+teachlist.liveAvailiblity+'</span></td>';
					}

					htmlTime+='<td data-order="'+parseInt(teachlist.occupied.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_occupied" style="border-width:1px;border-color:#eee;text-align:center"><span class="'+(totalUnoccupiedHrs>0?'text-success':'')+'">'+(teachlist.occupied=='00:00:00'?'-':teachlist.occupied)+'</span></td>'
					+ '<td data-order="'+parseInt(teachlist.unoccupied.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_unoccupied" style="border-width:1px;border-color:#eee;text-align:center"><span style="padding:2px;" class="'+(totalUnoccupiedHrs>0?'bg-success text-white':'')+'">'+(teachlist.unoccupied=='00:00:00'?'-':teachlist.unoccupied)+'</span></td>'
					+ '<td data-order="'+parseInt(teachlist.teacherRemaining.replaceAll(':',''))+'" class="'+teachlist.teachUserId+'_total_remaining " style="border-width:1px;border-color:#eee;text-align:center"><span style="padding:2px;" class="'+((totalAgreeHrs>liveAvailiblityHrs)?'bg-danger text-white':'')+'">'+teachlist.teacherRemaining+'</span></td>'//'+teachlist.remaining+' | 
					+ '<td data-order="'+parseInt(teachlist.totalSubmitted.replaceAll(':',''))+'" class="" style="border-width:1px;border-color:#eee;text-align:center">';
					htmlTime+='<a href="javascript:void(0)" class="btn btn-sm font-weight-semi-bold '+teachlist.teachUserId+'_total_submitted" style="min-width:50px" onclick="'+urlSend+'">'+(teachlist.submitted=='00:00:00'?'-':teachlist.submitted)+' | '+(teachlist.totalSubmitted=='00:00:00'?'-':teachlist.totalSubmitted)+'</a></td>';
				

				totalAvail=totalAvail+teachlist.liveTime;
				totalOccup=totalOccup+teachlist.ocupTime;
				totalUnoccup=totalUnoccup+teachlist.unocupTime;
				totalRemain=totalRemain+teachlist.finalRemainClass;
				totalTeacher=totalTeacher+1;
				
					
		}
		$("#"+elementId).html(htmlTime);

		$("#availableHrs").attr('data-available-second',totalAvail);
		$("#occupiedHrs").attr('data-occupied-second',totalOccup);
		$("#unoccupiedHrs").attr('data-unoccupied-second',totalUnoccup);
		$("#remaining").attr('data-remaining-second',totalRemain);
		$("#totalTeacher").attr('data-total-teacher',totalTeacher)

		$("#availableHrs").text(getTimeFormatByMiliSecond(totalAvail*1000));
		$("#occupiedHrs").text(getTimeFormatByMiliSecond(totalOccup*1000));
		$("#unoccupiedHrs").text(getTimeFormatByMiliSecond(totalUnoccup*1000));
		$("#remaining").text(getTimeFormatByMiliSecond(totalRemain*1000));
		$("#totalTeacher").text(totalTeacher);
		var targerval=parseInt($("#totalTeacherLive").text());
		var matchVal=getProgressValue(totalTeacher, targerval);
		$("#teacherCountProgress").attr('aria-valuenow',matchVal);
		$('#teacherCountProgress').css('width', matchVal + '%');
		$("#teacherCountProgress").text(matchVal + '%');
		$("#teacherCountProgress").removeClass("d-none");
		// $("#teacher-available-timelist").DataTable().destroy();
		if(matchVal!= 100) {
			$("#teacher-available-timelist").DataTable().destroy();
		}
		if(matchVal==100){
			$("#teacherCountProgress").addClass("d-none");
			datatableinc=datatableinc+1;
			if(datatableinc==1){
				setTimeout(() => {
					if(!isDataTable){
						$("#teacher-available-timelist").DataTable({
							pageLength: 150,
							// columnDefs: [
							// 	{
							// 		targets: 0,
							// 		orderable: false
							// 	}
							// ],
							drawCallback: function (settings) {
								var api = this.api();
								api.rows({ order: 'index', page: 'current' }).every(function (rowIdx, tableLoop, rowLoop) {
									var row = this.node();
									$('td:first', row).html(this.index() + 1);
								});

								if (serialNumberUpdateFlag) {
									trObj.push(settings.aiDisplay);
									serialNumberUpdateFlag = false;
									updateSerialNumber(trObj);
								}
							}
						});
						isDataTable=false;
					}
				}, 1000);
				
					
					// $("#teacher-available-timelist").DataTable({
					// 	"pageLength": 150,
					// 	"scrollX": true,
					// 	// "drawCallback": function(settings) {
					// 	// 	var api = this.api();
					// 	// 	api.rows({ page: 'current' }).every(function(rowIdx, tableLoop, rowLoop) {
					// 	// 		if (serialNumberUpdateFlag) {
					// 	// 			trObj.push(settings.aiDisplay);
					// 	// 			serialNumberUpdateFlag = false;
					// 	// 			updateSerialNumber(trObj);
					// 	// 		}
					// 	// 		this.invalidate();
					// 	// 	});
					// 	// }
					// });
					
			}
		}

		// $('.totalOccupied').html(getTimeWithFormat(spentSeconds*1000));
	}
}

function getRequestForAssignStdOfTeacher(title, reporttype, teacherId, workingHrs) {
	var teacherAssignRequest = {};
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['reportType'] = reporttype;
	teacherAssignRequest['teacherId'] = teacherId;
	teacherAssignRequest['workinghr'] = workingHrs;
	teacherAssignRequest['callFrom'] = '';
	return teacherAssignRequest;
}

function getAssignStudentOfTeacher(title, reporttype, spanid, teacherId, workingHrs) {
	customLoader(false);
	$('#stdAssignToTimeAvailList').DataTable().destroy();
	var request = $.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'teacher-assign-student-content'),
		data: JSON.stringify(getRequestForAssignStdOfTeacher(title, reporttype, teacherId, workingHrs)),
		dataType: 'json',
		//global : false,
		async: true,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme2') {
						//showMessageTheme2(2, data['message'],'',true);
					} else if (tt == 'theme1') {
						//showMessage(true, data['message']);
					}
				}
			} else {
				if (reporttype != '') {
					var logList = getStuddentCountTr(data.gradeList, reporttype, spanid, teacherId, data.changeSlotDate);
					$('#' + spanid + '_' + teacherId).html('');
					$('#' + spanid + '_' + teacherId).html(logList);
				} else {
					var stlist = getStudentListBody(data.teacherAssign);
					// var isDataTable1 = $.fn.DataTable.isDataTable('#studentListAvailablePopup #stdAssignToTimeAvailList');
					// if(isDataTable1){
					// 	$('#studentListAvailablePopup #stdAssignToTimeAvailList').dataTable().fnDestroy();
					// }
					$('#studentListAvailablePopup #' + spanid).html('');
					$('#studentListAvailablePopup #' + spanid).html(stlist);
					// $('#stdAssignToTimeAvailList').DataTable();
					var teachname = $("#teacher-time-body #teacherName_" + data.teacherUserId).text();
					$("#studentListAvailablePopup #teacherAssignName").text(teachname);
					$("#studentListAvailablePopup").modal('show');
				}
			}
			$('#stdAssignToTimeAvailList').DataTable();
		},
		error: function (e) {
			console.log(e);
		}
	});
	return request;
}

function getStuddentCountTr(studentCount, reporttype, spanid, teacherid, changeSlotDate) {
	var htmlst = '';
	var assStudent = 0;
	var totStudent = 0;
	var totPlStudent = 0;
	var totGlStudent = 0;
	if (studentCount.length > 0) {
		$(".gctotal_" + spanid + "_" + teacherid).html(" (" + studentCount.length + ")")
		for (md = 0; md < studentCount.length; md++) {
			htmlst += '<tr>';
			htmlst += '<td>' + studentCount[md]['gradeName'] + '</td>';
			htmlst += '<td>' + studentCount[md]['studentCount'] + '</td>';
			htmlst += '<td>' + studentCount[md]['studentInActiveCount'] + '</td>';
			htmlst += '</tr>';
			if (reporttype == "STANDARD") {
				if (parseInt(studentCount[md]['assinedTotalStudent']) > 0) {
					assStudent = parseInt(studentCount[md]['assinedTotalStudent']);
				}
				totStudent = totStudent + parseInt(studentCount[md]['studentCount']);
				totPlStudent = totPlStudent + parseInt(studentCount[md]['studentPlActiveCount']);
				totGlStudent = totGlStudent + parseInt(studentCount[md]['studentGlActiveCount']);
			}

		}
	}
	if (reporttype == "STANDARD") {
		$("#ass_student_" + teacherid).text(assStudent);
		var studentClick = "getAssignStudentOfTeacher('','','studentTeachAssignList','" + teacherid + "', '');";
		var studentTot = '<a style="min-width:30px;" class="text-center text-white font-weight-bold" href="javascript:void(0)" onclick="' + studentClick + '">' + totStudent + '</a>';
		$("#total_student_" + teacherid).html(studentTot);
		$("#pl_student_" + teacherid).html(totPlStudent);
		$("#gl_student_" + teacherid).html(totGlStudent);
	}

	return htmlst;
}

function getStudentListBody(studentList) {
	var htmlst = '';
	var a = 1;
	if (studentList.length > 0) {
		for (md = 0; md < studentList.length; md++) {
			htmlst += '<tr>';
			htmlst += '<td>' + (a) + '</td>';
			htmlst += '<td>' + studentList[md]['studentName'] + '</td>';
			htmlst += '<td>' + studentList[md]['gradeName'] + '</td>';
			htmlst += '<td>' + studentList[md]['registerType'] + '</td>';
			htmlst += '</tr>';
			a = a + 1;
		}
	}
	return htmlst;
}

function divClassGradePopup(title, spanid, teacherid) {
	var drpclass = "dropdown-menu-md";
	if (spanid == 'course') {
		drpclass = "dropdown-menu-xl"
	}
	var gradehtml = '';
	gradehtml += '<div class="btn-group dropdown" style="vertical-align: top !important;font-size:11px">'
	gradehtml += '<a href="#" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="mb-2 mr-2 dropdown-toggle">' + title + '<span class="gctotal_' + spanid + '_' + teacherid + '"></span></a>';
	gradehtml += '<div tabindex="-1" role="menu" aria-hidden="true" class="' + drpclass + ' dropdown-menu" style="font-size:11px !important;">';
	//gradehtml+='<div class="dropdown-menu-header">';
	//gradehtml+='<div class="dropdown-menu-header-inner bg-primary">';
	gradehtml += '<div class="menu-header-content"><h5 class="menu-header-title text-center ">' + title + '<span class="gctotal_' + spanid + '_' + teacherid + '"></span></h5></div>';
	//gradehtml+='</div>';
	//gradehtml+='</div>';
	gradehtml += '<div class="grid-menu grid-menu-3col">';
	gradehtml += '<div class="no-gutters row">';
	gradehtml += '<div class="col-sm-12 col-xl-12 pt-0" style="max-height: 200px;overflow-y: auto;">';
	gradehtml += '<table class="row-height-small" style="width:100%;">';
	gradehtml += '<tr><thead class="table-head-sticky">';
	gradehtml += '<th>' + title + '</th><th>Total</th><th style="width:60px">In-Active</th>';
	gradehtml += '</thead></tr>';
	gradehtml += '<tbody id="' + spanid + '_' + teacherid + '">';
	gradehtml += '</tbody>';
	gradehtml += '</table>';
	gradehtml += '</div></div></div></div></div>';
	return gradehtml;
}

function getTeacherAllTime(teacherid, teacherUserId, userRole, modalID,callType){
	$(".teacherNameClass").html('--');
	$(".agreedHourLabel").html('--');
	$(".timezoneWithOffset").html('--');
	callTeacherRemainingTime('admin-panel', teacherid, teacherUserId, userRole, modalID, callType, "N");
	if(callType=='class-time-save'){
	}else{
		$("#"+modalID).modal("show");
	}
}



function getRequestForTeacherRemainingTime(callfrom, teacherUserId, userRole, callType, autoForwordStatus) {
	var teacherAssignRequest = {};
	teacherAssignRequest['userId'] = teacherUserId;
	teacherAssignRequest['userRole'] = userRole;
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['callFrom'] = callfrom;
	teacherAssignRequest['callType'] = callType;
	teacherAssignRequest['autoForwordStatus'] = autoForwordStatus;
	teacherAssignRequest['dataType']=$("#teacherFilterTime #timeAvailableSearchtype").val();
	if($("#timeAvailableSearchtype").val()=='CUSTOM'){
		if($("#timeAvailableDateFrom").val()!=undefined && $("#timeAvailableDateFrom").val()!=''){
			var starttime=$("#teacherFilterTime #timeAvailableDateFrom").val()+" "+$("#teacherFilterTime #startTime").val();
			var endTime=$("#teacherFilterTime #timeAvailableDateTo").val()+" "+$("#teacherFilterTime #endTime").val();
			teacherAssignRequest['startDateFilter'] = starttime;
			teacherAssignRequest['endDateFilter'] = endTime;
		}
	}

	console.log(teacherAssignRequest);
	return teacherAssignRequest;
}

function getRequestForTeacherTimeToShowWeeklyCalendar(teacherUserId, userRole, callType,studentStandardId,stDate) {
	var teacherAssignRequest = {};
	teacherAssignRequest['userId'] = teacherUserId;
	teacherAssignRequest['userRole'] = userRole;
	teacherAssignRequest['schoolId'] = SCHOOL_ID;
	teacherAssignRequest['callType'] = callType;
	teacherAssignRequest['startDate'] = stDate;
	teacherAssignRequest['dataType']="CUSTOM"
	teacherAssignRequest['studentStandardId'] = studentStandardId;
	console.log(teacherAssignRequest);
	return teacherAssignRequest;
}

function getTeacherTimeToShowWeeklyCalendar(teacherUserId,userRole,callType,studentStandardId,stDate) {
	var responseData=null;
	customLoader(true);
	return new Promise (function(resolve, reject) {$.ajax({
			type: "POST",
			contentType: "application/json",
			url: getURLForHTML('teacherautoassign', 'get-teacher-time-to-show-weekly-calendar'),
			data: JSON.stringify(getRequestForTeacherTimeToShowWeeklyCalendar(teacherUserId,userRole,callType,studentStandardId,stDate)),
			dataType: 'json',
			cache: false,
			timeout: 600000,
			async: true,
			success: function(data) {
				customLoader(false);
				console.log(data);
				resolve(data);
			  },
			error: function(xhr, status, error) {
				console.error('Error: ' + error);
				reject(error);
			}
		});
	})
	
}

function callTeacherRemainingTime(callfrom, teacherId, teacherUserId, userRole, modalID, callType, autoForwordStatus) {
	console.log(userRole);
	customLoader(true);
	$(".timeOccupiedCurrent").html('');
	$(".timeOccupiedNext").html('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-teacher-time-preference-datewise'),
		data: JSON.stringify(getRequestForTeacherRemainingTime(callfrom, teacherUserId, userRole, callType, autoForwordStatus)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					
				}
			} else {
				if(callType=='class-time-save'){

				}else{
					$(".timeOccupiedCurrent").html('')	;
					$(".teacherNameClass").html(data.teacherName+' | '+data.countryName);
					var thours=$("."+teacherUserId+"_total_agreedhrs").text();
					$(".agreedHourLabel").html('|  Contract Hours <label class="d-inline-block p-1 bg-white text-primary rounded teacherAgreeHours" style="line-height:15px">'+thours+'</label>');
					$(".timezoneWithOffset").html(data.timeZoneName+' | '+data.offset);
					var curtime = getTeacherCurrentAvailability(data.teacherWeeklyTimeCurrLiveClass);
					$(".timeOccupiedCurrent").html(curtime)	;
					var nexttime='';
					$(".timeOccupiedNext").html('')	;
					if(data.teacherWeeklyTimeNextLiveClass!=null){
						nexttime = getTeacherNextAvailablity(data.teacherWeeklyTimeNextLiveClass);
						$(".timeOccupiedNext").html(nexttime)	;
					}
					$('.expandable-row').click(function() {
						console.log('expandable-row');	
						$(this).toggleClass("bg-primary");
						$(this).parent().find('.expandable-details').toggle();
						$(this).parent().find(".squeezed-details").toggle();
						// if($(".availability-total-hour-th").css("display") == "table-cell"){
						// 	$(".availability-total-hour-th").hide();
						// }else{
						// 	$(".availability-total-hour-th").css("display","table-cell");
						// }
						// $(this).parent().find(".availability-total-hour-td").toggle();
						$(this).parent().siblings().find('.expandable-details').hide();
						$(this).parent().siblings().find(".squeezed-details").show();
						$(this).parent().siblings().find(".expandable-row").addClass("bg-primary");
				   });
				   $(".view-all-time-slots").click(function(){
						$(this).parent().find(".hide-time-slot").show();
					});

					// if(!slickSiderRender){
					// 	$(".slick-slider-time-availiblity").not('.slick-initialized').slick({
					// 		dots: false,
					// 		draggable: false,
					// 		autoplay:false,
					// 		arrows:true,
					// 		infinite: false,
					// 		slidesToShow: 1,
					// 		slidesToScroll: 1,
					// 		//adaptiveHeight:true,
					// 		pauseOnHover:true
					// 	});
						
					// 	//$(".slick-initialized").append("<div class='slider-navigation'></div>");
					// 	$(".slick-prev").appendTo(".slider-navigation");
					// 	$("<div class='stutas-nav d-inline-block mx-2'><b>Current Availability</b></div>").appendTo(".slider-navigation");
					// 	$(".slick-next").appendTo(".slider-navigation");
					// 	$(".slick-next").click(function(){
					// 			$(".slider-navigation .stutas-nav b").text("Next Availability");
					// 	});
					// 	$(".slider-navigation .slick-prev").click(function(){
					// 			$(".slider-navigation .stutas-nav b").text("Current Availability");
					// 	});
					// 	slickSiderRender =true;
					// }
				}
				
			}
			
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
		}
	});
}



function callTimeBookingTeacher(callfrom, bookingId, bookType, startDate, iddate) {
	customLoader(true);
	data={};
	data['bookingId']=bookingId;
	data['bookType']=bookType;
	data['startDate']=startDate;
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('report', 'get-booking-time'),
		data: JSON.stringify(data),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		async: true,
		success: function (data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					
				}
			} else {
				//var html = bindTeacherBookedClass(data);
				//$(".tblTimeBookList").html(html);
				if(data.studentName!=''){
					$(".hideClassWith"+iddate+"_"+bookingId).show();
					$(".withClass"+iddate+"_"+bookingId).text(data.studentName);
				}else{
					$(".hideClassWith"+iddate+"_"+bookingId).hide();
				}
				$(".courseName"+iddate+"_"+bookingId).text(data.subjectName);
				if(data.meetingType=="Activity"){
					$(".textCoursename"+iddate+"_"+bookingId).text("Activity title:");
				}else{
					$(".textCoursename"+iddate+"_"+bookingId).text("Course Name:");
					
				}
				 

				$(".classType"+iddate+"_"+bookingId).text(data.meetingType);
				$(".classStudentTime"+iddate+"_"+bookingId).text(data.studentDateTime);
				$(".classAdminTime"+iddate+"_"+bookingId).text(data.adminDatetime);
				
				if(data.bufferTime!=''){
					$(".hideStudentTime"+iddate+"_"+bookingId).show();
					$(".hideClassBuffer"+iddate+"_"+bookingId).show();
					$(".bufferTime"+iddate+"_"+bookingId).text(data.bufferTime);
				}else{
					$(".hideStudentTime"+iddate+"_"+bookingId).hide();
					$(".hideClassBuffer"+iddate+"_"+bookingId).hide();
				}
				
			}
			
			customLoader(false);
		},
		error: function (e) {
			if (tt == 'theme2') {
				showMessageTheme2(2, TECHNICAL_GLITCH, '', true);
			} 
		}
	});
}

function getTeacherTimeBooked(bookingId, bookType, startDate, iddate){
	callTimeBookingTeacher('', bookingId, bookType, startDate, iddate)
	//$('#teacherOccupiedClass').modal('show');
}

function bindTeacherBookedClass(data){
	var html='';
	html+='<tr>'
	+'<td>1</td>'
	+'<td>'+data.studentName+'</td>'
	+'<td>'+data.subjectName+'</td>'
	+'<td><b>Teacher Time:</b> '+data.teacherDatetime+'<br/><b>Student Time:</b> '+data.studentDateTime+'<br/><b>Admin Time:</b> '+data.adminDatetime+'</td>'
  +'</tr>';
  return html;
}


$(document).ready(function(){
	$("#availiblityModal").on('show.bs.dropdown', function () {
		$('.overflow-div').removeClass("overflow-auto");
		$('.overflow-div').addClass("overflow-inherit");
	});
	
	$("#availiblityModal").on('hide.bs.dropdown', function () {
		$('.overflow-div').addClass("overflow-auto");
		$('.overflow-div').removeClass("overflow-inherit");
	})
});


function getProgressValue(inputValue, targetValue){
        var matchPercentage = 0;
        // Calculate match percentage
        if (inputValue === targetValue) {
            matchPercentage = 100;
        } else {
            // Calculate match percentage based on similarity (for example, based on string length match)
            var minLength = Math.min(inputValue, targetValue);
            var matchCount = 0;
            // Compare character by character
            for (var i = 0; i < minLength; i++) {
                //if (inputValue == targetValue) {
                    matchCount++;
               // }
            }
            
            // Calculate percentage based on character match
            matchPercentage = (matchCount / targetValue) * 100;
        }
		var roundedUpMatch = Math.ceil(matchPercentage);
		return roundedUpMatch;
}

function getRecommendedTeacherListModal(){
	$('#recommendedTeacherlistModal').modal('show');
	$('#recommendedTeacherlistModal').on('hidden.bs.modal', function () {
		recommendedTeachersResetForm()
	});
	
}

function initializeTypeahead(formId, eleId){
	$('#typeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 3
      	},
	  	{
			name: 'students',
			//limit: 10,
			source: function(query, syncResults, asyncResults) {
				var data = {
					searchWord: query,
					userId: USER_ID,
					schoolId: SCHOOL_ID
				};
				return $.ajax({
					url: getURLForHTML("dashboard", "get-all-student-list?payload=" + encode(JSON.stringify(data))),
					global: false,
					success: function(data) {
						data = JSON.parse(data);
						if(data.studentList) {
							var matches = [];
							$.each(data.studentList, function(index, item) {
								matches.push({
									display: item.studentName,
									studentUserId: item.studentUserId,
									standardId:item.standardId,
									studentStandardId:item.studentStandardId
								});
							});
							asyncResults(matches);
						} else {
							console.warn('No studentList found in response');
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						if (checkonlineOfflineStatus()) {
							return;
						}
						console.error('AJAX error: ' + textStatus + ' : ' + errorThrown);
					}
				});
			},
			display: function(item) {
				return item.display;
			},
		}
	).bind('typeahead:select', function(ev, item) {
		console.log('Selection: ', item.studentUserId);
		console.log('Selection studentStandardId: ', item.studentStandardId);
		$("#studentStandardId").val(item.studentStandardId);
		$("#studentUserId").val(item.studentUserId);
		callSubjectNameByStudentUserID(formId, item.studentUserId, item.standardId, eleId);
		callStudentSavedTimePreference(formId, 'timePreferenceSlotWrapper',item.studentUserId);
		$("#selectedStudentTime").text($(this).val());
		$("#standardIdInput").val(item.standardId);
		$(".selected-student").show();
		$("#courseName").select2("destroy").select2({
			theme:"bootstrap4",
			dropdownParent:"#recommendedTeacherlistForm"
		});
	});
}


function callSubjectNameByStudentUserID(formId, value, standardId, eleId) {
	if(value==''){
		return false;
	}
	// if($("#" + formId + " #classDuration").val()==undefined || $("#" + formId + " #classDuration").val()=='00'){
	// 	showMessage(true, "Classroom Duration is required.");
	// 	return false;
	// }
	// if($("#" + formId + " #bufferTime").val()==undefined || $("#" + formId + " #bufferTime").val()=='00'){
	// 	showMessage(true, "Buffer Time Duration is required.");
	// 	return false;
	// }
	if(standardId>10 && standardId<18){
	
		$("#"+formId+" #"+eleId).html('<option value="">All Courses</option>');
		return false;
	}

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','SUBJECT-BY-STUDENT',value)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$("#"+formId+" #teacherId").empty();
				var result = data['mastersData']['courseList'];
				var dropdown = $("#"+formId+" #"+eleId);
				dropdown.html('');
				dropdown.append('<option value="">All Courses</option>');
				$.each(result, function(k, v) {
					dropdown.append('<option value="' + v.key + '">'
							+ v.value + ' </option>');
				});
			}
		}
	});
}
function selecteTeacher(eleId,checkboxId, updateAndResetId, appendTdEle, teacherUserId, index){
	if($("#"+checkboxId).prop("checked")){
		if($("."+appendTdEle+" .recommended-teacher-thumb").length<1){
			$("#"+checkboxId).parent().hide();
			$("#"+eleId).appendTo($("."+appendTdEle));
			$("."+appendTdEle+" .blankText").hide();
			$("#"+updateAndResetId).show();
			$("#selectedTeacherUserId-"+index).val(teacherUserId);
			$("#"+updateAndResetId).addClass("select-teacher");
			if($("#recommendedTeachers .select-teacher").length>0){
				$(".bulkUpdateBtnWrapper .btn").removeClass("disabled");
			}
		}else{
			$("#"+checkboxId).prop("checked", false);
			showMessageTheme2(0, "Please remove the already selected teacher and choose another one");
		}
		
	}
}
function reset(eleId,checkboxId, updateAndResetId, appendTdEle, removeappendEle, selectedTeacherUserId, sendMailEleId){
	$("#"+checkboxId).parent().show();
	$("#"+checkboxId).prop("checked", false);
	var order = parseInt($("."+removeappendEle).find(".recommended-teacher-thumb").attr("data-order"));
	// order = order - 1;
	// if(order == 0 || order == 1){
	// 	$("."+appendTdEle+" .recommended-teacher-thumb:nth-child(1)").before($("#"+eleId))
	// }else{
	// 	$("."+appendTdEle+" .recommended-teacher-thumb:nth-child("+order+")").after($("#"+eleId))
	// }
	if($("."+appendTdEle+" .recommended-teacher-thumb").length == 0){
		$("."+appendTdEle+"").append($("#"+eleId));
	}else{
		$("."+appendTdEle+" .recommended-teacher-thumb:last-child").after($("#"+eleId));
	}
	// $("#"+eleId).prependTo($("."+appendTdEle));
	$("."+removeappendEle+" .blankText").show();
	$("#"+updateAndResetId).hide();
	$("#"+sendMailEleId).hide();
	$("#"+updateAndResetId).removeClass("select-teacher");
	if($("#recommendedTeachers .select-teacher").length<1){
		$(".bulkUpdateBtnWrapper .btn").addClass("disabled");
	}
	if($("#"+selectedTeacherUserId).val() != ''){
		$("#"+selectedTeacherUserId).val("");
	}
	
}

function assignTeacher(eleId,checkboxId, updateAndResetId, appendTdEle, removeappendEle, availableTeacherDivEle, subjectId, teacherUserId, elementrySubjectID, sendMailEleId, saveFrom){
	$("#"+checkboxId).parent().hide();
	$("#"+checkboxId).prop("checked", false);
	$("."+appendTdEle).find(".custom-checkbox").show();
	$("."+appendTdEle).find(".custom-checkbox .custom-control-label").show();
	$("."+appendTdEle).find(".sendMail").hide();
	var order = parseInt($("."+appendTdEle).find(".recommended-teacher-thumb").attr("data-order"));
	order = order - 1;
	// if(order == 0 || order == 1){
	// 	$("."+availableTeacherDivEle+" .recommended-teacher-thumb:nth-child(1)").before($("."+appendTdEle).html())
	// }else{
	// 	$("."+availableTeacherDivEle+" .recommended-teacher-thumb:nth-child("+order+")").after($("."+appendTdEle).html())
	// }
	if($("."+appendTdEle+" .recommended-teacher-thumb").length == 0){
		$("."+availableTeacherDivEle+"").append($("#"+appendTdEle));
	}else{
		$("."+availableTeacherDivEle+" .recommended-teacher-thumb:last-child").after($("."+appendTdEle).html());
	}
	$("."+appendTdEle).html("");
	$("#"+eleId).prependTo($("."+appendTdEle));
	$("."+removeappendEle+" .blankText").show();
	$("."+removeappendEle+" #"+eleId).remove();
	$("#"+updateAndResetId).hide();
	$("#"+sendMailEleId).show();
	if(saveFrom == undefined && saveFrom != "bulk"){
		saveAutoAssignTeacherRequest("recommendedTeacherlistForm", subjectId,teacherUserId, elementrySubjectID, false)
	}
}

function assignTeacherBulk(listOnclickFun){
	console.log(listOnclickFun);
	$.each(listOnclickFun, function(i,v){
		eval(v);
	});
}

function removeSelectTimeSlot(slotEle){
	$("#"+slotEle).remove();
	var selectSlotLength = $("#timePreferenceSlotWrapper .selectedPreferenceSlot").length;
	if(selectSlotLength == 0){
		$("#timePreferenceSlotWrapper").html('<span id="notSlotAdd" class="d-inline-block position-relative font-weight-bold" style="top:30px">No Time Preference Added.</span>')
	}
}

function addTimePreference(startTimeId, endTimeId){
	var selectSlotLength = $("#timePreferenceSlotWrapper .selectedPreferenceSlot").length;
	var isValidTime = true;
	var timeSlots = [];
	if(selectSlotLength<3){
		var st = $("#"+startTimeId).val();
		var et = $("#"+endTimeId).val();
		if(st == undefined || st == null || st == ''){
			showMessageTheme2(0, "Please select start time");
			return false;
		}
		if(et == undefined || et == null || et == ''){
			showMessageTheme2(0, "Please select end time");
			return false;
		}
		$("#timePreferenceSlotWrapper .selectedPreferenceSlot").each(function(){
			timeSlots.push({
				start: $(this).find(".startTimeText").text(),
				end: $(this).find(".endTimeText").text(),
			});
			if($(this).find(".startTimeText").text() ==  st && $(this).find(".endTimeText").text() == et){
				isValidTime = false;
			}
		});

		console.log(timeSlots);
		
		if(isValidTime){
			timeSlots.push({
				start: st,
				end: et,
			});
			var flag = checkOverlap(timeSlots);
			if(!flag){
				var html ='<span class="d-inline-block ml-2 selectedPreferenceSlot" id="selectedPreferenceSlot'+(selectSlotLength+1)+'" startTime="'+st+'" endTime="'+et+'">'
					+'<div class="m-0 font-weight-bold">Preference '+(selectSlotLength+1)+'</div>'
					+'<label class="bg-light-primary text-primary rounded-5 d-inline-block p-1 border border-primary px-2">'
						+'<span class="d-inline-block startTimeText">'+st+'</span> - <span class="d-inline-block endTimeText">'+et+'</span>'
						+'<a href="javascript:void(0)" class="d-inline-block bg-white text-primary p-1 border border-primary ml-1 rounded-5" style="line-height:14px" onclick="removeSelectTimeSlot(\'selectedPreferenceSlot'+(selectSlotLength+1)+'\')"><i class="fa fa-times"></i></a>'
					+'</label>'
				+'</span>';
				$("#timePreferenceSlotWrapper #notSlotAdd").remove();
				$("#timePreferenceSlotWrapper").append(html);
			}else{
				showMessageTheme2(0, "Please check that one of your time slots is overlapping with another time slot.");
			}
		}else{
			showMessageTheme2(0, "You have already added this time preference");
		}
	}else{
		showMessageTheme2(0, "You can only add a maximum of 3 time preferences.");
	}
	
}



function convertToMinutes(time) {
	var [timeString, period] = time.split(' ');
	var [hours, minutes] = timeString.split(':').map(Number);
	if (period === 'PM' && hours !== 12) hours += 12;
	if (period === 'AM' && hours === 12) hours = 0;
	return hours * 60 + minutes;
}

function isOverlapping(slot1, slot2) {
	return (convertToMinutes(slot1.start) < convertToMinutes(slot2.end)) &&
		(convertToMinutes(slot2.start) < convertToMinutes(slot1.end));
}

function checkOverlap(timeSlots) {
	var overlapFound = false;
	for (var i = 0; i < timeSlots.length - 1; i++) {
		for (var j = i + 1; j < timeSlots.length; j++) {
			if (isOverlapping(timeSlots[i], timeSlots[j])) {
				console.log(`Overlap found between slot ${i + 1} and slot ${j + 1}`);
				overlapFound = true;
			}
		}
	}
	return overlapFound; 
	// if (!overlapFound) {
	// 	console.log('No overlaps found.');
	// }
}

function calculateTimeGap(startTime, endTime) {
	var startMinutes = convertToMinutes(startTime);
	var endMinutes = convertToMinutes(endTime);
	var gapMinutes = endMinutes - startMinutes;
	return gapMinutes;
}
async function viewWeeklyTimeDetails(teacherName, teacherUserId, subjectId){
	
	try {
		
		var selectSlotLength = $("#timePreferenceSlotWrapper .selectedPreferenceSlot").length;
		var timeSlots = [];
		var studentStandardId = $("#studentStandardId").val();
		var currentDate = new Date();
		var availabilityData = await getTeacherTimeToShowWeeklyCalendar(teacherUserId, 'TEACHER', 'WEEK', studentStandardId,currentDate);
		console.log(availabilityData.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[0].teacherAllDataInOneList)
		if(selectSlotLength<=3){
			$("#timePreferenceSlotWrapper .selectedPreferenceSlot").each(function(){
				timeSlots.push({
					start: $(this).find(".startTimeText").text(),
					end: $(this).find(".endTimeText").text(),
				});
			});
			console.log(timeSlots);
		}
		// Directly update the listOfSlot with a 'status' key for each time slot
		$.each(availabilityData.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList, function(index, value){
			value.teacherAllDataInOneList.forEach(function(daySlot) {
				// Iterate over dayWiseAllData in the daySlot and update directly
				daySlot.dayWiseAllData.forEach(function(slot) {
					// if(slot.bookedStartDate == )
					var slotStart = convertToMinutes(slot.displayStartTime);
					var slotEnd = convertToMinutes(slot.displayEndTime);
					
					// Check if the slot is within any of the preference ranges
					var status = timeSlots.some(function(p) {
						var prefStart = convertToMinutes(p.start);
						var prefEnd = convertToMinutes(p.end);
						if (slotEnd < slotStart) {
							slotEnd += 1440; // Add 24 hours (1440 minutes) if the slot crosses midnight
						}
						// Check if the slot time is within the preference range
						return slotStart >= prefStart && slotEnd <= prefEnd;
					}) ? 'within' : 'outside';
					slot.timerange = status;
				});
			});
		});

		console.log(availabilityData.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[0].teacherAllDataInOneList);
		
		if($("#recommendedTeacherAvailabilityModal").length>0){
			$("#recommendedTeacherAvailabilityModal").remove()
		}
		if($("body .modal-stack").length>0){
			$("body .modal-stack").before(recommendedTeacherAvailabilityModal(availabilityData));
		}else{
			$("body").append(recommendedTeacherAvailabilityModal(availabilityData));
		}
		var subjectName=$(".subject-name-"+subjectId).text();
		var studentName= $("#selectedStudentTime").text().split("|");
		var teacherHead=teacherName+" slots for "+subjectName+" for "+studentName[0]+" in "+studentName[2];
		$(".teacherName").text(teacherHead);
		$(".teacherName").attr("data-teacherUserId",teacherUserId);
		$("#recommendedTeacherAvailabilityModal").modal("show");
	  } catch (error) {
		console.error('Failed to fetch data:', error);
	  }
	
}

async function nextWeeklyTimeDetails(date){
	try{
		var selectSlotLength = $("#timePreferenceSlotWrapper .selectedPreferenceSlot").length;
		var timeSlots = [];
		var studentStandardId = $("#studentStandardId").val();
		var teacherUserId = $(".teacherName").attr("data-teacherUserId");
		var availabilityData = await getTeacherTimeToShowWeeklyCalendar(teacherUserId, 'TEACHER', 'WEEK', studentStandardId,date);
		if(selectSlotLength<3){
			$("#timePreferenceSlotWrapper .selectedPreferenceSlot").each(function(){
				timeSlots.push({
					start: $(this).find(".startTimeText").text(),
					end: $(this).find(".endTimeText").text(),
				});
			});
			console.log(timeSlots);
		}
		// Directly update the listOfSlot with a 'status' key for each time slot
		$.each(availabilityData.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList, function(index, value){
			value.teacherAllDataInOneList.forEach(function(daySlot) {
				// Iterate over dayWiseAllData in the daySlot and update directly
				daySlot.dayWiseAllData.forEach(function(slot) {
					// if(slot.bookedStartDate == )
					var slotStart = convertToMinutes(slot.displayStartTime);
					var slotEnd = convertToMinutes(slot.displayEndTime);
					
					// Check if the slot is within any of the preference ranges
					var status = timeSlots.some(function(p) {
						var prefStart = convertToMinutes(p.start);
						var prefEnd = convertToMinutes(p.end);
						if (slotEnd < slotStart) {
							slotEnd += 1440; // Add 24 hours (1440 minutes) if the slot crosses midnight
						}
						// Check if the slot time is within the preference range
						return slotStart >= prefStart && slotEnd <= prefEnd;
					}) ? 'within' : 'outside';
					slot.timerange = status;
				});
			});
		});
		
		$("#recommendedTeacherAvailabilityModal .modal-body").html(recommendedTeacherAvailabilityModalBody(availabilityData))
	}
	catch (error){
		console.error('Failed to fetch data:', error);
	}
	
}
async  function prevWeeklyTimeDetails(date){
	try{
		var selectSlotLength = $("#timePreferenceSlotWrapper .selectedPreferenceSlot").length;
		var timeSlots = [];
		var studentStandardId = $("#studentStandardId").val();
		var teacherUserId = $(".teacherName").attr("data-teacherUserId");
		var availabilityData = await getTeacherTimeToShowWeeklyCalendar(teacherUserId, 'TEACHER', 'WEEK', studentStandardId,date);
		if(selectSlotLength<3){
			$("#timePreferenceSlotWrapper .selectedPreferenceSlot").each(function(){
				timeSlots.push({
					start: $(this).find(".startTimeText").text(),
					end: $(this).find(".endTimeText").text(),
				});
			});
			console.log(timeSlots);
		}
		// Directly update the listOfSlot with a 'status' key for each time slot
		$.each(availabilityData.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList, function(index, value){
			value.teacherAllDataInOneList.forEach(function(daySlot) {
				// Iterate over dayWiseAllData in the daySlot and update directly
				daySlot.dayWiseAllData.forEach(function(slot) {
					// if(slot.bookedStartDate == )
					var slotStart = convertToMinutes(slot.displayStartTime);
					var slotEnd = convertToMinutes(slot.displayEndTime);
					
					// Check if the slot is within any of the preference ranges
					var status = timeSlots.some(function(p) {
						var prefStart = convertToMinutes(p.start);
						var prefEnd = convertToMinutes(p.end);
						if (slotEnd < slotStart) {
							slotEnd += 1440; // Add 24 hours (1440 minutes) if the slot crosses midnight
						}
						// Check if the slot time is within the preference range
						return slotStart >= prefStart && slotEnd <= prefEnd;
					}) ? 'within' : 'outside';
					slot.timerange = status;
				});
			});
		});
		$("#recommendedTeacherAvailabilityModal .modal-body").html(recommendedTeacherAvailabilityModalBody(availabilityData))
	}
	catch (error){
		console.error('Failed to fetch data:', error);
	}
	
}


function recommendedTeachersResetForm (){
	$("#recommendedTeacherlistForm  #typeahead").val("");
	$("#recommendedTeacherlistForm  #gradeName").val("");
	$("#recommendedTeacherlistForm  #enrollDetails").val("");
	$("#recommendedTeacherlistForm #courseName").val("").trigger("change");
	$("#recommendedTeacherlistForm #addPreferenceStartTime").val("").trigger("change");
	$("#recommendedTeacherlistForm #addPreferenceEndTime").val("").trigger("change").prop("disabled",true);
	$("#recommendedTeacherlistForm #timePreferenceSlotWrapper, #recommendedTeachers tbody").html("");
	$(".selected-student").hide();
	$(".gradeAndLearningProgram").css({"display":"none"});
	$(".bulkUpdateBtnWrapper .btn").addClass("disabled"); 
}

function checkdateIsPastOrNot(dateString) {
	var providedDate = new Date(dateString);
	var currentDate = new Date();
	providedDate.setHours(0, 0, 0, 0);
	currentDate.setHours(0, 0, 0, 0);
	return providedDate < currentDate;
  }




