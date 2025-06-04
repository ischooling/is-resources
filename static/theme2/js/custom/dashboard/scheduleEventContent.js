function getScheduleEventContent(data, clickFrom, currentPageNo, boxSearchCondition){
	$("#scheduleEventContent").html(cardContent(data,clickFrom, currentPageNo, boxSearchCondition));
	$("#search-button").on("click", function () {
		$("#scheduleEventsSearchForm").stop().slideToggle();
	});
	getAllCounselorList('scheduleEventsSearchForm','counselorName');
	var userId = $('#userId').val();
	if(userId==undefined || userId==null || userId==''){
		userId=USER_ID;
	}
	$('#scheduleEventsSearchForm #counselorName').val(userId);
	getAllEventList('scheduleEventsSearchForm','eventType');
	getAllEventList('scheduleEventsSearchForm','searchBy');
	getAllCountryList('scheduleEventsSearchForm','countryId');
	getAllGrade(SCHOOL_ID, true);
	$("#counselorName").select2({
		theme:"bootstrap4"
	});
	$("#eventType").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#searchBy").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	// $("#eventType option").each(function(){
	// 	if($(this).val() != 5){
	// 		$(this).prop("disabled",true);
	// 	}else{
	// 		$("#eventType").val("5").trigger("change");
	// 	}
	// });
	$("#meetingStatus").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#countryId").select2({
		theme:"bootstrap4"
	});
	$("#learningProgram").select2({
		theme:"bootstrap4"
	});
	$("#gradeId").select2({
		theme:"bootstrap4"
	});
	$("#sortBy").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#withRecordings").select2({
		theme:"bootstrap4",
		minimumResultsForSearch: Infinity
	});
	$("#searchByDate").datepicker({
		format:"M d, yyyy"
	});
	$("#startDate").datepicker({
		format:"M d, yyyy"
	});
	$("#endDate").datepicker({
		format:"M d, yyyy"
	});

	$("#saveFollowup").unbind().bind("click", function(){
		console.log("saveFollowup");
		submitLeadFollowupSave('followupSaveForm','0', 'time-available', true, 'leadFollowupForm');
	});
	
	$("#saveB2BFollowup").unbind().bind("click", function(){
		//console.log("saveB2BFollowup");
		submitLeadFollowupSave('followupB2BSaveForm','0', 'time-available', true,'leadFollowupB2BForm','','');
	});
}

function cardContent(data,clickFrom,currentPageNo,boxSearchCondition){
	var html =
		'<div class="card-header">'
			+'<h5 class="m-0 text-dark font-weight-bold text-capitalize">Scheduled Events</h5>'
			+'<div class="btn-actions-pane-right text-capitalize">'
				+'<button id="search-button" class="btn btn-primary mr-2">'
					+'<i class="fa fa-search mr-2"></i><span class="font-weight-semi-bold text-white fsize-1">Advance Search</span>'
				+'</button>'
				// +'<button id="search-button" class="btn btn-danger" onclick="$(\'#moveEventModal\').modal(\'show\')">'
				// 	+'<span class="font-weight-semi-bold text-white fsize-1">Move</span>'
				// +'</button>'
			+'</div>'
		+'</div>'
		+'<div class="card-body p-2">'
			+studentEnrollmentFilterForm()
			+'<div class="full" id="scheduleEventThumbAndTableDate">'
			+'</div>'
			// +scheduleEventthumb(data)
			// +scheduleEventListDetails(data.eventDetails,clickFrom,currentPageNo, boxSearchCondition)
			// +moveEventModal()
			+'<div class="full" id="updateModalWrapper">'
			+'</div>'
			+'<div class="full" id="confirmeUpdateModalWrapper">'
			+'</div>'
		+'</div>';
	return html;
}

