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
        <div class="d-flex align-items-center justify-content-end gap-5">
            <a href="javascript:void(0)" onclick="showAddQuestionsModal();" class="btn btn-outline-primary">
                View/Add Questions
            </a>
            <a href="javascript:void(0)" onclick="showFilterUserApplication();" class="btn btn-primary">
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
        `<form id="userScreeningFilterForm" class="border rounded-10 bg-white p-3 mb-3 mt-2">
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
                        <option value="School Admin">School Admin</option>
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
                        <option value="Special Educators">Special Educators</option>
                        <option value="Activity Teacher">Activity Teacher</option>
                        <option value="Art Teacher">Art Teacher</option>
                        <option value="Music Teacher">Music Teacher</option>
                        <option value="Drama Teacher">Drama Teacher</option>
                        <option value="Career Counselor">Career Counselor</option>
                        <option value="College / University Counselor">College / University Counselor</option>
                        <option value="Accountant">Accountant</option>
                        <option value="Student Admission Advisor">Student Admission Advisor</option>
                        <option value="Student Engagement Officer">Student Engagement Officer</option>
                        <option value="Psychologist">Psychologist</option>
                        <option value="Content Writer">Content Writer</option>
                        <option value="Digital Marketing Executive">Digital Marketing Executive</option>
                        <option value="Social Media Manager">Social Media Manager</option>
                        <option value="Community Engagement Officer">Community Engagement Officer</option>
                        <option value="Parent Relations Coordinator">Parent Relations Coordinator</option>
                    </select>
                </div>
                ${/*<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>No. of records</label>
                    <input type="text" id="pageSize" class="form-control" onkeydown="return M.digit(event);" value="10">
                </div>*/''}
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Status</label>
                    <select name="applicantsStatus" id="applicantsStatus" class="form-control">
                        <option value="">Select Status</option>
                        <option value="Applied">Applied</option>
                        <option value="Approved For Interview">Approve For Interview</option>
                        <option value="Step 2 | Few Questions">Step 2 | Few Questions</option>
                        <option value="Few Questions Submitted">Few Questions Submitted</option>
                        <option value="New Applications">New Applications</option>
                        <option value="On Hold">On Hold</option>
                        <option value="accepted">Accepted</option>
                        <option value="Reject">Rejected</option>
                    </select>
                </div>
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <label>Date</label>
                    <div class="d-flex gap-5">
                        <select onchange="setFilterDatesAccordingly(this, '#filterStartDate', '#filterEndDate')" id="filterDateDuration" name="filterDateDuration" class="form-control font-14">
                            <option value="Today">Today</option>  
                            <option value="Week">Week</option>
                            <option value="Month">Month</option>
                            <option value="Custom" selected>Custom</option>
                        </select>
                        <input type="text" class="form-control" id="filterStartDate" readonly onkeydown="return false" />
                        <input type="text" class="form-control" id="filterEndDate" readonly onkeydown="return false" />
                    </div>
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
        `<div class="d-flex flex-column">
            <div class="d-flex align-items-center gap-10">
                <div class="d-flex justify-content-between align-items-center w-fit-content mb-3" style="background-color: #C6E2FF;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #027FFF">
                    <p class="mb-0">Total Applications | Today's Applications</p>
                    <p class="mb-0 text-white bg-primary px-2 rounded ml-2"><a href="javascript:void(0);" id="totalRecordsJA" onclick="loadUserApplicationData(false, 'card');" class="text-white">0</a> | <a href="javascript:void(0);" id="todayRecordsJA" onclick="loadUserApplicationData(true, 'card');" class="text-white">0</a></p>
                </div>
                <div class="d-flex justify-content-between align-items-center w-fit-content mb-3" style="background-color: #FFFFDE;border-radius: 5px;padding: 5px 10px;font-weight: bold;border: 1.5px solid #d4d481">
                    <p class="mb-0">Teacher | Other Roles</p>
                    <p class="mb-0 text-dark px-2 rounded ml-2" style="background-color: #F3F39E"><a href="javascript:void(0);" id="teachingRecordsJA" onclick="loadUserApplicationData(false, 'teachingCard', 'true');" class="text-dark">0</a> | <a href="javascript:void(0);" id="nonTeachingRecordsJA" onclick="loadUserApplicationData(false, 'teachingCard', false);" class="text-dark">0</a></p>
                </div>
            </div> 
            <div class="form-inline">
                <label class="mr-2">Show</label>
                <select id="recordsPerPageJA" class="form-control form-control-sm" onchange="loadUserApplicationData()">
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <label class="ml-2">entries</label>
            </div>
        </div>
        <div class="table-responsive mt-3 bg-white p-2">
            <table id="userApplicationTable" class="table table-bordered font-12">
                <thead class="bg-primary text-white">
                    <tr>
                        <th>S.No.</th>
                        <th style="min-width: 130px;">Applied Date | Name | Phone Number | Email | Source</th>
                        <th>Country | Province | City</th>
                        <th>Last/Current Salary (per annum)</th>
                        <th>Last/Current Organization Name</th>
                        <th>Applied User Role</th>
                        <th>Resume/CV</th>
                        <th>Recent Photograph</th>
                        <th>Linkedin Profile</th>
                        <th>Q/A</th>
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
        `<div class="modal right-slide-modal fade show" id="userApplicationProfileStatusModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
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
                                <select class="form-control" name="userApplicationProfileStatus" id="userApplicationProfileStatus" onchange="applicantsViewAssignToListForInterview('${role}');">
                                    <option value="0">Select Status</option>`
                                    if(role == "Teacher"){
                                        if(status == "Applied"){
                                            html+=`<option value="Step 2 | Few Questions">Step 2 | Few Questions</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Approved For Interview"){
                                            html+=`<option value="Approved for Selection Process">Approve for Selection Process</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Approved for Selection Process"){
                                            html+=`<option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "On Hold"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            <option value="Approved for Selection Process">Approve for Selection Process</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Step 2 | Few Questions"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Few Questions Submitted"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }
                                    }else{
                                        if(status == "Applied"){
                                            html+=`<option value="Step 2 | Few Questions">Step 2 | Few Questions</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Approved For Interview"){
                                            html+=`<option value="Accepted">Accepted</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Accepted"){
                                            html+=`<option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "On Hold"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            w<option value="Accepted">Accepted</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Step 2 | Few Questions"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }else if(status == "Few Questions Submitted"){
                                            html+=`<option value="Approved For Interview">Approve For Interview</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Reject">Reject</option>`;
                                        }
                                    }
                               html+=`</select>
                            </div>
                            <div id="assignedToInterviewDiv" class="form-group" style="display: none;">
                                <label>Assigned To</label>
                                <select id="assignedToInterview" class="form-control"></select>
                            </div>
                            <div id="questionsDiv" class="form-group" style="display:none;">
                                <label>Questions</label>

                                <p class="text-secondary mb-2 font-14 font-weight-semi-bold">
                                    Note- Drag the questions you want to send to user
                                </p>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center gap-5 mb-2">
                                            <h6 class="text-muted">Available Questions</h6>
                                            <a href="javascript:void(0);" id="addAllQuestionsBtn" class="btn btn-outline-primary btn-sm" onclick="addAllQuestions();" style="display:none;">Add All →</a>
                                        </div>
                                        <ul id="availableQuestions"
                                            class="list-group sortable-group p-2 border rounded"
                                            style="height: 40vh; overflow-y: auto;">
                                        </ul>
                                    </div>

                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center gap-5 mb-2">
                                            <h6 class="text-primary">Selected Questions (Priority Order)</h6>
                                            <a href="javascript:void(0);" id="removeAllQuestionsBtn" class="btn btn-outline-danger btn-sm" onclick="removeAllQuestions();" style="display:none;">← Remove All</a>
                                        </div>
                                        <ul id="selectedQuestions"
                                            class="list-group sortable-group p-2 border rounded"
                                            style="height: 40vh; overflow-y: auto;">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="message-text" class="control-label">Remarks:</label>
                                <textarea id="userApplicationProfileRemarks" class="form-control px-2" maxlength="200"></textarea>
                                <p class="text-secondary mb-0 font-14 ml-1 mt-1 font-weight-semi-bold">Note- Remarks will be sent to the applicant via email.</p>
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

function communicationLogsContentForUserApplication(userId, useRole){
    var html=
        `<div class="modal fade show" id="userApplicationCommunicationLogsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Remark Logs</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off" id="userScreeningProfileStatusForm">
                            <div class="row">
                                <div class="col-lg-4 col-md-6 col-sm-12 col-12">
                                    <div class="position-relative form-group">
                                        <label for="title" class="">Remark Title</label>
                                        <input name="logTitle" id="logTitle" placeholder="Title" type="text" value="" class="form-control">
                                    </div>
                                </div>
                                ${/*<div class="col-lg-4 col-md-6 col-sm-12 col-12">
                                    <div class="position-relative form-group">
                                        <label for="title" class="">Status</label>
                                        <select id="reLeadStatus" class="form-control"></select>
                                    </div>
                                </div>*/''}
                                <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-1 mt-1">
                                    <label class="m-0 full">&nbsp;Attachment (if any)</label>
                                    <div class="full position-relative" 
                                        id="fileuploadLog7div" 
                                        uploaded="" 
                                        fileName="" 
                                        docType="communicationLog" 
                                        thumbType="" 
                                        data-PDFURL="">
                                        
                                        <input type="file" id="fileuploadLog7" class="upload-input form-control"
                                            onchange="cropImageChatSupport(event,'fileuploadLog7','fileuploadLog7Icon','fileuploadLog7div','communicationLog','','fileuploadLog7ViewAndRemoveBtn',3)">
                                        
                                        <label class="upload-label form-control mb-0 btn btn-primary">
                                            <i class="fa fa-upload mr-2"></i>Upload
                                        </label>
                                    </div>

                                    <div class="full" id="fileuploadLog7ViewAndRemoveBtn" style="display: none;">
                                        <a id="fileuploadLog7View" href="javascript:void(0);"
                                            class="btn btn-outline-success mr-2"
                                            onclick="viewAttachmentChatSupport(this, 'uploadFile','I','fileuploadLog7div')">
                                            <i class="fa fa-eye mr-2"></i>View
                                        </a>

                                        <button type="button" id="fileuploadLog7Remove" class="btn btn-outline-danger"
                                            onclick="showWarningMessageShow(
                                                'Are you sure you want to remove this document?',
                                                'removeUploadImageChatSupport(this, \\'fileuploadLog7\\', \\'fileuploadLog7Icon\\', \\'communicationLog\\', \\'\\', \\'fileuploadLog7div\\', \\'fileuploadLog7ViewAndRemoveBtn\\',3)'
                                            )">
                                            <i class="fa fa-trash mr-2"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="position-relative form-group">
                                <label for="title" title="Mandatory field">Comment<sup class="text-danger font-size-md"><b>*</b></sup></label>
                                <div id="commentEditorJA"></div>
                            </div>
                            <div class="position-relative form-group text-right mb-0">
                                <a href="javascript:void(0)" class="btn btn-sm btn-primary px-4" onclick="saveCommunicationLogJA('userScreeningProfileStatusForm', '${userId}', '${useRole}')">Add</a>
                            </div>
                        </form>`
                        +getAddCommunicationLogTableJA()
                        +getCommunicationAttchFileModalJA();
                    html+=`</div>
                </div>
            </div>
        </div>`
    return html; 
}

function getAddCommunicationLogTableHeaderJA(){
	var html = 
        `<thead>
            <tr>	
                <td>S.No.</td>
                <td>Title</td>
                ${/*<td>Status</td>*/''}
                <td>Comments</td>
                <td>Attachment</td>
                <td>Added by/Added At</td>
            </tr>
        </thead>`;
	return html;
}

function getAddCommunicationLogTablebodyJA(result){
	var html='';
    $.each(result.commonCommentsDTO, function(k, v) {
        html+=
        `<tr id="commLog${v.commentId}">
            <td>${k+1}</td>
            <td>${v.title}</td>
            ${/*<td>${v.status}</td>*/''}
            <td>${v.comments}</td>
            <td class="text-center">`
                if(v.uploadFile != '' && v.uploadFile != 'No file chosen...'){
                    html+=`<a target="_blank" href="${FILE_UPLOAD_PATH}${v.uploadFile}" ><i class="fa fa-eye"></i></a>`;
                }else{
                    html+=`N/A`;
                }
            html+=`</td>
            <td>${v.addedByName}/${v.createdAt}</td>'
        </tr>`;
    });
	return html;
}

function getAddCommunicationLogTableJA(){
	html=`<table class="table table-hover table-striped table-bordered responsive dt-responsive mt-3" id="communicationLogTableJA" style="width:100%;">`
			+getAddCommunicationLogTableHeaderJA()
			html+=`<tbody>
			</tbody>
		</table>`;
	return html;
}

function getCommunicationAttchFileModalJA(){
	var html=
        `<div class="modal fade" id="communicationattachModal" tabindex="-1">
            <div class="modal-dialog modal-sm modal-notify" role="document">
                <div class="modal-content text-center">
                    <div class="modal-header">
                        <h5 class="modal-title" >Attachment</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body delete-modal" style="padding-top:12px">
                    </div>
                    <div class="modal-footer text-right">
                        <button type="button" class="btn bg-primary " data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`
	return html;
}

function getChatImageCropContentJA(){
	var html=
	'<div class="modal fade" id="cropModalChatSuport" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">'
		+'<div class="modal-dialog modal-lg p-0" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header">'
					+'<h5 class="modal-title" id="modalLabel">Crop the image</h5>'
					// +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					+'<div class="ml-auto">'
						+'<button type="button" class="btn btn-secondary  mr-1" data-dismiss="modal">Cancel</button>'
						+'<button type="button" class="btn btn-primary mr-1" id="cropChatSupportDoc" onclick="cropImgfun()">Crop</button>'
						+'<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>'
					+'</div>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="img-container">'
						+'<img id="cropModalImgChatSuport" src="https://avatars0.githubusercontent.com/u/3456749" width="100%" style="width:100%">'
					+'</div>'
				+'</div>'
				// +'<div class="modal-footer">'
				// 	+'<button type="button" class="btn btn-secondary " data-dismiss="modal">Cancel</button>'
				// 	+'<button type="button" class="btn btn-primary" id="cropChatSupportDoc" onclick="cropImgfun()">Crop</button>'
				// 	+'<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>'
				// +'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function pdfPreviewJA(){
	var html=
	'<div class="modal fade fade-scale" id="uploadFile" tabindex="-1">'
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

function addQuestionsModal(){
    var html=
        `<div class="modal right-slide-modal fade" id="addQuestionsModal" tabindex="-1">
            <div class="modal-dialog" role="document">
                <div class="modal-content text-center">
                    <div class="modal-header">
                        <h5 class="modal-title">View/Add Question</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" style="padding-top:12px">
                        <ul class="nav nav-tabs" id="questionTabs" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link font-weight-semi-bold active" id="view-tab" data-toggle="tab" href="#viewQuestionsTab" onclick="getAllQuestions();" role="tab">View Questions</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link font-weight-semi-bold" id="add-tab" data-toggle="tab" href="#addQuestionsTab" role="tab">Add Question</a>
                            </li>
                        </ul>
                        <div class="tab-content mt-3">
                            <div class="tab-pane fade show active" id="viewQuestionsTab" role="tabpanel">
                                <div class="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 text-left p-0">
                                    <label>Filter Role</label>
                                    <select name="filterRoleType" onchange="getAllQuestions();" id="filterRoleType" class="form-control">
                                        <option value="">All</option>
                                        <option value="Common">Common</option>
                                        <option value="Teacher">Teacher</option>
                                        <option value="Admissions Manager">Admissions Manager</option>
                                        <option value="Enrollment Manager">Enrollment Manager</option>
                                        <option value="Enrollment Success Manager">Enrollment Success Manager</option>
                                        <option value="Business Development Manager">Business Development Manager</option>
                                        <option value="Business Development Associate">Business Development Associate</option>
                                        <option value="Business Associate">Business Associate</option>
                                        <option value="School Admin">School Admin</option>
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
                                        <option value="Special Educators">Special Educators</option>
                                        <option value="Activity Teacher">Activity Teacher</option>
                                        <option value="Art Teacher">Art Teacher</option>
                                        <option value="Music Teacher">Music Teacher</option>
                                        <option value="Drama Teacher">Drama Teacher</option>
                                        <option value="Career Counselor">Career Counselor</option>
                                        <option value="College / University Counselor">College / University Counselor</option>
                                        <option value="Accountant">Accountant</option>
                                        <option value="Student Admission Advisor">Student Admission Advisor</option>
                                        <option value="Student Engagement Officer">Student Engagement Officer</option>
                                        <option value="Psychologist">Psychologist</option>
                                        <option value="Content Writer">Content Writer</option>
                                        <option value="Digital Marketing Executive">Digital Marketing Executive</option>
                                        <option value="Social Media Manager">Social Media Manager</option>
                                        <option value="Community Engagement Officer">Community Engagement Officer</option>
                                        <option value="Parent Relations Coordinator">Parent Relations Coordinator</option>
                                    </select>
                                </div>
                                <p class="mt-2 mb-0 text-danger font-weight-semi-bold text-left px-2 py-1 rounded font-12">Note: <span class="font-weight-bold">*</span> are mandatory questions</p>
                                <div id="allQuestionsWrapper" style="max-height: 60vh; overflow-y: auto;"></div>
                                <div id="changeQuesPriorityBtnWrapper" class="d-flex gap-10 justify-content-end align-items-center">
                                    <a href="javascript:void(0);" id="changePriorityBtn" class="btn btn-primary mr-2" onclick="enablePriorityChange();">Change questions priority</a>
                                    <a href="javascript:void(0);" id="saveOrderBtn" class="btn btn-success mr-2 d-none" onclick="saveNewOrder();">Save New Order</a>
                                    <a href="javascript:void(0);" id="cancelOrderBtn" class="btn btn-secondary mr-2 d-none" onclick="cancelPriorityChange();">Cancel</a>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="addQuestionsTab" role="tabpanel">
                                <div class="row">
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 text-left">
                                        <label>User Role</label>
                                        <select name="roleType" id="roleType" class="form-control">
                                            <option value="Common">Common</option>
                                            <option value="Teacher">Teacher</option>
                                            <option value="Admissions Manager">Admissions Manager</option>
                                            <option value="Enrollment Manager">Enrollment Manager</option>
                                            <option value="Enrollment Success Manager">Enrollment Success Manager</option>
                                            <option value="Business Development Manager">Business Development Manager</option>
                                            <option value="Business Development Associate">Business Development Associate</option>
                                            <option value="Business Associate">Business Associate</option>
                                            <option value="School Admin">School Admin</option>
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
                                            <option value="Special Educators">Special Educators</option>
                                            <option value="Activity Teacher">Activity Teacher</option>
                                            <option value="Art Teacher">Art Teacher</option>
                                            <option value="Music Teacher">Music Teacher</option>
                                            <option value="Drama Teacher">Drama Teacher</option>
                                            <option value="Career Counselor">Career Counselor</option>
                                            <option value="College / University Counselor">College / University Counselor</option>
                                            <option value="Accountant">Accountant</option>
                                            <option value="Student Admission Advisor">Student Admission Advisor</option>
                                            <option value="Student Engagement Officer">Student Engagement Officer</option>
                                            <option value="Psychologist">Psychologist</option>
                                            <option value="Content Writer">Content Writer</option>
                                            <option value="Digital Marketing Executive">Digital Marketing Executive</option>
                                            <option value="Social Media Manager">Social Media Manager</option>
                                            <option value="Community Engagement Officer">Community Engagement Officer</option>
                                            <option value="Parent Relations Coordinator">Parent Relations Coordinator</option>
                                        </select>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 text-left">
                                        <label>Question Type</label><br>
                                        <label class="mr-3 mt-2">
                                            <input type="radio" name="questionType" value="M" checked> Mandatory
                                        </label>
                                        <label>
                                            <input type="radio" name="questionType" value="N"> Non-Mandatory
                                        </label>
                                    </div>
                                    <div class="col-12 mt-3 text-left">
                                        <label>Question</label>
                                        <textarea id="questionText" class="form-control" rows="3"></textarea>
                                    </div>
                                    <div class="col-12 mt-3">
                                        <button class="btn btn-primary float-right" onclick="saveQuestion('addQuestionsModal')">Save Question</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function qaModalContent(data){
    var html=
        `<div id="qaModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">
                <div class="modal-content border-0">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Questions & Answers</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body overflow-y-auto" style="max-height: 80vh;">`
                        data.forEach(function(item){
                            html+=
                            `<div class="mb-3 p-3 border rounded">
                                <p class="mb-1 font-weight-bold">
                                    Q${item.displayOrder}. ${item.questionText}
                                    ${item.questionType === "M" ? `<span class="text-danger">*</span>` : ""}
                                </p>
                                <p class="mb-0 pl-2">${item.answerText || "<em class='text-muted'>No answer</em>"}</p>
                            </div>`
                        })
                    html+=`</div>
                </div>
            </div>
        </div>`
    return html;
}

