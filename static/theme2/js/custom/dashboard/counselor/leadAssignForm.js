
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
						$(".leadCampain").select2({
							theme:"bootstrap4",
							dropdownParent:"#leadCounselorDataForm"
						});
							if(assignUserList!=""){
								for (let m = 0; m < assignUserList.length; m++) {
									const assignUser = assignUserList[m];
									getSelectCountries('leadCountry'+assignUser.assignTo,''+assignUser.countries+'');
									getSelectCampain('leadCampain'+assignUser.assignTo,''+assignUser.campainIds+'');
								}
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
			var autoInc=assignUser.orderBy!=''?assignUser.orderBy:inc
			html+=`<tr class="assignItem">	
				 <td class="text-left"><input type="hidden" class="assignto"  value="${assignUser.assignTo}">
				<b>${assignUser.assignName}</b><br/>`;
					var assignRoles=assignUser.assignRole;
					for (let r = 0; r < assignRoles.length; r++) {
						const aRol = assignRoles[r];
						html+=`<div>${aRol}</div>`;
					}
				html+=`</td>
				 <td><input type="text" class="form-control form-control-sm" name="orderBy" class="rowindex" value="${autoInc}" size="5"  maxlength="5" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}/></td>
				 <td>
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
				<td>
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
						html+=`<option value="${country.key}">${country.value} (${country.extra})</option>`;
					}
					html+=`</select>
				</td>
				<td class="onlyCampainChkTD" councId="${assignUser.assignTo}">
					<input type="checkbox" name="onlyCampainChk" data-councId="${assignUser.assignTo}" id="onlyCampainChk${assignUser.assignTo}" class="onlyCampainChk" ${assignUser.campaignOnlyCheck == '1' ? 'checked':''} value="${assignUser.campaignOnlyCheck}" ${assignUser.counselorActivate == 'Y' ? '':'disabled'} />
					<label class="m-0">Only apply on selected campaign</label>
					<select class="form-control form-control-sm  leadCampain" id="leadCampain${assignUser.assignTo}" name="leadCampain" multiple="multiple" ${assignUser.counselorActivate == 'Y' ? '':'disabled'}> `;
						for (let c = 0; c < campaignList.length; c++) {
							const camp = campaignList[c];
							html+=`<option value="${camp.key}">${camp.value} (${camp.extra})</option>`;
						}
					html+=`</select>
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
						html+=`<a href="javascript:void(0);" class="btn btn-sm btn-primary mr-1" onclick="getAsPost('/dashboard/lead-data-list?moduleId='+${ ROLE_MODULE.moduleId}+'&leadFrom=LEAD&clickFrom=list&startDate=&endDate=&country=0&campaign=&currentPage=0&euid=&leadType=B2C&counselorId=${assignUser.assignTo}');" ><i class='fa fa-list'></i></a>`;
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
			var enrollRange = tr.find('#enrollRange_'+id).val();
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
function updateCommissionRate(formId, id) {
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
				showMessageTheme2(1, data['message'], '', true);
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
			+'<td class="border-width-1">'+commissionRate.standardName+'</td>'
			+'<td class="border-width-1">'+commissionRate.learningProgramValue+'</td>'
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
