function getGraduationCeremonyAttendeesContent(title, roleAndModule, schoolId, userId, role){
    var html=
        `<div class="card-header card-header-primary text-white mx-5 py-3 rounded" style="background-color:#027FFF;">
			<h4 class="card-title mb-0" style="color:#FFF;font-weight:bold;">${title}</h4>
		</div>
        <div class="mt-4 table-responsive px-5 mt-3">
            <table class="table table-bordered table-hover" id="attendeesTable">
                <thead class="thead-light">
                    <tr>
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
                    <!-- Dynamic rows will be appended here -->
                </tbody>
            </table>
        </div>`
    return html;
}