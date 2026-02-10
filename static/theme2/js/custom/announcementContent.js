function getAnnouncementContent(data, userId, index){
    var html=
        `<div class="full">
            <div class="card box-shadow-none rounded-15">`
                +dashboardAnnouncementHeader(data, userId, index)
                +dashboardAnnouncementContent(data)
            html+=`</div>
        </div>`;
    return html;
}
function dashboardAnnouncementHeader(data, userId, index){
    var html=
        `<div class="card-header bg-white text-dark justify-content-between card-header-primary d-flex rounded-top-left-15 rounded-top-right-15 border-0 h-auto pt-2">
            <h6 id="announcementHeaderContent" class="pull-left m-0 font-size-md text-capitalize w-100 d-flex flex-wrap align-items-center font-weight-bold">`;
                if(data.newAnnouncementCount!=null && data.newAnnouncementCount>0){
                    //html+=data.newAnnouncementCount+' New Announcement(s)';
                    html+=`
                       <img src="${PATH_FOLDER_IMAGE2}announcements_Icon.png"  class="mr-1" width="30px" /> <span class="ui-theme-settings-opacity-0">Announcement(<span class="text-lowercase ">s</span>)</span>
                       <span id="newAnnouncementCount" class="text-danger font-weight-semi-bold ml-auto">${data.newAnnouncementCount}</span><span class="text-danger font-weight-semi-bold">&nbsp;New</span>
                       `
                }else{
                    html+=`<img src="${PATH_FOLDER_IMAGE2}announcements_Icon.png"  class="mr-1" width="30px" /><span class="ui-theme-settings-opacity-0">Announcement</span>`;
                }
            html+=`</h6>
            ${/*
                <div>
                    <button class="btn btn-white announcement-nav-prev" onclick="getMoreAnnoucement('prev', ${userId})" title="Prev Announcement" `+(index==0?'disabled':'')+`>
                        <i class="fa fa-angle-left"></i>
                    </button>
                    <button class="btn btn-white announcement-nav-next" onclick="getMoreAnnoucement('next', ${userId})" title="Next Announcement">
                        <i class="fa fa-angle-right"></i>
                    </button>
                </div>    
            */''}
        </div>`;
    return html;
}

function dashboardAnnouncementContent(data){
    var html=
        `<div class="card-body announcement-card-scroll pb-0 pt-2 ui-theme-settings-opacity-0">
            <div class="announcement-wrapper">
                <ul id="announcementDataContent">`;
                    if(data.announcements!=null && data.announcements.length>0){
                        $.each(data.announcements, function(k, schoolAnnounce) {
                            var timeAgoText = timeAgo(schoolAnnounce.createdDate);
                            html+=
                            `<li class="col-md-12 col-sm-12 col-12 py-1 px-0 border-bottom">
                                <div class="announcement-anchor" onclick="showAnnounceDataById(${schoolAnnounce.announcementId},58);">
                                    <div class="announcement-list align-items-start">
                                        ${/*
                                            <span class="annoucement-icon">
                                                <i class="fa fa-bullhorn"></i>`;
                                                if(schoolAnnounce.replyStatus == 'N'){
                                                    html+=`<label class="new-label accepted-announcement${schoolAnnounce.announcementId}">New</label>`;
                                                }
                                                html+=
                                            `</span>    
                                        */''}
                                        <div>
                                            <h6 class="announcement-title font-14 pl-0">
                                                <span>${schoolAnnounce.announceTitle}`
                                                    if(schoolAnnounce.replyStatus == 'N' && schoolAnnounce.latestStatus == 'Y'){
                                                        html+=
                                                        `<label class="m-0 announcement-ribbon accepted-announcement${schoolAnnounce.announcementId}">New</label>
                                                        <i class="fa fa-star announcement-ribbon-star accepted-announcement${schoolAnnounce.announcementId}"></i>`;
                                                    }
                                                    html+=
                                                `</span>
                                            </h6>
                                            <div class="font-10 text-gray">${timeAgoText}</div>
                                            <div>
                                                <a href="javascript:void(0)" class="font-14 font-weight-semi-bold text-primary">
                                                    Learn More<i class="fa fa-arrow-right ml-2"></i>
                                                </a>
                                            </div>
                                        </div>`;
                                        if(schoolAnnounce.replyStatus == 'N'){
                                            html+=`<label class="new-label mt-1 accepted-announcement${schoolAnnounce.announcementId}">New</label>`;
                                        }
                                    html+=`</div>
                                </div>
                            </li>`;
                        });
                    }else{
                        html+=`<li class="col-12 text-center">No new announcements</li>`;
                    }
                html+=`</ul>
            </div>
        </div>`;
    return html;
}

