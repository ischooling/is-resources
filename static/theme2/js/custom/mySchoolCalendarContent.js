function renderMySchoolCalendarPage(title){
    $('#dashboardContentInHTML').html(pageTitleContent(title)+getMySchoolCalendarCard(title));
}



function pageTitleContent(title) {
  var html = 
        `<div class="app-page-title">
            <div class="page-title-wrapper">
                <div class="page-title-heading">
                    <div class="page-title-icon"><img src="${PATH_FOLDER_IMAGE2}/Icon/sidebar/View_Booked_Class.webp" style="max-width:90px; width: 90%; margin-right: auto; display: flex;"></i></div>
                    <div>${title}</div>
                </div>
            </div>
        </div>`;
  return html;
}

function getMySchoolCalendarCard(title){
    
    var html=
        `<div class="main-card mb-3 card col-lg-6 col-sm-8 col-12 mx-auto ronded-10">
            <div class="card-body">
                <div class="text-center">
                    <img src="${PATH_FOLDER_IMAGE2}empty_my_school_calendar.png" alt="check-gif" class="" style="max-width: 450px;width:100%">
                </div>
                <div class="d-flex justify-content-center align-items-center flex-column pb-3 text-center">
                   <h4 class="mb-2 font-weight-bold text-primary">There is no data</h4>
                   <p class="mb-1 text-black-60">It looks like there are no calendar events to display yet. <br/>Check back later or stay informed about upcoming updates.</p>
                   <p class="mb-1 text-black-60"></p>
                </div>
            </div>
        </div>`;
    return html;
}
