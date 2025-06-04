var today = new Date();
if(ENVIRONMENT=='dev'){
	today.setMonth(today.getMonth()-1);//this is only for testing purposes
}
function studentAssginedReportSearch(formId,moduleId, userId, userRole){
	if($('#'+formId+' #startDate').val()=='' && $('#'+formId+' #endDate').val()!='' ){
		if(tt=='theme1'){
			showMessage(false, 'Please select start date');
		}else{
			showMessageTheme2(0, 'Please select start date','',true);
		}
		return false;
	}else if($('#'+formId+' #startDate').val()!='' && $('#'+formId+' #endDate').val()=='' ){
		if(tt=='theme1'){
			showMessage(false, 'Please select end date');
		}else{
			showMessageTheme2(0, 'Please select end date','',true);
		}
		return false;
	}else if(new Date($('#endDate').val()).getTime()<new Date($('#startDate').val()).getTime()){
		if(tt=='theme1'){
			showMessage(false, 'Start date is less than or equal to end date');
		}else{
			showMessageTheme2(0, 'Start date is less than or equal to end date','',true);
		}
		return false;
	}
	studentAssginedReportSearchData(formId, 'studentAssignReportList',userId, userRole);
}

function studentAssginedReportSearchData(formId, elementId, argument, userId, role){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('report','get-assigned-teacher-report'),
		dataType : 'json',
		data : JSON.stringify(getStudentAssignedRequest(formId)),
		success : function(data) {
			$('#'+elementId).html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				$('#studentAssginedReportSearchContentDiv').html(studentAssignedReportContent(data, elementId,role));
			}
			return false;
		}
	});
}

function getStudentAssignedRequest(formId){
	var studentAssignRequest = {};
	var authentication = {};
	studentAssignRequest['profileStatus'] = $('#'+formId+' #profileStatus').val();
	studentAssignRequest['progressStatus'] = $('#'+formId+' #progressStatus').val();
	studentAssignRequest['schoolId'] = SCHOOL_ID;
	studentAssignRequest['teacherId'] = $('#'+formId+' #teacherId').val();
	studentAssignRequest['teacherName'] = $('#'+formId+' #teacherName').val();
	studentAssignRequest['officialEmail'] = $('#'+formId+' #officialEmail').val();
	var startDate = getDateInDateFormat($('#'+formId+' #startDate').val());
	startDate=changeDateFormat(startDate, 'yyyy-mm-dd');
	studentAssignRequest['startDateFilter'] = startDate;
	var endDate = getDateInDateFormat($('#'+formId+' #endDate').val());
	endDate=changeDateFormat(endDate, 'yyyy-mm-dd');
	studentAssignRequest['endDateFilter'] = endDate;

	studentAssignRequest['page'] = $('#'+formId+' #page').val();
	studentAssignRequest['pageSize'] = $('#'+formId+' #pageSize').val();
	studentAssignRequest['orderKey'] = $('#'+formId+' #orderKey').val();
	studentAssignRequest['orderBy'] = $('#'+formId+' #orderBy').val();

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = moduleId;
	studentAssignRequest['authentication'] = authentication;
	return studentAssignRequest;
}

