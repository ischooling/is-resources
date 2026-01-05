var ROLE_MODULE="";
var OBJECT_RIGHTS="";
async function renderReceivedTeachedProfileListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getReceivedTeachedProfileTitle(title);
    $('#dashboardContentInHTML').html(html);
    getReceivedTeachedProfileListRequestApi('receivedTeachedProfile',ROLE_MODULE.moduleId);
}

async function renderPendingTeachedTrainingListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getPendingTeachedTrainingTitle(title);
    $('#dashboardContentInHTML').html(html);
    getPendingTeachedTrainingListRequestApi('pendingTeachedTrainingProfile',ROLE_MODULE.moduleId);
}

async function renderPendingContractListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html= await getPendingContractTitle(title, roleAndModule.moduleId);
    $('#dashboardContentInHTML').html(html);
    getPendingContractListRequestApi('pendingContractProfile',ROLE_MODULE.moduleId);
}


async function renderRejectedTeacherListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getRejectedTeacherTitle(title);
    $('#dashboardContentInHTML').html(html);
    getRejectedTeacherListRequestApi('rejectedTeacher',ROLE_MODULE.moduleId);
}



function getReceivedTeachedProfileTitle(title){
	var html=`<div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>`;
	html+=getReceivedTeachedProfileContentCard();
	return html;
}
							
function getReceivedTeachedProfileContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getReceivedTeachedProfileContentList()}
				</div>
			</div>
		</div>`;
 return html;
}

function getReceivedTeachedProfileContentList(){
        var html = 
			`<table class="table table-bordered table-striped border-radius-table font-12 responsive" id="receivedTeachedProfileListTable" style="width:100%;" >
				<thead>
					<tr class="bg-primary text-white">
					<th>S.No.</th>
					<th>Country Name</th>
					<th>Name</th>
					<th>Contact No.</th>
					<th>Email</th>
					<th>Status</th>
					<th class="text-center">Demo Video</th>
					<th class="text-center">View Profile</th>
					<th class="text-center">Action</th>
					</tr>
				</thead>
				<tbody id="receivedTeachedProfileListBody"></tbody>
			</table>`;
        return html;
}


function getPendingTeachedTrainingTitle(title){
	var html=`<div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>`;
	html+=getPendingTeachedTrainingContentCard();
	return html;
}

function getPendingTeachedTrainingContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getPendingTeachedTrainingContentList()}
				</div>
			</div>
		</div>`;
 return html;
}

function getPendingTeachedTrainingContentList(){
        var html = `<table class="table table-bordered table-striped border-radius-table responsive nowrap font-12" id="pendingTeachedTrainingListTable" style="width:100%;" >
                        <thead class="bg-primary text-white">
                            <tr class="bg-primary text-white">
								<th>S.no</th>
								<th>Name</th>
								<th>User Name</th>
								<th>Marks Set 1</th>
								<th>Marks Set 2</th>
								<th>Submit Date</th>
								<th>Action</th>
						    </tr>
                        </thead>
                        <tbody id="pendingTeachedTrainingListBody"></tbody>
                    </table>`;
        return html;
}


function getPendingContractTitle(title, moduleId){
	var html=`<div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>`;
	html+=getPendingContractContentCard(moduleId);
	return html;
}

