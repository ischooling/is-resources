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
            <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Name/Source</label>
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
                    <label>Assigned To</label>
                    <select id="filterAssignedTo" class="form-control">
                        <option value="">All</option>
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Application Status</label>
                    <select id="filterStatus" class="form-control">
                        <option value="">Select Status</option>
                        <option value="Approved For Interview">Approved For Interview</option>
                        <option value="Approved for Selection Process">Approved for Selection Process</option>
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Grades</label>
                    <select id="filterGrades" class="form-control">
                        ${getStandardContentByCourseProviderId(SCHOOL_ID)}
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Courses</label>
                    <select id="filterCourses" class="form-control">
                        ${getAllCoursesOptions('filterCourses')}
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>No. of records</label>
                    <input type="text" id="pageSize" class="form-control" onkeydown="return M.digit(event);" value="10">
                </div>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button type="button" class="btn btn-danger" onclick="resetTeacherScreening();"><i class="fa fa-undo"></i>&nbsp;Reset</button>
                <button type="button" class="btn btn-success ml-2" onclick="applyFilterTeacherScreening();"><i class="fa fa-search"></i>&nbsp;Search</button>
            </div>
        </form>`
    return html;
}

function teacherScreenTableContent(status){
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
                        <th>Preferred grades & courses</th>
                        <th>Linkedin Profile</th>
                        <th>Assigned To</th>
                        <th>Application Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div id="teacherScreeningPagination"></div>`
    return html;
}

function teacherPreviousExperienceModalContent(oldGrades, oldCourses, newGrades, newCourses){
    var html=
        `<div id="teacherPreviousExperienceModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">
                <div class="modal-content border-0">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Preferred grades & courses</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body overflow-y-auto" style="max-height: 80vh;">
                        <p class="mb-2">
                            <span class="font-weight-bold">Previous Grades:</span><br>
                            ${toBulletPoints(oldGrades)}
                        </p>
                        <p class="mb-2">
                            <span class="font-weight-bold">Previous Courses:</span><br>
                            ${toBulletPoints(oldCourses, true)}
                        </p>
                        <p class="mb-2">
                            <span class="font-weight-bold">New Grades:</span><br>
                            ${toBulletPoints(newGrades)}
                        </p>
                        <p class="mb-2">
                            <span class="font-weight-bold">New Courses:</span><br>
                            ${toBulletPoints(newCourses, true)}
                        </p>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function teacherScreeningProfileStatusModal(id, status){
    var html=
        `<div class="modal fade show" id="teacherScreeningProfileStatusModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Profile Approval</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off" id="teacherScreeningProfileStatusForm">
                            <div class="form-group">
                                <label for="teacherScreeningProfileStatus" class="control-label">Status:</label>
                                <select class="form-control" name="teacherScreeningProfileStatus" id="teacherScreeningProfileStatus" onchange="viewAssignToListForInterview();">
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
                                <textarea id="teacherScreeningProfileRemarks" class="form-control px-2" maxlength="200"></textarea>
                            </div>
                        </form>
                        <div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-danger mr-2" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="updateTeacherScreeningProfile(${id});">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}