var schoolSettingsOffice;
var schoolSettingsLinks;

function getApplictionHistoryStatusStyle(){
	var html=
	`<style>
		.applicant-profile-picture{width:75px;height:75px;}
	</style>`;
	return html;
}

async function getJobApplicationHistroyContent(userScreeningId){
	schoolSettingsOffice = await getSchoolSettingsOffice(SCHOOL_ID);
	schoolSettingsLinks = await getSchoolSettingsLinks(SCHOOL_ID);
	var payload = {};
	payload['schoolId'] = SCHOOL_ID;
	payload['userScreeningId'] = userScreeningId;
	payload['sessionUserId'] = USER_ID
	var responseData = await getDashboardDataBasedUrlAndPayloadWithParentUrl(true, true, 'get-full-application-history-data', payload, '/dashboard');
	console.log(responseData)
	$("body").html(renderJobApplicationHistroyContent(schoolSettingsLinks, responseData.data))
	$("body").append(userApplicationDetailsModalCotent()+viewApplicantsAttachementModalContent()+viewApplicantsFAQModalContent()+getApplicantsCommunicationLogModal());
}

function renderJobApplicationHistroyContent(schoolSettingsLinks, responseData){
	var html=
	`<div class="app-container app-theme-white body-tabs-shadow fixed-header fixed-sidebar">
		${getHeaderContent(schoolSettingsLinks)+getAppMainContent(responseData)}
	</div>`
	return html;
}

function getHeaderContent(schoolSettingsLinks){
	var html=
	`<div class="sticky-header">
		<div class="app-header header-shadow">
			<div class="app-header__logo w-100">
				<div class="d-flex align-items-center justify-content-between w-100">
					<a href="${schoolSettingsLinks.schoolWebsite}" target="blank" class="logo-src" style="background:url(${schoolSettingsLinks.logoUrl+SCRIPT_VERSION});"></a>
				</div>
			</div>
		</div>
	</div>`
	return html;
}

function getAppMainContent(responseData){
	var html=
	`<div class="app-main">
		<div classs="app-main__inner">
			<div class="col-xl-11 col-lg-11 col-12 mx-auto">
				${getApplicationStatusCard(responseData)+getApplicationHistroyTableContent(responseData)}
			</div>
		</div>
	</div>`;
	return html;
}

