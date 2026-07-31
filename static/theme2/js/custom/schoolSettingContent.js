function getSchoolSettingDashboardHtml(title, data) {
	return `
		${getSchoolSettingPageHeader(title)}
		${getSchoolSettingPageContent(data)}
	`;
}

function getSchoolSettingPageHeader(title) {
	return `
		<div class="app-page-title mb-3 py-2">
			<div class="page-title-wrapper d-flex justify-content-between align-items-center">
				<div class="page-title-heading">
					<div class="page-title-icon"><i class="fa fa-cog text-primary"></i></div>
					<div>${title}</div>
				</div>
				<a href="javascript:void(0)" class="btn btn-dark rounded text-white" onclick="callDashboardPageSchool('','home')">
					<i class="fa fa-arrow-left mr-1"></i>Back to Dashboard
				</a>
			</div>
		</div>
	`;
}

function getSchoolSettingPageContent(data) {
	return `
		<div class="main-card mb-3 card body-tabs-shadow">
			<div class="card-body p-0">
				<form action="javascript:void(0);" id="schoolSettingForm" name="schoolSettingForm" autocomplete="off">
					<div class="text-center px-3 pt-3" id="ErrorMsg">
						<span class="text-warning" style="font-weight:bold;color:red;" id="errMsg"></span>
					</div>
					<div class="ss-layout">
						<div class="ss-layout__nav">
							${getSchoolSettingTabs(data)}
						</div>
						<div class="ss-layout__content">
							${getSchoolSettingSections(data)}
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
}

function getSchoolSettingSchoolOptions(schoolSettingses, selectedSchoolId) {
	var html = ``;
	$.each(schoolSettingses || [], function(index, school) {
		html += `
			<option value="${school.schoolId}" ${school.schoolId == selectedSchoolId ? "selected" : ""}>
				${school.schoolName}
			</option>
		`;
	});
	return html;
}

function getSchoolSettingSectionHeader(title, subtitle) {
	return `
		<div class="mb-3">
			<h4 class="font-weight-bold mb-0">${title}</h4>
			<p class="text-muted mb-0">${subtitle}</p>
		</div>
	`;
}

function getSchoolSettingNavItem(liId, dataTab, icon, title, subtitle, isActive) {
	return `
		<li id="${liId}" class="ss-nav-item">
			<a role="tab" class="ss-nav-link${isActive ? " ss-nav-link--active" : ""}" data-tab="${dataTab}" href="javascript:void(0);">
				<div class="ss-nav-icon">
					<i class="fa ${icon}"></i>
				</div>
				<div class="ss-nav-text">
					<div class="ss-nav-title">${title}</div>
					<div class="ss-nav-subtitle">${subtitle}</div>
				</div>
			</a>
		</li>
	`;
}

function getSchoolSettingTabs(data) {
	var showSettingTab = !!(data && data.showSettingTab);
	return `
		<div class="ss-nav-header">SCHOOL SETTING</div>
		<ul class="ss-nav-list">
			${getSchoolSettingNavItem("stgTab",           "STG",         "fa-sliders-h",     "Setting",           "Meta keys &amp; values",  false)}
			${getSchoolSettingNavItem("integrationTab",   "INTEGRATION", "fa-plug",          "Integration",       "External providers",       false)}
			${getSchoolSettingNavItem("lmssmTab",         "LMSSM",       "fa-university",    "LMS School Mapping","Campus to LMS",            false)}
			${getSchoolSettingNavItem("lmsrmTab",         "LMSRM",       "fa-users",         "LMS Role Mapping",  "Role sync rules",          false)}
			${getSchoolSettingNavItem("sfTab",            "SF",          "fa-graduation-cap","Grade Fee Details", "Tuition per grade",        false)}
			${getSchoolSettingNavItem("techTab",          "TECH",        "fa-wrench",        "Technical Setting", "Runtime &amp; limits",     false)}
			${getSchoolSettingNavItem("schoolSettingsTab","SS",          "fa-cogs",          "School Settings",   "Profile &amp; branding",   false)}
			${getSchoolSettingNavItem("logTab",           "LOG",         "fa-clipboard-list","LOG",               "Audit trail",              false)}
		</ul>
		<style>
			/* ── School Setting two-column layout ── */
			.ss-layout {
				display: flex;
				flex-direction: row;
				height: calc(100vh - 160px);
				min-height: 500px;
			}
			.ss-layout__nav {
				width: 260px;
				min-width: 260px;
				max-width: 260px;
				height: 100%;
				overflow-y: auto;
				overflow-x: hidden;
				padding: 16px 12px;
				border-right: 1px solid #eef0f4;
				scrollbar-width: none;
				flex-shrink: 0;
			}
			.ss-layout__nav::-webkit-scrollbar {
				display: none;
			}
			.ss-layout__content {
				flex: 1;
				height: 100%;
				overflow-y: auto;
				overflow-x: hidden;
				padding: 16px 20px;
				min-width: 0;
			}
			@media (max-width: 991px) {
				.ss-layout {
					flex-direction: column;
					height: auto;
				}
				.ss-layout__nav {
					width: 100%;
					max-width: 100%;
					height: auto;
					overflow-y: visible;
					border-right: none;
					border-bottom: 1px solid #eef0f4;
				}
				.ss-layout__content {
					height: auto;
					overflow-y: visible;
				}
			}

			/* ── School Setting sidebar nav ── */
			.ss-nav-header {
				font-size: 11px;
				font-weight: 700;
				letter-spacing: 1.2px;
				color: #8c96a8;
				padding: 0 4px 10px 4px;
				text-transform: uppercase;
			}
			.ss-nav-list {
				list-style: none;
				margin: 0;
				padding: 0;
			}
			.ss-nav-item {
				margin-bottom: 4px;
			}
			.ss-nav-link {
				display: flex;
				align-items: center;
				gap: 14px;
				padding: 10px 14px;
				border-radius: 12px;
				text-decoration: none;
				color: #3d4a5c;
				background: transparent;
				transition: background 0.15s ease, box-shadow 0.15s ease;
			}
			.ss-nav-link:hover {
				background: #f0f2f5;
				text-decoration: none;
				color: #3d4a5c;
			}
			.ss-nav-link--active {
				background: #ffffff;
				box-shadow: 0 2px 10px rgba(0,0,0,0.09);
				color: #1a2335;
			}
			.ss-nav-link--active .ss-nav-icon {
				background: #e5f6ec;
				color: #27ae60;
			}
			.ss-nav-icon {
				flex: 0 0 40px;
				width: 40px;
				height: 40px;
				border-radius: 50%;
				background: #eef0f4;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #5a6882;
				font-size: 15px;
				transition: background 0.15s ease, color 0.15s ease;
			}
			.ss-nav-title {
				font-size: 14px;
				font-weight: 600;
				color: inherit;
				line-height: 1.3;
				white-space: nowrap;
			}
			.ss-nav-subtitle {
				font-size: 12px;
				color: #8c96a8;
				line-height: 1.3;
				margin-top: 1px;
				white-space: nowrap;
			}
			.ss-nav-link--active .ss-nav-title {
				color: #1a2335;
			}

			/* ── Setting table search ── */
			.ss-search-wrap {
				position: relative;
				display: inline-flex;
				align-items: center;
				width: 100%;
				max-width: 260px;
				background: #f5f6f8;
				border-radius: 10px;
				transition: box-shadow 0.2s ease, background 0.2s ease;
			}
			.ss-search-wrap:focus-within {
				background: #ffffff;
				box-shadow: 0 0 0 2px #d0e8ff;
			}
			.ss-search-icon {
				position: absolute;
				left: 14px;
				color: #a0aab8;
				font-size: 13px;
				pointer-events: none;
			}
			.ss-search-input {
				width: 100%;
				border: none;
				background: transparent;
				padding: 9px 36px 9px 38px;
				font-size: 13px;
				color: #2d3748;
				outline: none;
				border-radius: 10px;
			}
			.ss-search-input::placeholder {
				color: #b0bac8;
			}
			.ss-search-clear {
				position: absolute;
				right: 10px;
				background: none;
				border: none;
				padding: 4px 6px;
				color: #b0bac8;
				font-size: 11px;
				cursor: pointer;
				border-radius: 6px;
				transition: color 0.15s ease, background 0.15s ease;
				line-height: 1;
			}
			.ss-search-clear:hover {
				color: #5a6882;
				background: #eaecef;
			}
		</style>
	`;
}

function getSchoolSettingSections(data) {
	return `
		${getLmsSchoolMappingInfoDiv(data)}
		${getLmsRoleMappingInfoDiv(data)}
		${getCycleIntakeInfoDiv(data)}
		${getStandardFeeInfoDiv()}
		${getSettingAllDataDiv()}
		${getSchoolSettingLogDiv(data)}
		<div id="templateDiv" style="display:none;"></div>
		<div id="sessionDiv" style="display:none;"></div>
		<div id="TechnicalDiv" style="display:none;">
			${getSchoolSettingSectionHeader("Technical Setting", "Runtime &amp; limits")}
			${getTechnicalSettingInfoDiv(data)}
		</div>
		<div id="SchoolSettingsDiv" style="display:none;">
			${getSchoolSettingSectionHeader("School Settings", "Profile &amp; branding")}
			<div class="full">
				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
					<li class="nav-item">
						<a role="tab" class="nav-link active" href="javascript:void(0)" id="schoolOfficeTabBtn" data-school-settings-subtab="OFFICE" onclick="if(typeof openSchoolSettingsSubTab==='function'){openSchoolSettingsSubTab('OFFICE');}else if(typeof getSchoolSettingData==='function'){getSchoolSettingData('OFFICE');} return false;">
							<span>School Office</span>
						</a>
					</li>
					<li class="nav-item">
						<a role="tab" class="nav-link" href="javascript:void(0)" id="schoolLinksTabBtn" data-school-settings-subtab="SL" onclick="if(typeof openSchoolSettingsSubTab==='function'){openSchoolSettingsSubTab('SL');}else if(typeof getSchoolSettingData==='function'){getSchoolSettingData('SL');} return false;">
							<span>School Links</span>
						</a>
					</li>
					<li class="nav-item">
						<a role="tab" class="nav-link" href="javascript:void(0)" id="schoolMailsTabBtn" data-school-settings-subtab="SM" onclick="if(typeof openSchoolSettingsSubTab==='function'){openSchoolSettingsSubTab('SM');}else if(typeof getSchoolSettingData==='function'){getSchoolSettingData('SM');} return false;">
							<span>School Mails</span>
						</a>
					</li>
				</ul>
			</div>
			<div id="OfficeDiv" class="mt-3" style="display:none;">
				${getSchoolOfficeSettingInfoDiv(data)}
			</div>
			<div id="SchoolLinksDiv" class="mt-3" style="display:none;">
				${getSchoolLinksSettingInfoDiv(data)}
			</div>
			<div id="SchoolMailsDiv" class="mt-3" style="display:none;">
				${getSchoolMailsSettingInfoDiv(data)}
			</div>
		</div>
		<div id="IntegrationMainDiv" style="display:none;">
			${getSchoolSettingSectionHeader("Integration", "External providers")}
			<div class="full mb-3">
				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
					<li class="nav-item">
						<a role="tab" class="nav-link active" href="javascript:void(0)" id="schoolIntegrationPgTabBtn" data-school-settings-integration-subtab="IPG" onclick="if(typeof openSchoolSettingsIntegrationSubTab==='function'){openSchoolSettingsIntegrationSubTab('IPG');} return false;">
							<span>Payment Gateway Setting</span>
						</a>
					</li>
					<li class="nav-item">
						<a role="tab" class="nav-link" href="javascript:void(0)" id="schoolFeedbackTabBtn" data-school-settings-integration-subtab="FB" onclick="if(typeof openSchoolSettingsIntegrationSubTab==='function'){openSchoolSettingsIntegrationSubTab('FB');} return false;">
							<span>Feedback</span>
						</a>
					</li>
				</ul>
			</div>
			<div id="IntegrationPaymentGatewayDiv" style="display:none;">
				${getPaymentGatewayInfoDiv(data)}
			</div>
			<div id="SchoolFeedbackDiv" style="display:none;">
				${getSchoolFeedbackSettingInfoDiv(data)}
			</div>
		</div>
	`;
}

function getSchoolSettingLogDiv(data) {
	var showApiCallDetails = !!(data && data.showSettingTab);
	return `
		<div id="LogDiv" style="display:none;">
			${getSchoolSettingSectionHeader("LOG", "Audit trail")}
			<div class="full">
				<div class="main-card mb-3 card">
					<div class="card-body">
						<div class="full mt-3">
							${showApiCallDetails ? `
								<a href="javascript:void(0)" class="btn btn-outline-primary active" id="logSubApiCallDetails">
									API Call Details
								</a>
							` : ``}
						</div>
						<div class="full mt-3" id="logContentWrapper">
							${showApiCallDetails ? `${getApiCallDetailsDiv()}` : ``}
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}

