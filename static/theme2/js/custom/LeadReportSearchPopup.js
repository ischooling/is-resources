function openModal(tabFrom){
    if(tabFrom == 'leadReport'){
        $(".enrollType").hide();
        $(".leadSource").show();
        $(".leadStatus").show();
        $(".demoAssign").show();
        $(".acadmicYearDiv").show();
    }else if(tabFrom == 'enrollmentList'){
        $(".enrollType").show();
        $(".leadSource").hide();
        $(".leadStatus").hide();
        $(".demoAssign").hide();
        $(".acadmicYearDiv").hide();
    }
    $('#leadReportSearch').modal('show')
    $("#callFrom").val(tabFrom);
}

function submitFunction(){
    var submitId = $("#callFrom").val();
    if(submitId == 'leadReport'){
        $("#btnClickLeadReportSearch").on("click",function(){
            var startDate = $("#counselorStartDate").val();
            var endDate = $("#counselorEndDate").val();
            if ($("#searchLeadCounselorReportType").val() == 'LOGS') {
                callLeadLogsCounselorsList('leadReportSearch', $("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody');
                return;
            }
            callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody', false, 0, 0);
        });
    }else if(submitId == 'enrollmentList'){
        var startDate = $("#dataStudentStartDate").val();
        var endDate = $("#dataStudentEndDate").val();
        callLeadEnrolled('leadReportSearch', $("#searchStudenttype").val(), startDate, endDate);

    }
}
