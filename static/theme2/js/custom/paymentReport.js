var scriptRun = false;
var successfulEmails = [];
var failedOrOtherEmails = [];
var PAYMENT_REPORT_TAB_ENDPOINTS = {
	'basic-detail': '/dashboard/student-payment-report/basic-detail',
	'parent-detail': '/dashboard/student-payment-report/basic-detail',
	'contact-info': '/dashboard/student-payment-report/basic-detail',
	'academic-detail': '/dashboard/student-payment-report/basic-detail',
	'payment': '/dashboard/student-payment-report/basic-detail',
	'communication-log': '/dashboard/student-payment-report/basic-detail',
	'log-reports': '/dashboard/student-payment-report/basic-detail'
};

function bindPaymentReportAccordions(context){
	$(context || document).find(".follow-up-no").off('click.paymentReport').on('click.paymentReport', function(){
		$(this).find(".fa-angle-down").toggleClass('fa-angle-down fa-angle-up');
		$(this).parent().siblings().find(".fa-angle-up").toggleClass('fa-angle-up fa-angle-down');
		$(this).parent().find(".follow-up-content").slideDown();
		$(this).parent().siblings().find(".follow-up-content").slideUp();
		$(this).parent().addClass("follow-up-accordian-active");
		$(this).parent().siblings().removeClass("follow-up-accordian-active");
	});
}

function bindPaymentReportTabEvents(){
	$("#studentPaymentReportTable").find(".payment-report-tab-link").off('shown.bs.tab.paymentReport').on('shown.bs.tab.paymentReport', function(){
		var $tab = $(this);
		var tabKey = $tab.attr('data-tab-key');
		var studentStandardId = $tab.attr('data-student-standard-id');
		var userId = $tab.attr('data-user-id');
		if(tabKey == 'summary'){
			return;
		}
		var $row = $("#payment-report-row-" + studentStandardId);
		if($row.attr('data-report-mode') == 'full'){
			if(tabKey == 'communication-log'){
				ensurePaymentReportCommunicationLogLoaded(studentStandardId, userId);
			}
			return;
		}
		if($row.attr('data-loading') == 'Y'){
			return;
		}
		loadPaymentReportTab(tabKey, studentStandardId, userId);
	});
}

function getPaymentReportDetailRequest(tabKey, studentStandardId){
	var request = getRequestForPaymentReport('studentPaymentForm', 2, 'N');
	if(request && request.paymentReportRequestDTO){
		request.paymentReportRequestDTO['studentStandardId'] = parseInt(studentStandardId, 10);
		request.paymentReportRequestDTO['pageNumber'] = 0;
		request.paymentReportRequestDTO['pageSize'] = 1;
		request.paymentReportRequestDTO['type'] = 2;
	}
	return request;
}

function ensurePaymentReportCommunicationLogLoaded(studentStandardId, userId){
	var $list = $(".followup-remark-" + studentStandardId);
	if($list.length > 0 && $list.attr('data-loaded') != 'Y'){
		$list.attr('data-loaded', 'Y');
		getCommunicationLogList(studentStandardId, userId);
	}
}

function initializePaymentReportFullRow(studentStandardId, userId, tabKey){
	var $row = $("#payment-report-row-" + studentStandardId);
	$row.find(".re-leadstatus").select2({
		theme:'bootstrap4',
	});
	bindPaymentReportAccordions($row);
	bindPaymentReportTabEvents();
	$('[data-toggle="tooltip"]').tooltip({
		html: true
	});
	if(tabKey == 'communication-log'){
		ensurePaymentReportCommunicationLogLoaded(studentStandardId, userId);
	}
}

