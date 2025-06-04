var scriptRun = false;
function getPaymentReportData(formId, forCountOnly, type){
	if(forCountOnly){
		url=CONTEXT_PATH+UNIQUEUUID+"/dashboard/student-payment-report-count";
	}else{
		url=CONTEXT_PATH+UNIQUEUUID+"/dashboard/student-payment-report";
	}
    customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : url,
		data : JSON.stringify(getRequestForPaymentReport(formId, type, 'N')),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				$('#studentPaymentReportTable tbody').empty();
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
				$('#pagination').twbsPagination('destroy');
				$('#consolidate').html('');
				$('#studentPaymentReportTable tbody').empty();
				$("#studentPaymentReport #studentPaymentReportTable tbody").html('<tr><td class="text-center">No records found</td></tr>');
			} else {
				//BIND DATA HERE
				if(forCountOnly){
					pageCount(data.count)
				}else{
					if(type==1){
						pageCount(data.count)
					}
					$('#studentPaymentReportTable tbody').empty();
					$("#studentPaymentReport #studentPaymentReportTable tbody").html(cardDetails(data)).promise().done(function(){
						$('.perfectScroll').perfectScrollbar();
					});
					if(USER_ROLE=='DIRECTOR'){
						if(data.consolidate!=null){
							$('#consolidate').html(consolidateContent(data.consolidate,data.count));
						}
					}
					// $('#studentPaymentReportTable').dataTable({});
				}
			}
			customLoader(false);
			return false;
		}
	});
}

function getRequestForPaymentReport(formId, type, forDownload){
	var request={};
	var PaymentReportRequestDTO={};
	PaymentReportRequestDTO['schoolId'] = SCHOOL_ID;
	PaymentReportRequestDTO['studentName'] = $('#studentName').val();
	if($('#startDate').val()!=''){
		PaymentReportRequestDTO['startDate'] = changeDateFormat(new Date($('#startDate').val()), 'yyyy-mm-ddd')+' 00:00:00';
	}
	if($('#endDate').val()!=''){
		PaymentReportRequestDTO['endDate'] = changeDateFormat(new Date($('#endDate').val()), 'yyyy-mm-ddd')+' 23:59:59';
	}
	if($('#gradeId').val()!=''){
		PaymentReportRequestDTO['gradeId'] = $('#gradeId').select2('val');
	}
	if($('#learningProgram').val()!=''){
		PaymentReportRequestDTO['learningProgram'] = $('#learningProgram').select2('val');
	}
	if($('#learningPlatform').val()!=''){
		PaymentReportRequestDTO['learningPlatform'] = $('#learningPlatform').select2('val');
	}
	if($('#enrollStatus').val()!=''){
		PaymentReportRequestDTO['enrollStatus'] =$('#enrollStatus').select2('val');
	}
	if($('#paymentStatus').val()!=''){
		PaymentReportRequestDTO['paymentStatus'] = $('#paymentStatus').select2('val');
	}
	if($('#userId').val()!=''){
		PaymentReportRequestDTO['userId'] = [$('#userId').val()];
	}else{
		PaymentReportRequestDTO['userId'] = [];
	}
	if($('#sessionId').val()!=''){
		PaymentReportRequestDTO['sessionId'] = $('#sessionId').val();
	}
	if(type==1){
		$('#pageNumber').val(1)
	}
	var pageNumber=$('#pageNumber').val();
	pageNumber=pageNumber-1
	if(pageNumber<0){
		pageNumber=0;
	}
	PaymentReportRequestDTO['pageNumber'] = pageNumber;
	PaymentReportRequestDTO['pageSize'] = $('#pageSize').val();
	PaymentReportRequestDTO['type'] = type;
	PaymentReportRequestDTO['forDownload'] = forDownload;
	if($('#overDueBy').val()!='' && $('#overDueBy').val()!=0){
		PaymentReportRequestDTO['overDueBy'] = $('#overDueBy').val();
	}else{
		PaymentReportRequestDTO['overDueBy'] = 45;
	}
	request['paymentReportRequestDTO']=PaymentReportRequestDTO;
	return request;
}

function pageCount (records){
	var pageNo = records / parseInt($("#pageSize").val())
	var checkDecimalValue = Number.isInteger(pageNo)
	if(!checkDecimalValue){
		pageNo = pageNo.toString().split(".");
		pageNo = parseInt(pageNo[0])+1
	}
	$('#pagination').twbsPagination('destroy');
	$("#pagination").twbsPagination({  
		totalPages: pageNo,  
		visiblePages: 10,  
		next: "Next",  
		prev: "Prev",  
		onPageClick: function (event, page) {
			$("#pageNumber").val(page);
			getPaymentReportData('',false,2)
			//$(".getPaymentReportData")[0].onclick();
			//fetch content and render here
			//$("#page-content").text ("Page? + page) + ?content here";
		}  
	});  
}


function resetStudentPaymentForm(formID){
	// Get the current date
	var currentDate = new Date();
	var firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	firstDate = changeDateFormat(firstDate, "MMM-dd-yyyy")
	var lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
	lastDate = changeDateFormat(lastDate, "MMM-dd-yyyy") 
	//$('#'+formID)[0].reset();
	$('#studentName').val('');
	$('#'+formID+" #startDate").val(firstDate).datepicker("update");
	$('#'+formID+" #endDate").val(lastDate).datepicker("update");
	$('#'+formID+" #learningPlatform").val("").trigger("change");
	$('#'+formID+" #learningProgram").val("").trigger("change");
	$('#'+formID+" #gradeId").val("").trigger("change");
	$('#'+formID+" #enrollStatus").val("0").trigger("change");
	$('#'+formID+" #paymentStatus").val(["ODUE","DUE"]).trigger("change");
	$('#'+formID+" #userId").val("").trigger("change");
	$('#'+formID+" #overDueBy").val("45");
	$('#'+formID+" #pageSize").val("10").trigger("change");
	getPaymentReportData('',false,1);
	// $('#'+formID+' .selectReset').val($('#'+formID+' .selectReset option:first-child').val()).trigger('change');
	// $('#'+formID+' #pageSize').val($('#'+formID+' #pageSize option:first-child').val()).trigger('change');


	

	




}

function downloadStudentPaymentReport(formId, forCountOnly, type){
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url :  CONTEXT_PATH+UNIQUEUUID+'/dashboard/student-payment-report-download',
		data : JSON.stringify(getRequestForPaymentReport(formId, type, 'Y')),
		xhrFields: {
            responseType: 'blob'
        },
		success : function(data) {
			var a = document.createElement('a');
            var url = window.URL.createObjectURL(data);
            a.href = url;
			var date = new Date()
			var currentDateTime = date.getFullYear()+ '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))+'-'+date.getHours()+'-'+date.getMinutes()+'-'+date.getSeconds();
            a.download = 'Student_Payment_Report_' + currentDateTime + '.csv';
            document.body.append(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
			customLoader(false);
		},
		error : function(e) {
			console.log(e);
			customLoader(false);
		}
	});
}