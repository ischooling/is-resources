function saveConfirmationGenerationDate(){
    if($("#generationDate").val() == null || $("#generationDate").val() == undefined || $("#generationDate").val() == ''){
        showMessageTheme2(0, 'Please select date','',true);
        return;
    }
    var data = {
        'generationDate': $("#generationDate").val(),
        'studentStandardId' : $("#studentStandardId").val(),
        'userId' : $("#userId").val(),
        'download' : false,
        'documentType' : 'COS'
    }
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: getURLForHTML('dashboard','save-confirmation-date'),
        data: JSON.stringify(data),
        // dataType: 'json',
        success: function (responce) {
            console.log(responce);
            if (responce['status'] == '0' || responce['status'] == '2' || responce['status'] == '3') {
                if(responce['status'] == '3'){
                    redirectLoginPage();
                }else{
                    if(tt=='theme1'){
                        showMessage(false, responce['message']);
                    }else{
                        showMessageTheme2(0, responce['message'],'',true);
                    }
                }
            } else {
                if(tt=='theme1'){
                    showMessage(true, responce['message']);
                }else{
                    showMessageTheme2(1, responce['message'],'',true);
                }
                
                $("#generationDate").datepicker("setDate", new Date(responce['date']))
                $("#textDate").html('Date : '+responce['date'])
            }
        }
    });
}
$(document).ready(function() {
	$("#textDate").show();
	$("#editDate").show();
	$("#saveDate").hide();
    $("#generationDate").hide()
}); 

function editButton(showElementId, hideElementId){
    $("#textDate").hide();
    $("#generationDate").show();
    $("#saveDate").show();
    $("#editDate").hide();
}

function saveButton(showElementId, hideElementId){
    saveConfirmationGenerationDate()
    $("#textDate").show();
	$("#editDate").show();
	$("#saveDate").hide();
    $("#generationDate").hide()
}