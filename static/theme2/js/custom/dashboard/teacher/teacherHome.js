async function callTeacherLastAttendance(formId, userId, startdate, enddate){ 
	
	try{
		var data = getRequestForTeacherLastclass(formId, userId, startdate, enddate)
		var responseData = await getDashboardDataBasedUrlAndPayload(false, false,'teacher-last-class', data);
		var classlist = data['teacherClass']['teacheClassList'];
		if(classlist!=null){
			var tblHtml='';
			var int=1;
			tblHtml+='<table class="table table-bordered responsive nowrap"><thead><th>sr no.</th><th>Grade</th><th>Duration</th></thead>';
			tblHtml+='<tbody>';
			for(t=0;t<classlist.length;t++){
				tblHtml+='<tr>';
				tblHtml+='<td>'+(int++)+'</td>';
				tblHtml+='<td>'+classlist[t]['standard']+'</td>';
				tblHtml+='<td class="text-center">'+classlist[t]['jobSpentTime']+'</td>';
				tblHtml+='</tr>';
			}
			tblHtml+='</tbody>';
			tblHtml+='<tfoot><tr><th></th><th></th><th class="text-center">Total Duration - '+ data['teacherClass']['totaltime']+'</th></tr></tfoot>';
			tblHtml+='</table>';
			$('#mteacherLastClass').html(tblHtml);
			$('#modalTeacherClass').modal('show');
			window.setTimeout(function(){$('#modalTeacherClass').modal('hide');;},8000);
		}
	}catch(e){
		if(tt=='theme1'){
			showMessage(true, e);
		}else{
			showMessageTheme2(0, e,'',true);
		}
	}
}

function getRequestForTeacherLastclass(formId, userId, startdate, enddate) {
	var monthdate = startAndEndOfMonth();
	if(startdate=='' || startdate==undefined){
        startdate = monthdate[0];
    }
    if(enddate=='' || enddate==undefined){
        enddate = monthdate[1];
    }
    var schoolCalendarRequestDTO = {};
    schoolCalendarRequestDTO['userId'] =userId;
    schoolCalendarRequestDTO['schoolId'] = SCHOOL_ID;
    schoolCalendarRequestDTO['startDate']=startdate;
    schoolCalendarRequestDTO['endDate']=enddate;
    return schoolCalendarRequestDTO;
}

function slideMenu(val){
	$("#main-nav1").metisMenu({
		toggle: false // disable the auto collapse. Default: true.
	});
}
