var MODAL_SHOW_FLAG = true;
var PROFILE_DATA_INTERVAL;
var HOBBIES_CHANGES_COUNT = [];
var ACADEMIC_ATTACHMENT = [];
var COMMUNICATION_CHANGES_COUNT = [];
var SPORTS_AND_CLUB_COUNT = [];
var OVER_ALL_TOTAL = 0;
var OVER_ALL_COUNT = 0;
var COUNT = 0;
var TOTAL_COUNT = 0;
var PERCENT = 0;
var intervalId;
var COMMUNICATION_APPEND_ROW = "";
var STUDENT_PROFILE_CHANGED_FIELDS = {};
var RENDER_FLAG = false;
var IS_TAB_CLICK_SCROLL = false;
var GET_FILED_DATA;
var PROFILE_NOW_DATA={};
var PROFILE_SCHEDULE_DATA={};
var PROFILE_SCHEDULE_MODAL_SHOWN = false;
var PROFILE_SCHEDULE_PROCESSED_KEYS = {};
var CURRENT_MODAL_SCHEDULE_SOURCE = [];
var BULK_PROFILE_SAVE_CONTEXT = null;
var RESERVE_ENROLLMENT_SAVE_BULK=false;
var LOCAL_PROFILE_MISSING_FIELDS=[];
var PROFILE_STUDENT_DOCUMENTS_RESPONSE = null;
var PROFILE_STUDENT_DOCUMENT_REUPLOADS = {};
var PROFILE_STUDENT_DOCUMENT_UPLOADS = {};
var PROFILE_STUDENT_DOCUMENT_BUCKETS = null;
var PROFILE_STUDENT_DOCUMENT_UPLOAD_PANEL_HIDDEN = false;
var PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL = "";
var IS_TIMEZONE_CHANGED=false;
var SAVE_BLUK_PROFILE_DATA =
    [
        // { eleID: "firstName", keyId: "firstName" },
        // { eleID: "middleName", keyId: "middleName" },
        // { eleID: "lastName", keyId: "lastName" },
        // { eleID: "gender", keyId: "gender" },
        // { eleID: "dob", keyId: "dob" },
        // { eleID: "phoneNumber", keyId: "phoneNumber" },
        // { eleID: "altPhoneNumber", keyId: "altPhoneNumber" },
        // { eleID: "studentEmailId", keyId: "studentEmailId" },
        // { eleID: "altEmailId", keyId: "altEmailId" },
        // { eleID: "country", keyId: "countrySection" },
        // { eleID: "timezone", keyId: "timezone" },
        // { eleID: "nationality", keyId: "nationality" },
        // { eleID: "address", keyId: "address" },
        // { eleID: "hobbies", keyId: "hobbies" },
        // { eleID: "LinkedInURL", keyId: "socialMedia" },
        // { eleID: "extracurricular", keyId: "extracurricular" }
    ];
var MISSING_PARENT_NAME_SECTION_FLAG;
// var PREFIX_PARENT_NAME_OBJ = {
//     "Parent Information": {
//         "Mother": [
//             {
//                 "fieldId": "motherName",
//             },
//             {
//                 "fieldId": "motherMiddleName",
//             },
//             {
//                 "fieldId": "motherLastName",
//             }
//         ],
//         "Father": [
//             {
//                 "fieldId": "fatherFirstName",
//             },
//             {
//                 "fieldId": "fatherMiddleName",
//             },
//             {
//                 "fieldId": "fatherLastName",
//             }
//         ],
//         "Guardian": [
//             {
//                 "fieldId": "guardianFirstName",
//             },
//             {
//                 "fieldId": "guardianMiddleName",
//             },
//             {
//                 "fieldId": "guardianLastName",
//             }
//         ]
//     }
// }    

function addAndRemoveRequestToSaveBulkData(flag, eleID, keyId) {
    if (flag) {
        var obj = []
        // 🔍 check if eleID already exists
        var exists = SAVE_BLUK_PROFILE_DATA.some(
            item => item.eleID === eleID
        );

        // ➕ push only if not exists
        if (!exists) {
            SAVE_BLUK_PROFILE_DATA.push({ eleID: eleID, keyId: keyId });
        }

    } else {
        if (keyId == "socialMedia") {
            if (eleID.endsWith("URL")) {
                SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
                    item => item.eleID !== eleID
                );
            }
        } else if (keyId == "hobbies") {
            if (HOBBIES_CHANGES_COUNT.length < 1) {
                SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
                    item => item.eleID !== eleID
                );
            }
        } else if (keyId == "preferredcommunication") {
            if(COMMUNICATION_CHANGES_COUNT.length < 1) {
                SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
                    item => item.eleID !== eleID
                );
            }
        } else if (keyId == "extracurricular") {
            if (SAVE_BLUK_PROFILE_DATA.length < 1) {
                SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
                    item => item.eleID !== eleID
                );
            }
        } else {
            SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
                item => item.eleID !== eleID
            );
        }
    }

    // console.log(SAVE_BLUK_PROFILE_DATA);
}


function addmoreHobbies(src, showElement) {
    $(src).hide();
    $("." + showElement).show();
}

// function addOtherHobbiesfun(hideElement, showElement){
//     $("."+hideElement).hide();
//     $("."+showElement).show();
//     hobbies = $("#addOtherHobbies").val();
//     if(hobbies.length>2){
//         if(hobbies !== $(".hobbies-wrapper .added-hobbie-wrapper:last-child .custom-control-label").text()){
//             $('.hobbies-wrapper').append(
//                 `<div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mr-3 mb-2 cursor hobbie-wrapper added-hobbie-wrapper" id="`+hobbies+`_wrapper">
//                     <input type="checkbox" id="H_`+hobbies.toLowerCase()+`" class="custom-control-input added-hobbie" data-hobbie-keyId="0" data-hobbie-label="${hobbies}" checked onchange="controlEditField(this,true,true,'hobbies', '','', 0,'hobbies')">
//                     <label class="custom-control-label cursor" for="H_`+hobbies.toLowerCase()+`">`+hobbies+`</label>
//                 </div>`
//             );
//             $("#addOtherHobbies").val("");
//             $("#saveHobbiesWrapper").show();
//             HOBBIES_CHANGES_COUNT.push(hobbies);
//         }else{
//             showMessageTheme2(0, "already added");
//         }
//     }else{
//         showMessageTheme2(0, "Invalid Hobbie");
//     }
// }

function addOtherHobbiesfun(hideElement, showElement) {
    $("." + hideElement).hide();
    $("." + showElement).show();

    var hobbies = $("#addOtherHobbies").val().trim();
    // ✅ generate SAFE ID (IMPORTANT)
    var safeId = hobbies.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    // ✅ duplicate check (safe)
    if ($("#" + safeId + "_wrapper").length > 0) {
        showMessageTheme2(0, "Already added");
        return;
    }
    if (hobbies.length <= 2) {
        showMessageTheme2(0, "Invalid Hobbie");
        return;
    }

    // UI duplicate check
    var alreadyExists = false;
    $(".hobbies-wrapper .custom-control-label").each(function () {
        if ($(this).text().toLowerCase() === hobbies.toLowerCase()) {
            alreadyExists = true;
        }
    });

    if (alreadyExists) {
        showMessageTheme2(0, "Already added");
        return;
    }

    /* -------- UI ADD -------- */
    $('.hobbies-wrapper').append(`
        <div class="custom-checkbox custom-control float-left w-fit-content right-checkbox-align mr-3 mb-2 cursor hobbie-wrapper added-hobbie-wrapper" id="`+ safeId + `_wrapper">
            <input type="checkbox" id="H_`+ hobbies.toLowerCase() + `" class="custom-control-input added-hobbie" data-hobbie-keyId="0" data-hobbie-label="${hobbies}" checked onchange="controlEditField(this,true,true,'hobbies', '','', 0,'hobbies')">
            <label class="custom-control-label cursor" for="H_`+ safeId + `">` + hobbies + `</label>
        </div>
    `);

    /* -------- DATA ADD (IMPORTANT) -------- */
    if (!PROFILE_RESPONSE_UPDATED_DATA[0].hobbies) {
        PROFILE_RESPONSE_UPDATED_DATA[0].hobbies = [];
    }

    

    PROFILE_RESPONSE_UPDATED_DATA[0].hobbies.push({
        id: 'H_' + safeId,
        hobbiesLabel: hobbies,
        hobbiesId: '0',     // new hobby
        status: 'Y'
    });


    // console.log("Updated hobbies data:", PROFILE_RESPONSE_UPDATED_DATA[0].hobbies);

    $("#addOtherHobbies").val("");
    $("#saveHobbiesWrapper").show();
    HOBBIES_CHANGES_COUNT.push(safeId);
    addAndRemoveRequestToSaveBulkData(true, 'hobbies', 'hobbies');
}


function cancelOtherHobbiesfun(hideElement, showElement) {
    $("." + hideElement).hide();
    $("." + showElement).show();
    $("#addOtherHobbies").val("");
}


function removeHobbies(hobbie) {
    $("#" + hobbie + "_wrapper").remove();
}
function addmoreSocialLinks(src, showElement) {
    $(src).hide();
    $("." + showElement).show();
}

function removeSocialLinks(socialLinksTitle) {
    $("#" + socialLinksTitle + "_wrapper").remove();
    var eleID = socialLinksTitle + "URL";
    if (eleID.endsWith("URL")) {
        SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
            item => item.eleID !== eleID
        );
        // console.log("delete", SAVE_BLUK_PROFILE_DATA);
    }
}

// function addOtherSocialLinks(hideElement, showElement) {
//     var addFlag = true;
//     socialLinksTitle = $("#addOtherSocialMediaLinksTitle").val();
//     socialLinksTitle = socialLinksTitle.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
//     socialLinks = $("#addOtherSocialMediaLinksUrl").val();
//     socialLinks = socialLinks.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
//     if (socialLinksTitle != "") {
//         if (isValidUrl(socialLinks)) {
//             $.each($(".social-links-wrapper .social-links-list-wrapper"), function () {
//                 if ($(this).data("social-title") == socialLinksTitle) {
//                     addFlag = false;
//                     return;
//                 }
//             });
//             if (addFlag) {
//                 $.each($(".social-links-wrapper .social-links-list-wrapper"), function () {
//                     if ($(this).find(".social-Links-url").val() == socialLinks) {
//                         addFlag = false;
//                         return;
//                     }
//                 });
//                 if (addFlag) {
//                     $('.social-links-wrapper').append(
//                         `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 social-links-list-wrapper social-links-list-wrapper" id="` + socialLinksTitle + `_wrapper" data-social-title="` + socialLinksTitle + `">
//                             <div class="form-group mb-2 p-0">
//                                 <div class="input-group">
//                                     <input type="text" class="form-control form-control-sm social-Links-url group-append-hide-input" data-social-media-id="0" name="`+ socialLinksTitle + `URL" id="` + socialLinksTitle + `URL" value="` + socialLinks + `" placeholder="` + socialLinksTitle + ` URL" autocomplete="off" onkeyup="controlEditField(this, \'${socialLinksTitle}URL\',\'${socialLinks}\','socialMedia', '', '', 0, \'socialMedia\')">
//                                     <div class="input-group-append input-group-append-hide">
//                                         <a href="javascript:void(0)" class="btn btn-sm btn-success" onclick="applyChanges(\'${socialLinksTitle}URL\', \'socialMedia\',\'${PROFILE_RESPONSE_DATA.userId}\',\'${PROFILE_RESPONSE_DATA.studentStandardId}\',\'${PROFILE_RESPONSE_DATA.moduleId}\','student','false')">
//                                             <i class="fa fa-check"></i>
//                                         </a>
//                                         <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="cancelChanges(\'${socialLinksTitle}URL\',\'${socialLinks}\','input', \'socialMedia\')">
//                                             <i class="fa fa-times"></i>
//                                         </a>
//                                         <button class="btn btn-primary btn-sm" onclick="removeSocialLinks('`+ socialLinksTitle + `')">
//                                             <i class="fa fa-trash"></i>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>`
//                     );
//                     $("." + hideElement).hide();
//                     $("." + showElement).show();
//                     $("#addOtherSocialMediaLinksTitle").val('');
//                     $("#addOtherSocialMediaLinksUrl").val('');
//                     SAVE_BLUK_PROFILE_DATA.push({ eleID: socialLinksTitle + 'URL', keyId: 'socialMedia' });
//                 } else {
//                     showMessageTheme2(0, "URL already added.");
//                 }
//             } else {
//                 showMessageTheme2(0, "Link title already added.");
//             }
//         } else {
//             showMessageTheme2(0, "Invalid URL.");
//         }
//     } else {
//         showMessageTheme2(0, "Link title is required.");
//     }
// }

function addOtherSocialLinks(hideElement, showElement) {
    var addFlag = true;

    // ✅ Title ke liye safeId banao (ID/DOM use ke liye)
    var rawTitle = $("#addOtherSocialMediaLinksTitle").val().trim();

    var safeTitle = rawTitle.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    // ✅ URL ko TOUCH mat karo
    var socialLinks = $("#addOtherSocialMediaLinksUrl").val().trim();

    if (rawTitle !== "") {

        // ✅ sirf validate karo, modify mat karo
        if (isValidUrl(socialLinks)) {

            // duplicate title check (safeTitle based)
            $(".social-links-wrapper .social-links-list-wrapper").each(function () {
                if ($(this).attr("id") === safeTitle + "_wrapper") {
                    addFlag = false;
                    return false;
                }
            });

            if (!addFlag) {
                showMessageTheme2(0, "Link title already added.");
                return;
            }

            // duplicate URL check (real URL se)
            $(".social-links-wrapper .social-Links-url").each(function () {
                if ($(this).val() === socialLinks) {
                    addFlag = false;
                    return false;
                }
            });

            if (!addFlag) {
                showMessageTheme2(0, "URL already added.");
                return;
            }

            // ✅ UI ADD (IMPORTANT: safeTitle for ID, rawTitle for display)
            var socialLinksLabel = escapeHtml(rawTitle);
            var socialLinksValue = escapeHtml(socialLinks);
            var socialLinksValueJs = socialLinks.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
            $('.social-links-wrapper').append(`
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 social-links-list-wrapper" id="${safeTitle}_wrapper" data-social-title="${safeTitle}">
                    <div class="custom-field-scope">
                        <div class="input-group position-relative custom-field mb-2 mt-3 p-0">
                            <input type="text" class="form-control form-control-sm social-Links-url group-append-hide-input" style="flex:1 1 0;min-width:0;padding-right:72px;" data-social-media-id="0" name="${safeTitle}URL" id="${safeTitle}URL" value="${socialLinksValue}" placeholder=" " autocomplete="off" onkeyup="controlEditField(this, '${safeTitle}URL','${socialLinksValueJs}','socialMedia', '', '', 0, 'socialMedia')">
                            <label for="${safeTitle}URL">${socialLinksLabel} URL</label>
                            <div class="input-group-append position-absolute" style="right:8px;top:50%;transform:translateY(-50%);z-index:6;gap:4px;margin:0;">
                                <button type="button" class="btn btn-sm btn-danger rounded-circle d-inline-flex align-items-center justify-content-center" onclick="removeSocialLinks('${safeTitle}')" style="width:24px;height:24px;min-width:24px;padding:0;font-size:11px;line-height:1;">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            // reset
            $("#addOtherSocialMediaLinksTitle").val('');
            $("#addOtherSocialMediaLinksUrl").val('');

            // bulk save
            SAVE_BLUK_PROFILE_DATA.push({
                eleID: safeTitle + 'URL',
                keyId: 'socialMedia'
            });

        } else {
            showMessageTheme2(0, "Invalid URL.");
        }
    } else {
        showMessageTheme2(0, "Link title is required.");
    }
}


async function removeCommunicationPreferredTime(slotWrapperClass, slotEleId) {
    $("#" + slotEleId).remove();
    $("#communicationPreferredSlotSave, #communication-preferred-time-dropdown-wrapper").show();
    if ($("." + slotWrapperClass + " li").length < 1 && (PROFILE_RESPONSE_DATA.profileData.studentProfile[1].callingTimePrefArray.length > 0 || PROFILE_RESPONSE_UPDATED_DATA[1].callingTimePrefArray.length > 0)) {
        if ($(".communication-preferred-time-wrapper-ul li").length == 0) {
            $("#communicationRoleType").prop("disabled", false);
        }
        // if($(".communication-preferred-time-wrapper-ul li").length < 3 && $(".communication-preferred-time-wrapper-ul li").length < 1 ){
        //     $("#communicationPreferredSlotAdd").show();
        //     $("#communicationPreferredSlotSave").hide();
        // }

        // $("#communicationPreferredSlotAdd").show();
        // $("#communicationPreferredSlotSave").hide();
        $("#communicationPreferredSlotSave").show();
    } else {
        if ($("." + slotWrapperClass + " li").length < 1 && PROFILE_RESPONSE_DATA.profileData.studentProfile[1].callingTimePrefArray.length < 1) {
            $("." + slotWrapperClass).parent().closest("li").remove();
            $("#communicationPreferredSlotSave").hide();
            COMMUNICATION_APPEND_ROW = '';
        }
    }



}

function getCommunicationRoleType(src) {
    if ($(src).val() != "") {
        $("#addcommunicationPreferredTime, #communicationPreferredSlotAdd").show();
        $("#preferedCommunicationStartTime, #preferedCommunicationEndTime").val("").trigger("change").prop("disabled", false);
    } else {
        $("#addcommunicationPreferredTime").hide();
        $("#preferedCommunicationStartTime, #preferedCommunicationEndTime").prop("disabled", true);
    }
}

function openCommunicationPreferredTimeElement(src, showElement) {
    // if($(".ul_Student li").length >=3){
    //     showMessageTheme2(0, "A maximum of three Communication Preferred Timing can be added for Student");
    //     return false; 
    // }else if($(".ul_Mother li").length >=3){
    //     showMessageTheme2(0, "A maximum of three Communication Preferred Timing can be added for Mother");
    //     return false; 
    // }else if($(".ul_Father li").length >=3){
    //     showMessageTheme2(0, "A maximum of three Communication Preferred Timing can be added for Father");
    //     return false; 
    // }else if($(".ul_Guardian li").length >=3){
    //     showMessageTheme2(0, "A maximum of three Communication Preferred Timing can be added for Guardian");
    //     return false; 
    // }else 
    if ($(".ul_Student li").length >= 3 && $(".ul_Mother li").length >= 3 && $(".ul_Father li").length >= 3 && $(".ul_Guardian li").length >= 3) {
        showMessageTheme2(0, "Maximum number of communication preferred slots reached.");
        return false;
    } else {
        $(src).hide();
        $("#communication-preferred-time-dropdown-wrapper").show();
    }


}

function addCommunicationPreferredTime() {

    if ($(".ul_Student li").length >= 3 && $("#communicationRoleType").val() == "Student") {
        showMessageTheme2(0, "A maximum of three preferred communication timings can be added. Student");
        $("#preferedCommunicationStartTime").val('').trigger("change");
        return false;
    } else if ($(".ul_Mother li").length >= 3 && $("#communicationRoleType").val() == "Mother") {
        showMessageTheme2(0, "A maximum of three preferred communication timings can be added. Mother");
        $("#preferedCommunicationStartTime").val('').trigger("change");
        return false;
    } else if ($(".ul_Father li").length >= 3 && $("#communicationRoleType").val() == "Father") {
        showMessageTheme2(0, "A maximum of three preferred communication timings can be added. Father");
        $("#preferedCommunicationStartTime").val('').trigger("change");
        return false;
    } else if ($(".ul_Guardian li").length >= 3 && $("#communicationRoleType").val() == "Guardian") {
        showMessageTheme2(0, "A maximum of three preferred communication timings can be added. Guardian");
        $("#preferedCommunicationStartTime").val('').trigger("change");
        return false;
    } else if ($(".ul_Student li").length >= 3 && $(".ul_Mother li").length >= 3 && $(".ul_Father li").length >= 3 && $(".ul_Guardian li").length >= 3) {
        showMessageTheme2(0, "Maximum number of communication preferred slots reached.");
        $("#preferedCommunicationStartTime").val('').trigger("change");
        return false;
    }
    var index;
    var st = $("#preferedCommunicationStartTime").val();
    var et = $("#preferedCommunicationEndTime").val();
    if ($(`#communication-preferred-time-wrapper ul .communication-preferred-timing .ul_${$("#communicationRoleType").val()} li`).length > 0) {
        var lastSlotIdIndex = parseInt($(`#communication-preferred-time-wrapper ul .communication-preferred-timing .ul_${$("#communicationRoleType").val()} li:last-child`).attr("id").split("_")[2]);
    } else {
        var lastSlotIdIndex = 1;
    }
    if ($(`#communication-preferred-time-wrapper ul .communication-preferred-timing .ul_${$("#communicationRoleType").val()} li`).length >= 3) {
        showMessageTheme2(0, "Maximum number of communication preferred slots reached.");
        return false;
    }
    if ($("#communicationRoleType").val() == "Student") { index = 0; }
    else if ($("#communicationRoleType").val() == "Mother") { index = 1; }
    else if ($("#communicationRoleType").val() == "Father") { index = 2; }
    else if ($("#communicationRoleType").val() == "Guardian") { index = 3; }
    var isDuplicateSlot = false;
    if (st == "") {
        showMessageTheme2(0, "Please select the start time of communication preferred timing.");
        return false;
    }
    if (et == "") {
        showMessageTheme2(0, "Please select the end time of communication preferred timing.");
        return false;
    }
    $(`#communication-preferred-time-wrapper ul .communication-preferred-timing .ul_${$("#communicationRoleType").val()}`).each(function () {
        var selected_st = $(this).attr("data-slot-st");
        var selected_et = $(this).attr("data-slot-et");
        if (selected_st + " - " + selected_et === st + " - " + et) {
            isDuplicateSlot = true;
            return false;
        }
    });
    if (isDuplicateSlot) {
        showMessageTheme2(0, "Communication preferred timing already selected");
        return false;
    }

    if (validateCommunicationPreferredTimes('communication-preferred-time-wrapper')) {
        // saveTeacherTimePreference('STUDENT','STUDENT',true, 'preferedCommunicationStartTime','preferedCommunicationEndTime');
        var appendFlag = false;;
        if ($(".ul_Student").length < 1 && $("#communicationRoleType").val() == "Student") {
            appendFlag = true;
        }
        if ($(".ul_Mother").length < 1 && $("#communicationRoleType").val() == "Mother") {
            appendFlag = true;
        }
        if ($(".ul_Father").length < 1 && $("#communicationRoleType").val() == "Father") {
            appendFlag = true;
        }
        if ($(".ul_Guardian").length < 1 && $("#communicationRoleType").val() == "Guardian") {
            appendFlag = true;
        }
        if (appendFlag) {
            if (COMMUNICATION_APPEND_ROW == "" || COMMUNICATION_APPEND_ROW != $("#communicationRoleType").val()) {
                if ($("#communication-preferred-time-wrapper .communication-preferred-time-wrapper-ul").length == 0) {
                    $("#communication-preferred-time-wrapper").append(`<ul class="p-0 communication-preferred-time-wrapper-ul bar_count"></ul>`)
                }
                $("#communication-preferred-time-wrapper .communication-preferred-time-wrapper-ul").append(
                    `<li style="list-style:none">
                            <div class="w-100 d-flex flex-wrap communication-preferred-timing align-items-center mb-2">
                                <span class="font-weight-bold">${$("#communicationRoleType").val()}:&nbsp;</span>
                                <ul class="d-flex ul_${$("#communicationRoleType").val()} communication_slot_ul" data-communicationRoleType-ul="${$("#communicationRoleType").val()}"></ul>
                            </div>
                        </li>
                        `
                );
                COMMUNICATION_APPEND_ROW = $("#communicationRoleType").val();

            }
        }
        $(`#communication-preferred-time-wrapper ul .communication-preferred-timing .ul_${$("#communicationRoleType").val()}`).append(
            `<li class="mr-2" id="communication_slot_` + (lastSlotIdIndex + 1) + `_${index}" data-slot-st="` + st + `" data-slot-et="` + et + `" data-communicationRoleType="${$("#communicationRoleType").val()}">
                    <div class="d-inline-flex">
                        <span class="d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 text-primary">
                            <i class="fa fa-clock mr-1"></i>
                            <span class="font-weight-semi-bold">(`+ st + ` - ` + et + `)</span>   
                        </span>    
                        <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="removeCommunicationPreferredTime('ul_${$("#communicationRoleType").val()}', 'communication_slot_` + (lastSlotIdIndex + 1) + `_${index}')">
                            <i class="fa fa-trash"></i>    
                        </a>    
                    </div>    
                </li>`
        );
        $("#class-preferred-time-dropdown-wrapper").hide();
        $(".fromTime, .toTime").val("").trigger("change");
        $(".addCommunicationPreferredTimeBtn").show();
        // $("#communicationRoleType").prop("disabled",true);
        if ($("#communication-preferred-time-wrapper ul li").length > 0) {
            $("#communicationPreferredSlotSave").show();
            addAndRemoveRequestToSaveBulkData(true, "communicationPreferredSlots", "communicationPreferredSlots");

        }
    }
}


function addClassPreferredTime(src, showElement) {
    if ($("#class-preferred-time-wrapper ul li").length >= 3) {
        showMessageTheme2(0, "A maximum of three preferred live class timings can be added.");
        return false;
    } else {
        $(src).hide();
        $("#class-preferred-time-dropdown-wrapper").show();
    }

}

function saveClassPreferredTime(saveFrom) {

    var st = $("#preferedStartTime").val();
    var et = $("#preferedEndTime").val();
    var isDuplicateSlot = false;
    if ($("#class-preferred-time-wrapper ul li").length > 0) {
        var lastSlotIdIndex = parseInt($("#class-preferred-time-wrapper ul li:last-child").attr("id").split("_")[1]);
    } else {
        var lastSlotIdIndex = 1;
    }
    if (st == "") {
        showMessageTheme2(0, "Please select the start time of live Classes Preferred Timing.");
        return false;
    }
    if (et == "") {
        showMessageTheme2(0, "Please select the end time of live Classes Preferred Timing.");
        return false;
    }
    $("#class-preferred-time-wrapper ul li").each(function () {
        var selected_st = $(this).attr("data-slot-st");
        var selected_et = $(this).attr("data-slot-et");
        if (selected_st + " - " + selected_et === st + " - " + et) {
            isDuplicateSlot = true;
            return false;
        }
    });
    if (isDuplicateSlot) {
        showMessageTheme2(0, "Live classes preferred timing already selected");
        return false;
    }

    if (validateClassPreferredTimes('class-preferred-time-wrapper')) {
        saveTeacherTimePreference('STUDENT', 'STUDENT', true, 'preferedStartTime', 'preferedEndTime', saveFrom);
        $("#class-preferred-time-wrapper ul").append(
            `<li class="mr-2 mb-2 bar_count" id="slot_` + (lastSlotIdIndex + 1) + `" data-slot-st="` + st + `" data-slot-et="` + et + `">
                    <div class="d-inline-flex">
                        <span class="d-inline-flex align-items-center border btn-dashed border-primary py-1 px-2 rounded flex-grow-1 mr-1 text-primary">
                            <i class="fa fa-clock mr-1"></i>
                            <span class="font-weight-semi-bold">(`+ st + ` - ` + et + `)</span>   
                        </span>    
                        <a href="javascript:void(0)" class="btn btn-sm btn-danger" onclick="removeClassPreferredTime('slot_`+ (lastSlotIdIndex + 1) + `')">
                            <i class="fa fa-trash"></i>    
                        </a>    
                    </div>    
                </li>`
        );
        $("#class-preferred-time-dropdown-wrapper").hide();
        $(".fromTime, .toTime").val("").trigger("change");
        $(".addClassPreferredTimeBtn").show();
        calculateSectionPercentage();
    }
}

function validateCommunicationPreferredTimes(wrapperId) {
    var times = [];
    var status = true;
    $(`#` + wrapperId + ` ul .communication-preferred-timing .ul_${$("#communicationRoleType").val()} li`).each(function () {
        var selected_st = $(this).attr("data-slot-st");
        var selected_et = $(this).attr("data-slot-et");
        var startTime = convertTo24Hour(selected_st);
        var endTime = convertTo24Hour(selected_et);
        times.push({ start: startTime, end: endTime });
    });
    var startTime = convertTo24Hour($("#communication-preferred-time-dropdown-wrapper .fromTime").val());
    var endTime = convertTo24Hour($("#communication-preferred-time-dropdown-wrapper .toTime").val());
    times.push({ start: startTime, end: endTime });
    for (var i = 0; i < times.length; i++) {
        for (var j = i + 1; j < times.length; j++) {
            if (timesOverlap(times[i], times[j])) {
                showMessageTheme2(0, 'Please check that one of your time slots is overlapping with another time slot.', '', true);
                status = false;

            }
        }
    }
    return status;
}


function validateClassPreferredTimes(wrapperId) {
    var times = [];
    var status = true;
    $("#" + wrapperId + " ul li").each(function () {
        var selected_st = $(this).attr("data-slot-st");
        var selected_et = $(this).attr("data-slot-et");
        var startTime = convertTo24Hour(selected_st);
        var endTime = convertTo24Hour(selected_et);
        times.push({ start: startTime, end: endTime });
    });
    var startTime = convertTo24Hour($("#class-preferred-time-dropdown-wrapper .fromTime").val());
    var endTime = convertTo24Hour($("#class-preferred-time-dropdown-wrapper .toTime").val());
    times.push({ start: startTime, end: endTime });
    for (var i = 0; i < times.length; i++) {
        for (var j = i + 1; j < times.length; j++) {
            if (timesOverlap(times[i], times[j])) {
                showMessageTheme2(0, 'Please check that one of your time slots is overlapping with another time slot.', '', true);
                status = false;

            }
        }
    }
    return status;
}

function timesOverlap(slot1, slot2, slotBufferLimit, userRoleId) {
    // console.log(slot1.start+" "+slot2.end);
    if (slot1.start < slot2.end && slot1.end > slot2.start) {
        return true;
    }
}

async function removeClassPreferredTime(slotEleId) {
    var requestData = {};
    requestData['timePrefId'] = $("#" + slotEleId).attr("data-slot-id");
    requestData['sessionUserId'] = USER_ID;
    await getDashboardDataBasedUrlAndPayload(true, true, 'inactivate-time-preference', requestData)
    $("#" + slotEleId).remove();
    calculateSectionPercentage();

}


async function inactiveSocialMedia(id, type, elementId) {
    var requestData = {};
    requestData['socMediaId'] = id;
    requestData['sessionUserId'] = USER_ID;
    requestData['type'] = type;
    var response = await getDashboardDataBasedUrlAndPayload(true, true, 'inactivate-user-soc-media', requestData)
    showMessageTheme2(1, response.message);
    $("#" + elementId).remove();
    calculateSectionPercentage();
}

function confirmParticipateExtraCurricularActivity(src) {
    if ($(src).prop("checked")) {
        $("#participateEventFormWrapper").show();
    } else {
        $("#participateEventFormWrapper").hide();
    }
}

function getAddParticipateExtraCurricularActivity(formId, studentStandardId) {
    var requestData = {};
    requestData['title'] = $("#" + formId + " #eventTitle").val();
    requestData['startDate'] = $("#" + formId + " #eventStartDate").val();
    requestData['endDate'] = $("#" + formId + " #eventEndDate").val();
    requestData['address'] = $("#" + formId + " #eventAddress").val();
    requestData['sesssionUserId'] = USER_ID;
    requestData['studentStandardId'] = studentStandardId;
    return requestData;
}

async function addParticipateExtraCurricularActivity(formId, studentStandardId) {
    if ($("#" + formId + " #eventTitle").val() == null || $("#" + formId + " #eventTitle").val() == undefined || $("#" + formId + " #eventTitle").val() == '') {
        showMessageTheme2(0, "Sport & event tilte is required");
        return false;
    }
    if ($("#" + formId + " #eventStartDate").val() == null || $("#" + formId + " #eventStartDate").val() == undefined || $("#" + formId + " #eventStartDate").val() == '') {
        showMessageTheme2(0, "Sport & event start date is required");
        return false;
    }
    if ($("#" + formId + " #eventEndDate").val() == null || $("#" + formId + " #eventEndDate").val() == undefined || $("#" + formId + " #eventEndDate").val() == '') {
        showMessageTheme2(0, "Sport & event end date is required");
        return false;
    }
    if ($("#" + formId + " #eventAddress").val() == null || $("#" + formId + " #eventAddress").val() == undefined || $("#" + formId + " #eventAddress").val() == '') {
        showMessageTheme2(0, "Sport & event address is required");
        return false;
    }
    var eventTitle = $("#" + formId + " #eventTitle").val();
    var eventStartDate = $("#" + formId + " #eventStartDate").val();
    var eventEndDate = $("#" + formId + " #eventEndDate").val();
    var eventAddress = $("#" + formId + " #eventAddress").val();
    var S_No = parseInt($("#" + formId + " #eventTableListWrapper table tbody tr").length) + 1;
    var data = await getDashboardDataBasedUrlAndPayload(true, true, 'save-joined-sports-ec-club', getAddParticipateExtraCurricularActivity(formId, studentStandardId));
    $("#eventTableListWrapper table tbody").append(
        `<tr id="event_tr_${S_No}" data-row-id="${data.joinedECId}">
            <td>${S_No}</td>
            <td>${eventTitle}</td>
            <td>${eventStartDate}</td>
            <td>${eventEndDate}</td>
            <td>${eventAddress}</td>
            <td>
                <a href="javascript:void(0)" class="btn btn-danger btn-sm" onclick="removeEvent(\'event_tr_${S_No}\')">
                    <i class="fa fa-trash"></i>
                </a>
            </td>
        </tr>`
    );
    if ($("#eventTableListWrapper table tbody tr").length > 0) {
        $("#" + formId + " #eventTableListWrapper").show();
        $("#" + formId + " #eventTitle").val('');
        $("#" + formId + " #eventStartDate").val('');
        $("#" + formId + " #eventEndDate").val('');
        $("#" + formId + " #eventAddress").val('');
    }
    if(USER_ROLE == "STUDENT"){
        // ✅ missingFields update
        missingFields = cleanMissingFields(missingFields, ['extracurricularActivities']);
        setProfileMissingFields(missingFields);
        extractFields(missingFields);
        MISSING_PARENT_NAME_SECTION_FLAG = getProfileParentNameSaveFlag();
        // ✅ PROFILE_NOW_DATA update
        PROFILE_NOW_DATA = getNowProfileFieldsData();
        if(Object.keys(PROFILE_NOW_DATA).length>0){
            PROFILE_NOW_DATA = cleanProfileStructure(PROFILE_NOW_DATA, ['extracurricularActivities']);
        }
        setNowProfileFieldsData(PROFILE_NOW_DATA);
        // ✅ agar schedule data bhi sync karna hai
        PROFILE_SCHEDULE_DATA = getScheduleProfileData();
        if(Object.keys(PROFILE_SCHEDULE_DATA).length>0){
            PROFILE_SCHEDULE_DATA = cleanProfileStructure(PROFILE_SCHEDULE_DATA, ['extracurricularActivities']);
        }
        setScheduleProfileData(PROFILE_SCHEDULE_DATA);
        refreshProfileMissingModalStateAfterBulkSave(missingFields);
    }
    calculateSectionPercentage()
}

async function removeEvent(rowId) {
    var requestData = {};
    requestData['joinedExtraCurricularId'] = $("#" + rowId).attr("data-row-id");
    requestData['sesssionUserId'] = USER_ID;
    $("#eventTableListWrapper table tbody #" + rowId).remove();
    await getDashboardDataBasedUrlAndPayload(true, true, 'inactivate-joined-extra-curricular', requestData);
    if ($("#eventTableListWrapper table tbody tr").length < 1) {
        $("#eventTableListWrapper, #participateEventFormWrapper").hide();
        $("#participateActivities").prop("checked", false)
    }
    $("#extraCurriculars tbody tr").each(function (i) {
        $(this).find("td").first().text(i + 1);
    });
    calculateSectionPercentage()
}

function circleBar(elementID, barSize, per, colorCode, thickness, customPlacement) {
    colorCode = getColorCodeAccordingToPercentage(per, 0.55, 0.95);
    $("." + elementID).circleProgress({
        value: per,
        size: barSize,
        lineCap: "round",
        startAngle: 0.5 * Math.PI,
        thickness: thickness,
        fill: {
            color: colorCode
        }
    }).on("circle-animation-progress", (function (e, i, n) {
        if (customPlacement) {
            $(this).closest(".circle-percentage").find("#circle-percentage-text").html("<span>" + parseInt(n * 100) + "%<span>")
        } else {
            $(this).find("small").html("<span class='font-12'>" + parseInt(n * 100) + "%</span>")
        }
    }));
}

function getColorCodeAccordingToPercentage(per, low, medium) {
    return low == "" || low == undefined ? "red" : per < low ? "red" : medium == "" || medium == undefined ? "orange" : per < medium ? "orange" : "green";
}

var resizeTimer;
$(window).on('resize', function () {
    if ($(window).outerWidth() > 991) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if ($("#dashboardContentInHTML").css("display") == "none" && $("#profilePageView").length > 0) {
                var windowWidth = $(window).outerWidth();

                if (windowWidth > 991) {
                    var padding = parseInt($(".app-main__inner").css("padding-top")) || 0;
                    var headerHeight = ($(".sticky-header").height() || 0) + ($(".app-footer").height() || 0);
                    var pageTitleHeight = $("#dashboardContentInHTMLAdditional .app-page-title").outerHeight() || 0;

                    $(".profile-right-section")
                        .css({ "height": "calc(100vh - " + (padding + headerHeight + pageTitleHeight) + "px)" })
                        .removeClass("mb-4");

                    $(".fixed-btn-wrapper")
                        .css({ "bottom": "0px" })
                        .removeClass('position-fixed')
                        .addClass('position-sticky');

                    $('html, body').animate({ scrollTop: 0 }, 600);
                } else {
                    $(".fixed-btn-wrapper")
                        .css({ "bottom": "60px" })
                        .removeClass('position-sticky')
                        .addClass('position-fixed');

                    $(".profile-right-section")
                        .css({ "height": "inherit" })
                        .addClass("mb-4");

                    $('html, body').animate({ scrollTop: 0 }, 600);
                }
            }
        }, 200); // run after 200ms of no further resize
    } else {
        return false;
    }
});


