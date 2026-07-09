function getParentDashboardDemoDataContent(title) {
    return `
        <style>
            #parentDemoDataForm.custom-field-scope .custom-field,
            #parentDemoDataFilterForm.custom-field-scope .custom-field {
                margin-bottom: 0;
            }
            #parentDemoDataForm .select2-container,
            #parentDemoDataFilterForm .select2-container {
                width: 100% !important;
            }
            #parentDemoDataForm .select2-container--bootstrap4 .select2-selection,
            #parentDemoDataFilterForm .select2-container--bootstrap4 .select2-selection {
                min-height: 44px;
                border-color: #d5dde5;
                border-radius: 6px;
            }
            #parentDemoDataForm .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered,
            #parentDemoDataFilterForm .select2-container--bootstrap4 .select2-selection--single .select2-selection__rendered {
                line-height: 42px;
                padding-left: 12px;
                color: #495057;
            }
            #parentDemoDataForm .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow,
            #parentDemoDataFilterForm .select2-container--bootstrap4 .select2-selection--single .select2-selection__arrow {
                height: 42px;
            }
            #parentDemoDataForm #courseName + .select2 .select2-selection--multiple {
                min-height: 44px;
                max-height: 86px;
                overflow-y: auto;
                overflow-x: hidden;
                padding: 4px 8px;
            }
            #parentDemoDataForm #courseName + .select2 .select2-selection__rendered {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                padding: 0;
                margin: 0;
            }
            #parentDemoDataForm #courseName + .select2 .select2-selection__choice {
                max-width: 100%;
                margin: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                line-height: 24px;
            }
            #parentDemoDataForm .parent-demo-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 16px;
            }
            #parentDemoDataTable {
                table-layout: fixed;
                width: 100%;
            }
            #parentDemoDataTable th,
            #parentDemoDataTable td {
                vertical-align: middle;
            }
            #parentDemoDataTable th:nth-child(1),
            #parentDemoDataTable td:nth-child(1) {
                width: 9%;
            }
            #parentDemoDataTable th:nth-child(2),
            #parentDemoDataTable td:nth-child(2) {
                width: 11%;
            }
            #parentDemoDataTable th:nth-child(3),
            #parentDemoDataTable td:nth-child(3) {
                width: 6%;
            }
            #parentDemoDataTable th:nth-child(4),
            #parentDemoDataTable td:nth-child(4) {
                width: 68%;
            }
            #parentDemoDataTable th:nth-child(5),
            #parentDemoDataTable td:nth-child(5) {
                width: 6%;
            }
            #parentDemoDataTable .parent-demo-course-name {
                white-space: normal;
                overflow-wrap: anywhere;
                word-break: break-word;
                line-height: 1.4;
            }
            #parentDemoDataTable .parent-demo-actions-cell {
                white-space: nowrap;
                text-align: center;
            }
            #parentDemoDataTable .parent-demo-actions-inline {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }
            #parentDemoDataTable .parent-demo-actions-inline .btn {
                width: 34px;
                height: 34px;
                padding: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 34px;
            }
        </style>
        <div class="app-page-title mb-3">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div>${title || "Dummy Parent Dashboard"}</div>
                </div>
            </div>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <form id="parentDemoDataForm" class="custom-field-scope" autocomplete="off" action="javascript:void(0);">
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
                                <select id="learningProgram" name="learningProgram" class="form-control" onchange="parentDemoDataOnLearningProgramChange('parentDemoDataForm')"></select>
                                <label>Learning Program</label>
                            </div>
                        </div>
                        <div class="col-xl-2 col-lg-4 col-md-5 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="gradeId" name="gradeId" class="form-control" onchange="parentDemoDataLoadCourses('parentDemoDataForm')"></select>
                                <label>Grade</label>
                            </div>
                        </div>
                        <div class="col-xl-4 col-lg-8 col-md-7 col-12 mb-3">
                            <div class="form-group custom-field">
                                <select id="courseName" name="courseName" class="form-control" multiple="multiple"></select>
                                <label>Course Name</label>
                            </div>
                        </div>
                    </div>
                    <div class="parent-demo-actions">
                        <button type="button" class="btn btn-danger px-4" onclick="resetParentDashboardDemoDataForm()">Reset</button>
                        <button type="button" class="btn btn-success px-4" onclick="saveParentDashboardDemoData(this)">Save</button>
                    </div>
                </form>
            </div>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <form id="parentDemoDataFilterForm" class="custom-field-scope" autocomplete="off" action="javascript:void(0);">
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
                            <button type="button" class="btn btn-danger" onclick="resetParentDashboardDemoDataFilter()">Reset</button>
                            <button type="button" class="btn btn-success" onclick="loadParentDashboardDemoData()">Search</button>
                        </div>
                    </div>
                </form>
                <div class="table-responsive">
                    <table class="table table-bordered table-striped" id="parentDemoDataTable">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Learning Program</th>
                                <th>Grade</th>
                                <th>Course Name</th>
                                <th class="text-center parent-demo-actions-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="modal fade fade-scale" id="parentDemoDeleteConfirmModal" tabindex="-1">
            <div class="modal-dialog modal-sm modal-dialog-centered box-shadow-none" role="document">
                <div class="modal-content text-center">
                    <div class="modal-header pt-2 pb-2 bg-danger text-white justify-content-center">
                        <h5 class="heading">Are you sure you want to delete this demo data?</h5>
                    </div>
                    <div id="statusMessage-1" class="modal-body delete-modal">
                        <i class="fa fa-times fa-4x text-danger"></i>
                    </div>
                    <div class="modal-footer">
                        <div class="m-auto">
                            <button type="button" class="btn btn-outline-danger" id="parentDemoDeleteConfirmYes">Yes</button>
                            <button type="button" class="btn btn-danger" data-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}
