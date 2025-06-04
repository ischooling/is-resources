
function setpaymentDateFrom() {
    $('#paymentDateFrom').prop('disabled', false);
    $('#paymentDateFrom').datepicker({
        autoclose: true,
        format: 'mm-dd-yyyy',
    });
    $('#paymentDateFrom').datepicker('setDate', today);
}
function setpaymentDateTo() {
    $('#paymentDateTo').prop('disabled', false);
    $('#paymentDateTo').datepicker({
        autoclose: true,
        format: 'mm-dd-yyyy',
    });
    $('#paymentDateTo').datepicker('setDate', today);
}

function addCustomPayment() {
    $('.addPayment-wrapper').stop().slideToggle();
}
function advancePaymentSerch() {
    $('#advSerch').modal('show');
    $('#advancePaymentSearchForm #paymentType').html(getPaymentTitle('S',$('#allSchoolId').val()), '');

}
function sendmail(id) {
    var data = {
        'id': id
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'sendmail-for-advance-payment-for-second-time'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (responce) {
            if (responce['status'] == '0' || responce['status'] == '2' || responce['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, responce['message']);
                    } else {
                        showMessage(0, responce['message'], '', true);
                    }
                }
            } else {
                showMessage(1, responce['message'], '', true);
            }
        }
    });
}

function advancePaymentSearchStudent(formId, moduleId) {
    var dateFrom = $("#" + formId + " #paymentDateFrom").val();
    var dateTo = $("#" + formId + " #paymentDateTo").val();
    hideMessage('');
    if (dateFrom != "" && dateFrom != undefined) {
        if (dateTo == "" || dateTo == undefined) {
            showMessage(true, "Payment Date To field is mandatory if you choose a date from Payment Date From field.");
            return false;
        }
    }
    if (dateTo != "" && dateTo != undefined) {
        if (dateFrom == "" || dateFrom == undefined) {
            showMessage(true, "Payment Date From field is mandatory if you choose a date from Payment Date To field.");
            return false;
        }
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'advance-payment-search-content'),
        data: JSON.stringify(getCallRequestForAdvancePaymentSearchStudent(formId, moduleId)),
        dataType: 'json',
        async: false,
        success: function (data) {
            var elementId = 'advPaymentSearch';
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
                $('#' + elementId + ' tbody').html('')
            } else {
                // console.log(data.advancePaymentSearchResponseDTO.length)
                $('#advSerch').modal('hide');
                if (data.advancePaymentSearchResponseDTO != null && data.advancePaymentSearchResponseDTO != undefined && data.advancePaymentSearchResponseDTO.length > 0) {
                    //if(data.advancePaymentSearchResponseDTO.length > 0){
                        var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
                        if (isDataTable) {
                            $('#' + elementId).dataTable().fnDestroy();
                        }
                        $('#' + elementId + ' tbody').html(getAdvancePaymentSearchResult(formId, data));

                        var table = $('#' + elementId).DataTable();//{ "pagingType": "full" }
                        $("#autoWeeklyMailStudent").DataTable();
                        // table.on('page.dt', function () {
                        //     table.responsive.recalc();
                        // });
                    //}
                }else{
                    showMessage(false, data['message']);
                    $('#' + elementId + ' tbody').html('')
                }
            }
        }
    });
}

