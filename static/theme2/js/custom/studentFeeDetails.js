async function studentFeeDetailsLoadData(){
    var apiResponse = await studentFeeDetailsFetch();
    studentFeeDetailsResetDataTable();
    $("#studentFeeDetailsBody").html(getStudentFeeDetailsRowsHtml(apiResponse));
    studentFeeDetailsInitDataTable();
}

async function studentFeeDetailsFetch(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-fee-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    if (typeof window.getDummyStudentFeeDetailsResponse === "function" && typeof window.isDummyStudentMode === "function" && window.isDummyStudentMode()) {
        return window.getDummyStudentFeeDetailsResponse(ajaxReqDetails);
    }
    return await callCommonAjax(ajaxReqDetails);
}

function studentFeeDetailsResetDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#studentFeeDetailsTable')){
        $('#studentFeeDetailsTable').DataTable().destroy();
    }
    if($("#studentFeeDetailsTable tbody tr").length === 0 || $("#studentFeeDetailsTable tbody td[colspan]").length > 0){
        return;
    }
}

function studentFeeDetailsInitDataTable(){
    if(!$.fn.DataTable){
        return;
    }
    if($("#studentFeeDetailsTable tbody td[colspan]").length > 0){
        return;
    }
    $('#studentFeeDetailsTable').DataTable({
        paging: true,
        searching: false,
        ordering: false,
        info: true,
        pageLength: 10,
        lengthChange: false,
        autoWidth: false,
        dom: 't<"d-flex flex-wrap align-items-center justify-content-between px-3 py-2"i p>',
        language: {
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: { previous: "Previous", next: "Next" }
        }
    });
}
