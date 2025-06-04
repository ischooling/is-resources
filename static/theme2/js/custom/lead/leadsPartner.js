function editRow(src){
	$(src).parent().closest("tr").find(".edit-value").hide();
	$(src).parent().closest("tr").find(".edit-value-element").show();
}
function cancelEitRow(src){
	$(src).parent().closest("tr").find(".edit-value").show();
	$(src).parent().closest("tr").find(".edit-value-element").hide();
}
function bulkEdit(){
	$(".commissionTable").find(".edit-value").hide();
	$(".commissionTable").find(".edit-value-element").show();
	$(".bulk-update-and-cancel-btn").show();
	$(".commissionTable > thead > tr > th:last-child, .commissionTable > tbody > tr > td:last-child").hide();
	$(".commissionTable > thead > tr th:nth-last-child(2)").addClass("rounded-top-right-10");
	$(".commissionTable tbody tr:nth-last-child(1) td:nth-last-child(2)").addClass("rounded-bottom-right-10");
}
function cancelEitAllRow(){
	$(".commissionTable").find(".edit-value").show();
	$(".commissionTable").find(".edit-value-element").hide();
	$(".bulk-update-and-cancel-btn").hide();
	$(".commissionTable thead > tr th:last-child, .commissionTable tbody > tr td:last-child").show();
	$(".commissionTable thead > tr th:nth-last-child(2)").removeClass("rounded-top-right-10");
	$(".commissionTable tbody > tr:nth-last-child(1) td:nth-last-child(2)").removeClass("rounded-bottom-right-10");
}



