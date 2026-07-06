var GRADUATION_CEREMONY_FILTER_STATE = {
    filterValues: {
        ceremonyTitle: "GRADUATION_CEREMONY_2026"
    }
};
var GRADUATION_CEREMONY_LAST_COMMUNICATIONS = {};

const ALLOW_DISCARD_GRADUATION_CEREMONY_ATTENDEE = getSettingsByTypeAndKey('CONFIGURATION', 'ALLOW_DISCARD_GRADUATION_CEREMONY_ATTENDEE');
var isUserAllowedToDiscardGraduationCeremonyAttendee = false;
try{
    var discardAllowedUserIds = JSON.parse(ALLOW_DISCARD_GRADUATION_CEREMONY_ATTENDEE).data.metaValue.split(",").map(function(id){
        return id.trim();
    });
    isUserAllowedToDiscardGraduationCeremonyAttendee = discardAllowedUserIds.includes(USER_ID.toString());
}catch(e){
    isUserAllowedToDiscardGraduationCeremonyAttendee = false;
}

function resetGraduationCeremonyFilterStateToDefault(){
    GRADUATION_CEREMONY_FILTER_STATE = {
        filterValues: {
            ceremonyTitle: "GRADUATION_CEREMONY_2026"
        }
    };
}

function loadGraduationCeremonyAttendees(){
    ensureDefaultGraduationCeremonyFilters();

    if(typeof refreshCustomFieldState === "function"){
        refreshCustomFieldState($("#graduationCeremonyFilterForm"));
        setTimeout(function(){
            refreshCustomFieldState($("#graduationCeremonyFilterForm"));
        }, 0);
    }

    var request = {
        userId: USER_ID,
        ceremonyTitle: GRADUATION_CEREMONY_FILTER_STATE.filterValues.ceremonyTitle || "",
        name: GRADUATION_CEREMONY_FILTER_STATE.filterValues.name || "",
        email: GRADUATION_CEREMONY_FILTER_STATE.filterValues.email || "",
        country: GRADUATION_CEREMONY_FILTER_STATE.filterValues.country || "",
        attendAs: GRADUATION_CEREMONY_FILTER_STATE.filterValues.attendAs || "",
        membersType: GRADUATION_CEREMONY_FILTER_STATE.filterValues.membersType || "",
        paymentStatus: GRADUATION_CEREMONY_FILTER_STATE.filterValues.paymentStatus || "",
        callbackStatus: GRADUATION_CEREMONY_FILTER_STATE.filterValues.callbackStatus || "",
        phone: GRADUATION_CEREMONY_FILTER_STATE.filterValues.phone || ""
    };

    return $.ajax({
        url: `${APP_BASE_URL}${SCHOOL_UUID}/get-all-ceremony-attendees`,
        type: 'POST',
        cache: false,
        contentType: APPLICATION_JSON_VALUE,
        data: JSON.stringify(request),
        dataType: 'json',
        success: function(response) {
            if ($.fn.DataTable.isDataTable('#attendeesTable')) {
                $('#attendeesTable').DataTable().clear().destroy();
            }

            let tbodyHtml = '';
            GRADUATION_CEREMONY_LAST_COMMUNICATIONS = {};
            $.each(response.details || [], function(index, attendee) {
                const sno = index + 1;
                const callbackStatus = attendee.callbackStatus ? attendee.callbackStatus : "N/A";
                const isCallbackScheduled = callbackStatus.toUpperCase() === "SCHEDULED";
                const rawPreferredDateTime = attendee.callbackPreferredDateTime && attendee.callbackPreferredDateTime != "N/A" ? attendee.callbackPreferredDateTime : "";
                const callbackPreferredTimezone = attendee.callbackPreferredTimezone || attendee.userTimezone || "";
                const formattedDateAccToTZ = rawPreferredDateTime ? changeDateFormat(convertTZ(rawPreferredDateTime, USER_TIMEZONE), "MMM dd, yyyy hh:mm A") : "N/A";
                const callbackTimeSlot = getGraduationCeremonyTimeSlot(rawPreferredDateTime);
                const phoneNo = formatGraduationCeremonyPhone(attendee.phoneNo);
                const alternatePhoneNo = formatGraduationCeremonyPhone(attendee.alternatePhoneNo);
                const phoneWhatsAppIcon = getGraduationCeremonyWhatsAppIcon(attendee.phoneOnWhatsApp);
                const alternatePhoneWhatsAppIcon = getGraduationCeremonyWhatsAppIcon(attendee.alternatePhoneOnWhatsApp);
                const paidAmount = attendee.paidAmount || attendee.amountScheduled || 0;
                const pendingAmount = attendee.pendingAmount || 0;
                const totalAmount = attendee.totalAmount || 0;
                const hasPaidGuests = (attendee.hasPaidGuests || "").toUpperCase() === "Y";
                const pendingPaymentStatus = attendee.pendingPaymentStatus ? attendee.pendingPaymentStatus : "N/A";
                const lastCommunicationInfo = getGraduationCeremonyLastCommunicationHtml(attendee);
                const studentInfo = `
                    <strong>${attendee.fullName}</strong><br>
                    <small>${attendee.email}</small><br>
                    <small>Attend As: ${attendee.attendAs ? attendee.attendAs : "N/A"}</small><br>
                    <small>Age: ${!attendee.age ? "N/A" : attendee.age}</small><br>
                    <small>Phone No.: ${phoneNo}${phoneWhatsAppIcon}</small><br>
                    <small>Alt Phone No.: ${alternatePhoneNo}${alternatePhoneWhatsAppIcon}</small><br>
                    <small>Country: ${attendee.country}</small>
                    <br><small>Timezone: ${attendee.userTimezone ? attendee.userTimezone : "N/A"}</small>
                `;
                const callbackInfo = `
                    <small>Status: ${callbackStatus}</small><br>
                    <small>Time Slot: ${callbackTimeSlot}</small><br>
                    <small>Date & Time: ${formattedDateAccToTZ}</small>
                `;
                const attendeesInfo = attendee.attendees && attendee.attendees.length > 0
                    ? attendee.attendees.map(function(person, personIndex){
                        const amountText = person.amount === null || person.amount === undefined || person.amount === "null"
                            ? "N/A"
                            : `$${person.amount}`;
                        const statusText = person.amountStatus ? person.amountStatus : "SCHEDULED";
                        const paidBadgeClass = (person.isPaid || "").toUpperCase() === "Y" ? "success" : "warning";
                        return `<div class="mb-1" style="white-space:nowrap;">
                            <small>
                                <strong>${personIndex + 1}.</strong> ${person.name ? person.name : "N/A"}${person.relation ? ` (${person.relation})` : ""}${person.gender ? ` - ${person.gender}` : ""}
                                <span class="ml-1">- ${amountText}</span>
                                <span class="badge badge-${paidBadgeClass} ml-1">${statusText}</span>
                            </small>
                        </div>`;
                    }).join("")
                    : `<small>N/A</small>`;
                const amountInfo = hasPaidGuests && pendingAmount > 0
                    ? `<small><strong>Pending:</strong> $${pendingAmount}</small><br>
                       <small><strong>Paid:</strong> $${paidAmount}</small><br>
                       <small><strong>Total:</strong> $${totalAmount}</small>`
                    : `<small>$${(attendee.amountStatus || "").toUpperCase() === "SUCCESS" ? totalAmount : pendingAmount}</small>`;
                const paymentStatusInfo = hasPaidGuests && pendingAmount > 0
                    ? `<small><strong>${attendee.amountStatus}</strong></small><br><small>Pending Batch: ${pendingPaymentStatus}</small>`
                    : `<small>${attendee.amountStatus}</small>`;

                tbodyHtml += `<tr>
                    <td>${sno}</td>
                    <td>${studentInfo}</td>
                    <td>${lastCommunicationInfo}</td>
                    <td class="d-none">${callbackInfo}</td>
                    <td>${attendeesInfo}</td>
                    <td>${attendee.noOfAttendees?attendee.noOfAttendees : "N/A"}</td>
                    <td>${amountInfo}</td>
                    <td>${paymentStatusInfo}</td>
                    <td>${attendee.foodAllergy}</td>
                    <td><div class="graduation-ceremony-action-wrap">`;
                        tbodyHtml += `<button type="button"
                            class="btn btn-link text-primary p-0"
                            title="Remarks"
                            onclick="openCommunicationLogsModalForGraduationCeremony(${attendee.attendeeId})">
                            <i class="fas fa-comment-alt"></i>
                        </button>`;
                        if(isCallbackScheduled){
                            tbodyHtml += `<button type="button"
                                class="btn btn-primary btn-sm open-graduation-status-modal d-none"
                                data-email="${attendee.email || ''}"
                                data-callback-preferred-datetime="${rawPreferredDateTime}"
                                data-callback-preferred-timezone="${callbackPreferredTimezone}"
                                data-school-id="${attendee.schoolId || SCHOOL_ID}"
                                data-user-id="${attendee.userId || USER_ID}">
                                Update Status
                            </button>`;
                        }
                        if(isUserAllowedToDiscardGraduationCeremonyAttendee && (attendee.amountStatus || "").toUpperCase() !== "SUCCESS" && !hasPaidGuests){
                            tbodyHtml += `<i class="fa fa-trash text-danger graduation-ceremony-discard-icon"
                                aria-hidden="true"
                                title="Discard"
                                onclick="discardGraduationCeremonyAttendee(${attendee.attendeeId})"></i>`;
                        }
                    tbodyHtml += `</div></td>
                </tr>`;
            });

            $('#attendeesTableBody').html(tbodyHtml);
            $('#attendeesTable').DataTable({
                destroy: true,
                language: {
                    emptyTable: "No Data Available"
                }
            });
        }
    });
}

