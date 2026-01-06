let PROGRESS_INTERVAL = null;
let PAYMENTGETWAY = [];
function editRowPartner(src){
	$(src).parent().closest("tr").find(".edit-value").hide();
	$(src).parent().closest("tr").find(".edit-value-element").show();
}
function cancelEitRowPartner(src){
	$(src).parent().closest("tr").find(".edit-value").show();
	$(src).parent().closest("tr").find(".edit-value-element").hide();
}
function bulkEditPartner(isEdit){
	if(!isEdit){
		$(".commissionTable").find(".edit-value").show();
		$(".commissionTable").find(".edit-value-element").hide();
		$(".bulk-update-and-cancel-btn").hide();
		$(".commissionTable > thead > tr > th:last-child, .commissionTable > tbody > tr > td:last-child").show();
		$(".commissionTable > thead > tr th:nth-last-child(2)").removeClass("rounded-top-right-10");
		$(".commissionTable tbody tr:nth-last-child(1) td:nth-last-child(2)").removeClass("rounded-bottom-right-10");
	}else{
		$(".commissionTable").find(".edit-value").hide();
		$(".commissionTable").find(".edit-value-element").show();
		$(".bulk-update-and-cancel-btn").show();
		$(".commissionTable > thead > tr > th:last-child, .commissionTable > tbody > tr > td:last-child").hide();
		$(".commissionTable > thead > tr th:nth-last-child(2)").addClass("rounded-top-right-10");
		$(".commissionTable tbody tr:nth-last-child(1) td:nth-last-child(2)").addClass("rounded-bottom-right-10");
	}
}
function cancelEitAllRowPartner(){
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
	commissionRate['commissionPayoutType'] =  $("#"+formId+" #commissionPayout").val();
	
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
	// commissionRate['enrollRange'] =  $("#"+formId+" #enrollRange").val();
	commissionRate['enrollRange'] =  $("#minRange").val()+"-"+$("#maxRange").val();
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
		contentType : APPLICATION_JSON_VALUE,
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
		contentType : APPLICATION_JSON_VALUE,
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
	$("#minRange").val()+"-"+$("#maxRange").val()
	if(!$("#minRange").val()){
		showMessageTheme2(0, 'Please fill the min range.', '', true);
		return false
	}
	if(!$("#maxRange").val()){
		showMessageTheme2(0, 'Please fill the max range.', '', true);
		return false
	}
	if(Number($("#minRange").val()) >= Number($("#maxRange").val())){
		showMessageTheme2(0, 'Max range should be greater than min range.', '', true);
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
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/save-commission-rate',
		data : JSON.stringify(getRequestForSaveCommissionRate(formId)),
		dataType : 'json',
		// async : false,
		// global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
				showMessageTheme2(1, data['message'], '', true);
				getAllCommissionRate(formId);
				// getCommissionRate('filterCommissionRate')
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function getRequestForUpdateCommissionRatePartner(formId, singleId){
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
			var minEnrollRange = tr.find('#minEnrollRange_'+id).val();
			var maxEnrollRange = tr.find('#maxEnrollRange_'+id).val();
			var enrollRange = minEnrollRange+"-"+maxEnrollRange;
			var startDate = tr.find('#startDate_'+id).val();
			var endDate = tr.find('#endDate_'+id).val();
			var commissionPayoutType = tr.find("#commissionPayoutEdit_"+id).val();
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
				endDate: endDate,
				commissionPayoutType: commissionPayoutType
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

function validateUpdateCommissionRatePartner(formId){
	var flag = true;
	hideMessage('');
	$('table.commissionTable > tbody > tr').each(function(index) {
		var commissionrateid = $(this).attr("commissionrateid");
		let endDate = $("#endDate_"+commissionrateid).val();
		if(endDate == null || endDate == undefined || endDate == "N/A"){
			showMessageTheme2(0, "Applicable till date required", '', false);
			flag = false;
		}
	});
	return flag;
}
// updateCommissionRate('filterCommissionRate')
function updateCommissionRatePartner(formId, id) {
	hideMessage('');

	if(!validateUpdateCommissionRatePartner(formId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/update-commission-rate',
		data : JSON.stringify(getRequestForUpdateCommissionRatePartner(formId, id)),
		dataType : 'json',
		// async : false,
		// global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
				showMessageTheme2(1, data['message'], '', true);
				// getCommissionRate('filterCommissionRate', true);
				getAllCommissionRate("saveCommissionRateForm")
				bulkEditPartner(false);
			}
		},
		error: function(e){
			if (checkonlineOfflineStatus()) {
				return;
			}
		}
	});
}

function resetCommissionRatePartner(formId){
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
	if($("#"+formId+" #learningProgramFilter").val() == null || $("#"+formId+" #learningProgramFilter").val() == undefined || $("#"+formId+" #learningProgramFilter").val().length == 0){
		learningPrograms.push('A');
	}else{
		learningPrograms.push($("#"+formId+" #learningProgramFilter").val());
	}
	filter['learningPrograms'] = learningPrograms;
	var isAllGrade = '';
	if($("#"+formId+" #standardIdFilter").val() == undefined || $("#"+formId+" #standardIdFilter").val() == null){
		isAllGrade = 'A';
	}else{
		isAllGrade=$("#"+formId+" #standardIdFilter").val().find((element) => element == 'A');
	}
	if(isAllGrade=='A' || isAllGrade==''){
		var learningProgramValue = $('#'+formId+' #learningProgramFilter').val();

		if(learningProgramValue == null || learningProgramValue == undefined || learningProgramValue=='A'){
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

function addCommissionRate(formId){
	var filterRequest = {};
	var filter = {};
	filter['rawLeadId'] =  $("#partnerUserB2BSaveForm #rawLeadId").val();
	var authentication = {};
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = USER_ROLE;
	authentication['userId'] = USER_ID;
	filterRequest['authentication'] = authentication;
	filterRequest['filter'] = filter;
	return filterRequest;
}

function fetchCommissionRate(formId, isEdit) {
	// if($("#"+formId+" #learningProgramFilter").val().length==0){
	// 	showMessageTheme2(0, 'Select Learning program', '', true);
	// 	return false
	// }
	if ($("#"+formId+" #learningProgramFilter").val()=='A') {

	}
	// }else{
	// 	if($("#"+formId+" #standardIdFilter").val().length==0){
	// 		showMessageTheme2(0, 'Select Grade', '', true);
	// 		return false
	// 	}
	// }
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
				if(!isEdit){
					// showMessageTheme2(1, 'Commission rate based on filter criteria', '', true);
				}
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

function getAllPartnerCommissionRate(formId, isEdit) {
	var responseData={};
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : BASE_URL + CONTEXT_PATH + SCHOOL_UUID +'/dashboard/get-all-partner-commission',
		data : JSON.stringify(addCommissionRate(formId)),
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
				if(!isEdit){
					// showMessageTheme2(1, 'Commission rate based on filter criteria', '', true);
				}
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


function getRequestForCommissionRateLogsPartner(parentId){
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

function commissionRateLogsPartner(parentId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + '/dashboard/commission-rate-logs',
            data: JSON.stringify(getRequestForCommissionRateLogsPartner(parentId)),
            dataType: 'json',
            success: function (data) {
                if (data.status == '0' || data.status == '2' || data.status == '3') {
                    if (data.status == '3') {
                        redirectLoginPage();
                    } else {
                        showMessageTheme2(0, data.message, '', true);
                    }
                    reject(data); // ❌ logical failure
                } else {
                    showMessageTheme2(1, 'Commission rate log', '', true);
                    resolve(data); // ✅ success
                }
            },
            error: function (e) {
                if (checkonlineOfflineStatus()) {
                    return;
                }
                reject(e); // ❌ ajax error
            }
        });
    });
}


// $(document).on('show.bs.modal', function (event) {
// 	var modalEle = $(event.target);
// 	const openModals = $(".modal.show").not(this);
// 	if (modalEle.hasClass('right-slide-modal')) {
//         var zIndex = 1050 + openModals.length * 10 + 10;
//         customModalShowPartner(modalEle, zIndex);
//     }
// 	// var zIndex = 1050 + $('.modal:visible').length * 20;
//     // var modalEle = $(this);
//     // customModalShow(modalEle, zIndex)
// });

// function customModalShowPartner(src, zIndex, ){
// 	$(src).css('z-index', zIndex);
// 	$(src).find('.modal-dialog').css('margin-top', 60 * $('.right-slide-modal:visible').length); // Adjust margin-top dynamically
// 	$(src).find(".modal-content").css("height", 'calc(100% - ' + (60 * $('.right-slide-modal:visible').length) + 'px)');
// 	setTimeout(() => {
// 		$('body .modal-backdrop:last-child').css('z-index', zIndex - 1).addClass('modal-stack '+(zIndex-1));
// 	},300)
// }
  
// $(document).on('hidden.bs.modal', '.right-slide-modal', function () {
// 	var index =$(this).css('z-index')-1;
// 	$("body").find('.'+index).remove();
// });

function getAllTimeZoneForPartner(fromTimeId) {
	//hideMessage('');
	//<option value="${timeZone.key}" data-timezone="${timeZone.extra4}">(${timeZone.extra}) - ${timeZone.value}</option>
	$("#"+fromTimeId).append('<option  value="">Select Timezone</option>');
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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


var oldValue = {};
function clickedOnThis(src){
	if(!oldValue.hasOwnProperty(src.id)){
		oldValue[src.id] = $(src).val();
	}
}
 
var mainObject = {};
function tempFunction(elementId){
	var newValue = $("#"+elementId).val()
	if(oldValue[elementId] != newValue){
		if(!mainObject.hasOwnProperty($("#id_"+elementId.split("_")[1]).val())){
			var rowObject = {};
			rowObject[elementId.split("_")[0]] = newValue;
			mainObject[$("#id_"+elementId.split("_")[1]).val()] = rowObject;
		}else{
			if(mainObject[$("#id_"+elementId.split("_")[1]).val()].hasOwnProperty(elementId.split("_")[0])){
				mainObject[$("#id_"+elementId.split("_")[1]).val()][elementId.split("_")[0]]
			}
			mainObject[$("#id_"+elementId.split("_")[1]).val()][elementId.split("_")[0]] = newValue;
		}
		let excludeList = ['regFee_', 'bae_', 'progDisc_']
		if(!excludeList.some(sub => elementId.startsWith(sub))){
			updatedFieldHeighLight(true, elementId.split('_')[1]);
		}
		$("#"+elementId).addClass('border-width-2 border-success');
	}else{
		let [key2, key1] = elementId.split("_");
		key1 = $("#id_"+key1).val();
		if (mainObject?.[key1]?.[key2] !== undefined) {
			delete mainObject[key1][key2];
			if (Object.keys(mainObject[key1]).length === 0) {
				delete mainObject[key1];
			}
			updatedFieldHeighLight(false, elementId.split('_')[1]); 
		}
		$("#"+elementId).removeClass('border-width-2 border-success');
	}
}


function getCourseProviderOptions(courseProviderIds){
	var html='';
	for(var index=0;index<courseProviderIds.length;index++){
		html+='<option value="'+courseProviderIds[index]+'">'+getCourseProviderNameByIds([courseProviderIds[index]])+'</option>';
	}
	return html;
}

function selectCourseProvider(){
	var selectedLearningProgram = $("#feeStructureLearningProgram option:selected").data('id');
	if(selectedLearningProgram != null && selectedLearningProgram != undefined){
		$("#feeStructurecourseProvider").html(getCourseProviderOptions(selectedLearningProgram.toString().split(',')));
	}else{
		$("#feeStructurecourseProvider").html('');
	}
}

function checkboxChecker(src){
	if($(src).is(":checked")){
		if($(src).attr("class").includes("classPayment2")){
			$("#paymentGatewaysDiv").slideDown();
			$('#stripePaymentMode').prop("checked", false)
			$('#airwallexPaymentMode').prop("checked", false)
		}
	}else{
		if($(src).attr("class").includes("classPayment2")){
			$("#paymentGatewaysDiv").slideUp();
			$('#stripePaymentMode').prop("checked", false)
			$('#airwallexPaymentMode').prop("checked", false)
		}
	}
}
var currentFeeData = {};
function getStandardFee(callFrom) {
	if(callFrom != 'fromButton'){
		$("#feeStructureLearningProgram").html(getLearningProgramAndCourseProviderMappingBySchoolId($("#pSchoolId").val(), false));
		selectCourseProvider();
		oldValue = {}
		mainObject = {}
	}
	var feeStructureLearningProgram = $("#feeStructureLearningProgram").val();
	var feeStructurecourseProvider = $("#feeStructurecourseProvider").val();
	if(callFrom == 'fromButton'){
		if(Object.keys(mainObject).length > 0){
			showMessageTheme2(0, 'Please save your changes before getting data', '', true);
			return false;
		}
		if(feeStructureLearningProgram == null || feeStructureLearningProgram == undefined || feeStructureLearningProgram == ''){
			showMessageTheme2(0, 'Please select learning program', '', true);
			return;
		}
		if(feeStructurecourseProvider == null || feeStructurecourseProvider == undefined || feeStructurecourseProvider == ''){
			showMessageTheme2(0, 'Please select course provider program', '', true);
			return;
		}
	}
	let entityId = '';
	let entityType = '';
	if($("#originalPartnerType").val() == "WLP"){
		entityId = $("#pSchoolId").val();
		entityType = "SCHOOL";
	}else{
		entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
		entityType = "INDIVIDUAL";
	}
	var responseData={
		"entityId": entityId,
		"entityType": entityType,
		"learningProgram":feeStructureLearningProgram,
		"courseProvider": feeStructurecourseProvider
	};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','get-fee-structure'),
		data : JSON.stringify(responseData),
		dataType : 'json',
		// async : false,
		// global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', true);
				}
			}else{
				$("#feeStructureTable tbody input, #feeStructureTable tbody select").val("");
				
				var gradesList =[];
				$.each(data.feeDetailList, function(key, value){
					gradesList.push(key);
				});

				$("#feeStructureWrapper").html(getFeeStructureContent(gradesList));
				$.each(gradesList, function(index, grade){
					// $.each(data.feeDetailList[grade], function (i, value){
						if(data.feeDetailList[grade] != undefined){
							let id = data.feeDetailList[grade].id;
							$("#id_"+index).val(id);
							$("#id_"+index).attr("data-id", "id_"+id);
							$("#regFee_"+index).val(data.feeDetailList[grade].regFee.toFixed(2));
							$("#regFee_"+index).attr("data-id", "regFee_"+id);
							$("#bae_"+index).val(data.feeDetailList[grade].bae.toFixed(2));
							$("#bae_"+index).attr("data-id", "bae_"+id);
							$("#progDisc_"+index).val(data.feeDetailList[grade].progDisc.toFixed(2));
							$("#progDisc_"+index).attr("data-id", "progDisc_"+id);
							$("#courseFee_"+index).val(data.feeDetailList[grade].courseFee.toFixed(2));
							$("#courseFee_"+index).attr("data-id", "courseFee_"+id);
							$("#annualDiscount_"+index).val(data.feeDetailList[grade].annualDisc.toFixed(2));
							$("#annualDiscount_"+index).attr("data-id", "annualDiscount_"+id);
							$("#minCredit_"+index).val(data.feeDetailList[grade].minCredit);
							$("#minCredit_"+index).attr("data-id", "minCredit_"+id);
							$("#ftFull_"+index).val(data.feeDetailList[grade].ftFull.toFixed(2));
							$("#ftFull_"+index).attr("data-id", "ftFull_"+id);
							$("#ftHalf_"+index).val(data.feeDetailList[grade].ftHalf.toFixed(2));
							$("#ftHalf_"+index).attr("data-id", "ftHalf_"+id);
							$("#crFull_"+index).val(data.feeDetailList[grade].crFull.toFixed(2));
							$("#crFull_"+index).attr("data-id", "crFull_"+id);
							$("#crHalf_"+index).val(data.feeDetailList[grade].crHalf.toFixed(2));
							$("#crHalf_"+index).attr("data-id", "crHalf_"+id);
							$("#advFull_"+index).val(data.feeDetailList[grade].advFull.toFixed(2));
							$("#advFull_"+index).attr("data-id", "advFull_"+id);
							$("#advHalf_"+index).val(data.feeDetailList[grade].advHalf.toFixed(2));
							$("#advHalf_"+index).attr("data-id", "advHalf_"+id);
							$("#honFull_"+index).val(data.feeDetailList[grade].honFull.toFixed(2));
							$("#honFull_"+index).attr("data-id", "honFull_"+id);
							$("#honHalf_"+index).val(data.feeDetailList[grade].honHalf.toFixed(2));
							$("#honHalf_"+index).attr("data-id", "honHalf_"+id);
							$("#apFull_"+index).val(data.feeDetailList[grade].apFull.toFixed(2));
							$("#apFull_"+index).attr("data-id", "apFull_"+id);
							$("#apHalf_"+index).val(data.feeDetailList[grade].apHalf.toFixed(2));	
							$("#apHalf_"+index).attr("data-id", "apHalf_"+id);
						}
					// })
				});
				$("#feeStructureTable tbody input, #feeStructureTable tbody select").removeClass('border-width-2 border-danger border-success');
				$("#feeStructureTable tbody input, #feeStructureTable tbody select").attr('disabled', true)
				currentFeeData = getData();
			}
		}
	});
	// return responseData;
}

