function getRecurringClassesData(formId, elementId) {
	customLoader(true);
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/dashboard/teacher-recurring-class-content/",
		data: JSON.stringify(getRecurringBody(formId)),
		dataType: 'json',
		global: false,
		success: function (data) {
			$('#' + elementId + ' > tbody').html('');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					if (tt == 'theme1') {
						showMessage(false, data['message']);
					} else {
						showMessageTheme2(0, data['message'], '', true);
					}
				}
			} else {
				$('#manageRecurringClassesList').html(getRecurringClassesTable(elementId));
				$('#' + elementId + ' > tbody').append(getRecurringClassesBodyData(data.dataList));
				var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
				if (isDataTable) {
					$('#' + elementId).dataTable().fnDestroy();
				}
				$('#' + elementId).DataTable();
			}
			customLoader(false);
			return false;
		},
		error: function (e) {
			if (checkonlineOfflineStatus()) {
				return;
			}else{
				return false;
			}
		}
	});
	bindHover();
}

function getActiveSessionReset(formId) {
    $("#" + formId + " #startDate").val('').trigger('change');
    $("#" + formId + " #endDate").val('').trigger('change');
    $("#" + formId + " #activeSession").val('').trigger('change');
    $("#" + formId + " #filterEnrollType").val('').trigger('change');
    $("#" + formId + " #standardId").val('').trigger('change');
    $("#" + formId + " #createdBy").val('').trigger('change');
    $("#" + formId + " #pageSize").val('25');
	$("#" + formId + " #activeSession").val('0').trigger('change');
}

function getRecurringBody(formId) {
    var request = {};
    var recurringDTO = {};
    recurringDTO['activeSession'] = $('#' + formId + ' #activeSession').val();
    recurringDTO['startDate'] = $("#" + formId + " #startDate").val();
    recurringDTO['endDate'] = $("#" + formId + " #endDate").val();
    recurringDTO['filterEnrollType'] = $("#" + formId + " #filterEnrollType").val();
    recurringDTO['standardId'] = $("#" + formId + " #standardId").val();
    recurringDTO['pageSize'] = $("#" + formId + " #pageSize").val();
    recurringDTO['createdBy'] = $("#" + formId + " #createdBy").val();
    recurringDTO['studentName'] = $("#" + formId + " #studentName").val();
	recurringDTO['teacherId'] = USER_ID
    request['recurringDTO']=recurringDTO;
	request['schoolId'] = SCHOOL_ID;
    return request;
}

function toggleFilter(elementId){
	$('#'+elementId).stop().slideToggle();
}

function recurringMail(recurringClassId,moduleId) {
	hideMessage('');
	var data={};
	data['recurringClassId']=recurringClassId;
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','recurring-mail-admin-student'),
		data : JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(false, data['message']);
				setTimeout(function (){callDashboardPageSchool(moduleId,'teacher-recurring-class-content');},1000);
			}
			return false;
		},
		error : function(e) {
			return false;
		}
	});
}