function getCallRequestForAdvancePaymentSearchStudent(formId, moduleId) {
    var requestPaymentSearch = {};
    var authentication = {};
    var advancePaymentSearchDTO = {};
    advancePaymentSearchDTO['moduleId'] = moduleId;
    advancePaymentSearchDTO['userRegistrationType'] = $("#" + formId + " #userRegistrationType").select2('val');
    advancePaymentSearchDTO['paymentType'] = $("#" + formId + " #paymentType").select2('val');
    advancePaymentSearchDTO['paymentVia'] = $("#" + formId + " #paymentVia").select2('val');
    if ($("#" + formId + " #paymentGateway").select2('val') != 'BLANK') {
        advancePaymentSearchDTO['paymentGateway'] = $("#" + formId + " #paymentGateway").select2('val');
    }

    advancePaymentSearchDTO['registrationType'] = $("#" + formId + " #registrationType").select2('val');
    advancePaymentSearchDTO['academicSession'] = $("#" + formId + " #academicSession").val();
    advancePaymentSearchDTO['gradeId'] = $("#" + formId + " #gradeId").select2('val');
    advancePaymentSearchDTO['enrollStatus'] = $("#" + formId + " #enrollStatus").val();
    advancePaymentSearchDTO['studentName'] = $("#" + formId + " #studentName").val().trim();
    advancePaymentSearchDTO['studentEmail'] = $("#" + formId + " #studentEmail").val().trim();
    advancePaymentSearchDTO['countryId'] = $("#" + formId + " #countryId").select2('val');
    var paymentMode = $("#" + formId + " #paymentMode").select2('val');
    for (var i = 0; i < paymentMode.length; i++) {
        if (paymentMode[i] === 'customized') {
            paymentMode.splice(i, 1);
            paymentMode.push('c_installment');
            paymentMode.push('c_annually');
        }
    }
    advancePaymentSearchDTO['paymentMode'] = paymentMode;
    //advancePaymentSearchDTO['paymentTitle'] = $("#"+formId+" #paymentTitle").val().trim();
    advancePaymentSearchDTO['transactionRefNumber'] = $("#" + formId + " #transactionRefNumber").val().trim();
    advancePaymentSearchDTO['userRefNumber'] = $("#" + formId + " #userRefNumber").val().trim();
    advancePaymentSearchDTO['paymentStatus'] = $("#" + formId + " #paymentStatus").select2('val');
    advancePaymentSearchDTO['paymentDateFrom'] = $("#" + formId + " #paymentDateFrom").val().trim();
    advancePaymentSearchDTO['paymentDateTo'] = $("#" + formId + " #paymentDateTo").val().trim();
    advancePaymentSearchDTO['sortBy'] = $("#" + formId + " #sortBy").select2('val');
    advancePaymentSearchDTO['orderBy'] = $("#" + formId + " #orderBy").select2('val');

    advancePaymentSearchDTO['startPosition'] = $("#" + formId + " #startPosition").val().trim();
    advancePaymentSearchDTO['numberOfRecords'] = $("#" + formId + " #numberOfRecords").val().trim();

    advancePaymentSearchDTO['schoolId'] = $("#" + formId + " #schoolId").select2('val');
    advancePaymentSearchDTO['studentStringId'] = $("#" + formId + " #studentId").val().trim();
    advancePaymentSearchDTO['schoolUUID'] = SCHOOL_UUID;

    requestPaymentSearch['advancePaymentSearchDTO'] = advancePaymentSearchDTO;
    authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
    authentication['userType'] = "SCHOOL";
    requestPaymentSearch['authentication'] = authentication;

    return requestPaymentSearch;

}

function advancePaymentSearchStudentReset(formId) {
    // $("#" + formId + " #academicSession").val('ALL').trigger('change');
    // $("#" + formId + " #schoolId").val(SCHOOL_ID).trigger('change');
    $("#" + formId + " #userRegistrationType").val('Registered').trigger('change');
    $("#" + formId + " #paymentType").val('').trigger('change');
    $("#" + formId + " #paymentVia").val('').trigger('change');
    $("#" + formId + " #paymentGateway").val('BLANK').trigger('change');
    $("#" + formId + " #gradeId").val('-1').trigger('change');
    $("#" + formId + " #registrationType").val('').trigger('change');
    $("#" + formId + " #enrollStatus").val('').trigger('change');
    $("#" + formId + " #studentName").val('');
    $("#" + formId + " #studentId").val('');
    $("#" + formId + " #studentEmail").val('');
    $("#" + formId + " #countryId").val('-1').trigger('change');
    $("#" + formId + " #paymentMode").val('').trigger('change');
    //	$("#"+formId+" #paymentTitle").val('');
    $("#" + formId + " #transactionRefNumber").val('');
    $("#" + formId + " #userRefNumber").val('');
    $("#" + formId + " #paymentStatus").val('').trigger('change');
    $("#" + formId + " #paymentDateFrom").val('');
    $("#" + formId + " #paymentDateTo").val('');
    $("#" + formId + " #sortBy").val('DESC').trigger('change');
    $("#" + formId + " #orderBy").val('PAY_DATE').trigger('change');

    $("#" + formId + " #startPosition").val('0');
    $("#" + formId + " #numberOfRecords").val('25');
}

