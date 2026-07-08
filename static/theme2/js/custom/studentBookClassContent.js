async function renderBookClassContent(
  studentStandardId,
  showAcademicYearValidationmoduleId,
  classPlanCount,
  renderingflag,
  moduleId
) {
  var payload = {};
  payload["schoolId"] = SCHOOL_ID;
  payload["userTimezone"] = USER_TIMEZONE;
  payload["userId"] = USER_ID;
  var responseData = typeof isDummyStudentMode === "function" && isDummyStudentMode() && typeof getDummyBookAClassResponse === "function"
    ? getDummyBookAClassResponse()
    : await getDashboardDataBasedUrlAndPayload(
      true,
      true,
      "book-a-class",
      payload
    );
  if (responseData.statusCode == "BUY_A_CLASS") {
    $("#dashboardContentInHTML").html(
      pageTitleContentForClassError() +
        renderBuyAClassErrorContent(responseData)
    );
  } else if (responseData.statusCode == "AY_NOT_STARTED") {
    $("#dashboardContentInHTML").html(
      pageTitleContentForClassError() +
        renderBuyAClassErrorContent(responseData)
    );
  } else {
    data = await getDetailsForStudentBookaClass(
        responseData.details.studentStandardId
      );
    if(!renderingflag) {
      var activeIndex = $(".courseThumb.bg-primary").index(".courseThumb") + 1;
      $("#classesThumbCotentListWrapper").html(classesThumbCotentListNew(data));
      $("#bookClassContentThumbList").html(
        classThumbItemListContent(data.subjectList, moduleId)
      );
      $("#bookClassContentThumbList .courseThumbWrapper:nth-child("+activeIndex+") .courseThumb").trigger("click");
    } else {
      $("#dashboardContentInHTML").html(
          getBookClassContent(
            data,
            moduleId,
            responseData.details.showAcademicYearValidation,
            data.compClassPerweek
          )
      );
      $("#bookClassContentThumbList .courseThumb").first().trigger("click");
     // $("#pageTitle").html(pageTitleContent(data, moduleId, false));
    }
    if ($('[data-toggle="tooltip"]').length > 0) {
      $('[data-toggle="tooltip"]').tooltip();
    }
    var startDate = new Date();
    $("#bookingDate")
      .datepicker({
        autoclose: true,
        format: "M dd, yyyy",
        startDate: startDate,
      }).on("change", async function () {
        var activeIndex = $(".courseThumb.bg-primary").index(".courseThumb") + 1;
        data = await getDetailsForStudentBookaClass(
            responseData.details.studentStandardId
          );
        var moduleId = $("#bookClassContent").attr("data-moduleId");
        $("#classesThumbCotentListWrapper").html(classesThumbCotentListNew(data));
        $("#bookClassContentThumbList").html(
          classThumbItemListContent(data.subjectList, moduleId)
        );
        $("#bookClassContentThumbList .courseThumbWrapper:nth-child("+activeIndex+") .courseThumb").trigger("click");
        
      });
    studentBookClassOnLoad();
  }
}

function pageTitleContent(data, moduleId, backBtnFlag) {
  var html = `<div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
			             <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/View_Booked_Class.webp" style="max-width:90px; width: 90%; margin-right: auto; display: flex;"></i></div>

                    <div>${
                      data.registerType != "BATCH"
                        ? "Book a Class" +
                          (data.registerType != "SSP" &&
                          backBtnFlag &&
                          (data.standardId < 11 ||
                            data.standardId > 19 ||
                            data.standardId == 18)
                            ? "- " + data.subjectName
                            : "")
                        : "Book an Extra Class"
                    }</div>
                </div>`;
  if (backBtnFlag) {
    html += `<div class="page-title-actions">
                            <a href="javascript:void(0)" class="btn btn-primary" onclick="return callDashboardPageSchool(\'${moduleId}\','book-a-session','','?moduleId=${moduleId}');">Back</a>
                        </div>`;
  }
  html += `</div>
        </div>`;
  return html;
}

function pageTitleContentForClassError() {
  var html = `<div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
			             <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/View_Booked_Class.webp" style="max-width:90px; width: 90%; margin-right: auto; display: flex;"></div>
                    <div>Book a Class</div>
                </div>
            </div>
        </div>`;
  return html;
}

