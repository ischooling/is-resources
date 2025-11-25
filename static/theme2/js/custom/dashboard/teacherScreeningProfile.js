var CURRENT_PAGE_TEACHER_SCREENING = 1;
async function teacherScreeningProfileOnloadFunction(){
    CURRENT_PAGE_TEACHER_SCREENING = 1;
    getAllCountryList('teacherScreeningFilterForm','filterCountryId');
    let payload = {}
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
    bindAssignTo('teacherScreeningFilterForm', 'filterAssignedTo', responseData);
    $("#teacherScreeningFilterForm #filterCountryId").select2({
        placeholder: "Select Country",
        theme:"bootstrap4"
    });
    $("#teacherScreeningFilterForm #filterAssignedTo").select2({
        placeholder: "Select Assign To",
        theme:"bootstrap4"
    });
    $("#teacherScreeningFilterForm #filterGrades").select2({
        placeholder: "Select Grades",
        theme:"bootstrap4",
        allowClear: true,
        multiple: true
    });
    $("#teacherScreeningFilterForm #filterCourses").select2({
        placeholder: "Select Courses",
        theme:"bootstrap4",
        allowClear: true,
        multiple: true
    });
    $("#teacherScreeningFilterForm #filterGrades").val("").trigger("change");
    $("#teacherScreeningFilterForm #filterCourses").val("").trigger("change");
    loadTeacherScreeningData();
}

function showFilterTeacherScreening(){
    $("#teacherScreeningFilterForm").slideToggle(300);
}

