var loadContentFlag = 0;
function communicationLog(){
    if(loadContentFlag  == 0){
        $("#communicationLogDIV").append(getCommunicationLogContent());
        initEditor(1, 'commentEditor','Enter comments', false);
        // bindFileUploadNew1('1', '33',USER_ID,6);
		$("#fileuploadLog6").on("change",function(){
			var attachment = $("#fileuploadLog6").val().split("\\")[2]
			$("#fileuploadLog6Span").text(attachment);
		});
        loadContentFlag=1;
    }
    getCommunicationLogData('communicationLogTable',USER_ID,USER_ROLE);
}

function getCommunicationLogData(elementId,userId,role){
    customLoader(true);
	var data={};
	data['userId']=userId;
	data['role']=role;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : CONTEXT_PATH+UNIQUEUUID+"/api/v1/dashboard/get-user-communication-log",
		data: JSON.stringify(data),
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
				var isDataTable = $.fn.dataTable.isDataTable('#'+elementId);
				if(isDataTable){
					$('#'+elementId).dataTable().fnDestroy();
				}
				$('#'+elementId+' > tbody').html(getAddCommunicationLogTablebody(data));
				$('#'+elementId).DataTable({
					"drawCallback": function( settings ) {
						$('#'+elementId+' tbody tr td:first-child').addClass('dtr-control');
					}
				});
			}
			customLoader(false);
			return false;
		}
	});
	bindHover();
}

function viewCommunicationattach(modalID, filePath){

}

function getRequestForCommunicationLog(formId){
    var commonCommentsRequest = {};
	var authentication = {};
	var commonCommentsDTO = {};
	var documentUploads = uploadDocs;
	commonCommentsDTO['entityId']=USER_ID;
	if(USER_ROLE == 'TEACHER'){
		commonCommentsDTO['entityName']='TEACHER';
	}else{
		commonCommentsDTO['entityName']='STUDENT';
	}
	commonCommentsDTO['title']=$("#"+formId+" #logTitle").val();
	
	if($("#" + formId + " #fileuploadLog6Span").text()=='No file chosen...'){
		commonCommentsDTO['uploadFile'] = '';
		documentUploads = uploadDocs = [];
	}else{
		commonCommentsDTO['uploadFile'] = $("#" + formId +" #fileuploadLog6Span").text();
	}
    if(editor1!=undefined){
        commonCommentsDTO['comments']=escapeCharacters(editor1.getData());
    }
	commonCommentsDTO['documentUploads']=documentUploads;
	commonCommentsRequest['commonCommentsDTO'] = commonCommentsDTO
	
	authentication['hash'] = getHash();authentication['schoolId'] = SCHOOL_ID;authentication['schoolUUID'] = SCHOOL_UUID;
	authentication['userType'] = moduleId;
	authentication['userId'] = $("#"+formId+" #userId").val();
	commonCommentsRequest['authentication'] = authentication;
	
	return commonCommentsRequest;
}

function saveCommunicationLog(formId) {
    hideMessage('');
    if(editor1.getData()==null || editor1.getData()=='' || editor1.getData()=='undefined'){
        showMessageTheme2(0,"Comments mandatory",'',true);
		return false;
    }
	if(editor1.getData().length>2999){
		showMessageTheme2(0,"Comments can not be more than 3000 characters.",'',true);
		return false;
	}
    $.ajax({
        type : "POST",
        contentType : "application/json",
        url : getURLFor('dashboard','save-user-communication-log'),
        data : JSON.stringify(getRequestForCommunicationLog(formId)),
        dataType : 'json',
        cache : false,
        timeout : 600000,
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
			} else{
				showMessageTheme2(1, data['message'],'',true);
				$('#' + formId)[0].reset();
				$('#' + formId+' #fileuploadLog6').val('');
				$('#' + formId+ " #fileuploadLog6Span").text("No file chosen...");
				initEditor(1, 'commentEditor','Enter comments', true);
				getCommunicationLogData('communicationLogTable',USER_ID,USER_ROLE);
			}
            
            return false;
        },
        error : function(e) {
            //showMessage(true, e.responseText);
            console.log("ERROR : ", e);
            $("#lmsUserForm").prop("disabled", false);
        }
    });
}
function validateRequestForLMSStudentPerformance(){
}