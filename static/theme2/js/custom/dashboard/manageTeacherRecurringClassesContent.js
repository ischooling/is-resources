function getRecurringClassesFilter(roleAndModule, schoolId, userId, role){
	var html=
	'<div class="filter-wrapper">'
		+'<div class="full">'
		+'<button class="btn btn-sm btn-primary float-right show-filter" onClick="toggleFilter(\'recurringClassFilter\')"><i class="fa fa-filter"></i>&nbsp;Filter</button>'
		+'</div>'
		    +'<form name="recurringClassFilter" class="full" id="recurringClassFilter" action="javascript:void(0)">'
			      +'<div class="filter-fields d-flex flex-wrap">';
                html+= '<div class="col-md-3 col-sm-3 col-xs-12">'
                            +'<label class="mb-0">Academic Session</label>'
                            +'<select id="activeSession" name="activeSession"'
                                +'class="multiselect-dropdown form-control">'
                            +'</select>'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-3 col-xs-12">'
                            +'<label class="mb-0">Enroll Type</label>'
                            +'<select name="filterEnrollType" id="filterEnrollType" class="form-control">'
                                +'<option value="">Select Enroll type</option>'
                                +getLearningProgramContent(SCHOOL_ID)
                            +'</select>'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-3 col-xs-12">'
                            +'<label>Grade</label>'
                            +'<select name="standardId" id="standardId" class="form-control">'
                            +'</select>'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-3 col-xs-12">'
                            +'<label class="mb-0">Student Name</label>'
                            +'<input type="text" class="form-control" id="studentName">'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-3 col-xs-12">'
                            +'<label class="mb-0">Created By</label>'
                            +'<select name="createdBy" id="createdBy" class="form-control">'
                                +'<option value="" selected>Select Created by</option>'
                                +'<option value="admin">Admin</option>'
                                +'<option value="teacher">Teacher</option>'
                            +'</select>'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-6 col-xs-12">'
                            +'<label>Start Date</label>'
                            +'<input type="text" name="startDate" id="startDate" class="form-control filterDates" value="" maxlength="10"/>'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-6 col-xs-12">'
                            +'<label>End Date</label>'
                            +'<input type="text" name="endDate" id="endDate" class="form-control filterDates" value="" maxlength="10"/>'
                        +'</div>'
                        +'<div class="col-md-3 col-sm-6 col-xs-12">'
                            +'<label>Page Size</label>'
                            +'<input type="text" name="pageSize" id="pageSize" class="form-control" value="25"/>'
                        +'</div>'
                        +'<div class="col-md-12 col-sm-12 col-xs-12 mt-2 text-right">'
                            +'<button class="btn btn-sm btn-success mr-2" onclick="getRecurringClassesData(\'recurringClassFilter\',\'recurringClassesTable\');"><i class="fa fa-check"></i>&nbsp;Search</button>'
                            +'<button class="btn btn-sm btn-primary" onclick="getActiveSessionReset(\'recurringClassFilter\')"><i class="fa fa-check"></i>&nbsp;Reset</button>'
                        +'</div>'
                    +'</div>'
				+'</form>'
			+'</div>';
	return html;
}



function getRecurringClassesContentTeacher(titlle, roleAndModule, schoolId, userId, role){
	var html=
	'<div class="app-page-title">'
	+'<div class="page-title-wrapper">'
		+'<div class="page-title-heading">'
		+'<div class="page-title-icon"><i class="fas fa-user-cog text-primary"></i></div>'
		+'<div>'+titlle+'</div>'
			+'</div>';
		if(roleAndModule.added=='Y'){
			html+='<div class="page-title-actions">';
			html+='<div class="d-inline-block dropdown"> ';
			html+='</div>';
			html+='</div>';
		}
		html+='</div>'
	+'</div>'
        +'<div class="main-card mb-3 card">'
            +'<div class="card-body">'
                +getRecurringClassesFilter(roleAndModule,schoolId,userId,role)
                +'<br>'
                +'<div class="col-md-12 mt-3 p-0">'
                    +'<div id="manageRecurringClassesList" style="width:100%;display:inline-block">'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>'
			
	return html;
}


function getRecurringClassesHeaderData(){
	var html='<th>S.No.</th><th>Student Name/Timezone</th><th>Learning Program/LMS Platform</th><th>Grade/Course Name</th><th>Start Date - End Date/Timezone<br />Timings/Session Count</th><th>Joining Link Before</th><th>Class Duration/ Buffer Time </th><th>Added By/Added Date Time</th><th>Status</th><th>Action</th>';
	return '<thead><tr>'+html+'</tr></thead><tbody></tbody>';
}

