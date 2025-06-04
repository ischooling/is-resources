var ROLE_MODULE_ID=moduleId;
function getStudentAssigneFilterContent(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="col-md-12 p-0">'
		+'<div class="filter-wrapper">'
			// +'<div class="full">'
			// 	+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'studentAssignedReportFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
			// +'</div>'
			+'<form name="studentAssignedReportFilter" id="studentAssignedReportFilter" action="javascript:void(0)">'
				+'<div class="main-filter-wrpper row">'
					+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
						+'<div class="d-flex align-items-end flex-wrap ">'
							+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12">'
								+'<span class="h6 bold mt-3 mr-4 pl-sm-0 reportTitle"></span>'
								+'<select class="form-control  d-inline-block px-2" style="width:auto !important" id="reportDropdown" onchange="teacherReportByDate(\'studentAssignedReportFilter\');">'
									+'<option value="sevenDays">7 Days</option>'
									+'<option value="fifteenDays">15 Days</option>'
									+'<option value="oneMonth" selected>1 Month</option>'
									+'<option value="custom">Custom</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12 mt-3">'
								+'<label>Start Date</label>'
								+'<input class="form-control" type="text" id="startDate" autocomplete="off"/>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12 mt-3">'
								+'<label>End Date</label>'
								+'<input class="form-control" type="text" id="endDate" autocomplete="off"/>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-5 col-md-4 col-sm-6 col-xs-12 mt-3">'
								+'<label>Teacher Name</label>'
								+'<input type="text" name="teacherName" id="teacherName" class="form-control" value="" maxlength="100" onkeydown="return M.isChars(event);">'
							+'</div>'
							+'<div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12 mt-3">'
								+'<label>Teacher Email</label>'
								+'<input type="text" name="officialEmail" id="officialEmail" class="form-control" value="" maxlength="100" onkeydown="return M.isEmail(event);"/>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12 mt-3">'
								+'<label>Profile Status</label>'
								+'<select class="form-control  px-2" id="profileStatus">'
									+'<option value="A" selected>Completed</option>'
									+'<option value="W">Withdrawn</option>'
									+'<option value="">All</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12 mt-3">'
								+'<label>Progress</label>'
								+'<select class="form-control  px-2" id="progressStatus">'
									+'<option value="">All</option>'
									+'<option value="RED">Red</option>'
									+'<option value="YELLOW">Yellow</option>'
									+'<option value="GREEN">Green</option>'
								+'</select>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-3 col-xs-12 mt-3" style="display:none;">'
								+'<label>Teacher ID</label>'
								+'<input type="hidden" name="teacherId" id="teacherId" class="form-control" value="" maxlength="100"/>'
							+'</div>'
							+'<div class="col-xl-2 col-lg-2 col-md-2 col-sm-4 col-xs-12 mt-3" style="display:block;">'
								+'<label>Page Size</label>'
								+'<input type="hidden" name="page" id="page" class="form-control" value="0" maxlength="3"/>'
								+'<input type="text" name="pageSize" id="pageSize" class="form-control" value="5" maxlength="3"/>'
							+'</div>'
							+'<div class="ml-sm-1 col-md-12 col-sm-12 col-xs-12"" style="display:none;">'
								+'<label>Order Key</label>'
								+'<input type="hidden" name="orderKey" id="orderKey" class="form-control" value="U.USER_FULL_NAME" maxlength="10"/>'
								+'<input type="hidden" name="orderBy" id="orderBy" class="form-control" value="asc" maxlength="4"/>'
							+'</div>'
							+'<div class="col-xl-4 col-lg-4 col-md-4 col-sm-5 col-xs-12 mt-3">'
								+'<button class="btn btn-success btn-shadow float-right pr-4 pl-4 mr-2" onclick="studentAssginedReportSearch(\'studentAssignedReportFilter\',\''+roleAndModule.moduleId+'\','+userId+',\''+role+'\');"><i class="fa fa-check"></i>&nbsp;Apply</button>'
								+'<button class="btn btn-primary btn-shadow float-right pr-4 pl-4 mr-2" onclick="studentAssginedReportSearchReset(\'studentAssignedReportFilter\')"><i class="fa fa-check"></i>&nbsp;Reset</button>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</form>'
		+'</div>'
	+'</div>';
	return html;
}

