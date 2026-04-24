async function renderLeadReportCampaignDashboard(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE, leadCategory) {
	LEAD_CATEGORY = leadCategory || LEAD_CATEGORY || "B2C";
	window.LEAD_REPORT_HIDE_ACTIONS = true;
	window.LEAD_REPORT_DEFAULT_REPORT_TYPE = "CAMPAIGN";
	window.LEAD_REPORT_CAMPAIGN_LAYOUT = true;

	var objRight = await getLeadReportData(roleAndModule.moduleId, USER_ID, 'report');
	var objectRights = objRight.objectRights;
	OBJECT_RIGHTS = objectRights;

	var html = getLeadReportCampaignMasterContent(title, objectRights);
	$('#dashboardContentInHTML').html(html);
	applyLeadReportCampaignWidthStyle();
	initializeLeadReportDatepickers();
	initializeLeadReportCampaignPage(SCHOOL_ID, USER_ID, USER_ROLE);
}

function getLeadReportCampaignMasterContent(title, objectRights) {
	var html = getLeadReportPageTitle(title);
	html += '<div class="main-card mb-3 card">';
	html += '	<div class="card-body">';
	html += getLeadCounselorReportData(objectRights);
	html += '	</div>';
	html += '</div>';
	html += counselorReportPopup();
	html += getLeadReportSearchPopup(objectRights);
	return html;
}

