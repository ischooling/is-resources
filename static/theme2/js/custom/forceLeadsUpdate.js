
function getTantativDate(i){
	if($('#status_'+i).val()=="Positive to enrollment"){
		$('.tentative_date_'+i).css("display", "block" );
		$('#rtentativeDate_'+i).val('');
	}else{
		$('.tentative_date_'+i).css( "display", "none" );
	}
}

function getAllCallbackForUpdateRemark(userId) {
	var responseData={};
	var data={};
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTMLWithPayload('dashboard', 'get-all-callback-for-remark-update'),
		data : JSON.stringify(data),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				responseData=data;
			}
			return false;
		}
	});
	return responseData;
}

function getAllDemoForUpdateStatus(userId) {
	var responseData={};
	var data={};
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTMLWithPayload('dashboard', 'get-all-demo-for-status-update'),
		data : JSON.stringify(data),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				responseData=data;
			}
			return false;
		}
	});
	return responseData;
}

function getAllLeadForUpdateRemark(userId) {
	var responseData={};
	var data={};
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTMLWithPayload('dashboard', 'get-all-lead-for-remark-update'),
		data : JSON.stringify(data),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				responseData=data;
			}
			return false;
		}
	});
	return responseData;
}

function getAllDemosForUpdateRemark(userId) {
	var responseData={};
	var data={};
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTMLWithPayload('dashboard', 'get-all-demos-for-remark-update'),
		data : JSON.stringify(data),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['message']);
					}else{
						showMessageTheme2(0, data['message'],'',true);
					}
				}
			} else {
				responseData=data;
			}
			return false;
		}
	});
	return responseData;
}

function updateBulkDemoStatus(remarkMendatory,minRemarkCount) {
	var demoSaveFlag = true;
	var rowIndex = 0;
	var data=[];
	$("#demoDetailsModal #demoDetailsTable > tbody > tr").each(function(i){
		var demoStatus = $(this).find(".status").val();
		var remarks = $(this).find(".remarks").val();
		var rtentativeDate = $(this).find(".rtentativeDate").val();
		if(remarks != "" && remarks != undefined && remarks != null){
			if(demoStatus == ""  || demoStatus == undefined || demoStatus == null){
				demoSaveFlag = false;
				rowIndex = i+1;
			}
		}
		if(demoStatus!=''){
			var ddata={};
			ddata['meetingId']=$(this).attr("data-meetingId");
			ddata['leadId']=$(this).attr("data-leadId");
			ddata['userId']=$(this).attr("data-userId");
			ddata['schoolId']=SCHOOL_ID;
			ddata['status']=demoStatus;
			ddata['remarks']=remarks;
			ddata['rtentativeDate']=rtentativeDate;
			data.push(ddata);
		}
	});
	
	if(!demoSaveFlag){
		$("#demoDetailsModal #demoDetailsTable > tbody > tr:nth-child("+rowIndex+")").css({"background-color":"#f6c85a"});
		
		//showMessage(false, "Status field is required.");
		$("#demoErrorTxt").text('Status field is required.');
		$("#demoErrorTxt").show();
		setTimeout(function(){
			$("#demoErrorTxt").hide();
		},2000);
		return false;
	}else{
		if(rowIndex%2){
			$("#demoDetailsModal #demoDetailsTable > tbody > tr:nth-child("+rowIndex+")").css({"background-color":"rgba(237, 240, 255, 1)"});
		}else{
			$("#demoDetailsModal #demoDetailsTable > tbody > tr:nth-child("+rowIndex+")").css({"background-color":"white"});
		}
		
	}
	customLoader(true);
	 $.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard','update-bulk-meeting-status'),
		 data : JSON.stringify(data),
		 dataType : 'json',
		 async:true,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				var totalRowSaveCount = $('select.status').filter(function() {
					return $(this).find('option:not(:first)').is(':selected');
				}).length;
				var demoTotalCount = parseInt($(".demoTotalCount").text());
				demoTotalCount=demoTotalCount - totalRowSaveCount;
				if(demoTotalCount > 0){
					$(".demoTotalCount").text(demoTotalCount)
				}else{
					$(".demoTotalCount").text("0");	
				}
				
				$("#demoDetailsModal #demoDetailsTable > tbody > tr").each(function(i){
					var demoStatus = $(this).find(".status").val();
					if(demoStatus != ""  && demoStatus != undefined && demoStatus != null){
						$(this).remove();
					}
				});
				if($("#demoDetailsModal #demoDetailsTable > tbody > tr").length<1){
					$('#demoDetailsModal').modal('hide');
				}

				$("#demoErrorTxt").text(data['message']).css({"color":"green"});
				$("#demoErrorTxt").show();
				setTimeout(function(){
					$("#demoErrorTxt").hide();
					$("#demoErrorTxt").text("").css({"color":"red"});
				},3000);
				customLoader(false);
			}
		 }
	 });
}

