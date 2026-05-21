$(document).ready(function(){
	if($.inArray(USER_ROLE, ['STUDENT','TEACHER','PARENT','DIRECTOR']) == -1) {
		
		// for remark Demo update
		var data3 = getAllDemosForUpdateRemark(USER_ID);
		if(data3.status==1){
			var demoDetails=data3.details.demoDetails.demoDetails;
			if(demoDetails!=undefined){
				if(demoDetails.length>0){
					if($("#demo2DetailsModal").length>0){
						$("#demo2DetailsModal").remove();
					}
					$('body').append(forceDemo2UpdateModalContent(data3));
					$("#demo2DetailsModal").modal("show");
				}
			}
		}
		// for remark lead update
		var data2 = getAllLeadForUpdateRemark(USER_ID);
		if(data2.status==1){
			var leadDetails=data2.details.leadDetails.leadDetails;
			if(leadDetails!=undefined){
				if(leadDetails.length>0){
					if($("#leadDetailsModal").length>0){
						$("#leadDetailsModal").remove();
					}
					$('body').append(forceLeadUpdateModalContent(data2));
					$("#leadDetailsModal").modal("show");
				}
			}
		}
		// end
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
		// for remark callback update
		var data4 = getAllCallbackForUpdateRemark(USER_ID);
		if(data4.status==1){
			if(data4.details.callbackDetails != undefined){
				var callbackDetails=data4.details.callbackDetails.callbackDetails;
				if(callbackDetails!=undefined){
					if(callbackDetails.length>0){
						if($("#callbackDetailsModal").length>0){
							$("#callbackDetailsModal").remove();
						}
						$('body').append(forceCallbackUpdateModalContent(data4));
						setTimeout(() => {
							$("#callbackDetailsModal").modal("show");
						}, 200);
					}
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
	$(document).on("input", ".lead_remarks", function () {
		let val = $(this).val();
		let id = $(this).attr("id");
		let minlength = $(this).attr("minlength");
		let counterId = "#leadRemarksCounter_" + id.split("_")[2];

		// update counter live
		$(counterId).text(val.length + " / "+ minlength);

		// visual feedback
		if (val.length < minlength) {
			$(this).addClass("is-invalid");
			$(counterId).attr("class", "text-red");
		} else {
			$(this).removeClass("is-invalid");
			$(counterId).attr("class", "text-success");
		}
	});
	$(document).on("input", ".callback_remarks", function () {
		let val = $(this).val();
		let id = $(this).attr("id");
		let minlength = $(this).attr("minlength");
		let counterId = "#callbackRemarksCounter_" + id.split("_")[2];

		// update counter live
		$(counterId).text(val.length + " / "+ minlength);

		// visual feedback
		if (val.length < minlength) {
			$(this).addClass("is-invalid");
			$(counterId).attr("class", "text-red");
		} else {
			$(this).removeClass("is-invalid");
			$(counterId).attr("class", "text-success");
		}
	});
	$(document).on("input", ".demo_remarks", function () {
		let val = $(this).val();
		let id = $(this).attr("id");
		let minlength = $(this).attr("minlength");
		let counterId = "#demoRemarksCounter_" + id.split("_")[2];

		// update counter live
		$(counterId).text(val.length + " / " + minlength);

		// visual feedback
		if (val.length < minlength) {
			$(this).addClass("is-invalid");
			$(counterId).attr("class", "text-red");
		} else {
			$(this).removeClass("is-invalid");
			$(counterId).attr("class", "text-success");
		}
	});

	
	$(document).on("input", ".schedule_remarks", function () {
		let val = $(this).val();
		let id = $(this).attr("id");
		let minlength = $(this).attr("minlength");
		let counterId = "#scheduleRemarksCounter";

		// update counter live
		$(counterId).text(val.length + " / " + minlength);

		// visual feedback
		if (val.length < minlength) {
			$(this).addClass("is-invalid");
			$(counterId).attr("class", "text-red");
		} else {
			$(this).removeClass("is-invalid");
			$(counterId).attr("class", "text-success");
		}
	});
	$('.tentative_date').css( "display", "none" );
	$('.rtentativeDate').datepicker({
		autoclose: true,
		format: 'mm-dd-yyyy',
	});
});
function closeModal(modalId) {
		$("#"+modalId).modal('hide')
}

function forceDemoUpdateModalContent(data){
	var newThemeflag = tt=="theme2"?true:false;
	var html=
	`<div class="modal fade" id="demoDetailsModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog `+(newThemeflag?'modal-xl':'modal-lg')+`" role="document">
			<div class="modal-content">
				<div class="modal-header `+(newThemeflag?'modal-header py-2 bg-primary':'')+`">`;
					if(newThemeflag){
						html+=
						`<h5 class="modal-title text-white">Update Demo Status (<span class="demoTotalCount">${data.details.demoDetails.demoCount}</span>)</h5>`;
						if(!data.details.showUpdateDemoPopupStatus){
							html+=`<button type="button" class="close text-white" onclick="closeModal('demoDetailsModal')"><span aria-hidden="true">&times;</span></button>`;
						}
						
					}else{
						html+=
						`<h5 class="modal-title" style="color:#fff;">Update Demo Status (<span class="demoTotalCount">${data.details.demoDetails.demoCount}</span>)</h5>`;
						if(!data.details.showUpdateDemoPopupStatus){
							html+=`<button type="button" class="close text-white" onclick="closeModal('demoDetailsModal')" >
								<span aria-hidden="true">&times;</span>
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
								+demoDetailsModalBodyContent(data.details.allowCallhippoService,data.details.callhippoBypassNumber,data.details.demoDetails.demoDetails,data.details.remarkMendatory,data.details.minRemarkCount);
								//console.log(data)
							html+=
							`</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer text-right">
					<a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="updateBulkDemoStatus(${data.details.remarkMendatory},${data.details.minRemarkCount});">Update All</a>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function demoDetailsModalBodyContent(allowCallhippoService,callhippoBypassNumber,data,remarkMendatory,minRemarkCount){
	var html=``;
	if(data.length>0){
		$.each(data, function(i,v){
			var standard=v.standardname!=''?v.standardname.replace('Grade ',''):'';
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
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Grade:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+standard+`</td>
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
								<td class="border-0 p-1" style="word-break:break-word">`+v.inviteePhone+` &nbsp; <a href="https://api.whatsapp.com/send?phone=${v.inviteePhone.replace(' ','').replace('+','')}" target="_target" class="position-relative"><img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" width="16px"></span></a> &nbsp; <a href="javascript:void(0);" onclick="callLeadViaCallHippo('${allowCallhippoService}','${callhippoBypassNumber}','${v.inviteePhone}')" data-toggle="tooltip" data-placement="top" data-original-title="Call via CallHippo" class="btn btn-sm ml-1 d-inline-flex align-items-center rounded-pill py-1" style="font-size: 10px;background-color: #c3e4ff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"><img src="${PATH_FOLDER_IMAGE2}leadlist_icons/CallHippo.svg${SCRIPT_VERSION}" style="width:16px; margin-right:5px"> Call</a></td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Lead Owner Name:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.leadAssignName+`</td>
							</tr>
							
						</tbody>
					</table>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Update<sup>*</sup></label>
						<select name="status_`+i+`" id="status_`+i+`" class="form-control status" onchange="getTantativDate(`+i+`);">
							<option value="">Select Status</option>
							<option value="COMPLETED">Completed</option>
							<option value="COMPLETED-ON-CALL">Completed on Call</option>'
							<option value="NOTATTENDED">No Show</option>
							<option value="CANCELLED">Cancelled</option>
							<option value="RESCHEDULE">Reschedule</option>
							<option value="Demo Confirmed">Demo Confirmed</option>
							<option value="Demo Not Confirmed">Demo Not Confirmed</option>
							<option value="Not Interested">Not Interested</option>
							<option value="Positive to enrollment">Positive to enrollment</option>
						</select>
					</div>
					<div class="form-group tentative_date_`+i+`" style="display:none">
						<label class="mb-0">Tentative Date</label>
						<input type="text" name="rtentativeDate_`+i+`" id="rtentativeDate_`+i+`" value="" class="form-control rtentativeDate" maxlength="50" autocomplete="off" readonly onkeydown="return false" />
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

// for lead remark work by alok

function forceLeadUpdateModalContent(data){
	var newThemeflag = tt=="theme2"?true:false;
	var html=
	`<div class="modal fade" id="leadDetailsModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog `+(newThemeflag?'modal-xl':'modal-lg')+`" role="document">
			<div class="modal-content">
				<div class="modal-header `+(newThemeflag?'modal-header py-2 bg-primary':'')+`">`;
					if(newThemeflag){
						html+=
						`<h5 class="modal-title text-white">Update Lead Remark (<span class="leadTotalCount">${data.details.leadDetails.leadCount}</span>)</h5>`;
						if(data.details.showLeadRemarkPopupStatus){
							html+=`<button type="button" class="close text-white" onclick="closeModal('leadDetailsModal')"><span aria-hidden="true">&times;</span></button>`;
						}
						
					}else{
						html+=
						`<h5 class="modal-title" style="color:#fff;">Update Lead Remark (<span class="leadTotalCount">${data.details.leadDetails.leadCount}</span>)</h5>`;
						if(data.details.showLeadRemarkPopupStatus){
							html+=`<button type="button" class="close text-white" onclick="closeModal('leadDetailsModal')">
								<span aria-hidden="true">&times;</span>
							</button>`;
						}
					}
					
				html+=`
				</div>
				<div class="modal-body">
					<div style="width:100%; text-align: center;font-weight: bold;display:none;color:red;margin-bottom: 10px;" id="leadErrorTxt"></div>
					<h2 style="color:red;font-size:16px;">NOTE: New leads will only be assigned once remarks are submitted for the previous lead.</h2>
					<div class="full" style="max-height: 450px;overflow-y: auto;">
						<table class="table table-borderedtable table-bordered font-12" id="leadDetailsTable">
							<thead>
								<tr>
									<th style="width: 350px;">Assign Date | Time  (${data.details.userTimezone})</th>
									<th>Parent's Details</th>
									<th style="width:200px">Lead Status</th>
									<th style="min-width: 450px;">Remarks</th>
								</tr>
							</thead>
							<tbody>`
								+leadDetailsModalBodyContent(data.details.allowCallhippoService,data.details.callhippoBypassNumber,data.details.leadDetails.leadDetails,data.details.statusList,data.details.remarkMendatory,data.details.minRemarkCount);
								//console.log(data)
							html+=
							`</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer text-right">
					<a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="updateBulkLeadStatus(${data.details.remarkMendatory},${data.details.minRemarkCount});">Update All</a>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function leadDetailsModalBodyContent(allowCallhippoService,callhippoBypassNumber,data,statuslist,remarkMendatory,minRemarkCount){
	var html=``;
	if(data.length>0){
		const isRemarkMandatory = remarkMendatory && Number(minRemarkCount) > 0;
		const statusListHtml = statuslist.map(s => `<option value="${s.value}">${s.value}</option>`).join('');
		$.each(data, function(i,v){
			var standard=v.standardname!=''?v.standardname.replace('Grade ',''):'';
			html+=
			`<tr data-leadId=`+v.leadId+` data-userId=`+v.userId+`>
				<td class="py-1" style="vertical-align: top;">
					<span class="full">`+v.userFullName+`</span>
					<span class="full">`+v.leadDateTime+`</span>
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
								<td class="border-0 p-1" style="word-break:break-word">`+v.leadStatus+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Grade:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+standard+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Name:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.childName+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Email:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.email+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Phone No.:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.phone+` &nbsp; <a href="https://api.whatsapp.com/send?phone=${v.phone.replace(' ','').replace('+','')}" target="_target" class="position-relative"><img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" width="16px"></span></a> &nbsp; <a href="javascript:void(0);" onclick="callLeadViaCallHippo('${allowCallhippoService}','${callhippoBypassNumber}','${v.phone}')" data-toggle="tooltip" data-placement="top" data-original-title="Call via CallHippo" class="btn btn-sm ml-1 d-inline-flex align-items-center rounded-pill py-1" style="font-size: 10px;background-color: #c3e4ff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"><img src="${PATH_FOLDER_IMAGE2}leadlist_icons/CallHippo.svg${SCRIPT_VERSION}" style="width:16px; margin-right:5px"> Call</a></td>
							</tr>
							
						</tbody>
					</table>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Update<sup>*</sup></label>

						<select name="lead_status_`+i+`" id="lead_status_`+i+`" class="form-control status">
							<option value="">Select Status</option>
							${statusListHtml}
						</select>
					</div>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Remarks</label>
						<input type="text" name="lead_remarks_${i}"   id="lead_remarks_${i}"  class="form-control ${isRemarkMandatory ? 'lead_remarks' : ''}  remarks" 
                                   ${isRemarkMandatory ? `minlength="${minRemarkCount}" required` : ''} />
                            ${isRemarkMandatory ? `<small id="leadRemarksCounter_${i}" class="text-muted">0 / ${minRemarkCount}</small>` : ''}
					</div>
				</td>
			</tr>`;
		});
	}
	return html;
}

// for demo remark work by alok


function forceDemo2UpdateModalContent(data){
	var newThemeflag = tt=="theme2"?true:false;
	var html=
	`<div class="modal fade" id="demo2DetailsModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog `+(newThemeflag?'modal-xl':'modal-lg')+`" role="document">
			<div class="modal-content">
				<div class="modal-header `+(newThemeflag?'modal-header py-2 bg-primary':'')+`">`;
					if(newThemeflag){
						html+=
						`<h5 class="modal-title text-white">Update Demo Remark (<span class="demo2TotalCount">${data.details.demoDetails.demoCount}</span>)</h5>`;
						if(data.details.showDemoRemarkPopupStatus){
							html+=`<button type="button" class="close text-white" onclick="closeModal('demo2DetailsModal')"><span aria-hidden="true">&times;</span></button>`;
						}
						
					}else{
						html+=
						`<h5 class="modal-title" style="color:#fff;">Update Demo Remark (<span class="demo2TotalCount">${data.details.demoDetails.demoCount}</span>)</h5>`;
						if(data.details.showDemoRemarkPopupStatus){
							html+=`<button type="button" class="close text-white" onclick="closeModal('demo2DetailsModal')">
								<span aria-hidden="true">&times;</span>
							</button>`;
						}
					}
					
				html+=`
				</div>
				<div class="modal-body">
					<div style="width:100%; text-align: center;font-weight: bold;display:none;color:red;margin-bottom: 10px;" id="demo2ErrorTxt"></div>
					<h2 style="color:red;font-size:16px;">NOTE: New demos will only be assigned once remarks are submitted for the previous demo.</h2>
					<div class="full" style="max-height: 450px;overflow-y: auto;">
						<table class="table table-borderedtable table-bordered font-12" id="demo2DetailsTable">
							<thead>
								<tr>
									<th style="width: 350px;">Assign Date | Time  (${data.details.userTimezone})</th>
									<th>Parent's Details</th>
									<th style="width:200px">Lead Status</th>
									<th style="min-width: 450px;">Remarks</th>
								</tr>
							</thead>
							<tbody>`
								+demo2DetailsModalBodyContent(data.details.allowCallhippoService,data.details.callhippoBypassNumber,data.details.demoDetails.demoDetails,data.details.statusList,data.details.remarkMendatory,data.details.minRemarkCount);
							html+=
							`</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer text-right">
					<a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="updateBulkDemosStatus(${data.details.remarkMendatory},${data.details.minRemarkCount});">Update All</a>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function demo2DetailsModalBodyContent(allowCallhippoService,callhippoBypassNumber,data,statuslist,remarkMendatory,minRemarkCount){
	var html=``;
	if(data.length>0){
		const isRemarkMandatory = remarkMendatory && Number(minRemarkCount) > 0;
		const statusListHtml = statuslist.map(s => `<option value="${s.value}">${s.value}</option>`).join('');
		$.each(data, function(i,v){
			var standard=v.standardname!=''?v.standardname.replace('Grade ',''):'';
			html+=
			`<tr data-leadId=`+v.leadId+` data-meetingId=`+v.meetingId+`  data-userId=`+v.userId+`>
				<td class="py-1" style="vertical-align: top;">
					<span class="full">`+v.userFullName+`</span>
					<span class="full">`+v.leadDateTime+`</span>
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
								<td class="border-0 p-1" style="word-break:break-word">`+v.leadStatus+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Grade:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+standard+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Name:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.childName+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Email:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.email+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Phone No.:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.phone+` &nbsp; <a href="https://api.whatsapp.com/send?phone=${v.phone.replace(' ','').replace('+','')}" target="_target" class="position-relative"><img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" width="16px"></span></a> &nbsp; <a href="javascript:void(0);" onclick="callLeadViaCallHippo('${allowCallhippoService}','${callhippoBypassNumber}','${v.phone}')" data-toggle="tooltip" data-placement="top" data-original-title="Call via CallHippo" class="btn btn-sm ml-1 d-inline-flex align-items-center rounded-pill py-1" style="font-size: 10px;background-color: #c3e4ff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"><img src="${PATH_FOLDER_IMAGE2}leadlist_icons/CallHippo.svg${SCRIPT_VERSION}" style="width:16px; margin-right:5px"> Call</a></td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Demo Schedule At:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.scheduleAt+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Lead Owner Name:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.leadAssignName+`</td>
							</tr>

							
						</tbody>
					</table>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Update<sup>*</sup></label>

						<select name="demo_status_`+i+`" id="demo_status_`+i+`" class="form-control status">
							<option value="">Select Status</option>
							<option value="COMPLETED">Completed</option>
							<option value="COMPLETED-ON-CALL">Completed on Call</option>'
							<option value="NOTATTENDED">No Show</option>
							<option value="CANCELLED">Cancelled</option>
							<option value="RESCHEDULE">Reschedule</option>
							<option value="Demo Confirmed">Demo Confirmed</option>
							<option value="Demo Not Confirmed">Demo Not Confirmed</option>
							<option value="Not Interested">Not Interested</option>
							<option value="Positive to enrollment">Positive to enrollment</option>
						</select>
					</div>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<div class="form-group">
						<label class="mb-0">Remarks</label>
						<input type="text" 
                                   name="demo_remarks_${i}" 
                                   id="demo_remarks_${i}" 
                                   class="form-control ${isRemarkMandatory ? 'demo_remarks' : ''}  remarks" 
                                   ${isRemarkMandatory ? `minlength="${minRemarkCount}" required` : ''} />
                            ${isRemarkMandatory ? `<small id="demoRemarksCounter_${i}" class="text-muted">0 / ${minRemarkCount}</small>` : ''}
					</div>
				</td>
			</tr>`;
		});
	}
	return html;
}


// for callback remark work by alok

function forceCallbackUpdateModalContent(data){
	var newThemeflag = tt=="theme2"?true:false;
	var html=
	`<div class="modal fade" id="callbackDetailsModal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header bg-primary">
					<h5 class="modal-title text-white">Upcoming Callback (<span class="leadTotalCount">${data.details.callbackDetails.callbackCount}</span>)</h5>
				</div>
				<div class="modal-body">
					<div style="width:100%; text-align: center;font-weight: bold;display:none;color:red;margin-bottom: 10px;" id="callbackErrorTxt"></div>
					<div class="full" style="max-height: 450px;overflow-y: auto;">
						<table class="table table-borderedtable table-bordered font-12" id="callbackDetailsTable">
							<thead>
								<tr>
									<th style="width: 350px;">Callback Date | Time  (${data.details.userTimezone})</th>
									<th>Parent's Details</th>
								</tr>
							</thead>
							<tbody>`
								+callbackDetailsModalBodyContent(data.details.allowCallhippoService,data.details.callhippoBypassNumber,data.details.callbackDetails.callbackDetails);
							html+=
							`</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer text-right">
				
					<a href="javascript:void(0)" class="btn btn-success btn-sm" onclick="closeModal('callbackDetailsModal')"> Ok </a>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function callbackDetailsModalBodyContent(allowCallhippoService,callhippoBypassNumber,data){
	var html=``;
	if(data.length>0){
		$.each(data, function(i,v){
			var standard=v.standardname!=''?v.standardname.replace('Grade ',''):'';
			html+=
			`<tr data-leadId=`+v.leadId+` data-userId=`+v.userId+`>
				<td class="py-1" style="vertical-align: top;">
					<span class="full">`+v.userFullName+`</span>
					<span class="full">`+v.callbackDateTime+`</span>
				</td>
				<td class="py-1" style="vertical-align: top;">
					<table class="full">
						<tbody>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Lead No:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.leadNo+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Last Callback Status:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.leadStatus+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Grade:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+standard+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Name:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.childName+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Email:</th>
								<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">`+v.email+`</td>
							</tr>
							<tr>
								<th class="border-0 p-1 vertical-align-top" style="width:172px;font-weight: 600;">Phone No.:</th>
								<td class="border-0 p-1" style="word-break:break-word">`+v.phone+` &nbsp; <a href="https://api.whatsapp.com/send?phone=${v.phone.replace(' ','').replace('+','')}" target="_target" class="position-relative"><img src="${PATH_FOLDER_IMAGE2}watsapp-icon.png" width="16px"></span></a> &nbsp; <a href="javascript:void(0);" onclick="callLeadViaCallHippo('${allowCallhippoService}','${callhippoBypassNumber}','${v.phone}')" data-toggle="tooltip" data-placement="top" data-original-title="Call via CallHippo" class="btn btn-sm ml-1 d-inline-flex align-items-center rounded-pill py-1" style="font-size: 10px;background-color: #c3e4ff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"><img src="${PATH_FOLDER_IMAGE2}leadlist_icons/CallHippo.svg${SCRIPT_VERSION}" style="width:16px; margin-right:5px"> Call</a></td>
							</tr>
							
						</tbody>
					</table>
				</td>
			</tr>`;
		});
	}
	return html;
}
