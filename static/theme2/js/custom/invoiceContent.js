function renderInvoiceContent(withStamp, onlyHtml, payId, isAddEdit) {
    var content = "";
    if (isAddEdit) {
      content += invoiceHeader() + invoiceEditorContent();
      $("#dashboardContentInHTMLAdditional").html(content);
      if (typeof refreshCustomFieldState === 'function') {
        setTimeout(function () {
          refreshCustomFieldState($('#invoiceFormContainer'));
        }, 0);
      }
    }else{
        content+=`<div id="invoicePreviewContainer"></div>`;
        content += showMessageTheme2Content() + getLoaderContent();
        $("#invoiceContentWrapper").html(content);
    }
    invoiceOnLoad(payId, isAddEdit);
}

function invoiceHeader(){
    var html=
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon">
                        <i class="fa fa-book text-primary"></i>
                    </div>
                    <div>Invoice</div>
                </div>
                <div class="page-title-actions">
                    <a href="javascript:void(0);" onclick="backToMain();isDiscountApplied=false;" class="btn btn-dark rounded"><i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back To Payment</a>
                </div>
            </div>
        </div>`;
    return html;
}

function invoiceEditorContent(){
    var html=
        `<div id="invoiceFormContainer" class="main-card my-3 card custom-field-scope">
            <div class="card-body">`;
                html+=invoiceFormContent()
                +invoiceItemsTableAndDescription()
            html+=`</div>
        </div>`;
    return html;
}

function invoiceFormContent(){
    var html=
        `<h4 class="mb-3 font-weight-bold">Invoice Editor</h4>
        <div class="d-flex justify-content-center flex-md-row flex-column" style="gap:8px;">
            <div class="col-md-4 rounded-10 border p-3">
                <h5 class="mb-3 font-weight-semi-bold">Invoice Meta</h5>
                <div class="form-group custom-field">
                    <input type="text" id="invoiceId" class="form-control" readonly value="" autocomplete="off" placeholder=" ">
                    <label>Invoice # (auto)<sup class="text-danger">*</sup></label>
                </div>
                <div class="form-group custom-field">
                    <input type="text" id="invoicePaymentTitle" class="form-control" value="" autocomplete="off" placeholder=" ">
                    <label>Payment Title<sup class="text-danger">*</sup></label>
                </div>
                <div class="form-group custom-field">
                    <input type="text" id="invoiceDate" class="form-control" readonly onkeydown="return false" autocomplete="off" placeholder=" ">
                    <label>Date<sup class="text-danger">*</sup></label>
                </div>
                ${/*<div class="form-group">
                    <label>Discount Code</label>
                    <input type="text" id="discountCode" class="form-control" value="">
                    <button class="btn btn-sm btn-outline-primary float-right mt-2" onclick="applyDiscount();">Apply Code</button>
                </div>*/''}

            </div>

            <div id="payerDetails" class="col-md-4 rounded-10 border p-3">
                <h5 class="mb-3 font-weight-semi-bold">To</h5>

                <input type="hidden" id="payerCountryData" value="" />
                <input type="hidden" id="payerCountryIsd" value="" />

                <div class="form-group custom-field">
                    <input type="text" id="payerName" class="form-control mb-2" placeholder=" " autocomplete="off">
                    <label for="payerName" class="form-label">Name<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <input type="email" id="payerEmail" class="form-control mb-2" placeholder=" " maxlength="100" onkeydown="return M.isEmail(event);" autocomplete="off">
                    <label for="payerEmail" class="form-label">Email<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <input type="text" id="payerPhone" class="form-control mb-2" style="padding-left: 64px !important;" placeholder=" " onkeydown="return M.digit(event);" maxlength="20" autocomplete="off">
                    <label for="payerPhone" class="form-label">Phone</label>
                </div>

                <div class="form-group custom-field">
                    <textarea id="payerAddress" class="form-control mb-2" placeholder=" "></textarea>
                    <label for="payerAddress" class="form-label">Address<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <select id="payerCountry" class="form-control mb-2">
                        <option value="0">Select Country</option>
                    </select>
                    <label for="payerCountry" class="form-label">Country<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <select id="payerState" class="form-control mb-2">
                        <option value="0">Select State</option>
                    </select>
                    <label for="payerState" class="form-label">State<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <select id="payerCity" class="form-control mb-2">
                        <option value="0">Select City</option>
                    </select>
                    <label for="payerCity" class="form-label">City<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <input type="text" id="payerPIN" class="form-control mb-2" placeholder=" " onkeydown="return M.digit(event);" maxlength="6" autocomplete="off">
                    <label for="payerPIN" class="form-label">PIN<sup class="text-danger">*</sup></label>
                </div>
            </div>

            <div id="recipientDetails" class="col-md-4 rounded-10 border p-3">
                <h5 class="mb-3 font-weight-semi-bold">For</h5>

                <input type="hidden" id="recipientCountryData" value="" />
                <input type="hidden" id="recipientCountryIsd" value="" />

                <div class="form-group custom-field">
                    <input type="text" id="recipientName" class="form-control mb-2" placeholder=" " autocomplete="off">
                    <label for="recipientName" class="form-label">Name<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <input type="email" id="recipientEmail" class="form-control mb-2" placeholder=" " maxlength="100" onkeydown="return M.isEmail(event);" autocomplete="off">
                    <label for="recipientEmail" class="form-label">Email</label>
                </div>

                <div class="form-group custom-field">
                    <input type="text" id="recipientPhone" class="form-control mb-2" style="padding-left: 64px !important;" placeholder=" " onkeydown="return M.digit(event);" maxlength="20" autocomplete="off">
                    <label for="recipientPhone" class="form-label">Phone</label>
                </div>

                <div class="form-group custom-field">
                    <textarea id="recipientAddress" class="form-control mb-2" placeholder=" "></textarea>
                    <label for="recipientAddress" class="form-label">Address<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <select id="recipientCountry" class="form-control mb-2">
                        <option value="0">Select Country</option>
                    </select>
                    <label for="recipientCountry" class="form-label">Country<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <select id="recipientState" class="form-control mb-2">
                        <option value="0">Select State</option>
                    </select>
                    <label for="recipientState" class="form-label">State<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <select id="recipientCity" class="form-control mb-2">
                        <option value="0">Select City</option>
                    </select>
                    <label for="recipientCity" class="form-label">City<sup class="text-danger">*</sup></label>
                </div>

                <div class="form-group custom-field">
                    <input type="text" id="recipientPIN" class="form-control mb-2" placeholder=" " onkeydown="return M.digit(event);" maxlength="6" autocomplete="off">
                    <label for="recipientPIN" class="form-label">PIN<sup class="text-danger">*</sup></label>
                </div>
            </div>
        </div>`
    return html;
}

function invoiceItemsTableAndDescription(){
    var html=
        `<div class="border rounded-10 p-3 mt-4">
            <div class="mt-4 mb-3 d-flex justify-content-between align-items-center">
                <h5 class="">Items</h5>
                <button class="btn btn-primary" onclick="addItem();">+ Add Item</button>
            </div>
            <table class="table table-bordered" id="itemsTable">
                <thead class="thead-light">
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <h6 class="text-right font-weight-semi-bold">Total: <span id="invoiceTotal">${currency} 0.00</span></h6>
        </div>
        
        <div class="rounded-10 p-3 border mt-4">
            <div class="form-group mt-3 custom-field">
                <textarea id="invoiceDescription" class="form-control" placeholder=" ">All fees are in US Dollars</textarea>
                <label>Description / Notes</label>
            </div>
        </div>
        
        <div id="invoiceButtonWrapper" class="my-3 float-right">
            <button class="btn btn-danger" onclick="resetInvoiceForm();">Reset</button>
            <button class="btn btn-success" onclick="saveInvoice();">Add Payment</button>
        </div>
       <div id="invoiceCopyButtonWrapper" class="flex-column flex-md-row align-items-start align-items-md-center my-3" style="display:none; gap:10px;">
            <p id="invoiceLinkPara" class="mb-2 mb-md-0 flex-grow-1" style="max-width:100%; overflow-x:auto; white-space:nowrap;"></p>
            <input type="text" value="" id="invoicePaymentLink" style="position:absolute; top:0; left:0; opacity:0;" />
            <div class="d-flex flex-column gap-2">
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-primary" style="width:150px;" onclick="copyURL('invoicePaymentLink', 'copy-msg-invoice');">Copy Payment Link</button>
                    <b class="copy-msg-invoice text-success"></b>
                </div>
                <a href="javascript:void(0);" onclick="backToMain();isDiscountApplied=false;" class="btn btn-danger rounded mt-2" style="width:150px;">Close</a>
            </div>
        </div>`
    return html;
}

function renderInvoicePreview(data) {
    var payerAddress=`${data.payer.addressLine || ''}, ${data.payer.cityName || ''}, ${data.payer.stateName || ''}, ${data.payer.countryName || ''} ${data.payer.pinCode || ''}`;
    var recipientAddress=`${data.payTo.addressLine || ''}, ${data.payTo.cityName || ''}, ${data.payTo.stateName || ''}, ${data.payTo.countryName || ''} ${data.payTo.pinCode || ''}`;
    var html=`
        <div class="invoice-preview padding-print" style="max-width:900px;margin:auto;font-family:Arial;">
           <div class="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start mb-2">
                <img src="${PATH_FOLDER_IMAGE2}is_logo_2026_blue.png" alt="Logo" style="max-width:250px;width: 100%; margin-right: auto; display: flex;">
                <div class="text-center text-md-right mt-2 mt-md-0">
                    <p>Date : ${data.invoiceDate}</p>
                    <p>Invoice No.: ${data.invoiceNo}</p>
                </div>
            </div>
            <div>
                <h4 class="font-weight-bold text-dark mb-3 text-center">${data.paymentStatus == "SCHEDULED" ? "Invoice" : "Fee Receipt"}</h4>
            </div>
            <div>
                <h4 class="font-weight-bold text-dark mb-4">${data.invoiceTitle}</h4>
            </div>
            <div class="d-flex flex-column flex-md-row justify-content-between mb-4" style="gap: 10px;">
                <div class="p-3 border rounded-10" style="max-width: 350px;width:100%;">
                    <p class="bg-primary mb-2 px-2 py-1 text-white w-fit-content rounded-10" style="margin-top:-30px;">To</p>
                    <h5><b>${data.payer.name}</b></h5>
                    <h6><b>${data.payer.email}</b></h6>`
                    if(data.payer.phone != ""){
                        html+=`<h6><b>+${data.payer.phone}</b></h6>`
                    }
                    html+=`<p>${payerAddress}</p>
                </div>
                <div class="p-3 border rounded-10" style="max-width:350px;width:100%;">
                    <p class="bg-danger mb-2 px-2 py-1 text-white w-fit-content rounded-10" style="margin-top:-30px;">For</p>
                    <h5><b>${data.payTo.name}</b></h5>
                    <h6><b>${data.payTo.email}</b></h6>`
                    if(data.payTo.phone != ""){
                        html+=`<h6><b>+${data.payTo.phone}</b></h6>`
                    }
                    html+=`<p>${recipientAddress}</p>
                </div>
            </div>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Rate</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items.map(item => `
                        <tr>
                            <td>${item.title}</td>
                            <td>USD ${item.rate}</td>
                            <td>${item.quantity}</td>
                            <td>USD ${item.amount}</td>
                        </tr>
                    `).join("")}
                    <tr>
                        <td colspan="3" class="text-right"><b>${data.discountAmount != null ? "Total after discount" : "Total"}</b></td>
                        <td><b>USD ${data.totalAmount - data.discountAmount}</b></td>
                    </tr>
                </tbody>
            </table>
            ${data.description != "" ?
                `<div class="mt-3 p-3 border rounded bg-light">
                    <b>Note:</b> ${data.description}
                </div>`
            :
                ``
            }
            <div>
                <p class="my-2">*All fees are strictly non-refundable, non-negotiable, and non-transferable under any circumstances.</p>
            </div>
        </div>`;
    return html;
}
