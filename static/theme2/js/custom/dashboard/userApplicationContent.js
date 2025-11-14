function renderUserApplicationContent(title){
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
            <a href="javascript:void(0)" onclick="showFilterUserApplication();" class="btn btn-primary ml-auto">
                <i class="fa fa-filter"></i> Filter
            </a>
        </div>`
        +userScreeningFilter()
        +userApplicationTableContent()
    return html;
}

function userScreeningFilter(){
    var html=
        `<form id="userScreeningFilterForm" class="border rounded-10 bg-white p-3 mb-3 mt-2" style="display:none;">
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Name</label>
                    <input type="text" id="filterName" class="form-control">
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Phone</label>
                    <input type="text" id="filterPhone" class="form-control" onkeydown="return M.digit(event);">
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Email</label>
                    <input type="text" id="filterEmail" class="form-control">
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Country</label>
                    <select name="filterCountryId" id="filterCountryId" class="form-control">
                        <option value="0">Select country</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Applied User Role</label>
                    <input type="text" id="filterAppliedUserRole" class="form-control">
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>No. of records</label>
                    <input type="text" id="pageSize" class="form-control" onkeydown="return M.digit(event);" value="10">
                </div>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button type="button" class="btn btn-danger" onclick="resetUserApplication();"><i class="fa fa-undo"></i>&nbsp;Reset</button>
                <button type="button" class="btn btn-success ml-2" onclick="applyFilterUserApplication();"><i class="fa fa-search"></i>&nbsp;Search</button>
            </div>
        </form>`
    return html;
}

function userApplicationTableContent(status){
    var html=
        `<div class="table-responsive mt-3 bg-white p-2">
            <table id="userApplicationTable" class="table table-bordered font-12">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>S.No.</th>
                        <th>Name</th>
                        <th style="width: 130px;">Phone Number</th>
                        <th>Email</th>
                        <th>Country | Province | City</th>
                        <th>Last/Current Salary (per annum)</th>
                        <th>Last/Current Organization Name</th>
                        <th>Applied User Role</th>
                        <th>Resume/CV</th>
                        <th>Recent Photograph</th>
                        <th>Linkedin Profile</th>
                        ${/*<th>Assigned To</th>
                        <th>Application Status</th>
                        <th>Action</th>*/''}
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div id="userApplicationPagination"></div>`
    return html;
}

function userApplicationProfileStatusModal(id, status){
    var html=
        `<div class="modal fade show" id="userApplicationProfileStatusModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Profile Approval</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off" id="userApplicationProfileStatusForm">
                            <div class="form-group">
                                <label for="userApplicationProfileStatus" class="control-label">Status:</label>
                                <select class="form-control" name="userApplicationProfileStatus" id="userApplicationProfileStatus" onchange="viewAssignToListForInterview();">
                                    <option value="0">Select status</option>`
                                    if(status == "Approved For Interview"){
                                        html+=`<option value="Approved for Selection Process">Approve for Selection Process</option>
                                        <option value="Reject">Reject</option>`
                                    }else if(status == "Approved for Selection Process"){
                                        html+=`<option value="Reject">Reject</option>`
                                    }else {
                                        html+=`<option value="Approved For Interview">Approve For Interview</option>
                                        <option value="Reject">Reject</option>`
                                    }
                               html+=`</select>
                            </div>
                            <div id="assignedToInterviewDiv" class="form-group" style="display: none;">
                                <label>Assigned To</label>
                                <select id="assignedToInterview" class="form-control">
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="control-label">Remarks:</label>
                                <textarea id="userApplicationProfileRemarks" class="form-control px-2" maxlength="200"></textarea>
                            </div>
                        </form>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-danger mr-2" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="updateUserApplicationProfile(${id});">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}