function getRequestForSaveCommissionRate(formId){
	var request = {};
	var commissionRate = {};
	commissionRate['rawLeadId'] =  $("#partnerUserB2BSaveForm #rawLeadId").val();
	commissionRate['byPartnerType'] =  $("#"+formId+" #byPartnerType").val();
	commissionRate['byPartnerValue'] =  $("#"+formId+" #byPartnerValue").val();
	commissionRate['bySchoolType'] =  $("#"+formId+" #bySchoolType").val();
	commissionRate['bySchoolValue'] =  $("#"+formId+" #bySchoolValue").val();
	commissionRate['bySchoolPartnerType'] =  $("#"+formId+" #bySchoolPartnerType").val();
	commissionRate['bySchoolPartnerValue'] =  $("#"+formId+" #bySchoolPartnerValue").val();
	
	var learningPrograms=[];
	learningPrograms.push($("#"+formId+" #learningProgram").val());
	commissionRate['learningPrograms'] = learningPrograms;
	var isAllGrade=$("#"+formId+" #standardId").val().find((element) => element == 'A');
	if(isAllGrade!= undefined || isAllGrade=='A' || isAllGrade==''){
		var learningProgramValue = $('#'+formId+' #learningProgram').val();
		if(learningProgramValue=='A'){
			commissionRate['standardIds'] = [0];
		}else{
			if(learningProgramValue=='ONE_TO_ONE_FLEX'){
				commissionRate['standardIds'] = [19,9,10,20,21];
			}else if(learningProgramValue=='BATCH'){
				commissionRate['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7];
			}else{
				commissionRate['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7];
			}
		}
	}else{
		commissionRate['standardIds'] =  $("#"+formId+" #standardId").val();
	}
	commissionRate['enrollRange'] =  $("#"+formId+" #enrollRange").val();
	commissionRate['startDate'] =  $("#"+formId+" #startDate").val();
	commissionRate['endDate'] =  $("#"+formId+" #endDate").val()!=undefined?$("#"+formId+" #endDate").val():"";
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	request['authentication'] = authentication;
	request['commissionRate'] = commissionRate;
	return request;
}



// set Discoutn script start here
function validateDiscountRate(formId){
	hideMessage('');
	if ($("#"+formId+" #discountType").val()=="") {
		showMessageTheme2(0, 'Discount type required.', '', true);
		return false
	}
	if ($("#"+formId+" #discountValue").val()=="") {
		showMessageTheme2(0, 'Discount required.', '', true);
		return false
	}
	return true;
}

function saveDiscountRate(formId) {
	hideMessage('');
	if(!validateDiscountRate(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/save-discount-rate',
		data : JSON.stringify(getRequestForSaveDiscountRate(formId)),
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
				getDiscountRate('saveDiscountRateForm');
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



function getRequestForSaveDiscountRate(formId){
	var request = {};
	request['rawLeadId'] =  $("#partnerUserB2BSaveForm #rawLeadId").val();
	request['discountType'] = $("#"+formId+" #discountType").val();
	request['discountValue'] =  parseFloat($("#"+formId+" #discountValue").val()).toFixed(2);
	request['userId'] = USER_ID;
	return request;
}

function fetchDiscountRate(formId) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/filter-discount-rate',
		data : JSON.stringify(getRequestForFilterDiscountRate(formId)),
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
				//showMessageTheme2(1, 'discount rate based on filter criteria', '', true);
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

function getRequestForFilterDiscountRate(formId){
	var filter = {};
	filter['rawLeadId'] = $("#partnerUserB2BSaveForm #rawLeadId").val();
	filter['userId'] =  USER_ID;
	return filter;
}
// set Discoutn script start here

function validateCommissionRate(formId){
	hideMessage('');
	if ($("#"+formId+" #byPartnerType").val()=="") {
		showMessageTheme2(0, 'Lead Provided By Partner type required.', '', true);
		return false
	}
	if ($("#"+formId+" #byPartnerValue").val()=="") {
		showMessageTheme2(0, 'Commission rate required.', '', true);
		return false
	}
	if ($("#"+formId+" #bySchoolType").val()=="") {
		showMessageTheme2(0, 'Lead Provided By IS required.', '', true);
		return false
	}
	if ($("#"+formId+" #bySchoolValue").val()=="") {
		showMessageTheme2(0, 'Commission rate required.', '', true);
		return false
	}
	if ($("#"+formId+" #bySchoolValue").val()=="") {
		showMessageTheme2(0, 'Commission rate required.', '', true);
		return false
	}
	
	if ($("#"+formId+" #learningProgram").val()=='') {
		showMessageTheme2(0, 'Learning program is required', '', true);
		return false
	}
	if ($("#"+formId+" #learningProgram").val()=='A') {

	}else{
		if ($("#"+formId+" #standardId").val()=='') {
			showMessageTheme2(0, 'Grade is required', '', true);
			return false
		}
	}
	if ($("#"+formId+" #startDate").val()=="") {
		showMessageTheme2(0, 'Applicable From Date required.', '', true);
		return false
	}
	// if ($("#"+formId+" #endDate").val()=="") {
	// 	showMessageTheme2(0, 'Applicable Till Date required.', '', true);
	// 	return false
	// }
	return true;
}

function saveCommissionRate(formId) {
	hideMessage('');
	if(!validateCommissionRate(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/save-commission-rate',
		data : JSON.stringify(getRequestForSaveCommissionRate(formId)),
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
			var bySchoolPartnerValue = tr.find('#bySchoolPartnerValue_'+id).val()!=undefined?tr.find('#bySchoolPartnerValue_'+id).val():0;
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
		contentType : "application/json",
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
function resetFilterByForm(formId){
	$("#"+formId+" #learningProgramFilter").val("").trigger("change");
	$("#"+formId+" #standardIdFilter").val("").trigger("change");
}

function getRequestForFilterCommissionRate(formId){
	var filterRequest = {};
	var filter = {};
	filter['rawLeadId'] =  $("#partnerUserB2BSaveForm #rawLeadId").val();
	var learningPrograms=[];
	learningPrograms.push($("#"+formId+" #learningProgramFilter").val());
	filter['learningPrograms'] = learningPrograms;
	var isAllGrade=$("#"+formId+" #standardIdFilter").val().find((element) => element == 'A');
	if(isAllGrade!= undefined || isAllGrade=='A' || isAllGrade==''){
		var learningProgramValue = $('#'+formId+' #learningProgramFilter').val();

		if(learningProgramValue=='A'){
			filter['standardIds'] = [0];
		}else{
			if(learningProgramValue=='ONE_TO_ONE_FLEX'){
				filter['standardIds'] = [19,9,10,20,21];
			}else if(learningProgramValue=='BATCH'){
				filter['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7];
			}else{
				filter['standardIds'] = [11,12,13,14,15,16,1,2,3,4,5,6,7,8];
			}
		}
		
	}else{
		filter['standardIds'] =  $("#"+formId+" #standardIdFilter").val();
	}
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	filterRequest['authentication'] = authentication;
	filterRequest['filter'] = filter;
	return filterRequest;
}

function fetchCommissionRate(formId) {
	if($("#"+formId+" #learningProgramFilter").val().length==0){
		showMessageTheme2(0, 'Select Learning program', '', true);
		return false
	}
	if ($("#"+formId+" #learningProgramFilter").val()=='A') {

	}else{
		if($("#"+formId+" #standardIdFilter").val().length==0){
			showMessageTheme2(0, 'Select Grade', '', true);
			return false
		}
	}
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/filter-commission-rate',
		data : JSON.stringify(getRequestForFilterCommissionRate(formId)),
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
				showMessageTheme2(1, 'Commission rate based on filter criteria', '', true);
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
		contentType : "application/json",
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


$(document).on('show.bs.modal', function (event) {
	var modalEle = $(event.target);
	if (modalEle.hasClass('right-slide-modal')) {
        var zIndex = 1050 + $('.modal:visible').length * 20;
        customModalShow(modalEle, zIndex);
    }
	// var zIndex = 1050 + $('.modal:visible').length * 20;
    // var modalEle = $(this);
    // customModalShow(modalEle, zIndex)
});

function customModalShow(src, zIndex, ){
	$(src).css('z-index', zIndex);
	$(src).find('.modal-dialog').css('margin-top', 60 * $('.right-slide-modal:visible').length); // Adjust margin-top dynamically
	$(src).find(".modal-content").css("height", 'calc(100% - ' + (60 * $('.right-slide-modal:visible').length) + 'px)');
	$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack '+(zIndex-1));
}
  
$(document).on('hidden.bs.modal', '.right-slide-modal', function () {
	var index =$(this).css('z-index')-1;
	$("body").find('.'+index).remove();
});

function getAllTimeZoneForPartner(fromTimeId) {
	//hideMessage('');
	//<option value="${timeZone.key}" data-timezone="${timeZone.extra4}">(${timeZone.extra}) - ${timeZone.value}</option>
	$("#"+fromTimeId).append('<option  value="">Select Timezone</option>');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMaster('', 'TIMEZONE-LIST', '')),
		dataType : 'json',
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
			} else {
				$.each(data['mastersData']['countryTimeZones'], function(k, v) {
					$("#"+fromTimeId).append('<option custom_timezone_id="'+v.key+'" value="' + v.value + '">(' + v.extra + ') - ' + v.extra1 +'/'+ v.extra3+ '</option>');
				});
			}
		}
	});
}