function studentEnrollmentFilterForm(data){
	$("<style>")
    .prop("type", "text/css")
    .html(`
      .select2-container--bootstrap4 .select2-selection{
		padding: 12px 0px !important;
	  }
    `)
    .appendTo("head");
	
	var html = 
			'<form id="scheduleEventsSearchForm" style="display:none">'
				+'<div class="border rounded-10 pb-1 pt-4 px-4  mb-4 bg-light-primary" style="border-color: #ABA8A8;">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Select Counselor</label>'
							+'<select class="form-control select-first-value" name="counselorName" id="counselorName"></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Select Event Type</label>'
							+'<select class="form-control select-first-value" name="eventType" id="eventType"></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Meeting Status</label>'
							+'<select class="form-control" name="meetingStatus" id="meetingStatus">'
								+'<option value="">Select Status</option>'
								+'<option value="PENDING">Pending</option>'
								+'<option value="COMPLETED">Completed</option>'
								+'<option value="RESCHEDULE">Reschedule</option>'
								+'<option value="CANCELLED">Cancelled</option>'
								+'<option value="NOTATTENDED">Did not attend Meeting</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Invitee Name</label>'
						+'<input class="form-control" type="text" name="inviteeName" id="inviteeName" style="font-size:14px;">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Invitee Phone No.</label>'
							+'<input class="form-control" type="text" name="inviteePhoneNo" id="inviteePhoneNo" style="font-size:14px;">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Invitee Email</label>'
							+'<input class="form-control" type="email"  name="inviteeEmail" id="inviteeEmail" style="font-size:14px;">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold" for="">Select Country</label>'
							+'<select class="form-control" name="Id" id="countryId">'
							+'</select>'
						+'</div>'
						// +'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
						// 	+'<label class="font-weight-semi-bold">Learning Program</label>'
						// 	+'<select class="form-control" name="learningProgram" id="learningProgram">'
						// 		+getLearningProgramContent(SCHOOL_ID)
						// 	+'</select>'
						// +'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Grade</label>'
							+'<select class="form-control" name="gradeId" id="gradeId"></select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Search by</label>'
							// +'<input class="form-control datepicker" type="text"  name="searchByDate" id="searchByDate">'
							+'<select class="form-control" name="searchBy" id="searchBy">'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Date Range</label>'
							+'<div class="d-flex" style="gap: 8px;">'
								+'<input class="form-control datepicker" type="text" name="startDate" id="startDate" placeholder="Enter Start Date" style="font-size:14px;">'
								+'<input class="form-control datepicker" type="text" name="endDate" id="endDate" placeholder="Enter End Date" style="font-size:14px;">'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Sort By</label>'
							+'<select class="form-control" name="sortBy" id="sortBy">'
								+'<option value="">Select Option</option>'
								+'<option value="ASC">Ascending</option>'
								+'<option value="DESC">Descending</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">With Recordings</label>'
							+'<select class="form-control" name="withRecordings" id="withRecordings">'
								+'<option value="">Select Option</option>'
								+'<option value="Y">Yes</option>'
								+'<option value="N">No</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3">'
							+'<label class="font-weight-semi-bold">Page Size</label>'
							+'<input class="form-control" type="text" name="pageSize" id="pageSize" value="10" placeholder="Enter Page Size" style="font-size:14px;">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-4 col-md-4 col-sm-6 col-12 mb-3 ml-auto">'
							+'<label class="full">&nbsp;</label>'
							+'<div class="d-flex" style="gap: 10px;">'
								+'<a href="javascript:void(0)" class="btn btn-success w-100 py-2" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'ADV\',\'demoCountTotal\');">'
									+'<i class="fa fa-check mr-2"></i>Apply'
								+'</a>'
								+'<a href="javascript:void(0)" class="btn btn-primary w-100 py-2" onclick="scheduleEventFormReset(\'scheduleEventsSearchForm\');">'
									+'<i class="fa fa-sync mr-2"></i>'
									+'<span class="ml-1">Reset</span>'
								+'</a>'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</form>';
		return html;
}

