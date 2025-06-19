async function getActivityContent(data){
    var html=
        `<div class="full">
            <div class="card box-shadow-none">
                ${dashboardActivityHeader()}
                ${await dashboardActivityContent(data)}
            </div>
        </div>`;
    return html;
}
function dashboardActivityHeader(){
    var html=
        `<div class="card-header activities-bg-head text-white">
            <h6 class="m-0 font-size-md text-capitalize">Activities</h6>
        </div>`;
    return html;
}

async function dashboardActivityContent(data){var activitiesList = await dashboardActivityListContent(data);var html = `<div class="card-body card-activity"><ul class="vertical-nav-menu" id="main-nav1">${activitiesList}</ul></div>`;return html;}
function dashboardActivityListContent(data){
    return new Promise((resolve, reject) => {
        try {
            var html = '';
            $.each(data.activityTypes, function(k, activityType) {
                html += '<li class="sub-menu" id="activity-li-'+activityType.id+'">'
                    if(activityType.parentId==0){
                        html+=
                        '<a id="parent-'+activityType.id+'" href="javascript:void(0);" class="waves-effect custom-rounded-btn activities-bg-head" aria-expanded="true" style="padding-left:12px !important;">'
                            +'<span class="text-white">'
                                +activityType.activityName
                            +'</span>'
                            +'<i class="metismenu-state-icon pe-7s-angle-down caret-left text-white opacity-10"></i>'
                        +'</a>'
                        +'<ul class="mm-collapse">';
                            if(data.activities!=null && data.activities.length>0){
                                $.each(data.activities, function(i, ead) {
                                    var functionName='renderViewActitifyDetails('+ead.id+','+ead.meetingId+')';
                                    if(ead.subActivityTypeId==0 && ead.activityTypeId==activityType.id){
                                        // console.log('ead.startDateTime1 '+ead.startDateTime);
                                        // console.log('ead.startDateTime1 '+new Date(convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE, DATETIME_UTC_FORMATTER)));
                                        // console.log('ead.startDateTime1 '+new Date($("#currentTimeForUser").text()));
                                        if(new Date(convertDatetimeWithFormat(ead.endDateTime, BASE_TIMEZONE, USER_TIMEZONE, DATETIME_UTC_FORMATTER)).getTime()>new Date($("#currentTimeForUser").text()).getTime()){
                                            html+=
                                                '<li class="myActivityLoop activityCounterLi activity-date-and-time-wrapper" data-activity-index="'+activityType.id+'" data-starttimedate="'+convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE, DATETIME_UTC_FORMATTER)+'" data-endtimedate="'+convertDatetimeWithFormat(ead.endDateTime, BASE_TIMEZONE, USER_TIMEZONE, DATETIME_UTC_FORMATTER)+'" data-timeid="'+ead.id+'" data-joiningBefore="'+ead.joiningBefore+'">'
                                                    +'<div class="ongoing-div" style="display:none">'
                                                        +'<h4 class="text-center font-size-lg text-success-custom without-cursor-nav"><b>'+(ead.activityTypeId!=4?'Join Ongoing Activity':'Join Ongoing Assessment')+'</b></h4>'
                                                        +'<div class="px-1">'
                                                            +'<a style="background-color:#007bfe;color:#fff;padding:5px 5px 5px 5px !important; text-align:center; border-radius:4px;margin-bottom:5px" class="waves-effect font-weight-bold" onclick="'+functionName+'" href="javascript:void(0);"><span >'+ead.activityTitle+' </span> </a>'
                                                        +'</div>'
                                                    +'</div>'
                                                    +'<div>'
                                                        +'<h4 class="without-cursor-nav counter-div text-center font-size-lg text-success-custom">'
                                                            +'<b>'+(ead.activityTypeId!=4?'Upcoming Activity':'Upcoming Assessment')+' </b>'
                                                        +'</h4>'
                                                        +'<div class="counter-div mb-1 px-1">'
                                                            +'<div class="activity-date-and-time">'
                                                                +'<span><b>on '+convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE,DISPLAY_DATE_FORMATTER)+'</b></span>'
                                                                +'<span><b>at '+convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE,DISPLAY_TIME_FORMATTER)+'</b></span>'
                                                            +'</div>'
                                                        +'</div>'
                                                        +'<div class="px-1 ">'
                                                            +'<a class="activity-btn disable-btn-color text-white font-weight-bold text-center waves-effect" style="padding: 5px !important " onclick="'+functionName+'" href="javascript:void(0);"><span>'+ead.activityTitle+'</span></a>'
                                                        +'</div>'
                                                        +'<div class="counter-div">'
                                                            +'<div class="px-1 text-center font-size-md text-success-custom"><b>Time Remaining</b></div>'
                                                            +'<div id="timer'+ead.id+'" class="counter-wrapper-div">'
                                                            +'<div id="days'+ead.id+'" class="count-div days"></div>'
                                                            +'<div id="hours'+ead.id+'" class="count-div hours"></div>'
                                                            +'<div id="minutes'+ead.id+'" class="count-div minutes"></div>'
                                                            +'<div id="seconds'+ead.id+'" class="count-div seconds"></div>'
                                                            +'</div>'
                                                        +' </div>'
                                                        +'<div class="join-div px-4 my-2 text-center">'
                                                            +'<a class="btn join-activity-btn animated-button joinLBtn'+ead.id+'" onclick="'+functionName+'"  href="javascript:void(0);" style="padding:7px 10px !important;border-radius:3px;display:none">'
                                                            +'<span></span>'
                                                            +'<span></span>'
                                                            +'<span></span>'
                                                            +'<span></span>'
                                                            +'Join Now'
                                                        +'</a>'
                                                    +'</div>'
                                                +'</div>'
                                            +'</li>';
                                        }
                                    }else if(ead.subActivityTypeId!=0 && ead.activityTypeId==activityType.id){
                                        // console.log('ead.startDateTime2 '+ead.startDateTime);
                                        // console.log('ead.startDateTime2 '+new Date(convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE, DATETIME_UTC_FORMATTER)));
                                        // console.log('ead.startDateTime2 '+new Date($("#currentTimeForUser").text()));
                                        if(new Date(convertDatetimeWithFormat(ead.endDateTime, BASE_TIMEZONE, USER_TIMEZONE, DATETIME_UTC_FORMATTER)).getTime()>new Date($("#currentTimeForUser").text()).getTime()){
                                            html+=
                                            '<li class="sub-menu">'
                                                +'<a href="javascript:void(0);" class="waves-effect custom-rounded-sub-btn text-white">'+ead.subActivityName
                                                    +'<i class="metismenu-state-icon pe-7s-angle-down caret-left text-white"></i>'
                                                +'</a>'
                                                +'<ul class="mm-collapse">'
                                                    +'<li class="myActivityLoop activityCounterLi activity-date-and-time-wrapper" data-activity-index="'+activityType.id+'" data-starttimedate="'+convertDatetimeWithFormat(ead.startDateTime,BASE_TIMEZONE, USER_TIMEZONE,DATETIME_UTC_FORMATTER)+'" data-endtimedate="'+convertDatetimeWithFormat(ead.endDateTime, BASE_TIMEZONE, USER_TIMEZONE,DATETIME_UTC_FORMATTER)+'" data-timeid="'+ead.id+'" data-joiningBefore="'+ead.joiningBefore+'">'
                                                        +'<div class="ongoing-div" style="display:none">'
                                                            +'<h4 class="without-cursor-nav text-center font-size-lg text-success-custom">'
                                                                +'<span><b>'+(ead.activityTypeId!=4?'Join Ongoing Activity':'Join Ongoing Assessment')+'</b></span>'
                                                            +'</h4>'
                                                            +'<div class="px-1">'
                                                                +'<a style="background-color:#007bfe;color:#fff;padding:5px 5px 5px 5px !important; text-align:center; border-radius:4px;margin-bottom:5px" class="waves-effect font-weight-bold" onclick="'+functionName+'" href="javascript:void(0);">'
                                                                    +'<span>'+ead.activityTitle+'</span>'
                                                                +'</a>'
                                                            +'</div>'
                                                        +'</div>'
                                                        +'<div>'
                                                            +'<h4 class="without-cursor-nav counter-div text-center font-size-lg text-success-custom"><span ><b>'+(ead.activityTypeId!=4?'Upcoming Activity':'Upcoming Assessment')+'</b> </span> </h4>'
                                                            +'<div class="counter-div mb-1 px-1">'
                                                                +'<div class="activity-date-and-time">'
                                                                    +'<span><b>on '+convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE,DISPLAY_DATE_FORMATTER)+'</b></span>'
                                                                    +'<span><b>at '+convertDatetimeWithFormat(ead.startDateTime, BASE_TIMEZONE, USER_TIMEZONE,DISPLAY_TIME_FORMATTER)+'</b></span>'
                                                                +'</div>'
                                                            +'</div>'
                                                            +'<div class="px-1">'
                                                                +'<a class="activity-btn disable-btn-color font-weight-bold text-center" onclick="'+functionName+'" href="javascript:void(0);">'+ead.activityTitle+'</span></a>'
                                                            +'</div>'
                                                            +'<div class="counter-div text-center">'
                                                                +'<div class="px-1 text-center font-size-md text-success-custom"><b>Time Remaining</b></div>'
                                                                    +'<div id="timer'+ead.id+'" class="counter-wrapper-div">'
                                                                    +'<div id="days'+ead.id+'" class="count-div days"></div>'
                                                                    +'<div id="hours'+ead.id+'" class="count-div hours"></div>'
                                                                    +'<div id="minutes'+ead.id+'" class="count-div minutes"></div>'
                                                                    +'<div id="seconds'+ead.id+'" class="count-div seconds"></div>'
                                                                    +'</div>'
                                                                +' </div>'
                                                                +'<div class="join-div px-4 my-2 text-center">'
                                                                    +'<a class="btn join-activity-btn animated-button joinLBtn'+ead.id+'" onclick="'+functionName+'"  href="javascript:void(0);" style="padding:7px 10px !important;border-radius:3px;display:none">'
                                                                    +'<span></span>'
                                                                    +'<span></span>'
                                                                    +'<span></span>'
                                                                    +'<span></span>'
                                                                    +'Join Now'
                                                                +'</a>'
                                                            +'</div>'
                                                        +'</div>'
                                                    +'</li>'
                                                +'</ul>'
                                            +'</li>';
                                        }
                                    }
                                });
                            }
                        html+=
                        '</ul>';    
                    }
                html+'</li>'; // Correctly close the <li> tag here
            });
            resolve(html);
        } catch (error) {
            reject(error);
        }
    });
}

