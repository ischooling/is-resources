var scriptRun = false;
var successfulEmails = [];
var failedOrOtherEmails = [];

function getOnboardedTeacherListData(type,callFrom){
	url=CONTEXT_PATH+UNIQUEUUID+"/dashboard/onboarded-teacher-list-data";
    customLoader(true);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : url,
		data : JSON.stringify(getRequestForOnboardedTeacherList(type)),
		dataType : 'json',
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				$('#onboardedTeacherListTable tbody').empty();
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
				$('#pagination').twbsPagination('destroy');
				$('#consolidate').html('');
				$('#onboardedTeacherListTable tbody').empty();
				$("#onboardedTeacherList #onboardedTeacherListTable tbody").html('<tr><td class="text-center">No records found</td></tr>');
				$("#selectTeacherAllDiv").attr("class","hidden")
			} else {
				$("#selectTeacherAllDiv").attr("class","block")
				$('#onboardedTeacherListTable tbody').empty();
				$("#onboardedTeacherList #onboardedTeacherListTable tbody").html(cardDetails(data))
				if(type == 1){
					pageCount(data.count)				
				}
			}
			$("body").append(getWatiTemplatesHtml());
			$("#selectTeacherAll").off('click').on('click', function () {
				var studentnew = $("#teacherIdMove").val();
				var chkAll = this;
				let chkRows = $("#onboardedTeacherListTable").find(".checkTeacher");
				chkRows.each(function () {
					$(this)[0].checked = chkAll.checked;
				});
				var studentNo='';

				$.each($("input[name='teacher-move-another']:checked"), function(){
					if(studentnew.indexOf($(this).val()) != -1){
					}else{
						studentNo = studentNo+','+$(this).val();
					}
				});

				studentnew = studentnew + studentNo;
				$("#teacherIdMove").val(studentnew);
				if($("#selectTeacherAll").is(":checked")){}
				else{
					$("#teacherIdMove").val('');
				}
			});

			$(".checkTeacher").off('click').on('click', function () {
				var studentnew = $("#teacherIdMove").val();
				var chkAll = $("#selectTeacherAll");
				chkAll.attr("checked", "checked");
				$("#onboardedTeacherListTable .checkTeacher").each(function () {
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
				$.each($("input[name='teacher-move-another']:checked"), function(){
					if(studentnew.indexOf($(this).val()) != -1){
					}else{
						studentNo = studentNo+','+$(this).val();
					}  
				});
				studentnew = studentnew + studentNo;
				$("#teacherIdMove").val(studentnew);
			});
			$('[data-toggle="tooltip"]').tooltip({
				html: true
			});
			customLoader(false);
			return false;
		}
	});
}

function getRequestForOnboardedTeacherList(type){
	var request={};
	var TeacherListRequestDTO={};
	TeacherListRequestDTO['schoolId'] = SCHOOL_ID;
	TeacherListRequestDTO['loginUserId'] = USER_ID;
	TeacherListRequestDTO['teacherName'] = $('#teacherName').val();
	TeacherListRequestDTO['email'] = $('#teacherEmail').val();
	TeacherListRequestDTO['applicationNo'] = $('#applicationNo').val();
	if($('#learningPlatform').val()!=''){
		TeacherListRequestDTO['lmsPlatformId'] = $('#learningPlatform').val();
	}
	if($('#gradeId').val()!=''){
		TeacherListRequestDTO['standardId'] = $('#gradeId').val();
	}
	if($('#subjectId').val()!=''){
		TeacherListRequestDTO['courseId'] = $('#subjectId').val();
	}
	if($('#countryId').val()!=''){
		TeacherListRequestDTO['countryId'] =$('#countryId').val();
	}
	var pageNumber=$('#pageNumber').val();
	pageNumber=pageNumber-1
	if(pageNumber<0){
		pageNumber=0;
	}
	if(type == 1){
		pageNumber=0;
	}
	TeacherListRequestDTO['pageNumber'] = pageNumber;
	TeacherListRequestDTO['pageSize'] = $('#pageSize').val();
	request['teacherListRequestDTO']=TeacherListRequestDTO;
	console.log(TeacherListRequestDTO)
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
				getOnboardedTeacherListData(2,"")
			}
			//$(".getPaymentReportData")[0].onclick();
			//fetch content and render here
			//$("#page-content").text ("Page? + page) + ?content here";
		}  
	});  
}


