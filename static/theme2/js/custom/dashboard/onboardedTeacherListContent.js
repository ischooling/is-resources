function paymentReport(){
	var html =
	'<div class="col-md-12 mt-4">'
		+'<div class="main-card mb-3">'
			+'<div class="full">'
				+'<h5 class="text-primary font-weight-semi-bold">TEACHER LIST</h5>'
				+'<div class="d-flex border-bottom full pb-2 border-primary">'
					+'<div class="search full mr-auto" style="max-width:450px"></div>'
					+'<button class=" btn btn-primary  text-white  btn-full-mobile mr-2" onclick="getWatiBroadcastTemplates()">Wati Broadcast</button>'
					+'<button class=" btn btn-primary  text-white  btn-full-mobile mr-2" onclick="getWatiLogsFilterRecords()">Logs</button>'
					+'<div class="filter-btn ml-2 d-inline-flex align-items-center">'
						+'<a href="javascript:void(0)" class="btn btn-outline-primary mr-1 showFilterForm" >'
							+'<i class="fa fa-filter"></i>'
						+'</a>'
						// +'<a href="javascript:void(0)" class="btn btn-outline-primary" onclick="downloadStudentPaymentReport(\'\',false,1)">'
						// 	+'<i class="fa fa-download"></i>'
						// +'</a>'
					+'</div>'
				+'</div>'
				+filterOnboardedTeacherListForm()
			+'</div>'
			+'<div class="row m-0" id="consolidate">'
				
			+'</div>'
			+updateRefferelCode()
			+'<div class="full mt-2" id="onboardedTeacherList">'
			+'<div id="selectTeacherAllDiv" class="hidden"><input type="checkbox" id="selectTeacherAll" class="ml-2">&nbsp; All</div>'
			+'<input type="hidden" name="teacherIdMove" id="teacherIdMove" value="">'
				+'<table id="onboardedTeacherListTable" class="table table-hover table-striped table-bordered">'
					// +'<thead>'
					// 	+'<tr>'
					// 		+'<th>&nbsp;</th>'
					// 	+'</tr>'
					// +'</thead>'
					+'<tbody>'
					+'</tbody>'
				+'</table>'
				+'<div class="full mt-2">'
					+'<ul id="pagination" class="pagination-sm"></ul>'
				+'</div>'
			+'</div>'
		+'</div>'
	+'</div>'
	+'<div class="server-message">'
			+'<span class="msg" id="msgTheme2"></span>'
		+'</div>'
		+deleteWarning();
	return html;
}

