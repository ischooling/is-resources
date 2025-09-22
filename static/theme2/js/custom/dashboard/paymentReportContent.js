function paymentReport(){
	var html =
	'<div class="col-md-12 mt-4">'
		+'<div class="main-card mb-3">'
			+'<div class="full">'
				+'<h5 class="text-primary font-weight-semi-bold">STUDENT LIST</h5>'
				+'<div class="d-flex border-bottom full pb-2 border-primary">'
					+'<div class="search full mr-auto" style="max-width:450px">'
						+'<input type="text" id="studentName"  placeholder="Search by Student Name, Email, Country/ City or Student-Id" class="form-control border-0 text-primary" style="background: #f0f9ff;"/>'
					+'</div>'
					+'<button class=" btn btn-primary  text-white  btn-full-mobile mr-2" onclick="getWatiBroadcastTemplates()">Wati Broadcast</button>'
					+'<div class="filter-btn ml-2 d-inline-flex align-items-center">'
						+'<a href="javascript:void(0)" class="btn btn-outline-primary mr-1 showFilterForm" >'
							+'<i class="fa fa-filter"></i>'
						+'</a>'
						// +'<a href="javascript:void(0)" class="btn btn-outline-primary" onclick="downloadStudentPaymentReport(\'\',false,1)">'
						// 	+'<i class="fa fa-download"></i>'
						// +'</a>'
					+'</div>'
				+'</div>'
				+filterStudentPaymentReportForm()
			+'</div>'
			+'<div class="row m-0" id="consolidate">'
				
			+'</div>'
			+updateRefferelCode()
			+'<div class="full mt-2" id="studentPaymentReport">'
			+'<div id="selectStudentAllDiv" class="hidden"><input type="checkbox" id="selectStudentAll" class="ml-2">&nbsp; All</div>'
			+'<input type="hidden" name="studentIdMove" id="studentIdMove" value="">'
				+'<table id="studentPaymentReportTable" class="table table-hover table-striped table-bordered">'
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

	//(l==0?'fa-angle-up':'fa-angle-down')
	var html = '';
	$.each(data.reports, function(key, item) {
		
		var sprogress =0;
		sprogress=item.progressReport=='N/A'?0.0:item.progressReport.replace("%","");
		html+=`<tr>
				<td class="p-0">
					<div class="mb-3 card">
						<div class="card-header-tab card-header">
							<div class="card-header-title">
								<input type="checkbox" class="checkStudent" id="student-${item.userId}" name="student-move-another" value="${item.userId}" /> 
								<span class="mx-2">${key + 1}.</span>`;
								if(item.updateProfileStudentDTO.profileImage=='' || item.updateProfileStudentDTO.profileImage==null){
									html+=`<img  id="profileImageStudent" name="profileImageStudent" width="42" class="rounded-circle user-header-img" src="${PATH_FOLDER_IMAGE}profile-picture.jpg${SCRIPT_VERSION}" alt="image"  thumbType=""/>`;
								}else{
									html+=`<img id="profileImageStudent" name="profileImageStudent" width="42" class="rounded-circle user-header-img" src="${item.updateProfileStudentDTO.profileImage}" alt="image" title="Profile Image" thumbType=""/>`;
								}
								
								html+=`<div class="px-2 mb-0 w-100 rounded" style="background:#f0f9ff">
									<h6 class="full">
										<span class="text-uppercase font-weight-semi-bold d-inline-block" style="font-size:11px">
											${item.rollNumber} | ${item.enrolledStatus} | ${item.gradeName} | ${item.learningPlan} | ${item.lmsPlatform}
										</span>
									</h6>
									<h5 class="mb-1"><span class="font-weight-bold text-primary student-name-${item.userId}" studentname="${item.studentName}" studentgrade="${item.gradeName}">${item.studentName}&nbsp;&nbsp;<a href='javascript:void(0)' onclick='getAsPost(\"/dashboard/profile-view-content?userId=${item.userId}&moduleId=8&studentStandardId=${item.studentStandardId}&actionType=1a\")' class=''><i class='fa fa-eye'></i>&nbsp;</a></span></h5></div>
							</div>
							<ul class="nav">
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-0${item.studentStandardId}" class="nav-link show active">Summery</a></li>
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-1${item.studentStandardId}" class="nav-link show">Basic Detail</a></li>
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-2${item.studentStandardId}" class="nav-link show">Parent Detail</a></li>
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-3${item.studentStandardId}" class="nav-link show">Contact Info</a></li>
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-4${item.studentStandardId}" class="nav-link show">Academic Detail</a></li>
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-5${item.studentStandardId}" class="nav-link show">Payment</a></li>
								<li class="nav-item"><a data-toggle="tab" href="#tab-eg5-6${item.studentStandardId}" class="nav-link show ">Communication Log</a></li>
							</ul>
						</div>
						<div class="card-body">
							<div class="tab-content">
							<div class="tab-pane p-2 show active" id="tab-eg5-0${item.studentStandardId}" role="tabpanel" style="background:#f0f9ff;">
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Gender:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.gender}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">LMS Status:</label>
											<span class="field-value trans5s  ${item.updateProfileStudentDTO.lmsUserStatus==1?'text-success':'text-danger'}">${item.updateProfileStudentDTO.lmsUserStatus==1?'Enabled': (item.updateProfileStudentDTO.lmsUserId!=null)?'Disabled':'Not Created'}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Enrollment Date:</label>
											<span class="field-value trans5s">${item.semesterStartDate}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Enrolled Status:</label>
											<span class="field-value trans5s ${item.enrolledStatus=='Withdrawn'?'text-danger':'text-success'}">${item.enrolledStatus}</span>`;
											if(item.advBookSeat==1){
												html+=`<br/><span class="field-value trans5s ${item.advBookSeat==1?'text-success':''}">${item.advBookSeat==1?'Reserve a Seat for Next Grade':''}</span>`;
											}
											if(item.advPayment==1){
												html+=`<br/><span class="field-value trans5s ${item.advPayment==1?'text-success':''}">${item.advPayment==1?'Advance payment for Next Grade':''}</span>`;
											}
										html+=`</div>
									</div>
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Nationality:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.nationality}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Lms UserId | User Name | Password:</label>
											<span class="field-value trans5s "><br/>${item.updateProfileStudentDTO.lmsUserId==null?'N/A':item.updateProfileStudentDTO.lmsUserId} |  ${item.updateProfileStudentDTO.lmsUserName} |  ${item.updateProfileStudentDTO.lmsUserPassword}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Academic Start - End Dates:</label>
											<span class="field-value trans5s "><br/>${item.enrollmentStartDate=='N/A'?'N/A':(item.enrollmentStartDate+' - '+item.enrollmentEndDate)}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Payment Plan:</label>
											<span class="field-value trans5s ">${item.paymentPlanName}</span>
										</div>
									</div>	
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Enrollment | Recommended By:</label>`;
											if(item.counselorName!='N/A'){
												html+=`<span class="field-value trans5s ">${item.counselorName}</span>`;
											}else{
												html+=`<a href="javascript:void(0);" class="btn btn-primary" onclick="return callUserReferralUpdatePaymentWindow('formId','${item.studentStandardId}','8');"><i class="fa fa-cogs"></i>&nbsp;Update Referral Code</a>`;
											}
											
										html+=`</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Overall Progress Report:</label>
											<span class="field-value trans5s ${sprogress>=0 && sprogress<60 ?'text-danger':'text-success'}">${item.progressReport=='N/A'?'0%':item.progressReport}`;
											if(item.updateProfileStudentDTO.lmsUserStatus==1){
												html+=`&nbsp;&nbsp;<a href='javascript:void(0)' onclick='getAsPost(\"/dashboard/student-progress-report?moduleId=18&linkType=externalLink-${item.userId}\")' class=''><i class='fa fa-eye'></i>&nbsp;</a></span>`;
											}
										html+=`</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Remaining Days:</label>
											<span class="field-value trans5s ${(item.remainingDays.indexOf("Academic Year End")!=-1 || item.remainingDays=='N/A')?'text-danger':'text-success'} ">${item.remainingDays}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Fee Details:</label>
											<span class="field-value trans5s "><span class="font-weight-semi-bold  d-inline-block float-right font-size-md ${(item.overDue <0? 'text-danger':'text-success')} ">${(item.overDue <0? 'Overdue by ':'Scheduled in ')+item.overDue} days</span></span>
										</div>
									</div>	
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">System Orientation:</label>
											<span class="field-value trans5s ${item.systemOrientStatus!='COMPLETED'?'text-danger':'text-success'}"><br/>${item.systemOrientStatus} - ${item.systemOrientDate==''?'No seleted':item.systemOrientDate}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Teacher Mapping:</label>
											<span class="field-value trans5s ">${item.teacherMapStaus>0?'Completed':'Pending'}`;
											// if(item.teacherMapStaus==0){
											// 	html+=`&nbsp;&nbsp;<a href="javascript:void(0);" class="" onclick="return callAssignStudentTeacher('formId','${item.studentId}','true','true','true','${item.updateProfileStudentDTO.standardId}');"><i class="fa fa-eye"></i></a>`;
											// }
											html+=`</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Transcript Publish:</label>
											<span class="field-value trans5s ${item.marksheetStatus!='Y'?'text-danger':'text-success'}">${item.marksheetStatus=='Y'?'Yes':'No'}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Last Follows:</label>
											<span class="field-value trans5s ">${item.lastFollowby==null?'No Followup': item.lastFollowby +' - '+item.lastFollowDate}</span>
										</div>
									</div>	
								</div>
								<div class="tab-pane p-2 show" id="tab-eg5-1${item.studentStandardId}" role="tabpanel" style="background:#f0f9ff;">
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Gender:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.gender}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Date of Birth:</label>
											<span class="field-value trans5s dobViewDate">${item.updateProfileStudentDTO.dateOfBirth}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Birth Place(City):</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.birthPlace!=''?item.updateProfileStudentDTO.birthPlace:'N/A'}</span>
										</div>
										
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">TimeZone:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.timeZoneName}</span>
										</div>
									</div>
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Nationality:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.nationality}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Hobbies:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.hobbies}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Blood Group:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.bloodGroup}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">City | Country:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.city} | ${item.updateProfileStudentDTO.country}</span>
										</div>
									</div>	`;
										// <div class="row">
										// 	<div class="col-md-3 col-sm-6 col-xs-12 text-center proof-flex-item mb-3 mb-sm-0">
										// 		<label class="label bold">Age Proof :</label>`
										// 		if(item.updateProfileStudentDTO.ageProofDocs=='' || item.updateProfileStudentDTO.ageProofDocs==null){
										// 			html+=`<a id="fileupload2img" href="javascript:void('0');" class="full mt-1 1 border" onclick="viewAttachment(this, 'uploadFile','I')">
										// 					<img  id="fileupload2imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}no-image.jpg${SCRIPT_VERSION}" alt=""  thumbType=""/>
										// 				</a>`;
										// 		}else if(item.updateProfileStudentDTO.ageProofDocs.indexOf(".pdf")!=-1){
										// 			html+=`<a id="fileupload2img" href="javascript:void(0);" data-PDFURL="${item.updateProfileStudentDTO.ageProofDocs}" class="full mt-1 2 border" onclick="viewAttachment(this, 'uploadFile','P')" >
										// 					<img id="fileupload2imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}pdf.jpg${SCRIPT_VERSION}" alt="" title="" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 				</a>`;
										// 		}else{
										// 			html+=`<a id="fileupload2img" href="javascript:void(0);" class="full mt-1 3 border" onclick="viewAttachment(this, 'uploadFile','I')" >
										// 				<img id="fileupload2imgIcon" width="100" class="crop-uplod-img" src="${item.updateProfileStudentDTO.ageProofDocs}" alt="" title="Birth Certificate" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 			</a>`;
										// 		}
												
										// 	html+=`</div>
										// 	<div class="col-md-3 col-sm-6 col-xs-12 text-center proof-flex-item mb-3 mb-sm-0">
										// 		<label class="label bold">Address Proof:</label>`;
										// 			if(item.updateProfileStudentDTO.addressProofDocs=='' || item.updateProfileStudentDTO.addressProofDocs==null){
										// 				html+=`<a id="fileupload3img" href="javascript:void('0');" class="full mt-1 1 border" onclick="viewAttachment(this, 'uploadFile','I')">
										// 						<img  id="fileupload3imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}no-image.jpg${SCRIPT_VERSION}" alt=""  thumbType=""/>
										// 					</a>`;
										// 			}else if(item.updateProfileStudentDTO.addressProofDocs.indexOf(".pdf")!=-1){
										// 				html+=`<a id="fileupload3img" href="javascript:void(0);" data-PDFURL="${item.updateProfileStudentDTO.addressProofDocs}" class="full mt-1 2 border" onclick="viewAttachment(this, 'uploadFile','P')" >
										// 						<img id="fileupload3imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}pdf.jpg${SCRIPT_VERSION}" alt="" title="" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 					</a>`;
										// 			}else{
										// 				html+=`<a id="fileupload3img" href="javascript:void(0);" class="full mt-1 3 border" onclick="viewAttachment(this, 'uploadFile','I')" >
										// 					<img id="fileupload3imgIcon" width="100" class="crop-uplod-img" src="${item.updateProfileStudentDTO.addressProofDocs}" alt="" title="Birth Certificate" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 				</a>`;
										// 			}
										// 		html+=`</div>
										// 		<div class="col-md-3 col-sm-6 col-xs-12 text-center proof-flex-item mb-3 mb-sm-0">
										// 			<label class="label bold">Parent Passport:</label>`;
										// 			if(item.updateProfileStudentDTO.signatureDocs=='' || item.updateProfileStudentDTO.signatureDocs==null){
										// 				html+=`<a id="fileupload4img" href="javascript:void('0');" class="full mt-1 1 border" onclick="viewAttachment(this, 'uploadFile','I')">
										// 						<img  id="fileupload4imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}no-image.jpg${SCRIPT_VERSION}" alt=""  thumbType=""/>
										// 					</a>`;
										// 			}else if(item.updateProfileStudentDTO.signatureDocs.indexOf(".pdf")!=-1){
										// 				html+=`<a id="fileupload4img" href="javascript:void(0);" data-PDFURL="${item.updateProfileStudentDTO.signatureDocs}" class="full mt-1 2 border" onclick="viewAttachment(this, 'uploadFile','P')" >
										// 						<img id="fileupload4imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}pdf.jpg${SCRIPT_VERSION}" alt="" title="" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 					</a>`;
										// 			}else{
										// 				html+=`<a id="fileupload4img" href="javascript:void(0);" class="full mt-1 3 border" onclick="viewAttachment(this, 'uploadFile','I')" >
										// 					<img id="fileupload4imgIcon" width="100" class="crop-uplod-img" src="${item.updateProfileStudentDTO.signatureDocs}" alt="" title="Birth Certificate" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 				</a>`;
										// 			}

										// 	html+=`</div>
										// 	<div class="col-md-3 col-sm-6 col-xs-12 text-center proof-flex-item mb-3 mb-sm-0">
										// 		<label class="label bold">Last Academic Proof:</label>`;
										// 			if(item.updateProfileStudentDTO.lastAcadmeicProofDocs=='' || item.updateProfileStudentDTO.lastAcadmeicProofDocs==null){
										// 				html+=`<a id="fileupload5img" href="javascript:void('0');" class="full mt-1 1 border" onclick="viewAttachment(this, 'uploadFile','I')">
										// 						<img  id="fileupload5imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}no-image.jpg${SCRIPT_VERSION}" alt=""  thumbType=""/>
										// 					</a>`;
										// 			}else if(item.updateProfileStudentDTO.lastAcadmeicProofDocs.indexOf(".pdf")!=-1){
										// 				html+=`<a id="fileupload5img" href="javascript:void(0);" data-PDFURL="${item.updateProfileStudentDTO.lastAcadmeicProofDocs}" class="full mt-1 2 border" onclick="viewAttachment(this, 'uploadFile','P')" >
										// 						<img id="fileupload5imgIcon" width="100" class="crop-uplod-img" src="${PATH_FOLDER_IMAGE2}pdf.jpg${SCRIPT_VERSION}" alt="" title="" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 					</a>`;
										// 			}else{
										// 				html+=`<a id="fileupload5img" href="javascript:void(0);" class="full mt-1 3 border" onclick="viewAttachment(this, 'uploadFile','I')" >
										// 					<img id="fileupload5imgIcon" width="100" class="crop-uplod-img" src="${item.updateProfileStudentDTO.lastAcadmeicProofDocs}" alt="" title="Birth Certificate" style="height: 125px;object-fit: contain;" thumbType=""/>
										// 				</a>`;
										// 			}
												
										// 	html+=`</div>
										// 	<p id="allDocsUploaded" style="${(item.updateProfileStudentDTO.lastAcadmeicProofDocs!='' && item.updateProfileStudentDTO.lastAcadmeicProofDocs != null && item.updateProfileStudentDTO.signatureDocs!='' && item.updateProfileStudentDTO.signatureDocs != null && item.updateProfileStudentDTO.addressProofDocs!='' && item.updateProfileStudentDTO.addressProofDocs != null && item.updateProfileStudentDTO.ageProofDocs!='' && item.updateProfileStudentDTO.ageProofDocs != null)? 'display:block':'display:none'}" class="col-md-12 col-sm-12 col-xs-12 text-success text-center my-2">All documents uploaded.</p>
										// 	<p id="allDocsNotUploaded" style="${(item.updateProfileStudentDTO.lastAcadmeicProofDocs=='' || item.updateProfileStudentDTO.lastAcadmeicProofDocs == null ||  item.updateProfileStudentDTO.signatureDocs=='' || item.updateProfileStudentDTO.signatureDocs == null ||  item.updateProfileStudentDTO.addressProofDocs=='' || item.updateProfileStudentDTO.addressProofDocs == null || item.updateProfileStudentDTO.ageProofDocs=='' || item.updateProfileStudentDTO.ageProofDocs == null)? 'display:block':'display:none'}" class="col-md-12 col-sm-12 col-xs-12 text-primary text-center my-2">Please upload files in following formats (<b>jpg, jpeg, pdf or png</b>) with max size <b>5 MB</b> </p>
										// </div>
								html+=`</div>
								<div class="tab-pane p-2 show" id="tab-eg5-2${item.studentStandardId}" role="tabpanel" style="background:#f0f9ff;">
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Parent/Guardian Name:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.guardianName}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Type of Relation:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.guardianTypeOfRelation}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">City | Country:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.cityParent} | ${item.updateProfileStudentDTO.countryParent}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Gender:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.guardianGender}</span>
										</div>
									</div>
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Parent SMS Created?:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.parentSmsCreated!=''?item.updateProfileStudentDTO.parentSmsCreated:'N/A'}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Parent LMS Created?:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.parentLmsCreated!=''?item.updateProfileStudentDTO.parentLmsCreated:'N/A'}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Parent LMS Status:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.parentLmsStatus!=''?item.updateProfileStudentDTO.parentLmsStatus:'N/A'}</span>
										</div>
									</div>	
								</div>
								<div class="tab-pane p-2 show" id="tab-eg5-3${item.studentStandardId}" role="tabpanel" style="background:#f0f9ff;">
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Parent Email:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.guardianEmail}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Parent Contact No:</label>
											<span class="field-value trans5s parent-phone-${item.userId}" number="${item.updateProfileStudentDTO.guardianContactCodeNo} ${item.updateProfileStudentDTO.guardianContactNo}">${item.updateProfileStudentDTO.guardianContactCodeNo} ${item.updateProfileStudentDTO.guardianContactNo} </span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Alternate Phone:</label>
											<span class="field-value trans5s parent-phone-alt-${item.userId}" number="${item.updateProfileStudentDTO.guardianWorkCodeNo} ${item.updateProfileStudentDTO.guardianWorkContactNo}" >${item.updateProfileStudentDTO.guardianWorkCodeNo} ${item.updateProfileStudentDTO.guardianWorkContactNo}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Your Preferred Communication:</label>
											<span class="field-value trans5s">
												<label for="pcWhatsappView" class="radio d-inline-flex align-items-center px-2 cursor">
													<input class="mr-1" type="checkbox" id="pcWhatsappView" name="pcWhatsappView" value="WhatsApp" ${item.updateProfileStudentDTO.communicationWhatsApp == "Y" ?"checked":""} disabled=""> 
													<span>WhatsApp&nbsp;</span>
													<img src="${PATH_FOLDER_IMAGE}watsapp-icon.png" width="16px"> 
												</label>
												<label for="pcCallView" class="radio d-inline-flex align-items-center px-2 cursor">
													<input class="mr-1" type="checkbox" id="pcCallView" name="pcCallView" value="Call" ${item.updateProfileStudentDTO.communicationCall == "Y" ?"checked":""} disabled="">
													<span>Call&nbsp;</span><i class="fa fa-phone"></i>
												</label>
												<label for="pcEmailView" class="radio d-inline-flex align-items-center px-2 cursor">
													<input class="mr-1" type="checkbox" id="pcEmailView" name="pcEmailView" value="Email" ${item.updateProfileStudentDTO.communicationEmail == "Y" ?"checked":""} disabled="">
													<span>Email&nbsp;</span><i class="fa fa-envelope"></i>
												</label>
											</span>
										</div>
									</div>
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Student Email/ Username:</label>
											<span class="field-value trans5s">${item.updateProfileStudentDTO.emailId}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Student Phone No:</label>
											<span class="field-value trans5s student-phone-${item.userId}" number="${item.updateProfileStudentDTO.phoneCode} ${item.updateProfileStudentDTO.phoneNo}">${item.updateProfileStudentDTO.phoneCode} ${item.updateProfileStudentDTO.phoneNo} </span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Student Alternate Phone:</label>
											<span class="field-value trans5s student-phone-alt-${item.userId}" number="${item.updateProfileStudentDTO.altPhoneCode} ${item.updateProfileStudentDTO.altPhoneNo}">${item.updateProfileStudentDTO.altPhoneCode} ${item.updateProfileStudentDTO.altPhoneNo}</span>
										</div>
									</div>
								</div>
								<div class="tab-pane p-2 show" id="tab-eg5-4${item.studentStandardId}" role="tabpanel" style="background:#f0f9ff;">
									<div class="row">
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Enrollment Date:</label>
											<span class="field-value trans5s">${item.semesterStartDate}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Academic Dates:</label>
											<span class="field-value trans5s ">${item.enrollmentStartDate} - ${item.enrollmentEndDate}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Remaining Days:</label>
											<span class="field-value trans5s  ${(item.remainingDays.indexOf("Academic Year End")!=-1 || item.remainingDays=='N/A')?'text-danger':'text-success'} ">${item.remainingDays}</span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Weekly Report Frequency:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.weeklyReportFrequency!=null?item.updateProfileStudentDTO.weeklyReportFrequency:'N/A'}</span>
										</div>
									</div>
									<div class="row">
										<div class="col-xl-12">
											<div class="user-course-details">
												<div class="Profile-field-row compulsorySubjectsdiv ">`;
													if(item.updateProfileStudentDTO.standardId != 9 && item.updateProfileStudentDTO.standardId != 10 ){
														html+=`<p class="m-0"><b>Courses (`;
															if(item.updateProfileStudentDTO.courseProviderId == 39 && (USER_ROLE == 'STUDENT' || USER_ROLE == 'PARENT')){
																html+=`${item.updateProfileStudentDTO.courseProviderName}`;
															}else{
																html+=`${item.updateProfileStudentDTO.standardName}`;
															}
																	
															html+=`)</b></p>`;
													}
													if(item.updateProfileStudentDTO.standardId == 9 || item.updateProfileStudentDTO.standardId == 10 ){
														html+=`<p class="m-0"><b>${item.updateProfileStudentDTO.standardName}</b></p>`;
													}
													html+=`<div class="scroll-course-list scrollbar-container ps--active-y ps">`;
														// <ol class="ml-0">`;
														// 	if(item.creditDetails){
														// 		for (let index = 0; index < item.creditDetails.length; index++) {
														// 			const element = item.creditDetails[index];
														// 			html+=`<li>${element.subjectName} (${element.progress}%) </li>`;
														// 		}
														// 	}
															
														// html+=`</ol>
														html+=`
															<table class="table table-bordered table-striped border-radius-table font-12 responsive nowrap">
																<thead>
																	<tr>
																		<th>Course Name</th>
																		<th>Teacher</th>
																		<th>Start Date</th>
																		<th>End Date</th>
																		<th>Progress</th>
																		<th>Credit</th>
																	</tr>
																</thead>	
																<tbody>	`;
																if(item.creditDetails){
																	for (let index = 0; index < item.creditDetails.length; index++) {
																		const element = item.creditDetails[index];
																		html+=`<tr>
																			<td>${element.subjectName}</td>
																			<td>${element.teacherName}</td>
																			<td>${item.enrollmentStartDate}</td>
																			<td>${item.enrollmentEndDate=='Dec 31,2999'?'On Going':item.enrollmentEndDate}</td>
																			<td class="text-center">${element.progress}%</td>
																			<td class="text-center">${element.credits}</td>
																		</tr>`;
																	}
																}
																html+=`</tbody>	
															</table>
													</div>
												</div>
												
											</div>

										</div>
									
									</div>
								</div>
								<div class="tab-pane show" id="tab-eg5-5${item.studentStandardId}" role="tabpanel">
									<div class="row">
										<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
											<div class="p-2 mb-2" style="background:#f0f9ff">
												<h5 class="font-weight-semi-bold">Past</h5>
												<span class="font-weight-semi-bold opacity-7 font-size-sm">Past -&nbsp;</span>
												<span class="opacity-7 font-size-sm">${item.paid.date} | ${item.paid.amount}</span>
												<div>
													<span class="font-weight-semi-bold opacity-7 font-size-sm">Plan -&nbsp;</span>
													<span class="opacity-7 font-size-sm">${item.paymentPlanName}</span>
												</div>
												<div>
													<span class="font-weight-semi-bold opacity-7 font-size-sm">Payment Title -&nbsp;</span>
													<span class="opacity-7 font-size-sm">${item.paid.paymentTitle}</span>
												</div>
											</div>
											<div class="p-2 mb-2" style="background:#f0f9ff">
												<h5 class="font-weight-semi-bold">Fee Details <span class="font-weight-semi-bold  d-inline-block float-right font-size-md ${(item.overDue <0? 'text-danger':'text-success')} ">${(item.overDue <0? 'Overdue by ':'Scheduled in ')+item.overDue} days</span></h5>
 												<div>
 													<span class="font-weight-semi-bold opacity-7 font-size-sm">Total -&nbsp;</span>
 													<span class="opacity-7 font-size-sm">${item.totalFee} | Pending - ${item.pendingFee}</span>
 												</div>
											</div>
										</div>
										<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">`;
										if(item.upcoming.paymentType!='--'){
											html+=`<div class="p-2 mb-2" style="background:#f0f9ff">
												<h5 class="font-weight-semi-bold">Upcoming</h5>
												<span class="font-weight-semi-bold opacity-7 font-size-sm">Upcoming -&nbsp;</span>
												<span class="opacity-7 font-size-sm">${item.upcoming.date} | ${item.upcoming.amount}</span>
												<div>
													<span class="font-weight-semi-bold opacity-7 font-size-sm">Payment Title -&nbsp;</span>
													<span class="opacity-7 font-size-sm">${item.upcoming.paymentTitle}</span>
												</div>
											</div>`;
										}
										html+=`</div>
										<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">`
											if(item.paymentList!=null){
												html+=`<ul class="follow-up-accordian m-0 p-0 overflow-auto" style="min-height: 180px;max-height: 180px;">`;
												var srNo=1;
												var callcss=1;
												for (let sc = 0; sc < item.paymentList.length; sc++) {
													var srStr="";
													if(srNo==1){
														srStr=srNo+'st';
													}else if(srNo==2){
														srStr=srNo+'nd';
													}else if(srNo==3){
														srStr=srNo+'rd';
													}else{
														srStr=srNo+'th';
													}
													const stuSchedule = item.paymentList[sc];
													var classActive='';
													var classActiveCss='none';
													
														paymentList=false;
														if(stuSchedule.status=='SCHEDULED'){
															if(callcss==1){
																classActive ="follow-up-accordian-active";
																classActiveCss = "block";
																callcss=0;
															}
														}	
														var liHeading=srStr+" Installment";
														if(stuSchedule.payScheduleType=='One-time payment'){
															liHeading=stuSchedule.payScheduleType;
															classActive ="follow-up-accordian-active";
															classActiveCss = "block";
															callcss=0;
														}
														html+='<li class="'+classActive+'">'
															+'<span class="cursor follow-up-no text-primary p-2 text-center border-primary full bold">'+liHeading+'<i class="fa '+(stuSchedule.status=='SCHEDULED'?"fa-angle-up":"fa-angle-down")+' float-right" style="line-height: 20px;"></i>'
															+'</span>'
															+'<div class="follow-up-content text-center" style="display:'+classActiveCss+'">'
																+'<div class="bg-light-primary p-2 m-2 rounded text-left">'
																	+'<span class="full d-block"><strong>Fee:</strong>'+stuSchedule.amount+'</span>'
																	+'<span class="full d-block"><strong>Payment Status:</strong> '+stuSchedule.status+'</span>'
																	+'<span class="full d-block"><strong>Schedule Date:</strong> '+stuSchedule.scheduleDate+'</span>';
																	if(stuSchedule.payDate!=''){
																		html+='<span class="full d-block"><strong>Payment Date:</strong> '+stuSchedule.payDate+'</span>';
																	}
																+'</div>'
															+'</div>'
														+'</li>'
														//callcss=callcss+1;
													//}
													srNo=srNo+1;
												}
												html+='</ul>';
											}
										html+=`</div>
									</div>	
									
								</div>
								<div class="tab-pane show " id="tab-eg5-6${item.studentStandardId}" role="tabpanel">
									<div class="row">
										<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12">
											<ul class="follow-up-accordian m-0 p-0 overflow-auto followup-remark-${item.studentStandardId}" style="max-height: 325px;"></ul>
										</div>
										<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12 col-12">
												<div class="row">
													<div class="col-lg-12 col-md-6 col-sm-12 col-12">
														<div class="position-relative form-group">
															<label for="title" class="">Status</label>
																<select name="leadStatus-${item.studentStandardId}" id="leadStatus-${item.studentStandardId}" class="form-control re-leadstatus" style="width:200px !important;">
																	<option value="">Select Status</option>`;
																for (let s = 0; s < item.leadStatusList.length; s++) {
																	const statusL = item.leadStatusList[s];
																	html+='<option value="'+statusL.value+'">'+statusL.value+'</option>';
																}	
															html+=`</select>
														</div>
														<div class="position-relative form-group">
															<label for="title" class="">Remark</label>
															<textarea class="form-control" name="followupRemarks-${item.studentStandardId}" id="followupRemarks-${item.studentStandardId}" rows="2" style="height: 50px !important;"></textarea>
														</div>
														<button class="ml-2 mr-1 btn btn-sm btn-info float-right" id="updateFollowup" onclick="submitCommunicationLog(\'${item.studentStandardId}\',\'${item.userId}\')">Follow-up</button>
													</div>
												</div>
										</div>
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

function filterStudentPaymentReportForm(){
	var html = 
	'<div class="filterStudentPaymentReportForm" style="display:block">'
		+'<div class="card">'
			+'<div class="card-body">'
				+'<form id="studentPaymentForm">'
					+'<div class="row">'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Academic Session</label>'
							+'<select id="sessionId" class="form-control selectReset">'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Payment Start Date</label>'
							+'<input type="text" id="startDate" class="form-control" placeholder="Select Start Date" readonly onkeydown="return false" >'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Payment End Date</label>'
							+'<input type="text" id="endDate" class="form-control" placeholder="Select End Date" readonly onkeydown="return false" >'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Payment Status</label>'
							+'<select id="paymentStatus" class="form-control selectReset multiple-select-option" multiple="multiple">'
								+'<option value="SUCCESS">Success</option>'
								+'<option value="ODUE">Overdue</option>'
								+'<option value="DUE">Upcoming</option>'
								+'<option value="AP">Advance Payment</option>'
								+'<option value="ABS">Advance Book Seat </option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Over Due By (Days in Numbers)</label>'
							+'<input type="text" id="overDueBy" class="form-control" placeholder="Enter days count" value="">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Select LMS Platform</label>'
							+'<select id="learningPlatform" class="form-control selectReset multiple-select-option" multiple="multiple">'
								+getLmsPlatformContent(SCHOOL_ID)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>System Training</label>'
							+'<select name="systemTrainStatus" id="systemTrainStatus" class="form-control">'
								+'<option value="">Select System Training</option>'
								+'<option value="COMPLETED">Completed</option>'
								+'<option value="PENDING">Pending</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Teacher Mapping</label>'
							+'<select name="teacherMapStaus" id="teacherMapStaus" class="form-control">'
								+'<option value="">Select Teacher Mapping</option>'
								+'<option value="1">Completed</option>'
								+'<option value="0">Pending</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Select Enroll Type</label>'
							+'<select id="learningProgram" class="form-control selectReset multiple-select-option" multiple="multiple">'
								+getLearningProgramContent(SCHOOL_ID)
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Grade</label>'
							+'<select id="gradeId" class="form-control selectReset multiple-select-option" multiple="multiple">'
							+'</select>'
						+'</div>'
						
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Enroll Status</label>'
							+'<select id="enrollStatus" class="form-control selectReset multiple-select-option" multiple="multiple">'
								+'<option value="0">Completed</option>'
								+'<option value="1">Withdrawn</option>'
								+'<option value="2">Partial entry - New enrollment</option>'
								+'<option value="3">Partial entry - Re-enrollment</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Academic Year Selected</label>'
							+'<select name="academicYearStatus" id="academicYearStatus" class="form-control">'
								+'<option value="">Select Academic Year Selected Status</option>'
								+'<option value="Y">Yes</option>'
								+'<option value="N">No</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Re-Enroll</label>'
							+'<select id="reEnrollStatus" class="form-control selectReset multiple-select-option">'
								+'<option value="">Select Re-Enroll Status</option>'
								+'<option value="YEAREND">Academic Year End</option>'
								+'<option value="ONGOING">Ongoing</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Re-Enroll Remaining (Days in Numbers)</label>'
							+'<input type="text" id="remainingDueBy" class="form-control" placeholder="Enter days count" value="">'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>LMS Status</label>'
							+'<select name="lmsStatus" id="lmsStatus" class="form-control">'
								+'<option value="">Select LMS Status</option>'
								+'<option value="1">Active</option>'
								+'<option value="0">Inactive</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Transcript Status</label>'
							+'<select name="transcriptStatus" id="transcriptStatus" class="form-control">'
								+'<option value="">Select Status</option>'
								+'<option value="Y">Published</option>'
								+'<option value="N">Not Published</option>'
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Enrolled By</label>'
							+'<select id="userId" class="form-control selectReset multiple-select-option">'
								+'<option value="">ALL</option>'
								+getUserBasedOnCriteria('USER_LIST_BY_ROLE_SCHOOL', SCHOOL_ID, '', '')
							+'</select>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12">'
							+'<label>Select Status</label>'
							+'<select id="reLeadStatus" class="form-control selectReset multiple-select-option" multiple="multiple">'
								
							+'</select>'
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
									+'</select>'
								+'</div>'
							+'</div>'
						+'</div>'
						+'<div class="col-xl-3 col-lg-3 col-md-4 col-sm-6 col-12 text-right ml-auto">'
							+'<label class="full">&nbsp;</label>'
							+'<a href="javascript:void(0)" class="btn btn-danger mr-1 resetStudentPaymentRecord" onClick="resetStudentPaymentForm(\'studentPaymentForm\');" ><i class="fa fa-undo"></i>&nbsp;Reset</a>'
							+'<a href="javascript:void(0)" class="btn btn-success searchStudentPaymentRecord" onClick="getPaymentReportData(\'studentPaymentForm\',false,1, \'search\');" ><i class="fa fa-search"></i>&nbsp;Search</a>'
						+'</div>'
					+'</div>'
				+'</form>'
			+'</div>'
		+'</div>'
	+'</div>';
	return html;
}
function consolidateContent(data, count){
	html =  
		'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">Total Count</h5>'
				+'<div class="opacity-7 font-size-sm">'+count+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">One-to-One Learning</h5>'
				+'<div class="opacity-7 font-size-sm">'+data.oneToOneCount+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">Group Learning</h5>'
				+'<div class="opacity-7 font-size-sm">'+data.groupCount+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">Self Study Learning</h5>'
				+'<div class="opacity-7 font-size-sm">'+data.scholarshipCount+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">Flexy Learning Program</h5>'
				+'<div class="opacity-7 font-size-sm">'+data.flexyCount+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">Self Study Plus</h5>'
				+'<div class="opacity-7 font-size-sm">'+data.sspCount+'</div>'
			+'</div>'
		+'</div>'
		+'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
			+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
				+'<h5 class="font-weight-semi-bold">Total Call | Today Call</h5>'
				+'<div class="opacity-7 font-size-sm">'+data.totalCall+' | '+data.todayCall+'</div>'
			+'</div>'
		+'</div>';
		// +'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
		// 	+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
		// 		+'<h5 class="font-weight-semi-bold">Already Paid</h5>'
		// 		+'<div class="opacity-7 font-size-sm">'+data.paidFee+'</div>'
		// 	+'</div>'
		// +'</div>'
		// +'<div class="col-xl-2 col-lg-3 col-md-4 col-sm-4 col-6 px-1 mt-2">'
		// 	+'<div class="full p-2 mb-2 rounded" style="background:#f0f9ff">'
		// 		+'<h5 class="font-weight-semi-bold">Overdue/Upcoming</h5>'
		// 		+'<div class="opacity-7 font-size-sm">'+data.dueOrUpcomingFee+'</div>'
		// 	+'</div>'
		// +'</div>';
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
											$.each($("input[name='student-move-another']:checked"), function(index, checkbox) {
												var userId = $(checkbox).val(); 
												var name = $(".student-name-" + userId).attr("studentname") || '';
												var grade = $(".student-name-" + userId).attr("studentgrade") || '';

												var phoneSet = new Set();
												$(".parent-phone-" + userId + ", .parent-phone-alt-" + userId +
												", .student-phone-" + userId + ", .student-phone-alt-" + userId).each(function() {
													
													var num = $(this).attr("number")?.trim();

													if (num && num !== "null null") {
														let cleaned = num.replace(/[^0-9]/g, "");
														if (cleaned.length > 3) { 
															phoneSet.add(num);
														}
													}
												});

												var phones = Array.from(phoneSet);

												if (phones.length > 0) {
													var count = index + 1;

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
																<td class="font-weight-bold">${count}</td>
																<td class="font-weight-bold">
																	<input type="hidden" name="name" value="${name}" class="name">
																	<input type="hidden" name="grade" value="${grade}" class="grade">
																	${name}
																	<span class="stmsg" id="esmsg_${userId}"></span>
																</td>
																<td>
																	${phones.map(p => `
																		<input type="hidden" name="mobileNo" value="+${p}" class="mobileNo">
																		<div>+${p}</div>
																	`).join('')}
																</td> 
															</tr>`;
												}
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
			showWarningMessageShow('Are you sure you want to send this data?','sendWatiNotificationToUserForStudent( '+index+',\''+templateName+'\',\''+selectedUsers+'\',\'send\')', 'info-modal-sm');
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