function resetOnboardedTeacherListForm(formID){
	$('#teacherName').val('');
	$('#teacherEmail').val('');
	$('#applicationNo').val('');
	$('#'+formID+" #learningPlatform").val($('#' + formID + ' #learningPlatform option:first').val()).trigger("change");
	$('#'+formID+" #gradeId").val("").trigger("change");
	$('#'+formID+" #subjectId").val("").trigger("change");
	$('#'+formID+" #countryId").val("").trigger("change");
	$('#'+formID+" #pageSize").val("10").trigger("change");
}

function downloadOnboardedTeacherListReport(formId, forCountOnly, type){
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
		$("input#selectTeacherAll").prop('checked','');
		$('input[name="teacher-move-another"]').prop('checked','');
		$("#teacherIdMove").val("");
	});
	
	var movestudentNo = $("#teacherIdMove").val();
	if(movestudentNo==''){
		showMessageTheme2(0, 'Please check any one teacher','',false);
		return false;
	}
	hideMessageTheme2('');
	var students=$("#teacherIdMove").val();
	var selected = new Array();
	$('input[name="teacher-move-another"]').each(function() {
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
				});
				$('#mcustomWatiTemplatesList').modal('show');
				
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
					if(formId === 'mailLogsRecords'){
						getMailLogsRecords('mailLogsRecords', '1');
					}else{
						getWatiLogsRecords('watiLogsRecords', '1');
					}
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
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-wati-Logs-for-teacher'),
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


async function showWatiLogDetails(broadCastId,watiContactNo, templateName){
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
		payload['broadcastId'] = broadCastId;
		payload['usertimezone'] = USER_TIMEZONE;
		var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,'get-wati-templates-by-contact-no',payload,'api/v1/leads');
		console.log("data",data)
		if($("#viewWatiTemplateModal").length>0){
			$("#viewWatiTemplateModal").remove();
		}
		$("body").append(getViewWatiTemplateModal(data.messageTemplates));
		$("#viewWatiTemplateModal").modal("show");
	}
}
async function showWatiLogDetailsByTeacherUserId(userId){
	var payload = {};
	payload['userId'] = userId;
	payload['userTimezone'] = USER_TIMEZONE;
	var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,'get-wati-broadcast-by-teacher-userId',payload,'api/v1/leads');
	console.log("data",data)
	if($("#viewWatiTemplateModal").length>0){
		$("#viewWatiTemplateModal").remove();
	}
	$("body").append(getViewWatiTemplateModal(data.messageTemplates));
	$("#viewWatiTemplateModal").modal("show");
}