function getStudentAssignedReportContent(title, roleAndModule, schoolId, userId, role){
	ROLE_MODULE_ID = roleAndModule.moduleId;
	var html= 
		`<div class="app-page-title">
			<div class="page-title-wrapper">
				<div class="page-title-heading">
					<div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
					<div>
						<span class="text-primary welcome-name-text">${title}</span>
						
					</div>
				</div>
			</div>
		</div>`;
		// html+='<div class="row">'
		// 	+'<div class="col-md-12 col-lg-12 col-sm-12">'
				html+='<div class="main-card mb-3 card">'
					+'<div class="card-body">'
						+'<div class="row">'
							+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
								+getStudentAssigneFilterContent(roleAndModule,schoolId,userId,role)
							+'</div>'
						+'</div>'
						+'<br>'
						+'<div id="studentAssginedReportSearchContentDiv" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
						+'</div>'
					+'</div>'
				+'</div>';
		// 	+'</div>'
		// +'</div>';
	return html;
}

function studentAssignReportSingleData(k,v){
	var learningProgams='';
	var learningProgamCountElements='';

	var profileStatus = $('#profileStatus').val();
	var startDate = getDateInDateFormat($('#startDate').val());
	startDate=changeDateFormat(startDate, 'yyyy-mm-dd');
	var endDate = getDateInDateFormat($('#endDate').val());
	endDate=changeDateFormat(endDate, 'yyyy-mm-dd');
	var urlSend = "getAsPost('/report/teacher-class-report?moduleId=150&euid="+v.tencryptedUserId+"&profileStatus="+profileStatus+"&startDateFilter="+startDate+"&endDateFilter="+endDate+"','self')";
	
	$.each(v.learningProgamCount, function(k1, v1) {
		learningProgams+=v1.learningProgramName+'/';
		learningProgamCountElements+=
		'<div class="filter-item align-items-top bg-gray">'
			+'<div class="p-3 text-center">'
				+'<p class="filter-item-title">'+v1.learningProgramName+'</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'
					+'<a href="javaScript:void(0);" onclick="getStudentAssignedReportWithFilterSubmit(\'TSLearingProgram\','+v.teacherId+',\''+v1.learningProgramName+'\');">'
						+parseInt(v1.activeCount+v1.inactiveCount)
						+(v1.learningProgramName=='GL'?(' ('+v.batchCount+')'):'')
					+'</a>'
				+'</h3>'
				+'<h5 class="mt-3 h4">'
					+'<span class="bold">'
						+'<a href="javaScript:void(0);" class="text-success" onclick="getStudentAssignedReportWithFilterSubmit(\'TSA\','+v.teacherId+',\''+v1.learningProgramName+'\');">'
						+v1.activeCount
						+'</a>'
					+'</span>/<span class="text-danger bold">'
						+'<a href="javaScript:void(0);" class="text-danger" onclick="getStudentAssignedReportWithFilterSubmit(\'TSI\','+v.teacherId+',\''+v1.learningProgramName+'\');">'
						+v1.inactiveCount
						+'</a>'
					+'</span>'
				+'</h5>'
			+'</div>'
		+'</div>';
	});
	learningProgams=learningProgams.substring(0,learningProgams.length-1);

	var studentGrades='';
	var studentGradesCount=0;
	var gradeStudentOptions='<option value="">Select Grade</option>';
	$.each(v.gradeStudentCount, function(k2, v2) {
		studentGrades+=v2.gradeNameShort+'-';
		studentGradesCount+=parseInt(v2.studentCount);
		gradeStudentOptions+='<option value="'+v2.gradeId+'">'+v2.gradeName+' ('+v2.studentCount+')</option>';
	});
	studentGrades=studentGrades.substring(0,studentGrades.length-1);

	var recommendedClassesContent='';
	var recommendedClassesCount=0;
	$.each(v.recommendedClasses, function(k3, v3) {
		recommendedClassesCount+=parseInt(v3.count);
		recommendedClassesContent+=
		'<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0">'
			+'<div class="text-center">'
				+'<p class="filter-item-title">'+v3.learningProgram+'</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v3.count+'</h3>'
			+'</div>'
		+'</div>';
	});

	var completedClassesContent='';
	var completedClassesCount=0;
	$.each(v.completedClasses, function(k4, v4) {
		completedClassesCount+=parseInt(v4.count);
		completedClassesContent+=
		'<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 p-0">'
			+'<div class="text-center">'
				+'<p class="filter-item-title">'+v4.learningProgram+'</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v4.count+'</h3>'
			+'</div>'
		+'</div>';
	});
	
	var hrml=
	'<div id="grades_'+v.teacherId+'" grades="'+v.batchesDetails+'" class="d-flex flex-wrapper justify-content-between mb-3 bg-gray">'
		+'<div class="filter-item">'
			+'<div class="p-3">'
				+'<h3 class="m-0 bold blue-text"><a href="javascript:void(0)" onclick=\"('+urlSend+')\" > '+v.teacherName+'</a></h3>'
				+'<p class="m-0">'+v.timezone+'<br/>'+v.offset+'</p>'
				+'<h4 class="m-0 bold text-danger lh-18 mt-2">'+v.employeeType+' ('+v.profileStatus+')</h4>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Assigned<br/>Mode</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+learningProgams+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Grades</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+studentGrades+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Total Student</p>'
				+'<h3 class="m-0 bold text-dark lh-22"><a href="javaScript:void(0);" onClick="getStudentAssignedReportWithFilterSubmit(\'TSTotal\','+v.teacherId+',\'\');">'+studentGradesCount+'</a></h3>'
				+'<select id="gradeId_'+v.teacherId+'" class="form-control" onchange="getStudentAssignedReportWithFilterSubmit(\'TSGrade\','+v.teacherId+',\'\');">'
					+gradeStudentOptions
				+'</select>'
			+'</div>'
		+'</div>'
		+learningProgamCountElements
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3 text-center">'
				+'<p class="filter-item-title">Working Days</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v.workingDays+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3 text-center">'
				+'<p class="filter-item-title">Days Taught</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v.daysTaught+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Recommended<br/>teaching hours</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v.recommendedTeachingHours+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Total No. of<br/>teaching hours</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v.totalTeachingHours+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="d-flex flex-wrap p-3">'
				+'<div class="col-lg-12 p-0">'
					+'<p class="filter-item-title">Recommended<br/>Class</p>'
					+'<h3 class="m-0 bold text-dark lh-22">'+recommendedClassesCount+'</h3>'
				+'</div>'
				+'<div class="col-lg-12 d-flex p-0">'
					+recommendedClassesContent
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="d-flex flex-wrap p-3">'
				+'<div class="col-lg-12 p-0">'
					+'<p class="filter-item-title">Completed<br/>Class</p>'
					+'<h3 class="m-0 bold text-dark lh-22">'+completedClassesCount+'</h3>'
				+'</div>'
				+'<div class="col-lg-12 d-flex p-0">'
					+completedClassesContent
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Agreed<br/>Payout</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v.payout.agreedPayout+'</h3>'
			+'</div>'
		+'</div>'
		+'<div class="filter-item align-items-top">'
			+'<div class="p-3">'
				+'<p class="filter-item-title">Actual<br/>Payout</p>'
				+'<h3 class="m-0 bold text-dark lh-22">'+v.payout.actualPayout+'</h3>'
			+'</div>'
		+'</div>'
	+'</div>';
	return hrml;
}


