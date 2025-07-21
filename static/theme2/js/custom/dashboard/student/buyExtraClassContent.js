var GLOBALDATA;
async function renderBuyExtraClasses(userId, activeSubjectId){
    var payload = {};
    payload['schoolId'] = SCHOOL_ID;
    payload['userId'] = userId;
    var data = await getDashboardDataBasedUrlAndPayload(true, true, 'buy-extra-class', payload);
    GLOBALDATA = data;
    if(data.status == 1){
        $("#dashboardContentInHTML").html(buyExtraClassesContent(data, userId, activeSubjectId));
        buyExtraClassOnLoadEvent(GLOBALDATA);
    }
}

function buyExtraClassesContent(data, userId, activeSubjectId){
    var html=
        headerContent()
        +cardContent(data, userId, activeSubjectId)
    return html;
}

function headerContent(){
    var html=
       `<div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"> <i class="fa fa-calendar-plus text-primary"> </i> </div>
                    <div>Buy Extra Classes</div>
                </div>
            </div>
        </div>`;
    return html;
}

function cardContent(data, userId, activeSubjectId){
    var html=
        `<div class="main-card mb-3 card">
            <div class="card-body">`
                if(data.statusCode == "AY_NOT_STARTED"){
                    html+=`<h4 class="text-center text-primary font-26 font-weight-bold">${data.message}</h4>`
                }else{
                    html+=`<div class="d-flex flex-wrap">
                        <div class="font-20 font-weight-semi-bold planStepsDiv">
                            <span class="text-primary border-bottom btn-outline-2x border-primary d-inline-block">Step 1:</span>
                            Please select a course
                        </div>
                        <div class="font-20 mt-0 ml-0 ml-sm-3 font-weight-semi-bold planStepsDiv">
                            <span class="text-primary border-bottom btn-outline-2x border-primary d-inline-block">Step 2:</span>
                            Select Plan
                        </div>
                         <div class="font-20 mt-0 ml-0 ml-sm-3 text-primary font-weight-semi-bold col-12 text-center font-24 planStepsDivForElemAndSSP">
                           Please Select a Plan
                        </div>
                        <div class="font-20 ml-auto">
                            <a href="javascript:void(0);" class="btn btn-primary mt-4 mt-lg-0 mb-0 mb-lg-3 font-weight-bold font-16" onclick="openCustomiseYourPlanModal('${encodeURIComponent(JSON.stringify(data))}', ${userId});">Customise your plan</a>
                        </div>
                    </div>

                    <div class="row mt-5">
                        <div class="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 mb-5 mb-lg-0">`
                            +getCourseListContent(data, activeSubjectId)
                        html+=`</div>
                        <div class="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">`
                            +getCourseDetailsCard(data, userId, activeSubjectId)
                        html+=`</div>
                        <div class="col-12 mt-3" id="purchasedPlans"></div>
                    </div>`;
                }
            html+=`</div>
        </div>`
    return html;
}

function getCourseListContent(data, activeSubjectId){
    var html=
        `<div class="full nav course-tab-list">`;
            $.each(data.details.subjects, function(i, course){
                var isActive = '';
                if (activeSubjectId && course.subjectId == activeSubjectId) {
                    isActive = 'active';
                } else if (!activeSubjectId && i == 0) {
                    isActive = 'active';
                }
                html+=`<a data-toggle="tab" courseId="${course.subjectId}"  href="#${course.subjectName.split(" ").join("")+i}" class="buyextraclass full mb-2 py-2 font-16 font-weight-semi-bold btn btn-outline-primary btn-sm ${isActive}">${course.subjectName}</a>`;
            });
        html+=`</div>`;
    return html;
}

