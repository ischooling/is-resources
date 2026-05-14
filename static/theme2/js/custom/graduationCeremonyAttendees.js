function loadGraduationCeremonyAttendees(){
    return $.ajax({
        url: `${APP_BASE_URL}${SCHOOL_UUID}/get-all-ceremony-attendees?userId=${btoa(USER_ID)}`,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function(response) {
            if ($.fn.DataTable.isDataTable('#attendeesTable')) {
                $('#attendeesTable').DataTable().clear().destroy();
            }

            let tbodyHtml = '';
            $.each(response.details, function(index, attendee) {
                const sno = index + 1;
                const callbackStatus = attendee.callbackStatus ? attendee.callbackStatus : "N/A";
                const isCallbackCompleted = callbackStatus.toUpperCase() === "COMPLETED";
                const isCallbackScheduled = callbackStatus.toUpperCase() === "SCHEDULED";
                const rawPreferredDateTime = attendee.callbackPreferredDateTime && attendee.callbackPreferredDateTime != "N/A" ? attendee.callbackPreferredDateTime : "";
                const callbackPreferredTimezone = attendee.callbackPreferredTimezone || attendee.userTimezone || "";
                const formattedDateAccToTZ = rawPreferredDateTime ? changeDateFormat(convertTZ(rawPreferredDateTime, USER_TIMEZONE), "MMM dd, yyyy hh:mm A") : "N/A";
                const studentInfo = `
                    <strong>${attendee.fullName}</strong><br>
                    <small>${attendee.email}</small><br>
                    <small>Attend As: ${attendee.attendAs ? attendee.attendAs : "N/A"}</small><br>
                    <small>Age: ${!attendee.age ? "N/A" : attendee.age}</small><br>
                    <small>Phone No.: ${attendee.phoneNo}</small><br>
                    <small>Alt Phone No.: ${attendee.alternatePhoneNo ? attendee.alternatePhoneNo : "N/A"}</small><br>
                    <small>Country: ${attendee.country}</small>
                    <br><small>Timezone: ${attendee.userTimezone ? attendee.userTimezone : "N/A"}</small>
                `;
                const callbackInfo = `
                    <small>Preferred Country: ${attendee.preferredCountry ? attendee.preferredCountry : "N/A"}</small><br>
                    <small>Status: ${callbackStatus}</small><br>
                    <small>Date & Time: ${formattedDateAccToTZ}</small><br>
                    <small>Timezone: ${callbackPreferredTimezone ? callbackPreferredTimezone : "N/A"}</small>
                `;

                tbodyHtml += `<tr>
                    <td>${sno}</td>
                    <td>${studentInfo}</td>
                    <td>${callbackInfo}</td>
                    <td>${attendee.graduatingYear}</td>
                    <td>${attendee.noOfAttendees}</td>
                    <td>$${attendee.amountScheduled}</td>
                    <td>${attendee.amountStatus}</td>
                    <td>${attendee.foodAllergy}</td>
                    <td>`;
                        if(isCallbackScheduled){
                            tbodyHtml += `<button type="button"
                                class="btn btn-primary btn-sm open-graduation-status-modal"
                                data-email="${attendee.email || ''}"
                                data-callback-preferred-datetime="${rawPreferredDateTime}"
                                data-callback-preferred-timezone="${callbackPreferredTimezone}"
                                data-school-id="${attendee.schoolId || SCHOOL_ID}"
                                data-user-id="${attendee.userId || USER_ID}">
                                Update Status
                            </button>`;
                        }else if(isCallbackCompleted){
                            tbodyHtml += `N/A`;
                        }else{
                            tbodyHtml += `N/A`;
                        }
                    tbodyHtml += `</td>
                </tr>`;
            });

            $('#attendeesTableBody').html(tbodyHtml);
            $('#attendeesTable').DataTable({
                destroy: true
            });
        }
    });
}