function getStudentAssignedReportWithFilterSubmit(callingFrom,teacherId,learningProgram){
	var formId='studentAssignFilterForm';
	var tableId='studentAssignedFilteredTable';
	var role=USER_ROLE;
	var callingFromActual='';
	var standardIdOriginal = $('#standardId').val();
	$('#standardId').val(-1).trigger('change');
	if(callingFrom=='TSF'){
		$('#standardId').val(standardIdOriginal).trigger('change');
		if($('#learningProgram').val().length==0 || $('#learningProgram').val().length==4){
			callingFromActual='';
		}else{
			if($.inArray('BATCH',$('#learningProgram').val())==-1){
				learningProgram='PL';
				callingFromActual='O';
			}else{
				learningProgram='GL';
				callingFromActual='B';
			}
		}
	}else if(callingFrom=='TSLearingProgram'){
		studentAssgineFilterReset('studentAssignFilterForm');
	}else if(callingFrom=='TSTotal'){
		studentAssgineFilterReset('studentAssignFilterForm');
	}else if(callingFrom=='TSGrade'){
		if($('#gradeId_'+teacherId).val()!=''){
			$('#standardId').val([$('#gradeId_'+teacherId).val()]).trigger('change');
			$('#learningProgram').val(-1).trigger('change');
			$('#color').val(-1).trigger('change');
		}else{
			return false;
		}
	}else if(callingFrom=='TSA' || callingFrom=='TSI'){
		studentAssgineFilterReset('studentAssignFilterForm');
		if(callingFrom=='TSA'){
			$('#color').val(['GREEN','YELLOW','BLUE']).trigger('change');
		}else if(callingFrom=='TSI'){
			$('#color').val(['RED']).trigger('change');
		}
	}
	if(callingFrom!='TSF'){
		if(learningProgram=='GL'){
			callingFromActual='B';
			$('#learningProgram').val(['BATCH']).trigger('change');
		}else if(learningProgram=='PL'){
			callingFromActual='O';
			$('#learningProgram').val(['ONE_TO_ONE','SCHOLARSHIP','ONE_TO_ONE_FLEX']).trigger('change');
		}
	}
	$('#'+formId+' #teacherId').val(teacherId);
	if($('#'+formId+' #batchId').html()==''){
		if($('#grades_'+teacherId).attr('grades')!=''){
			var batchesContent='<option value=""></option>';
			var grades=$('#grades_'+teacherId).attr('grades').split('~');
			$.each(grades, function(k, v) {
				var details=v.split('|')
				batchesContent+='<option value="'+details[0]+'">'+details[1]+'</option>';
			});
			$('#'+formId+' #batchId').html(batchesContent);
		}
	}
	$('#studentAssignWithFilterBtn').attr('onClick','getStudentAssignedReportWithFilterSubmit(\'TSF\','+teacherId+',\'\')');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('report', 'get-assigned-teacher-report-with-filter'),
		dataType : 'json',
		data : JSON.stringify(getStudentAssignedRequestWithFilter(formId,callingFromActual)),
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				filterModal('studentAssignFilterModal','hide');
				var isDataTable = $.fn.dataTable.isDataTable('#'+tableId);
				if(isDataTable){
					$('#'+tableId).dataTable().fnDestroy();
				}
				$('#'+tableId+' > tbody').html('');
				$('#studentAssginedReportWtihFilterContentDiv').html(studentAssignedReportTableWithFilter(tableId,role));
				$('#'+tableId+' > tbody').append(getStudentAssignedReportWithFilterBody(data.studentAssigedReportsWithFilter, userId, role));
				
				$('#'+tableId).DataTable({
					order: [[0, $('#'+formId+' #orderBy').val()]],
				});
				$('.filterDiv').show();
			}

			return false;
		}
	});
}

function getStudentAssignedRequestWithFilter(formId,callingFrom){
	var studentAssignRequestWithFilter = {};
	var authentication = {};
	studentAssignRequestWithFilter['callingFrom'] = callingFrom;
	studentAssignRequestWithFilter['schoolId'] = SCHOOL_ID;
	
		studentAssignRequestWithFilter['teacherId'] = $('#'+formId+' #teacherId').val();
		var startDate = getDateInDateFormat($('#studentAssignedReportFilter #startDate').val());
		startDate=changeDateFormat(startDate, 'yyyy-mm-dd');
		studentAssignRequestWithFilter['startDateFilter'] = startDate;
		var endDate = getDateInDateFormat($('#studentAssignedReportFilter #endDate').val());
		endDate=changeDateFormat(endDate, 'yyyy-mm-dd');
		studentAssignRequestWithFilter['endDateFilter'] = endDate;
	
		studentAssignRequestWithFilter['studentName'] = $('#'+formId+' #studentName').val();
		studentAssignRequestWithFilter['studentEmail'] = $('#'+formId+' #studentEmail').val();
		studentAssignRequestWithFilter['learningProgram'] = $('#'+formId+' #learningProgram').val();
		studentAssignRequestWithFilter['standardId'] = $('#'+formId+' #standardId').val();
		studentAssignRequestWithFilter['batchId'] = $('#'+formId+' #batchId').val();
		studentAssignRequestWithFilter['color'] = $('#'+formId+' #color').val();
		studentAssignRequestWithFilter['orderBy'] = $('#orderBy').val();
	
		studentAssignRequestWithFilter['page'] = 0;
		studentAssignRequestWithFilter['pageSize'] = 500;
		if(callingFrom==''){
			studentAssignRequestWithFilter['orderKey'] = 'X.USER_FULL_NAME';
		}else{
			studentAssignRequestWithFilter['orderKey'] = 'X.USER_FULL_NAME';
		}
		
	

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = moduleId;
	studentAssignRequestWithFilter['authentication'] = authentication;
	return studentAssignRequestWithFilter;
}

