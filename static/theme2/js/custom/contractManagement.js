/* ============================================================================
   Contract Management
   - LIST         → POST dashboard/teacher-contracts-list
   - ALL CONTRACTS → POST dashboard/teacher-all-contracts-list
   Live actions:
   - View  → opens the contract's agreementViewUrl in a right-slide modal iframe
   - Renew → opens the same "Edit Agreement" flow as the approved-teachers page
             (addTeacherContract) in its right-slide modal
   - All contracts → history modal; each row's View reuses the agreement modal
   Re-issue, Edit draft and Send reminder are wired to their APIs.
   ========================================================================== */

var tcmState = {
    currentPage:    1,
    recordsPerPage: 10,
    teacherSearch:  '',
    contractStatus: 'ALL',
    // search and the status chips are mutually exclusive filters: while a search is
    // active no chip is highlighted, and clicking a chip clears the search
    searchActive:   false,
    rows:           [],
    noOfPages:      0,
    statusCount:    {}
};

var TCM_STATUS_FILTERS = [
    { value: 'ALL',      label: 'All',      countKey: 'all' },
    { value: 'ACCEPTED', label: 'Accepted', countKey: 'accepted' },
    { value: 'PENDING',  label: 'Pending',  countKey: 'pending' },
    { value: 'EXPIRED',  label: 'Expired',  countKey: 'expired' },
    { value: 'DRAFT',    label: 'Draft',    countKey: 'draft' }
];

// ─── On load ────────────────────────────────────────────────────────────────

function contractManagementOnLoad() {
    tcmState.currentPage = 1;
    tcmState.recordsPerPage = 10;
    tcmState.teacherSearch = '';
    tcmState.contractStatus = 'ALL';
    tcmState.searchActive = false;

    $('#tcmPageSize').on('change', function () {
        tcmState.recordsPerPage = parseInt($(this).val()) || 10;
        tcmState.currentPage = 1;
        loadTeacherContractList();
    });

    $('#tcmSearchInput').on('keypress', function (e) {
        if (e.which === 13) applyTeacherContractSearch();
    });

    // Renew reuses the shared "Edit Agreement" modal, which is removed & rebuilt on
    // every open — so delegate on document (namespaced, rebound once) and refresh the
    // list when it closes, but only while this page is actually mounted.
    $(document).off('hidden.bs.modal.tcm', '#addTeacherContractModal')
        .on('hidden.bs.modal.tcm', '#addTeacherContractModal', function () {
            if (document.getElementById('tcmTbody')) {
                loadTeacherContractList();
            }
        });

    renderTeacherContractStatusChips();
    loadTeacherContractList();
}

function applyTeacherContractSearch() {
    tcmState.teacherSearch = ($('#tcmSearchInput').val() || '').trim();
    // a search spans all statuses and takes over from the chips (none stays selected)
    tcmState.searchActive = tcmState.teacherSearch.length > 0;
    tcmState.contractStatus = 'ALL';
    tcmState.currentPage = 1;
    loadTeacherContractList();
}

function resetTeacherContractSearch() {
    $('#tcmSearchInput').val('');
    $('#tcmPageSize').val('10');
    tcmState.teacherSearch = '';
    tcmState.searchActive = false;
    tcmState.recordsPerPage = 10;
    tcmState.contractStatus = 'ALL';
    tcmState.currentPage = 1;
    loadTeacherContractList();
}

function setTeacherContractStatusFilter(status) {
    // clicking a chip is its own filter — drop any active search so it doesn't stack
    if (tcmState.contractStatus === status && !tcmState.searchActive) return;
    $('#tcmSearchInput').val('');
    tcmState.teacherSearch = '';
    tcmState.searchActive = false;
    tcmState.contractStatus = status;
    tcmState.currentPage = 1;
    renderTeacherContractStatusChips();
    loadTeacherContractList();
}

// ─── API: list ──────────────────────────────────────────────────────────────

async function loadTeacherContractList() {
    var payload = {
        userId:         USER_ID,
        schoolId:       SCHOOL_ID,
        currentPage:    tcmState.currentPage,
        recordsPerPage: tcmState.recordsPerPage,
        teacherSearch:  tcmState.teacherSearch,
        contractStatus: tcmState.contractStatus
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: getURLForHTML('dashboard', 'teacher-contracts-list'),
            body: payload,
            global: true,
            showMessage: false
        });
        if (response && response.status == '1') {
            tcmState.rows        = response.teacherContractList || [];
            tcmState.noOfPages   = response.noOfPages || 0;
            tcmState.currentPage = response.currentPage || tcmState.currentPage;
            tcmState.statusCount = response.contractStatusCount || {};
            if (response.selectedContractStatus) {
                tcmState.contractStatus = response.selectedContractStatus;
            }
        } else {
            tcmState.rows = [];
            tcmState.noOfPages = 0;
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load teacher contracts.');
        }
    } catch (e) {
        tcmState.rows = [];
        tcmState.noOfPages = 0;
        showMessageTheme2(0, 'Failed to load teacher contracts.');
    }
    renderTeacherContractStatusChips();
    renderTeacherContractTable();
}

