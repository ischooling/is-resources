async function getRenderTeacherPreScreeningProfileContent(title, roleAndModule, SCHOOL_ID, USER_ID, USER_ROLE){
    $('#dashboardContentInHTML').html(renderTeacherPreScreeningProfileContent(title))
    await loadTeacherScreeningData()
}
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
        +viewTeacherScreenAttachementModalContent()
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
                        <option value="On Hold">On Hold</option>
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Grades</label>
                    <select id="filterGrades" multiple="" class="form-control">
                        ${getStandardContentByCourseProviderId(SCHOOL_ID)}
                    </select>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
                    <label>Courses</label>
                    <select id="filterCourses" multiple="" class="form-control">
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
                        <th style="min-width: 130px;">Applied Date | Name | Phone Number | Email | Source</th>
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
                        <h5 class="modal-title">Update Application Status</h5>
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
                                        <option value="On Hold">On Hold</option>
                                        <option value="Reject">Reject</option>`
                                    }else if(status == "Approved for Selection Process"){
                                        html+=`<option value="On Hold">On Hold</option>
                                        <option value="Reject">Reject</option>`;
                                    }else if(status == "On Hold"){
                                        html+=`<option value="Approved For Interview">Approve For Interview</option>
                                        <option value="Approved for Selection Process">Approve for Selection Process</option>
                                        <option value="Reject">Reject</option>`
                                    }else{
                                        html+=`<option value="Approved For Interview">Approve For Interview</option>
                                        <option value="On Hold">On Hold</option>
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

function viewTeacherScreenAttachementModalContent(){
	var html=
	'<div class="modal fade fade-scale" id="viewTeacherScreenAttachementModal" tabindex="-1">'
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

function communicationLogsContentForTeacherApplication(teacherId, useRole){
    var html=
        `<div class="modal fade show" id="teacherApplicationCommunicationLogsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Remark Logs</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form autocomplete="off" id="teacherScreeningProfileStatusForm">
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
                                        id="fileuploadLog6div" 
                                        uploaded="" 
                                        fileName="" 
                                        docType="communicationLog" 
                                        thumbType="" 
                                        data-PDFURL="">
                                        
                                        <input type="file" id="fileuploadLog6" class="upload-input form-control"
                                            onchange="cropImageChatSupport(event,'fileuploadLog6','fileuploadLog6Icon','fileuploadLog6div','communicationLog','','fileuploadLog6ViewAndRemoveBtn',3)">
                                        
                                        <label class="upload-label form-control mb-0 btn btn-primary">
                                            <i class="fa fa-upload mr-2"></i>Upload
                                        </label>
                                    </div>

                                    <div class="full" id="fileuploadLog6ViewAndRemoveBtn" style="display: none;">
                                        <a id="fileuploadLog6View" href="javascript:void(0);"
                                            class="btn btn-outline-success mr-2"
                                            onclick="viewAttachmentChatSupport(this, 'uploadFile','I','fileuploadLog6div')">
                                            <i class="fa fa-eye mr-2"></i>View
                                        </a>

                                        <button type="button" id="fileuploadLog6Remove" class="btn btn-outline-danger"
                                            onclick="showWarningMessageShow(
                                                'Are you sure you want to remove this document?',
                                                'removeUploadImageChatSupport(this, \\'fileuploadLog6\\', \\'fileuploadLog6Icon\\', \\'communicationLog\\', \\'\\', \\'fileuploadLog6div\\', \\'fileuploadLog6ViewAndRemoveBtn\\',3)'
                                            )">
                                            <i class="fa fa-trash mr-2"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="position-relative form-group">
                                <label for="title" title="Mandatory field">Comment<sup class="text-danger font-size-md"><b>*</b></sup></label>
                                <div id="commentEditorTA"></div>
                            </div>
                            <div class="position-relative form-group text-right mb-0">
                                <a href="javascript:void(0)" class="btn btn-sm btn-primary px-4" onclick="saveCommunicationLogTA('teacherScreeningProfileStatusForm', '${teacherId}', '${useRole}')">Add</a>
                            </div>
                        </form>`
                        +getAddCommunicationLogTableTA()
                        +getCommunicationAttchFileModalTA();
                    html+=`</div>
                </div>
            </div>
        </div>`
    return html; 
}

function getAddCommunicationLogTableHeaderTA(){
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

function getAddCommunicationLogTablebodyTA(result){
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

function getAddCommunicationLogTableTA(){
	html=`<table class="table table-hover table-striped table-bordered responsive dt-responsive mt-3" id="communicationLogTableTA" style="width:100%;">`
			+getAddCommunicationLogTableHeaderTA()
			html+=`<tbody>
			</tbody>
		</table>`;
	return html;
}

function getCommunicationAttchFileModalTA(){
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

function getChatImageCropContentTA(){
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

function pdfPreviewTA(){
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