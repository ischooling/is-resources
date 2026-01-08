function getConflictedUserList(formId, moduleId) {
	if(!getSession()){
		redirectLoginPage();
		return false;
	}
 hideMessageTheme2('');
 
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','conflicted-user-list'),
	 data : JSON.stringify(getRequestForConflitedUserList(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getConflictedUserListHtml(data.conflictedUserList);
			$("#conflictedUserListBody").html(html);
			 var table = $('#conflictedUserListTable').DataTable({"pagingType":"full"}); 
			$('#conflictedUserListTable').on('page.dt',function(){
				table.responsive.recalc();
			}) 
			$('.show-filter').on('click', function(){
				$('.filter-fields').stop().slideToggle();
			});
		 }
		 return false;
	 }
 });
}
function getRequestForConflitedUserList(formId, moduleId){
	var requestBody = {};
  	requestBody['userId'] = USER_ID;
	return requestBody;
}

function getConflictedUserListHtml(conflictedUserList){
	var html='';
	if(conflictedUserList.length>0){
		for (let iu = 0; iu < conflictedUserList.length; iu++) {
			const conflictedUser = conflictedUserList[iu];
			html+=`<tr>	
            <td style="text-align:center;">${iu+1}</td>
           	<td>${conflictedUser.userEmail}</td>
			<td>${conflictedUser.studentStringId}</td>
			<td>${conflictedUser.userRole}</td>
			<td>${conflictedUser.createdDate}</td>
			<td>${conflictedUser.updatedDate}</td>
			<td>${conflictedUser.status}</td>
            ${SCHOOL_ID==1?`<td><a href="#" id="VerifyEmail" onclick="return callForEmailResend('${conflictedUser.userEmail}','${conflictedUser.userRole}','true');">Sent Email</a></td>`:''}
         </tr>`;
		}
	}
	return html;
}