function searchStudentByNameAndEmail() {
    // checkTextBox(formId);
    var searchName = $('#searchName').val().trim();
    var searchEmail = $('#searchEmail').val().trim();
    var schoolId = $('#schoolId').val();
    if(schoolId==''){
        schoolId=$('#allSchoolId').val();
    }
    var studentId = $('#studentId').val()

    var data = {
        'searchName': searchName,
        'searchEmail': searchEmail,
        'schoolId': schoolId,
        'studentId' : studentId
    }

    hideMessage('');
    if (searchName == '' && searchEmail == '' && studentId == '' ) {
        showMessage(true, 'To search desired user, required either name or email or student id');
        return false;
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'search-student'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                if (data.results.length > 0) {
                    var elementId = 'paymentTable';
                    var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
                    if (isDataTable) {
                        $('#' + elementId).dataTable().fnDestroy();
                    }
                    $('#' + elementId + ' tbody').html(getAddPaymentSearchResult(data));
                    var table = $('#' + elementId).DataTable();//{ "pagingType": "full" }
                    $('#' + elementId).on('page.dt', function () {
                        table.responsive.recalc();
                    });
                }
            }
        }
    });
}

function addExternalPayment(formId) {
    hideMessage('');
    $('#addPaymentModal').modal('show');
    $('.hideWhenlearningProgramFlexy').show();
    $('#copyViewPaymentUrlElement, #viewPaymentUrlElementWrapper').hide();
    $('#' + formId + ' #studentDetailsForPaymentId').show();
    $('#' + formId + ' #studentEmail1').prop('disabled', false);
    $('#' + formId + ' #studentEmail1').val('')
    $('#' + formId + ' #studentName1').prop('disabled', false);
    $('#' + formId + ' #studentName1').val('')
    $('#' + formId + ' #learningProgram1').prop('disabled', false);
    $('#' + formId + ' #learningProgram1').val('').trigger('change')
    $('#' + formId + ' #standardId1').prop('disabled', false);
    $('#' + formId + ' #standardId1').val('').trigger('change');
    $('#' + formId + ' #payableAmount').val('');
    $('#' + formId + ' #status1').val('0').trigger('change');
    $('#' + formId + ' #scheduleDate1').val('').datepicker("update");
    $('#' + formId + ' #paymentDate1').val('').datepicker("update");
    $('#' + formId + ' #paymentType1').html(getPaymentTitle('AE',$('#allSchoolId').val(), 'REGISTRATION_FEE'));
    $('#' + formId + ' #paymentName1').val('Reserve an Enrollment Seat');
    $('#' + formId + ' #paymentName1').prop('disabled',true);
    $('#addStudentPaymentbtn').show();
    // $('#studentEmail1').prop('onblur','getStudentDetailsForPayment(\'addStudentPaymentForm\',\'true\')');
    if ($("#descriptionDiv").next().length < 1) {
        initEditor(1, 'descriptionDiv', 'Put description if any', false);
    }
    editor1.setData('Reserve an Enrollment Seat');
}

