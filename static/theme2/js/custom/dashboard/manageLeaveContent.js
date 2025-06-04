
function bindLeaveData(userLeaveDTO){
	var tableHtml='';
		$.each(userLeaveDTO, function (index, value) {
			tableHtml +=  '<tr>' +
			'<td>' + (index + 1) + '</td>' +
			'<td>' + value.userId + '</td>' +
			'<td>' + value.startDate + '</td>' +
			'<td>' + value.reason + '</td>' +
			'<td>' + value.createdDate + '</td>'+
			'<td>' + value.status + '</td>' ;
			if(USER_ROLE == 'ADMIN' || USER_ROLE == "DIRECTOR"){
				tableHtml += '<td>' + value.approvedBy + '</td>';
			}
			tableHtml +='<td>' + value.approvedRemark + '</td>' +
			'<td>' +
			'<div class="btn-group">';
			if(value.status != 'Initiated' && value.status != 'Panding' && value.status != 'panding' && USER_ROLE == "TEACHER"){
				tableHtml += '<button type="button" class="btn btn-danger dropdown-toggle  btn-sm"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-toggle="tooltip" title="Action" style="background-color:#007fff !important;border-color:#007fff;box-shadow:none;" disabled>' +
			'<i class="fa fa-ellipsis-v"></i>' +
			'</button>';
			}else{
				tableHtml += '<button type="button" class="btn btn-danger dropdown-toggle  btn-sm"data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-toggle="tooltip" title="Action" style="background-color:#007fff !important;border-color:#007fff;box-shadow:none;">' +
			'<i class="fa fa-ellipsis-v"></i>' +
			'</button>';
			}
			tableHtml +='<div class="dropdown-menu">' ;
			if(USER_ROLE == 'ADMIN' || USER_ROLE == "DIRECTOR"){
			tableHtml += '<a class="dropdown-item" href="javascript:void(0);" onclick="showModel(\'' + USER_FULL_NAME + '\',\'approve\',\'' + value.actionId + '\',\'' + value.startDate + '\', \'' + value.reason + '\', \'' + value.status + '\', \'' + value.approvedRemark + '\')">Approvel Leave</a>';
			}else{
				tableHtml += '<a class="dropdown-item" href="javascript:void(0);" onclick="showModel(\'' + USER_FULL_NAME + '\',\'update\',\'' + value.actionId + '\',\'' + value.startDate + '\', \'' + value.reason + '\', \'' + USER_ROLE + '\')">Update Leave</a>';
			}                        
			tableHtml += '</div>'+
			'</div>' +
			'</td>' +
			'</tr>';
	});

  $("#teacherLeaveTable tbody").append(tableHtml);
}



function getManageLeaveContent(title, roleAndModule, schoolId, userId, role, newTheme){
	var html='';

	if(newTheme){
		html+='<div class="app-page-title">'
		+'	<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon"> <i class="fa fa-calendar-plus text-primary"> </i> </div>'
		+'			<h5 class="m-0">'+title+'</h5>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	}else{
		html+='<div class="app-page-title">'
		+'	<div class="page-title-wrapper">'
		+'		<div class="page-title-heading">'
		+'			<div class="page-title-icon"> <i class="fa fa-calendar-plus text-primary"> </i> </div>'
		+'			<h5 class="m-0">'+title+'</h5>'
		+'		</div>'
		+'	</div>'
		+'</div>';
	}

	html+='<div class="main-card mb-3">'
+'	<div class="card">';

if(newTheme){}else{
	html+='	<div class="card-header card-header-primary"><h4 class="card-title">'+title+'</h4></div>';
}

html+='<div class="card-body">'
+'			<div class="full text-right mb-2">'
if(role == "TEACHER"){
	html += '<button type="button" class="btn btn-primary btn-sm" onclick="showModel(\''+USER_FULL_NAME+'\', \'new\')">Leave Form</button>';
}
html += '			</div>'
+'			<table class="table table-bordered table-striped responsive dt-responsive" id="teacherLeaveTable">'
+'				<thead>'
+'					<tr>'
+'						<th>S.No.</th>'
						if(role == "ADMIN" || role == "DIRECTOR"){
							html += '<th>Teacher Name</th>';
						}else{
							html += '<th>Name</th>';
						}
						html +=	'<th>Leave Date</th>'
+'						<th>Reason</th>'
+'						<th>Apply Date</th>'
+'						<th>Status</th>'
						if(role == "ADMIN" || role == "DIRECTOR"){
							html += '<th>Approved by</th>';
						}
						html += '<th>Approved Remark</th>'
+'						<th>Action</th>'
+'					</tr>'
+'				</thead>'
+'				<tbody></tbody>'
+'			</table>'
+'		</div>'
+'	</div>'
+'</div>';
	return html;
}

