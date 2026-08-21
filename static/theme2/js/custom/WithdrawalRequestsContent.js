/**
 * Withdrawal Requests Module — HTML Builder (Admin Side)
 */

/* ============================================================
   ENTRY POINT
   ============================================================ */
function renderWithdrawalRequests(title, roleAndModule) {
    try {
        // expose permissions — default to true so buttons always show when module is accessible
        wrCanUpdate = !(roleAndModule && roleAndModule.updated === 'N');
        wrCanView   = !(roleAndModule && roleAndModule.viewed  === 'N');

        $('#dashboardContentInHTML').html(getWithdrawalRequestsPageHtml(title, roleAndModule));
        loadWithdrawalRequestsStats();
        initWithdrawalRequestsTable('');
    } catch (err) {
        console.error('renderWithdrawalRequests error:', err);
    }
}

/* ============================================================
   PAGE SHELL
   ============================================================ */
function getWithdrawalRequestsPageHtml(title, roleAndModule) {
    var canAdd = !!(roleAndModule && roleAndModule.added === 'Y');

    return `
<style>
  /* ---- stat cards ---- */
  .wr-stat-card {
    padding: 16px 20px; background: #fff;
    border: 1px solid #e8eef6; box-shadow: 0 1px 4px rgba(30,58,95,.06);
    cursor: pointer; transition: box-shadow .15s, border-color .15s;
    user-select: none;
  }
  .wr-stat-card:hover   { box-shadow: 0 4px 14px rgba(30,58,95,.12); border-color: #c5d4ea; }
  .wr-stat-active       { box-shadow: 0 0 0 3px var(--pc,#007fff) !important;
                           border-color: var(--pc,#007fff) !important; }
  .wr-stat-label  { font-size: 10.5px; font-weight: 800; letter-spacing: .05em;
                    text-transform: uppercase; color: #94A3B8; margin-bottom: 6px; }
  .wr-stat-value  { font-size: 28px; font-weight: 600; line-height: 1; }
  .wr-stat-hint   { font-size: 10px; color: #94A3B8; margin-top: 4px; }

  /* ---- status badges ---- */
  .badge-wr-review    { background:#FEF3E2; color:#D97706; }
  .badge-wr-approved  { background:#E7F7ED; color:#15803D; }
  .badge-wr-denied    { background:#FDECEC; color:#DC2626; }
  .badge-wr-refund    { background:#E2F6F4; color:#0D9488; }
  .badge-wr-challenge { background:#F1EBFE; color:#7C3AED; }
  .badge-wr-pending   { background:#F0F4FF; color:#3B6FE0; }
  .badge-wr-other     { background:#F4F7FB; color:#5A6B82; }
  .badge-wr-review, .badge-wr-approved, .badge-wr-denied,
  .badge-wr-refund, .badge-wr-challenge, .badge-wr-pending, .badge-wr-other {
    border-radius: 20px; padding: 3px 10px; font-size: 11.5px; font-weight: 800;
    display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
  }
  .wr-dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex: 0 0 auto; }

  /* ---- student avatar ---- */
  .wr-stu-av {
    width: 34px; height: 34px; border-radius: 50%;
    background: #DCEAFF; color: #1667D4;
    display: grid; place-items: center;
    font-weight: 800; font-size: 13px; flex: 0 0 auto;
  }
</style>

<!-- Page header -->
<div class="app-page-title mb-3 py-2">
  <div class="page-title-wrapper">
    <div class="page-title-heading">
      <div class="page-title-icon">
        <i class="fa fa-file-text-o" style="color:var(--pc,#007fff);"></i>
      </div>
      <div>${title}
      </div>
    </div>
    <div class="page-title-actions">
      ${canAdd ? `<button class="btn btn-primary btn-sm" onclick="openWithdrawalAddModal()">
        <i class="fa fa-plus mr-1"></i> Add withdrawal request
      </button>` : ''}
    </div>
  </div>
</div>

<!-- Clickable stat cards (act as filters) -->
<div class="row mb-3">
  <div class="col-6 col-lg-2 mb-2">
    <div class="wr-stat-card wr-stat-active rounded-10" onclick="filterWithdrawalByStatCard('', this)" title="Show all requests">
      <div class="wr-stat-label">Total</div>
      <div class="wr-stat-value" style="color:var(--pc,#007fff);" id="wrStatTotal">—</div>
    </div>
  </div>
  <div class="col-6 col-lg-2 mb-2">
    <div class="wr-stat-card rounded-10" onclick="filterWithdrawalByStatCard('PENDING,INITIATED', this)" title="Filter: In Review">
      <div class="wr-stat-label">In Review</div>
      <div class="wr-stat-value text-warning" id="wrStatReview">—</div>
    </div>
  </div>
  <div class="col-6 col-lg-2 mb-2">
    <div class="wr-stat-card rounded-10" onclick="filterWithdrawalByStatCard('ACCEPTED,BANKDETAIL', this)" title="Filter: Approved">
      <div class="wr-stat-label">Approved</div>
      <div class="wr-stat-value text-success" id="wrStatApproved">—</div>
    </div>
  </div>
  <div class="col-6 col-lg-2 mb-2">
    <div class="wr-stat-card rounded-10" onclick="filterWithdrawalByStatCard('REJECTED', this)" title="Filter: Denied">
      <div class="wr-stat-label">Denied</div>
      <div class="wr-stat-value text-danger" id="wrStatDenied">—</div>
    </div>
  </div>
  <div class="col-6 col-lg-2 mb-2">
    <div class="wr-stat-card rounded-10" onclick="filterWithdrawalByStatCard('TRANSFERRED', this)" title="Filter: Refund Initiated">
      <div class="wr-stat-label">Refund Done</div>
      <div class="wr-stat-value" style="color:#0D9488;" id="wrStatRefund">—</div>
    </div>
  </div>
  <div class="col-6 col-lg-2 mb-2">
    <div class="wr-stat-card rounded-10" onclick="filterWithdrawalByStatCard('CHALLENGED', this)" title="Filter: Challenged">
      <div class="wr-stat-label">Challenged</div>
      <div class="wr-stat-value" style="color:#7C3AED;" id="wrStatChallenged">—</div>
    </div>
  </div>
</div>

<!-- Table -->
<div class="main-card mb-3 card rounded-10">
  <div class="card-body">
    <div class="table-responsive">
      <table id="withdrawalRequestsTable"
        class="table table-bordered table-striped border-radius-table font-12"
        style="width:100%; table-layout:auto;"></table>
    </div>
  </div>
</div>

${getWithdrawalStatusModalHtml()}
${getWithdrawalChallengeModalHtml()}
${getWithdrawalAddModalHtml()}
${getWithdrawalBankDetailsModalHtml()}
${getWithdrawalDetailModalHtml()}
${getWithdrawalRefundConfirmModalHtml()}
`;
}

