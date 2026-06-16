var CURRENT_EVENT_DISCOUNT_TAB = 'masters';
var eventDiscountMastersList = [];

function eventDiscountOnLoad() {
    initEventDiscountDatepickers();
    $('#filterMasterEventName').select2({ theme: 'bootstrap4', allowClear: true, placeholder: 'All Events' });
    $('#filterAssigneeEventName').select2({ theme: 'bootstrap4', allowClear: true, placeholder: 'All Events' });
    $('#filterAssigneeDiscountName').select2({ theme: 'bootstrap4', allowClear: true, placeholder: 'All Discounts' });
    $(document).off('change.edAssigneeEvent').on('change.edAssigneeEvent', '#filterAssigneeEventName', function () {
        populateAssigneeDiscountDropdown($(this).val() || '');
    });
    loadEventDiscountMasters('');
}

function initEventDiscountDatepickers() {
    $('#cdValidFrom').datepicker({ autoclose: true, format: 'M dd, yyyy', container: 'body' });
    $('#cdValidTo').datepicker({ autoclose: true, format: 'M dd, yyyy', container: 'body' });
    $('#caValidFrom').datepicker({ autoclose: true, format: 'M dd, yyyy', container: 'body' });
    $('#caValidTo').datepicker({ autoclose: true, format: 'M dd, yyyy', container: 'body' });
}

function switchEventDiscountTab(tab) {
    CURRENT_EVENT_DISCOUNT_TAB = tab;
    if (tab === 'masters') {
        $('#eventDiscountMastersPanel').show();
        $('#eventDiscountAssigneesPanel').hide();
        $('#edMastersTab').addClass('active');
        $('#edAssigneesTab').removeClass('active');
    } else {
        $('#eventDiscountMastersPanel').hide();
        $('#eventDiscountAssigneesPanel').show();
        $('#edMastersTab').removeClass('active');
        $('#edAssigneesTab').addClass('active');
        ensureDefaultAssigneeDataLoaded();
    }
}

// ─── Masters filter ───────────────────────────────────────────────────────────

function applyMasterFilter() {
    loadEventDiscountMasters($('#filterMasterEventName').val() || '');
}

function resetMasterFilter() {
    $('#filterMasterEventName').val('').trigger('change');
    loadEventDiscountMasters('');
}

// ─── Assignees filter ─────────────────────────────────────────────────────────

function applyAssigneeFilter() {
    var eventName  = $('#filterAssigneeEventName').val() || '';
    var discountId = $('#filterAssigneeDiscountName').val() || '';
    loadEventDiscountAssignees(eventName, discountId);
}

function resetAssigneeFilter() {
    applyDefaultAssigneeFilter();
}

function getDefaultAssigneeEventName() {
    var graduationCeremonyEvent = eventDiscountMastersList.find(function (m) {
        return (m.eventName || '').trim().toLowerCase() === 'graduation ceremony';
    });
    if (graduationCeremonyEvent) {
        return graduationCeremonyEvent.eventName;
    }
    return eventDiscountMastersList.length > 0 ? (eventDiscountMastersList[0].eventName || '') : '';
}

function applyDefaultAssigneeFilter() {
    var defaultEventName = getDefaultAssigneeEventName();
    if (!defaultEventName) {
        $('#filterAssigneeEventName').val('').trigger('change');
        $('#filterAssigneeDiscountName').html('<option value="">All Discounts</option>').val('').trigger('change');
        $('#eventDiscountAssigneesTbody').html('<tr><td colspan="4" class="text-center text-muted">No records found</td></tr>');
        $('#eventDiscountCountsWrapper').html('');
        return;
    }
    $('#filterAssigneeEventName').val(defaultEventName).trigger('change');
    $('#filterAssigneeDiscountName').val('').trigger('change');
    loadEventDiscountAssignees(defaultEventName, '');
}

function ensureDefaultAssigneeDataLoaded() {
    var selectedEventName = $('#filterAssigneeEventName').val() || '';
    if (selectedEventName) {
        loadEventDiscountAssignees(selectedEventName, $('#filterAssigneeDiscountName').val() || '');
        return;
    }
    applyDefaultAssigneeFilter();
}

