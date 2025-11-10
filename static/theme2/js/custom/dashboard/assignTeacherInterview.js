function getTeacherInterviewAssignTableHtml(assignUserList){
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
						onclick="activeTeacherInterviewCounselor(this.value, '${assignUser.assignTo}', '${autoInc}')" data-size="mini"/>
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


  async function getTeacherInterviewAssign(){
    payload={};
	payload['schoolId']=SCHOOL_ID;
	payload['userId']=USER_ID;
	payload['todayDate']=$("#formdate").val();
    var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'teacher-assign-interview', payload, '/teacher/signup');
    var assignUserList= data.assignUserList!=""?JSON.parse(data.assignUserList):"";          
    if (data['status'] == '0' || data['status'] == '2') {
        return showMessageTheme2(0, data['message']);
    } else {
        var html =getTeacherInterviewAssignTableHtml(assignUserList);
        $("#teacherInterviewAssignUser").html(html); 
    }
  }

  function activeTeacherInterviewCounselor(chckValue, userId, orderBy) {
	if (chckValue=='N') {
		chckValue='Y';
	}else if (chckValue=='Y') {
		chckValue='N';
	}
	saveInactiveAssignCounselorOrient(userId, chckValue, orderBy, 'INITIAL-INTERVIEW');
}