/* ============================================================
   STATUS UPDATE MODAL — APPROVE / REJECT
   ============================================================ */
function getWithdrawalStatusModalHtml() {
    return `
<div class="modal fade" id="wrStatusModal" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-md" role="document">
    <div class="modal-content">
      <div class="modal-header py-2 bg-white border-bottom">
        <h5 class="modal-title font-weight-bold" id="wrStatusModalTitle">Approve request</h5>
        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
      </div>
      <div class="modal-body custom-field-scope">
        <input type="hidden" id="wrRequestId">
        <input type="hidden" id="wrUserId">
        <input type="hidden" id="wrStatusAction">
        <p class="text-muted font-13 mb-0" id="wrStatusModalSubtitle">WD-2032 · Rahul Verma</p>

        <div class="custom-field mt-3">
          <select class="form-control" id="wrRemarksStatus">
            <option value="">✓ Select a reason...</option>
          </select>
          <label for="wrRemarksStatus">Decision reason</label>
        </div>

        <div class="custom-field mb-0">
          <textarea class="form-control font-13" id="wrStatusDescription" rows="3"
            placeholder=" " maxlength="1000"></textarea>
          <label for="wrStatusDescription">Description / Notes</label>
        </div>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light btn-sm px-3" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm px-3" id="wrStatusSubmitBtn" onclick="submitWithdrawalStatusUpdate()">
          <span id="wrStatusBtnText">Approve & notify</span>
        </button>
      </div>
    </div>
  </div>
</div>`;
}

