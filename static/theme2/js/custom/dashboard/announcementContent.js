function getAnnouncementContent(data, userId, index){
    var html=
        `<div class="full">
            <div class="card box-shadow-none">`
                +dashboardAnnouncementHeader(data, userId, index)
                +dashboardAnnouncementContent(data)
            html+=`</div>
        </div>`;
    return html;
}
function dashboardAnnouncementHeader(data, userId, index){
    var html=
        `<div class="card-header theme-bg text-white justify-content-between card-header-primary d-flex">
            <h6 id="announcementHeaderContent" class="pull-left m-0 font-size-md">`;
                if(data.newAnnouncementCount!=null && data.newAnnouncementCount>0){
                    //html+=data.newAnnouncementCount+' New Announcement(s)';
                    html+=`<span id="newAnnouncementCount">${data.newAnnouncementCount}</span> New Announcement(s)`
                }else{
                    html+='Announcement';
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
        `<div class="card-body announcement-card-scroll">
            <div class="announcement-wrapper">
                <ul id="announcementDataContent">`;
                    if(data.announcements!=null && data.announcements.length>0){
                        $.each(data.announcements, function(k, schoolAnnounce) {
                            html+=
                            `<li class="col-md-12 col-sm-12 col-12 p-0">
                                <div class="announcement-anchor" onclick="showAnnounceDataById(${schoolAnnounce.announcementId},58);">
                                    <div class="announcement-list">
                                        <span class="annoucement-icon">
                                            <i class="fa fa-bullhorn"></i>`;
                                            if(schoolAnnounce.replyStatus == 'N'){
                                                html+=`<label class="new-label accepted-announcement${schoolAnnounce.announcementId}">New</label>`;
                                            }
                                            html+=
                                        `</span>
                                        <h4 class="announcement-title">
                                            <span>`+decodeURIComponent(schoolAnnounce.announceTitle);
                                                if(schoolAnnounce.replyStatus == 'N' && schoolAnnounce.latestStatus == 'Y'){
                                                    html+=
                                                    `<label class="m-0 announcement-ribbon accepted-announcement${schoolAnnounce.announcementId}">New</label>
                                                     <i class="fa fa-star announcement-ribbon-star accepted-announcement${schoolAnnounce.announcementId}"></i>`;
                                                }
                                                html+=
                                            `</span>
                                        </h4>
                                    </div>
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
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">`;
                    html+=
                    `<div class="modal-header bg-primary text-white pt-2 pb-2">
                        <h5 class="modal-title">`+decodeURIComponent(data.announcement.announceTitle)+`</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="full table-responsive">
                            <table class="table table-striped table-bordered nowrap no-footer annoucement-table-details" style="width:100% !important;">
                                <thead>
                                    <tr>
                                        <th style="text-align: center;" width="430px">Start Date</th>
                                        <th style="text-align: center;" width="430px">Description</th>
                                        <th style="text-align: center;">Attachment</th>
                                        <th style="text-align: center;">Kindly Acknowledge </th>
                                    </tr>
                                </thead>
                                <tbody>
                                        <tr>
                                            <td>`+convertDatetimeWithFormat(data.announcement.createdDate,BASE_TIMEZONE, USER_TIMEZONE,DISPLAY_DATE_ONLY)+`</td>
                                            <td>`+decodeURIComponent(data.announcement.teacherRemark)+`</td>
                                            <td class="text-center vertical-align-top">`;
                                                if(data.announcement.fileType =='' || data.announcement.attachment == ''){
                                                    html+=`NA`;
                                                }else if(data.announcement.fileType == 'IMAGE'){
                                                    html+=
                                                    `<a href="javascript:void(0)" onclick="showDocument('${data.announcement.attachment}');">View</a>
                                                    ${/*
                                                    <%-- <img  src="${announcement.attachment}" alt="" onclick="showDocument('${announcement.attachment}');" title=""  style="width: 50px; height: 50px; max-width: 100%;padding: 5px 3px 5px 3px" /> --%>
                                                    */''}`;
                                                }else if(data.announcement.fileType == 'FILE'){
                                                    html+=`<a href="${data.announcement.attachment}" target="blank">View</a>`;
                                                }
                                            html+=`</td>
                                            <td class="text-center vertical-align-top">`;
                                                if(data.announcement.replyStatus == 'N'){
                                                    html+=`<button type="button" class="btn btn-primary"  id="saveAnnouncementAcknowledgeId" onclick="saveAnnouncementAcknowledge('${data.announcement.announceId}','${data.announcement.userId}','${data.announcement.moduleId}')">I Acknowledge</button>`;
                                                }
                                                if(data.announcement.replyStatus == 'Y'){
                                                    html+=`<button class="btn btn-sm btn-success"><i class="fa fa-check"></i></button>`;
                                                }
                                            html+=`</td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>`
                html+=`</div>	
            </div>		
        </div>`;
    return html;
}