function getBookClassContent(data,moduleId,showAcademicYearValidation,classPlanCount) {
  
  var firstSubject = data.subjectList[0];
  console.log(data);
  var html=
    `<div id="bookClassContent" data-moduleId="${moduleId}">
      <div id="pageTitle"></div>
      <div id="classPlanCount" data-classPlanCount="${classPlanCount}"></div>
      <div class="main-card mb-3">`;
        if (showAcademicYearValidation == "Y") {
          html+=
          `<div class="card">
            <div class="card-body">
              <h4 class="my-3 font-weight-semi-bold text-center text-primary">Your academic year has not started yet. You will be able to book your classes once your academic year starts</h4>
            </div>
          </div>`;
        }
        else {
          html+=`  
            <div class="row">
              <div class="col-xl-4 col-lg-12 col-md-12 col-sm-12 col-12 mb-3" id="left-course-wrapper">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">`;
                      if(data.classData.year[0].comp>0){
                        html+=`<div class="full" id="totalClassSectionWrapper">`
                          +classesThumbsContentNew(data)
                        html+=`</div>`;
                      }
                        
                      var showSelectedCoursesForDummy = typeof getDummyStudentGradeKey === "function" && ["5", "6", "7", "8", "9", "10", "11", "12"].indexOf(getDummyStudentGradeKey()) >= 0;
                      if (!(typeof isDummyStudentMode === "function" && isDummyStudentMode()) || showSelectedCoursesForDummy) {
                       html+=`<div>`;
                          html+=`<div>`;
                              if(data.subjectList[0].name != "All Courses" && data.subjectList.length != 1){
                                html+=`<h5 class="font-16 text-dark mt-3 mb-2 font-weight-semi-bold">Your Selected Courses</h5>`;
                              }else if(data.subjectList.length== 1){
                                html+=`<h5 class="font-16 text-dark mt-3 mb-2 font-weight-semi-bold">Your Selected Course</h5>`;
                              }else{
                                html+=`<h5 class="font-16 text-dark mt-3 mb-2 font-weight-semi-bold">Your ${data.subjectList.length} Selected Courses</h5>`;
                              }
                          html+=`</div>
                          <div class="${data.subjectList[0].name != "All Courses" ? '':'mt-3'}">${classThumbItemContent(data.subjectList, moduleId)}</div>
                        </div>
                      `;
                      }
                      html+=`</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 col-12">
                <div class="card">
                  <div class="card-body">
                    <div class="full">`;
                      html+=classesThumbsButtletPointContent(classPlanCount, data.registerType, data.classData)
                    html+=`</div>
                  </div>
                </div>
                <div class="full my-3">
                  <h5 class="m-0 font-weight-semi-bold">Book Classes for this week</h5>
                </div>
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-xl-12 mb-2 p-0">
                        <h5 class="font-weight-bold">
                          ${/*
                            Book a class for the week from <span class="text-primary">`;
                              var weekStartAndEndDage = getStartAndEndDayOfType("week",new Date(),DISPLAY_DATE_ONLY);
                              html +=weekStartAndEndDage.startDatetime + " to " + weekStartAndEndDage.endDatetime;
                            html += `</span>`;  
                          */''}`;
                          if(DEPLOYMENT_MODE != "PROD") {
                            html += 
                              `<span class="d-inline-block ml-1">
                                  <input type="text" name="bookingDate" id="bookingDate" placeholder="Select Date" class="form-control w-fit-content" readonly onkeydown="return false"/>
                              </span>`;
                          }
                        html +=`</h5>    
                      </div>
                  </div>
                    <div class="full" id="singleCourseView">`;
                      html+=getSingleCourseViewContent(firstSubject, moduleId);
                    html+=`</div>
                  </div>
                </div>
              </div>
            </div>`;
        }
      html+=`</div>
    </div>`;
  return html;
}

function getSingleCourseViewContent(data, moduleId){
    // data = JSON.parse(data); 
    var html=
    `<div>
        <div class="full">
          <img src="${data.img}" class="rounded-10 border-bottom border-primary h-sm" style="object-fit: cover;" />    
        </div>
        <div class="full my-3">
          <h6 class="font-weight-semi-bold text-dark">${data.name}</h6>
        </div>
        <div class="d-flex flex-wrap">
          <div class="font-14 font-weight-semi-bold mr-2 mb-1">Left: <span class="d-inline-block px-2 p-1 mr-2 rounded bg-warning text-white" style="line-height:16px">${data.left}</span></div>
          <div class="font-14 font-weight-semi-bold mr-2 mb-1">Missed by You: <span class="d-inline-block px-2 p-1 mr-2 rounded bg-dark text-white" style="line-height:16px">${data.missedByYou}</span></div>
          <div class="font-14 font-weight-semi-bold mr-2 mb-1">Missed by Teacher: <span class="d-inline-block px-2 p-1 mr-2 rounded bg-pink text-white" style="line-height:16px">${data.missedByTeacher}</span></div>
          <div class="font-14 font-weight-semi-bold mr-2 mb-1">Rescheduled: <span class="d-inline-block px-2 p-1 mr-2 rounded bg-orange text-white" style="line-height:16px">${data.rescheduled}</span></div>
          <div class="font-14 font-weight-semi-bold mr-2 mb-1">Completed: <span class="d-inline-block px-2 p-1 mr-2 rounded bg-alternate text-white" style="line-height:16px">${data.completed}</span></div>
        </div>
        <div class="full my-3">
          <a href="javascript:void(0)" onclick="bookedCalssCotentFun(\'${data.subjectId}\',\'${moduleId}\',\'${data.studentStandardId}\',\'\', ${data.teacherName != "" ? true : false}, ${data.weekLeftClass},${data.assignedTeacherCount});" class="btn btn-primary flex-grow-1 mr-1">Booked Classes</a>`;
            if(data.subjectId != 0) {
              html += `<a href="javascript:void(0)" onclick="bookingSlotModalNew('${data.subjectId}','${moduleId}','${data.studentStandardId}', ${data.teacherName != "" ? true : false},${data.weekLeftClass},${data.assignedTeacherCount});"  class="btn flex-grow-1 ${data.weekLeftClass < 1 ? "btn-outline-dark" : "btn-outline-primary"}" ${data.teacherName != ""? 'data-toggle="tooltip" title="" data-original-title="' +(data.weekLeftClass < 1? "You have booked all your classes for this week": data.assignedTeacherCount == 1? "Book a class with " + data.teacherName + "": "Book a class") +'"': ""}>Book a Class (${data.weekLeftClass})</a>`;
            } else {
              html += `<a href="javascript:void(0)" onclick="bookingSlotModalForElementry('${data.subjectId}','${moduleId}','${data.studentStandardId}', ${data.teacherName != "" ? true : false },${data.weekLeftClass},${data.assignedTeacherCount});"  class="btn flex-grow-1 ${data.weekLeftClass < 1 ? "btn-outline-dark" : "btn-outline-primary"}" ${data.teacherName != "" ? 'data-toggle="tooltip" title="" data-original-title="' + (data.weekLeftClass < 1 ? "You have booked all your classes for this week" : data.assignedTeacherCount == 1 ? "Book a class with " + data.teacherName + "" : "Book a class") + '"': ""}>Book a Class (${data.weekLeftClass})</a>`;
            }
        html+=`</div>
    </div>
    ${/*
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
          <div class="d-flex flex-column h-100 border border-primary rounded-10">
            <div class="full course-img-wrapper">
                <img src="${v.img}" class="rounded-top-left-10 rounded-top-right-10 border-bottom border-primary h-sm" style="object-fit: cover;" />    
            </div>
            <div class="w-100 d-flex flex-column justify-content-between h-100 course-detials-wrapper p-2">
              <div class="full mt-1">
                  <h6 class="font-weight-semi-bold text-dark">${v.name}</h6>
              </div>
              <div class="full">
                <div class="d-flex flex-wrap course-detials justify-content-center mb-3">
                    <span class="d-inline-flex px-2 border border-primary text-primary rounded bg-light-primary flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Total</div>
                        <div class="font-weight-semi-bold font-10">${v.total}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-success text-success rounded bg-light-success flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Booked</div>
                        <div class="font-weight-semi-bold font-10">${v.booked}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-warning text-warning rounded bg-light-warning flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Left</div>
                        <div class="font-weight-semi-bold font-10">${v.left}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-danger text-danger rounded bg-light-danger flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Expired</div>
                        <div class="font-weight-semi-bold font-10">${v.expired}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-dark text-dark rounded bg-light flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Missed by You</div>
                        <div class="font-weight-semi-bold font-10">${v.missedByYou}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-orange text-orange rounded bg-light-orange flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Rescheduled</div>
                        <div class="font-weight-semi-bold font-10">${v.rescheduled}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-alternate text-alternate rounded bg-light-alternate flex-column text-center  mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Completed</div>
                        <div class="font-weight-semi-bold font-10">${v.completed}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-pink text-pink rounded bg-light-pink flex-column text-center mb-1">
                        <div class="font-weight-semi-bold font-10">Classes Missed by Teacher</div>
                        <div class="font-weight-semi-bold font-10">${v.missedByTeacher}</div>
                    </span>
                </div>  
                <div class="d-flex flex-wrap" style="gap:6px">
                    <a href="javascript:void(0)" onclick="bookedCalssCotentFun(\'${v.subjectId}\',\'${moduleId}\',\'${v.studentStandardId}\',\'\', ${v.teacherName != "" ? true : false}, ${v.weekLeftClass},${v.assignedTeacherCount});" class="btn btn-primary flex-grow-1">Booked Classes</a>`;
                    if(v.subjectId != 0) {
                      html += `<a href="javascript:void(0)" onclick="bookingSlotModalNew('${v.subjectId}','${moduleId}','${v.studentStandardId}', ${v.teacherName != "" ? true : false},${v.weekLeftClass},${v.assignedTeacherCount});"  class="btn flex-grow-1 ${v.weekLeftClass < 1 ? "btn-outline-dark" : "btn-outline-primary"}" ${v.teacherName != ""? 'data-toggle="tooltip" title="" data-original-title="' +(v.weekLeftClass < 1? "You have booked all your classes for this week": v.assignedTeacherCount == 1? "Book a class with " + v.teacherName + "": "Book a class") +'"': ""}>Book a Class (${v.weekLeftClass})</a>`;
                    } else {
                      html += `<a href="javascript:void(0)" onclick="bookingSlotModalForElementry('${v.subjectId}','${moduleId}','${v.studentStandardId}', ${v.teacherName != "" ? true : false },${v.weekLeftClass},${v.assignedTeacherCount});"  class="btn flex-grow-1 ${v.weekLeftClass < 1 ? "btn-outline-dark" : "btn-outline-primary"}" ${v.teacherName != "" ? 'data-toggle="tooltip" title="" data-original-title="' + (v.weekLeftClass < 1 ? "You have booked all your classes for this week" : v.assignedTeacherCount == 1 ? "Book a class with " + v.teacherName + "" : "Book a class") + '"': ""}>Book a Class (${v.weekLeftClass})</a>`;
                    }
                html += `</div>  
              </div>  
            </div>
          </div>
      </div>  
      */''}`;
    return html;
}

function classesThumbsContentNew(data) {
  
  var classYearCount = data.classData.year[0];
  var classWeekCount = data.classData.week[0];
  var html=
    `<div class="bg-primary rounded-10 p-3 text-white text-center">
      <h5 class="font-18">Your Complimentry Classes</h5>`;
      if(classYearCount.comp>0){
        html+=
        `<div class="d-flex flex-wrap align-items-center justify-content-between">
          <span>For 42 weeks</span>
          <span class="font-22">${data.compClassYear}</span>
        </div>`;
      }
      if(classWeekCount.comp>0){
        html+=
        `<div class="d-flex flex-wrap align-items-center justify-content-between">
          <span>per week</span>
          <span class="font-22">${data.compClassPerweek}</span>
        </div>`;
      }
    html+=`</div>`;
  return html;
}

function classesThumbCotentListNew(data){
  var html=`<div class="form-row">`;
    $.each(data.subjectList, function(index, item) {
      html+=`
        <div class="mb-2 col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
          <div class="p-2 rounded-10 border border-primary bg-light-primary">
            <p class="font-weight-semi-bold mb-1 font-12">${item.name}</p>
            <div class="form-row">`;
              if(item.complimentaryTotal>0){
                html+=`<div class="mb-1 col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6">
                        <div class="px-1 rounded border border-primary bg-white text-primary d-flex justify-content-between align-items-center flex-column">
                          <p class="mb-0 font-weight-semi-bold font-11">Complimentary</p>
                          <p class="mb-0 font-weight-bold font-12">${item.complimentaryTotal}</p>
                        </div>
                      </div>`;
              }
              html+=`<div class="mb-1 ${item.complimentaryTotal>0 ? 'col-xl-3 col-lg-3' : 'col-xl-4 col-lg-4'} col-md-6 col-sm-6 col-6">
                <div class="px-1 rounded border border-primary bg-white text-primary d-flex justify-content-between align-items-center flex-column">
                  <p class="mb-0 font-weight-semi-bold font-11">Paid</p>
                  <p class="mb-0 font-weight-bold font-12">${item.extraClassTotal}</p>
                </div>
              </div>
              <div class="mb-1 ${item.complimentaryTotal>0 ? 'col-xl-3 col-lg-3' : 'col-xl-4 col-lg-4'} col-md-6 col-sm-6 col-6">
                <div class="px-1 rounded border border-primary bg-white text-primary d-flex justify-content-between align-items-center flex-column">
                  <p class="mb-0 font-weight-semi-bold font-11">Booked</p>
                  <p class="mb-0 font-weight-bold font-12">${item.booked}</p>
                </div>
              </div>
              <div class="mb-1 ${item.complimentaryTotal>0 ? 'col-xl-3 col-lg-3 col-md-6 col-sm-6 col-6' : 'col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12'}">
                <div class="px-1 rounded border border-primary bg-white text-primary d-flex justify-content-between align-items-center flex-column">
                  <p class="mb-0 font-weight-semi-bold font-11">Expired</p>
                  <p class="mb-0 font-weight-bold font-12">${item.expired}</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;
    });
    html+=`</div>`;
  return html;
}