function scheduleEventthumb(data){
	var html =
		'<div class="col-12">'
			+'<div class="row mt-2">'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-orange border border-orange rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-orange">'
						+'<span class="line-left bg-orange d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Today'+"'s"+' Meeting</b></p>'
						+'<p class="m-0">'
							+'<b>';
								if(data.demoCountToday == 0){
									html+='<span>'+(data.demoCountToday != null? data.demoCountToday:(data.demoCountToday != undefined? data.demoCountToday:"&nbsp;"))+'</span>'
								}else{
									html+='<a href="javascript:void(0)" class="text-orange" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'CD\', \'demoCountToday\');">'+(data.demoCountToday != null? data.demoCountToday:(data.demoCountToday != undefined? data.demoCountToday:"&nbsp;"))+'</a>'
								}
							html+='</b>'	
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-success border border-success rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-success">'
						+'<span class="line-left bg-success d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Total Meeting</b></p>'
						+'<p class="m-0">'
							+'<b>';
							if(data.demoCountTotal == 0){
								html+='<span>'+(data.demoCountTotal != null? data.demoCountTotal:(data.demoCountTotal != undefined? data.demoCountTotal:"&nbsp;"))+'</span>'
							}else{
								html+='<a href="javascript:void(0)" class="text-success" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'TD\',\'demoCountTotal\');">'+(data.demoCountTotal != null? data.demoCountTotal:(data.demoCountTotal != undefined? data.demoCountTotal:"&nbsp;"))+'</a>'
							}
						html+='</b>'
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-pink border border-pink rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-pink">'
						+'<span class="line-left bg-pink d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Meeting Pending</b></p>'
						+'<p class="m-0">'
							+'<b>';
								if(data.demoCountPending == 0){
									html+='<span>'+(data.demoCountPending != null? data.demoCountPending:(data.demoCountPending != undefined? data.demoCountPending:"&nbsp;"))+'</span>'
								}else{
									html+='<a href="javascript:void(0)" class="text-pink" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'DP\',\'demoCountPending\');">'+(data.demoCountPending != null? data.demoCountPending:(data.demoCountPending != undefined? data.demoCountPending:"&nbsp;"))+'</a>'
								}
							html+='</b>'
						+'</p>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 px-1">'
					+'<div class="full p-2 bg-light-alternate border border-alternate rounded-10 position-relative mr-0 mr-sm-2 mb-2 shadow-sm text-alternate">'
						+'<span class="line-left bg-alternate d-inline-block position-absolute rounded-10"></span>'
						+'<p class="m-0 font-12"><b>Meeting Completed</b></p>'
						+'<p class="m-0">'
							+'<b>';
								if(data.demoCountCompleted == 0){
									html+='<span>'+(data.demoCountCompleted != null? data.demoCountCompleted:(data.demoCountCompleted != undefined? data.demoCountCompleted:"&nbsp;"))+'</span>'
								}else{
									html+='<a href="javascript:void(0)" class="text-alternate" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\'advance-search\',1,\'DC\',\'demoCountCompleted\');">'+(data.demoCountCompleted != null? data.demoCountCompleted:(data.demoCountCompleted != undefined? data.demoCountCompleted:"&nbsp;"))+'</a>'
								}
							html+='</b>'
						+'</p>'
					+'</div>'
				+'</div>'
				
			+'</div>'
		+'</div>';
	return html;
}
function scheduleEventListDetails(data, clickFrom, currentPage, boxSearchCondition, showPagination, countType){
	var getRecordingLimit = getSettingsByTypeAndKey("CONFIGURATION", "SHOW_RECORDINGS_LIMIT");
    getRecordingLimit = JSON.parse(getRecordingLimit);
    var recordingLimit = getRecordingLimit.data.metaValue;
    var pastDateLimit = new Date();
    pastDateLimit.setDate(pastDateLimit.getDate() - recordingLimit);
	var html = 
			'<div class="full overflow-auto" id="">';
				if(data != null && data != undefined && data != ""){
					$.each(data, function(key, item){
						var meetingStartDateTime = new Date(item.meetingDate + " " + item.meetingStartTime);
						
						html+='<table class="table table-bordered font-12 border-radius-table" style="min-width:1380px;width:100%" id="scheduleEventTable'+key+'">'
							+'<thead>'
								+'<tr>'
									+'<th style="width:5%" class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary vertical-align-middle" style="border-top-color:transparent;border-right-color:#fff !important"><input type="checkbox" class="position-relative" id="" name="" style="top:2px"/>&nbsp;'+item.srNo+'</th>'
									+'<th style="width:15%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">'
											+'<span class="bg-'+item.bgColor+' text-white py-1 px-2 d-inline-block border border-white rounded text-center">'+item.meetingFor+'</span><br/>'
											+'Counselor Meeting Date | Time'
									+'</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Invitee Meeting<br/>Date | Time</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Invitee Details</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Status/Meeting Link<br/>Status/Update</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Remark</th>'
									+'<th style="width:10%;border-top-color:transparent;border-right-color:transparent" class="bg-primary text-white bold border-bottom-0 rounded-top-right-10 vertical-align-middle text-center" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
								+'</tr>'
							+'</thead>'
							+'<tbody class="lead-table-css">'
								+'<tr class="">'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="rounded-bottom-left-10"></td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+''+item.name+''
										+'<br/>'
										+''+item.meetingDate+''
										+'<br/>';
										if(item.meetingDate==item.meetingEndDate){
											html+=''+item.meetingStartTime+' - '+item.meetingEndTime+'';
										}else{
											html+=''+item.meetingStartTime+' - '+item.meetingEndDate+' '+item.meetingEndTime+'';
										}
										html+='<br/>'
										+''+item.counselorTimeZone+''
									+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+''+item.inviteeMeetingDate+''
										+'<br/>';
										if(item.inviteeMeetingDate==item.inviteeMeetingEndDate){
											html+=''+item.inviteeStartTime+' - '+item.inviteeEndTime+'';
										}else{
											html+=''+item.inviteeStartTime+' - '+item.inviteeMeetingEndDate+' '+item.inviteeEndTime+'';
										}
										html+='<br/>'
										+''+item.inviteeTimezone+''
									+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+'<table class="w-100">'
											+'<tbody>';
												if(item.leadNo != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Lead No:</th>'
														+'<td class="border-0 p-1" style="word-break:break-word">'+item.leadNo+'</td>'
													+'</tr>';
												}
												if(item.standardName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Grade:</th>'
														+'<td class="border-0 p-1" style="word-break:break-word">'+item.standardName+'</td>'
													+'</tr>';
												}
												if(item.inviteeName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Name:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.inviteeName+'</td>'
													+'</tr>';
												}
												
												if(item.inviteeEmail != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Email:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.inviteeEmail+'</td>'
													+'</tr>';
												}
												if(item.isdCode != '' || item.phoneNo != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Phone No.:</th>'
														+'<td class="border-0 p-1" style="word-break:break-word">';
															var isdCodeValue = item.isdCode.replace(/\s/g, '').split("");
															if(isdCodeValue[0] == "+"){
																html+=item.isdCode;
															}else{
																html+='+'+item.isdCode.replace(/\s/g, '');
															}
															html+='&nbsp;'+item.phoneNo+'</td>'
													+'</tr>';
												}
												if(item.countryName != ''){
													html+='<tr>'
														+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
														+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.countryName+'</td>'
													+'</tr>';
												}else{
													if(item.inviteeCountry != ''){
														html+='<tr>'
															+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
															+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+item.inviteeCountry+'</td>'
														+'</tr>';
													}
												}
												
												
											html+='</tbody>'
										+'</table>'
									+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top">'
										+'<span id="meetingStatus_'+item.leadId+'" >'+item.meetingStatus+'</span>'
										+'<br/>';
										if(item.meetingStatus != 'Cancelled' && item.meetingStatus != 'Reschedule'){
											html+='<a href="'+item.startMeetingUrl+'" target="_blank" class="text-primary font-weight-semi-bold">Start Meeting</a>'
											+'<br/>';
										}
										html+='<a href="'+item.rescheduleUrl+'" target="_blank" class="text-primary font-weight-semi-bold">Reschedule Meeting</a>'
										+'<br/>';
										
										if(item.leadId>0){
											html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\''+item.leadId+'\',\''+item.meetingFor+'\',\''+item.name+'\',\''+item.meetingStartTime+'\',\''+item.meetingEndTime+'\',\''+item.meetingDate+'\',\''+item.meetingEndDate+'\',\''+item.counselorTimeZone+'\',\''+item.inviteeStartTime+'\',\''+item.inviteeEndTime+'\',\''+item.inviteeMeetingDate+'\',\''+item.inviteeMeetingEndDate+'\',\''+item.inviteeTimezone+'\',\''+item.standardName+'\',\''+item.inviteeName+'\',\''+item.inviteeEmail+'\',\''+item.isdCode+'\',\''+item.phoneNo+'\',\''+item.countryName+'\', \''+item.inviteeCountry+'\')">Update</a>';
										}else{
											html+='<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openUpdateStatusModal(\''+item.meetingId+'\',\'0\')">Update</a>';
										}
										if(item.meetingStatus != 'Cancelled' && item.meetingStatus != 'Reschedule'){
											html+='<br/>'
											+'<input class="d-none" type="text" id="copyURL'+key+'" value="'+item.copyLinkUrl+'">'
											+'<b class="copy-msg-'+key+'"></b>'
											+'<button id="copyURL'+key+'" onclick="copyURL(\'copyURL'+key+'\',\'copy-msg-'+key+'\')" class="btn btn-primary btn-sm mt-2">User joining link</a>'
										}
										
									html+='</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top" id="meetingComments_'+item.leadId+'">'+item.meetingComments+'</td>'
									+'<td style="border-top-width:5px;border-top-style:solid;border-top-color:'+item.bgColor+'" class="vertical-align-top text-center rounded-bottom-right-10 ">'
										+'<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="sendMailToInviteeForDemo(\''+item.meetingId+'\')">Send Mail</a>'
										if(item.recordingCount != 0 && (USER_ROLE == "DIRECTOR" || meetingStartDateTime > pastDateLimit)){
											html+='<br>'
											+'<a href="javascript:void(0)" class="text-primary font-weight-semi-bold" onclick="openRecordingModal(\''+item.meetingId+'\',\'MEETINGS\',\''+item.inviteeName+'\',\''+item.meetingFor+'\',\''+item.meetingDate+'\',\''+item.meetingStartTime+'\',\''+item.name+'\',\''+item.meetingDateSingapore+'\',\''+item.meetingStartTimeSingapore+'\')">View Recording <i class="fa fa-eye mt-2"><i/></a>'
										}
									html+='</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>';
					});
					if(!showPagination){
						html+=pagination(clickFrom, boxSearchCondition, countType);
					}
				}
				else{
					html+='<table class="table table-bordered font-12 border-radius-table" style="min-width:1380px;width:100%">'
							+'<thead>'
								+'<tr>'
									+'<th style="width:5%" class="bg-primary text-white bold rounded-top-left-10 border-bottom-0 border-primary vertical-align-middle" style="border-top-color:transparent;border-right-color:#fff !important">&nbsp;1</th>'
									+'<th style="width:15%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">'
											+'Counselor Meeting Date | Time'
									+'</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Invitee Meeting<br/>Date | Time</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Invitee Details</th>'
									+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Status/Meeting Link<br/>Status/Update</th>'
									+'<th style="width:25%" class="bg-primary text-white bold border-bottom-0 text-left vertical-align-middle">Remark</th>'
									+'<th style="width:10%;border-top-color:transparent;border-right-color:transparent" class="bg-primary text-white bold border-bottom-0 rounded-top-right-10 vertical-align-middle text-center" style="border-top-color:transparent;border-right-color:transparent">Action</th>'
								+'</tr>'
							+'</thead>'
							+'<tbody class="lead-table-css">'
								+'<tr class="">'
									+'<td colspan="7" style="border-top-width:5px;border-top-style:solid;border-top-color:orange" class="rounded-bottom-left-10 rounded-bottom-right-10 text-center font-size-lg">No record found based on advanced search</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>';
				}	
			html+='</div>'
		return html;
}	