async function profileViewPageLoadEvent(data) {
    RENDER_FLAG = false;
    setTimeout(function () {
        $("head").append(`<script src="${PATH_FOLDER_JS2}${RESOURCES_FROM_MIN_LOCATION}custom/cropperImage.js?v=1.1.26">`)
    }, 1000);
    initializeIntelInput('profileForm', 'phoneNumber', 'itiphoneNumber', data[0].phoneNumberCountryCode, 'selfSave', "phoneNumberWhatsAppStatus", 0)
    initializeIntelInput('profileForm', 'altPhoneNumber', 'itialtPhoneNumber', data[0].altPhoneNumberCountryCode, 'selfSave', "altPhoneNumberWhatsAppStatus", 0)
    initializeIntelInput('profileForm', 'motherPhoneNumber', 'itimotherPhoneNumber', data[1].motherPhoneNumberCountryCode, 'selfSave', "motherPhoneNumberWhatsAppStatus", 1)
    initializeIntelInput('profileForm', 'fatherPhoneNumber', 'itifatherPhoneNumber', data[1].fatherPhoneNumberCountryCode, 'selfSave', "fatherPhoneNumberWhatsAppStatus", 1)
    initializeIntelInput('profileForm', 'guardianPhoneNumber', 'itiguardianPhoneNumber', data[1].guardianPhoneNumberCountryCode, 'selfSave', "guardianPhoneNumberWhatsAppStatus", 1)
    var windowWidth = $(window).outerWidth();
    if (windowWidth > 991) {
        var padding = parseInt($(".app-main__inner").css("padding-top").split("p")[0]);
        var headerHeight = parseInt($(".sticky-header").height() + $(".app-footer").height());
        var pageTitleHeight = parseInt($("#dashboardContentInHTMLAdditional .app-page-title").outerHeight());
        $(".profile-right-section").css({ "height": "calc(100vh - " + (padding + headerHeight + pageTitleHeight) + "px)" }).removeClass("mb-4");
        $(".fixed-btn-wrapper").css({ "bottom": "0px" });
        $(".fixed-btn-wrapper").removeClass('position-fixed').addClass('position-sticky');
        $('html, body').animate({ scrollTop: 0 }, 600);
    } else {
        $(".fixed-btn-wrapper").css({ "bottom": "60px" });
        $(".fixed-btn-wrapper").removeClass('position-sticky').addClass('position-fixed');
        $(".profile-right-section").css({ "height": "inherit" }).addClass("mb-4");
        $('html, body').animate({ scrollTop: 0 }, 600);
    }
    $('.profile-selection-list-anchor').on('click', function (e) {
        e.preventDefault();
        IS_TAB_CLICK_SCROLL = true;
        $(".bg-light-hover").removeClass('bg-light');
        $(".profile-selection-list-anchor").removeClass('bg-light');
        $(this).addClass('bg-light');
        var target = this.hash;
        var section = $(target);
        if ($(window).outerWidth() > 991) {
            var container = $('.profile-right-section');
            var scrollTopValue = container.scrollTop() + section.position().top;
            $('html, body').stop().animate({
                scrollTop: 0,
            }, 600);
        } else {
            var container = $('html, body');
            var scrollTopValue = section.offset().top - 60;
        }
        if (section.length) {
            container.stop().animate({
                scrollTop: scrollTopValue,
            }, 600, function () {
                IS_TAB_CLICK_SCROLL = false;
            });
        }
    });

    var studentProfileRightSection = $('.profile-right-section');
    var threshold = 116; // header / spacing

    var studentProfileSection = studentProfileRightSection.find('.profile-section');
    var studentProfileTabs = $('.profile-selection-list-anchor');
    studentProfileRightSection.on('scroll', function () {
        if (IS_TAB_CLICK_SCROLL) { return; }
        var activeSectionId = null;
        for (var i = 0; i < studentProfileSection.length; i++) {
            var section = studentProfileSection.eq(i);

            // ✅ CORRECT calculation (NO scrollTop subtraction)
            var sectionTop = section.position().top;
            var sectionHeight = section.outerHeight();
            var sectionBottom = sectionTop + sectionHeight;

            // ✅ Activate ONLY when section actually reaches top
            if (sectionTop <= threshold && sectionBottom > threshold) {
                activeSectionId = section.attr('id');
                break;
            }
        }

        if (activeSectionId) {
            studentProfileTabs.removeClass('bg-light');
            studentProfileTabs.filter('[href="#' + activeSectionId + '"]').addClass('bg-light');
        }
    });

    var originalToTimeOptions = $('.toTime option').clone();
    $('.fromTime').on('change', function () {
        var selectedTime = $(this).val();
        var selectedFound = false;
        $('.toTime').empty().append('<option value="">End Time</option>');
        originalToTimeOptions.each(function () {
            var optionTime = $(this).val();
            if (optionTime === "") return;
            if (selectedFound) {
                $('.toTime').append($(this).clone());
                if (optionTime == "11:59 PM") {
                    selectedFound = false;
                }
            }
            if (optionTime === selectedTime) {

                selectedFound = true;
            }
        });
    });

    $("#gender").val(data[0].gender).trigger("change");
    $("#dob, .custom-date-fields").datepicker({
        format: 'M dd, yyyy',
        autoclose: true,
    }).on('changeDate', function (e) {
        if (e && e.originalEvent) {
            $(this).trigger('change');
        }
    });
    $('#dob').datepicker('update', new Date(data[0].dob));
    $("#motherDob, #fatherDob, #guardianDob, #weddingAnniversaryDate").datepicker({
        format: 'M dd, yyyy',
        autoclose: true,
    }).on('changeDate', function (e) {
        // Fire `onchange="controlEditField(...)"` only for user selection
        // (avoid triggering during initial `datepicker('update', ...)` on page load)
        if (e && e.originalEvent) {
            $(this).trigger('change');
        }
    });
    if (data[1].motherDob) {
        $('#motherDob').datepicker('update', new Date(data[1].motherDob));
    }
    if (data[1].fatherDob) {
        $('#fatherDob').datepicker('update', new Date(data[1].fatherDob));
    }
    if (data[1].guardianDob) {
        $('#guardianDob').datepicker('update', new Date(data[1].guardianDob));
    }
    if (data[1].weddingAnniversaryDate) {
        $('#weddingAnniversaryDate').datepicker('update', new Date(data[1].weddingAnniversaryDate));
    }
    if (data[5] && data[5].reenrollmentDiscount) {
        $('#reenrollmentDiscount').datepicker('update', new Date(data[5].reenrollmentDiscount));
    }
    await callCountriesOption("profileForm", '', "country", '', "Select Country*");
    await callCountriesOption("profileForm", '', "motherCountry", '');
    await callCountriesOption("profileForm", '', "country", '', "Select Country*");
    await callCountriesOption("profileForm", '', "fatherCountry", '');
    await callCountriesOption("profileForm", '', "country", '', "Select Country*");
    await callCountriesOption("profileForm", '', "guardianCountry", '');
    await callCountriesOption("profileForm", '', "country", '', "Select Country*");
    await callCountriesOption("profileForm", '', "pCountryId", '');
    await getTimeZones("profileForm", "timezone", "timezoneInput", "");
    await callCountriesOption("profileForm", '', "nationality", '', "Select Nationality*")
    $("#country").unbind().bind("change", function () {
        callStates('profileForm', this.value, 'country', 'state', 'city');
        if ($(this).val() == "") {
            $("#state").html("<option value=''>Select State/Province*</option>");
        }
        $("#city").html("<option value=''>Select City*</option>");
    });
    $("#state").unbind().bind("change", function () {
        callCities('profileForm', this.value, 'state', 'city');
    });
    $("#pCountryId").unbind().bind("change", function () {
        callStates('profileForm', this.value, 'pCountryId', 'pStateId', 'pCityId');
        $("#pCityId").html("<option value=''>Select City*</option>");
    });
    $("#pStateId").unbind().bind("change", function () {
        callCities('profileForm', this.value, 'pStateId', 'pCityId');
    });

    if(USER_ROLE != "STUDENT"){
        $("#gender").select2({
            theme: "bootstrap4",
        });
    }

    $("#country").select2({
        theme: "bootstrap4",
    });
    $("#state").select2({
        theme: "bootstrap4",
    });
    $("#city").select2({
        theme: "bootstrap4",
    });
    $("#timezone").select2({
        theme: "bootstrap4",
    });
    $("#nationality").select2({
        theme: "bootstrap4",
    });

    $("#motherCountry").select2({
        theme: "bootstrap4",
    });
    $("#fatherCountry").select2({
        theme: "bootstrap4",
    });
    $("#guardianCountry").select2({
        theme: "bootstrap4",
    });

    $("#guardianCountry").select2({
        theme: "bootstrap4",
    });
    $("#preferedCommunicationStartTime").select2({
        theme: "bootstrap4",
    });
    $("#preferedCommunicationEndTime").select2({
        theme: "bootstrap4",
    });
    $("#preferedStartTime").select2({
        theme: "bootstrap4",
    });
    $("#preferedEndTime").select2({
        theme: "bootstrap4",
    });

    $("#country").val(data[0].country).trigger("change");
    $("#state").val(data[0].state).trigger("change");
    $("#city").val(data[0].city).trigger("change");
    $("#timezone").val(data[0].timezone).trigger("change");
    $("#nationality").val(data[0].nationalityId).trigger("change");

    $("#relationType").select2({
        theme: "bootstrap4",
    });
    $("#relationType").val(data[1].relationType).trigger("change");
    $("#pCountryId").select2({
        theme: "bootstrap4",
    });
    $("#pStateId").select2({
        theme: "bootstrap4",
    });
    $("#pCityId").select2({
        theme: "bootstrap4",
    });
    $("#motherCountry").val(data[1].motherCountry == 0 ? '' : data[1].motherCountry).trigger("change");
    $("#fatherCountry").val(data[1].fatherCountry == 0 ? '' : data[1].fatherCountry).trigger("change");
    $("#guardianCountry").val(data[1].guardianCountry == 0 ? '' : data[1].guardianCountry).trigger("change");

    // $("#pCountryId").val(data[1].pCountryId == 0? '' : data[1].pCountryId).trigger("change");
    // $("#pStateId").val(data[1].pStateId == 0? '' : data[1].pStateId).trigger("change");
    // $("#pCityId").val(data[1].pCityId == 0? '' : data[1].pCityId).trigger("change");



    // Academic Information Event Start Here //
    getAllGrade(SCHOOL_ID, true, "grade");
    getAllGradeWithFormId(SCHOOL_ID, true, "changeLearingProgramGradeForm", "standardId");
    getAllGrade(SCHOOL_ID, true, "previousCurrentGradeName");
    $("#learningProgram").select2({
        theme: "bootstrap4",
    });
    $("#learningProgram").val(data[2].learningProgramValue).trigger("change");
    $("#studentRegistrationType").val(data[2].learningProgramValue).trigger("change");
    $("#grade").select2({
        theme: "bootstrap4",
    });
    $("#grade").val(data[2].gradeId).trigger("change");
    $("#changeLearingProgramGradeModal #standardId").val(data[2].gradeId).trigger("change");
    $("#academicYearStartDate").datepicker({
        format: 'M dd, yyyy',
        autoclose: true,
    });
    $("#enrollmentDate").datepicker({
        format: 'M dd, yyyy',
        autoclose: true,
    });
    $('#academicYearStartDate').datepicker('update', new Date(data[2].academicYearStartDate));
    $('#enrollmentDate').datepicker('update', new Date(data[2].enrollmentDate));
    $("#studentCourseProviderId").select2({
        theme: "bootstrap4",
    });
    if (data[2].studentCourseProviderId != "") {
        $("#studentCourseProviderId").val(data[2].studentCourseProviderId).trigger("change");
        $("#lmsPlatform").val(data[2].studentCourseProviderId).trigger("change");
    } else {
        $("#studentCourseProviderId").val("").trigger("change");
        $("#lmsPlatform").val(data[2].studentCourseProviderId).trigger("change");
    }
    $("#studentRegistrationType").select2({
        theme: "bootstrap4",
        dropdowParent: $('#changeLearingProgramGradeModal body')
    });
    // Group Learning Program -> LMS Platform GR (38), locked; all other programs -> GC (37), locked
    $(document).on('change', '#studentRegistrationType', function () {
        var selectedProgram = $(this).val();
        if (selectedProgram === 'BATCH') {
            $('#lmsPlatform').val('38').trigger('change');
        } else {
            $('#lmsPlatform').val('37').trigger('change');
        }
        $('#lmsPlatform').prop('disabled', true).trigger('change.select2');
    });
    $("#changeLearingProgramGradeModal #standardId").select2({
        theme: "bootstrap4",
        dropdowParent: $('#changeLearingProgramGradeModal body')
    });
    $("#lmsPlatform").select2({
        theme: "bootstrap4",
        dropdowParent: $('#changeLearingProgramGradeModal body')
    });
    $("#previousCurrentGradeName").select2({
        theme: "bootstrap4",
    });
    $("#previousCurrentGradeName").val(data[2].previousCurrentGradeId).trigger("change");
    var currentYear = new Date().getFullYear();
    $("#previousCurrentSchoolGraduationYear").datepicker({
        format: "yyyy",
        viewMode: "years",
        minViewMode: "years",
        autoclose: true,
        endDate: new Date(currentYear, 11, 31)
    });
    await callCountriesOption("profileForm", '', "previousCurrentSchoolCountry", '', "Select Country*");
    $("#previousCurrentSchoolCountry").select2({
        theme: "bootstrap4",
    });
    $("#previousCurrentSchoolCountry").val(data[2].previousCurrentSchoolCountry).trigger("change");
    // Academic Information Event End Here //

    // Sport & Extra Curriculars Start Here //
    $("#eventStartDate").datepicker({
        format: 'M dd, yyyy',
        autoclose: true,
        startDate: new Date()
    }).on("change", function () {
        if ($(this).val() != "") {
            var startDate = new Date($(this).val());
            $("#eventEndDate").datepicker("remove");
            $('#eventEndDate').val('');
            $("#eventEndDate").datepicker({
                startDate: startDate,
                format: 'M dd, yyyy',
                autoclose: true,
            });
        }
    });

    $("#eventEndDate").datepicker({
        format: 'M dd, yyyy',
        autoclose: true,
        startDate: new Date()
    });
    // Sport & Extra Curriculars End Here //

    // Communication Log Start Here //
    $("#communicationLogDIV").append(communicationLogInformation());
    $("#studentEmailDIV").append(studentEmailInformation(data[6] || {}));
    $("#zoomRegistrationDIV").append(studentZoomRegistrationControl(data[7] || {}));
    initEditor(1, 'commentEditor', 'Enter comments', false);
    // bindFileUploadNew1('1', '33',USER_ID,6);
    $("#fileuploadLog6").on("change", function () {
        var attachment = $("#fileuploadLog6").val().split("\\")[2]
        $("#fileuploadLog6Span").text(attachment);
    });
    loadContentFlag = 1;
    callProfileEnrollStatusList('profileForm', 'RE-EN', 'reLeadStatus', false);
    // $('#communicationLogForm #reLeadStatus').select2({
    // 	theme:'bootstrap4',
    // })
    getCommunicationLogData('communicationLogTable', PROFILE_RESPONSE_DATA.userId, PROFILE_RESPONSE_DATA.userRole);
    $("#reLeadStatus").select2({
        theme: "bootstrap4"
    });
    // Communication Log End Here //
    $('.select2-selection').addClass('form-select-sm group-append-hide-input');
    // Ensure total section count reflects the common fields added in Parent/Guardian section
    if ($("#guardian_information").length > 0 && $("#relationType").length > 0 && $("#weddingAnniversaryDate").length > 0) {
        $("#guardian_information").attr("data-section-count", "11");
    }
    calculateSectionPercentage();
    if ($("#studentDocumentVerificationWrapper").length > 0) {
        loadProfileStudentDocumentVerification();
    }

}

function getCallingPreference() {
    var callingPreference = [];
    $(".communication-preferred-time-wrapper-ul > li").each(function () {
        var callPref = {};
        var timings = [];
        var slotUI = $(this).find(".communication_slot_ul");
        var roleType = slotUI.attr("data-communicationroletype-ul");
        if (!roleType) {
            showMessageTheme2(0, "Role type is required.");
            return false; // break .each
        }
        callPref.communicationRoleType = roleType;
        var $slots = slotUI.find("li");
        if ($slots.length === 0) {
            callPref.timings = [];
        } else {
            $slots.each(function () {
                var selected_st = convertTo24Hour($(this).attr("data-slot-st"));
                var selected_et = convertTo24Hour($(this).attr("data-slot-et"));
                timings.push(selected_st + "-" + selected_et);
            });
            callPref.timings = timings;
        }
        callingPreference.push(callPref);
    });
    return callingPreference;
}


function calculateSectionPercentage(PI_callFrom, GI_callFrom, AI_callFrom, LC_CallFrom, SC_callFrom) {
    OVER_ALL_COUNT = 0;
    OVER_ALL_TOTAL = 0;
    PERCENT = personalInformationFieldFilledCount();
    circleBar('personal-info-bar', '40', PERCENT, '#007fff', '4', false);

    PERCENT = guardianInformationFieldFilledCount();
    circleBar('guardian-info-bar', '40', PERCENT, '#007fff', '4', false);

    PERCENT = academicInformationFieldFilledCount(AI_callFrom);
    circleBar('academic-info-bar', '40', PERCENT, '#007fff', '4', false);
    PERCENT = liveClassesPreferredTimingFieldFilledCount();
    circleBar('live-classes-bar', '40', PERCENT, '#007fff', '4', false);

    PERCENT = sportAndExtraCurricularsInformationFieldFilledCount();
    circleBar('sport-curriculars-bar', '40', PERCENT, '#007fff', '4', false);
    PERCENT = calculatePercentage(OVER_ALL_COUNT, OVER_ALL_TOTAL);
    circleBar('profile-progress-bar', '77', PERCENT, '#fff', '5', true);
}

function timeToMinutes(time) {
    if (!time) return null;

    time = time.trim();

    // 12-hour format
    if (time.includes("AM") || time.includes("PM")) {
        time = convertTo24Hour(time); // your existing function
    }

    var [h, m] = time.split(":");
    return parseInt(h, 10) * 60 + parseInt(m, 10);
}


function calculatePercentage(part, total) {

    var percentage = 0;
    if (total === 0) {
        return 0;
    }
    percentage = part / total;
    return percentage.toFixed(2)
}

function personalInformationFieldFilledCount() {
    COUNT = 0;
    TOTAL_COUNT = 0;
    var otherhobbies_add = true;
    $("#personal_information input:not([type='checkbox']).bar_count").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
        }
    });
    $("#personal_information select.bar_count").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
        }
    });

    $.each(PROFILE_RESPONSE_UPDATED_DATA[0].hobbies, function (i, v) {
        if (v.status == "Y") {
            COUNT++;
            otherhobbies_add = false;
            return false;
        }
    });
    if (otherhobbies_add) {
        $("#personal_information .hobbies-wrapper.bar_count input[type='checkbox']").each(function () {
            if ($(this).prop("checked")) {
                COUNT++;
                return false;
            }
        });
    }
    $("#personal_information .social-links-wrapper.bar_count input").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            return false;
        }
    });
    TOTAL_COUNT = parseInt($("#personal_information .bar_count").length)
    OVER_ALL_COUNT = OVER_ALL_COUNT + COUNT;
    OVER_ALL_TOTAL = OVER_ALL_TOTAL + TOTAL_COUNT;
    if (COUNT > TOTAL_COUNT) {
        COUNT = TOTAL_COUNT;
    }
    return calculatePercentage(COUNT, TOTAL_COUNT);
}

function guardianInformationFieldFilledCount() {
    COUNT = 0;
    TOTAL_COUNT = 0;
    var motherCount = 0;
    var parentCount = 0;
    var guardianCount = 0;
    var commonCount = 0;
    $("#guardian_information .mother-section input:not([type='checkbox']).bar_count").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            motherCount++;
        }
    });
    $("#guardian_information .mother-section select.bar_count").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            motherCount++;
        }
    });

    $("#guardian_information .father-section input:not([type='checkbox']).bar_count").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            parentCount++;
        }
    });
    $("#guardian_information .father-section select.bar_count").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            parentCount++;
        }
    });


    // Count core guardian fields only; keep common fields (relationType, weddingAnniversaryDate) separate
    $("#guardian_information .guardian-section input:not([type='checkbox']).bar_count").not("#weddingAnniversaryDate").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            guardianCount++;
        }
    });
    $("#guardian_information .guardian-section select.bar_count").not("#relationType").each(function () {
        if ($(this).val() != "" && $(this).parent().find(".input-group-append-hide").attr("style") != "display: flex;") {
            COUNT++;
            guardianCount++;
        }
    });

    // Common fields should count regardless of whether Mother/Father/Guardian is the most-filled block
    // Count common fields based on filled value (even if not saved yet),
    // so user sees immediate percentage update on selection.
    if ($("#relationType").length > 0) {
        if ($("#relationType").val() != "") {
            commonCount++;
        }
    }
    if ($("#weddingAnniversaryDate").length > 0) {
        if ($("#weddingAnniversaryDate").val() != "") {
            commonCount++;
        }
    }

    COUNT = Math.max(motherCount, parentCount, guardianCount) + commonCount;
    $("#guardian_information .communication-wrapper input[type='checkbox']").each(function () {
        if ($(this).attr("check-status") != "false") {
            COUNT++;
            return false;
        }
    });
    // $("#guardian_information #communication-preferred-time-wrapper .communication-preferred-time-wrapper-ul.bar_count .communication_slot_ul li").each(function(){ 
    //     if($(this).length>0){
    //         COUNT++;
    //         return false;
    //     } 
    // });
    var slotCounted = false;
    $.each(PROFILE_RESPONSE_UPDATED_DATA[1].callingTimePrefArray, function (i, v) {
        if (v.timings && v.timings.length > 0) {
            COUNT++;
            slotCounted = true;
            return false;
        }
    });
    // Fallback: if UI has slots and save button is hidden, consider it saved for counting
    if (!slotCounted) {
        if ($("#communicationPreferredSlotSave").length > 0 && $("#communicationPreferredSlotSave").is(":hidden")) {
            if ($("#communication-preferred-time-wrapper .communication_slot_ul li").length > 0) {
                COUNT++;
            }
        }
    }
    TOTAL_COUNT = parseInt($("#guardian_information").attr("data-section-count"));
    OVER_ALL_COUNT = OVER_ALL_COUNT + COUNT;
    OVER_ALL_TOTAL = OVER_ALL_TOTAL + TOTAL_COUNT;
    if (COUNT > TOTAL_COUNT) {
        COUNT = TOTAL_COUNT;
    }
    return calculatePercentage(COUNT, TOTAL_COUNT);
}

function academicInformationFieldFilledCount(AI_callFrom) {
    COUNT = 0;
    TOTAL_COUNT = 0;

    if ($("#ageProofFileName").text() != "") {
        COUNT++;
    }
    if ($("#addressProofFileName").text() != "") {
        COUNT++;
    }
    if ($("#parentPassportProofFileName").text() != "") {
        COUNT++;
    }
    if ($("#lastAcademicProofFileName").text() != "") {
        COUNT++;
    }
    TOTAL_COUNT = parseInt($("#academic_information .bar_count").length);
    OVER_ALL_COUNT = OVER_ALL_COUNT + COUNT;
    OVER_ALL_TOTAL = OVER_ALL_TOTAL + TOTAL_COUNT;
    return calculatePercentage(COUNT, TOTAL_COUNT);
}

function liveClassesPreferredTimingFieldFilledCount() {
    COUNT = 0;
    TOTAL_COUNT = 0;
    $("#classes_Preferred_Timing_information #class-preferred-time-wrapper ul .bar_count").each(function () {
        if ($(this).length > 0) {
            COUNT++;
            return false;
        }
    });
    TOTAL_COUNT = parseInt($("#classes_Preferred_Timing_information").attr("data-section-count"));
    OVER_ALL_COUNT = OVER_ALL_COUNT + COUNT;
    OVER_ALL_TOTAL = OVER_ALL_TOTAL + TOTAL_COUNT;
    if (COUNT > TOTAL_COUNT) {
        COUNT = TOTAL_COUNT;
    }
    return calculatePercentage(COUNT, TOTAL_COUNT);
}

function sportAndExtraCurricularsInformationFieldFilledCount() {
    COUNT = 0;
    TOTAL_COUNT = 0;
    // $("#sport_and_Extra_curriculars_information input[type='checkbox'].group-append-hide-input").each(function(){ 
    //     if($(this).prop("checked")){
    //         COUNT++;
    //         return false;
    //     } 
    // });
    if ($("#participateActivities").prop("checked") && $("#sport_and_Extra_curriculars_information #extraCurriculars tbody tr").length > 0) {
        COUNT++;
    }
    TOTAL_COUNT = parseInt($("#sport_and_Extra_curriculars_information").attr("data-section-count"));
    // if($("#participateActivities").prop("checked") && $("#sport_and_Extra_curriculars_information #extraCurriculars tbody tr")>0){TOTAL_COUNT++}
    OVER_ALL_COUNT = OVER_ALL_COUNT + COUNT;
    OVER_ALL_TOTAL = OVER_ALL_TOTAL + TOTAL_COUNT;
    if (COUNT > TOTAL_COUNT) {
        COUNT = TOTAL_COUNT;
    }
    return calculatePercentage(COUNT, TOTAL_COUNT);
}





function getSocialIcon(iconRequest) {
    var icon = {
        "LinkedIn":
            `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 400 400">
                <rect width="400" height="400" rx="64" ry="64" fill="#0077B5"/>
                <path fill="#FFFFFF" d="M123.8 146.6H82.5v154.9h41.3V146.6zm-20.6-20.2c14.2 0 23-9.5 23-21.5-.3-12.2-8.8-21.5-22.7-21.5-13.9 0-23 9.3-23 21.5 0 12 8.8 21.5 22.5 21.5h.2zm48.6 175.1h41.3v-86.4c0-4.6.3-9.3 1.7-12.6 3.8-9.3 12.4-19 26.9-19 19 0 26.6 14.3 26.6 35.1v83h41.3v-88.8c0-47.6-25.4-69.7-59.2-69.7-27.5 0-39.6 15.2-46.3 25.9h.3v-22.2h-41.3c.5 14.5 0 154.9 0 154.9z"/>
            </svg>`,
        "YouTube":
            `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 576 512">
                <path fill="#FF0000" d="M549.7 124.1c-6.3-24-25.1-42.7-49-49C458.1 64 288 64 288 64s-170.1 0-212.7 11.1c-23.9 6.3-42.7 25-49 49C16 167.7 16 256 16 256s0 88.3 10.3 131.9c6.3 24 25.1 42.7 49 49C117.9 448 288 448 288 448s170.1 0 212.7-11.1c23.9-6.3 42.7-25 49-49C560 344.3 560 256 560 256s0-88.3-10.3-131.9z"/>
                <path fill="#FFF" d="M232 334.7V177.3L361.8 256 232 334.7z"/>
            </svg>`,
        "Instagram":
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#radient1)"/>
                <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#radient2)"/>
                <rect x="2" y="2" width="28" height="28" rx="6" fill="url(#radient3)"/>
                <path d="M23 10.5C23 11.3284 22.3284 12 21.5 12C20.6716 12 20 11.3284 20 10.5C20 9.67157 20.6716 9 21.5 9C22.3284 9 23 9.67157 23 10.5Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 21C18.7614 21 21 18.7614 21 16C21 13.2386 18.7614 11 16 11C13.2386 11 11 13.2386 11 16C11 18.7614 13.2386 21 16 21ZM16 19C17.6569 19 19 17.6569 19 16C19 14.3431 17.6569 13 16 13C14.3431 13 13 14.3431 13 16C13 17.6569 14.3431 19 16 19Z" fill="white"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M6 15.6C6 12.2397 6 10.5595 6.65396 9.27606C7.2292 8.14708 8.14708 7.2292 9.27606 6.65396C10.5595 6 12.2397 6 15.6 6H16.4C19.7603 6 21.4405 6 22.7239 6.65396C23.8529 7.2292 24.7708 8.14708 25.346 9.27606C26 10.5595 26 12.2397 26 15.6V16.4C26 19.7603 26 21.4405 25.346 22.7239C24.7708 23.8529 23.8529 24.7708 22.7239 25.346C21.4405 26 19.7603 26 16.4 26H15.6C12.2397 26 10.5595 26 9.27606 25.346C8.14708 24.7708 7.2292 23.8529 6.65396 22.7239C6 21.4405 6 19.7603 6 16.4V15.6ZM15.6 8H16.4C18.1132 8 19.2777 8.00156 20.1779 8.0751C21.0548 8.14674 21.5032 8.27659 21.816 8.43597C22.5686 8.81947 23.1805 9.43139 23.564 10.184C23.7234 10.4968 23.8533 10.9452 23.9249 11.8221C23.9984 12.7223 24 13.8868 24 15.6V16.4C24 18.1132 23.9984 19.2777 23.9249 20.1779C23.8533 21.0548 23.7234 21.5032 23.564 21.816C23.1805 22.5686 22.5686 23.1805 21.816 23.564C21.5032 23.7234 21.0548 23.8533 20.1779 23.9249C19.2777 23.9984 18.1132 24 16.4 24H15.6C13.8868 24 12.7223 23.9984 11.8221 23.9249C10.9452 23.8533 10.4968 23.7234 10.184 23.564C9.43139 23.1805 8.81947 22.5686 8.43597 21.816C8.27659 21.5032 8.14674 21.0548 8.0751 20.1779C8.00156 19.2777 8 18.1132 8 16.4V15.6C8 13.8868 8.00156 12.7223 8.0751 11.8221C8.14674 10.9452 8.27659 10.4968 8.43597 10.184C8.81947 9.43139 9.43139 8.81947 10.184 8.43597C10.4968 8.27659 10.9452 8.14674 11.8221 8.0751C12.7223 8.00156 13.8868 8 15.6 8Z" fill="white"/>
                <defs>
                    <radialGradient id="radient1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 23) rotate(-55.3758) scale(25.5196)">
                        <stop stop-color="#B13589"/>
                        <stop offset="0.79309" stop-color="#C62F94"/>
                        <stop offset="1" stop-color="#8A3AC8"/>
                    </radialGradient>
                    <radialGradient id="radient2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11 31) rotate(-65.1363) scale(22.5942)">
                        <stop stop-color="#E0E8B7"/>
                        <stop offset="0.444662" stop-color="#FB8A2E"/>
                        <stop offset="0.71474" stop-color="#E2425C"/>
                        <stop offset="1" stop-color="#E2425C" stop-opacity="0"/>
                    </radialGradient>
                    <radialGradient id="radient3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(0.500002 3) rotate(-8.1301) scale(38.8909 8.31836)">
                        <stop offset="0.156701" stop-color="#406ADC"/>
                        <stop offset="0.467799" stop-color="#6A45BE"/>
                        <stop offset="1" stop-color="#6A45BE" stop-opacity="0"/>
                    </radialGradient>
                </defs>
            </svg>`,
        "Facebook":
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 48 48" version="1.1">
                <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Color-" transform="translate(-200.000000, -160.000000)" fill="#4460A0">
                        <path d="M225.638355,208 L202.649232,208 C201.185673,208 200,206.813592 200,205.350603 L200,162.649211 C200,161.18585 201.185859,160 202.649232,160 L245.350955,160 C246.813955,160 248,161.18585 248,162.649211 L248,205.350603 C248,206.813778 246.813769,208 245.350955,208 L233.119305,208 L233.119305,189.411755 L239.358521,189.411755 L240.292755,182.167586 L233.119305,182.167586 L233.119305,177.542641 C233.119305,175.445287 233.701712,174.01601 236.70929,174.01601 L240.545311,174.014333 L240.545311,167.535091 C239.881886,167.446808 237.604784,167.24957 234.955552,167.24957 C229.424834,167.24957 225.638355,170.625526 225.638355,176.825209 L225.638355,182.167586 L219.383122,182.167586 L219.383122,189.411755 L225.638355,189.411755 L225.638355,208 L225.638355,208 Z" id="Facebook"></path>
                    </g>
                </g>
            </svg>`,
        "Twitter":
            `<svg viewBox="0 0 24 24" width="15" aria-hidden="true" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-1kihuf0 r-18jsvk2 r-1im9597 r-qn3fzs">
                <g>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                </g>
            </svg>`,
        "TikTok":
            `<svg xmlns="http://www.w3.org/2000/svg" width="15px" height="15px" viewBox="0 0 250 250">
                <g clip-rule="evenodd" fill-rule="evenodd">
                    <path d="M25 0h200c13.808 0 25 11.192 25 25v200c0 13.808-11.192 25-25 25H25c-13.808 0-25-11.192-25-25V25C0 11.192 11.192 0 25 0z" fill="#010101"/>
                    <path d="M156.98 230c7.607 0 13.774-6.117 13.774-13.662s-6.167-13.663-13.774-13.663h-2.075c7.607 0 13.774 6.118 13.774 13.663S162.512 230 154.905 230z" fill="#ee1d51"/>
                    <path d="M154.717 202.675h-2.075c-7.607 0-13.775 6.118-13.775 13.663S145.035 230 152.642 230h2.075c-7.608 0-13.775-6.117-13.775-13.662s6.167-13.663 13.775-13.663z" fill="#66c8cf"/>
                    <ellipse cx="154.811" cy="216.338" fill="#010101" rx="6.699" ry="6.643"/>
                    <path d="M50 196.5v6.925h8.112v26.388h8.115v-26.201h6.603l2.264-7.112zm66.415 0v6.925h8.112v26.388h8.115v-26.201h6.603l2.264-7.112zm-39.81 3.93c0-2.17 1.771-3.93 3.959-3.93 2.19 0 3.963 1.76 3.963 3.93s-1.772 3.93-3.963 3.93c-2.188-.001-3.959-1.76-3.959-3.93zm0 6.738h7.922v22.645h-7.922zM87.924 196.5v33.313h7.925v-8.608l2.453-2.248L106.037 230h8.49l-11.133-16.095 10-9.733h-9.622l-7.923 7.86V196.5zm85.47 0v33.313h7.926v-8.608l2.452-2.248L191.509 230H200l-11.133-16.095 10-9.733h-9.622l-7.925 7.86V196.5z" fill="#ffffff"/>
                    <path d="M161.167 81.186c10.944 7.819 24.352 12.42 38.832 12.42V65.755a39.26 39.26 0 0 1-8.155-.853v21.923c-14.479 0-27.885-4.601-38.832-12.42v56.835c0 28.432-23.06 51.479-51.505 51.479-10.613 0-20.478-3.207-28.673-8.707C82.187 183.57 95.23 189.5 109.66 189.5c28.447 0 51.508-23.047 51.508-51.48V81.186zm10.06-28.098c-5.593-6.107-9.265-14-10.06-22.726V26.78h-7.728c1.945 11.09 8.58 20.565 17.788 26.308zm-80.402 99.107a23.445 23.445 0 0 1-4.806-14.256c0-13.004 10.548-23.547 23.561-23.547a23.6 23.6 0 0 1 7.147 1.103V87.022a51.97 51.97 0 0 0-8.152-.469v22.162a23.619 23.619 0 0 0-7.15-1.103c-13.013 0-23.56 10.543-23.56 23.548 0 9.195 5.272 17.157 12.96 21.035z" fill="#ee1d52"/>
                    <path d="M153.012 74.405c10.947 7.819 24.353 12.42 38.832 12.42V64.902c-8.082-1.72-15.237-5.942-20.617-11.814-9.208-5.743-15.843-15.218-17.788-26.308H133.14v111.239c-.046 12.968-10.576 23.468-23.561 23.468-7.652 0-14.45-3.645-18.755-9.292-7.688-3.878-12.96-11.84-12.96-21.035 0-13.005 10.547-23.548 23.56-23.548 2.493 0 4.896.388 7.15 1.103V86.553c-27.945.577-50.42 23.399-50.42 51.467 0 14.011 5.597 26.713 14.68 35.993 8.195 5.5 18.06 8.707 28.673 8.707 28.445 0 51.505-23.048 51.505-51.479z" fill="#ffffff"/>
                    <path d="M191.844 64.902v-5.928a38.84 38.84 0 0 1-20.617-5.887 38.948 38.948 0 0 0 20.617 11.815zM153.439 26.78a39.524 39.524 0 0 1-.427-3.198V20h-28.028v111.24c-.045 12.967-10.574 23.467-23.56 23.467-3.813 0-7.412-.904-10.6-2.512 4.305 5.647 11.103 9.292 18.755 9.292 12.984 0 23.515-10.5 23.561-23.468V26.78zm-44.864 59.773v-6.311a51.97 51.97 0 0 0-7.067-.479C73.06 79.763 50 102.811 50 131.24c0 17.824 9.063 33.532 22.835 42.772-9.083-9.28-14.68-21.982-14.68-35.993 0-28.067 22.474-50.889 50.42-51.466z" fill="#69c9d0"/>
                    <path d="M154.904 230c7.607 0 13.775-6.117 13.775-13.662s-6.168-13.663-13.775-13.663h-.188c-7.607 0-13.774 6.118-13.774 13.663S147.109 230 154.716 230zm-6.792-13.662c0-3.67 3-6.643 6.7-6.643 3.697 0 6.697 2.973 6.697 6.643s-3 6.645-6.697 6.645c-3.7-.001-6.7-2.975-6.7-6.645z" fill="#ffffff"/>
                </g>
            </svg>`,


    };
    return icon[iconRequest];
}

function getAllDataAndRecords(userId, studentStandardId, docType, element_Id) {
    var uploadRequestDTO = {};
    var documentUploads = STUDENT_UPLOAD_DOCUMENTS;
    if(docType == "CUSTOM_FILE"){
        uploadRequestDTO['customProfileFieldId'] = $("#"+element_Id).attr("data-element-id");
    }
    uploadRequestDTO['userId'] = userId;
    uploadRequestDTO['studentStandardId'] = studentStandardId;
    uploadRequestDTO['documentUploads'] = documentUploads;
    return uploadRequestDTO;
}

