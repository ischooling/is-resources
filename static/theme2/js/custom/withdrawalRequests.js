/**
 * Withdrawal Requests Module — API Calls & Business Logic (Admin Side)
 */

/* ------------------------------------------------------------------ base */
function wrBaseUrl() {
    return CONTEXT_PATH + SCHOOL_UUID + '/dashboard/';
}

/* ------------------------------------------------------------------ list */
var withdrawalReqTable   = null;
var wrCanUpdate          = false;
var wrCanView            = false;
var wrActiveStatusFilter = '';

function initWithdrawalRequestsTable(statusFilter) {
    if(!getSession()){
		redirectLoginPage();
		return;
	}
    wrActiveStatusFilter = statusFilter || '';

    if ($.fn.DataTable.isDataTable('#withdrawalRequestsTable')) {
        $('#withdrawalRequestsTable').DataTable().destroy();
        withdrawalReqTable = null;
    }

    withdrawalReqTable = $('#withdrawalRequestsTable').DataTable({
        processing : true,
        serverSide : false,
        searching  : true,
        ordering   : true,
        autoWidth  : false,
        scrollX    : false,
        pageLength : 25,
        lengthMenu : [10, 25, 50, 100],
        ajax: function(data, callback, settings) {
            callCommonAjax({
                method: 'POST',
                url: wrBaseUrl() + 'withdrawal-requests-list',
                body: { statusFilter: wrActiveStatusFilter },
                showMessage: false,
                global: false
            }).then(function(json) {
                if (json && json.status === '3') {
                    redirectLoginPage();
                    callback({ data: [] });
                    return;
                }
                callback({ data: json.data || [] });
            }).catch(function() {
                showMessageTheme2(0, 'Failed to load withdrawal requests.', '', true);
                callback({ data: [] });
            });
        },
        columns: [
            { data: 'sNo',         title: 'S.No',    width: '45px' },
            {
                data: null, title: 'Student', orderable: false,
                render: function (data) { return buildWithdrawalStudentCell(data); }
            },
            {
                data: null, title: 'Request', width: '120px',
                render: function (data) {
                    var refNo = data.referenceNo || ('WD-' + data.requestId);
                    return '<span class="font-weight-bold">' + escapeHtml(refNo) + '</span>' +
                           '<div class="text-muted" style="font-size:11px;">' + escapeHtml(data.createdDate || '') + '</div>';
                }
            },
            { data: 'standardName', title: 'Grade',   width: '90px'  },
            { data: 'programName',  title: 'Program',  width: '130px' },
            { data: 'reason',       title: 'Reason',   orderable: false },
            {
                data: null, title: 'Status', width: '140px', orderable: false,
                render: function (data) { return wrStatusBadge(data.status); }
            },
            {
                data: null, title: 'Action', width: '240px', orderable: false,
                render: function (data) {
                    return buildWithdrawalActionCell(data, wrCanUpdate, wrCanView);
                }
            }
        ],
        columnDefs: [
            { targets: '_all', createdCell: function (td) {
                $(td).css('vertical-align', 'middle');
            }}
        ],
        language: { emptyTable: 'No withdrawal requests found.' },
        drawCallback: function () {
            $('[data-toggle="tooltip"]').tooltip();
            // Apply blue background to table header
            $('#withdrawalRequestsTable thead').addClass('bg-primary text-white');
        }
    });
}

/* ----------------------------------------------------------------- stats */
function loadWithdrawalRequestsStats() {
    if(!getSession()){
        redirectLoginPage();
        return;
	}
    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-stats',
        body: {},
        showMessage: false,
        global: false
    }).then(function(res) {
        if (res && res.status === '1') {
            var s = res.stats || {};
            $('#wrStatReview').text(s.inReview != null ? s.inReview : 0);
            $('#wrStatApproved').text(s.approved != null ? s.approved : 0);
            $('#wrStatDenied').text(s.denied != null ? s.denied : 0);
            $('#wrStatRefund').text(s.refundInitiated != null ? s.refundInitiated : 0);
            $('#wrStatChallenged').text(s.challenged != null ? s.challenged : 0);
            $('#wrStatTotal').text(s.total != null ? s.total : 0);
        }
    }).catch(function(err) {
        console.error('Failed to load withdrawal stats', err);
    });
}