function addPayment(formId, userNameOrEmail, studentStandardId, paymentType, paymentNameFlag, marksPublished) {
    hideMessage('');
    $('#addPaymentModal').modal('show');
    $("#addStudentPaymentbtn").show();
    $("#closePaymentModal").show();
    $("#copyViewPaymentUrlElement").hide();
    $("#viewPaymentUrlElementWrapper").hide();
    $('#' + formId + ' #studentEmail1').val(userNameOrEmail);
    $('#' + formId + ' #studentStandardId').val(studentStandardId);
    $('#' + formId + ' #studentDetailsForPaymentId').hide();
    $('#' + formId + ' #studentEmail1').prop('disabled', true);
    $('#' + formId + ' #studentName1').prop('disabled', true);
    $('#' + formId + ' #learningProgram1').prop('disabled', true);
    // if($('#' + formId + ' #learningProgram1 option[value=\'ONE_TO_ONE_FLEX\']').length < 1){
    //     $('#' + formId + ' #learningProgram1').append('<option value="ONE_TO_ONE_FLEX">Flexy Learning Program</option>');
    //     $("#addPaymentModal #learningProgram1").select2("destroy").select2({
    //         placeholder: "Select an option",
	// 		dropdownParent:"#addPaymentModal .modal-body",
	// 		minimumResultsForSearch:Infinity
    //     });
    // }
    
    $('#' + formId + ' #standardId1').prop('disabled', true);
    $('#' + formId + ' #payableAmount').val('');
    $('#' + formId + ' #status1').val('0').trigger('change');
    $('#' + formId + ' #scheduleDate1').val('').datepicker("update");
    $('#' + formId + ' #paymentDate1').val('').datepicker("update");
    $('#' + formId + ' #paymentType1').html(getPaymentTitle('A',$('#allSchoolId').val(),'', paymentType, marksPublished), '');
    if(paymentNameFlag){
        $('#' + formId + ' #paymentName1').val('');
        $('#' + formId + ' #paymentName1').prop('disabled',false);
    }
    $('#addStudentPaymentbtn').show();
    // $('#studentEmail1').prop('onblur','getStudentDetailsForPayment(\'addStudentPaymentForm\',\'true\')');
    
    getStudentDetailsForPayment(formId, false);
    if ($("#descriptionDiv").next().length < 1) {
        initEditor(1, 'descriptionDiv', 'Put description if any', false);
    }

}
function getStudentDetailsForPayment(formId, needToShowMessage) {
    hideMessage('');
    var userNameOrEmail = $('#' + formId + ' #studentEmail1').val().trim();
    if (userNameOrEmail == '') {
        return false;
    }
    var data = {
        'userNameOrEmail': userNameOrEmail,
        'schoolId': SCHOOL_ID
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-student-for-payment'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            $('#' + formId + ' #studentName1').val('');
            $('#' + formId + ' #learningProgram1').val('').trigger('change');
            $('#' + formId + ' #standardId1').val('').trigger('change');
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
                $('#addStudentPaymentbtn').show();
            } else {
                if (needToShowMessage) {
                    $('#addStudentPaymentbtn').hide();
                    showMessage(true, 'User is already registered, kindly search and add the payment');
                } else {
                    var userData = data['userData'];
                    if (userData['studentName'] != '') {
                        $('#' + formId + ' #studentName1').val(userData['studentName']);
                    } else {
                        $('#' + formId + ' #studentName1').prop('disabled', false);
                    }
                    $('#' + formId + ' #paymentAlternateName').html(userData['standardName']);
                    if (userData['registrationType'] != '') {
                        $('#' + formId + ' #learningProgram1').val(userData['registrationType']).trigger('change');
                        if(userData['registrationType'] == 'ONE_TO_ONE_FLEX'){
                            $('.hideWhenlearningProgramFlexy').hide();
                        }else{
                            $('.hideWhenlearningProgramFlexy').show();
                        }
                        
                    } else {
                        $('#' + formId + ' #learningProgram1').prop('disabled', false);
                        
                    }
                    if (userData['gradeId'] != '') {
                        $('#' + formId + ' #standardId1').val(userData['gradeId']).trigger('change');
                    } else {
                        $('#' + formId + ' #standardId1').prop('disabled', false);
                    }
                }
            }
            return false;
        }
    });
}

