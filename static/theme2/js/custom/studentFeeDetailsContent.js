async function renderStudentFeeDetailsPage(){
    $('#dashboardContentInHTML').html(getStudentFeeDetailsContentWrapper());
    await studentFeeDetailsLoadData();
}

function getStudentFeeDetailsContentWrapper(){
    return `<div class="full mt-3" id="studentFeeDetailsWrapper">
        <div class="main-card mb-3">
            <div class="card rounded-15">
                <div class="card-body">
                    <div class="d-flex px-3 py-2 flex-wrap border rounded-top-left-10 rounded-top-right-10 align-items-center">
                        <h4 class="m-0 text-dark font-weight-semi-bold font-18">Fee Details</h4>
                    </div>
                    <div class="table-responsive">
                        ${getStudentFeeDetailsTableContent()}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

function getStudentFeeDetailsTableContent(){
    return `<table class="table font-12 nowrap dt-responsive border" id="studentFeeDetailsTable" style="width: 100%;margin-top:0 !important">
        <thead class="bg-primary text-white">
            <tr>
                <th class="pl-3">S.No</th>
                <th>Scheduled Date</th>
                <th>Grade</th>
                <th>Payment Name</th>
                <th>Paid Fee</th>
                <th>Paid Date</th>
                <th>Status</th>
                <th>View Receipt</th>
            </tr>
        </thead>
        <tbody id="studentFeeDetailsBody"></tbody>
    </table>`;
}

function getStudentFeeDetailsRowsHtml(row) {
    var html = '';
    var paymentList = row && row.details && row.details.userPaymentDetailsList ? row.details.userPaymentDetailsList : [];

    $.each(paymentList, function(index, userPayDetails) {
        html += `<tr>
            <td class="text-center">${index + 1}</td>
            <td>${userPayDetails.scheduledPayDate || ''}</td>
            <td>${userPayDetails.standardName || ''}</td>
            <td>${userPayDetails.paymentName || ''}</td>`;

        if (userPayDetails.paymentTransferType == 1) {
            html += `<td>${schoolSettingsTechnical.currencySymbol} ${userPayDetails.totalFeeWithMaterialFee}</td>`;
        } else {
            html += `<td>${schoolSettingsTechnical.currencySymbol} ${userPayDetails.totalFeeWithMaterialFee}</td>`;
        }

        if (!userPayDetails.payDate) {
            html += `<td>&nbsp;&nbsp;--</td>`;
        } else {
            html += `<td>${userPayDetails.payDate}</td>`;
        }

        if (userPayDetails.status === 'SUCCESS') {
            html += `<td style="color: #58D68D; font-weight: bold">${userPayDetails.status}</td>`;
        } else {
            html += `<td>${userPayDetails.status}</td>`;
        }

        if (userPayDetails.status === 'SUCCESS') {
            if (userPayDetails.paymentTitle === 'REGISTRATION_SUBJECT_FEE' || userPayDetails.paymentTitle !== 'REGISTRATION_SUBJECT_FEE') {
                if (roleAndModule.viewed === 'Y') {
                    html += `<td>
                        <a class="btn btn-outline-primary pl-2 pr-2" href="javascript:void(0)" onclick="callWithSession('${userPayDetails.recieptLink}')">View Receipt</a>
                    </td>`;
                } else {
                    html += `<td></td>`;
                }
            } else {
                html += `<td></td>`;
            }
        } else if (row.details.nextUserPaymentDetailsId === userPayDetails.id) {
            html += `<td>`;

            if (userPayDetails.status === 'INITIATED' && userPayDetails.pgName === 'CASH') {
                html += ``;
            } else if ((userPayDetails.status === 'PENDING' || userPayDetails.status === 'FAILURE' || userPayDetails.status === 'REJECTED')
                        && userPayDetails.paymentTitle !== 'EXTENSION_FEE'
                        && userPayDetails.paymentTitle !== 'BOOKSESSION_FEE') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Try Again</button>`;
            } else if (userPayDetails.status === 'INITIATED'
                        && (userPayDetails.paymentTransferType == 3 || userPayDetails.paymentTransferType == 0)
                        && userPayDetails.paymentTitle !== 'EXTENSION_FEE') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Try Again</button>`;
            } else if (userPayDetails.status === 'INITIATED' && userPayDetails.paymentTransferType != 3) {
                if (userPayDetails.pgName === 'CONVERA') {
                    html += `Payment in Process <button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Change Payment Method</button>`;
                }
                if (SCHOOL_ID == 5 && userPayDetails.pgName === 'WireTransfer') {
                    html += `Payment Under Process`;
                }
            } else if (userPayDetails.paymentTitle === 'BOOKSESSION_FEE' || userPayDetails.paymentTitle === 'EXTENSION_FEE') {
                html += ``;
            } else if (userPayDetails.paymentTitle === 'REGISTRATION_FEE_ADV') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Pay Now</button>`;
            } else {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Pay Now</button>`;
            }

            html += `</td>`;
        } else {
            html += `<td>`;

            if (userPayDetails.status === 'INITIATED' && userPayDetails.pgName === 'CASH') {
                html += ``;
            } else if ((userPayDetails.status === 'PENDING' || userPayDetails.status === 'FAILURE' || userPayDetails.status === 'REJECTED')
                        && userPayDetails.paymentTitle !== 'TEACHER REQUEST FEE'
                        && userPayDetails.paymentTitle !== 'BOOKSESSION_FEE') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Try Again</button>`;
            } else if (userPayDetails.status === 'INITIATED' && (userPayDetails.paymentTransferType == 3 || userPayDetails.paymentTransferType == 0)) {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" class="btn btn-primary">Try Again</button>`;
            }

            html += `</td>`;
        }

        html += `</tr>`;
    });

    if(!html){
        html = `<tr><td colspan="8" class="text-center">No fee details found</td></tr>`;
    }
    return html;
}
