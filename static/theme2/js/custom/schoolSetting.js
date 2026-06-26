// function getSchoolSettingCurrentSchoolId() {
// 	var selectedSchoolId = "";
// 	if (window.schoolSettingPageState && window.schoolSettingPageState.data && window.schoolSettingPageState.data.selectedSchoolId) {
// 		selectedSchoolId = window.schoolSettingPageState.data.selectedSchoolId;
// 	} else if ($("#schoolSettigsSelection").length && $("#schoolSettigsSelection").val()) {
// 		selectedSchoolId = $("#schoolSettigsSelection").val();
// 	}
// 	return parseInt(selectedSchoolId, 10) || parseInt(SCHOOL_ID, 10) || 0;
// }

// function resolveSchoolSettingLmsProviderId(lmsProviderValue) {
// 	if (lmsProviderValue === "BUZZ") {
// 		return 36;
// 	}
// 	var parsedProviderId = parseInt(lmsProviderValue, 10);
// 	if (!isNaN(parsedProviderId) && parsedProviderId > 0) {
// 		return parsedProviderId;
// 	}
// 	var providerKey = String(lmsProviderValue || "").trim().toLowerCase();
// 	var providerMap = {
// 		"agilix buzz": 1,
// 		"odysseyware": 2,
// 		"buzz": 31,
// 		"buzz-gc": 37,
// 		"buzz-gr": 38,
// 		"exact-path": 39,
// 		"edmentum-canvas": 40,
// 		"courseware": 41
// 	};
// 	return providerMap[providerKey] || 41;
// }

// function saveSchoolSettingData(formId, moduleName, settingId,schoolId){

// 	$("#errMsg").text('');
// 	var normalizedSettingId = parseInt(settingId, 10);
// 	if (isNaN(normalizedSettingId) || normalizedSettingId < 0) {
// 		normalizedSettingId = 0;
// 	}
// 	if (moduleName === "PG" && (!normalizedSettingId || normalizedSettingId <= 0)) {
// 		var pgStateId = window.schoolSettingPageState
// 			&& window.schoolSettingPageState.data
// 			&& window.schoolSettingPageState.data.pgsettings
// 			? parseInt(window.schoolSettingPageState.data.pgsettings.id, 10)
// 			: 0;
// 		if (!isNaN(pgStateId) && pgStateId > 0) {
// 			normalizedSettingId = pgStateId;
// 		}
// 	}
// 	var normalizedSchoolId = parseInt(schoolId, 10);
// 	if (isNaN(normalizedSchoolId) || normalizedSchoolId <= 0) {
// 		normalizedSchoolId = getSchoolSettingCurrentSchoolId();
// 	}
// 	var saveSchoolSettingURL = getURLForHTML('dashboard','save-school-setting-lms-role-pg-data');
// 	if(moduleName == 'FB'){
// 		saveSchoolSettingURL = getURLForHTML('dashboard','save-school-setting-feedback-data');
// 	}
// 	$.ajax({
// 		type : "POST",
// 		contentType : APPLICATION_JSON_VALUE,
// 		url : saveSchoolSettingURL,
// 			data : JSON.stringify(getRequestForSaveSchoolSettingData(formId,moduleName, normalizedSettingId, normalizedSchoolId)),
// 		dataType : 'json',
// 		success : function(data) {
// 			if(moduleName == 'FB'){
// 				if (data['status'] == '0' || data['status'] == '2') {
// 					showMessageTheme2(0, data['message'], '', true);
// 				} else {
// 					showMessageTheme2(1, data['message'], '', true);
// 				}
// 				return false;
// 			}
// 			if (data['status'] == '0' || data['status'] == '2') {
// 				$("#errMsg").text(data['message'])
// 				$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
// 			} else {
// 				$("#errMsg").text(data['message'])
// 				$("body,html").animate({scrollTop: $("#errMsg").offset().top -70}, 800);
// 			}
// 			return false;
// 		}
// 	});
// }

// function getRequestForSaveSchoolSettingData(formId,moduleName,settingId,schoolId){
// 	request = {};
// 	var authentication = {};
// 	//var requestData = {};
// 	var schoolSettingLmsDTO = {};
// 	if(moduleName=='PG'){
// 		schoolSettingLmsDTO['gatewayName'] = $("#"+formId+" #paymentGateway").val();
// 		schoolSettingLmsDTO['gatewayMode'] = $("#"+formId+" #gatewayMode").val();
// 		schoolSettingLmsDTO['endpointUrl'] = $("#"+formId+" #endPointUrl").val();
// 		schoolSettingLmsDTO['merchantEmail'] = $("#"+formId+" #merchantEmail").val();
// 		schoolSettingLmsDTO['secretKey'] = $("#"+formId+" #secretKey").val();
// 		schoolSettingLmsDTO['clientId'] = $("#"+formId+" #clientId").val();
// 		schoolSettingLmsDTO['paymentModeIp'] =$("#"+formId+" #paymentModeIp").val();
// 		if($("#"+formId+" #pgStatus").val() =='ACTIVE'){
// 			schoolSettingLmsDTO['status'] = 'Y';
// 		}else{
// 			schoolSettingLmsDTO['status'] = 'N';
// 		}
// 	}else if(moduleName=='FB'){
// 		var schoolSettingFeedbackDTO = {};
// 		var feedbackSettingId = parseInt($("#"+formId+" #feedbackSettingId").val(), 10);
// 		if (isNaN(feedbackSettingId) || feedbackSettingId <= 0) {
// 			feedbackSettingId = parseInt(settingId, 10);
// 		}
// 		if (isNaN(feedbackSettingId) || feedbackSettingId < 0) {
// 			feedbackSettingId = 0;
// 		}
// 		var feedbackVendorId = parseInt($("#"+formId+" #feedbackVendorId").val(), 10);
// 		schoolSettingFeedbackDTO['id'] = feedbackSettingId;
// 		schoolSettingFeedbackDTO['schoolId'] = schoolId;
// 		schoolSettingFeedbackDTO['vendorId'] = isNaN(feedbackVendorId) ? null : feedbackVendorId;
// 		schoolSettingFeedbackDTO['apiKey'] = $("#"+formId+" #feedbackApiKey").val();
// 		schoolSettingFeedbackDTO['feedbackApiUrl'] = $("#"+formId+" #feedbackApiUrl").val();
// 		schoolSettingFeedbackDTO['feedbackDashboardUrl'] = $("#"+formId+" #feedbackDashboardUrl").val();
// 		schoolSettingFeedbackDTO['activated'] = 'Y';
// 		request['schoolSettingFeedbackDTO'] = schoolSettingFeedbackDTO;
// 		return request;
// 	}else if(moduleName=='LMSSM'){
// 		schoolSettingLmsDTO['domainId'] = $("#"+formId+" #domainId").val();
// 		schoolSettingLmsDTO['domainName'] = $("#"+formId+" #domainName").val();
// 		schoolSettingLmsDTO['lmsLoginUrl'] = $("#"+formId+" #lmsLoginUrl").val();
// 		schoolSettingLmsDTO['userSpace'] = $("#"+formId+" #userSpace").val();
// 		schoolSettingLmsDTO['prefixStudent'] = $("#"+formId+" #prefixStudent").val();
// 		schoolSettingLmsDTO['prefixTeacher'] = $("#"+formId+" #prefixTeacher").val();
// 		schoolSettingLmsDTO['prefixAdmin'] = $("#"+formId+" #prefixAdmin").val();
// 		if($("#"+formId+" #schoolLmsStatus").val() =='ACTIVE'){
// 			schoolSettingLmsDTO['status'] = 'Y';
// 		}else{
// 			schoolSettingLmsDTO['status'] = 'N';
// 		}
// 		schoolSettingLmsDTO['lmsProviderId'] = resolveSchoolSettingLmsProviderId($("#"+formId+" #lmsProviderId").val());
// 	}else if(moduleName=='LMSRM'){
// 		schoolSettingLmsDTO['roleName'] = $("#"+formId+" #rolelmsRoleName"+settingId).val();
// 		schoolSettingLmsDTO['roleLmsId'] = $("#"+formId+" #roleLmsId"+settingId).val();
// 		if($("#"+formId+" #roleLmsStatus"+settingId).val() =='ACTIVE'){
// 			schoolSettingLmsDTO['status'] = 'Y';
// 		}else{
// 			schoolSettingLmsDTO['status'] = 'N';
// 		}
// 		schoolSettingLmsDTO['lmsProviderId'] = resolveSchoolSettingLmsProviderId($("#"+formId+" #rolelmsProvider"+settingId).val());
// 	}else if(moduleName=='SSO'){
// 		schoolSettingLmsDTO['schoolUuid'] = $("#"+formId+" #schoolUuid").val();
// 		schoolSettingLmsDTO['schoolName'] = $("#"+formId+" #schoolDisplayName").val();
// 		schoolSettingLmsDTO['address'] = $("#"+formId+" #schoolAddress").val();
// 		schoolSettingLmsDTO['contactEmail'] = $("#"+formId+" #contactEmail").val();
// 		schoolSettingLmsDTO['whatsAppCode'] = $("#"+formId+" #whatsAppCode").val();
// 		schoolSettingLmsDTO['whatsAppContact'] = $("#"+formId+" #whatsAppContact").val();
// 		schoolSettingLmsDTO['schoolContactCode'] = $("#"+formId+" #schoolContactCode").val();
// 		schoolSettingLmsDTO['schoolContact'] = $("#"+formId+" #contactNumber").val();
// 		schoolSettingLmsDTO['landlineCode'] = $("#"+formId+" #lanlineCode").val();
// 		schoolSettingLmsDTO['landlineContact'] = $("#"+formId+" #landlineContact").val();
// 		schoolSettingLmsDTO['schoolTimeZone'] = $("#"+formId+" #schoolTimezone").val();

