var CURRENT_PAGE_USER_APPLICATION = 1;
var USER_APPLICATION_FILTER_STATE = {
    filterValues: {}
};
var USER_APPLICATION_PAGINATION_STATE = {
    isToday: false,
    callFrom: 'onLoad',
    isTeaching: null
};
// Sorting filter se bilkul alag rakhi gayi hai. Default "" (jaisa onLoad chalta hai).
var USER_APPLICATION_SORT_STATE = {
    sortBy: ""
};
var ORIGINAL_ORDER_BACKUP = {};
var sortableInstances = {};
var FINAL_INTERVIEW_SLOTS_COUNT;
var FINAL_INTERVIEW_SLOTS_INTERVAL;
var TEACHER_SUB_ROLES;
async function userApplicationProfileOnloadFunction(){
    CURRENT_PAGE_USER_APPLICATION = 1;
    USER_APPLICATION_FILTER_STATE = {
        filterValues: {}
    };
    getAllCountryList('userScreeningFilterForm','filterCountryId');
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
        theme: "bootstrap4",
    }).on("change", function () {
        var extra = $(this).find(":selected").data("extra");
        var html = `<option value="">Select Status</option>
        <option value="Applied">Applied</option>
        <option value="Step 2 | Few Questions">Step 2 | Few Questions</option>
        <option value="Few Questions Submitted">Few Questions Submitted</option>
        <option value="New Applications">New Applications</option>
        <option value="Approved For Interview">Approved For Interview</option>
        <option value="Accepted for Contract">Accepted for Contract</option>
        <option value="Another Round of Interview">Another Round of Interview</option>
        <option value="Final Round of Interview">Final Round of Interview</option>`;
        if (extra == "TEACHER") {
            html+=`<option value="Approved for Selection Process">Approved for Selection Process</option>
            <option value="Hired">Hired</option>
            <option value="On Hold">On Hold</option>`;
        } else {
            html+=`<option value="Hired">Hired</option>
            <option value="Reject">Rejected</option>
            <option value="On Hold">On Hold</option>`;
        }
        $("#applicantsStatus").html(html).trigger("change");
    });
    $("#userScreeningFilterForm #applicantsStatus").select2({
        placeholder: "Select Status",
        theme:"bootstrap4"
    })
    $("#userScreeningFilterForm #filterGrades").val("").trigger("change");
    $("#userScreeningFilterForm #filterCourses").val("").trigger("change");
    USER_APPLICATION_SORT_STATE.sortBy = "";
    loadUserApplicationData(false, "onLoad");
    if($("#cropModalChatSuport").length == 1){
        $("#cropModalChatSuport").remove();
    }
    $("body").append(getChatImageCropContentJA());
    if($("#uploadFile").length == 1){
        $("#uploadFile").remove();
    }
    $("body").append(pdfPreviewJA());
    TEACHER_SUB_ROLES = await getHiringSubRoleByRoleName('TEACHER');
    var slotsCountSetting = getSettingsByTypeAndKey('CONFIGURATION','FINAL_INTERVIEW_SLOTS_COUNT');
    FINAL_INTERVIEW_SLOTS_COUNT = parseInt(JSON.parse(slotsCountSetting).data.metaValue);
    var slotsIntervalSetting = getSettingsByTypeAndKey('CONFIGURATION','FINAL_INTERVIEW_SLOTS_INTERVAL');
    FINAL_INTERVIEW_SLOTS_INTERVAL = parseInt(JSON.parse(slotsIntervalSetting).data.metaValue);
    let payload = {}
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
    bindAssignToJA('userScreeningFilterForm', 'filterAssignedTo', responseData);
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
                        <br/> 
                        ${user.userName} 
                        <br/> 
                        ${
                            user.isWhatsappAvailable == "Y"
                            ? `<a href="https://wa.me/${user.phoneNo}" target="_blank" style="text-decoration:none; color:inherit;">
                                    +${user.phoneNo}
                                    <span style="margin-left: 5px;">
                                        <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" width="16px" height="16px" alt="WhatsApp" />
                                    </span>
                            </a>`
                            : `+${user.phoneNo || ''}`
                        }
                        <br/>
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
                    <td>${user.lastSalary ? user.currency + ' ' + user.lastSalary : ''}<br>${user.lastOrgName || ''}</td>
                    <td>${user.appliedUserRole || ''}</td>
                    <td>
                        ${user?.attachments?.uploadDocumentUserResumeURL ? 
                            `<a href="javascript:void(0)"  class="btn btn-sm btn-outline-primary" onclick="viewResumeAndPhoto(\'${user?.attachments?.uploadDocumentUserResumeURL}\','viewApplicantsAttachementModal')">View Resume</a>`
                            : '<span class="text-muted">N/A</span>'
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
                        ${user.hasProfessionalDetails > 0
                            ? `<a href="javascript:void(0)" class="btn btn-sm btn-outline-primary" onclick="openUserScreeningProfessionalDetailsModal('${user.id}')">View</a>`
                            : '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                       ${user.isAnswersAvailable > 0 
                            ? `
                                <p class="mb-2">Submitted Date & Time: <br/><strong class="text-primary">${changeDateFormat(new Date(user.answerSubmittedDate), "MMM dd, yyyy hh:mm:ss A")}</strong></p>
                                <a href="javascript:void(0);" class="btn btn-sm btn-outline-primary" onclick="openQAModal('${user.id}')">View</a>
                            ` 
                            : '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                        <p class="mb-1">${user.assignTo && user.assignTo.toLowerCase().includes('syeed') ? 'CEO' : (user.assignTo || 'N/A')}</p>
                        ${user.meetingDetails == "NA" && user.interviewStatus == "NA" ?
                            ""
                            :
                            `<button
                                type="button"
                                class="btn btn-sm btn-outline-primary view-details-btn"
                                data-toggle="popover"
                                data-placement="left"
                                data-html="true"
                                title="<b>Interview Details</b>"
                                data-content="
                                <b>Date & Time:</b> ${user.meetingDetails || 'N/A'} <br>
                                <b>Interview Status:</b> ${user.interviewStatus || 'N/A'} <br>
                            ">
                                View
                            </button>`
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
                                        <a class="dropdown-item meeting-anchor" href="javascript:void(0);" onclick="openUpdateStatusModalUserApplication(${user.id}, '${user.status || ''}', '${user.appliedUserRole}','${user.interviewStatus}','${user.meetingId}','${user.meetingDetails}', '${user.assignToUserId || ''}')">
                                            <i class="fas fa-edit me-2"></i>&nbsp;Update Status
                                        </a>
                                    </li>`;
                                    if((user.status == "Another Round of Interview" || user.status == "Approved For Interview" || user.status == "Final Round of Interview") && user.interviewStatus == 'NA'){
                                        row+=`<li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="openResendInterviewModal(${user.id}, 'InterviewLink', '${user.interviewBookLinkExpireDate}', '${user.status}', '${user.assignToUserId}', '${user.finalSlots}')">
                                                <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Interview Link
                                            </a>
                                        </li>`
                                    }else if((user.status == "Another Round of Interview" || user.status == "Approved For Interview") && user.interviewStatus == 'Booked'){
                                         row+=`<li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="resendInterviewLinkJA(${user.id},'ConfirmationLink')">
                                                <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Confirmation Link
                                            </a>
                                        </li>`
                                    }
                                    if(user.status == "Approved for Selection Process"){
                                        row+=`<li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="showWarningMessageShow('Are you sure you want to resend invitation link?', 'resendTeacherInvitationLink(${user.id})')">
                                                <i class="fas fa-paper-plane me-2"></i>&nbsp;Resend Invitation Link
                                            </a>
                                        </li>`
                                    }
                                    if(user.status == "Accepted for Contract" || user.status == "Contract Drafted" || user.status == "Initiated Contract - Acceptance Pending" || user.status == "Contract Accepted & Police Verification Pending" || user.status == "Police Verification Submitted" || user.status == "Ready for Training & Onboarding"){
                                        row+=`<li>
                                            <a class="dropdown-item" href="javascript:void(0);" onclick="addUserContract('${user.id}', '${user.userName}', '${user.email}', '${user.contractId}', '${user.appliedUserRole}');">
                                                <i class="fas fa-file-contract"></i>&nbsp; ${user.contractId > 0 ? "Edit/View Contract" : "Draft Contract"}
                                            </a>
                                        </li>`;
                                        if(user.status == "Police Verification Submitted"){
                                            row+=`<li>
                                                <a class="dropdown-item" href="javascript:void(0);" onclick="openVerficationModalForOtherRoles('${user.id}');">
                                                    <i class="fas fa-file-contract"></i>&nbsp; View Verification Documents
                                                </a>
                                            </li>`;
                                        }
                                    }
                                    row+=`<li>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="openCommunicationLogsModalForUserApplication(${user.id}, 'USER_SCREENING', 'USER_SCREENING')">
                                            <i class="fas fa-comment me-2"></i>&nbsp;Communication Log
                                        </a>
                                    </li>
                                </ul>
                            </div>`
                            // if(user.status != "Approved for Selection Process"){
                                row += `<div data-toggle="tooltip" data-placement="top" title="Discard">
                                    <i class="fa fa-trash text-danger font-20" aria-hidden="true" style="cursor:pointer;" onclick="showWarningMessage('Are you sure you want to discard this application?', &quot;updateUserApplicationProfile(${user.id}, 'Discard')&quot;)"></i>
                                </div>`
                            // }
                        row +=`</div>
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

async function openUserScreeningProfessionalDetailsModal(entityId){
    var payload = { entityId: entityId, entityType: "USER_SCREENING" };
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-user-screening-professional-details', payload, '/teacher/signup');
    if($("#userScreeningProfessionalDetailsModal").length == 1){
        $("#userScreeningProfessionalDetailsModal").remove();
    }
    $("body").append(
        `<div class="modal fade" id="userScreeningProfessionalDetailsModal" tabindex="-1" role="dialog" aria-labelledby="userScreeningProfessionalDetailsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title" id="userScreeningProfessionalDetailsModalLabel">Professional Details</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" id="userScreeningProfessionalDetailsModalBody" style="max-height: 600px; overflow: auto;"></div>
                </div>
            </div>
        </div>`
    );
    $("#userScreeningProfessionalDetailsModalBody").html(getUserScreeningProfessionalDetailsModalContent(responseData.details));
    $("#userScreeningProfessionalDetailsModal").modal("show");
}

function getUserScreeningProfessionalDetailsModalContent(details){
    if(!details || typeof details === "string"){
        return `<p class="text-center text-muted mb-0">Professional details not found.</p>`;
    }
    var professional = details.professionalDetails || {};
    var attachments = details.attachments || {};
    var totalExpText = `${professional.totalExperianceFromYYYY || 0} Years ${professional.totalExperianceFromMM || 0} Months`;
    var html =
        `<div class="row">
            <div class="col-md-6">
                <div class="border rounded p-3 mb-3">
                    <h6 class="text-primary mb-3">Professional Information</h6>
                    <p class="mb-2"><strong>Highest Qualification:</strong> ${professional.highestQualificationId || "N/A"}</p>
                    <p class="mb-2"><strong>Degree Specialization:</strong> ${professional.educationSpecialization || "N/A"}</p>
                    <p class="mb-2"><strong>Experience:</strong> ${totalExpText}</p>
                    <p class="mb-2"><strong>Last Organization:</strong> ${professional.lastOrganizationName || "N/A"}</p>
                    <p class="mb-2"><strong>Why Hire:</strong> ${professional.lastJobDesc || "N/A"}</p>
                    <p class="mb-0"><strong>Declaration Accepted:</strong> ${professional.declConfirmation === "Y" ? "Yes" : "No"}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="border rounded p-3 mb-3">
                    <h6 class="text-primary mb-3">Attachments</h6>
                    ${renderProfessionalAttachment("Highest Degree", attachments.highestDegreeName, attachments.highestDegreeURL)}
                    ${renderProfessionalAttachment("Updated CV", attachments.updatedCvName, attachments.updatedCvURL)}
                    ${renderProfessionalAttachment("Experience Proof", attachments.experienceProofName, attachments.experienceProofURL)}
                    ${renderProfessionalAttachment("Passport/National ID", attachments.passportIdName, attachments.passportIdURL)}
                    ${renderProfessionalAttachment("Internet Speed Test", attachments.internetSpeedTestName, attachments.internetSpeedTestURL)}
                </div>
            </div>
        </div>`;
    return html;
}

function renderProfessionalAttachment(label, fileName, fileUrl){
    if(fileName && fileUrl){
        return `<div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                    <div>
                        <div class="font-weight-bold">${label}</div>
                        <div class="text-muted">${fileName}</div>
                    </div>
                    <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary" onclick="viewResumeAndPhoto('${fileUrl}','viewApplicantsAttachementModal')">View</a>
                </div>`;
    }
    return `<div class="d-flex justify-content-between align-items-center border rounded p-2 mb-2">
                <div class="font-weight-bold">${label}</div>
                <span class="text-muted">N/A</span>
            </div>`;
}

async function loadUserApplicationData(isToday, callFrom, isTeaching) {
    // var startVal = $("#userScreeningFilterForm #filterStartDate").val();
    // var endVal   = $("#userScreeningFilterForm #filterEndDate").val();
    if (arguments.length > 0) {
        CURRENT_PAGE_USER_APPLICATION = 1;
        USER_APPLICATION_PAGINATION_STATE.isToday = isToday;
        USER_APPLICATION_PAGINATION_STATE.callFrom = callFrom;
        USER_APPLICATION_PAGINATION_STATE.isTeaching = isTeaching;
    }
    try {
        var payload = {};
        payload['schoolId'] = SCHOOL_ID;
        payload['pageNo'] = CURRENT_PAGE_USER_APPLICATION;
        payload['pageSize'] = $("#recordsPerPageJA").val();
        const {
            isToday: lastIsToday,
            callFrom: lastCallFrom,
            isTeaching: lastIsTeaching
        } = USER_APPLICATION_PAGINATION_STATE;
        if (lastIsToday) {
            payload['startDate'] = changeDateFormat(new Date(), "yyyy-mm-dd") + " 00:00:00";
            payload['endDate'] = changeDateFormat(new Date(), "yyyy-mm-dd") + " 23:59:59";
        }
        else if (!lastIsToday && lastCallFrom === "card") {
            payload['startDate'] = "";
            payload['endDate'] = "";
        }
        else {
            payload['startDate'] = USER_APPLICATION_FILTER_STATE.filterValues.startDate
                ? changeDateFormat(new Date(USER_APPLICATION_FILTER_STATE.filterValues.startDate), "yyyy-mm-dd") + " 00:00:00"
                : "";
            payload['endDate'] = USER_APPLICATION_FILTER_STATE.filterValues.endDate
                ? changeDateFormat(new Date(USER_APPLICATION_FILTER_STATE.filterValues.endDate), "yyyy-mm-dd") + " 23:59:59"
                : "";
        }
        payload['userName'] = USER_APPLICATION_FILTER_STATE.filterValues.userName || "";
        payload['phoneNumber'] = USER_APPLICATION_FILTER_STATE.filterValues.phoneNumber || "";
        payload['email'] = USER_APPLICATION_FILTER_STATE.filterValues.email || "";
        if (lastCallFrom === "teachingCard") {
            var teacherRolesString = `${TEACHER_SUB_ROLES.map(r => `'${r}'`).join(",")}`;
            payload['appliedUserRole'] = lastIsTeaching ? teacherRolesString : `${teacherRolesString},'Not Teacher'`;
        } else {
            var role = USER_APPLICATION_FILTER_STATE.filterValues.appliedUserRole;
            payload['appliedUserRole'] = role ? (role.startsWith("'") ? role : `'${role}'`): "";
        }
        payload['assignTo'] = USER_APPLICATION_FILTER_STATE.filterValues.assignTo || "";
        payload['country'] = USER_APPLICATION_FILTER_STATE.filterValues.country || "";
        payload['status'] = USER_APPLICATION_FILTER_STATE.filterValues.status || "";
        // Sorting filter se alag chalti hai — S.No. header icons se control hoti hai.
        var sortBy = USER_APPLICATION_SORT_STATE.sortBy;
        if (sortBy === "id") {
            payload['sortBy'] = "id";
            payload['sortOrder'] = "ASC";
        } else if (sortBy === "latestEntry") {
            payload['sortBy'] = "latestEntry";
            payload['sortOrder'] = "DESC";
        } else {
            payload['sortBy'] = "";
            payload['sortOrder'] = "";
        }
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-user-screening-data', payload, '/teacher/signup');
        if(responseData.statusCode == "SUCCESS"){
            bindUserApplicationData(responseData);
            if(callFrom == "filter" || callFrom == "onLoad"){
                $("#todayRecordsJA").text(responseData.todayRecords);
                $("#totalRecordsJA").text(responseData.overallRecords);
                $("#teachingRecordsJA").text(responseData.teachingRecords);
                $("#nonTeachingRecordsJA").text(responseData.nonTeachingRecords);
            }
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle="popover"]').popover({
                trigger: 'click',
                container: 'body'
            });
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

// S.No. header ke sort icons ke liye. Filter se alag chalti hai, current
// filter/pagination state ko chhue bina sirf sort apply karke data reload karti hai.
function applyUserApplicationSort(sortBy) {
    USER_APPLICATION_SORT_STATE.sortBy = sortBy;
    updateUserApplicationSortIcons();
    CURRENT_PAGE_USER_APPLICATION = 1;
    loadUserApplicationData();
}

// Active sort icon ko glow karti hai, baaki ko dim. Default ("") par koi glow nahi.
function updateUserApplicationSortIcons() {
    var active = USER_APPLICATION_SORT_STATE.sortBy;
    $(".user-application-sort-icon").each(function () {
        var iconSort = $(this).data("sort");
        if (active && String(iconSort) === String(active)) {
            $(this).addClass("text-warning").removeClass("text-white");
        } else {
            $(this).removeClass("text-warning").addClass("text-white");
        }
    });
}

function resetUserApplication() {
    $('#userScreeningFilterForm')[0].reset();
    $('#userScreeningFilterForm #filterCountryId').val('0').trigger('change');
    $("#filterAppliedUserRole").val("").trigger("change");
    $("#applicantsStatus").val("").trigger("change");
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
        status: $("#userScreeningFilterForm #applicantsStatus").val().trim(),
        startDate: $("#userScreeningFilterForm #filterStartDate").val(),
        endDate:  $("#userScreeningFilterForm #filterEndDate").val(),
        assignTo:  $("#userScreeningFilterForm #filterAssignedTo").val(),
    };
}

function openUpdateStatusModalUserApplication(id, status, role, interviewStatus, meetingId, meetingDetails, assignToUserId){
    if($("#userApplicationProfileStatusModal").length == 1){
        $("#userApplicationProfileStatusModal").remove();
    }
    $("body").append(userApplicationProfileStatusModal(id, status, role, interviewStatus));
    $("#userApplicationProfileStatusForm").attr("data-current-assign-to", assignToUserId || "");
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
    initUserApplicationSelect2Fields("#userApplicationProfileStatusModal");
    if(meetingId!=''){
        var trRow =
            `<tr>
                <td>${meetingDetails}</td>
                <td>${interviewStatus}</td>
                <td>`
                    if(interviewStatus== "Completed" || interviewStatus == "No Show"){
                        trRow+=
                        `<a href="javascript:void(0)" class="btn btn-sm" title="Play Recording" onclick="openRecordingModal('${meetingId}', 'MEETINGS', '', 'Interview', '', '', '', '', '', 'USER_APPLICATIONS', '')">
                            <i class="fa fa-video-camera fa-2x text-danger"></i>
                        </a>`;
                    }else{
                        trRow+=`N/A`;
                    }
                trRow+=`</td>
            </tr>`;
        
        $("#jobApplicationMeetingsTable tbody").html(trRow);
        $("#jobApplicationMeetingsTable").show();
    }else{
        $("#jobApplicationMeetingsTable").hide();
    }
    

    if(status == "On Hold"){
        $("#userApplicationProfileStatus option[value='On Hold']").remove()
    }
    setTimeout(() => {
        $("#userApplicationProfileStatusModal").modal("show");
    }, 200);
}

function eventStatuschangeEvent(src, applicationStatus){
    var status = $(src).val();
    var roleVal = $("#uaRole").val();

    if (status === "COMPLETED" || status === "NOTATTENDED") {

        if($("#userApplicationProfileStatus option[value='Another Interview']").length){
            return;
        }

        if(applicationStatus != "Final Round of Interview"){
            if($("#userApplicationProfileStatus option[value='Another Round of Interview']").length === 0) {
                $("#userApplicationProfileStatus option[value='0']").after('<option value="Another Round of Interview">Another Round of Interview</option>');
            }
        }else{
            $("#userApplicationProfileStatus option[value='Another Round of Interview']").remove();
        }

        $("#userApplicationProfileStatus").parent().show();

        if(applicationStatus == "Approved For Interview" || applicationStatus == "Another Round of Interview"){
            if($("#userApplicationProfileStatus option[value='Final Round of Interview']").length === 0) {
                $("#userApplicationProfileStatus option[value='Another Round of Interview']").after('<option value="Final Round of Interview">Final Round of Interview</option>');
            }
        }else{
            if($("#userApplicationProfileStatus option[value='Final Round of Interview']").length > 0) {
                $("#userApplicationProfileStatus option[value='Final Round of Interview']").remove(); 
            }
        }

        if(!TEACHER_SUB_ROLES.includes(roleVal) &&
           (applicationStatus == "Approved For Interview" ||
            applicationStatus == "Another Round of Interview" ||
            applicationStatus == "Final Round of Interview")){

            if($("#userApplicationProfileStatus option[value='Professional Details Step']").length === 0){
                $("#userApplicationProfileStatus").append('<option value="Professional Details Step">Professional Details Step</option>');
            }else{
                $("#userApplicationProfileStatus option[value='Professional Details Step']").show();
            }

        }else{
            $("#userApplicationProfileStatus option[value='Professional Details Step']").hide();
        }

    }else{

        if($("#userApplicationProfileStatus option[value='Another Interview']").length > 0) {
            $("#userApplicationProfileStatus option[value='Another Interview']").remove();
        }

        if($("#userApplicationProfileStatus option[value='Final Round of Interview']").length > 0) {
            $("#userApplicationProfileStatus option[value='Final Round of Interview']").remove(); 
        }

        $("#userApplicationProfileStatus option[value='Accepted for Contract']").hide();
        $("#userApplicationProfileStatus option[value='Professional Details Step']").hide();

        $("#userApplicationProfileStatus").val("0").trigger("change");

        if (status === "CANCELLED" || status === "RESCHEDULE") {
            $("#userApplicationProfileStatus").parent().hide();
        }
    }
}

function validateFinalRoundBeforeConfirmUpdateStatus() {
    const selectedStatus = $("#userApplicationProfileStatus").val();
    if (!selectedStatus) {
        showMessageTheme2(2, "Please select status");
        return false;
    }

    if (!$("#userApplicationProfileStatusForm #assignedToInterview").val()) {
        showMessageTheme2(2, "Please select assign to");
        return false;
    }

    const slots = buildFinalSlotArray("userApplicationProfileStatusForm");
    if (!slots) return false;

    const remarks = $("#userApplicationProfileRemarks").val()?.trim();
    if (!remarks || remarks.length < 25) {
        showMessageTheme2(2, "Remarks can not be less than 25 characters.");
        return false;
    }

    return true;
}

async function updateUserApplicationProfile(id, status) {
    const selectedStatus = $("#userApplicationProfileStatus").val();
    if (selectedStatus === "Final Round of Interview") {
        if (!validateFinalRoundBeforeConfirmUpdateStatus()) {
            return;
        }
        if($("#finalSlotConfirmModal").length){
            $("#finalSlotConfirmModal").remove();
        }
        $("body").append(finalSlotConfirmationModal());
        $("#finalSlotConfirmModal").modal("show");
        $("#finalSlotYesBtn").off("click").on("click", async function () {
            $("#finalSlotConfirmModal").modal("hide");
            await proceedUpdateUserApplicationProfile(id, status);
        });
        $("#finalSlotNoBtn").off("click").on("click", function () {
            $("#finalSlotConfirmModal").modal("hide");
        });
        return;
    }
    if (selectedStatus === "Approved For Interview") {
        const assignedToElement = $("#userApplicationProfileStatusForm #assignedToInterview");
        const assignedToValue = assignedToElement.val();
        if (!assignedToValue) {
            showMessageTheme2(2, "Please select assign to");
            return;
        }
        const assignedToText = assignedToElement.find("option:selected").text() || "";
        const counselorName = assignedToText.split(" - (")[0].trim() || "the selected counselor";
        showWarningMessageShow(
            `Are you sure you want to assign this application to ${counselorName}?`,
            `confirmApprovedForInterviewAssignment(${id}, ${JSON.stringify(status)})`
        );
        return;
    }
    await proceedUpdateUserApplicationProfile(id, status);
}

async function confirmApprovedForInterviewAssignment(id, status) {
    await proceedUpdateUserApplicationProfile(id, status);
}

async function proceedUpdateUserApplicationProfile(id, status){
    if (status === "Discard") {
        const payload = {
            sessionUserId: USER_ID,
            entityId: id,
            entityType: "INITIAL-INTERVIEW",
            status: "Discard",
            remarks: "Discarded",
            sessionUserId: USER_ID
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
    var eventStatus = $("#eventStatus").val();
    if(status=='Booked'){
        if(eventStatus == null || eventStatus == undefined || eventStatus == ""){
            showMessageTheme2(2, "Please select interview status");
            return false;
        }
    }
    var selectedStatus = $("#userApplicationProfileStatus").val();
    var duration=15;
    if(selectedStatus == null || selectedStatus == undefined || selectedStatus == ""){
        showMessageTheme2(2, "Please select status");
        return false;
    }
    if(selectedStatus == "Approved For Interview" || selectedStatus == "Another Round of Interview" || selectedStatus == "Final Round of Interview" || selectedStatus == "Update Assign To"){
        if($("#userApplicationProfileStatusForm #assignedToInterview").val() == ""){
            showMessageTheme2(2, "Please select assign to");
            return false;
        }
        if (selectedStatus != "Update Assign To") {
            duration=$('#duration').val();
        }
    }else if(selectedStatus == "Step 2 | Few Questions"){
        if ($("#userApplicationProfileStatusForm #selectedQuestions .sortable-item").length === 0) {
            showMessageTheme2(2, "Please select any question");
            return false;
        }
    }
    var slotArray = [];
    if(selectedStatus == "Final Round of Interview"){
        slotArray = buildFinalSlotArray("userApplicationProfileStatusForm");
        if (!slotArray) return false;
    }
    var remarks = $("#userApplicationProfileRemarks").val()?.trim();
    if (selectedStatus === "Update Assign To") {
        // Remarks are optional for reassignment-only updates.
    } else if (selectedStatus === "Step 2 | Few Questions") {
        if (remarks && remarks.length < 25) {
            showMessageTheme2(2, "Remarks can not be less than 25 characters.");
            return false;
        }
    } else {
        if (!remarks) {
            showMessageTheme2(2, "Please enter remarks");
            return false;
        } else if (remarks.length < 25) {
            showMessageTheme2(2, "Remarks can not be less than 25 characters.");
            return false;
        }
    }
    var finalQuestionsArr = [];
    $("#userApplicationProfileStatusForm #selectedQuestions .sortable-item").each(function (index) {
        finalQuestionsArr.push({
            questionText: $(this).data("text"),
            questionType: $(this).data("type"),
            displayOrder: index + 1
        });
    });
    var payload = {};
    payload["sessionUserId"] = USER_ID;
    payload["entityId"] = id;
    payload["entityType"] = (selectedStatus == "Verification Accepted & Redirect to Bank Details" || selectedStatus == "Professional Details Step" || selectedStatus == "Accepted for Contract")
        ? "USER_SCREENING"
        : "INITIAL-INTERVIEW";
    payload["assignTo"] = $("#userApplicationProfileStatusForm #assignedToInterview").val();
    payload["questions"] = finalQuestionsArr;
    payload["status"] = $("#userApplicationProfileStatus").val();
    payload["remarks"] = $("#userApplicationProfileRemarks").val();
    payload["duration"] = duration;
    payload["eventStatus"] = eventStatus;
    payload["slotsList"] = slotArray;
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
    if(responseData.status == "SUCCESS"){
        // if(selectedStatus == 'Reject'){
        //     $("#userApplicationTable tbody #tr_"+id).remove();
        // }else{
            // var assignedToText = $("#userApplicationProfileStatusForm #assignedToInterview option:selected").text();
            // var displayName = assignedToText.split("-")[0].trim();
            // updateTableRowDirectly(id, selectedStatus, displayName);
        // }
        showMessageTheme2(1, selectedStatus == "Step 2 | Few Questions" ? "Questions sent successfully!" : responseData.message);
        loadUserApplicationData(false, "filter");
        $("#userApplicationProfileStatusModal").modal("hide");
        $("#newApplicationText"+String(id)).remove();
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

async function applicantsViewAssignToListForInterview(role){
    var selectedStatus = $("#userApplicationProfileStatus").val();
    if(selectedStatus == "Approved For Interview" || selectedStatus == "Another Round of Interview" || selectedStatus == "Final Round of Interview" || selectedStatus == "Update Assign To"){
        let payload = {}
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
        bindAssignToJA('userApplicationProfileStatusForm', 'assignedToInterview', responseData);
        var currentAssignTo = $("#userApplicationProfileStatusForm").attr("data-current-assign-to") || "";
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").show();
        $("#userApplicationProfileStatusForm #questionsDiv").hide();
        $("#userApplicationProfileStatusForm #remarksPara").addClass("d-none");
        $("#updateUserApplicationProfileBtn").text("Save");
        $("#userApplicationProfileStatusForm #assignedToInterview").val(currentAssignTo).trigger("change");
        if(selectedStatus == "Update Assign To"){
            $("#userApplicationProfileStatusForm #interviewValidDate").closest(".col-md-6").hide();
            $("#userApplicationProfileStatusForm #durationDiv").hide();
            $("#userApplicationProfileStatusForm #finalInterviewSlotsWrapper").hide();
        }else{
            const interviewBookLinkValidityDaysSetting = getSettingsByTypeAndKey('CONFIGURATION','INTERVIEW_BOOK_LINK_VALIDITY_DAYS');
            const interviewBookLinkValidityDays = JSON.parse(interviewBookLinkValidityDaysSetting).data.metaValue
            var today = new Date();
            today.setDate(today.getDate() + parseInt(interviewBookLinkValidityDays));
            $("#userApplicationProfileStatusForm #interviewValidDate")
                .datepicker({
                    format: "M dd, yyyy",
                    autoclose: true
                }).datepicker("setDate", today);
            $("#userApplicationProfileStatusForm #interviewValidDate").closest(".col-md-6").show();
        }
        if(selectedStatus == "Approved For Interview"){
            $("#userApplicationProfileStatusForm #durationDiv").hide();
        }else if(selectedStatus != "Update Assign To"){
            $("#userApplicationProfileStatusForm #durationDiv").show();
        }
        if(selectedStatus == "Final Round of Interview"){
            $("#duration option[value='15']").remove();
            renderFinalInterviewSlots("userApplicationProfileStatusForm");
            // $(".slot-date").datepicker({
            //     format: "M dd, yyyy",
            //     autoclose: true,
            //     startDate: new Date()
            // })
            // $(".slot-start-time").select2({
            //     placeholder: "Select time",
            //     theme:"bootstrap4"
            // });
            $("#userApplicationProfileStatusForm #finalInterviewSlotsWrapper").show();
        }else{
            if($("#duration option[value='15']").length === 0) {
                $("#duration option[value='30']").before('<option value="15">15 Min</option>');
            }
            $("#userApplicationProfileStatusForm #finalInterviewSlotsWrapper").hide();
        }
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
            bindQuestionsToJA('userApplicationProfileStatusForm', responseData);
        }
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").hide();
        $("#userApplicationProfileStatusForm #questionsDiv").show();
        $("#userApplicationProfileStatusForm #durationDiv").hide();
        $("#userApplicationProfileStatusForm #remarksPara").removeClass("d-none");
        $("#updateUserApplicationProfileBtn").text("Send Questions");
        $("#userApplicationProfileStatusForm #finalInterviewSlotsWrapper").hide();
    }else{
        $("#userApplicationProfileStatusForm #assignedToInterviewDiv").hide();
        $("#userApplicationProfileStatusForm #questionsDiv").hide();
        $("#userApplicationProfileStatusForm #durationDiv").hide();
        $("#userApplicationProfileStatusForm #assignedToInterview").val("").trigger("change");
        $("#userApplicationProfileStatusForm #interviewValidDate").closest(".col-md-6").show();
        $("#userApplicationProfileStatusForm #questions").val("").trigger("change");
        $("#userApplicationProfileStatusForm #remarksPara").addClass("d-none");
        $("#updateUserApplicationProfileBtn").text("Save");
        $("#userApplicationProfileStatusForm #finalInterviewSlotsWrapper").hide();
    }
}

async function resendInterviewLinkJA(id, mailName, status){
    if(mailName == "InterviewLink"){
        if($("#resendInterviewForm #interviewBookLinkExpireDate").val() == ""){
            showMessageTheme2(0, "Please select the validity date for the interview")
            return false;
        }
        if(isExpired($("#resendInterviewForm #interviewBookLinkExpireDate").val())){
            showMessageTheme2(0, "Please select a future validity date.")
            return false;
        }
        if(status == "Final Round of Interview"){
            if($("#resendInterviewForm #assignedToInterview").val() == ""){
                showMessageTheme2(2, "Please select assign to");
                return false;
            }
            var slotArray = [];
            slotArray = buildFinalSlotArray("resendInterviewForm");
            if (!slotArray) return false;
        }
    }
    var duration = $("#resendInterviewForm #duration").val()
    var payload = {}
    payload["entityId"] = id;
    payload["entityType"] = duration == "15" ? "INITIAL-INTERVIEW" : "INTERVIEW";
    if(mailName=='InterviewLink'){
        payload["interviewBookLinkExpireDate"] = changeDateFormat(new Date($("#resendInterviewForm #interviewBookLinkExpireDate").val()), "yyyy-mm-dd");
        payload["status"] = 'Resend Interview Link';
        if(status == "Final Round of Interview"){
            payload["assignTo"] = $("#resendInterviewForm #assignedToInterview").val();
            payload["duration"] = duration;
            payload["slotsList"] = slotArray;
            payload["eventStatus"] = status;
        }
    }else{
        payload["status"] = 'Resend Confirmation Link';
    }
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
    if(responseData.status == "SUCCESS"){
        showMessageTheme2(1, responseData.message);
        if(mailName=='InterviewLink'){
            $("#resendInterviewModal").modal("hide");
        }
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

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

function bindQuestionsToJA(formId, responseData) {
    const available = $("#" + formId + " #availableQuestions");
    const selected = $("#" + formId + " #selectedQuestions");

    available.empty();
    selected.empty();

    const common = responseData.data.commonQuestions || [];
    const role = responseData.data.roleQuestions || [];
    const allQuestions = [...common, ...role];

    if (allQuestions.length === 0) {
        available.html(`<li class="list-group-item text-muted">No questions found</li>`);
        return;
    }

    allQuestions.forEach(q => {
        available.append(`
            <li class="list-group-item sortable-item bg-gradient-custom-blue"
                data-id="${q.id}"
                data-text="${q.questionText}"
                data-type="${q.questionType}">
                
                <i class="fa fa-arrows text-primary mr-2"></i>
                ${q.questionText}
                ${q.questionType === "M" ? `<span class="text-danger">*</span>` : ``}
                (${q.roleType})
            </li>
        `);
    });

    enableDualSortable();
}

let activeApplicantAttachmentBlobUrl = null;

function resolveApplicantAttachmentUrl(url) {
    if (!url) return "";

    // Always preview/download via same-origin endpoints to avoid browser CSP
    // connect-src restrictions against third-party domains (e.g. S3) when using fetch().
    var trimmedUrl = String(url || "").trim();
    if (trimmedUrl.indexOf("/common/download/") !== -1 || trimmedUrl.indexOf("/common/downloads") !== -1) {
        return trimmedUrl;
    }

    // If it's a full URL, extract the file key (last path segment).
    var fileKey = trimmedUrl;
    if (trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")) {
        var cleanUrl = trimmedUrl.split("?")[0].split("#")[0];
        fileKey = cleanUrl.substring(cleanUrl.lastIndexOf("/") + 1);
    }

    // Stream via AWS/public lookup endpoint (works even if file isn't on local disk).
    return APP_BASE_URL + SCHOOL_UUID + "/common/download/" + encodeURIComponent(fileKey);
}

async function viewResumeAndPhoto(url, modalId){

    var attachmentType = getExtension(url);
    var attachmentData = await urlToBlobUrl(url, attachmentType);

    if (!attachmentData) {
        return;
    }

    releaseApplicantAttachmentBlobUrl();
    activeApplicantAttachmentBlobUrl = attachmentData.blobUrl;

    if (attachmentData.attachmentType != 'pdf') {

        $("#" + modalId + " .upload_img img").attr('src', attachmentData.blobUrl);
        $("#" + modalId + ' .upload_img').removeClass("d-none");
        $("#" + modalId + " .upload_pdf").addClass("d-none");
    } else {

        $("#" + modalId + " .upload_pdf .pre_upload_pdf").remove();

        var iframeTag = $("<iframe class=\"pre_upload_pdf full border-0\" style=\"height: 400px; width: 100%;\" referrerpolicy=\"no-referrer\" allowfullscreen></iframe>");
        iframeTag.attr("src", attachmentData.blobUrl + "#toolbar=0&navpanes=0&scrollbar=1");

        $("#"+modalId+" #pre_upload_pdf_div").append(iframeTag);
        $("#" + modalId + " .upload_pdf a.download-pdf-btn").attr("href", attachmentData.sourceUrl);
        $("#" + modalId + " .upload_pdf a.open-pdf-btn").attr("href", attachmentData.sourceUrl);
        $("#" + modalId + " .upload_pdf").removeClass("d-none");
        $("#" + modalId + ' .upload_img').addClass("d-none");
    }

    customLoader(false);
    $("#" + modalId).modal("show");
}

function getExtension(url) {
    if (!url) return "";

    var cleanUrl = url.split('?')[0].split('#')[0];
    var fileName = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);

    if (fileName.indexOf('.') === -1) {
        return "";
    }

    return fileName.split('.').pop().toLowerCase();
}

function releaseApplicantAttachmentBlobUrl() {
    if (activeApplicantAttachmentBlobUrl) {
        URL.revokeObjectURL(activeApplicantAttachmentBlobUrl);
        activeApplicantAttachmentBlobUrl = null;
    }
}

async function urlToBlobUrl(url, attachmentType) {
    customLoader(true);

    try {
        var resolvedUrl = resolveApplicantAttachmentUrl(url);
        var response = await fetch(resolvedUrl, { method: "GET" });
        if (!response.ok) {
            throw new Error("Failed to fetch attachment");
        }

        var contentType = (response.headers.get("content-type") || "").toLowerCase();
        var resolvedAttachmentType = contentType.indexOf("pdf") !== -1
            ? "pdf"
            : (contentType.indexOf("image/") !== -1 ? "image" : attachmentType);
        var blob = await response.blob();

        if (resolvedAttachmentType === "pdf" && blob.type !== "application/pdf") {
            blob = new Blob([blob], { type: "application/pdf" });
        }

        return {
            attachmentType: resolvedAttachmentType,
            blobUrl: URL.createObjectURL(blob),
            sourceUrl: resolvedUrl
        };
    } catch (error) {
        showMessageTheme2(0, "Unable to preview this file. Please use download/open instead.");
        return null;
    } finally {
        customLoader(false);
    }
}

$(document).off("hidden.bs.modal.userApplicationAttachment", "#viewApplicantsAttachementModal").on("hidden.bs.modal.userApplicationAttachment", "#viewApplicantsAttachementModal", function () {
    releaseApplicantAttachmentBlobUrl();
    $(this).find(".upload_img img").attr("src", "");
    $(this).find(".upload_pdf .pre_upload_pdf").remove();
    $(this).find(".upload_pdf").addClass("d-none");
    $(this).find(".upload_img").addClass("d-none");
});

function openCommunicationLogsModalForUserApplication(userId, userRole, callFrom){
    if($("#userApplicationCommunicationLogsModal").length == 1){
        $("#userApplicationCommunicationLogsModal").remove();
    }
    $("body").append(communicationLogsContentForUserApplication(userId, userRole, callFrom));
    initUserApplicationSelect2Fields("#userApplicationCommunicationLogsModal");
    initEditor(1, 'commentEditorJA','Enter comments', false, ckEditorCountValidate);
    $("#fileuploadLog7").on("change",function(){
        var attachment = $("#fileuploadLog7").val().split("\\")[2]
        $("#fileuploadLog7Span").text(attachment);
    });
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

async function saveCommunicationLogJA(formId, userId, userRole, callFrom){
    if(editor1.getData()==null || editor1.getData()=='' || editor1.getData()=='undefined'){
        showMessageTheme2(0,"Comments mandatory",'',true);
		return false;
    }
	if(editor1.getData().length>2999){
		showMessageTheme2(0,"Comments can not be more than 3000 characters.",'',true);
		return false;
	}
    if(editor1.getData().length<25){
		showMessageTheme2(0,"Comments can not be less than 25 characters.",'',true);
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
        if(callFrom == "USER_SCREENING"){
            $("#newApplicationText"+userId).remove();
            loadUserApplicationData(false, "filter");
        }
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
    });
    $("#addQuestionsModal #filterRoleType").select2({
        // placeholder: "Select User Role",
        theme:"bootstrap4"
    });
    getAllQuestions();
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
        $("body").append(qaModalContent(responseData));
        setTimeout(() => {
            $("#qaModal").modal("show");
        }, 300);
    }
}

function setFilterDatesAccordingly(src, startDateId, endDateId) {
    const value = $(src).val();
    const today = new Date();

    // Custom par hi Start/End date fields dikhein, baaki options par invisible.
    // visibility use kar rahe hain (display nahi) taaki Duration ka size same rahe.
    const startFieldWrapper = $(startDateId).closest(".user-application-date-field");
    const endFieldWrapper = $(endDateId).closest(".user-application-date-field");
    if (value === "Custom") {
        startFieldWrapper.css("visibility", "visible");
        endFieldWrapper.css("visibility", "visible");
    } else {
        startFieldWrapper.css("visibility", "hidden");
        endFieldWrapper.css("visibility", "hidden");
    }

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
        $(startDateId + "," + endDateId).val(d).prop("disabled", true).addClass("bg-light-primary");
        return;
    }

    if (value === "Yesterday") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const d = changeDateFormat(yesterday, "MMM-dd-yyyy");
        $(startDateId + "," + endDateId).val(d).prop("disabled", true).addClass("bg-light-primary");
        return;
    }

    if (value === "Week") {
        $(startDateId).val(changeDateFormat(getStartOfWeek(today), "MMM-dd-yyyy")).prop("disabled", true).addClass("bg-light-primary");
        $(endDateId).val(changeDateFormat(getEndOfWeek(today), "MMM-dd-yyyy")).prop("disabled", true).addClass("bg-light-primary");
        return;
    }

    if (value === "Month") {
        $(startDateId).val(changeDateFormat(getStartOfMonth(today), "MMM-dd-yyyy")).prop("disabled", true).addClass("bg-light-primary");
        $(endDateId).val(changeDateFormat(getEndOfMonth(today), "MMM-dd-yyyy")).prop("disabled", true).addClass("bg-light-primary");
        return;
    }
    $(startDateId).val("").prop("disabled", false).removeClass("bg-light-primary");
    $(endDateId).val("").prop("disabled", true).addClass("bg-light-primary");
    $(startDateId).off("change").on("change", function () {
        $(endDateId).val("").prop("disabled", false).removeClass("bg-light-primary");
        $(endDateId).datepicker("setStartDate", $(startDateId).val());
    });
    $(endDateId).off("change").on("change", function () {
        var endVal = $(endDateId).val();
        if (!endVal || endVal.trim() === "") return;
    });
}

async function getAllQuestions(){
    var payload = {}
    payload["schoolId"] = SCHOOL_ID;
    payload["roleType"] = $("#addQuestionsModal #filterRoleType").val();
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
        $("#allQuestionsWrapper").html(allQuestionsContent(responseData.data));
        if($("#allQuestionsWrapper").html().includes("No questions available")){
            $("#changeQuesPriorityBtnWrapper").addClass("d-none").removeClass("d-flex");
        }else{
            $("#changeQuesPriorityBtnWrapper").addClass("d-flex").removeClass("d-none");
        }
    }
}

function enablePriorityChange() {
    ORIGINAL_ORDER_BACKUP = {};
    sortableInstances = {};
    $(".sortable-group").each(function () {
        const role = $(this).attr("data-role") || "Common";
        ORIGINAL_ORDER_BACKUP[role] = [];

        $(this).find(".sortable-item").each(function () {
            ORIGINAL_ORDER_BACKUP[role].push({
                id: $(this).data("id"),
                html: $(this).prop("outerHTML")
            });
        });
    });

    $(".sortable-group").each(function () {
        const role = $(this).attr("data-role") || "Common";
        sortableInstances[role] = new Sortable(this, {
            animation: 150,
            ghostClass: "bg-light-primary",
            handle: ".list-group-item",
            group: {
                put: false,
                pull: false
            }
        });
    });
    $(".list-group-item").addClass("cursor");
    $(".fa-arrows-v").removeClass("d-none");
    $("#changePriorityBtn").addClass("d-none");
    $("#saveOrderBtn").removeClass("d-none");
    $("#cancelOrderBtn").removeClass("d-none");
    $(".revert-role-btn").removeClass("d-none");
}

async function saveNewOrder() {
    let rolesPayload = {};
    $(".sortable-group").each(function () {
        const roleType = $(this).attr("data-role") || "Common";
        let orders = [];
        $(this).find(".sortable-item").each(function (index) {
            orders.push({
                id: $(this).data("id"),
                displayOrder: index + 1
            });
        });
        rolesPayload[roleType] = orders;
    });
    const payload = {
        schoolId: SCHOOL_ID,
        roles: rolesPayload
    };
    console.log("FINAL ONE-SHOT PAYLOAD:", payload);
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "update-job-application-question-order",
        body: payload,
        global: true,
        showMessage: true,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    await callCommonAjax(ajaxReqDetails);
    showMessageTheme2(1, "Questions priority updated successfully!");
    $(".list-group-item").removeClass("cursor");
    $(".fa-arrows-v").addClass("d-none");
    $("#changePriorityBtn").removeClass("d-none");
    $("#saveOrderBtn").addClass("d-none");
    $("#cancelOrderBtn").addClass("d-none");
    await getAllQuestions();
}

function cancelPriorityChange() {
    Object.keys(sortableInstances).forEach(role => {
        if (sortableInstances[role]) {
            sortableInstances[role].destroy();
        }
    });
    Object.keys(ORIGINAL_ORDER_BACKUP).forEach(role => {
        let ulSelector = role === "Common"
            ? `.sortable-group[data-role="Common"]` 
            : `.sortable-group[data-role="${role}"]`;

        const ul = $(ulSelector);
        ul.html("");

        ORIGINAL_ORDER_BACKUP[role].forEach(item => {
            ul.append(item.html);
        });
    });
    $(".list-group-item").removeClass("cursor");
    $(".fa-arrows-v").addClass("d-none");
    $("#changePriorityBtn").removeClass("d-none");
    $("#saveOrderBtn").addClass("d-none");
    $("#cancelOrderBtn").addClass("d-none");
    $(".revert-role-btn").addClass("d-none");
}

function revertSingleRole(role) {
    if (!ORIGINAL_ORDER_BACKUP[role]) return;
    let ulSelector = role === "Common"
        ? `.sortable-group[data-role="Common"]`
        : `.sortable-group[data-role="${role}"]`;
    const ul = $(ulSelector);
    ul.html("");
    ORIGINAL_ORDER_BACKUP[role].forEach(item => {
        ul.append(item.html);
    });
    ul.find(".fa-arrows-v").removeClass("d-none");
}

function enableDualSortable() {
    new Sortable(document.getElementById("availableQuestions"), {
        group: {
            name: "questions",
            pull: true,
            put: true
        },
        animation: 150,
        ghostClass: "bg-light-primary",
        onAdd: function (evt) {
            syncGradientClasses();
            updateBulkButtonsVisibility();
        },
        onRemove: function () {
            syncGradientClasses();
            updateBulkButtonsVisibility();
        }
    });

    new Sortable(document.getElementById("selectedQuestions"), {
        group: {
            name: "questions",
            pull: true,
            put: true
        },
        animation: 150,
        ghostClass: "bg-light-primary",
        onAdd: function (evt) {
            syncGradientClasses();
            updateBulkButtonsVisibility();
        },
        onRemove: function () {
            syncGradientClasses();
            updateBulkButtonsVisibility();
        }
    });
    syncGradientClasses();
    updateBulkButtonsVisibility();
}

function syncGradientClasses() {
    $("#availableQuestions .sortable-item").removeClass("bg-gradient-custom-green").addClass("bg-gradient-custom-blue");
    $("#selectedQuestions .sortable-item").removeClass("bg-gradient-custom-blue").addClass("bg-gradient-custom-green");
}

function addAllQuestions() {
    $("#availableQuestions .sortable-item").each(function () {
        $("#selectedQuestions").append(this);
    });
    syncGradientClasses();
    updateBulkButtonsVisibility();
}

function removeAllQuestions() {
    $("#selectedQuestions .sortable-item").each(function () {
        $("#availableQuestions").append(this);
    });
    syncGradientClasses();
    updateBulkButtonsVisibility();
}

function updateBulkButtonsVisibility() {
    if ($("#availableQuestions .sortable-item").length > 0) {
        $("#addAllQuestionsBtn").show();
    } else {
        $("#addAllQuestionsBtn").hide();
    }

    if ($("#selectedQuestions .sortable-item").length > 0) {
        $("#removeAllQuestionsBtn").show();
    } else {
        $("#removeAllQuestionsBtn").hide();
    }
}

$(document).on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
        if (
            !$(this).is(e.target) &&
            $(this).has(e.target).length === 0 &&
            $('.popover').has(e.target).length === 0
        ) {
            $(this).popover('hide');
        }
    });
});

