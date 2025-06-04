

function getActiveSessionReset(formId) {
    $("#" + formId + " #startDate").val('').trigger('change');
    $("#" + formId + " #endDate").val('').trigger('change');
    $("#" + formId + " #activeSession").val('0').trigger('change');
    $("#" + formId + " #studentName").val('');
    $("#" + formId + " #studentEmail").val('');
    $("#" + formId + " #teacherEmail").val('')
    $("#" + formId + " #teacherName").val('');
    $("#" + formId + " #studentId").val('');
    $("#" + formId + " #employeeId").val('');
    $("#" + formId + " #filterEnrollType").val('').trigger('change');
    $("#" + formId + " #standardId").val('').trigger('change');
    $("#" + formId + " #createdBy").val('').trigger('change');
    $("#" + formId + " #pageSize").val('250');
}

function getActiveSessionReuccurring(formId) {
    customLoader(true);
  $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'recurring-class-list'),
        data: JSON.stringify(getRecurringBody(formId)),
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
                    $('#recurringList').html(htmlContent);
                    customLoader(false);
                }
                customLoader(false);
                return false;
            }
        }
    });
}

function getRecurringBody(formId) {
    var request = {};
    var recurringDTO = {};
    recurringDTO['activeSession'] = $('#' + formId + ' #activeSession').val();
    recurringDTO['studentEmail'] = $('#' + formId + ' #studentEmail').val();
    recurringDTO['teacherEmail'] = $('#' + formId + ' #teacherEmail').val();
    recurringDTO['startDate'] = $("#" + formId + " #startDate").val();
    recurringDTO['endDate'] = $("#" + formId + " #endDate").val();
    recurringDTO['studentName'] = $("#" + formId + " #studentName").val();
    recurringDTO['teacherName'] = $("#" + formId + " #teacherName").val();
    recurringDTO['filterEnrollType'] = $("#" + formId + " #filterEnrollType").val();
    recurringDTO['standardId'] = $("#" + formId + " #standardId").val();
    recurringDTO['pageSize'] = $("#" + formId + " #pageSize").val();
    recurringDTO['createdBy'] = $("#" + formId + " #createdBy").val();
    recurringDTO['studentStringId'] = $("#" + formId + " #studentId").val();
    recurringDTO['applicationNo'] = $("#" + formId + " #applicationNo").val();
    request['recurringDTO']=recurringDTO;
    return request;
}