// 	}else if(moduleName=='SSL'){
// 		schoolSettingLmsDTO['schoolWebsite'] = $("#"+formId+" #website").val();
// 		schoolSettingLmsDTO['logoUrl'] = $("#"+formId+" #logoUrl").val();
// 		schoolSettingLmsDTO['emailLogoUrl'] = $("#"+formId+" #emailLogoUrl").val();
// 		schoolSettingLmsDTO['favIconUrl'] = $("#"+formId+" #favUrl").val();
// 		schoolSettingLmsDTO['signupUrl'] = $("#"+formId+" #signupUrl").val();
// 		schoolSettingLmsDTO['ticketRaisedUrl'] = $("#"+formId+" #ticketRaisedUrl").val();
// 		schoolSettingLmsDTO['termsOfUserUrl'] = $("#"+formId+" #termsUrl").val();
// 		schoolSettingLmsDTO['privacyPolicyUrl'] = $("#"+formId+" #privacyPolicyUrl").val();
// 		schoolSettingLmsDTO['contactUsActive'] = $("#"+formId+" #contactUsStatus").val();
// 		schoolSettingLmsDTO['contactUsUrl'] = $("#"+formId+" #contactUsUrl").val();
// 		schoolSettingLmsDTO['instagramUrl'] = $("#"+formId+" #instagramUrl").val();
// 		schoolSettingLmsDTO['fbUrl'] = $("#"+formId+" #facebookUrl").val();
// 		schoolSettingLmsDTO['pintrestUrl'] = $("#"+formId+" #pintrestUrl").val();
// 		schoolSettingLmsDTO['twitterUrl'] = $("#"+formId+" #twitterUrl").val();
// 		schoolSettingLmsDTO['linkdinUrl'] = $("#"+formId+" #linkedinUrl").val();
// 		schoolSettingLmsDTO['codeConductUrl'] = $("#"+formId+" #codeConductUrl").val();
// 		schoolSettingLmsDTO['studHBookUrl'] = $("#"+formId+" #stdtHandbokUrl").val();
// 		schoolSettingLmsDTO['chatBoatActive'] = $("#"+formId+" #chatbotStatus").val();
// 		schoolSettingLmsDTO['chatBoatUrl'] = $("#"+formId+" #chatbotUrl").val();

// 	}else if(moduleName=='SSM'){
// 		schoolSettingLmsDTO['senderEmail'] = $("#"+formId+" #senderEmail").val();
// 		schoolSettingLmsDTO['emailForClassRoomSession'] = $("#"+formId+" #classroomEmail").val();
// 		schoolSettingLmsDTO['emailForDemoCouncelling'] = $("#"+formId+" #demoEmail").val();
// 		schoolSettingLmsDTO['emailForStudentInstallmentFee'] = $("#"+formId+" #feeEmail").val();
// 		schoolSettingLmsDTO['emailForPpcRequest'] = $("#"+formId+" #ppcEmail").val();
// 		schoolSettingLmsDTO['emailForClientSignup'] = $("#"+formId+" #signupEmail").val();
// 		schoolSettingLmsDTO['emailForHiring'] = $("#"+formId+" #hiringEmail").val();
// 		schoolSettingLmsDTO['emailAccountName'] = $("#"+formId+" #accountNameEmail").val();
// 		schoolSettingLmsDTO['emailAccountAdminName'] = $("#"+formId+" #accountAdminEmail").val();
// 		schoolSettingLmsDTO['emailAccountSupport'] = $("#"+formId+" #supportEmail").val();
// 		schoolSettingLmsDTO['emailOtherAdmin'] = $("#"+formId+" #otherAdminEmail").val();
// 		schoolSettingLmsDTO['technicalEmail'] = $("#"+formId+" #technicalEmail").val();
// 		schoolSettingLmsDTO['emailAccountForAuditor'] = $("#"+formId+" #auditorEmail").val();
// 		schoolSettingLmsDTO['withdrawalRequestAdmin'] = $("#"+formId+" #withdrawalRequestAdmin").val();

// 	}else if(moduleName=='SST'){
// 		schoolSettingLmsDTO['vendorId'] = $("#"+formId+" #vendorId").val();
// 		schoolSettingLmsDTO['showSubjectCostOnSignup'] = $("#"+formId+" #showSubjectCost").val();
// 		schoolSettingLmsDTO['flexEnrollment'] = $("#"+formId+" #flexEnrollment").val();
// 		schoolSettingLmsDTO['schoolEnrollment'] = $("#"+formId+" #schoolEnrollment").val();
// 		schoolSettingLmsDTO['letterHeadImg'] = $("#"+formId+" #letterHead").val();
// 		schoolSettingLmsDTO['teachAgreementSign'] = $("#"+formId+" #teacherAgreementSign").val();
// 		schoolSettingLmsDTO['courseProviderName'] = $("#"+formId+" #coureProviderName").val();

// 	}
// 	schoolSettingLmsDTO['schoolId'] = schoolId;
// 	schoolSettingLmsDTO['moduleName'] = moduleName;
// 	schoolSettingLmsDTO['id'] = settingId;
// 	request['schoolSettingLmsDTO'] = schoolSettingLmsDTO;
// 	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
// 	request['authentication'] = authentication;
// 	//request['requestData'] = requestData;

// 	return request;
// }
// function getSchoolSettingDetails() {
// 	var schoolId = $("#schoolSettigsSelection").val();
// 	if (!schoolId) {
// 		return false;
// 	}
// 	var mount = document.getElementById("schoolSettingsContentMount");
// 	if (!mount || typeof window.renderSchoolSettingSection !== "function") {
// 		return false;
// 	}
// 	var pageData = getSchoolSettingDefaultData(schoolId);
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	window.schoolSettingPageState.data = pageData;
// 	window.renderSchoolSettingSection(mount, pageData);
// 	return false;
// }

