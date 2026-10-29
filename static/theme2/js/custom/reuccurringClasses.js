

function getActiveSessionReset(formId) {
    $("#" + formId + " #startDate").val('').trigger('change');
    $("#" + formId + " #endDate").val('').trigger('change');
    $("#" + formId + " #activeSession").val('0').trigger('change');
    $("#" + formId + " #studentName").val('');
    $("#" + formId + " #studentEmail").val('');
    $("#" + formId + " #studentEmailSearch").val('');
    $("#" + formId + " #teacherEmail").val('')
    $("#" + formId + " #teacherName").val('');
    $("#" + formId + " #studentId").val('');
    $("#" + formId + " #employeeId").val('');
    $("#" + formId + " #filterEnrollType").val('').trigger('change');
    $("#" + formId + " #standardId").val('').trigger('change');
    $("#" + formId + " #createdBy").val('').trigger('change');
    $("#" + formId + " #pageSize").val('250');
}

// Row count per learning program for the same filters as the list (enroll type ignored), shown on the cards.
// A program with no matching rows is absent from the response, so every card is reset to 0 first.
function rcLoadPlatformCounts(formId) {
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'recurring-class-platform-counts'),
        data: JSON.stringify(getRecurringBody(formId)),
        dataType: 'json',
        global: false,
        async: true
    }).done(function (resp) {
        if (!resp || resp.status != "1") { return; }
        var counts = resp.counts || {};
        $('#rcPlatformCards .mu-platform-card').each(function () {
            var type = this.getAttribute('data-enroll-type');
            $('#rcPlatformCount-' + type).text(counts[type] || 0);
        });
        $('#rcPlatformTotalCount').text(resp.total != null ? resp.total : 0);
    });
}

function getActiveSessionReuccurring(formId) {
    rcLoadPlatformCounts(formId);
    customLoader(true);
  $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
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
    recurringDTO['studentEmailSearch'] = $("#" + formId + " #studentEmailSearch").val() ? $("#" + formId + " #studentEmailSearch").val().trim() : '';
    recurringDTO['applicationNo'] = $("#" + formId + " #applicationNo").val();
    request['recurringDTO']=recurringDTO;
    return request;
}