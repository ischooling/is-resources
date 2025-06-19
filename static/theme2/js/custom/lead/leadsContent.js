function renderDocumentContent(userId, leadId, documentsFor){
	var data = getLeadDocuments(userId, leadId, documentsFor);
	var documents = data.documents;
	console.log('renderDocumentContent length '+documents.length);
	
	var html=
	'<div class="full mt-2">'
		+'<h6 class="border-bottom text-primary">Upload Documents</h6>'
	+'</div>'
	+'<div class="row" id="upload-document-wapper">'
		+renderDocument1(1, documents)
		+renderDocument2(2, documents)
		+renderDocument3(3, documents)
		+renderDocument4(4, documents)
		+renderDocument5(5, documents)
		+'<div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1" id="addMoreDocWrapper">'
			+'<label class="full m-0">&nbsp;</label>'
			+'<a href="javascript:void(0);"  class="mt-1 btn btn-success full py-2" onclick="addMoreDocs(\'addMoreDocWrapper\')"><i class="fa fa-plus mr-2 mt-1"></i>Add More Document</a>'
		+'</div>'
		+'<div class="col-12 mb-1 mt-1 add-more-limits-note" style="display: none;">'
			+'<b>Note:You can not add more documents</b>'
		+'</div>'
	+'</div>';
	$('#documentDiv').html(html);

	var supportHtmlFollowup=deleteWarning()+cropModal()+pdfPreview();
	$('#supportHtmlFollowup').html(supportHtmlFollowup);
	//initCrop();
	$(".documentType").select2({
		theme:"bootstrap4",
		placeholder:"Select Document Type",
		dropdownParent:"#leadPopupForm"
	})

	// var visiblemodalLength = $(".modal.show").length;
	// if(visiblemodalLength == '0'){
	// 	$('body').css({"padding-right":"0"});
	// 	$('body').removeClass("modal-open");
	// }else{
	// 	$('body').css({"padding-right":"17px"});
	// 	$('body').addClass("modal-open");
	// }
	
}

function getDefautlUploadObject(docType, docLabel){
	var uploadDoc={};
	uploadDoc['uploaded']='N';
	uploadDoc['docType']=docType;
	uploadDoc['docLabel']=docLabel;
	uploadDoc['fileName']='';
	uploadDoc['filePath']=''
	// uploadDoc['filePath']=PATH_FOLDER_IMAGE2+'no-image.jpg'+SCRIPT_VERSION;
	return uploadDoc;
}