$(document).off("click", ".open-graduation-status-modal").on("click", ".open-graduation-status-modal", function () {
    const email = $(this).attr("data-email") || "";
    const callbackPreferredDateTime = $(this).attr("data-callback-preferred-datetime") || "";
    const callbackPreferredTimezone = $(this).attr("data-callback-preferred-timezone") || "";
    const schoolId = $(this).attr("data-school-id") || SCHOOL_ID;
    const userId = $(this).attr("data-user-id") || USER_ID;
    const formattedDateAccToTZ = callbackPreferredDateTime ? changeDateFormat(convertTZ(callbackPreferredDateTime, USER_TIMEZONE), "MMM dd, yyyy hh:mm A") : "N/A";

    $("#graduationCallbackStudentEmail").val(email);
    $("#graduationCallbackPreferredDateTime").val(callbackPreferredDateTime);
    $("#graduationCallbackPreferredTimezone").val(callbackPreferredTimezone);
    $("#graduationCallbackSchoolId").val(schoolId);
    $("#graduationCallbackUserId").val(userId);
    $("#graduationCallbackStatusSelect").val("");
    $("#graduationCallbackStudentEmailText").text(email || "N/A");
    $("#graduationCallbackPreferredDateTimeText").text(formattedDateAccToTZ);
    $("#graduationCallbackPreferredTimezoneText").text(callbackPreferredTimezone || "N/A");
    $("#graduationCallbackStatusModal").modal("show");
});

$(document).off("hidden.bs.modal", "#graduationCallbackStatusModal").on("hidden.bs.modal", "#graduationCallbackStatusModal", function () {
    $("#graduationCallbackStatusSelect").val("");
    $("#graduationCallbackStudentEmail").val("");
    $("#graduationCallbackPreferredDateTime").val("");
    $("#graduationCallbackPreferredTimezone").val("");
    $("#graduationCallbackSchoolId").val("");
    $("#graduationCallbackUserId").val("");
    $("#graduationCallbackStudentEmailText").text("N/A");
    $("#graduationCallbackPreferredDateTimeText").text("N/A");
    $("#graduationCallbackPreferredTimezoneText").text("N/A");
});

async function updateGraduationCeremonyCallbackStatus(){
    const callbackStatus = $("#graduationCallbackStatusSelect").val();
    const email = $("#graduationCallbackStudentEmail").val();
    const callbackPreferredDateTime = $("#graduationCallbackPreferredDateTime").val();
    const callbackPreferredTimezone = $("#graduationCallbackPreferredTimezone").val();
    const schoolId = $("#graduationCallbackSchoolId").val();
    const userId = $("#graduationCallbackUserId").val();

    if(callbackStatus == ""){
        showMessageTheme2(0, "Please select status");
        return false;
    }
    if(callbackStatus !== "COMPLETED"){
        showMessageTheme2(0, "Only completed status can be updated.");
        return false;
    }
    if(email == ""){
        showMessageTheme2(0, "Email not found.");
        return false;
    }
    if(callbackPreferredDateTime == ""){
        showMessageTheme2(0, "Preferred callback date & time not found.");
        return false;
    }
    if(callbackPreferredTimezone == ""){
        showMessageTheme2(0, "Preferred callback timezone not found.");
        return false;
    }

    const request = {
        email: email,
        callbackStatus: callbackStatus,
        callbackPreferredDateTime: callbackPreferredDateTime,
        callbackPreferredTimezone: callbackPreferredTimezone,
        schoolId: schoolId,
        userId: userId
    };
    const ajaxReqDetails = {
        method: "POST",
        url: `${APP_BASE_URL}${SCHOOL_UUID}/update-graduation-ceremony-callback-status`,
        body: request,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    try{
        const response = await callCommonAjax(ajaxReqDetails);
        if(response && (response.status == "SUCCESS" || response.status == 1 || response.status == "1")){
            showMessageTheme2(1, response.message || "Callback status updated successfully.");
            $("#graduationCallbackStatusModal").modal("hide");
            await loadGraduationCeremonyAttendees();
        }else{
            showMessageTheme2(0, response && response.message ? response.message : "Unable to update callback status.");
        }
    }catch(error){
        showMessageTheme2(0, "Unable to update callback status.");
    }
}

function sendGraduationCeremonyMailToEligibleStudents(){
    var request = {};
    request["eventName"] = "Graduation Ceremony 2025, Columbia";
    request["location"] = "Bogota, Colombia";
    request["dateAndTime"] = "December 2025 (Tentative)";
    $.ajax({
        type: "POST",
        url: `${APP_BASE_URL}${SCHOOL_UUID}/send-graduation-ceremony-mail`,
        contentType: APPLICATION_JSON_VALUE,
        dataType: 'json',
        data: JSON.stringify(request),
        success: function (response) {
            if(response.status == "SUCCESS"){
                showMessageTheme2(1, response.message);
            }else{
                showMessageTheme2(0, response.message);
            }
        }
    });
}
