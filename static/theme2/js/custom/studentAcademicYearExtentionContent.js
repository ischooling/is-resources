function getStudentAcademicYearExtentionContent(pageData){
    var messageHtml = `<div class="col-md-12 col-sm-12">
            <h4 class="text-primary text-center">${studentAcademicYearExtentionEscapeHtml(pageData.message || "N/A")}</h4>
            <br />
        </div>`;

    var coursesHtml = "";
    if(pageData.showDetails && pageData.courses && pageData.courses.length > 0){
        $.each(pageData.courses, function(_, subject){
            var cardBg = subject.bgColor || "bg-primary";
            var imgHtml = "";
            if(subject.imgURl){
                imgHtml = `<img src="${subject.imgURl}" alt="" class="w-100 bg-white p-2">`;
            }else if(subject.subjectIcon){
                imgHtml = `<img src="${PATH_FOLDER_IMAGE}subjects/${subject.subjectIcon}" alt="" class="w-100 bg-white p-2">`;
            }else{
                imgHtml = `<img src="${schoolSettingsLinks.logoUrl}" alt="" class="w-100 bg-white p-2">`;
            }
            coursesHtml += `<div class="col-md-3 col-sm-6 mb-3">
                    <a onclick="return studentAcademicYearExtentionProceed('${subject.subjectId}');" href="javascript:void(0);" class="thumbnail ${cardBg} animated zoomIn d-block text-decoration-none">
                        ${imgHtml}
                        <div class="caption text-white p-2">
                            <h5 class="m-0"><span class="course-name">${studentAcademicYearExtentionEscapeHtml(subject.subjectName || "N/A")}</span></h5>
                        </div>
                    </a>
                </div>`;
        });
    }

    return `<div class="app-page-title mb-3 py-2">
        <div class="page-title-wrapper">
            <div class="page-title-heading">
                <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/Buy_Extra_Classes.png" style="max-width:200px; width: 90%; margin-right: auto; display: flex;"></div>
                <div>Academic Year Extension</div>
            </div>
        </div>
    </div>
    <div class="main-card mb-3 card">
        <div class="card-body">
            <div class="col-md-12 col-sm-12 mt-3">
                <div class="row">
                    ${messageHtml}
                    ${coursesHtml}
                </div>
            </div>
        </div>
    </div>`;
}

function studentAcademicYearExtentionEscapeHtml(value){
    if(value === undefined || value === null){
        return "";
    }
    return (value + "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function getStudentAcademicYearExtentionProceedContent(data){
    var extentionCostText = "USD " + studentAcademicYearExtentionEscapeHtml(data.extentionCost || "50");
    var descHtml = "";
    if(data.showNotEligible){
        descHtml = `<div><strong class="font-weight-semi-bold text-primary">${studentAcademicYearExtentionEscapeHtml(data.notEligibleMessage)}</strong></div>`;
    }else if(data.showExtension1){
        descHtml = `
            <div id="availExtention1DescDiv">
                <h6 class="text-left">
                    <b class="font-weight-semi-bold text-primary">
                        You have availed ${data.extensionCount} out of 1 extension from Extension-1.<br/>
                        By availing Extension-1 you will get an extended period of 2 weeks to complete the credit of the course, without any additional fee.
                    </b>
                </h6>
            </div>
            <div id="availExtention1Div">
                <button type="button" id="availExtention1" class="btn btn-primary mt-2" onclick="return studentAcademicYearExtentionConfirmExtension1();">Avail EXTENSION-1</button>
            </div>
            <div id="availExtention2After1DescDiv" style="display:none">
                <h6 class="text-left">
                    <b class="font-weight-semi-bold text-primary">
                        You have availed ${data.extensionCount} out of 4 extension from Extension-2.<br/>
                        Pay ${extentionCostText} to avail Extension-2.<br/>By availing Extension-2 you will get an extended period of 1 week to complete the credit of the course.
                    </b>
                </h6>
            </div>
            <div id="availExtention2After1Div" style="display:none">
                <button type="button" id="availExtention2" class="btn btn-primary mt-2" onclick="studentAcademicYearExtentionAvail('EXTENSION-2');">Avail EXTENSION-2</button>
            </div>`;
    }else if(data.showPaidExtension){
        descHtml = `
            <div id="availExtention2DescDiv">
                <h6 class="text-left">
                    <strong class="font-weight-semi-bold text-primary">
                        You have availed ${data.extensionCount} out of 4 extension from Paid Extension.<br/>
                        Pay ${extentionCostText} to avail Paid Extension.<br/>By availing Paid Extension you will get an extended period of 1 week to complete the credit of the course.
                    </strong>
                </h6>
            </div>
            <div id="availExtention2Div">
                <button type="button" id="availExtention2" class="btn btn-primary mt-2" onclick="studentAcademicYearExtentionAvail('EXTENSION-2');">Avail Paid Extension</button>
            </div>`;
    }else{
        descHtml = `<div><strong class="font-weight-semi-bold text-primary">You have already availed all Extensions for ${studentAcademicYearExtentionEscapeHtml(data.subjectName)}</strong></div>`;
    }

    return `<div class="full my-2 d-flex justify-content-end">
            <a href="javascript:void(0)" onclick="showAndHideDashboardAndAdditionalContent('main')" class="btn btn-dark rounded">
                <i class="fa fa-arrow-left mr-1" aria-hidden="true"></i>Back
            </a>
        </div>
        <div class="app-page-title mb-3 py-2">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"><i class="pe-7s-notebook text-primary"></i></div>
                    <div>Extend Academic Year for ${studentAcademicYearExtentionEscapeHtml(data.subjectName)}</div>
                </div>
            </div>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <form id="availExtention" name="availExtention" method="post" autocomplete="off">
                    <div class="row">
                        <div class="col-md-3 col-sm-6">
                            <div class="full thumbnail ${studentAcademicYearExtentionEscapeHtml(data.bgColor || "bg-primary")} animated zoomIn">
                                <img src="${studentAcademicYearExtentionEscapeHtml(data.imgURl)}" alt="" class="w-100 bg-white p-2">
                                <div class="caption text-white p-2"><h5 class="m-0">${studentAcademicYearExtentionEscapeHtml(data.subjectName)}</h5></div>
                            </div>
                        </div>
                        <div class="col-md-9 col-sm-6">
                            <div class="full m-0 animated zoomIn">
                                <h4 class="font-weight-semi-bold">${studentAcademicYearExtentionEscapeHtml(data.subjectName)}</h4>
                                <div><h6>${descHtml}</h6></div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        ${getStudentAcademicYearExtentionTermModalWrapper()}`;
}

function getStudentAcademicYearExtentionTermModalWrapper(){
    return `<div id="payTabBookingSessionModal" class="modal fade fade-scale" role="dialog">
            <div class="modal-dialog modal-xl modal-dialog-centered box-shadow-none">
                <div class="modal-content">
                    <div class="modal-header pt-2 pb-2 theme-bg text-white">
                        <h5 class="modal-title">Terms and Conditions</h5>
                        <button type="button" class="close text-white" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body" id="bookSessionTermModal"></div>
                </div>
            </div>
        </div>`;
}
