function appendGraduationCeremonyAttendeesCustomCss(){
    if(typeof $ !== "undefined" && $("#graduationCeremonyAttendeesCustomCss").length < 1){
        $("head").append(`<style id="graduationCeremonyAttendeesCustomCss">${getGraduationCeremonyAttendeesCustomCss()}</style>`);
    }
}

function getGraduationCeremonyAttendeesCustomCss(){
    return `
#graduationCeremonyFilterForm.custom-field-scope .custom-field label:not(.error-msg){
    left:25px;
    z-index:7;
}

#graduationCeremonyFilterForm.custom-field-scope .custom-field .form-control{
    min-height:52px;
}

#graduationCeremonyFilterForm.custom-field-scope .custom-field .form-control::placeholder{
    color:transparent;
}

#graduationCeremonyFilterForm.custom-field-scope .custom-field select.form-control{
    background-position:right .95rem center;
}

#graduationCeremonyFilterForm .graduation-ceremony-filter-actions{
    gap:10px;
}

#attendeesTable .graduation-ceremony-action-wrap{
    display:flex;
    align-items:center;
    gap:8px;
    flex-wrap:nowrap;
}

#attendeesTable .graduation-ceremony-discard-icon{
    font-size:20px;
    cursor:pointer;
    line-height:1;
}

@media (max-width:575.98px){
    #graduationCeremonyFilterForm .graduation-ceremony-filter-actions{
        width:100%;
    }

    #graduationCeremonyFilterForm .graduation-ceremony-filter-actions .btn{
        flex:1 1 0;
    }
}
`;
}

function getGraduationCeremonyTitleOptions(){
    return [
        { value: "GRADUATION_CEREMONY_2025", label: "Graduation Ceremony 2025" },
        { value: "GRADUATION_CEREMONY_2026", label: "Graduation Ceremony 2026" }
    ];
}

function getGraduationCeremonyAttendAsOptions(){
    return [
        "Graduate",
        "Non Graduate",
        "Performer",
        "Teacher",
        "Staff"
    ];
}

function getGraduationCeremonyCountryOptions(){
    return [
        "Algeria",
        "Belgium",
        "Brazil",
        "Canada",
        "Colombia",
        "Egypt",
        "France",
        "India",
        "Indonesia",
        "Iran",
        "Kenya",
        "Lebanon",
        "Madagascar",
        "Morocco",
        "Pakistan",
        "Philippines",
        "Poland",
        "Portugal",
        "Qatar",
        "Romania",
        "Saudi Arabia",
        "Singapore",
        "South Africa",
        "Tanzania",
        "Thailand",
        "United Arab Emirates",
        "United States"
    ];
}

function getGraduationCeremonySelectOptions(options){
    return options.map(function(option){
        if(typeof option === "object"){
            return `<option value="${option.value}">${option.label}</option>`;
        }
        return `<option value="${option}">${option}</option>`;
    }).join("");
}

