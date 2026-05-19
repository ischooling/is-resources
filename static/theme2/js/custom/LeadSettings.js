



function saveCountryRightTime(righttimecallid, callType) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['righttimecallid']=righttimecallid;
	data['callType']=callType;
	data['countryId']=$("#countryId").val();;
	data['fromTime']=$(".fromTime").val();
	data['toTime']=$(".toTime").val();
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'save-country-righttime'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    showMessageTheme2(1, data['message']);
					getCountryRightTimeList(OBJECT_RIGHTS);
                }
                
			}
	   });
   }

function getCountryRightTimeList(objectRights) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'country-righttime-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				console.log(data)
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    //showMessageTheme2(1, data['message']);
					var html=getListOfCountryRightTimeCall(data.countryCallTimeList, objectRights);
					$("#countryRightCallList").html(html);

					$("#countryId").select2({
						theme:"bootstrap4",
						dropdownParent:"#country-time-list"
					});

					$(".fromTime").select2({
						theme:"bootstrap4",
						dropdownParent:"#country-time-list"
					});

					$(".toTime").select2({
						theme:"bootstrap4",
						dropdownParent:"#country-time-list"
					});

					callPCountries('country-time-list', 0, 'countryId',0);
					$("#country-time-list #countryId").val(0).trigger('change')
                }
                
			}
	   });
   }

   function getListOfCountryRightTimeCall(countryRightCallList, objectRights){
	var timeslotlist=objectRights.timeslotlist;
	var preStartTime=objectRights.leadRightTimeCall.split('-')[0];
	var preEndTime=objectRights.leadRightTimeCall.split('-')[1];
	var html=`<tr>
				<td>1</td>
				<td>
					<select name="countryId" id="countryId" class="form-control"></select>
				</td>
				<td>
					<div class="my-1 mx-0 row align-items-center justify-content-sm-start available-dropdown-Wrapper justify-content-around">
						<div class="flex-grow-1 flex-sm-grow-0">
							<select class="form-control font-12 fromTime">
								<option value="">Start Time</option>`;
								if(timeslotlist.length>0){
									for (let i = 0; i < timeslotlist.length; i++) {
										const timeopt = timeslotlist[i];
										var startTime=convertTo24Hour(timeopt);
										var strSelect = (preStartTime==startTime)?'selected':'';
										html+=`<option value="${startTime}" ${strSelect}>${timeopt}</option>`;
									}
								}
							html+=`</select>
						</div>-
						<div class="flex-grow-1 flex-sm-grow-0"> 
							<select class="form-control font-12 toTime">
								<option value="">End Time</option>`;
								if(timeslotlist.length>0){
									for (let i = 0; i < timeslotlist.length; i++) {
										const timeopt = timeslotlist[i];
										var startTime=convertTo24Hour(timeopt);
										var strSelect = (preEndTime==startTime)?'selected':'';
										html+=`<option value="${startTime}" ${strSelect}>${timeopt}</option>`;
									}
								}
							html+=`</select>
						</div>
					</div>
				</td>
				<td><a href="javascript:void(0)" class="btn btn-lg btn-outline-primary btn-sm mr-2 saveCountryTimeBtn" onclick="saveCountryRightTime();" style="line-height:0;"><i class="icon ion-android-add" style="font-size:15px;line-height:13px"></i><span class="d-md-none">&nbsp; Add</span></a></td>
			</tr>`;
			if(countryRightCallList.length>0){
				var i=2;
				for (let j = 0; j < countryRightCallList.length; j++) {
					const rightCall = countryRightCallList[j];
					html+=`<tr>
						<td>${i++}</td>
						<td class="text-center bold">${rightCall.countryName}</td>
						<td class="text-center bold">${rightCall.startCall} - ${rightCall.endCall}</td>
						<td><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="return showDeleteCountryRightTimeModelFunction('saveCountryRightTime(\\\'${rightCall.righttimecallid}\\\',\\\'delete\\\')','${rightCall.countryName}','${rightCall.startCall} - ${rightCall.endCall}')"><i class="fa fa-trash" aria-hidden="true" style="font-size:16px;margin-bottom:4px;padding:4px;"></i></a></td>
						</tr>`;
				}
			}
			
			return html;
   }

   function showDeleteCountryRightTimeModelFunction(functionName,countryName,rightTimeTocall) {
	functionName = "$('#discardCountryRightTime').modal('hide');" + functionName + ";";
	$("#discardLeadWarningYes").attr("onclick", functionName);
	$("#countryName").html(countryName);
	$("#rightTimeTocall").html(rightTimeTocall);
	$("#discardCountryRightTime").modal("show");
}


