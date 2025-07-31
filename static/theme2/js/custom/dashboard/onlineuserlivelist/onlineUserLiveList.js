function getOnlineLiveUserList(formId, moduleId) {
	if(!getSession()){
      redirectLoginPage();
	  return false;
    }
 hideMessageTheme2('');
 
 $.ajax({
	 type : "POST",
	 contentType : APPLICATION_JSON_VALUE,
	 url : getURLForHTML('dashboard','online-live-user-list'),
	 data : JSON.stringify(getRequestForOnlineLiveUserList(formId, moduleId)),
	 dataType : 'json',
	 cache : false,
	 timeout : 600000,
	 success : function(data) {
		console.log(data);
		 if (data['status'] == '0' || data['status'] == '2') {
			 showMessageTheme2(0, data['message'],'',true);
		 } else {
			var html=getOnlineLiveUserListHtml(data.onlineUserList);
			$("#onlineUserLiveListbody").html(html);
			 var table = $('#onlineUserLiveListTable').DataTable({"pagingType":"full"}); 
			$('#onlineUserLiveListTable').on('page.dt',function(){
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
function getRequestForOnlineLiveUserList(formId, moduleId){
	var requestBody = {};
  	requestBody['userId'] = USER_ID;
	return requestBody;
}

function getOnlineLiveUserListHtml(userList){
	var html='';
	if(userList.length>0){
		for (let iu = 0; iu < userList.length; iu++) {
			const onlineUser = userList[iu];
			html+=`<tr>	
            <td style="text-align:center;">${iu+1}</td>
            <td>${onlineUser.userName}</td>
             <td>${onlineUser.userStandard != ""?onlineUser.userStandard:'N/A'}</td>
             <td>${onlineUser.userRole}</td>
             <td>${onlineUser.userStringId}</td>
             <td>${onlineUser.userEmail}</td>
             <td>${onlineUser.loginTime}</td>
             <td style="text-align:center;">${onlineUser.activeUser == 1?'<span style="color: green"><i class="fa fa-circle"></i></span>':onlineUser.activeUser == 2?'<span style="color: red"><i class="fa fa-circle"></i></span>':''}</td>
         </tr>`;
		}
	}
	return html;
}
