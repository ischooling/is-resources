var SCHOOL_DIARY_ROLE = ["DIRECTOR", "SCHOOL", "ADMIN"];
var TEACHER_MENTION_ROLE = ["PARENT", "STUDENT", "DIRECTOR", "SCHOOL", "ADMIN"];
var PARENT_MENTION_ROLE = ["TEACHER", "DIRECTOR", "SCHOOL", "ADMIN"];
var SCHOOL_MENTION_ROLE = ["TEACHER", "PARENT", "STUDENT"];
var SCHOOL_DIARY_INITIATES_ROLE = false;
let CHAT_LIST_PAGE = 0;
let CHAT_LIST_SIZE = 20;
let CHAT_LIST_LOADING = false;
let CHAT_LIST_HAS_MORE = true;
var PARENT_DIARY_ACTIVE_STUDENT_ID = null;
var SCHOOL_DIARY_ACTIVE_CHAT = null;
var LAST_MSG_ID;
var MENTION_LIST;
var STUDENT_ARRAY;
var PAGE_NO=0;
var LATEST_CHAT_FLAG=false;
var DIARY_BRIDGE_CONNECTED = false;
var DIARY_BRIDGE_IFRAME_ID = "diary-bridge-iframe";
var DIARY_BRIDGE_NEXT_ORIGIN = null;
var DIARY_BRIDGE_PENDING_USER_LIST_REFRESH = false;
var DIARY_BRIDGE_MESSAGE_HANDLER = null;
var DIARY_BRIDGE_CONNECT_SCHEDULED = false;
var DIARY_BRIDGE_VISIBILITY_OBSERVER = null;
var DIARY_BRIDGE_BADGE_REFRESH_IN_FLIGHT = false;
var DIARY_BRIDGE_BADGE_REFRESH_QUEUED = false;
var CHAT_STATUS;
var CHAT_SESSION_END=false;
try {
    var DIARY_USER = getSettingsByTypeAndKey('CONFIGURATION', 'DIARY_ADMIN_ACCESS_USERS');
    var DIARY_USER_META_VALUE = DIARY_USER ? JSON.parse(DIARY_USER)?.data?.metaValue : "";
    var DIARY_USER_ID = DIARY_USER_META_VALUE ? DIARY_USER_META_VALUE.split(",").map(id => id.trim()) : [];
    SCHOOL_DIARY_INITIATES_ROLE = DIARY_USER_ID.includes(USER_ID.toString());
    } catch (error) {
    SCHOOL_DIARY_INITIATES_ROLE = false;
}
if(USER_ROLE == "TEACHER" && !SCHOOL_DIARY_INITIATES_ROLE){
    SCHOOL_DIARY_INITIATES_ROLE = true;
}
function diaryBridgeResolveChatOrigin(){
    try{
        if(typeof CHAT_URL === "undefined" || !CHAT_URL) return null;
        return new URL(CHAT_URL, window.location.href).origin;
    }catch(e){
        return null;
    }
}

function diaryBridgeShouldRefreshUserList(){
    return !$(".school-diary-notebook").is(":visible") && $(".user-list-wrapper").is(":visible");
}

function diaryBridgeEnsureVisibilityObserver(){
    if(DIARY_BRIDGE_VISIBILITY_OBSERVER) return;
    if(typeof MutationObserver === "undefined") return;
    if(!document.body){
        document.addEventListener("DOMContentLoaded", diaryBridgeEnsureVisibilityObserver, {once:true});
        return;
    }
    DIARY_BRIDGE_VISIBILITY_OBSERVER = new MutationObserver(function(){
        if(!DIARY_BRIDGE_PENDING_USER_LIST_REFRESH) return;
        if(!diaryBridgeShouldRefreshUserList()) return;
        DIARY_BRIDGE_PENDING_USER_LIST_REFRESH = false;
        refreshDiaryUserListingBadges(true);
    });
    DIARY_BRIDGE_VISIBILITY_OBSERVER.observe(document.body, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["style", "class"]
    });
}

function diaryBridgeEnsureConnected(){
    if(DIARY_BRIDGE_CONNECTED) return;
    if(typeof USER_ID === "undefined" || USER_ID === null || USER_ID === "") return;
    if(typeof CHAT_URL === "undefined" || !CHAT_URL) return;

    if(!document.body){
        if(DIARY_BRIDGE_CONNECT_SCHEDULED) return;
        DIARY_BRIDGE_CONNECT_SCHEDULED = true;
        document.addEventListener("DOMContentLoaded", function(){
            DIARY_BRIDGE_CONNECT_SCHEDULED = false;
            diaryBridgeEnsureConnected();
        }, {once:true});
        return;
    }

    DIARY_BRIDGE_NEXT_ORIGIN = diaryBridgeResolveChatOrigin();
    if(!DIARY_BRIDGE_NEXT_ORIGIN){
        // Cannot validate postMessage origin safely.
        return;
    }

    var existingIframe = document.getElementById(DIARY_BRIDGE_IFRAME_ID);
    if(!existingIframe){
        var iframe = document.createElement("iframe");
        iframe.id = DIARY_BRIDGE_IFRAME_ID;
        iframe.src =
          `${CHAT_URL}/iframe/diary-bridge?userId=${encodeURIComponent(USER_ID)}` +
          `&origin=${encodeURIComponent(window.location.origin)}`;
        iframe.style.display = "none";
        document.body.appendChild(iframe);
    }

    if(DIARY_BRIDGE_MESSAGE_HANDLER){
        window.removeEventListener("message", DIARY_BRIDGE_MESSAGE_HANDLER);
    }
    DIARY_BRIDGE_MESSAGE_HANDLER = function(event){
        if(event.origin !== DIARY_BRIDGE_NEXT_ORIGIN) return;
        var msg = event.data;
        if(!msg || typeof msg !== "object") return;

        if(msg.type === "DAIRY_COUNT_CHANGED" && String(msg.userId) === String(USER_ID)){
            if(diaryBridgeShouldRefreshUserList()){
                refreshDiaryUserListingBadges(true);
            }else{
                DIARY_BRIDGE_PENDING_USER_LIST_REFRESH = true;
                diaryBridgeEnsureVisibilityObserver();
            }
        }
    };
    window.addEventListener("message", DIARY_BRIDGE_MESSAGE_HANDLER);
    DIARY_BRIDGE_CONNECTED = true;
    diaryBridgeEnsureVisibilityObserver();
}

async function refreshDiaryUserListingBadges(force){
    try{
        if(DIARY_BRIDGE_BADGE_REFRESH_IN_FLIGHT){
            DIARY_BRIDGE_BADGE_REFRESH_QUEUED = true;
            return;
        }
        if(!force && !diaryBridgeShouldRefreshUserList()){
            DIARY_BRIDGE_PENDING_USER_LIST_REFRESH = true;
            diaryBridgeEnsureVisibilityObserver();
            return;
        }

        DIARY_BRIDGE_BADGE_REFRESH_IN_FLIGHT = true;
        $("#chat-loader").show();
        var userListingBadgeCount = await getChatUserListRecodrs(0, 20);
        $("#chat-loader").hide();
        var threads = userListingBadgeCount && userListingBadgeCount.details ? userListingBadgeCount.details.threads : null;
        if(!threads || !$.isArray(threads)) return;
        $("#schoolDiaryChatUserListWrapper").html(schoolDiaryUserListing(userListingBadgeCount));
        $.each(threads, function(i,v){
            var $badge = $(`.badge-unread-count-${v.threadId}`);
            var $count = $badge.find(".unread-chat-count");
            if(v.unreadCount > 0){
                $count.text(v.unreadCount);
                $badge.show();
            }else{
                $count.text("");
                $badge.hide();
            }
            if(typeof v.latestMessage !== "undefined" && v.latestMessage !== null){
                $(`.school-diary-unread-msg-${v.threadId}`).text(v.latestMessage);
            }
        });
    }catch(e){
        console.error(e);
    }finally{
        DIARY_BRIDGE_BADGE_REFRESH_IN_FLIGHT = false;
        if(DIARY_BRIDGE_BADGE_REFRESH_QUEUED){
            DIARY_BRIDGE_BADGE_REFRESH_QUEUED = false;
            if(force || diaryBridgeShouldRefreshUserList()){
                refreshDiaryUserListingBadges(true);
            }else{
                DIARY_BRIDGE_PENDING_USER_LIST_REFRESH = true;
                diaryBridgeEnsureVisibilityObserver();
            }
        }
    }
}



