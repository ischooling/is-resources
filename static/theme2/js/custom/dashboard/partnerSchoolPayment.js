var currentPagePaymentList = 1;
function openStudentFeesModal(){
    $("#studentFeesModal").modal('show');
}

function getPayStudentFeesDetais(callFrom) {
    customLoader(true);
    let dateFrom = ''
    let dateTo = ''
    if($("#"+callFrom+" #paymentDateFromSearch").val() != null && $("#"+callFrom+" #paymentDateFromSearch").val() != undefined && $("#"+callFrom+" #paymentDateFromSearch").val() != ''){
        dateFrom = changeDateFormat(new Date($("#"+callFrom+" #paymentDateFromSearch").val()), 'yyyy-mm-dd')
    }
    if($("#"+callFrom+" #paymentDateToSearch").val() != null && $("#"+callFrom+" #paymentDateToSearch").val() != undefined && $("#"+callFrom+" #paymentDateToSearch").val() != ''){
        dateTo = changeDateFormat(new Date($("#"+callFrom+" #paymentDateToSearch").val()), 'yyyy-mm-dd')
    }
    var reqData={
		"schoolId": SCHOOL_ID,
        "partnerReferralCode":$("#"+callFrom+" #partnerNameSearch").val(),
        "studentId" : $("#"+callFrom+" #studentIdSearch").val(), 
        "studentName" : $("#"+callFrom+" #studentNameSearch").val(),
        "standardId" : $("#"+callFrom+" #gradeSearch").val(),
        "learningProgram" : $("#"+callFrom+" #learningProgramSeach").val(),
        "paymentDateFrom" : dateFrom,
        "paymentDateTo" : dateTo
	};

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-pay-student-fee-for-partner-school'),
        data: JSON.stringify(reqData),
        dataType: 'json',
        async: false,
        global: false,
        success: function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                    customLoader(false);
                }
            } else {
                var html = '';
                let totalPayableToIS = 0;

                $.each(data.studentFeeDetails, function(index, item) {
                    html += `<tr>
                        <td>
                            <input type="checkbox" class="row-checkbox paymentCheck"  />
                        </td>
                        <td>${item.partnerName}</td>
                        <td>${item.studentId}</td>
                        <td>${item.studentName} | ${item.standardName}</td>
                        <td>${item.learningProgram}</td>
                        <td>${item.parentSchoolCourseFee == undefined ? 'NA' : schoolSettingsTechnical.currencySymbol + item.parentSchoolCourseFee}</td>
                        <td>${item.partnerCourseFee == undefined ? 'NA' : schoolSettingsTechnical.currencySymbol + item.partnerCourseFee}</td>`;
                        html +=`<td>${item.partnerRevenue == undefined ? 'NA' : schoolSettingsTechnical.currencySymbol + item.partnerRevenue}</td>
                        <td>${item.payableToIS == undefined ? 'NA' : schoolSettingsTechnical.currencySymbol + item.payableToIS}</td>
                        <td>${item.commisionType == undefined ? 'NA' : item.commisionType == 'P' ? 'Percentage' : 'Amount'} | ${item.commisionRate == undefined ? 'NA' : item.commisionRate}</td>
                        <td>
                            <input type="hidden" class="studentStandardId" value="${item.StudentStandardId}" />
                            <input type="number" min="0" step="0.01" class="form-control payable-input payAmount" oninput="updateTotalPayable();" value="${item.payableToIS == undefined ? 'NA' : item.payableToIS}"/>
                        </td>
                    </tr>`;
                });
                var htmlFoot='';
                htmlFoot= `<tr style="background-color:#E9E9E9;bottom:0;" class="position-sticky">
                    <td colspan="10" class="font-weight-bold text-right">Total Payable</td>
                    <td class="font-weight-bold">$<span class="total-payable-cell">${totalPayableToIS.toFixed(2)}</span></td>
                    <td></td>
                </tr>`;

                $("#schoolPaymentTable").html(html);
                $("#schoolPaymentTableFoot").html(htmlFoot);

                $('#selectAll').on('change', function() {
                    $('.row-checkbox').prop('checked', this.checked);
                });
                customLoader(false);
            }
        }
    });
}

