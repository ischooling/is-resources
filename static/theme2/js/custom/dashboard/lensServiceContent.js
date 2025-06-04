

function renderClassDetails(){
	var html=
		'<div class="main-card mb-3 card">'
			+'<div class="card-body">'
				+'<div class="row">'
					+'<div class="col-lg-4 col-md-6 col-sm-8 col-12">'
						+'<label>Select Date</label>'
						+'<input type="text" id="classDate" class="form-control">'
					+'</div>'
					+'<div class="col-lg-8 col-md-6 col-sm-4 col-12">'
						+'<label class="full">&nbsp;</label>'
						+'<a href="javascript:void(0)" class="btn btn-success btn-sm" onClick="getLensClassBasedOnDate();">Proceed</a>'
					+'</div>'
				+'</div>'
				+'<table id="lensClassDetails" class="table table-hover table-striped table-bordered">'
					+'<thead>'
						+'<tr>'
							+'<th>Class Date</th>'
							+'<th>Entity Type</th>'
							+'<th>Class Time</th>'
							+'<th>Action</th>'
						+'</tr>'
					+'</thead>'
					+'<tbody>'
					+'</tbody>'
				+'</table>'
			+'</div>'
		+'</div>'
		+customLoaderContent();
	return html;    
}
function lensClassContent(lensClassDetails){
	var html = '';
	$.each(lensClassDetails, function(k, v) {
		html+='<tr>'
			+'<td>'+v.classDate+'</td>'
			+'<td>'+v.entityType+'</td>'
			+'<td>'+v.startTime+' - '+v.endTime+'</td>'
			+'<td>';
				if(v.lensClassId!='' && v.lensSessionId!=''){
					html+='<a href="javascript:void(0)" class="btn btn-sm btn-primary" onClick="getClassDetailsBySession(\''+v.lensClassId+'\',\''+v.lensSessionId+'\')"><i class="fa fa-eye"></i>&nbsp;View</a>';
					// html+='<a href="javascript:void(0)" class="btn btn-sm btn-primary" onClick="getClassDetailsBySession(\'6548aca6ab5ab233b1c30d6d\',\'6549fcd796211f1fc5f41b48\')"><i class="fa fa-eye"></i>&nbsp;View</a>';
				}else{
					html+='Class not started yet';
				}
			html+='</td>'
		+'</tr>'
	});
	return html;    
}