// function schoolSettingPageLoadEvent(data) {
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	window.schoolSettingPageState.data = data;
// 	bindSchoolSettingEvents();
// 	initializeSchoolSettingUIPlugins();
// 	if (data && data.schoolSettingsTechnical) {
// 		renderSchoolSettingTechnicalData(data.schoolSettingsTechnical);
// 	}
// 	if (data && data.schoolSettingsOffice) {
// 		renderSchoolSettingOfficeData(data.schoolSettingsOffice);
// 	}
// 	if (data && data.schoolSettingsLinks) {
// 		renderSchoolSettingLinksData(data.schoolSettingsLinks);
// 	}
// 	if (data && data.schoolSettingsMails) {
// 		renderSchoolSettingMailsData(data.schoolSettingsMails);
// 	}
// 	if (data && data.schoolSettingFeedback) {
// 		renderSchoolSettingFeedbackData(data.schoolSettingFeedback);
// 	}
// 	loadSchoolSettingPageData();
// 	getSchoolSettingData("PG");
// }

// function bindSchoolSettingEvents() {
// 	$("#schoolSettingForm > ul.body-tabs .nav-link[data-tab]").off("click").on("click", function() {
// 		getSchoolSettingData($(this).attr("data-tab"));
// 	});
// 	$("#schoolSettingForm").off("click.schoolSettingOfficeSubTab", "#schoolOfficeTabBtn").on("click.schoolSettingOfficeSubTab", "#schoolOfficeTabBtn", function() {
// 		openSchoolSettingsSubTab("OFFICE");
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.schoolSettingLinksSubTab", "#schoolLinksTabBtn").on("click.schoolSettingLinksSubTab", "#schoolLinksTabBtn", function() {
// 		openSchoolSettingsSubTab("SL");
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.schoolSettingMailsSubTab", "#schoolMailsTabBtn").on("click.schoolSettingMailsSubTab", "#schoolMailsTabBtn", function() {
// 		openSchoolSettingsSubTab("SM");
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.schoolSettingFeedbackIntegrationSubTab", "#schoolFeedbackTabBtn").on("click.schoolSettingFeedbackIntegrationSubTab", "#schoolFeedbackTabBtn", function() {
// 		openSchoolSettingsIntegrationSubTab("FB");
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.schoolSettingPgIntegrationSubTab", "#schoolIntegrationPgTabBtn").on("click.schoolSettingPgIntegrationSubTab", "#schoolIntegrationPgTabBtn", function() {
// 		openSchoolSettingsIntegrationSubTab("IPG");
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.settingAllDataList", "#settingAllDataTabBtn").on("click.settingAllDataList", "#settingAllDataTabBtn", function() {
// 		openSchoolSettingDataSubTab("LIST", true);
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.settingAllDataAdd", "#settingAddDataTabBtn").on("click.settingAllDataAdd", "#settingAddDataTabBtn", function() {
// 		openSchoolSettingDataSubTab("ADD");
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.settingAllDataCancel", "#cancelForm").on("click.settingAllDataCancel", "#cancelForm", function() {
// 		openSchoolSettingDataSubTab("LIST", false);
// 		return false;
// 	});
// 	$("#schoolSettingForm").off("click.settingAllDataSave", "#settingDataSaveBtn").on("click.settingAllDataSave", "#settingDataSaveBtn", function() {
// 		if (typeof saveSetting === "function") {
// 			saveSetting("schoolSettingForm");
// 		} else {
// 			showMessageTheme2(0, "Save action is currently unavailable. Please refresh and try again.", "", true);
// 		}
// 		return false;
// 	});

// 	$("#schoolSettigsSelection").off("change").on("change", function() {
// 		if (!window.schoolSettingPageState) {
// 			window.schoolSettingPageState = {};
// 		}
// 		if (!window.schoolSettingPageState.data) {
// 			window.schoolSettingPageState.data = {};
// 		}
// 		window.schoolSettingPageState.data.selectedSchoolId = $(this).val();
// 		$("#errMsg").text("");
// 		getSchoolSettingDetails();
// 	});

// 	$("#lmsProviderId").off("change").on("change", function() {
// 		getSchoolSettingLmsDetails($(this).val());
// 	});

// 	$("#refreshTechnicalSettings").off("click").on("click", function() {
// 		getSchoolSettingTechnicalDetails();
// 	});

// 	$("#refreshOfficeSettings").off("click").on("click", function() {
// 		getSchoolSettingOfficeDetails();
// 	});

// 	$("#apiCallDetailsSearch").off("click").on("click", function() {
// 		applyApiCallDetailsClientFilterAndRender();
// 	});

// 	$("#apiCallDetailsReset").off("click").on("click", function() {
// 		if (!window.schoolSettingPageState) {
// 			window.schoolSettingPageState = {};
// 		}
// 		window.schoolSettingPageState.apiCallDetailsSelectedVendor = "";
// 		window.schoolSettingPageState.apiCallDetailsSelectedStatus = "";
// 		window.schoolSettingPageState.apiCallDetailsSelectedLimit = 250;
// 		if ($("#apiCallVendorFilter").length) {
// 			$("#apiCallVendorFilter").val("");
// 			if ($("#apiCallVendorFilter").data("select2")) {
// 				$("#apiCallVendorFilter").trigger("change");
// 			}
// 		}
// 		if ($("#apiCallStatusFilter").length) {
// 			$("#apiCallStatusFilter").val("");
// 			if ($("#apiCallStatusFilter").data("select2")) {
// 				$("#apiCallStatusFilter").trigger("change");
// 			}
// 		}
// 		if ($("#apiCallPageFilter").length) {
// 			$("#apiCallPageFilter").val("250");
// 			if ($("#apiCallPageFilter").data("select2")) {
// 				$("#apiCallPageFilter").trigger("change");
// 			}
// 		}
// 		applyApiCallDetailsClientFilterAndRender();
// 	});

// 	$(document).off("click.logSub", "#logSubApiCallDetails").on("click.logSub", "#logSubApiCallDetails", function() {
// 		// Keep sub-head visible and just reveal the content.
// 		if ($("#apiCallDetailsDiv").length) {
// 			$("#apiCallDetailsDiv").show();
// 		}
// 		// Load base data (once) and render.
// 		getSchoolSettingApiCallDetailsList(false);
// 	});

// 	// Persist current selections (select2 sometimes reports empty right after DOM updates).
// 	$(document)
// 		.off("change.apiCall", "#apiCallVendorFilter")
// 		.on("change.apiCall", "#apiCallVendorFilter", function() {
// 			window.schoolSettingPageState = window.schoolSettingPageState || {};
// 			window.schoolSettingPageState.apiCallDetailsSelectedVendor = ($(this).val() || "");
// 		})
// 		.off("select2:select.apiCall", "#apiCallVendorFilter")
// 		.on("select2:select.apiCall", "#apiCallVendorFilter", function() {
// 			window.schoolSettingPageState = window.schoolSettingPageState || {};
// 			window.schoolSettingPageState.apiCallDetailsSelectedVendor = ($(this).val() || "");
// 		});

// 	$(document)
// 		.off("change.apiCall", "#apiCallStatusFilter")
// 		.on("change.apiCall", "#apiCallStatusFilter", function() {
// 			window.schoolSettingPageState = window.schoolSettingPageState || {};
// 			window.schoolSettingPageState.apiCallDetailsSelectedStatus = ($(this).val() || "");
// 		})
// 		.off("select2:select.apiCall", "#apiCallStatusFilter")
// 		.on("select2:select.apiCall", "#apiCallStatusFilter", function() {
// 			window.schoolSettingPageState = window.schoolSettingPageState || {};
// 			window.schoolSettingPageState.apiCallDetailsSelectedStatus = ($(this).val() || "");
// 		});

// 	$(document)
// 		.off("change.apiCall", "#apiCallPageFilter")
// 		.on("change.apiCall", "#apiCallPageFilter", function() {
// 			window.schoolSettingPageState = window.schoolSettingPageState || {};
// 			window.schoolSettingPageState.apiCallDetailsSelectedLimit = parseInt($(this).val(), 10) || 250;
// 			applyApiCallDetailsClientFilterAndRender();
// 		})
// 		.off("select2:select.apiCall", "#apiCallPageFilter")
// 		.on("select2:select.apiCall", "#apiCallPageFilter", function() {
// 			window.schoolSettingPageState = window.schoolSettingPageState || {};
// 			window.schoolSettingPageState.apiCallDetailsSelectedLimit = parseInt($(this).val(), 10) || 250;
// 			applyApiCallDetailsClientFilterAndRender();
// 		});
// }