function announcementModalContent(data){
    var  html=
        `<div class="modal fade" id="announcementbyIdData" tabindex="-1" role="dialog" aria-labelledby="followupform">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">`;
                    html+=
                    `<div class="modal-header bg-primary-gradient text-white pt-2 pb-2 flex-wrap">
                        <h5 class="modal-title font-weight-bold">
                            <img src="${PATH_FOLDER_IMAGE2}announcements_Icon.png" class="mr-2" width="35px"/>
                            ${data.announcement.announceTitle}
                        </h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <div class="border  rounded-10 mt-3 p-2 w-100" style="background-color: rgba(255, 255, 255, 0.1);border-color:rgba(255, 255, 255, 0.3) !important">
                            <p class="m-0">Start Date</p>
                            <span class="text-white font-weight-semi-bold">
                                <i class="fa fa-calendar mr-2"></i>
                                ${convertDatetimeWithFormat(data.announcement.createdDate,BASE_TIMEZONE, USER_TIMEZONE,DISPLAY_DATE_ONLY)}
                            </span>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="full">
                            <div>
                                ${data.announcement.teacherRemark}
                            </div>
                            <div class="row">`;
                                if(data.announcement.fileType !='' || data.announcement.attachment != ''){
                                    html+=
                                    `<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">`
                                        if(data.announcement.fileType =='' || data.announcement.attachment == ''){
                                            html+=`NA`;
                                        }else if(data.announcement.fileType == 'IMAGE'){
                                            html+=
                                            `<a href="javascript:void(0)" onclick="showDocument('${FILE_UPLOAD_PATH + data.announcement.attachment}');" class="btn font-18 w-100 btn-primary"><i class="fa fa-eye mr-2"></i>View Attachment</a>
                                            ${/*
                                            <%-- <img  src="${announcement.attachment}" alt="" onclick="showDocument('${announcement.attachment}');" title=""  style="width: 50px; height: 50px; max-width: 100%;padding: 5px 3px 5px 3px" /> --%>
                                            */''}`;
                                        }else if(data.announcement.fileType == 'FILE'){
                                            html+=`<a href="${FILE_UPLOAD_PATH + data.announcement.attachment}" target="blank" class="btn btn-primary btn-lg font-18 w-100"><i class="fa fa-eye mr-2"></i>View Attachment</a>`;
                                        }
                                    html+=`</div>`;
                                }
                                html+=`<div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">`;
                                    if(data.announcement.replyStatus == 'N'){
                                        html+=`<button type="button" class="btn btn-lg font-18 w-100 btn-outline-success"  id="saveAnnouncementAcknowledgeId" onclick="saveAnnouncementAcknowledge('${data.announcement.announceId}','${data.announcement.userId}','${data.announcement.moduleId}')">Kindly Acknowledge</button>`;
                                    }
                                    if(data.announcement.replyStatus == 'Y'){
                                        html+=`<div class="font-18 w-100 bg-success rounded p-2 text-white text-center">Acknowledged<i class="fa fa-check ml-2"></i></div>`;
                                    }
                                html+=`</div>
                            </div>
                        </div>
                    </div>`
                html+=`</div>	
            </div>		
        </div>`;
    return html;
}