function classesThumbsContent(data) {
  var html =
    `<div class="d-flex mb-3 rounded-pill bg-light border overflow-hidden" style="width: fit-content; position: relative; z-index: 10;">
            <button type="button" class="btn btn-sm px-3 py-1 rounded-pill text-white bg-primary border-0" id="totalClassBtn" onclick="toggleLinkTab('totalClass')">Total Classes</button>
            <button type="button" class="btn btn-sm px-3 py-1 rounded-pill text-dark bg-transparent border-0" id="totalClassForWeekBtn" onclick="toggleLinkTab('totalClassForWeek')">Total Classes for the week</button>
        </div>
        <div id="classesThumbCotentListWrapper">` +
    classesThumbCotentList(data);
  html += `</div>`;
  return html;
}

function classesThumbCotentList(data) {
  var classYearCount = [data.classData.year[0]];
  var classWeekCount = [data.classData.week[0]];
  var html = `<div class="form-row" id="totalClassSection">
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-primary border border-primary">
                <h6 class="text-primary font-14 mb-1">Total Classes</h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-primary">${classYearCount[0].comp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-primary ml-auto">${classYearCount[0].extra}</h2>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-success border border-success">
                <h6 class="text-success font-14 mb-1">Total Classes Booked</h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-success">${classYearCount[0].bookedComp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-success ml-auto">${classYearCount[0].bookedExtra}</h2>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-warning border border-warning">
                <h6 class="text-warning font-14 mb-1">Total Classes Left</h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-warning">${classYearCount[0].leftComp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-warning ml-auto">${classYearCount[0].leftExtra}</h2>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-danger border border-danger">
                <h6 class="text-danger font-14 mb-1">Total Classes Expired</h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-danger">${classYearCount[0].expiredComp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-danger ml-auto">${classYearCount[0].expiredExtra}</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="form-row d-none" id="totalClassForWeekBtnSection">
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-primary border border-primary">
                <h6 class="d-flex mb-1 align-items-center">
                    <span class="text-primary font-14">Total Classes</span>
                    <span class="font-12 ml-auto font-weight-semi-bold">`;
  var weekStartAndEndDage = getStartAndEndDayOfType(
    "week",
    new Date(),
    DISPLAY_DATE_ONLY
  );
  html +=
    weekStartAndEndDage.startDatetime + " - " + weekStartAndEndDage.endDatetime;
  html += `</span>
                </h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-primary">${classWeekCount[0].comp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-primary ml-auto">${classWeekCount[0].extra}</h2>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-success border border-success">
                <h6 class="d-flex mb-1 align-items-center">
                    <span class="text-success font-14">Total Classes Booked</span>
                    <span class="font-12 ml-auto font-weight-semi-bold">`;
  var weekStartAndEndDage = getStartAndEndDayOfType(
    "week",
    new Date(),
    DISPLAY_DATE_ONLY
  );
  html +=
    weekStartAndEndDage.startDatetime + " - " + weekStartAndEndDage.endDatetime;
  html += `</span>
                </h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-success">${classWeekCount[0].bookedComp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-success ml-auto">${classWeekCount[0].bookedExtra}</h2>
                </div>
            </div>
        </div>
        <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
            <div class="full p-2 rounded bg-light-warning border border-warning">
                <h6 class="d-flex mb-1 align-items-center">
                    <span class="text-warning font-14">Total Classes Left</span>
                    <span class="font-12 ml-auto font-weight-semi-bold">`;
  var weekStartAndEndDage = getStartAndEndDayOfType(
    "week",
    new Date(),
    DISPLAY_DATE_ONLY
  );
  html +=
    weekStartAndEndDage.startDatetime + " - " + weekStartAndEndDage.endDatetime;
  html += `</span>
                </h6>
                <h5 class="d-flex font-16">
                    <span class="font-weight-semi-bold">Complimentary</span>
                    <span class="font-weight-semi-bold ml-auto">Extra</span>
                </h5>
                <div class="d-flex">
                    <h2 class="font-weight-semi-bold font-22 text-warning">${classWeekCount[0].leftComp}</h2>
                    <h2 class="font-weight-semi-bold font-22 text-warning ml-auto">${classWeekCount[0].leftExtra}</h2>
                </div>
            </div>
        </div>`;
  // <div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
  //     <div class="full p-2 rounded bg-light-danger border border-danger">
  //         <h6 class="d-flex mb-1 align-items-center">
  //             <span class="text-danger font-14">Total Classes Expired</span>
  //             <span class="font-12 ml-auto font-weight-semi-bold">`
  //                 var weekStartAndEndDage = getStartAndEndDayOfType('week', new Date() ,DISPLAY_DATE_ONLY);
  //                 html+=weekStartAndEndDage.startDatetime +' - '+ weekStartAndEndDage.endDatetime;
  //             html+=`</span>
  //         </h6>
  //         <h5 class="d-flex font-16">
  //             <span class="font-weight-semi-bold">Complimentary</span>
  //             <span class="font-weight-semi-bold ml-auto">Extra</span>
  //         </h5>
  //         <div class="d-flex">
  //             <h2 class="font-weight-semi-bold font-22 text-danger">${classWeekCount[0].expiredComp}</h2>
  //             <h2 class="font-weight-semi-bold font-22 text-danger ml-auto">${classWeekCount[0].expiredExtra}</h2>
  //         </div>
  //     </div>
  // </div>
  html += `</div>`;
  return html;
}

