var defaultNewsIndex = 0;
async function renderNews(userId) {
  if(typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyNewsList === "function"){
    var responseData = getDummyNewsList();
    $("#newsyDiv").html(getNewsContent(responseData, userId, 0));
    $("#newsBadge").text(parseInt(responseData.totalNews));
    return;
  }
  var ajaxReqDetails = {
    method: "GET",
    url: APP_BASE_URL + "api/v1/website/get-all-articles?page=1&size=10",
    body: "",
    global: true,
    showMessage: false,
    onFaildResolved: true,
    onSuccessResolved: true,
  };
  var responseData = await callCommonAjax(ajaxReqDetails);
  $("#newsyDiv").html(getNewsContent(responseData, userId, 0));
  $(".announcement-anchor .announcement-list").click(function () {
    $(this).parent().find(".horizontal-scroll-table").slideToggle();
    $(this)
      .parent()
      .closest("li")
      .siblings()
      .find(".horizontal-scroll-table")
      .slideUp();
  });
  $("#newsBadge").text(parseInt(responseData.totalNews));
}
async function showNewsDataById(newsId) {
  try {
    if(typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyNewsById === "function"){
      var responseData = getDummyNewsById(newsId);
      if (responseData.code == 200) {
        if ($("#newsDetailsModal").length > 0) {
          $("#newsDetailsModal").remove();
        }
        $("body").append(newsModalContent(responseData.data));
        $("#newsDetailsModal").modal({ backdrop: "static", keyboard: false });
      }
      return;
    }
    var ajaxReqDetails = {
      method: "GET",
      url:
        APP_BASE_URL +
        `api/v1/website/get-article-by-id?id=${newsId}&userId=${USER_ID}`,
      body: "",
      global: true,
      showMessage: false,
      onFaildResolved: true,
      onSuccessResolved: true,
    };
    var responseData = await callCommonAjax(ajaxReqDetails);
    if (responseData.code == 200) {
      if ($("#newsDetailsModal").length > 0) {
        $("#newsDetailsModal").remove();
      }
      $("body").append(newsModalContent(responseData.data));
      $("#newsDetailsModal").modal({ backdrop: "static", keyboard: false });
    }
  } catch (e) {
    showMessageTheme2(0, e, "", true);
  }
}
async function showNewsDataByIds(newsIds) {
  try {
    if(typeof isDummyStudentMode === "function" && isDummyStudentMode()){
      getNewsListData("fresh");
      $("#newsBadge").hide();
      return;
    }
    var ajaxReqDetails = {
      method: "POST",
      url: APP_BASE_URL + `api/v1/website/get-article-by-ids`,
      body: { userId: USER_ID, ids: newsIds },
      global: true,
      showMessage: false,
      onFaildResolved: true,
      onSuccessResolved: true,
    };
    var responseData = await callCommonAjax(ajaxReqDetails);
    if (responseData.code == 200) {
      getNewsListData("fresh");
      $("#newsBadge").hide();
      return;
    }
  } catch (e) {
    showMessageTheme2(0, e, "", true);
  }
}

var NEW_LIST_PAGE_NO=1
async function getNewsListData(reqFlag){
	if(reqFlag == "next"){
		NEW_LIST_PAGE_NO++;
	}else if(reqFlag == "prev"){
		NEW_LIST_PAGE_NO--
	}
	if(typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyNewsList === "function"){
		var responseData = getDummyNewsList();
		$("#newsAllListWithDetailsModalFooter").hide();
		$('#newsAllListWithDetailsModal #newsAllListWithDetailsModalBody').html(getListNewsDetails(responseData.list));
		$('#newsAllListWithDetailsModal').modal({backdrop: 'static', keyboard: false});
		return;
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
	if(responseData.list.length<10){
		$("#getNextNewsBtn").hide();
	}else{
		$("#getNextNewsBtn").show();
	}
}
