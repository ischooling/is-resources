function openModal(tabFrom){
    if(tabFrom == 'leadReport'){
        $(".enrollType").hide();
    }else if(tabFrom == 'enrollmentList'){
        //$(".enrollType").hide();
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
            callLeadCounselorsList('leadReportSearch',$("#searchLeadCounselorType").val(), startDate, endDate, 'listCounselorTbody', false, 0, 0);
        });
    }else if(submitId == 'enrollmentList'){
        var startDate = $("#dataStudentStartDate").val();
        var endDate = $("#dataStudentEndDate").val();
        callLeadEnrolled('leadReportSearch', $("#searchStudenttype").val(), startDate, endDate);

    }
}

