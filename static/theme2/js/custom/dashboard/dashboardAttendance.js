$(document).ready(function() {
	console.log('inside dashboardAttendance.js');
});

function callStudentBatchAttendance(formId, userId,bindElementDayWise ) {
	console.log("callStudentBatchAttendance", userId);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'student-batch-attendance-list'),
		data : JSON.stringify(getRequestForStudentBatchAttendance(formId, userId)),
		dataType : 'html',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$("#stuBatchAttendence").html('');
				var month = [];
				var present =[];
				var apsent=[];
				var leave=[];
				var attendPer=[];
				var attendp=0;
				var attenda=0;
				var attendl=0;
				console.log(data['attendance']);
				
				if(data['attendance']!=null){
					
					var attendTable = '<table class="fixedtable month-name" >';
					attendTable = attendTable + '<thead class="student-h-scroll-view"><tr>';
					var headerWise = data['attendance']['header'];
					for(m=0;m<headerWise.length;m++){
						attendTable = attendTable + '<th class="headcol"><div class="h_scroll"><img src="'+PATH_FOLDER_IMAGE2+'h_scroll.png"></div></th>';
						var headerDetails = headerWise[m]['details'];
						for(md=0;md<headerDetails.length;md++){
							attendTable = attendTable + '<th class="headcol">'+headerDetails[md]['day']+'</th>';
						}
					}
					attendTable = attendTable + '</tr></thead>';
					attendTable = attendTable + '<tbody><tr>';
					var monthWise = data['attendance']['monthWise'];
					//monthWise = sortJSON(monthWise,'day', '123');
					for(m=0;m<monthWise.length;m++){
						var mnt =  ""+monthWise[m]["entityName"]+"";
						month.push(mnt);
						present.push(monthWise[m]['presentInt']);
						apsent.push(monthWise[m]['apsentInt']);
						leave.push(monthWise[m]['leaveInt']);
						attendp = attendp+monthWise[m]['presentInt'];
						attenda = attenda+monthWise[m]['apsentInt'];
						attendl = attendl+monthWise[m]['leaveInt'];

						attendTable = attendTable + '<th class="headcol" style="padding:0px !important; text-align:center">'+monthWise[m]['entityName']+'</th>';
						var monthDetails = monthWise[m]['details'];
						for(md=0;md<monthDetails.length;md++){
							attendTable = attendTable + '<td class="long"><div class="text-center jvectormap-legend-cnt-v ">';
							if(monthDetails[md]['attendance']=='P' || monthDetails[md]['attendance']=='M'){
								attendTable = attendTable + "<a href=\"javascript:void(0);\" onClick=\"callStudentBatchAttendanceDateWise('','"+bindElementDayWise+"','"+monthDetails[md]['attendanceDate']+"','"+userId+"','"+monthWise[m]['entityRole']+"','"+monthWise[m]['subjectId']+"');\" class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"><b>"+monthDetails[md]['attendance']+"</b></a>";
								//attendTable = attendTable + "<span class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"> "+monthDetails[md]['attendance']+"</span>";
							}else{
								attendTable = attendTable + "<span class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"> "+monthDetails[md]['attendance']+"</span>";
							}
							attendTable = attendTable + '</div></td>';
						}
						attendTable = attendTable + '</tr><tr>';
					}
					attendTable = attendTable + '</tbody>';
					attendTable = attendTable +'</table>';
				}

				
				$("#stuBatchAttendence").html(attendTable);
				getLinChartAttendance(month, present, apsent, leave, "chart-teacher-attendance");
				attendPer.push(attendp);
				attendPer.push(attenda);
				attendPer.push(attendl);
				getAttendPercentWise(attendPer, "chartPer");
			}
		},
		error : function(e) {
			console.log(e);
		}
	});
}
function getRequestForStudentBatchAttendance(formId, userId) {
	var request = {};
	var authentication = {};
	var attendanceFilterRequest = {};
	attendanceFilterRequest['userId'] =userId;
	attendanceFilterRequest['schoolId'] = SCHOOL_ID;
	request['attendanceFilterRequest'] = attendanceFilterRequest;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	return request;
}


function getHash() {
	return 'ajslfkjalksdf'
}

