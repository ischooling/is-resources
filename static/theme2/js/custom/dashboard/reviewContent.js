function getReviewContent(){
    var html = '<div class="app-page-title">'+
'	<div class="page-title-wrapper">'+
'		<div class="page-title-heading">'+
'			<div class="page-title-icon"> <i class="fa fa-calendar-plus text-primary"> </i> </div>'+
'			<div>User Review</div>'+
'		</div>'+
'	</div>'+
'</div>'+
'<div class="main-card mb-3">'+
'	<div class="card">'+
'		<div class="card-body">'+
// '			<div class="full text-right mb-2">'+
// '				<button type="button" class="btn btn-primary btn-sm" onclick="showModel(\'${USER_FULL_NAME}\')">User Review add<button>'+
// '			</div>'+
'			<table class="table table-bordered table-striped responsive dt-responsive" id="teacherLeaveTable">'+
'				<thead>'+
'					<tr>'+
'						<th>S.No.</th>'+
'						<th>User Name</th>'+
'						<th>Event Name</th>'+
'						<th>Action</th>'+
'					</tr>'+
'				</thead>'+
'				<tbody></tbody>'+
'			</table>'+
'		</div>'+
'	</div>'+
'</div>	'+
'<!-- Leave Form Modal Start-->'+
'<div class="modal fade fade-scale" id="leaveFromModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-modal="true">'+
'	<div class="modal-dialog modal-md" role="document">'+
'		<div class="modal-content">'+
'			<div class="modal-header pt-2 pb-2 theme-bg text-white">'+
'				<h5 class="modal-title text-white" id="feedback_title">Leave From</h5>'+
'				<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'+
'					<span aria-hidden="true">×</span>'+
'				</button>'+
'			</div>'+
'			<div class="modal-body">'+
'				<form action="">'+
'					<div class="form-row">'+
'						<div class="col-12">'+
'							<div class="position-relative form-group">'+
'								<label for="">Teacher Name</label>'+
'								<input type="text" name="teacherName" id="teacherName" class="form-control" value="Mohit Sahu" placeholder="Teacher"  disabled/>'+
'							</div>'+
'						</div>'+
'						<div class="col-12">'+
'							<div class="position-relative form-group">'+
'								<label for="">Leave Date</label>'+
'								<input type="text" name="leaveDates" id="leaveDates" class="form-control" placeholder="Select Date"/>'+
'							</div>'+
'						</div>'+
'						<div class="col-12">'+
'							<div class="position-relative form-group">'+
'								<label for="">Reason</label>'+
'								<textarea name="leaveReason" id="leaveReason" class="form-control textarea" placeholder="Reason" cols="30" rows="4"></textarea>'+
'							</div>'+
'						</div>'+
'					</div>'+
'				</form>'+
'			</div>'+
'			<div class="modal-footer text-right">'+
'				<button type="button" class="btn btn-success btn-sm pr-4 pl-4" onclick="saveLeaveForm(${USER_ID},${USER_ID})">Save</button>'+
'			</div>'+
'		</div>'+
'	</div>'+
'</div>';
return html;
}
// <!-- Leave Form Modal End-->
// <script>
// 	$(document).ready(function(){
// 		$("#teacherLeaveTable").dataTable();
// 		$("#leaveDates").datepicker({
// 			//autoclose: true,//
// 			startDate:new Date(),
// 			multidate:true,
// 			format: 'M dd, yyyy',
// 			container:'#leaveFromModal .modal-body'
// 		});
// 	});
// 	getUserLeaveData(USER_ID, USER_ID);
// </script>	
	 