function getPaymentGatewayInfoDiv(data) {
	var pgsettings = data.pgsettings || {};
	return `
		<div id="paymentGatewayInfoDiv">
			<div class="form-row">
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Payment Gateway</label>
						<select id="paymentGateway" class="multiselect-dropdown form-control">
							${getSchoolSettingGatewayOptions(data.paymentGatewayNames, pgsettings.gatewayName)}
						</select>
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Endpoint URL</label>
						<input name="endPointUrl" id="endPointUrl" type="text" class="form-control" value="${pgsettings.endpointUrl || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Merchant Email</label>
						<input name="merchantEmail" id="merchantEmail" type="email" class="form-control" value="${pgsettings.merchantEmail || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Secret Key/Transaction Key</label>
						<input name="secretKey" id="secretKey" type="text" class="form-control" value="${pgsettings.secretKey || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Client Id/API Login Id</label>
						<input id="clientId" name="clientId" type="text" class="form-control" value="${pgsettings.clientId || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Payment Mode IP/Website</label>
						<input id="paymentModeIp" name="paymentModeIp" type="text" class="form-control" value="${pgsettings.paymentModeIp || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Gateway Mode</label>
						<select id="gatewayMode" name="gatewayMode" class="multiselect-dropdown form-control">
							${getSchoolSettingValueOptions([{ value: "TEST", label: "TEST" }, { value: "LIVE", label: "LIVE" }], pgsettings.gatewayMode || "TEST")}
						</select>
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Status</label>
						<select id="pgStatus" name="pgStatus" class="multiselect-dropdown form-control">
							${getSchoolSettingValueOptions([{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }], pgsettings.active == "Y" ? "ACTIVE" : "INACTIVE")}
						</select>
					</div>
				</div>
			</div>
			<button type="button" class="mt-2 btn btn-success" id="saveDataPayment" onclick="saveSchoolSettingData('schoolSettingForm','PG','0','1');">Save</button>
		</div>
	`;
}

function getLmsSchoolMappingInfoDiv(data) {
	var schoolSettingsLms = data.schoolSettingsLms || {};
	var resolvedLmsSettingId = parseInt(schoolSettingsLms.id, 10) || 0;
	var resolvedLmsSchoolId = parseInt(schoolSettingsLms.schoolId, 10) || parseInt(data.selectedSchoolId, 10) || parseInt(SCHOOL_ID, 10) || 1;
	return `
		<div id="lmsSchoolMappingInfoDiv" style="display:none;">
			${getSchoolSettingSectionHeader("LMS School Mapping", "Campus to LMS")}
			<div class="form-row">
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">LMS Providers</label>
						<select id="lmsProviderId" class="multiselect-dropdown form-control">
							${getSchoolSettingLmsProviderOptions(data.lmsProvideres, schoolSettingsLms.lmsProviderId)}
						</select>
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Domain ID</label>
						<input name="domainId" id="domainId" type="text" class="form-control" value="${schoolSettingsLms.domainId || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Domain Name</label>
						<input name="domainName" id="domainName" type="text" class="form-control" value="${schoolSettingsLms.domainName || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">User Space</label>
						<input name="userSpace" id="userSpace" type="text" class="form-control" value="${schoolSettingsLms.userSpace || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">LMS Login Url</label>
						<input name="lmsLoginUrl" id="lmsLoginUrl" type="text" class="form-control" value="${schoolSettingsLms.lmsLoginUrl || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Description Prefix Student</label>
						<input name="prefixStudent" id="prefixStudent" type="text" class="form-control" value="${schoolSettingsLms.prefixStudent || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Description Prefix Teacher</label>
						<input name="prefixTeacher" id="prefixTeacher" type="text" class="form-control" value="${schoolSettingsLms.prefixTeacher || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Description Prefix Admin</label>
						<input name="prefixAdmin" id="prefixAdmin" type="text" class="form-control" value="${schoolSettingsLms.prefixAdmin || ""}">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Status</label>
						<select id="schoolLmsStatus" name="schoolLmsStatus" class="multiselect-dropdown form-control">
							${getSchoolSettingValueOptions([{ value: "ACTIVE", label: "Active" }, { value: "INACTIVE", label: "Inactive" }], schoolSettingsLms.active == "Y" ? "ACTIVE" : "INACTIVE")}
						</select>
					</div>
				</div>
			</div>
		</div>
	`;
}