function classesThumbsButtletPointContent(classPlanCount, registerType, classData) {
  
  var classWeekCount = classData.week[0];
  var html=
    `<h5 class="font-weight-semi-bold mb-0">
      <i class="fa fa-info-circle mr-1"></i>
      Class Booking Instructions
    </h5>
    <div class="mt-2">
      <p class="m-0 mb-2"><span class="d-inline-block px-2 p-1 mr-2 rounded bg-light text-dark" style="line-height:16px">1</span>Weekly Class Structure: Monday to Friday</p>
      <p class="m-0 mb-2"><span class="d-inline-block px-2 p-1 mr-2 rounded bg-light text-dark" style="line-height:16px">2</span>You can book `;
      if(classWeekCount.comp>0){
        html += classPlanCount;
      }  else {
        html += classWeekCount.extra;
      }
      if(classPlanCount>0){
        html +=` complimentary`; 
      }
      html +=` classes in a week.</p>`;
      if(classPlanCount>0){
        html +=` <p class="m-0 mb-0"><span class="d-inline-block px-2 p-1 mr-2 rounded bg-light text-dark" style="line-height:16px">3</span>Unbooked complimentary classes will expire at the end of week.</p>`;
      }
    html+=`</div>
    ${/*<div class="d-flex flex-wrap bg-light rounded-10 px-2 pt-2 pb-1 mt-3 mb-4">
        <span class="p-1 px-2 d-inline-flex align-items-center font-weight-semi-bold bg-white rounded-15 mr-3 mb-2"><label class="p-1 d-inline-block bg-primary rounded-circle m-0"></label> <p class="m-0 pl-1">Week Structure: Sunday to Saturday.</p></span>`;
        if(classWeekCount.comp>0){
          html+=`<span class="p-1 px-2 d-inline-flex align-items-center font-weight-semi-bold bg-white rounded-15 mr-3 mb-2"><label class="p-1 d-inline-block bg-primary rounded-circle m-0"></label> <p class="m-0 pl-1">Free Classes: Available only from Monday to Friday.</p></span>`;
        }
        html+=
        `<span class="p-1 px-2 d-inline-flex align-items-center font-weight-semi-bold bg-white rounded-15 mr-3 mb-2"><label class="p-1 d-inline-block bg-primary rounded-circle m-0"></label> <p class="m-0 pl-1">Booking & Counting: Classes are booked and counted on a weekly basis.</p></span>`;
        if (registerType == "ONE_TO_ONE" || registerType == "SSP") {
          html += `<span class="p-1 px-2 d-inline-flex align-items-center font-weight-semi-bold bg-white rounded-15 mr-3 mb-2"><label class="p-1 d-inline-block bg-primary rounded-circle m-0"></label> <p class="m-0 pl-1">Free Class Limit: You can book ${
            classPlanCount == "1" ? "one" : "three"
          } free ${
            classPlanCount == "1" ? "class" : "classes"
          } per week ${classPlanCount == "3" || registerType == "SSP" ? "" : "per course."}</p></span>`;
        }
        html += 
        `<span class="p-1 px-2 d-inline-flex align-items-center font-weight-semi-bold bg-white rounded-15 mr-3 mb-2"><label class="p-1 d-inline-block bg-primary rounded-circle m-0"></label> 
          <p class="m-0 pl-1">Maximum Classes: Up to ` ;
            if(classWeekCount.comp>0){
              html += classWeekCount.comp;
            }else{
              html += classWeekCount.extra;
            }
          html+=` classes can be booked per week.</p>
        </span>`;
        html+=`<span class="p-1 px-2 d-inline-flex align-items-center font-weight-semi-bold bg-white rounded-15 mr-3 mb-2"><label class="p-1 d-inline-block bg-primary rounded-circle m-0"></label> <p class="m-0 pl-1">Your classes will begin within 7 days of your system training date.</p></span>`;
      html+=`</div> */''}`;
  return html;
}


function classThumbItemContent(subjectList, moduleId) {
  var html = 
        `${/*
            <div class="row">
              <div class="col-xl-12">
                  <h5 class="font-weight-bold">Book a class for the week from 
                    <span class="text-primary">`;
                      var weekStartAndEndDage = getStartAndEndDayOfType("week",new Date(),DISPLAY_DATE_ONLY);
                      html +=weekStartAndEndDage.startDatetime + " to " + weekStartAndEndDage.endDatetime;
                    html += `</span>`;
                    if(DEPLOYMENT_MODE != "PROD") {
                      html += 
                        `<span class="d-inline-block ml-1">
                            <input type="text" name="bookingDate" id="bookingDate" class="form-control w-fit-content"/>
                        </span>`;
                    }
                    html +=`</h5>    
              </div>
          </div>
          */''}`;
        
        html+=`<div class="row" id="bookClassContentThumbList">` 
        +classThumbItemListContent(subjectList, moduleId);
  html += `</div>`;
  return html;
}