function saveDocs(userId, studentStandardId, docType, element_Id) {
    if (docType != "Profile Image" && docType != "CUSTOM_FILE") {
        if ($("#ageProofFileName").text() == "" && $("#addressProofFileName").text() == "" && $("#parentPassportProofFileName").text() == "" && $("#lastAcademicProofFileName").text() == "") {
            showMessageTheme2(0, 'No attachment file is selected', '', true);
            return false;
        }
    }
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'save-docs'),
        data: JSON.stringify(getAllDataAndRecords(userId, studentStandardId, docType, element_Id)),
        dataType: 'json',
        async: true,
        success: function (data) {
            // console.log(data)
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    showMessageTheme2(0, data['MESSAGE'], '', true);
                    redirectLoginPage();
                } else {
                    showMessageTheme2(0, data['MESSAGE'], '', true);
                }
            } else {
                var doctype = "";
                $.each(data['LIST_OF_DOC'], function (key, value) {
                    var doctype = value.DOCUMENT_PATH.split(".").pop();
                    if (data['LIST_OF_DOC'][key].DOCUMENT_PATH.split(".").pop() != "pdf") {
                        //$("#"+data['LIST_OF_DOC'][key].IMG_ID).attr("src",data['LIST_OF_DOC'][key].DOCUMENT_PATH);
                        $("#" + value['IMG_ID']).parent().parent().find(".upload-btn-wrapper").hide();
                        if (USER_ROLE == 'STUDENT') {
                            $("#" + value['IMG_ID']).parent().parent().find(".removeDocBtn").hide();
                        }
                    } else {
                        $("#uploadFile .upload_pdf .pre_upload_pdf").remove();
                        $("#uploadFile .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="' + data['LIST_OF_DOC'][key].DOCUMENT_PATH + '"></object>');

                        $("#uploadFile .upload_pdf a.download-pdf-btn").attr("href", base64URL);
                        $("#uploadFile .upload_pdf").removeClass("d-none");
                        $("#uploadFile .upload_img").addClass("d-none");
                        $("#" + value['IMG_ID']).parent().parent().find(".upload-btn-wrapper").hide();
                        if (USER_ROLE == 'STUDENT') {
                            $("#" + value['IMG_ID']).parent().parent().find(".removeDocBtn").hide();
                        }
                    }
                });
                $('.removeDocBtn').each(function () {
                    if ($(this).attr('style').replace(/\s/g, '') != 'display:none' && $(this).attr('style').replace(/\s/g, '') != 'display:none;') {
                        $("#allDocsNotUploaded").hide();
                        $("#allDocsUploaded").show();
                    } else {
                        $("#allDocsNotUploaded").show();
                        $("#allDocsUploaded").hide();
                        return false;
                    }
                });
                if (docType == "Profile Image") {
                    showMessageTheme2(1, 'Profile image uploaded successfully', '', true);
                } else {
                    showMessageTheme2(1, 'Document(s) uploaded', '', true);
                    // setTimeout(function(){customLoader(true); window.location.reload();},2000);
                }
                console.log("Save Docs", STUDENT_UPLOAD_DOCUMENTS);
                
                ACADEMIC_ATTACHMENT.push(data.LIST_OF_DOC);
                calculateSectionPercentage('', '', 'save-docs', '', '');
                if ($("#studentDocumentVerificationWrapper").length > 0) {
                    loadProfileStudentDocumentVerification();
                }
                if(USER_ROLE == "STUDENT"){
                    var eleIdsToRemove = STUDENT_UPLOAD_DOCUMENTS.map(item => item.eleID);

                    // ✅ missingFields update
                    missingFields = cleanMissingFields(missingFields, eleIdsToRemove);
                    setProfileMissingFields(missingFields);
                    extractFields(missingFields);
                    MISSING_PARENT_NAME_SECTION_FLAG = getProfileParentNameSaveFlag();
                    // ✅ PROFILE_NOW_DATA update
                    PROFILE_NOW_DATA = getNowProfileFieldsData();
                    if(Object.keys(PROFILE_NOW_DATA).length>0){
                        PROFILE_NOW_DATA = cleanProfileStructure(PROFILE_NOW_DATA, eleIdsToRemove);
                    }
                    setNowProfileFieldsData(PROFILE_NOW_DATA);
                    // ✅ agar schedule data bhi sync karna hai
                    PROFILE_SCHEDULE_DATA = getScheduleProfileData();
                    if(Object.keys(PROFILE_SCHEDULE_DATA).length>0){
                        PROFILE_SCHEDULE_DATA = cleanProfileStructure(PROFILE_SCHEDULE_DATA, eleIdsToRemove);
                    }
                    setScheduleProfileData(PROFILE_SCHEDULE_DATA);
                    refreshProfileMissingModalStateAfterBulkSave(missingFields);
                    STUDENT_UPLOAD_DOCUMENTS=[];
                    CUSTOM_DATEPICKER_FIELD_FLAG=false;
                }
            }
        }
    });

}

function normalizeProfileAdmissionStatus(status) {
    var normalized = (status || "").toString().trim().toUpperCase().replace(/[\s_]+/g, " ");
    if (normalized === "") {
        return "Enrollment Under Review";
    }
    if (normalized === "ENROLLMENT ON HOLD") {
        return "Enrollment On Hold";
    }
    if (normalized === "ENROLLMENT UNDER REVIEW" || normalized === "ENROLLMENT IN REVIEW") {
        return "Enrollment Under Review";
    }
    if (normalized === "ENROLLMENT REJECTED") {
        return "Enrollment Rejected";
    }
    if (normalized === "ENROLLMENT CONFIRM" || normalized === "ENROLLMENT CONFIRMED") {
        return "Enrollment Confirmed";
    }
    return "";
}

function escapeHtml(value) {
    return $("<div/>").text(value == null ? "" : value).html();
}

function canEditProfileStudentDocuments() {
    return (USER_ROLE != "STUDENT" && PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA .rightToEdit);
}

function getProfileStudentDocumentKey(doc) {
    if (!doc) {
        return "";
    }
    if (parseInt(doc.fileType, 10) === 78) {
        return "passport";
    }
    if (parseInt(doc.fileType, 10) === 79) {
        return "dob";
    }
    if (parseInt(doc.fileType, 10) === 80 && doc.standardId) {
        return "acad_" + doc.standardId;
    }
    return "doc_" + (doc.id || "");
}

function isProfileStudentDocumentMarkedUnverified(doc) {
    if (!doc) {
        return false;
    }
    var isDocumentVerified = (doc.isDocumentVerified || "").toString().toUpperCase();
    if (isDocumentVerified === "N") {
        return true;
    }
    if (isDocumentVerified === "Y") {
        return false;
    }
    return ((doc.isVerificationRequired || "N") + "").toString().toUpperCase() === "Y";
}

function getProfileStudentDocumentBuckets(documentsResponse) {
    var attachments = (documentsResponse && documentsResponse.attachments) ? documentsResponse.attachments : {};
    var rawDocs = (documentsResponse && documentsResponse.documents) ? documentsResponse.documents : [];
    var personalDocs = [];
    var academicDocs = [];
    var unverifiedMap = {};
    var existingMap = {};
    var unnamedDocs = [];

    $.each(rawDocs, function (i, doc) {
        var key = getProfileStudentDocumentKey(doc);
        var standardName = $.trim(doc.standardName || "");
        var documentName = $.trim(doc.documentName || "");
        var isUnverified = isProfileStudentDocumentMarkedUnverified(doc);
        if (key) {
            existingMap[key] = doc;
        }
        if (key === "passport" || key === "dob") {
            if (isUnverified) {
                unverifiedMap[key] = doc;
            }
            return;
        }
        if (key.indexOf("acad_") === 0) {
            academicDocs.push(doc);
            if (isUnverified) {
                unverifiedMap[key] = doc;
            }
            return;
        }
        if (!standardName && !documentName && !doc.standardId) {
            unnamedDocs.push(doc);
            return;
        }
        academicDocs.push(doc);
    });

    if (attachments.passportSizePhotoURL || existingMap.passport) {
        personalDocs.push({
            key: "passport",
            label: "Passport Size Photo",
            url: attachments.passportSizePhotoURL || (existingMap.passport ? existingMap.passport.fileUrl : ""),
            name: attachments.passportSizePhotoName || attachments.passportSizePhotoDocumentName || (existingMap.passport ? (existingMap.passport.fileOriginalName || existingMap.passport.uploadFileName || "") : ""),
            rawDoc: existingMap.passport || null
        });
    }
    if (attachments.dobProofURL || existingMap.dob) {
        personalDocs.push({
            key: "dob",
            label: "DOB Proof",
            url: attachments.dobProofURL || (existingMap.dob ? existingMap.dob.fileUrl : ""),
            name: attachments.dobProofName || attachments.dobProofDocumentName || (existingMap.dob ? (existingMap.dob.fileOriginalName || existingMap.dob.uploadFileName || "") : ""),
            rawDoc: existingMap.dob || null
        });
    }

    var fallbackPersonalKeys = [];
    $.each(personalDocs, function (i, item) {
        if ((item.key === "passport" || item.key === "dob") && !unverifiedMap[item.key]) {
            fallbackPersonalKeys.push(item.key);
        }
    });
    $.each(unnamedDocs, function (i, doc) {
        if (!isProfileStudentDocumentMarkedUnverified(doc)) {
            return;
        }
        var fallbackKey = fallbackPersonalKeys.shift();
        if (fallbackKey) {
            unverifiedMap[fallbackKey] = doc;
            existingMap[fallbackKey] = doc;
            $.each(personalDocs, function (index, item) {
                if (item.key === fallbackKey) {
                    item.rawDoc = doc;
                }
            });
        }
    });

    $.each(personalDocs, function (i, item) {
        item.isDocumentVerified = unverifiedMap[item.key] ? "N" : "Y";
    });

    return {
        personalDocs: personalDocs,
        academicDocs: academicDocs,
        unverifiedMap: unverifiedMap,
        existingMap: existingMap
    };
}

function getProfileCurrentGradeId() {
    try {
        if (PORFILE_RESPONSE_UPDATED_DATA && PORFILE_RESPONSE_UPDATED_DATA[2] && PORFILE_RESPONSE_UPDATED_DATA[2].gradeId) {
            return (PORFILE_RESPONSE_UPDATED_DATA[2].gradeId || "").toString();
        }
    } catch (e) { }
    return ($("#grade").val() || "").toString();
}

function getProfileRequiredAcademicDocumentGrades(standardId) {
    if (typeof getRequiredAcademicDocumentGrades === "function") {
        try {
            return getRequiredAcademicDocumentGrades(standardId) || [];
        } catch (e) { }
    }
    if (typeof SCHOOL_STANDARD_GRADE_MASTER === "undefined" || !SCHOOL_STANDARD_GRADE_MASTER || !standardId) {
        return [];
    }
    var grade = SCHOOL_STANDARD_GRADE_MASTER.find(function (item) {
        return item.key.toString() === standardId.toString();
    });
    if (!grade) {
        return [];
    }
    var orderBy = parseInt(grade.orderBy, 10) || 0;
    if (orderBy <= 1) {
        return [];
    }
    var getProfileStudentDocGradeByOrder = function (targetOrderBy) {
        return SCHOOL_STANDARD_GRADE_MASTER.find(function (item) {
            return (parseInt(item.orderBy, 10) || 0) === parseInt(targetOrderBy, 10);
        });
    };
    if (orderBy >= 2 && orderBy <= 11) {
        var previousGrade = getProfileStudentDocGradeByOrder(orderBy - 1);
        return previousGrade ? [previousGrade] : [];
    }
    if (orderBy === 12) {
        return [getProfileStudentDocGradeByOrder(10), getProfileStudentDocGradeByOrder(11)].filter(Boolean);
    }
    if (orderBy === 13) {
        return [getProfileStudentDocGradeByOrder(10), getProfileStudentDocGradeByOrder(11), getProfileStudentDocGradeByOrder(12)].filter(Boolean);
    }
    if (orderBy >= 14 && orderBy <= 18) {
        var previousFlexyGrade = getProfileStudentDocGradeByOrder(orderBy - 1);
        return previousFlexyGrade ? [previousFlexyGrade] : [];
    }
    return [];
}

function isProfileFlexyAcademicDocumentFlow(standardId) {
    var grade = SCHOOL_STANDARD_GRADE_MASTER.find(function (item) {
        return item.key.toString() === (standardId || "").toString();
    });
    if (!grade) {
        return false;
    }
    var orderBy = parseInt(grade.orderBy, 10) || 0;
    return orderBy >= 14 && orderBy <= 18;
}

function getProfileStudentUploadMeta(docKey) {
    var existingDoc = PROFILE_STUDENT_DOCUMENT_BUCKETS && PROFILE_STUDENT_DOCUMENT_BUCKETS.existingMap ? (PROFILE_STUDENT_DOCUMENT_BUCKETS.existingMap[docKey] || {}) : {};
    return {
        isReupload: existingDoc.attachmentId ? "Y" : "N",
        attachmentId: existingDoc.attachmentId || existingDoc.id || null
    };
}

function getProfileAcademicDocInputValue(rowKey, key) {
    return $.trim($("#" + key + "_" + rowKey).val());
}

function syncProfileStudentDobUploadState() {
    var hasDobProofType = $.trim($("#profileStudentDocDobProofType").val()) !== "";
    $("#profileStudentDocDobFile").prop("disabled", !hasDobProofType);
    if (hasDobProofType) {
        if (!PROFILE_STUDENT_DOCUMENT_UPLOADS.dob) {
            $("#profileStudentDocDobFileName").text("Upload your file");
        }
    } else {
        $("#profileStudentDocDobFile").val("");
        delete PROFILE_STUDENT_DOCUMENT_UPLOADS.dob;
        $("#profileStudentDocDobFileName").text("Select proof type first");
        $("#profileStudentDocDobView, #profileStudentDocDobRemove").hide();
    }
}

function getProfileStudentDocumentUploadPanel(documentsResponse) {
    var currentGradeId = getProfileCurrentGradeId();
    var requiredGrades = getProfileRequiredAcademicDocumentGrades(currentGradeId);
    var existingMap = PROFILE_STUDENT_DOCUMENT_BUCKETS && PROFILE_STUDENT_DOCUMENT_BUCKETS.existingMap ? PROFILE_STUDENT_DOCUMENT_BUCKETS.existingMap : {};
    var dobDoc = existingMap.dob || {};
    var html = '';
    var uploadControlStyle = 'display:flex;align-items:center;gap:8px;';
    var uploadInputWrapStyle = 'flex:1 1 auto;min-width:0;';
    var uploadActionWrapStyle = 'display:flex;align-items:center;justify-content:flex-end;gap:6px;min-height:32px;';

    html += '<div class="border rounded p-3 my-3 bg-white">';
    html += '<div class="d-flex flex-wrap justify-content-between align-items-start mb-3">';
    html += '<div><div class="font-weight-semi-bold text-dark">Upload Student Documents</div><small class="text-muted">Admin can upload or replace student documents here. Changes will reflect in the verification table below.</small></div>';
    html += '</div>';

    html += '<div class="mb-3"><div class="font-weight-semi-bold mb-2">Personal Documents</div><div class="row">';
    html += '<div class="col-md-6 col-sm-12 mb-3">';
    html += '<label class="mb-1">Passport Size Photo</label>';
    html += '<div>';
    html += '<div style="' + uploadControlStyle + '">';
    html += '<div class="upload-btn-wrapper" style="' + uploadInputWrapStyle + '">';
    html += '<input class="file-input" type="file" id="profileStudentDocPassportFile" onchange="onProfileStudentDocumentUploadChange(this, \'passport\', 78)" />';
    html += '<span class="btn btn-light border w-100 text-left mt-0 d-flex align-items-center overflow-hidden"><i class="fa fa-file-text-o mr-1 primary-txt-color"></i><span class="text-muted text-truncate d-inline-block w-100" id="profileStudentDocPassportFileName">Upload your file</span></span>';
    html += '</div>';
    html += '</div>';
    html += '<div style="' + uploadActionWrapStyle + 'margin-top:8px;">';
    html += '<button type="button" class="btn btn-primary btn-sm mr-1" id="profileStudentDocPassportView" style="display:none;" onclick="previewProfileStudentDocumentUpload(\'passport\')"><i class="fa fa-eye"></i></button>';
    html += '<button type="button" class="btn btn-danger btn-sm" id="profileStudentDocPassportRemove" style="display:none;" onclick="removeProfileStudentDocumentUpload(\'passport\')"><i class="fa fa-trash"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="col-md-6 col-sm-12 mb-3">';
    html += '<label class="mb-1">Date of Birth Proof</label>';
    html += '<div>';
    html += '<div style="' + uploadControlStyle + '">';
    html += '<select class="form-control" id="profileStudentDocDobProofType" style="flex:0 0 190px;min-width:190px;" onchange="syncProfileStudentDobUploadState()">';
    html += '<option value="">Select document type</option>';
    html += '<option value="Birth Certificate"' + (dobDoc.documentName === "Birth Certificate" ? ' selected' : '') + '>Birth Certificate</option>';
    html += '<option value="Passport"' + (dobDoc.documentName === "Passport" ? ' selected' : '') + '>Passport</option>';
    html += '<option value="National ID"' + (dobDoc.documentName === "National ID" ? ' selected' : '') + '>National ID</option>';
    html += '</select>';
    html += '<div class="upload-btn-wrapper" style="' + uploadInputWrapStyle + '">';
    html += '<input class="file-input" type="file" id="profileStudentDocDobFile" onchange="onProfileStudentDocumentUploadChange(this, \'dob\', 79)" disabled />';
    html += '<span class="btn btn-light border w-100 text-left mt-0 d-flex align-items-center overflow-hidden"><i class="fa fa-file-text-o mr-1 primary-txt-color"></i><span class="text-muted text-truncate d-inline-block w-100" id="profileStudentDocDobFileName">Select proof type first</span></span>';
    html += '</div>';
    html += '</div>';
    html += '<div style="' + uploadActionWrapStyle + 'margin-top:8px;">';
    html += '<button type="button" class="btn btn-primary btn-sm mr-1" id="profileStudentDocDobView" style="display:none;" onclick="previewProfileStudentDocumentUpload(\'dob\')"><i class="fa fa-eye"></i></button>';
    html += '<button type="button" class="btn btn-danger btn-sm" id="profileStudentDocDobRemove" style="display:none;" onclick="removeProfileStudentDocumentUpload(\'dob\')"><i class="fa fa-trash"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div></div>';

    html += '<div><div class="font-weight-semi-bold mb-2">Academic Documents</div>';
    if (requiredGrades.length < 1) {
        html += '<div class="text-muted">No previous academic document required for this grade.</div>';
    } else {
        $.each(requiredGrades, function (index, gradeInfo) {
            var rowKey = "acad_" + gradeInfo.key;
            var existingDoc = existingMap[rowKey] || {};
            var titleHtml = 'Academic Document ' + (index + 1);
            if (!isProfileFlexyAcademicDocumentFlow(currentGradeId)) {
                titleHtml += ' <small class="text-muted">(' + escapeHtml(gradeInfo.value || "") + ')</small>';
            }
            html += '<div class="card mb-3"><div class="card-body py-3">';
            html += '<h6 class="font-weight-semi-bold mb-3">' + titleHtml + '</h6>';
            html += '<div class="form-row">';
            html += '<div class="form-group col-md-3"><label class="mb-1">Document Name</label><input type="text" class="form-control form-control-sm" id="profileStudentDocName_' + rowKey + '" value="' + escapeHtml(existingDoc.documentName || "") + '" placeholder="Document name" /></div>';
            html += '<div class="form-group col-md-3"><label class="mb-1">School Name</label><input type="text" class="form-control form-control-sm" id="profileStudentSchoolName_' + rowKey + '" value="' + escapeHtml(existingDoc.schoolName || "") + '" placeholder="School name" /></div>';
            html += '<div class="form-group col-md-2"><label class="mb-1">Board Name</label><input type="text" class="form-control form-control-sm" id="profileStudentBoardName_' + rowKey + '" value="' + escapeHtml(existingDoc.boardName || "") + '" placeholder="Board name" /></div>';
            html += '<div class="form-group col-md-2"><label class="mb-1">Passing Year</label><input type="text" class="form-control form-control-sm" maxlength="4" id="profileStudentPassingYear_' + rowKey + '" value="' + escapeHtml(existingDoc.passingYear || "") + '" placeholder="YYYY" onkeydown="return M.digit(event);" /></div>';
            html += '<div class="form-group col-md-12"><label class="mb-1">Document Upload</label><div>';
            html += '<div class="upload-btn-wrapper" style="width:100%;">';
            html += '<input class="file-input" type="file" id="profileStudentAcademicFile_' + rowKey + '" onchange="onProfileStudentDocumentUploadChange(this, \'' + rowKey + '\', 80)" />';
            html += '<span class="btn btn-light border w-100 text-left mt-0 d-flex align-items-center overflow-hidden"><i class="fa fa-file-text-o mr-1 primary-txt-color"></i><span class="text-muted text-truncate d-inline-block w-100" id="profileStudentAcademicFileName_' + rowKey + '">Upload your file</span></span>';
            html += '</div>';
            html += '<div style="' + uploadActionWrapStyle + 'margin-top:8px;">';
            html += '<button type="button" class="btn btn-primary btn-sm mr-1" id="profileStudentAcademicView_' + rowKey + '" style="display:none;" onclick="previewProfileStudentDocumentUpload(\'' + rowKey + '\')"><i class="fa fa-eye"></i></button>';
            html += '<button type="button" class="btn btn-danger btn-sm" id="profileStudentAcademicRemove_' + rowKey + '" style="display:none;" onclick="removeProfileStudentDocumentUpload(\'' + rowKey + '\')"><i class="fa fa-trash"></i></button>';
            html += '</div>';
            html += '</div></div>';
            html += '</div></div></div>';
        });
    }
    html += '<div class="text-right mt-3"><button type="button" class="btn btn-primary btn-sm" id="profileStudentDocumentUploadSaveBtn" onclick="saveProfileStudentDocuments()">Save Uploaded Documents</button></div>';
    html += '</div></div>';
    return html;
}

function getProfileStudentDocumentEncodedPayload() {
    var userId = PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA .userId ? PROFILE_RESPONSE_DATA .userId : "";
    if (!userId) {
        return "";
    }
    try {
        return btoa(userId.toString());
    } catch (e) {
        return "";
    }
}

async function loadProfileStudentDocumentVerification() {
    if ($("#studentDocumentVerificationWrapper").length < 1) {
        return;
    }

    var encodedPayload = getProfileStudentDocumentEncodedPayload();
    if (!encodedPayload) {
        if ($("#studentDocumentUploadPanelWrapper").length > 0) {
            $("#studentDocumentUploadPanelWrapper").html('<div class="border rounded p-3 text-danger bg-light">Unable to load upload panel.</div>');
        }
        $("#studentDocumentVerificationWrapper").html('<div class="border rounded p-3 text-danger bg-light">Unable to load student documents.</div>');
        return;
    }

    if ($("#studentDocumentUploadPanelWrapper").length > 0) {
        $("#studentDocumentUploadPanelWrapper").html('<div class="border rounded p-3 text-muted bg-light">Loading upload panel...</div>');
    }
    $("#studentDocumentVerificationWrapper").html('<div class="border rounded p-3 text-muted bg-light">Loading documents...</div>');
    PROFILE_STUDENT_DOCUMENT_REUPLOADS = {};
    PROFILE_STUDENT_DOCUMENT_UPLOADS = {};
    PROFILE_STUDENT_DOCUMENT_BUCKETS = null;

    try {
        var documentsRequest = {
            method: "GET",
            url: BASE_URL + CONTEXT_PATH + "student/enrollment/get-documents?payload=" + encodeURIComponent(encodedPayload),
            global: false,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };
        var statusRequest = {
            method: "GET",
            url: BASE_URL + CONTEXT_PATH + "student/enrollment/get-documents-status?payload=" + encodeURIComponent(encodedPayload),
            global: false,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };
        var responseList = await Promise.all([
            callCommonAjax(documentsRequest),
            callCommonAjax(statusRequest)
        ]);
        PROFILE_STUDENT_DOCUMENTS_RESPONSE = responseList[0] || {};
        renderProfileStudentDocumentVerification(responseList[0] || {}, responseList[1] || {});
    } catch (e) {
        $("#studentDocumentVerificationWrapper").html('<div class="border rounded p-3 text-danger bg-light">Unable to load student documents.</div>');
    }
}

function renderProfileStudentDocumentVerification(documentsResponse, statusResponse) {
    var documents = documentsResponse && documentsResponse.documents ? documentsResponse.documents : [];
    var canEdit = canEditProfileStudentDocuments();
    PROFILE_STUDENT_DOCUMENT_BUCKETS = getProfileStudentDocumentBuckets(documentsResponse || {});
    var admissionStatus = normalizeProfileAdmissionStatus(
        (statusResponse && statusResponse.admissionStatus) ||
        (PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA.admissionStatus) ||
        ""
    );

    var html = '';
    if ($("#studentDocumentUploadPanelWrapper").length > 0) {
        if (canEdit && !PROFILE_STUDENT_DOCUMENT_UPLOAD_PANEL_HIDDEN) {
            $("#studentDocumentUploadPanelWrapper").html(getProfileStudentDocumentUploadPanel(documentsResponse || {}));
        } else {
            $("#studentDocumentUploadPanelWrapper").html("");
        }
    }

    if (canEdit) {
        html += '<div class="mb-3">';
        html += '<div class="font-weight-semi-bold text-dark">Student document verification</div>';
        html += '<small class="text-muted d-block">' + (canEdit ? 'Review submitted documents, verify them, or ask for re-upload.' : 'View submitted documents and their details.') + '</small>';
        html += '</div>';
        html += '<div class="row mb-3">';
        html += '<div class="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12">';
        html += '<label for="studentDocumentsStatus" class="font-weight-semi-bold text-dark">Student documents status</label>';
        html += '<select id="studentDocumentsStatus" class="form-control form-control-sm">';
        html += '<option value="">Select status</option>';
        html += '<option value="Enrollment On Hold">Enrollment On Hold</option>';
        html += '<option value="Enrollment Under Review">Enrollment Under Review</option>';
        html += '<option value="Enrollment Rejected">Enrollment Rejected</option>';
        html += '<option value="Enrollment Confirmed">Enrollment Confirmed</option>';
        html += '</select>';
        html += '</div>';
        html += '</div>';
    }

    if (documents.length < 1) {
        html += '<div class="border rounded p-3 text-muted bg-light">No submitted documents found for verification.</div>';
        $("#studentDocumentVerificationWrapper").html(html);
        if (canEdit && $("#studentDocumentsStatus").length > 0) {
            $("#studentDocumentsStatus").val(admissionStatus);
        }
        $("#studentDocumentVerificationSubmitBtn").prop("disabled", false);
        syncProfileStudentDobUploadState();
        return;
    }

    html += '<div class="table-responsive border rounded"><table class="table table-bordered table-sm mb-0">';
    html += '<thead class="bg-light"><tr>';
    html += '<th style="min-width:170px;">Document</th>';
    html += '<th style="min-width:210px;">Details</th>';
    if (canEdit) {
        // html += '<th style="min-width:150px;">Verification Required</th>';
        html += '<th style="min-width:150px;">Verified</th>';
        html += '<th style="min-width:220px;">Remark</th>';
        html += '<th style="min-width:250px;">Re-upload</th>';
    } else {
        html += '<th style="min-width:120px;">Verified</th>';
        // html += '<th style="min-width:150px;">Verification Required</th>';
        html += '<th style="min-width:220px;">Remark</th>';
    }
    html += '</tr></thead><tbody>';

    $.each(documents, function (index, doc) {
        var docTitle = getProfileStudentDocumentTitle(doc, index);
        var verifiedValue = ((doc.isDocumentVerified || "N") + "").toUpperCase();
        var verificationRequiredValue = ((doc.isVerificationRequired || "Y") + "").toUpperCase();
        var fileUrl = doc.fileUrl || "";
        var fileExt = getProfileStudentDocumentFileExtFromUrl(fileUrl);
        html += '<tr id="profileStudentDocumentRow_' + doc.id + '">';
        html += '<td>';
        html += '<div class="font-weight-semi-bold text-dark">' + escapeHtml(docTitle) + '</div>';
        // html += '<div class="text-muted font-11">Doc ID: ' + (doc.id || "") + '</div>';
        if (fileUrl) {
            html += '<div class="mt-2"><button type="button" class="btn btn-primary btn-sm" data-file-url="' + escapeHtml(fileUrl) + '" data-file-ext="' + escapeHtml(fileExt) + '" onclick="viewProfileStudentVerificationDocument(this.getAttribute(\'data-file-url\'), this.getAttribute(\'data-file-ext\'))"><i class="fa fa-eye mr-1"></i>View</button></div>';
        }
        html += '</td>';
        html += '<td>' + getProfileStudentDocumentMetaHtml(doc) + '</td>';
        if (canEdit) {
            // html += '<td><select class="form-control form-control-sm" id="profileStudentDocRequired_' + doc.id + '" onchange="toggleProfileStudentDocumentReupload(' + doc.id + ')">';
            // html += '<option value="Y"' + (verificationRequiredValue === "Y" ? ' selected' : '') + '>Yes</option>';
            // html += '<option value="N"' + (verificationRequiredValue === "N" ? ' selected' : '') + '>No</option>';
            // html += '</select></td>';
            html += '<td><select class="form-control form-control-sm" id="profileStudentDocVerified_' + doc.id + '" onchange="toggleProfileStudentDocumentReupload(' + doc.id + ')">';
            html += '<option value="Y"' + (verifiedValue === "Y" ? ' selected' : '') + '>Yes</option>';
            html += '<option value="N"' + (verifiedValue === "N" ? ' selected' : '') + '>No</option>';
            html += '</select></td>';
            html += '<td><textarea class="form-control form-control-sm" rows="3" id="profileStudentDocRemark_' + doc.id + '" placeholder="Enter verification remark">' + escapeHtml(doc.verificationRemark || "") + '</textarea></td>';
            html += '<td>';
            html += '<div id="profileStudentDocUploadBlock_' + doc.id + '"' + (verifiedValue === "N" ? '' : ' style="display:none;"') + '>';
            html += '<div class="upload-btn-wrapper w-100 mb-2">';
            html += '<input class="file-input" type="file" id="profileStudentDocUpload_' + doc.id + '" onchange="onProfileStudentDocumentReuploadChange(this, ' + doc.id + ', ' + (doc.fileType || 80) + ')" />';
            html += '<span class="btn btn-light border w-100 text-left mt-0"><i class="fa fa-file-text-o mr-1 primary-txt-color"></i><span class="text-muted" id="profileStudentDocUploadName_' + doc.id + '">Upload your file</span></span>';
            html += '</div>';
            html += '<div class="d-flex align-items-center">';
            html += '<button type="button" class="btn btn-primary btn-sm mr-1" id="profileStudentDocUploadView_' + doc.id + '" style="display:none;" onclick="previewProfileStudentDocumentReupload(' + doc.id + ')"><i class="fa fa-eye"></i></button>';
            html += '<button type="button" class="btn btn-danger btn-sm" id="profileStudentDocUploadRemove_' + doc.id + '" style="display:none;" onclick="removeProfileStudentDocumentReupload(' + doc.id + ')"><i class="fa fa-trash"></i></button>';
            html += '</div>';
            html += '<small class="text-muted d-block mt-2">Upload JPG, JPEG, PNG or PDF up to 5 MB.</small>';
            html += '</div>';
            html += '</td>';
        } else {
            html += '<td>' + (verifiedValue === "Y" ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-warning">No</span>') + '</td>';
            // html += '<td>' + (verificationRequiredValue === "Y" ? '<span class="badge badge-info">Yes</span>' : '<span class="badge badge-secondary">No</span>') + '</td>';
            html += '<td>' + (doc.verificationRemark ? escapeHtml(doc.verificationRemark) : '<span class="text-muted">N/A</span>') + '</td>';
        }
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    $("#studentDocumentVerificationWrapper").html(html);
    if (canEdit && $("#studentDocumentsStatus").length > 0) {
        $("#studentDocumentsStatus").val(admissionStatus);
    }
    $("#studentDocumentVerificationSubmitBtn").prop("disabled", false);
    syncProfileStudentDobUploadState();
}

function getProfileStudentDocumentTitle(doc, index) {
    if (doc.fileType == 78) {
        return "Passport Size Photo";
    }
    if (doc.fileType == 79) {
        return "Date Of Birth Proof";
    }
    if (doc.standardName || doc.documentName) {
        return $.trim((doc.standardName || "") + (doc.documentName ? " - " + doc.documentName : ""));
    }
    return "Document " + (index + 1);
}

function getProfileStudentDocumentMetaHtml(doc) {
    var details = [];
    var docKey = getProfileStudentDocumentKey(doc);
    var attachments = PROFILE_STUDENT_DOCUMENTS_RESPONSE && PROFILE_STUDENT_DOCUMENTS_RESPONSE.attachments ? PROFILE_STUDENT_DOCUMENTS_RESPONSE.attachments : {};
    var fileName = doc.fileOriginalName || doc.uploadFileName || "";
    if (docKey === "passport") {
        fileName = fileName || attachments.passportSizePhotoName || attachments.passportSizePhotoDocumentName || "";
    } else if (docKey === "dob") {
        fileName = fileName || attachments.dobProofName || attachments.dobProofDocumentName || "";
    }
    if (doc.attachmentId) {
        details.push('<div><span class="font-weight-semi-bold">Attachment ID:</span> ' + escapeHtml(doc.attachmentId) + '</div>');
    }
    if (fileName) {
        details.push('<div><span class="font-weight-semi-bold">Name:</span> ' + escapeHtml(fileName) + '</div>');
    }
    if (doc.schoolName) {
        details.push('<div><span class="font-weight-semi-bold">School:</span> ' + escapeHtml(doc.schoolName) + '</div>');
    }
    if (doc.boardName) {
        details.push('<div><span class="font-weight-semi-bold">Board:</span> ' + escapeHtml(doc.boardName) + '</div>');
    }
    if (doc.passingYear) {
        details.push('<div><span class="font-weight-semi-bold">Passing Year:</span> ' + escapeHtml(doc.passingYear) + '</div>');
    }
    // if (doc.submittedDate) {
    //     details.push('<div><span class="font-weight-semi-bold">Submitted:</span> ' + escapeHtml(doc.submittedDate) + '</div>');
    // }
    // if (doc.fileOriginalName) {
    //     details.push('<div class="text-muted font-11 mt-1">' + escapeHtml(doc.fileOriginalName) + '</div>');
    // }
    return details.join("") || '<span class="text-muted">No additional details</span>';
}

function getProfileStudentDocumentFileExtFromUrl(url) {
    try {
        var cleanUrl = (url || "").split("?")[0];
        return (cleanUrl.split(".").pop() || "pdf").toLowerCase();
    } catch (e) {
        return "pdf";
    }
}

function viewProfileStudentVerificationDocument(fileUrl, fileExt) {
    $("#uploadFile .upload_pdf .pre_upload_pdf").remove();
    if (["png", "jpg", "jpeg"].indexOf((fileExt || "").toLowerCase()) > -1) {
        $("#uploadFile .upload_img img").attr("src", fileUrl);
        $("#uploadFile .upload_img").removeClass("d-none");
        $("#uploadFile .upload_pdf").addClass("d-none");
    } else {
        $("#uploadFile .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;width:100%;" data="' + fileUrl + '"></object>');
        $("#uploadFile .upload_pdf a.download-pdf-btn").attr("href", fileUrl);
        $("#uploadFile .upload_pdf").removeClass("d-none");
        $("#uploadFile .upload_img").addClass("d-none");
    }
    $("#uploadFile").modal("show");
}

function toggleProfileStudentDocumentReupload(docId) {
    var verifiedValue = $("#profileStudentDocVerified_" + docId).val();
    if (verifiedValue === "N") {
        $("#profileStudentDocUploadBlock_" + docId).slideDown(150);
    } else {
        $("#profileStudentDocUploadBlock_" + docId).slideUp(150);
        removeProfileStudentDocumentReupload(docId);
    }
}

function isValidProfileStudentDocumentFile(file) {
    var allowed = /^(image\/(png|jpe?g)|application\/pdf)$/i;
    if (!allowed.test(file.type)) {
        showMessageTheme2(0, "Please upload files in following formats (jpg, jpeg, pdf or png).");
        return false;
    }
    if (file.size > (5 * 1024 * 1024)) {
        showMessageTheme2(0, "Please upload maximum 5MB file in size.");
        return false;
    }
    return true;
}

function readProfileStudentDocumentAsBase64(file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (e) {
            resolve((e.target.result || "").split(",")[1] || "");
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function onProfileStudentDocumentReuploadChange(src, docId, fileType) {
    var file = src.files && src.files[0] ? src.files[0] : null;
    if (!file) {
        return;
    }
    if (!isValidProfileStudentDocumentFile(file)) {
        $(src).val("");
        return;
    }
    var fileContent = await readProfileStudentDocumentAsBase64(file);
    PROFILE_STUDENT_DOCUMENT_REUPLOADS[docId] = {
        fileName: file.name,
        fileType: fileType,
        mimeType: file.type,
        fileContent: fileContent
    };
    $("#profileStudentDocUploadName_" + docId).text(file.name);
    $("#profileStudentDocUploadView_" + docId + ", #profileStudentDocUploadRemove_" + docId).show();
}

async function onProfileStudentDocumentUploadChange(src, docKey, fileType) {
    var file = src.files && src.files[0] ? src.files[0] : null;
    if (!file) {
        return;
    }
    if (!isValidProfileStudentDocumentFile(file)) {
        $(src).val("");
        return;
    }
    var fileContent = await readProfileStudentDocumentAsBase64(file);
    PROFILE_STUDENT_DOCUMENT_UPLOADS[docKey] = {
        fileName: file.name,
        fileType: fileType,
        mimeType: file.type,
        fileContent: fileContent
    };
    if (docKey === "passport") {
        $("#profileStudentDocPassportFileName").text(file.name);
        $("#profileStudentDocPassportView, #profileStudentDocPassportRemove").show();
    } else if (docKey === "dob") {
        $("#profileStudentDocDobFileName").text(file.name);
        $("#profileStudentDocDobView, #profileStudentDocDobRemove").show();
    } else {
        $("#profileStudentAcademicFileName_" + docKey).text(file.name);
        $("#profileStudentAcademicView_" + docKey + ", #profileStudentAcademicRemove_" + docKey).show();
    }
}

function removeProfileStudentDocumentReupload(docId) {
    delete PROFILE_STUDENT_DOCUMENT_REUPLOADS[docId];
    $("#profileStudentDocUpload_" + docId).val("");
    $("#profileStudentDocUploadName_" + docId).text("Upload your file");
    $("#profileStudentDocUploadView_" + docId + ", #profileStudentDocUploadRemove_" + docId).hide();
}

function removeProfileStudentDocumentUpload(docKey) {
    delete PROFILE_STUDENT_DOCUMENT_UPLOADS[docKey];
    if (docKey === "passport") {
        $("#profileStudentDocPassportFile").val("");
        $("#profileStudentDocPassportFileName").text("Upload your file");
        $("#profileStudentDocPassportView, #profileStudentDocPassportRemove").hide();
    } else if (docKey === "dob") {
        $("#profileStudentDocDobFile").val("");
        $("#profileStudentDocDobFileName").text($.trim($("#profileStudentDocDobProofType").val()) !== "" ? "Upload your file" : "Select proof type first");
        $("#profileStudentDocDobView, #profileStudentDocDobRemove").hide();
    } else {
        $("#profileStudentAcademicFile_" + docKey).val("");
        $("#profileStudentAcademicFileName_" + docKey).text("Upload your file");
        $("#profileStudentAcademicView_" + docKey + ", #profileStudentAcademicRemove_" + docKey).hide();
    }
}

function profileStudentDocumentBase64ToBlob(base64Content, mimeType) {
    var byteCharacters = atob(base64Content);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += 512) {
        var slice = byteCharacters.slice(offset, offset + 512);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, { type: mimeType || "application/octet-stream" });
}

function previewProfileStudentDocumentReupload(docId) {
    var upload = PROFILE_STUDENT_DOCUMENT_REUPLOADS[docId];
    if (!upload || !upload.fileContent) {
        return;
    }

    if (PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL && PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL.indexOf("blob:") === 0) {
        try {
            URL.revokeObjectURL(PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL);
        } catch (e) { }
    }
    PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL = URL.createObjectURL(profileStudentDocumentBase64ToBlob(upload.fileContent, upload.mimeType));
    var fileExt = upload.mimeType && upload.mimeType.indexOf("image/") === 0 ? (upload.mimeType.indexOf("png") > -1 ? "png" : "jpg") : "pdf";
    viewProfileStudentVerificationDocument(PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL, fileExt);
    $("#uploadFile").one("hidden.bs.modal", function () {
        if (PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL && PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL.indexOf("blob:") === 0) {
            try {
                URL.revokeObjectURL(PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL);
            } catch (e) { }
        }
        PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL = "";
    });
}

function previewProfileStudentDocumentUpload(docKey) {
    var upload = PROFILE_STUDENT_DOCUMENT_UPLOADS[docKey];
    if (!upload || !upload.fileContent) {
        return;
    }

    if (PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL && PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL.indexOf("blob:") === 0) {
        try {
            URL.revokeObjectURL(PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL);
        } catch (e) { }
    }
    PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL = URL.createObjectURL(profileStudentDocumentBase64ToBlob(upload.fileContent, upload.mimeType));
    var fileExt = upload.mimeType && upload.mimeType.indexOf("image/") === 0 ? (upload.mimeType.indexOf("png") > -1 ? "png" : "jpg") : "pdf";
    viewProfileStudentVerificationDocument(PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL, fileExt);
    $("#uploadFile").one("hidden.bs.modal", function () {
        if (PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL && PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL.indexOf("blob:") === 0) {
            try {
                URL.revokeObjectURL(PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL);
            } catch (e) { }
        }
        PROFILE_STUDENT_DOCUMENT_PREVIEW_BLOB_URL = "";
    });
}

function buildProfileStudentDocumentUploadPayload() {
    var payload = {
        userId: parseInt(PROFILE_RESPONSE_DATA .userId),
        attachments: []
    };

    if (PROFILE_STUDENT_DOCUMENT_UPLOADS.passport) {
        var passportMeta = getProfileStudentUploadMeta("passport");
        payload.attachments.push({
            isReupload: passportMeta.isReupload,
            attachmentId: passportMeta.attachmentId,
            fileName: PROFILE_STUDENT_DOCUMENT_UPLOADS.passport.fileName,
            fileType: 78,
            fileContent: PROFILE_STUDENT_DOCUMENT_UPLOADS.passport.fileContent
        });
    }
    if (PROFILE_STUDENT_DOCUMENT_UPLOADS.dob) {
        var dobMeta = getProfileStudentUploadMeta("dob");
        payload.attachments.push({
            isReupload: dobMeta.isReupload,
            attachmentId: dobMeta.attachmentId,
            dobProof: $("#profileStudentDocDobProofType").val(),
            fileName: PROFILE_STUDENT_DOCUMENT_UPLOADS.dob.fileName,
            fileType: 79,
            fileContent: PROFILE_STUDENT_DOCUMENT_UPLOADS.dob.fileContent
        });
    }

    var requiredGrades = getProfileRequiredAcademicDocumentGrades(getProfileCurrentGradeId());
    $.each(requiredGrades, function (index, gradeInfo) {
        var rowKey = "acad_" + gradeInfo.key;
        var uploaded = PROFILE_STUDENT_DOCUMENT_UPLOADS[rowKey];
        if (!uploaded) {
            return;
        }
        var academicMeta = getProfileStudentUploadMeta(rowKey);
        payload.attachments.push({
            isReupload: academicMeta.isReupload,
            attachmentId: academicMeta.attachmentId,
            standardId: parseInt(gradeInfo.key, 10),
            documentName: getProfileAcademicDocInputValue(rowKey, "profileStudentDocName"),
            schoolName: getProfileAcademicDocInputValue(rowKey, "profileStudentSchoolName"),
            boardName: getProfileAcademicDocInputValue(rowKey, "profileStudentBoardName"),
            passingYear: parseInt(getProfileAcademicDocInputValue(rowKey, "profileStudentPassingYear"), 10),
            fileName: uploaded.fileName,
            fileType: 80,
            fileContent: uploaded.fileContent
        });
    });

    return payload;
}

function validateProfileStudentDocumentUploadPayload(payload) {
    var existingMap = PROFILE_STUDENT_DOCUMENT_BUCKETS && PROFILE_STUDENT_DOCUMENT_BUCKETS.existingMap ? PROFILE_STUDENT_DOCUMENT_BUCKETS.existingMap : {};

    if (!PROFILE_STUDENT_DOCUMENT_UPLOADS.passport && !existingMap.passport) {
        showMessageTheme2(0, "Please upload Passport Size Photo.");
        return false;
    }
    if (!$("#profileStudentDocDobProofType").val() && (PROFILE_STUDENT_DOCUMENT_UPLOADS.dob || existingMap.dob)) {
        showMessageTheme2(0, "Please select Date of Birth proof type.");
        return false;
    }
    if (!PROFILE_STUDENT_DOCUMENT_UPLOADS.dob && !existingMap.dob) {
        showMessageTheme2(0, "Please upload Date of Birth proof document.");
        return false;
    }

    var requiredGrades = getProfileRequiredAcademicDocumentGrades(getProfileCurrentGradeId());
    for (var i = 0; i < requiredGrades.length; i++) {
        var gradeInfo = requiredGrades[i];
        var rowKey = "acad_" + gradeInfo.key;
        var documentName = getProfileAcademicDocInputValue(rowKey, "profileStudentDocName");
        var schoolName = getProfileAcademicDocInputValue(rowKey, "profileStudentSchoolName");
        var boardName = getProfileAcademicDocInputValue(rowKey, "profileStudentBoardName");
        var passingYear = getProfileAcademicDocInputValue(rowKey, "profileStudentPassingYear");
        var uploadedDoc = PROFILE_STUDENT_DOCUMENT_UPLOADS[rowKey];
        var existingDoc = existingMap[rowKey] || {};
        documentName = documentName || $.trim(existingDoc.documentName || "");
        schoolName = schoolName || $.trim(existingDoc.schoolName || "");
        boardName = boardName || $.trim(existingDoc.boardName || "");
        passingYear = passingYear || $.trim(existingDoc.passingYear || "");
        if (documentName === "" || schoolName === "" || boardName === "" || passingYear === "") {
            showMessageTheme2(0, isProfileFlexyAcademicDocumentFlow(getProfileCurrentGradeId()) ? "Please fill all academic documents." : "Please fill all academic document details for " + gradeInfo.value + ".");
            return false;
        }
        if (!/^\d{4}$/.test(passingYear)) {
            showMessageTheme2(0, "Passing year must be a 4 digit year for " + gradeInfo.value + ".");
            return false;
        }
        if (!uploadedDoc && !existingDoc.attachmentId) {
            showMessageTheme2(0, isProfileFlexyAcademicDocumentFlow(getProfileCurrentGradeId()) ? "Please upload academic document file." : "Please upload academic document file for " + gradeInfo.value + ".");
            return false;
        }
    }
    if (!payload || !payload.attachments || payload.attachments.length < 1) {
        showMessageTheme2(0, "No new document selected to save.");
        return false;
    }
    return true;
}

async function saveProfileStudentDocuments() {
    var payload = buildProfileStudentDocumentUploadPayload();
    if (!validateProfileStudentDocumentUploadPayload(payload)) {
        return false;
    }

    $("#profileStudentDocumentUploadSaveBtn").prop("disabled", true);
    try {
        var ajaxReqDetails = {
            method: "POST",
            url: BASE_URL + CONTEXT_PATH + "student/enrollment/save-documents",
            body: payload,
            global: true,
            showMessage: true
        };
        var responseData = await callCommonAjax(ajaxReqDetails);
        if (responseData && !(responseData.status == '0' || responseData.status == '2' || responseData.status == '3')) {
            PROFILE_STUDENT_DOCUMENT_UPLOADS = {};
            PROFILE_STUDENT_DOCUMENT_UPLOAD_PANEL_HIDDEN = true;
            await loadProfileStudentDocumentVerification();
        } else {
            $("#profileStudentDocumentUploadSaveBtn").prop("disabled", false);
        }
    } catch (e) {
        showMessageTheme2(0, "Unable to upload student documents.");
        $("#profileStudentDocumentUploadSaveBtn").prop("disabled", false);
    }
    return false;
}

function buildProfileStudentDocumentVerificationPayload() {
    var documents = PROFILE_STUDENT_DOCUMENTS_RESPONSE && PROFILE_STUDENT_DOCUMENTS_RESPONSE.documents ? PROFILE_STUDENT_DOCUMENTS_RESPONSE.documents : [];
    var admissionStatus = normalizeProfileAdmissionStatus($("#studentDocumentsStatus").val());
    var allDocumentsVerified = (documents.length > 0);

    var payload = {
        userId: parseInt(PROFILE_RESPONSE_DATA .userId),
        studentStandardId: parseInt(PROFILE_RESPONSE_DATA .studentStandardId),
        admissionStatus: admissionStatus,
        documents: []
    };

    for (var i = 0; i < documents.length; i++) {
        var doc = documents[i];
        var verifiedValue = ($("#profileStudentDocVerified_" + doc.id).val() || "N").toUpperCase();
        var verificationRequiredValue = ((doc.isVerificationRequired || "Y") + "").toUpperCase();
        var verificationRemark = $.trim($("#profileStudentDocRemark_" + doc.id).val());
        if (verifiedValue === "N" && verificationRemark === "") {
            showMessageTheme2(0, "Please enter verification remark for rejected documents.");
            $("#profileStudentDocRemark_" + doc.id).focus();
            return null;
        }
        var payloadDoc = {
            id: doc.id,
            attachmentId: doc.attachmentId,
            fileName: (PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id] && PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id].fileName) || doc.fileOriginalName || "",
            fileType: (PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id] && PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id].fileType) || doc.fileType || "",
            isDocumentVerified: verifiedValue,
            isVerificationRequired: verificationRequiredValue,
            verificationRemark: verificationRemark
        };
        if (verifiedValue === "N") {
            allDocumentsVerified = false;
            payloadDoc.fileContent = (PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id] && PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id].fileContent) || "";
            payloadDoc.fileName = (PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id] && PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id].fileName) || payloadDoc.fileName;
            payloadDoc.fileType = (PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id] && PROFILE_STUDENT_DOCUMENT_REUPLOADS[doc.id].fileType) || payloadDoc.fileType;
        } else {
            payloadDoc.fileContent = "";
        }
        payload.documents.push(payloadDoc);
    }

    if (allDocumentsVerified) {
        payload.admissionStatus = "Enrollment Confirmed";
        if ($("#studentDocumentsStatus").length > 0) {
            $("#studentDocumentsStatus").val("Enrollment Confirmed");
        }
    }

    if (!payload.admissionStatus) {
        showMessageTheme2(0, "Please select student documents status.");
        return null;
    }

    return payload;
}

