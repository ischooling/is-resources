function getAllDemoForUpdateStatus(userId) {
	var responseData={};
	var data={};
	data['userId']=userId;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('dashboard', 'get-all-demo-for-status-update'),
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


function updateBulkDemoStatus() {
	var demoSaveFlag = true;
	var rowIndex = 0;
	var statusNotSelectedLength = $('select.status').filter(function() {
    	return $(this).find('option:first').is(':selected');
	}).length;
	if(statusNotSelectedLength == $("#demoDetailsModal #demoDetailsTable > tbody > tr").length){
		$("#demoErrorTxt").text('Status field is required.');
		$("#demoErrorTxt").show();
		setTimeout(function(){
			$("#demoErrorTxt").hide();
		},2000);
		return false;
	}else{
		var data=[];
		$("#demoDetailsModal #demoDetailsTable > tbody > tr").each(function(i){
			var demoStatus = $(this).find(".status").val();
			var remarks = $(this).find(".remarks").val();
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
				data.push(ddata);
			}
		});
	}
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
		 contentType : "application/json",
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
		 },
		 error:function(e){
			// console.log(e);
			 customLoader(false);
		 }
	 });
}