function updateSystemTraningModal(meetingId, leadId){
	var html =
			'<div id="updateSystemTraningModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+'<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">'
					+'<div class="modal-content border-0">'
						+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
							+'<h5 class="modal-title" id="exampleModalLabel">Update Status</h5>'
							+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
								+'<span aria-hidden="true">×</span>'
							+'</button>'
						+'</div>'
						+'<div class="modal-body">'
							+'<form action="javascript:void(0);" id="scheduleEventMeetingStatus" name="scheduleEventMeetingStatus" autocomplete="off">'
								+'<div class="row">'
									+'<div class="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-12">'
										+'<label>Status</label>'
										+'<select name="status" id="status" class="form-control">'
											+'<option value="">Select Status</option>'
											+'<option value="COMPLETED">Completed</option>'
											+'<option value="NOTATTENDED">No Show</option>'
											+'<option value="CANCELLED">Cancelled</option>'
											+'<option value="RESCHEDULE">Reschedule</option>'
										+'</select>'
									+'</div>'
									+'<div class="col-xl-7 col-lg-7 col-md-7 col-sm-12 col-12">'
										+'<label>Remarks</label>'
										+'<input type="text" name="remarks" id="remarks" class="form-control">'
									+'</div>'
								+'</div>'
							+'</form>'
						+'</div>'
						+'<div class="modal-footer">'
							+'<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
							+'<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" onclick="updateMeetingStatus(\''+meetingId+'\',\''+leadId+'\')">Save</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
}

