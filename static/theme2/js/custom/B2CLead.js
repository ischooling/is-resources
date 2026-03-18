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