function cardDetails(data){
	var html = '';
	$.each(data.data, function(key, item) {
		html+=`<tr>
				<td class="p-0">
					<div class="mb-3 card">
						<div class="card-header-tab card-header">
							<div class="card-header-title mr-auto">
								<input type="checkbox" class="checkTeacher" id="teacher-${item.userId}" name="teacher-move-another" value="${item.userId}" /> 
								<span class="mx-2">${key+1}.</span>`;
								html+=`<img  id="profileImageStudent" name="profileImageStudent" width="42" class="rounded-circle user-header-img" src="${PATH_FOLDER_IMAGE}${item.gender === "FEMALE"? 'female-profile':'male-profile' }.png${SCRIPT_VERSION}" alt="image"  thumbType=""/>`;
								html+=`<div class="px-2 mb-0 w-100 rounded" style="background:#f0f9ff">
									<h6 class="full">
										<span class="text-uppercase font-weight-semi-bold d-inline-block" style="font-size:11px">
											${item.applicationNo} | ${item.employmentType} | ${item.phoneNo}
										</span>
									</h6>
									<h5 class="mb-1"><span class="font-weight-bold text-primary teacher-name-${item.userId}"  teachername="${item.name}" phoneno="${item.phoneNo}">${item.name}&nbsp;</h5></div>
							</div>
							<div>
							${item.watibroadcast?`<a href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Wati Logs"  id="wati_logs_link" onclick="showWatiLogDetailsByTeacherUserId('${item.userId}')">
                   				 <img src="${PATH_FOLDER_IMAGE2}leadlist_icons/Wati.svg${SCRIPT_VERSION}" style="width:26px; margin-bottom: 4px;padding:4px;" />
							</a>`:''}
							
							</div>
						</div>
						<div class="card-body">
								<div class="p-2" style="background:#f0f9ff;">
                                    <div class="row">
                                        <div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Name:</label>
                                            <span class="field-value trans5s">${item.name}</span>
                                        </div>
                                        <div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Email:</label>
                                            <span class="field-value trans5s dobViewDate">${item.email}</span>
                                        </div>
                                        <div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Username:</label>
                                            <span class="field-value trans5s ">${item.username}</span>
                                        </div>
										 <div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">gender:</label>
                                            <span class="field-value trans5s ">${item.gender}</span>
                                        </div>
									</div>
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Employment Type:</label>
                                            <span class="field-value trans5s ">${item.employmentType}</span>
                                        </div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold"> Country | State | City </label>
                                            <span class="field-value trans5s ">${item.countryName} | ${item.state} | ${item.city}</span>
                                        </div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Timezone:</label>
                                            <span class="field-value trans5s ">${item.timezone}</span>
                                        </div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Offset:</label>
                                            <span class="field-value trans5s ">${item.offset}</span>
                                        </div>
                                    </div>
                                    <div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
                                            <label class="label bold">Courses Name:</label>
                                            <span class="field-value trans5s ">${item.coursesName}</span>
                                        </div>
                                    </div>
								</div>
                        </div>
					</div>
				</td>
			</tr>`;
	});	

	
	return html;
}