function getLmsRoleMappingInfoDiv(data) {
	return `
		<div id="lmsRoleMappingInfoDiv" style="display:none;">
			${getSchoolSettingSectionHeader("LMS Role Mapping", "Role sync rules")}
			<div class="table-responsive">
				<table class="table table-bordered table-striped" id="roleLms" style="min-width:1100px; width:100%;">
					<thead>
						<tr>
							<th style="text-align:center;font-weight:bold">S.No</th>
							<th style="font-weight:bold">LMS Provider</th>
							<th style="font-weight:bold">Role Name</th>
							<th style="font-weight:bold">Role LMS ID</th>
							<th style="font-weight:bold">Status</th>
							<th style="font-weight:bold">Action</th>
						</tr>
					</thead>
					<tbody>${getLmsRoleMappingRows(data.roleLms || [])}</tbody>
				</table>
			</div>
		</div>
	`;
}

function getLmsRoleMappingRows(roleLms) {
	var html = ``;
	$.each(roleLms || [], function(index, value) {
		var roleId = parseInt(value.id, 10) || 0;
		var schoolId = parseInt(value.schoolId, 10) || 0;
		var providerName = getSchoolSettingProviderName(value.lmsProviderId);
		var roleStatus = value.active == "Y" ? "ACTIVE" : "INACTIVE";
		html += `
			<tr>
				<td style="text-align:center;">${index + 1}</td>
				<td><input type="text" name="lmsProvider${roleId}" id="rolelmsProvider${roleId}" class="form-control" value="${providerName}" disabled/></td>
				<td><input type="text" name="lmsRoleName${roleId}" id="rolelmsRoleName${roleId}" class="form-control" value="${value.role || ""}"/></td>
				<td><input type="text" name="roleLmsId${roleId}" id="roleLmsId${roleId}" class="form-control" value="${value.roleLmsId || ""}"/></td>
				<td><input type="text" name="roleLmsStatus${roleId}" id="roleLmsStatus${roleId}" class="form-control" value="${roleStatus}" disabled/></td>
				<td style="text-align:center;">
					<a href="#" class="mt-2 btn btn-success school-setting-role-save" id="saveRoleLms${roleId}" data-id="${roleId}" data-school-id="${schoolId}" onclick="saveSchoolSettingData('schoolSettingForm','LMSRM','${roleId}','${schoolId}'); return false;">Save</a>
				</td>
			</tr>
		`;
	});
	return html;
}

function getCycleIntakeInfoDiv(data) {
	return `
		<div id="cycleIntakeInfoDiv" style="display:none;">
			<div class="form-row">
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Group Name<span style="color:red;">*</span></label>
						<input name="groupName" id="groupName" placeholder="Group Name" type="text" class="form-control" value="">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Semester 1 Start Date<span style="color:red;">*</span></label>
						<input name="semesterStartDate1" id="semesterStartDate1" type="text" class="form-control" value="" readonly onkeydown="return false">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Semester 1 End Date<span style="color:red;">*</span></label>
						<input name="semesterEndDate1" id="semesterEndDate1" type="text" class="form-control" value="" readonly onkeydown="return false">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Semester 2 Start Date<span style="color:red;">*</span></label>
						<input name="semesterStartDate2" id="semesterStartDate2" type="text" class="form-control" value="" readonly onkeydown="return false">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Semester 2 End Date<span style="color:red;">*</span></label>
						<input name="semesterEndDate2" id="semesterEndDate2" type="text" class="form-control" value="" readonly onkeydown="return false">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Late Application Fee Start Date<span style="color:red;">*</span></label>
						<input name="LateAppFeeDate" id="LateAppFeeDate" type="text" class="form-control" value="" readonly onkeydown="return false">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Late Application Fee End Date<span style="color:red;">*</span></label>
						<input name="LateAppFeeDateEnd" id="LateAppFeeDateEnd" type="text" class="form-control" value="" readonly onkeydown="return false">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Discount 1 %<span style="color:red;">*</span></label>
						<input name="discountSem1" id="discountSem1" type="text" class="form-control" value="">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Discount 2 %<span style="color:red;">*</span></label>
						<input name="discountSem2" id="discountSem2" type="text" class="form-control" value="">
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Allow Admission Status<span style="color:red;">*</span></label>
						<select id="admissionStatus" name="admissionStatus" class="form-control">
							<option value="Y">Active</option>
							<option value="N">Inactive</option>
						</select>
					</div>
				</div>
			</div>
			<input name="admissionCycleId" id="admissionCycleId" type="hidden">
			<div class="form-row">
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<button class="mt-2 btn btn-success" type="button" id="saveAdmissionCycle" name="saveAdmissionCycle">save</button>
					</div>
				</div>
			</div>
			<div class="form-row">
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Session<span style="color:red;">*</span></label>
						<select id="sessionList" name="sessionList" class="form-control"></select>
					</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0 full">&nbsp;</label>
						<button class="btn btn-primary btn-lg" type="button" id="getAddmissionCycles" name="getAddmissionCycles">Search</button>
					</div>
				</div>
			</div>
			<br/>
			<div class="form-row">
				<div class="table-responsive">
					<table class="table table-bordered table-striped" id="admissionCycleData" style="min-width:1100px; width:100%">
						<thead>
							<tr>
								<th style="text-align:center;font-weight:bold">S.No</th>
								<th style="font-weight:bold">Group Name</th>
								<th style="font-weight:bold">Semester 1 Duration</th>
								<th style="font-weight:bold">Semester 2 Duration</th>
								<th style="font-weight:bold">Late Application Fee Date</th>
								<th style="font-weight:bold">Discount 1 %</th>
								<th style="font-weight:bold">Discount 2 %</th>
								<th style="font-weight:bold">Status</th>
								<th style="font-weight:bold">Action</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	`;
}

