function feedbackFormGetState(){
    var container = $("#dashboardContentInHTML");
    var state = container.data("feedbackFormState");
    if(!state){
        state = { list: [], roleList: [], roleMap: {}, eventList: [] };
        container.data("feedbackFormState", state);
    }
    return state;
}

function feedbackFormSetState(nextState){
    $("#dashboardContentInHTML").data("feedbackFormState", nextState || { list: [], roleList: [], roleMap: {}, eventList: [] });
}

async function renderFeedbackFormPage(){
    $("#dashboardContentInHTML").html(getFeedbackFormPageContent());
    feedbackFormSetState({ list: [], roleList: [], roleMap: {}, eventList: [] });
    if($("#feedbackFormEditModal").length === 0){
        $("body").append(getFeedbackFormEditRightSlideModal());
    }
    await loadFeedbackFormPageData();
}


async function pullFeedbackFormData(){
    hideMessageTheme2('');
    try{
        customLoader(true);
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID + "/api/v1/review/pull-feedback-form-data-from-feedback-project",
            body: { schoolId: SCHOOL_ID },
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };
        var response = await callCommonAjax(ajaxReqDetails);
        var status = response ? (response.status + "") : "";
        if(response && (status === "1" || status.toUpperCase() === "SUCCESS")){
            showMessageTheme2(1, "Data pulled successfully");
            await loadFeedbackFormPageData();
        }else{
            showMessageTheme2(0, (response && response.message) || "Unable to pull data.");
        }
    }catch(e){
        showMessageTheme2(0, "Unable to pull data.");
    }finally{
        customLoader(false);
    }
}
async function loadFeedbackFormPageData(){
    try{
        customLoader(true);
        var state = feedbackFormGetState();
        state.roleList = await getAllUserRoles();
        state.roleMap = getFeedbackFormRoleMap(state.roleList);
        state.eventList = await getFeedbackEventNames();
        state.list = await getFeedbackFormList();

        feedbackFormSetState(state);
        bindFeedbackFormTable(state.list || []);
    }catch(e){
        $("#feedbackFormTableBody").html('<tr><td colspan="9" class="text-center text-danger">Unable to load feedback forms.</td></tr>');
    }finally{
        customLoader(false);
    }
}

async function getFeedbackFormList(){
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/api/v1/review/get-feedback-form-list",
        body: { schoolId: SCHOOL_ID },
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var response = await callCommonAjax(ajaxReqDetails);
    var status = response ? (response.status + "") : "";
    if(!response || (status !== "1" && status.toUpperCase() !== "SUCCESS")){
        throw new Error((response && response.message) || "Unable to load feedback forms");
    }
    return $.isArray(response.details) ? response.details : [];
}

async function getFeedbackEventNames(){
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/api/v1/review/get-feedback-event-name-list",
        body: { schoolId: SCHOOL_ID },
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var response = await callCommonAjax(ajaxReqDetails);
    return (response && $.isArray(response.details)) ? response.details : [];
}

