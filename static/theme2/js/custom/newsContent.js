function getNewsContent(data, userId, index) {
//   console.log(data);
  var html =
    `<div class="full">
        <div class="card box-shadow-none rounded-15">${dashboardNewsHeader(data, userId, index) + dashboardNewsContent(data)}</div>
    </div>`;
  return html;
}
function dashboardNewsHeader(data, userId, index) {
  var html = `<div class="card-header bg-white text-dark justify-content-between card-header-primary d-flex rounded-top-left-15 rounded-top-right-15 border-0 h-auto pt-2">
            <h6 class="pull-left m-0 font-size-md text-capitalize w-100 d-flex flex-wrap align-items-center font-weight-bold" id="newCardTitle">
                <img src="${PATH_FOLDER_IMAGE2}news_Icon.png"  class="mr-1" width="25px" /><span class="ui-theme-settings-opacity-0">News</span>
            </h6>
        </div>`;
  return html;
}

function dashboardNewsContent(data) {
  var IDs = [];
  var html = `<div class="card-body announcement-card-scroll pb-0 pt-2 ui-theme-settings-opacity-0">
            <div class="full">
                <ul class="news-list">`;
                    if (data.list != null && data.list.length > 0) {
                        $.each(data.list, function (k, schoolNews) {
                        IDs.push(schoolNews.id);
                        html += `<li class="col-md-12 col-sm-12 col-12 py-2 px-0 border-bottom">
                                    <div class="w-100">
                                        <div class="d-flex w-100 cursor flex-sm-nowrap flex-wrap gap-10" onclick="showNewsDataById(${schoolNews.id});">
                                            <div class="d-inline-flex mr-2">
                                                <img src="${schoolNews.image}" class="rounded-10" width="113px" height="113px" style="object-fit:cover"/>
                                            </div>
                                            <div class="d-inline-flex align-items-start text-left">
                                                <div>
                                                    <h6 class="font-14 pl-0 text-dark font-weight-bold">${schoolNews.title}</h6>
                                                    <div class="font-12 text-gray mt-1">${convertDatetimeWithFormat(schoolNews.publishDate, BASE_TIMEZONE, USER_TIMEZONE, DISPLAY_DATE_ONLY)}</div>
                                                    <div>
                                                        <a href="javascript:void(0)" class="font-14 font-weight-semi-bold text-primary">
                                                            Learn More<i class="fa fa-arrow-right ml-2"></i>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>`;
                        });
                    } else {
                        html += `<li class="col-12 text-center">No News</li>`;
                    }
                html += `</ul>
            </div>
        </div>
        <div class="card-footer ui-theme-settings-opacity-0">
            <div class="w-100">
                <button class="btn btn-primary w-100" onclick="showNewsDataByIds('${IDs.join(",")}');">View All News</button>
            </div>
        </div>`;
  return html;
}

function newsModalContent(data) {
  var timeAgoText = timeAgo(data.publishDate);
  var html = `<div class="modal fade" id="newsDetailsModal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content rounded-15">
                    <div class="modal-body pt-0">
                        <div class="full pt-1">
                            <button type="button" class="close text-dark pull-right" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="w-100 news-img-wrapper">
                            <img src="${data.image}" class="w-100 rounded-10" style="border:1px solid #d7d3d3;object-fit:contain"/>
                        </div>
                        <div class="w-100 my-2">
                            <span class="text-gray font-weight-semi-bold mr-3">
                                <i class="fa fa-calendar mr-1 text-primary"></i>
                                ${convertDatetimeWithFormat(data.publishDate, BASE_TIMEZONE, USER_TIMEZONE, DISPLAY_DATE_ONLY)}
                            </span>
                            <span class="text-gray font-weight-semi-bold">
                                <i class="fa fa-clock mr-1 text-primary"></i>
                                ${timeAgoText}
                            </span>
                        </div>
                        <div class="full">
                            <h4 class="font-24 font-weight-bold text-dark mb-2">${data.title}</h4>
                            <p class="text-gray">${data.content}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="d-inline-flex">
                            <span class="d-inline-block">
                                <img src="${data.sourceLogo}" width="40px" height="40px" class="rounded-circle" style="border:1px solid #d7d3d3;object-fit:contain"/>
                            </span>
                            <div class="ml-2">
                                <span class="d-inline-block text-gray">News Source</span>
                                <h5 class="text-dark font-16 font-weight-bold">${data.sourceName}</h5>
                            </div>
                        </div>
                        <div class="d-inline-flex ml-auto">
                            <a href="${data.sourceUrl}" target="_blank" class="font-14 font-weight-semi-bold text-primary">
                                Read Full Article<i class="fa fa-arrow-right ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>	
            </div>		
        </div>`;
  return html;
}