function getStandardFeeInfoDiv() {
	return `
		<div id="standardFeeInfoDiv" style="display:none;">
			${getSchoolSettingSectionHeader("Grade Fee Details", "Tuition per grade")}
			<div class="full">
				<ul class="body-tabs body-tabs-layout tabs-animated body-tabs-animated nav">
					<li class="nav-item">
						<a role="tab" class="nav-link FeeGrade active" href="javascript:void(0)" data-toggle="tab" aria-selected="false"><span>Grade</span></a>
					</li>
					<li class="nav-item">
						<a role="button" class="nav-link FeeApplyGrade" href="javascript:void(0)" data-toggle="tab"><span>Apply Grade Fee</span></a>
					</li>
				</ul>
			</div>
			<div class="tab-content">
				<div class="tab-pane tabs-animation fade show" id="FeeGrade" role="tabpanel" style="display:none">
					<div class="form-row">
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Learning Program</label>
								<select id="standardGradeId" class="form-control">
									<option value="">Select Learning Program</option>
								</select>
							</div>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Standard Fee Plan</label>
								<select id="standardGradeIdOption" class="form-control"></select>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-4 col-sm-4 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Grade</label>
								<select id="allGradeId" class="form-control" multiple="multiple"></select>
							</div>
						</div>
						<div class="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0 full">&nbsp;</label>
								<button class="btn btn-success" type="button" id="gradeSearch">Search</button>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<button class="btn btn-primary" type="button" id="addFormHide">Add</button>
							</div>
						</div>
					</div>
					<div id="standardFeeAddDiv" class="d-none">
						<div class="form-row">
							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Learning Program<span style="color:red;">*</span></label><select id="learningPlan" class="form-control"><option value="">Select Learning Program</option></select></div></div>
							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Standard Fee Plan<span style="color:red;">*</span></label><input name="standardFeePlan" id="standardFeePlan" type="text" class="form-control" value=""></div></div>
							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Standard Id<span style="color:red;">*</span></label><select id="standardId" class="form-control"></select></div></div>
							<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6"><div class="position-relative form-group mb-2"><label class="m-0">Pay Mode</label><select id="paymode" class="form-control"><option value="A">Annually</option><option value="Q">Quarterly</option><option value="H">Half Yearly</option><option value="N">Nine Monthly</option><option value="M">Monthly</option></select></div></div>
							${getStandardFeeInputRow()}
							<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-right">
								<a href="javascript:void(0)" class="btn btn-success" id="saveStandardFeeData">Save</a>
								<button class="btn btn-danger" type="button" id="formHide">Cancel</button>
							</div>
						</div>
					</div>
					<div class="full standardFeeStructureTableWrapper d-none">
						<div class="full" style="overflow-x: auto;">
							<table class="table table-bordered responsive dt-responsive" id="standardFeeStructureTable" style="max-width:1100px;width:100%">
								<thead>
									<tr>
										<th style="text-align: center; font-weight: bold">S.No</th>
										<th>Grade</th>
										<th>Standard Fee Plan</th>
										<th>Pay Mode</th>
										<th>Registration Fee</th>
										<th>Book An Enrollment Fee</th>
										<th>Late Fee</th>
										<th>Annual Fee</th>
										<th>Annual Discount</th>
										<th>Monthly Fee</th>
										<th>Custom Plan First Insta</th>
										<th>REG Fee Full Credit</th>
										<th>REG Fee Half Credit</th>
										<th>CR Fee Full Credit</th>
										<th>CR Fee Half Credit</th>
										<th>ADV Fee Full Credit</th>
										<th>ADV Fee Half Credit</th>
										<th>HON Fee Full Credit</th>
										<th>HON Fee Half Credit</th>
										<th>AP Fee Full Credit</th>
										<th>AP Fee Half Credit</th>
										<th>Discovry Education Addon Fee</th>
										<th>STATUS</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
				</div>
				<div class="tab-pane tabs-animation fade show" id="FeeApplyGrade" role="tabpanel" style="display:none">
					<div class="form-row">
						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Grade Learning Program</label>
								<select id="gradePlan" class="form-control"><option value="">Select Grade Learning Program</option></select>
							</div>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Grade Plan Option</label>
								<select id="gradePlanOption" class="form-control"></select>
							</div>
						</div>
						<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0 full">&nbsp;</label>
								<button class="btn btn-success" type="button" id="saveApplyGradeFee">Apply</button>
							</div>
						</div>
					</div>
					<div class="table-responsive">
						<table class="table table-bordered responsive dt-responsive" id="activeFeePlanTable" style="max-width:1100px;width:100%">
							<thead>
								<tr>
									<th style="text-align: center; font-weight: bold">ID</th>
									<th style="font-weight: bold">Personalized Plan</th>
									<th style="font-weight: bold">Collaborative Plan</th>
									<th style="font-weight: bold">Accelerated Plan</th>
									<th style="font-weight: bold">Flexy Plan</th>
								</tr>
							</thead>
							<tbody></tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	`;
}

function getStandardFeeInputRow() {
	var inputs = [
		["registrationFee", "Registration Fee"], ["bookEnrollment", "Book An Enrollment Fee"], ["lateFee", "Late Fee"],
		["annualFee", "Annual Fee"], ["annualDiscount", "Annual Discount"], ["monthlyFee", "Monthly Fee"],
		["cusFir", "Custom Plan First Insta"], ["regFull", "REG Fee Full Credit"], ["regHalf", "REG Fee Half Credit"], ["crFull", "CR Fee Full Credit"],
		["crHalf", "CR Fee Half Credit"], ["advFull", "ADV Fee Full Credit"], ["advHalf", "ADV Fee Half Credit"], ["honFull", "HON Fee Full Credit"],
		["honHalf", "HON Fee Half Credit"], ["apFull", "AP Fee Full Credit"], ["apHalf", "AP Fee Half Credit"], ["addonFee", "Discovry Education Addon Fee"]
	];
	var html = ``;
	$.each(inputs, function(index, input) {
		html += `
			<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
				<div class="position-relative form-group mb-2">
					<label class="m-0">${input[1]}</label>
					<input id="${input[0]}" type="text" class="form-control" value="">
				</div>
			</div>
		`;
	});
	html += `
		<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
			<div class="position-relative form-group mb-2">
				<label class="m-0">Status</label>
				<select id="sfStatus" class="form-control">
					<option value="1">Active</option>
					<option value="0">InActive</option>
				</select>
			</div>
		</div>
	`;
	return html;
}

