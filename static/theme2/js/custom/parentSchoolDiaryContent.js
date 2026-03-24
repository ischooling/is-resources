
function getParentSchoolDiaryEmptyState() {
    return `<div class="text-center text-muted py-4 empty-chat">No diary entries available</div>`;
}

function getParentSchoolDiaryEntriesHtml(data) {
    var html = `
    <div>
        <div class="d-flex py-2 pl-4 school-diary-head">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="25" class="cursor mr-2 back-diary-btn" data-thread-id="" onclick="backSchoolChatList(this)" style="display:none">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288 480 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-370.7 0 105.4-105.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
            </svg>
            <div class="font-20 text-dark font-weight-semi-bold">
                <img src="${PATH_FOLDER_IMAGE2}diary.png" alt="School Diary" class="mr-2" style="width:30px;"/>
                ${USER_ROLE == "TEACHER"?` Teacher Diary <span class="chat-user-name"></span>`:USER_ROLE == "PARENT" || USER_ROLE == "STUDENT" ? `<span class="chat-user-name"></span> School Diary`:'School Diary'}
            </div>
        </div>
        ${USER_ROLE == "TEACHER" || USER_ROLE == "PARENT" ? schoolDiaryFilterUserContent(data):""}
    </div>
    ${schoolDiaryUserListContent()}
    <form id="schoolDiaryForm" method="post" autocomplete="off">
        <input type="hidden" id="input-count-alok-iitian" value="" onchange="checkUnreadMessageCount(this)"/>
        <input type="hidden" id="input-last-message-id-alok-iitian" value="" onchange="lastMsgIdUpdated(this)" />
        <input type="hidden" id="input-chat-id-alok-iitian" value="" onchange="refreshSchoolDiaryChat(this)"/>
        <input type="hidden" id="input-chat-status-alok-iitian" value="" onchange="showAndHideAcknowledge(this)" />
        <div class="school-diary-notebook overflow-y-auto pt-2" style="height:calc(100vh - 50px);display:none"></div>
    </form>`;
    return html;
}

function parentSchoolDiaryFormatRole(role) {
    if (!role) {
        return "";
    }
    return role
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, function (m) { return m.toUpperCase(); });
}