function saveStandardFee() {
	// if(Object.keys(mainObject).length == 0){
	// 	$("#feeStructureTable tbody input, #feeStructureTable tbody select").removeClass('border-width-2 border-danger');
	// 	$("#feeStructureTable tbody input, #feeStructureTable tbody select").attr('disabled', true);
	// 	showMessageTheme2(1, 'No changes found', '', true);
	// 	return;
	// }else 
	let updateFeeData = getDifferences(currentFeeData, getData());
	if(Object.keys(updateFeeData).length == 0){
		$("#feeStructureTable tbody input, #feeStructureTable tbody select").removeClass('border-width-2 border-danger');
		$("#feeStructureTable tbody input, #feeStructureTable tbody select").attr('disabled', true);
		showMessageTheme2(1, 'No changes found', '', true);
		return;
	}
	if(validationForStandardFee()){
		return;
	}
	let entityId = '';
	let entityType = '';
	if($("#originalPartnerType").val() != 'WLP'){
		entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
		entityType = "INDIVIDUAL";
	}else{
		entityId = SCHOOL_ID;
		entityType = "SCHOOL";
	}
	var requestData = {
		"schoolId" : $("#pSchoolId").val(),
		"learningProgram" : $("#feeStructureLearningProgram").val(),
		"courseProviderId" : $("#feeStructurecourseProvider").val(),
		"standardfeeDetails":Object.entries(updateFeeData),
		"loginUser" : USER_ID,
		"rowLeadId" : $("#partnerUserB2BSaveForm #rawLeadId").val(),
		"logOf" : entityType,
		"logOfId" : entityId
	};
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','add-update-fee-structure'),
		data : JSON.stringify(requestData),
		dataType : 'json',
		// async : false,
		// global : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					$('[data-id="'+data['notValid']+'"]').addClass('border-width-2 border-danger');
					showMessageTheme2(0, data['message'], '', true);
				}
			}else{
				oldValue = {};
				mainObject = {};
				updateFeeData = {};
				currentFeeData = getData();
				$("#feeStructureTable tbody input, #feeStructureTable tbody select").removeClass('border-width-2 border-danger');
				$("#feeStructureTable tbody input, #feeStructureTable tbody select").removeClass('border-width-2 border-success');
				$("#feeStructureTable tbody input, #feeStructureTable tbody select").attr('disabled', true);
				showMessageTheme2(1, data['message'], '', true);
				updatePartnerProgressBar();
			}
		}
	});
}
 
