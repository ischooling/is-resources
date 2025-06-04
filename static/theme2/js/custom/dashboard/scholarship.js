

function getScholarfilterReset(formId) {
    $("#" + formId + " #filterDiscountCode").val('');
    $("#" + formId + " #filterStudentName").val('');
    $("#" + formId + " #filterStudentEmail").val('');
    $("#" + formId + " #filterAddedBy").val('All').trigger('change');
    $("#" + formId + " #filterDiscountFor").val('').trigger('change');
    $("#" + formId + " #filterLearningPlan").val('').trigger('change');
    $("#" + formId + " #filterAmount").val('');
    $("#" + formId + " #filterStatus").val('').trigger('change');
    $("#" + formId + " #filterValidity").val('').trigger('change');
}

function getScholarfilter(formId) {
    customLoader(true);
  $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-scholarship-code'),
        data: JSON.stringify(getScholarFilterBody(formId)),
        dataType: 'html',
        async: true,
        success: function (htmlContent) {
            if (htmlContent != "") {
                var stringMessage = [];
                stringMessage = htmlContent.split("|");
                if (stringMessage[0] == "FAILED" || stringMessage[0] == "EXCEPTION" || stringMessage[0] == "SESSIONOUT") {
                    if (stringMessage[0] == "SESSIONOUT") {
                        redirectLoginPage();
                    } else {
                        showMessage(true, stringMessage[1]);
                    }
                } else {
                    $('#scholarList').html(htmlContent);
                    customLoader(false);
                    var table = $('#scholarShipTable').DataTable({"pagingType":"full",});
                    $('#scholarShipTable').on('page.dt',function(){
                        table.responsive.recalc();
                    });
                }
                customLoader(false);
                return false;
            }
        }
    });
}

function getScholarFilterBody(formId) {
    var request = {};
    request['themetype'] = "theme2";
    request['discountCode'] = $('#' + formId + ' #filterDiscountCode').val();
    request['studentName'] = $('#' + formId + ' #filterStudentName').val();
    request['studentEmail'] = $('#' + formId + ' #filterStudentEmail').val();
    request['addedBy'] = $("#" + formId + " #filterAddedBy").val();
    request['discountFor'] = $("#" + formId + " #filterDiscountFor").val();
    request['learningPlan'] = $("#" + formId + " #filterLearningPlan").val();
    request['amount'] = $("#" + formId + " #filterAmount").val();
    request['status'] = $("#" + formId + " #filterStatus").val();
    request['validity'] = $("#" + formId + " #filterValidity").val();

    return request;
}