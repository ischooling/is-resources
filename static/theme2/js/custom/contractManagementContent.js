/* ============================================================================
   Contract Management — page template
   - getContractManagementPageContent → LIST page (#dashboardContentInHTML)
   ========================================================================== */

function getContractManagementPageContent(title) {
    return `
    <div class="custom-field-scope">
    <div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fa fa-file-text-o text-primary"></i>
                </div>
                <div><span class="text-primary welcome-name-text">${title}</span></div>
            </div>
        </div>
    </div>

    <!-- ====================== TOOLBAR (page size + status filters + search) ====================== -->
    <div class="card shadow-sm mb-3">
        <div class="card-body py-3">
            <div class="d-flex align-items-center flex-wrap" style="gap:12px">
                <div class="d-flex align-items-center" style="gap:8px">
                    <span class="text-muted small">Show</span>
                    <select class="form-control form-control-sm" id="tcmPageSize" style="width:70px">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span class="text-muted small">entries</span>
                </div>
                <div class="d-flex align-items-center flex-wrap" id="tcmStatusFilters" style="gap:6px"></div>
                <div class="d-flex align-items-center ml-auto" style="gap:6px">
                    <input type="text" class="form-control form-control-sm" id="tcmSearchInput"
                           placeholder="Search teacher, email or reference" autocomplete="off" style="width:260px;max-width:60vw">
                    <button class="btn btn-success btn-sm" onclick="applyTeacherContractSearch()"><i class="fa fa-search mr-1"></i>Search</button>
                    <button class="btn btn-danger btn-sm" onclick="resetTeacherContractSearch()">Reset</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ====================== CONTRACTS TABLE ====================== -->
    <div class="main-card card">
        <div class="card-body table-responsive">
            <table class="table table-bordered border-radius-table font-12" id="contractManagementTable" style="width:100%">
                <thead class="bg-primary text-white">
                    <tr>
                        <th style="width:50px">S.No</th>
                        <th>Teacher Details</th>
                        <th>Current Contract</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Accepted On</th>
                        <th>Action</th>
                        <th>Past Contracts</th>
                    </tr>
                </thead>
                <tbody id="tcmTbody"></tbody>
            </table>
            <div id="tcmPagination"></div>
        </div>
    </div>
    </div>
    `;
}

/* Right-slide modal that renders a contract's agreement HTML (agreementViewUrl) in an iframe. */
function getTcmAgreementModalHtml() {
    return `
    <div class="modal right-slide-modal fade" id="tcmAgreementModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header py-2 bg-primary text-white">
                    <h5 class="modal-title" id="tcmAgreementModalTitle">Contract</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fa fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body p-0" style="height:calc(100vh - 48px);overflow:hidden;position:relative">
                    <div id="tcmAgreementLoader"
                         style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#fff;z-index:2">
                        <i class="fa fa-spinner fa-spin fa-2x text-primary"></i>
                        <div class="mt-2 text-muted">Loading contract…</div>
                    </div>
                    <iframe id="tcmAgreementFrame" src="about:blank" title="Contract"
                            style="width:100%;height:100%;border:0;display:block"></iframe>
                </div>
            </div>
        </div>
    </div>
    `;
}

/* Re-issue modal: pick "Valid for (Days)" (1–10) → the new valid-till date is
   computed and shown in a disabled field, mirroring the add-contract flow. */
function getTcmReissueModalHtml() {
    var dayOptions = '';
    for (var i = 1; i <= 10; i++) {
        dayOptions += '<option value="' + i + '">' + i + ' Day' + (i > 1 ? 's' : '') + '</option>';
    }
    return `
    <div class="modal fade" id="tcmReissueModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered shadow-none" role="document">
            <div class="modal-content shadow-none">
                <div class="modal-header py-2 bg-primary text-white">
                    <h5 class="modal-title" id="tcmReissueTitle">Re-issue Contract</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fa fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="tcmReissueForm" class="custom-field-scope">
                        <input type="hidden" id="tcmReissueStartDate" value="">
                        <p id="tcmReissueIntro" class="mb-3"></p>
                        <div class="form-row">
                            <div class="form-group col-md-6 col-12 position-relative custom-field">
                                <select class="form-control" id="tcmReissueDays"
                                    onchange="calculateEndDate('tcmReissueForm','tcmReissueStartDate','tcmReissueDays','tcmReissueEndDate','DAY')">
                                    <option value="0">Select Days</option>
                                    ${dayOptions}
                                </select>
                                <label>Valid for (Days)</label>
                            </div>
                            <div class="form-group col-md-6 col-12 position-relative custom-field">
                                <input type="text" class="form-control" id="tcmReissueEndDate" readonly onkeydown="return false" disabled placeholder=" ">
                                <label>New Valid Till Date</label>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="tcmReissueSubmitBtn" onclick="submitTeacherReissue()">Re-initiate</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

/* Centered modal listing every contract (current + past) for one teacher. */
function getTcmAllContractsModalHtml() {
    return `
    <div class="modal fade" id="tcmAllContractsModal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-xl shadow-none" role="document">
            <div class="modal-content shadow-none">
                <div class="modal-header py-2 bg-primary text-white">
                    <h5 class="modal-title" id="tcmAllContractsTitle">All Contracts</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fa fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="table-responsive">
                        <table class="table table-bordered border-radius-table font-12 mb-0">
                            <thead class="bg-primary text-white">
                                <tr>
                                    <th>Reference</th>
                                    <th>Duration</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Accepted On</th>
                                    <th class="text-center">View</th>
                                </tr>
                            </thead>
                            <tbody id="tcmAllContractsTbody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}
