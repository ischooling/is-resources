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
				$("#demosummarytxt").html(renderDemoDetailSummaryPopup(data.demoDetailsummary, leadno))
				$("#demodetailsummary").modal('show')
			}
		}
	});
}

function loadAutomatedFollowupPopupData(leadId, leadNo, followupAction, extraParams) {
  if (!leadId && !leadNo) {
    $("#automatedFollowupPopupBody").html(getAutomatedFollowupErrorHtml("Lead id or lead no is required."));
    return;
  }

  var schoolPath = (typeof SCHOOL_UUID !== "undefined" && SCHOOL_UUID) ? SCHOOL_UUID : ((typeof SCHOOL_ID !== "undefined" && SCHOOL_ID) ? SCHOOL_ID : "");
  var action = String(followupAction || "").toUpperCase();
  var extra  = extraParams || {};
  var request = {
    schoolId:           SCHOOL_ID,
    leadId:             leadId ? parseInt(leadId, 10) : null,
    leadNo:             leadNo || "",
    dryRun:             (action === "SEND_NOW") ? false : true,
    requestSource:      "",
    testEmail:          "",
    followupAction:     action,
    templateMode:       extra.templateMode   || null,
    selectedTemplateId: extra.selectedTemplateId ? parseInt(extra.selectedTemplateId, 10) : null,
    customBody:         extra.customBody     || null,
    customSubject:      extra.customSubject  || null,
    selectedMediaIds:   (Array.isArray(extra.selectedMediaIds) && extra.selectedMediaIds.length) ? extra.selectedMediaIds : null,
    selectedFileUrls:   (Array.isArray(extra.selectedFileUrls) && extra.selectedFileUrls.length) ? extra.selectedFileUrls : null
  };

  $.ajax({
    type: "POST",
    url: BASE_URL + CONTEXT_PATH + schoolPath + "/dashboard/lead-automation-followup/process",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(request),
    success: function (response) {
      var data = typeof response === "string" ? JSON.parse(response) : response;
      updateAutomatedFollowupActionState(data);
      $("#automatedFollowupPopupBody").html(renderAutomatedFollowupPopup(data));
      setTimeout(function () {
        if (typeof initAutomatedFollowupBodyEditor === "function") {
          var st = window.AUTOMATED_FOLLOWUP_STATE || {};
          initAutomatedFollowupBodyEditor(st.initialBody || "");
        }
      }, 0);
      // Show centered success/error popup for action buttons
      if (action === "SEND_NOW" || action === "RESUME" || action === "PAUSE" || action === "SKIP") {
        var isSuccess = data && data.status === "SUCCESS";
        var msgMap = { SEND_NOW: "Follow-up sent successfully.", RESUME: "Follow-up resumed successfully.", PAUSE: "Follow-up paused successfully.", SKIP: "Follow-up skipped successfully." };
        var msg = isSuccess ? (msgMap[action] || "Action completed successfully.") : ((data && data.message) || "Action failed.");
        if (typeof window.showMessageTheme2 === "function") {
          window.showMessageTheme2(isSuccess ? 1 : 0, msg, "", true);
        }
      }
    },
    error: function () {
      $("#automatedFollowupPopupBody").html(getAutomatedFollowupErrorHtml("Unable to load automated follow-up preview."));
      if (action === "SEND_NOW" || action === "RESUME" || action === "PAUSE" || action === "SKIP") {
        if (typeof window.showMessageTheme2 === "function") {
          window.showMessageTheme2(0, "Unable to process the action. Please try again.", "", true);
        }
      }
    }
  });
}