function updateTotalPayable() {
    let total = 0;
    
    $("#studentFeesTableSearch tbody tr").each(function() {
        const row = $(this);
        const isChecked = row.find('.paymentCheck').is(':checked');
        const amount = parseFloat(row.find('.payable-input').val());

        if (isChecked && !isNaN(amount)) {
            total += amount;
        }
    });

    $('.total-payable-cell').text(`${total.toFixed(2)}`);
}

$(document).on('change', '.paymentCheck', updateTotalPayable);

function getRequestForSchoolPaymentFilter(formId) {
    var data = {};
    var schoolPaymentFilterDTO = {};

    schoolPaymentFilterDTO['userId'] = parseInt(USER_ID);
    if(USER_ROLE == 'SCHOOL_ADMIN'){
        schoolPaymentFilterDTO['fromSchoolId'] =  $("#" + formId + " #schoolName").val() == undefined ? SCHOOL_ID : $("#" + formId + " #schoolName").val();
    }else{
        schoolPaymentFilterDTO['fromSchoolId'] =  $("#" + formId + " #schoolName").val() == undefined ? "ALL" : $("#" + formId + " #schoolName").val();
    }
    schoolPaymentFilterDTO['partnerUserId'] = $("#" + formId + " #partnerName").val() == undefined ? "" : $("#" + formId + " #partnerName").val();
    schoolPaymentFilterDTO['academicYear'] = $("#" + formId + " #academicSession").val() == undefined ? "ALL" : $("#" + formId + " #academicSession").val();
    schoolPaymentFilterDTO['transactionNo'] = $("#" + formId + " #transactionNo").val() == undefined ? "" : $("#" + formId + " #transactionNo").val().trim();
    schoolPaymentFilterDTO['referenceNo'] = $("#" + formId + " #userRefNo").val() == undefined ? "" : $("#" + formId + " #userRefNo").val().trim();
    schoolPaymentFilterDTO['paymentVia'] = $("#" + formId + " #paymentVia").val() == undefined ? "" : $("#" + formId + " #paymentVia").val();
    schoolPaymentFilterDTO['pgUsed'] = $("#" + formId + " #paymentGatewayUsed").val() == undefined ? "" : $("#" + formId + " #paymentGatewayUsed").val();
    schoolPaymentFilterDTO['paymentProof'] = $("#" + formId + " #proofOfPayment").val() == undefined ? "" : $("#" + formId + " #proofOfPayment").val();
    schoolPaymentFilterDTO['paymentReviewed'] = $("#" + formId + " #paymentReviewed").val() == undefined ? "" : $("#" + formId + " #paymentReviewed").val();
    schoolPaymentFilterDTO['paymentStatus'] = $("#" + formId + " #paymentStatus").val() == undefined ? "" : $("#" + formId + " #paymentStatus").val();
    schoolPaymentFilterDTO['paymentDateFrom'] = changeDateFormat(new Date($("#" + formId + " #paymentDateFrom").val()), "yyyy-mm-dd") == undefined || changeDateFormat(new Date($("#" + formId + " #paymentDateFrom").val()), "yyyy-mm-dd") == "NaN-0NaN-0NaN" ? "" : changeDateFormat(new Date($("#" + formId + " #paymentDateFrom").val()), "yyyy-mm-dd");
    schoolPaymentFilterDTO['paymentDateTo'] = changeDateFormat(new Date($("#" + formId + " #paymentDateTo").val()), "yyyy-mm-dd") == undefined || changeDateFormat(new Date($("#" + formId + " #paymentDateTo").val()), "yyyy-mm-dd") == "NaN-0NaN-0NaN" ? "" : changeDateFormat(new Date($("#" + formId + " #paymentDateTo").val()), "yyyy-mm-dd");
    schoolPaymentFilterDTO['orderBy'] = $("#" + formId + " #orderBy").val() == undefined ? "scheduledPaymentDate" : $("#" + formId + " #orderBy").val();
    schoolPaymentFilterDTO['sortBy'] = $("#" + formId + " #sortIn").val() == undefined ? "D" : $("#" + formId + " #sortIn").val();
    schoolPaymentFilterDTO['pageSize'] = $("#" + formId + " #noOfRecords").val() == undefined ? 25 : parseInt($("#" + formId + " #noOfRecords").val());
    schoolPaymentFilterDTO['pageNo'] = currentPagePaymentList;

    data['schoolPaymentFilterDTO'] = schoolPaymentFilterDTO;
    return data;
}