function validationForStandardFee(){
	 var learningProgram = $("#feeStructureLearningProgram").val();
	var headArr = ['regFee_','bae_','progDisc_','courseFee_','annualDiscount_','minCredit_','ftFull_','ftHalf_','crFull_','crHalf_','advFull_','advHalf_','honFull_','honHalf_','apFull_','apHalf_'];
	flag = false;
	$.each(mainObject, function(key, value1) {
		headArr.forEach(function(value2, index){

			if($('[data-id="'+value2+key+'"]').val() == null || $('[data-id="'+value2+key+'"]').val() == undefined){
				if(learningProgram != 'ONE_TO_ONE_FLEX' && learningProgram != 'DUAL_DIPLOMA'){
					$('[data-id="'+value2+key+'"]').addClass('border-width-2 border-danger')
					flag = true;
				}else{
					if($('[data-id="'+value2+key+'"]').val() == '' || $('[data-id="'+value2+key+'"]').val() == 0){
						$('[data-id="'+value2+key+'"]').addClass('border-width-2 border-danger')
						flag = true;
					}
				}
			}else{
				$('[data-id="'+value2+key+'"]').removeClass('border-width-2 border-danger')
			}
		})
	});
	return flag;
}

function getState(){
	callStates('officeContactDetailsForm',$("#officeCountryId").val(),'officeCountryId','officeStateId')
}

