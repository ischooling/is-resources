var schoolSettingsTechnical;
var payIdAfterSave;
var isDiscountApplied = false;
var invoice = {
    invoiceNo: $("#invoiceId").val(),
    invoiceDate: $("#invoiceDate").val(),
    status: "",
    payer: {},
    payTo: {},
    items: [],
    schoolId: SCHOOL_ID,
    currency: "USD",
    description: "",
};
async function invoiceOnLoad(payId, isAddEdit){
    if(isAddEdit){
        $("#invoiceId").val(safeUUID());
        $("#invoiceDate").datepicker({
            autoclose: true,
            format: 'M d, yyyy',
            startDate: '-2d',
            todayHighlight: true
        }).datepicker("setDate", new Date());
        inputPayerContact = document.querySelector("#payerPhone");
        itiPayerContcat = window.intlTelInput(inputPayerContact);
        itiPayerContcat.setCountry('us');
        $('#payerCountryData').val(itiPayerContcat.getSelectedCountryData().iso2);
        $('#payerCountryIsd').val(itiPayerContcat.getSelectedCountryData().dialCode);
        inputPayerContact.addEventListener('countrychange', function(e) {
            $('#payerCountryData').val(itiPayerContcat.getSelectedCountryData().iso2);
            $('#payerCountryIsd').val(itiPayerContcat.getSelectedCountryData().dialCode);
        });
        inputRecipientContact = document.querySelector("#recipientPhone");
        itiRecipientContcat = window.intlTelInput(inputRecipientContact);
        itiRecipientContcat.setCountry('us');
        $('#recipientCountryData').val(itiRecipientContcat.getSelectedCountryData().iso2);
        $('#recipientCountryIsd').val(itiRecipientContcat.getSelectedCountryData().dialCode);
        inputRecipientContact.addEventListener('countrychange', function(e) {
            $('#recipientCountryData').val(itiRecipientContcat.getSelectedCountryData().iso2);
            $('#recipientCountryIsd').val(itiRecipientContcat.getSelectedCountryData().dialCode);
        });
        $("#payerCountry").select2({
            theme:"bootstrap4",
        });	
        $("#payerState").select2({
            theme:"bootstrap4",
        });
        $("#payerCity").select2({
            theme:"bootstrap4",
        });
        getAllCountryList('payerDetails','payerCountry');
        $("select#payerCountry").on("change",function(){
            callStates('payerDetails', this.value, 'payerCountry', 'payerState');
        });
        $("select#payerState").on("change",function(){
            callCities('payerDetails', this.value, 'payerState', 'payerCity');
        });
        $("#recipientCountry").select2({
            theme:"bootstrap4",
        });	
        $("#recipientState").select2({
            theme:"bootstrap4",
        });
        $("#recipientCity").select2({
            theme:"bootstrap4",
        });
        getAllCountryList('recipientDetails','recipientCountry');
        $("select#recipientCountry").on("change",function(){
            callStates('recipientDetails', this.value, 'recipientCountry', 'recipientState');
        });
            
        $("select#recipientState").on("change",function(){
            callCities('recipientDetails', this.value, 'recipientState', 'recipientCity');
        });
    }else{
        getInvoicePaymentDetails(payId);
    }
    schoolSettingsTechnical = await getSchoolSettingsTechnical(SCHOOL_ID);
}

