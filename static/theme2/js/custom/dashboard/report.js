function schoolWiseReport(schoolId){
	var urlSend = '/dashboard/school-data-reports?moduleId='+moduleId+'&schoolId='+schoolId;
	getAsPost(urlSend,'_self');
	customLoader(false)
}
$('#startDate').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#endDate').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});

$('#studStartDate').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#studEndDate').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#startDateTeacher').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#endDateTeacher').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#paymentStartDate').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#paymentEndDate').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#startDateTeacherC').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
$('#endDateTeacherC').datepicker({
	autoclose : true,
	format : 'mm-dd-yyyy'
});
	
	
	/*$('#liveSchoolTour').show();
	$('#schoolListRpt').hide();
	$('#teacherFreesessionSlot').hide();*/
function getReportData(data){
	console.log("Content for : ",data);
	if(data=='LIVE-SCHOOL'){
		$("#errMsg").text('');
		$('#liveSchoolTour').show();
		$('#schoolListRpt').hide();
		$('#teacherFreesessionSlot').hide();
	}else if(data=='STUDENT-LIST'){
		$("#errMsg").text('');
		$('#liveSchoolTour').hide();
		$('#schoolListRpt').show();
		$('#teacherFreesessionSlot').hide();
	}else if(data=='TEACHER-FREE-SESSION'){
		$("#errMsg").text('');
		$('#liveSchoolTour').hide();
		$('#schoolListRpt').hide();
		$('#teacherFreesessionSlot').show();
	}else{
		$("#errMsg").text('');
		$('#liveSchoolTour').hide();
		$('#schoolListRpt').hide();
		$('#teacherFreesessionSlot').hide();
	}
}




 
	
	