// ─── Renderers ──────────────────────────────────────────────────────────────

function tcmEscape(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTeacherContractStatusChips() {
    var counts = tcmState.statusCount || {};
    var html = TCM_STATUS_FILTERS.map(function (f) {
        // while a search is active, no chip is highlighted (search is the active filter)
        var active = !tcmState.searchActive && tcmState.contractStatus === f.value;
        var count = counts[f.countKey] != null ? ' (' + counts[f.countKey] + ')' : '';
        return '<button type="button" class="btn btn-sm rounded-pill px-3 ' +
                (active ? 'btn-primary' : 'btn-outline-primary') + '" ' +
                'onclick="setTeacherContractStatusFilter(\'' + f.value + '\')">' +
                f.label + count + '</button>';
    }).join('');
    $('#tcmStatusFilters').html(html);
}

// "INR" + "122" → "INR 122"; blank currency or salary handled gracefully
function tcmSalaryText(currency, salary) {
    var s = ((currency ? tcmEscape(currency) + ' ' : '') + tcmEscape(salary || '')).trim();
    return s || '—';
}

function tcmStatusBadge(status) {
    var map = {
        'Accepted': 'badge-success',
        'Pending':  'badge-warning',
        'Expired':  'badge-danger',
        'Draft':    'badge-secondary'
    };
    var cls = map[status] || 'badge-light border';
    return '<span class="badge ' + cls + '">' + tcmEscape(status || '—') + '</span>';
}

function tcmEmployeeTypePill(type) {
    if (!type) return '';
    var bg = '#1e90ff';
    if (/part/i.test(type)) bg = '#7c3aed';
    else if (/contract/i.test(type)) bg = '#0d9488';
    return '<div class="my-1"><span class="badge text-white" style="background:' + bg + ';border-radius:999px">' + tcmEscape(type) + '</span></div>';
}

// action APIs are pending — rendered disabled so the layout matches the final design
function tcmDisabledLink(label) {
    return '<span class="text-muted" style="cursor:not-allowed" title="Coming soon">' + label + '</span>';
}

function renderTeacherContractTable() {
    var rows = tcmState.rows || [];
    var html = '';
    if (!rows.length) {
        html = '<tr><td colspan="8" class="text-center text-muted py-4">No contracts found</td></tr>';
    } else {
        rows.forEach(function (row, idx) {
            var srNo = row.srNo != null ? row.srNo : ((tcmState.currentPage - 1) * tcmState.recordsPerPage + idx + 1);

            // Teacher details
            var teacherCell = '<div class="font-weight-bold">' + tcmEscape(row.teacherName || '—') + '</div>' +
                '<div class="small text-muted">' + tcmEscape(row.teacherEmail || '') +
                (row.teacherTimeZone ? '<br>' + tcmEscape(row.teacherTimeZone) : '') +
                (row.applicationNo ? '<br>' + tcmEscape(row.applicationNo) : '') +
                '</div>';

            // Current contract
            var contractCell = '<div class="text-nowrap">' + tcmEscape(row.contractRefNumber || '—') + '</div>' +
                tcmEmployeeTypePill(row.employeeType) +
                '<div class="small text-muted">' + tcmSalaryText(row.currency, row.salary) + '</div>';

            // Status (+ valid till for Pending/Expired, + last reminder timestamp)
            var statusCell = tcmStatusBadge(row.status);
            if ((row.status === 'Pending' || row.status === 'Expired') && row.validTill) {
                statusCell += '<div class="small mt-1">Valid till: <b>' + tcmEscape(row.validTill) + '</b></div>';
            }
            if (row.agreementSkipAllowedTill) {
                statusCell += '<div class="small mt-1 text-muted">Skip till: <b>' + tcmEscape(row.agreementSkipAllowedTill) + '</b></div>';
            }
            if (row.status === 'Pending' && row.reminderSentOn) {
                statusCell += '<div class="small font-weight-bold mt-1" style="color:#c77700">Reminder sent · ' +
                    tcmEscape(row.reminderSentOn) + '</div>';
            }

            // Accepted on
            var acceptedCell = '—';
            if (row.acceptedOn) {
                acceptedCell = '<div class="text-nowrap">' + tcmEscape(row.acceptedOn) + '</div>' +
                    '<div class="small text-muted">' +
                    (row.acceptedLocation ? tcmEscape(row.acceptedLocation) + '<br>' : '') +
                    (row.acceptedIp ? 'IP ' + tcmEscape(row.acceptedIp) : '') +
                    '</div>';
            }

            // Action — only "View" is live; the rest wait on their APIs
            var actions = [];
            if (row.status === 'Draft') {
                // same flow as Renew (addTeacherContract) — it loads the teacher's latest
                // agreement, i.e. this draft, for editing
                actions.push('<a href="javascript:void(0)" class="text-primary" onclick="renewTeacherContractRow(' + idx + ')">Edit draft</a>');
            } else {
                if (row.agreementViewUrl) {
                    actions.push('<a href="javascript:void(0)" class="text-primary font-weight-bold" onclick="openTeacherContractAgreement(' + idx + ')">View</a>');
                } else {
                    actions.push(tcmDisabledLink('View'));
                }
                // Send reminder only until a reminder has been sent for this pending contract
                if (row.status === 'Pending' && !row.reminderSentOn) actions.push('<a href="javascript:void(0)" class="text-primary" onclick="sendTeacherContractReminder(' + idx + ', this)">Send reminder</a>');
                // Re-issue only for an expired contract that was never accepted
                if (row.status === 'Expired' && !row.acceptedOn) actions.push('<a href="javascript:void(0)" class="text-primary" onclick="openTeacherReissue(' + idx + ')">Re-issue</a>');
            }
            var actionCell = '<div class="d-flex flex-column" style="gap:4px">' + actions.join('') + '</div>';

            // Past contracts
            var pastCount = row.pastContractsCount != null ? row.pastContractsCount : 0;
            var pastCell = '<div class="d-flex flex-column align-items-start" style="gap:4px">' +
                '<button type="button" class="btn btn-primary btn-sm" onclick="renewTeacherContractRow(' + idx + ', true)">Renew</button>' +
                '<a href="javascript:void(0)" class="text-primary" onclick="openTeacherAllContracts(' + idx + ')"><i class="fa fa-clock-o mr-1"></i>All contracts (' + (pastCount + 1) + ')</a>' +
                (pastCount > 0 ? '<span class="small text-muted">' + pastCount + ' past</span>' : '') +
                '</div>';

            html += '<tr>' +
                '<td>' + srNo + '</td>' +
                '<td>' + teacherCell + '</td>' +
                '<td>' + contractCell + '</td>' +
                '<td class="text-nowrap">' + tcmEscape(row.duration || '—') + '</td>' +
                '<td>' + statusCell + '</td>' +
                '<td>' + acceptedCell + '</td>' +
                '<td>' + actionCell + '</td>' +
                '<td>' + pastCell + '</td>' +
                '</tr>';
        });
    }
    $('#tcmTbody').html(html);

    // server-side pagination via the common renderer
    $('#tcmPagination').html(tcmState.noOfPages > 1 ? renderPaginationCommon(tcmState.currentPage, tcmState.noOfPages, 'contractManagement') : '');
}

// ─── View: agreement in a right-slide modal ─────────────────────────────────

function ensureTcmModals() {
    if (!document.getElementById('tcmAgreementModal')) {
        $('body').append(getTcmAgreementModalHtml());
        // hide the loader once the agreement page has actually rendered
        // (ignore the about:blank reset that fires on close)
        $('#tcmAgreementFrame').on('load', function () {
            if (($(this).attr('src') || '') !== 'about:blank') {
                $('#tcmAgreementLoader').hide();
            }
        });
        // stop the iframe from holding the page in memory once the panel closes
        $('#tcmAgreementModal').on('hidden.bs.modal', function () {
            $('#tcmAgreementFrame').attr('src', 'about:blank');
            // when opened over the still-open all-contracts modal, Bootstrap strips
            // body.modal-open on this one's close — restore it so scroll stays locked
            if ($('#tcmAllContractsModal').hasClass('show')) {
                $('body').addClass('modal-open');
            }
        });
    }
    if (!document.getElementById('tcmAllContractsModal')) {
        $('body').append(getTcmAllContractsModalHtml());
    }
    if (!document.getElementById('tcmReissueModal')) {
        $('body').append(getTcmReissueModalHtml());
    }
}

function openTcmAgreementModal(url, title) {
    if (!url) return;
    ensureTcmModals();
    $('#tcmAgreementModalTitle').text(title || 'Contract');
    $('#tcmAgreementLoader').show();               // show spinner until the iframe loads
    $('#tcmAgreementFrame').attr('src', url);
    $('#tcmAgreementModal').modal('show');
}

function openTeacherContractAgreement(idx) {
    var row = (tcmState.rows || [])[idx];
    if (row && row.agreementViewUrl) {
        openTcmAgreementModal(row.agreementViewUrl, row.contractRefNumber || row.teacherName || 'Contract');
    }
}

// ─── Renew: reuse the approved-teacher "Edit Agreement" flow ────────────────

async function renewTeacherContractRow(idx, clearValidity) {
    var row = (tcmState.rows || [])[idx];
    if (!row) return;
    if (typeof addTeacherContract !== 'function') {
        showMessageTheme2(0, 'Contract editor is not available.');
        return;
    }
    // addTeacherContract() unescapes the name internally, so hand it an escaped one
    var name = typeof escapeCharacters === 'function' ? escapeCharacters(row.teacherName || '') : (row.teacherName || '');
    await addTeacherContract(row.userId, name, row.teacherEmail || '', row.contractId || 0);
    // on Renew, wipe the carried-over acceptance-validity so a fresh window is chosen
    // (Edit draft keeps its in-progress validity)
    if (clearValidity) {
        clearTcmContractValidity();
    }
}

// clears the "Set the Validity for Offer of Acceptance" block in the add-contract modal
function clearTcmContractValidity() {
    var $form = $('#teacherContractForm');
    if (!$form.length) return;
    var $start = $form.find('#contractValidityStartDate');
    var $skipAllowedTill = $form.find('#agreementSkipAllowedTill');
    try { $start.datepicker('update', ''); } catch (e) {}   // also clears the picker selection
    $start.val('');
    $form.find('#contractValidityEndDate').val('');
    try { $skipAllowedTill.datepicker('update', ''); } catch (e) {}
    $skipAllowedTill.val('');
    // reset the days select and recompute (its onchange clears the end date too)
    $form.find('#contractValidityDuration').val('0').trigger('change');
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($start.closest('.custom-field'));
        refreshCustomFieldState($form.find('#contractValidityDuration').closest('.custom-field'));
        refreshCustomFieldState($form.find('#contractValidityEndDate').closest('.custom-field'));
        refreshCustomFieldState($skipAllowedTill.closest('.custom-field'));
    }
}