/* ============================================================
   CHALLENGE MODAL
   ============================================================ */
function getWithdrawalChallengeModalHtml() {
    return `
<div class="modal fade" id="wrChallengeModal" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-md" role="document">
    <div class="modal-content">
      <div class="modal-header py-2 bg-white border-bottom">
        <h5 class="modal-title font-weight-bold">Mark as Challenged</h5>
        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
      </div>
      <div class="modal-body custom-field-scope">
        <input type="hidden" id="wrChallengeRequestId">
        <input type="hidden" id="wrChallengeUserId">
        <p class="text-muted font-13 mb-0">WD-2026 · Wai Jie Lim</p>

        <div class="custom-field mt-3">
          <select class="form-control" id="wrChallengeCourt">
            <option value="">✓ Select court...</option>
            <option value="United States court">United States court</option>
            <option value="Singapore court">Singapore court</option>
          </select>
          <label for="wrChallengeCourt">Select court</label>
        </div>

        <div class="custom-field mb-0">
          <textarea class="form-control font-13" id="wrChallengeRemarks" rows="3"
            placeholder=" " maxlength="1000"></textarea>
          <label for="wrChallengeRemarks">Remarks</label>
        </div>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light btn-sm px-3" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-sm px-3 text-white" style="background:#7C3AED;"
          onclick="submitWithdrawalChallenge()">
          Mark as Challenged
        </button>
      </div>
    </div>
  </div>
</div>`;
}

/* ============================================================
   ADD REQUEST MODAL
   ============================================================ */
function getWithdrawalAddModalHtml() {
    return `
<div class="modal fade" id="wrAddModal" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header py-2 bg-primary text-white">
        <h5 class="modal-title"><i class="fa fa-plus mr-2"></i>Add Withdrawal Request</h5>
        <button type="button" class="close text-white" data-dismiss="modal"><span>&times;</span></button>
      </div>
      <div class="modal-body custom-field-scope">
        <p class="text-muted font-12 mb-3">
          Create a withdrawal request on behalf of a student. It will be added with status <strong>Pending</strong>.
        </p>
        <div class="row">
          <div class="col-md-8">
            <div class="position-relative custom-field p-0" style="padding-right:100px !important;">
              <input type="text" class="form-control" id="wrAddStudentId"
                placeholder=" "
                oninput="this.value=this.value.toUpperCase()">
              <label for="wrAddStudentId">Student ID <span class="text-danger">*</span></label>
              <button class="btn btn-outline-primary btn-sm position-absolute" type="button"
                style="right:8px; top:50%; transform:translateY(-50%); z-index:6;"
                onclick="lookupWithdrawalStudent()">
                <i class="fa fa-search"></i> Search
              </button>
            </div>
            <small class="text-muted d-block mt-1">e.g. INDMHMU250915042</small>
          </div>
        </div>

        <div id="wrAddStudentInfo" class="mb-3"></div>

        <div class="row">
          <div class="col-md-8">
            <div class="custom-field">
              <select class="form-control" id="wrAddReason" onchange="validateWithdrawalAddForm()">
                <option value="">— Select a reason —</option>
              </select>
              <label for="wrAddReason">Primary Reason <span class="text-danger">*</span></label>
            </div>
          </div>
        </div>

        <div class="custom-field mb-0">
          <textarea class="form-control" id="wrAddDescription" rows="3"
            placeholder=" "
            maxlength="1000" oninput="validateWithdrawalAddForm()"></textarea>
          <label for="wrAddDescription">Details / Notes <span class="text-danger">*</span></label>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-primary btn-sm" id="wrAddSubmitBtn" disabled
          onclick="submitWithdrawalAdminAdd()">
          <i class="fa fa-plus mr-1"></i>Add Request
        </button>
      </div>
    </div>
  </div>
</div>`;
}

