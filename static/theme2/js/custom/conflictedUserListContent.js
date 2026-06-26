async function renderConflictedUserListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getConflictedUserListContent(title);
    $('#dashboardContentInHTML').html(html);
    getConflictedUserList('conflictedUser',ROLE_MODULE.moduleId, 0);
   
}

function getConflictedUserListContent(title){
	var html=`
	
	<div class="app-page-title mb-3 py-2">
				<div class="page-title-wrapper">
					<div class="page-title-heading">
					<div class="page-title-icon"> <i class="fas fa-user-cog text-primary"></i></div>
						<div>${title}</div>
					</div>
				</div>
			</div>`;
	html+=getConflictedUserContentCard();
	return html;
}

function getConflictedUserContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getConflictedUserContentList()}
				</div>
			</div>
		</div>`;
 return html;
}


function getConflictedUserContentList(){
        var html = `<table class="table table-bordered table-striped responsive" id="conflictedUserListTable" style="width:100%;" >
                        <thead>
                            <tr class="bg-primary text-white">
                            <th style="text-align:center;font-weight:bold">S.No</th>
                            <th style="font-weight:bold">Email</th>
                            <th style="font-weight:bold">Student Id</th>
                            <th style="font-weight:bold">Role Type</th>
                            <th style="font-weight:bold;white-space:normal;min-width:130px;">Created Date</th>
                            <th style="font-weight:bold;white-space:normal;min-width:130px;">Updated Date</th>
                            <th style="font-weight:bold">Status</th>
                            ${SCHOOL_ID==1?'<th>Action</th>':''}
						    </tr>
                        </thead>
                        <tbody id="conflictedUserListBody"></tbody>
                    </table>`;
        return html;
}