function studentAssginedReportSearchReset(formId){
	$('#' + formId)[0].reset();
	$('#' + formId+' #reportDropdown').val('oneMonth').trigger('change');
	$('#' + formId+' #page').val('0');
	$('#' + formId+' #pageSize').val('10');
	$('#' + formId+' #officialEmail').val('');
	$('#' + formId+' #teacherId').val('');
}

function studentAssgineFilterReset(formId){
	// $('#' + formId)[0].reset();
	$('#' + formId+' #studentName').val('');
	$('#' + formId+' #studentEmail').val('');
	$('#' + formId+' #learningProgram').val(-1).trigger('change');
	$('#' + formId+' #standardId').val(-1).trigger('change');
	$('#' + formId+' #batchId').val(-1).trigger('change');
	$('#' + formId+' #color').val(-1).trigger('change');
	$('#' + formId+' #orderBy').val('ASC');
}

function getStudenLastActivityDetails(studentUserId,lmsUserId,entityId) {
	customLoader(true);
	hideMessage('');
	var data={};
	data['studentUserId']=studentUserId;
	data['lmsUserId']=lmsUserId;
	data['entityId']=entityId;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','get-student-progress-report-detail'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			// console.log(data);
		}
	});
}

function filterModal(modalID, showHide){
	$("#"+modalID).modal(showHide);
}
function teacherReportByDate(formId){
	$("#startDate, #endDate").attr('disabled', true);
	if($("#reportDropdown").val() == 'sevenDays'){
		var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-6);
		var endDate = today
		$( "#startDate" ).datepicker( "setDate", startDate);
		$( "#endDate" ).datepicker( "setDate", endDate);
	}else if($("#reportDropdown").val() == 'fifteenDays'){
		var startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()-14);
		var endDate = today
		$( "#startDate" ).datepicker( "setDate", startDate);
		$( "#endDate" ).datepicker( "setDate", endDate);
	}else if($("#reportDropdown").val() == 'oneMonth'){
		var startDate = new Date(today.getFullYear(), today.getMonth(), 1);
		var endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
		$( "#startDate" ).datepicker( "setDate", startDate);
		$( "#endDate" ).datepicker( "setDate", endDate);
	}else{
		$( "#startDate" ).datepicker( "setDate", '');
		$( "#endDate" ).datepicker( "setDate", '');
		$("#startDate").removeAttr('disabled');
	}
	if($("#reportDropdown").val()!='custom'){
		studentTeacherValidDate(formId);
	}
}

function studentTeacherValidDate(formId){
	$('.reportTitle').html(today.toLocaleString('default', { month: 'long' })+', '+today.getFullYear());
	if($('#'+formId+' #startDate').val()!='' && $('#'+formId+' #endDate').val()!=''){
		if(new Date($('#endDate').val()).getTime()>=new Date($('#startDate').val()).getTime()){
			var days=' ('+parseInt(Math.round(new Date($('#endDate').val()).getTime()-new Date($('#startDate').val()).getTime()/(1000*3600*24))+1)+')';
			var days=' ('+parseInt(Math.round(Math.abs(new Date($('#endDate').val()).getTime()-new Date($('#startDate').val()).getTime())/(1000*3600*24))+1)+')';
			$('.reportTitle').html($('.reportTitle').html()+days);
		}
	}
}