function updateInvoiceObject() {
    invoice.invoiceNo = $("#invoiceId").val();
    invoice.invoiceTitle = $("#invoicePaymentTitle").val();
    invoice.invoiceDate = $("#invoiceDate").val();
    invoice.description = $("#invoiceDescription").val();
    if(isDiscountApplied){
        invoice.discountCode = $("#discountCode").val();
    }else{
        invoice.discountCode = null;
    }
    invoice.payer = {
        name: $("#payerName").val().trim(),
        email: $("#payerEmail").val().trim(),
        addressLine: $("#payerAddress").val().trim(),
        countryId: $("#payerCountry").val(),
        stateId: $("#payerState").val(),
        cityId: $("#payerCity").val(),
        pinCode: $("#payerPIN").val().trim(),
        phone: $("#payerPhone").val().trim() != "" 
          ? $("#payerCountryIsd").val() + "-" + $("#payerPhone").val().trim() 
          : ""
    };
      
    invoice.payTo = {
        name: $("#recipientName").val().trim(),
        email: $("#recipientEmail").val().trim(),
        addressLine: $("#recipientAddress").val().trim(),
        countryId: $("#recipientCountry").val(),
        stateId: $("#recipientState").val(),
        cityId: $("#recipientCity").val(),
        pinCode: $("#recipientPIN").val().trim(),
        phone: $("#recipientPhone").val().trim() != "" 
            ? $("#recipientCountryIsd").val() + "-" + $("#recipientPhone").val().trim() 
            : ""
    };
    invoice.items;
    // if(type == "save"){
        invoice.status = "SCHEDULED"
    // }else{
    //     invoice.status = "DRAFT"
    // }
    invoice.currency = schoolSettingsTechnical.currencyIsoCode;
    // invoice.payId = payIdAfterSave;
    calculateTotal();
    return invoice;
}

function addItem(title="", rate=100, quantity=1) {
    var index = invoice.items.length + 1;
    var row=`<tr>
      <td>${index}</td>
      <td><input type="text" class="form-control item-title" placeholder="Enter Title" value="${title}" oninput="syncItems();"></td>
      <td><input type="number" class="form-control item-rate" value="${rate}" oninput="validatePositive(this); syncItems();"></td>
      <td><input type="number" class="form-control item-quantity" value="${quantity}" oninput="validatePositive(this); syncItems();"></td>
      <td class="item-amount">${rate * quantity}</td>
      <td><button class="remove-item btn btn-sm btn-danger font-weight-semi-bold" onclick="removeItem(this)">Remove</button></td>
    </tr>`;
    $("#itemsTable tbody").append(row);
    syncItems();
}

function removeItem(el) {
    $(el).closest("tr").remove();
    syncItems();
}

function syncItems() {
    invoice.items = [];
    $("#itemsTable tbody tr").each(function(i) {
      var title = $(this).find(".item-title").val();
      var rate = parseFloat($(this).find(".item-rate").val()) || 0;
      var quantity = parseInt($(this).find(".item-quantity").val()) || 0;
      var amount = rate * quantity;
      $(this).find(".item-amount").text(amount);
      invoice.items.push({ title, rate, quantity });
      $(this).find("td:first").text(i+1);
    });
    calculateTotal();
}

function calculateTotal() {
    var total = 0;
    invoice.items.forEach(item => { total += item.rate*item.quantity; });
    invoice.total = total;
    $("#invoiceTotal").text(schoolSettingsTechnical.currencySymbol + " " + total);
}

function resetInvoiceForm() {
    invoice = {
        id: "",
        date: "",
        description: "",
        payer: {},
        recipient: {},
        items: [],
        total: 0
    };

    $("#invoiceId").val(safeUUID());
    $("#invoiceDate").datepicker("setDate", new Date());
    $("#invoiceDescription").val("");
    $("#discountCode").val("");

    $("#payerName, #payerEmail, #payerAddress, #payerPIN").val("");
    $("#payerCountry, #payerState, #payerCity").val("0").trigger("change");
    $("#payerPhone").val("");

    if (itiPayerContcat) {
        itiPayerContcat.setCountry("us");
        $('#payerCountryData').val(itiPayerContcat.getSelectedCountryData().iso2);
        $('#payerCountryIsd').val(itiPayerContcat.getSelectedCountryData().dialCode);
    }

    $("#recipientName, #recipientEmail, #recipientAddress, #recipientPIN").val("");
    $("#recipientCountry, #recipientState, #recipientCity").val("0").trigger("change");
    $("#recipientPhone").val("");

    if (itiRecipientContcat) {
        itiRecipientContcat.setCountry("us");
        $('#recipientCountryData').val(itiRecipientContcat.getSelectedCountryData().iso2);
        $('#recipientCountryIsd').val(itiRecipientContcat.getSelectedCountryData().dialCode);
    }

    $("#itemsTable tbody").empty();
    $("#invoiceTotal").text(`${currency} 0.00`);
}