function getLinChartAttendance(month, present, apsent, leave, chartId){

	var columnChart = {
			series: [
			   {
			   name: 'Present',
			   data: present
			 },
			 {
			   name: 'Absent',
			   data: apsent
			  }, 
			 {
			   name: 'Leave',
			   data: leave
			 }
		  ],
			chart: {
			type: 'bar',
			height: 350
		  },
		  colors: ['#3ac47d', '#ff4560', '#f7ab19'],
		  plotOptions: {
			bar: {
			  horizontal: false,
			  columnWidth: '55%',
			  endingShape: 'rounded'
			},
		  },
  
		  dataLabels: {
			enabled: false,
		   },
		  stroke: {
			show: true,
			width: 2,
			colors: ['transparent']
		  },
		  xaxis: {
			categories: month,
		  },
		  yaxis: {
			title:false,
		  },
		  fill: {
			opacity: 1
		  },
		  tooltip: {
			y: {
			  formatter: function (val) {
				return val 
			  }
			}
		  }
		  };
  
		  var chart = new ApexCharts(document.querySelector("#"+chartId), columnChart);
		  chart.render();
  }

  function getAttendPercentWise(presentPer, chartId){
	var options = {
			series: presentPer,
			chart: {
			 height:250,
			type: 'donut',
		  },
		  labels: ["Present","Absent", "Leave"],
		  colors: ['#3ac47d', '#ff4560', '#f7ab19'],
		  responsive: [{
			breakpoint: 480,
			options: {
			  chart: {
				width: 300,
				height:250
			  },
			  legend: {
				show: false,
				position: 'bottom'
			  }
			}
		  }]
		  };
  
		  var chart = new ApexCharts(document.querySelector("#"+chartId), options);
		  chart.render();
  }

  function sortJSON(arr, key, way) {
    return arr.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        if (way === '123') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
        if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
}

function callStudentBatchAttendanceDateWise(formId, bindElementDayWise ,todaydate, userId, userRole, subjectId) {
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'student-batch-attendance-daywise'),
			data : JSON.stringify(getRequestForAttendanceFilterDate(formId,todaydate, userId, userRole, subjectId)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					$("#"+bindElementDayWise).html('');
					console.log(data['attendance']);
					var monthWise = data['attendance']['monthWise'];
					monthWise = sortJSON(monthWise,'day', '123');
					if(monthWise!=null){
						var attendTable = '<table class="table table-striped table-bordered">';
						attendTable = attendTable + '<thead><tr>';
						attendTable = attendTable + '<th>S.N.</th>';
						attendTable = attendTable + '<th>Course Name</th>';
						attendTable = attendTable + '<th>Class with</th>';
						attendTable = attendTable + '<th>Joining Date</th>';
						attendTable = attendTable + '<th>Joining Time</th>';
						attendTable = attendTable + '<th>Leaving Time</th>';
						//attendTable = attendTable + '<th>Meeting Result</th>';
						attendTable = attendTable + '<th>Total Duration<br/>HH:MM:SS</th>';
						attendTable = attendTable + '</tr></thead><tbody >';
						if(monthWise!=null){
							for(ms=0;ms<monthWise.length;ms++){
								var monthDetails = monthWise[ms]['details'];
								var inc=1;
								if(monthDetails!=null){
									for(mds=0;mds<monthDetails.length;mds++){
										attendTable = attendTable + '<tr>'
										attendTable = attendTable + '<td>'+inc+'</td>';
										attendTable = attendTable + '<td>'+monthDetails[mds]['attendance']+'</td>';
										attendTable = attendTable + '<td>'+monthDetails[mds]['meetingPerson']+'</td>';
										attendTable = attendTable + '<td>'+monthDetails[mds]['attendanceDate']+'<br/>('+monthDetails[mds]['timezone']+')</td>';
										attendTable = attendTable + '<td>'+monthDetails[mds]['attendanceJoinTime']+'</td>';
										if(monthDetails[mds]['attendanceLeaveTime']!=undefined){
											attendTable = attendTable + '<td>'+monthDetails[mds]['attendanceLeaveTime']+'</td>';
										}else{
											attendTable = attendTable + '<td>-</td>';
										}
										//attendTable = attendTable + '<td>'+monthDetails[mds]['meetingResult']+'</td>';
										attendTable = attendTable + '<td>'+monthDetails[mds]['attendanceDuration']+'</td>';
										attendTable = attendTable + '</tr>';
										inc=inc+1;
									}
								}
							}
						}
						var tad='<tr><td colspan="6" align="right"><b>Total</b></td><td><b>'+data['attendance']['totalDayAttendanceDuration']+'</b></td></tr>';
						
						attendTable = attendTable +tad+ '</tbody> </table>';
					}
					
					$("#"+bindElementDayWise).html(attendTable);
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}


