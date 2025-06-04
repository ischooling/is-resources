$(document).ready(function(){
	if($.inArray(USER_ROLE, ['STUDENT','TEACHER','PARENT','DIRECTOR']) == -1) {
		var data = getAllDemoForUpdateStatus(USER_ID);
		if(data.status==1){
			var demoDetails=data.details.demoDetails.demoDetails;

			if(demoDetails!=undefined){
				if(demoDetails.length>0){
					if($("#demoDetailsModal").length>0){
						$("#demoDetailsModal").remove();
					}
					$('body').append(forceDemoUpdateModalContent(data));
					$("#demoDetailsModal").modal("show");
				}
			}
		}
	}
	$(".status").on("change", function(){
		if($(this).val() != ""){
			$(this).parent().closest("tr:nth-of-type(even)").css({"background-color":"rgba(237, 240, 255, 1)"});
			$(this).parent().closest("tr:nth-of-type(odd)").css({"background-color":"#fff"});
		}else{
			$(this).parent().closest("tr").css({"background-color":"#f6c85a"});
		}
	});
	$(".remarks").on("blur", function(){
		if($(this).val() != ""){
			if($(this).parent().closest("tr").find(".status").val() == ""){
				$(this).parent().closest("tr").css({"background-color":"#f6c85a"});
			}else{
				
				$(this).parent().closest("tr:nth-of-type(even)").css({"background-color":"rgba(237, 240, 255, 1)"});
				$(this).parent().closest("tr:nth-of-type(odd)").css({"background-color":"#fff"});
			}
		}else{
			$(this).parent().closest("tr:nth-of-type(even)").css({"background-color":"rgba(237, 240, 255, 1)"});
			$(this).parent().closest("tr:nth-of-type(odd)").css({"background-color":"#fff"});
		}
	});
});

function forceDemoUpdateModalContent(data){
	var newThemeflag = tt=="theme2"?true:false;
	var html=
	`<div class="modal fade" id="demoDetailsModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog `+(newThemeflag?'modal-xl':'modal-lg')+`" role="document">
			<div class="modal-content">
				<div class="modal-header `+(newThemeflag?'modal-header bg-primary py-2':'')+`">`;
					if(newThemeflag){
						html+=
						`<h5 class="modal-title text-white">Update Demo Status (<span class="demoTotalCount">${data.details.demoDetails.demoCount}</span>)</h5>`;
						if(!data.details.showUpdateDemoPopupStatus){
							html+=`<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>`;
						}
						
					}else{
						html+=
						`<h4 class="modal-title" style="color:#fff;">Update Demo Status (<span class="demoTotalCount">${data.details.demoDetails.demoCount}</span>)</h4>`;
						if(!data.details.showUpdateDemoPopupStatus){
							html+=`<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true" style="color:#fff;">&times;</span>
							</button>`;
						}
					}
					
				html+=`
				</div>
				<div class="modal-body">
					<div style="width:100%; text-align: center;font-weight: bold;display:none;color:red;margin-bottom: 10px;" id="demoErrorTxt"></div>
					<div class="full" style="max-height: 450px;overflow-y: auto;">
						<table class="table table-borderedtable table-bordered font-12" id="demoDetailsTable">
							<thead>
								<tr>
									<th style="width: 350px;">Counselor Meeting Date | Time</th>
									<th>Invitee Details</th>
									<th>Status</th>
									<th style="min-width: 450px;">Remarks</th>
								</tr>
							</thead>
							<tbody>`
								+demoDetailsModalBodyContent(data.details.demoDetails.demoDetails);
								//console.log(data)
							html+=
							`</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer text-right">
					<a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="updateBulkDemoStatus();">Update All</a>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function demoDetailsModalBodyContent(data){
	var html=``;
	if(data.length>0){
		$.each(data, function(i,v){
			html+=
			`<tr data-leadId=`+v.leadId+` data-meetingId=`+v.meetingId+` data-userId=`+v.userId+`>
				<td class="py-1" style="vertical-align: top;">
					<span class="full">`+v.userFullName+`</span>
					<span class="full">`+v.demoDateTime+`</span>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<table class="full">
						<tbody>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Lead No:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.leadNo+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Last Lead Status:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.leadFollowStatus+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Name:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.inviteeName+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Email:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.inviteeEmail+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Phone No.:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.inviteePhone+`</td>
							</tr>
							
						</tbody>
					</table>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Update<sup>*</sup></label>
						<select name="status_`+i+`" id="status_`+i+`" class="form-control status">
							<option value="">Select Status</option>
							<option value="COMPLETED">Completed</option>
							<option value="NOTATTENDED">No Show</option>
							<option value="CANCELLED">Cancelled</option>
							<option value="RESCHEDULE">Reschedule</option>
						</select>
					</div>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Remarks</label>
						<input type="text" name="remarks_`+i+`" id="remarks_`+i+`" class="form-control remarks">
					</div>
				</td>
			</tr>`;
		});
	}
	return html;
}
