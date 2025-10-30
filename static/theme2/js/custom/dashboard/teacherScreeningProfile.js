var CURRENT_PAGE_TEACHER_SCREENING = 1;
function teacherScreeningProfileOnloadFunction(){
    CURRENT_PAGE_TEACHER_SCREENING = 1;
    getAllCountryList('teacherScreeningFilterForm','filterCountryId');
    callLeadAssignUserList("teacherScreeningFilterForm", "" ,'filterAssignedTo', true, "", USER_ID, "");
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
            var row = 
                `<tr>
                    <td>${(CURRENT_PAGE_TEACHER_SCREENING - 1) * pageSize + index + 1}</td>
                    <td>${teacher.userName}</td>
                    <td>
                        ${teacher.phoneNo || ''} 
                        ${teacher.isWhatsappAvailable == "Y" 
                        ? `<span style="margin-left: 5px;"><img src="${PATH_FOLDER_IMAGE}watsapp-icon.png" width="16px" height="16px" alt="WhatsApp" /></span>` 
                        : ''}
                    </td>
                    <td>${teacher.email || ''}</td>
                    <td>${teacher.country} | ${teacher.state} | ${teacher.city}</td>
                    <td>${teacher.lastSalary ? teacher.currency + ' ' + teacher.lastSalary : ''}</td>
                    <td>${teacher.lastOrgName || ''}</td>
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
                    <td>${teacher.assignedTo || 'N/A'}</td>
                    ${/*<td>
                        <button class="btn btn-sm font-12 btn-warning" onclick="openUpdateStatusModal(${teacher.id}, '${teacher.status || ''}')">
                            Update Status
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-sm font-12 btn-info" onclick="resendInterviewLink(${teacher.id})">
                            Resend Interview Booking Link
                        </button>
                    </td>*/''}
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

    const items = value.split(",").map(v => v.trim()).filter(v => v !== "");
    if (items.length === 1) return items[0];

    return `<ul class="mb-0 pl-3 list-type-disc">${items.map(v => `<li>${v}</li>`).join("")}</ul>`;
}