// function initializeSchoolSettingUIPlugins() {
// 	if ($("#schoolSettigsSelection").length) {
// 		$("#schoolSettigsSelection").select2({
// 			theme: "bootstrap4"
// 		});
// 	}
// 	$("#paymentGateway, #gatewayMode, #pgStatus, #lmsProviderId, #schoolLmsStatus, #sessionList, #admissionStatus, #standardGradeId, #standardGradeIdOption, #allGradeId, #learningPlan, #standardId, #paymode, #sfStatus, #gradePlan, #gradePlanOption, #activated, #schoolType").each(function() {
// 		if ($(this).length) {
// 			var dropdownParent = $(this).closest(".modal");
// 			$(this).select2({
// 				theme: "bootstrap4",
// 				dropdownParent: dropdownParent.length ? dropdownParent : $(document.body)
// 			});
// 		}
// 	});
// 	$("#apiCallVendorFilter, #apiCallStatusFilter").each(function() {
// 		if ($(this).length) {
// 			$(this).select2({
// 				theme: "bootstrap4",
// 				dropdownParent: "#schoolSettingForm"
// 			});
// 		}
// 	});
// 	$("#apiCallPageFilter").each(function() {
// 		if ($(this).length) {
// 			$(this).select2({
// 				theme: "bootstrap4",
// 				dropdownParent: "#schoolSettingForm"
// 			});
// 		}
// 	});
// 	$("#semesterStartDate1, #semesterEndDate1, #semesterStartDate2, #semesterEndDate2, #LateAppFeeDate, #LateAppFeeDateEnd").datepicker({
// 		autoclose: true,
// 		format: "mm-dd-yyyy"
// 	});
// }

// async function loadSchoolSettingPageData() {
// 	await getSchoolSettingPaymentGatewayDetails();
// 	await getSchoolSettingAllDataList();
// 	await getSchoolSettingLmsDetails();
// }

// async function getSchoolSettingAllDataList() {
// 	var responseData = null;
// 	try {
// 		responseData = await getSchoolSettingAllData();
// 	} catch (error) {
// 		if ($("#settingTable tbody").length) {
// 			$("#settingTable tbody").html("");
// 		}
// 		showMessageTheme2(0, "Unable to load setting data right now. Please try again.", "", true);
// 		return;
// 	}
// 	var details = getSchoolSettingAllDataRows(responseData);
// 	if (!$.isArray(details)) {
// 		$("#settingTable tbody").html("");
// 		showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : "No setting data available.", "", true);
// 		return;
// 	}
// 	renderSchoolSettingAllDataTable(details);
// }

// function getSchoolSettingAllData() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId(),
// 		lmsProviderId: ""
// 	};
// 	return callCommonAjax({
// 		method: "POST",
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-settings",
// 		body: payloadData,
// 		dataType: "json",
// 		global: true,
// 		showMessage: false,
// 		onFaildResolved: true,
// 		onSuccessResolved: true
// 	});
// }

// function getSchoolSettingAllDataRows(responseData) {
// 	if ($.isArray(responseData)) {
// 		return responseData;
// 	}
// 	if (responseData && $.isArray(responseData.details)) {
// 		return responseData.details;
// 	}
// 	if (responseData && $.isArray(responseData.data)) {
// 		return responseData.data;
// 	}
// 	return null;
// }

// function getSchoolSettingPaymentGatewayDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId(),
// 		pgName: ""
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-pg",
//         data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				return;
// 			}
// 			renderSchoolSettingPaymentGatewayData(responseData.details);
// 		}
// 	});
// }

// function getSchoolSettingLmsDetails(lmsProviderId) {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	if (lmsProviderId) {
// 		payloadData.lmsProviderId = String(lmsProviderId);
// 	}
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-lms",
// 		data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				return;
// 			}
// 			renderSchoolSettingLmsData(responseData.details);
// 		}
// 	});
// }

// function getSchoolSettingRoleDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-roles",
//         data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				return;
// 			}
// 			renderSchoolSettingRoleData(responseData.details);
// 		}
// 	});
// }

// function getSchoolSettingData(tabCode) {
// 	var activeMainTabCode = getSchoolSettingMainTabCode(tabCode);
// 	$("#schoolSettingForm > ul.body-tabs .nav-link[data-tab]").removeClass("active");
// 	$('#schoolSettingForm > ul.body-tabs .nav-link[data-tab="' + activeMainTabCode + '"]').addClass("active");
// 	$("#errMsg").text("");
// 	$("#paymentGatewayInfoDiv, #lmsSchoolMappingInfoDiv, #lmsRoleMappingInfoDiv, #cycleIntakeInfoDiv, #standardFeeInfoDiv, #settingAllData, #apiCallDetailsDiv, #LogDiv, #templateDiv, #sessionDiv, #TechnicalDiv, #SchoolSettingsDiv, #IntegrationMainDiv, #IntegrationPaymentGatewayDiv, #SchoolFeedbackDiv").hide();

// 	if (tabCode == "PG") {
// 		$("#IntegrationMainDiv").show();
// 		openSchoolSettingsIntegrationSubTab("IPG");
// 	} else if (tabCode == "LMSSM") {
// 		$("#lmsSchoolMappingInfoDiv").show();
// 		getSchoolSettingLmsDetails();
// 	} else if (tabCode == "LMSRM") {
// 		$("#lmsRoleMappingInfoDiv").show();
// 		getSchoolSettingRoleDetails();
// 	} else if (tabCode == "CI") {
// 		$("#cycleIntakeInfoDiv").show();
// 	} else if (tabCode == "SF") {
// 		$("#standardFeeInfoDiv").show();
// 		$("#FeeGrade").show();
// 		$("#FeeApplyGrade").hide();
// 		$(".FeeGrade").addClass("active");
// 		$(".FeeApplyGrade").removeClass("active");
// 	} else if (tabCode == "STG") {
// 		$("#settingAllData").show();
// 		openSchoolSettingDataSubTab("LIST", true);
// 	} else if (tabCode == "API_CALL_DETAILS") {
// 		// Backward compatibility: API Call Details lives under LOG now.
// 		$("#LogDiv").show();
// 		$("#apiCallDetailsDiv").show();
// 		getSchoolSettingApiCallDetailsList(true);
// 	} else if (tabCode == "TECH") {
// 		$("#TechnicalDiv").show();
// 		getSchoolSettingTechnicalDetails();
// 	} else if (tabCode == "SS") {
// 		$("#SchoolSettingsDiv").show();
// 		openSchoolSettingsSubTab("OFFICE");
// 	} else if (tabCode == "OFFICE") {
// 		$("#SchoolSettingsDiv").show();
// 		openSchoolSettingsSubTab("OFFICE");
// 	} else if (tabCode == "SL") {
// 		$("#SchoolSettingsDiv").show();
// 		openSchoolSettingsSubTab("SL");
// 	} else if (tabCode == "SM") {
// 		$("#SchoolSettingsDiv").show();
// 		openSchoolSettingsSubTab("SM");
// 	} else if (tabCode == "INTEGRATION") {
// 		$("#IntegrationMainDiv").show();
// 		openSchoolSettingsIntegrationSubTab("IPG");
// 	} else if (tabCode == "FB") {
// 		$("#IntegrationMainDiv").show();
// 		openSchoolSettingsIntegrationSubTab("FB");
// 	} else if (tabCode == "IPG") {
// 		$("#IntegrationMainDiv").show();
// 		openSchoolSettingsIntegrationSubTab("IPG");
// 	} else if (tabCode == "LOG") {
// 		$("#LogDiv").show();
// 		if ($("#apiCallDetailsDiv").length) {
// 			$("#apiCallDetailsDiv").hide();
// 		}
// 	}
// }

