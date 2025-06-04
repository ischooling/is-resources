    var cropper;
    var currentInputId;
    var currentThumbId;
    var fileName='';
    var fileType='';
    var docType='';
    var base64URL='';
    var standardID=''; 
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


    function cropImage(event, inputId, thumbId, type, studentStandardId) {
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
              $('#cropModal').modal('show');
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
    $(document).ready(function(){
      $('#cropModal').on('shown.bs.modal', function () {
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

      
      $('#crop').on('click', function() {
        
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
            saveDocs(USER_ID,standardID, docType)
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

function viewAttachment(src, modalId, attachmentType){
  
  var thumbImgType = $(src).find("img").attr("thumbType");
  if(attachmentType=='I' && thumbImgType == "pdf"){
    var base64URL = $(src).next().attr('data-PDFURL');
  }else if(attachmentType=='P' && thumbImgType == ""){
    var base64URL = $(src).attr('data-PDFURL');
  }else{
    var base64URL = $(src).find("img").attr('src');
  }
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