async function submitStudentDocumentVerification() {
    var payload = buildProfileStudentDocumentVerificationPayload();
    if (!payload) {
        return false;
    }

    $("#studentDocumentVerificationSubmitBtn").prop("disabled", true);
    try {
        var ajaxReqDetails = {
            method: "POST",
            url: BASE_URL + CONTEXT_PATH + "student/enrollment/verify-documents",
            body: payload,
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };
        var responseData = await callCommonAjax(ajaxReqDetails);
        if (responseData && responseData.status == 1) {
            showMessageTheme2(1, "Document review completed");
            await loadProfileStudentDocumentVerification();
        } else {
            showMessageTheme2(0, responseData && responseData.message ? responseData.message : "Unable to verify student documents.");
            $("#studentDocumentVerificationSubmitBtn").prop("disabled", false);
        }
    } catch (e) {
        showMessageTheme2(0, "Unable to verify student documents.");
        $("#studentDocumentVerificationSubmitBtn").prop("disabled", false);
    }
    return false;
}

function removeUploadImage(src, inputId, thumbId, type, userId, studentStandardId, removeType) {
    if ($("#" + thumbId).attr("src").split(":")[0] == "https" || $("#" + thumbId).attr("src").split(":")[0] == "http" || $("#" + thumbId).attr("src").split(":")[0] == "data") {
        var data = {};
        if($("#"+inputId).attr("data-element-id") != null && $("#"+inputId).attr("data-element-id") != undefined && $("#"+inputId).attr("data-element-id") != ""){
            data['customProfileFieldId']=$("#"+inputId).attr("data-element-id");
            data['type'] = "CUSTOM_FILE";
        }else{
            data['type'] = type;
        }
        data['userId'] = userId;
        data['studentStandardId'] = studentStandardId;
       
        $.ajax({
            type: "POST",
            contentType: APPLICATION_JSON_VALUE,
            url: getURLForHTML('dashboard', 'delete-uploaded-docs'),
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            success: function (data) {
                if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                    if (data['status'] == '3') {
                        redirectLoginPage();
                    } else {
                       showMessageTheme2(0, data['MESSAGE'], '', true);
                    }
                } else {
                    // Do here 
                    showMessageTheme2(1, 'Document(s) removed', '', true);

                }
            }
        });
    }
    for (var i = 0; i < STUDENT_UPLOAD_DOCUMENTS.length; i++) {
        if (STUDENT_UPLOAD_DOCUMENTS[i].docType === type) {
            STUDENT_UPLOAD_DOCUMENTS.splice(i, 1);
            // console.log(STUDENT_UPLOAD_DOCUMENTS);
        }
    }
    $("#" + inputId).val("");
    $("#" + thumbId).attr("src", PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION);
    $("#" + thumbId).attr("thumbtype", "img")
    $("#" + inputId + "div").attr("data-base64url", PATH_FOLDER_IMAGE2 + 'no-image.jpg' + SCRIPT_VERSION);
    $("#" + inputId + "div").show();
    $('#' + inputId + 'Remove').hide();
    if (removeType == "new") {
        $('#' + inputId + 'ViewBtn').hide();
    }
    $('.removeDocBtn').each(function (index) {
        if ($(this).attr('style') == 'display: none') {
            $("#allDocsNotUploaded").show();
            $("#allDocsUploaded").hide();
        } else {
            $("#allDocsNotUploaded").show();
            $("#allDocsUploaded").hide();
        }
    });
    $("#" + inputId + "FileName").text("");
}

function viewAttachmentProfile(src, modalId, attachmentType, baseUrlEleID) {
    var thumbImgType = $(src).find("img").attr("thumbType");
    var base64URL;

    // Get the base64 PDF or image URL
    if (attachmentType == 'I' && thumbImgType == "pdf") {
        base64URL = $("#" + baseUrlEleID).attr('data-PDFURL');
    } else if (attachmentType == 'P' && thumbImgType == "") {
        base64URL = $("#" + baseUrlEleID).attr('data-PDFURL');
    } else {
        base64URL = $("#" + baseUrlEleID).attr('data-PDFURL');
    }

    //   console.log(base64URL);

    // --- 🖼️ IMAGE HANDLING ---
    if (attachmentType == 'I' && thumbImgType != 'pdf') {
        $("#" + modalId + " .upload_img img").attr('src', base64URL);
        $("#" + modalId + ' .upload_img').removeClass("d-none");
        $("#" + modalId + " .upload_pdf").addClass("d-none");
    }

    // --- 📄 PDF HANDLING ---
    else {
        // Remove existing PDF preview
        $("#" + modalId + " .upload_pdf .pre_upload_pdf").remove();

        // ✅ Chrome-safe PDF rendering via Blob URL
        var pdfUrl = base64URL;
        if (base64URL && base64URL.startsWith("data:application/pdf;base64,")) {
            try {
                var byteCharacters = atob(base64URL.split(',')[1]);
                var byteNumbers = new Array(byteCharacters.length);
                for (var i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                var byteArray = new Uint8Array(byteNumbers);
                var blob = new Blob([byteArray], { type: 'application/pdf' });
                pdfUrl = URL.createObjectURL(blob);
            } catch (e) {
                console.error("PDF Blob conversion failed:", e);
            }
        }

        // Append Chrome-safe PDF viewer
        $("#" + modalId + " .upload_pdf#pre_upload_pdf_div").append(
            `<object type="application/pdf" class="pre_upload_pdf full" style="height:400px;width:100%;" data="${pdfUrl}"></object>`
        );

        // Set download link to the original Base64 URL
        $("#" + modalId + " .upload_pdf a.download-pdf-btn").attr("href", base64URL);

        $("#" + modalId + " .upload_pdf").removeClass("d-none");
        $("#" + modalId + ' .upload_img').addClass("d-none");

        // Revoke blob URL when modal closes (clean memory)
        $("#" + modalId).one("hidden.bs.modal", function () {
            if (pdfUrl.startsWith("blob:")) {
                URL.revokeObjectURL(pdfUrl);
            }
        });
    }

    // Show source and modal
    $(src).show();
    $("#" + modalId).modal("show");
}

function showLearningProgamGradePlatformModal() {
    $("#changeLearingProgramGradeModal").modal('show');
}
function openConfirmSaveModal() {
    $("#confirmSaveModal").modal('show');
}

function changeLearningProgamGradePlatformModal(studentStandardId) {
    var newLearningProgram = $('#studentRegistrationType').val();
    var newStandardId = $('#changeLearingProgramGradeModal #standardId').val();
    var newCourseProviderId = $('#lmsPlatform').val();
    // if(currentLearningProgram==newLearningProgram && currentStandardId==newStandardId && currentLmsPlatform==newLmsPlatform){
    // 	showMessageTheme2(0,"To proceed this request, please change Learning Progam or Grade or LMS Platform",'',false);
    // 	return false;
    // }
    var data = {};
    data['schoolId'] = SCHOOL_ID;
    data['userId'] = USER_ID;
    data['studentStandardId'] = studentStandardId;
    data['learningProgram'] = newLearningProgram;
    data['standardId'] = newStandardId;
    data['courseProviderId'] = newCourseProviderId;
    var currentEnrollmentFor = 'enrollment';
    if (newCourseProviderId == 39) {
        currentEnrollmentFor = 'exact-path-enrollment';
    }
    data['enrollmentFor'] = currentEnrollmentFor;

    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'change-learning-program-grade-platform'),
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    showMessageTheme2(false, data['message'], '', true);
                }
            } else {
                $("#confirmSaveModal").modal('hide');
                $("#changeLearingProgramGradeModal").modal('hide');
                $("#grade").val($("#changeLearingProgramGradeModal #standardId").val()).trigger("change");
                $("#learningProgram").val($("#studentRegistrationType").val()).trigger("change");
                $("#studentCourseProviderId").val($("#lmsPlatform").val()).trigger("change");
                // $("#lmsPlatformText").text($('#lmsPlatform option:selected').text());
                // $("#learningProgramText").text($('#studentRegistrationType option:selected').text());
                // $("#standardIdText").text($('#standardId option:selected').text());
                // if($('#lmsPlatform option:selected').val()==39){
                // 	$(".standardViewName").html($('#lmsPlatform option:selected').text()+' | '+$('#studentRegistrationType option:selected').text());
                // }else{
                // 	$(".standardViewName").html($('#standardId option:selected').text()+' | '+$('#studentRegistrationType option:selected').text());
                // }
                $(".compulsorySubjectsdiv").html(courseDetails(data.details.subjects, $('#changeLearingProgramGradeModal #standardId option:selected').text()))
                if ($('#studentRegistrationType').val() == 'DUAL_DIPLOMA') {
                    $("#dualDiplomaAdditionalDetails").show();
                } else if ($('#studentRegistrationType').val() == 'ONE_TO_ONE_FLEX') {
                    $("#dualDiplomaAdditionalDetails").hide();
                } else {
                    $("#dualDiplomaAdditionalDetails").hide();
                }
                showMessageTheme2(true, 'Profile updated successfully', '', true);
            }
        }
    });
}

function courseDetails(subjectsList, grade) {
    var html =
        `<span class="font-weight-semi-bold text-dark">Course (${grade})</span>
        <ul class="p-0 mt-2">`;
    if (subjectsList.length > 0) {
        $.each(subjectsList, function (i, v) {
            html += `<li class="d-inline-block p-1 px-2 mr-1 rounded bg-primary text-white font-11 mb-1">${v}</li>`;
        });
    }
    html += `</ul>`;
    return html;
}

// function validateUserProfile(formId){
//     if($("#"+formId+" #firstName").val() == null || $("#"+formId+" #firstName").val() == undefined || $("#"+formId+" #firstName").val() == ''){
//         showMessageTheme2(0, "First name is required");
//         return false;
//     }
//     if($("#"+formId+" #middleName").val() == null || $("#"+formId+" #middleName").val() == undefined || $("#"+formId+" #middleName").val() == ''){
//         showMessageTheme2(0, "Middle name is required");
//         return false;
//     }
//     if($("#"+formId+" #lastName").val() == null || $("#"+formId+" #lastName").val() == undefined || $("#"+formId+" #lastName").val() == ''){
//         showMessageTheme2(0, "Last name is required");
//         return false;
//     }
//     if($("#"+formId+" #gender").val() == null || $("#"+formId+" #gender").val() == undefined || $("#"+formId+" #gender").val() == ''){
//         showMessageTheme2(0, "Gender is required");
//         return false;
//     }
//     if($("#"+formId+" #dob").val() == null || $("#"+formId+" #dob").val() == undefined || $("#"+formId+" #dob").val() == ''){
//         showMessageTheme2(0, "Date of birth is required");
//         return false;
//     }
//     if($("#"+formId+" #phoneNumber").val() == null || $("#"+formId+" #phoneNumber").val() == undefined || $("#"+formId+" #phoneNumber").val() == ''){
//         showMessageTheme2(0, "Phone number is required");
//         return false;
//     }
//     if($("#"+formId+" #altPhoneNumber").val() == null || $("#"+formId+" #altPhoneNumber").val() == undefined || $("#"+formId+" #altPhoneNumber").val() == ''){
//         showMessageTheme2(0, "Alternate Phone number is required");
//         return false;
//     }
//     if($("#"+formId+" #emailId").val() == null || $("#"+formId+" #emailId").val() == undefined || $("#"+formId+" #emailId").val() == ''){
//         showMessageTheme2(0, "Email is required");
//         return false;
//     }
//     if($("#"+formId+" #altEmailId").val() == null || $("#"+formId+" #altEmailId").val() == undefined || $("#"+formId+" #altEmailId").val() == ''){
//         showMessageTheme2(0, "Alternate email is required");
//         return false;
//     }
//     if($("#"+formId+" #country").val() == null || $("#"+formId+" #country").val() == undefined || $("#"+formId+" #country").val() == ''){
//         showMessageTheme2(0, "Country is required");
//         return false;
//     }
//     if($("#"+formId+" #state").val() == null || $("#"+formId+" #state").val() == undefined || $("#"+formId+" #state").val() == ''){
//         showMessageTheme2(0, "State is required");
//         return false;
//     }
//     if($("#"+formId+" #city").val() == null || $("#"+formId+" #city").val() == undefined || $("#"+formId+" #city").val() == ''){
//         showMessageTheme2(0, "City is required");
//         return false;
//     }
//     if($("#"+formId+" #timezone").val() == null || $("#"+formId+" #timezone").val() == undefined || $("#"+formId+" #timezone").val() == ''){
//         showMessageTheme2(0, "Timezone is required");
//         return false;
//     }
//     if($("#"+formId+" #nationality").val() == null || $("#"+formId+" #nationality").val() == undefined || $("#"+formId+" #nationality").val() == ''){
//         showMessageTheme2(0, "Nationality is required");
//         return false;
//     }
//     if($("#"+formId+" #address").val() == null || $("#"+formId+" #address").val() == undefined || $("#"+formId+" #address").val() == ''){
//         showMessageTheme2(0, "Address is required");
//         return false;
//     }
//     if($("#"+formId+" .hobbies-wrapper .custom-checkbox .custom-control-input:checked").length < 1){
//         showMessageTheme2(0, "Hobbies is required");
//         return false;
//     }
//     if($("#"+formId+" #address").val() == null || $("#"+formId+" #address").val() == undefined || $("#"+formId+" #address").val() == ''){
//         showMessageTheme2(0, "Address is required");
//         return false;
//     }
// // Parent/Guardian Information Validation Start Here //
//     if($("#"+formId+" #motherName").val() == null || $("#"+formId+" #motherName").val() == undefined || $("#"+formId+" #motherName").val() == ''){
//         showMessageTheme2(0, "Mother name is required");
//         return false;
//     }
//     if($("#"+formId+" #motherName").val() == null || $("#"+formId+" #motherName").val() == undefined || $("#"+formId+" #motherName").val() == ''){
//         showMessageTheme2(0, "Mother name is required");
//         return false;
//     }
//     if($("#"+formId+" #motherName").val() == null || $("#"+formId+" #motherName").val() == undefined || $("#"+formId+" #motherName").val() == ''){
//         showMessageTheme2(0, "Mother name is required");
//         return false;
//     }
//     if($("#"+formId+" #motherPhoneNumber").val() == null || $("#"+formId+" #motherPhoneNumber").val() == undefined || $("#"+formId+" #motherPhoneNumber").val() == ''){
//         showMessageTheme2(0, "Mother phone number is required");
//         return false;
//     }
//     if($("#"+formId+" #motherEmail").val() == null || $("#"+formId+" #motherEmail").val() == undefined || $("#"+formId+" #motherEmail").val() == ''){
//         showMessageTheme2(0, "Mother email is required");
//         return false;
//     }
//     if($("#"+formId+" #fatherFirstName").val() == null || $("#"+formId+" #fatherFirstName").val() == undefined || $("#"+formId+" #fatherFirstName").val() == ''){
//         showMessageTheme2(0, "Father name is required");
//         return false;
//     }
//     if($("#"+formId+" #fatherPhoneNumber").val() == null || $("#"+formId+" #fatherPhoneNumber").val() == undefined || $("#"+formId+" #fatherPhoneNumber").val() == ''){
//         showMessageTheme2(0, "Father phone number is required");
//         return false;
//     }
//     if($("#"+formId+" #fatherEmail").val() == null || $("#"+formId+" #fatherEmail").val() == undefined || $("#"+formId+" #fatherEmail").val() == ''){
//         showMessageTheme2(0, "Father email is required");
//         return false;
//     }
//     if($("#"+formId+" #guardianFirstName").val() == null || $("#"+formId+" #guardianFirstName").val() == undefined || $("#"+formId+" #guardianFirstName").val() == ''){
//         showMessageTheme2(0, "Guardian name is required");
//         return false;
//     }
//     if($("#"+formId+" #guardianPhoneNumber").val() == null || $("#"+formId+" #guardianPhoneNumber").val() == undefined || $("#"+formId+" #guardianPhoneNumber").val() == ''){
//         showMessageTheme2(0, "Guardian phone number is required");
//         return false;
//     }
//     if($("#"+formId+" #guardianEmail").val() == null || $("#"+formId+" #guardianEmail").val() == undefined || $("#"+formId+" #guardianEmail").val() == ''){
//         showMessageTheme2(0, "Guardian email is required");
//         return false;
//     }
//     if($("#"+formId+" #relationType").val() == null || $("#"+formId+" #relationType").val() == undefined || $("#"+formId+" #relationType").val() == ''){
//         showMessageTheme2(0, "Type of relation is required");
//         return false;
//     }
//     if($("#"+formId+" #pCountryId").val() == null || $("#"+formId+" #pCountryId").val() == undefined || $("#"+formId+" #pCountryId").val() == ''){
//         showMessageTheme2(0, "Parent/Guardian country is required");
//         return false;
//     }
//     if($("#"+formId+" #pStateId").val() == null || $("#"+formId+" #pStateId").val() == undefined || $("#"+formId+" #pStateId").val() == ''){
//         showMessageTheme2(0, "Parent/Guardian state is required");
//         return false;
//     }
//     if($("#"+formId+" #pCityId").val() == null || $("#"+formId+" #pCityId").val() == undefined || $("#"+formId+" #pCityId").val() == ''){
//         showMessageTheme2(0, "Parent/Guardian city is required");
//         return false;
//     }
//     if($("#"+formId+" #pCityId").val() == null || $("#"+formId+" #pCityId").val() == undefined || $("#"+formId+" #pCityId").val() == ''){
//         showMessageTheme2(0, "Parent/Guardian city is required");
//         return false;
//     }
//     if($("#"+formId+" .communication-wrapper .custom-checkbox .custom-control-input:checked").length < 1){
//         showMessageTheme2(0, "Communication is required");
//         return false;
//     }

// // Parent/Guardian Information Validation End Here //
// // Academic Information Validation End Here //
//     if($("#"+formId+" #studentID").val() == null || $("#"+formId+" #studentID").val() == undefined || $("#"+formId+" #studentID").val() == ''){
//         showMessageTheme2(0, "Student ID is required");
//         return false;
//     }
//     if($("#"+formId+" #learningProgram").val() == null || $("#"+formId+" #learningProgram").val() == undefined || $("#"+formId+" #learningProgram").val() == ''){
//         showMessageTheme2(0, "Learning program is required");
//         return false;
//     }
//     if($("#"+formId+" #grade").val() == null || $("#"+formId+" #grade").val() == undefined || $("#"+formId+" #grade").val() == ''){
//         showMessageTheme2(0, "Grade is required");
//         return false;
//     }
//     if($("#"+formId+" #academicYearStartDate").val() == null || $("#"+formId+" #academicYearStartDate").val() == undefined || $("#"+formId+" #academicYearStartDate").val() == ''){
//         showMessageTheme2(0, "Academic year start date is required");
//         return false;
//     }
//     if($("#"+formId+" #enrollmentDate").val() == null || $("#"+formId+" #enrollmentDate").val() == undefined || $("#"+formId+" #enrollmentDate").val() == ''){
//         showMessageTheme2(0, "Enrollment date is required");
//         return false;
//     }
//     if($("#"+formId+" #studentCourseProviderId").val() == null || $("#"+formId+" #studentCourseProviderId").val() == undefined || $("#"+formId+" #studentCourseProviderId").val() == ''){
//         showMessageTheme2(0, "LMS Platform is required");
//         return false;
//     }
//     if($("#"+formId+" #previousCurrentSchoolName").val() == null || $("#"+formId+" #previousCurrentSchoolName").val() == undefined || $("#"+formId+" #previousCurrentSchoolName").val() == ''){
//         showMessageTheme2(0, "Previous/Current school name is required");
//         return false;
//     }
//     if($("#"+formId+" #previousCurrentGradeName").val() == null || $("#"+formId+" #previousCurrentGradeName").val() == undefined || $("#"+formId+" #previousCurrentGradeName").val() == ''){
//         showMessageTheme2(0, "Previous/Current grade name is required");
//         return false;
//     }
//     if($("#"+formId+" #previousCurrentSchoolGraduationYear").val() == null || $("#"+formId+" #previousCurrentSchoolGraduationYear").val() == undefined || $("#"+formId+" #previousCurrentSchoolGraduationYear").val() == ''){
//         showMessageTheme2(0, "Previous/Current school graduation year is required");
//         return false;
//     }
//     if($("#"+formId+" #previousCurrentSchoolCountry").val() == null || $("#"+formId+" #previousCurrentSchoolCountry").val() == undefined || $("#"+formId+" #previousCurrentSchoolCountry").val() == ''){
//         showMessageTheme2(0, "Previous/Current school country is required");
//         return false;
//     }
//     if($("#"+formId+" #ctiTakenRecommendedGrade").val() == null || $("#"+formId+" #ctiTakenRecommendedGrade").val() == undefined || $("#"+formId+" #ctiTakenRecommendedGrade").val() == ''){
//         showMessageTheme2(0, "CTI taken recommended grade is required");
//         return false;
//     }
// // Academic Information Validation End Here //
// }


// function saveProfileDetails(formId){
//     var validationStatus = validateUserProfile(formId);
//     if(validationStatus){
//         changeLearningProgamGradePlatformModal()
//     }
// }



// function validateProfileDetails(formId, eleId, errorMsg, requiredFlag){
//     if(requiredFlag){
//         if($("#"+formId+" #"+eleId).val() == null || $("#"+formId+" #"+eleId).val() == undefined || $("#"+formId+" #"+eleId).val() == ''){
//             showMessageTheme2(0, errorMsg+" is required");
//             return false;
//         }else{
//             var elementValue = 
//             var data={} 
//             saveProfileDetails(data)
//         }
//     }
//     else{
//        showMessageTheme2(1, errorMsg+" save successfully"); 
//     }
// }

function getBulkRequestForUpdateProfile(saveList, userId, studentStandardId, moduleId) {

    var authentication = {};
    var requestProfileDataList = [];

    saveList.forEach(item => {
        var { eleID, keyId } = item;
        var requestProfile = getRequestForUpdateProfile(
            eleID,
            keyId,
            userId,
            studentStandardId,
            moduleId
        );

        requestProfileDataList.push(requestProfile.requestProfileData);
    });

    authentication['hash'] = getHash();
    authentication['schoolId'] = SCHOOL_ID;
    authentication['schoolUUID'] = SCHOOL_UUID;
    authentication['userType'] = moduleId;
    authentication['userId'] = userId;
    return {
        authentication: authentication,
        requestProfileDataList: requestProfileDataList
    };
}

function validateBulkFields(saveList) {

    for (var i = 0; i < saveList.length; i++) {

        var { eleID, keyId } = saveList[i];

        var fieldValue = "";
        if (eleID !== "hobbies" && eleID !== "extracurricular" && eleID != "TwitterURL") {
            fieldValue = $("#" + eleID).val();
        }else{
            fieldValue = $("[id='" + eleID + "']").val();
        }

        if (eleID !== "hobbies") {
            if (!validateFields(eleID, keyId, fieldValue)) {
                return false;
            }
        }
    }
    return true;
}


function saveBulkProfileData(userId, studentStandardId, roleModuleId, moduleId) {
    // console.log(SAVE_BLUK_PROFILE_DATA);
    applyBulkChanges(SAVE_BLUK_PROFILE_DATA, userId, studentStandardId, roleModuleId, moduleId);

}

function applyBulkChanges(saveList, userId, studentStandardId, roleModuleId, moduleId) {
    return applyChnagesBulk(saveList, userId, studentStandardId, roleModuleId, moduleId);
}

function getBulkWarningMessage(item, moduleId) {
    if (!item || !item.keyId) {
        return "";
    }
    if (item.keyId == 'timezone' && moduleId == 'student') {
        return 'You are about to change the timezone of the user. Please note that all future booked classes of the user will be updated to the new timezone.';
    }
    if (item.keyId == 'timezone' && moduleId == 'teacher') {
        return 'You are about to change the timezone of the teacher. Please note that all future classes of the teacher (recurring and normal) in the old time zone will be updated to the new timezone.';
    }
    if (item.keyId == 'nationality') {
        return 'You are about to change the nationality of the user. Do you want to continue?';
    }
    if (item.keyId == 'relationType') {
        return 'You are about to change the primary relation of the parent. Do you want to continue?';
    }
    
    return "";
}

function updateBulkWarningNoAction() {
    if ($("#resetDeleteErrorWarningNo1").length > 0) {
        $("#resetDeleteErrorWarningNo1").attr("onclick", "$('#remarksresetDelete1').modal('hide');skipApplyChnagesBulkWarning();");
    }
}

function processApplyChnagesBulkWarnings() {
    if(!BULK_PROFILE_SAVE_CONTEXT) {
        return false;
    }

    while (BULK_PROFILE_SAVE_CONTEXT.currentIndex < BULK_PROFILE_SAVE_CONTEXT.saveList.length) {
        var currentItem = BULK_PROFILE_SAVE_CONTEXT.saveList[BULK_PROFILE_SAVE_CONTEXT.currentIndex];
        var warningMessage = getBulkWarningMessage(currentItem, BULK_PROFILE_SAVE_CONTEXT.moduleId);
        if(currentItem.eleID == "bookASeatNextGradeOpted" || currentItem.eleID == "advanceGradeOpted"){
            BULK_PROFILE_SAVE_CONTEXT.currentWarningItem = currentItem;
            RESERVE_ENROLLMENT_SAVE_BULK=true;
            $("#"+currentItem.eleID).parent().find(".input-group-append .btn-success").trigger("click");
            return false;
        }else{
            if (warningMessage) {
                BULK_PROFILE_SAVE_CONTEXT.currentWarningItem = currentItem;
                showWarningMessageShow(warningMessage, 'confirmApplyChnagesBulkWarning()', false);
                updateBulkWarningNoAction();
                return false;
            }
        }
        

        BULK_PROFILE_SAVE_CONTEXT.approvedList.push(currentItem);
        BULK_PROFILE_SAVE_CONTEXT.currentIndex++;
    }
    if(BULK_PROFILE_SAVE_CONTEXT.approvedList.length>0){
        return submitApplyChnagesBulk();
    }
}

function confirmApplyChnagesBulkWarning() {
    if (!BULK_PROFILE_SAVE_CONTEXT || !BULK_PROFILE_SAVE_CONTEXT.currentWarningItem) {
        return false;
    }
    BULK_PROFILE_SAVE_CONTEXT.approvedList.push(BULK_PROFILE_SAVE_CONTEXT.currentWarningItem);
    BULK_PROFILE_SAVE_CONTEXT.currentWarningItem = null;
    BULK_PROFILE_SAVE_CONTEXT.currentIndex++;
    return processApplyChnagesBulkWarnings();
}

function skipApplyChnagesBulkWarning() {
    if (!BULK_PROFILE_SAVE_CONTEXT) {
        return false;
    }
    BULK_PROFILE_SAVE_CONTEXT.currentWarningItem = null;
    BULK_PROFILE_SAVE_CONTEXT.currentIndex++;
    return processApplyChnagesBulkWarnings();
}

function submitApplyChnagesBulk() {
    if (!BULK_PROFILE_SAVE_CONTEXT) {
        return false;
    }

    var approvedList = BULK_PROFILE_SAVE_CONTEXT.approvedList || [];
    if (approvedList.length < 1) {
        showMessageTheme2(0, "No confirmed changes available to save.", '', false);
        BULK_PROFILE_SAVE_CONTEXT = null;
        return false;
    }
    for (var item of approvedList) {
        var { eleID, keyId } = item;
        if (keyId === 'motherEmail' || keyId === 'fatherEmail' || keyId === 'guardianEmail') {
            if (!checkParentType(eleID, keyId)) {
                return false; // yahin se poora function ruk jayega
            }
        }
    }

    var bulkRequest = getBulkRequestForUpdateProfile(
        approvedList,
        BULK_PROFILE_SAVE_CONTEXT.userId,
        BULK_PROFILE_SAVE_CONTEXT.studentStandardId,
        BULK_PROFILE_SAVE_CONTEXT.moduleId
    );
    console.log(bulkRequest)
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'update-user-profile-bulk'),
        data: JSON.stringify(bulkRequest),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(0, data['message'], '', false);
                BULK_PROFILE_SAVE_CONTEXT = null;
                return false;
            }
            if(USER_ROLE == "STUDENT"){
                CUSTOM_DATEPICKER_FIELD_FLAG=false;
                const eleIdsToRemove = [...approvedList.map(item => item.eleID), ...(approvedList.some(item => item.eleID === "extracurricular") ? ["extracurricularActivities"] : [])];
                // if(eleIdsToRemove == "extracurricular"){ 
                //     eleIdsToRemove 
                // }
                updateProfileLocalStorageData(eleIdsToRemove);
            }
            approvedList.forEach(item => {
                overWriteProfileData(item.eleID, item.keyId);
                $("#" + item.eleID).closest(".input-group").find(".input-group-append-hide").hide();
                SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(function (bulkItem) {
                    return bulkItem.eleID !== item.eleID;
                });
            });

            calculateSectionPercentage();
            showMessageTheme2(1, data['message'], '', false);
            if(USER_ROLE == "STUDENT"){
                refreshProfileMissingModalStateAfterBulkSave(missingFields);
            }
            BULK_PROFILE_SAVE_CONTEXT = null;
            if(STUDENT_UPLOAD_DOCUMENTS.length>0){
                $("#saveAcademicInformationDocsBtn").trigger("click");
            }
            return false;
        }
    });
    return false;
}

