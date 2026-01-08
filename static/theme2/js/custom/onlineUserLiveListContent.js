
async function renderOnlineUserListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	var html=await getOnlineUserLiveListContent(title);
    $('#dashboardContentInHTML').html(html);
    getOnlineLiveUserList('onlineUser',ROLE_MODULE.moduleId, 0);
   
}

function getOnlineUserLiveListContent(title){
	var html=`<div class="app-page-title mb-3 py-2">
				<div class="page-title-wrapper">
					<div class="page-title-heading">
					<div class="page-title-icon"> <i class="fas fa-user-cog text-primary"></i></div>
						<div>${title}</div>
					</div>
				</div>
			</div>`;
	html+=getOnlineUserLiveContentCard();
	return html;
}

function getOnlineUserLiveContentCard(){
        var html = `<div class="main-card mt-3 mb-3 card body-tabs-shadow">
			<div class="card-body" >
				<div style="width: 100%; display:inline-block">
					${getOnlineUserLiveContentList()}
				</div>
			</div>
		</div>`;
 return html;
}


function getOnlineUserLiveContentList(){
        var html = `<table class="table table-bordered table-striped responsive nowrap" id="onlineUserLiveListTable" style="width:100%;" >
                        <thead>
                            <tr class="bg-primary text-white">
                                <th style="text-align:center;font-weight:bold">S.No</th>
                                <th style="font-weight:bold">User Name</th>
                                <th style="font-weight:bold">Grade</th>
                                <th style="font-weight:bold">Role Type</th>
                                <th style="font-weight:bold">User Id</th>
                                <th style="font-weight:bold">User Email</th>
                                <th style="font-weight:bold">Login Time</th>
                                <th style="text-align:center;font-weight:bold">Online</th>
                            </tr>
                        </thead>
                        <tbody id="onlineUserLiveListbody"></tbody>
                    </table>`;
        return html;
}