function getPendingContractContentCard(moduleId){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getPendingContractContentList(moduleId)}
				</div>
			</div>
		</div>`;
 return html;
}

function getPendingContractContentList(moduleId){
        var html = 
		`<table class="table table-bordered table-striped responsive nowrap" id="pendingContractListTable" style="width:100%;" >
			<thead>
				<tr class="bg-primary text-white">
					<th style="text-align:center;">S.No</th>
					<th>Name</th>
					<th>Contact No.</th>
					<th>User Name</th>
					<th>Edit</th>
					<th>Action</th>
					<th>Agreement</th>
				</tr>
			</thead>
			<tbody id="pendingContractListBody"></tbody>
		</table>
		<div class="modal fade" id="teacherAgreementModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
			<input type="hidden" id="userId" value="${USER_ID}">
			<div class="modal-dialog modal-xl" role="document">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title">Teacher Agreement</h5>	
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body" style="max-height:500px;overflow:auto;">
						<section id="section-linebox" class="text-left"></section>
					</div>
					<div class="modal-footer text-right">
						<button type="button" class="btn btn-primary" id="saveAgreement" onclick="return submitTeacherAgreement('teacherEditAgreement','','${moduleId}',1);">Save Draft</button>
						<button type="button" class="btn btn-success" id="saveAndConfirmAgreement" onclick="return submitTeacherAgreement('teacherEditAgreement','','${moduleId}',2);">Save and Confirm</button>
						${/*<button type="button" class="btn btn-success" id="saveAgreement" onclick="return submitTeacherAgreement('teacherEditAgreement','','${moduleId}','2');">save Agreement</button> */''}
					</div>
				</div>
			</div>
		</div>
		<div class="modal fade " id="teacherAssignSubjectModal" tabindex="-1" role="dialog" aria-labelledby="teacherAssignModalLabel1">
			<input type="hidden" id="userId" value="${USER_ID}">
			<div class="modal-dialog modal-lg" role="document">
				<div class="modal-content">
					<div class="modal-header py-2 bg-primary text-white">
						<h5 class="modal-title">Teacher Subject</h5>
						<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body" id="assignSubjectToTeacher">
					
					</div>
				</div>
			</div>
		</div>`;
        return html;
}


function getRejectedTeacherTitle(title){
	var html=`<div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>`;
	html+=getRejectedTeacherContentCard();
	return html;
}

function getRejectedTeacherContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getRejectedTeacherContentList()}
				</div>
			</div>
		</div>`;
 return html;
}

function getRejectedTeacherContentList(){
        var html = `<table class="table table-bordered table-striped responsive nowrap" id="rejectedTeacherListTable" style="width:100%;" >
                        <thead>
                            <tr class="bg-primary text-white">
								<th>S.no</th>
								<th>Country</th>
								<th>Name</th>
								<th>Application No.</th>
								<th>User Name</th>`;
								if(ROLE_MODULE.viewed=='Y'){
									html +=`<th>View Profile</th>
									<th>Activity Log</th>`;
								}
								html +=`<th>Action</th>
						    </tr>
                        </thead>
                        <tbody id="rejectedTeacherListBody"></tbody>
                    </table>`;
		html +=getRejectedActivity();
        return html;
}


function getRejectedActivity(){
	var html='';
	html+=`
	<div id="divHistoryRemarks"></div>
	<div id="userActivityHTML"></div>
	<div class="modal fade" id="commonCommentsLogsModel" role="dialog">
		<div class="modal-dialog modal-lg" style="margin-top:70px;">
			<div class="modal-content">
				<div class="modal-header" style="width: 97%; margin: 0 auto; border-radius: 0;position:relative;top:-25px;">
					<h5 class="modal-title" style="color: #fff; margin-left: 30px;" id="commonCommentTitle">Past Comments</h5>
					<button type="button" class="close text-white" data-dismiss="modal" aria-label="Close" style="margin-right: 5px;margin-top: -5px;">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div id="commonCommentsLogsModelContents" class="modal-body" style="height:500px;overflow:auto;">
					
				</div>
			</div>
		</div>
	</div>`;
	return html;
}

async function renderPendingVerificationTeachedProfileListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getPendingVerificationTeachedProfileTitle(title);
    $('#dashboardContentInHTML').html(html);
    getPendingVerificationProfileListRequestApi('receivedTeachedProfile',ROLE_MODULE.moduleId);
}

function getPendingVerificationTeachedProfileTitle(title){
	var html=`<div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>`;
	html+=getPendingVerificationTeachedProfileContentCard();
	return html;
}

function getPendingVerificationTeachedProfileContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getPendingVerificationTeachedProfileContentList()}
				</div>
			</div>
		</div>`;
 return html;
}

function getPendingVerificationTeachedProfileContentList(){
        var html = 
			`<table class="table table-bordered table-striped border-radius-table font-12 responsive" id="PendingVerificationProfileListTable" style="width:100%;" >
				<thead>
					<tr class="bg-primary text-white">
					<th>S.No.</th>
					<th>Country Name</th>
					<th>Name</th>
					<th>Contact No.</th>
					<th>Email</th>
					<th>Status</th>
					<th class="text-center">Verification Details</th>
					<th class="text-center">View Profile</th>
					<th class="text-center">Action</th>
					</tr>
				</thead>
				<tbody id="PendingVerificationProfileListBody"></tbody>
			</table>`;
        return html;
}

function getVerificationModalContent(data, userId) {
    var html=
		`<div>
			<h5 class="text-left font-weight-bold">COMPLETE SOCIAL MEDIA DETAILS (BACKGROUND CHECK)</h5>
			<div style="border: #eee 2px solid; border-radius: 5px; padding: 10px; margin-bottom: 15px;">
				<p style="color: red; margin-bottom: 15px">
					You can add links to all your social media profiles. However, adding at least one profile link is mandatory(*).
				</p>
				<div class="form-row mb-2">
					<div class="form-holder" style="flex: 1; min-width: 250px;">
						<label><b>LinkedIn Profile URL:</b></label>
						<p>${checkValueValidation(data.teacherVerification.linkedIn, "-")}</p>
					</div>
					<div class="form-holder" style="flex: 1; min-width: 250px;">
						<label><b>Facebook Profile URL:</b></label>
						<p>${checkValueValidation(data.teacherVerification.facebook, "-")}</p>
					</div>
					<div class="form-holder" style="flex: 1; min-width: 250px;">
						<label><b>Instagram Profile URL:</b></label>
						<p>${checkValueValidation(data.teacherVerification.instagram, "-")}</p>
					</div>
				</div>
				<div class="form-row mt-2">
					<div class="form-holder" style="width: 500px !important;">
						<label><b>X (Twitter) Profile URL:</b></label>
						<p>${checkValueValidation(data.teacherVerification.twitter, "-")}</p>
					</div>
				</div>`;
				if(data.teacherVerification?.haveSocialMediaAccount == "Y"){
					html+=
					`<div class="form-row">
						<div class="form-holder">
                        	<div class="custom-checkbox-policy" style="align-items: center !important;">
                            	<input type="checkbox" class="mb-2" name="socialMediaCheckbox" id="socialMediaCheckbox" checked disabled>
                            	<label for="socialMediaCheckbox" class="" style="color:gray;font-size:15px;">I hereby declare that I do not have any active social media accounts.</label>
                        	</div>
                    	</div>
					</div>`
				}
			html+=`</div>
		</div>

		<div>
			<h5 class="text-left font-weight-bold">RECOMMENDATION LETTER OR ANY REFERENCE</h5>
			<div style="border: #eee 2px solid; border-radius: 5px; padding: 10px; margin-bottom: 15px;">
				<p style="color: red; margin-bottom: 15px">
					NOTE:- Files uploaded (jpg, jpeg, pdf, png). Max size 10 MB.
				</p>
				<div class="form-row">
					<div class="form-holder">
						<label><b>Recommendation Letter 1:</b></label>
						<p>${checkValueValidation(data.attachments.recommendationLetter1Name, "-")}`;
							if(data.attachments.recommendationLetter1URL != null && data.attachments.recommendationLetter1URL != undefined && data.attachments.recommendationLetter1URL != "" ){
								if(data.attachments.recommendationLetter1URL.split('.').pop() == "pdf"){
									html+=`<a href="${data.attachments.recommendationLetter1URL}" target="_blank" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1">
										<i class="fa fa-eye"></i>
									</a>`;
								}else{
									html+=
									`<a href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1" data-src="${data.attachments.recommendationLetter1URL}" onclick="teacherVerificationAttchament(this)">
										<i class="fa fa-eye"></i>
									</a>`;
								}
							}
						html+=`</p>
					</div>
					<div class="form-holder">
						<label><b>Recommendation Letter 2:</b></label>
						<p>${checkValueValidation(data.attachments.recommendationLetter2Name, "-")}`;
							if(data.attachments.recommendationLetter2URL != null && data.attachments.recommendationLetter2URL != undefined && data.attachments.recommendationLetter2URL != "" ){
								if(data.attachments.recommendationLetter2URL.split('.').pop() == "pdf"){
									html+=`<a href="${data.attachments.recommendationLetter2URL}" target="_blank" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1">
										<i class="fa fa-eye"></i>
									</a>`;
								}else{
									html+=
									`<a href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1" data-src="${data.attachments.recommendationLetter2URL}" onclick="teacherVerificationAttchament(this)">
										<i class="fa fa-eye"></i>
									</a>`;
								}
							}
						html+=`</p>
					</div>
				</div>
				<div>
					<h6 class="mb-1" style="font-weight: bold;color: gray;">Reference 1</h6>
					<p><b>Name:</b> ${data.employeeReference?.[0]?.name || "-"}</p>
					<p><b>Email:</b> ${data.employeeReference?.[0]?.email || "-"}</p>
					<p><b>Phone:</b> ${data.employeeReference?.[0]?.number || "-"}</p>
					<p><b>Designation:</b> ${data.employeeReference?.[0]?.designation || "-"}</p>

					<h6 class="mt-2 mb-1" style="font-weight: bold;color: gray;">Reference 2</h6>
					<p><b>Name:</b> ${data.employeeReference?.[1]?.name || "-"}</p>
					<p><b>Email:</b> ${data.employeeReference?.[1]?.email || "-"}</p>
					<p><b>Phone:</b> ${data.employeeReference?.[1]?.number || "-"}</p>
					<p><b>Designation:</b> ${data.employeeReference?.[1]?.designation || "-"}</p>
				</div>
			</div>
		</div>

		<div>
			<h5 class="text-left font-weight-bold">POLICE VERIFICATION</h5>
			<div style="border: #eee 2px solid; border-radius: 5px; padding: 10px; margin-bottom: 15px; color: gray;">
				<p class="mb-2">I, ${USER_FULL_NAME} do hereby declare and undertake that:</p>
				<p class="mb-2">I have undergone a police verification process in my city/town of residence and obtained a valid police clearance certificate.</p>
				<p class="mb-2">The verification confirms that I do not have any criminal record, and I am eligible for employment as per the institution's requirements.</p>
				<p class="mb-2">I take full responsibility for the accuracy of this information and understand that any false declaration may result in disciplinary action, including termination of employment.</p>
				<p class="mb-4">I also undertake to notify the institution immediately in case of any legal proceedings initiated against me in the future.</p>
				<div class="form-row">
                    <div class="form-holder">
                        <div class="custom-checkbox-policy" style="align-items: center !important;">
                            <input type="checkbox" class="mb-2" name="policeVerificationCheck" id="policeVerificationCheck" disabled ${data.teacherVerification?.policeVerificationAcceptance == "Y" ? "checked": ""}>
                            <label for="policeVerificationCheck" class="" style="color:gray;font-size:15px;">I declare that the above statements are true and correct to the best of my knowledge and belief.</label>
                        </div>
                    </div>
                </div>
			</div>

		</div>

		<div>
			<h5 class="text-left font-weight-bold">UPLOAD DOCUMENTS</h5>
			<div style="border: #eee 2px solid; border-radius: 5px; padding: 10px; margin-bottom: 15px;">
				<p style="color: red; margin-bottom: 15px">
					NOTE:- Files uploaded (jpg, jpeg, pdf, png). Max size 10 MB.
				</p>
				<div class="form-row">
					<div class="form-holder">
						<label><b>Police Verification:</b></label>
						<p>${checkValueValidation(data.attachments.policeVerificationName, "-")}`;
							if(data.attachments.policeVerificationURL != null && data.attachments.policeVerificationURL != undefined && data.attachments.policeVerificationURL != "" ){
								if(data.attachments.policeVerificationURL.split('.').pop() == "pdf"){
									html+=`<a href="${data.attachments.policeVerificationURL}" target="_blank" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1">
										<i class="fa fa-eye"></i>
									</a>`;
								}else{
									html+=
									`<a href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1" data-src="${data.attachments.policeVerificationURL}" onclick="teacherVerificationAttchament(this)">
										<i class="fa fa-eye"></i>
									</a>`;
								}
							}
						html+=`</p>
					</div>
					<div class="form-holder">
						<label><b>Last Salary Slip:</b></label>
						<p>${checkValueValidation(data.attachments.previousSalarySlipName, "-")}`;
							if(data.attachments.previousSalarySlipURL != null && data.attachments.previousSalarySlipURL != undefined && data.attachments.previousSalarySlipURL != "" ){
								if(data.attachments.previousSalarySlipURL.split('.').pop() == "pdf"){
									html+=`<a href="${data.attachments.previousSalarySlipURL}" target="_blank" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1">
										<i class="fa fa-eye"></i>
									</a>`;
								}else{
									html+=
									`<a href="javascript:void(0);" target="_self" data-toggle="tooltip" title="View" class="btn btn-primary mt-1 ml-1" data-src="${data.attachments.previousSalarySlipURL}" onclick="teacherVerificationAttchament(this)">
										<i class="fa fa-eye"></i>
									</a>`;
								}
							}
						html+=`</p>
					</div>
				</div>
			</div>
			<a href="javascript:void(0);" class="btn btn-primary d-flex ml-auto my-2 w-fit-content" onclick="getAsPost('/dashboard/profile-view-content?userId=${userId}&moduleId=${ROLE_MODULE.moduleId}&actionType=1a')">Edit</a>
		</div>`;
    return html;
}




async function renderBankDetailsTeacherProfleListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getBankDetailsTeacherProfileTitle(title);
    $('#dashboardContentInHTML').html(html);
    getPendingBankDetailsProfileListRequestApi('receivedTeachedProfile',ROLE_MODULE.moduleId);
}

function getBankDetailsTeacherProfileTitle(title){
	var html=`<div class="app-page-title mb-3 py-2">
                <div class="page-title-wrapper">
                    <div class="page-title-heading">
                        <div class="page-title-icon"><i class="pe-7s-users text-primary"></i></div>
                        <div>${title}</div>
                    </div>
                </div>
            </div>`;
	html+=getBankDetailsTeacherProfileContentCard();
	return html;
}

function getBankDetailsTeacherProfileContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getBankDetailsTeacherProfileContentList()}
				</div>
			</div>
		</div>`;
 return html;
}