/* -------------------------------------------------------- stat card filter */
function filterWithdrawalByStatCard(statusFilter, el) {
    if(!getSession()){
		redirectLoginPage();
		return;
	}
    // highlight active card
    $('.wr-stat-card').removeClass('wr-stat-active');
    if (el) { $(el).closest('.wr-stat-card').addClass('wr-stat-active'); }

    wrActiveStatusFilter = statusFilter || '';
    if (withdrawalReqTable) {
        // Reload DataTable with new filter
        withdrawalReqTable.ajax.reload(null, false);
    }
}

/* -------------------------------------------------------- status update */
function openWithdrawalStatusModal(requestId, userId, action, studentInfo) {
    $('#wrRequestId').val(requestId);
    $('#wrUserId').val(userId);
    $('#wrStatusAction').val(action);
    
    // Update modal title and subtitle based on action
    if (action === 'approve') {
        $('#wrStatusModalTitle').text('Approve request');
        $('#wrStatusBtnText').text('Approve & notify');
        $('#wrStatusSubmitBtn').removeClass('btn-danger').addClass('btn-primary');
        loadDecisionReasons('APPROVE');
    } else if (action === 'reject') {
        $('#wrStatusModalTitle').text('Reject request');
        $('#wrStatusBtnText').text('Reject & notify');
        $('#wrStatusSubmitBtn').removeClass('btn-primary').addClass('btn-danger');
        loadDecisionReasons('REJECT');
    }
    
    // Update subtitle with student info if available
    var subtitle = 'WD-' + requestId;
    if (studentInfo) {
        subtitle += ' · ' + studentInfo;
    }
    $('#wrStatusModalSubtitle').text(subtitle);
    
    $('#wrRemarksStatus').val('');
    $('#wrStatusDescription').val('');
    $('#wrStatusSubmitBtn').prop('disabled', false);
    $('#wrStatusModal').modal('show');
}

function loadDecisionReasons(type) {
    $('#wrRemarksStatus').html('<option value="">Loading reasons...</option>');
    
    // Map action to RELATED_TO type in database
    var relatedTo = type === 'APPROVE' ? 'WITHDRAW_APPROVE' : 'WITHDRAW_DENY';
    
    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-reasons',
        body: { type: relatedTo },
        showMessage: false,
        global: false
    }).then(function(res) {
        if (res && res.status === '1' && res.data && res.data.length > 0) {
            var opts = '<option value="">✓ Select a reason...</option>';
            res.data.forEach(function(r) {
                opts += '<option value="' + r.id + '">' + escapeHtml(r.reason) + '</option>';
            });
            $('#wrRemarksStatus').html(opts);
        } else {
            $('#wrRemarksStatus').html('<option value="">No reasons available</option>');
        }
    }).catch(function() {
        $('#wrRemarksStatus').html('<option value="">Failed to load reasons</option>');
    });
}

function submitWithdrawalStatusUpdate() {
    var requestId   = $('#wrRequestId').val();
    var userId      = $('#wrUserId').val();
    var reasonId    = $('#wrRemarksStatus').val();
    var description = $.trim($('#wrStatusDescription').val());
    var action      = $('#wrStatusAction').val();

    if (!reasonId) {
        showMessageTheme2(0, 'Please select a decision reason.', '', true);
        return;
    }

    var status = action === 'approve' ? 'ACCEPTED' : 'REJECTED';
    
    $('#wrStatusSubmitBtn').prop('disabled', true);

    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-status',
        body: {
            requestId: parseInt(requestId),
            userId: parseInt(userId),
            status: status,
            reasonId: parseInt(reasonId),
            remarks: description
        },
        showMessage: false,
        global: false
    }).then(function(res) {
        $('#wrStatusSubmitBtn').prop('disabled', false);
        if (res && res.status === '1') {
            showMessageTheme2(1, res.message || 'Status updated successfully.', '', true);
            $('#wrStatusModal').modal('hide');
            loadWithdrawalRequestsStats();
            if (withdrawalReqTable) { withdrawalReqTable.ajax.reload(null, false); }
        } else {
            showMessageTheme2(0, res.message || 'Failed to update status.', '', true);
        }
    }).catch(function() {
        $('#wrStatusSubmitBtn').prop('disabled', false);
        showMessageTheme2(0, 'An error occurred.', '', true);
    });
}