function addStudentPayment(formId, moduleId) {
    var studentEmail = $("#" + formId + " #studentEmail1").val();
    if (studentEmail == null || studentEmail == undefined || studentEmail == '') {
        showMessage(true, "Email is mandatory.");
        return false;
    }
    var studentName = $("#" + formId + " #studentName1").val();
    if (studentName == null || studentName == undefined || studentName == '') {
        showMessage(true, "Student name is mandatory.");
        return false;
    }
    var learningProgram = $("#" + formId + " #learningProgram1").val();
    if (learningProgram == null || learningProgram == undefined || learningProgram == '') {
        showMessage(true, "Learning Program is mandatory.");
        return false;
    }
    if(learningProgram != "ONE_TO_ONE_FLEX"){
        var grade = $("#" + formId + " #standardId1").val();
        if (grade == null || grade == undefined || grade == '') {
            showMessage(true, "Grade is mandatory.");
            return false;
        }
    }
    var paymentTitle = $("#" + formId + " #paymentType1").val();
    if (paymentTitle == null || paymentTitle == undefined || paymentTitle == '') {
        showMessage(true, "Payment Title is mandatory.");
        return false;
    }
    var paymentName1 = $("#" + formId + " #paymentName1").val();
    if (paymentName1 == '') {
        var installmentNumber1 = $("#" + formId + " #installmentNumber1").val();
        var numberOfMonth1 = $("#" + formId + " #numberOfMonth1").val();
        if (installmentNumber1 == undefined || installmentNumber1 == '' || numberOfMonth1 == undefined || numberOfMonth1 == '') {
            showMessage(true, "Payment Name is mandatory.");
            return false;
        }
    }
    /*
    var userRefNumber =$("#"+formId+" #userRefNumber1").val();
    if(userRefNumber  == ""){
        showMessage(true,"Enter User Reference Number");
        return false;
    }
    */
    var payableAmount = $("#" + formId + " #payableAmount").val();
    // var regAmount = $("#" + formId + " #registrationAmount").val();
    // if (paymentTitle == "REGISTRATION_FEE" || paymentTitle == "REGISTRATION_FEE_ADV") {
    //     if (regAmount == 0) {
    //         showMessage(true, "Registration Fee is a mandatory field!");
    //         return false;
    //     }
    // } else {
    if (payableAmount == 0) {
        showMessage(true, "Pay Fee can not be zero.");
        return false;
    }
    // }
    // var additionalAmount =$("#"+formId+" #additionalAmount").val();
    var currency1 = $("#" + formId + " #currency1").val();
    if (currency1 == "0" || currency1 == "" || currency1 == undefined) {
        showMessage(true, "Choose the currency in which the payment is being done.");
        return false;
    }
    // var paymentGateway1 =$("#"+formId+" #paymentGateway1").val();
    var paymentDate = $("#" + formId + " #paymentDate1").val();
    var scheduleDate = $("#" + formId + " #scheduleDate1").val();
    var status = $("#" + formId + " #status1").val();
    if (status == "SUCCESS") {
        if (paymentDate == "" || paymentDate == undefined) {
            showMessage(true, "Payment Date is a mandatory field.");
            return false;
        }
    }
    if (scheduleDate == "" || scheduleDate == undefined) {
        showMessage(true, "Please Enter the scheduled payment date.");
        return false;
    }
    // if (status == "SCHEDULED") {
    //     if (paymentTitle == "REGISTRATION_FEE" || paymentTitle == "REGISTRATION_FEE_ADV") {
    //     } else {
    //         if (scheduleDate == "" || scheduleDate == undefined) {
    //             showMessage(true, "Please Enter the scheduled payment date.");
    //             return false;
    //         }
    //     }
    // }
    if (status == "INITIATED") {
        if (paymentDate == "" || paymentDate == undefined) {
            showMessage(true, "Please Enter the payment date.");
            return false;
        }
    }
    if (status == "0" || status == "" || status == undefined) {
        showMessage(true, "Please select the Payment Status.");
        return false;
    }
    /*
    var transactionNumber =$("#"+formId+" #transactionNumber").val();
    if(transactionNumber=="" && status!='SCHEDULED'){
        showMessage(true,"Please enter the transaction number.");
        return false;
    }
    */
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'save-payment'),
        data: JSON.stringify(getRequestDataForAddPaymentDetails(formId, moduleId)),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                $("#viewPaymentUrlElementWrapper").show();
                $("#viewPaymentUrlElement").attr("value",data['message']);
                $("#closePaymentModal").hide();
                $("#addStudentPaymentbtn").hide();
                $("#copyViewPaymentUrlElement").show();
                showMessage(1, "Payment Created");
                // if(roleAndModule.viewed=='Y'){
                //     window.setTimeout(function () {
                //         advancePaymentSearchStudentReset('advancePaymentSearchForm');
                //         $('#advancePaymentSearchForm #studentEmail').val($('#searchEmail').val())
                //         $('#advancePaymentSearchForm #studentName').val($('#searchName').val())
                //         $('#advSearchSubmitButtion').trigger('click');
                //     }, 800)
                // }else if(roleAndModule.added=='Y'){
                //     $("#viewPaymentUrlElementWrapper").show();
                //     $("#viewPaymentUrlElement").attr("value",data['message']);
                //     $("#closePaymentModal").hide();
                //     $("#copyViewPaymentUrlElement").show();
                // }
                
                return false;
            }
        }
    });


}