function updatePriority(priorityId) {
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['priorityId']=priorityId;
	data['minRange']=$("#minRange_"+priorityId).val();
	data['maxRange']=$("#maxRange_"+priorityId).val();
	data['leadCateUnit']=$("#leadCateUnit_"+priorityId).val();

	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'save-lead-priority'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    showMessageTheme2(1, data['message']);
					var priorityList = data.priorityList;
					html='';
					if(priorityList!=null && priorityList.length>0){
						var i=1;
						for (let k = 0; k < priorityList.length; k++) {
							const priority = priorityList[k];
							html+=`<tr>
									<td>${i++}</td>
									<td>${priority.priority}</td>
									<td><input type="text" class="form-control form-control-sm" name="minRange" id="minRange_${priority.priorityId}"  value="${priority.minRange}"/></td>
									<td><input type="text" class="form-control form-control-sm" name="maxRange" id="maxRange_${priority.priorityId}" value="${priority.maxRange}"/></td>
									<td>
										<select class="form-control form-control-sm" name="leadCateUnit" id="leadCateUnit_${priority.priorityId}">
											<option value="per" ${priority.rangeUnit=='per'?'selected':''}>%</option>
											<option value="price" ${priority.rangeUnit=='price'?'selected':''}>Price</option>
										</select>
									</td>
									<td><a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Discard" onclick="return updatePriority('${priority.priorityId}')">Update</a></td>
								</tr>`;
						}
						$("#priority-list").html(html);
					}
                }
			}
	   });
   }

var AI_CALL_COUNTRIES_DATA = []; // {key: id, value: name} — loaded from master API

function getAICallScheduleList() {
	$('#ai-call-schedule-list').html('<div class="text-center text-muted py-3">Loading...</div>');
	var d = {}; d['schoolId']=SCHOOL_ID; d['userId']=USER_ID;
	// Step 1: load countries master
	$.ajax({
		type:'POST', contentType:APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(null, 'COUNTRIES-LIST', null)),
		dataType:'json',
		success: function(mResp) {
			if (mResp && mResp['mastersData'] && mResp['mastersData']['countries']) {
				AI_CALL_COUNTRIES_DATA = mResp['mastersData']['countries'];
			}
			// Step 2: load master toggle
			$.ajax({
				type:'POST', contentType:APPLICATION_JSON_VALUE,
				url: getURLForHTML('dashboard', 'get-ai-call-master-setting'),
				data: JSON.stringify(d), dataType:'json',
				success: function(tResp) {
					var enabled = (tResp && tResp['enabled']) ? tResp['enabled'] : 'Y';
					renderAICallMasterToggle(enabled);
					// Step 3: load schedule rows
					$.ajax({
						type:'POST', contentType:APPLICATION_JSON_VALUE,
						url: getURLForHTML('dashboard', 'get-ai-call-schedule'),
						data: JSON.stringify(d), dataType:'json',
						success: function(resp) {
							if (resp['status'] == '0' || resp['status'] == '2') {
								showMessageTheme2(0, resp['message']);
							} else {
								renderAICallScheduleRows(resp['dataList'] || []);
							}
						}
					});
				}
			});
		}
	});
}

function renderAICallMasterToggle(enabled) {
	var isOn = enabled === 'Y';
	var html = '<div class="card mb-3 border-'+(isOn?'success':'danger')+'" id="ai-call-master-toggle-card">'
		+ '<div class="card-body py-2">'
		+ '<div class="d-flex align-items-center justify-content-between">'
		+ '<div>'
		+ '<h6 class="mb-0 text-'+(isOn?'success':'danger')+'">'
		+ '<i class="fa fa-'+(isOn?'check-circle':'times-circle')+' mr-1"></i>'
		+ 'AI Call Rules — <strong>'+(isOn?'ACTIVE':'DISABLED')+'</strong>'
		+ '</h6>'
		+ '<small class="text-muted">Master switch — OFF karne se saare rules disable ho jayenge</small>'
		+ '</div>'
		+ '<div class="custom-control custom-switch" style="transform:scale(1.4);transform-origin:right center;">'
		+ '<input type="checkbox" class="custom-control-input" id="aiCallMasterSwitch" '+(isOn?'checked':'')+' onchange="toggleAICallMaster(this)">'
		+ '<label class="custom-control-label" for="aiCallMasterSwitch"></label>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
	// Prepend before ai-call-schedule-list
	$('#ai-call-master-toggle-card').remove();
	$('#ai-call-schedule-list').before(html);
}

