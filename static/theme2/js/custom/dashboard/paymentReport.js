var scriptRun = false;
function getPaymentReportData(formId, forCountOnly, type, callFrom){
	if($('#paymentStatus').val()!=''){
		if($('#paymentStatus').val()!='ABS' && $('#paymentStatus').val()!='AP'){
			if($('#startDate').val()=='' && $('#endDate').val()==''){
				showMessageTheme2(0, 'Please choose Start Date and End Date','',true);
				return false;
			}
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

			$("body").append(getWatiTemplatesHtml());
		
			$("#selectStudentAllDiv").attr("class","block")
			$("#selectStudentAll").off('click').on('click', function () {
				var studentnew = $("#studentIdMove").val();
				var chkAll = this;
				let chkRows = $("#studentPaymentReportTable").find(".checkStudent");
				chkRows.each(function () {
					$(this)[0].checked = chkAll.checked;
				});
				var studentNo='';

				$.each($("input[name='student-move-another']:checked"), function(){
					if(studentnew.indexOf($(this).val()) != -1){
					}else{
						studentNo = studentNo+','+$(this).val();
					}
				});

				studentnew = studentnew + studentNo;
				$("#studentIdMove").val(studentnew);
				if($("#selectStudentAll").is(":checked")){}
				else{
					$("#studentIdMove").val('');
				}
			});

			$(".checkStudent").off('click').on('click', function () {
				var studentnew = $("#studentIdMove").val();
				var chkAll = $("#selectStudentAll");
				chkAll.attr("checked", "checked");
				$("#studentPaymentReportTable .checkStudent").each(function () {
					if (!$(this).is(":checked")) {
						chkAll.prop('checked', false);
						chkAll.removeAttr("checked", "checked");
						if(studentnew.indexOf($(this).val()) != -1){
							studentnew = studentnew.replace(","+$(this).val(), '')
						}
						return;
					}
				});
				var studentNo='';
				$.each($("input[name='student-move-another']:checked"), function(){
					if(studentnew.indexOf($(this).val()) != -1){
					}else{
						studentNo = studentNo+','+$(this).val();
					}  
				});
				studentnew = studentnew + studentNo;
				$("#studentIdMove").val(studentnew);
			});
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

function getWatiBroadcastTemplates(){
	$("#allWatiBroadcastTemplatesList").html('');
	$("#allWatiBroadcastTemplatesList").html('');
	$('#mcustomWatiBroadcastTemplatesListClose').click(function(e) { 
		//console.log("mcustomWatiTemplatesListClose :: clicked :: inside :: getWatiTemplates"); 
		$("input#selectStudentAll").prop('checked','');
		$('input[name="student-move-another"]').prop('checked','');
		$("#studentIdMove").val("");
	});
	
	var movestudentNo = $("#studentIdMove").val();
	if(movestudentNo==''){
		showMessageTheme2(0, 'Please check any one student','',false);
		return false;
	}
	hideMessageTheme2('');
	var students=$("#studentIdMove").val();
	var selected = new Array();
	$('input[name="student-move-another"]').each(function() {
		selected.push($(this).val());
   	});
	//console.log("selected from allchecked :: " + selected);
	students=students.substring(1,students.lenght)
	var request={}
	request['userId']=USER_ID;
	request['students']=students;
	//console.log(request);

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-wati-templates-for-student-list'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['statusCode'] == 'E001' || data['statusCode'] == 'E002') {
				//showMessageTheme2(0, data['message'],'',true);
				showMessageTheme2(0, data['message'],'',false);
			} else {
				watiTemplateContent=data;
				//console.log('watiTemplateContent DATA : ' + JSON.stringify(watiTemplateContent));
				$.each(watiTemplateContent.messageTemplates, function(index, obj) {
					if(obj.customParams != null && obj.customParams != ''){
						$.each(obj.customParams, function(i, param) {
							var placeholder = "{{" + param.paramName + "}}";
							var regex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							if (obj.bodyOriginal.includes("*{{"+param.paramName+"}}*")) {
								var regex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							} else {
								var regex = placeholder;
							}
							obj.body = obj.body.replace(regex, param.paramValue);
							obj.bodyOriginal = obj.bodyOriginal.replace(regex, "<b>"+param.paramValue+"</b>");
						});
					}
				});
				
				$("body").html(getWaringContent1());
				var allWatiTemplatesListPopup = $("#allWatiTemplatesList");
				allWatiTemplatesListPopup.html('');
				$("#allWatiTemplatesList").html(customWatiTemplatesList(data));
				var isDataTable = $.fn.dataTable.isDataTable("#mwatiBroadcastTable");
				if(isDataTable){
					$("#mwatiBroadcastTable").dataTable().fnDestroy();
				}
				$("#mwatiBroadcastTable").DataTable({
					theme:"bootstrap4",
					//order: [[3, 'desc']]
				});
				$('#mcustomWatiTemplatesList').modal('show'); //calling custom method
				
				var userListPopup = $("#usrPopData");
				// userListPopup.html('');
				userListPopup.html(swatiBroadcastSendMobileModal(data));

				$("#mswatiBroadcastSendThroughMobile").modal("hide");
				//return false;
			}

			return false;
		}
	});
}