function confirmeUpdateSystemTraningModal(meetingId, leadId, eventName, name, meetingStartTime, meetingEndTime, meetingDate, meetingEndDate, counselorTimeZone, inviteeStartTime, inviteeEndTime, inviteeMeetingDate, inviteeMeetingEndDate, inviteeTimezone, standardName, inviteeName, inviteeEmail, isdCode, phoneNo, countryName, inviteeCountry){
	var html =
			'<div id="confirmeUpdateSystemTraningModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+'<div class="modal-dialog modal-lg modal-dialog-centered box-shadow-none">'
					+'<div class="modal-content border-0">'
						+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
							+'<h5 class="modal-title">Are you sure you want to cancel '+eventName+'?</h5>'
						+'</div>'
						+'<div class="modal-body">'
							+'<div class="table-responsive full">'
								+'<table class="table table-bordered font-12 border-radius-table" style="min-width:500px;width:100%">'
									+'<thead>'
										+'<tr>'
											+'<th style="width:20%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Invitee Details</th>'
											+'<th style="width:15%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">'
													+'Invitee Meeting Date | Time'
											+'</th>'
											+'<th style="width:10%" class="bg-primary text-white bold border-bottom-0 vertical-align-middle">Counselor Meeting<br/>Date | Time</th>'
										+'</tr>'
									+'</thead>'
									+'<tbody class="lead-table-css">'
										+'<tr class="">'
											+'<td class="vertical-align-top">'
												+'<table class="w-100">'
													+'<tbody>';
														if(standardName != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Grade:</th>'
																+'<td class="border-0 p-1" style="word-break:break-word">'+standardName+'</td>'
															+'</tr>';
														}
														if(inviteeName != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Name:</th>'
																+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+inviteeName+'</td>'
															+'</tr>';
														}
														
														if(inviteeEmail != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Email:</th>'
																+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+inviteeEmail+'</td>'
															+'</tr>';
														}
														if(isdCode != '' || phoneNo != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Phone No.:</th>'
																+'<td class="border-0 p-1" style="word-break:break-word">';
																	if(isdCode!=undefined){
																		var isdCodeValue = isdCode.replace(/\s/g, '').split("");
																		if(isdCodeValue[0] == "+"){
																			html+=isdCode;
																		}else{
																		
																				html+='+'+isdCode.replace(/\s/g, '');
																			
																		}
																	}
																	html+='&nbsp;'+phoneNo+'</td>'
															+'</tr>';
														}
														if(countryName != ''){
															html+='<tr>'
																+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
																+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+countryName+'</td>'
															+'</tr>';
														}else{
															if(inviteeCountry != ''){
																html+='<tr>'
																	+'<th class="border-0 p-1 vertical-align-top" style="width:172px">Country:</th>'
																	+'<td class="border-0 p-1 vertical-align-top" style="word-break:break-word">'+inviteeCountry+'</td>'
																+'</tr>';
															}
														}
													html+='</tbody>'
												+'</table>'
											+'</td>'
											+'<td class="vertical-align-top">'
												+''+inviteeMeetingDate+''
												+'<br/>';
												if(inviteeMeetingDate==inviteeMeetingEndDate){
													html+=''+inviteeStartTime+' - '+inviteeEndTime+'';
												}else{
													html+=''+inviteeStartTime+' - '+inviteeMeetingEndDate+' '+inviteeEndTime+'';
												}
												html+='<br/>'
												+''+inviteeTimezone+''
											+'</td>'
											+'<td class="vertical-align-top">'
												+''+name+''
												+'<br/>'
												+''+meetingDate+''
												+'<br/>';
												if(meetingDate==meetingEndDate){
													html+=''+meetingStartTime+' - '+meetingEndTime+'';
												}else{
													html+=''+meetingStartTime+' - '+meetingEndDate+' '+meetingEndTime+'';
												}
												html+='<br/>'
												+''+counselorTimeZone+''
											+'</td>'
											
										+'</tr>'
									+'</tbody>'
								+'</table>'	
							+'</div>'						
						+'</div>'
						+'<div class="modal-footer">'
							+'<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" onclick="comfirmeupdateMeetingStatus(0,0,\'No\')">No</button>'
							+'<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4" onclick="comfirmeupdateMeetingStatus(\''+meetingId+'\',\''+leadId+'\',\'Yes\')">Yes</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
}

