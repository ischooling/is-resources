async function applyForClub(clubName){
    var payload = {
        userId: USER_ID,
        clubName: clubName
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/save-club-request",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        $("#clubRegistrationSuccessModal").remove();
        $("body").append(getClubRegistrationSuccessModal());
        $("#clubRegistrationSuccessModal").modal("show");
    }else{
        showMessageTheme2(0, responseData.message);
    }
}