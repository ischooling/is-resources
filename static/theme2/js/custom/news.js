var defaultNewsIndex = 0;
async function renderNews(userId){
	// var data = await getNewsDetails(userId, 0, 10);
	var ajaxReqDetails = {
        method: "GET",
        url: APP_BASE_URL + "api/v1/website/get-all-articles?page=1&size=10",
        body: "",
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);

	$('#newsyDiv').html(getNewsContent(responseData, userId, 0));
    $(".announcement-anchor .announcement-list").click(function(){
        $(this).parent().find(".horizontal-scroll-table").slideToggle();
        $(this).parent().closest("li").siblings().find(".horizontal-scroll-table").slideUp();
    });
}
async function showNewsDataById(newsId){
	try{
		var ajaxReqDetails = {
			method: "GET",
			url: APP_BASE_URL + `api/v1/website/get-article-by-id?id=${newsId}`,
			body: "",
			global: true,
			showMessage: false,
			onFaildResolved: true,
			onSuccessResolved: true
		}
		var responseData = await callCommonAjax(ajaxReqDetails);
        if(responseData.code==200){
            if($("#newsDetailsModal").length>0){
                $("#newsDetailsModal").remove();
            }
            $('body').append(newsModalContent(responseData.data));
			$('#newsDetailsModal').modal({backdrop: 'static', keyboard: false});
		}
		
		
	}catch(e){
		if(tt=='theme1'){
			showMessage(true, e);
		}else{
			showMessageTheme2(0, e,'',true);
		}
	}
}

var newsData =[

	{
		title:"Mars Rover Discovers Evidence of Ancient Water System",
		date:"Jan 27, 2026",
		id:"01",
		imgSource:"https://www.reuters.com/resizer/v2/KTFJKK4N6ZIPBAA4WVG2N5G2CY.jpg?auth=fa7a3ebfaeea9fd16735273771cb25efcb48687d9e5dd7ef08c36bec220c71dd&width=720&quality=80"
	},
	{
		title:"Mars Rover Discovers Evidence of Ancient Water System",
		date:"Jan 28, 2026",
		id:"01",
		imgSource:"https://www.reuters.com/resizer/v2/KTFJKK4N6ZIPBAA4WVG2N5G2CY.jpg?auth=fa7a3ebfaeea9fd16735273771cb25efcb48687d9e5dd7ef08c36bec220c71dd&width=720&quality=80"
	},
	{
		title:"Mars Rover Discovers Evidence of Ancient Water System",
		date:"Jan 29, 2026",
		id:"01",
		imgSource:"https://www.reuters.com/resizer/v2/KTFJKK4N6ZIPBAA4WVG2N5G2CY.jpg?auth=fa7a3ebfaeea9fd16735273771cb25efcb48687d9e5dd7ef08c36bec220c71dd&width=720&quality=80"
	}

]

async function getNewsDetails(userId, startFrom, pageSize){
	return new Promise(function (resolve, reject) {
		var postData = {};
		postData['userId'] = userId;
		postData['startFrom'] = startFrom;
		postData['pageSize'] = pageSize;
		$.ajax({
			type : "POST",
			contentType : APPLICATION_JSON_VALUE,
			url : getURLForHTML('dashboard', 'get-announcement-details'),
			data : JSON.stringify(postData),
			dataType : 'json',
			global: false,
			success : function(data) {
				resolve(newsData);
			},
			error: function (xhr, status, e) {
				if (checkonlineOfflineStatus()) {
					return;
				}
				showMessage(true, e.responseText);
				reject(e);
			}
		});
	});
}


var NEW_LIST_PAGE_NO=1
async function getNewsListData(reqFlag){
	if(reqFlag == "next"){
		NEW_LIST_PAGE_NO++;
	}else if(reqFlag == "prev"){
		NEW_LIST_PAGE_NO--
	}
	var ajaxReqDetails = {
        method: "GET",
        url: APP_BASE_URL + `api/v1/website/get-all-articles?page=${NEW_LIST_PAGE_NO}&size=10`,
        body: "",
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
	if(responseData.totalNews<10){
		$("#newsAllListWithDetailsModalFooter").hide();
	}
	if(responseData.code==200){
		$('#newsAllListWithDetailsModal #newsAllListWithDetailsModalBody').append(getListNewsDetails(responseData.list));
		$('#newsAllListWithDetailsModal').modal({backdrop: 'static', keyboard: false});
	}
	
	console.log(responseData);
}

// async function getMoreAnnoucement(reqType, userId){
// 	if(reqType == 'prev'){
// 		if(defaultNewsIndex > 0){
// 			defaultNewsIndex = defaultNewsIndex - 5;
// 			if(defaultNewsIndex == 0){
// 				$(".announcement-nav-prev").prop("disabled",true);
// 			}
// 		}
// 	}
// 	if(reqType == 'next'){
// 		if(defaultNewsIndex == 0){
// 			$(".announcement-nav-prev").prop("disabled",false)
// 			defaultNewsIndex = 5;
// 		}else{
// 			defaultNewsIndex = defaultNewsIndex + 5;
// 		}
// 	}
// 	var data = await getNewsDetails(userId, defaultNewsIndex, 5);
// 	$('#announcementDiv').html(getNewsContent(data, userId, defaultNewsIndex));
// }

// function saveNewsAcknowledge(announceId, userId, roleModuleId) {
// 	hideMessage('');
// 	$.ajax({
// 		type: "POST",
// 		contentType: "application/json",
// 		url: getURLForHTML('dashboard', 'save-acknowledge-request'),
// 		data: JSON.stringify(getRequestForNewsAcknowledge(announceId, userId, roleModuleId)),
// 		dataType: 'json',
// 		cache: false,
// 		timeout: 600000,
// 		success: function (data) {
// 			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
// 				showMessageTheme2(0, data['message'], '', false);
// 			} else {
// 				$('#newsDetailsModal').modal('hide');
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
// function getRequestForNewsAcknowledge(announceId, userId, roleModuleId) {
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