function getRequestForAttendanceFilterDate(formId, todaydate, userId, userRole, subjectId) {
	var request = {};
	var authentication = {};
	var requestData = {};
	var attendanceFilterRequest = {};
	attendanceFilterRequest['attendanceStartDate']=todaydate;
	attendanceFilterRequest['attendanceEndDate']=todaydate;
	attendanceFilterRequest['attendanceTodayDate']=todaydate;
	attendanceFilterRequest['attendaceFor']=userRole;
	attendanceFilterRequest['subjectId']=subjectId;
	
	attendanceFilterRequest['userId'] =userId;
	attendanceFilterRequest['schoolId'] = SCHOOL_ID;
	// requestData['attendanceFilterRequest'] = attendanceFilterRequest;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['data'] = attendanceFilterRequest;
	return request;
}

function callBatchAttendanceFilter(formId, bindElementid, userId, selectDate, attendaceFor, dateType, callfrom, lmode, moduleId, bindElementDayWise) {
	var subjectWise = "N";
	if($("#"+formId+" #subjectWiseCheck").is(":checked")){
		subjectWise ="Y";
	}
	if(callfrom=="byteacher"){
		subjectWise ="Y";
	}
	customLoader(true);
	checkTextBox(formId);
	$.ajax({
			type : "POST",
			global:false,
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'batch-attendance-by-filter'),
			data : JSON.stringify(getRequestForBatchAttendanceFilter(formId, userId, selectDate, attendaceFor, dateType, callfrom, lmode)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				customLoader(false);
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					$("#"+bindElementid).html('');
					var attendTable='';
					if(data['attendance']!=null){
						attendTable = allAttendance(data['attendance'], subjectWise, lmode, moduleId,bindElementDayWise);
					}
					$('#attendanceAdvanceSearch').modal('hide');
					$('#teacherAdvanceSearch').modal('hide');
					$("#"+bindElementid).html(attendTable);
				}
			},
				error : function(e) {
					if (checkonlineOfflineStatus()) {
						return;
					}
					console.log(e);
					customLoader(false);
				}
			
			});
}
function getRequestForBatchAttendanceFilter(formId, userId, selectDate, attendaceFor, dateType, callfrom, lmode) {
	var request = {};
	var authentication = {};
	//var requestData = {};
	var attendanceFilterRequest = {};
	// if($("#seletDateType").val()!=''){
	// 	dateType = $("#seletDateType").val();
	// }
	if(selectDate!=''){
		attendanceFilterRequest['attendanceTodayDate'] =selectDate;
	}
	if(callfrom=='byteacher'){
		attendanceFilterRequest['attendaceFor']="STUDENT";
		attendanceFilterRequest['subjectWise']='Y';
		attendanceFilterRequest['learningmode']=lmode;
		var standards = $("#"+formId+" #standardId").val();
		attendanceFilterRequest['standardIdString']=standards.toString();

		var batchs = $("#"+formId+" #batchId").val();
		attendanceFilterRequest['batchIdString']=batchs.toString();
		
		var subjectIdss = $("#"+formId+" #subjectIds").val();
		attendanceFilterRequest['subjectIdString']=subjectIdss.toString();
	
		var studentIds = $("#"+formId+" #studentId").val();
		attendanceFilterRequest['entityIdString']=studentIds.toString();

		var enrollType = $("#"+formId+" #enrollType").val();
		attendanceFilterRequest['enrollType']=enrollType.toString();
	
		var lmsProvider = "37,38";//$("#lmsPlatform").val();
		if(enrollType=='BATCH'){
			lmsProvider='38';
		}else if(enrollType=='ONE_TO_ONE'){
			lmsProvider='37,39';
		}else if(enrollType=='SSP'){
			lmsProvider='37,40';
		}else if(enrollType=='SCHOLARSHIP'){
			lmsProvider='37,39,40';
		}
		lmsProvider = lmsProvider.toString();
		attendanceFilterRequest['lmsProvider']=lmsProvider.toString();
	
		if($("#"+formId+" #subjectWiseCheck").is(":checked")){
			attendanceFilterRequest['subjectWise']='Y';
		}else{
			attendanceFilterRequest['subjectWise']='N';
		}

	}else{
		attendanceFilterRequest['attendaceFor']=attendaceFor.toString();
	
		var standards = $("#"+formId+" #standardId").val();
		attendanceFilterRequest['standardIdString']=standards.toString();
	
		var batchs = $("#"+formId+" #batchId").val();
		attendanceFilterRequest['batchIdString']=batchs.toString();
		
		var subjectIdss = $("#"+formId+" #subjectIds").val();
		attendanceFilterRequest['subjectIdString']=subjectIdss.toString();
	
		var studentIds = $("#"+formId+" #studentId").val();
		attendanceFilterRequest['entityIdString']=studentIds.toString();
	
		var enrollType = $("#"+formId+" #enrollType").val();
		attendanceFilterRequest['enrollType']=enrollType.toString();
	
		var lmsProvider = $("#"+formId+" #lmsPlatform").val();
		attendanceFilterRequest['lmsProvider']=lmsProvider.toString();
	
		if($("#"+formId+" #subjectWiseCheck").is(":checked")){
			attendanceFilterRequest['subjectWise']='Y';
		}else{
			attendanceFilterRequest['subjectWise']='N';
		}
	}
	attendanceFilterRequest['callfrom']=callfrom;
	attendanceFilterRequest['month'] = $("#"+formId+" #monthWise").val();
	attendanceFilterRequest['year'] = $("#"+formId+" #yearWise").val();

	attendanceFilterRequest['selectDateType'] =dateType;
	attendanceFilterRequest['userId'] =userId;
	attendanceFilterRequest['schoolId'] = SCHOOL_ID;
	// request['attendanceFilterRequest'] = attendanceFilterRequest;
	//// requestData['attendanceFilterRequest'] = attendanceFilterRequest;

	authentication['hash'] = getHash();
	authentication['schoolId'] = SCHOOL_ID;
	authentication['schoolUUID'] = SCHOOL_UUID;
	request['authentication'] = authentication;
	request['data'] = attendanceFilterRequest;
	
	return request;
}