function getRequestForStudentReport(reportTitle,stanardId, reporttype, callfrom) {
	var adminStudentReportRequest = {};
	adminStudentReportRequest['reportTitle'] = reportTitle;
	adminStudentReportRequest['reportType'] = reporttype;
	adminStudentReportRequest['schoolId'] = SCHOOL_ID;	
	adminStudentReportRequest['loginUserId'] = USER_ID;	
	adminStudentReportRequest['callFrom'] = callfrom;	
	
	if(callfrom=='search'){
		if($("#stdSerachschoolId").val()!=undefined){
			adminStudentReportRequest['schoolId']=$("#stdSerachschoolId").val();
		}
		adminStudentReportRequest['acSessionId'] = $("#academicYear").val();
		if($("#enrollType").val()!=undefined){
			adminStudentReportRequest['enrollType']=$("#enrollType").val();
		}
		if($("#standardId").val()!=undefined){
			adminStudentReportRequest['standardId'] = stanardId;
		}
		if($("#enrollType").val()!=undefined){
			adminStudentReportRequest['enrollType']=$("#enrollType").val();
		}
		if($("#countryId").val()!=undefined){
			adminStudentReportRequest['countryId']=$("#countryId").val();
		}
		if($("#stateId").val()!=undefined){
			adminStudentReportRequest['stateId']=$("#stateId").val();
		}
		if($("#cityId").val()!=undefined){
			adminStudentReportRequest['cityId']=$("#cityId").val();
		}
		if($("#stdStartDateSearch").val()!='' && $("#stdStartDateSearch").val()!=undefined){
			var sDate = $("#stdStartDateSearch").val();
			var stdDate = sDate.split("-")[2]+"-"+sDate.split("-")[0]+"-"+sDate.split("-")[1];
			adminStudentReportRequest['startDate']=stdDate;
		}
		if($("#stdEndDateSearch").val()!='' && $("#stdEndDateSearch").val()!=undefined){
			var eDate = $("#stdEndDateSearch").val();
			var enDate = eDate.split("-")[2]+"-"+eDate.split("-")[0]+"-"+eDate.split("-")[1];
			adminStudentReportRequest['endDate']=enDate;
		}
		if($("#datetype").val()!=undefined){
			adminStudentReportRequest['datetype']=$("#datetype").val();
		}
		if($("#selectReportData").val()!=undefined){
			adminStudentReportRequest['selectReportData']=$("#selectReportData").val();
		}
		if($("#studentEmail").val()!=undefined){
			adminStudentReportRequest['emailid']=$("#studentEmail").val();
		}
		if($("#studentName").val()!=undefined){
			adminStudentReportRequest['studentName']=$("#studentName").val();
		}
		if($("#standardId").val()!=undefined){
			adminStudentReportRequest['standardId']=$("#standardId").val();
		}
		
	}else{
		adminStudentReportRequest['acSessionId'] = $("#acSessionId").val();
		adminStudentReportRequest['standardId'] = stanardId;
		adminStudentReportRequest['schoolId'] = SCHOOL_ID;
	}
	if(reportTitle=='countrywise'){
		var stnd = stanardId.split("-");
		if(stnd.length>1){
			adminStudentReportRequest['standardId'] = stnd[0];
			adminStudentReportRequest['countryId'] = stnd[1];
		}
	}
	if(reportTitle=='monthwise'){
		var stnd = stanardId.split("-");
		if(stnd.length>1){
			adminStudentReportRequest['standardId'] = stnd[0];
			var date = new Date(stnd[1]+'-'+stnd[2]+'-'+'01');
      		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      		var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			var stdDate = firstDay.getFullYear()+'-'+(firstDay.getMonth()+1)+'-'+firstDay.getDate();
			adminStudentReportRequest['startDate']=stdDate;
			var endate = lastDay.getFullYear()+'-'+(lastDay.getMonth()+1)+'-'+lastDay.getDate();
			adminStudentReportRequest['endDate']=endate;  
		}
	}
	

	return adminStudentReportRequest;
}
function getReportStudentCount(reportTitle, stanardId, reporttype, callfrom){
	if(callfrom==''){
		callfrom = $("#callfrom").val();
	}
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','report-enrolled-student'),
		data : JSON.stringify(getRequestForStudentReport(reportTitle,stanardId, reporttype, callfrom)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async:true,
		success : function(data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2'|| data.statusResponse['status'] == 'FAILED' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme2'){
						//showMessageTheme2(2, data['message'],'',true);
					   $("#adminStudentReport").append("")
					}else if(tt=='theme1'){
						//showMessage(true, data['message']);
					}
				}
			}else {
				if(reporttype=='group'){
					var liveTbl= '';
					if(reportTitle=='countrywise'){
						liveTbl=reportStudentCounty(data.adminStudentReportList, reportTitle);
					}else if(reportTitle=='monthwise'){
						liveTbl=reportStudentCounty(data.adminStudentReportList, reportTitle);
					}
					else{
						liveTbl=reportStudentGrade(data.adminStudentReport, reportTitle);
					}

					$('.'+reportTitle).html('');
					$('.'+reportTitle).append(liveTbl);
					if(callfrom=='search'){
						$("#studentReportAdvanceSearch").modal('hide');
					}
					
				}else{
					var stdFilter = '';
					if(reportTitle=='countrywise'){
						stdFilter=reportStudentGradeList(data.adminStudentReportList[0]);
					}else if(reportTitle=='monthwise'){
						stdFilter=reportStudentGradeList(data.adminStudentReportList[0]);
					}else if(reportTitle=='end-semester'){
						stdFilter=reportEndSemStudentList(data.endStudentEndSemesterList);
					}else{
						stdFilter=reportStudentGradeList(data.adminStudentReport);
					}
					
					if(reportTitle=='end-semester'){
						$('#reportEndSemesterTable').dataTable().fnClearTable();
						$('#reportEndSemesterTable').dataTable().fnDraw();
						$('#reportEndSemesterTable').dataTable().fnDestroy();
						$("#student_list_end_semester").html('');
						$("#student_list_end_semester").html(stdFilter);
						$("#reportEndSemesterTable").DataTable();
						$("#studentReportAdvanceSearch").modal('hide');
					}else{
						$('#filterStudentList').html('');
						$('#filterStudentList').html(stdFilter);
						$("#studentReportListPopup").modal('show');
						$('#stdReportList').dataTable().fnDestroy();
						$("#stdReportList").DataTable({
							'columnDefs': [ {
								'targets': [0], // column index (start from 0)
								'orderable': false, // set orderable false for selected columns
								
						}],
						order: [[1, 'asc']],
						});
						callCheckboxAll();
					}
					
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
  
  function reportStudentGrade(adminStudentReport, reportTitle){
	//console.log(adminStudentReport);
	var studentList = adminStudentReport.adminStudentGradeReport;
	var htmlTbl ='';
	var htmTd='';
	//var totalStd=0;
	if(studentList!=null && studentList.length>0){
		htmlTbl='<td class="bold">'+adminStudentReport.reportTitle+'</td>';
		for(md=0;md<studentList.length;md++){
			//totalStd+=parseInt(studentList[md]['totalStudent']);
			var tStudent = studentList[md]['totalStudent']==0?'-':studentList[md]['totalStudent'];
			var funRecord =  "getReportStudentCount('"+reportTitle+"','"+studentList[md]['standardId']+"','list','');";
			if(tStudent=='-'){
				htmTd+='<td class="text-center">-</td>';
			}else{
				var textColor='text-dark';
				if(reportTitle=='enrolled' || reportTitle=='fresh' || reportTitle=='nextgrade' || reportTitle=='enrolled-adv' 
					|| reportTitle=='partial-pay' || reportTitle=='bookseat-adv' || reportTitle=='bookseat' || reportTitle=='repeatgrade' 
					|| reportTitle=='flexgrade' || reportTitle=='migrate-same-session'
					){
						textColor='text-white';
				}
				htmTd+='<td class="text-center"><a href="javascript:void(0);" onclick="'+funRecord+'" class="'+textColor+'">'+tStudent+'</a></td>';
			}
			
		}
		var textColor1='text-dark';
		if(reportTitle=='enrolled' || reportTitle=='fresh' || reportTitle=='nextgrade' || reportTitle=='enrolled-adv' 
			|| reportTitle=='partial-pay' || reportTitle=='bookseat-adv' || reportTitle=='bookseat' || reportTitle=='repeatgrade' 
			|| reportTitle=='flexgrade' || reportTitle=='migrate-same-session'
			){
				textColor1='text-white';
		}
		var funRec = "getReportStudentCount('"+reportTitle+"','','list','');";
		htmlTbl+='<td class="text-center"><a href="javascript:void(0);" onclick="'+funRec+'" class="'+textColor1+'">'+adminStudentReport.totalStudent+'</a></td>';
	}
	return htmlTbl+htmTd;
  }
  function reportStudentCounty(adminStudentReport, reportTitle){
	//console.log(adminStudentReport);
	var htmlTbl ='';
	if(adminStudentReport!=null &&  adminStudentReport.length>0){
		for(c=0;c<adminStudentReport.length;c++){
			var funRec =  "getReportStudentCount('"+reportTitle+"','0-"+adminStudentReport[c]['reportid']+"','list','');";
			htmlTbl+='<tr>';
			htmlTbl+='<td class="bold">'+adminStudentReport[c]['reportTitle']+'</td>';
			htmlTbl+='<td class="text-center"><a href="javascript:void(0);" onclick="'+funRec+'">'+adminStudentReport[c]['totalStudent']+'</a></td>';
			var studentList = adminStudentReport[c]['adminStudentGradeReport'];
			var htmTd='';
			//var totalStd=0;
			if(studentList!=null && studentList.length>0){
				for(md=0;md<studentList.length;md++){
					//totalStd+=parseInt(studentList[md]['totalStudent']);
					var tStudent = studentList[md]['totalStudent']==0?'-':studentList[md]['totalStudent'];
					var funRecord =  "getReportStudentCount('"+reportTitle+"','"+studentList[md]['standardId']+"-"+adminStudentReport[c]['reportid']+"','list','');";
					if(tStudent=='-'){
						htmTd+='<td class="text-center">-</td>';
					}else{
						var textColor='text-dark';
						htmTd+='<td class="text-center"><a href="javascript:void(0);" onclick="'+funRecord+'" class="'+textColor+'">'+tStudent+'</a></td>';
					}
				}
				htmlTbl=htmlTbl+htmTd;
			}
			htmlTbl+='</tr>';	
		}
	}
	return htmlTbl;
  }

  function reportStudentGradeList(adminStudentReport){
	console.log(adminStudentReport);
	$("#gradeStudentTitle").html(adminStudentReport.reportTitle);
	var studentList = adminStudentReport.adminStudentGradeReport;
	var htmlTbl ='';
	var a=1;
	//+(a++)+
	var enrollType='';
	if(studentList.length>0){
		for(md=0;md<studentList.length;md++){
			var checkBoxs="<input type=\"checkbox\" class=\"checkUserid\" value=\""+studentList[md]['userid']+"\"/>";
			if(studentList[md]['leadStatus']=='Y'){
				checkBoxs = "";
			}
			if(studentList[md]['enrollType']=='REGISTRATION_FRESH'||studentList[md]['enrollType']=='REGISTRATION_REGISTER'||studentList[md]['enrollType']=='REGISTRATION_FLEX_COURSE'){
				enrollType='Fresh';
			}else{
				enrollType='Progression';
			}
			htmlTbl+='<tr>';
			htmlTbl+='<td class="text-center">&nbsp;&nbsp;'+checkBoxs+'</td>';
			htmlTbl+='<td class="text-left">'+studentList[md]['stdName']+'</td>';
			htmlTbl+='<td class="text-left">'+studentList[md]['email']+'</td>';
			htmlTbl+='<td class="text-left">'+studentList[md]['grade']+'</td>';
			htmlTbl+='<td class="text-left">'+studentList[md]['registername']+'</td>';
			htmlTbl+='<td class="text-left">'+enrollType+'</td>';
			htmlTbl+='</tr>';
		}
	}
	return htmlTbl;
  }

  function reportEndSemStudentList(studentList){
	var htmlTbl ='';
	var a=1;
	//+(a++)+
	var enrollType='';
	if(studentList.length>0){
		for(md=0;md<studentList.length;md++){
			var stdList=studentList[md];
			// var checkBoxs="<input type=\"checkbox\" class=\"checkUserid\" value=\""+studentList[md]['userid']+"\"/>";
			// if(studentList[md]['leadStatus']=='Y'){
			// 	checkBoxs = "";
			// }
			// if(studentList[md]['enrollType']=='REGISTRATION_FRESH'||studentList[md]['enrollType']=='REGISTRATION_REGISTER'||studentList[md]['enrollType']=='REGISTRATION_FLEX_COURSE'){
			// 	enrollType='Fresh';
			// }else{
			// 	enrollType='Progression';
			// }

			
			htmlTbl+='<tr>';
			htmlTbl+='<td class="text-center">'+(a)+'</td>';
			// htmlTbl+='<td class="text-center">&nbsp;&nbsp;'+checkBoxs+'</td>';
			
			htmlTbl+='<td class="text-left">'+stdList.rollno+'<br/>'+stdList.stdName+'</td>';
			htmlTbl+='<td class="text-left">'+stdList.stdEmail+'<br/>+'+stdList.stdPhoneNo+'<br/>'+stdList.cityName+' | '+stdList.countryName+'</td>';
			htmlTbl+='<td class="text-left">'+stdList.standardName+' | '+stdList.registerType+'</td>';
			// htmlTbl+='<td class="text-left">'+stdList.parentName+'<br/>'+stdList.parentEmail+'<br/>+'+stdList.parentPhoneNo+'</td>';
			htmlTbl+='<td><span class="text-left">'+stdList.enrollStart+' - '+stdList.enrollEnd+'</span> '+(stdList.dueDays<0?'<br/>overdue by':'')+' <span style="font-size:14px;" class="float-right bold '+(stdList.dueDays>0?'text-success':'text-danger')+'">'+stdList.dueDays+'</span></td>';
			htmlTbl+='</tr>';
			a=a+1;
		}
	}
	return htmlTbl;
  }

  function callCheckboxAll(){
	$('#select_all_user').on('click',function(){
		var leadNo='';
        if(this.checked){
            $('.checkUserid').each(function(){
                this.checked = true;
				leadNo = leadNo+','+$(this).val();
            });
        }else{
             $('.checkUserid').each(function(){
                this.checked = false;
				leadNo = leadNo.replace(","+$(this).val(), '')
            });
        }
		$("#stdLeadNoMove").val(leadNo);
    });
	

	 $('.checkUserid').on('click',function(){
		var leadNo=$("#stdLeadNoMove").val();
        if($('.checkUserid:checked').length == $('.checkUserid').length){
            $('#select_all_user').prop('checked',true);
        }else{
            $('#select_all_user').prop('checked',false);
        }
		if(this.checked){
            leadNo = leadNo+','+$(this).val();
        }else{
			leadNo = leadNo.replace(","+$(this).val(), '')
        }
		$("#stdLeadNoMove").val(leadNo);
    });


  }

  function moveStudentToLead(newTheme) {
	if(newTheme){
		hideMessageTheme2('');
	}else{
		hideMessage('');
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','student-move-tolead'),
		data : JSON.stringify(getRequestForMoveStudentData()),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				if(newTheme){
					showMessageTheme2(0, data['message'],'',true);
				}else{
					showMessage(true, data['message']);
				}
				
			} else {
				if(newTheme){
					showMessageTheme2(1, data['message'],'',false);
					$("#stdLeadNoMove").val('');
					$('#moveStudentAsLeads').modal('hide');
				}else{
					showMessage(true, data['message']);
					$("#stdLeadNoMove").val('');
					$('#moveStudentAsLeads').modal('hide');
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
   function getRequestForMoveStudentData(){
		var leadAddFormRequestDTO = {};
		var authentication = {};
		var leadCommonDTO = {};
		var moveleadNo = $("#stdLeadNoMove").val();
		var leadModifyDTO ={};
		leadModifyDTO['leadNo'] =moveleadNo.substring(1,moveleadNo.lenght);
		leadModifyDTO['assignTo'] =$("#leadStudentAssignMove").val();
		leadCommonDTO['leadModifyDTO']=leadModifyDTO;
	
		authentication['hash'] = getHash();
		authentication['schoolId'] = SCHOOL_ID;
		authentication['schoolUUID'] = SCHOOL_UUID;
		authentication['userId'] = USER_ID;
		authentication['userType'] = 'COMMON';
		leadAddFormRequestDTO['authentication'] = authentication;
		leadAddFormRequestDTO['leadCommonDTO'] = leadCommonDTO;
		return leadAddFormRequestDTO;
   }

function getRequestForUserLogHistory(reportTitle,userId, reporttype, callfrom) {
	var usersLogRequest = {};
	usersLogRequest['userId'] = userId;
	usersLogRequest['reportTitle']=reportTitle;
	usersLogRequest['schoolId'] = SCHOOL_ID;	
	usersLogRequest['callFrom'] = callfrom;	
	return usersLogRequest;
}

function getUserLogHistory(hitoryType, userId, reporttype, callfrom){
	// if(callfrom==''){
	// 	callfrom = $("#callfrom").val();
	// }
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','user-logs-history'),
		data : JSON.stringify(getRequestForUserLogHistory(hitoryType,userId, reporttype, callfrom)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async:true,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2'|| data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme2'){
						//showMessageTheme2(2, data['message'],'',true);
					}else if(tt=='theme1'){
						//showMessage(true, data['message']);
					}
				}
			}else {
				var logList=userLogList(data.usersLogList, hitoryType);
				$('.'+hitoryType).html('');
				$('.'+hitoryType).append(logList);
				$('#'+hitoryType).dataTable().fnDestroy();
				$('#'+hitoryType).DataTable();
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

  function userLogList(userLogsList, hitoryType){
	//console.log(userLogsList);
	var htmlTbl ='';
	var a=1;
	if(userLogsList.length>0){
		for(md=0;md<userLogsList.length;md++){
			htmlTbl+='<tr>';
			htmlTbl+='<td class="text-center">&nbsp;&nbsp;'+(a++)+'</td>';
			htmlTbl+='<td class="text-left">'+userLogsList[md]['columnName']+'</td>';
			htmlTbl+='<td class="text-left">'+userLogsList[md]['prevValue']+'</td>';
			if(hitoryType=='selected-course_history'){
				var txtHighlight = highlight(""+userLogsList[md]['changeValue']+"",""+userLogsList[md]['prevValue']+"");
				htmlTbl+='<td class="text-left">'+txtHighlight+'</td>';
			}else{
				htmlTbl+='<td class="text-left">'+userLogsList[md]['changeValue']+'</td>';
			}
			
			htmlTbl+='<td class="text-left">'+userLogsList[md]['changeBy']+'</td>';
			htmlTbl+='<td class="text-left">'+userLogsList[md]['changeDate']+'</td>';
			htmlTbl+='</tr>';
		}
	}
	return htmlTbl;
  }

  function highlight(oldval, newval) {
	var highlightedText='';
	var changeval = oldval.split(",");
	if(changeval.length>0){
		for(var i=0;changeval.length>i;i++){
			if(newval.includes($.trim(changeval[i]))){ 
				highlightedText += ', '+changeval[i];
			}
			else{
				highlightedText += " <span style=\"background-color:yellow;\">"; //Add the HTML which will cause the highlight
	  			highlightedText += changeval[i]; //Add the text to highlight
	  			highlightedText += "</span>"; //Add the HTML which will cause the end of the highlight
	
			}
		}
	}
	return highlightedText.substr(1,highlightedText.length);
	
  }