function saveInvoice() {
    syncItems();
    if (validateInvoice() !== true) return;
    var payload = updateInvoiceObject();
    $.ajax({
        url: BASE_URL + CONTEXT_PATH + 'v1/invoice/create-invoice/'+ UNIQUEUUID,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        global: false,
        success: function (responseData) {
            var res = JSON.parse(responseData)
            if (res.status != "success") {
                showMessageTheme2(0, res.message);
            } else {
                isDiscountApplied = false;
                // if(type == 'save'){
                    showMessageTheme2(1, "Invoice saved successfully! You can copy the payment link now.");
                    $("#invoiceButtonWrapper").hide();
                    $("#invoiceCopyButtonWrapper").show();
                    $("#invoiceCopyButtonWrapper").addClass("d-flex");
                    var payloadObj = {
                        withStamp: "",
                        onlyHtml: "",
                        payId: res.payId
                    };
                    var payload = btoa(unescape(encodeURIComponent(JSON.stringify(payloadObj))));
                    var newUrl = BASE_URL + CONTEXT_PATH + SCHOOL_UUID + "/invoice/" + UNIQUEUUID + "?payload=" + payload;
                    $("#invoicePaymentLink").val(newUrl);
                    $("#invoiceLinkPara").text(newUrl);
                    // setTimeout(() => {
                    //     window.location.href = newUrl;
                    // }, 1000);
                // }else{
                //     payIdAfterSave = res.payId;
                //     showMessageTheme2(1, "Invoice saved successfully!");
                // }
            }
        },
        error: function (xhr, status, error) {
            showMessageTheme2(0, JSON.parse(xhr.responseText).message);
        }
    });
}

function validatePositive(input) {
    if (input.value < 0) {
      input.value = 0;
    }
}

function validateInvoice() {
    if (!$("#invoiceId").val()) return showMessageTheme2(0, "Invoice ID missing!");
    if (!$("#invoicePaymentTitle").val()) return showMessageTheme2(0, "Payment Title is required");
    if (!$("#invoiceDate").val()) return showMessageTheme2(0, "Invoice Date is required!");
    if ($("#discountCode").val() && !isDiscountApplied) return showMessageTheme2(0, "Please apply the discount code or clear the discount field");

    if (!$("#payerName").val().trim()) return showMessageTheme2(0, "Payer name is required!");
    if (!$("#payerEmail").val().trim()) return showMessageTheme2(0, "Payer email is required!");
    var emailPayer = $("#payerEmail").val().trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailPayer)) return showMessageTheme2(0, "Please enter a valid email address!");
    // if (!$("#payerPhone").val().trim()) return showMessageTheme2(0, "Payer phone is required!");
    if (!$("#payerAddress").val().trim()) return showMessageTheme2(0, "Payer address is required!");
    if ($("#payerCountry").val() == "0" || $("#payerCountry").val() == "") return showMessageTheme2(0, "Please select Payer Country!");
    if ($("#payerState").val() == "0" || $("#payerState").val() == "") return showMessageTheme2(0, "Please select Payer State!");
    if ($("#payerCity").val() == "0" || $("#payerCity").val() == "") return showMessageTheme2(0, "Please select Payer City!");
    if (!$("#payerPIN").val().trim()) return showMessageTheme2(0, "Payer PIN is required!");

    if (!$("#recipientName").val().trim()) return showMessageTheme2(0, "Recipient name is required!");
    // if (!$("#recipientEmail").val().trim()) return showMessageTheme2(0, "Recipient email is required!");
    // if (!$("#recipientPhone").val().trim()) return showMessageTheme2(0, "Recipient phone is required!");
    if (!$("#recipientAddress").val().trim()) return showMessageTheme2(0, "Recipient address is required!");
    if ($("#recipientCountry").val() == "0" || $("#recipientCountry").val() == "") return showMessageTheme2(0, "Please select Recipient Country!");
    if ($("#recipientState").val() == "0" || $("#recipientState").val() == "") return showMessageTheme2(0, "Please select Recipient State!");
    if ($("#recipientCity").val() == "0" || $("#recipientCity").val() == "") return showMessageTheme2(0, "Please select Recipient City!");
    if (!$("#recipientPIN").val().trim()) return showMessageTheme2(0, "Recipient PIN is required!");

    if (invoice.items.length === 0) return showMessageTheme2(0, "Please add at least one item!");
    for (var i = 0; i < invoice.items.length; i++) {
        var item = invoice.items[i];
        if (!item.title.trim()) return showMessageTheme2(0, `Item ${i+1}: Title is required!`);
        if (item.rate <= 0) return showMessageTheme2(0, `Item ${i+1}: Rate must be greater than 0!`);
        if (item.quantity <= 0) return showMessageTheme2(0, `Item ${i+1}: Quantity must be greater than 0!`);
    }

    return true;
}