function getPartnerSchoolPaymentDetails(formId) {  
    if($("#" + formId + " #noOfRecords").val() == ""){
        showMessageTheme2(2, "Please enter page size");
		return false;
    }else{
        $("#enroll-list-skeleton").show();
        $("#paymentListDiv").hide();
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-partner-school-payment-details'),
        data: JSON.stringify(getRequestForSchoolPaymentFilter(formId)),
        dataType: 'json',
        success: function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                var html = '';
                $("#enroll-list-skeleton").hide();
                $("#paymentListDiv").show();
                if (data.paymentsList && data.paymentsList.length > 0) {
                    $.each(data.paymentsList, function(index, item) {
                        html+=`<tr id="payment-row-${item.sprId}">`;
                        if(USER_ROLE == "DIRECTOR"){
                            html+=`<td style="text-transform: capitalize;">${item.fromSchoolName}</td>`;
                        }
                        html+=`<td>${item.partnerName}</td>
                        <td>${item.transactionNo}</td>
                        <td>${item.referenceNo}</td>
                        <td>${item.paymentVia}</td>
                        <td>${item.paymentName}</td>
                        <td>${schoolSettingsTechnical.currencySymbol + " " + item.paymentAmount}</td>
                        <td>
                           ${item.attachmentUrl == undefined || item.attachmentUrl == '' || item.attachmentUrl == "N/A"
                           ? 'N/A'
                           : `<a href="${item.attachmentUrl}" target="_blank" class="btn btn-sm btn-primary" style="font-size:10px;">View</a>`
                           } 
                        </td>`;
                        let statusClass = '';
                        if (item.paymentStatus === 'SUCCESS') statusClass = 'text-success';
                        else if (item.paymentStatus === 'INITIATED') statusClass = 'text-warning';
                        else if (item.paymentStatus === 'REJECTED') statusClass = 'text-danger';
                
                        html+=`<td class="${statusClass} font-weight-bold">${item.paymentStatus}</td>`;
                        html+=`<td>`;
                            if(item.paymentStatus === 'SUCCESS'){
                                html+=`<button class="btn btn-sm btn-primary" style="font-size:10px;" onclick="getSchoolPaymentReceipt('${item.sprId}')">View Receipt</button>`;
                            }else{
                                html+=`N/A`;
                            }
                        html+=`</td>`;
                        html+=`<td><button class="btn btn-sm btn-primary" style="font-size:10px;" onclick="getStudentList('${item.sprId}')">View Student List</button></td>
                        <td>${item.scheduledPayDate == 'N/A' ? 'N/A' : changeDateFormat(new Date(item.scheduledPayDate),"MMM-dd-yyyy hh:mm:ss A")}</td>
                        <td>${item.payDate == 'N/A' ? 'N/A' : changeDateFormat(new Date(item.payDate),"MMM-dd-yyyy hh:mm:ss A")}</td>`;
                        if (USER_ROLE == "DIRECTOR") {
                            if (item.paymentStatus === 'SUCCESS' || item.paymentStatus === 'REJECTED') {
                                html += `<td>N/A</td>`;
                            } else {
                                html += `<td>
                                    <button class="btn btn-sm btn-primary mr-1" style="font-size:10px;" onclick="showPaymentRemarksModal('${item.sprId}')">Approve/Reject Payment</button>
                                </td>`;
                            }
                        }
                        html += `</tr>`;
                    });
                }else{
                    html=`<tr>
                        <td colspan="14" class="text-center">No Data Found</td>
                    </tr>`
                }

                $("#paymentListTableBody").html(html);
                $("#schoolPaymentPaginationContainer").html(renderPagination(currentPagePaymentList, data.totalPages));
            }
        }
    });
}

function getSchoolPaymentReceipt(sprId) {
    let parentSchoolId = getSchoolSettingsOffice(SCHOOL_ID).parentSchoolId;
    var payloadObject = { sprId: sprId, "withStamp" : 'Y', 'parentSchoolId' : parentSchoolId};
    var encryptedPayload = encode(JSON.stringify(payloadObject));
    var url = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + `/dashboard/get-school-payment-receipt/${UNIQUEUUID}?payload=${encodeURIComponent(encryptedPayload)}`;
    window.open(url, '_blank');
}

