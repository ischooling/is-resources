function callForCount(userId, schoolId) {
	$.ajax({
		type: "POST",
		url: getURLFor("dashboard", "notification-log-activity"),
		data: JSON.stringify(getRequestForCount(userId, schoolId)),
		dataType: "json",
		contentType: APPLICATION_JSON_VALUE,
		success: function (htmlContent) {
			if (htmlContent !== "") {
				$("#hideBlinking").removeClass("icon-anim-pulse");
				$("#hideRedDot").removeClass("badge-danger");
			}
		}
	});
}

function getRequestForCount(userId, schoolId) {
	var notificationLogRequestDTO = {};
	var notificationLogDTO = {};
	notificationLogDTO["userId"] = userId;
	notificationLogDTO["schoolId"] = schoolId;
	notificationLogRequestDTO["controlType"] = "SEEN";
	notificationLogRequestDTO["notificationLogDTO"] = notificationLogDTO;
	return notificationLogRequestDTO;
}