function getStudentAssignedReportFromChart(callingFrom,teacherId,learningProgram, activeStatus, standardId){
	var formId='studentAssignFilterForm';
	var role=USER_ROLE;
	var callingFromActual='';
	
	if(callingFrom!='TSF'){
		if(learningProgram=='GL'){
			callingFromActual='B';
		}else if(learningProgram=='PL'){
			callingFromActual='O';
		}
	}
	
	$('#'+formId+' #teacherId').val(teacherId);
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('report', 'get-assigned-teacher-report-with-filter'),
		dataType : 'json',
		data : JSON.stringify(getStudentAssignedRequestFromChart(formId,callingFromActual, activeStatus, teacherId, standardId)),
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				var htmlc="";
				var icn=1;
				$.each(data.studentAssigedReportsWithFilter, function( index, value ){
					htmlc+="<tr>";
					htmlc+="<td>"+(icn++)+"</td>";
					htmlc+="<td>"+value.studentName+"</td> ";
					htmlc+="<td>"+value.studentEmail+"</td> ";
					htmlc+="<td>"+value.grade+"</td> ";
					if(value.color=='RED'){
						htmlc+="<td class=\"text-danger\">Inactive</td> ";
					}else{
						htmlc+="<td class=\"text-success\">Active</td> ";
					}
					

					//htmlc+="<td><a href=\"javascript:void(0)\" class=\"btn-sm btn btn-primary\">Click here</a></td> ";
					htmlc+="</tr> ";
				});
				$("#chartactiveStudent").html(htmlc);
			}

			return false;
		}
	});
}

function getStudentAssignedRequestFromChart(formId,callingFrom, activeStatus, teacherId, standardId){
	var studentAssignRequestWithFilter = {};
	var authentication = {};
	studentAssignRequestWithFilter['callingFrom'] = callingFrom;
	studentAssignRequestWithFilter['schoolId'] = SCHOOL_ID;
	studentAssignRequestWithFilter['teacherId']=teacherId;
	studentAssignRequestWithFilter['startDateFilter'] = $('#startFilDate').val();
	studentAssignRequestWithFilter['endDateFilter'] = $('#endFilDate').val();
	studentAssignRequestWithFilter['standardId'] = [standardId];
	if(activeStatus=='inactive'){
		studentAssignRequestWithFilter['color']=['RED'];
	}else{
		studentAssignRequestWithFilter['color']=['GREEN','YELLOW','BLUE'];
	}
	
	studentAssignRequestWithFilter['orderBy']='asc';
	studentAssignRequestWithFilter['page'] = 0;
	studentAssignRequestWithFilter['pageSize'] = 500;
	if(callingFrom==''){
		studentAssignRequestWithFilter['orderKey'] = 'X.USER_FULL_NAME';
	}else{
		studentAssignRequestWithFilter['orderKey'] = 'X.USER_FULL_NAME';
	}
	
	studentAssignRequestWithFilter['activeStatus']=activeStatus;
	

	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userId'] = USER_ID;
	authentication['userType'] = moduleId;
	studentAssignRequestWithFilter['authentication'] = authentication;
	return studentAssignRequestWithFilter;
}


function getTeacherPerformance(formId, elementId, callfrom, smonth, syear){
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','teacher-class-management-content'),
		dataType : 'json',
		data : JSON.stringify(getRequestForTeacherPerformance(formId, callfrom, smonth, syear)),
		success : function(data) {
			console.log(data)
			
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				if(callfrom=='myperformance'){
					if(data.studentAssigedReports.length>0){
						getHtmlTeacherPerformance(data.studentAssigedReports[0]);
					}
					
				}else{
					if(data.studentAssigedReports.length>0){
						getHtmlTeacherSalary(data.studentAssigedReports[0]);
					}
				}
			}
			$("#commonloaderIdNewLoaderDefaultShow").addClass("hide-loader");
			return false;
		},
		error : function(e) {
			if (checkonlineOfflineStatus()) {
				return;
			}
			$("#commonloaderIdNewLoaderDefaultShow").addClass("hide-loader");
		}
	});
}