function getRequestForFollowupSaveFromLeadListForBulk(data){
	   var leadAddFormRequestDTO = {};
	   var authentication = {};
	   var leadCommonDTOList = [];
	   
	   authentication['hash'] = getHash();
	   authentication['schoolId'] = SCHOOL_ID;
	   authentication['schoolUUID'] = SCHOOL_UUID;
	   authentication['userId'] = USER_ID;
	   authentication['userType'] = 'COMMON';
	   leadAddFormRequestDTO['authentication'] = authentication;

	   for (let dataValue of data) {
			var leadCommonDTO = {};
			var leadModifyDTO={};
			var leadModifyDetailDTO={};
			var leadCallFollowupDTO={};
			var leadDemoInfo={};
			let leadStatus = dataValue['status']
			leadModifyDTO['leadId'] = dataValue["leadId"];
			leadCallFollowupDTO['followupBy'] ='Call';
			leadModifyDetailDTO['tentativeDate']='';
			if(dataValue['remarks'] !=''){
				leadCallFollowupDTO['followRemarks'] = dataValue['remarks'];//escapeCharacters($("#"+formId+" #followupRemarks").val());
			}
			leadCallFollowupDTO['followupRemarkBy'] = USER_ID;
			leadCallFollowupDTO['toCall'] = 'none';
			
			leadCallFollowupDTO['leadFollowStatus'] = leadStatus;
			leadModifyDTO['leadStatus'] = leadStatus;
			
			
			//$("#"+formId+" #selectStatusOfLead").val();
			leadCallFollowupDTO['customDate']= 'NO FOLLOWUP';
			if(leadStatus=='Call Completed' 
				|| leadStatus=='Not Answering' || leadStatus=='Not reachable' || leadStatus=='Switch off' 
			){
					leadCallFollowupDTO['callBadge'] ='followup1'
			}
		
			if(leadStatus=='Call Completed | Hot'
				||leadStatus=='Call Completed | Warm'
				||leadStatus=='Call Completed | Cold'){
					leadCallFollowupDTO['callBadge'] ='calldoneb2b'
			}
			
			if(leadStatus=='Positive to enrollment'){
				leadCallFollowupDTO['callBadge'] ='positive'
			}
			if(leadStatus=='Share details over WhatsApp | e-mail'
				||leadStatus=='Phone | WhatsApp Call'
				||leadStatus=='Reached out on WhatsApp'
				||leadStatus=='Reached out on Phone Call'
				||leadStatus=='Reached out on Email'){
				leadCallFollowupDTO['callBadge'] ='followup2'
			}
			if(leadStatus=='Need time'
				|| leadStatus=='Other'
				|| leadStatus=='Class Demo Needed'
				|| leadStatus=='Class Demo Completed'
				){
				leadCallFollowupDTO['callBadge'] ='followup3';	
				}
				
				if(leadStatus=='Duplicate lead'
				||leadStatus=='Invalid | Cold'){
				leadCallFollowupDTO['callBadge'] ='red';
			}
			if(leadStatus=='Rejected | Cold'){
				leadCallFollowupDTO['callBadge'] ='rejected';
			}
		
				if(leadStatus=='Demo Needed'
					|| leadStatus=='Demo Completed'
					||leadStatus=='Demo Reschedule'
					||leadStatus=='Demo Booked'){
					leadCallFollowupDTO['callBadge'] ='yellow';
				}
				if(leadStatus=='Connect to Impact Recommended'
					||leadStatus=='Connect to Impact Booked'
					||leadStatus=='Connect to Impact Completed'){
					leadCallFollowupDTO['callBadge'] ='cti';
				}
				
				if(leadStatus=='Booked Seat'){
				leadCallFollowupDTO['callBadge'] ='darkgreen';
				}
			if(leadStatus=='Neutral'){
				leadCallFollowupDTO['callBadge'] ='neutral';
			}
			if(leadStatus=='Assigned Working'){
				leadCallFollowupDTO['callBadge'] ='gray';
			}
			if(leadStatus=='Basic Details not Filled | Cold'){
				leadCallFollowupDTO['callBadge'] ='darkgreen';
			}
			if(leadStatus=='Converted'
					||leadStatus=='Converted & On Boarding | Hot'){
				leadCallFollowupDTO['callBadge'] ='green';
				}
			if(leadStatus=='Looking for next year'){
				leadCallFollowupDTO['callBadge'] ='nextyear';
			}
			if(leadStatus=='Request Under Review | Warm'){
				leadCallFollowupDTO['callBadge'] ='under-review';
			}
			if(leadStatus=='Interested to Interview | Warm'
				||leadStatus=='Interested to Interview | Cold'
				||leadStatus=='Interested to Interview | Hot'){
				leadCallFollowupDTO['callBadge'] ='int-inerview';
			}
			if(leadStatus=='Moving for the Next meeting | Warm'
			|| leadStatus=='Moving for the Next meeting | Cold'
			|| leadStatus=='Moving for the Next meeting | Hot'){
				leadCallFollowupDTO['callBadge'] ='move-inerview';
			}
			if(leadStatus=='Interview Booked | Cold'){
				leadCallFollowupDTO['callBadge'] ='inter-booked';
			}
				
			if(leadStatus=='Invalid'){
				leadCallFollowupDTO['callBadge'] ='red';
			}
			
			leadCommonDTO['leadModifyDTO']=leadModifyDTO;
			leadCommonDTO['leadModifyDetailDTO']=leadModifyDetailDTO;
			leadCommonDTO['leadCallFollowupDTO']=leadCallFollowupDTO;
			leadCommonDTO['leadDemoInfo']=leadDemoInfo;
			leadCommonDTOList.push(leadCommonDTO)
		}
	   leadAddFormRequestDTO['leadCommonDTOList'] = leadCommonDTOList;
	   return leadAddFormRequestDTO;
   }

