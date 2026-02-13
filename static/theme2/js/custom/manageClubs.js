var CURRENT_PAGE_MANAGE_CLUBS = 1;
async function manageClubsOnLoad(){
    await getAllClubsCount();
    await getAllClubsData();
    getAllCountryList("manageClubsFilterWrapper","filterClubCountryId");
    $('#filterClubStandardId').append(getStandardContent(SCHOOL_ID_OF_USER,true));
    $("#filterClubName").select2({
        theme:"bootstrap4"
    });
    $("#filterClubCountryId").select2({
        theme:"bootstrap4"
    });
    $("#filterClubStandardId").select2({
        theme:"bootstrap4"
    });
}

async function getAllClubsData(){
    var payload = {
        studentName: $("#filterClubStudentName").val().trim(),
        studentEmail: $("#filterClubStudentEmail").val().trim(),
        clubName: $("#filterClubName").val(),
        countryId: $("#filterClubCountryId").val(),
        standardId: $("#filterClubStandardId").val(),
        currentPage: CURRENT_PAGE_MANAGE_CLUBS
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
        $("#manageClubsPagination").html(renderPaginationCommon(CURRENT_PAGE_MANAGE_CLUBS, responseData.totalPageCount, "manageClubs"));
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
        var filterHtml = getManageClubsFilter(responseData.countObj);
        $('#manageClubsFilterWrapper').html(filterHtml);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

function resetClubFilters() {
    $("#filterClubStudentName").val('');
    $("#filterClubStudentEmail").val('');
    $("#filterClubName").val('').trigger('change');
    $("#filterClubCountryId").val('').trigger('change');
    $("#filterClubStandardId").val('0').trigger('change');
}

function applyClubFilter(){
    CURRENT_PAGE_MANAGE_CLUBS = 1;
    getAllClubsData();
}