function getFeedbackFormPageContent(){
    return `
    <div class="w-100">
        <div class="main-card mb-3 card">
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <h5 class="text-primary font-weight-semi-bold mb-0">Feedback Form Integrations</h5>
                    <a href="javascript:void(0);" class="btn btn-sm btn-primary rounded ml-auto" onclick="pullFeedbackFormData()"><i class="fa fa-refresh" aria-hidden="true"></i> Pull Data</a>
                </div>
                <div class="table-responsive">
                    <table id="feedbackFormTable" class="table table-hover table-striped table-bordered mb-0 font-12">
                        <thead class="bg-primary text-white">
                            <tr>
                                <th>Label</th>
                                <th>Code</th>
                                <th>Form URL</th>
                                <th>Description</th>
                                <th>Roles</th>
                                <th>Events</th>
                                <th>View Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="feedbackFormTableBody">
                            <tr><td colspan="9" class="text-center text-muted">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `;
}

function getFeedbackFormEditRightSlideModal(){
    return `
    <div id="feedbackFormEditModal" class="modal fade pr-0 right-slide-modal" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static">
        <div class="modal-dialog modal-lg m-0 ml-auto h-100" role="document">
            <div class="modal-content border-0 h-100 rounded-0">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <div class="modal-header border-0 px-4 py-3" style="background:linear-gradient(90deg,#007FFF 0%,#02b9cc 100%);">
                    <div>
                        <h4 class="text-white font-weight-bold mb-0">Edit Feedback Form - </h4>
                        <p class="text-white-50 mb-0 font-13">Update feedback form integration details</p>
                    </div>
                </div>
                <div class="modal-body px-4 py-3 overflow-auto" style="max-height:calc(100vh - 72px);">
                    <form id="feedbackFormEditForm" onsubmit="return false;">
                        <input type="hidden" id="feedbackId" />
                        <input type="hidden" id="feedbackCode" />

                        <div class="form-group">
                            <label class="font-weight-semi-bold">Feedback Label</label>
                            <input type="text" id="feedbackLabel" class="form-control" placeholder="Enter feedback label" />
                        </div>

                        <div class="form-group">
                            <label class="font-weight-semi-bold">Form URL</label>
                            <input type="text" id="formUrl" class="form-control" placeholder="https://..." disabled />
                        </div>

                        <div class="form-group">
                            <label class="font-weight-semi-bold">Short Description</label>
                            <textarea id="shortDescription" rows="3" class="form-control" placeholder="Enter short description" disabled></textarea>
                        </div>

                        <div class="form-group">
                            <label class="font-weight-semi-bold">View Type</label>
                            <select id="feedbackViewType" class="form-control">
                                <option value="popup">Popup</option>
                                <option value="side_navigation">Side Navigation</option>
                            </select>
                            <small class="text-muted">Side Navigation forms appear in the sidebar menu; Popup forms open as a popup.</small>
                        </div>

                        <div class="form-group">
                            <label class="font-weight-semi-bold">Status</label>
                            <select id="feedbackActiveStatus" class="form-control">
                                <option value="Y">Active</option>
                                <option value="N">Inactive</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="font-weight-semi-bold">Roles</label>
                            <select id="feedbackRoleIds" class="form-control" multiple></select>
                            <small class="text-muted">Use Ctrl/Cmd to select multiple roles.</small>
                        </div>

                        <div class="form-group">
                            <label class="font-weight-semi-bold">Mapped Events</label>
                            <select id="feedbackEventNames" class="form-control" multiple></select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer border-top px-4 py-3">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveFeedbackFormIntegration()">
                        <i class="fa fa-save"></i> Save
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}