function toggleAICallMaster(checkbox) {
	var enabled = checkbox.checked ? 'Y' : 'N';
	var d={}; d['schoolId']=SCHOOL_ID; d['userId']=USER_ID; d['enabled']=enabled;
	$.ajax({
		type:'POST', contentType:APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'save-ai-call-master-setting'),
		data: JSON.stringify(d), dataType:'json',
		success: function(resp) {
			if (resp['status'] == '0' || resp['status'] == '2') {
				checkbox.checked = !checkbox.checked; // revert on fail
				showMessageTheme2(0, resp['message'] || 'Failed to save');
			} else {
				renderAICallMasterToggle(enabled);
				showMessageTheme2(1, enabled === 'Y' ? 'AI Call Rules activated' : 'AI Call Rules disabled');
			}
		}
	});
}

function renderAICallScheduleRows(list) {
	var html = '';
	var allRow = null;
	var otherRows = [];
	if (list && list.length > 0) {
		// Keep only the latest row per countryId (highest id = most recent save)
		var countryMap = {};
		list.forEach(function(row) {
			var cid = parseInt(row.countryId) || 0;
			if (!countryMap[cid] || parseInt(row.id) > parseInt(countryMap[cid].id)) {
				countryMap[cid] = row;
			}
		});
		Object.keys(countryMap).forEach(function(cid) {
			var row = countryMap[cid];
			if (parseInt(cid) === 0) { allRow = row; } else { otherRows.push(row); }
		});
	}
	var allActiveDays = allRow ? (function(){ try{ return JSON.parse(allRow.activeDays||'[]'); }catch(e){ return ['Mon','Tue','Wed','Thu','Fri']; } })() : ['Mon','Tue','Wed','Thu','Fri'];
	var allStartTimes = allRow ? parseTimeArray(allRow.startTime, '09:00') : ['09:00'];
	var allEndTimes   = allRow ? parseTimeArray(allRow.endTime,   '17:00') : ['17:00'];
	var allExclude    = allRow ? parseJsonArr(allRow.excludeCountries) : [];
	// Exclude Countries - top section only, linked to ALL row
	html += buildAIExcludeSection(allExclude);
	html += buildAICallRow(allRow ? allRow.id : null, 0, allStartTimes, allEndTimes, allActiveDays, true);
	otherRows.forEach(function(row) {
		var activeDaysArr = [];
		try { activeDaysArr = JSON.parse(row.activeDays || '[]'); } catch(e) {}
		html += buildAICallRow(row.id, parseInt(row.countryId)||0, parseTimeArray(row.startTime,'09:00'), parseTimeArray(row.endTime,'17:00'), activeDaysArr, false);
	});
	$('#ai-call-schedule-list').html(html);
	initAICountrySelect2();
}

function initAICountrySelect2() {
	$('#ai-call-schedule-list .ai-country:not([disabled])').each(function() {
		if (!$(this).hasClass('select2-hidden-accessible')) {
			$(this).select2({
				theme: 'bootstrap4',
				dropdownParent: $('#ai-call-schedule-list'),
				placeholder: 'Select Country',
				allowClear: false,
				width: '100%'
			});
		}
	});
}

function parseJsonArr(val) {
	if (!val) return [];
	try { var a = JSON.parse(val); return Array.isArray(a) ? a : []; } catch(e) { return []; }
}

function parseTimeArray(val, fallback) {
	if (!val) return [fallback];
	try {
		var arr = JSON.parse(val);
		return Array.isArray(arr) && arr.length ? arr : [fallback];
	} catch(e) {
		return [val];
	}
}

/* isFirst => show + icon, isLast (non-first) => show × icon, both if single row (isFirst+isLast) */
function buildAITimeWindowPair(startVal, endVal, isFirst) {
	var removeBtn = !isFirst
		? '<a href="javascript:void(0);" class="text-danger ml-1" onclick="removeAITimeWindow(this)" title="Remove"><i class="fa fa-times-circle fa-lg"></i></a>'
		: '';
	var addBtn = '<a href="javascript:void(0);" class="text-primary ml-1 ai-add-time-btn" onclick="addAITimeWindow(this)" title="Add Time"><i class="fa fa-plus-circle fa-lg"></i></a>';

	return '<div class="ai-time-window d-flex align-items-center mb-1">'
		+ '<div class="mr-1">'
		+ '<label class="mb-0" style="font-size:10px;display:block;">Start Time</label>'
		+ buildAITimePicker(startVal||'09:00', 'ai-start-time')
		+ '</div>'
		+ '<div class="mr-1">'
		+ '<label class="mb-0" style="font-size:10px;display:block;">End Time</label>'
		+ buildAITimePicker(endVal||'17:00', 'ai-end-time')
		+ '</div>'
		+ '<div class="d-flex align-items-end pb-1">'
		+ removeBtn
		+ addBtn
		+ '</div>'
		+ '</div>';
}