function getInvoicePaymentDetails(payId){
    var payload = {
        withStamp: "",
        onlyHtml: "",
        payId
    }
    $.ajax({
        url: BASE_URL + CONTEXT_PATH + 'v1/invoice/get-payment-details',
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(payload),
        global: false,
        success: function (responseData) {
            if (responseData.status != "success") {
                showMessageTheme2(0, responseData.message);
            } else if(responseData.paymentStatus == "SCHEDULED" || responseData.paymentStatus == "PAID") {
                $("#invoicePreviewContainer").html(renderInvoicePreview(responseData));
                if(responseData.paymentStatus == "PAID"){
                    $("#payBtn").hide();
                    $("#printBtn").show();
                    $("#termsAndConditionUni").show();
                    $("#scheduledTerms").hide();
                    $("#paidTerms").show();
                }else{
                    $("#payBtn").show();
                    $("#printBtn").hide();
                    $("#termsAndConditionUni").hide();
                    $("#scheduledTerms").show();
                    $("#paidTerms").hide();
                }
            } else if (responseData.paymentStatus == "DRAFT") {
                payIdAfterSave = payId;
                $("#invoiceContentWrapper").append(invoiceEditorContent());
                $("#invoiceId").val(responseData.invoiceNo)
                $("#invoicePaymentTitle").val(responseData.invoiceTitle ?? "");
                $("#invoiceDate").datepicker({
                    autoclose: true,
                    format: 'M d, yyyy',
                    startDate: '-2d',
                    todayHighlight: true
                }).datepicker("setDate", new Date(responseData.invoiceDate));
                $("#discountCode").val(responseData.discountCode ?? "");

                $("#payerName").val(responseData.payer?.name ?? "");
                $("#payerEmail").val(responseData.payer?.email ?? "");
                $("#payerAddress").val(responseData.payer?.addressLine ?? "");
                $("#payerPIN").val(responseData.payer?.pinCode ?? "");
                inputPayerContact = document.querySelector("#payerPhone");
                itiPayerContcat = window.intlTelInput(inputPayerContact);
                var payerIsd = responseData?.payer?.phone?.split("-")[0].replace("+", "") || "1";
                var payerIso = getIsoFromIsd(payerIsd);
                itiPayerContcat.setCountry(payerIso);
                $('#payerCountryData').val(itiPayerContcat.getSelectedCountryData().iso2);
                $('#payerCountryIsd').val(itiPayerContcat.getSelectedCountryData().dialCode);
                inputPayerContact.addEventListener('countrychange', function(e) {
                    $('#payerCountryData').val(itiPayerContcat.getSelectedCountryData().iso2);
                    $('#payerCountryIsd').val(itiPayerContcat.getSelectedCountryData().dialCode);
                });
                $("#payerPhone").val(responseData.payer.phone.split("-")[1]);
            
                $("#recipientName").val(responseData.payTo?.name ?? "");
                $("#recipientEmail").val(responseData.payTo?.email ?? "");
                $("#recipientAddress").val(responseData.payTo?.addressLine ?? "");
                $("#recipientPIN").val(responseData.payTo?.pinCode ?? "");
                inputRecipientContact = document.querySelector("#recipientPhone");
                itiRecipientContcat = window.intlTelInput(inputRecipientContact);
                var recipientIsd = responseData?.payTo?.phone?.split("-")[0].replace("+", "") || "1";
                var recipientIso = getIsoFromIsd(recipientIsd);
                itiRecipientContcat.setCountry(recipientIso);
                $('#recipientCountryData').val(itiRecipientContcat.getSelectedCountryData().iso2);
                $('#recipientCountryIsd').val(itiRecipientContcat.getSelectedCountryData().dialCode);
                inputRecipientContact.addEventListener('countrychange', function(e) {
                    $('#recipientCountryData').val(itiRecipientContcat.getSelectedCountryData().iso2);
                    $('#recipientCountryIsd').val(itiRecipientContcat.getSelectedCountryData().dialCode);
                });
                $("#recipientPhone").val(responseData.payTo.phone.split("-")[1]);

                $("#payerCountry").select2({
                    theme:"bootstrap4",
                });	
                $("#payerState").select2({
                    theme:"bootstrap4",
                });
                $("#payerCity").select2({
                    theme:"bootstrap4",
                });
                getAllCountryList('payerDetails','payerCountry');
                $("select#payerCountry").on("change",function(){
                    callStates('payerDetails', this.value, 'payerCountry', 'payerState');
                });
                $("select#payerState").on("change",function(){
                    callCities('payerDetails', this.value, 'payerState', 'payerCity');
                });
                $("#recipientCountry").select2({
                    theme:"bootstrap4",
                });	
                $("#recipientState").select2({
                    theme:"bootstrap4",
                });
                $("#recipientCity").select2({
                    theme:"bootstrap4",
                });
                getAllCountryList('recipientDetails','recipientCountry');
                $("select#recipientCountry").on("change",function(){
                    callStates('recipientDetails', this.value, 'recipientCountry', 'recipientState');
                });
                    
                $("select#recipientState").on("change",function(){
                    callCities('recipientDetails', this.value, 'recipientState', 'recipientCity');
                });
                $("#payerCountry").val(responseData.payer.countryId).trigger("change");
                setTimeout(() => {
                    $("#payerState").val(responseData.payer.stateId).trigger("change");
                    setTimeout(() => {
                        $("#payerCity").val(responseData.payer.cityId).trigger("change");
                    }, 500);
                }, 500);
            
                $("#recipientCountry").val(responseData.payTo.countryId).trigger("change");
                setTimeout(() => {
                    $("#recipientState").val(responseData.payTo.stateId).trigger("change");
                    setTimeout(() => {
                        $("#recipientCity").val(responseData.payTo.cityId).trigger("change");
                    }, 500);
                }, 500);

                responseData.items.forEach(item => {
                    addItem(item.title, item.rate, item.quantity);
                });

                $("#invoiceDescription").val(responseData?.description);
            
            }
        },
        error: function (xhr, status, error) {
            showMessageTheme2(0, JSON.parse(xhr.responseText).message);
        }
    });
}

// function applyDiscount(){
//     if($("#discountCode").val() == ""){
//         showMessageTheme2(2, "Enter Discount Code");
//         return false;
//     }
//     var payload = {
//         code: $("#discountCode").val()
//     }
//     $.ajax({
//         url: BASE_URL + CONTEXT_PATH + 'v1/invoice/check-discount-code',
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(payload),
//         global: false,
//         success: function (responseData) {
//             var res = JSON.parse(responseData);
//             if (res.status != "success") {
//                 showMessageTheme2(0, res.message);
//             } else {
//                 showMessageTheme2(1, res.message);
//                 isDiscountApplied = true;
//             }
//         },
//         error: function (xhr, status, error) {
//             showMessageTheme2(0, JSON.parse(xhr.responseText).message);
//         }
//     });
// }