function newsAllListWithDetailsModalCotent() {
  var html = `<div class="modal right-slide-modal fade" id="newsAllListWithDetailsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Latest News</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times</span>
                        </button>
                    </div>
                    <div class="modal-body overflow-y-auto" id="newsAllListWithDetailsModalBody"></div>
                    <div class="modal-footer justify-content-between" id="newsAllListWithDetailsModalFooter">
                        <button class="btn btn-outline-primary" id="getNextNewsBtn" onclick="getNewsListData('prev')">Previous</button>
                        <button class="btn btn-primary" id="getPrevNewsBtn" onclick="getNewsListData('next')">Next</button>
                    </div>
                </div>
            </div>
        </div>`;
  return html;
}

function getListNewsDetails(resData) {
  var html = ``;
  $.each(resData, function (index, data) {
    var timeAgoText = timeAgo(data.publishDate);
    html += `<div class="card mb-2">
            <div class="card-body pt-0">
                <div class="d-flex flex-lg-nowrap flex-wrap w-100 align-items-center">
                    <h4 class="font-24 font-weight-bold text-dark mb-2">${data.title}</h4>
                    <div class="ml-auto text-nowrap">
                        <i class="pe-7s-map-marker"></i>&nbsp;${data.country}
                    </div>
                </div>
                <div class="w-100 news-img-wrapper">
                    <img src="${data.image}" class="w-100 rounded-10" style="border:1px solid #d7d3d3;object-fit:contain"/>
                </div>
                <div class="d-flex flex-wrap w-100 my-2">
                    <div class="d-inline-flex flex-wrap">
                        <span class="text-gray font-weight-semi-bold mr-3">
                            <i class="fa fa-calendar mr-1 text-primary"></i>
                            ${convertDatetimeWithFormat(data.publishDate, BASE_TIMEZONE, USER_TIMEZONE, DISPLAY_DATE_ONLY)}
                        </span>
                        <span class="text-gray font-weight-semi-bold">
                            <i class="fa fa-clock mr-1 text-primary"></i>
                            ${timeAgoText}
                        </span>
                    </div>
                    <div class="d-inline-flex ml-auto">
                        <p class="m-0"><b class="text-dark">Read Time&nbsp;</b>${data.readTime} min</p>
                    </div>
                </div>
                <div class="full">
                    <p class="text-gray">${data.content}</p>
                </div>
            </div>
            <div class="card-footer flex-wrap gap-10">
                <div class="d-inline-flex">
                    <span class="d-inline-block">
                        <img src="${data.sourceLogo}" width="40px" height="40px" class="rounded-circle" style="border:1px solid #d7d3d3;object-fit:contain"/>
                    </span>
                    <div class="ml-2">
                        <span class="d-inline-block text-gray">News Source</span>
                        <h5 class="text-dark font-16 font-weight-bold">${data.sourceName}</h5>
                    </div>
                </div>
                <div class="d-inline-flex ml-auto">
                    <a href="${data.sourceUrl}" target="_blank" class="font-14 font-weight-semi-bold text-primary">
                        Read Full Article<i class="fa fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>`;
  });
  return html;
}