function getWatiLogsFilterRecords(){
	if($("#watiLogsRecordsFilterModal").length<1){
		$("body").append(getWatiLogsRecordsFilterModal());
		$("#watiLogsRecordsFilterModal #endDateDiv").hide();
		$("#watiLogsRecordsFilterModal #endDateDiv").hide();
		$("#watiLogsRecordsFilterModal #searchDateType").on("change", function(){
			if($(this).val() === "CUSTOM"){
				$("#watiLogsRecordsFilterModal #endDate").val('');
				$("#watiLogsRecordsFilterModal #endDate").val('');
				$("#watiLogsRecordsFilterModal #endDateDiv").show();
				$("#watiLogsRecordsFilterModal #endDateDiv").show();
			}else{
				$("#watiLogsRecordsFilterModal #endDate").val('');
				$("#watiLogsRecordsFilterModal #endDate").val('');
				$("#watiLogsRecordsFilterModal #endDateDiv").hide();
				$("#watiLogsRecordsFilterModal #endDateDiv").hide();
			}
		});
		$("#watiLogsRecordsFilterModal #startDate").datepicker({
			format : 'dd-mm-yyyy',
			autoclose: true,
		});
		$("#watiLogsRecordsFilterModal #endDate").datepicker({
			format : 'dd-mm-yyyy',
			autoclose: true,
		});
		$("#watiLogsRecords #counsolerToSearch").select2({
			theme:"bootstrap4",
			dropdownParent:"#watiLogsRecords"
		});
	}
	$("#watiLogsRecordsFilterModal").modal("show");
	setTimeout(function(){ getWatiLogsCounsolerNames('watiLogsRecords');}, 500);	
}

