function resetForm(formId, modalID, modalHide){
	$("#"+formId+" .class-type-dorpdown option:first-child").prop("selected", true);
	$("#"+formId+" .meeting-id").val("");
	$("#userIdOfflineClass option:eq(0)").select2().prop("selected", true);
	$('#userIdOfflineClass').trigger('change');
	var offlineClassesRowLength = $("#"+formId+" .offline-classes-wrapper .clone-row-offline-classes").length;
	if(offlineClassesRowLength > 1){
		$("#"+formId+" .offline-classes-wrapper .clone-row-offline-classes:nth-child(n + 2)").remove();
		$("#"+formId+" .delete-row-btn").hide();
	}
	$("#"+formId+" .offline-classes-wrapper .clone-row-offline-classes:first-child .class-type-dorpdown").attr("id", "class_Type_1");
	$("#"+formId+" .offline-classes-wrapper .clone-row-offline-classes:first-child .meeting-id").attr("id", "meetingId_1")
	$('.meeting-id-check').remove()
	if(modalHide = true){
		$("#"+modalID).modal("hide");
	}
}

function offlineClassSearchReset(formId){
	$('#' + formId)[0].reset();
	$('#classType').val("").trigger("change");
	$('#sortBy').val("DESC").trigger("change");
	if(USER_ROLE=='TEACHER'){
		$('#'+formId+' #userId').val(USER_ID).trigger('change');
	}else{
		$('#'+formId+' #userId').val('').trigger('change');
	}
}

function validateOfflineClasses(formId){
	if($('#'+formId+' #userIdOfflineClass').val()==null || $('#'+formId+' #userIdOfflineClass').val()==''){
		if(tt=='theme1'){
			showMessage(false, 'Plase select Teacher');
		}else{
			showMessageTheme2(0, 'Plase select Teacher','',true);
		}
		return false;
	}
	var flag=true;
	var CloneRowlength = $(".offline-classes-wrapper .clone-row-offline-classes").length;
	for(i=0; i<CloneRowlength;i++){
		var classType=$(".offline-classes-wrapper .clone-row-offline-classes:eq("+i+") .class-type-dorpdown").val();
		if(classType==null || classType==''){
			if(tt=='theme1'){
				showMessage(false, 'Plase select class type');
			}else{
				showMessageTheme2(0, 'Plase select class type','',true);
			}
			flag=false;
			break;
		}
		var meetingId=$(".offline-classes-wrapper .clone-row-offline-classes:eq("+i+") .meeting-id").val().replaceAll(/\s/g,'');
		if(meetingId==''){
			if(tt=='theme1'){
				showMessage(false, 'Plase enter valid meeting ID');
			}else{
				showMessageTheme2(0, 'Plase enter valid meeting ID','',true);
			}
			flag=false;
			break;
		}
	}
	return flag;
}
function saveOfflineClasses(formId, modalID){
	customLoader(true);
	if(!validateOfflineClasses(formId)){
		customLoader(false);
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('meeting','offline'),
		data : JSON.stringify(getRequestForOfflineClass(formId)),
		dataType : 'json',
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
					$('.meeting-id-check').remove();
					$.each(data['meetingDetails'], function(k, v) {
						offlineClassUploaded(formId, v.elementId, v.status, v);
					});
				}
			} else {
				$('.meeting-id-check').remove();
				$.each(data['meetingDetails'], function(k, v) {
					offlineClassUploaded(formId, v.elementId, v.status, v);
				});
				advanceofflineClassSearch('offlineClassFilter','offlineClassesTable',roleAndModule.moduleId,USER_ID,USER_ROLE);
				resetForm(formId, modalID, true);
				if(tt=='theme1'){
					showMessage(true, data['message']);
				}else{
					showMessageTheme2(1, data['message'],'',true);
				}
			}
			customLoader(false);
			return false;
		}
	});
	return false
}

function getRequestForOfflineClass(formId){
	var ZoomOfflineMeetingRequest={};
	ZoomOfflineMeetingRequest['crontrolType']='Add';
	ZoomOfflineMeetingRequest['schoolId']=SCHOOL_ID
	ZoomOfflineMeetingRequest['userId']=$('#'+formId+' #userIdOfflineClass').val();
	var meetingDetails=[];
	var CloneRowlength = $(".offline-classes-wrapper .clone-row-offline-classes").length;
	for(i=0; i<CloneRowlength;i++){
		var ZoomOfflineMeetingDetails={};
		ZoomOfflineMeetingDetails['elementId']= $(".offline-classes-wrapper .clone-row-offline-classes:eq("+i+") .meeting-id").attr("id");
		ZoomOfflineMeetingDetails['meetingType']=$(".offline-classes-wrapper .clone-row-offline-classes:eq("+i+") .class-type-dorpdown").val();
		ZoomOfflineMeetingDetails['meetingId']=$(".offline-classes-wrapper .clone-row-offline-classes:eq("+i+") .meeting-id").val().replaceAll(/\s/g,'');
		meetingDetails.push(ZoomOfflineMeetingDetails);
	}
	ZoomOfflineMeetingRequest['meetingDetails']=meetingDetails;
	return ZoomOfflineMeetingRequest;
}