function applyFilterGraduationCeremonyAttendees(){
    updateGraduationCeremonyFilterState();
    loadGraduationCeremonyAttendees();
}

function resetGraduationCeremonyAttendeesFilter(){
    $('#graduationCeremonyFilterForm')[0].reset();
    resetGraduationCeremonyFilterStateToDefault();
    $("#graduationCeremonyFilterForm #filterCeremonyName").val("GRADUATION_CEREMONY_2026");
    if(typeof refreshCustomFieldState === "function"){
        setTimeout(function(){
            refreshCustomFieldState($("#graduationCeremonyFilterForm"));
        }, 0);
    }
    loadGraduationCeremonyAttendees();
}

function updateGraduationCeremonyFilterState(){
    GRADUATION_CEREMONY_FILTER_STATE.filterValues = {
        ceremonyTitle: $("#graduationCeremonyFilterForm #filterCeremonyName").val().trim(),
        name: $("#graduationCeremonyFilterForm #filterName").val().trim(),
        email: $("#graduationCeremonyFilterForm #filterEmail").val().trim(),
        country: $("#graduationCeremonyFilterForm #filterCountry").val().trim(),
        attendAs: $("#graduationCeremonyFilterForm #filterAttendAs").val().trim(),
        membersType: $("#graduationCeremonyFilterForm #filterMembersType").val(),
        paymentStatus: $("#graduationCeremonyFilterForm #filterPaymentStatus").val(),
        callbackStatus: $("#graduationCeremonyFilterForm #filterCallbackStatus").val(),
        phone: $("#graduationCeremonyFilterForm #filterPhone").val().trim()
    };
}