function getRecurringClassesTable(tableId){
	html='<table id="'+tableId+'" class="table table-striped table-bordered responsive dt-responsive" style="width:100%;">'
		+getRecurringClassesHeaderData()
	+'</table><br/>';
	return html;
}

function getRecurringClassesBodyData(dataList){
    console.log(dataList);

    var html='';
	$.each(dataList, function(k, v) {
        html+='<tr>'
                +'<td>'+(k+1)+'</td>'
                // +'<td id="recurring_class_'+v.id+'}" class="recurring_class_'+v.id+'">('+v.meetingVendor+')<br/>';
                // if(v.joiningLink != undefined && v.joiningLink != null && v.joiningLink != ""){
                //     if(v.meetingVendor == 'ZOOM'){
                //         html+='<button value="'+v.joiningLink+'" id="start_url_'+(k+1)+'"'
                //             +'onclick="copyURL(\'start_url_'+(k+1)+'\', \'start-copy-msg-'+(k+1)+'\')"'
                //             +'class="btn btn-primary btn-sm">Copy Start URL</button> <b'
                //             +'class="start-copy-msg-'+(k+1)+'"></b>'
                //         +'<br>'
                //         +'<button value="${rdata.startLink}" id="join_url_'+(k+1)+'"'
                //             +'onclick="copyURL(\'join_url_'+(k+1)+'\', \'join-copy-msg-'+(k+1)+'\')"'
                //             +'class="btn btn-primary btn-sm">Copy Join URL</button> <b'
                //             +'class="join-copy-msg-'+(k+1)+'"></b>';
                //     }else{
                //         html+='<button value="${rdata.joiningLink}" id="external_url_'+(k+1)+'"'
                //                     +'onclick="copyURL(\'external_url_'+(k+1)+'\', \'external-copy-msg-'+(k+1)+'\')"'
                //                     +'class="btn btn-primary btn-sm">Copy URL</button> <b'
                //                 +'class="external-copy-msg-'+(k+1)+'"></b>';
                //     }
                // }else{
                //     html+='Link not generated yet';
                // }
           html+='</td>'
                +'<td>'+v.studentName+'<br/>'+v.timezoneStudent+'</td>'
                +'<td>'+v.enrollType+'<br/>'+v.lmsPlatformString+'</td>'
                +'<td><br/>'+v.grades+'<br/>'+v.subjects+'</td>'
                +'<td>'+v.startDate+'-'+v.endDate+'<br/>('+v.timezone+')<br/><br/>'+v.timings+'<br/>'+v.sessionCount+' session</td>'
                +'<td>'+v.showLinkBefore+' Mins</td>'
                +'<td>'+v.classDuration+' Mins / '+v.buffertime+' Mins</td>'
                +'<td>'+v.createdByName+' / '+v.createdAt+'</td>'
                +'<td>'+v.active+'</td>'
                +'<td>';
                if(v.active == 'Active'){
                html+='<div class="btn-group">'
                        +'<button type="button" class="btn btn-danger dropdown-toggle  btn-sm"'
                            +'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"'
                            +'data-toggle="tooltip" title="Action"'
                            +'style="background-color:#001173 !important;border-color:#001173;box-shadow:none;">'
                            +'<i class="fa fa-ellipsis-v"></i>'
                        +'</button>'
                        +'<div class="dropdown-menu">';
                    if(v.mailSent == 'Y'){
                        html+= '<a href="javascript:void(0);" class="dropdown-item"'
                            +'onclick="return sendRecurringWarning(\'Are you sure you want to resend mail?\', \'recurringMail(\\\''+v.id+'\\\',\\\''+v.moduleId+'\\\')\')">'
                            +'<i class=\'fa fa-envelope-open m-r-10\'></i>&nbsp;Resend Mail'
                        +'</a>';
                    }else{
                        html+= '<a href="javascript:void(0);" class="dropdown-item"'
                        +'onclick="return sendRecurringWarning(\'Are you sure you want to send mail?\', \'recurringMail(\\\''+v.id+'\\\',\\\''+v.moduleId+'\\\')\')">'
                        +'<i class=\'fa fa-envelope m-r-10\'></i>&nbsp;Send Mail'
                        +'</a>';
                    }
                    html += '</div>'
                    +'</div>';
                }else{
                    html+='N/A';
                }
          html+='</td>'
            +'</tr>'
    });
    return html;
}