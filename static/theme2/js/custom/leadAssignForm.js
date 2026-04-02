
function getRequestForLeadAssignReports(moduleId , userId){
	if(userId=='' || userId==undefined){
		userId=USER_ID;
	}
	var data={};
	data['userId']=userId;
	data['moduleId'] = moduleId;
	return data;
}

function getLeadAssignData(moduleId, userId) {
	//"lead-list?moduleId=" +roleAndModule.moduleId + "&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=" +ENCRYPTED_USER_ID +"&leadType=" +LEAD_CATEGORY
	return new Promise(function(resolve, reject){
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/lead-assign-form-data',
			data : JSON.stringify(getRequestForLeadAssignReports(moduleId, userId)),
			dataType : 'json',
			async:true,
			global : true,
			success : function(data) {
				console.log(data);
				if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
					if (data['status'] == '3') {
						redirectLoginPage();
					} 
					return reject()
				}else{
					resolve(data)
	
				}
			}
		});
	});
}


function getLeadAssignUser(objectRights) {
	
	data={};
	data['schoolId']=SCHOOL_ID;
	data['userId']=USER_ID;
	data['todayDate']=$("#formdate").val();
	$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'lead-assign-form-list'),
			data : JSON.stringify(data),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				
				var assignUserList= data.assignUserList!=""?JSON.parse(data.assignUserList):"";
                if (data['status'] == '0' || data['status'] == '2') {
                    showMessageTheme2(0, data['message']);
                } else {
                    var html =getLeadAssignUserTableHtml(assignUserList, objectRights);
                    $("#leadAssignUserList").html(html); 
				setTimeout(function() {
						$(".leadCountry").select2({
							theme:"bootstrap4",
							dropdownParent:"#leadCounselorDataForm"
						});
						$(".leadCampain").each(function(){
							initializeCampaignSelect2($(this));
						});
						$(".leadCountry").each(function(){
							initializeCountrySelect2($(this));
						});
							if(assignUserList!=""){
								for (let m = 0; m < assignUserList.length; m++) {
									const assignUser = assignUserList[m];
									getSelectCountries('leadCountry'+assignUser.assignTo,''+assignUser.countries+'');
									getSelectCampain('leadCampain'+assignUser.assignTo,''+assignUser.campainIds+'');
								}
								initializeLeadRuleEditors(assignUserList);
							}
					}, 600);	
                    
                }
                
			}
	   });
   }


   function getLeadAssignUserTableHtml(assignUserList, objectRights){
	var emailForWatiBrodCastRight=objectRights.emailForWatiBrodCastRight;
	var countryList=JSON.parse(objectRights.countryList);
	var campaignList=JSON.parse(objectRights.utmCampaignList);
    var html='';
    var ti=0;
	if(assignUserList!=""){
		var inc=1;
		for (let m = 0; m < assignUserList.length; m++) {
			const assignUser = assignUserList[m];
			var countryPriorityCounts = {};
			if(assignUser.countryPriorityCountMap){
				try{
					countryPriorityCounts = typeof assignUser.countryPriorityCountMap === 'string'
						? JSON.parse(assignUser.countryPriorityCountMap)
						: assignUser.countryPriorityCountMap;
				}catch(e){
					countryPriorityCounts = {};
				}
			}
			var campaignPriorityCounts = {};
			if(assignUser.campaignPriorityCountMap){
				try{
					campaignPriorityCounts = typeof assignUser.campaignPriorityCountMap === 'string'
						? JSON.parse(assignUser.campaignPriorityCountMap)
						: assignUser.campaignPriorityCountMap;
				}catch(e){
					campaignPriorityCounts = {};
				}
			}
			var autoInc=assignUser.orderBy!=''?assignUser.orderBy:inc;

			var bgColorStype='bg-secondary text-white';
			if(assignUser.rating>=8){
				bgColorStype='bg-success text-white';
			}else if(assignUser.rating>=5 && assignUser.rating<8){
				bgColorStype='bg-warning';
			}else{
				bgColorStype='bg-danger text-white';
			}
			
			html+=`<tr class="assignItem"  >	
				 <td class="text-left" style="vertical-align:top"><input type="hidden" class="assignto"  value="${assignUser.assignTo}">
				<b>${assignUser.assignName!='Dr. Angie' ? assignUser.assignName.split(" ")[0] : assignUser.assignName} | ${assignUser.countryName}</b>`;
				// if(assignUser.counselorActivate == 'Y'){
				// 	html+=`<span class="${bgColorStype} text-center badge font-10 float-right">${assignUser.rating}</span>`;
				// }
				html+=`${assignUser.workingtime!=''?'<br/>'+assignUser.workingtime+'':''}`;
				html+=`<br/>`;
					var assignRoles=assignUser.assignRole;
					for (let r = 0; r < assignRoles.length; r++) {
						const aRol = assignRoles[r];
						html+=`<div>${aRol}</div>`;
					}
				html+=`</td>
				 <td style="vertical-align:top"><input type="text" class="form-control form-control-sm rowindex" name="orderBy" class="rowindex" value="${autoInc}" size="5"  maxlength="5" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/></td>
				 <td style="vertical-align:top">
					<div class="d-flex align-items-center">
						<span class="d-inline-flex">
							<input type="text" name="totalAssignLead" class="totalAssignLead form-control form-control-sm" value="${assignUser.totalAssignLeads}" size="5"  maxlength="5"  ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/>
						</span>	
						<span class="d-inline-flex mx-1">
							|
						</span>	
						<span class="d-inline-flex">
							<input type="text" name="totalAssignDemo" class="totalAssignDemo form-control form-control-sm" value="${assignUser.totalAssignDemo}" size="5"  maxlength="5"  ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/>
						</span>	
					</div>
				</td>
				<td style="vertical-align:top">
				 	<label class="switch" >
						<input class="switch-input assignActiveCouns" id="counselorCheckbox${assignUser.assignTo}"  type="checkbox" ${assignUser.counselorActivate == 'Y' ? 'checked':''}  value="${assignUser.counselorActivate}" 
						onclick="activeCounselor(this.value, '${assignUser.assignTo}', '${autoInc}')" data-size="mini"/>
						<span class="switch-label" data-on="Yes" data-off="No"></span> <span class="switch-handle"></span> 
					</label>
				</td>
				<td class="onlyCountryChkTD" councId="${assignUser.assignTo}">
					<input type="checkbox" name="onlyCountryChk" id="onlyCountryChk${assignUser.assignTo}" class="onlyCountryChk" ${assignUser.countryOnlyCheck == '1' ? 'checked':''}  value="${assignUser.countryOnlyCheck}" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/>
					<label class="m-0">Only apply on selected country</label>
					<select class="form-control form-control-sm leadCountry" id="leadCountry${assignUser.assignTo}" name="leadCountry" multiple="multiple" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}> `;
					for (let c = 0; c < countryList.length; c++) {
						const country = countryList[c];
						var countryCountConfig = getCountryCountConfig(countryPriorityCounts, country);
						html+=`<option value="${country.key}" data-country-name="${country.value}" data-urgent-count="${countryCountConfig.urgent || 0}" data-important-count="${countryCountConfig.important || 0}" data-normal-count="${countryCountConfig.normal || 0}">${country.value} (${country.extra})</option>`;
					}
					html+=`</select>
					<input type="hidden" class="leadCountryPriorityRules" value='${escapeRuleAttribute(assignUser.countryPriorityRules)}'>
					<div class="lead-rule-box mt-2" data-type="country" data-assign-to="${assignUser.assignTo}"></div>
				</td>
				<td class="onlyCampainChkTD" councId="${assignUser.assignTo}">
					<input type="checkbox" name="onlyCampainChk" data-councId="${assignUser.assignTo}" id="onlyCampainChk${assignUser.assignTo}" class="onlyCampainChk" ${assignUser.campaignOnlyCheck == '1' ? 'checked':''} value="${assignUser.campaignOnlyCheck}" ${assignUser.counselorActivate == 'Y' ? '':'disabled'} />
					<label class="m-0">Only apply on selected campaign</label>
					<select class="form-control form-control-sm  leadCampain" id="leadCampain${assignUser.assignTo}" name="leadCampain" multiple="multiple" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}> `;
						for (let c = 0; c < campaignList.length; c++) {
							const camp = campaignList[c];
							var campaignCountConfig = getCampaignCountConfig(campaignPriorityCounts, camp);
							html+=`<option value="${camp.key}" data-campaign-name="${camp.value}" data-urgent-count="${campaignCountConfig.urgent || 0}" data-important-count="${campaignCountConfig.important || 0}" data-normal-count="${campaignCountConfig.normal || 0}">${camp.value} (${camp.extra})</option>`;
						}
					html+=`</select>
					<input type="hidden" class="leadCampaignPriorityRules" value='${escapeRuleAttribute(assignUser.campaignPriorityRules)}'>
					<div class="lead-rule-box mt-2" data-type="campaign" data-assign-to="${assignUser.assignTo}"></div>
				</td>

				<td style="max-width:100px;">
					<div class="form-group">
						${assignUser.totalAutoAssignLeads } + ${assignUser.totalByuserAssignLeads} + ${assignUser.totalByTawkLeads }  = 
						(${assignUser.totalSalesLeads} + ${assignUser.totalDemoLeads }=
						<div class="dropdown d-inline-block dropleft">
							<span  aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" >
								${assignUser.totalSalesLeads + assignUser.totalDemoLeads})/ ${assignUser.totalLeads }
							</span>
							<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu p-0">`;
							if(assignUser.assignDateList!=null){
								var cid=1;
								for (let index = 0; index < assignUser.assignDateList.length; index++) {
									const assignDate = assignUser.assignDateList[index];
									html+=`<button type="button" tabindex="0" class="dropdown-item">${(cid++)} - ${assignDate}</button>`;
								}
							}
							html+=`</div>
						</div>
					</div>
				</td>
				<td>
					<a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="getAvailability('${assignUser.assignTo}');" ><i class='fa fa-calendar'></i></a>
					<a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="getCommitionRatePopup('${assignUser.assignTo}');" ><i class="fa fa-edit"></i></a>`;
					if(emailForWatiBrodCastRight){
						html+=`<a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="getAsPost('/dashboard/lead-data-list?moduleId='+${ ROLE_MODULE.moduleId}+'&leadId=0&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=&leadType=B2C&counselorId=${assignUser.assignTo}&enterFrom=assignForm');" ><i class='fa fa-list'></i></a>`;
					}
				html+`</td>
			 </tr>`;
			//getSelectGrade('grades'+assignUser.assignTo+','assignUser.grades');
			//getSelectCountries('leadCountry'+assignUser.assignTo+','assignUser.countries');
			 inc=inc+1;
			//getSelectGrade('grades'+assignUser.assignTo,''+assignUser.grades+'');
			
		}
	}else{

	}
        return html;
  }

