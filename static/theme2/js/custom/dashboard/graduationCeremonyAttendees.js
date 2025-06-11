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
                    <small>Age: ${attendee.age}</small><br>
                    <small>Phone No.: ${attendee.phoneNo}</small><br>
                    <small>Country: ${attendee.country}</small>
                `;
                const paymentLink = attendee.paymentLink

                tbodyHtml += `<tr>
                    <td>${sno}</td>
                    <td>${studentInfo}</td>
                    <td>${attendee.graduatingYear}</td>
                    <td>${attendee.noOfAttendees}</td>
                    <td>$${attendee.amountScheduled}</td>
                    <td>${attendee.amountStatus}</td>
                    <td>${attendee.foodAllergy}</td>
                    <td>`;
                        if(paymentLink != "N/A"){
                            tbodyHtml+=`<button class="btn btn-sm copy-link-btn rounded border-0" style="background-color:#027FFF;" data-link="${paymentLink}">Copy Payment Link</button>`;
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

            $('.copy-link-btn').on('click', function () {
                const link = $(this).data('link');
                const $btn = $(this);
            
                navigator.clipboard.writeText(link).then(() => {
                    $btn.text('Copied!')
                        .css('background-color', '#28a745');
            
                    setTimeout(() => {
                        $btn.text('Copy Payment Link')
                            .css('background-color', '#027FFF');
                    }, 1500);
                });
            });
        },
        error: function(err) {
            console.error("Failed to fetch attendee data", err);
            $('#attendeesTableBody').html('<tr><td colspan="8" class="text-center text-danger">No data available</td></tr>');
        }
    });
}