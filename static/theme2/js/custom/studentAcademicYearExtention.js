async function renderStudentAcademicYearExtentionPage(){
    var apiResponse = await studentAcademicYearExtentionFetch();
    var pageData = studentAcademicYearExtentionBuildPageData(apiResponse);
    $("#dashboardContentInHTML").html(getStudentAcademicYearExtentionContent(pageData));
}

async function studentAcademicYearExtentionFetch(){
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/academic-year-extention",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    return await callCommonAjax(ajaxReqDetails);
}

function studentAcademicYearExtentionBuildPageData(apiResponse){
    var status = apiResponse && apiResponse.status != null ? (apiResponse.status + "") : "";
    var details = apiResponse && apiResponse.details ? apiResponse.details : {};
    var message = "";
    var courses = [];
    var showDetails = false;

    if(status === "0"){
        showDetails = true;
        message = details && details.message ? details.message : (apiResponse.message || "");
        courses = details && $.isArray(details.courses) ? details.courses : [];
    }else{
        message = apiResponse && apiResponse.message ? apiResponse.message : "No details found.";
    }

    return {
        status: status,
        message: message,
        courses: courses,
        showDetails: showDetails,
        moduleId: (typeof roleAndModule !== "undefined" && roleAndModule && roleAndModule.moduleId) ? roleAndModule.moduleId : 0
    };
}

var STUDENT_ACADEMIC_EXTENTION_PROCEED_DATA = {};

async function studentAcademicYearExtentionProceed(subjectId){
    if(!subjectId){
        return false;
    }
    var payload = { userId: USER_ID + "", studentUserId: USER_ID + "", subjectId: subjectId + "" };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + SCHOOL_UUID + "/dashboard/academic-year-extention-proceed",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var apiResponse = await callCommonAjax(ajaxReqDetails);
    var proceedData = studentAcademicYearExtentionBuildProceedData(apiResponse, subjectId);
    STUDENT_ACADEMIC_EXTENTION_PROCEED_DATA = proceedData;
    showAndHideDashboardAndAdditionalContent("additional");
    $("#dashboardContentInHTMLAdditional").html(getStudentAcademicYearExtentionProceedContent(proceedData));
    return false;
}

function studentAcademicYearExtentionBuildProceedData(apiResponse, subjectId){
    var details = apiResponse && apiResponse.details ? apiResponse.details : {};
    var subject = details.academicYearExtension || details.subjectCalculate || details.course || details.subject || details;

    var data = {
        subjectId: subject.subjectId || subjectId || "",
        subjectName: subject.subjectName || "N/A",
        imgURl: subject.imgURl || (subject.subjectIcon ? (PATH_FOLDER_IMAGE + "subjects/" + subject.subjectIcon) : (schoolSettingsLinks.logoUrl || "")),
        bgColor: subject.bgColor || "bg-primary",
        extentionAvailStatus: subject.extentionAvailStatus || "N",
        currentExtentionType: subject.currentExtentionType || "",
        extension2CanTakeStatus: subject.extension2CanTakeStatus || details.extension2CanTakeStatus || "YES",
        extension1Status: details.extension1Status || subject.extension1Status || "Yes",
        extensionCount: subject.extensionCount || 0,
        extentionCost: subject.extentionCost || "50",
        studentStandardId: subject.studentStandardId || "",
        message: apiResponse && apiResponse.message ? apiResponse.message : ""
    };

    data.showNotEligible = (data.extension2CanTakeStatus === "NO" || data.extension1Status === "No");
    data.notEligibleMessage = data.extension1Status === "No"
        ? ("You can opt for an extension for " + data.subjectName + " after the duration of your academic year is complete.")
        : ("You are not eligible to opt for an extension for " + data.subjectName + ".");
    data.showExtension1 = (!data.showNotEligible && data.extentionAvailStatus === "N" && data.currentExtentionType === "EXTENSION-1");
    data.showPaidExtension = (!data.showNotEligible && !data.showExtension1 && data.extentionAvailStatus === "N");
    return data;
}

function studentAcademicYearExtentionConfirmExtension1(){
    var message = "Are you sure you want to avail Extension-1?";
    if(typeof showWarningMessage === "function"){
        return showWarningMessage(message, " studentAcademicYearExtentionAvail('EXTENSION-1')");
    }
    if(confirm(message)){
        studentAcademicYearExtentionAvail('EXTENSION-1');
    }
    return false;
}

async function studentAcademicYearExtentionAvail(extentionType){
    hideMessage('');
    var ajaxReqDetails = {
        method: "POST",
        url: getURLForHTML('dashboard','academic-year-extention-avail'),
        body: studentAcademicYearExtentionGetAvailRequest(extentionType),
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    };
    var response = await callCommonAjax(ajaxReqDetails);
    var parsed = studentAcademicYearExtentionParseAvailResponse(response);

    if(parsed.isSessionOut){
        redirectLoginPage();
        return;
    }
    if(!parsed.success){
        showMessageTheme2(0, parsed.message || "Unable to avail extension.", '', false);
        return;
    }

    if(extentionType == 'EXTENSION-1'){
        showMessageTheme2(1, parsed.message || "Extension-1 availed successfully.", '', true);
        $('#availExtention1Div').hide();
        $('#availExtention1DescDiv').hide();
        $('#availExtention2After1DescDiv').show();
        $('#availExtention2After1Div').show();
        return;
    }

    var termsHtml = parsed.termsHtml || getStudentAcademicYearExtentionDefaultTermsHtml(parsed.userPaymentDetailsId);
    $("#bookSessionTermModal").html(termsHtml);
    $("#payTabBookingSessionModal").modal('show');
}