function bindFeedbackFormTable(list){
    destroyFeedbackFormDataTable();
    var html = "";
    if(!list || list.length === 0){
        html = '<tr><td colspan="9" class="text-center text-muted">No feedback form found.</td></tr>';
        $("#feedbackFormTableBody").html(html);
        initFeedbackFormDataTable();
        return;
    }

    $.each(list, function(index, item){
        var statusHtml = item.active === "Y"
            ? '<span class="badge badge-success">Active</span>'
            : '<span class="badge badge-secondary">Inactive</span>';

        var viewTypeHtml = normalizeFeedbackViewType(item.feedbackViewType) === "side_navigation"
            ? '<span class="badge badge-info">Side Navigation</span>'
            : '<span class="badge badge-light border">Popup</span>';

        var roleText = feedbackFormEscapeHtml(item.roleIds || "N/A");
        var eventsText = feedbackFormEscapeHtml(item.mappedEvents || "N/A");
        var label = feedbackFormEscapeHtml(item.label || "N/A");
        var code = feedbackFormEscapeHtml(item.code || "N/A");
        var description = feedbackFormEscapeHtml(item.description || "N/A");
        var url = feedbackFormEscapeHtml(item.url || "N/A");

        html += `
        <tr>
            <td>${label}</td>
            <td>${code}</td>
            <td><a href="${url}" target="_blank" class="text-primary">${url}</a></td>
            <td>${description}</td>
            <td>${roleText}</td>
            <td>${eventsText}</td>
            <td>${viewTypeHtml}</td>
            <td>${statusHtml}</td>
            <td>
                <div class="d-flex flex-nowrap" style="gap:6px;">
                    <a href="javascript:void(0)" class="btn btn-primary btn-sm text-nowrap" onclick="openFeedbackFormEditModal('${feedbackFormEscapeSingleQuote(item.code || "") }')">
                        <i class="fa fa-pencil"></i> Edit
                    </a>
                    <a href="javascript:void(0)" class="btn btn-success btn-sm text-nowrap" onclick="viewFeedbackResponses('${item.vendorId}', '${feedbackFormEscapeHtml(item.feedbackResponseUrl || "")}', '${item.id}')">
                        <i class="fa fa-eye"></i> View Response
                    </a>
                </div>
            </td>
        </tr>`;
    });

    $("#feedbackFormTableBody").html(html);
    initFeedbackFormDataTable();
}
function destroyFeedbackFormDataTable(){
    if($.fn.DataTable.isDataTable("#feedbackFormTable")){
        $("#feedbackFormTable").DataTable().clear().destroy();
    }
}

function initFeedbackFormDataTable(){
    $("#feedbackFormTable").DataTable({
        pagingType: "full_numbers",
        pageLength: 10,
        order: []
    });
}

function viewFeedbackResponses(vendorId, dashboardUrl, feedbackFormId){
    // Validation
    if(!vendorId || !feedbackFormId) {
        showMessageTheme2(0, "Feedback dashboard configuration is missing.");
        return;
    }

    // Open the responses page through the feedback SSO entry so the dashboard loads
    // authenticated. Linking to the dashboard URL directly has no session and bounces
    // the user to the feedback login screen. The SSO entry mints a handoff token and
    // forwards to the responses page via the `redirect` target.
    var targetPath = "/" + vendorId + "/forms/" + feedbackFormId + "/responses";
    var ssoUrl = APP_BASE_URL + SCHOOL_UUID + "/dashboard/feedback-sso/" + UNIQUEUUID
        + "?redirect=" + encodeURIComponent(targetPath);

    // Open in new tab
    window.open(ssoUrl, '_blank');
}

function openFeedbackFormEditModal(feedbackCode){
    hideMessageTheme2('');
    var state = feedbackFormGetState();
    var selected = null;
    $.each(state.list || [], function(_, item){
        if((item.code || "") === feedbackCode){
            selected = item;
            return false;
        }
    });

    if(!selected){
        showMessageTheme2(0, "Feedback form not found.");
        return;
    }

    bindFeedbackRoleOptions(state.roleList || []);
    bindFeedbackEventOptions(state.eventList || []);

    $("#feedbackFormEditForm #feedbackId").val(selected.id || "");
    $("#feedbackFormEditForm #feedbackCode").val(selected.code || "");
    $("#feedbackFormEditForm #feedbackLabel").val(selected.label || "");
    $("#feedbackFormEditForm #formUrl").val(selected.url || "");
    $("#feedbackFormEditForm #shortDescription").val(selected.description || "");

    var selectedRoleIds = mapRoleNamesToIds(selected.roleIds || "");
    $("#feedbackFormEditForm #feedbackRoleIds").val(selectedRoleIds).trigger("change");

    var selectedEventIds = splitCsv(selected.mappedEventIds || "");
    $("#feedbackFormEditForm #feedbackEventNames").val(selectedEventIds).trigger("change");

    $("#feedbackFormEditForm #feedbackViewType").val(normalizeFeedbackViewType(selected.feedbackViewType));
    $("#feedbackFormEditForm #feedbackActiveStatus").val((selected.active || "Y").toString().toUpperCase());

    $("#feedbackFormEditModal .modal-header h4").text("Edit Feedback Form - (" + (selected.code || "N/A") + ")");
    $("#feedbackFormEditModal").modal("show");
}


