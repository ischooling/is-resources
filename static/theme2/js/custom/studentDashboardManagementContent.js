function getStudentDashboardManagementContent(title) {
    return `
        <style>
            #studentDashboardManagementForm.custom-field-scope .custom-field,
            #studentDashboardManagementFilterForm.custom-field-scope .custom-field {
                margin-bottom: 0;
            }
            #studentDashboardManagementForm .select2-container,
            #studentDashboardManagementFilterForm .select2-container {
                width: 100% !important;
            }
            #studentDashboardManagementForm .select2-container--bootstrap4 .select2-selection,
            #studentDashboardManagementFilterForm .select2-container--bootstrap4 .select2-selection {
                min-height: 44px;
                border-color: #d5dde5;
                border-radius: 6px;
            }
            #studentDashboardManagementForm .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered,
            #studentDashboardManagementFilterForm .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered {
                line-height: 42px;
                padding-left: 12px;
                color: #495057;
            }
            #studentDashboardManagementForm #courseName + .select2 .select2-selection--multiple {
                min-height: 44px;
                max-height: 86px;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 4px 8px;
            }
            #studentDashboardManagementForm .student-dashboard-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 16px;
            }
        </style>
        <div class="app-page-title mb-3">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div>${title || "Student Dashboard Management"}</div>
                </div>
            </div>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <form id="studentDashboardManagementForm" class="custom-field-scope" autocomplete="off" action="javascript:void(0);">
                    <input type="hidden" id="demoDataId" value="">
                    <div class="form-row align-items-start">
                        <div class="col-xl-3 col-lg-6 col-md-6 col-12 mb-3">
                            <div class="form-group custom-field">
                                <input type="text" id="studentName" name="studentName" class="form-control" placeholder=" ">
                                <label>Student Name</label>
                            </div>
                        </div>
                        <div class="col-xl-3 col-lg-6 col-md-6 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="learningProgram" name="learningProgram" class="form-control" onchange="studentDashboardManagementOnLearningProgramChange('studentDashboardManagementForm')"></select>
                                <label>Learning Program</label>
                            </div>
                        </div>
                        <div class="col-xl-2 col-lg-4 col-md-5 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="gradeId" name="gradeId" class="form-control" onchange="studentDashboardManagementLoadCourses('studentDashboardManagementForm')"></select>
                                <label>Grade</label>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-8 col-md-7 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="courseName" name="courseName" class="form-control" multiple="multiple"></select>
                                <label>Course Name</label>
                            </div>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-4 col-12 mb-3">
                            <div class="form-group custom-field">
                                <input type="number" id="classCount" name="classCount" class="form-control" min="0" value="3" placeholder=" ">
                                <label>Class Count</label>
                            </div>
                        </div>
                        <div class="col-xl-2 col-lg-3 col-md-4 col-12 mb-3">
                            <div class="form-group custom-field">
                                <input type="number" id="activityCount" name="activityCount" class="form-control" min="0" value="2" placeholder=" ">
                                <label>Activity Count</label>
                            </div>
                        </div>
                    </div>
                    <div class="student-dashboard-actions">
                       <button type="button" class="btn btn-danger px-4" onclick="resetStudentDashboardManagementForm()">Reset</button>
                        <button type="button" class="btn btn-success px-4" onclick="saveStudentDashboardManagementData(this)">Save</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <form id="studentDashboardManagementFilterForm" class="custom-field-scope" autocomplete="off" action="javascript:void(0);">
                    <div class="form-row align-items-start">
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <div class="form-group custom-field">
                                <input type="text" id="filterStudentName" class="form-control" placeholder=" ">
                                <label>Student Name</label>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-6 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="filterLearningProgram" class="form-control"></select>
                                <label>Learning Program</label>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-5 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="filterGradeId" class="form-control"></select>
                                <label>Grade</label>
                            </div>
                        </div>
                        <div class="col-lg-4 col-md-7 col-12 mb-3 text-right">
                          <button type="button" class="btn btn-danger" onclick="resetStudentDashboardManagementFilter()">Reset</button>
                            <button type="button" class="btn btn-success" onclick="loadStudentDashboardManagementData()">Search</button>
                        </div>
                    </div>
                </form>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped" id="studentDashboardManagementTable">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Learning Program</th>
                                <th>Grade</th>
                                <th>Course Name</th>
                                <th>Class Count</th>
                                <th>Activity Count</th>
                                <th>Status</th>
                                <th class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>`;
}
