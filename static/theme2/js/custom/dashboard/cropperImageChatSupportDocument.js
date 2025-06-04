    var cropper;
    var currentInputId;
    var currentThumbId;
    var base64URLElementID;
    var viewBtn;
    var removeBtn;
    var fileName='';
    var fileType='';
    var docType='';
    var base64URL='';
    var standardID=''; 
    var canvas;
    var uploadDocs=[];
    var showAddMoreBtnArray=[3,4,5];
    var index;
    // function addDocs(uploadDocs,fileObj){
    //   $.each(uploadDocs, function(index, value){
    //     if(value.docType == fileObj.docType){
    //       uploadDocs[index]=fileObj
    //     }
    //   });
    // }
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
        $("#"+inputId).parent().attr('fileName', fileName);
        $("#"+inputId).parent().attr('uploaded', 'Y');
        // var fileObj = new Object({"filePath":base64URL,"fileName":fileName,"docType":docType,"imgID":currentThumbId});
        // var found = uploadDocs.some(el => el.docType === fileObj.docType);
        // if(!found){ 
        //   uploadDocs.push(fileObj);
        // }
        // addDocs(uploadDocs,fileObj)
        // console.log(uploadDocs);
      };
      reader.readAsDataURL(file);
    }


    function cropImageChatSupport(event, inputId, thumbId, base64URLElement, type, studentStandardId, viewBtnID,eleIndex) {
      var fsize = $("#"+inputId)[0].files[0].size;
      var fileSize = Math.round((fsize / 1024));
      if(fileSize <= 5120){
        currentInputId = inputId;
        currentThumbId = thumbId;
        base64URLElementID=base64URLElement
        viewBtn=viewBtnID;
        docType = type;
        index=eleIndex;
        standardID=studentStandardId;
        var files = event.target.files;
        fileType = files[0].type.split("/");
        fileType = fileType[1];
        if(fileType == "pdf"){
          convertToBase64(inputId, "pdf");
          $('#'+base64URLElementID).attr('src', PATH_FOLDER_IMAGE2+'pdf.jpg'+SCRIPT_VERSION);
          $('#'+base64URLElementID).attr('thumbType', 'pdf');
          $('#'+base64URLElementID).hide();
          $('#'+viewBtn).show();
          $("#documentType"+index).attr("disabled",true);
        }else if(fileType == "jpg" || fileType == "jpeg" || fileType == "png"){
          var done = function(url) {
            currentInputId.value = '';
            $('#cropModalImgChatSuport').attr('src', '');
            setTimeout(function() {
              $('#cropModalImgChatSuport').attr('src', url);
              $('#cropModalChatSuport').modal('show');
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
    // function initChatCrop(){
      
    // }
    $(document).on('shown.bs.modal','#cropModalChatSuport', function () {
      cropper = new Cropper($('#cropModalImgChatSuport')[0], {
        aspectRatio: NaN,
      // viewMode: 3,
      });
    }).on('hidden.bs.modal','#cropModalChatSuport', function() {
      if(cropper!=null){
        cropper.destroy();
        cropper=null;
      }
    });

    function cropImgfun() {
      customLoader(true);
      var initialAvatarURL;
      
      if (cropper){
        canvas = cropper.getCroppedCanvas({
         // width: 160,
          //height: 160,
        });
       // initialAvatarURL = $('#' + base64URLElementID).attr('src');
        $('#' + base64URLElementID).attr('thumbType', 'img');
        $('#' + base64URLElementID).attr('data-PDFURL', canvas.toDataURL());
        $('#' + base64URLElementID).attr('fileName', fileName);
        $('#' + base64URLElementID).attr('uploaded', 'Y');
        $('#' + base64URLElementID).hide(); 
        $('#' + viewBtn).show();
        $("#documentType"+index).attr("disabled",true);
        // var fileObj = new Object({"filePath":canvas.toDataURL(),"fileName":fileName,"docType":docType,"imgID":currentThumbId});
        // var found = uploadDocs.some(el => el.docType === fileObj.docType);
        // if(!found){ 
        //   uploadDocs.push(fileObj);
        // }
        // addDocs(uploadDocs,fileObj)
        if($("#"+currentInputId).parent().children().hasClass("file-select-name")){
          $("#"+currentInputId).parent().find(".file-select-name").text(fileObj.fileName)
        }
        console.log(uploadDocs);
        canvas.toBlob(function(blob) {
          var formData = new FormData();
          formData.append('avatar', blob, 'avatar.jpg');
        });
        if(docType == "Profile Image"){
          saveDocs(USER_ID,standardID, docType)
        } 
        customLoader(false);
      }
      $('#cropModalChatSuport').modal('hide');
    }
    // Rotate Image Function
    function rotateImage() {
      if (!cropper) {
        return;
      }
      cropper.rotate(90);
    }

function viewAttachmentChatSupport(src, modalId, attachmentType, uploadFileAttr){
  var thumbImgType = $("#"+uploadFileAttr).attr("thumbType");
  base64URL = $("#"+uploadFileAttr).attr('data-PDFURL');
  console.log(base64URL)
  if(attachmentType=='I' && thumbImgType != 'pdf'){
    //base64URL = $(src).find("img").attr('src');
    $("#"+modalId+" .upload_img img").attr('src',base64URL)
    $("#"+modalId+' .upload_img').removeClass("d-none");
    $("#"+modalId+" .upload_pdf").addClass("d-none");
  }else if(attachmentType == "P" && thumbImgType == ''){
    $("#"+modalId+" .upload_pdf .pre_upload_pdf").remove();
    $("#"+modalId+" .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+base64URL+'"></object>');

    $("#"+modalId+" .upload_pdf a.download-pdf-btn").attr("href",base64URL);
    $("#"+modalId+" .upload_pdf").removeClass("d-none");
    $("#"+modalId+' .upload_img').addClass("d-none");
  }
  else{ 
    //base64URL = $(src).attr('data-base64url');
    $("#"+modalId+" .upload_pdf .pre_upload_pdf").remove();
    $("#"+modalId+" .upload_pdf#pre_upload_pdf_div").append('<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data="'+base64URL+'"></object>');

    $("#"+modalId+" .upload_pdf a.download-pdf-btn").attr("href",base64URL);
    $("#"+modalId+" .upload_pdf").removeClass("d-none");
    $("#"+modalId+' .upload_img').addClass("d-none");
  }   
  $("#"+modalId).modal("show");  
}

function resetChatSupportFormElement(){
  removeUploadImageChatSupport(this, 'OD3', 'OD3Icon', 'Other Document 3','','OD3div','OD3ViewAndRemoveBtn',3)
	$("#chatDate").val("");
	$('#chatDate').data('datepicker').clearDates();
	$("#OD3").val("");
  uploadDocs=[];
}

// function addMoreDocs(eleID){
//   if(showAddMoreBtnArray.length<1){
//     showMessageTheme2(0, 'You can not add more documents');
//     return false;
//   }else{
//     var min = Math.min(...showAddMoreBtnArray);
//     //console.log(min);
//     var minIndex = showAddMoreBtnArray.indexOf(min);
//     if (minIndex !== -1) {
//         showAddMoreBtnArray.splice(minIndex, 1);
//     }
//     $("#upload-document-wapper").find("[index='" + min + "']").show();
//   }
// }

function removeUploadImageChatSupport(src, inputId, thumbId, type, studentStandardId, uploadBtnID, viewBtnID, eleIndex){
  $("#"+viewBtnID).hide();
  $("#"+uploadBtnID).show(); 
  $('#'+uploadBtnID).attr('filename','');
  $('#'+uploadBtnID).attr('uploaded','D');
  $('#'+uploadBtnID).attr('thumbtype','');
  $('#'+uploadBtnID).attr('data-pdfurl','');
  $("#"+inputId).val("");
  // for (var i=0; i < uploadDocs.length; i++) {
	// 	if (uploadDocs[i].docType === type) {
	// 		uploadDocs.splice(i, 1);
	// 		console.log(uploadDocs);
	// 	}
	// }
	
	$('.removeDocBtn').each(function(index){
		if($(this).attr('style') == 'display: none'){
			$("#allDocsNotUploaded").show();
			$("#allDocsUploaded").hide();
		}else{
			$("#allDocsNotUploaded").show();
			$("#allDocsUploaded").hide();
		}
	});
}
$(document).on('hidden.bs.modal', function (e) {
  var visiblemodalLength = $(".modal.show").length;
   if(visiblemodalLength == '0'){
    $('body').css({"padding-right":"0"});
    $('body').removeClass("modal-open");
   }else{
    $('body').css({"padding-right":"17px"});
    $('body').addClass("modal-open");
   }
});