function ensureDefaultGraduationCeremonyFilters(){
    if(!GRADUATION_CEREMONY_FILTER_STATE.filterValues){
        GRADUATION_CEREMONY_FILTER_STATE.filterValues = {};
    }
    if(!GRADUATION_CEREMONY_FILTER_STATE.filterValues.ceremonyTitle){
        GRADUATION_CEREMONY_FILTER_STATE.filterValues.ceremonyTitle = "GRADUATION_CEREMONY_2026";
    }
    if($("#graduationCeremonyFilterForm #filterCeremonyName").length && !$("#graduationCeremonyFilterForm #filterCeremonyName").val()){
        $("#graduationCeremonyFilterForm #filterCeremonyName").val("GRADUATION_CEREMONY_2026");
    }
}

function getGraduationCeremonyTimeSlot(preferredDateTime){
    if(!preferredDateTime || preferredDateTime == "N/A"){
        return "N/A";
    }

    var formattedDateTime = changeDateFormat(convertTZ(preferredDateTime, USER_TIMEZONE), "MMM dd, yyyy hh:mm A");
    var timePart = formattedDateTime.split(" ").slice(-2).join(" ");
    var slotMap = {
        "10:00 AM": "10:00 AM - 1:00 PM",
        "01:00 PM": "1:00 PM - 4:00 PM",
        "04:00 PM": "4:00 PM - 8:00 PM",
        "08:00 PM": "8:00 PM - 12:00 AM"
    };

    return slotMap[timePart] || timePart || "N/A";
}

function formatGraduationCeremonyPhone(phoneNo){
    if(!phoneNo){
        return "N/A";
    }

    var trimmedPhoneNo = (phoneNo + "").trim();
    if(trimmedPhoneNo === "" || trimmedPhoneNo.toUpperCase() === "N/A"){
        return "N/A";
    }

    trimmedPhoneNo = trimmedPhoneNo.replace(/-/g, " ").replace(/\s+/g, " ").trim();
    trimmedPhoneNo = trimmedPhoneNo.replace(/^\+*/, "");
    trimmedPhoneNo = "+" + trimmedPhoneNo;
    trimmedPhoneNo = trimmedPhoneNo.replace(/^\+\s+/, "+");

    return trimmedPhoneNo;
}

function getGraduationCeremonyWhatsAppIcon(isOnWhatsApp){
    if(isOnWhatsApp !== "Y"){
        return "";
    }

    return ` <img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" width="14px" alt="WhatsApp"/>`;
}

const GRADUATION_CEREMONY_COMMUNICATION_ENTITY = "GRADUATION_CEREMONY_ATTENDEES";
var GRADUATION_CEREMONY_COMMUNICATION_LOGS = [];
var GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID = null;