function studentAcademicYearExtentionGetAvailRequest(extentionType){
    return {
        studentStandardId: STUDENT_ACADEMIC_EXTENTION_PROCEED_DATA.studentStandardId || "",
        currentExtentionType: extentionType,
        subjectId: STUDENT_ACADEMIC_EXTENTION_PROCEED_DATA.subjectId || "",
        userId: USER_ID
    };
}

function studentAcademicYearExtentionParseAvailResponse(response){
    var result = {
        success: false,
        isSessionOut: false,
        message: "",
        termsHtml: "",
        userPaymentDetailsId: ""
    };

    if(response === undefined || response === null){
        result.message = "Empty response";
        return result;
    }

    if(typeof response === "string"){
        var trimmed = response.trim();
        if(trimmed.indexOf("|") > -1){
            var parts = trimmed.split("|");
            var statusToken = (parts[0] || "").toUpperCase();
            result.message = parts[1] || "";
            if(statusToken === "SESSIONOUT"){
                result.isSessionOut = true;
                return result;
            }
            if(statusToken === "FAILED" || statusToken === "EXCEPTION"){
                result.success = false;
                return result;
            }
            result.success = true;
            result.termsHtml = response;
            return result;
        }
        if(trimmed.startsWith("{") || trimmed.startsWith("[")){
            try{
                response = JSON.parse(trimmed);
            }catch(e){
                result.success = true;
                result.termsHtml = response;
                return result;
            }
        }else{
            result.success = true;
            result.termsHtml = response;
            return result;
        }
    }

    var status = response.status != null ? (response.status + "").toUpperCase() : "";
    var statusCode = response.statusCode != null ? (response.statusCode + "").toUpperCase() : "";
    var details = response.details || response.data || response.response || {};
    result.message = response.message || details.message || "";

    if(status === "SESSIONOUT" || statusCode === "SESSIONOUT"){
        result.isSessionOut = true;
        return result;
    }

    var isKnownFailure = (status === "FAILED" || status === "EXCEPTION" || statusCode === "E001" || statusCode === "FAILED");
    var isKnownSuccess = (statusCode === "1" || status === "1" || (status === "0" && statusCode === "1"));
    result.success = isKnownSuccess && !isKnownFailure;
    if(!result.success){
        return result;
    }

    result.termsHtml =
        details.termsHtml ||
        details.termConditionHtml ||
        details.termsAndConditionHtml ||
        details.htmlContent ||
        response.htmlContent ||
        "";
    result.userPaymentDetailsId =
        details.userPaymentDetailsId ||
        (details.userPaymentDetails && details.userPaymentDetails.id) ||
        response.userPaymentDetailsId ||
        "";
    return result;
}

function getStudentAcademicYearExtentionDefaultTermsHtml(userPaymentDetailsId){
    var supportEmail = (typeof schoolSettingsMails !== "undefined" && schoolSettingsMails && schoolSettingsMails.withdrawalRequestAdmin) ? schoolSettingsMails.withdrawalRequestAdmin : "";
    var safeSchoolName = (typeof SCHOOL_NAME !== "undefined" && SCHOOL_NAME) ? SCHOOL_NAME : "School";
    var payBtnDisabled = userPaymentDetailsId ? "" : "disabled='disabled'";
    var payNowOnclick = userPaymentDetailsId ? `checkPayment('bookSessionPaymentModal','${userPaymentDetailsId}','${SCHOOL_ID}');` : "";

    return `<p class="scroll-down" style="margin-top:5px;"><a href="#" class="animate"></a></p>
        <form id="bookSessionTerm" name="bookSession" method="post" autocomplete="off">
            <input type="hidden" id="userId" value="${USER_ID}" />
            <input type="hidden" id="paymentType" value="annually" />
            <div class="agree">
                <p><b>Please note the important fee refund policy and terms & conditions before extending academic year:</b></p>
                <ol class="pl-3" style="list-style-type:auto;">
                    <li class="mb-1">We recommend that you consult with the School Admin ${supportEmail ? `(email to: <a href="mailto:${supportEmail}">${supportEmail}</a>)` : ""} before opting for Paid Academic Year Extension.</li>
                    <li class="mb-1">Paid academic year extension can be availed for a period of a maximum of 4 weeks.</li>
                    <li class="mb-1">The school provides no other form of an academic year extension.</li>
                    <li class="mb-1">In case you are not able to complete this course even after availing paid extension for 4 weeks, no credit would be provided for this course, and it would be graded as Incomplete "(I)" in your annual transcript.</li>
                    <li class="mb-1">Under any circumstances/conditions, fee paid for Academic Year Extension is non-refundable, non-transferable and non-adjustable.</li>
                    <li class="mb-1">Students (or their parents/guardians) are responsible for regularly checking the website for any upcoming notifications. ${safeSchoolName} will not send notifications or updates separately to students (or their parents/guardians).</li>
                    <li class="mb-1">${safeSchoolName} reserves the right to amend, limit or revoke any offers or terms at any time prior to purchase and accepts no responsibility for any technical issues resulting in the failure to pay.</li>
                </ol>
                <div class="modal-footer" style="text-align:left;">
                    <div class="col-sm-12 col-12 d-flex pl-0" style="flex:1">
                        <input type="checkbox" id="chkvalBookSession" class="checkbox-lg" name="chkvalBook">
                        <label for="chkvalBookSession" style="position: relative;top: -0.5px;color: #333;cursor: pointer;" >&nbsp;I confirm that I have read and agree to the above-mentioned fee refund policy and terms & conditions.</label>
                    </div>
                    <button type="button" id="payBookingSessionTabData" class="btn btn-success" ${payBtnDisabled} onclick="${payNowOnclick}" style="float:right" disabled="disabled">Pay Now</button>
                </div>
            </div>
        </form>`;
}
