function getEventDiscountPageContent(title) {
    return `
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-money text-primary"></i>
                </div>
                <div><span class="text-primary welcome-name-text">${title}</span></div>
            </div>
            <div class="page-title-actions">
                <button class="btn btn-primary btn-sm mr-1" onclick="openCreateDiscountModal()">Create Discount</button>
                <button class="btn btn-success btn-sm mr-1" onclick="openAssignDiscountModal(null)">Assign Discount</button>
                <button class="btn btn-info btn-sm" onclick="openCreateAndAssignModal()">Create &amp; Assign</button>
            </div>
        </div>
    </div>

    <ul class="nav nav-tabs mb-3" id="eventDiscountTabs">
        <li class="nav-item">
            <a class="nav-link active" id="edMastersTab" href="#" onclick="switchEventDiscountTab('masters'); return false;">Discount Masters</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" id="edAssigneesTab" href="#" onclick="switchEventDiscountTab('assignees'); return false;">Assignees</a>
        </li>
    </ul>

    <!-- Masters Panel -->
    <div id="eventDiscountMastersPanel">
        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="row align-items-end">
                    <div class="col-md-4 mb-2">
                        <label class="font-weight-bold mb-1">Event Name</label>
                        <select class="form-control" id="filterMasterEventName">
                            <option value="">All Events</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-auto mb-2">
                        <button class="btn btn-primary mr-2" onclick="applyMasterFilter()">Apply Filter</button>
                        <button class="btn btn-danger" onclick="resetMasterFilter()">Reset</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-card card">
            <div class="card-body table-responsive">
                <table class="table table-bordered border-radius-table font-12" id="eventDiscountMastersTable" style="width:100%">
                    <thead class="bg-primary text-white">
                        <tr>
                            <th>S.No.</th>
                            <th>Event Name</th>
                            <th>Discount Type</th>
                            <th>Discount Value</th>
                            <th>Coupon Code</th>
                            <th>Valid From</th>
                            <th>Valid To</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="eventDiscountMastersTbody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Assignees Panel -->
    <div id="eventDiscountAssigneesPanel" style="display:none;">
        <div class="card shadow-sm mb-3">
            <div class="card-body">
                <div class="row align-items-end">
                    <div class="col-md-4 mb-2">
                        <label class="font-weight-bold mb-1">Event Name</label>
                        <select class="form-control" id="filterAssigneeEventName">
                            <option value="">All Events</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="font-weight-bold mb-1">Discount <small class="text-muted">(optional)</small></label>
                        <select class="form-control" id="filterAssigneeDiscountName">
                            <option value="">All Discounts</option>
                        </select>
                    </div>
                    <div class="col-12 col-md-auto mb-2">
                        <button class="btn btn-primary mr-2" onclick="applyAssigneeFilter()">Apply Filter</button>
                        <button class="btn btn-danger" onclick="resetAssigneeFilter()">Reset</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="eventDiscountCountsWrapper" class="mb-3"></div>
        <div class="main-card card">
            <div class="card-body table-responsive">
                <table class="table table-bordered border-radius-table font-12" id="eventDiscountAssigneesTable" style="width:100%">
                    <thead class="bg-primary text-white">
                        <tr>
                            <th>S.No.</th>
                            <th>Discount</th>
                            <th>Email</th>
                            <th>Assigned At</th>
                        </tr>
                    </thead>
                    <tbody id="eventDiscountAssigneesTbody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Create Discount Modal -->
    <div class="modal fade" id="createDiscountModal" tabindex="-1" role="dialog" aria-labelledby="createDiscountModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="createDiscountModalLabel">Create Discount</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <form id="createDiscountForm">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Event Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="cdEventName" placeholder="Graduation Ceremony">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Discount Type <span class="text-danger">*</span></label>
                                    <select class="form-control" id="cdDiscountType">
                                        <option value="">Select Type</option>
                                        <option value="AMOUNT">AMOUNT</option>
                                        <option value="PERCENT">PERCENT</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Discount Value <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="cdDiscountValue" placeholder="e.g. 50" min="1">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Coupon Code <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="cdCouponCode" placeholder="e.g. GC50">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Valid From <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="cdValidFrom" placeholder="Select date" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Valid To <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="cdValidTo" placeholder="Select date" readonly>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="submitCreateDiscount()">Create</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Assign Discount Modal -->
    <div class="modal fade" id="assignDiscountModal" tabindex="-1" role="dialog" aria-labelledby="assignDiscountModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title" id="assignDiscountModalLabel">Assign Discount</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <form id="assignDiscountForm">
                        <div class="form-group">
                            <label class="font-weight-bold">Discount <span class="text-danger">*</span></label>
                            <select class="form-control" id="adDiscountId">
                                <option value="">Select Discount</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="font-weight-bold">Email <span class="text-danger">*</span></label>
                            <input type="email" class="form-control" id="adEmail" placeholder="e.g. user@example.com">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success btn-sm" onclick="submitAssignDiscount()">Assign</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Create & Assign Modal -->
    <div class="modal fade" id="createAndAssignModal" tabindex="-1" role="dialog" aria-labelledby="createAndAssignModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header bg-info text-white">
                    <h5 class="modal-title" id="createAndAssignModalLabel">Create &amp; Assign Discount</h5>
                    <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
                </div>
                <div class="modal-body">
                    <form id="createAndAssignForm">
                        <h6 class="text-primary font-weight-bold border-bottom pb-2 mb-3">Discount Details</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Event Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="caEventName" placeholder="Graduation Ceremony">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Discount Type <span class="text-danger">*</span></label>
                                    <select class="form-control" id="caDiscountType">
                                        <option value="">Select Type</option>
                                        <option value="AMOUNT">AMOUNT</option>
                                        <option value="PERCENT">PERCENT</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Discount Value <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="caDiscountValue" placeholder="e.g. 10" min="1">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Coupon Code <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="caCouponCode" placeholder="e.g. GC10">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Valid From <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="caValidFrom" placeholder="Select date" readonly>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Valid To <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="caValidTo" placeholder="Select date" readonly>
                                </div>
                            </div>
                        </div>
                        <h6 class="text-primary font-weight-bold border-bottom pb-2 mb-3 mt-2">User Details</h6>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group">
                                    <label class="font-weight-bold">Email <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="caEmail" placeholder="e.g. user@example.com">
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-info btn-sm" onclick="submitCreateAndAssign()">Create &amp; Assign</button>
                </div>
            </div>
        </div>
    </div>
    `;
}
