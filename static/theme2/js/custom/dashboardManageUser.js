
function showManageProfileSchoolContentListingWithQueries(elementId, argument) {
	console.log('DEFAULT_SEARCH_STATE: ' + DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
	console.log(elementId + ' = ' + isDataTable);
	if (isDataTable) {
		$('#' + elementId).dataTable().fnDestroy();
	}
	$('#' + elementId).DataTable({
		"stateSave": true,
		"processing": true,
		"serverSide": true,
		"pagingType": "full",
		"searching": true,
		"pageLength": 10,
		"stateLoadParams": function (settings, data) {
			if (!DEFAULT_SEARCH_STATE) {
				return false;
			}
		},
		"ajax": {
			"url": CONTEXT_PATH + SCHOOL_UUID + "/dashboard/manage-profile-content-1/" + UNIQUEUUID + "" + argument,
			"data": function (data) {
				//console.log('data '+data)
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			if (aData['viewProfile'] || aData['editProfile']) {
				$('td', nRow).css('text-align', 'left');
			}
			//$('#'+elementId+' tr:first').addClass('success');
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S.No" },
			{ "data": "schoolName", "name": "schoolName", "title": "School Name" },
			{ "data": "userName", "name": "userName", "title": "User Name" },
			{ "data": "profileStatus", "name": "profileStatus", "title": "Profile Status" },
			{ "data": "action", "name": "action", "title": "Action" },
		],
		/* drawCallback: function() {
			 this.api().state.clear();
		   } */
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
}

function showManageProfileStudentContentListingWithQueries(elementId, argument) {
	console.log('DEFAULT_SEARCH_STATE: ' + DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
	console.log(elementId + ' = ' + isDataTable);
	if (isDataTable) {
		$('#' + elementId).dataTable().fnDestroy();
	}
	console.log("referral");
	$('#' + elementId).DataTable({
		"stateSave": true,
		"processing": true,
		"serverSide": true,
		"pagingType": "full",
		"searching": false,
		"pageLength": 10,
		"stateLoadParams": function (settings, data) {
			if (!DEFAULT_SEARCH_STATE) {
				return false;
			}
		},
		"ajax": {
			"url": CONTEXT_PATH + SCHOOL_UUID + "/dashboard/manage-profile-content-1/" + UNIQUEUUID + "" + argument,
			"data": function (data) {
				//console.log('data '+data)
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']) {
				$('td', nRow).css('text-align', 'left');
			}
			if (aData['referralCode'].indexOf("N/A") != -1) { }
			else {
				$(nRow).addClass('rowForCounselor');
			}
			$('#' + elementId + ' thead tr:first').addClass('bg-primary text-white');
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S.No" },
			{ "data": "name", "name": "name", "title": "Student Name" },
			{ "data": "userName", "name": "userName", "title": "User Name" },
			{ "data": "standard", "name": "standard", "title": "Grade" },
			{ "data": "profileStatus", "name": "profileStatus", "title": "Profile Status" },
			{ "data": "referralCode", "name": "referralCode", "title": "Counselor Name/Referral Code" },
			{ "data": "courseProviderName", "name": "courseProviderName", "title": "LMS Platform 2" },
			{ "data": "action", "name": "action", "title": "Action" },
		],
		/*  drawCallback: function() {
				this.api().state.clear();
		  } */
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
}

function showManageProfileCommonContentListingWithQueriesWithoutGoto(elementId, argument) {
	console.log('DEFAULT_SEARCH_STATE: ' + DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
	console.log(elementId + ' = ' + isDataTable);
	if (isDataTable) {
		$('#' + elementId).dataTable().fnDestroy();
	}
	console.log("referral");
	$('#' + elementId).DataTable({
		"stateSave": true,
		"processing": true,
		"serverSide": true,
		"pagingType": "full",
		"searching": true,
		"pageLength": 10,
		"stateLoadParams": function (settings, data) {
			if (!DEFAULT_SEARCH_STATE) {
				return false;
			}
		},
		"ajax": {
			"url": CONTEXT_PATH + UNIQUEUUID + "/" + "dashboard/user-list-content-1" + argument,
			"data": function (data) {
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']) {
				$('td', nRow).css('text-align', 'left');
			}
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S.No" },
			{ "data": "name", "name": "name", "title": "Name" },
			{ "data": "userName", "name": "userName", "title": "User Name" },
			{ "data": "roleName", "name": "roleName", "title": "Role" },
			{ "data": "profileStatus", "name": "profileStatus", "title": "Profile Status" },
			{ "data": "addedDate", "name": "addedDate", "title": "Added Date" },
			{ "data": "action", "name": "action", "title": "Action" },
		],
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
}

function showManageProfileCommonContentListingWithQueries(elementId, argument) {
	console.log('DEFAULT_SEARCH_STATE: ' + DEFAULT_SEARCH_STATE);
	var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
	console.log(elementId + ' = ' + isDataTable);
	if (isDataTable) {
		$('#' + elementId).dataTable().fnDestroy();
	}
	console.log("referral");
	$('#' + elementId).DataTable({
		"stateSave": true,
		"processing": true,
		"serverSide": true,
		"searching": true,
		"pageLength": 10,
		"stateLoadParams": function (settings, data) {
			if (!DEFAULT_SEARCH_STATE) {
				return false;
			}
		},
		"ajax": {
			"url": CONTEXT_PATH + UNIQUEUUID + "/" + "dashboard/user-list-content-1" + argument,
			"data": function (data) {
			}
		},
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			if (aData['paymentTypeApplicationFee'] || aData['parentProfile'] || aData['viewProfile']) {
				$('td', nRow).css('text-align', 'left');
			}
			$('#' + elementId + ' tr:first').addClass('success');
		},
		"columns": [
			{ "data": "sno", "name": "sno", "title": "S.No" },
			{ "data": "name", "name": "name", "title": "Name" },
			{ "data": "userName", "name": "userName", "title": "User Name" },
			{ "data": "roleName", "name": "roleName", "title": "Role" },
			{ "data": "profileStatus", "name": "profileStatus", "title": "Profile Status" },
			{ "data": "addedDate", "name": "addedDate", "title": "Added Date" },
			{ "data": "action", "name": "action", "title": "Action" },
		],
	});
	$('#' + elementId).dataTable().fnSetFilteringEnterPress();
}


// The backend caps /advance-student-search at 25 rows per request (see
// ADV_STUDENT_SEARCH_MAX_PAGE_SIZE in ClientDashboardBatchController) because the search
// query joins 20+ tables and every row gets action-menu enrichment — one big 250-row
// request is slow enough to feel frozen. Larger page sizes are pulled as several parallel
// 25-row chunk requests and appended progressively — same concept as the Lead List module.
var ADV_STUDENT_SEARCH_CHUNK_SIZE = 25;
// Max chunk requests in flight at once; keeps DB connection-pool demand bounded.
var ADV_STUDENT_SEARCH_PARALLEL_CHUNKS = 8;

// Runs taskFn(0..count-1) with at most `limit` promises in flight. Queued tasks start
// automatically as earlier ones finish. Results are delivered through taskFn itself.
async function runAdvSearchWithConcurrencyLimit(count, limit, taskFn) {
	var results = new Array(count);
	var next = 0;
	async function worker() {
		while (next < count) {
			var i = next++;
			results[i] = await taskFn(i);
		}
	}
	var workers = [];
	for (var w = 0; w < Math.min(limit, count); w++) {
		workers.push(worker());
	}
	await Promise.all(workers);
	return results;
}

function advStudentSearchAjax(requestObj, asJson) {
	return $.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", asJson ? "advance-student-search-meta" : "advance-student-search"),
		data: JSON.stringify(requestObj),
		dataType: asJson ? "json" : "html",
		global: false,
		async: true,
	});
}

// True when the HTML response is actually a status string like "FAILED|msg".
function advStudentSearchHandleError(htmlContent) {
	var stringMessage = String(htmlContent || "").split("|");
	if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
		if (stringMessage[0] == "SESSIONOUT") {
			redirectLoginPage();
		} else {
			showMessage(true, stringMessage[1]);
		}
		return true;
	}
	return false;
}

function advStudentSearchProgress(loaded, total) {
	var el = $("#advStudentSearchProgress");
	if (!el.length) {
		$("#manageStudent").prepend("<div id='advStudentSearchProgress' class='text-muted font-12 mb-1'></div>");
		el = $("#advStudentSearchProgress");
	}
	if (loaded >= total) {
		el.remove();
	} else {
		el.text("Loading students… " + loaded + " of " + total);
	}
}

async function advanceStudentSearch(formId, moduleId, themetype) {
	checkTextBox(formId);
	customLoader(true);
	hideMessage("");
	try {
		var baseRequest = getCallRequestForadvanceStudentSearch(formId, moduleId, themetype);
		// How many records the user asked for in total (the legacy pageSize field, default 250).
		var requestedRecords = parseInt(baseRequest.studentDetailDTO.pageSize, 10);
		if (isNaN(requestedRecords) || requestedRecords <= 0) {
			requestedRecords = 250;
		}
		var startOffset = parseInt(baseRequest.studentDetailDTO.page, 10);
		if (isNaN(startOffset) || startOffset < 0) {
			startOffset = 0;
		}

		function buildChunkRequest(chunkIndex, chunkOnly) {
			var req = JSON.parse(JSON.stringify(baseRequest));
			// Backend uses page as the raw LIMIT offset.
			req.studentDetailDTO.page = startOffset + chunkIndex * ADV_STUDENT_SEARCH_CHUNK_SIZE;
			req.studentDetailDTO.pageSize = ADV_STUDENT_SEARCH_CHUNK_SIZE;
			req.chunkOnly = !!chunkOnly;
			return req;
		}

		// Fire the count query and the first chunk (table shell + first 25 rows) together.
		var metaPromise = advStudentSearchAjax(baseRequest, true).catch(function () { return null; });
		var firstChunkHtml = await advStudentSearchAjax(buildChunkRequest(0, false), false);
		if (firstChunkHtml != "" && advStudentSearchHandleError(firstChunkHtml)) {
			customLoader(false);
			return false;
		}
		$(".filter-fields").stop();
		$("#manageStudent").html(firstChunkHtml);
		// First 25 rows are visible — release the blocking loader while the rest streams in.
		customLoader(false);

		var meta = await metaPromise;
		var totalRows = (meta && meta.status == "1" && meta.totalRows != null) ? parseInt(meta.totalRows, 10) : null;
		var tableApi = $("#manageAdvanceStudentContent").length ? $("#manageAdvanceStudentContent").DataTable() : null;
		var firstChunkCount = tableApi ? tableApi.rows().count() : 0;
		if (!tableApi || firstChunkCount < ADV_STUDENT_SEARCH_CHUNK_SIZE) {
			// Everything already fits in the first chunk.
			advStudentSearchProgress(1, 1);
			return false;
		}

		// Total records still to pull after chunk 0, bounded by the exact count when we have it.
		var remaining = requestedRecords - ADV_STUDENT_SEARCH_CHUNK_SIZE;
		if (totalRows != null) {
			remaining = Math.min(remaining, Math.max(0, totalRows - startOffset - ADV_STUDENT_SEARCH_CHUNK_SIZE));
		}
		var numChunks = Math.ceil(Math.max(0, remaining) / ADV_STUDENT_SEARCH_CHUNK_SIZE);
		if (numChunks <= 0) {
			advStudentSearchProgress(1, 1);
			return false;
		}

		var totalToLoad = ADV_STUDENT_SEARCH_CHUNK_SIZE + remaining;
		var loadedRows = firstChunkCount;
		advStudentSearchProgress(loadedRows, totalToLoad);

		// Chunks arrive out of order; append strictly in index order so S.No. stays sorted.
		var pendingChunks = {};
		var nextToAppend = 0;
		function appendReadyChunks() {
			while (pendingChunks[nextToAppend] !== undefined) {
				var rows = $($.parseHTML(pendingChunks[nextToAppend])).filter("tr");
				delete pendingChunks[nextToAppend];
				nextToAppend++;
				if (rows.length) {
					loadedRows += rows.length;
					tableApi.rows.add(rows).draw(false);
				}
				advStudentSearchProgress(loadedRows, totalToLoad);
			}
		}

		await runAdvSearchWithConcurrencyLimit(numChunks, ADV_STUDENT_SEARCH_PARALLEL_CHUNKS, async function (i) {
			var html = "";
			try {
				// Chunk i here is chunk i+1 overall (chunk 0 was the shell request above).
				html = await advStudentSearchAjax(buildChunkRequest(i + 1, true), false);
			} catch (e) {
				html = "";
			}
			var msgType = String(html || "").split("|")[0];
			if (msgType == "FAILED" || msgType == "EXCEPTION" || msgType == "SESSIONOUT") {
				html = "";
			}
			pendingChunks[i] = html;
			appendReadyChunks();
			return true;
		});
		advStudentSearchProgress(1, 1);
	} catch (e) {
		console.error(e);
		customLoader(false);
	}
	return false;
}

function advanceTeacherSearch(formId, moduleId) {
	checkTextBox(formId);
	customLoader(true);
	const url = "advance-teacher-search/" + UNIQUEUUID;
	hideMessage("");
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML("dashboard", url),
		data: JSON.stringify(
			getCallRequestForadvanceTeacherSearch(formId, moduleId)
		),
		dataType: "json",
		async: true,
		success: function (data) {
			console.log(data);
			if (data.status === "success") {
				$("#manageProfileTeacherContent").show();
				let htmlContent = "";
				$.each(data.manageProfileTeacher, function (index, value) {
					htmlContent +=
						'<tr>'
						+ '<td>' + (index + 1) + '.</td>'

						+ '<td>'
						+ value.applicationNo + '<br/>'
						+ value.name
						+ '<br/>'
						+ value.emailId
						+ '<br/>'
						+ value.contactNo
						+ '<br/>'
						+ value.cityName + '/ ' + value.stateName + '/ ' + value.countryName
						+ '<br/>'
						+ value.timeZone + ' ' + value.timeOffSet
						+ '<br/>'
						+ '</td>'

						+ '<td>'
						+ value.employeeType
						+ '</td>'
						+ '<td>'
						+ (value.assignCourseList > 0
							? '<a href="javascript:void(0);" onclick="return getTeacherSubjectList(' + value.userId + ');">'
							+ '<i class="fa fa-eye"></i>'
							+ '</a>'
							: "N/A"
						)
						+ '</td>'

						+ '<td>'
						+ (value.specialization === "N/A"
							? "N/A"
							: value.specialization.split(',')
								.map(specialization => specialization.trim())
								.filter(specialization => specialization.length > 0)
								.join('<br>')
						)
						+ '</td>'

						+ '<td>'
						+ value.profileStatus
						+ '</td>'

						+ '<td style="text-align: left;">'
						+ (value.agreementUrlDownload === "N/A" && value.agreementUrlView === "N/A"
							? 'N/A'
							: (value.agreementUrlDownload !== "N/A"
								? '<a href="' + value.agreementUrlDownload + '" target="_blank">'
								+ '<i class="fa fa-download"></i>'
								+ '</a>'
								: '')
							+ (value.agreementUrlDownload !== "N/A" && value.agreementUrlView !== "N/A" ? ' | ' : '')
							+ (value.agreementUrlView !== "N/A"
								? '<a href="' + value.agreementUrlView + '" target="_blank">'
								+ '<i class="fa fa-eye"></i>'
								+ '</a>'
								: ''))
						+ '</td>'
						+ '<td>'
						+ '<div class="btn-group">'
						+ '<button type="button" class="btn btn-primary  dropdown-toggle  btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="Action"><i class="fa fa-ellipsis-v"></i></button>'
						+ '<div class="dropdown-menu" x-placement="bottom-start">'

						+ '<a href="' + value.profileView + '" target="_blank" class="dropdown-item">'
						+ '<i class="fa fa-eye">'
						+ '</i>&nbsp;View Profile'
						+ '</a>'
						+ '<a href="javascript:void(0);" class="dropdown-item" onclick="return callUserActivity(\'' + formId + '\',\'' + value.userId + '\',\'true\',\'true\',' + moduleId + ');">'
						+ '<i class="fa fa-cogs"></i>&nbsp;&nbsp;User Activity'
						+ '</a>'
						+ (value.batchReport === "N/A"
							? ""
							:
							'<a href="' + value.batchReport + '" target="_blank" class="dropdown-item">'
							+ '<i class="fa fa-eye"></i>&nbsp;View Batches'
							+ '</a>')
						+ (value.sendMail === "1" || value.sendMail === "false"
							? ""
							: '<a href="javascript:void(0);" class="dropdown-item" onclick="return sendEmailForCommon(' + value.userId + ');">'
							+ '<i class="fa fa-envelope"></i>&nbsp;&nbsp;Send Email'
							+ '</a>')
						+ '<a href="' + value.userLogUrl + '" target="_blank" class="dropdown-item">'
						+ '<i class="fa fa-eye"></i>&nbsp;Teacher Logs'
						+ '</a>'
						+ (value.spoofLink === "Y"
							? '<a href="javascript:void(0);" class="dropdown-item" onclick="return openSpoofUrlModal(\'U\',\'' + value.userId + '\',\'' + (value.name || '').replace(/'/g, "\\'") + '\',\'teacher\');">'
							+ '<i class="fa fa-eye"></i>&nbsp;View as Teacher'
							+ '</a>'
							: '')
						+ (value.meetingCount <= 0
							? ""
							: '<a href="javascript:void(0);" class="dropdown-item" onclick="showWarningMessageShow(\'Are you sure you want to re-attempt recordings?\', \'enableReattemptRecording(' + value.userId + ')\');">'
							+ '<i class="fa fa-cogs"></i>&nbsp;&nbsp;Flush Recording'
							+ '</a>')
						+ '</div>'
						+ '</div>'
						+ '</td>'

						+ '</tr>'
				});
				$("#manageProfileTeacherContent").dataTable().fnDestroy();
				$("#manageProfileTeacherContent tbody").html(htmlContent);
				$('#manageProfileTeacherContent').dataTable();
			} else {
				$("#manageProfileTeacherContent").show()
				$("#manageProfileTeacherContent tbody").html('<tr class="odd"><td valign="top" colspan="9" class="dataTables_empty">No data available in table</td></tr>')
			}
		},
	});
}

function getCallRequestForadvanceStudentSearch(formId, moduleId, themetype) {
	var request = {};
	var authentication = {};
	var studentDetailDTO = {};
	studentDetailDTO["moduleId"] = moduleId;
	studentDetailDTO["enrollType"] = $("#" + formId + " #filterEnrollType").val();
	if ($("#" + formId + " #filterEnrollType").val() == "ONE_TO_ONE_FLEX") {
		studentDetailDTO["profileFor"] = "flexStudent";
	}
	if ($("#" + formId + " #filterEnrollType").val() == "BATCH") {
		studentDetailDTO["profileFor"] = "batchStudent";
	} else {
		studentDetailDTO["profileFor"] = "student";
	}
	studentDetailDTO["timZoneFrom"] = $(
		"#" + formId + " #countryTimezoneFromId option:selected"
	).attr("data-timezone");
	studentDetailDTO["timZoneTo"] = $(
		"#" + formId + " #countryTimezoneToId option:selected"
	).attr("data-timezone");
	studentDetailDTO["studentName"] = $("#" + formId + " #studName").val();
	studentDetailDTO["studentLastName"] = $("#" + formId + " #lastName").val();
	studentDetailDTO["standardId"] = $("#" + formId + " #filterStandardId").val();
	studentDetailDTO["schoolId"] = $("#" + formId + " #schoolId").val();
	studentDetailDTO["email"] = $("#" + formId + " #emailId").val();
	studentDetailDTO["contactNo"] = $("#" + formId + " #mobileNo").val();
	studentDetailDTO["academicYear"] = $("#" + formId + " #activeSession").val();
	studentDetailDTO["countryId"] = $("#" + formId + " #countryId").val();
	studentDetailDTO["stateId"] = $("#" + formId + " #filterStateId").val();
	studentDetailDTO["cityId"] = $("#" + formId + " #filterCityId").val();
	var enrollStatus = $("#" + formId + " #filterEnrollStatus").val();
	if (Array.isArray(enrollStatus)) {
		enrollStatus = enrollStatus.join(",");
	}
	studentDetailDTO["enrollStatus"] = enrollStatus;
	studentDetailDTO["userClickFrom"] = $("#" + formId + " #userClickFrom").val();
	studentDetailDTO["lmsPlatform"] = $("#" + formId + " #filterLmsPlatform").val();
	studentDetailDTO["bookAnEnrollmentStatus"] = $("#" + formId + " #filterBookEnrollment").val();
	studentDetailDTO["page"] = $("#" + formId + " #page").val();
	studentDetailDTO["pageSize"] = $("#" + formId + " #pageSize").val();
	studentDetailDTO["applicationNo"] = $("#" + formId + " #applicationNo").val();
	studentDetailDTO["studentIdString"] = $("#" + formId + " #studentId").val();
	studentDetailDTO["instagram"] = $("#" + formId + " #instagramStatus").val();
	var profileFilterFieldId = $("#" + formId + " #filterProfileFieldId").val();
	if (profileFilterFieldId === null || profileFilterFieldId === undefined || profileFilterFieldId === "") {
		studentDetailDTO["profileFilterFieldId"] = [];
		studentDetailDTO["profileFilterValue"] = "";
	} else if (Array.isArray(profileFilterFieldId)) {
		studentDetailDTO["profileFilterFieldId"] = profileFilterFieldId;
		studentDetailDTO["profileFilterValue"] = $("#" + formId + " #filterProfileFieldValue").val();
	} else {
		studentDetailDTO["profileFilterFieldId"] = [profileFilterFieldId];
		studentDetailDTO["profileFilterValue"] = $("#" + formId + " #filterProfileFieldValue").val();
	}
	studentDetailDTO["themetype"] = themetype;
	studentDetailDTO["schoolUUID"] = SCHOOL_UUID;
	request["studentDetailDTO"] = studentDetailDTO;
	authentication["hash"] = getHash();
	authentication["userType"] = "SCHOOL";
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userId"] = USER_ID;
	request["authentication"] = authentication;
	return request;
}

function getCallRequestForadvanceTeacherSearch(formId, moduleId) {
	var request = {};
	var authentication = {};
	var teacherDetailsDTO = {};
	teacherDetailsDTO["moduleId"] = moduleId;
	// teacherDetailsDTO["assignedCourses"] = $(
	//   "#" + formId + " #filterAssignedCourses"
	// ).val();
	// if ($("#" + formId + " #filterAssignedCourses").val() == "Y") {
	//   teacherDetailsDTO["profileFor"] = "teacher";
	// }
	// else {
	//   teacherDetailsDTO["profileFor"] = "teacher";
	// }
	teacherDetailsDTO["themetype"] = "theme2";
	teacherDetailsDTO["timZoneFrom"] = $("#" + formId + " #teacherCountryTimezoneFromId option:selected").attr("data-timezone");
	teacherDetailsDTO["timZoneTo"] = $("#" + formId + " #teacherCountryTimezoneToId option:selected").attr("data-timezone");
	teacherDetailsDTO["teacherName"] = $("#" + formId + " #teacherName").val();
	teacherDetailsDTO["schoolId"] = $("#" + formId + " #schoolId").val();
	teacherDetailsDTO["email"] = $("#" + formId + " #emailId").val();
	teacherDetailsDTO["contactNo"] = $("#" + formId + " #mobileNo").val();
	teacherDetailsDTO["academicYear"] = $("#" + formId + " #activeSession").val();
	teacherDetailsDTO["countryId"] = $("#" + formId + " #teacherCountryId").val();
	teacherDetailsDTO["stateId"] = $("#" + formId + " #teacherFilterStateId").val();
	teacherDetailsDTO["cityId"] = $("#" + formId + " #teacherFilterCityId").val();
	teacherDetailsDTO["applicationNo"] = $("#" + formId + " #applicationNo").val();
	teacherDetailsDTO["enrollStatus"] = $("#" + formId + " #teacherFilterEnrollStatus").val();
	teacherDetailsDTO["employeeType"] = $("#" + formId + " #filterEmployeeType").val();
	teacherDetailsDTO["userClickFrom"] = $("#" + formId + " #userClickFrom").val();
	teacherDetailsDTO["page"] = $("#" + formId + " #page").val();
	teacherDetailsDTO["pageSize"] = $("#" + formId + " #pageSize").val();
	teacherDetailsDTO["schoolUUID"] = SCHOOL_UUID;
	request["teacherDetailsDTO"] = teacherDetailsDTO;
	authentication["hash"] = getHash();
	authentication["userType"] = "SCHOOL";
	authentication["schoolId"] = SCHOOL_ID;
	authentication["schoolUUID"] = SCHOOL_UUID;
	authentication["userId"] = USER_ID;
	request["authentication"] = authentication;
	return request;
}

function advanceStudentSearchReset(formId) {
	$("#" + formId)[0].reset();
	$("#" + formId + " #schoolId")
		.val(SCHOOL_ID)
		.trigger("change");
	$("#" + formId + " #filterEnrollStatus")
		.val("")
		.trigger("change");
	$("#" + formId + " #countryTimezoneFromId")
		.val("")
		.trigger("change");
	$("#" + formId + " #countryTimezoneToId")
		.val("")
		.trigger("change");
	$("#" + formId + " #filterStandardId")
		.val("")
		.trigger("change");
	$("#" + formId + " #studName").val("");
	$("#" + formId + " #emailId").val("");
	$("#" + formId + " #mobileNo").val("");
	$("#" + formId + " #countryId")
		.val("")
		.trigger("change");
	$("#" + formId + " #filterStateId")
		.val("")
		.trigger("change");
	$("#" + formId + " #filterCityId")
		.val("")
		.trigger("change");
	$("#" + formId + " #filterProfileFieldId")
		.val("")
		.trigger("change");
	$("#" + formId + " #filterProfileFieldValue")
		.val("")
		.trigger("change");
	getSessionMasterList(formId, 'activeSession', false);
}

function advanceTeacherSearchReset(formId) {
	$("#" + formId)[0].reset();
	$("#" + formId + " #schoolId")
		.val(SCHOOL_ID)
		.trigger("change");
	$("#" + formId + " #teacherFilterEnrollStatus").val("");
	$("#" + formId + " #filterEmployeeType").val("");
	// $("#" + formId + " #filterAssignedCourses")
	//   .val("")
	//   .trigger("change");
	$("#" + formId + " #teacherCountryTimezoneFromId")
		.val("")
		.trigger("change");
	$("#" + formId + " #teacherCountryTimezoneToId")
		.val("")
		.trigger("change");
	$("#" + formId + " #TeacherName").val("");
	$("#" + formId + " #emailId").val("");
	$("#" + formId + " #mobileNo").val("");
	$("#" + formId + " #teacherCountryId")
		.val("")
		.trigger("change");
	$("#" + formId + " #teacherFilterStateId")
		.val("")
		.trigger("change");
	$("#" + formId + " #teacherFilterCityId")
		.val("")
		.trigger("change");
}



function studentStatusUpdateWithdrawn(userId, status, rolemoduleId) {
	console.log('studentStatusUpdate 1')
	var data = {};
	data['userId'] = userId;
	data['status'] = status;
	data['sessionUserId'] = USER_ID;
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'student-withdrown-join'),
		data: JSON.stringify(data),
		dataType: 'html',
		cache: false,
		timeout: 600000,
		async: false,
		success: function (htmlContent) {
			if (htmlContent != "") {
				var stringMessage = [];
				stringMessage = htmlContent.split("|");
				if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
					if (stringMessage[0] == "SESSIONOUT") {
						redirectLoginPage();
					} else {
						showMessageTheme2(0, stringMessage[1]);
					}
				} else if (stringMessage[0] == "SUCCESS") {
					showMessageTheme2(1, stringMessage[1]);
					//setTimeout(function(){ callDashboardPageSchool(rolemoduleId,'manage-user-list','','&schoolId='+SCHOOL_ID+'&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2'); }, 1000);
				}
				return false;
			}
		}
	});
}
function openTeacherStudentPerformanceModal(moduleId, studentUserId, studentName, lmsProviderId) {
	if (moduleId && moduleId.nodeType === 1) {
		var $performanceLink = $(moduleId);
		moduleId = $performanceLink.attr("data-module-id");
		studentUserId = $performanceLink.attr("data-student-user-id");
		studentName = $performanceLink.attr("data-student-name");
		lmsProviderId = $performanceLink.attr("data-lms-provider-id");
	}
	return openManageUserStudentPerformanceModal(moduleId, studentUserId, studentName, lmsProviderId);
}
function openManageUserStudentPerformanceModal(moduleId, studentUserId, studentName, lmsProviderId) {
	if (!moduleId || !studentUserId) {
		showMessageTheme2(0, "Invalid student performance request.");
		return false;
	}

	if ($("#manageUserStudentPerformanceModal").length === 0) {
		$("body").append(getManageUserStudentPerformanceModalHtml());
	}

	$("#manageUserStudentPerformanceModal")
		.attr("data-module-id", moduleId)
		.attr("data-student-user-id", studentUserId)
		.attr("data-student-name", studentName || "")
		.attr("data-lms-provider-id", lmsProviderId || "");
	$("#manageUserStudentPerformanceModal")
		.off("hidden.bs.modal.manageUserPerformance")
		.on("hidden.bs.modal.manageUserPerformance", function () {
			$("#manageUserStudentGradeHistoryPopup").modal("hide");
			$("#manageUserStudentGradeHistoryPopup").remove();
			$("#manageUserStudentPerformanceBody").html("");
		});
	$("#manageUserStudentPerformanceModal .modal-title").text(studentName ? ("Student Performance | " + studentName) : "Student Performance");
	$("#manageUserStudentPerformanceModal").modal("show");
	manageUserStudentPerformanceRenderMain(studentUserId, lmsProviderId);
	return false;
}

function getManageUserStudentPerformanceModalHtml() {
	return `<div class="modal fade" id="manageUserStudentPerformanceModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document" style="max-width:96vw;">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white py-2">
                    <h5 class="modal-title">Student Performance</h5>
                    <button type="button" class="close text-white opacity-100" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="manageUserStudentPerformanceBody" style="max-height:85vh;overflow:auto;">
                </div>
            </div>
        </div>
    </div>`;
}

async function manageUserStudentPerformanceRenderMain(studentUserId, lmsProviderId) {
	customLoader(true);
	hideMessage('');
	$("#manageUserStudentPerformanceBody").html(`<div class="py-4 text-center">Loading...</div>`);
	try {
		var response = await manageUserStudentPerformanceFetch(studentUserId, lmsProviderId);
		var rows = manageUserStudentPerformanceMapRows(response, studentUserId + "");
		$("#manageUserStudentPerformanceBody").html(getManageUserStudentPerformanceContent(rows, lmsProviderId));
		manageUserStudentPerformanceInitDataTable();
	} catch (e) {
		$("#manageUserStudentPerformanceBody").html(`<div class="alert alert-danger mb-0">Unable to load academic performance.</div>`);
	} finally {
		customLoader(false);
	}
}

async function manageUserStudentPerformanceFetch(studentUserId, lmsProviderId) {
	var ajaxReqDetails = {
		method: "POST",
		url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-academic-performance",
		body: {
			userId: USER_ID + "",
			studentUserId: studentUserId + "",
			lmsProviderId: lmsProviderId || ""
		},
		global: true,
		showMessage: false,
		onFaildResolved: true,
		onSuccessResolved: true
	};
	return await callCommonAjax(ajaxReqDetails);
}

function manageUserStudentPerformanceMapRows(apiResponse, studentUserId) {
	var details = apiResponse && (apiResponse.details || apiResponse.data || apiResponse.response || {});
	var list = details.studentAcademicPerformances || apiResponse.studentAcademicPerformances || [];
	var rows = [];
	$.each(list || [], function (_, item) {
		rows.push({
			studentUserId: studentUserId,
			lmsEnrollmentId: item.lmsEnrollmentId || "",
			lmsCourseId: item.lmsCourseId || "",
			courseName: item.courseName || "N/A",
			scoreText: manageUserStudentPerformanceFormatPercent(item.score),
			pace: item.progressPace || "N/A",
			teacherName: item.teacherName || "N/A",
			endDate: item.endDate || "N/A",
			remainingDays: item.remainingDays || "N/A",
			pendingAssignment: item.pendingAssignment !== undefined ? item.pendingAssignment : "N/A",
			progressGradable: item.progressGradable || 0,
			progressAllActivity: item.progressAllActivity || 0,
			teacherGender: item.teacherGender || ""
		});
	});
	return rows;
}

function manageUserStudentPerformanceFormatPercent(value) {
	var percentValue = parseFloat(value || 0);
	if (isNaN(percentValue)) { return "N/A"; }
	return percentValue.toFixed(2) + "%";
}

function manageUserStudentPerformancePaceHtml(value){
    // var value = (pace || "N/A").toUpperCase();
    var textClass = "text-dark";
    var label = value || "N/A";
    var imageName = "still.png";
    var imageStyle = "width:24px;height:24px;object-fit:contain;";

    if(value === "Ahead"){
        textClass = "text-success";
        label = "Ahead";
        imageName = "forward.gif";
        imageStyle = "width:27px;height:27px;object-fit:contain;";
    }else if(value === "OnTrack"){
        textClass = "text-primary";
        label = "On Track";
        imageName = "still.png";
    }else if(value === "Behind"){
        textClass = "text-danger";
        label = "Behind";
        imageName = "behind.gif";
	}else if(value === "GettingStarted"){
		textClass = "text-primary";
        label = "Get Started";
        imageName = "still.png";
	}
    var imageUrl = PATH_FOLDER_IMAGE2 + imageName;
    return `<div class="d-flex align-items-center ${textClass}"><img src="${imageUrl}" alt="${label}" style="${imageStyle}"><span class="ml-2">${label}</span></div>`;
}

function manageUserStudentPerformanceProgressHtml(value) {
	var progressValue = parseFloat(value || 0);
	if (isNaN(progressValue)) { progressValue = 0; }
	if (progressValue < 0) { progressValue = 0; }
	if (progressValue > 100) { progressValue = 100; }
	return `<div class="d-flex align-items-center"><div class="progress mr-1" style="height:18px;min-width:130px;"><div class="progress-bar bg-primary" role="progressbar" style="width:${progressValue}%;" aria-valuenow="${progressValue}" aria-valuemin="0" aria-valuemax="100"></div></div><strong>${progressValue.toFixed(0)}%</strong></div>`;
}
function manageUserStudentPerformancePercentActivityHtml(gradablePercent, gradableDone, gradableTotal, allPercent, allDone, allTotal) {
	return `<div class="text-center d-flex align-items-start mb-1"><div class="mb-0 progress col-2 pl-0 mt-1"><div class="progress-bar bg-primary" role="progressbar" style="width:${gradablePercent}%;" aria-valuenow="${gradablePercent}" aria-valuemin="0" aria-valuemax="100"></div></div><div class="text-center">&nbsp;${gradablePercent}% of gradable activities completed (${gradableDone} of ${gradableTotal})</div></div><div class="text-center d-flex align-items-start"><div class="mb-0 progress col-2 pl-0 mt-1"><div class="progress-bar bg-primary" role="progressbar" style="width:${allPercent}%;" aria-valuenow="${allPercent}" aria-valuemin="0" aria-valuemax="100"></div></div><div class="text-center">&nbsp;${allPercent}% of all activities completed (${allDone} of ${allTotal})</div></div>`;
}

function manageUserStudentPerformanceSupportsDetailedView(lmsProviderId) {
	var providerId = parseInt(lmsProviderId, 10);
	return providerId === 36 || providerId === 37 || providerId === 38;
}

function getManageUserStudentPerformanceContent(rows, lmsProviderId) {
	var supportsDetailedView = manageUserStudentPerformanceSupportsDetailedView(lmsProviderId);
	return `<div class="main-card card rounded-10 border py-3">
	        <div class="card-body p-0">
	            <div class="d-flex flex-wrap align-items-center justify-content-between">
	                <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Academic Performance</h4>
	            </div>
            <div class="table-responsive">
                <table class="table font-12 nowrap dt-responsive" id="manageUserStudentAcademicPerformanceTable" style="width:100%;">
	                    <thead class="bg-primary text-white">
	                        <tr>
	                            <th class="pl-3">Course Name</th>
	                            <th>Score</th>
	                            ${supportsDetailedView ? "<th>Pace</th>" : ""}
	                            <th>Teacher Name</th>
	                            <th>End Date</th>
	                            <th>Remaining Days</th>
	                            ${supportsDetailedView ? "<th>Pending Assignment</th>" : ""}
	                            ${supportsDetailedView ? "<th>Progress (gradable)</th>" : ""}
	                            ${supportsDetailedView ? "<th>Progress (all activities)</th>" : ""}
	                        </tr>
	                    </thead>
	                    <tbody>${getManageUserStudentPerformanceRowsHtml(rows, lmsProviderId)}</tbody>
	                </table>
	            </div>
	        </div>
	    </div>`;
}

function getManageUserStudentPerformanceRowsHtml(rows, lmsProviderId) {
	var html = "";
	var supportsDetailedView = manageUserStudentPerformanceSupportsDetailedView(lmsProviderId);
	$.each(rows || [], function (_, row) {
		var courseText = manageUserStudentPerformanceEscapeHtml(row.courseName || "N/A");
		if (supportsDetailedView && row.lmsEnrollmentId && row.lmsCourseId) {
			courseText = `<a href="javascript:void(0)" class="text-primary" onclick="manageUserStudentPerformanceOpenProgressDetail('${row.studentUserId}','${row.lmsEnrollmentId}','${row.lmsCourseId}')">${courseText}</a>`;
		}
		html += `<tr>
	            <td class="pl-3">${courseText}</td>
	            <td>${row.scoreText}</td>
	            ${supportsDetailedView ? `<td>${manageUserStudentPerformancePaceHtml(row.pace)}</td>` : ""}
				<td>${getSalutationByGender(row.teacherGender)} ${manageUserStudentPerformanceEscapeHtml(row.teacherName)}</td>
	            <td>${manageUserStudentPerformanceEscapeHtml(row.endDate)}</td>
	            <td>${manageUserStudentPerformanceEscapeHtml(row.remainingDays)}</td>
	            ${supportsDetailedView ? `<td>${manageUserStudentPerformanceEscapeHtml(row.pendingAssignment + "")}</td>` : ""}
	            ${supportsDetailedView ? `<td>${manageUserStudentPerformanceProgressHtml(row.progressGradable)}</td>` : ""}
	            ${supportsDetailedView ? `<td>${manageUserStudentPerformanceProgressHtml(row.progressAllActivity)}</td>` : ""}
	        </tr>`;
	});
	if (!html) {
		html = `<tr><td colspan="${supportsDetailedView ? 9 : 5}" class="text-center">No academic performance found</td></tr>`;
	}
	return html;
}

function manageUserStudentPerformanceInitDataTable() {
	if (!$.fn.DataTable) { return; }
	if ($.fn.DataTable.isDataTable('#manageUserStudentAcademicPerformanceTable')) {
		$('#manageUserStudentAcademicPerformanceTable').DataTable().destroy();
	}
	if ($("#manageUserStudentAcademicPerformanceTable tbody tr").length === 0 || $("#manageUserStudentAcademicPerformanceTable tbody td[colspan]").length > 0) {
		return;
	}
	$('#manageUserStudentAcademicPerformanceTable').DataTable({
		paging: true,
		searching: false,
		ordering: false,
		info: true,
		pageLength: 10,
		lengthChange: false,
		autoWidth: false,
		dom: 't<"d-flex flex-wrap align-items-center justify-content-between px-3 py-2"i p>',
		language: { info: "Showing _START_ to _END_ of _TOTAL_ entries", paginate: { previous: "Previous", next: "Next" } }
	});
}

function manageUserStudentPerformanceOpenProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId) {
	if (!studentUserId || !lmsEnrollmentId || !lmsCourseId) { return; }
	$("#manageUserStudentPerformanceBody").html(getManageUserStudentPerformanceDetailContent(studentUserId));
	manageUserStudentPerformanceAttachGradeHistoryModal();
	manageUserStudentPerformanceLoadProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId);
}

