
async function renderOnlineUserListDashboard(title,roleAndModule, SCHOOL_ID, USER_ID,USER_ROLE){
	ROLE_MODULE=roleAndModule;
	ouInjectCss();
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
	html+=getOnlineUserLiveFilterBar();
	html+=getOnlineUserLiveResultCount();
	html+=getOnlineUserLiveContentCard();
	return html;
}

/* ---------- Standard filter bar (Role | Country | Grade | Timezone From/To | Online hours) ---------- */
function getOnlineUserLiveFilterBar(){
	var html=`<div class="main-card mb-3 card">
		<div class="card-body ou-filters custom-field-scope">
			<form id="ouFilterForm">
			<div class="ou-filter-grid">
				<div class="custom-field">
					<label>Role</label>
					<select class="form-control" id="ouFilterRole"><option value="">All Roles</option></select>
				</div>
				<div class="custom-field">
					<label>Country</label>
					<select class="form-control" id="ouFilterCountry"><option value="">All Countries</option></select>
				</div>
				<div class="custom-field">
					<label>Grade</label>
					<select class="form-control" id="ouFilterGrade"><option value="">All Grades</option></select>
				</div>
				<div class="custom-field">
					<label>Timezone</label>
					<select class="form-control" id="ouFilterTimezone"><option value="">All Timezones</option></select>
				</div>
				<div class="custom-field">
					<label>Online Between - Start Hour</label>
					<input type="number" min="0" max="23" class="form-control" id="ouFilterHourStart" placeholder="0-23">
				</div>
				<div class="custom-field">
					<label>Online Between - End Hour</label>
					<input type="number" min="0" max="23" class="form-control" id="ouFilterHourEnd" placeholder="0-23">
				</div>
			</div>
			<div class="ou-filter-actions">
				<button type="button" class="btn btn-outline-secondary btn-sm" id="ouFilterReset">Reset</button>
				<button type="button" class="btn btn-primary btn-sm" id="ouFilterApply">Apply Filters</button>
			</div>
			</form>
		</div>
	</div>`;
	return html;
}

function getOnlineUserLiveResultCount(){
	return `<div class="mb-2"><span class="ou-result-count" id="ouResultCount"></span></div>`;
}

function getOnlineUserLiveContentCard(){
        var html = `<div class="main-card mt-1 mb-3 card body-tabs-shadow" id="ouTableWrap">
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
                                <th style="font-weight:bold">User Details</th>
                                <th style="font-weight:bold">Location</th>
                                <th style="font-weight:bold">Logged In Details</th>
                            </tr>
                        </thead>
                        <tbody id="onlineUserLiveListbody"></tbody>
                    </table>`;
        return html;
}

function ouInjectCss(){
	if ($('#ouOnlineUserCss').length) { return; }
	$('head').append('<style id="ouOnlineUserCss">' +
	'.ou-filter-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:10px;}' +
	'@media (max-width:1100px){.ou-filter-grid{grid-template-columns:repeat(2,1fr);}}' +
	'.ou-filters.custom-field-scope .custom-field{position:relative;margin-bottom:0;}' +
	'.ou-filters.custom-field-scope .custom-field label{display:block;font-size:11px;color:#6b7280;margin-bottom:3px;font-weight:600;}' +
	'.ou-filters.custom-field-scope .custom-field select,.ou-filters.custom-field-scope .custom-field input{height:34px;border:1px solid #d7dfec;border-radius:8px;background-color:#fff;color:#111827;box-shadow:none;}' +
	'.ou-filters.custom-field-scope .custom-field select:focus,.ou-filters.custom-field-scope .custom-field input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12);}' +
	'.ou-filter-actions{display:flex;justify-content:flex-end;gap:8px;}' +
	'.ou-result-count{font-size:12px;color:#6b7280;}' +
	/* User Details cell */
	'.ou-stu-cell{display:flex;align-items:center;gap:10px;}' +
	'.ou-stu-avatar{width:40px;height:40px;border-radius:50%;background:#dbe4f3;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#1d4ed8;flex-shrink:0;overflow:hidden;}' +
	'.ou-stu-avatar img{width:100%;height:100%;border-radius:50%;object-fit:cover;}' +
	'.ou-stu-name{font-weight:600;display:flex;align-items:center;gap:6px;}' +
	'.ou-stu-role{font-size:11px;color:#6b7280;}' +
	'.ou-live-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#16a34a;}' +
	'.ou-off-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:#dc2626;}' +
	'.ou-live-txt{font-size:11px;color:#16a34a;font-weight:600;}' +
	'.ou-off-txt{font-size:11px;color:#dc2626;font-weight:600;}' +
	/* Location cell */
	'.ou-loc-country{font-weight:600;}' +
	'.ou-loc-tz{font-size:11px;color:#6b7280;}' +
	/* Logged-in cell */
	'.ou-login-time{font-weight:600;}' +
	'.ou-login-dur{font-size:11px;color:#6b7280;}' +
	'.ou-muted{color:#9ca3af;}' +
	'</style>');
}