/* --------------------------------------------------------- mark refund */
function markWithdrawalRefundInitiated(requestId, userId) {
    $('#wrRefundRequestId').val(requestId);
    $('#wrRefundUserId').val(userId);
    $('#wrRefundConfirmModal').modal('show');
}

function confirmWithdrawalRefund() {
    var requestId = $('#wrRefundRequestId').val();
    var userId    = $('#wrRefundUserId').val();
    
    $('#wrRefundConfirmModal').modal('hide');
    
    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-status',
        body: {
            requestId: parseInt(requestId),
            userId: parseInt(userId),
            status: 'TRANSFERRED',
            remarks: 'Refund initiated by administration.'
        },
        showMessage: false,
        global: false
    }).then(function(res) {
        if (res && res.status === '1') {
            showMessageTheme2(1, 'Refund marked as initiated.', '', true);
            loadWithdrawalRequestsStats();
            if (withdrawalReqTable) { withdrawalReqTable.ajax.reload(null, false); }
        } else {
            showMessageTheme2(0, res.message || 'Failed.', '', true);
        }
    }).catch(function() {
        showMessageTheme2(0, 'An error occurred.', '', true);
    });
}

/* -------------------------------------------------------- mark challenged */
function markWithdrawalChallenged(requestId, userId) {
    $('#wrChallengeRequestId').val(requestId);
    $('#wrChallengeUserId').val(userId);
    $('#wrChallengeCourt').val('');
    $('#wrChallengeModal').modal('show');
}

function submitWithdrawalChallenge() {
    var requestId = $('#wrChallengeRequestId').val();
    var userId    = $('#wrChallengeUserId').val();
    var court     = $('#wrChallengeCourt').val();
    var remarks   = $.trim($('#wrChallengeRemarks').val());
    
    if (!court) { 
        showMessageTheme2(0, 'Please select a court.', '', true); 
        return; 
    }

    var fullRemarks = 'Challenged in: ' + court;
    if (remarks) {
        fullRemarks += '. ' + remarks;
    }

    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-status',
        body: {
            requestId: parseInt(requestId),
            userId: parseInt(userId),
            status: 'CHALLENGED',
            remarks: fullRemarks
        },
        showMessage: false,
        global: false
    }).then(function(res) {
        if (res && res.status === '1') {
            showMessageTheme2(1, 'Request marked as Challenged.', '', true);
            $('#wrChallengeModal').modal('hide');
            loadWithdrawalRequestsStats();
            if (withdrawalReqTable) { withdrawalReqTable.ajax.reload(null, false); }
        } else {
            showMessageTheme2(0, res.message || 'Failed.', '', true);
        }
    }).catch(function() {
        showMessageTheme2(0, 'An error occurred.', '', true);
    });
}

/* -------------------------------------------------- admin add request */
function openWithdrawalAddModal() {
    $('#wrAddStudentId').val('');
    $('#wrAddStudentInfo').html('').removeData('userId');
    $('#wrAddReason').val('');
    $('#wrAddDescription').val('');
    $('#wrAddSubmitBtn').prop('disabled', true);
    
    // Load reasons dropdown via API
    loadWithdrawalReasons();
    
    $('#wrAddModal').modal('show');
}

function loadWithdrawalReasons() {
    $('#wrAddReason').html('<option value="">Loading reasons...</option>');
    
    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-reasons',
        body: { type: 'WITHDRAW' },
        showMessage: false,
        global: false
    }).then(function(res) {
        if (res && res.status === '1' && res.data) {
            var opts = '<option value="">— Select a reason —</option>';
            res.data.forEach(function(r) {
                opts += '<option value="' + r.id + '">' + escapeHtml(r.reason) + '</option>';
            });
            $('#wrAddReason').html(opts);
        } else {
            $('#wrAddReason').html('<option value="">Failed to load reasons</option>');
        }
    }).catch(function() {
        $('#wrAddReason').html('<option value="">Failed to load reasons</option>');
    });
}