function allAttendance(attendance, subjectWise, lmode, moduleId,bindElementDayWise)
{
		var attendTable = '<table class="fixedtable month-name" >';
		$('.month-name').html(attendance['entityName']);
		$('#nextDate').val(attendance['nextDate']);
		$('#prevDate').val(attendance['preDate']);
		$('#seletDateType').val(attendance['dataType']);
		$('#dataFrom').val(attendance['dataFrom']);
		
		attendTable = attendTable + '<thead class="admin-h-scroll-view"><tr>';
		var headerWise = attendance['header'];
		for(m=0;m<headerWise.length;m++){
			attendTable = attendTable + '<th class="headcol"><div class="h_scroll"><img src="'+PATH_FOLDER_IMAGE2+'h_scroll.png"></div></th>';
			var headerDetails = headerWise[m]['details'];
			for(md=0;md<headerDetails.length;md++){
				attendTable = attendTable + '<th class="headcol"><div><b class="full">'+headerDetails[md]['weekday']+'</b><b class="full">'+headerDetails[md]['day']+'</b></div></th>';
			}
		}
		attendTable = attendTable + '</tr></thead>';
		attendTable = attendTable + '<tbody><tr>';
		var monthWise = attendance['monthWise'];
		if(monthWise!=null){
			attendTable += getRowAttendance(monthWise, subjectWise, lmode, moduleId, bindElementDayWise);
			attendTable = attendTable + '</tbody>';
		}	
		attendTable = attendTable +'</table>';
	return attendTable;
}

