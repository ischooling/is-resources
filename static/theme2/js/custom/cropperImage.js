var cropper;
    var currentInputId;
    var currentThumbId;
    var fileName='';
    var fileType='';
    var docType='';
    var base64URL='';
    var standardID=''; 
    var canvas;
    var STUDENT_UPLOAD_DOCUMENTS=[];
    var viewAndRemoveFormat = false;
    var USERID;
    function addDocs(STUDENT_UPLOAD_DOCUMENTS,fileObj){
      $.each(STUDENT_UPLOAD_DOCUMENTS, function(index, value){
        if(value.docType == fileObj.docType){
          STUDENT_UPLOAD_DOCUMENTS[index]=fileObj
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
      
      
        $("#"+inputId+"div").attr('data-PDFURL',base64URL);
        var fileObj = new Object({"filePath":base64URL,"fileName":fileName,"docType":docType,"imgID":currentThumbId});
        var found = STUDENT_UPLOAD_DOCUMENTS.some(el => el.docType === fileObj.docType);
          if(!found){ 
            STUDENT_UPLOAD_DOCUMENTS.push(fileObj);
          }
        addDocs(STUDENT_UPLOAD_DOCUMENTS,fileObj)
        console.log(STUDENT_UPLOAD_DOCUMENTS);
      };
      reader.readAsDataURL(file);
    }


    function cropImage(event, inputId, thumbId, type, userID, studentStandardId, viewAndRemoveFormatType) {
      USERID=userID;
      var fsize = $("#"+inputId)[0].files[0].size;
      var fileSize = Math.round((fsize / 1024));
      if(fileSize <= 5120){
        currentInputId = inputId;
        currentThumbId = thumbId;
        docType = type;
        standardID=studentStandardId;
        var files = event.target.files;
        fileType = files[0].type.split("/");
        fileType = fileType[1];
        if(fileType == "pdf"){
          if(docType == "Profile Image" || docType == "Logo Image"){
            showMessageTheme2(2, 'Please upload files in JPG, PNG, and JPEG with max size of 5MB');
            $("#"+inputId).val("");
            return false;
          }else{
            $('#' + currentThumbId).attr('src', PATH_FOLDER_IMAGE2+'pdf.jpg'+SCRIPT_VERSION);
            $('#' + currentThumbId).attr('thumbType', 'pdf');
            $('#' + currentInputId+'Remove').show();
            $('#' + currentInputId+'div').hide();
            convertToBase64(inputId, "pdf");
          }
          
          if(viewAndRemoveFormatType && viewAndRemoveFormatType != undefined){
            viewAndRemoveFormat=true;
          }else{
            viewAndRemoveFormat=false;
          }
          if(viewAndRemoveFormatType){
            $('#' + currentInputId+'FileName').text(files[0].name);
            $("#"+currentInputId+"ViewBtn").show(); 
            $("#"+currentInputId+"ViewBtn").find(".view-btn").attr("onclick", "viewAttachmentProfile(this, 'uploadFile','P', '"+currentInputId+"div')");
          }
        }else if(fileType == "jpg" || fileType == "jpeg" || fileType == "png"){
          var done = function(url) {
            currentInputId.value = '';
            $('#cropModalImg').attr('src', '');
            setTimeout(function() {
              $('#cropModalImg').attr('src', url);
              $('#cropModal').modal('show');
              if(docType == "Profile Image" || docType == "Logo Image"){
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
          if(viewAndRemoveFormatType && viewAndRemoveFormatType != undefined){
            viewAndRemoveFormat=true;
          }else{
            viewAndRemoveFormat=false;
          }
        }else{
          $("#"+inputId).val("")
          showMessageTheme2(2, 'Please upload files in PDF, JPG, PNG, and JPEG Format');
        }
      }else{
        $("#"+inputId).val("")
        showMessageTheme2(2, 'Please upload files in PDF, JPG, PNG, and JPEG with max size of 5MB');
      }   
      
    }
    $(document).ready(function(){
      $('#cropModal').on('shown.bs.modal', function () {
        if (cropper) {
          cropper.destroy();
          cropper = null;
        }
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

      
      $("#crop").unbind().bind('click', function() {
        customLoader(true);
        var initialAvatarURL;
        $('#cropModal').modal('hide');
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
          if(viewAndRemoveFormat){
            $('#' + currentInputId+'FileName').text(fileName);
            $("#"+currentInputId+"ViewBtn").show(); 
            $("#"+currentInputId+"ViewBtn").find(".view-btn").attr("onclick", "viewAttachmentProfile(this, 'uploadFile','I', '"+currentInputId+"div')");
          }
          var fileObj = new Object({"filePath":canvas.toDataURL(),"fileName":fileName,"docType":docType,"imgID":currentThumbId});
          var found = STUDENT_UPLOAD_DOCUMENTS.some(el => el.docType === fileObj.docType);
          if(!found){ 
            STUDENT_UPLOAD_DOCUMENTS.push(fileObj);
          }
          addDocs(STUDENT_UPLOAD_DOCUMENTS,fileObj)
          
          if($("#"+currentInputId).parent().children().hasClass("file-select-name")){
            $("#"+currentInputId).parent().find(".file-select-name").text(fileObj.fileName)
          }
          console.log(STUDENT_UPLOAD_DOCUMENTS);
          canvas.toBlob(function(blob) {
            var formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');
          });
          if(docType == "Profile Image"){
            saveDocs(USERID,standardID, docType) 
          }
          customLoader(false);
        }
      });
    });
    
    // Rotate Image Function
    function rotateImage() {
      if (!cropper) {
        return;
      }
      cropper.rotate(90);
    }

function viewAttachment(src, modalId, attachmentType) {
  var thumbImgType = $(src).find("img").attr("thumbType");
  var base64URL;

  if (attachmentType == 'I' && thumbImgType == "pdf") {
    base64URL = $(src).next().attr('data-PDFURL');
  } else if (attachmentType == 'P' && thumbImgType == "") {
    base64URL = $(src).attr('data-PDFURL');
  } else {
    base64URL = $(src).find("img").attr('src');
  }

  console.log(base64URL);

  // Handle image
  if (attachmentType == 'I' && thumbImgType != 'pdf') {
    $("#" + modalId + " .upload_img img").attr('src', base64URL);
    $("#" + modalId + ' .upload_img').removeClass("d-none");
    $("#" + modalId + " .upload_pdf").addClass("d-none");
  } 
  // Handle PDF
  else {
    // Clean previous PDF
    $("#" + modalId + " .upload_pdf .pre_upload_pdf").remove();

    // ✅ Convert Base64 → Blob → Blob URL (Chrome-safe)
    let pdfUrl = base64URL;
    if (base64URL.startsWith("data:application/pdf;base64,")) {
      const byteCharacters = atob(base64URL.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      pdfUrl = URL.createObjectURL(blob);
    }

    // Append safe object
    $("#" + modalId + " .upload_pdf#pre_upload_pdf_div").append(
      `<object type="application/pdf" class="pre_upload_pdf full" style="height:400px;" data="${pdfUrl}"></object>`
    );

    // Set download link
    $("#" + modalId + " .upload_pdf a.download-pdf-btn").attr("href", base64URL);

    $("#" + modalId + " .upload_pdf").removeClass("d-none");
    $("#" + modalId + ' .upload_img').addClass("d-none");

    // Optional: Revoke Blob URL when modal hides (free memory)
    $("#" + modalId).one("hidden.bs.modal", function () {
      if (pdfUrl.startsWith("blob:")) {
        URL.revokeObjectURL(pdfUrl);
      }
    });
  }

  // Show modal
  $("#" + modalId).modal("show");
}