function wordsCountValidate(src, counterEleId){
	var val = $(src).val();
    var id = $(src).attr("id");
    var minlength = $(src).attr("minlength");
    var counterId = "#"+counterEleId;

    // update counter live
    $(counterId).text(val.length + " / " + minlength);

    // visual feedback
    if (val.length < minlength) {
        $(src).addClass("is-invalid");
        $(counterId).attr("class", "text-red");
    } else {
        $(src).removeClass("is-invalid");
        $(counterId).attr("class", "text-success");
    }
}

function ckEditorCountValidate(editor, elementId, counterEleId) {

    // get plain text from CKEditor
    const text = editor.getData()
        .replace(/<[^>]*>/g, '')
        .trim();

    const minlength = $("#" + elementId).attr("minlength") || 25;
    const length = text.length;

    const counterId = "#" + counterEleId;

    $(counterId).text(length + " / " + minlength);

    if (length < minlength) {
        $(".ck-editor__editable").css({"border-color":"red"});
        $("#" + elementId).addClass("is-invalid");
        $(counterId).removeClass("text-success text-muted").addClass("text-red");
        return false;
    }
    else {
        $("#" + elementId).removeClass("is-invalid");
        $(".ck-editor__editable").css({"border-color":"green"});
        $(counterId).removeClass("text-red text-muted").addClass("text-success");
        return true;
    }
}