function buildAIExcludeSection(excludeArr) {
	// excludeArr is array of country IDs — resolve names from master data
	var excludeTags = excludeArr.map(function(cid) {
		var match = AI_CALL_COUNTRIES_DATA.filter(function(c){ return c.key == cid; })[0];
		var name = match ? match.value : cid;
		return '<span class="badge badge-secondary mr-1 mb-1 ai-exclude-tag" data-country-id="'+cid+'" style="font-size:12px;padding:5px 8px;">'
			+ name + ' <a href="javascript:void(0);" class="text-white ml-1" onclick="removeAIExcludeTag(this)">&#x2715;</a>'
			+ '</span>';
	}).join('');

	return '<div class="card mb-3 border-warning" id="ai-exclude-section">'
		+ '<div class="card-body py-2">'
		+ '<div class="d-flex align-items-start">'
		+ '<div class="mr-3" style="min-width:160px;">'
		+ '<h6 class="mb-0 text-warning"><i class="fa fa-ban mr-1"></i>Exclude Countries</h6>'
		+ '<small class="text-muted">These countries will be excluded from ALL rules</small>'
		+ '</div>'
		+ '<div class="flex-grow-1">'
		+ '<div class="ai-exclude-tags d-flex flex-wrap mb-1">' + (excludeTags || '<span class="text-muted small">No countries excluded</span>') + '</div>'
		+ '<div class="d-flex align-items-center">'
		+ '<div class="position-relative mr-2" style="max-width:300px;">'
		+ '<div class="input-group input-group-sm">'
		+ '<input type="text" class="form-control ai-exclude-input" placeholder="Search and add country to exclude..." autocomplete="off" oninput="filterAIExcludeDropdown(this)" onfocus="filterAIExcludeDropdown(this)" onblur="hideAIExcludeDropdown(this)">'
		+ '<div class="input-group-append"><span class="input-group-text"><i class="fa fa-search"></i></span></div>'
		+ '</div>'
		+ '<ul class="ai-exclude-dropdown list-group" style="display:none;position:absolute;z-index:1001;max-height:160px;overflow-y:auto;width:100%;box-shadow:0 4px 12px rgba(0,0,0,0.15);"></ul>'
		+ '</div>'
		+ '<button type="button" class="btn btn-warning btn-sm" onclick="saveAIExcludeCountries(this)" title="Save Exclude Countries">'
		+ '<i class="fa fa-save mr-1"></i>Save'
		+ '</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';
}

function saveAIExcludeCountries(btn) {
	var excludeCountries = [];
	$('#ai-exclude-section .ai-exclude-tag').each(function() {
		var cid = parseInt($(this).attr('data-country-id'));
		if (cid) excludeCountries.push(cid);
	});
	var d = {};
	d['schoolId'] = SCHOOL_ID;
	d['userId'] = USER_ID;
	d['countryId'] = 0;
	d['excludeCountries'] = JSON.stringify(excludeCountries);
	d['startTime'] = JSON.stringify([]);
	d['endTime'] = JSON.stringify([]);
	d['activeDays'] = JSON.stringify([]);
	d['excludeOnly'] = true;
	$(btn).prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i>Saving...');
	$.ajax({
		type: 'POST',
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForHTML('dashboard', 'save-ai-call-exclude-countries'),
		data: JSON.stringify(d),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function(resp) {
			$(btn).prop('disabled', false).html('<i class="fa fa-save mr-1"></i>Save');
			if (resp['status'] == '0' || resp['status'] == '2') {
				showMessageTheme2(0, resp['message'] || 'Failed to save');
			} else {
				showMessageTheme2(1, 'Exclude countries saved');
			}
		},
		error: function() {
			$(btn).prop('disabled', false).html('<i class="fa fa-save mr-1"></i>Save');
			showMessageTheme2(0, 'Error saving exclude countries');
		}
	});
}