function lookupWithdrawalStudent() {
    var sid = $.trim($('#wrAddStudentId').val()).toUpperCase();
    $('#wrAddStudentInfo').removeData('userId');
    $('#wrAddSubmitBtn').prop('disabled', true);

    if (!sid) {
        $('#wrAddStudentInfo').html('');
        return;
    }

    $('#wrAddStudentInfo').html('<small class="text-muted"><i class="fa fa-spinner fa-spin"></i> Looking up…</small>');

    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-student-lookup',
        body: { studentId: sid },
        showMessage: false,
        global: false
    }).then(function(res) {
        if (res && res.status === '1' && res.student) {
            var s = res.student;
            $('#wrAddStudentInfo').html(
                '<div class="row mt-2 mb-1">' +
                '<div class="col-md-4 mb-2"><small class="text-muted d-block font-weight-bold">Full Name</small>' +
                '<span>' + escapeHtml(s.studentName || '—') + '</span></div>' +
                '<div class="col-md-4 mb-2"><small class="text-muted d-block font-weight-bold">Grade</small>' +
                '<span>' + escapeHtml(s.standardName || '—') + '</span></div>' +
                '<div class="col-md-4 mb-2"><small class="text-muted d-block font-weight-bold">Program</small>' +
                '<span>' + escapeHtml(s.programName || '—') + '</span></div>' +
                '</div>'
            );
            $('#wrAddStudentInfo').data('userId', s.userId);
            $('#wrAddStudentInfo').data('cityId', s.cityId || 0);
            validateWithdrawalAddForm();
        } else {
            $('#wrAddStudentInfo').html('<div class="alert alert-warning py-2 font-12 mt-2">No student found with ID <strong>' + escapeHtml(sid) + '</strong>.</div>');
        }
    }).catch(function() {
        $('#wrAddStudentInfo').html('<small class="text-danger">Lookup failed. Please try again.</small>');
    });
}

function validateWithdrawalAddForm() {
    var userId = $('#wrAddStudentInfo').data('userId');
    var reason = $('#wrAddReason').val();
    var desc   = $.trim($('#wrAddDescription').val());
    $('#wrAddSubmitBtn').prop('disabled', !(userId && reason && desc));
}

function submitWithdrawalAdminAdd() {
    var userId = $('#wrAddStudentInfo').data('userId');
    var cityId = $('#wrAddStudentInfo').data('cityId') || 0;
    var reason = $('#wrAddReason').val();
    var desc   = $.trim($('#wrAddDescription').val());

    if (!userId || !reason || !desc) {
        showMessageTheme2(0, 'Please fill all required fields.', '', true);
        return;
    }

    $('#wrAddSubmitBtn').prop('disabled', true).html('<i class="fa fa-spinner fa-spin mr-1"></i>Saving…');

    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-add',
        body: {
            userId: parseInt(userId),
            cityId: parseInt(cityId),
            reasonId: parseInt(reason),
            otherReason: desc
        },
        showMessage: false,
        global: false
    }).then(function(res) {
        $('#wrAddSubmitBtn').prop('disabled', false).html('<i class="fa fa-plus mr-1"></i>Add Request');
        if (res && res.status === '1') {
            showMessageTheme2(1, res.message || 'Request added successfully.', '', true);
            $('#wrAddModal').modal('hide');
            loadWithdrawalRequestsStats();
            if (withdrawalReqTable) { withdrawalReqTable.ajax.reload(null, false); }
        } else {
            showMessageTheme2(0, res.message || 'Failed to add request.', '', true);
        }
    }).catch(function() {
        $('#wrAddSubmitBtn').prop('disabled', false).html('<i class="fa fa-plus mr-1"></i>Add Request');
        showMessageTheme2(0, 'An error occurred.', '', true);
    });
}

/* --------------------------------------------------- view detail / comments */
function openBankDetailsModal(requestId, studentInfo) {
    $('#wrBankRequestId').val(requestId);
    $('#wrBankModalSubtitle').text('For ' + studentInfo + ' · WD-' + requestId);
    
    // Reset fields
    $('#wrBankAccountHolder, #wrBankHolderAddress, #wrBankPostalCode, #wrBankPhone, #wrBankAccountNo, #wrBankName, #wrBankBranchAddress, #wrBankSwiftCode, #wrBankRoutingNo').val('');
    
    $('#wrBankModal').modal('show');
}