function getRowAttendance(monthWise, subjectWise, lmode, moduleId, bindElementDayWise)
{
	var attendTable='';
	for(m=0;m<monthWise.length;m++){
		if(lmode=='one-to-one'){
			if(monthWise[m]['batchName']==''){
				var mnt =  ""+monthWise[m]["entityName"]+"";
				var url='/dashboard/get-student-attendance?moduleId='+moduleId+'&userId='+monthWise[m]['entityId']
				var attendanceLink = '<a target="_bleank" href="javaScript:void(0)" onclick="getAsPost('+url+')">'+monthWise[m]['entityName']+'</a>'
				var subjectName = monthWise[m]['subjectName']==null?'':monthWise[m]['subjectName'];
				attendTable = attendTable + '<th class="headcol" style="padding:0px !important; text-align:center;min-width:200px;">'+'<table>'+'<tr>'+ '<td>'+attendanceLink + '</br>'+ monthWise[m]['batchName']+'</br>'+subjectName+'</td>'+'</table>'+'</th>';
				var monthDetails = monthWise[m]['details'];
				for(md=0;md<monthDetails.length;md++){
					attendTable = attendTable + '<td class="long">';
					if(subjectWise=='Y'){
						attendTable = attendTable + '<div class="text-center jvectormap-legend-cnt-v ">';
						if(monthDetails[md]['attendance']=='P'  || monthDetails[md]['attendance']=='M'){
							attendTable = attendTable + "<a href=\"javascript:void(0);\" onClick=\"callStudentBatchAttendanceDateWise('','"+bindElementDayWise+"','"+monthDetails[md]['attendanceDate']+"','"+monthWise[m]['entityId']+"','"+monthWise[m]['entityRole']+"','"+monthWise[m]['subjectId']+"');\" class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"><span data-tooltip=\"Join Time: "+monthDetails[md]['attendanceJoinTime']+"  Leave Time: "+monthDetails[md]['attendanceLeaveTime']+" Duration: "+monthDetails[md]['attendanceDuration']+" &nbsp; Total Duration: "+monthDetails[md]['totalAttendanceDuration']+"\" data-tooltip-position=\"left\">"+monthDetails[md]['attendance']+"</span></a>";
						}else{
							attendTable = attendTable + "<span class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"> "+monthDetails[md]['attendance']+"</span>";
						}
						attendTable = attendTable + '</div>';
					}else{
						if(monthDetails[md]['attendance']=='P'  || monthDetails[md]['attendance']=='M'){
							attendTable = attendTable + monthDetails[md]['totalAttendanceDuration'];
						}else{
							attendTable = attendTable + '-';
						}
					}
					attendTable = attendTable + '</td>';
				}
				attendTable = attendTable + '</tr><tr>';
			}
		}else if(lmode=='group'){
			if(monthWise[m]['batchName']!=''){
				var mnt =  ""+monthWise[m]["entityName"]+"";
				var url='/dashboard/get-student-attendance?moduleId='+moduleId+'&userId='+monthWise[m]['entityId']
				var attendanceLink = '<a target="_bleank"  href="javaScript:void(0)" onclick="getAsPost('+url+')">'+monthWise[m]['entityName']+'</a>'
				var subjectName = monthWise[m]['subjectName']==null?'':monthWise[m]['subjectName'];
				attendTable = attendTable + '<th class="headcol" style="padding:0px !important; text-align:center;min-width:200px;">'+'<table>'+'<tr>'+ '<td>'+attendanceLink + '</br>'+ monthWise[m]['batchName']+'</br>'+subjectName+'</td>'+'</table>'+'</th>';
				var monthDetails = monthWise[m]['details'];
				for(md=0;md<monthDetails.length;md++){
					attendTable = attendTable + '<td class="long">';
					if(subjectWise=='Y'){
						attendTable = attendTable + '<div class="text-center jvectormap-legend-cnt-v ">';
						if(monthDetails[md]['attendance']=='P'  || monthDetails[md]['attendance']=='M'){
							attendTable = attendTable + "<a href=\"javascript:void(0);\" onClick=\"callStudentBatchAttendanceDateWise('','"+bindElementDayWise+"','"+monthDetails[md]['attendanceDate']+"','"+monthWise[m]['entityId']+"','"+monthWise[m]['entityRole']+"','"+monthWise[m]['subjectId']+"');\" class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"><span data-tooltip=\"Join Time: "+monthDetails[md]['attendanceJoinTime']+"  Leave Time: "+monthDetails[md]['attendanceLeaveTime']+" Duration: "+monthDetails[md]['attendanceDuration']+" &nbsp; Total Duration: "+monthDetails[md]['totalAttendanceDuration']+"\" data-tooltip-position=\"left\">"+monthDetails[md]['attendance']+"</span></a>";
						}else{
							attendTable = attendTable + "<span class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"> "+monthDetails[md]['attendance']+"</span>";
						}
						attendTable = attendTable + '</div>';
					}else{
						if(monthDetails[md]['attendance']=='P'  || monthDetails[md]['attendance']=='M'){
							attendTable = attendTable + monthDetails[md]['totalAttendanceDuration'];
						}else{
							attendTable = attendTable + '-';
						}
					}
					attendTable = attendTable + '</td>';
				}
				attendTable = attendTable + '</tr><tr>';
			}
		}else{
				var mnt =  ""+monthWise[m]["entityName"]+"";
				var url='/dashboard/get-student-attendance?moduleId='+moduleId+'&userId='+monthWise[m]['entityId']
				var attendanceLink = '<a target="_bleank"  href="javaScript:void(0)" onclick="getAsPost('+url+')">'+monthWise[m]['entityName']+'</a>'
				var subjectName = monthWise[m]['subjectName']==null?'':monthWise[m]['subjectName'];
				attendTable = attendTable + '<th class="headcol" style="padding:0px !important; text-align:center;min-width:200px;">'+'<table>'+'<tr>'+ '<td>'+attendanceLink + '</br>'+ monthWise[m]['batchName']+'</br>'+subjectName+'</td>'+'</table>'+'</th>';
				var monthDetails = monthWise[m]['details'];
				for(md=0;md<monthDetails.length;md++){
					attendTable = attendTable + '<td class="long">';
					if(subjectWise=='Y'){
						attendTable = attendTable + '<div class="text-center jvectormap-legend-cnt-v ">';
						if(monthDetails[md]['attendance']=='P'  || monthDetails[md]['attendance']=='M'){
							attendTable = attendTable + "<a href=\"javascript:void(0);\" onClick=\"callStudentBatchAttendanceDateWise('','"+bindElementDayWise+"','"+monthDetails[md]['attendanceDate']+"','"+monthWise[m]['entityId']+"','"+monthWise[m]['entityRole']+"','"+monthWise[m]['subjectId']+"');\" class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"><span data-tooltip=\"Join Time: "+monthDetails[md]['attendanceJoinTime']+"  Leave Time: "+monthDetails[md]['attendanceLeaveTime']+" Duration: "+monthDetails[md]['attendanceDuration']+" &nbsp; Total Duration: "+monthDetails[md]['totalAttendanceDuration']+"\" data-tooltip-position=\"left\">"+monthDetails[md]['attendance']+"</span></a>";
						}else{
							attendTable = attendTable + "<span class=\"circle-icon "+monthDetails[md]['attendanceClass']+"\"> "+monthDetails[md]['attendance']+"</span>";
						}
						attendTable = attendTable + '</div>';
					}else{
						if(monthDetails[md]['attendance']=='P'  || monthDetails[md]['attendance']=='M'){
							attendTable = attendTable + monthDetails[md]['totalAttendanceDuration'];
						}else{
							attendTable = attendTable + '-';
						}
					}
					attendTable = attendTable + '</td>';
				}
				attendTable = attendTable + '</tr><tr>';
		}

		


	}
	return attendTable;
}