function renderDemoDetailSummaryPopup(rawSummary, leadNo) {
  var summaryObj = parseDemoSummaryJson(rawSummary);
  if (!summaryObj) {
    return renderPlainTextSummaryPopup(rawSummary, leadNo);
  }

  var summaryText = summaryObj.summary || "";
  var executiveSummary = summaryObj.executive_summary || "";
  var ceoInsights = summaryObj.ceo_insights || {};
  var overallScore = summaryObj.overall_score || summaryObj.final_score || "";
  var evaluation = summaryObj.evaluation || {};
  var sectionOrder = [
    { key: "rapport_building", label: "Rapport Building" },
    { key: "trust_building", label: "Trust Building" },
    { key: "pain_point", label: "Pain Point" },
    { key: "understanding_parent_child", label: "Understanding Parent/Child" },
    { key: "understanding_of_parent_about_child", label: "Understanding Parent/Child" },
    { key: "solution", label: "Solution Given" },
    { key: "solution_given", label: "Solution Given" },
    { key: "recommended_program", label: "Recommended Program" },
    { key: "fee_structure", label: "Fee Structure" },
    { key: "closing", label: "Closing" }
  ];

  var html = '<div style="padding:8px;background:#f8f9fb;border-radius:12px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
  html += '<h4 style="margin:0;font-weight:700;">Meeting Analysis</h4>';
  html += '<span style="background:#0d6efd;color:#fff;padding:6px 10px;border-radius:20px;font-weight:600;">Lead: ' + escapeHtml(leadNo || "N/A") + "</span>";
  html += "</div>";

  if (summaryText) {
    html += '<div style="background:#fff;border:1px solid #e4e7ec;border-radius:10px;padding:12px;margin-bottom:12px;">';
    html += '<div style="font-size:12px;color:#667085;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Summary</div>';
    html += '<div style="font-size:14px;line-height:1.55;color:#1f2937;">' + formatTextWithLineBreaks(summaryText) + "</div>";
    html += "</div>";
  }

  if (executiveSummary) {
    html += '<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:12px;margin-bottom:12px;">';
    html += '<div style="font-size:12px;color:#9a3412;font-weight:700;text-transform:uppercase;margin-bottom:6px;">Executive Summary</div>';
    html += '<div style="font-size:14px;line-height:1.55;color:#7c2d12;">' + formatTextWithLineBreaks(executiveSummary) + "</div>";
    html += "</div>";
  }

  if (ceoInsights && (ceoInsights.strategic_impact || ceoInsights.business_value || ceoInsights.conversion_probability !== undefined)) {
    html += '<div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:10px;padding:12px;margin-bottom:12px;">';
    html += '<div style="font-size:12px;color:#0e7490;font-weight:700;text-transform:uppercase;margin-bottom:6px;">CEO Insights</div>';
    if (ceoInsights.strategic_impact) {
      html += '<div style="font-size:13px;line-height:1.5;color:#155e75;margin-bottom:6px;"><b>Strategic Impact:</b> ' + formatTextWithLineBreaks(ceoInsights.strategic_impact) + "</div>";
    }
    if (ceoInsights.business_value) {
      html += '<div style="font-size:13px;line-height:1.5;color:#155e75;margin-bottom:6px;"><b>Business Value:</b> ' + formatTextWithLineBreaks(ceoInsights.business_value) + "</div>";
    }
    if (ceoInsights.conversion_probability !== undefined) {
      var cp = parseFloat(ceoInsights.conversion_probability);
      var cpDisplay = isNaN(cp) ? escapeHtml(String(ceoInsights.conversion_probability)) : (cp > 10 ? (Math.round((cp / 10) * 10) / 10) : (Math.round(cp * 10) / 10));
      html += '<div style="font-size:13px;line-height:1.5;color:#155e75;"><b>Conversion Probability:</b> ' + escapeHtml(String(cpDisplay)) + '/10</div>';
    }
    html += "</div>";
  }

  if (overallScore !== "") {
    html += '<div style="margin-bottom:12px;"><span style="background:#16a34a;color:#fff;padding:6px 12px;border-radius:8px;font-weight:700;">Overall Score: ' + escapeHtml(String(overallScore)) + "</span></div>";
  }

  html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px;margin-bottom:12px;">';
  var rendered = {};
  for (var i = 0; i < sectionOrder.length; i++) {
    var secKey = sectionOrder[i].key;
    var sec = evaluation[secKey];
    if (!sec || rendered[sectionOrder[i].label]) continue;
    rendered[sectionOrder[i].label] = true;
    html += '<div style="background:#fff;border:1px solid #e4e7ec;border-radius:10px;padding:12px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">';
    html += '<div style="font-weight:700;font-size:14px;">' + escapeHtml(sectionOrder[i].label) + "</div>";
    html += '<span style="background:#eff6ff;color:#1d4ed8;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700;">' + escapeHtml(String(sec.score || 0)) + "/10</span>";
    html += "</div>";
    html += '<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">Observation</div>';
    html += '<div style="font-size:13px;line-height:1.5;color:#374151;margin-bottom:8px;">' + formatTextWithLineBreaks(sec.observation || sec.details || "") + "</div>";
    html += renderLineItems("Strengths", sec.strengths, "#166534");
    html += renderLineItems("Improvements", sec.improvements, "#92400e");
    html += renderLineItems("Weaknesses", sec.weaknesses, "#991b1b", "No critical weakness identified.");
    html += "</div>";
  }
  html += "</div>";

  html += renderListBlock("Strengths", summaryObj.strengths);
  html += renderListBlock("Improvements", summaryObj.improvements);
  html += renderListBlock("Final Recommendations", summaryObj.final_recommendations || summaryObj.recommendations);
  html += "</div>";
  return html;
}

