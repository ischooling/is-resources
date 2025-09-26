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

function callKnowMoreAboutTeacher(){
	$('#teacherassstdetails').modal('show');
}