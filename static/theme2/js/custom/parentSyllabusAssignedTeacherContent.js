function getParentSyllabusAssignedTeacherContent(pageData){
    
    var backupStudentList = STUDENT_LIST;
    var sliderHtml = getStudentTabSliderContent(pageData.tabData, 'parentAssignedTeacherOnStudentTabClick');
    STUDENT_LIST = backupStudentList;
    var html = `
        <div class="full">
            ${sliderHtml}

            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Assigned Teachers</h4>
                        ${/*<div class="mr-3" style="width:260px;max-width:100%;">
                            <input type="text" id="parentAssignedTeacherSearch" class="form-control" placeholder="Search sessions...">
                        </div>*/''}
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive" id="parentAssignedTeacherTable" style="width: 100%;">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th class="pl-3">S.No</th>
                                    <th>Selected Courses</th>
                                    <th>Assigned Teacher</th>
                                </tr>
                            </thead>
                            <tbody id="parentAssignedTeacherBody">
                                ${getParentSyllabusTeacherRowsHtml(pageData.rows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentSyllabusTeacherRowsHtml(rows){
    var rowsHtml = "";
    $.each(rows || [], function(index, row){
        var courseName = row.courseName.split("Grade")[0]
        rowsHtml += `
            <tr>
                <td class="pl-3">${index + 1}</td>
                <td>${courseName || "N/A"}</td>
                <td>${getSalutationByGender(row.teacherGender)} ${row.teacherName || "N/A"}</td>
            </tr>`;
    });

    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="3" class="text-center">No assigned teacher found</td></tr>`;
    }
    return rowsHtml;
}