async function openResendInterviewModal(userId, mailName, expiredDate, status, assignToUserId, finalSlots){
    $("#resendInterviewModal").remove();
    $("body").append(resendInterviewModalContent(userId, mailName, status));
    $("#resendInterviewModal").modal("show");
    if(status == "Final Round of Interview"){
        var payload = {}
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
        bindAssignToJA('resendInterviewForm', 'assignedToInterview', responseData);
        $("#resendInterviewForm #assignedToInterview").select2({
            placeholder: "Select Assign To",
            theme:"bootstrap4"
        });
        $("#resendInterviewForm #assignedToInterview").val(assignToUserId).trigger("change");
        renderFinalInterviewSlots("resendInterviewForm", finalSlots);
        $("#resendInterviewForm #finalInterviewSlotsWrapper").show();
    }
    toggleExpiredIcon(expiredDate);
    $("#resendInterviewForm #interviewBookLinkExpireDate").datepicker({
        format: "M dd, yyyy",
        autoclose: true,
        startDate: new Date(expiredDate)
    })
    .datepicker("setDate", new Date(expiredDate))
    .on("changeDate", function (e) {
        toggleExpiredIcon(e.date);
    });
}

function toggleExpiredIcon(dateValue) {
    if (isExpired(dateValue)) {
        $("#resendInterviewForm .fa-exclamation-triangle").removeClass("d-none");
    } else {
        $("#resendInterviewForm .fa-exclamation-triangle").addClass("d-none");
    }
}