async function getAssignGradeAndStudent(){
    var payload = {sessionUserId: USER_ID};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL +  "/api/diary/teacher/student-list-for-diary",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    return await callCommonAjax(ajaxReqDetails);
}



async function getUnreadChatCount(){
    if(USER_ROLE == "PARENT"){
        var payload = {sessionUserId: USER_ID,studentUserId:ACTIVE_STUDENT_ID};
    }else{
        var payload = {sessionUserId: USER_ID};
    }
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL +  "/api/diary/thread/unread-count",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    return await callCommonAjax(ajaxReqDetails);
}



// async function getChatUserList(flag){
//     $(".school-diary-notebook, .back-diary-btn, .chat-user-name, .short-chat").hide();
//     if(SCHOOL_DIARY_INITIATES_ROLE){
//         $("#gradeDropDown, #studentDropDown").val("").trigger("");
//     }
//     if(flag){
//         CHAT_LIST =  await getChatUserListRecodrs();
//     }
//     if(USER_ROLE == "PARENT"){
//         var filterStudent = CHAT_LIST.details.threads.filter(function(item){
//             return String(item.studentUserId) == ACTIVE_STUDENT_ID;
//         });
//     }else{
//         var filterStudent = CHAT_LIST.details.threads;
//     }
//     if(CHAT_LIST != null && CHAT_LIST != undefined && filterStudent.length>0 ){
//         $(".school-diary-notebook, .back-diary-btn, .chat-user-name").hide();
//         $(".short-chat").show();
//         $("#schoolDiaryChatUserListWrapper").html(schoolDiaryUserListing(CHAT_LIST));
//     }else{
//         // if(nav != null && nav != undefined && nav != "back" && nav == ""){
//         //     $(".school-diary-notebook, .back-diary-btn, .chat-user-name").show();
//         //     $(".short-chat").hide();
//         //     $(".school-diary-notebook").html(getParentSchoolDiaryEmptyState());
//         // }else{
//         //     $(".school-diary-notebook, .back-diary-btn, .chat-user-name").hide();
//         //     $(".short-chat").show();
//         // }
//         if(SCHOOL_DIARY_INITIATES_ROLE && filterStudent.length == 0){
//             $(".school-diary-notebook, .back-diary-btn, .chat-user-name").hide();
//             $(".short-chat").show();
//         }else{
//             if(USER_ROLE == "PARENT"){
//                 $("#gradeDropDown, #studentDropDown").val(ACTIVE_STUDENT_ID).trigger("change"); 
//             }
            
//             $(".school-diary-notebook").html(getParentSchoolDiaryEmptyState());
//             $(".school-diary-notebook, .back-diary-btn, .chat-user-name").show();
//             $(".short-chat").hide();
//         }
//     }
// }


// async function getChatUserListRecodrs(){
//     if(USER_ROLE == "PARENT"){
//         var studentUserId = (typeof PARENT_DIARY_ACTIVE_STUDENT_ID !== "undefined" && PARENT_DIARY_ACTIVE_STUDENT_ID) ? PARENT_DIARY_ACTIVE_STUDENT_ID : ((typeof ACTIVE_STUDENT_ID !== "undefined" && ACTIVE_STUDENT_ID) ? ACTIVE_STUDENT_ID : null);
//         var payload = {sessionUserId: USER_ID, page:"0",size:"20",unreadOnly:"false"};
//         if(studentUserId){
//             payload.studentUserId = studentUserId;
//         }
//     }else{
//         var payload = {sessionUserId: USER_ID, page:"0",size:"20",unreadOnly:"false"};
//     }
//     var ajaxReqDetails = {
//         method: "POST",
//         url: APP_BASE_URL +  "api/diary/thread/my-list",
//         body: payload,
//         global: false,
//         showMessage: false,
//         onFaildResolved: true,
//         onSuccessResolved: true
//     }
//     return await callCommonAjax(ajaxReqDetails);
// }

async function getChatUserList(flag){
    var teacherCount = 0;
    var schoolCount = 0;
    $("#no-chat-available").remove();
    $("#schoolDiaryChatUserListWrapper").html(schoolDiaryUserListSkeletonContent())
    $(".school-diary-notebook, .back-diary-btn, .chat-user-name").hide();
    CHAT_LIST_PAGE = 0;
    CHAT_LIST_SIZE = 20;
    CHAT_LIST_HAS_MORE = true;
    var chatWith = $("#chatWith").val();
    try {
        if(flag){
            $("#chat-loader").show();   // 🔥 SHOW before API
            CHAT_LIST = await getChatUserListRecodrs(CHAT_LIST_PAGE, CHAT_LIST_SIZE);
        }

        let threads = CHAT_LIST?.details?.threads || [];

        if(USER_ROLE == "PARENT" || USER_ROLE == "STUDENT"){
            USER_ROLE == "STUDENT" ? (ACTIVE_STUDENT_ID = USER_ID) : ACTIVE_STUDENT_ID
            threads = threads.filter(item => 
                String(item.studentUserId) == ACTIVE_STUDENT_ID
            );
            teacherCount = threads.filter(item => item.chatWithRole === "TEACHER").length;
            schoolCount  = threads.filter(item => item.chatWithRole === "SCHOOL").length;

        }
        if(threads.length > 0){
            $(".short-chat").show();
            $("#schoolDiaryChatUserListWrapper").html(schoolDiaryUserListing({details:{threads}}));
            if(USER_ROLE == "PARENT" || USER_ROLE == "STUDENT"){
                if($("#no-chat-available").length<1 && ((teacherCount == "0" && chatWith == "TEACHER") || (schoolCount == "0" && chatWith == "SCHOOL"))){
                    $(".user-list-body ul").before(`<h6 class="font-weight-semi-bold text-center" id="no-chat-available">No recent diary entries available with ${chatWith.toLowerCase()}</h6>`);
                }
                $("#schoolDiaryChatUserListWrapper li").hide();
                var userId;
                USER_ROLE == "STUDENT" ? userId = USER_ID : userId = $("#studentDropDown").val();
                $("#schoolDiaryChatUserListWrapper li[id*='userid-" + userId + "'].parent-chat-with-" + chatWith).show(); 
            }
            CHAT_LIST_PAGE++;
            CHAT_LIST_SIZE = 5; // next scroll me 5
        }else{
            if(USER_ROLE == "PARENT" || USER_ROLE == "STUDENT" && $("#no-chat-available").length<1 && (teacherCount == "0" || schoolCount == "0")){
                $(".user-list-body ul").before(`<h6 class="font-weight-semi-bold text-center" id="no-chat-available">No recent diary entries available with ${chatWith.toLowerCase()}</h6>`);
            }
            if(SCHOOL_DIARY_INITIATES_ROLE){
                $(".user-list-body ul").before(`<h6 class="font-weight-semi-bold text-center" id="no-chat-available">No recent diary entries available</h6>`);
            }
            $(".short-chat").show();
            $(".chat-list-skeleton").hide();
        }

    } catch(e){
        console.error("Error loading chat list", e);
    } finally {
        $("#chat-loader").hide();   // 🔥 ALWAYS HIDE
    }
}


