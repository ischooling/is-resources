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
					<th>User Name</th>
					<th>Status</th>
					<th class="text-center">Demo Video</th>
					<th class="text-center">Action</th>
					<th class="text-center">View Profile</th>
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