// function getSchoolSettingMainTabCode(tabCode) {
// 	if (tabCode == "OFFICE" || tabCode == "SL" || tabCode == "SM") {
// 		return "SS";
// 	}
// 	if (tabCode == "FB" || tabCode == "IPG" || tabCode == "PG") {
// 		return "INTEGRATION";
// 	}
// 	return tabCode;
// }

// function openSchoolSettingsSubTab(tabCode) {
// 	var activeSubTabCode = (tabCode == "SL" || tabCode == "SM") ? tabCode : "OFFICE";
// 	$("#schoolOfficeTabBtn, #schoolLinksTabBtn, #schoolMailsTabBtn").removeClass("active");
// 	if (activeSubTabCode == "OFFICE") {
// 		$("#schoolOfficeTabBtn").addClass("active");
// 	} else if (activeSubTabCode == "SL") {
// 		$("#schoolLinksTabBtn").addClass("active");
// 	} else if (activeSubTabCode == "SM") {
// 		$("#schoolMailsTabBtn").addClass("active");
// 	}
// 	$("#OfficeDiv, #SchoolLinksDiv, #SchoolMailsDiv").hide();

// 	if (activeSubTabCode == "OFFICE") {
// 		$("#OfficeDiv").show();
// 		getSchoolSettingOfficeDetails();
// 	} else if (activeSubTabCode == "SL") {
// 		$("#SchoolLinksDiv").show();
// 		getSchoolSettingLinksDetails();
// 	} else if (activeSubTabCode == "SM") {
// 		$("#SchoolMailsDiv").show();
// 		getSchoolSettingMailsDetails();
// 	}
// }

// function openSchoolSettingsIntegrationSubTab(tabCode) {
// 	var activeSubTabCode = tabCode == "FB" ? "FB" : "IPG";
// 	$("#schoolIntegrationPgTabBtn, #schoolFeedbackTabBtn").removeClass("active");
// 	if (activeSubTabCode == "IPG") {
// 		$("#schoolIntegrationPgTabBtn").addClass("active");
// 	}
// 	if (activeSubTabCode == "FB") {
// 		$("#schoolFeedbackTabBtn").addClass("active");
// 	}
// 	$("#IntegrationPaymentGatewayDiv, #SchoolFeedbackDiv").hide();
// 	if (activeSubTabCode == "IPG") {
// 		$("#IntegrationPaymentGatewayDiv").show();
// 		if ($("#paymentGatewayInfoDiv").length) {
// 			$("#paymentGatewayInfoDiv").show();
// 		}
// 		getSchoolSettingPaymentGatewayDetails();
// 	}
// 	if (activeSubTabCode == "FB") {
// 		$("#SchoolFeedbackDiv").show();
// 		getSchoolSettingFeedbackDetails();
// 	}
// }

// function openSchoolSettingDataSubTab(tabCode, reloadData) {
// 	var activeTab = tabCode == "ADD" ? "ADD" : "LIST";
// 	$("#settingAllDataTabBtn, #settingAddDataTabBtn").removeClass("active");
// 	if (activeTab == "ADD") {
// 		$("#settingAddDataTabBtn").addClass("active");
// 		$(".settingTableWrapper").hide();
// 		$("#settingDataSave").show();
// 		return;
// 	}
// 	$("#settingAllDataTabBtn").addClass("active");
// 	$(".settingTableWrapper").show();
// 	$("#settingDataSave").hide();
// 	if (reloadData !== false) {
// 		getSchoolSettingAllDataList();
// 	}
// }

// function getSchoolSettingApiCallDetailsList(forceReload) {
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};

// 	if (!forceReload && Array.isArray(window.schoolSettingPageState.apiCallDetailsAllList)) {
// 		applyApiCallDetailsClientFilterAndRender();
// 		return Promise.resolve();
// 	}


// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId(),
// 		apiVendor: "",
// 		status: ""
// 	};
// 	return callCommonAjax({
// 		method: "POST",
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/api-call-details",
// 		body: payloadData,
// 		dataType: "json",
// 		global: true,
// 		showMessage: false,
// 		onFaildResolved: true,
// 		onSuccessResolved: true
// 	}).then(function(responseData) {
// 		var list = (responseData && responseData.status == "1" && Array.isArray(responseData.details)) ? responseData.details : [];
// 		window.schoolSettingPageState.apiCallDetailsAllList = list;
// 		// Initialize dropdown options from the base list (do this once per reload).
// 		syncApiCallDetailsFilters(list, getApiCallDetailsSelectedVendor(), getApiCallDetailsSelectedStatus());
// 		updateApiCallDetailsPageOptions(list.length, 250);
// 		applyApiCallDetailsClientFilterAndRender();
// 	});
// }

// function getApiCallDetailsSelectedVendor() {
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	return ($("#apiCallVendorFilter").length ? ($("#apiCallVendorFilter").val() || "") : (window.schoolSettingPageState.apiCallDetailsSelectedVendor || ""));
// }

// function getApiCallDetailsSelectedStatus() {
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	return ($("#apiCallStatusFilter").length ? ($("#apiCallStatusFilter").val() || "") : (window.schoolSettingPageState.apiCallDetailsSelectedStatus || ""));
// }

// function applyApiCallDetailsClientFilterAndRender() {
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	var allList = Array.isArray(window.schoolSettingPageState.apiCallDetailsAllList) ? window.schoolSettingPageState.apiCallDetailsAllList : [];
// 	var selectedVendor = getApiCallDetailsSelectedVendor();
// 	var selectedStatus = getApiCallDetailsSelectedStatus();
// 	var selectedLimit = window.schoolSettingPageState.apiCallDetailsSelectedLimit || parseInt($("#apiCallPageFilter").val(), 10) || 250;

// 	// Persist last selections
// 	window.schoolSettingPageState.apiCallDetailsSelectedVendor = selectedVendor || "";
// 	window.schoolSettingPageState.apiCallDetailsSelectedStatus = selectedStatus || "";
// 	window.schoolSettingPageState.apiCallDetailsSelectedLimit = selectedLimit || 250;

// 	var filtered = allList.filter(function(row) {
// 		if (!row) {
// 			return false;
// 		}
// 		// Match behavior similar to backend LIKE '%value%'.
// 		if (selectedVendor) {
// 			var v = (row.apiVendor || "");
// 			if (String(v).toLowerCase().indexOf(String(selectedVendor).toLowerCase()) === -1) {
// 				return false;
// 			}
// 		}
// 		if (selectedStatus) {
// 			var s = (row.status || "");
// 			if (String(s).toLowerCase().indexOf(String(selectedStatus).toLowerCase()) === -1) {
// 				return false;
// 			}
// 		}
// 		return true;
// 	});

// 	// Client-side "paging" (cumulative): 1..250, 1..500, 1..750 ...
// 	var total = filtered.length;
// 	if (!selectedLimit || selectedLimit < 250) {
// 		selectedLimit = 250;
// 		window.schoolSettingPageState.apiCallDetailsSelectedLimit = 250;
// 	}
// 	updateApiCallDetailsPageOptions(total, selectedLimit);
// 	if ($("#apiCallPageFilter").length) {
// 		$("#apiCallPageFilter").val(String(selectedLimit));
// 	}

// 	var paged = filtered.slice(0, Math.min(selectedLimit, total));

// 	if (typeof window.renderSchoolSettingApiCallDetailsTable === "function") {
// 		window.renderSchoolSettingApiCallDetailsTable(paged);
// 	} else if (typeof renderSchoolSettingApiCallDetailsTable === "function") {
// 		renderSchoolSettingApiCallDetailsTable(paged);
// 	}
// }