function buildAICallRow(id, country, startTimes, endTimes, activeDaysArr, isDefault) {
	var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

	var countryOptions = '<option value="0" '+(country===0?'selected':'')+'>ALL</option>'
		+ AI_CALL_COUNTRIES_DATA.map(function(c) {
			return '<option value="'+c.key+'" '+(parseInt(c.key)===country?'selected':'')+'>'+c.value+'</option>';
		}).join('');

	var dayPills = days.map(function(d) {
		var active = activeDaysArr.indexOf(d) >= 0 ? 'btn-primary' : 'btn-outline-secondary';
		return '<button type="button" class="btn btn-xs '+active+' ai-day-pill mr-1 mb-1" data-day="'+d+'" onclick="toggleAICallDay(this)">'+d+'</button>';
	}).join('');

	var timeWindowsHtml = '';
	var count = Math.max(startTimes.length, endTimes.length, 1);
	for (var i = 0; i < count; i++) {
		timeWindowsHtml += buildAITimeWindowPair(startTimes[i]||'09:00', endTimes[i]||'17:00', i === 0);
	}

	var actionBtns = '';
	if (!isDefault) {
		actionBtns += '<button type="button" class="btn btn-danger btn-sm mr-1" title="Remove this row" onclick="deleteAICallSchedule('+(id||0)+', this)"><i class="fa fa-trash"></i></button>';
	}
	actionBtns += '<button type="button" class="btn btn-success btn-sm" onclick="saveAICallScheduleRow(this)" title="Save"><i class="fa fa-save"></i></button>';

	return '<div class="card mb-2 ai-call-row" data-id="'+(id||'')+'">'
		+ '<div class="card-body py-2">'
		+ '<div class="row align-items-start">'

		+ '<div class="col-md-2 mb-1">'
		+ '<label class="small mb-0">Country</label>'
		+ '<select class="form-control form-control-sm ai-country"'+(isDefault?' disabled':'')+'>'+countryOptions+'</select>'
		+ (isDefault ? '<input type="hidden" class="ai-country-hidden" value="0">' : '')
		+ '</div>'

		+ '<div class="col-md-5 mb-1">'
		+ '<div class="ai-time-windows-list">'
		+ timeWindowsHtml
		+ '</div>'
		+ '</div>'

		+ '<div class="col-md-4 mb-1">'
		+ '<label class="small mb-0">Active Days</label><br>'
		+ dayPills
		+ '</div>'

		+ '<div class="col-md-1 mb-1 d-flex align-items-start justify-content-end pt-3">'
		+ actionBtns
		+ '</div>'

		+ '</div>'
		+ '</div>'
		+ '</div>';
}

function addAICallTimezoneRow() {
	var defaultId = AI_CALL_COUNTRIES_DATA.length ? parseInt(AI_CALL_COUNTRIES_DATA[0].key) : 1;
	var newRow = $(buildAICallRow(null, defaultId, ['09:00'], ['17:00'], ['Mon','Tue','Wed','Thu','Fri'], false));
	$('#ai-call-schedule-list').append(newRow);
	initAICountrySelect2();
}

function addAITimeWindow(link) {
	var list = $(link).closest('.col-md-5').find('.ai-time-windows-list');
	// hide + icon on all existing rows, only last row shows +
	list.find('.ai-add-time-btn').hide();
	var newPair = $(buildAITimeWindowPair('09:00', '17:00', false));
	list.append(newPair);
}

function removeAITimeWindow(link) {
	var list = $(link).closest('.ai-time-windows-list');
	$(link).closest('.ai-time-window').remove();
	// make sure last row shows the + icon
	list.find('.ai-add-time-btn').hide();
	list.find('.ai-time-window:last .ai-add-time-btn').show();
}

function toggleAICallDay(btn) {
	$(btn).toggleClass('btn-primary btn-outline-secondary');
}

