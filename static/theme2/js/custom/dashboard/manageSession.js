function advanceManageSessionSearchReset(formId){
	$('#' + formId)[0].reset();
	$("#"+formId+" #standardId").val(" ").trigger('change');
	$("#"+formId+" #activeSession").val("ALL").trigger('change');
}

function advanceManageSessionSearch(formId,moduleId, userId, userRole){
	checkTextBox(formId);
	var argument='?moduleId='+moduleId+'&schoolId='+SCHOOL_ID+'&'+decodeURIComponent($('#'+formId).serialize());
	manageSessionData('manageStudentSession',argument, userId, userRole);
}

function manageSessionData(elementId, argument, userId, role){
	var url="/dashboard/student-manage-session-content"+argument;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : CONTEXT_PATH+UNIQUEUUID+url.split('?')[0],
		data : JSON.stringify(parseUrlToJson(url)),
		dataType : 'json',
		success : function(data) {
			$('#'+elementId+' > tbody').html('');
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
				$('#manageSessionUserContentDiv').html(manageSessionTable(elementId,role));
				$('#'+elementId+' > tbody').append(getManageSessionTableBody(data.sessions, userId, role));
				var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
				if(isDataTable){
					$('#'+elementId).dataTable().fnDestroy();
				}
				$('#'+elementId).DataTable();
			}
			return false;
		}
	});
	bindHover();
}


