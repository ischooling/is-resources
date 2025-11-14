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
    $("#userScreeningFilterForm #filterGrades").val("").trigger("change");
    $("#userScreeningFilterForm #filterCourses").val("").trigger("change");
    loadUserApplicationData();
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
                    <td>${(CURRENT_PAGE_USER_APPLICATION - 1) * pageSize + index + 1}</td>
                    <td>${user.userName}</td>
                    <td>
                        ${user.phoneNo || ''} 
                        ${user.isWhatsappAvailable == "Y" ? `<span style="margin-left: 5px;"><img src="${PATH_FOLDER_IMAGE}watsapp-icon.png" width="16px" height="16px" alt="WhatsApp" /></span>` : ''}
                    </td>
                    <td>${user.email || ''}</td>
                    <td>${user.country} | ${user.state} | ${user.city}</td>
                    <td>${user.lastSalary ? user.currency + ' ' + user.lastSalary : ''}</td>
                    <td>${user.lastOrgName || ''}</td>
                    <td>${user.appliedUserRole || ''}</td>
                    <td>
                        ${user?.attachments?.uploadDocumentUserResumeURL ? 
                            `<a href="${user?.attachments?.uploadDocumentUserResumeURL}" target="_blank" class="btn btn-sm btn-outline-primary">View Resume</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                        ${user?.attachments?.uploadDocumentUserPassportURL ? 
                            `<a href="${user?.attachments?.uploadDocumentUserPassportURL}" target="_blank" class="btn btn-sm btn-outline-primary">View Photo</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                        ${user.linkedInUrl ? 
                            `<a href="${user.linkedInUrl}" target="_blank" class="btn btn-sm btn-outline-primary" target="_blank">LinkedIn</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    ${/*<td>${user.assignTo || 'N/A'}</td>
                    <td>${user.status || 'N/A'}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModalUserApplication(${user.id}, '${user.status || ''}')">
                                        <i class="fas fa-edit me-2"></i>&nbsp;Update Status
                                    </a>
                                </li>`;
                                if(user.status != ""){
                                    row+=`<li>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="resendTeacherInterviewLink(${user.id})">
                                            <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Interview Link
                                        </a>
                                    </li>`
                                }
                            row+=`</ul>
                        </div>
                    </td>*/''}
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
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-user-screening-data', payload, '/teacher/signup');
        bindUserApplicationData(responseData);
    } catch (error) {
        console.error('Error loading user application data:', error);
        $('#userApplicationTable tbody').html('<tr><td colspan="11" class="text-center text-muted">No Data Available</td></tr>');
    }
}

function applyFilterUserApplication() {
    CURRENT_PAGE_USER_APPLICATION = 1;
    loadUserApplicationData();
}

function resetUserApplication() {
    $('#userScreeningFilterForm')[0].reset();
    $('#userScreeningFilterForm #filterCountryId').val('0').trigger('change');
    CURRENT_PAGE_USER_APPLICATION = 1;
    $('#userScreeningFilterForm #pageSize').val('10')
}

// function resendInterviewLink(teacherId) {
//     alert('Interview booking link has been resent successfully!');
// }

// function openUpdateStatusModalUserApplication(id, status){
//     if($("#userApplicationProfileStatusModal").length == 1){
//         $("#userApplicationProfileStatusModal").remove();
//     }
//     $("body").append(userApplicationProfileStatusModal(id, status));
//     $("#assignedToInterview").select2({
//         placeholder: "Select Assign To",
//         theme:"bootstrap4"
//     });
//     setTimeout(() => {
//         $("#userApplicationProfileStatusModal").modal("show");
//     }, 200);
// }

// async function updateTeacherScreeningProfile(id){
//     var selectedStatus = $("#teacherScreeningProfileStatus").val();
//     if(selectedStatus == ""){
//         showMessageTheme2(2, "Please select status");
//         return false;
//     }
//     if(selectedStatus == "Approved For Interview"){
//         if($("#userApplicationProfileStatusForm #assignedToInterview").val() == ""){
//             showMessageTheme2(2, "Please select assign to");
//             return false;
//         }
//     }
//     if($("#teacherScreeningProfileRemarks").val() == ""){
//         showMessageTheme2(2, "Please enter remarks");
//         return false;
//     }
//     var payload = {};
//     payload["entityId"] = id;
//     payload["entityType"] = "INITIAL-INTERVIEW";
//     payload["assignTo"] = $("#userApplicationProfileStatusForm #assignedToInterview").val();
//     payload["status"] = $("#teacherScreeningProfileStatus").val();
//     payload["remarks"] = $("#teacherScreeningProfileRemarks").val();
//     var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
//     if(responseData.status == "SUCCESS"){
//         if(selectedStatus == 'Reject'){
//             $("#userApplicationTable tbody #tr_"+id).remove();
//         }else{
//             var assignedToText = $("#userApplicationProfileStatusForm #assignedToInterview option:selected").text();
//             var displayName = assignedToText.split("-")[0].trim();
//             updateTableRowDirectly(id, selectedStatus, displayName);
//         }
//         showMessageTheme2(1, responseData.message);
//         $("#teacherScreeningProfileStatusModal").modal("hide");
//     }else{
//         showMessageTheme2(0, responseData.message);
//     }

// }
// async function viewAssignToListForInterview(){
//     var selectedStatus = $("#teacherScreeningProfileStatus").val();
//     if(selectedStatus == "Approved For Interview"){
//         let payload = {}
//         var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
//         bindAssignTo('userApplicationProfileStatusForm', 'assignedToInterview', responseData);
//         $("#userApplicationProfileStatusForm #assignedToInterviewDiv").show();
//     }else{
//         $("#userApplicationProfileStatusForm #assignedToInterviewDiv").hide();
//         $("#userApplicationProfileStatusForm #assignedToInterview").val("").trigger("change");
//     }
// }

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

// function updateTableRowDirectly(teacherId, newStatus, assignedTo) {
//     var row = $('#tr_' + teacherId);
    
//     if(row.length) {
//         if(newStatus != "Approved for Selection Process"){
//             row.find('td:eq(11)').text(assignedTo || 'N/A');
//         }
//         row.find('td:eq(12)').text(newStatus || 'N/A');
        
//         var dropdownHtml = `
//             <div class="dropdown">
//                 <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
//                     <i class="fas fa-ellipsis-v"></i>
//                 </button>
//                 <ul class="dropdown-menu">
//                     <li>
//                         <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModalUserApplication(${teacherId}, '${newStatus || ''}')">
//                             <i class="fas fa-edit me-2"></i>&nbsp;Update Status
//                         </a>
//                     </li>`;
//         if(newStatus && newStatus !== "" && newStatus !== "N/A") {
//             dropdownHtml += `<li>
//                         <a class="dropdown-item" href="javascript:void(0);" onclick="resendTeacherInterviewLink(${teacherId})">
//                             <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Interview Link
//                         </a>
//                     </li>`;
//         }
        
//         dropdownHtml += `</ul>
//             </div>`;
//         row.find('td:eq(13)').html(dropdownHtml);
//     }
// }