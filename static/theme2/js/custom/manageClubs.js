function manageClubsOnLoad(){
    getAllClubsCount();
    getAllClubsData("");
}

async function getAllClubsData(clubName){
    var payload = {
        clubName: clubName
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/get-all-club-request",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        getManageClubsTbody(responseData.data);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

async function getAllClubsCount(){
    var payload = {
        clubNames: ""
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/get-club-request-count",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        var cardsHtml = getManageClubsCards(responseData.countObj);
        $('#manageClubsCardsWrapper').html(cardsHtml);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}