function getStudentList(sprId) {     
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_ID + `/dashboard/get-students-payment-details?sprId=${sprId}`,
        dataType: 'json',
        success: function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                $("#studentListModal").modal('show');
                var html = '';
                $.each(data.studentsPaymentList, function(index, item){
                    html +=`<tr>
                        <td>${item.rollNo}</td>
                        <td>${item.studentName}</td>
                        <td>${item.gradeName}</td>
                        <td>${item.learningProgramName}</td>
                        <td>$${item.paymentAmount}</td>
                    </tr>`;
                })
                $("#studentListTableBody").html(html);
            }
        }
    });
}

function openPartnerPaymentModal(){
    let studentStandardIdAndAmount = getDataForConfirmAndPay();
    if(studentStandardIdAndAmount == null || studentStandardIdAndAmount == undefined || studentStandardIdAndAmount.length <= 0){
        showMessageTheme2(0, 'Please select the student for pay fee', '', true);
        return;
    }
    let requestData = {
        "userId" : USER_ID
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-partner-payment-getway-details'),
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                console.log(data);
                if($("#callPaymentPartnerModal").length > 0){
                    $("body #callPaymentPartnerModal").remove();
                }
                $("body").append(callPaymentPartnerModal(data));
                $("#callPaymentPartnerModal").modal('show');
            }
        }
    });
}

function showPaymentRemarksModal(sprId){
    if($("#paymentRemarksModal").length > 0){
        $("body #paymentRemarksModal").remove();
    }
    $("body").append(paymentRemarksModal(sprId));
    $("#paymentRemarksModal").modal('show');
}

function updatePaymentStatus(sprId){
    if($("#remarksStatus").val() == undefined || $("#remarksStatus").val() == ""){
        showMessageTheme2(2, "Select Remarks Status");
        return false;
    }
    if($("#remarks").val() == undefined || $("#remarks").val() == ""){
        showMessageTheme2(2, "Enter Remarks");
        return false;
    }
    var reqData = {
        userId: USER_ID,
        sprId: parseInt(sprId),
        status: $("#remarksStatus").val(),
        remarks: $("#remarks").val()
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'update-partner-school-payment-status'),
        data: JSON.stringify(reqData),
        dataType: 'json',
        async: false,
        global: false,
        success: function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                showMessageTheme2(1, "Payment Status Updated Successfully");
                $("#paymentRemarksModal").modal('hide');
                
                var newStatus = reqData.status;
		        var sprRow = $(`#payment-row-${sprId}`);

                let statusClass = '';
                if (newStatus === 'SUCCESS') statusClass = 'text-success';
                else if (newStatus === 'INITIATED') statusClass = 'text-warning';
                else if (newStatus === 'REJECTED') statusClass = 'text-danger';

                sprRow.find('td').eq(8).attr('class', `${statusClass} font-weight-bold`).text(newStatus);

                if (newStatus === 'SUCCESS') {
                    sprRow.find('td').eq(9).html(`<button class="btn btn-sm btn-primary" style="font-size:10px;" onclick="getSchoolPaymentReceipt('${sprId}')">View Receipt</button>`);
                } else {
                    sprRow.find('td').eq(9).html(`N/A`);
                }
                sprRow.find('td').eq(12).html(changeDateFormat(new Date(), "MMM-dd-yyyy hh:mm:ss A"));

                if (USER_ROLE === 'DIRECTOR') {
                    sprRow.find('td').eq(13).html('N/A');
                }
            }
        }
    });
}

let totalFee;
function getDataForConfirmAndPay(){
    totalFee = 0
    let selectedPayments = [];
    $("#studentFeesTableSearch tbody tr").each(function() {
        let row = $(this);
        if (row.find(".paymentCheck").is(":checked")) {
            let fee = row.find(".payAmount").val();
            let studentStandardId = row.find(".studentStandardId").val();
            if (fee) {
                selectedPayments.push({
                    studentStandardId: studentStandardId,
                    payAmount: fee
                });
                totalFee += Number(fee);
            }
        }
    });
    return selectedPayments;
}

