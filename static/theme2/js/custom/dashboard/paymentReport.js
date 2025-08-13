var scriptRun = false;
function getPaymentReportData(formId, forCountOnly, type, callFrom){
	if($('#paymentStatus').val()!=''){
		if($('#startDate').val()=='' && $('#endDate').val()==''){
			showMessageTheme2(0, 'Please choose Start Date and End Date','',true);
			return false;
		}
	}
	if(forCountOnly){
		url=CONTEXT_PATH+UNIQUEUUID+"/dashboard/student-payment-report-count";
	}else{
		url=CONTEXT_PATH+UNIQUEUUID+"/dashboard/student-payment-report";
	}
	if(callFrom=='search'){
		$(".filterStudentPaymentReportForm").css({"display": "none"});
	}else{
		$(".filterStudentPaymentReportForm").css({"display": "block"});
	}
    customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : url,
		data : JSON.stringify(getRequestForPaymentReport(formId, type, 'N')),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				$('#studentPaymentReportTable tbody').empty();
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
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
						$.each(data.reports, function(key, item) {
							getCommunicationLogList(item.studentStandardId, item.userId);
							
						});

						$(".re-leadstatus").select2({
							theme:'bootstrap4',
						});
						
						// if(lRStatus!=""){
						// 	$("#studentPaymentForm #reLeadStatus").val(lRStatus).trigger("change");
						// }
						$('.perfectScroll').perfectScrollbar();
						$(".follow-up-no").click(function(){
							$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
							$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
							$(this).parent().find(".follow-up-content").slideDown();
							$(this).parent().siblings().find(".follow-up-content").slideUp();
							$(this).parent().addClass("follow-up-accordian-active");
							$(this).parent().siblings().removeClass("follow-up-accordian-active");
						});
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
	PaymentReportRequestDTO['loginUserId'] = USER_ID;
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
		PaymentReportRequestDTO['refferalCode'] = [$('#userId option:selected').attr('data-reffcode')];
	}else{
		PaymentReportRequestDTO['userId'] = [];
	}
	if($('#sessionId').val()!=''){
		PaymentReportRequestDTO['sessionId'] = $('#sessionId').val();
		
	}
	if($('#reLeadStatus').val()!=''){
		PaymentReportRequestDTO['status'] =$('#reLeadStatus').select2('val');
	}
	if($('#reEnrollStatus').val()!=''){
		PaymentReportRequestDTO['reEnrollStatus'] = $('#reEnrollStatus').val();
	}
	if($('#remainingDueBy').val()!=''){
		PaymentReportRequestDTO['remainingDueBy'] = $('#remainingDueBy').val();
	}
	if($('#lmsStatus').val()!=''){
		PaymentReportRequestDTO['lmsStatus'] = $('#lmsStatus').val();
	}
	if($('#academicYearStatus').val()!=''){
		PaymentReportRequestDTO['academicYearStatus'] = $('#academicYearStatus').val();
	}
	if($('#systemTrainStatus').val()!=''){
		PaymentReportRequestDTO['systemTrainStatus'] = $('#systemTrainStatus').val();
	}
	if($('#teacherMapStaus').val()!=''){
		PaymentReportRequestDTO['teacherMapStaus'] = $('#teacherMapStaus').val();
	}
	if($('#transcriptStatus').val()!=''){
		PaymentReportRequestDTO['transcriptStatus'] = $('#transcriptStatus').val();
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

function pageCount(records){
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
			console.log(page);
			$("#pageNumber").val(page);
			if(page>1){
				getPaymentReportData('',false,2,'')
			}
			//$(".getPaymentReportData")[0].onclick();
			//fetch content and render here
			//$("#page-content").text ("Page? + page) + ?content here";
		}  
	});  
}