// function updateApiCallDetailsPageOptions(totalCount, selectedLimit) {
// 	var total = parseInt(totalCount, 10) || 0;
// 	var pageSize = 250;
// 	var maxPage = Math.max(1, Math.ceil(total / pageSize));
// 	var html = "";
// 	for (var p = 1; p <= maxPage; p++) {
// 		var end = Math.min(p * pageSize, total);
// 		html += '<option value="' + end + '">1 to ' + end + "</option>";
// 	}
// 	if ($("#apiCallPageFilter").length) {
// 		$("#apiCallPageFilter").html(html || '<option value="250">1 to 250</option>');
// 		$("#apiCallPageFilter").val(String(selectedLimit || 250));
// 		if ($("#apiCallPageFilter").data("select2")) {
// 			$("#apiCallPageFilter").trigger("change.select2");
// 		}
// 	}
// }

// // openApiCallDetailsFromLog removed: API call details now stays under LOG.

// function syncApiCallDetailsFilters(list, selectedVendor, selectedStatus) {
// 	if (!Array.isArray(list)) {
// 		list = [];
// 	}
// 	window.schoolSettingPageState = window.schoolSettingPageState || {};
// 	window.schoolSettingPageState.apiCallDetailsFilters = window.schoolSettingPageState.apiCallDetailsFilters || {};
// 	var filterState = window.schoolSettingPageState.apiCallDetailsFilters;

// 	var shouldInitializeCache = !filterState.initialized && !selectedVendor && !selectedStatus;
// 	var vendors = Array.isArray(filterState.vendors) ? filterState.vendors.slice() : [];
// 	var statuses = Array.isArray(filterState.statuses) ? filterState.statuses.slice() : [];

// 	// If cache isn't initialized yet, derive from current list (but only "lock" it when no filter applied).
// 	if (vendors.length === 0 || statuses.length === 0 || shouldInitializeCache) {
// 		var derivedVendors = [];
// 		var derivedStatuses = [];
// 		$.each(list, function(_, row) {
// 			if (row && row.apiVendor && derivedVendors.indexOf(row.apiVendor) === -1) {
// 				derivedVendors.push(row.apiVendor);
// 			}
// 			if (row && row.status && derivedStatuses.indexOf(row.status) === -1) {
// 				derivedStatuses.push(row.status);
// 			}
// 		});
// 		derivedVendors.sort();
// 		derivedStatuses.sort();
// 		if (shouldInitializeCache) {
// 			filterState.vendors = derivedVendors;
// 			filterState.statuses = derivedStatuses;
// 			filterState.initialized = true;
// 			vendors = derivedVendors.slice();
// 			statuses = derivedStatuses.slice();
// 		} else if (vendors.length === 0 && statuses.length === 0) {
// 			vendors = derivedVendors;
// 			statuses = derivedStatuses;
// 		}
// 	}

// 	// Make sure currently selected values exist in the dropdown options to avoid empty `.val()`.
// 	if (selectedVendor && vendors.indexOf(selectedVendor) === -1) {
// 		vendors.push(selectedVendor);
// 		vendors.sort();
// 	}
// 	if (selectedStatus && statuses.indexOf(selectedStatus) === -1) {
// 		statuses.push(selectedStatus);
// 		statuses.sort();
// 	}

// 	if ($("#apiCallVendorFilter").length) {
// 		var vendorHtml = '<option value="">All</option>';
// 		$.each(vendors, function(_, v) {
// 			vendorHtml += '<option value="' + v + '">' + v + "</option>";
// 		});
// 		$("#apiCallVendorFilter").html(vendorHtml);
// 		$("#apiCallVendorFilter").val(selectedVendor || "");
// 		if ($("#apiCallVendorFilter").data("select2")) {
// 			$("#apiCallVendorFilter").trigger("change");
// 		}
// 	}

// 	if ($("#apiCallStatusFilter").length) {
// 		var statusHtml = '<option value="">All</option>';
// 		$.each(statuses, function(_, s) {
// 			statusHtml += '<option value="' + s + '">' + s + "</option>";
// 		});
// 		$("#apiCallStatusFilter").html(statusHtml);
// 		$("#apiCallStatusFilter").val(selectedStatus || "");
// 		if ($("#apiCallStatusFilter").data("select2")) {
// 			$("#apiCallStatusFilter").trigger("change");
// 		}
// 	}
// }

// function getSchoolSettingTechnicalDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-technical",
// 		data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				renderSchoolSettingTechnicalData({});
// 				return;
// 			}
// 			renderSchoolSettingTechnicalData(responseData.details);
// 		},
// 		error: function() {
// 			renderSchoolSettingTechnicalData({});
// 		}
// 	});
// }

// function renderSchoolSettingTechnicalData(details) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.schoolSettingsTechnical = details;
// 	renderSchoolSettingTechnicalFields(details);
// 	renderSchoolSettingTechnicalTable(details);
// }

// function renderSchoolSettingTechnicalFields(details) {
// 	var technical = details && typeof details === "object" ? details : {};
// 	var fieldMap = {
// 		technicalSettingId: "schoolSettingsTechnicalId",
// 		showSubjectCostOnSignup: "showSubjectCostOnSignup",
// 		flexEnrollment: "flexEnrollment",
// 		schoolEnrollment: "schoolEnrollment",
// 		letterHeadImg: "letterHeadImg",
// 		teachAgreementSign: "teachAgreementSign",
// 		authorizedPersonName: "authorizedPersonName",
// 		courseProviderId: "courseProviderId",
// 		courseProviderIdBatch: "courseProviderIdBatch",
// 		courseProviderName: "courseProviderName",
// 		showCourseInManageCourse: "showCourseInManageCourse",
// 		currencyIsoCode: "currencyIsoCode",
// 		currencySymbol: "currencySymbol",
// 		cssFile: "cssFile",
// 		loginBgImage: "loginBgImage",
// 		signupTeacherImage: "signupTeacherImage",
// 		schoolTimeZone: "schoolTimeZone",
// 		allowedTimezone: "allowedTimezone",
// 		meetingLinkProvider: "meetingLinkProvider",
// 		meetingProvServiceReq: "meetingProvServiceReq",
// 		batchTimeZoneUTC1: "batchTimeZoneUTC1",
// 		batchTimeZoneUTC2: "batchTimeZoneUTC2",
// 		copyrightYear: "copyrightYear",
// 		copyrightUrl: "copyrightUrl",
// 		copyrightName: "copyrightName",
// 		sessionDurationElementry: "sessionDurationElementry",
// 		sessionDurationMiddle: "sessionDurationMiddle",
// 		sessionDurationHigh: "sessionDurationHigh",
// 		oneToOneSignupLabel: "oneToOneSignupLabel",
// 		batchSignupLabel: "batchSignupLabel",
// 		scholarshipSignupLabel: "scholarshipSignupLabel",
// 		bookEnrollmentDuration: "bookEnrollmentDuration",
// 		discoveryEducationAddon: "discoveryEducationAddon",
// 		discoveryEducationOneToOne: "discoveryEducationOneToOne",
// 		discoveryEducationBatch: "discoveryEducationBatch",
// 		discoveryEducationScholarship: "discoveryEducationScholarship",
// 		batchClosedFrom: "batchClosedFrom",
// 		showStudentCourseSelectionStatus: "showStudentCourseSelectionStatus",
// 		lmsUserProvider: "lmsUserProvider",
// 		elligiblityStatusToSendMail: "elligiblityStatusToSendMail",
// 		evaluationTestFee: "evaluationTestFee",
// 		meetingAutoDays: "meetingAutoDays",
// 		commonPaymentUserId: "commonPaymentUserId",
// 		evaluationModuleName: "evaluationModuleName",
// 		evaluationModTermsName: "evaluationModTermsName",
// 		evaluationModEnabled: "evaluationModEnabled",
// 		evaluationModSlotTime: "evaluationModSlotTime",
// 		evalModSlotBufTime: "evalModSlotBufTime",
// 		evalSlotCronTime: "evalSlotCronTime",
// 		evalSlotViewTimeDiff: "evalSlotViewTimeDiff",
// 		paymentReminderService: "paymentReminderService",
// 		paymentReminderBefore: "paymentReminderBefore",
// 		paymentReminderMaximumDays: "paymentReminderMaximumDays",
// 		paymentReminderFrequency: "paymentReminderFrequency",
// 		lmsAccountLocService: "lmsAccountLocService",
// 		accountLockInDays: "accountLockInDays",
// 		transcriptSignature: "transcriptSignature",
// 		bookAnEnrollmentService: "bookAnEnrollmentService",
// 		flexSignupLabel: "flexSignupLabel",
// 		curseProviderIdScholarship: "curseProviderIdScholarship",
// 		oneRoasterUploadService: "oneRoasterUploadService"
// 	};
// 	$.each(fieldMap, function(fieldId, fieldKey) {
// 		if ($("#" + fieldId).length) {
// 			var value = technical && Object.prototype.hasOwnProperty.call(technical, fieldKey) ? technical[fieldKey] : "";
// 			$("#" + fieldId).val(value === null || typeof value === "undefined" ? "" : value);
// 		}
// 	});
// 	syncSchoolSettingTechnicalImageField("letterHeadImg", "letterHeadImgDisplay");
// 	syncSchoolSettingTechnicalImageField("teachAgreementSign", "teachAgreementSignDisplay");
// 	syncSchoolSettingTechnicalImageField("loginBgImage", "loginBgImageDisplay");
// 	syncSchoolSettingTechnicalImageField("signupTeacherImage", "signupTeacherImageDisplay");
// 	syncSchoolSettingTechnicalImageField("transcriptSignature", "transcriptSignatureDisplay");
// }

