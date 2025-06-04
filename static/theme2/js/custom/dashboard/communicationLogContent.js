function getCommunicationLogContent(){
	var html = 
	'<div class="full">'
		+getAddCommunicationLogForm()
	+'</div>'
	+'<div class="full">'
		+'<hr/>'
		+getAddCommunicationLogTable()
	+'</div>'
	+getCommunicationAttchFileModal();
	return html;
}

function getAddCommunicationLogForm(){
	var html =
		'<form id="communicationLogForm">'
			+'<div class="row">'
				+'<div class="col-lg-7 col-md-6 col-sm-12 col-12">'
					+'<div class="position-relative form-group">'
						+'<label for="title" class="">Title</label>'
						+'<input name="logTitle" id="logTitle" placeholder="Title" type="text" value="" class="form-control">'
					+'</div>'
				+'</div>'
				+'<div class="col-lg-5 col-md-6 col-sm-12 col-12">'
					+'<div class="position-relative form-group">'
						+'<label for="title" class="">Attachment&nbsp;(if any)</label>'
						+'<div class="file-upload">'
							+'<div class="file-select">'
								+'<div class="file-select-button" id="fileuploadLog6Label">Choose File</div>'
								+'<div class="file-select-name" id="fileuploadLog6Span">No file chosen...</div>'
								+'<input type="file" name="fileuploadLog6" id="fileuploadLog6" value="" onchange="cropImage(event,\'fileuploadLog6\',\''+undefined+'\',\'communicationLog\')">'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
			+'<div class="position-relative form-group">'
				+'<label for="title" title="Mandatory field">Comment<sup class="text-danger font-size-md"><b>*</b></sup></label>'
				+'<div id="commentEditor"></div>'
			+'</div>'
			+'<div class="position-relative form-group text-right mb-0">'
				+'<a href="javascript:void(0)" class="btn btn-sm btn-primary px-4" onclick="saveCommunicationLog(\'communicationLogForm\')">Add</a>'
			+'</div>'
		+'</form>';
		return html;
}

function getAddCommunicationLogTableHeader(){
	var html = 
	'<thead>'
		+'<tr>'	
			+'<td>S.No.</td>'
			+'<td>Title</td>'
			+'<td>Comments</td>'
			+'<td>Attachment</td>'
			+'<td>Added by/Added At</td>'
		+'</tr>'
	+'</thead>';
	return html;
}
function getAddCommunicationLogTablebody(result){
	var html='';
		$.each(result.commonCommentsDTO, function(k, v) {
			html+=
				'<tr id="commLog'+v.commentId+'">'
					+'<td>'+(k+1)+'</td>'
					+'<td>'+v.title+'</td>'
					+'<td>'+v.comments+'</td>'
					+'<td class="text-center">';
						if(v.uploadFile != '' && v.uploadFile != 'No file chosen...'){
							html+='<a target="_blank" href="'+FILE_UPLOAD_PATH+''+v.uploadFile+'" ><i class="fa fa-eye"></i></a>';
						}else{
							html+='N/A';
						}
					html+='</td>'
					+'<td>'+v.addedByName+'/'+v.createdAt+'</td>'
				'</tr>';
		});
		return html;
}

function getAddCommunicationLogTable(){
	html='<table class="table table-hover table-striped table-bordered responsive dt-responsive" id="communicationLogTable"  style="width:100%;">'
			+getAddCommunicationLogTableHeader()
			+'<tbody>'
			+'</tbody>'
		+'</table>';
	return html;
}

function getCommunicationAttchFileModal(){
	var html=
	'<div class="modal fade" id="communicationattachModal" tabindex="-1">'
		+'<div class="modal-dialog modal-sm modal-notify" role="document">'
			+'<div class="modal-content text-center">'
				+'<div class="modal-header">'
					+'<h5 class="modal-title" id="exampleModalLabel">Attachment</h5>'
					+'<button type="button" class="close" data-dismiss="modal" aria-label="Close">'
						+'<span aria-hidden="true">×</span>'
					+'</button>'
				+'</div>'
				+'<div class="modal-body delete-modal" style="padding-top:12px">'
				+'</div>'
				+'<div class="modal-footer text-right">'
					+'<button type="button" class="btn bg-primary" data-dismiss="modal">Close</button>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
