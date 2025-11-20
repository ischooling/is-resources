var CURRENT_PAGE_USER_APPLICATION = 1;
async function userApplicationProfileOnloadFunction(){
    CURRENT_PAGE_USER_APPLICATION = 1;
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
    $("#userScreeningFilterForm #filterAppliedUserRole").select2({
        placeholder: "Select Applied User Role",
        theme:"bootstrap4"
    }).on("change", function(){
        if($(this).val()=="Teacher"){
            var html = `<option value="">Select Status</option>
                        <option value="applied">Applied</option>
                        <option value="Approved For Interview">Approved For Interview</option>
                        <option value="Approved for Selection Process">Approved for Selection Process</option>`;
            $("#applicantsStatus").html(html);
        }else{
            var html = `<option value="applied">Applied</option>
                        <option value="accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>`;
            $("#applicantsStatus").html(html);
        }
    });
    $("#userScreeningFilterForm #filterGrades").val("").trigger("change");
    $("#userScreeningFilterForm #filterCourses").val("").trigger("change");
    loadUserApplicationData();
}

function showFilterUserApplication(){
    $("#userScreeningFilterForm").slideToggle(300);
}

function bindUserApplicationData(responseData) {
    debugger
    console.log(responseData)
    var tableBody = $('#userApplicationTable tbody');
    tableBody.empty();
    if (responseData.DataArray && responseData.DataArray.length > 0) {
        var pageSize = responseData.pagination.pageSize;
        responseData.DataArray.forEach(function(user, index) {
            var row = 
                `<tr id="tr_${user.id}">
                    <td>${(CURRENT_PAGE_USER_APPLICATION - 1) * pageSize + index + 1}</td>
                    <td>
                        ${changeDateFormat(new Date(user.createdAt), "MMM-dd-yyyy")}
                        &nbsp;|&nbsp; 
                        ${user.userName} 
                        &nbsp;|&nbsp;
                        +${user.phoneNo || ''} 
                        ${user.isWhatsappAvailable == "Y" ? `<span style="margin-left: 5px;"><img src="${PATH_FOLDER_IMAGE}watsapp-icon.png" width="16px" height="16px" alt="WhatsApp" /></span>` : ''}    
                        &nbsp;|&nbsp;
                        ${user.email || ''}
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
                            `<a href="${user.linkedInUrl}" target="_blank" class="btn btn-sm btn-outline-primary" target="_blank">LinkedIn</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>${user.assignTo || 'N/A'}</td>
                    <td>${user.status || 'N/A'}</td>
                    <td>
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
                            row+=`</ul>
                        </div>
                    </td>
                </tr>`;
            tableBody.append(row);
        });
        $("#userApplicationPagination").html(renderPaginationCommon(CURRENT_PAGE_USER_APPLICATION, responseData.pagination.totalPages, "userApplication"));
    }else{
        $("#userApplicationPagination").html('');
        $('#userApplicationTable tbody').html('<tr><td colspan="11" class="text-center text-muted">No Data Found</td></tr>')
    }
}

async function loadUserApplicationData() {
    try {
        var payload = {};
        payload['schoolId'] = SCHOOL_ID;
        payload['userName'] = $("#userScreeningFilterForm #filterName").val().trim();
        payload['phoneNumber'] = $("#userScreeningFilterForm #filterPhone").val().trim();
        payload['email'] = $("#userScreeningFilterForm #filterEmail").val().trim();
        payload['appliedUserRole'] = $("#userScreeningFilterForm #filterAppliedUserRole").val().trim();
        payload['country'] = $("#userScreeningFilterForm #filterCountryId").val();
        // payload['assignTo'] = $("#userScreeningFilterForm #filterAssignedTo").val();
        // payload['status'] = $("#userScreeningFilterForm #filterStatus").val();
        payload['pageNo'] = CURRENT_PAGE_USER_APPLICATION;
        payload['pageSize'] = $("#userScreeningFilterForm #pageSize").val().trim();
        payload['status'] = $("#userScreeningFilterForm #applicantsStatus").val().trim();
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-user-screening-data', payload, '/teacher/signup');
        bindUserApplicationData(responseData);
    } catch (error) {
        console.error('Error loading user application data:', error);
        $('#userApplicationTable tbody').html('<tr><td colspan="11" class="text-center text-muted">No Data Available</td></tr>');
    }
}

function applyFilterUserApplication() {
    CURRENT_PAGE_USER_APPLICATION = 1;
    // if($("#userScreeningFilterForm #filterAppliedUserRole").val() == null || $("#userScreeningFilterForm #filterAppliedUserRole").val() == undefined || $("#userScreeningFilterForm #filterAppliedUserRole").val() == ""){
    //     showMessageTheme2(0, "Applied User Role is required");
    //     return false;
    // }
    if($("#userScreeningFilterForm #applicantsStatus").val() == null || $("#userScreeningFilterForm #applicantsStatus").val() == undefined || $("#userScreeningFilterForm #applicantsStatus").val() == ""){
        showMessageTheme2(0, "Status is required");
        return false;
    }
    loadUserApplicationData();
}

function resetUserApplication() {
    $('#userScreeningFilterForm')[0].reset();
    $('#userScreeningFilterForm #filterCountryId').val('0').trigger('change');
    $("#filterAppliedUserRole").val("").trigger("change");
    CURRENT_PAGE_USER_APPLICATION = 1;
    $('#userScreeningFilterForm #pageSize').val('10');
     var html = `<option value="applied">Applied</option>
                <option value="accepted">Accepted</option>
                <option value="Rejected">Rejected</option>`;
    $("#applicantsStatus").html(html);
}