function updateBulkLeadStatus(remarkMendatory,minRemarkCount) {
	var leadSaveFlag = true;
	var rowIndex = 0;

	var data = [];
	$("#leadDetailsModal #leadDetailsTable > tbody > tr").each(function (i) {
		var leadStatus = $(this).find(".status").val();
		var remarks = $(this).find(".remarks").val().trim();

		// ✅ Rule 1: Remarks mandatory
		if (remarkMendatory) {
			if (leadStatus != "" && remarks.length < minRemarkCount) {
				leadSaveFlag = false;
				rowIndex = i + 1;
				$("#leadErrorTxt").text('Remarks must be at least ' + minRemarkCount + ' characters.');
				$("#leadErrorTxt").show();
				setTimeout(function () { $("#leadErrorTxt").hide(); }, 2000);
				return false; // break out
			}
		} else {
			// ✅ Rule 2: Remarks optional
			if (remarks) {
				if (minRemarkCount > 0 && remarks.length < minRemarkCount) {
					leadSaveFlag = false;
					rowIndex = i + 1;
					$("#leadErrorTxt").text('Remarks must be at least ' + minRemarkCount + ' characters.');
					$("#leadErrorTxt").show();
					setTimeout(function () { $("#leadErrorTxt").hide(); }, 2000);
					return false; // break out
				}
			}
		}

		// ✅ Check: if remarks given but no status
		if (remarks && (!leadStatus || leadStatus == "")) {
			leadSaveFlag = false;
			rowIndex = i + 1;
			$("#leadErrorTxt").text('Status field is required.');
			$("#leadErrorTxt").show();
			setTimeout(function () { $("#leadErrorTxt").hide(); }, 2000);
			return false;
		}

		// ✅ If status selected, push row data
		if (leadStatus != '') {
			var ddata = {};
			ddata['leadId'] = $(this).attr("data-leadId");
			ddata['userId'] = $(this).attr("data-userId");
			ddata['schoolId'] = SCHOOL_ID;
			ddata['status'] = leadStatus;
			ddata['remarks'] = remarks;
			data.push(ddata);
		}
	});

	// 🔹 Row highlight on validation error
	if (!leadSaveFlag) {
		$("#leadDetailsModal #leadDetailsTable > tbody > tr:nth-child(" + rowIndex + ")")
			.css({ "background-color": "#f6c85a" });
		return false;
	} else {
		if (rowIndex % 2) {
			$("#leadDetailsModal #leadDetailsTable > tbody > tr:nth-child(" + rowIndex + ")")
				.css({ "background-color": "rgba(237, 240, 255, 1)" });
		} else {
			$("#leadDetailsModal #leadDetailsTable > tbody > tr:nth-child(" + rowIndex + ")")
				.css({ "background-color": "white" });
		}
	}
	customLoader(true);
	 $.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard','update-bulk-lead-status'),
		 data : JSON.stringify(getRequestForFollowupSaveFromLeadListForBulk(data)),
		 dataType : 'json',
		 async:true,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				var totalRowSaveCount = $('select.status').filter(function() {
					return $(this).find('option:not(:first)').is(':selected');
				}).length;
				var leadTotalCount = parseInt($(".leadTotalCount").text());
				leadTotalCount=leadTotalCount - totalRowSaveCount;
				if(leadTotalCount > 0){
					$(".leadTotalCount").text(leadTotalCount)
				}else{
					$(".leadTotalCount").text("0");	
				}
				
				$("#leadDetailsModal #leadDetailsTable > tbody > tr").each(function(i){
					var leadStatus = $(this).find(".status").val();
					if(leadStatus != ""  && leadStatus != undefined && leadStatus != null){
						$(this).remove();
					}
				});
				if($("#leadDetailsModal #leadDetailsTable > tbody > tr").length<1){
					$('#leadDetailsModal').modal('hide');
				}

				$("#leadErrorTxt").text(data['message']).css({"color":"green"});
				$("#leadErrorTxt").show();
				setTimeout(function(){
					$("#leadErrorTxt").hide();
					$("#ErrorTxt").text("").css({"color":"red"});
				},3000);
				customLoader(false);
			}
		 }
	 });
}