function renderPlainTextSummaryPopup(rawSummary, leadNo) {
  var text = normalizeRawSummaryText(rawSummary);
  if (!text) {
    return formatOpenAIText(rawSummary);
  }

  var sectionRegex = /^([A-K])\.\s+(.+)$/i;
  var lines = text.split(/\r?\n/);
  var sections = [];
  var current = null;

  for (var i = 0; i < lines.length; i++) {
    var line = (lines[i] || "").trim();
    if (!line) continue;
    var match = line.match(sectionRegex);
    if (match) {
      if (current) sections.push(current);
      current = { key: match[1].toUpperCase(), title: match[2], lines: [] };
    } else {
      if (!current) {
        current = { key: "X", title: "Summary", lines: [] };
      }
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  if (!sections.length) {
    return formatOpenAIText(rawSummary);
  }

  var html = '<div style="padding:10px;background:#f8f9fb;border-radius:12px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
  html += '<h4 style="margin:0;font-weight:700;color:#111827;">Meeting Analysis</h4>';
  html += '<span style="background:#0d6efd;color:#fff;padding:6px 10px;border-radius:20px;font-weight:600;">Lead: ' + escapeHtml(leadNo || "N/A") + "</span>";
  html += "</div>";

  for (var s = 0; s < sections.length; s++) {
    html += renderPlainTextSectionBlock(sections[s], s + 1);
  }

  html += "</div>";
  return html;
}

function renderPlainTextSectionBlock(section, index) {
  var title = section.title || ("Section " + index);
  var lines = section.lines || [];
  var scoreValue = "";
  var scoreLineIndex = -1;

  for (var i = 0; i < lines.length; i++) {
    var scoreMatch = lines[i].match(/(?:overall score|score|probability)\s*:\s*([0-9]+(?:\.[0-9]+)?(?:\s*\/\s*10|%)?)/i);
    if (scoreMatch) {
      scoreValue = scoreMatch[1].replace(/\s+/g, " ");
      scoreLineIndex = i;
      break;
    }
  }

  var html = '<div style="background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin-bottom:10px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
  html += '<div style="font-size:11px;color:#6b7280;font-weight:700;">' + (index < 10 ? "0" + index : index) + '</div>';
  html += '<div style="font-size:16px;font-weight:700;color:#111827;flex:1;margin-left:8px;">' + escapeHtml(title) + '</div>';
  if (scoreValue) {
    html += '<span style="background:#ecfdf3;color:#166534;padding:3px 9px;border-radius:999px;font-size:12px;font-weight:700;">' + escapeHtml(scoreValue) + "</span>";
  }
  html += '</div>';

  var bulletItems = [];
  var numberedItems = [];
  var paragraphs = [];
  for (var j = 0; j < lines.length; j++) {
    if (j === scoreLineIndex) continue;
    var ln = lines[j];
    if (/^-\s+/.test(ln)) {
      bulletItems.push(ln.replace(/^-\s+/, ""));
    } else if (/^\d+\.\s+/.test(ln)) {
      numberedItems.push(ln.replace(/^\d+\.\s+/, ""));
    } else {
      paragraphs.push(ln);
    }
  }

  if (paragraphs.length) {
    html += '<div style="font-size:13px;line-height:1.55;color:#374151;margin-bottom:8px;">' + escapeHtml(paragraphs.join(" ")).replace(/\n/g, "<br/>") + "</div>";
  }
  if (numberedItems.length) {
    html += "<ol style=\"margin:0 0 8px 18px;padding:0;\">";
    for (var n = 0; n < numberedItems.length; n++) {
      html += '<li style="font-size:13px;line-height:1.5;color:#1f2937;margin-bottom:4px;">' + escapeHtml(numberedItems[n]) + "</li>";
    }
    html += "</ol>";
  }
  if (bulletItems.length) {
    html += "<ul style=\"margin:0;padding-left:18px;\">";
    for (var b = 0; b < bulletItems.length; b++) {
      html += '<li style="font-size:13px;line-height:1.5;color:#1f2937;margin-bottom:4px;">' + escapeHtml(bulletItems[b]) + "</li>";
    }
    html += "</ul>";
  }

  html += "</div>";
  return html;
}

function normalizeRawSummaryText(rawSummary) {
  if (rawSummary === null || rawSummary === undefined) return "";
  var text = String(rawSummary);
  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      text = JSON.parse(text);
    } catch (e) {}
  }
  text = text.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\"/g, '"');
  text = text.replace(/([.!?])\s+([A-K]\.\s+[A-Za-z])/g, "$1\n$2");
  return text.trim();
}

