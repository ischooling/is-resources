var schoolSettingsLinks;
async function jobApplicationQAContent(){
    schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
    var html=
        `<div class="app-main w-100 pb-3 position-sticky bg-white shadow" style="top: 0; z-index: 1;">
            <div class="full text-center mt-3">
                <a href="${schoolSettingsLinks.schoolWebsite}" target="blank">
                    <img src="${schoolSettingsLinks.logoUrl}${SCRIPT_VERSION}" width="350px" class="new-logo-2024" />
                </a>
            </div>
        </div>
        <div id="jobApplicationQAWrapper" class="bg-light"></div>
        <div id="jobApplicationThankYouWrapper"style="display:none;">${qaThankYouContent()}</div>
        <div class="app-wrapper-footer position-fixed w-100 bg-white" style="bottom: 0; z-index: 20;">
            <div class="app-footer">
                <div class="app-footer__inner">
                    <p class="text-center" style="margin: 0">Copyright © ${new Date().getFullYear()} - ${SCHOOL_NAME} - All Rights Reserved.</p>
                </div>
            </div>
        </div>`
    return html;
}

function qaSectionContent(data, entityId, entityType, userName, lastAnsweringDate, appliedUserRole){
    var formattedDate = changeDateFormat(new Date(lastAnsweringDate), "MMM-dd-yyyy");
    var remainingDays = getRemainingDays(lastAnsweringDate);
    var html=
        `<div class="container py-4 mb-5">
            <div class="card rounded-10" style="max-widht:768px; width:100%;">
                <div class="card-body">
                    <div class="row justify-content-center">
                        <div class="col-lg-10">
                            <div class="d-flex justify-content-between align-items-center p-4 rounded-10" style="background:var(--pgc);">
                                <div class="d-flex align-items-center">
                                    <i class="fa fa-user-circle font-30 text-white mr-2"></i>
                                    <div>
                                        <h4 class="mb-0 text-white font-weight-bold">${userName}</h4>
                                        <p class="mb-0 text-white" style="opacity: 0.8;">Applied Role: ${appliedUserRole}</p>
                                    </div>
                                </div>

                                <div class="text-left bg-white rounded-10 p-2 font-12">
                                    <p class="mb-1"><i class="fa fa-calendar mr-1 text-warning"></i><span class="font-weight-bold">Validity Date for Submission:</span> ${formattedDate}</p>
                                    <p class="mb-0"><i class="fa fa-clock mr-1 text-warning"></i><span class="font-weight-bold">Remaining days:</span> ${remainingDays} days</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row justify-content-center mt-4">
                        <div class="col-lg-10">`
                            data.forEach(function(item){
                                html+=
                                `<div class="card rounded-10 mb-3">
                                    <div class="card-body">
                                        <div class="d-flex align-items-start">
                                            <div class="mr-3 text-white font-weight-semi-bold rounded-10 p-1" style="background:var(--pgc);">Q${item.displayOrder}.</div>
                                            <div class="w-100">
                                                <h5 class="font-weight-bold mb-3">${item.questionText} ${item.questionType == "M" ? "<span class='text-danger'>*</span>" : ""}</h5>
                                                <textarea id="answer_${item.id}" class="form-control" rows="3" maxLength="4000" placeholder="Type your answer here..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                            })
                        html+=`</div>
                    </div>
                    <div class="row justify-content-center">
                        <div class="col-lg-10">
                            <a href="javascript:void(0);" class="btn btn-lg btn-primary rounded-10 float-right font-16" onclick="submitAnswers('${entityId}', '${entityType}');">Submit</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function qaThankYouContent(type) {
    return `
    <div class="d-flex flex-column justify-content-center align-items-center p-md-5 p-2 mt-md-5 mt-4">
        <i class="fa fa-check font-30 p-2 rounded-circle mb-2" style="background-color: #CFE5E4; color: #0D9487;"></i>
        <h4 class="font-weight-bold text-center" style="color: #0D9487;">${type == "directThankyou" ? "Answers Already Sumitted!" : "Amazing!<br/>We have received your responses!"}</h4>
        <p class="text-center">${type == "directThankyou" ? "" : "Thank you so much for trusting and choosing International Schooling. <br/>"} If your answers match our requirements, our team will shortly send you a meeting calendar to book your first round of interview.</p>
        <a href="${schoolSettingsLinks.schoolWebsite}" class="btn btn-outline-primary"><i class="fa fa-home" aria-hidden="true"></i> Back to Home</a>
    </div>`;
}