/* ============================================================
   ADD BANK DETAILS MODAL
   ============================================================ */
function getWithdrawalBankDetailsModalHtml() {
    return `
<div class="modal fade" id="wrBankModal" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header py-2 bg-white border-bottom">
        <div>
          <h5 class="modal-title font-weight-bold mb-0">Add bank details</h5>
          <p class="text-white font-12 mb-0" id="wrBankModalSubtitle">For Rahul Verma · WD-2034</p>
        </div>
        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
      </div>
      <div class="modal-body custom-field-scope">
        <input type="hidden" id="wrBankRequestId">

        <div class="row">
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankAccountHolder" placeholder=" " maxlength="200">
              <label for="wrBankAccountHolder">Account holder name <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankHolderAddress" placeholder=" " maxlength="300">
              <label for="wrBankHolderAddress">Account holder address <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankPostalCode" placeholder=" " maxlength="20">
              <label for="wrBankPostalCode">Postal code <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankPhone" placeholder=" " maxlength="20">
              <label for="wrBankPhone">Phone number <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankAccountNo" placeholder=" " maxlength="50">
              <label for="wrBankAccountNo">Account number <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankName" placeholder=" " maxlength="200">
              <label for="wrBankName">Bank name <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankBranchAddress" placeholder=" " maxlength="300">
              <label for="wrBankBranchAddress">Bank branch address <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-6">
            <div class="custom-field">
              <input type="text" class="form-control form-control-sm" id="wrBankSwiftCode" placeholder=" " maxlength="20">
              <label for="wrBankSwiftCode">Bank SWIFT code <span class="text-danger">*</span></label>
            </div>
          </div>
          <div class="col-md-12">
            <div class="custom-field mb-0">
              <input type="text" class="form-control form-control-sm" id="wrBankRoutingNo" placeholder=" " maxlength="50">
              <label for="wrBankRoutingNo">ABA / routing number (if applicable)</label>
            </div>
          </div>
        </div>

        <div class="alert alert-info py-2 px-3 font-12 mt-3 mb-0">
          <i class="fa fa-info-circle mr-1"></i>
          Double-check these details — incorrect information can delay or fail the refund.
        </div>
      </div>
      <div class="modal-footer border-0 pt-0">
        <button type="button" class="btn btn-light btn-sm px-3" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-success btn-sm px-3" id="wrBankSubmitBtn" onclick="submitBankDetails()">
          Save bank details
        </button>
      </div>
    </div>
  </div>
</div>`;
}

/* ============================================================
   VIEW DETAIL MODAL
   ============================================================ */
function getWithdrawalDetailModalHtml() {
    return `
<div class="modal fade" id="wrDetailModal" tabindex="-1" role="dialog">
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header py-2 bg-white border-bottom">
        <h5 class="modal-title font-weight-bold">Request detail</h5>
        <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>
      </div>
      <div class="modal-body" style="max-height:75vh; overflow-y:auto;">
        <div class="text-center p-4"><i class="fa fa-spinner fa-spin fa-2x"></i></div>
      </div>
      <div class="modal-footer border-0">
        <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`;
}

/* ============================================================
   REFUND CONFIRMATION MODAL
   ============================================================ */
