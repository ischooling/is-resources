function callMeetingRecordingSummary(leadid, leadno) {
	data={};
	data['leadid']=leadid;
	data['userId']=USER_ID;

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-meeting-recordings-summary'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
        console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				$("#demosummaryleadno").text(leadno)
				$("#demosummarytxt").html(formatOpenAIText(data.demoDetailsummary))
				$("#demodetailsummary").modal('show')
			}
		}
	});
}

function callLeadPredictList(requestId, startLimit, batchSize) {
	var request = {};
	request['request_id'] = requestId;
	request['start_limit'] = startLimit
	request['batch_size'] = batchSize;
	

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-lead-predict-list'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log(data)
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			}else{
				renderPredictTableRows(data)
			}
			
		},
		error : function(err) {
			console.log(err)
		}
	});
}

function callLeadLogData(leadNo, leadType, callbackFn) {
	var request = {};
	request['userId'] = USER_ID;
	request['schoolId'] = SCHOOL_ID;
	request['leadNo'] = leadNo;
	request['leadType'] = leadType || 'B2C';
	request['moduleId'] = typeof MODULE_ID !== 'undefined' ? MODULE_ID : 0;
	

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-lead-log-data'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
				return;
			}
			if (typeof callbackFn === 'function') {
				callbackFn(data);
			}
		},
		error : function(err) {
			console.log(err);
		}
	});
}


function submitLeadReminder(leadId) {
  var leadId = $("#leadReminderLeadId").val();
  var reminderTitle = ($("#reminderTitle").val() || "").trim();
  var reminderDate = ($("#reminderDate").val() || "").trim();
  var reminderTime = ($("#reminderTime").val() || "").trim();
  var reminderTimeParts = getReminderTimeParts(reminderTime);

  if (!leadId) {
    showMessageTheme2(0, "Lead id is missing", "", true);
    return false;
  }
  if (!reminderTitle) {
    showMessageTheme2(0, "Please enter reminder title", "", true);
    return false;
  }
  if (!reminderDate) {
    showMessageTheme2(0, "Please select date", "", true);
    return false;
  }
  if (!reminderTimeParts) {
    showMessageTheme2(0, "Please select valid time", "", true);
    return false;
  }

  $("#saveLeadReminder").prop("disabled", true).text("Saving...");
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("leads", "/reminders"),
    data: JSON.stringify({
      entityId:leadId,
      entityType:"LEAD",
      reminderTitle: reminderTitle,
      reminderDate: reminderDate,
      reminderHours: reminderTimeParts.hours,
      reminderMins: reminderTimeParts.mins,
      reminderAMPM: reminderTimeParts.ampm,
      userId: USER_ID,
	  schoolId: SCHOOL_ID
    }),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      $("#saveLeadReminder").prop("disabled", false).text("Save reminder");
      if (data["statusCode"] == "0" || data["statusCode"] == "2") {
        showMessageTheme2(0, data["message"], "", true);
      } else {
        showMessageTheme2(1, data["message"], "", true);
        $("#leadReminderPopupForm").modal("hide");
      }
    },
    error: function () {
      $("#saveLeadReminder").prop("disabled", false).text("Save reminder");
      showMessageTheme2(0, TECHNICAL_GLITCH, "", true);
    },
  });
}

function getReminderTimeParts(reminderTime) {
  if (!reminderTime) {
    return null;
  }
  var trimmedTime = reminderTime.replace(/\s+/g, " ").trim();
  var timeWithMeridian = trimmedTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (timeWithMeridian) {
    var hour12 = parseInt(timeWithMeridian[1], 10);
    var minute12 = parseInt(timeWithMeridian[2], 10);
    if (hour12 < 1 || hour12 > 12 || minute12 < 0 || minute12 > 59) {
      return null;
    }
    return {
      hours: hour12 < 10 ? "0" + hour12 : "" + hour12,
      mins: minute12 < 10 ? "0" + minute12 : "" + minute12,
      ampm: timeWithMeridian[3].toUpperCase(),
    };
  }
  var time24Hour = trimmedTime.match(/^(\d{1,2}):(\d{2})$/);
  if (!time24Hour) {
    return null;
  }
  var hour24 = parseInt(time24Hour[1], 10);
  var minute24 = parseInt(time24Hour[2], 10);
  if (hour24 < 0 || hour24 > 23 || minute24 < 0 || minute24 > 59) {
    return null;
  }
  var meridian = hour24 >= 12 ? "PM" : "AM";
  var convertedHour = hour24 % 12;
  if (convertedHour === 0) {
    convertedHour = 12;
  }
  return {
    hours: convertedHour < 10 ? "0" + convertedHour : "" + convertedHour,
    mins: minute24 < 10 ? "0" + minute24 : "" + minute24,
    ampm: meridian,
  };
}

function openLeadReminderListPopup(leadId, leadNo) {
  $("#leadReminderListLeadId").val(leadId || 0);
  $("#leadReminderListLeadNo").text(leadNo || "N/A");
  $("#leadReminderListPopupForm").modal("show");
  fetchLeadReminderList();
}

function fetchLeadReminderList() {
  var leadId = parseInt($("#leadReminderListLeadId").val() || "0", 10);
  if (!leadId) {
    showMessageTheme2(0, "Lead id is missing", "", true);
    return;
  }
  $("#leadReminderListBody").html('<tr><td colspan="4" class="text-center">Loading...</td></tr>');
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor("leads", "get-lead-reminder-list"),
    data: JSON.stringify({
      leadId: leadId,
    }),
    dataType: "json",
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data["statusCode"] == "0" || data["statusCode"] == "2") {
        showMessageTheme2(0, data["message"], "", true);
        $("#leadReminderListBody").html('<tr><td colspan="4" class="text-center">No reminders set for this lead</td></tr>');
        $("#leadReminderListTableWrapper").removeAttr("style");
        return;
      }
      renderLeadReminderListRows(data["reminderList"] || []);
    },
    error: function () {
      $("#leadReminderListBody").html('<tr><td colspan="4" class="text-center">No reminders set for this lead</td></tr>');
      showMessageTheme2(0, TECHNICAL_GLITCH, "", true);
      $("#leadReminderListTableWrapper").removeAttr("style");
    },
  });
}

function renderLeadReminderListRows(reminderList) {
  var html = "";
  if (!reminderList || reminderList.length === 0) {
    html = '<tr><td colspan="4" class="text-center">No reminders set for this lead</td></tr>';
    $("#leadReminderListBody").html(html);
    $("#leadReminderListTableWrapper").removeAttr("style");
    return;
  }
  for (var i = 0; i < reminderList.length; i++) {
    var reminder = reminderList[i] || {};
    html += "<tr>";
    html += "<td>" + (reminder.reminderTitle || "N/A") + "</td>";
    html += "<td>" + (reminder.reminderDateTime || "N/A") + "</td>";
    html += "<td>" + (reminder.status || "N/A") + "</td>";
    html += "<td>" + (reminder.createdBy || "N/A") + "</td>";
    html += "</tr>";
  }
  $("#leadReminderListBody").html(html);
  if (reminderList.length > 20) {
    $("#leadReminderListTableWrapper").css({
      "max-height": "460px",
      "overflow-y": "auto"
    });
  } else {
    $("#leadReminderListTableWrapper").removeAttr("style");
  }
}