function getCity(){
	callCities('officeContactDetailsForm',$("#officeStateId").val(),'officeStateId','officeCityId')
}

function disabledEnableRow(rowId, index){
	var learningProgram = $("#feeStructureLearningProgram").val();
	var ids = '';
	if(learningProgram == 'ONE_TO_ONE_FLEX' || learningProgram == 'DUAL_DIPLOMA'){
		ids = "#"+rowId+" td #regFee_"+index+", #bae_"+index+", #progDisc_"+index+", #courseFee_"+index+", #annualDiscount_"+index+", #minCredit_"+index+", #ftFull_"+index+", #ftHalf_"+index+", #crFull_"+index+", #crHalf_"+index+", #advFull_"+index+", #advHalf_"+index+", #honFull_"+index+", #honHalf_"+index+", #apFull_"+index+", #apHalf_"+index;
	}else{
		ids = "#"+rowId+" td #regFee_"+index+", #bae_"+index+", #progDisc_"+index+", #courseFee_"+index+", #annualDiscount_"+index+", #minCredit_"+index;
	}
	if($(ids).attr('disabled')){
		$(ids).attr('disabled', false);
		if($("#originalPartnerType").val() != 'WLP' && (learningProgram != 'ONE_TO_ONE_FLEX' && learningProgram != 'DUAL_DIPLOMA')){
			$("#"+rowId+" td #minCredit_"+index).attr('disabled', true);
		}
	}else{
		$(ids).attr('disabled', true)
	}
}