function parseDemoSummaryJson(rawSummary) {
  if (!rawSummary || typeof rawSummary !== "string") return null;
  var text = rawSummary.trim();
  try {
    return JSON.parse(text);
  } catch (e1) {
    try {
      if (text.startsWith('"') && text.endsWith('"')) {
        text = JSON.parse(text);
      }
      return JSON.parse(text);
    } catch (e2) {
      return null;
    }
  }
}

function renderListBlock(title, items) {
  if (!Array.isArray(items) || items.length === 0) return "";
  var html = '<div style="background:#fff;border:1px solid #e4e7ec;border-radius:10px;padding:12px;margin-bottom:10px;">';
  html += '<div style="font-size:12px;color:#667085;font-weight:700;text-transform:uppercase;margin-bottom:8px;">' + escapeHtml(title) + "</div>";
  html += "<ul style=\"margin:0;padding-left:18px;\">";
  for (var i = 0; i < items.length; i++) {
    html += '<li style="margin-bottom:6px;font-size:13px;line-height:1.5;color:#374151;">' + escapeHtml(items[i]) + "</li>";
  }
  html += "</ul></div>";
  return html;
}

function renderTagListInline(title, items, bgColor, textColor) {
  if (!Array.isArray(items) || items.length === 0) return "";
  var html = '<div style="margin-bottom:6px;">';
  html += '<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">' + escapeHtml(title) + "</div>";
  for (var i = 0; i < items.length; i++) {
    html += '<span style="display:inline-block;background:' + bgColor + ';color:' + textColor + ';padding:3px 8px;border-radius:999px;font-size:11px;margin:0 6px 6px 0;">' + escapeHtml(items[i]) + "</span>";
  }
  html += "</div>";
  return html;
}

function renderLineItems(title, items, color, emptyText) {
  var html = '<div style="margin-bottom:6px;">';
  html += '<div style="font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:4px;">' + escapeHtml(title) + "</div>";
  if (!Array.isArray(items) || items.length === 0) {
    if (emptyText) {
      html += '<div style="font-size:12px;color:#6b7280;line-height:1.4;">' + escapeHtml(emptyText) + "</div>";
    }
    html += "</div>";
    return html;
  }
  html += "<ul style=\"margin:0;padding-left:18px;\">";
  for (var i = 0; i < items.length; i++) {
    html += '<li style="margin-bottom:4px;font-size:12px;line-height:1.45;color:' + color + ';">' + escapeHtml(items[i]) + "</li>";
  }
  html += "</ul></div>";
  return html;
}

function formatTextWithLineBreaks(text) {
  return escapeHtml(text || "").replace(/\n/g, "<br/>");
}

function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

// =============================================
// LEAD ENROLLMENT HOLD — AJAX Functions
// =============================================

/**
 * Fetch existing hold data for a lead (called when modal opens)
 */