function advanceofflineClassSearch(formId, elementId, moduleId,userId, role){
	checkTextBox(formId);
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('meeting','offline-list'),
		data : JSON.stringify(getRequestForOfflineClassFilter(formId)),
		dataType : 'json',
		success : function(data) {
			$('#'+elementId+' > tbody').html('');
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
				$('#offlineMeetingContentDiv').html(offlineClassTable(elementId,role));
				$('#'+elementId+' > tbody').append(getOfflineClassTableBody(data.meetingDetails, userId, role));
				var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
				if(isDataTable){
					$('#'+elementId).dataTable().fnDestroy();
				}
				$('#'+elementId).DataTable();
			}
			return false;
		}
	});
	bindHover();
}
function getRequestForOfflineClassFilter(formId){
	var ZoomOfflineMeetingFilterRequest={};
	ZoomOfflineMeetingFilterRequest['schoolId']=SCHOOL_ID
	ZoomOfflineMeetingFilterRequest['userId']=$('#'+formId+' #userId').val();
	ZoomOfflineMeetingFilterRequest['classType']=$('#'+formId+' #classType').val();
	ZoomOfflineMeetingFilterRequest['meetingId']=$('#'+formId+' #meetingId').val().replaceAll(/\s/g,'');
	ZoomOfflineMeetingFilterRequest['sortBy']=$('#'+formId+' #sortBy').val();
	ZoomOfflineMeetingFilterRequest['pageSize']=$('#'+formId+' #pageSize').val();
	return ZoomOfflineMeetingFilterRequest;
}

function validateDeleteOfflineClasses(offlineId){
	if(offlineId==''){
		if(tt=='theme1'){
			showMessage(false, 'Invalid offline class');
		}else{
			showMessageTheme2(0, 'Invalid offline class','',true);
		}
		return false;
	}
	return true;
}
function deleteOfflineClasses(offlineId){
	if(!validateDeleteOfflineClasses(offlineId)){
		return false;
	}
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : getURLForHTML('meeting','offline'),
		data : JSON.stringify(getRequestForDeleteOfflineClass(offlineId)),
		dataType : 'json',
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
				$('#actionOfflineClasses'+offlineId).html('Deleted')
				if(tt=='theme1'){
					showMessage(true, data['message']);
				}else{
					showMessageTheme2(1, data['message'],'',true);
				}
			}
			return false;
		}
	});
	return false
}
function getRequestForDeleteOfflineClass(offlineId){
	var ZoomOfflineMeetingRequest={};
	ZoomOfflineMeetingRequest['crontrolType']='delete';
	ZoomOfflineMeetingRequest['schoolId']=SCHOOL_ID
	var meetingDetails=[];
	var ZoomOfflineMeetingDetails={};
	ZoomOfflineMeetingDetails['offlineId']=offlineId;
	meetingDetails.push(ZoomOfflineMeetingDetails);
	ZoomOfflineMeetingRequest['meetingDetails']=meetingDetails;
	return ZoomOfflineMeetingRequest;
}

function showOfflineClassModel(formId, modalID){
	resetForm(formId, modalID, false)
	$("#offlineClassesModal").modal({backdrop: 'static', keyboard: false});
	if(!$('#offlineClassAdd #userIdOfflineClass').hasClass("select2-hidden-accessible")){
		$('#offlineClassAdd #userIdOfflineClass').select2({
			theme: "bootstrap4",
			dropdownParent: "#offlineClassesModal .modal-body",
		});
	}
	
	
}

function showOfflineAddContent(){
	$(".offline-classes-container").show();
}

function cloneRowOfflineClasses(){
	var uniqueId = parseInt($(".offline-classes-wrapper .clone-row-offline-classes:last-child .class-type-dorpdown").attr("id").split("_").pop())+1;
	$(".offline-classes-wrapper").append($('.offline-classes-wrapper .clone-row-offline-classes:last-child').clone()).html();
	$('.offline-classes-wrapper .clone-row-offline-classes:last-child .class-type-dorpdown').attr("id", "class_Type_"+uniqueId);
	$('.offline-classes-wrapper .clone-row-offline-classes:last-child .meeting-id').attr("id", "meetingId_"+uniqueId);
	$('.offline-classes-wrapper .clone-row-offline-classes:last-child  .error').attr("id", "meetingId_"+uniqueId+'-error');
	$('.offline-classes-wrapper .clone-row-offline-classes 	#meetingId_'+uniqueId).val( "");
	$('#meetingId_'+uniqueId).next().remove();
	var rowLength = $(".offline-classes-wrapper .clone-row-offline-classes").length;
	if(rowLength > 1){
		$(".delete-row-btn").show();
	}
	
	
	
	return false;
}
function deleteRow(element){
	$(element).parent().closest(".clone-row-offline-classes").remove();
	var rowLength = $(".offline-classes-wrapper .clone-row-offline-classes").length;
	if(rowLength <= 1){
		$(".delete-row-btn").hide();
	}
}

function joinOfflineMeeting(userId, offlineId){
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : getURLForHTML('meeting','offline-join'+'/'+userId+'/'+offlineId),
		dataType : 'json',
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
				window.open(data['joinUrl'],'_blank');
			}
			return false;
		}
	});
}