// ─── All contracts: history modal ───────────────────────────────────────────

var tcmAllContracts = [];

async function openTeacherAllContracts(idx) {
    var row = (tcmState.rows || [])[idx];
    if (!row) return;
    var payload = {
        userId:    USER_ID,
        schoolId:  SCHOOL_ID,
        teacherId: row.teacherId
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: getURLForHTML('dashboard', 'teacher-all-contracts-list'),
            body: payload,
            global: true,
            showMessage: false
        });
        if (response && response.status == '1') {
            renderTeacherAllContractsModal(response);
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to load contracts.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load contracts.');
    }
}

function renderTeacherAllContractsModal(resp) {
    ensureTcmModals();
    tcmAllContracts = resp.teacherContractList || [];
    var teacherName = (resp.teacherName || '').trim();
    var total = resp.totalContractsCount != null ? resp.totalContractsCount : tcmAllContracts.length;
    $('#tcmAllContractsTitle').text((teacherName ? teacherName + ' — ' : '') + 'All Contracts (' + total + ')');

    var body = '';
    if (!tcmAllContracts.length) {
        body = '<tr><td colspan="6" class="text-center text-muted py-4">No contracts found</td></tr>';
    } else {
        tcmAllContracts.forEach(function (c, i) {
            var isCurrent = c.currentContract === true;

            var salary = tcmSalaryText(c.currency, c.salary);

            // accepted meta (date + location + IP) when the contract was digitally accepted
            var acc = '—';
            if (c.acceptedOn) {
                acc = '<div class="text-nowrap">' + tcmEscape(c.acceptedOn) + '</div>';
                if (c.acceptedLocation || c.acceptedIp) {
                    acc += '<div class="small text-muted">' +
                        (c.acceptedLocation ? tcmEscape(c.acceptedLocation) + '<br>' : '') +
                        (c.acceptedIp ? 'IP ' + tcmEscape(c.acceptedIp) : '') +
                        '</div>';
                }
            }

            var viewBtn = c.agreementViewUrl
                ? '<button type="button" class="btn btn-outline-primary btn-sm" onclick="openTcmAllContractView(' + i + ')" title="View"><i class="fa fa-eye"></i></button>'
                : '<span class="text-muted">—</span>';

            body += '<tr>' +
                '<td class="text-nowrap">' + tcmEscape(c.contractRefNumber || '—') +
                    (isCurrent ? ' <span class="badge badge-info">Current</span>' : '') + '</td>' +
                '<td class="text-nowrap">' + tcmEscape(c.duration || '—') + '</td>' +
                '<td class="text-nowrap">' + salary + '</td>' +
                '<td>' + tcmStatusBadge(c.status) + '</td>' +
                '<td>' + acc + '</td>' +
                '<td class="text-center">' + viewBtn + '</td>' +
                '</tr>';
        });
    }
    $('#tcmAllContractsTbody').html(body);
    $('#tcmAllContractsModal').modal('show');
}