function manageUserStudentPerformanceAttachGradeHistoryModal() {
	var $gradeHistoryModal = $("#manageUserStudentPerformanceBody #manageUserStudentGradeHistoryPopup");
	if ($gradeHistoryModal.length === 0) { return; }

	$("#manageUserStudentGradeHistoryPopup").remove();
	$("body").append($gradeHistoryModal);
	$gradeHistoryModal
		.off("hidden.bs.modal.manageUserGradeHistory")
		.on("hidden.bs.modal.manageUserGradeHistory", function () {
			if ($("#manageUserStudentPerformanceModal").hasClass("show")) {
				$("body").addClass("modal-open");
			}
		});
}

function getManageUserStudentPerformanceDetailContent(studentUserId) {
	var lmsProviderId = $("#manageUserStudentPerformanceModal").attr("data-lms-provider-id") || "";
	return `<div class="full my-2 d-flex justify-content-end">
	            <a href="javascript:void(0)" onclick="manageUserStudentPerformanceRenderMain('${studentUserId}','${lmsProviderId}')" class="btn btn-dark rounded">
	                <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back
	            </a>
	        </div>
        <div class="main-card mb-3 card body-tabs-shadow">
            <div class="card-body">
                <div class="mb-2"><b>Course:</b> <span id="manageUserStudentAcademicPerformanceCourseName">N/A</span></div>
                <div class="mb-2"><b>Current Overall Score:</b> <span id="manageUserStudentAcademicPerformanceScore">N/A</span></div>
                <div class="mb-2"><b>Current Overall Grade:</b> <span id="manageUserStudentAcademicPerformanceGradeLetter">N/A</span></div>
                <div class="mb-2"><b>Duration:</b> <span id="manageUserStudentAcademicPerformanceScheduleDate">N/A</span></div>
                <div id="manageUserStudentAcademicPerformancePercentActivity" class="mb-3"></div>
                <div class="main-card mb-3" style="overflow-x:auto;">
                    <table class="details-table table table-striped table-bordered dt-responsive" style="min-width:980px;width:100%;">
                        <thead><tr><th>Total Assignments</th><th>Excused</th><th>Submitted</th><th>Upcoming</th><th>Pending</th><th>Passed</th><th>Failed</th><th>Submitted BEFORE TIME</th><th>Submitted ON TIME</th><th>Submitted LATE</th></tr></thead>
                        <tbody><tr><td id="manageUserTotalAssign">0</td><td id="excusedAssign">0</td><td id="manageUserSubmiteAssign">0</td><td id="manageUserUpcomingAssign">0</td><td id="manageUserPendingAssign">0</td><td id="manageUserPassesAssign">0</td><td id="manageUserFailedAssign">0</td><td id="manageUserSubmitBeforeTimeAssign">0</td><td id="manageUserSubmitOntimeAssign">0</td><td id="manageUserSubmitLateAssign">0</td></tr></tbody>
                    </table>
                </div>
                <div class="main-card mb-3" style="overflow-x:auto;">
                    <table class="details-table table table-striped table-bordered dt-responsive" style="min-width:980px;width:100%;">
                        <thead><tr><th>Activity Name</th><th>Due Date</th><th>Submitted Date</th><th>Time Spent (hh:mm:ss)</th><th>Submited Status</th><th>Score</th><th>Grade</th><th>Detailed Assignment Status</th><th>Status</th></tr></thead>
                        <tbody id="manageUserStudentLmsProgress"></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="manageUserStudentGradeHistoryPopup" class="modal fade" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-xl box-shadow-none" role="document">
                <div class="modal-content border-0">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Grade History</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    </div>
                    <div class="modal-body">
                        <table class="details-table table table-striped table-bordered dt-responsive" style="min-width:980px;width:100%;">
                            <thead><tr><th>Date</th><th>Visits</th><th>Time</th><th>Score</th><th>By</th></tr></thead>
                            <tbody id="manageUserStudentGradeHistory"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
}

function manageUserStudentPerformanceLoadProgressDetail(studentUserId, lmsEnrollmentId, lmsCourseId) {
	customLoader(true);
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'get-student-progress-report-detail'),
		data: JSON.stringify({ studentUserId: studentUserId, lmsUserId: lmsEnrollmentId, entityId: lmsCourseId }),
		dataType: "json",
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data && data.code === "SUCCESS") {
				manageUserStudentPerformanceBindProgressDetailData(data);
			} else {
				showMessageTheme2(0, data && data.message ? data.message : "Unable to load course progress detail.");
			}
			customLoader(false);
		},
		error: function () {
			customLoader(false);
			showMessageTheme2(0, "Unable to load course progress detail.");
		}
	});
}

function manageUserStudentPerformanceBindProgressDetailData(data){
    $("#manageUserTotalAssign").html(data.totalAssignment != null ? data.totalAssignment : 0);
	$("#excusedAssign").html(data.excusedAssign != null ? data.excusedAssign : 0);
    $("#manageUserSubmiteAssign").html(data.submiteAssign != null ? data.submiteAssign : 0);
    $("#manageUserUpcomingAssign").html(data.upcomingAssign != null ? data.upcomingAssign : 0);
    $("#manageUserPendingAssign").html(data.pendingAssign != null ? data.pendingAssign : 0);
    $("#manageUserPassesAssign").html(data.passesAssign != null ? data.passesAssign : 0);
    $("#manageUserFailedAssign").html(data.failedAssign != null ? data.failedAssign : 0);
    $("#manageUserSubmitBeforeTimeAssign").html(data.submitBeforeTimeAssign != null ? data.submitBeforeTimeAssign : 0);
    $("#manageUserSubmitLateAssign").html(data.submitLateAssign != null ? data.submitLateAssign : 0);
    $("#manageUserSubmitOntimeAssign").html(data.submitOntimeAssign != null ? data.submitOntimeAssign : 0);

	var enrollment = (((data.response || {}).enrollments || {}).enrollment || [])[0] || {};
	var entity = enrollment.entity || {};
	$("#manageUserStudentAcademicPerformanceCourseName").html(entity.title || "N/A");
	$("#manageUserStudentAcademicPerformanceScheduleDate").html((enrollment.startdate || "N/A") + " - " + (enrollment.enddate || "N/A"));
	var grades = enrollment.grades || {};
	$("#manageUserStudentAcademicPerformanceScore").html((grades.percentage != null ? grades.percentage : 0) + "%");
	$("#manageUserStudentAcademicPerformanceGradeLetter").html(grades.letter || "N/A");

	$("#manageUserStudentAcademicPerformancePercentActivity").html(manageUserStudentPerformancePercentActivityHtml(
		grades.complete != null ? grades.complete : 0,
		grades.completedgradable != null ? grades.completedgradable : 0,
		grades.gradable != null ? grades.gradable : 0,
		grades.completeall != null ? grades.completeall : 0,
		grades.completed != null ? grades.completed : 0,
		grades.completable != null ? grades.completable : 0
	));

    $("#manageUserStudentAcademicPerformanceScore").html((grades.percentage != null ? grades.percentage : 0) + "%");
    $("#manageUserStudentAcademicPerformanceGradeLetter").html(grades.letter || "N/A");

    $("#manageUserStudentAcademicPerformancePercentActivity").html(manageUserStudentPerformancePercentActivityHtml(
            grades.complete != null ? grades.complete : 0,
            grades.completedgradable != null ? grades.completedgradable : 0,
            grades.gradable != null ? grades.gradable : 0,
            grades.completeall != null ? grades.completeall : 0,
            grades.completed != null ? grades.completed : 0,
            grades.completable != null ? grades.completable : 0
        ));

    var items = ((grades.items || {}).item) || [];
    if(!$.isArray(items) || items.length === 0){
        $("#manageUserStudentLmsProgress").html(`<tr><td colspan="9" class="text-center">No record found</td></tr>`);
        return;
    }
    var html = "";
    $.each(items, function(_, item){
        var submitStatus = item.submissionStatus ? (item.submissionStatus + (item.lateTime ? (" (" + item.lateTime + ")") : "")) : "";
        var status = (item.status || item.status || "").toUpperCase();
        var statusIcon = "";
        if(status === "SUBMITTED"){
            statusIcon = `<i class="fa fa-check text-success"></i>`;
        }else if(status === "EXCUSED"){
            statusIcon = `<i class="fa fa-times"></i>`;
        }
        html += `<tr>
            <td class="text-left">${manageUserStudentPerformanceEscapeHtml(item.title || "N/A")}</td>
            <td>${item.duedate || "N/A"}</td>
            <td class="${item.colorDueText || ''}">${item.submitteddate || "N/A"}</td>
            <td>${item.unitTimeSpent || "N/A"}</td>
            <td class="${item.colorDueText || ''}">${manageUserStudentPerformanceEscapeHtml(submitStatus || "N/A")}</td>
            <td class="${item.colorScoreText || ''}">${item.unitPercent ? (item.unitPercent + "%") : ""}</td>
            <td>${item.letter || ""}</td>
            <td>${submitStatus ? `<a href="javascript:void(0);" onclick="manageUserStudentPerformanceOpenGradeHistoryPopup('${enrollment.id || ""}','${item.itemid || ""}')"><i class="fa fa-eye"></i>&nbsp;View</a>` : ""}</td>
            <td class="text-center">${statusIcon}</td>
        </tr>`;
	});
	$("#manageUserStudentLmsProgress").html(html);
}

function manageUserStudentPerformanceOpenGradeHistoryPopup(enrollId, itemId) {
	if (!enrollId || !itemId) { return; }
	$("#manageUserStudentGradeHistoryPopup").modal("show");
	manageUserStudentPerformanceLoadGradeHistory(enrollId, itemId);
}

function manageUserStudentPerformanceLoadGradeHistory(enrollId, itemId) {
	customLoader(true);
	hideMessage('');
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: getURLForHTML('dashboard', 'get-progress-report-grade-history'),
		data: JSON.stringify({ itemId: itemId, enrollId: enrollId }),
		dataType: "json",
		success: function (data) {
			var grades = data && data.response ? data.response.grades : null;
			var gradeList = grades && grades.grade ? grades.grade : [];
			if (!$.isArray(gradeList) || gradeList.length === 0) {
				$("#manageUserStudentGradeHistory").html(`<tr><td colspan="5" class="text-center">No Record</td></tr>`);
				customLoader(false);
				return;
			}
			var html = "";
			$.each(gradeList, function (_, grade) {
				var firstName = grade.user && grade.user.firstname ? grade.user.firstname : "";
				var lastName = grade.user && grade.user.lastname ? grade.user.lastname : "";
				html += `<tr>
                    <td class="text-left">${grade.lastactivitydate || "-"}</td>
                    <td>${grade.attempts || 0}</td>
                    <td>${grade.expTime || "N/A"}</td>
                    <td>${grade.achieved != null ? grade.achieved : "0"}/${grade.possible != null ? grade.possible : "0"} <span class="text-success">${grade.percent || "0"}</span></td>
                    <td>${manageUserStudentPerformanceEscapeHtml((firstName + " " + lastName).trim())}</td>
                </tr>`;
			});
			$("#manageUserStudentGradeHistory").html(html);
			customLoader(false);
		},
		error: function () {
			customLoader(false);
			$("#manageUserStudentGradeHistory").html(`<tr><td colspan="5" class="text-center">No Record</td></tr>`);
			showMessageTheme2(0, "Unable to load grade history.");
		}
	});
}

function manageUserStudentPerformanceEscapeHtml(value) {
	if (value === undefined || value === null) { return ""; }
	return (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
}


/* ---- Inactive Reason Modal for Student Block / Withdraw ---- */
function openStudentInactiveReasonModal(userId, status, roleModuleId) {
    if ($('#studentInactiveReasonModal').length === 0) {
        $('body').append(buildStudentInactiveReasonModalHtml());
        $('#studentInactiveReasonModal #studentInactiveReasonSelect').on('change', function () {
            if ($(this).find('option:selected').text().trim() === 'Other') {
                $('#studentInactiveReasonModal #studentInactiveOtherGroup').show();
            } else {
                $('#studentInactiveReasonModal #studentInactiveOtherGroup').hide();
                $('#studentInactiveReasonModal #studentInactiveOtherText').val('');
            }
        });
        $('#studentInactiveReasonModal #confirmStudentInactiveBtn').on('click', function () {
            var reasonId = $('#studentInactiveReasonModal #studentInactiveReasonSelect').val();
            if (!reasonId || reasonId === '0') {
                showMessageTheme2(0, 'Please select a reason.');
                return false;
            }
            var otherReason = '';
            if ($('#studentInactiveReasonModal #studentInactiveReasonSelect option:selected').text().trim() === 'Other') {
                otherReason = $.trim($('#studentInactiveReasonModal #studentInactiveOtherText').val());
                if (!otherReason) {
                    showMessageTheme2(0, 'Please enter a reason in the Other Reason field.');
                    return false;
                }
            }
            var uid = $('#studentInactiveReasonModal').data('userId');
            var st  = $('#studentInactiveReasonModal').data('status');
            var rmod = $('#studentInactiveReasonModal').data('roleModuleId');
            $('#studentInactiveReasonModal').modal('hide');
            callStudentStatusWithReason(uid, st, rmod, reasonId, otherReason);
        });
    }
    $('#studentInactiveReasonModal').data('userId', userId).data('status', status).data('roleModuleId', roleModuleId);
    $('#studentInactiveReasonModal #studentInactiveReasonSelect').val('0');
    $('#studentInactiveReasonModal #studentInactiveOtherGroup').hide();
    $('#studentInactiveReasonModal #studentInactiveOtherText').val('');
    $.ajax({
        type: 'GET', url: getURLFor('dashboard', 'inactive-reasons'), dataType: 'json', cache: false, timeout: 30000,
        success: function (data) {
            var sel = $('#studentInactiveReasonModal #studentInactiveReasonSelect');
            sel.find('option:not(:first)').remove();
            if (data && data.reasonsList) {
                $.each(data.reasonsList, function (i, r) { sel.append('<option value="' + r.id + '">' + r.reason + '</option>'); });
            }
            $('#studentInactiveReasonModal').modal('show');
        },
        error: function () { showMessageTheme2(0, 'Failed to load reasons. Please try again.'); }
    });
    return false;
}

function callStudentStatusWithReason(userId, status, roleModuleId, inactiveReasonId, otherReason) {
    var data = {};
    data['userId'] = userId;
    data['status'] = status;
    data['inactiveReasonId'] = inactiveReasonId;
    data['otherReason'] = otherReason;
    data['sessionUserId'] = USER_ID;
    $.ajax({
        type: 'POST', contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'student-withdrown-join'),
        data: JSON.stringify(data), dataType: 'html', cache: false, timeout: 600000,
        success: function (htmlContent) {
            if (htmlContent !== '') {
                var parts = htmlContent.split('|');
                if (parts[0] === 'SESSIONOUT') { redirectLoginPage(); }
                else if (parts[0] === 'FAILED' || parts[0] === 'EXCEPTION') { showMessageTheme2(0, parts[1]); }
                else if (parts[0] === 'SUCCESS') {
                    showMessageTheme2(1, parts[1]);
                    setTimeout(function () {
                        callDashboardPageSchool(roleModuleId, 'manage-user-list', '', '&schoolId=' + SCHOOL_ID + '&userClickFrom=list&registrationType=ONE_TO_ONE&themeType=theme2');
                    }, 1000);
                }
            }
        }
    });
}

function buildStudentInactiveReasonModalHtml() {
    return '<div id="studentInactiveReasonModal" class="modal fade" role="dialog">' +
        '<div class="modal-dialog"><div class="modal-content modal-md">' +
        '<div class="modal-header primary-bg white-txt-color">' +
        '<h5 class="modal-title" style="color:white;"><strong>Select Reason</strong></h5>' +
        '<button type="button" class="close white-txt-color" data-dismiss="modal" style="color:#fff;opacity:1;">&times;</button></div>' +
        '<div class="modal-body">' +
        '<div class="form-group"><label>Reason <span class="text-danger">*</span></label>' +
        '<select id="studentInactiveReasonSelect" class="form-control"><option value="0">-- Select Reason --</option></select></div>' +
        '<div id="studentInactiveOtherGroup" class="form-group" style="display:none;">' +
        '<label>Other Reason <span class="text-danger">*</span></label>' +
        '<textarea id="studentInactiveOtherText" class="form-control" rows="3" maxlength="500" placeholder="Enter reason..."></textarea></div></div>' +
        '<div class="modal-footer" style="text-align:center;">' +
        '<button type="button" class="btn btn-danger" id="confirmStudentInactiveBtn">Confirm</button></div>' +
        '</div></div></div>';
}

/* ---------------------------------------------------------------------------
 * Manage Email - admin opt-out of re-enrollment reminder emails for a student.
 * ------------------------------------------------------------------------- */
function getManageEmailModalHtml() {
	return '<div class="modal fade" id="manageEmailModal" tabindex="-1" role="dialog" aria-hidden="true">' +
		'<div class="modal-dialog" role="document">' +
		'<div class="modal-content">' +
		'<div class="modal-header bg-primary text-white py-2">' +
		'<h5 class="modal-title">Manage Email</h5>' +
		'<button type="button" class="close text-white" data-dismiss="modal" style="opacity:1;color:#fff;"><span aria-hidden="true">&times;</span></button>' +
		'</div>' +
		'<div class="modal-body">' +
		'<p class="mb-2" id="manageEmailStudentName" style="font-weight:600;"></p>' +
		'<div class="custom-control custom-switch">' +
		'<input type="checkbox" class="custom-control-input" id="reenrollmentEmailOptOut">' +
		'<label class="custom-control-label" for="reenrollmentEmailOptOut">Stop re-enrollment reminder emails for this student</label>' +
		'</div>' +
		'<small class="text-muted d-block mt-2">When enabled, the student and parent will no longer receive re-enrollment reminder emails.</small>' +
		'</div>' +
		'<div class="modal-footer" style="text-align:center;">' +
		'<button type="button" class="btn btn-primary" id="saveManageEmailBtn">Save</button>' +
		'</div>' +
		'</div></div></div>';
}

function openManageEmailModal(userId, studentName) {
	if (!userId) {
		showMessageTheme2(0, "Invalid student.");
		return false;
	}
	if ($("#manageEmailModal").length === 0) {
		$("body").append(getManageEmailModalHtml());
	}
	$("#manageEmailStudentName").text(studentName ? studentName : "");
	$("#reenrollmentEmailOptOut").prop("checked", false).prop("disabled", true);
	$("#manageEmailModal").data("user-id", userId);
	$("#manageEmailModal").modal("show");

	$.ajax({
		type: "GET",
		url: CONTEXT_PATH + SCHOOL_UUID + "/dashboard/reenrollment-email-status/" + UNIQUEUUID + "?userId=" + userId,
		dataType: "json",
		cache: false,
		success: function (res) {
			if (res && res.status === "session_out") {
				redirectLoginPage();
				return;
			}
			if (res && res.status === "success") {
				$("#reenrollmentEmailOptOut").prop("checked", res.optOut === "Y").prop("disabled", false);
			} else {
				showMessageTheme2(0, "Unable to load email preference.");
			}
		},
		error: function () {
			showMessageTheme2(0, "Unable to load email preference.");
		}
	});
	return false;
}

$(document).on("click", "#saveManageEmailBtn", function () {
	var userId = $("#manageEmailModal").data("user-id");
	var optOut = $("#reenrollmentEmailOptOut").is(":checked") ? "Y" : "N";
	$.ajax({
		type: "POST",
		url: CONTEXT_PATH + SCHOOL_UUID + "/dashboard/reenrollment-email-optout/" + UNIQUEUUID,
		data: { userId: userId, optOut: optOut },
		dataType: "json",
		cache: false,
		success: function (res) {
			if (res && res.status === "session_out") {
				redirectLoginPage();
				return;
			}
			if (res && res.status === "success") {
				showMessageTheme2(1, "Email preference updated successfully.");
				$("#manageEmailModal").modal("hide");
			} else {
				showMessageTheme2(0, (res && res.message) ? res.message : "Failed to update email preference.");
			}
		},
		error: function () {
			showMessageTheme2(0, "Failed to update email preference.");
		}
	});
});
