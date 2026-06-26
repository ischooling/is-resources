// async function renderSchoolSettingDashboard(title, roleAndModule, schoolId, userId, userRole) {
// 	ROLE_MODULE = roleAndModule;
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	window.schoolSettingPageState.title = title;
// 	var data = getSchoolSettingDefaultData(schoolId);
// 	data.selectedSchoolId = parseInt(schoolId, 10) || data.selectedSchoolId;
// 	window.schoolSettingPageState.data = data;
// 	var html = `
// 		${getSchoolSettingPageHeader(title)}
// 		${getSchoolSettingPageContent(data)}
// 	`;
// 	$("#dashboardContentInHTML").html(html);
// 	schoolSettingPageLoadEvent(data);
// }

// function renderSchoolSettingSection(target, data) {
// 	if (!target) {
// 		return;
// 	}
// 	var pageData = data || (window.schoolSettingPageState && window.schoolSettingPageState.data) || getSchoolSettingDefaultData(SCHOOL_ID);
// 	target.innerHTML = getSchoolSettingPageContent(pageData);
// 	schoolSettingPageLoadEvent(pageData);
// }

// function renderSchoolSettingLmsData(details) {
// 	var schoolSettingsLms = details && details.schoolSettingsLms ? details.schoolSettingsLms : {};
// 	var lmsProviders = details && details.lmsProviders ? details.lmsProviders : [];
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	if (!Array.isArray(lmsProviders) || lmsProviders.length < 1) {
// 		lmsProviders = window.schoolSettingPageState.data.lmsProvideres || [];
// 	}
// 	window.schoolSettingPageState.data.schoolSettingsLms = schoolSettingsLms;
// 	window.schoolSettingPageState.data.lmsProvideres = lmsProviders;
// 	renderSchoolSettingLmsFields(schoolSettingsLms, lmsProviders);
// }

// function renderSchoolSettingLmsFields(schoolSettingsLms, lmsProviders) {
// 	if ($("#lmsProviderId").length) {
// 		var selectedProviderId = schoolSettingsLms && schoolSettingsLms.lmsProviderId ? schoolSettingsLms.lmsProviderId : $("#lmsProviderId").val();
// 		$("#lmsProviderId").html(getSchoolSettingLmsProviderOptions(lmsProviders, selectedProviderId));
// 		if (selectedProviderId) {
// 			$("#lmsProviderId").val(String(selectedProviderId));
// 		}
// 	}
// 	if ($("#domainId").length) {
// 		$("#domainId").val((schoolSettingsLms && schoolSettingsLms.domainId) || "");
// 	}
// 	if ($("#domainName").length) {
// 		$("#domainName").val((schoolSettingsLms && schoolSettingsLms.domainName) || "");
// 	}
// 	if ($("#userSpace").length) {
// 		$("#userSpace").val((schoolSettingsLms && schoolSettingsLms.userSpace) || "");
// 	}
// 	if ($("#lmsLoginUrl").length) {
// 		$("#lmsLoginUrl").val((schoolSettingsLms && schoolSettingsLms.lmsLoginUrl) || "");
// 	}
// 	if ($("#prefixStudent").length) {
// 		$("#prefixStudent").val((schoolSettingsLms && schoolSettingsLms.prefixStudent) || "");
// 	}
// 	if ($("#prefixTeacher").length) {
// 		$("#prefixTeacher").val((schoolSettingsLms && schoolSettingsLms.prefixTeacher) || "");
// 	}
// 	if ($("#prefixAdmin").length) {
// 		$("#prefixAdmin").val((schoolSettingsLms && schoolSettingsLms.prefixAdmin) || "");
// 	}
// 	if ($("#schoolLmsStatus").length) {
// 		$("#schoolLmsStatus").val(schoolSettingsLms && schoolSettingsLms.active == "Y" ? "ACTIVE" : "INACTIVE");
// 	}
// 	if ($("#lmsProviderId").data("select2")) {
// 		$("#lmsProviderId").trigger("change.select2");
// 	}
// 	if ($("#schoolLmsStatus").data("select2")) {
// 		$("#schoolLmsStatus").trigger("change.select2");
// 	}
// }

// function renderSchoolSettingPaymentGatewayData(details) {
// 	var paymentGatewaySettings = details && details.paymentGatewaySettings ? details.paymentGatewaySettings : {};
// 	var paymentGateways = details && details.paymentGateways ? details.paymentGateways : [];
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.pgsettings = paymentGatewaySettings;
// 	window.schoolSettingPageState.data.paymentGatewayNames = paymentGateways;
// 	renderSchoolSettingPaymentGatewayFields(paymentGatewaySettings, paymentGateways);
// }

// function renderSchoolSettingPaymentGatewayFields(paymentGatewaySettings, paymentGateways) {
// 	if ($("#paymentGateway").length) {
// 		var selectedGateway = paymentGatewaySettings && paymentGatewaySettings.gatewayName ? paymentGatewaySettings.gatewayName : $("#paymentGateway").val();
// 		$("#paymentGateway").html(getSchoolSettingGatewayOptions(paymentGateways, selectedGateway));
// 		if (selectedGateway) {
// 			$("#paymentGateway").val(String(selectedGateway));
// 		}
// 	}
// 	if ($("#endPointUrl").length) {
// 		$("#endPointUrl").val((paymentGatewaySettings && paymentGatewaySettings.endpointUrl) || "");
// 	}
// 	if ($("#merchantEmail").length) {
// 		$("#merchantEmail").val((paymentGatewaySettings && paymentGatewaySettings.merchantEmail) || "");
// 	}
// 	if ($("#secretKey").length) {
// 		$("#secretKey").val((paymentGatewaySettings && paymentGatewaySettings.secretKey) || "");
// 	}
// 	if ($("#clientId").length) {
// 		$("#clientId").val((paymentGatewaySettings && paymentGatewaySettings.clientId) || "");
// 	}
// 	if ($("#paymentModeIp").length) {
// 		$("#paymentModeIp").val((paymentGatewaySettings && paymentGatewaySettings.paymentModeIp) || "");
// 	}
// 	if ($("#gatewayMode").length) {
// 		$("#gatewayMode").val((paymentGatewaySettings && paymentGatewaySettings.gatewayMode) || "TEST");
// 	}
// 	if ($("#pgStatus").length) {
// 		$("#pgStatus").val(paymentGatewaySettings && paymentGatewaySettings.active == "Y" ? "ACTIVE" : "INACTIVE");
// 	}
// 	if ($("#paymentGateway").data("select2")) {
// 		$("#paymentGateway").trigger("change.select2");
// 	}
// 	if ($("#gatewayMode").data("select2")) {
// 		$("#gatewayMode").trigger("change.select2");
// 	}
// 	if ($("#pgStatus").data("select2")) {
// 		$("#pgStatus").trigger("change.select2");
// 	}
// }

// function getSchoolSettingCurrentLmsData() {
// 	if (window.schoolSettingPageState && window.schoolSettingPageState.data && window.schoolSettingPageState.data.schoolSettingsLms) {
// 		return window.schoolSettingPageState.data.schoolSettingsLms;
// 	}
// 	return {};
// }

// function getSchoolSettingDefaultData(selectedSchoolId) {
// 	var schoolOptions = [];
// 	var resolvedSchoolId = parseInt(selectedSchoolId, 10) || parseInt(SCHOOL_ID, 10) || 0;
// 	if (Array.isArray(window.schoolList) && window.schoolList.length > 0) {
// 		$.each(window.schoolList, function(index, school) {
// 			schoolOptions.push({
// 				schoolId: school.schoolId || school.id || resolvedSchoolId,
// 				schoolName: school.schoolName || school.name || SCHOOL_NAME
// 			});
// 		});
// 	}
// 	if (schoolOptions.length < 1) {
// 		schoolOptions.push({
// 			schoolId: resolvedSchoolId,
// 			schoolName: typeof SCHOOL_NAME !== "undefined" ? SCHOOL_NAME : "School"
// 		});
// 	}
// 	resolvedSchoolId = resolvedSchoolId || schoolOptions[0].schoolId || 0;
// 	return {
// 		selectedSchoolId: resolvedSchoolId,
// 		schoolSettingses: schoolOptions,
// 		pgsettings: {},
// 		paymentGatewayNames: [],
// 		schoolSettingsLms: {},
// 		schoolSettingsOffice: {},
// 		schoolSettingsLinks: {},
// 		schoolSettingsMails: {},
// 		schoolSettingFeedback: {},
// 		lmsProvideres: [],
// 		roleLms: [],
// 		sessionList: [],
// 		showSettingTab: resolvedSchoolId == 1,
// 		showAdmissionCycleTab: resolvedSchoolId == 5
// 	};
// }

// function getSchoolSettingPageHeader(title) {
// 	return `
// 		<div class="app-page-title mb-3 py-2">
// 			<div class="page-title-wrapper">
// 				<div class="page-title-heading">
// 					<div class="page-title-icon"><i class="fa fa-cog text-primary"></i></div>
// 					<div>${title}</div>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolSettingPageContent(data) {
// 	return `
// 		<div class="main-card mb-3 card body-tabs-shadow">
// 			<div class="card-body">
// 				<form action="javascript:void(0);" id="schoolSettingForm" name="schoolSettingForm" autocomplete="off">
// 					<div class="text-center" id="ErrorMsg">
// 						<span class="text-warning" style="font-weight:bold;color:red;" id="errMsg"></span>
// 					</div>
// 					${getSchoolSettingTabs(data)}
// 					${getSchoolSettingSections(data)}
// 				</form>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolSettingSchoolOptions(schoolSettingses, selectedSchoolId) {
// 	var html = ``;
// 	$.each(schoolSettingses || [], function(index, school) {
// 		html += `
// 			<option value="${school.schoolId}" ${school.schoolId == selectedSchoolId ? "selected" : ""}>
// 				${school.schoolName}
// 			</option>
// 		`;
// 	});
// 	return html;
// }

// function getSchoolSettingTabs(data) {
// 	var showSettingTab = !!(data && data.showSettingTab);
// 	return `
// 		<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav mb-3">
// 			<li id="stgTab" class="nav-item">
// 					<a role="tab" class="nav-link" data-tab="STG" href="javascript:void(0);">
// 						<span>Setting</span>
// 					</a>
// 			</li>
// 			<li id="integrationTab" class="nav-item">
// 				<a role="tab" class="nav-link" data-tab="INTEGRATION" href="javascript:void(0);">
// 					<span>Integration</span>
// 				</a>
//             </li>
// 			<li id="lmssmTab" class="nav-item">
// 				<a role="tab" class="nav-link active" data-tab="LMSSM" href="javascript:void(0);">
// 					<span>LMS School Mapping</span>
// 				</a>
// 			</li>
// 			<li id="lmsrmTab" class="nav-item">
// 				<a role="tab" class="nav-link" data-tab="LMSRM" href="javascript:void(0);">
// 					<span>LMS Role Mapping</span>
// 				</a>
// 			</li>
// 			<li id="sfTab" class="nav-item">
// 				<a role="tab" class="nav-link" data-tab="SF" href="javascript:void(0);">
// 					<span>Grade Fee Details</span>
// 				</a>
// 			</li>
// 			<li id="techTab" class="nav-item">
// 				<a role="tab" class="nav-link" data-tab="TECH" href="javascript:void(0);">
// 					<span>Technical Setting</span>
// 				</a>
//             </li>
// 			<li id="schoolSettingsTab" class="nav-item">
// 				<a role="tab" class="nav-link" data-tab="SS" href="javascript:void(0);">
// 					<span>School Settings</span>
// 				</a>
//             </li>
// 			<li id="logTab" class="nav-item">
// 				<a role="tab" class="nav-link" data-tab="LOG" href="javascript:void(0);">
// 					<span>LOG</span>
// 				</a>
//             </li>
			
// 			${showSettingTab ? `` : ``}
// 		</ul>
// 	`;
// }

// function getSchoolSettingSections(data) {
// 	return `
// 		${getLmsSchoolMappingInfoDiv(data)}
// 		${getLmsRoleMappingInfoDiv(data)}
// 		${getCycleIntakeInfoDiv(data)}
// 		${getStandardFeeInfoDiv()}
// 		${getSettingAllDataDiv()}
// 		${getSchoolSettingLogDiv(data)}
// 		<div id="templateDiv" style="display:none;"></div>
// 		<div id="sessionDiv" style="display:none;"></div>
// 		<div id="TechnicalDiv" style="display:none;">
// 			${getTechnicalSettingInfoDiv(data)}
// 		</div>
// 		<div id="SchoolSettingsDiv" style="display:none;">
// 			<div class="full">
// 				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link active" href="javascript:void(0)" id="schoolOfficeTabBtn" data-school-settings-subtab="OFFICE" onclick="if(typeof openSchoolSettingsSubTab==='function'){openSchoolSettingsSubTab('OFFICE');}else if(typeof getSchoolSettingData==='function'){getSchoolSettingData('OFFICE');} return false;">
// 							<span>School Office</span>
// 						</a>
// 					</li>
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link" href="javascript:void(0)" id="schoolLinksTabBtn" data-school-settings-subtab="SL" onclick="if(typeof openSchoolSettingsSubTab==='function'){openSchoolSettingsSubTab('SL');}else if(typeof getSchoolSettingData==='function'){getSchoolSettingData('SL');} return false;">
// 							<span>School Links</span>
// 						</a>
// 					</li>
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link" href="javascript:void(0)" id="schoolMailsTabBtn" data-school-settings-subtab="SM" onclick="if(typeof openSchoolSettingsSubTab==='function'){openSchoolSettingsSubTab('SM');}else if(typeof getSchoolSettingData==='function'){getSchoolSettingData('SM');} return false;">
// 							<span>School Mails</span>
// 						</a>
// 					</li>
// 				</ul>
// 			</div>
// 			<div id="OfficeDiv" class="mt-3" style="display:none;">
// 				${getSchoolOfficeSettingInfoDiv(data)}
// 			</div>
// 			<div id="SchoolLinksDiv" class="mt-3" style="display:none;">
// 				${getSchoolLinksSettingInfoDiv(data)}
// 			</div>
// 			<div id="SchoolMailsDiv" class="mt-3" style="display:none;">
// 				${getSchoolMailsSettingInfoDiv(data)}
// 			</div>
// 		</div>
// 		<div id="IntegrationMainDiv" style="display:none;">
// 			<div class="full mb-3">
// 				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link active" href="javascript:void(0)" id="schoolIntegrationPgTabBtn" data-school-settings-integration-subtab="IPG" onclick="if(typeof openSchoolSettingsIntegrationSubTab==='function'){openSchoolSettingsIntegrationSubTab('IPG');} return false;">
// 							<span>Payment Gateway Setting</span>
// 						</a>
// 					</li>
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link" href="javascript:void(0)" id="schoolFeedbackTabBtn" data-school-settings-integration-subtab="FB" onclick="if(typeof openSchoolSettingsIntegrationSubTab==='function'){openSchoolSettingsIntegrationSubTab('FB');} return false;">
// 							<span>Feedback</span>
// 						</a>
// 					</li>
// 				</ul>
// 			</div>
// 			<div id="IntegrationPaymentGatewayDiv" style="display:none;">
// 				${getPaymentGatewayInfoDiv(data)}
// 			</div>
// 			<div id="SchoolFeedbackDiv" style="display:none;">
// 				${getSchoolFeedbackSettingInfoDiv(data)}
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolSettingLogDiv(data) {
// 	var showApiCallDetails = !!(data && data.showSettingTab);
// 	return `
// 		<div id="LogDiv" style="display:none;">
// 			<div class="full">
// 				<div class="main-card mb-3 card">
// 					<div class="card-body">
// 						<div class="d-flex align-items-center justify-content-between">
// 							<h5 class="m-0 font-weight-bold">Logs</h5>
// 						</div>
// 						<div class="full mt-3">
// 							${showApiCallDetails ? `
// 								<a href="javascript:void(0)" class="btn btn-outline-primary active" id="logSubApiCallDetails">
// 									API Call Details
// 								</a>
// 							` : ``}
// 						</div>
// 						<div class="full mt-3" id="logContentWrapper">
// 							${showApiCallDetails ? `${getApiCallDetailsDiv()}` : ``}
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getPaymentGatewayInfoDiv(data) {
// 	var pgsettings = data.pgsettings || {};
// 	return `
// 		<div id="paymentGatewayInfoDiv">
// 			<div class="form-row">
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Payment Gateway</label>
// 						<select id="paymentGateway" class="multiselect-dropdown form-control">
// 							${getSchoolSettingGatewayOptions(data.paymentGatewayNames, pgsettings.gatewayName)}
// 						</select>
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Endpoint URL</label>
// 						<input name="endPointUrl" id="endPointUrl" type="text" class="form-control" value="${pgsettings.endpointUrl || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Merchant Email</label>
// 						<input name="merchantEmail" id="merchantEmail" type="email" class="form-control" value="${pgsettings.merchantEmail || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Secret Key/Transaction Key</label>
// 						<input name="secretKey" id="secretKey" type="text" class="form-control" value="${pgsettings.secretKey || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Client Id/API Login Id</label>
// 						<input id="clientId" name="clientId" type="text" class="form-control" value="${pgsettings.clientId || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Payment Mode IP/Website</label>
// 						<input id="paymentModeIp" name="paymentModeIp" type="text" class="form-control" value="${pgsettings.paymentModeIp || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Gateway Mode</label>
// 						<select id="gatewayMode" name="gatewayMode" class="multiselect-dropdown form-control">
// 							${getSchoolSettingValueOptions([{ value: "TEST", label: "TEST" }, { value: "LIVE", label: "LIVE" }], pgsettings.gatewayMode || "TEST")}
// 						</select>
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Status</label>
// 						<select id="pgStatus" name="pgStatus" class="multiselect-dropdown form-control">
// 							${getSchoolSettingValueOptions([{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }], pgsettings.active == "Y" ? "ACTIVE" : "INACTIVE")}
// 						</select>
// 					</div>
// 				</div>
// 			</div>
// 			<button type="button" class="mt-2 btn btn-success" id="saveDataPayment" onclick="saveSchoolSettingData('schoolSettingForm','PG','0','1');">Save</button>
// 		</div>
// 	`;
// }

// function getLmsSchoolMappingInfoDiv(data) {
// 	var schoolSettingsLms = data.schoolSettingsLms || {};
// 	var resolvedLmsSettingId = parseInt(schoolSettingsLms.id, 10) || 0;
// 	var resolvedLmsSchoolId = parseInt(schoolSettingsLms.schoolId, 10) || parseInt(data.selectedSchoolId, 10) || parseInt(SCHOOL_ID, 10) || 1;
// 	return `
// 		<div id="lmsSchoolMappingInfoDiv" style="display:none;">
// 			<div class="form-row">
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">LMS Providers</label>
// 						<select id="lmsProviderId" class="multiselect-dropdown form-control">
// 							${getSchoolSettingLmsProviderOptions(data.lmsProvideres, schoolSettingsLms.lmsProviderId)}
// 						</select>
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Domain ID</label>
// 						<input name="domainId" id="domainId" type="text" class="form-control" value="${schoolSettingsLms.domainId || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Domain Name</label>
// 						<input name="domainName" id="domainName" type="text" class="form-control" value="${schoolSettingsLms.domainName || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">User Space</label>
// 						<input name="userSpace" id="userSpace" type="text" class="form-control" value="${schoolSettingsLms.userSpace || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">LMS Login Url</label>
// 						<input name="lmsLoginUrl" id="lmsLoginUrl" type="text" class="form-control" value="${schoolSettingsLms.lmsLoginUrl || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Description Prefix Student</label>
// 						<input name="prefixStudent" id="prefixStudent" type="text" class="form-control" value="${schoolSettingsLms.prefixStudent || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Description Prefix Teacher</label>
// 						<input name="prefixTeacher" id="prefixTeacher" type="text" class="form-control" value="${schoolSettingsLms.prefixTeacher || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Description Prefix Admin</label>
// 						<input name="prefixAdmin" id="prefixAdmin" type="text" class="form-control" value="${schoolSettingsLms.prefixAdmin || ""}">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Status</label>
// 						<select id="schoolLmsStatus" name="schoolLmsStatus" class="multiselect-dropdown form-control">
// 							${getSchoolSettingValueOptions([{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }], schoolSettingsLms.active == "Y" ? "ACTIVE" : "INACTIVE")}
// 						</select>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getLmsRoleMappingInfoDiv(data) {
// 	return `
// 		<div id="lmsRoleMappingInfoDiv" style="display:none;">
// 			<div class="table-responsive">
// 				<table class="table table-bordered table-striped" id="roleLms" style="min-width:1100px; width:100%;">
// 					<thead>
// 						<tr>
// 							<th style="text-align:center;font-weight:bold">S.No</th>
// 							<th style="font-weight:bold">LMS Provider</th>
// 							<th style="font-weight:bold">Role Name</th>
// 							<th style="font-weight:bold">Role LMS ID</th>
// 							<th style="font-weight:bold">Status</th>
// 							<th style="font-weight:bold">Action</th>
// 						</tr>
// 					</thead>
// 					<tbody>${getLmsRoleMappingRows(data.roleLms || [])}</tbody>
// 				</table>
// 			</div>
// 		</div>
// 	`;
// }

// function getLmsRoleMappingRows(roleLms) {
// 	var html = ``;
// 	$.each(roleLms || [], function(index, value) {
// 		var roleId = parseInt(value.id, 10) || 0;
// 		var schoolId = parseInt(value.schoolId, 10) || 0;
// 		var providerName = getSchoolSettingProviderName(value.lmsProviderId);
// 		var roleStatus = value.active == "Y" ? "ACTIVE" : "INACTIVE";
// 		html += `
// 			<tr>
// 				<td style="text-align:center;">${index + 1}</td>
// 				<td><input type="text" name="lmsProvider${roleId}" id="rolelmsProvider${roleId}" class="form-control" value="${providerName}" disabled/></td>
// 				<td><input type="text" name="lmsRoleName${roleId}" id="rolelmsRoleName${roleId}" class="form-control" value="${value.role || ""}"/></td>
// 				<td><input type="text" name="roleLmsId${roleId}" id="roleLmsId${roleId}" class="form-control" value="${value.roleLmsId || ""}"/></td>
// 				<td><input type="text" name="roleLmsStatus${roleId}" id="roleLmsStatus${roleId}" class="form-control" value="${roleStatus}" disabled/></td>
// 				<td style="text-align:center;">
// 					<a href="#" class="mt-2 btn btn-success school-setting-role-save" id="saveRoleLms${roleId}" data-id="${roleId}" data-school-id="${schoolId}" onclick="saveSchoolSettingData('schoolSettingForm','LMSRM','${roleId}','${schoolId}'); return false;">Save</a>
// 				</td>
// 			</tr>
// 		`;
// 	});
// 	return html;
// }

// function getCycleIntakeInfoDiv(data) {
// 	return `
// 		<div id="cycleIntakeInfoDiv" style="display:none;">
// 			<div class="form-row">
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Group Name<span style="color:red;">*</span></label>
// 						<input name="groupName" id="groupName" placeholder="Group Name" type="text" class="form-control" value="">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Semester 1 Start Date<span style="color:red;">*</span></label>
// 						<input name="semesterStartDate1" id="semesterStartDate1" type="text" class="form-control" value="" readonly onkeydown="return false">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Semester 1 End Date<span style="color:red;">*</span></label>
// 						<input name="semesterEndDate1" id="semesterEndDate1" type="text" class="form-control" value="" readonly onkeydown="return false">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Semester 2 Start Date<span style="color:red;">*</span></label>
// 						<input name="semesterStartDate2" id="semesterStartDate2" type="text" class="form-control" value="" readonly onkeydown="return false">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Semester 2 End Date<span style="color:red;">*</span></label>
// 						<input name="semesterEndDate2" id="semesterEndDate2" type="text" class="form-control" value="" readonly onkeydown="return false">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Late Application Fee Start Date<span style="color:red;">*</span></label>
// 						<input name="LateAppFeeDate" id="LateAppFeeDate" type="text" class="form-control" value="" readonly onkeydown="return false">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Late Application Fee End Date<span style="color:red;">*</span></label>
// 						<input name="LateAppFeeDateEnd" id="LateAppFeeDateEnd" type="text" class="form-control" value="" readonly onkeydown="return false">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Discount 1 %<span style="color:red;">*</span></label>
// 						<input name="discountSem1" id="discountSem1" type="text" class="form-control" value="">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Discount 2 %<span style="color:red;">*</span></label>
// 						<input name="discountSem2" id="discountSem2" type="text" class="form-control" value="">
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Allow Admission Status<span style="color:red;">*</span></label>
// 						<select id="admissionStatus" name="admissionStatus" class="form-control">
// 							<option value="Y">Active</option>
// 							<option value="N">Inactive</option>
// 						</select>
// 					</div>
// 				</div>
// 			</div>
// 			<input name="admissionCycleId" id="admissionCycleId" type="hidden">
// 			<div class="form-row">
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<button class="mt-2 btn btn-success" type="button" id="saveAdmissionCycle" name="saveAdmissionCycle">save</button>
// 					</div>
// 				</div>
// 			</div>
// 			<div class="form-row">
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Session<span style="color:red;">*</span></label>
// 						<select id="sessionList" name="sessionList" class="form-control"></select>
// 					</div>
// 				</div>
// 				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0 full">&nbsp;</label>
// 						<button class="btn btn-primary btn-lg" type="button" id="getAddmissionCycles" name="getAddmissionCycles">Search</button>
// 					</div>
// 				</div>
// 			</div>
// 			<br/>
// 			<div class="form-row">
// 				<div class="table-responsive">
// 					<table class="table table-bordered table-striped" id="admissionCycleData" style="min-width:1100px; width:100%">
// 						<thead>
// 							<tr>
// 								<th style="text-align:center;font-weight:bold">S.No</th>
// 								<th style="font-weight:bold">Group Name</th>
// 								<th style="font-weight:bold">Semester 1 Duration</th>
// 								<th style="font-weight:bold">Semester 2 Duration</th>
// 								<th style="font-weight:bold">Late Application Fee Date</th>
// 								<th style="font-weight:bold">Discount 1 %</th>
// 								<th style="font-weight:bold">Discount 2 %</th>
// 								<th style="font-weight:bold">Status</th>
// 								<th style="font-weight:bold">Action</th>
// 							</tr>
// 						</thead>
// 						<tbody></tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getStandardFeeInfoDiv() {
// 	return `
// 		<div id="standardFeeInfoDiv" style="display:none;">
// 			<div class="full">
// 				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link FeeGrade active" href="javascript:void(0)" data-toggle="tab" aria-selected="false"><span>Grade</span></a>
// 					</li>
// 					<li class="nav-item">
// 						<a role="button" class="nav-link FeeApplyGrade" href="javascript:void(0)" data-toggle="tab"><span>Apply Grade Fee</span></a>
// 					</li>
// 				</ul>
// 			</div>
// 			<div class="tab-content">
// 				<div class="tab-pane tabs-animation fade show" id="FeeGrade" role="tabpanel" style="display:none">
// 					<div class="form-row">
// 						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Learning Program</label>
// 								<select id="standardGradeId" class="form-control">
// 									<option value="">Select Learning Program</option>
// 								</select>
// 							</div>
// 						</div>
// 						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Standard Fee Plan</label>
// 								<select id="standardGradeIdOption" class="form-control"></select>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Grade</label>
// 								<select id="allGradeId" class="form-control" multiple="multiple"></select>
// 							</div>
// 						</div>
// 						<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0 full">&nbsp;</label>
// 								<button class="btn btn-success" type="button" id="gradeSearch">Search</button>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<button class="btn btn-primary" type="button" id="addFormHide">Add</button>
// 							</div>
// 						</div>
// 					</div>
// 					<div id="standardFeeAddDiv" class="d-none">
// 						<div class="form-row">
// 							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Learning Program<span style="color:red;">*</span></label><select id="learningPlan" class="form-control"><option value="">Select Learning Program</option></select></div></div>
// 							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Standard Fee Plan<span style="color:red;">*</span></label><input name="standardFeePlan" id="standardFeePlan" type="text" class="form-control" value=""></div></div>
// 							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Standard Id<span style="color:red;">*</span></label><select id="standardId" class="form-control"></select></div></div>
// 							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Pay Mode</label><select id="paymode" class="form-control"><option value="A">Annually</option><option value="Q">Quarterly</option><option value="H">Half Yearly</option><option value="N">Nine Monthly</option><option value="M">Monthly</option></select></div></div>
// 							${getStandardFeeInputRow()}
// 							<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-right">
// 								<a href="javascript:void(0)" class="btn btn-success" id="saveStandardFeeData">Save</a>
// 								<button class="btn btn-danger" type="button" id="formHide">Cancel</button>
// 							</div>
// 						</div>
// 					</div>
// 					<div class="full standardFeeStructureTableWrapper d-none">
// 						<div class="full" style="overflow-x: auto;">
// 							<table class="table table-bordered responsive dt-responsive" id="standardFeeStructureTable" style="max-width:1100px;width:100%">
// 								<thead>
// 									<tr>
// 										<th style="text-align: center; font-weight: bold">S.No</th>
// 										<th>Grade</th>
// 										<th>Standard Fee Plan</th>
// 										<th>Pay Mode</th>
// 										<th>Registration Fee</th>
// 										<th>Book An Enrollment Fee</th>
// 										<th>Late Fee</th>
// 										<th>Annual Fee</th>
// 										<th>Annual Discount</th>
// 										<th>Monthly Fee</th>
// 										<th>Custom Plan First Insta</th>
// 										<th>REG Fee Full Credit</th>
// 										<th>REG Fee Half Credit</th>
// 										<th>CR Fee Full Credit</th>
// 										<th>CR Fee Half Credit</th>
// 										<th>ADV Fee Full Credit</th>
// 										<th>ADV Fee Half Credit</th>
// 										<th>HON Fee Full Credit</th>
// 										<th>HON Fee Half Credit</th>
// 										<th>AP Fee Full Credit</th>
// 										<th>AP Fee Half Credit</th>
// 										<th>Discovry Education Addon Fee</th>
// 										<th>STATUS</th>
// 										<th>Action</th>
// 									</tr>
// 								</thead>
// 								<tbody></tbody>
// 							</table>
// 						</div>
// 					</div>
// 				</div>
// 				<div class="tab-pane tabs-animation fade show" id="FeeApplyGrade" role="tabpanel" style="display:none">
// 					<div class="form-row">
// 						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Grade Learning Program</label>
// 								<select id="gradePlan" class="form-control"><option value="">Select Grade Learning Program</option></select>
// 							</div>
// 						</div>
// 						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Grade Plan Option</label>
// 								<select id="gradePlanOption" class="form-control"></select>
// 							</div>
// 						</div>
// 						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0 full">&nbsp;</label>
// 								<button class="btn btn-success" type="button">Apply</button>
// 							</div>
// 						</div>
// 					</div>
// 					<div class="table-responsive">
// 						<table class="table table-bordered responsive dt-responsive" id="activeFeePlanTable" style="max-width:1100px;width:100%">
// 							<thead>
// 								<tr>
// 									<th style="text-align: center; font-weight: bold">ID</th>
// 									<th style="font-weight: bold">Personalized Plan</th>
// 									<th style="font-weight: bold">Collaborative Plan</th>
// 									<th style="font-weight: bold">Accelerated Plan</th>
// 									<th style="font-weight: bold">Flexy Plan</th>
// 								</tr>
// 							</thead>
// 							<tbody></tbody>
// 						</table>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getStandardFeeInputRow() {
// 	var inputs = [
// 		["registrationFee", "Registration Fee"], ["bookEnrollment", "Book An Enrollment Fee"], ["lateFee", "Late Fee"],
// 		["annualFee", "Annual Fee"], ["annualDiscount", "Annual Discount"], ["monthlyFee", "Monthly Fee"],
// 		["cusFir", "Custom Plan First Insta"], ["regFull", "REG Fee Full Credit"], ["regHalf", "REG Fee Half Credit"], ["crFull", "CR Fee Full Credit"],
// 		["crHalf", "CR Fee Half Credit"], ["advFull", "ADV Fee Full Credit"], ["advHalf", "ADV Fee Half Credit"], ["honFull", "HON Fee Full Credit"],
// 		["honHalf", "HON Fee Half Credit"], ["apFull", "AP Fee Full Credit"], ["apHalf", "AP Fee Half Credit"], ["addonFee", "Discovry Education Addon Fee"]
// 	];
// 	var html = ``;
// 	$.each(inputs, function(index, input) {
// 		html += `
// 			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
// 				<div class="position-relative form-group mb-2">
// 					<label class="m-0">${input[1]}</label>
// 					<input id="${input[0]}" type="text" class="form-control" value="">
// 				</div>
// 			</div>
// 		`;
// 	});
// 	html += `
// 		<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
// 			<div class="position-relative form-group mb-2">
// 				<label class="m-0">Status</label>
// 				<select id="sfStatus" class="form-control">
// 					<option value="1">Active</option>
// 					<option value="0">InActive</option>
// 				</select>
// 			</div>
// 		</div>
// 	`;
// 	return html;
// }

// function getSettingAllDataDiv() {
// 	return `
// 		<div id="settingAllData" style="display:none;">
// 			<div class="full">
// 				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
// 					<li class="nav-item">
// 						<a role="tab" class="nav-link active" href="javascript:void(0)" id="settingAllDataTabBtn">
// 							<span>All Data List</span>
// 						</a>
// 					</li>
// 					<li class="nav-item">
// 						<a role="button" class="nav-link" href="javascript:void(0)" id="settingAddDataTabBtn">
// 							<span>Add Data</span>
// 						</a>
// 					</li>
// 				</ul>
// 			</div>
// 			<div class="full settingTableWrapper" style="display:none;">
// 				<div class="full" style="overflow-x:auto;">
// 					<table class="table table-bordered responsive dt-responsive" id="settingTable" style="width:100%;min-width:1200px;table-layout:fixed;">
// 							<colgroup>
// 								<col style="width:4%;">
// 								<col style="width:14%;">
// 								<col style="width:16%;">
// 								<col style="width:28%;">
// 								<col style="width:8%;">
// 								<col style="width:10%;">
// 								<col style="width:10%;">
// 								<col style="width:10%;">
// 							</colgroup>
// 							<thead>
// 								<tr>
// 									<th style="text-align: center; font-weight: bold">S.No</th>
// 									<th style="font-weight: bold">Meta Type</th>
// 									<th style="font-weight: bold">Meta Key</th>
// 									<th style="font-weight: bold">Meta Value</th>
// 									<th style="font-weight: bold">Parent Id</th>
// 									<th style="font-weight: bold; white-space: normal;">Created Date</th>
// 								<th style="font-weight: bold; white-space: normal;">Updated Date</th>
// 								<th style="font-weight: bold">Action</th>
// 							</tr>
// 						</thead>
// 						<tbody></tbody>
// 					</table>
// 				</div>
// 			</div>
// 			<div id="settingDataSave" style="display:none;">
// 				<div class="form-row">
// 					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
// 						<div class="position-relative form-group mb-2">
// 							<label class="m-0">Meta Type</label>
// 							<input name="metaType" id="metaType" type="text" maxlength="100" class="form-control" required>
// 						</div>
// 					</div>
// 					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
// 						<div class="position-relative form-group mb-2">
// 							<label class="m-0">Meta Key</label>
// 							<input name="metaKey" id="metaKey" type="text" maxlength="100" class="form-control" required>
// 						</div>
// 					</div>
// 					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
// 						<div class="position-relative form-group mb-2">
// 							<label class="m-0">Meta Value</label>
// 							<textarea name="metaValue" id="metaValue" maxlength="600" class="form-control" required></textarea>
// 						</div>
// 					</div>
// 					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
// 						<div class="position-relative form-group mb-2">
// 							<label class="m-0">Parent Id</label>
// 							<input name="parentId" id="parentId" type="number" class="form-control" required>
// 						</div>
// 					</div>
// 					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
// 						<div class="position-relative form-group mb-2">
// 							<label class="m-0">Activated</label>
// 							<select id="activated" name="activated" class="multiselect-dropdown form-control" required>
// 								<option value="Y">Active</option>
// 								<option value="N">InActive</option>
// 							</select>
// 						</div>
// 					</div>
// 					<input type="hidden" id="deleted" value="N">
// 					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-right">
// 						<a href="javascript:void(0)" class="btn btn-success" id="settingDataSaveBtn">Save</a>
// 						<button class="btn btn-danger" type="button" id="cancelForm">Reset</button>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getApiCallDetailsDiv() {
// 	return `
// 		<div id="apiCallDetailsDiv" style="display:none;">
// 			<div class="form-row mb-2">
// 				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">API Vendor</label>
// 						<select id="apiCallVendorFilter" class="form-control">
// 							<option value="">All</option>
// 						</select>
// 					</div>
// 				</div>
// 				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Status</label>
// 						<select id="apiCallStatusFilter" class="form-control">
// 							<option value="">All</option>
// 						</select>
// 					</div>
// 				</div>
// 				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
// 					<div class="position-relative form-group mb-2">
// 						<label class="m-0">Page</label>
// 						<select id="apiCallPageFilter" class="form-control">
// 							<option value="250">1 to 250</option>
// 						</select>
// 					</div>
// 				</div>
// 				<div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 d-flex align-items-end justify-content-end">
// 					<button type="button" class="btn btn-success mr-2" id="apiCallDetailsSearch"><i class="fa fa-search"></i>&nbsp;Search</button>
// 					<button type="button" class="btn btn-danger" id="apiCallDetailsReset"><i class="fa fa-undo"></i>&nbsp;Reset</button>
// 				</div>
// 			</div>
// 			<div class="full apiCallDetailsTableWrapper">
// 				<div class="full" style="overflow-x:auto;">
// 					<table class="table table-bordered responsive dt-responsive" id="apiCallDetailsTable" style="width:100%;table-layout:fixed;">
// 						<colgroup>
// 							<col style="width:4%;">
// 							<col style="width:7%;">
// 							<col style="width:14%;">
// 							<col style="width:12%;">
// 							<col style="width:12%;">
// 							<col style="width:12%;">
// 							<col style="width:19%;">
// 							<col style="width:20%;">
// 						</colgroup>
// 						<thead>
// 							<tr>
// 								<th style="text-align:center;font-weight:bold">S.No</th>
// 								<th style="font-weight:bold">API Vendor</th>
// 								<th style="font-weight:bold">API URL</th>
// 								<th style="font-weight:bold">Status</th>
// 								<th style="font-weight:bold">Call Time</th>
// 								<th style="font-weight:bold">Response Time</th>
// 								<th style="font-weight:bold">Request</th>
// 								<th style="font-weight:bold">Response</th>
// 							</tr>
// 						</thead>
// 						<tbody></tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }

// function getCourseProviderNameDropdownOptions() {
// 	var providerIds = [1, 2, 31, 36, 37, 38, 39, 40, 41];
// 	var options = '<option value="">Select Course Provider Name</option>';
// 	$.each(providerIds, function(_, providerId) {
// 		var providerName = getCourseProviderNameByIds(providerId);
// 		if (providerName) {
// 			options += '<option value="' + providerName + '">' + providerName + "</option>";
// 		}
// 	});
// 	return options;
// }

// function getTechnicalSettingInfoDiv(data) {
// 	var technical = data && data.schoolSettingsTechnical ? data.schoolSettingsTechnical : {};
// 	return `
// 		<style>
// 			.upload-wrapper {
// 				display: flex;
// 				align-items: center;
// 				border: 1px dashed #cbd5e1;
// 				border-radius: 8px;
// 				padding: 10px 12px;
// 				gap: 10px;
// 				background: #f8fafc;
// 			}
// 			.upload-icon {
// 				color: #2563eb;
// 				font-size: 18px;
// 				line-height: 1;
// 			}
// 			.upload-link {
// 				color: #2563eb;
// 				cursor: pointer;
// 				font-weight: 500;
// 				width: 100%;
// 				margin-bottom: 0;
// 			}
// 			.file-input {
// 				display: none;
// 			}
// 			.file-display {
// 				display: flex;
// 				align-items: center;
// 				gap: 10px;
// 				border: 1px dotted #2563eb;
// 				padding: 10px 12px;
// 				border-radius: 8px;
// 				background: #fff;
// 			}
// 			.technical-file-name {
// 				color: #334155;
// 				font-weight: 500;
// 				word-break: break-word;
// 			}
// 		</style>
// 		<div class="main-card mb-3 card body-tabs-shadow">
// 			<div class="card-body">
// 				<form action="javascript:void(0);" id="technicalSettingForm" name="technicalSettingForm" autocomplete="off">
// 					<input type="hidden" id="technicalSettingId" value="${technical.schoolSettingsTechnicalId || ""}">
// 					<div class="form-row">
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Show	Subject Cost On Signup</label>
// 								<div class="full pt-2">
// 						            <input name="showSubjectCostOnSignup" id="showSubjectCostOnSignup" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Flex Enrollment</label>
// 								<div class="full pt-2">
// 						            <input name="flexEnrollment" id="flexEnrollment" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">School Enrollment</label>
// 								<div class="full pt-2">
// 						            <input name="schoolEnrollment" id="schoolEnrollment" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Letter HeadImg</label>
// 								<div class="full pt-2">
// 						            <input name="letterHeadImg" id="letterHeadImg" type="hidden" value="">
// 						            <input name="letterHeadImgUpload" id="letterHeadImgUpload" type="file" class="form-control" accept="image/*"
// 						            	onchange="uploadSchoolSettingTechnicalImage(this, 'letterHeadImg', 'letterHeadImgDisplay')">
// 						            <div id="letterHeadImgDisplay" class="mt-2">
// 						            	<span class="technical-file-name text-success"></span>
// 						            </div>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Teach Agreement Sign</label>
// 								<div class="full pt-2">
// 						            <input name="teachAgreementSign" id="teachAgreementSign" type="hidden" value="">
// 						            <input name="teachAgreementSignUpload" id="teachAgreementSignUpload" type="file" class="form-control" accept="image/*"
// 						            	onchange="uploadSchoolSettingTechnicalImage(this, 'teachAgreementSign', 'teachAgreementSignDisplay')">
// 						            <div id="teachAgreementSignDisplay" class="mt-2 ">
// 						            	<span class="technical-file-name text-success"></span>
// 						            </div>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Authorized Person Name</label>
// 								<div class="full pt-2">
// 						            <input name="authorizedPersonName" id="authorizedPersonName" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Course ProviderId</label>
// 								<div class="full pt-2">
// 						            <input name="courseProviderId" id="courseProviderId" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Course ProviderId Batch</label>
// 								<div class="full pt-2">
// 						            <input name="courseProviderIdBatch" id="courseProviderIdBatch" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Course Provider Name</label>
// 								<div class="full pt-2">
// 									<select name="courseProviderName" id="courseProviderName" class="form-control">
// 										${getCourseProviderNameDropdownOptions()}
// 									</select>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Show Course In Manage Course</label>
// 								<div class="full pt-2">
// 						            <input name="showCourseInManageCourse" id="showCourseInManageCourse" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Currency IsoCode</label>
// 								<div class="full pt-2">
// 						            <input name="currencyIsoCode" id="currencyIsoCode" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Css File</label>
// 								<div class="full pt-2">
// 						            <input name="cssFile" id="cssFile" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Login BgImage</label>
// 								<div class="full pt-2">
// 						            <input name="loginBgImage" id="loginBgImage" type="hidden" value="">
// 						            <input name="loginBgImageUpload" id="loginBgImageUpload" type="file" class="form-control" accept="image/*"
// 						            	onchange="uploadSchoolSettingTechnicalImage(this, 'loginBgImage', 'loginBgImageDisplay')">
// 						            <div id="loginBgImageDisplay" class="mt-2">
// 						            	<span class="technical-file-name text-success"></span>
// 						            </div>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Signup Teacher Image</label>
// 								<div class="full pt-2">
// 						            <input name="signupTeacherImage" id="signupTeacherImage" type="hidden" value="">
// 						            <input name="signupTeacherImageUpload" id="signupTeacherImageUpload" type="file" class="form-control" accept="image/*"
// 						            	onchange="uploadSchoolSettingTechnicalImage(this, 'signupTeacherImage', 'signupTeacherImageDisplay')">
// 						            <div id="signupTeacherImageDisplay" class="mt-2">
// 						            	<span class="technical-file-name text-success"></span>
// 						            </div>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">School TimeZone</label>
// 								<div class="full pt-2">
// 						            <input name="schoolTimeZone" id="schoolTimeZone" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Meeting Link Provider</label>
// 								<div class="full pt-2">
// 						            <input name="meetingLinkProvider" id="meetingLinkProvider" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Meeting Prov Service Req</label>
// 								<div class="full pt-2">
// 						            <input name="meetingProvServiceReq" id="meetingProvServiceReq" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Batch TimeZone UTC1</label>
// 								<div class="full pt-2">
// 						            <input name="batchTimeZoneUTC1" id="batchTimeZoneUTC1" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Batch TimeZone UTC2</label>
// 								<div class="full pt-2">
// 						            <input name="batchTimeZoneUTC2" id="batchTimeZoneUTC2" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Copyright Year</label>
// 								<div class="full pt-2">
// 						            <input name="copyrightYear" id="copyrightYear" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Copyright Url</label>
// 								<div class="full pt-2">
// 						            <input name="copyrightUrl" id="copyrightUrl" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Copyright Name</label>
// 								<div class="full pt-2">
// 						            <input name="copyrightName" id="copyrightName" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Session Duration Elementry</label>
// 								<div class="full pt-2">
// 						            <input name="sessionDurationElementry" id="sessionDurationElementry" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Session Duration Middle</label>
// 								<div class="full pt-2">
// 						            <input name="sessionDurationMiddle" id="sessionDurationMiddle" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Session Duration High</label>
// 								<div class="full pt-2">
// 						            <input name="sessionDurationHigh" id="sessionDurationHigh" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">OneToOne Signup Label</label>
// 								<div class="full pt-2">
// 						            <input name="oneToOneSignupLabel" id="oneToOneSignupLabel" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Batch Signup Label</label>
// 								<div class="full pt-2">
// 						            <input name="batchSignupLabel" id="batchSignupLabel" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Scholarship Signup Label</label>
// 								<div class="full pt-2">
// 						            <input name="scholarshipSignupLabel" id="scholarshipSignupLabel" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Book Enrollment Duration</label>
// 								<div class="full pt-2">
// 						            <input name="bookEnrollmentDuration" id="bookEnrollmentDuration" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Discovery Education Addon</label>
// 								<div class="full pt-2">
// 						            <input name="discoveryEducationAddon" id="discoveryEducationAddon" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Discovery Education OneToOne</label>
// 								<div class="full pt-2">
// 						            <input name="discoveryEducationOneToOne" id="discoveryEducationOneToOne" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Discovery Education Batch</label>
// 								<div class="full pt-2">
// 						            <input name="discoveryEducationBatch" id="discoveryEducationBatch" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Discovery Education Scholarship</label>
// 								<div class="full pt-2">
// 						            <input name="discoveryEducationScholarship" id="discoveryEducationScholarship" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Batch Closed From</label>
// 								<div class="full pt-2">
// 						            <input name="batchClosedFrom" id="batchClosedFrom" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Show Student Course Selection Status</label>
// 								<div class="full pt-2">
// 						            <input name="showStudentCourseSelectionStatus" id="showStudentCourseSelectionStatus" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Elligiblity Status To Send Mail</label>
// 								<div class="full pt-2">
// 						            <input name="elligiblityStatusToSendMail" id="elligiblityStatusToSendMail" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Evaluation Test Fee</label>
// 								<div class="full pt-2">
// 						            <input name="evaluationTestFee" id="evaluationTestFee" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Meeting Auto Days</label>
// 								<div class="full pt-2">
// 						            <input name="meetingAutoDays" id="meetingAutoDays" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Common Payment UserId</label>
// 								<div class="full pt-2">
// 						            <input name="commonPaymentUserId" id="commonPaymentUserId" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Evaluation Module Name</label>
// 								<div class="full pt-2">
// 						            <input name="evaluationModuleName" id="evaluationModuleName" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Evaluation Mod Terms Name</label>
// 								<div class="full pt-2">
// 						            <input name="evaluationModTermsName" id="evaluationModTermsName" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Evaluation Mod Slot Time</label>
// 								<div class="full pt-2">
// 						            <input name="evaluationModSlotTime" id="evaluationModSlotTime" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Evaluation Mod Slot BufTime</label>
// 								<div class="full pt-2">
// 						            <input name="evalModSlotBufTime" id="evalModSlotBufTime" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Eval Slot Cron Time</label>
// 								<div class="full pt-2">
// 						            <input name="evalSlotCronTime" id="evalSlotCronTime" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Eval Slot View TimeDiff</label>
// 								<div class="full pt-2">
// 						            <input name="evalSlotViewTimeDiff" id="evalSlotViewTimeDiff" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Evaluation Mod Enabled</label>
// 								<div class="full pt-2">
// 						            <input name="evaluationModEnabled" id="evaluationModEnabled" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Payment Reminder Service</label>
// 								<div class="full pt-2">
// 						            <input name="paymentReminderService" id="paymentReminderService" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Payment Reminder Before</label>
// 								<div class="full pt-2">
// 						            <input name="paymentReminderBefore" id="paymentReminderBefore" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Payment Reminder Maximum Days</label>
// 								<div class="full pt-2">
// 						            <input name="paymentReminderMaximumDays" id="paymentReminderMaximumDays" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Payment Reminder Frequency</label>
// 								<div class="full pt-2">
// 						            <input name="paymentReminderFrequency" id="paymentReminderFrequency" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Lms Account Loc Service</label>
// 								<div class="full pt-2">
// 						            <input name="lmsAccountLocService" id="lmsAccountLocService" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Account Lock In Days</label>
// 								<div class="full pt-2">
// 						            <input name="accountLockInDays" id="accountLockInDays" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Transcript Signature</label>
// 								<div class="full pt-2">
// 						            <input name="transcriptSignature" id="transcriptSignature" type="hidden" value="">
// 						            <input name="transcriptSignatureUpload" id="transcriptSignatureUpload" type="file" class="form-control" accept="image/*"
// 						            	onchange="uploadSchoolSettingTechnicalImage(this, 'transcriptSignature', 'transcriptSignatureDisplay')">
// 						            <div id="transcriptSignatureDisplay" class="mt-2">
// 						            	<span class="technical-file-name text-success"></span>
// 						            </div>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Book An Enrollment Service</label>
// 								<div class="full pt-2">
// 						            <input name="bookAnEnrollmentService" id="bookAnEnrollmentService" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Flex Signup Label</label>
// 								<div class="full pt-2">
// 						            <input name="flexSignupLabel" id="flexSignupLabel" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Curse ProviderId Scholarship</label>
// 								<div class="full pt-2">
// 						            <input name="curseProviderIdScholarship" id="curseProviderIdScholarship" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">One Roaster Upload Service</label>
// 								<div class="full pt-2">
// 						            <input name="oneRoasterUploadService" id="oneRoasterUploadService" type="text" class="form-control" value="">
// 								</div>
// 							</div>
// 						</div>
// 					</div>
					
// 				</form>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolOfficeSettingInfoDiv(data) {
// 	var office = data && data.schoolSettingsOffice ? data.schoolSettingsOffice : {};
// 	return `
// 		<div class="main-card mb-3 card body-tabs-shadow">
// 			<div class="card-body">
// 				<form action="javascript:void(0);" id="officeSettingForm" name="officeSettingForm" autocomplete="off">
// 					<div class="form-row">
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">School Type</label>
// 								<div class="full pt-2">
// 									<select name="schoolType" id="schoolType" class="form-control">
// 										${getSchoolSettingSchoolTypeOptions(office.schoolType)}
// 									</select>
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Parent School ID</label>
// 								<div class="full pt-2">
// 									<input name="parentSchoolId" id="parentSchoolId" type="text" class="form-control" value="${office.parentSchoolId || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">UUID</label>
// 								<div class="full pt-2">
// 									<input name="uuid" id="uuid" type="text" class="form-control" value="${office.uuid || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">School Name</label>
// 								<div class="full pt-2">
// 									<input name="schoolName" id="schoolName" type="text" class="form-control" value="${office.schoolName || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Contact Email</label>
// 								<div class="full pt-2">
// 									<input name="contactEmail" id="contactEmail" type="email" class="form-control" value="${office.contactEmail || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">WhatsApp Code</label>
// 								<div class="full pt-2">
// 									<input name="whatsAppCode" id="whatsAppCode" type="text" class="form-control" value="${office.whatsAppCode || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">WhatsApp Contact</label>
// 								<div class="full pt-2">
// 									<input name="whatsAppContact" id="whatsAppContact" type="text" class="form-control" value="${office.whatsAppContact || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">School Contact Code</label>
// 								<div class="full pt-2">
// 									<input name="schoolContactCode" id="schoolContactCode" type="text" class="form-control" value="${office.schoolContactCode || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">School Contact</label>
// 								<div class="full pt-2">
// 									<input name="schoolContact" id="schoolContact" type="text" class="form-control" value="${office.schoolContact || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Landline Code</label>
// 								<div class="full pt-2">
// 									<input name="landlineCode" id="landlineCode" type="text" class="form-control" value="${office.landlineCode || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Landline Contact</label>
// 								<div class="full pt-2">
// 									<input name="landlineContact" id="landlineContact" type="text" class="form-control" value="${office.landlineContact || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Contact For Certificate</label>
// 								<div class="full pt-2">
// 									<input name="contactForCertificate" id="contactForCertificate" type="text" class="form-control" value="${office.contactForCertificate || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Demo Contact</label>
// 								<div class="full pt-2">
// 									<input name="demoContact" id="demoContact" type="text" class="form-control" value="${office.demoContact || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">WhatsApp Code Teacher</label>
// 								<div class="full pt-2">
// 									<input name="whatsAppCodeTeacher" id="whatsAppCodeTeacher" type="text" class="form-control" value="${office.whatsAppCodeTeacher || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">WhatsApp Contact Teacher</label>
// 								<div class="full pt-2">
// 									<input name="whatsAppContactTeacher" id="whatsAppContactTeacher" type="text" class="form-control" value="${office.whatsAppContactTeacher || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">WhatsApp Contact With Format</label>
// 								<div class="full pt-2">
// 									<input name="whatsappContactWithFormat" id="whatsappContactWithFormat" type="text" class="form-control" value="${office.whatsappContactWithFormat || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">WhatsApp Contact Teacher With Format</label>
// 								<div class="full pt-2">
// 									<input name="whatsappContactTeacherWithFormat" id="whatsappContactTeacherWithFormat" type="text" class="form-control" value="${office.whatsappContactTeacherWithFormat || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Office Contact Num Wts Check</label>
// 								<div class="full pt-2">
// 									<input name="officeContactNumWtsCheck" id="officeContactNumWtsCheck" type="text" class="form-control" value="${office.officeContactNumWtsCheck || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Support Num Wts Check</label>
// 								<div class="full pt-2">
// 									<input name="supportNumWtsCheck" id="supportNumWtsCheck" type="text" class="form-control" value="${office.supportNumWtsCheck || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Is School Setup Complete</label>
// 								<div class="full pt-2">
// 									<input name="isSchoolSetupComplete" id="isSchoolSetupComplete" type="text" class="form-control" value="${office.isSchoolSetupComplete || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Support Contact Code</label>
// 								<div class="full pt-2">
// 									<input name="supportContactCode" id="supportContactCode" type="text" class="form-control" value="${office.supportContactCode || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Support Contact</label>
// 								<div class="full pt-2">
// 									<input name="supportContact" id="supportContact" type="text" class="form-control" value="${office.supportContact || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Country Code</label>
// 								<div class="full pt-2">
// 									<input name="countryCode" id="countryCode" type="text" class="form-control" value="${office.countryCode || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Support Contact Country Code</label>
// 								<div class="full pt-2">
// 									<input name="supportContactCountryCode" id="supportContactCountryCode" type="text" class="form-control" value="${office.supportContactCountryCode || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">Module Permissions</label>
// 								<div class="full pt-2">
// 									<textarea name="modulePermissions" id="modulePermissions" class="form-control" rows="4">${office.modulePermissions || ""}</textarea>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolLinksSettingInfoDiv(data) {
// 	var schoolLinks = data && data.schoolSettingsLinks ? data.schoolSettingsLinks : {};
// 	var fields = [
// 		["schoolSettingsLinksId", "School Settings Links ID"],
// 		["schoolWebsite", "School Website"],
// 		["logoUrl", "Logo URL"],
// 		["receiptLogoUrl", "Receipt Logo URL"],
// 		["emailLogoUrl", "Email Logo URL"],
// 		["favIconUrl", "Fav Icon URL"],
// 		["signupUrl", "Signup URL"],
// 		["ticketRaisedUrl", "Ticket Raised URL"],
// 		["termasOfUserUrl", "Terms Of Use URL"],
// 		["contactUsUrl", "Contact Us URL"],
// 		["contactUsActive", "Contact Us Active"],
// 		["privacyPolicyUrl", "Privacy Policy URL"],
// 		["instagramUrl", "Instagram URL"],
// 		["fbUrl", "Facebook URL"],
// 		["pintrestUrl", "Pinterest URL"],
// 		["twitterUrl", "Twitter URL"],
// 		["linkdinUrl", "LinkedIn URL"],
// 		["codeConductUrl", "Code Of Conduct URL"],
// 		["chatBoatActive", "Chat Boat Active"],
// 		["chatBoatUrl", "Chat Boat URL"],
// 		["studHBookUrl", "Student Handbook URL"],
// 		["batchStudHBookUrl", "Batch Student Handbook URL"],
// 		["enrollmentPolicyUrl", "Enrollment Policy URL"],
// 		["studentPolicytUrl", "Student Policy URL"],
// 		["schoolPolicyUrl", "School Policy URL"],
// 		["ytUrl", "YouTube URL"],
// 		["whiteLogoUrl", "White Logo URL"],
// 		["dashboardVideoUrl", "Dashboard Video URL"],
// 		["schoolStamp", "School Stamp"]
// 	];
// 	var fieldsHtml = "";
// 	$.each(fields, function(index, field) {
// 		fieldsHtml += `
// 			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 				<div class="position-relative form-group mb-2">
// 					<label class="m-0">${field[1]}</label>
// 					<div class="full pt-2">
// 						<input name="${field[0]}" id="${field[0]}" type="text" class="form-control" value="${schoolLinks[field[0]] || ""}">
// 					</div>
// 				</div>
// 			</div>
// 		`;
// 	});
// 	return `
// 		<div class="main-card mb-3 card body-tabs-shadow">
// 			<div class="card-body">
// 				<form action="javascript:void(0);" id="schoolLinksSettingForm" name="schoolLinksSettingForm" autocomplete="off">
// 					<div class="form-row">
// 						${fieldsHtml}
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolMailsSettingInfoDiv(data) {
// 	var schoolMails = data && data.schoolSettingsMails ? data.schoolSettingsMails : {};
// 	var fields = [
// 		["senderEmail", "Sender Email"],
// 		["emailForClassRoomSession", "Email For Class Room Session"],
// 		["emailForDemoCouncelling", "Email For Demo Councelling"],
// 		["emailForStudentInstallmentFee", "Email For Student Installment Fee"],
// 		["emailForPpcRequest", "Email For Ppc Request"],
// 		["emailForClientSignup", "Email For Client Signup"],
// 		["emailForHiring", "Email For Hiring"],
// 		["emailAccountName", "Email Account Name"],
// 		["emailAccountAdminName", "Email Account Admin Name"],
// 		["emailAccountSupport", "Email Account Support"],
// 		["emailOtherAdmain", "Email Other Admain"],
// 		["technicalEmail", "Technical Email"],
// 		["emailAccountForAuditor", "Email Account For Auditor"],
// 		["withdrawalRequestAdmin", "Withdrawal Request Admin"],
// 		["emailOfB2bSchool", "Email Of B2b School"],
// 		["emailForOtherSchool", "Email For Other School"],
// 		["notificationEmail", "Notification Email"],
// 		["careersEmail", "Careers Email"]
// 	];
// 	var fieldsHtml = "";
// 	$.each(fields, function(index, field) {
// 		fieldsHtml += `
// 			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 				<div class="position-relative form-group mb-2">
// 					<label class="m-0">${field[1]}</label>
// 					<div class="full pt-2">
// 						<input name="${field[0]}" id="${field[0]}" type="text" class="form-control" value="${schoolMails[field[0]] || ""}">
// 					</div>
// 				</div>
// 			</div>
// 		`;
// 	});
// 	return `
// 		<div class="main-card mb-3 card body-tabs-shadow">
// 			<div class="card-body">
// 				<div class="d-flex align-items-center justify-content-between mb-3">
// 					<h5 class="m-0 font-weight-bold">School Mails</h5>
// 				</div>
// 				<form action="javascript:void(0);" id="schoolMailsSettingForm" name="schoolMailsSettingForm" autocomplete="off">
// 					<div class="form-row">
// 						${fieldsHtml}
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolFeedbackSettingInfoDiv(data) {
// 	var feedbackSettings = data && data.schoolSettingFeedback ? data.schoolSettingFeedback : {};
// 	return `
// 		<div class="main-card mb-3 card body-tabs-shadow">
// 			<div class="card-body">
// 				<form action="javascript:void(0);" id="schoolFeedbackSettingForm" name="schoolFeedbackSettingForm" autocomplete="off">
// 					<input type="hidden" id="feedbackSettingId" value="${feedbackSettings.id || ""}">
// 					<div class="form-row">
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">VENDOR_ID</label>
// 								<div class="full pt-2">
// 									<input name="feedbackVendorId" id="feedbackVendorId" type="text" class="form-control" value="${feedbackSettings.vendorId || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">API_KEY</label>
// 								<div class="full pt-2">
// 									<input name="feedbackApiKey" id="feedbackApiKey" type="text" class="form-control" value="${feedbackSettings.apiKey || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">FEEDBACK_API_URL</label>
// 								<div class="full pt-2">
// 									<input name="feedbackApiUrl" id="feedbackApiUrl" type="text" class="form-control" value="${feedbackSettings.feedbackApiUrl || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
// 							<div class="position-relative form-group mb-2">
// 								<label class="m-0">FEEDBACK_DASHBOARD_URL</label>
// 								<div class="full pt-2">
// 									<input name="feedbackDashboardUrl" id="feedbackDashboardUrl" type="text" class="form-control" value="${feedbackSettings.feedbackDashboardUrl || ""}">
// 								</div>
// 							</div>
// 						</div>
// 						<div class="col-12">
// 							<button type="button" class="mt-2 btn btn-success" onclick="saveSchoolSettingData('schoolSettingForm','FB', ($('#feedbackSettingId').val() || '0'), ($('#schoolSettigsSelection').val() || '0'));">Save</button>
// 						</div>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	`;
// }

// function getSchoolSettingSchoolTypeOptions(selectedValue) {
// 	var schoolTypes = [
// 		{ value: "", label: "Select Partner Type" },
// 		{ value: "GP", label: "Enrollment Partner" },
// 		{ value: "WLP", label: "White Label Partner" },
// 		{ value: "EPER", label: "Enrollment Partner with Enrollment Rights" }
// 	];
// 	var html = ``;
// 	$.each(schoolTypes, function(index, option) {
// 		html += `<option value="${option.value}" ${String(option.value) == String(selectedValue || "") ? "selected" : ""}>${option.label}</option>`;
// 	});
// 	return html;
// }

// function getSchoolSettingBooleanChecked(value) {
// 	if (value === true || value === "true" || value === "Y" || value === "1" || value === 1) {
// 		return "checked";
// 	}
// 	return "";
// }

// function renderSchoolSettingAllDataTable(details) {
// 	var html = ``;
// 	$.each(details || [], function(index, value) {
// 		html += `
// 			<tr id="schoolSettingRow${index}">
// 				<td style="white-space:nowrap;text-align:center;">${index + 1}</td>
// 				<input type="hidden" id="primaryID" value="${value.id || ""}"/>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">
// 					<span class="textValue">${value.metaType || ""}</span>
// 					<input type="text" class="d-none inputValue" id="metaType${value.id || index}" value="${value.metaType || ""}" style="width:100%;" maxlength="100">
// 				</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">
// 					<span class="textValue">${value.metaKey || ""}</span>
// 					<input type="text" class="d-none inputValue" id="metaKey${value.id || index}" value="${value.metaKey || ""}" style="width:100%;" maxlength="100">
// 				</td>
// 				<td style="white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">
// 					<span class="textValue">${value.metaValue || ""}</span>
// 					<textarea type="text" class="d-none inputValue metaValue" id="metaValue${value.id || index}" style="width:100%;min-height:70px;" maxlength="2000">${value.metaValue || ""}</textarea>
// 				</td>
// 				<td style="white-space:nowrap;text-align:center;">
// 					<span class="textValue">${value.parentId || 0}</span>
// 					<input type="number" class="d-none inputValue" id="parentId${value.id || index}" value="${value.parentId || 0}" style="width:100%;">
// 				</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.createdDate || ""}</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.updatedDate || ""}</td>
// 				<td style="white-space:nowrap;text-align:center;">
// 					<a href="javascript:void(0)" type="button" class="btn bnt-sm btn-primary edit-button" id="editButton"><i class="fas fa-edit"></i></a>
// 					<a href="javascript:void(0)" class="btn btn-sm btn-success save-button d-none" onclick="editSettingData('schoolSettingForm',${value.id || index},'settingTable')"><i class="fas fa-check"></i></a>
// 					<a href="javascript:void(0)" class="cancel-button btn btn-danger d-none"><i class="fas fa-times"></i></a>
// 				</td>
// 			</tr>
// 		`;
// 	});
// 	$("#settingTable tbody").html(html);
// }

// function renderSchoolSettingApiCallDetailsTable(details) {
// 	var html = ``;
// 	$.each(details || [], function(index, value) {
// 		html += `
// 			<tr id="apiCallRow${index}">
// 				<td style="white-space:nowrap;text-align:center;">${index + 1}</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.apiVendor || "N/A"}</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.apiUrl || "N/A"}</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.status || "N/A"}</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.callDateTime || "N/A"}</td>
// 				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.responseDateTime || "N/A"}</td>
// 				<td style="white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${value.request || "N/A"}</td>
// 				<td style="white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${value.response || "N/A"}</td>
// 			</tr>
// 		`;
// 	});
// 	$("#apiCallDetailsTable tbody").html(html);
// }

// function getSchoolSettingSimpleOptions(optionList, selectedValue) {
// 	var html = ``;
// 	$.each(optionList || [], function(index, option) {
// 		var optionValue = getSchoolSettingOptionValue(option);
// 		var optionLabel = getSchoolSettingOptionLabel(option);
// 		html += `<option value="${optionValue}" ${String(optionValue) == String(selectedValue) ? "selected" : ""}>${optionLabel}</option>`;
// 	});
// 	return html;
// }

// function getSchoolSettingGatewayOptions(optionList, selectedValue) {
// 	var html = ``;
// 	$.each(optionList || [], function(index, option) {
// 		var optionValue = option && typeof option === "object" ? (option.value || option.label || option.key || "") : option;
// 		var optionLabel = option && typeof option === "object" ? (option.value || option.label || option.key || "") : option;
// 		html += `<option value="${optionValue}" ${String(optionValue) == String(selectedValue) ? "selected" : ""}>${optionLabel}</option>`;
// 	});
// 	return html;
// }

// function getSchoolSettingLmsProviderOptions(optionList, selectedValue) {
// 	var html = ``;
// 	$.each(optionList || [], function(index, option) {
// 		var optionValue = option && typeof option === "object" ? (option.key || option.value || "") : option;
// 		var optionLabel = option && typeof option === "object" ? (option.value || option.label || option.key || "") : option;
// 		html += `<option value="${optionValue}" ${String(optionValue) == String(selectedValue) ? "selected" : ""}>${optionLabel}</option>`;
// 	});
// 	return html;
// }

// function getSchoolSettingOptionValue(option) {
// 	if (option && typeof option === "object") {
// 		return option.value || option.key || option.schoolId || option.sessionId || option.id || option.name || option.label || "";
// 	}
// 	return option;
// }

// function getSchoolSettingOptionLabel(option) {
// 	if (option && typeof option === "object") {
// 		return option.label || option.value || option.key || option.schoolName || option.sessionName || option.name || option.id || "";
// 	}
// 	return option;
// }

// function getSchoolSettingValueOptions(optionList, selectedValue) {
// 	var html = ``;
// 	$.each(optionList || [], function(index, option) {
// 		html += `<option value="${option.value}" ${option.value == selectedValue ? "selected" : ""}>${option.label}</option>`;
// 	});
// 	return html;
// }

// function getSchoolSettingProviderName(lmsProviderId) {
// 	var providers = {
// 		1: "Agilix Buzz",
// 		2: "Odysseyware",
// 		31: "Buzz",
// 		36: "BUZZ",
// 		37: "BUZZ-GC",
// 		38: "BUZZ-GR",
// 		39: "Exact-Path",
// 		40: "Edmentum-Canvas",
// 		41: "Courseware"
// 	};
// 	return providers[lmsProviderId] || lmsProviderId || "";
// }

// function renderSchoolSettingRoleData(roleLms) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.roleLms = roleLms || [];
// 	if ($("#roleLms tbody").length) {
// 		$("#roleLms tbody").html(getLmsRoleMappingRows(roleLms || []));
// 	}
// }

// function renderSchoolSettingSessionData(sessionList) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.sessionList = sessionList || [];
// 	if ($("#sessionList").length) {
// 		$("#sessionList").html(getSchoolSettingSimpleOptions(sessionList || [], $("#sessionList").val()));
// 	}
// 	if ($("#sessionList").data("select2")) {
// 		$("#sessionList").trigger("change.select2");
// 	}
// }