function getApplicationStatusCard(responseData){
	var html=
	`<div class="main-card mb-3 card rounded-10 bg-primary-gradient mt-4">
		<div class="card-body px-4">
			<div class="d-flex flex-wrap px-2 py-2">
				<div class="applicant-name-wrapper d-inline-flex">
					<div class="applicant-profile-picture rounded-circle overflow-hidden">
						<img src="${responseData.profilePic}" class="w-100"/>
					</div>
					<div class="text-white ml-4">
						<h3 class="font-weight-bold mb-2">${responseData.userName}</h3>
						<div>
							<span class="d-inline-block mr-3">
								<i class="fa fa-user font-size-lg"></i>
								<div class="d-inline-block ml-1 font-weight-light font-size-lg">${responseData.appliedUserRole}</div>
							</span>
							<span class="d-inline-block mr-3">
								<i class="fa fa-clock font-size-lg"></i>
								<div class="d-inline-block ml-1 font-weight-light font-size-lg">Full Histroy</div>
							</span>
						</div>
						<div class="mt-4">
							<span class="d-inline-block mr-4">
								<h5 class="font-weight-semi-bold mb-2">Current Application Status</h5>
								<span class="d-inline-block bg-light-success px-2 py-1 rounded font-weight-semi-bold font-16" style="color:#1b672c">${responseData.applicationStatus}</span>
							</span>
							<span class="d-inline-block ml-4">
								<h5 class="font-weight-semi-bold mb-2">Assign To</h5>
								<div class="d-inline-block ml-1 font-weight-light font-size-lg">${responseData.assignTo}</div>
							</span>
						</div>
					</div>
				</div>
				<div class="applicant-name-wrapper d-inline-flex ml-auto">
					<div>
						<button class="btn btn-white font-18 font-weight-normal">
							<i class="fa fa-download"></i>&nbsp; Download Report
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getApplicationHistroyTableContent(responseData){
	var html=
	`<div class="full mt-4">
		${getApplicationHistroyTable(responseData)}
	</div>`;
	return html;
}

function getApplicationHistroyTable(responseData){
	var html=
	`<table class="table table-bordered border-collaps border-radius-table font-12 responsive nowrap">
		${getApplicationHistroyTableHead()+getApplicationHistroyTableBody(responseData)}
	</table>`;
	return html;
}

function getApplicationHistroyTableHead(){
	var html=
	`<thead class="bg-white">
		<tr>
		
			<th class="font-22 font-weight-bold text-dark border-bottom pl-4" colspan="5">
				<i class="fa fa-tasks text-primary"></i>&nbsp;
				<strong class="font-weight-semi-bold">Application Full History</strong>
			</th>
		</tr>
		<tr class="bg-light-primary text-dark">
			<th class="font-18 py-3 text-dark text-center"><b class="font-weight-semi-bold">#</b></th>
			<th class="font-18 py-3 text-dark"><b class="font-weight-semi-bold">Application Status</b></th>
			<th class="font-18 py-3 text-dark"><b class="font-weight-semi-bold">Remarks</b></th>
			<th class="font-18 py-3 text-dark"><b class="font-weight-semi-bold">Added | Updated By</b></th>
			<th class="font-18 py-3 text-dark"><b class="font-weight-semi-bold">Date | Time</b></th>
		</tr>
	</thead>`;
	return html;
}

function getApplicationHistroyTableBody(responseData){
	
	var html=
	`<tbody class="bg-white">`;
		$.each(responseData.historyArray, function(i, v){
			html+=
			`<tr>
				<td class="font-14 font-weight-semi-bold text-center">${i+1}</td>
				<td>`
					if(v.status == "Application Submitted"){
						html+=
						`<span class="font-14 text-dark font-weight-semi-bold">${v.status}&nbsp;&nbsp;</span>
						<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="viewApplicatinDetails(\'userApplicationDetailsModal\')">View Application</a>`;
					}
					
				html+=`</td>
				<td class="font-14 font-weight-semi-bold">N/A</td>
				<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
				<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
			</tr>`;
		});
		{/*
			<tr>
			<td class="font-14 font-weight-semi-bold text-center">1</td>
			<td>
				<span class="font-14 text-dark font-weight-semi-bold">Application Submitted&nbsp;&nbsp;</span>
				<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="viewApplicatinDetails(\'userApplicationDetailsModal\')">View Application</a> 
			</td>
			<td class="font-14 font-weight-semi-bold">N/A</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div>
					Step | Few Questions
				</div>
				<ul class="pl-3 mt-2">
					<li class="font-12 font-weight-normal" style="list-style:disc">Why do you want to join our organisation?</li>
					<li class="font-12 font-weight-normal" style="list-style:disc">Describe your prior teaching experience.</li>
					<li class="font-12 font-weight-normal" style="list-style:disc">Availability for training & onboarding</li>
				</ul>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">3</td>
			<td class="font-14 font-weight-semi-bold">Communication Log Updated</td>
			<td>
				<div class="font-14 font-weight-semi-bold">Communication Log Updated</div>
				<div class="font-14 font-weight-normal">Message: Candidate showed strong communication skills.</div>
				<div class="font-14 font-weight-normal">Recommended for next stage.</div>
				<div class="mt-2">
					<a href="javascript:void(0)" class="btn btn-sm btn-primary px-3" onclick="viewApplicantsCommunicationLogDetails(\'applicantsCommunicationLogModal\')">View</a>
				</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">5</td>
			<td>
				<span class="font-14 text-dark font-weight-semi-bold">Few Question Submitted&nbsp;&nbsp;</span>
				<a href="javascript:void(0)" class="btn btn-sm btn-primary" onclick="viewQuestionAndAnswers(\'viewApplicantsFAQModal\')">View Answers</a> 
			</td>
			<td class="font-14 font-weight-semi-bold">N/A</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-success">Approved for interview</div>
				<div class="font-12 font-weight-normal">Assigned To: Bhagat Singh</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-primary">Interview Status: Booked</div>
				<div class="font-12 font-weight-normal">Dec 13, 2025 3:15 PM - Dec 13, 2025 3:30 PM</div>
			</td>
			<td class="font-14 font-weight-semi-bold">N/A</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-danger">Interview Status: Not Show</div>
				<div class="font-12 font-weight-normal">Dec 13, 2025 3:15 PM - Dec 13, 2025 3:30 PM</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-dark">Interview Status: Cancelled</div>
				<div class="font-12 font-weight-normal">Dec 13, 2025 3:15 PM - Dec 13, 2025 3:30 PM</div>
			</td>
			<td class="font-14 font-weight-semi-bold">N/A</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-orange">Interview Status: Reschedule</div>
				<div class="font-12 font-weight-normal">Dec 13, 2025 3:15 PM - Dec 13, 2025 3:30 PM</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-orange">Application Hold</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-success">Approved for Another Interview</div>
				<div class="font-12 font-weight-normal">Dec 13, 2025 3:15 PM - Dec 13, 2025 3:30 PM</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>
		<tr>
			<td class="font-14 font-weight-semi-bold text-center">2</td>
			<td class="font-14 font-weight-semi-bold">
				<div class="text-danger">Application Rejected</div>
			</td>
			<td class="font-14 font-weight-semi-bold">Message:test remarks</td>
			<td class="font-14 font-weight-semi-bold">Bhagat Singh</td>
			<td class="font-14 font-weight-semi-bold">Dec 13, 2025 5:17 PM</td>
		</tr>	
		*/''}
	html+=`</tbody>`;
	return html;
}


function userApplicationDetailsModalCotent(){
    var html=
        `<div class="modal right-slide-modal fade" id="userApplicationDetailsModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Application Details</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times</span>
                        </button>
                    </div>
                    <div class="modal-body overflow-y-auto">
						${
							getApplicationBasicDetailsCard()
							+getApplicationLocationDetailsCard()
							+getApplicationProfessionalDetailsCard()
							+getApplicationDocumentsDetailsCard()
						}
                    	<div class="d-flex justify-content-end">
                            <button type="button" class="btn btn-danger mr-2" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    return html;
}