function fetchLeadEnrollmentHold(leadId) {
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor('leads', 'get-enrollment-hold'),
    data: JSON.stringify({ leadId: parseInt(leadId) }),
    dataType: 'json',
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data && data.statusCode == '1' && data.holdData) {
        var holdData = data.holdData;
        var ah = holdData.activeHold;
        var appliedLockHours = (ah && ah.lockHours) ? ah.lockHours : ($("#holdEnrollLockHours").val() || "72");

        $("#holdEnrollBestTimeDate").val(holdData.bestTimeDate || '');
        $("#holdEnrollBestTimeHH").val(holdData.bestTimeHH || '00');
        $("#holdEnrollBestTimeMM").val(holdData.bestTimeMM || '00');
        $("#holdEnrollBestTimeAMPM").val(holdData.bestTimeAMPM || 'AM');
        try {
          $("#holdEnrollBestTimeDate").datepicker("update", holdData.bestTimeDate || '');
        } catch (e) {}

        if (ah && ah.lockHours) {
          // Show lock details section
          var statusBadge = '';
          if (ah.holdStatus === 'ACTIVE') statusBadge = '<span class="badge badge-success">ACTIVE</span>';
          else if (ah.holdStatus === 'EXPIRED') statusBadge = '<span class="badge badge-secondary">EXPIRED</span>';
          else if (ah.holdStatus === 'RELEASED') statusBadge = '<span class="badge badge-warning">RELEASED</span>';
          else statusBadge = ah.holdStatus || '-';

          $("#holdLockStatusDisplay").html(statusBadge);
          $("#holdLockHoursDisplay").text(ah.lockHours + ' hrs');
          $("#holdLockDateDisplay").text(ah.holdDate || '-');
          $("#holdLockExpiryDisplay").text(ah.expiryDate || '-');
          $("#holdLockInfoSection").removeClass("d-none");

          if (holdData.hasActiveHold) {
            renderActiveHoldBanner(holdData, ah, false);
            $("#holdActiveInfoBanner").removeClass("d-none");
            $("#saveEnrollmentHoldBtn").prop("disabled", true).text("Hold Already Active");
            $("#holdEnrollLockHours").val(ah.lockHours);
          }
        }
        if (typeof refreshHoldEnrollmentBestTimePicker === "function") {
          refreshHoldEnrollmentBestTimePicker(appliedLockHours, true);
        }
      }
    },
    error: function () {
      console.error("Error fetching enrollment hold data");
    }
  });
}

/**
 * Save enrollment hold
 */
function saveLeadEnrollmentHold() {
  var leadId = $("#holdEnrollLeadId").val();
  if (!leadId || leadId == '0') {
    showMessageTheme2(0, "Lead ID is missing", "", true);
    return;
  }

  var bestTimeDate = $("#holdEnrollBestTimeDate").val() || '';
  if (!bestTimeDate) {
    showMessageTheme2(0, "Best time to connect date is required", "", true);
    return;
  }

  var bestTimeMoment = getHoldBestTimeMomentFromForm();
  if (!bestTimeMoment) {
    showMessageTheme2(0, "Best time to connect is invalid", "", true);
    return;
  }
  if (!bestTimeMoment.isAfter(moment())) {
    showMessageTheme2(0, "Best time to connect should be a future date and time", "", true);
    return;
  }

  var lockHours = $("#holdEnrollLockHours").val() || '72';
  var standard = $("#holdEnrollGrade").val() || '';

  $("#saveEnrollmentHoldBtn").prop("disabled", true).text("Saving...");

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor('leads', 'save-enrollment-hold'),
    data: JSON.stringify({
      leadId: parseInt(leadId),
      lockHours: parseInt(lockHours),
      fName: $("#holdEnrollFname").val() || '',
      mName: $("#holdEnrollMname").val() || '',
      lName: $("#holdEnrollLname").val() || '',
      standard: standard ? parseInt(standard) : 0,
      email: $("#holdEnrollEmail").val() || '',
      isdCode: $("#holdEnrollIsdCode").val() || '',
      isdCodeIso: $("#holdEnrollIsdCodeIso").val() || '',
      phoneNo: $("#holdEnrollPhone").val() || '',
      alterEmail: $("#holdEnrollAltEmail").val() || '',
      alterIsdCode: $("#holdEnrollAltIsdCode").val() || '',
      alterIsdCodeIso: $("#holdEnrollAltIsdCodeIso").val() || '',
      alterPhoneNo: $("#holdEnrollAltPhone").val() || '',
      bestTimeDate: bestTimeDate,
      bestTimeHH: $("#holdEnrollBestTimeHH").val() || '00',
      bestTimeMM: $("#holdEnrollBestTimeMM").val() || '00',
      bestTimeAMPM: $("#holdEnrollBestTimeAMPM").val() || 'AM'
    }),
    dataType: 'json',
    cache: false,
    timeout: 600000,
    success: function (data) {
      $("#saveEnrollmentHoldBtn").prop("disabled", false).text("Hold Enrollment");
      if (data && (data.statusCode == '1')) {
        var createdHold = data.hold || {
          lockHours: data.lockHours || lockHours,
          expiryDate: data.lockExpiryDate || '',
          bestTimeDisplay: getHoldBestTimeDisplayFromForm()
        };
        // showMessageTheme2(1, data.message || "Enrollment held successfully", "", true);
        setHoldEnrollmentTimerOnlyMode(true);
        renderActiveHoldBanner(createdHold, createdHold, true);
        $("#holdActiveInfoBanner").removeClass("d-none");
        // Add hold indicator to the lead row
        updateLeadHoldIndicator(leadId, true, createdHold);
        updateLeadHoldLeadSummary(leadId);
      } else {
        showMessageTheme2(0, data.message || "Failed to save hold", "", true);
        // If there's existing hold info, show it
        if (data.existingHold) {
          fetchLeadEnrollmentHold(leadId);
        }
      }
    },
    error: function () {
      $("#saveEnrollmentHoldBtn").prop("disabled", false).text("Hold Enrollment");
      showMessageTheme2(0, typeof TECHNICAL_GLITCH !== 'undefined' ? TECHNICAL_GLITCH : "Technical error occurred", "", true);
    }
  });
}

