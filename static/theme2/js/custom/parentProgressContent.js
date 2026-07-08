function getParentProgressContent(pageData){
    var backupStudentList = STUDENT_LIST;
    var sliderHtml = getStudentTabSliderContent(pageData.tabData, 'parentProgressOnStudentTabClick');
    STUDENT_LIST = backupStudentList;
    var html = `
        <div class="full">
            ${sliderHtml}

            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Progress Report</h4>
                        <div class="d-flex align-items-center flex-wrap mr-3 mb-2 mb-md-0">
                            <div class="btn-group mr-2">
                                <button type="button" class="fc-today-button btn btn-light btn-pill progress-view-button" onclick="parentProgressViewFilter(this,'agendaMonth')">Monthly</button>
                                <button type="button" class="fc-agendaDay-button btn btn-light btn-pill progress-view-button" onclick="parentProgressViewFilter(this,'agendaWeek')">Weekly</button>
                                <button type="button" class="fc-agendaWeek-button btn btn-light btn-pill progress-view-button" onclick="parentProgressShowCustomFilter(this)">Custom</button>
                            </div>
                            <div class="progress-custom-filter-form" style="visibility:hidden">
                                <div class="d-inline-flex gap-5">
                                    <div>
                                        <input type="text" class="datepicker form-control form-control-sm" id="progressStartDate" placeholder="Select Start Date"/>
                                    </div>
                                    <div>
                                        <input type="text" class="datepicker form-control form-control-sm" id="progressEndDate" placeholder="Select End Date"/>
                                    </div>
                                    <button class="btn btn-primary btn-sm" onclick="parentProgressApplyFilter()">Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive" id="parentProgressTable" style="width:100%;">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th class="pl-3">S. No.</th>
                                    <th>Report Type</th>
                                    <th>Report Frequency</th>
                                    <th>Report Published Date</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${getParentProgressRowsHtml(pageData.rows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentProgressRowsHtml(rows){
    var rowsHtml = "";
    $.each(rows || [], function(index, row){
        rowsHtml += `
            <tr>
                <td class="pl-3">${index + 1}</td>
                <td>${row.reportType}</td>
                <td>${row.reportFrequency}</td>
                <td>${row.publishedDate}</td>
                <td>${getParentProgressViewBtn(row)}</td>
            </tr>`;
    });
    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="5" class="text-center">No progress report found</td></tr>`;
    }
    return rowsHtml;
}

function getParentProgressViewBtn(row){
    if(!row.viewUrl){
        return `<button type="button" class="btn btn-primary btn-sm disabled">View <i class="fa fa-eye ml-1"></i></button>`;
    }
    return `<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="parentProgressOpenReport('${encodeURIComponent(row.viewUrl)}')">View <i class="fa fa-eye ml-1"></i></a>`;
}