function classThumbItemListContent(subjectList, moduleId) {
  var html = ``;
  $.each(subjectList, function (i, v) {
    var subjectData = v;
    html += 
      `<div class="col-xl-12 col-lg-4 col-md-6 col-sm-6 col-12 mb-2 courseThumbWrapper">
        <div class="full p-2 rounded border cursor courseThumb ${i==0? 'bg-primary text-white border-primary':'border'}" data-subject='${JSON.stringify(subjectData)}' onclick="viewSingleCourseDetails(this, \'${moduleId}\')">
          <h6 class="text-center mb-2 font-14 font-weight-semi-bold">${v.name}</h6>
          <div class="d-flex flex-wrap align-items-center justify-content-between">
            <div class="font-12">Total: <span class=" total-num text-primary font-weight-semi-bold">${v.total}</span></div>
            <div class="font-12">Booked: <span class=" booked-num text-success font-weight-semi-bold">${v.booked}</span></div>
            <div class="font-12">Expired: <span class=" expired-num text-danger font-weight-semi-bold">${v.expired}</span></div>
          </div>
        </div>
      </div>
      ${/*
        <div class="col-xl-4 col-lg-4 col-md-6 col-sm-6 col-12 mb-4">
          <div class="d-flex flex-column h-100 border border-primary rounded-10">
            <div class="full course-img-wrapper">
                <img src="${v.img}" class="rounded-top-left-10 rounded-top-right-10 border-bottom border-primary h-sm" style="object-fit: cover;" />    
            </div>
            <div class="w-100 d-flex flex-column justify-content-between h-100 course-detials-wrapper p-2">
              <div class="full mt-1">
                  <h6 class="font-weight-semi-bold text-dark">${v.name}</h6>
              </div>
              <div class="full">
                <div class="d-flex flex-wrap course-detials justify-content-center mb-3">
                    <span class="d-inline-flex px-2 border border-primary text-primary rounded bg-light-primary flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Total</div>
                        <div class="font-weight-semi-bold font-10">${v.total}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-success text-success rounded bg-light-success flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Booked</div>
                        <div class="font-weight-semi-bold font-10">${v.booked}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-warning text-warning rounded bg-light-warning flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Left</div>
                        <div class="font-weight-semi-bold font-10">${v.left}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-danger text-danger rounded bg-light-danger flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Expired</div>
                        <div class="font-weight-semi-bold font-10">${v.expired}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-dark text-dark rounded bg-light flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Missed by You</div>
                        <div class="font-weight-semi-bold font-10">${v.missedByYou}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-orange text-orange rounded bg-light-orange flex-column text-center mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Rescheduled</div>
                        <div class="font-weight-semi-bold font-10">${v.rescheduled}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-alternate text-alternate rounded bg-light-alternate flex-column text-center  mr-1 mb-1">
                        <div class="font-weight-semi-bold font-10">Completed</div>
                        <div class="font-weight-semi-bold font-10">${v.completed}</div>
                    </span>
                    <span class="d-inline-flex px-1 border border-pink text-pink rounded bg-light-pink flex-column text-center mb-1">
                        <div class="font-weight-semi-bold font-10">Classes Missed by Teacher</div>
                        <div class="font-weight-semi-bold font-10">${v.missedByTeacher}</div>
                    </span>
                </div>  
                <div class="d-flex flex-wrap" style="gap:6px">
                    <a href="javascript:void(0)" onclick="bookedCalssCotentFun(\'${v.subjectId}\',\'${moduleId}\',\'${v.studentStandardId}\',\'\', ${v.teacherName != "" ? true : false}, ${v.weekLeftClass},${v.assignedTeacherCount});" class="btn btn-primary flex-grow-1">Booked Classes</a>`;
                    if(v.subjectId != 0) {
                      html += `<a href="javascript:void(0)" onclick="bookingSlotModalNew('${v.subjectId}','${moduleId}','${v.studentStandardId}', ${v.teacherName != "" ? true : false},${v.weekLeftClass},${v.assignedTeacherCount});"  class="btn flex-grow-1 ${v.weekLeftClass < 1 ? "btn-outline-dark" : "btn-outline-primary"}" ${v.teacherName != ""? 'data-toggle="tooltip" title="" data-original-title="' +(v.weekLeftClass < 1? "You have booked all your classes for this week": v.assignedTeacherCount == 1? "Book a class with " + v.teacherName + "": "Book a class") +'"': ""}>Book a Class (${v.weekLeftClass})</a>`;
                    } else {
                      html += `<a href="javascript:void(0)" onclick="bookingSlotModalForElementry('${v.subjectId}','${moduleId}','${v.studentStandardId}', ${v.teacherName != "" ? true : false },${v.weekLeftClass},${v.assignedTeacherCount});"  class="btn flex-grow-1 ${v.weekLeftClass < 1 ? "btn-outline-dark" : "btn-outline-primary"}" ${v.teacherName != "" ? 'data-toggle="tooltip" title="" data-original-title="' + (v.weekLeftClass < 1 ? "You have booked all your classes for this week" : v.assignedTeacherCount == 1 ? "Book a class with " + v.teacherName + "" : "Book a class") + '"': ""}>Book a Class (${v.weekLeftClass})</a>`;
                    }
                html += `</div>  
              </div>  
            </div>
          </div>
      </div>  
      */''} `;
  });
  return html;
}

function weeklyBookClassModal(
  data,
  subjectId,
  studentStandardId,
  roleModuleId,
  modalSize,
  weekLeftClassCount,
  assignedTeacherCount
) {
  var html =
    `<div class="modal fade" id="weeklyBookClassModal" tabindex="-1" data-backdrop="static" role="dialog" aria-modal="true" >
            <div class="modal-dialog h-auto modal-dialog-centered ` +
    modalSize +
    `" role="document" style="max-width:500px;width:100%; box-shadow:none !important">
                <div class="modal-content h-auto">
                    <div class="modal-header bg-primary py-2 align-items-center">
                        <h5 class="modal-title text-white">${
                          subjectId == 0
                            ? assignedTeacherCount == 1
                              ? "Book a Class with " +
                                data.studentSubjectList[0].teacherName +
                                ""
                              : "Book a Class"
                            : "Book a Class for " +
                              data.subjectName +
                              " with " +
                              data.teacherName
                        }</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">`;
  if (subjectId != "0") {
    html += `<div class="font-weight-bold py-2 d-flex align-items-center justify-content-between mb-2">
                                    <span>${data.teacherName}'s weekly class slots from ${data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[0].weeklyStartDateStandardFormat} to ${data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[0].weeklyEndDateStandardFormat}**</span>
                                </div>`;
  }
  html += `
                        <form class="full" id="bookClassForm">`;
  if (subjectId == 0) {
    html += `<div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mx-auto">
                                    <select class="form-control" id="elementrySubjectID" name="elementrySubjectID" onchange="changeElementrySubject(this, \'${roleModuleId}\', \'${studentStandardId}\',${
      data.studentSubjectList[0].teacherName != "" ? true : false
    },${weekLeftClassCount})">
                                        <option value="">Select Course*</option>`;
    $.each(data.studentSubjectList, function (i, v) {
      if (assignedTeacherCount == 1) {
        html += `<option value="${v.subjectId}">${v.subjectName}</option>`;
      } else {
        html += `<option value="${v.subjectId}">${v.subjectName} | ${v.teacherName}</option>`;
      }
    });
    html += `</select>
                                </div>`;
  }
  if (subjectId != 0) {
    html +=
      `<div class="overflow-y-auto" style="height:425px">` +
      weeklyBookClassTable(data, subjectId, studentStandardId, roleModuleId);
    html += `</div>`;
  }
  html += `</form>`;
  if (subjectId != 0) {
    html += `<div class="font-weight-bold py-2 d-flex align-items-center justify-content-between">
                                <span>**All slots are in the ${data.timeZoneName} timezone</span>
                                <span>**Duration of each class is ${data.classDuration} minutes</span>
                            </div>`;
  }
  html += `</div>
                    <div class="modal-footer ${
                      subjectId != 0
                        ? "justify-content-between"
                        : "justify-content-end"
                    }">`;
  if (subjectId != 0) {
    html += `<p class="font-dark font-weight-bold m-0 invisible">&nbsp;</p>
                            <p class="font-dark font-weight-bold m-0">
                                <span class="bg-success d-inline-block rounded-circle" style="width:8px;height:8px;"></span> Available &nbsp;
                                <span class="bg-danger d-inline-block rounded-circle" style="width:8px;height:8px;"></span> Booked &nbsp;
                                <span class="d-inline-block rounded-circle" style="width:8px;height:8px;background:#d6d3d3"></span> Not Available
                            </p>`;
  }
  html += `<div calss="text-right">`;
  if (subjectId != 0) {
    html += `<a href="javascript:void(0)" id="bookClassBtn" class="btn btn-primary disabled" onclick="showBookClassConfirmationModal(\'${roleModuleId}\')">Next</a>`;
  } else {
    html += `<a href="javascript:void(0)" id="viewElementrySlot" class="btn btn-primary disabled">View Available Slots</a>`;
  }
  html += `</div>
                    </div>`;
  html += `</div>
            </div>
        </div>`;

  return html;
}