function savePartnerTransferSubmit(formId, paymentGatewayType){
    let studentStandardIdAndAmount = getDataForConfirmAndPay();
    if(studentStandardIdAndAmount == null || studentStandardIdAndAmount == undefined || studentStandardIdAndAmount.length <= 0){
        showMessageTheme2(0, 'Please select the student for pay fee', '', true);
        return;
    }
    if(totalFee != Number($('.total-payable-cell').html())){
        showMessageTheme2(0, 'Something is wrong', '', true);
        return;
    }

    if(paymentGatewayType == "WIRETRANSFER"){
        if($("#referenceNumberWire").val() == ""){
            showMessageTheme2(0, 'Please fill the reference  number', '', true);
            return
        }
        if(bankTransferObj.length == 0){
            showMessageTheme2(0, 'Please upload proof of payment', '', true);
            return
        }
    }
    if(paymentGatewayType == "CASH"){
        if(cashTransferObj.length == 0){
            showMessageTheme2(0, 'Please upload proof of payment', '', true);
            return
        }
        if($("#referenceNumberCash").val() == ""){
            showMessageTheme2(0, 'Please fill the reference  number', '', true);
            return
        }
    }

    let requestData = {
        "userId" : USER_ID,
        "studentStandardIdAndAmount": studentStandardIdAndAmount,
        "totalFee": totalFee,
        "schoolId" : SCHOOL_ID,
        "paymentName":"Bulk Student Course Fee", // it will be dynamic
        "paymentVia": paymentGatewayType,
        "refrenceNumber": paymentGatewayType == "WIRETRANSFER" ? $("#referenceNumberWire").val() : $("#referenceNumberCash").val(),
        "attachments": paymentGatewayType == "WIRETRANSFER" ? bankTransferObj : cashTransferObj
    }

    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'payment-student-fee-to-is-school'),
        data: JSON.stringify(requestData),
        dataType: 'json',
        success: function(data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                    $("#callPaymentPartnerModal").modal('hide');
                    getPayStudentFeesDetais('searchStudentFees');
                }
            } else {
                showMessageTheme2(1, data['message'], '', true);
                $("#callPaymentPartnerModal").modal('hide');
                getPayStudentFeesDetais('searchStudentFees');
            }
        }
    });
}

var bankTransferObj = [];
var cashTransferObj = [];

function uploadDocsFun(src, uploadType) {
    var fileType = $(src).attr('fileType');
    var elemId = $(src).attr('elem-id');
    var file = src.files[0];

    if (file) {
        base64ImageFileAsURL(file, fileType, src, uploadType, elemId);
    }
}

function base64ImageFileAsURL(f, fileType, src, uploadType, elemId) {
    var reader = new FileReader();
    reader.onload = function (e) {
        var binaryData = e.target.result.split(',')[1];
        var uploadFlag = true;
        var isImage = /^image\/(png|jpe?g)$/i.test(f.type);
        var isPDF = /^application\/pdf$/i.test(f.type);

        if (!(isImage || isPDF)) {
            showMessageTheme2(2, 'Please upload files in following formats (jpg, jpeg, pdf or png).');
            return false;
        }

        if (f.size > 5.1 * 1024 * 1024) {
            showMessageTheme2(2, 'File size exceeds 5MB.');
            return false;
        }

        var obj = {
            fileName: f.name,
            fileType: fileType,
            fileContent: binaryData,
            mimeType: f.type,
        };

        if (uploadType === "partnerPaymentWire") {
            var index = getObjectIndex(bankTransferObj, fileType);
            if (index !== -1) bankTransferObj.splice(index, 1);
            bankTransferObj.push(obj);
        }
        if (uploadType === "partnerPaymentCash") {
            var index = getObjectIndex(cashTransferObj, fileType);
            if (index !== -1) cashTransferObj.splice(index, 1);
            cashTransferObj.push(obj);
        }

        // $("#fileName" + elemId).text(f.name).show();
        // validEndInvalidField(true, "fileName" + elemId);

        $("#divshowDocument" + elemId).show();
        $("#divdeleteDocument" + elemId).show();

        $("#showDocument" + elemId).off("click").on("click", function () {
            showDocument(obj);
        });

        $("#deleteDocument" + elemId).off("click").on("click", function () {
            deleteDocument(fileType, elemId, uploadType);
        });
    };
    reader.readAsDataURL(f);
}

function getObjectIndex(obj, fileType) {
    return obj.findIndex(item => item.fileType === fileType);
}

function deleteDocument(fileType, elemId, pgName) {
    if(pgName == "partnerPaymentWire"){
        const index = getObjectIndex(bankTransferObj, fileType);
        if (index !== -1) bankTransferObj.splice(index, 1);
    }
    if(pgName == "partnerPaymentCash"){
        const index = getObjectIndex(cashTransferObj, fileType);
        if (index !== -1) cashTransferObj.splice(index, 1);
    }

    // $("#fileName" + elemId).hide().text('');
    $("#divshowDocument" + elemId).hide();
    $("#divdeleteDocument" + elemId).hide();

    $("#fileupload" + elemId).val('');
}

