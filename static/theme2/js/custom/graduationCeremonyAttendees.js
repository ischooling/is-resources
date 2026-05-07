function loadGraduationCeremonyAttendees(){
    $.ajax({
        url: `${APP_BASE_URL}${SCHOOL_UUID}/get-all-ceremony-attendees?userId=${btoa(USER_ID)}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            let tbodyHtml = '';
            $.each(response.details, function(index, attendee) {
                const sno = index + 1;
                const studentInfo = `
                    <strong>${attendee.fullName}</strong><br>
                    <small>${attendee.email}</small><br>
                    <small>Age: ${!attendee.age ? "N/A" : attendee.age}</small><br>
                    <small>Phone No.: ${attendee.phoneNo}</small><br>
                    <small>Alt Phone No.: ${attendee.alternatePhoneNo ? attendee.alternatePhoneNo : "N/A"}</small><br>
                    <small>Country: ${attendee.country}</small>
                    <br><small>Timezone: ${attendee.userTimezone ? attendee.userTimezone : "N/A"}</small>
                `;

                const callbackInfo = `
                    <small>Preferred Country: ${attendee.preferredCountry ? attendee.preferredCountry : "N/A"}</small><br>
                    <small>Status: ${attendee.callbackStatus ? attendee.callbackStatus : "N/A"}</small><br>
                    <small>DateTime: ${attendee.callbackPreferredDateTime ? attendee.callbackPreferredDateTime : "N/A"}</small><br>
                    <small>Timezone: ${attendee.callbackPreferredTimezone ? attendee.callbackPreferredTimezone : "N/A"}</small>
                `;
                const paymentLink = attendee.paymentLink

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
                        if(attendee.amountStatus == "SUCCESS"){
                            tbodyHtml+=`N/A`;
                        }else if(paymentLink != "N/A"){
                            tbodyHtml+=`<input type="text" value="${paymentLink}" id="graduationPaymentLink${index}" class="position-absolute" style="top:0;left:0;opacity:0;"/>
                            <button onclick="copyURL('graduationPaymentLink${index}','copy-msg-${index}');" class="btn btn-sm btn-primary  copy-link-btn">Copy Payment Link</button>
                            <b class="copy-msg-${index}"></b>`;
                        }else{
                            tbodyHtml+=`N/A`;
                        }
                    tbodyHtml+=`</td>
                </tr>`;
            });

            $('#attendeesTableBody').html(tbodyHtml);

            if ($.fn.DataTable.isDataTable('#attendeesTable')) {
                $('#attendeesTable').DataTable().destroy();
            }
            $('#attendeesTable').DataTable();
        }
    });
}

function sendGraduationCeremonyMailToEligibleStudents(){
    var request = {};
    request["eventName"] = "Graduation Ceremony 2025, Columbia";
    request["location"] = "Bogotá, Colombia";
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