/**
 * Release active enrollment hold
 */
function releaseEnrollmentHoldAction() {
  var leadId = $("#holdEnrollLeadId").val();
  if (!leadId || leadId == '0') {
    showMessageTheme2(0, "No active hold to release", "", true);
    return;
  }
  if (!confirm("Are you sure you want to release this enrollment hold?")) return;

  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLFor('leads', 'release-enrollment-hold'),
    data: JSON.stringify({
      leadId: parseInt(leadId)
    }),
    dataType: 'json',
    cache: false,
    timeout: 600000,
    success: function (data) {
      if (data && data.statusCode == '1') {
        showMessageTheme2(1, data.message || "Hold released", "", true);
        // Re-enable form
        $("#holdActiveInfoBanner").addClass("d-none");
        setHoldEnrollmentTimerOnlyMode(false);
        clearLeadHoldTimer("modalActiveHold");
        $("#saveEnrollmentHoldBtn").prop("disabled", false).text("Hold Enrollment");
        // Remove hold indicator from lead row
        updateLeadHoldIndicator(leadId, false);
      } else {
        showMessageTheme2(0, data.message || "Failed to release hold", "", true);
      }
    },
    error: function () {
      showMessageTheme2(0, typeof TECHNICAL_GLITCH !== 'undefined' ? TECHNICAL_GLITCH : "Technical error occurred", "", true);
    }
  });
}

/**
 * Update hold indicator on lead row (purple lock badge beside lead number)
 */
function updateLeadHoldIndicator(leadId, hasHold, lockHours, lockExpiryDate) {
  var holdData = {};
  if (typeof lockHours === "object" && lockHours !== null) {
    holdData = lockHours;
  } else {
    holdData = {
      lockHours: lockHours || "",
      expiryDate: lockExpiryDate || ""
    };
  }

  if (hasHold) {
    renderLeadHoldIndicator(leadId, holdData);
  } else {
    clearLeadHoldIndicator(leadId);
  }
}

var leadHoldTimerMap = {};

function clearLeadHoldTimer(timerKey) {
  if (leadHoldTimerMap[timerKey]) {
    clearInterval(leadHoldTimerMap[timerKey]);
    delete leadHoldTimerMap[timerKey];
  }
}

function getLeadHoldExpiryMoment(holdData) {
  var expiryText = (holdData && (holdData.expiryDate || holdData.lockExpiryDate)) || "";
  return moment(expiryText, [
    "MMM DD, YYYY hh:mm A",
    "MMM DD, YYYY hh:mm a",
    "DD MMM YYYY hh:mm A",
    "DD MMM YYYY hh:mm a"
  ], true);
}

function formatLeadHoldCountdown(totalSeconds) {
  var days = Math.floor(totalSeconds / 86400);
  var hours = Math.floor((totalSeconds % 86400) / 3600);
  var minutes = Math.floor((totalSeconds % 3600) / 60);
  var seconds = totalSeconds % 60;
  var parts = [];
  if (days > 0) {
    parts.push(days + (days === 1 ? " Day" : " Days"));
  }
  parts.push(hours + " Hrs");
  parts.push(minutes + " Mins");
  parts.push(seconds + " Secs");
  return parts.join(" ");
}

function startLeadHoldCountdownForTarget(timerKey, target, holdData) {
  if (!target || !target.length) {
    return;
  }

  clearLeadHoldTimer(timerKey);

  var expiryMoment = getLeadHoldExpiryMoment(holdData);
  if (!expiryMoment.isValid()) {
    target.text(holdData && holdData.timeRemaining ? holdData.timeRemaining : "N/A");
    return;
  }

  var updateCountdown = function() {
    var diffMs = expiryMoment.valueOf() - moment().valueOf();
    if (diffMs <= 0) {
      target.text("Hold expired");
      target.removeClass("text-danger text-success").addClass("text-danger");
      target.addClass("is-expired");
      clearLeadHoldTimer(timerKey);
      return;
    }

    var totalSeconds = Math.floor(diffMs / 1000);
    var totalHours = Math.floor(totalSeconds / 3600);
    target.text(formatLeadHoldCountdown(totalSeconds));
    target.removeClass("is-expired");
    target.removeClass("text-danger text-success")
      .addClass(totalHours < 6 ? "text-danger" : "text-success");
  };

  updateCountdown();
  leadHoldTimerMap[timerKey] = setInterval(updateCountdown, 1000);
}

