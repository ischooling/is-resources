function getB2BPartnerStandardFee(callFrom) {
	if(callFrom != 'fromButton'){
		$("#feeStructureLearningProgram").html(getLearningProgramAndCourseProviderMappingBySchoolId(SCHOOL_ID, false));
		selectB2BPartnerCourseProvider();
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
	if(USER_ROLE == "SCHOOL_ADMIN"){
		entityId = SCHOOL_ID;
		entityType = "SCHOOL";
	}else{
		entityId = USER_ID;
		entityType = "USER_ID";
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
				$("#feeStructureWrapper").html(getB2bPartnerFeeStructureContent(gradesList));
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

function getB2BPartnerDifferences(obj1, obj2) {
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
function getB2BPartnerData(){
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


function validationB2BPartnerForStandardFee(){
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

// function validationB2BPartnerForStandardFee(){
// 	var headArr = ['regFee_','bae_','progDisc_','courseFee_','annualDiscount_','minCredit_','ftFull_','ftHalf_','crFull_','crHalf_','advFull_','advHalf_','honFull_','honHalf_','apFull_','apHalf_'];
// 	flag = false;
// 	$.each(mainObject, function(key, value1) {
// 		headArr.forEach(function(value2, index){
// 			if($('[data-id="'+value2+key+'"]').val() == null || $('[data-id="'+value2+key+'"]').val() == undefined || $('[data-id="'+value2+key+'"]').val() == '' || $('[data-id="'+value2+key+'"]').val() == 0){
// 				$('[data-id="'+value2+key+'"]').addClass('border-width-2 border-danger')
// 				flag = true;
// 			}else{
// 				$('[data-id="'+value2+key+'"]').removeClass('border-width-2 border-danger')
// 			}
// 		})
// 	});
// 	return flag;
// }

function saveB2BPartnerStandardFee() {
	let updateFeeData = getB2BPartnerDifferences(currentFeeData, getB2BPartnerData());
	if(Object.keys(updateFeeData).length == 0){
		$("#feeStructureTable tbody input, #feeStructureTable tbody select").removeClass('border-width-2 border-danger');
		$("#feeStructureTable tbody input, #feeStructureTable tbody select").attr('disabled', true);
		showMessageTheme2(1, 'No changes found', '', true);
		return;
	}
	if(validationB2BPartnerForStandardFee()){
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
			}
		}
	});
}

function selectB2BPartnerCourseProvider(){
	var selectedLearningProgram = $("#feeStructureLearningProgram option:selected").data('id');
	if(selectedLearningProgram != null && selectedLearningProgram != undefined){
		$("#feeStructurecourseProvider").html(getCourseProviderOptions(selectedLearningProgram.toString().split(',')));
	}else{
		$("#feeStructurecourseProvider").html('');
	}
}