function callSubjectNameMultipleList(formId, value, userId,courseProviderId ,userRole, dataType) {
	// var value= $("#"+formId+" #batchId").select2('val');
	
	// if(value.length===0){
	// 	$("#"+formId+" #subjectIds").html('');
	// 	return false;
	// }
	value = value.toString();
	console.log("Building Subject dropdown", value);
	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForCommon('masters'),
			data : JSON.stringify(getRequestForMaster('formId','SUBJECT-NAME-LIST-BASED-ON-BATCHES',userId,courseProviderId,userRole,dataType, value)),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			async : false,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					var result = data['mastersData']['courseList'];
					console.log(result);
					var dropdown = $("#"+formId+" #subjectIds");
					dropdown.html('');
					$.each(result, function(k, v) {
						dropdown.append('<option value="' + v.key + '">'
								+ v.value + ' </option>');
					});
				}
			},
				error : function(e) {
					console.log(e);
				}
			});
}


function courseProviderList(formId, elementId) {
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('formId','ALL-COURSE-PROVIDER-LIST', 'courseProList')),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				var result = data['mastersData']['courseList'];
				var dropdown = $('#'+formId+' #'+elementId);
				dropdown.html('');
				dropdown.append('<option value="">Select LMS Platform</option>');
				$.each(result, function(k, v) {
					if(v.key==36 || v.key==37 || v.key==38|| v.key==39|| v.key==40){
						dropdown.append('<option value="' + v.key + '">' + v.value + ' </option>');
						//dropdown.prop("disabled",true)
					}
				});
			}
		}
	});
}

function advanceAttendSearchReset(formId){
	customLoader(true);
	$('#' + formId)[0].reset();
	$("#"+formId+" #attendanceFor").val('0').trigger('change');
	$("#"+formId+" #enrollType").val('').trigger('change');
	$("#"+formId+" #lmsPlatform").val('').trigger('change');
	$("#"+formId+" #standardId").val('').trigger('change');
	$("#"+formId+" #batchId").val('').trigger('change');
	$("#"+formId+" #subjectIds").val('').trigger('change');
	$("#"+formId+" #studentId").val('').trigger('change');
	// $("#"+formId+" #attenStartDateSearch").val('');
	// $("#"+formId+" #attenEndDateSearch").val('');
	customLoader(false);
}