function getCourseDetailsCard(data, userId, activeSubjectId){  
    data = data.details; 
    var html=
        `<div class="full">
            <div class="tab-content">`;
                $.each(data.subjects, function(i,v){
                    var isActive = '';
                    if (activeSubjectId && v.subjectId == activeSubjectId) {
                        isActive = 'active';
                    } else if (!activeSubjectId && i == 0) {
                        isActive = 'active';
                    }
                    html+=`
                    <div class="tab-pane ${isActive}" id="${v.subjectName.split(" ").join("")+i}" role="tabpanel">
                        <div class="row">`;
                            $.each(data.customPlans, function(k,customPlan){
                                if(customPlan.planName != "plan-custom"){
                                    var weeksCalculatedFromEnrollmentEndDate = calculateNoOfWeeksFromEnrollmentEndDate(v.enrollmentEndDate);
                                    var ValidNoOfWeeks = weeksCalculatedFromEnrollmentEndDate > customPlan.validity ? customPlan.validity : weeksCalculatedFromEnrollmentEndDate;
                                    html+=`<div class="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-12 mb-5 mb-md-0">
                                        <div class="card rounded-10">
                                            <div class="card-body pt-0 px-0 border border-hover-primary rounded-10">
                                                <div class="course-head py-2 position-relative mb-3">
                                                    <span class="bg-primary text-white d-inline-block p-1 pr-4 position-absolute mx-auto rounded text-center w-fit-content font-20 font-weight-semi-bold" style="top: -20px; left: 0; right: 0;">${customPlan.classCount} Classes</span>
                                                    <div class="course-offer position-absolute w-fit-content mx-auto" style="top: -50px; right: -155px; left:0;">
                                                        <div class="course-discount-offer-outer bg-white">
                                                            <div class="course-discount-offer-inner bg-success text-white flex-column">
                                                                <span class="full text-center font-weight-semi-bold">Saving</span>
                                                                <span class="full text-center font-16 font-weight-bold">${schoolSettingsTechnical.currencySymbol}${customPlan.saving}!</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="text-center text-primary bg-light-primary py-2 font-20 font-weight-bold">${schoolSettingsTechnical.currencySymbol}${parseFloat(customPlan.amount).toFixed(2)}</div>
                                                <div class="pl-3 py-2">
                                                    <ul class="mx-0 my-2 px-3 list-type-disc">
                                                        <li class="font-16 mb-1">You will receive ${customPlan.classCount} classes.</li>
                                                        <li class="font-16 mb-1">${customPlan.classCount} classes should be completed with ${ValidNoOfWeeks} weeks.</li>
                                                        <li class="font-16 mb-1">After ${ValidNoOfWeeks} weeks all unused classes will expire.</li>
                                                    </ul>    
                                                </div>
                                                <div class="text-center mx-2 row justify-content-center align-items-center" style="gap:3px;">
                                                    <a href="javascript:void(0);" class="btn btn-primary col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5" onclick="addToCartOrBuyNow('addToCart', '${customPlan.planId}', '${customPlan.planName}', '${customPlan.singleClassFee}', '${customPlan.amount}', '${customPlan.classCount}', '${ValidNoOfWeeks}', '${userId}');">Add to cart</a>
                                                    <a href="javascript:void(0);" class="btn btn-outline-primary col-12 col-sm-12 col-md-12 col-lg-12 col-xl-5" onclick="addToCartOrBuyNow('buyNow', '${customPlan.planId}', '${customPlan.planName}', '${customPlan.singleClassFee}', '${customPlan.amount}', '${customPlan.classCount}', '${ValidNoOfWeeks}', '${userId}');">Buy</a>
                                                </div>
                                            </div> 
                                        </div>
                                    </div>`;
                                }
                            });
                        html+=`</div>
                    </div>`;
                });
            html+=`</div>
        </div>`;
    return html;
}