function calculateFee(indexValue){
	var learningProgram = $("#feeStructureLearningProgram").val();
	if(learningProgram != 'ONE_TO_ONE_FLEX' && learningProgram != 'DUAL_DIPLOMA'){
		var courseFee = $("#courseFee_"+indexValue).val();
		var minCredit = $("#minCredit_"+indexValue).val();
		var annualDisc = $("#annualDiscount_"+indexValue).val();
		if(minCredit == null || minCredit == undefined || minCredit == ''){
			var classText = ['ftFull_', 'ftHalf_', 'crFull_', 'crHalf_', 'advFull_', 'advHalf_', 'honFull_', 'honHalf_', 'apFull_', 'apHalf_'];
			classText.forEach(function(value, index){
				$("#"+value+indexValue).val(0);
			});
		}else{
			const base = (courseFee - annualDisc) / minCredit;
			const adv = base + 25;
			const ap = base + 50;
			$("#ftFull_" + indexValue).val(base.toFixed(2));
			$("#ftHalf_" + indexValue).val((base / 2).toFixed(2));
			$("#crFull_" + indexValue).val(base.toFixed(2));
			$("#crHalf_" + indexValue).val((base / 2).toFixed(2));
			$("#advFull_" + indexValue).val(adv.toFixed(2));
			$("#advHalf_" + indexValue).val((adv / 2).toFixed(2));
			$("#honFull_" + indexValue).val(adv.toFixed(2));
			$("#honHalf_" + indexValue).val((adv / 2).toFixed(2));
			$("#apFull_" + indexValue).val(ap.toFixed(2));
			$("#apHalf_" + indexValue).val((ap / 2).toFixed(2));
		}
	}
}
function updatedFieldHeighLight(update, indexValue) {
    const fields = [
        "ftFull", "ftHalf",
        "crFull", "crHalf",
        "advFull", "advHalf",
        "honFull", "honHalf",
        "apFull", "apHalf"
    ];

    fields.forEach(field => {
        const selector = `#${field}_${indexValue}`;
        if (update) {
            $(selector).addClass("border border-success");
        } else {
            $(selector).removeClass("border border-success");
        }
    });
}

function updateFieldsBasedOnPartnerType() {
	const partnerType = $('#originalPartnerType').val();
    if (partnerType === 'GP' || partnerType === 'EPER') {
      $('#whiteLabel').val('NWL').prop('disabled', true);
      $('#commissionPayout').val('SWP').prop('disabled', false);
      $('#enrollingStudent').val('FIS').prop('disabled', true);
    } else if (partnerType === 'WLP') {
      $('#whiteLabel').val('WLWC').prop('disabled', true);
      $('#commissionPayout').val('PWP').prop('disabled', true);
      $('#enrollingStudent').val('OWN').prop('disabled', true);
    } else {
      $('#whiteLabel').val('').prop('disabled', false);
      $('#commissionPayout').val('').prop('disabled', false);
      $('#enrollingStudent').val('').prop('disabled', false);
    }
	// updateTabsVisibility();
}


function updateTabsVisibility() {
    const partnerType = $('#originalPartnerType').val();
    const commissionValue = $('#commissionPayout').val();
	if(partnerType === 'WLP') {
	  $('#officeContactDetailsTab').show();
	  $("#createPartnerTab").text("Update Partner");
	  $("#createUserB2B").text("Next");
	  $('#officeContactDetailsTab').tab('show');
	  getOfficeContentsDetails('officeContactDetailsForm');
	  $("#commissionPayout").attr('disabled', true);
	//   if(commissionValue === 'PWP'){
	// 	$('div:contains("Payment gateway")').closest('div.d-flex').attr("style","display:none !important");
	//   }
    }else if(partnerType === 'GP' || partnerType === "EPER") {
      $('#setCommissionRateTab').show();
	  $('#feeStructureTab, #paymentOptionsTab').show();
	  $('#setCommissionRateTab').tab('show');
	  $("#createPartnerTab").text("Update Partner");
	  $("#createUserB2B").text("Next");
	  $("#commissionPayout").attr('disabled', false);
	  getAllCommissionRate("saveCommissionRateForm")
		if(commissionValue === 'PWP'){
			$('div:contains("Payment gateway")').closest('div.d-flex').attr("style","display:none !important");
		}else{
			$('div:contains("Payment gateway")').closest('div.d-flex').attr("style","display:flex !important");
		}
    }else{
		$('#enrollRegTab').show();
		$('#feeStructureTab').show();
		$('#themeTab').show();
		$('div:contains("Payment gateway")').closest('div.d-flex').attr("style","display:flex !important");
	}
}

var activeLearningProgramStatusMap = {};
async function initEnrollReg() {
    return new Promise((resolve, reject) => {
		let schoolId = 0;
		if($("#originalPartnerType").val() == 'WLP'){
			schoolId = $("#pSchoolId").val();
		}else{
			schoolId = SCHOOL_ID;
		}
        $.ajax({
            url: `${BASE_URL + CONTEXT_PATH + SCHOOL_UUID}/dashboard/get-learning-programs-status?schoolId=${schoolId}`,
            method: 'GET',
            success: function (response) {
                try {
                    const data = response.allLearningProgramsOptions || [];

                    if (data.status == 0) {
                        console.warn("Retrying initEnrollReg due to incomplete data...");
                        // Retry after a short delay to prevent tight recursion loop
                        setTimeout(async () => {
                            const retryResponse = await initEnrollReg();
                            resolve(retryResponse);
                        }, 1000);
                        return;
                    }

                    originalLearningProgramMap = {};
                    activeLearningProgramStatusMap = {};

                    $.each(data, function (i, item) {
                        const statusInfo = {
                            status: item.learningProgramStatus,
                            enrollmentFor: item.enrollmentFor
                        };
                        originalLearningProgramMap[item.learningProgram] = statusInfo;

                        if (item.learningProgramStatus === 'Y') {
                            activeLearningProgramStatusMap[item.learningProgram] = statusInfo;
                        }
                    });

                   
                    const html = enrollRegContent(data);
                    $('#enrollReg').html(html);

                    if (Object.keys(updateLearningProgramMap).length === 0) {
                        $("#syncCoursesAndSubjectsBtn").hide();
                    } else {
                        $("#syncCoursesAndSubjectsBtn").show();
                    }

                    resolve(response);

                } catch (err) {
                    reject(err);
                }
            },
            error: function (err) {
                console.error('Failed to fetch learning programs:', err);
                reject(err);
            }
        });
    });
}