var attarAttend=[];
function callTeacherAttendance(formId, bindElementid, startDate, slotType,userId) {
	customLoader(true);
	$.ajax({
			type : "POST",
			global:false,
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'teacher-attendance-list'),
			data : JSON.stringify({startDate:startDate, slotType:slotType, userId:userId}),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				if (data['status'] == '0' || data['status'] == '2') {
					showMessage(true, data['message']);
				} else {
					console.log(bindElementid);
					$("#"+bindElementid).html('');
					//console.log(data['attendanceList']);
					$('.mymonth-name').html(data['startMonthDate']);
					$("#firstDateNextMonth").val(data['firstDateNextMonth']);
					$("#firstDatePreMonth").val(data['firstDatePreMonth']);
					var attendTable='';
					if(data['attendanceList']!=null){
						attendTable = teachAttendance(data['attendanceList'], userId);
					}
					attarAttend=[];
					for(md=0;md<data['attendanceList'].length;md++){
						//console.log(data['attendanceList'][md]['attendDetails']);
						if(data['attendanceList'][md]['attendDetails']===undefined){
							attarAttend.push('');
						}else{
							attarAttend.push(''+data['attendanceList'][md]['attendDetails']+'');
						}
					}
					if(data['activeNextbutton']=='Y'){
						$("#nextMySelectDate").hide();
					}
					$("#"+bindElementid).html(attendTable);
				}
				customLoader(false);
			},
				error : function(e) {
					if (checkonlineOfflineStatus()) {
						return;
					}
					console.log(e);
					customLoader(false);
				}
			
			});
		}

function teachAttendance(attendanceList, userId ){
		var htmlTbl ='';
		htmlTbl='<table class="table row-height-small table-bordered table-hover text-center">'
		+'<thead>'
		+'<tr class="bg-primary">'
		+'<th class="text-white"><b>Day</b></th>'
		+'<th class="text-white"><b>Date</b></th>'
		+'<th class="text-white"><b>Total Class</b></th>'
		+'<th class="text-white"><b>Total Time</b></th>'
		+'<th class="text-white"><b>Attendance</b></th>'
		+'<th class="text-white"><b>Add More</b></th>'
		+'</tr></thead><tbody>';
		var a=1;
		for(md=0;md<attendanceList.length;md++){
			htmlTbl+='<tr>'
			+'<td class="text-dark">'+(a++)+'</td>'
			+'<td class="text-dark">'+attendanceList[md]['dayname']+', '+attendanceList[md]['attendanceDate']+'</td>'
			+'<td class="text-dark">';
			if(attendanceList[md]['presentInt']==0){
				htmlTbl+='-';
			}else if(attendanceList[md]['presentInt']>0){
				htmlTbl+='<a href="javascript:void(0)" onClick="getMyTotalAtt('+md+')"><b>'+attendanceList[md]['presentInt']+'</b></a>';
			}
			
			htmlTbl+='</td>'
			+'<td class="text-dark">';
			if(attendanceList[md]['presentInt']==0){
				htmlTbl+='-';
			}else if(attendanceList[md]['presentInt']>0){
				htmlTbl+=attendanceList[md]['attendanceDuration'];
			}
			htmlTbl+='</td>';
			var cssatt =  attendanceList[md]['attendance']=='A'?'text-danger':'text-success';
			htmlTbl+='<td class="'+cssatt+'">'+attendanceList[md]['attendance']+'</td>';
			htmlTbl+='<td class="'+cssatt+'"><a href="javascript:void(0);" onClick="callAddAttendanceModal(\''+attendanceList[md]['attendDate']+'\',\''+attendanceList[md]['attendanceDate']+'\',\''+userId+'\')"><i class="fa fa-fw" aria-hidden="true"></i></a></td>';
			+'</tr>';
		}
		htmlTbl+='</tbody>';
		return htmlTbl;
	}
	

