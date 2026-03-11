function getStudentProgressDetailContent(pageData){
    return `
        <div class="full mt-3">
            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Progress Report</h4>
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive" id="studentProgressDetailTable" style="width:100%;">
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
                                ${getStudentProgressDetailRowsHtml(pageData.rows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
}

function getStudentProgressDetailRowsHtml(rows){
    var rowsHtml = "";
    $.each(rows || [], function(index, row){
        rowsHtml += `
            <tr>
                <td class="pl-3">${index + 1}</td>
                <td>${row.reportType}</td>
                <td>${row.reportFrequency}</td>
                <td>${row.publishedDate}</td>
                <td>${getStudentProgressDetailViewBtn(row)}</td>
            </tr>`;
    });
    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="5" class="text-center">No progress report found</td></tr>`;
    }
    return rowsHtml;
}

function getStudentProgressDetailViewBtn(row){
    if(!row.viewUrl){
        return `<button type="button" class="btn btn-primary btn-sm disabled">View <i class="fa fa-eye ml-1"></i></button>`;
    }
    return `<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="studentProgressDetailOpenReport('${encodeURIComponent(row.viewUrl)}')">View <i class="fa fa-eye ml-1"></i></a>`;
}