function trackProgramChange(el) {
	const key = $(el).data('key');
	const enrollmentFor = $(el).data('enroll');
	const newStatus = $(el).is(':checked') ? 'Y' : 'N';
	const original = originalLearningProgramMap[key];
  
	if (original && original.status !== newStatus) {
		updateLearningProgramMap[key] = {
			status: newStatus,
			enrollmentFor: enrollmentFor
		};
	} else {
		delete updateLearningProgramMap[key];
	}

	if (newStatus === 'Y') {
		activeLearningProgramStatusMap[key] = {
			status: newStatus,
			enrollmentFor: enrollmentFor
		};
	} else {
		delete activeLearningProgramStatusMap[key];
	}
}

function updateLearningProgramsPartner() {
	if (Object.keys(activeLearningProgramStatusMap).length === 0) {
		showMessageTheme2(2, 'Please select a learning program.');
		return;
	}
	if (Object.keys(updateLearningProgramMap).length === 0) {
		showMessageTheme2(2, 'No changes found.');
		return;
	}
	let entityId = '';
	let entityType = '';
	let parentEntityId = '';
	let parentEntityType = '';

	if($("#originalPartnerType").val() == 'WLP'){
		entityId = $("#pSchoolId").val();
		entityType = "SCHOOL";
	}else{
		entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
		entityType = "INDIVIDUAL";
	}
	parentEntityType = "SCHOOL";
	parentEntityId = SCHOOL_ID;
	const payload = {
		schoolId: $("#pSchoolId").val(),
		parentSchoolId: SCHOOL_ID,
		actionType: 'u',
		loginUser:USER_ID,
		updateLearningProgramMap: updateLearningProgramMap,
		entityId,
		entityType,
		parentEntityId,
		parentEntityType,
	};
  
	$.ajax({
	  url: `${BASE_URL + CONTEXT_PATH + SCHOOL_UUID}/dashboard/save-learning-programs`,
	  method: 'POST',
	  contentType: 'application/json',
	  data: JSON.stringify(payload),
	  success: async function () {
		showMessageTheme2(1, 'Learning program settings updated successfully!');
		await initEnrollReg();
		$("#syncCoursesAndSubjectsBtn").show();
		updatePartnerProgressBar();
	  },
	  error: function (err) {
		showMessageTheme2(0,'Failed to update.');
		console.error(err);
	  }
	});
}

function saveLearningPrograms() {
	return new Promise((resolve, reject) => {
		let entityId = '';
		let entityType = '';
		let parentEntityId = '';
		let parentEntityType = '';

		if($("#originalPartnerType").val() == 'WLP'){
			entityId = $("#pSchoolId").val();
			entityType = "SCHOOL";
		}else{
			entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
			entityType = "INDIVIDUAL";
		}
		parentEntityType = "SCHOOL";
		parentEntityId = SCHOOL_ID;
		const payload = {
			schoolId: $("#pSchoolId").val(),
			parentSchoolId: SCHOOL_ID,
			entityId,
			entityType,
			parentEntityId,
			parentEntityType,
			loginUser:USER_ID,
		};

		$.ajax({
			url: `${BASE_URL + CONTEXT_PATH + SCHOOL_UUID}/dashboard/save-learning-programs`,
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(payload),
			success: function (response) {
				console.log(response.message);
				resolve(response); // ✅ resolves the promise with response
			},
			error: function (err) {
				console.error(err.message || err);
				reject(err); // ❌ rejects on failure
			}
		});
	});
}


function getData(){
	var obj = {};
	var headArr = ['regFee_','bae_','progDisc_','courseFee_','annualDiscount_','minCredit_','ftFull_','ftHalf_','crFull_','crHalf_','advFull_','advHalf_','honFull_','honHalf_','apFull_','apHalf_'];
	$('#feeStructureTable tbody tr').each(function() {
		let firstCell = $(this).find('td input').val();
		if(firstCell != undefined && firstCell != ''){
			var valueObj = {}
			headArr.forEach(function(value, index){
				var fieldValue = $('[data-id="'+value+firstCell+'"]').val();  
				valueObj[value.split('_')[0]] = fieldValue;
			});
			obj[firstCell] = valueObj;
		}
	});
    return obj;
}

function openFeeStructureLogsModal(){
	if($("#feeStructureLogsModal").length > 0 ){
		$("body #feeStructureLogsModal").remove();
		$("body").append(feeStructureLogsModal());
		$("#feeStructureLogsModal").modal("show");
	}else{
		$("body").append(feeStructureLogsModal());
		$("#feeStructureLogsModal").modal("show");
	}
}

// var PARTNER_SCHOOL_IMAGES = [];
// function base64ImageFileAsURL(f, fileType, elemId, uploadType, expectedWidth, expectedHeight) {
//     const reader = new FileReader();
//     reader.onload = function (e) {
//         var binaryData = reader.result.substr(reader.result.indexOf(',') + 1);
//         var acceptFileTypes = /^image\/(png|jpe?g)$/i;
//         var uploadFlag = true;