function getHoldBestTimeDisplay(holdData) {
  if (!holdData) {
    return "";
  }
  return holdData.bestTimeDisplay || holdData.holdBestTimeDisplay || holdData.nextFollowupDate || "";
}

function getHoldBestTimeMomentFromForm() {
  var dateValue = $("#holdEnrollBestTimeDate").val() || "";
  if (!dateValue) {
    return null;
  }

  var hh = $("#holdEnrollBestTimeHH").val() || "00";
  var mm = $("#holdEnrollBestTimeMM").val() || "00";
  var ampm = $("#holdEnrollBestTimeAMPM").val() || "AM";
  var bestTimeMoment = moment(dateValue + " " + hh + ":" + mm + " " + ampm, "MM-DD-YYYY hh:mm A", true);
  return bestTimeMoment.isValid() ? bestTimeMoment : null;
}

function getHoldBestTimeDisplayFromForm() {
  var bestTimeMoment = getHoldBestTimeMomentFromForm();
  if (!bestTimeMoment) {
    return "";
  }
  return bestTimeMoment.format("MMM DD, YYYY hh:mm A");
}

function getHoldChildNameFromForm() {
  var nameParts = [
    $.trim($("#holdEnrollFname").val() || ""),
    $.trim($("#holdEnrollMname").val() || ""),
    $.trim($("#holdEnrollLname").val() || "")
  ].filter(function (value) {
    return value !== "";
  });
  return nameParts.length ? nameParts.join(" ") : "N/A";
}

function getHoldGradeDisplayFromForm() {
  var selectedValue = $("#holdEnrollGrade").val() || "";
  var selectedText = $.trim($("#holdEnrollGrade option:selected").text() || "");
  if (!selectedValue || !selectedText) {
    return "N/A";
  }
  return $.trim(selectedText.replace(/^Grade\s*/i, "")) || selectedText;
}

function updateLeadHoldLeadSummary(leadId) {
  $(".lead-child-name-" + leadId).text(getHoldChildNameFromForm());
  $(".lead-child-grade-" + leadId).text(getHoldGradeDisplayFromForm());
  $(".lead-summary-grade-" + leadId).text(getHoldGradeDisplayFromForm());
}

function setHoldEnrollmentTimerOnlyMode(enableTimerOnly) {
  $("#leadEnrollmentHoldPopupForm").toggleClass("hold-timer-only-mode", !!enableTimerOnly);
  $("#holdEnrollmentFormSection").toggleClass("d-none", !!enableTimerOnly);
  $("#saveEnrollmentHoldBtn").toggleClass("d-none", !!enableTimerOnly);
  $("#holdReleaseBtn").toggleClass("d-none", !!enableTimerOnly);
  $("#holdActiveInfoHeading").toggleClass("d-none", !!enableTimerOnly);
  $("#holdActiveInfoBanner").toggleClass("timer-only", !!enableTimerOnly);
  $("#holdEnrollmentCloseBtn").text(enableTimerOnly ? "Close" : "Cancel");
}