function weeklyBookClassTable(
  data,
  subjectId,
  studentStandardId,
  roleModuleId
) {
  var html =
    `<table class="table font-12 border-0" id="weeklyClassSlotTable" style="min-width:1100px">` +
    weeklyBookClassTableHead(data) +
    weeklyBookClassTableBody(data, subjectId, studentStandardId, roleModuleId);
  html += `</table>`;
  return html;
}

function weeklyBookClassTableHead(data) {
  var i = 0;
  var listSize =
    data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList.length;
  var html = `<thead>
            <tr>`;
  while (i <= listSize - 1) {
    $.each(
      data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[i]
        .teacherAllDataInOneList,
      function (index, value) {
        var date = value.displayStartDate.split(",");
        date = date[0].split(" ");
        var dateText = date[1] + " " + date[2];
        var dayName = date[0];
        html +=
          '<td class="px-1 py-2 border-0 position-sticky" style="top:0;left:0;z-index:1; background:#f3f3f3">' +
          '<div class="font-weight-bold text-center font-12" style="line-height:1">' +
          dateText +
          "</div>" +
          '<div class="text-center font-12 text-uppercase mt-1" style="line-height:1">' +
          dayName +
          "</div>" +
          "</td>";
      }
    );
    i++;
  }
  html += `</tr>
        </thead>`;
  return html;
}
function weeklyBookClassTableBody(
  data,
  subjectId,
  studentStandardId,
  roleModuleId
) {
  var k = 0;
  var listSize =
    data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList.length;
  var html = `<tbody>
            <tr>`;
  while (k <= listSize - 1) {
    $.each(
      data.teacherWeeklyTimeCurrLiveClass.teacherAssignTimeWeekList[k]
        .teacherAllDataInOneList,
      function (index, value) {
        html += '<td class="border-0 vertical-align-top">';
        var isPastDate = checkdateIsPastOrNot(value.displayStartDateWithoutDay);
        if (value.dayWiseAllData.length > 0) {
          var skippedDateExists = data.skipDateList.includes(
            value.dayWiseAllData[0].bookedDate
          );
          if (!skippedDateExists) {
            $.each(value.dayWiseAllData, function (i, v) {
              if (v.status == "Booked") {
                var isPastDateAndTime = checkDateAndTimeIsPastOrNot(
                  v.bookedStartDate,
                  data.timeZoneName,
                  data.showSlotAfter
                );
                if (isPastDateAndTime) {
                  html += `<div class="d-flex align-items-center justify-content-center ">
                                                            <div class="border rounded-5 px-2 py-1 mb-1 text-center" style="width:116px; background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important">${v.displayStartTime}</div>
                                                        </div>`;
                } else {
                  html +=
                    `<div class="d-flex align-items-center justify-content-center ">
                                                            <div class="border rounded-5 px-2 py-1 mb-1 text-center" style="width:116px;` +
                    (isPastDate
                      ? "background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important"
                      : "background:#ffd6d6;color:#ff0000;border-color:#ff0000 !important") +
                    `">${v.displayStartTime}</div>
                                                        </div>`;
                }
              } else if (v.status == "Available") {
                html += `<div class="d-flex align-items-center justify-content-center">`;
                var isPastDateAndTime = checkDateAndTimeIsPastOrNot(
                  v.bookedStartDate,
                  data.timeZoneName,
                  data.showSlotAfter
                );
                if (isPastDate || isPastDateAndTime) {
                  html += `<div class="border rounded-5 px-2 py-1 mb-1 text-center" style="width:116px; background:#f5f5f5;color:#c0c0c0;border-color:#c0c0c0 !important">${v.displayStartTime}</div>`;
                } else {
                  html +=
                    `<label for="slot_id_${k}${index}${i}" class="custom-radio-label-tag border rounded-5 pr-0 pl-2 py-1 mb-1 text-center text-dark font-weight-bold d-inline-flex align-items-center justify-content-center" style="width:116px; background:#d7f1d6;color:#06a700;border-color:#06a700 !important;font-weight:bold">
                                                        <span class="d-inline-block">${v.displayStartTime}</span>
                                                        <div class="custom-radio custom-control ml-2">
                                                            <input type="radio" id="slot_id_${k}${index}${i}" name="slot" class="custom-control-input input-bg-success"` +
                    (isPastDate ? "disabled" : "") +
                    ` data-suject-id="${subjectId}" data-studentStandard-id="${studentStandardId}" data-teacher-id="${data.teacherUserId}" data-meeting-start-date-time="${v.bookedStartDate}"  data-class-start-time="${v.displayStartTime}"  data-class-end-time="${v.displayEndTime}" data-class-date="${value.displayStartDateWithoutDay}" data-subject-name="${data.subjectName}" data-teacher-name="${data.teacherName}" data-duration="${data.classDuration}">
                                                            <div class="custom-control-label input-bg-success">&nbsp;</div>
                                                        </div>
                                                    </label>`;
                }
                html += `</div>`;
              }
            });
          } else {
            html +=
              '<div class="rounded-5 px-2 py-1 mb-1 mx-auto text-center" style="width:129px; color:#c0c0c0">----</div>';
          }
        }
        if (value.dayWiseAllData.length < 1) {
          html +=
            '<div class="rounded-5 px-2 py-1 mb-1 mx-auto text-center" style="width:129px; color:#c0c0c0">----</div>';
        }
        html += "</td>";
      }
    );
    k++;
  }
  html += `</tr>
        </tbody>`;
  return html;
}

