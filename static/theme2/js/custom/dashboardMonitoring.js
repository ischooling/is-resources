function dashboardMonitoringOnLoad(formId){
    $("#"+ formId +  " #selectedType").val('today').trigger('change');
    getAllAdminCounselorList(formId, 'userName')
    $("#"+ formId + " #userName").select2({
        placeholder: "Select users",
        theme:"bootstrap4",
        allowClear: true
    });
    $('#'+formId+' #userName').val('').trigger("change");
    applyFilterDashboardMonitoring(formId,'');
}

function showFilterDashboardMonitoring(){
    $("#dashboardMonitoringFilterForm").slideToggle(300);
}

function resetDashboardMonitoringFilter(formId){
    $('#'+formId+' #userName').val("").trigger("change");
    $('#'+formId+' #userEmail').val("");
    $('#'+formId+' #selectedType').val("custom").trigger("change");
    $('#'+formId+' #activeTrackerDateTo').val("");
    $('#'+formId+' #activeTrackerDateFrom').val("");
    $('#'+formId+' #numberOfRecords').val("25");
}

async function applyFilterDashboardMonitoring(formId, callFrom, userId, startDate, endDate){
    var trackerDateTo = changeDateFormat(new Date($('#'+formId+' #activeTrackerDateTo').val()),"yyyy-mm-dd");
    var trackerDateFrom= changeDateFormat(new Date($('#'+formId+' #activeTrackerDateFrom').val()),"yyyy-mm-dd");
    var payload = {}
    if(callFrom == "details"){
      payload['userId'] = userId;
    }else{
      payload['userId'] = $('#'+formId+' #userName').val();
    }
    payload['userEmail'] = $('#'+formId+' #userEmail').val();
    payload['callFrom'] = callFrom;
    payload['activeTrackerDateTo'] = startDate ? startDate.split("-").reverse().join("-") : trackerDateTo;
    payload['activeTrackerDateFrom'] = endDate ? endDate.split("-").reverse().join("-") : trackerDateFrom;
    payload['numberOfRecords'] = $('#'+formId+' #numberOfRecords').val();
    var ajaxReqDetails = {
        method: "POST",
        url: getURLForHTML("dashboard", "get-activity-track-time-by-filter"),
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
      if(callFrom == "details"){
        if($("#userActivityModalForParticularUser").length == 1){
          $("#userActivityModalForParticularUser").remove();
        }
        $("body").append(renderUserActivityModalForParticular(responseData));
        setTimeout(() => {
          $("#userActivityModalForParticularUser").modal("show");
        }, 300);
      }else{
        renderDashboardMonitoringTableData(responseData);
      }
    }else{
        $("#dashboardMonitoringTable tbody").empty();
        $("#dashboardMonitoringTable tbody").html(
            `<tr>
                <td colspan="6" class="text-center">No data found</td>
            </tr>`
        );
    }
}

function selectDateOnTypeChangeForMonitoring(src) {
    if ($(src).val() == "custom") {
    $("#activeTrackerDateTo, #activeTrackerDateFrom").attr("disabled", false).removeClass("bg-light-primary").val("");
      $("#activeTrackerDateTo, #activeTrackerDateFrom").datepicker("destroy");
      $("#activeTrackerDateTo")
        .datepicker({
          format: "M dd, yyyy",
          container: "#dashboardMonitoringFilterForm .datepickerStartWrapper",
          autoclose: true,
        })
        .on("change", function () {
          const startDate = $(this).datepicker("getDate");
          $("#activeTrackerDateFrom")
            .val("")
            .attr("disabled", false)
            .removeClass("bg-light-primary")
            .datepicker("destroy")
            .datepicker({
              format: "M dd, yyyy",
              container: "#dashboardMonitoringFilterForm .datepickerEndWrapper",
              autoclose: true,
              startDate: startDate,
            });
        });
  
      $("#activeTrackerDateTo").val("").attr("disabled", false).removeClass("bg-light-primary");
    } else {
      $("#activeTrackerDateTo, #activeTrackerDateFrom").attr("disabled", true).addClass("bg-light-primary");
    }
  
    const type = $("#dashboardMonitoringFilterForm #selectedType").val();
  
    if (type === "today") {
      const today = new Date();
      const formatted = changeDateFormat(today, "MMM-dd-yyyy");
      $("#activeTrackerDateTo").val(formatted);
      $("#activeTrackerDateFrom").val(formatted);
  
    } else if (type === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formatted = changeDateFormat(yesterday, "MMM-dd-yyyy");
      $("#activeTrackerDateTo").val(formatted);
      $("#activeTrackerDateFrom").val(formatted);
  
    } else if (type === "week") {
      const today = new Date();
      const first = new Date(today.setDate(today.getDate() - today.getDay()));
      const last = new Date(first);
      last.setDate(first.getDate() + 6);
      $("#activeTrackerDateTo").val(changeDateFormat(first, "MMM-dd-yyyy"));
      $("#activeTrackerDateFrom").val(changeDateFormat(last, "MMM-dd-yyyy"));
  
    } else if (type === "month") {
      const today = new Date();
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      $("#activeTrackerDateTo").val(changeDateFormat(first, "MMM-dd-yyyy"));
      $("#activeTrackerDateFrom").val(changeDateFormat(last, "MMM-dd-yyyy"));
    } 
}

function renderDashboardMonitoringTableData(responseData){
    var tableBody = $("#dashboardMonitoringTable tbody").empty();
    var html=``;
    if (responseData) {
        responseData.data.forEach((newitem, index) => {
            html+= 
            `<tr>
                <td>${index + 1}</td>
                <td>
                  <a href="javascript:void(0);" onclick="applyFilterDashboardMonitoring('dashboardMonitoringFilterForm','details', '${newitem.userId}')" class="text-primary font-weight-semi-bold">${newitem.userName}</a>
                </td>
                <td>${newitem.committedWorkingHours}</td>
                <td>${newitem.time}</td>
                <td>${newitem.gotoMeetingTotalTime ? newitem.gotoMeetingTotalTime : "-"}</td>
                <td>${newitem.totalTime ? newitem.totalTime : "-"}</td>
            </tr>`;
        });
    } else {
        html+=
        `<tr>
            <td colspan="6" class="text-center">No data found</td>
        </tr>`;
    }
    tableBody.append(html);
}