async function getChatUserListRecodrs(page, size){
    if(USER_ROLE == "PARENT"){
        var studentUserId = (typeof PARENT_DIARY_ACTIVE_STUDENT_ID !== "undefined" && PARENT_DIARY_ACTIVE_STUDENT_ID) 
            ? PARENT_DIARY_ACTIVE_STUDENT_ID 
            : ((typeof ACTIVE_STUDENT_ID !== "undefined" && ACTIVE_STUDENT_ID) ? ACTIVE_STUDENT_ID : null);

        var payload = {
            sessionUserId: USER_ID,
            page: page.toString(),
            size: size.toString(),
            unreadOnly: "false"
        };

        if(studentUserId){
            payload.studentUserId = studentUserId;
        }
    }else{
        var payload = {
            sessionUserId: USER_ID,
            page: page.toString(),
            size: size.toString(),
            unreadOnly: "false"
        };
    }

    return await callCommonAjax({
        method: "POST",
        url: APP_BASE_URL +  "api/diary/thread/my-list",
        body: payload,
        global: false,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    });
}

function parentSchoolDiarySetActiveStudentThumb(studentUserId) {
    PARENT_DIARY_ACTIVE_STUDENT_ID = studentUserId;
    $(".student-thumb").removeClass("active active-student");
    $(".student-" + studentUserId).addClass("active active-student");
}




function parentSchoolDiaryFetchEntries(studentUserId) {
    var payload = {
        userId: USER_ID + "",
        studentUserId: studentUserId + ""
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/parent/student-diary",
        body: getFinalValue(payload),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return callCommonAjax(ajaxReqDetails);
}



function parentSchoolDiaryResolveEntries(response) {
    if (!response) {
        return [];
    }
    if ($.isArray(response)) {
        return response;
    }
    if ($.isArray(response.data)) {
        return response.data;
    }
    if (response.details && $.isArray(response.details.diaryEntries)) {
        return response.details.diaryEntries;
    }
    return [];
}

async function createUserDiary(userId) {
    var message = $(".school-diary-reply-input").val();
    if (!message || $.trim(message) === "") {
        showMessageTheme2(0, "Message is required", "", true);
        return;
    }
    var senderName = (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME) ? USER_FULL_NAME : "You";
    var createdAt = new Date().toISOString();
    var localEntry = {
        id: "local-" + Date.now(),
        message: message,
        createdAt: createdAt,
        senderRole: USER_ROLE || "PARENT",
        senderName: senderName,
        // mentions: mentions
    };
    $("#schoolDiaryDiv .school-diary-notebook .school-diary-item-editor").before(getParentSchoolDiaryReplyCard(localEntry, null));
    LATEST_CHAT_FLAG=true;
    $(".school-diary-reply-input").val("").attr("data-user-selected-id", "");
    $(".mention-suggestion-box").addClass("d-none");
    $(".empty-chat, .back-diary-btn").hide();
    try{
        var payload = {sessionUserId: USER_ID, studentUserId: userId, message: message};
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + "api/diary/thread/create",
            body: payload,
            global: false,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        }
        var response = await callCommonAjax(ajaxReqDetails);
        if (response && response.status && response.status !== "SUCCESS") {
            showMessageTheme2(0, response.message || "Unable to submit reply", "", true);
        }else{
            var serverMsgId =
                response && response.details && response.details.message && response.details.message.id ?
                    response.details.message.id :
                    (response && response.details && response.details.messages && response.details.messages.id ? response.details.messages.id : null);
            if(serverMsgId){
                LAST_MSG_ID = serverMsgId;
            }
            var sendWrapper =
                `<div class="input-group">
                    <textarea class="form-control school-diary-reply-input" id="diaryReplyText${response.details.threadId}" onkeydown="enterPressSubmitMsg(this, \'${response.details.threadId}\', event)" placeholder="Write your response…" rows="1" data-threadId="${response.details.threadId}"></textarea>
                    <div class="p-0 mx-2 cursor rounded-circle circle-btn bg-primary" id="diaryReplyBtn${response.details.threadId}" onclick="schoolDiarySubmitReply(\'${response.details.threadId}\')">
                        <i class="fa fa-paper-plane text-white"></i>
                    </div>
                    <div class="mention-suggestion-box d-none"></div>
                </div>`;
            $(".school-diary-item-editor").html(sendWrapper);
            $(".school-diary-reply-input").css({"height":"50px"});
            updateChatUserList();
            $(".school-diary-notebook").attr("data-open-chat", response.details.threadId);
            $(".back-diary-btn").attr("data-thread-id", response.details.threadId).show();
        }
    } catch (e) {
        console.error(e.message)
        showMessageTheme2(0, "Unable to submit reply", "", true);
    } finally {
        // $(btnSelector).prop("disabled", false).text("Send");
    }
}


// async function updateChatUserList(){
//     CHAT_LIST =  await getChatUserListRecodrs();
//     if(CHAT_LIST != null && CHAT_LIST != undefined && CHAT_LIST != ""){
//         $("#schoolDiaryChatUserListWrapper").html(schoolDiaryUserListing(CHAT_LIST));
//     }
// }

async function updateChatUserList(){
    CHAT_LIST_PAGE = 0;
    CHAT_LIST_SIZE = 20;
    CHAT_LIST_HAS_MORE = true;

    CHAT_LIST = await getChatUserListRecodrs(CHAT_LIST_PAGE, CHAT_LIST_SIZE);

    if(CHAT_LIST){
        $("#schoolDiaryChatUserListWrapper").html(schoolDiaryUserListing(CHAT_LIST));
        CHAT_LIST_PAGE++;
        CHAT_LIST_SIZE = 5;
    }
}

