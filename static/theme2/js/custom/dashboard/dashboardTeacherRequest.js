function callPayNowRequestTeacher(){
	$('#modal-payment').modal('hide');
	$('#callPaymentModal').modal('show');
}

function callCheckTermsAndConditions(formId){
	if($("#chkvalTeacher").is(":checked")){
		$("#paymentTeacher").removeAttr("disabled");
	}else{
		$("#paymentTeacher").attr("disabled", true);
	}
}

function callRequestTeacher(){
	var subjectIds = [];
	var placementIds =[];
	var payAmount=[];
	var amount=0;
    $.each($("input[name='checkbox']:checked"), function(){            
		if($(this).val()!=null && $(this).val() !=''){
    		subjectIds.push($(this).val());
	    }
		if($(this).attr('data-placement')!=null && $(this).attr('data-placement') !=''){
    		placementIds.push($(this).attr('data-placement'));
		}
    	console.log("placement" + placementIds);
    	amount=parseInt(amount)+parseInt($(this).attr('data-payAmount'));
    	payAmount.push(parseInt($(this).attr('data-payAmount')));
    });
    $('#totalPaymentAmount').attr('data-payAmount',amount);
    $('#totalSubjectIds').attr('data-subjectIds',subjectIds);
    $('#totalPlacementSubjectIds').attr('data-placementSubjectIds',placementIds);
    console.log("placementIds "+placementIds);
	console.log("totalPlacementSubjectIds "+totalPlacementSubjectIds);

	if(($('#totalSubjectIds').attr('data-subjectIds')==undefined || $('#totalSubjectIds').attr('data-subjectIds')=='' ) && ($('#totalPlacementSubjectIds').attr('data-placementSubjectIds')==undefined || $('#totalPlacementSubjectIds').attr('data-placementSubjectIds')=='')){
		showMessage(true, 'Please check atleast one subject to proceed.');
		return false;
	}
    $('#payAmount').text(amount);
    
    $('#modal-payment').modal('show');
    $('#chkvalTeacher').prop('checked', false);
    $("#paymentTeacher").attr("disabled", true);
    //alert("My favourite sports are: " + subjectIds.join(", ")+" payAmount: "+payAmount+"amount: "+amount);
}
function generateTeacherRequest(formId, moduleId, eligiblePaymentGateway) {
	hideMessage('');
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLFor('student','teacher-request'),
		data : JSON.stringify(getRequestForTeacherRequest(formId, moduleId, eligiblePaymentGateway)),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessage(true, data['message']);
			} else {
				showMessage(true, data['message']);
				callCommonInitPayment('','STUDENT', eligiblePaymentGateway);
				
			}
			return false;
		},
		error : function(e) {
			//showMessage(true, e.responseText);
		}
	});
}

function getRequestForTeacherRequest(formId, moduleId, eligiblePaymentGateway){
	console.log('getRequestForTeacherRequest');
	var request = {};
	var authentication = {};
	var requestData = {};
	var studentTeacherRequestDTO = {};
	studentTeacherRequestDTO['eligiblePaymentGateway'] = eligiblePaymentGateway;
	studentTeacherRequestDTO['studentId'] = $('#studentId').val();
	studentTeacherRequestDTO['standardId'] = $('#standardId').val();
	studentTeacherRequestDTO['subjectId'] = $('#totalSubjectIds').attr('data-subjectids');
	studentTeacherRequestDTO['placementSubjectId'] = $('#totalPlacementSubjectIds').attr('data-placementSubjectIds');
	requestData['studentTeacherRequestDTO'] = studentTeacherRequestDTO;
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId']=$('#userId').val();
	request['authentication'] = authentication;
	request['requestData'] = requestData;
	return request;
}
function callKnowMoreAboutTeacher(){
	$('#teacherassstdetails').modal('show');
}