function getWithdrawalRefundConfirmModalHtml() {
    return `
<div class="modal fade" id="wrRefundConfirmModal" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog modal-dialog-centered modal-md" role="document">
    <div class="modal-content">
      <div class="modal-body text-center p-4">
        <input type="hidden" id="wrRefundRequestId">
        <input type="hidden" id="wrRefundUserId">
        <div class="mb-3">
          <i class="fa fa-warning" style="font-size:48px;color:#FFA500;"></i>
        </div>
        <h5 class="font-weight-bold mb-2">Please confirm</h5>
        <p class="text-warning font-12 mb-0">
          <i class="fa fa-warning mr-1"></i>
          The student's dashboard will be withdrawn
        </p>
        <p class="text-muted font-12 mt-2">
          Confirming this refund will: deactivate the student's account, and 
          withdraw their dashboard access to all enrolled platforms. This cannot be undone. Continue?
        </p>
      </div>
      <div class="modal-footer border-0 pt-0 justify-content-center">
        <button type="button" class="btn btn-light btn-sm px-4" data-dismiss="modal">Cancel</button>
        <button type="button" class="btn btn-danger btn-sm px-4" onclick="confirmWithdrawalRefund()">
          Yes, initiate refund
        </button>
      </div>
    </div>
  </div>
</div>`;
}

/* ============================================================
   DETAIL MODAL BODY
   ============================================================ */
function buildWithdrawalDetailHtml(detail, comments, requestId) {
    if (!detail) return '<div class="alert alert-warning">No details available.</div>';

    console.log('buildWithdrawalDetailHtml :: comments=', comments); // DEBUG

    // Request header with status
    var statusBadge = wrStatusBadge(detail.status);
    var refNo = detail.referenceNo || ('WD-' + detail.requestId);
    var headerHtml = `
<div class="mb-3 pb-2 border-bottom">
  <p class="text-muted font-12 mb-1">${escapeHtml(refNo)} · ${statusBadge}</p>
</div>`;

    // STUDENT section
    var studentHtml = `
<div class="mb-4 custom-field-scope">
  <h6 class="text-primary font-weight-bold font-13 mb-3" style="letter-spacing:0.3px;">
    <i class="fa fa-user mr-1"></i> STUDENT
  </h6>
  <div class="row">
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.studentName || '')}" readonly>
        <label>Name</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.studentStringId || '')}" readonly>
        <label>Student ID</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.standardName || '')}" readonly>
        <label>Grade</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.programName || '')}" readonly>
        <label>Program</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.email || '')}" readonly>
        <label>Email</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field mb-0">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.createdDate || '')}" readonly>
        <label>Submitted</label>
      </div>
    </div>
  </div>
</div>`;

    // REASON section
    var reasonHtml = `
<div class="mb-4 custom-field-scope">
  <h6 class="text-primary font-weight-bold font-13 mb-3" style="letter-spacing:0.3px;">
    <i class="fa fa-file-text-o mr-1"></i> REASON
  </h6>
  <div class="row">
    <div class="col-md-12">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.reason || '')}" readonly>
        <label>Primary reason</label>
      </div>
    </div>
    <div class="col-md-12">
      <div class="custom-field mb-0">
        <textarea class="form-control form-control-sm" rows="3" placeholder=" " readonly>${escapeHtml(detail.remarks || detail.otherReason || 'No description provided.')}</textarea>
        <label>Student's description</label>
      </div>
    </div>
  </div>
</div>`;

    // BANK DETAILS section (show if status is BANKDETAIL, TRANSFERRED, or bank details exist)
    var status = (detail.status || '').toUpperCase();
    var hasBankDetails = detail.accountHolder || detail.accountNo || detail.bankName;
    var bankDetailsHtml = '';
    
    if (hasBankDetails && (status === 'BANKDETAIL' || status === 'TRANSFERRED')) {
        bankDetailsHtml = `
<div class="mb-4 custom-field-scope">
  <h6 class="text-primary font-weight-bold font-13 mb-3" style="letter-spacing:0.3px;">
    <i class="fa fa-university mr-1"></i> BANK DETAILS ON FILE
  </h6>
  <div class="row">
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.accountHolder || '')}" readonly>
        <label>Account holder</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.benStreetAddress || '')}" readonly>
        <label>Address</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.benPostal || '')}" readonly>
        <label>Postal code</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.benPhone || '')}" readonly>
        <label>Phone</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.accountNo || '')}" readonly>
        <label>Account number</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.bankName || '')}" readonly>
        <label>Bank name</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.bankBranchAddress || '')}" readonly>
        <label>Branch</label>
      </div>
    </div>
    <div class="col-md-6">
      <div class="custom-field">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.swiftCode || '')}" readonly>
        <label>SWIFT</label>
      </div>
    </div>
    <div class="col-md-12">
      <div class="custom-field mb-0">
        <input type="text" class="form-control form-control-sm" placeholder=" " value="${escapeHtml(detail.routeNo || 'N/A')}" readonly>
        <label>ABA/Routing</label>
      </div>
    </div>
  </div>
</div>`;
    }

    // COMMUNICATION LOG section
    var commentsHtml = '';
    if (comments && comments.length > 0) {
        console.log('Building comments HTML, count=', comments.length); // DEBUG
        commentsHtml = comments.map(function (c) {
            // Render HTML content from CKEditor (allow HTML tags)
            // Comments from student profile may contain HTML (CKEditor)
            // Comments from withdrawal modal are plain text
            // Trust: Only admins can add comments, so XSS risk is low
            var commentText = c.comments || '';
            
            // Add CSS class for proper CKEditor content styling
            return `<div class="d-flex border-bottom py-2 px-3 font-12">
  <div class="flex-grow-1">
    <div class="font-weight-bold text-primary">${escapeHtml(c.addedByName || 'System')}</div>
    <div class="text-secondary mt-1 wr-comment-content" style="word-break:break-word;max-width:100%;">${commentText}</div>
  </div>
  <div class="text-muted text-right pl-3" style="min-width:140px;font-size:11px;">${escapeHtml(c.createdAt || '')}</div>
</div>`;
        }).join('');
    } else {
        console.log('No comments to display'); // DEBUG
        commentsHtml = '<p class="text-muted font-12 mb-0">No comments yet.</p>';
    }

    var communicationHtml = `
<div class="mb-3">
  <h6 class="text-primary font-weight-bold font-13 mb-3" style="letter-spacing:0.3px;">
    <i class="fa fa-comments mr-1"></i> COMMUNICATION LOG
  </h6>
  <div class="border rounded" style="max-height:200px;overflow-y:auto;">
    ${commentsHtml}
  </div>
</div>`;

    // Add remark section
    var addRemarkHtml = `
<div class="custom-field-scope">
  <div class="custom-field mb-2">
    <textarea class="form-control form-control-sm font-12" id="wrCommentInput_${requestId}" rows="2"
      placeholder=" " maxlength="500"></textarea>
    <label for="wrCommentInput_${requestId}">Add a remark</label>
  </div>
  <button class="btn btn-primary btn-sm px-3" onclick="submitWithdrawalComment(${requestId})">
    Add remark
  </button>
</div>`;

    return headerHtml + studentHtml + reasonHtml + bankDetailsHtml + communicationHtml + addRemarkHtml;
}