async function schoolDiarySubmitReply(threadId) {
    var textBoxId = "#" + "diaryReplyText" + threadId;
    var message = $(textBoxId).val();
    if (!message || $.trim(message) === "") {
        showMessageTheme2(0, "Reply message is required", "", true);
        return;
    }
    var mentionedIdsRaw = $(textBoxId).attr("data-user-selected-id") || "";
    var mentionedUserIdsList = mentionedIdsRaw ? mentionedIdsRaw.split(",") : [];
    var mentionList = $.isArray(MENTION_LIST) ? MENTION_LIST : [];
    var mentions = mentionList.filter(function(user){
        return mentionedUserIdsList.includes(String(user.userId));
    });

    // var senderName = (typeof USER_FULL_NAME !== "undefined" && USER_FULL_NAME) ? USER_FULL_NAME : "You";
    // var createdAt = new Date().toISOString();
    // var localEntry = {
    //     id: "local-" + Date.now(),
    //     message: message,
    //     createdAt: createdAt,
    //     senderRole: USER_ROLE || "PARENT",
    //     senderName: senderName,
    //     mentions: mentions
    // };
    // if (SCHOOL_DIARY_ACTIVE_CHAT && SCHOOL_DIARY_ACTIVE_CHAT.details) {
    //     var messages = SCHOOL_DIARY_ACTIVE_CHAT.details.messages || [];
    //     var lastTeacher = null;
    //     for (var i = messages.length - 1; i >= 0; i--) {
    //         if (messages[i].senderRole === "TEACHER") {
    //             lastTeacher = messages[i];
    //             break;
    //         }
    //     }
    //     if (lastTeacher && lastTeacher.id) {
    //         localEntry.replyToMessageId = lastTeacher.id;
    //     }
    //     messages.push(localEntry);
    //     SCHOOL_DIARY_ACTIVE_CHAT.details.messages = messages;
    //     SCHOOL_DIARY_ACTIVE_CHAT.details.threadId = SCHOOL_DIARY_ACTIVE_CHAT.details.threadId || threadId;
    //     $("#schoolDiaryDiv .school-diary-notebook .school-diary-item-editor").before(getParentSchoolDiaryReplyCard(localEntry, lastTeacher));
    // } else {
    //     $("#schoolDiaryDiv .school-diary-notebook .school-diary-item-editor").before(getParentSchoolDiaryReplyCard(localEntry, null));
    // }
    $("#schoolDiaryDiv .school-diary-notebook .school-diary-item-editor").before(`<div class="page-title-icon msg-skeleton skeleton float-right" style="max-width:450px;width:100%; height:220px;"></div>`);
    
    LATEST_CHAT_FLAG = true;
    $('.school-diary-notebook').scrollTop($('.school-diary-notebook')[0].scrollHeight);
    $(textBoxId).val("").attr("data-user-selected-id", "");
    $(".mention-suggestion-box").addClass("d-none");

    try {
        var payload = {sessionUserId: USER_ID, threadId: threadId, message: message, mentionedUserIds: mentionedUserIdsList};
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + "api/diary/message/reply",
            body: payload,
            global: false,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        }
        var response = await callCommonAjax(ajaxReqDetails);
        if (response && response.status && response.status !== "SUCCESS") {
            showMessageTheme2(0, response.message || "Unable to submit reply", "", true);
            $(".msg-skeleton").remove();
        }else{
            suggestionList(threadId,false);
            var serverMsgId =
                response && response.details && response.details.message && response.details.message.id ?
                    response.details.message.id :
                    (response && response.details && response.details.messages && response.details.messages.id ? response.details.messages.id : null);
                    $(".msg-skeleton").remove();
                    $("#schoolDiaryDiv .school-diary-notebook .school-diary-item-editor").before(getParentSchoolDiaryReplyCard(response.details.messages, null))
                    $('.school-diary-notebook').scrollTop($('.school-diary-notebook')[0].scrollHeight);
            if(serverMsgId){
                LAST_MSG_ID = serverMsgId;
            }
            $(".school-diary-reply-input").css({"height":"50px"});
            // if(response.details.messages.senderRole == "PARENT"){
            //     var data = JSON.parse($("#input-chat-status-alok-iitian").val());
            //     data = data.map(item => 
            //         item.chatId == response.details.messages.threadId ? {...item, status: true} : item
            //     );
            //     $("#input-chat-status-alok-iitian").val(JSON.stringify(data));
            // }
        }
    } catch (e) {
        showMessageTheme2(0, "Unable to submit reply", "", true);
    } finally {
        // $(btnSelector).prop("disabled", false).text("Send");
    }
}

function parentSchoolDiaryFormatDate(dateValue, timezone) {
    if (!dateValue) {
        return "-";
    }
    if (typeof moment === "undefined") {
        return dateValue;
    }
    return convertDatetimeWithFormat(dateValue, timezone, getSystemTimezone(), DISPLAY_DATETIME_FORMATTER);;
}

function parentSchoolDiaryEscapeHtml(rawText) {
    return $("<div/>").text(rawText == null ? "" : rawText).html();
}