function submitBankDetails() {
    var requestId      = $('#wrBankRequestId').val();
    var accountHolder  = $.trim($('#wrBankAccountHolder').val());
    var holderAddress  = $.trim($('#wrBankHolderAddress').val());
    var postalCode     = $.trim($('#wrBankPostalCode').val());
    var phone          = $.trim($('#wrBankPhone').val());
    var accountNo      = $.trim($('#wrBankAccountNo').val());
    var bankName       = $.trim($('#wrBankName').val());
    var branchAddress  = $.trim($('#wrBankBranchAddress').val());
    var swiftCode      = $.trim($('#wrBankSwiftCode').val());
    var routingNo      = $.trim($('#wrBankRoutingNo').val());
    
    if (!accountHolder || !holderAddress || !postalCode || !phone || !accountNo || !bankName || !branchAddress || !swiftCode) {
        showMessageTheme2(0, 'Please fill all required fields.', '', true);
        return;
    }
    
    $('#wrBankSubmitBtn').prop('disabled', true).text('Saving...');
    
    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-bank-details',
        body: {
            requestId: parseInt(requestId),
            accountHolder: accountHolder,
            holderAddress: holderAddress,
            postalCode: postalCode,
            phone: phone,
            accountNo: accountNo,
            bankName: bankName,
            branchAddress: branchAddress,
            swiftCode: swiftCode,
            routingNo: routingNo
        },
        showMessage: false,
        global: false
    }).then(function(res) {
        $('#wrBankSubmitBtn').prop('disabled', false).text('Save bank details');
        if (res && res.status === '1') {
            showMessageTheme2(1, 'Bank details saved successfully.', '', true);
            $('#wrBankModal').modal('hide');
            loadWithdrawalRequestsStats();
            if (withdrawalReqTable) { withdrawalReqTable.ajax.reload(null, false); }
        } else {
            showMessageTheme2(0, res.message || 'Failed to save bank details.', '', true);
        }
    }).catch(function() {
        $('#wrBankSubmitBtn').prop('disabled', false).text('Save bank details');
        showMessageTheme2(0, 'An error occurred.', '', true);
    });
}

function viewWithdrawalDetail(requestId) {
    $('#wrDetailModal .modal-body').html('<div class="text-center p-4"><i class="fa fa-spinner fa-spin fa-2x"></i></div>');
    $('#wrDetailModal').modal('show');

    console.log('viewWithdrawalDetail :: requestId=', requestId); // DEBUG

    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-comments',
        body: { requestId: parseInt(requestId) },
        showMessage: false,
        global: false
    }).then(function(res) {
        console.log('viewWithdrawalDetail :: response=', res); // DEBUG
        if (res && res.status === '1') {
            $('#wrDetailModal .modal-body').html(buildWithdrawalDetailHtml(res.detail, res.comments, requestId));
        } else {
            $('#wrDetailModal .modal-body').html('<div class="alert alert-danger">Failed to load details.</div>');
        }
    }).catch(function(err) {
        console.error('viewWithdrawalDetail :: error=', err); // DEBUG
        $('#wrDetailModal .modal-body').html('<div class="alert alert-danger">An error occurred.</div>');
    });
}

function submitWithdrawalComment(requestId) {
    var comment = $.trim($('#wrCommentInput_' + requestId).val());
    if (!comment) { showMessageTheme2(0, 'Please enter a comment.', '', true); return; }

    console.log('submitWithdrawalComment :: requestId=', requestId, 'comment=', comment); // DEBUG

    callCommonAjax({
        method: 'POST',
        url: wrBaseUrl() + 'withdrawal-requests-comment',
        body: {
            requestId: parseInt(requestId),
            comment: comment
        },
        showMessage: false,
        global: false
    }).then(function(res) {
        console.log('submitWithdrawalComment :: response=', res); // DEBUG
        if (res && res.status === '1') {
            showMessageTheme2(1, 'Comment added.', '', true);
            // Clear input field
            $('#wrCommentInput_' + requestId).val('');
            // Reload modal detail
            viewWithdrawalDetail(requestId);
        } else {
            showMessageTheme2(0, res.message || 'Failed to save comment.', '', true);
        }
    }).catch(function(err) {
        console.error('submitWithdrawalComment :: error=', err); // DEBUG
        showMessageTheme2(0, 'An error occurred.', '', true);
    });
}

/* ------------------------------------------------ helpers */
function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