function escapeRuleAttribute(value){
	if(value == null || value == undefined){
		return "";
	}
	return String(value)
		.replace(/&/g, "&amp;")
		.replace(/'/g, "&#39;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

function normalizeCampaignKey(value){
	return String(value == null ? '' : value).trim();
}

function getCountryCountConfig(countryPriorityCounts, country){
	if(!countryPriorityCounts){
		return {};
	}
	var candidates = [
		normalizeCampaignKey(country.key),
		normalizeCampaignKey(country.value)
	];
	for (let i = 0; i < candidates.length; i++) {
		var candidate = candidates[i];
		if(candidate !== '' && countryPriorityCounts[candidate]){
			return countryPriorityCounts[candidate];
		}
	}
	return {};
}

function getCampaignCountConfig(campaignPriorityCounts, camp){
	if(!campaignPriorityCounts){
		return {};
	}
	var candidates = [
		normalizeCampaignKey(camp.key),
		normalizeCampaignKey(camp.value),
		normalizeCampaignKey(camp.value + ' (' + camp.extra + ')')
	];
	for (let i = 0; i < candidates.length; i++) {
		var candidate = candidates[i];
		if(candidate !== '' && campaignPriorityCounts[candidate]){
			return campaignPriorityCounts[candidate];
		}
	}
	return {};
}

function getLeadPriorityOptions(selectedValue){
	var priorityOptions = [
		{ value: '1', label: 'Urgent' },
		{ value: '2', label: 'Important' },
		{ value: '3', label: 'Normal' }
	];
	var selected = selectedValue != null && selectedValue != undefined ? String(selectedValue) : '';
	var html = '<option value="">Priority</option>';
	for (let i = 0; i < priorityOptions.length; i++) {
		const option = priorityOptions[i];
		html += `<option value="${option.value}" ${selected === option.value ? 'selected' : ''}>${option.label}</option>`;
	}
	return html;
}

function initializeLeadRuleEditors(assignUserList){
	for (let m = 0; m < assignUserList.length; m++) {
		const assignUser = assignUserList[m];
		bindLeadRuleEditor(assignUser.assignTo, 'country');
		bindLeadRuleEditor(assignUser.assignTo, 'campaign');
	}
}

function bindLeadRuleEditor(assignTo, type){
	var selectSelector = type === 'country' ? '#leadCountry' + assignTo : '#leadCampain' + assignTo;
	var selectElement = $(selectSelector);
	if(!selectElement.length){
		return;
	}
	selectElement.off('change.leadRules').on('change.leadRules', function(){
		renderLeadRuleEditor(assignTo, type);
	});
	renderLeadRuleEditor(assignTo, type);
}

function initializeCampaignSelect2(selectElement){
	if(!selectElement || !selectElement.length){
		return;
	}
	if(selectElement.hasClass('select2-hidden-accessible')){
		selectElement.select2('destroy');
	}
	selectElement.select2({
		theme:"bootstrap4",
		dropdownParent:"#leadCounselorDataForm",
		templateSelection: function(data){
			return getCampaignSelectionLabel(selectElement, data);
		},
		templateResult: function(data){
			return data.text;
		}
	});
}

function initializeCountrySelect2(selectElement){
	if(!selectElement || !selectElement.length){
		return;
	}
	if(selectElement.hasClass('select2-hidden-accessible')){
		selectElement.select2('destroy');
	}
	selectElement.select2({
		theme:"bootstrap4",
		dropdownParent:"#leadCounselorDataForm",
		templateSelection: function(data){
			return getCountrySelectionLabel(selectElement, data);
		},
		templateResult: function(data){
			return data.text;
		}
	});
}

function getCountrySelectionLabel(selectElement, data){
	if(!data){
		return '';
	}
	if(!data.id){
		return data.text || '';
	}
	return getLeadRuleItemLabel($(data.element), 'country', '');
}

function getCampaignSelectionLabel(selectElement, data){
	if(!data){
		return '';
	}
	if(!data.id){
		return data.text || '';
	}
	var row = selectElement.closest('tr.assignItem');
	if(!row.length){
		return data.text || '';
	}
	var rules = getLeadRuleMap(row.find('.leadCampaignPriorityRules').val(), true);
	var rule = rules[String(data.id).trim()] || {};
	return getLeadRuleItemLabel($(data.element), 'campaign', rule.priority || '');
}

function refreshCampaignSelectionLabels(row){
	if(!row || !row.length){
		return;
	}
	var selectElement = row.find('.leadCampain');
	if(selectElement.length && selectElement.hasClass('select2-hidden-accessible')){
		selectElement.trigger('change.select2');
	}
}

function refreshCountrySelectionLabels(row){
	if(!row || !row.length){
		return;
	}
	var selectElement = row.find('.leadCountry');
	if(selectElement.length && selectElement.hasClass('select2-hidden-accessible')){
		selectElement.trigger('change.select2');
	}
}

function getCampaignPriorityLeadCount(option, priorityValue){
	if(!option || !option.length){
		return '0';
	}
	var urgentCount = parseInt(option.attr('data-urgent-count'), 10) || 0;
	var importantCount = parseInt(option.attr('data-important-count'), 10) || 0;
	var normalCount = parseInt(option.attr('data-normal-count'), 10) || 0;
	return String(urgentCount + importantCount + normalCount);
}

function getCountryPriorityLeadCount(option, priorityValue){
	if(!option || !option.length){
		return '0';
	}
	var urgentCount = parseInt(option.attr('data-urgent-count'), 10) || 0;
	var importantCount = parseInt(option.attr('data-important-count'), 10) || 0;
	var normalCount = parseInt(option.attr('data-normal-count'), 10) || 0;
	return String(urgentCount + importantCount + normalCount);
}

function getLeadRuleItemLabel(option, type, priorityValue){
	var label = option.text();
	if(type === 'country'){
		return label + '[' + getCountryPriorityLeadCount(option, priorityValue) + ']';
	}
	if(type !== 'campaign'){
		return label;
	}
	var priorityLeadCount = getCampaignPriorityLeadCount(option, priorityValue);
	return label + '[' + priorityLeadCount + ']';
}

function updateLeadRuleItemLabel(item, row, type){
	var key = item.attr('data-key');
	var priorityValue = item.find('.lead-rule-priority').val();
	var option = row.find((type === 'country' ? '.leadCountry' : '.leadCampain') + ' option[value="' + key + '"]');
	item.find('.lead-rule-item-label').text(getLeadRuleItemLabel(option, type, priorityValue));
}

function renderLeadRuleEditor(assignTo, type){
	var row = $('#leadAssignUserList').find('tr.assignItem').has('.assignto[value="'+assignTo+'"]');
	if(!row.length){
		return;
	}
	var hiddenField = row.find(type === 'country' ? '.leadCountryPriorityRules' : '.leadCampaignPriorityRules');
	var existingRules = getLeadRuleMap(hiddenField.val(), type === 'campaign');
	var selectElement = row.find(type === 'country' ? '.leadCountry' : '.leadCampain');
	var selectedOptions = selectElement.find('option:selected');
	var disabledAttr = selectElement.is(':disabled') ? 'disabled' : '';
	var html = '';
	if(selectedOptions.length){
		html += `<div class="text-left p-2 rounded" style="background:#f7f9ff;border:1px solid #d7e1ff;">`;
		html += type === 'country'
			? `<div class="font-weight-bold mb-1" style="font-size:10px;">Limit | Country Priority</div>`
			: `<div class="d-flex align-items-center font-weight-bold mb-1" style="gap:6px;font-size:10px;">
					<div class="flex-fill">Order</div>
					<div class="flex-fill">Limit</div>
					<div class="flex-fill">Campaign Priority</div>
				</div>`;
		html += `<div class="lead-rule-items" style="max-height:150px;overflow-y:auto;"></div>`;
		html += `</div>`;
	}
	row.find('.lead-rule-box[data-type="'+type+'"]').html(html);
	var itemsContainer = row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-items');
	selectedOptions.each(function(){
		var option = $(this);
		var key = option.val();
		var mapKey = String(key).trim();
		var rule = existingRules[mapKey] || {};
		var label = getLeadRuleItemLabel(option, type, rule.priority || '');
		itemsContainer.append(`
			<div class="border rounded p-1 mb-1 lead-rule-item" data-key="${escapeRuleAttribute(mapKey)}" style="background:#fff;">
				<div class="font-weight-bold mb-1 lead-rule-item-label" style="font-size:10px;line-height:1.2;">${label}</div>
				<div class="d-flex align-items-center" style="gap:6px;">
					${type === 'campaign' ? `<input type="number" min="1" class="form-control form-control-sm lead-rule-order" placeholder="Order" data-type="${type}" data-key="${escapeRuleAttribute(mapKey)}" value="${rule.order || ''}" ${disabledAttr}>` : ``}
					<input type="number" min="1" class="form-control form-control-sm lead-rule-limit" placeholder="Limit" data-type="${type}" data-key="${escapeRuleAttribute(mapKey)}" value="${rule.limit || ''}" ${disabledAttr}>
					<select class="form-control form-control-sm lead-rule-priority" data-type="${type}" data-key="${escapeRuleAttribute(mapKey)}" ${disabledAttr}>
						${getLeadPriorityOptions(rule.priority || '')}
					</select>
				</div>
			</div>
		`);
	});
	row.find('.lead-rule-box[data-type="'+type+'"] input').off('input.leadRules').on('input.leadRules', function(){
		syncLeadRuleHiddenField(row, type);
	});
	row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-priority').off('change.leadRules').on('change.leadRules', function(){
		updateLeadRuleItemLabel($(this).closest('.lead-rule-item'), row, type);
		syncLeadRuleHiddenField(row, type);
	});
	syncLeadRuleHiddenField(row, type);
}