//         if (!acceptFileTypes.test(f.type)) {
//             showMessageTheme2(0, 'Only JPG, JPEG or PNG files are allowed.');
// 			$(`#fileupload${elemId}`).val('');
//             return false;
//         }

//         if (f.size > 1024 * 1024) {
//             showMessageTheme2(0, 'File size should not exceed 1 MB.');
// 			$(`#fileupload${elemId}`).val('');
//             return false;
//         }

//         const img = new Image();
//         img.src = e.target.result;
//         img.onload = function () {
//             if (img.width !== expectedWidth || img.height !== expectedHeight) {
//                 showMessageTheme2(0, `Image must be ${expectedWidth}×${expectedHeight} px.`);
// 				$(`#fileupload${elemId}`).val('');
//                 return false;
//             }

//             const obj = {
//                 fileName: f.name,
//                 fileType: parseInt(fileType),
//                 fileContent: binaryData,
//                 previewUrl: e.target.result
//             };

//             const index = PARTNER_SCHOOL_IMAGES.findIndex(item => item.fileType === parseInt(fileType));
//             if (index !== -1) PARTNER_SCHOOL_IMAGES.splice(index, 1);
//             PARTNER_SCHOOL_IMAGES.push(obj);

//             $(`#uploadSection${elemId}`).hide();
//             $(`#fileDisplaySection${elemId}`).show();
//             $(`#fileNameDisplay${elemId}`).text(f.name);
//         };
//     };

//     reader.readAsDataURL(f);
// }

// function uploadDocsFun(src, uploadType, expectedWidth, expectedHeight) {
//     const fileType = $(src).attr('fileType');
//     const elemId = $(src).attr('elem-id');
//     const file = src.files[0];
//     if (file) {
//         base64ImageFileAsURL(file, fileType, elemId, uploadType, expectedWidth, expectedHeight);
//     }
// }



function closeImageModal(){
	$("#imageModal").modal("hide");
	setTimeout(() => {
		$("#imageModal").remove();
	}, 500);
}



function getDifferences(obj1, obj2) {
  const differences = {};

  for (const key in obj1) {
    if (obj2.hasOwnProperty(key)) {
      for (const subKey in obj1[key]) {
        if (
          obj2[key].hasOwnProperty(subKey) &&
          obj1[key][subKey] !== obj2[key][subKey]
        ) {
          if (!differences[key]) differences[key] = {};
          differences[key][subKey] = {
            old: obj1[key][subKey],
            new: obj2[key][subKey]
          };
        }
      }
    }
  }

  return differences;
}

function getLogData(indexValue){
	if($("#originalPartnerType").val() == "WLP"){
		entityId = $("#pSchoolId").val();
		entityType = "SCHOOL";
	}else{
		entityId = $("#partnerUserB2BSaveForm #rawLeadId").val();
		entityType = "INDIVIDUAL";
	}
	let requestData = {
		logOfId : entityId,
		logOf : entityType,
		standardFeeId : $("#id_"+indexValue).val(),
		schoolId : $("#pSchoolId").val(),
		userId : USER_ID
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard','get-standard-fee-log'),
		data : JSON.stringify(requestData),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if (data['status'] == '3') {
					redirectLoginPage();
				} else {
					showMessageTheme2(0, data['message'], '', false);
				}
			}else{
				if($("#feeStructureLogsModal").length == 1){
					$("#feeStructureLogsModal").remove();
				}
				$("body").append(feeStructureLogsModal());
				if(data.logList == null || data.logList == undefined || data.logList == ""){
					showMessageTheme2(0, data['message'], '', false);
				}else{
					showLogCards(data.logList);
					$("#feeStructureLogsModal").modal("show");
				}
			}
		}
	});
}

function showLogCards(logList) {
	let html = "";
	logList.sort((a, b) => b.id - a.id);
	html += '<div class="container-fluid"><div class="row">';
	logList.forEach((log, i) => {
		const currData = JSON.parse(log.logData);
		const prevLog = logList.find(l => l.id == log.prevLogId);
		const prevData = prevLog ? JSON.parse(prevLog.logData) : {};

		const diffs = compareObjects(prevData, currData);
		const preview = Object.keys(diffs).slice(0, 2).map(key => `
			<div class="d-flex justify-content-between">
				<span class="text-muted">${formatLabel(key)}</span>
				<span><b>${diffs[key].newVal}</b></span>
			</div>
		`).join('');

		html += `
			<div class="col-md-4 d-flex">
				<div class="card mb-3 shadow-sm border flex-fill rounded-10">
					<div class="card-header d-flex justify-content-between align-items-center bg-dark text-white py-2 rounded-top-left-10 rounded-top-right-10">
						<div>
							<b>${changeDateFormat(new Date(log.createdAt), "MMM dd, yyyy hh:mm A")}</b>
							<span class="ml-2 small text-light">by ${log.createdByName == undefined ? USER_FULL_NAME : log.createdByName}</span>
						</div>
					</div>
					<div class="card-body">
						${preview || '<span class="text-muted">No visible changes</span>'}
						<button class="btn btn-outline-primary btn-sm mt-3 view-all-btn" data-index="${i}">View All Changes</button>
					</div>
				</div>
			</div>
		`;
	});
	html += '</div></div>';

	$("#feeStructureLogsModal .modal-body").html(html);

	$(".view-all-btn").on("click", function () {
		const index = $(this).data("index");
		showFullChangeModal(logList[index], logList);
	});
}

function compareObjects(oldObj, newObj) {
	let diffs = {};
	for (let key in newObj) {
		if (newObj[key] != oldObj[key]) {
			diffs[key] = {
				oldVal: oldObj[key] || '—',
				newVal: newObj[key]
			};
		}
	}
	return diffs;
}

