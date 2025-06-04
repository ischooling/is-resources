function getLensClassBasedOnDate(){
	var selectedDate = $('#classDate').val();
	if(selectedDate==''){
		selectedDate = changeDateFormat(new Date(),'yyyy-mm-dd');
	}else{
		selectedDate = changeDateFormat(new Date(selectedDate),'yyyy-mm-dd');
	}
	getClassDetailsByUser('lensClassDetails',USER_ID, selectedDate);
}
function getClassDetailsByUser(elementId, userId, date){
	if(date==undefined || date==''){
		date=changeDateFormat(new Date(),'yyyy-mm-dd');
	}
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/'+UNIQUEUUID+'/class-details-by-user-date/'+userId+'/'+date,
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
				$("#"+elementId+' > tbody').html(lensClassContent(data.lensClassDetails));
			}
		}
	});
}

function getClassDetailsBySession(classId,sessionId){
	customLoader(true);
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : BASE_URL+CONTEXT_PATH+SCHOOL_UUID+'/'+UNIQUEUUID+'/class-details-by-session/'+USER_ID+ '/' + classId+'/'+sessionId,
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
				$("body").append(getClassSessionModal(data.data));
				$("#classSessionModal").modal("show");
				console.log(JSON.stringify(data));
			}
			customLoader(false);
		}
	});
}

function openVideo(videoUrl){
	$("body").append(openVideoModal(videoUrl));
	$("#videoModal").modal("show");
	$(".videoTag")[0].play();
	$('#videoModal').on('hidden.bs.modal', function (e) {
		$(".videoTag")[0].pause();
	});
}