async function renderSchoolDaiaryBtnCount(studentUserId){
    var unreadChatCount = await getUnreadChatCount();
    var unreadThreadCount = unreadChatCount && unreadChatCount.details ? unreadChatCount.details.unreadThreadCount : null;
    if(unreadThreadCount == null){
        unreadThreadCount = 0;
    }
    $("#schoolDiaryBadge, .schoolDiaryBadge").text(unreadChatCount.details.unreadMessageCount).removeClass("d-none");
    if ($("#parentSchoolDiaryStyles").length === 0) {
        $("head").append(parentSchoolDiaryGetStyles());
    }
    if(USER_ROLE == "TEACHER"){
        var studentAndGrade = await getAssignGradeAndStudent();
        STUDENT_ARRAY = studentAndGrade.details.assignedStudents;
        $("#schoolDiaryDiv").html(getParentSchoolDiaryEntriesHtml(studentAndGrade));
    }else if(USER_ROLE == "PARENT"){
        $("#schoolDiaryDiv").html(getParentSchoolDiaryEntriesHtml());
        var html=`<option value="">Select Student</option>`;
        $.each(STUDENT_LIST.studentBasicDetails, function(i,v){
            html+=`<option value="${v.userId}">${v.studentName}</option>`;
        });
        $("#studentDropDown").html(html);
    }else{
        $("#schoolDiaryDiv").html(getParentSchoolDiaryEntriesHtml());
    }
    
    $("head").append(
        `<script>
        var k = 0;
            window.addEventListener("message", function (event) {
                if (event.data?.type !== "diary-bridge-update") return;

                var countInput = document.getElementById("input-count-alok-iitian");
                var lastMessageInput = document.getElementById("input-last-message-id-alok-iitian");
                var chatIdInput = document.getElementById("input-chat-id-alok-iitian");
                const chatStatusInput = document.getElementById("input-chat-status-alok-iitian");
                if (countInput) {
                    countInput.value = event.data.count || "0";
                    countInput.dispatchEvent(new Event("input", { bubbles: true }));
                    countInput.dispatchEvent(new Event("change", { bubbles: true }));
                }
                if (chatIdInput){
                    chatIdInput.value = event.data.chatId || "0";
                    chatIdInput.dispatchEvent(new Event("input", { bubbles: true }));
                    chatIdInput.dispatchEvent(new Event("change", { bubbles: true }));
                }
                if (lastMessageInput) {
                    lastMessageInput.value = event.data.lastMessageId || "0";
                    lastMessageInput.dispatchEvent(new Event("input", { bubbles: true }));
                    lastMessageInput.dispatchEvent(new Event("change", { bubbles: true }));
                }
                if (chatStatusInput) {
                    chatStatusInput.value = JSON.stringify(event.data.chats) || "";
                    chatStatusInput.dispatchEvent(new Event("input", { bubbles: true }));
                    chatStatusInput.dispatchEvent(new Event("change", { bubbles: true }));
                    CHAT_STATUS = event.data.chats || "";
                }
            });
            </script>`
    )
    var isLoading = false;

    $(".school-diary-notebook").on("scroll", async function () {
        if ($(this).scrollTop() === 0 && !isLoading) {
            isLoading = true;
            var threadId = $(this).attr("data-open-chat");
            var userName = $("#chatUserName").text();
            await loadOldMessages(threadId, userName);
            isLoading = false;
        }
    });

    $(document).on("input", ".school-diary-reply-input", function () {
        this.style.height = "auto"; // reset
        this.style.height = this.scrollHeight + "px"; // expand
    });

    $(document).on("input", ".school-diary-reply-input", function () {
        this.style.height = "auto";
        if (this.scrollHeight <= 80) {
            this.style.height = this.scrollHeight + "px";
            this.style.overflowY = "hidden";
        } else {
            this.style.height = "80px";
            this.style.overflowY = "auto";
        }
        // 🔥 dynamic bottom padding adjust
        var notebook = $(this).closest(".school-diary-notebook");
        var editorHeight = $(this).closest(".school-diary-item-editor").outerHeight();
        notebook.css("padding-bottom", editorHeight + "px");
    });
    // $(document).on("keydown", ".school-diary-reply-input", function(e) {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault();
    //         if($(this).hasClass("create-chat")){
    //             var userId = $(this).attr("data-userId");
    //             createUserDiary(userId);
    //         }else{
    //             var threadId = $(this).attr("data-threadId");
    //             schoolDiarySubmitReply(threadId);
    //         }
    //     }
    // });
    if(USER_ROLE == "PARENT"){
        $("#studentDropDown").val(studentUserId).trigger("change");
    }
    $(window).resize(function(){
        $(".school-diary-notebook").css({"height": "calc(100vh - " + $(".school-diary-head").outerHeight() + "px)"});
    });
    $("#gradeDropDown").select2({
        theme:"bootstrap4"
    });
    $("#studentDropDown, #chatWith").select2({
        theme:"bootstrap4"
    });
    // Exact WhatsApp Web style floating date
    let scrollTimeout = null;
    let animationFrame = null;
    let currentDate = "";


    // Setup initial styles
    $("#floating-date").css({
        'transition': 'opacity 0.15s ease-out',
        'opacity': '0',
        'will-change': 'opacity'
    });

    let hideTimeout = null;

    function updateDateLabel() {
        let container = $(".school-diary-notebook")[0];
        let items = $(".school-diary-item").not(".school-diary-item-editor");
        let foundDate = null;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let rect = item.getBoundingClientRect();
            let containerRect = container.getBoundingClientRect();

            if (rect.top <= containerRect.top + 60) {
                let fullText = $(item).find("small.text-muted").text();
                let cleanDate = fullText.replace(/\d{2}:\d{2}.*$/, "").trim();
                let dateObj = new Date(cleanDate);
                foundDate = formatDiaryDate(dateObj);
                break;
            }
        }

        // ✅ Agar date mil gayi → show immediately
        if (foundDate && foundDate !== currentDate) {
            currentDate = foundDate;

            // cancel any pending hide
            if (hideTimeout) {
                clearTimeout(hideTimeout);
                hideTimeout = null;
            }

            $("#floating-date").text(foundDate);

            if ($("#floating-date").css('opacity') !== '1') {
                $("#floating-date").css({
                    'opacity': '1',
                    'display': 'block'
                });
            }
        }

        // ❌ Agar date nahi mili → delay hide (2 sec)
        else if (!foundDate && currentDate) {

            // clear previous timeout
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }

            hideTimeout = setTimeout(() => {
                $("#floating-date").css({
                    'opacity': '0'
                });

                // optional: display none after fade
                setTimeout(() => {
                    $("#floating-date").css('display', 'none');
                }, 300); // match CSS transition time

                currentDate = "";
            }, 2000); // ⏳ 2 seconds delay
        }
    }

    // Debounced scroll handler
    $(".school-diary-notebook").on("scroll", function() {
        // Use requestAnimationFrame for smooth 60fps updates
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        
        animationFrame = requestAnimationFrame(() => {
            updateDateLabel();
            
            // Clear previous timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            // Hide after scrolling stops
            scrollTimeout = setTimeout(() => {
                $("#floating-date").css('opacity', '0');
                currentDate = "";
                animationFrame = null;
            }, 150);
        });
    });

    // Initial update
    updateDateLabel();

    if(SCHOOL_DIARY_ROLE.includes(USER_ROLE)){
        initializeSchoolTypeahead('recommendedTeacherlistForm','courseName');
        $('#schoolDiaryTypeahead').on('input', function () {
            if ($(this).val().trim() !== "") {
                $(this).addClass('has-value');
                $(this).closest('.twitter-typeahead').find('.tt-hint').css({"background":"none"});
            } else {
                $(this).removeClass('has-value');
                $(this).closest('.twitter-typeahead').find('.tt-hint').css({"background":"${PATH_FOLDER_IMAGE2}search_icon_40x40.png"});
            }
        });
    }

    $(".user-list-wrapper").off("scroll").on("scroll", async function () {

        let chat_list_container = this;

        let isNearBottom = chat_list_container.scrollTop + chat_list_container.clientHeight >= chat_list_container.scrollHeight - 50;

        if(isNearBottom){

            if(CHAT_LIST_LOADING || !CHAT_LIST_HAS_MORE) return;

            CHAT_LIST_LOADING = true;

            try {
                $("#chat-loader").show(); // 🔥 SHOW

                let resp = await getChatUserListRecodrs(CHAT_LIST_PAGE, CHAT_LIST_SIZE);

                let newThreads = resp?.details?.threads || [];

                if(newThreads.length === 0){
                    CHAT_LIST_HAS_MORE = false;
                }else{
                    let html = schoolDiaryUserListing({details:{threads:newThreads}});
                    $("#schoolDiaryChatUserListWrapper").append(html);
                    CHAT_LIST_PAGE++;
                }

            } catch(e){
                console.error("Scroll load error", e);
            } finally {
                $("#chat-loader").hide(); // 🔥 ALWAYS HIDE
                CHAT_LIST_LOADING = false;
            }
        }
    });
    
}

function initializeSchoolTypeahead(formId, eleId){
	$('#schoolDiaryTypeahead').typeahead(
		{
			hint: true,
			highlight: true,
			minLength: 3
      	},
	  	{
			name: 'students',
			//limit: 10,
			source: function(query, syncResults, asyncResults) {
				var data = {
					searchWord: query,
					userId: USER_ID,
					schoolId: SCHOOL_ID
				};
				return $.ajax({
					url: getURLForHTML("dashboard", "get-all-student-list-for-diary?payload=" + encode(JSON.stringify(data))),
					global: false,
					success: function(data) {
						data = JSON.parse(data);
						if(data.studentList) {
							var matches = [];
							$.each(data.studentList, function(index, item) {
								matches.push({
									display: item.studentName,
									studentUserId: item.studentUserId,
									standardId:item.standardId,
									studentStandardId:item.studentStandardId,
                                    standardName:item.standardName,
                                    learningProgram:item.learningProgram,
								});
							});
							asyncResults(matches);
						} else {
							console.warn('No studentList found in response');
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						if (checkonlineOfflineStatus()) {
							return;
						}
						console.error('AJAX error: ' + textStatus + ' : ' + errorThrown);
					}
				});
			},
			display: function(item) {
				return item.display;
			},
		}
	).bind('typeahead:select', function(ev, item) {
        $("#studentUserId").val(item.studentUserId);
        var studentName = item.display;
        studentName = studentName.split(" |")[0];studentName;
        searchChatByStudent("studentUserId", studentName, item.studentUserId, getLearningProgramLabel(item.learningProgram));
        $('#schoolDiaryTypeahead').typeahead('val', '');
        $("#schoolDiaryTypeahead").removeClass("has-value");
    });
}

function enterPressSubmitMsg(el, threadId, event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if ($(el).hasClass("create-chat")) {
            var userId = $(el).attr("data-userId");
            createUserDiary(userId);
        } else {
            schoolDiarySubmitReply(threadId);
        }
    }

}