function getLeadRuleMap(hiddenValue, campaignRouting){
	var rules = {};
	if(!hiddenValue){
		return rules;
	}
	try{
		var parsed = JSON.parse(hiddenValue);
		Object.keys(parsed).forEach(function(key){
			var finalKey = String(key).trim();
			rules[finalKey] = parsed[key] || {};
		});
	}catch(e){
		console.error('Invalid lead rule json', e);
	}
	return rules;
}

function syncLeadRuleHiddenField(row, type){
	var rules = {};
	row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-priority').each(function(){
		var key = $(this).attr('data-key');
		var priority = parseInt($(this).val(), 10) || 0;
		var limit = parseInt(row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-limit[data-key="'+key+'"]').val(), 10) || 0;
		var order = type === 'campaign' ? (parseInt(row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-order[data-key="'+key+'"]').val(), 10) || 0) : 0;
		if(priority > 0 && limit > 0){
			rules[key] = { priority: priority, limit: limit };
			if(type === 'campaign' && order > 0){
				rules[key].order = order;
			}
		}
	});
	row.find(type === 'country' ? '.leadCountryPriorityRules' : '.leadCampaignPriorityRules').val(Object.keys(rules).length ? JSON.stringify(rules) : '');
	if(type === 'campaign'){
		refreshCampaignSelectionLabels(row);
	}else if(type === 'country'){
		refreshCountrySelectionLabels(row);
	}
}

function validateLeadRuleConfig(tblId){
	var isValid = true;
	var errorMessage = '';
	$('#'+tblId+' tr.assignItem').each(function() {
		var row = $(this);
		var counselorName = $.trim(row.find('td:first b').text());
		var totalLeadLimit = parseInt(row.find('.totalAssignLead').val(), 10) || 0;
		var configuredLimitTotals = {
			country: 0,
			campaign: 0
		};
		['country', 'campaign'].forEach(function(type){
			var totalConfiguredLimit = 0;
			row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-priority').each(function(){
				var key = $(this).attr('data-key');
				var priority = $(this).val();
				var limit = row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-limit[data-key="'+key+'"]').val();
				var order = type === 'campaign' ? row.find('.lead-rule-box[data-type="'+type+'"] .lead-rule-order[data-key="'+key+'"]').val() : '1';
				var shouldValidate = priority !== '';
				if(shouldValidate){
					if(limit === '' || (type === 'campaign' && order === '')){
						isValid = false;
						if(errorMessage === ''){
							errorMessage = 'Please complete priority, limit, and campaign order before saving.';
						}
					} else {
						totalConfiguredLimit += parseInt(limit, 10) || 0;
					}
				}
			});
			configuredLimitTotals[type] = totalConfiguredLimit;
			if(isValid && totalConfiguredLimit > totalLeadLimit){
				isValid = false;
				var typeLabel = type === 'campaign' ? 'Campaign' : 'Country';
				errorMessage = 'The total ' + typeLabel.toLowerCase() + ' limit is ' + totalConfiguredLimit + ', which cannot be greater than the lead limit ' + totalLeadLimit + ' for ' + counselorName + '.';
			}
		});
		if(isValid){
			var combinedConfiguredLimit = configuredLimitTotals.country + configuredLimitTotals.campaign;
			if(combinedConfiguredLimit > totalLeadLimit){
				isValid = false;
				errorMessage = 'The combined country and campaign priority limit is ' + combinedConfiguredLimit + ', which cannot be greater than the lead limit ' + totalLeadLimit + ' for ' + counselorName + '.';
			}
		}
		if(!isValid){
			return false;
		}
	});
	if(!isValid){
		showMessageTheme2(0, errorMessage, '', true);
	}
	return isValid;
}

  function getCommitionRatePopup(assignTo){
	$("#counselorSetCommitionPopup").modal('show');
	$("#counselorSetCommitionPopup #assignTo").val(assignTo);
	$("#filterCounselorCommissionRate #assignToFilter").val(assignTo);
	$('#addFormPopup').trigger('click') ;
	$(".td-border-design").html('');
	resetCounselorFilterByForm('filterCounselorCommissionRate');

}