// Canonical view types are "popup" and "side_navigation". Older/aliased values
// (module/inline/sidenav) are treated as side navigation; everything else as popup.
function normalizeFeedbackViewType(viewType){
    var normalized = $.trim((viewType || "").toString().toLowerCase());
    if(normalized === "side_navigation" || normalized === "side-navigation"
        || normalized === "sidenav" || normalized === "module" || normalized === "inline"){
        return "side_navigation";
    }
    return "popup";
}
function bindFeedbackRoleOptions(roleList){
    var html = "";
    $.each(roleList || [], function(_, role){
        html += `<option value="${feedbackFormEscapeHtml(role.id + "")}">${feedbackFormEscapeHtml(role.name || "")}</option>`;
    });
    var roleElement = $("#feedbackFormEditForm #feedbackRoleIds");
    roleElement.html(html);
    if(roleElement.hasClass("select2-hidden-accessible")){
        roleElement.select2("destroy");
    }
    roleElement.select2({
        theme: "bootstrap4",
        width: "100%",
        dropdownParent: $("#feedbackFormEditModal")
    });
}

function bindFeedbackEventOptions(eventList){
    var html = "";
    $.each(eventList || [], function(_, event){
        var eventId = event && event.id ? (event.id + "") : "";
        var eventName = feedbackFormEscapeHtml((event && event.eventName) || "");
        if(eventId && eventName){
            html += `<option value="${feedbackFormEscapeHtml(eventId)}">${eventName}</option>`;
        }
    });
    var eventElement = $("#feedbackFormEditForm #feedbackEventNames");
    eventElement.html(html);
    if(eventElement.hasClass("select2-hidden-accessible")){
        eventElement.select2("destroy");
    }
    eventElement.select2({
        theme: "bootstrap4",
        width: "100%",
        dropdownParent: $("#feedbackFormEditModal")
    });
}

function splitCsv(csv){
    var out = [];
    $.each((csv || "").split(","), function(_, value){
        var trimmed = $.trim(value);
        if(trimmed){ out.push(trimmed); }
    });
    return out;
}

function mapRoleNamesToIds(roleNamesCsv){
    var ids = [];
    var roleNames = (roleNamesCsv || "").split(",");
    $.each(roleNames, function(_, roleName){
        var key = $.trim((roleName || "").toUpperCase());
        var roleMap = feedbackFormGetState().roleMap || {};
        if(key && roleMap[key]){
            ids.push(roleMap[key]);
        }
    });
    return ids;
}

function getFeedbackFormRoleMap(roleList){
    var map = {};
    $.each(roleList || [], function(_, role){
        var name = $.trim((role.name || "").toUpperCase());
        if(name){
            map[name] = role.id + "";
        }
    });
    return map;
}

async function saveFeedbackFormIntegration(){
    hideMessageTheme2('');
    var payload = getFeedbackFormSavePayload();
    if(!payload.isValid){
        showMessageTheme2(0, payload.message);
        return;
    }

    try{
        customLoader(true);
        var ajaxReqDetails = {
            method: "POST",
            url: APP_BASE_URL + SCHOOL_UUID + "/api/v1/review/save-feedback-integration",
            body: payload.data,
            global: true,
            showMessage: false,
            onFaildResolved: true,
            onSuccessResolved: true
        };

        var response = await callCommonAjax(ajaxReqDetails);
        var saveStatus = response ? (response.status + "") : "";
        if(response && (saveStatus === "1" || saveStatus.toUpperCase() === "SUCCESS")){
            showMessageTheme2(1, response.message || "Feedback Role Mapping Saved Successfully");
            $("#feedbackFormEditModal").modal("hide");
            await loadFeedbackFormPageData();
        }else{
            showMessageTheme2(0, (response && response.message) || "Unable to save feedback form.");
        }
    }catch(e){
        showMessageTheme2(0, "Unable to save feedback form.");
    }finally{
        customLoader(false);
    }
}