function renderDocument1(index, uploadDocs){
	var uploadDoc={}
	if(uploadDocs[46]!=undefined){
		uploadDoc=uploadDocs[46];
	}else{
		uploadDoc=getDefautlUploadObject('img','Nationality Proof');
	}
	var html=
	'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 py-1 bg-light-primary border mb-1 upload-docs-wrapper">'
		+'<div class="row">'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">'
				+'<label class="full mb-1">'+uploadDoc.docLabel+'</label>'
				+'<select name="documentType" id="documentType1" class="documentType" disabled>'
					+'<option value="NP" selected>Nationality Proof</option>'
				+'</select>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1" style="display: '+(uploadDoc.uploaded=='Y'?'none':'block')+';">'
				+'<label class="full m-0">&nbsp;</label>'
				+'<div class="full position-relative  mt-1" id="OD1div" uploaded="'+uploadDoc.uploaded+'" fileName="'+uploadDoc.fileName+'" docType="Nationality Proof" thumbType="'+uploadDoc.docType+'" data-PDFURL="'+uploadDoc.filePath+'" >'
					+'<input type="file" id="OD1" class="upload-input form-control" onchange="cropImageLead(event,\'OD1\',\'OD1Icon\', \'OD1div\',\''+uploadDoc.docLabel+'\',\'\',\'OD1ViewAndRemoveBtn\','+index+')">'
					+'<label class="upload-label form-control mb-0 btn btn-primary"><i class="fa fa-upload mr-2"></i>Upload</label>'
				+'</div>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 view-and-remove-btn-wrapper" id="OD1ViewAndRemoveBtn" style="display: '+(uploadDoc.uploaded=='Y'?'block':'none')+';">'
				+'<label class="full mb-1">&nbsp;</label>'
				+'<a id="OD1View" href="javascript:void(0);" class="btn btn-outline-success mr-2" onclick="viewAttachment(this, \'uploadFile\',\'I\', \'OD1div\')"><i class="fa fa-eye mr-2"></i>View</a>'
				+'<button type="button" id="OD1Remove" class="btn btn-outline-danger" onclick="showWarningMessageShow(\'Are you sure ?\',\'removeUploadImage(this, \\\'OD1\\\', \\\'OD1Icon\\\', \\\''+uploadDoc.docLabel+'\\\',\\\'\\\',\\\'OD1div\\\',\\\'OD1ViewAndRemoveBtn\\\','+index+') \')">'
				+'<i class="fa fa-trash mr-2"></i>Remove </button>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html
}
function renderDocument2(index, uploadDocs){
	var uploadDoc={}
	if(uploadDocs[17]!=undefined){
		uploadDoc=uploadDocs[17];
	}else{
		uploadDoc=getDefautlUploadObject('img','Last academic Proof');
	}
	console.log('renderDocument2 '+uploadDoc);
	var html=
	'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 py-1 bg-light-primary border mb-1 upload-docs-wrapper">'
		+'<div class="row">'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">'
				+'<label class="full mb-1">Last Academic Proof</label>'
				+'<select name="documentType" id="documentType2" class="documentType" disabled>'
					+'<option value="LAP" selected>Last Academic Proof</option>'
				+'</select>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1" style="display: '+(uploadDoc.uploaded=='Y'?'none':'block')+';">'
				+'<label class="full m-0">&nbsp;</label>'
				+'<div class="full position-relative  mt-1" id="OD2div" uploaded="'+uploadDoc.uploaded+'" fileName="'+uploadDoc.fileName+'" docType="Last Academic Proof" thumbType="'+uploadDoc.docType+'" data-PDFURL="'+uploadDoc.filePath+'" >'
					+'<input type="file" id="OD2" class="upload-input form-control" onchange="cropImageLead(event,\'OD2\',\'OD2Icon\',\'OD2div\',\'Last Academic Proof\',\'\',\'OD2ViewAndRemoveBtn\','+index+')">'
					+'<label class="upload-label form-control mb-0 btn btn-primary"><i class="fa fa-upload mr-2"></i>Upload</label>'
				+'</div>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 view-and-remove-btn-wrapper" id="OD2ViewAndRemoveBtn" style="display: '+(uploadDoc.uploaded=='Y'?'block':'none')+';">'
				+'<label class="full mb-1">&nbsp;</label>'
				+'<a id="ODView" href="javascript:void(0);"  class="btn btn-outline-success mr-2" onclick="viewAttachment(this, \'uploadFile\',\'I\',\'OD2div\')">'
					+'<i class="fa fa-eye mr-2"></i>View'
				+'</a>'
				+'<button type="button" id="OD2Remove" class="btn btn-outline-danger" onclick="showWarningMessageShow(\'Are you sure ?\', \'removeUploadImage(this, \\\'OD2\\\', \\\'OD2Icon\\\', \\\'Last Academic Proof\\\',\\\'\\\',\\\'OD2div\\\',\\\'OD2ViewAndRemoveBtn\\\','+index+') \')"><i class="fa fa-trash mr-2"></i>Remove </button>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function renderDocument3(index, uploadDocs){
	var uploadDoc={}
	var showDiv="none";
	if(uploadDocs[47]!=undefined){
		uploadDoc=uploadDocs[47];
		showDiv="block";
	}else{
		uploadDoc=getDefautlUploadObject('img','Other Document 4');
	}
	console.log('renderDocument3 '+uploadDoc);
	var html=
	'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 py-1 bg-light-primary border mb-1 upload-docs-wrapper" index="'+index+'" style="display: '+showDiv+';">'
		+'<div class="row">'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">'
				+'<label class="full mb-1">Select Document</label>'
				+'<select name="documentType" id="documentType3" class="documentType" disabled>'
					+'<option value="OD3" selected>Other Document 1</option>'
				+'</select>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1" style="display: '+(uploadDoc.uploaded=='Y'?'none':'block')+';">'
				+'<label class="full m-0">&nbsp;</label>'
				+'<div class="full position-relative  mt-1" id="OD3div" uploaded="'+uploadDoc.uploaded+'" fileName="'+uploadDoc.fileName+'" docType="Other Document 3" thumbType="'+uploadDoc.docType+'" data-PDFURL="'+uploadDoc.filePath+'" >'
					+'<input type="file" id="OD3" class="upload-input form-control" onchange="cropImageLead(event,\'OD3\',\'OD3Icon\',\'OD3div\',\'Other Document 3\',\'\',\'OD3ViewAndRemoveBtn\','+index+')">'
					+'<label class="upload-label form-control mb-0 btn btn-primary"><i class="fa fa-upload mr-2"></i>Upload</label>'
				+'</div>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 view-and-remove-btn-wrapper" id="OD3ViewAndRemoveBtn" style="display: '+(uploadDoc.uploaded=='Y'?'block':'none')+';">'
				+'<label class="full mb-1">&nbsp;</label>'
					+'<a id="OD3View" href="javascript:void(0);"  class="btn btn-outline-success mr-2" onclick="viewAttachment(this, \'uploadFile\',\'I\',\'OD3div\')">'
						+'<i class="fa fa-eye mr-2"></i>View'
					+'</a>'
				+'<button type="button" id="OD3Remove" class="btn btn-outline-danger" onclick="showWarningMessageShow(\'Are you sure ?\', \'removeUploadImage(this, \\\'OD3\\\', \\\'OD3Icon\\\', \\\'Other Document 3\\\',\\\'\\\',\\\'OD3div\\\',\\\'OD3ViewAndRemoveBtn\\\','+index+')\')"><i class="fa fa-trash mr-2"></i>Remove </button>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function renderDocument4(index, uploadDocs){
	var uploadDoc={}
	var showDiv="none";
	if(uploadDocs[48]!=undefined){
		uploadDoc=uploadDocs[48];
		showDiv="block";
	}else{
		uploadDoc=getDefautlUploadObject('img','Other Document 4');
	}
	console.log('renderDocument4 '+uploadDoc);
	var html=
	'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 py-1 bg-light-primary border mb-1 upload-docs-wrapper" index="'+index+'" style="display: '+showDiv+';">'
		+'<div class="row">'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">'
				+'<label class="full mb-1">Select Document</label>'
				+'<select name="documentType" id="documentType4" class="documentType" disabled>'
					+'<option value="OD4" selected>Other Document 2</option>'
				+'</select>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1" style="display: '+(uploadDoc.uploaded=='Y'?'none':'block')+';">'
				+'<label class="full m-0">&nbsp;</label>'
				+'<div class="full position-relative  mt-1" id="OD4div" uploaded="'+uploadDoc.uploaded+'" fileName="'+uploadDoc.fileName+'" docType="Other Document 4" thumbType="'+uploadDoc.docType+'" data-PDFURL="'+uploadDoc.filePath+'" >'
					+'<input type="file" id="OD4" class="upload-input form-control" onchange="cropImageLead(event,\'OD4\',\'OD4Icon\',\'OD4div\',\'Other Document 4\',\'\',\'OD4ViewAndRemoveBtn\','+index+')">'
					+'<label class="upload-label form-control mb-0 btn btn-primary"><i class="fa fa-upload mr-2"></i>Upload</label>'
				+'</div>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 view-and-remove-btn-wrapper" id="OD4ViewAndRemoveBtn" style="display: '+(uploadDoc.uploaded=='Y'?'block':'none')+';">'
				+'<label class="full mb-1">&nbsp;</label>'
					+'<a id="OD4View" href="javascript:void(0);"  class="btn btn-outline-success mr-2" onclick="viewAttachment(this, \'uploadFile\',\'I\',\'OD4div\')">'
						+'<i class="fa fa-eye mr-2"></i>View'
					+'</a>'
				+'<button type="button" id="OD4Remove" class="btn btn-outline-danger" onclick="showWarningMessageShow(\'Are you sure ?\', \'removeUploadImage(this, \\\'OD4\\\', \\\'OD4Icon\\\', \\\'Other Document 4\\\',\\\'\\\',\\\'OD4div\\\',\\\'OD4ViewAndRemoveBtn\\\','+index+')\')"><i class="fa fa-trash mr-2"></i>Remove </button>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function renderDocument5(index, uploadDocs){
	var uploadDoc={}
	var showDiv="none";
	if(uploadDocs[49]!=undefined){
		uploadDoc=uploadDocs[49];
		showDiv="block";
	}else{
		uploadDoc=getDefautlUploadObject('img','Other Document 5');
	}
	console.log('renderDocument5 '+uploadDoc);
	var html=
	'<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 py-1 bg-light-primary border mb-1 upload-docs-wrapper" index="'+index+'" style="display: '+showDiv+';">'
		+'<div class="row">'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1">'
				+'<label class="full mb-1">Select Document</label>'
				+'<select name="documentType" id="documentType5" class="documentType" disabled>'
					+'<option value="OD5" selected>Other Document 3</option>'
				+'</select>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1" style="display: '+(uploadDoc.uploaded=='Y'?'none':'block')+';">'
				+'<label class="full m-0">&nbsp;</label>'
				+'<div class="full position-relative  mt-1" id="OD5div" uploaded="'+uploadDoc.uploaded+'" fileName="'+uploadDoc.fileName+'" docType="Other Document 5" thumbType="'+uploadDoc.docType+'" data-PDFURL="'+uploadDoc.filePath+'" >'
					+'<input type="file" id="OD5" class="upload-input form-control" onchange="cropImageLead(event,\'OD5\',\'OD5Icon\',\'OD5div\',\'Other Document 5\',\'\',\'OD5ViewAndRemoveBtn\','+index+')">'
					+'<label class="upload-label form-control mb-0 btn btn-primary"><i class="fa fa-upload mr-2"></i>Upload</label>'
				+'</div>'
			+'</div>'
			+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 col-12 mb-1 mt-1 view-and-remove-btn-wrapper" id="OD5ViewAndRemoveBtn" style="display: '+(uploadDoc.uploaded=='Y'?'block':'none')+';">'
				+'<label class="full mb-1">&nbsp;</label>'
					+'<a id="OD5View" href="javascript:void(0);"  class="btn btn-outline-success mr-2" onclick="viewAttachment(this, \'uploadFile\',\'I\',\'OD5div\')">'
						+'<i class="fa fa-eye mr-2"></i>View'
					+'</a>'
				+'<button type="button" id="OD5Remove" class="btn btn-outline-danger" onclick="showWarningMessageShow(\'Are you sure ?\', \'removeUploadImage(this, \\\'OD5\\\', \\\'OD5Icon\\\', \\\'Other Document 5\\\',\\\'\\\',\\\'OD5div\\\',\\\'OD5ViewAndRemoveBtn\\\','+index+')\')"><i class="fa fa-trash mr-2"></i>Remove </button>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function deleteWarning(warningMessage, callbackFunction) {
	var html =
		'<div class="modal fade fade-scale mt-3" id="remarksresetDelete2" tabindex="-1" aria-hidden="true" >'
			+'<div class="modal-dialog modal-sm" role="document">'
				+'<div class="modal-content shadow-lg">'
					+'<div class="modal-header pt-2 pb-2 bg-info justify-content-center">'
						+'<h5 class="heading text-white text-center" id="warningMessage2">' + warningMessage + '</h5>'
					+'</div>'
					+'<div id="statusMessage-2" class="modal-body delete-modal text-center">'
						+'<i class="fas fa-sync fa-4x text-info"></i>'
					+'</div>'
					+'<div class="modal-footer">'
						+'<div class="m-auto">'
							+'<button id="resetDeleteErrorWarningYes2" type="button" class="btn btn-outline-info mr-2" onclick="' + callbackFunction + '">Yes</button>'
							+'<button id="resetDeleteErrorWarningNo2" type="button" class="btn btn-info mr-1" data-dismiss="modal">No</button>'
							+'<button id="resetDeleteErrorWarningCancel2" type="button" class="btn btn-success mr-1" data-dismiss="modal" style="display: none;">Close</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function cropModal(){
	var html=
	'<div class="modal fade" id="cropModal" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">'
		+'<div class="modal-dialog modal-lg p-0" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header">'
					+'<h5 class="modal-title" id="modalLabel">Crop the image</h5>'
					// +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					+'<div class="ml-auto">'
						+'<button type="button" class="btn btn-secondary mr-1" data-dismiss="modal">Cancel</button>'
						+'<button type="button" class="btn btn-primary mr-1" id="crop" onclick="cropImageFinal()">Crop</button>'
						+'<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>'
					+'</div>'
					
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="img-container">'
						+'<img id="cropModalImg" src="https://avatars0.githubusercontent.com/u/3456749" width="100%">'
					+'</div>'
				+'</div>'
				// +'<div class="modal-footer">'
				// 	+'<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'
				// 	+'<button type="button" class="btn btn-primary" id="crop" onclick="cropImageFinal()">Crop</button>'
				// 	+'<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>'
				// +'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function pdfPreview(){
	var html=
	'<div class="modal fade fade-scale" id="uploadFile" tabindex="-1">'
		+'<div class="modal-dialog modal-md  box-shadow-none" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">'
					+'<h6 class="heading text-white">Preview File</h6>'
					+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
				+'</div>'
				+'<div class="modal-body m-0 py-2" style="margin-top:0 !important">'
					+'<div id="pre_upload_image_div" class="full text-center upload_img d-none">'
						+'<img id="pre_upload_image" class="w-100" src="" />'
					+'</div>'
					+'<div id="pre_upload_pdf_div" class=" full text-center upload_pdf d-none">'
						+'<div class="full">'
							+'<a href="" target="_blank" class="btn btn-sm btn-primary download-pdf-btn mb-2 pull-right" download="file.pdf">Download PDF</a>'
						+'</div>'
						+'<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data=""></object>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}


function renderChatContent(discardPermission, userId, leadId){
	var html=leadChatDocumentsContent(discardPermission, userId, leadId)+getChatImageCropContent()+pdfPreview()+deleteWarning();
	$('#supportHtmlChats').html(html);
	//initChatCrop()
	$("#chatSupport").select2({
		theme:"bootstrap4",
		dropdownParent:"#updateChatSupportDocs"
	})
	$("#chatDate").datepicker({
		format : 'M dd, yyyy',
	    autoclose: true,
	});
	uploadedChatLogs(discardPermission, userId, leadId)
	$('#updateChatSupportDocs').modal({ backdrop: 'static', keyboard: false })
}

function leadChatDocumentsContent(discardPermission, userId, leadId){
	var html=
	'<div id="updateChatSupportDocs" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
		+'<div class="modal-dialog modal-xl">'
			+'<div class="modal-content border-0">'
				+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
					+'<h5 class="modal-title" id="exampleModalLabel">Update and View Document</h5>'
					+'<button type="button" class="close text-white" onClick="resetLeadChat(\'new-leads\')" aria-label="Close"><span aria-hidden="true">×</span></button>'
				+'</div>'
				+'<div class="modal-body">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-1 mt-1" style="display:none;">'
							+'<input type="hidden" class="form-control" id="isuploaded" name="isuploaded" value="false">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-1 mt-1">'
							+'<label class="m-0">Chat Support</label>'
							+'<select class="form-control" id="chatSupport" name="chatSupport">'
								+'<option value="Zoho" selected>Zoho chat</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-1 mt-1">'
							+'<label class="m-0">Select chat date</label>'
							+'<input type="text" name="chatDate" id="chatDate" class="form-control">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-1 mt-1">'
							+'<label class="m-0 full">&nbsp;</label>'
							+'<div class="full position-relative" id="OD3div" uploaded="" fileName="" docType="Chat documents" thumbType="" data-PDFURL="" >'
								+'<input type="file" id="OD3" class="upload-input form-control" onchange="cropImageChatSupport(event,\'OD3\',\'OD3Icon\',\'OD3div\',\'Chat documents\',\'\',\'OD3ViewAndRemoveBtn\',3)">'
								+'<label class="upload-label form-control mb-0 btn btn-primary"><i class="fa fa-upload mr-2"></i>Upload</label>'
							+'</div>'
							+'<div class="full" id="OD3ViewAndRemoveBtn" style="display: none;">'
								+'<a id="OD3View" href="javascript:void(0);"  class="btn btn-outline-success mr-2" onclick="viewAttachmentChatSupport(this, \'uploadFile\',\'I\',\'OD3div\')">'
									+'<i class="fa fa-eye mr-2"></i>View'
								+'</a>'
								+'<button type="button" id="OD3Remove" class="btn btn-outline-danger" onclick="showWarningMessageShow(\'Are you sure you want to remove this document?\', \'removeUploadImageChatSupport(this, \\\'OD3\\\', \\\'OD3Icon\\\', \\\'Chat documents\\\',\\\'\\\',\\\'OD3div\\\',\\\'OD3ViewAndRemoveBtn\\\',3) \')"><i class="fa fa-trash mr-2"></i>Remove </button>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 mb-1 mt-1">'
							+'<label class="m-0 full">&nbsp;</label>'
							+'<button type="button" class="btn btn-success btn-shadow pr-4 pl-4" id="saveChatBtn" onclick="saveChatLogs(\''+discardPermission+'\', '+userId+','+leadId+',\'CHAT_SUPPORT\', \'chatDate\', \'OD3div\')">Save</button>'
						+'</div>'
						+'<div class="col-lg-12 col-md-12 col-ms-12 col-12 pt-2 pb-2 table-responsive uploadedChatLogs">'
							
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function uploadedChatLogs(discardPermission, userId, leadId){
	var data=getLeadChatDetails(userId, leadId,'CHAT_SUPPORT')
	var html=
	'<table class="table table-bordered table-striped" style="font-size:11px;">'
		+'<thead>'
			+'<tr>'
				+'<th>Sr. No.</th>'
				+'<th>Chat From</th>'
				+'<th>Chat date</th>'
				+'<th>View</th>'
				+'<th>Added by</th>'
				+'<th>Added date</th>';
				if(discardPermission){
					html+'<th>Action</th>';
				}
				html+=
			'</tr>'
		+'</thead>'
		+'<tbody>';
			$.each(data.chatSupports, function(k,chatSupport){
				html+=
				'<tr>'
					+'<td id="chatSupportId_'+chatSupport.supportId+'">'+(k+1)+'</td>'
					+'<td>'+chatSupport.chatFrom+'</td>'
					+'<td>'+chatSupport.chatDate+'</td>'
					+'<td>';
					$.each(chatSupport.documents, function(k1,document){
						html+=
						'<div id="viewDoc_'+k+'" thumbType="'+document.docType+'" data-PDFURL="'+document.filePath+'">'
							+'<a href="javascript:void(0);"  class="btn btn-outline-success" onclick="viewAttachmentChatSupport(this, \'uploadFile\',\'I\',\'viewDoc_'+k+'\')">'
								+'<i class="fa fa-eye mr-2"></i>View'
							+'</a>'
						+'</div>';
					});
					html+=
					'</td>'
					+'<td>'+chatSupport.createdBy+'</td>'
					+'<td>'+chatSupport.createdDate+'</td>'
				+'</tr>';
			});
			html+=
		'</tbody>'
	+'</table>';
	$('.uploadedChatLogs').html(html);
	return 
}
function getChatImageCropContent(){
	var html=
	'<div class="modal fade" id="cropModalChatSuport" tabindex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" data-backdrop="static">'
		+'<div class="modal-dialog modal-lg p-0" role="document">'
			+'<div class="modal-content">'
				+'<div class="modal-header">'
					+'<h5 class="modal-title" id="modalLabel">Crop the image</h5>'
					// +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
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
				// +'<div class="modal-footer">'
				// 	+'<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>'
				// 	+'<button type="button" class="btn btn-primary" id="cropChatSupportDoc" onclick="cropImgfun()">Crop</button>'
				// 	+'<button type="button" class="btn btn-primary" onclick="rotateImage()">Rotate</button>'
				// +'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}

function whatsappChatUI(responseData) {
    const messages = responseData.data
        .filter(item => item.eventType === "message" || item.eventType === "broadcastMessage")
        .sort((a, b) => parseFloat(new Date(a.created).getTime()) - parseFloat(new Date(b.created).getTime()));

    let html = `
        <style>
            .whatsapp-container {
                max-width: 800px;
                margin: 20px auto;
                background: #e5ddd5;
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                font-family: 'Segoe UI', sans-serif;
                overflow: hidden;
                position: relative;
            }

            .chat-header {
                background: linear-gradient(45deg, #075e54, #128c7e);
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

			.hide {
				display: none
			}

            .chat-header h3 {
                margin: 0;
                font-size: 1.2em;
            }

            .chat-header small {
                opacity: 0.8;
                font-size: 0.9em;
            }

            .chat-body {
                padding: 20px;
                height: 500px;
                overflow-y: auto;
                background: url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg');
                background-size: contain;
            }

            .message {
                max-width: 100%;
                margin-bottom: 15px;
                display: flex;
                animation: slideIn 0.3s ease;
            }

            .message.sent {
                justify-content: flex-end;
            }

            .message.received {
                justify-content: flex-start;
            }

            .message-bubble {
				max-width: 70%;
                padding: 12px 18px;
                border-radius: 10px;
                position: relative;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                word-wrap: break-word;
            }

            .sent .message-bubble {
                background: #dcf8c6;
                border-bottom-right-radius: 2px;
            }

            .received .message-bubble {
                background: white;
                border-bottom-left-radius: 2px;
            }

            .message-time {
                font-size: 0.7em;
                color: #666;
                margin-top: 5px;
                text-align: right;
            }
            .message-name {
                font-size: 0.7em;
                color: #666;
                margin-top: 2px;
                text-align: right;
            }

            .message-bubble::after {
                content: '';
                position: absolute;
                width: 10px;
                height: 10px;
                bottom: 0;
            }

            .sent .message-bubble::after {
                right: -10px;
                background: #dcf8c6;
                clip-path: polygon(0 100%, 100% 0, 100% 100%);
            }

            .received .message-bubble::after {
                left: -10px;
                background: white;
                clip-path: polygon(0 0, 100% 100%, 0 100%);
            }

            .status-indicator {
                font-size: 0.8em;
                color: #666;
                margin-left: 5px;
            }

            .status-indicator.read {
                color: #34b7f1;
            }

            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5em;
                cursor: pointer;
                opacity: 0.8;
            }

            .close-btn:hover {
                opacity: 1;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .status-bar {
                background: #f8f9fa;
                padding: 5px 20px;
                font-size: 0.8em;
                color: #666;
                border-bottom: 1px solid #dee2e6;
            }

            .date-separator {
                text-align: center;
                margin: 20px 0;
                position: relative;
            }

            .date-separator span {
                background: #e5ddd5;
                padding: 5px 15px;
                border-radius: 15px;
                font-size: 0.8em;
                color: #666;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }
        </style>

        <div id="watiLogsContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl" style='width: 80% !important;'>
                <div class="d-flex flex-wrap wati-wrapper">
                    <div class="modal-content border-0 watiLogsTableDiv">
                        <div class="modal-header py-1 bg-primary text-white">
                            <h5 class="modal-title font-weight-bold">Wati Logs</h5>
                            <button type="button" class="close text-white" onclick="selfModalHide('watiLogsContent')">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div class="modal-body pt-1">
                            <div class="flex-grow-1">
                                <div class="chat-body">
    `;

    let previousDate = null;

    messages.length == 0? `<div class="center"><h1>No Chat Yet.</h1><div/>` : messages.forEach((msg) => {
        const isSent = msg.owner === "true" || msg.eventType === "broadcastMessage";
        const date = new Date(msg.created);
        const currentDateStr = date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Add date separator if date changes
        if (previousDate !== currentDateStr) {
            html += `
                <div class="date-separator">
                    <span>${currentDateStr}</span>
                </div>
            `;
            previousDate = currentDateStr;
        }

        const timeString = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
        
        const messageText = msg.finalText || msg.text || '';
        const formattedText = messageText
            .replace(/\n/g, '<br>')
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/😊/g, '<span>😊</span>')
            .replace(/😇/g, '<span>😇</span>')
            .replace(/🤔/g, '<span>🤔</span>')
            .replace(/🗓️/g, '<span>🗓️</span>')
            .replace(/💙/g, '<span>💙</span>')
            .replace(/🙂/g, '<span>🙂</span>');

        html += `
            <div class="message ${isSent ? 'sent' : 'received'}">
                <div class="message-bubble">
				<div class="message-name ${!isSent?'hide':''}">
					${msg.operaterName === undefined ? "Bot" : msg.operaterName + "(" + msg.watiNumber+ ")" }
				</div>
                    ${formattedText}
                    <div class="message-time">
                        ${timeString}
                    </div>
                </div>
            </div>
        `;
    });

    html += `
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return html;
}

function watiLogsDataModal(mdata){
	//console.log('mdata :: ' + JSON.stringify(mdata));
	if(mdata.data!=undefined && mdata.data!=null){ 
		content = [];
		mdata.data.forEach(val => {
			logdata = {};
			logdata["userName"] = (val.userName) ? val.userName : "";
			logdata["name"] = (val.templateName) ? val.templateName : "";
			logdata["deliveredDateTime"] = (val.deliveredDatetime) ? val.deliveredDatetime : "";
			logdata["deliveredStatus"] = (val.deliveredStatus) ? val.deliveredStatus : "";
			logdata["reason"] = (val.reason) ? val.reason : "";
			logdata["broadcastName"] = (val.broadcastID) ? val.broadcastID : "";
			logdata["contactNo"] = (val.contactNo) ? val.contactNo : "";
			logdata["watiContactNo"] = (val.watiContactNo) ? val.watiContactNo : "";
			content.push(logdata);
		});
	}
	
	var html =
			`<style>
				#watiLogsTable {
					border-collapse: collapse;
					border-radius: 10px;
				}
				#watiLogsTable td, th {
					border: 1px solid #f7f7f7;
				}
			</style>
			<div id="watiLogsContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-xl" style='width: 80% !important;'>
					<div class="d-flex flex-wrap wati-wrapper">
						<div class="modal-content border-0 watiLogsTableDiv">
							<div class="modal-header py-1 bg-primary text-white">
								<h5 class="modal-title font-weight-bold">Wati Logs</h5>
								<button type="button" class="close text-white" onclick="selfModalHide('watiLogsContent')">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div class="modal-body pt-1">
								<div class="flex-grow-1">
									<form class="full" action="javascript:void(0);">
										<div class="full mb-1 mt-1 table-responsive">
											<table class="table" id="watiLogsTableData" style="font-size:14px;min-width:450px">
												<thead>
													<tr style='background-color:#E7F3FF'>
														<th class="border text-primary rounded-top-left-5">SNO</th>
														<th class="border text-primary rounded-top-left-5">Counsoler</th>
														<th class="border text-primary rounded-top-left-5">Template Name</th>
														<th class="border text-primary rounded-top-left-5">Broadcast ID</th>
														<th class="border text-primary rounded-top-left-5">Contact No</th>
														<th class="border text-primary">Delivered Date & Time</th>
														<th class="border text-primary">Delivered Status</th>
														<th class="border text-primary rounded-top-right-5">Reason</th>
													</tr>
												</thead>
												<tbody>`;
													if(content != null && content != ''){
														$.each(content, function(index, value){//console.log('val : ' + JSON.stringify(value));
															html+=
															`<tr>
																<td class="">`+(index+1)+`</td>
																<td class="">${value.userName} ${value.watiContactNo == "" || value.watiContactNo == "N/A"?"":"( "+value.watiContactNo+" )"} </td>
																<td class="">`+value.name+`</td>
																<td class="">`+value.broadcastName+`</td>
																<td class="">`+value.contactNo+`</td>
																<td class="">`+value.deliveredDateTime.slice(0, -5) +`</td>
																<td class="">`+value.deliveredStatus+`</td>
																<td class="">`+value.reason+`</td>
															</tr>
															`;
														});
													}
												html+=`</tbody>
											</table>  
										</div>	          
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		return html;
}


