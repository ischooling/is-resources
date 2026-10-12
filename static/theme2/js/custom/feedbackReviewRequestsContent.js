function getFeedbackReviewRequestsPageContent(title) {
    return `
    <div class="custom-field-scope">
        <div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-flag text-primary"></i>
                    </div>
                    <div>
                        <span class="text-primary welcome-name-text">${title}</span>
                        <div class="page-title-subheading">Review disputed student feedback and decide if it should count in ratings.</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="row align-items-end">
                    <div class="col-md-3 mb-2">
                        <div class="form-group custom-field mb-0">
                            <select class="form-control" id="frrPeriodId"></select>
                            <label class="font-weight-bold mb-1">Evaluation Period</label>
                        </div>
                    </div>
                    <div class="col-md-2 mb-2">
                        <div class="form-group custom-field mb-0 is-filled">
                            <select class="form-control" id="frrStatus">
                                <option value="">All</option>
                                <option value="Pending" selected>Pending</option>
                                <option value="Genuine">Genuine</option>
                                <option value="Excluded">Excluded</option>
                            </select>
                            <label class="font-weight-bold mb-1">Status</label>
                        </div>
                    </div>
                    <div class="col-md-4 mb-2">
                        <div class="form-group custom-field mb-0">
                            <input type="text" class="form-control" id="frrSearch" placeholder="Teacher, student, form, reason" autocomplete="off">
                            <label class="font-weight-bold mb-1">Search</label>
                        </div>
                    </div>
                    <div class="col-md-auto mb-2">
                        <button class="btn btn-success btn-lg mr-2" onclick="applyFeedbackReviewFilter()"><i class="fa fa-search mr-1"></i>Search</button>
                        <button class="btn btn-danger btn-lg" onclick="resetFeedbackReviewFilter()">Reset</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-4 col-6 mb-2">
                <div class="main-card card h-100">
                    <div class="card-body py-2">
                        <div class="small text-muted text-uppercase font-weight-bold">Showing</div>
                        <div class="h4 mb-0 mt-1" id="frrShowing">0</div>
                        <div class="small text-muted">Requests on this page</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-6 mb-2">
                <div class="main-card card h-100">
                    <div class="card-body py-2">
                        <div class="small text-muted text-uppercase font-weight-bold">Total</div>
                        <div class="h4 mb-0 mt-1 text-primary" id="frrTotal">0</div>
                        <div class="small text-muted">Matching requests</div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-12 mb-2">
                <div class="main-card card h-100">
                    <div class="card-body py-2">
                        <div class="small text-muted text-uppercase font-weight-bold">Action rule</div>
                        <div class="small mt-1">Exclude removes the feedback response from rating calculations. Genuine keeps it counted and sends the teacher your remark.</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="main-card card">
            <div class="card-body table-responsive">
                <div class="d-flex align-items-center mb-2" style="max-width: 100px;">
                    <div class="form-group custom-field mb-0" style="width:90px">
                        <select class="form-control" id="frrPageSize">
                            <option value="10">10</option>
                            <option value="20" selected>20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <label class="font-weight-bold mb-1">Size</label>
                    </div>
                </div>
                <table class="table table-bordered border-radius-table font-12" style="width:100%">
                    <thead class="bg-primary text-white">
                        <tr>
                            <th>#</th>
                            <th>Teacher</th>
                            <th>Student</th>
                            <th>Feedback</th>
                            <th>Rating</th>
                            <th>Request</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="frrTbody"></tbody>
                </table>
                <div id="frrPagination"></div>
            </div>
        </div>

        <div class="modal fade" id="frrActionModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered shadow-none" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fa fa-gavel mr-2"></i><span id="frrActionTitle">Review request</span></h5>
                        <button type="button" class="close text-white" data-dismiss="modal"><i class="fa fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div id="frrActionMeta" class="mb-3 small text-muted"></div>
                        <div class="form-group">
                            <label class="font-weight-bold">Admin remark</label>
                            <textarea class="form-control" id="frrActionRemark" rows="4" maxlength="1000" placeholder="Write why this feedback is genuine or why it should be excluded."></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-light" data-dismiss="modal">Cancel</button>
                        <button class="btn btn-danger" id="frrExcludeBtn" onclick="submitFeedbackReviewAction('Exclude')"><i class="fa fa-ban mr-1"></i>Exclude</button>
                        <button class="btn btn-success" id="frrGenuineBtn" onclick="submitFeedbackReviewAction('Genuine')"><i class="fa fa-check mr-1"></i>Mark Genuine</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="frrFeedbackModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable shadow-none" role="document">
                <div class="modal-content shadow-none">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title"><i class="fa fa-comments mr-2"></i>Feedback Details</h5>
                        <button type="button" class="close text-white" data-dismiss="modal"><i class="fa fa-times"></i></button>
                    </div>
                    <div class="modal-body">
                        <div id="frrFeedbackBody"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}