function loadPaymentReportTab(tabKey, studentStandardId, userId){
	var endpoint = PAYMENT_REPORT_TAB_ENDPOINTS[tabKey];
	var $row = $("#payment-report-row-" + studentStandardId);
	if(!endpoint || !$row.length){
		return;
	}
	var isChecked = $("#student-" + userId).is(":checked");
	var currentSno = $.trim($row.find(".mx-2").first().text()).replace('.', '');
	var tabSelector = "#payment-report-tab-" + tabKey + "-" + studentStandardId;
	var paneSelector = $(tabSelector).attr('href');
	$row.attr('data-loading', 'Y');
	if(paneSelector){
		$(paneSelector).html('<div class="text-center text-muted py-4">Loading data...</div>');
	}
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : CONTEXT_PATH + UNIQUEUUID + endpoint,
		data : JSON.stringify(getPaymentReportDetailRequest(tabKey, studentStandardId)),
		dataType : 'json',
		success : function(data) {
			$row.attr('data-loading', 'N');
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3' || !data.reports || data.reports.length < 1) {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'] || 'Unable to load data','',true);
				}
				if(paneSelector){
					$(paneSelector).html('<div class="text-center text-muted py-4">Unable to load data.</div>');
				}
				return false;
			}
			var report = data.reports[0];
			if(currentSno != ''){
				report.sno = currentSno;
			}
			$row.replaceWith(cardDetails({reports:[report]}));
			if(isChecked){
				$("#student-" + userId).prop('checked', true);
			}
			initializePaymentReportFullRow(studentStandardId, userId, tabKey);
			$("#payment-report-tab-" + tabKey + "-" + studentStandardId).tab('show');
			return false;
		},
		error : function() {
			$row.attr('data-loading', 'N');
			if(paneSelector){
				$(paneSelector).html('<div class="text-center text-muted py-4">Unable to load data.</div>');
			}
		}
	});
}

function paymentReportEventLoad(){
	const getUserRoleForMonitoring = getSettingsByTypeAndKey('CONFIGURATION','DONT_SHOW_ACTIVITY_TRACKER_ROLE');
	const metaValue = JSON.parse(getUserRoleForMonitoring)?.data?.metaValue;
	const rolesToSkip = metaValue.split(',').map(r => $.trim(r));
	if (!rolesToSkip.includes(USER_ROLE)) {
		if($("#userActivityTimer").length == 0){
			$("head").append(`<script id="userActivityTimer" type="text/javascript" src="${PATH_FOLDER_JS2}${RESOURCES_FROM_MIN_LOCATION}custom/userActivityTimer.js${SCRIPT_VERSION}">`)
		}
	}
	callReEnrollStatusList('studentPaymentForm','RE-EN','reLeadStatus', false);
	getAllGrade(SCHOOL_ID, false);
	getSessionMasterList('studentPaymentForm', 'sessionId', false);
	$("#learningPlatform option:first-child").remove()
	// $("#sessionId option:first-child").remove()
	$(".multiple-select-option").select2({
		theme:'bootstrap4',
	});
	
	$("#enrollStatus").val(["0","4"]).trigger("change");
	//$("#paymentStatus").val(["ODUE","DUE"]).trigger("change");
	
	// $("#studentName").on("keyup", function() {
	// 	var value = this.value.toLowerCase().trim();
	// 	$("#studentPaymentReport .card").show().filter(function() {
	// 		return $(this).text().toLowerCase().trim().indexOf(value) == -1;
	// 	}).hide();
	// });


	// $("#gradeId, #learningProgram").select2({
	// 	theme:"bootstrap4"
	// });
	$(".showFilterForm").click(function(){
		$(".filterStudentPaymentReportForm").slideToggle();
	});
	$('#startDate').datepicker({
		autoclose: true,
		format: 'M d, yyyy',
		todayHighlight: true,
		autoclose: true,
		orientation: "bottom"
	}).on('changeDate', function(){
		$('#endDate').val("").datepicker("update");
		$('#endDate').datepicker('setStartDate', new Date($(this).val()));
	}); 
	$('#endDate').datepicker({
		autoclose: true,
		format: 'M d, yyyy',
		orientation: "bottom"
	}); 

	function applyDateTypeUi(){
		var type = $('#dateType').val();
		if(type == undefined || type == null || type == ''){
			type = 'PAYMENT_DATE';
		}
		if(type == 'ACADEMIC_YEAR'){
			$('#startDateLabel').text('Start Date');
			$('#endDateLabel').text('End Date');
		}else{
			$('#startDateLabel').text('Payment Start Date');
			$('#endDateLabel').text('Payment End Date');
		}
	}
	applyDateTypeUi();
	$('#dateType').off('change').on('change', function(){
		// Clear dates on mode change to avoid confusing mixed filters.
		$('#startDate').val('');
		$('#endDate').val('');
		applyDateTypeUi();
	});
		
	// var d = new Date();
	// var currMonth = d.getMonth();
	// var currYear = d.getFullYear();
	// var startDate = new Date(currYear,currMonth,1);
	// var endDate = new Date(currYear,currMonth+1,0);
	// $('#startDate').datepicker('setDate',startDate);
	// $('#endDate').datepicker('setDate',endDate);
	
	//getPaymentReportData('',false,1,'');

	//$("#studentPaymentReportTable").DataTable({});
	// $("#pageSize").on("change", function(){
	// 	getPaymentReportData('',false,1);
	// })

	// $("#studentName").on('keyup', function (e) {
	// 	if($("#studentName").val().length>3){
	// 		getPaymentReportData('',false,1);
	// 	}else if($("#studentName").val().length==0){
	// 		getPaymentReportData('',false,1);
	// 	}
	// });
	$('[data-toggle="tooltip"]').tooltip({
		html: true
	});
}