function getBankDetailsTeacherProfileContentList(){
        var html = 
			`<table class="table table-bordered table-striped border-radius-table font-12 responsive" id="BankDetailsProfileListTable" style="width:100%;" >
				<thead>
					<tr class="bg-primary text-white">
					<th>S.No.</th>
					<th>Country Name</th>
					<th>Name</th>
					<th>Contact No.</th>
					<th>Email</th>
					<th class="text-center">View Profile</th>
					<th class="text-center">Action</th>
					</tr>
				</thead>
				<tbody id="BankDetailsProfileListBody"></tbody>
			</table>`;
        return html;
}

function addTeacherContractModal(data, userId, name, email, contractId) {
    var dayOptions = '';
    for (var i = 1; i <= 30; i++) {
        dayOptions += `<option value="${i}">${i} Day${i > 1 ? 's' : ''}</option>`;
    }
    var contractDate = data?.agreementDate ? changeDateFormat(new Date(data.agreementDate), "MMM-dd-yyyy") : changeDateFormat(new Date(), "MMM-dd-yyyy");
    var validityStartDate = data?.validityStart ? changeDateFormat(new Date(data.validityStart), "MMM-dd-yyyy") : "";
    var validityEndDate = data?.validityEnd ? changeDateFormat(new Date(data.validityEnd), "MMM-dd-yyyy") : "";
    var validityDuration = 0;
    if (data?.validityStart && data?.validityEnd) {
        var start = new Date(data.validityStart);
        var end = new Date(data.validityEnd);
        validityDuration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }
    var isContractFilled = data?.content && data.content.trim() !== "";
    var html =
        `<div class="modal right-slide-modal fade show" id="addTeacherContractModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel1">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header py-2 bg-primary text-white">
                        <h5 class="modal-title">Add Contract</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true"><i class="fa fa-times" aria-hidden="true"></i></span>
                        </button>
                    </div>
                    <div class="modal-body overflow-auto">
                        <form autocomplete="off" id="teacherContractForm">
                            <input type="hidden" id="contractId" value="${contractId}">
                            <h6 class="font-weight-bold mb-2">Contract Details</h6>
                            <div class="border border-primary rounded p-3 mb-3 bg-light-primary mb-3">
                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Reference Number</label>
                                        <input type="text" class="form-control" id="referenceNumber" value="${data.agreementRefNumber || ''}">
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Contract Creation Date</label>
                                        <input type="text" class="form-control" id="contractDate" value="${contractDate}" readonly onkeydown="return false" disabled>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Role Type</label>
                                        <select class="form-control" id="roleType" disabled>
                                            <option value="Teacher">Teacher</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <h6 class="font-weight-bold mb-2">First Party Representative Details</h6>
                            <div class="border border-primary rounded p-3 mb-3 bg-light-primary mb-3">
                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Name</label>
                                        <input type="text" class="form-control" id="firstPartyName" value="Alwin Sabu">
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Designation</label>
                                        <input type="text" class="form-control" id="firstPartyDesignation" value="Associate Director">
                                    </div>
                                </div>
                            </div>

                            <h6 class="font-weight-bold mb-2">Second Party Representative Details</h6>
                            <div class="border border-primary rounded p-3 mb-3 bg-light-primary mb-3">
                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Name</label>
                                        <input type="text" class="form-control" value="${data.name || name || ''}" id="teacherName" ${name || data.name ? "disabled" : ""}>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Email</label>
                                        <input type="email" class="form-control" value="${email || ''}" id="teacherEmail" ${email ? "disabled" : ""}>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Teacher's Designation</label>
                                        <input type="text" class="form-control" id="teacherDesignation" value="${data?.designation || ''}">
                                    </div>
									<div class="form-group col-md-3 col-12">
                                        <label>Employment Type</label>
                                        <select class="form-control" id="employmentType">
                                            <option value="">Select Employment Type</option>
                                            <option value="Part-Time" ${data.employeeType === 'Part-Time' ? 'selected' : ''}>Part-Time</option>
                                            <option value="Full-Time" ${data.employeeType === 'Full-Time' ? 'selected' : ''}>Full-Time</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Agreed Working Hours per Month</label>
                                        <input type="text" class="form-control" id="workingHours" onkeydown="return M.digit(event);" maxlength="3" value="${data?.workingHours || ''}">
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Admin Task Hours per Month</label>
                                        <input type="text" class="form-control" id="adminHours" onkeydown="return M.digit(event);" maxlength="3" value="${data?.admintTaskHours || ''}">
                                    </div>
									<div class="form-group col-md-4 col-12" id="specializationWrapper">
                                        <label>Course Specialization</label>
                                        <select class="form-control" id="specialization" multiple>
                                            <option value="">Select</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="form-row">
									<div class="form-group col-md-3 col-12">
                                        <label>Nationality</label>
                                        <select class="form-control" id="teacherNationality" onchange="preSelectCurrency(this);"></select>
                                    </div>
									<div class="form-group col-md-1 col-12">
                                        <label>Currency</label>
                                        <select class="form-control" id="teacherCurrency" disabled>
											<option value="USD" selected>USD</option>
											<option value="INR">INR</option>
										</select>
                                    </div>
                                    <div class="form-group col-md-2 col-12">
                                        <label>Monthly Salary</label>
                                        <input type="text" class="form-control" id="monthlySalary" onkeydown="return M.digit(event);" value="${data?.payOut || ''}">
                                    </div>
                                    <div class="form-group col-md-4 col-12">
                                        <label>Working Days</label>
                                        <div id="workingDaysContainer"></div>
                                    </div>
                                </div>
								
                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Country</label>
                                        <select class="form-control" id="teacherContractCountry"></select>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>State / Province</label>
                                        <select class="form-control" id="teacherContractState"></select>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>City</label>
                                        <select class="form-control" id="teacherContractCity"></select>
                                    </div>
                                </div>
                            </div>

                            <h6 class="font-weight-bold mb-2">Contract Duration</h6>
                            <div class="border border-primary rounded p-3 mb-3 bg-light-primary mb-3">
                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Starting Date of Contract</label>
                                        <input
                                            onchange="calculateEndDate(
                                                'teacherContractForm',
                                                'contractStartDate',
                                                'contractDuration',
                                                'contractEndDate',
                                                'YEAR'
                                            )"
                                            type="text" class="form-control" id="contractStartDate" readonly onkeydown="return false" value="${contractDate}"
                                        >
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Contract Duration</label>
                                        <select 
                                            onchange="calculateEndDate(
                                                'teacherContractForm',
                                                'contractStartDate',
                                                'contractDuration',
                                                'contractEndDate',
                                                'YEAR'
                                            )"
                                            class="form-control" id="contractDuration"
                                        >
                                            <option value="0">Select Duration</option>
                                            <option value="1" ${data.contractDurationYears == 1 ? 'selected' : ''}>1 Year</option>
                                            <option value="2" ${data.contractDurationYears == 2 ? 'selected' : ''}>2 Years</option>
                                            <option value="3" ${data.contractDurationYears == 3 ? 'selected' : ''}>3 Years</option>
                                            <option value="4" ${data.contractDurationYears == 4 ? 'selected' : ''}>4 Years</option>
                                            <option value="5" ${data.contractDurationYears == 5 ? 'selected' : ''}>5 Years</option>
                                            <option value="6" ${data.contractDurationYears == 6 ? 'selected' : ''}>6 Years</option>
                                            <option value="7" ${data.contractDurationYears == 7 ? 'selected' : ''}>7 Years</option>
                                            <option value="8" ${data.contractDurationYears == 8 ? 'selected' : ''}>8 Years</option>
                                            <option value="9" ${data.contractDurationYears == 9 ? 'selected' : ''}>9 Years</option>
                                            <option value="10" ${data.contractDurationYears == 10 ? 'selected' : ''}>10 Years</option>
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Effective End Date</label>
                                        <input type="text" class="form-control" id="contractEndDate" readonly onkeydown="return false" disabled>
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div id="teacherContractCommentData"></div>
                                </div>
                                <div class="form-row">
                                    <div style="flex:1;">
                                        ${/*<label class="font-weight-bold d-block mb-2">Upload Your Signature</label>
                                        <div class="custom-file" style="max-width: 400px;">
                                            <input type="file" class="custom-file-input" id="recipientSignatureUpload" accept="image/*" onchange="signatureTableTeacher('teacherContractForm'); handleRecipientSignatureUpload(this, 'leftSignatureBox'); updateFileName(this); handleFileInputCancel('teacherContractForm', 'recipientSignatureUpload', 'leftSignatureBox');" ${isContractFilled ? 'disabled' : ''}>
                                            <label class="custom-file-label text-truncate" for="recipientSignatureUpload">Choose file...</label>
                                        </div>
                                        <small class="form-text text-danger font-12 mt-1" style="max-width: 75%;">
                                            Please upload your signature image (PNG/JPG only, white/transparent background, max size: 300KB).
                                        </small>*/''}
										<label class="font-weight-bold d-block mb-2">Signature</label>
										<button id="uploadTeacherSignatureBtn" type="button" class="btn btn-primary" onclick="insertTeacherSignature('teacherContractForm')">Upload Signature</button>
										<button id="previewTeacherContractBtn" type="button" class="btn btn-success" style="display: none;" onclick="previewContractPdf('TEACHER');">Preview Contract</button>
                                    </div>
                                </div>
                            </div>

                            <h6 class="font-weight-bold mb-2">Set the Validity for Offer of Acceptance</h6>
                            <div class="border border-primary rounded p-3 mb-3 bg-light-primary mb-3">
                                <div class="form-row">
                                    <div class="form-group col-md-3 col-12">
                                        <label>Starting Date of Validity</label>
                                        <input
                                            onchange="calculateEndDate(
                                                'teacherContractForm',
                                                'contractValidityStartDate',
                                                'contractValidityDuration',
                                                'contractValidityEndDate',
                                                'DAY'
                                            )"
                                            type="text" class="form-control" id="contractValidityStartDate" readonly onkeydown="return false" value="${validityStartDate}"
                                        >
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Valid Till (Days)</label>
                                        <select
                                            onchange="calculateEndDate(
                                                'teacherContractForm',
                                                'contractValidityStartDate',
                                                'contractValidityDuration',
                                                'contractValidityEndDate',
                                                'DAY'
                                            )"
                                            class="form-control" id="contractValidityDuration">
                                            <option value="0">Select Days</option>
                                            ${dayOptions}
                                        </select>
                                    </div>
                                    <div class="form-group col-md-3 col-12">
                                        <label>Effective Validity End Date</label>
                                        <input type="text" class="form-control" id="contractValidityEndDate" readonly onkeydown="return false" disabled value="${validityEndDate}">
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div class="d-flex justify-content-end gap-10">
                            <button type="button" class="btn btn-success" onclick="saveTeacherContract('teacherContractForm', '${userId}');">Save Draft</button>
                            <button type="button" class="btn btn-primary" id="publishTeacherContractBtn" data-contract-Id="" onclick="publishTeacherContract('teacherContractForm', '${userId}');" style="display: ${isContractFilled ? 'block' : 'none'};">Initiate Contract</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
    return html;
}