function parentSchoolDiaryEscapeRegex(rawText) {
    return (rawText || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function parentSchoolDiaryHighlightMentions(message, mentions) {
    var safeMessage = parentSchoolDiaryEscapeHtml(message || "");
    if (safeMessage === "") {
        return safeMessage;
    }

    var mentionNames = [];
    if ($.isArray(mentions) && mentions.length > 0) {
        mentionNames = $.map(mentions, function (mention) {
            return mention.userName || mention.email || "";
        }).filter(function (name) { return name; });
    }

    if (mentionNames.length > 0) {

        // longest name first to avoid partial matches
        mentionNames.sort(function (a, b) { return b.length - a.length; });

        $.each(mentionNames, function (_, name) {

            var safeName = parentSchoolDiaryEscapeHtml(name);
            var escapedName = parentSchoolDiaryEscapeRegex(name);

            // match full mention
            var pattern = new RegExp("@" + escapedName + "(?=\\s|$|[.,!?])", "g");

            safeMessage = safeMessage.replace(pattern, function () {
                return '<span class="text-success">@' + safeName + '</span>';
            });
        });

        return safeMessage;
    }

    return safeMessage.replace(/(^|\s)(@[-\w.]+)/g, '$1<span class="text-success">$2</span>');
    // return safeMessage.replace(new RegExp("@" + escapedName + "(?=\\s|$|[.,!?])", "g"), '$1<span class="text-success">$2</span>');
}

function parentSchoolDiaryHighlightMentionsFull(message, mentions) {
    var safeMessage = parentSchoolDiaryEscapeHtml(message || "");
    if (safeMessage === "") {
        return safeMessage;
    }

    var mentionNames = [];
    if ($.isArray(MENTION_LIST) && MENTION_LIST.length > 0) {
        mentionNames = $.map(MENTION_LIST, function (mention) {
            return mention.userName || mention.email || "";
        }).filter(function (name) { return name; });
    }

    if (mentionNames.length > 0) {

        // longest name first to avoid partial matches
        mentionNames.sort(function (a, b) { return b.length - a.length; });

        $.each(mentionNames, function (_, name) {

            var safeName = parentSchoolDiaryEscapeHtml(name);
            var escapedName = parentSchoolDiaryEscapeRegex(name);

            // match full mention
            var pattern = new RegExp("@" + escapedName + "(?=\\s|$|[.,!?])", "g");

            safeMessage = safeMessage.replace(pattern, function () {
                return '<span class="text-success">@' + safeName + '</span>';
            });
        });

        return safeMessage;
    }

    return safeMessage.replace(/(^|\s)(@[-\w.]+)/g, '$1<span class="text-success">$2</span>');
}


function parentSchoolDiaryNormalizeRole(role) {
    return (role || "").toString().trim().toUpperCase();
}

function parentSchoolDiaryResolveCurrentUserName() {
    if (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME) {
        return USER_FULL_NAME;
    }
    return "You";
}

function parentSchoolDiaryResolveOtherRoleLabel() {
    var role = parentSchoolDiaryNormalizeRole(typeof USER_ROLE !== "undefined" ? USER_ROLE : "");
    if (role === "PARENT") {
        return "Teacher";
    }
    if (role === "TEACHER") {
        return "Parent";
    }
    return "User";
}

function parentSchoolDiaryIsOutgoing(entry) {
    if (!entry) {
        return false;
    }
    if (typeof USER_ID !== "undefined" && USER_ID != null) {
        if (entry.senderUserId != null && String(entry.senderUserId) === String(USER_ID)) {
            return true;
        }
        if (entry.senderId != null && String(entry.senderId) === String(USER_ID)) {
            return true;
        }
    }
    var entryRole = parentSchoolDiaryNormalizeRole(entry.senderRole || "");
    var userRole = parentSchoolDiaryNormalizeRole(typeof USER_ROLE !== "undefined" ? USER_ROLE : "");
    if (entryRole && userRole && entryRole === userRole) {
        return true;
    }
    var entryName = (entry.senderName || "").toString().trim().toLowerCase();
    var userName = parentSchoolDiaryResolveCurrentUserName().toString().trim().toLowerCase();
    if (entryName && userName && entryName === userName) {
        return true;
    }
    return false;
}

function parentSchoolDiaryResolveReceiverNames(entry) {
    var names = [];
    if (entry && $.isArray(entry.mentions) && entry.mentions.length > 0) {
        names = $.map(entry.mentions, function (mention) {
            return mention.userName || mention.email || "";
        }).filter(function (name) { return name; });
    }
    if (names.length > 0) {
        return names;
    }
    if (entry) {
        var possible = entry.receiverName || entry.toUserName || entry.recipientName || entry.toName || "";
        if (possible) {
            return [possible];
        }
    }
    return [];
}

function parentSchoolDiaryGetHeader(entry, isOutgoing) {
    var senderName = isOutgoing ? parentSchoolDiaryResolveCurrentUserName() : (entry.senderName || entry.teacherName || "User");
    var receiverNames = parentSchoolDiaryResolveReceiverNames(entry);
    var receiverName = receiverNames.length > 0
        ? receiverNames.join(", ")
        : (isOutgoing ? parentSchoolDiaryResolveOtherRoleLabel() : parentSchoolDiaryResolveCurrentUserName());

    var safeSender = parentSchoolDiaryEscapeHtml(senderName);
    var safeReceiver = parentSchoolDiaryEscapeHtml(receiverName);
    if (!safeReceiver) {
        return safeSender;
    }
    // return safeSender + " to " + safeReceiver;
    return safeSender;
}

function getParentSchoolDiaryTeacherCard(entry, value, timezone, courseName) {
    var createdAt = parentSchoolDiaryFormatDate(entry.createdAt, timezone);
    var safeMessage = parentSchoolDiaryHighlightMentions(entry.message || "", entry.mentions);
    var headerText = parentSchoolDiaryGetHeader(entry, false);
    html=`
        
        <div class="school-diary-item school-diary-item-teacher mb-3 pr-2">`;
            html+=
            `<div class="school-diary-card teacher-card text-left mr-auto">
                <p class="mb-1 text-primary font-weight-bold">${entry.senderGender != "DONOTWANTTOSPECIFY" ?getSalutationByGender(entry.senderGender):""} ${headerText}</p>`;
                
                if(entry.senderRole == "TEACHER"){
                    html+=
                    `<p class="mb-1 text-success">${courseName}</p>
                    <div class="head">
                        <p class="font-20 font-weight-bold mb-0 caveat-font">Dear Parent</p>
                        <p class="font-semi-bold text-primary mb-0 caveat-font">Greetings from ${SCHOOL_NAME}!</p>
                        <p class="font-semi-bold mb-0 caveat-font">Hope you are doing well.</p>
                    </div>`;
                }else if(entry.senderRole == "PARENT"){
                    html+=
                    `<div class="head">
                        <p class="font-20 font-weight-bold mb-0 caveat-font">Dear Teacher</p>
                    </div>`;
                }
                html+=`<p class="mb-2 caveat-font my-3">${safeMessage.replace(/\n/g, "<br/>")}</p>`;
                if(entry.senderRole == "TEACHER"){
                    html+=
                    `<div class="foot mb-1">
                        <p class="mb-0 caveat-font">Gratitude and prayers,</p>
                        <p class="mb-0 caveat-font">${SCHOOL_NAME} Family</p>
                    </div>`;
                }
                html+=`<small class="text-muted">${createdAt}</small>
            </div>
        </div>`;
    return html;
}

function getParentSchoolDiaryReplyCard(entry, value, timezone) {
    var createdAt = parentSchoolDiaryFormatDate(entry.createdAt, timezone);
    var safeMessage = parentSchoolDiaryHighlightMentions(entry.message || "", entry.mentions);
    // var headerText = parentSchoolDiaryGetHeader(entry, true);
    var html=
        `<div class="school-diary-item school-diary-item-parent mb-3">
            <div class="school-diary-card parent-card ml-auto text-left">`;
                if(USER_ROLE == "TEACHER"){
                    html+=
                    `<div class="head">
                        <p class="font-20 font-weight-bold mb-0 caveat-font">Dear Parent</p>
                        <p class="font-semi-bold text-primary mb-0 caveat-font">Greetings from ${SCHOOL_NAME}!</p>
                        <p class="font-semi-bold mb-0 caveat-font">Hope you are doing well.</p>
                    </div>`;
                }else if(USER_ROLE == "PARENT"){
                    html+=
                    `<div class="head">
                        <p class="font-20 font-weight-bold mb-0 caveat-font">Dear Teacher</p>
                    </div>`;
                }
                html+=`<p class="mb-2 caveat-font safeMessage ${USER_ROLE == "TEACHER"? 'my-4':''}">${safeMessage.replace(/\n/g, "<br/>")}</p>`;
                if(USER_ROLE == "TEACHER"){
                    html+=
                    `<div class="foot mb-1">
                        <p class="mb-0 caveat-font">Gratitude and prayers,</p>
                        <p class="mb-0 caveat-font">${SCHOOL_NAME} Family</p>
                    </div>`;
                }
            html+=`<small class="text-muted">${createdAt}</small></div>
        </div>`;
    return html;
}

function getParentSchoolDiaryReplyEditor(threadId, userId) {
    if (threadId != null && threadId != undefined && threadId != "") {
        return `
        <div class="school-diary-item school-diary-item-editor mb-0">
            <div class="input-group">
                <textarea class="form-control school-diary-reply-input" id="diaryReplyText${threadId}" onkeydown="enterPressSubmitMsg(this, \'${threadId}\', event)" placeholder="Write your response…" rows="1" data-threadId="${threadId}"></textarea>
                <div class="p-0 mx-2 cursor rounded-circle circle-btn bg-primary" id="diaryReplyBtn${threadId}" onclick="schoolDiarySubmitReply(\'${threadId}\')">
                    <i class="fa fa-paper-plane text-white"></i>
                </div>
                <div class="mention-suggestion-box d-none"></div>
            </div>
        </div>`;
    }
    if(USER_ROLE == "TEACHER"){
        return `
            <div class="school-diary-item school-diary-item-editor mb-0">
                <div class="input-group">
                    <textarea class="form-control school-diary-reply-input create-chat" onkeydown="enterPressSubmitMsg(this, \'${userId}\', event)" placeholder="Write your response…" rows="1" data-userId="${userId}"></textarea>
                    <div class="p-0 mx-2 cursor rounded-circle circle-btn bg-primary" onclick="createUserDiary(\'${userId}\')">
                        <i class="fa fa-paper-plane text-white"></i>
                    </div>
                    <div class="mention-suggestion-box d-none"></div>
                </div>
            </div>
        `;
    }
}

function schoolDiaryFilterUserContent(data){
    var html=
    `<div class="full px-4 short-chat">
        <div class="d-flex p-2 rounded-5 bg-light">`;
            if(USER_ROLE == "TEACHER"){
                html+=
                `<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                    <select class="form-control form-control-sm" id="gradeDropDown" onchange="filterStudentByGrade(\'gradeDropDown\')">
                        <option value="">Select Grade</option>`
                        $.each(data.details.assignedGrades, function(i,v){
                            html+=`<option value="${v.standardId}">${v.standardName}</option>`
                        });
                    html+=`</select>
                </div>`;
            }    
            html+=
            `<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                <select class="form-control form-control-sm" id="studentDropDown" ${USER_ROLE == "TEACHER" ? 'disabled':''} onchange="searchChatByStudent(\'studentDropDown\')"><option>Select Student</option></select>
            </div>
        </div>
    </div>
    <div class="recent font-weight-semi-bold font-18 px-4 mt-3 short-chat">Recent</div>`;
    return html;
}

function schoolDiaryUserListContent(){
    var html=
    `<div class="user-list-wrapper overflow-y-auto short-chat" style="height:calc(100vh - 140px);">
        <div class="user-list-body">
            <ul class="list-group list-group-flush" id="schoolDiaryChatUserListWrapper"></ul>
        </div>
    </div>`;
    return html;
}

function schoolDiaryUserListing(data){
    var html=``;
    
    if(data.details != null && data.details.threads.length>0){
        $.each(data.details.threads, function(i,v){
            html+=
            `<li class="list-group-item text-left" id="chat-list-${v.threadId} userid-${v.studentUserId}">
                <a href="javascript:void(0)" class="widget-content p-0 text-dark" onclick="gotoChat('${v.threadId}', true, '${USER_ROLE === "TEACHER" ? ((v.learningProgram ? getLearningProgramLabel(v.learningProgram) + " | " : "") + v.studentName) : (v.studentName + "\\'s")}')">
                    <div class="widget-content-wrapper align-items-start">
                        <div class="avatar-icon-wrapper mr-2">
                            <div class="avatar-icon ${(v.profilePic != null && v.profilePic != undefined && v.profilePic != "") ? 'align-items-center justify-content-center d-flex bg-primary':'' }">`
                                if(v.profilePic != null && v.profilePic != undefined && v.profilePic != ""){
                                    html+=`<img src="${v.profilePic}" alt="">`;
                                }else{
                                    html+=`<span class="text-white font-weight-semi-bold">${USER_ROLE == "TEACHER" ? `${getUserInitialsCommon(v.studentName,'')}`:`${getUserInitialsCommon(v.teacherName,'')}`}</span>`
                                }
                            html+=`</div>
                        </div>
                        <div class="widget-content-left">
                            <div class="widget-heading">${USER_ROLE == "TEACHER" ? `${v.studentName}`:`${getSalutationByGender(v.teacherGender)} ${v.teacherName}`}</div>
                            <p class="font-weight-semi-bold text-dark school-diary-unread-msg m-0 school-diary-unread-msg-${v.threadId}">${v.latestMessage}</p>
                        </div>
                        <div class="chat-time unread-chat text-primary ml-auto badge-unread-count-${v.threadId}" style="${v.unreadCount>0?'display:block':'display:none'}">
                            ${/*<div class="font-12">15m</div>*/''}
                            <span class="counts-badge badge badge-pill badge-primary ml-0 unread-chat-count">${v.unreadCount}</span>
                        </div>
                    </div>
                </a>
            </li>`
        });
    }
    
    return html;
}



function parentSchoolDiaryGetStyles() {
    return `
        <style id="parentSchoolDiaryStyles">
            @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Noto+Sans+Devanagari:wght@100..900&family=Noto+Serif:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap');
            .caveat-font{
                font-family: "Caveat", cursive;
                font-weight:bold;
                font-size:16px;
                word-break:break-all;
            }
            .parent-school-diary-wrap .card-body {
                background:
                    linear-gradient(transparent 31px, rgba(0, 132, 255, 0.08) 32px),
                    linear-gradient(90deg, transparent 31px, rgba(0, 132, 255, 0.08) 32px);
                background-size: 32px 32px;
                border-radius: 0 0 10px 10px;
                display: flex;
                flex-direction: column;
                padding-bottom: 10px;
            }
            #parentSchoolDiaryList {
                flex: 1;
                min-height: 200px;
                max-height: calc(100vh - 320px);
                overflow-y: auto;
                padding-right: 4px;
                position: relative;
            }
            .school-diary-notebook {
                border-left: 4px solid #0089d0;
                padding-left: 60px;
                position: relative;
                background:url(${PATH_FOLDER_IMAGE2}Diary_BG.webp);
                background-size:cover;
                backgroud-repeat:no-repeat;
                padding-bottom:50px;
            }
            .school-diary-card {
                border: 1px solid #bfc8d2;
                border-radius: 16px;
                padding: 14px 16px;
                background-color: #ffffff;
                box-shadow: 0 2px 8px rgba(16, 24, 40, 0.04);
            }
            .school-diary-item-parent .school-diary-card.parent-card {
                background: linear-gradient(135deg, #eefbff 0%, #ddf2ff 100%);
                max-width: 88%;
            }
            .school-diary-item-teacher .school-diary-card.teacher-card {
                max-width: 88%;
            }
            .school-diary-reply-input {
                resize: none;
                overflow-y: auto;
                border-radius: 40px 0 0 40px !important;
                max-height: 80px;
                min-height: 42px;
                word-break: break-word;
                overflow-wrap: break-word;
                border-top-right-radius:40px !important;
                border-bottom-right-radius:40px !important;
            }
            .school-diary-item-editor .btn {
                border-radius: 0 40px 40px 0 !important;
                min-width: 90px;
            }
            .school-diary-item-editor {
                position: fixed;
                bottom: 1%;
                z-index: 3;
                width:calc(100% - 60px);
                //box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
                margin:10px 10px 0 auto;
                left:0;
                right:0;
            }
            .school-diary-item-editor.no-pending-reply {
                text-align: center;
            }
            .mention-suggestion-box{
                position:absolute;
                bottom:45px;
                left:0;
                width:250px;
                background:#fff;
                border:1px solid #ddd;
                border-radius:6px;
                box-shadow:0 2px 8px rgba(0,0,0,0.15);
                z-index:999;
                max-height:200px;
                overflow-y:auto;
            }

            .mention-item{
                padding:8px 12px;
                cursor:pointer;
            }

            .mention-item:hover{
                background:#f5f5f5;
            }
            .circle-btn{
                width: 50px;
                height: 50px;
                outline: none !important;
                border: 0px;
                font-size: 20px;
                color:white;
                display:inline-flex;
                align-items:center;
                justify-content:center;
            }
            .floating-date {
                position: sticky;
                top: 10px;
                margin: 0 auto;
                width: fit-content;
                padding: 5px 12px;
                background: #e5e5ea;
                border-radius: 10px;
                font-size: 12px;
                z-index: 999;
                text-align: center;
            }
            @media (max-width: 767px) {
                
                #parentSchoolDiaryList {
                    max-height: calc(100vh - 360px);
                }
            }
            @media(max-width:480px){
                .school-diary-item-editor{bottom: 11% !important; width:calc(100% - 45px) !important}
                .school-diary-notebook{padding-bottom: 135px !important;}
            }
        </style>
    `;
}