function getClassSessionModal(data){
	var html =
		'<div class="modal fade-out" tabindex="-1" id="classSessionModal" role="dialog" aria-labelledby="classSessionModal" aria-modal="true">'
			+'<div class="modal-dialog modal-xl">'
				+'<div class="modal-content">'
					+'<div class="modal-header bg-primary py-2">'
						+'<h5 class="modal-title text-white" id="exampleModalLongTitle">Class Session</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">'
							+'<span aria-hidden="true">×</span>'
						+'</button>'
					+'</div>'
					+'<div class="modal-body">'
						+getClassSessionContent(data)
					+'</div>'
					+'<div class="modal-footer">'
						+'<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
						// +'<button type="button" class="btn btn-primary">Save changes</button>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}
function getClassSessionContent(data){
	var html = 
		getClassSessionHead(data)
		+getClassSessionAttendanceContent(data)
	return html;
}
function getClassSessionHead(data){
	var html =
		'<div class="card mb-2">'
			+'<div class="card-body pt-3 ">'
				+'<div class="full">'
					+'<h5 class="text-left font-weight-semi-bold mb-1">Class Session</h5>'
					+'<p class="text-dark font-weight-normal">'+data.title+'</p>'
				+'</div>'
				+'<hr>'
				+'<div class="full">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0">'
							+'<div class="d-flex justify-content-start">'
								+'<span class="icon-wrapper icon-wrapper-alt rounded mr-2 ml-0 mt-1" style="width: 32px;height: 32px;">'
									+'<span class="icon-wrapper-bg bg-primary"></span>'
									+'<i class="fa fa-calendar text-primary font-size-md"></i>'
								+'</span>'
								+'<span class="">'
									+'<label class="session-date font-weight-semi-bold mb-0">'
										+moment(data.startTime).format('MMM DD, yyyy')
										// +'&nbsp;'+moment(data.startTime).format('hh:ss a')
										// +" - "+moment(data.endTime).format('hh:ss a')
									+'</label>'
									+'<div class="session-time"> '+moment(data.startTime).format('hh:ss a')+'&nbsp;'
										+'<label>';
											var diff=moment.duration(moment(data.endTime).diff(moment(data.startTime)))
											html+='<i class="fa fa-clock text-primary"></i>&nbsp;'+(diff.hours()>0?diff.hours()+' hour ':'')+diff.minutes()+' mins '+diff.seconds()+' secs' 
										+'</label>'
									+'</div>'
								+'</span>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0">'
							+'<div class="d-flex justify-content-start">'
								+'<span class="icon-wrapper icon-wrapper-alt rounded mr-2 ml-0 mt-1" style="width: 32px;height: 32px;">'
									+'<span class="icon-wrapper-bg bg-warning"></span>'
									+'<i class="fa fa-exclamation text-warning font-size-md"></i>'
								+'</span>'
								+'<span class="">'
									+'<label class="session-date font-weight-semi-bold mb-0">Session Status</label>'
									+'<div class="session-time">'+data.meetingStatus+'<label></div>'
								+'</span>'
							+'</div>'
						+'</div>';
						if(data.rawRecordings.length>0){
							html+='<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0">'
								+'<div class="d-flex justify-content-start">'
									+'<span class="icon-wrapper icon-wrapper-alt rounded mr-2 ml-0 mt-1" style="width: 32px;height: 32px;">'
										+'<span class="icon-wrapper-bg bg-primary"></span>'
										+'<i class="fa fa-play-circle text-primary font-size-md"></i>'
									+'</span>'
									+'<span class="">'
										+'<label class="session-date font-weight-semi-bold mb-0">Recording</label><div class="session-time text-success">Available';
										data.rawRecordings.map((items,i)=> html+=' <a href="javascript:void(0)" class="text-primary d-inline-block ml-1 text-decoration-none" onclick="openVideo(\''+items.url+'\')"><i class="fa fa-play-circle"></i>&nbsp;Play'+(i+1)+'</a>')
									html+='</div></span>'
								+'</div>'
							+'</div>';
						}
					html+='</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;

}

function openVideoModal(videoUrl){
	var html = 
		'<div class="modal fade-out" tabindex="-1" id="videoModal" role="dialog" aria-labelledby="classSessionModal" aria-modal="true" style="z-index: 1040; display: none;" aria-hidden="true">'
			+'<div class="modal-dialog modal-xl">'
				+'<div class="modal-content">'
					+'<div class="modal-header bg-primary py-2">'
						+'<h5 class="modal-title text-white" id="exampleModalLongTitle">Class Session</h5>'
						+'<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>'
					+'</div>'
					+'<div class="modal-body">'
						+'<video width="100%" height="500" controls class="videoTag">'
							+'<source src="'+videoUrl+'" type="video/mp4">'
							+'Your browser does not support the video tag.'
						+'</video>'
					+'</div>'
					+'<div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button></div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}


function getClassSessionAttendanceContent(data){
	var html = 
		'<div class="row">'
			+'<div class="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12 mb-2">'
				+'<div class="card">'
					+'<div class="card-body p-0">'
						+getClassSessionAttendanceHead(data)
						+getClassSessionAttendanceTable(data)
					+'</div>'
				+'</div>'
			+'</div>'
			+getClassSessionTeacherFeedback(data)
		+'</div>';
	return html;
}
function getClassSessionAttendanceHead(data){
	var html = 
		'<div class="full pt-3">'
			+'<div class="row m-0">'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0">'
					+'<div class="full">'
						+'<div class="d-flex ml-1">'
							+'<span class="icon-wrapper icon-wrapper-alt rounded-circle ml-0 mr-2" style="width:32px;height:32px">'
								+'<span class="icon-wrapper-bg bg-primary"></span>'
								+'<i class="fa fa-users text-primary font-size-md"></i>'
							+'</span>'
							+'<span class="">'
								+'<h5 class="session-date font-weight-bold mb-0 text-left">'+data.liveClassInsight.participants.length+'</h5>'
								+'<div class="session-time">Participants</div>'
							+'</span>'
						+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0">'
					+'<div class="full">'
						+'<div class="d-flex ml-1">'
							+'<span class="icon-wrapper icon-wrapper-alt rounded-circle ml-0 mr-2" style="width:32px;height:32px">'
								+'<span class="icon-wrapper-bg bg-warning"></span>'
								+'<i class="fa fa-clock text-warning font-size-md"></i>'
							+'</span>'
							+'<span class="">';
								var totalTalkTime=0;
								var hostTalktime=0;
								data.liveClassInsight.participants.map((item, i)=>{
									totalTalkTime+=item.speakingDuration;
									if(item.type=='host'){
										hostTalktime=item.speakingDuration;
									}
								});
								var totalSecs=0;
								if(hostTalktime>0){
									totalSecs=parseFloat((hostTalktime*100)/totalTalkTime).toFixed(2);
								}
								html+='<h5 class="session-date font-weight-bold mb-0 text-left">'+totalSecs+'%</h5>'
								+'<div class="session-time">Host talktime</div>'
							+'</span>'
						+'</div>'
					+'</div>'
				+'</div>'
				+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-12 mb-3 mb-sm-0">'
					+'<div class="full">'
						+'<div class="d-flex ml-1">'
							+'<span class="icon-wrapper icon-wrapper-alt rounded-circle ml-0 mr-2" style="width:32px;height:32px">'
								+'<span class="icon-wrapper-bg bg-success"></span>'
								+'<i class="fa fa-user text-success font-size-md"></i>'
							+'</span>'
							+'<span class="">'
								+'<h5 class="session-date font-weight-bold mb-0 text-left" style="letter-spacing: inherit;">to be updated later</h5>'
								+'<div class="session-time">Attentiveness</div>'
							+'</span>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>'
		+'<hr class="mb-0">';
	return html;
}
function getClassSessionAttendanceTable(data){
	var html = 
		'<div class="full class-session-table-rapper">'
			+'<table class="class-session-table table mb-0">'
				+getClassSessionAttendanceTableHead(data)
				+getClassSessionAttendanceTableBody(data)
			+'</table>'
		+'</div>';	
	return html;
}
function getClassSessionAttendanceTableHead(data){
	var html =
		'<thead>'
			+'<tr>'
				+'<th>Name</th>'
				+'<th>Attendance</th>'
				+'<th>Attentive</th>'
				+'<th>Talktime</th>'
			+'</tr>'
		+'</thead>';
	return html;
	
}
function getClassSessionAttendanceTableBody(data){
	var html='<tbody>';
		data.liveClassInsight.participants.map((item, i)=>{
			html+=
				'<tr>'
					+'<td class="name">'
						+item.name+' ('+item.type+')'
					+'</td>'
					+'<td>'+item.attendancePercent+'%</td>'
					+'<td>'+item.attentionPercent+'%</td>'
					+'<td><i class="fa fa-user text-success"></i>&nbsp; '+convertMsToTime(item.speakingDuration)+'</td>'
				+'</tr>';
		}) 
		html+='</tbody>';
	return html;
}
function getClassSessionTeacherFeedback(data){
	var html =
		'<div class="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12">'
			+getClassSessionTeacherFeedbackContent(data)
			+getClassSessionRatingAndFeeback(data)
		+'</div>'	
	return html;
}
function getClassSessionTeacherFeedbackContent(data){
	var html =
		'<div class="card">'
			+'<div class="card-body">'
				+'<div class="full">'
					+'<div class="d-flex ml-1">'
						+'<span class="icon-wrapper icon-wrapper-alt rounded-circle ml-0 mr-2" style="width:32px;height:32px">'
							+'<span class="icon-wrapper-bg bg-warning"></span>'
							+'<i class="fa fa-comment text-warning font-size-md"></i>'
						+'</span>'
						+'<span class="">'
							+'<h3 class="session-date font-weight-bold mb-0 text-left" style="letter-spacing: inherit;">Teacher Feedback</h3>'
						+'</span>'
						+'<span class="ml-auto">'
							+'<a href="javascript:void(0)" class="text-primary text-decoration-none">Edit</a>'
						+'</span>'
					+'</div>'
				+'</div>'
				+'<hr>'
				+'<div>'
					+'<label class="session-date font-weight-semi-bold mb-0">Session Status</label>'
					+'<div class="session-time">Coming soon</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}
function getClassSessionRatingAndFeeback(data){
	var html =
		'<div class="card mt-2">'
			+'<div class="card-body">'
				+'<div class="full">'
					+'<div class="d-flex ml-1">'
						+'<span class="icon-wrapper icon-wrapper-alt rounded-circle ml-0 mr-2" style="width:32px;height:32px">'
							+'<span class="icon-wrapper-bg bg-warning"></span>'
							+'<i class="fa fa-comment text-warning font-size-md"></i>'
						+'</span>'
						+'<span class="">'
							+'<h3 class="session-date font-weight-bold mb-0 text-left" style="letter-spacing: inherit;">NA</h3>'
							+'<div class="session-time">Rating & feedback (0)</div>'
						+'</span>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function customLoaderContent(){
	// var html = 
	// 	'<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">'
	// 		+'<div class="loader primary-border-top-color">'
	// 			+'<div class="full">'
	// 				+'<img src="'+PATH_FOLDER_IMAGE2+'is_loader.gif" alt="'+SCHOOL_NAME+' Loader"/>'
	// 			+'</div>'
	// 		+'</div>'
	// 	+'</div>';
	var html = `
		<div id="commonloaderIdNewLoader" class="loader-wrapper d-flex justify-content-center align-items-center loader-style hide-loader">
			<img src="`+PATH_FOLDER_IMAGE2+`loader-new.gif" alt="`+SCHOOL_NAME+` Loader" class="new-loader-2024" />
		</div>
	`
	return html;
}