function weeklyBookClassConfirmationModal(
  classStartTime,
  classEndTime,
  classDate,
  courseName,
  teacherName,
  roleModuleId
) {
  var html =
    `<div class="modal fade" id="weeklyBookClassConfirmationModal" tabindex="-1" role="dialog" aria-modal="true" >
            <div class="modal-dialog h-auto modal-dialog-centered modal-lg" role="document" style="box-shadow:none !important; max-width:500px; width:100%;">
                <div class="modal-content h-auto">
                    <div class="modal-header bg-primary py-2 align-items-center">
                        <h6 class="modal-title text-white">Book a Class for ${courseName}</h6>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body mx-auto">
                        <div class="d-flex flex-wrap my-1">
                            <span class="font-weight-semi-bold font-size-md mr-3 text-dark" style="min-width:100px">Date & time:</span>
                            <span class="font-12">${classStartTime}` +
                              " - " +
                            `${classEndTime}</span>
                        </div>
                        <div class="d-flex flex-wrap my-1">
                            <span class="font-weight-semi-bold font-size-md mr-3 text-dark" style="min-width:100px">Course Name:</span>
                            <span class="font-12">${courseName}</span>
                        </div>
                        <div class="d-flex flex-wrap my-1">
                            <span class="font-weight-semi-bold font-size-md mr-3 text-dark" style="min-width:100px">Teacher Name:</span>
                            <span class="font-12">${teacherName}</span>
                        </div>
                    </div>
                    <div class="modal-footer text-right">
                        <a href="javascript:void(0)" class="btn btn-danger" onclick="backToweeklyBookClassModal()">Back</a>
                        <a href="javascript:void(0)" class="btn btn-success" onclick="callForStudentBookClassSlots(\'bookClassForm\', 'STUDENT', \'${roleModuleId}\')">Confirm</a>
                    </div>
                </div>
            </div>
        </div>`;
  return html;
}

//  BOOKED CLASSESS PAGE CONTENT START HERE //

