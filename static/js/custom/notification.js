function callForCount(userId, schoolId) {
	$.ajax({
		type : "POST",
		url : getURLFor('dashboard', 'notification-log-activity'),
		data : JSON.stringify(getRequestForCount(userId, schoolId)),
		dataType : 'json',
		contentType : "application/json",
		success : function(htmlContent) {
			if (htmlContent != "") {
				$(".app-main__inner").html(htmlContent);
				/* element.find("counting").remove(); */
				$("#counting").remove();
				/* $("#notify-box").find("#counting").remove(); */
			}
		}
	});
}
function getRequestForCount(userId, schoolId) {
	var notificationLogRequestDTO = {};
	var notificationLogDTO = {};
	notificationLogDTO['userId'] = userId;
	notificationLogDTO['schoolId'] = schoolId;
	notificationLogRequestDTO['controlType'] = "SEEN";
	notificationLogRequestDTO['notificationLogDTO'] = notificationLogDTO;
	return notificationLogRequestDTO;
}