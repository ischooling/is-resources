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
		+'</div>';
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
								<span class="mr-2">${key + 1}.</span>`;
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
									<h5 class="mb-1"><span class="font-weight-bold text-primary">${item.studentName}&nbsp;&nbsp;<a href='javascript:void(0)' onclick='getAsPost(\"/dashboard/profile-view-content?userId=${item.userId}&moduleId=8&studentStandardId=${item.studentStandardId}&actionType=1a\")' class=''><i class='fa fa-eye'></i>&nbsp;</a></span></h5></div>
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
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.guardianContactCodeNo} ${item.updateProfileStudentDTO.guardianContactNo} </span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Alternate Phone:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.guardianWorkCodeNo} ${item.updateProfileStudentDTO.guardianWorkContactNo}</span>
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
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.phoneCode} ${item.updateProfileStudentDTO.phoneNo} </span>
										</div>
										<div class="col-xl-3 col-lg-6 col-md-12 col-sm-12 col-12">
											<label class="label bold">Student Alternate Phone:</label>
											<span class="field-value trans5s ">${item.updateProfileStudentDTO.altPhoneCode} ${item.updateProfileStudentDTO.altPhoneNo}</span>
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