function renderBookedClassContent(
  data,
  flag,
  teacherAssignFlag,
  weekLeftClassCount,
  assignedTeacherCount
) {
  var moduleId = $("#bookClassContent").attr("data-moduleId");
  $("#bookClassContent").html(
    //pageTitleContent(data, moduleId, true) +
      getBookedClassCardContent(
        data,
        moduleId,
        teacherAssignFlag,
        weekLeftClassCount,
        assignedTeacherCount
      )
  );
  $("#bookClassTable").dataTable({
    scrollX: true,
  });
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let today = new Date();
  let formattedDate = `${
    monthNames[today.getMonth()]
  } ${today.getDate()}, ${today.getFullYear()}`;
  //var sssDate = formattedDate.split(" ")[1]+' '+formattedDate.split(" ")[2]+', '+formattedDate.split(" ")[3];
  //console.log(sssDate);
  var startDate = formattedDate;
  var endDate = startDate;
  $("#bookClassOneToOne #startDate").val(startDate);
  $("#bookClassOneToOne #endDate").val(endDate);

  $("#selectedType").on("change", function () {
    if ($("#bookClassOneToOne #selectedType").val() == "today") {
      let today = new Date();
      let formattedDate = `${
        monthNames[today.getMonth()]
      } ${today.getDate()}, ${today.getFullYear()}`;
      startDate = formattedDate;
      endDate = startDate;
      $("#bookClassOneToOne #startDate").val(startDate);
      $("#bookClassOneToOne #endDate").val(endDate);
    } else if ($("#bookClassOneToOne #selectedType").val() == "yesterday") {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let formattedDate = `${
        monthNames[yesterday.getMonth()]
      } ${yesterday.getDate()}, ${yesterday.getFullYear()}`;
      startDate = formattedDate;
      endDate = startDate;
      $("#bookClassOneToOne #startDate").val(startDate);
      $("#bookClassOneToOne #endDate").val(endDate);
    } else if ($("#bookClassOneToOne #selectedType").val() == "week") {
      let today = new Date();
      let firstDay = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
      let lastDay = new Date(today.setDate(today.getDate() + 6)); // End of the week (Saturday)
      let startDate = `${
        monthNames[firstDay.getMonth()]
      } ${firstDay.getDate()}, ${firstDay.getFullYear()}`;
      let endDate = `${
        monthNames[lastDay.getMonth()]
      } ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
      $("#bookClassOneToOne #startDate").val(startDate);
      $("#bookClassOneToOne #endDate").val(endDate);
    } else if ($("#bookClassOneToOne #selectedType").val() == "month") {
      let today = new Date();
      let firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      let lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      let startDate = `${
        monthNames[firstDay.getMonth()]
      } ${firstDay.getDate()}, ${firstDay.getFullYear()}`;
      let endDate = `${
        monthNames[lastDay.getMonth()]
      } ${lastDay.getDate()}, ${lastDay.getFullYear()}`;
      $("#bookClassOneToOne #startDate").val(startDate);
      $("#bookClassOneToOne #endDate").val(endDate);
    }
  });
}
function getBookedClassCardContent(
  data,
  moduleId,
  teacherAssignFlag,
  weekLeftClassCount,
  assignedTeacherCount
) {
  html =
    `<div class="main-card mb-3">` +
    bookClassFilterFormContent(
      data,
      moduleId,
      teacherAssignFlag,
      weekLeftClassCount,
      assignedTeacherCount
    );
  html +=
    `<div class="full" id="bookedClassesWrapper">` +
    bookedClassesThumbsContent(data.subjectCountDatials) +
    bookedClassesTableContent(data.meetingDetails);
  html += `</div>
        </div>`;
  return html;
}

function bookClassFilterFormContent(
  data,
  moduleId,
  teacherAssignFlag,
  weekLeftClassCount,
  assignedTeacherCount
) {
  var subjectID = data.subjectCountDatials.subjectId;
  var studentStandardId = data.subjectCountDatials.studentStandardId;
  var html = `<div class="full card">
            <div class="card-body">
                <form class="full" id="bookClassOneToOne">
                    <div class="row">
                        <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-12 mb-lg-0 mb-2">
                            <select class="form-control" name="selectedType" id="selectedType" onchange="selectTypeChange(this)">
                                <option value="today">Today</option>    
                                <option value="yesterday">Yesterday</option>    
                                <option value="week">Week</option>    
                                <option value="month">Month</option>    
                                <option value="custom">Custom</option>    
                            </select>    
                        </div>
                        <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-12 mb-lg-0 mb-2 datepickerStartWrapper">
                            <input class="form-control datepicker" name="startDate" value="" id="startDate" placeholder="Start Date" disabled readonly onkeydown="return false"/>    
                        </div> 
                        <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-12 mb-lg-0 mb-2 datepickerEndWrapper">
                            <input class="form-control datepicker" name="endDate" value="Mar 25, 2025" id="endDate" placeholder="End Date" disabled readonly onkeydown="return false"/>    
                        </div>
                        <div class="col-xl-2 col-lg-2 col-md-4 col-sm-4 col-12 mb-lg-0 mb-2">
                            <select class="form-control" name="classStatus" id="classStatus">
                                <option value="">Select Status</option>
                                 <option value="Booked">Booked</option>
                                <option value="Completed">Completed</option>
                                <option value="Reschedule Session">Reschedule Session</option>
                                <option value="Missed by Student">Missed by you</option>
                            </select>
                        </div> 
                        <div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 text-lg-left text-right">
                            <a href="javascript:void(0)" class="btn btn-danger btn-lg float-none float-lg-left mr-1 mb-1" onclick="bookedCalssCotentFormReset(\'bookClassOneToOne\')">Reset</a>    
                            <a href="javascript:void(0)" class="btn btn-success btn-lg float-none float-lg-left mb-1" onclick="bookedCalssCotentFun('${subjectID}','${moduleId}','${studentStandardId}','filter','','')">Search</a>`;
  if (subjectID != 0) {
    html += `<a href="javascript:void(0)" class="btn btn-lg float-none float-lg-right mb-1 ml-1 filterBookAClassBtn ${
      weekLeftClassCount > 0 ? "btn-primary" : "btn-dark"
    }" onclick="bookingSlotModalNew('${subjectID}','${moduleId}','${studentStandardId}',${teacherAssignFlag},${weekLeftClassCount},${assignedTeacherCount});">Book a Class (${weekLeftClassCount})</a>`;
  } else {
    html += `<a href="javascript:void(0)" class="btn btn-primary btn-lg float-none float-lg-right mb-1 ml-1 filterBookAClassBtn ${
      weekLeftClassCount > 0 ? "btn-primary" : "btn-dark"
    }" onclick="bookingSlotModalForElementry('${subjectID}','${moduleId}','${studentStandardId}',${teacherAssignFlag},${weekLeftClassCount},${assignedTeacherCount});">Book a Class (${weekLeftClassCount})</a>`;
  }
  html += `</div>   

                    </div>    
                </form>    
            </div>    
        </div>`;
  return html;
}
function bookedClassesThumbsContent(data) {
  var html = `<div class="d-flex flex-wrap mt-3">
            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-primary border border-primary rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-primary d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-primary pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-primary font-12">Classes</p>  
                        </div>  
                        <div class="font-size-lg text-primary font-weight-bold px-2">${data.total}</div>  
                    </div>
                </div>
            </div>
            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-success border border-success rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-success pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-success font-12">Classes Booked</p>  
                        </div>  
                        <div class="font-size-lg text-success font-weight-bold px-2">${data.booked}</div>  
                    </div>
                </div>
            </div>
            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-warning border border-warning rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-warning d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-warning pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-warning font-12">Classes Left</p>  
                        </div>  
                        <div class="font-size-lg text-warning font-weight-bold px-2">${data.left}</div>  
                    </div>
                </div>
            </div>

            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-danger border border-danger rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-danger d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-danger pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-danger font-12">Classes Expired</p>  
                        </div>  
                        <div class="font-size-lg text-danger font-weight-bold px-2">${data.expired}</div>  
                    </div>
                </div>
            </div>

            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light border border-dark rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-light d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-dark pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-dark font-12">Classes Missed by You</p>  
                        </div>  
                        <div class="font-size-lg text-dark font-weight-bold px-2">${data.missedByYou}</div>  
                    </div>
                </div>
            </div>

            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-orange border border-orange rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-orange d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-orange pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-orange font-12">Classes Rescheduled</p>  
                        </div>  
                        <div class="font-size-lg text-orange font-weight-bold px-2">${data.rescheduled}</div>  
                    </div>
                </div>
            </div>

            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-alternate border border-alternate rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-alternate pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-dark">Total number of</p>
                            <p class="m-0 text-alternate font-12">Classes Completed</p>  
                        </div>  
                        <div class="font-size-lg text-alternate font-weight-bold px-2">${data.completed}</div>  
                    </div>
                </div>
            </div>
            <div class="d-inline-flex" style="width:fit-content">
                <div class="full p-1 bg-light-pink border border-pink rounded-10 position-relative mr-2 mr-sm-2 mb-2 shadow-sm">
                    <span class="line-left bg-pink d-inline-block position-absolute rounded-10"></span>
                    <div class="d-flex align-items-center">
                        <div class="pr-2 border-right border-pink pl-2" style="border-right-width:2px !important">
                            <p class="m-0 font-weight-bold text-pink">Total number of</p>
                            <p class="m-0 text-pink font-12">Classes Missed by Teacher</p>  
                        </div>  
                        <div class="font-size-lg text-pink font-weight-bold px-2">${data.missedByTeacher}</div>  
                    </div>
                </div>
            </div>
        </div>`;
  return html;
}
function bookedClassesTableContent(data) {
  var html =
    `<div class="full card mt-2">
            <div class="card-body full p-3">
                <div class="table-responsive p-1">
                    <table class="table table-bordered font-12 border-radius-table" id="bookClassTable" style="min-width:1000px;width:100%">` +
    bookedClassesTableHeadContent() +
    bookedClassesTableBodyContent(data);
  html += `</table>
                </div>
            </div>
        </div>`;
  return html;
}
function bookedClassesTableHeadContent() {
  var tableTitle = [
    "S. No.",
    "Class Timing | Time zone",
    "Course Name",
    "Teacher Name",
    "Booked Date",
    "Class Type",
    "Class Status",
  ];
  var html = `<thead>
            <tr>`;
  $.each(tableTitle, function (i, v) {
    html += `<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle ${
      i == 0 ? "rounded-top-left-10" : ""
    }  ${i + 1 == tableTitle.length ? "rounded-top-right-10" : ""}">${v}</th>`;
  });
  html += `</tr>
        </thead>`;
  return html;
}
function bookedClassesTableBodyContent(data) {
  var html = `<tbody>`;
  if (data.length > 0) {
    $.each(data, function (i, v) {
      html += `<tr>
                        <td ${
                          i + 1 == data.length
                            ? 'class="rounded-bottom-left-10"'
                            : ""
                        }>${i + 1}</td>    
                        <td>${v.meetingJoinDate} | ${v.startTime} - ${
        v.endTime
      } | ${v.timezone}</td>    
                        <td>${v.subjectName}</td>   
                        <td>${v.name}</td>    
                        <td>${v.bookedDate}</td>
                        <td>${v.classTypeExtraOrComp}</td>    
                        <td ${
                          i + 1 == data.length
                            ? 'class="rounded-bottom-right-10"'
                            : ""
                        }>`;
      if (v.meetingResult == undefined || v.meetingResult == "") {
        html += `<span class="d-inline-block font-weight-bold">N/A</span>`;
      } else if (v.meetingResult == "Reschedule Session") {
        html += `<span class="d-inline-block font-weight-bold bg-orange text-white px-2 rounded">Rescheduled</span>`;
      } else if (
        v.meetingResult == "Missed by Student" ||
        v.meetingResult == "Missed by Teacher"
      ) {
        html += `<span class="d-inline-block font-weight-bold ${
          v.meetingResult == "Missed by Teacher" ? "bg-pink" : "bg-dark"
        } text-white px-2 rounded">${v.meetingResult}</span>`;
      } else if (v.meetingResult == "Completed") {
        html += `<span class="d-inline-block font-weight-bold bg-alternate text-white px-2 rounded">Completed</span>`;
      } else if (v.meetingResult == "Cancelled") {
        html += `<span class="d-inline-block font-weight-bold bg-dark text-white px-2 rounded">${v.meetingResult}</span>`;
      } else {
        html += `<span class="d-inline-block font-weight-bold">N/A</span>`;
      }
      html += `</td>    
                    </tr>`;
    });
  }
  html += `</tbody>`;
  return html;
}

//  BOOKED CLASSESS PAGE CONTENT END HERE //

function renderBuyAClassErrorContent(data) {
  var html = `<div class="main-card mb-3 card">
            <div class="card-body">`;
  if (data.statusCode == "AY_NOT_STARTED") {
    html += `<h4 class="text-center text-primary font-26 font-weight-bold">${data.message}</h4>`;
  } else {
    html += `
                    <h4 class="text-center text-primary font-weight-semi-bold font-26 mt-3">
                        Oops!
                        <br>
                        Looks like you haven't purchased a class yet.
                        <br>
                        Navigate to the <span class="font-weight-bold">'Buy Extra Classes'</span> menu to get started.
                        </h4>
                    <div class="full mt-2 mb-2 p-2 text-center">
                        <a class="btn btn-lg btn-primary " href="javascript:void(0)" onclick="return callDashboardPageSchool(89,'student-addon');"> Browse Plans </a>
                    </div>`;
  }
  html += `</div>
        </div>`;
  return html;
}