function showDocument(fileObj) {
    if (!fileObj) {
        showMessageTheme2(0, 'No file to preview.');
        return;
    }

    const isPDF = /^application\/pdf$/i.test(fileObj.mimeType);
    const dataUrl = `data:${fileObj.mimeType};base64,${fileObj.fileContent}`;

    let content = '';
    if (isPDF) {
        const byteCharacters = atob(fileObj.fileContent);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
            const slice = byteCharacters.slice(i, i + 512);
            const byteNumbers = new Array(slice.length);
            for (let j = 0; j < slice.length; j++) {
                byteNumbers[j] = slice.charCodeAt(j);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }
    
        const blob = new Blob(byteArrays, { type: fileObj.mimeType });
        const blobUrl = URL.createObjectURL(blob);
        content = `<iframe src="${blobUrl}" width="100%" height="600px" frameborder="0"></iframe>`;
    } else {
        content = `<img src="${dataUrl}" alt="Preview" style="max-width: 100%; max-height: 600px;" />`;
    }
    if($("#documentPreviewModal").length > 0){
        $("body #documentPreviewModal").remove();
    }
    $("body").append(documentPreviewModal())
    $("#documentPreviewModal .modal-body").html(content);
    $("#documentPreviewModal").modal("show");
}

function resetPartner() {
    const $form = $("#paymentSeachForm");
    if ($form.length) {
        $form[0].reset();
    }
    $("#paymentDateFrom, #paymentDateTo").val('');
}

function getPartnerSchools(schoolId) {
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: BASE_URL + CONTEXT_PATH + SCHOOL_ID + `/dashboard/get-partner-schools?schoolId=${schoolId}`,
        dataType: 'json',
        success: function(data) {
            if (data['status'] === '0' || data['status'] === '2' || data['status'] === '3') {
                if (data['status'] === '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['message'], '', true);
                }
            } else {
                const partnerSchools = data.partnerSchoolsList || [];

                const $schoolSelect = $('#schoolName');
                const $partnerSelect = $('#partnerName');
                const $partnerNameSearch = $('#partnerNameSearch');

                if(partnerSchools.length == 1){
                    const item = partnerSchools[0];

                    $schoolSelect.empty().append(`<option value="${item.schoolId}">${item.schoolName}</option>`);
                    $schoolSelect.data('fullList', partnerSchools).val(item.schoolId).attr("disabled", true);

                    $partnerSelect.empty().append(`<option value="${item.partnerUserId}">${item.partnerName}</option>`);
                    $partnerSelect.val(item.partnerUserId);

                    $partnerNameSearch.empty().append(`<option value="${item.partnerUserId}">${item.partnerName}</option>`);
                    $partnerNameSearch.val(item.partnerUserId);
                }else{
                    $schoolSelect.empty().append(`<option value="ALL">Select School Name</option>`);
                    $partnerSelect.empty().append(`<option value="">Select Partner Name</option>`);
                    $partnerNameSearch.empty().append(`<option value="">Select Partner Name</option>`);

                    $schoolSelect.data('fullList', partnerSchools);

                    partnerSchools.forEach(item => {
                        $schoolSelect.append(`<option value="${item.schoolId}">${item.schoolName}</option>`);
                    });
                }
            }
        }
    });
}

function getPartnerOnSchoolId(src){
    const selectedSchoolId = $(src).val();
    const partnerSchools = $(src).data('fullList') || [];
    const $partnerSelect = $('#partnerName');
    const $partnerNameSearch = $('#partnerNameSearch');

    if (selectedSchoolId) {
        const matched = partnerSchools.filter(item => item.schoolId === selectedSchoolId);
        matched.forEach(item => {
            $partnerSelect.html(`<option value="${item.partnerUserId}">${item.partnerName}</option>`);
            $partnerNameSearch.html(`<option value="${item.partnerUserId}">${item.partnerName}</option>`);
        });
    }else{
        $partnerSelect.html(`<option value="">Select Partner Name</option>`);
        $partnerNameSearch.html(`<option value="">Select Partner Name</option>`);
    }
}