function resetStudentPaymentForm(formID){
	// Get the current date
	// var currentDate = new Date();
	// var firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
	// firstDate = changeDateFormat(firstDate, "MMM-dd-yyyy")
	// var lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
	// lastDate = changeDateFormat(lastDate, "MMM-dd-yyyy") 
	//$('#'+formID)[0].reset();
	$('#studentName').val('');
	$('#'+formID+" #startDate").val('');
	$('#'+formID+" #endDate").val('');
	$('#'+formID+" #learningPlatform").val("").trigger("change");
	$('#'+formID+" #learningProgram").val("").trigger("change");
	$('#'+formID+" #gradeId").val("").trigger("change");
	$('#'+formID+" #paymentStatus").val('').trigger("change");//["ODUE","DUE"]
	$('#'+formID+" #userId").val("").trigger("change");
	$('#'+formID+" #overDueBy").val("0");
	$('#'+formID+" #reLeadStatus").val("").trigger("change");
	$('#'+formID+" #reEnrollStatus").val("").trigger("change");
	$('#'+formID+" #remainingDueBy").val('');
	$('#'+formID+" #lmsStatus").val('');
	$('#'+formID+" #academicYearStatus").val('');
	$('#'+formID+" #teacherMapStaus").val('');
	$('#'+formID+" #systemTrainStatus").val('');

	$('#'+formID+" #pageSize").val("10").trigger("change");
	//getPaymentReportData('',false,1,'');
	// $('#'+formID+' .selectReset').val($('#'+formID+' .selectReset option:first-child').val()).trigger('change');
	// $('#'+formID+' #pageSize').val($('#'+formID+' #pageSize option:first-child').val()).trigger('change');


	

	




}

function downloadStudentPaymentReport(formId, forCountOnly, type){
	customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
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
		}
	});
}



function submitCommunicationLog(studentStandardId, userId) {
	hideMessageTheme2('');
	if ($('#leadStatus-'+studentStandardId).val()==undefined || $('#leadStatus-'+studentStandardId).val()=='') {
		showMessageTheme2(0, 'Please select lead Status','',true);
		return false;
	}
	var leadStatus =$('#leadStatus-'+studentStandardId).val();
	var remark='';
	if ($('#followupRemarks-'+studentStandardId).val()==undefined || $('#followupRemarks-'+studentStandardId).val()=='') {
		showMessageTheme2(0, 'Please fill followup Remarks','',true);
		return false;
	}
	if($('#followupRemarks-'+studentStandardId).val()!=''){
		remark=escapeCharacters($('#followupRemarks-'+studentStandardId).val());
	}

	var data={};
	data['leadStatus']=leadStatus;
	data['comments']=remark;
	data['entityId']=userId;
	data['entityName']='STUDENT';
	data['userId']=USER_ID;

	
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('dashboard','save-student-comm-log'),
		data : JSON.stringify(data),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//console.log(data);
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(0, data['message'],'',true);
				return false;
			} else {
				$('#leadStatus-'+studentStandardId).val('');
				$('#followupRemarks-'+studentStandardId).val('');
				showMessageTheme2(1, data['message'],'',false);
				//getLeadStatusLog(data['leadno'], callFrom, discardPermission);
				getCommunicationLogList(studentStandardId, userId);
			}
			return false;
		}
	});
}

