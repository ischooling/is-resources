var cropperImageLeadDocs;
var currentInputId;
var currentThumbId;
var base64URLElementID;
var viewBtn;
var removeBtn;
var fileName='';
var fileType='';
var docType='';
var base64URL='';
var canvas;
var uploadDocs=[];

function addDocs(uploadDocs,fileObj){
    $.each(uploadDocs, function(index, value){
    if(value.docType == fileObj.docType){
        uploadDocs[index]=fileObj
    }
    });
}
function convertToBase64(inputId, type) {
    var file = document.querySelector('#'+inputId).files[0];
    var reader = new FileReader();
    reader.onload = function(event){
    base64URL = event.target.result;
    // console.log(base64URL);
    var fileName ;
    var ranNumber =Math.random();
    if (type === 'pdf'){
        ranNumber= ranNumber.toString().split(".")[1];
        fileName = 'abc'+ranNumber+"."+type;
    }else{
    ranNumber= ranNumber.toString().split(".")[1];
    fileName = 'file'+ranNumber+"."+type;
    }
    
    
    $("#"+inputId).parent().attr('data-PDFURL',base64URL);
    var fileObj = new Object({"filePath":base64URL,"fileName":fileName,"docType":docType,"imgID":currentThumbId});
    var found = uploadDocs.some(el => el.docType === fileObj.docType);
        if(!found){ 
        uploadDocs.push(fileObj);
        }
    addDocs(uploadDocs,fileObj)
    console.log(uploadDocs);
    };
    reader.readAsDataURL(file);
}


function cropImage(event, inputId, thumbId, type) {
    var fsize = $("#"+inputId)[0].files[0].size;
    var fileSize = Math.round((fsize / 1024));
    if(fileSize <= 5120){
    currentInputId = inputId;
    currentThumbId = thumbId;
    docType = type;
    var files = event.target.files;
    fileType = files[0].type.split("/");
    fileType = fileType[1];
    if(fileType == "pdf"){
        if(docType == "Profile Image"){
        showMessageTheme2(2, 'Please upload files in JPG, PNG, and JPEG with max size of 5MB');
        $("#"+inputId).val("");
        return false;
        }else{
        convertToBase64(inputId, "pdf");
        $('#' + currentThumbId).attr('src', PATH_FOLDER_IMAGE2+'pdf.jpg'+SCRIPT_VERSION);
        $('#' + currentThumbId).attr('thumbType', 'pdf');
        $('#' + currentInputId+'Remove').show();
        $('#' + currentInputId+'div').hide();
        }
        
    }else if(fileType == "jpg" || fileType == "jpeg" || fileType == "png"){
        var done = function(url) {
        currentInputId.value = '';
        $('#cropModalImg').attr('src', '');
        setTimeout(function() {
            $('#cropModalImg').attr('src', url);
            $('#adminImgCropModal').modal('show');
            if(docType == "Profile Image"){
            $("#crop").text("Crop & Save");
            }else{
            $("#crop").text("Crop");
            }
        }, 10);
        };
        var reader;
        var file;
        var url;
        if (files && files.length > 0) {
        file = files[0];
        var ranNumber =Math.random();
        ranNumber= ranNumber.toString().split(".")[1];
        fileName = 'file'+ranNumber+"."+fileType;

        if (URL) {
            done(URL.createObjectURL(file));
        } else if (FileReader) {
            reader = new FileReader();
            reader.onload = function(event) {
            done(reader.result);
            
            };
            reader.readAsDataURL(file);
        
        }
        }
        $("#"+inputId).val("");
        
    }else{
        $("#"+inputId).val("")
        showMessageTheme2(2, 'Please upload files in PDF, JPG, PNG, and JPEG Format');
    }
    }else{
    $("#"+inputId).val("")
    showMessageTheme2(2, 'Please upload files in PDF, JPG, PNG, and JPEG with max size of 5MB');
    }   
    
}