function showFullChangeModal(currLog, logList) {
	const prevLog = logList.find(l => l.id == currLog.prevLogId);
	const prevData = prevLog ? JSON.parse(prevLog.logData) : {};
	const currData = JSON.parse(currLog.logData);
	const diffs = compareObjects(prevData, currData);

	let updatedDate = currLog.updatedDate || currLog.createdAt;
	diffs['updatedDate'] = {
		oldVal: prevLog ? changeDateFormat(new Date(prevLog.updatedDate || prevLog.createdAt), "MMM dd, yyyy hh:mm A") : 'N/A',
		newVal: changeDateFormat(new Date(updatedDate), "MMM dd, yyyy hh:mm A")
	};

	let html = `
		<div class="modal fade" id="fullChangeModal" tabindex="-1" role="dialog" aria-hidden="true">
			<div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
				<div class="modal-content">
					<div class="modal-header bg-primary text-white py-2">
						<h5 class="modal-title">All Changes</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						${Object.keys(diffs).length === 0
							? `<p class="text-muted">No differences found.</p>`
							: Object.keys(diffs).map(key => `
								<div class="border-bottom pb-2 mb-2">
									<div class="font-weight-bold">${formatLabel(key)}</div>
									<div class="text-danger small">Old: ${diffs[key].oldVal}</div>
									<div class="text-success small">New: ${diffs[key].newVal}</div>
								</div>
							  `).join('')}
					</div>
					<div class="modal-footer py-2">
						<button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	`;

	$('#fullChangeModal').remove();
	$('body').append(html);
	$('#fullChangeModal').modal('show');
}

function updatePartnerProgressBar() {
    $.ajax({
        url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID +  `/school-setup-progress-status?schoolId=${$("#pSchoolId").val()}`,
        type: "GET",
		dataType: "json",
		contentType: "application/json",
        success: function(response) {
            if (response && response.details && response.details.OVERALL_PERCENTAGE !== undefined) {
                var percentage = response.details.OVERALL_PERCENTAGE;
				$("#partnerProgressBarFill").css("width", percentage + "%").attr("aria-valuenow", percentage);
				$("#partnerProgressText").text(percentage + "% Complete");
			}

        },
        error: function() {
            console.error("Failed to fetch progress status");
        }
    });
}

function syncCoursesAndSubjects() {
	var body = {
		schoolId: $("#pSchoolId").val(),
		parentSchoolId: SCHOOL_ID
	}
	$.ajax({
		url: `${BASE_URL}${CONTEXT_PATH}${SCHOOL_UUID}/save-courses-and-subjects`,
		method: "POST",
		dataType: "json",
		contentType: APPLICATION_JSON_VALUE,
		data: JSON.stringify(body),
		success: function () {
			$(".partnerProgressBar").show();
			updateLearningProgramMap = {};
			checkCourseSubjectProgress();
		},
		error: function () {
			showMessageTheme2(0, "Error syncing courses and subjects.");
		}
	});
}

function checkCourseSubjectProgress() {
	if (PROGRESS_INTERVAL) {
		clearInterval(PROGRESS_INTERVAL);
	}
	updateProgress();
	PROGRESS_INTERVAL = setInterval(updateProgress, 5000);
}

function updateProgress() {
	$.ajax({
		url: BASE_URL + CONTEXT_PATH + SCHOOL_UUID + `/school-setup-progress-status?schoolId=${$("#pSchoolId").val()}`,
		method: "GET",
		success: function (response) {
			if (response && response.details && response.details.COURSE_SUBJECTS) {
				let percentage = response.details.COURSE_SUBJECTS.PERCENTAGE || 0;

				$(".partnerProgressBar").each(function () {
					$(this).find(".progress-bar")
						.css("width", percentage + "%")
						.attr("aria-valuenow", percentage);
					$(this).find(".partnerProgressText").text(percentage + "% Complete");
				});

				if (percentage >= 100) {
					clearInterval(PROGRESS_INTERVAL);
					PROGRESS_INTERVAL = null;
					$("#syncCoursesAndSubjectsBtn").hide();
					setTimeout(function(){
						$("#setCommissionRateTab").tab("show");
						getStandardFee('fromTab');
					},1000);
					 if (Object.keys(activeLearningProgramStatusMap).length === 0) {
						$('#setCommissionRateTab, #feeStructureTab, #paymentOptionsTab, #themeTab').hide();
                    } else {
                        $('#setCommissionRateTab, #feeStructureTab, #paymentOptionsTab, #themeTab').show();
                    }

				}
			}
		},
		error: function () {
			console.warn("Error fetching progress status.");
		}
	});
}

// function getGradeBehalfLearningProgramForPartner(formId,learningProgram){
// 	var html=`<option value="A" >ALL Grade</option>`;
// 	html+= getStandardContent(SCHOOL_ID,true);
// 	$("#"+formId+" #standardId").html(html);
// }

function getGradeBehalfLearningProgramForPartner(formId, learningProgram) {

    var html=`<option value="A" >ALL Grade</option>`;
    var gradesHtml = getStandardContent(SCHOOL_ID, true);
    var grades = $(gradesHtml);

    if (learningProgram === "DUAL_DIPLOMA") {
	    var grade9to12Ids = ["4", "5", "6", "7"];
		grades = grades.filter(function () {
			return grade9to12Ids.includes($(this).val());
		});
	} else if (learningProgram === "ONE_TO_ONE_FLEX") {
		var flexyGradeIds = ["19", "9", "10", "20", "21"];
		grades = grades.filter(function () {
            return flexyGradeIds.includes($(this).val());
        });
	}

    html += grades.map(function () {
        return this.outerHTML;
    }).get().join("");
	$("#" + formId + " #standardId").html(html).trigger("change.select2");
}


