function renderTeacherFeedbackPage(title){
    $('#dashboardContentInHTML').html(getTeacherFeedbackContent(title));
    TeacherFeedbackOnLoad();
}

function getTeacherFeedbackContent(title){
    var sliderHtml = "";
    if(typeof getStudentTabSliderContent === "function" && typeof STUDENT_LIST !== "undefined" && STUDENT_LIST.studentBasicDetails && STUDENT_LIST.studentBasicDetails.length > 0){
        sliderHtml = getStudentTabSliderContent(STUDENT_LIST, "renderTeacherFeedbackByStudent");
    }
    var html =
        `<div class="full">
            ${sliderHtml}
            <div class="main-card mb-3">
                <h4 class="text-dark font-weight-bold font-22 mb-3">${title}</h4>
                ${getTeacherFeedbackSummaryContent()}
                <div class="bg-light-primary text-dark rounded-10 p-3 mb-4 text-center font-14">
                    <i class="fa fa-info-circle text-primary mr-2"></i>
                    This shows the average rating your child has given each teacher across their classes.
                </div>
                <div class="row" id="teacherFeedbackCardWrapper"></div>
            </div>
            ${getTeacherFeedbackDetailsModalContent()}
        </div>`;
    return html;
}

function getTeacherFeedbackSummaryContent(){
    var html =
        `<div class="row">
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                <div class="card rounded-10 border h-100">
                    <div class="card-body py-3 px-4">
                        <div class="d-flex align-items-center">
                            <span class="icon-wrapper icon-wrapper-alt rounded mr-3 ml-0" style="width:54px;height:54px;">
                                <span class="icon-wrapper-bg bg-light-primary"></span>
                                <i class="fa fa-users text-primary font-size-lg"></i>
                            </span>
                            <span>
                                <h4 class="font-weight-bold text-dark mb-0" id="teacherFeedbackTeacherRatio">0 / 0</h4>
                                <p class="text-muted mb-0 font-weight-semi-bold font-14">Teachers Rated</p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
                <div class="card rounded-10 border h-100">
                    <div class="card-body py-3 px-4">
                        <div class="d-flex align-items-center">
                            <span class="icon-wrapper icon-wrapper-alt rounded mr-3 ml-0" style="width:54px;height:54px;">
                                <span class="icon-wrapper-bg bg-light-warning"></span>
                                <i class="fa fa-pencil-square text-warning font-size-lg"></i>
                            </span>
                            <span>
                                <h4 class="font-weight-bold text-dark mb-0" id="teacherFeedbackResponseCount">0</h4>
                                <p class="text-muted mb-0 font-weight-semi-bold font-14">Total Responses Given</p>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getTeacherFeedbackCardsContent(data){
    var html = "";
    $.each(data || [], function(index, teacher){
        html += getTeacherFeedbackCardContent(teacher, index);
    });
    if(!html){
        html = `<div class="col-12">
            <div class="card rounded-10 border">
                <div class="card-body text-center text-muted py-5">No teacher feedback found</div>
            </div>
        </div>`;
    }
    return html;
}

function getTeacherFeedbackCardContent(teacher, index){
    var isRated = parseFloat(teacher.rating || 0) > 0;
    var html =
        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
            <div class="card rounded-10 border h-100" style="min-height:145px;">
                <div class="card-body p-3">
                    <div class="d-flex align-items-start">
                        <div class="avatar-icon-wrapper mr-2" style="width:48px;height:48px;min-width:48px;">
                            <div class="avatar-icon rounded-circle" style="width:48px;height:48px;">
                                <img src="${teacher.profilePic}" alt="">
                            </div>
                        </div>
                        <div style="max-width:calc(100% - 132px);min-width:0;">
                            <h5 class="text-dark font-weight-bold mb-1 font-16">${teacher.teacherName}</h5>
                            <span class="badge badge-pill bg-light-primary text-primary font-12 d-inline-block" style="max-width:100%;overflow:hidden;text-overflow:ellipsis;vertical-align:bottom;">
                                <i class="fa fa-book mr-1"></i>${teacher.courseName}
                            </span>
                        </div>
                        <div class="ml-auto text-right" style="min-width:74px;">`;
                            if(isRated){
                                html += `<h4 class="text-dark font-weight-bold mb-0" style="line-height:1;">${teacher.rating}<span class="font-12 text-muted">/5</span></h4>
                                    <div class="text-warning font-14 mt-1" style="white-space:nowrap;">${getTeacherFeedbackStarsContent(teacher.rating)}</div>`;
                            }else{
                                html += `<span class="badge badge-pill bg-light-warning text-warning font-12 d-inline-block" style="white-space:nowrap;">
                                    <i class="fa fa-clock-o mr-1"></i>Not rated yet
                                </span>`;
                            }
                        html += `</div>
                    </div>
                    <hr class="my-3">`;
                    if(isRated){
                        html += `<div class="d-flex align-items-center">
                            <span class="text-muted font-weight-semi-bold font-12">
                                <i class="fa fa-pencil-square text-muted mr-1"></i>${teacher.responseCount} responses given
                            </span>
                            <a href="javascript:void(0)" class="ml-auto text-primary font-weight-bold text-decoration-none font-12" onclick="viewTeacherFeedbackDetails(${index})">
                                View details <i class="fa fa-angle-right ml-1"></i>
                            </a>
                        </div>`;
                    }else{
                        html += `<div class="text-center text-muted font-weight-semi-bold font-12 py-1">No feedback given yet</div>`;
                    }
                html += `</div>
            </div>
        </div>`;
    return html;
}