function populateAssigneeDiscountDropdown(eventName) {
    var filtered = eventName
        ? eventDiscountMastersList.filter(function (m) { return m.eventName === eventName; })
        : eventDiscountMastersList;
    var html = '<option value="">All Discounts</option>';
    $.each(filtered, function (i, m) {
        html += '<option value="' + m.id + '">' + m.couponCode + ' (' + m.discountType + ' ' + m.discountValue + ')</option>';
    });
    $('#filterAssigneeDiscountName').html(html).trigger('change');
}

function populateEventNameDropdowns(masters) {
    var seen = [];
    var opts = '<option value="">All Events</option>';
    $.each(masters, function (i, m) {
        if (m.eventName && seen.indexOf(m.eventName) === -1) {
            seen.push(m.eventName);
            opts += '<option value="' + m.eventName + '">' + m.eventName + '</option>';
        }
    });
    $('#filterMasterEventName').html(opts).trigger('change');
    $('#filterAssigneeEventName').html(opts).trigger('change');
    if (CURRENT_EVENT_DISCOUNT_TAB === 'assignees') {
        ensureDefaultAssigneeDataLoaded();
    }
}

// ─── API calls ────────────────────────────────────────────────────────────────

async function loadEventDiscountMasters(eventName) {
    var url = APP_BASE_URL + SCHOOL_UUID + '/get-event-discount-masters';
    if (eventName) url += '?eventName=' + encodeURIComponent(eventName);
    try {
        var response = await $.ajax({ type: 'GET', url: url, dataType: 'json', cache: false });
        if (response.status === 'SUCCESS' || response.statusCode === '1') {
            var data = response.details || [];
            if (!eventName) {
                eventDiscountMastersList = data;
                populateEventNameDropdowns(data);
                populateAssigneeDiscountDropdown('');
            }
            renderEventDiscountMastersTbody(data);
        } else {
            showMessageTheme2(0, response.message || 'Failed to load discount masters.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load discount masters.');
    }
}

async function loadEventDiscountAssignees(eventName, discountId) {
    var params = [];
    if (eventName)  params.push('eventName=' + encodeURIComponent(eventName));
    if (discountId) params.push('discountId=' + discountId);
    var url = APP_BASE_URL + SCHOOL_UUID + '/get-event-discount-assignees' + (params.length ? '?' + params.join('&') : '');
    try {
        var response = await $.ajax({ type: 'GET', url: url, dataType: 'json', cache: false });
        if (response.status === 'SUCCESS' || response.statusCode === '1') {
            renderEventDiscountAssigneesSection(response.details || {});
        } else {
            showMessageTheme2(0, response.message || 'No data found.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to load assignees.');
    }
}

// ─── Renderers ────────────────────────────────────────────────────────────────

function renderEventDiscountMastersTbody(data) {
    if ($.fn.DataTable.isDataTable('#eventDiscountMastersTable')) {
        $('#eventDiscountMastersTable').DataTable().clear().destroy();
    }
    var html = '';
    if (!data || data.length === 0) {
        html = '<tr><td colspan="8" class="text-center text-muted">No records found</td></tr>';
    } else {
        $.each(data, function (i, item) {
            var fromDisplay = edFormatDateDisplay(item.validFrom);
            var toDisplay   = edFormatDateDisplay(item.validTo);
            var btnLabel    = item.couponCode || ('ID: ' + item.id);
            html += `<tr>
                <td>${i + 1}</td>
                <td>${item.eventName || 'N/A'}</td>
                <td>${item.discountType || 'N/A'}</td>
                <td>${item.discountValue != null ? item.discountValue : 'N/A'}</td>
                <td>${item.couponCode || 'N/A'}</td>
                <td>${fromDisplay}</td>
                <td>${toDisplay}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="openAssignDiscountModal(${item.id})" title="Discount ID: ${item.id}">
                        Assign
                    </button>
                </td>
            </tr>`;
        });
    }
    $('#eventDiscountMastersTbody').html(html);
    if (data && data.length > 0) {
        $('#eventDiscountMastersTable').DataTable({ destroy: true });
    }
}

function renderEventDiscountAssigneesSection(details) {
    var assignees = details.assignees || [];
    var counts    = details.counts    || [];

    var countsHtml = '';
    if (counts.length > 0) {
        countsHtml = '<div class="row mb-2">';
        $.each(counts, function (i, c) {
            var master = eventDiscountMastersList.find(function (m) { return m.id == c.discountId; });
            var label  = master ? (master.couponCode || ('ID: ' + c.discountId)) : ('ID: ' + c.discountId);
            countsHtml += `<div class="col-md-2 mb-2 px-1">
                <div class="card text-white bg-primary shadow-sm" style="border-radius:10px;">
                    <div class="card-body d-flex justify-content-between align-items-center py-2 px-3">
                        <small class="font-weight-bold">${label}</small>
                        <span class="font-weight-bold">${c.count}</span>
                    </div>
                </div>
            </div>`;
        });
        countsHtml += '</div>';
    }
    $('#eventDiscountCountsWrapper').html(countsHtml);

    var html = '';
    if (!assignees || assignees.length === 0) {
        html = '<tr><td colspan="4" class="text-center text-muted">No records found</td></tr>';
    } else {
        $.each(assignees, function (i, item) {
            var master        = eventDiscountMastersList.find(function (m) { return m.id == item.discountId; });
            var discountLabel = master ? (master.couponCode + ' (' + master.discountType + ' ' + master.discountValue + ')') : ('ID: ' + item.discountId);
            html += `<tr>
                <td>${i + 1}</td>
                <td>${discountLabel}</td>
                <td>${item.email || 'N/A'}</td>
                <td>${edFormatDateDisplay(item.assignedAt)}</td>
            </tr>`;
        });
    }
    $('#eventDiscountAssigneesTbody').html(html);
}

// ─── Modal openers ────────────────────────────────────────────────────────────

function openCreateDiscountModal() {
    $('#createDiscountForm')[0].reset();
    $('#cdValidFrom').datepicker('update', '');
    $('#cdValidTo').datepicker('update', '');
    $('#createDiscountModal').modal('show');
}

function openAssignDiscountModal(discountId) {
    $('#assignDiscountForm')[0].reset();
    var html = '<option value="">Select Discount</option>';
    $.each(eventDiscountMastersList, function (i, m) {
        var label = m.eventName + ' — ' + m.couponCode + ' (' + m.discountType + ' ' + m.discountValue + ')';
        html += '<option value="' + m.id + '">' + label + '</option>';
    });
    $('#adDiscountId').html(html);
    if ($('#adDiscountId').hasClass('select2-hidden-accessible')) {
        $('#adDiscountId').select2('destroy');
    }
    $('#adDiscountId').select2({ theme: 'bootstrap4', dropdownParent: $('#assignDiscountModal') });
    if (discountId) $('#adDiscountId').val(discountId).trigger('change');
    $('#assignDiscountModal').modal('show');
}

function openCreateAndAssignModal() {
    $('#createAndAssignForm')[0].reset();
    $('#caValidFrom').datepicker('update', '');
    $('#caValidTo').datepicker('update', '');
    $('#createAndAssignModal').modal('show');
}

// ─── Submit handlers ──────────────────────────────────────────────────────────

async function submitCreateDiscount() {
    var eventName     = $('#cdEventName').val().trim();
    var discountType  = $('#cdDiscountType').val();
    var discountValue = parseFloat($('#cdDiscountValue').val());
    var couponCode    = $('#cdCouponCode').val().trim();
    var fromDate      = $('#cdValidFrom').datepicker('getDate');
    var toDate        = $('#cdValidTo').datepicker('getDate');

    if (!eventName)                        { showMessageTheme2(0, 'Event name is required.');                   return; }
    if (!discountType)                     { showMessageTheme2(0, 'Discount type is required.');                return; }
    if (!discountValue || discountValue <= 0) { showMessageTheme2(0, 'Discount value must be greater than 0.'); return; }
    if (!couponCode)                       { showMessageTheme2(0, 'Coupon code is required.');                  return; }
    if (!fromDate)                         { showMessageTheme2(0, 'Valid from date is required.');              return; }
    if (!toDate)                           { showMessageTheme2(0, 'Valid to date is required.');                return; }
    if (fromDate >= toDate)                { showMessageTheme2(0, 'Valid from must be before valid to.');       return; }

    var payload = {
        controlType:   'create',
        eventName:     eventName,
        discountType:  discountType,
        discountValue: discountValue,
        couponCode:    couponCode,
        validFrom:     changeDateFormat(fromDate, 'yyyy-mm-dd') + ' 00:00:00',
        validTo:       changeDateFormat(toDate,   'yyyy-mm-dd') + ' 23:59:59'
    };
    try {
        var response = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + SCHOOL_UUID + '/event-discount', body: payload, global: true, showMessage: false });
        if (edIsSuccess(response)) {
            showMessageTheme2(1, response.message || 'Discount created successfully.');
            $('#createDiscountModal').modal('hide');
            loadEventDiscountMasters('');
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to create discount.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to create discount.');
    }
}

async function submitAssignDiscount() {
    var discountId = $('#adDiscountId').val();
    var email      = $('#adEmail').val().trim();

    if (!discountId) { showMessageTheme2(0, 'Please select a discount.'); return; }
    if (!email)      { showMessageTheme2(0, 'Email is required.');        return; }

    var payload = { controlType: 'assign', discountId: parseInt(discountId), email: email };
    try {
        var response = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + SCHOOL_UUID + '/event-discount', body: payload, global: true, showMessage: false });
        if (edIsSuccess(response)) {
            showMessageTheme2(1, response.message || 'Discount assigned successfully.');
            $('#assignDiscountModal').modal('hide');
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to assign discount.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to assign discount.');
    }
}