function getCommunicationLogList(studentStandardId, userId){
   // customLoader(true);
	var data={};
	data['userId']=userId;
	data['role']='STUDENT';
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : CONTEXT_PATH+UNIQUEUUID+"/api/v1/dashboard/get-user-communication-log",
		data: JSON.stringify(data),
		dataType : 'json',
		success : function(data) {
			//console.log(data.commonCommentsDTO);
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				showMessageTheme2(0, data['message'],'',true);
			} else {
				var html='';
				if(data.commonCommentsDTO!=null){
					var incS=1;
					
					for(var l=0;l<data.commonCommentsDTO.length;l++){
							var leadCall = data.commonCommentsDTO[l];
							html+='<li class=" '+(l==0?'follow-up-accordian-active':'')+'">'
							+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold"><label class="float-left">'+(incS++)+'</label> '+(leadCall.status)+'<br/><span style="font-size:10px">'+(leadCall.createdAt)+'</span> <i class="fa '+(l==0?'fa-angle-up':'fa-angle-down')+' float-right" style="line-height: 20px;"></i></span>'
							+'<div class="follow-up-content text-center" style="'+(l==0?'display: block':'display: block')+'">'
								+'<div class="dropdown d-inline-block text-center my-2" style="position: inherit;">'
									+'<button type="button" aria-haspopup="true" aria-expanded="false" data-toggle="dropdown" class="dropdown-toggle btn btn-sm btn-primary">View Remark</button>'
									+'<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-md dropdown-menu p-2" x-placement="bottom-start" style="font-size:11px;">'
										+'<table class="w-100">'
											+'<tr>'
												+'<th class="p-1 border-0">Remarks:</th>'
												+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+(leadCall.comments!=''?leadCall.comments:'N/A')+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="p-1 border-0">Follow by:</th>'
												+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+(leadCall.addedByName!=''?leadCall.addedByName:'N/A')+'</td>'
											+'</tr>'
											+'<tr>'
												+'<th class="p-1 border-0">Follow Date:</th>'
												+'<td class="p-1 border-0 text-justify" id="callRemark" style="max-width: 250px;">'+(leadCall.createdAt!=''?leadCall.createdAt:'N/A')+'</td>'
											+'</tr>'
										+'</table>'
									+'</div>'
								+'</div>'
							+'</div>'
						+'</li>';
					}
				}else{
					html+=`<li class="follow-up-accordian-active">
						<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold">No Followup</span>
					</li>`;
				}
				$(".followup-remark-"+studentStandardId).html(html);

				$(".follow-up-no").click(function(){
					$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
					$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
					$(this).parent().find(".follow-up-content").slideDown();
					$(this).parent().siblings().find(".follow-up-content").slideUp();
					$(this).parent().addClass("follow-up-accordian-active");
					$(this).parent().siblings().removeClass("follow-up-accordian-active");
				});
			}
			customLoader(false);
			return false;
		}
	});
}


function callReEnrollStatusList(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'LEAD-STATUS-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Status</option>');
				$.each(result, function (k, v) {
					if(keyStatus){
						dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
					}else{
						dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
					}
				});
			}
		}
	});
}

function callUserReferralUpdatePaymentWindow(formId, studentStandardId, roleModuleId) {
  $("#studentStandardId").val(studentStandardId);
  $("#updateReferralCodeModal").modal("show");
}

function saveReferralCodeFromPaymentWindow() {
  hideMessageTheme2("");
  var refCode = $("#newReferralCode option:selected").attr('data-reffcode');
  if (
    refCode == null ||
    refCode == "" ||
    refCode == undefined ||
    refCode == 0
  ) {
   showMessageTheme2(0, "Invalid referral code");
    return false;
  }
  var studentStandardId = $("#studentStandardId").val();
  var data = {};
  data["studentStandardId"] = studentStandardId;
  data["sessionUserId"] = USER_ID;
  data["referralCode"] = refCode;
  $.ajax({
    type: "POST",
    contentType: APPLICATION_JSON_VALUE,
    url: getURLForHTML("dashboard", "update-referral-code"),
    data: JSON.stringify(data),
    dataType: "html",
    cache: false,
    timeout: 600000,
    success: function (htmlContent) {
      if (htmlContent != "") {
        var stringMessage = [];
        stringMessage = htmlContent.split("|");
        if (
          stringMessage[0] == "FAILED" ||
          stringMessage[0] == "EXCEPTION" ||
          stringMessage[0] == "SESSIONOUT"
        ) {
         showMessageTheme2(0, stringMessage[1]);
        } else {
         showMessageTheme2(1, stringMessage[1]);
          $("#updateReferralCodeModal").modal("hide");
        }
        return false;
      }
    }
  });
}