function filterOnboardedTeacherListForm(){
	var html = 
	'<div class="filterOnboardedTeacherListForm" style="display:block">'
		+'<div class="card">'
			+'<div class="card-body">'
				+'<form id="onboardedTeacherListForm">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>LMS Platform</label>'
							+'<select id="learningPlatform" class="form-control selectReset">'
								+'<option value="">Select LMS Platform</option>'
								+getLmsPlatformContent(SCHOOL_ID)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Grade</label>'
							+'<select id="gradeId" class="form-control selectReset">'
								+'<option value="">Select Grade</option>'
								// +getGradeListContent(SCHOOL_ID)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Course</label>'
							+'<select name="subjectId" id="subjectId" class="form-control selectReset">'
							+'<option value="">Select Course</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Country Name</label>'
							+'<select name="countryId" id="countryId" class="form-control selectReset">'
								+getCountryListContent(SCHOOL_ID)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Teacher Name</label>'
							+'<input type="text" name="teacherName" id="teacherName" value="" class="form-control" />'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Teacher Email</label>'
							+'<input type="text" name="teacherEmail" id="teacherEmail" value="" class="form-control" />'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Application No.</label>'
							+'<input type="text" name="applicationNo" id="applicationNo" value="" class="form-control" />'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 d-none">'
							+'<label>Page Number</label>'
							+'<input type="text" id="pageNumber" value="0" class="form-control" placeholder="Page Number">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<div class="row">'
								+'<div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">'
									+'<label>Page Size</label>'
									+'<select id="pageSize" class="form-control">'
										+'<option value="10">10</option>'
										+'<option value="25">25</option>'
										+'<option value="50">50</option>'
										+'<option value="100">100</option>'
										+'<option value="150">150</option>'
										+'<option value="200">200</option>'
									+'</select>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 text-right ml-auto">'
							+'<label class="full">&nbsp;</label>'
							+'<a href="javascript:void(0)" class="btn btn-danger mr-1 resetOnboardedTeacherList" onClick="resetOnboardedTeacherListForm(\'onboardedTeacherListForm\');" ><i class="fa fa-undo"></i>&nbsp;Reset</a>'
							+'<a href="javascript:void(0)" class="btn btn-success searchOnboardedTeacherList" onClick="getOnboardedTeacherListData(1, \'search\');" ><i class="fa fa-search"></i>&nbsp;Search</a>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function updateRefferelCode(){
	var html=`<div class="modal fade bd-example-modal-lg fade-scale" id="updateReferralCodeModal" tabindex="-1" aria-hidden="true">
		<div class="modal-dialog modal-md" role="document">
			<div class="modal-content">
				
				<div class="modal-header py-2 bg-primary text-white">
					<h5 class="modal-title">Update Referral Code</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body">
					<div class="full">
						<input type="hidden" name="studentStandardId" id="studentStandardId"/>
						<select id="newReferralCode" name="newReferralCode" class="form-control selectReset multiple-select-option">
								<option value="">ALL</option>`;
								html+=getUserBasedOnCriteria('USER_LIST_BY_ROLE_SCHOOL', SCHOOL_ID, '', '');
							html+=`</select>
					</div>
					<div class="full text-right">
						<a href="javascript:void(0)" class="btn btn-primary" onclick="saveReferralCodeFromPaymentWindow();">Update</a>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html
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
											<span aria-hidden="true">&times;</span>
										</button>
									</div>
									<form class="full" action="javascript:void(0);">
										<div class="full mb-1 mt-1 table-responsive">
											<table class="table" id="watiBroadcastTable" style="font-size:14px;min-width:450px">
												<thead>
													<tr class="bg-primary">
														<th class="border text-white rounded-top-left-5">S. No.</th>
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
										<button id="mswatiBroadcastSendThroughMobileClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger " onclick="selfModalHide('mswatiBroadcastSendThroughMobile'); closeModalAndFlushData();">&times;</button>
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
													<th style='width:70px;' class="text-primary">S. No.</th>
													<th class="px-1 text-primary">Name</th>
													<th class="rounded-top-right-5 text-primary">Phone Number</th>
												</tr>
											</thead>
											<tbody>`;
											$.each($("input[name='teacher-move-another']:checked"), function(index, checkbox) {
												var userId = $(checkbox).val(); 
												var name = $(".teacher-name-" + userId).attr("teachername") || '';
												var phone = $(".teacher-name-" + userId).attr("phoneno") || '';
												html += `<tr id="esmsgcol_${userId}">
															<td>
																<div class="custom-checkbox custom-control">
																	<input type="checkbox" name="chk-users-lead" 
																		id="${userId}" 
																		value="${userId}" 
																		class="custom-control-input checkToSend">
																	<label id="label_${userId}" 
																		class="custom-control-label" 
																		for="${userId}"></label>
																</div>
															</td>
															<td class="font-weight-bold">${index+1}</td>
															<td class="font-weight-bold">
																<input type="hidden" name="name" value="${name}" class="name">
																${name}
																<span class="stmsg" id="esmsg_${userId}"></span>
															</td>
															<td>
															<input type="hidden" name="mobileNo" value="${phone}" class="mobileNo">
																	<div>${phone}</div>
															</td> 
														</tr>`;
												
											});
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
function getWatiTemplatesHtml(){
	var html='';
	html+='<div class="for_watiLogsTableData done" id="logData"> </div>'
	+'<div class="for_allWatiTemplatesList done" id="allWatiTemplatesList"> </div>'
	+'<div class="for_mbroadcastWatiSendTable done" id="usrPopData"> </div>'
	+'<div class="for_userPopDataEmaildone" id="userPopDataEmail"> </div>'
	+'<div id="allWatiUsersList"> </div>'
	+'<div class="for_successFailedWatiMessagesModal done" id="usrPopDataOnResend"> </div>'
	+'<div class="for_successFailedEmailMessagesModal done" id="usrPopDataOnResendEmail"> </div>'
	+'<div class="for_allEmailTemplatesList done" id="allEmailTemplatesList"></div>';
	return html;
}

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
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body pt-1" style='max-height: 500px;overflow-y: auto;'>
							<div class="flex-grow-1">
								<form class="full" action="javascript:void(0);">
									<div class="full mb-1 mt-1 table-responsive">
										<table class="table" id="mwatiBroadcastTable" style="font-size:14px;min-width:450px">
											<thead>
												<tr style='background-color:#E7F3FF;'>
													<th style="width: 15%;color:#007EFF !important;" class="border text-white rounded-top-left-5">S. No.</th>
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
			// $("#wati_logs_link_"+leadElement.leadID).show();
			if(leadElement.status=='success'){
				sDataObj={};
				//console.log("leadElement at successFailedWatiMessagesModal :: " + leadElement);
				sDataObj["phoneNumber"]=leadElement.phoneNumber;
				sDataObj["leadId"]=leadElement.leadID;
				sDataObj["name"]=leadElement.name;
				sDataObj["mobileNo"]=leadElement.mobileNo;
				sDataObj["leadVerifiedStatus"]=leadElement.leadVerifiedStatus;
				sData.push(sDataObj);
			}else{
				fDataObj={};
				//console.log("leadElement at successFailedWatiMessagesModal :: " + leadElement);
				fDataObj["phoneNumber"]=leadElement.phoneNumber;
				fDataObj["leadId"]=leadElement.leadID;
				fDataObj["name"]=leadElement.name;
				fDataObj["mobileNo"]=leadElement.mobileNo;
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
										<button id="successFailedWatiMessagesModalClose" style='width:16px;height:16px;font-size:22px;display:flex;justify-content:center;align-items:center;padding:0px 10px 4px;' type="button" class="btn btn-danger " onclick="selfModalHide('successFailedWatiMessagesModal'); closeModalAndFlushData();">&times;</button>
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
															<th style='width:80px;' class="rounded-top-left-5 px-1 text-primary">S. No.</th>
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
																<th style='width:50px;' class="text-primary">S. No.</th>
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


function viewWatiTemplate(flag, indexNumber, templateName){ //console.log("flag ::" + flag + " indexNumber :: "+indexNumber + " templateName:: "+templateName);
	if(flag){
		$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
		$(".wati-wrapper").addClass("active-wati-template");
		$(".wati-template").removeClass("hide-wati-template");
		$(".wati-template").addClass("show-wati-template");
		$("#priviewTemplate").html('');
		$("#priviewTemplateSecond").html('');
		$("#priviewTemplateThird").html('');
		setTimeout(function(){
			$("#priviewTemplate").html(getViewTemplate(watiTemplateContent.messageTemplates[indexNumber]));
			$("#priviewTemplateSecond").html(getViewTemplate(watiTemplateContent.messageTemplates[indexNumber]));
			$("#priviewTemplateThird").html(getViewTemplate(watiTemplateContent.messageTemplates[indexNumber]));
		},200)
	}else{
		$(".wati-wrapper").removeClass("active-wati-template");
		$(".wati-template").addClass("hide-wati-template");
		$(".wati-template").removeClass("show-wati-template");
	}
}

function getViewTemplate(data){ //console.log("inside getViewTemplate data :: " + JSON.stringify(data));
    var jsonData= [data] //console.log("inside getViewTemplate jsonData :: " + JSON.stringify(jsonData));
	var html =  '';
	var imgURL = '';
        $.each(jsonData, function(index, value){ //console.log('value : '+ JSON.stringify(value.header));
            html+='<div class="main-card card mx-auto mb-3" style="max-width:300px;">'
            +'<div class="card-body p-2">'
				if(value.header.mediaFromPC!=null && value.header.mediaFromPC!=''){
					html+='<img src="/'+ imgURL+value.header.mediaFromPC+'" class="w-100 mb-3" style="max-width:250px">'	
				}
                html+='<ul class="p-0">';
					var list = value.bodyOriginal.split("\n");
                    $.each(list, function(i, item){
                        html+='<li class="'+(i<5? "mb-3":(i==15? "mb-3":""))+'">'+item+'</li>';
                    });
                html+='</ul>'
                +'<div class="mt-3">'
                    +value.footer
                +'</div>'
                +'<hr class="mb-0"/>'
                +'<div class="full">';
					if(value.buttons != null && value.buttons != ''){
						$.each(value.buttons, function(i, item){
							html+='<div class="full font-weight-semi-bold text-primary text-center py-1">'+item.parameter.text+'</div>';
						});
					}
				html+='</div>'
            +'</div>'
        +'</div>';
        });
    return html;
}

function gotoBackWatiModal(){
	$('#allchecked').prop('checked',false);
	$('input[name="chk-users-lead"]').prop('checked',false);
	$('#allcheckedFailed').prop('checked',false);
	$('input[name="chk-users-lead-resend"]').prop('checked',false);
	$("#mswatiBroadcastSendThroughMobile").modal("hide");
	$("#successFailedWatiMessagesModal").modal("hide");
	$("#mcustomWatiTemplatesList").modal("show");
	viewWatiTemplate(false);
}

function getSelectedUsersData() {
    var selectedUsers = [];

    $.each($("input[name='chk-users-lead']:checked"), function() {
        var row = $(this).closest("tr");
        var userId = $(this).val();   // <-- this is leadId
        var name = row.find("input.name").val() || '';
        var grade = row.find("input.grade").val() || '';

        // collect hidden mobile numbers in this row

        row.find("input.mobileNo").each(function() {
            var num = $(this).val()?.trim();
            if (num) {
				selectedUsers.push({
					userId: userId,  
					name: name,
					grade:grade,
					mobileNo: num
				});
            }
        });  
    });

    return selectedUsers;
}


function sendWatiNotification(templateName, index){
	var request={};
	$("#table_row_"+ templateName).addClass('selected_row').siblings().removeClass('selected_row');
	$('#templateName').html('<b>' + templateName + '</b> '); //$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);"  onclick="return showWarningMessageShow(\'Are you sure you want to send this data?\',\'sendWatiNotification( \\\''+templateName+'\\\','+index+') \');">SEND MSG</a>');
	boolval =true;
	$('#viewMethodCalling').html('<a href="javascript:void(0)" class="btn btn-primary btn-sm rounded-circle" onclick="viewWatiTemplate('+boolval+','+index+', `'+templateName+'`);" > <i class="fa fa-eye text-white"></i> </a>');
	
	$('#confirm_btn_data').html('<a id="confirm_btn" class="btn btn-primary mr-2" href="javascript:void(0);" >SEND</a>');
	$('#selectionCount').html('<span>Selected- </span><span id="selectedCount">0</span> / <span id="totalCount">0</span>');
	$("#mswatiBroadcastSendThroughMobile").modal("show");

	// var table = $('#mbroadcastWatiSendTable').DataTable(); 
    // if (table) {
    //     table.destroy();
    // }
	// $("#mbroadcastWatiSendTable").dataTable({
	// 	columnDefs: [
	// 		{ orderable: false, targets: 0 }
	// 	]
	// });
	$("#mcustomWatiTemplatesList").modal("hide");

	var totalCheckboxes = $(".checkToSend").length;
    $("#totalCount").text(totalCheckboxes);
	
	$("#confirm_btn").click(function () {
		console.log("Confirm btn clicked::");
		var sleads ='';
		var leadNo='';
		$.each($("input[name='chk-users-lead']:checked"), function(){
			leadNo = leadNo+','+$(this).val();
		});
		
		sleads = sleads + leadNo;
		var selectedLeads = sleads.substring(1,sleads.length); 
		//console.log("selectedLeads:::" + selectedLeads);
		if(selectedLeads==''){ 
			// $('#remarksresetDelete1').modal('hide');
			$('#remarksresetDelete2').modal('hide');
			showMessageTheme2(0, 'Please check any one user to send message','',false);
			return false;
		}else{
			var selectedUsers = JSON.stringify(getSelectedUsersData());
			showWarningMessageShow('Are you sure you want to send this data?','sendWatiNotificationToUserForTeacher( '+index+',\''+templateName+'\',\''+selectedUsers+'\',\'send\')', 'info-modal-sm');
		}

	});
	//viewWatiTemplate(false);

	$(".checkToSend").click(function(){
		updateSelectionCount();
		var arrChkBox = [];
		if($(".checkToSend:checked").length>0){
			if($(".checkToSend:checked").length == $(".checkToSend").length){
				$("#allchecked").prop("checked",true);
			}else{
				$("#allchecked").prop("checked",false);
			}
			// $("#allcheckedDiv").addClass("d-inline-block").removeClass("d-none");
		}else{
			// $("#allcheckedDiv").addClass("d-none").removeClass("d-inline-block");
			$("#allchecked").prop("checked",false);
		}
	});
	$("#allchecked").click(function(){
		if($(this).prop("checked")){
			$(".checkToSend").prop("checked",true);
		}else{
			$(".checkToSend").prop("checked",false);
		}
		updateSelectionCount();
	});

	function updateSelectionCount(){
        var selectedCount = $(".checkToSend:checked").length;
        $("#selectedCount").text(selectedCount);
    }
}

function gotoBackWatiModal(){
	$('#allchecked').prop('checked',false);
	$('input[name="chk-users-lead"]').prop('checked',false);
	$('#allcheckedFailed').prop('checked',false);
	$('input[name="chk-users-lead-resend"]').prop('checked',false);
	$("#mswatiBroadcastSendThroughMobile").modal("hide");
	$("#successFailedWatiMessagesModal").modal("hide");
	$("#mcustomWatiTemplatesList").modal("show");
	viewWatiTemplate(false);
}

function selfModalHide(modalID){
	$("#"+modalID).modal("hide");
	viewWatiTemplate(false);
}
function deleteWarning(warningMessage, callbackFunction) {
	var html =
		'<div class="modal fade fade-scale mt-3" id="remarksresetDelete2" tabindex="-1" aria-hidden="true" >'
			+'<div class="modal-dialog modal-sm" role="document">'
				+'<div class="modal-content shadow-lg">'
					+'<div class="modal-header pt-2 pb-2 bg-primary justify-content-center">'
						+'<h5 class="heading text-white text-center" id="warningMessage2">' + warningMessage + '</h5>'
					+'</div>'
					+'<div id="statusMessage-2" class="modal-body delete-modal text-center">'
						+'<i class="fas fa-sync fa-4x text-primary"></i>'
					+'</div>'
					+'<div class="modal-footer">'
						+'<div class="m-auto">'
							+'<button id="resetDeleteErrorWarningYes2" type="button" class="btn btn-outline-primary mr-2" onclick="' + callbackFunction + '">Yes</button>'
							+'<button id="resetDeleteErrorWarningNo2" type="button" class="btn btn-primary mr-1" data-dismiss="modal">No</button>'
							+'<button id="resetDeleteErrorWarningCancel2" type="button" class="btn btn-success mr-1" data-dismiss="modal" style="display: none;">Close</button>'
						+'</div>'
					+'</div>'
				+'</div>'
			+'</div>'
		+'</div>';
	return html;
}

function getWatiLogsRecordsFilterModal(){
	var html=
		`<div class="modal fade" id="watiLogsRecordsFilterModal" role="dialog">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title ">Logs</h5>
						<button type="button" class="close text-white" data-dismiss="modal">&times;</button>
					</div>
					<div class="modal-body" style="margin-top: 0 !important; position: relative; padding: 15px !important;">
						<form class="form-row" id="watiLogsRecords" autocomplete="off">
						<div class="col-md-12 col-lg-2">
							<label>Counsoler Name</label>
							<select name="counsolerToSearch" id="counsolerToSearch" class="form-control" multiple>'
								<option value="">Select Counsoler</option>'
							</select>
						</div>
							<div class="col-md-12 col-lg-2">
								<label>Fillter</label>
								<select class="form-control mr-1" id="searchDateType" name="searchDateType">
									<option value="DAY">Today</option>
									<option value="WEEK">Week</option>
									<option value="MONTH">Month</option>
									<option value="CUSTOM">Custom</option>
								</select>
							</div>
							<div class="col-md-12 col-lg-2" id="endDateDiv">
								<label>Start Date<sup class="text-danger">*</sup></label>
								<input class="form-control" name="startDate" id="startDate" placeholder="Start Date"/>    
							</div> 
							<div class="col-md-12 col-lg-2" id="endDateDiv">
								<label>End Date<sup class="text-danger">*</sup></label>
								<input class="form-control" name="endDate" id="endDate" placeholder="End Date"/>    
							</div>
							<div class="col-md-12 col-lg-1">
								<label>Page Size<sup class="text-danger">*</sup></label>
								<input class="form-control" name="pageSize" id="pageSize" value="10" placeholder="Page Size" onkeydown="return M.digit(event);"/>    
							</div>
						</form>
						<hr/>
						<div id="watilogsRecordsWrapper">
							<table class="table table-bordered font-12 border-radius-table" id="watilogsRecordsTable" style="width:100%">
								<thead>
									<tr>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10" style="5% !important">Sr no.</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Counselor Name</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Teacher Name | Application No</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Template Name</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Status</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Delivered Date Time</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">Action</th>
									</tr>
								</thead>
								<tbody id="watilogsRecordsTbody"></tbody>
							</table>
						</div>
						<div class="watiRecordsListPagging"></div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-success" onclick="getWatiLogsRecords(\'watiLogsRecords\', \'1\');">Search</button>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}

function getWatiRecordsList(data){
	var html=``;
	if(data.details.length>0){
		$.each(data.details, function(i, v){
			html+=
			`<tr>
				<td>${((data.pageNo-1)*10)+(i+1)}</td>
				<td>${v.counselorName}</td>
				<td>${v.teacherName} | <b>${v.applicationNo}</b></td>
				<td>${v.templateName}</td>
				<td>${v.status}</td>
				<td>${convertDatetimeWithFormat(v.deliveredDateTime, 'Asia/Kolkata', USER_TIMEZONE, 'MMM DD, YYYY hh:mm a')}</td>
				<td>
					<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="showWatiLogDetails(\'${v.id}\',\'${v.watiContactNo}\', \'${v.templateName}\')">View</a>
				</td>
			</tr>`;
		});
	}else{
		html+=
			`<tr>
				<td colspan="6" class="font-weight-bold text-center">No record found</td>
			</tr>`;
	}
	return html;
}


function getWatiLogDetailsModal(){
	var html=
		`<div class="modal fade" id="watiLogDetailsModal" role="dialog">
			<div class="modal-dialog modal-xl">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title ">Logs Details</h5>
						<button type="button" class="close text-white" data-dismiss="modal">&times;</button>
					</div>
					<div class="modal-body" style="margin-top: 0 !important; position: relative; padding: 15px !important;">
						<div id="watiLogDetailsWrapper">
							<table class="table table-bordered font-12 border-radius-table" id="watiLogDetailsTable" style="width:100%">
								<thead>
									<tr>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-left-10" style="5% !important">Sr no.</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Template Name</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle">Delivered Date Time</th>
										<th class="bg-primary text-white font-weight-normal border-bottom-0 vertical-align-middle rounded-top-right-10">Action</th>
									</tr>
								</thead>
								<tbody id="watiLogDetailsTbody"></tbody>
							</table>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>`;
	return html;
}


function getViewWatiTemplateModal(templates = []) {
	if (!Array.isArray(templates) || templates.length === 0) {
		return `
			<div id="viewWatiTemplateModal" class="modal fade bd-example-modal-lg fade-scale" role="dialog" aria-hidden="true">
				<div class="modal-dialog modal-xl" style="width: 80% !important;">
					<div class="modal-content border-0">
						<div class="modal-header py-1 bg-primary text-white">
							<h5 class="modal-title font-weight-bold">Wati Logs</h5>
							<button type="button" class="close text-white" data-dismiss="modal">
								<span aria-hidden="true">×</span>
							</button>
						</div>
						<div class="modal-body text-center">
							<h5>No Chat Yet.</h5>
						</div>
					</div>
				</div>
			</div>`;
	}
	let html = `<div id="viewWatiTemplateModal" class="modal fade bd-example-modal-lg fade-scale" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" style="display: none; z-index: 1050;" aria-hidden="true">
					<div class="modal-dialog modal-xl" style="width: 80% !important;">
						<div class="modal-content border-0">
							<div class="modal-header py-1 bg-primary text-white">
								<h5 class="modal-title font-weight-bold">Wati Logs</h5>
								<button type="button" class="close text-white" data-dismiss="modal">
									<span aria-hidden="true">×</span>
								</button>
							</div>
							<div class="modal-body pt-1">
								<div class="chat-body">`;
									templates.forEach((t) => {
										let msg = (t.template || "").replace(/\n\n/g, "<p>") + "<p>";
										let date = new Date(t.dateTime);
										let currentDateStr = date.toLocaleDateString("en-US", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
										});
										let timeString = date.toLocaleTimeString("en-US", {
											hour: "numeric",
											minute: "2-digit",
											hour12: true,
										});

										html += `
											<div class="date-separator">
												<span>${currentDateStr}</span>
											</div>
											<div class="message sent">
												<div class="message-bubble">
													 ${t.sentBy ? `<div class="message-time">${t.sentBy}</div>` : ''}
													${msg}
													<div class="message-time">${timeString}</div>
												</div>
											</div>
										`;
									});
							html += `
								</div>
							</div>
						</div>
					</div>
				</div>`;
	return html;
}

function getWatiRecordsListPagging(datalimit){
	var noOfPages = datalimit.totalPages;
	var currentPage = datalimit.pageNo;
	var showPageLimit = 2;
	var leftLimit=currentPage-showPageLimit;
	var rightLimit=currentPage+showPageLimit+1;
	var startPageLimit=5;
	var html='';
	if(noOfPages>1){
		html+='<ul class="pagination">';
			if(currentPage != 1){
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getWatiLogsRecords(\'watiLogsRecords\', \''+(currentPage-1)+'\')">Previous</a>'
			 	+'</li>';
			 }
			for (let p = 1; p <= noOfPages; p++) {
				if(p < startPageLimit || p > (noOfPages -1) || (p>=leftLimit && p<rightLimit) ){
					if(p > (noOfPages -1) || (p<leftLimit && p>rightLimit)){
						html+='...';
					}
					html+='<li class="page-item">'
					+'<a href="javascript:void(0);" onclick="getWatiLogsRecords(\'watiLogsRecords\', \''+(p)+'\');" class="page-link '+(p==currentPage?'page-link-active':'')+'">'+p+'</a>'
					+'</li>';
				}else{

				}
			}
			if(currentPage<noOfPages){
				var nextPage=parseInt(currentPage)+1;
				html+='<li class="page-item">'
				+'<a class="page-link" href="javascript:void(0);" onclick="getWatiLogsRecords(\'watiLogsRecords\', \''+nextPage+'\');">Next</a>'
				+'</li>';
			}
		html+='</ul>';
	}
	return html;
}