function getRequestDataForAddPaymentDetails(formId, moduleId) {
    var editPaymentRequest = {};
    var authentication = {};
    var addPaymentDTO = {};
    //	addPaymentDTO['userId'] = $("#"+formId+" #userIdSearch").val().trim();
    //	addPaymentDTO['standardId'] = $("#"+formId+" #standardIdSearch").val().trim();
    if ($("#" + formId + " #studentStandardId").val() == '') {
        addPaymentDTO['studentEmail'] = $("#" + formId + " #studentEmail1").val();
        addPaymentDTO['studentName'] = $("#" + formId + " #studentName1").val();
        addPaymentDTO['learningProgram'] = $("#" + formId + " #learningProgram1").select2('val');
        addPaymentDTO['standardId'] = $("#" + formId + " #standardId1").select2('val');
    } else {
        addPaymentDTO['studentStandardId'] = $("#" + formId + " #studentStandardId").val().trim();
        addPaymentDTO['studentEmail'] = $("#" + formId + " #studentEmail1").val();
        addPaymentDTO['studentName'] = $("#" + formId + " #studentName1").val();
        addPaymentDTO['learningProgram'] = $("#" + formId + " #learningProgram1").select2('val');
        addPaymentDTO['standardId'] = $("#" + formId + " #standardId1").select2('val');
    }
    addPaymentDTO['paymentTitle'] = $("#" + formId + " #paymentType1").select2('val');
    addPaymentDTO['paymentName'] = $("#" + formId + " #paymentName1").val().trim();
    addPaymentDTO['installmentNumber'] = $("#" + formId + " #installmentNumber1").val().trim();
    if ($("#" + formId + " #numberOfMonth1").length > 0) {
        addPaymentDTO['numberOfMonth'] = $("#" + formId + " #numberOfMonth1").val().trim();
    }
    addPaymentDTO['referenceNumber'] = $("#" + formId + " #userRefNumber1").val().trim();
    addPaymentDTO['payableAmount'] = $("#" + formId + " #payableAmount").val().trim();
    // addPaymentDTO['additionalAmount'] = $("#" + formId + " #additionalAmount").val().trim();
    addPaymentDTO['currency'] = $("#" + formId + " #currency1").select2('val');
    addPaymentDTO['paymentGateway'] = $("#" + formId + " #paymentGateway1").select2('val');
    addPaymentDTO['status'] = $("#" + formId + " #status1").select2('val');
    addPaymentDTO['paymentDate'] = $("#" + formId + " #paymentDate1").val().trim();
    addPaymentDTO['scheduleDate'] = $("#" + formId + " #scheduleDate1").val().trim();
    addPaymentDTO['transactionNumber'] = $("#" + formId + " #transactionNumber").val().trim();
    addPaymentDTO['schoolId'] = SCHOOL_ID;
    if (editor1 != undefined) {
        addPaymentDTO['description'] = escapeCharacters(editor1.getData());
    }
    editPaymentRequest['addPaymentDTO'] = addPaymentDTO;
    authentication['hash'] = getHash();
    // authentication['userType'] = "SCHOOL";
    authentication['schoolId'] = SCHOOL_ID;
    authentication['schoolUUID'] = SCHOOL_UUID;
    editPaymentRequest['authentication'] = authentication;
    return editPaymentRequest;
}