function getRequestForTeacherPerformance(formId, callfrom, smonth, syear){
	var studentAssignRequest = {};
	studentAssignRequest['userId'] = USER_ID;
	studentAssignRequest['schoolId'] = SCHOOL_ID;
	studentAssignRequest['smonth'] = smonth;
	studentAssignRequest['syear'] = syear;
	return studentAssignRequest;
}

function getHtmlTeacherPerformance(teacherReports){
	var todayWrokPercent = teacherReports.todayPercentHrs;
	var cclassCountPl=0;
	var cclassCountGl=0;
	var completedClasses = teacherReports.completedClasses;
	if(completedClasses.length>0){
		for (let c = 0; c < completedClasses.length; c++) {
			const cclass = completedClasses[c];
			if(cclass.learningProgram=='GL'){
				cclassCountGl+=cclass.count;
			}
			if(cclass.learningProgram=='PL'){
				cclassCountPl+=cclass.count;
			}
		}
	}
	$("#cclassCountPlGl").text(cclassCountPl+cclassCountGl);
	$("#cclassCountPl").text(cclassCountPl);
	$("#cclassCountGl").text(cclassCountGl);
	
	$(".performanceAgreedHrs").text(teacherReports.projectAvgHours);
	$(".performanceAcceptCompleteHrs").text(teacherReports.projectAttendHoursDay);
	$(".performancePendingHrs").text(teacherReports.pendingProjectAttendHoursDay);

	$(".averageAgreedHrs").text(teacherReports.averageHrs);
	$(".averageAcceptCompleteHrs").text(teacherReports.tillAverageClass);
	$(".averagePendingHrs").text(teacherReports.pendingAverageHrs);

	$(".projectHoursPercent").text(teacherReports.projectHoursPercent+"%");

	var progressDiv ="<div class=\"progress-bar bg-info\" role=\"progressbar\" aria-valuenow=\""+teacherReports.projectHoursPercent+"\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: "+teacherReports.projectHoursPercent+"%;\"></div>" ;
	$(".progressbar").html(progressDiv);

	var completeDiv="";
	completeDiv+="<div class=\"widget-title\">You have completed <span class=\"text-success bold\"> "+teacherReports.projectHoursPercent+"%</span>&nbsp;of total hours for {startMonth}</div>";
	completeDiv+="<div class=\"widget-title\">You have completed <span class=\"text-warning bold\">"+teacherReports.projectHoursPendingPercent+"%</span>&nbsp;"+(teacherReports.averageCompletedStatus=='Y'?'more':'less')+" hours than agreed hours for {startMonth}</div>";
	completeDiv+="<div class=\"widget-title\">Your daily average is <span class=\"text-success bold\">"+teacherReports.requiredPerDayPercent+"%</span>&nbsp;"+(teacherReports.averageCompletedStatus=='Y'?'higher':'lower')+" than the agreed average</div>";
	if(teacherReports.averageCompletedStatus=='N'){
		completeDiv+="<div class=\"widget-title\">You need <span class=\"text-warning bold\">"+teacherReports.averageRequiredHrsForComplete+"</span> hours per day now to match the agreed average</div>";
	}
	if(teacherReports.averageCompletedStatus=='Y'){
		completeDiv+="<div class=\"widget-title\">You are already <span class=\"text-success bold\">"+teacherReports.averageRequiredHrsForComplete+"</span> hours per day ahead of the agreed average</div>";
	}											
	$(".completedPerformance").html(completeDiv);

	getPerformanceChart(teacherReports);
}

