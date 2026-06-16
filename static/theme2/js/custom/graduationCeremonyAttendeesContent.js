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
                            <th>S.No.</th>
                            <th>Student Info<br><small>(Name, Email, Attend As, Age, Phone, Alt Phone, Country, Timezone)</small></th>
                            <th class="d-none">Callback Info<br><small>(Status, Time Slot)</small></th>
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