function viewActivityContent(data){
    var pdfClass=(data.uploadFile.endsWith('.pdf')?'pdf-view':'');
    var html=
    `<div class="main-card mb-0 card check-activity-page-load">
        <div class="card-header theme-bg card-header-primary" style="margin:0 !important">
            <h5 class="modal-title" style="font-size:18px !important;color:#fff">${data.activityTitle}</h5>
        </div>
        <div class="card-body" id="activitiesType">
            <div class="activity-wrapper `+pdfClass+`" id="zoomMeetingCard">
                <div class="activity-box"  id="zoomMeetingCardBox">
                    <div class="pdf-down text-center `+pdfClass+`">
                        <div class="pt-2" style="font-size:16px;font-weight:600;margin-bottom:35px;">${data.activityPurpose!=''?data.activityPurpose:''}</div>`;
                        html+=
                        `<div id="3434displayJoinLinkDiv${data.activityId}" class="mb-4" style="">`
                            if(data.uploadFile!='' && data.uploadFile !='No file chosen...'){
                                if(data.uploadFile.endsWith('.pdf')?'pdf-view':''){
                                    html+=`<iframe src="${data.filePath}" type="application/pdf" width="100%" height="500" style="overflow:auto;"></iframe>`;
                                }else{
                                    html+=`<img src="${data.filePath}" style="width:100%;" class="activity-upload-img"/>`;
                                }
                            }
                        html+=
                        `</div>
                        <div id="displayJoinLinkInfoDiv${data.activityId}" style="${USER_ROLE == 'TEACHER'?'display:none':''}">
                            <span class="activity-block col-lg-12 col-md-12 col-sm-12 col-12 card">
                                <h6>Your joining link will be displayed ${data.showLinkBeforeMinutes} minutes before the scheduled time.</h6>
                                <ul>
                                    <li class="myActivityLoop activityCounterLi activity-date-and-time-wrapper" data-timeid="`+data.activityId+`" data-starttimedate="`+convertDatetimeWithFormat(data.startDatetime, BASE_TIMEZONE, USER_TIMEZONE,DATETIME_UTC_FORMATTER)+`" data-endtimedate="`+convertDatetimeWithFormat(data.endDatetime, BASE_TIMEZONE, USER_TIMEZONE,DATETIME_UTC_FORMATTER)+`" data-joiningBefore="${data.showLinkBeforeMinutes}">
                                        <div class="counter-div">
                                            <div id="timer${data.activityId}">
                                                <div id="days${data.activityId}" class="count-div days"></div>
                                                <div id="hours${data.activityId}" class="count-div hours"></div>
                                                <div id="minutes${data.activityId}" class="count-div minutes"></div>
                                                <div id="seconds${data.activityId}" class="count-div seconds"></div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </span>
                        </div>
                        <div class="pt-4 text-center" id="joinButton${data.activityId}" style="${USER_ROLE == 'TEACHER'?'':'display:none'}">`;
                            if(USER_ROLE == 'TEACHER'){
                                html+=`<a href="javascript:void(0);" onclick="classDetailsOnModalActivity('${data.joiningLink}')" style="display: inline-block; padding: 8px 25px; font-size: 13px; background: green; color: #fff !important; border-radius: 4px;">Now you can join</a>`;
                            }else{
                                html+=`<a href="javascript:void(0);" onclick="classDetailsOnModalActivity('${data.joiningLink}')"  id="joinZoomMeeting" style="display: inline-block; padding: 8px 25px; font-size: 13px; background: green; color: #fff !important; border-radius: 4px;">Now you can join</a>`;
                            }
                            html+=
                        `</div>
                        <br>`;
                        // if(data.message!=''){
                        //     html+=data.message;
                        // }
                        html+=
                    `</div>
                </div>
            </div>
            <iframe id="activity-zoom-meeting-iframe" width="100%" height="650" frameborder="0" style="display: none;"></iframe>
            </div>
        </div>
    </div>`;
    return html;
}

function activityPageStyle(){
    var html=
    `<style id="activityPageStyle">
            .activity-wrapper.pdf-view, .pdf-view{width:100% !important;max-width:100% !important;}
            .pdf-down{}
            .pdf-down p{ margin-top:50px;}
            .pdf-down p a{ background:#007fff; padding:15px 25px; text-decoration:none; color:#fff; border-radius:40px; margin-top:50px;}
            .pdf-down p a:hover{ background:#004ff;}
            .activity-wrapper{max-width: 450px;width:100%;padding:8px;margin: 0px auto;background:#fff;box-shadow: 0 0 2px 3px rgb(211 211 211 / 30%);}
            .activity-box{width: 100%;text-align: center;border-radius: 0px;padding:10px 12px;border: 4px solid #0081ff;display: flex;justify-content: center;flex-wrap: wrap;align-items: flex-start;position:relative;}
            .activity-title{font-size:14px;width:100%;}
            .activity-block{display:inline-block;border:2px solid #001272;padding:8px;}
        </style>`;
    return html;
}
window.getActivityContent = getActivityContent;