function updateProfileLocalStorageData(eleIdsToRemove){
    extractFields(missingFields);
    MISSING_PARENT_NAME_SECTION_FLAG = getProfileParentNameSaveFlag();
    // ✅ missingFields update
    missingFields = cleanMissingFields(missingFields, eleIdsToRemove);
    setProfileMissingFields(missingFields);
    
    if(MISSING_PARENT_NAME_SECTION_FLAG){
        PROFILE_NOW_DATA=[];
    }else{
        // ✅ PROFILE_NOW_DATA update
        PROFILE_NOW_DATA = getNowProfileFieldsData();
    }
    if(Object.keys(PROFILE_NOW_DATA).length>0){
        PROFILE_NOW_DATA = cleanProfileStructure(PROFILE_NOW_DATA, eleIdsToRemove);
    }
    setNowProfileFieldsData(PROFILE_NOW_DATA);
    // ✅ agar schedule data bhi sync karna hai
    PROFILE_SCHEDULE_DATA = getScheduleProfileData();
    if(Object.keys(PROFILE_SCHEDULE_DATA).length>0){
        PROFILE_SCHEDULE_DATA = cleanProfileStructure(PROFILE_SCHEDULE_DATA, eleIdsToRemove);
    }
    setScheduleProfileData(PROFILE_SCHEDULE_DATA);
    console.log("UPDATED missingFields:", missingFields);
    console.log("UPDATED PROFILE_NOW_DATA:", PROFILE_NOW_DATA);
}

// 🔹 Common remove function (deep clean)
function cleanProfileStructure(data, eleIdsToRemove) {

    function cleanList(list) {
        if (!list) return [];

        return list
            .filter(item => !eleIdsToRemove.includes(item.fieldId))
            .map(item => {
                // nested socialMedia
                if (item.socialMedia) {
                    item.socialMedia = cleanList(item.socialMedia);
                }
                return item;
            });
    }

    data.forEach(profile => {

        // ✅ parentChildList
        if (profile.parentChildList) {
            profile.parentChildList = cleanList(profile.parentChildList);
        }

        // ✅ parentChildGroupList (IMPORTANT 🔥)
        if (profile.parentChildGroupList) {
            profile.parentChildGroupList = profile.parentChildGroupList.map(group => {
                group.parentChildList = cleanList(group.parentChildList);
                return group;
            });
        }

    });

    return data;
}


// 🔹 missingFields clean
// function cleanMissingFields(missingFields, eleIdsToRemove) {
//     var parentSection=false;
//     if(eleIdsToRemove.startsWith('mother') || eleIdsToRemove.startsWith('father') || eleIdsToRemove.startsWith('guardian')){
//         parentSection=true;
//     }
//     Object.keys(missingFields).forEach(sectionName => {
//         var groups = missingFields[sectionName];

//         Object.keys(groups).forEach(groupId => {
//             groups[groupId] = groups[groupId].filter(field =>
//                 !eleIdsToRemove.includes(field.fieldId)
//             );

//             // empty group हटाओ
//             if (groups[groupId].length === 0) {
//                 delete groups[groupId];
//             }
//         });

//         // empty section हटाओ
//         if (Object.keys(groups).length === 0) {
//             delete missingFields[sectionName];
//         }
//     });
//     return missingFields;
// }




function cleanMissingFields(missingFields, eleIdsToRemove) {

    var fieldsToRemove = new Set();
    if (Array.isArray(eleIdsToRemove)) {
        eleIdsToRemove.forEach(function (id) {
            if (id === undefined || id === null) return;
            fieldsToRemove.add(id);
            fieldsToRemove.add(String(id));
        });
    }
    var shouldRemoveField = function (field) {
        if (!field) {
            return false;
        }
        if (fieldsToRemove.has(field.fieldId) || fieldsToRemove.has(String(field.fieldId))) {
            return true;
        }
        if (field.fieldSource === "customField") {
            var customId = field.customProfileFieldId !== undefined && field.customProfileFieldId !== null
                ? field.customProfileFieldId
                : field.id;
            if (customId !== undefined && customId !== null) {
                if (fieldsToRemove.has(customId) || fieldsToRemove.has(String(customId))) {
                    return true;
                }
            }
        }
        return false;
    };
    var parentSection = false;
    if (Array.isArray(eleIdsToRemove) && eleIdsToRemove.some(id => id.startsWith("mother") || id.startsWith("father") || id.startsWith("guardian") )) {
        parentSection = true;
    }
    if(parentSection){
        var groups = ["mother", "father", "guardian"];

        var nameMap = {
            mother: ["motherName", "motherMiddleName", "motherLastName"],
            father: ["fatherFirstName", "fatherMiddleName", "fatherLastName"],
            guardian: ["guardianFirstName", "guardianMiddleName", "guardianLastName"],
        };
        var phoneNumberMap = {
            mother: ["motherPhoneNumber", "motherPhoneNumberWhatsAppStatus", "motherPhoneEmergencyNumberStatus"],
            father: ["fatherPhoneNumber", "fatherPhoneNumberWhatsAppStatus", "fatherPhoneEmergencyNumberStatus"],
            guardian: ["guardianPhoneNumber","guardianPhoneNumberWhatsAppStatus","guardianEmergencyNumberStatus"],
        };
        // 🔥 STEP 1: Check if ANY name field is present
        var isNameFieldTriggered = eleIdsToRemove.some(id =>
            Object.values(nameMap).flat().includes(id)
        );
        var isPhoneNumberTriggered = eleIdsToRemove.some(id =>
            Object.values(phoneNumberMap).flat().includes(id)
        );

        // 🔥 STEP 2: If triggered → remove ALL name fields from all groups
        if (isNameFieldTriggered) {
            Object.values(nameMap).forEach(arr => {
                arr.forEach(f => fieldsToRemove.add(f));
            });
        }
        if (isPhoneNumberTriggered) {
            Object.values(phoneNumberMap).forEach(arr => {
                arr.forEach(f => fieldsToRemove.add(f));
            });
        }

        // 🔥 STEP 3: Normal logic (Country, DOB etc.)
        eleIdsToRemove.forEach(id => {

            var group = "";
            if (id.startsWith("mother")) group = "mother";
            else if (id.startsWith("father")) group = "father";
            else if (id.startsWith("guardian")) group = "guardian";

            var suffix = id.replace(group, "");

            // ❌ skip name fields (already handled above)
            if (["Name", "FirstName", "MiddleName", "LastName"].includes(suffix)) return;

            groups.forEach(g => {
                if (g !== group) {
                    fieldsToRemove.add(g + suffix);
                }
            });

            fieldsToRemove.add(id);
        });
        Object.keys(missingFields).forEach(sectionName => {
            var sectionGroups = missingFields[sectionName];

            Object.keys(sectionGroups).forEach(groupId => {
                sectionGroups[groupId] = sectionGroups[groupId].filter(
                    field => !shouldRemoveField(field)
                );

                if (sectionGroups[groupId].length === 0) {
                    delete sectionGroups[groupId];
                }
            });

            if (Object.keys(sectionGroups).length === 0) {
                delete missingFields[sectionName];
            }
        });
    }else{
        // ✅ 🔥 IMPORTANT FIX: Add normal fields (like "hobbies")
        if(eleIdsToRemove.includes("altPhoneNumber")){eleIdsToRemove.push("altPhoneNumberWhatsAppStatus")}
        if(eleIdsToRemove.includes("phoneNumber")){eleIdsToRemove.push("phoneNumberWhatsAppStatus")}
        if (Array.isArray(eleIdsToRemove)) {
            eleIdsToRemove.forEach(id => {
                if(id == "extracurricular"){
                    id = "extracurricularActivities";
                }
                fieldsToRemove.add(id);
                fieldsToRemove.add(String(id));
            });
        }

        // ✅ STEP 4: Apply filter
        Object.keys(missingFields).forEach(sectionName => {

            var sectionGroups = missingFields[sectionName];

            Object.keys(sectionGroups).forEach(groupId => {

                sectionGroups[groupId] = sectionGroups[groupId].filter(field =>
                    !shouldRemoveField(field)
                );

                // remove empty group
                if (sectionGroups[groupId].length === 0) {
                    delete sectionGroups[groupId];
                }
            });

            // remove empty section
            if (Object.keys(sectionGroups).length === 0) {
                delete missingFields[sectionName];
            }
        });
    }    
    

    return missingFields;
}


function applyChnagesBulk(saveList, userId, studentStandardId, roleModuleId, moduleId) {

    if (!getSession()) {
        showMessageTheme2(0, "Your session has been timed out, please login again", '', false);
        redirectLoginPage();
        return false;
    }

    hideMessageTheme2('');
    MISSING_PARENT_NAME_SECTION_FLAG = getProfileParentNameSaveFlag();
    if(!MISSING_PARENT_NAME_SECTION_FLAG){
        if (!saveList || saveList.length < 1) {
            showMessageTheme2(0, "No unsaved changes available to save.", '', false);
            return false;
        }

        if (!validateBulkFields(saveList)) {
            return false;
        }
    }else{
        saveList = [
            {
                "eleID": "motherName",
                "keyId": "motherName"
            },
            {
                "eleID": "motherMiddleName",
                "keyId": "motherMiddleName"
            },
            {
                "eleID": "motherLastName",
                "keyId": "motherLastName"
            },
            {
                "eleID": "fatherFirstName",
                "keyId": "fatherFirstName"
            },
            {
                "eleID": "fatherMiddleName",
                "keyId": "fatherMiddleName"
            },
            {
                "eleID": "fatherLastName",
                "keyId": "fatherLastName"
            },
            {
                "eleID": "guardianFirstName",
                "keyId": "guardianFirstName"
            },
            {
                "eleID": "guardianMiddleName",
                "keyId": "guardianMiddleName"
            },
            {
                "eleID": "guardianLastName",
                "keyId": "guardianLastName"
            }
        ];
    }

    // if($("#communicationPreferredSlotSave").css("display") != "none"){
    //     $("#communicationPreferredSlotSave").trigger("click");   
    // }

    BULK_PROFILE_SAVE_CONTEXT = {
        saveList: saveList.slice(),
        approvedList: [],
        currentIndex: 0,
        currentWarningItem: null,
        userId: userId,
        studentStandardId: studentStandardId,
        roleModuleId: roleModuleId,
        moduleId: moduleId
    };

    return processApplyChnagesBulkWarnings();
}





function getRequestForUpdateProfile(eleID, keyId, userId, studentStandardId, moduleId) {
    var requestProfile = {};
    var authentication = {};
    var requestProfileData = {};
    requestProfileData['studentStandardId'] = studentStandardId;
    requestProfileData['keyId'] = keyId;

    if(keyId == "customProfileFieldId"){
        requestProfileData['fieldValue1'] =  $('#' + eleID).attr("data-element-id");
        requestProfileData['fieldValue'] = escapeCharacters($('#' + eleID).val());
    }
    else{
        if (keyId == 'employeeType') {
            if ($('#employeeTypeStartDate').val() == '') {
                showMessageTheme2(0, "Please enter employee Type Start Date.", '', false);
                return false;
            }
            requestProfileData['employeeStartDate'] = $('#employeeTypeStartDate').val();

        }
        // else if(keyId=='phoneNumber' || keyId=='altPhoneNumber' || keyId=='motherPhoneNumber' || keyId=='fatherPhoneNumber' || keyId=='guardianPhoneNumber' || keyId=='payPalPhoneNumber' ){
        // 	var valId ="";
        // 	var lent=$('#'+keyId).val().indexOf("-")
        // 	if(lent>0){
        // 		var valPhoneId = $('#'+keyId).val().split("-")[1];
        // 	}else{
        // 		var valPhoneId = $('#'+keyId).val();
        // 		if(valPhoneId==""){
        // 			showMessageTheme2(2,' Either field value is invalid or empty.','',false);
        // 			return false;
        // 		}
        // 	}
        //     valPhoneId = valPhoneId.replace(/\s+/g, '')
        //     requestProfileData['fieldValue']=escapeCharacters(valPhoneId);
        // }
        else if (keyId == 'alternateEmail') {
            var valEmailId = $('#' + keyId).val();
            if (valEmailId == "" || !validateEmail(valEmailId)) {
                showMessageTheme2(2, ' Either field value is invalid or empty.', '', false);
                return false;
            }
            requestProfileData['fieldValue'] = valEmailId;
        }
        else if (keyId == 'hobbies') {
            var hobbiesArr = [];
            $(".hobbie-wrapper input[type='checkbox']:checked").each(function () {
                hobbiesArr.push($(this).attr("data-hobbie-keyId") + "~" + $(this).attr("data-hobbie-label"))
            });
            requestProfileData['hobbiesList'] = hobbiesArr;
            $("#saveHobbiesWrapper").hide();
            HOBBIES_CHANGES_COUNT = [];
        }
        else if (keyId == 'socialMedia') {
            
            requestProfileData['fieldValue'] = $("[id='" + eleID + "']").attr("data-social-media-id") + "~" + $("[id='" + eleID + "']").val() + "~" + $(`[for='${eleID}']`).attr("data-title");
            //requestProfileData['fieldValue']=
        }
        else if (keyId == 'specialization' || keyId == 'preferredSubjectName' || keyId == 'lastsubTaught') {
            requestProfileData['fieldValue'] = $('#' + keyId).val().toString();
        } else if (keyId == 'educationSpecialization') {
            requestProfileData['fieldValue'] = $('#educationSpecialization').val();//$(".stuPhoneNumber .iti__active").last().attr("data-dial-code");
        }
        else if (keyId == 'countrySection') {
            requestProfileData['countryId'] = $('#country').val();
            requestProfileData['stateId'] = $('#state').val();
            requestProfileData['cityId'] = $('#city').val();
        } else if (keyId == 'nationality') {
            requestProfileData['fieldValue'] = $("#" + eleID + " option:selected").text().trim();;
        } else if (keyId == 'motherName' || keyId == "motherMiddleName" || keyId == "motherLastName") {
            requestProfileData['firstName'] = $('#motherName').val();
            requestProfileData['middleName'] = $('#motherMiddleName').val();
            requestProfileData['lastName'] = $('#motherLastName').val();
            requestProfileData['primaryParent'] = escapeCharacters($('#relationType').val());
            requestProfileData['parentType'] = "Mother";
        } else if (keyId == 'fatherFacebook') {
            requestProfileData['faceBook'] = $('#fatherFacebook').val();
            requestProfileData['parentType'] = "Father";
        } else if (keyId == 'motherFacebook') {
            requestProfileData['faceBook'] = $('#motherFacebook').val();
            requestProfileData['parentType'] = "Mother";
        } else if (keyId == 'guardianFacebook') {
            requestProfileData['faceBook'] = $('#guardianFacebook').val();
            requestProfileData['parentType'] = "Guardian";
        } else if (keyId == 'motherCountry') {
            requestProfileData['parentType'] = "Mother";
            requestProfileData['fieldValue'] = $("#motherCountry").val();
        }
        else if (keyId == 'fatherCountry') {
            requestProfileData['parentType'] = "Father";
            requestProfileData['fieldValue'] = $("#fatherCountry").val();
        }
        else if (keyId == 'guardianCountry') {
            requestProfileData['parentType'] = "Guardian";
            requestProfileData['fieldValue'] = $("#guardianCountry").val();
        }
        else if (keyId == 'fatherFirstName' || keyId == "fatherMiddleName" || keyId == "fatherLastName") {
            requestProfileData['firstName'] = $('#fatherFirstName').val();
            requestProfileData['middleName'] = $('#fatherMiddleName').val();
            requestProfileData['lastName'] = $('#fatherLastName').val();
            requestProfileData['primaryParent'] = escapeCharacters($('#relationType').val());
            requestProfileData['parentType'] = "Father";
        } else if (keyId == 'guardianFirstName' || keyId == "guardianMiddleName" || keyId == "guardianLastName") {
            requestProfileData['firstName'] = $('#guardianFirstName').val();
            requestProfileData['middleName'] = $('#guardianMiddleName').val();
            requestProfileData['lastName'] = $('#guardianLastName').val();
            requestProfileData['primaryParent'] = escapeCharacters($('#relationType').val());
            requestProfileData['parentType'] = "Guardian";
        } else if (keyId == 'countrySectionParent') {
            requestProfileData['countryId'] = $('#pCountryId').val();
            requestProfileData['stateId'] = $('#pStateId').val();
            requestProfileData['cityId'] = $('#pCityId').val();
        } else if (keyId == 'totalTeacheingExperience') {
            requestProfileData['yearValue'] = $("#yearExp").val();
            requestProfileData['monthValue'] = $("#monthExp").val();
        } else if (keyId == 'lastOrgGradeName') {
            if ($('#lastGradeK').val().length > 0) {
                requestProfileData['fieldValue'] = $('#lastGradeK').val().toString();
            } else if ($('#lastGradeM').val().length > 0) {
                requestProfileData['fieldValue'] = $('#lastGradeM').val().toString();
            } else if ($('#lastGradeH').val().length > 0) {
                requestProfileData['fieldValue'] = $('#lastGradeH').val().toString();
            }
        } else if (keyId == 'preferredGradeName') {
            if ($('#prefGradeK').val().length > 0) {
                requestProfileData['fieldValue'] = $('#prefGradeK').val().toString();
            } else if ($('#prefGradeM').val().length > 0) {
                requestProfileData['fieldValue'] = $('#prefGradeM').val().toString();
            } else if ($('#prefGradeH').val().length > 0) {
                requestProfileData['fieldValue'] = $('#prefGradeH').val().toString();
            }
        } else if (keyId == 'otherRelation' || keyId == 'relationType') {
            requestProfileData['fieldValue'] = $("#relationType").val();
            if ($("#otherRelation").length > 0) {
                requestProfileData['fieldValue1'] = toTitleCase($("#otherRelation").val());
            }
        } else if (keyId == 'parentEmailSmsLmsCreation') {
            requestProfileData['fieldValue'] = encode($("#parentPassword").val());
        } else if (keyId == 'pEmailOtp') {
            requestProfileData['fieldValue'] = $("#parentEmailId").val().trim();
        } else if (keyId == 'pEmailOtpVerify') {
            requestProfileData['fieldValue'] = $("#parentEmailId").val().trim();
            requestProfileData['fieldValue1'] = $("#otp").val();
        } else if (keyId == 'pStudEmailMappedVerify') {
            requestProfileData['fieldValue'] = $("#parentEmailId").val().trim();
            requestProfileData['fieldValue1'] = $("#verifyMailId").val().trim();
        } else if (keyId == "parentEmailLmsCreation") {
            requestProfileData['fieldValue'] = $("#parentEmailId").val().trim();
        } else if (keyId == 'switchParentStudEmailId') {
            requestProfileData['fieldValue'] = $('#swipeParentId').val().trim();
            requestProfileData['fieldValue1'] = $('#studID option:selected ').attr('attrStudentEmail').trim();
            requestProfileData['studUserId'] = $('#studID').val();
            requestProfileData['parentId'] = $('#swipeParentId').attr("attrparentid");
        } else if (keyId == "forcefulRepeatOrImprove") {
            requestProfileData['forcefulRepeatOrImprove'] = $("#forcefulRepeatOrImprove").val().trim();
        } else if (keyId == "occupation") {
            requestProfileData['fieldValue'] = $('#' + eleID).val()
            requestProfileData['parentType'] = $('#' + eleID).attr("data-Occupationparent");
        }
        else if (keyId == "parentDob") {
            requestProfileData['fieldValue'] = $('#' + eleID).val();
            requestProfileData['parentType'] = $('#' + eleID).attr("data-dobparent");
        }
        else if (keyId == "weddingAnniversaryDate") {
            requestProfileData['fieldValue'] = $('#' + eleID).val();
        }
        else if (keyId == "reenrollmentDiscount") {
            requestProfileData['fieldValue'] = $('#' + eleID).val();
        }
        else if (keyId == "progressReportType") {
            requestProfileData['fieldValue'] = $('#progressReportAnchorDate').val();
            requestProfileData['reportType'] = parseInt($('#progressReportDaysType').val() || "14", 10);
        }
        else if (keyId == 'communicationPreferredSlots') {
            requestProfileData["callingPreferences"] = getCallingPreference();
        } else if (keyId == 'extracurricular') {
            var sportsAndEcList = [];
            $(".sports-extra-curriculars-wrapper input[type='checkbox']:checked").each(function () {
                sportsAndEcList.push($(this).attr("data-Id"));
            });
            requestProfileData['sportsAndEcList'] = sportsAndEcList;
            $("#saveSportsAndEcClubWrapper").hide();
            SPORTS_AND_CLUB_COUNT = [];
        } else if (keyId == 'preferredcommunication') {
            var pcWhatsapp = $('#pcWhatsappView').is(':checked') ? 'Y' : 'N';
            var pcCall = $('#pcCallView').is(':checked') ? 'Y' : 'N';
            var pcEmail = $('#pcEmailView').is(':checked') ? 'Y' : 'N';
            requestProfileData['fieldValue'] = 'W=' + pcWhatsapp + '|' + 'C=' + pcCall + '|' + 'E=' + pcEmail;
        }
        else {
            if (keyId == 'firstName' || keyId == 'middleName' || keyId == 'lastName' || keyId == 'lastOrgName' || keyId == 'lastJobTitle' || keyId == 'address' || keyId == 'otherSkills'
                || keyId == 'designation' || keyId == 'departmentId' || keyId == 'acPersonName' || keyId == 'bankName'
                || keyId == 'bankBranchName' || keyId == 'bankBranchAddress' || keyId == 'otherBankDetails' || keyId == 'otherProfessionalCourse'
                || keyId == 'otherSpecialization' || keyId == 'anyOtherLanguages' || keyId == 'references1' || keyId == 'references2'
                || keyId == 'specialization' || keyId == 'postGraduationSubjects' || keyId == 'graduationSubjects') {
                requestProfileData['fieldValue'] = escapeCharacters($('#' + keyId).val());
            }else if(keyId == 'motherEmail' || keyId == 'fatherEmail' || keyId == 'guardianEmail'){
                requestProfileData['fieldValue'] = escapeCharacters($('#' + keyId).val());
                 var relationType = escapeCharacters($('#relationType').val());
                if(USER_ROLE == "STUDENT"){
                    relationType = PROFILE_RESPONSE_DATA.profileData.studentProfile[1].relationType;                
                }
                requestProfileData['primaryParent'] = escapeCharacters(relationType);
                if (keyId == 'motherEmail') {
                    requestProfileData['parentType'] = "Mother";
                } else if (keyId == 'fatherEmail') {
                    requestProfileData['parentType'] = "Father";
                } else {
                    requestProfileData['parentType'] = "Guardian";
                }
            } else if (keyId == 'describeYourself' || keyId == 'lastOrgJobDiscription') {
                requestProfileData['fieldValue'] = escapeCharacters(toSentenceCase($('#' + keyId).val()));
            } else {
                    requestProfileData['fieldValue'] = escapeCharacters($('#' + keyId).val());
            }
        }
        if (keyId == 'phoneNumber') {
            requestProfileData['countryCode'] = $('#' + eleID).attr('data-countrycode');//$(".stuPhoneNumber .iti__active").last().attr("data-country-code");
            requestProfileData['countryIsdCode'] = $('#' + eleID).attr('data-isd-code');//$(".stuPhoneNumber .iti__active").last().attr("data-dial-code");
            requestProfileData['contactWhatsAppStatus'] = $('#phoneNumberWhatsAppStatus').prop('checked') ? 'Y' : 'N';
        } if (keyId == 'altPhoneNumber') {
            requestProfileData['countryCode'] = $('#' + eleID).attr('data-countrycode');//$(".stuAlternatePhoneNumber .iti__active").last().attr("data-country-code");
            requestProfileData['countryIsdCode'] = $('#' + eleID).attr('data-isd-code');//$(".stuAlternatePhoneNumber .iti__active").last().attr("data-dial-code");
            requestProfileData['contactWhatsAppStatus'] = $('#altPhoneNumberWhatsAppStatus').prop('checked') ? 'Y' : 'N';
        } if (keyId == 'motherPhoneNumber') {
            requestProfileData['countryCode'] = $('#' + eleID).attr('data-countrycode');//$(".stuParentPhoneNumber .iti__active").last().attr("data-country-code");
            requestProfileData['countryIsdCode'] = $('#' + eleID).attr('data-isd-code');//$(".stuParentPhoneNumber .iti__active").last().attr("data-dial-code");
            requestProfileData['contactWhatsAppStatus'] = $('#motherPhoneNumberWhatsAppStatus').prop('checked') ? 'Y' : 'N';
            requestProfileData['emergencyContactStatus'] = $('#motherPhoneEmergencyNumberStatus').prop('checked') ? 'Y' : 'N';

            requestProfileData['primaryParent'] = escapeCharacters($('#relationType').val());
            requestProfileData['parentType'] = "Mother";
        } if (keyId == 'fatherPhoneNumber') {
            requestProfileData['countryCode'] = $('#' + eleID).attr('data-countrycode');//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-country-code");
            requestProfileData['countryIsdCode'] = $('#' + eleID).attr('data-isd-code');//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code");
            requestProfileData['contactWhatsAppStatus'] = $('#fatherPhoneNumberWhatsAppStatus').prop('checked') ? 'Y' : 'N';
            requestProfileData['emergencyContactStatus'] = $('#fatherPhoneEmergencyNumberStatus').prop('checked') ? 'Y' : 'N';
            requestProfileData['primaryParent'] = escapeCharacters($('#relationType').val());
            requestProfileData['parentType'] = "Father";
        } if (keyId == 'guardianPhoneNumber') {
            requestProfileData['countryCode'] = $('#' + eleID).attr('data-countrycode');//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-country-code");
            requestProfileData['countryIsdCode'] = $('#' + eleID).attr('data-isd-code');//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code");
            requestProfileData['contactWhatsAppStatus'] = $('#guardianPhoneNumberWhatsAppStatus').prop('checked') ? 'Y' : 'N';
            requestProfileData['emergencyContactStatus'] = $('#guardianEmergencyNumberStatus').prop('checked') ? 'Y' : 'N';
            requestProfileData['primaryParent'] = escapeCharacters($('#relationType').val());
            requestProfileData['parentType'] = "Guardian";
        }
        if (keyId == 'payPalPhoneNumber') {
            requestProfileData['countryCode'] = $('#' + eleID).attr('data-countrycode');
            requestProfileData['countryIsdCode'] = $('#' + eleID).attr('data-isd-code');
        }
        // if(keyId=='timeToCall'){
        //     var timeList =[];
        //     var startTime = convertTo24Hour('09:00 AM');
        //     var endTime = convertTo24Hour('05:00 PM');
        // 	timeList.push(startTime + "-" + endTime);
        // 	requestProfileData['timeToCallList']=timeList;
        //     requestProfileData['parentType']="Student";
        // }
    }
    authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
    authentication['userType'] = moduleId;
    authentication['userId'] = userId;
    requestProfile['authentication'] = authentication;
    requestProfile['requestProfileData'] = requestProfileData;
    return requestProfile;
}

function validateFields(eleID, keyId, fieldValue) {
    var flag = true;
    if (keyId == 'phoneNumber' || keyId == 'motherPhoneNumber' || keyId == 'fatherPhoneNumber' || keyId == 'guardianPhoneNumber' || keyId == 'payPalPhoneNumber') {
        // if(keyId=='phoneNumber'){
        var valId = "";
        var lent = $('#' + keyId).val().indexOf("-")
        if (lent > 0) {
            var valPhoneId = $('#' + keyId).val().split("-")[1];
        } else {
            var valPhoneId = $('#' + keyId).val();
            if (valPhoneId == "") {
                showMessageTheme2(0, ' Either field value is invalid or empty.', '', false);
                flag = false;
            } else {
                var result = validatePhoneNumber(keyId);
                // if (!result.valid) {
                //     flag= false;
                //     showMessageTheme2(0,result.message,'',false);
                // }
                flag = true
            }
        }
        if (!flag) {
            return flag;
        }
    }
    else if (keyId == 'gender' || keyId == 'parentGender') {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Please choose gender.", '', false);
            return false;
        }
    } else if (fieldValue == '' && keyId == 'nationality') {
        showMessageTheme2(0, " Please choose nationality to proceed.", '', false);
        return false;
    } else if (keyId == 'socialMedia') {
        if (fieldValue != "" && fieldValue != undefined && fieldValue != null) {
            if (!isValidUrl(fieldValue)) {
                showMessageTheme2(0, " Invaild URL.", '', false);
                return false;
            }
        }else{
            showMessageTheme2(0, " Invaild URL.", '', false);
                return false; 
        }
    } else if (keyId == 'motherFacebook' || keyId == 'fatherFacebook' || keyId == 'guardianFacebook') {
        if(fieldValue != "" && fieldValue != undefined && fieldValue != null) {
            if (!isValidUrl(fieldValue)) {
                showMessageTheme2(0, " Invaild URL.", '', false);
                return false;
            }
        }else{
            showMessageTheme2(0, " Invaild URL.", '', false);
            return false;
        }
    }
    else if (keyId == 'admissonDate' || keyId == 'joiningDate') {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Either field value is invalid or empty.", '', false);
            return false;
        }
    } else if (keyId == 'dob') {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Either field value is invalid or empty.", '', false);
            return false;
        }
    } else if (keyId == 'parentDob') {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Either field value is invalid or empty.", '', false);
            return false;
        }
    } else if (keyId == 'weddingAnniversaryDate') {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Either field value is invalid or empty.", '', false);
            return false;
        }
    } else if (keyId == 'countrySection') {
        if ($("#country").val() == undefined || $("#country").val() == 0 || $("#country").val() == '') {
            showMessageTheme2(0, " Please choose country to proceed.", '', false);
            return false;
        } else if ($("#state").val() == undefined || $("#state").val() == 0 || $("#state").val() == '') {
            showMessageTheme2(0, "Please choose state to proceed.", '', false);
            return false;
        } else if ($("#city").val() == undefined || $("#city").val() == 0 || $("#city").val() == '') {
            showMessageTheme2(0, "Please choose city to proceed.", '', false);
            return false;
        }
    } else if (keyId == 'motherName' || keyId == 'motherLastName') {
        // if( $("#motherName").val()==undefined ||$("#motherName").val()==0 || $("#motherName").val()==''){
        // 	showMessageTheme2(0," Please enter mother name to proceed.",'',false);
        // 	return false;
        // }
        // else if( $("#motherLastName").val()==undefined ||$("#motherLastName").val()==0 || $("#motherLastName").val()==''){
        // 	showMessageTheme2(0,"Please enter mother last name to proceed.",'',false);
        // 	return false;
        // }
    }
    else if (keyId == 'fatherFirstName' || keyId == 'fatherLastName') {
        // if( $("#fatherFirstName").val()==undefined ||$("#fatherFirstName").val()==0 || $("#fatherFirstName").val()==''){
        // 	showMessageTheme2(0," Please enter father name to proceed.",'',false);
        // 	return false;
        // }else if( $("#fatherLastName").val()==undefined ||$("#fatherLastName").val()==0 || $("#fatherLastName").val()==''){
        // 	showMessageTheme2(0,"Please enter father last name to proceed.",'',false);
        // 	return false;
        // }
    }
    else if (keyId == 'guardianFirstName' || keyId == 'guardianLastName') {
        // if( $("#guardianFirstName").val()==undefined ||$("#guardianFirstName").val()==0 || $("#guardianFirstName").val()==''){
        // 	showMessageTheme2(0," Please enter guardian name to proceed.",'',false);
        // 	return false;
        // }else if( $("#guardianLastName").val()==undefined ||$("#guardianLastName").val()==0 || $("#guardianLastName").val()==''){
        // 	showMessageTheme2(0,"Please enter guardian last name to proceed.",'',false);
        // 	return false;
        // }
    }
    else if (keyId == 'timezone') {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Either field value is invalid or empty.", '', false);
            return false;
        }
    } else if (keyId == 'otherRelation' || keyId == 'relationType') {
        var viewValue = '';
        if ('Other' == $('#relationType').val()) {
            if ($('#otherRelation').val() == '' || $('#otherRelation').val() == undefined) {
                showMessageTheme2(0, "Please Enter relation type.", '', false);
                return false;
            }
        }
    } else if (keyId == 'communicationPreferredSlots') {
        $(".communication-preferred-time-wrapper-ul > li").each(function () {
            var slotUI = $(this).find(".communication_slot_ul");
            var roleType = slotUI.attr("data-communicationroletype-ul");
            if (!roleType) {
                showMessageTheme2(0, "Role type is required.");
                return false;
            }
        });
    } else if (keyId == 'countrySectionParent') {
        if ($("#pCountryId").val() == undefined || $("#pCountryId").val() == 0 || $("#pCountryId").val() == '') {
            showMessageTheme2(0, " Please choose country to proceed.", '', false);
            return false;
        } else if ($("#pStateId").val() == undefined || $("#pStateId").val() == 0 || $("#pStateId").val() == '') {
            showMessageTheme2(0, "Please choose state to proceed.", '', false);
            return false;
        } else if ($("#pCityId").val() == undefined || $("#pCityId").val() == 0 || $("#pCityId").val() == '') {
            showMessageTheme2(0, "Please choose city to proceed.", '', false);
            return false;
        }
    } else if (keyId == "totalTeacheingExperience") {
        if ($("#yearExp").val() == undefined || $("#yearExp").val() == '' || $("#yearExp").val() == 0) {
            // if( $("#monthExp").val()==undefined || $("#monthExp").val()=='' || $("#monthExp").val()==0){
            showMessageTheme2(0, "Please select total teaching experience in month.", '', false);
            return false;
            // }
        }
    } else if (keyId == "preferredGradeName") {
        if ($('#prefGradeK').val().length == 0 && $('#prefGradeM').val().length == 0 && $('#prefGradeH').val().length == 0) {
            showMessageTheme2(0, "Please select preferred grades.", '', false);
            return false;
        }
    } else if (keyId == "lastOrgGradeName") {
        if ($('#lastGradeK').val().length == 0 && $('#lastGradeM').val().length == 0 && $('#lastGradeH').val().length == 0) {
            showMessageTheme2(0, "Please select current/Last Organization grades.", '', false);
            return false;
        }
    } else if (keyId == "specialization") {
        if ($('#specialization').val().length == 0) {
            showMessageTheme2(0, "Please select specialization subjects.", '', false);
            return false;
        }
    } else if (keyId == "preferredSubjectName") {
        if ($('#preferredSubjectName').val().length == 0) {
            showMessageTheme2(0, "Please select Preferred Courses.", '', false);
            return false;
        }
    } else if (keyId == "lastsubTaught") {
        if ($('#lastsubTaught').val().length == 0) {
            showMessageTheme2(0, "Please select Courses Taught.", '', false);
            return false;
        }
    } else if (keyId == "studentEmailId" || keyId == "altEmailId" || keyId == "motherEmail" || keyId == "fatherEmail" || keyId == "guardianEmail" || keyId == "offEmailId" || keyId == "payPalEmail") {
        if (keyId == "studentEmailId") {
            if (!validateEmail($('#' + keyId).val())) {
                showMessageTheme2(0, "Email is either empty or invalid.", '', false);
                return false;
            }
        } else {
            if ($('#' + keyId).val() != null && $('#' + keyId).val() != undefined && $('#' + keyId).val() != "") {
                if (!validateEmail($('#' + keyId).val())) {
                    showMessageTheme2(0, "Email is either empty or invalid.", '', false);
                    return false;
                }
            }
        }

    } else if (keyId == 'sendUserVerificationEmail' || keyId == 'verifyUserEmail' || keyId == 'middleName' || keyId == 'lastName' || keyId == 'switchParentStudEmailId' || keyId == 'reserveASeat' || keyId == 'bookASeatNextGradeOpted' || keyId == 'advanceGradeOpted' || "motherMiddleName" || "fatherMiddleName" || "guardianMiddleName") {

    } else if (keyId == "parentEmailSmsLmsCreation") {
        if (!validPassword($("#parentPassword").val())) {
            showMessageTheme2(0, "Please Enter parent password.", '', false);
            return false;
        }
        if (!validPassword($("#confirmPassword").val())) {
            showMessageTheme2(0, "Please Enter parent confirm password.", '', false);
            return false;
        }
        if ($('#parentPassword').val().trim() != $('#confirmPassword').val().trim()) {
            showMessageTheme2(0, "Password and Confirm Password do not match.", '', false);
            return false;
        }

        var pass = $("#parentPassword").val();
        if (pass != undefined) {
            if (!(pattern.test(pass))) {
                showMessageTheme2(0, "Passwords must match all requirements.", '', false);
                return false
            }
        }
    } else if (keyId == "parentEmailLmsCreation") {
        if (!validateEmail($('#parentEmailId').val())) {
            showMessageTheme2(0, "Email is either empty or invalid.", '', false);
            return false;
        }
    } else if (keyId == 'pEmailOtp') {
        if (!validateEmail($('#parentEmailId').val())) {
            showMessageTheme2(0, "Email is either empty or invalid.", '', false);
            return false;
        }
    } else if (keyId == 'pEmailOtpVerify') {
        if (!validateEmail($('#parentEmailId').val())) {
            showMessageTheme2(0, "Email is either empty or invalid.", '', false);
            return false;
        }
        if ($('#otp').val() == undefined || $('#otp').val() == '') {
            showMessageTheme2(0, "Either Otp value is invalid or empty.", '', false);
            return false;
        }
    } else if (keyId == 'pStudEmailMappedVerify') {
        if (!validateEmail($('#parentEmailId').val())) {
            showMessageTheme2(0, "Email is either empty or invalid.", '', false);
            return false;
        }
        if (!validateEmail($('#verifyMailId').val())) {
            showMessageTheme2(0, "Email is either empty or invalid.", '', false);
            return false;
        }
    } else {
        if (fieldValue == '' || fieldValue == undefined || fieldValue == 0) {
            showMessageTheme2(0, "Either field value is invalid or empty.", '', false);
            return false;
        }
    }

    return true;
}