function getPerformanceChart(teacherReports){
var insd=1;
var attePer=[];
var attePerDay=[];
for (let at = 0; at < teacherReports.attendanceList.length; at++) {
	const attList1 = teacherReports.attendanceList[at];
	var dataPer={};
	dataPer['x']='Category '+insd;
	dataPer['y']=attList1.currenthrsPercent;
	if( parseInt(attList1.currenthrsPercent)>79){
		dataPer['fillColor']='#52ebb6';
		dataPer['strokeColor']='#52ebb6';
	
	}else if(parseInt(attList1.currenthrsPercent)>59 && parseInt(attList1.currenthrsPercent)<79){
		dataPer['fillColor']='#266dc4';
		dataPer['strokeColor']='#266dc4';
	}else{
		dataPer['fillColor']='#ffaf1a';
		dataPer['strokeColor']='#ffaf1a';
	}
	attePer.push(dataPer);
	attePerDay.push('"'+attList1.day+'"')
	insd=insd+1;
}



	var options = {
        series: [{
          	name: 'Working Hours',
          	data: attePer//[2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2, 10.0, 11,14]
        }],
        chart: {
          	height: 350,
          	type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
             	position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: attePerDay,//["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
		  //categories:["1","2","3"],
          position: 'bottom',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: true,
          }
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            }
          }
        
        },
        // title: {
        //   text: 'Monthly Inflation in Argentina, 2002',
        //   floating: true,
        //   offsetY: 330,
        //   align: 'bottom',
        //   style: {
        //     color: '#444'
        //   }
        // }
        };

        var chart = new ApexCharts(document.querySelector("#chart-combined"), options);
        chart.render();
		chart.update();
}


