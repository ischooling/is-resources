function validateB2bBankDetails(callFrom) {
  if (callFrom == "fromModal" || callFrom == "fromContract") {
    if ($("#b2bBankDetailsForm #bicName").val() == "") {
      showMessageTheme2(0, "BIC name is required");
      return false;
    }
    if ($("#b2bBankDetailsForm #bankAddress").val() == "") {
      showMessageTheme2(0, "Bank address is required");
      return false;
    }
    if ($("#b2bBankDetailsForm #swiftCode").val() == "") {
      showMessageTheme2(0, "SWIFT code is required");
      return false;
    }
    if ($("#b2bBankDetailsForm #bankCode").val() == "") {
      showMessageTheme2(0, "Bank code is required");
      return false;
    }
    if ($("#b2bBankDetailsForm #branchCode").val() == "") {
      showMessageTheme2(0, "Branch code is required");
      return false;
    }
    if ($("#b2bBankDetailsForm #accountName").val() == "") {
      showMessageTheme2(0, "Account name is required");
      return false;
    }
    if ($("#b2bBankDetailsForm #accountNumber").val() == "") {
      showMessageTheme2(0, "Account number is required");
      return false;
    }
  }else if(callFrom == "fromProfile"){
    if ($("#bicNameB2b").val() == "") {
      showMessageTheme2(0, "BIC name is required");
      return false;
    }
    if ($("#bankAddressB2b").val() == "") {
      showMessageTheme2(0, "Bank address is required");
      return false;
    }
    if ($("#swiftCodeB2b").val() == "") {
      showMessageTheme2(0, "SWIFT code is required");
      return false;
    }
    if ($("#bankCodeB2b").val() == "") {
      showMessageTheme2(0, "Bank code is required");
      return false;
    }
    if ($("#branchCodeB2b").val() == "") {
      showMessageTheme2(0, "Branch code is required");
      return false;
    }
    if ($("#accountNameB2b").val() == "") {
      showMessageTheme2(0, "Account name is required");
      return false;
    }
    if ($("#accountNumberB2b").val() == "") {
      showMessageTheme2(0, "Account number is required");
      return false;
    }
  }
  return true;
}

async function saveB2bBankDetails(callFrom){
  if(!validateB2bBankDetails(callFrom)) return;
  var payload = {};
  payload['userId'] = USER_ID;
  if(callFrom == "fromContract"){
    payload['b2bLeadId'] = B2B_LEAD_ID;
  }
  if(callFrom == "fromModal" || callFrom == "fromContract"){
    payload['bicName'] = $("#b2bBankDetailsForm #bicName").val().trim();
    payload['bankAddress'] = $("#b2bBankDetailsForm #bankAddress").val().trim();
    payload['swiftCode'] = $("#b2bBankDetailsForm #swiftCode").val().trim();
    payload['bankCode'] = $("#b2bBankDetailsForm #bankCode").val().trim();
    payload['branchCode'] = $("#b2bBankDetailsForm #branchCode").val().trim();
    payload['accountName'] = $("#b2bBankDetailsForm #accountName").val().trim();
    payload['accountNumber'] = $("#b2bBankDetailsForm #accountNumber").val().trim();
  }else if(callFrom == "fromProfile"){
    payload['bicName'] = $("#bicNameB2b").val().trim();
    payload['bankAddress'] = $("#bankAddressB2b").val().trim();
    payload['swiftCode'] = $("#swiftCodeB2b").val().trim();
    payload['bankCode'] = $("#bankCodeB2b").val().trim();
    payload['branchCode'] = $("#branchCodeB2b").val().trim();
    payload['accountName'] = $("#accountNameB2b").val().trim();
    payload['accountNumber'] = $("#accountNumberB2b").val().trim();
  }
    var responseData = await getDashboardDataBasedUrlAndPayload(true, true, 'save-partner-bank-details', payload);
  if(responseData.status == "1"){
    showMessageTheme2(1, responseData.message);
    if(callFrom == "fromModal"){
      $("#b2bBankDetailsModal").modal("hide");
    }else if(callFrom == "fromProfile"){
      cancelBankDetailsUpdation();
      $("#bicNameLabel").text($("#bicNameB2b").val());
      $("#bankAddressLabel").text($("#bankAddressB2b").val());
      $("#swiftCodeLabel").text($("#swiftCodeB2b").val());
      $("#bankCodeLabel").text($("#bankCodeB2b").val());
      $("#branchCodeLabel").text($("#branchCodeB2b").val());
      $("#accountNameLabel").text($("#accountNameB2b").val());
      $("#accountNumberLabel").text($("#accountNumberB2b").val());
    }else if(callFrom == "fromContract"){
      $("#confirmationModalBank").modal('hide');
      addLaterBankDetails();
    }
  }
}