function getSettingAllDataDiv() {
	return `
		<div id="settingAllData" style="display:none;">
			<div class="d-flex flex-wrap justify-content-between align-items-start mb-3">
				<div>
					<h4 class="font-weight-bold mb-0">Setting</h4>
					<p class="text-muted mb-0">Meta keys &amp; values</p>
				</div>
				<div class="d-flex align-items-center mt-2 mt-md-0">
					<a role="tab" href="javascript:void(0)" id="settingAllDataTabBtn" class="btn btn-outline-primary rounded mr-2">All Data List</a>
					<a role="button" href="javascript:void(0)" id="settingAddDataTabBtn" class="btn btn-primary rounded">
						<i class="fa fa-plus mr-1"></i>Add data
					</a>
				</div>
			</div>
			<div class="full settingTableWrapper" style="display:none;">
				<div class="mb-3">
					<div class="ss-search-wrap">
						<i class="fa fa-search ss-search-icon"></i>
						<input type="text" id="settingTableSearch" class="ss-search-input" placeholder="Search meta type, key or value…" autocomplete="off">
						<button type="button" id="settingTableSearchClear" class="ss-search-clear" title="Clear">
							<i class="fa fa-times"></i>
						</button>
					</div>
				</div>
				<div class="full" style="overflow-x:auto;">
					<table class="table table-bordered responsive dt-responsive" id="settingTable" style="width:100%;min-width:900px;table-layout:fixed;">
							<colgroup>
								<col style="width:4%;">
								<col style="width:16%;">
								<col style="width:26%;">
								<col style="width:18%;">
								<col style="width:8%;">
								<col style="width:16%;">
								<col style="width:12%;">
							</colgroup>
							<thead>
								<tr>
									<th style="text-align:center;font-weight:bold;">S.No</th>
									<th style="font-weight:bold;">Meta Type /<br>Meta Key</th>
									<th style="font-weight:bold;">Meta Value</th>
									<th style="font-weight:bold;">Comments</th>
									<th style="font-weight:bold;white-space:nowrap;">Parent Id</th>
									<th style="font-weight:bold;">Created /<br>Updated Date</th>
									<th style="font-weight:bold;">Action</th>
								</tr>
							</thead>
						<tbody></tbody>
					</table>
					<div id="settingTableNoResult" class="text-center text-muted py-4" style="display:none;">
						<i class="fa fa-search fa-2x mb-2 d-block"></i>No records match your search.
					</div>
				</div>
			</div>
			<div id="settingDataSave" style="display:none;">
				<div class="form-row">
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<div class="position-relative form-group mb-2">
							<label class="m-0">Meta Type<span class="text-danger">*</span></label>
							<input name="metaType" id="metaType" type="text" maxlength="100" class="form-control" required>
						</div>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<div class="position-relative form-group mb-2">
							<label class="m-0">Meta Key<span class="text-danger">*</span></label>
							<input name="metaKey" id="metaKey" type="text" maxlength="100" class="form-control" required>
						</div>
					</div>
					<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
						<div class="position-relative form-group mb-2">
							<label class="m-0">Meta Value<span class="text-danger">*</span></label>
							<textarea name="metaValue" id="metaValue" maxlength="600" class="form-control" required></textarea>
						</div>
					</div>
					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
						<div class="position-relative form-group mb-2">
							<label class="m-0">Parent Id<span class="text-danger">*</span></label>
							<input name="parentId" id="parentId" type="number" class="form-control" required>
						</div>
					</div>
					<div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
						<div class="position-relative form-group mb-2">
							<label class="m-0">Activated<span class="text-danger">*</span></label>
							<select id="activated" name="activated" class="multiselect-dropdown form-control" required>
								<option value="Y">Active</option>
								<option value="N">InActive</option>
							</select>
						</div>
					</div>
					<input type="hidden" id="deleted" value="N">
					<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 text-right">
						<a href="javascript:void(0)" class="btn btn-success" id="settingDataSaveBtn">Save</a>
						<button class="btn btn-danger" type="button" id="cancelForm">Reset</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

function getApiCallDetailsDiv() {
	return `
		<div id="apiCallDetailsDiv" style="display:none;">
			<div class="form-row mb-2">
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">API Vendor</label>
						<select id="apiCallVendorFilter" class="form-control">
							<option value="">All</option>
						</select>
					</div>
				</div>
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Status</label>
						<select id="apiCallStatusFilter" class="form-control">
							<option value="">All</option>
						</select>
					</div>
				</div>
				<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">
					<div class="position-relative form-group mb-2">
						<label class="m-0">Page</label>
						<select id="apiCallPageFilter" class="form-control">
							<option value="250">1 to 250</option>
						</select>
					</div>
				</div>
				<div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 d-flex align-items-end justify-content-end">
					<button type="button" class="btn btn-success mr-2" id="apiCallDetailsSearch"><i class="fa fa-search"></i>&nbsp;Search</button>
					<button type="button" class="btn btn-danger" id="apiCallDetailsReset"><i class="fa fa-undo"></i>&nbsp;Reset</button>
				</div>
			</div>
			<div class="full apiCallDetailsTableWrapper">
				<div class="full" style="overflow-x:auto;">
					<table class="table table-bordered responsive dt-responsive" id="apiCallDetailsTable" style="width:100%;table-layout:fixed;">
						<colgroup>
							<col style="width:4%;">
							<col style="width:7%;">
							<col style="width:14%;">
							<col style="width:12%;">
							<col style="width:12%;">
							<col style="width:12%;">
							<col style="width:19%;">
							<col style="width:20%;">
						</colgroup>
						<thead>
							<tr>
								<th style="text-align:center;font-weight:bold">S.No</th>
								<th style="font-weight:bold">API Vendor</th>
								<th style="font-weight:bold">API URL</th>
								<th style="font-weight:bold">Status</th>
								<th style="font-weight:bold">Call Time</th>
								<th style="font-weight:bold">Response Time</th>
								<th style="font-weight:bold">Request</th>
								<th style="font-weight:bold">Response</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
			</div>
		</div>
	`;
}

function getCourseProviderNameDropdownOptions() {
	var providerIds = [1, 2, 31, 36, 37, 38, 39, 40, 41];
	var options = '<option value="">Select Course Provider Name</option>';
	$.each(providerIds, function(_, providerId) {
		var providerName = getCourseProviderNameByIds(providerId);
		if (providerName) {
			options += '<option value="' + providerName + '">' + providerName + "</option>";
		}
	});
	return options;
}

function getTechnicalSettingInfoDiv(data) {
	var technical = data && data.schoolSettingsTechnical ? data.schoolSettingsTechnical : {};
	return `
		<style>
			.upload-wrapper {
				display: flex;
				align-items: center;
				border: 1px dashed #cbd5e1;
				border-radius: 8px;
				padding: 10px 12px;
				gap: 10px;
				background: #f8fafc;
			}
			.upload-icon {
				color: #2563eb;
				font-size: 18px;
				line-height: 1;
			}
			.upload-link {
				color: #2563eb;
				cursor: pointer;
				font-weight: 500;
				width: 100%;
				margin-bottom: 0;
			}
			.file-input {
				display: none;
			}
			.file-display {
				display: flex;
				align-items: center;
				gap: 10px;
				border: 1px dotted #2563eb;
				padding: 10px 12px;
				border-radius: 8px;
				background: #fff;
			}
			.technical-file-name {
				color: #334155;
				font-weight: 500;
				word-break: break-word;
			}
		</style>
		<div class="main-card mb-3 card body-tabs-shadow">
			<div class="card-body">
				<form action="javascript:void(0);" id="technicalSettingForm" name="technicalSettingForm" autocomplete="off">
					<input type="hidden" id="technicalSettingId" value="${technical.schoolSettingsTechnicalId || ""}">
					<div class="form-row">
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Show	Subject Cost On Signup</label>
								<div class="full pt-2">
						            <input name="showSubjectCostOnSignup" id="showSubjectCostOnSignup" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Flex Enrollment</label>
								<div class="full pt-2">
						            <input name="flexEnrollment" id="flexEnrollment" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">School Enrollment</label>
								<div class="full pt-2">
						            <input name="schoolEnrollment" id="schoolEnrollment" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Letter HeadImg</label>
								<div class="full pt-2">
						            <input name="letterHeadImg" id="letterHeadImg" type="hidden" value="">
						            <input name="letterHeadImgUpload" id="letterHeadImgUpload" type="file" class="form-control" accept="image/*"
						            	onchange="uploadSchoolSettingTechnicalImage(this, 'letterHeadImg', 'letterHeadImgDisplay')">
						            <div id="letterHeadImgDisplay" class="mt-2">
						            	<span class="technical-file-name text-success"></span>
						            </div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Teach Agreement Sign</label>
								<div class="full pt-2">
						            <input name="teachAgreementSign" id="teachAgreementSign" type="hidden" value="">
						            <input name="teachAgreementSignUpload" id="teachAgreementSignUpload" type="file" class="form-control" accept="image/*"
						            	onchange="uploadSchoolSettingTechnicalImage(this, 'teachAgreementSign', 'teachAgreementSignDisplay')">
						            <div id="teachAgreementSignDisplay" class="mt-2 ">
						            	<span class="technical-file-name text-success"></span>
						            </div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Authorized Person Name</label>
								<div class="full pt-2">
						            <input name="authorizedPersonName" id="authorizedPersonName" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Course ProviderId</label>
								<div class="full pt-2">
						            <input name="courseProviderId" id="courseProviderId" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Course ProviderId Batch</label>
								<div class="full pt-2">
						            <input name="courseProviderIdBatch" id="courseProviderIdBatch" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Course Provider Name</label>
								<div class="full pt-2">
									<select name="courseProviderName" id="courseProviderName" class="form-control">
										${getCourseProviderNameDropdownOptions()}
									</select>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Show Course In Manage Course</label>
								<div class="full pt-2">
						            <input name="showCourseInManageCourse" id="showCourseInManageCourse" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Currency IsoCode</label>
								<div class="full pt-2">
						            <input name="currencyIsoCode" id="currencyIsoCode" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Css File</label>
								<div class="full pt-2">
						            <input name="cssFile" id="cssFile" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Login BgImage</label>
								<div class="full pt-2">
						            <input name="loginBgImage" id="loginBgImage" type="hidden" value="">
						            <input name="loginBgImageUpload" id="loginBgImageUpload" type="file" class="form-control" accept="image/*"
						            	onchange="uploadSchoolSettingTechnicalImage(this, 'loginBgImage', 'loginBgImageDisplay')">
						            <div id="loginBgImageDisplay" class="mt-2">
						            	<span class="technical-file-name text-success"></span>
						            </div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Signup Teacher Image</label>
								<div class="full pt-2">
						            <input name="signupTeacherImage" id="signupTeacherImage" type="hidden" value="">
						            <input name="signupTeacherImageUpload" id="signupTeacherImageUpload" type="file" class="form-control" accept="image/*"
						            	onchange="uploadSchoolSettingTechnicalImage(this, 'signupTeacherImage', 'signupTeacherImageDisplay')">
						            <div id="signupTeacherImageDisplay" class="mt-2">
						            	<span class="technical-file-name text-success"></span>
						            </div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">School TimeZone</label>
								<div class="full pt-2">
						            <input name="schoolTimeZone" id="schoolTimeZone" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Meeting Link Provider</label>
								<div class="full pt-2">
						            <input name="meetingLinkProvider" id="meetingLinkProvider" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Meeting Prov Service Req</label>
								<div class="full pt-2">
						            <input name="meetingProvServiceReq" id="meetingProvServiceReq" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Batch TimeZone UTC1</label>
								<div class="full pt-2">
						            <input name="batchTimeZoneUTC1" id="batchTimeZoneUTC1" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Batch TimeZone UTC2</label>
								<div class="full pt-2">
						            <input name="batchTimeZoneUTC2" id="batchTimeZoneUTC2" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Copyright Year</label>
								<div class="full pt-2">
						            <input name="copyrightYear" id="copyrightYear" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Copyright Url</label>
								<div class="full pt-2">
						            <input name="copyrightUrl" id="copyrightUrl" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Copyright Name</label>
								<div class="full pt-2">
						            <input name="copyrightName" id="copyrightName" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Session Duration Elementry</label>
								<div class="full pt-2">
						            <input name="sessionDurationElementry" id="sessionDurationElementry" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Session Duration Middle</label>
								<div class="full pt-2">
						            <input name="sessionDurationMiddle" id="sessionDurationMiddle" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Session Duration High</label>
								<div class="full pt-2">
						            <input name="sessionDurationHigh" id="sessionDurationHigh" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">OneToOne Signup Label</label>
								<div class="full pt-2">
						            <input name="oneToOneSignupLabel" id="oneToOneSignupLabel" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Batch Signup Label</label>
								<div class="full pt-2">
						            <input name="batchSignupLabel" id="batchSignupLabel" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Scholarship Signup Label</label>
								<div class="full pt-2">
						            <input name="scholarshipSignupLabel" id="scholarshipSignupLabel" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Book Enrollment Duration</label>
								<div class="full pt-2">
						            <input name="bookEnrollmentDuration" id="bookEnrollmentDuration" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Discovery Education Addon</label>
								<div class="full pt-2">
						            <input name="discoveryEducationAddon" id="discoveryEducationAddon" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Discovery Education OneToOne</label>
								<div class="full pt-2">
						            <input name="discoveryEducationOneToOne" id="discoveryEducationOneToOne" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Discovery Education Batch</label>
								<div class="full pt-2">
						            <input name="discoveryEducationBatch" id="discoveryEducationBatch" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Discovery Education Scholarship</label>
								<div class="full pt-2">
						            <input name="discoveryEducationScholarship" id="discoveryEducationScholarship" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Batch Closed From</label>
								<div class="full pt-2">
						            <input name="batchClosedFrom" id="batchClosedFrom" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Show Student Course Selection Status</label>
								<div class="full pt-2">
						            <input name="showStudentCourseSelectionStatus" id="showStudentCourseSelectionStatus" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Elligiblity Status To Send Mail</label>
								<div class="full pt-2">
						            <input name="elligiblityStatusToSendMail" id="elligiblityStatusToSendMail" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Evaluation Test Fee</label>
								<div class="full pt-2">
						            <input name="evaluationTestFee" id="evaluationTestFee" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Meeting Auto Days</label>
								<div class="full pt-2">
						            <input name="meetingAutoDays" id="meetingAutoDays" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Common Payment UserId</label>
								<div class="full pt-2">
						            <input name="commonPaymentUserId" id="commonPaymentUserId" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Evaluation Module Name</label>
								<div class="full pt-2">
						            <input name="evaluationModuleName" id="evaluationModuleName" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Evaluation Mod Terms Name</label>
								<div class="full pt-2">
						            <input name="evaluationModTermsName" id="evaluationModTermsName" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Evaluation Mod Slot Time</label>
								<div class="full pt-2">
						            <input name="evaluationModSlotTime" id="evaluationModSlotTime" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Evaluation Mod Slot BufTime</label>
								<div class="full pt-2">
						            <input name="evalModSlotBufTime" id="evalModSlotBufTime" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Eval Slot Cron Time</label>
								<div class="full pt-2">
						            <input name="evalSlotCronTime" id="evalSlotCronTime" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Eval Slot View TimeDiff</label>
								<div class="full pt-2">
						            <input name="evalSlotViewTimeDiff" id="evalSlotViewTimeDiff" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Evaluation Mod Enabled</label>
								<div class="full pt-2">
						            <input name="evaluationModEnabled" id="evaluationModEnabled" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Payment Reminder Service</label>
								<div class="full pt-2">
						            <input name="paymentReminderService" id="paymentReminderService" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Payment Reminder Before</label>
								<div class="full pt-2">
						            <input name="paymentReminderBefore" id="paymentReminderBefore" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Payment Reminder Maximum Days</label>
								<div class="full pt-2">
						            <input name="paymentReminderMaximumDays" id="paymentReminderMaximumDays" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Payment Reminder Frequency</label>
								<div class="full pt-2">
						            <input name="paymentReminderFrequency" id="paymentReminderFrequency" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Lms Account Loc Service</label>
								<div class="full pt-2">
						            <input name="lmsAccountLocService" id="lmsAccountLocService" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Account Lock In Days</label>
								<div class="full pt-2">
						            <input name="accountLockInDays" id="accountLockInDays" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Transcript Signature</label>
								<div class="full pt-2">
						            <input name="transcriptSignature" id="transcriptSignature" type="hidden" value="">
						            <input name="transcriptSignatureUpload" id="transcriptSignatureUpload" type="file" class="form-control" accept="image/*"
						            	onchange="uploadSchoolSettingTechnicalImage(this, 'transcriptSignature', 'transcriptSignatureDisplay')">
						            <div id="transcriptSignatureDisplay" class="mt-2">
						            	<span class="technical-file-name text-success"></span>
						            </div>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Book An Enrollment Service</label>
								<div class="full pt-2">
						            <input name="bookAnEnrollmentService" id="bookAnEnrollmentService" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Flex Signup Label</label>
								<div class="full pt-2">
						            <input name="flexSignupLabel" id="flexSignupLabel" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Curse ProviderId Scholarship</label>
								<div class="full pt-2">
						            <input name="curseProviderIdScholarship" id="curseProviderIdScholarship" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">One Roaster Upload Service</label>
								<div class="full pt-2">
						            <input name="oneRoasterUploadService" id="oneRoasterUploadService" type="text" class="form-control" value="">
								</div>
							</div>
						</div>
					</div>
					
				</form>
			</div>
		</div>
	`;
}

function getSchoolOfficeSettingInfoDiv(data) {
	var office = data && data.schoolSettingsOffice ? data.schoolSettingsOffice : {};
	return `
		<div class="main-card mb-3 card body-tabs-shadow">
			<div class="card-body">
				<form action="javascript:void(0);" id="officeSettingForm" name="officeSettingForm" autocomplete="off">
					<div class="form-row">
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">School Type</label>
								<div class="full pt-2">
									<select name="schoolType" id="schoolType" class="form-control">
										${getSchoolSettingSchoolTypeOptions(office.schoolType)}
									</select>
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Parent School ID</label>
								<div class="full pt-2">
									<input name="parentSchoolId" id="parentSchoolId" type="text" class="form-control" value="${office.parentSchoolId || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">UUID</label>
								<div class="full pt-2">
									<input name="uuid" id="uuid" type="text" class="form-control" value="${office.uuid || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">School Name</label>
								<div class="full pt-2">
									<input name="schoolName" id="schoolName" type="text" class="form-control" value="${office.schoolName || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Contact Email</label>
								<div class="full pt-2">
									<input name="contactEmail" id="contactEmail" type="email" class="form-control" value="${office.contactEmail || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">WhatsApp Code</label>
								<div class="full pt-2">
									<input name="whatsAppCode" id="whatsAppCode" type="text" class="form-control" value="${office.whatsAppCode || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">WhatsApp Contact</label>
								<div class="full pt-2">
									<input name="whatsAppContact" id="whatsAppContact" type="text" class="form-control" value="${office.whatsAppContact || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">School Contact Code</label>
								<div class="full pt-2">
									<input name="schoolContactCode" id="schoolContactCode" type="text" class="form-control" value="${office.schoolContactCode || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">School Contact</label>
								<div class="full pt-2">
									<input name="schoolContact" id="schoolContact" type="text" class="form-control" value="${office.schoolContact || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Landline Code</label>
								<div class="full pt-2">
									<input name="landlineCode" id="landlineCode" type="text" class="form-control" value="${office.landlineCode || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Landline Contact</label>
								<div class="full pt-2">
									<input name="landlineContact" id="landlineContact" type="text" class="form-control" value="${office.landlineContact || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Contact For Certificate</label>
								<div class="full pt-2">
									<input name="contactForCertificate" id="contactForCertificate" type="text" class="form-control" value="${office.contactForCertificate || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Demo Contact</label>
								<div class="full pt-2">
									<input name="demoContact" id="demoContact" type="text" class="form-control" value="${office.demoContact || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">WhatsApp Code Teacher</label>
								<div class="full pt-2">
									<input name="whatsAppCodeTeacher" id="whatsAppCodeTeacher" type="text" class="form-control" value="${office.whatsAppCodeTeacher || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">WhatsApp Contact Teacher</label>
								<div class="full pt-2">
									<input name="whatsAppContactTeacher" id="whatsAppContactTeacher" type="text" class="form-control" value="${office.whatsAppContactTeacher || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">WhatsApp Contact With Format</label>
								<div class="full pt-2">
									<input name="whatsappContactWithFormat" id="whatsappContactWithFormat" type="text" class="form-control" value="${office.whatsappContactWithFormat || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">WhatsApp Contact Teacher With Format</label>
								<div class="full pt-2">
									<input name="whatsappContactTeacherWithFormat" id="whatsappContactTeacherWithFormat" type="text" class="form-control" value="${office.whatsappContactTeacherWithFormat || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Office Contact Num Wts Check</label>
								<div class="full pt-2">
									<input name="officeContactNumWtsCheck" id="officeContactNumWtsCheck" type="text" class="form-control" value="${office.officeContactNumWtsCheck || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Support Num Wts Check</label>
								<div class="full pt-2">
									<input name="supportNumWtsCheck" id="supportNumWtsCheck" type="text" class="form-control" value="${office.supportNumWtsCheck || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Is School Setup Complete</label>
								<div class="full pt-2">
									<input name="isSchoolSetupComplete" id="isSchoolSetupComplete" type="text" class="form-control" value="${office.isSchoolSetupComplete || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Support Contact Code</label>
								<div class="full pt-2">
									<input name="supportContactCode" id="supportContactCode" type="text" class="form-control" value="${office.supportContactCode || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Support Contact</label>
								<div class="full pt-2">
									<input name="supportContact" id="supportContact" type="text" class="form-control" value="${office.supportContact || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Country Code</label>
								<div class="full pt-2">
									<input name="countryCode" id="countryCode" type="text" class="form-control" value="${office.countryCode || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Support Contact Country Code</label>
								<div class="full pt-2">
									<input name="supportContactCountryCode" id="supportContactCountryCode" type="text" class="form-control" value="${office.supportContactCountryCode || ""}">
								</div>
							</div>
						</div>
						<div class="col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">Module Permissions</label>
								<div class="full pt-2">
									<textarea name="modulePermissions" id="modulePermissions" class="form-control" rows="4">${office.modulePermissions || ""}</textarea>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
}