// function renderSchoolSettingTechnicalTable(details) {
// 	var technicalData = Array.isArray(details) ? details[0] : details;
// 	var $tableHead = $("#technicalSettingsTable thead");
// 	var $tableBody = $("#technicalSettingsTable tbody");
// 	if (!$tableHead.length || !$tableBody.length) {
// 		return;
// 	}
// 	if (!technicalData || typeof technicalData !== "object") {
// 		$tableHead.html("");
// 		$tableBody.html('<tr><td class="text-center text-muted">No technical settings found.</td></tr>');
// 		return;
// 	}
// 	var keys = Object.keys(technicalData);
// 	if (!keys.length) {
// 		$tableHead.html("");
// 		$tableBody.html('<tr><td class="text-center text-muted">No technical settings found.</td></tr>');
// 		return;
// 	}
// 	var headHtml = "<tr>";
// 	$.each(keys, function(index, key) {
// 		headHtml += '<th style="font-weight:bold;white-space:nowrap;">' + getSchoolSettingTechnicalColumnLabel(key) + "</th>";
// 	});
// 	headHtml += "</tr>";
// 	var bodyHtml = "<tr>";
// 	$.each(keys, function(index, key) {
// 		bodyHtml += '<td style="white-space:nowrap;">' + getSchoolSettingTechnicalDisplayValue(technicalData[key]) + "</td>";
// 	});
// 	bodyHtml += "</tr>";
// 	$tableHead.html(headHtml);
// 	$tableBody.html(bodyHtml);
// }

// function getSchoolSettingTechnicalColumnLabel(key) {
// 	if (!key) {
// 		return "";
// 	}
// 	return key
// 		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
// 		.replace(/_/g, " ")
// 		.replace(/\b\w/g, function(letter) {
// 			return letter.toUpperCase();
// 		});
// }

// function getSchoolSettingTechnicalDisplayValue(value) {
// 	if (value === null || typeof value === "undefined") {
// 		return "-";
// 	}
// 	if (value instanceof Date) {
// 		return value.toISOString();
// 	}
// 	return String(value);
// }

// function syncSchoolSettingTechnicalImageField(fieldId, displayId) {
// 	var $field = $("#" + fieldId);
// 	var $display = $("#" + displayId);
// 	if (!$field.length || !$display.length) {
// 		return;
// 	}
// 	var value = $field.val() || "";
// 	var fileName = value ? String(value).split(/[\\/]/).pop() : "";
// 	$display.find(".technical-file-name").text(fileName);
// 	if (value) {
// 		$display.removeClass("d-none");
// 	} else {
// 		$display.addClass("d-none");
// 	}
// }

// function getSchoolSettingOfficeDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-office",
// 		data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				renderSchoolSettingOfficeData({});
// 				return;
// 			}
// 			renderSchoolSettingOfficeData(responseData.details);
// 		},
// 		error: function() {
// 			renderSchoolSettingOfficeData({});
// 		}
// 	});
// }

// function renderSchoolSettingOfficeData(details) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.schoolSettingsOffice = details;
// 	renderSchoolSettingOfficeFields(details);
// }

// function renderSchoolSettingOfficeFields(details) {
// 	var office = details && typeof details === "object" ? details : {};
// 	var fieldMap = {
// 		officeSettingId: "schoolSettingsOfficeId",
// 		schoolId: "schoolId",
// 		schoolType: "schoolType",
// 		parentSchoolId: "parentSchoolId",
// 		uuid: "uuid",
// 		userId: "userId",
// 		schoolName: "schoolName",
// 		address: "address",
// 		alternateAddress: "alternateAddress",
// 		contactEmail: "contactEmail",
// 		whatsAppCode: "whatsAppCode",
// 		whatsAppContact: "whatsAppContact",
// 		schoolContactCode: "schoolContactCode",
// 		schoolContact: "schoolContact",
// 		landlineCode: "landlineCode",
// 		landlineContact: "landlineContact",
// 		contactForCertificate: "contactForCertificate",
// 		demoContact: "demoContact",
// 		whatsAppCodeTeacher: "whatsAppCodeTeacher",
// 		whatsAppContactTeacher: "whatsAppContactTeacher",
// 		whatsappContactWithFormat: "whatsappContactWithFormat",
// 		whatsappContactTeacherWithFormat: "whatsappContactTeacherWithFormat",
// 		officeContactNumWtsCheck: "officeContactNumWtsCheck",
// 		supportNumWtsCheck: "supportNumWtsCheck",
// 		isSchoolSetupComplete: "isSchoolSetupComplete",
// 		supportContactCode: "supportContactCode",
// 		supportContact: "supportContact",
// 		countryCode: "countryCode",
// 		supportContactCountryCode: "supportContactCountryCode",
// 		modulePermissions: "modulePermissions"
// 	};
// 	$.each(fieldMap, function(fieldId, fieldKey) {
// 		if ($("#" + fieldId).length) {
// 			var value = office && Object.prototype.hasOwnProperty.call(office, fieldKey) ? office[fieldKey] : "";
// 			$("#" + fieldId).val(value === null || typeof value === "undefined" ? "" : value);
// 		}
// 	});
// 	if ($("#schoolType").data("select2")) {
// 		$("#schoolType").trigger("change.select2");
// 	}
// }

// function getSchoolSettingLinksDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-links",
// 		data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				renderSchoolSettingLinksData({});
// 				return;
// 			}
// 			renderSchoolSettingLinksData(responseData.details);
// 		},
// 		error: function() {
// 			renderSchoolSettingLinksData({});
// 		}
// 	});
// }

// function getSchoolSettingFeedbackDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-feedback",
// 		data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				renderSchoolSettingFeedbackData({});
// 				return;
// 			}
// 			renderSchoolSettingFeedbackData(responseData.details);
// 		},
// 		error: function() {
// 			renderSchoolSettingFeedbackData({});
// 		}
// 	});
// }

// function renderSchoolSettingFeedbackData(details) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.schoolSettingFeedback = details;
// 	renderSchoolSettingFeedbackFields(details);
// }

// function renderSchoolSettingFeedbackFields(details) {
// 	var feedbackSettings = details && typeof details === "object" ? details : {};
// 	var fieldMap = {
// 		feedbackSettingId: "id",
// 		feedbackVendorId: "vendorId",
// 		feedbackApiKey: "apiKey",
// 		feedbackApiUrl: "feedbackApiUrl",
// 		feedbackDashboardUrl: "feedbackDashboardUrl"
// 	};
// 	$.each(fieldMap, function(fieldId, fieldKey) {
// 		if ($("#" + fieldId).length) {
// 			var value = feedbackSettings && Object.prototype.hasOwnProperty.call(feedbackSettings, fieldKey) ? feedbackSettings[fieldKey] : "";
// 			$("#" + fieldId).val(value === null || typeof value === "undefined" ? "" : value);
// 		}
// 	});
// }