async function submitCreateAndAssign() {
    var eventName     = $('#caEventName').val().trim();
    var discountType  = $('#caDiscountType').val();
    var discountValue = parseFloat($('#caDiscountValue').val());
    var couponCode    = $('#caCouponCode').val().trim();
    var fromDate      = $('#caValidFrom').datepicker('getDate');
    var toDate        = $('#caValidTo').datepicker('getDate');
    var email         = $('#caEmail').val().trim();

    if (!eventName)                        { showMessageTheme2(0, 'Event name is required.');                   return; }
    if (!discountType)                     { showMessageTheme2(0, 'Discount type is required.');                return; }
    if (!discountValue || discountValue <= 0) { showMessageTheme2(0, 'Discount value must be greater than 0.'); return; }
    if (!couponCode)                       { showMessageTheme2(0, 'Coupon code is required.');                  return; }
    if (!fromDate)                         { showMessageTheme2(0, 'Valid from date is required.');              return; }
    if (!toDate)                           { showMessageTheme2(0, 'Valid to date is required.');                return; }
    if (fromDate >= toDate)                { showMessageTheme2(0, 'Valid from must be before valid to.');       return; }
    if (!email)                            { showMessageTheme2(0, 'Email is required.');                       return; }

    var payload = {
        controlType: 'createAndAssign',
        discount: {
            eventName:     eventName,
            discountType:  discountType,
            discountValue: discountValue,
            couponCode:    couponCode,
            validFrom:     changeDateFormat(fromDate, 'yyyy-mm-dd') + ' 00:00:00',
            validTo:       changeDateFormat(toDate,   'yyyy-mm-dd') + ' 23:59:59'
        },
        user: { email: email }
    };
    try {
        var response = await callCommonAjax({ method: 'POST', url: APP_BASE_URL + SCHOOL_UUID + '/event-discount', body: payload, global: true, showMessage: false });
        if (edIsSuccess(response)) {
            showMessageTheme2(1, response.message || 'Discount created and assigned successfully.');
            $('#createAndAssignModal').modal('hide');
            loadEventDiscountMasters('');
        } else {
            showMessageTheme2(0, (response && response.message) ? response.message : 'Failed to create and assign discount.');
        }
    } catch (e) {
        showMessageTheme2(0, 'Failed to create and assign discount.');
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function edIsSuccess(response) {
    return response && (response.status === 'SUCCESS' || response.statusCode === '1');
}

function edFormatDateDisplay(apiDateStr) {
    if (!apiDateStr) return 'N/A';
    try {
        return changeDateFormat(new Date(apiDateStr.replace(' ', 'T')), 'MMM-dd-yyyy');
    } catch (e) {
        return apiDateStr;
    }
}