function customiseYourPlanModal(data, subjectId, userId){
    var selectedSubject = data.details.subjects.find(item => item.subjectId == subjectId);
    var customPlan = data.details.customPlans.find(item => item.planName == 'plan-custom');
    var weeksLeft = 0;
    if (selectedSubject && selectedSubject.enrollmentEndDate) {
        weeksLeft = calculateNoOfWeeksFromEnrollmentEndDate(selectedSubject.enrollmentEndDate);
    }
    var html=
        `<div class="modal fade" id="customiseYourPlanModal" tabindex="-1" role="dialog">
            <div class="modal-dialog shadow-none modal-dialog-centered w-100" role="document" style="max-width: 650px;">
                <div class="modal-content text-center">
                    <div id="" class="modal-body">
                        <div class="position-relative">
                            <div class="bg-primary text-white d-inline-block py-2 px-4 position-absolute mx-auto rounded text-center w-fit-content font-weight-bold border border-white" style="top: -35px; left: 0; right: 0;">Customise your plan</div>
                        </div>

                        <a href="javascript:void(0);" class="btn-outline-danger btn float-right rounded-pill font-14" data-dismiss="modal">
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </a>

                        <h5 class="mt-3 mb-0 font-weight-bold">${selectedSubject ? selectedSubject.subjectName : ''}</h5>

                        <div class="text-primary bg-light-primary py-2 font-20 mt-3 font-weight-bold row px-2 justify-content-around align-items-center">
                            <div class="">
                                <p class="font-16 font-weight-semi-bold mb-2">No. of Classes</p>
                                <nav class="" aria-label="Page navigation example">
                                    <ul class="pagination pagination-sm mb-0">
                                        <li class="page-item">
                                            <a href="javascript:void(0);" class="page-link btn disabled" id="subtractBtn" onclick="subtract(1);">
                                                <span aria-hidden="true">
                                                    <i class="fa fa-minus"></i>
                                                </span>
                                            </a>
                                        </li>
                                        <li class="page-item">
                                            <a href="javascript:void(0);" class="page-link text-center" id="count1">1</a>
                                        </li>
                                        <li class="page-item">
                                            <a href="javascript:void(0);" class="page-link btn" id="addBtn" onclick="add(1);">
                                                <span aria-hidden="true">
                                                    <i class="fa fa-plus"></i>
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div class="mx-3">
                                <p class="font-16 font-weight-semi-bold mb-2">Amount</p>
                                <span class="d-inline-block mx-auto" style="width:80px;">
                                    <input type="text" class="form-control text-primary font-weight-bold bg-white" id="planAmount" readonly data-singleclassfee="${customPlan.singleClassFee}" value="${schoolSettingsTechnical.currencySymbol}${customPlan.amount}" />
                                </span>
                            </div>
                            <div class="noOfWeeks-wrapper">
                                <p class="font-16 font-weight-semi-bold mb-2">Number of Weeks</p>
                                <select id="noOfWeeks" class="form-control text-primary">
                                    <option value="">Select Weeks</option>`;
                                    for (let index = 1; index <= weeksLeft; index++) {
                                        html+=`<option value="${index}">${index}</option>`;
                                    }
                                html+=`</select>
                            </div>
                        </div>
                        <a href="javascript:void(0);" class="btn btn-primary px-4 mt-3 col-3" onclick="buyCustomClass('addToCart', '${customPlan.planId}', '${customPlan.planName}', '${customPlan.singleClassFee}','${userId}');">Add to cart</a>
                        <a href="javascript:void(0);" class="btn btn-outline-primary px-4 mt-3 col-3" onclick="buyCustomClass('buyNow', '${customPlan.planId}', '${customPlan.planName}', '${customPlan.singleClassFee}','${userId}');">Buy</a>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}

function getPurchasedPlans(data, subjectId) {
    var html = "";
    if(data.purchasedItems!=undefined){
        if($(".buyextraclass").length == 1){
            var purchasedItems = data.purchasedItems;
        }else{
            var purchasedItems = data.purchasedItems.filter(item => item.subjectId == subjectId);
        }
        var subjectName = "";
        if (purchasedItems.length > 0) {
            subjectName = purchasedItems[0].subjectName;
            html=`<h5 class="font-weight-bold mt-5 mb-3">
                <i class="fa fa-book bg-primary text-white p-2 rounded" aria-hidden="true"></i>&nbsp;Purchased Plans ${subjectName == '' ? '' : '- ' + subjectName}
            </h5>
            <table class="table table-bordered table-striped" style="width: 100% !important;">
                <thead class="bg-primary text-white rounded-10">
                    <tr>
                        <th>S.No</th>
                        <th>No. of Classes</th>
                        <th>Duration Plan</th>
                        <th>Fee Paid (${schoolSettingsTechnical.currencyIsoCode})</th>
                        <th>Plan Status</th>
                    </tr>
                </thead>
                <tbody>`;
                    $.each(purchasedItems, function (index, item) {
                        var noOfWeeks = getWeeksBetweenDates(item.planStartDate, item.planEndDate);
                        var endTime = getTimeWhenEndDatePassed(item.planEndDate);
                        html+=`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.classCount}</td>
                            <td>${item.planStartDate} to ${item.planEndDate} (${noOfWeeks == 1 ? noOfWeeks + ' week' : noOfWeeks + ' weeks'})</td>
                            <td>${schoolSettingsTechnical.currencySymbol}${parseFloat(item.planAmount).toFixed(2)}</td>
                            <td>`
                                if(endTime < 0){
                                    html+=`<span class="text-danger">Inactive</span>`;
                                }else{
                                    html+=`<span class="text-primary">Active</span>`;
                                }
                            html+=`</td>
                        </tr>`;
                    });
                html+=`</tbody>
            </table>`;
        }
    }
    return html;
}