function parseDateFromDDMMYYYY(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

function getWatiLogsCounsolerNames(formId){
	$.ajax({
		type : "GET",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-counsoler-names'),
		cache : false,
		timeout : 600000,
		success : function(data) { 
			if(data.status == '0' || data.status == '2' || data.status == '3') {
					if(data.status == '3'){
                      redirectLoginPage();
                  	}else{
						if(showMessage){
							showMessageTheme2(0, data.message,'',true);
						}
                  }
			} else {
				$("#" + formId + " #counsolerToSearch").empty();
				$("#" + formId + " #counsolerToSearch").append(
				$('<option>', { value: '', text: 'Select Counsoler' })
				);
				if (data.list && Array.isArray(data.list)) {
				data.list.forEach(c => {
					$("#" + formId + " #counsolerToSearch").append(
					$('<option>', { value: c.id, text: c.name })
					);
				});
				$("#" + formId + "  #counsolerToSearch").val(USER_ID).trigger('change');
				getWatiLogsRecords('watiLogsRecords', '1');
				}
			}
			return false;
		}
	});
}



function getWatiLogsRecords(formId, pageNo){
	let startTime = '';
	let endTime = '';
	const counsolers = $("#"+formId+" #counsolerToSearch").val();
	const counsolerIds = counsolers ? counsolers.join(",") : "";
	const dayType = $("#"+formId+" #searchDateType").val();
	const startDateStr = $("#" + formId + " #startDate").val();
  	const endDateStr = $("#" + formId + " #endDate").val();
	if(dayType == "CUSTOM" && (startDateStr == '' || startDateStr == undefined || endDateStr == '' || endDateStr == undefined)){
		showMessageTheme2(0, "Please select date range.");
		return false;
	}
	if(dayType == "CUSTOM"){
		startTime = parseDateFromDDMMYYYY(startDateStr);
		endTime = parseDateFromDDMMYYYY(endDateStr);
		endTime.setHours(23, 59, 59, 999);
	}else if (dayType === "DAY") {
		startTime = new Date(today);
		startTime.setHours(0, 0, 0, 0);
		endTime = new Date(today);
		endTime.setHours(23, 59, 59, 999);
	} else if (dayType === "WEEK") {
		const dayOfWeek = today.getDay();
		const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		startTime = new Date(today);
		startTime.setDate(today.getDate() + diffToMonday);
		startTime.setHours(0, 0, 0, 0);

		endTime = new Date(startTime);
		endTime.setDate(startTime.getDate() + 6);
		endTime.setHours(23, 59, 59, 999);
	} else if (dayType === "MONTH") {
		startTime = new Date(today.getFullYear(), today.getMonth(), 1);
		startTime.setHours(0, 0, 0, 0);
		endTime = new Date(today);
		endTime.setHours(23, 59, 59, 999);
	}
	if($("#"+formId+" #pageSize").val() == null || $("#"+formId+" #pageSize").val() == undefined || $("#"+formId+" #pageSize").val() == ""){
		showMessageTheme2(0, "Page Size required");
		return false;
	}
	var payload = {};
	payload['counsolerIds'] = counsolerIds;
	payload['startDate'] = convertDatetimeWithFormat(new Date(startTime), USER_TIMEZONE, BASE_TIMEZONE, DATETIME_UTC_FORMATTER);
	payload['endDate'] = convertDatetimeWithFormat(new Date(endTime), USER_TIMEZONE, BASE_TIMEZONE, DATETIME_UTC_FORMATTER);
	payload['pageCount'] = $("#"+formId+" #pageSize").val();
	payload['pageNo'] = parseInt(pageNo);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-wati-Logs-for-student'),
		data : JSON.stringify(payload),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {  //console.log('get data on log call : ' +  JSON.stringify(data)); //console.log('msg : ' +  JSON.stringify(data.message)); console.log('statusCode : ' +  JSON.stringify(data['statusCode']));
			if(data.status == '0' ||  data.status == 'EXCEPTION' ||  data.statusCode == '2' || data.status == '3') {
					if(data.status == '3'){
                      redirectLoginPage();
                  	}else{
						if(showMessage){
							showMessageTheme2(0, data.message,'',true);
						}
                  }
			} 
			else {
				console.log(data)
				$("#watilogsRecordsTable #watilogsRecordsTbody").html(getWatiRecordsList(data));
				var htmlpage=getWatiRecordsListPagging(data);
				$(".watiRecordsListPagging").html(htmlpage);
				if($("#watiLogDetailsModal").length>0){
					$("#watiLogDetailsModal").remove();
				}
				$("body").append(getWatiLogDetailsModal());
			}
			return false;
		}
	});
}


async function showWatiLogDetails(watiContactNo, templateName){
	if(watiContactNo == null || watiContactNo == undefined || watiContactNo == ""){
		showMessageTheme2(0, "Contact Number invalid");
		return false;
	}else if(templateName == null || templateName == undefined || templateName == ""){
		showMessageTheme2(0, "Template Name invalid");
		return false;
	}else{
		var payload = {};
		payload['contactNo'] = watiContactNo;
		payload['templateName'] = templateName;
		var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,'get-wati-templates-by-contact-no',payload,'api/v1/leads');
		console.log("data",data)
		if($("#viewWatiTemplateModal").length>0){
			$("#viewWatiTemplateModal").remove();
		}
		$("body").append(getViewWatiTemplateModal(data.messageTemplates[0].body, data.messageTemplates[0].lastModified));
		// var htmlpage=getWatiRecordsListPagging(data);
		// $(".watiLogDetailsListPagging").html(htmlpage);
		// $("#watiLogDetailsModal").modal("show");
		$("#viewWatiTemplateModal").modal("show");
	}
}