function openTcmAllContractView(i) {
    var c = (tcmAllContracts || [])[i];
    if (c && c.agreementViewUrl) {
        openTcmAgreementModal(c.agreementViewUrl, c.contractRefNumber || 'Contract');
    }
}

// ─── Re-issue: new acceptance window for an expired contract ─────────────────

var tcmReissueRow = null;

function openTeacherReissue(idx) {
    var row = (tcmState.rows || [])[idx];
    if (!row) return;
    ensureTcmModals();
    tcmReissueRow = row;

    $('#tcmReissueTitle').text('Re-issue Contract — ' + (row.contractRefNumber || ''));
    var intro = row.validTill
        ? 'This contract expired on <strong>' + tcmEscape(row.validTill) + '</strong>. '
        : '';
    $('#tcmReissueIntro').html(intro + 'Set a new acceptance window and re-initiate to send the offer again.');

    // validity starts today; the days select drives the (disabled) valid-till date
    $('#tcmReissueStartDate').val(changeDateFormat(new Date(), 'MMM-dd-yyyy'));
    $('#tcmReissueDays').val('0');
    $('#tcmReissueEndDate').val('');
    if (typeof refreshCustomFieldState === 'function') {
        refreshCustomFieldState($('#tcmReissueDays').closest('.custom-field'));
        refreshCustomFieldState($('#tcmReissueEndDate').closest('.custom-field'));
    }

    $('#tcmReissueModal').modal('show');
}