function getMyTotalAtt(indx){
	//console.log(""+indx);
		var html="";
		var i=1;
		attendanceArr = JSON.parse(attarAttend[indx]);//attarAttend[indx];//
		console.log(attendanceArr);
		$.each( attendanceArr, function( index, value ){
			//console.log(value);
				$('.popTeacherClassHead').text(value.attendanceDate);
				var entityType='1:1';
				var subjectName=value.subjectName;
				if(value.meetingType=='OFFLINE_MEETING'){
					entityType='Teacher Created Link';
					subjectName='N/A'
				}else if(value.meetingType=='BATCH_TEACHER_MAPPING' && value.meetingType=='BATCH_TEACHER_MAPPING'){
					entityType ='Group';
				}else if(value.meetingType=='EXTRA_ACTIVITY_DETAILS'){
					entityType = 'Activity';
				}
				if(value.meetingType=='OFFLINE_MEETING' && value.offMeetingType=='E'){
					entityType = entityType+' Extra Link'
				}else if(value.meetingType=='OFFLINE_MEETING' && value.offMeetingType=='A'){
					entityType = ' Admin Task'
				}else if(value.meetingType=='OFFLINE_MEETING' && (value.offMeetingType=='R' || value.offMeetingType=='O')){
					entityType = entityType+' For 1:1'
				}else if(value.meetingType=='OFFLINE_MEETING' && value.offMeetingType=='G'){
					entityType = entityType+' For Group'
				}
				
				html+="<tr>";
				html+="<td class='text-center'>"+(i++)+"</td>";
				
				//html+="<td class='vertical-align-top' style='min-width:200px'><b>Joined Time: </b> "+value.attendanceJoinTime+"<br/><b>Ended Time:</b> "+value.attendanceLeaveTime+"<br/><b>Spent time:</b> "+value.attendanceDuration+"<br/><b>Mode:</b> "+entityType+"</td>";
				html+="<td class='vertical-align-top' style='min-width:200px'><b>Mode:</b> "+entityType+"<br/><br/>";
				if(value.attendanceRecording!=null && value.attendanceRecording!=''){
					$.each( value.attendanceRecording, function( kes, vel ){
						html+="<b>Joined Time: </b> "+vel.jointimes+"<br/><b>Ended Time:</b> "+vel.endTimes+"<br/><b>Spent time:</b> "+vel.durations+"<br/>";
						var publSts = vel.publishStatus==1?'Published':'Under Review';
						var publStsCss = vel.publishStatus==1?'text-success':'text-danger';
						if(vel.publishStatus==0){
							html+="<span class="+publStsCss+">"+publSts+"</span><br/>";
						}
					});
				}else{
					html+="<b>Joined Time: </b> "+value.attendanceJoinTime+"<br/><b>Ended Time:</b> "+value.attendanceLeaveTime+"<br/><b>Spent time:</b> "+value.attendanceDuration+"<br/>";
					var publSts = value.publishStatus==1?'Published':'Under Review';
					var publStsCss = value.publishStatus==1?'text-success':'text-danger';
					if(value.publishStatus==0){
						html+="<span class="+publStsCss+">"+publSts+"</span><br/>";
					}
				}

			html+="</td>";
				
				html+="<td class='vertical-align-top'><b>Meeting Topic:</b> "+value.meetingtopic+"<br/><b>Course Name:</b> "+subjectName;
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
							//var funRecord =  "callZoomRecording('','"+vl.meetingId+"','"+vl.reportid+"','"+meetingtype+"')";
							//var recordding = vl.recordingUrl==null?'Recording not present <a class=\"refresh-link btn btn-sm btn-light px-1 py-0 ml-auto\" href=\"javascript:void(0);\" title=\"Refresh\" onclick=\"return '+funRecord+'\"> <i class=\"lnr-sync\"></i></a>':vl.recordingUrl;
							var recordding = vl.recordingUrl==null?'Recording not present ':vl.recordingUrl;
							html+="<br/><b>Recording Url:</b> "+recordding;
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
					html+="<br/><b>Comments:</b>";
					$.each( value.attendanceRemarks, function( ks, vl ){
						if(vl.comments!=null){
							html+="<br/>"+vl.comments;
							if(vl.userType=='TEACHER'){
								html+="<span style=\"font-size:14px;color:red;float:right\"><a href=\"javascript:void(0);\" class=\"click-to-catalog\" onclick=\"return editAttendanceComments('"+vl.attendid+"','"+vl.remarkId+"','N','remove-comment');\"><i class=\"fa fa-times\"></i></a></span>";
							}
						}
						
					});
				}
				html+="</td>";
				html+="</tr>";
		});
		$("#myteacherAllClassBody").html(html);
		$("#myteacherAllClassModel").modal('show');
	}