function teacherClassReportData(k,v, inc){
	console.log('teacherClassReportData'+v);
	var profileStatus = $('#profileStatus').val();
	var startDate = getDateInDateFormat($('#startDate').val());
	startDate=changeDateFormat(startDate, 'yyyy-mm-dd');
	var endDate = getDateInDateFormat($('#endDate').val());
	endDate=changeDateFormat(endDate, 'yyyy-mm-dd');
	var urlSend = "getAsPost('/report/teacher-class-report?moduleId=150&euid="+v.tencryptedUserId+"&profileStatus="+profileStatus+"&startDateFilter="+startDate+"&endDateFilter="+endDate+"')";
	var studentGradesCount=0;
	$.each(v.gradeStudentCount, function(k2, v2) {
		studentGradesCount+=parseInt(v2.studentCount);
	});
	var percentColor = "";
	if(v.percentWork>=80){
		percentColor = "#84c892";
	}else if(v.percentWork>59 && v.percentWork<79){
		percentColor = "#dabe4d";
	}else{
		percentColor = "#c88484";
	}
	var html='';
	html+='<tr id="grades_'+v.teacherId+'" grades="'+v.batchesDetails+'" class=\"text-dark\" style=\"background:'+percentColor+'\">';
	html+='<td class=\"text-dark\">'+inc+'</td>';
	html+='<td class=\"text-left\"><a href=\"javascript:void(0)\" onclick=\"'+urlSend+'\" class=\"bold text-dark\"> '+v.teacherName+'</a>'+'<br/>'+v.teacherEmail+'</td>';
	html+='<td class=\"text-dark\">'+v.cityname+'|'+v.countryname+'|'+v.offset+'</td>';
	html+='<td class=\"text-dark\">'+v.employeeType+'</td>';
	html+='<td class=\"text-dark\">'+v.totalTeachingHours+' /'+v.workingHours+'h<br/>'+v.percentWork+'%</td>';
	html+='<td><a class=\"text-dark\" href="javaScript:void(0);" onClick="getStudentAssignedReportWithFilterSubmit(\'TSTotal\','+v.teacherId+',\'\');">'+studentGradesCount+'</a></td>';
	html+='</tr>';	

	return html;
}