function allQuestionsContent(data) {
    var html=``;
    if (data.commonQuestions && data.commonQuestions.length > 0) {
        if($("#addQuestionsModal #filterRoleType").val() == "" || $("#addQuestionsModal #filterRoleType").val() == "Common"){
            html+=`<h6 class="text-primary font-weight-bold my-2 text-left">Common Questions 
                <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary d-none revert-role-btn" onclick="revertSingleRole('Common')"><i class="fa fa-refresh" aria-hidden="true"></i> Revert</a>
            </h6>
            <ul class="list-group mb-3 w-75 sortable-group" data-role="Common">`;
                data.commonQuestions.forEach(q => {
                    html+=
                    `<li class="list-group-item text-left sortable-item" data-id="${q.id}" data-role="${q.roleType}">
                        <div><i class="fa fa-arrows-v text-primary d-none" aria-hidden="true"></i> <strong>Q.${q.displayOrder}</strong> ${q.questionText} <span class="text-danger font-weight-semi-bold">${q.questionType == "M" ? "*" : ""}</span></div>
                    </li>`;
                });
            html+=`</ul>`;
        }
    }
    if(data.roleQuestions && data.roleQuestions.length > 0) {
        var grouped = {};
        data.roleQuestions.forEach(q => {
            if (!grouped[q.roleType]) grouped[q.roleType] = [];
            grouped[q.roleType].push(q);
        });
        Object.keys(grouped).forEach(role => {
            html+=
            `<h6 class="text-primary font-weight-bold mt-4 mb-2 text-left">${role} Questions
                <a href="javascript:void(0)" class="btn btn-sm btn-outline-primary d-none revert-role-btn" onclick="revertSingleRole('${role}')"><i class="fa fa-refresh" aria-hidden="true"></i> Revert</a>
            </h6>
            <ul class="list-group mb-3 w-75 sortable-group" data-role="${role}">`;
            grouped[role].forEach(q => {
                html += `
                    <li class="list-group-item text-left sortable-item" data-id="${q.id}" data-role="${q.roleType}">
                        <div><i class="fa fa-arrows-v text-primary d-none" aria-hidden="true"></i> <strong>Q.${q.displayOrder}</strong> ${q.questionText} <span class="text-danger font-weight-semi-bold">${q.questionType == "M" ? "*" : ""}</span></div>
                    </li>`;
                });
            html+=`</ul>`;
        });
    }
    if (html.trim() === "") {
        html = `<p class="text-muted">No questions available.</p>`;
    }
    return html;
}