function renderParentTeacherMeetingPage(title){
    $('#dashboardContentInHTML').html(getParentTeacherMeetingContent(title));
    ParentTeacherMeetingOnLoad();
}

function getParentTeacherMeetingContent(title){
    var sliderHtml = "";
    if(typeof getStudentTabSliderContent === "function" && typeof STUDENT_LIST !== "undefined" && STUDENT_LIST.studentBasicDetails && STUDENT_LIST.studentBasicDetails.length > 0){
        sliderHtml = getStudentTabSliderContent(STUDENT_LIST, "renderParentTeacherMeetingByStudent");
    }
    var html =
        `<div class="full">
            ${sliderHtml}
            <div class="main-card mb-3">
                ${getParentTeacherMeetingInfoContent()}
                ${getParentTeacherMeetingListContent()}
                ${getParentTeacherMeetingBookContent()}
            </div>
            ${getParentTeacherMeetingModalContent()}
        </div>`;
    return html;
}

function getParentTeacherMeetingInfoContent(){
    var html =
        `<div class="card rounded-10 border bg-light-primary shadow-sm mb-3">
            <div class="card-body py-2 px-3">
                <div class="d-flex align-items-center">
                    <span class="icon-wrapper icon-wrapper-alt rounded mr-2 ml-0" style="width:42px;height:42px;">
                        <span class="icon-wrapper-bg bg-primary"></span>
                        <i class="fa fa-calendar-plus-o text-white font-size-md"></i>
                    </span>
                    <div>
                        <h5 class="text-dark font-weight-bold mb-0 font-16">Free Parent-Teacher Meetings</h5>
                        <p class="text-dark mb-0 font-12">One free meeting per course. Additional meetings are charged.</p>
                    </div>
                    <div class="ml-auto text-right">
                        <h4 class="text-primary font-weight-bold mb-0" style="line-height:1;"><span id="ptmFreeRemaining">5</span> / 6</h4>
                        <p class="text-muted mb-0 font-12">free remaining</p>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentTeacherMeetingListContent(){
    var html =
        `<div class="custom-field-scope mb-3">
            <h4 class="text-dark font-weight-bold mb-2 font-22">
                <i class="fa fa-calendar-check-o text-primary mr-2"></i>My Parent-Teacher Meetings
            </h4>
            <div class="form-row align-items-start justify-content-xl-end mb-3">
                <div class="col-xl-auto col-lg-auto col-md-6 col-sm-12 col-12 mb-2 px-xl-1">
                    <div class="position-relative custom-field mt-3 p-0" style="width:250px;max-width:100%;">
                        <select id="mf-range" class="form-control" onchange="onRangeChange()">
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="custom">Custom</option>
                        </select>
                        <label class="font-weight-bold mb-1">Date Range</label>
                    </div>
                </div>
                <div class="col-xl-auto col-lg-auto col-md-6 col-sm-12 col-12 mb-2 px-xl-1">
                    <div class="position-relative custom-field mt-3 p-0" style="width:250px;max-width:100%;">
                        <input type="text" class="form-control" id="mf-start" placeholder=" ">
                        <label class="font-weight-bold mb-1">Start Date</label>
                    </div>
                </div>
                <div class="col-xl-auto col-lg-auto col-md-6 col-sm-12 col-12 mb-2 px-xl-1">
                    <div class="position-relative custom-field mt-3 p-0" style="width:250px;max-width:100%;">
                        <input type="text" class="form-control" id="mf-end" placeholder=" ">
                        <label class="font-weight-bold mb-1">End Date</label>
                    </div>
                </div>
                <div class="col-xl-auto col-lg-auto col-md-auto col-sm-6 col-6 mb-2 px-xl-1">
                    <div>
                        <button type="button" class="btn btn-success btn-lg px-3 mt-3" onclick="searchParentTeacherMeetings()">
                            <i class="fa fa-search mr-2"></i>Search
                        </button>
                    </div>
                </div>
                <div class="col-xl-auto col-lg-auto col-md-auto col-sm-6 col-6 mb-2 px-xl-1">
                    <div>
                        <button type="button" class="btn btn-outline-danger btn-lg px-3 mt-3" onclick="resetParentTeacherMeetings()">
                            <i class="fa fa-repeat mr-2"></i>Reset
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="parentTeacherMeetingListWrapper"></div>`;
    return html;
}

function getParentTeacherMeetingRowsContent(meetings){
    var html = "";
    $.each(meetings || [], function(index, meeting){
        html +=
            `<div class="card rounded-10 border shadow-sm mb-3">
                <div class="card-body py-2 px-3">
                    <div class="d-flex align-items-center">
                        <div>
                            <h5 class="text-dark font-weight-bold mb-1 font-16">${meeting.title}</h5>
                            <p class="text-muted font-weight-semi-bold mb-0 font-12">
                                <i class="fa fa-calendar-o mr-2"></i>${meeting.date} · ${meeting.time}
                            </p>
                        </div>
                        <a href="${getParentTeacherMeetingJoinUrl(meeting)}" target="_blank" class="btn btn-success btn-sm ml-auto px-3">
                            <i class="fa fa-video-camera mr-2"></i>Join
                        </a>
                    </div>
                </div>
            </div>`;
    });
    if(!html){
        html = `<div class="card rounded-10 border mb-3">
            <div class="card-body text-center text-muted py-4">No parent-teacher meetings found</div>
        </div>`;
    }
    return html;
}

function getParentTeacherMeetingBookContent(){
    var html =
        `<h4 class="text-dark font-weight-bold mt-4 mb-3 font-22">
            <i class="fa fa-users text-primary mr-2"></i>Book a Parent-Teacher Meeting
        </h4>
        <div class="row" id="parentTeacherMeetingTeacherWrapper"></div>`;
    return html;
}

function getParentTeacherMeetingTeacherCardsContent(teachers){
    var html = "";
    $.each(teachers || [], function(index, teacher){
        html += getParentTeacherMeetingTeacherCardContent(teacher, index);
    });
    return html;
}

function getParentTeacherMeetingTeacherCardContent(teacher, index){
    var html =
        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 mb-3">
            <div class="card rounded-10 border shadow-sm h-100">
                <div class="card-body text-center py-3">
                    <div class="avatar-icon-wrapper mx-auto mb-2" style="width:48px;height:48px;">
                        <div class="avatar-icon rounded-circle mx-auto" style="width:48px;height:48px;">
                            <img src="${teacher.profilePic}" alt="">
                        </div>
                    </div>
                    <h5 class="text-dark font-weight-bold mb-1 font-16">${teacher.teacherName}</h5>
                    <span class="badge badge-pill bg-light-primary text-primary font-12 mb-2">
                        <i class="fa fa-book mr-1"></i>${teacher.courseName}
                    </span>
                    <div class="${teacher.isFree ? 'text-success' : 'text-danger'} font-weight-bold mb-2 font-12">
                        <i class="fa ${teacher.isFree ? 'fa-calendar-plus-o' : 'fa-money'} mr-2"></i>${teacher.feeText}
                    </div>
                    <button type="button" class="btn btn-primary btn-sm px-3" onclick="openParentTeacherMeetingModal(${index})">Book Meeting</button>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentTeacherMeetingModalContent(){
    var html =
        `<div class="modal fade" id="parentTeacherMeetingModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" style="max-width:700px;width:calc(100% - 32px);" role="document">
                <div class="modal-content rounded-10 border-0">
                    <button type="button" class="close position-absolute bg-light-danger text-danger rounded-circle d-flex align-items-center justify-content-center" data-dismiss="modal" aria-label="Close" style="right:18px;top:18px;width:38px;height:38px;z-index:1;opacity:1;">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <div class="modal-body p-0" id="parentTeacherMeetingModalBody"></div>
                </div>
            </div>
        </div>`;
    return html;
}

function getParentTeacherMeetingModalBodyContent(teacher){
    var html =
        `<div class="text-center pt-4 px-4 pb-4">
            <div class="avatar-icon-wrapper mx-auto mb-3" style="width:72px;height:72px;">
                <div class="avatar-icon rounded-circle mx-auto" style="width:72px;height:72px;">
                    <img src="${teacher.profilePic}" alt="">
                </div>
            </div>
            <h4 class="text-dark font-weight-bold mb-2">${teacher.teacherName}</h4>
            <span class="badge badge-pill bg-light-primary text-primary font-12">
                <i class="fa fa-book mr-1"></i>${teacher.courseName}
            </span>
        </div>
        <hr class="m-0">
        <div class="px-4 py-4">
            <h5 class="text-dark text-center font-weight-bold mb-3">SELECT A DAY</h5>
            <div class="d-flex justify-content-center flex-wrap mb-4" id="ptmDayWrapper">
                ${getParentTeacherMeetingDayButtonsContent(getParentTeacherMeetingWeekDays())}
            </div>
            <h5 class="text-dark text-center font-weight-bold mb-3">AVAILABLE TIME SLOTS</h5>
            <div class="d-flex justify-content-center flex-wrap mb-3">
                <span class="mr-3 mb-2"><i class="fa fa-square-o text-success mr-1"></i>Available</span>
                <span class="mr-3 mb-2"><i class="fa fa-square text-success mr-1"></i>Selected</span>
                <span class="mr-3 mb-2"><i class="fa fa-square-o text-danger mr-1"></i>Booked</span>
                <span class="mb-2"><i class="fa fa-square-o text-muted mr-1"></i>Past</span>
            </div>
            <div class="row" id="ptmSlotWrapper">
                ${getParentTeacherMeetingSlotButtonsContent(teacher.slots)}
            </div>
            <div id="ptmSelectedSlotSummary"></div>
            <div class="text-center mt-3">
                <button type="button" class="btn btn-primary px-5 disabled" id="ptmConfirmMeetingBtn" onclick="confirmParentTeacherMeeting()">Select a slot to continue</button>
            </div>
        </div>`;
    return html;
}

function getParentTeacherMeetingDayButtonsContent(days){
    var html = "";
    $.each(days || [], function(index, day){
        html += `<button type="button" class="btn ${index == SELECTED_PTM_DAY_INDEX ? 'btn-primary' : 'btn-light border'} mx-1 mb-2 px-3" onclick="selectParentTeacherMeetingDay(${index})">
            <div class="font-12">${day.dayName}</div>
            <div class="font-weight-bold font-20">${day.dayNo}</div>
        </button>`;
    });
    return html;
}

function getParentTeacherMeetingSlotButtonsContent(slots){
    var html = "";
    $.each(slots || [], function(index, slot){
        var btnClass = "btn-light border";
        var extraStyle = "";
        var clickEvent = "";
        if(slot.status == "booked"){
            btnClass = "btn-outline-danger disabled";
            extraStyle = "text-decoration:line-through;";
        }else if(slot.status == "past"){
            btnClass = "btn-light border disabled text-muted";
        }else{
            btnClass = slot.selected ? "btn-success" : "btn-outline-success";
            clickEvent = `onclick="selectParentTeacherMeetingSlot(${index})"`;
        }
        html += `<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-2">
            <button type="button" class="btn ${btnClass} w-100 font-weight-bold" ${clickEvent} style="${extraStyle}">${slot.time}</button>
        </div>`;
    });
    return html;
}

function getParentTeacherMeetingSelectedSummaryContent(teacher, slot, dayDate){
    if(!slot){
        return "";
    }
    var html =
        `<div class="bg-light rounded-10 p-3 mt-3">
            <div class="text-dark">Meeting with <b>${teacher.teacherName}</b> on <b>${dayDate || ""}</b> at <b>${slot.time}</b></div>
            <div class="${teacher.isFree ? 'text-success' : 'text-danger'} font-weight-bold">${teacher.isFree ? 'Free meeting' : teacher.feeText} <span class="text-dark font-weight-normal">${teacher.isFree ? '(first one for this course)' : ''}</span></div>
        </div>`;
    return html;
}
