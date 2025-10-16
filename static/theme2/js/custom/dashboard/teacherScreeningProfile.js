function teacherScreeningProfileOnloadFunction(){
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
    loadTeacherScreeningData(false);
}

function showFilterTeacherScreening(){
    $("#teacherScreeningFilterForm").slideToggle(300);
}

function bindTeacherScreeningData(responseData) {
    var table = $('#teacherScreeningTable').DataTable();
    
    if (table) {
        table.clear().destroy();
    }
    var tableBody = $('#teacherScreeningTable tbody');
    tableBody.empty();
    
    if (responseData.DataArray && responseData.DataArray.length > 0) {
        responseData.DataArray.forEach(function(teacher, index) {
            
            var row = `
                <tr>
                    <td>${index + 1}</td>
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
                </tr>
            `;
            tableBody.append(row);
        });
    }else{
        $('#teacherScreeningTable tbody').html('<tr><td colspan="13" class="text-center text-muted">No Data Found</td></tr>')
    }
    $('#teacherScreeningTable').dataTable({
        theme:"bootstrap4",
    });
}

async function loadTeacherScreeningData(isFiltering) {
    try {
        var payload = {};
        payload['schoolId'] = SCHOOL_ID;
        if(isFiltering){
            payload['userName'] = $("#filterName").val().trim();
            payload['phoneNumber'] = $("#filterPhone").val().trim();
            payload['email'] = $("#filterEmail").val().trim();
            payload['country'] = $("#filterCountryId").val();
            payload['assignTo'] = $("#filterAssignedTo").val();
            payload['status'] = $("#filterStatus").val();
        }
        var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-teacher-interview-data', payload, '/teacher/signup');
        bindTeacherScreeningData(responseData);
    } catch (error) {
        console.error('Error loading teacher screening data:', error);
        $('#teacherScreeningTable tbody').html('<tr><td colspan="13" class="text-center text-muted">No Data Available</td></tr>');
    }
}

function applyFilterTeacherScreening() {
    loadTeacherScreeningData(true);
}

function resetTeacherScreening() {
    $('#teacherScreeningFilterForm')[0].reset();
    $('#teacherScreeningFilterForm #filterCountryId').val('0').trigger('change');
    $('#teacherScreeningFilterForm #filterAssignedTo').val('').trigger('change');
    $('#teacherScreeningFilterForm #filterStatus').val('');
}

function resendInterviewLink(teacherId) {
    alert('Interview booking link has been resent successfully!');
}