function getPaymentReportData(formId, forCountOnly, type, callFrom){
	var min = $('#progressMin').val();
	var max = $('#progressMax').val();
	var dateType = $('#dateType').val();
	if(dateType == undefined || dateType == null || dateType == ''){
		dateType = 'PAYMENT_DATE';
	}

	if(min !== '' && max !== ''){
		if(parseInt(min) > parseInt(max)){
			showMessageTheme2(0, 'Min cannot be greater Max','',true);
			return false;
		}
	}
	if(dateType == 'ACADEMIC_YEAR'){
		if($('#startDate').val()=='' || $('#endDate').val()==''){
			showMessageTheme2(0, 'Please choose Start Date and End Date','',true);
			return false;
		}
	}else{
		if($('#paymentStatus').val()!=''){
			if($('#paymentStatus').val()!='ABS' && $('#paymentStatus').val()!='AP'){
				if($('#startDate').val()=='' && $('#endDate').val()==''){
					showMessageTheme2(0, 'Please choose Start Date and End Date','',true);
					return false;
				}
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
					if(forCountOnly){
						showMessageTheme2(0, data['message'],'',true);
					}else{
						showMessageTheme2(0, 'Data not found','',true);
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
					$("#studentPaymentReport #studentPaymentReportTable tbody").html(cardDetailsSummary(data)).promise().done(function(){
						bindPaymentReportTabEvents();
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
			$('[data-toggle="tooltip"]').tooltip({
				html: true
			});
			customLoader(false);
			return false;
		}
	});
}
function getRequestForPaymentReport(formId, type, forDownload){
	var request={};
	var PaymentReportRequestDTO={};
	PaymentReportRequestDTO['dateType'] = ($('#dateType').val() && $('#dateType').val()!='') ? $('#dateType').val() : 'PAYMENT_DATE';
	PaymentReportRequestDTO['schoolId'] = SCHOOL_ID;
	PaymentReportRequestDTO['loginUserId'] = USER_ID;
	PaymentReportRequestDTO['studentName'] = $('#studentName').val()
	    ? $('#studentName').val().replace(/\s+/g, ' ').trim()
    : '';
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
    if ($('#progressMin').val() != ''){
        PaymentReportRequestDTO['progressMin'] = $('#progressMin').val();
    }
    if ($('#progressMax').val() != ''){
        PaymentReportRequestDTO['progressMax'] = $('#progressMax').val();
    }
	if ($('#studentStatus').val() !=''){
		PaymentReportRequestDTO['studentStatus'] =$('#studentStatus').val();
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
		PaymentReportRequestDTO['teacherMapStaus'] = parseInt($('#teacherMapStaus').val(), 10);
	}
	if($('#transcriptStatus').val()!=''){
		PaymentReportRequestDTO['transcriptStatus'] = $('#transcriptStatus').val();
	}

	if($('#recordingStatus').val()!=''){
		PaymentReportRequestDTO['recordingStatus'] = $('#recordingStatus').val();
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
		PaymentReportRequestDTO['overDueBy'] = 0;
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
			$("#pageNumber").val(page);
			getPaymentReportData('', false, 2, '');
			// if(page>1){
			// 	getPaymentReportData('',false,2,'')
			// }
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
	$('#'+formID+" #enrollStatus").val(["0","4"]).trigger("change");
	$('#'+formID+" #paymentStatus").val('').trigger("change");//["ODUE","DUE"]
	$('#'+formID+" #userId").val("").trigger("change");
	$('#'+formID+" #overDueBy").val("0");
	$('#'+formID+" #reLeadStatus").val("").trigger("change");
	$('#'+formID+" #reEnrollStatus").val("").trigger("change");
	$('#'+formID+" #dateType").val('PAYMENT_DATE');
	if($('#startDateLabel').length){
		$('#startDateLabel').text('Payment Start Date');
	}
	if($('#endDateLabel').length){
		$('#endDateLabel').text('Payment End Date');
	}
	$('#'+formID+" #remainingDueBy").val('');
	$('#'+formID+" #lmsStatus").val('');
	$('#'+formID+" #academicYearStatus").val('');
	$('#'+formID+" #teacherMapStaus").val('');
	$('#'+formID+" #systemTrainStatus").val('');
	$('#'+formID+" #progressMin").val('200');
	$('#'+formID+" #progressMax").val('200');
	$('#'+formID+" #studentStatus").val('');
	$('#'+formID+" #transcriptStatus").val('');
	$('#'+formID+" #recordingStatus").val('');
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
	$(".followup-remark-"+studentStandardId).attr('data-loaded', 'Y');
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
							var aicallSummary="";
							if(leadCall.aicallSummary!=null && leadCall.aicallSummary!=''){
								aicallSummary=JSON.parse(leadCall.aicallSummary);
							}
							html+='<li class=" '+(l==0?'follow-up-accordian-active':'')+'">'
							+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold"><label class="float-left">'+(incS++)+'</label> '+(leadCall.status)+'<br/><span style="font-size:10px">'+(leadCall.createdAt)+'</span> <i class="fa '+(l==0?'fa-angle-up':'fa-angle-down')+' float-right" style="line-height: 20px;"></i></span>'
							+'<div class="follow-up-content text-center" style="'+(l==0?'display: block':'display: block')+'">'
							+'<div>'
									+(leadCall.uploadFile!=''?
										'<audio controls style="height:40px; transform:scale(0.9);">'
											+'<source src="'+leadCall.uploadFile+'">'
											+'Your browser does not support the audio element.'
										+'</audio>':'N/A')
								+'</div>';
								if(aicallSummary!=""){
									html+='<div>'
									 +'<table class="table table-bordered font-11 mt-2">';
									 var skipKeys = ["status", "event","call_summary", "phone_number", "phone_number", "child_name", "recording_url", "call_back_time"];

										$.each(aicallSummary, function(i, obj) {
											if ($.inArray(obj.key, skipKeys) === -1) {

												html += '<tr>';
												html += '<td class="bold">' + obj.key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) + '</td>';  // Pretty key name
												
												if ($.isArray(obj.value)) {
													html += '<td class="array">[' + obj.value.join(', ') + ']</td>';
												} else if (typeof value === 'object') {
													html += '<td class="nested">' + JSON.stringify(obj.value, null, 2) + '</td>';
												} else {
													html += '<td>' + obj.value + '</td>';
												}
												html += '</tr>';
											}
										});
										html+='</table>'
									+'</div>';
								}
								html+='<div class="dropdown d-inline-block text-center my-2" style="position: inherit;">'
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
				if(elementId === 'reLeadStatus' && dropdown.find('option[value=\"Inactive\"]').length === 0){
					dropdown.append('<option value=\"Inactive\">Inactive</option>');
				}
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
function getSelectedWhatsappBroadcastTemplate(indexNo) {
	if(!watiTemplateContent || !Array.isArray(watiTemplateContent.messageTemplates)) {
		return null;
	}
	if(indexNo == null || indexNo === "" || isNaN(Number(indexNo))) {
		return null;
	}
	return watiTemplateContent.messageTemplates[Number(indexNo)] || null;
}
var STUDENT_BROADCAST_PROVIDER = 'WATI';
function getStudentBroadcastProviderMeta(provider) {
	if ((provider || '').toUpperCase() === 'GUPSHUP') {
		return { key: 'GUPSHUP', label: 'Gupshup', getTemplatesRoute: 'get-gupshup-templates-for-student-list', sendMessageRoute: 'send-gupshup-message-for-student' };
	}
	return { key: 'WATI', label: 'Wati', getTemplatesRoute: 'get-wati-templates-for-student-list', sendMessageRoute: 'send-wati-message-for-student' };
}

// Gupshup template placeholder mapping for the Student List (mirrors the Lead List in leads.js).
// leads.js is not loaded on the student payment/broadcast page, so these helpers are defined
// locally here; the two files are never loaded on the same page.
var GUPSHUP_PARAM_FIELD_OPTIONS = [
	{ value: 'name', label: 'Name' },
	{ value: 'grade', label: 'Grade' },
	{ value: 'phone', label: 'Phone' },
	{ value: 'counsellorName', label: 'Counsellor Name' }
];

function getSelectedWhatsappBroadcastTemplateParamCount(templateData) {
	if(!templateData) {
		return 0;
	}
	if(templateData.parameterCount != null && templateData.parameterCount !== "") {
		return Number(templateData.parameterCount) || 0;
	}
	if(Array.isArray(templateData.customParams)) {
		return templateData.customParams.length;
	}
	return 0;
}

function renderGupshupParamMapping(selectedTemplate) {
	var $wrap = $('#gupshupParamMappingWrap');
	var $container = $('#gupshupParamMapping');
	if (!$wrap.length || !$container.length) { return; }
	var providerMeta = getStudentBroadcastProviderMeta(STUDENT_BROADCAST_PROVIDER);
	var paramCount = getSelectedWhatsappBroadcastTemplateParamCount(selectedTemplate);
	if (!providerMeta || providerMeta.key !== 'GUPSHUP' || paramCount <= 0) {
		$wrap.hide();
		$container.empty();
		return;
	}
	var defaults = ['name', 'grade', 'counsellorName', 'phone'];
	var html = '';
	for (var i = 0; i < paramCount; i++) {
		var def = defaults[i] || 'name';
		html += '<div class="d-flex align-items-center" style="gap:4px;">';
		html += '<span style="font-size:13px;">{{' + (i + 1) + '}} &rarr;</span>';
		html += '<select class="form-control form-control-sm gupshup-param-map" data-index="' + i + '" style="width:auto;font-size:13px;">';
		$.each(GUPSHUP_PARAM_FIELD_OPTIONS, function(_, opt) {
			html += '<option value="' + opt.value + '"' + (opt.value === def ? ' selected' : '') + '>' + opt.label + '</option>';
		});
		html += '</select></div>';
	}
	$container.html(html);
	$wrap.show();
}

function collectGupshupParamMapping(paramCount) {
	var mapping = [];
	var allowed = $.map(GUPSHUP_PARAM_FIELD_OPTIONS, function(o) { return o.value; });
	for (var i = 0; i < paramCount; i++) {
		var val = $('.gupshup-param-map[data-index="' + i + '"]').val();
		if (!val || $.inArray(val, allowed) === -1) { return null; }
		mapping.push(val);
	}
	return mapping;
}

function getWatiBroadcastTemplates(){
	var providerArg = arguments.length > 0 ? arguments[0] : null;
	var providerMeta = getStudentBroadcastProviderMeta(providerArg);
	STUDENT_BROADCAST_PROVIDER = providerMeta.key;
	if (typeof setWhatsappBroadcastProvider === 'function') {
		setWhatsappBroadcastProvider(providerMeta.key);
	}
	$('.whatsapp-provider-label').text(providerMeta.label);
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
		url : getURLFor('leads', providerMeta.getTemplatesRoute),
		data : JSON.stringify(request),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			if (data['statusCode'] == '0' || data['statusCode'] == '2'  || data['status'] == '0' || data['status'] == '2'  || data['statusCode'] == 'E001' || data['statusCode'] == 'E002') {
				//showMessageTheme2(0, data['message'],'',true);
				showMessageTheme2(0, data['message'],'',false);
			} else {
				watiTemplateContent=data;
				var isGupshupPreview = (data.provider || providerMeta.key) === 'GUPSHUP';
				$.each(watiTemplateContent.messageTemplates, function(index, obj) {
					if(obj.customParams != null && obj.customParams != ''){
						$.each(obj.customParams, function(i, param) {
							var placeholder = "{{" + param.paramName + "}}";
							var boldedRegex = new RegExp("\\*{{" + param.paramName + "}}\\*", "g");
							if (isGupshupPreview) {
								obj.body = obj.body.replace(boldedRegex, placeholder);
								obj.bodyOriginal = obj.bodyOriginal.replace(boldedRegex, "<b>" + placeholder + "</b>");
							} else {
								var regex;
								if (obj.bodyOriginal.includes("*{{"+param.paramName+"}}*")) {
									regex = boldedRegex;
								} else {
									regex = placeholder;
								}
								obj.body = obj.body.replace(regex, param.paramValue);
								obj.bodyOriginal = obj.bodyOriginal.replace(regex, "<b>"+param.paramValue+"</b>");
							}
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

				$('.whatsapp-provider-label').text(providerMeta.label);

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
					if( formId === 'mailLogsRecords'){
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
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-brevo-mail-Logs-for-student'),
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
		// var htmlpage=getWatiRecordsListPagging(data);
		// $(".watiLogDetailsListPagging").html(htmlpage);
		// $("#watiLogDetailsModal").modal("show");
		$("#viewWatiTemplateModal").modal("show");
	}
}

function getEmailBroadcastTemplates(){
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
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads','get-broadcast-student-list-mail-template'),
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

async function showWatiLogDetailsByStudentUserId(userId){
	var payload = {};
	payload['userId'] = userId;
	payload['userTimezone'] = USER_TIMEZONE;
	var data = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true,'get-wati-broadcast-by-student-userId',payload,'api/v1/leads');
	console.log("data",data)
	if($("#viewWatiTemplateModal").length>0){
		$("#viewWatiTemplateModal").remove();
	}
	$("body").append(getViewWatiTemplateModal(data.messageTemplates));
	$("#viewWatiTemplateModal").modal("show");
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
	

	var providerMeta = getStudentBroadcastProviderMeta(STUDENT_BROADCAST_PROVIDER);
	var selectedTemplate = (typeof getSelectedWhatsappBroadcastTemplate === 'function') ? getSelectedWhatsappBroadcastTemplate(indexNo) : null;

	var request={}
	request['userId']=USER_ID;
	request['templateName']=templateName;
	request['templateId']=selectedTemplate && selectedTemplate.templateId ? selectedTemplate.templateId : '';
	request['provider']=providerMeta.key;
	request['selectedUsers']=selectedUsers;

	if (providerMeta.key === 'GUPSHUP') {
		var paramCount = (typeof getSelectedWhatsappBroadcastTemplateParamCount === 'function') ? getSelectedWhatsappBroadcastTemplateParamCount(selectedTemplate) : 0;
		request['templateParamCount'] = paramCount;
		if (typeof collectGupshupParamMapping === 'function') {
			var mapping = collectGupshupParamMapping(paramCount);
			if (mapping === null) {
				showMessageTheme2(0, 'Please map all template placeholders before sending','',false);
				return false;
			}
			request['paramMapping'] = mapping;
		}
	}

	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLFor('leads', providerMeta.sendMessageRoute),
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
	request['studentList']=true;
	request['sendBestTime']= $("input[name='mailBroadcastTime']:checked").val() == "now"? false: true;
	request['recipientsUserDetails'] = filteredEmailContent.users.map(user => ({
		email: user.email,
		grade: user.grade,
		fullName: user.name,
		phone: user.phoneNumber,
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
		url : getURLForWithoutApiTypeAndUnique('wati/api','get-brevo-mail-Logs-for-student-id'),
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

function getZadarmaLogs(number){
    $.ajax({
        type: "GET",
        url: BASE_URL + CONTEXT_PATH + `zadarma/v1/get-logs?number=${number}`,
        dataType: "json",
        success: function (response) {
			if(response.status == 'success'){
					let modalContent = zadarmaLogsDataModal(response.logs);
					if($("#zadarmaLogsContent").length > 0){
						$("#zadarmaLogsContent").remove();
					}
					$("body").append(modalContent);
					$("#zadarmaLogsContent").modal("show");
			}else{
				showMessageTheme2(0, response.message)
			}
        }
    });
}

function getCallHippoLogs(number){
    $.ajax({
        type: "GET",
        url: BASE_URL + CONTEXT_PATH + `callhippo/v1/get-logs?number=${number}`,
        dataType: "json",
        success: function (response) {
			if(response.status == 'success'){
				let modalContent = callHippoLogsDataModal(response.logs);
				if($("#callHippoLogsContent").length > 0){
					$("#callHippoLogsContent").remove();
				}
				$("body").append(modalContent);
				$("#callHippoLogsContent").modal("show");
			}else{
				showMessageTheme2(0, response.message)
			}
        }
    });
}