function saveAICallScheduleRow(btn) {
	var row = $(btn).closest('.ai-call-row');
	var id = row.data('id');
	var hiddenC = row.find('.ai-country-hidden');
	var countryId = parseInt(hiddenC.length ? hiddenC.val() : row.find('.ai-country').val()) || 0;
	// Exclude countries only relevant for ALL row (countryId=0) — read from top section
	var excludeCountries = [];
	if (countryId === 0) {
		$('#ai-exclude-section .ai-exclude-tag').each(function() {
			var cid = parseInt($(this).attr('data-country-id'));
			if (cid) excludeCountries.push(cid);
		});
	}
	var startTimes = [], endTimes = [];
	row.find('.ai-time-window').each(function() {
		var s = $(this).find('.ai-start-time-val').val();
		var e = $(this).find('.ai-end-time-val').val();
		if (s && e) { startTimes.push(s); endTimes.push(e); }
	});
	var activeDays = [];
	row.find('.ai-day-pill.btn-primary').each(function() {
		activeDays.push($(this).data('day'));
	});

	if (!startTimes.length) {
		showMessageTheme2(0, 'Please fill all time fields');
		return;
	}

	// Validate time windows
	var toMins = function(hhmm) { var p = hhmm.split(':'); return parseInt(p[0])*60 + parseInt(p[1]); };
	for (var i = 0; i < startTimes.length; i++) {
		var s = toMins(startTimes[i]);
		var e = toMins(endTimes[i]);
		if (e <= s) {
			showMessageTheme2(0, 'End Time must be later than Start Time.');
			return;
		}
		if (i > 0 && s <= toMins(endTimes[i-1])) {
			showMessageTheme2(0, 'Start Time of slot '+(i+1)+' must be after the End Time of the previous slot.');
			return;
		}
	}

	data={};
	data['id']= id ? parseInt(id) : 0;
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['countryId']=countryId;
	data['excludeCountries']=JSON.stringify(excludeCountries);
	data['startTime']=JSON.stringify(startTimes);
	data['endTime']=JSON.stringify(endTimes);
	data['activeDays']=JSON.stringify(activeDays);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'save-ai-call-schedule'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(resp) {
			if (resp['status'] == '0' || resp['status'] == '2') {
				showMessageTheme2(0, resp['message']);
			} else {
				showMessageTheme2(1, resp['message']);
				getAICallScheduleList();
			}
		}
	});
}

/* =========================================================
   Exclude Country Tag Input
   ========================================================= */

function filterAIExcludeDropdown(input) {
	var q = $(input).val().toLowerCase().trim();
	var posWrap = $(input).closest('.position-relative');
	var ul = posWrap.find('.ai-exclude-dropdown');
	var tagsWrap = posWrap.closest('.flex-grow-1').find('.ai-exclude-tags');
	var existingIds = [];
	tagsWrap.find('.ai-exclude-tag').each(function() {
		existingIds.push($(this).attr('data-country-id')+'');
	});
	var matches = AI_CALL_COUNTRIES_DATA.filter(function(c) {
		return c.value.toLowerCase().indexOf(q) >= 0 && existingIds.indexOf(c.key+'') < 0;
	}).slice(0, 8);
	if (!matches.length) { ul.hide(); return; }
	ul.html(matches.map(function(c) {
		return '<li class="list-group-item list-group-item-action py-1 px-2" style="cursor:pointer;font-size:12px;" onmousedown="addAIExcludeTag(this,\''+c.key+'\',\''+c.value+'\')">' + c.value + '</li>';
	}).join('')).show();
}

function hideAIExcludeDropdown(input) {
	setTimeout(function() { $(input).closest('.position-relative').find('.ai-exclude-dropdown').hide(); }, 200);
}

function addAIExcludeTag(li, countryId, countryName) {
	var posWrap = $(li).closest('.position-relative');
	var tagsWrap = posWrap.closest('.flex-grow-1').find('.ai-exclude-tags');
	tagsWrap.find('.text-muted').remove();
	tagsWrap.append(
		'<span class="badge badge-secondary mr-1 mb-1 ai-exclude-tag" data-country-id="'+countryId+'" style="font-size:12px;padding:5px 8px;cursor:default;">'
		+ countryName + ' <a href="javascript:void(0);" class="text-white ml-1" onclick="removeAIExcludeTag(this)">&#x2715;</a>'
		+ '</span>'
	);
	posWrap.find('.ai-exclude-input').val('');
	posWrap.find('.ai-exclude-dropdown').hide();
}

function removeAIExcludeTag(a) {
	$(a).closest('.ai-exclude-tag').remove();
}

/* =========================================================
   Custom 12-hour Time Picker
   ========================================================= */