function getHtmlTeacherSalary(teacherReports){
	var startMonthDate = $("#monthwise option:selected").text()+" "+$("#yearwise option:selected").text()
	$(".salaryTeacherName").text(teacherReports.teacherName);
	$(".salarycityname").text(teacherReports.cityname);
	$(".salarycountryname").text(teacherReports.countryname);
	$(".salaryoffset").text(teacherReports.offset);
	var studentGradesCount=0;
	var rclassCount=0;
	var cclassCount=0;
	var studentGlCount=0;
	var studentPlCount=0;
	for (let ti = 0; ti < teacherReports.gradeStudentCount.length; ti++) {
		const gradeStudent = teacherReports.gradeStudentCount[ti];
		studentGradesCount+=gradeStudent.studentCount;
	}
	for (let ti = 0; ti < teacherReports.recommendedClasses.length; ti++) {
		const rclass = teacherReports.recommendedClasses[ti];
		rclassCount+=rclass.count;
	}
	for (let ti = 0; ti < teacherReports.completedClasses.length; ti++) {
		const cclass = teacherReports.completedClasses[ti];
		cclassCount+=cclass.count;
	}
	for (let ti = 0; ti < teacherReports.learningProgamCount.length; ti++) {
		const lProgam = teacherReports.completedClasses[ti];
		if(lProgam.learningProgramName == 'GL'){
			studentGlCount+=(lProgam.activeCount+lProgam.inactiveCount);
		}
		if(lProgam.learningProgramName == 'PL'){
			studentPlCount+=(lProgam.activeCount+lProgam.inactiveCount);
		}
	}

	var empBasicHtml="";
	empBasicHtml+="<tr><td>Employee Status</td><td class=\"text-dark\">"+teacherReports.employeeType+"</td></tr>";
	empBasicHtml+="<tr><td>Employee Code</td><td class=\"text-dark\">"+teacherReports.applicationno+"</td></tr>";
	empBasicHtml+="<tr><td>Joining Date</td><td class=\"text-dark\">"+teacherReports.joindate+"</td></tr>";
	if(teacherReports.firstMeeting==''){
		empBasicHtml+="<tr><td>First meeting </td><td class=\"text-dark\">"+teacherReports.firstMeeting+"</td></tr>";
	}
	empBasicHtml+="<tr><td>Assigned Mode</td><td class=\"text-dark\">";
	for (let ti = 0; ti < teacherReports.learningProgamCount.length; ti++) {
		var lProgam = teacherReports.learningProgamCount[ti];
		if(ti>0){
			empBasicHtml+=" | "+(lProgam.learningProgramName == 'PL'?'1:1':'Group')
		}else{
			empBasicHtml+=(lProgam.learningProgramName == 'PL'?'1:1':'Group')
		}
	}
	empBasicHtml+="</td></tr>";
	empBasicHtml+="<tr><td>Assigned Grades</td><td class=\"text-dark\">";
	for (let ti = 0; ti < teacherReports.gradeStudentCount.length; ti++) {
		var gradeStudent = teacherReports.gradeStudentCount[ti];
		if(ti>0){
			empBasicHtml+=" | "+(gradeStudent.gradeNameShort)
		}else{
			empBasicHtml+=(gradeStudent.gradeNameShort)
		}
	}
	empBasicHtml+="</td></tr>";
	empBasicHtml+="<tr><td>Agreed Working Hours</td><td class=\"text-dark\">"+teacherReports.workingHours+"</td></tr>";	
	$("#salary_teacher_basic").html(empBasicHtml);

	var salCalHtml="";
	salCalHtml+="<div class=\"p-2 text-white\">Salary Calculation : <b>"+startMonthDate+"</b></div>";
	salCalHtml+="<table class=\"table table-bordered nowrap row-height-small blue-border mb-1 bg-white\">";
	salCalHtml+="<tbody>"
	salCalHtml+="<tr><td>Salary Agreed</td><td class=\"bold\" style=\"width:120px;color:#3f6feb\">"+teacherReports.payout.agreedPayout+"</td></tr>";
	salCalHtml+="</tbody></table>";
	salCalHtml+="<table class=\"table table-bordered nowrap row-height-small blue-border mb-0 bg-white\">";
	salCalHtml+="<tbody>";
	salCalHtml+="<tr><td>Salary Till Now</td><td class=\"bold text-dark\" style=\"width:120px\">"+teacherReports.currentsal+"</td></tr>";
	salCalHtml+="</tbody></table>";
	salCalHtml+="<table class=\"table table-bordered nowrap row-height-small blue-border mb-0 bg-white\">";
	salCalHtml+="<tbody><tr><td>Total Accepted Hours till now<br/>(Class+Admin) </td><td class=\"bold text-success\" style=\"width:120px\">"+teacherReports.total_accept_hours+"</td></tr>";
	salCalHtml+="</tbody></table>";
	$(".salary_calculation").html(salCalHtml);

var class_hrsHtml="";

class_hrsHtml+="<div class=\"p-2 text-white\">Classes & Hours Calculation: <b>"+startMonthDate+"</b></div>"
class_hrsHtml+="<table class=\"table table-bordered nowrap row-height-small blue-border mb-1 bg-white\">"
class_hrsHtml+="<tbody>";
class_hrsHtml+="<tr style=\"background:#cbe0f6;\">";
class_hrsHtml+="<td></td>";
class_hrsHtml+="<td><b>Working Hours<br/>Submitted</b></td>";
class_hrsHtml+="<td><b>Working Hours<br/>Deducted after review</b></td>";
class_hrsHtml+="<td><b>Working Hours<br/>Accepted</b></td>";
class_hrsHtml+="</tr>";
class_hrsHtml+="<tr>";
class_hrsHtml+="<td><b>Group</b></td> ";
class_hrsHtml+="<td class=\"text-center\">"+teacherReports.total_review_batch_hours+"</td> ";
class_hrsHtml+="<td class=\"bold text-center\">"+teacherReports.total_minus_batch_hours+"</td> ";
class_hrsHtml+="<td class=\"text-center\">"+teacherReports.total_accept_batch_hours+"</td> ";
class_hrsHtml+="</tr> ";
class_hrsHtml+="<tr> ";
class_hrsHtml+="<td><b>1:1</b></td> ";
class_hrsHtml+="<td class=\"text-center\">"+teacherReports.total_review_one_hours+"</td> ";
class_hrsHtml+="<td class=\"text-center bold\">"+teacherReports.total_minus_one_hours+"</td> ";
class_hrsHtml+="<td  class=\"text-center\">"+teacherReports.total_accept_one_hours+"</td> ";
class_hrsHtml+="</tr> ";
class_hrsHtml+="<tr> ";
class_hrsHtml+="<td><b>Admin</b></td> ";
class_hrsHtml+="<td  class=\"text-center\">"+teacherReports.total_review_admin_hours+"</td> ";
class_hrsHtml+="<td class=\"text-center bold\">"+teacherReports.total_minus_admin_hours+"</td> ";
class_hrsHtml+="<td class=\"text-center\">"+teacherReports.total_accept_admin_hours+"</td> ";
class_hrsHtml+="</tr> ";
class_hrsHtml+="<tr> ";
class_hrsHtml+="<td><b>Total</b></td> ";
class_hrsHtml+="<td class=\"text-center\">"+teacherReports.total_review_hours+"</td> ";
class_hrsHtml+="<td class=\"text-center\">"+teacherReports.total_minus_hours+"</td> ";
class_hrsHtml+="<td class=\"text-center text-success bold\">"+teacherReports.total_accept_hours+"</td> ";
class_hrsHtml+="</tr> ";
class_hrsHtml+="</tbody> ";
class_hrsHtml+="</table> ";

$(".class_hrs_calculation").html(class_hrsHtml);

var attandHtml="";
if(teacherReports.attendanceList.length>0){
	var taIndex=1;
	for (let ta = 0; ta < teacherReports.attendanceList.length; ta++) {
		const attList = teacherReports.attendanceList[ta];
		var attendDetails = attList.attendDetails;
		attandHtml+="<tr>";
		attandHtml+="<td class=\"text-dark\">"+taIndex+"</td>";
		attandHtml+="<td class=\"text-dark text-left\">"+attList.dayname+", "+attList.attendanceDate+"</td>";
		attandHtml+="<td class=\"text-dark\">";
		if (attList.presentInt==0){
			attandHtml+="-";
		}else if (attList.presentInt>0){
			var strdtd = attList.attendDate.split("-")[2]+"-"+attList.attendDate.split("-")[1]+"-"+attList.attendDate.split("-")[0];
			var onCli="getTeacherClassReviewById('"+teacherReports.userId+"', '','class-salary','"+strdtd+"','"+strdtd+"','0,1');";
			attandHtml+="<a href=\"javascript:void(0)\" class=\"font-weight-bold\" onClick=\""+onCli+"\"> "+attList.presentInt+"</a>";
		}
		attandHtml+="</td>";
		attandHtml+="<td class=\"text-dark\">";
		if(attList.attendanceReviewDuration==''){
			attandHtml+="-";
		}else {
			attandHtml+=attList.attendanceReviewDuration;
		}
		attandHtml+="</td>";
		attandHtml+="<td class=\"text-dark\">";
		if(attList.attendanceMinusDuration==''){
			attandHtml+="-";
		}else {
			attandHtml+=attList.attendanceMinusDuration;
		}
		attandHtml+="</td>";	
		attandHtml+="<td class=\"text-dark\">";
		if(attList.attendanceDuration=='' && attList.attendanceReviewDuration!=''){
			attandHtml+="<span style=\"font-size:10px;background:yellow\">Under Review</span>";
		}else if(attList.attendanceReviewDuration!=''){
			attandHtml+=attList.attendanceDuration;
		}else {
			attandHtml+="-";
		}
		attandHtml+="</td>";	
		attandHtml+="<td class="+((attList.attendance=='A')?'text-danger':'text-success')+">"+attList.attendance+"</td>";
		// attandHtml+="<td>";
		// var onclpopatt = "callAddAttendanceModal('"+attList.attendDate+"','"+attList.attendanceDate+"','"+teacherReports.userId+"')";
		// attandHtml+="<a href=\"javascript:void(0);\" onClick=\""+onclpopatt+"\"><i class=\"fa fa-fw\" aria-hidden=\"true\"></i></a>";
		// attandHtml+="</td>";
		attandHtml+="</tr>";
	}
	$("#teacher_attendance").html(attandHtml);
}
var attandHtmlFoot="";
		attandHtmlFoot+="<tr>"
		attandHtmlFoot+="<th></th><th></th><th></th><th>Submitted Hours</th><th>Deducted Hours</th><th>Accepted Hours</th><th></th><th></th></tr>";
		attandHtmlFoot+="<tr><td></td><td></td><td></td>";
		attandHtmlFoot+="<td>"+teacherReports.total_review_hours+"</td>";
		attandHtmlFoot+="<td>"+teacherReports.total_minus_hours+"</td>";
		attandHtmlFoot+="<td><b>"+teacherReports.total_accept_hours+"</td>";
		attandHtmlFoot+="<td></td><td></td></tr>";
	$("#teacher_attendance_footer").html(attandHtmlFoot);

}