// async function loadOldMessages(threadId, userName){
//     ++PAGE_NO;
//     var chatDetails = await getMessagesList(threadId, PAGE_NO);
//         SCHOOL_DIARY_ACTIVE_CHAT = chatDetails;
//         var notebook = $("#schoolDiaryDiv .school-diary-notebook");
//         if(chatDetails.details.messages.length>0){
//             notebook.find(".school-diary-item").first().before(chatDetailsConent(chatDetails, userName));
//         }

//     // $("#schoolDiaryDiv .school-diary-notebook").html(chatDetailsConent(chatDetails, userName));
// }

async function loadOldMessages(threadId, userName){ 
    ++PAGE_NO;
    var notebook = $("#schoolDiaryDiv .school-diary-notebook");
    // 🟡 current scroll height save karo
    var oldScrollHeight = notebook[0].scrollHeight;
    // API call
    if(threadId != null && threadId != undefined && threadId != ""){
        var chatDetails = await getMessagesList(threadId, PAGE_NO, false);
        //console.log(`threadId-->${threadId}`, chatDetails);
        var html = chatDetailsConent(chatDetails, userName, true);
        // 🟡 top pe add karo (first item se pehle)
        if(chatDetails.details.messages.length>0){
            notebook.find(".school-diary-item").first().before(html);
            // 🟡 new height calculate karo
            var newScrollHeight = notebook[0].scrollHeight;
            // 🟡 scroll ko adjust karo (ye hi WhatsApp trick hai 🚀)
            notebook.scrollTop(newScrollHeight - oldScrollHeight);
        }
    }
}

async function gotoChat(threadId, chatStatus, userName, studentUserId){
    if(chatStatus){
        var chatDetails = await getMessagesList(threadId, 0, true, studentUserId);
        SCHOOL_DIARY_ACTIVE_CHAT = chatDetails;
        renderSchoolDiary(chatDetails, chatStatus, userName, threadId);
        $(".back-diary-btn").attr("data-thread-id", threadId);
        await markReadSchoolDairy(threadId);
        await suggestionList(threadId, true);
        await refreshDiaryUserListingBadges(true);
        $(".school-diary-notebook, .back-diary-btn, .chat-user-name").show();
        $(".short-chat").hide();
    }else{
        renderSchoolDiary('', chatStatus, userName, threadId);
        $(".school-diary-notebook, .back-diary-btn, .chat-user-name").show();
        $(".short-chat").hide();
    }
    $('.school-diary-notebook').scrollTop($('.school-diary-notebook')[0].scrollHeight);
    $(".school-diary-notebook").css({"height": "calc(100vh - " + $(".school-diary-head").outerHeight() + "px)"});
    
}

async function markReadSchoolDairy(threadId){
    var payload = {sessionUserId: USER_ID, threadId:threadId};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL +  "api/diary/thread/mark-read",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    callCommonAjax(ajaxReqDetails);
}

async function getMessagesList(threadId, pageNo, globalFlag, studentUserId){
    if(USER_ROLE == "PARENT"){
        var payload = {sessionUserId: USER_ID, threadId:threadId, page:pageNo,size:"20", studentUserId:studentUserId};
    }else{
        var payload = {sessionUserId: USER_ID, threadId:threadId, page:pageNo,size:"20"};
    }
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL +  "api/diary/thread/messages",
        body: payload,
        global: globalFlag,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    return await callCommonAjax(ajaxReqDetails);
}

async function renderSchoolDiary(data, chatStatus, userName, threadId) {
    SCHOOL_DIARY_ACTIVE_CHAT = data;
    
    if(!data || !data.details || data.details.messages.length<1 && !chatStatus){
        $("#schoolDiaryDiv .school-diary-notebook").html(getParentSchoolDiaryEmptyState(PARENT_DIARY_ACTIVE_STUDENT_ID)+(SCHOOL_DIARY_INITIATES_ROLE ? getParentSchoolDiaryReplyEditor('', PARENT_DIARY_ACTIVE_STUDENT_ID):""));
        var userNameLabel = `<label id="chatUserName">${userName}</label>`;
        $(".chat-user-name").html(`- ${userNameLabel}`);
    }else{
        $("#schoolDiaryDiv .school-diary-notebook").attr("data-open-chat", threadId);
        $("#schoolDiaryDiv .school-diary-notebook").html(`<div id="floating-date" class="floating-date" style="display:none"></div>`+chatDetailsConent(data, userName, false, data.details.threadStatus));
        var messagesList = data?.details?.messages || [];
        var lastMessage = messagesList[messagesList.length - 1];
        if(SCHOOL_DIARY_INITIATES_ROLE && data.details.threadStatus != "CLOSED" && lastMessage.senderRole == "PARENT"){
            $("#diaryReplyBtn"+threadId).after(`<div class="p-0 mx-2 cursor rounded-circle circle-btn bg-success" id="acknowledgeEndCloseBtn" style="display:none"  id="acknowledgeEndCloseBtn${threadId}" data-toggle="tooltip" title="Acknowledge & Close"  onclick="acknowledgeCloseChat(\'${threadId}\')">
                <i class="fa fa-thumbs-up text-white"></i>
            </div>`);
            $("#acknowledgeEndCloseBtn").show();
            $('[data-toggle="tooltip"]').tooltip();
        }
        if(USER_ROLE == "PARENT" && data.details.threadStatus == "CLOSED"){
            if($(".chat-session-ended").length<1){
                $("#schoolDiaryDiv .school-diary-notebook .school-diary-item").last().after(`
                    <div class="alert alert-warning chat-session-ended fade show" role="alert">
                        <p class="mb-0 text-center">This conversation has been closed</p>
                    </div>
                `);
            }
        }else{
            if($(".chat-session-ended").length>0){
                $(".chat-session-ended").remove();
            }
        }
    }
}

function backSchoolChatList(src){
    if(SCHOOL_DIARY_INITIATES_ROLE){
        $("#gradeDropDown, #studentDropDown").val('').trigger("change");
    }
    $(".school-diary-notebook, .back-diary-btn, .chat-user-name").hide();
    $(".short-chat").show();
    $("#schoolDiaryChatUserListWrapper li").show();
    
    if(LATEST_CHAT_FLAG){
        var threadId = $(src).attr("data-thread-id");
        if(SCHOOL_DIARY_INITIATES_ROLE){
            if($(".chat_list_ul .list-group-item").length>1){
                var selector = "#schoolDiaryChatUserListWrapper li[id*='chat-list-" + threadId + "']";
                var latestChatItem = $(selector).prop("outerHTML");
                $(selector).remove();
                $(".chat_list_ul .list-group-item").first().before(latestChatItem);
            }
        }
        var last = $('.school-diary-item-parent .safeMessage').last().clone();
        // remove mention span
        // last.find('.text-success').remove();
        var message = last.text().trim();
        $(".school-diary-unread-msg-"+threadId).text(message);
        LATEST_CHAT_FLAG=false;
    }
    PAGE_NO=0;
    if(USER_ROLE == "PARENT" && CHAT_LIST.details.threads.length<1){
        $("#schoolDiaryChatUserListWrapper").html("");   
    }else if((USER_ROLE == "PARENT" || USER_ROLE == "STUDENT") && CHAT_LIST.details.threads.length>0){
        $("#schoolDiaryChatUserListWrapper li").hide();
        var chatWith = $("#chatWith").val();
        var userId;
        USER_ROLE == "STUDENT" ? userId = USER_ID : userId = $("#studentDropDown").val();
        $("#schoolDiaryChatUserListWrapper li[id*='userid-" + userId + "'].parent-chat-with-" + chatWith).show();        
    }
}