function bindTeacherScreeningData(responseData) {
    var tableBody = $('#teacherScreeningTable tbody');
    tableBody.empty();
    if (responseData.DataArray && responseData.DataArray.length > 0) {
        var pageSize = responseData.pagination.pageSize;
        responseData.DataArray.forEach(function(teacher, index) {
            const source = typeof teacher.location === "string" ? JSON.parse(teacher.location).by : teacher.location?.by;
            var row = 
                `<tr id="tr_${teacher.id}">
                    <td>${(CURRENT_PAGE_TEACHER_SCREENING - 1) * pageSize + index + 1}</td>
                    <td>
                        ${changeDateFormat(new Date(teacher.createdAt), "MMM-dd-yyyy")}
                        &nbsp;|&nbsp; 
                        ${teacher.userName} 
                        &nbsp;|&nbsp;
                        +${teacher.phoneNo || ''} 
                        ${teacher.isWhatsappAvailable == "Y" ? `<span style="margin-left: 5px;"><img src="${PATH_FOLDER_IMAGE}watsapp-icon.png" width="16px" height="16px" alt="WhatsApp" /></span>` : ''}    
                        &nbsp;|&nbsp;
                        ${teacher.email || ''}
                        ${source ? `<br/><p class="bg-success rounded p-1 w-fit-content mt-1 text-white">${source}</p>` : ""}                            
                    </td>
                    <td>${teacher.country} | ${teacher.state} | ${teacher.city}</td>
                    <td>${teacher.lastSalary ? teacher.currency + ' ' + teacher.lastSalary : ''}</td>
                    <td>${teacher.lastOrgName || ''}</td>
                    <td>
                        ${teacher?.attachments?.uploadDocumentTeacherResumeURL ? 
                            `<a href="javascript:void(0)"  class="btn btn-sm btn-outline-primary" onclick="viewTeacherScreenAttachementResumeAndPhoto(\'${teacher?.attachments?.uploadDocumentTeacherResumeURL}\','viewTeacherScreenAttachementModal')">View Resume</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>
                        ${teacher?.attachments?.uploadDocumentTeacherPassportURL ? 
                            `<a href="javascript:void(0)"  class="btn btn-sm btn-outline-primary" onclick="viewTeacherScreenAttachementResumeAndPhoto(\'${teacher?.attachments?.uploadDocumentTeacherPassportURL}\','viewTeacherScreenAttachementModal')">View Photo</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    ${/*
                        <td>
                            ${teacher?.attachments?.uploadDocumentTeacherResumeURL ? 
                                `<a href="${teacher?.attachments?.uploadDocumentTeacherResumeURL}" target="_blank" class="btn btn-sm btn-outline-primary">View Resume</a>` : 
                                '<span class="text-muted">N/A</span>'
                            }
                        </td>
                        <td>
                            ${teacher?.attachments?.uploadDocumentTeacherPassportURL ? 
                                `<a href="${teacher?.attachments?.uploadDocumentTeacherPassportURL}" target="_blank" class="btn btn-sm btn-outline-primary">View Photo</a>` : 
                                '<span class="text-muted">N/A</span>'
                            }
                        </td>    
                    */''}
                    <td>`
                        if(teacher.oldGrades != "" || teacher.oldSubjects != "" || teacher.newGrades != "" || teacher.newSubjects != ""){
                            row+=`<a href="javascript:void(0);" onclick="openPreviousExperience('${teacher.oldGrades}', '${teacher.oldSubjects}', '${teacher.newGrades}', '${teacher.newSubjects}');" class="btn btn-sm btn-outline-primary">View</a>`
                        }else{
                            row+=`N/A`
                        }
                    row+=`</td>
                    <td>
                        ${teacher.linkedInUrl ? 
                            `<a href="${teacher.linkedInUrl}" target="_blank" class="btn btn-sm btn-outline-primary" target="_blank">LinkedIn</a>` : 
                            '<span class="text-muted">N/A</span>'
                        }
                    </td>
                    <td>${teacher.assignTo || 'N/A'}</td>
                    <td>${teacher.status || 'N/A'}</td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModal(${teacher.id}, '${teacher.status || ''}')">
                                        <i class="fas fa-edit me-2"></i>&nbsp;Update Status
                                    </a>
                                </li>`;
                                if(teacher.status != ""){
                                    row+=`<li>
                                        <a class="dropdown-item" href="javascript:void(0);" onclick="resendTeacherInterviewLink(${teacher.id})">
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
        $("#teacherScreeningPagination").html(renderPaginationCommon(CURRENT_PAGE_TEACHER_SCREENING, responseData.pagination.totalPages, "teacherScreening"));
    }else{
        $("#teacherScreeningPagination").html('');
        $('#teacherScreeningTable tbody').html('<tr><td colspan="12" class="text-center text-muted">No Data Found</td></tr>')
    }
}

async function loadTeacherScreeningData() {
    try {
        var payload = {};
        payload['schoolId'] = SCHOOL_ID;
        payload['userName'] = $("#teacherScreeningFilterForm #filterName").val().trim();
        payload['phoneNumber'] = $("#teacherScreeningFilterForm #filterPhone").val().trim();
        payload['email'] = $("#teacherScreeningFilterForm #filterEmail").val().trim();
        payload['country'] = $("#teacherScreeningFilterForm #filterCountryId").val();
        payload['assignTo'] = $("#teacherScreeningFilterForm #filterAssignedTo").val();
        payload['status'] = $("#teacherScreeningFilterForm #filterStatus").val();
        payload['standards'] = $("#teacherScreeningFilterForm #filterGrades").val();
        payload['subjects'] = $("#teacherScreeningFilterForm #filterCourses").val();
        payload['pageNo'] = CURRENT_PAGE_TEACHER_SCREENING;
        payload['pageSize'] = $("#teacherScreeningFilterForm #pageSize").val().trim();
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-interview-data', payload, '/teacher/signup');
        bindTeacherScreeningData(responseData);
    } catch (error) {
        console.error('Error loading teacher screening data:', error);
        $('#teacherScreeningTable tbody').html('<tr><td colspan="13" class="text-center text-muted">No Data Available</td></tr>');
    }
}

function applyFilterTeacherScreening() {
    CURRENT_PAGE_TEACHER_SCREENING = 1;
    loadTeacherScreeningData();
}

function resetTeacherScreening() {
    $('#teacherScreeningFilterForm')[0].reset();
    $('#teacherScreeningFilterForm #filterCountryId').val('0').trigger('change');
    $('#teacherScreeningFilterForm #filterAssignedTo').val('').trigger('change');
    $('#teacherScreeningFilterForm #filterStatus').val('');
    $('#teacherScreeningFilterForm #filterGrades').val('').trigger('change');
    $('#teacherScreeningFilterForm #filterCourses').val('').trigger('change');
    CURRENT_PAGE_TEACHER_SCREENING = 1;
    $('#teacherScreeningFilterForm #pageSize').val('10')
}

function resendInterviewLink(teacherId) {
    alert('Interview booking link has been resent successfully!');
}


function openPreviousExperience(oldGrades, oldCourses, newGrades, newCourses){
    if($("#teacherPreviousExperienceModal").length == 1){
        $("#teacherPreviousExperienceModal").remove();
    }
    $("body").append(teacherPreviousExperienceModalContent(oldGrades, oldCourses, newGrades, newCourses))
    $("#teacherPreviousExperienceModal").modal('show');
}

function toBulletPoints(value, isCourse = false) {
    if (!value || value.trim() === "") return "N/A";

    value = value.trim();

    const specialPrefix = "All Courses - Language Arts, Mathematics, Science, Technology, Art";

    if (isCourse && value.startsWith(specialPrefix)) {
        if (value === specialPrefix) {
            return specialPrefix
        }

        let rest = value.slice(specialPrefix.length).trim();
        if (rest.startsWith(",")) rest = rest.slice(1).trim();

        const extraItems = rest.split(",").map(v => v.trim()).filter(v => v !== "");

        const extrasHtml = extraItems.length
            ? `<ul class="mb-0 pl-3 list-type-disc">${extraItems.map(v => `<li>${v}</li>`).join("")}</ul>`
            : "";

        return `<ul class="pl-3 list-type-disc mb-0"><li>${specialPrefix}</li></ul>${extrasHtml}`;
    }
    const items = value.replaceAll(", ", "#").split(",").map(v => v.replaceAll("#", ", ").trim()).filter(v => v !== "");
    if (items.length === 1) return items[0];

    return `<ul class="mb-0 pl-3 list-type-disc">${items.map(v => `<li>${v}</li>`).join("")}</ul>`;
}

function openUpdateStatusModal(id, status){
    if($("#teacherScreeningProfileStatusModal").length == 1){
        $("#teacherScreeningProfileStatusModal").remove();
    }
    $("body").append(teacherScreeningProfileStatusModal(id, status));
    $("#assignedToInterview").select2({
        placeholder: "Select Assign To",
        theme:"bootstrap4"
    });
    setTimeout(() => {
        $("#teacherScreeningProfileStatusModal").modal("show");
    }, 200);
}

async function updateTeacherScreeningProfile(id){
    var selectedStatus = $("#teacherScreeningProfileStatus").val();
    if(selectedStatus == ""){
        showMessageTheme2(2, "Please select status");
        return false;
    }
    if(selectedStatus == "Approved For Interview"){
        if($("#assignedToInterview").val() == ""){
            showMessageTheme2(2, "Please select assign to");
            return false;
        }
    }
    if($("#teacherScreeningProfileRemarks").val() == ""){
        showMessageTheme2(2, "Please enter remarks");
        return false;
    }
    var payload = {};
    payload["entityId"] = id;
    payload["entityType"] = "INITIAL-INTERVIEW";
    payload["assignTo"] = $("#assignedToInterview").val();
    payload["status"] = $("#teacherScreeningProfileStatus").val();
    payload["remarks"] = $("#teacherScreeningProfileRemarks").val();
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
    if(responseData.status == "SUCCESS"){
        if(selectedStatus == 'Reject'){
            $("#teacherScreeningTable tbody #tr_"+id).remove();
        }else{
            var assignedToText = $("#assignedToInterview option:selected").text();
            var displayName = assignedToText.split("-")[0].trim();
            updateTableRowDirectly(id, selectedStatus, displayName);
        }
        showMessageTheme2(1, responseData.message);
        $("#teacherScreeningProfileStatusModal").modal("hide");
    }else{
        showMessageTheme2(0, responseData.message);
    }

}
async function viewAssignToListForInterview(){
    var selectedStatus = $("#teacherScreeningProfileStatus").val();
    if(selectedStatus == "Approved For Interview"){
        let payload = {}
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-screening-counselor-list', payload, '/teacher/signup');
        bindAssignTo('teacherScreeningProfileStatusForm', 'assignedToInterview', responseData);
        $("#assignedToInterviewDiv").show();
    }else{
        $("#assignedToInterviewDiv").hide();
        $("#assignedToInterview").val("").trigger("change");
    }
}

async function resendTeacherInterviewLink(id){
    var payload = {}
    payload["entityId"] = id;
    payload["entityType"] = "INITIAL-INTERVIEW";
    payload["status"] = 'Resend Interview Link';
    var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'update-teacher-screening-data-status', payload, '');
    if(responseData.status == "SUCCESS"){
        showMessageTheme2(1, responseData.message);
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

function bindAssignTo(formId, selectId, responseData) {
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

function updateTableRowDirectly(teacherId, newStatus, assignedTo) {
    var row = $('#tr_' + teacherId);
    
    if(row.length) {
        if(newStatus != "Approved for Selection Process"){
            row.find('td:eq(11)').text(assignedTo || 'N/A');
        }
        row.find('td:eq(12)').text(newStatus || 'N/A');
        
        var dropdownHtml = `
            <div class="dropdown">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="javascript:void(0);" onclick="openUpdateStatusModal(${teacherId}, '${newStatus || ''}')">
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

async function viewTeacherScreenAttachementResumeAndPhoto(url, modalId){
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