async function resendTeacherInvitationLink(id){
    var payload = {}
    payload["entityId"] = id;
    payload["entityType"] = "USER_SCREENING";
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/resend-invitation-mail",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        showMessageTheme2(1, responseData.message);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

async function getHiringSubRoleByRoleName(roleName){
    var payload = {}
    payload["roleName"] = roleName;
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/get-hiring-sub-role-by-role-name",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        return responseData.hiringSubRole;
    }else{
        showMessageTheme2(0, responseData.message)
    }
}


async function addUserContract(userId, name, email, contractId, role) {
    $("#addUserContractModal").remove();
    var payload = {};
    payload['entityId'] = parseInt(userId);
    payload['entityType'] = "USER_SCREENING";
    if(parseInt(contractId) > 0){
        payload['contractId'] = parseInt(contractId);
        payload['actionType'] = "V";
    }
	payload = "?payload="+encode(JSON.stringify(payload));
    var ajaxReqDetails = {
        method: "GET",
        url: getURLForHTML("", "partner-contract-details" + payload),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var responseData = await callCommonAjax(ajaxReqDetails);
    $("body").append(addUserContractModal(responseData.details, userId, name, email, contractId, role));
    
    if (contractId != 0) {
        $("#publishUserContractBtn").show();
        $("#previewUserContractBtn").show();
    }
    
    setTimeout(() => {
        $("#addUserContractModal").modal("show");
    }, 300);
        
    initializeCountryStateCity("userContractForm", "userContractCountry", "userContractState", "userContractCity");

	if (responseData.details.countryId) {
		setTimeout(() => {
			$("#userContractForm #userContractCountry")
			.val(responseData.details.countryId)
			.trigger("change");
		}, 300);
	}

	if (responseData.details.stateId) {
		setTimeout(() => {
			$("#userContractForm #userContractState")
			.val(responseData.details.stateId)
			.trigger("change");
		}, 600);
	}

	if (responseData.details.cityId) {
		setTimeout(() => {
			$("#userContractForm #userContractCity")
			.val(responseData.details.cityId)
			.trigger("change");
		}, 900);
	}
    
    editor = new Jodit('#userContractCommentData', {
        width: 794,
        height: 400,
        toolbarSticky: true,
        uploader: { insertImageAsBase64URI: true },
        toolbarAdaptive: false,
        events: {
            change: function () {
                toggleContractEditorUser("userContractForm");
            }
        }
    });
    
    if (responseData.details.commentData && responseData.details.commentData.trim() !== "") {
        editor.value = cleanBase64Images(responseData.details.commentData);
        editor.setReadOnly(false);
		$("#userContractForm label[for='recipientSignatureUpload']").text($("#leftSignatureBox img").data("name"));
    } else {
        editor.setReadOnly(true);
        editor.value = '<p class="text-muted">Please fill contract details above to enable editor.</p>';
    }

    $("#userContractForm #contractDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#userContractForm #contractStartDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#userContractForm #contractEndDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#userContractForm #contractValidityStartDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });
    
    $("#userContractForm #contractValidityEndDate").datepicker({
        autoclose: true,
        format: 'M dd, yyyy',
        startDate: new Date()
    });

    if (responseData.details.validityStart && responseData.details.validityEnd) {
        var start = new Date(responseData.details.validityStart);
        var end = new Date(responseData.details.validityEnd);
        var duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        if (duration > 0) {
            $('#userContractForm #contractValidityDuration').val(duration).trigger('change');
        }
    }
    
    if (responseData.details.durationYears > 0) {
        setTimeout(() => {
            calculateEndDate('userContractForm', 'contractStartDate', 'contractDuration', 'contractEndDate', 'YEAR');
        }, 100);
    }
    
    $("#userContractForm").on(
        "keyup change",
        "#referenceNumber, #firstPartyName, #firstPartyDesignation, #userName, #userEmail, #userDesignation, #employmentType, #workingHours, #monthlySalary, #contractStartDate, #contractDuration, #userContractCountry, #userContractState, #userContractCity",
        function () {
            toggleContractEditorUser("userContractForm");
        }
    );
}

function canEnableContractEditorUser(formId) {
    if ($("#" + formId + " #referenceNumber").val().trim() === "") return false;
    if ($("#" + formId + " #contractDate").val().trim() === "") return false;
    if ($("#" + formId + " #firstPartyName").val().trim() === "") return false;
    if ($("#" + formId + " #firstPartyDesignation").val().trim() === "") return false;
    if ($("#" + formId + " #userName").val().trim() === "") return false;
    if ($("#" + formId + " #userEmail").val().trim() === "") return false;
    if ($("#" + formId + " #userDesignation").val().trim() === "") return false;
    if ($("#" + formId + " #employmentType").val() === "") return false;
    var employmentType = $("#" + formId + " #employmentType").val();
    if (employmentType === "Full-Time") {
        if ($("#" + formId + " #workingHours").val().trim() === "") return false;
    }
    if ($("#" + formId + " #monthlySalary").val().trim() === "") return false;
	if ($("#" + formId + " #userContractCountry").val() === "") return false;
    if ($("#" + formId + " #userContractState").val() === "") return false;
    if ($("#" + formId + " #userContractCity").val() === "") return false;
    if ($("#" + formId + " #contractStartDate").val().trim() === "") return false;
    if ($("#" + formId + " #contractDuration").val() === "0") return false;

    return true;
}

function toggleContractEditorUser(formId) {
    if (typeof editor === "undefined") return;
    if (canEnableContractEditorUser(formId)) {
        editor.setReadOnly(false);
        if (editor.value && editor.value.indexOf("Please fill contract details above") !== -1) {
            editor.value = "";
        }
    } else {
        editor.setReadOnly(true);
        if (!editor.value || editor.value.trim() === "" || editor.value.trim() == "<p><br></p>") {
            editor.value = '<p class="text-muted">Please fill contract details above to enable editor.</p>';
        }
    }
	if (editor.options.readonly || isEditorEmpty()) {
        $("#recipientSignatureUpload").prop("disabled", true);
        // $("#uploadUserSignatureBtn").prop("disabled", true);
    } else {
        $("#recipientSignatureUpload").prop("disabled", false);
        // $("#uploadUserSignatureBtn").prop("disabled", false);
    }
}

function signatureTableUser(formId) {
	if (typeof editor === "undefined") return;
	var editorContent = $(".jodit-workplace");
	if (editorContent.find("#leftSignatureBox").length || editorContent.find("#rightSignatureBox").length) {
		return;
	}
	var firstPartyName = $("#" + formId + " #firstPartyName").val() || "";
	var firstPartyDesignation = $("#" + formId + " #firstPartyDesignation").val() || "";

	var secondPartyName = $("#" + formId + " #userName").val() || "";
	var secondPartyDesignation = $("#" + formId + " #userDesignation").val() || "";

	var todayDate = changeDateFormat(new Date(), "MMM-dd-yyyy");

	var html =
	`<table id="userSignatureBox" style="border-collapse:collapse; width:100%; text-align:center;">
		<tbody>
			<tr>
				<td style="width:50%; padding:10px; vertical-align:top;">
					For <b>${firstPartyName}</b>
					<div id="leftSignatureBox" style="margin-top:40px; min-height:80px;"></div>
					<p style="margin:0;"><i>(Signature)</i></p>
				</td>
				<td style="width:50%; padding:10px; vertical-align:top;">
					For <b>${secondPartyName}</b>
					<div id="rightSignatureBox" style="margin-top:40px; min-height:80px;"></div>
					<p style="margin:0;"><i>(Signature)</i></p>
				</td>
			</tr>

			<tr>
				<td style="padding:10px; text-align:left; font-size:14px; text-align: center;">
					Authorized Signatory - 
					<span class="txt-capitalize-case">${firstPartyName}</span><br/>
					Designation – 
					<span class="txt-capitalize-case">${firstPartyDesignation}</span><br/>
					Date: ${todayDate}
				</td>

				<td style="padding:10px; text-align:left; font-size:14px; text-align: center;">
					Authorized Signatory - 
					<span class="txt-capitalize-case">${secondPartyName}</span><br/>
					Designation – 
					<span class="txt-capitalize-case">${secondPartyDesignation}</span><br/>
					Date: <span id="rightDate">____</span>
				</td>
			</tr>
		</tbody>
	</table><br/>`;
	editor.s.setCursorIn(editor.editor, false);
	editor.s.insertHTML(html);
}

function validateUserContractForm(formId) {

    if ($("#" + formId + " #referenceNumber").val().trim() === "") {
        showMessageTheme2(0, "Please enter reference number");
        return false;
    }

    if ($("#" + formId + " #contractDate").val().trim() === "") {
        showMessageTheme2(0, "Please select contract creation date");
        return false;
    }

    if ($("#" + formId + " #firstPartyName").val().trim() === "") {
        showMessageTheme2(0, "Please enter first party name");
        return false;
    }

    if ($("#" + formId + " #firstPartyDesignation").val().trim() === "") {
        showMessageTheme2(0, "Please enter first party designation");
        return false;
    }

    if ($("#" + formId + " #userName").val().trim() === "") {
        showMessageTheme2(0, "Please enter second party name");
        return false;
    }

    if ($("#" + formId + " #userEmail").val().trim() === "") {
        showMessageTheme2(0, "Please enter second party email");
        return false;
    }

    if ($("#" + formId + " #userDesignation").val().trim() === "") {
        showMessageTheme2(0, "Please enter second party designation");
        return false;
    }

    var employmentType = $("#" + formId + " #employmentType").val();
    if (employmentType === "") {
        showMessageTheme2(0, "Please select employment type");
        return false;
    }

    if (employmentType === "Full-Time") {
        if ($("#" + formId + " #workingHours").val().trim() === "") {
            showMessageTheme2(0, "Please enter agreed working hours per month");
            return false;
        }
    }

	if ($("#" + formId + " #monthlySalary").val().trim() === "") {
		showMessageTheme2(0, "Please enter monthly salary");
		return false;
	}

	if ($("#" + formId + " #userContractCountry").val() === "") {
		showMessageTheme2(0, "Please select country");
		return false;
	}

	if ($("#" + formId + " #userContractState").val() === "") {
		showMessageTheme2(0, "Please select state/province");
		return false;
	}

	if ($("#" + formId + " #userContractCity").val() === "") {
		showMessageTheme2(0, "Please select city");
		return false;
	}

     if ($("#" + formId + " #contractStartDate").val().trim() === "") {
        showMessageTheme2(0, "Please select contract start date");
        return false;
    }

    if ($("#" + formId + " #contractEndDate").val().trim() === "") {
        showMessageTheme2(0, "Please select contract duration");
        return false;
    }

    if (typeof editor === "undefined" || editor.value.trim() === "" || editor.value.trim() == "<p><br></p>") {
        showMessageTheme2(0, "Please add contract comment");
        return false;
    }

	if ($("#" + formId + " label[for='recipientSignatureUpload']").text() == "Choose file...") {
		showMessageTheme2(0, "Please upload your signature");
		return false;
	}
	
	// if ($("#" + formId + " #teacherSignatureBox").length == 0) {
	// 	showMessageTheme2(0, "Please upload your signature");
	// 	return false;
	// }

    if ($("#" + formId + " #contractValidityStartDate").val().trim() === "") {
        showMessageTheme2(0, "Please select validity start date");
        return false;
    }

    if ($("#" + formId + " #contractValidityEndDate").val().trim() === "") {
        showMessageTheme2(0, "Please select validity duration");
        return false;
    }

    return true;
}

function getRequestForUserContract(formId, userId) {
    var requestData = {
        agreementRefNumber: escapeCharacters($("#" + formId + " #referenceNumber").val()),
        agreementDate: changeDateFormat(new Date($("#" + formId + " #contractDate").val()), "yyyy-mm-dd") + " 00:00:00",
        roleType: $("#" + formId + " #roleType").val(),
        firstPartyRepresentative: escapeCharacters($("#" + formId + " #firstPartyName").val()),
        firstPartyDesignation: escapeCharacters($("#" + formId + " #firstPartyDesignation").val()),
        name: escapeCharacters($("#" + formId + " #userName").val()),
        email: escapeCharacters($("#" + formId + " #userEmail").val()),
        secondPartyDesignation: toTitleCase($("#" + formId + " #userDesignation").val()),
        department: toTitleCase($("#" + formId + " #userDepartment").val()),
        employeeType: $("#" + formId + " #employmentType").val(),
        workingHours: $("#" + formId + " #workingHours").val(),
        payOut: $("#" + formId + " #monthlySalary").val(),
        countryId: parseInt($("#" + formId + " #userContractCountry").val()),
        stateId: parseInt($("#" + formId + " #userContractState").val()),
        cityId: parseInt($("#" + formId + " #userContractCity").val()),
        durationStart: changeDateFormat(new Date($("#" + formId + " #contractStartDate").val()), "yyyy-mm-dd") + " 00:00:00",
        durationEnd: changeDateFormat(new Date($("#" + formId + " #contractEndDate").val()), "yyyy-mm-dd") + " 23:59:59",
        durationYears: parseInt($("#" + formId + " #contractDuration").val()),
        commentData: (typeof editor !== "undefined") ? editor.getEditorValue() : "",
        validityStart: changeDateFormat(new Date($("#" + formId + " #contractValidityStartDate").val()), "yyyy-mm-dd") + " 00:00:00",
        validityEnd: changeDateFormat(new Date($("#" + formId + " #contractValidityEndDate").val()), "yyyy-mm-dd") + " 23:59:59",
        validityDays: parseInt($("#" + formId + " #contractValidityDuration").val()),
        sessionUserId: parseInt(USER_ID),
        actionType: "D",
        entityId: parseInt(userId),
        entityType: "USER_SCREENING"
    };
    return requestData;

}


async function saveUserContract(formId, userId){
	if (!validateUserContractForm(formId)) {
        return;
    }
	var ajaxReqDetails = {
        method: "POST",
        url: getURLForHTML("", "save-partner-contract-details"),
        body: getRequestForUserContract(formId, userId),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
		showMessageTheme2(1, "Agreement draft saved successfully");
		$("#publishUserContractBtn").show();
		$("#previewUserContractBtn").show();
		$("#" + formId + " #contractId").val(responseData.contractId);
        loadUserApplicationData(false, "filter");
	}else{
		showMessageTheme2(0, responseData.message);
	}
}

async function publishUserContract(formId, userId){
    var payload ={
		actionType: "P",
		entityId: parseInt(userId),
		entityType: "USER_SCREENING",
		contractId: parseInt($("#" + formId + " #contractId").val()),
		sessionUserId: USER_ID
	}
	var ajaxReqDetails = {
        method: "POST",
        url: getURLForHTML("", "save-partner-contract-details"),
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
		showMessageTheme2(1, "Agreement published successfully");
		$("#addUserContractModal").modal("hide");
        loadUserApplicationData(false, "filter");
	}else{
		showMessageTheme2(0, responseData.message);
	}
}

function getAllHiringRoles(key){
	var html = '';
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForCommon('masters'),
		data : JSON.stringify(getRequestForMasterForHiring(key)),
		dataType : 'json',
		async: false,
		success : function(data) {
		   if (data.status == '0' || data.status == '2') {
			   showMessageTheme2(0, data.message);
		   } else {
				$.each(data.mastersData.data, function(k, v) {
					html+='<option value="'+v.key+'" data-extra="'+v.extra+'">'+v.value+'</option>';
				});
			}
	   }
   });
   return html;
}