function getGraduationCeremonyAttendeesContent(title, roleAndModule, schoolId, userId, role){
    appendGraduationCeremonyAttendeesCustomCss();
    if(typeof resetGraduationCeremonyFilterStateToDefault === "function"){
        resetGraduationCeremonyFilterStateToDefault();
    }
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
            </div>
        </div>
    </div>
    <div class="main-card mb-3 card">
        <div class="card-body">
            <form id="graduationCeremonyFilterForm" class="border rounded-10 bg-white p-3 mb-3 mt-2 custom-field-scope" onsubmit="return false;" autocomplete="off">
                <div class="row">
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <select class="form-control" id="filterCeremonyName">
                            <option value=""></option>
                            ${getGraduationCeremonySelectOptions(getGraduationCeremonyTitleOptions())}
                        </select>
                        <label for="filterCeremonyName">Ceremony Title</label>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <input type="text" class="form-control" id="filterName" placeholder=" ">
                        <label for="filterName">Name</label>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <input type="text" class="form-control" id="filterPhone" placeholder=" " onkeydown="return M.digit(event);">
                        <label for="filterPhone">Phone</label>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <input type="text" class="form-control" id="filterEmail" placeholder=" ">
                        <label for="filterEmail">Email</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <select class="form-control" id="filterCountry">
                            <option value=""></option>
                            ${getGraduationCeremonySelectOptions(getGraduationCeremonyCountryOptions())}
                        </select>
                        <label for="filterCountry">Country</label>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <select class="form-control" id="filterAttendAs">
                            <option value=""></option>
                            ${getGraduationCeremonySelectOptions(getGraduationCeremonyAttendAsOptions())}
                        </select>
                        <label for="filterAttendAs">Attend As</label>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <select class="form-control" id="filterMembersType">
                            <option value=""></option>
                            <option value="WITH_MEMBERS">With Members</option>
                            <option value="WITHOUT_MEMBERS">Without Members</option>
                        </select>
                        <label for="filterMembersType">Members Type</label>
                    </div>
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field">
                        <select class="form-control" id="filterPaymentStatus">
                            <option value=""></option>
                            <option value="INITIATED">Initiated</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="PARTIAL_PAID">Partial Paid</option>
                            <option value="SUCCESS">Success</option>
                        </select>
                        <label for="filterPaymentStatus">Payment Status</label>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12 custom-field d-none">
                        <select class="form-control" id="filterCallbackStatus">
                            <option value=""></option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <label for="filterCallbackStatus">Callback Status</label>
                    </div>
                    <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 d-flex justify-content-end align-items-end mt-2 mt-md-0">
                        <div class="d-flex graduation-ceremony-filter-actions">
                            <button type="button" class="btn btn-danger" onclick="resetGraduationCeremonyAttendeesFilter();"><i class="fa fa-undo"></i>&nbsp;Reset</button>
                            <button type="button" class="btn btn-success" onclick="applyFilterGraduationCeremonyAttendees();"><i class="fa fa-search"></i>&nbsp;Search</button>
                        </div>
                    </div>
                </div>
            </form>
            <div class="table-responsive">
                <table class="table table-bordered table-striped border-radius-table font-12 responsive" id="attendeesTable" style="width:100% !important">
                    <thead>
                        <tr class="bg-primary text-white">
                            <th style="width:4%;">S.No.</th>
                            <th style="width:23%;">Student Info<br><small>(Name, Email, Attend As, Age, Phone, Alt Phone, Country, Timezone)</small></th>
                            <th style="width:17%;">Latest Remark</th>
                            <th class="d-none">Callback Info<br><small>(Status, Time Slot)</small></th>
                            <th style="width:30%;">Attendees</th>
                            <th style="width:5%;">No. of Attendees</th>
                            <th style="width:6%;">Amount</th>
                            <th style="width:7%;">Payment Status</th>
                            <th style="width:5%;">Food Allergy</th>
                            <th style="width:3%;">Action</th>
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

function getGraduationCeremonyCommunicationLogsModal(attendeeId){
    return `
    <div class="modal fade show" id="graduationCeremonyCommunicationLogsModal" tabindex="-1" role="dialog" aria-labelledby="graduationCeremonyCommunicationLogsModalLabel">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header py-2 bg-primary text-white">
                    <h5 class="modal-title" id="graduationCeremonyCommunicationLogsModalLabel">Remarks</h5>
                    <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <form autocomplete="off" id="graduationCeremonyCommunicationLogForm" class="custom-field-scope">
                        <div class="row align-items-start">
                            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                                <div class="position-relative form-group custom-field">
                                    <input name="logTitle" id="logTitle" placeholder=" " type="text" value="" class="form-control">
                                    <label for="logTitle">Remark Title</label>
                                </div>
                            </div>
                            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                                <div class="position-relative form-group">
                                    <label for="fileuploadLogGC" style="position:absolute;top:-9px;left:14px;background:#fff;padding:0 6px;color:#007bff;font-size:12px;font-weight:600;z-index:2;">Attachment (if any)</label>
                                    <div class="full position-relative user-application-upload-field"
                                        id="fileuploadLogGCdiv"
                                        uploaded=""
                                        fileName=""
                                        docType="communicationLog"
                                        thumbType=""
                                        data-PDFURL="">
                                        <input type="file" id="fileuploadLogGC" class="upload-input form-control"
                                            onchange="cropImageChatSupport(event,'fileuploadLogGC','fileuploadLogGCIcon','fileuploadLogGCdiv','communicationLog','','fileuploadLogGCViewAndRemoveBtn',3)">
                                        <label class="upload-label form-control mb-0 btn btn-primary px-2 d-flex align-items-center justify-content-center" style="line-height:normal;">
                                            <i class="fa fa-upload mr-2"></i>Upload
                                        </label>
                                    </div>
                                    <small class="text-muted d-block mt-1">Supported preview formats: JPG, JPEG, PNG.</small>
                                    <div class="full" id="fileuploadLogGCViewAndRemoveBtn" style="display: none;">
                                        <a id="fileuploadLogGCView" href="javascript:void(0);"
                                            class="btn btn-outline-success mr-2"
                                            onclick="viewAttachmentChatSupport(this, 'uploadFile','I','fileuploadLogGCdiv')">
                                            <i class="fa fa-eye mr-2"></i>View
                                        </a>
                                        <button type="button" id="fileuploadLogGCRemove" class="btn btn-outline-danger"
                                            onclick="showWarningMessageShow('Are you sure you want to remove this document?','removeUploadImageChatSupport(this, \\'fileuploadLogGC\\', \\'fileuploadLogGCIcon\\', \\'communicationLog\\', \\'\\', \\'fileuploadLogGCdiv\\', \\'fileuploadLogGCViewAndRemoveBtn\\',3)')">
                                            <i class="fa fa-trash mr-2"></i>Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="position-relative form-group">
                            <label title="Mandatory field">Comment<sup class="text-danger font-size-md"><b>*</b></sup></label>
                            <div id="commentEditorGC"></div>
                            <small id="commentEditorGCCounter" class="text-muted">0 / 25</small>
                        </div>
                        <div class="position-relative form-group text-right mb-0">
                            <input type="hidden" id="communicationLogIdGC" value="">
                            <a href="javascript:void(0)" id="graduationCeremonyCommunicationLogActionBtn" class="btn btn-sm btn-primary px-4" onclick="confirmSaveCommunicationLogGC('graduationCeremonyCommunicationLogForm', '${attendeeId}')">Add</a>
                        </div>
                    </form>
                    <table class="table table-hover table-striped table-bordered responsive dt-responsive mt-3" id="graduationCeremonyCommunicationLogTable" style="width:100%;">
                        <thead>
                            <tr>
                                <td>S.No.</td>
                                <td>Title</td>
                                <td>Comments</td>
                                <td>Attachment</td>
                                <td>Added by/Added At</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>`;
}