function checkParentType(eleID, keyId){
    var relationType = PROFILE_RESPONSE_DATA.profileData.studentProfile[1].relationType;
    var parentUserId = PROFILE_RESPONSE_DATA.profileData.studentProfile[1].parentUserId;
    if(parentUserId != null && parentUserId != undefined && parentUserId != 0){
        if(relationType  == "Mother" && $("#"+eleID).val() == "" && keyId == "motherEmail"){
            showMessageTheme2(0, "Primary parent email is mandatory");
            var email = PROFILE_RESPONSE_DATA.profileData.studentProfile[1][eleID];
            $("#"+eleID).val(email);
            $("#"+eleID).closest(".input-group").find(".input-group-append-hide").find(".btn-danger").trigger("click");
            return false;
        } else if(relationType  == "Father" && $("#"+eleID).val() == "" && keyId == "fatherEmail"){
            showMessageTheme2(0, "Primary parent email is mandatory");
            var email = PROFILE_RESPONSE_DATA.profileData.studentProfile[1][eleID];
            $("#"+eleID).val(email);
            $("#"+eleID).closest(".input-group").find(".input-group-append-hide").find(".btn-danger").trigger("click");
            return false;
        } else if(relationType  == "Guardian" && $("#"+eleID).val() == "" && keyId == "guardianEmail"){
            showMessageTheme2(0, "Primary parent email is mandatory");
            var email = PROFILE_RESPONSE_DATA.profileData.studentProfile[1][eleID];
            $("#"+eleID).val(email);
            $("#"+eleID).closest(".input-group").find(".input-group-append-hide").find(".btn-danger").trigger("click");
            return false;
        }else {
            return true;
        }
    }else{
        return true;
    }
}

function applyChanges(eleID, keyId, userId, studentStandardId, roleModuleId, moduleId, showWarning, index) {
    if (!getSession()) {
        showMessageTheme2(0, "Your session has been timed out, please login again", '', false);
        redirectLoginPage();
        return false;
    }
    if (eleID != "hobbies" || eleID != "extracurricular") {
        var fieldValue = $("#" + eleID).val();
    }
    if (keyId == 'firstName' || keyId == 'middleName' || keyId == 'lastName'
        || keyId == 'motherName' || keyId == 'fatherFirstName' || keyId == 'guardianFirstName'
        || keyId == 'lastOrgName' || keyId == 'lastJobTitle' || keyId == 'address' || keyId == 'otherSkills'
        || keyId == 'designation' || keyId == 'departmentId' || keyId == 'acPersonName' || keyId == 'bankName'
        || keyId == 'bankBranchName' || keyId == 'bankBranchAddress' || keyId == 'otherBankDetails' || keyId == 'otherProfessionalCourse'
        || keyId == 'otherSpecialization' || keyId == 'anyOtherLanguages' || keyId == 'references1' || keyId == 'references2'
        || keyId == 'specialization' || keyId == 'postGraduationSubjects' || keyId == 'graduationSubjects' || keyId == 'educationSpecialization' || keyId == 'forcefulRepeatOrImprove') {
        /*fieldValue = toTitleCase(fieldValue);*/
    }else if(keyId == 'motherEmail' || keyId == 'fatherEmail' || keyId == 'guardianEmail'){
        if (!checkParentType(eleID, keyId)) {
            return false; // yahin se poora function ruk jayega
        }
        // var parentEmailVerify = checkParentType(eleID, keyId);
        // if(!parentEmailVerify){
        //     return false;
        // }
    } else if (keyId == 'describeYourself' || keyId == 'lastOrgJobDiscription') {
        fieldValue = fieldValue;
    } else if (keyId == 'timezone' && !showWarning) {
        fieldValue = fieldValue;
    } else if (keyId == 'nationality' && showWarning) {
        if ($("#" + eleID + " option:selected").val() != "") {
            fieldValue = $("#" + eleID + " option:selected").text().trim();
        } else {
            fieldValue = "";
        }
    }
    else if (keyId == 'preferredcommunication') {
        var pcWhatsapp = $('#pcWhatsappView').is(':checked') ? 'Y' : 'N';
        var pcCall = $('#pcCallView').is(':checked') ? 'Y' : 'N';
        var pcEmail = $('#pcEmailView').is(':checked') ? 'Y' : 'N';
        if (pcWhatsapp == "N" && pcCall == "N" && pcEmail == "N") {
            showMessageTheme2(0, 'Your preferred communication is required.', '', false);
            return false;
        }
    }
    if (showWarning) {
        if (keyId == 'timezone' && moduleId == 'student') {
            showWarningMessageShow('You are about to change the timezone of the user. Please note that all future booked classes of the user will be updated to the new timezone.', 'applyChanges(\'' + eleID + '\',\'' + keyId + '\',\'' + userId + '\',\'' + studentStandardId + '\',\'' + roleModuleId + '\',\'' + moduleId + '\',false)', false);
            return false;
        } else if (keyId == 'timezone' && moduleId == 'teacher') {
            showWarningMessageShow('You are about to change the timezone of the teacher. Please note that all future classes of the teacher (recurring and normal) in the old time zone will be updated to the new timezone.', 'applyChanges(\'' + eleID + '\',\'' + keyId + '\',\'' + userId + '\',\'' + roleModuleId + '\',\'' + moduleId + '\',false)', false);
            return false;
        }
    }
    // console.log("Field Value",fieldValue)
    hideMessageTheme2('');
    if (eleID != "hobbies") {
        if (!validateFields(eleID, keyId, fieldValue)) {
            return false;
        }
    }
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForHTML('dashboard', 'update-user-profile-content'),
        data: JSON.stringify(getRequestForUpdateProfile(eleID, keyId, userId, studentStandardId, moduleId)),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(0, data['message'], '', false);
            }
            else {
                CUSTOM_DATEPICKER_FIELD_FLAG=false;
                if (keyId == "firstName" || keyId == "lastName") {
                    $(".userNameLabel").text($("#firstName").val() + " " + $("#lastName").val());
                    $("#" + eleID).closest(".input-group").find(".input-group-append-hide").hide();
                } else if (keyId == 'phoneNumber' || keyId == 'alternatePhoneNumber' || keyId == 'motherPhoneNumber' || keyId == 'alternateParentPhoneNumber' || keyId == 'payPalPhoneNumber') {
                    var isdCode = "";
                    if (keyId == 'phoneNumber') {
                        isdCode = $('#phoneDailCode').val() + '-';//$(".stuPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
                    } else if (keyId == 'alternatePhoneNumber') {
                        isdCode = $('#alternateDailCode').val() + '-';//$(".stuAlternatePhoneNumber .iti__active").last().attr("data-dial-code")+'-';
                    } else if (keyId == 'motherPhoneNumber') {
                        isdCode = $('#parentPhoneDailCode').val() + '-';//$(".stuParentPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
                    } else if (keyId == 'alternateParentPhoneNumber') {
                        isdCode = $('#alternateParentPhoneDailCode').val() + '-';//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
                    } else if (keyId == 'payPalPhoneNumber') {
                        isdCode = $('#payPalDailCode').val() + '-';//$(".stuAlternateParentPhoneNumber .iti__active").last().attr("data-dial-code")+'-';
                    }
                    // console.log("Isd Code",isdCode);
                    $("#" + eleID).closest(".input-group").find(".input-group-append-hide").hide();
                } else if (keyId == 'preferredcommunication') {
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                    // keep UI `check-status` in sync with saved state so percentage reflects immediately
                    $(".communication-wrapper input[type='checkbox']").each(function () {
                        $(this).attr("check-status", $(this).prop("checked") ? "true" : "false");
                    });
                } else if (keyId == 'gender' || keyId == 'parentGender') {
                    if (fieldValue == 'DONOTWANTTOSPECIFY') {
                        fieldValue = "Don't want to specify";
                    }
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                    $("#" + eleID).val(fieldValue).trigger("change");
                    $("#" + eleID).parent().find('.input-group-append-hide').hide();
                    //$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    if ($('#isProfileUplaoded').val() == 0 && keyId == 'gender') {
                        var profilePic = "Profile-picture.jpg"
                        if (fieldValue == 'DONOTWANTTOSPECIFY') {
                            fieldValue = "Don't want to specify";
                            profilePic = "Profile-picture.jpg"
                        } else if (fieldValue == 'MALE') {
                            profilePic = "male-profile.png"
                        } else if (fieldValue == 'FEMALE') {
                            profilePic = "female-profile.png"
                        }
                        $('.profile-pic').attr('src', PATH_FOLDER_IMAGE2 + profilePic);
                        $('#dropDownProfileImage').attr('src', PATH_FOLDER_IMAGE2 + profilePic);
                        $('#topProfileImage').attr('src', PATH_FOLDER_IMAGE2 + profilePic);
                    }
                } else if (keyId == 'countrySection' || keyId == 'countrySectionParent') {
                    var elementIDs = $("#" + eleID).attr("data-country").split("_");
                    $.each(elementIDs, function (i, v) {
                        $("#" + v).closest(".input-group").find(".input-group-append-hide").hide();
                    });
                } else if (keyId == 'socialMedia') {
                    $("[id='" + eleID + "']").parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'motherName' || keyId == 'motherLastName') {
                    $("#motherName, #motherLastName").parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'fatherFirstName' || keyId == 'fatherLastName') {
                    $("#fatherFirstName, #fatherLastName").parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'guardianFirstName' || keyId == 'guardianLastName') {
                    $("#guardianFirstName, #guardianLastName").parent().find(".input-group-append-hide").hide();
                }
                else if (keyId == 'studyingGradeId') {
                    $('.studyingGradeName').text($('#studyingGradeId option:selected').text()).removeClass('hide-value');
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'countryIdOfSchool') {
                    $('.countryNameOfSchool').text($('#countryIdOfSchool option:selected').text()).removeClass('hide-value');
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'countrySectionParent') {
                    $('.countryNameParent').text($('#pCountryId option:selected').text()).removeClass('hide-value');
                    $('.cityNameParent').text($('#pCityId option:selected').text()).removeClass('hide-value');
                    $('.stateNameParent').text($('#pStateId option:selected').text()).removeClass('hide-value');
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                    $('.save-country-Parent').addClass('d-none');
                } else if (keyId == 'admissonDate') {
                    var adDate = $('#admissonDate').val();
                    // adDate=adDate.split('-');
                    // var selectedDate=new Date(adDate[0]+'/'+adDate[1]+'/'+adDate[2]);
                    // var selectedDate2 = selectedDate.toString().split(" ");
                    $('.admissionViewDate').text(adDate).removeClass('hide-value');
                    // //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    // $(src).parent().find('.field-input').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'dob') {
                    var adDate = $('#dob').val();
                    // adDate=adDate.split('-');
                    // var selectedDate=new Date(adDate[0]+'/'+adDate[1]+'/'+adDate[2]);
                    // var selectedDate2 = selectedDate.toString().split(" ");
                    $('.dobViewDate').text(adDate).removeClass('hide-value');
                    // //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    // $(src).parent().find('.field-input').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'reserveASeat') {
                    $('.reserveASeatName').text($('#reserveASeat option:selected').text()).removeClass('hide-value');
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + keyId).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'bookASeatNextGradeOpted') {
                    hidePermissionAndApprovalModal('bookASeatNextGradeOpted', 'save');
                    $('.reserveASeatNextGradeName').text($('#bookASeatNextGradeOpted option:selected').text()).removeClass('hide-value');
                    // $("#"+src).parent().find('.cancel-field-btn').removeClass('visible');
                    // $("#"+src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    // $("#"+src).removeClass('visible').parent().find('.edit-field-btn').show();
                    if ($('#bookASeatNextGradeOpted option:selected').text() == 'Yes') {
                        $('.advanceNextGradeName').html('No');
                        $('#advanceGradeOpted').val('0')
                    } else if ($('#bookASeatNextGradeOpted option:selected').text() == 'No') {
                        // $('.advanceNextGradeName').html('No');
                        // $('#advanceGradeOpted').val('0')
                    }
                } else if (keyId == 'advanceGradeOpted') {
                    hidePermissionAndApprovalModal('advanceGradeOpted', 'save');
                    $('.advanceNextGradeName').text($('#advanceGradeOpted option:selected').text()).removeClass('hide-value');
                    // $("#"+src).parent().find('.cancel-field-btn').removeClass('visible');
                    // $("#"+src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    // $("#"+src).removeClass('visible').parent().find('.edit-field-btn').show();
                    if ($('#bookASeatNextGradeOpted option:selected').text() == 'Yes') {
                        $('.reserveASeatNextGradeName').html('No');
                        $('#bookASeatNextGradeOpted').val('0')
                    } else if ($('#bookASeatNextGradeOpted option:selected').text() == 'No') {
                        // $('.reserveASeatNextGradeName').html('No');
                        // $('#bookASeatNextGradeOpted').val('0')
                    }
                } else if (keyId == 'specialization') {
                    $('.specilZViewSubject').text(data['extra']).removeClass('hide-value');
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'totalTeacheingExperience') {
                    $('.totalTeacheingExpView').text(data['extra']).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'preferredSubjectName') {
                    $('.preferredSubjectNameView').text(data['extra']).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'lastsubTaught') {
                    $('.lastsubTaughtView').text(data['extra']).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'lastOrgGradeName') {
                    $('.lastOrgGradeNameView').text(data['extra']).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'preferredGradeName') {
                    $('.prefGradeNameView').text(data['extra']).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'departmentId') {
                    $('.departmentNameView').text($('#' + keyId).val()).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'timezone') {
                    IS_TIMEZONE_CHANGED = true;
                    $('.countryTimezoneView').text(data['extra']).removeClass('hide-value');
                    $('.timeZoneSavedStatus').text("");
                    // $('.cancel-field-btn').removeClass('visible');
                    // $('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    // $('.save-field-btn').removeClass('visible').parent().find('.edit-field-btn').show();
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'designation') {
                    $('.designationView').text($('#' + keyId).val()).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'otherRelation' || keyId == 'relationType') {
                    var viewValue = '';
                    if ('Other' == $('#relationType').val()) {
                        viewValue = toTitleCase($('#otherRelation').val());
                    } else {
                        viewValue = $('#relationType').val();
                    }
                    $('.relationTypeView').text(viewValue).removeClass('hide-value');
                    //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                    $(".otherRelationDiv").hide();
                } else if (keyId == 'joiningDate') {
                    var adDate = $('#joiningDate').val();
                    adDate = adDate.split('-');
                    var selectedDate = new Date(adDate[0] + '/' + adDate[1] + '/' + adDate[2]);
                    var selectedDate2 = selectedDate.toString().split(" ");
                    $('.joiningDateView').text(selectedDate2[1] + ", " + selectedDate2[2] + " " + selectedDate2[3]).removeClass('hide-value');
                    // //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    // $(src).parent().find('.field-input').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'employeeType') {
                    var conversionDate = $("#employeeTypeStartDate").val();
                    conversionDate = conversionDate.split('-');
                    var selectedDate = new Date(conversionDate[0] + '/' + conversionDate[1] + '/' + conversionDate[2]);
                    var selectedDate2 = selectedDate.toString().split(" ");
                    var employeeType = $("#employeeType").val();
                    $('.employee_type').text(employeeType).removeClass('hide-value');
                    $('.employee_type_start_date').text(selectedDate2[1] + ", " + selectedDate2[2] + " " + selectedDate2[3]);
                    // $(src).parent().find('.field-value').removeClass('hide-value');
                    // //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
                    // //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    $("#" + eleID).parent().find(".input-group-append-hide").hide();
                } else if (keyId == 'parentEmailId') {
                    if (data['statusCode'] == 'ST001') {
                        $('.stu-confirmation').show();
                        $("#studentEmailId").html(data['extra']);
                        $('.parentCreationCheck').css("display", "none");
                        $('.parentLmsCreationCheck').css("display", "none");
                        $('.parentOtpcheck').css("display", "none");
                        //$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
                        // //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
                        // //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                        // $(src).parent().find('.save-field-btn').removeClass('visible');
                        // $(src).parent().find('.edit-field-btn').removeClass('visible');
                    } else if (data['statusCode'] == 'ST002') {
                        $('.parentCreationCheck').css("display", "none");
                        $('.parentLmsCreationCheck').css("display", "none");
                        $('.parentEmailswipe').css("display", "none");
                        $('.parentOtpcheck').css("display", "none");
                        $('.parentOtpcheck').css("display", "block");
                        //$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
                        // //$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
                        // //$(src).parent().find('.cancel-field-btn').removeClass('visible');
                        // $(src).parent().find('.save-field-btn').removeClass('visible');
                        // $(src).parent().find('.edit-field-btn').removeClass('visible');
                    } else {
                        $('.parentOtpcheck').css("display", "none");
                        $('.parentCreationCheck').css("display", "none");
                        $('.parentLmsCreationCheck').css("display", "none");
                        $('.parentEmailswipe').css("display", "none");
                        if (data['extra'] == 'N') {
                            $('.parentCreationCheck').css("display", "block");
                        } else if (data['extra1'] == 'N') {
                            $('.parentLmsCreationCheck').css("display", "block");
                        }
                        $("#" + eleID).parent().find(".input-group-append-hide").hide();
                        //$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
                        ////$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
                        ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                    }
                } else if (keyId == 'parentEmailSmsLmsCreation') {
                    $('.parentSmsCreatedView').text('Yes').removeClass('hide-value');
                    $('.parentLmsCreatedView ').text('Yes').removeClass('hide-value');
                    if (data['extra'] == 'Y') {
                        $('.parentLmsStatusView').text('Active').removeClass('hide-value');
                    } else {
                        $('.parentLmsStatusView').text('Inactive').removeClass('hide-value');
                    }
                    $('.parentCreationCheck').css("display", "none");
                    $('.separate-user-for-parent').slideUp()
                } else if (keyId == 'parentEmailLmsCreation') {
                    $('.parentSmsCreatedView').text('Yes').removeClass('hide-value');
                    $('.parentLmsCreatedView ').text('Yes').removeClass('hide-value');
                    if (data['extra'] == 'Y') {
                        $('.parentLmsStatusView').text('Active').removeClass('hide-value');
                    } else {
                        $('.parentLmsStatusView').text('Inactive').removeClass('hide-value');
                    }
                    $('.parentLmsCreationCheck').css("display", "none");
                    $('.separate-lms-user-for-parent').css("display", "none");
                } else if (keyId == 'pEmailOtp') {

                } else if (keyId == 'pEmailOtpVerify') {
                    $('.parentOtpcheck').css("display", "none");
                    $('.parentCreationCheck').css("display", "block");
                } else if (keyId == 'pStudEmailMappedVerify') {
                    $('.stu-confirmation').hide();
                    $('.parentOtpcheck').css("display", "none");
                    $('.parentCreationCheck').css("display", "none");
                    $('.parentLmsCreationCheck').css("display", "none");
                    $('.parentEmailswipe').css("display", "none");
                    if (data['extra'] == 'N') {
                        $('.parentCreationCheck').css("display", "block");
                    } else if (data['extra1'] == 'N') {
                        $('.parentLmsCreationCheck').css("display", "block");
                    }
                } else if (keyId == 'switchParentStudEmailId') {
                    $('#studID').prop('disabled', false);
                    $('#updatedStudEmail').text('');
                    $('#updatedParentEmail').text('');
                    $('.swap-Id-Wrapper').addClass('d-none');
                    $('.studParntswipedata').css("display", "none");
                    $('#switchParentEmail').prop('checked', false);
                    $('#parentEmailId').removeClass('visible').parent().find('.edit-field-btn').show();
                    if (data['statusCode'] == '1') {
                        $('.emailIdView').text(data['extra']).removeClass('hide-value');
                    }
                    $('#swipeParentId').val(data['extra1']);
                    $('.parentEmailswipe').css("display", "none");
                    $('.parentEmailIdView').text(data['extra1']).removeClass('hide-value');
                } else if (keyId == "communicationPreferredSlots") {
                    $("#communication-preferred-time-dropdown-wrapper").hide();
                    $("#communicationPreferredSlotSave").hide();
                    $(".addcommunicationPreferredTimeBtn").show();
                }
                else {
                    $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
                    if (keyId == 'sendUserVerificationEmail' || keyId == 'verifyUserEmail') {
                        //$(src).parent().find('.field-value').removeClass('hide-value').html(fieldValue+'<i class="fa fa-check text-success ml-2"></i>');
                        window.location.reload();
                    } else {
                        //$(src).parent().find('.field-value').removeClass('hide-value').text(fieldValue);
                    }
                    ////$(src).parent().find('.field-input, .iti--allow-dropdown, .select2').removeClass('visible')
                    ////$(src).parent().find('.cancel-field-btn').removeClass('visible');
                }
                if (data['statusCode'] == 'ST001') {
                } else {
                    if(!RESERVE_ENROLLMENT_SAVE_BULK){
                        showMessageTheme2(1, data['message'], '', false);
                        overWriteProfileData(eleID, keyId);
                        var index = SAVE_BLUK_PROFILE_DATA.findIndex(item => item.eleID === "bookASeatNextGradeOpted");
                        if (index !== -1) {
                            SAVE_BLUK_PROFILE_DATA.splice(index, 1);
                        }
                    }else{
                        if (!BULK_PROFILE_SAVE_CONTEXT || !BULK_PROFILE_SAVE_CONTEXT.currentWarningItem) {
                            return false;
                        }
                        BULK_PROFILE_SAVE_CONTEXT.currentWarningItem = null;
                        BULK_PROFILE_SAVE_CONTEXT.currentIndex++;
                        RESERVE_ENROLLMENT_SAVE_BULK=false;
                        // console.log("not updated",PROFILE_RESPONSE_UPDATED_DATA);
                        
                        overWriteProfileData(eleID, keyId);
                        var index = SAVE_BLUK_PROFILE_DATA.findIndex(item => item.eleID === "bookASeatNextGradeOpted");
                        if (index !== -1) {
                            SAVE_BLUK_PROFILE_DATA.splice(index, 1);
                        }
                        SAVE_BLUK_PROFILE_DATA=[];
                        // console.log("updated",PORFILE_RESPONSE_UPDATED_DATA);
                        return processApplyChnagesBulkWarnings();
                    }
                }
                
                
            }
            calculateSectionPercentage();
            if(USER_ROLE == "STUDENT"){ 
                SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(item => item.eleID !== item.eleID);
                var eleIdsToRemove=[];
                if(eleID == "extracurricular"){
                    eleID = "extracurricularActivities";
                }
                var eleIdsToRemove = []; eleIdsToRemove.push(eleID);
                updateProfileLocalStorageData(eleIdsToRemove);
                refreshProfileMissingModalStateAfterBulkSave(missingFields); 
            }
            return false;
        }
    });
}

function controlEditField(src, eleID, eleValue, saveType, avalWhtsAppStatusID, countryCode, index, keyId, avalemergencyStatusID) {
    if (saveType == 'input') {
        var fieldValue = getValue(eleID, index); 
        // if(keyId == "customProfileFieldId"){
                // fieldValue = getValue(eleID);
        // }else{
        //     fieldValue = PROFILE_RESPONSE_UPDATED_DATA[index][eleID]
        // }
        if ($("#" + eleID).val() != fieldValue) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });

            // if(eleID == "motherName" || eleID == "motherLastName"){
            //     if(eleID == "motherName" && $("#motherLastName").val()==""){
            //         $("#motherLastName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }
            //     if(eleID == "motherLastName" && $("#motherName").val()==""){
            //         $("#motherName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }
            // }
            // if(eleID == "fatherFirstName" || eleID == "fatherLastName"){
            //     if(eleID == "fatherFirstName" && $("#fatherLastName").val()==""){
            //         $("#fatherLastName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }
            //     if(eleID == "fatherLastName" && $("#fatherFirstName").val()==""){
            //         $("#fatherFirstName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }
            // }
            // if(eleID == "guardianFirstName" || eleID == "guardianLastName"){
            //     if(eleID == "guardianFirstName" && $("#guardianLastName").val()==""){
            //         $("#guardianLastName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }
            //     if(eleID == "guardianLastName" && $("#guardianFirstName").val()==""){
            //         $("#guardianFirstName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }
            // }
            addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
        } else {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
            addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
            // if(eleID == "motherName" || eleID == "motherLastName"){
            //     if(eleID == "motherName" && $("#motherLastName").val()!=PROFILE_RESPONSE_DATA.profileData.studentProfile[1]['motherLastName']){
            //         $("#motherLastName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }else{
            //         $("#motherLastName").closest(".input-group").find(".input-group-append-hide").hide();
            //     }
            //     if(eleID == "motherLastName" && $("#motherName").val()!=PROFILE_RESPONSE_DATA.profileData.studentProfile[1]['motherName']){
            //         $("#motherName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }else{
            //         $("#motherName").closest(".input-group").find(".input-group-append-hide").hide();
            //     }
            // }
            // if(eleID == "fatherFirstName" || eleID == "fatherLastName"){
            //     if(eleID == "fatherFirstName" && $("#fatherLastName").val()!=PROFILE_RESPONSE_DATA.profileData.studentProfile[1]['fatherLastName']){
            //         $("#fatherLastName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }else{
            //         $("#fatherLastName").closest(".input-group").find(".input-group-append-hide").hide();
            //     }
            //     if(eleID == "fatherLastName" && $("#fatherFirstName").val()!=PROFILE_RESPONSE_DATA.profileData.studentProfile[1]['fatherFirstName']){
            //         $("#fatherFirstName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }else{
            //         $("#fatherFirstName").closest(".input-group").find(".input-group-append-hide").hide();
            //     }
            // }
            // if(eleID == "guardianFirstName" || eleID == "guardianLastName"){
            //     if(eleID == "guardianFirstName" && $("#guardianLastName").val()!=PROFILE_RESPONSE_DATA.profileData.studentProfile[1]['guardianLastName']){
            //         $("#guardianLastName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }else{
            //         $("#guardianLastName").closest(".input-group").find(".input-group-append-hide").hide();
            //     }
            //     if(eleID == "guardianLastName" && $("#guardianFirstName").val()!=PROFILE_RESPONSE_DATA.profileData.studentProfile[1]['guardianFirstName']){
            //         $("#guardianFirstName").closest(".input-group").find(".input-group-append-hide").css({"display":"flex"});
            //     }else{
            //         $("#guardianFirstName").closest(".input-group").find(".input-group-append-hide").hide();
            //     }
            // }
        }
    } else if (saveType == "select") {
        if ($("#" + eleID).val() != PROFILE_RESPONSE_UPDATED_DATA[index][eleID == "nationality" ? "nationalityId" : eleID == "previousCurrentGradeName" ? "previousCurrentGradeId" : eleID]) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            if (eleID == "reserveASeat" && (PROFILE_RESPONSE_UPDATED_DATA[index][eleID] == "N" && $("#" + eleID).val() == "1")) {
                $("#reserveASeat").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            } else if (eleID == "reserveASeat" && (PROFILE_RESPONSE_UPDATED_DATA[index][eleID] == "Y" && $("#" + eleID).val() == "0")) {
                $("#reserveASeat").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            }
            else {
                if (eleID == "reserveASeat"){
                    $("#reserveASeat").closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
                    addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
                }
                
            }
            if (eleID == "bookASeatNextGradeOpted" && eleID != "advanceGradeOpted" && (PROFILE_RESPONSE_UPDATED_DATA[index][eleID] == "N" && $("#" + eleID).val() == "1")) {
                $("#bookASeatNextGradeOpted").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            } else if (eleID == "bookASeatNextGradeOpted" && eleID != "advanceGradeOpted" && (PROFILE_RESPONSE_UPDATED_DATA[index][eleID] == "Y" && $("#" + eleID).val() == "0")) {
                $("#bookASeatNextGradeOpted").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            }
            else {
                if (eleID == "bookASeatNextGradeOpted"){
                    $("#bookASeatNextGradeOpted").closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
                    addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
                }
            }
            if (eleID == "advanceGradeOpted" && eleID != "bookASeatNextGradeOpted" && (PROFILE_RESPONSE_UPDATED_DATA[index][eleID] == "N" && $("#" + eleID).val() == "1")) {
                $("#advanceGradeOpted").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            } else if (eleID == "advanceGradeOpted" && eleID != "bookASeatNextGradeOpted" && (PROFILE_RESPONSE_UPDATED_DATA[index][eleID] == "Y" && $("#" + eleID).val() == "0")) {
                $("#advanceGradeOpted").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            }
            else {
                if (eleID == "advanceGradeOpted"){
                    $("#advanceGradeOpted").closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
                    addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
                }
            }


            if (eleID == "country" ||  eleID == "state" || eleID == "city" || eleID == "motherCountry" || eleID == "fatherCountry" || eleID == "guardianCountry" || eleID == "timezone" || eleID == "nationality" || eleID == "previousCurrentSchoolCountry") {
                $("#"+eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            }else{
                if(eleID == "relationType"){
                    PROFILE_RESPONSE_UPDATED_DATA[index][eleID]=$("#"+eleID).val();
                }
                $("#"+eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
                addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            }
            
            
            // if (eleID == "pCountryId") {
            //     $("#pStateId, #pCityId").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            //     addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
            // }
        } else {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
            addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
        }

    } else if (saveType == "hobbies") {
        var indexNum = PROFILE_RESPONSE_UPDATED_DATA[index][saveType].findIndex(item => item.id === $(eleID).attr("id"));
        if (($(eleID).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index][saveType][parseInt(indexNum)]["status"]) {
            HOBBIES_CHANGES_COUNT.push($(eleID).attr("data-hobbie-label"))
            $("#saveHobbiesWrapper").show();
            addAndRemoveRequestToSaveBulkData(true, keyId, keyId);
            if ($(eleID).parent().hasClass('added-hobbie-wrapper')) {
                $(eleID).parent().remove();
                HOBBIES_CHANGES_COUNT = HOBBIES_CHANGES_COUNT.filter(function (item) {
                    return item !== $(eleID).attr("data-hobbie-label");
                });
                if (HOBBIES_CHANGES_COUNT.length == 0) {
                    $("#saveHobbiesWrapper").hide();
                    addAndRemoveRequestToSaveBulkData(false, keyId, keyId);
                }
            }
        } else {
            HOBBIES_CHANGES_COUNT = HOBBIES_CHANGES_COUNT.filter(function (item) {
                return item !== $(eleID).attr("data-hobbie-label");
            });
            if (HOBBIES_CHANGES_COUNT.length == 0) {
                $("#saveHobbiesWrapper").hide();
                addAndRemoveRequestToSaveBulkData(false, keyId, keyId);
            } else {
                addAndRemoveRequestToSaveBulkData(true, keyId, keyId);
            }
        }
    } else if (saveType == "communication") {
        if (($(eleID).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index][$(eleID).attr("id")]) {
            COMMUNICATION_CHANGES_COUNT.push($(eleID).attr("data-communication-label"));
            $("#saveCommunicationWrapper").show();
            addAndRemoveRequestToSaveBulkData(true, keyId, keyId);
        } else {
            COMMUNICATION_CHANGES_COUNT = COMMUNICATION_CHANGES_COUNT.filter(function (item) {
                return item !== $(eleID).attr("data-communication-label");
            });
            if (COMMUNICATION_CHANGES_COUNT.length == 0) {
                $("#saveCommunicationWrapper").hide();
                addAndRemoveRequestToSaveBulkData(false, keyId, keyId);
            }
        }
    } else if (saveType == "extracurricular") {
        if (($(eleID).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index]["sportsAndECList"][parseInt($(eleID).attr("data-index-id"))]["value"]) {
            SPORTS_AND_CLUB_COUNT.push($(eleID).attr("data-Id"));
            $("#saveSportsAndEcClubWrapper").show();
            addAndRemoveRequestToSaveBulkData(true, keyId, keyId);
        } else {
            SPORTS_AND_CLUB_COUNT = SPORTS_AND_CLUB_COUNT.filter(function (item) {
                return item !== $(eleID).attr("data-Id");
            });
            if (SPORTS_AND_CLUB_COUNT.length == 0) {
                $("#saveSportsAndEcClubWrapper").hide();
                addAndRemoveRequestToSaveBulkData(false, keyId, keyId);
            }
        }
    } else if (saveType == "inputPhone") {
        if ($("#" + eleID).val().replace(/\s+/g, '') != PROFILE_RESPONSE_UPDATED_DATA[index][eleID]) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
        } else if (($("#" + avalWhtsAppStatusID).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index][avalWhtsAppStatusID]) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
        } else if ($("#" + eleID).attr("data-countrycode") != PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]] && PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]] != "") {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
        } else if (($("#" + avalemergencyStatusID).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index][avalemergencyStatusID]) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
        } else {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
            addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
        }

    } else if (saveType == "socialMedia") {
        var elementLabel = eleID.split("URL");
        elementLabel = elementLabel[0];
        var indexNum = PROFILE_RESPONSE_UPDATED_DATA[index][saveType].findIndex(item => item.socMedLabel === elementLabel);
        if ($("[id='" + eleID + "']").val() != PROFILE_RESPONSE_UPDATED_DATA[index][saveType][(parseInt(indexNum))][$("[for='" + eleID + "']").attr("data-title") + "_URL"]) {
            // if($("#"+eleID).val()!=PROFILE_RESPONSE_UPDATED_DATA[index][saveType][(parseInt($("#"+eleID).attr("data-social-media-id"))-1)][$("[for='"+eleID+"']").attr("data-title")+"_URL"]){
            $("[id='" + eleID + "']").closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, keyId);
        } else {
            $("[id='" + eleID + "']").closest(".input-group").find(".input-group-append-hide").hide();
            addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
        }
    } else if (saveType == "custom"){
        var ele_type = $(src).attr("data-element-type");
        var save_control_id = $(src).attr("data-save-wrapper");
        if(ele_type == "radio" || ele_type == "checkbox"){
            $("#"+save_control_id).show();
            addAndRemoveRequestToSaveBulkData(true, keyId, keyId);
        }
    }
    // if (!RENDER_FLAG) {
    //     $(".input-group-append.input-group-append-hide").hide();
    //     RENDER_FLAG = true;
    // }
}
function cancelChanges(eleID, eleValue, saveType, keyId, whatsAppStatusEleId, emergencyNumberStatusEleId, index){
    if(saveType == 'input'){
        $("#"+eleID).val(eleValue);
        $("#"+eleID).closest(".input-group").find(".input-group-append-hide").css({"display":"none"});
        if(eleID.endsWith("URL")){
            SAVE_BLUK_PROFILE_DATA = SAVE_BLUK_PROFILE_DATA.filter(
                item => item.eleID !== eleID
            );
            // console.log("remove", SAVE_BLUK_PROFILE_DATA);
        }
    }else if(saveType == 'inputPhone'){
        $("#"+eleID).val(eleValue);
        if(eleID == "motherPhoneNumber" || eleID == "fatherPhoneNumber"){
            $("#"+emergencyNumberStatusEleId).prop("checked", (PROFILE_RESPONSE_UPDATED_DATA[index][emergencyNumberStatusEleId] == "Y"? true:false));
        }
        $("#"+whatsAppStatusEleId).prop("checked", (PROFILE_RESPONSE_UPDATED_DATA[index][whatsAppStatusEleId] == "Y"? true:false));
        $("#"+eleID).closest(".input-group").find(".input-group-append-hide").css({"display":"none"});
    }else if(saveType == "select"){
        $("#"+eleID).val(eleValue).trigger("change");
        $("#"+eleID).closest(".input-group").find(".input-group-append-hide").css({"display":"none"});
    }else if(saveType == "countrySection"){
        var elementIDs = $("#"+eleID).attr("data-country").split("_");
        $.each(elementIDs, function(i, v) {
            var targetValue = PROFILE_RESPONSE_DATA.profileData.studentProfile[0][v];
            var found = false;
            $("#" + v + " option").each(function (key, value) {
                if ($(this).val() == targetValue) {
                    $("#" + v).val(targetValue).trigger("change");
                    found = true;
                    return false;
                }
            });
            if (!found) {
                $("#" + v).val("").trigger("change");
                $("#" + v).val("").closest(".input-group").find(".input-group-append-hide").hide();
            }
        });
    } else if (saveType == "countrySectionParent") {
        var elementIDs = $("#" + eleID).attr("data-country").split("_");
        $.each(elementIDs, function (i, v) {
            var targetValue = PROFILE_RESPONSE_DATA.profileData.studentProfile[1][v];
            targetValue = targetValue == "0" ? '' : targetValue;
            var found = false;
            $("#" + v + " option").each(function (key, value) {
                if ($(this).val() == targetValue) {
                    $("#" + v).val(targetValue).trigger("change");
                    found = true;
                    return false;
                }
            });
            if (!found) {
                $("#" + v).val("").trigger("change");
                $("#" + v).val("").closest(".input-group").find(".input-group-append-hide").hide();
            }
        });
    }
    if (keyId == "hobbies" || keyId == "preferredcommunication" || keyId == "extracurricular") {
        addAndRemoveRequestToSaveBulkData(false, keyId, keyId);
    } else {
        addAndRemoveRequestToSaveBulkData(false, eleID, keyId);
    }
}

function cancelHobbies() {
    $(".added-hobbie-wrapper input[type='checkbox']:checked").each(function () {
        HOBBIES_CHANGES_COUNT.splice(HOBBIES_CHANGES_COUNT.indexOf($(this).attr("data-hobbie-label")), 1)
    });
    $(".hobbie-wrapper input[type='checkbox']").each(function () {
        HOBBIES_CHANGES_COUNT.splice(HOBBIES_CHANGES_COUNT.indexOf($(this).attr("data-hobbie-label")), 1);
        if ($(this).attr("check-status") == "true") {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });
    $(".added-hobbie-wrapper").remove();
    if (HOBBIES_CHANGES_COUNT.length < 1) {
        $("#saveHobbiesWrapper").hide();
        addAndRemoveRequestToSaveBulkData(false, 'hobbies', 'hobbies');
    }
}

function extraCurricularHobbies(keyId) {
    $(".sports-extra-curriculars-wrapper input[type='checkbox']:checked").each(function () {
        SPORTS_AND_CLUB_COUNT.splice(SPORTS_AND_CLUB_COUNT.indexOf($(this).attr("data-Id")), 1);
        if ($(this).attr("check-status") == "true") {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });
    $(".added-hobbie-wrapper").remove();
    if (SPORTS_AND_CLUB_COUNT.length < 1) {
        $("#saveSportsAndEcClubWrapper").hide();
        addAndRemoveRequestToSaveBulkData(false, keyId, keyId);
    }
}

function cancelCommunication() {
    $(".communication-wrapper input[type='checkbox']").each(function () {
        COMMUNICATION_CHANGES_COUNT.splice(COMMUNICATION_CHANGES_COUNT.indexOf($(this).attr("data-communication-label")), 1);
        if ($(this).attr("check-status") == "true") {
            $(this).prop("checked", true);
        } else {
            $(this).prop("checked", false);
        }
    });
    if (COMMUNICATION_CHANGES_COUNT.length < 1) {
        $("#saveCommunicationWrapper").hide();
        addAndRemoveRequestToSaveBulkData(false, "preferredcommunication", "preferredcommunication");
    }
}


function availableOnWhatsApp(src, eleID, eleValue, saveType, countryCode, index) {
    if (saveType == 'input') {
        if ($("#" + eleID).val().replace(/\s+/g, '') != PROFILE_RESPONSE_UPDATED_DATA[index][eleID]) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, eleID);
        } else if (($(src).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index][$(src).attr("id")]) {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, eleID);
        } else if (countryCode.toLowerCase() != PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]].toLowerCase() && PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]] != "") {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
            addAndRemoveRequestToSaveBulkData(true, eleID, eleID);
        } else {
            $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
            addAndRemoveRequestToSaveBulkData(false, eleID, eleID);
        }
    }
}