function getRequestForUpdateCommissionRate(formId, singleId){
	var request = {};
	var commissionRates = [];
	$('table.commissionTable > tbody > tr').each(function(index) {
		var tr = $(this);
		var id = tr.attr('commissionRateId');
		var flag=true;
		if(singleId!=''){
			if(singleId!=id){
				flag=false;
			}
		}
		if(flag){
			var byPartnerType = tr.find('#byPartnerType_'+id).val();
			var byPartnerValue = tr.find('#byPartnerValue_'+id).val();
			var bySchoolType = tr.find('#bySchoolType_'+id).val();
			var bySchoolValue = tr.find('#bySchoolValue_'+id).val();
			var bySchoolPartnerType = tr.find('#bySchoolPartnerType_'+id).val();
			var bySchoolPartnerValue = tr.find('#bySchoolPartnerValue_'+id).val();
			var enrollRangeMin = tr.find('#enrollRangeMin_'+id).val();
			var enrollRangeMax = tr.find('#enrollRangeMax_'+id).val();
			var enrollRange = enrollRangeMin + "-" + enrollRangeMax;
			var startDate = tr.find('#startDate_'+id).val();
			var endDate = tr.find('#endDate_'+id).val();
			var commissionRate= {
				id: id,
				byPartnerType: byPartnerType,
				byPartnerValue: byPartnerValue,
				bySchoolType: bySchoolType,
				bySchoolValue: bySchoolValue,
				bySchoolPartnerType: bySchoolPartnerType,
				bySchoolPartnerValue: bySchoolPartnerValue,
				enrollRange: enrollRange,
				startDate: startDate,
				endDate: endDate
			}
			commissionRates.push(commissionRate);
		}
	});
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['commissionRates'] = commissionRates;
	return request;
}