function sendWatiNotificationToUserForTeacher(indexNo,templateName,selectedUsers, d_status) {
	$("#successFailedWatiMessagesModal").modal("hide");
	//console.log("status of buton==" + JSON.stringify(d_status));
	
	$("#resetDeleteErrorWarningNo1").click(function(){
		$("#remarksresetDelete2").hide();
	});
	$("#resetDeleteErrorWarningYes1").click(function(){
		$("input#allchecked").prop('checked', false);
		$("input#allcheckedFailed").prop('checked', false);
		$("input#selectTeacherAll").prop('checked', false); 
		$('input[name="chk-users-lead"]').prop('checked', false);
		$('input[name="teacher-move-another"]').prop('checked', false);
	});
	$("#resetDeleteErrorWarningYes2").click(function(){
		$("input#allchecked").prop('checked', false);
		$("input#allcheckedFailed").prop('checked', false);
		$("input#selectTeacherAll").prop('checked', false); 
		$('input[name="chk-users-lead"]').prop('checked', false);
		$('input[name="teacher-move-another"]').prop('checked', false);
	});
	$("#mcustomWatiTemplatesList").click(function(){
		$("#selectTeacherAll").prop("checked", false);
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
		url : getURLFor('leads','send-wati-message-for-teacher'),
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
			} else { // $("input#selectTeacherAll").removeAttr('checked'); 
				$("#mswatiBroadcastSendThroughMobile").modal("hide");
				$("#mcustomWatiTemplatesList").modal("hide");
				$("input#allcheckedFailed").prop('checked', false);
				$("input#selectTeacherAll").prop('checked', false); 
				$('input[name="chk-users-lead"]').prop('checked', false);
				$('input[name="teacher-move-another"]').prop('checked', false);
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
	$("input#selectTeacherAll").prop('checked',false);
	$('input[name="teacher-move-another"]').prop('checked',false);
	$("#teacherIdMove").val("");
	$("#remarksresetDelete1").remove();
	$(".modal-backdrop").remove();
}

function getMailLogsFilterRecords(){
	if($("#mailLogsRecordsFilterModal").length<1){
		$("body").append(getMailLogsRecordsFilterModal());
		$("#mailLogsRecordsFilterModal #endDateDiv").hide();
		$("#mailLogsRecordsFilterModal #endDateDiv").hide();
		$("#mailLogsRecordsFilterModal #searchDateType").on("change", function(){
			if($(this).val() === "CUSTOM"){
				$("#mailLogsRecordsFilterModal #endDate").val('');
				$("#mailLogsRecordsFilterModal #endDate").val('');
				$("#mailLogsRecordsFilterModal #endDateDiv").show();
				$("#mailLogsRecordsFilterModal #endDateDiv").show();
			}else{
				$("#mailLogsRecordsFilterModal #endDate").val('');
				$("#mailLogsRecordsFilterModal #endDate").val('');
				$("#mailLogsRecordsFilterModal #endDateDiv").hide();
				$("#mailLogsRecordsFilterModal #endDateDiv").hide();
			}
		});
		$("#mailLogsRecordsFilterModal #startDate").datepicker({
			format : 'dd-mm-yyyy',
			autoclose: true,
		});
		$("#mailLogsRecordsFilterModal #endDate").datepicker({
			format : 'dd-mm-yyyy',
			autoclose: true,
		});
		$("#mailLogsRecords #counsolerToSearch").select2({
			theme:"bootstrap4",
			dropdownParent:"#mailLogsRecords"
		});
	}
	$("#mailLogsRecordsFilterModal").modal("show");
	setTimeout(function(){ getWatiLogsCounsolerNames('mailLogsRecords');}, 500);	
}

function getMailLogsRecords(formId, pageNo){
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
	payload['timezone'] = USER_TIMEZONE;
	payload['startDate'] = convertDatetimeWithFormat(new Date(startTime), USER_TIMEZONE, BASE_TIMEZONE, DATETIME_UTC_FORMATTER);
	payload['endDate'] = convertDatetimeWithFormat(new Date(endTime), USER_TIMEZONE, BASE_TIMEZONE, DATETIME_UTC_FORMATTER);
	payload['pageCount'] = $("#"+formId+" #pageSize").val();
	payload['pageNo'] = parseInt(pageNo);
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-brevo-mail-Logs-for-teacher'),
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
				$("#maillogsRecordsTable #maillogsRecordsTbody").html(getMailRecordsList(data));
				var htmlpage=getMailRecordsListPagging(data);
				$(".mailRecordsListPagging").html(htmlpage);
				if($("#mailLogDetailsModal").length>0){
					$("mailLogDetailsModal").remove();
				}
			}
			return false;
		}
	});
}
function getEmailBroadcastTemplates(){
	var movestudentNo = $("#teacherIdMove").val();
	if(movestudentNo==''){
		showMessageTheme2(0, 'Please check any one teacher','',false);
		return false;
	}
	hideMessageTheme2('');
	var students=$("#teacherIdMove").val();
	var selected = new Array();
	$('input[name="student-move-another"]').each(function() {
		selected.push($(this).val());
   	});
	//console.log("selected from allchecked :: " + selected);
	students=students.substring(1,students.lenght)
	var request={}
	request['userId']=USER_ID;
	request['students']=students;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-broadcast-teacher-list-mail-template'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2' || data['statusCode'] == 'E001' || data['statusCode'] == 'E002') {
				showMessageTheme2(0, data['message'],'',false);
			} else {
				emailTemplateContent=data;
				$.each(emailTemplateContent.emailTemplate, function(index, obj) {
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
				
				var allEmailTemplatesListPopup = $("#allEmailTemplatesList");
				allEmailTemplatesListPopup.html('');
				$("#allEmailTemplatesList").html(customEmailTemplatesList(data.responseBody));
				var isDataTable = $.fn.dataTable.isDataTable("#emailBroadcastTable");
				if(isDataTable){
					$("#emailBroadcastTable").dataTable().fnDestroy();
				}
				$("#emailBroadcastTable").DataTable({
					theme:"bootstrap4",
				});
				$('#customEmailTemplatesList').modal('show');
				
				var userListPopup = $("#userPopDataEmail");
				userListPopup.html(emailBroadcastSendModal(data));

				$("#emailBroadcastSendModal").modal("hide");
				return false;
			}
			return false;
		}
	});
}

