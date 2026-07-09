function getEvaluationConfigPageContent(title) {
    return `
    <div class="custom-field-scope">
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-sliders text-primary"></i>
                </div>
                <div><span class="text-primary welcome-name-text">${title}</span></div>
            </div>
            <div class="page-title-actions">
                <button class="btn btn-success btn-sm" id="addEvaluationPeriodBtn" onclick="openEvaluationPeriodModal()"><i class="fa fa-plus mr-1"></i>Add Evaluation Period</button>
            </div>
        </div>
    </div>

    <ul class="nav nav-tabs mb-3" id="evaluationConfigTabs">
        <li class="nav-item">
            <a class="nav-link active" id="ecPeriodTab" href="#" onclick="switchEvaluationConfigTab('period'); return false;">Period Configuration</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="ecParamTab" href="#" onclick="switchEvaluationConfigTab('params'); return false;">Parameter Configuration</a>
        </li>
    </ul>

    <!-- ====================== PERIOD CONFIGURATION PANEL ====================== -->
    <div id="evaluationConfigPeriodPanel">

        <!-- Filter -->
        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="row align-items-end">
                    <div class="col-md-3 mb-2">
                        <div class="form-group custom-field mb-0">
                            <select class="form-control" id="filterPeriodRole">
                                <option value="">All Roles</option>
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Management">Management</option>
                            </select>
                            <label class="font-weight-bold mb-1">Role Under Review</label>
                        </div>
                    </div>
                    <div class="col-md-3 mb-2">
                        <div class="form-group custom-field mb-0">
                            <select class="form-control" id="filterPeriodStatus">
                                <option value="">All Status</option>
                                <option value="Draft">Draft</option>
                                <option value="Active">Active</option>
                                <option value="Locked">Locked</option>
                            </select>
                            <label class="font-weight-bold mb-1">Status</label>
                        </div>
                    </div>
                    <div class="col-md-2 mb-2">
                        <div class="form-group custom-field mb-0">
                            <input type="text" class="form-control" id="filterPeriodStartDate" placeholder="Start date" autocomplete="off" readonly>
                            <label class="font-weight-bold mb-1">Start Date</label>
                        </div>
                    </div>
                    <div class="col-md-2 mb-2">
                        <div class="form-group custom-field mb-0">
                            <input type="text" class="form-control" id="filterPeriodEndDate" placeholder="End date" autocomplete="off" readonly>
                            <label class="font-weight-bold mb-1">End Date</label>
                        </div>
                    </div>
                    <div class="col-12 col-md-auto mb-2">
                        <button class="btn btn-success btn-lg mr-2" onclick="applyPeriodFilter()"><i class="fa fa-search mr-1"></i>Search</button>
                        <button class="btn btn-danger btn-lg" onclick="resetPeriodFilter()">Reset</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Periods Table -->
        <div class="main-card card">
            <div class="card-body table-responsive">
                <table class="table table-bordered border-radius-table font-12" id="evaluationPeriodTable" style="width:100%">
                    <thead class="bg-primary text-white">
                        <tr>
                            <th>S.No.</th>
                            <th>Period</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Role Under Review</th>
                            <th>Param Threshold</th>
                            <th>Overall Threshold</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="evaluationPeriodTbody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- ====================== PARAMETER CONFIGURATION PANEL ====================== -->
    <div id="evaluationConfigParamPanel" style="display:none;">

        <!-- Period selector (chips) -->
        <div class="mb-3">
            <div class="small text-muted font-weight-bold mb-2" style="letter-spacing:.6px">SELECT PERIOD</div>
            <div id="paramPeriodSelector" class="d-flex flex-wrap" style="gap:8px"></div>
        </div>

        <div id="paramConfigInfoBanner"></div>
        <div id="paramWeightBanner"></div>

        <!-- Nested sub-tabs -->
        <ul class="nav nav-tabs mb-3" id="paramConfigNestedTabs">
            <li class="nav-item">
                <a class="nav-link active" id="ecParamMainSubtab" href="#" onclick="switchParamConfigSubtab('main'); return false;">Groups &amp; Parameters</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" id="ecParamFormsSubtab" href="#" onclick="switchParamConfigSubtab('forms'); return false;">Group Forms</a>
            </li>
        </ul>

        <!-- ============ SUB-TAB: GROUPS & PARAMETERS ============ -->
        <div id="paramConfigMainSubpanel">

            <!-- Parameter Groups -->
            <div class="main-card card mb-3" id="paramGroupCard">
                <div class="card-header bg-light py-2">
                    <span class="font-weight-bold text-primary">Parameter Groups</span>
                </div>
                <div class="card-body">
                    <div class="row align-items-end mb-3">
                        <div class="col-md-9 mb-2">
                            <div class="form-group custom-field mb-0">
                                <input type="text" class="form-control" id="newGroupName" placeholder="e.g. Student Feedback">
                                <label class="font-weight-bold mb-1">Group Name</label>
                            </div>
                        </div>
                        <div class="col-md-3 mb-2">
                            <button class="btn btn-success btn-block btn-lg" onclick="addParamGroup()"><i class="fa fa-plus mr-1"></i>Add Group</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordered border-radius-table font-12" id="paramGroupTable" style="width:100%">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th>S.No.</th>
                                    <th>Group Name</th>
                                    <th>Weight</th>
                                    <th>Sub-Params</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody id="paramGroupTbody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Parameters -->
            <div class="main-card card">
                <div class="card-header bg-light py-2 d-flex justify-content-between align-items-center flex-wrap">
                    <span class="font-weight-bold text-primary">Parameters <small class="text-muted" id="parameterCount"></small></span>
                    <div class="d-flex align-items-center flex-wrap" style="gap:8px">
                        <button class="btn btn-success btn-sm" id="addParameterBtn" onclick="openAddParameterModal()"><i class="fa fa-plus mr-1"></i>Add Parameter</button>
                        <button class="btn btn-outline-primary btn-sm" id="configWeightageBtn" onclick="openWeightageModal()"><i class="fa fa-sliders mr-1"></i><span id="configWeightageLabel">Configure Weightage</span></button>
                        <button class="btn btn-link btn-sm p-0 px-1" onclick="openWeightLog()"><i class="fa fa-history mr-1"></i>Weight Log</button>
                        <div class="input-group input-group-sm" style="width:200px">
                            <input type="text" class="form-control" id="parameterSearch" placeholder="Search…">
                            <div class="input-group-append">
                                <button class="btn btn-primary" onclick="applyParameterSearch()"><i class="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-body table-responsive">
                    <table class="table table-bordered border-radius-table font-12" id="parameterTable" style="width:100%">
                        <thead class="bg-primary text-white">
                            <tr>
                                <th>S.No.</th>
                                <th>Group</th>
                                <th>Parameter Name</th>
                                <th>Evaluated By</th>
                                <th>Weight (in group)</th>
                                <th>Responses</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="parameterTbody"></tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- ============ SUB-TAB: GROUP FORMS ============ -->
        <div id="paramConfigFormsSubpanel" style="display:none">
            <div class="main-card card">
                <div class="card-header bg-light py-2 d-flex justify-content-between align-items-center flex-wrap">
                    <span class="font-weight-bold text-primary">Group Forms <small class="text-muted" id="groupFormCount"></small><div class="small text-muted">Map feedback forms to parameter groups for this period.</div></span>
                    <div class="d-flex align-items-center flex-wrap" style="gap:8px">
                        <div class="input-group input-group-sm" style="width:200px">
                            <input type="text" class="form-control" id="groupFormSearch" placeholder="Search…">
                            <div class="input-group-append">
                                <button class="btn btn-primary" onclick="applyGroupFormSearch()"><i class="fa fa-search"></i></button>
                            </div>
                        </div>
                        <button class="btn btn-success btn-sm" id="addGroupFormBtn" onclick="openGroupFormAdd()"><i class="fa fa-plus mr-1"></i>Add Form to Group</button>
                    </div>
                </div>
                <div class="card-body table-responsive">
                    <table class="table table-bordered border-radius-table font-12" id="groupFormTable" style="width:100%">
                        <thead class="bg-primary text-white">
                            <tr>
                                <th>S.No.</th>
                                <th>Group</th>
                                <th>Form</th>
                                <th>Code</th>
                                <th>Type</th>
                                <th>View</th>
                                <th>Mapped Events</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="groupFormTbody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== ADD / EDIT PERIOD MODAL ====================== -->
    <div class="modal fade" id="evaluationPeriodModal" tabindex="-1" role="dialog" aria-labelledby="evaluationPeriodModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="periodFormTitle">Add Evaluation Period</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted small mb-3"><i class="fa fa-info-circle mr-1"></i>New periods are saved as <strong>Draft</strong>. A period activates on Go Live, and the previous active period auto-locks at that point.</p>
                    <form id="evaluationPeriodForm" class="custom-field-scope">
                        <input type="hidden" id="periodId" value="">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <select class="form-control" id="periodRoleUnderReview">
                                        <option value="">Select Role</option>
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Management">Management</option>
                                    </select>
                                    <label class="font-weight-bold">Role Under Review <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <input type="text" class="form-control" id="periodStartDate" placeholder="Select date" autocomplete="off" readonly>
                                    <label class="font-weight-bold">Start Date <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <input type="text" class="form-control" id="periodEndDate" placeholder="Select date" autocomplete="off" readonly>
                                    <label class="font-weight-bold">End Date <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <input type="number" class="form-control" id="periodMinParamThreshold" placeholder="e.g. 60" min="0" max="100">
                                    <label class="font-weight-bold">Min Param Threshold (%) <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <input type="number" class="form-control" id="periodMinOverallThreshold" placeholder="e.g. 70" min="0" max="100">
                                    <label class="font-weight-bold">Min Overall Threshold (%) <span class="text-danger">*</span></label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success btn-sm" id="periodSaveBtn" onclick="saveEvaluationPeriod()">Save</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== GO LIVE MODAL ====================== -->
    <div class="modal fade" id="goLiveModal" tabindex="-1" role="dialog" aria-labelledby="goLiveModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title"><i class="fa fa-play-circle mr-2"></i><span id="goLiveTitle">Go Live</span></h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body" id="goLiveBody" style="max-height:60vh;overflow-y:auto"></div>
                <div class="modal-footer" id="goLiveFooter"></div>
            </div>
        </div>
    </div>

    <!-- ====================== EDIT GROUP MODAL ====================== -->
    <div class="modal fade" id="groupEditModal" tabindex="-1" role="dialog" aria-labelledby="groupEditModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title">Edit Parameter Group</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <form id="groupEditForm" class="custom-field-scope">
                        <input type="hidden" id="egmId" value="">
                        <div class="form-group custom-field">
                            <input type="text" class="form-control" id="egmName" placeholder="e.g. Student Feedback">
                            <label class="font-weight-bold">Group Name <span class="text-danger">*</span></label>
                        </div>
                        <div class="form-group custom-field">
                            <select class="form-control" id="egmStatus">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            <label class="font-weight-bold">Status</label>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success btn-sm" onclick="saveGroupEdit()">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== VIEW / EDIT PARAMETER MODAL ====================== -->
    <div class="modal fade" id="parameterModal" tabindex="-1" role="dialog" aria-labelledby="parameterModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="parameterModalTitle">Edit Parameter</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <form id="parameterForm" class="custom-field-scope">
                        <input type="hidden" id="epmId" value="">
                        <div class="form-group custom-field">
                            <select class="form-control" id="epmGroupId"><option value="">Select Group</option></select>
                            <label class="font-weight-bold">Parameter Group <span class="text-danger">*</span></label>
                        </div>
                        <div class="form-group custom-field">
                            <select class="form-control" id="epmName"><option value="">Select Parameter</option></select>
                            <label class="font-weight-bold">Parameter Name <span class="text-danger">*</span></label>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <select class="form-control" id="epmEvaluatedBy"><option value="">Select Evaluator</option></select>
                                    <label class="font-weight-bold">Evaluated By <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <select class="form-control" id="epmStatus">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    <label class="font-weight-bold">Status</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success btn-sm" id="epmSaveBtn" onclick="saveParameter()">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== CONFIGURE WEIGHTAGE MODAL ====================== -->
    <div class="modal fade" id="weightageModal" tabindex="-1" role="dialog" aria-labelledby="weightageModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="weightageTitle">Configure Weightage</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body" id="weightageBody" style="max-height:65vh;overflow-y:auto"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success btn-sm" id="weightageSaveBtn" onclick="saveWeightage()" disabled><i class="fa fa-save mr-1"></i>Save Weightage</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== WEIGHT LOG MODAL ====================== -->
    <div class="modal fade" id="weightLogModal" tabindex="-1" role="dialog" aria-labelledby="weightLogModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fa fa-history mr-2"></i>Weightage Change Log <small id="weightLogCount" class="ml-2"></small></h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body" id="weightLogBody" style="max-height:60vh;overflow-y:auto"></div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== ADD / EDIT GROUP FORM MODAL ====================== -->
    <div class="modal fade" id="groupFormModal" tabindex="-1" role="dialog" aria-labelledby="groupFormModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg shadow-none" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="groupFormModalTitle">Add Form to Group</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <form id="groupFormForm" class="custom-field-scope">
                        <input type="hidden" id="gfmId" value="">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <select class="form-control" id="gfmGroupId"><option value="">Select Group</option></select>
                                    <label class="font-weight-bold">Parameter Group <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <select class="form-control" id="gfmFormId"><option value="">Select Form</option></select>
                                    <label class="font-weight-bold">Feedback Form <span class="text-danger">*</span></label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group custom-field">
                                    <select class="form-control" id="gfmStatus">
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                    <label class="font-weight-bold">Status</label>
                                </div>
                            </div>
                        </div>
                        <div id="gfmFormPreview" class="mt-2"></div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success btn-sm" id="gfmSaveBtn" onclick="saveGroupForm()">Save</button>
                </div>
            </div>
        </div>
    </div>
    </div>
    `;
}
