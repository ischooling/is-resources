var CURRENT_PAGE_USER_APPLICATION = 1;
var USER_APPLICATION_FILTER_STATE = {
    filterValues: {}
};
async function userApplicationProfileOnloadFunction(){
    CURRENT_PAGE_USER_APPLICATION = 1;
    USER_APPLICATION_FILTER_STATE = {
        filterValues: {}
    };
    getAllCountryList('userScreeningFilterForm','filterCountryId');
    // let payload = {}
    // var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
    // bindAssignTo('userScreeningFilterForm', 'filterAssignedTo', responseData);
    $("#userScreeningFilterForm #filterCountryId").select2({
        placeholder: "Select Country",
        theme:"bootstrap4"
    });
    $("#userScreeningFilterForm #filterAssignedTo").select2({
        placeholder: "Select Assign To",
        theme:"bootstrap4"
    });
    $("#filterStartDate, #filterEndDate").datepicker({
       format: "M dd, yyyy",
       autoclose: true
    });
    // $("#filterStartDate, #filterEndDate").datepicker("setDate", new Date());
    // $("#filterStartDate, #filterEndDate").prop("disabled", true)
    $("#userScreeningFilterForm #filterAppliedUserRole").select2({
        placeholder: "Select Applied User Role",
        theme:"bootstrap4"
    }).on("change", function(){
        if($(this).val()=="Teacher"){
            var html=`<option value="">Select Status</option>
                <option value="Applied">Applied</option>
                <option value="Step 2 | Few Questions">Step 2 | Few Questions</option>
                <option value="Approved For Interview">Approved For Interview</option>
                <option value="Approved for Selection Process">Approved for Selection Process</option>
                <option value="On Hold">On Hold</option>`;
            $("#applicantsStatus").html(html);
        }else{
            var html=`<option value="">Select Status</option>
                <option value="Applied">Applied</option>
                <option value="Step 2 | Few Questions">Step 2 | Few Questions</option>
                <option value="Approved For Interview">Approved For Interview</option>
                <option value="accepted">Accepted</option>
                <option value="Reject">Rejected</option>
                <option value="On Hold">On Hold</option>`;
            $("#applicantsStatus").html(html);
        }
    });
    $("#userScreeningFilterForm #filterGrades").val("").trigger("change");
    $("#userScreeningFilterForm #filterCourses").val("").trigger("change");
    loadUserApplicationData(false, "onLoad");
    if($("#cropModalChatSuport").length == 1){
        $("#cropModalChatSuport").remove();
    }
    $("body").append(getChatImageCropContentJA());
    if($("#uploadFile").length == 1){
        $("#uploadFile").remove();
    }
    $("body").append(pdfPreviewJA());
}

function showFilterUserApplication(){
    $("#userScreeningFilterForm").slideToggle(300);
}