function sendEmailNotificationToUser(indexNo,templateName, subject, leadID, d_status,templateId) {	
	templateName = decode2(templateName)
	subject = decode2(subject)
	$("#resetDeleteErrorWarningNo1").click(function(){
		$("#remarksresetDelete2").hide();
	});
	$("#resetDeleteErrorWarningYes1").click(function(){
		$("input#allCheckedEmail").prop('checked', false);
		$("input#allCheckedFailedEmail").prop('checked', false);
		$("input#selectStudentAll").prop('checked', false); 
		$('input[name="chk-users-lead-email"]').prop('checked', false);
		$('input[name="student-move-another"]').prop('checked', false);
	});
	$("#resetDeleteErrorWarningYes2").click(function(){
		$("input#allCheckedEmail").prop('checked', false);
		$("input#allCheckedFailedEmail").prop('checked', false);
		$("input#selectStudentAll").prop('checked', false); 
		$('input[name="chk-users-lead-email"]').prop('checked', false);
		$('input[name="student-move-another"]').prop('checked', false);
	});
	$("#customEmailTemplatesList").click(function(){
		$("#selectStudentAll").prop("checked", false);
	});

	$('#templateNameEmail').html('<b>' + templateName + '</b> '); 
	var selectedLeadIds = leadID.split(',');
	var filteredEmailContent = JSON.parse(JSON.stringify(emailTemplateContent));
	filteredEmailContent.users = filteredEmailContent.users.filter(function(user) {
		return selectedLeadIds.includes(user.leadId);
	});

	var request={}
	request['userId']=USER_ID;
	request['templateId']=templateId;
	request['teacherList']=true;
	request['sendBestTime']= $("input[name='mailBroadcastTime']:checked").val() == "now"? false: true;
	request['recipientsUserDetails'] = filteredEmailContent.users.map(user => ({
		email: user.email,
		grade: user.grade,
		fullName: user.name,
		firstName: user.name.split(' ')[0],
		leadId: user.leadId,

	}));
	request['templateSubject']=subject;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','send-broadcast-lead-mail'),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == 'EX01' || data['statusCode'] == 'E004' ||  data['statusCode'] == 'FAILED' || data['statusCode'] == '0' ||  data['status'] == '0') {
				showMessageTheme2(0, data['message'],'',false);
				$("input#allCheckedEmail").prop('checked', false);
				$('input[name="chk-users-lead-email"]').prop('checked', false);
				return false;
			} else {
				// if (d_status === 'resend') {
				// 	let selectedEmails = [];
				// 	$(".checkToSendEmailFailed:checked").each(function () {
				// 		let email = $(this).data("email");
				// 		if (email) selectedEmails.push(email);
				// 	});
				
				// 	pendingEmails = emailTemplateContent.users
				// 		.filter(user => selectedEmails.includes(user.email))
				// 		.map(user => user.email);
					
				// 	pendingEmails = [...new Set(pendingEmails)];
				// 	emailTemplateContent.users = emailTemplateContent.users.filter(user => selectedEmails.includes(user.email));
				// } else {
				// 	pendingEmails = emailTemplateContent.users.map(user => user.email);
				// }
				$("#emailBroadcastSendModal").modal("hide");
				$("#customEmailTemplatesList").modal("hide");
				$("#sendConfirmationModal").modal("hide");
				$("input#allCheckedFailedEmail").prop('checked', false);
				$("input#selectStudentAll").prop('checked', false); 
				$('input[name="chk-users-lead-email"]').prop('checked', false);
				$('input[name="student-move-another"]').prop('checked', false);
				$('#allCheckedFailedEmail').prop('checked', false);
				$('input[name="chk-users-lead-email-resend"]').prop('checked', false);
				$("#successFailedEmailMessagesModal").remove();
				$("body #usrPopDataOnResendEmail").append(`<div id="successFailedEmailMessagesModal" class="modal fade fade-scale" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true"></div>`);
				$("#successFailedEmailMessagesModal").html(successFailedEmailMessagesModal(emailTemplateContent));
				successfulEmails = emailTemplateContent.users
				failedOrOtherEmails = [];
				$("#successfulEmailsCount").text(emailTemplateContent.users.length);
				$("#failedEmailsCount").text(0);
				$("#successEmailTableDiv").html(successEmailTableContent());
				$("#failedEmailTableDiv").html(failedEmailTableContent());
				$('#selectionCountOnFailedEmail').html('<span>Selected- </span><span id="selectedCountEmailFailed">0</span> / <span id="totalCountEmailFailed">0</span>');
				var totalCheckboxes = $(".checkToSendEmailFailed").length;
				$("#totalCountEmailFailed").text(totalCheckboxes);

				$(".checkToSendEmailFailed").click(function(){
					updateSelectionCountEmailSF();
					var arrChkBox = [];
					if($(".checkToSendEmailFailed:checked").length>0){
						if($(".checkToSendEmailFailed:checked").length == $(".checkToSendEmailFailed").length){
							$("#allCheckedFailedEmail").prop("checked",true);
						}else{
							$("#allCheckedFailedEmail").prop("checked",false);
						}
					}else{
						$("#allCheckedFailedEmail").prop("checked",false);
					}
				});
				$("#allCheckedFailedEmail").click(function(){
					if($(this).prop("checked")){
						$(".checkToSendEmailFailed").prop("checked",true);
					}else{
						$(".checkToSendEmailFailed").prop("checked",false);
					}
					updateSelectionCountEmailSF();
				});
			
				function updateSelectionCountEmailSF(){
					var selectedCountEmailFailed = $(".checkToSendEmailFailed:checked").length;
					$("#selectedCountEmailFailed").text(selectedCountEmailFailed);
				}
				openSuccessFailedEmailMessages(indexNo, templateName, subject, templateId);
				setTimeout(() => {
					$("#successFailedEmailMessagesModal").modal("show");
				}, 1000);
				// emailStatusInterval = setInterval(function() {
				// 	getStatusOfSentEmails(data.actionId);
				// }, 10000);
			}
		}
	});
}

