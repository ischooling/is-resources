function renderTeacherPreScreeningProfileContent(title){
    var html=
        `<div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"><i class="pe-7s-display2 text-primary"></i></div>
                    <div>${title}</div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <a href="javascript:void(0)" onclick="showFilterTeacherScreening();" class="btn btn-primary ml-auto">
                <i class="fa fa-filter"></i> Filter
            </a>
        </div>`
        +teacherScreeningFilter()
        +teacherScreenTableContent()
    return html;
}

function teacherScreeningFilter(){
    var html=
        `<form id="teacherScreeningFilterForm" class="border rounded-10 bg-white p-3 mb-3 mt-2" style="display:none;">
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label>Name</label>
                    <input type="text" id="filterName" class="form-control" placeholder="Enter Name">
                </div>
                <div class="form-group col-md-4">
                    <label>Phone</label>
                    <input type="text" id="filterPhone" class="form-control" placeholder="Enter Phone" onkeydown="return M.digit(event);">
                </div>
                <div class="form-group col-md-4">
                    <label>Email</label>
                    <input type="text" id="filterEmail" class="form-control" placeholder="Enter Email">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-4">
                    <label>Country</label>
                    <select name="filterCountryId" id="filterCountryId" class="form-control">
                        <option value="0">Select country</option>
                    </select>
                </div>
                <div class="form-group col-md-4">
                    <label>Assigned To</label>
                    <select id="filterAssignedTo" class="form-control">
                        <option value="">All</option>
                    </select>
                </div>
                <div class="form-group col-md-4">
                    <label>Application Status</label>
                    <select id="filterStatus" class="form-control">
                        <option value="">Select Status</option>
                        <option value="Approved For Interview">Approved For Interview</option>
                        <option value="Approved for Selection Process">Approved for Selection Process</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-danger" onclick="resetTeacherScreening();"><i class="fa fa-undo"></i>&nbsp;Reset</button>
                <button type="button" class="btn btn-success ml-2" onclick="applyFilterTeacherScreening();"><i class="fa fa-search"></i>&nbsp;Search</button>
            </div>
        </form>`
    return html;
}

function teacherScreenTableContent(){
    var html=
        `<div class="table-responsive mt-3 bg-white p-2">
            <table id="teacherScreeningTable" class="table table-bordered font-12">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th style="width: 130px;">Phone Number</th>
                        <th>Email</th>
                        <th>Country | Province | City</th>
                        <th>Last/Current Salary (per annum)</th>
                        <th>Last/Current Organization Name</th>
                        <th>Resume/CV</th>
                        <th>Recent Photograph</th>
                        <th>Linkedin Profile</th>
                        <th>Assigned To</th>
                        ${/*<th>Profile Status</th>
                        <th>Action</th>*/''}
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>`
    return html;
}