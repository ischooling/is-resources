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
        +viewApplicantsAttachementModalContent()
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
                    <select name="filterAppliedUserRole" id="filterAppliedUserRole" class="form-control">
                        <option value=""></option>
                        <option value="Teacher">Teacher</option>
                        <option value="Admissions Manager">Admissions Manager</option>
                        <option value="Enrollment Manager">Enrollment Manager</option>
                        <option value="Enrollment Success Manager">Enrollment Success Manager</option>
                        <option value="Business Development Manager">Business Development Manager</option>
                        <option value="Business Development Associate">Business Development Associate</option>
                        <option value="Business Associate">Business Associate</option>
                        <option value="Administration Head">Administration Head</option>
                        <option value="Administration Associate">Administration Associate</option>
                        <option value="Head of School">Head of School</option>
                        <option value="Associate Head of School">Associate Head of School</option>
                        <option value="Principal">Principal</option>
                        <option value="Associate Principal">Associate Principal</option>
                        <option value="Operations Manager">Operations Manager</option>
                        <option value="Academic Coordinator">Academic Coordinator</option>
                        <option value="Admissions Counselor">Admissions Counselor</option>
                        <option value="Teacher Coordinator">Teacher Coordinator</option>
                        <option value="Human Resources Manager">Human Resources Manager</option>
                        <option value="IT Administrator">IT Administrator</option>
                        <option value="Office Assistant">Office Assistant</option>
                        <option value="Special Educator">Special Educator</option>
                        <option value="Activity Teacher">Activity Teacher</option>
                        <option value="Art Teacher">Art Teacher</option>
                        <option value="Music Teacher">Music Teacher</option>
                        <option value="Drama Teacher">Drama Teacher</option>
                        <option value="Career Counselor">Career Counselor</option>
                        <option value="College / University Counselor">College / University Counselor</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Student Engagement Officer">Student Engagement Officer</option>
                        <option value="Psychologist">Psychologist</option>
                        <option value="Content Writer">Content Writer</option>
                        <option value="Digital Marketing Executive">Digital Marketing Executive</option>
                        <option value="Social Media Manager">Social Media Manager</option>
                        <option value="Community Engagement Officer">Community Engagement Officer</option>
                        <option value="Parent Relations Coordinator">Parent Relations Coordinator</option>
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>No. of records</label>
                    <input type="text" id="pageSize" class="form-control" onkeydown="return M.digit(event);" value="10">
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Status</label>
                    <select name="applicantsStatus" id="applicantsStatus" class="form-control">
                        <option value="applied">Applied</option>
                        <option value="accepted">Accepted</option>
                        <option value="Reject">Rejected</option>
                    </select>
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
                        <th style="min-width: 130px;">Name | Phone Number | Email</th>
                        <th>Country | Province | City</th>
                        <th>Last/Current Salary (per annum)</th>
                        <th>Last/Current Organization Name</th>
                        <th>Applied User Role</th>
                        <th>Resume/CV</th>
                        <th>Recent Photograph</th>
                        <th>Linkedin Profile</th>
                        ${/*
                        */''}
                        <th>Assigned To</th>
                        <th>Applicants Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div id="userApplicationPagination"></div>`
    return html;
}

function userApplicationProfileStatusModal(id, status, role){
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
                                <select class="form-control" name="userApplicationProfileStatus" id="userApplicationProfileStatus" onchange="applicantsViewAssignToListForInterview();">
                                    <option value="0">Select status</option>`
                                    if(role == "Teacher" && status == "Approved For Interview"){
                                        html+=`<option value="Approved for Selection Process">Approve for Selection Process</option>
                                        <option value="Reject">Reject</option>`
                                    }else if(status == "Approved for Selection Process"){
                                        html+=`<option value="Reject">Reject</option>`
                                    }else if(status == "Applied"){
                                        if(role == "Teacher"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            <option value="Reject">Reject</option>`;
                                        }else{
                                            html+=`<option value="Reject">Reject</option>
                                            <option value="Accepted">Accepted</option>`;
                                        }
                                    }else if(status == "Accepted"){
                                        html+=`<option value="Reject">Reject</option>`;
                                    }else {
                                        html+=`<option value="Approved For Interview">Approve For Interview</option>
                                        <option value="Reject">Reject</option>`;
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

function viewApplicantsAttachementModalContent(){
	var html=
	'<div class="modal fade fade-scale" id="viewApplicantsAttachementModal" tabindex="-1">'
		+'<div class="modal-dialog modal-md  box-shadow-none" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">'
					+'<h6 class="heading text-white">Preview File</h6>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
				+'</div>'
				+'<div class="modal-body m-0 py-2" style="margin-top:0 !important">'
					+'<div id="pre_upload_image_div" class="full text-center upload_img d-none">'
						+'<img id="pre_upload_image" class="w-100" src="" />'
					+'</div>'
					+'<div id="pre_upload_pdf_div" class=" full text-center upload_pdf d-none">'
						+'<div class="full">'
							+'<a href="" target="_blank" class="btn btn-sm btn-primary download-pdf-btn mb-2 pull-right" download="file.pdf">Download PDF</a>'
						+'</div>'
						+'<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data=""></object>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}