function swatiBroadcastContentModal(data){
	//console.log('all data : ' + JSON.stringify(data));
	var html=`<style>
				#watiBroadcastTable {
					border-collapse: collapse;
					border-radius: 10px;
				}
				#watiBroadcastTable td, th {
					border: 1px solid #f7f7f7;
				}
			</style>
			<div id="swatiBroadcastContent" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
				<div class="modal-dialog modal-xl">
					<div class="d-flex flex-wrap wati-wrapper">
						<div class="modal-content border-0 watiBroadcastTableDiv">
							<div class="modal-body pt-1">
								<div class="flex-grow-1">
									<div class="text-right full">
										<button type="button" class="close text-dark" onclick="selfModalHide('swatiBroadcastContent')">
											<span aria-hidden="true">×</span>
										</button>
									</div>
									<form class="full" action="javascript:void(0);">
										<div class="full mb-1 mt-1 table-responsive">
											<table class="table" id="watiBroadcastTable" style="font-size:14px;min-width:450px">
												<thead>
													<tr class="bg-primary">
														<th class="border text-white rounded-top-left-5">Sr. No.</th>
														<th class="border text-white">Name</th>
														<th class="border text-white text-center">View</th>
														<th class="border text-white text-center rounded-top-right-5">Send Broadcast</th>
													</tr>
												</thead>
												<tbody>`;
												var index = 1;
												if(data.messageTemplates){
													const dataArray = data.messageTemplates;
													dataArray.forEach(element => {
													var templateName = element.elementName;
													html+=`<tr>
															<td class="font-weight-bold">`+(index++)+`</td>
															<td class="font-weight-bold">`+element.elementName+`</td>
															<td class="text-center">
																<a href="javascript:void(0)" class="btn btn-outline-dark btn-sm" onclick="viewWatiTemplate(true, `+index+` ,'`+templateName+`')">
																	View<i class="fa fa-eye ml-1"></i>
																</a>
															</td>
															<td class="text-center">`;
																if(element.customParams.length==0){ //console.log('only those not having parameters');
																	html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																		Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																	</a>`;
																}else if(element.customParams.length==1 && element.customParams[0].paramName=='name'){ //console.log('only 1 name');
																	html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																		Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																	</a>`;
																}else if(element.customParams.length==2  && (element.customParams[0].paramName=='name' || element.customParams[0].paramName=='grade')){ //console.log('only name and grade');
																	html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																		Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																	</a>`;
																}else{
																	//console.log('other more data');
																}
															html+=`</td>
														</tr>`;
													});
												}
												html+=`</tbody>
											</table>  
										</div>	          
									</form>
								</div>
							</div>
						</div>
						<div id="previewWatiModal" class="modal-content border-0 wati-template hide-wati-template" style="max-width:300px;">
							<div class="modal-header py-1 text-white bg-primary">
								<p class="modal-title" id="modalLabel" class="fsize-1 m-0">Preview</p>
								<button type="button" class="close" onclick="viewWatiTemplate(false)"><span aria-hidden="true">&times;</span></button>
							</div>
							<div class="modal-body px-1">
								<div class="mobile-frame mx-auto">
									<div class="mobile-frame-top-bar">
										<div class="status-bar">
											<div class="time">`;
												var D = new Date();
												var H = D.getHours();
												var M = D.getMinutes(); 
													H>12?H=H -12:H;
													M<10?M='0'+M:M;
											html+=`${H}:${M}</div>
											<div class="icons">
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
													<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
												</svg>
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
													<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
												</svg>
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
													<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
												</svg>
											</div>
										</div>
										<div class="header">
											<span class="d-inline-block" style="line-height: 0px;">
												<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
													<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
												</svg>
											</span>
											<span class="circle">Wati</span>
											<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
												<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
													<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
												</svg>
											</span>
										</div>
									</div>
									<div class="screen">
										<div class="content">
											<div class="full" id="priviewTemplate" style="font-size:13px"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		return html;
}

function swatiBroadcastSendMobileModal(data){
	
	var html =
			`<style>
				#mbroadcastWatiSendTable {
					border-collapse: collapse;
				}
				#mbroadcastWatiSendTable td, th {
					border: 1px solid #f7f7f7;
				}
			</style>
			<div id="mswatiBroadcastSendThroughMobile" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true">
				<div class="modal-dialog modal-lg">
					<div class="d-flex flex-wrap wati-wrapper">
						<div class="modal-content border-0">
							<div class="modal-header py-1 bg-primary text-white">
								<div class="fsize-1 mb-0">
									<span class="">Selected Template: </span>
									<span class="" id="templateName"></span>
									<span class="" id="viewMethodCalling"></span>
								</div>
								<div class="d-flex align-items-center">
										<button type="button" class="btn btn-primary btn-sm d-flex align-items-center" style='gap:5px;' onclick="gotoBackWatiModal()">
											<svg style='width:15px;' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
											</svg>
											<span>Back</span>
										</button>
										<button id="mswatiBroadcastSendThroughMobileClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger" onclick="selfModalHide('mswatiBroadcastSendThroughMobile'); closeModalAndFlushData();">&times;</button>
									</div>
							</div>
							<div class="modal-body pt-1">
								<form id="sendWatiBroadcastMessage" class="full d-flex flex-column" action="javascript:void(0);">
									<div class="full mb-1 mt-1 table-responsive" style='max-height: 500px;overflow-y: auto;'>
										<table id="mbroadcastWatiSendTable" class="table" style="font-size:14px;min-width:450px;">
											<thead>
												<tr style='background-color:#E7F3FF'>
													<th style='width:60px;' class="rounded-top-left-5 text-primary">
														<span style='margin-left:-5px;' class="custom-checkbox custom-control d-inline-block" id="allcheckedDiv"> 
															<input type="checkbox" id="allchecked" value="" class="custom-control-input"> 
															<label class="custom-control-label bold" for="allchecked">All</label> 
														</span>
													</th>
													<th style='width:70px;' class="text-primary">Sr. No.</th>
													<th class="px-1 text-primary">Name</th>
													<th class="rounded-top-right-5 text-primary">Phone Number</th>
												</tr>
											</thead>
											<tbody>`;
											if(data.users != null && data.users != ''){
												$.each(data.users, function(index, value){
													var count = index + 1;
													if(value.mobileNo != null && value.mobileNo != ''){
														html+=`<tr id="esmsgcol_`+value.leadId+`">
															<td>
																<div class="custom-checkbox custom-control">
																	<input type="checkbox" name="chk-users-lead" id="`+value.leadId+`" value="`+value.leadId+`" class="custom-control-input checkToSend">
																	<label id="label_`+value.leadId+`" class="custom-control-label" for="`+value.leadId+`"></label>
																</div>
															</td>
															<td class="font-weight-bold">
																`+count+`
															</td>
															<td class="font-weight-bold">
																<input type="hidden" name="name" value="`+value.name+`" class="name">
																`+value.name+`
																<span class="stmsg" id="esmsg_`+value.leadId+`"></span> 
															</td>
															<td>
																<input type="hidden" name="mobileNo" value="`+value.mobileNo+`" class="mobileNo">
																`+value.phoneNumber+`
															</td>	
														</tr>`;
													}	
												});
											}
											html+=`</tbody>
										</table>  
									</div>`;
									html+=`
									<div class="d-flex justify-content-between align-items-center">
										<div id="selectedMessageCount">
											<span id="selectionCount" class="mb-2 bg-primary text-white px-3 p-2 rounded-5"></span>
										</div>
										<div id="confirm_btn_data"></div>
									</div>	
								</form>
							</div>
						</div>
					</div>

					<div id="previewWatiModal" class="modal-content border-0 wati-template hide-wati-template" style="max-width:300px;">
						<div class="modal-header text-white bg-primary" style='padding: 6.5px;'>
							<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
							<button type="button" class="close text-white" onclick="viewWatiTemplate(false)"><span aria-hidden="true">&times;</span></button>
						</div>
						<div class="modal-body px-1">
							<div class="mobile-frame mx-auto">
								<div class="mobile-frame-top-bar">
									<div class="status-bar">
										<div class="time">`;
											var D = new Date();
											var H = D.getHours();
											var M = D.getMinutes(); 
												H>12?H=H -12:H;
												M<10?M='0'+M:M;
										html+=`${H}:${M}</div>
										<div class="icons">
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
												<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
											</svg>
										</div>
									</div>
									<div class="header">
										<span class="d-inline-block" style="line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
												<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
											</svg>
										</span>
										<span class="circle">Wati</span>
										<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
												<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
											</svg>
										</span>
									</div>
								</div>
								<div class="screen">
									<div class="content">
										<div class="full" id="priviewTemplateSecond" style="font-size:13px"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		return html;
}
function watiContent(data){
	var html =  '';
	// $.each(data, function(index, value){
	// 	html+='<div class="main-card card mx-auto mb-3" style="max-width:300px;">'
	// 	+'<div class="card-body p-2">'
	// 		+'<img src="'+(value.header!=null?value.header.mediaFromPC:"")+'" class="w-100 mb-3" style="max-width:250px">'
	// 		+'<ul class="p-0">';
	// 			var list = value.bodyOriginal.split("\n");
	// 			$.each(list, function(i, item){
	// 				html+='<li class="'+(i<5? "mb-3":(i==15? "mb-3":""))+'">'+item+'</li>';
	// 			});
	// 		html+='</ul>'
	// 		+'<div class="mt-3">'
	// 			+value.footer
	// 		+'</div>'
	// 		+'<hr/>'
	// 		+'<div>'
	// 		+'</div>'
	// 	+'</div>'
	// +'</div>';
	// });
	
	return html;
}

//Custom Wati Templates List function

function customWatiTemplatesList(tdata){

	var html=
		`<style>
			#watiBroadcastTable {
				border-collapse: collapse;
				border-radius: 10px;
			}
			#watiBroadcastTable td, th {
				border: 1px solid #f7f7f7;
			}
		</style>
		<div id="mcustomWatiTemplatesList" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="d-flex flex-wrap wati-wrapper">
					<div class="modal-content border-0 watiBroadcastTableDiv">
						<div class="modal-header py-1 bg-primary text-white">
							<div class="">
								<p class="fsize-1 mb-0 font-weight-bold">Wati Broadcast</p>
							</div>
							<button type="button" class="close text-white" onclick="selfModalHide('mcustomWatiTemplatesList'); closeModalAndFlushData();">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div class="modal-body pt-1" style='max-height: 500px;overflow-y: auto;'>
							<div class="flex-grow-1">
								<form class="full" action="javascript:void(0);">
									<div class="full mb-1 mt-1 table-responsive">
										<table class="table" id="mwatiBroadcastTable" style="font-size:14px;min-width:450px">
											<thead>
												<tr style='background-color:#E7F3FF;'>
													<th style="width: 15%;color:#007EFF !important;" class="border text-white rounded-top-left-5">Sr. No.</th>
													<th style="width: 40%;color:#007EFF !important;" class="border text-white">Template Name</th>
													<th style="color:#007EFF !important;" class="border text-white text-center">View</th>
													<th style="color:#007EFF !important;" class="border text-white text-center rounded-top-right-5">Send Broadcast</th>
												</tr>
											</thead>
											<tbody>`;
											
											if(tdata.messageTemplates){
												var srNo = 1;
												$.each(tdata.messageTemplates, function(index, element) { //console.log('ALL DATA :: '+ JSON.stringify(element)); console.log('element.customParams :: '+ JSON.stringify(element.customParams));
													var templateName = element.elementName;
													if(element.status=="APPROVED"){
														html+=`<tr id="table_row_`+element.elementName+`">
																<td style="vertical-align: middle !important;" class="font-weight-bold">`+ srNo +`</td>
																<td style="vertical-align: middle !important;" class="font-weight-bold">`+element.elementName+`</td>
																<td style="vertical-align: middle !important;" class="text-center">
																	<a href="javascript:void(0)" class="btn btn-outline-dark btn-sm" onclick="viewWatiTemplate(true, `+index+`, '`+templateName+`')">
																		View<i class="fa fa-eye ml-1"></i>
																	</a>
																</td>
																<td style="vertical-align: middle !important;" class="text-center">`;
																	if(element.customParams.length==0){ 
																		html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																			Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																		</a>`;
																	}else if((element.customParams.length>0 && element.customParams.length<3) && (element.customParams.some(cpdata => cpdata['paramName'] == 'name') || element.customParams.some(cpdata => cpdata['paramName'] == 'grade'))){ 
																		html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																			Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																		</a>`;
																	}else if(element.customParams.length==1 && element.customParams[0].paramName=='name'){ 
																		html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																			Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																		</a>`;
																	}else if(element.customParams.length==1  && (element.customParams[0].paramName=='name' || element.customParams[0].paramName=='grade')){ 
																		html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																			Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																		</a>`;
																	}else if(element.customParams.length==1  && (element.customParams[0].paramName=='grade')){ 
																		html+=`<a href="javascript:void(0)" class="btn btn-primary btn-sm" onclick="sendWatiNotification(\'`+templateName+`\',`+index+`)">
																			Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																		</a>`;
																	}else{
																	}
																html+=`</td>
															</tr>`;
														srNo++;
													}
												});
											}
											html+=`</tbody>
										</table>  
									</div>	          
								</form>
							</div>
						</div>
					</div>
					<div id="previewWatiModal" class="modal-content border-0 wati-template hide-wati-template" style="max-width:300px;">
						<div class="modal-header py-1 text-white bg-primary">
							<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
							<button type="button" class="close text-white" onclick="viewWatiTemplate(false)"><span aria-hidden="true">&times;</span></button>
						</div>
						<div class="modal-body px-1">
							<div class="mobile-frame mx-auto">
								<div class="mobile-frame-top-bar">
									<div class="status-bar">
										<div class="time">`;
											var D = new Date();
											var H = D.getHours();
											var M = D.getMinutes(); 
												H>12?H=H -12:H;
												M<10?M='0'+M:M;
										html+=`${H}:${M}</div>
										<div class="icons">
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
												<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
											</svg>
										</div>
									</div>
									<div class="header">
										<span class="d-inline-block" style="line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
												<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
											</svg>
										</span>
										<span class="circle">Wati</span>
										<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
												<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
											</svg>
										</span>
									</div>
								</div>
								<div class="screen">
									<div class="content">
										<div class="full" id="priviewTemplate" style="font-size:13px"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function successFailedWatiMessagesModal(allData) {
	// console.log(" successFailedWatiMessagesModal data :: " + JSON.stringify(allData));
	
	sData = [];
	fData = [];
	if(allData!=null && allData!=undefined){
		//console.log('having data');
		allData.forEach(leadElement => {
			$("#wati_logs_link_"+leadElement.leadID).show();
			if(leadElement.status=='success'){
				sDataObj={};
				//console.log("leadElement at successFailedWatiMessagesModal :: " + leadElement);
				sDataObj["phoneNumber"]=leadElement.phoneNumber;
				sDataObj["leadId"]=leadElement.leadID;
				sDataObj["name"]=leadElement.name;
				sDataObj["mobileNo"]=leadElement.mobileNo;
				sDataObj["grade"]=leadElement.grade;
				sDataObj["leadVerifiedStatus"]=leadElement.leadVerifiedStatus;
				sData.push(sDataObj);
			}else{
				fDataObj={};
				//console.log("leadElement at successFailedWatiMessagesModal :: " + leadElement);
				fDataObj["phoneNumber"]=leadElement.phoneNumber;
				fDataObj["leadId"]=leadElement.leadID;
				fDataObj["name"]=leadElement.name;
				fDataObj["mobileNo"]=leadElement.mobileNo;
				fDataObj["grade"]=leadElement.grade;
				fDataObj["leadVerifiedStatus"]=leadElement.leadVerifiedStatus;
				fData.push(fDataObj);
			}
		});
	}	
	var html = 
			`
			<style>
				#successWatiTable, failedWatiTable {
					border-collapse: collapse;
					border-radius: 10px;
				}
				#successWatiTable td, th , #failedWatiTable td, th {
					border: 1px solid #f7f7f7;
				}
				#successWatiTable tr:nth-child(odd), #failedWatiTable tr:nth-child(odd) {
					background-color: #F7F7F7;
				}
			</style>
				<div id="successFailedWatiMessagesModal" class="modal fade bd-example-modal-lg fade-scale" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true">
					<div class="modal-dialog modal-lg">
						<div class="d-flex flex-wrap wati-wrapper">
							<div class="modal-content border-0">
								<div class="modal-header py-1 bg-primary text-white">
									<div class="fsize-1 mb-0">
										<span class="">Selected Template: </span>
										<span class="" id="templateNameSF"></span>
										<span class="" id="viewMethodCallingSF"></span>
									</div>
									<div class="d-flex align-items-center">
										<button type="button" class="btn btn-primary btn-sm d-flex align-items-center" style='gap:5px;' onclick="selfModalHide('successFailedWatiMessagesModal');gotoBackWatiModal()">
											<svg style='width:15px;' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
											</svg>
											<span>Back</span>
										</button>
										<button id="successFailedWatiMessagesModalClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger" onclick="selfModalHide('successFailedWatiMessagesModal'); closeModalAndFlushData();">&times;</button>
									</div>
								</div>

								<div class="modal-body pt-1" style='max-height: 500px;overflow-y: auto;'>
									<div class="d-flex flex-column" style='gap: 10px;'>
										<div id="successWatiDiv" class="border border-success rounded-10">
											<div class="d-flex justify-content-between align-items-center">
												<p class="m-0 p-1 d-flex align-items-center" style='gap:5px;'>
													<span style='padding: 1px 5px;font-size:10px;' class="bg-primary rounded-5 text-white">`+ sData.length +`</span>
													<span class="font-weight-bold">Message Sent</span>
													<i class="fa fa-solid fa-check bg-success text-white rounded-circle" style='width:16px;height:16px;text-align:center;padding: 3px;font-size: 10px;'></i>
												</p>
												<i id='chevron_success' class="fa fa-solid fa-chevron-down text-success px-2"></i>
											</div>	
											<div id='successWatiTableDiv' class="full table-responsive px-1 font-12">
												<table id="successWatiTable" class="table mt-1 mb-0" style="font-size:14px;min-width:450px;">
													<thead>
														<tr style='background-color:#E7F3FF'>
															<th style='width:80px;' class="rounded-top-left-5 px-1 text-primary">Sr. No.</th>
															<th class="px-1 text-primary">Name</th>
															<th class="rounded-top-right-5 text-primary">Phone Number</th>
														</tr>
													</thead>
													<tbody class="lead-table-css">`
													if(sData != null){
															$.each(sData, function(index, value){
																var count = index + 1;
																if(value.mobileNo != null && value.mobileNo != ''){
																	html+=`<tr id="esmsgcol_`+value.leadId+`">
																		<td>
																			<p class="m-0 font-weight-bold font-12">`+count+`</p>
																		</td>
																		<td>
																			<p class="m-0 font-weight-bold font-12"><span id="esmsg_`+value.leadId+`">`+value.name+`</span></p>
																		</td>
																		<td>
																			<p class="m-0 font-12">`+value.phoneNumber+`</p>
																		</td>
																	</tr>`;
																}
															});
														}
													html+=`</tbody>
												</table>
											</div>
										</div>
										
										<form id="resendWatiMessages" class="full d-flex flex-column" action="javascript:void(0);">
											<div id='failedWatiDiv' class='border border-danger rounded-10'>
												<div class="d-flex justify-content-between align-items-center">
													<p class="m-0 p-1 d-flex align-items-center" style='gap:5px;'>
														<span style='padding: 1px 5px;font-size:10px;' class="bg-danger rounded-5 text-white">`+ fData.length +`</span>
														<span class="font-weight-bold">Message Not Sent</span>
														<i class="fa fa-solid fa-exclamation text-white bg-danger rounded-circle" style='width:16px;height:16px;text-align:center;padding: 3px;font-size: 10px;'></i>
													</p>
													<i id='chevron_failed' class="fa fa-solid fa-chevron-down text-danger px-2"></i>
												</div>

												<div id='failedWatiTableDiv' class="full table-responsive px-1 font-12">
													<table id="failedWatiTable" class="table mt-1 mb-0" style="font-size:14px;min-width:450px;">
														<thead>
															<tr style='background-color:#E7F3FF'>
																<th style='width:40px;' class="rounded-top-left-5 text-primary">
																	<span style='margin-left:-5px;' class="custom-checkbox custom-control d-inline-block" id="allcheckedDivFailed"> 
																		<input type="checkbox" id="allcheckedFailed" value="" class="custom-control-input"> 
																		<label class="custom-control-label bold" for="allcheckedFailed">All</label> 
																	</span>
																</th>
																<th style='width:50px;' class="text-primary">Sr. No.</th>
																<th class="px-1 text-primary">Name</th>
																<th class="rounded-top-right-5 text-primary">Phone Number</th>
															</tr>
														</thead>
														<tbody class="lead-table-css">`
															if(fData != null){
																$.each(fData, function(index, value){
																	var count = index + 1;
																	if(value.mobileNo != null && value.mobileNo != ''){
																		html+=`<tr id="esmsgcol_`+value.leadId+`">
																			<td>
																				<div class="custom-checkbox custom-control">
																					<input type="checkbox" name="chk-users-lead-resend" id="failed_`+value.leadId+`" value="`+value.leadId+`" class="custom-control-input checkToSendFailed">
																					<label id="label_failed_`+value.leadId+`" class="custom-control-label" for="failed_`+value.leadId+`"></label>
																				</div>
																			</td>
																			<td class="font-weight-bold">
																				`+count+`
																			</td>
																			<td class="font-weight-bold">
																				<input type="hidden" name="name" value="`+value.name+`" class="name font-12">
																				`+value.name+`
																			</td>
																			<td>
																			<input type="hidden" name="mobileNo" value="`+value.mobileNo+`" class="mobileNo font-12">
																				`+value.phoneNumber+`
																			</td>	
																		</tr>`;
																	}
																});
															}
														html+=`</tbody>
													</table>  
													<div id="selectedMessageCountOnFailed" class="my-2">
														<span id="selectionCountOnFailed" class="mb-2 bg-primary text-white px-3 p-2 rounded-5 font-12"></span>
													</div>
												</div>
											</div>
											<div id="resendWatiMessagesData">Resend</div>
										</form>
									</div>
								</div>
							</div>
						</div>

						<div id="previewWatiModal" class="modal-content border-0 wati-template hide-wati-template" style="max-width:300px;">
							<div class="modal-header text-white bg-primary" style='padding: 6.5px;'>
								<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
								<button type="button" class="close text-white" onclick="viewWatiTemplate(false)"><span aria-hidden="true">&times;</span></button>
							</div>
							<div class="modal-body px-1">
								<div class="mobile-frame mx-auto">
									<div class="mobile-frame-top-bar">
										<div class="status-bar">
											<div class="time">`;
												var D = new Date();
												var H = D.getHours();
												var M = D.getMinutes(); 
													H>12?H=H -12:H;
													M<10?M='0'+M:M;
											html+=`${H}:${M}</div>
											<div class="icons">
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
													<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
												</svg>
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
													<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
												</svg>
												<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
													<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
												</svg>
											</div>
										</div>
										<div class="header">
											<span class="d-inline-block" style="line-height: 0px;">
												<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
													<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
												</svg>
											</span>
											<span class="circle">Wati</span>
											<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
												<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
													<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
												</svg>
											</span>
										</div>
									</div>
									<div class="screen">
										<div class="content">
											<div class="full" id="priviewTemplateThird" style="font-size:13px"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>`;
		return html;
}

function zadarmaLogsDataModal(data) {
	let html = `
		<style>
			#zadarmaLogsTable {
				border-collapse: collapse;
				border-radius: 10px;
			}
			#zadarmaLogsTable td, th {
				border: 1px solid #f7f7f7;
			}
		</style>
		<div id="zadarmaLogsContent" class="modal fade bd-example-modal-lg fade-scale" role="dialog" aria-labelledby="zadarmaLogsLabel" aria-hidden="true">
			<div class="modal-dialog modal-xl" style='width: 80% !important;'>
				<div class="d-flex flex-wrap zadarma-wrapper">
					<div class="modal-content border-0 zadarmaLogsTableDiv">
						<div class="modal-header py-1 bg-primary text-white">
							<h5 class="modal-title font-weight-bold">Zadarma Logs</h5>
							<button type="button" class="close text-white" onclick="selfModalHide('zadarmaLogsContent')">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div class="modal-body pt-1">
							<div class="flex-grow-1">
								<form class="full" action="javascript:void(0);">
									<div class="full mb-1 mt-1 table-responsive" style="max-height:80vh !important;">
										<table class="table" id="zadarmaLogsTableData" style="font-size:14px; min-width:450px">
											<thead style="position:sticky;top:0;z-index:10;">
												<tr style='background-color:#E7F3FF'>
													<th class="border text-primary">S.No.</th>
													<th class="border text-primary">Caller</th>
													<th class="border text-primary">Dailled No.</th>
													<th class="border text-primary">Type</th>
													<th class="border text-primary">Call Start</th>
													<th class="border text-primary">Duration (in sec)</th>
													<th class="border text-primary">Status</th>
													<th class="border text-primary">Action</th>
												</tr>
											</thead>
											<tbody>`;
	
	if (data.length > 0) {
		data.forEach((value, index) => {
			html += `
				<tr>
					<td>${index + 1}</td>
					<td>${value.caller}</td>
					<td>${value.dialledNumber}</td>
					<td>${value.type == "I" ? "Incoming" : "Outgoing"}</td>
					<td>${changeDateFormat(new Date(value.callStart), 'MMM-dd-yyyy hh:mm:ss')}</td>
					<td>${value.seconds}</td>
					<td style="text-transform: capitalize;">${value.status}</td>
					<td>`;
						if(value.recordings != null || value.recordings != undefined){
							html+=`<button onclick="viewCallRecording('${value.recordings}');" class='btn btn-primary btn-sm'>View Recording</button>`;
						}else{
							html+=``;
						}
					html+=`</td>
				</tr>`;
		});
	} else {
		html += `<tr><td colspan="8" class="text-center">No logs available</td></tr>`;
	}
	html += `</tbody>
										</table>
									</div>	          
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function customEmailTemplatesList(tdata) {
	var html=
		`<style>
			#emailBroadcastTable {
				border-collapse: collapse;
				border-radius: 10px;
			}
			#emailBroadcastTable td, th {
				border: 1px solid #f7f7f7;
			}
		</style>
		<div id="customEmailTemplatesList" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true">
			<div class="modal-dialog" style="width:40%">
				<div class="d-flex flex-wrap email-wrapper">
					<div class="modal-content border-0 emailBroadcastTableDiv">
						<div class="modal-header py-1 bg-primary text-white">
							<div class="">
								<p class="fsize-1 mb-0 font-weight-bold">Email Broadcast</p>
							</div>
							<button type="button" class="close text-white" onclick="selfModalHide('customEmailTemplatesList'); closeModalAndFlushData();">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div class="modal-body pt-1" style='max-height: 500px;overflow-y: auto;'>
							<div class="flex-grow-1">
								<form class="full" action="javascript:void(0);">
									<div class="full mb-1 mt-1 table-responsive">
										<table class="table" id="emailBroadcastTable" style="font-size:14px;min-width:450px">
											<thead>
												<tr style='background-color:#E7F3FF;'>
													<th style="width: 15%;color:#007EFF !important;" class="border text-white rounded-top-left-5">Sr. No.</th>
													<th style="width: 40%;color:#007EFF !important;" class="border text-white">Template Name</th>
													<th style="color:#007EFF !important;" class="border text-white text-center">View</th>
													<th style="color:#007EFF !important;" class="border text-white text-center rounded-top-right-5">Send Broadcast</th>
												</tr>
											</thead>
											<tbody>`;
											
											if(tdata.templates){
												const userFirstName = USER_FULL_NAME.split(" ")[0];
												let indexValue = 0;
												$.each(tdata.templates, function(index, element) {
													if (element.name.toLowerCase().includes(userFirstName.toLowerCase())) {
														indexValue++
														var templateName = element.name;
														let subject = element.subject;
														html+=`<tr id="table_row_`+templateName+`">
															<td style="vertical-align: middle !important;" class="font-weight-bold">`+ indexValue+`</td>
															<td style="vertical-align: middle !important;" class="font-weight-bold">`+templateName+`</td>
															<td style="vertical-align: middle !important;" class="text-center">
																<a href="javascript:void(0)" class="btn btn-outline-dark btn-sm" style="text-decoration: none !important;" onclick="viewEmailTemplate(true, `+index+`, '`+templateName+`')">
																	View<i class="fa fa-eye ml-1"></i>
																</a>
															</td>
															<td style="vertical-align: middle !important;" class="text-center">
																<a href="javascript:void(0)" class="btn btn-primary btn-sm text-white" style="text-decoration: none !important;" onclick="sendEmailNotification(\'`+btoa(templateName)+`\','`+btoa(subject)+`',`+index+`,\'`+element.id+`\')">
																	Select<i class="pe-7s-paper-plane font-size-lg ml-1"></i>
																</a>
															</td>
														</tr>`;
													}
												});
											}
											html+=`</tbody>
										</table>  
									</div>	          
								</form>
							</div>
						</div>
					</div>
					
					<div id="previewEmailModal" class="modal-content border-0 email-template hide-email-template" style="max-width:450px;">
						<div class="modal-header py-1 text-white bg-primary">
							<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
							<button type="button" class="close text-white" onclick="viewEmailTemplate(false)"><span aria-hidden="true">&times;</span></button>
						</div>
						<div class="modal-body px-1">
							<div class="mx-auto">
								${/*<div class="mobile-frame-top-bar">
									<div class="status-bar">
										<div class="time">`;
											var D = new Date();
											var H = D.getHours();
											var M = D.getMinutes(); 
												H>12?H=H -12:H;
												M<10?M='0'+M:M;
										html+=`${H}:${M}</div>
										<div class="icons">
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
												<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
											</svg>
										</div>
									</div>
									<div class="header">
										<span class="d-inline-block" style="line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
												<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
											</svg>
										</span>
										<span class="circle">Email</span>
										<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
												<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
											</svg>
										</span>
									</div>
								</div>*/''}
								<div class="screen">
									<div class="content">
										<div class="full" id="previewEmailTemplate" style="font-size:13px"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function emailBroadcastSendModal(data){
	var html =
			`<style>
				#emailBroadcastSendTable {
					border-collapse: collapse;
				}
				#emailBroadcastSendTable td, th {
					border: 1px solid #f7f7f7;
				}
			</style>
			<div id="emailBroadcastSendModal" class="modal fade bd-example-modal-lg fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" data-backdrop="static" aria-hidden="true">
				<div class="modal-dialog" style="width:40%;">
					<div class="d-flex flex-wrap email-wrapper">
						<div class="modal-content border-0">
							<div class="modal-header py-1 bg-primary text-white align-items-center">
								<div class="d-flex fsize-1 mb-0 align-items-center">
									<button type="button" class="btn mr-2 btn-primary btn-sm d-flex align-items-center" style='gap:5px;' onclick="gotoBackEmailModal()">
										<svg style='width:15px;' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
										</svg>
										<span>Back</span>
									</button>
									<span class="">Selected Template: </span>
									<span class="" id="templateNameEmail"></span>
									<span class="" id="viewMethodCallingEmail"></span>
								</div>
								<div class="d-flex align-items-center">
									<button id="emailBroadcastSendModalClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger" onclick="selfModalHide('emailBroadcastSendModal'); closeModalAndFlushData();">&times;</button>
								</div>
								</div>
							<div class="modal-body pt-1">
								<form id="sendEmailBroadcastMessage" class="full d-flex flex-column" action="javascript:void(0);">
									<div class="full mb-1 mt-1 table-responsive" style='max-height: 500px;overflow-y: auto;'>
										<table id="emailBroadcastSendTable" class="table" style="font-size:14px;min-width:450px;">
											<thead>
												<tr style='background-color:#E7F3FF'>
													<th style='width:60px;' class="rounded-top-left-5 text-primary">
														<span style='margin-left:-5px;' class="custom-checkbox custom-control d-inline-block" id="allcheckedEmailDiv"> 
															<input type="checkbox" id="allCheckedEmail" value="" class="custom-control-input"> 
															<label class="custom-control-label bold" for="allCheckedEmail">All</label> 
														</span>
													</th>
													<th style='width:70px;' class="text-primary">Sr. No.</th>
													<th class="px-1 text-primary">Name</th>
													<th class="rounded-top-right-5 text-primary">Email</th>
												</tr>
											</thead>
											<tbody>`;
											if(data.users != null && data.users != ''){
												$.each(data.users, function(index, value){
													var count = index + 1;
													if(value.email != null && value.email != ''){
														html+=`<tr id="esmsgcol_`+value.leadId+`">
															<td>
																<div class="custom-checkbox custom-control">
																	<input type="checkbox"
																		name="chk-users-lead-email"
																		id="` + value.leadId + `"
																		value="` + value.leadId + `"
																		data-email="` + value.email + `"
																		data-name="` + value.name + `"
																		data-grade="` + value.grade + `"
																		data-leadVerifiedStatus="` + value.leadVerifiedStatus + `"
																		data-mobile="` + value.mobileNo + `"
																		data-phone="` + value.phoneNumber + `"
																		data-isdcode="` + value.isdCode + `"
																		class="custom-control-input checkToSendEmail"
																	>
																	<label id="label_email_`+value.leadId+`" class="custom-control-label" for="`+value.leadId+`"></label>
																</div>
															</td>
															<td class="font-weight-bold">
																`+count+`
															</td>
															<td class="font-weight-bold">
																<input type="hidden" name="name" value="`+value.name+`" class="name">
																`+value.name+`
																<span class="stmsg" id="esmsg_`+value.leadId+`"></span> 
															</td>
															<td>
																<input type="hidden" name="email" value="`+value.email+`" class="email">
																`+value.email+`
															</td>	
														</tr>`;
													}	
												});
											}
											html+=`</tbody>
										</table>  
									</div>`;
									html+=`
									<div class="d-flex justify-content-between align-items-center">
										<div id="selectedMessageCountEmail">
											<span id="selectionCountEmail" class="mb-2 bg-primary text-white px-3 p-2 rounded-5"></span>
										</div>
										<div class="d-flex justify-content-center align-items-center">
											<input type="radio" name="mailBroadcastTime" value="now" checked><p class="mb-0 ml-1"> Send Now </p>
											<input type="radio" name="mailBroadcastTime" class="ml-3" value="bestTime"><p class="mb-0 ml-1"> Send At Best Time </p>
										</div>
										<div id="confirm_btn_data_email"></div>
									</div>	
								</form>
							</div>
						</div>
					</div>

					<div id="previewEmailModalSecond" class="modal-content border-0 email-template hide-email-template" style="max-width:450px;">
						<div class="modal-header text-white bg-primary" style='padding: 6.5px;'>
							<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
							<button type="button" class="close text-white" onclick="viewEmailTemplate(false)"><span aria-hidden="true">&times;</span></button>
						</div>
						<div class="modal-body px-1">
							<div class="mx-auto">
								${/*<div class="mobile-frame-top-bar">
									<div class="status-bar">
										<div class="time">`;
											var D = new Date();
											var H = D.getHours();
											var M = D.getMinutes(); 
												H>12?H=H -12:H;
												M<10?M='0'+M:M;
										html+=`${H}:${M}</div>
										<div class="icons">
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
												<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
											</svg>
											<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
												<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
											</svg>
										</div>
									</div>
									<div class="header">
										<span class="d-inline-block" style="line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
												<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
											</svg>
										</span>
										<span class="circle">Email</span>
										<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
											<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
												<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
											</svg>
										</span>
									</div>
								</div>*/''}
								<div class="screen">
									<div class="content">
										<div class="full" id="previewEmailTemplateSecond" style="font-size:13px"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`;
		return html;
}

function successFailedEmailMessagesModal(allData) {
	var html = 
		`<div class="modal-dialog" style="width:40%;">
			<div class="d-flex flex-wrap email-wrapper">
				<div class="modal-content border-0">
					<div class="modal-header py-1 bg-primary text-white align-items-center">
						<div class="d-flex align-items-center fsize-1 mb-0">
							<button type="button" class="btn btn-primary btn-sm d-flex align-items-center mr-2" style='gap:5px;' onclick="selfModalHide('successFailedEmailMessagesModal');gotoBackEmailModal()">
								<svg style='width:15px;' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
								</svg>
								<span>Back</span>
							</button>
							<span class="">Selected Template: </span>
							<span class="" id="templateNameEmailSF"></span>
							<span class="" id="viewMethodCallingEmailSF"></span>
						</div>
						<div class="d-flex align-items-center">
							<button id="successFailedEmailMessagesModalClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger" onclick="selfModalHide('successFailedEmailMessagesModal'); closeModalAndFlushData();">&times;</button>
						</div>
					</div>

					<div class="modal-body pt-1" style='max-height: 500px;overflow-y: auto;'>
						<div id="preSuccessFailedDiv" style="display:none !important;">
							<table id="preSuccessFailedTable" class="table mt-1 mb-0" style="font-size:14px;min-width:450px;">
								<thead>
									<tr style='background-color:#E7F3FF'>
										<th style='width:80px;' class="rounded-top-left-5 px-1 text-primary">Sr. No.</th>
										<th class="px-1 text-primary">Name</th>
										<th class="rounded-top-right-5 text-primary">Email</th>
									</tr>
								</thead>
								<tbody class="lead-table-css">`
									if(allData != null){
										$.each(allData.users, function(index, value){
											var count = index + 1;
											if(value.phoneNumber != null && value.phoneNumber != ''){
												var statusIcon = `<i id="statusIcon_${value.leadId}" class="fa fa-spinner text-warning ml-2 fancytree-helper-spin"></i>`;
												if (value.status === "success") {
													statusIcon = `<i id="statusIcon_${value.leadId}" class="fa fa-check-circle text-success ml-2"></i>`;
												}
												html+=`<tr>
													<td>
														<p class="m-0 font-weight-bold font-12">`+count+`</p>
													</td>
													<td>
														<p class="m-0 font-weight-bold font-12"><span id="esmsg_`+value.leadId+`">`+value.name+`</span></p>
													</td>
													<td>
														<p class="m-0 font-12">` + value.email + statusIcon + `</p>
													</td>
												</tr>`;
											}
										});
									}
								html+=`</tbody>
							</table>
						</div>

						<div id="finalSuccessFailedDiv" class="d-flex flex-column" style='gap: 10px;'>
							<div id="successEmailDiv" class="border border-success rounded-10">
								<div class="d-flex justify-content-between align-items-center">
									<p class="m-0 p-1 d-flex align-items-center" style='gap:5px;'>
										<span id="successfulEmailsCount" style='padding: 1px 5px;font-size:10px;' class="bg-primary rounded-5 text-white">`+ successfulEmails.length +`</span>
										<span class="font-weight-bold">Message Sent</span>
										<i class="fa fa-solid fa-check bg-success text-white rounded-circle" style='width:16px;height:16px;text-align:center;padding: 3px;font-size: 10px;'></i>
									</p>
									<i id='chevron_success_email' class="fa fa-solid fa-chevron-down text-success px-2"></i>
								</div>	
								<div id="successEmailTableDiv" class="full table-responsive px-1 font-12">
									
								</div>
							</div>
							
							<form id="resendEmailMessages" class="full d-flex flex-column" action="javascript:void(0);">
								<div id='failedEmailDiv' class='border border-danger rounded-10'>
									<div class="d-flex justify-content-between align-items-center">
										<p class="m-0 p-1 d-flex align-items-center" style='gap:5px;'>
											<span id="failedEmailsCount" style='padding: 1px 5px;font-size:10px;' class="bg-danger rounded-5 text-white">`+ failedOrOtherEmails.length +`</span>
											<span class="font-weight-bold">Message Not Sent</span>
											<i class="fa fa-solid fa-exclamation text-white bg-danger rounded-circle" style='width:16px;height:16px;text-align:center;padding: 3px;font-size: 10px;'></i>
										</p>
										<i id='chevron_failed_email' class="fa fa-solid fa-chevron-down text-danger px-2"></i>
									</div>

									<div id="failedEmailTableDiv" class="full table-responsive px-1 font-12"></div>
								</div>
								${(failedOrOtherEmails.length > 0)? '<div id="resendEmailMessagesData">Resend</div>' :''}
							</form>
						</div>
					</div>
				</div>
			</div>

			<div id="previewEmailModalThird" class="modal-content border-0 email-template hide-email-template" style="max-width:450px;">
				<div class="modal-header text-white bg-primary" style='padding: 6.5px;'>
					<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
					<button type="button" class="close text-white" onclick="viewEmailTemplate(false)"><span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body px-1">
					<div class="mx-auto">
						${/*<div class="mobile-frame-top-bar">
							<div class="status-bar">
								<div class="time">`;
									var D = new Date();
									var H = D.getHours();
									var M = D.getMinutes(); 
										H>12?H=H -12:H;
										M<10?M='0'+M:M;
								html+=`${H}:${M}</div>
								<div class="icons">
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
										<path d="M576 0c17.7 0 32 14.3 32 32l0 448c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-448c0-17.7 14.3-32 32-32zM448 96c17.7 0 32 14.3 32 32l0 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-352c0-17.7 14.3-32 32-32zM352 224l0 256c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32s32 14.3 32 32zM192 288c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-160c0-17.7 14.3-32 32-32zM96 416l0 64c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32s32 14.3 32 32z"/>
									</svg>
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 576 512">
										<path d="M464 160c8.8 0 16 7.2 16 16l0 160c0 8.8-7.2 16-16 16L80 352c-8.8 0-16-7.2-16-16l0-160c0-8.8 7.2-16 16-16l384 0zM80 96C35.8 96 0 131.8 0 176L0 336c0 44.2 35.8 80 80 80l384 0c44.2 0 80-35.8 80-80l0-16c17.7 0 32-14.3 32-32l0-64c0-17.7-14.3-32-32-32l0-16c0-44.2-35.8-80-80-80L80 96zm368 96L96 192l0 128 352 0 0-128z"/>
									</svg>
									<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 640 512">
										<path d="M54.2 202.9C123.2 136.7 216.8 96 320 96s196.8 40.7 265.8 106.9c12.8 12.2 33 11.8 45.2-.9s11.8-33-.9-45.2C549.7 79.5 440.4 32 320 32S90.3 79.5 9.8 156.7C-2.9 169-3.3 189.2 8.9 202s32.5 13.2 45.2 .9zM320 256c56.8 0 108.6 21.1 148.2 56c13.3 11.7 33.5 10.4 45.2-2.8s10.4-33.5-2.8-45.2C459.8 219.2 393 192 320 192s-139.8 27.2-190.5 72c-13.3 11.7-14.5 31.9-2.8 45.2s31.9 14.5 45.2 2.8c39.5-34.9 91.3-56 148.2-56zm64 160a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z"/>
									</svg>
								</div>
							</div>
							<div class="header">
								<span class="d-inline-block" style="line-height: 0px;">
									<svg xmlns="http://www.w3.org/2000/svg" width="17px" fill="#fff" viewBox="0 0 448 512">
										<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
									</svg>
								</span>
								<span class="circle">Email</span>
								<span class="d-inline-block ml-auto" style="margin-left: auto;line-height: 0px;">
									<svg xmlns="http://www.w3.org/2000/svg" width="4px" fill="#fff" viewBox="0 0 128 512">
										<path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/>
									</svg>
								</span>
							</div>
						</div>*/''}
						<div class="screen">
							<div class="content">
								<div class="full" id="previewEmailTemplateThird" style="font-size:13px"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function successEmailTableContent(){
	var html=
		`<table id="successEmailTable" class="table mt-1 mb-0" style="font-size:14px;min-width:450px;">
			<thead>
				<tr style='background-color:#E7F3FF'>
					<th style='width:80px;' class="rounded-top-left-5 px-1 text-primary">Sr. No.</th>
					<th class="px-1 text-primary">Name</th>
					<th class="rounded-top-right-5 text-primary">Email</th>
				</tr>
			</thead>
			<tbody class="lead-table-css">`
				$.each(successfulEmails, function(index, value){
					var count = index + 1;
					if(value.email != null && value.email != ''){
						html+=`<tr id="esmsgcol_`+value.leadId+`">
							<td>
								<p class="m-0 font-weight-bold font-12">`+count+`</p>
							</td>
							<td>
								<p class="m-0 font-weight-bold font-12"><span id="esmsg_`+value.leadId+`">`+value.name+`</span></p>
							</td>
							<td>
								<p class="m-0 font-12">`+value.email+`</p>
							</td>
						</tr>`;
					}
				});
			html+=`</tbody>
		</table>`
	return html;
}

function failedEmailTableContent(){
	var html=
		`<table id="failedEmailTable" class="table mt-1 mb-0" style="font-size:14px;min-width:450px;">
			<thead>
				<tr style='background-color:#E7F3FF'>
					<th style='width:40px;' class="rounded-top-left-5 text-primary">
						<span style='margin-left:-5px;' class="custom-checkbox custom-control d-inline-block" id="allcheckedEmailDivFailed"> 
							<input type="checkbox" id="allCheckedFailedEmail" value="" class="custom-control-input"> 
							<label class="custom-control-label bold" for="allCheckedFailedEmail">All</label> 
						</span>
					</th>
					<th style='width:70px;' class="text-primary">Sr. No.</th>
					<th class="px-1 text-primary">Name</th>
					<th class="rounded-top-right-5 text-primary">Email</th>
				</tr>
			</thead>
			<tbody class="lead-table-css">`
				$.each(failedOrOtherEmails, function(index, value){
					var count = index + 1;
					if(value.email != null && value.email != ''){
						html+=`<tr id="esmsgcol_`+value.leadId+`">
							<td>
								<div class="custom-checkbox custom-control">
									<input type="checkbox" name="chk-users-lead-email-resend" id="failed_`+value.leadId+`" value="`+value.leadId+`" data-email="`+value.email+`" class="custom-control-input checkToSendEmailFailed">
									<label id="label_failed_`+value.leadId+`" class="custom-control-label" for="failed_`+value.leadId+`"></label>
								</div>
							</td>
							<td class="font-weight-bold">
								`+count+`
							</td>
							<td class="font-weight-bold">
								<input type="hidden" name="name" value="`+value.name+`" class="name font-12">
								`+value.name+`
							</td>
							<td>
							<input type="hidden" name="email" value="`+value.email+`" class="email font-12">
								`+value.email+`
							</td>	
						</tr>`;
					}
				});
			html+=`</tbody>
		</table>
		<div id="selectedMessageCountOnFailedEmail" class="my-2">
			<span id="selectionCountOnFailedEmail" class="mb-2 bg-primary text-white px-3 p-2 rounded-5 font-12"></span>
		</div>`;
	return html;
}

function emailBroadcastLogsModal(data, name, email) {
	let html = `
		<style>
			#emailBroadcastLogsModal {
				border-collapse: collapse;
				border-radius: 10px;
			}
			#emailBroadcastLogsModal td, th {
				border: 1px solid #f7f7f7;
			}
		</style>
		<div id="emailBroadcastLogsModal" class="modal fade fade-scale" role="dialog" aria-labelledby="emailBroadcastLogs" aria-hidden="true">
			<div class="modal-dialog" style='width: 70%;'>
				<div class="d-flex flex-wrap email-wrapper">
					<div class="modal-content border-0">
						<div class="modal-header py-1 bg-primary text-white">
							<h5 class="modal-title">Email Broadcast Logs </h5>
							<button type="button" class="close text-white" onclick="selfModalHide('emailBroadcastLogsModal')">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div class="modal-body pt-1">
							<div class="flex-grow-1">
								<div class="full mb-1 mt-1 table-responsive" style="max-height:80vh !important;">
									<table class="table" id="emailBroadcastLogsTableData" style="font-size:14px; min-width:450px">
										<thead style="position:sticky;top:0;z-index:10;">
											<tr style='background-color:#E7F3FF'>
												<th class="border text-primary">S.No.</th>
												<th class="border text-primary">Sender</th>
												<th class="border text-primary">Email Subject</th>
												<th class="border text-primary">Sent Time</th>
												<th class="border text-primary">Action</th>
											</tr>
										</thead>
										<tbody>`;
											if(data.length > 0){
												$.each(data, function(index, item){
													var parsedData = JSON.parse(data[index])
													html+=`<tr>
														<td>${index + 1}</td>
														<td>${parsedData.senderName}</td>
														<td>${parsedData.subject}</td>
														<td>${parsedData.time}</td>
														<td>
															<button class="btn btn-primary btn-sm" onclick="getEmailBroadcastLogsTemplate(${parsedData.actionExecutionId},'${email}')">View Template</button>
														</td>
													<tr>`
												})
											}else{
												html+=`<tr colspan="5">No Email Logs Found</tr>`
											}
										html+=`</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<div id="emailBroadcastLogsTemplateWrapper"></div> 
				</div>
			</div>
		</div>`;
	return html;
}

function emailBroadcastLogsTemplateContent(){
	var html=
		`<div id="emailBroadcastLogsTemplate" class="modal fade fade-scale" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-md" style='width: 80% !important;'>
				<div  class="modal-content border-0 email-template" style="max-width:450px;">
					<div class="modal-header py-1 text-white bg-primary">
						<p class="modal-title fsize-1 m-0 font-weight-bold" id="modalLabel">Preview</p>
						<button type="button" class="close text-white" onclick="viewEmailTemplate(false)"><span aria-hidden="true">&times;</span></button>
					</div>
					<div class="modal-body px-1">
						<div class="mx-auto">
							<div class="screen">
								<div class="content">
									<div class="full" id="emailBroadcastLogsTemplatePreview" style="font-size:13px"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function sendConfirmationModal(functionName){
	var html =
		`<div class="modal fade" id="sendConfirmationModal">
			<div class="modal-dialog modal-sm" role="document" style="box-shadow: none; width: 450px; max-width: 100%; margin-top: 8%;">
				<div class="modal-content text-center">
					<div class="modal-header justify-content-center bg-primary" style="width: 100% !important; padding: 0 0 !important; height: 45px; border: none;"></div>
					<div class="modal-body delete-modal">
						<p class="heading" style="color: #027FFF; font-family: arial; font-size: 18px; line-height: 28px; letter-spacing: 0.3px;">Are you sure you want to send this data?</p>
					</div>
					<div class="modal-footer text-center" style="border: none; padding: 0; margin-bottom: 15px;">
						<div class="text-center" style="margin: 0 auto;">
							<button onclick="${functionName}" type="button" class="btn mr-1" style="color: #027FFF !important; border: 1px solid #027FFF !important; background: transparent !important;">Yes</button>
							<button type="button" class="btn text-white" style="background:#027FFF" data-dismiss="modal">No</button>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}