/* ============================================================
   ACTION CELL BUILDER  (called by DataTable render function)
   ============================================================ */
function buildWithdrawalActionCell(row, canUpdate, canView) {
    var status    = (row.status || '').toUpperCase();
    var requestId = row.requestId;
    var userId    = row.userId;
    var studentInfo = escapeHtml(row.studentName || '');
    var actions   = '';

    // View button — always if viewer
    if (canView) {
        actions += `<button class="btn btn-outline-secondary btn-sm mr-1 mb-1"
          onclick="viewWithdrawalDetail(${requestId})">
          <i class="fa fa-eye"></i> View
        </button>`;
    }

    if (canUpdate) {
        // Allow approve/reject for PENDING, INITIATED, and CHALLENGED statuses
        if (status === 'PENDING' || status === 'INITIATED' || status === 'CHALLENGED') {
            actions += `<button class="btn btn-success btn-sm mr-1 mb-1"
              onclick="openWithdrawalStatusModal(${requestId},${userId},'approve','${studentInfo}')">
              <i class="fa fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-sm mr-1 mb-1"
              onclick="openWithdrawalStatusModal(${requestId},${userId},'reject','${studentInfo}')">
              <i class="fa fa-times"></i> Reject
            </button>`;
        }
        if (status === 'ACCEPTED') {
            actions += `<button class="btn btn-success btn-sm mr-1 mb-1"
              onclick="openBankDetailsModal(${requestId},'${studentInfo}')">
              <i class="fa fa-university mr-1"></i>Add bank details
            </button>`;
        }
        if (status === 'BANKDETAIL') {
            actions += `<button class="btn btn-primary btn-sm mr-1 mb-1"
              onclick="markWithdrawalRefundInitiated(${requestId},${userId})">
              <i class="fa fa-money mr-1"></i>Mark refund initiated
            </button>`;
        }
        if (status === 'REJECTED') {
            actions += `<button class="btn btn-sm mb-1 text-white" style="background:#7C3AED;"
              onclick="markWithdrawalChallenged(${requestId},${userId})">
              <i class="fa fa-gavel mr-1"></i>Mark as Challenged
            </button>`;
        }
    }

    if (!actions) actions = '<span class="text-muted font-12">—</span>';
    return '<div class="d-flex flex-wrap" style="gap:3px;">' + actions + '</div>';
}