function moveEventModal(){
	var html =
			'<div id="moveEventModal" class="modal fade fade-scale" tabindex="" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">'
				+'<div class="modal-dialog modal-md modal-dialog-centered box-shadow-none">'
					+'<div class="modal-content border-0">'
						+'<div class="modal-header pt-2 pb-2 theme-bg text-white">'
							+'<h5 class="modal-title" id="exampleModalLabel">Move CTI</h5>'
							+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
								+'<span aria-hidden="true">×</span>'
							+'</button>'
						+'</div>'
						+'<div class="modal-body">'
							+'<div class="full">'
								+'<table class="table border rounded-10" style="border-collapse:separate">'
									+'<tbody>'
										+'<tr>'
											+'<td class="border-0" style="width:135px"><strong>Event Name:</strong></td>'
											+'<td class="border-0">CTI</td>'
										+'</tr>'
										+'<tr>'
											+'<td class="border-0" style="width:135px"><strong>Counselor Name:</strong></td>'
											+'<td class="border-0">Alwin Sabu</td>'
										+'</tr>'
										+'<tr>'
											+'<td class="border-0" style="width:135px"><strong>Invitee Name:</strong></td>'
											+'<td class="border-0">Demo Student</td>'
										+'</tr>'
										+'<tr>'
											+'<td class="border-0" style="width:135px"><strong>Date | Time:</strong></td>'
											+'<td class="border-0">Mar 21, 2024 9:00 to 9:50 PM '+BASE_TIMEZONE+'</td>'
										+'</tr>'
									+'</tbody>'
								+'</table>'
							+'</div>'
							+'<div class="full">'
								+'<form action="javascript:void(0);" id="" name="" autocomplete="off">'
									+'<div class="row">'
										+'<div class="col-12">'
											+'<label class="font-weight-bold">Move To:</label>'
											+'<select name="moveTo" id="moveTo" class="form-control">'
												+'<option value="">Pooja</option>'
												+'<option value="">Alwin</option>'
											+'</select>'
										+'</div>'
									+'</div>'
								+'</form>'
							+'</div>'
						+'</div>'
						+'<div class="modal-footer">'
							+'<button type="button" class="btn btn-info btn-shadow float-right pr-4 pl-4 ml-2" data-dismiss="modal">Close</button>'
							+'<button type="button" class="btn btn-success btn-shadow float-right pr-4 pl-4">Save</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>';
		return html;
}
function pagination(clickFrom, boxSearchCondition, countType){
	var html = 
        '<ul class="pagination">';
            if(currentPage != 1){
                html+='<li class="page-item">'
                    +'<a class="page-link" href="javascript:void(0);" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\',\''+clickFrom+'\',\''+(currentPage-1)+'\',\''+boxSearchCondition+'\',\''+countType+'\');">Previous</a>'
                +'</li>';
            }
            for(var i =1; i<=noOfPages;i++){
                if(i <= startPageLimit || i > (noOfPages -1) || (i>=leftLimit && i<rightLimit)){
                    if(i > (noOfPages -1) || (i<leftLimit && i>rightLimit)){
                        html+='...'
                    }
                    html+='<li class="page-item">'
                        +'<a class="page-link"  href="javascript:void(0);" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\', \''+clickFrom+'\',\''+i+'\',\''+boxSearchCondition+'\',\''+countType+'\');" style="'+(i==currentPage?'background-color: #cdeedd !important;':'')+'">'+i+'</a>'
                    +'</li>';
                }
            }
            if(currentPage < noOfPages){
                html+='<li class="page-item">'
                    +'<a class="page-link" href="javascript:void(0);" onclick="getDataForScheduledEvents(\'scheduleEventsSearchForm\', \''+clickFrom+'\',\''+(currentPage+1)+'\',\''+boxSearchCondition+'\',\''+countType+'\');">Next</a>'
                +'</li>';
            }
		html+='</ul>';
        return html;
}