function chatDetailsConent(data, userName, reloadFlag, replyMsgFlag){
    var html=``;
    if (!data || !data.details || !$.isArray(data.details.messages) || !data.details.messages) {
        return html;
    }
    var timezome = data.details.sourceTimezone;

    var messages = data.details.messages;
    var otherPartyName = "";

    $.each(messages, function (index, entry) {
        var isOutgoing = parentSchoolDiaryIsOutgoing(entry);
        if (!isOutgoing && !otherPartyName) {
            otherPartyName = entry.senderName || entry.teacherName || "";
        }
        if (isOutgoing && !otherPartyName) {
            var mentionNames = parentSchoolDiaryResolveReceiverNames(entry);
            if (mentionNames.length > 0) {
                otherPartyName = mentionNames[0];
            }
        }

        if (isOutgoing) {
            html += getParentSchoolDiaryReplyCard(entry, null, timezome);
        } else {
            html += getParentSchoolDiaryTeacherCard(entry, '', timezome, data.details.courseName);
        }
        if(data.details.messages.length == index+1){
            LAST_MSG_ID=entry.id
        }
    });
    if (!otherPartyName) {
        otherPartyName = parentSchoolDiaryResolveOtherRoleLabel();
    }
    if (otherPartyName) {
        var userNameLabel = `<label id="chatUserName">${userName}</label>`;
        $(".chat-user-name").html(` - ${userNameLabel}`);
    }
    if(!reloadFlag && USER_ROLE != "STUDENT"){
        if((replyMsgFlag != "CLOSED" && USER_ROLE == "PARENT") || SCHOOL_DIARY_INITIATES_ROLE){
            html += getParentSchoolDiaryReplyEditor(data.details.threadId);
        }
    }
    return html;
}