function sendWatiNotificationToUserForStudent(indexNo,templateName,selectedUsers, d_status) {
	$("#successFailedWatiMessagesModal").modal("hide");
	//console.log("status of buton==" + JSON.stringify(d_status));
	
	$("#resetDeleteErrorWarningNo1").click(function(){
		$("#remarksresetDelete2").hide();
	});
	$("#resetDeleteErrorWarningYes1").click(function(){
		$("input#allchecked").prop('checked', false);
		$("input#allcheckedFailed").prop('checked', false);
		$("input#selectStudentAll").prop('checked', false); 
		$('input[name="chk-users-lead"]').prop('checked', false);
		$('input[name="student-move-another"]').prop('checked', false);
	});
	$("#resetDeleteErrorWarningYes2").click(function(){
		$("input#allchecked").prop('checked', false);
		$("input#allcheckedFailed").prop('checked', false);
		$("input#selectStudentAll").prop('checked', false); 
		$('input[name="chk-users-lead"]').prop('checked', false);
		$('input[name="student-move-another"]').prop('checked', false);
	});
	$("#mcustomWatiTemplatesList").click(function(){
		$("#selectStudentAll").prop("checked", false);
	});

	$('#templateName').html('<b>' + templateName + '</b> '); 
	//$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);"  onclick="return showWarningMessageShow(\'Are you sure you want to send this data?\',\'sendWatiNotification( \\\''+templateName+'\\\','+index+') \');">SEND MSG</a>');
	//$('#confirm_btn_data').html('<a id="resend_btn" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	$('#resendWatiMessagesData').html('<a id="resend_btn" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	

	var request={}
	request['userId']=USER_ID;
	request['templateName']=templateName;
	//request['broadcastName']="broadcastName";
	//request['userData']="userData";
	//request['leadID']=leadID; 
	request['selectedUsers']=selectedUsers; 
	//console.log(request);

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','send-wati-message-for-student'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			//if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['statusCode'] == 'E001'|| data['statusCode'] == 'E002') {
			if (data['statusCode'] == 'EX01' || data['statusCode'] == 'E004' ) {
				showMessageTheme2(0, data['message'],'',false);
				$("input#allchecked").prop('checked', false);
				$('input[name="chk-users-lead"]').prop('checked', false);
				return false;
			} else { // $("input#selectStudentAll").removeAttr('checked'); 
				$("#mswatiBroadcastSendThroughMobile").modal("hide");
				$("#mcustomWatiTemplatesList").modal("hide");
				$("input#allcheckedFailed").prop('checked', false);
				$("input#selectStudentAll").prop('checked', false); 
				$('input[name="chk-users-lead"]').prop('checked', false);
				$('input[name="student-move-another"]').prop('checked', false);
				//
				$('#allcheckedFailed').prop('checked', false);
				$('input[name="chk-users-lead-resend"]').prop('checked', false);
				var backgrd_color, err_msg;
				if(data.leadRes!=undefined){
					if(d_status == "send" || d_status == "resend") {		
						openSuccessFailedWatiMessages(data.leadRes, indexNo, templateName);  //successFailedWatiMessagesModal(data.leadRes);
					}
				}
				$("#successFailedWatiMessagesModal").modal("show");
			}

			return false;
		}
	});
	
}