function buildAITimePicker(val24, cssClass) {
	var p = (val24 || '09:00').split(':');
	var h24 = isNaN(parseInt(p[0])) ? 9 : parseInt(p[0]);
	var min = isNaN(parseInt(p[1])) ? 0 : parseInt(p[1]);
	var ampm = h24 >= 12 ? 'PM' : 'AM';
	var h12 = h24 % 12 || 12;
	var display = (h12 < 10 ? '0'+h12 : ''+h12) + ':' + (min < 10 ? '0'+min : ''+min) + ' ' + ampm;
	return '<div class="ai-tp-wrap position-relative">'
		+ '<div class="input-group input-group-sm">'
		+ '<input type="text" class="form-control form-control-sm '+cssClass+'-display" value="'+display+'" readonly style="cursor:pointer;background:#fff;min-width:90px;" onclick="openAITimePicker(this,\''+cssClass+'\')"/>'
		+ '<div class="input-group-append"><span class="input-group-text" style="cursor:pointer;" onclick="openAITimePicker($(this).closest(\'.ai-tp-wrap\').find(\'.'+cssClass+'-display\')[0],\''+cssClass+'\')"><i class="fa fa-clock-o"></i></span></div>'
		+ '</div>'
		+ '<input type="hidden" class="'+cssClass+'-val" value="'+val24+'">'
		+ '</div>';
}

function ensureAITimePickerEl() {
	if ($('#ai-time-picker-pop').length) return;
	$('body').append(
		'<div id="ai-time-picker-pop" style="display:none;position:fixed;z-index:10000;background:#fff;border:1px solid #ccc;border-radius:10px;padding:20px 24px 16px;min-width:220px;box-shadow:0 6px 24px rgba(0,0,0,0.18);">'
		+ '<div class="d-flex justify-content-between align-items-center mb-3">'
		+ '<span style="font-weight:600;font-size:14px;">Time (12 Hours)</span>'
		+ '<span style="cursor:pointer;font-size:18px;color:#999;line-height:1;" onclick="closeAITimePicker()">&times;</span>'
		+ '</div>'
		+ '<div class="d-flex align-items-center justify-content-center mb-3">'
		+   '<div class="text-center">'
		+     '<button type="button" class="btn btn-link p-0 d-block mx-auto ai-tp-arrow" onclick="stepAITP(\'h\',1)" style="font-size:18px;color:#4a6cf7;">&#8963;</button>'
		+     '<input type="text" id="ai-tp-h" class="form-control text-center my-1" style="width:54px;font-size:16px;font-weight:600;" maxlength="2" onchange="sanitizeAITPHour()">'
		+     '<button type="button" class="btn btn-link p-0 d-block mx-auto ai-tp-arrow" onclick="stepAITP(\'h\',-1)" style="font-size:18px;color:#4a6cf7;">&#8964;</button>'
		+   '</div>'
		+   '<div style="font-size:22px;font-weight:700;margin:0 6px;padding-bottom:4px;">:</div>'
		+   '<div class="text-center">'
		+     '<button type="button" class="btn btn-link p-0 d-block mx-auto ai-tp-arrow" onclick="stepAITP(\'m\',5)" style="font-size:18px;color:#4a6cf7;">&#8963;</button>'
		+     '<input type="text" id="ai-tp-m" class="form-control text-center my-1" style="width:54px;font-size:16px;font-weight:600;" maxlength="2" onchange="sanitizeAITPMin()">'
		+     '<button type="button" class="btn btn-link p-0 d-block mx-auto ai-tp-arrow" onclick="stepAITP(\'m\',-5)" style="font-size:18px;color:#4a6cf7;">&#8964;</button>'
		+   '</div>'
		+   '<div class="text-center ml-2">'
		+     '<button type="button" class="btn btn-link p-0 d-block mx-auto ai-tp-arrow" onclick="stepAITP(\'a\',1)" style="font-size:18px;color:#4a6cf7;">&#8963;</button>'
		+     '<input type="text" id="ai-tp-a" class="form-control text-center my-1" style="width:54px;font-size:16px;font-weight:600;" readonly>'
		+     '<button type="button" class="btn btn-link p-0 d-block mx-auto ai-tp-arrow" onclick="stepAITP(\'a\',-1)" style="font-size:18px;color:#4a6cf7;">&#8964;</button>'
		+   '</div>'
		+ '</div>'
		+ '<div class="text-right">'
		+ '<button type="button" class="btn btn-secondary btn-sm mr-2" onclick="closeAITimePicker()">Cancel</button>'
		+ '<button type="button" class="btn btn-primary btn-sm" onclick="confirmAITimePicker()">OK</button>'
		+ '</div>'
		+ '</div>'
	);
	$(document).on('click.aitimepicker', function(e) {
		if (!$(e.target).closest('#ai-time-picker-pop, .ai-tp-wrap').length) closeAITimePicker();
	});
}

var _aiTPTarget = null, _aiTPClass = null;