function editStudentPayment(formId, moduleId) {
    var paymentTitle = $("#" + formId + " #paymentType2").val();
    if (paymentTitle == "" || paymentTitle == undefined) {
        showMessage(true, "Payment Title is mandatory.");
        return false;
    }
    var paymentName2 = $("#" + formId + " #paymentName2").val();
    if (paymentName2 == '') {
        var installmentNumber2 = $("#" + formId + " #installmentNumber2").val();
        var numberOfMonth2 = $("#" + formId + " #numberOfMonth2").val();
        if (installmentNumber2 == undefined || installmentNumber2 == '' || numberOfMonth2 == undefined || numberOfMonth2 == '') {
            showMessage(true, "Payment Name is mandatory.");
            return false;
        }
    }
    var userRefNumber = $("#" + formId + " #userRefNumber2").val();
    if (userRefNumber == "") {
        showMessage(true, "Enter User Reference Number");
        return false;
    }
    var payableAmount = $("#" + formId + " #payableAmount2").val();
    if (payableAmount == 0) {
        showMessage(true, "Pay Amount can not be zero.");
        return false;
    }
    var currency2 = $("#" + formId + " #currency2").val();
    if (currency2 == undefined || currency2 == "0" || currency2 == "") {
        showMessage(true, "Choose the currency in which the payment is being done.");
        return false;
    }
    var status = $("#" + formId + " #status2").val();
    if (status == undefined || status == "0" || status == "") {
        showMessage(true, "Please select the Payment Status.");
        return false;
    }
    var paymentDate = $("#" + formId + " #paymentDate2").val();
    var scheduleDate = $("#" + formId + " #scheduleDate2").val();
    if (status == "SUCCESS") {
        if (paymentDate == "" || paymentDate == undefined) {
            showMessage(true, "Payment Date is a mandatory field.");
            return false;
        }
    }
    if (status == "SCHEDULED") {
        if (scheduleDate == "" || scheduleDate == undefined) {
            showMessage(true, "Please Enter the scheduled payment date.");
            return false;
        }
    }
    // if(status=="INITIATED"){
    // 	if(paymentDate =="" || paymentDate == undefined){
    // 		showMessage(true,"Please Enter the payment date.");
    // 		return false;
    // 	}
    // }
    var transactionNumber = $("#" + formId + " #transactionNumber2").val();
    if (transactionNumber == "" && status != "SCHEDULED") {
        showMessage(true, "Please enter the transaction number.");
        return false;
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'edit-payment'),
        data: JSON.stringify(getRequestDataForEditPaymentDetails(formId, moduleId)),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                showMessage(true, data['message']);
                $('#editPaymentModal').modal('hide');
                window.setTimeout(function () {
                    hideMessage('')
                }, 500)
                window.setTimeout(function () {
                    hideMessage('')
                    $('#advSearchSubmitButtion').trigger('click');
                }, 800)
            }
            return false;
        }
    });
}

function getRequestDataForEditPaymentDetails(formId, moduleId) {
    var editPaymentRequest = {};
    var authentication = {};
    var addPaymentDTO = {};
    addPaymentDTO['userId'] = $("#" + formId + " #userIdSearch").val().trim()
    addPaymentDTO['paymentTitle'] = $("#" + formId + " #paymentType2").select2('val');
    addPaymentDTO['paymentName'] = $("#" + formId + " #paymentName2").val().trim();
    addPaymentDTO['installmentNumber'] = $("#" + formId + " #installmentNumber2").val().trim();
    if ($("#" + formId + " #numberOfMonth2").length > 0) {
        addPaymentDTO['numberOfMonth'] = $("#" + formId + " #numberOfMonth2").val().trim();
    }
    addPaymentDTO['referenceNumber'] = $("#" + formId + " #userRefNumber2").val().trim();
    addPaymentDTO['payableAmount'] = $("#" + formId + " #payableAmount2").val().trim();
    // addPaymentDTO['registrationAmount'] = $("#" + formId + " #registrationAmount2").val().trim();
    addPaymentDTO['additionalAmount'] = $("#" + formId + " #additionalAmount2").val().trim();
    addPaymentDTO['currency'] = $("#" + formId + " #currency2").select2('val');
    addPaymentDTO['paymentGateway'] = $("#" + formId + " #paymentGateway2").select2('val');
    addPaymentDTO['status'] = $("#" + formId + " #status2").select2('val');
    addPaymentDTO['paymentDate'] = $("#" + formId + " #paymentDate2").val().trim();
    addPaymentDTO['scheduleDate'] = $("#" + formId + " #scheduleDate2").val().trim();
    addPaymentDTO['transactionNumber'] = $("#" + formId + " #transactionNumber2").val().trim();
    addPaymentDTO['id'] = $("#" + formId + " #userPayId").val().trim();
    if (editor1 != undefined) {
        addPaymentDTO['description'] = escapeCharacters(editor1.getData());
    }
    addPaymentDTO['schoolId'] = SCHOOL_ID;
    editPaymentRequest['addPaymentDTO'] = addPaymentDTO;
    authentication['hash'] = getHash();
    // authentication['userType'] = "SCHOOL";
    authentication['schoolId'] = SCHOOL_ID;
    authentication['schoolUUID'] = SCHOOL_UUID;
    editPaymentRequest['authentication'] = authentication;
    return editPaymentRequest;
}