function getSchoolLinksSettingInfoDiv(data) {
	var schoolLinks = data && data.schoolSettingsLinks ? data.schoolSettingsLinks : {};
	var fields = [
		["schoolSettingsLinksId", "School Settings Links ID"],
		["schoolWebsite", "School Website"],
		["logoUrl", "Logo URL"],
		["receiptLogoUrl", "Receipt Logo URL"],
		["emailLogoUrl", "Email Logo URL"],
		["favIconUrl", "Fav Icon URL"],
		["signupUrl", "Signup URL"],
		["ticketRaisedUrl", "Ticket Raised URL"],
		["termasOfUserUrl", "Terms Of Use URL"],
		["contactUsUrl", "Contact Us URL"],
		["contactUsActive", "Contact Us Active"],
		["privacyPolicyUrl", "Privacy Policy URL"],
		["instagramUrl", "Instagram URL"],
		["fbUrl", "Facebook URL"],
		["pintrestUrl", "Pinterest URL"],
		["twitterUrl", "Twitter URL"],
		["linkdinUrl", "LinkedIn URL"],
		["codeConductUrl", "Code Of Conduct URL"],
		["chatBoatActive", "Chat Boat Active"],
		["chatBoatUrl", "Chat Boat URL"],
		["studHBookUrl", "Student Handbook URL"],
		["batchStudHBookUrl", "Batch Student Handbook URL"],
		["enrollmentPolicyUrl", "Enrollment Policy URL"],
		["studentPolicytUrl", "Student Policy URL"],
		["schoolPolicyUrl", "School Policy URL"],
		["ytUrl", "YouTube URL"],
		["whiteLogoUrl", "White Logo URL"],
		["dashboardVideoUrl", "Dashboard Video URL"],
		["schoolStamp", "School Stamp"]
	];
	var fieldsHtml = "";
	$.each(fields, function(index, field) {
		fieldsHtml += `
			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
				<div class="position-relative form-group mb-2">
					<label class="m-0">${field[1]}</label>
					<div class="full pt-2">
						<input name="${field[0]}" id="${field[0]}" type="text" class="form-control" value="${schoolLinks[field[0]] || ""}">
					</div>
				</div>
			</div>
		`;
	});
	return `
		<div class="main-card mb-3 card body-tabs-shadow">
			<div class="card-body">
				<form action="javascript:void(0);" id="schoolLinksSettingForm" name="schoolLinksSettingForm" autocomplete="off">
					<div class="form-row">
						${fieldsHtml}
					</div>
				</form>
			</div>
		</div>
	`;
}