/* ============================================================
   STATUS BADGE
   ============================================================ */
function wrStatusBadge(status) {
    var s   = (status || '').toUpperCase();
    var map = {
        'PENDING'    : ['badge-wr-pending',   '#3B6FE0', 'In Review', ''],
        'INITIATED'  : ['badge-wr-pending',   '#3B6FE0', 'Initiated', ''],
        'ACCEPTED'   : ['badge-wr-approved',  '#16A34A', 'Approved', ''],
        'REJECTED'   : ['badge-wr-denied',    '#EF4444', 'Denied', ''],
        'BANKDETAIL' : ['badge-wr-approved',  '#16A34A', 'Approved', 'awaiting bank details'],
        'TRANSFERRED': ['badge-wr-refund',    '#0D9488', 'Refund Initiated', ''],
        'CHALLENGED' : ['badge-wr-challenge', '#7C3AED', 'Challenged', ''],
        'CANCELLED'  : ['badge-wr-other',     '#94A3B8', 'Cancelled', '']
    };
    var m = map[s] || ['badge-wr-other', '#94A3B8', status || '—', ''];
    
    var badge = '<span class="' + m[0] + '"><span class="wr-dot" style="background:' + m[1] + ';"></span>' + m[2] + '</span>';
    
    // Add subtitle if present
    if (m[3]) {
        badge += '<div class="text-muted" style="font-size:10px;margin-top:2px;">' + m[3] + '</div>';
    }
    
    return badge;
}

/* ============================================================
   STUDENT CELL
   ============================================================ */
function buildWithdrawalStudentCell(row) {
    var initials = wrInitials(row.studentName);
    return '<div class="d-flex align-items-center" style="gap:8px;">' +
           '<div class="wr-stu-av">' + escapeHtml(initials) + '</div>' +
           '<div>' +
           '<div class="font-weight-bold">' + escapeHtml(row.studentName || '') + '</div>' +
           '<div class="text-muted" style="font-size:11px;">' + escapeHtml(row.studentStringId || '') + '</div>' +
           '</div></div>';
}

/* ============================================================
   SMALL UTILITIES
   ============================================================ */
function wrDetailField(label, value) {
    return '<div class="col-md-4 mb-2">' +
           '<div class="text-muted" style="font-size:10.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;">' + escapeHtml(label) + '</div>' +
           '<div style="font-size:13px;">' + (value != null && value !== '' ? value : '—') + '</div>' +
           '</div>';
}

function wrInitials(name) {
    if (!name) return '?';
    return name.split(' ').filter(function (w) { return w.length > 0; })
        .slice(0, 2).map(function (w) { return w[0].toUpperCase(); }).join('');
}