function openSuccessFailedWatiMessages(resp_data,indexSF,templateName) {
	
	//console.log("resp_data :: " + JSON.stringify(resp_data));
	var usrPopDataOnResend = $("#usrPopDataOnResend");
	//usrPopDataOnResend.html('');
	usrPopDataOnResend.html(successFailedWatiMessagesModal(resp_data));

	//console.log( JSON.stringify(usrPopDataOnResend.html()));
	$("#failedWatiTableDiv").slideDown();
	$("#successWatiTableDiv").slideUp();
	$("#successWatiTable").dataTable();

	//if($("#successFailedWatiMessagesModal").length < 1) {
	//$("body").append(successFailedWatiMessagesModal(resp_data))
	//}
	var table = $('#failedWatiTable').DataTable();
	if (table) {
        table.destroy();
    }
	var count=table.rows().count()
	$("#failedWatiTable").dataTable({
		lengthMenu: [[count], [count]],
		lengthChange: false,
		paging: false,
		info: false
        // columnDefs: [
        //     { orderable: false, targets: 0 }
        // ]
    });

	$("#successWatiDiv").css("cursor", "pointer");
	$("#failedWatiDiv").css("cursor", "default");

	$("#chevron_failed").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	$("#chevron_success").removeClass("fa-chevron-down").addClass("fa-chevron-up");

	$("#successWatiDiv").click(function() {
		$("#successWatiTableDiv").slideDown(500);
		$("#failedWatiTableDiv").slideUp(500);
		$("#failedWatiDiv").css("cursor", "pointer");
		$("#successWatiDiv").css("cursor", "default");

		$("#chevron_success").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_failed").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$("#failedWatiDiv").click(function() {
		$("#failedWatiTableDiv").slideDown(500);
		$("#successWatiTableDiv").slideUp(500);
		$("#successWatiDiv").css("cursor", "pointer");
		$("#failedWatiDiv").css("cursor", "default");

		$("#chevron_failed").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_success").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$('#resendWatiMessagesData').html('<a id="resend_btn" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	$('#selectionCountOnFailed').html('<span>Selected- </span><span id="selectedCountFailed">0</span> / <span id="totalCountFailed">0</span>');
	$('#templateNameSF').html();
	$('#templateNameSF').html('<b>' + templateName + '</b> '); //$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);"  onclick="return showWarningMessageShow(\'Are you sure you want to send this data?\',\'sendWatiNotification( \\\''+templateName+'\\\','+index+') \');">SEND MSG</a>');
	boolvalSF =true;
	$('#viewMethodCallingSF').html();
    $('#viewMethodCallingSF').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewWatiTemplate('+boolvalSF+','+indexSF+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	//console.log('mt = ' + templateName);
	$("#resend_btn").click(function () {
		//console.log('clicked on resend') ;;
		var sleads ='';
		var leadNo='';
		$.each($("input[name='chk-users-lead-resend']:checked"), function(){
			leadNo = leadNo+','+$(this).val();
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		if(selectedLeads==''){
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			showWarningMessageShow('Are you sure you want to resend the message?','sendWatiNotificationToUser( '+indexSF+',\''+templateName+'\',\''+selectedLeads+'\',\'resend\')', 'info-modal-sm');
		}
	});

	var totalCheckboxes = $(".checkToSendFailed").length;
    $("#totalCountFailed").text(totalCheckboxes);

	$(".checkToSendFailed").click(function(){
		updateSelectionCount();
		var arrChkBox = [];
		if($(".checkToSendFailed:checked").length>0){
			if($(".checkToSendFailed:checked").length == $(".checkToSendFailed").length){
				$("#allcheckedFailed").prop("checked",true);
			}else{
				$("#allcheckedFailed").prop("checked",false);
			}
			// $("#allcheckedDiv").addClass("d-inline-block").removeClass("d-none");
		}else{
			// $("#allcheckedDiv").addClass("d-none").removeClass("d-inline-block");
			$("#allcheckedFailed").prop("checked",false);
		}
	});
	$("#allcheckedFailed").click(function(){
		if($(this).prop("checked")){
			$(".checkToSendFailed").prop("checked",true);
		}else{
			$(".checkToSendFailed").prop("checked",false);
		}
		updateSelectionCount();
	});

	function updateSelectionCount(){
        var selectedCountFailed = $(".checkToSendFailed:checked").length;
        $("#selectedCountFailed").text(selectedCountFailed);
    }
}

function closeModalAndFlushData(){
	// if (emailStatusInterval) {
	// 	clearInterval(emailStatusInterval);
	// 	emailStatusInterval = null;
	// }
	// pendingEmails = [];
	// successfulEmails = [];
	// failedOrOtherEmails = [];
	$("input#allchecked").prop('checked',false);
	$("input#allCheckedEmail").prop('checked',false);
	$('input[name="chk-users-lead"]').prop('checked',false);
	$('input[name="chk-users-lead-email"]').prop('checked',false);
	$(".stmsg").html('');
	$("#successFailedWatiMessagesModalClose").modal("hide");
	$('#allchecked').prop('checked',false);
	$('#allCheckedEmail').prop('checked',false);
	//added to flush all checked box
	$("input#selectStudentAll").prop('checked',false);
	$('input[name="student-move-another"]').prop('checked',false);
	$("#studentIdMove").val("");
	$("#remarksresetDelete1").remove();
	$(".modal-backdrop").remove();
}