function corpAdminProfile(){
    $('#adminImgCropModal').on('shown.bs.modal', function () {
        cropper = new Cropper($('#cropModalImg')[0], {
            aspectRatio: NaN,
            // viewMode: 3,
        });
        }).on('hidden.bs.modal', function () {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        });
        $('#cropProfileImg').on('click', function() {
        customLoader(true);
        var initialAvatarURL;
        $('#adminImgCropModal').modal('hide');
        if (cropper){
            canvas = cropper.getCroppedCanvas({
            // width: 160,
            //height: 160,
            });
            initialAvatarURL = $('#' + currentThumbId).attr('src');
            
            $('#' + currentThumbId).attr('src', canvas.toDataURL());
            $('#' + currentThumbId).attr('thumbType', 'img');
            $('#' + currentInputId).parent().attr('data-PDFURL', canvas.toDataURL());
            $('#' + currentInputId).parent().attr('fileName', fileName);
            $('#' + currentInputId+'Remove').show();
            $('#' + currentInputId+'div').hide(); 
            var fileObj = new Object({"filePath":canvas.toDataURL(),"fileName":fileName,"docType":docType,"imgID":currentThumbId});
            var found = uploadDocs.some(el => el.docType === fileObj.docType);
            if(!found){ 
            uploadDocs.push(fileObj);
            }
            addDocs(uploadDocs,fileObj)
            
            if($("#"+currentInputId).parent().children().hasClass("file-select-name")){
            $("#"+currentInputId).parent().find(".file-select-name").text(fileObj.fileName)
            }
            console.log(uploadDocs);
            canvas.toBlob(function(blob) {
            var formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');
            });
            if(docType == "Profile Image"){
            saveProfileImage(USER_ID, docType)
            } 
            customLoader(false);
        }
    });
}

function editProfilePage(){
    var phoneNumber = document.querySelector("#phoneNumber");
    if (phoneNumber.intlTelInputInstance) {
        phoneNumber.intlTelInputInstance.destroy();
        phoneNumber.removeAttribute('data-intlTelInput-initialized');
    }
    itiPhoneNumber = window.intlTelInput(phoneNumber, {
        separateDialCode: true,
    });
    if($("#pCountryCode").val() == ""){
        $("#pCountryCode").val("IN") 
    }
    itiPhoneNumber.setCountry($("#pCountryCode").val());
    phoneNumber.addEventListener('countrychange', function(e) {
        $('#pCountryCode').val(itiPhoneNumber.getSelectedCountryData().iso2);
        $('#isdCode').val(itiPhoneNumber.getSelectedCountryData().dialCode);
    });
    phoneNumber.intlTelInputInstance = itiPhoneNumber;
    phoneNumber.setAttribute('data-intlTelInput-initialized', 'true');
    $(".admin-profile-wrapper .field-input, .admin-profile-wrapper .iti--separate-dial-code, .save-proifle-btn-row, .cancelEditProfileBtn").show();
    $(".field-value, .editProfileBtn").hide();
    $(".iti__country-list").css({"z-index":"10"});
}

function cancelEditProfilePage(){
    $(".admin-profile-wrapper .field-input, .admin-profile-wrapper .iti--separate-dial-code, .save-proifle-btn-row, .cancelEditProfileBtn").hide();
    $(".field-value, .editProfileBtn").show();
}

async function saveProfileDetails(formId) {
    if ($("#" + formId + " #userName").val() == null || $("#" + formId + " #userName").val() == undefined || $("#" + formId + " #userName").val() == '') {
        showMessageTheme2(0, "User name is required");
        return false;
    }
    if ($("#" + formId + " #gender").val() == null || $("#" + formId + " #gender").val() == undefined || $("#" + formId + " #gender").val() == '') {
        showMessageTheme2(0, "Gender is required");
        return false;
    }
    // if ($("#" + formId + " #phoneNumber").val() == null || $("#" + formId + " #phoneNumber").val() == undefined || $("#" + formId + " #phoneNumber").val() == '') {
    //     showMessageTheme2(0, "Phone Number is required");
    //     return false;
    // }
    if (!validateEmail($("#" + formId + " #emailId").val().trim())) {
        showMessageTheme2(0, "Email is either empty or invalid");
        return false;
    }
    if ($("#" + formId + " #addedDate").val() == null || $("#" + formId + " #addedDate").val() == undefined || $("#" + formId + " #addedDate").val() == '') {
        showMessageTheme2(0, "Added date is required");
        return false;
    }
    if ($("#" + formId + " #country").val() == null || $("#" + formId + " #country").val() == undefined || $("#" + formId + " #country").val() == '') {
        showMessageTheme2(0, "Country is required");
        return false;
    }
    if ($("#" + formId + " #state").val() == null || $("#" + formId + " #state").val() == undefined || $("#" + formId + " #state").val() == '') {
        showMessageTheme2(0, "State is required");
        return false;
    }
    if ($("#" + formId + " #city").val() == null || $("#" + formId + " #city").val() == undefined || $("#" + formId + " #city").val() == '') {
        showMessageTheme2(0, "City is required");
        return false;
    }

    var requestDate = {
        userFullName: $(".admin-profile-wrapper #userName").val(),
        gender: $(".admin-profile-wrapper #gender").val(),
        contactNumber: $(".admin-profile-wrapper #phoneNumber").val(),
        emailId: $(".admin-profile-wrapper #emailId").val(),

        countryId: $(".admin-profile-wrapper #country option:selected").val().trim(),
        stateId: $(".admin-profile-wrapper #state option:selected").val().trim(),
        cityId: $(".admin-profile-wrapper #city option:selected").val().trim(),

        countryTimezone: $("#countryTimezoneId").val(),
        countryTimezoneId: $("#countryTimezoneId").attr("custom_timezone_id"),
        isdCode: $('#isdCode').val(),
        userId: $('#userId').val()
    };

    var responseData = await getDashboardDataBasedUrlAndPayload(true, false, 'save-common-profile-details', requestDate);
    console.log(responseData);

    cancelEditProfilePage();
}