function renderActiveHoldBanner(holdData, activeHold, timerOnly) {
  var bestTimeDisplay = getHoldBestTimeDisplay(holdData);
  var timerId = "holdActiveInfoTimer";
  var lockHours = activeHold && activeHold.lockHours ? activeHold.lockHours : 0;
  var expiryDisplay = (activeHold && (activeHold.expiryDate || activeHold.lockExpiryDate)) || "-";
  var holdDateDisplay = (activeHold && activeHold.holdDate) || "-";
  var details = '';
  if (timerOnly) {
    details = ''
      + '<div class="hold-enrollment-timer-shell text-center">'
      +   '<div class="hold-enrollment-timer-badge">Enrollment Locked</div>'
      +   '<div class="hold-enrollment-timer-title">Enrollment Reserved Successfully</div>'
      +   '<div class="hold-enrollment-timer-card">'
      +     '<div class="hold-enrollment-timer-label">Auto Expired in</div>'
      +     '<div id="' + timerId + '" class="hold-enrollment-timer-value text-success"></div>'
      +   '</div>'
      +   '<div class="hold-enrollment-meta-grid">'
      +     '<div class="hold-enrollment-meta-card"><span>Holding For</span><strong>' + lockHours + ' Hrs</strong></div>'
      +     '<div class="hold-enrollment-meta-card"><span>Best time to connect</span><strong>' + (bestTimeDisplay || 'Not set') + '</strong></div>'
      +     '<div class="hold-enrollment-meta-card"><span>Expiry Date</span><strong>' + expiryDisplay + '</strong></div>'
      +   '</div>'
      + '</div>';
  } else {
    details = ''
      + '<div class="hold-enrollment-meta-grid" style="margin-top:0;">'
      +   '<div class="hold-enrollment-meta-card"><span>Holding For</span><strong>' + lockHours + ' Hrs</strong></div>'
      +   '<div class="hold-enrollment-meta-card"><span>Holding Date</span><strong>' + holdDateDisplay + '</strong></div>'
      +   '<div class="hold-enrollment-meta-card"><span>Expiry Date</span><strong>' + expiryDisplay + '</strong></div>'
      + '</div>'
      + '<div class="mt-3" style="padding:16px 18px;border-radius:18px;background:#fff;border:1px solid #dbe8fb;box-shadow:0 14px 28px rgba(15,72,126,.08);">'
      +   '<div class="small font-weight-bold text-uppercase mb-2" style="letter-spacing:.12em;color:#6b8096;">Auto Expired in</div>'
      +   '<div id="' + timerId + '" class="font-weight-bold text-success" style="font-size:26px;line-height:1.3;"></div>'
      +   (bestTimeDisplay ? '<div class="mt-3 pt-3" style="border-top:1px solid #ecf2fb;"><div class="small font-weight-bold text-uppercase mb-1" style="letter-spacing:.1em;color:#6b8096;">Best time to connect with you</div><div class="font-weight-bold" style="font-size:18px;color:#19324d;">' + bestTimeDisplay + '</div></div>' : '')
      + '</div>';
  }

  $("#holdActiveInfoDetails").html(details);
  startLeadHoldCountdownForTarget("modalActiveHold", $("#" + timerId), activeHold);
}

function renderLeadHoldIndicator(leadId, holdData) {
  var wrapper = $(".hold-enrollment-wrapper-" + leadId);
  if (!wrapper.length) {
    return;
  }

  var lockHours = holdData && holdData.lockHours ? holdData.lockHours : "";
  var bestTimeDisplay = getHoldBestTimeDisplay(holdData);
  var remainingId = "leadHoldRemaining_" + leadId;
  var html = ''
    + '<div class="mt-2 font-12 hold-enrollment-panel hold-enrollment-panel-' + leadId + '" style="background:#f7fbff;border:1px solid #d7e8fb;border-radius:12px;padding:10px 12px;">'
    +   '<div class="d-flex mb-2" style="gap:10px;">'
    +     '<div style="width:190px;min-width:190px;">Hold enrollment:</div>'
    +     '<div class="font-weight-bold">' + lockHours + ' Hrs</div>'
    +   '</div>'
    +   '<div class="d-flex align-items-center mb-2" style="gap:10px;">'
    +     '<div style="width:190px;min-width:190px;">Auto Expired in:</div>'
    +     '<div><span id="' + remainingId + '" class="d-inline-block px-3 py-2 font-weight-bold text-danger" style="background:#ffffff;border:1px solid #dcecff;border-radius:12px;box-shadow:0 8px 18px rgba(2, 127, 254, 0.12);"></span></div>'
    +   '</div>'
    +   (bestTimeDisplay ? '<div class="d-flex" style="gap:10px;"><div style="width:190px;min-width:190px;">Best time to connect with you:</div><div class="font-weight-bold">' + bestTimeDisplay + '</div></div>' : '')
    + '</div>';
  wrapper.html(html);
  startLeadHoldCountdown(leadId, holdData);
}

function clearLeadHoldIndicator(leadId) {
  var wrapper = $(".hold-enrollment-wrapper-" + leadId);
  if (wrapper.length) {
    wrapper.html("");
  }
  clearLeadHoldTimer(leadId);
}

function startLeadHoldCountdown(leadId, holdData) {
  var target = $("#leadHoldRemaining_" + leadId);
  startLeadHoldCountdownForTarget(leadId, target, holdData);
}