function getSchoolMailsSettingInfoDiv(data) {
	var schoolMails = data && data.schoolSettingsMails ? data.schoolSettingsMails : {};
	var fields = [
		["senderEmail", "Sender Email"],
		["emailForClassRoomSession", "Email For Class Room Session"],
		["emailForDemoCouncelling", "Email For Demo Councelling"],
		["emailForStudentInstallmentFee", "Email For Student Installment Fee"],
		["emailForPpcRequest", "Email For Ppc Request"],
		["emailForClientSignup", "Email For Client Signup"],
		["emailForHiring", "Email For Hiring"],
		["emailAccountName", "Email Account Name"],
		["emailAccountAdminName", "Email Account Admin Name"],
		["emailAccountSupport", "Email Account Support"],
		["emailOtherAdmain", "Email Other Admain"],
		["technicalEmail", "Technical Email"],
		["emailAccountForAuditor", "Email Account For Auditor"],
		["withdrawalRequestAdmin", "Withdrawal Request Admin"],
		["emailOfB2bSchool", "Email Of B2b School"],
		["emailForOtherSchool", "Email For Other School"],
		["notificationEmail", "Notification Email"],
		["careersEmail", "Careers Email"]
	];
	var fieldsHtml = "";
	$.each(fields, function(index, field) {
		fieldsHtml += `
			<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
				<div class="position-relative form-group mb-2">
					<label class="m-0">${field[1]}</label>
					<div class="full pt-2">
						<input name="${field[0]}" id="${field[0]}" type="text" class="form-control" value="${schoolMails[field[0]] || ""}">
					</div>
				</div>
			</div>
		`;
	});
	return `
		<div class="main-card mb-3 card body-tabs-shadow">
			<div class="card-body">
				<div class="d-flex align-items-center justify-content-between mb-3">
					<h5 class="m-0 font-weight-bold">School Mails</h5>
				</div>
				<form action="javascript:void(0);" id="schoolMailsSettingForm" name="schoolMailsSettingForm" autocomplete="off">
					<div class="form-row">
						${fieldsHtml}
					</div>
				</form>
			</div>
		</div>
	`;
}