function escapeGraduationCeremonyHtml(value){
    return (value || "").toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function stripGraduationCeremonyHtml(value){
    return $("<div>").html(value || "").text().trim();
}

function getGraduationCeremonyLastCommunicationHtml(attendee){
    var title = attendee.lastCommunicationTitle && attendee.lastCommunicationTitle !== "N/A" ? attendee.lastCommunicationTitle : "";
    var comments = attendee.lastCommunicationComments && attendee.lastCommunicationComments !== "N/A" ? stripGraduationCeremonyHtml(attendee.lastCommunicationComments) : "";
    if(!title && !comments){
        return `<small class="text-muted">N/A</small>`;
    }
    var displayText = comments || title;
    var metaText = attendee.lastCommunicationAt && attendee.lastCommunicationAt !== "N/A" ? attendee.lastCommunicationAt : "";
    var compactText = displayText.length > 70 ? displayText.substring(0, 70) + "..." : displayText;
    var communicationKey = attendee.attendeeId || attendee.lastCommunicationId || compactText;
    GRADUATION_CEREMONY_LAST_COMMUNICATIONS[communicationKey] = {
        title: title || "Remark",
        comments: comments || title,
        meta: metaText
    };
    return `<div class="small p-2 rounded" style="border-left:3px solid #0b7fff;background:#f8fbff;max-width:260px;">
        <div class="text-dark" style="line-height:18px;">${escapeGraduationCeremonyHtml(compactText)}</div>
        ${metaText ? `<div class="text-muted mt-1">${escapeGraduationCeremonyHtml(metaText)}</div>` : ""}
        <a href="javascript:void(0)" class="text-primary font-weight-bold d-inline-block mt-1" onclick="showGraduationCeremonyLastCommunication('${communicationKey}')">View Remarks</a>
    </div>`;
}

function showGraduationCeremonyLastCommunication(communicationKey){
    var communication = GRADUATION_CEREMONY_LAST_COMMUNICATIONS[communicationKey] || {};
    var title = escapeGraduationCeremonyHtml(communication.title || "Remark");
    var comments = escapeGraduationCeremonyHtml(communication.comments || "N/A");
    var meta = escapeGraduationCeremonyHtml(communication.meta || "");
    var modalId = "graduationCeremonyLastCommunicationModal";
    $("#" + modalId).remove();
    $("body").append(`
        <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-md" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Remarks</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${title ? `<div class="mb-2"><small class="text-muted d-block">Remark Title</small><strong>${title}</strong></div>` : ""}
                        ${meta ? `<div class="mb-2"><small class="text-muted d-block">Added At</small><span>${meta}</span></div>` : ""}
                        <div>
                            <small class="text-muted d-block">Comment</small>
                            <p class="mb-0" style="line-height:22px;">${comments || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`);
    $("#" + modalId).modal("show");
}

function ckEditorCountValidateGC(editor, elementId, counterEleId) {
    const text = editor.getData()
        .replace(/<[^>]*>/g, '')
        .trim();

    const minlength = $("#" + elementId).attr("minlength") || 25;
    const length = text.length;
    const counterId = "#" + counterEleId;

    $(counterId).text(length + " / " + minlength);

    if (length < minlength) {
        $(".ck-editor__editable").css({"border-color":"red"});
        $("#" + elementId).addClass("is-invalid");
        $(counterId).removeClass("text-success text-muted").addClass("text-red");
        return false;
    }

    $("#" + elementId).removeClass("is-invalid");
    $(".ck-editor__editable").css({"border-color":"green"});
    $(counterId).removeClass("text-red text-muted").addClass("text-success");
    return true;
}

function getChatImageCropContentGCA() {
    return '<div class="modal fade" id="cropModalChatSuport" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">'
        +'<div class="modal-dialog modal-lg p-0" role="document">'
            +'<div class="modal-content">'
                +'<div class="modal-header">'
                    +'<h5 class="modal-title" id="modalLabel">Crop the image</h5>'
                    +'<div class="ml-auto">'
                        +'<button type="button" class="btn btn-secondary mr-1" data-dismiss="modal">Cancel</button>'
                        +'<button type="button" class="btn btn-primary mr-1" id="cropChatSupportDoc" onclick="cropImgfun()">Crop</button>'
                        +'<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>'
                    +'</div>'
                +'</div>'
                +'<div class="modal-body">'
                    +'<div class="img-container">'
                        +'<img id="cropModalImgChatSuport" src="https://avatars0.githubusercontent.com/u/3456749" width="100%" style="width:100%">'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>'
    +'</div>';
}

function pdfPreviewGCA() {
    return '<div class="modal fade fade-scale" id="uploadFile" tabindex="-1">'
        +'<div class="modal-dialog modal-md box-shadow-none" role="document">'
            +'<div class="modal-content">'
                +'<div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">'
                    +'<h6 class="heading text-white">Preview File</h6>'
                    +'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                +'</div>'
                +'<div class="modal-body m-0 py-2" style="margin-top:0 !important">'
                    +'<div id="pre_upload_image_div" class="full text-center upload_img d-none">'
                        +'<img id="pre_upload_image" class="w-100" src="" />'
                    +'</div>'
                    +'<div id="pre_upload_pdf_div" class="full text-center upload_pdf d-none">'
                        +'<div class="full">'
                            +'<a href="" target="_blank" class="btn btn-sm btn-primary download-pdf-btn mb-2 pull-right" download="file.pdf">Download PDF</a>'
                        +'</div>'
                        +'<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data=""></object>'
                    +'</div>'
                +'</div>'
            +'</div>'
        +'</div>'
    +'</div>';
}

async function openCommunicationLogsModalForGraduationCeremony(attendeeId){
    if($("#graduationCeremonyCommunicationLogsModal").length === 1){
        $("#graduationCeremonyCommunicationLogsModal").remove();
    }
    if($("#cropModalChatSuport").length === 1){
        $("#cropModalChatSuport").remove();
    }
    if($("#uploadFile").length === 1){
        $("#uploadFile").remove();
    }
    $("body").append(getGraduationCeremonyCommunicationLogsModal(attendeeId));
    $("body").append(getChatImageCropContentGCA());
    $("body").append(pdfPreviewGCA());
    GRADUATION_CEREMONY_COMMUNICATION_LOGS = [];
    GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID = null;
    if (typeof initEditor !== "function") {
        await loadScript([{ role: "", fileName: ["jquery.ckeditor.js"] }]);
    }
    if (typeof initEditor !== "function") {
        showMessageTheme2(0, "Comment editor failed to load. Please refresh and try again.");
        return;
    }
    await initEditor(1, 'commentEditorGC','Enter comments', false, ckEditorCountValidateGC);
    $("#fileuploadLogGC").on("change", function(){
        var attachment = $("#fileuploadLogGC").val().split("\\").pop() || "";
        $("#fileuploadLogGCSpan").text(attachment);
    });
    getCommunicationLogDataGC('graduationCeremonyCommunicationLogTable', attendeeId);
    setTimeout(function(){
        $("#graduationCeremonyCommunicationLogsModal").modal("show");
    }, 300);
}

function getRequestForCommunicationLogGC(formId, attendeeId){
    var commonCommentsRequest = {};
    var commonCommentsDTO = {};
    uploadDocs = [];

    var fileDiv = $("#" + formId + " #fileuploadLogGCdiv");
    var isUploaded = fileDiv.attr("uploaded");
    var fileName = fileDiv.attr("fileName");
    var filePath = fileDiv.attr("data-PDFURL");
    var docType = fileDiv.attr("docType");

    if (isUploaded == "Y" && fileName && filePath) {
        uploadDocs.push({
            docType: docType || "communicationLog",
            fileName: fileName,
            filePath: filePath,
            imgID: "fileuploadLogGC"
        });
        commonCommentsDTO['uploadFile'] = fileName;
    } else {
        commonCommentsDTO['uploadFile'] = "";
    }

    commonCommentsDTO['entityId'] = attendeeId;
    commonCommentsDTO['entityName'] = GRADUATION_CEREMONY_COMMUNICATION_ENTITY;
    commonCommentsDTO['title'] = $("#" + formId + " #logTitle").val();
    commonCommentsDTO['commentId'] = GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID ? parseInt(GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID) : null;
    if (editor1 != undefined) {
        commonCommentsDTO['comments'] = escapeCharacters(editor1.getData());
    }
    commonCommentsDTO['documentUploads'] = uploadDocs;
    commonCommentsRequest['commonCommentsDTO'] = commonCommentsDTO;
    return commonCommentsRequest;
}

function confirmSaveCommunicationLogGC(formId, attendeeId){
    if(editor1.getData() == null || editor1.getData() == '' || editor1.getData() == 'undefined'){
        showMessageTheme2(0,"Comments mandatory",'',true);
        return false;
    }
    if(editor1.getData().length > 2999){
        showMessageTheme2(0,"Comments can not be more than 3000 characters.",'',true);
        return false;
    }
    if(editor1.getData().length < 25){
        showMessageTheme2(0,"Comments can not be less than 25 characters.",'',true);
        return false;
    }
    var actionText = GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID ? "update" : "add";
    showWarningMessageShow("Are you sure you want to " + actionText + " these remarks?", "saveCommunicationLogGC('" + formId + "', '" + attendeeId + "')");
}

async function saveCommunicationLogGC(formId, attendeeId){
    if(editor1.getData() == null || editor1.getData() == '' || editor1.getData() == 'undefined'){
        showMessageTheme2(0,"Comments mandatory",'',true);
        return false;
    }
    if(editor1.getData().length > 2999){
        showMessageTheme2(0,"Comments can not be more than 3000 characters.",'',true);
        return false;
    }
    if(editor1.getData().length < 25){
        showMessageTheme2(0,"Comments can not be less than 25 characters.",'',true);
        return false;
    }

    var payload = getRequestForCommunicationLogGC(formId, attendeeId);
    var responseData = await callCommonAjax({
        method: "POST",
        url: APP_BASE_URL + UNIQUEUUID + "/api/v1/dashboard/save-user-communication-log",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    });

    if(responseData.status == 1){
        showMessageTheme2(1, responseData.message);
        resetCommunicationLogFormGC(formId);
        getCommunicationLogDataGC('graduationCeremonyCommunicationLogTable', attendeeId);
        loadGraduationCeremonyAttendees();
    }else{
        showMessageTheme2(0, responseData.message);
    }
}

async function getCommunicationLogDataGC(elementId, attendeeId){
    var responseData = await callCommonAjax({
        method: "POST",
        url: APP_BASE_URL + UNIQUEUUID + "/api/v1/dashboard/get-user-communication-log",
        body: {
            entityId: attendeeId,
            entityName: GRADUATION_CEREMONY_COMMUNICATION_ENTITY
        },
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    });

    if(responseData.statusResponse && responseData.statusResponse.statusCode == 1){
        GRADUATION_CEREMONY_COMMUNICATION_LOGS = responseData.commonCommentsDTO || [];
        $('#' + elementId + ' > tbody').html(getAddCommunicationLogTablebodyGC(responseData));
    }else{
        GRADUATION_CEREMONY_COMMUNICATION_LOGS = [];
        $('#' + elementId + ' > tbody').html('<tr><td colspan="6" class="text-center">No data found</td></tr>');
    }
}

function getAddCommunicationLogTablebodyGC(result){
    var html = '';
    $.each(result.commonCommentsDTO || [], function(k, v) {
        html += `<tr id="gcCommLog${v.commentId}">
            <td>${k + 1}</td>
            <td>${v.title || 'N/A'}</td>
            <td>${v.comments || 'N/A'}</td>
            <td class="text-center">`;
        if(v.uploadFile && v.uploadFile !== 'No file chosen...'){
            html += `<a target="_blank" href="${FILE_UPLOAD_PATH}${v.uploadFile}"><i class="fa fa-eye"></i></a>`;
        }else{
            html += `N/A`;
        }
        html += `</td>
            <td>${(v.addedByName || 'N/A')}/${(v.createdAt || 'N/A')}</td>
            <td class="text-center">
                <a href="javascript:void(0)" class="text-primary mr-2" title="Edit" onclick="editCommunicationLogGC(${v.commentId || 0})"><i class="fa fa-edit"></i></a>
                <a href="javascript:void(0)" class="text-danger" title="Remove" onclick="confirmRemoveCommunicationLogGC(${v.commentId || 0})"><i class="fa fa-trash"></i></a>
            </td>
        </tr>`;
    });
    return html;
}

function resetCommunicationLogFormGC(formId){
    $("#" + formId)[0].reset();
    if (editor1 !== undefined) {
        editor1.setData("");
    }
    const div = $("#fileuploadLogGCdiv");
    div.attr("uploaded", "");
    div.attr("fileName", "");
    div.attr("thumbType", "");
    div.attr("data-PDFURL", "");
    div.show();
    $("#fileuploadLogGCViewAndRemoveBtn").hide();
    $("#fileuploadLogGC").val("");
    $("#fileuploadLogGC").show();
    $("#fileuploadLogGCIcon").remove();
    uploadDocs = [];
    GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID = null;
    $("#communicationLogIdGC").val("");
    $("#graduationCeremonyCommunicationLogActionBtn").text("Add");
}

function getCommunicationLogGCById(commentId){
    var targetCommentId = parseInt(commentId);
    if(!targetCommentId){
        return null;
    }
    for(var index = 0; index < GRADUATION_CEREMONY_COMMUNICATION_LOGS.length; index++){
        var log = GRADUATION_CEREMONY_COMMUNICATION_LOGS[index];
        if(log && parseInt(log.commentId) === targetCommentId){
            return log;
        }
    }
    return null;
}

function editCommunicationLogGC(commentId){
    var communicationLog = getCommunicationLogGCById(commentId);
    if(!communicationLog){
        showMessageTheme2(0, "Remarks not found.");
        return false;
    }
    GRADUATION_CEREMONY_COMMUNICATION_LOG_EDIT_ID = communicationLog.commentId;
    $("#communicationLogIdGC").val(communicationLog.commentId || "");
    $("#logTitle").val(communicationLog.title || "");
    if(editor1 !== undefined){
        editor1.setData(communicationLog.comments || "");
        ckEditorCountValidateGC(editor1, "commentEditorGC", "commentEditorGCCounter");
    }
    if(communicationLog.uploadFile && communicationLog.uploadFile !== "No file chosen..."){
        var fileName = communicationLog.uploadFile;
        var fileDiv = $("#fileuploadLogGCdiv");
        fileDiv.attr("uploaded", "Y");
        fileDiv.attr("fileName", fileName);
        fileDiv.attr("thumbType", fileName.toLowerCase().endsWith(".pdf") ? "pdf" : "");
        fileDiv.attr("data-PDFURL", FILE_UPLOAD_PATH + fileName);
        $("#fileuploadLogGCViewAndRemoveBtn").show();
        $("#fileuploadLogGC").hide();
    }else{
        $("#fileuploadLogGCViewAndRemoveBtn").hide();
        $("#fileuploadLogGC").show();
    }
    $("#graduationCeremonyCommunicationLogActionBtn").text("Update");
    $("#graduationCeremonyCommunicationLogsModal").animate({ scrollTop: 0 }, 300);
    return false;
}

function confirmRemoveCommunicationLogGC(commentId){
    if(!commentId){
        showMessageTheme2(0, "Remarks not found.");
        return false;
    }
    showWarningMessageShow("Are you sure you want to remove these remarks?", "removeCommunicationLogGC(" + commentId + ")");
}

async function removeCommunicationLogGC(commentId){
    var communicationLog = getCommunicationLogGCById(commentId);
    if(!communicationLog){
        showMessageTheme2(0, "Remarks not found.");
        return false;
    }
    var responseData = await callCommonAjax({
        method: "POST",
        url: APP_BASE_URL + UNIQUEUUID + "/api/v1/dashboard/save-user-communication-log",
        body: {
            commonCommentsDTO: {
                commentId: parseInt(commentId),
                entityId: communicationLog.entityId,
                entityName: GRADUATION_CEREMONY_COMMUNICATION_ENTITY,
                actionType: "DELETE"
            }
        },
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    });

    if(responseData.status == 1){
        showMessageTheme2(1, responseData.message);
        resetCommunicationLogFormGC("graduationCeremonyCommunicationLogForm");
        getCommunicationLogDataGC('graduationCeremonyCommunicationLogTable', communicationLog.entityId);
        loadGraduationCeremonyAttendees();
    }else{
        showMessageTheme2(0, responseData.message || "Unable to remove remarks.");
    }
}

$(document).off("hidden.bs.modal.graduationCommunicationLog", "#graduationCeremonyCommunicationLogsModal").on("hidden.bs.modal.graduationCommunicationLog", "#graduationCeremonyCommunicationLogsModal", function () {
    $(this).remove();
});

$(document).off("click", ".open-graduation-status-modal").on("click", ".open-graduation-status-modal", function () {
    const email = $(this).attr("data-email") || "";
    const callbackPreferredDateTime = $(this).attr("data-callback-preferred-datetime") || "";
    const callbackPreferredTimezone = $(this).attr("data-callback-preferred-timezone") || "";
    const schoolId = $(this).attr("data-school-id") || SCHOOL_ID;
    const userId = $(this).attr("data-user-id") || USER_ID;
    const formattedDateAccToTZ = callbackPreferredDateTime ? changeDateFormat(convertTZ(callbackPreferredDateTime, USER_TIMEZONE), "MMM dd, yyyy hh:mm A") : "N/A";

    $("#graduationCallbackStudentEmail").val(email);
    $("#graduationCallbackPreferredDateTime").val(callbackPreferredDateTime);
    $("#graduationCallbackPreferredTimezone").val(callbackPreferredTimezone);
    $("#graduationCallbackSchoolId").val(schoolId);
    $("#graduationCallbackUserId").val(userId);
    $("#graduationCallbackStatusSelect").val("");
    $("#graduationCallbackStudentEmailText").text(email || "N/A");
    $("#graduationCallbackPreferredDateTimeText").text(formattedDateAccToTZ);
    $("#graduationCallbackPreferredTimezoneText").text(callbackPreferredTimezone || "N/A");
    $("#graduationCallbackStatusModal").modal("show");
});

$(document).off("hidden.bs.modal", "#graduationCallbackStatusModal").on("hidden.bs.modal", "#graduationCallbackStatusModal", function () {
    $("#graduationCallbackStatusSelect").val("");
    $("#graduationCallbackStudentEmail").val("");
    $("#graduationCallbackPreferredDateTime").val("");
    $("#graduationCallbackPreferredTimezone").val("");
    $("#graduationCallbackSchoolId").val("");
    $("#graduationCallbackUserId").val("");
    $("#graduationCallbackStudentEmailText").text("N/A");
    $("#graduationCallbackPreferredDateTimeText").text("N/A");
    $("#graduationCallbackPreferredTimezoneText").text("N/A");
});

async function updateGraduationCeremonyCallbackStatus(){
    const callbackStatus = $("#graduationCallbackStatusSelect").val();
    const email = $("#graduationCallbackStudentEmail").val();
    const callbackPreferredDateTime = $("#graduationCallbackPreferredDateTime").val();
    const callbackPreferredTimezone = $("#graduationCallbackPreferredTimezone").val();
    const schoolId = $("#graduationCallbackSchoolId").val();
    const userId = $("#graduationCallbackUserId").val();

    if(callbackStatus == ""){
        showMessageTheme2(0, "Please select status");
        return false;
    }
    if(callbackStatus !== "COMPLETED"){
        showMessageTheme2(0, "Only completed status can be updated.");
        return false;
    }
    if(email == ""){
        showMessageTheme2(0, "Email not found.");
        return false;
    }
    if(callbackPreferredDateTime == ""){
        showMessageTheme2(0, "Preferred callback date & time not found.");
        return false;
    }
    if(callbackPreferredTimezone == ""){
        showMessageTheme2(0, "Preferred callback timezone not found.");
        return false;
    }

    const request = {
        email: email,
        callbackStatus: callbackStatus,
        callbackPreferredDateTime: callbackPreferredDateTime,
        callbackPreferredTimezone: callbackPreferredTimezone,
        schoolId: schoolId,
        userId: userId
    };
    const ajaxReqDetails = {
        method: "POST",
        url: `${APP_BASE_URL}${SCHOOL_UUID}/update-graduation-ceremony-callback-status`,
        body: request,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    try{
        const response = await callCommonAjax(ajaxReqDetails);
        if(response && (response.status == "SUCCESS" || response.status == 1 || response.status == "1")){
            showMessageTheme2(1, response.message || "Callback status updated successfully.");
            $("#graduationCallbackStatusModal").modal("hide");
            await loadGraduationCeremonyAttendees();
        }else{
            showMessageTheme2(0, response && response.message ? response.message : "Unable to update callback status.");
        }
    }catch(error){
        showMessageTheme2(0, "Unable to update callback status.");
    }
}

async function discardGraduationCeremonyAttendee(attendeeId){
    if(!attendeeId){
        showMessageTheme2(0, "Attendee id not found.");
        return false;
    }

    return showWarningMessage(
        'Are you sure you want to discard this attendee?',
        `confirmDiscardGraduationCeremonyAttendee(${attendeeId})`
    );
}

async function confirmDiscardGraduationCeremonyAttendee(attendeeId){
    const payload = {
        attendeeId: attendeeId
    };
    const responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(
        true,
        true,
        'discard-graduation-ceremony-attendee',
        payload,
        ''
    );

    if(responseData && responseData.status == "SUCCESS"){
        showMessageTheme2(1, responseData.message || "Record discarded successfully.");
        loadGraduationCeremonyAttendees();
    }else{
        showMessageTheme2(0, responseData && responseData.message ? responseData.message : "Unable to discard attendee.");
    }
}

function sendGraduationCeremonyMailToEligibleStudents(){
    var request = {};
    request["eventName"] = "Graduation Ceremony 2025, Columbia";
    request["location"] = "Bogota, Colombia";
    request["dateAndTime"] = "December 2025 (Tentative)";
    $.ajax({
        type: "POST",
        url: `${APP_BASE_URL}${SCHOOL_UUID}/send-graduation-ceremony-mail`,
        contentType: APPLICATION_JSON_VALUE,
        dataType: 'json',
        data: JSON.stringify(request),
        success: function (response) {
            if(response.status == "SUCCESS"){
                showMessageTheme2(1, response.message);
            }else{
                showMessageTheme2(0, response.message);
            }
        }
    });
}

$(document).off("hidden.bs.modal.graduationCeremonyCommunicationLogsModal", "#graduationCeremonyCommunicationLogsModal")
    .on("hidden.bs.modal.graduationCeremonyCommunicationLogsModal", "#graduationCeremonyCommunicationLogsModal", function () {
        if ($("#cropModalChatSuport").length === 1) {
            $("#cropModalChatSuport").remove();
        }
        if ($("#uploadFile").length === 1) {
            $("#uploadFile").remove();
        }
    });