function bindUserApplicationData(responseData) {
    var tableBody = $('#userApplicationTable tbody');
    tableBody.empty();
    if (responseData.DataArray && responseData.DataArray.length > 0) {
        var pageSize = responseData.pagination.pageSize;
        responseData.DataArray.forEach(function(user, index) {
            var row = 
                `<tr id="tr_${user.id}">
                    <td>
                        ${(CURRENT_PAGE_USER_APPLICATION - 1) * pageSize + index + 1}
                    </td>

                    <td>
                        ${changeDateFormat(new Date(user.createdAt), "MMM-dd-yyyy")}
                        &nbsp;|&nbsp; 
                        ${user.userName} 
                        &nbsp;|&nbsp;
                        ${
                            user.isWhatsappAvailable == "Y"
                            ? `<a href="https://wa.me/${user.phoneNo}" target="_blank" style="text-decoration:none; color:inherit;">
                                    +${user.phoneNo}
                                    <span style="margin-left: 5px;">
                                        <img src="${PATH_FOLDER_IMAGE}watsapp-icon.png" width="16px" height="16px" alt="WhatsApp" />
                                    </span>
                            </a>`
                            : `+${user.phoneNo || ''}`
                        }
                        &nbsp;|&nbsp;
                        ${user.email || ''}

                        ${user.isNewApplicant == "Y"
                            ? `<span id="newApplicationText${user.id}" class="color-changing font-16 font-weight-bold">New!</span>` : ``
                        }

                        ${
                            JSON.parse(user.location).by
                            ? `<br/><p class="bg-success rounded p-1 w-fit-content mt-1 text-white">
                                    ${JSON.parse(user.location).by}
                            </p>`
                            : ""
                        }
                    </td>
                    <td>${user.country} | ${user.state} | ${user.city}</td>
                    <td>${user.lastSalary ? user.currency + ' ' + user.lastSalary : ''}</td>
                    <td>${user.lastOrgName || ''}</td>
                    <td>${user.appliedUserRole || ''}</td>
                    <td>
                        ${user?.attachments?.uploadDocumentUserResumeURL ? 
                            `<a href="javascript:void(0)"  class="btn btn-sm btn-outline-primary" onclick="viewResumeAndPhoto(\'${user?.attachments?.uploadDocumentUserResumeURL}\','viewApplicantsAttachementModal')">View Resume</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                        ${user?.attachments?.uploadDocumentUserPassportURL ? 
                            `<a href="javascript:void(0)"  class="btn btn-sm btn-outline-primary" onclick="viewResumeAndPhoto(\'${user?.attachments?.uploadDocumentUserPassportURL}\','viewApplicantsAttachementModal')">View Photo</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                        ${user.linkedInUrl ? 
                            `<a href="${user.linkedInUrl}" target="_blank" class="btn btn-sm btn-outline-primary">LinkedIn</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                       ${user.isAnswersAvailable > 0 
                            ? `<a href="javascript:void(0);" class="btn btn-sm btn-outline-primary" onclick="openQAModal('${user.id}')">View</a>` 
                            : '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                    ${
                        user.assignTo && user.assignTo.toLowerCase().includes("syeed")
                        ? `CEO`
                        : (user.assignTo || "N/A")
                    }
                    </td>
                    <td>${user.status}</td>
                    <td>
                        <div class="d-flex align-items-center gap-5">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModalUserApplication(${user.id}, '${user.status || ''}', '${user.appliedUserRole}')">
                                            <i class="fas fa-edit me-2"></i>&nbsp;Update Status
                                        </a>
                                    </li>`;
                                    if(user.status != "" && user.appliedUserRole == "Teacher"){
                                        row+=`<li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="resendTeacherInterviewLink(${user.id})">
                                                <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Interview Link
                                            </a>
                                        </li>`
                                    }
                                    row+=`<li>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="openCommunicationLogsModalForUserApplication(${user.id}, 'USER_SCREENING')">
                                            <i class="fas fa-comment me-2"></i>&nbsp;Remark Logs
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div data-toggle="tooltip" data-placement="top" title="Discard">
                                <i class="fa fa-trash text-danger font-20" aria-hidden="true" style="cursor:pointer;" onclick="showWarningMessage('Are you sure you want to discard this application?', &quot;updateUserApplicationProfile(${user.id}, 'Discard')&quot;)"></i>
                            </div>
                        </div>
                    </td>
                </tr>`;
            tableBody.append(row);
        });
        $("#userApplicationPagination").html(renderPaginationCommon(CURRENT_PAGE_USER_APPLICATION, responseData.pagination.totalPages, "userApplication"));
    }else{
        $("#userApplicationPagination").html('');
        $('#userApplicationTable tbody').html('<tr><td colspan="13" class="text-center text-muted">No Data Found</td></tr>')
    }
}

async function loadUserApplicationData(isToday, callFrom) {
    var startVal = $("#userScreeningFilterForm #filterStartDate").val();
    var endVal   = $("#userScreeningFilterForm #filterEndDate").val();
    try {
        var payload = {};
        payload['schoolId'] = SCHOOL_ID;
        payload['pageNo'] = CURRENT_PAGE_USER_APPLICATION;
        payload['pageSize'] = $("#recordsPerPageJA").val();
        if (isToday) {
            payload['startDate'] = changeDateFormat(new Date(), "yyyy-mm-dd") + " 00:00:00";
            payload['endDate'] = changeDateFormat(new Date(), "yyyy-mm-dd") + " 23:59:59";
        } else if(!isToday && callFrom == "card") {
            payload['startDate'] = "" 
            payload['endDate'] = "";
        }else{
            payload['startDate'] = startVal ? changeDateFormat(new Date(startVal), "yyyy-mm-dd") + " 00:00:00" : ""; 
            payload['endDate'] = endVal ? changeDateFormat(new Date(endVal), "yyyy-mm-dd") + " 23:59:59" : "";
        }
        payload['userName'] = USER_APPLICATION_FILTER_STATE.filterValues.userName || "";
        payload['phoneNumber'] = USER_APPLICATION_FILTER_STATE.filterValues.phoneNumber || "";
        payload['email'] = USER_APPLICATION_FILTER_STATE.filterValues.email || "";
        payload['appliedUserRole'] = USER_APPLICATION_FILTER_STATE.filterValues.appliedUserRole || "";
        payload['country'] = USER_APPLICATION_FILTER_STATE.filterValues.country || "";
        payload['status'] = USER_APPLICATION_FILTER_STATE.filterValues.status || "";
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-user-screening-data', payload, '/teacher/signup');
        if(responseData.statusCode == "SUCCESS"){
            bindUserApplicationData(responseData);
            if(callFrom == "filter" || callFrom == "onLoad"){
                $("#todayRecordsJA").text(responseData.todayRecords)
                $("#totalRecordsJA").text(responseData.overallRecords)
            }
            $('[data-toggle="tooltip"]').tooltip();
        }
    } catch (error) {
        console.error('Error loading user application data:', error);
        $('#userApplicationTable tbody').html('<tr><td colspan="13" class="text-center text-muted">No Data Available</td></tr>');
    }
}

function applyFilterUserApplication() {
    CURRENT_PAGE_USER_APPLICATION = 1;
    updateFormState();
    loadUserApplicationData(false, "filter");
}

function resetUserApplication() {
    $('#userScreeningFilterForm')[0].reset();
    $('#userScreeningFilterForm #filterCountryId').val('0').trigger('change');
    $("#filterAppliedUserRole").val("").trigger("change");
    CURRENT_PAGE_USER_APPLICATION = 1;
    $('#userScreeningFilterForm #pageSize').val('10');
    $("#filterDateDuration").val("Custom").trigger("change");
    USER_APPLICATION_FILTER_STATE = {
        filterValues: {}
    };
}

function updateFormState() {
    USER_APPLICATION_FILTER_STATE.filterValues = {
        userName: $("#userScreeningFilterForm #filterName").val().trim(),
        phoneNumber: $("#userScreeningFilterForm #filterPhone").val().trim(),
        email: $("#userScreeningFilterForm #filterEmail").val().trim(),
        appliedUserRole: $("#userScreeningFilterForm #filterAppliedUserRole").val().trim(),
        country: $("#userScreeningFilterForm #filterCountryId").val(),
        status: $("#userScreeningFilterForm #applicantsStatus").val().trim()
    };
}

function openUpdateStatusModalUserApplication(id, status, role){
    if($("#userApplicationProfileStatusModal").length == 1){
        $("#userApplicationProfileStatusModal").remove();
    }
    $("body").append(userApplicationProfileStatusModal(id, status, role));
    $("#assignedToInterview").select2({
        placeholder: "Select Assign To",
        theme:"bootstrap4"
    });
    $("#questions").select2({
        placeholder: "Select questions",
        theme:"bootstrap4"
    }).on('select2:select', function (e) {
        var element = e.params.data.element;
        var $element = $(element);
        $element.detach();
        $(this).append($element);
        $(this).trigger("change");
    });
    if(status == "On Hold"){
        $("#userApplicationProfileStatus option[value='On Hold']").remove()
    }
    setTimeout(() => {
        $("#userApplicationProfileStatusModal").modal("show");
    }, 200);
}

async function updateUserApplicationProfile(id, status){
    if (status === "Discard") {
        const payload = {
            entityId: id,
            entityType: "INITIAL-INTERVIEW",
            status: "Discard",
            remarks: "Discarded"
        };

        const responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');

        if (responseData.statusCode === "SUCCESS") {
            $("#userApplicationTable tbody #tr_"+id).remove();
            showMessageTheme2(1, responseData.message);
        } else {
            showMessageTheme2(0, responseData.message);
        }

        return;
    }
    var selectedStatus = $("#userApplicationProfileStatus").val();
    if(selectedStatus == null || selectedStatus == undefined || selectedStatus == ""){
        showMessageTheme2(2, "Please select status");
        return false;
    }
    if(selectedStatus == "Approved For Interview"){
        if($("#userApplicationProfileStatusForm #assignedToInterview").val() == ""){
            showMessageTheme2(2, "Please select assign to");
            return false;
        }
    }else if(selectedStatus == "Step 2 | Few Questions"){
        if($("#userApplicationProfileStatusForm #questions").val() == ""){
            showMessageTheme2(2, "Please select any question");
            return false;
        }
    }
    if($("#userApplicationProfileRemarks").val() == null || $("#userApplicationProfileRemarks").val() == undefined ||  $("#userApplicationProfileRemarks").val() == ""){
        showMessageTheme2(2, "Please enter remarks");
        return false;
    }
    var selectedQuestionIds = $("#userApplicationProfileStatusForm #questions").val();
    var finalQuestionsArr = [];
    $("#userApplicationProfileStatusForm #questions option:selected").each(function () {
        finalQuestionsArr.push({
            questionText: $(this).data("text"),
            questionType: $(this).data("type")
        });
    });
    var payload = {};
    payload["entityId"] = id;
    payload["entityType"] = "INITIAL-INTERVIEW";
    payload["assignTo"] = $("#userApplicationProfileStatusForm #assignedToInterview").val();
    payload["questions"] = finalQuestionsArr;
    payload["status"] = $("#userApplicationProfileStatus").val();
    payload["remarks"] = $("#userApplicationProfileRemarks").val();
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
    if(responseData.status == "SUCCESS"){
        // if(selectedStatus == 'Reject'){
        //     $("#userApplicationTable tbody #tr_"+id).remove();
        // }else{
            var assignedToText = $("#userApplicationProfileStatusForm #assignedToInterview option:selected").text();
            var displayName = assignedToText.split("-")[0].trim();
            updateTableRowDirectly(id, selectedStatus, displayName);
        // }
        showMessageTheme2(1, responseData.message);
        loadUserApplicationData(false, "filter");
        $("#userApplicationProfileStatusModal").modal("hide");
        $("#newApplicationText"+String(id)).remove();
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

async function applicantsViewAssignToListForInterview(role){
    var selectedStatus = $("#userApplicationProfileStatus").val();
    if(selectedStatus == "Approved For Interview"){
        let payload = {}
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
        bindAssignToJA('userApplicationProfileStatusForm', 'assignedToInterview', responseData);
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").show();
        $("#userApplicationProfileStatusForm #questionsDiv").hide();
    }else if(selectedStatus == "Step 2 | Few Questions") {
        var payload = {}
        payload["schoolId"] = SCHOOL_ID;
        payload["roleType"] = role;
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + "get-job-application-questions",
            body: payload,
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        }
        var responseData = await callCommonAjax(ajaxReqDetails);
        if(responseData.status == 1){
            bindQuestionsToJA('userApplicationProfileStatusForm', 'questions', responseData)
        }
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").hide();
        $("#userApplicationProfileStatusForm #questionsDiv").show();
    }else{
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").hide();
        $("#userApplicationProfileStatusForm #questionsDiv").hide();
        $("#userApplicationProfileStatusForm #assignedToInterview").val("").trigger("change");
        $("#userApplicationProfileStatusForm #questions").val("").trigger("change");
    }
}



// async function resendTeacherInterviewLink(id){
//     var payload = {}
//     payload["entityId"] = id;
//     payload["entityType"] = "INITIAL-INTERVIEW";
//     payload["status"] = 'Resend Interview Link';
//     var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
//     if(responseData.status == "SUCCESS"){
//         showMessageTheme2(1, responseData.message);
//     }else{
//         showMessageTheme2(0, responseData.message);
//     }
// }

function bindAssignToJA(formId, selectId, responseData) {
    const element = $("#" + formId+" #"+selectId);
    element.empty();
    element.append('<option value="">Select assign to</option>');

    if (responseData && Array.isArray(responseData.assignTo)) {
        $.each(responseData.assignTo, function (i, item) {
            element.append(
                "<option value='" + item.id + "'>" + item.userFullName + " - (" + item.email + ")</option>"
            );
        });
    }
}

function bindQuestionsToJA(formId, selectId, responseData) {
    const element = $("#" + formId + " #" + selectId);
    element.empty();
    const common = responseData.data.commonQuestions || [];
    const role = responseData.data.roleQuestions || [];

    const allQuestions = [...common, ...role];

    if (allQuestions.length === 0) {
        element.append('<option value="">No questions found</option>');
        return;
    }

    allQuestions.forEach(q => {
        const isMandatory = q.questionType === "M";
        const label = isMandatory ? `${q.questionText} *` : q.questionText;

        element.append(
            `<option value='${q.id}' data-text="${q.questionText}" data-type="${q.questionType}">
                ${label}
            </option>`
        );
    });
    element.trigger("change");
}

function updateTableRowDirectly(userId, newStatus, assignedTo) {
    var row = $('#tr_' + userId);
    if(row.length) {
        if(newStatus == "Step 2 | Few Questions" || newStatus == "On Hold" || newStatus == "Accepted"){
        }else if(USER_APPLICATION_FILTER_STATE.filterValues.appliedUserRole == "Teacher" && newStatus == "Reject"){
            row.remove();
        }else if(newStatus != "Approved for Selection Process"){
            row.find('td:eq(10)').text(assignedTo || 'N/A');
        }
        row.find('td:eq(11)').text(newStatus || 'N/A');
        
        var dropdownHtml = `
        <div class="d-flex align-items-center gap-5">
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModalUserApplication(${userId}, '${newStatus || ''}')">
                            <i class="fas fa-edit me-2"></i>&nbsp;Update Status
                        </a>
                    </li>`;
        if(newStatus && newStatus !== "" && newStatus !== "N/A") {
            dropdownHtml += `<li>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="resendTeacherInterviewLink(${userId})">
                            <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Interview Link
                        </a>
                    </li>`;
        }
        
        dropdownHtml += `</ul>
            </div>
            <div data-toggle="tooltip" data-placement="top" title="Discard">
                <i class="fa fa-trash text-danger font-20" aria-hidden="true" style="cursor:pointer;" onclick="showWarningMessage('Are you sure you want to discard this application?', &quot;updateUserApplicationProfile(${userId}, 'Discard')&quot;)"></i>
            </div>
        </div>`;
        row.find('td:eq(12)').html(dropdownHtml);
    }
}

async function viewResumeAndPhoto(url, modalId){
    
    var blobUrl = await urlToBlobUrl(url); 
    var attachmentType = getExtension(url);

    if (attachmentType != 'pdf') {

        $("#" + modalId + " .upload_img img").attr('src', blobUrl);
        $("#" + modalId + ' .upload_img').removeClass("d-none");
        $("#" + modalId + " .upload_pdf").addClass("d-none");
        customLoader(false);
    } else {

        $("#" + modalId + " .upload_pdf .pre_upload_pdf").remove();
        var objectTag = $('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="' + blobUrl + '"></object>');
        objectTag.on("load", function () {
            customLoader(false);
           
        });
        $("#"+modalId+" #pre_upload_pdf_div").append(objectTag);
        $("#" + modalId + " .upload_pdf a.download-pdf-btn").attr("href", blobUrl);
        $("#" + modalId + " .upload_pdf").removeClass("d-none");
        $("#" + modalId + ' .upload_img').addClass("d-none");
    }
    customLoader(false);
    $("#" + modalId).modal("show");
}

function getExtension(url) {
    if (!url) return "";
    return url.split('.').pop().split('?')[0];
}

async function urlToBlobUrl(url) {
    customLoader(true);
    var response = await fetch(url);
    if (!response.ok) {
        customLoader(false);
        showMessageTheme2(0, "Failed to fetch PDF")
    }
    var blob = await response.blob();
    customLoader(false);
    return URL.createObjectURL(blob);
}

function openCommunicationLogsModalForUserApplication(userId, userRole){
    if($("#userApplicationCommunicationLogsModal").length == 1){
        $("#userApplicationCommunicationLogsModal").remove();
    }
    $("body").append(communicationLogsContentForUserApplication(userId, userRole));
    initEditor(1, 'commentEditorJA','Enter comments', false);
    $("#fileuploadLog7").on("change",function(){
        var attachment = $("#fileuploadLog7").val().split("\\")[2]
        $("#fileuploadLog7Span").text(attachment);
    });
    // callProfileEnrollStatusListTA('teacherScreeningProfileStatusForm','RE-EN','reLeadStatus', false);
    getCommunicationLogDataJA('communicationLogTableJA', userId, userRole);
    setTimeout(() => {
        $("#userApplicationCommunicationLogsModal").modal("show");
    }, 300);
}

function getRequestForCommunicationLogJA(formId, userId, userRole) {

    var commonCommentsRequest = {};
    var commonCommentsDTO = {};

    // RESET uploadDocs array first (har request fresh)
    uploadDocs = [];

    // Grab file div
    var fileDiv = $("#" + formId + " #fileuploadLog7div");
    var isUploaded = fileDiv.attr("uploaded");
    var fileName = fileDiv.attr("fileName");
    var filePath = fileDiv.attr("data-PDFURL"); // base64
    var docType = fileDiv.attr("docType");

    // 🟢 If uploaded push into uploadDocs in EXACT format you want
    if (isUploaded == "Y" && fileName && filePath) {

        uploadDocs.push({
            docType: docType || "communicationLog",
            fileName: fileName,
            filePath: filePath,
            imgID: "fileuploadLog7"
        });

        commonCommentsDTO['uploadFile'] = fileName;

    } else {
        commonCommentsDTO['uploadFile'] = "";
    }
    commonCommentsDTO['entityId'] = userId;
    commonCommentsDTO['entityName'] = userRole;
    commonCommentsDTO['title'] = $("#" + formId + " #logTitle").val();
    // commonCommentsDTO['status'] = $("#" + formId + " #reLeadStatus").val();

    if (editor1 != undefined) {
        commonCommentsDTO['comments'] = escapeCharacters(editor1.getData());
    }

    commonCommentsDTO['documentUploads'] = uploadDocs;

    commonCommentsRequest['commonCommentsDTO'] = commonCommentsDTO;

    return commonCommentsRequest;
}

async function saveCommunicationLogJA(formId, userId, userRole){
    if(editor1.getData()==null || editor1.getData()=='' || editor1.getData()=='undefined'){
        showMessageTheme2(0,"Comments mandatory",'',true);
		return false;
    }
	if(editor1.getData().length>2999){
		showMessageTheme2(0,"Comments can not be more than 3000 characters.",'',true);
		return false;
	}
    var payload = getRequestForCommunicationLogJA(formId, userId, userRole);
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + UNIQUEUUID + "/api/v1/dashboard/save-user-communication-log",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        showMessageTheme2(1, responseData.message);
        resetCommunicationLogFormJA(formId);
        getCommunicationLogDataJA('communicationLogTableJA', userId, userRole);
        $("#newApplicationText"+userId).remove();
        loadUserApplicationData(false, "filter");
    }else{
        showMessageTheme2(0, responseData.message)
    }
}

function callProfileEnrollStatusListJA(formId, value, elementId, keyStatus) {
	hideMessageTheme2('');
	$.ajax({
		type: "POST",
		contentType: APPLICATION_JSON_VALUE,
		url: getURLForCommon('masters'),
		data: JSON.stringify(getRequestForMaster(formId, 'LEAD-STATUS-LIST', value)),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data['status'] == '0' || data['status'] == '2') {
				showMessageTheme2(true, data['message']);
			} else {
				//console.log(data['mastersData']['data']);
				result = data['mastersData']['data'];
				dropdown = $("#"+formId+" #"+elementId);
				dropdown.html('');
				dropdown.append('<option value="0">Select Status</option>');
				$.each(result, function (k, v) {
					if(keyStatus){
						dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
					}else{
						dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
					}
				});
			}
		}
	});
}

async function getCommunicationLogDataJA(elementId, userId, userRole){
    var payload = {}
    payload["userId"] = userId;
    payload["role"] = userRole;
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + UNIQUEUUID + "/api/v1/dashboard/get-user-communication-log",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.statusResponse.statusCode == 1){
        $('#'+elementId+' > tbody').html(getAddCommunicationLogTablebodyJA(responseData));
    }else{
        $('#'+elementId+' > tbody').html(`<tr><td colspan="6" class="text-center">No data found</td></tr>`)
    }
}

function resetCommunicationLogFormJA(formId){
    $("#" + formId)[0].reset();

    if (editor1 !== undefined) {
        editor1.setData("");
    }

    const div = $("#fileuploadLog7div");

    div.attr("uploaded", "");
    div.attr("fileName", "");
    div.attr("thumbType", "");
    div.attr("data-PDFURL", "");
    div.show();
    $("#fileuploadLog7ViewAndRemoveBtn").hide();
    $("#fileuploadLog7").val("");
    $("#fileuploadLog7").show();
    $("#fileuploadLog7Icon").remove();
    uploadDocs = [];
}

function showAddQuestionsModal(){
    $("#addQuestionsModal").remove();
    $("body").append(addQuestionsModal());
    setTimeout(() => {
        $("#addQuestionsModal").modal("show");
    }, 300);
    $("#addQuestionsModal #roleType").select2({
        placeholder: "Select User Role",
        theme:"bootstrap4"
    })
}

async function saveQuestion(modalId){
    if($("#"+modalId + " #roleType").val() == ""){
        showMessageTheme2(0, "Please select a role type.");
        return;
    }
    if($("#"+modalId + " #questionText").val().trim() == ""){
        showMessageTheme2(0, "Please enter a question.");
        return;
    }
    var payload = {};
    payload["schoolId"] = SCHOOL_ID;
    payload["roleType"] = $("#"+modalId + " #roleType").val();
    payload["questionText"] = $("#"+modalId + " #questionText").val().trim();
    payload["questionType"] = $("input[name='questionType']:checked").val();
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "save-job-application-question",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        showMessageTheme2(1, responseData.message);
        $("#"+modalId + " #roleType").val("Common").trigger("change");
        $("#"+modalId + " #questionText").val("");
        $("input[name='questionType'][value='M']").prop("checked", true);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

async function openQAModal(entityId){
    var payload = {};
    payload["entityId"] = entityId;
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "get-applicant-specific-questions",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        $("#qaModal").remove();
        $("body").append(qaModalContent(responseData.data));
        setTimeout(() => {
            $("#qaModal").modal("show");
        }, 300);
    }
}

function setFilterDatesAccordingly(src, startDateId, endDateId) {
    const value = $(src).val();
    const today = new Date();

    const getStartOfWeek = (date) => {
        const diff = date.getDate() - date.getDay();
        return new Date(date.getFullYear(), date.getMonth(), diff);
    };
    const getEndOfWeek = (date) => {
        const start = getStartOfWeek(new Date(date));
        return new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
    };
    const getStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
    const getEndOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

    if (value === "Today") {
        const d = changeDateFormat(today, "MMM-dd-yyyy");
        $(startDateId + "," + endDateId).val(d).prop("disabled", true);
        return;
    }

    if (value === "Week") {
        $(startDateId).val(changeDateFormat(getStartOfWeek(today), "MMM-dd-yyyy")).prop("disabled", true);
        $(endDateId).val(changeDateFormat(getEndOfWeek(today), "MMM-dd-yyyy")).prop("disabled", true);
        return;
    }

    if (value === "Month") {
        $(startDateId).val(changeDateFormat(getStartOfMonth(today), "MMM-dd-yyyy")).prop("disabled", true);
        $(endDateId).val(changeDateFormat(getEndOfMonth(today), "MMM-dd-yyyy")).prop("disabled", true);
        return;
    }
    $(startDateId).val("").prop("disabled", false);
    $(endDateId).val("").prop("disabled", true);
    $(startDateId).off("change").on("change", function () {
        $(endDateId).val("").prop("disabled", false);
        $(endDateId).datepicker("setStartDate", $(startDateId).val());
    });
    $(endDateId).off("change").on("change", function () {
        var endVal = $(endDateId).val();
        if (!endVal || endVal.trim() === "") return;
    });
}