function getSchoolFeedbackSettingInfoDiv(data) {
	var feedbackSettings = data && data.schoolSettingFeedback ? data.schoolSettingFeedback : {};
	return `
		<div class="main-card mb-3 card body-tabs-shadow">
			<div class="card-body">
				<form action="javascript:void(0);" id="schoolFeedbackSettingForm" name="schoolFeedbackSettingForm" autocomplete="off">
					<input type="hidden" id="feedbackSettingId" value="${feedbackSettings.id || ""}">
					<div class="form-row">
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">VENDOR_ID</label>
								<div class="full pt-2">
									<input name="feedbackVendorId" id="feedbackVendorId" type="text" class="form-control" value="${feedbackSettings.vendorId || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">API_KEY</label>
								<div class="full pt-2">
									<input name="feedbackApiKey" id="feedbackApiKey" type="text" class="form-control" value="${feedbackSettings.apiKey || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">FEEDBACK_API_URL</label>
								<div class="full pt-2">
									<input name="feedbackApiUrl" id="feedbackApiUrl" type="text" class="form-control" value="${feedbackSettings.feedbackApiUrl || ""}">
								</div>
							</div>
						</div>
						<div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12">
							<div class="position-relative form-group mb-2">
								<label class="m-0">FEEDBACK_DASHBOARD_URL</label>
								<div class="full pt-2">
									<input name="feedbackDashboardUrl" id="feedbackDashboardUrl" type="text" class="form-control" value="${feedbackSettings.feedbackDashboardUrl || ""}">
								</div>
							</div>
						</div>
						<div class="col-12">
							<button type="button" class="mt-2 btn btn-success" onclick="saveSchoolSettingData('schoolSettingForm','FB', ($('#feedbackSettingId').val() || '0'), ($('#schoolSettigsSelection').val() || '0'));">Save</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
}

function getSchoolSettingSchoolTypeOptions(selectedValue) {
	var schoolTypes = [
		{ value: "", label: "Select Partner Type" },
		{ value: "GP", label: "Enrollment Partner" },
		{ value: "WLP", label: "White Label Partner" },
		{ value: "EPER", label: "Enrollment Partner with Enrollment Rights" }
	];
	var html = ``;
	$.each(schoolTypes, function(index, option) {
		html += `<option value="${option.value}" ${String(option.value) == String(selectedValue || "") ? "selected" : ""}>${option.label}</option>`;
	});
	return html;
}

function getSchoolSettingBooleanChecked(value) {
	if (value === true || value === "true" || value === "Y" || value === "1" || value === 1) {
		return "checked";
	}
	return "";
}

function getSchoolSettingAllDataTableRows(details) {
	var html = ``;
	$.each(details || [], function(index, value) {
		html += `
			<tr id="schoolSettingRow${index}">
				<td style="white-space:nowrap;text-align:center;">${index + 1}</td>
				<input type="hidden" id="primaryID" value="${value.id || ""}"/>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">
					<div class="mb-1">
						<span data-field="metaType">
							<span class="badge badge-pill badge-success">${value.metaType || ""}</span>
						</span>
						<input type="hidden" id="metaType${value.id || index}" value="${value.metaType || ""}">
					</div>
					<div>
						<span class="text-muted" data-field="metaKey" style="font-size:12px;">${value.metaKey || ""}</span>
						<input type="hidden" id="metaKey${value.id || index}" value="${value.metaKey || ""}">
					</div>
				</td>
				<td style="word-break:break-word;overflow-wrap:anywhere;">
					<span class="textValue textField" data-field="metaValue" style="white-space:normal;">${value.metaValue || ""}</span>
					<textarea type="text" class="d-none inputValue inputField metaValue" data-field="metaValue" id="metaValue${value.id || index}" style="width:100%;min-height:70px;white-space:pre-wrap;" maxlength="2000">${value.metaValue || ""}</textarea>
				</td>
				<td style="word-break:break-word;overflow-wrap:anywhere;">
					<span class="textValue textField text-muted" data-field="comments" style="font-size:12px;white-space:normal;">${value.comments || ""}</span>
					<textarea class="d-none inputValue inputField" data-field="comments" id="comments${value.id || index}" style="width:100%;min-height:50px;white-space:pre-wrap;" maxlength="500">${value.comments || ""}</textarea>
				</td>
				<td style="white-space:nowrap;text-align:center;">
					<span data-field="parentId">${value.parentId || 0}</span>
					<input type="hidden" id="parentId${value.id || index}" value="${value.parentId || 0}">
				</td>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">
					<div style="font-size:12px;">
						<span class="text-muted" style="font-size:11px;">Created:</span><br>
						${value.createdDate || "—"}
					</div>
					<div style="font-size:12px;margin-top:6px;">
						<span class="text-muted" style="font-size:11px;">Updated:</span><br>
						${value.updatedDate || "—"}
					</div>
				</td>
				<td style="white-space:nowrap;text-align:center;vertical-align:middle;">
					<a href="javascript:void(0)" type="button" class="btn bnt-sm btn-primary edit-button" id="editButton"><i class="fas fa-edit"></i></a>
					<a href="javascript:void(0)" class="btn btn-sm btn-success save-button d-none" onclick="editSettingData('schoolSettingForm',${value.id || index},'settingTable')"><i class="fas fa-check"></i></a>
					<a href="javascript:void(0)" class="cancel-button btn btn-danger d-none"><i class="fas fa-times"></i></a>
				</td>
			</tr>
		`;
	});
	return html;
}

function getSchoolSettingApiCallDetailsTableRows(details) {
	var html = ``;
	$.each(details || [], function(index, value) {
		html += `
			<tr id="apiCallRow${index}">
				<td style="white-space:nowrap;text-align:center;">${index + 1}</td>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.apiVendor || "N/A"}</td>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.apiUrl || "N/A"}</td>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.status || "N/A"}</td>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.callDateTime || "N/A"}</td>
				<td style="white-space:normal;word-break:break-word;overflow-wrap:anywhere;">${value.responseDateTime || "N/A"}</td>
				<td style="white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${value.request || "N/A"}</td>
				<td style="white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;">${value.response || "N/A"}</td>
			</tr>
		`;
	});
	return html;
}

function getSchoolSettingSimpleOptions(optionList, selectedValue) {
	var html = ``;
	$.each(optionList || [], function(index, option) {
		var optionValue = getSchoolSettingOptionValue(option);
		var optionLabel = getSchoolSettingOptionLabel(option);
		html += `<option value="${optionValue}" ${String(optionValue) == String(selectedValue) ? "selected" : ""}>${optionLabel}</option>`;
	});
	return html;
}

function getSchoolSettingGatewayOptions(optionList, selectedValue) {
	var html = ``;
	$.each(optionList || [], function(index, option) {
		var optionValue = option && typeof option === "object" ? (option.value || option.label || option.key || "") : option;
		var optionLabel = option && typeof option === "object" ? (option.value || option.label || option.key || "") : option;
		html += `<option value="${optionValue}" ${String(optionValue) == String(selectedValue) ? "selected" : ""}>${optionLabel}</option>`;
	});
	return html;
}

function getSchoolSettingLmsProviderOptions(optionList, selectedValue) {
	var html = ``;
	$.each(optionList || [], function(index, option) {
		var optionValue = option && typeof option === "object" ? (option.key || option.value || "") : option;
		var optionLabel = option && typeof option === "object" ? (option.value || option.label || option.key || "") : option;
		html += `<option value="${optionValue}" ${String(optionValue) == String(selectedValue) ? "selected" : ""}>${optionLabel}</option>`;
	});
	return html;
}

function getSchoolSettingOptionValue(option) {
	if (option && typeof option === "object") {
		return option.value || option.key || option.schoolId || option.sessionId || option.id || option.name || option.label || "";
	}
	return option;
}

function getSchoolSettingOptionLabel(option) {
	if (option && typeof option === "object") {
		return option.label || option.value || option.key || option.schoolName || option.sessionName || option.name || option.id || "";
	}
	return option;
}

function getSchoolSettingValueOptions(optionList, selectedValue) {
	var html = ``;
	$.each(optionList || [], function(index, option) {
		html += `<option value="${option.value}" ${option.value == selectedValue ? "selected" : ""}>${option.label}</option>`;
	});
	return html;
}

function getSchoolSettingProviderName(lmsProviderId) {
	var providers = {
		1: "Agilix Buzz",
		2: "Odysseyware",
		31: "Buzz",
		36: "BUZZ",
		37: "BUZZ-GC",
		38: "BUZZ-GR",
		39: "Exact-Path",
		40: "Edmentum-Canvas",
		41: "Courseware"
	};
	return providers[lmsProviderId] || lmsProviderId || "";
}