function getFilterpart1(){
	var html=
	'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
		+'<div class="main-filter-wrpper row">'
			+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
				+'<div class="d-flex align-items-center flex-wrap">'
					+'<div class="ml-sm-3 col-md-3 col-xs-12 d-inline-flex align-items-center flex-wrap"><span class="h2 bold mt-3 mr-4 pl-sm-0"></span>'
					+'<select class="form-control  px-2" style="width:auto !important" id="reportDropdown" onchange="teacherReportByDate(\'studentAssignedReportFilter\');">'
						+'<option value="sevenDays">7 Days</option>'
						+'<option value="fifteenDays">15 Days</option>'
						+'<option value="oneMonth" selected>1 Month</option>'
						+'<option value="custom">Custom</option>'
					+'</select></div>'
					+'<div class="ml-sm-3 col-md-3 col-sm-3 col-xs-12">'
						+'<input class="form-control" type="text" id="startDate" autocomplete="off" />'
					+'</div>'
					+'<div class="ml-sm-3 col-md-3 col-sm-3 col-xs-12">'
						+'<input class="form-control" type="text" id="endDate" autocomplete="off" />'
					+'</div>'
					+'<div class="ml-sm-3 col-md-2 col-sm-12 col-xs-12 text-right text-md-left">'
						+'<button class="btn btn-sm bg-success">Submit</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}


function studentAssignedReportContent(data, divId, role){
	//studentAssignReportSingleData(k, v);
	var reportdata='';
	var inc=0;
	$.each(data.studentAssigedReports, function(k, v) {
		//reportdata+=studentAssignReportSingleData(k,v);
		inc =inc +1;
		reportdata+=teacherClassReportData(k,v, inc);
	});
	var html=
	'<div class="row">'
		// +getFilterpart1()
		+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-4">'
			+'<div class="teacher-filter-wrapper ">'
				+'<div class=\"table-responsive\">'
					+'<table class=\"table row-height-small table-bordered  text-center\">'
						+'<thead>'
							+'<tr class=\"bg-dark-gray\">'
								+'<th class=\"text-white bg-primary\"><b>Sr. no.</b></th>'
								+'<th class=\"text-white bg-primary\"><b>Teacher Name</b></th>'
								+'<th class=\"text-white bg-primary\"><b>Location</b></th>'
								+'<th class=\"text-white bg-primary\"><b>Employee Status</b></th>'
								+'<th class=\"text-white bg-primary\"><b>Working Hours/Agreed</b></th>'
								+'<th class=\"text-white bg-primary\"><b>Total Student</b></th>'
							+'</tr>'
						+'</thead>'
						+'<tbody>'+reportdata+'</tbody>'
					+'</table>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt-4">'
			+'<div class="text-right filterDiv" style="display:none">'
				+'<button class="btn btn-sm btn-primary" onclick="filterModal(\'studentAssignFilterModal\',\'show\')">Filter</button>'
			+'</div>'
			+'<div id="studentAssginedReportWtihFilterContentDiv" class="table-h-scroll">'
			+'</div>'
		+'</div>'
	+'</div>'
	return html;
}

function filterTeacherReportModal(schoolId){
	html='<div class="modal fade bd-example-modal-lg fade-scale square-field" id="studentAssignFilterModal">'
		+'<div class="modal-dialog modal-lg">'
			+'<div class="modal-content border-0">'
				+'<div class="modal-header  theme-bg text-white">'
					+'<h4 class="modal-title">Filter</h4>'
					+'<button type="button" class="close text-white" data-dismiss="modal" paria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<form action="javascript:void(0);" id="studentAssignFilterForm" name="studentAssignFilterForm" autocomplete="off">'
					+'<div class="modal-body">'
						+'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'
							+'<div class="form-row">'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0 ">Student Name</label>'
										+'<input id="teacherId" name="teacherId" type="hidden" class="form-control" autocomplete="off">'
										+'<input id="studentName" name="studentName" type="text" class="form-control" autocomplete="off">'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0">Student Email</label>'
										+'<input id="studentEmail" name="studentEmail" type="text" class="form-control" autocomplete="off">'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0">Learning Program</label>'
										+'<select id="learningProgram" name="learningProgram" multiple="" class="multiselect-dropdown select2-hidden-accessible">'
											+'<option value="">Select Learning Program</option>'
											+getLearningProgramContent(schoolId)
										+'</select>'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0">Grade</label>'
										+'<select id="standardId" name="standardId" multiple="" class="multiselect-dropdown select2-hidden-accessible">'
											+'<option value="" disabled>Select Grade*</option>'
											+getStandardContent(schoolId,false, false)
										+'</select>'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0">Batch</label>'
										+'<select id="batchId" name="batchId" multiple="" class="multiselect-dropdown select2-hidden-accessible">'
										+'</select>'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0">Color</label>'
										+'<select id="color" name="color" multiple="" class="multiselect-dropdown select2-hidden-accessible">'
											+'<option value="RED">Red</option>'
											+'<option value="GREEN">Green</option>'
											+'<option value="YELLOW">Yellow</option>'
											+'<option value="BLUE">Blue</option>'
										+'</select>'
									+'</div>'
								+'</div>'
								+'<div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">'
									+'<div class="form-group mb-2 p-0">'
										+'<label class="mb-0">Sort In</label>'
										+'<select id="orderBy" name="orderBy" class="singleSelect2-dropdown select2-hidden-accessible">'
											+'<option value="asc">Ascending</option>'
											+'<option value="desc">Descending</option>'
										+'</select>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<br/>'
						+'<div class="text-right">'
							+'<button type="button" id="studentAssignWithFilterBtn" class="btn btn-success btn-shadow  pr-4 pl-4" onClick="getStudentAssignedReportWithFilterSubmit(\'TSF\',\'\',\'\');">Search</button>'
							+'<button type="button" class="btn btn-danger btn-shadow pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
							+'<button type="button"  class="btn btn-primary btn-shadow  pr-4 pl-4" onClick="studentAssgineFilterReset(\'studentAssignFilterForm\')">Reset</button>'
						+'</div>'	
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function getStudentAssigneHeader(role){
	html='<th class="text-center"><b>Student Name/Email</b></th><th class="text-center"><b>LP/Grade/Batch/Course</b></th><th class="text-center"><b>Mapping (Start Date - End Date)</b></th><th class="text-center"><b>Last Class Booked Date (Days since last class booked)</b></th><th class="text-center"><b>Last Activity Submitted Date (Days since last assignment submitted)</b></th>';
	return '<thead><tr>'+html+'</tr></thead><tbody></tbody>';
}

function studentAssignedReportTableWithFilter(tableId, role){
	html='<table id="'+tableId+'" class="table table-bordered table-striped mt-4">'
		+getStudentAssigneHeader(role)
	+'</table><br/>';
	return html;
}

function getStudentAssignedReportWithFilterBody(result, userId, role){
	var html='';
	$.each(result, function(k, v) {
		var customClass='';
		if(v.color=='RED'){
			customClass='bg-danger text-white';
		}else if(v.color=='GREEN'){
			customClass='bg-success text-white';
		}else if(v.color=='YELLOW'){
			customClass='bg-warning';
		}else if(v.color=='BLUE'){
			customClass='bg-info text-white';
		}else{
			customClass='bg-danger text-white';
		}

		html+=
			'<tr id="sar'+v.meetingId+'" class="'+customClass+'">'
				+'<td>'+v.studentName+' ('+v.studentEmail+')</td>'
				+'<td>'+v.larningProgram+'/'+v.grade+'/'+v.batch+'/'+v.course+'</td>'
				+'<td>'+v.mappingStartDate+' - '+v.mappingEndDate+'</td>'
				+'<td>'+v.lastClassBookedDate+' ('+v.daysSinceBooked+')</td>'
				+'<td>'+v.lastActivityDate+' ('+v.daysSinceActivity+')</td>'
			+'</td>';
	});
	return html;
}