function openAITimePicker(el, cssClass) {
	ensureAITimePickerEl();
	_aiTPTarget = el;
	_aiTPClass = cssClass;
	var wrap = $(el).closest('.ai-tp-wrap');
	var val24 = wrap.find('.'+cssClass+'-val').val() || '09:00';
	var p = val24.split(':');
	var h24 = isNaN(parseInt(p[0])) ? 9 : parseInt(p[0]);
	var min = isNaN(parseInt(p[1])) ? 0 : parseInt(p[1]);
	var ampm = h24 >= 12 ? 'PM' : 'AM';
	var h12 = h24 % 12 || 12;
	$('#ai-tp-h').val(h12 < 10 ? '0'+h12 : ''+h12);
	$('#ai-tp-m').val(min < 10 ? '0'+min : ''+min);
	$('#ai-tp-a').val(ampm);
	var offset = $(el).offset();
	var scrollTop  = $(window).scrollTop();
	var scrollLeft = $(window).scrollLeft();
	var elH   = $(el).outerHeight();
	var popH  = 260; // approx picker height
	var top   = offset.top - scrollTop + elH + 4;
	var left  = offset.left - scrollLeft;
	// flip above input if not enough space below
	if (top + popH > $(window).height()) {
		top = offset.top - scrollTop - popH - 4;
	}
	if (left + 230 > $(window).width()) left = $(window).width() - 240;
	if (left < 0) left = 4;
	$('#ai-time-picker-pop').css({top: top, left: left}).show();
}

function closeAITimePicker() {
	$('#ai-time-picker-pop').hide();
	_aiTPTarget = null; _aiTPClass = null;
}

function stepAITP(field, dir) {
	if (field === 'h') {
		var v = parseInt($('#ai-tp-h').val()) || 1;
		v += dir; if (v > 12) v = 1; if (v < 1) v = 12;
		$('#ai-tp-h').val(v < 10 ? '0'+v : ''+v);
	} else if (field === 'm') {
		var v = parseInt($('#ai-tp-m').val()) || 0;
		v += dir; if (v >= 60) v = 0; if (v < 0) v = 55;
		$('#ai-tp-m').val(v < 10 ? '0'+v : ''+v);
	} else {
		$('#ai-tp-a').val($('#ai-tp-a').val() === 'AM' ? 'PM' : 'AM');
	}
}

function sanitizeAITPHour() {
	var v = parseInt($('#ai-tp-h').val()) || 1;
	if (v > 12) v = 12; if (v < 1) v = 1;
	$('#ai-tp-h').val(v < 10 ? '0'+v : ''+v);
}

function sanitizeAITPMin() {
	var v = parseInt($('#ai-tp-m').val()) || 0;
	if (v > 59) v = 59; if (v < 0) v = 0;
	$('#ai-tp-m').val(v < 10 ? '0'+v : ''+v);
}

function confirmAITimePicker() {
	if (!_aiTPTarget || !_aiTPClass) return;
	var h12 = parseInt($('#ai-tp-h').val()) || 12;
	var min = parseInt($('#ai-tp-m').val()) || 0;
	var ampm = $('#ai-tp-a').val();
	var h24 = ampm === 'PM' ? (h12 === 12 ? 12 : h12 + 12) : (h12 === 12 ? 0 : h12);
	var val24 = (h24 < 10 ? '0'+h24 : ''+h24) + ':' + (min < 10 ? '0'+min : ''+min);
	var display = (h12 < 10 ? '0'+h12 : ''+h12) + ':' + (min < 10 ? '0'+min : ''+min) + ' ' + ampm;
	var wrap = $(_aiTPTarget).closest('.ai-tp-wrap');
	wrap.find('.'+_aiTPClass+'-display').val(display);
	wrap.find('.'+_aiTPClass+'-val').val(val24);
	closeAITimePicker();
}

/* =========================================================
   End Custom Time Picker
   ========================================================= */

function deleteAICallSchedule(id, linkEl) {
	if (!id || id == 0) {
		var rowEl = $(linkEl).closest('.ai-call-row');
		rowEl.find('.ai-country').filter('.select2-hidden-accessible').select2('destroy');
		rowEl.remove();
		return;
	}
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['id']=id;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard', 'delete-ai-call-schedule'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(resp) {
			if (resp['status'] == '0' || resp['status'] == '2') {
				showMessageTheme2(0, resp['message']);
			} else {
				showMessageTheme2(1, resp['message']);
				getAICallScheduleList();
			}
		}
	});
}

