function getParentAcademicDocsContent(pageData){
    var backupStudentList = STUDENT_LIST;
    var sliderHtml = getStudentTabSliderContent(pageData.tabData, 'parentAcademicDocsOnStudentTabClick');
    STUDENT_LIST = backupStudentList;
    var filteredRows = parentAcademicDocsFilterRows(pageData.rows, PARENT_ACADEMIC_DOCS_FILTER_VIEW);
    var html = `
        <div class="full">
            ${sliderHtml}

            <div class="main-card mb-3 card rounded-10 border py-3">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between">
                        <h4 class="mb-2 mb-md-0 ml-3 font-20 font-weight-bold">Academic Documents</h4>
                    </div>
                    <div class="px-3 pt-3 pb-2">
                        <div class="btn-group mb-2">
                            <button type="button" class="btn btn-light active btn-pill parent-academic-docs-filter-btn" onclick="parentAcademicDocsFilterView(this,'week')">Weekly</button>
                            <button type="button" class="btn btn-light btn-pill parent-academic-docs-filter-btn" onclick="parentAcademicDocsFilterView(this,'month')">Monthly</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table font-12 nowrap dt-responsive" id="parentAcademicDocsTable" style="width: 100%;">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th class="pl-3">S.No</th>
                                    <th>Grade</th>
                                    <th>Academic Year</th>
                                    <th>Learning Program</th>
                                    <th>Transcript</th>
                                    <th>Diploma</th>
                                    <th>Academic Verification</th>
                                </tr>
                            </thead>
                            <tbody id="parentAcademicDocsBody">
                                ${getParentAcademicDocsRowsHtml(filteredRows)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentAcademicDocsRowsHtml(rows){
    var rowsHtml = "";
    $.each(rows || [], function(index, row){
        rowsHtml += `
            <tr>
                <td class="pl-3">${index + 1}</td>
                <td>${row.grade || "N/A"}</td>
                <td>${row.batch || "N/A"}</td>
                <td>${row.learningProgram || "N/A"}</td>
                <td>${getParentAcademicDocsDownloadBtn(row.transcriptUrl, row.showTranscript)}</td>
                <td>${getParentAcademicDocsDownloadBtn(row.diplomaUrl, "Y")}</td>
                <td>${getParentAcademicDocsDownloadBtn(row.academicVerificationUrl, "Y")}</td>
            </tr>`;
    });

    if(!rowsHtml){
        rowsHtml = `<tr><td colspan="7" class="text-center">No academic documents found</td></tr>`;
    }
    return rowsHtml;
}

function getParentAcademicDocsDownloadBtn(url, showFlag){
    if(showFlag === "N" || !url){
        return `--`;
    }
    if(String(url).indexOf("dummy-student-transcript://") === 0){
        return `<button type="button" class="btn btn-outline-primary btn-sm" onclick="return window.openDummyStudentTranscriptFromUrl && window.openDummyStudentTranscriptFromUrl('${url}');">Download <i class="fa fa-download ml-1"></i></button>`;
    }
    return `<a href="${url}" target="_blank" class="btn btn-outline-primary btn-sm">Download <i class="fa fa-download ml-1"></i></a>`;
}