function showPaymentPopup(id,controlType) {
    var data = { "id": id };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'get-user-payment'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                $('#showEditPopupContainer').html(editPaymentContent(roleAndModule.moduleId, data.userPaymentDetails,controlType,data.standardName));
                $('#editPaymentModal').modal({
                    backdrop: 'static',
                    keyboard: false,
                });
                $("#paymentType2").select2().val(data.userPaymentDetails.paymentTitle).trigger('change');
                $("#status2").select2().val(data.userPaymentDetails.status).trigger('change');
                $("#currency2").select2().val(data.userPaymentDetails.selectedCurrency).trigger('change');
                $("#paymentGateway2").select2().val(data.userPaymentDetails.pgName).trigger('change');
                initEditor(1, 'descriptionDivBox', 'Put description if any', false);
                $("#paymentDate2").datepicker({
                    autoclose: true,
                    endDate: new Date(),
                    format: 'mm-dd-yyyy',
                });
                if (null != data.userPaymentDetails.payDate && '' != data.userPaymentDetails.payDate) {
                    var dob1 = data.userPaymentDetails.payDate.split("-");
                    var dob2 = new Date(parseInt(dob1[0]), parseInt(dob1[1]) - 1, parseInt(dob1[2]));
                    $("#paymentDate2").datepicker().datepicker("setDate", dob2);
                }
                $("#scheduleDate2").datepicker({
                    autoclose: true,
                    //endDate: new Date(),
                    format: 'mm-dd-yyyy',
                });
                if (null != data.userPaymentDetails.scheduledPayDate && '' != data.userPaymentDetails.scheduledPayDate) {
                    var dob1 = data.userPaymentDetails.scheduledPayDate.split("-");
                    var dob2 = new Date(parseInt(dob1[0]), parseInt(dob1[1]) - 1, parseInt(dob1[2]));
                    $("#scheduleDate2").datepicker().datepicker("setDate", dob2);
                }
                var paymentName2 = $('#paymentName2').val();
                if (null != paymentName2 && paymentName2.startsWith('Course Fee - ')) {
                    paymentName2 = paymentName2.split('Course Fee - ');
                    if (paymentName2[1].search(/ of /i) > 0) {
                        $('#installmentNumber2').val(paymentName2[1].split(' of ')[0].split('<sup>')[0]);
                        $('#numberOfMonth2').val(paymentName2[1].split(' of ')[1].split(' ')[0]);
                        $('#paymentName2').val('');
                    }
                }
            }
        }
    });

}

function deletePayment(id, rowID) {
    var data = { "id": id };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'delete-user-payment'),
        data: JSON.stringify(data),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                showMessage(true, data['message']);
                var table = $('#advPaymentSearch').DataTable();
                table.row($("#"+rowID)).remove().draw();
                // window.setTimeout(function(){
                // 	hideMessage('')
                // },500)
                // window.setTimeout(function () {
                //     hideMessage('')
                //     $('#advSearchSubmitButtion').trigger('click');
                // }, 3100)
            }
        },
        error: function (e) {
            return false;
        }
    });
}


function mapUnregisteredUserPayment(formId, unregistredPaymentId, schoolId, userRole, firstReset, studentName, email) {
    $('#' + formId + ' #mapStudentModal').modal("show");
    // var html='<option value="">Select Student</option>';
    // html+=getUserBasedOnCriteria('USER_LIST_BY_CRITERIA', schoolId, userRole, firstReset);
    // $('#'+formId+' #mapToUsers').html(html)
    // $('#'+formId+' #mapToUsers').select2();

    $('#' + formId + ' #unregistredPaymentId').val(unregistredPaymentId)
    $('#' + formId + ' #mapToStudentId').html('You are about to map <strong>' + studentName + ' (' + email + ')</strong> payment to');
    $('#mapStudentModal').modal({ backdrop: 'static', keyboard: false });
}

function mapUnregisteredUserPaymentProcess(formId) {
    hideMessage('');
    var email = $('#' + formId + ' #mapToUsers').val();
    var unregistredPaymentId = $('#' + formId + ' #unregistredPaymentId').val();
    var request = { email: email, unregistredPaymentId: unregistredPaymentId, schoolId: SCHOOL_ID };
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard', 'map-unregistered-payment'),
        data: JSON.stringify(request),
        dataType: 'json',
        async: false,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                showMessage(true, data['message']);
                $('#mapStudentModal').modal('hide');
            }
            return false;
        }
    });
}