async function submitTeacherReissue() {
    var row = tcmReissueRow;
    if (!row) return;

    var days = parseInt($('#tcmReissueDays').val(), 10);
    if (!days || days < 1) {
        showMessageTheme2(0, 'Please select the number of days.');
        return;
    }
    // valid-till = today + selected days (same as the displayed New Valid Till Date)
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    var payload = {
        userId:      USER_ID,
        schoolId:    SCHOOL_ID,
        contractId:  row.contractId,
        validityEnd: changeDateFormat(endDate, 'yyyy-mm-dd')
    };

    var $btn = $('#tcmReissueSubmitBtn');
    $btn.prop('disabled', true);
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: getURLForHTML('dashboard', 'reissue-teacher-contract'),
            body: payload,
            global: true,
            showMessage: false
        });
        if (response && response.status == '1') {
            $('#tcmReissueModal').modal('hide');
            showMessageTheme2(1, response.message || 'Contract re-issued successfully.');
            loadTeacherContractList();
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to re-issue contract.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to re-issue contract.');
    } finally {
        $btn.prop('disabled', false);
    }
}

// ─── Send reminder: nudge a teacher with a pending contract ──────────────────

async function sendTeacherContractReminder(idx, linkEl) {
    var row = (tcmState.rows || [])[idx];
    if (!row) return;

    var $link = $(linkEl);
    if ($link.data('sending')) return;                 // guard against double-clicks
    $link.data('sending', true).addClass('text-muted').css('pointer-events', 'none');

    var payload = {
        userId:     USER_ID,
        schoolId:   SCHOOL_ID,
        contractId: row.contractId
    };
    try {
        var response = await callCommonAjax({
            method: 'POST',
            url: getURLForHTML('dashboard', 'send-teacher-contract-reminder'),
            body: payload,
            global: true,
            showMessage: false
        });
        if (response && response.status == '1') {
            showMessageTheme2(1, response.message || 'Reminder email sent successfully.');
            loadTeacherContractList();                 // re-render (link is rebuilt fresh)
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to send reminder.');
            $link.data('sending', false).removeClass('text-muted').css('pointer-events', '');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to send reminder.');
        $link.data('sending', false).removeClass('text-muted').css('pointer-events', '');
    }
}
