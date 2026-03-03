
function parentFeeDetailsOnLoadEvent(){
    if($.fn.slick){
        if($('.user-slider').hasClass('slick-initialized')){
            $('.user-slider').slick('unslick');
        }
        $('.user-slider').slick({
            slidesToShow: parentFeeDetailsGetSlidesToShow(),
            slidesToScroll: 1,
            infinite: false,
            arrows: true,
            responsive: [
                {breakpoint: 992, settings: {slidesToShow: 3}},
                {breakpoint: 768, settings: {slidesToShow: 2}},
                {breakpoint: 576, settings: {slidesToShow: 1}}
            ]
        });
    }
    
    reintiailzeDataTable();
}
function reintiailzeDataTable (){
    if(!$.fn.DataTable){
        return;
    }
    if($.fn.DataTable.isDataTable('#parentFeeDetailsTable')){
        $('#parentFeeDetailsTable').DataTable().destroy();
    }
    if($("#parentFeeDetailsTable tbody tr").length === 0 || $("#parentFeeDetailsTable tbody td[colspan]").length > 0){
        return;
    }
}
function intiailzeDataTable(){
    $('#parentFeeDetailsTable').DataTable({
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
async function parentFeeDetailsRenderByStudent(studentUserId){
    ACTIVE_STUDENT_ID = studentUserId;
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
    var apiResponse = await parentFeeDetailsFetchByStudent(studentUserId);
    // var students = parentFeeDetailsResolveStudentsFromGlobal();
    var rows = parentFeeDetailsMapRows(apiResponse);
    reintiailzeDataTable();
    $("#parentFeeDetailsBody").html(getParentFeeDetailsRowsHtml(apiResponse, schoolSettingsTechnical, roleAndModule, SCHOOL_ID));
    intiailzeDataTable();
}
// function parentFeeDetailsResolveStudentsFromGlobal(){
//     if(typeof STUDENT_LIST === "undefined" || !STUDENT_LIST){
//         return [];
//     }
//     if($.isArray(STUDENT_LIST)){
//         return STUDENT_LIST;
//     }
//     if($.isArray(STUDENT_LIST.studentBasicDetails)){
//         return STUDENT_LIST.studentBasicDetails;
//     }
//     if(STUDENT_LIST.data && $.isArray(STUDENT_LIST.data.studentBasicDetails)){
//         return STUDENT_LIST.data.studentBasicDetails;
//     }
//     if($.isArray(STUDENT_LIST.students)){
//         return STUDENT_LIST.students;
//     }
//     return [];
// }

async function parentFeeDetailsFetchByStudent(studentUserId){
    var payload = { userId: USER_ID + "", studentUserId: studentUserId + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-fee-details",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function parentFeeDetailsMapRows(apiResponse){
    var rowList = parentFeeDetailsResolveList(apiResponse);
    var rows = [];
    $.each(rowList || [], function(index, item){
        rows.push({
            scheduledDate: item.scheduledPayDate || item.scheduledDate || item.scheduleDate || item.paymentScheduledDate || "N/A",
            grade: item.standardName || item.grade || item.className || "N/A",
            paymentName: item.paymentName || item.feeName || item.paymentTitle || "N/A",
            paidFee: parentFeeDetailsFormatAmount(item.payAmount || item.paidFee || item.feeAmount || item.amount || item.paidAmount),
            paidDate: item.payDate || item.paidDate || item.paymentDate || item.feePaidDate || "N/A",
            status: item.status || item.paymentStatus || "N/A",
            receiptUrl: item.downloadUrl || item.recieptLink || item.receiptUrl || item.viewReceiptUrl || item.receiptLink || ""
        });
    });
    return rows;
}

function parentFeeDetailsResolveList(apiResponse){
    if(!apiResponse){
        return [];
    }
    if($.isArray(apiResponse)){
        return apiResponse;
    }
    var details = apiResponse.details || apiResponse.data || apiResponse.response || {};
    if($.isArray(details)){
        return details;
    }
    var listCandidates = [
        details.userPaymentDetailsList, details.studentFeeDetails, details.feeDetails, details.paymentDetails, details.rows, details.list,
        apiResponse.userPaymentDetailsList, apiResponse.studentFeeDetails, apiResponse.feeDetails, apiResponse.paymentDetails, apiResponse.rows, apiResponse.list
    ];
    var resolved = [];
    $.each(listCandidates, function(index, candidate){
        if($.isArray(candidate) && resolved.length === 0){
            resolved = candidate;
        }
    });
    return resolved;
}

function parentFeeDetailsFormatAmount(amount){
    if(amount === undefined || amount === null || amount === ""){
        return "N/A";
    }
    var amountValue = amount + "";
    if(amountValue.indexOf("$") > -1){
        return amountValue;
    }
    return "$ " + amountValue;
}

function parentFeeDetailsGetSlidesToShow(){
    var containerWidth = $('.parent-tab-slider-wrapper').width();
    var itemWidth = 220;
    var slides = Math.floor(containerWidth / itemWidth);
    return slides > 0 ? slides : 1;
}
