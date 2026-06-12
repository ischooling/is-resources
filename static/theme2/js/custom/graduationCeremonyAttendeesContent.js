function getGraduationCeremonyAttendeesContent(title, roleAndModule, schoolId, userId, role){
    var html=
    `<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
            <div class="page-title-heading">
                 <div class="page-title-icon">
                     <img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Scholarship 1.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;">
                     </div>
                <div>${title}</div>
            </div>
            <div class="page-title-actions">
                <button onclick="sendGraduationCeremonyMailToEligibleStudents();" class="btn btn-primary btn-sm">Send Mail To Eligible Students</button>
            </div>
        </div>
    </div>
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered table-striped border-radius-table font-12 responsive" id="attendeesTable" style="width:100% !important">
                    <thead>
                        <tr class="bg-primary text-white">
                            <th>S.No.</th>
                            <th>Student Info<br><small>(Name, Email, Attend As, Age, Phone, Alt Phone, Country, Timezone)</small></th>
                            <th>Callback Info<br><small>(Status, Time Slot)</small></th>
                            <th>Attendees</th>
                            <th>No. of Attendees</th>
                            <th>Amount</th>
                            <th>Payment Status</th>
                            <th>Food Allergy</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="attendeesTableBody">
                        ${/*
                            <!-- Dynamic rows will be appended here -->    
                        */''}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="modal fade" id="graduationCallbackStatusModal" tabindex="-1" role="dialog" aria-labelledby="graduationCallbackStatusModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="graduationCallbackStatusModalLabel">Update Callback Status</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body custom-field-scope">
                    <input type="hidden" id="graduationCallbackStudentEmail">
                    <input type="hidden" id="graduationCallbackPreferredDateTime">
                    <input type="hidden" id="graduationCallbackPreferredTimezone">
                    <input type="hidden" id="graduationCallbackSchoolId">
                    <input type="hidden" id="graduationCallbackUserId">
                    <div class="mb-3">
                        <div class="position-relative custom-field mb-2 mt-3 p-0">
                            <select id="graduationCallbackStatusSelect" class="form-control">
                                <option value="">Select Status</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                            <label for="graduationCallbackStatusSelect" class="font-weight-bold">Select Status</label>
                        </div>
                    </div>
                    <div class="small text-muted line-height-18">
                        <div><strong>Email:</strong> <span id="graduationCallbackStudentEmailText">N/A</span></div>
                        <div><strong>Preferred Date & Time:</strong> <span id="graduationCallbackPreferredDateTimeText">N/A</span></div>
                        <div><strong>Preferred Timezone:</strong> <span id="graduationCallbackPreferredTimezoneText">N/A</span></div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary btn-sm" onclick="updateGraduationCeremonyCallbackStatus();">Update Status</button>
                </div>
            </div>
        </div>
    </div>`
    return html;
}
