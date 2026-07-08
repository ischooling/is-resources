async function renderParentFeeDetailsPage(){
    if(STUDENT_LIST.studentBasicDetails.length>0){
        $('#dashboardContentInHTML').html(getStudentTabSliderContent(STUDENT_LIST,'parentFeeDetailsRenderByStudent')+getParentFeeDetailsContentWrapper());
        parentFeeDetailsRenderByStudent(ACTIVE_STUDENT_ID);
        parentFeeDetailsOnLoadEvent();
    }else{
        showMessageTheme2(0, "No student found");
    }
    
}
function getParentFeeDetailsContentWrapper(){
    var html=
        `<div class="full" id="parentChildFeeDetailsWrapper">
            <div class="main-card mb-3">
                <div class="card rounded-15">
                    <div class="card-body">
                        <div class="d-flex px-3 py-2 flex-wrap border rounded-top-left-10 rounded-top-right-10 align-items-center">
                            <h4 class="m-0 text-dark font-weight-semi-bold font-18">Fee Details</h4>
                        </div>
                        <div class="table-responsive">
                            ${getParentFeeDetailsTableContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentFeeDetailsTableContent(){
    var html=
        `<table class="table font-12 nowrap dt-responsive border" id="parentFeeDetailsTable" style="width: 100%;margin-top:0 !important">
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
            <tbody id="parentFeeDetailsBody"></tbody>
        </table>`;
    return html;
}

// function getParentFeeDetailsRowsHtml(rows){
//     var rowsHtml = "";
//     $.each(rows || [], function(index, row){
//         var statusClass = (row.status || "").toUpperCase() === "SUCCESS" ? "text-success" : "text-dark";
        
//         rowsHtml += `
//             <tr>
//                 <td class="pl-3">${index + 1}</td>
//                 <td>${row.scheduledDate || "N/A"}</td>
//                 <td>${row.grade || "N/A"}</td>
//                 <td>${row.paymentName || "N/A"}</td>
//                 <td>${row.paidFee || "N/A"}</td>
//                 <td>${row.paidDate || "N/A"}</td>
//                 <td class="${statusClass}">${row.status || "N/A"}</td>
//                 <td>${getParentFeeDetailsReceiptBtn(row, schoolSettingsTechnical, roleAndModule, SCHOOL_ID)}</td>
//             </tr>`;
//     });

//     if(!rowsHtml){
//         rowsHtml = `<tr><td colspan="8" class="text-center">No fee details found</td></tr>`;
//     }
//     return rowsHtml;
// }

// function getParentFeeDetailsReceiptBtn(row){
//     if(!row.receiptUrl){
//         return `<button type="button" class="btn btn-outline-primary btn-sm" disabled>View Receipt</button>`;
//     }
//     return `<a href="${row.receiptUrl}" target="_blank" class="btn btn-outline-primary btn-sm">View Receipt</a>`;
// }


function getParentFeeDetailsRowsHtml(row) {
    var html = '';
    
    $.each(row.details.userPaymentDetailsList, function(index, userPayDetails) {
        var statusClass = (userPayDetails.status || "").toUpperCase() === "SUCCESS" ? "text-success" : "text-dark";
        html += `<tr>
            <td class="text-center">${index + 1}</td>
            
            <!-- Basic payment details -->
            <td>${userPayDetails.scheduledPayDate || ''}</td>
            <td>${userPayDetails.standardName || ''}</td>
            <td>${userPayDetails.paymentName || ''}</td>`;
        
        // Amount with currency (paymentTransferType condition)
        if (userPayDetails.paymentTransferType == 1) {
            html += `<td>${schoolSettingsTechnical.currencySymbol} ${userPayDetails.totalFeeWithMaterialFee}</td>`;
        } else {
            html += `<td>${schoolSettingsTechnical.currencySymbol} ${userPayDetails.totalFeeWithMaterialFee}</td>`;
        }
        
        // Pay date
        if (!userPayDetails.payDate) {
            html += `<td>&nbsp;&nbsp;--</td>`;
        } else {
            html += `<td>${parentFeeDetailsDisplayPaidDate(userPayDetails.payDate)}</td>`;
        }
        
        // Status with color for SUCCESS
        if (userPayDetails.status === 'SUCCESS') {
            var isDummyParentFeeRow = typeof window.isDummyParentDashboardMode === "function" && window.isDummyParentDashboardMode();
            html += `<td style="color: #58D68D; font-weight: bold">${isDummyParentFeeRow ? (userPayDetails.dummyStatusLabel || userPayDetails.status) : userPayDetails.status}</td>`;
        } else {
            html += `<td>${userPayDetails.status}</td>`;
        }
        
        // Action buttons based on status and conditions
        if (userPayDetails.status === 'SUCCESS') {
            // Success state - show receipt button
            if (userPayDetails.paymentTitle === 'REGISTRATION_SUBJECT_FEE' || 
                userPayDetails.paymentTitle !== 'REGISTRATION_SUBJECT_FEE') {
                
                if (roleAndModule.viewed === 'Y') {
                    html += `<td>
                        <a class="btn btn-outline-primary pl-2 pr-2" href="javascript:void(0)" 
                           onclick="callWithSession('${userPayDetails.recieptLink}')">View Receipt</a>
                    </td>`;
                } else {
                    html += `<td></td>`;
                }
            } else {
                html += `<td></td>`;
            }
            
        } else if (row.details.nextUserPaymentDetailsId === userPayDetails.id) {
            // Next payment to handle
            html += `<td class="${statusClass}">`;
            
            if (userPayDetails.status === 'INITIATED' && userPayDetails.pgName === 'CASH') {
                // Do nothing - empty cell
                html += ``;
                
            } else if ((userPayDetails.status === 'PENDING' || userPayDetails.status === 'FAILURE' || 
                       userPayDetails.status === 'REJECTED') && 
                       userPayDetails.paymentTitle !== 'EXTENSION_FEE' && 
                       userPayDetails.paymentTitle !== 'BOOKSESSION_FEE') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                class="btn btn-primary">Try Again</button>`;
                
            } else if (userPayDetails.status === 'INITIATED' && 
                      (userPayDetails.paymentTransferType == 3 || userPayDetails.paymentTransferType == 0) && 
                      userPayDetails.paymentTitle !== 'EXTENSION_FEE') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                class="btn btn-primary">Try Again</button>`;
                
            } else if (userPayDetails.status === 'INITIATED' && userPayDetails.paymentTransferType != 3) {
                if (userPayDetails.pgName === 'CONVERA') {
                    html += `Payment in Process 
                            <button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                    class="btn btn-primary">Change Payment Method</button>`;
                }
                if (SCHOOL_ID == 5 && userPayDetails.pgName === 'WireTransfer') {
                    html += `Payment Under Process`;
                }
                
            } else if (userPayDetails.paymentTitle === 'BOOKSESSION_FEE' || 
                      userPayDetails.paymentTitle === 'EXTENSION_FEE') {
                // Do nothing - empty cell
                html += ``;
                
            } else if (userPayDetails.paymentTitle === 'REGISTRATION_FEE_ADV') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                class="btn btn-primary">Pay Now</button>`;
                
            } else {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                class="btn btn-primary">Pay Now</button>`;
            }
            
            html += `</td>`;
            
        } else {
            // Other payment statuses
            html += `<td>`;
            
            if (userPayDetails.status === 'INITIATED' && userPayDetails.pgName === 'CASH') {
                // Do nothing - empty cell
                html += ``;
                
            } else if ((userPayDetails.status === 'PENDING' || userPayDetails.status === 'FAILURE' || 
                       userPayDetails.status === 'REJECTED') && 
                       userPayDetails.paymentTitle !== 'TEACHER REQUEST FEE' && 
                       userPayDetails.paymentTitle !== 'BOOKSESSION_FEE') {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                class="btn btn-primary">Try Again</button>`;
                
            } else if (userPayDetails.status === 'INITIATED' && 
                      (userPayDetails.paymentTransferType == 3 || userPayDetails.paymentTransferType == 0)) {
                html += `<button type="submit" onclick="checkPayment('paymentForm','${userPayDetails.id}','${SCHOOL_ID}');" 
                                class="btn btn-primary">Try Again</button>`;
            }
            
            html += `</td>`;
        }
        
        html += `</tr>`;
    });
    
    return html;
}

function parentFeeDetailsDisplayPaidDate(payDate) {
    if (typeof window.isDummyParentDashboardMode === "function" && window.isDummyParentDashboardMode()) {
        if (typeof moment === "function") {
            var parsedDate = moment(payDate, ["MMM DD, YYYY", "YYYY-MM-DD", "YYYY-MM-DD HH:mm:ss", moment.ISO_8601], true);
            if (parsedDate.isValid()) {
                return parsedDate.format("MMM DD, YYYY");
            }
        }
        var date = new Date(payDate);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
        }
    }
    return payDate;
}

// Usage example:
// generatePaymentRows(studentDueFeesDTO, schoolSettingsTechnical, roleAndModule, SCHOOL_ID);