function initializeLeadReportCampaignPage(SCHOOL_ID, USER_ID, USER_ROLE) {
	if ($("#counselorStartDate").length) {
		$("#syncZadarmaDate").datepicker({
			format: 'yyyy-mm-dd',
			autoclose: true
		}).datepicker('setDate', new Date());

		callLeadCounselorsList('leadReportSearch', 'DAY', '', '', 'listCounselorTbody', false, 0, 0);

		$("#searchLeadCounselorType").off("change").on("change", function () {
			if ($("#searchLeadCounselorType").val() == 'CUSTOM') {
				$(".hidecounselorLead").css({"display":"block"});
			} else {
				$(".hidecounselorLead").css({"display":"none"});
				callLeadCounselorsList('leadReportSearch', $("#searchLeadCounselorType").val(), '', '', 'listCounselorTbody', false, 0, 0);
			}
		});

		$("#searchLeadCounselorReportType").off("change").on("change", function () {
			if ($("#searchLeadCounselorReportType").val() == 'Counselor') {
				$(".changeHeadText").text('Academic Expert');
			} else {
				$(".changeHeadText").text($("#searchLeadCounselorReportType").val());
			}

			var startDate = $("#counselorStartDate").val();
			var endDate = $("#counselorEndDate").val();
			if ($("#counselorStartDate").val() == '' && $("#counselorStartDate").val() == undefined) {
				startDate = '';
			}
			if ($("#counselorEndDate").val() == '' && $("#counselorEndDate").val() == undefined) {
				endDate = '';
			}
			callLeadCounselorsList('leadReportSearch', $("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody', false, 0, 0);
		});

		$("#btnLeadCounselorWiseSubmit").off("click").on("click", function () {
			var startDate = $("#counselorStartDate").val();
			var endDate = $("#counselorEndDate").val();

			if ($("#counselorStartDate").val() == '' && $("#counselorStartDate").val() == undefined) {
				showMessageTheme2(1, 'Please choose start date', '', true);
				return false;
			}
			if ($("#counselorEndDate").val() == '' && $("#counselorEndDate").val() == undefined) {
				showMessageTheme2(1, 'Please choose end date', '', true);
				return false;
			}

			callLeadCounselorsList('leadReportSearch', $("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody', false, 0, 0);
		});

		$("#exportCounselorLead").off("click").on("click", function () {
			var leadStartDate = $("#counselorStartDate").val();
			var leadEndDate = $("#counselorEndDate").val();
			var searchCountrytype = $("#searchLeadCounselorType").val();
			var assignTo = "";
			var assignTos = $("#leadReportSearch #assignToSearch").val();
			if (assignTos && assignTos.length > 0) {
				assignTo = assignTos.join('@');
			}
			var leadSorc = "";
			var lSource = $("#leadReportSearch #sourceSearch").val();
			if (lSource && lSource.length > 0) {
				leadSorc = lSource.join('@');
			}
			var leadStatuses = $("#leadReportSearch #statusSearch").val();
			var standard = $("#leadReportSearch #gradeSearch").val();
			var demoAssignTo = $("#leadReportSearch #leadDemoAssign").val();
			var acadmicYear = $("#leadReportSearch #acadmicYear").val();
			var country = $("#leadReportSearch #countryId").val();
			var utmCampaign = "";
			var utmCam = $("#leadReportSearch #searchCampaign").val();
			if (utmCam != undefined && utmCam.length > 0) {
				utmCampaign = utmCam.join('@');
			}
			var reportType = $("#searchLeadCounselorReportType").val();

			var sendQuery = 'userId=' + USER_ID + '&schoolId=' + SCHOOL_ID + '&assignTo=' + assignTo + '&leadStartDate=' + leadStartDate + '&leadEndDate=' + leadEndDate + '&leadSources=' + leadSorc + '&leadStatuses=' + leadStatuses;
			sendQuery = sendQuery + '&standard=' + standard + '&demoAssignTo=' + demoAssignTo + '&acadmicYear=' + acadmicYear + '&country=' + country + '&utmCampaigns=' + utmCampaign + '&searchCountrytype=' + searchCountrytype + '&reportType=' + reportType;
			getAsPost('/dashboard/report/counselor-lead-export?' + sendQuery);
		});
	}

	if ($("#acadmicYear").length) {
		$("#acadmicYear").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		$("#sourceSearch").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		$("#statusSearch").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		$("#assignToSearch").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		$("#countryId").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		$("#leadDemoAssign").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		$("#searchReportCampaign").select2({
			theme: "bootstrap4",
			dropdownParent: "#leadReportSearch"
		});

		getSessionMasterList('reportLeadSearchForm', 'acadmicYear', true);
		callLeadSourceList('reportLeadSearchForm', 'B2C', 'sourceSearch', true);
		callLeadStatusList('reportLeadSearchForm', 'B2C', 'statusSearch', false);
		callPCountries('reportLeadSearchForm', 0, 'countryId');
		callLeadAssignUserList('reportLeadSearchForm', '' + OBJECT_RIGHTS.leadType + '', 'assignToSearch', true, OBJECT_RIGHTS.discardPermission, USER_ID);
		callLeadAssignUserList('reportLeadSearchForm', '' + OBJECT_RIGHTS.leadType + '', 'leadDemoAssign', true, OBJECT_RIGHTS.discardPermission, USER_ID);
		callMasterCampainList('reportLeadSearchForm', '', 'searchReportCampaign');
	}

	$("#searchCampaignType").select2({
		theme: "bootstrap4",
		placeholder: "Select Campaign"
	});
	$("#searchCountryType").select2({
		theme: "bootstrap4",
		placeholder: "Select Country"
	});
	if ($("#searchCountryType").length) {
		callPCountries('campaignForm', 0, 'searchCountryType');
	}
}

function applyLeadReportCampaignWidthStyle() {
	if (!window.LEAD_REPORT_CAMPAIGN_LAYOUT) {
		$("#leadReportCampaignWidthStyle").remove();
		return;
	}

	if ($("#leadReportCampaignWidthStyle").length) {
		return;
	}

	var style = `
		.lead-report-campaign-table-wrap {
			display: block !important;
			overflow-x: auto !important;
			width: 100% !important;
		}
		.lead-report-campaign-table-wrap #counselor-list td:nth-child(2) {
			white-space: normal !important;
			word-break: break-word !important;
			overflow-wrap: anywhere !important;
		}
		.lead-report-campaign-table-wrap #counselor-list tbody td table {
			width: 570px !important;
			min-width: 570px !important;
			max-width: 570px !important;
			table-layout: fixed !important;
			margin: 0 !important;
		}
		.lead-report-campaign-table-wrap #counselor-list tbody td table td {
			white-space: normal !important;
			overflow: hidden !important;
			text-align: center !important;
			vertical-align: middle !important;
			padding: 2px 3px !important;
			width: 50px !important;
		}
		.lead-report-campaign-table-wrap #counselor-list tbody td table td:first-child {
			width: 70px !important;
		}
		.lead-report-campaign-table-wrap #counselor-list tfoot td table,
		.lead-report-campaign-table-wrap #counselor-list thead th table {
			width: 570px !important;
			table-layout: fixed !important;
			margin: 0 !important;
		}
		[id^="sub-counselor-list-"] tbody td table {
			width: 570px !important;
			min-width: 570px !important;
			max-width: 570px !important;
			table-layout: fixed !important;
			margin: 0 !important;
		}
		[id^="sub-counselor-list-"] tbody td table td {
			white-space: normal !important;
			overflow: hidden !important;
			text-align: center !important;
			vertical-align: middle !important;
			padding: 2px 3px !important;
			width: 50px !important;
		}
		[id^="sub-counselor-list-"] tbody td table td:first-child {
			width: 70px !important;
		}
		[id^="sub-counselor-list-"] tfoot td table,
		[id^="sub-counselor-list-"] thead th table {
			width: 570px !important;
			table-layout: fixed !important;
			margin: 0 !important;
		}
	`;
	$("head").append(`<style id="leadReportCampaignWidthStyle">${style}</style>`);
}