// function resendInterviewLink(teacherId) {
//     alert('Interview booking link has been resent successfully!');
// }

function openUpdateStatusModalUserApplication(id, status, role){
    if($("#userApplicationProfileStatusModal").length == 1){
        $("#userApplicationProfileStatusModal").remove();
    }
    $("body").append(userApplicationProfileStatusModal(id, status, role));
    $("#assignedToInterview").select2({
        placeholder: "Select Assign To",
        theme:"bootstrap4"
    });
    setTimeout(() => {
        $("#userApplicationProfileStatusModal").modal("show");
    }, 200);
}



async function updateUserApplicationProfile(id){
    var selectedStatus = $("#userApplicationProfileStatus").val();
    if(selectedStatus == null || selectedStatus == undefined || selectedStatus == ""){
        showMessageTheme2(2, "Please select status");
        return false;
    }
    if(selectedStatus == null || selectedStatus == undefined || selectedStatus == "Approved For Interview"){
        if($("#userApplicationProfileStatusForm #assignedToInterview").val() == ""){
            showMessageTheme2(2, "Please select assign to");
            return false;
        }
    }
    if($("#userApplicationProfileRemarks").val() == null || $("#userApplicationProfileRemarks").val() == undefined ||  $("#userApplicationProfileRemarks").val() == ""){
        showMessageTheme2(2, "Please enter remarks");
        return false;
    }
    var payload = {};
    payload["entityId"] = id;
    payload["entityType"] = "INITIAL-INTERVIEW";
    payload["assignTo"] = $("#userApplicationProfileStatusForm #assignedToInterview").val();
    payload["status"] = $("#userApplicationProfileStatus").val();
    payload["remarks"] = $("#userApplicationProfileRemarks").val();
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
    if(responseData.status == "SUCCESS"){
        if(selectedStatus == 'Reject'){
            $("#userApplicationTable tbody #tr_"+id).remove();
        }else{
            var assignedToText = $("#userApplicationProfileStatusForm #assignedToInterview option:selected").text();
            var displayName = assignedToText.split("-")[0].trim();
            updateTableRowDirectly(id, selectedStatus, displayName);
        }
        showMessageTheme2(1, responseData.message);
        $("#userApplicationProfileStatusModal").modal("hide");
    }else{
        showMessageTheme2(0, responseData.message);
    }

}
async function applicantsViewAssignToListForInterview(){
    var selectedStatus = $("#userApplicationProfileStatus").val();
    if(selectedStatus == "Approved For Interview"){
        let payload = {}
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
        bindAssignTo('userApplicationProfileStatusForm', 'assignedToInterview', responseData);
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").show();
    }else{
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").hide();
        $("#userApplicationProfileStatusForm #assignedToInterview").val("").trigger("change");
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

// function bindAssignTo(formId, selectId, responseData) {
//     const element = $("#" + formId+" #"+selectId);
//     element.empty();
//     element.append('<option value="">Select assign to</option>');

//     if (responseData && Array.isArray(responseData.assignTo)) {
//         $.each(responseData.assignTo, function (i, item) {
//             element.append(
//                 "<option value='" + item.id + "'>" + item.userFullName + " - (" + item.email + ")</option>"
//             );
//         });
//     }
// }

function updateTableRowDirectly(teacherId, newStatus, assignedTo) {
    var row = $('#tr_' + teacherId);
    
    if(row.length) {
        if(newStatus != "Approved for Selection Process"){
            row.find('td:eq(9)').text(assignedTo || 'N/A');
        }
        row.find('td:eq(10)').text(newStatus || 'N/A');
        
        var dropdownHtml = `
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModalUserApplication(${teacherId}, '${newStatus || ''}')">
                            <i class="fas fa-edit me-2"></i>&nbsp;Update Status
                        </a>
                    </li>`;
        if(newStatus && newStatus !== "" && newStatus !== "N/A") {
            dropdownHtml += `<li>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="resendTeacherInterviewLink(${teacherId})">
                            <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Interview Link
                        </a>
                    </li>`;
        }
        
        dropdownHtml += `</ul>
            </div>`;
        row.find('td:eq(13)').html(dropdownHtml);
    }
}

async function viewResumeAndPhoto(url, modalId){
    var base64URL = await urlToBase64(url);
    var attachmentType = getExtension(url)
    if(attachmentType != 'pdf'){
        $("#"+modalId+" .upload_img img").attr('src',base64URL)
        $("#"+modalId+' .upload_img').removeClass("d-none");
        $("#"+modalId+" .upload_pdf").addClass("d-none");
    }else{ 
        $("#"+modalId+" .upload_pdf .pre_upload_pdf").remove();
        $("#"+modalId+" .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+base64URL+'"></object>');
        $("#"+modalId+" .upload_pdf a.download-pdf-btn").attr("href",base64URL);
        $("#"+modalId+" .upload_pdf").removeClass("d-none");
        $("#"+modalId+' .upload_img').addClass("d-none");
    }   
    $("#"+modalId).modal("show");  
}

function getExtension(url) {
    if (!url) return "";
    return url.split('.').pop().split('?')[0]; 
}

async function urlToBase64(url) {
    var response = await fetch(url);
    var blob = await response.blob();

    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
    });
}




// let passportExt = getExtension("6d4b834e2faa08bdd76a83876eb59ba63a66c682.jpg"); // jpg
// let resumeExt = getExtension("https://s3.amazonaws.com/testseri/test/VPuDo0e3W5jNSX7s_LEAD_DEMO_COUNT.pdf"); // pdf

// console.log(passportExt, resumeExt);