function getApplicationBasicDetailsCard(){
	var html=
	`<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
		<div class="card-body px-4">
			<div class="row">
				<div class="col-12">
					<h5 class="font-weight-semi-bold">
						<i class="fa fa-info-circle text-primary mr-1"></i> Basic information
					</h5>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Applied Date</div>
					<div class="font-weight-semi-bold font-16">Dec 13, 2025 5:17 PM</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Name</div>
					<div class="font-weight-semi-bold font-16">Bhagat Singh Garakoti</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Phone Number</div>
					<div class="font-weight-semi-bold font-16">
						<span>+354-9897969495</span>
						<span class="mb-2 mr-2 badge badge-pill bg-light-success font-weight-semi-bold text-transform-inherit" style="color:#1b672c">
							<i class="fa fa-whatsapp"></i> WhatsApp
						</span>
					</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Email</div>
					<div class="font-weight-semi-bold font-16">web@seriindia.org</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="font-weight-semi-bold font-16">
						<span class="opacity-6">Source</span>
						<span class="mb-2 mr-2 badge badge-pill bg-primary text-white font-weight-normal text-transform-inherit font-14">
							<i class="fa fa-globe font-16 mr-1"></i>Website
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getApplicationLocationDetailsCard(){
	var html=
	`<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
		<div class="card-body px-4">
			<div class="row">
				<div class="col-12">
					<h5 class="font-weight-semi-bold">
						<i class="fa fa-map-marker text-primary mr-1"></i> Location Details
					</h5>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-4 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Country</div>
					<div class="font-weight-semi-bold font-16">India</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-4 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Province/State</div>
					<div class="font-weight-semi-bold font-16">Delhi</div>
				</div>
				<div class="col-xl-4 col-lg-4 col-md-4 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">City</div>
					<div class="font-weight-semi-bold font-16">New Delhi</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getApplicationProfessionalDetailsCard(){
	var html=
	`<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
		<div class="card-body px-4">
			<div class="row">
				<div class="col-12">
					<h5 class="font-weight-semi-bold">
						<i class="fa fa-briefcase text-primary mr-1"></i> Professional Information
					</h5>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Last/Current Salary (per annum)</div>
					<div class="font-weight-semi-bold font-18 text-uppercase">usd 800,000</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Last/Current Organization</div>
					<div class="font-weight-semi-bold font-16">International Schooling</div>
				</div>
				<div class="col-xl-6 col-lg-6 col-md-6 col-12 mt-2">
					<div class="opacity-6 font-weight-semi-bold">Appied User Role</div>
					<div class="font-weight-semi-bold font-16">Addmission Counselor</div>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function getApplicationDocumentsDetailsCard(){
	var html=
	`<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
		<div class="card-body px-4">
			<div class="row">
				<div class="col-12">
					<h5 class="font-weight-semi-bold">
						<i class="fa fa-file text-primary mr-1"></i> Documents & Links
					</h5>
				</div>
				<div class="col-12 d-flex flex-wrap gap-10 mt-2">
					<button class="btn btn-outline-primary font-16" onclick="viewResumeAndPhoto(\'https://s3.amazonaws.com/testseri/test/biMHaLPIoUBtCL81_2mb.pdf\',\'viewApplicantsAttachementModal\')">
						<i class="fa fa-file-pdf-o mr-2 font-18"></i>View Resume
					</button>
					<button class="btn btn-outline-primary font-16" onclick="viewResumeAndPhoto(\'https://cdn.jsdelivr.net/gh/ischooling/is-resources@v1.0.11/static/theme2/images/is_logo_2025_blue.webp\',\'viewApplicantsAttachementModal\')">
						<i class="fa fa-file-image-o mr-2 font-18"></i>View Photos
					</button>
					<a href="https://www.linkedin.com/in/joaquin-rosales-26581641/" target="_blank" class="btn btn-outline-primary font-16">
						<i class="fa fa-linkedin mr-2 font-18"></i>Linkedin
					</a>
					<button class="btn btn-outline-primary font-16" onclick="viewQuestionAndAnswers(\'viewApplicantsFAQModal\')">
						<i class="fa fa-question-circle mr-2 font-18"></i>View Q/A
					</button>
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

function viewApplicantsAttachementModalContent(){
	var html=
	`<div class="modal fade fade-scale" id="viewApplicantsAttachementModal" tabindex="-1">'
		<div class="modal-dialog modal-md  box-shadow-none" role="document">
			<div class="modal-content">
				<div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">
					<h5 class="heading text-white m-0">Preview File</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body m-0 py-2" style="margin-top:0 !important">
					<div id="pre_upload_image_div" class="full text-center upload_img d-none">
						<img id="pre_upload_image" class="w-100" src="" />
					</div>
					<div id="pre_upload_pdf_div" class=" full text-center upload_pdf d-none">
						<div class="full">
							<a href="" target="_blank" class="btn btn-sm btn-primary download-pdf-btn mb-2 pull-right" download="file.pdf">Download PDF</a>
						</div>
						<object type="application/pdf" class="pre_upload_pdf full" style="height: 400px;" data=""></object>
					</div>
				</div>
			</div>
		</div>
	</div>`
	return html;
}


function viewApplicantsFAQModalContent(){
	var html=
	`<div class="modal fade fade-scale" id="viewApplicantsFAQModal" tabindex="-1">'
		<div class="modal-dialog modal-md  box-shadow-none" role="document">
			<div class="modal-content">
				<div class="modal-header pt-2 pb-2 bg-primary justify-content-between flex-wrap">
					<h5 class="heading text-white m-0">Questions & Answers</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				</div>
				<div class="modal-body m-0 py-2" style="margin-top:0 !important">
					<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
						<div class="card-body px-4">
							<div class="row">
								<div class="col-12">
									<h5 class="font-weight-semi-bold mb-2">
										Q1. What motivates you to work remotely. <sup class="text-danger font-weight-bold">*</sup>
									</h5>
									<h5 class="font-weight-semi-normal font-16 pl-3">Having the freedom to move experience the world without losing touch with building my career.</h5>
								</div>
							</div>
						</div>
					</div>
					<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
						<div class="card-body px-4">
							<div class="row">
								<div class="col-12">
									<h5 class="font-weight-semi-bold mb-2">
										Q2. What motivates you to work remotely. <sup class="text-danger font-weight-bold">*</sup>
									</h5>
									<h5 class="font-weight-semi-normal font-16 pl-3">Having the freedom to move experience the world without losing touch with building my career.</h5>
								</div>
							</div>
						</div>
					</div>
					<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
						<div class="card-body px-4">
							<div class="row">
								<div class="col-12">
									<h5 class="font-weight-semi-bold mb-2">
										Q3. What motivates you to work remotely. <sup class="text-danger font-weight-bold">*</sup>
									</h5>
									<h5 class="font-weight-semi-normal font-16 pl-3">Having the freedom to move experience the world without losing touch with building my career.</h5>
								</div>
							</div>
						</div>
					</div>
					<div class="main-card mb-3 card rounded-10 bg-light-primary shadow-none border mt-4">
						<div class="card-body px-4">
							<div class="row">
								<div class="col-12">
									<h5 class="font-weight-semi-bold mb-2">
										Q4. What motivates you to work remotely. <sup class="text-danger font-weight-bold">*</sup>
									</h5>
									<h5 class="font-weight-semi-normal font-16 pl-3">Having the freedom to move experience the world without losing touch with building my career.</h5>
								</div>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</div>
	</div>`
	return html;
}


function getApplicantsCommunicationLogModal(userId, useRole){
    var html=
        `<div class="modal fade" id="applicantsCommunicationLogModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Communication Log</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${getApplicantsCommunicationLogTable()}
                    </div>
                </div>
            </div>
        </div>`
    return html; 
}

function getApplicantsCommunicationLogTable(){
	html=
		`<table class="table table-hover table-striped table-bordered responsive dt-responsive mt-3" id="communicationLogTableJA" style="width:100%;">
			${getApplicantsCommunicationLogHead()}		
			<tbody>
				${getApplicantsCommunicationLogRow()}
			</tbody>
		</table>`;
	return html;
}

function getApplicantsCommunicationLogHead(){
	var html = 
        `<thead>
            <tr>	
                <td>S.No.</td>
                <td>Title</td>
                ${/*<td>Status</td>*/''}
                <td>Comments</td>
                <td>Attachment</td>
                <td>Added by/Added At</td>
            </tr>
        </thead>`;
	return html;
}

function getApplicantsCommunicationLogRow(result){
	var html=
	`<tr id="commLog1543">
		<td>1</td>
		<td>test</td>
		<td><p>testing</p></td>
		<td class="text-center"><a target="_blank" href="https://s3.amazonaws.com/testseri/test/abc35346386482981673.pdf"><i class="fa fa-eye"></i></a></td>
		<td>IT Admin/Dec 02, 2025 12:31 PM</td>
	</tr>`;
    // $.each(result.commonCommentsDTO, function(k, v) {
    //     html+=
    //     ``;
    // });
	return html;
}