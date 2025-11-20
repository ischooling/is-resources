function dashboardMonitoringContent(){
    var html=
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"><i class="pe-7s-monitor text-primary"></i></div>
                    <div>Dashboard Monitoring</div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <a href="javascript:void(0)" onclick="showFilterDashboardMonitoring();" class="btn btn-primary ml-auto">
                <i class="fa fa-filter"></i> Filter
            </a>
        </div>`
        +dashboardMonitoringFilterContent()
        +dashboardMonitoringTableContent();
    return html;
}

function dashboardMonitoringFilterContent(){
    var html =
        `<form id="dashboardMonitoringFilterForm" class="border rounded-10 bg-white p-3 mb-3 mt-2" style="display: none;">
            <div class="row">
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                    <label>Name</label>
                    <select id="userName" class="form-control"></select>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                    <label>Email</label>
                    <input type="text" id="userEmail" class="form-control">
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                    <label>Select Date Type</label>
                    <select class="form-control" name="selectedType" id="selectedType" onchange="selectDateOnTypeChangeForMonitoring(this);">
                        <option value="today">Today</option>    
                        <option value="week">Week</option>    
                        <option value="month">Month</option>    
                        <option value="custom" selected>Custom</option>    
                    </select>   
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 datepickerStartWrapper">
                    <label>Start Date</label>
                    <input type="text" id="activeTrackerDateTo" class="form-control" readonly onkeydown="return false">
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 datepickerEndWrapper">
                    <label>End Date</label>
                    <input type="text" id="activeTrackerDateFrom" class="form-control" readonly onkeydown="return false">
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">
                    <label>No. of records</label>
                    <input type="text" id="numberOfRecords" class="form-control" value="25" onkeydown="return M.digit(event);">
                </div>
            </div>
            <div class="d-flex flex-wrap justify-content-end mt-2">
                <button type="button" class="btn btn-danger mb-2" onclick="resetDashboardMonitoringFilter('dashboardMonitoringFilterForm');">
                    <i class="fa fa-undo"></i>&nbsp;Reset
                </button>
                <button type="button" class="btn btn-success ml-2 mb-2" onclick="applyFilterDashboardMonitoring('dashboardMonitoringFilterForm','');">
                    <i class="fa fa-search"></i>&nbsp;Search
                </button>
            </div>
        </form>`;
    return html;
}

function dashboardMonitoringTableContent(){
    var html=
        `<div class="table-responsive mt-3 bg-white p-2">
            <table id="dashboardMonitoringTable" class="table table-bordered font-12">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>Sr No.</th>
                        <th>Name</th>
                        <th>Committed Time</th>
                        <th>Active Time</th>
                        <th>Meeting Time</th>
                        <th>Total Time</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`
    return html;
}

function renderUserActivityModalForParticular(responseData){
    var html=
        `<div class="modal fade" id="userActivityModalForParticularUser" tabindex="-1" role="dialog" aria-labelledby="userActivityModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">User Activity Details (${responseData.data[0].userName})</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <table class="table table-bordered mb-0">
                            <thead class="bg-light">
                                <th>Activity Date</th>
                                <th>Last Active</th>
                                <th>Active Time</th>
                                <th>Meeting Time</th>
                                <th>Total Time</th>
                            </thead>
                            <tbody>`
                                if(responseData.data.length > 0){
                                    $.each(responseData.data, function(index, item){
                                        html+=`<tr>
                                            <td>${item.activityDate}</td>
                                            <td>${item.lastActiveDateTime}</td>
                                            <td>${item.time}</td>
                                            <td>${item.gotoMeetingTotalTime ? item.gotoMeetingTotalTime : "-"}</td>
                                            <td>${item.totalTime ? item.totalTime : "-"}</td>
                                        </tr>`
                                    })
                                }else{
                                    html+=`<tr><td colspan="9">No Data Found</td></tr>`
                                }
                            html+=`</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}