function phoneNumberDailCodeChange(eleID, eleValue, eleCurrentValue, avalWhtsAppStatusID, index) {
    PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]] == "" ? PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]] = "us" : PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]];
    if ($("#" + eleID).val().replace(/\s+/g, '') != PROFILE_RESPONSE_UPDATED_DATA[index][eleID]) {
        $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
        addAndRemoveRequestToSaveBulkData(true, eleID, eleID);
    } else if (($("#" + avalWhtsAppStatusID).prop("checked") ? "Y" : "N") != PROFILE_RESPONSE_UPDATED_DATA[index][avalWhtsAppStatusID]) {
        $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
        addAndRemoveRequestToSaveBulkData(true, eleID, eleID);
    } else if (eleCurrentValue.toLowerCase() != PROFILE_RESPONSE_UPDATED_DATA[index][$("#" + eleID).attr("data-idlist").split("_")[2]].toLowerCase()) {
        $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "flex" });
        addAndRemoveRequestToSaveBulkData(true, eleID, eleID);
    } else {
        $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
        addAndRemoveRequestToSaveBulkData(false, eleID, eleID);
    }
}

function renderAndPermissionForAproval(src, keyId, userId, studentStandardId, roleModuleId, moduleId, showWarning) {
    if ($('#' + keyId).val() == 1) {
        var html = permissionForAprovalModal(src, keyId, userId, studentStandardId, roleModuleId, moduleId, showWarning);
        $('body').append(html);
        $('#permissionModal').modal({ backdrop: 'static', keyboard: false });
    } else {
        applyChanges(src, keyId, userId, studentStandardId, roleModuleId, moduleId, showWarning)
    }
}
function hidePermissionAndApprovalModal(eleID, callFrom) {
    $('#permissionModal').modal('hide');
    window.setTimeout(function () { $('#permissionModal').remove(); }, 1000);
    if (callFrom == "cancel") {
        var value = PROFILE_RESPONSE_DATA.profileData.studentProfile[5][eleID] == "N" ? "0" : "1"
        $("#" + eleID).val(value).trigger("change");
        $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
    } else {
        $("#" + eleID).closest(".input-group").find(".input-group-append-hide").css({ "display": "none" });
    }

}


function checkJoinedSports(data) {
    if (data.joinedSportsAndECList.length > 0) {
        $("#eventTableListWrapper, #participateEventFormWrapper").show();
        $("#participateActivities").prop("checked", true);
    }
    else {
        $("#eventTableListWrapper, #participateEventFormWrapper").hide();
        $("#participateActivities").prop("checked", false);
    }
}


// var loadContentFlag = 0;
// function communicationLog(){
//     if(loadContentFlag  == 0){
//         $("#communicationLogDIV").append(getCommunicationLogContent());
//         initEditor(1, 'commentEditor','Enter comments', false);
//         // bindFileUploadNew1('1', '33',USER_ID,6);
// 		$("#fileuploadLog6").on("change",function(){
// 			var attachment = $("#fileuploadLog6").val().split("\\")[2]
// 			$("#fileuploadLog6Span").text(attachment);
// 		});
//         loadContentFlag=1;
// 		callProfileEnrollStatusList('communicationLogForm','RE-EN','reLeadStatus', false);
// 		// $('#communicationLogForm #reLeadStatus').select2({
// 		// 	theme:'bootstrap4',
// 		// })
//     }
//     getCommunicationLogData('communicationLogTable',USER_ID,USER_ROLE);
// }

function getCommunicationLogData(elementId, userId, role) {
    customLoader(true);
    var data = {};
    data['userId'] = userId;
    data['role'] = role;
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: CONTEXT_PATH + UNIQUEUUID + "/api/v1/dashboard/get-user-communication-log",
        data: JSON.stringify(data),
        dataType: 'json',
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                var isDataTable = $.fn.dataTable.isDataTable('#' + elementId);
                if (isDataTable) {
                    $('#' + elementId).dataTable().fnDestroy();
                }
                $('#' + elementId + ' > tbody').html(getAddCommunicationLogTablebody(data));
                $('#' + elementId).DataTable({
                    "drawCallback": function (settings) {
                        $('#' + elementId + ' tbody tr td:first-child').addClass('dtr-control');
                    }
                });
            }
            customLoader(false);
            return false;
        }
    });
}

function getRequestForCommunicationLog(formId) {
    var commonCommentsRequest = {};
    var authentication = {};
    var commonCommentsDTO = {};
    var documentUploads = STUDENT_UPLOAD_DOCUMENTS;
    commonCommentsDTO['entityId'] = PROFILE_RESPONSE_DATA.userId;
    if (USER_ROLE == 'TEACHER') {
        commonCommentsDTO['entityName'] = 'TEACHER';
    } else {
        commonCommentsDTO['entityName'] = 'STUDENT';
    }
    commonCommentsDTO['title'] = $("#" + formId + " #logTitle").val();
    commonCommentsDTO['status'] = $("#" + formId + " #reLeadStatus").val();

    if ($("#" + formId + " #fileuploadLog6Span").text() == 'No file chosen...') {
        commonCommentsDTO['uploadFile'] = '';
        documentUploads = STUDENT_UPLOAD_DOCUMENTS = [];
    } else {
        commonCommentsDTO['uploadFile'] = $("#" + formId + " #fileuploadLog6Span").text();
    }
    if (editor1 != undefined) {
        commonCommentsDTO['comments'] = escapeCharacters(editor1.getData());
    }
    commonCommentsDTO['documentUploads'] = documentUploads;
    commonCommentsRequest['commonCommentsDTO'] = commonCommentsDTO

    authentication['hash'] = getHash(); authentication['schoolId'] = SCHOOL_ID; authentication['schoolUUID'] = SCHOOL_UUID;
    authentication['userType'] = moduleId;
    authentication['userId'] = USER_ID;
    commonCommentsRequest['authentication'] = authentication;
    return commonCommentsRequest;
}

function saveCommunicationLog(formId) {
    hideMessageTheme2('');
    if (editor1.getData() == null || editor1.getData() == '' || editor1.getData() == 'undefined') {
        showMessageTheme2(0, "Comments mandatory", '', true);
        return false;
    }
    if (editor1.getData().length > 2999) {
        showMessageTheme2(0, "Comments can not be more than 3000 characters.", '', true);
        return false;
    }
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLFor('dashboard', 'save-user-communication-log'),
        data: JSON.stringify(getRequestForCommunicationLog(formId)),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {

            if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
                if (data['status'] == '3') {
                    redirectLoginPage();
                } else {
                    if (tt == 'theme1') {
                        showMessage(false, data['message']);
                    } else {
                        showMessageTheme2(0, data['message'], '', true);
                    }
                }
            } else {
                showMessageTheme2(1, data['message'], '', true);
                $('#' + formId)[0].reset();
                $('#' + formId + ' #fileuploadLog6').val('');
                $('#' + formId + " #fileuploadLog6Span").text("No file chosen...");
                initEditor(1, 'commentEditor', 'Enter comments', true);
                getCommunicationLogData('communicationLogTable', PROFILE_RESPONSE_DATA.userId, PROFILE_RESPONSE_DATA.userRole);
            }

            return false;
        }
    });
}

function callProfileEnrollStatusList(formId, value, elementId, keyStatus) {
    hideMessageTheme2('');
    $.ajax({
        type: "POST",
        contentType: APPLICATION_JSON_VALUE,
        url: getURLForCommon('masters'),
        data: JSON.stringify(getRequestForMaster(formId, 'LEAD-STATUS-LIST', value)),
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            if (data['status'] == '0' || data['status'] == '2') {
                showMessageTheme2(true, data['message']);
            } else {
                result = data['mastersData']['data'];
                dropdown = $("#" + formId + " #" + elementId);
                dropdown.html('');
                dropdown.append('<option value="0">Select Status</option>');
                $.each(result, function (k, v) {
                    if (keyStatus) {
                        dropdown.append('<option value="' + v.key + '">' + v.value + '</option>');
                    } else {
                        dropdown.append('<option value="' + v.value + '">' + v.value + '</option>');
                    }
                });
            }
        }
    });
}

function overWriteProfileData(eleID, keyId) {

    if (keyId != "hobbies" && keyId != "socialMedia" && keyId != "extracurricular") {
        if (keyId == "preferredcommunication") {
            var communicationArry = []
            $(".communication-wrapper input[type='checkbox']").each(function () {
                if ($(this).prop("checked")) {
                    var label = $(this).attr("data-communication-label");
                    communicationArry.push({ [label]: "Y" });
                } else {
                    var label = $(this).attr("data-communication-label");
                    communicationArry.push({ [label]: "N" });
                }
            });
            $.each(communicationArry, function (i, v) {
                var key = Object.keys(v);
                PROFILE_RESPONSE_UPDATED_DATA[1][key] = v[key]
            });
            $("#saveCommunicationWrapper").hide();
        } else if (keyId == "communicationPreferredSlots") {
            PROFILE_RESPONSE_UPDATED_DATA = updateStudentData(PROFILE_RESPONSE_UPDATED_DATA, { callingPreferenceToKeep: getCallingPreference(), }, "communicationPreferredSlots");
        }
        else {
            if (keyId == "countrySectionParent" || keyId == "countrySection") {
                var elements_ID = [];
                elements_ID = $("#" + eleID).attr("data-country").split("_");
                $.each(elements_ID, function (i, v) {
                    PROFILE_RESPONSE_UPDATED_DATA = updateValueByKey(PROFILE_RESPONSE_UPDATED_DATA, v, parseInt($("#" + v).val()));
                })
            } else if (keyId == "bookASeatNextGradeOpted" || keyId == "advanceGradeOpted" || keyId == "reserveASeat") {
                var value = $("#" + keyId).val() == '0' ? 'N' : 'Y';
                PROFILE_RESPONSE_UPDATED_DATA = updateValueByKey(PROFILE_RESPONSE_UPDATED_DATA, keyId, value);
            }
            else {
                if (keyId == "timezone" || keyId == "nationality") {
                    PROFILE_RESPONSE_UPDATED_DATA = updateValueByKey(PROFILE_RESPONSE_UPDATED_DATA, keyId, parseInt($("#" + keyId).val()));
                }
                else if (keyId == 'phoneNumber' || keyId == 'altPhoneNumber' || keyId == 'motherPhoneNumber' || keyId == 'fatherPhoneNumber' || keyId == 'guardianPhoneNumber' || keyId == 'payPalPhoneNumber') {
                    var keyList = $("#" + keyId).attr("data-idList").split("_");

                    var phoneUpdateObj = {
                        [keyList[0]]: $("#" + eleID).val().replace(/\s+/g, ''),
                        [keyList[1]]: $('#' + keyList[1]).prop('checked') ? 'Y' : 'N',
                        [keyList[2]]: $('#' + eleID).attr('data-countrycode'),
                        [keyList[3]]: $('#' + keyList[3]).prop('checked') ? 'Y' : 'N'
                    };
                    // console.log(phoneUpdateObj);
                    Object.keys(phoneUpdateObj).forEach(function (key) {
                        PROFILE_RESPONSE_UPDATED_DATA = updateValueByKey(
                            PROFILE_RESPONSE_UPDATED_DATA,
                            key,
                            phoneUpdateObj[key]
                        );
                    });



                    // $.each(phoneUpdateObj,function(i,v){
                    //     var key = Object.keys(v);
                    //     PROFILE_RESPONSE_UPDATED_DATA = updateValueByKey(PROFILE_RESPONSE_UPDATED_DATA, keyList[i],v[key]);
                    // });
                } else {
                    PROFILE_RESPONSE_UPDATED_DATA = updateValueByKey(PROFILE_RESPONSE_UPDATED_DATA, keyId, $("#" + keyId).val());
                }
                // console.log("updated",PROFILE_RESPONSE_UPDATED_DATA);
            }
        }
    } else if (keyId == "hobbies") {
        var hobbieLable = [];
        $(".hobbie-wrapper input[type='checkbox']:checked").each(function () {
            hobbieLable.push($(this).attr("data-hobbie-label"))
        });
        PROFILE_RESPONSE_UPDATED_DATA = updateStudentData(PROFILE_RESPONSE_UPDATED_DATA, {
            hobbiesToKeep: hobbieLable,
        }, 'hobbies');
    } else if (keyId == "socialMedia") {
        var label = $("[for='" + eleID + "']").attr("data-title");
        var socialMediaUpdatesObj = { [label]: $("[id='" + eleID + "']").val() }
        PROFILE_RESPONSE_UPDATED_DATA = updateStudentData(PROFILE_RESPONSE_UPDATED_DATA, { socialMediaUpdates: socialMediaUpdatesObj, });
    } else if (keyId == "extracurricular") {
        var sportsToKeepLable = [];
        $(".sports-extra-curriculars-wrapper input[type='checkbox']:checked").each(function () {
            sportsToKeepLable.push($(this).attr("data-title"))
        });
        PROFILE_RESPONSE_UPDATED_DATA = updateStudentData(PROFILE_RESPONSE_UPDATED_DATA, { sportsToKeep: sportsToKeepLable, }, "extracurricular");
    }

}


function updateValueByKey(data, keyToUpdate, newValue) {
    if (Array.isArray(data)) {
        return data.map(item => updateValueByKey(item, keyToUpdate, newValue));
    } else if (typeof data === 'object' && data !== null) {
        var updatedObj = {};
        for (var key in data) {
            if (key === keyToUpdate) {
                updatedObj[key] = newValue;
            } else {
                updatedObj[key] = updateValueByKey(data[key], keyToUpdate, newValue);
            }
        }
        if(keyToUpdate == "advanceGradeOpted" && newValue == "Y"){
            data.bookASeatNextGradeOpted = "N";
            updatedObj["bookASeatNextGradeOpted"] = "N";
        }else if(keyToUpdate == "bookASeatNextGradeOpted" && newValue == "Y"){
            updatedObj["advanceGradeOpted"] = "N";
        }
        return updatedObj;
    }
    return data;
}

// function updateStudentData(data, {  hobbiesToKeep = [], socialMediaUpdates = {}, sportsToKeep = []} = {}) {

//   data[0].hobbies = data[0].hobbies.map(hobby => ({
//     ...hobby,
//     status: hobbiesToKeep.includes(hobby.hobbiesLabel) ? 'Y' : 'N'
//   }));

//   data[0].socialMedia = data[0].socialMedia.map(media => {
//     var label = media.socMedLabel;
//     var newUrl = socialMediaUpdates[label];

//     if (newUrl) {
//       var key = Object.keys(media).find(k => k.endsWith('_URL'));
//       return {
//         ...media,
//         [key]: newUrl
//       };
//     }

//     return media;
//   });

//   data[4].sportsAndECList = data[4].sportsAndECList.map(sport => ({
//     ...sport,
//     value: sportsToKeep.includes(sport.sEclabel) ? 'Y' : 'N',
//     assignActiveStudent: sportsToKeep.includes(sport.sEclabel) ? 'Y' : 'N'
//   }));

//   return data;
// }

function updateStudentData(data, options, callFrom) {

    options = options || {};
    var hobbiesToKeep = options.hobbiesToKeep || [];
    var socialMediaUpdates = options.socialMediaUpdates || {};
    var sportsToKeep = options.sportsToKeep || [];
    var callingPreferenceToKeep = options.callingPreferenceToKeep || [];

    /* ---------- HOBBIES ---------- */
    if (data[0].hobbies && callFrom == "hobbies") {
        for (var i = 0; i < data[0].hobbies.length; i++) {
            var hobby = data[0].hobbies[i];
            hobby.status = hobbiesToKeep.indexOf(hobby.hobbiesLabel) !== -1 ? 'Y' : 'N';
            data[0].hobbies[i].status = hobby.status;
        }
    }
    if (data[1].callingTimePrefArray && callFrom == "communicationPreferredSlots") {
        data[1].callingTimePrefArray.length = 0;
        data[1].callingTimePrefArray = callingPreferenceToKeep;
    }

    /* ---------- SOCIAL MEDIA ---------- */
    if (data[0].socialMedia && Object.keys(socialMediaUpdates).length) {

        for (var label in socialMediaUpdates) {
            if (!socialMediaUpdates.hasOwnProperty(label)) continue;

            var url = socialMediaUpdates[label];
            var found = false;

            for (var j = 0; j < data[0].socialMedia.length; j++) {
                var media = data[0].socialMedia[j];

                if (media.socMedLabel === label) {
                    // UPDATE existing
                    for (var key in media) {
                        if (key.indexOf('_URL') !== -1) {
                            media[key] = url;
                            break;
                        }
                    }
                    found = true;
                    break;
                }
            }

            if (!found) {
                // ADD new social media
                var newMedia = {
                    socMedLabel: label,
                    socialMediaMasterId: "0"
                };
                newMedia[label + "_URL"] = url;

                data[0].socialMedia.push(newMedia);
            }
        }
    }

    /* ---------- SPORTS ---------- */
    if (data[4].sportsAndECList && callFrom == "extracurricular") {
        for (var k = 0; k < data[4].sportsAndECList.length; k++) {
            var sport = data[4].sportsAndECList[k];
            var active = sportsToKeep.indexOf(sport.sEclabel) !== -1 ? 'Y' : 'N';
            sport.value = active;
            sport.assignActiveStudent = active;
        }
    }

    return data;
}





function filterScheduleProflieData(source, type) {
    source.forEach(section => {

        // GROUP SECTION CASE
        if (section.parentChildGroupList) {
            section.parentChildGroupList.forEach(group => {

                group.parentChildList = group.parentChildList.filter(
                item => type === "NOW"
                    ? item.scheduleType === "NOW"
                    : item.scheduleType !== "NOW"
                );

            });

            // empty groups हटाओ
            section.parentChildGroupList = section.parentChildGroupList.filter(
                group => group.parentChildList.length > 0
            );
        }

        // DIRECT SECTION CASE
        if (section.parentChildList) {
            section.parentChildList = section.parentChildList.filter(
                item => type === "NOW"
                ? item.scheduleType === "NOW"
                : item.scheduleType !== "NOW"
            );
        }

    });

    // REMOVE EMPTY SECTION
    var result = source.filter(section => {
        return (
            (section.parentChildList && section.parentChildList.length > 0) ||
            (section.parentChildGroupList && section.parentChildGroupList.length > 0)
        );
    });

    // 👉 agar kuch bhi nahi mila
    return result.length > 0 ? result : {};

}

function isFullNameFilled(data, fields) {
    return fields.every(f => {
        var val = data?.[f];
        return val !== "" && val !== null && val !== undefined;
    });
}
function isParentCountryFilled(data, fields) {
    return fields.some(f => {
        var val = data?.[f];
        return val !== 0 && val !== null && val !== undefined;
    });
}
function isParentFilled(data, fields) {
    return fields.some(f => {
        var val = data?.[f];
        return val !== "" && val !== null && val !== undefined;
    });
}

function checkAndOrganizeFields(objectA, objectB) {
    var currentTimeText = $("#currentTimeForUser").text();
    var nowTime = getMilliseconds(currentTimeText);
    var result = {};
    var socialMedia = ['InstagramURL', 'YouTubeURL', 'LinkedInURL', 'FacebookURL', 'TikTokURL', 'TelegramURL','TwitterURL'];
    var countryFields = ["motherCountry", "fatherCountry", "guardianCountry"];
    var DOBFields = ["motherDob", "fatherDob", "guardianDob"];
    var faceBookFields = ["motherFacebook", "fatherFacebook", "guardianFacebook"];
    var occupationFields = ["motherOccupation", "fatherOccupation", "guardianOccupation"];
    var emailFields = ["motherEmail", "fatherEmail", "guardianEmail"];
    var parentCommunication = ["pcWhatsappView", "pcCallView", "pcEmailView"];
    var phoneNumberFields = ['motherPhoneNumber','motherPhoneNumberWhatsAppStatus','motherPhoneEmergencyNumberStatus','fatherPhoneNumber','fatherPhoneNumberWhatsAppStatus','fatherPhoneEmergencyNumberStatus','guardianPhoneNumber','guardianPhoneNumberWhatsAppStatus','guardianEmergencyNumberStatus'];
    objectB = objectB.sort((a, b) => {
        return Number(a.index) - Number(b.index);
    });

    objectB.forEach(section => {

        var groupedFields = {};
        var groupsWithMissingFields = new Set();
        var sectionLabel = section.labelName;

        if (section.fieldId == "parentInformation") {
            var parentData = objectA?.studentProfile?.[parseInt(section.index)];
            var isMotherComplete = isFullNameFilled(parentData, ["motherName", "motherMiddleName", "motherLastName"]);
            var isFatherComplete = isFullNameFilled(parentData, ["fatherFirstName", "fatherMiddleName", "fatherLastName"]);
            var isGuardianComplete = isFullNameFilled(parentData, ["guardianFirstName", "guardianMiddleName", "guardianLastName"]);
            var isCountryComplete = isParentCountryFilled(parentData, countryFields);
            var isDOBComplete = isParentFilled(parentData, DOBFields);
            var isFaceBookComplete = isParentFilled(parentData, faceBookFields);
            var isOccupationComplete = isParentFilled(parentData, occupationFields);
            var emailIdComplete = isParentFilled(parentData, emailFields);
            var phoneNumberFieldsComplte = isParentFilled(parentData, phoneNumberFields);
            

            
            var skipAllNameFields = isMotherComplete || isFatherComplete || isGuardianComplete;
            var hasAnyCommunication = parentData?.pcCallView === "Y" || parentData?.pcEmailView === "Y" || parentData?.pcWhatsappView === "Y";

            if (section.parentChildGroupList && section.parentChildGroupList.length > 0) {

                // First pass
                section.parentChildGroupList.forEach(item => {
                    item.parentChildList.forEach(field => {

                        var groupId = item.groupName || field.groupId;
                        if(nowTime>=getMilliseconds(field.scheduleDateTime)){
                            var fieldValue = getFieldValue(objectA, field.fieldId, parseInt(section.index));
                            var isEmpty = fieldValue === '' || fieldValue === null || fieldValue === undefined;
                            if (countryFields.includes(field.fieldId)) {
                                if (isCountryComplete) return;
                                isEmpty = fieldValue == "0" || fieldValue === null || fieldValue === undefined;
                            }
                            if(hasAnyCommunication && groupId == "Other" && parentCommunication.includes(field.fieldId)){
                                return;
                            }
                            if(isEmpty) {
                                groupsWithMissingFields.add(groupId);
                            }
                        }
                    });
                });

                // Second pass
                section.parentChildGroupList.forEach(item => {
                    item.parentChildList.forEach(field => {

                        var groupId = item.groupName || field.groupId;
                        if(nowTime>=getMilliseconds(field.scheduleDateTime)){
                            if (groupsWithMissingFields.has(groupId)) {
                                var fieldValue = getFieldValue(objectA, field.fieldId, parseInt(section.index));
                                var isFieldEmpty = fieldValue === '' || fieldValue === null || fieldValue === undefined;
                                if (countryFields.includes(field.fieldId)) {
                                    isFieldEmpty = fieldValue == "0" || fieldValue === null || fieldValue === undefined;
                                }
                                if (field.fieldSource == "customField" && field.inputType == "file") {
                                    isFieldEmpty = (fieldValue === '' || fieldValue === null || fieldValue === undefined) &&
                                        (field.fieldValue === '' || field.fieldValue === null || field.fieldValue === undefined) &&
                                        (field.customFieldURL === '' || field.customFieldURL === null || field.customFieldURL === undefined) &&
                                        (field.fileName === '' || field.fileName === null || field.fileName === undefined);
                                }
                                if (!isFieldEmpty) return;
                                // ✅ ADD THIS CONDITION
                                if (skipAllNameFields) {
                                    var isNameField =
                                        field.fieldId.includes("Name") ||
                                        field.fieldId.includes("FirstName") ||
                                        field.fieldId.includes("MiddleName") ||
                                        field.fieldId.includes("LastName");

                                    if (isNameField) return; // ❌ skip push
                                }
                                if (countryFields.includes(field.fieldId)) {
                                    if (isCountryComplete) return;
                                }
                                if (DOBFields.includes(field.fieldId)) {
                                    if (isDOBComplete) return;
                                }
                                if (faceBookFields.includes(field.fieldId)) {
                                    if (isFaceBookComplete) return;
                                }
                                if (occupationFields.includes(field.fieldId)) {
                                    if (isOccupationComplete) return;
                                }
                                if (emailFields.includes(field.fieldId)) {
                                    if (emailIdComplete) return;
                                }
                                if (phoneNumberFields.includes(field.fieldId)) {
                                    if (phoneNumberFieldsComplte) return;
                                }
                                if(hasAnyCommunication && groupId == "Other" && parentCommunication.includes(field.fieldId)){ return;}
                                
                                if (!groupedFields[groupId]) {
                                    groupedFields[groupId] = [];
                                }
                                if (
                                    field.fieldId === 'motherPhoneNumber' ||
                                    field.fieldId === 'fatherPhoneNumber' ||
                                    field.fieldId === 'guardianPhoneNumber'
                                ) {
                                    groupedFields[groupId].push({
                                        fieldId: field.fieldId,
                                        orderId: field.orderId,
                                        groupId: groupId,
                                        elementType: "phoneNumber",
                                        labelName: field.labelName,
                                        value: fieldValue
                                    });
                                } else {
                                    if (field.fieldSource == "customField") {
                                        groupedFields[groupId].push({
                                            ...field,
                                            groupId: groupId,
                                            value: fieldValue,
                                            fieldValue: fieldValue
                                        });
                                    } else {
                                        groupedFields[groupId].push({
                                            fieldId: field.fieldId,
                                            orderId: field.orderId,
                                            groupId: groupId,
                                            labelName: field.labelName,
                                            value: fieldValue
                                        });
                                    }
                                }
                            }
                        }
                    });
                });

                if (Object.keys(groupedFields).length > 0) {
                    if (!result[sectionLabel]) {
                        result[sectionLabel] = {};
                    }
                    Object.assign(result[sectionLabel], groupedFields);
                }
            }

        } 
        else if (section.parentChildList && (section.parentChildList.length > 0 || (sectionLabel == "Live Classes Preferred Timing" && section.parentChildList.length < 1))) {

            // First pass
            section.parentChildList.forEach(field => {
                var groupId = field.groupId;
                if(nowTime>=getMilliseconds(field.scheduleDateTime)){
                    if (field.fieldId === 'hobbies') {
                        var hasAllActiveHobbies = checkAllActiveHobbies(objectA);
                        if (!hasAllActiveHobbies) {
                            groupsWithMissingFields.add(groupId);
                        }

                    } else if (socialMedia.includes(field.fieldId)) {
                        var value = getSocialMediaValue(objectA, field.fieldId);
                        if (!value) {
                            groupsWithMissingFields.add(groupId);
                        }
                    } else if (field.fieldId == "extracurricularActivities") {
                        var hasAllExtracurricularActivities = checkAllExtracurricularActivities(objectA, parseInt(section.index));
                        if (!hasAllExtracurricularActivities) {
                            groupsWithMissingFields.add(groupId);
                        }

                    } else if (field.fieldId === 'classes_Preferred_Timing_information') {
                        groupsWithMissingFields.add(groupId);

                    } else {
                        if(field.fieldId != "socialMedia"){
                            var fieldValue = getFieldValue(objectA, field.fieldId, parseInt(section.index));
                            var isEmpty = fieldValue === '' || fieldValue === null || fieldValue === undefined;
                            if (isEmpty) {
                                groupsWithMissingFields.add(groupId);
                            }
                        }
                    }
                }
            });

            // Second pass
            section.parentChildList.forEach(field => {

                var groupId = field.groupId;
                if(nowTime>=getMilliseconds(field.scheduleDateTime)){
                    if (groupsWithMissingFields.has(groupId)) {

                        if (!groupedFields[groupId]) {
                            groupedFields[groupId] = [];
                        }

                        if (field.fieldId === 'hobbies') {

                            groupedFields[groupId].push({
                                fieldId: field.fieldId,
                                orderId: field.orderId,
                                groupId: groupId,
                                labelName: field.labelName,
                                value: getHobbiesData(objectA)
                            });

                        } else if (socialMedia.includes(field.fieldId)) {
                            var value = getSocialMediaValue(objectA, field.fieldId);
                            // ❗ Only push if THIS specific field is empty
                            if (!value) {
                                groupedFields[groupId].push({
                                    fieldId: field.fieldId,
                                    orderId: field.orderId,
                                    groupId: groupId,
                                    labelName: field.labelName,
                                    value: value
                                });
                            }


                        } else if (field.fieldId === 'extracurricularActivities') {

                            groupedFields[groupId].push({
                                fieldId: field.fieldId,
                                orderId: field.orderId,
                                groupId: groupId,
                                labelName: field.labelName,
                                value: getExtracurricularActivitiesData(objectA, parseInt(section.index))
                            });

                        } else if (
                            field.fieldId === 'phoneNumber' ||
                            field.fieldId === 'altPhoneNumber' ||
                            field.fieldId === 'motherPhoneNumber' ||
                            field.fieldId === 'fatherPhoneNumber' ||
                            field.fieldId === 'guardianPhoneNumber'
                        ) {

                            groupedFields[groupId].push({
                                fieldId: field.fieldId,
                                orderId: field.orderId,
                                groupId: groupId,
                                elementType: "phoneNumber",
                                labelName: field.labelName,
                                value: getFieldValue(objectA, field.fieldId, parseInt(section.index))
                            });

                        } else if (field.fieldId === 'classes_Preferred_Timing_information') {

                            groupedFields[groupId].push({
                                fieldId: field.fieldId,
                                orderId: field.orderId,
                                groupId: groupId,
                                labelName: field.labelName,
                                value: objectA?.studentProfile?.[field.index]?.prefTimeList
                            });

                        } else {
                            if(field.fieldId != "socialMedia"){
                                if(field.fieldSource == "customField"){
                                    var customFieldValue = getFieldValue(objectA, field.fieldId, parseInt(section.index));
                                    var customFieldEmpty = customFieldValue === '' || customFieldValue === null || customFieldValue === undefined;
                                    if (customFieldEmpty) {
                                        groupedFields[groupId].push({
                                            ...field,
                                            value: customFieldValue,
                                            fieldValue: customFieldValue
                                        });
                                    }
                                }
                                else{
                                    groupedFields[groupId].push({
                                        fieldId: field.fieldId,
                                        orderId: field.orderId,
                                        groupId: groupId,
                                        labelName: field.labelName,
                                        value: getFieldValue(objectA, field.fieldId, parseInt(section.index))
                                    });
                                }
                            }
                        }
                    }
                }
            });

            if (Object.keys(groupedFields).length > 0) {
                if (!result[sectionLabel]) {
                    result[sectionLabel] = {};
                }
                Object.assign(result[sectionLabel], groupedFields);
            }
        }
    });

    // // Preferred Timing fallback
    // var prefTimeList = objectA?.studentProfile?.[3]?.prefTimeList;
    // if (!prefTimeList || prefTimeList.length === 0) {

    //     var sectionName = "Live Classes Preferred Timing";

    //     if (!result[sectionName]) {
    //         result[sectionName] = {};
    //     }

    //     result[sectionName]["0"] = [
    //         {
    //             fieldId: "prefTimeList",
    //             labelName: "Preferred Timing",
    //             value: prefTimeList || []
    //         }
    //     ];
    // }

    return result;
}


function getSocialMediaValue(objectA, fieldId) {
    var socialList = objectA?.studentProfile?.[0]?.socialMedia || [];

    var map = {
        "InstagramURL": "Instagram_URL",
        "YouTubeURL": "YouTube_URL",
        "LinkedInURL": "LinkedIn_URL",
        "FacebookURL": "Facebook_URL",
        "TikTokURL": "TikTok_URL",
        "TelegramURL": "Telegram_URL",
        "TwitterURL": "Twitter_URL"
    };

    var key = map[fieldId];

    var item = socialList.find(sm => sm[key] !== undefined);

    return item ? (item[key] || "").trim() : "";
}

// Helper function to get field value from nested objectA
function getFieldValue(objectA, fieldId, index) {
    var studentProfile = objectA.studentProfile[index];
    if (!studentProfile) {
        return "";
    }
    // Check personal information fields
    if (studentProfile.hasOwnProperty(fieldId)) {
        return studentProfile[fieldId];
    }

    // Check custom fields inside section object
    if (studentProfile.customFields && studentProfile.customFields.length > 0) {
        var customField = studentProfile.customFields.find(function (f) {
            return f && f.fieldId === fieldId;
        });
        if (customField) {
            return customField.fieldValue;
        }
    }

    // Check parent information fields (second object in studentProfile array)
    if (objectA.studentProfile[index] && objectA.studentProfile[index].hasOwnProperty(fieldId)) {
        return objectA.studentProfile[index][fieldId];
    }

    return "";
}

function getValue(id, index) {
    var obj = PROFILE_RESPONSE_UPDATED_DATA[index];

    if (!obj) return null;

    // 1. Direct property
    if (obj.hasOwnProperty(id)) {
        return obj[id];
    }

    // 2. customFields
    if (obj.customFields && obj.customFields.length > 0) {
        let field = obj.customFields.find(f => f.fieldId === id);
        return field ? field.fieldValue : "";
    }

    return "";

}

// Check if ALL hobbies have status "N" (all inactive)
function checkAllActiveHobbies(objectA) {
    var hobbies = objectA.studentProfile[0]?.hobbies || [];
    if (hobbies.length === 0) return false;
    return hobbies.some(hobby => hobby.status === "Y");
}



// Check if ANY social media has non-empty URL
function checkAnySocialMediaLink(objectA) {
    var socialMedia = objectA.studentProfile[0]?.socialMedia || [];
    return socialMedia.some(social => {
        // Check all URL fields that end with _URL
        var urlFields = Object.keys(social).filter(key => key.endsWith('_URL'));
        return urlFields.some(urlField => {
            var urlValue = social[urlField];
            return urlValue !== '' && urlValue !== null && urlValue !== undefined;
        });
    });
}

// Get hobbies data with status
function getHobbiesData(objectA) {
    return objectA.studentProfile[0]?.hobbies || [];
}

// Get social media data
function getSocialMediaData(objectA) {
    return objectA.studentProfile[0]?.socialMedia || [];
}

// Check if ALL extracurricular activities have status "N" (all inactive)
function checkAllExtracurricularActivities(objectA, index) {
    var extracurricularActivities = objectA.studentProfile[index]?.sportsAndECList || [];
    if (extracurricularActivities.length === 0) return false;
    return extracurricularActivities.some(hobby => hobby.assignActiveStudent === "Y");
}

// Get extracurricular activities data
function getExtracurricularActivitiesData(objectA, index) {
    return objectA.studentProfile[index]?.sportsAndECList || [];
}
var missingFields;
var inputPhoneNumberArray;
var previousSchoolElementArray;
var sportEventDatepickerFlag;
function getProfileModalHiddenFieldsHtml(data) {
    return `<input type="hidden" name="preferedTimeSavedByStudentCount" id="preferedTimeSavedByStudentCount" value="1">
        <input type="hidden" name="saveType" id="saveType" value="STUDENT_PROFILE">
        <input type="hidden" name="timeStuStandardId" id="timeStuStandardId" value="${data[2].studentStandardDTO[0].studentStandardId}"/>
        <input type="hidden" name="regstrationType" id="regstrationType" value="${data[2].learningProgramValue}"/>
        <input type="hidden" name="chooseDateSystemTrainingDate" id="chooseDateSystemTrainingDate" value="${data[2].academicYearStartDate}"/>`;
}

function getMissingFieldIdSet(missingFieldsData) {
    var fieldIdSet = {};
    if (!missingFieldsData) {
        return fieldIdSet;
    }
    $.each(missingFieldsData, function (_, groups) {
        $.each(groups, function (_, fields) {
            $.each(fields, function (_, fieldObj) {
                if (fieldObj && fieldObj.fieldId) {
                    fieldIdSet[fieldObj.fieldId] = true;
                }
            });
        });
    });
    return fieldIdSet;
}

function getMandatoryOptionByFieldId(scheduleData) {
    var mandatoryMap = {};
    if (!scheduleData || scheduleData.length < 1) {
        return mandatoryMap;
    }
    var addMandatory = function (item) {
        if (!item || !item.fieldId) {
            return;
        }
        // If any source marks the field mandatory, keep it mandatory.
        if (item.mandatoryOption === 'Y') {
            mandatoryMap[item.fieldId] = 'Y';
            return;
        }
        if (!mandatoryMap[item.fieldId]) {
            mandatoryMap[item.fieldId] = item.mandatoryOption || 'N';
        }
    };

    $.each(scheduleData, function (_, section) {
        if (section.parentChildList && section.parentChildList.length > 0) {
            $.each(section.parentChildList, function (_, item) {
                addMandatory(item);
            });
        }
        if (section.parentChildGroupList && section.parentChildGroupList.length > 0) {
            $.each(section.parentChildGroupList, function (_, group) {
                if (group.parentChildList && group.parentChildList.length > 0) {
                    $.each(group.parentChildList, function (_, item) {
                        addMandatory(item);
                    });
                }
            });
        }
    });
    return mandatoryMap;
}

function canCloseProfileModal(scheduleData, missingFieldsData) {
    if (!scheduleData || scheduleData.length < 1) {
        return true;
    }
    var fieldIdSet = getMissingFieldIdSet(missingFieldsData);
    var mandatoryMap = getMandatoryOptionByFieldId(scheduleData);
    var hasMandatoryField = false;

    $.each(fieldIdSet, function (fieldId) {
        if (mandatoryMap[fieldId] === 'Y') {
            hasMandatoryField = true;
            return false;
        }
    });

    // If even one field is mandatory, do not allow closing.
    return !hasMandatoryField;
}

function mergeMissingFieldsData(existingFields, incomingFields) {
    var merged = JSON.parse(JSON.stringify(existingFields || {}));
    if (!incomingFields) {
        return merged;
    }

    $.each(incomingFields, function (sectionName, groupsObj) {
        if (!merged[sectionName]) {
            merged[sectionName] = {};
        }
        $.each(groupsObj, function (groupKey, incomingList) {
            if (!merged[sectionName][groupKey]) {
                merged[sectionName][groupKey] = [];
            }
            var existingList = merged[sectionName][groupKey];
            $.each(incomingList || [], function (_, incomingField) {
                var exists = existingList.some(function (existingField) {
                    return existingField.fieldId === incomingField.fieldId;
                });
                if (!exists) {
                    existingList.push(incomingField);
                }
            });
        });
    });

    return merged;
}

function mergeScheduleSourceData(existingScheduleData, incomingScheduleData) {
    var merged = Array.isArray(existingScheduleData) ? JSON.parse(JSON.stringify(existingScheduleData)) : [];
    var incoming = Array.isArray(incomingScheduleData) ? incomingScheduleData : [];
    return merged.concat(JSON.parse(JSON.stringify(incoming)));
}