function openSuccessFailedEmailMessages(indexSF,templateName, subject, templateId) {
	if($("#successFailedEmailStyle").length < 1){
		$("head").append(`
			<style id="successFailedEmailStyle">
				#successEmailTable, #failedEmailTable {
					border-collapse: collapse;
					border-radius: 10px;
				}
				#successEmailTable td, th , #failedEmailTable td, th {
					border: 1px solid #f7f7f7;
				}
				#successEmailTable tr:nth-child(odd), #failedEmailTable tr:nth-child(odd) {
					background-color: #F7F7F7;
				}
			</style>
		`)
	}
	$("#successEmailTableDiv").slideDown();
	$("#failedEmailTableDiv").slideUp();
	$("#successEmailTable").dataTable();
	var table = $('#failedEmailTable').DataTable();
	if (table) {
        table.destroy();
    }
	var count=table.rows().count()
	$("#failedEmailTable").dataTable({
		lengthMenu: [[count], [count]],
		lengthChange: false,
		paging: false,
		info: false
    });

	$("#successEmailDiv").css("cursor", "pointer");
	$("#failedEmailDiv").css("cursor", "default");

	$("#chevron_failed_email").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	$("#chevron_success_email").removeClass("fa-chevron-down").addClass("fa-chevron-up");

	$("#successEmailDiv").click(function() {
		$("#successEmailTableDiv").slideDown(500);
		$("#failedEmailTableDiv").slideUp(500);
		$("#failedEmailDiv").css("cursor", "pointer");
		$("#successEmailDiv").css("cursor", "default");

		$("#chevron_success_email").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_failed_email").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$("#failedEmailDiv").click(function() {
		$("#failedEmailTableDiv").slideDown(500);
		$("#successEmailTableDiv").slideUp(500);
		$("#successEmailDiv").css("cursor", "pointer");
		$("#failedEmailDiv").css("cursor", "default");

		$("#chevron_failed_email").removeClass("fa-chevron-down").addClass("fa-chevron-up");
		$("#chevron_success_email").removeClass("fa-chevron-up").addClass("fa-chevron-down");
	});

	$('#resendEmailMessagesData').html('<a id="resend_btn_email" class="btn btn-primary px-3 py-2 mr-2 mt-3 float-right" href="javascript:void(0);">Resend</a>');
	$('#selectionCountOnFailedEmail').html('<span>Selected- </span><span id="selectedCountEmailFailed">0</span> / <span id="totalCountEmailFailed">0</span>');
	$('#templateNameEmailSF').html();
	$('#templateNameEmailSF').html('<b>' + templateName + '</b> ');
	boolvalSF =true;
	$('#viewMethodCallingEmailSF').html();
    $('#viewMethodCallingEmailSF').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewEmailTemplate('+boolvalSF+','+indexSF+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	$("#resend_btn_email").click(function () {
		var sleads ='';
		var leadNo='';
		$.each($("input[name='chk-users-lead-email-resend']:checked"), function(){
			leadNo = leadNo+','+$(this).val();
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		if(selectedLeads==''){
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			// showWarningMessageShow('Are you sure you want to resend the message?','sendEmailNotificationToUser( '+indexSF+',\''+templateName+'\',\''+subject+'\',\''+selectedLeads+'\',\'resend\',\''+templateId+'\')', 'info-modal-sm');
		}
	});

	var totalCheckboxes = $(".checkToSendEmailFailed").length;
    $("#totalCountEmailFailed").text(totalCheckboxes);

	$(".checkToSendEmailFailed").click(function(){
		updateSelectionCountEmailSF();
		var arrChkBox = [];
		if($(".checkToSendEmailFailed:checked").length>0){
			if($(".checkToSendEmailFailed:checked").length == $(".checkToSendEmailFailed").length){
				$("#allCheckedFailedEmail").prop("checked",true);
			}else{
				$("#allCheckedFailedEmail").prop("checked",false);
			}
		}else{
			$("#allCheckedFailedEmail").prop("checked",false);
		}
	});
	$("#allCheckedFailedEmail").click(function(){
		if($(this).prop("checked")){
			$(".checkToSendEmailFailed").prop("checked",true);
		}else{
			$(".checkToSendEmailFailed").prop("checked",false);
		}
		updateSelectionCountEmailSF();
	});

	function updateSelectionCountEmailSF(){
        var selectedCountEmailFailed = $(".checkToSendEmailFailed:checked").length;
        $("#selectedCountEmailFailed").text(selectedCountEmailFailed);
    }
}

function updateEmailLogsLink(leadId){ 
	$("#email_logs_link_"+leadId).show();
}

function successFailedEmailMessagesModal(allData) {
	var html = 
		`<div class="modal-dialog" style="width:40%;">
			<div class="d-flex flex-wrap email-wrapper">
				<div class="modal-content border-0">
					<div class="modal-header py-1 bg-primary text-white align-items-center">
						<div class="d-flex align-items-center fsize-1 mb-0">
							<button type="button" class="btn btn-primary btn-sm d-flex align-items-center mr-2" style='gap:5px;' onclick="selfModalHide('successFailedEmailMessagesModal');gotoBackEmailModal()">
								<svg style='width:15px;' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
								</svg>
								<span>Back</span>
							</button>
							<span class="">Selected Template: </span>
							<span class="" id="templateNameEmailSF"></span>
							<span class="" id="viewMethodCallingEmailSF"></span>
						</div>
						<div class="d-flex align-items-center">
							<button id="successFailedEmailMessagesModalClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger " onclick="selfModalHide('successFailedEmailMessagesModal'); closeModalAndFlushData();">&times;</button>
						</div>
					</div>

					<div class="modal-body pt-1" style='max-height: 500px;overflow-y: auto;'>
						<div id="preSuccessFailedDiv" style="display:none !important;">
							<table id="preSuccessFailedTable" class="table mt-1 mb-0" style="font-size:14px;min-width:450px;">
								<thead>
									<tr style='background-color:#E7F3FF'>
										<th style='width:80px;' class="rounded-top-left-5 px-1 text-primary">S. No.</th>
										<th class="px-1 text-primary">Name</th>
										<th class="rounded-top-right-5 text-primary">Email</th>
									</tr>
								</thead>
								<tbody class="lead-table-css">`
									if(allData != null){
										$.each(allData.users, function(index, value){
											var count = index + 1;
											if(value.phoneNumber != null && value.phoneNumber != ''){
												var statusIcon = `<i id="statusIcon_${value.leadId}" class="fa fa-spinner text-warning ml-2 fancytree-helper-spin"></i>`;
												if (value.status === "success") {
													statusIcon = `<i id="statusIcon_${value.leadId}" class="fa fa-check-circle text-success ml-2"></i>`;
												}
												html+=`<tr>
													<td>
														<p class="m-0 font-weight-bold font-12">`+count+`</p>
													</td>
													<td>
														<p class="m-0 font-weight-bold font-12"><span id="esmsg_`+value.leadId+`">`+value.name+`</span></p>
													</td>
													<td>
														<p class="m-0 font-12">` + value.email + statusIcon + `</p>
													</td>
												</tr>`;
											}
										});
									}
								html+=`</tbody>
							</table>
						</div>

						<div id="finalSuccessFailedDiv" class="d-flex flex-column" style='gap: 10px;'>
							<div id="successEmailDiv" class="border border-success rounded-10">
								<div class="d-flex justify-content-between align-items-center">
									<p class="m-0 p-1 d-flex align-items-center" style='gap:5px;'>
										<span id="successfulEmailsCount" style='padding: 1px 5px;font-size:10px;' class="bg-primary rounded-5 text-white">`+ successfulEmails.length +`</span>
										<span class="font-weight-bold">Message Sent</span>
										<i class="fa fa-solid fa-check bg-success text-white rounded-circle" style='width:16px;height:16px;text-align:center;padding: 3px;font-size: 10px;'></i>
									</p>
									<i id='chevron_success_email' class="fa fa-solid fa-chevron-down text-success px-2"></i>
								</div>	
								<div id="successEmailTableDiv" class="full table-responsive px-1 font-12">
									
								</div>
							</div>
							
							<form id="resendEmailMessages" class="full d-flex flex-column" action="javascript:void(0);">
								<div id='failedEmailDiv' class='border border-danger rounded-10'>
									<div class="d-flex justify-content-between align-items-center">
										<p class="m-0 p-1 d-flex align-items-center" style='gap:5px;'>
											<span id="failedEmailsCount" style='padding: 1px 5px;font-size:10px;' class="bg-danger rounded-5 text-white">`+ failedOrOtherEmails.length +`</span>
											<span class="font-weight-bold">Message Not Sent</span>
											<i class="fa fa-solid fa-exclamation text-white bg-danger rounded-circle" style='width:16px;height:16px;text-align:center;padding: 3px;font-size: 10px;'></i>
										</p>
										<i id='chevron_failed_email' class="fa fa-solid fa-chevron-down text-danger px-2"></i>
									</div>

									<div id="failedEmailTableDiv" class="full table-responsive px-1 font-12"></div>
								</div>
								${(failedOrOtherEmails.length > 0)? '<div id="resendEmailMessagesData">Resend</div>' :''}
							</form>
						</div>
					</div>
				</div>
			</div>

			<div id="previewEmailModalThird" class="modal-content border-0 email-template hide-email-template" style="max-width:450px;">
				<div class="modal-header text-white bg-primary" style='padding: 6.5px;'>
					<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
					<button type="button" class="close text-white" onclick="viewEmailTemplate(false)"><span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body px-1">
					<div class="mx-auto">
						${/*<div class="mobile-frame-top-bar">
							<div class="status-bar">
								<div class="time">`;
									var D = new Date();
									var H = D.getHours();
									var M = D.getMinutes(); 
										H>12?H=H -12:H;
										M<10?M='0'+M:M;
								html+=`${H}:${M}</div>
								<div class="icons">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
										<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
									</svg>
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
										<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
									</svg>
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
										<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
									</svg>
								</div>
							</div>
							<div class="header">
								<span class="d-inline-block" style="line-height: 0px;">
									<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
										<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
									</svg>
								</span>
								<span class="circle">Email</span>
								<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
									<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
										<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
									</svg>
								</span>
							</div>
						</div>*/''}
						<div class="screen">
							<div class="content">
								<div class="full" id="previewEmailTemplateThird" style="font-size:13px"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function getEmailBroadcastLogsTemplate2(actionId,userEmail){
	var body = {
		actionId: actionId,
		email: userEmail,
		schoolId: SCHOOL_ID
	}
	$.ajax({
		type: "POST",
		contentType : APPLICATION_JSON_VALUE,
		url: getURLFor('leads', 'get-broadcast-mail-statistics'),
		data: JSON.stringify(body),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success: function (response) {
			if(response.status == 0){
				showMessageTheme2(0, response.message);
			}else{
				$("#emailBroadcastLogsTemplatePreview2").html(getViewTemplateEmail(response.logObject.body))
				$("#emailBroadcastLogsTemplate2").modal("show");
				$("#emailBroadcastLogsModal .modal-dialog").animate({
					'margin-left': '15%'
				}, 300);
				$(".email-wrapper").addClass("active-email-template");
				$(".email-template").addClass("show-email-template");
				$(".email-template").removeClass("hide-email-template");
			}
		}
	});
}

function getMailLogUser(userId){
	var payload = {};
	payload['userId'] = userId;
	payload['timezone'] = USER_TIMEZONE;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-brevo-mail-Logs-for-teacher-id'),
		data : JSON.stringify(payload),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
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
				if($("#mailLogUserRecordsModal").length<1){
					$("body").append(getMailLogUserRecordsModal());
				}
				$("#mailLogUserRecordsModal").modal("show");
				$("#maillogUserRecordsTable #maillogUserRecordsTbody").html(getMailRecordsList(data));
			}
			return false;
		}
	});
}
