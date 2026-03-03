function getStudentSyllabusAssignedTeacherContent(pageData){
    return `<div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
            <div class="page-title-icon"> <i class="metismenu-icon pe-7s-news-paper icon-gradient bg-ripe-malin"> </i> </div>
            <div>Assigned Course Teachers</div>
            </div>
        </div>
    </div>
    <div class="full">
            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Assigned Course Teachers</h4>
                        <div class="mr-3" style="width:260px;max-width:100%;">
                            <input type="text" id="studentAssignedTeacherSearch" class="form-control" placeholder="Search sessions...">
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive" id="studentAssignedTeacherTable" style="width:100%;">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th class="pl-3">S.No</th>
                                    <th>Selected Courses</th>
                                    <th>Assigned Teacher</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${getStudentSyllabusAssignedTeacherRowsHtml(pageData.rows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
}

function getStudentSyllabusAssignedTeacherRowsHtml(rows){
    var rowsHtml = "";
    $.each(rows || [], function(index, row){
        rowsHtml += `<tr>
                <td class="pl-3">${index + 1}</td>
                <td>${row.courseName || "N/A"}</td>
                <td>${row.teacherName || "N/A"}</td>
            </tr>`;
    });
    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="3" class="text-center">No assigned teacher found</td></tr>`;
    }
    return rowsHtml;
}