async function renderMissingFieldsModal(missingFieldsData, scheduleSourceData) {
    if (!missingFieldsData || Object.keys(missingFieldsData).length < 1) {
        return false;
    }
    var data = PROFILE_RESPONSE_DATA.profileData.studentProfile;
    var html = getProfileModalHiddenFieldsHtml(data) + await getMissingProfileFields(missingFieldsData, PROFILE_RESPONSE_DATA);
    var allowClose = canCloseProfileModal(scheduleSourceData, missingFieldsData);

    if ($("#profileFielddModal").length < 1) {
        $("body").append(getChunkProfileDataByUserModalContent());
    }
    $("#profileFielddModal .modal-body #requestProfileForm").html(html);
    if (!allowClose) {
        $("#profileFielddModal .modal-footer .btn-danger").hide();
    } else {
        $("#profileFielddModal .modal-footer .btn-danger").show();
    }
    $("#profileFielddModal").modal({
        backdrop: allowClose ? true : 'static',
        keyboard: allowClose
    });
    buindProfileElementEvent(previousSchoolElementArray);
    getInputIntel(inputPhoneNumberArray);
    $("#profileFielddModal").modal("show");
    
    return true;
}

function getProfileScheduleFieldList(scheduleData) {
    var scheduleFieldList = [];
    if (!scheduleData || scheduleData.length < 1) {
        return scheduleFieldList;
    }

    $.each(scheduleData, function (_, section) {
        if (section.parentChildList && section.parentChildList.length > 0) {
            scheduleFieldList = scheduleFieldList.concat(section.parentChildList);
        }
        if (section.parentChildGroupList && section.parentChildGroupList.length > 0) {
            $.each(section.parentChildGroupList, function (_, group) {
                if (group.parentChildList && group.parentChildList.length > 0) {
                    scheduleFieldList = scheduleFieldList.concat(group.parentChildList);
                }
            });
        }
    });
    return scheduleFieldList;
}

// function getCurrentUserTimeMillis() {
//     var currentTimeText = $("#currentTimeForUser").text();
//     var nowMoment = moment(currentTimeText, ['MMM DD, YYYY hh:mm:ss a', 'MMM D, YYYY hh:mm:ss a'], true);
//     var nowTime = nowMoment.isValid() ? nowMoment.valueOf() : moment.tz(USER_TIMEZONE).valueOf();
//     if (isNaN(nowTime)) {
//         nowTime = moment.tz(USER_TIMEZONE).valueOf();
//     }
//     return nowTime;
// }
function getMilliseconds(timeText) {
  return moment(timeText, "MMM DD, YYYY hh:mm:ss A").valueOf();
}

// function getScheduleUtcToUserTimeMillis(scheduleDateTime) {
//     if (!scheduleDateTime) {
//         return NaN;
//     }
//     var cleanedScheduleDateTime = (scheduleDateTime + "").trim().replace(/\s+/g, " ");

//     // Parse incoming schedule time strictly as UTC, then convert to user timezone.
//     var scheduleMomentUtc = moment.tz(cleanedScheduleDateTime,
//         [
//             DISPLAY_DATE_AND_TIME,
//             'MMM DD, YYYY hh:mm A',
//             DATETIME_UTC_FORMATTER,
//             DATE_UTC + 'T' + TIME_UTC,
//             DATE_UTC + ' ' + TIME_UTC
//         ],
//         true,
//         'UTC'
//     );

//     if (!scheduleMomentUtc.isValid()) {
//         return NaN;
//     }

//     return scheduleMomentUtc.clone().tz(USER_TIMEZONE).valueOf();
// }

function getDueProfileScheduleData() {
    PROFILE_SCHEDULE_DATA = getScheduleProfileData();
    if (!PROFILE_SCHEDULE_DATA || Object.keys(PROFILE_SCHEDULE_DATA).length < 1) {
        return [];
    }
    var currentTimeText = $("#currentTimeForUser").text();
    var nowTime = getMilliseconds(currentTimeText);
    if(Object.keys(PROFILE_SCHEDULE_DATA).length>0){
        var dueData = JSON.parse(JSON.stringify(PROFILE_SCHEDULE_DATA));
    }
    
    var hasDueField = false;

    var getScheduleItemKey = function (section, group, item) {
        var sectionKey = (section && (section.fieldId || section.labelName || section.index)) || "section";
        var groupKey = (group && (group.groupName || group.fieldId || group.labelName || group.index)) || "group";
        var fieldKey = (item && item.fieldId) || "field";
        var scheduleKey = (item && item.scheduleDateTime) || "time";
        return sectionKey + "|" + groupKey + "|" + fieldKey + "|" + scheduleKey;
    };

    var isItemDue = function (item) {
        if (!item || !item.scheduleDateTime) {
            return false;
        }
        // var scheduleDateTimeText = convertDatetimeWithFormat(moment.utc(item.scheduleDateTime,"MMM DD, YYYY hh:mm A").format(DATE_UTC+'T'+TIME_UTC+"[Z]"), "UTC", USER_TIMEZONE, DISPLAY_DATE_AND_TIME);;
        var scheduleTime = getMilliseconds(item.scheduleDateTime);
        return !isNaN(scheduleTime) && nowTime >= scheduleTime;
    };

    $.each(dueData, function (_, section) {
        if (section.parentChildList && section.parentChildList.length > 0) {
            section.parentChildList = section.parentChildList.filter(function (item) {
                var due = isItemDue(item);
                if (!due) {
                    return false;
                }
                var itemKey = getScheduleItemKey(section, null, item);
                if (PROFILE_SCHEDULE_PROCESSED_KEYS[itemKey]) {
                    return false;
                }
                hasDueField = true;
                return true;
            });
        }

        if (section.parentChildGroupList && section.parentChildGroupList.length > 0) {
            $.each(section.parentChildGroupList, function (_, group) {
                if (group.parentChildList && group.parentChildList.length > 0) {
                    group.parentChildList = group.parentChildList.filter(function (item) {
                        var due = isItemDue(item);
                        if (!due) {
                            return false;
                        }
                        var itemKey = getScheduleItemKey(section, group, item);
                        if (PROFILE_SCHEDULE_PROCESSED_KEYS[itemKey]) {
                            return false;
                        }
                        hasDueField = true;
                        return true;
                    });
                }
            });
            section.parentChildGroupList = section.parentChildGroupList.filter(function (group) {
                return group.parentChildList && group.parentChildList.length > 0;
            });
        }
    });

    dueData = dueData.filter(function (section) {
        return (section.parentChildList && section.parentChildList.length > 0) ||
            (section.parentChildGroupList && section.parentChildGroupList.length > 0);
    });
    return hasDueField ? dueData : [];
}

function markScheduleItemsProcessed(scheduleData) {
    if (!scheduleData || scheduleData.length < 1) {
        return;
    }

    var getScheduleItemKey = function (section, group, item) {
        var sectionKey = (section && (section.fieldId || section.labelName || section.index)) || "section";
        var groupKey = (group && (group.groupName || group.fieldId || group.labelName || group.index)) || "group";
        var fieldKey = (item && item.fieldId) || "field";
        var scheduleKey = (item && item.scheduleDateTime) || "time";
        return sectionKey + "|" + groupKey + "|" + fieldKey + "|" + scheduleKey;
    };

    $.each(scheduleData, function (_, section) {
        if (section.parentChildList && section.parentChildList.length > 0) {
            $.each(section.parentChildList, function (_, item) {
                PROFILE_SCHEDULE_PROCESSED_KEYS[getScheduleItemKey(section, null, item)] = true;
            });
        }
        if (section.parentChildGroupList && section.parentChildGroupList.length > 0) {
            $.each(section.parentChildGroupList, function (_, group) {
                if (group.parentChildList && group.parentChildList.length > 0) {
                    $.each(group.parentChildList, function (_, item) {
                        PROFILE_SCHEDULE_PROCESSED_KEYS[getScheduleItemKey(section, group, item)] = true;
                    });
                }
            });
        }
    });
}

function isScheduledProfileDataDue() {
    if (PROFILE_SCHEDULE_MODAL_SHOWN || !PROFILE_SCHEDULE_DATA || Object.keys(PROFILE_SCHEDULE_DATA).length < 1) {
        return false;
    }
    return getDueProfileScheduleData().length > 0;
}

function showScheduledMissingProfileFields() {
    if (!PROFILE_RESPONSE_UPDATED_DATA || !PROFILE_SCHEDULE_DATA || Object.keys(PROFILE_SCHEDULE_DATA).length < 1) {
        return false;
    }
    var dueScheduleData = getDueProfileScheduleData();
    if (!dueScheduleData || dueScheduleData.length < 1) {
        return false;
    }
    markScheduleItemsProcessed(dueScheduleData);
    var profileData = {
        studentProfile: PROFILE_RESPONSE_UPDATED_DATA
    };
    var missingScheduleFields = checkAndOrganizeFields(
        profileData,
        JSON.parse(JSON.stringify(dueScheduleData))
    );
    missingFields = mergeMissingFieldsData(missingFields, missingScheduleFields);
    CURRENT_MODAL_SCHEDULE_SOURCE = mergeScheduleSourceData(CURRENT_MODAL_SCHEDULE_SOURCE, dueScheduleData);
    return renderMissingFieldsModal(missingFields, CURRENT_MODAL_SCHEDULE_SOURCE);
}

function hasMissingProfileFields(missingFieldsData) {
    if (!missingFieldsData) {
        return false;
    }

    var hasMissing = false;
    $.each(missingFieldsData, function (_, groups) {
        if (hasMissing || !groups) {
            return;
        }
        $.each(groups, function (_, fields) {
            if (fields && fields.length > 0) {
                hasMissing = true;
                return false;
            }
        });
    });

    return hasMissing;
}

function filterMissingFieldsByScheduleSource(missingFieldsData, scheduleSourceData) {
    if (!missingFieldsData) {
        return {};
    }

    var scheduleFieldList = getProfileScheduleFieldList(scheduleSourceData);
    if (!scheduleFieldList || scheduleFieldList.length < 1) {
        return {};
    }

    var allowedFieldMap = {};
    $.each(scheduleFieldList, function (_, field) {
        if (field && field.fieldId) {
            allowedFieldMap[field.fieldId] = true;
        }
    });

    var filteredMissingFields = {};
    $.each(missingFieldsData, function (sectionName, groupsObj) {
        var filteredGroups = {};
        $.each(groupsObj || {}, function (groupKey, fieldsList) {
            var filteredFields = (fieldsList || []).filter(function (fieldObj) {
                return fieldObj && fieldObj.fieldId && allowedFieldMap[fieldObj.fieldId];
            });
            if (filteredFields.length > 0) {
                filteredGroups[groupKey] = filteredFields;
            }
        });

        if (Object.keys(filteredGroups).length > 0) {
            filteredMissingFields[sectionName] = filteredGroups;
        }
    });

    return filteredMissingFields;
}

async function refreshProfileMissingModalStateAfterBulkSave(missingFields) {
    if (!hasMissingProfileFields(missingFields)) {
        if ($("#profileFielddModal").hasClass("show")) {
            $("#profileFielddModal").modal("hide");
            setProfileDataCallFlag(true);
        }
    }else{
        return renderMissingFieldsModal(missingFields, CURRENT_MODAL_SCHEDULE_SOURCE);
    }

}

async function getMissingDataByUser(payload) {
    var show_Profile_Complete_Process = getSettingsByTypeAndKey('CONFIGURATION','SHOW_STUDENT_PRFOILE_COMPLETING_MODEL');
    var show_Profile_Complete_Process_Flag = JSON.parse(show_Profile_Complete_Process).data.metaValue
    if(show_Profile_Complete_Process_Flag == "Y"){
        if (MODAL_SHOW_FLAG) {
            $("body").append(cropperImageModalContent() + viewUploadFileModal());
            PROFILE_SCHEDULE_MODAL_SHOWN = false;
            PROFILE_SCHEDULE_PROCESSED_KEYS = {};
            var isApiCalled = getProfileDataCallFlag();
            var storedData = getAllProfileFieldsData();
            var storedMissing = getMissingFields();

            if (!storedData || !storedMissing || Object.keys(storedMissing).length < 1 && !isApiCalled) {
                // alert("Fresh Call")
                PROFILE_RESPONSE_DATA = await getDashboardDataBasedUrlAndPayload(true, true, `profile-view-content-new?payload=${payload}`, '');
                var data = PROFILE_RESPONSE_DATA.profileData.studentProfile;
                PROFILE_RESPONSE_UPDATED_DATA = data;
                
                GET_FILED_DATA = await getProfileCompletingProcess();
                GET_FILED_DATA = transformScheduleDates(GET_FILED_DATA.profileData);
                var nowData = JSON.parse(JSON.stringify(GET_FILED_DATA));
                var laterData = JSON.parse(JSON.stringify(GET_FILED_DATA));
                PROFILE_NOW_DATA = filterScheduleProflieData(nowData, "NOW");
                console.log("PROFILE_NOW_DATA", PROFILE_NOW_DATA)
                PROFILE_SCHEDULE_DATA = filterScheduleProflieData(laterData, "LATER");
                CURRENT_MODAL_SCHEDULE_SOURCE = JSON.parse(JSON.stringify(PROFILE_NOW_DATA || []));
                console.log("SCHEDULEL NOW STRUCTURE:", PROFILE_NOW_DATA);
                console.log("SCHEDULEL LATER STRUCTURE:", PROFILE_SCHEDULE_DATA);
                missingFields = {};
                missingFields = checkAndOrganizeFields(PROFILE_RESPONSE_DATA.profileData, GET_FILED_DATA);
                LOCAL_PROFILE_MISSING_FIELDS = missingFields;
                console.log("missingFields", missingFields);
                extractFields(missingFields)
                setAllProfileFieldsData(PROFILE_RESPONSE_DATA);
                setProfileMissingFields(missingFields);
                setNowProfileFieldsData(PROFILE_NOW_DATA);
                setScheduleProfileData(PROFILE_SCHEDULE_DATA);
                setProfileDataCallFlag(true);
                MISSING_PARENT_NAME_SECTION_FLAG = getProfileParentNameSaveFlag();
            }else{
                // alert("Local Data Called")
                LOCAL_PROFILE_MISSING_FIELDS = storedMissing;
                missingFields=LOCAL_PROFILE_MISSING_FIELDS
                PROFILE_RESPONSE_DATA = storedData;
                PROFILE_RESPONSE_UPDATED_DATA=storedData.profileData.studentProfile;
            }
            
            // if (PROFILE_NOW_DATA && PROFILE_NOW_DATA.length > 0) {
            if(Object.keys(LOCAL_PROFILE_MISSING_FIELDS).length>0){
                await renderMissingFieldsModal(LOCAL_PROFILE_MISSING_FIELDS, CURRENT_MODAL_SCHEDULE_SOURCE);
            }
        }
    }
}

// function extractFields(data, fields = ["fieldId"]) {
//   const expected = {
//     Mother: ["motherName", "motherMiddleName", "motherLastName"],
//     Father: ["fatherFirstName", "fatherMiddleName", "fatherLastName"],
//     Guardian: ["guardianFirstName", "guardianMiddleName", "guardianLastName"]
//   };

//   // ✅ Step 1: Sirf "Parent Information" hona chahiye
//   const keys = Object.keys(data);
//   if (keys.length !== 1 || !data["Parent Information"]) {
//     return null;
//   }

//   const parentInfo = data["Parent Information"];

//   // ✅ Step 2: Mother, Father, Guardian hi hone chahiye
//   const parentKeys = Object.keys(parentInfo);
//   if (
//     parentKeys.length !== 3 ||
//     !["Mother", "Father", "Guardian"].every(k => parentKeys.includes(k))
//   ) {
//     return null;
//   }

//   // ✅ Step 3: Har group ke andar exact fieldIds check karo
//   for (let group in expected) {
//     const arr = parentInfo[group];

//     if (!Array.isArray(arr) || arr.length !== 3) {
//       return null;
//     }

//     const fieldIds = arr.map(item => item.fieldId).sort();
//     const expectedIds = expected[group].sort();

//     if (JSON.stringify(fieldIds) !== JSON.stringify(expectedIds)) {
//       return null;
//     }
//   }

//   // ✅ Agar sab valid hai tab transform karo
//   return {
//     "Parent Information": Object.fromEntries(
//       Object.entries(parentInfo).map(([key, arr]) => [
//         key,
//         arr.map(item => {
//           let obj = {};
//           fields.forEach(f => {
//             if (item.hasOwnProperty(f)) {
//               obj[f] = item[f];
//             }
//           });
//           return obj;
//         })
//       ])
//     )
//   };
// }
function extractFields(data) {
  const expected = {
    Mother: ["motherName", "motherMiddleName", "motherLastName"],
    Father: ["fatherFirstName", "fatherMiddleName", "fatherLastName"],
    Guardian: ["guardianFirstName", "guardianMiddleName", "guardianLastName"]
  };

  // ✅ Step 1: Sirf "Parent Information" hona chahiye
  const keys = Object.keys(data);
  if (keys.length !== 1 || !data["Parent Information"]) {
        setProfileParentNameSaveFlag(false);
        return false;
  }

  const parentInfo = data["Parent Information"];

  // ✅ Step 2: Sirf Mother, Father, Guardian hone chahiye
  const parentKeys = Object.keys(parentInfo);
  if (
    parentKeys.length !== 3 ||
    !["Mother", "Father", "Guardian"].every(k => parentKeys.includes(k))
  ) {
        setProfileParentNameSaveFlag(false);
        return false;
  }

  // ✅ Step 3: Har group ke andar exact fieldIds check karo
  for (let group in expected) {
    const arr = parentInfo[group];

    if (!Array.isArray(arr) || arr.length !== 3) {
        setProfileParentNameSaveFlag(false);   
        return false;
    }

    const fieldIds = arr.map(item => item.fieldId).sort();
    const expectedIds = expected[group].slice().sort();

    if (JSON.stringify(fieldIds) !== JSON.stringify(expectedIds)) {
        setProfileParentNameSaveFlag(false);   
        return false;
    }
  }
  setProfileParentNameSaveFlag(true);  
  return true; // ✅ sab valid hai
}

function transformScheduleDates(data) {
    var toUserTimezoneScheduleText = function (scheduleDateTime) {
        if (!scheduleDateTime) {
            return scheduleDateTime;
        }
        var utcMoment = moment.utc(scheduleDateTime, "MMM DD, YYYY hh:mm A", true);
        if (!utcMoment.isValid()) {
            return scheduleDateTime;
        }
        return convertDatetimeWithFormat(
            utcMoment.format(DATE_UTC + 'T' + TIME_UTC + "[Z]"),
            "UTC",
            USER_TIMEZONE,
            DISPLAY_DATE_AND_TIME
        );
    };

    var normalizeAndConvertList = function (list) {
        var normalizedList = [];
        (list || []).forEach(function (item) {
            // API can send social media items wrapped as { socialMedia: [...] }.
            if (item && Array.isArray(item.socialMedia)) {
                item.socialMedia.forEach(function (socialItem) {
                    normalizedList.push({
                        ...socialItem,
                        scheduleDateTime: toUserTimezoneScheduleText(socialItem.scheduleDateTime)
                    });
                });
                return;
            }

            normalizedList.push({
                ...item,
                scheduleDateTime: toUserTimezoneScheduleText(item && item.scheduleDateTime)
            });
        });
        return normalizedList;
    };

    return (data || []).map(function (section) {
        var newSection = { ...section };

        if (newSection.parentChildList) {
            newSection.parentChildList = normalizeAndConvertList(newSection.parentChildList);
        }

        if (newSection.parentChildGroupList) {
            newSection.parentChildGroupList = newSection.parentChildGroupList.map(function (group) {
                return {
                    ...group,
                    parentChildList: normalizeAndConvertList(group.parentChildList)
                };
            });
        }

        return newSection;
    });
};

async function getMissingProfileFields(missingFields, PROFILE_RESPONSE_DATA){
    var fieldId;
    var fieldValue;
    previousSchoolElementArray = [];
    inputPhoneNumberArray = [];
    sportEventDatepickerFlag = false;
    var documentProof = true;
    var motherSection = true;
    var fatherSection = true;
    var guardianSection = true;
    var socialMediaLinkAdd = false;
    var documentProofElements = ['ageProof', 'addressProof', 'parentPassportProof', 'lastAcademicProof'];
    var socialMedia = ['InstagramURL', 'YouTubeURL', 'LinkedInURL', 'FacebookURL', 'TikTokURL', 'TelegramURL','TwitterURL'];
    var parentPhone = ['motherPhoneNumber','motherPhoneNumberWhatsAppStatus','motherPhoneEmergencyNumberStatus','fatherPhoneNumber','fatherPhoneNumberWhatsAppStatus','fatherPhoneEmergencyNumberStatus','guardianPhoneNumber','guardianPhoneNumberWhatsAppStatus','guardianEmergencyNumberStatus'];
    var html = '';
    $.each(missingFields, function (index, value) {
        // var keysList = Object.keys(missingFields);
        html +=
            `<div class="form-row mb-2">
                <div class="col-12 mb-2">${profileFormSectionTile(index)}</div>
            <hr/>
        `;
        $.each(value, function (key, val) {
            $.each(val, function (i, v) {
                var sectionTitle = index;
                if (sectionTitle)
                fieldId = v['fieldId'];
                fieldValue = v['value'];
                if (v && v.fieldSource === "customField" && typeof renderDynamicFieldByUserID === 'function') {
                    if(v.inputType == "date"){
                        previousSchoolElementArray.push(v.inputType);
                    }
                    var customFieldRenderIndex = typeof getProfileSectionRenderIndex === "function" ? getProfileSectionRenderIndex(sectionTitle) : 0;
                    html +=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${renderDynamicFieldByUserID(v, v.fieldValue || "", customFieldRenderIndex, "PROFILE_MODAL")}
                        </div>`;
                    return;
                }
                var motherSectionFlag = v.fieldId.startsWith("mother");
                var fatherSectionFlag = v.fieldId.startsWith("father");
                var guardianSectionFlag = v.fieldId.startsWith("guardian");
                if(fieldId != "extracurricularActivities" && (fieldId !== 'phoneNumber' && fieldId !== 'altPhoneNumber' && fieldId !== 'hobbies' && !socialMedia.includes(fieldId) && fieldId !== 'motherPhoneNumber' && fieldId !== 'fatherPhoneNumber' && fieldId !== 'guardianPhoneNumber' && fieldId !== "previousCurrentGradeName" && fieldId !== "previousCurrentSchoolGraduationYear" && fieldId !== "previousCurrentSchoolCountry" && fieldId != "prefTimeList" && !motherSectionFlag && !fatherSectionFlag && !guardianSectionFlag)){
                    if (typeof window[fieldId + 'Element'] === 'function') {
                        if(documentProof && documentProofElements.includes(fieldId)) {
                            html+=`${window['documentProofContent']()}`
                            documentProof=false;
                        }
                        if(fieldId == "weddingAnniversaryDate"){
                            previousSchoolElementArray.push(fieldId);
                        }
                        
                        html+=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12 ${documentProofElements.includes(fieldId) ? 'mb-3':''}">
                            ${window[fieldId + 'Element'](fieldValue)}
                        </div>`;
                        if(fieldId == "weddingAnniversaryDate"){
                            previousSchoolElementArray.push(fieldId)
                        }
                        
                    } else {
                        // console.warn([fieldId + 'Element'] + " not a function")
                    }
                    
                }else if (fieldId === "previousCurrentGradeName" || fieldId === "previousCurrentSchoolGraduationYear" || fieldId === "previousCurrentSchoolCountry") {
                    html +=
                        `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                        ${window[fieldId + 'Element'](fieldValue)}
                    </div>`;
                    previousSchoolElementArray.push(fieldId)
                } else if (fieldValue == "" && (fieldId === 'phoneNumber' || fieldId === 'altPhoneNumber')) {
                    html += `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                            ${window[fieldId + 'Element'](fieldValue)}
                        </div>`;
                    var fatherPhoneIndex = PROFILE_RESPONSE_UPDATED_DATA.findIndex(obj => obj.hasOwnProperty(fieldId));
                    inputPhoneNumberArray.push({ "fieldId": fieldId, "index": fatherPhoneIndex });

                } else if ((motherSectionFlag || fatherSectionFlag || guardianSectionFlag)) {
                    if(fieldId == "motherDob" || fieldId == "fatherDob" || fieldId == "guardianDob"){
                        previousSchoolElementArray.push(fieldId)
                    }
                    if(motherSectionFlag){
                        
                        if(motherSection){
                            html+=
                            `<div class="col-12 mother_section">
                                <h6 class="text-black font-weight-bold mb-2 mt-2">Mother's Detail</h6>
                            </div>`;
                            motherSection=false;
                        }
                        if(typeof window[fieldId + 'Element'] === 'function') {
                            html+=
                            `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                ${window[fieldId + 'Element'](parentPhone.includes(fieldId)?PROFILE_RESPONSE_DATA.profileData.studentProfile[1]:fieldValue)}
                            </div>`;
                        }
                        
                    }else if(fatherSectionFlag){
                        if(fatherSection){
                            html+=
                            `<div class="col-12 father_section">
                                <h6 class="text-black font-weight-bold mb-2 mt-2">Father's Detail</h6>
                            </div>`;
                            fatherSection=false;
                        }
                        if(typeof window[fieldId + 'Element'] === 'function') {
                            html+=
                            `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                ${window[fieldId + 'Element'](parentPhone.includes(fieldId)?PROFILE_RESPONSE_DATA.profileData.studentProfile[1]:fieldValue)}
                            </div>`;
                        }
                    }else if(guardianSectionFlag){
                        if(guardianSection){
                            html+=
                            `<div class="col-12 guardian_section">
                                <h6 class="text-black font-weight-bold mb-2 mt-2">Guardian's Detail</h6>
                            </div>`;
                            guardianSection=false;
                        }
                        if(typeof window[fieldId + 'Element'] === 'function') {
                            html+=
                            `<div class="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                                ${window[fieldId + 'Element'](parentPhone.includes(fieldId)?PROFILE_RESPONSE_DATA.profileData.studentProfile[1]:fieldValue)}
                            </div>`;
                        }
                    }
                    if(fieldId === 'motherPhoneNumber' || fieldId === 'fatherPhoneNumber' || fieldId === 'guardianPhoneNumber'){
                        var fatherPhoneIndex = PROFILE_RESPONSE_UPDATED_DATA.findIndex(obj => obj.hasOwnProperty(fieldId));
                        inputPhoneNumberArray.push({ "fieldId": fieldId, "index": fatherPhoneIndex });
                    }
                    if(fieldId == "motherCountry" || fieldId == "fatherCountry" || fieldId == "guardianCountry"){
                        previousSchoolElementArray.push(fieldId);
                    }
                }else if (fieldValue != "" && fieldId == "hobbies") {
                    html +=
                        `<div class="col-12">
                        ${window['hobbiesContent'](fieldValue)}
                    </div>`;
                }else if(fieldValue == "" && socialMedia.includes(fieldId)){
                    // var socialMediaData = PROFILE_RESPONSE_DATA.profileData.studentProfile[0].socialMedia.filter(function(item){
                    //     return item.socMedLabel == v.labelName;
                    // })
                    if(!socialMediaLinkAdd){
                        var socialMediaData = val.map(field => {
                            return PROFILE_RESPONSE_DATA.profileData.studentProfile[0].socialMedia.find(
                                item => item.socMedLabel === field.labelName
                            );
                        }).filter(Boolean);
                        html+=`<div class="col-12 mt-2">${window['socialMedaiLinksContent'](socialMediaData, false)}</div>`;
                        socialMediaLinkAdd=true;
                    }
                }
            });
        });
        if (fieldId === 'ageProof' || fieldId === 'addressProof' || fieldId === 'parentPassportProof' || fieldId === 'lastAcademicProof') {
            html +=
                `<div class="col-12 text-right mt-3">
                <a href="javascript:void(0)" class="btn btn-success btn-sm" id="saveAcademicInformationDocsBtn" onclick="saveDocs('${PROFILE_RESPONSE_DATA.userId}','${PROFILE_RESPONSE_DATA.studentStandardId}')">Save Documents</a>
            </div>`
        }
        if(fieldId == "prefTimeList"){
            previousSchoolElementArray.push('preferedStartTime','preferedEndTime');
            html +=`${classPreferredTimingInformationForm()}`
        }
        if (index == "Sport & Extra Curriculars") {
            var indexNum = PROFILE_RESPONSE_UPDATED_DATA.findIndex(obj => obj.hasOwnProperty('joinedSportsAndECList'));
            // if (PROFILE_RESPONSE_UPDATED_DATA[indexNum].joinedSportsAndECList.length < 3) {
            //     html +=
            //         `<div class="col-12">
            //         ${participateSportActivitiesElement(PROFILE_RESPONSE_UPDATED_DATA[indexNum], PROFILE_RESPONSE_DATA.studentStandardId, "requestProfileForm")}
            //     </div>`;
            //     sportEventDatepickerFlag = true;
            // }
            if (fieldValue != "" && fieldId == "extracurricularActivities") {
                html +=
                    `<div class="col-12">
                    ${window['extracurricularActivities' + 'Element'](fieldValue)}
                </div>`;
            }
        }
        html += `</div>`;
    });
    // console.log(html);
    return html;
}



function profileFormSectionTile(sectionName) {
    var titleMap = {
        "Personal Information": `<h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                <i class="fa fa-user font-12"></i>    
            </span>
            <span>Personal Information</span>
        </h5>`,

        "Parent Information": `<h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                <i class="fa fa-users font-12"></i>    
            </span>
            <span>Parent/Guardian Information</span>
        </h5>`,

        "Academic Information": `<h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                <i class="fa fa-graduation-cap font-12"></i>    
            </span>
            <span>Academic Information</span>
        </h5>`,
        "Live Classes Preferred Timing": `<h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                <i class="fa fa-graduation-cap font-12"></i>    
            </span>
            <span>Live Classes Preferred Timing</span>
        </h5>`,

        "Sport & Extra Curriculars": `<h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                <i class="fa fa-calendar font-12"></i>    
            </span>
            <span>Sport &amp; Extra Curriculars</span>
        </h5>`,
        "Student School Email Account": `<h5 class="text-dark font-weight-semi-bold d-flex align-items-center">
            <span class="bg-light-primary border border-primary text-primary d-inline-flex justify-content-center align-items-center mr-1 rounded" style="width:20px;height:20px">
                <i class="fa fa-envelope font-12"></i>    
            </span>
            <span>Student School Email Account</span>
        </h5>`
    };

    return titleMap[sectionName] || ""; // Return empty string if not found
}


function getInputIntel(InputIntelList) {
    if (InputIntelList.length > 0) {
        $.each(InputIntelList, function (i, v) {
            initializeIntelInput('requestProfileForm', `${v.fieldId}`, `iti${v.fieldId}`, '', 'selfSave', `${v.fieldId}WhatsAppStatus`, parseInt(v.index))
        });
    }
}
async function activateYourSchoolEmail() {
    var userId = (PROFILE_RESPONSE_DATA && PROFILE_RESPONSE_DATA.userId) || USER_ID;

    var payload = {
        userId: userId
    };

    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/create-azure-user",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };

    var responseData = await callCommonAjax(ajaxReqDetails);
    if (responseData && responseData.status == 1) {
        var details = responseData.details || {};
        var html = studentEmailInformation(details);
        $("#student_Email_Information").replaceWith(html);
        showMessageTheme2(1, responseData.message || "Student school user ID activated successfully.");
    } else {
        showMessageTheme2(0, responseData && responseData.message ? responseData.message : "Unable to activate school user ID.");
    }

    return false;
}

var CUSTOM_DATEPICKER_FIELD_FLAG=false;
function buindProfileElementEvent(buindProfileElementEvent) {
    if(buindProfileElementEvent.length > 0) {
        $.each(buindProfileElementEvent, async function (i, v) {
            if (v == "previousCurrentGradeName") {
                getAllGrade(SCHOOL_ID, true, v);
                $("#" + v).select2({
                    theme: "bootstrap4",
                    dropdownParent: "#profileFielddModal #requestProfileForm"
                });
            } else if (v == "previousCurrentSchoolGraduationYear") {
                var currentYear = new Date().getFullYear();
                $("#" + v).datepicker({
                    format: "yyyy",
                    viewMode: "years",
                    minViewMode: "years",
                    autoclose: true,
                    endDate: new Date(currentYear, 11, 31)
                });
            }else if(v == "motherDob" || v == "fatherDob" || v == "guardianDob" || v == "weddingAnniversaryDate"){
                $("#motherDob, #fatherDob, #guardianDob, #weddingAnniversaryDate, .custom-date-fields").datepicker({
                    format: 'M dd, yyyy',
                    autoclose: true,
                }).on('changeDate', function (e) {
                    // Fire `onchange="controlEditField(...)"` only for user selection
                    // (avoid triggering during initial `datepicker('update', ...)` on page load)
                    if (e && e.originalEvent) {
                        $(this).trigger('change');
                    }
                });
            }else if(v == "date" && !CUSTOM_DATEPICKER_FIELD_FLAG){
                $(".custom-date-fields").datepicker({
                    format: 'M dd, yyyy',
                    autoclose: true,
                }).on('changeDate', function (e) {
                    // Fire `onchange="controlEditField(...)"` only for user selection
                    // (avoid triggering during initial `datepicker('update', ...)` on page load)
                    if (e && e.originalEvent) {
                        $(this).trigger('change');
                    }
                });
                CUSTOM_DATEPICKER_FIELD_FLAG=true;
            }
            else if (v == "previousCurrentSchoolCountry" || v == "motherCountry" || v == "fatherCountry" || v == "guardianCountry") {
                await callCountriesOption("requestProfileForm", '', `${v}`, '', "Select Country*").then;
                $("#" + v).select2({
                    theme: "bootstrap4",
                    dropdownParent: "#profileFielddModal #requestProfileForm"
                });
            }else if(v == "preferedStartTime" || v == "preferedStartTime"){
                $("#" + v).select2({
                    theme: "bootstrap4",
                    dropdownParent: "#profileFielddModal #requestProfileForm"
                });
            }
            $('.select2-selection').addClass('form-select-sm group-append-hide-input');
        });
    }
    if (sportEventDatepickerFlag) {
        $("#eventStartDate").datepicker({
            format: 'M dd, yyyy',
            autoclose: true,
            startDate: new Date()
        }).on("change", function () {
            if ($(this).val() != "") {
                var startDate = new Date($(this).val());
                $("#eventEndDate").datepicker("remove");
                $('#eventEndDate').val('');
                $("#eventEndDate").datepicker({
                    startDate: startDate,
                    format: 'M dd, yyyy',
                    autoclose: true,
                });
            }
        });

        $("#eventEndDate").datepicker({
            format: 'M dd, yyyy',
            autoclose: true,
            startDate: new Date()
        });
    }
    checkJoinedSports(PROFILE_RESPONSE_UPDATED_DATA[4])
}

var getProfileDateInterVal = function () {
    // console.log("ACTIVITY_CLASS_START_TIME", ACTIVITY_CLASS_START_TIME);
    intervalId = setInterval(function () {
        var scheduleModalShown = showScheduledMissingProfileFields();
        if (scheduleModalShown) {
            PROFILE_SCHEDULE_MODAL_SHOWN = false;
        }
        if (ACTIVITY_CLASS_START_TIME.length > 0) {
            if (getFlag()) {
                if(missingFields != undefined){
                    if (!$('#profileFielddModal').hasClass("show") && Object.keys(missingFields).length>0) {
                        $("#profileFielddModal").modal("show");
                    }
                }
                var now = new Date().getTime();
                for (var v of ACTIVITY_CLASS_START_TIME) {
                    var start = new Date(v.startTime.replace(" ", "T")).getTime();
                    var end = new Date(v.endTime.replace(" ", "T")).getTime();
                    var timeDiff = start - now;
                    if (timeDiff <= 60000 && timeDiff > 0) {
                        if ($("#classAndActivityStartWarningModal").length > 0) {
                            $("#classAndActivityStartWarningModal").remove();
                        }
                        $("body").append(getClassAndActivityStartWarningModalContent());

                        if ($("#profileFielddModal").hasClass("show")) {
                            $("#classAndActivityStartWarningModal .modal-body").html(
                                `<h4>Your ${v.title} is about to start, would you like to continue filling details?</h4>`
                            );
                            $("#classAndActivityStartWarningModal").modal("show");
                        }
                        MODAL_SHOW_FLAG = false;
                        clearInterval(intervalId);
                        return;
                    }
                }
            }
        }
    }, 1000);
    return intervalId;
};

function getFlag() {
    // console.log("ACTIVITY_CLASS_START_TIME", ACTIVITY_CLASS_START_TIME);
    if (ACTIVITY_CLASS_START_TIME.length > 0) {
        var now = new Date().getTime();
        // Loop through all the time ranges
        for (var v of ACTIVITY_CLASS_START_TIME) {
            var start = new Date(v.startTime.replace(" ", "T")).getTime();
            var end = new Date(v.endTime.replace(" ", "T")).getTime();

            // Check if current time is within this range
            if (now >= start && now <= end) {
                // console.log("isBetween", v.startTime + " " + v.endTime);
                return false;  // If within range, return false immediately
            }
        }
    }
    return true;  // If no time ranges match, return true
}

function stopProfileDataInterval(modalID) {
    clearInterval(intervalId);
    $("#" + modalID).modal("hide");
}


function closeProfileModal() {
    $("#profileFielddModal, #classAndActivityStartWarningModal").modal("hide");
}


function setProfileMissingFields(data) {
    localStorage.setItem("localStorage_Profile_Missing_Fields", JSON.stringify(data));
}

function getMissingFields() {
    var data = localStorage.getItem("localStorage_Profile_Missing_Fields");
    return data ? JSON.parse(data) : {};
}
function setAllProfileFieldsData(data) {
    localStorage.setItem("ALL_PROFILE_DATA", JSON.stringify(data));
}

function getAllProfileFieldsData() {
    var data = localStorage.getItem("ALL_PROFILE_DATA");
    return data ? JSON.parse(data) : {};
}

function setProfileDataCallFlag(flag) {
    localStorage.setItem("IS_PROFILE_DATA_CALL", flag);
}

function getProfileDataCallFlag() {
    var data = localStorage.getItem("IS_PROFILE_DATA_CALL");
    return data ? JSON.parse(data) : false;
}

function setNowProfileFieldsData(data) {
    localStorage.setItem("PROFILE_NOW_DATA", JSON.stringify(data));
}

function getNowProfileFieldsData() {
    var data = localStorage.getItem("PROFILE_NOW_DATA");
    return data ? JSON.parse(data) : {};
}

function setScheduleProfileData(data) {
    localStorage.setItem("PROFILE_SCHEDULE_DATA", JSON.stringify(data));
}

function getScheduleProfileData() {
    var data = localStorage.getItem("PROFILE_SCHEDULE_DATA");
    return data ? JSON.parse(data) : {};
}
function setProfileParentNameSaveFlag(flag) {
    localStorage.setItem("MISSING_PARENT_NAME_SECTION_FLAG", flag);
}

function getProfileParentNameSaveFlag() {
    var data = localStorage.getItem("MISSING_PARENT_NAME_SECTION_FLAG");
    return data ? JSON.parse(data) : false;
}