function validateUpdateCommissionRate(formId){
	hideMessage('');
	$('table.commissionTable > tbody > tr').each(function(index) {
	});
	return true;
}
// updateCommissionRate('filterCommissionRate')
function updateCommissionRate(formId, id, isEdit) {
	hideMessage('');
	if(!validateUpdateCommissionRate(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/update-commission-rate',
		data : JSON.stringify(getRequestForUpdateCommissionRate(formId, id)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
				if(!isEdit){
					showMessageTheme2(1, data['message'], '', true);
				}else{
					getCounselorCommissionRateFilter('filterCounselorCommissionRate');
				}
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function resetCommissionRate(formId){
	$("#"+formId+" #byPartnerType").val("P");
	$("#"+formId+" #byPartnerValue").val("");
	$("#"+formId+" #bySchoolType").val("P");
	$("#"+formId+" #bySchoolValue").val("");
	$("#"+formId+" #learningProgram").val("A").trigger("change");
	$("#"+formId+" #standardId").val("").trigger("change");
	$("#"+formId+" #startDate").val("").datepicker("update");
	$("#"+formId+" #endDate").val("").datepicker("update");
	$("#"+formId+" #enrollRange").val("0").trigger("change");
}

function getCommissionRateLogs(id){
	var data=commissionRateLogs(id);
	var html=getCommissionRateLogsContent(id, data);
	$('#commissionRateLogsTable > tbody').html(html);
	// $(".datepicker").datepicker({
	// 	autoclose: true,
	// 	format: 'M d, yyyy',
	// });
	$("#counselorCommissionRateLogs").modal("show");
}
function getCommissionRateLogsContent(id, data){
	var html = '';
	$.each(data.commissionRates, function(k,commissionRate){
		html+=
		'<tr class="td-border-design border-color-gray" commissionRateId="'+commissionRate.id+'">'
			+'<td class="border-width-1">'+(k+1)+'</td>'
			+'<td class="border-width-1">'+(commissionRate.standardName == "" ? "All" : commissionRate.standardName)+'</td>'
			+'<td class="border-width-1">'+(commissionRate.learningProgramValue == "" ? "All" : commissionRate.learningProgramValue)+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed; max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+(commissionRate.byPartnerType=='F'?'Amount in USD':'Percentage')
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+(commissionRate.byPartnerType=='F'?'$':'')+commissionRate.byPartnerValue+(commissionRate.byPartnerType=='F'?'':'%')
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="p-0 border-width-1">'
				+'<table class="table m-0" style="table-layout: fixed;max-width: 270px;">'
					+'<tbody>'
						+'<tr>'
							+'<td class="border-left-0 border-bottom-0">'
								+(commissionRate.bySchoolType=='F'?'Amount in USD':'Percentage')
							+'</td>'
							+'<td class="border-right-0 border-bottom-0">'
								+(commissionRate.bySchoolType=='F'?'$':'')+commissionRate.bySchoolValue+(commissionRate.bySchoolType=='F'?'':'%')
							+'</td>'
						+'</tr>'
					+'</tbody>'
				+'</table>'
			+'</td>'
			+'<td class="border-width-1">'
				+commissionRate.startDate
			+'</td>'
			+'<td class="border-width-1">'
				+commissionRate.endDate
			+'</td>'
			+'<td class="text-center border-width-1">'
				+commissionRate.userNameUpdatedBy
			+'</td>'
			+'<td class="text-center border-width-1">'
				+commissionRate.updatedAt
			+'</td>'
		+'</tr>'
	});
	return html;
}



function getRequestForCommissionRateLogs(parentId){
	var filterRequest = {};
	var filter = {};
	filter['parentId'] =  parentId;
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	filterRequest['authentication'] = authentication;
	filterRequest['filter'] = filter;
	return filterRequest;
}

function commissionRateLogs(parentId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/commission-rate-logs',
		data : JSON.stringify(getRequestForCommissionRateLogs(parentId)),
		dataType : 'json',
		async : false,
		global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', true);
				}
			}else{
				responseData=data;
				showMessageTheme2(1, 'Commission rate log', '', true);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
	return responseData;
}