function getFeedbackFormSavePayload(){
    var feedbackId = $.trim($("#feedbackFormEditForm #feedbackId").val());
    var feedbackCode = $.trim($("#feedbackFormEditForm #feedbackCode").val());
    var formUrl = $.trim($("#feedbackFormEditForm #formUrl").val());
    var shortDescription = $.trim($("#feedbackFormEditForm #shortDescription").val());
    var feedbackLabel = $.trim($("#feedbackFormEditForm #feedbackLabel").val());
    var roleIds = $("#feedbackFormEditForm #feedbackRoleIds").val() || [];
    var eventIds = $("#feedbackFormEditForm #feedbackEventNames").val() || [];
    var feedbackViewType = normalizeFeedbackViewType($("#feedbackFormEditForm #feedbackViewType").val());
    var activeStatus = $.trim($("#feedbackFormEditForm #feedbackActiveStatus").val()).toUpperCase();

    if(!feedbackCode){
        return {isValid:false, message:"Feedback code is required."};
    }
    if(!formUrl){
        return {isValid:false, message:"Form URL is required."};
    }
    if(!feedbackLabel){
        return {isValid:false, message:"Feedback label is required."};
    }
    if(roleIds.length === 0){
        return {isValid:false, message:"Please select at least one role."};
    }

    return {
        isValid: true,
        data: {
            id: (feedbackId !== "" && !isNaN(feedbackId)) ? parseInt(feedbackId, 10) : 0,
            feedbackCode: feedbackCode,
            formUrl: formUrl,
            shortDescription: shortDescription,
            feedbackLabel: feedbackLabel,
            feedbackViewType: feedbackViewType,
            active: activeStatus || "Y",
            roleIds: $.map(roleIds, function(v){ return parseInt(v, 10); }),
            eventIds: $.map(eventIds, function(v){ return parseInt(v, 10); }),
            schoolId: SCHOOL_ID
        }
    };
}

function feedbackFormEscapeHtml(value){
    return $("<div>").text(value == null ? "" : value).html();
}

function feedbackFormEscapeSingleQuote(value){
    return (value || "").toString().replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}


function feedbackFormUpsertLocalRow(saveData){
    var state = feedbackFormGetState();
    var id = saveData && saveData.id ? parseInt(saveData.id, 10) : 0;
    var idx = -1;

    $.each(state.list || [], function(i, row){
        var rowId = row && row.id ? parseInt(row.id, 10) : 0;
        if((id > 0 && rowId === id) || ((row.code || "") === (saveData.feedbackCode || ""))){
            idx = i;
            return false;
        }
    });

    var roleNameMap = {};
    $.each(state.roleList || [], function(_, role){
        roleNameMap[(role.id + "")] = role.name;
    });

    var roleNames = $.map(saveData.roleIds || [], function(roleId){
        return roleNameMap[roleId + ""] || roleId;
    }).join(",");

    var nextRow = {
        id: id,
        code: saveData.feedbackCode || "",
        label: saveData.feedbackLabel || "",
        url: saveData.formUrl || "",
        description: saveData.shortDescription || "",
        dayAfterDisplay: (saveData.displayAfterDays + ""),
        feedbackViewType: saveData.feedbackViewType || "popup",
        roleIds: roleNames,
        active: (saveData.active || "Y").toString().toUpperCase(),
        deleted: "N"
    };

    if(idx >= 0){
        state.list[idx] = $.extend({}, state.list[idx], nextRow);
    }else{
        state.list.unshift(nextRow);
    }

    feedbackFormSetState(state);
    bindFeedbackFormTable(state.list || []);
}
