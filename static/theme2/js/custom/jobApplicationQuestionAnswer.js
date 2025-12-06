async function jobApplicationQAOnLoad(entityId, entityType, userName, lastAnsweringDate, appliedUserRole){
    $("body").html(await jobApplicationQAContent()+getLoaderContent()+showMessageTheme2Content());
    var payload = {};
    payload["entityId"] = entityId;
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "get-applicant-specific-questions",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        $("#jobApplicationQAWrapper").html(qaSectionContent(responseData.data, entityId, entityType, userName, lastAnsweringDate, appliedUserRole));
        if(responseData.data.some(item => item.answerText && item.answerText.trim() !== "")){
            $("#jobApplicationThankYouWrapper").html(qaThankYouContent("directThankyou"));
            $("#jobApplicationQAWrapper").hide();
            $("#jobApplicationThankYouWrapper").show();
        }
    }
}

async function submitAnswers(entityId, entityType) {
    var answers = [];
    var hasError = false;
    $("[id^='answer_']").each(function () {
        var qId = $(this).attr("id").split("_")[1];
        var answerText = $(this).val().trim();
        var required = $(this).closest(".card-body").find("h5 span.text-danger").length > 0;

        if (required && answerText === "") {
            $(this).addClass("is-invalid");
            hasError = true;
        } else {
            $(this).removeClass("is-invalid");
        }
        answers.push({
            id: Number(qId),
            answerText: answerText,
            answerType: "T"
        });
    });
    if (hasError) {
        showMessageTheme2(0, "Please fill all mandatory answers.");
        return;
    }

    var payload = {
        entityId: Number(entityId),
        entityType: entityType,
        answers: answers
    };
    var ajaxReqDetails = {
        method: "POST",
        url: APP_BASE_URL + "save-applicant-specific-answers",
        body: payload,
        global: true,
        showMessage: false,
        onFaildResolved: true,
        onSuccessResolved: true
    }
    var responseData = await callCommonAjax(ajaxReqDetails);
    if(responseData.status == 1){
        showMessageTheme2(1, responseData.message);
        setTimeout(() => {
            $("#jobApplicationQAWrapper").hide();
            $("#jobApplicationThankYouWrapper").show();
        }, 2000);
    }else{
        showMessageTheme2(0, responseData.message)
    }
}