// function renderSchoolSettingLinksData(details) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.schoolSettingsLinks = details;
// 	renderSchoolSettingLinksFields(details);
// }

// function renderSchoolSettingLinksFields(details) {
// 	var schoolLinks = details && typeof details === "object" ? details : {};
// 	var fieldMap = {
// 		schoolSettingsLinksId: "schoolSettingsLinksId",
// 		schoolId: "schoolId",
// 		schoolWebsite: "schoolWebsite",
// 		logoUrl: "logoUrl",
// 		receiptLogoUrl: "receiptLogoUrl",
// 		emailLogoUrl: "emailLogoUrl",
// 		favIconUrl: "favIconUrl",
// 		signupUrl: "signupUrl",
// 		ticketRaisedUrl: "ticketRaisedUrl",
// 		termasOfUserUrl: "termasOfUserUrl",
// 		contactUsUrl: "contactUsUrl",
// 		contactUsActive: "contactUsActive",
// 		privacyPolicyUrl: "privacyPolicyUrl",
// 		instagramUrl: "instagramUrl",
// 		fbUrl: "fbUrl",
// 		pintrestUrl: "pintrestUrl",
// 		twitterUrl: "twitterUrl",
// 		linkdinUrl: "linkdinUrl",
// 		codeConductUrl: "codeConductUrl",
// 		chatBoatActive: "chatBoatActive",
// 		chatBoatUrl: "chatBoatUrl",
// 		studHBookUrl: "studHBookUrl",
// 		batchStudHBookUrl: "batchStudHBookUrl",
// 		enrollmentPolicyUrl: "enrollmentPolicyUrl",
// 		studentPolicytUrl: "studentPolicytUrl",
// 		schoolPolicyUrl: "schoolPolicyUrl",
// 		ytUrl: "ytUrl",
// 		whiteLogoUrl: "whiteLogoUrl",
// 		dashboardVideoUrl: "dashboardVideoUrl",
// 		schoolStamp: "schoolStamp"
// 	};
// 	$.each(fieldMap, function(fieldId, fieldKey) {
// 		if ($("#" + fieldId).length) {
// 			var value = schoolLinks && Object.prototype.hasOwnProperty.call(schoolLinks, fieldKey) ? schoolLinks[fieldKey] : "";
// 			$("#" + fieldId).val(value === null || typeof value === "undefined" ? "" : value);
// 		}
// 	});
// }

// function getSchoolSettingMailsDetails() {
// 	var payloadData = {
// 		userId: parseInt(USER_ID, 10) || 0,
// 		schoolId: getSchoolSettingCurrentSchoolId()
// 	};
// 	$.ajax({
// 		type: "POST",
// 		contentType: APPLICATION_JSON_VALUE,
// 		url: BASE_URL + CONTEXT_PATH + "api/v1/settings/school-mails",
// 		data: JSON.stringify(payloadData),
// 		dataType: "json",
// 		cache: false,
// 		success: function(responseData) {
// 			if (!responseData || responseData.status != "1" || !responseData.details) {
// 				renderSchoolSettingMailsData({});
// 				return;
// 			}
// 			renderSchoolSettingMailsData(responseData.details);
// 		},
// 		error: function() {
// 			renderSchoolSettingMailsData({});
// 		}
// 	});
// }

// function renderSchoolSettingMailsData(details) {
// 	if (!window.schoolSettingPageState) {
// 		window.schoolSettingPageState = {};
// 	}
// 	if (!window.schoolSettingPageState.data) {
// 		window.schoolSettingPageState.data = {};
// 	}
// 	window.schoolSettingPageState.data.schoolSettingsMails = details;
// 	renderSchoolSettingMailsFields(details);
// }

// function renderSchoolSettingMailsFields(details) {
// 	var schoolMails = details && typeof details === "object" ? details : {};
// 	var fieldMap = {
// 		senderEmail: "senderEmail",
// 		emailForClassRoomSession: "emailForClassRoomSession",
// 		emailForDemoCouncelling: "emailForDemoCouncelling",
// 		emailForStudentInstallmentFee: "emailForStudentInstallmentFee",
// 		emailForPpcRequest: "emailForPpcRequest",
// 		emailForClientSignup: "emailForClientSignup",
// 		emailForHiring: "emailForHiring",
// 		emailAccountName: "emailAccountName",
// 		emailAccountAdminName: "emailAccountAdminName",
// 		emailAccountSupport: "emailAccountSupport",
// 		emailOtherAdmain: "emailOtherAdmain",
// 		technicalEmail: "technicalEmail",
// 		emailAccountForAuditor: "emailAccountForAuditor",
// 		withdrawalRequestAdmin: "withdrawalRequestAdmin",
// 		emailOfB2bSchool: "emailOfB2bSchool",
// 		emailForOtherSchool: "emailForOtherSchool",
// 		notificationEmail: "notificationEmail",
// 		careersEmail: "careersEmail"
// 	};
// 	$.each(fieldMap, function(fieldId, fieldKey) {
// 		if ($("#" + fieldId).length) {
// 			var value = schoolMails && Object.prototype.hasOwnProperty.call(schoolMails, fieldKey) ? schoolMails[fieldKey] : "";
// 			$("#" + fieldId).val(value === null || typeof value === "undefined" ? "" : value);
// 		}
// 	});
// }

// function clearSchoolSettingTechnicalImage(fieldId, fileInputId, displayId) {
// 	var $field = $("#" + fieldId);
// 	var $fileInput = $("#" + fileInputId);
// 	var $display = $("#" + displayId);
// 	if ($field.length) {
// 		$field.val("");
// 	}
// 	if ($fileInput.length) {
// 		$fileInput.val("");
// 	}
// 	if ($display.length) {
// 		$display.find(".technical-file-name").text("");
// 		$display.addClass("d-none");
// 	}
// }

// function uploadSchoolSettingTechnicalImage(inputEl, fieldId, displayId) {
// 	var file = inputEl && inputEl.files ? inputEl.files[0] : null;
// 	if (!file) {
// 		return;
// 	}
// 	var allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
// 	if (allowedTypes.indexOf(file.type) === -1) {
// 		showMessageTheme2(0, "Please upload JPG, JPEG, PNG, WEBP, or GIF image files only.");
// 		$(inputEl).val("");
// 		return;
// 	}
// 	if (file.size > 5 * 1024 * 1024) {
// 		showMessageTheme2(0, "Please upload an image smaller than 5 MB.");
// 		$(inputEl).val("");
// 		return;
// 	}
// 	var formData = new FormData();
// 	formData.append("file", file, file.name);
// 	$.ajax({
// 		type: "POST",
// 		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/api/upload/" + UNIQUEUUID,
// 		data: formData,
// 		dataType: "json",
// 		processData: false,
// 		contentType: false,
// 		success: function(responseData) {
// 			var uploadedFileName = "";
// 			if (responseData && responseData.status === "1") {
// 				if (responseData.filename) {
// 					uploadedFileName = responseData.filename;
// 				} else if (responseData.uploadFiles && responseData.uploadFiles.length > 0 && responseData.uploadFiles[0].fileName) {
// 					uploadedFileName = responseData.uploadFiles[0].fileName;
// 				}
// 			}
// 			if (!uploadedFileName) {
// 				$(inputEl).val("");
// 				showMessageTheme2(0, (responseData && responseData.message) ? responseData.message : "Unable to upload file.");
// 				return;
// 			}
// 			$("#" + fieldId).val(uploadedFileName);
// 			syncSchoolSettingTechnicalImageField(fieldId, displayId);
// 			showMessageTheme2(1, "File uploaded successfully.");
// 		},
// 		error: function() {
// 			$(inputEl).val("");
// 			showMessageTheme2(0, "Unable to upload file.");
// 		}
// 	});
// }
