var defaultAnnouncementIndex = 0;
async function renderAnnouncement(userId){
	var data = await getAnnouncementDetails(userId, 0, 10);
	$('#announcementDiv').html(getAnnouncementContent(data, userId, 0));
    $(".announcement-anchor .announcement-list").click(function(){
        $(this).parent().find(".horizontal-scroll-table").slideToggle();
        $(this).parent().closest("li").siblings().find(".horizontal-scroll-table").slideUp();
    });
}
async function showAnnounceDataById(announceId, moduleId){
	try{
		var data = {};
		data['announceId'] = announceId;
		data['moduleId'] = moduleId;
		data['userId'] = USER_ID;
		responseData = await getDashboardDataBasedUrlAndPayload(false,false, 'school-announce-data', data);
        if(responseData.status==1){
            if($("#announcementbyIdData").length>0){
                $("#announcementbyIdData").remove();
            }
            $('body').append(announcementModalContent(responseData));
			$('#announcementbyIdData').modal({backdrop: 'static', keyboard: false});
		}
		
		
	}catch(e){
		if(tt=='theme1'){
			showMessage(true, e);
		}else{
			showMessageTheme2(0, e,'',true);
		}
	}
}

async function saveAnnouncementAcknowledge(announceId, userId, roleModuleId) {
    try{
        var data ={}
        data['announceId']=announceId;
        data['userId']=userId;
        data['moduleId'] = roleModuleId;
        responseData = await getDashboardDataBasedUrlAndPayload(true,true, 'save-acknowledge-request', data);
        if(responseData.status==1){
            $('#announcementbyIdData').modal('hide');
            $('.accepted-announcement'+announceId).addClass('d-none');
			$("#newAnnouncementCount").text(parseInt($("#newAnnouncementCount").text()) - 1);

            if(tt=='theme1'){
                showMessage(true, responseData.message);
            }else{
                showMessageTheme2(1, responseData.message,'',true);
            }
		}
    }catch(e){
		if(tt=='theme1'){
			showMessage(true, e);
		}else{
			showMessageTheme2(0, e,'',true);
		}
	}
}

async function getAnnouncementDetails(userId, startFrom, pageSize){
	return new Promise(function (resolve, reject) {
		var postData = {};
		postData['userId'] = userId;
		postData['startFrom'] = startFrom;
		postData['pageSize'] = pageSize;
		$.ajax({
			type : "POST",
			contentType : "application/json",
			url : getURLForHTML('dashboard', 'get-announcement-details'),
			data : JSON.stringify(postData),
			dataType : 'json',
			global: false,
			success : function(data) {
				resolve(data);
			},
			error: function (xhr, status, e) {
				showMessage(true, e.responseText);
				reject(e);
			}
		});
	});
}

// async function getMoreAnnoucement(reqType, userId){
// 	if(reqType == 'prev'){
// 		if(defaultAnnouncementIndex > 0){
// 			defaultAnnouncementIndex = defaultAnnouncementIndex - 5;
// 			if(defaultAnnouncementIndex == 0){
// 				$(".announcement-nav-prev").prop("disabled",true);
// 			}
// 		}
// 	}
// 	if(reqType == 'next'){
// 		if(defaultAnnouncementIndex == 0){
// 			$(".announcement-nav-prev").prop("disabled",false)
// 			defaultAnnouncementIndex = 5;
// 		}else{
// 			defaultAnnouncementIndex = defaultAnnouncementIndex + 5;
// 		}
// 	}
// 	var data = await getAnnouncementDetails(userId, defaultAnnouncementIndex, 5);
// 	$('#announcementDiv').html(getAnnouncementContent(data, userId, defaultAnnouncementIndex));
// }

// function saveAnnouncementAcknowledge(announceId, userId, roleModuleId) {
// 	hideMessage('');
// 	$.ajax({
// 		type: "POST",
// 		contentType: "application/json",
// 		url: getURLForHTML('dashboard', 'save-acknowledge-request'),
// 		data: JSON.stringify(getRequestForAnnouncementAcknowledge(announceId, userId, roleModuleId)),
// 		dataType: 'json',
// 		cache: false,
// 		timeout: 600000,
// 		success: function (data) {
// 			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
// 				showMessageTheme2(0, data['message'], '', false);
// 			} else {
// 				$('#announcementbyIdData').modal('hide');
// 	            	$('.accepted-announcement'+announceId).addClass('d-none');
// 				showMessageTheme2(1, data['message'], '', false);
// 			}
// 			return false;
// 		},
// 		error: function (e) {
// 			return false;
// 		}
// 	});
// }
// function getRequestForAnnouncementAcknowledge(announceId, userId, roleModuleId) {
// 	var appCommonAuthRequest = {};
// 	var authentication = {};
// 	var requestData = {};

// 	requestData['announceId'] = announceId;
// 	requestData['userId'] = userId;
// 	requestData['moduleId'] = roleModuleId;
// 	authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
// 	authentication['userId'] = userId;
// 	appCommonAuthRequest['authentication'] = authentication;
// 	appCommonAuthRequest['requestData'] = requestData;
// 	return appCommonAuthRequest;
// }