function getAllDataAndRecords(userId){
	var uploadRequestDTO = {};
	var documentUploads = uploadDocs;

	uploadRequestDTO['userId'] = userId;
	uploadRequestDTO['documentUploads'] = documentUploads;
	return uploadRequestDTO;
}

function saveProfileImage(userId, docType){
	$.ajax({
		type : "POST",
		contentType : APPLICATION_JSON_VALUE,
		url : getURLForHTML('dashboard','save-docs'),
		data : JSON.stringify(getAllDataAndRecords(userId)),
		dataType : 'json',
		async : false,
		success : function(data) {
			if (data['status'] == '0' || data['status'] == '2' || data['status'] == '3') {
				if(data['status'] == '3'){
					showMessageTheme2(0, data['MESSAGE'],'',true);
					redirectLoginPage();
				}else{
					if(tt=='theme1'){
						showMessage(false, data['MESSAGE']);
					}else{
						showMessageTheme2(0, data['MESSAGE'],'',true);
					}
				}
			} else {
				var doctype = "";
				$.each(data['LIST_OF_DOC'], function(key,value){
					var doctype = value.DOCUMENT_PATH.split(".").pop();
					if(data['LIST_OF_DOC'][key].DOCUMENT_PATH.split(".").pop() != "pdf"){
						//$("#"+data['LIST_OF_DOC'][key].IMG_ID).attr("src",data['LIST_OF_DOC'][key].DOCUMENT_PATH);
						$("#"+value['IMG_ID']).parent().parent().find(".upload-btn-wrapper").hide();
						if(USER_ROLE == 'STUDENT'){
							$("#"+value['IMG_ID']).parent().parent().find(".removeDocBtn").hide();
						}
					}else{
						$("#uploadFile .upload_pdf .pre_upload_pdf").remove();
						$("#uploadFile .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+data['LIST_OF_DOC'][key].DOCUMENT_PATH+'"></object>');

						$("#uploadFile .upload_pdf a.download-pdf-btn").attr("href",base64URL);
						$("#uploadFile .upload_pdf").removeClass("d-none");
						$("#uploadFile .upload_img").addClass("d-none");
						$("#"+value['IMG_ID']).parent().parent().find(".upload-btn-wrapper").hide();
						if(USER_ROLE == 'STUDENT'){
							$("#"+value['IMG_ID']).parent().parent().find(".removeDocBtn").hide();
						}
					}
				});
				$('.removeDocBtn').each(function(){
					if($(this).attr('style').replace(/\s/g, '') != 'display:none' && $(this).attr('style').replace(/\s/g, '') != 'display:none;'){
					  $("#allDocsNotUploaded").hide();
					  $("#allDocsUploaded").show();
					}else{
					  $("#allDocsNotUploaded").show();
					  $("#allDocsUploaded").hide();
					  return false;
					}
				});
				if(docType == "Profile Image"){
					showMessageTheme2(1, 'Profile image uploaded successfully','',true);
				}else{
					showMessageTheme2(1, 'Document(s) uploaded','',true);
					setTimeout(function(){customLoader(true); window.location.reload();},2000);
				}
			}
		}
	});

}