function modelForSaveAndUpdateLeave(userId,leaveUniqueId,userRole){
var html = '<div class="modal fade fade-scale" id="leaveFromModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">'
+'<div class="modal-dialog modal-md" role="document">'
	+'<div class="modal-content">'
		+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
			+'<h5 class="modal-title text-white" id="feedback_title">Leave From</h5>'
+'				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
+'					<span aria-hidden="true">×</span>'
+'				</button>'
+'			</div>'
+'			<div class="modal-body">'
+'				<form action="">'
+'					<div class="form-row">'
+'						<div class="col-12">'
+'							<div class="position-relative form-group">'
+'								<input type="hidden" id="control"/>'
+'								<input type="hidden" id="leaveid"/>'
+'								<label for="">Teacher Name</label>'
+'								<input type="text" name="teacherName" id="teacherName" class="form-control" value="Bhagat Singh Garakoti" placeholder="Teacher"  disabled/>'
+'							</div>'
+'						</div>'
+'						<div class="col-12">'
+'							<div class="position-relative form-group">'
+'								<label for="">Leave Date</label>'
+'								<input type="text" name="leaveDates" id="leaveDates" class="form-control" placeholder="Select Date"/>'
+'							</div>'
+'						</div>'
+						'<div class="col-12">'
+'							<div class="position-relative form-group">'
+'								<label for="">Select start time</label>'
+'								<select class="form-control" id="leaveStartTime" name="leaveStartTime" multiple="multiple">'
+'									<option value="">00:00</option>'
+'									<option value="">01:00</option>'
+'									<option value="">02:00</option>'
								+'</select>'
+'							</div>'
+'						</div>'
+						'<div class="col-12">'
+'							<div class="position-relative form-group">'
+'								<label for="">Select end time</label>'
+'								<select class="form-control" id="leaveEndTime" name="leaveEndTime" multiple="multiple">'
+'									<option value="">00:00</option>'
+'									<option value="">01:00</option>'
+'									<option value="">02:00</option>'
								+'</select>'
+'							</div>'
+'						</div>'
+'						<div class="col-12">'
+'							<div class="position-relative form-group">'
+'								<label for="">Reason</label>'
+'								<textarea name="leaveReason" id="leaveReason" class="form-control textarea" placeholder="Reason" cols="30" rows="4"></textarea>'
+'							</div>'
+'						</div>'
+'					</div>'
+'				</form>'
+'			</div>'
+'			<div class="modal-footer text-right">'
+'				<button type="button" class="btn btn-success btn-sm pr-4 pl-4" onclick="saveLeaveForm('+userId+',\''+""+'\',\''+userRole+'\')">Save leave</button>'
+'			</div>'
+'		</div>'
+'	</div>'
+'</div>';
return html;
}


function modelForUpdateLeaveStatus(userId,leaveUniqueId,userRole){
	var html = '<div class="modal fade fade-scale" id="leaveFromModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">'
	+'<div class="modal-dialog modal-md" role="document">'
	+'		<div class="modal-content">'
	+'			<div class="modal-header pt-2 pb-2 theme-bg text-white">'
	+'				<h5 class="modal-title text-white" id="feedback_title">Approvel From</h5>'
	+'				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
	+'					<span aria-hidden="true">×</span>'
	+'				</button>'
	+'			</div>'
	+'			<div class="modal-body">'
	+'				<form action="">'
	+'					<div class="form-row">'
	+'						<div class="col-12">'
	+'							<div class="position-relative form-group">'
	+'								<input type="hidden" id="control"/>'
	+'								<input type="hidden" id="leaveid"/>'
	+'								<label for="">Status</label>'
	+'								<select id="leaveStatus">'
	+'									<option value = "panding">Panding</option>'
	+'									<option value = "approved">Approve</option>'
	+'									<option value = "reject">Reject</option>'
	+'								<select/>'
	+'							</div>'
	+'						</div>'
	+'						<div class="col-12">'
	+'							<div class="position-relative form-group">'
	+'								<label for="">Remark</label>'
	+'								<textarea name="leaveRemark" id="leaveRemark" class="form-control textarea" cols="30" rows="4"></textarea>'
	+'							</div>'
	+'						</div>'
	+'					</div>'
	+'				</form>'
	+'			</div>'
	+'			<div class="modal-footer text-right">'
	+'				<button type="button" class="btn btn-success btn-sm pr-4 pl-4" onclick="updateLeaveStatus('+userId+',\''+""+'\',\''+userRole+'\')">Save</button>'
	+'			</div>'
	+'		</div>'
	+'	</div>'
	+'</div>';
	return html;
	}
	