function getTeacherFeedbackStarsContent(rating){
    var html = "";
    var ratingValue = parseFloat(rating || 0);
    for(var i = 1; i <= 5; i++){
        html += `<i class="fa ${i <= Math.round(ratingValue) ? 'fa-star' : 'fa-star-o'}"></i>`;
    }
    return html;
}

function getTeacherFeedbackDetailsModalContent(){
    var html =
        `<div class="modal fade" id="teacherFeedbackDetailsModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" style="max-width:560px;width:calc(100% - 32px);" role="document">
                <div class="modal-content rounded-10 border-0">
                    <button type="button" class="close position-absolute bg-light-danger text-danger rounded-circle d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close" style="right:18px;top:18px;width:38px;height:38px;z-index:1;opacity:1;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="modal-body p-0" id="teacherFeedbackDetailsBody"></div>
                </div>
            </div>
        </div>`;
    return html;
}

function getTeacherFeedbackDetailsContent(teacher){
    var html =
        `<div class="text-center pt-4 px-4 pb-3">
            <div class="avatar-icon-wrapper mx-auto mb-3" style="width:72px;height:72px;">
                <div class="avatar-icon rounded-circle mx-auto" style="width:72px;height:72px;">
                    <img src="${teacher.profilePic}" alt="">
                </div>
            </div>
            <h5 class="text-dark font-weight-bold mb-1 font-18">${teacher.teacherName}</h5>
            <span class="badge badge-pill bg-light-primary text-primary font-12">
                <i class="fa fa-book mr-1"></i>${teacher.courseName}
            </span>
            <div class="bg-light rounded-10 px-3 py-3 mt-4 w-100">
                <div class="d-flex align-items-center flex-wrap">
                    <div class="d-flex align-items-end">
                        <h3 class="text-dark font-weight-bold mb-0">${teacher.rating}</h3>
                        <span class="font-16 text-muted mb-1 ml-1">/5</span>
                    </div>
                    <div class="text-warning font-18 ml-3">${getTeacherFeedbackStarsContent(teacher.rating)}</div>
                    <div class="ml-auto text-dark font-weight-bold font-12">Based on ${teacher.responseCount} responses</div>
                </div>
            </div>
        </div>
        <hr class="m-0">
        <div class="px-4 py-3">
            ${getTeacherFeedbackRatingRowsContent(teacher.ratings)}
        </div>`;
    return html;
}

function getTeacherFeedbackRatingRowsContent(ratings){
    var html = "";
    $.each(ratings || [], function(index, item){
        html += `<div class="d-flex align-items-center py-2">
            <div class="text-dark font-weight-semi-bold font-14">${item.label}</div>
            <div class="ml-auto d-flex align-items-center">
                <span class="text-warning font-18 mr-3">${getTeacherFeedbackStarsContent(item.rating)}</span>
                <span class="text-dark font-weight-bold font-16" style="min-width:34px;text-align:right;">${item.rating}</span>
            </div>
        </div>`;
    });
    if(!html){
        html = `<div class="text-center text-muted py-3">No feedback details available</div>`;
    }
    return html;
}