async function suggestionList(threadId, globalFlag) {
    var payload = { sessionUserId: USER_ID, threadId: threadId };

    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "api/diary/thread/mention-users",
        body: payload,
        global: globalFlag,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var mentionResp = await callCommonAjax(ajaxReqDetails);
    var details = mentionResp?.details || [];
    MENTION_LIST = details.filter(user => {
        if (USER_ROLE === "PARENT") return user.roleType === PARENT_MENTION_ROLE.includes(user.roleType);
        if (USER_ROLE === "TEACHER") return TEACHER_MENTION_ROLE.includes(user.roleType);
        if (USER_ROLE === "DIRECTOR" || USER_ROLE === "SCHOOL" || USER_ROLE === "ADMIN") return SCHOOL_MENTION_ROLE.includes(user.roleType);
        return true;
    });
    var suggestionBox = $(".mention-suggestion-box");
    function escapeRegex(value) {
        return (value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    function removePartialMention(text, userName) {
        var tokens = (userName || "").trim().split(/\s+/).filter(Boolean);
        if (tokens.length === 0) {
            return text;
        }
        var firstToken = escapeRegex(tokens[0]);
        var maxExtra = tokens.length - 1;
        var pattern = "@"+ firstToken + (maxExtra > 0 ? "(?:\\s+\\S+){0," + maxExtra + "}" : "");
        var regex = new RegExp("(^|\\s)" + pattern + "(?=\\s|$|[.,!?])", "g");
        return text.replace(regex, "$1").replace(/\s{2,}/g, " ");
    }

    $(".school-diary-reply-input")
        .off("keyup.diaryMention input.diaryMention")
        .on("keyup.diaryMention input.diaryMention", function(e) {
        var dairyInput = $(this);
        var text = String(dairyInput.val() || "");
        var hadTrailingSpace = text.endsWith(" ");

        // Get last word for suggestions
        var words = text.split(/\s+/);
        var lastWord = words[words.length - 1];

        // ---------- SHOW SUGGESTION ----------
        if (lastWord.startsWith("@")) {
            var keyword = lastWord.substring(1).toLowerCase();

            var filtered = MENTION_LIST.filter(u =>
                u.userName.toLowerCase().includes(keyword)
            );

            if (filtered.length > 0) {
                var html = "";
                filtered.forEach(function(u) {
                    html += `<div class="mention-item" data-id="${u.userId}" data-name="${u.userName}" onclick="chooseMentionUser(this)">@${u.userName}</div>`;
                });

                suggestionBox.html(html).removeClass("d-none");
            } else {
                suggestionBox.addClass("d-none");
            }
        } else {
            suggestionBox.addClass("d-none");
        }

        // ---------- STRICT MENTION CHECK ----------
        var existingIds = dairyInput.attr("data-user-selected-id") || "";
        var idArray = existingIds ? existingIds.split(",") : [];
        var updatedIds = [];
        var changed = false;

        idArray.forEach(function(id) {
            var user = MENTION_LIST.find(u => String(u.userId) === String(id));
            if (!user) {
                return;
            }
            var mention = "@" + user.userName;
            var mentionRegex = new RegExp("(^|\\s)" + escapeRegex(mention) + "(?=\\s|$|[.,!?])", "g");
            if (mentionRegex.test(text)) {
                updatedIds.push(id);
            } else {
                text = removePartialMention(text, user.userName);
                changed = true;
            }
        });

        if (changed) {
            text = text.replace(/\s+/g, " ").trim();
            if (hadTrailingSpace) {
                text += " ";
            }
            dairyInput.val(text);
        }

        dairyInput.attr("data-user-selected-id", updatedIds.join(","));
    });
}


function chooseMentionUser(src) {
    var dairyInput = $(".school-diary-reply-input");
    var suggestionBox = $(".mention-suggestion-box");

    var name = $(src).data("name");
    var userId = $(src).data("id");

    var text = String(dairyInput.val() || "");
    var words = text.split(/\s+/);

    // Remove the last "@" word and replace with full mention
    words.pop();
    words.push("@" + name);

    dairyInput.val(words.join(" ") + " ");

    var existingIds = dairyInput.attr("data-user-selected-id") || "";
    var idArray = existingIds ? existingIds.split(",") : [];

    if (!idArray.includes(String(userId))) {
        idArray.push(userId);
    }

    dairyInput.attr("data-user-selected-id", idArray.join(","));

    suggestionBox.addClass("d-none");
    dairyInput.focus();
}

function filterStudentByGrade(eleId){
    var standardId = $("#"+eleId).val();
    if(standardId != null && standardId != undefined && standardId != ""){
        var html=`<option value="">Select Student</option>`;
        var filterStudent = STUDENT_ARRAY.filter(function(item){
            return String(item.standardId) == standardId;
        })
        $.each(filterStudent, function(i,v){
            html+=`<option value="${v.userId}">${v.learningProgram != null && v.learningProgram != undefined && v.learningProgram != "" ? getLearningProgramLabel(v.learningProgram) +" | ":""}${v.studentName}  ${v.rollNo != null && v.rollNo != undefined && v.rollNo != "" ? ` | ${v.rollNo}`:""}</option>`
        });
        $("#studentDropDown").html(html);
        $("#studentDropDown").prop("disabled", false);
    }else{
        $("#studentDropDown").prop("disabled", true).val('').trigger("change");
        $("#schoolDiaryChatUserListWrapper li").show();
    }

}

async function searchChatByStudent(eleId, studentName, studentUserId, learningProgram){
    if(SCHOOL_DIARY_ROLE.includes(USER_ROLE)){
        var userId = studentUserId;
        var userName = learningProgram +" | "+studentName;
    }else{
        var userId = $("#"+eleId).val();
        var userName = $("#studentDropDown option:selected").text();
        if(userName != null && userName != undefined && userName != "Select Student" && userName != "" && SCHOOL_DIARY_INITIATES_ROLE){
            var parts = userName.split('|');
            userName = parts[0].trim() + ' | ' + parts[1].trim();
        
        }
    }
    
    if(USER_ROLE == "PARENT" || USER_ROLE == "STUDENT"){
         userName = userName+`'s`;
    }
    if(userId != null && userId != undefined && userId != ""){
        PARENT_DIARY_ACTIVE_STUDENT_ID = userId;
        // check if user exists in list
        if(SCHOOL_DIARY_INITIATES_ROLE){
            var exists = $("#schoolDiaryChatUserListWrapper li[id*='userid-"+userId+"']").length > 0;
            if(exists){
                $("#schoolDiaryChatUserListWrapper li").hide();
                $("#schoolDiaryChatUserListWrapper li[id*='userid-"+userId+"']").show();
            }else{
                gotoChat('', false, userName)
            }
        }else{
            PARENT_DIARY_ACTIVE_STUDENT_ID=userId;
            ACTIVE_STUDENT_ID = PARENT_DIARY_ACTIVE_STUDENT_ID;
            $("#chat-loader").show();
            CHAT_LIST =  await getChatUserListRecodrs(0, 20);
            $("#chat-loader").hide();

            var filterStudent = CHAT_LIST.details.threads.filter(function(item){
                return String(item.studentUserId) == userId;
            });
            if(filterStudent.length>0){
                getChatUserList(false);
                $("#schoolDiaryChatUserListWrapper li").hide();
                if(USER_ROLE == "PARENT"){
                    var chatWith = $("#chatWith").val();
                    $("#schoolDiaryChatUserListWrapper li[id*='userid-" + userId + "'].parent-chat-with-" + chatWith).show();
                }else{
                    $("#schoolDiaryChatUserListWrapper li[id*='userid-" + userId + "']").show();
                }
            }else{
                if(USER_ROLE == "PARENT"){
                    chatFilter('chatWith');
                }else{
                    gotoChat('', false, userName, PARENT_DIARY_ACTIVE_STUDENT_ID)
                }
            }
        }
    }else{
        $("#schoolDiaryChatUserListWrapper").html("");
    }
}
async function checkUnreadMessageCount(src){
    $("#schoolDiaryBadge").text($(src).val());
    if($(src).val()>0){
        if(!$(".school-diary-notebook").is(":visible") && $(".user-list-wrapper").is(":visible") && $("#schoolDiary_side_wrapper").hasClass("settings-open")){
            await refreshDiaryUserListingBadges(true);
        }
    } 
}
async function refreshSchoolDiaryChat(src){
    var threadId = $(src).val();
    if(SCHOOL_DIARY_ACTIVE_CHAT == ""){
        if($(".school-diary-notebook").is(":visible") && !$(".user-list-wrapper").is(":visible") && $("#schoolDiary_side_wrapper").hasClass("settings-open")){
            if($('.school-diary-notebook .empty-chat').length>0){
                var userName = $("#chatUserName").text();
                await gotoChat(threadId, true, userName, $("#studentDropDown").val());
            }else if($(src).val() != "" && threadId == $(".school-diary-notebook").attr("data-open-chat")){
                var userName = $("#chatUserName").text();
                await gotoChat(threadId, true, userName, $("#studentDropDown").val());
            }
        }  
    } 
}
async function showAndHideAcknowledge(src){
    var threadId = $("#input-chat-id-alok-iitian").val();
    if($("#input-chat-status-alok-iitian").val() != null && $("#input-chat-status-alok-iitian").val() != undefined && $("#input-chat-status-alok-iitian").val() != ""){
        if(!CHAT_SESSION_END){
            CHAT_STATUS = JSON.parse($("#input-chat-status-alok-iitian").val());
            if(USER_ROLE == "PARENT"){
                var filterStudent = CHAT_STATUS.filter(function(item){
                    return String(item.chatId) == threadId && item.status  == false;
                });
                if(filterStudent.length>0){
                    if($(".chat-session-ended").length<1){
                        $("#schoolDiaryDiv .school-diary-notebook .school-diary-item-editor").before(`<div class="alert alert-warning fade show chat-session-ended" role="alert">
                            <p class="mb-0 text-center">This conversation has been closed</p>
                        </div>`);    
                    }        
                }
            }
        }
    }
}

async function lastMsgIdUpdated(){
    var threadId = $("#input-chat-id-alok-iitian").val();
    if(SCHOOL_DIARY_ACTIVE_CHAT != null && SCHOOL_DIARY_ACTIVE_CHAT != undefined && SCHOOL_DIARY_ACTIVE_CHAT != ""){
        if($("#input-last-message-id-alok-iitian").val() != LAST_MSG_ID && (SCHOOL_DIARY_ACTIVE_CHAT.details.threadId == threadId || SCHOOL_DIARY_ACTIVE_CHAT.details.threadId == "")){
            if(USER_ROLE == "PARENT"){
                $(".chat-session-ended").remove();
            }
            var userName = $("#chatUserName").text();
            if($(".school-diary-notebook").is(":visible") && !$(".user-list-wrapper").is(":visible") && $("#schoolDiary_side_wrapper").hasClass("settings-open")){
                await gotoChat(threadId, true, userName, $("#studentDropDown").val());
                CHAT_SESSION_END=true;
            }
        }
    }
}

async function acknowledgeCloseChat(threadId, userSesstionID){
    var payload = {sessionUserId: USER_ID, threadId:threadId, status:"CLOSED"};
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL +  "api/diary/thread/close",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true,
    }
    $("#acknowledgeEndCloseBtn").hide();
    var response= await callCommonAjax(ajaxReqDetails);
    
}

function formatDiaryDate(dateInput) {
    const inputDate = new Date(dateInput);
    const today = new Date();

    // reset time
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d2 = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

    const diffTime = d1 - d2;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    if (diffDays < 7) {
        return days[inputDate.getDay()];
    }

    return inputDate.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short"
    });
}

function chatFilter(src){
    var chatWith = $("#"+src).val();
    var userId;
    if(USER_ROLE == "PARENT"){ userId = $("#studentDropDown").val();}else if(USER_ROLE == "STUDENT"){userId = USER_ID}
    $("#schoolDiaryChatUserListWrapper li").hide();
    if($("#schoolDiaryChatUserListWrapper li[id*='userid-" + userId + "'].parent-chat-with-" + chatWith).length>0){
        $("#schoolDiaryChatUserListWrapper li[id*='userid-" + userId + "'].parent-chat-with-" + chatWith).show();
        $("#no-chat-available").remove();
    }else{
        if($("#no-chat-available").length<1){
            $(".user-list-body ul").before(`<h6 class="font-weight-semi-bold text-center" id="no-chat-available">No recent diary entries available with ${chatWith.toLowerCase()}</h6>`);
        }else{
            $("#no-chat-available").remove();
            $(".user-list-body ul").before(`<h6 class="font-weight-semi-bold text-center" id="no-chat-available">No recent diary entries available with ${chatWith.toLowerCase()}</h6>`);
        }
    }
}
