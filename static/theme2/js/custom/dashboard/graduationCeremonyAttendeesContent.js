function getGraduationCeremonyAttendeesContent(title, roleAndModule, schoolId, userId, role){
    var html=
    `<div class="app-page-title mb-3 py-2">
		<div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon">
                    <i class="fas fa-university text-primary"></i>
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
                            <th>Student Info<br><small>(Name, Email, Age, Phone, Country)</small></th>
                            <th>Graduating Year</th>
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
    </div>`
    return html;
}