function updateBulkDemosStatus(remarkMendatory,minRemarkCount) {
	var demo2SaveFlag = true;
	var rowIndex = 0;

	var data = [];
	$("#demo2DetailsModal #demo2DetailsTable > tbody > tr").each(function (i) {
		var demo2Status = $(this).find(".status").val();
		var remarks = $(this).find(".remarks").val().trim();

		// ✅ Rule 1: Remarks mandatory
		if (remarkMendatory) {
			if (demo2Status != "" && remarks.length < minRemarkCount) {
				demo2SaveFlag = false;
				rowIndex = i + 1;
				$("#demo2ErrorTxt").text('Remarks must be at least ' + minRemarkCount + ' characters.');
				$("#demo2ErrorTxt").show();
				setTimeout(function () { $("#demo2ErrorTxt").hide(); }, 2000);
				return false; // break out
			}
		} else {
			// ✅ Rule 2: Remarks optional
			if (remarks) {
				if (minRemarkCount > 0 && remarks.length < minRemarkCount) {
					demo2SaveFlag = false;
					rowIndex = i + 1;
					$("#demo2ErrorTxt").text('Remarks must be at least ' + minRemarkCount + ' characters.');
					$("#demo2ErrorTxt").show();
					setTimeout(function () { $("#demo2ErrorTxt").hide(); }, 2000);
					return false; // break out
				}
			}
		}

		// ✅ Check: if remarks given but no status
		if (remarks && (!demo2Status || demo2Status == "")) {
			demo2SaveFlag = false;
			rowIndex = i + 1;
			$("#demo2ErrorTxt").text('Status field is required.');
			$("#demo2ErrorTxt").show();
			setTimeout(function () { $("#demo2ErrorTxt").hide(); }, 2000);
			return false;
		}

		// ✅ If status selected, push row data
		if (demo2Status != '') {
			var ddata = {};
			ddata['meetingId']=$(this).attr("data-meetingId");
			ddata['leadId'] = $(this).attr("data-leadId");
			ddata['userId'] = $(this).attr("data-userId");
			ddata['schoolId'] = SCHOOL_ID;
			ddata['status'] = demo2Status;
			ddata['remarks'] = remarks;
			data.push(ddata);
		}
	});

	// 🔹 Row highlight on validation error
	if (!demo2SaveFlag) {
		$("#demo2DetailsModal #demo2DetailsTable > tbody > tr:nth-child(" + rowIndex + ")")
			.css({ "background-color": "#f6c85a" });
		return false;
	} else {
		if (rowIndex % 2) {
			$("#demo2DetailsModal #demo2DetailsTable > tbody > tr:nth-child(" + rowIndex + ")")
				.css({ "background-color": "rgba(237, 240, 255, 1)" });
		} else {
			$("#demo2DetailsModal #demo2DetailsTable > tbody > tr:nth-child(" + rowIndex + ")")
				.css({ "background-color": "white" });
		}
	}
	customLoader(true);
	 $.ajax({
		 type : "POST",
		 contentType : APPLICATION_JSON_VALUE,
		 url : getURLForHTML('dashboard','update-bulk-meeting-status'),
		 data : JSON.stringify(data),
		 dataType : 'json',
		 async:true,
		 success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					redirectLoginPage();
				}else{
					showMessageTheme2(0, data['message'],'',true);
				}
			} else {
				var totalRowSaveCount = $('select.status').filter(function() {
					return $(this).find('option:not(:first)').is(':selected');
				}).length;
				var demo2TotalCount = parseInt($(".demo2TotalCount").text());
				demo2TotalCount=demo2TotalCount - totalRowSaveCount;
				if(demo2TotalCount > 0){
					$(".demo2TotalCount").text(demo2TotalCount)
				}else{
					$(".demo2TotalCount").text("0");	
				}
				
				$("#demo2DetailsModal #demo2DetailsTable > tbody > tr").each(function(i){
					var demo2Status = $(this).find(".status").val();
					if(demo2Status != ""  && demo2Status != undefined && demo2Status != null){
						$(this).remove();
					}
				});
				if($("#demo2DetailsModal #demo2DetailsTable > tbody > tr").length<1){
					$('#demo2DetailsModal').modal('hide');
				}

				$("#demo2ErrorTxt").text(data['message']).css({"color":"green"});
				$("#demo2ErrorTxt").show();
				setTimeout(function(){
					$("#demo2ErrorTxt").hide();
					$("#ErrorTxt").text("").css({"color":"red"});
				},3000);
				customLoader(false);
			}
		 }
	});
}

